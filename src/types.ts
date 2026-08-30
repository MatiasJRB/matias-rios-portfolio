// Tipos compartidos para el portfolio

// Resume.json types
export interface Profile {
  icon?: string;
  network?: string;
  username?: string;
  url: string;
}

export interface Basics {
  name: string;
  label: string;
  image: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  about: string;
  location: {
    address: string;
    postalCode: string;
    city: string;
    countryCode: string;
    region: string;
  };
  profiles: Profile[];
}

export interface Job {
  name: string;
  position: string;
  kind?: "employment" | "contract" | "venture" | "practice";
  context?: string;
  startDate: string;
  endDate: string;
  url: string;
  summary: string;
  highlights: string[];
}

export interface Language {
  language: string;
  fluency: string;
}

export interface Education {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  url?: string;
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  role: string;
  company?: string;
  url?: string;
  featured?: boolean;
  featuredRank?: number;
  eyebrow?: string;
  headline?: string;
  impact?: string;
  status?: string;
  highlights?: string[];
  proof?: string[];
  visual?: {
    image?: string;
    alt?: string;
    pattern?: string;
    nodes?: string[];
  };
}

export interface Resume {
  basics: Basics;
  work: Job[];
  projects?: Project[];
  education?: Education[];
  languages?: Language[];
  footer: string;
}

// Component Props
export interface AboutProps {
  className?: string;
}

export interface HistoryProps {
  className?: string;
  id?: string;
}

export interface SelectorProps {
  className?: string;
}

export interface SocialMediaProps {
  className?: string;
}

export interface FooterProps {
  className?: string;
}

export interface PresentationProps {
  className?: string;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}

// Navigation
export interface NavItem {
  id: string;
  label: string;
}

// Skeleton Loaders
export interface SkeletonProps {
  className?: string;
}
