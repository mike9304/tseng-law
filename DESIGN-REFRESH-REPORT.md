# Design refresh — 2026-09-30 (branch `design-refresh-20260930`)

Scope: a modest, CSS-first refresh of the public site. Brand, copy, data,
ordering logic and builder/admin UI are untouched.

Baseline reviewed: `/Users/son7/tseng-design-20260930/before/*` (zh-hant / ko / en
home, columns list, issue board, services, service detail, pricing, column
detail, traffic hub; desktop 1440 and mobile 390, fold + full page).

## Part 1 — Review and proposal

Overall the site is already coherent: one dark-green primary, serif display
headings, calm off-white sections, whole-card links. The problems are mostly
small inconsistencies that add up, plus two cheap GPU costs.

| # | Problem (where seen) | Proposed change | Files |
|---|---|---|---|
| 1 | **Hero CTA hierarchy is flat.** On every language home the two path buttons ("諮詢台灣公司設立" / "諮詢台灣商業爭議") use the same 48px height, 16px/700 type and full-strength primary border as the solid primary, and the guide link is as large as the buttons. On mobile this becomes three equal full-width bars plus a big underlined link before the trust strip. | Keep the primary as the only solid button (52px on mobile). Make the two path buttons clearly secondary: 44px (still a full tap target), 15px/600, softer tinted border, white fill; hover restores the full border. Guide link becomes a 15px tertiary text link. Tighter 8px gap in the mobile stack. Markup unchanged. | `src/app/globals.css` (hero path rules) |
| 2 | **Column cards have ragged rows.** `/columns` and `/columns/issues`: `.columns-grid` uses `align-items: start` and the card body does not grow, so cards in one row end at different heights and "查看專欄 →" floats at a different height in each card. Summary is 17px against a 20px title, so title/summary hierarchy is weak. | Stretch cards to the row height, let the body grow, pin the link hint to the card bottom (`margin-top: auto`). Summary 16px / 1.75 on desktop (mobile already 16px). No clamping of column summaries. | `src/components/ColumnsGrid.module.css` |
| 3 | **Home service cards have ragged rows.** The editorial override sets `align-items: start` + `height: auto`, so the six service cards on the homes end at different heights and "查看詳情 →" is misaligned (the /services page, which uses the base rule, is already aligned). | Use the same equal-height behaviour as the base rule: stretch, card fills its grid cell, link pinned to the bottom. | `src/components/HomeEditorial.module.css` |
| 4 | **Service-detail related column cards are very tall.** On `/services/investment` the legacy summaries run 9–11 lines (≈700px per card on mobile); date/"閱讀全文" sit at different heights across a row. | Clamp the card summary to 4 lines (text stays in the DOM; the whole card links to the article). Pin meta + link to the card bottom. | `src/app/[locale]/services/[slug]/ServiceDetail.module.css` |
| 5 | **Pricing cards unequal.** `/pricing` desktop: cards in the same row have different heights (`align-items: start`). | Stretch cards to equal row height. | `src/components/PricingCards.module.css` |
| 6 | **Home insights list: the category chip out-shouts the title.** Every list item starts with a dark filled pill (in English "LEGAL INFORMATION" with 0.1em tracking), then date, read time, byline, and only then the title. Every badge also carries `backdrop-filter: blur(4px)`, even the ones on a plain background. | List-item chips become a quiet outline tag (green text, hairline border, no fill, tighter tracking). All insights badges drop the backdrop blur; the badge over the featured image gets a slightly more opaque solid fill instead. | `src/components/HomeEditorial.module.css` |
| 7 | **Performance: blur over playing video.** The pause/play control on each autoplay video (home hero, heritage interlude, results panel) uses `backdrop-filter: blur(8px)`; over a playing video the blur has to be recomputed every frame. | Remove the blur, raise the solid background alpha (0.72 → 0.84) so the control looks the same and keeps contrast. | `src/app/globals.css` |
| 8 | **Issue board teaser / date note off-palette.** The new issue board uses hard-coded neutral greys (`#fafafa`, `#e5e7eb`, radius 10px) and a goldenrod (`#b8860b`) note bar that do not match the green-tinted neutrals and 12px card radius used elsewhere. | Use site tokens (`--off-white`, `--warm-border`, `--gold`) and 12px radius. | `src/components/IssueBoard.module.css` |

