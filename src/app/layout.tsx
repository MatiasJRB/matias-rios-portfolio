import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import GlowingCursor from "@/components/GlowingCursor";
import Firebase from "@/components/Firebase";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark antialiased `}>
        <GlowingCursor />
        <Firebase />

        {children}
      </body>
    </html>
  );
}
