import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable compression
  compress: true,

  // Remove X-Powered-By header for security
  poweredByHeader: false,

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["framer-motion", "react-icons"],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Target modern browsers only - no ES5 transpilation (saves ~12KB)
  // This removes unnecessary polyfills and legacy transformations
  transpilePackages: [],

  // Keep context-file parsing packages in the Node.js server runtime instead
  // of webpack-bundling pdfjs/canvas/docx internals into the route chunk.
  serverExternalPackages: ["pdf-parse", "mammoth"],

  // pdfjs loads its worker dynamically, so Next/Vercel tracing misses it unless
  // we include it explicitly in the serverless function bundle.
  outputFileTracingIncludes: {
    "/api/recruiter-bot/context-file": [
      "./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
    ],
  },

  // Configure headers for caching and security
  async headers() {
    return [
      // Cache static assets (1 year)
      {
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache fonts (1 year)
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache JSON data files (1 week with revalidation)
      {
        source: "/:path*.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, must-revalidate",
          },
        ],
      },
      // Security headers
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
