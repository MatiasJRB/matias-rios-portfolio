import resume from "@/resume.json";
import Script from "next/script";

export default function JsonLd() {
  const {
    basics: { name, label, url, summary, location, profiles },
    work,
    skills,
  } = resume;

  // Create the schema object
  interface Location {
    city: string;
    region: string;
    countryCode: string;
    postalCode: string;
  }

  interface Profile {
    url: string;
  }

  interface Skill {
    name: string;
  }

  interface Work {
    name: string;
  }

  interface Basics {
    name: string;
    label: string;
    url: string;
    summary: string;
    location: Location;
    profiles: Profile[];
  }

  interface Resume {
    basics: Basics;
    work: Work[];
    skills?: Skill[];
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
    knowsAbout?: (string | undefined)[];
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
    knowsAbout: skills?.map((skill: Skill | undefined) => skill?.name),
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
