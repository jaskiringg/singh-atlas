---
title: Eko / PIKU
slug: piku
kicker: In progress · concept
github: https://github.com/jaskiringg/piku
live: null
download: /docs/piku.md
---

# Eko / PIKU

**Status: in progress / concept.** Not shipped. Not a production system.

A local-first personal AI workspace: persistent memory, retrieval, context assembly, agent workflows. The model is replaceable; the understanding should not be.

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

1. Persistent memory across sessions
2. RAG over local knowledge
3. Context assembly for the current task
4. Agent workflows beyond question answering
5. Local-first execution

Present these as current design and build areas.

## Stack (documented)

Tauri · Rust · React · TypeScript · Ollama and local models
