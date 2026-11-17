/**
 * ReliveCure CRM screens — tight blurs only.
 */
import sharp from "sharp";
import { S, rowStrips, applyBlurs } from "./redact-blur-utils.mjs";

const screen = process.argv[2];
const SRC = process.argv[3];
const OUT = process.argv[4];
const SCREENS = ["analytics", "marketing", "leads", "call-pipeline"];

if (!SCREENS.includes(screen) || !SRC || !OUT) {
  console.error("Usage: node scripts/redact-relive-crm.mjs <screen> <in.png> <out.png>");
  process.exit(1);
}

const BW = 3420;
const BH = 2224;
const { width: w = BW, height: h = BH } = await sharp(SRC).metadata();

function common() {
  return [
    S([0, 0, BW, 102], w, h, BW, BH),
    S([18, 108, 155, 26], w, h, BW, BH),
    S([14, 2088, 175, 38], w, h, BW, BH),
    S([3180, 72, 240, 100], w, h, BW, BH),
  ];
}

function analyticsBoxes() {
  const panelName = (x, y) => [
    ...rowStrips(x, y, 42, 7, 480, 54, BW, BH, w, h), // name + phone line
    ...rowStrips(x + 500, y + 8, 30, 7, 200, 54, BW, BH, w, h), // rep
  ];
  return [
    ...common(),
    S([1188, 172, 950, 58], w, h, BW, BH), // assignee / city filter chips
    ...panelName(478, 442),
    ...panelName(1238, 442),
    ...panelName(478, 818),
    ...panelName(1238, 818),
    ...rowStrips(452, 1258, 34, 16, 395, 48, BW, BH, w, h), // campaign name col
    ...rowStrips(478, 442, 38, 4, 260, 54, BW, BH, w, h), // flow-tips names if any
  ];
}

function marketingBoxes() {
  return [
    ...common(),
    S([505, 296, 980, 36], w, h, BW, BH), // Meta act id strip
    S([1402, 388, 520, 40], w, h, BW, BH), // selected campaign title
    ...rowStrips(465, 398, 36, 34, 360, 46, BW, BH, w, h), // campaign list names
  ];
}

function leadsBoxes() {
  return [
    ...common(),
    S([1998, 118, 1380, 48], w, h, BW, BH), // lead name header
    S([1998, 172, 430, 38], w, h, BW, BH), // phone
    S([1998, 215, 520, 32], w, h, BW, BH), // city
    S([1998, 248, 380, 32], w, h, BW, BH), // rep
    S([2520, 358, 420, 40], w, h, BW, BH), // notify rep button
    S([1998, 495, 1390, 300], w, h, BW, BH), // analysed calls summary
    S([1998, 1188, 1390, 180], w, h, BW, BH), // notes + captured PII
    ...rowStrips(498, 842, 40, 20, 380, 58, BW, BH, w, h), // table names
    ...rowStrips(928, 842, 40, 20, 260, 58, BW, BH, w, h), // table phones
    ...rowStrips(1238, 842, 40, 20, 150, 58, BW, BH, w, h), // city col
  ];
}

function callPipelineBoxes() {
  return [
    ...common(),
    ...rowStrips(478, 1772, 36, 8, 960, 46, BW, BH, w, h), // just-completed lines
  ];
}

const MAP = {
  analytics: analyticsBoxes,
  marketing: marketingBoxes,
  leads: leadsBoxes,
  "call-pipeline": callPipelineBoxes,
};

const boxes = MAP[screen]();
await (await applyBlurs(SRC, boxes, 30)).toFile(OUT);
console.log(`[${screen}] wrote ${OUT} (${boxes.length} regions)`);