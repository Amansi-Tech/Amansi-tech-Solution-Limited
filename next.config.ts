import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"], // 👈 Add allowed domains here
  },
};

export default nextConfig;
