# Atlas — Model Routing (zero Cursor credits)

## Priority order

| Task | Engine | Model | Cost |
|------|--------|-------|------|
| Components, CSS, boilerplate | OpenCode | `opencode/mimo-v2.5-free` | $0 |
| Analysis, patterns, docs | OpenCode | `opencode/deepseek-v4-flash-free` | $0 |
| Heavy synthesis | OpenCode | `opencode/nemotron-3-ultra-free` | $0 |
| Small utility | OpenCode | `opencode/north-mini-code-free` | $0 |
| Copy drafts (terminal) | Ollama API | `nemotron-3-ultra:cloud` | $0* |
| Ollama API fallback | Ollama local | `qwen3:4b` | $0 |
| GitHub metadata | Script | `extract-deterministic.sh` | $0 |
| Architecture, review | Cursor | (you) | credits |

\*Cloud Nemotron via API needs `export OLLAMA_API_KEY=...` from https://ollama.com/settings/keys  
Interactive `ollama run nemotron-3-ultra:cloud` works without the key.

## Commands

```bash
# OpenCode — implementation
./scripts/run-opencode.sh OC-001 implement "your prompt as one string"

# OpenCode — analysis (OC-000 style)
./scripts/run-opencode.sh OC-000 analyze "your prompt"

# Ollama — terminal synthesis
export OLLAMA_API_KEY=...   # optional, for cloud via API
./scripts/ollama-run.sh "Summarize these patterns..." nemotron-3-ultra:cloud content/draft.md
```

## Project config

`opencode.jsonc` in repo root overrides global GLM for Atlas work only.
