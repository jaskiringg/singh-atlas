"use client";

import { useEffect, useRef, useState } from "react";

/** Architecture diagram — assembled-on-scroll system diagram for the integration story.
 *  Shows source systems → gateway → Kafka → transformation → master data → consumers.
 *  Animated data packets flow through the connections.
 *  Each tier lights up as it scrolls into view. */

interface Tier {
  id: string;
  label: string;
  sub: string;
  boxes: { label: string; sub?: string }[];
}

const tiers: Tier[] = [
  {
    id: "source",
    label: "Source Systems",
    sub: "ERP · DMS · POS",
    boxes: [
      { label: "SAP ERP" },
      { label: "DMS" },
      { label: "POS" },
    ],
  },
  {
    id: "gateway",
    label: "API Gateway",
    sub: "Auth · routing · rate limit",
    boxes: [
      { label: "REST API" },
      { label: "Auth" },
    ],
  },
  {
    id: "events",
    label: "Event Stream",
    sub: "Kafka topics · partitions",
    boxes: [
      { label: "master.product.delta" },
      { label: "order.created" },
      { label: "price.update" },
    ],
  },
  {
    id: "transform",
    label: "Transformation",
    sub: "Map · validate · enrich",
    boxes: [
      { label: "Mapper" },
      { label: "Validator" },
      { label: "Enricher" },
    ],
  },
  {
    id: "master",
    label: "Master Data",
    sub: "Single version of truth",
    boxes: [
      { label: "Product" },
      { label: "Customer" },
      { label: "Outlet" },
    ],
  },
  {
    id: "consume",
    label: "Consumers",
    sub: "Downstream systems",
    boxes: [
      { label: "Sales Platform" },
      { label: "Analytics" },
      { label: "Mobile Rep App" },
    ],
  },
];

function connections(tiers: Tier[]): { from: number; to: number }[] {
  const c: { from: number; to: number }[] = [];
  for (let i = 0; i < tiers.length - 1; i++) {
    // connect each box in tier i to each box in tier i+1
    for (let a = 0; a < tiers[i].boxes.length; a++) {
      for (let b = 0; b < tiers[i + 1].boxes.length; b++) {
        // skip some connections to avoid spaghetti — connect to closest pairs
        if (Math.abs(a - b) <= 1 || (a === 0 && b === 0) || (a === tiers[i].boxes.length - 1 && b === tiers[i + 1].boxes.length - 1)) {
          c.push({ from: i, to: i + 1 });
        }
      }
    }
  }
  // deduplicate
  const seen = new Set<string>();
  return c.filter((e) => {
    const k = `${e.from}-${e.to}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const tierConnections = connections(tiers);

export function ArchDiagram() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visibleTier, setVisibleTier] = useState(-1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number(e.target.getAttribute("data-tier"));
            if (!isNaN(idx) && idx > visibleTier) setVisibleTier(idx);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.3 }
    );
    el.querySelectorAll("[data-tier]").forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [visibleTier]);

  return (
    <div className="arch-wrap" ref={wrapRef} data-reveal>
      <div className="arch-diagram">
        {tiers.map((tier, ti) => {
          const visible = ti <= visibleTier;
          return (
            <div
              key={tier.id}
              className={`arch-tier${visible ? " visible" : ""}`}
              data-tier={ti}
            >
              <div className="arch-tier-label">
                <span className="arch-tier-name">{tier.label}</span>
                <span className="arch-tier-sub">{tier.sub}</span>
              </div>
              <div className="arch-boxes">
                {tier.boxes.map((box, bi) => (
                  <div key={`${tier.id}-${bi}`} className="arch-box">
                    <span className="arch-box-label">{box.label}</span>
                    {box.sub && <span className="arch-box-sub">{box.sub}</span>}
                  </div>
                ))}
              </div>
              {/* connector arrows between tiers */}
              {ti < tiers.length - 1 && (
                <div className={`arch-connector${visible ? " visible" : ""}`}>
                  <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="arch-conn-svg">
                    <defs>
                      <linearGradient id={`grad-${ti}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.15" />
                      </linearGradient>
                    </defs>
                    {/* animated packet */}
                    {visible && (
                      <circle r="2.5" fill="var(--accent)" opacity="0.8">
                        <animate attributeName="cy" from="2" to="38" dur="1.6s" repeatCount="indefinite" begin={`${bi2delay(ti, 0)}s`} />
                        <animate attributeName="cx" from="50" to="50" dur="1.6s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0;0.8;0.8;0" dur="1.6s" repeatCount="indefinite" begin={`${bi2delay(ti, 0)}s`} />
                      </circle>
                    )}
                    <line x1="50" y1="2" x2="50" y2="38" stroke={`url(#grad-${ti})`} strokeWidth="1" />
                    <polygon points="47,36 50,40 53,36" fill="var(--accent)" opacity="0.5" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function bi2delay(tierIdx: number, _boxIdx: number): number {
  return tierIdx * 0.25;
}
