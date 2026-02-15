const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const SW_PATH = path.join(ROOT, "sw.js");

// Files matching PRECACHE_URLS in sw.js (resolved to disk paths)
const PRECACHE_FILES = [
  "index.html",
  "surfclass.html",
  "css/styles.css",
  "css/custom.css",
  "js/main.js",
  "js/translations.js",
  "js/translations-surfclass.js",
  "js/utils.js",
  "js/analytics.js",
  "js/lightbox.js",
  "js/i18n.js",
  "js/navigation.js",
  "js/surfclass.js",
  "js/motion-init.js",
  "js/sw-register.js",
  "js/gtag-init.js",
  "favicon.ico",
  "manifest.json",
];

const CACHE_NAME_REGEX = /const CACHE_NAME\s*=\s*"tbh-[^"]+"/;

function computeHash() {
  const hash = crypto.createHash("sha256");
  for (const file of PRECACHE_FILES) {
    const filePath = path.join(ROOT, file);
    if (fs.existsSync(filePath)) {
      hash.update(fs.readFileSync(filePath));
    }
  }
  return hash.digest("hex").slice(0, 8);
}

function main() {
  const contentHash = computeHash();
  const newCacheName = `tbh-${contentHash}`;

  const swContent = fs.readFileSync(SW_PATH, "utf-8");
  const match = swContent.match(CACHE_NAME_REGEX);

  if (!match) {
    console.error("Could not find CACHE_NAME in sw.js");
    process.exit(1);
  }

  const currentLine = match[0];
  const newLine = `const CACHE_NAME = "${newCacheName}"`;

  if (currentLine === newLine) {
    console.log(`  Cache hash unchanged (${newCacheName})`);
    return;
  }

  const updated = swContent.replace(CACHE_NAME_REGEX, newLine);
  fs.writeFileSync(SW_PATH, updated);
  console.log(`  Cache updated: ${newCacheName}`);
}

main();
