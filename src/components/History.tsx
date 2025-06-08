import { cn } from "@/utils";
import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import {
  FaCode,
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
import Image from "next/image";

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
      Nuqlea: "/images/work/nuqlea.png",
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
      return <FaBuilding size={12} style={{ color: "var(--color-primary)" }} />;
    }
    if (
      lowerHighlight.includes("technical") &&
      lowerHighlight.includes("standard")
    ) {
      return (
        <FaShieldAlt size={12} style={{ color: "var(--color-success)" }} />
      );
    }
    if (
      lowerHighlight.includes("development") ||
      lowerHighlight.includes("team")
    ) {
      return <FaUsers size={12} style={{ color: "var(--color-accent)" }} />;
    }
    if (
      lowerHighlight.includes("onboarding") ||
      lowerHighlight.includes("mentoring")
    ) {
      return (
        <FaGraduationCap size={12} style={{ color: "var(--color-warning)" }} />
      );
    }
    if (
      lowerHighlight.includes("implementation") ||
      lowerHighlight.includes("product")
    ) {
      return <FaRocket size={12} style={{ color: "var(--color-primary)" }} />;
    }
    if (
      lowerHighlight.includes("infrastructure") ||
      lowerHighlight.includes("ci/cd")
    ) {
      return <FaServer size={12} style={{ color: "var(--color-muted)" }} />;
    }
    if (
      lowerHighlight.includes("tools") ||
      lowerHighlight.includes("monitoring")
    ) {
      return <FaTools size={12} style={{ color: "var(--color-accent)" }} />;
    }
    if (
      lowerHighlight.includes("communicat") ||
      lowerHighlight.includes("progress")
    ) {
      return <FaComments size={12} style={{ color: "var(--color-primary)" }} />;
    }
    if (
      lowerHighlight.includes("scalability") ||
      lowerHighlight.includes("business")
    ) {
      return (
        <FaChartLine size={12} style={{ color: "var(--color-success)" }} />
      );
    }
    if (
      lowerHighlight.includes("database") ||
      lowerHighlight.includes("data")
    ) {
      return <FaDatabase size={12} style={{ color: "var(--color-primary)" }} />;
    }
    if (lowerHighlight.includes("cloud")) {
      return <FaCloud size={12} style={{ color: "var(--color-primary)" }} />;
    }
    if (lowerHighlight.includes("leadership")) {
      return (
        <FaLightbulb size={12} style={{ color: "var(--color-warning)" }} />
      );
    }
    // Icono por defecto para código/programación
    return <FaCode size={12} style={{ color: "var(--color-accent)" }} />;
  };

  return (
    <div id="history" className={cn("w-full", className)}>
      {work.map((job) => (
        <div key={job.name} className="w-full mb-6">
          {" "}
          {/* FECHAS */}{" "}
          <div
            className="text-sm font-semibold"
            style={{ color: "var(--color-muted)" }}
          >
            {job.startDate}{" "}
            <span
              className="inline-block w-4 h-px mx-[3px] my-[4.5px]"
              style={{ backgroundColor: "var(--color-muted)" }}
            ></span>{" "}
            {job.endDate}
          </div>{" "}
          {/* TITULO + LINK */}
          <div className="mt-2">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center transition-all"
            >
              {" "}
              <div
                className="flex flex-row transform transition-all duration-300"
                style={{
                  color: "var(--color-text)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-text)";
                }}
              >
                {/* LOGO DE LA EMPRESA */}{" "}
                {getCompanyLogo(job.name) && (
                  <div className="flex-shrink-0 mr-3">
                    {" "}
                    <div
                      className="w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden shadow-sm"
                      style={{
                        backgroundColor: "var(--color-muted)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      <Image
                        src={getCompanyLogo(job.name)!}
                        alt={`${job.name} logo`}
                        width={32}
                        height={32}
                        className="object-contain "
                      />
                    </div>
                  </div>
                )}{" "}
                <div className="flex items-center">
                  {" "}
                  <span
                    className="font-bold"
                    style={{ color: "var(--color-text)" }}
                  >
                    {job.position} · {job.name}
                  </span>
                  <div className="ml-2 transform -translate-x-1 translate-y-1 hover:translate-x-1 hover:-translate-y-1 transition-all duration-100 ease-in-out">
                    <FaArrowRight
                      className="transform -rotate-45 transition-all duration-100"
                      size={14}
                    />
                  </div>
                </div>
              </div>
            </a>
          </div>{" "}
          {/* RESUMEN */}{" "}
          <p className="mt-2 text-sm" style={{ color: "var(--color-muted)" }}>
            {job.summary}
          </p>
          {/* HIGHLIGHTS */}
          <div className="mt-4">
            {" "}
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--color-muted)" }}
            >
              Key Responsibilities
            </h4>{" "}
            <div className="space-y-2">
              {job.highlights.map((task) => (
                <div
                  key={task}
                  className="group flex items-start space-x-3 
                  p-4 rounded-lg transition-all duration-200 border
                   shadow-sm hover:shadow-md"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-background)";
                    e.currentTarget.style.borderColor = "var(--color-muted)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-surface)";
                    e.currentTarget.style.borderColor = "var(--color-border)";
                  }}
                >
                  {" "}
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors border"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      {getIconForHighlight(task)}
                    </div>
                  </div>{" "}
                  <p
                    className="text-sm leading-relaxed flex-1 font-medium"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {task}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}{" "}
      {/* BOTÓN PARA VER RESUMEN COMPLETO */}{" "}
      <div className="mt-6">
        {" "}
        <a href="/[ENG]_Matias_Rios_CV_Jan_25.pdf" target="_blank">
          {" "}
          <div
            className="flex flex-row cursor-pointer transform transition-all duration-300"
            style={{ color: "var(--color-text)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text)";
            }}
          >
            View Full Resume
            <div
              className="ml-2 
            transform -translate-x-1 translate-y-1 hover:translate-x-1 
            hover:-translate-y-1 transition-all duration-100 ease-in-out"
            >
              <FaArrowRight
                className="transform -rotate-45 transition-all duration-100"
                size={14}
              />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default History;
