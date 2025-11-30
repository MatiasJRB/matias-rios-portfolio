"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
}

const Presentation: React.FC<PresentationProps> = ({ lang }) => {
  const [basics, setBasics] = useState<Basics | null>(null);
  const [dict, setDict] = useState<Dictionary | null>(null);

  useEffect(() => {
    async function loadData() {
      const [resumeModule, dictModule] = await Promise.all([
        import(`@/data/resume/${lang}.json`),
        import(`@/i18n/dictionaries/${lang}.json`)
      ]);
      setBasics(resumeModule.default.basics);
      setDict(dictModule.default);
    }
    loadData();
  }, [lang]);

  if (!basics || !dict) return null;
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
        {lang === 'en' 
          ? 'I am always looking for new opportunities to work on exciting projects. If you have an idea or a project in mind, feel free to reach me out.'
          : 'Siempre estoy buscando nuevas oportunidades para trabajar en proyectos emocionantes. Si tienes una idea o un proyecto en mente, no dudes en contactarme.'
        }
      </p>
    </motion.div>
  );
};

export default Presentation;
