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
for (const name of ["overlay-dialog", "chat-scroll", "chat-follow-ups", "chat-response"]) {
  modules.set(`@/lib/${name}`, compile(await readFile(new URL(`../src/lib/${name}.ts`, import.meta.url), "utf8")));
}
const RecruiterBot = compile(await readFile(new URL("../src/components/RecruiterBot.tsx", import.meta.url), "utf8")).default;

async function setup(mobile = true, lang = "es") {
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
  const localeDictionary = lang === "es" ? dictionary : JSON.parse(await readFile(new URL("../src/i18n/dictionaries/en.json", import.meta.url), "utf8"));
  await act(() => root.render(React.createElement(RecruiterBot, { lang, dictionary: localeDictionary })));
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
  return { dom, root, button, click, cleanup, dictionary: localeDictionary, doc: dom.window.document };
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
      assert.equal(f.doc.querySelector("textarea").value, dictionary.recruiterBot.experiencePrompt);
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
    await act(async () => resolveRequest(new Response(JSON.stringify({ answer: "Respuesta larga. ".repeat(500) }))));
    await f.click(f.button(dictionary.recruiterBot.openLabel));
    assert(f.doc.querySelector('[role="dialog"]').textContent.includes("Respuesta larga."));
    await act(() => f.doc.querySelector("textarea").dispatchEvent(new f.dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })));
    assert(!f.doc.querySelector('[role="dialog"]'));
    globalThis.fetch = async () => { throw new Error("offline"); };
    await f.click(f.button(dictionary.recruiterBot.openLabel));
    const suggestion = [...f.doc.querySelector('[role="dialog"]').querySelectorAll("button")].find((element) => Object.values(dictionary.recruiterBot.followUps).flat().includes(element.textContent));
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

const byText = (f, text) => [...f.doc.querySelectorAll("button")].find(el => el.textContent === text);
async function typeDraft(f, value) {
  await act(() => {
    const field = f.doc.querySelector("textarea");
    Object.getOwnPropertyDescriptor(f.dom.window.HTMLTextAreaElement.prototype, "value").set.call(field, value);
    field.dispatchEvent(new f.dom.window.Event("input", { bubbles: true }));
  });
}
async function pasteContext(f, value) {
  const event = new f.dom.window.Event("paste", { bubbles: true, cancelable: true });
  Object.defineProperty(event, "clipboardData", { value: { getData: () => value } });
  await act(() => f.doc.querySelector("textarea").dispatchEvent(event));
}

test("intention starters never auto-send, explain the AI boundary and preserve an existing draft", async () => {
  const f = await setup(); const oldFetch = globalThis.fetch;
  let calls = 0; globalThis.fetch = async () => { calls++; return new Response('{}'); };
  try {
    await f.click(f.button(dictionary.recruiterBot.openLabel));
    assert(f.doc.body.textContent.includes(dictionary.recruiterBot.contactBoundary));
    await f.click(byText(f, dictionary.recruiterBot.suggestions[1]));
    assert.equal(f.doc.querySelector("textarea").placeholder, dictionary.recruiterBot.rolePastePlaceholder);
    assert.equal(f.doc.querySelector("textarea").value, "");
    await typeDraft(f, "Tengo una oferta de backend y quiero comparar requisitos.");
    await f.click(byText(f, dictionary.recruiterBot.suggestions[2]));
    assert.equal(f.doc.querySelector("textarea").value, "Tengo una oferta de backend y quiero comparar requisitos.");
    assert(f.doc.body.textContent.includes(dictionary.recruiterBot.projectHint));
    assert.equal(calls, 0);
  } finally { globalThis.fetch = oldFetch; await f.cleanup(); }
});

