import type { NextConfig } from "next";

// Production must target the reachable backend service, not localhost or a
// private deployment URL. Keep API_ORIGIN as the server-side override; the
// legacy NEXT_PUBLIC_API_URL is only used for local development.
const configuredApiOrigin =
  process.env.API_ORIGIN ||
  (process.env.NODE_ENV === "production"
    ? "https://interlekt-backend.onrender.com"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001");
const apiOrigin = configuredApiOrigin
  .replace(/\/(?:docs|api\/v1)\/?$/i, "")
  .replace(/\/+$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
