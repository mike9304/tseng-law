# Wix Builder — Live Verification Report (2026-06-29 KST)

**Method:** automated browser probe (Playwright/Chromium) + visual screenshot review against the **live dev server on port 3295** (`next-server v14.2.35`, git HEAD `bf21bff`, working tree dirty with active Codex builder changes). Auth: basic (`admin`). Public reference page: `/ko`. Editor: `/ko/admin-builder`.
Driven by the recurring `/loop` (cron `*/6 * * * *`); this report is updated each iteration.

> ⚠️ **Probe-methodology note (important):** A first-pass probe used selector `[data-node]` and measured `document.scrollHeight`. Both were wrong for this app — canvas nodes use **`[data-node-id]`** and the canvas scrolls **inside `.SandboxPage_canvasColumn`** (the document stays at viewport height). That produced false "0 nodes / selection broken / -90% fidelity" alarms. **Those are discarded.** All findings below use corrected selectors.

---

## TL;DR (after 19 verification iterations)

The builder **behaves like Wix and is in good shape.** Verified working: render + full node parity to the live site; selection, multi-tab inspector, viewport breakpoints, layers; advanced panels (layers/comments/shortcut map/align-distribute/style paste/components/zoom/undo timeline); rulers/guides/grid snap/outline-hide-media; node move (direct-move preview), resize, rotate, inline text edit; add-element from catalog; delete/duplicate; **publish** (API 200 in ~1.4s); decompose-to-edit. Desktop **and** mobile reflow, **and** all 3 locales (ko/zh-hant/en) verified geometry-sound (0 off-canvas across all pages), data-source-aligned with the live components, and content-complete (no missing items).

**4 real bugs found & fixed (production):**
1. **F5** — decomposed Korean text broke mid-word (`TextElement` forced `word-break: break-word` over the live `keep-all`).
2. **F7** — inline-editing a class-styled title shrank the text (double `onBeforeStartEditing` capture clobbered the display style).
3. **F10** — decomposed `insights` showed different columns than the live site (used `getAllColumnPosts` instead of the curated `insightsArchive`).
4. **F12** — right-column/lower-row staff cards rendered their content off-grid (column/row offset wrongly applied to nested children).

Plus stale-test fixes (`openBuilder` auto-decompose, `:476`, `:322`). **4 false alarms caught before reporting** (wrong selector, offices map load-timing, insights "duplicate", mobile "gaps") — verified before asserting.

**Not builder bugs / infra caveats:** `:191` is now production-verified as a dev-mode perf threshold issue (2026-06-30: focused run + repeat-each=3 passed on `next start` without changing the 160ms budget). Clipboard-persistence is also production-verified now (2026-06-30: `clipboard-persistence.playwright.ts` 3/3 passed on isolated `next start` with scratch local backend). Home composite insights fidelity is production-verified now (2026-06-30: public-vs-builder data/font/height parity fixed, legacy fallback uses the same curated source, and builder-published/editor reveal visibility is guarded by opacity assertions on isolated `next start`). Remaining home composite sections are now production-verified for public-vs-builder height/title/font/visibility/y-offset parity (2026-06-30: `home-composite-remaining-sections-fidelity.playwright.ts` 1/1 passed on isolated `next start` with screenshot review). Home composite services now preserves the public `#practice` anchor in both real `/ko/admin-builder` and builder-published `/ko` (2026-06-30: red `builder_section_metric_missing:services` before patch, green focused production spec after patch). Public home section-dot navigation now renders and clicks through to `#practice` without colliding with the default AI chat panel, while remaining absent from the admin layout (2026-06-30: focused production spec red on missing nav, red on AI/pointer interception, green after layout/CSS/scroll fixes). The real builder's public chrome preview now also mirrors that section-dot rail for home previews and scrolls the builder canvas root without mutating the `/ko/admin-builder` hash (2026-06-30: red static contract + red compact-overlap proof, green focused production Playwright 3/3 and manual desktop/compact metrics). Tablet services visual is production-verified now (2026-06-30: services accordion detail/8 related-column layout fixed and `responsive-stage-width.playwright.ts` 2/2 passed on isolated `next start` with screenshot review). Full E2E still needs a later production sweep because the **dev server (OPS-1) corrupts under heavy automated load** — a dev-mode infra issue, recovery documented. The earlier AI-chat-in-editor occlusion (F1) is an intentional "match public" parity choice.

**Preview modal update (2026-06-30):** standard-page 미리보기 now opens the builder draft-preview route (`/ko/builder/home?mode=preview`, likewise about/contact) instead of the published public path. Custom/non-standard pages are now production-verified to keep the public-path fallback and render published content inside the modal iframe.

**Pages/Columns network-error update (2026-06-30):** real `/ko/admin-builder` Pages/Columns controls now keep every page API request scoped to the selected site. The client prop chain already sends `siteId`; the follow-up fix also removed remaining server-side default-site leaks in `/api/builder/site/pages/[pageId]/linked`, page rename/delete, and page order routes, and allowed strict schemas to accept the `siteId` body field that the real Pages panel already sends. Manual browser QA on isolated `next start` with selected `siteId=codex-selected-site-mqz6puo3` clicked `페이지` and `칼럼`; `hasNetworkToast=false`, `/linked?...siteId=...` returned 200, and direct pages list/patch/order/create/delete checks were all 200. Targeted route/contract Vitest was `4 files / 22 tests passed`, `npm run typecheck` passed, and production build passed with existing repo warnings only. This was done only in `/Users/son7/Projects/tseng-law`; the separate GLM/`tseng-law-builder` project was not edited.

**Home remaining composite sections update (2026-06-30):** a focused production proof now compares real `/ko/admin-builder` against public `/ko` for all 9 home composite sections, including the previously less-covered `services`, `attorney`, `case-results`, `stats`, `faq`, `offices`, and `contact` sections. The new spec verifies section/node heights, cumulative y-offsets, title text, font family, and visible opacity; it passed on isolated `next start` with scratch local storage, and visual review showed the public full page plus builder service/stats/offices/contact nodes populated with CJK text and no incoherent overlap.

**Home mobile composite fidelity update (2026-06-30):** real `/ko/admin-builder` mobile canvas now matches public `/ko` mobile metrics across the 9 home composite sections. The focused spec first failed on `home-attorney mobile height` with a 65px delta; runtime metrics traced that to the attorney split title remaining at 32px in the builder while public mobile uses 24px. Screenshot QA then caught the attorney portrait image filling the 3/4 wrapper in builder while public published runtime keeps the image at `height:auto`. Both are now scoped in `SandboxPage.module.css`, and the mobile spec additionally asserts the attorney image height. Final proof on isolated `next start` passed, and screenshot metrics matched: section `343x1064`, title `24px/32.4px/65px`, image `343x384`.

**Home services anchor update (2026-06-30):** the same focused production spec now requires the services section to be addressable as `#practice`, matching the public section navigation contract. Before the patch, builder composite `services-bento` rendered the service list without the `#practice` section id and the spec failed at `builder_section_metric_missing:services`; after passing `id="practice"` through `CompositeRender`, `/ko#practice` scrolls to the populated service section and the real editor `home-services` node contains the same anchor.

**Public section-dot navigation update (2026-06-30):** existing `SectionDotNav` is now wired into the public locale layout only, not the `(builder)` admin layout. The new production spec proves `/ko` renders the full home section rail with `#practice`, clicks that dot, sets the hash, and scrolls the services section under the header. Manual browser QA on the same isolated `next start` server confirmed the desktop rail sits left of the default AI chat panel (`navClearOfChat=true`), mobile 375 has 9 links and zero horizontal overflow, `/ko/admin-builder` has `dotNavCount=0`, and console/page errors are 0.

**Builder public chrome preview section-dot update (2026-06-30):** the real `/ko/admin-builder` public chrome preview now mirrors the public home `SectionDotNav` for home previews without mixing in GLM or the separate `tseng-law-builder` app. `SectionDotNav` gained explicit `currentSlug`, `scrollRootSelector`, and `updateHash` options so the preview can render home dots while the admin route remains `/ko/admin-builder`, click dots against `[data-builder-canvas-scroll-root="true"]`, and leave `window.location.hash` empty. A focused production Playwright run passed both the new builder-preview spec and the existing public `/ko` dotnav spec (`3 passed`), and manual browser QA confirmed desktop `#practice` click set `scrollTop=2022`, `active=practice`, `practiceTop=110`, while compact 390px had 9 dots, zero event/AI shortcut overlap, zero horizontal overflow, and no console/page/bad-response errors.

**Builder public chrome Columns shortcut label update (2026-06-30):** the real `/ko/admin-builder` public chrome shortcut no longer masquerades as `AI 상담` when its actual flow is Columns page-first management. Red proof on the real dev server failed with `Expected "칼럼", Received "AI 상담"`; after the copy fix the shortcut labels are `칼럼` / `專欄` / `Columns` while the panel action remains `칼럼 관리`. Dev and production focused Playwright passed (`builder-public-chrome-section-dot-nav` label spec, focused `chrome-click-safety`, and the full public-chrome section-dot file), the isolated production build passed, and manual production QA confirmed `AI 상담` count `0`, `칼럼 관리` visible, `/columns` selected, no horizontal overflow, and no console/page errors. The separate GLM/`tseng-law-builder` process was not touched.

**CMS source record inline editing update (2026-06-30):** real `/ko/admin-builder/cms` source collection preview rows now support inline editing for backend-ready service/lawyer source overrides without touching protected Columns or the separate GLM builder. Red production proof failed on the missing `data-cms-source-record-inline-edit` button; green focused Playwright now saves the `investment` service title/slug from the CMS preview, verifies the refreshed preview route, and confirms `/api/builder/services/investment?locale=ko` returns the updated values. Source collection details are now site-override-aware for CMS/API/inventory views, typecheck and related source/CMS unit tests passed, and desktop/mobile visual QA showed the inline editor bounded with no overlap or clipped subtitle text.

**CMS attorney source email update (2026-06-30):** the same real `/ko/admin-builder/cms` source preview editor now exposes attorney email editing for `attorney-profiles` rows. Red production proof failed on the missing `[data-cms-source-record-inline-input="email"]`; green production Playwright now verifies the default `wei@hoveringlaw.com.tw` draft, saves a new email through `/api/builder/lawyers/wei-tseng?locale=ko`, and confirms the refreshed API payload. Visual QA caught and fixed a separator parsing bug where `대만 변호사 · 대표 변호사 · wei@...` initially made the email draft invalid; final desktop/mobile proof showed role and email split correctly, no validation warning, no horizontal overflow, and no console/page errors.

**CMS attorney source description update (2026-06-30):** the real `/ko/admin-builder/cms?collectionId=attorney-profiles` source preview editor now exposes the localized attorney SEO/source description in a bounded textarea. Red production proof failed on the missing `[data-cms-source-record-inline-input="description"]`; green production Playwright now edits `wei-tseng`, waits for the save to complete, and confirms `/api/builder/lawyers/wei-tseng?locale=ko` returns the updated description. Typecheck, related CMS/source unit tests, and isolated production build passed; desktop/mobile visual QA showed the description field populated, horizontal overflow 0, no validation warning, and no console/page errors. This was done only in `/Users/son7/Projects/tseng-law`; the separate GLM/`tseng-law-builder` project was not edited.

