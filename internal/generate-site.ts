#!/usr/bin/env -S npx tsx
// Generate the static site into site/ from internal/Curriculum.md,
// dictionary/*.md, dictionary-pt-BR/*.md and internal/site/*.
//
// The Curriculum.md parsing below is deliberately duplicated from
// generate-readme.ts rather than factored into a shared module: this repo is a
// fork, and leaving the upstream generator untouched keeps merges from
// mattpocock/dictionary-of-ai-coding conflict-free.

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmSync,
  cpSync,
} from "node:fs";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Marked } from "marked";
import { LOCALES, type Locale } from "./site/i18n.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(HERE);
const SITE_SRC = join(HERE, "site");
const OUTPUT = join(ROOT, "site");
const CURRICULUM = join(HERE, "Curriculum.md");

const SECTION_RE = /^## Section \d+ — .+$/;
const BULLET_RE = /^- (.+)$/;
const LINK_RE = /\[([^\]]+)\]\(\.\/([^)]+)\.md\)/g;

type Section = { heading: string; terms: string[] };
type Entry = { term: string; slug: string; html: string; translated: boolean };
type RenderedSection = { heading: string; entries: Entry[] };

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

// Mirrors GitHub's heading slugger so anchors match the README's.
function headingSlug(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^\p{L}\p{N} -]/gu, "")
    .replace(/ /g, "-");
}

function parseCurriculum(text: string): Section[] {
  const sections: Section[] = [];
  let current: Section | null = null;

  text.split("\n").forEach((raw, idx) => {
    const lineNo = idx + 1;
    const line = raw.trimEnd();
    if (line === "") return;

    if (line.startsWith("## ")) {
      if (!SECTION_RE.test(line)) {
        fail(`Curriculum.md:${lineNo}: bad section heading: ${line}`);
      }
      current = { heading: line.slice(3), terms: [] };
      sections.push(current);
      return;
    }

    if (line.startsWith("- ")) {
      if (!current) fail(`Curriculum.md:${lineNo}: bullet before any section`);
      const m = line.match(BULLET_RE);
      if (!m || !m[1])
        fail(`Curriculum.md:${lineNo}: malformed bullet: ${line}`);
      current.terms.push(m[1]);
      return;
    }

    fail(`Curriculum.md:${lineNo}: unexpected line: ${line}`);
  });

  return sections;
}

function stripFrontmatter(body: string): string {
  if (!body.startsWith("---\n")) return body;
  const end = body.indexOf("\n---\n", 4);
  if (end === -1) return body;
  return body.slice(end + 5).replace(/^\n+/, "");
}

