---
title: Salescode — Enterprise Implementation & SCAI Voice Agent
slug: salescode
kicker: Consulting · integrations · SCAI voice agent
github: null
live: null
download: /docs/salescode.md
---

# Salescode — Enterprise Implementation

**Senior Technical Project Development Associate, Salescode.ai — July 2024 to now.**

Salescode builds ordering and field-sales software for brands like Coca-Cola. My job is making it work for each customer: I sit between the customer's business and our engineers, and I own the technical arc from the first workshop to production support.

Rollouts across **Thailand, the Philippines and North India.** The Thailand bottler accounts for roughly **20% of Coca-Cola consumption in Thailand** — that's the bottler's share of the market, and the scale of the engagement.

---

## The problem

The failure mode on an enterprise rollout is almost never "the REST call returned 500."

1. **Everyone has a different mental model.** Operations, sales, IT and the vendor each describe the same order step differently, using the same words for different things.
2. **Master data drifts after cutover.** Product, outlet, hierarchy and pricing records stop agreeing between the customer's systems and the platform.
3. **Integrations break weeks later, not on day one.** Event backlogs and non-idempotent consumers surface long after go-live.
4. **SIT passes, UAT breaks.** Happy paths work; real outlet hierarchies, promo stacking and legacy SKU aliases don't.
5. **Hypercare turns into heroics** when there are no runbooks.

---

## What I do

**Discovery.** I run requirement-gathering and workshops with business, sales, operations and IT — including onsite in Thailand. The Thailand engagement is where I learned the lesson that shaped everything after: the delays were alignment problems, not API bugs. Different teams used identical field names for different concepts. Workflow first, pipes second.

**Design and documentation.** I turn unclear requirements into designs both the customer and the engineers agree on — system flows, API contracts, data mappings, rollout plans. I write the BRDs and FRDs, change requests, user stories with acceptance criteria, and gap and impact analysis.

**Integrations.** I designed and implemented integrations with customers' ERP, DMS and field-sales systems over REST APIs, Kafka and SQL, including delta syncs and scheduled jobs for pricing, master data and stock.

**SIT, UAT, go-live, hypercare.** I own these as the customer's technical point of contact. I coordinate UAT, triage defects, run the cutover, and stay through stabilisation — tracing production failures to root cause with SQL, logs and AWS CloudWatch.

**Leaving it repeatable.** Runbooks and playbooks, so the next rollout isn't a rediscovery.

---

## SCAI voice agent

**SCAI is Salescode's enterprise AI voice agent.** I worked on deploying it at the **application layer** — not on the speech or LLM engines.

| What I owned | |
|---|---|
| **Integration planning** | How SCAI connects to the customer's systems — what it reads, where its outcomes land |
| **Expected call outcomes** | What a call is supposed to produce: qualified, escalated, handed to a human, or closed |
| **Guardrails** | What the agent may and may not say on a live call — the boundary that makes it safe to point at real customers |
| **Knowledge for RAG** | Section-wise chunking, so retrieval returns the right passage rather than the right document |
| **Context management** | What the agent carries turn to turn, and what gets re-retrieved |
| **Validation** | UAT and customer-readiness checks before voice features go live |

I worked against managed STT/TTS, LLM and retrieval services.

### Rent the infrastructure, own the application

Most teams treat "voice AI" as a vendor-selection problem. It isn't. The stack splits cleanly, and only one half decides whether the agent converts or burns leads:

| Layer | Own or rent |
|-------|-------------|
| Telephony / SIP | **Rent** — carrier physics and regulation |
| Speech-to-text | **Rent** — commodity, not a moat |
| LLM inference | **Rent** the inference; **own** the application design |
| Text-to-speech | **Rent** — quality-sensitive, not proprietary |
| Expected outcomes, guardrails, retrieval context, escalation, CRM writeback | **Own** — this is the work |

The hard meetings are never "which STT API." They are: who owns the qualification fields, what happens on partial capture, when does the agent escalate, and how does a call write back to the same record the other channels use. Those are application decisions, and those are the ones I was in.

The engines themselves — telephony, speech, the foundation models — are platform-managed. My work was the layer above them, which is the layer that decides whether the thing is safe to put in front of a customer.

---

## What it resolved

| Before | After |
|--------|-------|
| Teams describing the same workflow four different ways | One agreed set of flows, contracts and mappings signed off by business and engineering |
| Pricing, master data and stock moved by hand between systems | Delta syncs and scheduled jobs over REST, Kafka and SQL — **manual intervention cut ~35%** |
| Production issues handled as one-off heroics | Root-cause tracing through SQL, logs and CloudWatch, written up as runbooks |
| Every rollout rediscovering the same ground | Playbooks and validation checklists that carried across three countries |
| Voice features shipped on vibes | Defined call outcomes, explicit guardrails and UAT before anything reached a live customer |

---

## How much it helped

| | |
|---|---|
| Countries live | **3** — Thailand, Philippines, North India |
| Manual intervention on integrated workflows | **Cut ~35%** |
| Scope of the Thailand engagement | A bottler accounting for **~20% of Coca-Cola consumption in Thailand** |
| SCAI | **Deployed** — integration, outcomes, guardrails, RAG context, UAT |

"Live across three countries" means production rollouts reached go-live with field and back-office teams working on the platform — not that every module is identical across regions.

---

## How I debug

| Domain | How I work it |
|--------|---------------|
| **REST** | Reproduce, compare the contract against the actual payload, check auth and context, fix the mapping or the upstream |
| **Kafka** | Lag metrics, then consumer logs, find the non-idempotent handler, replay from a safe offset after the fix |
| **SQL** | Row-level diff against the source, trace the last successful sync, fix the transform or schedule a catch-up |
| **Payload mapping** | Golden-file comparison against known-good samples, then regression in SIT |
| **CloudWatch / logs** | Time-boxed query around the incident, correlate API → bus → DB timestamps, find the bottleneck layer |

**A typical incident:** a field rep can't sync an order. The symptom is an API timeout. Underneath it is consumer lag, and underneath that a stale master record from a dropped delta update. The fix is patch, replay, and make the failure mode impossible to recur silently. The bug was a design decision from months earlier, not a one-line mistake — that's usually how it goes.

---

## The field surface

![Coke Buddy field-sales screen from Thailand rollout](/shots/salescode-coke-buddy.png)

*Coke Buddy — the field-rep surface in a bottler retail-execution rollout.*

---

## How I work

I use Claude Code and ChatGPT across requirements analysis, data-mapping drafts, SQL validation, test scenarios and documentation. They make the work faster; the decisions and the customer outcome stay mine, and I review every output.
