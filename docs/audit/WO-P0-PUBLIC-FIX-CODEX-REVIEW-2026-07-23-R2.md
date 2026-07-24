# WO-P0 PUBLIC FIX — Codex Re-review R2 (2026-07-23)

## Verdict

**REQUEST_CHANGES**

The implementer resolved the three TypeScript failures, clears stale office phone/fax content when a phone-less preset is selected, removed the duplicate LINE/Kakao cards from `ContactBlocks`, and now labels the implementation as partial. Typecheck and all rerun focused tests pass.

This is still a **full-work-order / production-release** `REQUEST_CHANGES`, not a rejection of the corrected source tranche. The current combined code deployment can expose unverified messenger destinations on legacy contact paths, while existing decomposed/Blob-backed pages will not receive the contact actions or guaranteed Taipei cleanup. The planned decomposer/patch/verifier/browser artifacts and Production Upstash evidence remain absent.

## Scope and baseline

- Plan: `docs/audit/WO-P0-PUBLIC-FIX-PLAN-2026-07-23.md`
- Prior review: `docs/audit/WO-P0-PUBLIC-FIX-CODEX-REVIEW-2026-07-23.md`
- Implementation report: `docs/audit/WO-P0-PUBLIC-FIX-IMPLEMENTATION-2026-07-23.md`
- Reviewed working-tree state against `HEAD` / `ad77d5fca9521ee06c471b0378763dea7ce73ae4`.
- No commit, push, deployment, Blob write, provider call, or environment mutation was performed.

## Prior REQUEST_CHANGES disposition

| Prior item | R2 disposition |
| --- | --- |
| TypeScript optional-phone errors | **RESOLVED.** `npm run typecheck` passes. `OfficeMapTabs` narrows optional phone before use. |
| Stale phone/fax after applying Taipei preset | **SOURCE FIXED.** Both canvas preset handlers clear phone label/href and fax text for phone-less/fax-less presets (`CanvasNode.tsx:908-934`, `SandboxInspectorOfficeQuickEdit.tsx:67-104`). A direct behavior regression test is still missing. |
| Duplicate LINE/Kakao in `ContactBlocks` | **RESOLVED.** `ContactBlocks` now renders only `mailto:` and `tel:` direct cards (`ContactBlocks.tsx:40-57`); messenger actions remain in `MessengerChatSection`. |
| Implementation report overstatement | **SUBSTANTIALLY RESOLVED.** The report now says “partial source completion” and lists outstanding DoD items (`IMPLEMENTATION:5-6`). Two wording nits remain below. |
| Human destination ownership/receive gate | **OPEN — RELEASE BLOCKER.** Explicitly not run. |
| Existing decomposed/Blob-backed public pages | **OPEN.** No decomposed channel nodes, patch planners, dry-runs, applies, or revision evidence. |
| Production Upstash readiness and live classification | **OPEN.** No Production-target evidence. |
| Public Playwright/sitemap verification | **OPEN.** Required files do not exist. |

## Findings

### P0 — A code deployment can still expose unverified messenger destinations

The plan required ownership confirmation of LINE, Kakao, email, and phone before publishing. The source still states that ownership/receive verification is pending while hard-coding the destinations:

- `src/data/contact-page-content.ts:1-8`
- `src/components/MessengerChatSection.tsx:27-45,57-73,85-100`
- `src/app/[locale]/(legacy)/legacy-page-bodies.tsx:79-87`

`ContactLegacyPageBody` is used by both the legacy static contact route and the `legacy-page-contact` composite (`src/lib/builder/components/composite/Render.tsx:263-268`). Therefore, if either mode is live, a normal code deployment exposes the messenger links immediately. This cannot be deferred to a later Blob apply for those modes.

Required release action: before any production code deployment containing the contact changes, confirm all four destinations and complete at least one physical LINE/Kakao send-and-receive test plus mail composer and dialer prefill checks. If the human gate cannot run, split/disable the messenger exposure; do not deploy the combined tree on the assumption that production is decomposed.

### P1 — Decomposed contact remains unimplemented, not merely unapplied

The current decomposer still creates inquiries, locations, and the existing CTA only:

- `src/lib/builder/canvas/decompose-page-shared.ts:1424-1567` has none of the planned stable IDs `channel-line`, `channel-kakao`, `channel-email`, or `channel-phone`.
- `src/lib/builder/canvas/decompose-page-contact.ts:150-179` has no channel-height/layout/responsive adjustment.
- `src/lib/builder/canvas/__tests__/decompose-contact.test.ts` remains at four tests and does not assert the four channel actions.

Consequently, a new canonical decomposed contact document built from this source still omits the channels. Existing published decomposed documents also remain unchanged. This is more than “the Blob patch was not applied”: the planned source representation and guarded migration tooling do not exist.

Required change for full WO approval: add the stable decomposed channel nodes/layout and their unit coverage, then implement and test the guarded patch planner. Applying/publishing the patch remains a separate authorized operations step.

### P1 — Existing published Taipei/contact data still requires mode/revision inventory and guarded Blob work

The source presets and runtime legacy office UI remove Taipei's incorrect Taichung number, and new office node generation is conditional. Those changes do not mutate already-published decomposed documents.

The following planned artifacts are absent:

```text
scripts/patch-taipei-office-2026-07-23.mjs
scripts/patch-taipei-office-2026-07-23.test.mjs
scripts/patch-contact-channels-2026-07-23.mjs
scripts/patch-contact-channels-2026-07-23.test.mjs
scripts/verify-public-p0-2026-07-23.mjs
scripts/verify-public-p0-2026-07-23.test.mjs
tests/builder-editor/public-p0-fixes.playwright.ts
```

