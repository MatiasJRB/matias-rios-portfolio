import { cn } from "@/utils";
import React, { useState } from "react";
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
import { SkeletonHistoryCard } from "./SkeletonLoader";
import type { Job, HistoryProps } from "@/types";
import { COMPANY_LOGOS } from "@/constants";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { getSlideInAnimation } from "@/hooks/useSlideInAnimation";

const History: React.FC<
  HistoryProps & { lang: Locale; work: Job[]; dictionary: Dictionary }
> = ({ className, id = "history", lang: _lang, work, dictionary }) => {
  const [isLoading] = useState(false);

  const getCompanyHoverColor = (companyName: string) => {
    const colors: Record<string, string> = {
      Nuqlea: "var(--company-nuqlea)",
      Kalkomey: "var(--company-kalkomey)",
      Mango: "var(--company-mango)",
      Mangxo: "var(--company-mango)",
      Geome7ric: "var(--company-geome7ric)",
    };
    return colors[companyName] || "var(--color-accent)";
  };

  const getCompanyLogo = (companyName: string) => {
    return COMPANY_LOGOS[companyName] || null;
  };

  const getIconForHighlight = (highlight: string) => {
    const l = highlight.toLowerCase();
    if (
      l.includes("architect") ||
      l.includes("architecture") ||
      l.includes("arquitect") ||
      l.includes("design") ||
      l.includes("diseño")
    )
      return <FaBuilding size={12} style={{ color: "var(--color-primary)" }} />;
    if (
      (l.includes("technical") || l.includes("técnic")) &&
      (l.includes("standard") ||
        l.includes("estándar") ||
        l.includes("calidad"))
    )
      return (
        <FaShieldAlt size={12} style={{ color: "var(--color-success)" }} />
      );
    if (
      l.includes("development") ||
      l.includes("team") ||
      l.includes("desarrollo") ||
      l.includes("equipo")
    )
      return <FaUsers size={12} style={{ color: "var(--color-accent)" }} />;
    if (
      l.includes("onboarding") ||
      l.includes("mentoring") ||
      l.includes("mentor")
    )
      return (
        <FaGraduationCap size={12} style={{ color: "var(--color-warning)" }} />
      );
    if (
      l.includes("implementation") ||
      l.includes("implementación") ||
      l.includes("producto") ||
      l.includes("product")
    )
      return <FaRocket size={12} style={{ color: "var(--color-primary)" }} />;
    if (
      l.includes("infrastructure") ||
      l.includes("infraestructura") ||
      l.includes("ci/cd")
    )
      return <FaServer size={12} style={{ color: "var(--color-muted)" }} />;
    if (
      l.includes("tools") ||
      l.includes("herramientas") ||
      l.includes("monitoring") ||
      l.includes("monitoreo")
    )
      return <FaTools size={12} style={{ color: "var(--color-accent)" }} />;
    if (
      l.includes("communicat") ||
      l.includes("comunic") ||
      l.includes("progress") ||
      l.includes("progreso")
    )
      return <FaComments size={12} style={{ color: "var(--color-primary)" }} />;
    if (
      l.includes("scalability") ||
      l.includes("escalabilidad") ||
      l.includes("business") ||
      l.includes("negocio")
    )
      return (
        <FaChartLine size={12} style={{ color: "var(--color-success)" }} />
      );
    if (
      l.includes("database") ||
      l.includes("base de datos") ||
      l.includes("data")
    )
      return <FaDatabase size={12} style={{ color: "var(--color-primary)" }} />;
    if (l.includes("cloud") || l.includes("nube"))
      return <FaCloud size={12} style={{ color: "var(--color-primary)" }} />;
    if (l.includes("leadership") || l.includes("liderazgo"))
      return (
        <FaLightbulb size={12} style={{ color: "var(--color-warning)" }} />
      );
    return <FaCode size={12} style={{ color: "var(--color-accent)" }} />;
  };

  return (
    <div id={id} className={cn("w-full", className)}>
      {isLoading ? (
        <>
          <SkeletonHistoryCard />
          <SkeletonHistoryCard />
          <SkeletonHistoryCard />
        </>
      ) : (
        work.map((job, index) => {
          const jobId = `job-${job.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
          const animation = getSlideInAnimation(index);
          return (
            <div
              key={job.name}
              id={jobId}
              className={`mb-14 scroll-mt-24 ${animation.className}`}
              style={animation.style}
            >
              {/* Date */}
              <div
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--color-muted)" }}
              >
                {job.startDate}
                <span
                  className="inline-block w-3 h-px mx-2 align-middle"
                  style={{ backgroundColor: "var(--color-muted)" }}
                />
                {job.endDate}
              </div>

              {/* Title + Company */}
              <h3 className="mt-2 text-base font-bold leading-snug">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)]"
                  onMouseEnter={(e) => {
                    const color = getCompanyHoverColor(job.name);
                    e.currentTarget
                      .querySelectorAll(".job-text")
                      .forEach(
                        (el) => ((el as HTMLElement).style.color = color),
                      );
                    const logo = e.currentTarget.querySelector(".company-logo");
                    if (logo) (logo as HTMLElement).style.borderColor = color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget
                      .querySelectorAll(".job-text")
                      .forEach((el) => ((el as HTMLElement).style.color = ""));
                    const logo = e.currentTarget.querySelector(".company-logo");
                    if (logo)
                      (logo as HTMLElement).style.borderColor =
                        "var(--color-border)";
                  }}
                >
                  {getCompanyLogo(job.name) && (
                    <div
                      className="company-logo flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border transition-[border-color,transform] duration-200"
                      style={{
                        backgroundColor: "var(--color-muted)",
                        borderColor: "var(--color-border)",
                        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                      }}
                    >
                      <Image
                        src={getCompanyLogo(job.name)!}
                        alt={`${job.name} logo`}
                        width={26}
                        height={26}
                        className="object-contain"
                        style={{ width: "auto", height: "auto" }}
                        loading="lazy"
                        quality={85}
                      />
                    </div>
                  )}
                  <span>
                    <span
                      className="job-text transition-colors duration-200"
                      style={{ color: "var(--color-text)" }}
                    >
                      {job.position}
                    </span>
                    <span
                      className="mx-1.5"
                      style={{ color: "var(--color-muted)" }}
                    >
                      ·
                    </span>
                    <span
                      className="job-text transition-colors duration-200"
                      style={{ color: "var(--color-text)" }}
                    >
                      {job.name}
                    </span>
                  </span>
                  <FaArrowRight
                    className="job-text -rotate-45 flex-shrink-0 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: "var(--color-text)" }}
                    size={12}
                  />
                </a>
              </h3>

              {/* Summary */}
              <div
                data-job-summary
                data-job-url={job.url}
                data-job-color={getCompanyHoverColor(job.name)}
                className="relative scroll-mt-24"
              >
                <div
                  className="keyboard-indicator absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-opacity duration-200"
                  style={{
                    opacity: 0,
                    background: "var(--color-primary)",
                  }}
                />
                <p
                  className="mt-3 text-base leading-relaxed"
                  style={{ color: "var(--color-muted)" }}
                >
                  {job.summary}
                </p>
              </div>

              {/* Highlights as a minimal timeline */}
              {job.highlights.length > 0 && (
                <div className="mt-5">
                  <h4
                    className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {dictionary.history.keyResponsibilities}
                  </h4>
                  <div
                    className="relative ml-4 space-y-0 border-l"
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--color-border) 72%, transparent)",
                    }}
                  >
                    {job.highlights.map((task, taskIndex) => (
                      <div
                        key={task}
                        id={`${jobId}-task-${taskIndex}`}
                        data-job-url={job.url}
                        data-job-color={getCompanyHoverColor(job.name)}
                        className="group/item relative py-2.5 pl-10 scroll-mt-24 transition-transform duration-200"
                        style={{
                          color: "var(--color-muted)",
                        }}
                        onMouseEnter={(e) => {
                          const hoverColor = getCompanyHoverColor(job.name);
                          e.currentTarget.style.transform = "translateX(4px)";
                          const marker = e.currentTarget.querySelector(
                            ".highlight-marker",
                          ) as HTMLElement | null;
                          if (marker) {
                            marker.style.borderColor = hoverColor;
                            marker.style.backgroundColor = `color-mix(in srgb, ${hoverColor} 16%, var(--color-background))`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateX(0)";
                          const marker = e.currentTarget.querySelector(
                            ".highlight-marker",
                          ) as HTMLElement | null;
                          if (marker) {
                            marker.style.borderColor =
                              "color-mix(in srgb, var(--color-primary) 18%, var(--color-border))";
                            marker.style.backgroundColor =
                              "color-mix(in srgb, var(--color-background) 74%, transparent)";
                          }
                        }}
                      >
                        <div
                          className="highlight-marker absolute -left-3.5 top-[0.85rem] z-10 flex h-7 w-7 items-center justify-center rounded-full border transition-[background-color,border-color] duration-200"
                          style={{
                            backgroundColor:
                              "color-mix(in srgb, var(--color-background) 74%, transparent)",
                            borderColor:
                              "color-mix(in srgb, var(--color-primary) 18%, var(--color-border))",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          {getIconForHighlight(task)}
                        </div>
                        <p
                          className="text-base leading-relaxed flex-1 font-medium"
                          style={{ color: "var(--color-muted)" }}
                        >
                          {task}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default History;
