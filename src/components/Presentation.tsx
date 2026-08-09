"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/types";
import { getSlideInAnimation } from "@/hooks/useSlideInAnimation";

interface Basics {
  name: string;
  label: string;
  summary: string;
  email: string;
  image?: string;
}

interface PresentationProps {
  basics: Basics;
  dictionary: Dictionary;
}

const Presentation: React.FC<PresentationProps> = ({ basics, dictionary }) => {
  const [emailCopied, setEmailCopied] = useState(false);
  const resetCopyTimer = useRef<number | null>(null);
  const mailtoHref = `mailto:${basics.email}?subject=${encodeURIComponent(dictionary.cta.contactSubject)}&body=${encodeURIComponent(dictionary.cta.contactBody)}`;

  useEffect(
    () => () => {
      if (resetCopyTimer.current) window.clearTimeout(resetCopyTimer.current);
    },
    [],
  );

  const handleContactClick = async (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();

    try {
      await navigator.clipboard.writeText(basics.email);
      setEmailCopied(true);
      if (resetCopyTimer.current) window.clearTimeout(resetCopyTimer.current);
      resetCopyTimer.current = window.setTimeout(
        () => setEmailCopied(false),
        2400,
      );
    } catch {
      setEmailCopied(false);
    }

    window.location.href = mailtoHref;
  };

  return (
    <div className="w-full scroll-mt-24">
      <div
        className="mb-7 flex items-center gap-5 animate-slide-in opacity-0"
        style={getSlideInAnimation(0).style}
      >
        {basics.image && (
          <Image
            src={basics.image}
            alt={basics.name}
            width={80}
            height={80}
            unoptimized
            className="h-16 w-16 shrink-0 object-cover transition-transform duration-300 hover:-rotate-2 lg:h-20 lg:w-20"
            style={{
              borderRadius: "1.35rem 1.35rem 1.35rem 0.45rem",
              border:
                "1px solid color-mix(in srgb, var(--color-border) 86%, transparent)",
              boxShadow: "8px 10px 26px var(--shadow)",
            }}
            priority
          />
        )}
        <h1 className="font-display text-4xl font-bold leading-tight tracking-[-0.03em] md:text-5xl lg:text-5xl xl:text-6xl">
          <a
            className="cursor-pointer rounded-sm outline-none transition-colors duration-200 hover:text-[color:var(--color-primary)] focus-visible:text-[color:var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)]"
            href="#about"
            style={{ color: "var(--color-text)" }}
          >
            {basics.name}
          </a>
        </h1>
      </div>
      <div
        className="max-w-xl animate-slide-in text-xl font-semibold leading-tight tracking-[-0.02em] opacity-0 md:text-2xl lg:text-3xl"
        style={{ color: "var(--color-text)", ...getSlideInAnimation(1).style }}
      >
        {basics.label}
      </div>
      <p
        className="mt-7 max-w-[58ch] animate-slide-in text-base font-normal leading-[1.75] opacity-0"
        style={{ color: "var(--color-muted)", ...getSlideInAnimation(2).style }}
      >
        {basics.summary}
      </p>
      <p
        className="mt-5 max-w-[58ch] animate-slide-in text-base font-normal leading-[1.75] opacity-0"
        style={{ color: "var(--color-muted)", ...getSlideInAnimation(3).style }}
      >
        {dictionary.cta.lookingForOpportunities}
      </p>
      <div
        className="mt-8 flex flex-wrap gap-3 animate-slide-in opacity-0"
        style={getSlideInAnimation(4).style}
      >
        <a
          href="#projects"
          className="control-hover inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)]"
          style={{
            color: "var(--color-background)",
            backgroundColor: "var(--color-text)",
          }}
        >
          {dictionary.cta.viewProjects}
        </a>
        <a
          href={mailtoHref}
          onClick={handleContactClick}
          className="control-hover inline-flex min-h-11 items-center justify-center rounded-xl border px-5 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)]"
          style={{
            color: "var(--color-text)",
            borderColor: "var(--color-border)",
            backgroundColor:
              "color-mix(in srgb, var(--color-surface) 42%, transparent)",
          }}
        >
          <span aria-live="polite">
            {emailCopied ? dictionary.cta.emailCopied : dictionary.cta.contact}
          </span>
        </a>
      </div>
    </div>
  );
};

export default Presentation;
