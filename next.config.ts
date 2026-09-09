import type { NextConfig } from "next";
const config: NextConfig = { output: "standalone", images: { unoptimized: true }, serverExternalPackages: ["node:sqlite"] };
export default config;
