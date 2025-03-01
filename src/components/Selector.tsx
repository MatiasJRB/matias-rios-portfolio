import React, { useState } from "react";
import { cn } from "@/utils";

const navItems = [
  { id: "about", label: "About" },
  { id: "history", label: "Experience" },
];

interface SelectorProps {
  className?: string;
}

const Selector: React.FC<SelectorProps> = ({ className }) => {
  const [selectedSection, setSelectedSection] = useState("about");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

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
        >
          <span
            className={cn(
              "w-8 h-px bg-gray-500 mr-2 transition-all",
              (selectedSection === item.id || hoveredSection === item.id) &&
                "w-16 bg-white"
            )}
          />
          <button
            className="uppercase text-xs font-bold tracking-widest"
            onClick={() => {
              const section = document.getElementById(item.id);
              if (section) {
                setSelectedSection(item.id);
                section.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            {item.label}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Selector;
