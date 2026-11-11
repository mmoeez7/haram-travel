import type { NextConfig } from "next";
import { wordpressUrlRedirects } from "./lib/package-paths";

const nextConfig: NextConfig = {
  // Match WordPress public URLs (e.g. /05-star-7-nights-umrah-package/)
  trailingSlash: true,
  serverExternalPackages: [
    "@neondatabase/serverless",
    "@prisma/adapter-neon",
    "@prisma/client",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "haramtravel.uk",
      },
      {
        protocol: "https",
        hostname: "www.haramtravel.uk",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return wordpressUrlRedirects();
  },
};

export default nextConfig;
