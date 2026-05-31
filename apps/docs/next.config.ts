import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@smart-mailto/core", "@smart-mailto/react"],
};

export default nextConfig;
