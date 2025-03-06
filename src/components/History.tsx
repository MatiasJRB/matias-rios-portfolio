import { cn } from "@/utils";
import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";

interface Job {
  name: string;
  position: string;
  startDate: string;
  endDate: string;
  url: string;
  summary: string;
  highlights: string[];
}

interface HistoryProps {
  className?: string;
}

const History: React.FC<HistoryProps> = ({ className }) => {
  const [work, setWork] = useState<Job[]>([]);

  useEffect(() => {
    import("../resume.json").then((data) => setWork(data.work));
  }, []);

  return (
    <div id="history" className={cn("w-full", className)}>
      {work.map((job) => (
        <div key={job.name} className="w-full mb-6">
          {/* FECHAS */}
          <div className="text-sm font-semibold  text-gray-400">
            {job.startDate}{" "}
            <span
              className="inline-block w-4 h-px bg-gray-500"
              style={{ margin: "4.5px 3px" }}
            ></span>{" "}
            {job.endDate}
          </div>

          {/* TITULO + LINK */}
          <div className="mt-2 bg-primary">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
              flex items-center 
              transition-all"
            >
              <div
                className="flex flex-row 
                job-title text-stone-200
                transform transition-all-300"
              >
                <span className="font-bold">
                  {job.position} · {job.name}
                </span>

                <div className="arrow-container hover:translate-x-1 hover:-translate-y-1 transition-all ml-2">
                  <FaArrowRight className="arrow" size={14} />
                </div>
              </div>
            </a>
          </div>

          {/* RESUMEN */}
          <p className="mt-2 text-sm text-gray-400">{job.summary}</p>

          {/* HIGHLIGHTS */}
          <div className="flex flex-wrap mt-2">
            {job.highlights.map((task) => (
              <span
                key={task}
                className="skill bg-gray-800 text-geome7ric font-semibold text-xs px-3 py-1 rounded-full mr-2 mb-2"
              >
                {task}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* BOTÓN PARA VER RESUMEN COMPLETO */}
      <div className="mt-6">
        <a href="/resume.pdf" target="_blank">
          <div className="flex flex-row job-title cursor-pointer transform transition-all-300">
            View Full Resume
            <div className="arrow-container ml-2 hover:translate-x-1 hover:-translate-y-1 transition-all ">
              <FaArrowRight className="arrow" size={14} />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default History;
