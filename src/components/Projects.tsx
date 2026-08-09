"use client";

import { cn } from "@/utils";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import type { Project } from "@/types";
import type { Dictionary } from "@/i18n/types";
import { getSlideInAnimation } from "@/hooks/useSlideInAnimation";

const COMPANY_COLORS: Record<string, string> = {
  Mango: "var(--company-mango)",
  Mangxo: "var(--company-mango)",
  Geome7ric: "var(--company-geome7ric)",
};

const FEATURED_COLORS = [
  "var(--company-mango)",
  "var(--company-geome7ric)",
  "var(--project-teal)",
];

const getAccentColor = (project: Project, index = 0) =>
  COMPANY_COLORS[project.company || ""] ||
  FEATURED_COLORS[index % FEATURED_COLORS.length] ||
  "var(--color-primary)";

const sortFeatured = (a: Project, b: Project) =>
  (a.featuredRank ?? Number.MAX_SAFE_INTEGER) -
  (b.featuredRank ?? Number.MAX_SAFE_INTEGER);

function ProjectArtifact({
  project,
  accentColor,
}: {
  project: Project;
  accentColor: string;
}) {
  const normalizedName = project.name.toLowerCase();

  return (
    <div
      className="project-artifact relative mb-6 aspect-[16/9] overflow-hidden rounded-xl border"
      style={{
        color: accentColor,
        borderColor: `color-mix(in srgb, ${accentColor} 24%, var(--color-border))`,
        background: `color-mix(in srgb, ${accentColor} 8%, var(--color-background))`,
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 320 180"
        className="h-full w-full"
        fill="none"
      >
        <path
          d="M0 24H320M0 90H320M0 156H320"
          stroke="currentColor"
          strokeOpacity="0.09"
        />
        <path
          d="M40 0V180M160 0V180M280 0V180"
          stroke="currentColor"
          strokeOpacity="0.09"
        />

        {normalizedName.includes("cobros") ? (
          <>
            <rect
              x="26"
              y="38"
              width="78"
              height="104"
              rx="12"
              fill="currentColor"
              fillOpacity="0.1"
              stroke="currentColor"
              strokeOpacity="0.42"
            />
            <path
              d="M43 61H87M43 78H76M43 112H87M43 128H68"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeOpacity="0.62"
            />
            <path
              d="M112 90H159M205 90H252"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="5 6"
              strokeOpacity="0.58"
            />
            <circle
              cx="182"
              cy="90"
              r="24"
              fill="currentColor"
              fillOpacity="0.16"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M173 90H191M182 81V99"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <rect
              x="254"
              y="52"
              width="40"
              height="76"
              rx="10"
              fill="currentColor"
              fillOpacity="0.08"
              stroke="currentColor"
              strokeOpacity="0.42"
            />
            <circle cx="274" cy="111" r="3" fill="currentColor" />
          </>
        ) : normalizedName.includes("badger") ? (
          <>
            {[0, 1, 2].map((row) =>
              [0, 1, 2, 3].map((column) => (
                <rect
                  key={`${row}-${column}`}
                  x={28 + column * 45}
                  y={40 + row * 34}
                  width="31"
                  height="22"
                  rx="5"
                  fill="currentColor"
                  fillOpacity={(row + column) % 3 === 0 ? 0.24 : 0.08}
                  stroke="currentColor"
                  strokeOpacity="0.34"
                />
              )),
            )}
            <rect
              x="224"
              y="28"
              width="66"
              height="124"
              rx="16"
              fill="currentColor"
              fillOpacity="0.12"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M242 54H272M242 68H263M242 105H272"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeOpacity="0.62"
            />
            <path
              d="M244 122V136M251 118V136M258 124V136M265 116V136M272 121V136"
              stroke="currentColor"
              strokeWidth="3"
            />
          </>
        ) : normalizedName.includes("asiento") ? (
          <>
            <path
              d="M42 125C88 42 186 159 278 55"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="8 9"
              strokeOpacity="0.66"
            />
            <circle
              cx="42"
              cy="125"
              r="12"
              fill="currentColor"
              fillOpacity="0.18"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              cx="278"
              cy="55"
              r="12"
              fill="currentColor"
              fillOpacity="0.18"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="42" cy="125" r="4" fill="currentColor" />
            <circle cx="278" cy="55" r="4" fill="currentColor" />
            <rect
              x="118"
              y="57"
              width="86"
              height="54"
              rx="12"
              fill="currentColor"
              fillOpacity="0.12"
              stroke="currentColor"
              strokeOpacity="0.48"
            />
            <circle
              cx="139"
              cy="78"
              r="8"
              fill="currentColor"
              fillOpacity="0.36"
            />
            <path
              d="M156 72H187M156 85H178M132 99H190"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeOpacity="0.6"
            />
          </>
        ) : (
          <>
            <circle
              cx="78"
              cy="90"
              r="34"
              fill="currentColor"
              fillOpacity="0.1"
              stroke="currentColor"
              strokeOpacity="0.4"
            />
            <circle
              cx="242"
              cy="58"
              r="25"
              fill="currentColor"
              fillOpacity="0.14"
              stroke="currentColor"
              strokeOpacity="0.46"
            />
            <circle
              cx="230"
              cy="130"
              r="18"
              fill="currentColor"
              fillOpacity="0.08"
              stroke="currentColor"
              strokeOpacity="0.36"
            />
            <path
              d="M112 84L217 63M106 108L213 127M241 83L232 112"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 7"
              strokeOpacity="0.54"
            />
          </>
        )}
      </svg>

      <div
        className="absolute bottom-3 left-3 rounded-lg px-2.5 py-1 text-xs font-semibold tracking-[0.08em]"
        style={{
          color: "var(--color-text)",
          backgroundColor:
            "color-mix(in srgb, var(--color-background) 82%, transparent)",
        }}
      >
        {project.company || project.role}
      </div>
    </div>
  );
}

function FeaturedProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const accentColor = getAccentColor(project, index);
  const animation = getSlideInAnimation(index);
  const headline = (project.headline || project.description || "").trim();
  const summary = (project.impact || project.description || "").trim();

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 focus-within:-translate-y-1 md:p-6",
        animation.className,
      )}
      style={{
        ...animation.style,
        background: "color-mix(in srgb, var(--color-surface) 78%, transparent)",
        borderColor: `color-mix(in srgb, ${accentColor} 22%, var(--color-border))`,
        boxShadow: "0 14px 34px -26px var(--shadow-hover)",
      }}
    >
      <ProjectArtifact project={project} accentColor={accentColor} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div>
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm outline-none group/link focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)]"
            >
              <h3
                className="font-display text-2xl font-semibold leading-none tracking-[-0.02em] transition-colors duration-200"
                style={{ color: "var(--color-text)" }}
              >
                {project.name}
              </h3>
              <FaArrowRight
                aria-hidden="true"
                className="-rotate-45 flex-shrink-0 transition-[color,transform] duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                style={{ color: accentColor }}
                size={11}
              />
            </a>
          ) : (
            <h3
              className="font-display text-2xl font-semibold leading-none tracking-[-0.02em]"
              style={{ color: "var(--color-text)" }}
            >
              {project.name}
            </h3>
          )}

          <p
            className="mt-4 text-base font-semibold leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            {headline}
          </p>
        </div>

        {summary ? (
          <p
            className="mt-3 text-sm font-normal leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            {summary}
          </p>
        ) : null}
        <p
          className="mt-6 border-t pt-4 text-xs font-semibold leading-relaxed"
          style={{
            color: accentColor,
            borderColor:
              "color-mix(in srgb, var(--color-border) 72%, transparent)",
          }}
        >
          {project.tech.join(" · ")}
        </p>
      </div>
    </article>
  );
}

