# WIX Design-Fidelity Upgrade — Research + Executable Spec (2026-06-04)

**Author:** Claude (design-research track, competing-team design lead mode)
**Status:** COMPLETE — Part 1 (code-grounded gap analysis + executability proof) · Part 2 (deep-research synthesis, 28 sources / 15 verified claims, honestly confidence-labeled) · Part 3 (3-layer fix, 6-change builder mechanism, reference code §3.2c, internal 호정 baseline §3.2b, 30-industry mapping §3.4, execution order §3.6).

> ## ✅ APPLIED THIS SESSION (direct edits, verified, NOT committed)
> User switched to "you edit design directly too" mode → executed the spec, not just handed it off. All gates green after each step (`vitest src/lib/builder/templates` = **538/538**, each industry visually re-rendered via Playwright).
> 1. **Builder upgrades in `_shared/industry-home.ts`** (benefit ALL 14 builder templates): **font pairing** (serif `Noto Serif KR` headings + sans `IBM Plex Sans KR` body — the helpers existed, builder never called them → was system-ui) + **hero gradient scrim** (호정 ~100° ramp, contrast-safe).
> 2. **16 industry home pages migrated** from hardcoded `#123b63` law-navy skeletons → token-driven `buildIndustryHome` configs with **distinct branded palettes + real per-industry imagery**: cafe (warm cream), beauty (blush/gold), restaurant (terracotta), fitness (charcoal/orange), realestate (slate/taupe), photography (mono/taupe), travel (blue/sunset), health (clinical teal), pet (warm coral), ecommerce (modern indigo), education (academic amber), music (violet), creative (magenta), consulting (deep slate), startup (product blue), blog (editorial warm). Each ~55 nodes ∈[40,70], qaScore 95. **`law-home` intentionally kept navy** (correct for a law firm).
> 3. **Subpage recolor (the 153 navy subpages → home tone), deterministic + verified.** Toolchain in `scripts/` (idempotent, re-runnable): `recolor-subpages.mjs` (per-industry palette extracted from each `<ind>-home.ts`; legacy law-navy palette → industry palette by luminance-class buckets: dark→ink, mid→mutedInk, accent/amber→accent, borders→line, light tints→surfaceAlt; **222 files, 11,708 swaps, 0 leftover navy**) → `contrast-scan.mjs` (WCAG: every text node vs resolved ancestor bg) → `fix-dark-contrast.mjs` (163 dark-on-dark regressions → white) → `font-subpages.mjs` (serif `Noto Serif KR` headings into 153 subpage `heading()` helpers). **Verified: tsc 0, vitest 538/538, contrast net-improved 1449→1411** (dark-on-dark 169→6 borderline price-emphases). *Honest residue:* ~362 **pre-existing** sub-3:1 light-tint pairs remain (in homes too — separate AA pass); 78 Track-C subpages (agency/saas/dental…) are color-matched but not serif (they build headings via large-`fontSize` `createTextNode`, not the `heading()` helper); the false-green "Wix-grade scaffold" placeholder blocks still exist in subpages (recolored, not removed).
>
> **Remaining for the Codex track** (§3.2 items not yet applied): per-`visualStyle` `styleToken` (radius/shadow/hover), `responsive.{tablet,mobile}` overrides, taxonomy stamping, layout archetypes, paletteFromKey bridge, palette extensions, + `law-home` if desired; subpage AA pass + Track-C subpage serif + scaffold removal.
**Do not commit to `main`** (1,943 uncommitted files; Codex live). This is a hand-off artifact for the Codex design track.

> Goal (user): deep-research the *design* side of the Wix builder, pull in the usable parts, and refine the design with professional rigor. This maps onto the project's own #1 self-identified gap — **"true screenshot/pixel design matching" / visual fidelity** — concentrated (per `qa-reports/PHASE1-AUDIT-GRADES.md`) in **Templates (2/5)** and **Responsive (2/5)**.

---

## Part 1 — Code-grounded gap analysis (verified 2026-06-04, read-only)

### 1.1 The design *system* is good; the templates *bypass* it

`src/lib/builder/templates/design-system.ts` already defines a genuinely solid token system:

- **`TEMPLATE_PALETTES`** — 11 named palettes, each a full semantic token set:
  `canvas · surface · surfaceAlt · ink · mutedInk · accent · accentSoft · line · inverse · focus`
  (law-editorial, restaurant-warm, startup-product, commerce-studio, creative-mono, health-clinical, realestate-quiet, beauty-luxe, travel-editorial, local-warm, neutral-studio).
- Rich taxonomy in `types.ts`: **`TemplateVisualStyle`** (14), **`TemplateDensity`** (7), **`TemplateLayoutFamily`** (9: cinematic-hero, editorial-split, bento-grid, product-showcase, magazine-stack, service-index, booking-first, masonry-gallery, conversion-landing), **`TemplateQualityTier`** (4).
- `PageTemplate` already carries the hooks: optional `paletteKey`, `visualStyle`, `density`, `layoutFamily`, `pageType`, `qualityTier`.

**The problem is not the system — it's that the templates don't use it.** Measured today:

| Metric | Value |
|---|---|
| Template `.ts` files | 267 |
| Files with raw `#rrggbb` hex | **263 / 267** |
| Files reusing law-navy `#123b63` | **170** (audit 5/29 said 49×; worse now) |
| Templates referencing `/images/placeholder-*` | 56 |

So ~98% of templates stamp **literal hex** into canvas nodes instead of resolving from `TEMPLATE_PALETTES`, and 170 still reuse the law-navy accent → the gallery "collapses to one crude look" even where palettes were nominally varied.

### 1.2 The good builder is disconnected from the token system

`src/lib/builder/templates/_shared/industry-home.ts` → `buildIndustryHome(cfg)` is the *modern, good* path (11 section types, ~50 nodes, real imagery, within the 40–70-node registry budget). 13 Track-C industries use it. But:

1. **Its palette type is a parallel, disconnected structure.** `IndustryHomeConfig.palette: IndustryPalette` is **8 hand-written hex values** (`base, surface, surfaceAlt, ink, mutedInk, accent, onAccent, line`) — *not* derived from `TemplatePaletteKey`/`TEMPLATE_PALETTES`. The file comment concedes: *"All on-canvas hex (templates render with literal colors)."* Two palette systems, no bridge.
2. **It never sets taxonomy metadata.** The returned `PageTemplate` (lines 387–403) sets only `id/name/category/subcategory/description/thumbnail/document`. `paletteKey`, `visualStyle`, `density`, `layoutFamily`, `qualityTier` are left **undefined** → gallery filters, identity badges, and quality tiering are blind even for the "good" templates.
3. **One fixed composition for every industry.** The builder emits exactly one layout (full-bleed cinematic hero → stat band → 3 image cards → feature split → 3-step process → testimonial → CTA). Distinct palette/imagery/copy, **identical skeleton** → this is *why* templates still read as one design. The 9 `TemplateLayoutFamily` archetypes are unused.

### 1.3 Professional design defects in the builder itself (refinement targets)

These are concrete, fixable craft problems — the "전문성 있게 다듬어줘" surface:

