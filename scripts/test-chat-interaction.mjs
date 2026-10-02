import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";
import { JSDOM } from "jsdom";
import React, { act } from "react";

const require = createRequire(import.meta.url);
const dictionary = JSON.parse(await readFile(new URL("../src/i18n/dictionaries/es.json", import.meta.url), "utf8"));
const modules = new Map();
let smallScreen = true;
const motion = {};
for (const tag of ["div", "button"]) {
  motion[tag] = React.forwardRef(function TestMotion(props, ref) {
    const { children, initial, animate, exit, transition, onAnimationComplete, ...domProps } = props;
    void initial; void animate; void exit; void transition; void onAnimationComplete;
    return React.createElement(tag, { ...domProps, ref }, children);
  });
}

function compile(source) {
  const { outputText } = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  } });
  const compiled = { exports: {} };
  const resolve = (name) => {
    if (name === "framer-motion") return { motion, AnimatePresence: ({ children }) => children, useReducedMotion: () => true };
    if (name === "@/utils") return { cn: (...values) => values.filter(Boolean).join(" ") };
    if (name === "@/components/PixelWolfAvatar") return { __esModule: true, default: () => React.createElement("span", { "aria-hidden": true }) };
    if (name === "@/hooks/useMediaQuery") return { useMediaQuery: () => smallScreen };
    if (modules.has(name)) return modules.get(name);
    return require(name);
  };
  new Function("require", "module", "exports", outputText)(resolve, compiled, compiled.exports);
  return compiled.exports;
}
for (const name of ["overlay-dialog", "chat-scroll", "chat-follow-ups"]) {
  modules.set(`@/lib/${name}`, compile(await readFile(new URL(`../src/lib/${name}.ts`, import.meta.url), "utf8")));
}
const RecruiterBot = compile(await readFile(new URL("../src/components/RecruiterBot.tsx", import.meta.url), "utf8")).default;

async function setup(mobile = true) {
  smallScreen = mobile;
  const dom = new JSDOM('<body><div id="toolbar"><button>Theme</button></div><main id="app"></main></body>', { url: "https://portfolio.test/es", pretendToBeVisual: true });
  const old = new Map();
  for (const [key, value] of Object.entries({ window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true })) {
    old.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  dom.window.matchMedia = () => ({ matches: !mobile, addEventListener() {}, removeEventListener() {} });
  dom.window.HTMLElement.prototype.getClientRects = function () { return this.hidden ? [] : [{ width: 44, height: 44 }]; };
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(dom.window.document.getElementById("app"));
  await act(() => root.render(React.createElement(RecruiterBot, { lang: "es", dictionary })));
  const button = (label) => dom.window.document.querySelector(`button[aria-label="${label}"]`);
  const click = async (element) => { assert(element, "required control exists"); await act(async () => { element.click(); await new Promise((resolve) => setTimeout(resolve, 0)); }); };
  const cleanup = async () => {
    await act(() => root.unmount());
    dom.window.close();
    for (const [key, descriptor] of old) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  };
  return { dom, root, button, click, cleanup, doc: dom.window.document };
}

test("real chat component opens without keyboard, closes repeatedly, preserves draft and restores focus", async () => {
  const f = await setup();
  try {
    for (let cycle = 0; cycle < 3; cycle++) {
      await f.click(f.button(dictionary.recruiterBot.openLabel));
      assert.equal(f.doc.querySelector('[role="dialog"]').getAttribute("aria-modal"), "true");
      assert.equal(f.doc.activeElement, f.button(dictionary.recruiterBot.closeLabel));
      assert(f.doc.getElementById("toolbar").hasAttribute("inert"));
      if (cycle === 0) {
        const suggestion = [...f.doc.querySelectorAll("button")].find((element) => element.textContent === dictionary.recruiterBot.suggestions[0]);
        await f.click(suggestion);
      }
      assert.equal(f.doc.querySelector("textarea").value, dictionary.recruiterBot.suggestions[0]);
      await f.click(f.button(dictionary.recruiterBot.closeLabel));
      assert(!f.doc.querySelector('[role="dialog"]'));
      assert(!f.doc.getElementById("toolbar").hasAttribute("inert"));
      await act(() => new Promise((resolve) => setTimeout(resolve, 420)));
      assert.equal(f.doc.activeElement, f.button(dictionary.recruiterBot.openLabel));
    }
  } finally { await f.cleanup(); }
});

test("pending request, long reply and API errors never remove the escape or block reopening", async () => {
  const f = await setup(); const previousFetch = globalThis.fetch;
  let resolveRequest;
  globalThis.fetch = () => new Promise((resolve) => { resolveRequest = resolve; });
  try {
    await f.click(f.button(dictionary.recruiterBot.openLabel));
    await f.click([...f.doc.querySelectorAll("button")].find((element) => element.textContent === dictionary.recruiterBot.suggestions[0]));
    await f.click(f.button(dictionary.recruiterBot.sendButton));
    assert(f.button(dictionary.recruiterBot.closeLabel));
    await f.click(f.button(dictionary.recruiterBot.closeLabel));
    await act(async () => resolveRequest({ status: 200, json: async () => ({ answer: "Respuesta larga. ".repeat(500) }) }));
    await f.click(f.button(dictionary.recruiterBot.openLabel));
    assert(f.doc.querySelector('[role="dialog"]').textContent.includes("Respuesta larga."));
    await act(() => f.doc.querySelector("textarea").dispatchEvent(new f.dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })));
    assert(!f.doc.querySelector('[role="dialog"]'));
    globalThis.fetch = async () => { throw new Error("offline"); };
    await f.click(f.button(dictionary.recruiterBot.openLabel));
    const suggestion = [...f.doc.querySelector('[role="dialog"]').querySelectorAll("button")].find((element) => !element.getAttribute("aria-label") && element.textContent.trim());
    await f.click(suggestion);
    await f.click(f.button(dictionary.recruiterBot.sendButton));
    assert(f.doc.querySelector('[role="dialog"]').textContent.includes(dictionary.recruiterBot.genericError));
    await f.click(f.button(dictionary.recruiterBot.closeLabel));
    assert.equal(f.doc.body.style.overflow, "");
  } finally { globalThis.fetch = previousFetch; await f.cleanup(); }
});

test("desktop floating chat stays nonmodal; expansion isolates background and collapse releases it", async () => {
  const f = await setup(false);
  try {
    await f.click(f.button(dictionary.recruiterBot.openLabel));
    assert(!f.doc.querySelector('[role="dialog"]').hasAttribute("aria-modal"));
    assert(!f.doc.getElementById("toolbar").hasAttribute("inert"));
    await f.click(f.button(dictionary.recruiterBot.expandLabel));
    assert.equal(f.doc.querySelector('[role="dialog"]').getAttribute("aria-modal"), "true");
    assert(f.doc.getElementById("toolbar").hasAttribute("inert"));
    await f.click(f.button(dictionary.recruiterBot.collapseLabel));
    assert(!f.doc.getElementById("toolbar").hasAttribute("inert"));
    await f.click(f.button(dictionary.recruiterBot.closeLabel));
  } finally { await f.cleanup(); }
});
