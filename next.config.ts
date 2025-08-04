import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // for Google user avatars
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // for Unsplash images
      },
    ],
  },
};

export default nextConfig;
