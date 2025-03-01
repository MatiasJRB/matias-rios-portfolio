'use client';

import resume from '../resume.json';

interface Basics {
  name: string;
  label: string;
  summary: string;
}

const Presentation: React.FC = () => {
  const basics: Basics = resume.basics;


  return (
    <div className="w-full">
      <div className="mb-1">
        <a className="text-4xl cursor-pointer" href="#about">
          {basics.name}
        </a>
      </div>
      <div className="mb-4 text-lg">{basics.label}</div>
      <p className="text-base leading-relaxed max-w-xs">{basics.summary}</p>
    </div>
  );
};

export default Presentation;