**CMS attorney source image update (2026-06-30):** the same real `/ko/admin-builder/cms?collectionId=attorney-profiles` source preview editor now exposes the required attorney profile image as an Image URL field with a live thumbnail preview. Red production proof failed on the missing `[data-cms-source-record-inline-input="image"]`; green production Playwright now edits `wei-tseng`, saves a changed image path through `/api/builder/lawyers/wei-tseng?locale=ko`, and confirms the refreshed API payload. Typecheck, related CMS/source unit tests, and isolated production build passed; desktop/mobile visual QA showed the thumbnail preview, horizontal overflow 0, no validation warning, and no console/page/API errors. This was done only in `/Users/son7/Projects/tseng-law`; the separate GLM/`tseng-law-builder` project was not edited.

**CMS attorney source image Asset Library update (2026-06-30):** the real source preview image editor now also opens the existing builder Asset Library, selects an uploaded asset into the attorney source image draft, and saves that asset URL through `/api/builder/lawyers/wei-tseng?locale=ko`. Red production proof on `3409` failed on the missing source Asset Library button; green production proof on `3410` ran the full CMS source inline file with 5/5 passing, including upload/select/save/API verification. The Asset Library modal also gained a 640px mobile single-column layout after visual QA found the old two-column modal wrapping upload text vertically; final desktop/mobile crop QA had horizontal overflow 0, no validation text, and no console/page/API errors. GLM/`tseng-law-builder` was not touched.

---

## What was VERIFIED WORKING (evidence-backed)

| Behavior | Result | Evidence |
|---|---|---|
| Editor route loads & hydrates | ✅ | `/ko/admin-builder` → 200, `data-editor-ready="true"`, load ~1.2s |
| Console / runtime health | ✅ | **0** console errors, 0 page errors across editor + public |
| Canvas renders all sections | ✅ | 9 `[data-node-id]` in editor == 9 on public (`home-hero, home-insights, home-services, home-attorney, home-case-results, home-stats, home-faq, home-offices, home-contact`) |
| No missing / extra nodes vs public | ✅ | `missingInEditor: []`, `extraInEditor: []` |
| Node **selection** | ✅ | Click → selection box + `1개 선택됨`, inspector populates |
| **Inspector** (Wix-class) | ✅ | Tabs: 레이아웃/스타일/콘텐츠/애니메이션/접근성/SEO; viewport (데스크톱 1280 / 태블릿 768 / 모바일 375); X/Y, 너비/높이, 회전, 표시/잠금/고정, 앵커 이름; duplicate/move/delete toolbar |
| **Layers** rail | ✅ | `data-builder-rail-item="layers"` opens panel |
| Horizontal overflow | ✅ none | editor canvas `scrollWidth == clientWidth` (1059); mobile 390 `sw==cw`; public 1440 `sw==cw` |
| Node overlap (siblings) | ✅ none | 0 pairs overlap >50% |
| Section boundary straddling | ✅ none | 0 nodes cross a section boundary |
| Mobile editor (390px compact) | ✅ | renders; 2026 event popup open by default (matches public mobile), no overflow |

### Geometry / fidelity (editor canvas vs public)
- Width scaling is a **uniform 0.72** across all 9 sections (editor canvas is 1037px content vs 1440px public) — proportional, **no horizontal distortion**.
- Height ratios cluster at **~0.81** (expected text reflow at narrower width); `home-attorney` at 0.745 is media-dominant — explainable, **not a confirmed defect**.

---

## FINDINGS (candidate issues)

### F0 — [ROOT CAUSE, now FIXED in tests] Composite-first home broke the editor-interaction test suite (stale tests, not a builder bug)
Running the core editor-interaction Playwright suite against the live server first gave **6 of 7 FAILED**. Investigation proved this is **not a builder regression**:
- **By design:** `seed-home.ts:166` `createHomePageCanvasDocument` seeds the home as a **live-mirroring `composite` stack** (9 section nodes) — "mirrors the live tseng-law.com home exactly" — closing the builder-vs-site "괴리감". Element-level editing is unlocked by the **"decompose to edit"** action (`PageSwitcher → /api/builder/site/pages/decompose`, `STANDARD_PAGE_DECOMPOSERS`).
- **Proof it's intentional + working:** data-layer unit tests are green — `seed-composite-pages.test.ts` (29), `home-locale-repair.test.ts` (2), `decompose/route.test.ts` (4) = **35 passed**. Decomposing ko-home via the API produced **391 nodes incl. `home-hero-title`**, and the previously-failing `node-drag-axis` test then **PASSED (4.3s)**.
- **The defect was test-debt:** the shared `openBuilder` helper + ~6 tests assume the *old* decomposed-by-default home and were never updated for composite-first.

**FIX APPLIED** (`tests/builder-editor/helpers/editor.ts`): `openBuilder` now auto-detects a composite home (section node present, child node absent) and triggers the same in-app decompose API + reload before proceeding. Idempotent and self-limiting — a no-op for already-decomposed home and for non-home routes; no change to the 60+ other callers' behavior.

**VERIFIED:** focused run of the affected files went from **1 → 10 passing**. Now green: `node-drag-axis`, `inspector-layout`, interaction-regression *rotate* + *layers-rows*. `npm run typecheck` (full project): **passed, exit 0** — helper change is type-safe.

### F1 — [MED / UX-parity] Live public widgets occlude the editor canvas
Today's patches make the editor's public chrome auto-open the **AI 상담사 chat** (desktop) and the **2026 event popup** (compact/mobile) by default, to mirror the public site. Side effect: in the editor, the AI chat panel sits over the right portion of the canvas (`elementFromPoint` hits `floating-ai-chat-header` on the hero region). In a true Wix editor, live interactive widgets don't auto-open and block the editing surface.
- **Severity:** medium (dismissable via ×; clicks pass through at most points; not a crash).
- **Tension:** this is a *deliberate parity decision* in the active Codex workstream (see `.debug-journal.md` 11:40–12:25). Recommend **not** blind-reverting. Options: (a) in edit mode start widgets collapsed even though public opens them; (b) keep auto-open but make the overlay non-interactive / click-through in edit mode so the canvas beneath stays editable. **Needs a product call before changing.**

### F2 — [RESOLVED in iter 2] Section-boundary & compact-topbar test failures (all were stale, not builder bugs)
Reproduced & classified each of the 6. **Section-boundary geometry is actually correct** — live probe at 1440px: clearance `home-hero-search-input/button → home-insights-root` = **239px**, `home-insights-view-all → home-services-root` = **102px** (all ≥72px required); all boundary controls are top hit targets. After the decompose fix, `node-click-stability` is **10/11** (405/422/443/454 all pass). Root causes of the rest were stale test code from the composite-first seed rename:
- **`node-click-stability` :476** — `makeStaleBoundaryDocument` + `expectedSeed` called `createHomePageCanvasDocument('ko')` but edit/assert **decomposed** ids (`home-*-root`, `home-faq-list`, `home-hero-search-input`) → seed had none. **FIX:** point them at `createHomePageCanvasDocumentDecomposed`. → **PASS** (9.5s; the boundary-geometry self-heal migration runs correctly on the custom page).
- **`interaction-regression` :191 & :322** — `exactHomeTextControls` counted any control with `textContent === '홈'`, but the topbar page selector now renders `"페이지 "` kicker + `"홈"` (SandboxTopBar) → 0 matches. **FIX:** in `getInitialSmokeState`, count the `[data-builder-topbar-page-selector]` whose `pageDropdownCurrent` text is `홈` (preserves the "exactly one indicator" intent). → **:322 PASS**.

**Net:** of the original failing suite, **only :191 remains**, and it is **not a builder bug** → see F4. Helper change typecheck-clean (my 3 test edits have no TS errors).

### F5 — [VISUAL FIDELITY BUG — FIXED in iter 3] Decomposed Korean text breaks mid-word vs the live site
**The user's "디자인이 틀리거나 / 노드가 안맞거나" concern, found on screen.** When home is decomposed-to-edit, the hero title wrapped **"대만 법률을 한국" / "어로 명확하게."** — breaking the word **"한국어로" mid-syllable** — whereas the live/composite site wraps cleanly **"대만 법률을" / "한국어로 명확하게."**
- **Root cause:** `src/components/builder/canvas/elements/TextElement.tsx` hard-coded `wordBreak: 'break-word'` inline on every canvas text element (both the `className` path and the default typography path). That inline value overrode the `word-break: keep-all` that the live Korean site relies on (an inherited property, correctly propagated through the canvas ancestors — verified: `nodeBody`/`node`/`hero-copy` all computed `keep-all`, only the `<h1>` was `break-word`).
- **Fix:** removed the hard-coded `wordBreak: 'break-word'` and added `overflowWrap: 'break-word'` in both paths, so text inherits the site's word-break (keep-all for Korean, matching the live site) while long unbreakable tokens still wrap.
- **Verified:** hero now computes `word-break: keep-all`, wraps to **2 clean lines** ("대만 법률을" / "한국어로 명확하게."), screenshot confirms; overflow heuristic across all heading/paragraph nodes = **0**; services/FAQ sections render clean; `npm run typecheck` passes. Scope is decomposed/canvas text only (composite live components are unaffected).

### Home complex-section visual fidelity sweep (iter 8) — FAITHFUL
Composite (live mirror) vs decomposed, per complex home section:
- **services-bento** ✅ — identical accordion (투자·법인설립 / 민사소송·손해배상 / 가사소송 / 노동법·고용분쟁 / 형사소송…); the +184px / +6 `<img>` deltas are benign (slightly taller cards; service icons render as `<img>` vs inline SVG — visually identical).
- **faq-accordion** ✅ — all questions present (법인설립 절차, 자회사/지사, 퇴직금, 교통사고, 이혼, 양육권 … 10+), complete accordion; the −250-char delta is just composite rendering collapsed-answer text in the DOM while decomposed hides it. No missing items.
- **office-map-tabs** ✅ — *(false-alarm caught before reporting):* first screenshot showed a blank map area, but the map node **does** render the correct Google Maps `<iframe>` (`q=臺中市…&output=embed`, 535×340); a longer wait confirmed the full Taichung map + pin loads — the blank was just the slow headless embed, not a decompose bug.

**Methodology note:** as in iter 1's `[data-node]` selector slip, I verify suspected visual gaps (re-probe DOM / wait for async loads) before reporting — avoided filing a false "missing map" bug.

### Decompose data-source alignment audit (iter 11) — COMPLETE, F10-class isolated
Systematically checked every decompose builder's data source against its live component (the F10 bug was a data-source mismatch). **All aligned:**

| Section / page | Live component → data | Decompose builder → data | Match |
|---|---|---|---|
| services | ServicesBento → site-content + service-details | decompose-services → same | ✅ |
| attorney | HomeAttorneySplit → attorney-profiles + team-members | decompose-attorney → same | ✅ |
| stats | HomeStatsSection → site-content | decompose-stats → same | ✅ |
| contact | HomeContactCta → site-content | decompose-contact → same | ✅ |
| faq | FAQAccordion → faq-content | decompose-faq → same | ✅ |
| **insights** | InsightsArchiveSection → **insightsArchive** | decompose-insights → **insightsArchive (F10 fix)** | ✅ (fixed) |
| standard pages | `legacy-page-bodies` → pageCopy + faq-content + legal-pages + attorney-profiles | `decompose-page-*` → same | ✅ |

**Conclusion:** `decompose-insights` (formerly `getAllColumnPosts` vs the live `insightsArchive`) was the **only** data-source divergence; it's fixed. No other F10-class bugs across home sections or the 9 standard pages.

### Remaining home sections (iter 9): attorney / case-results / stats FAITHFUL; insights had a real data-source gap (F10, fixed)
- **home-attorney** ✅ — same photo (증준외), heading, bio, "변호사 프로필 보기" CTA; the −172px is just tighter vertical spacing (fixed-cursor vs CSS-margin, the F6 pattern), no missing content.
- **home-stats** ✅ — matches (height Δ+3px).
- **home-case-results** ✅ — same heading/content; −189px is the same minor-spacing pattern.

