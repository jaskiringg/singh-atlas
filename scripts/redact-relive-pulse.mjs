/**
 * Pulse dashboard — tight blurs only (no solid masks).
 */
import sharp from "sharp";
import { S, rowStrips, applyBlurs } from "./redact-blur-utils.mjs";

const SRC = process.argv[2];
const OUT = process.argv[3];
if (!SRC || !OUT) {
  console.error("Usage: node scripts/redact-relive-pulse.mjs <src.png> <out.png>");
  process.exit(1);
}

const BW = 3420;
const BH = 2222;
const { width: w = BW, height: h = BH } = await sharp(SRC).metadata();

const boxes = [
  S([0, 0, BW, 102], w, h, BW, BH), // browser tabs + URL
  S([18, 108, 155, 26], w, h, BW, BH), // Gurugram
  S([14, 2088, 175, 38], w, h, BW, BH), // admin label
  S([1195, 255, 400, 34], w, h, BW, BH), // Window handoff names
  ...rowStrips(362, 628, 36, 14, 210, 58, BW, BH, w, h), // rep names
  ...rowStrips(2348, 618, 40, 14, 520, 62, BW, BH, w, h), // Needs-you names
  S([3180, 72, 240, 100], w, h, BW, BH), // Gemini chip
  ...rowStrips(335, 1695, 34, 6, 520, 44, BW, BH, w, h), // recent signal entity col 1
  ...rowStrips(960, 1695, 34, 6, 520, 44, BW, BH, w, h),
  ...rowStrips(1585, 1695, 34, 6, 520, 44, BW, BH, w, h),
];

await (await applyBlurs(SRC, boxes, 30)).toFile(OUT);
console.log(`Wrote ${OUT} (${boxes.length} blur regions)`);