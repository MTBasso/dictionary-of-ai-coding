// Locale definitions for the generated site (internal/generate-site.ts).
//
// Entry names are deliberately NOT translated: the dictionary explains jargon
// that Brazilian developers meet in English inside their tools, so "Token" and
// "Context window" stay as the headings a reader can search for. The prose is
// translated; the Portuguese equivalent, where one is in common use, is given
// in the body of the entry itself.
//
// Because names are shared, both locales reuse internal/Curriculum.md for
// ordering, and only the section headings need translating here.

export type LocaleId = "en" | "pt-BR";

export type Locale = {
  /** Stable identifier, also the value of `lang` on <html>. */
  id: LocaleId;
  /** Subdirectory under the output root. Empty string means the site root. */
  dirName: string;
  /** Directory holding this locale's entries, relative to the repo root. */
  dictDir: string;
  /** Name of the language, in that language. Shown on the language button. */
  endonym: string;
  title: string;
  /** <meta name="description">. */
  metaDescription: string;
  tocHeading: string;
  /** Accessible name for the colours button. */
  themeLabel: string;
  /** Accessible name for the language button, naming the language it goes to. */
  langLabel: (target: string) => string;
  /** Shown in place of an entry that has no translation yet. */
  untranslated: string;
  skipToContent: string;
  /** Keyed by the English heading in Curriculum.md, e.g. "Section 1 — The Model". */
  sections: Record<string, string>;
};

const EN_SECTIONS = [
  "Section 1 — The Model",
  "Section 2 — Sessions, Context Windows & Turns",
  "Section 3 — Tools & Environment",
  "Section 4 — Failure Modes",
  "Section 5 — Handoffs",
  "Section 6 — Memory and Steering",
  "Section 7 — Patterns of Work",
] as const;

function identitySections(): Record<string, string> {
  return Object.fromEntries(EN_SECTIONS.map((s) => [s, s]));
}

export const LOCALES: Locale[] = [
  {
    id: "en",
    dirName: "",
    dictDir: "dictionary",
    endonym: "English",
    title: "AI Coding Dictionary",
    metaDescription: "AI coding jargon, explained in plain English.",
    tocHeading: "Table of contents",
    themeLabel: "Colours",
    langLabel: (target) => `Read in ${target}`,
    untranslated: "This entry has not been translated yet.",
    skipToContent: "Skip to content",
    sections: identitySections(),
  },
  {
    id: "pt-BR",
    dirName: "pt-BR",
    dictDir: "dictionary-pt-BR",
    endonym: "Português",
    title: "Dicionário de Programação com IA",
    metaDescription:
      "O jargão da programação com IA, explicado em português claro.",
    tocHeading: "Índice",
    themeLabel: "Cores",
    langLabel: (target) => `Ler em ${target}`,
    untranslated: "Esta entrada ainda não foi traduzida.",
    skipToContent: "Pular para o conteúdo",
    sections: {
      "Section 1 — The Model": "Seção 1 — O Modelo",
      "Section 2 — Sessions, Context Windows & Turns":
        "Seção 2 — Sessões, Janelas de Contexto e Turnos",
      "Section 3 — Tools & Environment": "Seção 3 — Ferramentas e Ambiente",
      "Section 4 — Failure Modes": "Seção 4 — Modos de Falha",
      "Section 5 — Handoffs": "Seção 5 — Handoffs",
      "Section 6 — Memory and Steering": "Seção 6 — Memória e Direcionamento",
      "Section 7 — Patterns of Work": "Seção 7 — Padrões de Trabalho",
    },
  },
];

export function localeById(id: LocaleId): Locale {
  const found = LOCALES.find((l) => l.id === id);
  if (!found) throw new Error(`Unknown locale: ${id}`);
  return found;
}
