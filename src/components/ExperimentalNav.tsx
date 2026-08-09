"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/utils";

interface NavItem {
  id: string;
  label: string;
}

interface ExperimentalNavProps {
  items: NavItem[];
  className?: string;
}

export function ExperimentalNav({
  items,
  className = "",
}: ExperimentalNavProps) {
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calcular progreso de scroll
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(progress);

      // Detectar sección activa
      const sections = items.map((item) => document.getElementById(item.id));
      const current = sections.find((section) => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (current) {
        setActiveSection(current.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Progress bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-opacity-20 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--color-border)" }}
      >
        <motion.div
          className="w-full rounded-full"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "0 0 10px var(--color-primary)",
          }}
          animate={{ height: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Navigation items */}
      <nav className="pl-6 space-y-1">
        {items.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "relative block py-2 px-4 text-left transition-[background-color,color,transform] duration-300 rounded-lg",
                "hover:translate-x-2 w-full group",
              )}
            >
              <motion.div
                className="absolute inset-0 rounded-lg"
                initial={false}
                animate={{
                  backgroundColor: isActive
                    ? "var(--color-card)"
                    : "transparent",
                }}
                transition={{ duration: 0.3 }}
              />

              <motion.span
                className="relative text-sm font-medium"
                initial={false}
                animate={{
                  color: isActive
                    ? "var(--color-primary)"
                    : "var(--color-muted)",
                  fontWeight: isActive ? 700 : 500,
                }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>

              {/* Active indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute -left-6 top-1/2 w-1 h-8 rounded-r-full"
                    style={{
                      background: "var(--gradient-primary)",
                      boxShadow: "0 0 10px var(--color-primary)",
                    }}
                    initial={{ opacity: 0, x: -10, y: "-50%" }}
                    animate={{ opacity: 1, x: 0, y: "-50%" }}
                    exit={{ opacity: 0, x: -10, y: "-50%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at center, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent 70%)",
                }}
                transition={{ duration: 0.3 }}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}

interface FloatingNavProps {
  items: NavItem[];
}

export function FloatingNav({ items }: FloatingNavProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar después de scroll
      setIsVisible(window.scrollY > 300);

      // Detectar sección activa
      const sections = items.map((item) => document.getElementById(item.id));
      const current = sections.find((section) => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (current) {
        setActiveSection(current.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-8 left-1/2 z-50 bg-opacity-80 backdrop-blur-lg rounded-full px-6 py-3 shadow-2xl"
          style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            boxShadow:
              "0 10px 40px rgba(0, 0, 0, 0.2), 0 0 20px var(--shadow-hover)",
          }}
          initial={{ opacity: 0, y: 100, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 100, x: "-50%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center gap-2">
            {items.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="relative px-4 py-2 rounded-full text-sm font-medium transition-[background-color,color,transform]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    color: isActive
                      ? "var(--color-text)"
                      : "var(--color-muted)",
                  }}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: "var(--gradient-primary)" }}
                      layoutId="activeNav"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
