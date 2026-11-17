/**
 * One-off redaction for portfolio ReliveCure Pulse screenshot.
 * Blurs PII regions: location label, rep names, lead names, handoff names.
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = process.argv[2];
const OUT = process.argv[3];

if (!SRC || !OUT) {
  console.error("Usage: node scripts/redact-relive-pulse.mjs <src.png> <out.png>");
  process.exit(1);
}

/** @type {{ left: number; top: number; width: number; height: number }[]} */
const REGIONS = [
  // Browser chrome / address bar
  { left: 0, top: 0, width: 3420, height: 110 },
  // Sidebar branding + city
  { left: 0, top: 40, width: 380, height: 120 },
  // Main header strip (hostname / location / user chrome)
  { left: 480, top: 110, width: 2940, height: 72 },
  // "Window" KPI card (handoff rep names)
  { left: 1165, top: 205, width: 455, height: 140 },
  // By-rep — rep name + clock-in column
  { left: 348, top: 598, width: 520, height: 900 },
  // Needs-you entire panel (names, DNP labels)
  { left: 2345, top: 575, width: 1075, height: 960 },
  // Recent signals row (all entity names)
  { left: 320, top: 1660, width: 3060, height: 280 },
  // Admin / profile footer
  { left: 0, top: 2030, width: 400, height: 192 },
];

const meta = await sharp(SRC).metadata();
const w = meta.width ?? 3420;
const h = meta.height ?? 2222;

function clamp(r) {
  const left = Math.max(0, Math.min(r.left, w - 4));
  const top = Math.max(0, Math.min(r.top, h - 4));
  const width = Math.min(r.width, w - left);
  const height = Math.min(r.height, h - top);
  return { left, top, width, height };
}

function solidSvg(width, height, fill = "#eef2f5") {
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${fill}" rx="10"/></svg>`,
  );
}

/** Hard-mask regions where blur still leaks readable text (names, handoffs). */
const SOLID_MASKS = [
  { left: 1165, top: 205, width: 455, height: 140 },
  { left: 348, top: 598, width: 520, height: 900 },
  { left: 2345, top: 575, width: 1075, height: 960 },
  { left: 0, top: 70, width: 320, height: 55 },
];

const composites = [];
for (const region of REGIONS) {
  const r = clamp(region);
  if (r.width < 8 || r.height < 8) continue;
  const patch = await sharp(SRC).extract(r).blur(35).toBuffer();
  composites.push({ input: patch, left: r.left, top: r.top });
}
for (const region of SOLID_MASKS) {
  const r = clamp(region);
  composites.push({ input: solidSvg(r.width, r.height), left: r.left, top: r.top });
}

await sharp(SRC)
  .composite(composites)
  .png({ compressionLevel: 8 })
  .toFile(OUT);

console.log(`Wrote redacted ${OUT} (${w}×${h}, ${composites.length} regions)`);