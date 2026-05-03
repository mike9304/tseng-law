# CODEX PROMPT — D-POOL-5: ColorPicker & FontPicker Advanced

> 이 마크다운은 Codex 단일 실행용 프롬프트다. 위에서 아래로 그대로 따라가며 파일을 생성/수정하라. 추측하지 말고, 명시된 파일 경로와 시그니처를 그대로 사용하라.

---

## 0. 목표

호정국제 빌더의 색상/폰트 선택 UX를 윅스(Wix) 본가 에디터 1:1 패리티 또는 그 이상으로 격상한다.

핵심 추가 기능:
1. **EyeDropper API** (Chrome/Edge 95+) 화면 색 추출 버튼 + 미지원 브라우저 graceful 처리.
2. **WCAG contrast checker** — 흰 배경/검정 배경 vs 현재 색의 contrast ratio + AA(4.5)/AAA(7) 배지.
3. **HEX / HSL / RGB 3-탭 색 입력** + saturation/lightness 슬라이더 (mixer).
4. **Recent palette 영속화** — localStorage 12색 LRU + 기존 5색 키 마이그레이션.
5. **Brand kit 5색 + Theme palette 6 토큰** 그리드 분리 표시 + token 바인딩 토글.
6. **Google Fonts 검색·미리보기 강화** — 검색어 하이라이트, 카테고리 탭, 카드형 리스트, 사용자 미리보기 텍스트, 로드 spinner/실패 fallback.
7. **Theme detached 상태 시각화** — 현재 값이 token이면 token name + "Detach" 토글 표시.

스키마(`BuilderColorValue`, `ThemeColorToken`, `THEME_COLOR_TOKENS`)는 절대 변경 금지. 토큰 값은 6개(primary/secondary/accent/background/text/muted)로 고정. Brand kit는 5색(primary/secondary/accent/background/text)으로 고정.

---

## 1. 핵심 컨텍스트 (반드시 읽고 시작)

### 1-1. 기존 파일 시그니처 (변경 금지 영역)

`src/lib/builder/site/theme.ts` 발췌:

```ts
export const THEME_COLOR_TOKENS = [
  'primary',
  'secondary',
  'accent',
  'background',
  'text',
  'muted',
] as const;

export type ThemeColorToken = (typeof THEME_COLOR_TOKENS)[number];

export interface ThemeColorReference {
  kind?: 'token';
  token: ThemeColorToken;
}

export type BuilderColorValue = string | ThemeColorReference;
```

→ 토큰은 **정확히 6개**다. "10~16색"이라고 들어도 `THEME_COLOR_TOKENS`만 사용하라.
→ Brand kit 색은 5개(`['primary','secondary','accent','background','text']`).

### 1-2. 파일 위치 컨벤션

기존 picker는 모두 `src/components/builder/editor/` 아래 있다. **신규 파일도 같은 디렉토리에 둔다.** task spec의 `canvas/ColorPickerAdvanced.tsx`는 무시하고 `editor/`로 통일.

### 1-3. 신규 디렉토리

`src/lib/builder/site/theme/` 하위 폴더는 존재하지 않는다. 생성하라:
- `src/lib/builder/site/theme/contrast.ts`
- `src/lib/builder/site/theme/recent-colors.ts`

(theme.ts는 그대로 두고, 새 디렉토리에 유틸만 추가. 즉 `theme.ts`와 `theme/` 하위 폴더가 공존.)

### 1-4. localStorage 키 마이그레이션

기존 ColorPicker는 `'builder-color-picker-recent-v1'`에 5색을 저장한다. 신규는 `'builder:recent-colors'`에 12색. **신규 모듈은 첫 read 시 옛 키에서 마이그레이션**하고 옛 키는 삭제한다.

### 1-5. onChange 시그니처 절대 보존

