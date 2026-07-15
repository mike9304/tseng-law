# Wix Builder Roadmap — Current Orchestration Handoff

Updated: 2026-07-14 KST

**Status:** active remediation. This is not a product-complete, release-ready, or customer-handoff declaration.

## Canonical boundary

- Real customer-deliverable repository: `/Users/son7/Projects/tseng-law`
- Canonical roadmap: `docs/WIX-BUILDER-REALITY-ROADMAP-2026-07-10.md`
- Baseline branch/SHA: `main` / `fb87883d2891c88f2ae15fd5d78554b1db3f98ce`
- Clean verification worktree: `/Users/son7/Projects/tseng-law-wb-verify`, pinned to the baseline SHA.
- The shared main worktree is intentionally dirty and multi-agent. The WB-R00 snapshot recorded 77 entries (53 tracked, 24 untracked); a 2026-07-13 observation already showed 196 entries. Counts are volatile. Never clean, reset, revert, reformat, stage, or adopt another lane's files.
- No commit, push, deploy, production publish, provider call, credential probe, runtime-data mutation, reseed, quarantine, move, or delete is authorized by this handoff. Tests that write must use isolated temporary roots.

## Roadmap gate state

| Gate | State | Evidence and current meaning |
| --- | --- | --- |
| WB-R00 | **Evidence gate PASS** | `.omo/evidence/roadmap-baseline/baseline.json` and `baseline.md`; pinned SHA plus 77-entry ownership snapshot and lane boundary. This does not make the shared tree clean. |
| WB-R01 | **Verifier gate PASS** | `docs/readiness-manifest/readiness-manifest.json`, `src/lib/builder/audit/readiness-{manifest,report}.ts`, and `scripts/run-readiness-manifest.{ts,mjs}`; focused tests 40/40. All 11 required P0 rows remain non-verified (10 `OPEN`, clean-handoff `STUB`) until real evidence/credentials exist. |
| WB-R02 | **BLOCK — remediation active** | Registry breadth, commerce `authorized_stub`, and translation fail-closed findings are being closed. Translation REST/SSE remediation is implemented, but R02 remains blocked until registry and commerce work finish and a fresh holistic gate passes. Existing `.omo/evidence/stub-registry/*` is not a final PASS artifact. |
| WB-R03 | **Evidence gate PASS** | Read-only artifacts: `scripts/runtime-data-inventory.mjs` and `.test.mjs`; tests 28/28 and whole-tree before/after hash stable. Last real dry-run: 11,486 files / 194,417,829 bytes; canonical 8,464 / 149,557,965; drafts 7,845; published 519; referenced 24; orphan 8,316; sibling 19; revisions 1,188 dirs / 1,345 files; missing draft/published 0/0; invalid/blocking 0/0. The report is stdout-only by safety design; no file was moved or deleted. |
| WB-R04 | **BLOCK — remediation active** | Core site identity/home/slug invariants are implemented, but restore and QA namespace gates still block. Restore must close final replacement TOCTOU and payload dev/ino/checksum binding. QA must isolate all mutable roots and propagate the same temp-root env to server and Playwright. Migration guard is implemented in `scripts/migrate-builder-mobile-schema.mjs`, `scripts/validate-builder-site-document.ts`, and `src/lib/builder/site/__tests__/mobile-schema-migration.test.ts`; it still needs the combined R04 gate. |
| WB-R05 | **Integrated gate PASS** | The independently verified `package.json` and `package-lock.json` from `/Users/son7/Projects/tseng-law-wb-r05` were copied checksum-identically into this shared main tree. Audit is now High 1 / Moderate 0 / Low 0; the remaining Next.js finding belongs to WB-R06. No dependency install, commit, push, deploy, or running-server restart occurred in the main tree. |
| WB-R06 | **Read-only audit active** | `wb_r06_next15_audit` is mapping the isolated 14.2.35 → 15.5.20 spike. No codemod, dependency install, or source edit is authorized until the current R02/R04 writers reach stable handoff. |
| WB-R07 | **Evidence gate PASS** | Honest real-pointer support and J01–J20 are implemented. A fresh production build (`.next-integration-20260714T104800`, BUILD_ID `DI-0YPhjGTlmU89O6LvrX`) passed J01–J20 20/20 serially, the selected-ancestor drag regression 1/1, and the header-search scroll regression 1/1. Support tests passed 49/49; focused canvas/header tests passed 72/72. Both isolated QA servers ended with teardown PASS and canonical runtime/audit checksums unchanged. This is an R07 evidence result, not overall builder or release completion. |
| WB-R08.1 | **Active / create-only CAS primitives** | New versioned JSON, Blob CAS, file CAS, and typed persistence error primitives only. Overall WB-R08 remains blocked on a passing WB-R04 gate and later multi-process integration evidence. |
| WB-R09 | **BLOCKED** | Golden Journey save → reload → publish → public evidence cannot start as a completion gate until WB-R07 and WB-R08 pass. |

All later WB-UX01/WB-R10–WB-R19 work remains dependent on the roadmap prerequisites. Do not skip ahead and do not claim builder or release completion.

## User-reported attorney/canvas defect

- The attorney-page nested text/heading click defect was fixed in `src/components/builder/canvas/CanvasNode.tsx`; `tests/builder-editor/node-click-stability.playwright.ts` passed Chromium 1/1. A nested text click no longer promotes an ancestor or jumps to another node before inline editing.
- The selected-ancestor child-surface drag, click-vs-drag selection, move/resize/rotation lifecycle, shared page-node identity, and WB-R07 real-pointer journeys now have focused unit and browser evidence. This does not supersede unrelated roadmap/provider/release OPEN items.

## Active lane ownership — no overlapping edits

