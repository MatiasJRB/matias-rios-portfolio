import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaClock } from "react-icons/fa";
import ThemeSwitch from "@/components/ThemeSwitch";
import PortfolioShaderBackdrop from "@/components/PortfolioShaderBackdrop";
import type { Note } from "@/content/notes";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

interface NoteArticleProps {
  note: Note;
  lang: Locale;
  dictionary: Dictionary;
}

export default function NoteArticle({
  note,
  lang,
  dictionary,
}: NoteArticleProps) {
  const isSourceLocale = lang === note.locale;

  return (
    <>
      <PortfolioShaderBackdrop />
      <div className="fixed right-5 top-5 z-30 md:right-8 md:top-7">
        <ThemeSwitch />
      </div>

      <main className="relative z-10 mx-auto min-h-[100dvh] w-full max-w-screen-xl px-6 pb-20 pt-24 md:px-12 md:pb-28 md:pt-28 lg:px-20">
        <Link
          href={`/${lang}#notes`}
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
        >
          <FaArrowLeft aria-hidden="true" className="h-3 w-3" />
          {dictionary.notes.backToPortfolio}
        </Link>

        <article className="mt-10 lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-x-16 xl:grid-cols-[13rem_minmax(0,1fr)] xl:gap-x-20">
          <header className="lg:col-start-2 lg:row-start-1">
            <h1 className="max-w-[20ch] text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--color-text)] sm:text-5xl md:text-6xl lg:text-7xl">
              {isSourceLocale ? note.title : note.englishTitle}
            </h1>
            <p className="mt-6 max-w-[65ch] text-lg leading-8 text-[var(--color-muted)] md:mt-7 md:text-xl md:leading-9">
              {isSourceLocale ? note.description : note.englishDescription}
            </p>
            {note.source && isSourceLocale && (
              <a
                href={note.source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-11 items-center border-b border-[var(--color-border)] text-sm font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
              >
                {note.source.label} ↗
              </a>
            )}
          </header>

          <aside className="mt-10 grid grid-cols-[minmax(0,1fr)_auto] gap-x-8 gap-y-5 border-y border-[var(--color-border)] py-5 lg:sticky lg:top-24 lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:mt-0 lg:block lg:self-start">
            <div>
              <p className="text-2xl font-semibold tabular-nums tracking-[-0.025em] text-[var(--color-text)]">
                {note.originYear}
              </p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {note.context[lang]}
              </p>
            </div>

            <div className="border-l border-[var(--color-border)] pl-8 lg:mt-5 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-5">
              {note.draft && (
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-secondary)]">
                  {dictionary.notes.draft}
                </p>
              )}
              <p
                className={`${note.draft ? "mt-4" : ""} inline-flex items-center gap-2 text-sm tabular-nums text-[var(--color-muted)]`}
              >
                <FaClock aria-hidden="true" className="h-3 w-3" />
                {note.readingMinutes} {dictionary.notes.minutes}
              </p>
            </div>

            <ul
              aria-label={dictionary.notes.tagsLabel}
              className="col-span-2 flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--color-border)] pt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)] lg:mt-5 lg:block lg:space-y-2"
            >
              {note.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </aside>

          <div className="min-w-0 lg:col-start-2 lg:row-start-2">
            {!isSourceLocale ? (
              <div className="mt-10 border-y border-[var(--color-border)] py-8 md:mt-12">
                <p className="max-w-[58ch] text-lg leading-8 text-[var(--color-text)]">
                  {dictionary.notes.fullArticleSpanish}
                </p>
                <Link
                  href={`/${note.locale}/notes/${note.slug}`}
                  className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-[var(--color-text)] px-5 text-sm font-semibold text-[var(--color-background)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
                >
                  {dictionary.notes.readInSpanish}
                </Link>
              </div>
            ) : (
              <>
                {note.heroImage && (
                  <figure className="mt-10 md:mt-12">
                    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[0_18px_45px_-34px_var(--shadow-hover)] md:p-3">
                      <Image
                        src={note.heroImage}
                        alt={note.heroAlt}
                        width={849}
                        height={692}
                        sizes="(max-width: 768px) calc(100vw - 3rem), 760px"
                        className="h-auto w-full rounded-lg"
                        priority
                      />
                    </div>
                    <figcaption className="mt-3 max-w-[68ch] text-sm leading-6 text-[var(--color-muted)]">
                      {note.heroCaption}
                    </figcaption>
                  </figure>
                )}

                <div
                  className={`${note.heroImage ? "mt-12 md:mt-14" : "mt-10 md:mt-12"} max-w-[68ch]`}
                >
                  {note.sections.map((section, sectionIndex) => (
                    <section
                      key={section.heading ?? `opening-${sectionIndex}`}
                      className={sectionIndex === 0 ? "" : "mt-14"}
                    >
                      {section.heading && (
                        <h2 className="mb-6 text-2xl font-semibold leading-tight tracking-[-0.025em] text-[var(--color-text)] md:text-3xl">
                          {section.heading}
                        </h2>
                      )}
                      <div className="space-y-6">
                        {section.paragraphs.map((paragraph) => (
                          <p
                            key={paragraph}
                            className="text-base leading-8 text-[var(--color-text-secondary)] md:text-lg md:leading-9"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                {note.pendingChecks.length > 0 && (
                  <aside className="mt-16 max-w-[68ch] border-y border-[var(--color-secondary)] py-7">
                    <h2 className="text-lg font-semibold text-[var(--color-text)]">
                      {dictionary.notes.beforePublishing}
                    </h2>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
                      {note.pendingChecks.map((check) => (
                        <li key={check}>{check}</li>
                      ))}
                    </ul>
                  </aside>
                )}
              </>
            )}
          </div>
        </article>
      </main>
    </>
  );
}
