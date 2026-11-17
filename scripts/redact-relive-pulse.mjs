import sharp from "sharp";
import { S, kpiNumberRow, rowStrips, applyBlurs } from "./redact-blur-utils.mjs";

const SRC = process.argv[2];
const OUT = process.argv[3];
if (!SRC || !OUT) process.exit(1);

const BW = 3420;
const BH = 2222;
const { width: w = BW, height: h = BH } = await sharp(SRC).metadata();

const kpiXs = [462, 828, 1162, 1502, 1858, 2208, 2565, 2905];

const boxes = [
  S([0, 0, BW, 118], w, h, BW, BH),
  S([12, 106, 168, 32], w, h, BW, BH),
  S([8, 2088, 200, 42], w, h, BW, BH),
  ...kpiNumberRow(kpiXs, 248, 310, 118, BW, BH, w, h),
  S([1188, 252, 430, 42], w, h, BW, BH),
  ...rowStrips(352, 618, 48, 14, 240, 58, BW, BH, w, h),
  ...rowStrips(2340, 608, 52, 14, 680, 62, BW, BH, w, h),
  ...rowStrips(520, 548, 36, 14, 120, 58, BW, BH, w, h), // by-rep talk numbers col
  ...rowStrips(328, 1688, 40, 6, 640, 44, BW, BH, w, h),
  ...rowStrips(948, 1688, 40, 6, 640, 44, BW, BH, w, h),
  ...rowStrips(1568, 1688, 40, 6, 640, 44, BW, BH, w, h),
  S([3175, 68, 245, 110], w, h, BW, BH),
];

await (await applyBlurs(SRC, boxes, 52)).toFile(OUT);
console.log(`Wrote ${OUT} (${boxes.length} regions)`);