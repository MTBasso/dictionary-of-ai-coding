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
  /** Strings for the graph explorer at the site root. */
  ui: {
    /** Link from the explorer to the flat, scrollable page. */
    reference: string;
    /** Title of the flat page. */
    referenceTitle: string;
    /** Link from the flat page back to the explorer. */
    explorer: string;
    /** Shown in the reading pane before anything is opened. */
    welcomeTitle: string;
    welcomeBody: string;
    /** "%read% of %total% read" — both placeholders are substituted. */
    progress: string;
    reset: string;
    resetConfirm: string;
    search: string;
    noResults: string;
    /** Tooltip on a node's hidden-neighbour badge. */
    expand: string;
    /** Heading above the related-entry list in the reading pane. */
    related: string;
    /** Marks an entry the reader has already opened. */
    read: string;
    recenter: string;
    /** Heading above the section legend. */
    legend: string;
    /** Welcome action. %section% is replaced with the first section's name. */
    startAction: string;
    /** Marks a section whose entries have all been read. */
    sectionDone: string;
    /** Shown in the centre when every entry has been read. */
    allDone: string;
    /** Shown to readers without JavaScript. */
    noscript: string;
    /** Header byline, followed by a link to Matt Pocock. */
    creditBy: string;
    /** Footer credit. %matt%, %site% and %github% are replaced with links. */
    creditFooter: string;
    /** Shown once after an automatic switch to this language. */
    switched: string;
    switchedAction: string;
  };
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
    ui: {
      reference: "Reference",
      referenceTitle: "AI Coding Dictionary — Reference",
      explorer: "Explorer",
      welcomeTitle: "Start here",
      welcomeBody:
        "This is the dictionary as a web. Open an entry on the left and the terms it connects to appear around it. Read those, and the web keeps growing — so you meet each term next to the ones that explain it, instead of all 69 at once.",
      progress: "%read% of %total% read",
      reset: "Reset",
      resetConfirm:
        "Clear your reading progress and collapse the web back to the start?",
      search: "Search entries",
      noResults: "No entries match",
      expand: "Show connected entries",
      related: "Connects to",
      read: "read",
      recenter: "Recenter",
      legend: "Sections",
      startAction: "Start with %section%",
      sectionDone: "done",
      allDone: "All read",
      noscript:
        "This view needs JavaScript. The full dictionary is readable as a single page in the Reference.",
      creditBy: "Dictionary by",
      creditFooter:
        "Every definition here is written by %matt%, whose original lives at %site%. This bilingual, explorable build is on %github%.",
      switched: "Showing English, matching your browser.",
      switchedAction: "Stay in English",
    },
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
    ui: {
      reference: "Referência",
      referenceTitle: "Dicionário de Programação com IA — Referência",
      explorer: "Explorador",
      welcomeTitle: "Comece por aqui",
      welcomeBody:
        "Este é o dicionário como uma teia. Abra uma entrada à esquerda e os termos ligados a ela aparecem em volta. Leia esses termos e a teia continua crescendo — assim você encontra cada termo ao lado dos que o explicam, em vez de todos os 69 de uma vez.",
      progress: "%read% de %total% lidas",
      reset: "Recomeçar",
      resetConfirm:
        "Apagar seu progresso de leitura e recolher a teia até o início?",
      search: "Buscar entradas",
      noResults: "Nenhuma entrada encontrada",
      expand: "Mostrar entradas conectadas",
      related: "Conecta com",
      read: "lida",
      recenter: "Recentralizar",
      legend: "Seções",
      startAction: "Começar por %section%",
      sectionDone: "concluída",
      allDone: "Tudo lido",
      noscript:
        "Esta visualização precisa de JavaScript. O dicionário completo pode ser lido em página única na Referência.",
      creditBy: "Dicionário de",
      creditFooter:
        "Todas as definições daqui são escritas por %matt%, e o original está em %site%. Esta versão bilíngue e navegável está no %github%.",
      switched: "Mostrando português, seguindo o idioma do seu navegador.",
      switchedAction: "Continuar em português",
    },
  },
];

export function localeById(id: LocaleId): Locale {
  const found = LOCALES.find((l) => l.id === id);
  if (!found) throw new Error(`Unknown locale: ${id}`);
  return found;
}
