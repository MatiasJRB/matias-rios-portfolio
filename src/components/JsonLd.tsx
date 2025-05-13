import resume from "@/resume.json";
import Script from "next/script";

export default function JsonLd() {
  const {
    basics: { name, label, url, summary, location, profiles },
    work,
    skills,
  } = resume;

  // Create the schema object
  const schema = {
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
    sameAs: profiles.map((profile) => profile.url),
    knowsAbout: skills.map((skill) => skill.name),
    worksFor: work.map((job) => ({
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
