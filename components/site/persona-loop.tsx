"use client";

import { useEffect, useRef, useState } from "react";

/** Persona loop — three overlapping circles showing how
 *  Consultant → Builder → Operator → Consultant feed each other.
 *  Animated on scroll. Click a persona to highlight what it feeds. */

const personas = [
  {
    id: "consultant",
    label: "Consultant",
    desc: "Discovery, alignment, the deck",
    cx: 160, cy: 100,
    color: "var(--consultant)",
    feeds: ["builder"],
    receives: ["operator"],
  },
  {
    id: "builder",
    label: "Builder",
    desc: "SQL, Kafka, APIs, architecture",
    cx: 240, cy: 200,
    color: "var(--builder)",
    feeds: ["operator"],
    receives: ["consultant"],
  },
  {
    id: "operator",
    label: "Operator",
    desc: "Incidents, adoption, iteration",
    cx: 80, cy: 200,
    color: "var(--operator)",
    feeds: ["consultant"],
    receives: ["builder"],
  },
];

export function PersonaLoop() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  const activePersona = personas.find((p) => p.id === activeId);
  const highlightFeeds = activePersona?.feeds ?? [];
  const highlightReceives = activePersona?.receives ?? [];

  /* animated dots traveling along edges */
  const edgePaths = [
    { from: "consultant", to: "builder" },
    { from: "builder", to: "operator" },
    { from: "operator", to: "consultant" },
  ];

  const getCenter = (id: string) => {
    const p = personas.find((x) => x.id === id)!;
    return { x: p.cx, y: p.cy };
  };

  const midPoint = (a: string, b: string) => {
    const p1 = getCenter(a);
    const p2 = getCenter(b);
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  };

  const isEdgeHighlighted = (from: string, to: string) => {
    if (!activeId) return false;
    if (activeId === from) return true;
    if (activeId === to) return highlightReceives.includes(from);
    return false;
  };

  return (
    <div className="persona-loop-wrap" data-reveal>
      <svg
        ref={svgRef}
        viewBox="0 0 320 300"
        className="persona-loop-svg"
        role="img"
        aria-label="Three personas: Consultant, Builder, Operator — how they feed each other"
      >
        {/* edge lines */}
        {edgePaths.map((e) => {
          const p1 = getCenter(e.from);
          const p2 = getCenter(e.to);
          const hl = isEdgeHighlighted(e.from, e.to);
          return (
            <g key={`${e.from}-${e.to}`}>
              <line
                x1={p1.x} y1={p1.y}
                x2={p2.x} y2={p2.y}
                className={`pl-edge${hl ? " hl" : ""}`}
              />
              {/* animated traveling dot */}
              <circle r="3" className={`pl-dot${hl ? "" : " dim"}`}>
                <animateMotion dur="3s" repeatCount="indefinite" begin={`${tick * 0}s`}>
                  <mpath href={`#path-${e.from}-${e.to}`} />
                </animateMotion>
              </circle>
              <path
                id={`path-${e.from}-${e.to}`}
                d={`M${p1.x},${p1.y} L${p2.x},${p2.y}`}
                fill="none"
                stroke="none"
              />
            </g>
          );
        })}

        {/* edge labels */}
        {edgePaths.map((e) => {
          const mid = midPoint(e.from, e.to);
          const label = e.from === "consultant" ? "designs" :
                        e.from === "builder" ? "deploys" : "informs";
          return (
            <text key={`label-${e.from}-${e.to}`} x={mid.x} y={mid.y - 10} className="pl-edge-label">
              {label}
            </text>
          );
        })}

        {/* persona circles */}
        {personas.map((p) => {
          const isActive = !activeId || activeId === p.id;
          const isCenter = activeId === p.id;
          return (
            <g
              key={p.id}
              className={`pl-persona${isActive ? "" : " dim"}${isCenter ? " active" : ""}`}
              onClick={() => setActiveId(activeId === p.id ? null : p.id)}
              style={{ cursor: "pointer" }}
            >
              {isCenter && (
                <circle cx={p.cx} cy={p.cy} r={46} fill="none" stroke={p.color} strokeWidth="0.8" opacity="0.3">
                  <animate attributeName="r" values="46;54;46" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={p.cx} cy={p.cy} r={40} className="pl-circle" stroke={p.color} />
              <text x={p.cx} y={p.cy - 6} className="pl-name" fill={p.color}>{p.label}</text>
              <text x={p.cx} y={p.cy + 10} className="pl-desc">{p.desc}</text>
            </g>
          );
        })}
      </svg>
      <div className="persona-loop-caption">
        {!activeId
          ? "Click a persona to see what it feeds."
          : activePersona ? `${activePersona.label} feeds ${highlightFeeds.join(" + ")}` : ""}
      </div>
    </div>
  );
}
