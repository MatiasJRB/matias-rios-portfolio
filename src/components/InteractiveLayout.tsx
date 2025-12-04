"use client";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { SkipToContent } from "@/components/SkipToContent";
import { KeyboardNavigationHint } from "@/components/KeyboardNavigationHint";
import ThemeSwitch from "@/components/ThemeSwitch";
import MobileHeader from "@/components/MobileHeader";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { Profile } from "@/types";

interface InteractiveLayoutProps {
  children: React.ReactNode;
  lang: Locale;
  dictionary: Dictionary;
  profiles: Profile[];
  scrollAreaRef?: React.RefObject<HTMLDivElement | null>;
}

export default function InteractiveLayout({
  children,
  lang,
  dictionary,
  profiles,
}: InteractiveLayoutProps) {
  // Keyboard navigation setup - auto-discovers navigable elements
  const { isKeyboardMode, currentActionHint } = useKeyboardNavigation({
    smooth: true,
  });

  // Scroll nativo del navegador para mejor UX y compatibilidad con MagneticButtons
  // La columna izquierda será sticky y la derecha fluirá con el documento.

  return (
    <>
      <SkipToContent lang={lang} />
      <KeyboardNavigationHint
        isKeyboardMode={isKeyboardMode}
        actionHint={currentActionHint}
        dictionary={dictionary}
      />
      <MobileHeader dictionary={dictionary} profiles={profiles} />
      <div
        className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16 w-full
         px-6 max-w-screen-xl mx-auto md:px-12 lg:px-20 transition-colors duration-300"
        style={{
          backgroundColor: "var(--color-background)",
          color: "var(--color-text)",
        }}
      >
        <div className="fixed right-5 top-5 md:right-6 md:top-6 z-50">
          <ThemeSwitch />
        </div>
        {children}
      </div>
    </>
  );
}
