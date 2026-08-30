import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
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
    commit: "af3d126",
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
    id: "2025-04",
    kind: "next",
    repository: projectRoot,
    commit: "08f6d11",
  },
  {
    id: "2025-12",
    kind: "next",
    repository: projectRoot,
    commit: "ed6404f",
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
  // These large source assets were never referenced by the rendered portfolio.
  rmSync(join(destination, "podcast.wav"), { force: true });
  writeArchiveMetadata(archive, destination);
  console.log(`Archived at ${destination}`);
}

console.log("\nAll historical portfolio archives were generated.");
