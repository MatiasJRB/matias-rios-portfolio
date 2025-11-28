import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import resume from "../resume.json";
import { cn } from "@/utils";
import { motion } from "framer-motion";
import type { SocialMediaProps } from "@/types";

const iconMap: Record<string, React.ElementType> = {
  "fab fa-github": FaGithub,
  "fab fa-linkedin": FaLinkedin,
  email: MdEmail,
};

interface Profile {
  icon: string;
  url: string;
}

const SocialMedia: React.FC<SocialMediaProps & { behavior?: string }> = ({
  behavior = "justify-start",
  className,
}) => {
  const handleURL = (url: string) => {
    if (url.startsWith("https://")) {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
  };

  const profiles = resume.basics.profiles as Profile[];

  const getAriaLabel = (url: string) => {
    if (url.includes("github")) return "GitHub Profile";
    if (url.includes("linkedin")) return "LinkedIn Profile";
    return "Social Media Profile";
  };

  return (
    <motion.div
      className={cn(`flex ${behavior}`, className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {profiles.map((profile, index) => {
        const IconComponent = iconMap[profile.icon] || null;
        return IconComponent ? (
          <IconComponent
            key={index}
            size={24}
            className="cursor-pointer transition-colors duration-300 mr-6"
            style={{
              color: "var(--color-muted)",
            }}
            onMouseEnter={(e: React.MouseEvent<SVGElement>) => {
              e.currentTarget.style.color = "var(--color-text)";
            }}
            onMouseLeave={(e: React.MouseEvent<SVGElement>) => {
              e.currentTarget.style.color = "var(--color-muted)";
            }}
            onClick={() => handleURL(profile.url)}
            aria-label={getAriaLabel(profile.url)}
            role="button"
            tabIndex={0}
          />
        ) : null;
      })}
    </motion.div>
  );
};

export default SocialMedia;
