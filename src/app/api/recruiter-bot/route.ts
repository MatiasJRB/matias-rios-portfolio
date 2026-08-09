import { NextResponse } from "next/server";
import { getDictionary } from "@/i18n/get-dictionary";
import { getResume } from "@/data/get-resume";
import type { Locale } from "@/i18n/config";
import type { Resume } from "@/types";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type ChatRequestMessage = {
  role?: "assistant" | "user";
  content?: string;
};

type ContextFileInput = {
  name?: string;
  kind?: string;
  text?: string;
  pageCount?: number;
  pagesUsed?: number;
  truncated?: boolean;
};

type RequestBody = {
  message?: string;
  messages?: ChatRequestMessage[];
  fileContexts?: ContextFileInput[];
  pdfContexts?: ContextFileInput[];
  lang?: Locale;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
    finishReason?: string;
  }>;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

const MAX_INPUT_CHARS = 7000;
const MAX_HISTORY_MESSAGES = 8;
const MAX_TRANSCRIPT_CHARS = 12_000;
const MAX_FILE_CONTEXTS = 3;
const MAX_SINGLE_FILE_CONTEXT_CHARS = 12_000;
const MAX_TOTAL_FILE_CONTEXT_CHARS = 20_000;
const RATE_LIMIT_MAX_REQUESTS = 8;

const isLocale = (value: unknown): value is Locale =>
  value === "es" || value === "en";

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getClientId = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";

  return request.headers.get("x-real-ip") || "unknown";
};

const getProfileLabel = (profile: Resume["basics"]["profiles"][number]) => {
  if (profile.network) return profile.network;

  const value = profile.url.toLowerCase();
  if (profile.icon === "email" || value.startsWith("mailto:")) return "Email";
  if (value.includes("linkedin.com")) return "LinkedIn";
  if (value.includes("github.com")) return "GitHub";

  return "Profile";
};

const getProfileDisplayUrl = (url: string) =>
  url.startsWith("mailto:") ? url.replace(/^mailto:/, "") : url;

const buildContactChannels = (resume: Resume) => {
  const channels = [
    `- Email: ${resume.basics.email}`,
    `- Phone: ${resume.basics.phone}`,
    `- Website: ${resume.basics.url}`,
    ...resume.basics.profiles.map(
      (profile) =>
        `- ${getProfileLabel(profile)}: ${getProfileDisplayUrl(profile.url)}`,
    ),
  ];

  return Array.from(new Set(channels)).join("\n");
};

const normalizeSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const isContactQuestion = (message: string) => {
  const normalized = normalizeSearchText(message.trim());
  const hasContactTerm =
    /\b(contact(?:ar|o|ame|arme|arlo|arse|ate|a)?|contactame|escrib(?:ir|o|ime|ile|irle)|mail|email|correo|linkedin|telefono|whatsapp|contratar|hire|reach)\b/i.test(
      normalized,
    );

  if (!hasContactTerm) return false;

  const asksForChannel =
    /\b(por donde|donde|como|canal|datos|medio|via|forma|manera|how|where|ways?|get in touch)\b/i.test(
      normalized,
    );
  const mentionsMatias = /\bmatias\b/i.test(normalized);

  return asksForChannel || mentionsMatias || normalized.length <= 140;
};

