import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
if (process.env.RAILWAY_ENVIRONMENT_ID && !process.env.RAILWAY_VOLUME_MOUNT_PATH) {
  console.error("A persistent volume is required. Mount it at /data before deploying.");
  process.exit(1);
}
const standalone = existsSync("server.js");
const child = spawn(process.execPath, standalone ? ["server.js"] : ["node_modules/next/dist/bin/next", "start", "--hostname", "0.0.0.0"], {
  stdio: "inherit", env: { ...process.env, HOSTNAME: "0.0.0.0", PORT: process.env.PORT || "3000" },
});
for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 1));
