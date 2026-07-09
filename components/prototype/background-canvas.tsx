"use client";

import { useEffect, useRef } from "react";
import { PERSONAS } from "@/lib/prototype-data";
import type { ColorScheme } from "@/lib/theme";

type PersonaKey = "consultant" | "builder" | "operator";
type MotifKind = "bars" | "line" | "map" | "arch" | "pulse";

type Ball = {
  key: PersonaKey;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  savedVx: number;
  savedVy: number;
  cruiseVx: number;
  cruiseVy: number;
  /** Wall bounces left at burst speed before easing to cruise drift */
  boostBounces: number;
};

type Motif = {
  xr: number;
  wr: number;
  hPx: number;
  y: number;
  startKind: "bars" | "line";
  kind: MotifKind;
  color: string;
  drift: number;
  pulse: number;
  data: MotifData;
  box?: { x: number; y: number; w: number; h: number };
  touch?: Partial<Record<PersonaKey, boolean>>;
  /** Last persona that reshaped this motif (resets when motif wraps) */
  shapedBy?: PersonaKey | null;
};

type MotifData = {
  bars?: number[];
  pts?: number[];
  nodes?: { t: number; yOff: number }[];
  blocks?: { t: number; size: number }[];
  seed?: number;
  /** Stable per-bar phase offsets for disco wobble */
  barPhase?: number[];
};

type Label = { text: string; xr: number; y: number; color: string; drift: number };

const NAV_CLEAR_PX = 78;
const STARS_COUNT = 55;
const DOM_REFRESH_MS = 5000;
const HERO_RECT_MS = 500;
const HOVER_RECT_MS = 220;
/** Per-frame px at ~60fps */
const MOTIF_DRIFT = [0.32, 0.35, 0.33, 0.37];
const LABEL_DRIFT = [0.26, 0.24, 0.28];
/** ~2× original HTML bounce — snappy but not frantic */
const BALL_VX = [0.3, 0.36, 0.42];
const BALL_VY = [0.2, 0.23, 0.26];
const THROW_SCALE = 0.55;
const BURST_SPEED_MUL = 2.1;
const BOOST_BOUNCES = 2;
const MIN_BALL_SPEED = 0.24;
const BURST_SPEED_MAX = 1.85;
const PULSE_HIT = 1.2;
const PULSE_DECAY = 0.955;
const BAR_PULSE_DECAY = 0.972;
/** While a ball is held, background drift eases down */
const SUSPEND_BG_FACTOR = 0.28;

const PERSONA_KIND: Record<PersonaKey, MotifKind> = {
  consultant: "map",
  builder: "arch",
  operator: "pulse",
};

const LABEL_SET = [
  "87%",
  "UAT ✓",
  "3.4×",
  "SLA 99.9%",
  "go-live",
  "42ms",
  "cross-functional",
  "99.2%",
  "P1 → P0",
  "1.2M",
  "root cause",
  "+18%",
  "3 countries",
  "128k",
];

const NEON_LABELS = ["#3df4ff", "#ff3fd8", "#e8ff5c", "#7ba0ff", "#2cd6b8", "#c08bff"];

function genMotifData(kind: MotifKind): MotifData {
  if (kind === "bars") {
    return {
      bars: Array.from({ length: 7 }, () => 0.25 + Math.random() * 0.75),
      seed: Math.random() * 1000,
      barPhase: Array.from({ length: 7 }, () => Math.random() * Math.PI * 2),
    };
  }
  if (kind === "line") return { pts: Array.from({ length: 8 }, () => Math.random()) };
  if (kind === "map") {
    const n = 4 + Math.floor(Math.random() * 2);
    return { nodes: Array.from({ length: n }, (_, i) => ({ t: i / (n - 1), yOff: (Math.random() - 0.5) * 0.7 })) };
  }
  if (kind === "arch") {
    return { blocks: Array.from({ length: 3 }, (_, i) => ({ t: i / 2, size: 0.5 + Math.random() * 0.4 })) };
  }
  if (kind === "pulse") return { seed: Math.random() * 1000 };
  return {};
}

