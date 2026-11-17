import sharp from "sharp";
import { S, kpiNumberRow, rowStrips, applyBlurs } from "./redact-blur-utils.mjs";

const screen = process.argv[2];
const SRC = process.argv[3];
const OUT = process.argv[4];
const SCREENS = ["analytics", "marketing", "leads", "call-pipeline"];
if (!SCREENS.includes(screen) || !SRC || !OUT) process.exit(1);

const BW = 3420;
const BH = 2224;
const { width: w = BW, height: h = BH } = await sharp(SRC).metadata();
const SIGMA = 36;

function chrome() {
  return [
    S([0, 0, BW, 112], w, h, BW, BH),
    S([200, 38, 2650, 52], w, h, BW, BH),
    S([8, 2090, 120, 38], w, h, BW, BH),
  ];
}

function sidebarPii() {
  return [
    S([90, 72, 210, 44], w, h, BW, BH),
    S([18, 2140, 260, 52], w, h, BW, BH),
  ];
}

/** One lead card row: name + phone + assignee (~88px), not the whole panel. */
function queueCardRows(x, y0, rows) {
  return rowStrips(x, y0, 86, rows, 305, 120, BW, BH, w, h);
}

function marketingDetailValues() {
  const boxes = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      boxes.push(S([1402 + col * 195, 528 + row * 78, 158, 58], w, h, BW, BH));
    }
  }
  return boxes;
}

function analyticsBoxes() {
  const kpiValues = kpiNumberRow([472, 712, 952, 1192, 1432, 1672], 244, 180, 72, BW, BH, w, h);
  return [
    ...chrome(),
    ...sidebarPii(),
    ...kpiValues,
    S([1205, 166, 740, 54], w, h, BW, BH),
    ...queueCardRows(446, 1234, 6),
    ...queueCardRows(856, 1234, 5),
    ...queueCardRows(1266, 1234, 6),
    ...rowStrips(1815, 1678, 30, 8, 185, 46, BW, BH, w, h),
    ...rowStrips(465, 1675, 32, 8, 520, 46, BW, BH, w, h), // campaign city labels
  ];
}

function marketingBoxes() {
  const kpiTop = kpiNumberRow([472, 712, 952, 1192, 1432, 1672], 236, 184, 78, BW, BH, w, h);
  return [
    ...chrome(),
    ...sidebarPii(),
    ...kpiTop,
    S([1375, 312, 620, 50], w, h, BW, BH), // act_… id
    S([1402, 268, 520, 46], w, h, BW, BH), // campaign title
    ...rowStrips(1115, 382, 36, 38, 175, 46, BW, BH, w, h), // list spend ₹
    ...rowStrips(1275, 382, 32, 38, 155, 46, BW, BH, w, h), // list CPL ₹
    ...marketingDetailValues(),
    ...rowStrips(1385, 505, 42, 12, 80, 52, BW, BH, w, h),
    S([1518, 2048, 250, 46], w, h, BW, BH),
    S([1788, 2048, 140, 46], w, h, BW, BH),
    S([2120, 2048, 120, 46], w, h, BW, BH),
  ];
}

function leadsBoxes() {
  return [
    ...chrome(),
    ...sidebarPii(),
    S([565, 158, 560, 50], w, h, BW, BH),
    ...rowStrips(452, 838, 40, 16, 205, 52, BW, BH, w, h),
    ...rowStrips(578, 838, 36, 16, 310, 52, BW, BH, w, h),
    S([2025, 138, 510, 50], w, h, BW, BH),
    S([2840, 128, 530, 44], w, h, BW, BH),
    ...rowStrips(2025, 182, 34, 32, 470, 42, BW, BH, w, h),
    S([2210, 702, 190, 38], w, h, BW, BH), // 35,000
    S([2075, 668, 220, 34], w, h, BW, BH), // Bhanuben etc.
    ...rowStrips(2025, 1050, 30, 8, 420, 36, BW, BH, w, h), // chat summary lines
    ...rowStrips(2780, 1310, 28, 8, 220, 34, BW, BH, w, h), // captured table values
  ];
}

function callPipelineBoxes() {
  return [
    ...chrome(),
    ...sidebarPii(),
    ...kpiNumberRow([472, 712, 952, 1192, 1432], 226, 180, 90, BW, BH, w, h),
    ...rowStrips(455, 1750, 34, 10, 430, 46, BW, BH, w, h),
    ...rowStrips(945, 1750, 30, 10, 250, 46, BW, BH, w, h),
    S([455, 1962, 270, 42], w, h, BW, BH),
    S([455, 2002, 230, 36], w, h, BW, BH),
  ];
}

const MAP = {
  analytics: analyticsBoxes,
  marketing: marketingBoxes,
  leads: leadsBoxes,
  "call-pipeline": callPipelineBoxes,
};

const boxes = MAP[screen]();
await (await applyBlurs(SRC, boxes, SIGMA)).toFile(OUT);
console.log(`[${screen}] ${boxes.length} surgical regions → ${OUT}`);