#!/usr/bin/env bash
# Split atlas.json → OC-000 output files (no LLM)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
python3 <<'PY'
import json
from pathlib import Path

root = Path("/Users/jaskiring/Projects/singh-atlas")
atlas = json.loads((root / "content/evidence/atlas.json").read_text())
ev = root / "content/evidence"

(ev / "repos.json").write_text(json.dumps({"repos": atlas["repos"]}, indent=2) + "\n")
(ev / "patterns.json").write_text(json.dumps({"patterns": atlas["patterns"], "count": len(atlas["patterns"])}, indent=2) + "\n")
(ev / "timeline-implicit.json").write_text(json.dumps({"timeline": atlas["timeline"]}, indent=2) + "\n")
print(f"repos={len(atlas['repos'])} patterns={len(atlas['patterns'])} timeline={len(atlas['timeline'])}")
PY
