# Repo Analysis — Singh Atlas Evidence Layer

**Generated:** build-time from 8 repositories (gh API extract + pattern inference)  
**Source of truth:** repositories > this document

## Identity signal

Jaskirat Singh reads as **production operator first**, then enterprise integrator, then architect, then builder. Private repos (Relive, Salesrep, Sellina) carry the heaviest production signal. Public repos (PIKU, Mitra, LASIK, lead-intelligence) prove craft and iteration arc.

## Repository weights

| Repo | Weight | Why |
|------|--------|-----|
| relive-cure-backend | Critical | Live WhatsApp CRM, security, operator, Gemini agent |
| relive-cure-dashboard | Critical | Founder command center, KPI mappings |
| sellina-api-proxy | High | Enterprise platform boundary |
| salesrep-ai | High | Multi-tenant agentic design (GDD suite) |
| piku | Medium | Long-horizon product experiment, not identity hub |
| mitra-friend-only-messaging | Medium | Architecture purity — API enforcement |
| lasik-whatsapp-bot | Medium | Prototype → production arc |
| lead-intelligence | Supporting | Business logic in code |

## Pattern clusters

- **Operate (18):** defensive sync, operator routing, parked tracks, WhatsApp as CRM
- **Enterprise (9):** Sellina proxy, regional rollout, lead scoring, tenant design
- **Architect (10):** boundary enforcement, build-time evidence, dual-mode identity
- **Build (7):** PIKU local-first, canonical docs, UI polish branch
- **AI (6):** Gemini fallback, shadow mode, Bot Lab, agent versioning

## Atlas IA (implemented)

- **`/`** — SinghOS 3D command room (FPS walk + recruiter monolith)
- **Stations** — Operate, Enterprise, PIKU, Relive, Mitra, Brain (in-world terminals)
- **Never expose** — secrets, patient data, internal endpoints

## OpenCode note

OC-000 (deepseek-v4-flash-free) read raw evidence but hung on clone exploration. Evidence finalized via `atlas.json` + `scripts/build-content.sh`.
