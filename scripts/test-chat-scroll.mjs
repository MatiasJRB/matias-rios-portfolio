import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/chat-scroll.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { getReplyScrollTop } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

test("long assistant replies open at their beginning", () => {
  assert.equal(getReplyScrollTop(420, 1800, 600), 408);
});

test("short replies stay at the bottom when their beginning remains visible", () => {
  assert.equal(getReplyScrollTop(610, 1200, 600), 600);
});

test("reply start stays reachable near the end of a short conversation", () => {
  assert.equal(getReplyScrollTop(150, 700, 600), 100);
});

test("a conversation shorter than its viewport does not scroll", () => {
  assert.equal(getReplyScrollTop(80, 400, 600), 0);
});
