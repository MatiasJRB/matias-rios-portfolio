import React, { useEffect, useState } from "react";
import { cn } from "@/utils";
import type { SelectorProps } from "@/types";
import { NAV_ITEMS } from "@/constants";
import type { Dictionary } from "@/i18n/types";
import { getSlideInAnimation } from "@/hooks/useSlideInAnimation";

const Selector: React.FC<SelectorProps & { dictionary: Dictionary }> = ({
  className,
  dictionary,
}) => {
  const [selectedSection, setSelectedSection] = useState("about");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

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
        },
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
    <div
      className={cn("flex flex-col items-start", className)}
      style={{ color: "var(--color-text)" }}
    >
      {NAV_ITEMS.map((item, index) => {
        const isSelected = selectedSection === item.id;
        const isHovered = hoveredSection === item.id;
        const label =
          dictionary.nav[item.labelKey as keyof typeof dictionary.nav];
        const animation = getSlideInAnimation(index, 0.3);

        return (
          <div
            key={item.id}
            className={`mb-6 cursor-pointer flex items-center group ${animation.className}`}
            style={animation.style}
            onMouseEnter={() => setHoveredSection(item.id)}
            onMouseLeave={() => setHoveredSection(null)}
            onClick={() => handleSelect(item.id)}
            onFocus={() => setHoveredSection(item.id)}
            onBlur={() => setHoveredSection(null)}
          >
            <span
              className="h-px mr-4"
              style={{
                width: isSelected || isHovered ? "4rem" : "2.5rem",
                backgroundColor: isSelected
                  ? "var(--color-primary)"
                  : isHovered
                    ? "var(--color-text)"
                    : "var(--color-muted)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
            <button
              className="uppercase text-xs font-bold tracking-widest cursor-pointer outline-none"
              aria-label={label}
              style={{
                color:
                  isSelected || isHovered
                    ? "var(--color-text)"
                    : "var(--color-muted)",
                transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {label}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Selector;
