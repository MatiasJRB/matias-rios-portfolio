import { MetadataRoute } from "next";
import { i18n } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://matiasjrb.com.ar";
  const currentDate = new Date().toISOString();

  // Generate routes for each locale
  return i18n.locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          i18n.locales.map((l) => [l, `${baseUrl}/${l}`])
        ),
      },
    },
  ]);
}