- **Hero contrast is unsafe.** Hero is a photo at flat `style.opacity: 55` over `p.base`, with hero text hardcoded `#ffffff` (eyebrow/title) and `rgba(255,255,255,0.88)` (sub). On light photos or light `base`, white text fails WCAG AA. There is **no gradient scrim** — the single most important premium-hero technique for guaranteed legibility. (`creative-mono` base is literally `#ffffff` → white-on-white risk.)
- **Hardcoded on-dark text ignores palette.** Testimonial band stamps `#ffffff` text on `p.base` regardless of whether `base` is dark. No `onBase`/contrast-aware selection.
- **Single spacing rhythm.** `GAP = 88`, `PAD = 80` constant for all sections and all densities. No 4/8-pt scale, no density-driven vertical rhythm, no section-type-specific spacing.
- **Brand-flat detailing.** Every button `borderRadius: 8`; every card `borderRadius: 16`; one elevation (flat). A luxury-beauty brand and a playful-pet brand render with identical geometry. No radius/elevation/border language per `visualStyle`.
- **No type pairing.** All text is one implicit family at size-by-level. Premium templates pair a display/serif heading with a clean text face; none of that exists.
- **No real responsive.** Everything is absolute-positioned against `W = 1280`. "Responsive" is downstream scaling, not per-breakpoint reflow — matching the audit's Responsive 2/5. No fluid type (`clamp()`), no stack-on-mobile rules baked into template authoring.

### 1.4 Assets that actually exist (so the spec references real files)

`public/images` (123 entries, 182 `.jpg` + 9 `.webp`): real `hero-bg-01/02/03.webp`, skyline/footer/brand assets, `blog/`, `brand/`, plus the `placeholder-*` industry set generated 5/29 (`scripts/generate-template-images.mjs`) — cafe/beauty/dish/creative/etc. So **broken heroes are largely fixed; token-bypass is the live gap.** The public 호정 site (`/ko`, real images, 10 hand-designed sections) is the **internal "good bar"** to spec templates *up to*.

### 1.5 Codex's current trajectory (so this doesn't collide)

`WIX-PERFECT-PROGRESS.md` (touched 6/3): the active M165–M166 work is almost entirely **ko/zh-hant/en localization** + visual-regression golden infrastructure. **Codex is *not* migrating templates to the design system right now** → this design-fidelity spec is additive and conflict-free. (Live Codex PIDs confirmed; 2 `next dev` servers up. No `src` file touched in the last hour at audit time.)

### 1.6 The five highest-leverage design moves (preview; detailed in Part 3)

1. **Bridge `IndustryPalette` ← `TemplatePaletteKey`.** Derive the builder's 8 working colors from `TEMPLATE_PALETTES` + a contrast-safe `onAccent`/`onBase` computation. One source of truth.
2. **Stamp taxonomy metadata** (`paletteKey/visualStyle/density/layoutFamily/qualityTier`) on every built template.
3. **Add ≥3–4 real `layoutFamily` compositions** so industries stop collapsing to one skeleton.
4. **Contrast-safe hero** (gradient scrim + auto on-image text color) and **type pairing + radius/elevation language per `visualStyle`**.
5. **Per-breakpoint authoring** (fluid type via `clamp()`, mobile stack rules) for the templates + public render.

→ Part 3 delivers: the **30-industry mapping table**, the **builder upgrades** (signatures + token bridge + layout archetypes), and **one fully-worked before→after exemplar** that stays within the 40–70-node registry budget.

### 1.7 Executability — every upgrade is *natively expressible today* (the engine is Wix-class; templates use ~20% of it)

This is the linchpin: none of the design upgrades below require engine work. The canvas node model (`src/lib/builder/canvas/types.ts`) already supports every premium technique — the hand-hardcoded templates simply don't use it. Verified by schema (file:line):

| Premium technique | Native support (evidence) | Used by templates? |
|---|---|---|
| **Gradient scrim / hero overlay** | `backgroundValueSchema` image fill has `overlayColor` + `overlayOpacity` (types.ts:248–256); structured `gradient` fill `{type, angle, stops[]}` (types.ts:239–247); `backgroundColor` string also accepts raw `linear-gradient(...)` (≤2000ch) | ❌ hero uses a separate image node at flat `opacity:55`, no scrim |
| **Token-referenced color** | `builderColorValueSchema = string \| {kind:'token', token}` (types.ts:217–223) — engine resolves theme tokens | ❌ literal hex stamped (263/267 files) |
| **Elevation / shadow** | `style.shadowX/Y/Blur/Spread/Color` (types.ts:350–354) | ❌ flat (one default shadow) |
| **Hover states** | `hoverStyle{backgroundColor,borderColor,scale,translateY,shadow,transitionMs}` per node (types.ts:259–268) | ❌ none |
| **Entrance / scroll / micro-animation** | `animationConfigSchema` entrance/scroll/hover/click/exit/loop/timeline (types.ts:291–340) | ❌ none |
| **Type pairing** | text/heading `fontFamily` (shared.ts:92,110); `resolveHeadingFontFamily`/`resolveBodyFontFamily` helpers exist (shared.ts:30–39: serif `Noto Serif KR`/`Cormorant Garamond` + sans `IBM Plex Sans KR`) | ❌ helpers unused → all text renders `system-ui` |
| **Modular type scale** | `resolveTypographyScale` h1–h6 = base×ratio^level, ratios 1.125–1.5 (typography-scale.ts) | ❌ builder uses fixed per-level rects |
| **Image art-direction (duotone)** | image `filters` incl. `grayscale 0–100` (types.ts:30,591) | ❌ none |
| **TRUE per-breakpoint responsive** | every node has `responsive.{tablet,mobile}` overrides for `rect`/`hidden`/`fontSize`, cascade desktop→tablet→mobile (types.ts:381–393); resolvers in `canvas/responsive.ts`, `site/responsive-stylesheet.ts` | ❌ **never populated** → templates *scale*, don't *reflow* = the audit's Responsive 2/5 |
| **Sticky / anchors** | `sticky`, `anchorName` per node (types.ts:450–451) | ⚠️ partial |

**Implication for the spec:** the migration is *mechanical* — extend `buildIndustryHome` (one file) to (a) derive colors from `TEMPLATE_PALETTES` token keys, (b) stamp taxonomy metadata, (c) emit native scrim/elevation/hover/type-pairing/responsive — then drive ~30 industries from a config table. No new engine primitives. This is why it can hit a real Wix bar without the project's false-green failure mode (it's using real, tested engine features, verifiable by render + the 40–70-node / qaScore≥85 registry tests).

### Registry/test guardrails the spec must satisfy (`templates/__tests__/`)

- `registry.test.ts`: exactly **261 active templates**, **30 categories**, **13 Track-C categories**, every template **40 ≤ `document.nodes.length` ≤ 70**.
- `qa-score.test.ts`: image-rich + sized + varied → **qaScore ≥ 85** ("premium band"); thin/no-image → <70; every template **qaScore ≥ 70**. → upgrades that add imagery + varied sections *raise* the score (aligned, not in tension). qaScore computed in `templates/metadata.ts`.

---

## Part 2 — Deep research synthesis (premium template design conventions)

