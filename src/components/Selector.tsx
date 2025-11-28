import React, { useEffect, useState } from "react";
import { cn } from "@/utils";
import { motion } from "framer-motion";

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: "about", label: "About" },
  { id: "history", label: "Experience" },
];

interface SelectorProps {
  className?: string;
}

const Selector: React.FC<SelectorProps> = ({ className }) => {
  const [selectedSection, setSelectedSection] = useState("about");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const handleSelect = (item: NavItem) => {
    const section = document.getElementById(item.id);
    if (section) {
      setSelectedSection(item.id);
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          let visibleSection: string | null = null;

          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (
                !visibleSection ||
                Math.abs(entry.boundingClientRect.top) <
                  Math.abs(
                    document
                      .getElementById(visibleSection)
                      ?.getBoundingClientRect().top || 0
                  )
              ) {
                visibleSection = entry.target.id;
              }
            }
          });

          if (visibleSection) {
            setSelectedSection(visibleSection);
          }
        },
        {
          threshold: 0.5,
          rootMargin: "0px 0px -50% 0px",
        }
      );

      navItems.forEach((item) => {
        const section = document.getElementById(item.id);
        if (section) {
          observer.observe(section);
        }
      });

      return () => {
        navItems.forEach((item) => {
          const section = document.getElementById(item.id);
          if (section) {
            observer.unobserve(section);
          }
        });
      };
    }
  }, []);
  return (
    <motion.div
      className={cn("flex flex-col items-start", className)}
      style={{ color: "var(--color-text)" }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
    >
      {navItems.map((item) => (
        <div
          key={item.id}
          className="mb-4 cursor-pointer flex items-center transition-all duration-300"
          style={{
            color:
              selectedSection === item.id
                ? "var(--color-text)"
                : "var(--color-muted)",
          }}
          onMouseOver={() => setHoveredSection(item.id)}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => handleSelect(item)}
        >
          <span
            className="h-px transition-all duration-300 mr-2"
            style={{
              width:
                selectedSection === item.id || hoveredSection === item.id
                  ? "4rem"
                  : "2rem",
              backgroundColor:
                selectedSection === item.id || hoveredSection === item.id
                  ? "var(--color-text)"
                  : "var(--color-muted)",
            }}
          />
          <button
            className="uppercase text-xs font-bold tracking-widest cursor-pointer"
            style={{ color: "var(--color-text)" }}
          >
            {item.label}
          </button>
        </div>
      ))}
    </motion.div>
  );
};

export default Selector;