// Entry-to-entry links become in-page anchors. Targets are shared across
// locales, so the same fragment resolves in either language.
function rewriteLinks(body: string): string {
  return body.replace(LINK_RE, (_full, text: string, target: string) => {
    return `[${text}](#${headingSlug(decodeURIComponent(target))})`;
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const md = new Marked({ gfm: true });

function renderMarkdown(source: string): string {
  const out = md.parse(source, { async: false });
  // Keep wide tables inside their own scroll box so the page never scrolls
  // horizontally on narrow screens.
  return out.replace(
    /<table>[\s\S]*?<\/table>/g,
    (t) => `<div class="table-scroll">${t}</div>`
  );
}

function readEntry(locale: Locale, term: string, fallback: Locale): Entry {
  const slug = headingSlug(term);
  const path = join(ROOT, locale.dictDir, `${term}.md`);

  if (existsSync(path)) {
    const body = rewriteLinks(stripFrontmatter(readFileSync(path, "utf8")));
    return {
      term,
      slug,
      html: renderMarkdown(body.trimEnd()),
      translated: true,
    };
  }

  const fallbackPath = join(ROOT, fallback.dictDir, `${term}.md`);
  if (!existsSync(fallbackPath)) {
    fail(`Curriculum.md references "${term}" but ${fallbackPath} is missing`);
  }
  const body = rewriteLinks(
    stripFrontmatter(readFileSync(fallbackPath, "utf8"))
  );
  const note = `<p class="untranslated">${escapeHtml(locale.untranslated)}</p>`;
  return {
    term,
    slug,
    html: note + renderMarkdown(body.trimEnd()),
    translated: false,
  };
}

/* ---------------- graph ---------------- */

type GraphNode = {
  id: string;
  term: string;
  slug: string;
  section: string;
  /** Index of the owning section, 0-based — which wedge the entry sits in. */
  sectionIndex: number;
  /** Position within the section, in curriculum order — which slot it takes. */
  orderInSection: number;
  /** Neighbour ids, best first. Reveal order in the explorer. */
  neighbors: string[];
};

type GraphSection = {
  index: number;
  /** Full heading, e.g. "Section 3 — Tools & Environment". */
  label: string;
  /** Heading with the "Section N — " prefix removed, for the legend. */
  shortLabel: string;
  count: number;
};

type Graph = {
  nodes: GraphNode[];
  sections: GraphSection[];
  edges: [string, string, number][];
};

const ENTRY_LINK_RE = /\[[^\]]+\]\(\.\/([^)]+)\.md\)/g;

function pairKey(a: string, b: string): string {
  return a < b ? `${a}\u0000${b}` : `${b}\u0000${a}`;
}

// Cross-references between entries, as an undirected weighted graph.
// Weight is how many times the two entries link to each other; because the
// repo links only the first occurrence of a term, that is 1 or 2, so it is a
// coarse signal and curriculum order does most of the ranking work.
function buildGraph(
  locale: Locale,
  sections: RenderedSection[],
  fallback: Locale
): Graph {
  const order: string[] = [];
  const sectionOf = new Map<string, string>();
  const sectionIndexOf = new Map<string, number>();
  const orderInSectionOf = new Map<string, number>();
  sections.forEach((s, si) => {
    s.entries.forEach((e, ei) => {
      order.push(e.term);
      sectionOf.set(e.term, s.heading);
      sectionIndexOf.set(e.term, si);
      orderInSectionOf.set(e.term, ei);
    });
  });
  const rank = new Map(order.map((t, i) => [t, i]));
  const weights = new Map<string, number>();

  for (const term of order) {
    // Read links from whichever file the locale actually rendered.
    let path = join(ROOT, locale.dictDir, `${term}.md`);
    if (!existsSync(path)) path = join(ROOT, fallback.dictDir, `${term}.md`);
    const body = stripFrontmatter(readFileSync(path, "utf8"));
    for (const m of body.matchAll(ENTRY_LINK_RE)) {
      const raw = m[1];
      if (!raw) continue;
      const target = decodeURIComponent(raw);
      if (target === term || !rank.has(target)) continue;
      const key = pairKey(term, target);
      weights.set(key, (weights.get(key) ?? 0) + 1);
    }
  }

  const adjacency = new Map<string, { id: string; weight: number }[]>(
    order.map((t) => [t, []])
  );
  const edges: [string, string, number][] = [];
  for (const [key, weight] of weights) {
    const [a, b] = key.split("\u0000") as [string, string];
    edges.push([a, b, weight]);
    adjacency.get(a)?.push({ id: b, weight });
    adjacency.get(b)?.push({ id: a, weight });
  }

  const nodes: GraphNode[] = order.map((term) => ({
    id: term,
    term,
    slug: headingSlug(term),
    section: sectionOf.get(term) ?? "",
    sectionIndex: sectionIndexOf.get(term) ?? 0,
    orderInSection: orderInSectionOf.get(term) ?? 0,
    neighbors: (adjacency.get(term) ?? [])
      // Stronger pairing first, then whichever comes earlier in the
      // curriculum — so foundations surface before the terms built on them.
      .sort(
        (x, y) =>
          y.weight - x.weight || (rank.get(x.id) ?? 0) - (rank.get(y.id) ?? 0)
      )
      .map((n) => n.id),
  }));

  // "Section 3 — Tools & Environment" -> "Tools & Environment". Both locales
  // use the em dash, so one rule covers them.
  const shorten = (heading: string): string => {
    const parts = heading.split("—");
    return (parts.length > 1 ? parts.slice(1).join("—") : heading).trim();
  };

  const graphSections: GraphSection[] = sections.map((s, i) => ({
    index: i,
    label: s.heading,
    shortLabel: shorten(s.heading),
    count: s.entries.length,
  }));

  return { nodes, sections: graphSections, edges };
}

// Embedded as JSON in a <script>; neutralise anything that could close it.
function jsonForScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function renderToc(locale: Locale, sections: RenderedSection[]): string {
  const blocks = sections
    .map((s) => {
      const items = s.entries
        .map(
          (e) =>
            `        <li><a href="#${e.slug}">${escapeHtml(e.term)}</a></li>`
        )
        .join("\n");
      return [
        "    <details>",
        `      <summary>${escapeHtml(s.heading)}</summary>`,
        "      <ul>",
        items,
        "      </ul>",
        "    </details>",
      ].join("\n");
    })
    .join("\n");

  return [
    '  <nav class="toc" aria-labelledby="toc-heading">',
    `    <h2 id="toc-heading">${escapeHtml(locale.tocHeading)}</h2>`,
    blocks,
    "  </nav>",
  ].join("\n");
}

function renderEntries(sections: RenderedSection[]): string {
  return sections
    .map((s) => {
      const heading = `  <h2 class="section-heading">${escapeHtml(s.heading)}</h2>`;
      const entries = s.entries
        .map((e) =>
          [
            `  <article class="entry" id="${e.slug}">`,
            `    <h3><a href="#${e.slug}">${escapeHtml(e.term)}</a></h3>`,
            e.html,
            "  </article>",
          ].join("\n")
        )
        .join("\n");
      return `${heading}\n${entries}`;
    })
    .join("\n");
}

const GLOBE_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
  '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/></svg>';
const SUN_ICON =
  '<svg class="icon-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
  '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const MOON_ICON =
  '<svg class="icon-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
  '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

/** Root-relative output path for each page, keyed by role. */
function pathFor(locale: Locale, role: "explorer" | "reference"): string {
  const localePart = locale.dirName === "" ? "" : `${locale.dirName}/`;
  return role === "explorer" ? localePart : `${localePart}reference/`;
}

/** Links from a page at `here` to the root-relative `target`. */
function linkTo(here: string, target: string): string {
  if (here === target) return "./";
  const depth = here === "" ? 0 : here.split("/").filter(Boolean).length;
  const base = "../".repeat(depth);
  return base + target || "./";
}

/** The <html> tag, carrying what head.js reads before first paint. */
function htmlOpen(
  locale: Locale,
  other: Locale,
  here: string,
  otherHere: string
): string {
  return `<html lang="${locale.id}" dir="ltr" data-locale="${locale.id}" data-alt-locale="${other.id}" data-alt-href="${linkTo(here, otherHere)}">`;
}

/** "Dictionary by Matt Pocock" — shown on every page, next to the wordmark. */
function byline(locale: Locale): string {
  return `<span class="byline">${escapeHtml(locale.ui.creditBy)} <a href="https://aicodingdictionary.com">Matt Pocock</a></span>`;
}

function head(
  locale: Locale,
  other: Locale,
  here: string,
  otherHere: string,
  title: string
): string {
  const headScript = readFileSync(join(SITE_SRC, "head.js"), "utf8");
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(locale.metaDescription)}">
<link rel="alternate" hreflang="${other.id}" href="${linkTo(here, otherHere)}">
<link rel="alternate" hreflang="${locale.id}" href="${linkTo(here, here)}">
<link rel="stylesheet" href="${linkTo(here, "assets/styles.css")}">
<script>${headScript}</script>`;
}

/** Header bar. `extra` sits to the left of the language and colours buttons. */
function header(
  locale: Locale,
  other: Locale,
  here: string,
  otherHere: string,
  homeHref: string,
  extra: string
): string {
  return `<header class="site-header">
  <div class="brand">
    <a class="wordmark" href="${homeHref}">${escapeHtml(locale.title)}</a>
    ${byline(locale)}
  </div>
  <nav class="controls">
    ${extra}
    <a class="btn lang-btn" href="${linkTo(here, otherHere)}" data-target-locale="${other.id}" hreflang="${other.id}" lang="${other.id}" title="${escapeHtml(locale.langLabel(other.endonym))}">
      ${GLOBE_ICON}<span>${escapeHtml(other.endonym)}</span>
    </a>
    <button class="btn theme-btn" type="button" title="${escapeHtml(locale.themeLabel)}" aria-label="${escapeHtml(locale.themeLabel)}">
      ${SUN_ICON}${MOON_ICON}<span>${escapeHtml(locale.themeLabel)}</span>
    </button>
  </nav>
</header>`;
}

function footer(locale: Locale): string {
  const credit = escapeHtml(locale.ui.creditFooter)
    .replace("%matt%", '<a href="https://aihero.dev">Matt Pocock</a>')
    .replace(
      "%site%",
      '<a href="https://aicodingdictionary.com">aicodingdictionary.com</a>'
    )
    .replace(
      "%github%",
      '<a href="https://github.com/MTBasso/dictionary-of-ai-coding">GitHub</a>'
    );
  return `<footer class="site-footer wrap">
  <p>${escapeHtml(locale.metaDescription)}</p>
  <p class="credit">${credit}</p>
</footer>`;
}

/** The graph explorer: the web on the left, the entry you opened on the right. */
function renderExplorer(
  locale: Locale,
  other: Locale,
  sections: RenderedSection[],
  graph: Graph
): string {
  const here = pathFor(locale, "explorer");
  const otherHere = pathFor(other, "explorer");
  const referenceHref = linkTo(here, pathFor(locale, "reference"));

  const entries: Record<string, string> = {};
  for (const s of sections) {
    for (const e of s.entries) entries[e.term] = e.html;
  }

  const payload = {
    locale: locale.id,
    nodes: graph.nodes,
    sections: graph.sections,
    edges: graph.edges,
    entries,
    ui: locale.ui,
  };

  const refLink = `<a class="btn" href="${referenceHref}">${escapeHtml(locale.ui.reference)}</a>`;

  return `<!doctype html>
${htmlOpen(locale, other, here, otherHere)}
<head>
${head(locale, other, here, otherHere, locale.title)}
</head>
<body class="explorer-body">
<div class="app">
${header(locale, other, here, otherHere, linkTo(here, here), refLink)}
  <div id="switched" class="switched" hidden>
    <span>${escapeHtml(locale.ui.switched)}</span>
    <button type="button" id="switched-ok">${escapeHtml(locale.ui.switchedAction)}</button>
  </div>
  <main class="explorer">
    <div class="web-pane">
      <aside class="legend" aria-label="${escapeHtml(locale.ui.legend)}">
        <h2>${escapeHtml(locale.ui.legend)}</h2>
        <ol>
${graph.sections
  .map(
    (s) =>
      `          <li><button type="button" data-section="${s.index}" class="sec sec-${s.index + 1}">` +
      `<span class="swatch" aria-hidden="true"></span>` +
      `<span class="name">${escapeHtml(s.shortLabel)}</span>` +
      `<span class="count" data-count="${s.index}">0/${s.count}</span>` +
      `</button></li>`
  )
  .join("\n")}
        </ol>
      </aside>
      <div class="canvas-wrap">
        <canvas id="web"></canvas>
      <div class="web-controls">
        <div class="search-wrap">
          <input id="search" type="search" autocomplete="off" placeholder="${escapeHtml(locale.ui.search)}" aria-label="${escapeHtml(locale.ui.search)}">
          <ul id="results" hidden></ul>
        </div>
      </div>
        <div class="web-status">
          <span id="progress"></span>
          <button type="button" id="recenter">${escapeHtml(locale.ui.recenter)}</button>
          <button type="button" id="reset">${escapeHtml(locale.ui.reset)}</button>
        </div>
      </div>
    </div>
    <div class="read-pane" id="pane">
      <noscript>
        <div class="noscript">${escapeHtml(locale.ui.noscript)}
          <p><a href="${referenceHref}">${escapeHtml(locale.ui.reference)}</a></p>
        </div>
      </noscript>
    </div>
  </main>
</div>
<script>window.__DICT__=${jsonForScript(payload)};</script>
<script src="${linkTo(here, "assets/app.js")}"></script>
<script src="${linkTo(here, "assets/graph.js")}"></script>
</body>
</html>
`;
}

/** The flat, scrollable page — every entry in curriculum order. */
function renderReference(
  locale: Locale,
  other: Locale,
  sections: RenderedSection[]
): string {
  const here = pathFor(locale, "reference");
  const otherHere = pathFor(other, "reference");
  const explorerHref = linkTo(here, pathFor(locale, "explorer"));
  const intro = renderMarkdown(
    readFileSync(join(SITE_SRC, `intro.${locale.id}.md`), "utf8")
  );
  const explorerLink = `<a class="btn" href="${explorerHref}">${escapeHtml(locale.ui.explorer)}</a>`;

  return `<!doctype html>
${htmlOpen(locale, other, here, otherHere)}
<head>
${head(locale, other, here, otherHere, locale.ui.referenceTitle)}
</head>
<body>
<a class="skip-link" href="#main-content">${escapeHtml(locale.skipToContent)}</a>
${header(locale, other, here, otherHere, explorerHref, explorerLink)}
<main id="main-content" class="wrap">
  <div class="hero">
    <h1>${escapeHtml(locale.title)}</h1>
${intro}
  </div>
  <hr>
${renderToc(locale, sections)}
  <hr>
${renderEntries(sections)}
</main>
${footer(locale)}
<script src="${linkTo(here, "assets/app.js")}"></script>
</body>
</html>
`;
}

function main(): void {
  const sections = parseCurriculum(readFileSync(CURRICULUM, "utf8"));
  const english = LOCALES[0];
  if (!english) fail("No locales configured");

  rmSync(OUTPUT, { recursive: true, force: true });
  mkdirSync(join(OUTPUT, "assets"), { recursive: true });
  for (const asset of ["styles.css", "app.js", "graph.js"]) {
    cpSync(join(SITE_SRC, asset), join(OUTPUT, "assets", asset));
  }

  for (const locale of LOCALES) {
    const other = LOCALES.find((l) => l.id !== locale.id) ?? locale;

    const rendered: RenderedSection[] = sections.map((s) => {
      const heading = locale.sections[s.heading];
      if (!heading)
        fail(`i18n.ts (${locale.id}): no translation for "${s.heading}"`);
      return {
        heading,
        entries: s.terms.map((t) => readEntry(locale, t, english)),
      };
    });

    const graph = buildGraph(locale, rendered, english);

    for (const role of ["explorer", "reference"] as const) {
      const dir = join(OUTPUT, pathFor(locale, role));
      mkdirSync(dir, { recursive: true });
      writeFileSync(
        join(dir, "index.html"),
        role === "explorer"
          ? renderExplorer(locale, other, rendered, graph)
          : renderReference(locale, other, rendered)
      );
    }

    const total = rendered.reduce((n, s) => n + s.entries.length, 0);
    const missing = rendered
      .flatMap((s) => s.entries)
      .filter((e) => !e.translated)
      .map((e) => e.term);
    const degree = (2 * graph.edges.length) / graph.nodes.length;
    console.log(
      `site/${pathFor(locale, "explorer").padEnd(8)} ${locale.id.padEnd(6)} ` +
        `${total - missing.length}/${total} entries, ` +
        `${graph.edges.length} links, avg degree ${degree.toFixed(1)}`
    );
    if (missing.length) console.log(`  untranslated: ${missing.join(", ")}`);
  }
}

main();
