"use client";

import { cn } from "@/utils";
import resume from "../resume.json";
import { motion } from "framer-motion";

type Basics = {
  about: string;
};

const { about } = resume.basics as Basics;

interface AboutProps {
  className?: string;
}

export default function About({ className }: AboutProps) {
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
      <div
        className="space-y-4"
        dangerouslySetInnerHTML={{ __html: about }}
        style={{ color: "var(--color-muted)" }}
      />
    </motion.div>
  );
}
