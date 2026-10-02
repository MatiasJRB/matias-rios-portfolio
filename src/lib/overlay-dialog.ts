/** Layout viewport and the portion still visible above a software keyboard. */
export function getOverlayViewport(
  layoutHeight: number,
  viewport?: { height: number; offsetTop: number } | null,
) {
  const height = Math.max(1, Math.min(layoutHeight, viewport?.height ?? layoutHeight));
  const top = Math.max(0, Math.min(viewport?.offsetTop ?? 0, layoutHeight - height));
  return { height, top, bottom: Math.max(0, layoutHeight - top - height) };
}

/** Keep fixed overlays inside the visual viewport, including embedded browsers. */
export function observeOverlayViewport(element: HTMLElement, win: Window = window) {
  const viewport = win.visualViewport;
  let frame = 0;
  const update = () => {
    const { height, top, bottom } = getOverlayViewport(win.innerHeight, viewport);
    element.style.setProperty("--overlay-viewport-height", `${height}px`);
    element.style.setProperty("--overlay-viewport-top", `${top}px`);
    element.style.setProperty("--overlay-viewport-bottom", `${bottom}px`);
    element.dataset.compactViewport = String(height < 480);
  };
  const schedule = () => {
    win.cancelAnimationFrame(frame);
    frame = win.requestAnimationFrame(update);
  };
  update();
  win.addEventListener("resize", schedule);
  viewport?.addEventListener("resize", schedule);
  viewport?.addEventListener("scroll", schedule);
  return () => {
    win.cancelAnimationFrame(frame);
    win.removeEventListener("resize", schedule);
    viewport?.removeEventListener("resize", schedule);
    viewport?.removeEventListener("scroll", schedule);
    for (const property of ["height", "top", "bottom"]) {
      element.style.removeProperty(`--overlay-viewport-${property}`);
    }
    delete element.dataset.compactViewport;
  };
}

/** Protect modal focus and background without losing scroll or existing inert state. */
export function activateOverlayModal(
  dialog: HTMLElement,
  initialFocus: HTMLElement,
  close: () => void,
) {
  const doc = dialog.ownerDocument;
  const win = doc.defaultView!;
  const previousOverflow = doc.body.style.overflow;
  const previousRootOverflow = doc.documentElement.style.overflow;
  const inertElements: Array<{ element: Element; value: string | null }> = [];
  // Works for both portalled and inline dialogs; do not inert an ancestor.
  let branch: Element = dialog;
  while (branch.parentElement) {
    for (const sibling of branch.parentElement.children) {
      if (sibling === branch || ["SCRIPT", "STYLE", "LINK"].includes(sibling.tagName)) continue;
      inertElements.push({ element: sibling, value: sibling.getAttribute("inert") });
      sibling.setAttribute("inert", "");
    }
    if (branch.parentElement === doc.body) break;
    branch = branch.parentElement;
  }
  doc.body.style.overflow = "hidden";
  doc.documentElement.style.overflow = "hidden";
  if (!dialog.contains(doc.activeElement)) initialFocus.focus({ preventScroll: true });

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter((element) => !element.closest('[inert], [hidden], [aria-hidden="true"]') && element.getClientRects().length > 0);
    const first = focusable[0] ?? initialFocus;
    const last = focusable[focusable.length - 1] ?? initialFocus;
    if (!dialog.contains(doc.activeElement) || (event.shiftKey ? doc.activeElement === first : doc.activeElement === last)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus({ preventScroll: true });
    }
  };
  const onFocusIn = (event: FocusEvent) => {
    if (!dialog.contains(event.target as Node)) initialFocus.focus({ preventScroll: true });
  };
  win.addEventListener("keydown", onKeyDown, true);
  doc.addEventListener("focusin", onFocusIn);
  return () => {
    win.removeEventListener("keydown", onKeyDown, true);
    doc.removeEventListener("focusin", onFocusIn);
    doc.body.style.overflow = previousOverflow;
    doc.documentElement.style.overflow = previousRootOverflow;
    for (const { element, value } of inertElements) {
      if (value === null) element.removeAttribute("inert");
      else element.setAttribute("inert", value);
    }
  };
}
