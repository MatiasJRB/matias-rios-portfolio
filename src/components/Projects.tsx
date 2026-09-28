"use client";

import { cn } from "@/utils";
import React from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import type { Project } from "@/types";
import type { Dictionary } from "@/i18n/types";
import { getCompanyUrl } from "@/lib/companies";
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
  companyUrls = {},
}: {
  project: Project;
  accentColor: string;
  companyUrls?: Record<string, string>;
}) {
  const companyUrl = getCompanyUrl(companyUrls, project.company);

  return (
    <div
      className="project-artifact relative mb-6 aspect-[16/9] overflow-hidden rounded-xl border"
      style={{
        borderColor: `color-mix(in srgb, ${accentColor} 24%, var(--color-border))`,
        background: `color-mix(in srgb, ${accentColor} 8%, var(--color-background))`,
      }}
    >
      {project.visual?.image ? (
        <Image
          src={project.visual.image}
          alt={project.visual.alt || ""}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center"
          style={{ color: accentColor }}
        >
          <span className="h-24 w-24 rotate-12 rounded-3xl border border-current opacity-30" />
          <span className="absolute h-14 w-14 -rotate-12 rounded-full border border-current opacity-50" />
        </div>
      )}
      <div
        className="absolute bottom-3 left-3 rounded-lg px-2.5 py-1 text-xs font-semibold tracking-[0.08em]"
        style={{
          color: "var(--color-text)",
          backgroundColor:
            "color-mix(in srgb, var(--color-background) 86%, transparent)",
        }}
      >
        {project.company && companyUrl ? (
          <a href={companyUrl} target="_blank" rel="noopener noreferrer">
            {project.company}
          </a>
        ) : (
          project.company || project.role
        )}
      </div>
    </div>
  );
}

function FeaturedProjectCard({
  project,
  index,
  companyUrls = {},
}: {
  project: Project;
  index: number;
  companyUrls?: Record<string, string>;
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
      <ProjectArtifact
        project={project}
        accentColor={accentColor}
        companyUrls={companyUrls}
      />
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

        {project.proof && project.proof.length > 0 ? (
          <ul
            className="mt-5 grid gap-2 border-t pt-4"
            style={{
              borderColor:
                "color-mix(in srgb, var(--color-border) 72%, transparent)",
            }}
          >
            {project.proof.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-xs font-semibold leading-relaxed"
                style={{ color: "var(--color-muted)" }}
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.45rem] h-1.5 w-1.5 flex-none rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <p
          className="mt-auto border-t pt-4 text-xs font-semibold leading-relaxed"
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
  companyUrls?: Record<string, string>;
}> = ({
  projects,
  dictionary,
  githubUrl,
  contactUrl,
  className,
  companyUrls = {},
}) => {

  const featuredProjects = projects
    .filter((project) => project.featured)
    .sort(sortFeatured);
  const archiveProjects = projects.filter(
    (project) => !project.featured || project.showInArchive,
  );

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
                companyUrls={companyUrls}
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
                    {getCompanyUrl(companyUrls, group.key) ? (
                      <a
                        href={getCompanyUrl(companyUrls, group.key)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "inherit" }}
                      >
                        {group.label}
                      </a>
                    ) : (
                      group.label
                    )}
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
