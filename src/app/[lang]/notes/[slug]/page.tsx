import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NoteArticle from "@/components/notes/NoteArticle";
import { getDictionary } from "@/i18n/get-dictionary";
import { i18n, type Locale } from "@/i18n/config";
import { getNote, getNotes } from "@/content/notes";
import { getLocalizedUrl, SITE_URL } from "@/lib/site";

interface NotePageProps {
  params: Promise<{ lang: string; slug: string }>;
}

function toLocale(value: string): Locale {
  if (!i18n.locales.includes(value as Locale)) notFound();
  return value as Locale;
}

export const dynamicParams = false;

export function generateStaticParams() {
  const includeDrafts = process.env.NODE_ENV !== "production";

  return getNotes({ includeDrafts }).map((note) => ({
    lang: note.locale,
    slug: note.slug,
  }));
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = toLocale(rawLang);
  const note = getNote(slug);

  if (
    !note ||
    lang !== note.locale ||
    (note.draft && process.env.NODE_ENV === "production")
  ) {
    notFound();
  }

  const title = note.title;
  const description = note.description;
  const canonicalUrl = getLocalizedUrl(
    note.locale,
    `/notes/${note.slug}`,
  );
  const imageUrl = `${SITE_URL}${note.heroImage ?? "/images/og-image.png"}`;

  return {
    title: `${title} | Matias Rios`,
    description,
    authors: [{ name: "Matias Rios", url: SITE_URL }],
    keywords: note.tags,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: note.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      url: canonicalUrl,
      siteName: "Matias Rios",
      locale: "es_AR",
      publishedTime: note.publishedAt,
      tags: note.tags,
      images: [
        {
          url: imageUrl,
          width: 849,
          height: 692,
          alt: note.heroAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@matiasriosj",
      images: [imageUrl],
    },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { lang: rawLang, slug } = await params;
  const lang = toLocale(rawLang);
  const note = getNote(slug);

  if (
    !note ||
    lang !== note.locale ||
    (note.draft && process.env.NODE_ENV === "production")
  ) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return <NoteArticle note={note} lang={lang} dictionary={dictionary} />;
}
