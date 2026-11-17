---
title: ReliveCure
slug: relivecure
kicker: Freelance · call intelligence · transferred
github: https://github.com/jaskiringg/relive-cure
live: null
download: /docs/relivecure.md
---

# ReliveCure

**Transferred to their team.** I built this platform, then handed it over. I do not operate it now. There is no production URL on this page.

Call intelligence and lead lifecycle — one system of record when new business arrives through ads, messaging, telephony and rep dialling at once.

---

## Context

Freelance engagement for a client whose pipeline was multi-channel: Meta Ads, WhatsApp, voice IVR, sales-rep calls and stored recordings. Each channel had its own tool. Operations needed one timeline per person, not five tabs.

## Problem

- The same lead could appear multiple times with no shared identity.
- Raw call rows did not always map cleanly to a unique call or the right lead.
- Reps could not see prior contact before dialling again.
- Leadership could not read qualification and follow-up context from a single dashboard.

## Role

Independent developer end to end: PostgreSQL data model, ingestion and matching logic, AI-assisted processing at the application layer, operator dashboard, mobile surfaces where needed, and structured handover. I integrated Gemini; I did not build the foundation model.

## Architecture

```
Meta Ads · WhatsApp · Voice IVR · Rep calls · Recordings
                    ↓
        Ingestion · identity resolution · dedupe
                    ↓
     AI-assisted processing (transcripts · routing context)
                    ↓
   Unified CRM timeline — leads · calls · events · analysis
```

## Pulse — live operations

**Pulse** is the day-of command view operators actually used:

- **KPI strip** — calls, connect rate, missed, pipeline, winback, needs-you count, floor attendance.
- **Health pills** — CRM push, bot status, model quota, sync latency (so ops know the pipes are alive).
- **Call activity** — intraday bars (1h / 30m / 15m) coloured by connected vs missed.
- **By rep** — calls, unique leads, talk time, connect %, flags (names redacted in portfolio shots).
- **Needs you** — priority queue with idle-time and follow-up debt, not a static export.
- **The flow — today** — live funnel: WhatsApp in → bot → qualified → pushed → follow-up → consulted → closed.
- **Recent signals** — score jumps, call raised, new concern flags on the timeline.

The sidebar tied the same data model to Pipeline, WhatsApp chat backlog, Tasks, Analytics, Bot Lab, IVR, rep app and settings — one product, not a pile of sheets.

## Implementation

**Data architecture.** PostgreSQL tying leads, calls, recordings, transcripts, WhatsApp threads, AI analysis rows and timeline events.

**Matching and deduplication.** Raw telephony rows resolved to unique calls and associated with the correct lead — the engineering core of the platform.

**Services and UI.** Node.js APIs for ingestion and operations; React dashboard (screenshots below); Kotlin/Android where the field needed mobile.

**AI at the application layer.** Gemini for conversational routing and analysis — prompts, fallbacks and guardrails. Not a claim that I trained the model.

**Handover.** Runbooks, schema documentation and transfer to the client's internal team.

## Stack

Kotlin · Node.js · PostgreSQL · React · Gemini

## Outcomes

Built and transferred. This page shows real UI captures with **identifiers, rep names, lead names, locations and the production hostname removed**. Operating metrics, ad spend and response-time claims are not published as portfolio figures.

## Screenshots (redacted)

![ReliveCure Pulse dashboard](/shots/relive-pulse-web.png)

*Pulse — same-day ops view. Rep/lead columns and handoff labels masked.*

![ReliveCure analytics](/shots/relive-analytics.png)

*Analytics view — identifiers redacted.*