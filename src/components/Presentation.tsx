"use client";

import resume from "../resume.json";

interface Basics {
  name: string;
  label: string;
  summary: string;
  email: string;
}

const Presentation: React.FC = () => {
  const basics: Basics = resume.basics;
  return (
    <div
      className="w-full
      
    "
    >
      {" "}
      <div className="mb-1">
        <a
          className="text-4xl lg:text-6xl cursor-pointer font-bold"
          href="#about"
          style={{ color: "var(--color-text)" }}
        >
          {basics.name}
        </a>
      </div>{" "}
      <div className="mt-2 text-lg lg:text-xl">{basics.label}</div>
      <p
        className="mt-4 lg:mt-8 text-base leading-relaxed max-w-xs md:max-w-sm lg:max-w-sm"
        style={{ color: "var(--color-muted)" }}
      >
        {basics.summary}
      </p>{" "}
      <p
        className="mt-4 lg:mt-8 text-base leading-relaxed max-w-xs md:max-w-sm lg:max-w-sm"
        style={{ color: "var(--color-muted)" }}
      >
        I am always looking for new opportunities to work on exciting projects.
        If you have an idea or a project in mind, feel free to reach me out.
      </p>
      {/* Strategic Portfolio CTA */}
      {/* <div className="mt-6 lg:mt-10">
        <a
          href="https://geome7ric.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 
          hover:to-primary-700
          text-dark
           font-semibold rounded-lg transition-all duration-300 transform 
          "
        >
          <span> Explore Geome7ric as my showcase</span>
        </a>
      </div> */}
    </div>
  );
};

export default Presentation;
