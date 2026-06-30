# OC-000: Repository Evidence Extraction

## Role
You are an implementation engineer. Execute precisely. Do not make product/UX decisions.

## Workspace
- Output project: `/Users/jaskiring/Projects/singh-atlas`
- Repo clones: `/tmp/atlas-research/` (8 repos already cloned)

## Repositories (all jaskiring)
1. piku (public)
2. relive-cure-dashboard (private)
3. relive-cure-backend (private)
4. salesrep-ai (private)
5. sellina-api-proxy (private)
6. mitra-friend-only-messaging (public)
7. lasik-whatsapp-bot (public)
8. lead-intelligence (public)

## Task
Read EVERY repository deeply — not just READMEs. Inspect commits, branches, docs, ADRs, package.json, deployment configs, code structure, TODOs, parked features.

## Deliverables (write these files)

### 1. `content/evidence/repos.json`
Per repo:
- slug, visibility, primary_purpose (one sentence)
- problem_solved, constraints, architecture_summary
- tech_stack (from manifests, not guessed)
- branch_evolution (notable branches + what they contain)
- commit_themes (5-10 recurring themes from messages)
- documentation_quality (1-5 + note)
- media_assets (paths to png/gif/svg in repo)
- tradeoffs_documented (array of strings)
- failures_or_rewrites (from commits/docs)
- stable_decisions (things that didn't change)
- relationship_to_other_repos

NEVER include: secrets, tokens, endpoints, patient data, phone numbers, internal URLs with credentials.

### 2. `content/evidence/patterns.json`
Generate **40-50** recurring patterns across ALL repos. Categories:
- engineering
- product
- architectural
- communication
- decision_making

Each pattern:
```json
{
  "id": "P001",
  "category": "engineering",
  "pattern": "short name",
  "description": "one sentence",
  "evidence": [{"repo": "...", "source": "file or commit theme"}]
}
```

Do NOT copy patterns from any external brief. Infer only from repos.

### 3. `content/evidence/timeline-implicit.json`
NOT a date timeline. Stages discovered from repo evolution:
- stage name
- evidence repos
- what changed between stages

### 4. `docs/REPO-ANALYSIS.md`
Human-readable synthesis (max 2000 words):
- Who Jaskirat is as an engineer (from evidence)
- Strongest private repo evidence
- What to emphasize in Atlas vs de-emphasize
- What must never be exposed

## Constraints
- No fabrication. If unknown, say "unknown".
- Private repos are FIRST-CLASS evidence, not secondary.
- Do not create React components yet.
- Do not install npm packages yet.

## Acceptance
All 4 files exist, valid JSON, no secrets, patterns count >= 40.
