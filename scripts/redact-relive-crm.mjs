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

function chrome() {
  return [
    S([0, 0, BW, 118], w, h, BW, BH),
    S([12, 106, 168, 32], w, h, BW, BH),
    S([8, 2088, 200, 42], w, h, BW, BH),
    S([3175, 68, 245, 110], w, h, BW, BH),
  ];
}

function panelBodies() {
  return [
    S([468, 488, 728, 312], w, h, BW, BH),
    S([1228, 488, 728, 312], w, h, BW, BH),
    S([468, 864, 728, 312], w, h, BW, BH),
    S([1228, 864, 728, 312], w, h, BW, BH),
  ];
}

function analyticsBoxes() {
  const kpi = kpiNumberRow([472, 712, 952, 1192, 1432, 1672], 236, 198, 92, BW, BH, w, h);
  return [
    ...chrome(),
    ...kpi,
    S([1175, 162, 2100, 72], w, h, BW, BH),
    ...panelBodies(),
    S([442, 1228, 1010, 788], w, h, BW, BH),
    S([1548, 1255, 520, 380], w, h, BW, BH),
    S([2425, 1255, 520, 380], w, h, BW, BH),
    S([1688, 1360, 260, 120], w, h, BW, BH), // donut centre counts
    S([2568, 1360, 260, 120], w, h, BW, BH),
  ];
}

function marketingBoxes() {
  const kpiTop = kpiNumberRow([472, 712, 952, 1192, 1432, 1672], 218, 198, 100, BW, BH, w, h);
  const kpiDetail = kpiNumberRow(
    [1410, 1605, 1800, 1995, 2188, 1410, 1605, 1800, 1995, 2188, 1410, 1605],
    448,
    185,
    72,
    BW,
    BH,
    w,
    h,
  );
  return [
    ...chrome(),
    ...kpiTop,
    S([488, 288, 1980, 48], w, h, BW, BH),
    S([1390, 378, 620, 52], w, h, BW, BH),
    ...rowStrips(458, 392, 50, 36, 978, 46, BW, BH, w, h),
    ...kpiDetail,
    S([1388, 1188, 90, 580], w, h, BW, BH), // chart rupee y-axis
    S([1388, 2058, 1980, 52], w, h, BW, BH), // footer benchmark
  ];
}

function leadsBoxes() {
  return [
    ...chrome(),
    S([1960, 158, 1460, 2060], w, h, BW, BH), // drawer (PII dense)
    S([445, 828, 1510, 1260], w, h, BW, BH), // leads table body
    S([445, 158, 1510, 88], w, h, BW, BH), // filters / search row
    ...kpiNumberRow([478, 648, 818, 988], 248, 160, 88, BW, BH, w, h), // KPI counts if sensitive
  ];
}

function callPipelineBoxes() {
  const kpi = kpiNumberRow([472, 712, 952, 1192, 1432], 218, 198, 115, BW, BH, w, h);
  return [
    ...chrome(),
    ...kpi,
    ...rowStrips(468, 1765, 44, 10, 1000, 46, BW, BH, w, h),
    S([468, 1865, 1350, 280], w, h, BW, BH), // just-completed detail lines
  ];
}

const MAP = {
  analytics: analyticsBoxes,
  marketing: marketingBoxes,
  leads: leadsBoxes,
  "call-pipeline": callPipelineBoxes,
};

const boxes = MAP[screen]();
await (await applyBlurs(SRC, boxes, 52)).toFile(OUT);
console.log(`[${screen}] ${boxes.length} regions → ${OUT}`);