Not proposed (considered and rejected as higher risk or not worth it now):
reflowing the hero CTAs into one row (depends on per-locale label length),
clamping column-index summaries (curated text, previously unclamped on purpose),
touching column-article typography (shared with the column editor presets),
header/nav changes, and any change to section order or card data.

## Part 2 — What changed and why

All eight proposals were implemented, CSS only (no TSX, data, copy or builder
files touched). Diff: 6 files, +62 / −26.

1. **Hero CTA hierarchy** (`src/app/globals.css`, editorial hero rules only).
   Path buttons: 48px → 44px min-height, 16px/700 → 15px/600, border
   `var(--primary)` → `rgba(22, 56, 45, 0.32)`, fill transparent → `#fff`.
   Hover/focus still switch to the full primary border + `--purple-bg`. Guide
   link: 15px, 44px target, 3px underline offset. Mobile (≤640px) stack gap
   between the two path buttons 12px → 8px. The primary is unchanged, so it is
   now the only heavy element. DOM order and markup are unchanged, so
   `hero-cta-hierarchy.test.tsx` holds.
2. **Column cards** (`src/components/ColumnsGrid.module.css`): grid
   `align-items: start` → `stretch`, card body `flex: 0 0 auto` → `1 1 auto`,
   link hint `margin-top: 0.9rem` → `margin-top: auto; padding-top: 0.9rem`,
   summary 17px → 16px (line-height stays 28px). Cards remain whole-card
   links; ordering, the country/locale-first logic and "推薦專欄" are untouched.
3. **Home service cards** (`src/components/HomeEditorial.module.css`): editorial
   grid `align-items: start` → `stretch`, card `height: auto` → `100%`; the base
   `margin-top: auto` on `.services-card-link` then aligns the links.
4. **Service-detail related column cards**
   (`src/app/[locale]/services/[slug]/ServiceDetail.module.css`): summary
   clamped to 4 lines (`-webkit-line-clamp: 4` + `line-clamp: 4`); the global
   base rule had clamped at 3 before the module unclamped it. Meta gets
   `margin-top: auto`, so date/read-time and "閱讀全文" sit on the card bottom.
5. **Pricing cards** (`src/components/PricingCards.module.css`): grid
   `align-items: start` → `stretch`.
6. **Home insights badges** (`src/components/HomeEditorial.module.css`): every
   `#insights` badge loses `backdrop-filter`; the photo badge gets a
   `rgba(15, 41, 30, 0.86)` solid fill. List-row badges become an outline tag
   (transparent, `--primary` text, `--purple-border` hairline, 0.04em
   tracking).
7. **Video control** (`src/app/globals.css`):
   `.decorative-autoplay-video__control` loses `backdrop-filter: blur(8px)`;
   background alpha 0.72 → 0.84 (white text on it stays well above 4.5:1).
8. **Issue board** (`src/components/IssueBoard.module.css`): teaser uses
   `--warm-border`, `#fff`, radius 12px; date note uses `--gold` /
   `--off-white`.

### Files touched

- `src/app/globals.css` (items 1, 7)
- `src/components/HomeEditorial.module.css` (items 3, 6)
- `src/components/ColumnsGrid.module.css` (item 2)
- `src/app/[locale]/services/[slug]/ServiceDetail.module.css` (item 4)
- `src/components/PricingCards.module.css` (item 5)
- `src/components/IssueBoard.module.css` (item 8)
- `DESIGN-REFRESH-REPORT.md` (this file)

