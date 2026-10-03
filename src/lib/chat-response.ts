export type ChatEvidence = {
  id: string;
  label: string;
  href: string;
  kind: "experience" | "project" | "note" | "profile";
};

export type AssistantResponse = {
  answer: string;
  details?: string;
  sources: ChatEvidence[];
};

// Evidence navigates only to existing, localized portfolio content. Never use
// model-generated URLs or interpret Markdown/HTML as an executable link.
export const isPortfolioEvidenceHref = (href: unknown): href is string =>
  typeof href === "string" &&
  /^\/(?:es|en)(?:#[a-z0-9-]+|\/(?:cv|about)|\/notes\/[a-z0-9-]+)$/.test(href);

export const parseEvidence = (value: unknown): ChatEvidence[] => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.filter((source): source is ChatEvidence => {
    if (!source || typeof source !== "object") return false;
    const { id, label, href, kind } = source;
    if (typeof id !== "string" || typeof label !== "string" || !label.trim() ||
      label.length > 240 || !isPortfolioEvidenceHref(href) ||
      !["experience", "project", "note", "profile"].includes(kind) || seen.has(id)) return false;
    seen.add(id);
    return true;
  }).slice(0, 3);
};

export const parseAssistantResponse = (value: unknown): AssistantResponse | null => {
  if (!value || typeof value !== "object" || !("answer" in value) ||
    typeof value.answer !== "string" || !value.answer.trim()) return null;
  return {
    answer: value.answer.trim().slice(0, 12_000),
    details: "details" in value && typeof value.details === "string"
      ? value.details.trim().slice(0, 12_000) || undefined : undefined,
    sources: parseEvidence("sources" in value ? value.sources : undefined),
  };
};

/** Keep a useful first screen even if a provider ignores the brevity prompt. */
export const getReplyPresentation = (answer: string, details?: string) => {
  const text = answer.trim();
  let boundary = text.length;
  if (text.length > 850) {
    const lineBreak = text.lastIndexOf("\n", 750);
    const sentence = [...text.slice(0, 750).matchAll(/[.!?](?:\s|$)/g)].at(-1);
    boundary = lineBreak >= 200 ? lineBreak : sentence && sentence.index >= 200
      ? sentence.index + 1 : (text.lastIndexOf(" ", 750) >= 200 ? text.lastIndexOf(" ", 750) : 750);
  }
  const preview = text.slice(0, boundary).trim();
  const overflow = text.slice(boundary).trim();
  return { preview, details: [overflow, details?.trim()].filter(Boolean).join("\n\n") };
};

export const getRetryDelay = (status: number, retryAfter: string | null, now = Date.now()) => {
  if (status !== 429) return 0;
  const seconds = Number(retryAfter);
  const dateDelay = retryAfter ? (Date.parse(retryAfter) - now) / 1000 : NaN;
  const delay = retryAfter && Number.isFinite(seconds) ? seconds : dateDelay;
  return Math.max(1, Math.min(Number.isFinite(delay) && delay > 0 ? Math.ceil(delay) : 60, 3600));
};

export const getRetryWindow = (delaySeconds: number, now = Date.now()) => ({
  now, availableAt: now + delaySeconds * 1000,
});
