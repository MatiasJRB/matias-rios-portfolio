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
      "job-mango": "Mango",
      "job-mangxo": "Mangxo",
      "job-geome7ric": "Geome7ric",
      "job-kalkomey": "Kalkomey",
      "job-nuqlea": "Nuqlea",
    };

    setSectionLabel(labels[currentSection] || currentSection);
  }, [currentSection]);

  return (
    <AnimatePresence mode="wait">
      {isActive && currentSection && (
        <motion.div
          key={currentSection}
          className="fixed left-1/2 top-20 z-50 pointer-events-none"
          style={{
            transform: "translateX(-50%)",
          }}
          initial={{ opacity: 0, y: -30, scale: 0.7 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{ opacity: 0, y: -30, scale: 0.7 }}
          transition={{
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1],
            opacity: { duration: 0.3 },
          }}
        >
          <motion.div
            className="px-6 py-3 rounded-full backdrop-blur-xl border-2"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-primary) 15%, transparent)",
              borderColor: "var(--color-primary)",
              boxShadow:
                "0 0 30px color-mix(in srgb, var(--color-primary) 40%, transparent), 0 10px 30px rgba(0, 0, 0, 0.3)",
            }}
            animate={{
              boxShadow: [
                "0 0 30px color-mix(in srgb, var(--color-primary) 40%, transparent), 0 10px 30px rgba(0, 0, 0, 0.3)",
                "0 0 40px color-mix(in srgb, var(--color-primary) 50%, transparent), 0 10px 35px rgba(0, 0, 0, 0.4)",
                "0 0 30px color-mix(in srgb, var(--color-primary) 40%, transparent), 0 10px 30px rgba(0, 0, 0, 0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
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
                  scale: [1, 1.4, 1],
                  opacity: [1, 0.6, 1],
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
                    scale: [1, 2.5, 1],
                    opacity: [0.7, 0, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              {/* Section label with stagger animation */}
              <motion.span
                className="text-sm font-semibold tracking-wide"
                style={{
                  color: "var(--color-primary)",
                  textShadow:
                    "0 0 10px color-mix(in srgb, var(--color-primary) 50%, transparent)",
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {sectionLabel}
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