One path has one writer. Read-only reviewers may inspect a writer's scope but must not edit it. If two lanes mention a path, ownership must be transferred explicitly before the second lane writes.

| Active lane | State | Exact write scope |
| --- | --- | --- |
| `wb_r02_registry_broad_scan_fix` | writer | `src/lib/builder/audit/production-stub-registry.ts`, its direct test, `scripts/run-production-stub-registry.{ts,mjs}`, `docs/stub-registry/production-stubs.json` |
| `wb_r02_registry_broad_scan_fix/registry_adversarial_review` | read-only review | Registry lane scope only; no writes |
| `wb_r02_commerce_authorized_stub_fix` | writer | Commerce orders PATCH route/test; `src/lib/builder/commerce/orders-engine.ts` and its tests; `src/lib/builder/payment-analytics.ts` and its tests |
| `wb_r04_restore_rollback_fix` | writer | `src/lib/builder/ops/backups-store.ts`, `src/lib/builder/ops/__tests__/backups-store.test.ts` |
| `wb_r04_qa_all_roots_isolation_fix` | writer/coordinator | `scripts/start-qa-server.sh`, `scripts/qa-runtime-isolation-contract.mjs`, `playwright.config.ts`, QA isolation helpers/direct tests; root overrides already delegated under `src/lib/builder/assets.ts` and `src/lib/builder/site/publish.ts` with their direct new tests |
| `reveal_fail_open_motion_fix` | writer | `src/components/Reveal.tsx`, `src/components/__tests__/reveal-lifecycle.test.ts` |
| `canvas_interaction_lifecycle_fix` | writer | `src/components/builder/canvas/hooks/useCanvasInteractions.ts`, `useCanvasNodeRotation.ts`, new `src/components/builder/canvas/__tests__/canvas-interaction-lifecycle.test.ts`, new `tests/builder-editor/canvas-interaction-lifecycle.playwright.ts`, and only its shared-ID regression in `page-switch-save-before-navigation.playwright.ts` |
| `canvas_save_navigation_race_fix` | writer | `src/components/builder/canvas/hooks/useSandboxSiteState.ts`, its direct test; it must not edit `page-switch-save-before-navigation.playwright.ts` while the lifecycle lane owns that shared test |
| `wb_r08_cas_primitives` | coordinator | New files under the R08.1 scope below only; no existing storage/product file edits |
| `wb_r08_cas_primitives/blob_cas_impl` | create-only writer | `src/lib/builder/storage/blob-cas.ts`, `src/lib/builder/storage/__tests__/blob-cas.test.ts` |
| `wb_r08_cas_primitives/file_cas_impl` | create-only writer | `src/lib/builder/storage/file-cas.ts`, `src/lib/builder/storage/__tests__/file-cas.test.ts` |
| `wb_r08_cas_primitives/versioned_store_core` | create-only writer | `src/lib/builder/storage/versioned-json-store.ts`, `persistence-errors.ts`, and their direct new tests |
| `wb_r08_cas_primitives/versioned_store_core/core_contract_review` | read-only review | R08.1 core scope only; no writes |

The completed translation remediation lane owns no further edits unless explicitly reopened. The completed R04 migration guard and asset/revision-root sublane must not be casually reopened or folded into another lane.

## WB-R07 final evidence — 2026-07-14

- Real pointer journeys: J01–J05 5/5, J06–J10 5/5, J11–J15 5/5, J16–J20 5/5, each run serially with one Chromium worker against the attested isolated production server on port 43158.
- Product regressions: selected ancestor drag from a child surface 1/1; nonzero horizontal canvas scroll preserved across builder search open/close 1/1.
- Static/unit gates: WB-R07 support 49/49; focused canvas/header suites 72/72; TypeScript, scoped ESLint, and `git diff --check` passed.
- Build gate: fresh `NEXT_DIST_DIR=.next-integration-20260714T104800 npm run build` completed; `validate-dist` passed; `/ko` returned HTTP 200. The only build CSS warning was the pre-existing Currency Settings autoprefixer warning.
- Safety gate: canonical checksums remained `runtime-data=98a7f01d…d27ec`, `data/audit=8115311e…634a`, `builder-dev/functions.json=1daa8302…65ed`, and `dev/logs/function.json=197374cd…057`; both QA harnesses reported teardown PASS and no test server remains listening.
- Review gate: GLM 5.2 Max independently approved the selected-ancestor interaction design and the final removal of the builder header's forced horizontal-scroll reset. Read-only reviewer agents separately diagnosed J11–J20 harness boundaries before coordinator implementation.

## External OPEN items

- Production admin-builder authenticated browser smoke and customer release approval.
- Real Stripe, Zoom, Google Calendar, Outlook Calendar, Resend/SMTP, OpenAI or DeepL, Upstash, and Vercel Blob credentials/provider QA.
- Clean atomic integration, build, browser Golden Journey, backup/restore/rollback rehearsal, runtime checksum preservation, and post-deploy verification.
- Never guess, print, store, rotate, bypass, or manufacture credentials/evidence. A missing provider must remain explicit `OPEN`/`not_configured`, never a mock success.

## Next orchestration gates

1. Finish the active non-overlapping R02 and R04 remediation lanes and run fresh holistic gates from the approved verification boundary.
2. Use the integrated R05 boundary and WB-R06 audit to prepare an isolated Next 15 spike; do not edit the shared tree until current P0 writer handoff is stable.
3. WB-R07 is complete at the evidence-gate level. Finish WB-R08 and its multi-process CAS evidence before starting WB-R09.
4. Start WB-R09 only after WB-R07/WB-R08 pass. Release/handoff remains blocked until every Phase 11 condition in the canonical roadmap is evidenced.