function drawMotif(ctx: CanvasRenderingContext2D, m: Motif, dataAlpha: number, t: number, dim = 1) {
  const box = m.box;
  if (!box) return;
  const extra = m.pulse * 0.48 * dim;
  ctx.strokeStyle = m.color;
  ctx.fillStyle = m.color;

  if (m.kind === "bars" && m.data.bars) {
    const bars = m.data.bars;
    const phases = m.data.barPhase ?? bars.map((_, i) => i * 0.9);
    const bw = box.w / bars.length;
    const baseline = box.y + box.h;
    const disco = m.pulse > 0.06;
    const colorShift = Math.floor(t / 140);

    for (let i = 0; i < bars.length; i++) {
      const v = bars[i];
      const wobble = disco ? 0.14 * Math.sin(t / 95 + phases[i]) : 0;
      const vAnim = Math.min(1, Math.max(0.1, v + wobble));
      const bh = vAnim * box.h;
      const barColor = disco ? NEON_LABELS[(i + colorShift) % NEON_LABELS.length] : m.color;
      ctx.fillStyle = barColor;
      ctx.globalAlpha = dataAlpha * (0.55 + vAnim * 0.45) + (disco ? m.pulse * 0.62 : extra);
      ctx.fillRect(box.x + i * bw + 1.5, baseline - bh, bw - 3, bh);
    }
  } else if (m.kind === "line" && m.data.pts) {
    const pts = m.data.pts;
    ctx.globalAlpha = dataAlpha + extra;
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const px = box.x + (i / (pts.length - 1)) * box.w;
      const py = box.y + box.h - pts[i] * box.h;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    for (let i = 0; i < pts.length; i++) {
      const px = box.x + (i / (pts.length - 1)) * box.w;
      const py = box.y + box.h - pts[i] * box.h;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (m.kind === "map" && m.data.nodes) {
    const nodes = m.data.nodes;
    ctx.globalAlpha = dataAlpha + extra;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const px = box.x + n.t * box.w;
      const py = box.y + box.h / 2 + n.yOff * box.h * 0.5;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    for (const n of nodes) {
      const px = box.x + n.t * box.w;
      const py = box.y + box.h / 2 + n.yOff * box.h * 0.5;
      ctx.beginPath();
      ctx.arc(px, py, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (m.kind === "arch" && m.data.blocks) {
    const blocks = m.data.blocks;
    ctx.globalAlpha = dataAlpha + extra;
    const cy = box.y + box.h / 2;
    ctx.beginPath();
    ctx.moveTo(box.x, cy);
    ctx.lineTo(box.x + box.w, cy);
    ctx.stroke();
    for (const bl of blocks) {
      const bx = box.x + bl.t * box.w;
      const bs = bl.size * box.h * 0.5;
      ctx.strokeRect(bx - bs / 2, cy - bs / 2, bs, bs);
    }
  } else if (m.kind === "pulse") {
    ctx.globalAlpha = dataAlpha + extra;
    const cy = box.y + box.h / 2;
    ctx.beginPath();
    for (let px = 0; px <= box.w; px += 2) {
      const u = (((px / box.w) * 6 + (m.data.seed ?? 0) + t / 400) % 1);
      const spike =
        u > 0.46 && u < 0.5
          ? 0.5 - Math.abs(u - 0.48) * 25
          : u > 0.5 && u < 0.56
            ? -(0.5 - Math.abs(u - 0.53) * 20)
            : 0;
      const py = cy - spike * box.h;
      if (px === 0) ctx.moveTo(box.x + px, py);
      else ctx.lineTo(box.x + px, py);
    }
    ctx.stroke();
    const liveOn = Math.sin(t / 300) > 0;
    ctx.globalAlpha = liveOn ? (dataAlpha + extra) * 1.6 : dataAlpha * 0.4 * dim;
    ctx.beginPath();
    ctx.arc(box.x + box.w - 4, box.y + 6, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function clientToCanvas(canvas: HTMLCanvasElement, clientX: number, clientY: number) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * canvas.width,
    y: ((clientY - rect.top) / rect.height) * canvas.height,
  };
}

function hitBall(balls: Ball[], canvas: HTMLCanvasElement, clientX: number, clientY: number): number | null {
  const { x: px, y: py } = clientToCanvas(canvas, clientX, clientY);
  for (let i = balls.length - 1; i >= 0; i--) {
    const b = balls[i];
    const hitR = b.r * 4.5;
    const dx = px - b.x;
    const dy = py - b.y;
    if (dx * dx + dy * dy <= hitR * hitR) return i;
  }
  return null;
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return !!target.closest(
    'a, button, input, textarea, select, label, [role="button"], .pt-orb-wrap, .pt-orb-sphere-wrap, .pt-nav, .pt-quick-nav',
  );
}

function clampBurstSpeed(vx: number, vy: number) {
  const min = MIN_BALL_SPEED;
  const max = BURST_SPEED_MAX;
  let sx = vx;
  let sy = vy;
  const speed = Math.hypot(sx, sy);
  if (speed < min) {
    const scale = min / Math.max(speed, 0.001);
    sx *= scale;
    sy *= scale;
  } else if (speed > max) {
    const scale = max / speed;
    sx *= scale;
    sy *= scale;
  }
  return { vx: sx, vy: sy };
}

function ballBounds(w: number, h: number, r: number) {
  return { left: r + 4, right: w - r - 4, top: NAV_CLEAR_PX + r, bottom: h - r - 4 };
}

function cruiseSpeed(b: Ball) {
  return Math.max(Math.hypot(b.cruiseVx, b.cruiseVy), MIN_BALL_SPEED);
}

/** Clamp to walls, reflect only when moving into a wall, kick out of corners */
function resolveWalls(b: Ball, w: number, h: number): boolean {
  const { left, right, top, bottom } = ballBounds(w, h, b.r);
  let bounced = false;

  const touchLeft = b.x <= left;
  const touchRight = b.x >= right;
  const touchTop = b.y <= top;
  const touchBottom = b.y >= bottom;

  if (touchLeft) b.x = left;
  else if (touchRight) b.x = right;

  if (touchTop) b.y = top;
  else if (touchBottom) b.y = bottom;

  if (touchLeft && b.vx < 0) {
    b.vx = -b.vx;
    bounced = true;
  } else if (touchRight && b.vx > 0) {
    b.vx = -b.vx;
    bounced = true;
  }

  if (touchTop && b.vy < 0) {
    b.vy = -b.vy;
    bounced = true;
  } else if (touchBottom && b.vy > 0) {
    b.vy = -b.vy;
    bounced = true;
  }

  const inCornerX = touchLeft || touchRight;
  const inCornerY = touchTop || touchBottom;
  if (inCornerX && inCornerY) {
    const speed = Math.max(Math.hypot(b.vx, b.vy), cruiseSpeed(b));
    const diag = speed * 0.707;
    if (touchLeft) b.vx = Math.max(diag, MIN_BALL_SPEED);
    if (touchRight) b.vx = -Math.max(diag, MIN_BALL_SPEED);
    if (touchTop) b.vy = Math.max(diag, MIN_BALL_SPEED);
    if (touchBottom) b.vy = -Math.max(diag, MIN_BALL_SPEED);
    bounced = true;
  } else {
    if (touchLeft && b.vx <= 0) b.vx = MIN_BALL_SPEED;
    if (touchRight && b.vx >= 0) b.vx = -MIN_BALL_SPEED;
    if (touchTop && b.vy <= 0) b.vy = MIN_BALL_SPEED;
    if (touchBottom && b.vy >= 0) b.vy = -MIN_BALL_SPEED;
  }

  return bounced;
}

/** Keep balls at cruise speed — direction comes from bounces, not drift into corners */
function settleSpeed(b: Ball) {
  const cruise = cruiseSpeed(b);
  let speed = Math.hypot(b.vx, b.vy);

  if (speed < 0.001) {
    b.vx = b.cruiseVx;
    b.vy = b.cruiseVy;
    speed = Math.hypot(b.vx, b.vy);
    if (speed < 0.001) {
      b.vx = MIN_BALL_SPEED;
      b.vy = MIN_BALL_SPEED * 0.6;
      speed = Math.hypot(b.vx, b.vy);
    }
  }

  let target = cruise;
  if (b.boostBounces > 0) {
    target = Math.min(Math.max(speed, cruise), BURST_SPEED_MAX);
  } else if (speed > cruise) {
    target = speed + (cruise - speed) * 0.045;
  }

  target = Math.max(target, MIN_BALL_SPEED);
  const scale = target / speed;
  b.vx *= scale;
  b.vy *= scale;
}

function releaseBallBurst(b: Ball, vx: number, vy: number) {
  const burst = clampBurstSpeed(vx, vy);
  b.vx = burst.vx;
  b.vy = burst.vy;
  b.boostBounces = BOOST_BOUNCES;
}

function placeBall(b: Ball, px: number, py: number, w: number, h: number) {
  b.x = Math.max(b.r + 4, Math.min(w - b.r - 4, px));
  b.y = Math.max(NAV_CLEAR_PX + b.r, Math.min(h - b.r - 4, py));
}

function discoBarsHit(m: Motif, ball: Ball) {
  m.pulse = PULSE_HIT;
  m.kind = "bars";
  m.color = ball.color;
  const count = m.data.bars?.length ?? 7;
  m.data.bars = Array.from({ length: count }, () => 0.18 + Math.random() * 0.82);
  m.data.barPhase = Array.from({ length: count }, () => Math.random() * Math.PI * 2);
}

function reshapeMotif(m: Motif, ball: Ball) {
  m.pulse = PULSE_HIT;
  m.kind = PERSONA_KIND[ball.key];
  m.color = ball.color;
  m.data = genMotifData(m.kind);
  m.shapedBy = ball.key;
}

function onMotifBallHit(m: Motif, ball: Ball, wasInside: boolean) {
  if (wasInside) return;
  if (m.startKind === "bars") {
    discoBarsHit(m, ball);
    return;
  }
  reshapeMotif(m, ball);
}

function collideBallWithMotif(b: Ball, m: Motif, pad: number, physical = true) {
  const box = m.box;
  if (!box) return;

  m.touch = m.touch || {};
  const left = box.x - pad;
  const right = box.x + box.w + pad;
  const top = box.y - pad;
  const bottom = box.y + box.h + pad;
  const overlapping = b.x > left && b.x < right && b.y > top && b.y < bottom;
  const wasInside = !!m.touch[b.key];

  if (overlapping) {
    if (physical) {
      const cx = box.x + box.w / 2;
      const cy = box.y + box.h / 2;
      const dx = b.x - cx;
      const dy = b.y - cy;
      const hw = box.w / 2 + pad;
      const hh = box.h / 2 + pad;
      const overlapX = hw - Math.abs(dx);
      const overlapY = hh - Math.abs(dy);

      if (overlapX > 0 && overlapY > 0) {
        if (overlapX < overlapY) {
          b.x += dx > 0 ? overlapX : -overlapX;
          b.vx = Math.abs(b.vx) * (dx > 0 ? 1 : -1);
          if (Math.abs(b.vx) < MIN_BALL_SPEED) b.vx = MIN_BALL_SPEED * (dx > 0 ? 1 : -1);
        } else {
          b.y += dy > 0 ? overlapY : -overlapY;
          b.vy = Math.abs(b.vy) * (dy > 0 ? 1 : -1);
          if (Math.abs(b.vy) < MIN_BALL_SPEED) b.vy = MIN_BALL_SPEED * (dy > 0 ? 1 : -1);
        }
      }
    }

    if (!wasInside) onMotifBallHit(m, b, wasInside);
    m.touch[b.key] = true;
  } else {
    m.touch[b.key] = false;
  }
}

function drawBall(
  ctx: CanvasRenderingContext2D,
  b: Ball,
  light: boolean,
  dragging = false,
) {
  const glow = dragging ? b.r * 5.2 : b.r * 4;
  const alpha = dragging ? (light ? 0.45 : 0.88) : light ? 0.72 : 1;

  ctx.globalAlpha = alpha;
  const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, glow);
  grad.addColorStop(0, b.color);
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(b.x, b.y, glow, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = b.color;
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r * 1.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

type DragState = {
  index: number;
  pointerId: number;
  lastX: number;
  lastY: number;
  vx: number;
  vy: number;
};

type BackgroundCanvasProps = {
  theme: ColorScheme;
};

export default function BackgroundCanvas({ theme }: BackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef(theme);
  const dragRef = useRef<DragState | null>(null);
  const hoverBallRef = useRef<number | null>(null);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = Math.max(1, window.innerWidth);
    let h = Math.max(1, window.innerHeight);
    canvas.width = w;
    canvas.height = h;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let mouseX = -9999;
    let mouseY = -9999;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const stars: { xr: number; yr: number; r: number; phase: number; speed: number }[] = [];
    for (let i = 0; i < STARS_COUNT; i++) {
      stars.push({
        xr: Math.random(),
        yr: Math.random() * 0.86,
        r: Math.random() * 1.3 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.2,
      });
    }

    const balls: Ball[] = PERSONAS.map((p, i) => ({
      key: p.key as PersonaKey,
      color: p.color,
      x: w * (0.12 + i * 0.34),
      y: Math.max(90, h * (0.14 + i * 0.28)),
      vx: (i % 2 === 0 ? 1 : -1) * (BALL_VX[i] ?? 0.26),
      vy: (i % 2 === 0 ? 1 : -1) * (BALL_VY[i] ?? 0.18),
      savedVx: (i % 2 === 0 ? 1 : -1) * (BALL_VX[i] ?? 0.26),
      savedVy: (i % 2 === 0 ? 1 : -1) * (BALL_VY[i] ?? 0.18),
      cruiseVx: (i % 2 === 0 ? 1 : -1) * (BALL_VX[i] ?? 0.26),
      cruiseVy: (i % 2 === 0 ? 1 : -1) * (BALL_VY[i] ?? 0.18),
      boostBounces: 0,
      r: 7 + i * 1.8,
    }));

    const light0 = themeRef.current === "light";
    const motifSeeds = [
      { xr: 0.06, wr: 0.16, hPx: 70, startKind: "bars" as const },
      { xr: 0.56, wr: 0.16, hPx: 70, startKind: "bars" as const },
      { xr: 0.3, wr: 0.18, hPx: 56, startKind: "line" as const },
      { xr: 0.72, wr: 0.18, hPx: 56, startKind: "line" as const },
    ];
    const motifs: Motif[] = motifSeeds.map((m, i) => ({
      ...m,
      y: 90 + i * 190 + Math.random() * 90,
      kind: m.startKind,
      color: light0 ? "#6d5fd6" : "#9fb0ff",
      drift: MOTIF_DRIFT[i] ?? 0.65,
      shapedBy: null,
      pulse: 0,
      data: genMotifData(m.startKind),
    }));

    const labels: Label[] = LABEL_SET.map((text, i) => ({
      text,
      xr: (i % 4) * 0.24 + 0.05,
      y: 110 + i * 78 + Math.random() * 50,
      color: NEON_LABELS[i % NEON_LABELS.length],
      drift: LABEL_DRIFT[i % LABEL_DRIFT.length],
    }));

    let heroBlockEls: Element[] = [];
    let hoverElList: HTMLElement[] = [];
    let heroRect: { top: number; bottom: number; left: number; right: number } | null = null;
    let heroRectTick = 0;
    let hoverRectTick = 0;
    let ballHovered = new Set<HTMLElement>();
    let hoverEls: { el: HTMLElement; rect: DOMRect }[] = [];
    let lastDomRefresh = 0;

    const refreshDomQueries = () => {
      heroBlockEls = Array.from(document.querySelectorAll("[data-hero-block]"));
      hoverElList = Array.from(document.querySelectorAll("[data-ball-hover]")) as HTMLElement[];
    };
    refreshDomQueries();

    const sizeCanvas = () => {
      w = Math.max(1, window.innerWidth);
      h = Math.max(1, window.innerHeight);
      canvas.width = w;
      canvas.height = h;
      for (const b of balls) {
        b.x = Math.min(Math.max(b.x, b.r + 4), w - b.r - 4);
        b.y = Math.min(Math.max(b.y, NAV_CLEAR_PX + b.r), h - b.r - 4);
      }
    };

    let paused = false;
    const onVisibility = () => {
      paused = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const setCursor = (cursor: string) => {
      document.body.style.cursor = cursor;
    };

    const clearBallTouches = (ball: Ball) => {
      for (const m of motifs) {
        if (m.touch) m.touch[ball.key] = false;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || isInteractiveTarget(e.target)) return;
      const hit = hitBall(balls, canvas, e.clientX, e.clientY);
      if (hit === null) return;
      const held = balls[hit];
      held.savedVx = held.vx;
      held.savedVy = held.vy;
      held.vx = 0;
      held.vy = 0;
      const { x, y } = clientToCanvas(canvas, e.clientX, e.clientY);
      dragRef.current = {
        index: hit,
        pointerId: e.pointerId,
        lastX: x,
        lastY: y,
        vx: 0,
        vy: 0,
      };
      setCursor("grabbing");
      e.preventDefault();
      try {
        document.body.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (drag && e.pointerId === drag.pointerId) {
        const { x, y } = clientToCanvas(canvas, e.clientX, e.clientY);
        drag.vx = x - drag.lastX;
        drag.vy = y - drag.lastY;
        drag.lastX = x;
        drag.lastY = y;
        placeBall(balls[drag.index], x, y, w, h);
        const dragged = balls[drag.index];
        for (const m of motifs) {
          if (m.box) collideBallWithMotif(dragged, m, dragged.r * 2.8, false);
        }
        return;
      }
      if (isInteractiveTarget(e.target)) {
        if (hoverBallRef.current !== null) {
          hoverBallRef.current = null;
          setCursor("");
        }
        return;
      }
      const hit = hitBall(balls, canvas, e.clientX, e.clientY);
      hoverBallRef.current = hit;
      setCursor(hit !== null ? "grab" : "");
    };

    const onPointerUp = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;

      const b = balls[drag.index];
      placeBall(b, drag.lastX, drag.lastY, w, h);
      clearBallTouches(b);

      if (Math.abs(drag.vx) > 0.4 || Math.abs(drag.vy) > 0.4) {
        releaseBallBurst(b, drag.vx * THROW_SCALE * BURST_SPEED_MUL, drag.vy * THROW_SCALE * BURST_SPEED_MUL);
      } else {
        releaseBallBurst(b, b.cruiseVx * 1.75, b.cruiseVy * 1.75);
      }

      dragRef.current = null;
      setCursor(hoverBallRef.current !== null ? "grab" : "");

      try {
        document.body.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("pointermove", onPointerMove, true);
    window.addEventListener("pointerup", onPointerUp, true);
    window.addEventListener("pointercancel", onPointerUp, true);

    let raf = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (paused || isReduced || w < 2 || h < 2) return;

      const light = themeRef.current === "light";
      const dragIndex = dragRef.current?.index ?? null;
      const suspended = dragIndex !== null;
      const bgFactor = suspended ? SUSPEND_BG_FACTOR : 1;

      const sky = ctx.createLinearGradient(0, 0, 0, h);
      if (light) {
        sky.addColorStop(0, "#eef1f8");
        sky.addColorStop(1, "#e4e8f2");
      } else {
        sky.addColorStop(0, "#060712");
        sky.addColorStop(1, "#0d1224");
      }
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        const tw = 0.5 + 0.5 * Math.sin((t / 1000) * s.speed + s.phase);
        ctx.globalAlpha = light ? 0.14 + 0.22 * tw : 0.25 + 0.55 * tw;
        ctx.fillStyle = light ? "#4a4f68" : "#ffffff";
        ctx.beginPath();
        ctx.arc(s.xr * w, s.yr * h, s.r * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const dataAlpha = light ? 0.4 : 0.55;

      if (t - lastDomRefresh > DOM_REFRESH_MS) {
        lastDomRefresh = t;
        refreshDomQueries();
      }

      if (t - heroRectTick > HERO_RECT_MS) {
        heroRectTick = t;
        let rect: typeof heroRect = null;
        for (const el of heroBlockEls) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          if (!rect) rect = { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
          else {
            rect.top = Math.min(rect.top, r.top);
            rect.bottom = Math.max(rect.bottom, r.bottom);
            rect.left = Math.min(rect.left, r.left);
            rect.right = Math.max(rect.right, r.right);
          }
        }
        heroRect = rect;
      }

      const HERO_PAD = 16;
      const heroDim = (yTop: number, yBottom: number, xLeft: number, xRight?: number) => {
        if (!heroRect) return 1;
        const clearY = yBottom < heroRect.top - HERO_PAD || yTop > heroRect.bottom + HERO_PAD;
        if (clearY) return 1;
        if (xRight === undefined) return 0.12;
        const clearX = xRight < heroRect.left - HERO_PAD || xLeft > heroRect.right + HERO_PAD;
        return clearX ? 1 : 0.12;
      };

      ctx.lineWidth = 2;

      if (t - hoverRectTick > HOVER_RECT_MS) {
        hoverRectTick = t;
        hoverEls = hoverElList.map((el) => ({ el, rect: el.getBoundingClientRect() }));
      }

      for (const m of motifs) {
        m.y += m.drift * bgFactor;
        if (m.y - m.hPx > h) {
          m.y = NAV_CLEAR_PX + Math.random() * 40;
          m.kind = m.startKind;
          m.color = light ? "#6d5fd6" : "#9fb0ff";
          m.data = genMotifData(m.startKind);
          m.shapedBy = null;
          m.touch = {};
        }
        m.pulse *= m.startKind === "bars" ? BAR_PULSE_DECAY : PULSE_DECAY;
        m.box = { x: m.xr * w, y: m.y, w: m.wr * w, h: m.hPx };
      }

      const stillHovered = new Set<HTMLElement>();
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        const dragging = dragIndex === i;

        if (!dragging) {
          b.x += b.vx;
          b.y += b.vy;
          const bounced = resolveWalls(b, w, h);
          if (bounced && b.boostBounces > 0) b.boostBounces -= 1;
          settleSpeed(b);
        }

        for (const m of motifs) {
          collideBallWithMotif(b, m, b.r * 2.8);
        }

        if (!dragging) {
          resolveWalls(b, w, h);
          settleSpeed(b);
        }

        for (const { el, rect } of hoverEls) {
          const pad = 26;
          const near =
            b.x > rect.left - pad && b.x < rect.right + pad && b.y > rect.top - pad && b.y < rect.bottom + pad;
          if (near) {
            stillHovered.add(el);
            if (!ballHovered.has(el)) {
              el.style.transform = "translateY(-6px) scale(1.02)";
              el.style.boxShadow = `0 16px 36px -16px ${b.color}`;
              el.style.borderColor = b.color;
            }
          }
        }

        drawBall(ctx, b, light, dragging);
      }

      for (const el of ballHovered) {
        if (!stillHovered.has(el)) {
          el.style.transform = "";
          el.style.boxShadow = "";
          el.style.borderColor = "";
        }
      }
      ballHovered = stillHovered;

      for (const m of motifs) {
        if (!m.box) continue;
        const dim = heroDim(m.box.y, m.box.y + m.box.h, m.box.x, m.box.x + m.box.w);
        const fadeTop = Math.min(1, Math.max(0, (m.box.y - NAV_CLEAR_PX) / 50));
        const fadeBottom = Math.min(1, Math.max(0, (h - (m.box.y + m.box.h)) / 50));
        const fade = Math.min(fadeTop, fadeBottom);
        drawMotif(ctx, m, dataAlpha * dim * fade, t, dim * fade);
      }

      ctx.font = "600 13px 'IBM Plex Mono', monospace";
      for (const lb of labels) {
        lb.y += lb.drift * bgFactor;
        if (lb.y > h) lb.y = NAV_CLEAR_PX + Math.random() * 40;
        const lbWidth = ctx.measureText(lb.text).width;
        const dim = heroDim(lb.y - 14, lb.y + 4, lb.xr * w, lb.xr * w + lbWidth);
        const fadeTop = Math.min(1, Math.max(0, (lb.y - NAV_CLEAR_PX) / 40));
        const fadeBottom = Math.min(1, Math.max(0, (h - lb.y) / 40));
        const fade = Math.min(fadeTop, fadeBottom);
        ctx.globalAlpha = dataAlpha * dim * fade;
        ctx.fillStyle = lb.color;
        ctx.fillText(lb.text, lb.xr * w, lb.y);
      }
      ctx.globalAlpha = 1;

      const mx = mouseX;
      const my = mouseY;
      const glowEl = glowRef.current;
      if (glowEl) {
        glowEl.style.background = light
          ? `radial-gradient(380px 300px at ${mx}px ${my}px, color-mix(in srgb, var(--accent) 24%, transparent), color-mix(in srgb, var(--accent) 8%, transparent) 48%, transparent 74%)`
          : `radial-gradient(380px 300px at ${mx}px ${my}px, color-mix(in srgb, var(--accent) 18%, white 6%), color-mix(in srgb, var(--accent) 7%, transparent) 44%, transparent 72%)`;
      }
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", sizeCanvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointermove", onPointerMove, true);
      window.removeEventListener("pointerup", onPointerUp, true);
      window.removeEventListener("pointercancel", onPointerUp, true);
      dragRef.current = null;
      hoverBallRef.current = null;
      document.body.style.cursor = "";
      for (const el of ballHovered) {
        el.style.transform = "";
        el.style.boxShadow = "";
        el.style.borderColor = "";
      }
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="pt-bg-canvas" aria-hidden />
      <div
        ref={glowRef}
        className="pt-cursor-glow"
        style={{ mixBlendMode: theme === "light" ? "multiply" : "screen" }}
      />
    </>
  );
}
