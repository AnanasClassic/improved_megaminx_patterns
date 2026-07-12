import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(currentDirectory, "..");
const sourcePath = process.env.PATTERNS_SOURCE
  ? path.resolve(process.env.PATTERNS_SOURCE)
  : path.join(root, "data", "patterns-source.json");
const outputPath = path.join(root, "public", "patterns.json");
const baseUrl = "https://www.randelshofer.ch/rubik/megaminx/";
const concurrency = 12;

function decodeHtml(value) {
  return value
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function alphaTwizzleLink(algorithm) {
  const url = new URL("https://alpha.twizzle.net/edit/");
  url.searchParams.set("alg", algorithm);
  url.searchParams.set("puzzle", "megaminx");
  url.searchParams.set("setup-anchor", "start");
  return url.toString();
}

async function fetchPage(code, attempt = 1) {
  const response = await fetch(`${baseUrl}${code}.html`, {
    headers: { "user-agent": "MegaminxPatternsDataBuilder/1.0" }
  });

  if (!response.ok) {
    if (attempt < 3) return fetchPage(code, attempt + 1);
    throw new Error(`${code}: HTTP ${response.status}`);
  }

  const html = await response.text();
  const playerTag = html.match(/<twisty-player\b[\s\S]*?<\/twisty-player>/i)?.[0];
  const algorithm = playerTag?.match(/\balg\s*=\s*"([^"]*)"/i)?.[1];
  if (!algorithm) throw new Error(`${code}: twisty-player algorithm not found`);
  return decodeHtml(algorithm).trim().replace(/\s+/g, " ");
}

async function runPool(items, worker, limit) {
  const output = new Array(items.length);
  let cursor = 0;

  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      output[index] = await worker(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return output;
}

const patterns = JSON.parse(await readFile(sourcePath, "utf8"));
let completed = 0;

const enriched = await runPool(
  patterns,
  async (pattern) => {
    const oldTwizzleSolution = await fetchPage(pattern.code);
    completed += 1;
    if (completed % 25 === 0 || completed === patterns.length) {
      process.stdout.write(`Resolved ${completed}/${patterns.length}\n`);
    }

    return {
      ...pattern,
      old_twizzle_solution: oldTwizzleSolution,
      old_alpha_twizzle_link: alphaTwizzleLink(oldTwizzleSolution)
    };
  },
  concurrency
);

await writeFile(outputPath, `${JSON.stringify(enriched, null, 2)}\n`, "utf8");
process.stdout.write(`Wrote ${outputPath}\n`);
