---
title: PIKU
slug: piku
kicker: In progress · local-first AI workspace
github: https://github.com/jaskiringg/piku
live: null
download: /docs/piku.md
---

# Eko / PIKU

**Status: in progress / concept.** Not shipped. Not a production system.

A local-first personal AI workspace: persistent memory, retrieval, context assembly, agent workflows. The model is replaceable; the understanding should not be.

---

## Context

Cloud assistants forget between sessions. Notes, tasks and reference material sit in different apps. PIKU is the workspace I am building so context, memory and tools stay on the machine unless I choose otherwise.

## Problem

- Assistants drop thread state when a session ends.
- Retrieval without memory does not behave like a working set of knowledge.
- Cloud-only tools trade away custody for convenience.

## Role

Product designer and developer — personal project. No customer deployment, no production SLA.

## Architecture (direction, not a verified deployment)

```
User interface — React · TypeScript · Tauri
        ↓
Application and orchestration — Rust, tools, agent workflows
        ↓
Memory · Retrieval · World model (design) · Agents (design)
        ↓
Local model runtime — Ollama · local LLMs
```

This drawing is a direction. It is not a claim that the world model, the memory system, or autonomous agents are production-ready.

## Designed capabilities

1. **Persistent memory** across sessions.
2. **RAG** over local knowledge bases.
3. **Context assembly** for the task at hand, not a single chat window.
4. **Agent workflows** beyond Q&A — tools, steps, checkpoints.
5. **Local-first execution** with a swappable model runtime.

Present these as current design and build areas, not shipped features.

## Stack (documented)

Tauri · Rust · React · TypeScript · Ollama and local models

## Outcomes

In progress. The portfolio links the GitHub repo for architecture direction; there are no product screenshots because nothing is released yet.