test("failed request retries identical attachment context in place without deleting a newer draft", async () => {
  const f = await setup(); const oldFetch = globalThis.fetch;
  const bodies = []; let fail = true;
  globalThis.fetch = async (_url, options) => {
    bodies.push(JSON.parse(options.body));
    if (fail) throw new Error("offline");
    return new Response(JSON.stringify({ answer: "Encaje parcial; hay que confirmar liderazgo.", details: "Detalle adicional respaldado.", sources: [
      { id: "project:Asiento Libre", label: "Asiento Libre", href: "/es#project-asiento-libre", kind: "project" },
      { id: "bad", label: "malicious", href: "javascript:alert(1)", kind: "note" }
    ] }));
  };
  try {
    await f.click(f.button(dictionary.recruiterBot.openLabel));
    await f.click(byText(f, dictionary.recruiterBot.suggestions[1]));
    await pasteContext(f, "Oferta pública de prueba. ".repeat(110));
    assert(f.doc.querySelector('.assistant-context-files'));
    await f.click(f.button(dictionary.recruiterBot.sendButton));
    assert.equal(bodies[0].intent, "fit");
    assert.equal(bodies[0].fileContexts.length, 1);
    assert(bodies[0].fileContexts[0].text.includes("Oferta pública de prueba."));
    await typeDraft(f, "Nueva pregunta todavía no enviada");
    fail = false;
    await f.click(byText(f, dictionary.recruiterBot.retryButton));
    assert.deepEqual(bodies[1], bodies[0]);
    assert.equal(f.doc.querySelector("textarea").value, "Nueva pregunta todavía no enviada");
    assert.equal(f.doc.querySelectorAll('[data-chat-message-id]').length, 3);
    assert.equal(f.doc.querySelectorAll('details').length, 1);
    assert.equal(f.doc.querySelector('details').open, false);
    const link = f.doc.querySelector('a[href="/es#project-asiento-libre"]');
    assert(link); assert.equal(link.target, "_blank"); assert(link.rel.includes("noopener"));
    assert.equal(f.doc.querySelector('a[href^="javascript:"]'), null);
    assert(!f.doc.body.textContent.includes(dictionary.recruiterBot.genericError));
  } finally { globalThis.fetch = oldFetch; await f.cleanup(); }
});

test("HTTP error with an answer stays an error and Retry-After disables retries without automatic traffic", async () => {
  const f = await setup(); const oldFetch = globalThis.fetch; let calls = 0;
  globalThis.fetch = async () => { calls++; return new Response(JSON.stringify({ answer: "provider error, not a real answer" }), { status: 429, headers: { "Retry-After": "1" } }); };
  try {
    await f.click(f.button(dictionary.recruiterBot.openLabel));
    await f.click(byText(f, dictionary.recruiterBot.suggestions[0]));
    await f.click(f.button(dictionary.recruiterBot.sendButton));
    assert(f.doc.body.textContent.includes(dictionary.recruiterBot.rateLimitError));
    assert(!f.doc.body.textContent.includes("provider error, not a real answer"));
    let retry = [...f.doc.querySelectorAll('button')].find(b => b.textContent.includes("Reintentar en"));
    assert(retry.disabled);
    await f.click(retry); assert.equal(calls, 1);
    await act(() => new Promise(resolve => setTimeout(resolve, 1100)));
    retry = byText(f, dictionary.recruiterBot.retryButton);
    assert(retry && !retry.disabled); assert.equal(calls, 1);
  } finally { globalThis.fetch = oldFetch; await f.cleanup(); }
});

test("English intent and recovery copy work; malformed success is retryable and HTML stays inert", async () => {
  const f = await setup(true, "en"); const oldFetch = globalThis.fetch; const copy = f.dictionary.recruiterBot;
  let calls = 0; globalThis.fetch = async () => new Response(calls++ ? JSON.stringify({ answer: '<img src=x onerror=alert(1)> Safe text.' }) : "not json");
  try {
    await f.click(f.button(copy.openLabel));
    await f.click(byText(f, copy.suggestions[0]));
    assert.equal(f.doc.querySelector("textarea").value, copy.experiencePrompt);
    await f.click(f.button(copy.sendButton));
    assert(f.doc.body.textContent.includes(copy.genericError));
    await f.click(byText(f, copy.retryButton));
    assert.equal(f.doc.querySelector('img'), null);
    assert(f.doc.body.textContent.includes('<img src=x onerror=alert(1)>'));
  } finally { globalThis.fetch = oldFetch; await f.cleanup(); }
});
