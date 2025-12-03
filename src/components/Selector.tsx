import React, { useEffect, useState } from "react";
import { cn } from "@/utils";
import { motion } from "framer-motion";
import type { SelectorProps } from "@/types";
import { NAV_ITEMS } from "@/constants";
import type { Dictionary } from "@/i18n/types";

const Selector: React.FC<SelectorProps & { dictionary: Dictionary }> = ({
  className,
  dictionary,
}) => {
  const [selectedSection, setSelectedSection] = useState("about");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout>();

  const handleSelect = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      setSelectedSection(id);
      setIsUserScrolling(true);
      
      // Limpiar timeout anterior
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Después de 1 segundo, permitir que el observer tome control nuevamente
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 1000);
      
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      let timeoutId: NodeJS.Timeout;

      const observer = new IntersectionObserver(
        (entries) => {
          // No actualizar si el usuario acaba de hacer clic
          if (isUserScrolling) {
            return;
          }

          // Debounce para evitar actualizaciones excesivas
          clearTimeout(timeoutId);
          
          timeoutId = setTimeout(() => {
            // Encuentra todas las secciones visibles
            const visibleSections = entries
              .filter((entry) => entry.isIntersecting)
              .map((entry) => ({
                id: entry.target.id,
                ratio: entry.intersectionRatio,
                top: entry.boundingClientRect.top,
              }))
              .sort((a, b) => {
                // Primero por ratio de intersección (más visible)
                if (Math.abs(b.ratio - a.ratio) > 0.1) {
                  return b.ratio - a.ratio;
                }
                // Luego por cercanía al top de la ventana
                return Math.abs(a.top) - Math.abs(b.top);
              });

            if (visibleSections.length > 0) {
              setSelectedSection(visibleSections[0].id);
            }
          }, 100);
        },
        {
          threshold: [0, 0.25, 0.5, 0.75, 1],
          rootMargin: "-10% 0px -60% 0px",
        }
      );

      NAV_ITEMS.forEach((item) => {
        const section = document.getElementById(item.id);
        if (section) {
          observer.observe(section);
        }
      });

      return () => {
        clearTimeout(timeoutId);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        NAV_ITEMS.forEach((item) => {
          const section = document.getElementById(item.id);
          if (section) {
            observer.unobserve(section);
          }
        });
      };
    }
  }, [isUserScrolling]);

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
        const label =
          dictionary.nav[item.labelKey as keyof typeof dictionary.nav];

        return (
          <div
            key={item.id}
            className="mb-4 cursor-pointer flex items-center"
            onMouseOver={() => setHoveredSection(item.id)}
            onMouseLeave={() => setHoveredSection(null)}
            onClick={() => handleSelect(item.id)}
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
                color:
                  isSelected || isHovered
                    ? "var(--color-text)"
                    : "var(--color-muted)",
              }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.button>
          </div>
        );
      })}
    </motion.div>
  );
};

export default Selector;