`onChange: (value: BuilderColorValue) => void`
- token swatch 클릭 → `onChange({ kind: 'token', token: 'primary' })`
- 사용자 hex 입력 → `onChange('#aabbcc')` (string)
- gradient 등 복합 값을 emit하지 마라. 평탄화 금지.

### 1-6. Importer 7 + 4 사이트

ColorPicker import 7군데:
1. `src/components/builder/canvas/SiteSettingsModal.tsx`
2. `src/components/builder/editor/BackgroundEditor.tsx`  ← gradient stop 루프 안에서 사용. 절대 깨뜨리지 마라.
3. `src/components/builder/editor/StyleTab.tsx`
4. `src/lib/builder/components/heading/Inspector.tsx`
5. `src/lib/builder/components/divider/index.tsx`
6. `src/lib/builder/components/text/Inspector.tsx`
7. `src/lib/builder/components/icon/index.tsx`

FontPicker import 4군데:
1. `src/components/builder/canvas/SiteSettingsModal.tsx`
2. `src/components/builder/editor/BrandKitPanel.tsx`
3. `src/lib/builder/components/heading/Inspector.tsx`
4. `src/lib/builder/components/text/Inspector.tsx`

**전략(중요)**: 신규 컴포넌트를 `ColorPickerAdvanced.tsx` / `FontPickerAdvanced.tsx`로 만들고, **기존 `ColorPicker.tsx` / `FontPicker.tsx`를 thin wrapper로 변경**해서 Advanced를 default export하라. 그러면 importer 11곳 모두 무수정 통과한다.

### 1-7. EyeDropper 안전 호출

```ts
if (!('EyeDropper' in window)) return; // disabled state 처리
try {
  const result = await new (window as any).EyeDropper().open();
  // result.sRGBHex
} catch (err) {
  // user pressed Esc → AbortError. 조용히 무시.
}
```

### 1-8. WCAG 공식 (정확히 이대로)

```
sRGB linearize: c <= 0.03928 ? c/12.92 : ((c+0.055)/1.055)**2.4
relative luminance L = 0.2126*R_lin + 0.7152*G_lin + 0.0722*B_lin
contrast = (L_brighter + 0.05) / (L_darker + 0.05)
AA pass: ratio >= 4.5
AAA pass: ratio >= 7.0
```

상수 `0.03928 / 12.92 / 0.055 / 1.055 / 2.4 / 0.2126 / 0.7152 / 0.0722 / 0.05` 임의 변경 금지.

---

## 2. 변경/신규 대상 파일 (총 7개)

### 신규
1. `src/lib/builder/site/theme/contrast.ts`
2. `src/lib/builder/site/theme/recent-colors.ts`
3. `src/components/builder/editor/ColorPickerAdvanced.tsx`
4. `src/components/builder/editor/FontPickerAdvanced.tsx`
5. `src/lib/builder/site/__tests__/contrast.test.ts` (vitest 또는 프로젝트 테스트 러너)

### 교체 (thin wrapper)
6. `src/components/builder/editor/ColorPicker.tsx` → Advanced re-export
7. `src/components/builder/editor/FontPicker.tsx` → Advanced re-export

### 무수정
- 11개 importer는 손대지 않는다.
- `theme.ts`, `theme-bindings.ts`, `BrandKitPanel.tsx` 시그니처 보존.

---

## 3. `theme/contrast.ts` (WCAG 유틸)