### Verification (run in this worktree)

- `npx vitest run` on the 59 test files that reference the changed components,
  `globals.css`, HeroSearch, LocaleHomePathNav, InsightsArchiveSection,
  ServicesBento or the autoplay video: **59 files / 665 tests passed**.
- `npm run typecheck`: exit 0.
- `git diff --check`: clean.
- `npm run lint`: not applicable. It runs ESLint on `.js/.jsx/.ts/.tsx` only
  and no such file changed. The repo has no CSS linter.
- Visual/metric check: `next dev` on an isolated dist dir (`.next-dev`, port
  43195; `.next-build` untouched), Playwright at 1440×900 and 390×844 on
  zh-hant/ko/en home, columns, issue board, services, service detail
  (investment) and pricing. Screenshots, metrics and the script are in
  `/Users/son7/tseng-design-20260930/after-dev-check/`. Measured:
  - every multi-card row on columns (11 rows), issue board, home services
    (zh/ko/en) and service detail has **0px height spread and 0px link-offset
    spread**; pricing rows have 0px height spread;
  - service-detail summaries are exactly 4 lines;
  - hero path buttons are 44px / 15px / 600 and the primary is 49px / 16px /
    700; mobile stack gap is 8px;
  - computed `backdrop-filter` is `none` on all insights badges and video
    controls;
  - no horizontal overflow on any of the 16 page/viewport combinations.
- I did **not** run `npm run build` (as instructed). The dev-server check is
  not a production-build check.
- `next dev` rewrote `next-env.d.ts` (`.next` → `.next-dev` route-types
  path); I reverted that line, so it is not in the diff.

### Performance notes (why no regression)

- CSS only: no new dependencies, JS, listeners, observers, animations or
  images. Image `sizes`/`priority`/loading are untouched.
- Net GPU work goes **down**: backdrop blur is removed from the video
  controls (up to 3 per home, each over a playing video, so the blur ran every
  frame) and from up to 9 insights badges.
- Equal-height rows come from grid `stretch` plus a flex `margin-top: auto`.
  That is resolved in the normal layout pass, with no hover or scroll-time
  layout work. No hover effects were added or changed.
- `line-clamp` on 8 service-detail summaries is a paint-time clamp and cheaper
  than the ~40 extra text lines it hides.

### Intentionally left alone

- All copy and `src/content/**`, `src/data/**`; builder/editor/admin UI;
  section order, recommendation order and card data.
- Reflowing the hero CTAs into one row. That depends on label length in 8
  locales and would change the group markup the hierarchy test pins.
- The dark (non-editorial) hero variant. It is not rendered on the current
  homes, so its path-button rules were not changed.
- Column-index summaries stay unclamped (curated text; they were unclamped
  deliberately earlier). Home-insights summaries also stay unclamped.
- Column article typography (`column-typography.css` presets are shared with
  the column editor).
- Header, footer, navigation and the column detail page.
- The other ~35 `backdrop-filter` declarations in `globals.css`. Many are in
  admin/builder or overlay contexts; auditing them is a separate task.

### Follow-ups

- Take production-build after-screenshots with your `shoot.mjs` into
  `after/` and compare with `before/`. Note that the full-page captures in
  both sets show blank bands below the first sections: those are scroll-reveal
  sections the capture did not trigger (verified in-viewport: `#practice`
  renders with opacity 1). They are not layout gaps.
- Optional: apply the same secondary-button weight to the dark hero variant
  if it comes back.
- Optional: a separate pass on the remaining public `backdrop-filter` uses
  (mobile drawer, search overlay, cinematic opening info box) with before/after
  frame timings.
- The branch is now 2 commits behind `origin/main` (`cd713099` traffic
  animation, `4c18f162` Korean issue-column copy). Neither commit touches any
  of the 6 CSS files changed here (checked with `git diff --name-only`), but
  rebase before merging.