Until read-only mode/revision/draft-conflict evidence exists, the live locale/page path cannot be assumed from source. Do not use `?reseed=1` or direct Blob overwrite as a shortcut.

### P1 — Rate-limit source semantics pass, but Production conversion readiness is unproven

`mapPublicRateLimitDenial()` correctly maps `backend_unavailable` to 503 without `Retry-After` and genuine denial to 429 with a positive value (`public-rate-limit-response.ts:21-36`). Search and all five changed booking routes call the mapper.

The focused route suites pass, but only search and booking services directly test the 503 branch. Staff, availability, book, and payment-intent still assert only genuine 429 denial. The plan requested both branches for each changed route. Payment-intent also remains included without captured evidence that the affected public flow called it.

More importantly, the semantic code change does not restore a first visitor request to 200. Without valid Production-target `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, it will correctly report 503 instead of misleadingly reporting 429, but booking/search can remain unavailable.

Required for full WO approval: add the missing route-level 503/no-header cases, record the safe live-flow classification, verify only Production variable presence/target without printing values, and justify payment-intent scope from the captured flow or separate it.

### P2 — The preset clearing behavior has no direct regression test

The source now clears stale values in both preset-entry points, which addresses the prior correctness defect. Existing tests cover preset data, grouping, and inspector copy, but none applies a phone-bearing preset followed by Taipei and asserts that phone label/href and fax text become empty in both handlers.

This is not a current compile blocker, but it is the exact regression scenario that caused the R1 finding and should be encoded before the work order is closed.

### P2 — Implementation report has two residual wording inaccuracies

- `IMPLEMENTATION:22` still says `ContactBlocks` adds `mailto/tel/LINE/Kakao`; current source adds only mail/tel there.
- `IMPLEMENTATION:41` calls missing patch/verifier/browser work “plan optional / ops,” although the plan treats the scripts and browser suite as required DoD artifacts. The overall “partial source completion” status is now honest.

## Code-deploy versus Blob/operations boundary

| Change | What a code deployment changes | What must wait |
| --- | --- | --- |
| Guide review-marker removal | Direct route source changes; code deploy is sufficient. | Sitemap/raw/rendered verification remains required for release evidence. |
| Taipei phone/fax on legacy/static and `legacy-page-contact` composite paths | Runtime `OfficeMapTabs`/source data changes apply on code deploy. | Existing decomposed published office nodes require inventory plus guarded patch/publish. |
| Taipei phone/fax in newly generated decomposed documents | New generation uses the corrected presets/conditional nodes. | Existing published documents are immutable to this source change; do not reseed production. |
| LINE/Kakao on legacy/static and `legacy-page-contact` composite | `MessengerChatSection` appears immediately on code deploy. | **Human ownership/physical receive gate must occur before that deployment.** This is not a Blob-only gate. |
| Email/tel on runtime `ContactBlocks` surfaces | Appears immediately wherever `ContactBlocks` renders, including legacy contact and shared About/builder surfaces. | Mail composer/dialer prefill verification; confirm the broader shared-surface rollout is intended. |
| Contact actions on decomposed contact | **No effect today.** The decomposer has no four action nodes. | Decomposer/layout code, guarded patch tooling, dry-run review, authorized apply/publish, 390/1440 browser QA. |
| 503 versus 429 semantics | Code deploy makes backend outages honest 503 responses. | Valid Production Upstash is required for first-request 200; live request classification and route evidence remain open. |
| EN home insights and SSR stats | Applies to runtime legacy/composite component paths that execute the changed code. | Any already-materialized decomposed text/count nodes require separate mode-aware verification/migration if affected. |

Because the worktree combines all of these changes, “the legacy fixes can ship” does **not** mean the current tree can be deployed before the messenger gate. A safe partial code release would need an explicitly separated scope that excludes unverified contact exposure, followed by its own clean build and browser verification.

## Verification rerun

| Check | Result |
| --- | --- |
| `npm run typecheck` | **PASS** |
| Focused Vitest tranche: contact/office content, a11y, decomposed contact, ZH seed parity, legacy/composite EN localization, SSR stats, search, and five booking routes | **PASS — 13 files / 105 tests** |
| Additional office preset/helper suites | **PASS — 2 files / 8 tests** |
| `git diff --check` | **PASS** |
| `rg -n "\\[변호사 검수 필요\\]" src` | **PASS — 0 hits** |
| Guarded patch/verifier tests | **NOT RUN — files absent** |
| Public Playwright / no-JS / mobile contact / hydration checks | **NOT RUN — file absent by stated scope** |
| Production Upstash, Blob, or messenger checks | **NOT RUN — external authorization/human evidence required** |

The expected stderr emitted by the invalid-JSON and confirmation-failure unit cases did not fail the Vitest run.

## Approval path

1. Treat the corrected type/duplicate/report work as accepted source remediation.
2. Complete the remaining decomposed contact source nodes and focused regression tests.
3. Add the guarded Blob patch planners/tests and read-only verifier; review dry-run mode/revision/delta output before any apply.
4. Add route-level 503 tests for staff, availability, book, and payment-intent; verify Production Upstash target presence and capture safe flow classification.
5. Run the physical messenger ownership/receive gate before any deployment that can render `ContactLegacyPageBody`.
6. Run the planned public Playwright/no-JS/mobile suite, then the plan's full QA, release audit, clean build, builder smoke, and post-deploy verifier.

## Final decision

**REQUEST_CHANGES** for the complete WO and any production promotion of the current combined tree. The corrected legacy/source tranche is technically sound under typecheck and focused unit coverage, but it is not independently deployable from the unverified contact exposure, and the decomposed/Blob path remains incomplete.
