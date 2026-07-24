# WO-P0 PUBLIC FIX — Codex Final Review (2026-07-23)

## Verdict

**REQUEST_CHANGES**

The implementation contains useful Step 1, Step 3, Step 4, and Step 5 source changes, and the focused Vitest suite is green. It is not deployable or complete against the plan: TypeScript fails, unverified contact destinations are exposed, decomposed/Blob-backed public pages are not migrated, and required patch/verifier/browser artifacts are absent.

## Scope reviewed

- Plan: `docs/audit/WO-P0-PUBLIC-FIX-PLAN-2026-07-23.md`
- Implementation report: `docs/audit/WO-P0-PUBLIC-FIX-IMPLEMENTATION-2026-07-23.md`
- Baseline: `HEAD` / `ad77d5fca9521ee06c471b0378763dea7ce73ae4`
- Reviewed all 24 tracked product-file modifications, 3 untracked product/test files, and the 2 untracked audit documents.

### Whitelist and ban result

- All 27 changed product/test files are named in the union of the Step 1–5 whitelists.
- The plan and implementation report are audit inputs/artifacts rather than product changes. This review document is explicitly requested by the reviewer prompt.
- No banned column content, sitemap, SEO, cache policy, `rate-limit.ts`, stats data, `decompose-stats.ts`, env file, or direct Blob-write path was changed.
- `src/app/api/booking/payment-intent/route.ts` and its shared copy dependency are only conditionally allowed when a real paid flow was observed. No reproduction evidence establishing that condition exists, so their inclusion remains unjustified until Step 3 evidence is supplied.
- Required whitelisted work is missing: the two guarded Blob patch scripts and tests, the sitemap verifier and test, the public Playwright suite, contact decomposer/layout changes, and multiple specified regression-test updates.

## Findings

### P0 — Unverified customer contact destinations are now publicly exposed

The plan made ownership confirmation of LINE, Kakao, email, and phone a **pre-code human gate**, and explicitly prohibited publishing guessed/unverified destinations. The implementation instead hard-codes all four while admitting ownership/receive verification is still pending:

- `src/data/contact-page-content.ts:1-8` declares the destinations and says verification remains a pre-production gate.
- `src/app/[locale]/(legacy)/legacy-page-bodies.tsx:79-87` mounts the messenger section on the public contact body.
- `src/components/ContactBlocks.tsx:40-82` exposes mail, phone, LINE, and Kakao anchors.
- `docs/audit/WO-P0-PUBLIC-FIX-IMPLEMENTATION-2026-07-23.md:17-23` confirms the human receive gate has not run.

This can misroute real customer inquiries and violates the plan's sequencing. Before merge/deploy, the channel owner must confirm all four public values and complete one real messenger round trip plus mail-composer and dialer prefill evidence. If any destination cannot be verified, do not expose it; keep only destinations that have passed the gate.

### P1 — TypeScript fails after making office phone optional; Taipei preset handling can retain stale phone/fax data

`npm run typecheck` fails with three errors:

```text
src/components/builder/canvas/CanvasNode.tsx(917,34): TS2345
src/components/builder/canvas/SandboxInspectorOfficeQuickEdit.tsx(84,44): TS2345
src/components/OfficeMapTabs.tsx(350,73): TS18048
```

Root cause and correctness risk:

- `src/lib/builder/canvas/office-locations.ts:4-10` changed `phone` to optional.
- `src/components/builder/canvas/CanvasNode.tsx:908-922` and `src/components/builder/canvas/SandboxInspectorOfficeQuickEdit.tsx:65-91` still assume every preset has a phone.
- Merely adding a null guard would compile but would leave the existing phone/fax nodes unchanged when a user switches an office card to the Taipei preset. That can preserve the exact Taichung number this work order intends to remove.
- `src/components/OfficeMapTabs.tsx:346-353` also dereferences the now-optional Korea phone without narrowing it.

Required change: handle a phone-less/fax-less preset end to end, including removal or correct hiding of stale editor nodes, and add a regression test that applies the Taipei preset after a phone-bearing preset. Any edits outside the original whitelist require an explicit scope amendment.

### P1 — Step 1 and Step 2 do not cover decomposed/Blob-backed production content

The source presets are corrected, but already-published decomposed documents are immutable with respect to those source changes:

