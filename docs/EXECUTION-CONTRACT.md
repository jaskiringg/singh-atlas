# Atlas — Execution Contract

## Engines

| Engine | Role | When |
|--------|------|------|
| **Cursor (this agent)** | Creative Director, Staff Engineer review, ARD, specs, integration | Always owns quality |
| **OpenCode** | Implementation, extraction synthesis, components, scripts, tests | After spec exists |
| **Ollama / Nemotron** | Terminal synthesis via `scripts/ollama-run.sh` | Copy drafts; cloud needs `OLLAMA_API_KEY` for API |
| **Deterministic scripts** | `scripts/extract-deterministic.sh` — gh API, no tokens | Every build |

## OpenCode (free models only)

```bash
./scripts/run-opencode.sh OC-XXX analyze "single string prompt"
./scripts/run-opencode.sh OC-XXX implement "single string prompt"
```

Models: `mimo-v2.5-free` · `deepseek-v4-flash-free` · `nemotron-3-ultra-free` · `north-mini-code-free`  
See `docs/MODEL-ROUTING.md` and `opencode.jsonc`.

## Ollama (terminal)

```bash
./scripts/ollama-run.sh "prompt" nemotron-3-ultra:cloud
```

Cloud API requires `OLLAMA_API_KEY`. Falls back to local `qwen3:4b` if unauthorized.

## Task queue

| ID | Status | Owner |
|----|--------|-------|
| OC-000 | Running (deepseek-v4-flash-free) | OpenCode — evidence + patterns |
| OC-001 | Pending | OpenCode — Next.js scaffold (after ARD) |
| ARD-001 | In progress | Cursor — Architecture Review Document |

## Review checklist (every OpenCode PR)

- [ ] No secrets in diff
- [ ] Matches spec acceptance criteria
- [ ] Lighthouse impact considered
- [ ] Naming consistent with Atlas design system
- [ ] Would Apple/Linear ship this?
