import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaArrowRight, FaClock } from "react-icons/fa";
import ThemeSwitch from "@/components/ThemeSwitch";
import PortfolioShaderBackdrop from "@/components/PortfolioShaderBackdrop";
import { getLocalizedNotePreview, getNotes } from "@/content/notes";
import { i18n, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocalizedUrl } from "@/lib/site";

interface NotesPageProps {
  params: Promise<{ lang: string }>;
}

function toLocale(value: string): Locale {
  if (!i18n.locales.includes(value as Locale)) notFound();
  return value as Locale;
}

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = toLocale(rawLang);
  const dictionary = await getDictionary(lang);
  const hasPublishedNotes = getNotes().length > 0;

  return {
    title: `${dictionary.notes.indexTitle} | Matias Rios`,
    description: dictionary.notes.indexDescription,
    alternates: {
      canonical: getLocalizedUrl(lang, "/notes"),
    },
    robots: hasPublishedNotes ? undefined : { index: false, follow: false },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { lang: rawLang } = await params;
  const lang = toLocale(rawLang);
  const dictionary = await getDictionary(lang);
  const includeDrafts = process.env.NODE_ENV !== "production";
  const notes = getNotes({ includeDrafts });

  return (
    <>
      <PortfolioShaderBackdrop />
      <div className="fixed right-5 top-5 z-30 md:right-8 md:top-7">
        <ThemeSwitch />
      </div>

      <main className="relative z-10 mx-auto min-h-[100dvh] w-full max-w-screen-xl px-6 pb-20 pt-24 md:px-12 md:pb-28 md:pt-28 lg:px-20">
        <Link
          href={`/${lang}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
        >
          <FaArrowLeft aria-hidden="true" className="h-3 w-3" />
          {dictionary.notes.backToPortfolio}
        </Link>

        <header className="mt-12 max-w-3xl">
          <h1 className="text-5xl font-semibold leading-none tracking-[-0.035em] text-[var(--color-text)] md:text-7xl">
            {dictionary.notes.indexTitle}
          </h1>
          <p className="mt-7 max-w-[65ch] text-lg leading-8 text-[var(--color-muted)] md:text-xl md:leading-9">
            {dictionary.notes.indexDescription}
          </p>
        </header>

        {notes.length === 0 ? (
          <p className="mt-16 border-y border-[var(--color-border)] py-8 text-[var(--color-muted)]">
            {dictionary.notes.empty}
          </p>
        ) : (
          <div className="mt-16 border-y border-[var(--color-border)]">
            {notes.map((note) => {
              const preview = getLocalizedNotePreview(note, lang);

              return (
                <article
                  key={note.slug}
                  className="border-b border-[var(--color-border)] last:border-b-0"
                >
                  <Link
                    href={preview.href}
                    className="group grid gap-5 py-8 outline-none transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--color-primary)_4%,transparent)] focus-visible:bg-[color-mix(in_srgb,var(--color-primary)_4%,transparent)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)] md:grid-cols-[10rem_minmax(0,1fr)_auto] md:gap-10 md:py-10"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)] md:block md:space-y-3">
                      <p className="text-[var(--color-primary)]">
                        {note.originYear}
                      </p>
                      <p className="normal-case tracking-normal">
                        {note.buildDays} {dictionary.notes.daysToBuild}
                      </p>
                      {note.draft && includeDrafts && (
                        <p className="text-[var(--color-secondary)]">
                          {dictionary.notes.draft}
                        </p>
                      )}
                      <p className="inline-flex items-center gap-1.5 normal-case tracking-normal">
                        <FaClock aria-hidden="true" className="h-3 w-3" />
                        {note.readingMinutes} {dictionary.notes.minutes}
                      </p>
                    </div>

                    <div>
                      <h2 className="max-w-[25ch] text-2xl font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--color-text)] transition-colors duration-200 group-hover:text-[var(--color-primary)] md:text-4xl">
                        {preview.title}
                      </h2>
                      <p className="mt-4 max-w-[68ch] text-base leading-7 text-[var(--color-muted)] md:text-lg md:leading-8">
                        {preview.description}
                      </p>
                      {!preview.isSourceLocale && (
                        <p className="mt-3 text-sm font-semibold text-[var(--color-secondary)]">
                          {dictionary.notes.fullArticleSpanish}
                        </p>
                      )}
                    </div>

                    <span
                      aria-hidden="true"
                      className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-text)] transition-[transform,border-color,color] duration-200 group-hover:translate-x-1 group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)]"
                    >
                      <FaArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
