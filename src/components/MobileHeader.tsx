"use client";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import SocialMedia from "./SocialMedia";
import { cn } from "@/utils";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { NAV_ITEMS } from "@/constants";
import type { Dictionary } from "@/i18n/types";
import type { Profile } from "@/types";

interface MobileHeaderProps {
  dictionary: Dictionary;
  profiles: Profile[];
}

const MobileHeader = ({ dictionary, profiles }: MobileHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const handleNavClick = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] lg:hidden pointer-events-none",
      )}
      style={{
        backgroundColor: "transparent",
      }}
    >
      <div className="flex items-center justify-start px-5 py-4">
        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-events-auto flex h-[38px] w-[38px] items-center justify-center rounded-full border shadow-sm transition-colors duration-200"
          style={{
            color: "var(--color-text)",
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="pointer-events-auto absolute top-full left-0 right-0 border-t"
          style={{
            backgroundColor: "var(--color-background)",
            borderColor: "var(--color-border)",
          }}
        >
            <nav className="px-6 py-4 space-y-4">
              {NAV_ITEMS.map((item) => {
                const label =
                  dictionary.nav[item.labelKey as keyof typeof dictionary.nav];
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="block w-full text-left py-3 px-4 rounded-lg transition-[background-color,color,transform] duration-200 uppercase text-sm font-bold tracking-widest"
                    style={{ color: "var(--color-text)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--color-surface)";
                      e.currentTarget.style.color = "var(--color-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--color-text)";
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </nav>

            {/* Social Media in Mobile Menu */}
            <div
              className="px-6 pb-6 pt-2 border-t"
              style={{ borderColor: "var(--color-border)" }}
            >
              <SocialMedia
                profiles={profiles}
                dictionary={dictionary}
                behavior="justify-start"
                className="mt-4"
              />
            </div>
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