const buildContactAnswer = (resume: Resume, lang: Locale) => {
  const linkedIn = resume.basics.profiles.find((profile) =>
    profile.url.toLowerCase().includes("linkedin.com"),
  )?.url;
  const github = resume.basics.profiles.find((profile) =>
    profile.url.toLowerCase().includes("github.com"),
  )?.url;

  if (lang === "en") {
    return [
      `You can contact Matias by **email** at ${resume.basics.email}${linkedIn ? ` or on **LinkedIn**: ${linkedIn}` : ""}.`,
      "",
      `- **Email:** ${resume.basics.email}`,
      linkedIn ? `- **LinkedIn:** ${linkedIn}` : undefined,
      `- **Phone:** ${resume.basics.phone}`,
      github ? `- **GitHub:** ${github}` : undefined,
      `- **Website:** ${resume.basics.url}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    `Podés contactar a Matias por **email** a ${resume.basics.email}${linkedIn ? ` o por **LinkedIn**: ${linkedIn}` : ""}.`,
    "",
    `- **Email:** ${resume.basics.email}`,
    linkedIn ? `- **LinkedIn:** ${linkedIn}` : undefined,
    `- **Teléfono:** ${resume.basics.phone}`,
    github ? `- **GitHub:** ${github}` : undefined,
    `- **Web:** ${resume.basics.url}`,
  ]
    .filter(Boolean)
    .join("\n");
};

const normalizeHistory = (messages: ChatRequestMessage[] | undefined) => {
  if (!Array.isArray(messages)) return "";

  const transcript = messages
    .filter(
      (message) =>
        (message.role === "assistant" || message.role === "user") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0,
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => {
      const role = message.role === "assistant" ? "Assistant" : "User";
      return `${role}: ${message.content?.trim()}`;
    })
    .join("\n\n");

  return transcript.slice(-MAX_TRANSCRIPT_CHARS);
};

const sanitizeFileContextName = (name: unknown, index: number) => {
  if (typeof name !== "string" || !name.trim()) return `File ${index + 1}`;

  return name
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
};

const normalizeFileContexts = (fileContexts: unknown) => {
  if (!Array.isArray(fileContexts)) return "";

  let remainingChars = MAX_TOTAL_FILE_CONTEXT_CHARS;

  const normalized = fileContexts
    .slice(0, MAX_FILE_CONTEXTS)
    .map((context, index) => {
      if (
        !context ||
        typeof context !== "object" ||
        !("text" in context) ||
        typeof context.text !== "string"
      ) {
        return null;
      }

      if (remainingChars <= 0) return null;

      const cleanedText = context.text
        .replace(/\r/g, "\n")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{4,}/g, "\n\n\n")
        .trim();

      if (!cleanedText) return null;

      const text = cleanedText.slice(
        0,
        Math.min(MAX_SINGLE_FILE_CONTEXT_CHARS, remainingChars),
      );
      remainingChars -= text.length;

      const pageDetails = [
        typeof context.kind === "string"
          ? context.kind.toUpperCase()
          : undefined,
        typeof context.pagesUsed === "number"
          ? `${context.pagesUsed} page(s) used`
          : undefined,
        typeof context.pageCount === "number"
          ? `${context.pageCount} total page(s)`
          : undefined,
        context.truncated ? "truncated" : undefined,
      ]
        .filter(Boolean)
        .join(", ");

      const details = pageDetails ? ` (${pageDetails})` : "";
      const name = sanitizeFileContextName(context.name, index);

      return `## ${name}${details}\n${text.trim()}`;
    })
    .filter(Boolean);

  return normalized.length
    ? `User-provided attached file context:\n${normalized.join("\n\n")}`
    : "";
};

const buildPortfolioContext = (
  resume: Resume,
  dictionary: Awaited<ReturnType<typeof getDictionary>>,
) => {
  const knowledgeAreas = Object.values(dictionary.cv.areas)
    .map((area) => `- ${area.title} ${area.description}`)
    .join("\n");

  const work = resume.work
    .map((job) => {
      const highlights = job.highlights?.length
        ? `\nHighlights:\n${job.highlights.map((highlight) => `- ${highlight}`).join("\n")}`
        : "";

      return `## ${job.position} — ${job.name} (${job.startDate} - ${job.endDate})\n${job.summary}${highlights}`;
    })
    .join("\n\n");

  const projects = resume.projects?.length
    ? resume.projects
        .map((project) => {
          const company = project.company ? ` (${project.company})` : "";
          return `- ${project.name}${company}: ${project.role}. ${project.description} Tech: ${project.tech.join(", ")}.`;
        })
        .join("\n")
    : "No projects listed.";

  const education = resume.education?.length
    ? resume.education
        .map(
          (item) =>
            `- ${item.studyType} — ${item.area}, ${item.institution} (${item.startDate} - ${item.endDate})`,
        )
        .join("\n")
    : dictionary.cv.educationDetail;

  return `
Candidate profile for ${resume.basics.name}
Headline: ${resume.basics.label}
Summary: ${resume.basics.summary}
About: ${stripHtml(resume.basics.about)}
Location: ${resume.basics.location.city}, ${resume.basics.location.region}, ${resume.basics.location.countryCode}
Contact:\n${buildContactChannels(resume)}
Education:\n${education}
Languages: ${dictionary.cv.languagesList.join(" ")}

Knowledge areas:\n${knowledgeAreas}

Work experience:\n${work}

Projects:\n${projects}
`.trim();
};

