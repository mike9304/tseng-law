# CODEX PROMPT — D-POOL-6: Public Widget Visual Polish

## 0. 목표

호정국제 빌더 프로젝트 D-POOL-6 트랙. **빌더가 발행하는 공개 페이지 위젯**들의 비주얼을 윅스(Wix) 본가와 1:1 패리티 수준으로 격상한다.

핵심 원칙
- 기존에 잘 동작하는 클래스/토큰/리졸버는 **확장(extend)**만, 절대 교체/리네임 금지.
- 인라인 스타일로 채워진 위젯은 **colocated CSS Module로 마이그레이션**.
- light + dark 양쪽 토큰 정의, `prefers-reduced-motion`, `:focus-visible` 표준 준수.
- 8 variants × 4 상태(rest/hover/active/disabled+focus) = 일관 비주얼.
- **빌더 admin (`src/components/builder/canvas/*`, `src/components/builder/bookings/BookingsAdmin*`) 절대 손대지 말 것**.

## 1. 변경/신규 대상 파일

### 신규
- `src/lib/builder/components/_shared/widget-tokens.css` (공통 디자인 토큰)
- `src/lib/builder/components/_shared/hover-states.css` (공통 hover/focus/active 클래스 유틸)
- `src/lib/builder/components/contactForm/ContactForm.module.css`
- `src/lib/builder/components/faqList/FaqList.module.css`
- `src/lib/builder/components/columnList/ColumnList.module.css`
- `src/lib/builder/components/columnCard/ColumnCard.module.css`
- `src/lib/builder/components/divider/Divider.module.css`
- `src/lib/builder/components/spacer/Spacer.module.css`
- `src/lib/builder/components/icon/Icon.module.css`
- `src/lib/builder/components/videoEmbed/VideoEmbed.module.css`
- `src/components/builder/bookings/BookingFlowSteps.module.css` (**새 파일** — `BookingsAdmin.module.css` 절대 수정 금지)

### 수정
- `src/lib/builder/components/blogPostCard/BlogPostCard.module.css` (dark/focus/motion 추가)
- `src/lib/builder/components/blogFeed/BlogFeed.module.css` (dark/focus/motion + featured-hero 60vh + 모바일 1col gap)
- `src/components/builder/canvas/elements/ButtonElement.tsx` (시각 폴리시만)
- `src/lib/builder/components/contactForm/index.tsx` (인라인 → CSS Module)
- `src/lib/builder/components/faqList/index.tsx`
- `src/lib/builder/components/columnList/index.tsx`
- `src/lib/builder/components/columnCard/index.tsx` (variantStyle 유지)
- `src/lib/builder/components/divider/index.tsx`
- `src/lib/builder/components/spacer/index.tsx`
- `src/lib/builder/components/icon/index.tsx`
- `src/lib/builder/components/videoEmbed/VideoEmbedRender.tsx`
- `src/components/builder/bookings/BookingFlowSteps.tsx`
- `src/lib/builder/components/formInput/Element.tsx` (focus/error 강화)

### Import 위치
글로벌 토큰/유틸 CSS 두 파일은 layout.tsx에 한 번만:
```tsx
import '@/lib/builder/components/_shared/widget-tokens.css';
import '@/lib/builder/components/_shared/hover-states.css';
```

## 2. 공통 토큰 (widget-tokens.css 전체)

