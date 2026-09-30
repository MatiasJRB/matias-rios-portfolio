"use client";

import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import CompanyLinkedText from "@/components/CompanyLinkedText";
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
  lang: Locale;
  companyUrls: Record<string, string>;
}

const Presentation: React.FC<PresentationProps> = ({
  basics,
  dictionary,
  lang,
  companyUrls,
}) => {
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
              borderRadius: "22%",
              border:
                "1px solid color-mix(in srgb, var(--color-border) 86%, transparent)",
              boxShadow: "8px 10px 26px var(--shadow)",
            }}
            priority
          />
        )}
        <h1 className="font-display text-4xl font-bold leading-tight tracking-[-0.03em] md:text-5xl lg:text-5xl xl:text-6xl">
          <Link
            className="cursor-pointer rounded-sm outline-none transition-colors duration-200 hover:text-[color:var(--color-primary)] focus-visible:text-[color:var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)]"
            href={`/${lang}/about`}
            style={{ color: "var(--color-text)" }}
          >
            {basics.name}
          </Link>
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
        <CompanyLinkedText text={basics.summary} urls={companyUrls} />
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
          href={`mailto:${basics.email}`}
          className="control-hover inline-flex min-h-11 items-center justify-center rounded-xl border px-5 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)]"
          style={{
            color: "var(--color-text)",
            borderColor: "var(--color-border)",
            backgroundColor:
              "color-mix(in srgb, var(--color-surface) 42%, transparent)",
          }}
        >
          {dictionary.cta.contact}
        </a>
        <Link
          href={`/${lang}/about`}
          className="inline-flex min-h-11 items-center justify-center rounded-xl px-1 text-sm font-semibold underline-offset-4 outline-none transition-colors hover:text-[color:var(--color-text)] hover:underline focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)]"
          style={{ color: "var(--color-muted)" }}
        >
          {dictionary.cta.moreAboutMe}
        </Link>
      </div>
    </div>
  );
};

export default Presentation;
