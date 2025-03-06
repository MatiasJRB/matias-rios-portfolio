import { cn } from "@/utils";
import resume from "../resume.json";
const { footer } = resume;

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn("w-full text-xs", className)}>
      {/* footer from resume is html, insert here */}
      <div
        dangerouslySetInnerHTML={{ __html: footer }}
        className="w-full"
      ></div>
    </footer>
  );
};

export default Footer;
