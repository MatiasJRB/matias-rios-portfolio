import type { Locale } from "@/i18n/config";
import { getLocalizedUrl, getPreviewImageUrl, SITE_URL } from "@/lib/site";

export default async function JsonLd({ lang }: { lang: Locale }) {
  const resume = await import(`@/data/resume/${lang}.json`).then(
    (m) => m.default
  );

  const {
    basics: { name, label, summary, location, profiles, email },
    work,
  } = resume;
  const pageUrl = getLocalizedUrl(lang);
  const previewImageUrl = getPreviewImageUrl();
  const sameAs = profiles
    .map((profile: { url: string }) => profile.url)
    .filter((profileUrl: string) => profileUrl.startsWith("http"));

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}#person`,
    name,
    jobTitle: label,
    description: summary,
    url: pageUrl,
    email,
    image: previewImageUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: location.city,
      addressRegion: location.region,
      addressCountry: location.countryCode,
      postalCode: location.postalCode,
    },
    sameAs,
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "JavaScript",
      "Full Stack Development",
      "Software Engineering",
      "Backend Development",
      "Frontend Development",
      "Mobile Development",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: label,
      occupationalCategory: "15-1252.00", // Software Developers, Applications (SOC Code)
      description: summary,
    },
    worksFor: work.slice(0, 1).map((job: { name: string; url?: string }) => ({
      "@type": "Organization",
      name: job.name,
      url: job.url,
    }))[0],
    knowsLanguage: [
      {
        "@type": "Language",
        name: "Spanish",
        alternateName: "es",
      },
      {
        "@type": "Language",
        name: "English",
        alternateName: "en",
      },
    ],
    mainEntityOfPage: {
      "@type": "ProfilePage",
      "@id": `${pageUrl}#profile-page`,
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: `${name} - Portfolio`,
    url: SITE_URL,
    description: `Personal portfolio and professional website of ${name}, ${label}`,
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}#person`,
    },
    inLanguage: lang === "es" ? "es-AR" : "en-US",
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${pageUrl}#profile-page`,
    mainEntity: {
      "@id": `${SITE_URL}#person`,
    },
    url: pageUrl,
    description: summary,
    isPartOf: {
      "@id": `${SITE_URL}#website`,
    },
    inLanguage: lang === "es" ? "es-AR" : "en-US",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: lang === "es" ? "Inicio" : "Home",
        item: pageUrl,
      },
    ],
  };

  const schemas = {
    "@context": "https://schema.org",
    "@graph": [
      personSchema,
      websiteSchema,
      profilePageSchema,
      breadcrumbSchema,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
}
