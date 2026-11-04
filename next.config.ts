import type { NextConfig } from "next";
// ws must keep native Node.js module loading for its optional bufferutil addon.
// Bundling it can replace that addon with a stub and break masked audio frames.
const config: NextConfig = { output: "standalone", images: { unoptimized: true }, serverExternalPackages: ["node:sqlite", "ws"] };
export default config;
