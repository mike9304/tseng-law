# CODEX 발주 — Wave 3 / E3 Brand Kit Assets + Dark Mode runtime

> **발행일**: 2026-05-01
> **선행**: B7 brand kit 기본 (`8c5fb81`), B7 dark mode 기본 (`8c5fb81`), Wave 1 E1 theme indicators
> **분담**: 엔지니어 5 (Design System) 단독.
> **충돌 회피**: `types.ts`는 **append-only** (A3 worker도 publish meta append 중). `public-page.tsx`는 head/dark mode inline script만 (A3는 revision pointer 분기). 머지 순서 주의 — A3 머지 후 E3.

---

## 1. 목적

B7에서 brand kit과 dark mode를 도입했지만:
- **brand kit이 raw URL 입력만 받음** — asset library 미연동
- **dark mode 토글이 OS preference만 따름** — visitor toggle 옵션 + early inline script 미존재 (FOUC 발생)

이 PR은:
1. brand kit의 logo (light/dark) / favicon / OG image를 asset library에서 선택
2. raw URL 호환 유지 (legacy)
3. dark mode 시스템에 `defaultMode` + `allowVisitorToggle` 옵션
4. CSS paint 전 inline script로 `data-theme` 적용 (FOUC 방지)
5. visitor toggle은 `localStorage.theme` 우선, 없으면 OS preference, 없으면 site default

체감 동작:
- 사이트 설정 → Brand kit → "Logo (light)" → asset selector 클릭 → 모달에서 asset 선택 → 즉시 반영
- favicon / OG image 동일
- 다크 모드 패널 → "Default mode: light/dark/auto" + "Allow visitor toggle: Y/N"
- visitor toggle Y면 published 페이지 우상단에 토글 버튼 보임. N이면 안 보임.
- 새로고침해도 토글 선택 유지 (localStorage)
- 첫 paint 전 data-theme 설정 → FOUC 0

---

## 2. 작업 범위

### 2.1 BrandKit asset 선택

`src/lib/builder/site/types.ts` (append-only):

```ts
export interface BrandKitAssets {
  logoLightAssetId?: string;     // asset id (raw URL과 공존)
  logoDarkAssetId?: string;
  faviconAssetId?: string;
  ogImageAssetId?: string;
}

// 기존 BrandKit interface에 assets 필드 추가 (또는 별도 sub-object)
export interface BrandKit {
  logoLight?: string;            // raw URL 호환 유지
  logoDark?: string;
  favicon?: string;               // 신규
  ogImage?: string;               // 신규
  assets?: BrandKitAssets;       // 신규 — asset id 우선, 없으면 raw URL fallback
  colors: { ... };               // 기존
  fonts: { ... };
  radiusScale: number;
  metadata?: { ... };
}
```

resolve helper:
```ts
export function resolveBrandLogo(brand: BrandKit, mode: 'light'|'dark', getAssetUrl: (id: string)=>string|null): string | null {
  const idKey = mode === 'dark' ? 'logoDarkAssetId' : 'logoLightAssetId';
  const id = brand.assets?.[idKey];
  if (id) {
    const url = getAssetUrl(id);
    if (url) return url;
  }
  return mode === 'dark' ? (brand.logoDark ?? null) : (brand.logoLight ?? null);
}
```

### 2.2 BrandKitPanel UI

`src/components/builder/editor/BrandKitPanel.tsx`:

