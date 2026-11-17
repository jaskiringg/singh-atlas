import sharp from "sharp";
import { S, rowStrips, applyBlurs } from "./redact-blur-utils.mjs";

const SRC = process.argv[2];
const OUT = process.argv[3];
if (!SRC || !OUT) process.exit(1);

const BW = 746;
const BH = 1600;
const { width: w = BW, height: h = BH } = await sharp(SRC).metadata();

const priceYs = [268, 318, 418, 518, 618, 718, 818, 918, 1018, 1118, 1218];

const boxes = [
  S([0, 0, BW, 50], w, h, BW, BH),
  S([95, 86, 640, 44], w, h, BW, BH),
  S([0, 1535, BW, 65], w, h, BW, BH),
  S([520, 260, 210, 900], w, h, BW, BH), // product price column
  ...priceYs.map((y) => S([220, y, 510, 56], w, h, BW, BH)),
  S([0, 1288, BW, 118], w, h, BW, BH), // cart total + min order 
  // pack-browse screen (delivery MOQ row)
  S([32, 248, 688, 72], w, h, BW, BH),
];

await (await applyBlurs(SRC, boxes, 52)).toFile(OUT);
console.log(`Wrote ${OUT}`);