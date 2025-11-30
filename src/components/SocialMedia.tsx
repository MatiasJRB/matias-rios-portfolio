import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { cn } from "@/utils";
import { motion } from "framer-motion";
import type { SocialMediaProps, Profile } from "@/types";
import type { Dictionary } from "@/i18n/types";
import { MagneticButton } from "./AdvancedEffects";

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.4 + index * 0.15,
              ease: [0.25, 0.4, 0.25, 1]
            }}
          >
            <MagneticButton strength={0.4}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative mr-6"
              >
                <IconComponent
                  size={28}
                  className="cursor-pointer transition-all duration-300"
                  style={{
                    color: "var(--color-muted)",
                    filter: "drop-shadow(0 0 0px transparent)",
                  }}
                  onMouseEnter={(e: React.MouseEvent<SVGElement>) => {
                    e.currentTarget.style.color = "var(--color-primary)";
                    e.currentTarget.style.filter = "drop-shadow(0 0 8px var(--color-primary))";
                  }}
                  onMouseLeave={(e: React.MouseEvent<SVGElement>) => {
                    e.currentTarget.style.color = "var(--color-muted)";
                    e.currentTarget.style.filter = "drop-shadow(0 0 0px transparent)";
                  }}
                  onClick={() => handleURL(profile.url)}
                  aria-label={getAriaLabel(profile.url)}
                  role="button"
                  tabIndex={0}
                />
              </motion.div>
            </MagneticButton>
          </motion.div>
        ) : null;
      })}
    </div>
  );
};

export default SocialMedia;
