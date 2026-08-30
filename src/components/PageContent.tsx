"use client";
import dynamic from "next/dynamic";
import type { Locale } from "@/i18n/config";
import type { Resume } from "@/types";
import type { Dictionary } from "@/i18n/types";
import SocialMedia from "@/components/SocialMedia";
import { getSlideInAnimation } from "@/hooks/useSlideInAnimation";

// Lazy load heavy components with prefetching
const About = dynamic(() => import("@/components/About"), {
  loading: () => (
    <div className="h-24 animate-pulse bg-gray-200/10 rounded-lg" />
  ),
});
const Presentation = dynamic(() => import("@/components/Presentation"));
const Selector = dynamic(() => import("@/components/Selector"));
const History = dynamic(() => import("@/components/History"), {
  loading: () => (
    <div className="h-64 animate-pulse bg-gray-200/10 rounded-lg" />
  ),
});
const SkillsMatrix = dynamic(() => import("@/components/SkillsMatrix"), {
  loading: () => (
    <div className="h-48 animate-pulse bg-gray-200/10 rounded-lg" />
  ),
});
const Projects = dynamic(() => import("@/components/Projects"), {
  loading: () => (
    <div className="h-48 animate-pulse bg-gray-200/10 rounded-lg" />
  ),
});
const Footer = dynamic(() => import("@/components/Footer"));

function SectionHeading({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const animation = getSlideInAnimation(0);

  return (
    <h2
      id={id}
      className={`font-display text-3xl font-semibold leading-none tracking-[-0.02em] md:text-4xl ${animation.className} ${className}`}
      style={{ color: "var(--color-text)", ...animation.style }}
    >
      {children}
    </h2>
  );
}

export default function PageContent({
  lang,
  resume,
  dictionary,
  scrollAreaRef,
}: {
  lang: Locale;
  resume: Resume;
  dictionary: Dictionary;
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
}) {
  const githubUrl = resume.basics.profiles.find((profile) =>
    (profile.icon || "").toLowerCase().includes("github"),
  )?.url;
  const contactUrl = resume.basics.profiles.find(
    (profile) =>
      (profile.icon || "").toLowerCase().includes("email") ||
      profile.url.startsWith("mailto:"),
  )?.url;

  return (
    <>
      {/* Left Column - Header Section */}
      <aside
        className="left-column"
        aria-label="Profile and navigation"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex flex-col lg:sticky lg:top-0 lg:h-screen">
          <header
            id="presentation"
            className="mb-8 px-0 pt-20 scroll-mt-24 md:mb-12 md:pt-32 lg:mb-10 lg:pt-20"
          >
            <Presentation basics={resume.basics} dictionary={dictionary} />
            <nav
              aria-label="Section navigation"
              className="mt-8 hidden lg:block"
            >
              <Selector dictionary={dictionary} className="" />
            </nav>
            <div className="mt-8 lg:mt-6">
              <SocialMedia
                profiles={resume.basics.profiles}
                dictionary={dictionary}
                lang={lang}
              />
            </div>
          </header>
        </div>
      </aside>

      {/* Right Column - Main Content */}
      <main
        id="main-content"
        className="right-column px-0 lg:pt-20"
        ref={scrollAreaRef}
        tabIndex={-1}
        aria-label="Main content"
      >
        {/* About Section */}
        <section id="about" aria-labelledby="about-heading">
          <SectionHeading id="about-heading">
            {dictionary.sections.about}
          </SectionHeading>
          <About about={resume.basics.about} className="mt-7" />
        </section>

        {/* Skills Section */}
        <section
          id="skills"
          aria-labelledby="skills-heading"
          className="mt-20 lg:mt-24"
        >
          <SectionHeading id="skills-heading">
            {dictionary.sections.skills}
          </SectionHeading>
          <SkillsMatrix className="mt-8" dictionary={dictionary} />
        </section>

        {/* History/Experience Section */}
        <section
          id="history"
          aria-labelledby="history-heading"
          className="mt-20 lg:mt-24"
        >
          <SectionHeading id="history-heading">
            {dictionary.sections.history}
          </SectionHeading>
          <History
            lang={lang}
            work={resume.work}
            className="mt-8"
            dictionary={dictionary}
          />
        </section>

        {/* Education Section */}
        {resume.education && resume.education.length > 0 && (
          <section
            id="education"
            aria-labelledby="education-heading"
            className="mt-20 lg:mt-24"
          >
            <SectionHeading id="education-heading" className="mb-8">
              {dictionary.sections.education}
            </SectionHeading>
            {resume.education.map((edu, index) => {
              const animation = getSlideInAnimation(index + 1);

              return (
                <div
                  key={`${edu.institution}-${edu.area}`}
                  className={`group ${animation.className}`}
                  style={animation.style}
                >
                  <div className="flex items-baseline gap-2">
                    <h3
                      className="text-base font-semibold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {edu.studyType} — {edu.area}
                    </h3>
                  </div>
                  <p
                    className="mt-1 text-base leading-relaxed"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {edu.url ? (
                      <a
                        href={edu.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {edu.institution}
                      </a>
                    ) : (
                      edu.institution
                    )}
                    {" · "}
                    {edu.startDate} — {edu.endDate}
                  </p>
                </div>
              );
            })}
          </section>
        )}
      </main>

      {/* Projects Section - full-width desktop row */}
      {resume.projects && resume.projects.length > 0 && (
        <section
          id="projects"
          aria-labelledby="projects-heading"
          className="mt-20 lg:col-span-2 lg:mt-28"
        >
          <SectionHeading id="projects-heading">
            {dictionary.sections.projects}
          </SectionHeading>
          <Projects
            projects={resume.projects}
            dictionary={dictionary}
            githubUrl={githubUrl}
            contactUrl={contactUrl}
            className="mt-8 lg:mt-10"
          />
        </section>
      )}

      <div
        className="lg:col-span-2 mt-16 border-t pt-10 lg:mt-20 lg:grid lg:grid-cols-2 lg:gap-16"
        style={{
          borderColor:
            "color-mix(in srgb, var(--color-border) 58%, transparent)",
        }}
      >
        <section aria-label="Social media" className="lg:pt-7">
          <SocialMedia
            profiles={resume.basics.profiles}
            dictionary={dictionary}
            lang={lang}
            behavior="justify-start"
            className="items-center"
          />
        </section>

        <Footer
          footer={resume.footer}
          className="mt-12 mb-12 lg:mt-7 lg:mb-16"
        />
      </div>
    </>
  );
}
