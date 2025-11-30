"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

interface Basics {
  name: string;
  label: string;
  summary: string;
  email: string;
}

interface PresentationProps {
  lang: Locale;
  basics: Basics;
  dictionary: Dictionary;
}

const Presentation: React.FC<PresentationProps> = ({ basics, dictionary }) => {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
    >
      <div className="mb-2">
        <a
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl cursor-pointer font-black tracking-tighter leading-tight"
          href="#about"
          style={{
            color: "var(--color-text)",
            textShadow: "0 0 40px rgba(0, 255, 148, 0.1)",
          }}
        >
          {basics.name}
        </a>
      </div>
      <div
        className="mt-2 text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight"
        style={{ color: "var(--color-text)" }}
      >
        {basics.label}
      </div>
      <p
        className="mt-4 lg:mt-6 text-lg md:text-xl leading-relaxed max-w-xs md:max-w-md lg:max-w-lg font-medium"
        style={{ color: "var(--color-muted)" }}
      >
        {basics.summary}
      </p>
      <p
        className="mt-4 lg:mt-6 text-base md:text-lg leading-relaxed max-w-xs md:max-w-md lg:max-w-lg"
        style={{ color: "var(--color-muted)" }}
      >
        {dictionary.cta.lookingForOpportunities}
      </p>
    </motion.div>
  );
};

export default Presentation;