```ts
// src/lib/builder/site/theme/contrast.ts

/**
 * WCAG 2.1 contrast utilities.
 * Reference: https://www.w3.org/TR/WCAG21/#contrast-minimum
 */

export type WcagLevel = 'fail' | 'AA' | 'AAA';

export interface RgbColor { r: number; g: number; b: number; }
export interface HslColor { h: number; s: number; l: number; }
export interface ContrastReport { ratio: number; level: WcagLevel; largeTextLevel: WcagLevel; }

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function parseHex(input: string): RgbColor | null {
  if (!HEX_RE.test(input)) return null;
  let hex = input.slice(1);
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: RgbColor): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)); break;
      case gn: h = ((bn - rn) / d + 2); break;
      default: h = ((rn - gn) / d + 4); break;
    }
    h *= 60;
  }
  return { h, s, l };
}

export function hslToRgb({ h, s, l }: HslColor): RgbColor {
  const hue = ((h % 360) + 360) % 360 / 360;
  const sat = Math.max(0, Math.min(1, s));
  const lum = Math.max(0, Math.min(1, l));
  if (sat === 0) {
    const v = Math.round(lum * 255);
    return { r: v, g: v, b: v };
  }
  const q = lum < 0.5 ? lum * (1 + sat) : lum + sat - lum * sat;
  const p = 2 * lum - q;
  const f = (t: number) => {
    let v = t;
    if (v < 0) v += 1;
    if (v > 1) v -= 1;
    if (v < 1 / 6) return p + (q - p) * 6 * v;
    if (v < 1 / 2) return q;
    if (v < 2 / 3) return p + (q - p) * (2 / 3 - v) * 6;
    return p;
  };
  return {
    r: Math.round(f(hue + 1 / 3) * 255),
    g: Math.round(f(hue) * 255),
    b: Math.round(f(hue - 1 / 3) * 255),
  };
}

function channelToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(rgb: RgbColor): number {
  const r = channelToLinear(rgb.r);
  const g = channelToLinear(rgb.g);
  const b = channelToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(fg: string, bg: string): number {
  const fgRgb = parseHex(fg);
  const bgRgb = parseHex(bg);
  if (!fgRgb || !bgRgb) return 1;
  const l1 = relativeLuminance(fgRgb);
  const l2 = relativeLuminance(bgRgb);
  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (brighter + 0.05) / (darker + 0.05);
}

export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'fail';
}

export function wcagLevelLargeText(ratio: number): WcagLevel {
  if (ratio >= 4.5) return 'AAA';
  if (ratio >= 3) return 'AA';
  return 'fail';
}

export function getContrastReport(fg: string, bg: string): ContrastReport {
  const ratio = contrastRatio(fg, bg);
  return {
    ratio,
    level: wcagLevel(ratio),
    largeTextLevel: wcagLevelLargeText(ratio),
  };
}
```

---

## 4. `theme/recent-colors.ts` (localStorage LRU)

```ts
// src/lib/builder/site/theme/recent-colors.ts

const NEW_KEY = 'builder:recent-colors';
const LEGACY_KEY = 'builder-color-picker-recent-v1';
const MAX_RECENT = 12;
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

function isStorable(color: unknown): color is string {
  return typeof color === 'string' && HEX_RE.test(color);
}

function readArray(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStorable);
  } catch { return []; }
}

function migrateLegacy(): string[] {
  try {
    const legacy = readArray(LEGACY_KEY);
    if (legacy.length === 0) return [];
    window.localStorage.removeItem(LEGACY_KEY);
    return legacy;
  } catch { return []; }
}

function persist(colors: string[]): void {
  try { window.localStorage.setItem(NEW_KEY, JSON.stringify(colors)); }
  catch { /* private mode etc. */ }
}

export function getRecent(): string[] {
  if (typeof window === 'undefined') return [];
  const current = readArray(NEW_KEY);
  if (current.length > 0) return current.slice(0, MAX_RECENT);
  const migrated = migrateLegacy();
  if (migrated.length > 0) {
    const next = migrated.slice(0, MAX_RECENT);
    persist(next);
    return next;
  }
  return [];
}

export function addRecent(color: string): string[] {
  if (typeof window === 'undefined') return [];
  if (!isStorable(color)) return getRecent();
  const lower = color.toLowerCase();
  const current = getRecent();
  const next = [lower, ...current.filter((c) => c.toLowerCase() !== lower)].slice(0, MAX_RECENT);
  persist(next);
  return next;
}

export function clearRecent(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(NEW_KEY);
    window.localStorage.removeItem(LEGACY_KEY);
  } catch { /* ignore */ }
}

export const RECENT_COLORS_LIMIT = MAX_RECENT;
```

