import type { Locale } from "@/i18n/config";
import type { Job } from "@/types";

interface CVWorkExperienceProps {
  job: Job;
  lang: Locale;
  maxHighlights?: number;
}

const MONTHS = {
  es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
} satisfies Record<Locale, string[]>;

function formatDate(value: string, lang: Locale) {
  const normalized = value.toUpperCase();
  if (normalized === "PRESENT" || normalized === "PRESENTE") {
    return lang === "es" ? "Presente" : "Present";
  }

  const [month, year] = value.split("-").map(Number);
  if (!month || !year) return value;
  return `${MONTHS[lang][month - 1]} ${year}`;
}

export default function CVWorkExperience({
  job,
  lang,
  maxHighlights = 2,
}: CVWorkExperienceProps) {
  const period = `${formatDate(job.startDate, lang)} – ${formatDate(job.endDate, lang)}`;

  return (
    <article className="break-inside-avoid border-t border-gray-200 pt-3 first:border-t-0 first:pt-0 dark:border-gray-800 print:pt-2.5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between print:flex-row print:items-baseline print:justify-between">
        <div>
          <h3 className="text-[0.95rem] font-bold text-gray-950 dark:text-white print:text-[9.5pt]">
            {job.position}
          </h3>
          <p className="text-sm font-semibold text-[var(--color-primary)] print:text-[8.5pt]">
            {job.name}
            {job.context ? ` · ${job.context}` : ""}
          </p>
        </div>
        <time className="shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400 print:text-[7.5pt]">
          {period}
        </time>
      </div>

      <p className="mt-1.5 text-sm leading-[1.5] text-gray-600 dark:text-gray-300 print:mt-1 print:text-[8.4pt] print:leading-[1.4]">
        {job.summary}
      </p>

      <ul className="mt-1.5 space-y-1 pl-4 text-sm leading-[1.45] text-gray-700 marker:text-[var(--color-primary)] dark:text-gray-300 print:mt-1 print:space-y-0.5 print:text-[8.2pt] print:leading-[1.35]">
        {job.highlights.slice(0, maxHighlights).map((highlight) => (
          <li key={highlight} className="list-disc pl-0.5">
            {highlight}
          </li>
        ))}
      </ul>
    </article>
  );
}