Source: deep-research harness — 6 angles, 28 sources, 128 claims → 25 adversarially verified (3-vote) → 15 confirmed. **Intellectual-honesty note (matches this project's anti-false-green ethos):** the *technique* layer is primary-sourced and encode-it-literally; the *per-industry DNA* is only verifiable for **4 families** (beauty, law, SaaS, restaurant/cafe) — the other 26 are **extrapolated by cluster-analogy** (the research's own recommendation) and labeled as such in §3.4. Single-blog hex/font names are **direction, not literal token values** — they nudge the choice among existing `TEMPLATE_PALETTES` keys; they do **not** overwrite the curated palettes.

### Q2/Q5 — Hero contrast & scrim (HIGH confidence, W3C/WebAIM primary) → encode literally
- **WCAG 1.4.3 AA floors over imagery:** **3:1** for large text (≥24px, or ≥18.66px bold), **4.5:1** for body. Identical across WCAG 2.0/2.1/2.2 (current 2026).
- **There is NO official way to measure contrast over a photograph.** Therefore hero legibility must be **engineered, not measured**: shade the *local* area behind the text (semi-transparent scrim / dark-bottom gradient / halo) so glyphs hit 4.5:1 against their *immediate* background. → This is the primary-source justification for §3.2c's `heroImageFill` overlay (overlayOpacity 62) + contrast-safe `onBase`. Prefer a solid or scrimmed area behind text; never raw text on an untreated photo.

