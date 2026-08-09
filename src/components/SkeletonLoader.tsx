import React from "react";
import { motion } from "framer-motion";
import type { SkeletonProps } from "@/types";

export const SkeletonText = ({ className = "" }: SkeletonProps) => (
  <motion.div
    className={`h-4 rounded-md ${className}`}
    style={{
      backgroundColor: "var(--color-surface)",
    }}
    animate={{
      opacity: [0.5, 0.8, 0.5],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export const SkeletonCircle = ({ className = "" }: SkeletonProps) => (
  <motion.div
    className={`rounded-full ${className}`}
    style={{
      backgroundColor: "var(--color-surface)",
    }}
    animate={{
      opacity: [0.5, 0.8, 0.5],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export const SkeletonHistoryCard = () => (
  <div className="relative mb-8">
    {/* Dot en la línea temporal */}
    <SkeletonCircle className="absolute left-0 top-8 w-3 h-3 hidden md:block" />

    <div className="w-full p-6 md:pl-10 rounded-lg">
      {/* Fecha */}
      <SkeletonText className="w-32 mb-3" />

      {/* Header con logo y título */}
      <div className="flex items-center mb-4">
        <SkeletonCircle className="w-10 h-10 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <SkeletonText className="w-48 mb-2" />
        </div>
      </div>

      {/* Summary */}
      <SkeletonText className="w-full mb-2" />
      <SkeletonText className="w-3/4 mb-4" />

      {/* Highlights */}
      <div className="space-y-2 mt-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-start space-x-3 p-4 rounded-lg"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <SkeletonCircle className="w-8 h-8 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonText className="w-full" />
              <SkeletonText className="w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonAbout = () => (
  <div className="space-y-4">
    <SkeletonText className="w-full" />
    <SkeletonText className="w-full" />
    <SkeletonText className="w-5/6" />
    <SkeletonText className="w-full" />
    <SkeletonText className="w-4/5" />
  </div>
);
