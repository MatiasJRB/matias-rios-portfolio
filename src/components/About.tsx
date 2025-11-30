"use client";

import { cn } from "@/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { SkeletonAbout } from "./SkeletonLoader";
import type { AboutProps, Basics } from "@/types";

export default function About({ className }: AboutProps) {
  const [about, setAbout] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("../resume.json").then((data) => {
      setAbout((data.basics as Basics).about);
      setIsLoading(false);
    });
  }, []);

  // Convert HTML string to paragraphs with keyboard navigation support
  const renderNavigableParagraphs = (htmlString: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    const paragraphs = tempDiv.querySelectorAll('p');
    
    return Array.from(paragraphs).map((p, index) => (
      <div 
        key={index} 
        data-paragraph
        className="relative scroll-mt-24"
        style={{ paddingLeft: '24px' }}
      >
        {/* Green dot indicator */}
        <div 
          className="keyboard-indicator absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500 transition-opacity duration-200"
          style={{ opacity: 0 }}
        />
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-muted)" }}
          dangerouslySetInnerHTML={{ __html: p.innerHTML }}
        />
      </div>
    ));
  };

  return (
    <motion.div
      className={cn("w-full scroll-mt-24", className)}
      id="about"
      style={{ color: "var(--color-muted)" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {isLoading ? (
        <SkeletonAbout />
      ) : (
        <div className="space-y-4">
          {renderNavigableParagraphs(about)}
        </div>
      )}
    </motion.div>
  );
}
