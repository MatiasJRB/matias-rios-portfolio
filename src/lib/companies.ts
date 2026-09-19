import type { Resume } from "@/types";

// Names that show up in copy but are not how the company is listed in `work`.
const COMPANY_ALIASES: Record<string, string> = {
  Mangxo: "Mango",
};

/**
 * Company name -> site, derived from the resume so copy and experience never drift.
 */
export function buildCompanyUrls(resume: Resume): Record<string, string> {
  const urls: Record<string, string> = {};

  resume.work?.forEach((job) => {
    if (job.name && job.url) urls[job.name] = job.url;
  });

  Object.entries(COMPANY_ALIASES).forEach(([alias, canonical]) => {
    const url = urls[canonical];
    if (url) urls[alias] = url;
  });

  return urls;
}

export function getCompanyUrl(
  urls: Record<string, string>,
  name?: string,
): string | undefined {
  return name ? urls[name] : undefined;
}
