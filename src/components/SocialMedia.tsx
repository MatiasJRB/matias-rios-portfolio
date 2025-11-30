import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { cn } from "@/utils";
import { motion } from "framer-motion";
import type { SocialMediaProps, Profile } from "@/types";
import type { Dictionary } from "@/i18n/types";

const iconMap: Record<string, React.ElementType> = {
  "fab fa-github": FaGithub,
  "fab fa-linkedin": FaLinkedin,
  email: MdEmail,
};

const SocialMedia: React.FC<
  SocialMediaProps & {
    behavior?: string;
    profiles: Profile[];
    dictionary: Dictionary;
  }
> = ({ behavior = "justify-start", className, profiles, dictionary }) => {
  const handleURL = (url: string) => {
    if (url.startsWith("https://")) {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
  };

  const getAriaLabel = (url: string) => {
    if (url.includes("github")) return dictionary.social.githubProfile;
    if (url.includes("linkedin")) return dictionary.social.linkedinProfile;
    if (url.includes("mailto")) return dictionary.social.emailContact;
    return dictionary.social.socialMediaProfile;
  };

  return (
    <div className={cn(`flex ${behavior}`, className)}>
      {profiles.map((profile, index) => {
        const IconComponent = profile.icon ? iconMap[profile.icon] : null;
        return IconComponent ? (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
          >
            <IconComponent
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
          </motion.div>
        ) : null;
      })}
    </div>
  );
};

export default SocialMedia;
