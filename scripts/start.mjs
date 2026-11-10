import { spawn } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";
if (process.env.RAILWAY_ENVIRONMENT_ID && !process.env.RAILWAY_VOLUME_MOUNT_PATH) {
  console.error("A persistent volume is required. Mount it at /data before deploying.");
  process.exit(1);
}
const env = { ...process.env, HOSTNAME: "0.0.0.0", PORT: process.env.PORT || "3000" };
let args;
if (existsSync("server.js")) {
  // Docker image: the standalone output is already the working directory.
  args = ["server.js"];
} else if (existsSync(".next/standalone/server.js")) {
  // Local run after `npm run build`: the standalone server needs the static files next to it,
  // as the Dockerfile does. It changes into .next/standalone, so keep the database in ./data.
  cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
  cpSync("public", ".next/standalone/public", { recursive: true });
  env.DB_PATH ||= resolve(process.env.RAILWAY_VOLUME_MOUNT_PATH || "data", "bela.sqlite");
  args = [".next/standalone/server.js"];
} else {
  console.error("No build found. Run npm run build first.");
  process.exit(1);
}
const child = spawn(process.execPath, args, { stdio: "inherit", env });
for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 1));
