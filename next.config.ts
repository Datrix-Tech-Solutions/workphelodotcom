import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Profile resume / cover letter uploads go through a Server Action.
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;
