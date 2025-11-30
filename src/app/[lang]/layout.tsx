import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import GlowingCursor from "@/components/GlowingCursor";
import Firebase from "@/components/Firebase";
import JsonLd from "@/components/JsonLd";
import { ThemeProvider } from "@/components/ThemeProvider";
import { i18n, type Locale } from "@/i18n/config";
import { getResume } from "@/data/get-resume";

const inter = Inter({
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const resume = await getResume(lang);
  const {
    basics: { name, summary: description },
  } = resume;

  return {
    title: name,
    description,
    metadataBase: new URL("https://matiasjrb.com.ar"),
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
    ],
    authors: [{ name: "Matias Rios", url: "https://matiasjrb.com.ar" }],
    creator: "Matias Rios",
    publisher: "Matias Rios",
    alternates: {
      canonical: "https://matiasjrb.com.ar",
      languages: {
        en: "/en",
        es: "/es",
      },
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
      url: "https://matiasjrb.com.ar",
      siteName: name,
      locale: lang === "es" ? "es_AR" : "en_US",
      type: "website",
      images: [
        {
          url: "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Software Engineer | Full-Stack Developer`,
      description,
      creator: "@matiasriosj",
      images: ["/images/og-image.jpg"],
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
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased transition-colors duration-300`}
      >
        <ThemeProvider>
          <GlowingCursor />
          <Firebase />
          <JsonLd lang={lang} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
