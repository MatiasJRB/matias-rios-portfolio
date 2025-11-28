"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KeyboardNavigationIndicatorProps {
  currentSection: string | null;
  isActive: boolean;
}

export const KeyboardNavigationIndicator = ({
  currentSection,
  isActive,
}: KeyboardNavigationIndicatorProps) => {
  const [sectionLabel, setSectionLabel] = useState<string>("");

  useEffect(() => {
    if (!currentSection) return;

    // Convert section IDs to readable labels
    const labels: Record<string, string> = {
      presentation: "Presentación",
      about: "Sobre mí",
      history: "Experiencia",
      "job-mangxo": "Mangxo",
      "job-geome7ric": "Geome7ric",
      "job-kalkomey": "Kalkomey",
      "job-nuqlea": "Nuqlea",
    };

    setSectionLabel(labels[currentSection] || currentSection);
  }, [currentSection]);

  return (
    <AnimatePresence>
      {isActive && currentSection && (
        <motion.div
          className="fixed left-1/2 top-20 z-50 pointer-events-none"
          style={{
            transform: "translateX(-50%)",
          }}
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div
            className="px-6 py-3 rounded-full backdrop-blur-xl border-2"
            style={{
              backgroundColor: "rgba(0, 238, 144, 0.15)",
              borderColor: "var(--color-primary)",
              boxShadow:
                "0 0 30px rgba(0, 238, 144, 0.4), 0 10px 30px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div className="flex items-center gap-3">
              {/* Animated pulse dot */}
              <motion.div
                className="relative w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "var(--color-primary)",
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: "var(--color-primary)",
                  }}
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.7, 0, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              {/* Section label */}
              <span
                className="text-sm font-semibold tracking-wide"
                style={{
                  color: "var(--color-primary)",
                  textShadow: "0 0 10px rgba(0, 238, 144, 0.5)",
                }}
              >
                {sectionLabel}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
