import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaExternalLinkAlt, FaMapMarkerAlt } from "react-icons/fa";
import About from "@/components/About";
import SocialMedia from "@/components/SocialMedia";
import ThemeSwitch from "@/components/ThemeSwitch";
import PortfolioShaderBackdrop from "@/components/PortfolioShaderBackdrop";
import { getResume } from "@/data/get-resume";
import { i18n, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getAlternateLanguageUrls, getLocalizedUrl } from "@/lib/site";

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

function toLocale(value: string): Locale {
  if (!i18n.locales.includes(value as Locale)) notFound();
  return value as Locale;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = toLocale(rawLang);
  const dictionary = await getDictionary(lang);

  return {
    title: `${dictionary.about.title} | Matias Rios`,
    description: dictionary.about.description,
    alternates: {
      canonical: getLocalizedUrl(lang, "/about"),
      languages: getAlternateLanguageUrls("/about"),
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang: rawLang } = await params;
  const lang = toLocale(rawLang);
  const [resume, dictionary] = await Promise.all([
    getResume(lang),
    getDictionary(lang),
  ]);
  const { basics } = resume;
  const location = [basics.location?.city, basics.location?.region]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <PortfolioShaderBackdrop />
      <div className="fixed right-5 top-5 z-30 md:right-8 md:top-7">
        <ThemeSwitch />
      </div>

      <main className="relative z-10 mx-auto min-h-[100dvh] w-full max-w-screen-xl px-6 pb-24 pt-24 md:px-12 md:pb-28 md:pt-28 lg:px-20">
        <Link
          href={`/${lang}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
        >
          <FaArrowLeft aria-hidden="true" className="h-3 w-3" />
          {dictionary.about.backToPortfolio}
        </Link>

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-16">
          {/* Identity rail */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            {basics.image && (
              <Image
                src={basics.image}
                alt={basics.name}
                width={288}
                height={288}
                unoptimized
                className="h-44 w-44 object-cover md:h-56 md:w-56 lg:h-60 lg:w-60"
                style={{
                  borderRadius: "22%",
                  border:
                    "1px solid color-mix(in srgb, var(--color-border) 86%, transparent)",
                  boxShadow: "10px 12px 32px var(--shadow)",
                }}
                priority
              />
            )}
            <p className="mt-7 font-display text-2xl font-semibold tracking-[-0.02em] text-[var(--color-text)]">
              {basics.name}
            </p>
            <p className="mt-2 max-w-[28ch] text-base leading-[1.6] text-[var(--color-muted)]">
              {basics.label}
            </p>
            {location && (
              <p className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--color-muted)]">
                <FaMapMarkerAlt aria-hidden="true" className="h-3 w-3" />
                {location}
              </p>
            )}
            <SocialMedia
              className="mt-7"
              profiles={basics.profiles}
              dictionary={dictionary}
              lang={lang}
            />
          </aside>

          {/* Story */}
          <div>
            <h1 className="text-5xl font-semibold leading-none tracking-[-0.035em] text-[var(--color-text)] md:text-7xl">
              {dictionary.about.title}
            </h1>
            <p className="mt-5 max-w-[65ch] text-lg leading-8 text-[var(--color-muted)] md:text-xl md:leading-9">
              {dictionary.about.description}
            </p>

            <section
              aria-labelledby="about-story"
              className="mt-10 border-t border-[var(--color-border)] pt-8"
            >
              <h2
                id="about-story"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]"
              >
                {dictionary.about.storyTitle}
              </h2>
              <About about={basics.about} className="mt-5" />
            </section>

            <section aria-labelledby="about-timeline" className="mt-20">
              <h2
                id="about-timeline"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]"
              >
                {dictionary.about.timelineTitle}
              </h2>
              <ol className="mt-8 border-t border-[var(--color-border)]">
                {dictionary.about.milestones.map((milestone) => (
                  <li
                    key={milestone.year}
                    className="grid gap-2 border-b border-[var(--color-border)] py-7 md:grid-cols-[6rem_minmax(0,1fr)] md:gap-10"
                  >
                    <span className="text-sm font-semibold tracking-[0.14em] text-[var(--color-primary)]">
                      {milestone.year}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold leading-snug text-[var(--color-text)]">
                        {milestone.href ? (
                          <a
                            href={milestone.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-baseline gap-2 underline decoration-[color-mix(in_srgb,var(--color-primary)_50%,transparent)] decoration-1 underline-offset-4 transition-[color,text-decoration-color] hover:decoration-[var(--color-primary)]"
                          >
                            {milestone.title}
                            <FaExternalLinkAlt
                              aria-hidden="true"
                              className="h-2.5 w-2.5 shrink-0 text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-primary)]"
                            />
                          </a>
                        ) : (
                          milestone.title
                        )}
                      </h3>
                      <p className="mt-2 max-w-[62ch] text-base leading-[1.75] text-[var(--color-muted)]">
                        {milestone.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
