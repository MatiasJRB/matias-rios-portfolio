import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const rootDir = process.cwd();
const imagesDir = path.join(rootDir, "public", "images");
const tempDir = path.join(rootDir, ".tmp", "og-images");
const chromeCandidates = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
];

const preview = {
  title: "Tech Lead & Software Engineer",
  output: path.join(imagesDir, "og-image.png"),
};

function findChrome() {
  const browserPath = chromeCandidates.find((candidate) => fs.existsSync(candidate));

  if (!browserPath) {
    throw new Error("Google Chrome is required to generate OG images.");
  }

  return browserPath;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildHtml(title) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=1200, initial-scale=1" />
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap");

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        width: 1200px;
        height: 630px;
        overflow: hidden;
        background: #050505;
      }

      body {
        font-family: "Inter", system-ui, sans-serif;
        color: #fafafa;
        opacity: 0;
      }

      body.ready {
        opacity: 1;
      }

      .canvas {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1200px;
        height: 630px;
        padding: 72px 84px;
        background: #050505;
      }

      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 44px;
        width: 100%;
        max-width: 1080px;
        text-align: center;
      }

      .name {
        margin: 0;
        font-size: 138px;
        line-height: 0.9;
        font-weight: 800;
        letter-spacing: -0.085em;
      }

      .title {
        margin: 0;
        max-width: 1040px;
        font-size: 64px;
        line-height: 1.02;
        font-weight: 700;
        letter-spacing: -0.065em;
      }
    </style>
  </head>
  <body>
    <main class="canvas">
      <section class="content">
        <h1 class="name">Matias Rios</h1>
        <h2 class="title">${escapeHtml(title)}</h2>
      </section>
    </main>

    <script>
      Promise.all([
        document.fonts.ready,
        new Promise((resolve) => window.addEventListener("load", resolve, { once: true })),
      ]).then(() => {
        document.body.classList.add("ready");
      });
    </script>
  </body>
</html>`;
}

function generatePreview(browserPath) {
  fs.mkdirSync(tempDir, { recursive: true });

  const htmlPath = path.join(tempDir, "og-image.html");
  fs.writeFileSync(htmlPath, buildHtml(preview.title), "utf8");

  execFileSync(
    browserPath,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--allow-file-access-from-files",
      "--force-device-scale-factor=1",
      "--window-size=1200,630",
      "--virtual-time-budget=3000",
      `--screenshot=${preview.output}`,
      `file://${htmlPath}`,
    ],
    {
      stdio: "ignore",
    },
  );
}

function main() {
  const browserPath = findChrome();

  generatePreview(browserPath);

  fs.rmSync(tempDir, { recursive: true, force: true });
}

main();
