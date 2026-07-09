# Execution Contract — Singh Atlas

## Shipped stack

| Layer | What |
|-------|------|
| **`/`** | SinghOS 3D room (R3F, FPS, bloom) |
| **Evidence** | `atlas.json` + `raw/` + `build-content.sh` |
| **Deploy** | Docker → nginx:8080 → Railway |
| **OpenCode** | Free models via `run-opencode.sh` |

## Task status

| ID | Status | Notes |
|----|--------|-------|
| OC-000 | Superseded | `build-content.sh` + Cursor `atlas.json` |
| OC-001 | Done (partial) | Scaffold; 3D built in Cursor |
| **3D room** | **Done** | `components/game/*` |
| **Evidence** | **Done** | 8 repos, 45 patterns |
| **Build** | **Passes** | `npm run build` |

## Model routing

See `docs/MODEL-ROUTING.md`. Cursor = review + architecture only when possible.

## Never ship

Secrets, patient data, Sellina tokens, internal Railway env.
