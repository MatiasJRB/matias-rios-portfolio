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

  return (
    <motion.div
      className={cn("w-full", className)}
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
        <div
          className="space-y-4"
          dangerouslySetInnerHTML={{ __html: about }}
          style={{ color: "var(--color-muted)" }}
        />
      )}
    </motion.div>
  );
}
