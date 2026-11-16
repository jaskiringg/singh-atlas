"use client";

import { memo, useCallback, useMemo, useState } from "react";
import Reveal from "@/components/prototype/reveal";
import {
  ARCH_NODES,
  EXAMPLE_QUERIES,
  LAB_DISCLAIMER,
  SAMPLE_ORDER,
  WORKFLOW_SCENARIOS,
  runDeltaSimulation,
  type ArchEvent,
  type WorkflowStep,
} from "@/lib/lab-mock";

type LabTab = "api" | "sql" | "arch" | "voice";

const TABS: { id: LabTab; label: string; num: string }[] = [
  { id: "api", label: "API playground", num: "01" },
  { id: "sql", label: "SQL workbench", num: "02" },
  { id: "arch", label: "Architecture", num: "03" },
  { id: "voice", label: "AI workflow", num: "04" },
];

type LabSectionProps = { revealed: boolean };

function LabSection({ revealed }: LabSectionProps) {
  const [tab, setTab] = useState<LabTab>("api");
  return (
    <section className="pt-section" id="lab">
      <div className="pt-section-num">04</div>
      <Reveal id="lab" visible={revealed} sectionId="lab">
        <div className="pt-wrap">
          <span className="pt-kicker">Engineering Lab</span>
          <h2 className="pt-h2" style={{ maxWidth: "22ch" }}>
            Run the work, on mock data.
          </h2>
          <p className="pt-body" style={{ marginTop: 14, maxWidth: "68ch" }}>
            Four benches that actually execute. No production databases, no customer credentials. Every payload is labeled mock.
          </p>
          <p className="pt-lab-note">{LAB_DISCLAIMER}</p>

          <div className="pt-lab-tabs" role="tablist" aria-label="Engineering Lab">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`pt-tab ${tab === t.id ? "pt-tab--active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                <span className="pt-lab-tab-num">{t.num}</span>
                {t.label}
              </button>
            ))}
          </div>

          <div className="pt-lab-panel">
            {tab === "api" ? <ApiPlayground /> : null}
            {tab === "sql" ? <SqlWorkbench /> : null}
            {tab === "arch" ? <ArchitectureExplorer /> : null}
            {tab === "voice" ? <VoiceWorkflow /> : null}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function ApiPlayground() {
  const sample = useMemo(() => JSON.stringify(SAMPLE_ORDER, null, 2), []);
  const [body, setBody] = useState(sample);
  const [out, setOut] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    setBusy(true);
    setOut("");
    try {
      JSON.parse(body);
      const res = await fetch("/api/lab/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const json = await res.json();
      setOut(`HTTP ${res.status}\n${JSON.stringify(json, null, 2)}`);
    } catch (err) {
      setOut(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="pt-lab-lede">
        <code>POST /v2/orders</code> — the public shape from this portfolio. Submit it against mock masters. Try an inactive outlet (<code>IN-9104</code>) or SKU (<code>SKU-COKE-1.5</code>) to see validation fire.
      </p>
      <div className="pt-lab-split">
        <label className="pt-lab-field">
          <span>Request body</span>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} spellCheck={false} rows={16} />
        </label>
        <div className="pt-lab-field">
          <span>Response</span>
          <pre className="pt-lab-pre">{out || "Submit to see the mock gateway result."}</pre>
        </div>
      </div>
      <div className="pt-lab-actions">
        <button type="button" className="pt-cta pt-cta--primary" onClick={send} disabled={busy}>
          {busy ? "Sending…" : "POST mock order"}
        </button>
        <button type="button" className="pt-cta" onClick={() => setBody(sample)}>
          Reset sample
        </button>
      </div>
    </div>
  );
}

function SqlWorkbench() {
  const [sql, setSql] = useState(EXAMPLE_QUERIES[0]);
  const [out, setOut] = useState<string>("");
  const [rows, setRows] = useState<{ columns: string[]; rows: Record<string, string | number | null>[] } | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (query: string) => {
    setBusy(true);
    setOut("");
    setRows(null);
    try {
      const res = await fetch("/api/lab/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: query }),
      });
      const json = await res.json();
      if (json.ok) {
        setRows({ columns: json.columns, rows: json.rows });
        setOut(`${json.rows.length} row(s) from ${json.table} · ${json.note}`);
      } else {
        setOut(json.error || "Query failed");
      }
    } catch (err) {
      setOut(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="pt-lab-lede">
        SELECT against <code>ck_orders</code>, <code>ck_sales</code>, <code>ck_outlet_details</code>, <code>ck_productdetails</code>. Writes are rejected. This is an in-memory mock, not PostgreSQL in production.
      </p>
      <div className="pt-lab-examples">
        {EXAMPLE_QUERIES.map((q) => (
          <button key={q} type="button" className="pt-chip" onClick={() => { setSql(q); void run(q); }}>
            {q}
          </button>
        ))}
      </div>
      <label className="pt-lab-field">
        <span>SQL</span>
        <textarea value={sql} onChange={(e) => setSql(e.target.value)} spellCheck={false} rows={4} />
      </label>
      <div className="pt-lab-actions">
        <button type="button" className="pt-cta pt-cta--primary" onClick={() => void run(sql)} disabled={busy}>
          {busy ? "Running…" : "Run query"}
        </button>
      </div>
      {out ? <p className="pt-lab-status">{out}</p> : null}
      {rows ? (
        <div className="pt-lab-table-wrap">
          <table className="pt-lab-table">
            <thead>
              <tr>
                {rows.columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.rows.map((r, i) => (
                <tr key={i}>
                  {rows.columns.map((c) => (
                    <td key={c}>{r[c] === null || r[c] === undefined ? "∅" : String(r[c])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

function ArchitectureExplorer() {
  const [events, setEvents] = useState<ArchEvent[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [running, setRunning] = useState(false);
  const active = cursor >= 0 ? events[cursor] : null;

  const run = useCallback(() => {
    const sim = runDeltaSimulation();
    setEvents(sim);
    setCursor(-1);
    setRunning(true);
    let i = 0;
    const tick = () => {
      setCursor(i);
      i += 1;
      if (i < sim.length) {
        window.setTimeout(tick, 420);
      } else {
        setRunning(false);
      }
    };
    window.setTimeout(tick, 80);
  }, []);

  return (
    <div>
      <p className="pt-lab-lede">
        ERP / DMS → gateway → integration → Kafka → validate → PostgreSQL → platform → monitoring. Run a mock product-master delta. Kafka is the platform bus I work against — not infrastructure I built.
      </p>
      <div className="pt-arch-flow">
        {ARCH_NODES.map((n, i) => {
          const isOn = active?.nodeId === n.id;
          const done = events.findIndex((e) => e.nodeId === n.id) <= cursor && cursor >= 0 && events.some((e) => e.nodeId === n.id && events.indexOf(e) <= cursor);
          return (
            <div key={n.id} className="pt-arch-node-wrap">
              <button
                type="button"
                className={`pt-arch-node ${isOn ? "pt-arch-node--on" : ""} ${done && !isOn ? "pt-arch-node--done" : ""}`}
                onClick={() => {
                  const idx = events.findIndex((e) => e.nodeId === n.id);
                  if (idx >= 0) setCursor(idx);
                }}
              >
                <strong>{n.label}</strong>
                <span>{n.sub}</span>
              </button>
              {i < ARCH_NODES.length - 1 ? <span className="pt-arch-arrow">→</span> : null}
            </div>
          );
        })}
      </div>
      <div className="pt-lab-actions">
        <button type="button" className="pt-cta pt-cta--primary" onClick={run} disabled={running}>
          {running ? "Delta running…" : "Run a mock delta"}
        </button>
      </div>
      {active ? (
        <div className="pt-arch-log">
          <div className="pt-lab-kicker">{active.t} · {active.title}</div>
          <p>{active.detail}</p>
          <ol>
            {events.slice(0, cursor + 1).map((e) => (
              <li key={`${e.t}-${e.nodeId}`}>
                <code>{e.t}</code> {e.nodeId} — {e.title}
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <p className="pt-lab-status">Press run. Each hop writes a real mock event, not a CSS-only animation.</p>
      )}
    </div>
  );
}

function VoiceWorkflow() {
  const [scenario, setScenario] = useState<(typeof WORKFLOW_SCENARIOS)[number]["id"]>("qualify");
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [note, setNote] = useState("");
  const [shown, setShown] = useState(0);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    setSteps([]);
    setShown(0);
    setNote("");
    try {
      const res = await fetch("/api/lab/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      });
      const json = await res.json();
      const next = (json.steps ?? []) as WorkflowStep[];
      setNote(json.note ?? "");
      setSteps(next);
      let i = 0;
      const tick = () => {
        i += 1;
        setShown(i);
        if (i < next.length) window.setTimeout(tick, 380);
        else setBusy(false);
      };
      window.setTimeout(tick, 60);
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Request failed");
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="pt-lab-lede">
        Call → STT → RAG → qualification → response → outcome. Application layer only: conversation design, retrieved chunks, guardrails, writeback. The speech stack and the model are rented.
      </p>
      <div className="pt-lab-actions">
        {WORKFLOW_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`pt-chip ${scenario === s.id ? "pt-chip--on" : ""}`}
            onClick={() => setScenario(s.id)}
          >
            {s.label}
          </button>
        ))}
        <button type="button" className="pt-cta pt-cta--primary" onClick={() => void run()} disabled={busy}>
          {busy ? "Running…" : "Run workflow"}
        </button>
      </div>
      {note ? <p className="pt-lab-note">{note}</p> : null}
      <ol className="pt-flow-steps">
        {steps.slice(0, shown).map((step) => (
          <li key={step.id} className={`pt-flow-step pt-flow-step--${step.layer}`}>
            <div>
              <strong>{step.label}</strong>
              <em>{step.layer === "application" ? "own" : "rent"}</em>
            </div>
            <p>{step.body}</p>
            {step.data ? (
              <dl>
                {Object.entries(step.data).map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default memo(LabSection);
