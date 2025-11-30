"use client";
import { useEffect, useState, useRef } from "react";
import About from "@/components/About";
import Presentation from "@/components/Presentation";
import Selector from "@/components/Selector";
import SocialMedia from "@/components/SocialMedia";
import History from "@/components/History";
import Footer from "@/components/Footer";

export default function PageContent() {
  const [mobile, setMobile] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
        className={`left-column ${mobile ? "mt-[-48px]" : ""} flex flex-col`}
        aria-label="Profile and navigation"
      >
        <header
          id="presentation"
          className="pt-16 md:pt-24 mb-6 md:mb-16 px-0 md:px-4 scroll-mt-24"
        >
          <Presentation />
          {!mobile && (
            <nav aria-label="Section navigation" className="mt-8 lg:mt-16">
              <Selector className="" />
            </nav>
          )}
          <div className="lg:fixed lg:bottom-16 w-full flex justify-between items-center mt-8">
            <SocialMedia />
          </div>
        </header>
      </aside>

      {/* Right Column - Main Content */}
      <main
        id="main-content"
        className="right-column px-0 md:px-4"
        ref={scrollAreaRef}
        tabIndex={-1}
        aria-label="Main content"
      >
        {!mobile && <div className="mt-24" />}

        {/* About Section */}
        {mobile && (
          <h2
            className="text-xs font-bold mb-2 uppercase tracking-wider"
            style={{ color: "var(--color-muted)" }}
          >
            About
          </h2>
        )}
        <section id="about" aria-labelledby="about-heading">
          <About className="mt-8" />
        </section>

        {/* History/Experience Section */}
        {mobile && (
          <h2
            className="mt-8 text-xs font-bold mb-2 uppercase tracking-wider"
            style={{ color: "var(--color-muted)" }}
          >
            History
          </h2>
        )}
        <section id="history" aria-labelledby="history-heading">
          <History className="mt-8" />
        </section>

        <Footer className="my-8" />
      </main>
    </>
  );
}
