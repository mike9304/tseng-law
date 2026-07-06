# WIX-PERFECT-PLAN — "완벽한 Wix" push (started 2026-05-29)

Goal (user): make this builder a *perfect Wix*. Plan + execute autonomously.
Working style (user): **max agents, all max thinking** (Opus 4.8 max-effort, inherited by sub-agents). Don't ask per-step; process the whole list in one session (see memory: `feedback_agent_autonomy`, `feedback_continuous_progress`, `feedback_codex_delegation`, `feedback_design_codex_split`).

## Ground truth (verified 2026-05-29, read-only)

- **Project root:** `/Users/son7/Projects/tseng-law` (Next.js, dev port 4311 `next dev --turbo`). Branch `main`. Working tree essentially **clean** (the 81 "dirty" entries are untracked planning `.md` docs + new folders `docs/qa/`, `ui-screens/`, nested `tseng-law/`, `taedong-law/`; only `.claude/settings.local.json` + one goal doc modified).
- **Scale:** src ≈ 1,830 ts/tsx (app 459, components 375, lib 996). `src/components/builder` 336 files; `src/lib/builder` 987 files incl. **130+ widget components** + **30 industry templates**. **80 admin surfaces** under `src/app/(builder)/[locale]/admin-builder/*`.
- **Builder surfaces:** `admin-builder` (main), `builder`, `builder-preview`. Editor in `src/components/builder/editor`, canvas in `src/components/builder/canvas` + `src/lib/builder/canvas`.
- **Coverage already implemented:** W01–W225 editor parity ("heavily implemented") + F01–F120 full-product layer — CMS, dynamic pages, forms→CMS, App Market, native apps (Blog/Events/Members/FAQ/Chat/Portfolio/Search), Stores/eCommerce (F53–66 green), Payments F67–74 (Stripe, refunds, invoices), Bookings F75–84, AI site builder F85–94. Recent: Waves 5–8 (payments/bookings → AI/CRM → collaboration cursors/threads → notification inbox).
- **Tooling:** `npm run` → dev, build, lint, typecheck (`tsc --noEmit`), test (vitest), test:e2e (playwright), **qa** (`node tests/qa-agent/run.mjs` — qwen2.5vl visual QA, target `tests/qa-agent/hojung-builder`), qa:visual, lighthouse/lhci, storybook, security:scan, knip, audit:w-layer/release, full `codex:*` orchestration suite.
- **Tracking docs:** `WIX-FULL-PRODUCT-GAP.md` (F-area gap map), `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-PARITY-ROADMAP.md`, `SESSION.md` (523KB / 5709 lines — grep, don't read whole), `G-EDITOR-COMPLETION-AUDIT.md`.

## Key interpretation of "perfect Wix" for THIS project

Breadth is largely done. The **dominant, repeated gap across hundreds of checkpoints (M166-AE…EJ) is "true screenshot/pixel design matching" — real VISUAL/DESIGN FIDELITY of (a) generated sites/templates and (b) the editor's own chrome — plus depth on shallow "first slices."** So the push is **quality/fidelity + depth-finishing, NOT more features.** Risk to avoid: agents adding *more shallow scaffolding* and false-green claims (the existing failure mode).

## Phased execution plan (resume here)

**Phase 0 — Baseline & stabilize (do FIRST).**
1. Health gate: `npm run typecheck`, `npm run lint`, `npm run test` (vitest), `npm run build`. Record pass/fail. Fix any red before touching features.
2. Run dev (`npm run dev`, port 4311). Screenshot the editor + 2–3 generated/template sites (use claude-in-chrome MCP or `npm run qa`). This is the only true read on *visual quality*.
3. Triage untracked: are nested `tseng-law/` & `taedong-law/` real or stray copies? Decide keep/remove (don't delete blindly — memory rule).

**Phase 1 — Max-agent ground-truth audit (fan out; docs are stale vs code).** One agent per subsystem, each returns {real gaps, severity, file map, visual-quality grade}:
editor/canvas+multiselect+layers · **design-system & generated-site visual fidelity (screenshot-based) ← highest priority** · templates (30) quality pass · CMS/dynamic · Stores · Bookings · Payments · AI builder · publish/hosting/domains · responsive/breakpoints · test/QA health & false-green hunt.

**Phase 2 — Synthesize prioritized plan + concrete acceptance criteria for "perfect Wix"** (measurable: lighthouse ≥ X, zero overlap/visual-QA defects on N pages, template design bar, etc.). Re-consult advisor here.

**Phase 3 — Execute** highest-value items via parallel agents with **git-worktree isolation** (they edit in parallel → conflicts otherwise). After each batch, main verifies: typecheck + lint + build + vitest + `npm run qa` visual gate. Loop until acceptance criteria met. Commit per coherent batch (branch off main; end commits with the required Co-Authored-By trailer).

## Notes / hard rules
- Design-heavy work → structure as Codex-style detailed prompts; feature/logic → Claude code agents (memory `feedback_design_codex_split`).
- Sub-agents may be denied Write to project paths → use inline raw-output + main saves (memory `feedback_subagent_write_denied`).
- Kill dev server by port: `lsof -ti :4311 | xargs kill` (memory `feedback_kill_server_by_port`).
- Verify any file/flag named in stale docs still exists before acting on it.
