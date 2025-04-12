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
    <div className="w-full">
      <div className="mb-1">
        <a className="text-4xl lg:text-6xl cursor-pointer" href="#about">
          {basics.name}
        </a>
      </div>
      <div className="mt-2 text-lg lg:text-xl text-stone-200">
        {basics.label}
      </div>
      <p className="mt-4 lg:mt-8 text-base leading-relaxe max-w-xs md:max-w-sm lg:max-w-sm">
        {basics.summary}
      </p>

      <p className="mt-4 lg:mt-8 text-base leading-relaxed max-w-xs md:max-w-sm lg:max-w-sm">
        I am always looking for new opportunities to work on exciting projects.
        If you have an idea or a project in mind, feel free to reach me out.
      </p>
    </div>
  );
};

export default Presentation;
