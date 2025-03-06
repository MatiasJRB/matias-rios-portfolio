"use client";
import { useEffect, useState, useRef } from "react";

import About from "@/components/About";
import Presentation from "../components/Presentation";
import Selector from "@/components/Selector";
import SocialMedia from "@/components/SocialMedia";
import History from "@/components/History";
import Footer from "@/components/Footer";

const Page = () => {
  const [mobile, setMobile] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
    const updateMobile = () => {
      setMobile(window.innerWidth < 1024);
    };

    updateMobile(); // Ejecutar una vez al montar

    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

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
    <div
      className={`overflow-y-hidden 
      grid grid-cols-1 lg:grid-cols-2 w-full 
      px-6
      max-w-screen-xl mx-auto md:px-24 lg:px-24  bg-dark`}
    >
      {/* First Column */}
      <div
        className={`left-column  ${mobile ? "mt-[-48px]" : ""} flex flex-col`}
      >
        <div className="pt-24 mb-6 md:mb-16">
          <Presentation />

          {!mobile && <Selector className="mt-8 lg:mt-16" />}

          <div className="lg:fixed lg:bottom-16 w-full ">
            <SocialMedia className="mt-8 " />
          </div>
        </div>
        <div className="mt-auto mb-20 md:mb-24">{/* <SocialMedia /> */}</div>
      </div>

      {/* Second Column with Scrollable Area */}
      <div className="right-column" ref={scrollAreaRef}>
        {!mobile && <div style={{ marginTop: "96px" }} />}

        {mobile && <div className=" subtitle">About</div>}

        <About className="mt-8" />

        {mobile && <div className="mt-8 subtitle">History</div>}

        <History className="mt-8" />
        <Footer className="my-8" />
      </div>
    </div>
  );
};

export default Page;
