import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const githubRoot = resolve(projectRoot, "..");
const outputRoot = join(projectRoot, "public", "time-machine", "eras");
const requestedIds = new Set(process.argv.slice(2));
const legacyNodeDir =
  process.env.TIME_MACHINE_LEGACY_NODE_DIR ||
  join(homedir(), ".nvm", "versions", "node", "v16.16.0", "bin");

const archives = [
  {
    id: "2019",
    kind: "static",
    repository: join(githubRoot, "MatiasWeb"),
    commit: "697f264",
  },
  {
    id: "2021",
    kind: "quasar",
    repository: join(githubRoot, "mi-portafolio"),
    commit: "25bdb97",
  },
  {
    id: "2022",
    kind: "quasar",
    repository: join(githubRoot, "mi-portafolio"),
    commit: "95e86b5",
  },
  {
    id: "2024",
    kind: "quasar",
    repository: join(githubRoot, "mi-portafolio"),
    commit: "a103447",
  },
  {
    id: "2026-03",
    kind: "next",
    repository: projectRoot,
    commit: "c43f2f0",
  },
];

function run(command, args, cwd, env = process.env) {
  const result = spawnSync(command, args, {
    cwd,
    env,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed for ${cwd}`);
  }
}

function extractCommit(repository, commit, destination) {
  const tarPath = join(destination, "source.tar");
  const archive = execFileSync("git", ["-C", repository, "archive", commit], {
    maxBuffer: 64 * 1024 * 1024,
  });
  writeFileSync(tarPath, archive);
  run("tar", ["-xf", tarPath, "-C", destination], destination);
  rmSync(tarPath);
}

function patchQuasarConfig(workDir, id) {
  const configPath = join(workDir, "quasar.conf.js");
  let source = readFileSync(configPath, "utf8");
  source = source.replace(
    /vueRouterMode:\s*["']history["']/,
    "vueRouterMode: 'hash'",
  );
  source = source.replace(
    /build:\s*\{/,
    `build: {\n      // Archival mount adapter; application source remains unchanged.\n      publicPath: "/time-machine/eras/${id}/",`,
  );
  writeFileSync(configPath, source);

  if (id === "2022") {
    // The original qenv file was intentionally gitignored. Supply only the
    // public value needed to boot the archived client; never embed old tokens.
    writeFileSync(
      join(workDir, ".quasar.env.json"),
      `${JSON.stringify(
        {
          archive: {
            API: "/time-machine/eras/2022/api-v1/",
            EMAIL: "mailto:matiasriosbalcarce@gmail.com",
          },
        },
        null,
        2,
      )}\n`,
    );
  }

  if (id === "2021") {
    // Rewrite dead image URLs before Webpack hashes the historical bundle so
    // browsers cannot keep serving a cached pre-recovery chunk.
    rewriteArchivedUrls(workDir, get2021ImageReplacements());
  }
}

function patchNextConfig(workDir, id) {
  const configPath = join(workDir, "next.config.ts");
  let source = readFileSync(configPath, "utf8");
  const mountPath = `/time-machine/eras/${id}`;
  source = source.replace(
    /const nextConfig: NextConfig = \{/,
    `const nextConfig: NextConfig = {\n  // Archival mount adapter; application components remain unchanged.\n  output: "export",\n  basePath: "${mountPath}",\n  assetPrefix: "${mountPath}",\n  trailingSlash: true,`,
  );
  source = source.replace(
    /trailingSlash: true,/,
    "trailingSlash: true,\n  eslint: { ignoreDuringBuilds: true },",
  );

  if (/images:\s*\{/.test(source)) {
    source = source.replace(/images:\s*\{/, "images: {\n    unoptimized: true,");
  } else {
    source = source.replace(
      /trailingSlash: true,/,
      "trailingSlash: true,\n  images: { unoptimized: true },",
    );
  }

  writeFileSync(configPath, source);

  // Metadata/server-only routes are irrelevant inside the embedded archive and
  // prevent older Next versions from producing a static export.
  for (const relativePath of [
    "src/app/sitemap.ts",
    "src/app/robots.ts",
    "src/app/llms.txt",
    "src/app/llms-full.txt",
  ]) {
    rmSync(join(workDir, relativePath), { recursive: true, force: true });
  }

  const sourceDirectory = join(workDir, "src");
  if (existsSync(sourceDirectory)) {
    // Next's basePath does not rewrite strings that point at public assets.
    // Make archived exports self-contained instead of leaking to /images.
    rewriteArchivedUrls(sourceDirectory, [
      ["/images/", `${mountPath}/images/`],
    ]);
  }
}

function installAndBuild(archive, workDir) {
  if (archive.kind === "quasar") {
    if (!existsSync(join(legacyNodeDir, "node"))) {
      throw new Error(
        `Node 16 was not found at ${legacyNodeDir}. Set TIME_MACHINE_LEGACY_NODE_DIR.`,
      );
    }

    patchQuasarConfig(workDir, archive.id);
    const env = {
      ...process.env,
      PATH: `${legacyNodeDir}:${process.env.PATH}`,
      ...(archive.id === "2022" ? { QENV: "archive" } : {}),
    };
    const install = existsSync(join(workDir, "package-lock.json"))
      ? ["ci", "--legacy-peer-deps", "--no-audit", "--no-fund"]
      : ["install", "--legacy-peer-deps", "--no-audit", "--no-fund"];
    run("npm", install, workDir, env);
    run("npm", ["exec", "quasar", "build"], workDir, env);

    const output = existsSync(join(workDir, "dist", "spa"))
      ? join(workDir, "dist", "spa")
      : join(workDir, "public");
    return output;
  }

  patchNextConfig(workDir, archive.id);
  run(
    "npm",
    ["install", "--legacy-peer-deps", "--no-audit", "--no-fund"],
    workDir,
  );
  run("npm", ["run", "build"], workDir);
  return join(workDir, "out");
}

function writeArchiveMetadata(archive, destination) {
  const commitDate = execFileSync(
    "git",
    ["-C", archive.repository, "show", "-s", "--format=%aI", archive.commit],
    { encoding: "utf8" },
  ).trim();
  writeFileSync(
    join(destination, "archive.json"),
    `${JSON.stringify(
      {
        id: archive.id,
        source: archive.repository.split("/").at(-1),
        commit: archive.commit,
        commitDate,
        kind: archive.kind,
      },
      null,
      2,
    )}\n`,
  );
}

function rewriteArchivedUrls(directory, replacements) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      rewriteArchivedUrls(path, replacements);
      continue;
    }

    if (!/\.(?:css|html|js|json|ts|tsx|vue)$/.test(entry.name)) continue;
    let source = readFileSync(path, "utf8");
    let changed = false;
    for (const [from, to] of replacements) {
      if (!source.includes(from)) continue;
      source = source.replaceAll(from, to);
      changed = true;
    }
    if (changed) writeFileSync(path, source);
  }
}

const recovered2021Images = [
  "geome7ric/portada.jpg",
  "signos/logo.png",
  "signos/programa1.png",
  "signos/programa2.png",
  "signos/programa3.png",
  "signos/programa4.png",
  "signos/programa5.png",
  "budapest/logo.png",
  "budapest/portada.jpg",
  "nortebus/logo.jpg",
  "nortebus/portada.jpg",
  "eati2020/logo.png",
  "eati2020/portada.png",
  "leapmotion.jpeg",
  "proyectoiap.jpg",
  "parri.png",
  "petshop/logo.jpg",
  "petshop/portada.jpg",
  "redes/dns.jpg",
  "eati2019/logo.jpg",
  "goingbackhome.png",
];

function get2021ImageReplacements() {
  const remoteRoot = "https://matiasjrb.com.ar/images";
  const localRoot = "/time-machine/eras/2021/legacy-assets/images";
  const replacements = recovered2021Images.map((path) => [
    `${remoteRoot}/${path}`,
    `${localRoot}/${path}`,
  ]);

  replacements.push(
    [
      `${remoteRoot}/eati2019/portada.png`,
      `${localRoot}/eati2019/portada.jpeg`,
    ],
    [
      `${remoteRoot}/sistemaArchivosDistribuido/imagena.jpg`,
      `${localRoot}/sistemaArchivosDistribuido/imagena.svg`,
    ],
  );

  for (const [name, recovered] of [
    ["android1.jpg", "android.jpg"],
    ["android2.jpg", "logo.jpg"],
    ["android3.jpg", "android.jpg"],
    ["android4.jpg", "logo.jpg"],
    ["windows1.jpg", "android.jpg"],
    ["windows2.jpg", "logo.jpg"],
  ]) {
    replacements.push([
      `${remoteRoot}/distribuidoraAmusquibar/${name}`,
      `${localRoot}/distribuidoraAmusquibar/${recovered}`,
    ]);
  }

  return replacements;
}

function patch2021LegacyImages(destination) {
  const sourceRoot = join(githubRoot, "MatiasWeb", "images");
  const assetRoot = join(destination, "legacy-assets", "images");

  const addRecoveredAsset = (path) => {
    const source = join(sourceRoot, path);
    if (!existsSync(source)) {
      throw new Error(`Missing recovered 2021 image: ${source}`);
    }
    const target = join(assetRoot, path);
    mkdirSync(dirname(target), { recursive: true });
    cpSync(source, target);
  };

  for (const path of recovered2021Images) addRecoveredAsset(path);
  addRecoveredAsset("eati2019/portada.jpeg");

  // The six original Amusquibar screenshots were never committed. Preserve
  // the real project imagery that did survive instead of rendering broken
  // carousel slides.
  addRecoveredAsset("distribuidoraAmusquibar/android.jpg");
  addRecoveredAsset("distribuidoraAmusquibar/logo.jpg");

  // No copy of the original CONAIISI image exists in Git history or the Wayback
  // Machine, so use a clearly archival reconstruction based on the real paper.
  const distributedProjectPath = join(
    assetRoot,
    "sistemaArchivosDistribuido",
    "imagena.svg",
  );
  mkdirSync(dirname(distributedProjectPath), { recursive: true });
  writeFileSync(
    distributedProjectPath,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
  <title id="title">Sistema de archivos distribuido</title>
  <desc id="desc">Reconstrucción archivística del proyecto presentado en CONAIISI 2020.</desc>
  <rect width="1200" height="675" fill="#171a17"/>
  <g stroke="#f2e94e" stroke-width="8">
    <path d="M600 185 340 355M600 185l260 170M340 355h520" fill="none"/>
    <circle cx="600" cy="185" r="72" fill="#171a17"/>
    <circle cx="340" cy="355" r="58" fill="#171a17"/>
    <circle cx="860" cy="355" r="58" fill="#171a17"/>
  </g>
  <g fill="#f2e94e" font-family="Arial, sans-serif" text-anchor="middle">
    <text x="600" y="177" font-size="24" font-weight="700">COORDINADOR</text>
    <text x="600" y="209" font-size="18">RPC + NODOS</text>
    <text x="340" y="363" font-size="22" font-weight="700">NODO A</text>
    <text x="860" y="363" font-size="22" font-weight="700">NODO B</text>
    <text x="600" y="505" font-size="62" font-weight="800">SISTEMA DE ARCHIVOS</text>
    <text x="600" y="570" font-size="62" font-weight="800">DISTRIBUIDO</text>
    <text x="600" y="625" font-size="22" letter-spacing="7">CONAIISI 2020 · ARCHIVO RECUPERADO</text>
  </g>
</svg>\n`,
  );
  rewriteArchivedUrls(destination, get2021ImageReplacements());
  writeFileSync(
    join(assetRoot, "recovery.json"),
    `${JSON.stringify(
      {
        recoveredFrom: "MatiasWeb Git repository",
        note: "Original dead-domain URLs were rewritten locally for archival playback.",
        reconstructed: [
          "sistemaArchivosDistribuido/imagena.svg",
          "distribuidoraAmusquibar screenshot sequence",
        ],
      },
      null,
      2,
    )}\n`,
  );
}

mkdirSync(outputRoot, { recursive: true });

for (const archive of archives.filter(
  ({ id }) => requestedIds.size === 0 || requestedIds.has(id),
)) {
  const workDir = mkdtempSync(join(tmpdir(), `portfolio-era-${archive.id}-`));
  const destination = join(outputRoot, archive.id);
  console.log(`\n=== ${archive.id} · ${archive.commit} ===`);
  extractCommit(archive.repository, archive.commit, workDir);
  const builtOutput =
    archive.kind === "static"
      ? workDir
      : installAndBuild(archive, workDir);

  rmSync(destination, { recursive: true, force: true });
  mkdirSync(destination, { recursive: true });
  cpSync(builtOutput, destination, { recursive: true });
  if (archive.id === "2022") {
    // The archived Strapi endpoint no longer serves article data. Keep the
    // original client code intact while providing the empty response shape it
    // expects, so the historical homepage boots without a failed request.
    const apiDirectory = join(destination, "api-v1");
    mkdirSync(apiDirectory, { recursive: true });
    writeFileSync(
      join(apiDirectory, "articles.json"),
      `${JSON.stringify({ response: { data: [] } })}\n`,
    );
  }
  if (archive.id === "2021") patch2021LegacyImages(destination);
  // These large source assets were never referenced by the rendered portfolio.
  rmSync(join(destination, "podcast.wav"), { force: true });
  writeArchiveMetadata(archive, destination);
  console.log(`Archived at ${destination}`);
}

console.log("\nAll historical portfolio archives were generated.");
