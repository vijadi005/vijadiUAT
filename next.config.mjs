/** @type {import('next').NextConfig} */

const SHEET_ID = "1NEovNJVBVY4LyXWg3nHFh5-LekMt8GfL4y4eaNz7X1I";

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
      acc[String(header).trim()] = csvRow[index] ?? "";
      return acc;
    }, {}),
  );
}

async function fetchSheetRedirects() {
  try {
    const response = await fetch(
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=redirects`,
    );

    if (!response.ok) {
      return [];
    }

    return parseCsv(await response.text())
      .map((row) => ({
        source: String(row.source || "").trim(),
        destination: String(row.destination || "").trim(),
        permanent: ["true", "yes", "1"].includes(
          String(row.permanent || "").trim().toLowerCase(),
        ),
      }))
      .filter((row) => row.source && row.destination);
  } catch (error) {
    console.warn(`Sheet redirects unavailable: ${error.message}`);
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
      ...sheetRedirects,
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