---

## 5. `__tests__/contrast.test.ts` (단위 테스트)

```ts
// src/lib/builder/site/__tests__/contrast.test.ts
import { describe, expect, it } from 'vitest'; // jest이면 import 제거
import {
  contrastRatio, wcagLevel, wcagLevelLargeText,
  parseHex, rgbToHsl, hslToRgb, relativeLuminance,
} from '@/lib/builder/site/theme/contrast';

describe('contrast', () => {
  it('white on black is 21:1', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 1);
  });
  it('white on white is 1:1', () => {
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
  });
  it('black on white passes AAA', () => {
    expect(wcagLevel(contrastRatio('#000000', '#ffffff'))).toBe('AAA');
  });
  it('mid grey on white fails normal AA', () => {
    expect(wcagLevel(contrastRatio('#888888', '#ffffff'))).toBe('fail');
  });
  it('large-text threshold is 3.0 (AA) and 4.5 (AAA)', () => {
    expect(wcagLevelLargeText(3.1)).toBe('AA');
    expect(wcagLevelLargeText(4.6)).toBe('AAA');
    expect(wcagLevelLargeText(2.9)).toBe('fail');
  });
  it('parseHex handles 3-digit and 6-digit', () => {
    expect(parseHex('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHex('#0F172A')).toEqual({ r: 15, g: 23, b: 42 });
    expect(parseHex('rgb(0,0,0)')).toBeNull();
  });
  it('rgb⇄hsl roundtrip preserves color', () => {
    const rgb = { r: 18, g: 59, b: 99 };
    const back = hslToRgb(rgbToHsl(rgb));
    expect(back.r).toBeCloseTo(rgb.r, 0);
    expect(back.g).toBeCloseTo(rgb.g, 0);
    expect(back.b).toBeCloseTo(rgb.b, 0);
  });
  it('relativeLuminance is between 0 and 1', () => {
    expect(relativeLuminance({ r: 128, g: 128, b: 128 })).toBeGreaterThan(0);
    expect(relativeLuminance({ r: 128, g: 128, b: 128 })).toBeLessThan(1);
  });
});
```

---

## 6. `ColorPickerAdvanced.tsx`

위치: `src/components/builder/editor/ColorPickerAdvanced.tsx`

전체 구현(약 380줄)은 본 프롬프트의 sub-agent 산출물에서 가져와 그대로 사용. 핵심 props/시그니처:

```tsx
interface ColorPickerAdvancedProps {
  value?: BuilderColorValue;
  onChange: (value: BuilderColorValue) => void;
  palette?: string[];
  paletteTokens?: ThemeSwatch[];
  brandColors?: string[];
  contrastBackground?: string;
  disabled?: boolean;
  enableEyeDropper?: boolean;
  enableContrast?: boolean;
}
```

구성 요소:
- 헤더: ThemeBindingBadge(linked/detached) + Contrast badge (AAA 초록 / AA 노랑 / fail 빨강)
- 탭 row: HEX / RGB / HSL
- HEX 탭: `<input type="color">` + 텍스트 input + EyeDropper 버튼 (지원 시 활성)
- RGB 탭: R/G/B 각각 slider + number input (0-255)
- HSL 탭: H(0-360) / S(0-100) / L(0-100) slider + number input
- Brand colors 그리드 (5색, 8열)
- Theme palette 그리드 (6 토큰, 8열, 토큰 클릭 시 `{kind:'token', token}` emit)
- Recent 그리드 (12색까지)
- 모든 swatch는 18×18, gap 6px, active 시 2px solid `#116dff` (Wix blue) outline + 2px shadow ring
- localStorage `builder:recent-colors` 영속화 + 옛 키 1회 마이그레이션

---

## 7. `FontPickerAdvanced.tsx`

위치: `src/components/builder/editor/FontPickerAdvanced.tsx`

