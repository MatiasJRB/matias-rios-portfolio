import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { i18n, type Locale } from "@/i18n/config";
import { getResume } from "@/data/get-resume";
import ClientEffects from "@/components/ClientEffects";
import JsonLd from "@/components/JsonLd";
import {
  getAlternateLanguageUrls,
  getLocalizedUrl,
  getPreviewImageUrl,
  SITE_URL,
} from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-body",
});

const toLocale = (value: string): Locale =>
  i18n.locales.includes(value as Locale)
    ? (value as Locale)
    : i18n.defaultLocale;

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = toLocale(rawLang);
  const resume = await getResume(lang);
  const {
    basics: { name, summary: description },
  } = resume;
  const previewImageUrl = getPreviewImageUrl();

  return {
    title: `${name} | ${resume.basics.label}`,
    description,
    metadataBase: new URL(SITE_URL),
    keywords: [
      "Matias Rios",
      "Software Engineer",
      "Full Stack Developer",
      "React Developer",
      "Next.js Developer",
      "Backend Engineer",
      "Frontend Developer",
      "TypeScript",
      "Node.js",
      "JavaScript",
      "Web Development",
      "Bahía Blanca Developer",
      "Argentina Developer",
      "Software Development",
      "Mobile Development",
      "Tech Lead",
      "Portfolio",
      "Curriculum Vitae",
    ],
    authors: [{ name: "Matias Rios", url: SITE_URL }],
    creator: "Matias Rios",
    publisher: "Matias Rios",
    alternates: {
      canonical: getLocalizedUrl(lang),
      languages: getAlternateLanguageUrls(),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: "technology",
    openGraph: {
      title: `${name} | Software Engineer | Full-Stack Developer`,
      description,
      url: getLocalizedUrl(lang),
      siteName: name,
      locale: lang === "es" ? "es_AR" : "en_US",
      type: "website",
      images: [
        {
          url: previewImageUrl,
          width: 1200,
          height: 630,
          alt:
            lang === "es"
              ? `${name} vista previa del portfolio`
              : `${name} portfolio preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Software Engineer | Full-Stack Developer`,
      description,
      creator: "@matiasriosj",
      images: [previewImageUrl],
    },
    icons: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/icons/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/icons/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        url: "/icons/favicon-96x96.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "128x128",
        url: "/icons/favicon-128x128.png",
      },
    ],
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang: rawLang } = await params;
  const lang = toLocale(rawLang);

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Preconnect to optimize third-party resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* DNS prefetch for faster lookups */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link
          rel="alternate"
          type="text/plain"
          href={`${SITE_URL}/llms.txt`}
          title="LLM Summary"
        />
        <link
          rel="alternate"
          type="text/plain"
          href={`${SITE_URL}/llms-full.txt`}
          title="LLM Full Content"
        />
      </head>
      <body
        className={`${inter.className} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ClientEffects />
          <JsonLd lang={lang} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
