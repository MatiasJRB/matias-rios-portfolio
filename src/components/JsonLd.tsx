import Script from "next/script";
import type { Locale } from "@/i18n/config";

export default async function JsonLd({ lang }: { lang: Locale }) {
  const resume = await import(`@/data/resume/${lang}.json`).then(m => m.default);
  
  const {
    basics: { name, label, url, summary, location, profiles, email },
    work,
  } = resume;

  // Person Schema - Main schema for the portfolio owner
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: label,
    description: summary,
    url,
    email,
    image: `${url}/images/profile.jpg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: location.city,
      addressRegion: location.region,
      addressCountry: location.countryCode,
      postalCode: location.postalCode,
    },
    sameAs: profiles.map((profile: { url: string }) => profile.url),
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
  };

  // WebSite Schema - For the portfolio website itself
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${name} - Portfolio`,
    url,
    description: `Personal portfolio and professional website of ${name}, ${label}`,
    author: {
      "@type": "Person",
      name,
    },
    inLanguage: lang === 'es' ? 'es-AR' : 'en-US',
  };

  // ProfilePage Schema - Indicates this is a profile page
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name,
      url,
    },
    url,
    description: summary,
  };

  // BreadcrumbList Schema - For navigation
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: url,
      },
    ],
  };

  // Combine all schemas into one array
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
    <Script id="json-ld" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(schemas)}
    </Script>
  );
}
