/** @type {import('next').NextConfig} */

import { readFile } from "node:fs/promises";

const SHEET_ID = "1NEovNJVBVY4LyXWg3nHFh5-LekMt8GfL4y4eaNz7X1I";
const REDIRECT_SHEET_NAMES = ["redirects"];

function parseCsv(csv = "") {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i += 1) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      value += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") i += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  const [headers = [], ...dataRows] = rows.filter((csvRow) =>
    csvRow.some((cell) => String(cell).trim()),
  );

  return dataRows.map((csvRow) =>
    headers.reduce((acc, header, index) => {
      acc[String(header).replace(/^\uFEFF/, "").trim()] = csvRow[index] ?? "";
      return acc;
    }, {}),
  );
}

function normalizeRedirectRows(rows = []) {
  return rows
    .map((row) => ({
      source: String(row.source || "").trim(),
      destination: String(row.destination || "").trim(),
      permanent: ["true", "yes", "1"].includes(
        String(row.permanent || "").trim().toLowerCase(),
      ),
    }))
    .filter((row) => row.source && row.destination)
    .map((row) => ({
      ...row,
      source: row.source.startsWith("/") ? row.source : `/${row.source}`,
    }));
}

async function fetchSheetRedirectTab(sheetName) {
  try {
    const response = await fetch(
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`,
    );

    if (!response.ok) {
      return [];
    }

    return normalizeRedirectRows(parseCsv(await response.text()));
  } catch (error) {
    console.warn(`Sheet redirects unavailable for "${sheetName}": ${error.message}`);
    return [];
  }
}

async function fetchSheetRedirects() {
  const redirectGroups = await Promise.all(
    REDIRECT_SHEET_NAMES.map((sheetName) => fetchSheetRedirectTab(sheetName)),
  );

  return redirectGroups.flat();
}

async function readLocalRedirects() {
  try {
    return normalizeRedirectRows(parseCsv(await readFile("social_redirects.csv", "utf8")));
  } catch {
    return [];
  }
}

const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    const sheetRedirects = await fetchSheetRedirects();
    const socialRedirects = sheetRedirects.length > 0
      ? sheetRedirects
      : await readLocalRedirects();

    return [
      {
        source: "/vaughan",
        destination: "/",
        permanent: true,
      },
      {
        source: "/vaughan/:path*",
        destination: "/:path*",
        permanent: true,
      },
      ...socialRedirects,
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.pixelpulseplay.ca",
        port: "",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: "https://websitebackend-439220.ue.r.appspot.com",
    NEXT_PUBLIC_BASE_URL: "https://pixelpulseplay.ca",
  },
};

export default nextConfig;
