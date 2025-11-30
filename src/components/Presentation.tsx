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
      <div className="mb-1">
        <a
          className="text-4xl lg:text-6xl cursor-pointer font-bold"
          href="#about"
          style={{ color: "var(--color-text)" }}
        >
          {basics.name}
        </a>
      </div>
      <div className="mt-2 text-lg lg:text-xl">{basics.label}</div>
      <p
        className="mt-4 lg:mt-8 text-base leading-relaxed max-w-xs md:max-w-sm lg:max-w-sm"
        style={{ color: "var(--color-muted)" }}
      >
        {basics.summary}
      </p>
      <p
        className="mt-4 lg:mt-8 text-base leading-relaxed max-w-xs md:max-w-sm lg:max-w-sm"
        style={{ color: "var(--color-muted)" }}
      >
        {dictionary.cta.lookingForOpportunities}
      </p>
    </motion.div>
  );
};

export default Presentation;
