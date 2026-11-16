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

## Implementation

**Data architecture.** PostgreSQL tying leads, calls, recordings, transcripts, WhatsApp threads, AI analysis rows and timeline events.

**Matching and deduplication.** Raw telephony rows resolved to unique calls and associated with the correct lead — the engineering core of the platform.

**Services and UI.** Node.js APIs for ingestion and operations; React dashboard (screenshot below); Kotlin/Android where the field needed mobile.

**AI at the application layer.** Gemini for conversational routing and analysis — prompts, fallbacks and guardrails. Not a claim that I trained the model.

**Handover.** Runbooks, schema documentation and transfer to the client's internal team.

## Stack

Kotlin · Node.js · PostgreSQL · React · Gemini

## Outcomes

Built and transferred. This page shows the name and a real dashboard capture from the portfolio. Operating metrics, ad spend, response-time claims and production links are intentionally not published.

## Dashboard

![ReliveCure operator dashboard](/shots/relive-analytics.png)

*Operator dashboard — identifiers redacted.*