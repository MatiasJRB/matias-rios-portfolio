'use client';

import resume from '../resume.json';

type Basics = {
  about: string;
};

const { about } = resume.basics as Basics;

export default function About() {
  return (
    <div className="w-full" id="about">
      <div dangerouslySetInnerHTML={{ __html: about }} />
    </div>
  );
}
