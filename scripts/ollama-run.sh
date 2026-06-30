#!/usr/bin/env bash
# Direct Ollama API — zero Cursor credits. For copy synthesis / pattern drafts.
# Usage: ./scripts/ollama-run.sh "Your prompt" [model] [outfile]
#
# Cloud models (nemotron-3-ultra:cloud) need OLLAMA_API_KEY for /api/generate.
# Interactive `ollama run` works without the key; API does not.
# Fallback: local qwen3:4b if cloud unauthorized or unreachable.
set -euo pipefail

PROMPT="${1:?prompt}"
MODEL="${2:-nemotron-3-ultra:cloud}"
OUT="${3:-}"

ollama_generate() {
  local model="$1"
  local prompt="$2"
  local payload
  payload=$(python3 -c 'import json,sys; print(json.dumps({"model":sys.argv[1],"prompt":sys.argv[2],"stream":False}))' "$model" "$prompt")
  curl -sS http://127.0.0.1:11434/api/generate \
    -H 'Content-Type: application/json' \
    ${OLLAMA_API_KEY:+ -H "Authorization: Bearer $OLLAMA_API_KEY"} \
    -d "$payload"
}

result=$(ollama_generate "$MODEL" "$PROMPT" || true)

if [[ -z "$result" ]] || echo "$result" | grep -q '"error"'; then
  err=$(echo "$result" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("error","empty response"))' 2>/dev/null || echo "request failed")
  if [[ "$MODEL" != "qwen3:4b" ]]; then
    echo "Ollama $MODEL failed ($err). Falling back to qwen3:4b local." >&2
    MODEL="qwen3:4b"
    result=$(ollama_generate "$MODEL" "$PROMPT")
  fi
fi

text=$(echo "$result" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("response",""))')

if [[ -n "$OUT" ]]; then
  echo "$text" > "$OUT"
  echo "Wrote $OUT (model=$MODEL)"
else
  echo "$text"
fi