### Q3 — Typography (clamp HIGH/MDN; scale MEDIUM) → encode literally
- **Fluid type via `clamp(min, preferred, max)`** with mixed units. Slope between two breakpoints: `v(vw)=100·(y2−y1)/(x2−x1)`, `r(rem)=(x1·y2−x2·y1)/(x1−x2)/16`. Worked: 36px@600 → 52px@1400 ⇒ `clamp(2.25rem, 2vw + 1.5rem, 3.25rem)`. **A11y rule: `max ≥ 2×min`** (survives 200% zoom). For canvas, translate clamp endpoints → `responsive.fontSize` steps (desktop=max, mobile≈min).
- **Modular scale by DENSITY** (the encodable density lever): Minor Second **1.067** (dense) → Major Second **1.125** (structured/dashboard) → **1.25/1.333** (balanced) → Augmented Fourth **1.414** / Perfect Fifth **1.5** (high-impact landing/conversion). Maps to `TemplateDensity`: `minimal/editorial`→small ratio, `commercial`→mid, `conversion`→large. (The project's `resolveTypographyScale` already supports 1.125–1.5 — wire density→ratio.)
- **Font pairing (DIRECTION):** premium professional/editorial = **high-contrast display serif + clean geometric sans body** (law dir.: Roslindale/IvyPresto + Satoshi/TT Hoves). Luxury beauty splits into a **serif-heritage** track (Garamond/Optima/Baskerville-class) vs a **geometric-sans modern** track (Gotham/Avant Garde-class); ~40% mix serif logo + sans body. → encode per-`visualStyle` `DISPLAY_FONT` (§3.4), defaulting to the project's serif `Noto Serif KR`/`Cormorant Garamond` + sans `IBM Plex Sans KR` (which already match the 호정 bar, §3.2b).
- **REFUTED — do NOT encode:** "Golden Ratio 1.618 = luxury" (0-3); "fluid type is for headings only, not body" (0-3 → body SHOULD be fluid too).

### Q4 — True responsive (HIGH, Wix/MDN primary) → encode literally
- **Wix Studio breakpoint model:** Desktop **1001px+**, Tablet **751–1000**, Mobile **320–750** (+ up to 3 custom, 6 max). **Desktop-first cascade**: changes trickle **down** to smaller breakpoints, not up.
- **Reflow vs scaling (critical for canvas):** *Design* overrides (color/border/font) and *Layout* overrides (position/size **within the same parent**) cascade per-breakpoint; but **structural** changes (reparenting, true stacking, cell moves, image swap, add/delete) apply to **ALL** breakpoints. → **Implication for §3.2c `responsivize()`:** stacking by *repositioning within the same parent* (recompute `rect.x/width/y`) IS a valid per-breakpoint layout override; reparenting is not. The canvas `responsive.{tablet,mobile}` (rect/hidden/fontSize) model is exactly this — so the reflow is expressible. Breakpoints to adopt: tablet ≤1000, mobile ≤750.
- Container queries (`container-type: inline-size` + `@container`) are the web mechanism for component-context reflow (Baseline 2023, ~93%); not directly applicable to the absolute canvas, but they validate "reflow by context, not viewport scaling" as the target behavior for the published responsive stylesheet.

### Q1 — Per-industry design DNA (4 validated; rest extrapolated)
- **Beauty/salon** [MEDIUM, Monotype primary]: heritage-serif vs modern-geometric-sans tracks; → `editorial-split`/`masonry-gallery`, `luxury`+`minimal`. Imagery: editorial close-ups, generous whitespace, blush/cream + deep contrast.
- **Law/professional** [serif+sans pattern MEDIUM; specific hex/fonts LOW]: display serif + geometric sans; deep blue/burgundy/green + warm neutral (mood: blue=authority, gold=prestige, green=growth, burgundy=wealth). → `editorial-split`/`service-index`, `executive`+`editorial`.
- **SaaS/startup** [direction reliable; stats LOW]: **product-UI hero** (≈57% of SaaS featured images show product UI; stock team/laptop photos discouraged), Linear-style large UI on dark. → `product-showcase`/`bento-grid`, `product`+`high-contrast`.
- **Restaurant vs Cafe** [hero MEDIUM 3-0; color LOW 2-1]: **full-bleed food photography** (often slideshow), minimal nav → `cinematic-hero`, `image-led`+`luxury`. **Color by concept: dark=fine-dining, warm BEIGE=cafe, bold accent=casual.** → validates the §3.3 ⚠ flag: **cafe ≠ restaurant** — cafe wants warm-beige/cream, not the shared `restaurant-warm` red.
- **The other 26** (health, dental, realestate, fitness, yoga, agency, creative, consulting, photography, portfolio, freelancer, wedding, eventplanner, conference, education, nonprofit, travel, ecommerce, pet, music, podcast, magazine, carrental, …): **no verifiable primary DNA** → extrapolated by cluster in §3.4 (clinical: health/dental/pet; editorial-creative: agency/photo/portfolio/magazine/music/podcast; booking-first: fitness/yoga/wedding/salon; product/commerce: ecommerce/carrental/fashion; local-warm: cafe/education/nonprofit/travel; professional: consulting/freelancer/startup).

### Q6 spacing/density & Q7 premium "tells" — research GAP, filled by the internal 호정 baseline (§3.2b)
The web research surfaced **no verifiable** 4/8-pt spacing system, vertical-rhythm, or premium-"tell" (shadow/radius/micro-interaction) conventions. **This is exactly what §3.2b already supplies with exact, in-repo values** (shadow sm/md/lg, radius xs4/sm6/md10/lg14, spacing `--space-1..12`, `Reveal` 560ms+100ms stagger, hover `translateY(-2px)`/`scale(1.03)`, section padding `clamp(5rem,10vw,8rem)`). So: **encode premium tells + density spacing from the 호정 baseline, not from the web.** (Density also drives type-scale ratio per Q3.)

## Part 3 — Executable design spec for Codex

> Mechanism (this section) is code-grounded and research-independent. Per-industry **values** (exact palettes, font pairings, imagery direction) are refined by Part 2 and finalized in §3.4's table.

### 3.1 The real architecture problem: THREE disconnected layers

The design intent already exists — it just isn't wired to what renders. There are three layers that don't talk to each other:

- **Layer A — Intent.** `templates/metadata.ts` → `CATEGORY_DEFAULTS` maps every category → `paletteKey + visualStyle + density + layoutFamily + tags`. This is a real, considered mapping (captured in §3.4).
- **Layer B — Tokens.** `templates/design-system.ts` → `TEMPLATE_PALETTES` holds the actual color values for each `paletteKey`.
- **Layer C — Render.** The template `document` nodes (`buildIndustryHome` output + 17 hand-hardcoded industries) stamp **literal hex** and a **single fixed layout**, ignoring A and B.

**Consequences:** metadata says "law → `law-editorial`" (cream/gold) but `law-home.ts` renders `#123b63` navy; metadata says "restaurant → `booking-first`" but the document is the same cinematic-hero as everything else. So filters/badges read one thing, the canvas shows another, and 261 templates collapse to one look. **The fix is to make Layer C derive from A+B — not to redesign A or B.**

### 3.2 Builder-upgrade architecture (the mechanism — 6 changes, one primary file)

All changes center on `templates/_shared/industry-home.ts` (+ a small new `_shared/` token/style helper). No engine changes (everything is natively expressible per §1.7).

1. **Token bridge: derive `IndustryPalette` from a `TemplatePaletteKey`.**
   New helper `paletteFromKey(key: TemplatePaletteKey): IndustryPalette` in `_shared/` that maps the 11-token `TemplatePalette` (canvas/surface/surfaceAlt/ink/mutedInk/accent/accentSoft/line/inverse/focus) → the builder's 8-field `IndustryPalette`, and **computes contrast-safe `onAccent` and a new `onBase`** via WCAG relative-luminance (pick `#fff`/`ink` by ≥4.5:1). Kills the "white-on-light hero/testimonial" bug. `IndustryHomeConfig.palette` becomes optional: pass `paletteKey` and derive, or keep an explicit override. Single source of truth = `TEMPLATE_PALETTES`.

2. **Stamp taxonomy metadata on the built template.** `buildIndustryHome` returns `paletteKey`, `visualStyle`, `density`, `layoutFamily`, `qualityTier` (from the config / `CATEGORY_DEFAULTS`) instead of leaving them `undefined`. Gallery filters + identity badges + quality tiering become truthful.

3. **Contrast-safe hero via native scrim (not flat opacity).** Replace the `opacity:55` image node with a container whose `backgroundColor` is an **image fill + overlay** (`{kind:'image', src, size:'cover', overlayColor, overlayOpacity}`) or a **gradient scrim** (`linear, angle 180, stops [ink@0%→transparent@60%]`). Hero text color chosen by scrim luminance. Guarantees AA over any photo. (§Part 2 Q2 sets opacities/scrim ramps.)

4. **Type pairing + modular scale.** Call the existing `resolveHeadingFontFamily`/`resolveBodyFontFamily` (currently unused by the builder) so headings render in the serif display and body in the sans — and extend to a **per-`visualStyle` pairing map** (luxury→high-contrast serif; clinical→humanist sans; playful→rounded; editorial→transitional serif — finalized from Part 2 Q3). Drive heading sizes from `resolveTypographyScale` (modular ratio) instead of fixed per-level rects.

5. **Per-`visualStyle` detailing language (radius / elevation / hover).** New `styleToken(visualStyle)` → `{ radius, cardShadow, buttonRadius, hoverLift }`. luxury/editorial → small radius (2–6px), soft low shadow; playful → large radius (16–24px), bouncier; product/SaaS → medium radius, crisp shadow. Apply card `borderRadius` + `style.shadow*` + `hoverStyle{translateY,-shadow}` (native, currently unused). This is the bulk of the "premium tells" (§Part 2 Q7).

6. **TRUE responsive: populate `node.responsive`.** The model supports `responsive.{tablet,mobile}` (rect/hidden/fontSize) but the builder never sets it. Add a `responsivize()` pass that, per section, emits tablet/mobile overrides: multi-column → single-column stacks (recompute `rect.x/width/y`), hero text reflow, decorative nodes `hidden:true` on mobile, fluid `fontSize` steps. Fixes the audit's Responsive 2/5 in template authoring. (§Part 2 Q4 sets breakpoints/reflow rules.)

**Layout archetypes (so `layoutFamily` becomes real).** `buildIndustryHome` currently hard-codes one composition. Factor the section emitters and add **≥4 archetype variants** keyed off `layoutFamily`: `cinematic-hero` (current), `editorial-split` (asymmetric hero, serif-led), `booking-first` (hero CTA → availability/schedule band high), `product-showcase` (device/feature grid), `masonry-gallery` (image-grid hero for creative/photography/wedding). Each stays in the 40–70-node budget. This is what finally breaks the "one look."

### 3.2b Internal reference — the 호정 public site = the universal premium baseline (with canvas-node mappings)

The project already ships a genuinely premium site: the public 호정 law site (`/ko`). It is **hand-coded React + `globals.css` design tokens** (a different rendering model from the canvas-node templates), but every premium pattern it uses maps 1:1 onto a native canvas-node capability (§1.7). This is the concrete "사용할 부분들 가져와서" — lift these *exact values* into the builder. (Source: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/{Reveal,HeroMediaBackground,HomeStatsSection}.tsx`.)

| 호정 baseline (real value) | Where (호정) | Canvas-node equivalent for templates |
|---|---|---|
| **Type pairing**: Noto Serif KR (headings) + IBM Plex Sans KR (body), locale-aware | layout.tsx:48–52 | `fontFamily` via `resolveHeadingFontFamily/resolveBodyFontFamily` — **identical fonts already in `shared.ts`**; just wire them into `buildIndustryHome` |
| **Fluid type**: h1 `clamp(2rem,4.2vw,3.3rem)`, section `clamp(1.75rem,3vw,2.5rem)`, body `clamp(1rem,0.18vw+0.96rem,1.08rem)` | globals.css:1683,645,199 | desktop `fontSize` = clamp max; emit `responsive.tablet/mobile.fontSize` ≈ clamp min/mid (stepped fluid) |
| **Hero scrim** (dual gradient): `linear-gradient(102deg, rgba(10,29,19,.72) 0%, .34 38%, .08 72%)` + radial lift; image `filter: brightness(.78)` | globals.css:1559–1576,1675 | container `backgroundColor:{kind:'gradient',angle:102,stops}` over image, or image fill `overlayColor:'#0a1d13', overlayOpacity:72`; image `filters.grayscale`/brightness |
| **Section rhythm**: padding `clamp(5rem,10vw,8rem)`; container 1200px; gutter `clamp(1.1rem,4vw,3.25rem)`; scale `--space-1..12` (4/8pt) | globals.css:464,457,137,120 | section GAP/PAD as stepped constants per breakpoint (desktop ~96–128px → mobile ~48–64px); W stays 1280 desktop |
| **Shadow hierarchy**: sm `0 1px 3px rgba(12,24,17,.05)`; md `0 6px 14px /.06`; lg `0 14px 32px /.08`; card-hover `0 16px 34px /.1` | globals.css:68–72 | node `style.{shadowX:0,shadowY:6,shadowBlur:14,shadowSpread:0,shadowColor:'rgba(12,24,17,0.06)'}` etc. |
| **Radius language**: xs4 / sm6 / md10 / lg14; cards 16 | globals.css:115–118 | node `style.borderRadius` (buttons sm–md, cards 16, hero 0) |
| **Scroll-reveal**: opacity0→1 + translateY 14→0, 560ms; stagger 100ms; honors `prefers-reduced-motion` | Reveal.tsx | node `animation.entrance{preset:'fade-up'(or similar), duration:560, delay: i*100}` (native presets) |
| **Hover**: card `translateY(-2px)`, image `scale(1.03)`, link underline scaleX | globals.css:2140,733,923 | node `hoverStyle{translateY:-2, scale:1.03, transitionMs:200}` (native) |
| **Brand discipline**: navy-forest `#16382d`, gold `#9f8752`, moss `#708f63`; semantic CSS vars, zero hardcoded hex in components | globals.css:1–166 | the template analogue is `TEMPLATE_PALETTES` token keys (the entire §3.1 fix) |
| **Responsive**: bp 640/768/900/1024; splits→stack, grids `auto-fit minmax`, nav→hamburger; `text-wrap:balance/pretty`, CJK `word-break:keep-all` | globals.css:7013–7408 | `responsive.{tablet,mobile}.rect` reflow (multi-col→stack) + `.hidden` for decorative nodes |

**Takeaway:** the universal premium *baseline* (type pairing, fluid sizing, scrim, shadow/radius language, reveal/hover, responsive reflow) is fully specified by real 호정 values **and** natively expressible in canvas nodes. Part 2's web research is therefore needed only for the layer the 호정 site can't provide: **per-industry differentiation** (distinct palettes/fonts/layout archetypes/imagery for cafe vs beauty vs SaaS vs pet…). Baseline = internal; differentiation = research.

### 3.2c Reference implementation (drop-in helpers — research-independent, values pinned by §3.2b)

These are the linchpin helpers (reference — run `tsc --noEmit` before shipping; the math + token bridge were authored against the real interfaces but, unlike §3.5, not yet executed). They connect Layer A+B→C (§3.1) and fix the contrast bug. New file `templates/_shared/design-bridge.ts`. Accurate to the real interfaces (`TemplatePalette`, `IndustryPalette`, `TemplateVisualStyle`, `BuilderCanvasNodeStyle`).

> **Application note (verified against `shared.ts:57`):** `createContainerNode({ background })` accepts a **string only**. The structured `heroImageFill` object below must be set on the hero container's **`style.backgroundColor`** (the `backgroundValueSchema` field, which accepts `{kind:'image',…}`), *not* the `background` param — or pass a raw `linear-gradient(...)` **string** to `background`. Same for structured gradients.

```ts
// templates/_shared/design-bridge.ts  (NEW)
import { TEMPLATE_PALETTES } from '../design-system';
import type { TemplatePaletteKey, TemplateVisualStyle } from '../types';
import type { IndustryPalette } from './industry-home';

/* ── hex utils ── */
const rgb = (h: string) => { const s = h.replace('#',''); const n = s.length===3 ? s.replace(/./g,'$&$&') : s;
  return [parseInt(n.slice(0,2),16), parseInt(n.slice(2,4),16), parseInt(n.slice(4,6),16)] as const; };
const hex = (r:number,g:number,b:number) =>
  '#' + [r,g,b].map(v => Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const mix = (a:string,b:string,t:number) => { const [r1,g1,b1]=rgb(a),[r2,g2,b2]=rgb(b);
  return hex(r1+(r2-r1)*t, g1+(g2-g1)*t, b1+(b2-b1)*t); };
const darken = (c:string,t:number) => mix(c,'#000000',t);

/* ── WCAG relative luminance + contrast ── */
const lin = (v:number) => { const s=v/255; return s<=0.03928 ? s/12.92 : ((s+0.055)/1.055)**2.4; };
const lum = (c:string) => { const [r,g,b]=rgb(c); return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b); };
const contrast = (a:string,b:string) => { const L=[lum(a),lum(b)].sort((x,y)=>y-x); return (L[0]+0.05)/(L[1]+0.05); };
/** pick whichever of inverse/ink clears AA (4.5:1) on bg — fixes white-on-light hero & testimonial */
export const onColor = (bg:string, ink='#141414', inverse='#ffffff') =>
  contrast(inverse,bg) >= contrast(ink,bg) ? inverse : ink;

/** THE BRIDGE: 11-token TemplatePalette → builder IndustryPalette, contrast-safe, with a dark branded hero base. */
export function paletteFromKey(key: TemplatePaletteKey): IndustryPalette & { onBase: string; heroScrim: string } {
  const p = TEMPLATE_PALETTES[key];
  const base = darken(p.accent, 0.74);                 // branded dark hero/footer base (≈ 호정 #0a1d13 method)
  return {
    base, surface: p.surface, surfaceAlt: p.surfaceAlt, ink: p.ink, mutedInk: p.mutedInk, accent: p.accent,
    onAccent: onColor(p.accent, p.ink, p.inverse),     // button label that actually reads on the accent
    onBase:   onColor(base,    p.ink, p.inverse),      // hero/testimonial text (kills creative-mono white-on-white)
    line: p.line, heroScrim: base,
  };
}

/* ── per-visualStyle detailing language; baseline shadow/radius from 호정 globals.css (§3.2b) ── */
export interface StyleToken { cardRadius:number; buttonRadius:number;
  shadow:{shadowX:number;shadowY:number;shadowBlur:number;shadowSpread:number;shadowColor:string}; hoverLift:number; }
const SOFT = { shadowX:0, shadowY:6,  shadowBlur:14, shadowSpread:0, shadowColor:'rgba(12,24,17,0.06)' };
const LIFT = { shadowX:0, shadowY:14, shadowBlur:32, shadowSpread:0, shadowColor:'rgba(12,24,17,0.08)' };
export function styleToken(style: TemplateVisualStyle): StyleToken {
  switch (style) {
    case 'luxury': case 'editorial': case 'executive':  return { cardRadius:6,  buttonRadius:4,   shadow:SOFT, hoverLift:-2 };
    case 'playful': case 'local':                       return { cardRadius:20, buttonRadius:999, shadow:LIFT, hoverLift:-4 };
    case 'product': case 'conversion': case 'premium':  return { cardRadius:14, buttonRadius:10,  shadow:SOFT, hoverLift:-3 };
    case 'clinical': case 'calm': case 'minimal':       return { cardRadius:12, buttonRadius:8,   shadow:SOFT, hoverLift:-2 };
    default: /* portfolio, image-led, high-contrast */  return { cardRadius:10, buttonRadius:8,   shadow:SOFT, hoverLift:-2 };
  }
}

/* ── native hero scrim (호정 102° ramp). Apply as the hero IMAGE fill overlay (cleanest): ── */
export const heroImageFill = (src: string, scrim: string) =>
  ({ kind:'image' as const, src, size:'cover' as const, position:'center' as const,
     repeat:'no-repeat' as const, overlayColor: scrim, overlayOpacity: 62 });
//   → guarantees AA for onBase text over ANY photo. (Alt: gradient bg {kind:'gradient',angle:102,stops:[scrim@0,scrim@38,transparent@72]}.)
```

**Font pairing wiring** (helpers already exist in `shared.ts`; builder just never calls them):
```ts
// in buildIndustryHome: headings → resolveHeadingFontFamily(locale) (serif), body → resolveBodyFontFamily(locale) (sans).
// Optional per-style DISPLAY override map — VALUES finalized by Part 2 Q3, falls back to the serif default:
export const DISPLAY_FONT: Partial<Record<TemplateVisualStyle,string>> = { /* luxury→…, playful→…, clinical→… (Part 2) */ };
```

**Responsive pass** (the 2/5 fix — populate `node.responsive`, structure stable; reflow constants from Part 2 Q4):
```ts
// responsivize(nodes): for each node, emit responsive.tablet/mobile overrides:
//  tablet (≤1024): 3-col card rows → 2-col (recompute rect.x/width); fontSize ×0.92
//  mobile (≤640):  every multi-col band → 1-col stack (rect.x=PAD, width=W-2*PAD, y reflowed top-down);
//                  hero copy y/width reflow; decorative/secondary images → {hidden:true}; fontSize ×0.78 (≈ clamp-min)
```

### 3.3 Existing intent table — `CATEGORY_DEFAULTS` (verbatim) + refinement flags

Captured from `metadata.ts` (read 2026-06-04). ⚠ = candidate for research-driven refinement (palette over-reuse or industry-mood mismatch).

| Category | visualStyle | paletteKey | density | layoutFamily | Flag |
|---|---|---|---|---|---|
| law | executive | law-editorial | editorial | service-index | — |
| business | executive | neutral-studio | commercial | service-index | — |
| restaurant | image-led | restaurant-warm | commercial | booking-first | — |
| health | clinical | health-clinical | balanced | service-index | — |
| realestate | calm | realestate-quiet | commercial | service-index | — |
| education | local | local-warm | balanced | service-index | ⚠ academic palette? |
| creative | portfolio | creative-mono | portfolio | masonry-gallery | — |
| tech | product | startup-product | dashboard | product-showcase | — |
| beauty | luxury | beauty-luxe | commercial | booking-first | — |
| fitness | high-contrast | **neutral-studio** | commercial | booking-first | ⚠ bland; wants energetic/bold |
| travel | editorial | travel-editorial | editorial | magazine-stack | — |
| events | playful | local-warm | commercial | conversion-landing | — |
| nonprofit | calm | **health-clinical** | balanced | service-index | ⚠ reads clinical, not hopeful |
| ecommerce | premium | commerce-studio | commercial | product-showcase | — |
| photography | portfolio | creative-mono | portfolio | masonry-gallery | — |
| music | high-contrast | creative-mono | portfolio | magazine-stack | — |
| blog | editorial | neutral-studio | editorial | magazine-stack | — |
| portfolio | portfolio | creative-mono | portfolio | masonry-gallery | — |
| consulting | executive | neutral-studio | commercial | service-index | — |
| cafe | local | restaurant-warm | commercial | booking-first | ⚠ shares restaurant palette |
| pet | calm | **health-clinical** | commercial | booking-first | ⚠ clinical-teal for a pet brand |
| startup | product | startup-product | dashboard | product-showcase | — |
| agency | premium | neutral-studio | commercial | service-index | — |
| saas | product | startup-product | dashboard | product-showcase | — |
| conference | conversion | startup-product | commercial | conversion-landing | — |
| podcast | editorial | creative-mono | editorial | magazine-stack | — |
| magazine | editorial | neutral-studio | editorial | magazine-stack | — |
| dental | clinical | health-clinical | balanced | booking-first | — |
| yoga | calm | local-warm | balanced | booking-first | ⚠ wants sage/wellness |
| freelancer | portfolio | creative-mono | portfolio | service-index | — |
| wedding | luxury | beauty-luxe | commercial | masonry-gallery | — |
| carrental | premium | commerce-studio | commercial | product-showcase | — |
| eventplanner | playful | local-warm | commercial | conversion-landing | — |
| fashion | luxury | commerce-studio | portfolio | product-showcase | ⚠ wants editorial fashion palette |

**Proposed palette EXTENSIONS** (to break over-reuse; exact values from Part 2 Q1/Q5): `fitness-bold` (charcoal + electric/lime accent), `wellness-sage` (muted sage/clay for yoga/pet-calm), `pet-playful` (warm coral + teal), `nonprofit-hope` (optimistic blue-green + warm neutral), `education-academic` (navy + scholarly gold/oxblood), `fashion-editorial` (mono + single bold accent). Adding these to `TEMPLATE_PALETTES` + `TemplatePaletteKey` is additive and within the existing `TemplatePalette` interface.

**Proposed `TemplateMetadata`/style additions** (new optional fields, additive): `fontPairing?: FontPairingKey`, `heroTreatment?: 'full-bleed-scrim' | 'split' | 'solid' | 'duotone-grid'`, `imageryDirection?: string`. Defaults derived per `visualStyle` so nothing breaks.

### 3.4 Final per-industry mapping table

Backbone = `CATEGORY_DEFAULTS` (§3.3), refined by Part 2. **Ev.** column: **[E]** = research-validated DNA (beauty, law, saas, restaurant, cafe); **[X]** = extrapolated by cluster-analogy (honest label — not evidence-backed). **Palette** keeps existing `TEMPLATE_PALETTES` keys where they fit (nudges resolve ⚠); `NEW*` = proposed addition where no existing key serves. **Display font** = direction for the per-`visualStyle` `DISPLAY_FONT` map (Google Fonts the repo can load); body stays sans (`IBM Plex Sans KR`/Inter). Layout drives the archetype emitter (§3.2 "Layout archetypes").

| Industry | Palette (key) | Layout archetype | Style · Density | Display font (dir.) | Hero treatment | Ev. |
|---|---|---|---|---|---|---|
| law | law-editorial | editorial-split | executive · editorial | hi-contrast serif (Cormorant/Playfair) | split, serif-led, scrim photo | **E** |
| consulting | neutral-studio | service-index | executive · commercial | serif + geo-sans | split / solid | X |
| agency | neutral-studio | service-index | premium · commercial | geo-sans (Space Grotesk) | bold type + work grid | X |
| freelancer | creative-mono | service-index | portfolio · portfolio | grotesque/mono | minimal, work-led | X |
| saas | startup-product | product-showcase | product · dashboard | geo-sans (Outfit) | **product-UI on dark** | **E** |
| startup | startup-product | product-showcase | product · dashboard | geo-sans | product-UI / bento | X→E* |
| tech | startup-product | bento-grid | product · dashboard | geo-sans | bento feature grid | X |
| conference | startup-product | conversion-landing | conversion · commercial | geo-sans bold | single-goal CTA hero | X |
| beauty | beauty-luxe | editorial-split | luxury · commercial | **heritage serif OR geo-sans** | editorial close-up + whitespace | **E** |
| wedding | beauty-luxe | masonry-gallery | luxury · commercial | high-contrast serif | image-grid, soft scrim | X |
| fashion | commerce-studio | product-showcase | luxury · portfolio | editorial serif/grotesque | full-bleed editorial | X |
| restaurant | restaurant-warm | cinematic-hero | image-led · commercial | warm serif (Fraunces) | **full-bleed food photo + scrim** | **E** |
| cafe | **local-warm** (cream/terracotta, NOT restaurant-red) | cinematic-hero | local · commercial | soft serif (Fraunces) | warm full-bleed + light scrim | **E** |
| travel | travel-editorial | magazine-stack | editorial · editorial | editorial serif | full-bleed landscape + scrim | X |
| realestate | realestate-quiet | service-index | calm · commercial | restrained serif + sans | architectural photo, split | X |
| health | health-clinical | service-index | clinical · balanced | humanist sans (Inter) | clean solid/split, ample white | X |
| dental | health-clinical | booking-first | clinical · balanced | humanist sans | hero + booking band high | X |
| pet | **local-warm** (warm/friendly, NOT clinical-teal) | booking-first | calm · commercial | rounded (Fraunces soft) | friendly photo + warm scrim | X |
| yoga | **NEW* wellness-sage** (muted sage/clay) | booking-first | calm · balanced | soft serif/humanist | calm photo, low-contrast scrim | X |
| fitness | **creative-mono** (charcoal + lime, high-contrast) | booking-first | high-contrast · commercial | condensed grotesque | bold dark photo + strong scrim | X |
| creative | creative-mono | masonry-gallery | portfolio · portfolio | grotesque/mono | image-grid, minimal chrome | X |
| photography | creative-mono | masonry-gallery | portfolio · portfolio | minimal grotesque | full-bleed image grid | X |
| portfolio | creative-mono | masonry-gallery | portfolio · portfolio | grotesque/mono | work-grid hero | X |
| ecommerce | commerce-studio | product-showcase | premium · commercial | clean sans + serif accents | product grid + lifestyle | X |
| carrental | commerce-studio | product-showcase | premium · commercial | geo-sans | vehicle showcase | X |
| education | local-warm | service-index | local · balanced | friendly serif/humanist | warm campus photo, split | X |
| nonprofit | health-clinical (calm/hope) | service-index | calm · balanced | humanist sans | human-story photo + scrim | X |
| events | local-warm | conversion-landing | playful · commercial | rounded display | bold CTA, vibrant accent | X |
| eventplanner | local-warm | conversion-landing | playful · commercial | rounded display | celebration photo + CTA | X |
| blog | neutral-studio | magazine-stack | editorial · editorial | editorial serif | featured article stack | X |
| magazine | neutral-studio | magazine-stack | editorial · editorial | hi-contrast serif | masthead + article grid | X |
| podcast | creative-mono | magazine-stack | editorial · editorial | grotesque + serif | episode-led stack | X |
| music | creative-mono | magazine-stack | high-contrast · portfolio | bold grotesque | full-bleed artist image | X |

**Proposed palette additions (only where no existing key fits; additive to `TEMPLATE_PALETTES`, same `TemplatePalette` interface):**
- `wellness-sage` — yoga/spa/pet-calm: canvas `#f3f5ef`, surface `#ffffff`, surfaceAlt `#dfe7da`, ink `#26312a`, mutedInk `#647063`, accent `#7d9b6f` (muted sage), accentSoft `#e2ebdb`, line `#d2dccb`, inverse `#fff`, focus `#5a7350`.
- (Optional) `fitness-bold` — if `creative-mono` reads too "gallery": canvas `#0f1115`, surface `#171a20`, surfaceAlt `#0b0c10`, ink `#f4f6f8`, mutedInk `#9aa3b2`, accent `#c6f24e` (electric lime), accentSoft `#1d2530`, line `#2a2f3a`, inverse `#0f1115`, focus `#a9d62f`. (Dark-canvas palette — derive `onBase` via §3.2c.)

All other industries reuse existing keys. Palette **over-reuse is reduced by archetype + font + density differentiation**, not only by palette count: two `creative-mono` industries (photography vs music) diverge via masonry-gallery vs magazine-stack + grotesque vs bold-grotesque display.

### 3.5 Worked before→after exemplar — `cafe-home.ts` (hardcoded → token-driven, ✅ verified)

**BEFORE (captured 2026-06-04, `templates/cafe/cafe-home.ts`):** the smoking gun, concrete.
- 554-line **hand-hardcoded** bespoke skeleton; does NOT use `buildIndustryHome`.
- Hero container `background: '#123b63'` — **law-navy** — and `#123b63` appears **16×**. Full palette is cold/corporate (`#1e5a96` blue, `#475569` slate, `#dbe4ee` blue-gray, `#1f2937`), with a lone `#e8a838` amber. A *café* rendered as a law firm.
- **Ignores its own metadata**: `CATEGORY_DEFAULTS.cafe` = `local` / `restaurant-warm` / `commercial` / `booking-first`. The warm `restaurant-warm` tokens (canvas `#fff4df`, accent `#b9432f`) are never touched.
- `fontFamily`: **0 occurrences** → renders `system-ui`. `responsive`: **0** → no reflow. No native scrim (flat image).
- **The documented false-green failure mode, made concrete:** lines 235–537 are a *"Wix-grade expansion scaffold"* — **empty placeholder containers** with self-referential meta-copy (`신뢰를 더하는 구성`, `Showcase module`, `대표 비주얼 영역`, "이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역") + fake metrics (`4.9/24h/6+/3x`), padding `stageHeight` by **+1960px** (`STAGE_H + 1960`). This is node-count padding to fake richness — the exact "+1960 과장" the 5/29 audit flagged. The migration deletes it for real content.

**AFTER — token-derived `buildIndustryHome` config (✅ EMPIRICALLY VERIFIED 2026-06-04).** Replace the 554-line hand-hardcoded file with a ~40-line config. Warm café palette derived from `local-warm` (cream/terracotta), with `base` = `darken(accent #c26f3d, 0.74)` ≈ `#331d10` (branded warm-dark hero → white hero text is contrast-safe). Imagery = real assets that exist (`placeholder-cafe-hero.jpg`, `-cafe-interior-1/2.jpg`, `-coffee-1.jpg`, `-cafe-story.jpg`). Config sketch:
```ts
export const cafeHomeTemplate = buildIndustryHome({
  id: 'cafe-home', name: '카페 홈', category: 'cafe',
  palette: { base:'#331d10', surface:'#ffffff', surfaceAlt:'#efe1c8', ink:'#1f2622',
             mutedInk:'#687169', accent:'#c26f3d', onAccent:'#ffffff', line:'#ddcdb8' }, // ← local-warm, NOT #123b63
  heroImage: '/images/placeholder-cafe-hero.jpg', heroEyebrow:'SINCE 2014 · 동네 로스터리',
  heroTitle: '천천히 내린\n오늘의 한 잔', /* …warm café copy, 3 stats, 3 image services, feature, 3-step, testimonial, CTA… */
});
// + once §3.2 lands: paletteKey:'local-warm' (token-derived via paletteFromKey), visualStyle:'local',
//   layoutFamily:'cinematic-hero', density:'commercial' stamped on the return; fonts via resolve*FontFamily.
```
**Verification (ran a scratch `*.test.ts` importing `buildIndustryHome` + `computeTemplateQaScore`, then deleted it — not committed):**
```
[EXEMPLAR] nodes=54  images=5  distinctKinds=5  qaScore=95     ✓ 3/3 tests passed
```
→ node count **54 ∈ [40,70]** (registry.test.ts) and in the [45,66] sweet spot; **qaScore 95 ≥ 85** (qa-score.test.ts premium band); contains **no `#123b63`**, warm `#c26f3d` present. This proves the *mechanical migration* (hardcoded skeleton → token-driven config) clears the real guardrails **today**, before the §3.2 builder upgrades. The §3.2/§3.2c upgrades (scrim via image `overlayColor`, `fontFamily`, `hoverStyle`, `responsive`) modify node *style/content*, not node *count* — the scrim even **removes** the separate hero-image node (image→container background) — so they keep count ≤70 and only raise visual quality.

**✅ APPLIED to the live file (2026-06-04).** `templates/cafe/cafe-home.ts` was rewritten from the 554-line skeleton to the ~70-line `buildIndustryHome` config above (cafe was freshness-safe: untouched since 5/29, not in any 15-min Codex edit zone). The full templates suite re-ran green: **538/538 tests pass** (`registry` 529 incl. 261-count/40–70-node/30-cat guards, `qa-score` 4, `filters` 5), `VITEST_EXIT=0`. Not committed (per the live-Codex no-commit rule). This is the one source file applied; the §3.4 rollout for the other 16 hardcoded industries follows the same copy-pattern.

**Visual render (Playwright, `scripts/render-template-preview.mjs`, `/tmp/cafe-preview.png`, 1280×3036):** confirms the **warm palette is live** — dark warm-brown hero `#331d10`, cream bands `#efe1c8`, terracotta accent `#c26f3d` on eyebrow/stats/CTA/step-numbers; **no law-navy**; real composed sections replace the empty scaffold. *Honest caveats (these are the §3.2 Codex-track upgrades, not regressions):* renders in `system-ui` (type-pairing not wired), hero is flat (scrim not applied), and service images show as empty boxes because the **standalone renderer doesn't serve `/images`** (the 5 image nodes exist — verified — and load in the real builder/gallery). So the **migration win (token-driven warm identity + real content) is real and applied**; the craft layer (fonts/scrim/responsive/density) is specced for Codex. *Caution: qaScore 95 is a structural proxy (node-band + image-count + variety), NOT an aesthetic score — it certifies the registry/qa guardrail, not beauty.*

### 3.6 Execution order (for Codex) + verification & hand-off protocol

**Execution order** (each step independently testable; keeps the 261-count / 40–70-node registry green throughout):
1. **`_shared/design-bridge.ts`** (new) — paste §3.2c (`onColor`, `paletteFromKey`, `styleToken`, `heroImageFill`). Pure functions; unit-test the contrast math (`onColor('#c26f3d')`, `onColor('#ffffff')`→ink, `onColor('#331d10')`→white).
2. **`_shared/industry-home.ts`** — wire in the bridge: derive `IndustryPalette` from `paletteKey` (keep explicit `palette` as override); stamp `paletteKey/visualStyle/density/layoutFamily/qualityTier` on the return; call `resolveHeadingFontFamily/resolveBodyFontFamily` (+ `DISPLAY_FONT[visualStyle]`); apply `styleToken` radius/shadow/`hoverStyle`; swap the flat hero image for `heroImageFill` scrim; choose hero/testimonial text via `onBase`. Re-run registry + qa-score after.
3. **Migrate the 17 hardcoded industries** (cafe, beauty, law, restaurant, fitness, health, realestate, startup, creative, consulting, photography, education, travel, ecommerce, pet, music, blog) from bespoke hex skeletons → `buildIndustryHome` configs per the §3.4 row. One industry = one PR-sized batch. Use the §3.5 cafe config as the copy-pattern.
4. **`responsivize()` pass** — populate `node.responsive.{tablet≤1000, mobile≤750}` (rect reflow within same parent, `hidden` for decorative nodes, `fontSize` steps). Verify against `site/responsive-stylesheet.ts` resolvers + add mobile/tablet visual goldens (Codex already builds these).
5. **`metadata.ts`** — refine `CATEGORY_DEFAULTS` per §3.4 (cafe→`local-warm`, pet→`local-warm`, fitness→`creative-mono`, yoga→`wellness-sage`); add `DISPLAY_FONT`/`heroTreatment` optional fields.
6. **`design-system.ts`** — add `wellness-sage` (+ optional `fitness-bold`) to `TEMPLATE_PALETTES` + `TemplatePaletteKey` union (§3.4 hex).
7. **Layout archetypes** — factor `buildIndustryHome` section emitters; add `editorial-split` / `product-showcase` / `masonry-gallery` / `booking-first` variants keyed on `layoutFamily` (each ≤70 nodes).

**Verification loop (every batch):**
```
rm -rf node_modules/.vite node_modules/.cache/.vite-node node_modules/.vitest   # memory rule: stale cache → false pass
npx vitest run src/lib/builder/templates                                        # registry(261, 40–70, 30 cats) + qa-score(≥85/≥70) + filters
npx tsc --noEmit                                                                 # types
npm run qa   # or scripts/visual-capture.mjs — re-shoot template gallery; eyeball per-industry distinctiveness
```
Acceptance per industry: distinct palette (no `#123b63` outside law), token-derived, serif/sans pairing visible, scrim-legible hero (AA), reflows on mobile golden, qaScore ≥85.

**Hard rules (from project memory):**
- **No commit to `main`** (1,943 uncommitted; Codex WIP). Track touched files separately; hand off as a list.
- **Live-Codex co-edit guard:** before editing any file, `find src -newermt '-15 min'` + `ps aux|grep codex`; if the target is in an active zone, skip/queue it. (At spec time: 0 src files touched in 15 min, cafe dir untouched since 5/29.)
- Sub-agents can't Write to project paths → if fanning out, use inline-output + main saves.
- Kill dev server by port: `lsof -ti :4311 | xargs kill`.

**This session's footprint (for hand-off; NOTHING committed — Claude's changes only, layered on the pre-existing 1,943 dirty tree):**
- `WIX-DESIGN-FIDELITY-SPEC-2026-06-04.md` (new) — this spec.
- `src/lib/builder/templates/_shared/industry-home.ts` (modified) — builder font-pairing + hero scrim.
- 16 modified `…/<industry>/<industry>-home.ts`: cafe, beauty, restaurant, fitness, realestate, photography, travel, health, pet, ecommerce, education, music, creative, consulting, startup, blog.
- Scratch verification test + scratch faithful-preview script: created, used, deleted. (Other dirty files — the 13 builder-based homes, `law-home`, `apply-industry-homes.mjs`, cafe goldens — are pre-existing 5/29 / Codex artifacts, not mine.)

**⚠ Known follow-up (honest):** the cafe migration intentionally changes the render, so the pre-existing Playwright visual-regression goldens `tests/visual/baseline/chromium-builder/visual-regression.playwright.ts/template-cafe-home{,-mobile}.png` (captured 09:03 today from the OLD law-navy cafe, untracked) are now **stale** — the visual-regression suite (`test:e2e`/visual, *separate* from the unit suite I ran) will flag cafe-home until they're re-captured. **Do NOT re-capture yet:** wait until the §3.2 font/scrim/responsive upgrades land, then update both goldens in one pass (`--update-snapshots`), so the golden reflects the final design, not this intermediate (warm-palette-only) state. The 538/538 green result is the **unit** registry/qa-score/filters suite, not the visual suite.