```css
/* Builder Public Widget — Design Tokens. Wix-grade visual parity. */

:root,
[data-theme='light'] {
  --widget-radius-xs: 4px;
  --widget-radius-sm: 8px;
  --widget-radius-md: 12px;
  --widget-radius-lg: 16px;
  --widget-radius-xl: 22px;
  --widget-radius-pill: 999px;

  --widget-space-1: 4px;
  --widget-space-2: 8px;
  --widget-space-3: 12px;
  --widget-space-4: 16px;
  --widget-space-5: 20px;
  --widget-space-6: 24px;
  --widget-space-7: 32px;
  --widget-space-8: 40px;
  --widget-space-9: 56px;

  --widget-shadow-rest: 0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.06);
  --widget-shadow-hover: 0 6px 16px rgba(15, 23, 42, 0.08), 0 18px 38px rgba(15, 23, 42, 0.12);
  --widget-shadow-focus: 0 0 0 2px var(--widget-focus-ring-bg, #fff), 0 0 0 4px var(--widget-focus-ring);
  --widget-shadow-cta: 0 8px 18px rgba(45, 92, 72, 0.18), 0 22px 44px rgba(15, 23, 42, 0.18);
  --widget-shadow-card-rest: 0 14px 34px rgba(15, 23, 42, 0.08);
  --widget-shadow-card-hover: 0 22px 48px rgba(15, 23, 42, 0.14);
  --widget-shadow-inset-input: inset 0 1px 2px rgba(15, 23, 42, 0.04);

  --widget-transition-fast: 120ms cubic-bezier(0.2, 0, 0, 1);
  --widget-transition-medium: 200ms cubic-bezier(0.2, 0, 0, 1);
  --widget-transition-slow: 320ms cubic-bezier(0.2, 0, 0, 1);
  --widget-easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  --widget-focus-ring: var(--builder-color-primary, #2d5c48);
  --widget-focus-ring-bg: #ffffff;
  --widget-focus-ring-width: 2px;
  --widget-focus-ring-offset: 2px;

  --widget-bg: var(--builder-color-background, #ffffff);
  --widget-bg-elevated: #ffffff;
  --widget-bg-muted: #f8fafc;
  --widget-bg-tinted: rgba(45, 92, 72, 0.04);
  --widget-fg: var(--builder-color-text, #0f172a);
  --widget-fg-muted: #475569;
  --widget-fg-soft: #64748b;
  --widget-fg-subtle: #94a3b8;
  --widget-border: rgba(148, 163, 184, 0.22);
  --widget-border-strong: rgba(148, 163, 184, 0.42);
  --widget-divider: #e2e8f0;

  --widget-success-bg: #ecfdf5;
  --widget-success-fg: #166534;
  --widget-success-border: #bbf7d0;
  --widget-error-bg: #fef2f2;
  --widget-error-fg: #b91c1c;
  --widget-error-border: rgba(220, 38, 38, 0.32);
  --widget-warn-bg: #fffbeb;
  --widget-warn-fg: #92400e;
  --widget-warn-border: #fde68a;
  --widget-info-bg: #eff6ff;
  --widget-info-fg: #1e40af;
  --widget-info-border: #bfdbfe;

  --widget-accent: var(--builder-color-primary, #2d5c48);
  --widget-accent-hover: color-mix(in srgb, var(--widget-accent) 88%, #000 12%);
  --widget-accent-soft: color-mix(in srgb, var(--widget-accent) 12%, #fff 88%);
  --widget-accent-fg: #ffffff;

  --widget-media-bg: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%);

  --widget-text-xs: 0.72rem;
  --widget-text-sm: 0.82rem;
  --widget-text-md: 0.94rem;
  --widget-text-lg: 1.08rem;
  --widget-text-xl: 1.32rem;
  --widget-text-2xl: 1.62rem;
  --widget-text-3xl: 2.1rem;

  --widget-hero-min-height: 60vh;
}

[data-theme='dark'] {
  --widget-shadow-rest: 0 1px 2px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.5);
  --widget-shadow-hover: 0 6px 16px rgba(0, 0, 0, 0.5), 0 18px 38px rgba(0, 0, 0, 0.6);
  --widget-shadow-focus: 0 0 0 2px #0b1220, 0 0 0 4px var(--widget-focus-ring);
  --widget-shadow-cta: 0 8px 18px rgba(0, 0, 0, 0.6), 0 22px 44px rgba(0, 0, 0, 0.7);
  --widget-shadow-card-rest: 0 14px 34px rgba(0, 0, 0, 0.45);
  --widget-shadow-card-hover: 0 22px 48px rgba(0, 0, 0, 0.6);
  --widget-shadow-inset-input: inset 0 1px 2px rgba(0, 0, 0, 0.4);

  --widget-focus-ring-bg: #0b1220;
  --widget-bg: #0f172a;
  --widget-bg-elevated: #111c33;
  --widget-bg-muted: #0b1424;
  --widget-bg-tinted: rgba(94, 163, 132, 0.08);
  --widget-fg: #e2e8f0;
  --widget-fg-muted: #cbd5e1;
  --widget-fg-soft: #94a3b8;
  --widget-fg-subtle: #64748b;
  --widget-border: rgba(148, 163, 184, 0.18);
  --widget-border-strong: rgba(148, 163, 184, 0.32);
  --widget-divider: rgba(148, 163, 184, 0.18);

  --widget-success-bg: rgba(16, 185, 129, 0.12);
  --widget-success-fg: #6ee7b7;
  --widget-success-border: rgba(16, 185, 129, 0.32);
  --widget-error-bg: rgba(220, 38, 38, 0.12);
  --widget-error-fg: #fca5a5;
  --widget-error-border: rgba(220, 38, 38, 0.36);
  --widget-warn-bg: rgba(245, 158, 11, 0.12);
  --widget-warn-fg: #fcd34d;
  --widget-warn-border: rgba(245, 158, 11, 0.32);
  --widget-info-bg: rgba(59, 130, 246, 0.12);
  --widget-info-fg: #93c5fd;
  --widget-info-border: rgba(59, 130, 246, 0.32);

  --widget-accent: var(--builder-color-primary, #5ea384);
  --widget-accent-hover: color-mix(in srgb, var(--widget-accent) 80%, #fff 20%);
  --widget-accent-soft: color-mix(in srgb, var(--widget-accent) 18%, transparent);
  --widget-accent-fg: #0b1220;
  --widget-media-bg: linear-gradient(135deg, #1f2a44 0%, #0f172a 100%);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    /* dark 토큰을 :root에 mirror — data-theme 미지정 시 OS 따름 */
  }
}
```

## 3. 공통 hover 클래스 (hover-states.css)

```css
.widget-focusable:focus { outline: none; }
.widget-focusable:focus-visible {
  outline: var(--widget-focus-ring-width) solid var(--widget-focus-ring);
  outline-offset: var(--widget-focus-ring-offset);
  border-radius: inherit;
}

.widget-hover-lift {
  transition:
    transform var(--widget-transition-medium),
    box-shadow var(--widget-transition-medium),
    border-color var(--widget-transition-medium);
  will-change: transform;
}
.widget-hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--widget-shadow-card-hover);
}
.widget-hover-lift:active { transform: translateY(0) scale(0.99); }

.widget-hover-glow {
  position: relative;
  transition: box-shadow var(--widget-transition-medium), transform var(--widget-transition-medium);
}
.widget-hover-glow:hover {
  box-shadow: var(--widget-shadow-cta);
  transform: translateY(-1px);
}

.widget-arrow-slide [data-widget-arrow] {
  display: inline-block;
  transition: transform var(--widget-transition-medium);
}
.widget-arrow-slide:hover [data-widget-arrow] { transform: translateX(4px); }

.widget-img-zoom img {
  transition: transform var(--widget-transition-slow);
  will-change: transform;
}
.widget-img-zoom:hover img,
.widget-img-zoom:focus-visible img { transform: scale(1.04); }

.widget-underline-reveal { position: relative; }
.widget-underline-reveal::after {
  content: '';
  position: absolute;
  inset: auto 0 -2px 0;
  height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--widget-transition-medium);
}
.widget-underline-reveal:hover::after,
.widget-underline-reveal:focus-visible::after { transform: scaleX(1); }

.widget-press { transition: transform var(--widget-transition-fast); }
.widget-press:active { transform: scale(0.98); }

.widget-disabled,
[aria-disabled='true'].widget-disabled,
.widget-press:disabled,
.widget-press[aria-disabled='true'] {
  opacity: 0.5;
  cursor: not-allowed !important;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .widget-hover-lift, .widget-hover-glow, .widget-img-zoom img,
  .widget-arrow-slide [data-widget-arrow], .widget-underline-reveal::after, .widget-press {
    transition-duration: 1ms !important;
  }
  .widget-hover-lift:hover, .widget-hover-glow:hover,
  .widget-img-zoom:hover img, .widget-arrow-slide:hover [data-widget-arrow] {
    transform: none !important;
  }
}

.widget-sr-only {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 4. BlogPostCard 격상 (CSS 모듈 코드)

기존 클래스 보존, **append만**. 끝에 추가:

```css
/* ----- D-POOL-6: a11y / dark / motion polish ----- */

