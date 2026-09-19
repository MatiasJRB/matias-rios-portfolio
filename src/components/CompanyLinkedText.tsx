import React from "react";

const COMPANY_LINK_CLASS =
  "underline decoration-[color-mix(in_srgb,var(--color-primary)_50%,transparent)] decoration-1 underline-offset-4 transition-[color,text-decoration-color] hover:decoration-[var(--color-primary)]";

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Renders plain copy, turning every known company name into a link to its site.
 * Keeps the source string plain text, which the CV and the assistant context reuse.
 */
export default function CompanyLinkedText({
  text,
  urls,
  linkClassName = COMPANY_LINK_CLASS,
}: {
  text: string;
  urls: Record<string, string>;
  linkClassName?: string;
}) {
  const names = Object.keys(urls).sort((a, b) => b.length - a.length);
  if (names.length === 0) return <>{text}</>;

  const pattern = new RegExp(`\\b(${names.map(escapeRegExp).join("|")})\\b`, "g");

  return (
    <>
      {text.split(pattern).map((part, index) =>
        urls[part] ? (
          <a
            key={`${part}-${index}`}
            href={urls[part]}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            {part}
          </a>
        ) : (
          <React.Fragment key={`text-${index}`}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}
