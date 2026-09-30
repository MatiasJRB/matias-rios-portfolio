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
const { WOLF_BASE, WOLF_BODY, WOLF_HEAD, WOLF_HEAD_LIFT, WOLF_HEAD_HOWL, WOLF_HEAD_GROOM, WOLF_PAW_REST, WOLF_PAW_LIFT, WOLF_PAW_GROOM, WOLF_TONGUE_SHORT, WOLF_TONGUE_TIP, WOLF_FRAMES, WOLF_COLUMNS, WOLF_ROWS, PAINT_BY_TOKEN, toPaths } =
  await import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );

const layers = { base: WOLF_BASE, body: WOLF_BODY, head: WOLF_HEAD, headLift: WOLF_HEAD_LIFT, headHowl: WOLF_HEAD_HOWL, headGroom: WOLF_HEAD_GROOM, pawRest: WOLF_PAW_REST, pawLift: WOLF_PAW_LIFT, pawGroom: WOLF_PAW_GROOM, tongueShort: WOLF_TONGUE_SHORT, tongueTip: WOLF_TONGUE_TIP, ...WOLF_FRAMES };

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

test("the resting head, body and paw reproduce the original wolf", () => {
  const composed = new Map(
    [...pixelsOf(WOLF_BODY), ...pixelsOf(WOLF_HEAD), ...pixelsOf(WOLF_PAW_REST)].map((pixel) => [key(pixel), pixel.token]),
  );
  const original = new Map(pixelsOf(WOLF_BASE).map((pixel) => [key(pixel), pixel.token]));
  assert.deepEqual(composed, original);
});

test("the howl poses keep the head silhouette while raising the nose", () => {
  const headPixels = pixelsOf(WOLF_HEAD).map(key);
  for (const pose of [WOLF_HEAD_LIFT, WOLF_HEAD_HOWL]) {
    assert.deepEqual(pixelsOf(pose).map(key), headPixels);
  }
  assert.deepEqual(pixelsOf(WOLF_HEAD_HOWL).filter(({ token }) => token === "S").map(key), ["6,4", "7,4", "3,5", "9,5", "6,6", "7,6", "6,7", "7,7"]);
  assert.deepEqual(pixelsOf(WOLF_HEAD_HOWL).filter(({ token }) => token === "E"), []);
});

test("the grooming face looks down toward the paw without changing silhouette", () => {
  assert.deepEqual(pixelsOf(WOLF_HEAD_GROOM).map(key), pixelsOf(WOLF_HEAD).map(key));
  assert.deepEqual(pixelsOf(WOLF_HEAD_GROOM).filter(({ token }) => token === "S").map(key), ["5,8"]);
  assert.deepEqual(pixelsOf(WOLF_HEAD_GROOM).filter(({ token }) => token === "E").map(key), ["3,6", "8,6"]);
});

test("the lifted paw remains attached and folds inward to the muzzle", () => {
  for (const pose of [WOLF_PAW_LIFT, WOLF_PAW_GROOM]) {
    assert.equal(Math.max(...pixelsOf(pose).map(({ y }) => y)), 11);
    assert.ok(pixelsOf(pose).some(({ x, y }) => x === 2 && y === 10));
    // Every pixel connects orthogonally to this foreleg, rather than floating.
    const remaining = new Set(pixelsOf(pose).map(key));
    const queue = [pixelsOf(pose)[0]];
    while (queue.length) {
      const { x, y } = queue.shift();
      if (!remaining.delete(key({ x, y }))) continue;
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        if (remaining.has(key({ x: x + dx, y: y + dy }))) queue.push({ x: x + dx, y: y + dy });
      }
    }
    assert.equal(remaining.size, 0);
  }
  assert.equal(WOLF_PAW_GROOM.y, 9);
});

test("both tongue segments contact the raised paw pad", () => {
  const pad = new Set(pixelsOf(WOLF_PAW_GROOM).filter(({ token }) => token === "W").map(key));
  for (const segment of [WOLF_TONGUE_SHORT, WOLF_TONGUE_TIP]) {
    for (const pixel of pixelsOf(segment)) {
      assert.equal(pixel.token, "P");
      assert.ok(pad.has(key(pixel)), `tongue misses the paw at ${key(pixel)}`);
    }
  }
  assert.deepEqual(pixelsOf(WOLF_TONGUE_SHORT).map(key), ["4,9"]);
  assert.deepEqual(pixelsOf(WOLF_TONGUE_TIP).map(key), ["4,10"]);
});

test("light choreography never shows detached tongue or duplicate head/paw poses", async () => {
  const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
  const opacityAt = (name, progress) => {
    const frames = css.match(new RegExp(`@keyframes ${name} \\{([\\s\\S]*?)\\n\\}`))?.[1];
    assert.ok(frames, `missing ${name}`);
    const stops = [...frames.matchAll(/([\d%,\s]+)\{\s*opacity:\s*([01]);/g)]
      .flatMap(([, percentages, opacity]) => [...percentages.matchAll(/(\d+)%/g)].map(([, percentage]) => [Number(percentage), Number(opacity)]))
      .sort(([a], [b]) => a - b);
    return stops.filter(([percentage]) => percentage <= progress).at(-1)[1];
  };
  for (let progress = 0; progress < 100; progress += 0.5) {
    const state = Object.fromEntries(["paw-rest", "paw-lift", "pose", "head-rest", "tongue-short", "tongue-tip"].map((part) => [part, opacityAt(`pixel-wolf-groom-${part}`, progress)]));
    assert.equal(state["paw-rest"] + state["paw-lift"] + state.pose, 1, `duplicate/missing paw at ${progress}%`);
    assert.equal(state["head-rest"] + state.pose, 1, `duplicate/missing head at ${progress}%`);
    if (state["tongue-short"]) assert.equal(state.pose, 1);
    if (state["tongue-tip"]) assert.equal(state["tongue-short"], 1);
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
