import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlowingCursor from "@/components/GlowingCursor";
import Firebase from "@/components/Firebase";
import JsonLd from "@/components/JsonLd";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
});

import resume from "../resume.json";
const {
  basics: { name, summary: description },
} = resume;

export const metadata: Metadata = {
  title: name,
  description,
  metadataBase: new URL("https://matiasjrb.com.ar"),
  openGraph: {
    title: `${name} | Software Engineer | Full-Stack Developer`,
    description,
    url: "https://matiasjrb.com.ar",
    siteName: name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg", // Cambiado a ruta relativa
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
    images: ["/images/og-image.jpg"], // Cambiado a ruta relativa
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased transition-colors duration-300`}
      >
        <ThemeProvider>
          <GlowingCursor />
          <Firebase />
          <JsonLd />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
