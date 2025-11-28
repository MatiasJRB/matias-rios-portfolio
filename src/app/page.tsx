"use client";
import { useEffect, useState, useRef } from "react";

import About from "@/components/About";
import Presentation from "../components/Presentation";
import Selector from "@/components/Selector";
import SocialMedia from "@/components/SocialMedia";
import History from "@/components/History";
import Footer from "@/components/Footer";
import ThemeSwitch from "@/components/ThemeSwitch";
import MobileHeader from "@/components/MobileHeader";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { SkipToContent } from "@/components/SkipToContent";

const Page = () => {
  const [mobile, setMobile] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
        scrollAreaRef.current.style.overflow = "auto"; // ✅ Corregido
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
      <SkipToContent />
      <ParallaxBackground />
      <MobileHeader />
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
        </div>{" "}
        <div
          className={`left-column ${mobile ? "mt-[-48px]" : ""} flex flex-col`}
        >
          <div className="pt-16 md:pt-24 mb-6 md:mb-16 px-0 md:px-4">
            <Presentation />
            {!mobile && <Selector className="mt-8 lg:mt-16" />}
            <div className="lg:fixed lg:bottom-16 w-full flex justify-between items-center mt-8">
              <SocialMedia />
            </div>
          </div>
        </div>{" "}
        {/* Second Column with Scrollable Area */}{" "}
        <div 
          id="main-content"
          className="right-column px-0 md:px-4" 
          ref={scrollAreaRef}
          tabIndex={-1}
        >
          {!mobile && <div className="mt-24" />}{" "}
          {mobile && (
            <div
              className="text-xs font-bold mb-2 uppercase tracking-wider"
              style={{ color: "var(--color-muted)" }}
            >
              About
            </div>
          )}
          <About className="mt-8" />{" "}
          {mobile && (
            <div
              className="mt-8 text-xs font-bold mb-2 uppercase tracking-wider"
              style={{ color: "var(--color-muted)" }}
            >
              History
            </div>
          )}
          <History className="mt-8" />
          <Footer className="my-8" />
        </div>
      </div>
    </>
  );
};

export default Page;
