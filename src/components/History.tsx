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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    import("../resume.json").then((data) => setWork(data.work));
    setIsMobile(window.innerWidth <= 768);
  }, []);

  return (
    <div id="history" className={cn("w-full", className)}>
      {work.map((job) => (
        <div key={job.name} className="w-full mb-6">
          {/* FECHAS */}
          <div className="text-sm text-gray-400">
            {job.startDate}{" "}
            <span className="inline-block w-4 h-px bg-gray-500 mx-1"></span>{" "}
            {job.endDate}
          </div>

          {/* TITULO + LINK */}
          <div className="mt-2">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-300 hover:text-green-400 transition-all"
            >
              <span className="font-bold">
                {job.position} · {job.name}
              </span>
              <FaArrowRight className="ml-2 transform transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>

          {/* RESUMEN */}
          <p className="mt-2 text-sm text-gray-400">{job.summary}</p>

          {/* HIGHLIGHTS */}
          <div className="flex flex-wrap mt-2">
            {job.highlights.map((task) => (
              <span
                key={task}
                className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full mr-2 mb-2"
              >
                {task}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* BOTÓN PARA VER RESUMEN COMPLETO */}
      <div className="mt-6">
        <a
          href="/resume"
          className="inline-flex items-center text-gray-300 hover:text-green-400 transition-all"
        >
          View Full Resume
          <FaArrowRight className="ml-2 transform transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
      </div>
    </div>
  );
};

export default History;
