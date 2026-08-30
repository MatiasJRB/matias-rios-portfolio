import { execFile, spawn } from "node:child_process";
import { access, mkdir, rename } from "node:fs/promises";
import { constants } from "node:fs";
import { createServer } from "node:net";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = join(root, "public", "cv");
const host = "127.0.0.1";

const chromeCandidates = [
  process.env.CV_CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

async function firstExecutable(paths) {
  for (const path of paths) {
    try {
      await access(path, constants.X_OK);
      return path;
    } catch {
      // Try the next supported Chrome/Chromium location.
    }
  }

  throw new Error(
    "Chrome or Chromium was not found. Set CV_CHROME_PATH to its executable.",
  );
}

async function availablePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, host, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close(() => {
        if (port) resolvePort(port);
        else reject(new Error("Could not reserve a local port."));
      });
    });
  });
}

async function waitForPage(url, processHandle) {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    if (processHandle.exitCode !== null) {
      throw new Error(`Next.js exited early with code ${processHandle.exitCode}.`);
    }

    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The development server is still starting.
    }

    await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
  }

  throw new Error(`Timed out waiting for ${url}.`);
}

async function printPdf(chromePath, url, destination) {
  const temporaryDestination = `${destination}.tmp.pdf`;

  await execFileAsync(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--no-pdf-header-footer",
      "--run-all-compositor-stages-before-draw",
      "--virtual-time-budget=2000",
      `--print-to-pdf=${temporaryDestination}`,
      url,
    ],
    { cwd: root, maxBuffer: 10 * 1024 * 1024 },
  );

  await rename(temporaryDestination, destination);
}

const chromePath = await firstExecutable(chromeCandidates);
const externalBaseUrl = process.env.CV_BASE_URL?.replace(/\/$/, "");
let serverProcess;
let baseUrl = externalBaseUrl;

try {
  if (!baseUrl) {
    const port = await availablePort();
    baseUrl = `http://${host}:${port}`;
    const nextBinary = join(root, "node_modules", ".bin", "next");

    serverProcess = spawn(
      nextBinary,
      ["dev", "--hostname", host, "--port", String(port)],
      { cwd: root, stdio: ["ignore", "pipe", "pipe"] },
    );

    await waitForPage(`${baseUrl}/es/cv`, serverProcess);
  }

  await mkdir(outputDirectory, { recursive: true });

  for (const lang of ["es", "en"]) {
    const destination = join(outputDirectory, `matias-rios-${lang}.pdf`);
    await printPdf(chromePath, `${baseUrl}/${lang}/cv`, destination);
    console.log(`Generated ${destination}`);
  }
} finally {
  if (serverProcess && serverProcess.exitCode === null) {
    serverProcess.kill("SIGTERM");
  }
}