전체 구현(약 320줄):

```tsx
interface FontPickerAdvancedProps {
  value: string;
  onChange: (fontFamily: string) => void;
  disabled?: boolean;
  siteWideWarning?: string;
}
```

구성:
- 240px wide trigger 버튼 (현재 폰트 미리보기 + ▾)
- 클릭 시 320px popover (top + 6px, z-index 60, blur 그림자 `0 16px 40px rgba(15,23,42,0.18)`)
- 검색 input (autoFocus, 검색어 노란 하이라이트 `<mark>`)
- 카테고리 탭: All / Site / Sans / Serif / Display / Mono (pill 버튼, active 시 `#eff6ff` 배경 + `#116dff` 보더)
- Preview text input (사용자 커스텀 가능, 기본 "Aa 안녕하세요 你好 Hello")
- 결과 카운트 + Loading spinner / 실패 fallback 메시지
- 카드 리스트 (최대 320px scroll, gap 4px):
  - 각 카드: 폰트명(검색어 하이라이트) + 배지(System/Generic/Heading/Body/Sans/Serif/Display/Mono/CJK)
  - 미리보기 라인 (해당 폰트로 렌더, ellipsis)
  - active 시 `#116dff` 보더 + `#eff6ff` 배경
- Google Fonts 링크 동적 주입 (`<link rel="stylesheet">`), 검색 결과 상위 30개만 fetch
- onload/onerror 핸들러로 spinner/fallback
- 외부 클릭 / Esc 시 popover 닫기
- BuilderThemeContext에서 site heading/body 폰트 자동 노출 ("Site" 카테고리)

---

## 8. 기존 picker → Advanced 교체 (thin wrapper)

### 8-1. `src/components/builder/editor/ColorPicker.tsx` 전체 교체

```tsx
'use client';

/**
 * D-POOL-5: ColorPicker is now a thin re-export of ColorPickerAdvanced.
 * Existing call sites keep the same import path and prop signature.
 */
export { default } from '@/components/builder/editor/ColorPickerAdvanced';
```

### 8-2. `src/components/builder/editor/FontPicker.tsx` 전체 교체

```tsx
'use client';

/**
 * D-POOL-5: FontPicker is now a thin re-export of FontPickerAdvanced.
 * Existing call sites keep the same import path and prop signature.
 */
export { default } from '@/components/builder/editor/FontPickerAdvanced';
```

이렇게 하면 11개 importer는 전부 무수정으로 신규 UI를 받는다.

### 8-3. Brand kit 색상 전달 (선택, 권장)

`StyleTab.tsx`의 ColorPicker 호출부에 `brandColors` prop을 추가:

```tsx
const brandColors = useMemo(() => {
  const colors = (theme as any).brandKit?.colors ?? theme.colors;
  if (!colors) return undefined;
  return ['primary', 'secondary', 'accent', 'background', 'text']
    .map((k) => colors[k])
    .filter((v): v is string => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v));
}, [theme]);

<ColorPicker ... brandColors={brandColors} />
```

(brandKit 위치는 `src/lib/builder/site/types.ts` 확인 후 적용. 없으면 `theme.colors`로 fallback.)

### 8-4. BackgroundEditor의 gradient stop 호환

신규 컴포넌트는 props 시그니처를 100% 보존하므로 변경 불필요. 옵션으로 호출부에 `enableContrast={false}`를 추가해 gradient stop의 contrast 노이즈를 끌 수 있음.

---

## 9. EyeDropper Polyfill / Graceful 처리 정리

- 지원: Chromium 95+ (Chrome, Edge, Opera, Brave). Firefox/Safari 미지원.
- 검출: `typeof window !== 'undefined' && 'EyeDropper' in window`.
- 호출: `await new (window as any).EyeDropper().open()` → `{ sRGBHex }`.
- 취소: ESC → `AbortError` → `try/catch` 침묵.
- 미지원 UI: 버튼 disabled, opacity 0.4, tooltip "EyeDropper is not supported in this browser".
- HTTPS 요구. `localhost`는 secure로 간주됨.

