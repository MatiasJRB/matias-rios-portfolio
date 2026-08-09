import { MetadataRoute } from "next";
import { i18n } from "@/i18n/config";
import { getLocalizedUrl, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();
  const localizedRoutes = i18n.locales.flatMap((locale) => [
    {
      url: getLocalizedUrl(locale),
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          i18n.locales.map((l) => [l, getLocalizedUrl(l)])
        ),
      },
    },
    {
      url: getLocalizedUrl(locale, "/cv"),
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          i18n.locales.map((l) => [l, getLocalizedUrl(l, "/cv")])
        ),
      },
    },
  ]);

  return [
    ...localizedRoutes,
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/llms-full.txt`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];
}
