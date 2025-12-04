"use client";
import { useEffect, useState } from "react";
import About from "@/components/About";
import Presentation from "@/components/Presentation";
import Selector from "@/components/Selector";
import SocialMedia from "@/components/SocialMedia";
import History from "@/components/History";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale } from "@/i18n/config";
import type { Resume } from "@/types";
import type { Dictionary } from "@/i18n/types";

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
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => {
      setMobile(window.innerWidth < 1024);
    };
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  return (
    <>
      {/* Left Column - Header Section */}
      <aside
        className={`left-column ${
          mobile ? "mt-[-48px]" : ""
        } flex flex-col lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto`}
        aria-label="Profile and navigation"
        style={{ scrollbarWidth: "none" }}
      >
        <header
          id="presentation"
          className="pt-20 md:pt-32 lg:pt-24 mb-8 md:mb-12 lg:mb-16 px-0 scroll-mt-24"
        >
          <Presentation
            lang={lang}
            basics={resume.basics}
            dictionary={dictionary}
          />
          {!mobile && (
            <nav aria-label="Section navigation" className="mt-12 lg:mt-20">
              <Selector dictionary={dictionary} className="" />
            </nav>
          )}
          <div className="lg:fixed lg:bottom-12 w-full flex justify-between items-center mt-12 lg:mt-16">
            <SocialMedia
              profiles={resume.basics.profiles}
              dictionary={dictionary}
            />
            <LanguageSwitcher currentLocale={lang} />
          </div>
        </header>
      </aside>

      {/* Right Column - Main Content */}
      <main
        id="main-content"
        className="right-column px-0"
        ref={scrollAreaRef}
        tabIndex={-1}
        aria-label="Main content"
      >
        {!mobile && <div className="mt-32" />}

        {/* About Section */}
        {mobile && (
          <h2
            className="text-xs font-bold mb-3 uppercase tracking-wider"
            style={{ color: "var(--color-muted)" }}
          >
            {dictionary.sections.about}
          </h2>
        )}
        <section id="about" aria-labelledby="about-heading">
          <About about={resume.basics.about} className="mt-6" />
        </section>

        {/* History/Experience Section */}
        {mobile && (
          <h2
            className="mt-16 text-xs font-bold mb-3 uppercase tracking-wider"
            style={{ color: "var(--color-muted)" }}
          >
            {dictionary.sections.history}
          </h2>
        )}
        <section id="history" aria-labelledby="history-heading">
          <History
            lang={lang}
            work={resume.work}
            className="mt-6 lg:mt-12"
            dictionary={dictionary}
          />
        </section>

        <Footer
          footer={resume.footer}
          className="mt-20 mb-12 lg:mt-24 lg:mb-16"
        />
      </main>
    </>
  );
}
