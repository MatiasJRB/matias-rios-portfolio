import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { assertWolfStyles } from "./check-wolf-css.mjs";

const css = await readFile(new URL("../src/components/pixel-wolf.css", import.meta.url), "utf8");

test("component stylesheet carries the full wolf motion/pose contract", () => {
  assert.doesNotThrow(() => assertWolfStyles(css, "Component"));
});

test("old CSS with only base wolf rules is rejected", () => {
  assert.throws(() => assertWolfStyles(".pixel-assistant-avatar{}.pixel-wolf__sprite{}", "Old production CSS"), /incomplete wolf stylesheet/);
});

test("missing face visibility or moon motion cannot silently pass a build", () => {
  for (const token of [".pixel-wolf__head-pose--groom", "@keyframes assistant-wolf-moon-rise"]) {
    assert.throws(() => assertWolfStyles(css.replaceAll(token, "removed"), "Incomplete"), /incomplete wolf stylesheet/);
  }
});
