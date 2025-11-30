import { cn } from "@/utils";
import { useState, useEffect } from "react";
import type { Locale } from "@/i18n/config";

interface FooterProps {
  className?: string;
  lang: Locale;
}

const Footer: React.FC<FooterProps> = ({ className, lang }) => {
  const [footer, setFooter] = useState<string>("");

  useEffect(() => {
    import(`@/data/resume/${lang}.json`).then((data) => {
      setFooter(data.default.footer);
    });
  }, [lang]);
  return (
    <footer
      id="footer"
      className={cn("w-full text-sm scroll-mt-24", className)}
      style={{ color: "var(--color-muted)" }}
    >
      {/* footer from resume is html, insert here with keyboard navigation */}
      <div
        data-footer-paragraph
        className="relative scroll-mt-24"
        style={{ paddingLeft: "24px" }}
      >
        {/* Green dot indicator */}
        <div
          className="keyboard-indicator absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500 transition-opacity duration-200"
          style={{ opacity: 0 }}
        />
        <div
          dangerouslySetInnerHTML={{ __html: footer }}
          className="w-full"
          style={{ color: "var(--color-muted)" }}
        />
      </div>
    </footer>
  );
};

export default Footer;