### F10 — [REAL fidelity gap — FIXED in iter 10] Decomposed `insights` showed different columns than the live site
**FIXED.** Aligned `decompose-insights.ts` `resolveInsightsPosts` to the live source: it now reads the curated **`insightsArchive[locale].posts`** with the *identical* mapping the live composite uses (`slug: post.id`, `featuredImage: post.image`, `categoryLabel: archive.categories[post.category]`), replacing `getAllColumnPosts`.
- **Verified (data-level, fresh re-decompose):** `home-insights-featured-title` = **"대만 헬스장 부상 소송"** (was "화장품…"), `home-insights-featured-link` = `/ko/columns/gym-injury-lawsuit` (post.id slug, matching live), list items = curated archive (화장품…) with correct dates/categories/summaries. `npm run typecheck` clean. → decomposed insights now mirrors the shipped site, per the project's "builder shows the page exactly as it ships" principle.

<details><summary>Original root cause (now resolved)</summary>
The home **insights** section header was faithful, but the **column set differed** between live and decomposed:
The home **insights** section header is faithful, but the **column set differs** between live and decomposed:
- Live composite (`composite/Render.tsx → resolveInsightsPosts`) reads the **curated `@/data/insights-archive`** → featured "대만 헬스장 부상 소송" + [화장품, 회사설립 심화편-2, 회사운영 자본금 회수].
- Decomposed (`decompose-insights.ts → resolveInsightsPosts`) reads **`getAllColumnPosts`** (every column `.md`, raw `fs.readdirSync` order) → featured "대만 화장품…" + a different list.
So decompose-to-edit shows a *different* insights archive than what ships — violating the project's "builder shows the page exactly as it ships" principle. (The earlier "duplicate column" reading was a **probe-selector artifact** — same post matched via both `h3` and `[class*="title"]`; only one `008-taiwan-labor-severance-law.md` exists — retracted.)
- **Severity:** medium — structure/layout of the section is faithful; only the data selection differs (content-fidelity, data-driven section).
(The live mapping turned out to use `slug: post.id` directly, so the fix was a clean source-swap — no `REAL_SLUG_TO_INSIGHT_ID` reverse mapping needed.)
</details>

### Standard-page decompose fidelity sweep (iter 4) — broadly GOOD
Verified all 9 ko standard pages (`about, services, contact, lawyers, faq, pricing, reviews, privacy, disclaimer`) composite→decompose:
- **All 9 decompose cleanly** (`POST /api/builder/site/pages/decompose` → 200).
- **Geometry preserved** — composite vs decomposed canvas `scrollHeight` identical on every page checked (services 2648, about 5781, contact 3499, lawyers 3774).
- **Content intact** — no real missing parts. The flagged "missing headings" (`대표 변호사`/`증준외` on about/lawyers) were a **false alarm**: the content is present, just re-tagged from `<h2/h3>` to `attorney-group-badge`/`attorney-card-role`/`attorney-card-name` (span/p/a). Decomposed text length is ≥ composite (editor HUD + per-element nodes), never less.
- **F5 word-break fix confirmed generalizing** — decomposed `about` hero "호정 소개" and body wrap cleanly (Korean keep-all), no mid-word breaks.

### F6 — [DOWNGRADED iter 5 — structurally correct] Page-header eyebrow spacing
Source review: `createPageHeaderSectionNodes` (decompose-page-shared) **faithfully replicates** the live `PageHeader.tsx` structure — same order (Breadcrumbs → SectionLabel → h1 → description → divider) and same classNames. The apparent drift is only minor **vertical spacing** (decomposer uses fixed-pixel cursors vs the live CSS margins). Not worth a risky pixel-tweak; closing as cosmetic.

### F7 — [REAL pre-existing fidelity bug — FIXED in iter 6] Inline-editing a class-styled title shrinks the text
**FIXED.** Root cause nailed via in-component instrumentation: entering inline edit fires `onBeforeStartEditing` **twice** (both `handleDoubleClick` and the `builder:start-text-edit` event listener in `useCanvasNodeInteractions`). Debug log proved it: `capture home-hero-title fontSize=73.6` then `capture …=16` — the **first** call captures the real display typography (73.6px), the **second** runs after the inline editor has mounted and re-captures the editor's own base font (16px), **clobbering** the good value, so `InlineTextEditor` rendered at 16px.
- **Fix** (`CanvasNode.tsx` `captureInlineTextStyleForEditing`): skip re-capture when the inline editor already exists under the node (`nodeRef.current.querySelector('[data-builder-inline-text-editor="true"]')`), so the first (display) capture wins.
- **Verified:** `inline-text-editor.playwright.ts` :209 + :354 now **pass**; full inline-text-editor + text-widgets suite **5/5 green** (was 3/5); `npm run typecheck` clean; debug log removed.

<details><summary>Original symptom (now resolved)</summary>
Found via the text-regression sweep (run to validate F5). Double-clicking a class-styled decomposed title (e.g. the home hero `home-hero-title`, class `hero-title`) to inline-edit renders the editor text at the node's base `fontSize` (~16px) instead of the **class's display size (~73.6px)** — the title visibly **shrinks while editing**, then restores on commit. Not Wix-like.
- **Evidence:** `inline-text-editor.playwright.ts` :209 ("preserves home hero title size") and :354 ("keeps class-based title size") fail with `|editorFontSize − displayFontSize|` = **55.68px** and **27.52px** (budget ≤1). Display measures correct (>48px); the ProseMirror editor measures ~16–18px.
- **Root cause (analysis):** `CanvasNode` passes `fontSize={inlineTextVisualStyle?.fontSize ?? typography?.fontSize ?? 16}` to `InlineTextEditor`. `inlineTextVisualStyle` is captured on `onBeforeStartEditing` (ordering is correct — before `setIsEditing(true)`) via `captureInlineTextVisualStyle`→`resolveInlineTextRenderElement`, but at editor-render time it is effectively null, so the editor falls back to the node's `fontSize` (16) which does not reflect the `.hero-title` CSS size. Exact runtime reason (capture returning null) needs in-browser instrumentation.
- **NOT my F5 change:** rigorously isolated — reverting both F5 edits and re-running reproduced **identical** failures (55.68 / 27.52). So F5 (word-break) is innocent; restored.
- **Fix direction (original guess, superseded by the real fix above):** make the editor inherit the display element's resolved typography.
</details>

### `openBuilder` change — regression-safety CONFIRMED (iter 7)
My iter-1 `openBuilder` auto-decompose touches 64 test files. Verified safe without the full (heavy/server-stressing) suite:
- **No test asserts composite home** — grep for composite-home expectations (9-node counts, composite markers) matched only my own helper. All 53 bare-home `openBuilder` callers were authored for the decomposed home.
- **Isolation proof:** for 2 tests that fail downstream, neutralizing the decompose made them fail *earlier* (`toBeVisible` on decomposed nodes absent in composite) — i.e., the decompose is *required* and my change is necessary + innocent, not the cause.

### Interaction sweep (iter 12): add-element WORKS; publish/clipboard blocked by dev-server instability
- **Add element from catalog** ✅ — `media-widgets.playwright.ts` "adds the M12 media widget presets from the catalog" **passes**. The catalog-drawer → drop-new-element flow works.
- **OPS-1 — [operational, not a builder-code bug] Next.js dev server corrupts under sustained automated load.** During multi-test runs (publish + clipboard + many decompose/create/publish API calls + my HMR-triggering edits), the dev server's **webpack cache corrupts**: log shows `ENOENT … .next-dev/cache/webpack/client-development/1.pack.gz` ("Caching failed for pack") → cascades to `MODULE_NOT_FOUND` on chunks and API routes returning the dev "missing required error components" 404 page; eventually the process stopped listening (`ECONNREFUSED`). UI routes (`/ko`, `/ko/admin-builder`) still served 200. **Recovery:** `pkill -f "next dev"; lsof -ti :3295 | xargs kill -9` then `PORT=3295 … npm run dev` (clean-next-build clears the cache). **This is dev-mode only** (huge ~1830-file app + on-demand compile + HMR), not a production/runtime builder bug — but it blocks reliable automated QA of heavy flows. **Recommendation:** verify publish/clipboard/heavy flows against a **production build** (`npm run build && npm start`) where there's no on-demand compile or webpack dev cache.
- **Publish** ✅ **VERIFIED WORKING (iter 13).** Direct API test on a fresh server: `POST /api/builder/site/pages → 200` (create), `POST …/{pageId}/publish → 200 in 1369ms` returning `{ok:true, publishedRevisionId, publishedRevision:0, publishedSavedAt}`, `DELETE → 200`. Code-confirmed: the canvas publish button (`usePublishActions.ts:111`) POSTs to exactly `/api/builder/site/pages/{id}/publish` (matches the test) after a save-draft PUT. So the iter-12 publish-UI *test* timeout was **dev-server fragility on the save step**, not a publish bug.
- **Delete / duplicate** ✅ — verified via `admin-builder-toolbar-actions` (passes; selection-toolbar reorder/duplicate/delete) in iter 1.
- **clipboard-persistence (Cmd+C/V/D + undo-after-reload)** ❓ — could **not** be verified: the dev server dies (`ECONNREFUSED`) on these tests' rapid page-create API calls (OPS-1). Light load (one create+publish+delete) works; heavier suites kill it. Re-test on a **production build**. (Cmd+C/V also needs clipboard permissions in headless.)
- **OPS-1 (updated iter 13):** confirmed the dev server tolerates light load but **dies under heavier automated suites** (multiple create/delete/publish calls) and even crashed once while idle. Builder *functionality* is fine; the dev *server* can't sustain heavy E2E. Use a prod build for full-suite QA.

