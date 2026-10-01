# zh-hant design batch 1 — 2026-10-01

Scope: home, service directory, and the shared template for all six service details. Worktree: `tseng-law-zh-hant-design-codex-20261001`, starting at `14df0302`. Local implementation and commits only; no push, deployment, production builder writes, or changes to other worktrees.

## Design and rendering

- Home: larger split hero, persistent search shortcuts, factual trust strip, three-way navigation, practice cards before the archive, then attorney/case context, credentials, columns, FAQ, offices and contact. Existing sourced components and text are reused.
- Directory: split title/image/action header, six practice anchors, numbered two-column cards with complete descriptions, and a closing email contact panel. Mobile uses one column.
- Details: larger title and decorative courthouse image, immediate email action, real attorney role, in-page navigation, full-width reading column, numbered key points, and related-column cards. The contact card precedes the body in mobile DOM/focus order and occupies the desktop right rail.
- Traditional Chinese font stack and body line heights of 1.85–1.9 are scoped to new locale-specific CSS modules. Korean, English and Japanese continue through their existing branches.
- Published stock home uses the existing exact July/current9 admission checks. The new presentation is read-only; authored canvas changes continue through the original renderer. The exact July stock copy reader retains the locked attorney opening and all 13 stored FAQ question/answer pairs. Published legacy service composites opt into content-driven height only when they contain the new zh-hant directory root.

## Copy and meaning review

The shared editorial voice and repository copy were read before implementation. This batch rearranges existing copy and adds short navigation labels; it does not revise legal prose, source data, numbers, qualifications, citations or AI labels. The first two paragraphs in the source corpus and the previous three same-language columns remain unchanged. No column body was edited.

| Finding | Reason | Final treatment | Meaning preserved |
|---|---|---|---|
| The initial projection used the current attorney introduction for the July home. | It displaced the locked stored opening. | Read `home-attorney-intro-1` and pass it to the existing surface slot. | Yes; the locked sentence is asserted in rendered HTML. |
| The initial projection used current FAQ data for the July home. | Stored FAQ conditions must remain visible. | Read every stored question/answer pair; assert each pair in rendered HTML. | Yes; all 13 pairs are retained. |
| Hero trust strip included a legacy review count. | The redesign should foreground facts without introducing a new rating claim. | Reuse the existing attorney/office/language facts. | No new rating, certification or performance claim. |
| Taichung address differs between a historical locked hash and the existing projection. | The user prohibited address correction. | Leave both source strings untouched. Production and local office-tab display both read `40453臺中市北區館前路19號6樓之1`. | Existing visible address preserved; historical discrepancy remains flagged. |
| Mobile contact moved visually ahead of the article but initially followed it in DOM order. | Keyboard focus could jump backward. | Move the zh-hant contact card before the body in DOM; use grid placement on desktop. | All original contact text and email targets retained. |

Partner identity is sourced from the existing attorney profile; no Korean attorney qualification or firm-wide representative title was added. This record is an AI design/copy review, not a native-speaker or lawyer review.

## Test contract changes

Three existing tests were updated for deliberate rendering changes:

- `guidance-home-design-parity.test.tsx`: zh-hant practice-first order; other locale expectations retained.
- `published-home-editorial-render.test.tsx`: new stock presentation marker/order and accessible office tabs; retains exact stock/authored guards, hero primitive overrides, locked opening, all stored FAQ text and source-canvas immutability.
- `published-decorative-video.test.ts`: one decorative hero media in the projected home replaces three redundant primitive images; verifies the original canvas still contains its three images. Authored/other-page/other-locale checks remain.

Focused regression: 86 tests passed. Final `npm run qa`: exit 0, 1,358 test files and 13,284 tests passed (14 skipped, 1 existing todo). ESLint, type checking and builder route guard checks passed. Final `npm run build`: exit 0. The pre-existing `ContactEditorial.module.css` autoprefixer warning also appears in the untouched baseline build; no unrelated CSS was changed. Build-generated `next-env.d.ts` and dev-generated `tsconfig.json` edits were restored.

## Visual and independent review

Evidence root: `/Users/son7/tseng-zh-hant-pass2-20261001/design/`.

