"use client";

interface CVHeaderProps {
  name: string;
  title: string;
  email: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export default function CVHeader({
  name,
  title,
  email,
  website = "https://www.matiasjrb.com.ar",
  linkedin = "https://www.linkedin.com/in/matiasjriosb/",
  github = "https://github.com/MatiasJRB",
}: CVHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-3 gap-4 print:flex-row print:items-center print:justify-between">
      {/* Name and title */}
      <div className="flex-1">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-1 text-gray-900 dark:text-gray-100 uppercase tracking-tight leading-none">
          {name}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-800 dark:text-gray-200 uppercase tracking-wide font-semibold">
          {title}
        </p>
      </div>

      {/* Social links and email */}
      <div className="flex flex-col items-start md:items-end justify-center gap-3 md:gap-4 print:items-end">
        {/* Social Icons */}
        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors print:!bg-transparent print:!border-none print:!text-gray-700"
            aria-label="Website"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors print:!bg-transparent print:!border-none print:!text-gray-700"
            aria-label="LinkedIn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors print:!bg-transparent print:!border-none print:!text-gray-700"
            aria-label="GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
        </div>

        {/* Email */}
        <a
          href={`mailto:${email}`}
          className="text-sm font-medium text-gray-900 underline decoration-1 underline-offset-2 transition-colors hover:text-[var(--color-primary)] md:text-base dark:text-gray-100 dark:hover:text-[var(--color-primary)] print:!font-normal print:!text-gray-700 print:!no-underline"
        >
          {email}
        </a>
      </div>
    </header>
  );
}
