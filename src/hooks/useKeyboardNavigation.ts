"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseKeyboardNavigationOptions {
  smooth?: boolean;
  onNavigate?: (sectionId: string, direction: "up" | "down") => void;
}

export const useKeyboardNavigation = ({
  smooth = true,
  onNavigate,
}: UseKeyboardNavigationOptions = {}) => {
  const currentIndex = useRef(0);
  const isNavigating = useRef(false);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [currentActionHint, setCurrentActionHint] = useState<string | null>(
    null
  );
  const navigableElements = useRef<HTMLElement[]>([]);
  const currentHoveredElement = useRef<HTMLElement | null>(null);
  const hasCollected = useRef(false);

  // Collect all navigable elements dynamically - sorted by visual order (top to bottom)
  const collectNavigableElements = useCallback(() => {
    const elements: HTMLElement[] = [];

    // Get main sections
    const presentation = document.getElementById("presentation");

    // Get About section paragraphs
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      const paragraphs =
        aboutSection.querySelectorAll<HTMLElement>("[data-paragraph]");
      paragraphs.forEach((p) => {
        elements.push(p);
      });
    }

    // Get all job cards and their content - in DOM order
    const jobCards = document.querySelectorAll<HTMLElement>(
      '[id^="job-"]:not([id*="-task-"]):not([id*="-summary"])'
    );
    jobCards.forEach((job) => {
      // Get summary paragraph
      const summary = job.querySelector<HTMLElement>("[data-job-summary]");
      if (summary) {
        elements.push(summary);
      }

      // Get ALL tasks for this job in order
      const tasks = job.querySelectorAll<HTMLElement>(
        '[id^="' + job.id + '-task-"]'
      );
      tasks.forEach((task) => {
        elements.push(task);
      });
    });

    // View resume button
    const viewResume = document.getElementById("view-resume");
    if (viewResume) elements.push(viewResume);

    // Footer paragraph
    const footer = document.getElementById("footer");
    if (footer) {
      const footerParagraph = footer.querySelector<HTMLElement>(
        "[data-footer-paragraph]"
      );
      if (footerParagraph) {
        elements.push(footerParagraph);
      }
    }

    navigableElements.current = elements;
    hasCollected.current = true;
    return elements;
  }, []);

  // Apply the same hover styles that onMouseEnter applies + green dot for paragraphs
  const applyHoverStyles = useCallback(
    (element: HTMLElement | null, isHover: boolean) => {
      if (!element) return;

      // Check element type
      const isTask = element.id.includes("-task-");
      const isParagraph = element.hasAttribute("data-paragraph");
      const isJobSummary = element.hasAttribute("data-job-summary");
      const isFooterParagraph = element.hasAttribute("data-footer-paragraph");
      const isViewResume = element.id === "view-resume";

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

      // Update action hint based on element type
      if (isHover) {
        if (isViewResume) {
          setCurrentActionHint("open cv");
        } else if (isJobSummary) {
          const url = element.getAttribute("data-job-url");
          const domain = getDomainFromUrl(url);
          setCurrentActionHint(domain ? `visit ${domain}` : "visit page");
        } else if (isTask) {
          const url = element.getAttribute("data-job-url");
          const domain = getDomainFromUrl(url);
          setCurrentActionHint(domain ? `visit ${domain}` : "visit page");
        } else {
          setCurrentActionHint(null);
        }
      } else {
        setCurrentActionHint(null);
      }

      if (isTask) {
        if (isHover) {
          element.style.backgroundColor = "var(--color-background)";
          element.style.borderColor = "var(--color-primary)";
          element.style.transform = "translateX(4px)";
        } else {
          element.style.backgroundColor = "var(--color-surface)";
          element.style.borderColor = "var(--color-border)";
          element.style.transform = "translateX(0)";
        }
      } else if (isParagraph || isJobSummary || isFooterParagraph) {
        // Show/hide green dot indicator
        const indicator = element.querySelector(".keyboard-indicator");
        if (indicator) {
          (indicator as HTMLElement).style.opacity = isHover ? "1" : "0";
        }
      } else if (isViewResume) {
        if (isHover) {
          element.style.color = "var(--color-accent)";
          const arrow = element.querySelector(".resume-arrow");
          if (arrow) {
            (arrow as HTMLElement).style.color = "var(--color-accent)";
          }
        } else {
          element.style.color = "var(--color-text)";
          const arrow = element.querySelector(".resume-arrow");
          if (arrow) {
            (arrow as HTMLElement).style.color = "var(--color-text)";
          }
        }
      }
    },
    []
  );

  // Clear current hover
  const clearCurrentHover = useCallback(() => {
    if (currentHoveredElement.current) {
      applyHoverStyles(currentHoveredElement.current, false);
      currentHoveredElement.current = null;
    }
  }, [applyHoverStyles]);

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
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Enter key for opening links
      if (e.key === "Enter" && isKeyboardMode) {
        const elements = navigableElements.current;
        const currentElement = elements[currentIndex.current];

        if (currentElement) {
          // Check if it's the view resume button
          if (currentElement.id === "view-resume") {
            e.preventDefault();
            window.open("/[ENG]_Matias_Rios_CV_Jan_25.pdf", "_blank");
            return;
          }

          // Check if it's a job summary or task (both have data-job-url attribute)
          const jobUrl = currentElement.getAttribute("data-job-url");
          if (jobUrl) {
            e.preventDefault();
            window.open(jobUrl, "_blank");
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

        // Apply hover to current element
        const currentElement = elements[closestIdx];
        if (currentElement) {
          setCurrentSection(currentElement.id);
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

      // Remove hover from previous
      clearCurrentHover();

      currentIndex.current = nextIndex;
      const targetElement = elements[nextIndex];

      if (targetElement) {
        setCurrentSection(targetElement.id);

        // Apply hover styles directly
        applyHoverStyles(targetElement, true);
        currentHoveredElement.current = targetElement;

        // Scroll to element
        targetElement.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "center",
        });

        onNavigate?.(targetElement.id, direction);

        setTimeout(
          () => {
            isNavigating.current = false;
          },
          smooth ? 100 : 50
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
  ]);

  return {
    isKeyboardMode,
    currentSection,
    currentActionHint,
  };
};
