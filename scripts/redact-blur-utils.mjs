import sharp from "sharp";

export function clampBox(box, w, h) {
  const left = Math.max(0, Math.min(box.left, w - 4));
  const top = Math.max(0, Math.min(box.top, h - 4));
  const width = Math.min(box.width, w - left);
  const height = Math.min(box.height, h - top);
  return { left, top, width, height };
}

export function S([l, t, wd, ht], w, h, bw, bh) {
  const fx = w / bw;
  const fy = h / bh;
  return {
    left: Math.round(l * fx),
    top: Math.round(t * fy),
    width: Math.round(wd * fx),
    height: Math.round(ht * fy),
  };
}

export function rowStrips(x, y0, rowH, count, width, step, bw, bh, w, h) {
  const strips = [];
  for (let i = 0; i < count; i++) {
    strips.push(S([x, y0 + i * step, width, rowH], w, h, bw, bh));
  }
  return strips;
}

/** KPI card number zones (keep label row above). */
export function kpiNumberRow(xs, y, wBox, hBox, bw, bh, w, h) {
  return xs.map((x) => S([x, y, wBox, hBox], w, h, bw, bh));
}

async function heavyPatch(src, r, sigma = 48) {
  let patch = await sharp(src).extract(r).blur(sigma).toBuffer();
  patch = await sharp(patch).blur(sigma).toBuffer();
  return patch;
}

export async function applyBlurs(src, boxes, sigma = 48) {
  const meta = await sharp(src).metadata();
  const w = meta.width ?? 1;
  const h = meta.height ?? 1;
  const composites = [];
  for (const box of boxes) {
    const r = clampBox(box, w, h);
    if (r.width < 6 || r.height < 6) continue;
    composites.push({
      input: await heavyPatch(src, r, sigma),
      left: r.left,
      top: r.top,
    });
  }
  return sharp(src).composite(composites).png({ compressionLevel: 8 });
}