# Portfolio rebuild — handoff / dev doc

Last updated: 2026-06-30. Author context: rebuilt with Claude Code. This doc lets any
session (or you) pick up without re-deriving everything. Read `docs/POSITIONING.md` first —
it's the canonical brief for every design/copy decision.

---

## 1. Snapshot

- **What:** personal portfolio for Jaskirat Singh. Dark, minimal, premium, *animated technical
  artifacts that demonstrate rather than describe*.
- **Repo:** `/Users/jaskiring/Projects/singh-atlas` (Next.js 15, App Router, React 19, TS).
- **Run:** `npm run dev` → http://localhost:3456 (a dev server is usually already running on 3456).
- **Deploy target:** static export / Railway (Docker + nginx). `next.config.ts` + `railway.json` exist.
- **No backend.** All content is hand-authored in `lib/site-content.ts`. No DB, no API calls.

### Identity / thread (use everywhere)
> **"I translate business operations into production-ready systems — then stay to make sure those
> systems succeed."**

Self-label: **Systems Builder**. Three personas = three ways he creates value:
**Consultant** (in front of the customer) · **Builder** (in the system) · **Operator** (owns production).
NOT "management consultant", NOT "just a developer". Target roles: Solutions Consultant,
Implementation Consultant, Customer Success Engineer, Solutions Engineer, Business Systems Analyst,
Enterprise SaaS delivery.

---

## 2. Design system (`app/globals.css`)

- Pure CSS, no Tailwind/UI lib. Token-driven via CSS vars on `:root`.
- **Light + dark mode** (added in v2): tokens defined under `[data-color-scheme="dark"]` (default) and
  `[data-color-scheme="light"]`. A toggle (`components/site/theme-toggle.tsx`) flips it + persists to
  `localStorage('singh-atlas-theme')`; an inline script in `app/layout.tsx` sets it pre-paint (no flash).
  Every color MUST be a token so both modes work — never hardcode hex in components.
- **Accent themes via `data-theme` on a section:**
  `consultant` = blue · `builder` = green · `operator` = amber (each has dark + light values).
- **Layout system:** `.band` / `.band-muted` / `.band-accent` full-bleed sections give the continuous
  scroll rhythm; `.card` / `.card-accent` for boxed content; `.hl` / `.hl-accent` for inline text highlights.
- **Fonts:** Geist Sans (headings) · Inter (body) · JetBrains Mono (code/labels) — vars
  `--font-heading` / `--font-body` / `--font-mono`, wired in `app/layout.tsx`. Inter + JetBrains come from
  `next/font/google` (needs network on first dev compile — see gotchas).
- **Scroll reveal:** any element with `data-reveal` starts hidden; `components/site/scroll-reveal.tsx`
  (one IntersectionObserver) adds `.in` when it enters view. Staggered child animations key off
  `[data-reveal].in .child { animation-delay: calc(var(--d) * Xs) }` where `--d` is the child index.
- `prefers-reduced-motion` disables packets, pulses, reveals.

---

## 3. File map

```
app/
  layout.tsx          fonts + metadata (title "Jaskirat Singh — Systems")
  globals.css         entire design system + all component CSS
  page.tsx            the whole single-page site (composition of all sections)
components/site/
  nav.tsx             fixed top nav (client; adds .scrolled). Links: consultant/builder/operator/communicate/contact
  scroll-reveal.tsx   IntersectionObserver → .in
  frame.tsx           screenshot placeholder frame (pass src to show a real image from /public)
  pipeline.tsx        ★ animated SVG data-flow (packets travel spine, pulsing kafka, fail/root/fixed states)
  terminal.tsx        scroll-typed terminal (uses terminalLines)
  code-panel.tsx      ★ client; tabbed SQL/API/Kafka with a tiny inline token highlighter
  deck.tsx            animated consulting deck (slides reveal staggered)
  communicate.tsx     ★ client; doc cards → blurred-but-realistic preview pane
  theme-toggle.tsx    client; light/dark switch, persists to localStorage
lib/
  site-content.ts     ★ SINGLE SOURCE OF TRUTH for all copy/data
docs/
  POSITIONING.md      canonical brief (read first)
  HANDOFF.md          this file
```
★ = the load-bearing pieces.

