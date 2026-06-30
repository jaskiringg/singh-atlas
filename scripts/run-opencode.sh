#!/usr/bin/env bash
# Run OpenCode for Atlas using FREE models by default.
# Usage: ./scripts/run-opencode.sh OC-000 "single string prompt"
#        ./scripts/run-opencode.sh OC-001 implement "prompt"   # uses mimo-v2.5-free
#        ./scripts/run-opencode.sh OC-000 analyze "prompt"     # uses deepseek-v4-flash-free
#        ./scripts/run-opencode.sh OC-000 ollama "prompt"        # uses nemotron via Ollama
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OC="${OPENCODE_BIN:-$HOME/.opencode/bin/opencode}"
TASK_ID="${1:?task id e.g. OC-000}"
MODE="${2:-implement}"
PROMPT="${3:?prompt as single string}"

case "$MODE" in
  implement) MODEL="opencode/mimo-v2.5-free" ;;
  analyze)   MODEL="opencode/deepseek-v4-flash-free" ;;
  code)      MODEL="opencode/north-mini-code-free" ;;
  nemotron)  MODEL="opencode/nemotron-3-ultra-free" ;;
  ollama)    MODEL="ollama/nemotron-3-ultra:cloud" ;;
  *)         MODEL="${OPENCODE_MODEL:-opencode/deepseek-v4-flash-free}" ;;
esac

LOG="$ROOT/.opencode-tasks/${TASK_ID}-run.log"
mkdir -p "$ROOT/.opencode-tasks"

echo "[$(date -Iseconds)] $TASK_ID mode=$MODE model=$MODEL" | tee -a "$LOG"

cd "$ROOT"
"$OC" run \
  --dir "$ROOT" \
  --dangerously-skip-permissions \
  --agent build \
  -m "$MODEL" \
  --title "$TASK_ID" \
  "$PROMPT" 2>&1 | tee -a "$LOG"
