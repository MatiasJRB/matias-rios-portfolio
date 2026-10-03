import type { Resume } from "@/types";
import type { Locale } from "@/i18n/config";
import type { ChatEvidence } from "@/lib/chat-response";

export const getProjectAnchor = (name: string) => `project-${name.normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

type EvidenceNote = { slug: string; title: string; href: string };

export const buildChatEvidence = (resume: Resume, lang: Locale, notes: EvidenceNote[]): ChatEvidence[] => [
  { id: "profile:cv", label: lang === "es" ? "CV de Matias" : "Matias' CV", href: `/${lang}/cv`, kind: "profile" },
  ...resume.work.map((job): ChatEvidence => ({
    id: `experience:${job.name}`, label: `${job.name} · ${job.position}`,
    href: `/${lang}#job-${job.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`, kind: "experience",
  })),
  ...(resume.projects ?? []).filter((project) => project.featured || project.showInArchive !== false)
    .map((project): ChatEvidence => ({
      id: `project:${project.name}`, label: project.name,
      href: `/${lang}#${getProjectAnchor(project.name)}`, kind: "project",
    })),
  ...notes.map((note): ChatEvidence => ({ id: `note:${note.slug}`, label: note.title, href: note.href, kind: "note" })),
];

/** IDs select real portfolio sources; unknown/duplicate/model URLs are dropped. */
export const resolveChatEvidence = (ids: unknown, catalog: ChatEvidence[]) => {
  if (!Array.isArray(ids)) return [];
  const allowed = new Map(catalog.map((source) => [source.id, source]));
  return [...new Set(ids.filter((id): id is string => typeof id === "string"))]
    .flatMap((id) => allowed.has(id) ? [allowed.get(id)!] : []).slice(0, 3);
};
