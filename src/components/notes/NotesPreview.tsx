import Link from "next/link";
import { FaArrowRight, FaClock } from "react-icons/fa";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { getLocalizedNotePreview, getNotes } from "@/content/notes";

interface NotesPreviewProps {
  lang: Locale;
  dictionary: Dictionary;
  includeDrafts?: boolean;
}

export default function NotesPreview({
  lang,
  dictionary,
  includeDrafts = false,
}: NotesPreviewProps) {
  const notes = getNotes({ includeDrafts }).slice(0, 3);

  if (notes.length === 0) return null;

  return (
    <div className="mt-8 border-y border-[var(--color-border)]">
      {notes.map((note) => {
        const preview = getLocalizedNotePreview(note, lang);

        return (
          <article key={note.slug}>
            <Link
              href={preview.href}
              className="group grid gap-5 py-7 outline-none transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--color-primary)_4%,transparent)] focus-visible:bg-[color-mix(in_srgb,var(--color-primary)_4%,transparent)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)] md:grid-cols-[10rem_minmax(0,1fr)_auto] md:items-start md:gap-8 md:py-9"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                <span className="text-[var(--color-primary)]">
                  {note.originYear}
                </span>
                <span className="normal-case tracking-normal">
                  {note.buildDays} {dictionary.notes.daysToBuild}
                </span>
                {note.draft && includeDrafts && (
                  <span className="text-[var(--color-secondary)]">
                    {dictionary.notes.draft}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 normal-case tracking-normal">
                  <FaClock aria-hidden="true" className="h-3 w-3" />
                  {note.readingMinutes} {dictionary.notes.minutes}
                </span>
              </div>

              <div>
                <h3 className="max-w-[24ch] text-2xl font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--color-text)] transition-colors duration-200 group-hover:text-[var(--color-primary)] md:text-3xl">
                  {preview.title}
                </h3>
                <p className="mt-4 max-w-[68ch] text-base leading-7 text-[var(--color-muted)]">
                  {preview.description}
                </p>
                {!preview.isSourceLocale && (
                  <p className="mt-3 text-sm font-semibold text-[var(--color-secondary)]">
                    {dictionary.notes.fullArticleSpanish}
                  </p>
                )}
                <ul
                  aria-label={dictionary.notes.tagsLabel}
                  className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]"
                >
                  {note.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>

              <span
                className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-text)] transition-[transform,border-color,color,background-color] duration-200 group-hover:translate-x-1 group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)] group-focus-visible:translate-x-1"
                aria-hidden="true"
              >
                <FaArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </article>
        );
      })}

      <div className="border-t border-[var(--color-border)] py-5">
        <Link
          href={`/${lang}/notes`}
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-[var(--color-text)] underline decoration-[var(--color-border)] underline-offset-4 transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
        >
          {dictionary.notes.viewAll}
          <FaArrowRight aria-hidden="true" className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
