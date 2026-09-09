import type { Locale } from "@/i18n/config";

export const FIRST_SOFTWARE_NOTE_SLUG =
  "la-primera-vez-que-alguien-dependio-de-que-mi-software-funcionara";

export interface NoteSection {
  heading?: string;
  paragraphs: string[];
}

export interface Note {
  slug: string;
  locale: Locale;
  draft: boolean;
  publishedAt: string;
  originYear: number;
  buildDays: number;
  readingMinutes: number;
  title: string;
  description: string;
  englishTitle: string;
  englishDescription: string;
  tags: string[];
  heroImage: string;
  heroAlt: string;
  heroCaption: string;
  sections: NoteSection[];
  pendingChecks: string[];
}

const notes: Note[] = [
  {
    slug: FIRST_SOFTWARE_NOTE_SLUG,
    locale: "es",
    draft: false,
    publishedAt: "2026-09-08",
    originYear: 2019,
    buildDays: 40,
    readingMinutes: 4,
    title: "La primera vez que alguien dependió de que mi software funcionara",
    description:
      "Mi primer software vendido no cambió mi carrera por su arquitectura, sino porque convirtió el código en una responsabilidad frente a una persona real.",
    englishTitle: "The first time someone depended on my software working",
    englishDescription:
      "My first paid software changed my relationship with code: it stopped being only an exercise and became a responsibility to a real person.",
    tags: ["Carrera", "Primeros proyectos", "Producto"],
    heroImage: "/images/notes/first-inventory-app.jpg",
    heroAlt:
      "Captura histórica de la aplicación de escritorio con accesos a ventas, productos, clientes, proveedores y cierre de caja.",
    heroCaption: "Captura histórica de la aplicación entregada al pet shop.",
    sections: [
      {
        paragraphs: [
          "En 2019, todavía cursaba Ingeniería en Computación. Durante mucho tiempo, programar había sido estudiar, resolver ejercicios y conseguir que algo funcionara en mi computadora. Construir y vender mi primer software cambió esa relación.",
          "El cliente era un pet shop local que llevaba el inventario a mano, en un cuadernillo. Durante 40 días le construí una aplicación de escritorio con un dashboard mínimo, un proceso de venta, caja, clientes, proveedores y control de stock. El stock era lo más importante.",
          "No era un sistema sofisticado. Estaba hecho en Java y usaba archivos de Excel como base de datos. El repositorio conserva rutas absolutas de Windows, pantallas grandes y decisiones que hoy resolvería de otra manera. También conserva un commit llamado Programa entregado, fechado el 4 de septiembre de 2019, y un manual de usuario de nueve páginas creado cuatro días antes.",
          "Según me transmitió el comercio en aquel momento, el sistema llegó a usarse. No conservo métricas, logs ni registros de operación que permitan medir cuánto o durante cuánto tiempo; hoy sólo puedo sostener ese uso por la palabra del cliente.",
        ],
      },
      {
        heading: "El código ya no terminaba en mí",
        paragraphs: [
          "En un ejercicio, si el resultado está mal, la consecuencia suele ser una nota o unas horas más de trabajo. En este proyecto, otra persona iba a abrir el programa para registrar una venta, cerrar la caja o consultar cuánta mercadería tenía.",
          "Por primera vez tuve que comprometerme con un cliente por algo que debía funcionar. También fue la primera vez que recibí dinero por algo relacionado con lo que estaba estudiando.",
          "Esa combinación cambió el significado del trabajo. El problema ya no era sólo si el programa compilaba. El dato que mostraba la pantalla tenía que representar lo que realmente había en el comercio. Si el stock digital y el cuadernillo no contaban la misma historia, la aplicación no estaba resolviendo el problema.",
        ],
      },
      {
        heading: "La primera responsabilidad profesional",
        paragraphs: [
          "Hoy puedo mirar aquel código y encontrar muchas cosas para mejorar. Eso es esperable. La vara técnica cambia con la experiencia.",
          "Lo que no cambió es la responsabilidad central: alguien toma decisiones usando el sistema que construimos. A veces es una persona que necesita saber qué queda en un estante. Otras veces es un equipo completo que coordina pagos, operaciones o entregas. La escala cambia; la obligación de representar bien la realidad no.",
          "Ese proyecto fue mi primer paso para descubrir que todo esto me gustaba. No sólo me gustaba programar. Me gustaba tomar un proceso que existía fuera de la computadora, entenderlo y hacerme responsable de convertirlo en una herramienta que otra persona pudiera usar.",
        ],
      },
      {
        heading: "Lo que rescato de ese primer sistema",
        paragraphs: [
          "Un primer proyecto profesional no necesita una arquitectura impresionante para enseñar algo importante. Necesita una persona real, un problema concreto y una consecuencia visible si el software falla.",
          "El mío empezó con un inventario escrito en un cuadernillo. La lección que quedó no fue cómo guardar datos en Excel. Fue entender que el código se vuelve trabajo profesional cuando deja de ser solamente mío y alguien empieza a depender de él.",
        ],
      },
    ],
    pendingChecks: [],
  },
];

export function getNotes({ includeDrafts = false } = {}): Note[] {
  return notes.filter((note) => includeDrafts || !note.draft);
}

export function getNote(slug: string): Note | undefined {
  return notes.find((note) => note.slug === slug);
}

export function getLocalizedNotePreview(note: Note, lang: Locale) {
  const isSourceLocale = lang === note.locale;

  return {
    title: isSourceLocale ? note.title : note.englishTitle,
    description: isSourceLocale
      ? note.description
      : note.englishDescription,
    href: `/${note.locale}/notes/${note.slug}`,
    isSourceLocale,
  };
}
