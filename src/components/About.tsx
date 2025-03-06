"use client";

import { cn } from "@/utils";
import resume from "../resume.json";

type Basics = {
  about: string;
};

const { about } = resume.basics as Basics;

interface AboutProps {
  className?: string;
}

export default function About({ className }: AboutProps) {
  return (
    // dentro deeste div, salto de linea por cada <p> en about
    <div className={cn("w-full", className)} id="about">
      <div className="space-y-4" dangerouslySetInnerHTML={{ __html: about }} />
    </div>
  );
}
