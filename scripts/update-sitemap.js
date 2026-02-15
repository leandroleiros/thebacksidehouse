const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITEMAP_PATH = path.join(ROOT, "sitemap.xml");

const URL_TO_FILE = {
  "https://thebacksidehouse.com/": "index.html",
  "https://thebacksidehouse.com/surfclass.html": "surfclass.html",
};

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function main() {
  let sitemap = fs.readFileSync(SITEMAP_PATH, "utf-8");
  let changed = false;

  for (const [url, file] of Object.entries(URL_TO_FILE)) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) continue;

    const mtime = fs.statSync(filePath).mtime;
    const newDate = formatDate(mtime);

    // Match the <url> block containing this <loc> and update its <lastmod>
    const locEscaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const blockRegex = new RegExp(
      `(<url>\\s*<loc>${locEscaped}</loc>\\s*<lastmod>)(\\d{4}-\\d{2}-\\d{2})(</lastmod>)`
    );

    const match = sitemap.match(blockRegex);
    if (match && match[2] !== newDate) {
      sitemap = sitemap.replace(blockRegex, `$1${newDate}$3`);
      changed = true;
      console.log(`  ${file}: ${match[2]} -> ${newDate}`);
    }
  }

  if (changed) {
    fs.writeFileSync(SITEMAP_PATH, sitemap);
  } else {
    console.log("  Sitemap dates already up to date");
  }
}

main();
