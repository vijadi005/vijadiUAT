/** @type {import('next').NextConfig} */
import { readFile } from "node:fs/promises";

const SHEET_ID = "1NEovNJVBVY4LyXWg3nHFh5-LekMt8GfL4y4eaNz7X1I";
const REDIRECT_SHEET_NAMES = ["redirects"];

// ... keep all your existing helper functions ...

const nextConfig = {
  output: "standalone",
  // ← removed eslint block
  async redirects() {
    const sheetRedirects = await fetchSheetRedirects();
    const socialRedirects = sheetRedirects.length > 0
      ? sheetRedirects
      : await readLocalRedirects();

    return [
      { source: "/vaughan", destination: "/", permanent: true },
      { source: "/vaughan/:path*", destination: "/:path*", permanent: true },
      ...socialRedirects,
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "storage.googleapis.com", port: "" },
      { protocol: "https", hostname: "www.pixelpulseplay.ca", port: "" },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === "development"
      ? "http://localhost:3000"           // ← local in dev
      : "https://websitebackend-439220.ue.r.appspot.com",
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === "development"
      ? "http://localhost:3000"           // ← local in dev
      : "https://pixelpulseplay.ca",
  },
};

export default nextConfig;