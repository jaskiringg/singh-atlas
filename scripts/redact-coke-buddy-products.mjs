/**
 * Targeted blur only — outlet row, status bar, system nav.
 */
import sharp from "sharp";
import { S, applyBlurs } from "./redact-blur-utils.mjs";

const SRC = process.argv[2];
const OUT = process.argv[3];
if (!SRC || !OUT) {
  console.error("Usage: node scripts/redact-coke-buddy-products.mjs <src.png> <out.png>");
  process.exit(1);
}

const BW = 746;
const BH = 1600;
const { width: w = BW, height: h = BH } = await sharp(SRC).metadata();

const boxes = [
  S([0, 0, BW, 48], w, h, BW, BH),
  S([100, 90, 620, 36], w, h, BW, BH),
  S([0, 1538, BW, 62], w, h, BW, BH),
];

await (await applyBlurs(SRC, boxes, 32)).toFile(OUT);
console.log(`Wrote ${OUT}`);