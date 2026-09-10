import type { Locale } from "@/i18n/config";

export const FIRST_SOFTWARE_NOTE_SLUG =
  "la-primera-vez-que-alguien-dependio-de-que-mi-software-funcionara";
export const MIGRATION_LINTER_NOTE_SLUG =
  "el-framework-no-podia-actualizarse-pero-las-migraciones-igual-tenian-que-ser-seguras";
export const INFRASTRUCTURE_AUDIT_NOTE_SLUG =
  "la-auditoria-empezo-con-106-proyectos-el-costo-no-era-el-principal-problema";

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
  context: Record<Locale, string>;
  readingMinutes: number;
  title: string;
  description: string;
  englishTitle: string;
  englishDescription: string;
  tags: string[];
  heroImage?: string;
  heroAlt: string;
  heroCaption: string;
  source?: {
    label: string;
    url: string;
  };
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
    context: {
      es: "40 días de desarrollo",
      en: "40 days to build",
    },
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
  {
    slug: MIGRATION_LINTER_NOTE_SLUG,
    locale: "es",
    draft: false,
    publishedAt: "2026-09-10",
    originYear: 2026,
    context: {
      es: "4 versiones publicadas",
      en: "4 releases published",
    },
    readingMinutes: 6,
    title:
      "El framework no podía actualizarse, pero las migraciones igual tenían que ser seguras",
    description:
      "Cuando el roadmap necesitó una librería que no existía, convertí una restricción de compatibilidad en una herramienta open source y un proceso de adopción gradual.",
    englishTitle:
      "The framework could not be upgraded, but migrations still had to be safe",
    englishDescription:
      "When the roadmap needed a library that did not exist, I turned a compatibility constraint into an open-source tool and a gradual adoption process.",
    tags: ["Open source", "Laravel", "Migraciones"],
    heroAlt: "",
    heroCaption: "",
    source: {
      label: "Ver Laravel Migration Linter en GitHub",
      url: "https://github.com/MatiasJRB/laravel-migration-linter",
    },
    sections: [
      {
        paragraphs: [
          "Llegué a una parte del roadmap en la que necesitaba responder una pregunta antes de cada deploy: ¿esta migración es segura para convivir con el código que ya está en producción?",
          "La aplicación era un proyecto Laravel establecido. Actualizar el framework y todo su grafo de dependencias no era una tarea que pudiera agregar como condición previa. El roadmap necesitaba avanzar y las migraciones igual tenían que ser revisadas con una vara mejor.",
          "Busqué una librería que resolviera ese problema. Había referencias muy buenas en otros ecosistemas: strong_migrations en Rails, herramientas para Django y analizadores que trabajaban sobre SQL. Pero no encontré una que encajara con la combinación concreta que tenía delante: leer migraciones escritas con la API de Laravel, funcionar con el stack de análisis existente y poder entrar gradualmente en un CI que ya tenía otros controles.",
          "La librería que necesitaba no existía. Así que tuve que crearla.",
        ],
      },
      {
        heading: "El problema no era solamente detectar un drop",
        paragraphs: [
          "Marcar una eliminación de tabla como peligrosa es relativamente fácil. Las migraciones difíciles son las que parecen inocentes en desarrollo, pero cambian de significado cuando hay datos, tráfico y dos versiones de la aplicación conviviendo durante un despliegue.",
          "Agregar una columna obligatoria sin valor por defecto puede fallar sobre filas existentes. Crear un índice puede bloquear escrituras. Un change() puede ocultar una operación más costosa de lo que su sintaxis sugiere. Una migración puede aplicar correctamente en una base vacía y seguir siendo una mala idea para producción.",
          "Tampoco alcanzaba con una lista de expresiones regulares. Necesitaba distinguir el método up() de down(), seguir las llamadas sobre Blueprint, reconocer callbacks y ubicar cada hallazgo en el archivo. Si aparecía una construcción dinámica que la herramienta no entendía, prefería pedir revisión antes que producir un verde falso.",
          "Ese fue el paso desde una política local hacia Laravel Migration Linter: un analizador basado en AST que lee el PHP de la migración sin iniciar Laravel ni conectarse a una base de datos.",
        ],
      },
      {
        heading: "Diseñarlo para el sistema que existía",
        paragraphs: [
          "Una herramienta que obliga a modernizar primero todo el proyecto no resuelve el problema de hoy. Por eso la compatibilidad no era un detalle de empaquetado: era parte del producto.",
          "El linter debía convivir con PHP-Parser 4 y 5. Esa decisión requirió iteraciones específicas, pruebas contra ambas ramas y un contrato de dependencias más amplio que el que habría elegido para una aplicación nueva. El objetivo no era defender que el stack quedara viejo para siempre. Era evitar que la seguridad de las migraciones quedara postergada hasta que terminara otra iniciativa mucho mayor.",
          "También decidí mantenerlo independiente de Laravel. Eso reduce lo que puede saber, pero hace que el análisis sea determinista y permite instalarlo como dependencia de desarrollo sin cambiar el runtime de la aplicación.",
        ],
      },
      {
        heading: "Un linter no conoce la base de datos",
        paragraphs: [
          "El resultado está limitado a lo que puede inferir del código fuente. No conoce el tamaño real de una tabla, la distribución de sus datos, el motor exacto ni el tráfico del momento. Tampoco demuestra que una migración aplique y revierta correctamente.",
          "Por eso nunca debía presentarse como reemplazo de una prueba real, un preview de SQL o una revisión humana. Su trabajo era otro: detectar intención riesgosa temprano y convertirla en una conversación concreta dentro del pull request.",
          "Esa diferencia también cambió la forma de adoptarlo. En vez de darle autoridad para bloquear desde el primer día, entró como una segunda opinión. Primero sobre migraciones nuevas o modificadas. Primero mostrando hallazgos. Primero midiendo si la señal era útil y dónde aparecían falsos positivos.",
          "Un control de seguridad también necesita ganarse la confianza. Que una herramienta pueda fallar un CI no significa que ya tenga evidencia suficiente para hacerlo.",
        ],
      },
      {
        heading: "Extraerlo también fue parte de la solución",
        paragraphs: [
          "Podría haber dejado estas reglas dentro de una sola aplicación. Habría sido más rápido en el corto plazo. Pero quería que el resultado fuera personal y open source: algo que pudiera leerse, instalarse, probarse y discutirse fuera del lugar donde nació.",
          "Eso obligó a separar lo portable de lo específico. Las reglas generales podían vivir en el paquete. El conocimiento de qué tablas eran críticas, qué excepciones aceptaba un equipo o qué otros controles acompañaban al linter debía quedarse en cada consumidor.",
          "Esa frontera volvió mejor a la herramienta. También evitó fingir que una política de un sistema particular era una verdad universal sobre todas las aplicaciones Laravel.",
        ],
      },
      {
        heading: "Lo que me da orgullo es el conjunto",
        paragraphs: [
          "No hay una sola parte que concentre la historia. No es únicamente haber escrito el parser, agregado compatibilidad o publicado un repositorio.",
          "Lo que me da orgullo es el recorrido completo: llegar a una necesidad real del roadmap, comprobar que la pieza que necesitaba no existía, investigar otros modelos, construirla, extraerla como open source, hacerla compatible con un stack establecido y después introducirla con suficiente prudencia como para no confundir una herramienta nueva con una garantía.",
          "La lección que me queda es que modernización y seguridad no siempre tienen que avanzar en el mismo paquete. A veces la decisión responsable es diseñar una mejora que pueda entrar en el sistema que existe hoy, hacer explícito todo lo que todavía no sabe y darle autoridad solamente a medida que la evidencia lo justifica.",
        ],
      },
    ],
    pendingChecks: [],
  },
  {
    slug: INFRASTRUCTURE_AUDIT_NOTE_SLUG,
    locale: "es",
    draft: true,
    publishedAt: "2026-09-10",
    originYear: 2026,
    context: {
      es: "113 proyectos reconciliados",
      en: "113 projects reconciled",
    },
    readingMinutes: 7,
    title:
      "La auditoría empezó con 106 proyectos. El costo no era el principal problema",
    description:
      "Quise entender cuánto costaba mantener años de proyectos. Antes de mirar facturas, tuve que reconstruir qué seguía vivo, quién se hacía cargo y por qué.",
    englishTitle:
      "The audit started with 106 projects. Cost was not the main problem",
    englishDescription:
      "I wanted to understand the cost of years of accumulated projects. Before looking at invoices, I had to reconstruct what was still alive, who owned it, and why.",
    tags: ["Infraestructura", "Operaciones", "Ownership"],
    heroAlt: "",
    heroCaption: "",
    sections: [
      {
        paragraphs: [
          "Empecé con una pregunta que parecía financiera: ¿cuánto me cuesta mantener toda la infraestructura que fui acumulando entre productos, pruebas y proyectos viejos?",
          "Esperaba que el trabajo principal fuera revisar facturas y encontrar gasto para recortar. Antes de poder hacerlo apareció una pregunta más básica: ¿qué era exactamente todo lo que seguía vivo?",
          "Para ordenar el problema armé una auditoría asistida por Codex. Definí el alcance, exigí separar hechos de estimaciones y fui convirtiendo cada hallazgo en una decisión posible. Lo que parecía un inventario de proveedores terminó siendo un mapa de años de decisiones técnicas.",
        ],
      },
      {
        heading: "El número cambió mientras lo estaba contando",
        paragraphs: [
          "El primer cierre reunió 106 proyectos de Vercel distribuidos en cuatro espacios. Había 32 que podían considerarse actuales, 45 proyectos legacy todavía accesibles, 19 rotos y 10 sin producción.",
          "Pero el número no sobrevivió intacto a la propia auditoría. Al reconciliar cuentas y ownership aparecieron siete proyectos más. El corte final llegó a 113: los actuales, rotos y sin producción se mantuvieron; los legacy accesibles pasaron de 45 a 52.",
          "Que el inventario cambiara mientras intentaba cerrarlo no era solamente una corrección estadística. Era parte del problema. No tenía una fuente única que pudiera responder qué existía, qué seguía operativo y por qué debía conservarse.",
        ],
      },
      {
        heading: "Existir, responder y tener dueño no son lo mismo",
        paragraphs: [
          "La auditoría terminó probando 140 endpoints. Ciento uno respondieron o mostraron una barrera de acceso válida. Pero una respuesta HTTP no prueba que un producto esté sano, que alguien lo use ni que exista una persona tomando decisiones sobre él.",
          "Tuve que separar preguntas que los dashboards suelen presentar como si fueran una sola: ¿existe?, ¿está desplegado?, ¿responde?, ¿está saludable?, ¿alguien lo usa?, ¿quién decide su ciclo de vida?, ¿está asociado a una factura?, ¿ese cargo llegó efectivamente a pagarse?",
          "Esa separación evitó dos errores opuestos. El primero era considerar vivo todo lo que respondiera. El segundo era asumir que algo viejo o roto podía eliminarse sin entender antes para quién existía.",
        ],
      },
      {
        heading: "El costo no estaba donde esperaba",
        paragraphs: [
          "Para un período cerrado, el piso mensual que pude defender quedó alrededor de 38 dólares. Era una cifra mucho menor de la que el tamaño del inventario sugería, pero no podía llamarla costo total: todavía había superficies de facturación sin acceso suficiente y cargos que no podían vincularse con certeza.",
          "Encontrar un gasto bajo no resolvía la auditoría. Seguían existiendo 52 proyectos legacy accesibles, dependencias antiguas, dominios, alertas y servicios que requerían volver a investigar cada vez que algo fallaba.",
          "La deuda más importante era explicativa. Podía encontrar un deployment y hasta comprobar que respondía, pero no siempre decir quién quería conservarlo, qué necesidad seguía resolviendo o cuándo debía retirarse.",
          "Una factura baja puede dar una falsa sensación de control. La infraestructura abandonada también cuesta atención, superficie de ataque y tiempo para reconstruir decisiones que nunca quedaron registradas.",
        ],
      },
      {
        heading: "Cambiar la unidad de análisis",
        paragraphs: [
          "Dejé de usar la cuenta del proveedor como unidad principal. Un mismo producto podía cruzar hosting, base de datos, dominio, monitoreo y servicios externos. Mirar cada dashboard por separado permitía sumar cargos, pero no explicar sistemas.",
          "La unidad útil pasó a ser el activo: qué función cumplía, qué recursos lo sostenían, quién podía decidir sobre él y cuál era su siguiente acción. Para cada afirmación separé hechos verificados, estimaciones con su supuesto y brechas que impedían cerrar una conclusión.",
          "También dejé de tratar live como una decisión de ciclo de vida. Cada elemento necesitaba una salida explícita: conservar, verificar, asignar ownership o retirar. No inferí una baja sólo porque algo pareciera viejo o roto.",
        ],
      },
      {
        heading: "Una secuencia que puedo volver a usar",
        paragraphs: [
          "Primero, definir exactamente qué cuentas y organizaciones entran en el alcance. Sin ese límite, cualquier total mezcla mundos que no pertenecen a la misma decisión.",
          "Después, exportar inventarios, reconciliar duplicados y separar deployment, reachability, salud, uso y ownership. Recién entonces tiene sentido conectar cada activo con facturas y cargos de períodos cerrados.",
          "Por último, asignar una decisión de ciclo de vida y conservar evidencia suficiente para repetir la auditoría. El resultado útil no es una planilla congelada, sino un sistema que permita detectar cuándo el mapa vuelve a separarse de la realidad.",
        ],
      },
      {
        heading: "Lo que encontré detrás de la cifra",
        paragraphs: [
          "Entré buscando cuánto costaba mi infraestructura y terminé construyendo una explicación de lo que había acumulado. El ahorro dejó de ser la primera pregunta. Antes necesitaba saber qué estaba pagando, qué estaba manteniendo y qué compromiso representaba cada cosa.",
          "La lección no es que el costo no importe. Es que una cifra sólo se vuelve accionable cuando está conectada con ownership y ciclo de vida. De otro modo, incluso un total preciso describe facturación, no un sistema.",
          "Esta fue una foto de septiembre de 2026 sobre una cartera personal y de un estudio pequeño. No representa la economía de una empresa SaaS con tráfico significativo. Tampoco voy a publicar el inventario original: contiene proyectos, cuentas, dominios y facturas que no hacen falta para sostener el aprendizaje.",
        ],
      },
    ],
    pendingChecks: [
      "Confirmar si el título debe conservar el corte inicial de 106 o usar el inventario reconciliado de 113.",
      "Aprobar la publicación del gasto mensual agregado y su formulación como piso, no como costo total.",
      "Hacer una pasada final de voz y seguridad antes de sacar la pieza del modo borrador.",
    ],
  },
];

export function getNotes({ includeDrafts = false } = {}): Note[] {
  return notes
    .filter((note) => includeDrafts || !note.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
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
