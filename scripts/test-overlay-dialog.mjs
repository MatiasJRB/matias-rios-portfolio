import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { JSDOM } from "jsdom";
import ts from "typescript";
import { assertOverlayStyles } from "./check-overlay-css.mjs";

const source = await readFile(new URL("../src/lib/overlay-dialog.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { getOverlayViewport, activateOverlayModal, observeOverlayViewport } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("visible geometry stays inside the browser in portrait, landscape and with keyboard", () => {
  for (const [layout, viewport, expected] of [
    [740, null, { height: 740, top: 0, bottom: 0 }],
    [740, { height: 330, offsetTop: 20 }, { height: 330, top: 20, bottom: 390 }],
    [320, { height: 180, offsetTop: 140 }, { height: 180, top: 140, bottom: 0 }],
    [580, { height: 620, offsetTop: -20 }, { height: 580, top: 0, bottom: 0 }],
  ]) assert.deepEqual(getOverlayViewport(layout, viewport), expected);
});

function fixture() {
  const dom = new JSDOM('<body><div id="chrome"><button id="theme">theme</button></div><main inert="existing"></main><aside id="shell"><div role="dialog" id="dialog"><button id="close">close</button><button hidden>hidden</button><textarea id="input"></textarea><button disabled>send</button><button id="last">attach</button></div></aside></body>', { pretendToBeVisual: true });
  const { window: win } = dom;
  const doc = win.document;
  // jsdom has no layout engine; simulate visibility only for the focus algorithm.
  win.HTMLElement.prototype.getClientRects = function () { return this.hidden ? [] : [{ width: 44, height: 44 }]; };
  return { dom, win, doc, dialog: doc.getElementById("dialog"), close: doc.getElementById("close") };
}

test("mobile modal isolates controls and locks background without focusing keyboard", () => {
  const f = fixture();
  const restore = activateOverlayModal(f.dialog, f.close, () => {});
  assert.equal(f.doc.activeElement, f.close);
  assert(f.doc.getElementById("chrome").hasAttribute("inert"));
  assert(!f.doc.getElementById("shell").hasAttribute("inert"));
  assert.equal(f.doc.body.style.overflow, "hidden");
  restore(); f.dom.window.close();
});

test("Tab and Shift-Tab stay inside with hidden and disabled controls excluded", () => {
  const f = fixture();
  const restore = activateOverlayModal(f.dialog, f.close, () => {});
  f.doc.getElementById("last").focus();
  f.win.dispatchEvent(new f.win.KeyboardEvent("keydown", { key: "Tab", cancelable: true }));
  assert.equal(f.doc.activeElement, f.close);
  f.win.dispatchEvent(new f.win.KeyboardEvent("keydown", { key: "Tab", shiftKey: true, cancelable: true }));
  assert.equal(f.doc.activeElement.id, "last");
  restore(); f.dom.window.close();
});

test("escaping while input is focused calls close and restores inert/overflow exactly", () => {
  const f = fixture(); let closed = 0;
  f.doc.body.style.overflow = "clip";
  const restore = activateOverlayModal(f.dialog, f.close, () => closed++);
  f.doc.getElementById("input").focus();
  f.win.dispatchEvent(new f.win.KeyboardEvent("keydown", { key: "Escape", cancelable: true }));
  assert.equal(closed, 1);
  restore();
  assert.equal(f.doc.body.style.overflow, "clip");
  assert.equal(f.doc.documentElement.style.overflow, "");
  assert(!f.doc.getElementById("chrome").hasAttribute("inert"));
  assert.equal(f.doc.querySelector("main").getAttribute("inert"), "existing");
  f.win.dispatchEvent(new f.win.KeyboardEvent("keydown", { key: "Escape" }));
  assert.equal(closed, 1, "closed modal must not keep listening");
  f.dom.window.close();
});

test("programmatic background focus is redirected; rotation preserves composer focus", () => {
  const f = fixture();
  f.doc.getElementById("input").focus();
  const restore = activateOverlayModal(f.dialog, f.close, () => {});
  assert.equal(f.doc.activeElement.id, "input");
  f.doc.getElementById("theme").focus();
  assert.equal(f.doc.activeElement, f.close);
  restore(); f.dom.window.close();
});

test("successive open/close cycles do not leave controls inert", () => {
  const f = fixture();
  for (let i = 0; i < 5; i++) {
    const restore = activateOverlayModal(f.dialog, f.close, () => {});
    restore();
    assert(!f.doc.getElementById("chrome").hasAttribute("inert"));
  }
  f.dom.window.close();
});

test("visual viewport resize/scroll updates keyboard geometry and removes listeners on cleanup", async () => {
  const f = fixture();
  const vv = new f.win.EventTarget(); Object.assign(vv, { height: 500, offsetTop: 10 });
  Object.defineProperty(f.win, "visualViewport", { value: vv });
  const restore = observeOverlayViewport(f.dialog, f.win);
  assert.equal(f.dialog.style.getPropertyValue("--overlay-viewport-height"), "500px");
  Object.assign(vv, { height: 280, offsetTop: 60 });
  vv.dispatchEvent(new f.win.Event("resize"));
  await new Promise((resolve) => f.win.requestAnimationFrame(resolve));
  assert.equal(f.dialog.style.getPropertyValue("--overlay-viewport-top"), "60px");
  assert.equal(f.dialog.dataset.compactViewport, "true");
  restore(); vv.dispatchEvent(new f.win.Event("scroll"));
  await new Promise((resolve) => f.win.requestAnimationFrame(resolve));
  assert.equal(f.dialog.style.getPropertyValue("--overlay-viewport-height"), "");
  f.dom.window.close();
});

test("without VisualViewport the overlay uses available window height", () => {
  const f = fixture();
  const restore = observeOverlayViewport(f.dialog, f.win);
  assert.equal(f.dialog.style.getPropertyValue("--overlay-viewport-height"), `${f.win.innerHeight}px`);
  restore(); f.dom.window.close();
});

test("CSS contract rejects toolbar above dialog and absolute composer regression", () => {
  assertOverlayStyles(css);
  assert.throws(() => assertOverlayStyles(css.replace("--layer-toolbar: 70", "--layer-toolbar: 310")), /layering/);
  assert.throws(() => assertOverlayStyles(css.replace(/(\.assistant-composer-dock\s*\{\s*position:) relative/, "$1 absolute")), /composer/);
});

test("chat wiring retains 44px exit, dynamic viewport, modal semantics and mobile non-zoom input", async () => {
  const component = await readFile(new URL("../src/components/RecruiterBot.tsx", import.meta.url), "utf8");
  assert(component.includes('role="dialog"'));
  assert(component.includes("observeOverlayViewport(shellRef.current)"));
  assert(component.includes("activateOverlayModal(panelElement, closeRef.current, closeChat)"));
  assert(component.includes("ref={closeRef}"));
  assert(component.includes("h-11 w-11"));
  assert(component.includes("text-base sm:text-sm"));
  assert(!component.includes("min-h-[520px]"));
  assert(!component.includes("min-h-[580px]"));
  assert(!component.includes("assistant-composer-dock pointer-events-none absolute"));
});
