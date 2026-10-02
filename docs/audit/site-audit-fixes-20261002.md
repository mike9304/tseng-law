# Public site audit fixes — 2026-10-02

Scope: findings from the production audit of tseng-law.com. Work started from
`28e23176e` in an isolated worktree; the unrelated dirty primary worktree was not
modified. Codex performs the final review under the user's 2026-10-01 instruction.
The fix branch was rebased onto `5c4ce6677`, preserving the newly published
Chinese repair-cost column and its tests.

## Changes

- Header search defaults to all content. Tabs describe the actual index kinds;
  legacy services/videos query parameters still work. The results page renders
  every returned result (up to 50) and labels a capped set as “상위 50건”.
- Searchable builder text excludes layout identifiers, CSS and link targets,
  while retaining visible widget copy, rich text and composite overrides.
- Korean FAQ seed anchors are stable across requests and unique in the current
  corpus. Punctuation-only questions use a deterministic fallback. Stored slugs
  and established Japanese seed anchors retain their existing addresses.
- All 405 guidance pages (45 languages × 9 pages) have Open Graph and Twitter
  images. Existing canonical, language-alternate and robots rules are preserved.
- Column counts and English home highlight text meet the checked contrast rules.
- The client navigation/footer use a 60KB projection of the approximately 1.9MB
  guidance corpus. A parity test guards the generated projection.
- Published pages import renderers directly instead of the editor registry.
  All 83 renderers retain identity with the editor registry; the 49 extracted
  implementations were also compared structurally to the original source.
  Composite editor state loads only in edit mode. Column clients receive card
  fields instead of full articles, and unrelated composites receive no feed.
- The same 949 WOFF2 files and fallback metrics are self-hosted with per-family
  hashed stylesheets. Each language requests its 1–2 families, instead of all 17.
  The original font settings, regeneration script and 17 licenses are retained.
  Locale navigation adds each stylesheet once and updates the active font class.

## Verification

Evidence directory on Mac Studio: `/Users/son7/tseng-law-audits/2026-10-02/`.

- Clean production build, lint/type validation and whitespace checks passed.
- All 405 guidance URLs returned HTTP 200 with both social-image meta tags in
  their actual HTML (`fixes-metadata.json`).
- Renderer suites: 166 files, 1,557 tests passed. Font/remediation suites: 396
  tests passed. Final search/FAQ/metadata/projection/registry suite: 69 passed.
- The full unit run passed 13,605 tests. Its 12 failures were investigated:
  11 reproduce on the unchanged baseline (9 content/corpus test files); the
  remaining stub-inventory reference followed a moved renderer and was corrected.
  The corrected inventory and text suites then passed all 84 tests. The full
  suite is therefore not reported as green.
- 279 builder route files checked; all 273 mutation handlers have guard coverage
  (4 existing documented exceptions).
- Public browser checks passed: search tabs/keyboard/reset, all 50 results,
  stable FAQ search/reload links, unique FAQ IDs, six empty-form errors without
  sending an inquiry, mobile menu and office map, column filtering, contrast,
  language navigation, and nine core pages at 390px/1440px. No JavaScript crashes.
- Actual KO → JA → AR → KO navigation stays in the same document, updates
  lang/dir and computed fonts, reuses stylesheets, and returns 200 for all 109
  observed font/CSS responses. No font or page errors.
- Isolated builder home opens successfully. Actual inline editing, formatting,
  save and reload pass with a valid isolated page slug. The older inline test's
  `g-editor-*` fixture is rejected with 409; only that fixture prefix was changed
  in the temporary validation copy. Canonical data checksums remain intact.

Existing builder limitations were reproduced against the unchanged build:
the broad smoke expects the retired `hero-search-bar overlap` home markup;
composite surface click is intercepted by its selected canvas wrapper. These
are not claimed fixed by the public-site audit changes. Temporary probes and
their traces are retained in the evidence directory, not added as passing tests.

## Mobile performance comparison

Single paired localhost runs, same mobile configuration, Lighthouse 12.6.1
with actual DevTools network/CPU throttling rather than Lantern estimates:

| Page | Score before → after | LCP before → after | TBT before → after |
|---|---|---|---|
| Home | 43 → 59 | 5.421s → 3.815s | 706ms → 507ms |
| Contact | 53 → 73 | 5.630s → 3.839s | 343ms → 151ms |

CLS remained unchanged. CSS and JavaScript transfers fell from approximately
1.73MB to 1.03MB (697,612 bytes, 40%). Contact total transfer fell from 3,064,049
to 2,365,369 bytes. Home video transfer finished at different points, so its
total-byte comparison is not treated as exact.

Both final runs emitted Lighthouse's maximum-load-time warning, without runtime
errors; paint was at about 3.8s and document load at 15–17s. An unfinished metrics
request was present, but the warning's sole cause is not established. Scores
remain below 90 and are not a claim that every performance opportunity is solved.
The original Lantern localhost estimates inverted despite lower observed render
times, because different font requests completed before the first paint; those
simulated scores are retained in evidence but not used to claim an improvement.
See `devtools-comparison.json` and the four `devtools-*.report.{json,html}` files.

## Public copy review

| Original | Reason | Replacement | Meaning preserved |
|---|---|---|---|
| Header search “서비스” as default | Submitted query searched only page records | “전체”; tabs match page/insights/FAQ kinds | Yes; all search kinds remain available |
| “총 50건” with 12 cards | Count and visible results disagreed; 50 is a cap | All 50 cards, “상위 50건” at the cap | Yes; avoids claiming a complete total |

Corresponding English/Chinese/Japanese results labels follow the same meaning.
No legal article prose, identities, obligations, sources or AI author labels
were changed. Font binaries, layout styles and article images are preserved.

## Release boundary

No production inquiry, email or external-provider mutation was submitted.
Commit and review are local; pushing and deploying require the user's release
confirmation under AGENTS.md. Post-deployment public verification remains a
release step. Local performance comparisons are not production speed guarantees.
