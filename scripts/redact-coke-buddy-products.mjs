/**
 * Redact Coke Buddy product-browse screenshot for public portfolio.
 * Masks: status bar, outlet ID / store name / address strip, system nav.
 */
import sharp from "sharp";

const SRC = process.argv[2];
const OUT = process.argv[3];

if (!SRC || !OUT) {
  console.error("Usage: node scripts/redact-coke-buddy-products.mjs <src.png> <out.png>");
  process.exit(1);
}

const meta = await sharp(SRC).metadata();
const w = meta.width ?? 746;
const h = meta.height ?? 1600;

function clamp(r) {
  const left = Math.max(0, Math.min(r.left, w - 4));
  const top = Math.max(0, Math.min(r.top, h - 4));
  const width = Math.min(r.width, w - left);
  const height = Math.min(r.height, h - top);
  return { left, top, width, height };
}

function solidSvg(width, height, fill) {
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${fill}" rx="8"/></svg>`,
  );
}

/** Fraction-based masks scale if source resolution changes. */
const fx = w / 746;
const fy = h / 1600;

const BLUR_REGIONS = [
  // Android status bar (time, carrier, battery)
  { left: 0, top: 0, width: w, height: Math.round(52 * fy) },
];

const HEADER_MASK = {
  left: Math.round(72 * fx),
  top: Math.round(72 * fy),
  width: Math.round(672 * fx),
  height: Math.round(92 * fy),
};

const NAV_MASK = {
  left: 0,
  top: Math.round(1525 * fy),
  width: w,
  height: Math.round(75 * fy),
};

const labelSvg = Buffer.from(
  `<svg width="${HEADER_MASK.width}" height="${HEADER_MASK.height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#b71c1c" rx="10"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="system-ui,sans-serif" font-size="${Math.round(13 * fx)}" font-weight="600">Outlet · redacted</text>
  </svg>`,
);

const composites = [];

for (const region of BLUR_REGIONS) {
  const r = clamp(region);
  const patch = await sharp(SRC).extract(r).blur(28).toBuffer();
  composites.push({ input: patch, left: r.left, top: r.top });
}

const headerBox = clamp(HEADER_MASK);
composites.push({
  input: solidSvg(headerBox.width, headerBox.height, "#b71c1c"),
  left: headerBox.left,
  top: headerBox.top,
});
composites.push({ input: labelSvg, left: headerBox.left, top: headerBox.top });

const nav = clamp(NAV_MASK);
composites.push({
  input: solidSvg(nav.width, nav.height, "#ececec"),
  left: nav.left,
  top: nav.top,
});

await sharp(SRC).composite(composites).png({ compressionLevel: 8 }).toFile(OUT);
console.log(`Wrote ${OUT} (${w}×${h})`);