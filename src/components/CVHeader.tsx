import type { Basics } from "@/types";
import type { Locale } from "@/i18n/config";

interface CVHeaderProps {
  basics: Basics;
  lang: Locale;
}

const PROFILE_LINK_CLASS =
  "inline-flex min-h-11 items-center rounded-sm outline-none transition-colors hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)] print:min-h-0 print:ring-0";

function findProfileUrl(basics: Basics, profileName: "github" | "linkedin") {
  return basics.profiles.find((profile) =>
    (profile.icon ?? "").toLowerCase().includes(profileName),
  )?.url;
}

export default function CVHeader({ basics, lang }: CVHeaderProps) {
  const github = findProfileUrl(basics, "github");
  const linkedin = findProfileUrl(basics, "linkedin");
  const location = [basics.location.city, basics.location.countryCode]
    .filter(Boolean)
    .join(", ");

  return (
    <header className="mb-6 border-b border-gray-200 pb-5 dark:border-gray-800 print:mb-4 print:pb-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:flex-row print:items-end print:justify-between">
        <div>
          <h1 className="font-display text-[2.4rem] font-bold leading-none tracking-[-0.035em] text-gray-950 dark:text-white print:text-[25pt]">
            {basics.name}
          </h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)] print:text-[9pt]">
            {basics.label}
          </p>
        </div>

        <div className="text-sm leading-6 text-gray-600 dark:text-gray-300 sm:text-right print:text-[8.5pt] print:leading-[1.45] print:text-gray-700">
          <p>{location}</p>
          <a className="hover:text-[var(--color-primary)]" href={`mailto:${basics.email}`}>
            {basics.email}
          </a>
        </div>
      </div>

      <nav
        aria-label={lang === "es" ? "Perfiles profesionales" : "Professional profiles"}
        className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400 print:mt-3 print:text-[7.5pt]"
      >
        <a className={PROFILE_LINK_CLASS} href={basics.url}>
          Portfolio
        </a>
        {linkedin && (
          <a className={PROFILE_LINK_CLASS} href={linkedin}>
            LinkedIn
          </a>
        )}
        {github && (
          <a className={PROFILE_LINK_CLASS} href={github}>
            GitHub
          </a>
        )}
      </nav>
    </header>
  );
}