- Operating before screenshots: `home`, `services-list`, `services-detail-investment`, `services-detail-civil`, `services-detail-family`, each at 1440×900 and 390×844, full page. Existing files were retained. The original desktop home screenshot caught the cinematic intro; additional `before-content-*` files show the actual page.
- Final local production-build after screenshots: same routes and sizes, plus viewport crops. Home and directory use an isolated local stock-published fixture; the operating storage is not written.
- Korean/English/Japanese baselines and final screenshots cover the same five routes at both sizes.
- Final capture verification: all 40 pages returned 200 with one H1, no horizontal overflow and no browser errors. All 30 other-language views retain identical H1 text, section markup and document height versus the untouched local baseline. Metrics: `codex/final-visual-verification.json`.
- Browser smoke covers home search, service navigation, FAQ expand/collapse, Taichung office tab, directory anchors/detail links, and all six details at 1440/768/390. Detailed metrics are in `codex/browser-interactions.json`.
- Independent read-only GPT-6 Astra xhigh review: APPROVE after the copy-preservation and focus-order findings above were fixed. Review record: `codex/ASTRA-BATCH-1-REVIEW.md`. Codex performed the final QA/build and production-build screenshot checks.

Production rollout and post-deploy verification remain a separate user-directed step. A custom authored home is deliberately outside the stock presentation admission rule.

## Astra B1 R1 rejection remediation — 2026-10-01

The later `design/codex/VERDICT-ASTRA-B1-R1.md` returned REJECT and supersedes the earlier independent APPROVE recorded above. This follow-up implements its one MUST and both SHOULD findings. Codex performed the final verification for this revision; no new external Astra verdict is claimed.

| Finding | Verified cause | Change | Evidence |
| --- | --- | --- | --- |
| MUST: invisible consultation-button focus | Real Tab navigation on all six details at 1440/390 produced a 2px green outline on the identical green panel, contrast 1:1. | Scoped `:focus-visible` rule: 3px `#f5dfad` outline, 4px offset. | All 12 production-build views pass real Tab navigation, visible focus, viewport visibility and contrast checks. Measured contrast 9.79497:1. `baseline-focus-review-r1.json`, `after-focus-review-r1.json`, representative `baseline-focus-*` / `after-focus-*` PNGs. |
| SHOULD: narrow mobile summary copy | At 390px the text area was 218px, with 72px horizontal padding and inline numbering. | Move numbers above the mobile text; reduce horizontal padding to 32px. Desktop card layout is unchanged. | Text width is 258px on all six details, a 40px increase. Representative full-page after PNGs and `after-keypoints-390.png` for investment/civil/family were visually inspected. |
| SHOULD: private CSS-class dependencies | The zh-hant modules selected shared component internals through six CSS-module class-name fragments. | Add explicit `data-hero-slot` / `data-page-header-slot` attributes and replace all fragment selectors, including responsive rules. | No class-fragment selectors remain in the two modules. Home/directory heights and headings are unchanged. Other-locale styles remain scoped out. |

Fresh `npm run qa` passed with exit 0: 1,358 files / 13,284 tests, existing 14 skipped and 1 todo, type checking, ESLint and builder route guards. No tests or assertions were changed. Fresh `npm run build` passed with exit 0; the existing `ContactEditorial.module.css` autoprefixer warning remains the only CSS warning. Logs: `codex/qa-r1.log`, `codex/build-r1.log`.

The new `.next-build` production server used the existing isolated file-backed fixture. Operating before screenshots were preserved. All 10 zh-hant and 30 ko/en/ja full-page after screenshots were renewed at 1440×900 / 390×844. All 40 return 200, contain one H1, have no page errors or horizontal overflow. All 30 other-locale views match baseline H1, section markup and document height; 8 PNGs are pixel-identical. Remaining pixel differences were inspected and confined to the existing browser-language suggestion overlay and home FAQ-heading capture state; the shared changes add attributes only. Metrics: `codex/visual-verification-r1.json`. Functional smoke passes home search/navigation/FAQ/offices, service-directory links, and all six details at 1440/768/390: `codex/browser-smoke-r1.log`, `codex/browser-interactions.json`.

Supplemental long key-point element screenshots temporarily hide the fixed header during capture so it cannot obscure the middle of the extracted section. Full-page and focus screenshots retain the actual header. Reproduction scripts are `codex/focus-review-r1.mjs`, `codex/keypoint-capture-r1.mjs` and `codex/verify-r1-captures.mjs`.

Public copy, fixed strings, legal conditions, addresses, source data, production storage, other worktrees and batch 4/5 implementations were not changed. Build-generated `next-env.d.ts` is excluded. No push or deployment is authorized by this revision.
