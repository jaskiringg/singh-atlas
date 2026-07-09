"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const TRANSITION_MS = 580;

type LayerState = "enter" | "exit" | "idle";

type Layer = { key: number; state: LayerState };

function getDirection(from: number, to: number, total: number): 1 | -1 {
  if (from === to) return 1;
  const forward = (to - from + total) % total;
  const backward = (from - to + total) % total;
  return forward <= backward ? 1 : -1;
}

type SwitchingPanelProps = {
  index: number;
  total: number;
  className?: string;
  style?: CSSProperties;
  render: (index: number) => ReactNode;
};

export default function SwitchingPanel({ index, total, className, style, render }: SwitchingPanelProps) {
  const prevIndexRef = useRef(index);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [layers, setLayers] = useState<Layer[]>([{ key: index, state: "idle" }]);

  useEffect(() => {
    const from = prevIndexRef.current;
    if (from === index) return;

    setDirection(getDirection(from, index, total));
    setLayers([
      { key: from, state: "exit" },
      { key: index, state: "enter" },
    ]);
    prevIndexRef.current = index;

    const timer = window.setTimeout(() => {
      setLayers([{ key: index, state: "idle" }]);
    }, TRANSITION_MS);

    return () => window.clearTimeout(timer);
  }, [index, total]);

  return (
    <div
      className={`pt-switch-panel ${className ?? ""}`}
      style={style}
      data-dir={direction}
      data-animating={layers.length > 1 ? "true" : "false"}
    >
      {layers.map((layer) => (
        <div key={layer.key} className={`pt-switch-panel__layer pt-switch-panel__layer--${layer.state}`}>
          {render(layer.key)}
        </div>
      ))}
    </div>
  );
}
