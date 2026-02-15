const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const HTML_FILES = ["index.html", "surfclass.html", "marca.html"];
const TIMEOUT_MS = 10000;
const CONCURRENCY = 5;

// URLs that block HEAD/GET requests or are not real page links
const SKIP_PATTERNS = [
  /google\.com\/maps\/embed/,
  /googletagmanager\.com\/gtag/,
  /google-analytics\.com/,
  /schema\.org/,
  /fonts\.googleapis\.com/,
  /fonts\.gstatic\.com/,
  /cdnjs\.cloudflare\.com/,
  /unpkg\.com/,
  /cdn\.jsdelivr\.net/,
  /cdn\.tailwindcss\.com/,
];

const URL_REGEX = /(?:href|src|content)="(https?:\/\/[^"]+)"/g;

// ANSI colors
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

function extractUrls() {
  const urls = new Set();
  for (const file of HTML_FILES) {
    const content = fs.readFileSync(path.join(ROOT, file), "utf-8");
    let match;
    while ((match = URL_REGEX.exec(content)) !== null) {
      urls.add(match[1]);
    }
  }
  return [...urls].filter(
    (url) => !SKIP_PATTERNS.some((pattern) => pattern.test(url))
  );
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Try HEAD first
    let res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 LinkChecker/1.0" },
    });

    // Retry with GET if HEAD is not allowed
    if (res.status === 405) {
      res = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 LinkChecker/1.0" },
      });
    }

    clearTimeout(timeout);
    return { url, status: res.status, ok: res.status < 400 };
  } catch (err) {
    clearTimeout(timeout);
    const reason = err.name === "AbortError" ? "TIMEOUT" : "NETWORK_ERROR";
    return { url, status: reason, ok: false };
  }
}

async function processInBatches(urls) {
  const results = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);
  }
  return results;
}

async function main() {
  const urls = extractUrls();
  console.log(`\n${CYAN}Checking ${urls.length} external URLs...${RESET}\n`);

  const results = await processInBatches(urls);

  const ok = results.filter((r) => r.ok);
  const broken = results.filter((r) => !r.ok);

  // Print results
  for (const r of ok) {
    console.log(`  ${GREEN}OK${RESET}  ${DIM}${r.status}${RESET}  ${r.url}`);
  }
  for (const r of broken) {
    const color = typeof r.status === "number" ? RED : YELLOW;
    console.log(`  ${color}FAIL${RESET}  ${r.status}  ${r.url}`);
  }

  console.log(
    `\n${GREEN}${ok.length} OK${RESET} | ${broken.length > 0 ? RED : GREEN}${broken.length} broken${RESET}\n`
  );

  process.exit(broken.length > 0 ? 1 : 0);
}

main();
