import { cn } from "@/utils";
import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import {
  FaCode,
  FaCogs,
  FaUsers,
  FaGraduationCap,
  FaBuilding,
  FaTools,
  FaChartLine,
  FaComments,
  FaLightbulb,
  FaServer,
  FaDatabase,
  FaCloud,
  FaShieldAlt,
  FaRocket,
} from "react-icons/fa";

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

  // Función para obtener el logo de la empresa
  const getCompanyLogo = (companyName: string) => {
    const logoMap: { [key: string]: string } = {
      Mangxo: "/images/work/mango.png",
      Geome7ric: "/images/work/geome7ric.png",
      Kalkomey: "/images/work/kalkomey.png",
    };

    return logoMap[companyName] || null;
  };

  // Función para obtener el icono apropiado basado en el contenido del highlight
  const getIconForHighlight = (highlight: string) => {
    const lowerHighlight = highlight.toLowerCase();

    if (
      lowerHighlight.includes("architect") ||
      lowerHighlight.includes("design")
    ) {
      return <FaBuilding size={12} className="text-blue-400" />;
    }
    if (
      lowerHighlight.includes("technical") &&
      lowerHighlight.includes("standard")
    ) {
      return <FaShieldAlt size={12} className="text-green-400" />;
    }
    if (
      lowerHighlight.includes("development") ||
      lowerHighlight.includes("team")
    ) {
      return <FaUsers size={12} className="text-purple-400" />;
    }
    if (
      lowerHighlight.includes("onboarding") ||
      lowerHighlight.includes("mentoring")
    ) {
      return <FaGraduationCap size={12} className="text-yellow-400" />;
    }
    if (
      lowerHighlight.includes("implementation") ||
      lowerHighlight.includes("product")
    ) {
      return <FaRocket size={12} className="text-orange-400" />;
    }
    if (
      lowerHighlight.includes("infrastructure") ||
      lowerHighlight.includes("ci/cd")
    ) {
      return <FaServer size={12} className="text-gray-400" />;
    }
    if (
      lowerHighlight.includes("tools") ||
      lowerHighlight.includes("monitoring")
    ) {
      return <FaTools size={12} className="text-cyan-400" />;
    }
    if (
      lowerHighlight.includes("communicat") ||
      lowerHighlight.includes("progress")
    ) {
      return <FaComments size={12} className="text-pink-400" />;
    }
    if (
      lowerHighlight.includes("scalability") ||
      lowerHighlight.includes("business")
    ) {
      return <FaChartLine size={12} className="text-emerald-400" />;
    }
    if (
      lowerHighlight.includes("database") ||
      lowerHighlight.includes("data")
    ) {
      return <FaDatabase size={12} className="text-indigo-400" />;
    }
    if (lowerHighlight.includes("cloud")) {
      return <FaCloud size={12} className="text-sky-400" />;
    }
    if (lowerHighlight.includes("leadership")) {
      return <FaLightbulb size={12} className="text-amber-400" />;
    }
    // Icono por defecto para código/programación
    return <FaCode size={12} className="text-teal-400" />;
  };

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
          </div>{" "}
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
                {/* LOGO DE LA EMPRESA */}
                {getCompanyLogo(job.name) && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-gray-600/50 flex items-center justify-center overflow-hidden">
                      <img
                        src={getCompanyLogo(job.name)!}
                        alt={`${job.name} logo`}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <span className="font-bold">
                    {job.position} · {job.name}
                  </span>

                  <div className="arrow-container hover:translate-x-1 hover:-translate-y-1 transition-all ml-2">
                    <FaArrowRight className="arrow" size={14} />
                  </div>
                </div>
              </div>
            </a>
          </div>{" "}
          {/* RESUMEN */}
          <p className="mt-2 text-sm text-gray-400">{job.summary}</p>
          {/* HIGHLIGHTS */}
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Key Responsibilities
            </h4>{" "}
            <div className="space-y-2">
              {job.highlights.map((task) => (
                <div
                  key={task}
                  className="group flex items-start space-x-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-200 border border-gray-700/30 hover:border-gray-600/50"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center group-hover:bg-gray-700/70 transition-colors">
                      {getIconForHighlight(task)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed flex-1">
                    {task}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* BOTÓN PARA VER RESUMEN COMPLETO */}
      <div className="mt-6">
        <a href="/[ENG]_Matias_Rios_CV_Jan_25.pdf" target="_blank">
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