---

## 10. 검증 체크리스트

1. [ ] `npm run typecheck` 통과.
2. [ ] `npm test -- contrast` 7개 모두 통과.
3. [ ] Inspector → Style 탭 → backgroundColor swatch 클릭 → 신규 picker 팝오버.
4. [ ] Theme palette 토큰 swatch 클릭 → "Theme linked" badge.
5. [ ] 토큰 클릭 후 hex 입력 → "Detached" badge.
6. [ ] EyeDropper 클릭 (Chrome) → 화면 색 추출, recent에 추가.
7. [ ] EyeDropper 클릭 (Firefox/Safari) → disabled + tooltip.
8. [ ] Contrast: `#000` on `#fff` → AAA 초록, `#888` on `#fff` → fail 빨강.
9. [ ] 새로고침 후 Recent 12색 유지, 옛 키 마이그레이션 후 삭제 확인.
10. [ ] FontPicker 클릭 → 320px 팝오버 → 검색어 노란 하이라이트.
11. [ ] Sans/Serif/Display/Mono 카테고리 필터.
12. [ ] Preview text 변경 → 모든 카드 즉시 갱신.
13. [ ] 네트워크 차단 → "Google Fonts failed" 메시지.
14. [ ] Site fonts 섹션 → BuilderThemeContext의 heading/body 노출.
15. [ ] BackgroundEditor gradient stop 색 변경 정상.
16. [ ] BrandKitPanel siteWideWarning 노란 알림 노출.
17. [ ] 시크릿 모드 → 메모리만 동작, 에러 없음.
18. [ ] 11개 importer 전부 빌드 성공.

---

## 11. 금지 범위

- `theme.ts` 시그니처(`THEME_COLOR_TOKENS`, `BuilderColorValue`, `ThemeColorReference`).
- `theme-bindings.ts` / `BuilderThemeContext.tsx` 시그니처.
- `BackgroundEditor.tsx`의 gradient 데이터 구조.
- `BrandKitPanel.tsx`의 5색 키 순서.
- `SandboxPage` 쉘 / Canvas 오버레이 / Inspector 외곽 / Modal shell / Public 위젯.
- 11개 importer 파일의 import 경로.
- `theme.ts`에 새 필드 추가 (스키마 변경 금지).
- 테스트 러너, ESLint, tsconfig 설정.

---

## 12. 작업 순서

1. `theme/contrast.ts` → `contrast.test.ts` → 테스트 통과.
2. `theme/recent-colors.ts` → 콘솔에서 마이그레이션 확인.
3. `ColorPickerAdvanced.tsx` → Inspector 시각 확인.
4. `ColorPicker.tsx`를 thin wrapper로 교체 → 11개 importer 빌드.
5. `FontPickerAdvanced.tsx` → Inspector 시각 확인.
6. `FontPicker.tsx`를 thin wrapper로 교체 → 4개 importer 빌드.
7. (옵션) `StyleTab.tsx`에 `brandColors` prop 추가.
8. 검증 18개 점검.

---

## 13. 코드 톤 / 스타일

- React 파일 상단 `'use client';` (theme/* 유틸 제외).
- React 18 + 함수 컴포넌트 + hooks. Tailwind 미사용 (inline `React.CSSProperties`).
- 컬러: 본문 `#0f172a`, 보조 `#475569`, muted `#64748b`, border `#cbd5e1`, accent `#116dff` (Wix blue).
- 색상 swatch 18px, gap 6px, 8열.
- CJK 미리보기 기본 `Aa 안녕하세요 你好 Hello`.
- 외부 의존성 추가 금지.
- `as any`는 EyeDropper 타입 한 곳만 허용.

---

이 프롬프트를 받아서 위 12절 순서대로 정확히 실행하라. 끝.
