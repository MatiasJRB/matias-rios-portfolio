import type { Locale } from "@/i18n/config";

export type PortfolioEraId =
  | "2019"
  | "2021"
  | "2022"
  | "2024"
  | "2025-04"
  | "2025-12"
  | "2026-03"
  | "2026";

type LocalizedText = {
  en: string;
  es: string;
};

type ArchiveSource = {
  kind: "archive";
  commit: string;
  path: string;
  localized: boolean;
};

type CurrentSource = {
  kind: "current";
};

export interface PortfolioEra {
  id: PortfolioEraId;
  year: string;
  timelineLabel: LocalizedText;
  date: LocalizedText;
  name: LocalizedText;
  note: LocalizedText;
  stack: string[];
  accent: string;
  source: ArchiveSource | CurrentSource;
}

export const PORTFOLIO_ERAS: PortfolioEra[] = [
  {
    id: "2019",
    year: "2019",
    timelineLabel: { en: "2019", es: "2019" },
    date: { en: "December 2019", es: "Diciembre de 2019" },
    name: { en: "The first version", es: "La primera versión" },
    note: {
      en: "A hand-built introduction in HTML, CSS and JavaScript. This is where it all started.",
      es: "Una presentación hecha a mano en HTML, CSS y JavaScript. Todo arrancó acá.",
    },
    stack: ["HTML", "CSS", "JavaScript"],
    accent: "#ffffff",
    source: {
      kind: "archive",
      commit: "697f264",
      path: "/time-machine/eras/2019/index.html",
      localized: false,
    },
  },
  {
    id: "2021",
    year: "2021",
    timelineLabel: { en: "2021", es: "2021" },
    date: { en: "June 2021", es: "Junio de 2021" },
    name: { en: "My Quasar phase", es: "Mi etapa Quasar" },
    note: {
      en: "I turned the portfolio into an app: more structure, more detail and a lot more yellow.",
      es: "Convertí el portfolio en una app: más estructura, más información y bastante amarillo.",
    },
    stack: ["Vue", "Quasar", "Sass"],
    accent: "#f2e94e",
    source: {
      kind: "archive",
      commit: "af3d126",
      path: "/time-machine/eras/2021/index.html#/",
      localized: false,
    },
  },
  {
    id: "2022",
    year: "2022",
    timelineLabel: { en: "2022", es: "2022" },
    date: { en: "December 2022", es: "Diciembre de 2022" },
    name: { en: "The portrait portfolio", es: "El portfolio del retrato" },
    note: {
      en: "A more visual identity, still built with Quasar, centered on who I was and what I did.",
      es: "Una identidad más visual, todavía en Quasar, con el foco puesto en quién era y qué hacía.",
    },
    stack: ["Vue", "Quasar", "Firebase"],
    accent: "#f4d35e",
    source: {
      kind: "archive",
      commit: "95e86b5",
      path: "/time-machine/eras/2022/index.html#/",
      localized: false,
    },
  },
  {
    id: "2024",
    year: "2024",
    timelineLabel: { en: "2024", es: "2024" },
    date: { en: "June 2024", es: "Junio de 2024" },
    name: { en: "Version three", es: "La versión V3" },
    note: {
      en: "I separated content from presentation with reusable components and structured resume data.",
      es: "Separé contenido y presentación con componentes reutilizables y el CV convertido en datos.",
    },
    stack: ["Vue", "Quasar", "JSON Resume"],
    accent: "#6de5a2",
    source: {
      kind: "archive",
      commit: "a103447",
      path: "/time-machine/eras/2024/index.html#/",
      localized: false,
    },
  },
  {
    id: "2025-04",
    year: "2025",
    timelineLabel: { en: "Apr 25", es: "Abr 25" },
    date: { en: "April 2025", es: "Abril de 2025" },
    name: { en: "The move to Next.js", es: "El salto a Next.js" },
    note: {
      en: "The first production React and Next.js version. The stack started to look like today's.",
      es: "La primera versión productiva en React y Next.js. El stack empezó a parecerse al de hoy.",
    },
    stack: ["Next.js 15", "React 19", "Tailwind"],
    accent: "#879fff",
    source: {
      kind: "archive",
      commit: "08f6d11",
      path: "/time-machine/eras/2025-04/index.html",
      localized: false,
    },
  },
  {
    id: "2025-12",
    year: "2025",
    timelineLabel: { en: "Dec 25", es: "Dic 25" },
    date: { en: "December 2025", es: "Diciembre de 2025" },
    name: { en: "The interactive portfolio", es: "El portfolio interactivo" },
    note: {
      en: "I added languages, motion and more expressive navigation without losing the professional story.",
      es: "Sumé idiomas, movimiento y una navegación más expresiva sin perder la historia profesional.",
    },
    stack: ["Next.js 15", "i18n", "Motion"],
    accent: "#63d995",
    source: {
      kind: "archive",
      commit: "ed6404f",
      path: "/time-machine/eras/2025-12",
      localized: true,
    },
  },
  {
    id: "2026-03",
    year: "2026",
    timelineLabel: { en: "Mar 26", es: "Mar 26" },
    date: { en: "March 2026", es: "Marzo de 2026" },
    name: { en: "Projects take the lead", es: "Los proyectos toman el frente" },
    note: {
      en: "The work stopped being a list: projects began carrying the story.",
      es: "El trabajo dejó de ser una lista: los proyectos empezaron a contar la historia.",
    },
    stack: ["Next.js 15", "TypeScript", "Projects"],
    accent: "#79cbb0",
    source: {
      kind: "archive",
      commit: "c43f2f0",
      path: "/time-machine/eras/2026-03",
      localized: true,
    },
  },
  {
    id: "2026",
    year: "2026",
    timelineLabel: { en: "Today", es: "Hoy" },
    date: { en: "Today", es: "Hoy" },
    name: { en: "The portfolio today", es: "El portfolio actual" },
    note: {
      en: "The version you're seeing today: a technical field journal focused on decisions, evidence and shipped work.",
      es: "La versión que estás viendo hoy: una bitácora técnica con más foco en decisiones, evidencia y proyectos.",
    },
    stack: ["Next.js 16", "React 19", "AI"],
    accent: "#79cbb0",
    source: { kind: "current" },
  },
];

export function getPortfolioEraUrl(era: PortfolioEra, lang: Locale) {
  if (era.source.kind === "current") {
    return `/${lang}/time-machine-preview`;
  }

  if (era.source.localized) {
    return `${era.source.path}/${lang}/index.html`;
  }

  return era.source.path;
}
