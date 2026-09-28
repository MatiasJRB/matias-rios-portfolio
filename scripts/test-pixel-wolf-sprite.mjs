import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/pixel-wolf-sprite.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { WOLF_BASE, WOLF_FRAMES, WOLF_COLUMNS, WOLF_ROWS, PAINT_BY_TOKEN, toPaths } =
  await import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );

const layers = { base: WOLF_BASE, ...WOLF_FRAMES };

// Absolute coordinates of every painted pixel in a layer.
const pixelsOf = ({ y = 0, rows }) =>
  rows.flatMap((row, rowIndex) =>
    [...row].flatMap((token, x) =>
      token === "." ? [] : [{ x, y: y + rowIndex, token }],
    ),
  );

const key = ({ x, y }) => `${x},${y}`;
const basePixels = new Set(pixelsOf(WOLF_BASE).map(key));

test("every layer fits the 16x13 sprite grid", () => {
  assert.equal(WOLF_BASE.rows.length, WOLF_ROWS);
  for (const [name, layer] of Object.entries(layers)) {
    const top = layer.y ?? 0;
    assert.ok(top + layer.rows.length <= WOLF_ROWS, `${name} overflows the rows`);
    for (const row of layer.rows) {
      assert.equal(row.length, WOLF_COLUMNS, `${name} has a row of ${row.length}`);
    }
  }
});

test("layers only use tokens that have a paint", () => {
  for (const [name, layer] of Object.entries(layers)) {
    for (const { token } of pixelsOf(layer)) {
      assert.ok(PAINT_BY_TOKEN[token], `${name} uses unknown token ${token}`);
    }
  }
});

test("animation frames never cover the static body", () => {
  for (const [name, frame] of Object.entries(WOLF_FRAMES)) {
    const overlap = pixelsOf(frame).filter((pixel) => basePixels.has(key(pixel)));
    assert.deepEqual(overlap, [], `${name} overlaps the base sprite`);
  }
});

test("every ear and tail pose stays attached to the body", () => {
  for (const [name, frame] of Object.entries(WOLF_FRAMES)) {
    const touchesBody = pixelsOf(frame).some(({ x, y }) =>
      [-1, 0, 1].some((dx) =>
        [-1, 0, 1].some((dy) => basePixels.has(key({ x: x + dx, y: y + dy }))),
      ),
    );
    assert.ok(touchesBody, `${name} floats away from the body`);
  }
});

test("paths paint each pixel of a layer exactly once with its paint", () => {
  for (const [name, layer] of Object.entries(layers)) {
    const painted = new Map();
    for (const [paint, d] of toPaths(layer)) {
      for (const [, x, y, run] of d.matchAll(/M(\d+) (\d+)h(\d+)/g)) {
        for (let dx = 0; dx < Number(run); dx += 1) {
          const at = `${Number(x) + dx},${y}`;
          assert.ok(!painted.has(at), `${name} paints ${at} twice`);
          painted.set(at, paint);
        }
      }
    }
    const expected = new Map(
      pixelsOf(layer).map((pixel) => [key(pixel), PAINT_BY_TOKEN[pixel.token]]),
    );
    assert.deepEqual(painted, expected, `${name} paths drift from its rows`);
  }
});
