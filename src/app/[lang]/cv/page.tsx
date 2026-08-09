import type { Metadata } from "next";
import Link from "next/link";
import { type Locale } from "@/i18n/config";
import CVHeader from "@/components/CVHeader";
import CVDownloadButton from "@/components/CVDownloadButton";
import CVWorkExperience from "@/components/CVWorkExperience";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  getAlternateLanguageUrls,
  getLocalizedUrl,
  getPreviewImageUrl,
} from "@/lib/site";

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
          alt: lang === "es" ? "Vista previa del CV de Matias Rios" : "Matias Rios CV preview",
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
  const dictionary = await getDictionary(lang);

  return (
    <>
      <div
        className="min-h-screen py-4 md:py-8 lg:py-16 px-2 sm:px-4 lg:px-8 cv-container transition-colors duration-300 print:p-0"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        {/* Back to home button */}
        <div className="max-w-[794px] mx-auto mb-4 md:mb-6 no-print px-2">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-[var(--color-primary)] dark:text-gray-300 dark:hover:text-[var(--color-primary)]"
          >
            {dictionary.cv.backToHome}
          </Link>
        </div>

        {/* A4 Paper container */}
        <article className="cv-page max-w-[794px] mx-auto bg-white dark:bg-gray-950 shadow-lg md:shadow-2xl rounded md:rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 print:shadow-none print:border-0 print:rounded-none">
          {/* Inner content with padding */}
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 lg:py-10 print:p-8">
            {/* Header with social icons */}
            <CVHeader
              name="RIOS MATIAS"
              title={dictionary.cv.title}
              email="matiasjriosb@gmail.com"
            />

            {/* Professional Summary */}
            <section className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {dictionary.cv.summary}
              </p>
            </section>

            {/* Areas of Knowledge */}
            <section className="mb-4">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                {dictionary.cv.areasOfKnowledge}
              </h2>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                <li className="leading-relaxed">
                  <strong>{dictionary.cv.areas.backend.title}</strong>{" "}
                  {dictionary.cv.areas.backend.description}
                </li>
                <li className="leading-relaxed">
                  <strong>{dictionary.cv.areas.testing.title}</strong>{" "}
                  {dictionary.cv.areas.testing.description}
                </li>
                <li className="leading-relaxed">
                  <strong>{dictionary.cv.areas.api.title}</strong>{" "}
                  {dictionary.cv.areas.api.description}
                </li>
                <li className="leading-relaxed">
                  <strong>{dictionary.cv.areas.database.title}</strong>{" "}
                  {dictionary.cv.areas.database.description}
                </li>
                <li className="leading-relaxed">
                  <strong>{dictionary.cv.areas.cloud.title}</strong>{" "}
                  {dictionary.cv.areas.cloud.description}
                </li>
                <li className="leading-relaxed">
                  <strong>{dictionary.cv.areas.collaboration.title}</strong>{" "}
                  {dictionary.cv.areas.collaboration.description}
                </li>
                <li className="leading-relaxed">
                  <strong>{dictionary.cv.areas.leadership.title}</strong>{" "}
                  {dictionary.cv.areas.leadership.description}
                </li>
                <li className="leading-relaxed">
                  <strong>{dictionary.cv.areas.frontend.title}</strong>{" "}
                  {dictionary.cv.areas.frontend.description}
                </li>
              </ul>
            </section>

            {/* Professional Experience */}
            <section className="mb-4">
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                {dictionary.cv.professionalExperience}
              </h2>

              {dictionary.cv.experiences.map((exp, index) => (
                <CVWorkExperience
                  key={index}
                  position={exp.position}
                  company={exp.company}
                  period={exp.period}
                  description={exp.description}
                  highlights={exp.highlights}
                />
              ))}
            </section>

            {/* Education */}
            <section className="mb-4">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                {dictionary.cv.education}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                <strong>{dictionary.cv.educationDetail}</strong>
              </p>
            </section>

            {/* Languages */}
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                {dictionary.cv.languages}
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                {dictionary.cv.languagesList.map((language, index) => (
                  <li key={index}>{language}</li>
                ))}
              </ul>
            </section>
          </div>
        </article>
      </div>

      {/* Download PDF Button - Moved outside container to prevent sticky issues caused by transforms */}
      <CVDownloadButton lang={lang} downloadText={dictionary.cv.downloadPdf} />
    </>
  );
}