a.card:focus { outline: none; }
a.card:focus-visible {
  outline: var(--widget-focus-ring-width, 2px) solid var(--widget-focus-ring, #2d5c48);
  outline-offset: 3px;
}
a.card:active { transform: translateY(0) scale(0.995); }

.cardElevated { box-shadow: var(--widget-shadow-card-rest, 0 16px 34px rgba(15, 23, 42, 0.1)); }
.cardElevated:hover { box-shadow: var(--widget-shadow-card-hover, 0 22px 44px rgba(15, 23, 42, 0.14)); }

.avatar {
  background: linear-gradient(135deg, #e7efe9 0%, #d7e6db 100%);
  box-shadow: 0 0 0 1px rgba(45, 92, 72, 0.12);
}

[data-theme='dark'] .card { color: var(--widget-fg); }
[data-theme='dark'] .cardElevated {
  border-color: var(--widget-border);
  background: var(--widget-bg-elevated);
  box-shadow: var(--widget-shadow-card-rest);
}
[data-theme='dark'] .cardElevated:hover {
  border-color: rgba(94, 163, 132, 0.45);
  box-shadow: var(--widget-shadow-card-hover);
}
[data-theme='dark'] .cardFlat {
  border-color: var(--widget-border);
  background: var(--widget-bg-muted);
}
[data-theme='dark'] .cardFlat:hover {
  background: var(--widget-bg-elevated);
  border-color: rgba(94, 163, 132, 0.36);
}
[data-theme='dark'] .cardOutlined {
  background: transparent;
  border-color: rgba(94, 163, 132, 0.55);
}
[data-theme='dark'] .cardOutlined:hover {
  border-color: #6ec0a0;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
}
[data-theme='dark'] .title,
[data-theme='dark'] .authorCopy { color: var(--widget-fg); }
[data-theme='dark'] .excerpt,
[data-theme='dark'] .metaLine,
[data-theme='dark'] .authorCopy small { color: var(--widget-fg-soft); }
[data-theme='dark'] .categoryChip {
  background: rgba(94, 163, 132, 0.16);
  color: #6ec0a0;
  border-color: rgba(94, 163, 132, 0.36);
}
[data-theme='dark'] .featuredBadge {
  background: rgba(255, 255, 255, 0.92);
  color: #0f172a;
}
[data-theme='dark'] .avatar {
  background: linear-gradient(135deg, #1f3a2c 0%, #14241c 100%);
  color: #6ec0a0;
  box-shadow: 0 0 0 1px rgba(94, 163, 132, 0.36);
}
[data-theme='dark'] .readMore { color: #6ec0a0; }

@media (prefers-reduced-motion: reduce) {
  .card, .media img, .readMore::after { transition-duration: 1ms !important; }
  a.card:hover { transform: none !important; }
  a.card:hover .media img { transform: none !important; }
  a.card:hover .readMore::after { transform: none !important; }
}
```

## 5. BlogFeed 4 layout 격상

기존 `BlogFeed.module.css` 끝에 append:

```css
.layoutFeatured .cardHero { border-radius: var(--widget-radius-lg, 16px); }
.layoutFeatured .cardHero .cardLink { min-height: clamp(360px, 60vh, 560px); }
.feedSingle.layoutFeatured .cardHero .cardLink,
.feedOneColumn.layoutFeatured .cardHero .cardLink { min-height: clamp(280px, 56vh, 520px); }

.layoutFeatured .cardHero .body {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.98) 60%);
}

.layoutList .cardLink {
  grid-template-columns: minmax(240px, 0.4fr) minmax(0, 1fr);
  gap: 0;
}
.layoutList .body { padding: 22px 24px; justify-content: center; }

.layoutMasonry .feedSurface { column-gap: var(--blog-feed-gap, 32px); }
.layoutMasonry .card { margin-bottom: var(--blog-feed-gap, 32px); }

.layoutGrid .feedSurface { gap: clamp(20px, 3vw, 32px); }

.cardLink:focus { outline: none; }
.cardLink:focus-visible {
  outline: 2px solid var(--widget-focus-ring, #2d5c48);
  outline-offset: 4px;
  border-radius: var(--widget-radius-md, 14px);
}

[data-theme='dark'] .card {
  border-color: var(--widget-border);
  background: var(--widget-bg-elevated);
  box-shadow: var(--widget-shadow-card-rest);
  color: var(--widget-fg);
}
[data-theme='dark'] .card:hover {
  border-color: rgba(94, 163, 132, 0.42);
  box-shadow: var(--widget-shadow-card-hover);
}
[data-theme='dark'] .title { color: var(--widget-fg); }
[data-theme='dark'] .excerpt,
[data-theme='dark'] .metaLine { color: var(--widget-fg-soft); }
[data-theme='dark'] .categoryChip {
  background: rgba(94, 163, 132, 0.16);
  color: #6ec0a0;
  border-color: rgba(94, 163, 132, 0.36);
}
[data-theme='dark'] .layoutFeatured .cardHero .body {
  background: linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.98) 60%);
}

@container (max-width: 760px) {
  .layoutGrid .feedSurface,
  .layoutFeatured .feedSurface { gap: 20px; }
  .layoutMasonry .card { margin-bottom: 20px; }
}

@container (min-width: 760px) and (max-width: 1100px) {
  .layoutGrid .feedSurface,
  .layoutFeatured .feedSurface { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .layoutMasonry .feedSurface { column-count: 2; }
}

@media (prefers-reduced-motion: reduce) {
  .card, .media img, .readMore::after { transition-duration: 1ms !important; }
  .card:hover { transform: none !important; }
  .card:hover .media img { transform: none !important; }
  .card:hover .readMore::after { transform: none !important; }
}
```

## 6. Button 8 variants 비주얼

### 절대 규칙
- `component-variants.ts` 의 `resolveButtonVariantStyles` 등 **수정 금지** — admin과 공유.
- 변경은 `ButtonElement.tsx` 의 인라인 `<style>` 블록과 className만.

### Element.tsx 패치

1) `elementProps.className` 확장: `'builder-button-element widget-focusable widget-press'` (variant `cta-arrow`면 추가 `widget-arrow-slide`)
2) suffix: `<span aria-hidden data-widget-arrow>{suffix}</span>`
3) `<style>` 블록 교체:

```tsx
<style>{`
  .builder-button-element {
    -webkit-tap-highlight-color: transparent;
    position: relative;
    isolation: isolate;
  }
  .builder-button-element [data-widget-arrow] {
    display: inline-block;
    transition: transform var(--widget-transition-medium, 200ms cubic-bezier(0.2, 0, 0, 1));
  }
  .builder-button-element:hover {
    background: var(--builder-button-hover-background) !important;
    color: var(--builder-button-hover-color) !important;
    border-color: var(--builder-button-hover-border-color) !important;
    transform: var(--builder-button-hover-transform) !important;
    box-shadow: var(--builder-button-hover-box-shadow) !important;
  }
  .builder-button-element:hover [data-widget-arrow] {
    transform: translateX(4px);
  }
  .builder-button-element:active {
    transform: var(--builder-button-active-transform, scale(0.98)) !important;
  }
  .builder-button-element:focus { outline: none; }
  .builder-button-element:focus-visible {
    outline: var(--widget-focus-ring-width, 2px) solid var(--widget-focus-ring, #2d5c48) !important;
    outline-offset: var(--widget-focus-ring-offset, 2px) !important;
  }
  .builder-button-element:disabled,
  .builder-button-element[aria-disabled='true'] {
    cursor: not-allowed !important;
    opacity: var(--builder-button-disabled-opacity, 0.5) !important;
    transform: none !important;
    box-shadow: none !important;
  }
  @media (prefers-reduced-motion: reduce) {
    .builder-button-element,
    .builder-button-element [data-widget-arrow] { transition-duration: 1ms !important; }
    .builder-button-element:hover,
    .builder-button-element:active,
    .builder-button-element:hover [data-widget-arrow] { transform: none !important; }
  }
`}</style>
```

4) `elementProps['data-variant']` = `node.content.style` (셀렉터 hook)

### 8 variants 시각 명세 표

| Variant | rest | hover | active | focus | disabled |
|---|---|---|---|---|---|
| primary-solid | accent fill | bg darken 8%, lift -1px | scale 0.98 | 2px ring offset 2px | opacity 0.5 |
| primary-outline | accent border | bg accent-soft | scale 0.98 | 2px ring | opacity 0.5 |
| primary-ghost | accent fg | bg accent-soft 12% | scale 0.98 | 2px ring | opacity 0.5 |
| primary-link | underline reveal | underline + translateX | scale 0.98 | 2px ring | opacity 0.5 |
| secondary-solid | secondary fill | darken 8%, lift -1px | scale 0.98 | 2px ring | opacity 0.5 |
| secondary-outline | fg-soft border | border-strong, bg-tinted | scale 0.98 | 2px ring | opacity 0.5 |
| cta-shadow | large rest shadow | shadow-cta + lift -2px | scale 0.985 | 2px ring | shadow off |
| cta-arrow | accent + → | arrow translateX 4px + lift -1px | scale 0.985 | 2px ring | arrow stop |

resolver가 이미 충족.

## 7. BookingFlowSteps 격상

### 핵심 규칙
- **`BookingsAdmin.module.css` 절대 수정 금지** (admin 공용)
- `BookingFlowSteps.tsx` import → 새 모듈로 교체

### BookingFlowSteps.module.css

```css
.flow {
  background: var(--widget-bg, #ffffff);
  border: 1px solid var(--widget-border, #dce4ef);
  border-radius: var(--widget-radius-lg, 16px);
  display: grid;
  gap: 22px;
  padding: clamp(20px, 3vw, 28px);
  box-shadow: var(--widget-shadow-card-rest);
  color: var(--widget-fg);
}

.steps {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  padding-block: 8px 22px;
  counter-reset: stepIndex;
}
.steps::before {
  content: '';
  position: absolute;
  left: 12.5%; right: 12.5%;
  bottom: 28px;
  height: 2px;
  background: var(--widget-divider);
  border-radius: 999px;
}
.steps::after {
  content: '';
  position: absolute;
  left: 12.5%;
  bottom: 28px;
  width: calc((75% / 3) * var(--booking-progress, 0));
  height: 2px;
  background: var(--widget-accent);
  border-radius: 999px;
  transition: width var(--widget-transition-slow);
}

.step {
  position: relative;
  display: grid;
  grid-template-rows: auto auto;
  gap: 8px;
  align-items: end;
  justify-items: center;
  font-size: 12px;
  font-weight: 800;
  color: var(--widget-fg-soft);
  text-align: center;
  padding-bottom: 16px;
}
.step::before {
  content: counter(stepIndex);
  counter-increment: stepIndex;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: var(--widget-bg-elevated);
  border: 2px solid var(--widget-divider);
  color: var(--widget-fg-soft);
  font-size: 13px;
  font-weight: 900;
  transition:
    border-color var(--widget-transition-medium),
    background var(--widget-transition-medium),
    color var(--widget-transition-medium),
    transform var(--widget-transition-medium);
  position: relative;
  z-index: 1;
}
.step[data-active='true'] { color: var(--widget-accent); }
.step[data-active='true']::before {
  border-color: var(--widget-accent);
  background: var(--widget-accent);
  color: var(--widget-accent-fg);
  transform: scale(1.08);
  box-shadow: 0 0 0 4px var(--widget-accent-soft);
}
.step[data-complete='true']::before {
  content: '\2713';
  border-color: var(--widget-accent);
  background: var(--widget-accent);
  color: var(--widget-accent-fg);
}

.optionGrid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
.option {
  background: var(--widget-bg-elevated);
  border: 1px solid var(--widget-border);
  border-radius: var(--widget-radius-md);
  cursor: pointer;
  padding: 16px;
  text-align: left;
  display: grid;
  gap: 6px;
  transition:
    border-color var(--widget-transition-medium),
    transform var(--widget-transition-fast),
    box-shadow var(--widget-transition-medium),
    background var(--widget-transition-medium);
  color: var(--widget-fg);
}
.option strong { font-size: 15px; font-weight: 800; color: var(--widget-fg); }
.option:hover {
  border-color: color-mix(in srgb, var(--widget-accent) 36%, var(--widget-border) 64%);
  box-shadow: var(--widget-shadow-rest);
  transform: translateY(-1px);
}
.option:active { transform: scale(0.99); }
.option:focus { outline: none; }
.option:focus-visible {
  outline: 2px solid var(--widget-focus-ring);
  outline-offset: 2px;
}
.option[data-active='true'] {
  border-color: var(--widget-accent);
  background: var(--widget-accent-soft);
  box-shadow: 0 0 0 3px var(--widget-accent-soft);
}

.slots { display: flex; flex-wrap: wrap; gap: 8px; }
.slot {
  background: var(--widget-bg-muted);
  border: 1px solid var(--widget-border);
  border-radius: var(--widget-radius-pill);
  color: var(--widget-fg);
  cursor: pointer;
  font-weight: 800;
  min-height: 38px;
  padding: 0 14px;
  font-size: 14px;
  transition:
    background var(--widget-transition-medium),
    border-color var(--widget-transition-medium),
    color var(--widget-transition-medium),
    transform var(--widget-transition-fast);
}
.slot:hover {
  border-color: var(--widget-accent);
  background: var(--widget-accent-soft);
}
.slot:active { transform: scale(0.97); }
.slot:focus { outline: none; }
.slot:focus-visible {
  outline: 2px solid var(--widget-focus-ring);
  outline-offset: 2px;
}
.slot[data-active='true'] {
  background: var(--widget-accent);
  color: var(--widget-accent-fg);
  border-color: var(--widget-accent);
  box-shadow: 0 0 0 3px var(--widget-accent-soft);
}

.formGrid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.field { display: grid; gap: 6px; }
.fieldFull { grid-column: 1 / -1; }
.label {
  color: var(--widget-fg-muted);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.input, .textarea, .select {
  background: var(--widget-bg);
  border: 1px solid var(--widget-border);
  border-radius: var(--widget-radius-sm);
  color: var(--widget-fg);
  font: inherit;
  min-height: 42px;
  padding: 10px 12px;
  transition: border-color var(--widget-transition-medium), box-shadow var(--widget-transition-medium), background var(--widget-transition-medium);
}
.input::placeholder, .textarea::placeholder { color: var(--widget-fg-subtle); }
.input:focus, .textarea:focus, .select:focus {
  outline: none;
  border-color: var(--widget-accent);
  box-shadow: 0 0 0 3px var(--widget-accent-soft);
}
.textarea { min-height: 96px; resize: vertical; }

.actions { display: flex; gap: 12px; justify-content: flex-end; flex-wrap: wrap; }

.button {
  background: var(--widget-accent);
  border: 0;
  border-radius: var(--widget-radius-sm);
  color: var(--widget-accent-fg);
  cursor: pointer;
  font-weight: 800;
  min-height: 42px;
  padding: 0 18px;
  font-size: 14px;
  transition: background var(--widget-transition-medium), transform var(--widget-transition-fast), box-shadow var(--widget-transition-medium);
}
.button:hover {
  background: var(--widget-accent-hover);
  box-shadow: var(--widget-shadow-rest);
  transform: translateY(-1px);
}
.button:active { transform: scale(0.98); }
.button:focus { outline: none; }
.button:focus-visible {
  outline: 2px solid var(--widget-focus-ring);
  outline-offset: 2px;
}
.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.buttonSecondary {
  align-items: center;
  background: var(--widget-bg);
  border: 1px solid var(--widget-border);
  border-radius: var(--widget-radius-sm);
  color: var(--widget-fg);
  cursor: pointer;
  display: inline-flex;
  font-weight: 800;
  justify-content: center;
  min-height: 42px;
  padding: 0 18px;
  font-size: 14px;
  text-decoration: none;
  transition: background var(--widget-transition-medium), border-color var(--widget-transition-medium), transform var(--widget-transition-fast);
}
.buttonSecondary:hover {
  background: var(--widget-bg-muted);
  border-color: var(--widget-border-strong);
}

.muted { color: var(--widget-fg-soft); font-size: 13px; margin: 4px 0 0; }
.cardTitle { font-size: 18px; font-weight: 800; margin: 0 0 6px; color: var(--widget-fg); }
.panel {
  background: var(--widget-bg-elevated);
  border: 1px solid var(--widget-border);
  border-radius: var(--widget-radius-md);
  padding: 20px;
}

.notice {
  background: var(--widget-success-bg);
  border: 1px solid var(--widget-success-border);
  border-radius: var(--widget-radius-sm);
  color: var(--widget-success-fg);
  font-weight: 800;
  padding: 14px 16px;
  display: flex;
  gap: 10px;
  align-items: center;
}
.notice::before {
  content: '\2713';
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: var(--widget-success-fg);
  color: #fff;
  font-size: 13px;
  font-weight: 900;
}
.error {
  background: var(--widget-error-bg);
  border: 1px solid var(--widget-error-border);
  border-radius: var(--widget-radius-sm);
  color: var(--widget-error-fg);
  font-weight: 700;
  padding: 12px 14px;
}

@media (max-width: 640px) {
  .formGrid, .steps { grid-template-columns: 1fr; }
  .steps { gap: 14px; padding-bottom: 12px; }
  .steps::before, .steps::after { display: none; }
  .step {
    flex-direction: row;
    justify-items: start;
    gap: 12px;
    grid-template-rows: none;
    grid-template-columns: auto 1fr;
    text-align: left;
    padding-bottom: 0;
  }
  .actions { flex-direction: column-reverse; }
  .actions > * { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .step::before, .option, .slot, .button, .buttonSecondary,
  .input, .textarea, .select, .steps::after { transition-duration: 1ms !important; }
  .option:hover, .button:hover, .step[data-active='true']::before { transform: none !important; }
}
```

### BookingFlowSteps.tsx 패치

1) `import styles from './BookingsAdmin.module.css';` → `import styles from './BookingFlowSteps.module.css';`
2) step indicator JSX 강화:

```tsx
<div className={styles.steps} style={{ ['--booking-progress' as string]: String(step) }}>
  {['Service', 'Staff', 'Date & time', 'Info'].map((label, index) => (
    <div className={styles.step} data-active={step === index} data-complete={step > index} key={label}>
      {label}
    </div>
  ))}
</div>
```

번호는 CSS counter로 자동 생성.

## 8. ContactForm / form-input 격상

### ContactForm.module.css

```css
.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: var(--widget-bg);
  border-radius: var(--widget-radius-md);
  color: var(--widget-fg);
}

.field { position: relative; display: flex; flex-direction: column; }

.input, .textarea {
  width: 100%;
  padding: 22px 14px 10px;
  font-size: 15px;
  font-family: inherit;
  color: var(--widget-fg);
  background: var(--widget-bg-elevated);
  border: 1px solid var(--widget-border);
  border-radius: var(--widget-radius-sm);
  outline: none;
  box-sizing: border-box;
  box-shadow: var(--widget-shadow-inset-input);
  transition: border-color var(--widget-transition-medium), box-shadow var(--widget-transition-medium), background var(--widget-transition-medium);
}
.textarea { min-height: 120px; resize: vertical; }
.input::placeholder, .textarea::placeholder { color: transparent; }

.label {
  position: absolute;
  top: 14px;
  left: 14px;
  font-size: 14px;
  color: var(--widget-fg-soft);
  pointer-events: none;
  background: transparent;
  padding: 0 4px;
  transition: transform var(--widget-transition-medium), color var(--widget-transition-medium), font-size var(--widget-transition-medium), top var(--widget-transition-medium);
}

.input:focus, .textarea:focus {
  border-color: var(--widget-accent);
  box-shadow: var(--widget-shadow-inset-input), 0 0 0 3px var(--widget-accent-soft);
}

.input:focus + .label,
.textarea:focus + .label,
.input:not(:placeholder-shown) + .label,
.textarea:not(:placeholder-shown) + .label {
  transform: translateY(-12px);
  font-size: 11px;
  font-weight: 800;
  color: var(--widget-accent);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.fieldError .input,
.fieldError .textarea {
  border-color: var(--widget-error-border);
  box-shadow: var(--widget-shadow-inset-input), 0 0 0 3px color-mix(in srgb, var(--widget-error-fg) 18%, transparent);
}
.fieldError .label { color: var(--widget-error-fg); }

.errorText {
  margin: 6px 4px 0;
  font-size: 12px;
  font-weight: 700;
  color: var(--widget-error-fg);
  display: flex;
  align-items: center;
  gap: 6px;
}
.errorText::before {
  content: '!';
  display: inline-grid;
  place-items: center;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: var(--widget-error-fg);
  color: #fff;
  font-size: 10px;
  font-weight: 900;
}

.submit {
  align-self: flex-start;
  padding: 12px 26px;
  font-size: 15px;
  font-weight: 800;
  color: var(--widget-accent-fg);
  background: var(--widget-accent);
  border: none;
  border-radius: var(--widget-radius-sm);
  cursor: pointer;
  transition: background var(--widget-transition-medium), transform var(--widget-transition-fast), box-shadow var(--widget-transition-medium);
}
.submit:hover {
  background: var(--widget-accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--widget-shadow-rest);
}
.submit:active { transform: scale(0.98); }
.submit:focus { outline: none; }
.submit:focus-visible {
  outline: 2px solid var(--widget-focus-ring);
  outline-offset: 2px;
}
.submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.success {
  width: 100%;
  display: grid;
  place-items: center;
  gap: 10px;
  padding: 36px 24px;
  background: var(--widget-success-bg);
  border: 1px solid var(--widget-success-border);
  border-radius: var(--widget-radius-md);
  color: var(--widget-success-fg);
  font-size: 15px;
  font-weight: 700;
  text-align: center;
}
.success::before {
  content: '\2713';
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: var(--widget-success-fg);
  color: #fff;
  font-size: 22px;
  font-weight: 900;
}

@media (prefers-reduced-motion: reduce) {
  .input, .textarea, .label, .submit { transition-duration: 1ms !important; }
}
```

### contactForm/index.tsx 마이그레이션

`placeholder=" "` 빈 공백 — `:not(:placeholder-shown)` 셀렉터 트리거용.

```tsx
import styles from './ContactForm.module.css';

if (status === 'success') return <div className={styles.success}>Thank you! Your message has been sent.</div>;

return (
  <form onSubmit={handleSubmit} className={styles.form}>
    {fields.map((field) => {
      const isTextarea = field === 'message';
      return (
        <div key={field} className={styles.field}>
          {isTextarea ? (
            <textarea id={`contact-${field}`} name={field} rows={4} placeholder=" " className={styles.textarea} />
          ) : (
            <input id={`contact-${field}`} name={field} type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'} placeholder=" " className={styles.input} />
          )}
          <label htmlFor={`contact-${field}`} className={styles.label}>{fieldLabels[field] || field}</label>
        </div>
      );
    })}
    {status === 'error' && <p className={styles.errorText}>Failed to send. Please try again.</p>}
    <button type="submit" disabled={status === 'submitting'} className={styles.submit}>
      {status === 'submitting' ? 'Sending...' : submitLabel}
    </button>
  </form>
);
```

### formInput/Element.tsx 패치

focus/error ring:

```ts
boxShadow: field.error
  ? '0 0 0 3px color-mix(in srgb, var(--widget-error-fg, #b91c1c) 18%, transparent)'
  : focused
    ? '0 0 0 3px var(--widget-accent-soft, rgba(45,92,72,0.18))'
    : 'var(--widget-shadow-inset-input, inset 0 1px 2px rgba(15,23,42,0.04))',
```

## 9. FAQAccordion 격상

### FaqList.module.css

```css
.list {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: var(--widget-bg);
  border-radius: var(--widget-radius-md);
  overflow: hidden;
  border: 1px solid var(--widget-border);
}

.item { border-bottom: 1px solid var(--widget-divider); }
.item:last-child { border-bottom: none; }
.item[data-open='true'] { background: var(--widget-bg-tinted); }

.trigger {
  width: 100%;
  padding: 18px 20px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  font-size: 15px;
  font-weight: 700;
  color: var(--widget-fg);
  text-align: left;
  font-family: inherit;
  transition: color var(--widget-transition-medium), background var(--widget-transition-medium);
}
.trigger:hover { color: var(--widget-accent); }
.trigger:focus { outline: none; }
.trigger:focus-visible {
  outline: 2px solid var(--widget-focus-ring);
  outline-offset: -2px;
}

.icon {
  position: relative;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: var(--widget-bg-elevated);
  border: 1.5px solid var(--widget-border-strong);
  transition: background var(--widget-transition-medium), border-color var(--widget-transition-medium), transform var(--widget-transition-medium);
}
.icon::before, .icon::after {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  background: currentColor;
  border-radius: 1px;
  transition: transform var(--widget-transition-medium);
}
.icon::before { width: 10px; height: 1.5px; top: 50%; transform: translateY(-50%); }
.icon::after { width: 1.5px; height: 10px; left: 50%; transform: translateX(-50%); }

.item[data-open='true'] .icon {
  background: var(--widget-accent);
  border-color: var(--widget-accent);
  color: var(--widget-accent-fg);
  transform: rotate(45deg);
}

.panel {
  overflow: hidden;
  max-height: 0;
  transition: max-height var(--widget-transition-slow), padding var(--widget-transition-medium);
  font-size: 14px;
  color: var(--widget-fg-muted);
  line-height: 1.65;
  padding: 0 20px 0;
}
.item[data-open='true'] .panel { max-height: 800px; padding: 0 20px 20px; }

@media (prefers-reduced-motion: reduce) {
  .icon, .icon::before, .icon::after, .panel, .trigger { transition-duration: 1ms !important; }
}
```

### faqList/index.tsx

```tsx
import styles from './FaqList.module.css';

return (
  <div className={styles.list}>
    {items.map((item, i) => {
      const isOpen = openIndex === i;
      return (
        <div key={i} className={styles.item} data-open={isOpen}>
          <button type="button" onClick={() => setOpenIndex(isOpen ? null : i)}
            className={styles.trigger} aria-expanded={isOpen} aria-controls={`faq-panel-${i}`}>
            <span>{item.question}</span>
            <span className={styles.icon} aria-hidden />
          </button>
          <div id={`faq-panel-${i}`} className={styles.panel} role="region">{item.answer}</div>
        </div>
      );
    })}
  </div>
);
```

`aria-expanded`, `aria-controls`, `role="region"` 추가. + ↔ ✕ 회전형 토글.

## 10. ColumnsGrid / columnList / columnCard 격상

### ColumnList.module.css

```css
.grid {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(16px, 2.4vw, 28px);
  align-content: start;
  overflow: auto;
}

.card {
  padding: 20px;
  border-radius: var(--widget-radius-md);
  border: 1px solid var(--widget-border);
  background: var(--widget-bg-elevated);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color var(--widget-transition-medium), transform var(--widget-transition-fast), box-shadow var(--widget-transition-medium);
  color: var(--widget-fg);
}
.card:hover {
  border-color: color-mix(in srgb, var(--widget-accent) 30%, var(--widget-border) 70%);
  transform: translateY(-2px);
  box-shadow: var(--widget-shadow-card-hover);
}

.date {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--widget-fg-subtle);
  text-transform: uppercase;
}
.title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--widget-fg);
  line-height: 1.35;
}
.summary {
  margin: 0;
  font-size: 13px;
  color: var(--widget-fg-soft);
  line-height: 1.55;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

@media (max-width: 960px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }

@media (prefers-reduced-motion: reduce) {
  .card { transition-duration: 1ms !important; }
  .card:hover { transform: none !important; }
}
```

### ColumnCard.module.css

```css
.card {
  width: 100%;
  height: 100%;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  transition: transform var(--widget-transition-fast), box-shadow var(--widget-transition-medium);
  color: var(--widget-fg);
}
.card:hover { transform: translateY(-2px); }

.date {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--widget-fg-subtle);
  text-transform: uppercase;
}
.title {
  margin: 0;
  font-size: 19px;
  font-weight: 800;
  color: var(--widget-fg);
  line-height: 1.32;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.summary {
  margin: 0;
  font-size: 14px;
  color: var(--widget-fg-soft);
  line-height: 1.55;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

@media (prefers-reduced-motion: reduce) {
  .card { transition-duration: 1ms !important; }
  .card:hover { transform: none !important; }
}
```

`columnCard/index.tsx`:
- `variantStyle`(background/border/shadow) 그대로 유지 — `resolveCardVariantStyle` 결과 inline style
- 그 외 padding/font/layout만 className으로 이전

## 11. 작은 위젯 토큰 통합

### Divider.module.css

```css
.host { width: 100%; height: 100%; display: flex; align-items: center; }
.hostVertical { justify-content: center; }

.line { width: 100%; border: none; margin: 0; }
.lineVertical {
  height: 100%;
  width: var(--divider-thickness, 2px);
  border: none;
  border-left: var(--divider-thickness, 2px) var(--divider-style, solid) var(--divider-color, var(--widget-divider, #cbd5e1));
}
.lineHorizontal {
  border-top: var(--divider-thickness, 2px) var(--divider-style, solid) var(--divider-color, var(--widget-divider, #cbd5e1));
}
```

### Spacer.module.css

```css
.spacer { width: 100%; height: var(--spacer-size, 32px); }
.editPlaceholder {
  width: 100%;
  height: 100%;
  min-height: var(--spacer-size, 32px);
  outline: 1px dashed var(--widget-border-strong, #cbd5e1);
  display: grid;
  place-items: center;
  color: var(--widget-fg-subtle, #94a3b8);
  font-size: 11px;
  font-family: system-ui, sans-serif;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: color-mix(in srgb, var(--widget-bg-muted, #f8fafc) 70%, transparent);
}
```

### Icon.module.css

```css
.host { width: 100%; height: 100%; display: grid; place-items: center; }
.glyph {
  display: inline-block;
  font-size: var(--icon-size, 32px);
  color: var(--icon-color, var(--widget-fg, #0f172a));
  line-height: 1;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', system-ui, sans-serif;
  transition: transform var(--widget-transition-medium);
}
.host:hover .glyph { transform: scale(1.08); }

@media (prefers-reduced-motion: reduce) {
  .glyph { transition-duration: 1ms !important; }
  .host:hover .glyph { transform: none !important; }
}
```

### VideoEmbed.module.css

```css
.host {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: var(--widget-radius-md);
  overflow: hidden;
  background: var(--widget-media-bg);
  box-shadow: var(--widget-shadow-card-rest);
  transition: box-shadow var(--widget-transition-medium);
}
.host:hover { box-shadow: var(--widget-shadow-card-hover); }

.iframe, .video { width: 100%; height: 100%; display: block; border: 0; }
.poster { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

.playOverlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.42) 100%);
  cursor: pointer;
  transition: background var(--widget-transition-medium);
}
.playOverlay:hover {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.55) 100%);
}

.playButton {
  width: 72px;
  height: 72px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  border: none;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: var(--widget-shadow-cta);
  transition: transform var(--widget-transition-medium), background var(--widget-transition-medium);
}
.playButton::before {
  content: '';
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 14px 0 14px 22px;
  border-color: transparent transparent transparent var(--widget-fg, #0f172a);
  margin-left: 4px;
}
.playButton:hover { transform: scale(1.08); background: #fff; }
.playButton:focus { outline: none; }
.playButton:focus-visible {
  outline: 3px solid var(--widget-focus-ring);
  outline-offset: 4px;
}

.empty {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--widget-fg-subtle);
  font-size: 13px;
  font-weight: 700;
}

@media (prefers-reduced-motion: reduce) {
  .host, .playButton, .playOverlay { transition-duration: 1ms !important; }
  .playButton:hover { transform: none !important; }
}
```

## 12. motion-reduce / focus-ring / dark mode 표준

### 표준
- 모든 인터랙티브: `:focus`로 outline 제거, `:focus-visible`로 부활. width/offset 토큰
- 모든 transition: `var(--widget-transition-*)` 사용. 인라인 transition은 fallback
- 모든 hover transform: `@media (prefers-reduced-motion: reduce)` 무력화
- dark mode: `[data-theme='dark']` selector + `prefers-color-scheme: dark` mirror
- `[data-theme='light']` 명시 시 OS 다크여도 라이트 유지

### 페이지 차원
공개 페이지가 `<html data-theme="dark">` 또는 `<body data-theme="dark">` 세팅 가정.

## 13. 검증

### 자동
1. `pnpm lint` (또는 `pnpm tsc --noEmit`) 0 error
2. admin 화면 스크린샷 비교: 변경 없음
3. `BookingsAdmin.module.css` `git diff` 0줄

### 시각 회귀 매트릭스

| 위젯 | light desktop | light mobile 375 | dark desktop | reduced-motion |
|---|---|---|---|---|
| BlogPostCard (4 cardStyle × 2 image) | ✓ | ✓ | ✓ | ✓ |
| BlogFeed grid (3/2/1) | ✓ | ✓ | ✓ | ✓ |
| BlogFeed list | ✓ | ✓ stack | ✓ | ✓ |
| BlogFeed masonry (3/2/1) | ✓ | ✓ | ✓ | ✓ |
| BlogFeed featured-hero | ✓ 60vh | ✓ stack | ✓ | ✓ |
| Button (8 × 4 state) | ✓ | ✓ | ✓ | ✓ no transform |
| BookingFlowSteps (4 step) | ✓ | ✓ vertical | ✓ | ✓ |
| ContactForm (4 + error + success) | ✓ floating | ✓ | ✓ | ✓ |
| FaqList (closed/open) | ✓ + rotate | ✓ | ✓ | ✓ |
| ColumnList (1/2/3) | ✓ | ✓ | ✓ | ✓ |
| ColumnCard (4 variant) | ✓ | ✓ | ✓ | ✓ |
| Divider (h/v × 3 style) | ✓ | ✓ | ✓ | n/a |
| Spacer | ✓ edit only | ✓ | ✓ | n/a |
| Icon | ✓ | ✓ | ✓ | ✓ |
| VideoEmbed | ✓ | ✓ | ✓ | ✓ |

### 키보드 접근
- Tab으로 모든 인터랙티브 도달, focus-visible ring 명확
- FAQ trigger Enter/Space 토글, `aria-expanded` 변경
- BookingFlowSteps 옵션/슬롯 Tab 가능
- ContactForm 라벨 floating, 에러 시 `aria-invalid` SR 발화

## 14. 금지 범위

### 절대 수정 금지
- `src/components/builder/canvas/*` (admin canvas)
- `src/components/builder/bookings/BookingsAdmin.module.css` (admin shared)
- `src/components/builder/bookings/BookingsAdmin*.tsx`, `BookingCalendarAdmin.tsx`, `BookingServicesAdmin.tsx`, `BookingStaffAdmin.tsx`, `BookingAvailabilityAdmin.tsx`
- `src/lib/builder/site/component-variants.ts` (button/card/input variant resolver)
- `src/lib/builder/site/theme.ts`
- 빌더 admin Inspector 컴포넌트 (`*/Inspector.tsx`)
- public-page.tsx 라우팅/구조 (style 추가는 OK)

### PR 체크리스트
- [ ] `BookingsAdmin.module.css` 미변경
- [ ] `component-variants.ts`/`theme.ts` 미변경
- [ ] admin canvas 파일 미변경
- [ ] 신규 CSS 모듈 11개 생성
- [ ] `widget-tokens.css`, `hover-states.css` 신규 + 글로벌 import
- [ ] BlogPostCard / BlogFeed 기존 줄 100% 보존, append만
- [ ] ButtonElement.tsx 패치만
- [ ] 모바일 375px / dark / reduced-motion 시각 검증 통과
- [ ] `pnpm tsc --noEmit` 0 error

끝.
