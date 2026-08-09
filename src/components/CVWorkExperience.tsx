"use client";

interface WorkExperience {
  position: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

export default function CVWorkExperience({
  position,
  company,
  period,
  description,
  highlights,
}: WorkExperience) {
  return (
    <div className="mb-4">
      <div className="mb-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 inline">
          {position} | {company} |
        </h3>
        <span className="text-gray-700 dark:text-gray-300 text-sm">
          {" "}
          {period}
        </span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed text-sm">
        {description}
      </p>
      <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700 dark:text-gray-300 text-sm">
        {highlights.map((highlight, index) => (
          <li key={index}>{highlight}</li>
        ))}
      </ul>
    </div>
  );
}
