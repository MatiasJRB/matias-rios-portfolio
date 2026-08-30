import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import CVDownloadButton from "@/components/CVDownloadButton";
import CVHeader from "@/components/CVHeader";
import CVWorkExperience from "@/components/CVWorkExperience";
import { getResume } from "@/data/get-resume";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  getAlternateLanguageUrls,
  getLocalizedUrl,
  getPreviewImageUrl,
} from "@/lib/site";

const CORE_SKILL_KEYS = [
  "systemDesign",
  "productEngineering",
  "technicalLeadership",
  "backendEngineering",
] as const;

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-950 dark:border-gray-800 dark:text-white print:mb-2 print:pb-1.5 print:text-[8pt]">
      {children}
    </h2>
  );
}

function SheetFooter({ page, label }: { page: number; label: string }) {
  return (
    <footer className="mt-auto border-t border-gray-200 pt-3 text-right text-xs font-semibold uppercase tracking-[0.12em] text-gray-400 dark:border-gray-800 print:pt-2 print:text-[7pt]">
      {label} {page} / 2
    </footer>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === "es" ? "CV | Matias Rios" : "Resume | Matias Rios";
  const description =
    lang === "es"
      ? "Curriculum Vitae de Matias Rios, Tech Lead e Ingeniero de Software."
      : "Resume of Matias Rios, Tech Lead and Software Engineer.";
  const previewImageUrl = getPreviewImageUrl();

  return {
    title,
    description,
    alternates: {
      canonical: getLocalizedUrl(lang, "/cv"),
      languages: getAlternateLanguageUrls("/cv"),
    },
    openGraph: {
      title,
      description,
      url: getLocalizedUrl(lang, "/cv"),
      type: "profile",
      images: [
        {
          url: previewImageUrl,
          width: 1200,
          height: 630,
          alt:
            lang === "es"
              ? "Vista previa del CV de Matias Rios"
              : "Matias Rios CV preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [previewImageUrl],
    },
  };
}

export default async function CVPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const [dictionary, resume] = await Promise.all([
    getDictionary(lang),
    getResume(lang),
  ]);
  const employment = resume.work.filter(
    (job) => job.kind !== "venture" && job.kind !== "practice",
  );
  const foundations = resume.work.filter((job) => job.kind === "practice");
  const ventures = resume.work.filter((job) => job.kind === "venture");
  const selectedProjects = (resume.projects ?? [])
    .filter((project) => project.featured)
    .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99))
    .slice(0, 3);

  return (
    <>
      <div
        className="cv-container min-h-screen px-3 py-5 transition-colors duration-300 sm:px-5 md:py-10 print:p-0"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div className="no-print mx-auto mb-5 flex max-w-[794px] items-center justify-between gap-4">
          <Link
            href={`/${lang}`}
            className="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-gray-600 outline-none transition-colors hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)] dark:text-gray-300"
          >
            {dictionary.cv.backToHome}
          </Link>
          <CVDownloadButton
            lang={lang}
            downloadText={dictionary.cv.downloadPdf}
          />
        </div>

        <div className="mx-auto flex max-w-[794px] flex-col gap-6 print:block">
          <article className="cv-page cv-sheet flex min-h-[1123px] flex-col bg-white px-6 py-7 text-gray-950 shadow-2xl dark:bg-gray-950 dark:text-white sm:px-9 sm:py-9 md:px-12 print:min-h-0 print:px-0 print:py-0 print:shadow-none">
            <CVHeader basics={resume.basics} lang={lang} />

            <section className="mb-6 print:mb-4">
              <SectionTitle>{dictionary.cv.profile}</SectionTitle>
              <p className="max-w-[72ch] text-base leading-[1.55] text-gray-700 dark:text-gray-300 print:text-[8.8pt] print:leading-[1.45]">
                {resume.basics.summary}
              </p>
            </section>

            <section className="mb-6 print:mb-4">
              <SectionTitle>{dictionary.cv.coreStrengths}</SectionTitle>
              <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 print:grid-cols-2 print:gap-y-2">
                {CORE_SKILL_KEYS.map((key) => {
                  const skill = dictionary.skills[key];
                  return (
                    <div key={key} className="break-inside-avoid">
                      <h3 className="text-sm font-bold text-gray-950 dark:text-white print:text-[8.5pt]">
                        {skill.label}
                      </h3>
                      <p className="mt-0.5 text-xs leading-[1.45] text-gray-600 dark:text-gray-400 print:text-[7.5pt]">
                        {skill.ecosystems.slice(0, 4).join(" · ")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <SectionTitle>{dictionary.cv.professionalExperience}</SectionTitle>
              <div className="space-y-3.5 print:space-y-2.5">
                {employment.map((job, index) => (
                  <CVWorkExperience
                    key={`${job.name}-${job.startDate}`}
                    job={job}
                    lang={lang}
                    maxHighlights={index === 0 ? 3 : 2}
                  />
                ))}
              </div>
            </section>

            <SheetFooter page={1} label={dictionary.cv.page} />
          </article>

          <article className="cv-page cv-sheet flex min-h-[1123px] flex-col bg-white px-6 py-7 text-gray-950 shadow-2xl dark:bg-gray-950 dark:text-white sm:px-9 sm:py-9 md:px-12 print:min-h-0 print:px-0 print:py-0 print:shadow-none">
            <header className="mb-7 border-b border-gray-200 pb-4 dark:border-gray-800 print:mb-5 print:pb-3">
              <p className="font-display text-2xl font-bold tracking-[-0.035em] text-gray-950 dark:text-white print:text-[16pt]">
                {resume.basics.name}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)] print:text-[8pt]">
                {dictionary.cv.careerContinuation}
              </p>
            </header>

            <section className="mb-7 print:mb-5">
              <SectionTitle>{dictionary.cv.earlyFoundation}</SectionTitle>
              <div className="space-y-4 print:space-y-3">
                {foundations.map((job) => (
                  <CVWorkExperience
                    key={`${job.name}-${job.startDate}`}
                    job={job}
                    lang={lang}
                    maxHighlights={2}
                  />
                ))}
              </div>
            </section>

            <section className="mb-7 print:mb-5">
              <SectionTitle>{dictionary.cv.independentVenture}</SectionTitle>
              <div className="space-y-4 print:space-y-3">
                {ventures.map((job) => (
                  <CVWorkExperience
                    key={`${job.name}-${job.startDate}`}
                    job={job}
                    lang={lang}
                    maxHighlights={3}
                  />
                ))}
              </div>
            </section>

            <section className="mb-7 print:mb-5">
              <SectionTitle>{dictionary.cv.selectedWork}</SectionTitle>
              <div className="grid grid-cols-1 gap-x-7 gap-y-5 sm:grid-cols-2 print:grid-cols-2 print:gap-y-3">
                {selectedProjects.map((project) => (
                  <article
                    key={project.name}
                    className="break-inside-avoid border-t border-gray-200 pt-3 dark:border-gray-800 print:pt-2"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-bold text-gray-950 dark:text-white print:text-[9pt]">
                        {project.name}
                      </h3>
                      {project.company && (
                        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-primary)] print:text-[7pt]">
                          {project.company}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm leading-[1.45] text-gray-600 dark:text-gray-300 print:mt-1 print:text-[8pt] print:leading-[1.35]">
                      {project.impact ?? project.description}
                    </p>
                    <p className="mt-2 text-xs font-semibold leading-relaxed text-gray-500 dark:text-gray-400 print:mt-1 print:text-[7.2pt]">
                      {project.tech.slice(0, 5).join(" · ")}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 print:grid-cols-2">
              <section>
                <SectionTitle>{dictionary.cv.education}</SectionTitle>
                {(resume.education ?? []).map((education) => (
                  <div key={`${education.institution}-${education.area}`}>
                    <h3 className="text-sm font-bold text-gray-950 dark:text-white print:text-[8.5pt]">
                      {education.studyType}
                    </h3>
                    <p className="mt-1 text-sm leading-[1.45] text-gray-600 dark:text-gray-300 print:text-[8pt]">
                      {education.institution} · {education.endDate}
                    </p>
                  </div>
                ))}
              </section>

              <section>
                <SectionTitle>{dictionary.cv.languages}</SectionTitle>
                <ul className="space-y-1 text-sm leading-[1.45] text-gray-600 dark:text-gray-300 print:text-[8pt]">
                  {(resume.languages ?? []).map((language) => (
                    <li key={language.language}>
                      <strong className="text-gray-950 dark:text-white">
                        {language.language}
                      </strong>
                      {`: ${language.fluency}`}
                    </li>
                  ))}
                  <li>{dictionary.cv.nativeLanguage}</li>
                </ul>
              </section>
            </div>

            <SheetFooter page={2} label={dictionary.cv.page} />
          </article>
        </div>
      </div>

    </>
  );
}