### Page section order (`app/page.tsx`)
1. **Hero** — identity, the thread sentence, three-persona teaser.
2. **Lifecycle** (`#lifecycle`) — 13-stage ribbon, discovery → production support.
3. **Consultant** (`#consultant`, theme consultant) — Salescode flagship blurb + `discoveryFlow` Pipeline + `Deck` + capability wall.
4. **Builder** (`#builder`, theme builder) — `Terminal` + `integrationFlow` Pipeline + `CodePanel` + `aiFlow` Pipeline + PIKU card + capability wall.
5. **Operator** (`#operator`, theme operator) — `operatorLifecycle` ribbon + `debugTrace` Pipeline + Relive (`reliveFlow` Pipeline + metrics) + capability wall.
6. **Communicate** (`#communicate`) — `Communicate` component (cards + blurred doc preview).
7. **Ways of thinking** (`#thinking`) — `principles`.
8. **Operating timeline** (`#path`) — `timeline` (CAW Studios → … → Future).
9. **Curated GitHub** (`#github`) — `repoGroups`, grouped, not a dump.
10. **Contact** (`#contact`) + footer.

---

## 4. DONE ✅

- **v9 — voice quotes + asymmetric layout + recruiter card (2026-07-03):** owner's diagnosis after
  v8: page still read "vanilla" because every scene followed the identical eyebrow → title →
  subtitle → one centered box template, ten times in a row. This pass targets layout variety and
  gets Jaskirat's real first-person voice (already added to `lib/site-content.ts` as `voiceQuotes` /
  `anchorQuote` / `quoteFor(tag)` / `recruiterCard`) onto the page verbatim.
  - **New `components/site/pull-quote.tsx`:** oversized accent-colored quote-mark glyph + large
    serif-weight text, no card/border — `size="lg"|"xl"` props. New CSS: `.pull-quote`,
    `.pull-quote--lg`, `.pull-quote--xl`, `.inset-quote` (left-border + italic register for quotes
    inside existing prose), `.quote-strip` (small standalone section padding), `.scene-anchor`
    (the one deliberate `min-height: 70vh` exception to v8's content-sized rule).
  - **New full-width `#anchor` scene** right after the hero: `anchorQuote` alone, huge, centered,
    ~70vh of breathing room — a deliberate pause before `#approach`.
  - **New small `#reality` scene** right under it: the `hero`-tagged quote (title vs. reality,
    the funny one) as its own quote-strip.
  - **New `#loop` quote-strip** between `#approach` and `#work`: the `loop`-tagged quote (the
    thesis tying professional + personal together).
  - **New `#builder-voice` quote-strip** between `#work` and `#ai`: the `builder`-tagged quote as
    connective tissue.
  - **`#approach` scene:** both `approach`-tagged quotes (annoying questions / thinks in diagrams)
    now render as `.inset-quote` blocks between the vision copy and the phases row.
  - **`components/site/work-tabs.tsx`:** each case panel now renders `quoteFor(c.id)` (only
    `salescode` and `incident` have tags, so `integration`'s panel gets none) as an `.inset-quote`
    between `.didlist` and `.outcome` — visually distinct register (left accent border + italic)
    from the surrounding case-study prose. Non-destructive: still uses the existing
    `.worktab-panel` mount animation, no `data-reveal` added to remounted content (the v7 bug stays
    fixed).
  - **`#ai` scene:** the `ai`-tagged quote now sits above the 4 example cards (replacing the old
    plain subtitle sentence), featured via `<PullQuote size="lg">`.
  - **Personal section (`app/page.tsx`, was `builds.map`):** restructured. Opening statement is now
    the `personal`-tagged quote (verbatim, replacing `personalIntro` — the export stays in
    `site-content.ts`, now unused/dead like `flagship`/`engagements`, harmless). PIKU is pulled out
    of the loop into its own `.vibe-build.featured` block (bigger heading via CSS, screenshot +
    `piku`-tagged inset quote + `KnowledgeGraph`). Relive Cure and MandiBhai render in a new
    `.vibe-secondary` 2-col grid below it; Relive Cure's block gets the `relive`-tagged inset quote
    next to its screenshot.
  - **`#path` scene:** the `path`-tagged quote now sits as an intro line above the timeline grid.
  - **Asymmetric layout pass (the core fix):**
    - Hero persona cards: `.hero-cards .hero-card:nth-child(1/2/3)` get staggered
      `translateY` offsets (±10-14px) at ≥761px, with the middle "Builder" card emphasized
      (thicker top border, richer background, slightly more padding) since it's his core skill —
      replaces the flat identical row.
    - `#ai` example cards: `.ai-examples li:nth-child(1)` spans 2 columns with larger padding at
      ≥1100px (bento layout) — the other 3 stay compact. Mobile/tablet untouched (still stacks).
    - `components/site/communicate.tsx` doc grid: `.commcards .commcard:nth-child(1)` (Executive
      PPT) spans 2 columns with a larger title at ≥640px via new CSS only — no component change
      needed since the grid was already `auto-fit`.
    - Repo cards: added `featured?: boolean` to `RepoCard` in `lib/site-content.ts`, set `true` on
      `piku` and `relive-cure` (flagship + the live product). `app/page.tsx` adds `.featured` to
      the anchor's className when set; CSS spans those cards 2 columns at ≥700px via
      `grid-auto-flow: dense`.
    - Personal section: see restructure above — PIKU reads as the flagship instead of visually
      identical to the other two builds.
  - **New `components/site/recruiter-card.tsx`:** the `recruiterCard` export rendered as a
    business-card/ID-badge artifact (role, `lookingFor` tags, `proof` bullets, `basedIn`, a small
    "live" status dot) — fixed ~300px width, not full-bleed. Placed inside the hero via a new
    `.hero-layout` 2-col grid (text left, card right on desktop; card stacks below the hero copy
    under 980px) so a recruiter gets the 20-second version with zero scrolling.
  - **New `components/site/count-up.tsx`:** client, IntersectionObserver-triggered, animates any
    metric string (`"3"`, `"8,800"`, `"100+"`, `"Live"`, `"5"`) from 0 to its final value on first
    scroll-into-view; non-numeric strings (`"Live"`, `"E2E"`) render as-is immediately since
    there's nothing to count. Snaps straight to the final value under
    `prefers-reduced-motion: reduce` (checked both on mount and inside the IO callback path).
    Wired into every `.metric .n` render — currently just `reliveCase.metrics` in the personal
    section (the only place `.metric` renders in `page.tsx`; `flagship.metrics` is unused/dead,
    confirmed via grep, so there was no second call site to wire).
  - **`components/site/quick-nav.tsx`:** added a thin vertical progress line behind the dots
    (`.quicknav-track` static background line + `.quicknav-fill` height-percentage overlay) driven
    by a new, separate `scroll`/`resize` listener computing
    `scrollY / (scrollHeight - innerHeight)` — does not touch the existing IntersectionObserver
    active-section logic or the dot click-to-jump anchors. Added `"anchor"` to the `STOPS` list
    (existing hard rule allows adding stops, not changing click/observer behavior). Reduced-motion
    block gets `.quicknav-fill { transition: none }` (the fill still reaches the right height
    instantly, just without the animated interpolation).
  - **Verified:** `npx tsc --noEmit` clean. Dev server restarted clean (`.next` wiped), `curl`
    returns 200, `/tmp/singh-dev.log` shows only successful compiles/200s. Confirmed via HTML
    fetch: `#anchor`/`#reality`/`#loop`/`#builder-voice` all present exactly once each,
    `recruiter-card` markup renders in the hero, `repocard featured` appears exactly twice (piku,
    relive-cure), `vibe-build featured` once, `count-up` spans render for all `reliveCase.metrics`,
    `quicknav-fill` present. All 12 `voiceQuotes` + the `anchorQuote` are on the page verbatim
    (spot-checked several via grep against the raw HTML — apparent 2-3x counts per quote are just
    Next.js RSC flight-payload serialization duplicating props in the embedded hydration script,
    not actual duplicate renders).
  - **Deliberately skipped:** did not touch `nav.tsx`, `layout.tsx` theme bootstrap, or
    `quick-nav.tsx`'s existing click/observer behavior, per hard rules. Did not rewrite any quote
    text. Did not add a `featured` boolean to `commDocs` — the Executive PPT is always
    `commDocs[0]` in the source order, so an `nth-child(1)` CSS selector was simpler than a new
    data field with the same one-truth-in-source guarantee `repoCards.featured` needed (repos
    aren't ordered by importance, docs already are).

- **v8 — compression + directional motion + real screenshots + interactivity (2026-07-03):**
  - **Screenshots wired:** PIKU home (`public/shots/piku-home.png`) now renders in a 16/9
    `<Frame>` above the `KnowledgeGraph` in the personal `builds` loop (`app/page.tsx`, PIKU
    block). Relive Cure build gets its own 16/9 `<Frame src="/shots/relive-agent-console.png">`.
    Both use `.case-shot` with inline `aspectRatio: "16/9"` (MandiBhai keeps its 9/16 phone-shot
    frames unchanged). Salescode/Coca-Cola `cases[0].shot` in `lib/site-content.ts` stays
    commented out — file doesn't exist yet, pending Jaskirat.
  - **`#approach` + `#role` merged into one scene** (`id="approach"` in `app/page.tsx`): title is
    now "Same seat, start to finish." (kept over "I get deep into the problem first." — reads
    better once the lifecycle chips sit in the same scene). New `.approach-grid` (CSS, 2-col:
    vision copy left / `<PersonaLoop />` right, stacks under 900px) holds the vision copy +
    the "same seat" sentence; the 13-chip `.phases` lifecycle row spans full width below the
    grid. The old standalone `#role` scene is gone — one fewer full scene wrapper. `quick-nav.tsx`
    was untouched (its STOPS list never included `role`, so no update needed).
  - **`#thinking` converted from vertical list to an infinite marquee.** New CSS: `.marquee`
    (two `.marquee-row`s, `@keyframes marqueeLeft` / `marqueeRight`, `animation-play-state: paused`
    on `:hover`), `.marquee-pill` per principle. Content is duplicated (`[...principles, ...principles]`,
    reversed for the second row) for a seamless loop. Old `.principles` / `.principle` vertical-list
    CSS is left in place but now fully unused (harmless, matches the pre-existing "legacy list
    (unused)" `.principles-grid`/`.principle-card` comment already in the file). Scene height here
    drops from ~860px to roughly 260-300px.
  - **Spacing tightened globally:** `.scene` `padding-block` → `clamp(40px, 6vh, 64px)` (was
    `clamp(48px, 7vh, 84px)`); `.scene-head` `margin-bottom` → `clamp(20px, 4vh, 36px)` (was
    `clamp(28px, 5vh, 52px)`); `.phases` `margin-top` → 20px (was 28px). `.capwall` is dead CSS
    (not referenced anywhere in `page.tsx`) — left alone, out of scope.
  - **`#path` timeline → 2-column grid** above 900px: new `.optl-grid` class added alongside the
    existing `.optl` (`grid-template-columns: repeat(2, 1fr)`, single column under 900px). The
    `.now` highlight on the last item (PIKU/Future row) is untouched. Roughly halves the scene's
    height on desktop.
  - **`#ai` cards forced 4-across** at `min-width: 1100px` (`.ai-examples` media query) so the
    4 examples stay one short row on desktop instead of wrapping to 2+2.
  - **Directional motion pass** (`data-reveal` left/right/up/down) applied deliberately per
    scene: approach copy `left` + PersonaLoop `right`; lifecycle `.phases` `up` with per-chip
    `--d` stagger; `ai-examples` alternate `up`/`down` by index with `--d`; `work-tabs.tsx`
    worktabs bar now `data-reveal="left"` (tab panel content still has NO `data-reveal` — the
    documented remount bug still applies, untouched); personal `vibe-builds` (text + screenshots)
    `left`, metrics/interests `right`; timeline rows alternate `left`/`right` by index; contact
    scene switched from plain `data-reveal` to `data-reveal="up"` on all four elements. Repo
    cards (`#repos`) get `data-reveal="up"` with inline `transitionDelay: ${i * 60}ms` per card
    for a staggered entrance (existing `[data-reveal]` transition timing applies the delay
    directly — no new CSS needed for this one).
  - **Interactive polish:**
    - New `components/site/lightbox.tsx` (plain `useState`, fixed overlay, click-outside or
      Escape to close, locks `body` scroll while open). `components/site/frame.tsx` now renders
      `<Lightbox>` instead of a bare `<img>` whenever `src` is set — the placeholder path
      (`frame-ph`) is untouched. New CSS: `.frame-zoom-btn` (`cursor: zoom-in`, `scale(1.015)` on
      hover via `.frame:hover`), `.frame:has(.frame-zoom-btn:hover)` bumps `border-color` to
      `var(--accent-dim)`, `.lightbox-overlay` / `.lightbox-img` / `.lightbox-close` /
      `.lightbox-caption` with `lightboxFade` / `lightboxScale` keyframes (both respect both
      themes via existing tokens, no new hardcoded colors).
    - New `components/site/tilt-card.tsx` — small client wrapper, mouse-move parallax tilt
      (`rotateX`/`rotateY` max 4deg via inline transform, resets on `mouseleave`, guarded by a
      `matchMedia('(prefers-reduced-motion: reduce)')` check so it never applies a transform for
      reduced-motion users). Wraps all three hero persona cards in `app/page.tsx` in place of the
      plain `<div className="hero-card">`.
    - `.repocard:hover` already had an accent border-color change — confirmed present, no edit
      needed (task 4c was already satisfied).
  - **Reduced-motion block extended** (`app/globals.css`, end of file): added `.marquee-track
    { animation: none }`, `.frame:hover .frame-zoom-btn { transform: none }`,
    `.lightbox-overlay { animation: none }`, `.lightbox-img { animation: none }`.
  - **Verified:** `npx tsc --noEmit` clean. Dev server restarted clean (`.next` wiped), `curl`
    returns 200, `/tmp/singh-dev.log` shows only successful compiles/200s, no runtime errors.
    Confirmed via HTML fetch: `#role` id no longer present, `piku-home.png` +
    `relive-agent-console.png` both present in the markup, 28 `.marquee-pill` spans render
    (7 principles × 2 duplicated × 2 rows), `.optl-row` renders 14 times (7 timeline items,
    unchanged data — the 2-col CSS is what compresses height, not item count).
  - **Rough height estimate:** merging `#role` into `#approach` (~-250px), the marquee
    conversion (~-550px), the `.scene`/`.scene-head`/`.phases` spacing tightening compounded
    across 9 non-hero scenes (~-300px), and the 2-col timeline (~-350px) put total page height
    in the neighborhood of **8000-8300px at 1440px viewport** — down from 10503px, short of the
    ~7500px stretch target but a substantial cut; no screenshotting tool was available to
    measure precisely (per the existing "remote-Chrome black-past-4500px" gotcha), so this is
    arithmetic, not a direct measurement.
  - **Deliberately skipped / left for next pass:** did not attempt further scene consolidation
    beyond what was specified (e.g. merging `#ai` into `#communicate`) since the task list didn't
    ask for it and copy shouldn't be rearranged beyond the specified merges. Salescode/Coca-Cola
    screenshot remains unwired (file doesn't exist per task 1). Did not touch `nav.tsx`,
    `layout.tsx` theme bootstrap, or `quick-nav.tsx` behavior/STOPS list, per hard rules.

- Full three-persona restructure (replaced earlier Professional/Personal split).
- Identity reframed to "Systems Builder" + the thread sentence.
- **Links updated:** email `singhjass6404@gmail.com`, LinkedIn `https://www.linkedin.com/in/jaskiring`,
  GitHub `https://github.com/jaskiring` (also used for repo links).
- Deleted all dead Cursor experiments (game/os/trust/3d/cinema) + orphaned evidence layer (Sellina gone everywhere).
- **v6 — interactive artifacts on top of v5 (verified 2026-07-01):** four new components now render
  live in place of plain lists/removed flowcharts: `persona-loop.tsx` (clickable Consultant/Builder/
  Operator triangle, "click a persona to see what it feeds" — sits under the new "My approach" scene),
  `incident-trace.tsx` (the production-incident story as a clean vertical step log — deliberately NOT
  the old arrow-heavy Pipeline look), `arch-diagram.tsx` (the integration-layer diagram, assembled not
  a raw flowchart), `knowledge-graph.tsx` (PIKU's real node graph: Long-term Memory, Retrieval, Context,
  Reasoning, Planner, Vault, Agent, World Model, Evolution, Identity, Documents — finally answers the
  much earlier "make PIKU feel alive" ask). Content corrections captured from Jaskirat: MandiBhai =
  "Building now" — same-day wholesale, wholesalers sourced from the local mandi, retailers buy at
  wholesale prices and get goods same-day, whole flow shaped around that promise. PIKU status =
  "Building" (not "Flagship") — a personal OS to track what he's doing/thinking/learning. Salescode case
  now leads with playbooks/automations/integrations/requirement-gathering, not just code. Verified:
  HTTP 200, zero console errors, zero TS errors, hero-aurora confirmed actually animating via
  `getAnimations()` (`auroraDrift`, 26s), both themes screenshotted end-to-end and legible throughout
  (metrics cards, tags, knowledge-graph labels all pass contrast in light mode — earlier "light mode
  looks unfinished" complaint is resolved).
- **v5 — MIDNIGHT + VIOLET palette + classy motion:** repaletted all tokens (dark +
  light) to midnight blue-black base (`--bg #0a0b14`) with an electric-violet signature accent
  (`--pro #7c5cff`, default `--accent` now = `--pro`). Persona accents cohesive/cool: consultant blue
  `#5b8dff`, builder teal `#22c1a4`, operator violet `#a06bff`. Motion added: hero `.hero-aurora` (slow
  drifting violet radial glow, contained in hero — NOT fixed), directional reveals (`data-reveal="left"|
  "right"` slide-in from sides + blur clear), `.scene-ix .line` draws in, magnetic card hover lift,
  hero headline em in a static violet tint. Perf: an animated `filter: blur()` / `scale()` on the aurora
  FROZE the remote renderer — removed blur+scale, kept translate-only. Keep heavy filters off animated els.
- **v4 — EXAMPLE-DRIVEN, "cool tech not terminal tech":** user feedback — the site looked
  impressive but ABSTRACT (flowcharts show plumbing, not the person) and read "hacker." So: **removed
  ALL flow diagrams + the terminal + the code panel** (deleted `pipeline.tsx`, `terminal.tsx`,
  `code-panel.tsx`; flow data in `site-content.ts` now unused but harmless). Replaced with REAL EXAMPLES:
  `cases` = 3 case studies (Salescode×Coca-Cola = consulting·technical·delivery; the integration layer;
  a production incident as a narrative) each with context + "what I did" bullets + outcome + tags +
  screenshot frame. Plus `aiExamples` (concrete AI-in-delivery cards), richer `repoCards`
  (purpose/shows/stack — repos as evidence), and a `personal` "vibe" scene (PIKU/Relive/MandiBhai +
  interests). Kept Deck + Communicate (consulting deliverables — not flowcharts). Goal: a recruiter sees
  consulting+technical+delivery is real; a CTO/founder sees how he thinks. Sections: hero · what-i-do ·
  selected-work · ai · communicate · thinking · repos · personal · timeline · contact.
- **v3 — cinematic scenes:** page is full-viewport `.scene`s instead of a normal
  scroll. Each animated artifact sits in a `.stage` (grid: artifact + a `WhatWhy` annotation block that
  states *"What you're seeing" / "Why it's here"*). This is the user's core ask — cinematic + every
  artifact explained. CSS: `.scene` / `.scene-head` / `.scene-ix` / `.scene-title` / `.stage` / `.whatwhy`
  / `.ww` in `app/globals.css`. NOTE: scroll-snap was tried and removed — scenes exceed viewport height,
  so snap broke anchor nav. Don't re-add snap unless scenes become ≤1 viewport.
- **Design system v2:** light/dark mode + toggle (`theme-toggle.tsx`), token-driven colors,
  Geist/Inter/JetBrains type, bold hero, three color-coded persona hero-cards (still used in the hero scene).
- **Copy de-cocky pass:** removed every "vs other engineers" / put-down comparison. Keep it confident
  but about Jaskirat's own work — no "most engineers", no diminishing others. (Verified clean.)
- **Animated artifacts built & rendering** (verified, no console errors):
  - `Pipeline` used 5×: discovery, integration, AI, debug-trace, relive flows (packets animate, kafka pulses, root=red, fixed=green).
  - 13-stage lifecycle ribbon + 10-stage operator ribbon.
  - `Terminal` (scroll-typed), `CodePanel` (SQL/API/Kafka tabs + highlighter), `Deck` (staggered slides),
    `Communicate` (6 doc cards + blurred preview, e.g. "Slide 12 — Inventory Synchronization").
  - Ways of Thinking, Operating Timeline, Curated GitHub.

---

## 5. LEFT / TODO (prioritized)

- **v9 note:** nothing from the task list was skipped. Two judgment calls worth flagging for the
  next session: (1) `commDocs` did not get a `featured` field — the Executive PPT card is always
  `commDocs[0]`, so `nth-child(1)` in CSS was sufficient and avoids adding a data field that would
  just duplicate the array's existing order; revisit if `commDocs` ever gets reordered. (2) The
  `#reality`, `#loop`, and `#builder-voice` quote-strips are new full scenes with their own ids but
  were NOT added to `quick-nav.tsx`'s `STOPS` (only `#anchor` was) — they're short pauses meant to
  read as connective tissue rather than distinct destinations; add them as stops later only if user
  feedback says they need direct jump-to access.

- **v7 — copy de-AI pass + real assets + compression (2026-07-01, current):**
  - **Copy:** removed the repeated "X, not Y" contrastive pattern (was on ~6 headings — kept exactly
    one, the AI-scene title). Killed the verbatim-duplicate sentence between hero and contact
    ("I translate business operations into production-ready systems..." appeared twice near-identically
    — now two different sentences). Removed the "most people who can X can't Y" rule-of-three (reads as
    an implicit dig at unnamed others — user has explicitly flagged that pattern as unwanted before).
    Added concrete, specific detail in its place (times, durations, "three weeks earlier", "2am") — that's
    what actually reads human, not more contrastive rhetoric. Edited: `vision`, `personalIntro`, `builds`
    (PIKU/Relive), `reliveCase`, `aiExamples`, `cases[2].context`, and inline hero/role/ai/repos/path copy
    in `app/page.tsx`. `flagship` and `engagements` exports in `site-content.ts` are DEAD (imported
    nowhere) — left alone, harmless, could be deleted in a cleanup pass.
  - **Real screenshots — MandiBhai solved:** found a full pre-made screenshot set at
    `~/Documents/mandi bhai/mandi-bhai-demo/screenshots/` (login, catalogue, cart, wholesaler orders,
    order success — generic labels, no real PII). Copied 4 into `public/shots/mandibhai-*.png` and wired
    them into the "personal" scene next to the MandiBhai blurb (`app/page.tsx`, two-up grid via `Frame`).
  - **Real screenshot — PIKU:** it's Tauri+Vite; `npm run dev` inside `~/Documents/piku` serves a full
    working web preview at `localhost:1420` (no Tauri shell needed for the UI). Captured a real "Still up,
    Jaskirat" home screen — but the capture only exists as an inline chat image, NOT on disk (see gotcha
    below). **Jaskirat needs to save that image from the conversation and drop it at
    `public/shots/piku-home.png`**, then wire `src="/shots/piku-home.png"` into the PIKU `<Frame>` /
    `builds[0].shot`.
  - **Real screenshots — Relive Cure (Railway, `relive-cure-dashboard-production.up.railway.app`):**
    already has a saved login session in this browser profile, but as a RESTRICTED account (sidebar shows
    "Pulse is locked — pending admin approval"). Captured Analytics (aggregate KPIs, but the Employee
    Performance table shows real rep first names: Gaurav, Nishikant, Khushi, Aditya) and Chatbot
    (aggregate funnel/donuts are clean, but the live lead table row at the bottom shows a real
    name + message — "Heramb Studio" / "Hello! Can I get more info on this?"). **Both screenshots exist
    only in the chat, not on disk — same limitation as PIKU.** Before wiring either in: Jaskirat must
    decide whether to (a) use as-is, (b) crop/blur the names row, or (c) log in as founder/admin and
    re-capture a cleaner view. Do NOT wire these into the site without that decision — they contain real
    staff names and one real lead's message.
  - **Salescode / Coca-Cola:** deliberately did NOT attempt to log into or screenshot the actual
    enterprise implementation — it's an employer's confidential system, not something to capture for a
    public portfolio regardless of access. `salescode.ai` marketing site loads but hung on a spinner and
    wouldn't represent the actual work anyway. This case's `<Frame>` should stay a placeholder or get an
    AI-generated illustrative graphic instead (prompt given to Jaskirat separately, not stored in repo).
  - **"Too much scrolling" fix:** root cause was `.scene { min-height: 100svh }` applied to EVERY
    section regardless of content — a 4-item list was forced to fill a full screen. Fixed: only
    `.scene.hero` keeps `min-height:100svh` now; everything else sizes to content
    (`app/globals.css` — search "cinematic scenes"). Also **merged the 3-stacked case studies + 2
    duplicate full-size diagrams (IncidentTrace, ArchDiagram) into one interactive `WorkTabs` component**
    (`components/site/work-tabs.tsx`) — click a case title, one panel shows at a time, and the
    integration/incident diagrams now live INSIDE their matching tab instead of repeating the same story
    a second time below it. This alone cut the `work` scene from 4383px → ~1100px. Total page height
    13768px → 10503px (−24%) after both fixes.
  - **Interactivity added:** `components/site/quick-nav.tsx` — fixed right-edge dot index, IntersectionObserver
    highlights the active section, click any dot to jump (7 stops: hero/approach/work/ai/repos/personal/contact).
    Added a `[data-reveal="down"]` / `="up"` CSS variant (translateY ∓) alongside the existing left/right,
    for more varied entrance motion per the "things should come from sides/up/bottom" ask — not yet
    applied everywhere, only left/right are in active use in `page.tsx`; up/down are defined and ready to use.
  - **Bug fixed:** `WorkTabs` originally put `data-reveal="left"/"right"` on the per-tab content divs.
    Since `key={c.id}` forces a full remount on every tab switch, those divs kept re-entering the DOM in
    the hidden (`opacity:0`) state and never got re-observed by `ScrollReveal` (which unobserves after the
    first reveal) — switching tabs after the first view showed a BLANK panel. Fixed by removing
    `data-reveal` from remounted content and using a plain CSS mount animation (`.worktab-panel`,
    `@keyframes worktabIn`) instead. **Lesson: never put scroll-triggered `data-reveal` on content that
    can remount via a `key` change or conditional render — use a plain CSS enter animation there instead.**

### P0 — content authenticity (biggest impact, needs Jaskirat's input)
1. **Real screenshots — mostly wired as of v8.** PIKU (`public/shots/piku-home.png`) and Relive
   Cure agent console (`public/shots/relive-agent-console.png`) are now both live in the `#personal`
   scene via `<Frame>` (see v8 entry above). **Still pending:** Salescode/Coca-Cola —
   `cases[0].shot` in `lib/site-content.ts` stays commented out (`// shot:
   "/shots/salescode-coke-buddy.png"`) until Jaskirat saves that file to `public/shots/`; needs
   either nothing (keep placeholder) or an AI-generated illustrative graphic (do not attempt a
   real screenshot — confidential enterprise system).
2. **Verify every claim** in `lib/site-content.ts` is true (metrics, regions, stack). Some are reasonable
   inferences — confirm or correct. Especially the code snippets (make them resemble real work he did).
3. **Confirm repo names** in `repoGroups` (`lib/site-content.ts`) so GitHub links don't 404; hide/curate as desired.

### P1 — deepen the "show don't tell"
4. **Code highlighter is minimal** (`code-panel.tsx` regex). Optional upgrade: Shiki/Prismjs for real
   highlighting, or add more snippets (real anonymized SQL/JSON he's written).
5. **Communicate previews** are structural blur placeholders. Could swap in real (blurred) exports of
   his actual PPT/Confluence/architecture docs for authenticity — this is the "nobody else has this" card.
6. **PIKU** still mostly words. Brief asks for a "living" knowledge-graph visual (memory nodes, agents,
   relationships). Could add an animated graph component (SVG/canvas node constellation) in the Builder section.
7. **Architecture diagram** component — a real assembled-on-scroll system diagram (Linear/Stripe-grade),
   distinct from the linear Pipeline. Brief explicitly wants this for the integration story.

### P2 — polish / decisions to confirm with Jaskirat
8. **"The loop" (professional↔personal feedback)** was removed in the persona restructure. Decide whether to
   reintroduce as a Consultant↔Builder↔Operator interplay, possibly the literal intersecting-circles visual he sketched.
9. **Vertical spacing** is generous; tighten `section-pad` if it feels sparse vs "continuous".
10. **Remove unused deps:** `three`, `@react-three/*`, `postprocessing` are no longer used.
    `npm rm three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing @types/three`.
11. **SEO/OG image, favicon** review. Deploy.

---

## 6. Gotchas (will save the next session time)

- **`__webpack_modules__[moduleId] is not a function` (Runtime TypeError) = corrupted `.next` cache,
  not a code bug.** Happens when dev HMR chunks mix with old `next build` artifacts. Fix:
  `lsof -ti:3456 | xargs kill -9 && rm -rf .next && npm run dev -- -p 3456`.
- **"Internal Server Error" on localhost:3456 = stale/dead dev server, not a code bug.** A long-running
  `next dev` from before a big edit (or a `next build` artifact) can wedge. Fix: `lsof -ti:3456 | xargs kill -9`
  then `npm run dev -- -p 3456`. Confirm with `curl -s -o /dev/null -w "%{http_code}" http://localhost:3456/` → 200.
  Note `next/font/google` (Inter/JetBrains) fetches on first compile — needs network once.
- **Remote-Chrome screenshot paint ceiling:** on this tall (~8000px) page, the browser-automation
  screenshot tool renders **black past ~4500px** even though the DOM is correct. To *see* lower
  sections, run `document.documentElement.style.zoom='0.5'` in the page, screenshot, then reset
  `zoom=''`. The reveal animation also catches mid-fade — wait ~2s after scroll, or verify state via
  JS (`document.querySelectorAll('[data-reveal].in')`).
- A `position:fixed` body background previously broke paint + capture — keep backgrounds non-fixed.
- Dev (`next dev`) does NOT fail on TS type errors; run `npx tsc --noEmit` before deploy. Optional
  components are typed (`Engagement`, `PNode`, `Build`, `Snippet`) — keep new data typed to avoid
  `next build` union errors.
- Stagger animations need inline `style={{ ["--d" as string]: i }}` (TS cast) on each child.

---

## 7. How to edit content

Everything user-facing lives in **`lib/site-content.ts`**. Key exports:
`flagship`, `discoveryFlow`, `integrationFlow`, `aiFlow`, `debugTrace`, `reliveFlow`, `reliveCase`,
`lifecycle`, `operatorLifecycle`, `deckSlides`, `commDocs`, `codeSnippets`, `terminalLines`,
`consultantCaps`/`builderCaps`/`operatorCaps`, `builds`, `principles`, `timeline`, `repoGroups`.

- A flow diagram = a `PNode[]` (`{label, sub?, kind?}`; kind ∈ gateway|kafka|store|fail|root|fixed).
- To add an artifact to a persona: import its component in `app/page.tsx` and drop it inside that
  section's `data-theme` wrapper so it picks up the right accent.

---

## 8. History (why the structure is what it is)

The design went through several user-driven pivots (all good signal):
1. Killed the original vague "cinema" site + 3 abandoned 3D experiments.
2. Rejected: minimal mono "operator index" (too résumé), and a heavy node-graph hero (too generic/AI).
3. Landed on: minimal + continuous + screenshot-driven, then **two registers (Professional/Personal)**.
4. Rejected the "4 product cards" framing (undersell + a fictional project) → "Enterprise Systems & Engagements".
5. **Current:** rejected "looks like a management consultant" → **three personas + animated technical
   artifacts that demonstrate**, with the "translate ops → production, then stay" thread.

The throughline the site must protect: a hiring manager spends 3 minutes and thinks *"this person
actually builds and runs serious systems,"* because the page shows flows moving, code, traces, and
real deliverables — not paragraphs.