- `src/lib/builder/canvas/decompose-page-shared.ts:1424-1567` still creates only the old inquiry/location content and has none of the required stable channel action IDs.
- `src/lib/builder/canvas/decompose-page-contact.ts:150-185` still uses the unchanged contact block geometry and therefore has no layout/responsive accommodation for four channel actions.
- The implementation report explicitly lists the Taipei/contact Blob patches as not done at `docs/audit/WO-P0-PUBLIC-FIX-IMPLEMENTATION-2026-07-23.md:40-44`.

Consequences:

- A live decomposed home/contact Blob can continue to expose Taipei's old Taichung phone/fax despite the source preset fix.
- A live decomposed contact Blob receives none of the new direct-channel actions.
- No read-only mode/revision inventory exists, so the team cannot yet say which locale/page is legacy, composite, or decomposed.

Required change: implement and test the planned decomposed nodes/layout and guarded patch planners, then run production-credential dry-runs that record mode, page id, published revision, draft conflict status, and intended delta. Apply/publish only after human review, with backup and revision guards; never directly overwrite Blob content.

### P1 — Step 3 was implemented without its reproduction gate, Production Upstash readiness, or complete route coverage

The shared source mapping itself is sound: `src/lib/builder/security/public-rate-limit-response.ts:21-36` maps backend outages to 503 without `Retry-After`, and genuine denial to 429 with a positive header. Search and booking routes call it correctly in source.

However, acceptance is incomplete:

- No real search/booking request log or P0/P1 classification evidence was produced before the conditional changes.
- Production `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` existence and Production target are unverified. Without valid Upstash, the first legitimate production request remains fail-closed at 503; the semantic fix alone does not restore booking conversion.
- Only search and booking services gained the required `backend_unavailable -> 503` route test (`src/app/api/search/__tests__/route.test.ts:178-195`, `src/app/api/booking/services/__tests__/route.test.ts:79-96`). Staff, availability, book, and payment-intent still test only genuine 429 denial.
- Payment-intent was modified without evidence that the observed public paid flow called it.

Required change: record safe single-request live-flow evidence, verify only the presence/target of the Upstash Production variables without printing values, add 503/no-header tests to every changed route, and either justify payment-intent from the captured flow or remove it from this work order.

### P1 — Required end-to-end and migration safety artifacts are absent

The following planned files do not exist:

```text
scripts/patch-taipei-office-2026-07-23.mjs
scripts/patch-taipei-office-2026-07-23.test.mjs
scripts/patch-contact-channels-2026-07-23.mjs
scripts/patch-contact-channels-2026-07-23.test.mjs
scripts/verify-public-p0-2026-07-23.mjs
scripts/verify-public-p0-2026-07-23.test.mjs
tests/builder-editor/public-p0-fixes.playwright.ts
```

As a result, there is no evidence for sitemap 108/108, raw/rendered marker absence, office-card relations, 390/1440 contact layout, EN visible-Hangul/`Date pending`, no-JS statistics, JS animation completion, or hydration/console errors. The missing scripts are mandatory acceptance work, not optional operations.

### P2 — Regression tests do not encode several source-level acceptance criteria

- `src/data/__tests__/site-remediation-content.test.ts` checks `siteContent` and source strings but not every `OFFICE_LOCATION_PRESETS` locale or decomposed phone/fax node absence.
- `src/components/__tests__/site-remediation-a11y.test.tsx` and `src/lib/builder/canvas/__tests__/decompose-contact.test.ts` were not updated for 3 locales × LINE/Kakao/mail/tel and stable channel IDs.
- `src/lib/builder/components/composite/__tests__/composite-render-localization.test.tsx` was not updated to cover EN published behavior, no Hangul, no `Date pending`, and canonical dates.
- `src/components/__tests__/home-stats-ssr.test.tsx` correctly covers SSR values but there is no no-JS or JS-on animation/hydration test.

### P2 — Legacy contact UI duplicates messenger calls to action and broadens another surface

`ContactLegacyPageBody` renders `MessengerChatSection`, then `ContactBlocks`; `ContactBlocks` itself now renders LINE and Kakao again (`src/components/ContactBlocks.tsx:57-82`). Because the same component is also used by the legacy About body and builder About surface, the four new channel cards are not limited to the intended contact page. This is not the main release blocker, but the implementer should align the component boundary with the plan: dedicated messenger section plus semantic mail/tel anchors, or explicitly approve the broader repeated UI.

### P2 — Implementation report overstates completion

