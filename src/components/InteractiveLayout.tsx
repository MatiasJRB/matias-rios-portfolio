"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { KeyboardNavigationHint } from "@/components/KeyboardNavigationHint";
import ThemeSwitch from "@/components/ThemeSwitch";
import MobileHeader from "@/components/MobileHeader";
import PortfolioShaderBackdrop from "@/components/PortfolioShaderBackdrop";
import CinematicEffects from "@/components/CinematicEffects";
import RecruiterBot from "@/components/RecruiterBot";
import PortfolioTimeMachine from "@/components/time-machine/PortfolioTimeMachine";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { Profile } from "@/types";

interface InteractiveLayoutProps {
  children: React.ReactNode;
  lang: Locale;
  dictionary: Dictionary;
  profiles: Profile[];
  scrollAreaRef?: React.RefObject<HTMLDivElement | null>;
  previewMode?: boolean;
}

export default function InteractiveLayout({
  children,
  lang,
  dictionary,
  profiles,
  previewMode = false,
}: InteractiveLayoutProps) {
  const pathname = usePathname();
  const isCVPage = pathname?.includes("/cv");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard navigation setup - auto-discovers navigable elements
  const { isKeyboardMode, currentActionHint, currentActionColor } =
    useKeyboardNavigation({
      smooth: true,
      dictionary,
    });

  // Scroll nativo del navegador para mejor UX y compatibilidad con MagneticButtons
  // La columna izquierda será sticky y la derecha fluirá con el documento.

  return (
    <>
      {!isCVPage && (
        <MobileHeader dictionary={dictionary} profiles={profiles} />
      )}
      {mounted && !isCVPage && <PortfolioShaderBackdrop />}
      {mounted && !isCVPage && <CinematicEffects />}
      {!isCVPage && !previewMode && (
        <div className="fixed right-[8.5rem] top-5 z-[310] flex h-[38px] items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 shadow-sm md:right-[9rem] md:top-6 lg:right-6 lg:bottom-6 lg:top-auto lg:h-auto lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:shadow-none">
          <PortfolioTimeMachine lang={lang} dictionary={dictionary} />
          <div className="hidden lg:block">
            <KeyboardNavigationHint
              isKeyboardMode={isKeyboardMode}
              actionHint={currentActionHint}
              actionColor={currentActionColor}
              dictionary={dictionary}
            />
          </div>
        </div>
      )}
      <div className="fixed right-5 top-5 z-[300] flex items-center md:right-6 md:top-6">
        <ThemeSwitch />
      </div>
      <div
        className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16 w-full
         px-6 max-w-screen-xl mx-auto md:px-12 lg:px-20 transition-colors duration-300"
        style={{
          backgroundColor: "transparent",
          color: "var(--color-text)",
        }}
      >
        {children}
      </div>
      {!isCVPage && <RecruiterBot lang={lang} dictionary={dictionary} />}
    </>
  );
}
