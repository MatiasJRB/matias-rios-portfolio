"use client";

import { useEffect } from "react";
import resume from "@/resume.json";

export default function JsonLd() {
  const {
    basics: { name, label, url, summary, location, profiles },
    work,
    skills,
  } = resume;

  useEffect(() => {
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

    // Add the script to the DOM
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [
    label,
    location.city,
    location.countryCode,
    location.postalCode,
    location.region,
    name,
    profiles,
    skills,
    summary,
    url,
    work,
  ]);

  return null; // This component doesn't render anything visible
}