`docs/audit/WO-P0-PUBLIC-FIX-IMPLEMENTATION-2026-07-23.md:5` says Steps 1–5 are code-complete, while `:40-44` labels required patch/verifier/browser work as “optional / ops.” The plan treats these as exact changes and Definition-of-Done gates. Update the report after remediation so it distinguishes source partial completion, production content migration, provider readiness, and end-to-end evidence.

## Step-by-step acceptance assessment

| Step | Source-level assessment | Acceptance state |
| --- | --- | --- |
| 1 — trust | Marker FAQ/comments removed; legacy and preset Taipei numbers removed; conditional decomposer generation added. Optional-phone consumers do not compile, preset switching can preserve stale data, Blob patch/verifier/tests are missing. | **FAIL / partial** |
| 2 — contact | SSOT, semantic anchors, and legacy mounting exist. Human ownership gate is violated; decomposed nodes/layout and Blob patch are absent; legacy messenger CTAs are duplicated. | **FAIL** |
| 3 — rate limit | Shared 503/429 mapping and route wiring are source-correct. Required live classification, Upstash Production readiness, route test coverage, and paid-flow justification are missing. | **FAIL / partial** |
| 4 — EN home | Legacy uses locale-aware canonical column posts; published composite no longer exposes date-less synthetic archive. Focused tests pass, but composite/browser acceptance coverage is incomplete. | **PASS at core source logic; evidence incomplete** |
| 5 — SSR stats | Initial server/client state renders target values and the SSR test passes for all locales. No no-JS/JS-on browser or hydration evidence exists. | **PASS at core source logic; evidence incomplete** |

## Verification rerun

| Check | Result |
| --- | --- |
| `git diff --check` | PASS |
| `rg -n "\\[변호사 검수 필요\\]" src` | PASS, 0 hits |
| EN forced-KO expression scan in the two changed renderers | PASS, 0 hits |
| Focused Vitest: 13 files / 108 tests | PASS |
| ESLint on all 27 changed product/test files | PASS |
| `npm run typecheck` | **FAIL**, 3 errors listed above |
| Required patch/verifier Node tests | NOT RUN; files absent |
| Public Playwright / no-JS / real-browser checks | NOT RUN; file absent |
| `npm run qa`, `npm run audit:release`, clean build, builder smoke | NOT ACCEPTABLE TO CLAIM; the hard typecheck gate already fails and the required browser suite is absent |
| Production Blob, provider, or env mutation | Not performed during review |

## Residual deployment risks

1. **Blob-only content:** source changes do not update already-published decomposed home/contact documents. Until mode/revision dry-runs and guarded publishes are complete, the original trust defect and missing contact actions may remain live.
2. **Upstash:** valid Production-target credentials are required for first-request 200 behavior. Missing or failing Upstash correctly remains fail-closed and will surface as 503 after this patch.
3. **Messenger ownership:** existing-looking deep links are not proof of firm ownership or message delivery. All public destinations require owner confirmation, with at least one physical-device round trip.
4. **Incomplete scripts/evidence:** there is no rollback-tested patch planner, sitemap-wide verifier, or public Playwright suite, so production delta and post-deploy state are not yet auditable.
5. **CLI compatibility:** the installed Vercel CLI is reported as `50.41.0`, behind current `56.5.0`. Before any preview/deployment/env work, upgrade with `npm i -g vercel@latest` or `pnpm add -g vercel@latest` and record the version. Do not couple that upgrade to a product architecture migration.

## Required follow-ups before deploy

1. Fix all three TypeScript errors and the stale phone/fax preset behavior; add direct preset regression coverage.
2. Obtain human confirmation for LINE, Kakao, email, and phone. Hide any unverified destination.
3. Complete the contact decomposer/layout/responsive changes and semantic-link tests for all locales.
4. Implement the two guarded Blob patch scripts, their conflict/idempotency/preservation tests, and the read-only sitemap verifier.
5. Capture live search/booking classification evidence, verify Production Upstash variable presence/target without exposing values, and complete route-specific 503 tests.
6. Add and pass the public Playwright suite for office relations, contact links/layout, EN localization, no-JS stats, JS animation, and console/hydration cleanliness.
7. Re-run `npm run typecheck`, the full targeted suites, `npm run qa`, `npm run audit:release`, a clean production build, builder smoke, and sitemap/post-deploy verification.
8. Review dry-run mode/revision/delta evidence before any Blob publish or production promotion. Do not commit, push, deploy, or publish until human approval is recorded.

## Final decision

**REQUEST_CHANGES** — do not deploy this working tree.
