"use client";

import { useEffect, useState } from "react";
import { commDocs } from "@/lib/site-content";

const AUTO_MS = 5000;

/** Communicate cards — pick an artifact, see a blurred-but-realistic preview.
 * Each doc type renders different structure (table rows, flow steps, code blocks, checklists).
 * Demonstrates consulting deliverables instead of claiming them. */

function DeckPreview({ doc }: { doc: typeof commDocs[number] }) {
  return (
    <div className="dp-content dp-content-deck">
      {/* fake slide outline */}
      <div className="dp-slide-preview">
        <div className="dp-slide-num">01</div>
        <div className="dp-slide-blocks">
          <div className="dp-slide-title" />
          <div className="dp-slide-bar w80" />
          <div className="dp-slide-bar w60" />
        </div>
      </div>
      <div className="dp-slide-preview">
        <div className="dp-slide-num">02</div>
        <div className="dp-slide-blocks">
          <div className="dp-slide-title" />
          <div className="dp-slide-bar w90" />
          <div className="dp-slide-bar w45" />
          <div className="dp-slide-bar w70" />
        </div>
      </div>
      <div className="dp-slide-preview">
        <div className="dp-slide-num">03</div>
        <div className="dp-slide-blocks">
          <div className="dp-slide-title" />
          <div className="dp-slide-bar w55" />
        </div>
      </div>
      <div className="dp-slide-more">+ {doc.blocks.length - 3} more slides</div>
    </div>
  );
}

function ArchitecturePreview({ doc }: { doc: typeof commDocs[number] }) {
  return (
    <div className="dp-content dp-content-arch">
      <div className="dp-flow-row">
        {doc.blocks.slice(0, 4).map((b) => (
          <div key={b} className="dp-flow-box">
            <div className="dp-flow-label">{b}</div>
            <div className="dp-flow-lines">
              <div className="dp-slide-bar w80" />
              <div className="dp-slide-bar w50" />
            </div>
          </div>
        ))}
      </div>
      {doc.blocks.length > 4 && (
        <div className="dp-flow-row" style={{ marginTop: 8 }}>
          {doc.blocks.slice(4).map((b) => (
            <div key={b} className="dp-flow-box">
              <div className="dp-flow-label">{b}</div>
              <div className="dp-flow-lines">
                <div className="dp-slide-bar w70" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SpecPreview({ doc }: { doc: typeof commDocs[number] }) {
  return (
    <div className="dp-content dp-content-spec">
      {/* fake markdown/code spec */}
      <div className="dp-spec-block">
        <div className="dp-spec-heading">{doc.blocks[0]}</div>
        <div className="dp-spec-lines">
          <div className="dp-slide-bar w90" />
          <div className="dp-slide-bar w65" />
          <div className="dp-slide-bar w80" />
        </div>
      </div>
      <div className="dp-spec-block" style={{ marginTop: 14 }}>
        <div className="dp-spec-heading">{doc.blocks[1]}</div>
        <div className="dp-spec-table">
          {[0, 1, 2].map((i) => (
            <div key={i} className="dp-spec-row">
              <div className="dp-slide-bar w30" />
              <div className="dp-slide-bar w50" />
              <div className="dp-slide-bar w20" />
            </div>
          ))}
        </div>
      </div>
      <div className="dp-spec-block" style={{ marginTop: 14 }}>
        <div className="dp-spec-heading">{doc.blocks[2]}</div>
        <div className="dp-spec-code">
          <div className="dp-slide-bar w70" />
          <div className="dp-slide-bar w85" />
          <div className="dp-slide-bar w45" />
          <div className="dp-slide-bar w60" />
        </div>
      </div>
    </div>
  );
}

function RunbookPreview({ doc }: { doc: typeof commDocs[number] }) {
  return (
    <div className="dp-content dp-content-runbook">
      {doc.blocks.map((b, i) => (
        <div key={b} className="dp-runbook-step">
          <div className="dp-runbook-num">{String(i + 1).padStart(2, "0")}</div>
          <div className="dp-runbook-body">
            <div className="dp-runbook-title" />
            <div className="dp-slide-bar w80" />
            <div className="dp-slide-bar w55" />
          </div>
          <div className="dp-runbook-status" />
        </div>
      ))}
    </div>
  );
}

function TracePreview({ doc }: { doc: typeof commDocs[number] }) {
  return (
    <div className="dp-content dp-content-trace">
      <div className="dp-trace-table">
        <div className="dp-trace-header">
          <div className="dp-trace-cell" style={{ width: "30%" }} />
          <div className="dp-trace-cell" style={{ width: "40%" }} />
          <div className="dp-trace-cell" style={{ width: "15%" }} />
          <div className="dp-trace-cell" style={{ width: "15%" }} />
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="dp-trace-row">
            <div className="dp-trace-cell" style={{ width: "30%" }}><div className="dp-slide-bar w80" /></div>
            <div className="dp-trace-cell" style={{ width: "40%" }}><div className="dp-slide-bar w60" /></div>
            <div className="dp-trace-cell" style={{ width: "15%" }}><div className="dp-slide-bar w50" /></div>
            <div className="dp-trace-cell" style={{ width: "15%" }}><div className="dp-slide-bar w30" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlaybookPreview({ doc }: { doc: typeof commDocs[number] }) {
  return (
    <div className="dp-content dp-content-playbook">
      {doc.blocks.map((b, i) => (
        <div key={b} className="dp-playbook-phase">
          <div className="dp-playbook-phase-label">{b}</div>
          <div className="dp-playbook-checks">
            <div className="dp-playbook-check" />
            <div className="dp-playbook-check" />
            <div className="dp-playbook-check" />
          </div>
        </div>
      ))}
    </div>
  );
}

const previewMap: Record<string, React.ComponentType<{ doc: typeof commDocs[number] }>> = {
  "CocaCola_InventorySync_v4.pptx": DeckPreview,
  "integration_architecture.excalidraw": ArchitecturePreview,
  "delta_sync_spec.md": SpecPreview,
  "Implementation — Runbook": RunbookPreview,
  "requirements_traceability.xlsx": TracePreview,
  "playbook.md": PlaybookPreview,
};

export function Communicate() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const doc = commDocs[active];
  const Preview = previewMap[doc.file] ?? DeckPreview;

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % commDocs.length);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [auto]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <>
      <div className="commcards" data-reveal>
        {commDocs.map((d, i) => (
          <button key={d.name} className={`commcard${i === active ? " on" : ""}`} onClick={() => pick(i)}>
            <div className="cn">{String(i + 1).padStart(2, "0")}</div>
            <div className="ct">{d.name}</div>
            <div className="cs">{d.kind}</div>
            {i === active && auto && <span className="wt-auto" aria-hidden />}
          </button>
        ))}
      </div>

      <div className="docpreview" data-reveal>
        <div className="dp-bar">
          <i /><i /><i /><span className="dp-name">{doc.file}</span>
        </div>
        <div className="dp-body">
          <span className="dp-stamp">CONFIDENTIAL · BLURRED</span>
          <div className="dp-title">{doc.title}</div>
          <div className="dp-sub">{doc.sub}</div>
          <Preview doc={doc} />
          <p className="dp-blurnote">Real client work — details blurred. The structure is the point.</p>
        </div>
      </div>
    </>
  );
}
