#!/usr/bin/env bash
# Deterministic GitHub evidence — no LLM. OpenCode enriches subjective fields.
set -euo pipefail
OUT="/Users/jaskiring/Projects/singh-atlas/content/evidence"
CLONE="/tmp/atlas-research"
mkdir -p "$OUT/raw"

REPOS=(piku relive-cure-dashboard relive-cure-backend salesrep-ai sellina-api-proxy mitra-friend-only-messaging lasik-whatsapp-bot lead-intelligence)

for repo in "${REPOS[@]}"; do
  echo "[$repo]"
  gh api "repos/jaskiring/$repo" --jq '{
    slug: .name,
    private: .private,
    description: .description,
    created_at: .created_at,
    updated_at: .updated_at,
    size_kb: .size,
    default_branch: .default_branch
  }' > "$OUT/raw/${repo}-meta.json"

  gh api "repos/jaskiring/$repo/languages" > "$OUT/raw/${repo}-languages.json" 2>/dev/null || echo '{}' > "$OUT/raw/${repo}-languages.json"
  gh api "repos/jaskiring/$repo/branches" --jq '[.[].name]' > "$OUT/raw/${repo}-branches.json" 2>/dev/null || echo '[]' > "$OUT/raw/${repo}-branches.json"
  gh api "repos/jaskiring/$repo/commits?per_page=20" --jq '[.[] | {date: .commit.author.date, msg: (.commit.message | split("\n")[0])}]' > "$OUT/raw/${repo}-commits.json" 2>/dev/null || echo '[]' > "$OUT/raw/${repo}-commits.json"

  if [ -d "$CLONE/$repo" ]; then
    find "$CLONE/$repo" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" \) \
      ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/icons/*" ! -path "*/puppeteer-session/*" 2>/dev/null \
      | sed "s|$CLONE/$repo/||" | head -30 > "$OUT/raw/${repo}-media.txt" || true
    find "$CLONE/$repo" -type f -name "*.md" ! -path "*/node_modules/*" ! -path "*/.git/*" 2>/dev/null \
      | sed "s|$CLONE/$repo/||" > "$OUT/raw/${repo}-docs.txt" || true
  fi
done

echo "Deterministic extraction done → $OUT/raw/"
