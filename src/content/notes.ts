import type { Locale } from "@/i18n/config";

export const FIRST_SOFTWARE_NOTE_SLUG =
  "la-primera-vez-que-alguien-dependio-de-que-mi-software-funcionara";
export const MIGRATION_LINTER_NOTE_SLUG =
  "el-framework-no-podia-actualizarse-pero-las-migraciones-igual-tenian-que-ser-seguras";
export const INFRASTRUCTURE_AUDIT_NOTE_SLUG =
  "audite-113-proyectos-el-costo-no-era-el-principal-problema";
export const PERSONAL_ASSISTANT_NOTE_SLUG =
  "yo-seguia-siendo-la-api-entre-la-ia-y-mi-vida";

export const AI_BOTTLENECK_NOTE_SLUG =
  "la-ia-acelero-la-escritura-de-codigo-pero-traslado-el-cuello-de-botella";

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
    draft: false,
    publishedAt: "2026-09-10",
    originYear: 2026,
    context: {
      es: "113 proyectos relevados",
      en: "113 projects audited",
    },
    readingMinutes: 7,
    title: "Audité 113 proyectos. El costo no era el principal problema",
    description:
      "Una tarea que siempre quedaba postergada se volvió posible cuando aprendí a trabajar con agentes para investigar, contrastar evidencia y convertir infraestructura dispersa en un plan.",
    englishTitle: "I audited 113 projects. Cost was not the main problem",
    englishDescription:
      "A task that was always postponed became possible when I learned to work with agents to investigate, compare evidence, and turn scattered infrastructure into a plan.",
    tags: ["Agentes", "Infraestructura", "Operaciones"],
    heroAlt: "",
    heroCaption: "",
    sections: [
      {
        paragraphs: [
          "Durante años fui dejando proyectos desplegados detrás de cada etapa. Algunos eran productos activos. Otros eran landing pages, backoffices, APIs, portfolios, demos, pruebas o versiones anteriores de algo que había seguido evolucionando. Cada uno había tenido sentido en su momento; el conjunto ya no era fácil de explicar.",
          "La pregunta aparecía cada tanto: ¿qué sigue vivo y cuánto cuesta mantenerlo? Nunca era urgente frente al producto que estaba construyendo ese día. Responderla bien implicaba entrar a varias cuentas, reconstruir relaciones, probar servicios, revisar facturas y distinguir un sistema abandonado de uno silencioso pero necesario. Era trabajo importante y, al mismo tiempo, muy fácil de postergar.",
          "Lo que cambió fue que aprendí a organizar ese trabajo con agentes. En vez de reservar días para abrir todo a mano, podía dividir la investigación, poner límites claros y producir evidencia que yo pudiera revisar antes de tomar decisiones.",
        ],
      },
      {
        heading: "No eran 113 productos",
        paragraphs: [
          "El inventario reconciliado terminó con 113 proyectos en Vercel. El número necesita contexto: no eran 113 negocios ni 113 aplicaciones independientes. Había interfaces de productos vigentes, sitios institucionales, herramientas internas, experimentos, demos, copias de una misma idea, despliegues legacy y proyectos que nunca habían llegado a producción.",
          "Alrededor de esos proyectos también aparecían bases de datos, dominios, servicios de monitoreo, repositorios y otras cuentas cloud. Un producto podía estar repartido entre varios proveedores; un proveedor podía contener rastros de muchas etapas distintas.",
          "El primer corte había dado 106. Al cruzarlo con otras fuentes aparecieron siete más. No tenía sentido elegir la cifra más linda ni aceptar la primera respuesta: había que explicar la diferencia. Esa corrección confirmó que no existía una fuente única capaz de decir qué había construido, qué seguía funcionando y por qué debía conservarse.",
        ],
      },
      {
        heading: "Trabajar con agentes no es pedir un reporte",
        paragraphs: [
          "El trabajo no consistió en escribir un prompt largo y aceptar la primera respuesta. Tuve que definir el universo, separar tareas que podían ejecutarse en paralelo y establecer reglas: no borrar nada, no cambiar producción, no mezclar evidencia con estimaciones y no presentar una cifra incompleta como si fuera un total.",
          "Los agentes podían recorrer inventarios, contrastar fuentes, probar endpoints y producir artefactos reproducibles. Mi trabajo era decidir qué pregunta estábamos contestando, detectar conclusiones demasiado fuertes, exigir trazabilidad y convertir los hallazgos en prioridades.",
          "Así, el tiempo dejó de irse en abrir manualmente cada proyecto. Pude usarlo para revisar excepciones, discutir riesgos y tomar las decisiones que no convenía delegar.",
        ],
      },
      {
        heading: "Existir, responder y tener dueño no son lo mismo",
        paragraphs: [
          "La auditoría probó 140 endpoints. Ciento uno respondieron o mostraron una barrera de acceso válida. Pero una respuesta HTTP no demuestra que un producto esté sano, que alguien lo use ni que exista una persona tomando decisiones sobre él.",
          "Tuve que separar preguntas que los dashboards suelen mezclar: ¿existe?, ¿está desplegado?, ¿responde?, ¿está saludable?, ¿alguien lo usa?, ¿quién decide su ciclo de vida?, ¿está asociado a una factura?, ¿ese cargo llegó efectivamente a pagarse?",
          "Esa separación evitó dos errores opuestos. El primero era considerar vigente todo lo que respondiera. El segundo era asumir que algo viejo o roto podía eliminarse sin entender antes qué dependía de él.",
        ],
      },
      {
        heading: "El costo era sólo una de las capas",
        paragraphs: [
          "La auditoría había empezado como una pregunta de costos, pero el gasto visible no resultó ser el problema más grande. Había servicios gratuitos, otros con consumo real y superficies donde todavía faltaba evidencia para cerrar una conclusión. Publicar un único total habría ocultado esas diferencias.",
          "Lo que sí apareció con claridad fue que no podía explicar bien el conjunto: había proyectos accesibles sin una decisión de ciclo de vida, dependencias antiguas, monitoreos apuntando a destinos que ya habían cambiado y componentes cuyo ownership necesitaba confirmación.",
          "Una factura baja puede dar una falsa sensación de control. La infraestructura también cuesta atención, actualizaciones, superficie de ataque y tiempo para reconstruir decisiones que nunca quedaron registradas.",
        ],
      },
      {
        heading: "La auditoría abrió más trabajo del que cerró",
        paragraphs: [
          "El resultado no fue solamente un inventario. Salieron 45 acciones concretas. Algunas eran operativas: corregir monitores, confirmar responsables o decidir qué hacer con proyectos legacy. Otras eran de plataforma: actualizar runtimes y ordenar caminos de deploy.",
          "También aparecieron líneas de seguridad. Había dependencias vulnerables, permisos de base de datos que necesitaban revisión y controles sobre secretos que podían fortalecerse. La auditoría no resolvió automáticamente esos problemas, pero los convirtió en trabajos acotados, con evidencia, prioridad y una condición clara antes de tocar producción.",
          "Ese cambio importa. Antes tenía una sensación difusa de infraestructura acumulada. Después tenía un registro que distinguía qué estaba comprobado, qué era una estimación, qué seguía bloqueado y cuál era el siguiente movimiento seguro.",
        ],
      },
      {
        heading: "Lo que hizo posible terminarla",
        paragraphs: [
          "Había llegado a este punto precisamente por el tiempo que consumen estas tareas. Cuando cada revisión compite con construir el producto siguiente, lo sistémico pierde frente a lo urgente. Los agentes no eliminaron el trabajo ni reemplazaron el criterio, pero desbloquearon una investigación que de otra forma habría seguido esperando.",
          "La diferencia estuvo en saber dirigirlos: dividir el problema, limitar permisos, pedir evidencia verificable, hacer explícitas las brechas y reservar las decisiones irreversibles para una persona. Sin esa disciplina, los agentes sólo habrían producido más texto y una falsa sensación de avance.",
          "Usados de esa manera, me permitieron pasar de una pregunta que siempre quedaba pendiente a un sistema que podía revisar. No hicieron que 113 proyectos fueran simples. Hicieron posible observarlos como un conjunto sin perder semanas en el intento.",
        ],
      },
      {
        heading: "Después de verlo entero",
        paragraphs: [
          "El costo importa, pero una cifra sólo se vuelve accionable cuando está conectada con ownership, riesgo y ciclo de vida. De otro modo describe facturación, no un sistema.",
          "La auditoría fue una foto de septiembre de 2026 y el universo va a seguir cambiando. Tampoco pienso publicar el inventario original: los nombres, cuentas, dominios y detalles operativos no hacen falta para sostener el aprendizaje.",
          "Lo que sí quiero conservar es el método. Una cartera grande deja de ser una acumulación invisible cuando cada elemento puede explicarse, tiene evidencia y termina en una decisión. Aprender a trabajar con agentes hizo posible llegar hasta ahí; saber qué no delegar fue lo que volvió útil el resultado.",
        ],
      },
    ],
    pendingChecks: [],
  },
  {
    slug: PERSONAL_ASSISTANT_NOTE_SLUG,
    locale: "es",
    draft: false,
    publishedAt: "2026-09-10",
    originYear: 2026,
    context: {
      es: "Codex, OpenClaw y WhatsApp",
      en: "Codex, OpenClaw, and WhatsApp",
    },
    readingMinutes: 8,
    title: "Yo seguía siendo la API entre la IA y mi vida",
    description:
      "La IA podía ayudarme a pensar, pero yo seguía trasladando contexto, fechas y acciones entre herramientas. El cambio fue construir dos planos: Codex para decidir y OpenClaw para sostener la operación.",
    englishTitle:
      "I was still the API between AI and my life",
    englishDescription:
      "AI could help me think, but I was still moving context, dates, and actions between tools. The shift was building two planes: Codex for decisions and OpenClaw for ongoing operations.",
    tags: ["Agentes", "Automatización", "Sistemas personales"],
    heroAlt: "",
    heroCaption: "",
    sections: [
      {
        paragraphs: [
          "Durante un tiempo confundí una conversación útil con un asistente personal.",
          "Le pedía que me ayudara con un trámite, un turno, una compra o un arreglo y la respuesta era buena: pasos claros, un mensaje preparado y una fecha sugerida. Después cerraba el chat y empezaba mi trabajo.",
          "Copiar la fecha. Mandar el mensaje. Acordarme de revisar si habían respondido. Actualizar el pendiente. Volver días después con todo el contexto.",
          "La IA había pensado conmigo, pero yo seguía siendo la API entre esa conversación y mi vida. Cada respuesta resolvía una pregunta y me creaba una pequeña tarea de coordinación.",
        ],
      },
      {
        heading: "La respuesta era buena. El sistema, no.",
        paragraphs: [
          "El problema no era que la IA respondiera mal. Era que la conversación no sabía qué seguía abierto, de quién dependía una respuesta ni cuándo convenía volver a mirar el tema.",
          "Podía escribir un mensaje perfecto y olvidarlo al cerrar la ventana. Podía recomendar una fecha sin saber después si había cambiado. Podía enumerar los próximos pasos sin hacerse cargo de que alguno ocurriera.",
          "Seguir mejorando el prompt no resolvía esa discontinuidad. Necesitaba sacar el estado del chat y darle a cada asunto un lugar persistente: qué falta, quién tiene la pelota, cuándo revisarlo y cuál es el próximo movimiento posible.",
          "El salto no fue encontrar un modelo más inteligente. Fue empezar a construir alrededor del modelo: estado, procesos, canales y reglas capaces de sobrevivir a una conversación.",
        ],
      },
      {
        heading: "Dos planos en vez de un superagente",
        paragraphs: [
          "La solución no terminó siendo un agente gigante con acceso a todo. Construí dos planos con responsabilidades diferentes.",
          "Codex es el plano de control. Ahí converso, investigo, corrijo y tomo decisiones. También mantiene la fuente operativa de los pendientes: estado, responsable, próxima acción, fecha de revisión y condición de cierre.",
          "OpenClaw es el plano que permanece encendido. Corre en Railway, usa WhatsApp como canal principal y ejecuta procesos programados aunque yo no tenga una conversación abierta.",
          "Los dos planos no fingen compartir una memoria mágica. Cuando Codex necesita apoyarse en OpenClaw, prepara un paquete autocontenido con la agenda, las preferencias y los pendientes necesarios para esa acción. Menos contexto, pero mejor elegido.",
        ],
      },
      {
        heading: "Lo que ya funciona mientras no estoy mirando",
        paragraphs: [
          "OpenClaw ya entrega por WhatsApp tres resúmenes diarios. Reúne señales de correo, calendario, GitHub y un resumen financiero de sólo lectura; las ordena y trata de mostrar lo que puede cambiar una decisión, no todo lo que encontró.",
          "Cada quince minutos también corre un detector reactivo. Sólo deja pasar señales nuevas de prioridad alta, deduplica lo que ya avisó y responde en silencio cuando no hay nada accionable. Además prepara el clima del día siguiente y agendas semanales y mensuales de eventos en Bahía Blanca.",
          "Antes de reescribir esta nota volví a comprobar el sistema en producción: el gateway estaba sano, OpenClaw corría en su versión actual y esos trabajos programados terminaban correctamente.",
          "Lo que me interesa no es la cantidad de automatizaciones. Es que el comportamiento por defecto sea callarse. Un secretario que informa constantemente todo lo que revisó vuelve a convertirme en su operador.",
        ],
      },
      {
        heading: "Un audio ya puede convertirse en un pendiente",
        paragraphs: [
          "El recorrido más interesante empieza en WhatsApp. Puedo mandar texto o un audio directo al Secretario. Si es audio, Gemini lo transcribe; después el sistema separa una captura en una o más intenciones: bitácora, pendiente, idea, consulta, acción o algo ambiguo que todavía necesita revisión.",
          "El resultado se guarda en una base SQLite privada. El audio original no queda acumulado y las respuestas operativas no exponen la transcripción completa. Si el mensaje contiene un pendiente, un puente lo incorpora a la fuente de verdad de Codex.",
          "Ese puente está diseñado para poder fallar y reintentarse. Escribe de forma atómica, usa un marcador estable y recién después confirma el traspaso. Si una ejecución se corta a mitad de camino, la siguiente puede terminarla sin crear dos pendientes iguales.",
          "En producción ya existe actividad real en esa base y el primer traspaso fue probado. La conversación dejó de ser un lugar donde una idea podía perderse y pasó a ser una entrada durable al sistema.",
        ],
      },
      {
        heading: "El sistema también sabe esperar",
        paragraphs: [
          "Del lado de Codex hay un heartbeat activo que no abre WhatsApp o el correo porque sí. Primero revisa el estado local. Sólo consulta un canal cuando existe un asunto esperando a un tercero y su fecha de control ya venció.",
          "También distingue una espera externa de algo bloqueado por mí. Si falta una foto, una decisión o una autorización, revisar cinco veces el chat no agrega información. El próximo movimiento tiene que volver a mí, no convertirse en polling inútil.",
          "Ese mecanismo ya sostuvo recorridos reales. Una respuesta entrante actualizó un pendiente; el sistema preparó la contestación exacta; yo aprobé destinatario, canal y texto; el mensaje salió y el asunto volvió a quedar en espera con una nueva fecha de control.",
          "Lo valioso no es que una IA haya redactado el mensaje. Es que el proceso recordó qué venía después.",
        ],
      },
      {
        heading: "Actuar cambia las reglas",
        paragraphs: [
          "Cruzar la frontera del chat vuelve al sistema más útil, pero también cambia el riesgo. Leer una respuesta o actualizar una lista no tiene el mismo impacto que escribirle a otra persona. Preparar una compra tampoco es pagarla.",
          "Por eso la autonomía no es un interruptor general. El sistema puede investigar, ordenar, clasificar y preparar cuando el impacto es bajo. Si una acción me representa frente a alguien, tiene que mostrarme exactamente qué va a hacer y esperar mi aprobación final.",
          "La autorización no es una traba agregada al final. Es parte de la arquitectura. Un asistente que no distingue consecuencias no distribuye autonomía: distribuye riesgo.",
        ],
      },
      {
        heading: "Las tecnologías y el trabajo de cada una",
        paragraphs: [
          "Codex Desktop es la interfaz de control y el espacio de razonamiento. Archivos Markdown y JSON mantienen preferencias, pendientes y estado de monitoreo de una forma que puedo leer y corregir sin depender del historial de un chat.",
          "OpenClaw aporta el runtime siempre encendido, sus agentes y los trabajos programados. Railway le da proceso, red y un volumen persistente. WhatsApp funciona como entrada rápida y canal de entrega.",
          "Gemini se ocupa de tareas costo-first como redacción de resúmenes y transcripción de audio. SQLite conserva el intake privado. Node.js y Express envuelven el gateway y los colectores; pequeños puentes en Python sincronizan el estado con Codex.",
          "Gmail, Google Calendar, GitHub y Norte Financiero entran como fuentes de sólo lectura. No forman una base nueva: cada sistema conserva su propia autoridad y el asistente trabaja con una proyección mínima de lo que necesita.",
          "La arquitectura no es interesante por la lista de nombres. Es interesante porque cada pieza tiene un límite claro y porque ninguna necesita fingir que puede hacerlo todo.",
        ],
      },
      {
        heading: "Lo que realmente quiero delegar",
        paragraphs: [
          "No estoy construyendo un sistema para que tome todas mis decisiones. Hay conversaciones, compromisos y asuntos personales que necesitan ambigüedad, tiempo o simplemente mi criterio.",
          "Lo que quiero delegar es la continuidad: conservar el estado correcto, notar qué cambió, traer de vuelta lo que necesita atención y preparar el próximo movimiento sin obligarme a reconstruir cada historia.",
          "Cuando el riesgo es bajo, el sistema puede avanzar. Cuando una acción tiene consecuencias, debe detenerse en el punto exacto donde necesito recuperar el control.",
          "No quiero un asistente que viva mi vida por mí. Quiero dejar de gastar atención siendo el pegamento manual entre herramientas que ya deberían entenderse entre sí.",
        ],
      },
    ],
    pendingChecks: [],
  },
  {
    slug: AI_BOTTLENECK_NOTE_SLUG,
    locale: "es",
    draft: false,
    publishedAt: "2026-09-10",
    originYear: 2026,
    context: {
      es: "Del código al criterio",
      en: "From code to judgment",
    },
    readingMinutes: 7,
    title: "La IA aceleró la escritura de código, pero trasladó el cuello de botella",
    description:
      "Puedo producir más cambios y exploraciones en menos tiempo. El trabajo difícil no desapareció: se movió hacia especificar, repartir contexto, revisar, integrar y decidir qué merece llegar a producción.",
    englishTitle:
      "AI accelerated code writing, but moved the bottleneck elsewhere",
    englishDescription:
      "I can produce more changes and explorations in less time. The hard work did not disappear; it moved to specification, context, review, integration, and deciding what deserves to ship.",
    tags: ["Agentes", "Ingeniería", "Delivery"],
    heroAlt: "",
    heroCaption: "",
    sections: [
      {
        paragraphs: [
          "Durante mucho tiempo podía explicar con bastante precisión por qué una tarea llevaba varios días: había que escribir el código. Entender el problema seguía importando, pero la implementación ocupaba una parte visible y difícil de comprimir.",
          "Hoy puedo pedir varias exploraciones en paralelo, recibir una implementación completa, ejecutar pruebas y tener un pull request preparado antes de lo que antes me llevaba construir la primera versión. Eso es una mejora real. También creó un problema nuevo: puedo producir cambios más rápido de lo que puedo entenderlos con confianza.",
          "La IA no eliminó el cuello de botella de la ingeniería. Lo trasladó. Escribir dejó de ser siempre la parte lenta; ahora muchas veces lo son especificar qué debe pasar, distribuir el contexto correcto, revisar decisiones, integrar resultados y determinar qué merece llegar a producción.",
        ],
      },
      {
        heading: "No fue una herramienta más rápida: cambió la unidad de trabajo",
        paragraphs: [
          "Con trabajo manual, la unidad era una modificación que yo mismo escribía. Con Copilot, seguía conduciendo línea por línea, pero completaba más rápido. Con un chat, podía delegar una explicación o un fragmento y después trasladarlo al repositorio.",
          "Los agentes cambiaron algo más profundo. Ya no delego solamente texto: puedo delegar una misión acotada dentro de un repositorio, con acceso al código, herramientas para verificarlo y una condición de finalización. Incluso puedo hacer que varias investigaciones avancen al mismo tiempo.",
          "Eso aumenta la superficie que puedo cubrir, pero también separa producción de comprensión. Que exista un diff, una batería de tests o una respuesta convincente no significa que yo haya tomado todavía una buena decisión.",
        ],
      },
      {
        heading: "El nuevo cuello de botella empieza antes del código",
        paragraphs: [
          "Un pedido ambiguo hecho a una persona suele abrir una conversación. El mismo pedido enviado a varios agentes puede producir varias interpretaciones completas antes de que yo note que la pregunta estaba mal formulada.",
          "Por eso empecé a invertir más tiempo en especificaciones, criterios de aceptación y límites. Qué sistema es la fuente de verdad. Qué se puede modificar. Qué debe permanecer intacto. Cómo se demuestra que el resultado funciona. Qué decisión requiere volver a una persona.",
          "La especificación no necesita describir cada línea. Su trabajo es reducir el espacio de respuestas plausibles pero equivocadas. Cuanto más barata se vuelve la implementación, más caro resulta descubrir tarde que resolvimos con precisión el problema incorrecto.",
        ],
      },
      {
        heading: "Trabajar en paralelo no paraleliza las decisiones",
        paragraphs: [
          "Los agentes son muy buenos para separar investigaciones independientes: recorrer repositorios, comparar alternativas, ejecutar pruebas o preparar cambios aislados. El problema aparece cuando dos tareas comparten supuestos, archivos o una decisión de arquitectura que todavía no está cerrada.",
          "Ahí el paralelismo puede producir velocidad local y conflicto global. Dos ramas pueden estar verdes por separado y seguir siendo incompatibles. Un agente puede optimizar una pieza mientras otro cambia el contrato que esa pieza daba por estable.",
          "Aprendí a trabajar por olas: primero resolver las decisiones que bloquean el resto; después abrir tareas verdaderamente independientes; finalmente integrar de manera deliberada. Más agentes no siempre reducen el tiempo. A veces sólo permiten equivocarse en paralelo.",
        ],
      },
      {
        heading: "Revisar ya no es solamente leer el diff",
        paragraphs: [
          "Cuando el volumen de cambios crece, una revisión puramente línea por línea deja huecos. Necesito comprobar también la intención, las fuentes usadas, los caminos que quedaron fuera y la evidencia producida por el propio trabajo.",
          "En la auditoría de infraestructura, por ejemplo, los agentes hicieron viable recorrer inventarios, probar endpoints y contrastar proveedores. Mi trabajo no desapareció: tuve que definir el universo, prohibir cambios sobre producción, separar datos verificados de estimaciones y pedir una explicación cuando el primer corte de 106 proyectos terminó convirtiéndose en 113.",
          "El resultado correcto no era un reporte largo. Era una cadena que permitiera volver desde una conclusión hasta su evidencia y distinguir qué seguía necesitando criterio humano.",
        ],
      },
      {
        heading: "Los gates pasaron a ser parte del diseño",
        paragraphs: [
          "Si producir un cambio es barato, descartar un cambio malo también debería serlo. Para eso necesito gates que no dependan de recordar una checklist distinta en cada entrega: tipos, lint, tests, builds, revisión visual, controles de seguridad y verificación después del deploy cuando corresponde.",
          "Un check verde no demuestra que el producto sea correcto. Pero una secuencia de controles bien elegida reduce la cantidad de dudas que tienen que resolverse con atención humana. El objetivo no es automatizar el juicio, sino reservarlo para las decisiones que realmente lo necesitan.",
          "También cambió mi relación con el rollback. Cuando el sistema puede generar otra versión rápidamente, reconocer que una dirección no sirve deja de ser una derrota costosa. Lo peligroso es integrar por inercia sólo porque ya existe una implementación convincente.",
        ],
      },
      {
        heading: "Mi trabajo produce menos respuestas y más condiciones",
        paragraphs: [
          "Una parte creciente de mi trabajo ya no consiste en escribir la solución final. Consiste en definir el terreno donde una solución puede construirse sin perder coherencia: specs, ADRs, reglas compartidas, ownership, criterios de aceptación y mecanismos de revisión.",
          "Eso puede verse como menos producción porque no siempre termina en un commit funcional. En realidad es lo que permite que la producción de varios agentes y personas llegue al mismo sistema sin convertir la velocidad en entropía.",
          "El cambio también exige una habilidad incómoda: frenar. Si aparecen demasiados resultados para revisar bien, lanzar otro agente no aumenta la capacidad. Sólo agranda la cola.",
        ],
      },
      {
        heading: "No tengo un multiplicador universal",
        paragraphs: [
          "Puedo reconstruir etapas de mi trabajo manual, con Copilot, con ChatGPT y con agentes. También puedo contar commits, sesiones, pull requests o worktrees. Ninguna de esas comparaciones es un experimento controlado: cambiaron los proyectos, mi experiencia, mis responsabilidades y la complejidad de lo que estaba construyendo.",
          "Por eso no puedo sostener que los agentes me hicieron una cantidad exacta de veces más productivo. Sí puedo sostener algo más útil: ahora puedo explorar y producir muchas más alternativas, y eso desplazó una proporción mayor del trabajo hacia la dirección y la verificación.",
          "La métrica que me interesa ya no es cuánto código apareció. Es cuánto tiempo pasa desde una pregunta hasta una decisión defendible y cuánto del resultado puedo integrar sin crear una deuda que todavía no entiendo.",
        ],
      },
      {
        heading: "La ventaja no está en generar más",
        paragraphs: [
          "Cuando escribir código era caro, producir más podía parecer casi siempre una ventaja. Cuando producir se vuelve abundante, la escasez cambia de lugar.",
          "Ahora lo escaso es el contexto bien elegido, una especificación que elimine ambigüedad, una revisión capaz de detectar conflictos y el criterio para decidir qué no integrar. La ingeniería sigue estando ahí; simplemente dejó de coincidir tanto con el acto de tipear.",
          "La diferencia no la hará quien pueda generar la mayor cantidad de cambios. La hará quien pueda convertir esa capacidad en un sistema que conserve dirección, evidencia y responsabilidad mientras se mueve más rápido.",
        ],
      },
    ],
    pendingChecks: [],
  },
];

export function getNotes({ includeDrafts = false } = {}): Note[] {
  return notes
    .map((note, sourceIndex) => ({ note, sourceIndex }))
    .filter(({ note }) => includeDrafts || !note.draft)
    .sort(
      (a, b) =>
        b.note.publishedAt.localeCompare(a.note.publishedAt) ||
        b.sourceIndex - a.sourceIndex,
    )
    .map(({ note }) => note);
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
