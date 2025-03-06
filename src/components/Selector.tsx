import React, { useEffect, useState } from "react";
import { cn } from "@/utils";

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

  // este compponente tiene que saber si se alcanzo una seccion, para marcarla como seleccionada
  const observer = new IntersectionObserver(
    (entries) => {
      let visibleSection: string | null = null;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Obtener la sección que está más centrada en el viewport
          if (
            !visibleSection ||
            Math.abs(entry.boundingClientRect.top) <
              Math.abs(
                document.getElementById(visibleSection)?.getBoundingClientRect()
                  .top || 0
              )
          ) {
            visibleSection = entry.target.id;
          }
        }
      });

      if (visibleSection) {
        setSelectedSection(visibleSection); // Cambiar la sección seleccionada
      }
    },
    {
      threshold: 0.5, // Umbral de visibilidad (50%)
      rootMargin: "0px 0px -50% 0px", // Ajustar el margen para detectar la sección más centrada
    }
  );

  useEffect(() => {
    // Observar todas las secciones
    navItems.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) {
        observer.observe(section);
      }
    });

    // Cleanup al desmontar el componente
    return () => {
      navItems.forEach((item) => {
        const section = document.getElementById(item.id);
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  return (
    <div className={cn("flex flex-col items-start", className)}>
      {navItems.map((item) => (
        <div
          key={item.id}
          className={cn(
            "mb-4 cursor-pointer flex items-center text-gray-400 transition-all",
            selectedSection === item.id && "text-white"
          )}
          onMouseOver={() => setHoveredSection(item.id)}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => handleSelect(item)}
        >
          <span
            className={cn(
              "w-8 h-px bg-gray-500 mr-2 transition-all",
              (selectedSection === item.id || hoveredSection === item.id) &&
                "w-16 bg-white"
            )}
          />
          <button className="uppercase text-xs font-bold tracking-widest cursor-pointer">
            {item.label}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Selector;