### F12 — [REAL bug — FIXED iter 16] Right-column / lower-row staff cards render their content off-grid (about + lawyers)
Found via a **pure-function geometry audit** (no dev server — generates each decomposer's nodes and checks children against parent bounds). The staff grid builder (`decompose-page-shared.ts createAttorneyProfileSectionNodes`) laid 2-column staff cards out by offsetting nodes with `x += columnIndex×(548+gap)`, `y += rowCursor` — but it applied that offset to **every node, including each card's nested children** (which are card-relative). Result: right-column cards (and any lower row) had children at e.g. `x=588` *inside* a 548px card → rendered ~588px too far right (absolute ~1176px in an 1136px grid = **off-grid / clipped**). So half the staff (e.g. 손정민 / 황승평 on lawyers, the right column on about) had their photo/name/role/bio pushed off-screen — a real "노드가 안맞거나 / 없는 부분" bug.
- **Root cause:** the card ROOT (`parentId === gridId`) is grid-positioned and needs the offset; its descendants (`parentId === card`/nested) are card-relative and must NOT be offset — but the loop offset all of them.
- **Fix:** apply the column/row offset **only to the card root** (`node.parentId === gridId`); leave descendants card-relative.
- **Verified (pure-function geometry audit):** child-overflow flags went **lawyers 22→0, about 23→1** (the remaining `about` 1 is a benign 16px card-height tolerance). Left-column/row-0 cards unaffected (offset was 0 there). `npm run typecheck` clean. Affects `about` + `lawyers` decomposed pages (the staff grid).

## CODEX'S NEW COMPONENT-LIBRARY SESSION (2026-06-30 06:00-07:24) — FULLY VERIFIED, no bugs
After ~6h idle, Codex ran a ~1.5h session building component-library **review** features: **Update Review, Replace Selection, Restore Review, Remap Review, Review Diff** (helpers + UI + previews + tests). Verified at every level:
- **typecheck 0** throughout (mid-edit transients 1→2→4→0 all self-resolved — not reported as bugs, per discipline).
- **70 component-library unit tests pass** (24+ files; grew from 64 as Codex added tests).
- **Fresh prod build clean** — 414 static pages, 0 compile errors, new BUILD_ID.
- **Runtime E2E on the robust prod build (3300), isolated env** (`BUILDER_SITE_BACKEND=local` + `BUILDER_COLUMNS_BACKEND=local` + scratch `CONSULTATION_COLUMNS_DIR`, per the DATA-1 lesson): **8 passed** — component-library flow, editor-advanced-panels (3), **replace-remap** (Replace+Remap Review), **restore-version-thumbnails** (Restore Review), repeater↔component-library + rebind (2). Server survived.
- **OPS-1 note:** a CL Playwright run against the *dev* server (3295) reported "1 failed" while the server went 200→500 — confirmed an **OPS-1 dev-server-crash artifact** (the same tests pass clean on the robust prod build).
- **Observation (not a bug):** Codex re-seeded the site (new home pageId `page-1782767249143-1`); the home draft is now **composite (9 nodes, live-mirror, decompose-to-edit)** — `page.tsx:30` still aliases the decomposed seed, so this is a valid mode, not a regression.

## DATA-1 — [DATA HYGIENE, not a builder bug — iter 49] Columns page shows E2E test posts ("Visual Load More 1-10")
The public **columns** page renders test posts titled **"Visual Load More 1-10"** (created by the visual-regression "columns load-more" test) ahead of the real columns. Investigated:
- The columns store uses the **BLOB backend in production mode** (`src/lib/builder/columns/storage.ts` → blob unless `NODE_ENV!==production` or an explicit `*_BACKEND=local`); the local `runtime-data/consultation-columns/ko` dir is **empty**. So `next start` (NODE_ENV=production) reads columns from the **shared Vercel Blob**.
- The test posts are **accumulated E2E pollution** — present in `site.json` backups from **06-03 and 06-12** (pre-existing, from prior CI/test runs), and the live columns blob still carries them.
- **This is not a builder defect** — the builder faithfully renders whatever is in the CMS; the CMS just contains leftover test records.
- **Side-effect caveat (owned):** running data-creating E2E suites (visual-regression, clipboard) against the **blob-backed** prod build can **persist test records into the shared columns/pages store**. My iter-46/47 E2E added local `site.json` test pages (`visual-template-pet-home-*`) and touched the columns path. **Recommendation:** run such suites only against an isolated test blob/env (e.g. set `BUILDER_COLUMNS_BACKEND=local` + a scratch `CONSULTATION_COLUMNS_DIR`, and a throwaway `BUILDER_SITE_ROOT`) so verification never mutates shared/production data. I am **not** deleting blob records (risk to shared/production data) — flagged for the team to prune "Visual Load More" + `visual-template-*`/`g-editor-*` test entries from the columns blob + site store.

## PRODUCTION BUILD VERIFICATION (2026-06-30, iters 46-48)
Ran a real `next build` of the working tree (Codex WIP + my 6 fixes) and served it (`next start -p 3300`, `.next-build`) — closing the deferred prod-build gap.
- **Build clean:** 414 static pages generated, **0 compile errors** (2 react-hooks lint warnings only), `.next-build` 1.2G. Public `/ko` + `/ko/admin-builder` both 200; editor loads decomposed-default (391 nodes), 0 console errors. Public home + editor screenshot-confirmed.
- **E2E (the suites the dev server kept crashing on) — builder PASSES; "failures" are test-infra/stale/env, not builder bugs:**
  - ✅ interaction-core (drag/inspector/toolbar) **3/3**, advanced-panels+guides-grid **5/5**, click-regression **10/13** core pass.
  - ✅ **clipboard 3/3 + mobile-runtime M10 — now PASS after the F19 fix below** (were false-failing).
  - visual-regression "31 failed" = the inner `timeout 460` killed Playwright mid-baseline-**capture** at test 32/42 (env timeout, these are baseline-capture tests, not assertion failures).
- **Net:** no new real builder defects on prod; the 6 fixes hold; the editor + public both render correctly.

### F19 — [REAL test-infra bug — FIXED iter 47] Test helper `animation-delay: 0s` blanked delayed `forwards` animations → false failures
`tests/builder-editor/helpers/editor.ts:52` injected `animation-delay: 0s !important` on `*`. Combined with `animation-duration: 0s`, this collapsed delayed out-animations using `forwards` fill — notably the activity/save chip's `saveChipOut` (`... 1.42s forwards`, ending `visibility:hidden`, `SandboxPage.module.css`) — so the chip **mounted already-hidden**, breaking every `toBeVisible()` on it. Production reduced-motion (`globals.css`) only reduces *duration*, never the delay, so **real users always see the chip ~1.42s** — purely a test artifact. This is the true root cause of the clipboard "Undid:"/paste-chip failures (and my earlier F13). **Fix:** drop the `animation-delay` override (keep duration zeroing). **Verified:** clipboard 3/3 + mobile-runtime M10 now PASS on prod; advanced-panels (regression sample) still passes — no regression.

### Remaining click-regression failures — classified (NOT real builder bugs)
- **"keeps section-boundary controls as top hit targets" (72px clearance):** STALE assertion. Measured the **live public** hero: search bottom 958 vs next section top 931 = **−27px** — the live composite *itself* has the same search overflow the decomposed editor mirrors (−30px). So the decomposer is **faithful to the real site**; the 72px-clearance expectation no longer matches the (Codex-evolved) hero. The companion hit-target test (line 422) PASSES → the search is still clickable. (If the team wants the live hero search to not overlap the boundary, that's a live-site design tweak, not a decompose bug.)
- **"keeps mobile and tablet service and FAQ previews inside their sections":** the desktop canvas node `home-services-card-0-detail-0` is 0×0 in the editor's tablet device-preview, but the **live public tablet site (768px) shows the accordion detail correctly** (visible, in-view) — real users are unaffected. Editor-canvas-in-tablet-preview artifact / stale assertion, not a user-facing defect.
- **"top bar does not overlap at compact desktop width" (F20 — NOT a bug, overly-strict test):** the test flags the left icon-rail's first button `"페이지"` overlapping the canvas site logo `"법무법인 호정"` at 1024px. Investigated across widths and it is **expected fixed-stage scroll behavior, identical at every width — not a 1024 regression:** the canvas column is horizontally scrolled at **all** editor widths (stage `scrollWidth=1280` > column `clientWidth` 643@1024 / 899@1280 / 1059@1440), and the logo's left edge is **negative/clipped at every width** (`logoLeft` −27@1024, −117@1280, −37@1440; `logoVisLeftClipped: true` everywhere). So the logo's box has always extended under the 60px rail (the 1280 design stage simply needs horizontal scroll in a <1280 column — normal). The assertion only *trips* at 1024 because the taller wrapped top bar (`--editor-topbar-h` 72px vs 56px) shifts the rail button's & logo's `top` into the test's `top<100` + `overlapY>2` window; at 1280/1440 the same clipping exists but the math doesn't trigger, so the test passes. **No visual defect, no fix needed** — the rendering is consistent with ≥1280 where the suite is green. (If anything, the test's overlap heuristic could exclude horizontally-scrolled canvas content.) Confirms there are **no open builder layout bugs**.

### F16 — [i18n PRODUCT QUESTION, not a builder-mechanics bug — iter 43] Non-ko public pages show Korean page content with translated chrome
The site has **ko-only page entries** (13 ko pages; zh-hant/en are locale **projections**). Loading the public non-ko pages shows a consistent pattern across **every page** (home/about/services/pricing, both zh-hant **and** en): the **nav/chrome is translated** (服務領域 / 媒體中心 / Services / Media Center) but the **page body stays Korean** (home hero "대만 법률을 한국어로 명확하게.", "호정 소개", "업무분야", pricing "일반 법률상담"). Char ratios: zh-hant pages ~0.79-0.89 Korean, en/about ~0.97 Korean. This is the **same composite locale→ko content fallback flagged in iter 17** (the F10 "minor observation" — `composite/Render.tsx` uses the ko archive for non-ko). It is **systematic and likely intentional** (ko-primary site, chrome translated, page content not yet localized) — **a product-intent question for the team, not a builder defect.** Note the *builder decomposer* DOES carry per-locale translations (`pricingData['zh-hant']` = Chinese, `insightsArchive['zh-hant']` = 台灣健身房受傷訴訟), so if the team wants translated non-ko content the data largely exists — but this must NOT be "fixed" blindly without the product decision, and the live composite (the builder's mirror reference) currently renders ko. **No code change; surfaced for a product call.**

### F14 — [REAL bug — FIXED iter 37] Pricing decomposer creates a duplicate 0-height `page-pricing-grid`
Found via a standard-page spot-check (pricing editor showed near-empty) + pure-function probe: `decompose-page-pricing.ts` created the grid with placeholder `height: 0`, then — instead of mutating it — **pushed a COPY** with the real height, producing **two `page-pricing-grid` nodes (heights [0, 905])**. The duplicate id breaks the parent→child node tree (the 4 pricing cards' parent is ambiguous). **Fix:** mutate the grid node in place (`nodes[3].rect.height = maxBottom`), no duplicate. Verified pure-function: 1 grid, height 905, 0 zero-size nodes, 0 duplicate ids; typecheck clean. Re-decomposed the existing pricing draft → 70 nodes, 1 grid. (5th production fix.)

### F15 — [REAL bug — ROOT-CAUSED & FIXED iter 38] Pricing draft rejected by schema → editor showed a blank default template (6th prod fix)
The pricing page editor rendered only **5 generic nodes** (`headline-1, support-copy-1, cta-button-1/2, hero-image-1` — the blank-page default), not its 70-node content. **Root cause (traced end-to-end):** the draft GET route runs `prepareDraftDocument` → `normalizeCanvasDocument`, which **`safeParse`s the doc against `builderCanvasDocumentSchema` and, on ANY failure, discards the whole document and returns `createDefaultCanvasDocument` (the 5-node template)**. The pricing doc failed: 4 nodes (the card icon-text, one per card) had `content.fontSize: 11`, but the schema enforces **min 12** (types.ts:481/625) → 4 `too_small` issues → entire 70-node doc rejected → default fallback. (Localized by: disk draft = 70 valid nodes, but `normalizeCanvasDocument(disk-doc)` returned 5 → captured the 4 schema issues.) **Fix:** `decompose-page-pricing.ts:277` `fontSize: 11 → 12` (negligible in a 52×20 icon box). **Verified:** schema now parses, `normalizeCanvasDocument` keeps all 70 nodes, 0 sub-12 fonts, typecheck 0; re-decomposed → draft API returns 70 (recoveredFrom=draft); **editor now renders 70 nodes / 4 pricing cards** (일반 법률상담 NT$3,000, 민사·형사 소송, 법인설립, 자문계약 — full icons/titles/prices/details), grid height 887, 0 console errors. Screenshot-confirmed.

**Systemic note:** `normalizeCanvasDocument`'s all-or-nothing fallback means **any single sub-spec node silently blanks the whole page to a default template**. **Audit (iter 39):** ran every decomposer (11 standard pages + home) × 3 locales = **33 combinations** through `builderCanvasDocumentSchema.safeParse` + `normalizeCanvasDocument` → **0 failures, 0 shrinkage** — pricing was the only affected page; nothing else is silently blanked. Recommendation stands: the fallback should drop/repair the offending node rather than discard the whole document (so a future sub-spec node degrades gracefully instead of blanking the page).

### F13 — [investigated iters 33-34, NOT a builder bug] clipboard-persistence delete→undo test fails on the "Undid:" toast
One old (`06-12`) clipboard-persistence test (`persists Delete and Backspace removal with undo restore after reload`) fails: after keyboard **Delete** (which works — node removed), **Cmd+Z** doesn't surface the "Undid:" toast. Server **survived** (not the iter-12 crash). Investigated thoroughly — **undo is functional, this is a stale/flaky test:**
- Delete IS undoable — `deleteSelectedNode` → `applyCommittedDocument` → `pushHistory` + `canUndo=true` (store.ts:678,690).
- Keyboard undo IS wired — `shortcuts.ts:56` `{action:'undo', combo:'Mod+Z'}` → `useCanvasKeyboard` dispatches `'undo'` → `handleUndo()` → emits the "Undid:" toast (CanvasContainer:205). Delete uses the **same** dispatch path and worked.
- Undo/redo **passes** in `editor-advanced-panels` (iter 32).
So undo (button + Mod+Z) works; the old test's keyboard-undo toast assertion is the issue — likely a focus/guard nuance (`shortcuts.ts:102` ignores shortcuts when focus is inside a dialog/modal) or a stale flow from 06-12. **Not a builder bug; deferred as a test-maintenance item** (don't chase further — undo confirmed functional by 3 independent signals).

### iter 31 — F12 confirmed VISUALLY on the live decomposed-default lawyers page
Opened the re-seeded lawyers page (`page-1782736307624-9`, decomposed-by-default). The staff grid renders **perfectly**: both columns fully populated and aligned — left **장용선** (대만 변호사) + right **손정민** (한국 사무장), each with photo, name, role, email, and 소개/학력/경력. The right-column card's photo is aligned with its card (x 662 vs card 661 — 1px), confirming the F12 fix; **before F12 the right column's content was pushed off-grid (the "없는 부분/노드 안맞음" bug)**. 0 console errors. F12 verified visually + geometrically on the now-default decomposed lawyers page.

### iter 30 — decomposed-default now SITE-WIDE; site re-seeded
Codex re-seeded the site (new pageIds — home `page-1782736307617-8`, about `page-1782736343488-1`; the old ones are gone). Verified the decomposed-default switch now applies to **standard pages too**, not just home: opening the about page in the editor loads **decomposed by default** (193 `page-about-*` nodes, no composite marker, **0 console errors**) — consistent with home, and more Wix-like (every page immediately editable). The home runtime smoke also passed after Codex's core `CanvasStageNodes.tsx` edit (391 nodes, selection works, 0 errors). My F5/F12 fixes apply to these decomposed pages by default. (Initial "about showed home content" was a **stale pageId** from the re-seed — caught before reporting; 6th false alarm avoided.)

### Tablet viewport (iter 29) — CLEAN (gapless), false alarm corrected
Now that home is decomposed-by-default, verified tablet device-preview **without** the decompose API (which crashes the server). After scrolling to load all sections: the decomposed home at tablet stacks **perfectly gaplessly** — all 9 section roots present, `data-viewport=tablet`, tablet width, **gap=0 between every consecutive root** (hero 69→729, insights 729→2359, services →3832, attorney →4953, case-results →5565, stats →6186, faq →7602, offices →8634, contact). 0 console errors. The first probe's `maxGap=583`/`rootCount=8` was a **lazy-load measurement artifact** (measured before sections rendered) — verified before reporting (5th false alarm caught). **All viewports now verified gapless: desktop ✓ mobile ✓ tablet ✓.**

### iter 27 — transient mid-edit errors self-resolved (Component Library review-diff)
While Codex was editing `component-library-review-diff.helpers.ts` + copy (same minute), a snapshot showed **1 typecheck error + 2 failing tests**; re-checking ~1-2 min later (Codex still iterating) they were **gone** — typecheck **0**, review-diff/copy tests **pass**. Correctly not reported as bugs — transient mid-edit artifacts (the F3 pattern). The continuous-verification approach absorbs Codex's rapid iteration: catch a transient → re-verify → it resolves. Also noted: home disk draft stays composite (9) while the editor now shows decomposed (391) — the decomposed-default migration applies on load; content is equivalent (no data issue), persists to decomposed on first save.

### Codex's latest active work (iter 20) — Component Library — verified clean
Detected Codex's currently-building feature via recent mtimes: the **Component Library** (save/reuse components — `ComponentLibraryPanel`, `ComponentLibraryRestoreReview`/`UpdateReview`/`RemapReview`, `component-library-copy.*`, `useComponentLibraryEntries`, all edited within the last ~15 min). Verified the latest work:
- **Full-project `npm run typecheck`: 0 errors** — the entire (massively dirty) tree compiles cleanly; the earlier F3 `childrenMap` regression area is now stable.
- **Component-library + selection unit tests: 56 passed across 18 files** (panel controls/items, restore/update/remap review, copy, payload, field-remap, insert-flow, selection helpers/contract). No regressions in Codex's active feature.
Browser-integration verification of the panel is pending a stable server (OPS-1).
- **iter 21 (Codex still active):** Codex kept editing the restore-review helpers + touched **core canvas** (`CanvasContainer.tsx`, `SandboxPage.tsx`). Re-verified mid-edit: typecheck **0 errors**, restore-review tests **5/5**, and the canvas **render-contract / selection / flow** unit tests **12/12** — the core-canvas edits didn't regress selection/rendering/flow. No regressions in Codex's active work.
- **iter 22 (runtime smoke after core edits):** Codex also edited `SandboxEditorWorkspace.tsx` + `ComponentLibraryRestoreReviewPreviews.tsx` (mid-edit). Confirmed the **live editor still works end-to-end**: `/ko/admin-builder` 200, editor ready, **391 nodes render, node selection works, inspector populates (all tabs), 0 console errors**, server survived. So the recent core-canvas edits have no runtime regression.
- **iter 23 (Component Library browser-integration):** ran `component-library/admin-builder.playwright.ts` ("saves, renames, duplicates, searches, sorts, and re-inserts a reusable selection") against the live server. The **core library flow passed** (the test reached the restore-review step at line ~337); it then failed asserting the restore-review version text — but `ComponentLibraryRestoreReview.tsx` **and** that test both have mtime = the same minute (Codex actively refactoring restore-review + its test live; the asserted "Updated reusable source" copy no longer exists). So it's a **mid-edit artifact, not a bug** — the Component Library core (save/rename/duplicate/search/sort/re-insert) works in the browser; re-verify restore-review once Codex settles. Server survived.
- **iter 24 (restore-review settled → re-verified PASS):** ~4 min after Codex's last restore-review edit, re-ran: typecheck **0**, restore-review unit tests **5/5**, and the full Component Library Playwright test **PASSES (6.7s)** — save/rename/duplicate/search/sort/re-insert **+ restore-review** all work end-to-end in the browser. Confirms the iter23 failure was purely mid-edit. **Component Library (Codex's active feature) fully verified.**
- **iter 25 (Codex edited the main builder route):** `admin-builder/page.tsx` + `CanvasContainer.tsx` edited. Verified: typecheck **0**, runtime smoke (admin-builder 200, editor ready, nodes render, selection works, inspector populates, **0 console errors**), server survived. No regression from the route/core edit.
- **iter 26 (Codex switched home to DECOMPOSED-by-default — addresses iter-1 concern):** `page.tsx:30` now imports `createHomePageCanvasDocumentDecomposed **as** createHomePageCanvasDocument` — the home editor now opens **decomposed (immediately editable)** instead of composite-first. Verified on raw load: `home-hero-title` present, 391 nodes, **0 console errors**, server survived. This is *more* Wix-like (the composite-first "can't edit until you decompose" friction I flagged in iter 1 is gone). **Bonus: my fidelity fixes now apply to the default experience** — the hero title computes `word-break: keep-all` + `overflow-wrap: break-word` (F5), text intact. Codex's improvement and the F5/F7/F12 fixes converge on the default editor.

### Content-completeness audit (iter 19) — no missing parts on list pages
Pure-function check that list-heavy decomposed pages include **all** their data-source items (catching silent drops / "없는 부분"):
- **faq**: `faqContent.ko` = 13 → decomposed faq items = **13** ✅
- **lawyers**: `teamContent.ko.members` = 4 → **2 lead cards + 2 staff cards = 4** ✅ (the grid correctly splits the 2 lead attorneys from the 2 staff)
- **services**: `getServiceSlugs()` = 6 → decomposed service cards = **6** ✅
No silent truncation. (Home insights intentionally shows featured + 3 — a homepage preview matching the live, not the full archive.)

### Multi-locale decompose audit (iter 18) — geometry CLEAN, insights locale-correct
Ran the pure-function geometry + off-canvas + insights audits for **zh-hant and en** (decompose builders are locale-parameterized):
- **Geometry/off-canvas:** `zh-hant` and `en` both **0 off-canvas, 0 orphan, 0 severe-overflow** across all pages — F12 fix + geometry soundness hold for all locales.
- **Insights (F10) locale fidelity:** ko featured "대만 헬스장 부상 소송", **zh-hant "台灣健身房受傷訴訟"** (correct Chinese), en — both decompose **and the live composite** use `insightsArchive[locale==='en'?'ko':locale]`, so en shows the ko archive; decompose mirrors live exactly. 3 list items each, non-empty.
- **Minor observation (live, not decompose):** the live en home insights uses the **ko** archive even though `insightsArchive.en` exists (an en→ko i18n fallback in `composite/Render.tsx`). Decompose correctly mirrors it; whether en should surface English column titles is a separate live-site i18n question for the team.

### Absolute-position boundary audit (iter 17) — CLEAN across all pages
After the F12 fix, a pure-function audit resolving each node's **absolute** position (full parent chain) vs the **1280px stage** found **0 off-canvas nodes** across home + all 9 standard pages. So no node renders past the horizontal stage boundary anywhere. This confirms F12 is complete and that the remaining parent-relative overflow flags from iter 16 (home 38 / services 20 / contact 3) are **by-design** — accordion/dropdown content that overflows its *collapsed* parent but stays within the stage (expands on interaction), office-tab stacks, and layered hero media — **not** boundary violations. The decompose geometry/alignment is sound.

### F11 — [FALSE ALARM, RETRACTED iter 15] "Decomposed home doesn't reflow at mobile"
The iter-14 mobile "gaps" were a **pre-auto-fit timing artifact** (screenshot taken before the 391-node mobile auto-fit completed), **not a real bug.** Proven with a pure-function test (no dev server): feeding `createHomePageCanvasDocumentDecomposed('ko').nodes` to `autoFitMobileTree(nodes, 375)` yields a **perfectly gapless, in-bounds mobile layout** — all 9 section roots stack with **gap = 0** between every consecutive pair (hero y0 h240 → insights y240 h369 → services y609 → … → contact y2280 h188), **0 roots overflow** 375px. Mechanism: entering mobile mode calls `autoFitMobileTree` (`store.ts:804`) which lays roots out via `cursorY += round(root.height × scale)` (gapless) and scales children by the root scale. So decomposed-mobile reflow **works**; the raw nodes having only desktop rects is expected (auto-fit synthesizes the mobile overrides on viewport entry). Lesson reinforced (cf. offices map, insights "duplicate"): verify suspected visual gaps before reporting.

### OPS-1 recovery insight (iter 14): sequential warm avoids the vendor-chunk race
Pinned the dev-server corruption trigger: **concurrent requests during initial on-demand compile** race the webpack vendor-chunk generation → `Cannot find module './vendor-chunks/zod.js'` → 500/MODULE_NOT_FOUND. Also found leftover `sh -c`/npm parents from repeated `nohup npm run dev` were cycling/conflicting. **Reliable recovery:** kill the whole tree (`for p in $(pgrep -f "next dev|next-server|clean-next-build|sh -c node"); do kill -9 $p; done`), `rm -rf .next-dev`, start once, then **warm routes sequentially (one at a time, full compile each) before any parallel load.** After this the server stayed stable for the responsive probe.

### F8 — [RESOLVED iter 28] M28 editor advanced panels and guides/grid pass on production
The remaining F8 checks now pass against a fresh production build/start:
- `editor-advanced-panels.playwright.ts` verifies layers, layer search, element comments, Component Library save/insert, style copy/paste, align/distribute, zoom dock, shortcut map save, custom duplicate shortcut, context-menu shortcut glyph, duplicate via custom shortcut, undo/redo timeline, and editor theme toggle.
- `editor-guides-grid.playwright.ts` verifies rulers, grid snap toggle, grid-size update, custom guide creation, outline-view enabling, hide-content gating, media hiding, and media restore.
- **iter 32 corroboration (independent):** re-ran both files against the live **dev** server (with home now decomposed-by-default, so no decompose-API needed) → **5 passed (17.9s)**, server survived. So F8 passes on dev too, not just a prod build. The iter-7 failures were the dev-server/decompose-timing instability (the tests opened a composite home that then needed decompose mid-test), now gone with decomposed-default.
- A stale strict-mode assertion in `editor-advanced-panels.playwright.ts` was scoped to the Component Library saved item because the saved name also appears in the new shortcut tray. That failure was a test selector collision, not a product failure.
- Production evidence: `npm run build` passed with existing warnings only; warmed `GET /ko/admin-builder` on `http://127.0.0.1:3303` returned `200` and 840601 bytes; `BASE_URL=http://127.0.0.1:3303 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts tests/builder-editor/editor-guides-grid.playwright.ts --project=chromium-builder --reporter=line --workers=1` -> **5 passed**.
- Dev-server note: one post-fix dev rerun still hit OPS-1 (`data-editor-ready=false` on the third test plus missing trace artifact), while the production run passed. Treat production as the source of truth for F8.

### F3 — [RESOLVED by Codex] Live typecheck regression in component-library `childrenMap`
`npm run typecheck` now fails with 2 errors (it was **clean in iter 1**, so this regressed in the last few minutes):
- `component-library-selection.helpers.ts:18` and `ComponentLibraryPanel.tsx:81` — `Record<string,string[]>` ↔ `ReadonlyMap<string, readonly string[]>` mismatch for `childrenMap`.
Cause: the canvas store's `childrenMap` was mid-migration **Record → ReadonlyMap**, leaving `getCanvasNodeDescendantIds`/`serializeComponentLibrarySelection` typed as `Record`. **Iter-3 re-verify: RESOLVED** — Codex's 17:19 edit to `ComponentLibraryPanel.tsx` settled it (the store kept `childrenMap: Record<string,string[]>`, consistent with all callers); `npm run typecheck` is now **clean (exit 0)**. The iter-2 decision to NOT touch active files and re-verify was correct — Codex fixed it itself, with zero collision risk to its uncommitted work (memory: `feedback_uncommitted_checkout_danger`).

### F4 — [RESOLVED 2026-06-30] `interaction-regression` :191 move-preview perf threshold was dev-server only
After the F2 fix, :191 cleared all functional checks (selection, direct-move preview appears with correct id, ghosts/origins, cleanup, resize preview + readouts) and failed only on `firstMovePreviewMs < 160` in the dev server. Three dev runs measured **182.8 / 160.8 / 161.7 ms** — consistently 0.8–23ms over a 160ms budget, plus one occasional resize-preview timing flake.

Production verification on 2026-06-30 confirms this was an environment threshold issue, not a builder bug. The 160ms budget was **left intact**:
- `npm run build` -> passed with existing CSS/lint warnings only; 414 static pages generated.
- `PORT=3304 npm run start`; authenticated warm `GET http://127.0.0.1:3304/ko/admin-builder` -> `200`, 841081 bytes.
- `BASE_URL=http://127.0.0.1:3304 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder-interaction-regression.playwright.ts -g "keeps home, menu, and direct interaction previews stable" --project=chromium-builder --reporter=line --workers=1` -> **1 passed**.
- Same command with `--repeat-each=3` -> **3 passed (1.5m)**.

Conclusion: move/resize preview functionality and the `<160ms` first-preview budget pass on a warmed production build. Treat future dev-only misses here as OPS-1/dev-server noise unless the same focused test fails on `next start`.

### Preview mode — [RESOLVED 2026-06-30] modal uses draft routes for standard pages and public fallback for custom pages
The preview modal previously built its iframe URL with the public page path, so standard pages such as home opened `/ko` instead of the draft-aware builder preview route. That hid unpublished draft changes in the modal and made the editor feel different from a Wix-style preview.

Fix: `SandboxModalsRoot` now resolves preview URLs through a helper. `home/about/contact` route to `/{locale}/builder/{pageKey}?mode=preview`; custom/non-standard pages still use the public path fallback to preserve existing custom-page preview behavior.

Verification:
- Red check: focused helper test first failed because the resolver did not exist.
- `npm run test:unit -- src/components/builder/canvas/__tests__/SandboxModalsRoot.helpers.test.ts src/lib/builder/__tests__/site-href.test.ts src/components/builder/canvas/__tests__/component-library-replace-selection.helpers.test.ts` -> **3 files / 7 tests passed**.
- `npm run typecheck` -> **passed**.
- Isolated production build (`NEXT_DIST_DIR=.next-codex-preview-build npm run build`) -> **passed**, 414 static pages generated. The isolated dist dir avoided the known dirty-workspace `.next-build` multi-server artifact race.
- Warmed `GET http://127.0.0.1:3305/ko/admin-builder` with basic auth -> `200`, 869000 bytes.
- `BASE_URL=http://127.0.0.1:3305 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder-preview-mode.playwright.ts --project=chromium-builder --reporter=line --workers=1` -> **1 passed**.
- `BASE_URL=http://127.0.0.1:3305 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder-click-audit.playwright.ts --project=chromium-builder --reporter=line --workers=1` -> **1 passed**.
- Follow-up custom fallback proof: the focused spec now creates a disposable custom page, publishes it, opens the builder by pageId, opens preview, verifies the iframe `src` is `/ko/{slug}` on desktop and mobile, and verifies the unique published text renders inside that iframe.
- Isolated production build (`NEXT_DIST_DIR=.next-codex-preview-custom-build npm run build`) -> **passed**, 414 static pages generated.
- Warmed `GET http://127.0.0.1:3306/ko/admin-builder` with basic auth -> `200`, 869000 bytes.
- `BASE_URL=http://127.0.0.1:3306 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder-preview-mode.playwright.ts --project=chromium-builder --reporter=line --workers=1` -> **2 passed (1.3m)**.

### Add panel layout widgets — [RESOLVED 2026-06-30] catalog insertion persists without schema fallback
The Add panel layout-widget pack had a production-only persistence failure: click insertion looked successful, but the saved draft could be rejected by `normalizeCanvasDocument` on readback and replaced with the sandbox fallback template.

Root cause: `layout-sticky-anchor` persisted `content.borderRadius: 999`, while container content schema allows only `0..48`. The runtime rejection path was exactly `nodes.8.content.borderRadius`, matching the ninth clicked layout preset.

Fix: sticky-anchor persisted content radius is now `48`, preserving the pill-like shape at its 86px height while staying schema-valid.

Verification:
- Red unit: `npx vitest run src/components/builder/canvas/__tests__/layout-widget-presets-schema.test.ts` failed on `layout-sticky-anchor ... content.borderRadius ... expected number to be <=48`.
- Green unit: same command -> **1 passed**.
- `npm run typecheck` -> **passed**.
- No-excuse checker on touched TS files -> **No violations in 3 file(s)**.
- Isolated production build (`NEXT_DIST_DIR=.next-codex-add-panel-build npm run build`) -> **passed** with existing warnings only.
- Warmed `GET http://127.0.0.1:3307/ko/admin-builder` with basic auth -> `200`, 869000 bytes.
- `BASE_URL=http://127.0.0.1:3307 npx playwright test --config=playwright.config.ts tests/builder-editor/layout-widgets.playwright.ts --project=chromium-builder --reporter=line --workers=1` -> **1 passed (1.3m)**. The test now inserts all layout presets, waits for autosave, reloads the same page, and reasserts all layout/sticky markers.
- Server log after the green production run emitted **no** `normalizeCanvasDocument` schema fallback.

Scope note: this resolves Add panel click insertion + autosave + reload persistence for the layout widget pack.

### Add panel drag-positioned layout preset drop — [RESOLVED 2026-06-30] production-verified
The Add panel now has a verified drag-positioned layout preset path, not just quick-add insertion. The `layout-tabs` preset is dragged from the Add drawer, dropped onto a requested canvas coordinate, materialized with preset width/height/content/style, autosaved, and reloaded from the same page draft.

Verification:
- Unit: `npm run test:unit -- src/components/builder/canvas/__tests__/layout-widget-presets-schema.test.ts` -> **2 passed**. The second test covers `createCatalogDropNode` for `layout-tabs` at `{ x: 312, y: 188 }`.
- `npm run typecheck` -> **passed**.
- No-excuse checker on the five focused drag/drop files -> **No violations in 5 file(s)**.
- Isolated production build (`NEXT_DIST_DIR=.next-codex-add-dnd-build npm run build`) -> **passed** with existing warnings only.
- Warmed `GET http://127.0.0.1:3308/ko/admin-builder` with basic auth -> `200`.
- `BASE_URL=http://127.0.0.1:3308 npx playwright test --config=playwright.config.ts tests/builder-editor/layout-widgets.playwright.ts --project=chromium-builder --reporter=line --workers=1` -> **2 passed (2.3m)**. The second test dispatches `dragstart`, `dragover`, and `drop` with a shared `DataTransfer`, asserts the inserted tabs widget bbox is within 2px of the requested canvas point, waits for autosave, reloads the page, and reasserts the widget.
- Visual QA on production port 3308 captured desktop and 390px mobile Add drawer screenshots; mobile reported `scrollWidth=390`, `clientWidth=390`, `overflow=false`.

### Add panel cross-category widget preset drag sweep — [RESOLVED 2026-06-30] production-verified
The Add panel now has production evidence for drag-positioned widget preset insertion across the representative text, media, gallery, and navigation groups. The schema/materialization test covers every widget preset payload group, while the browser proof renders `rich-text`, `before-after`, `gallery-slider`, and `nav-anchor-menu` at distinct requested canvas coordinates and verifies autosave/reload persistence.

Verification:
- Unit: `npm run test:unit -- src/components/builder/canvas/__tests__/widget-preset-drop-schema.test.ts` -> **1 passed**. The test encodes, parses, materializes, and document-schema-validates all text/media/gallery/layout/interactive/navigation/social/location/decorative/designer widget presets.
- `npm run typecheck` -> **passed**.
- No-excuse checker on the focused drag/drop files -> **No violations in 5 file(s)**.
- Isolated production build (`NEXT_DIST_DIR=.next-codex-add-sweep-build npm run build`) -> **passed** with existing warnings only.
- Warmed `GET http://127.0.0.1:3309/ko/admin-builder` with basic auth -> `200`.
- `BASE_URL=http://127.0.0.1:3309 npx playwright test --config=playwright.config.ts tests/builder-editor/add-panel-widget-drag.playwright.ts --project=chromium-builder --reporter=line --workers=1` -> **1 passed (1.2m)**. The test dispatches drag/drop from the Add drawer to the canvas, asserts each inserted node bbox is within 2px of the requested canvas point, waits for autosave, reloads the same page, and reasserts all four rendered markers.
- Visual QA captured desktop and 390px mobile Add drawer screenshots from production port 3309. Desktop is clean; mobile can reach the navigation preset. The compact editor bottom inspector/status strip cramping observed in that pass is now resolved in the mobile compact editor section below.

### Publish UI flow — [RESOLVED 2026-06-30] production-verified
The direct publish flow now has a narrow production proof through the actual editor UI, not only the API. A disposable page is opened in `/ko/admin-builder`, the toolbar Publish button opens the modal, current site-wide translation warning acknowledgement is completed when required, warning override is reviewed, the final publish button sends the page publish POST, success UI appears, and the public `/ko/{slug}` page hydrates with the published title and no critical browser errors.

Verification:
- Red/current-state proof: the focused publish UI spec initially failed on production port 3310 because no publish POST was emitted. Runtime probe showed the modal correctly kept final `발행` disabled until `다른 페이지 경고 확인` acknowledged the current site-wide translation warning policy (`98` other-page warnings in this local dataset).
- Test hardening: `tests/builder-editor/admin-builder-publish-success-ui.playwright.ts` now clicks `[data-builder-publish-site-translation-acknowledge="true"]` when present and asserts `[data-builder-publish-site-translation-acknowledged="true"]` before warning override and final publish.
- Isolated production build (`NEXT_DIST_DIR=.next-codex-publish-ui-build npm run build`) -> **passed** with existing warnings only.
- Warmed `GET http://127.0.0.1:3310/ko/admin-builder` with basic auth -> `200`.
- `BASE_URL=http://127.0.0.1:3310 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder-publish-success-ui.playwright.ts --project=chromium-builder --reporter=line --workers=1` -> **1 passed (53.5s)**.

### Scheduled publish UI flow — [RESOLVED 2026-06-30] production-verified
The scheduled publish flow now has production proof through the same main Publish modal, not only API/cron unit coverage or a dev-server browser run. A disposable Korean page is created, `/ko/admin-builder` opens it, the toolbar Publish modal schedules a future publish, the scheduled status hydrates after closing/reopening the modal, cancellation clears the job, and the scheduled-publish API returns `job: null` after cancellation.

Verification:
- Unit/API/cron gate: `npm run --silent test:unit -- 'src/app/api/builder/site/pages/[pageId]/scheduled-publish/route.test.ts' 'src/app/api/builder/site/pages/[pageId]/scheduled-publish/route-site-routing.test.ts' src/app/api/cron/scheduled-publish/__tests__/route.test.ts` -> **3 files / 14 tests passed**.
- Isolated production build (`BLOB_READ_WRITE_TOKEN= BUILDER_SITE_BACKEND=local CONSULTATION_LOG_BACKEND=local NEXT_DIST_DIR=.next-codex-scheduled-prod-build npm run build`) -> **passed** with existing repo warnings only.
- Production server used local scratch persistence (`BUILDER_SITE_ROOT=/tmp/tseng-scheduled-site.trbkRp`, `BUILDER_SCHEDULED_PUBLISH_ROOT=/tmp/tseng-scheduled-jobs.Qb93En`) so the test did not write scheduled jobs or pages to shared Blob storage.
- Warmed `GET http://127.0.0.1:3314/ko/admin-builder` with basic auth -> **200**, `210030` bytes.
- `BASE_URL=http://127.0.0.1:3314 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder-scheduled-publish-ui.playwright.ts --project=chromium-builder --reporter=line --workers=1` -> **1 passed (1.9s)**.
- Visual QA screenshot `/tmp/tseng-law-scheduled-publish-ui.png` showed the Korean modal scheduled state, datetime input, scheduled status pill, cancel action, and publish controls visible without clipping or overlap.

### Page switching / admin route return — [RESOLVED 2026-06-30] production-verified
The page-switching proof now covers the home hero after editor page switching, builder header navigation, admin subroute round trips, a locally edited page round trip with the home draft request delayed, and public `/ko` navigation. Admin subroute back controls now return to the editor root with a native anchor, and the public home assertion tracks the current composite published hero DOM.

Verification:
- Red/current-state proof on production port 3311: the focused file initially reported **3 passed / 4 failed**. Admin back stayed on `/ko/admin-builder/cms` or `/ko/admin-builder/apps`, and the public checks used stale `.builder-site-header` / `[data-node-id="home-hero-media-image"]` selectors.
- `AdminNavRail.tsx` and `BuilderAdminBackBar.tsx` now use native `<a href="/{locale}/admin-builder">` controls for editor-root return.
- The focused spec waits for URL/editor/hero state after the back click and accepts both decomposed/editor and current composite published hero image surfaces.
- Isolated production build (`NEXT_DIST_DIR=.next-codex-page-switch-build npm run build`) -> **passed** with existing warnings only.
- Warmed `GET http://127.0.0.1:3311/ko/admin-builder` with basic auth -> `200`, `870235` bytes.
- `BASE_URL=http://127.0.0.1:3311 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder-home-image-navigation.playwright.ts --project=chromium-builder --reporter=line --workers=1` -> **7 passed (4.8m)**.
- Static gates: `npm run typecheck` -> **passed**; no-excuse checker on the three focused files -> **No violations in 3 file(s)**; `git diff --check` -> clean.
- Visual QA screenshots from the same production server confirmed desktop rail back, mobile back pill, restored editor root, and public home hero render. The CMS admin page still shows unrelated broader layout cramping/overlap, so pixel-fidelity work remains open.

### Mobile compact editor polish — [RESOLVED 2026-06-30] production-verified
The mobile compact editor no longer squeezes the bottom inspector/status strip. Empty status pills are not rendered, the mobile status bar is 24px, the shortcut hint is hidden on narrow screens, and drawer/inspector heights now adapt to short mobile viewports without overlapping the status bar.

Verification:
- Red proof on production port 3312: the hardened compact editor spec failed before the fix with inspector height **168.796875px < 204px**. A short 360x740 case also failed with `inspector bottom 746px > editor shell bottom 716px`, proving the status-bar overlap.
- Implementation: `SandboxStatusBar.tsx` skips zero-value selection/save items and marks the shortcut item for compact hiding. `SandboxPage.module.css` adds mobile status bar compaction plus height-aware `--compact-drawer-h` / `--compact-inspector-h` values, with a taller-phone override at `min-height: 800px`.
- Isolated production build (`NEXT_DIST_DIR=.next-codex-compact-editor-build npm run build`) -> **passed** with existing warnings only.
- `BASE_URL=http://127.0.0.1:3312 npx playwright test --config=playwright.config.ts tests/builder-editor/compact-editor-drawer-inspector-fit.playwright.ts --project=chromium-builder --reporter=line --workers=1` -> **2 passed (1.1m)**.
- Static gates: `npm run typecheck` -> **passed**; no-excuse checker on `SandboxStatusBar.tsx` and the focused Playwright spec -> **No violations in 2 file(s)**; `git diff --check` -> clean.
- Visual QA: final 360x740 metrics show `scrollWidth=clientWidth=360`, inspector bottom `716px`, status top `716px`, status height `24px`, shortcut hidden, and zero empty status items. Final 390x844 metrics show inspector `211px`, status top `820px`, no overlap, and zero horizontal overflow. Before/after image diff dimensions matched and `alphaChannelIntact=true`; hotspot changes are the intended canvas/inspector/status repositioning.

### Saved-section/template drag + nested container drop — [RESOLVED 2026-06-30] production-verified
The Add panel drag/drop path now has production evidence for saved sections, built-in section templates, and deepest-container targeting. Current source uses explicit drag MIME payloads for saved-section cards and built-in section template cards, then resolves the drop context through the pointer's deepest unlocked container so inserted nodes persist with the right parent and parent-local coordinates.

Verification:
- Unit: `npm run test:unit -- src/components/builder/sections/__tests__/saved-sections-panel-contract.test.ts src/components/builder/canvas/__tests__/built-in-section-template-drop-schema.test.ts src/components/builder/canvas/__tests__/widget-preset-drop-schema.test.ts src/components/builder/canvas/__tests__/layout-widget-presets-schema.test.ts` -> **4 files / 6 tests passed**.
- Isolated production build (`NEXT_DIST_DIR=.next-codex-save-nest-build npm run build`) -> **passed** with existing repo warnings only.
- `BASE_URL=http://127.0.0.1:3313 npx playwright test --config=playwright.config.ts tests/builder-editor/add-panel-section-template-drag.playwright.ts tests/builder-editor/saved-section-drag.playwright.ts tests/builder-editor/add-panel-nested-container-drop.playwright.ts --project=chromium-builder --reporter=line --workers=1` -> **3 passed (3.6m)**.
- The production browser gate covers: saved-section card drop at requested canvas coordinates with root-only selection, draft rect persistence, and reload persistence; built-in `services-accordion` section-template drag/drop with draft rect persistence and reload persistence; and rich-text preset drag/drop into a seeded nested container with `parentId` set to the nested target, local rect around `{ x: 48, y: 40 }`, and reload persistence.

### Multi-select chrome + layout actions — [RESOLVED 2026-06-30] production-verified
Multi-selection now has production evidence beyond visible localized chrome. A disposable Korean page is created with three independent text nodes, `/ko/admin-builder` modifier-clicks all three, and the inspector's multi-select batch controls are clicked against the real canvas store. The proof reads the page draft after each action, then reopens the builder and verifies the persisted rects again.

Verification:
- Unit/source contract gate: `npm run --silent test:unit -- src/components/builder/canvas/__tests__/selection-overlay-copy.test.ts src/components/builder/canvas/__tests__/canvas-selection-render-contract.test.ts` -> **2 files / 7 tests passed**.
- Isolated production build (`BLOB_READ_WRITE_TOKEN= BUILDER_SITE_BACKEND=local CONSULTATION_LOG_BACKEND=local NEXT_DIST_DIR=.next-codex-multiselect-build npm run build`) -> **passed** with existing repo warnings only.
- Production server used scratch local persistence (`BUILDER_SITE_ROOT=/tmp/tseng-multiselect-site.X9QpN7`, `CONSULTATION_LOG_ROOT=/tmp/tseng-multiselect-consult.bddHuk`) so the disposable page did not write to shared Blob storage.
- `BASE_URL=http://127.0.0.1:3315 npx playwright test --config=playwright.config.ts tests/builder-editor/multi-selection-layout-actions.playwright.ts tests/builder-editor/multi-selection-localized-chrome.playwright.ts --project=chromium-builder --reporter=line --workers=1` -> **2 passed (8.6s)**.
- The new layout proof verifies initial draft rects, then `align top` -> `y=[140,140,140]`, `match height` -> `height=[64,64,64]`, and `distribute horizontal` -> `x=[120,400,720]`, followed by a reopen/reselect persistence check.
- Visual QA screenshot `/tmp/tseng-law-multi-selection-layout-actions.png` showed three selected nodes, Korean `3개 선택됨` chrome, the inspector's multi-select batch controls, and saved state without incoherent overlap at the tested desktop viewport.

### Home composite hero fidelity — [RESOLVED 2026-06-30] production-verified
The live-mirror composite `home-hero` now matches the public `/ko` first hero section geometry and font inheritance in the real `/ko/admin-builder`. The original editor-stage CSS had a broad `.hero` override that also hit composite sections, removing public `min-height`/padding and collapsing the hero to `496px` in the builder while `/ko` rendered `820px`.

Fix:
- Scope the old min-height/padding reset to decomposed `[data-node-id='home-hero-root']` only.
- For composite `[data-node-id='home-hero'] .hero`, remove only the public header compensation margin inside the editor canvas and restore `font-family: var(--font-body)` so subtitle/search inherit the same public `IBM Plex Sans KR` stack instead of the editor shell's `Inter/Pretendard`.

Verification:
- Red proof before fix: `tests/builder-editor/home-composite-fidelity.playwright.ts` failed with builder hero height `496` vs public `820`.
- Isolated production build (`BLOB_READ_WRITE_TOKEN= BUILDER_SITE_BACKEND=local CONSULTATION_LOG_BACKEND=local NEXT_DIST_DIR=.next-codex-fidelity-build npm run build`) -> **passed** with existing repo warnings only.
- `BASE_URL=http://127.0.0.1:3316 npx playwright test --config=playwright.config.ts tests/builder-editor/home-composite-fidelity.playwright.ts --project=chromium-builder --reporter=line --workers=1` -> **1 passed (3.1s)**.
- The focused browser proof compares normalized `hero`, `hero-title`, `hero-subtitle`, and `hero-search-bar` rects plus the computed font-family map between public `/ko` and builder `/ko/admin-builder`.
- Visual QA screenshots from the same production server were reviewed after hiding public popup/header/chat and editor ruler/inspector/floating toolbar for capture only; title, subtitle, search rhythm, background framing, and Korean font stack matched. Automated `visual-qa` image-diff could not be executed because this machine lacks the required `bun`/`tsx` TypeScript runner for that helper.

### Home composite insights fidelity — [RESOLVED 2026-06-30] production-verified
The real `/ko/admin-builder` composite `home-insights` section now matches the public `/ko` section for featured/list data, body font inheritance, section height, following `home-services` y-offset, and visible final card state. This is the actual Wix-style builder surface, not the GLM builder.

Fix:
- Extend the composite-home editor canvas CSS so `home-insights` and the other live composite home sections keep `margin-top: 0` inside the editor and inherit `var(--font-body)` instead of the editor shell font stack.
- Let `CompositeRender` consume `home.insights.feed` dataset preview targets before falling back to static archive data, and pass the same preview targets from `public-page.tsx` when rendering the published home canvas.
- Bump the home seed to `home-seed-v11` and update measured composite section heights from production metrics (`insights: 1338`, `services: 1279`, `stats: 621`, `faq: 1333`, `contact: 532`, with existing hero/attorney/results/offices measurements preserved).
- Follow-up fix: align legacy home fallback with the same curated `insightsArchive` source instead of raw `getAllColumnPosts`, so an empty scratch store cannot show a different public `/ko` archive before the builder page is published.
- Follow-up fix: builder-published runtime CSS and editor stage CSS now force builder-owned `.reveal-stagger > *` to the final visible state. Without this, the DOM titles matched but the public/builder card area could remain visually blank at `opacity: 0`.
- Follow-up build fix: the `%5Fdev/flex` `ResolvedPublishedSitePage` fixture now supplies `datasetPreviewTargets: []`, matching the production renderer contract.

Verification:
- Red proof before fix: `tests/builder-editor/home-composite-section-fidelity.playwright.ts` failed with builder insights using `Inter/Pretendard` while public `/ko` used the public `IBM Plex Sans KR` body stack.
- The same focused spec then exposed the next two parity gaps before the final fix: different featured/list data between builder and public, then a `61px` section-height mismatch that shifted services.
- Follow-up red proof: on a fresh scratch production server, the public legacy fallback and builder page could disagree on the featured title; after the fallback source fix, the hardened spec passed from empty scratch roots.
- Follow-up visual red proof: public and builder DOM metrics matched while screenshots were blank in the card area; computed styles showed `.insights-featured` and `.insights-list-wrap` at `opacity: 0`. The hardened spec now asserts both opacities are `1`.
- Isolated production build (`BLOB_READ_WRITE_TOKEN= BUILDER_SITE_BACKEND=local CONSULTATION_LOG_BACKEND=local NEXT_DIST_DIR=.next-codex-section-build npm run build`) -> **passed** with existing repo warnings only.
- `BASE_URL=http://127.0.0.1:3317 BUILDER_SMOKE_USERNAME=admin BUILDER_SMOKE_PASSWORD='local-review-2026!' npx playwright test tests/builder-editor/home-composite-fidelity.playwright.ts tests/builder-editor/home-composite-section-fidelity.playwright.ts --project=chromium-builder` -> **2 passed**.
- Follow-up isolated production build (`BLOB_READ_WRITE_TOKEN= BUILDER_SITE_BACKEND=local CONSULTATION_LOG_BACKEND=local NEXT_DIST_DIR=.next-codex-insights-build npm run build`) -> **passed** with existing repo warnings only.
- Follow-up production browser gate on fresh scratch roots (`BASE_URL=http://127.0.0.1:3374 npx playwright test --config=playwright.config.ts tests/builder-editor/home-composite-section-fidelity.playwright.ts --project=chromium-builder --reporter=line --workers=1`) -> **1 passed (4.7s)**.
- Unit regression gate: `npx vitest run src/lib/builder/canvas/__tests__/seed-home-composite.test.ts src/lib/builder/components/composite/__tests__/composite-render-localization.test.tsx` -> **2 files / 7 tests passed**.
- Visual QA screenshots from the follow-up production server showed public `/ko` and real `/ko/admin-builder` cards/images visible without forcing reveal state. Metrics: identical featured/list titles, public `sectionHeight=1338`, builder stage-normalized height matched in the focused spec, `featuredOpacity="1"`, `listWrapOpacity="1"`, console errors `0`, page errors `0`.

### Home composite all-section fidelity — [RESOLVED 2026-06-30] production-verified
The real `/ko/admin-builder` composite home stack now has production coverage against public `/ko` for all 9 sections: hero, insights, services, attorney, case-results, stats, FAQ, offices, and contact. This closes the remaining desktop per-section home composite proof gap; it is actual Wix builder evidence, not GLM builder evidence.

Implementation:
- Added `tests/builder-editor/home-composite-all-sections-fidelity.playwright.ts`.
- The spec opens `/ko/admin-builder` first so scratch production creates the builder-published home, then opens `/ko` from the same server.
- It scrolls both the editor canvas and public page through every section, then compares section height, builder node height, adjacent stacking gaps, full normalized text, font family, reveal opacity, stat final numbers, and image count/load state.
- The services section is selected from the real rendered structure (`section:has(.services-detail-list)` / composite node `section`) because the current `ServicesBento` call does not pass an `id="services"` prop.

Verification:
- Initial probe false alarm: builder stats appeared as `0+ / 0+ / 0 / 0` while offscreen. A focused editor-scroll probe showed the actual editor canvas count-up reaches `10+ / 500+ / 5 / 4`, matching public `/ko`.
- Initial spec red: absolute `home-hero y` differed by `55px` after full scroll because editor canvas and public document had different scroll origins. The final spec compares adjacent stacking gaps, which is the stable section-flow invariant.
- Isolated production build (`BLOB_READ_WRITE_TOKEN= BUILDER_SITE_BACKEND=local CONSULTATION_LOG_BACKEND=local NEXT_DIST_DIR=.next-codex-next-section-build npm run build`) -> **passed** with existing repo warnings only.
- Production browser gate on `http://127.0.0.1:3375`: `BASE_URL=http://127.0.0.1:3375 BUILDER_SMOKE_USERNAME=admin BUILDER_SMOKE_PASSWORD='local-review-2026!' npx playwright test --config=playwright.config.ts tests/builder-editor/home-composite-all-sections-fidelity.playwright.ts --project=chromium-builder --reporter=line --workers=1` -> **1 passed (18.0s)**.
- Focused production suite on the same server (`home-composite-fidelity.playwright.ts`, `home-composite-section-fidelity.playwright.ts`, `home-composite-all-sections-fidelity.playwright.ts`) -> **4 passed (24.4s)**.
- Visual QA: public full-page screenshot showed all 9 sections filled; builder crops for services, stats, and FAQ showed visible Korean content and final stat values. The editor AI 상담 bubble remains a visible overlay in crops, which is the previously documented F1 product-decision caveat, not newly introduced by this slice.

### Tablet services accordion visual — [RESOLVED 2026-06-30] production-verified
The real `/ko/admin-builder` tablet preview no longer collapses the opened home services accordion detail into `1px x 1px` nodes. The fix is scoped to editor preview layout CSS and covers the full 8 related-column links rendered by the current services data.

Fix:
- Add tablet preview-open placement rules for the services accordion detail body, description, checklist, detail rows, related columns, and more button.
- Expand tablet and mobile related-column preview layouts from 4 links to 8 links as a 2-column x 4-row grid, with nowrap/ellipsis text so late links cannot stack over the first row.

Verification:
- Red proof before fix: the tablet services regression failed with `home-services-card-0-body` height `1px` instead of the expected open detail height.
- Red proof for overlap: old CSS left `column-7` above/over `column-3`, matching the screenshot crop where related links stacked in the first cell.
- Isolated production build (`BLOB_READ_WRITE_TOKEN= BUILDER_SITE_BACKEND=local CONSULTATION_LOG_BACKEND=local NEXT_DIST_DIR=.next-codex-tablet-build npm run build`) -> **passed** with existing repo warnings only.
- `BASE_URL=http://127.0.0.1:3373 npx playwright test --config=playwright.config.ts tests/builder-editor/responsive-stage-width.playwright.ts --project=chromium-builder --reporter=line --workers=1` -> **2 passed (6.0s)**.
- Final tablet visual metrics from the same production server: `stageWidth=768`, `documentOverflow=false`, 8 related-link boxes arranged in two columns/four rows, `overlaps=[]`, and console/page errors `0`. Mobile post-change metrics also showed `overlaps=[]`, `documentOverflow=false`, and console/page errors `0`.

---

## Still to verify in later loop iterations
**Priority:** run the **full** builder-editor suite (64 files) to confirm the `openBuilder` change has no regressions beyond the sampled set, then continue responsive/mobile per-section sweeps beyond the desktop home composite proof. (Already verified working in iter 1–2: render/select/inspector/layers/drag-move/resize/rotate/device-preview/section-boundary geometry; F4 move-preview perf, F8 advanced panels/guides, standard-page preview modal routes, custom-page preview modal fallback, Add-panel layout-widget click insertion + reload persistence, drag-positioned `layout-tabs` preset drop, Add-panel text/media/gallery/navigation representative preset drag/drop, saved-section card drag placement, built-in section-template drag placement, Add-panel nested-container drop policy, direct publish UI flow, scheduled publish UI flow, page switching/admin route return, mobile compact editor polish, multi-select localized chrome plus align/match/distribute draft persistence, home composite hero public-vs-builder geometry/font fidelity, home insights public-vs-builder data/font/height/fallback/reveal visibility, all 9 desktop home composite sections public-vs-builder stacking/text/font/visibility fidelity, and tablet services accordion visual layout now pass on production.)

## State hygiene
The earlier live ko-home draft decomposition test was **restored byte-for-byte** to its original composite seed (9 nodes). The current all-section home composite loop used isolated production port 3375, stopped the server, and cleaned `.next-codex-next-section-build`, Playwright output, screenshots, and temp artifacts before handoff. The prior home-insights follow-up loop used isolated local scratch roots on port 3374 and cleaned `.next-codex-insights-build`, Playwright output, screenshots, and temp roots. The previous home-insights fidelity loop used isolated local scratch roots, stopped port 3317, and cleaned `.next-codex-section-build`, screenshots, and temp roots. The prior home-hero fidelity loop used isolated local scratch roots, stopped port 3316, and cleaned `.next-codex-fidelity-build`, screenshots, and temp roots. The previous multi-select production loop also used isolated scratch roots, stopped port 3315, and cleaned `.next-codex-multiselect-build`, Playwright output, screenshots, and temp roots.
