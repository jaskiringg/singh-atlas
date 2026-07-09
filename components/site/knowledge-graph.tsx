"use client";

import { useEffect, useRef, useState } from "react";

/** PIKU knowledge-graph — animated SVG node constellation.
 *  Memory nodes, agents, and relationships drift and pulse.
 *  Clicking a node highlights its connections. */

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
  kind: "core" | "memory" | "agent" | "skill";
}

interface Edge {
  from: string;
  to: string;
}

const nodes: Node[] = [
  { id: "identity", label: "Identity", x: 0, y: 0, r: 26, kind: "core" },
  { id: "context", label: "Context", x: 120, y: -90, r: 20, kind: "core" },
  { id: "memory", label: "Long-term Memory", x: -110, y: -80, r: 22, kind: "memory" },
  { id: "worldmodel", label: "World Model", x: 140, y: 60, r: 20, kind: "core" },
  { id: "reasoning", label: "Reasoning", x: -130, y: 50, r: 18, kind: "agent" },
  { id: "retrieval", label: "Retrieval", x: 60, y: -150, r: 16, kind: "agent" },
  { id: "vault", label: "Vault", x: -60, y: 140, r: 18, kind: "memory" },
  { id: "agents", label: "Agents", x: 200, y: -30, r: 17, kind: "agent" },
  { id: "docs", label: "Documents", x: -180, y: -10, r: 15, kind: "memory" },
  { id: "evolution", label: "Evolution", x: 100, y: 140, r: 16, kind: "core" },
  { id: "embedding", label: "Embeddings", x: -40, y: -170, r: 14, kind: "skill" },
  { id: "planner", label: "Planner", x: -160, y: 120, r: 14, kind: "agent" },
];

const edges: Edge[] = [
  { from: "identity", to: "context" },
  { from: "identity", to: "memory" },
  { from: "identity", to: "worldmodel" },
  { from: "identity", to: "reasoning" },
  { from: "context", to: "retrieval" },
  { from: "context", to: "embedding" },
  { from: "context", to: "worldmodel" },
  { from: "memory", to: "vault" },
  { from: "memory", to: "docs" },
  { from: "memory", to: "retrieval" },
  { from: "worldmodel", to: "agents" },
  { from: "worldmodel", to: "evolution" },
  { from: "reasoning", to: "planner" },
  { from: "reasoning", to: "vault" },
  { from: "agents", to: "planner" },
  { from: "evolution", to: "memory" },
  { from: "retrieval", to: "embedding" },
  { from: "vault", to: "docs" },
  { from: "planner", to: "memory" },
  { from: "evolution", to: "context" },
];

const kindColor: Record<Node["kind"], string> = {
  core: "var(--accent)",
  memory: "var(--ink-2)",
  agent: "var(--consultant)",
  skill: "var(--builder)",
};

export function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  /* slow orbit drift */
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60);
    return () => clearInterval(id);
  }, []);

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const activeEdges =
    activeId
      ? edges.filter((e) => e.from === activeId || e.to === activeId)
      : edges;
  const activeNodes =
    activeId
      ? new Set([
          activeId,
          ...activeEdges.map((e) => e.from),
          ...activeEdges.map((e) => e.to),
        ])
      : null;

  const cx = 200, cy = 160;
  const drift = (node: Node) => {
    const phase = (tick / 800 + parseFloat(node.id.charCodeAt(0).toString())) * Math.PI * 2;
    const dx = Math.sin(phase) * 3;
    const dy = Math.cos(phase * 0.7) * 3;
    return { x: cx + node.x + dx, y: cy + node.y + dy };
  };

  return (
    <div className="kg-wrap" data-reveal>
      <svg
        ref={svgRef}
        viewBox="0 0 400 320"
        className="kg-svg"
        role="img"
        aria-label="PIKU knowledge graph showing memory, agents, and reasoning connections"
      >
        {/* edges */}
        {activeEdges.map((e) => {
          const a = drift(nodeMap[e.from]!);
          const b = drift(nodeMap[e.to]!);
          const dim = activeNodes && (!activeNodes.has(e.from) || !activeNodes.has(e.to));
          return (
            <line
              key={`${e.from}-${e.to}`}
              x1={a.x} y1={a.y}
              x2={b.x} y2={b.y}
              className={`kg-edge${dim ? " dim" : ""}`}
            />
          );
        })}

        {/* nodes */}
        {nodes.map((node) => {
          const { x, y } = drift(node);
          const isActive = !activeNodes || activeNodes.has(node.id);
          const isCenter = activeId === node.id;
          return (
            <g
              key={node.id}
              className={`kg-node${isActive ? "" : " dim"}${isCenter ? " active" : ""}`}
              onClick={() => setActiveId(activeId === node.id ? null : node.id)}
              style={{ cursor: "pointer" }}
            >
              {/* pulse ring on active */}
              {isCenter && <circle cx={x} cy={y} r={node.r + 8} className="kg-pulse" fill="none" stroke={kindColor[node.kind]} />}
              <circle cx={x} cy={y} r={node.r} fill="none" stroke={kindColor[node.kind]} strokeWidth={isCenter ? 1.5 : 1} />
              <text x={x} y={y} className="kg-label" fill={kindColor[node.kind]}>
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="kg-legend">
        {(["core", "memory", "agent", "skill"] as const).map((k) => (
          <span key={k} className="kg-legend-item">
            <span className="kg-legend-dot" style={{ background: kindColor[k] }} />
            <span>{k === "core" ? "Core system" : k === "memory" ? "Memory" : k === "agent" ? "Agent" : "Skill"}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
