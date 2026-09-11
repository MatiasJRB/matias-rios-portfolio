import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const host = "127.0.0.1";
const slug =
  "la-primera-vez-que-alguien-dependio-de-que-mi-software-funcionara";
const migrationLinterSlug =
  "el-framework-no-podia-actualizarse-pero-las-migraciones-igual-tenian-que-ser-seguras";
const infrastructureAuditSlug =
  "audite-113-proyectos-el-costo-no-era-el-principal-problema";
const personalAssistantSlug =
  "yo-seguia-siendo-la-api-entre-la-ia-y-mi-vida";
const aiBottleneckSlug =
  "la-ia-acelero-la-escritura-de-codigo-pero-traslado-el-cuello-de-botella";

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

  for (const text of expected.excludes ?? []) {
    if (body.includes(text)) {
      throw new Error(`${path}: found excluded text ${JSON.stringify(text)}.`);
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
    includes: [
      "Notas",
      "La IA aceleró la escritura de código",
      "Audité 113 proyectos",
      "Yo seguía siendo la API entre la IA y mi vida",
    ],
    excludes: [
      "La primera vez que alguien dependió",
      "El framework no podía actualizarse",
    ],
  });
  await expectResponse(baseUrl, "/es/notes", {
    status: 200,
    includes: [
      "La primera vez que alguien dependió",
      "Yo seguía siendo la API entre la IA y mi vida",
      "La IA aceleró la escritura de código",
    ],
  });
  await expectResponse(baseUrl, `/es/notes/${slug}`, {
    status: 200,
    includes: ["El código ya no terminaba en mí", "Programa entregado"],
  });
  await expectResponse(baseUrl, `/es/notes/${migrationLinterSlug}`, {
    status: 200,
    includes: [
      "La librería que necesitaba no existía",
      "Lo que me da orgullo es el conjunto",
      "https://github.com/MatiasJRB/laravel-migration-linter",
    ],
    excludes: ["Antes de publicar", ">Borrador<"],
  });
  await expectResponse(baseUrl, `/es/notes/${infrastructureAuditSlug}`, {
    status: 200,
    includes: [
      "No eran 113 productos",
      "Salieron 45 acciones concretas",
      "Lo que hizo posible terminarla",
    ],
    excludes: [
      "Antes de publicar",
      ">Borrador<",
      "38 dólares",
      "no vinculada a Mango",
      "todo lo que no es trabajo",
    ],
  });
  await expectResponse(baseUrl, `/es/notes/${personalAssistantSlug}`, {
    status: 200,
    includes: [
      "Dos planos en vez de un superagente",
      "Un audio ya puede convertirse en un pendiente",
      "Las tecnologías y el trabajo de cada una",
    ],
    excludes: ["Antes de publicar", ">Borrador<", "MacroDroid", "alarma"],
  });
  await expectResponse(baseUrl, `/es/notes/${aiBottleneckSlug}`, {
    status: 200,
    includes: [
      "El nuevo cuello de botella empieza antes del código",
      "Trabajar en paralelo no paraleliza las decisiones",
      "No tengo un multiplicador universal",
    ],
    excludes: ["Antes de publicar", ">Borrador<", "10 veces más productivo"],
  });
  await expectResponse(baseUrl, "/en/notes", {
    status: 200,
    includes: ["The first time someone depended on my software working"],
  });
  await expectResponse(baseUrl, `/en/notes/${slug}`, { status: 404 });
  await expectResponse(baseUrl, "/rss.xml", {
    status: 200,
    contentType: "application/rss+xml",
    includes: [
      "<rss version=\"2.0\"",
      `<link>https://www.matiasjrb.com.ar/es/notes/${slug}</link>`,
      `<link>https://www.matiasjrb.com.ar/es/notes/${migrationLinterSlug}</link>`,
      `<link>https://www.matiasjrb.com.ar/es/notes/${infrastructureAuditSlug}</link>`,
      `<link>https://www.matiasjrb.com.ar/es/notes/${personalAssistantSlug}</link>`,
      `<link>https://www.matiasjrb.com.ar/es/notes/${aiBottleneckSlug}</link>`,
    ],
  });
  await expectResponse(baseUrl, "/sitemap.xml", {
    status: 200,
    includes: [
      "https://www.matiasjrb.com.ar/es/notes",
      `https://www.matiasjrb.com.ar/es/notes/${slug}`,
      `https://www.matiasjrb.com.ar/es/notes/${migrationLinterSlug}`,
      `https://www.matiasjrb.com.ar/es/notes/${infrastructureAuditSlug}`,
      `https://www.matiasjrb.com.ar/es/notes/${personalAssistantSlug}`,
      `https://www.matiasjrb.com.ar/es/notes/${aiBottleneckSlug}`,
      "https://www.matiasjrb.com.ar/rss.xml",
    ],
  });

  console.log("Publication integration checks passed");
} finally {
  if (serverProcess.exitCode === null) serverProcess.kill("SIGTERM");
}
