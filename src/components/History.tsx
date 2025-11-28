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
import { motion } from "framer-motion";
import { SkeletonHistoryCard } from "./SkeletonLoader";
import type { Job, HistoryProps } from "@/types";
import { COMPANY_LOGOS, THEME_COLORS } from "@/constants";

const History: React.FC<HistoryProps> = ({ className }) => {
  const [work, setWork] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("../resume.json").then((data) => {
      setWork(data.work);
      setIsLoading(false);
    });
  }, []);
  // Función para obtener el logo de la empresa
  const getCompanyLogo = (companyName: string) => {
    return COMPANY_LOGOS[companyName] || null;
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
    <div id="history" className={cn("w-full relative", className)}>
      {/* Línea temporal vertical */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px hidden md:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--color-border), transparent)",
        }}
      />

      {isLoading ? (
        // Skeleton loaders mientras carga
        <>
          <SkeletonHistoryCard />
          <SkeletonHistoryCard />
          <SkeletonHistoryCard />
        </>
      ) : (
        work.map((job, index) => (
          <div key={job.name} className="relative">
            {/* Dot en la línea temporal */}
            <div
              className="absolute left-0 top-8 w-3 h-3 rounded-full border-2 hidden md:block"
              style={{
                backgroundColor: "var(--color-background)",
                borderColor: "var(--color-primary)",
                transform: "translateX(-6px)",
                boxShadow: "0 0 0 4px var(--color-background)",
              }}
            />

            <motion.div
              className="w-full mb-8 p-6 md:pl-10 rounded-lg transition-all duration-300 group"
              style={{
                backgroundColor: "transparent",
                willChange: "transform, opacity",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              {/* FECHAS */}
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
              </div>
              {/* TITULO + LINK */}
              <div className="mt-2">
                {" "}
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center transition-all group"
                  onMouseEnter={(e) => {
                    const jobTexts =
                      e.currentTarget.querySelectorAll(".job-text-span");
                    const arrow = e.currentTarget.querySelector(".job-arrow");
                    const logo = e.currentTarget.querySelector(".company-logo");
                    jobTexts.forEach((span) => {
                      (span as HTMLElement).style.color = "var(--color-accent)";
                    });
                    if (arrow) {
                      (arrow as HTMLElement).style.color =
                        "var(--color-accent)";
                    }
                    if (logo) {
                      (logo as HTMLElement).style.boxShadow =
                        "0 0 0 2px var(--color-accent)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    const jobTexts =
                      e.currentTarget.querySelectorAll(".job-text-span");
                    const arrow = e.currentTarget.querySelector(".job-arrow");
                    const logo = e.currentTarget.querySelector(".company-logo");
                    jobTexts.forEach((span) => {
                      (span as HTMLElement).style.color = "var(--color-text)";
                    });
                    if (arrow) {
                      (arrow as HTMLElement).style.color = "var(--color-text)";
                    }
                    if (logo) {
                      (logo as HTMLElement).style.boxShadow =
                        "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)";
                    }
                  }}
                >
                  {" "}
                  <div className="flex flex-row transform transition-all duration-300">
                    {/* LOGO DE LA EMPRESA */}{" "}
                    {getCompanyLogo(job.name) && (
                      <div className="flex-shrink-0 mr-3">
                        {" "}
                        <div
                          className="company-logo w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden transition-all duration-200"
                          style={{
                            backgroundColor: "var(--color-muted)",
                            borderColor: "var(--color-border)",
                            boxShadow:
                              "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                          }}
                        >
                          <Image
                            src={getCompanyLogo(job.name)!}
                            alt={`${job.name} logo`}
                            width={32}
                            height={32}
                            className="object-contain"
                            loading="lazy"
                            quality={85}
                          />
                        </div>
                      </div>
                    )}{" "}
                    <div className="flex items-center">
                      {" "}
                      <span className="font-bold">
                        <span
                          className="job-text-span transition-colors duration-200"
                          style={{ color: "var(--color-text)" }}
                        >
                          {job.position}
                        </span>
                        <span style={{ color: "var(--color-muted)" }}> · </span>
                        <span
                          className="job-text-span transition-colors duration-200"
                          style={{ color: "var(--color-text)" }}
                        >
                          {job.name}
                        </span>{" "}
                      </span>
                      <div
                        className="ml-2 transform transition-all duration-200 ease-in-out
                    translate-x-0 translate-y-0 group-hover:translate-x-1 group-hover:-translate-y-1"
                      >
                        <FaArrowRight
                          className="job-arrow transform -rotate-45 transition-all duration-200"
                          style={{ color: "var(--color-text)" }}
                          size={14}
                        />
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              {/* RESUMEN */}
              <p
                className="mt-2 text-sm"
                style={{ color: "var(--color-muted)" }}
              >
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
                      className="group/item flex items-start space-x-3 
                  p-4 rounded-lg transition-all duration-200 border"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-muted)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--color-background)";
                        e.currentTarget.style.borderColor =
                          "var(--color-primary)";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--color-surface)";
                        e.currentTarget.style.borderColor =
                          "var(--color-border)";
                        e.currentTarget.style.transform = "translateX(0)";
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
            </motion.div>
          </div>
        ))
      )}

      {/* BOTÓN PARA VER RESUMEN COMPLETO */}

      {/* BOTÓN PARA VER RESUMEN COMPLETO */}
      <div className="mt-6">
        {" "}
        <a href="/[ENG]_Matias_Rios_CV_Jan_25.pdf" target="_blank">
          {" "}
          <div
            className="flex flex-row items-center cursor-pointer group transition-all duration-300"
            style={{ color: "var(--color-text)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-accent)";
              const arrow = e.currentTarget.querySelector(".resume-arrow");
              if (arrow) {
                (arrow as HTMLElement).style.color = "var(--color-accent)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text)";
              const arrow = e.currentTarget.querySelector(".resume-arrow");
              if (arrow) {
                (arrow as HTMLElement).style.color = "var(--color-text)";
              }
            }}
          >
            View Full Resume
            <div
              className="ml-2 transform transition-all duration-200 ease-in-out
              translate-x-0 translate-y-0 group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              <FaArrowRight
                className="resume-arrow transform -rotate-45 transition-all duration-200"
                style={{ color: "var(--color-text)" }}
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
