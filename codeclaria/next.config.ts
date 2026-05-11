import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["192.168.31.42"],

  compiler: {
    removeConsole: true,
  },
};

export default nextConfig;