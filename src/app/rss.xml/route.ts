import { getNotes } from "@/content/notes";
import { getLocalizedUrl, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const notes = getNotes().sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  const lastBuildDate = new Date(
    notes[0]?.publishedAt ?? "2026-09-08",
  ).toUTCString();
  const items = notes
    .map((note) => {
      const url = getLocalizedUrl(note.locale, `/notes/${note.slug}`);
      const categories = note.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("");

      return `<item>
        <title>${escapeXml(note.title)}</title>
        <link>${escapeXml(url)}</link>
        <guid isPermaLink="true">${escapeXml(url)}</guid>
        <pubDate>${new Date(note.publishedAt).toUTCString()}</pubDate>
        <description>${escapeXml(note.description)}</description>
        ${categories}
      </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Notas de Matias Rios</title>
    <link>${SITE_URL}/es/notes</link>
    <description>Producto, software, operaciones, automatización y personas.</description>
    <language>es-AR</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
