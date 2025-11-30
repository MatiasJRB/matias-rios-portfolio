"use client";
import { useEffect, useState, useRef } from "react";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { SkipToContent } from "@/components/SkipToContent";
import { KeyboardNavigationHint } from "@/components/KeyboardNavigationHint";
import ThemeSwitch from "@/components/ThemeSwitch";
import MobileHeader from "@/components/MobileHeader";
import type { Locale } from "@/i18n/config";

interface InteractiveLayoutProps {
  children: React.ReactNode;
  lang: Locale;
}

export default function InteractiveLayout({
  children,
  lang,
}: InteractiveLayoutProps) {
  const [mobile, setMobile] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation setup - auto-discovers navigable elements
  const { isKeyboardMode, currentActionHint } = useKeyboardNavigation({
    smooth: true,
  });

  // Detectar si es mobile
  useEffect(() => {
    const updateMobile = () => {
      setMobile(window.innerWidth < 1024);
    };

    updateMobile(); // Ejecutar una vez al montar

    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  useEffect(() => {
    if (!mobile) {
      // Evitar scroll en el body
      document.body.style.overflow = "hidden";

      if (scrollAreaRef.current) {
        scrollAreaRef.current.style.overflowY = "auto"; // Asegurar que sea scrolleable
        scrollAreaRef.current.style.height = "100vh"; // Fijar altura
      }
    } else {
      document.body.style.overflow = "auto";

      if (scrollAreaRef.current) {
        // Permitir que el body haga scroll en mobile
        scrollAreaRef.current.style.overflow = "auto";
        scrollAreaRef.current.style.height = "auto"; // Restablecer altura
      }
    }
  }, [mobile]);

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (mobile) {
        // scroll the body
        return;
      }

      // prevent scrolling the whole page
      event.preventDefault();

      // escrolleo solo dentro de la columna derecha
      const scrollArea = scrollAreaRef.current;
      if (!scrollArea) return;

      const deltaY = event.deltaY;
      const scrollHeight = scrollArea.scrollHeight;
      const height = scrollArea.clientHeight;
      const maxScroll = scrollHeight - height;

      scrollArea.scrollTop += deltaY;

      if (scrollArea.scrollTop === 0) {
        scrollArea.scrollTop = 1;
      } else if (scrollArea.scrollTop === maxScroll) {
        scrollArea.scrollTop = maxScroll - 1;
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [mobile]);

  return (
    <>
      <SkipToContent lang={lang} />
      <ParallaxBackground />
      <KeyboardNavigationHint
        isKeyboardMode={isKeyboardMode}
        actionHint={currentActionHint}
        lang={lang}
      />
      <MobileHeader lang={lang} />
      <div
        className="min-h-screen overflow-y-hidden grid grid-cols-1 lg:grid-cols-2 w-full
         px-5 max-w-screen-xl mx-auto md:px-16 lg:px-24 transition-colors duration-300"
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
