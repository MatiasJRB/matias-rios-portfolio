// Tipos compartidos para el portfolio

// Resume.json types
export interface Profile {
  network: string;
  username: string;
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
  startDate: string;
  endDate: string;
  url: string;
  summary: string;
  highlights: string[];
}

export interface Resume {
  basics: Basics;
  work: Job[];
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
