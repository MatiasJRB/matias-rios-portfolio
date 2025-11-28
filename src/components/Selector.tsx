import React, { useEffect, useState } from "react";
import { cn } from "@/utils";
import { motion } from "framer-motion";
import type { NavItem, SelectorProps } from "@/types";
import { NAV_ITEMS, INTERSECTION_CONFIG } from "@/constants";

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

      NAV_ITEMS.forEach((item) => {
        const section = document.getElementById(item.id);
        if (section) {
          observer.observe(section);
        }
      });

      return () => {
        NAV_ITEMS.forEach((item) => {
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
      {NAV_ITEMS.map((item) => {
        const isSelected = selectedSection === item.id;
        const isHovered = hoveredSection === item.id;
        
        return (
        <div
          key={item.id}
          className="mb-4 cursor-pointer flex items-center"
          onMouseOver={() => setHoveredSection(item.id)}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => handleSelect(item)}
        >
          <motion.span
            className="h-px mr-3"
            animate={{
              width: isSelected || isHovered ? "3rem" : "2rem",
              backgroundColor: isSelected
                ? "var(--color-primary)"
                : isHovered
                ? "var(--color-text)"
                : "var(--color-muted)",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          <motion.button
            className="uppercase text-xs font-bold tracking-widest cursor-pointer"
            animate={{
              color: isSelected || isHovered ? "var(--color-text)" : "var(--color-muted)",
            }}
            transition={{ duration: 0.2 }}
          >
            {item.label}
          </motion.button>
        </div>
      );
      })}
    </motion.div>
  );
};

export default Selector;
