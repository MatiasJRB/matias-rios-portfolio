"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Dictionary } from "@/i18n/types";

interface UseKeyboardNavigationOptions {
  smooth?: boolean;
  onNavigate?: (sectionId: string, direction: "up" | "down") => void;
  dictionary?: Dictionary;
}

export const useKeyboardNavigation = ({
  smooth = true,
  onNavigate,
  dictionary,
}: UseKeyboardNavigationOptions = {}) => {
  const currentIndex = useRef(0);
  const isNavigating = useRef(false);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [currentActionHint, setCurrentActionHint] = useState<string | null>(
    null,
  );
  const [currentActionColor, setCurrentActionColor] = useState<string | null>(
    null,
  );
  const navigableElements = useRef<HTMLElement[]>([]);
  const currentHoveredElement = useRef<HTMLElement | null>(null);
  const hasCollected = useRef(false);

  // Collect all navigable elements dynamically - sorted by visual order (top to bottom)
  const collectNavigableElements = useCallback(() => {
    const elements: HTMLElement[] = [];

    // Get About section paragraphs
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      const paragraphs =
        aboutSection.querySelectorAll<HTMLElement>("[data-paragraph]");
      paragraphs.forEach((p) => {
        elements.push(p);
      });
    }

    // Get Skills capability areas
    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
      const skillAreas =
        skillsSection.querySelectorAll<HTMLElement>("[data-skill-area]");
      skillAreas.forEach((area) => {
        elements.push(area);
      });
    }

    // Get all job cards and their content - in DOM order
    const jobCards = document.querySelectorAll<HTMLElement>(
      '[id^="job-"]:not([id*="-task-"]):not([id*="-summary"])',
    );
    jobCards.forEach((job) => {
      // Get summary paragraph
      const summary = job.querySelector<HTMLElement>("[data-job-summary]");
      if (summary) {
        elements.push(summary);
      }

      // Get ALL tasks for this job in order
      const tasks = job.querySelectorAll<HTMLElement>(
        '[id^="' + job.id + '-task-"]',
      );
      tasks.forEach((task) => {
        elements.push(task);
      });
    });

    // View resume button
    const viewResume = document.getElementById("view-resume");
    if (viewResume) elements.push(viewResume);

    // Get project cards in DOM order
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      const projectCards =
        projectsSection.querySelectorAll<HTMLElement>("[data-project-card]");
      projectCards.forEach((card) => {
        elements.push(card);
      });
    }

    // Footer paragraph
    const footer = document.getElementById("footer");
    if (footer) {
      const footerParagraph = footer.querySelector<HTMLElement>(
        "[data-footer-paragraph]",
      );
      if (footerParagraph) {
        elements.push(footerParagraph);
      }
    }

    navigableElements.current = elements;
    hasCollected.current = true;
    return elements;
  }, []);

  // Helper function to check if a color is too dark
  const isColorDark = useCallback((hex: string): boolean => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return false;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.3;
  }, []);

  const focusIfPossible = useCallback((element: HTMLElement | null) => {
    if (!element) return;

    const isFocusable =
      element.tabIndex >= 0 || element.hasAttribute("tabindex");

    if (isFocusable) {
      element.focus({ preventScroll: true });
    }
  }, []);

  // Apply the same hover styles that onMouseEnter applies + green dot for paragraphs
  const applyHoverStyles = useCallback(
    (
      element: HTMLElement | null,
      isHover: boolean,
      skipActionHintUpdate: boolean = false,
    ) => {
      if (!element) return;

      // Check element type
      const isTask = element.id.includes("-task-");
      const isParagraph = element.hasAttribute("data-paragraph");
      const isJobSummary = element.hasAttribute("data-job-summary");
      const isFooterParagraph = element.hasAttribute("data-footer-paragraph");
      const isViewResume = element.id === "view-resume";
      const isSkillArea = element.hasAttribute("data-skill-area");
      const isProjectCard = element.hasAttribute("data-project-card");

      // Get job color from element
      const jobColor =
        element.getAttribute("data-job-color") || "var(--color-primary)";
      const isDarkColor = jobColor.startsWith("#") && isColorDark(jobColor);

      // Helper function to extract domain from URL
      const getDomainFromUrl = (url: string | null): string | null => {
        if (!url) return null;
        try {
          const domain = new URL(url).hostname.replace("www.", "");
          return domain;
        } catch {
          return null;
        }
      };

      // Update action hint based on element type (skip if requested to avoid flickering during navigation)
      if (!skipActionHintUpdate) {
        if (isHover) {
          // Get job color from element attribute
          const jobColor = element.getAttribute("data-job-color");

          if (isViewResume) {
            setCurrentActionHint(dictionary?.keyboard.openCv ?? "open cv");
            setCurrentActionColor(null); // Use default accent color for CV
          } else if (isJobSummary) {
            const url = element.getAttribute("data-job-url");
            const domain = getDomainFromUrl(url);
            setCurrentActionHint(
              domain
                ? `${dictionary?.keyboard.visit ?? "visit"} ${domain}`
                : (dictionary?.keyboard.visitPage ?? "visit page"),
            );
            setCurrentActionColor(jobColor);
          } else if (isTask) {
            const url = element.getAttribute("data-job-url");
            const domain = getDomainFromUrl(url);
            setCurrentActionHint(
              domain
                ? `${dictionary?.keyboard.visit ?? "visit"} ${domain}`
                : (dictionary?.keyboard.visitPage ?? "visit page"),
            );
            setCurrentActionColor(jobColor);
          } else if (isProjectCard) {
            const url = element.getAttribute("data-project-url");
            const domain = getDomainFromUrl(url);
            setCurrentActionHint(
              domain
                ? `${dictionary?.keyboard.visit ?? "visit"} ${domain}`
                : url
                  ? (dictionary?.keyboard.visitPage ?? "visit page")
                  : null,
            );
            setCurrentActionColor(element.getAttribute("data-project-color"));
          } else {
            setCurrentActionHint(null);
            setCurrentActionColor(null);
          }
        } else {
          setCurrentActionHint(null);
          setCurrentActionColor(null);
        }
      }

      // Suppress browser focus ring, hover styles provide visual feedback
      element.style.outline = isHover ? "none" : "";

      // Add smooth transition
      element.style.transition = "all 0.3s ease-out";

      if (isTask) {
        const marker = element.querySelector<HTMLElement>(".highlight-marker");

        if (isHover) {
          element.style.transform = "translateX(4px)";

          if (marker) {
            marker.style.borderColor = jobColor;
            marker.style.boxShadow = `0 0 0 4px color-mix(in srgb, ${jobColor} 10%, transparent), 0 0 18px ${jobColor}`;
          }
        } else {
          element.style.transform = "translateX(0)";

          if (marker) {
            marker.style.borderColor =
              "color-mix(in srgb, var(--color-primary) 18%, var(--color-border))";
            marker.style.boxShadow = "none";
          }
        }
      } else if (isParagraph || isJobSummary || isFooterParagraph) {
        // Show/hide indicator with job color
        const indicator = element.querySelector(".keyboard-indicator");
        if (indicator) {
          (indicator as HTMLElement).style.transition =
            "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
          (indicator as HTMLElement).style.opacity = isHover ? "1" : "0";
          // Use job color for indicator, but white for dark colors
          if (isJobSummary && isHover) {
            (indicator as HTMLElement).style.backgroundColor = isDarkColor
              ? "rgba(255, 255, 255, 0.8)"
              : jobColor;
          }
        }


      } else if (isViewResume) {
        if (isHover) {
          element.style.color = "var(--color-primary)";
        } else {
          element.style.color = "var(--color-text)";
        }
      } else if (isProjectCard) {
        const projectColor =
          element.getAttribute("data-project-color") || "var(--color-primary)";

        if (isHover) {
          element.style.background = "transparent";
          element.style.borderColor = `color-mix(in srgb, ${projectColor} 54%, var(--color-border))`;
          element.style.boxShadow = `0 20px 46px color-mix(in srgb, ${projectColor} 10%, transparent), inset 0 1px 0 color-mix(in srgb, var(--color-text) 8%, transparent)`;
          element.style.transform = "translateX(4px)";
        } else {
          element.style.background = "transparent";
          element.style.borderColor =
            "color-mix(in srgb, var(--color-border) 58%, transparent)";
          element.style.boxShadow =
            "inset 0 1px 0 color-mix(in srgb, var(--color-text) 5%, transparent)";
          element.style.transform = "translateX(0)";
        }
      } else if (isSkillArea) {
        const skillColor =
          element.getAttribute("data-skill-color") || "var(--color-primary)";
        const line = element.querySelector<HTMLElement>("[data-skill-line]");
        const label = element.querySelector<HTMLElement>("[data-skill-label]");
        const description = element.querySelector<HTMLElement>(
          "[data-skill-description]",
        );
        const pills =
          element.querySelectorAll<HTMLElement>("[data-skill-pill]");

        if (line) {
          line.style.width = isHover ? "2.5rem" : "1.5rem";
          line.style.backgroundColor = isHover
            ? skillColor
            : "var(--color-muted)";
        }

        if (label) {
          label.style.color = isHover ? skillColor : "var(--color-muted)";
        }

        if (description) {
          description.style.color = isHover
            ? "var(--color-text)"
            : "var(--color-muted)";
        }

        pills.forEach((pill) => {
          const pillIndex = Number(pill.dataset.skillPillIndex || "0");
          pill.style.color = isHover
            ? "var(--color-text)"
            : "var(--color-muted)";
          pill.style.backgroundColor = isHover
            ? `color-mix(in srgb, ${skillColor} 10%, transparent)`
            : "transparent";
          pill.style.borderColor = isHover
            ? `color-mix(in srgb, ${skillColor} 32%, var(--color-border))`
            : "var(--color-border)";
          pill.style.transitionDelay = isHover ? `${pillIndex * 30}ms` : "0ms";
        });


      }
    },
    [
      dictionary?.keyboard.openCv,
      dictionary?.keyboard.visit,
      dictionary?.keyboard.visitPage,
      isColorDark,
    ],
  );

  // Clear current hover
  const clearCurrentHover = useCallback(
    (skipActionHintReset = false) => {
      if (currentHoveredElement.current) {
        if (document.activeElement === currentHoveredElement.current) {
          currentHoveredElement.current.blur();
        }
        applyHoverStyles(
          currentHoveredElement.current,
          false,
          skipActionHintReset,
        );
        currentHoveredElement.current = null;
      }
    },
    [applyHoverStyles],
  );

  // Find closest element to viewport center
  const findClosestElementIndex = useCallback((elements: HTMLElement[]) => {
    const viewportMiddle = window.innerHeight / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    elements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const elementMiddle = rect.top + rect.height / 2;
      const distance = Math.abs(elementMiddle - viewportMiddle);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }, []);

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;

      const tagName = target.tagName.toLowerCase();
      return (
        target.isContentEditable ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select"
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;

      // Handle Enter key for opening links
      if (e.key === "Enter" && isKeyboardMode) {
        const elements = navigableElements.current;
        const currentElement = elements[currentIndex.current];

        if (currentElement) {
          // Check if it's the view resume button
          if (currentElement.id === "view-resume") {
            e.preventDefault();
            currentElement.click();
            return;
          }

          // Check if it's a job summary or task (both have data-job-url attribute)
          const jobUrl = currentElement.getAttribute("data-job-url");
          if (jobUrl) {
            e.preventDefault();
            window.open(jobUrl, "_blank");
            return;
          }

          const projectUrl = currentElement.getAttribute("data-project-url");
          if (projectUrl) {
            e.preventDefault();
            window.open(projectUrl, "_blank");
            return;
          }
        }
      }

      if (!["ArrowUp", "ArrowDown"].includes(e.key)) return;
      e.preventDefault();

      // Collect elements on first navigation
      if (!hasCollected.current || navigableElements.current.length === 0) {
        collectNavigableElements();
      }

      const elements = navigableElements.current;
      if (elements.length === 0) return;

      // Prevent rapid navigation
      if (isNavigating.current) return;

      const direction = e.key === "ArrowUp" ? "up" : "down";

      // If entering keyboard mode, just highlight current element without navigating
      if (!isKeyboardMode) {
        setIsKeyboardMode(true);
        const closestIdx = findClosestElementIndex(elements);
        currentIndex.current = closestIdx;

        // Apply hover to current element with animation
        const currentElement = elements[closestIdx];
        if (currentElement) {
          setCurrentSection(currentElement.id);
          focusIfPossible(currentElement);
          applyHoverStyles(currentElement, true);
          currentHoveredElement.current = currentElement;
        }
        return; // Don't navigate on first key press, just activate
      }

      let nextIndex = currentIndex.current;

      if (direction === "down" && nextIndex < elements.length - 1) {
        nextIndex++;
      } else if (direction === "up" && nextIndex > 0) {
        nextIndex--;
      } else {
        return;
      }

      isNavigating.current = true;

      // Remove hover from previous with fade out animation (skip actionHint reset to avoid flickering)
      clearCurrentHover(true);

      currentIndex.current = nextIndex;
      const targetElement = elements[nextIndex];

      if (targetElement) {
        setCurrentSection(targetElement.id);

        // Smooth scroll with custom easing
        targetElement.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "center",
        });

        // Apply hover styles with animation after a small delay for smoother transition
        setTimeout(() => {
          focusIfPossible(targetElement);
          applyHoverStyles(targetElement, true);
          currentHoveredElement.current = targetElement;
        }, 50);

        onNavigate?.(targetElement.id, direction);

        setTimeout(
          () => {
            isNavigating.current = false;
          },
          smooth ? 200 : 50,
        );
      }
    };

    const handleMouseMove = () => {
      if (isKeyboardMode) {
        setIsKeyboardMode(false);
        clearCurrentHover();
        setCurrentSection(null);
        setCurrentActionHint(null);
      }
    };

    const handleWheel = () => {
      if (isKeyboardMode) {
        setIsKeyboardMode(false);
        clearCurrentHover();
        setCurrentSection(null);
        setCurrentActionHint(null);
      }
    };

    const handleMouseDown = () => {
      if (isKeyboardMode) {
        setIsKeyboardMode(false);
        clearCurrentHover();
        setCurrentSection(null);
        setCurrentActionHint(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousedown", handleMouseDown);
      clearCurrentHover();
    };
  }, [
    smooth,
    onNavigate,
    isKeyboardMode,
    collectNavigableElements,
    applyHoverStyles,
    clearCurrentHover,
    findClosestElementIndex,
    focusIfPossible,
  ]);

  return {
    isKeyboardMode,
    currentSection,
    currentActionHint,
    currentActionColor,
  };
};