const buildPrompt = ({
  message,
  messages,
  fileContexts,
  lang,
  portfolioContext,
}: {
  message: string;
  messages: string;
  fileContexts: string;
  lang: Locale;
  portfolioContext: string;
}) => {
  const languageInstruction =
    lang === "es"
      ? "Respondé en español rioplatense neutral, claro y profesional. Usá voseo moderado cuando suene natural."
      : "Respond in clear, professional English.";

  const systemPrompt = `
You are the AI assistant embedded in Matias Rios' portfolio.
You answer as a helpful portfolio assistant, not as Matias himself.
${languageInstruction}

Use ONLY the candidate context below. Be honest and do not invent employers, metrics, credentials, availability, compensation, or experience.
If something is not explicit in the context, say so and suggest confirming it directly with Matias.

Conversation behavior:
- There is no separate JD mode. Every user message is free-form.
- If the user pastes a job description, naturally analyze fit, strengths, gaps, and useful interview questions.
- If the user attached file context (PDF, DOCX, TXT, or Markdown), use it as user-provided context for the latest question. Distinguish attached-file claims from Matias' portfolio facts when needed.
- When attached file context is present, do not ask the user what to attach. Acknowledge/use the attached file; if the written message is ambiguous, briefly summarize what the attachment appears to contain and ask what they want to do with it.
- If the user asks a normal question, answer directly and briefly.
- If the user asks how to contact Matias, use the explicit contact channels in the Contact section. Prefer email and LinkedIn for professional contact.
- Keep continuity with the recent conversation when it matters.

Formatting rules:
- Return clean Markdown only.
- Start with a direct one-sentence answer.
- Use **bold labels** and bullet lists for readability.
- For job descriptions, prefer sections like **Fit**, **Why it matches**, **Gaps / clarify**, and **Interview questions**.
- Avoid tables unless they are clearly better.
- Do not wrap the response in JSON, code fences, or quotes.
- Keep it concise, but useful.

Candidate context:\n${portfolioContext}
`.trim();

  const taskPrompt = `
Recent conversation:
${messages || "No previous messages."}

${fileContexts || "No attached file context."}

Latest user message:
${message || "No written message. The user only attached file context."}
`.trim();

  return { systemPrompt, taskPrompt };
};

const getFallbackMessage = (
  lang: Locale,
  type: "config" | "quota" | "generic",
) => {
  if (lang === "en") {
    if (type === "config") {
      return "The assistant UI is ready, but the Gemini API key is not configured yet. Add GEMINI_API_KEY in the environment to enable live answers.";
    }
    if (type === "quota") {
      return "The AI quota is temporarily exhausted. Please try again in a few minutes or contact Matias directly.";
    }
    return "I couldn't generate an answer right now. Please try again in a moment.";
  }

  if (type === "config") {
    return "El asistente ya está integrado, pero falta configurar la API key de Gemini. Agregá GEMINI_API_KEY en el entorno para habilitar respuestas reales.";
  }
  if (type === "quota") {
    return "La cuota de IA está temporalmente agotada. Probá de nuevo en unos minutos o contactá a Matias directamente.";
  }
  return "No pude generar una respuesta ahora. Probá de nuevo en un momento.";
};

export async function POST(request: Request) {
  try {
    const clientId = getClientId(request);
    if (!(await checkRateLimit({
      clientId,
      limit: RATE_LIMIT_MAX_REQUESTS,
      scope: "recruiter-chat",
    }))) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const body = (await request.json().catch(() => null)) as RequestBody | null;
    if (!body) {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    const lang = isLocale(body.lang) ? body.lang : "es";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const fileContexts = normalizeFileContexts(
      body.fileContexts ?? body.pdfContexts,
    );

    if (!message && !fileContexts) {
      return NextResponse.json({ error: "empty_message" }, { status: 400 });
    }

    if (message.length > MAX_INPUT_CHARS) {
      return NextResponse.json(
        { error: "message_too_long", maxChars: MAX_INPUT_CHARS },
        { status: 413 },
      );
    }

    const resume = await getResume(lang);

    if (message && isContactQuestion(message)) {
      return NextResponse.json({ answer: buildContactAnswer(resume, lang) });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          answer: getFallbackMessage(lang, "config"),
          missingConfig: true,
        },
        { status: 503 },
      );
    }

    const dictionary = await getDictionary(lang);

    const { systemPrompt, taskPrompt } = buildPrompt({
      message,
      messages: normalizeHistory(body.messages),
      fileContexts,
      lang,
      portfolioContext: buildPortfolioContext(resume, dictionary),
    });

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: taskPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.45,
            maxOutputTokens: 1100,
          },
        }),
      },
    );

    const data = (await geminiResponse.json()) as GeminiResponse;

    if (!geminiResponse.ok) {
      const isQuota = geminiResponse.status === 429;
      return NextResponse.json(
        {
          answer: getFallbackMessage(lang, isQuota ? "quota" : "generic"),
          error: data.error?.message || "gemini_error",
        },
        { status: geminiResponse.status },
      );
    }

    const answer = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim();

    if (!answer) {
      return NextResponse.json(
        { answer: getFallbackMessage(lang, "generic") },
        { status: 502 },
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Portfolio assistant error", error);
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}
