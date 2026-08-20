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

function renderPage(
  locale: Locale,
  other: Locale,
  sections: RenderedSection[]
): string {
  // Root locale sits at site/, others at site/<dirName>/.
  const base = locale.dirName === "" ? "" : "../";
  const otherHref =
    other.dirName === "" ? `${base}` || "./" : `${base}${other.dirName}/`;
  const intro = renderMarkdown(
    readFileSync(join(SITE_SRC, `intro.${locale.id}.md`), "utf8")
  );
  const headScript = readFileSync(join(SITE_SRC, "head.js"), "utf8");

  return `<!doctype html>
<html lang="${locale.id}" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(locale.title)}</title>
<meta name="description" content="${escapeHtml(locale.metaDescription)}">
<link rel="alternate" hreflang="${other.id}" href="${otherHref}">
<link rel="alternate" hreflang="${locale.id}" href="${base === "" ? "./" : base}">
<link rel="stylesheet" href="${base}assets/styles.css">
<script>${headScript}</script>
</head>
<body>
<a class="skip-link" href="#main-content">${escapeHtml(locale.skipToContent)}</a>
<header class="site-header">
  <a class="wordmark" href="${base === "" ? "./" : base}">${escapeHtml(locale.title)}</a>
  <nav class="controls">
    <a class="btn lang-btn" href="${otherHref}" data-target-locale="${other.id}" hreflang="${other.id}" lang="${other.id}" title="${escapeHtml(locale.langLabel(other.endonym))}">
      ${GLOBE_ICON}<span>${escapeHtml(other.endonym)}</span>
    </a>
    <button class="btn theme-btn" type="button" title="${escapeHtml(locale.themeLabel)}" aria-label="${escapeHtml(locale.themeLabel)}">
      ${SUN_ICON}${MOON_ICON}<span>${escapeHtml(locale.themeLabel)}</span>
    </button>
  </nav>
</header>
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
<footer class="site-footer wrap">
  <p>${escapeHtml(locale.metaDescription)}</p>
  <p><a href="https://github.com/MTBasso/dictionary-of-ai-coding">GitHub</a> · <a href="https://aicodingdictionary.com">aicodingdictionary.com</a></p>
</footer>
<script src="${base}assets/app.js"></script>
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
  cpSync(join(SITE_SRC, "styles.css"), join(OUTPUT, "assets", "styles.css"));
  cpSync(join(SITE_SRC, "app.js"), join(OUTPUT, "assets", "app.js"));

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

    const dir = locale.dirName === "" ? OUTPUT : join(OUTPUT, locale.dirName);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), renderPage(locale, other, rendered));

    const total = rendered.reduce((n, s) => n + s.entries.length, 0);
    const missing = rendered
      .flatMap((s) => s.entries)
      .filter((e) => !e.translated)
      .map((e) => e.term);
    const where = locale.dirName === "" ? "site/" : `site/${locale.dirName}/`;
    console.log(
      `${where.padEnd(12)} ${locale.id.padEnd(6)} ${total - missing.length}/${total} entries`
    );
    if (missing.length) {
      console.log(`  untranslated: ${missing.join(", ")}`);
    }
  }
}

main();
