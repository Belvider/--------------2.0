import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const projectRoot = fileURLToPath(new URL("../", import.meta.url));

export function buildVercelProject(environment = process.env, execute = spawnSync) {
  const buildEnv = { ...environment };
  buildEnv.DIRECT_URL ||= buildEnv.DATABASE_URL_UNPOOLED || buildEnv.POSTGRES_URL_NON_POOLING;

  // Enable only on the intended Vercel project. This repository is also linked
  // to another project; preview deployments must not migrate a shared database.
  const migrateProduction = buildEnv.VERCEL_ENV === "production"
    && buildEnv.PORTAL_RUN_MIGRATIONS === "true";

  if (migrateProduction) {
    if (!buildEnv.JWT_SECRET || buildEnv.JWT_SECRET.trim().length < 32) {
      throw new Error("Set JWT_SECRET to a private random value of at least 32 characters in Vercel Production environment variables, then redeploy.");
    }
    for (const name of ["DATABASE_URL", "DIRECT_URL"]) {
      if (!buildEnv[name]) {
        throw new Error(`Set ${name} in Vercel Production environment variables. DIRECT_URL may also be supplied by DATABASE_URL_UNPOOLED or POSTGRES_URL_NON_POOLING.`);
      }
      try {
        const url = new URL(buildEnv[name]);
        if (!["postgres:", "postgresql:"].includes(url.protocol) || !url.hostname) {
          throw new Error();
        }
      } catch {
        throw new Error(`${name} must be a PostgreSQL connection URL. Its value is not printed.`);
      }
    }
  }

  const prismaCli = require.resolve("prisma/build/index.js");
  const nextCli = require.resolve("next/dist/bin/next");
  const steps = [["Generate Prisma Client", [prismaCli, "generate"]]];
  if (migrateProduction) {
    steps.push(["Apply production database migrations", [prismaCli, "migrate", "deploy"]]);
  }
  steps.push(["Build Next.js", [nextCli, "build"]]);

  for (const [label, args] of steps) {
    console.log(`[Vercel build] ${label}`);
    const result = execute(process.execPath, args, {
      cwd: projectRoot,
      env: buildEnv,
      stdio: "inherit"
    });
    if (result.error || result.status !== 0) {
      throw new Error(`${label} failed; deployment stopped.`);
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    buildVercelProject();
  } catch (error) {
    console.error(`[Vercel build] ${error.message}`);
    process.exitCode = 1;
  }
}
