---
title: Salescode AI × Coca-Cola
slug: salescode
kicker: Flagship · integrations · SCAI application layer
github: null
live: null
download: /docs/salescode.md
---

# Salescode AI × Coca-Cola

**Senior Technical Project Development Associate, Salescode.ai — July 2024 to now.**

Salescode builds ordering and field-sales software for brands like Coca-Cola. I implement it for each customer: I sit between the customer's business and engineering, and I own the technical arc from the first workshop to production support.

I did **not** build the Salescode platform, its Kafka infrastructure, or the STT / TTS / LLM engines.

Rollouts across **Thailand, the Philippines and North India.** The Thailand bottler accounts for roughly **20% of Coca-Cola consumption in Thailand** — that's the bottler's share of the market, and the scale of the engagement.

---

## Context

Enterprise ordering, distribution and field-sales implementations. One major project was a wholesaler-to-retailer ordering platform for that Thai bottler.

## Problem

What had to stay consistent across systems:

- Product and outlet masters
- Distributor and sales hierarchies
- Pricing and discounts
- Stock
- Retailer and wholesaler orders
- Incremental changes from source systems

Disconnected workflows and hand-moved data are how those records drift.

## Role

Discovery, mappings, integrations **on** the Salescode platform, SIT/UAT, go-live, hypercare. Customer-facing technical point of contact.

## Architecture

```
Customer ERP / DMS / field-sales
        ↓
REST · Kafka-based flows · scheduled jobs
        ↓
Integration and transformation
field mapping · customer rules · delta sync · validation
        ↓
Salescode ordering and distribution platform
```

SCAI sits beside this as an application-layer voice agent on managed speech, LLM and retrieval services.

## Implementation

**Discovery.** Requirement-gathering and workshops with business, sales, operations and IT — including onsite in Thailand. Existing and target workflows. Implementation plans. Dependencies, field mappings, transformation rules, validation scenarios.

**Integrations on the platform.** REST, Kafka-based flows, SQL validation and reconciliation, source-to-destination mapping, delta sync, scheduled jobs, customer-specific transformation.

**SIT, UAT, go-live, hypercare.** Postman, SQL validation, defect triage, cutover, CloudWatch and application logs, runbooks, SOPs, knowledge transfer.

SIT can pass on the happy path. UAT is where hierarchy, promo stacking and legacy aliases fail.

## SCAI — application layer

Salescode's enterprise AI voice agent. I worked at the **application layer**.

| What I owned | |
|---|---|
| **Integration planning** | What it reads, where outcomes land |
| **Expected call outcomes** | Qualified, escalated, handed to a human, or closed |
| **Guardrails** | What the agent may and may not say |
| **Knowledge for RAG** | Section-wise chunking |
| **Context management** | What is carried turn to turn |
| **Validation** | UAT before voice features go live |

I worked against managed STT/TTS, LLM and retrieval services. I did not build those engines.

## Stack

REST · Kafka (platform bus) · SQL · Postman · CloudWatch · SCAI application layer

## Outcomes

Production rollouts reached go-live across three countries, with field and back-office teams working on the platform. Percentage reductions in manual intervention are **not published here** until a figure is tied to one implementation.

## The field surface

![Coke Buddy field-sales screen from Thailand rollout](/shots/salescode-coke-buddy.png)

*Coke Buddy — the field-rep surface in a bottler retail-execution rollout.*
