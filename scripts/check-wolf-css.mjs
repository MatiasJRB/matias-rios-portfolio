import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const required = [
  ".pixel-assistant-avatar",
  ".pixel-wolf__head-pose--rest",
  ".pixel-wolf__head-pose--lift",
  ".pixel-wolf__head-pose--howl",
  ".pixel-wolf__head-pose--groom",
  ".pixel-wolf__paw-rest",
  ".pixel-wolf__paw-lift",
  ".pixel-wolf__paw-groom",
  ".pixel-wolf__tongue-short",
  ".pixel-wolf__tongue-tip",
  ".assistant-wolf-celestial",
  "@keyframes pixel-wolf-howl-head",
  "@keyframes pixel-wolf-howl-rest",
  "@keyframes pixel-wolf-howl-lift",
  "@keyframes pixel-wolf-howl-full",
  "@keyframes pixel-wolf-groom-paw-rest",
  "@keyframes pixel-wolf-groom-paw-lift",
  "@keyframes pixel-wolf-groom-pose",
  "@keyframes pixel-wolf-groom-head-rest",
  "@keyframes pixel-wolf-groom-tongue-short",
  "@keyframes pixel-wolf-groom-tongue-tip",
  "@keyframes assistant-wolf-moon-rise",
];

// Check the actual built/served styles, not just source or successful HTML.
// Missing pose visibility rules superimpose faces, even when SVG markup is new.
export function assertWolfStyles(css, context) {
  const missing = required.filter((token) => !css.includes(token));
  if (missing.length) {
    throw new Error(`${context}: incomplete wolf stylesheet; missing ${missing.join(", ")}`);
  }
}

async function collectStyles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const contents = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectStyles(path);
    return entry.name.endsWith(".css") ? readFile(path, "utf8") : "";
  }));
  return contents.join("\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = new URL("../.next/static/", import.meta.url);
  assertWolfStyles(await collectStyles(root.pathname), "Production build");
  console.log("Built wolf stylesheet contract passed");
}
