import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import resume from "../resume.json";
import { cn } from "@/utils";

const iconMap: Record<string, React.ElementType> = {
  "fab fa-github": FaGithub,
  "fab fa-linkedin": FaLinkedin,
  email: MdEmail,
};

interface Profile {
  icon: string;
  url: string;
}

interface SocialMediaProps {
  behavior?: string;
  className?: string;
}

const SocialMedia: React.FC<SocialMediaProps> = ({
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

  return (
    <div className={cn(`flex ${behavior}`, className)}>
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
          />
        ) : null;
      })}
    </div>
  );
};

export default SocialMedia;
