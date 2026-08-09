import "server-only";
import type { Locale } from "@/i18n/config";

const resumes = {
  en: () => import("./resume/en.json").then((module) => module.default),
  es: () => import("./resume/es.json").then((module) => module.default),
};

export const getResume = async (locale: Locale) =>
  resumes[locale]?.() ?? resumes.en();
