import "server-only";
import type { Locale } from "@/i18n/config";
import type { Resume } from "@/types";

const resumes = {
  en: () => import("./resume/en.json").then((module) => module.default),
  es: () => import("./resume/es.json").then((module) => module.default),
};

export const getResume = async (locale: Locale): Promise<Resume> =>
  (await (resumes[locale]?.() ?? resumes.en())) as Resume;
