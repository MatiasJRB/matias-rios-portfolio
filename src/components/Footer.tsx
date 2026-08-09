import { cn } from "@/utils";
import { getSlideInAnimation } from "@/hooks/useSlideInAnimation";

interface FooterProps {
  className?: string;
  footer: string;
}

const Footer: React.FC<FooterProps> = ({ className, footer }) => {
  const animation = getSlideInAnimation(0);

  return (
    <footer
      id="footer"
      className={cn(
        "w-full text-sm scroll-mt-24",
        animation.className,
        className,
      )}
      style={{ color: "var(--color-muted)", ...animation.style }}
    >
      {/* footer from resume is html, insert here with keyboard navigation */}
      <div
        data-footer-paragraph
        className="relative scroll-mt-24"
        style={{ paddingLeft: "24px" }}
      >
        {/* Green dot indicator */}
        <div
          className="keyboard-indicator absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-opacity duration-200"
          style={{
            opacity: 0,
            background: "var(--color-primary)",
            boxShadow: "0 0 10px var(--color-primary)",
          }}
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
