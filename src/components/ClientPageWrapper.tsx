"use client";
import { useRef } from "react";
import InteractiveLayout from "@/components/InteractiveLayout";
import PageContent from "@/components/PageContent";
import type { Locale } from "@/i18n/config";
import type { Resume } from "@/types";
import type { Dictionary } from "@/i18n/types";

interface ClientPageWrapperProps {
  lang: Locale;
  resume: Resume;
  dictionary: Dictionary;
  previewMode?: boolean;
}

export default function ClientPageWrapper({
  lang,
  resume,
  dictionary,
  previewMode = false,
}: ClientPageWrapperProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  return (
    <InteractiveLayout
      lang={lang}
      dictionary={dictionary}
      profiles={resume.basics.profiles}
      scrollAreaRef={scrollAreaRef}
      previewMode={previewMode}
    >
      <PageContent
        lang={lang}
        resume={resume}
        dictionary={dictionary}
        scrollAreaRef={scrollAreaRef}
      />
    </InteractiveLayout>
  );
}
