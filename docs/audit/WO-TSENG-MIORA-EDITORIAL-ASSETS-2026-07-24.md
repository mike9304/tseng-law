# WO — tseng-law.com Miora Editorial Assets

**Date:** 2026-07-24
**Branch:** `design/miora-editorial-assets-20260724`
**Worktree:** `/Users/son7/Projects/tseng-law-miora-20260724`
**Implementer:** Grok 4.5
**Design/review/deploy:** Codex

## Goal

1. Replace home `#practice` 6 generic icons with distinct code-native SVGs.
2. Use the Miora wide editorial plate on home `#results` as a left visual with existing results copy on the right.
3. Do not break section order, content, SEO, interactions, or builder composite height contracts.

## Source asset

- Path: `/Users/son7/Desktop/miora-cross-strait-editorial-2048x880.png`
- Size: 2048×880 RGB, ~2.2MB
- SHA-256: `8615cd1f9f02ae9e42d18f481931a4687326c6d757193792fdb04c1a8b154f01`
- Product path: `public/images/editorial/cross-strait-results.webp` (cwebp q90)

## Locked design

### Practice icons (`ServicePracticeIcon`)

Shared by `ServicesBento` and `BuilderServicesSection`.

| Index | Practice | Silhouette |
|------:|----------|------------|
| 0 | 투자·법인설립 | architectural elevation |
| 1 | 민사소송·손해배상 | document + short progress arrow |
| 2 | 가사소송 | facing openings |
| 3 | 노동법·고용분쟁 | two independent rectangles |
| 4 | 형사소송 | parallel lines + center diamond |
| 5 | 지적재산·금융분쟁 | 3×3 node grid |

Constraints: 24×24 viewBox, `currentColor`, stroke ~1.55, no banned legal clichés.

### Results editorial split

- Desktop: image ~52% / copy ~48%, min-height 786px
- Tablet image plate: 250px (within 220–280)
- Mobile image plate: 180px (within 160–200)
- `object-fit: cover; object-position: 18% center`
- Decorative `alt=""`, no `priority`, `sizes` provided
- No text overlay, no heavy shadow/glass/gradient overlay on the image

### `#practice` surface cleanup

- Card radius ≤4px, no hover lift/shadow
- Icon gold on hover/focus only
- Focus-visible outline retained

## Out of scope

- seed version / published data / locale copy / SEO / booking / header-footer
- `#stats`, hero, FAQ, offices, contact
- commit / push / merge / deploy

## Verification (implementer)

See completion report from the implementer session. Codex owns review/deploy gates.

---

## Follow-up — zh-Hant published desktop parity (2026-07-24)

### Symptom (Codex repro on local prod build :3114 with real published data)

| Route | Desktop services / results |
|-------|----------------------------|
| `/ko`, `/en` | `home-services` / `home-case-results` composites → new practice SVGs + editorial image |
| `/zh-hant` desktop | Visible trees were **decomposed** `home-services-root` (6 legacy generic SVGs) and `home-case-results-root` (`split--text-only`, no editorial image) |
| `/zh-hant` mobile | Already correct — public-page CSS shows `mobile-parity-home-*` composites and hides `*-root` |

Latest composites already exist on the published zh-hant home page as
`data-anchor="mobile-parity-home-services"` and
`data-anchor="mobile-parity-home-case-results"`, but desktop CSS kept them hidden.

### Root cause

zh-hant home published JSON carries **both** the older decomposed section roots and the newer composite parity wrappers. Mobile CSS already swaps every home section to the parity composites. Desktop left services/results on the decomposed roots, so code-native editorial assets never appeared there.

### Approved fix (no seed / published JSON / copy changes)

In `src/lib/builder/site/public-page.tsx` inside the existing `data-builder-r2-overflow` style block, when **`locale === 'zh-hant' && !slugPath` only**:

```css
@media (min-width: 769px) {
  .builder-pub-main > .builder-pub-node[data-node-id='home-services-root'],
  .builder-pub-main > .builder-pub-node[data-node-id='home-case-results-root'] {
    display: none !important;
  }
  .builder-pub-main > .builder-pub-node[data-anchor='mobile-parity-home-services'],
  .builder-pub-main > .builder-pub-node[data-anchor='mobile-parity-home-case-results'] {
    display: block !important;
  }
}
```

