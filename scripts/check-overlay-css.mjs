import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function assertOverlayStyles(css, context = "Overlay CSS") {
  const layers = ["toolbar", "assistant-launcher", "assistant-dialog", "time-machine"]
    .map((name) => Number(css.match(new RegExp(`--layer-${name}:\\s*(\\d+)`))?.[1]));
  if (layers.some((value) => !value) || layers.some((value, index) => index > 0 && value <= layers[index - 1])) {
    throw new Error(`${context}: toolbar/launcher/dialog/time-machine layering contract broken`);
  }
  for (const token of [".assistant-panel", ".assistant-panel-header", ".portfolio-toolbar", "--overlay-viewport-height", "--overlay-viewport-bottom", "--overlay-viewport-top", "data-compact-viewport", "env(safe-area-inset-bottom)"]) {
    if (!css.includes(token)) throw new Error(`${context}: missing ${token}`);
  }
  const dock = css.match(/\.assistant-composer-dock\s*\{([^}]+)\}/)?.[1] ?? "";
  if (!/position:\s*relative/.test(dock) || /position:\s*absolute/.test(dock)) {
    throw new Error(`${context}: composer must reserve real layout space`);
  }
}

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collect(path) : entry.name.endsWith(".css") ? readFile(path, "utf8") : "";
  }))).join("\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  assertOverlayStyles(await collect(new URL("../.next/static/", import.meta.url).pathname), "Production build");
  console.log("Built overlay stylesheet contract passed");
}
