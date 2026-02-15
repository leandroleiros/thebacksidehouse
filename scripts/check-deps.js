const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const HTML_FILES = ["index.html", "surfclass.html", "marca.html"];

const CDN_LIBRARIES = [
  {
    name: "Lenis",
    pattern: /unpkg\.com\/lenis@([\d.]+)/,
    npmPackage: "lenis",
  },
  {
    name: "Typed.js",
    pattern: /unpkg\.com\/typed\.js@([\d.]+)/,
    npmPackage: "typed.js",
  },
  {
    name: "Lucide",
    pattern: /unpkg\.com\/lucide@([\d.]+)/,
    npmPackage: "lucide",
  },
  {
    name: "Font Awesome",
    pattern: /font-awesome\/([\d.]+)/,
    npmPackage: "@fortawesome/fontawesome-free",
  },
];

// ANSI colors
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

function findCurrentVersions() {
  const allHtml = HTML_FILES.map((f) =>
    fs.readFileSync(path.join(ROOT, f), "utf-8")
  ).join("\n");

  const results = [];
  for (const lib of CDN_LIBRARIES) {
    const match = allHtml.match(lib.pattern);
    if (match) {
      results.push({ ...lib, currentVersion: match[1] });
    }
  }
  return results;
}

async function getLatestVersion(npmPackage) {
  try {
    const res = await fetch(
      `https://registry.npmjs.org/${npmPackage}/latest`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.version;
  } catch {
    return null;
  }
}

function compareVersions(current, latest) {
  const a = current.split(".").map(Number);
  const b = latest.split(".").map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const va = a[i] || 0;
    const vb = b[i] || 0;
    if (va < vb) return -1;
    if (va > vb) return 1;
  }
  return 0;
}

async function main() {
  const libs = findCurrentVersions();
  console.log(`\n${CYAN}Checking ${libs.length} CDN dependencies...${RESET}\n`);

  // Header
  console.log(
    `  ${"Library".padEnd(16)} ${"Current".padEnd(12)} ${"Latest".padEnd(12)} Status`
  );
  console.log(`  ${"-".repeat(56)}`);

  let updatesAvailable = 0;

  for (const lib of libs) {
    const latest = await getLatestVersion(lib.npmPackage);
    if (!latest) {
      console.log(
        `  ${lib.name.padEnd(16)} ${lib.currentVersion.padEnd(12)} ${DIM}${"???".padEnd(12)}${RESET} Could not fetch`
      );
      continue;
    }

    const cmp = compareVersions(lib.currentVersion, latest);
    if (cmp < 0) {
      updatesAvailable++;
      console.log(
        `  ${lib.name.padEnd(16)} ${lib.currentVersion.padEnd(12)} ${YELLOW}${latest.padEnd(12)}${RESET} Update available`
      );
    } else {
      console.log(
        `  ${lib.name.padEnd(16)} ${lib.currentVersion.padEnd(12)} ${GREEN}${latest.padEnd(12)}${RESET} Up to date`
      );
    }
  }

  console.log();
  if (updatesAvailable > 0) {
    console.log(
      `  ${YELLOW}${updatesAvailable} update(s) available${RESET}\n`
    );
  } else {
    console.log(`  ${GREEN}All dependencies up to date${RESET}\n`);
  }
}

main();
