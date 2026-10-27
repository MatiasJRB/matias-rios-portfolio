import { useEffect } from "react";

const TOP_ZONE = 80;
const MIN_DELTA = 8;

/**
 * Flags the document while the visitor scrolls down so CSS can tuck the
 * floating controls (menu, theme switch, assistant launcher) out of the way
 * on narrow screens, where they would otherwise cover the copy. Scrolling up
 * or returning to the top brings them back.
 */
export function useFloatingChromeOnScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      if (y < TOP_ZONE) {
        root.dataset.floatingChrome = "visible";
      } else if (Math.abs(delta) >= MIN_DELTA) {
        root.dataset.floatingChrome = delta > 0 ? "hidden" : "visible";
      } else {
        return;
      }
      lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      delete root.dataset.floatingChrome;
    };
  }, [enabled]);
}
