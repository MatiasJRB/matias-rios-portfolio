import { MetadataRoute } from "next";
import resume from "@/resume.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://matiasjrb.com.ar";
  const currentDate = new Date().toISOString();

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Add work experience pages if they exist
  resume.work.forEach((job) => {
    routes.push({
      url: `${baseUrl}/experience/${job.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  });

  return routes;
}
