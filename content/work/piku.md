---
title: PIKU — Local-First AI Workspace Concept
slug: piku
kicker: Concept · passion project
github: https://github.com/jaskiringg/piku
live: null
download: /docs/piku.md
---

# PIKU — Local-First AI Workspace

**Status: concept and passion project.** PIKU is not shipped, not live, and not in production. It's an idea I keep coming back to, and a design I've prototyped far enough to learn where it breaks.

There's no product to show yet — a thesis, an architecture, and the parts I've built far enough to learn from.

---

## The thesis

**The model is replaceable; the understanding should not be.**

Every assistant I use optimises for how good a single answer sounds. None of them optimise for knowing me in six months. Each session starts cold. Context gets re-explained. The reasoning behind a decision I made in March lives in a chat log I'll never find again.

That's backwards. The model is the part that will be obsolete in a year. The accumulated understanding — what I'm working on, who I work with, what I already decided and why — is the part that should compound. PIKU is what it looks like if you build for that instead.

---

## What I'm designing

Not a chat window with memory bolted on. A workspace where the memory *is* the product and inference is a swappable engine.

| Idea | Why it matters |
|------|----------------|
| **A world model, not a transcript** | Structured understanding of projects, people and decisions — queryable, not a pile of past messages |
| **Local-first by default** | The understanding lives on your machine. Capability shouldn't cost you custody of your own context. |
| **Ambient, not a destination** | Invoked in a keystroke from wherever you are, instead of a tab you go and visit |
| **A swappable brain** | Local model for most things, a bigger one when the question earns it — and a switch that turns the second one off entirely |
| **Observation with consent** | It learns from what you actually do, and nothing enters the model without you agreeing to it |

---

## Where it stands

| | |
|---|---|
| **Prototyped** | Persistent memory and retrieval, a knowledge graph over it, the context pipeline that assembles a turn, local inference and embeddings, and connectors that pull in real work signals |
| **Designed only** | The observation loop's consent surface, document ingestion, personality-as-data, relationship history |
| **Decided and written up** | Why local-first, why a graph rather than flat recall, why embeddings get pinned, and when a cloud model is allowed in at all |

What the prototype taught me: retrieval quality collapses if you let weak extractions into the graph, so anything uncertain has to stay quarantined until it earns its place. That constraint shaped the whole design.

---

## The principle underneath it

Decide what compounds, make that the durable part, and treat everything else — including the model — as replaceable. That's how I approach systems generally; PIKU is the clearest version of it.
