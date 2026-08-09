"use client";

import React from "react";
import { FaGithub, FaLinkedin, FaFileAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useRouter } from "next/navigation";
import { cn } from "@/utils";
import { ANIMATION } from "@/design-tokens";
import type { SocialMediaProps, Profile } from "@/types";
import type { Dictionary } from "@/i18n/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  "fab fa-github": FaGithub,
  "fab fa-linkedin": FaLinkedin,
  email: MdEmail,
  cv: FaFileAlt,
  github: FaGithub,
  linkedin: FaLinkedin,
};

const SocialMedia: React.FC<
  SocialMediaProps & {
    behavior?: string;
    profiles: Profile[];
    dictionary: Dictionary;
    showCV?: boolean;
    lang?: string;
  }
> = ({
  behavior = "justify-start",
  className,
  profiles,
  dictionary,
  showCV = true,
  lang = "es",
}) => {
  const router = useRouter();

  const handleURL = (url: string, isExternal?: boolean) => {
    // Si es un enlace externo (https/http)
    if (url.startsWith("http://") || url.startsWith("https://")) {
      window.open(url, "_blank");
    }
    // Si es un mailto
    else if (url.startsWith("mailto:")) {
      window.location.href = url;
    }
    // Si está marcado como externo pero no tiene protocolo
    else if (isExternal) {
      window.open(url, "_blank");
    }
    // Enlaces internos (usar router de Next.js)
    else {
      router.push(url);
    }
  };

  const getAriaLabel = (url: string, network?: string) => {
    if (network === "cv" || url.includes("/cv"))
      return dictionary.social.cvProfile || "Ver CV";
    if (url.includes("github") || network === "github")
      return dictionary.social.githubProfile;
    if (url.includes("linkedin") || network === "linkedin")
      return dictionary.social.linkedinProfile;
    if (url.includes("mailto")) return dictionary.social.emailContact;
    return dictionary.social.socialMediaProfile;
  };

  // Agregar el CV a la lista de perfiles si showCV es true
  const allProfiles = showCV
    ? [
        ...profiles,
        {
          network: "cv",
          url: `/${lang}/cv`,
          icon: "cv",
        },
      ]
    : profiles;

  return (
    <div className={cn(`flex items-center gap-3 ${behavior}`, className)}>
      {allProfiles.map((profile, index) => {
        const IconComponent = profile.icon ? iconMap[profile.icon] : null;
        const isCV = profile.network === "cv";
        const isExternal =
          profile.network !== "cv" && !profile.url.startsWith("/");
        const ariaLabel = getAriaLabel(profile.url, profile.network);

        if (!IconComponent && !isCV) return null;

        return (
          <div
            key={`${profile.network}-${profile.url}-${index}`}
            className="animate-fade-in relative opacity-0"
            style={{
              animationDelay: `${ANIMATION.delay.initial + index * ANIMATION.delay.stagger}s`,
              animationFillMode: "forwards",
            }}
          >
            <button
              type="button"
              className="control-hover social-control inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)]"
              onClick={() => handleURL(profile.url, isExternal)}
              aria-label={ariaLabel}
            >
              {isCV ? (
                <span className="leading-none tracking-tight">CV</span>
              ) : IconComponent ? (
                <IconComponent aria-hidden="true" size={19} />
              ) : null}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SocialMedia;
