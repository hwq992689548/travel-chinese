import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root,
  },
  // Prevent Next from auto-writing AGENTS.md / CLAUDE.md in this repo.
  agentRules: false,
} as NextConfig;

export default nextConfig;