Why reuse `mobile-parity-*` anchors on desktop: those composites are the **only shared render source** for the new practice icons and results editorial split; their wrapper rect/min-height already match the flow slot of the decomposed roots, so section order and `#stats` y-position are preserved.

### Playwright CSS-injection measurement (Codex)

- results before: y 4226, h 843; stats y 5069
- after: parity wrapper y 4226, h 843; editorial section h 805.86; stats y 5069
- `document.scrollHeight` unchanged at 9491

### Scope locks

- Only services + case-results; other home sections untouched on desktop
- Existing `@media (max-width: 768px)` parity behavior unchanged
- No published JSON, seed, DB, `decompose-*`, `ImageElement`, or locale copy edits

---

## Follow-up — Results editorial plate flush fill (2026-07-24)

### Symptom (Codex Playwright on production build `/ko`)

| Viewport | Measurement | Failure |
|----------|-------------|---------|
| 1440×1000 | `#results` h 786, **padding 108px 0**, grid row 568px; media y = section y + 109 | Large navy bands above/below image+copy — not a flush left-image / right-copy editorial plate |
| 390×844 | `#results` padding 48px 0; media wrapper h 180; **img h 166.719** (intrinsic 2048:880) | Image does not fill the 180px plate |

### Root cause

1. **Section padding cascade:** `.split-section { padding: 0; }` and `.home-results-panel--editorial` lose to a later equal-specificity `.section { padding: clamp(...) 0; }` (and mobile `.section` resets). Computed padding becomes ~108px desktop / ~48px mobile → navy bands.
2. **Media img height:** Global `img { height: auto }` + intrinsic ratio leaves the image short of the fixed media wrapper on mobile even when `height: 100%` is declared without enough force.
3. **zh-hant desktop slot (prior swap):** Parity wrapper / decomposed root are **843px**, but composite `#results` defaults to **min-height: 786px**, leaving empty space under the plate when the desktop composite swap is active.

### Approved fix (allowed files only)

| File | Change |
|------|--------|
| `src/app/globals.css` | `section.home-results-panel--editorial { padding: 0; }` (element+class, no `!important`); `.home-results-media-img { height: 100% !important; }` only on that property |
| `src/lib/builder/site/public-page.tsx` | Inside zh-hant home **desktop** `@media (min-width: 769px)` block only: `[data-anchor='mobile-parity-home-case-results'] #results { min-height: 843px; }` |
| Focused tests | `home-case-results-editorial.test.tsx` flush/fill/no-zoom guards; `published-standard-page-css.test.ts` min-height 843px in desktop locale/home swap block |

### Design locks (unchanged)

- Desktop: full-height left image / right copy
- Mobile: 180px image plate then copy
- No text overlay, no hover zoom

### Verification ownership

- Implementer: focused CSS/string tests + typecheck + lint + `git diff --check`
- Codex: re-run Playwright pixel gate on production build after review

---

## Follow-up — zh-Hant results slot 843px fill (2026-07-24)

### inherit re-check failed (Codex browser DOM)

`min-height: inherit` did **not** fill the published parity slot. Measured chain:

| Node | Styles / computed | Actual height |
|------|-------------------|---------------|
| parity wrapper `data-anchor="mobile-parity-home-case-results"` | inline `height:auto; min-height:843px` | **843** |
| intermediate surface div | `min-height:100%` | **~589.859** |
| `#results` | computed `min-height:100%` (inherits intermediate 100%) | **~589.859** |

Parent is `height:auto` + `min-height` (indefinite). Intermediate `min-height:100%` therefore cannot resolve against a definite height, so `#results` stops at content height and leaves **~253px** empty under the plate. Wrapper y 4226 / `#stats` y 5069 still imply the 843px flow slot.

### Contract fix

- `843px` is the fixed published/decomposed parity root/wrapper height (already locked in seed/layout tests; within design 786px ±10%).
- Replace failed inheritance with explicit `min-height: 843px` on zh-hant home desktop `#results` only.
- Allowed files: `public-page.tsx`, `published-standard-page-css.test.ts`, this audit doc.