function ArchiveProjectCard({
  project,
  index,
  dictionary,
}: {
  project: Project;
  index: number;
  dictionary: Dictionary;
}) {
  const animation = getSlideInAnimation(index);
  const accentColor = getAccentColor(project, index);
  const indexLabel = String(index + 1).padStart(2, "0");

  const content = (
    <>
      <span
        aria-hidden="true"
        className="text-xs font-semibold tabular-nums tracking-[0.16em] md:pt-1"
        style={{ color: accentColor }}
      >
        {indexLabel}
      </span>

      <div className="min-w-0">
        <h5
          className="text-balance text-lg font-semibold leading-snug tracking-[-0.02em] md:text-xl"
          style={{ color: "var(--color-text)" }}
        >
          {project.name}
        </h5>
        <p
          className="mt-2 max-w-[65ch] break-words text-pretty text-base font-normal leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          {project.impact || project.description}
        </p>
      </div>

      <div className="min-w-0 md:pt-1">
        <p
          className="text-xs font-semibold uppercase tracking-[0.14em]"
          style={{ color: accentColor }}
        >
          {project.role}
        </p>
        <p
          className="mt-2 break-words text-pretty text-sm font-medium leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          {project.tech.join(" · ")}
        </p>
        <span
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold"
          style={{
            color: project.url ? accentColor : "var(--color-muted)",
          }}
        >
          {project.url
            ? dictionary.projects.archivePublicLabel
            : dictionary.projects.archivePrivateLabel}
          {project.url ? (
            <FaArrowRight
              aria-hidden="true"
              className="-rotate-45 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              size={10}
            />
          ) : null}
        </span>
      </div>
    </>
  );

  return (
    <article
      key={project.name}
      className={cn("relative border-b", animation.className)}
      style={{
        ...animation.style,
        borderColor:
          "color-mix(in srgb, var(--color-border) 72%, transparent)",
      }}
    >
      {project.url ? (
        <a
          data-project-card
          data-project-url={project.url}
          data-project-color={accentColor}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="archive-row-link group grid gap-4 px-0 py-6 outline-none md:grid-cols-[3rem_minmax(0,1fr)_minmax(13rem,0.42fr)] md:gap-6 md:py-7 lg:grid-cols-[4rem_minmax(0,1fr)_18rem]"
          aria-label={`${dictionary.projects.archivePublicLabel}: ${project.name}`}
        >
          {content}
        </a>
      ) : (
        <div className="grid gap-4 px-0 py-6 md:grid-cols-[3rem_minmax(0,1fr)_minmax(13rem,0.42fr)] md:gap-6 md:py-7 lg:grid-cols-[4rem_minmax(0,1fr)_18rem]">
          {content}
        </div>
      )}
    </article>
  );
}

