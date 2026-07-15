# Tseng Law Builder Design System

## 1. Atmosphere & Identity

The builder is a precise legal-site command surface: dense, stable, and inspectable without feeling heavy. The signature is dual identity: a Wix-like editor chrome for authoring, paired with a Shin & Kim-inspired public brand system for published law-firm pages.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Public surface/primary | `--bg-white` | `#FFFFFF` | `#1A1A2E` | Published page backgrounds |
| Public surface/secondary | `--bg-cream` | `#F8F7F5` | `#16162A` | Alternating public sections |
| Public accent/primary | `--accent-purple` | `#5B3A8C` | `#7B5EAD` | Public links, CTA, active navigation |
| Public accent/dark | `--accent-gold` | `#C4A265` | `#C4A265` | Dark public hero/footer accents only |
| Public text/primary | `--text-primary` | `#1A1A2E` | `#F0EDF5` | Published headings and body |
| Editor surface/base | `--editor-bg` | `#F4F5F7` | `#0F1115` | Editor shell background |
| Editor surface/panel | `--editor-panel` | `#FFFFFF` | `#1A1B1F` | Rails, panels, inspector |
| Editor canvas | `--editor-canvas-bg` | `#E9ECF1` | `#12141A` | Canvas surround |
| Editor text/primary | `--editor-fg-primary` | `#0F1115` | `#F8FAFC` | Editor labels and panel text |
| Editor text/muted | `--editor-fg-muted` | `#6B7280` | `#9CA3AF` | Secondary editor text |
| Editor accent | `--editor-accent` | `#116DFF` | `#116DFF` | Selection, focus, primary editor actions |
| Editor danger | `--editor-danger` | `#B91C1C` | `#B91C1C` | Destructive states |
| Inspector accent | `--insp-accent` | `#2563EB` | `#2563EB` | Inspector focus and binding affordances |
| Context active | `--ctx-item-active-fg` | `#BE185D` | `#BE185D` | Context-menu hover/active state |

### Rules

- Public pages use purple on light surfaces and gold only on dark surfaces.
- Builder chrome uses editor tokens from `src/components/builder/canvas/tokens/editorChrome.css`.
- Inspector and context menu controls use tokens from `src/components/builder/canvas/inspector-tokens.css`.
- New UI controls should reference existing CSS variables first. Add a new token only for a distinct semantic role.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Display | `clamp(2.5rem, 5vw, 4rem)` | 800 | 1.15 | 0 | Public hero titles |
| H1 | `clamp(1.75rem, 3vw, 2.5rem)` | 700 | 1.25 | 0 | Public section titles |
| H2 | 22px | 700 | 1.35 | 0 | Builder panel and card titles |
| Body/lg | 18px | 400 | 1.75 | 0 | Public lead copy |
| Body | 16px | 400 | 1.7 | 0 | Public body copy |
| Body/sm | 14px | 500-700 | 1.5 | 0 | Builder labels and secondary UI |
| Caption | 12px | 700 | 1.4 | 0.02em | Builder metadata, chips, status |
| Micro | 10px-11px | 800-900 | 1.35 | 0.04em | Dense inspector and canvas HUD chips |

### Font Stack

- Public Korean headings: `Nanum Myeongjo`, `Batang`, serif.
- Public Chinese headings: `Noto Serif TC`, serif.
- Public English headings: `Cormorant Garamond`, `Georgia`, serif.
- Body and builder UI: `Pretendard`, system sans-serif fallback.
- Mono: `JetBrains Mono`, `SF Mono`, monospace.

### Rules

- Builder UI text uses compact sans-serif sizing; avoid hero-scale type inside panels, badges, rails, and HUD controls.
- Letter spacing is zero except caption/overline metadata already documented above.

## 4. Spacing & Layout

### Base Unit

All layout spacing derives from 4px.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Icon-to-label, tight chip gaps |
| `--space-2` | 8px | Compact control padding |
| `--space-3` | 12px | Form fields and HUD groups |
| `--space-4` | 16px | Default panel/card rhythm |
| `--space-5` | 20px | Comfortable grouped controls |
| `--space-6` | 24px | Larger cards and public section internals |
| `--space-8` | 32px | Panel group separation |
| `--space-12` | 48px | Public section separation |
| `--space-16` | 64px | Major public rhythm |

### Grid

- Public max width: 1280px, structured grid with responsive gutters.
- Editor chrome dimensions: top bar 56px, status bar 28px, left rail 60px, drawers/inspector 320px.
- Canvas overlays and HUD controls must use stable min/max sizes so selecting, hovering, or label changes do not shift the stage.

### Rules

- No viewport-scaled font sizes in editor UI.
- Compact controls must wrap before overflowing on 390px mobile screenshots.

## 5. Components

### Editor Floating Controls
- **Structure**: positioned control group with button chips or icon buttons over selected canvas nodes.
- **Variants**: selection toolbar, repeater HUD, selected repeater-child badge, field chip rail.
- **Spacing**: 4px-12px gaps, 8px radius unless the existing token requires a pill.
- **States**: default, hover, focus-visible, active/current, disabled, locked.
- **Accessibility**: real buttons, descriptive `aria-label`, `aria-current` for active chips, disabled current chip where repeat activation is useless.
- **Motion**: opacity/transform transitions only.

### Inspector Rows
- **Structure**: label/control grid using `insp-row` classes.
- **Variants**: dense, segmented, binding-map, status.
- **Spacing**: 4px/8px/12px multiples.
- **States**: focus ring through `--insp-accent`, disabled opacity, visible override dots.
- **Accessibility**: labels stay tied to controls; controls must be keyboard reachable.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 100-150ms | ease-out | Button hover, chip state |
| Standard | 200-300ms | ease-in-out | Panel and modal transitions |
| Emphasis | 400-600ms | cubic-bezier(0.16, 1, 0.3, 1) | Public page reveals |

### Rules

- Animate `transform`, `opacity`, and subtle color changes only.
- Respect `prefers-reduced-motion` through the editor shell rule.
- Canvas controls must stop pointer propagation so they remain clickable without moving the selected node.

## 7. Depth & Surface

### Strategy

Mixed, but constrained by surface:

- Editor shell: tonal shifts plus hairline borders.
- Floating editor controls: dark or elevated surface with `--editor-shadow-float`.
- Public site cards: light borders and restrained purple-tinted shadow.
- Dark public hero/footer: gold accent, no decorative gradient blobs.

### Rules

- Do not nest UI cards inside other cards.
- Use shadow only for floating controls, popovers, modals, or public cards that need elevation.
- Locked, disabled, loading, empty, and error states must remain visually distinct without relying on color alone.