기존 raw URL 입력 옆에 "Select from assets" 버튼 추가:
- 클릭 시 AssetLibraryModal 오픈 (mime 필터: image/*)
- 선택 후 `assets.logoLightAssetId = selected.id` 저장
- 패널에 미리보기는 resolved URL로 렌더 (asset > raw URL > placeholder)
- "Clear asset" 액션으로 asset id만 제거 (raw URL 유지)

favicon, ogImage 동일.

### 2.3 SiteSettings + API

`src/components/builder/canvas/SiteSettingsModal.tsx`:

Brand kit 탭에 `assets` 필드 wiring. JSON export/import에도 포함.

`src/app/api/builder/site/brand-kit/route.ts`:

POST 본문에 `assets` 필드 허용. validate (asset id 형식만 검증, 실재 여부는 client-side 검증 또는 후속).

### 2.4 Dark mode runtime

`src/lib/builder/site/types.ts` (append-only):

```ts
export interface DarkModeConfig {
  defaultMode?: 'light' | 'dark' | 'auto';   // 기본 'light'
  allowVisitorToggle?: boolean;                 // 기본 true
}

// BuilderSiteDocument 또는 BuilderTheme에 추가
darkMode?: DarkModeConfig;
```

### 2.5 Public page early inline script

`src/lib/builder/site/public-page.tsx`:

`<head>` 안 (CSS 전) 다음 스크립트 inline 삽입:

```html
<script>
(function(){
  try {
    var saved = localStorage.getItem('builder-theme');
    var defaultMode = '__DEFAULT_MODE__';      // 'light'|'dark'|'auto', server-rendered
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved
      || (defaultMode === 'auto' ? (prefersDark ? 'dark' : 'light') : defaultMode);
    document.documentElement.dataset.theme = theme;
  } catch (e) { document.documentElement.dataset.theme = '__DEFAULT_MODE_SAFE__'; }
})();
</script>
```

`__DEFAULT_MODE__`와 `__DEFAULT_MODE_SAFE__`는 server-side에서 site config의 darkMode.defaultMode 값으로 치환. CSP 안전을 위해 `dangerouslySetInnerHTML` 또는 Next.js `<Script strategy="beforeInteractive">` 사용. (CSP nonce 필요 시 별도.)

### 2.6 DarkModeToggle 컴포넌트 정리

`src/components/builder/published/DarkModeToggle.tsx`:

- 마운트 시 `document.documentElement.dataset.theme` 읽어서 state seed
- onClick → toggle (light↔dark) → set dataset + localStorage
- `darkMode.allowVisitorToggle === false`면 컴포넌트 자체 렌더 안 함 (early return)

`public-page.tsx`에서 site darkMode.allowVisitorToggle 확인 후 mount.

### 2.7 brand kit 노드 렌더 (header/footer logo)

`src/components/builder/published/SiteHeader.tsx` (있으면) 또는 published header가 logo 사용하는 곳:

- `resolveBrandLogo(brand, currentMode, getAssetUrl)` 사용
- light/dark에 따라 logo 자동 전환 (CSS `[data-theme="dark"] .logo-light { display: none }` 같은 것도 OK)

---

## 3. 파일

**수정**:
- `src/lib/builder/site/types.ts` — BrandKitAssets, DarkModeConfig append-only
- `src/lib/builder/site/theme.ts` — resolveBrandLogo helper 추가
- `src/components/builder/editor/BrandKitPanel.tsx` — asset selector 추가
- `src/components/builder/canvas/SiteSettingsModal.tsx` — assets 탭 + DarkMode 옵션 UI
- `src/app/api/builder/site/brand-kit/route.ts` — assets 필드 허용
- `src/app/api/builder/site/settings/route.ts` — darkMode 필드 허용 (있으면)
- `src/lib/builder/site/public-page.tsx` — head inline script + DarkModeToggle 마운트 분기 + brand logo render
- `src/components/builder/published/DarkModeToggle.tsx` — defaultMode + allowVisitorToggle 반영
- `src/components/builder/published/SiteHeader.tsx` (있으면) — resolveBrandLogo

**신규**: 없음

---

## 4. 비범위

- per-page dark mode override (사이트 단위만)
- system theme 외 custom theme (sepia, hi-contrast 등)
- brand kit asset에 video/font 추가 — 이 PR은 image 4종 (light/dark logo, favicon, og)
- dark mode 컬러 자동 생성 (B7에 createDarkColorsFromLight 있음, 그대로 사용)

---

## 5. 검증

### 자동
```bash
npm run typecheck
npm run lint
npm run build
BUILDER_SMOKE_TIMEOUT_MS=30000 npm run smoke:builder
```

### Manual

1. **Brand kit asset 선택**:
   - SiteSettings → Brand kit → Logo (light) → "Select from assets" → asset 선택
   - BrandKit panel에 즉시 미리보기
   - publish → public page header에 선택한 logo 노출
   - asset id 제거 → raw URL fallback 동작

2. **Brand kit JSON export/import**:
   - export하면 assets 필드 포함
   - 수정 후 import → 그대로 적용

3. **Dark mode default**:
   - SiteSettings → Dark mode → defaultMode: dark
   - public page (cleared localStorage) → 처음부터 dark 렌더 (FOUC 0)
   - HTML view source에서 `<html data-theme="dark">`가 첫 paint 전에 설정됨

4. **Visitor toggle**:
   - allowVisitorToggle: true → public page에 토글 버튼
   - 클릭하면 light↔dark 즉시 전환 + localStorage 저장
   - 새로고침해도 유지
   - allowVisitorToggle: false → 토글 버튼 안 보임, defaultMode 강제

5. **OS prefers-color-scheme auto**:
   - defaultMode: auto → OS dark mode면 dark, light면 light
   - localStorage 비어 있을 때만 OS 따름

### Inspection
```bash
rg -n 'resolveBrandLogo|BrandKitAssets|allowVisitorToggle' src/
```

---

## 6. 검증 통과 기준

- 자동 게이트 모두 ✅
- Manual 1~5 모두 통과
- FOUC 0 (다크 모드 첫 paint가 light로 깜빡이지 않음)
- visitor toggle 비활성 시 토글 컴포넌트 mount 안 됨
- brand kit asset id가 우선, 없으면 raw URL fallback
- JSON export/import에 assets 필드 round-trip

작업 끝나면 SESSION.md에 결과 한 줄.