const Projects: React.FC<{
  projects: Project[];
  dictionary: Dictionary;
  githubUrl?: string;
  contactUrl?: string;
  className?: string;
}> = ({ projects, dictionary, githubUrl, contactUrl, className }) => {

  const featuredProjects = projects
    .filter((project) => project.featured)
    .sort(sortFeatured);
  const archiveProjects = projects.filter((project) => !project.featured);

  const grouped = [
    {
      key: "Mango",
      label: "Mango",
      items: archiveProjects.filter(
        (p) => p.company === "Mango" || p.company === "Mangxo",
      ),
    },
    {
      key: "Geome7ric",
      label: "Geome7ric",
      items: archiveProjects.filter((p) => p.company === "Geome7ric"),
    },
    {
      key: "own",
      label: dictionary.projects.archiveOwnGroup,
      items: archiveProjects.filter((p) => !p.company),
    },
  ].filter((group) => group.items.length > 0);

  let archiveIndex = 0;

  return (
    <div className={cn("w-full", className)}>
      {featuredProjects.length > 0 && (
        <div className="mb-14">
          <div className="mb-6">
            <p
              className="max-w-2xl text-base font-normal leading-relaxed"
              style={{ color: "var(--color-muted)" }}
            >
              {dictionary.projects.featuredIntro}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {featuredProjects.map((project, index) => (
              <FeaturedProjectCard
                key={project.name}
                project={project}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {grouped.length > 0 && (
        <section aria-labelledby="project-archive-heading">
          <div className="mb-7">
            <h3
              id="project-archive-heading"
              className="font-display text-2xl font-semibold tracking-[-0.02em]"
              style={{ color: "var(--color-text)" }}
            >
              {dictionary.projects.archiveTitle}
            </h3>
            <p
              className="mt-2 text-sm font-medium"
              style={{ color: "var(--color-muted)" }}
            >
              {dictionary.projects.archiveIntro}
            </p>
          </div>

          {grouped.map((group) => {
            const groupColor =
              COMPANY_COLORS[group.key] || "var(--color-muted)";

            return (
              <div key={group.key} className="mb-12 last:mb-0">
                <div className="mb-5 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-px w-10 rounded-full"
                    style={{ backgroundColor: groupColor }}
                  />
                  <h4
                    className="text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ color: groupColor }}
                  >
                    {group.label}
                  </h4>
                </div>

                <div
                  className="border-t"
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--color-border) 72%, transparent)",
                  }}
                >
                  {group.items.map((project) => (
                    <ArchiveProjectCard
                      key={project.name}
                      project={project}
                      index={archiveIndex++}
                      dictionary={dictionary}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          <div
            className="mt-14 grid gap-6 border-t pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
            style={{
              borderColor:
                "color-mix(in srgb, var(--color-border) 72%, transparent)",
            }}
          >
            <p
              className="max-w-3xl text-pretty text-base leading-relaxed"
              style={{ color: "var(--color-muted)" }}
            >
              {dictionary.projects.archiveClosing}
            </p>
            <div className="flex flex-wrap gap-3">
              {githubUrl ? (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="control-hover inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold"
                  style={{
                    backgroundColor: "var(--color-text)",
                    color: "var(--color-background)",
                  }}
                >
                  {dictionary.projects.archiveGithubCta}
                </a>
              ) : null}
              {contactUrl ? (
                <a
                  href={contactUrl}
                  className="control-hover inline-flex min-h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold"
                  style={{
                    color: "var(--color-text)",
                    borderColor: "var(--color-border)",
                    backgroundColor:
                      "color-mix(in srgb, var(--color-surface) 42%, transparent)",
                  }}
                >
                  {dictionary.projects.archiveContactCta}
                </a>
              ) : null}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Projects;
