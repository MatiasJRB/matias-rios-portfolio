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
  const navigableElements = useRef<HTMLElement[]>([]);
  const currentHoveredElement = useRef<HTMLElement | null>(null);
  const hasCollected = useRef(false);

  // Collect all navigable elements dynamically - sorted by visual order (top to bottom)
  const collectNavigableElements = useCallback(() => {
    const elements: HTMLElement[] = [];

    // Get main sections
    const presentation = document.getElementById("presentation");
    const about = document.getElementById("about");
    const viewResume = document.getElementById("view-resume");
    const footer = document.getElementById("footer");

    if (presentation) elements.push(presentation);
    if (about) elements.push(about);

    // Get all job cards and their tasks - in DOM order (which should be chronological)
    const jobCards = document.querySelectorAll<HTMLElement>(
      '[id^="job-"]:not([id*="-task-"])'
    );
    jobCards.forEach((job) => {
      elements.push(job);
      // Get ALL tasks for this job in order
      const tasks = job.querySelectorAll<HTMLElement>(
        '[id^="' + job.id + '-task-"]'
      );
      tasks.forEach((task) => {
        elements.push(task);
      });
    });

    if (viewResume) elements.push(viewResume);
    if (footer) elements.push(footer);

    navigableElements.current = elements;
    hasCollected.current = true;
    return elements;
  }, []);

  // Apply the same hover styles that onMouseEnter applies
  const applyHoverStyles = useCallback(
    (element: HTMLElement | null, isHover: boolean) => {
      if (!element) return;

      // Only apply to task elements (the ones with the hover effect)
      const isTask = element.id.includes("-task-");

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
          smooth ? 300 : 50
        );
      }
    };

    const handleMouseMove = () => {
      if (isKeyboardMode) {
        setIsKeyboardMode(false);
        clearCurrentHover();
        setCurrentSection(null);
      }
    };

    const handleWheel = () => {
      if (isKeyboardMode) {
        setIsKeyboardMode(false);
        clearCurrentHover();
        setCurrentSection(null);
      }
    };

    const handleMouseDown = () => {
      if (isKeyboardMode) {
        setIsKeyboardMode(false);
        clearCurrentHover();
        setCurrentSection(null);
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
  };
};
