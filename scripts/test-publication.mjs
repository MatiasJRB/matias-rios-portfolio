import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const host = "127.0.0.1";
const slug =
  "la-primera-vez-que-alguien-dependio-de-que-mi-software-funcionara";

function availablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, host, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close(() =>
        port ? resolve(port) : reject(new Error("Could not reserve a port.")),
      );
    });
  });
}

async function waitForServer(url, processHandle) {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (processHandle.exitCode !== null) {
      throw new Error(`Next.js exited with code ${processHandle.exitCode}.`);
    }

    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for ${url}.`);
}

async function expectResponse(baseUrl, path, expected) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  const body = await response.text();

  if (response.status !== expected.status) {
    throw new Error(`${path}: expected ${expected.status}, got ${response.status}.`);
  }

  if (expected.contentType) {
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes(expected.contentType)) {
      throw new Error(`${path}: unexpected content type ${contentType}.`);
    }
  }

  for (const text of expected.includes ?? []) {
    if (!body.includes(text)) {
      throw new Error(`${path}: missing expected text ${JSON.stringify(text)}.`);
    }
  }
}

const port = await availablePort();
const baseUrl = `http://${host}:${port}`;
const nextBinary = join(root, "node_modules", ".bin", "next");
const serverProcess = spawn(
  nextBinary,
  ["start", "--hostname", host, "--port", String(port)],
  { cwd: root, stdio: ["ignore", "pipe", "pipe"] },
);

try {
  await waitForServer(`${baseUrl}/es`, serverProcess);

  await expectResponse(baseUrl, "/es", {
    status: 200,
    includes: ["Notas", "La primera vez que alguien dependió"],
  });
  await expectResponse(baseUrl, "/es/notes", {
    status: 200,
    includes: ["La primera vez que alguien dependió"],
  });
  await expectResponse(baseUrl, `/es/notes/${slug}`, {
    status: 200,
    includes: ["El código ya no terminaba en mí", "Programa entregado"],
  });
  await expectResponse(baseUrl, "/en/notes", {
    status: 200,
    includes: ["The first time someone depended on my software working"],
  });
  await expectResponse(baseUrl, `/en/notes/${slug}`, { status: 404 });
  await expectResponse(baseUrl, "/rss.xml", {
    status: 200,
    contentType: "application/rss+xml",
    includes: ["<rss version=\"2.0\"", `<link>https://www.matiasjrb.com.ar/es/notes/${slug}</link>`],
  });
  await expectResponse(baseUrl, "/sitemap.xml", {
    status: 200,
    includes: [
      "https://www.matiasjrb.com.ar/es/notes",
      `https://www.matiasjrb.com.ar/es/notes/${slug}`,
      "https://www.matiasjrb.com.ar/rss.xml",
    ],
  });

  console.log("Publication integration checks passed");
} finally {
  if (serverProcess.exitCode === null) serverProcess.kill("SIGTERM");
}
