"use client";
import { useEffect, useState, useRef } from "react";

import About from "@/components/About";
import Presentation from "../components/Presentation";
import Selector from "@/components/Selector";
import SocialMedia from "@/components/SocialMedia";
import History from "@/components/History";

const Page = () => {
  const [mobile, setMobile] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop += event.deltaY;
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-screen-xl mx-auto md:px-24 lg:px-24  bg-primary">
      {/* First Column */}
      <div className={`  ${mobile ? "mt-[-64px]" : ""}`}>
        <div className="pt-24 mb-6 md:mb-16">
          <Presentation />
          <Selector className="mt-8" />
          <SocialMedia className="mt-8" />
        </div>
        {/* <Selector /> */}
        <div className="mt-auto mb-20 md:mb-24">{/* <SocialMedia /> */}</div>
      </div>

      {/* Second Column with Scrollable Area */}
      <div
        className="right-column 
        h-screen overflow-y-auto md:h-auto md:overflow-visible"
        ref={scrollAreaRef}
        onWheel={(e) => {
          e.stopPropagation(); // Evita que el scroll afecte otras partes
        }}
      >
        {!mobile && <div style={{ marginTop: "96px" }} />}
        <About />
        <About />
        <History className="mt-8" />

        {/* <History className="mb-36" />
        <Footer className="mb-24" /> */}
      </div>

      {/* <GlowingCursor className="z-10" /> */}
    </div>
  );
};

export default Page;
