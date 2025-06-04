import resume from "@/resume.json";
import Script from "next/script";

export default function JsonLd() {
  const {
    basics: { name, label, url, summary, location, profiles },
    work,
  } = resume;
  // Create the schema object
  interface Profile {
    url: string;
  }

  interface Work {
    name: string;
  }

  const schema: {
    "@context": string;
    "@type": string;
    name: string;
    jobTitle: string;
    description: string;
    url: string;
    address: {
      "@type": string;
      addressLocality: string;
      addressRegion: string;
      addressCountry: string;
      postalCode: string;
    };
    sameAs: string[];
    worksFor: { "@type": string; name: string }[];
  } = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: label,
    description: summary,
    url,
    address: {
      "@type": "PostalAddress",
      addressLocality: location.city,
      addressRegion: location.region,
      addressCountry: location.countryCode,
      postalCode: location.postalCode,
    },
    sameAs: profiles.map((profile: Profile) => profile.url),
    worksFor: work.map((job: Work) => ({
      "@type": "Organization",
      name: job.name,
    })),
  };

  // Using next/script is better for performance than client-side script injection
  return (
    <Script id="json-ld" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(schema)}
    </Script>
  );
}
