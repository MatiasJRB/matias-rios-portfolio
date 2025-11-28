import { cn } from "@/utils";
import resume from "../resume.json";
const { footer } = resume;

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      id="footer"
      className={cn("w-full text-sm scroll-mt-24", className)}
      style={{ color: "var(--color-muted)" }}
    >
      {/* footer from resume is html, insert here */}
      <div
        dangerouslySetInnerHTML={{ __html: footer }}
        className="w-full"
        style={{ color: "var(--color-muted)" }}
      ></div>
    </footer>
  );
};

export default Footer;
