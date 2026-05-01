# CODEX 발주 프롬프트 — B7 디자인 시스템 3단계

> **발행일**: 2026-04-29
> **선행**: B3 (`2704841`) 인스펙터 색/폰트/Theme text presets, B6 (`612515a`) Hover/Background/Site theme presets 5종
> **분담**: Codex 담당. Claude는 별 트랙으로 Phase 3 위젯 팩 + Lightbox/Modal builder 진행 중. **충돌 회피**: B7은 design tokens / variant library / brand kit / dark mode. Claude는 새 node kind + 새 entity 추가. 파일 분리됨.

---

## 1. 목적

호정 사이트 빌더의 디자인 시스템을 Wix 수준의 **컴포넌트 variant library + Brand kit + Dark mode**까지 확장. 사용자가 "버튼 스타일 8종 중 골라 클릭", "내 브랜드 색/폰트/로고를 한 번에 묶어 적용", "다크모드 토글" 가능하도록.

## 2. 작업 범위

### 2.1 Component design variants (가장 큰 시각 변화)

**Button 8종 visual variants**:
- Primary solid, Primary outline, Primary ghost, Primary link
- Secondary solid, Secondary outline
- CTA shadow (큰 강조), CTA arrow (→ 표시)
- 각각 hover/active/disabled 상태 자동 정의 (theme color/radius/shadow 활용)

**Card 4종 variants**:
- Flat (그림자 없음, border만), Elevated (subtle shadow), Floating (large shadow), Glass (backdrop-blur)

**Form input 3종 variants**:
- Default (border), Underline (밑줄만), Filled (background)

**Inspector 통합**:
- Button content 탭에 "Variant" dropdown (현재 5종 → 8종 확장)
- Card composite는 별도 작업 (Phase 3 widget pack — Claude 영역 — 무시)
- Form input은 Phase 4 (forms 위젯) — 무시. 단 form/input 컴포넌트 등록되면 자동 적용되도록 token 정의만.

**파일**:
- 수정: `src/lib/builder/components/button/Element.tsx` (8종 렌더), `src/lib/builder/components/button/Inspector.tsx` (variant dropdown 확장)
- 수정: `src/lib/builder/canvas/types.ts` (button content `style` enum 확장)
- 신규: `src/lib/builder/site/component-variants.ts` (variant token 정의)

### 2.2 Brand kit panel

**의도 동작**:
- 사이트 단위 "Brand kit" — 로고 (light/dark 2종), 브랜드 5색, 브랜드 2폰트 (title/body)
- SiteSettingsModal에 "Brand kit" 탭 신규
- Apply 시 site theme + theme text presets에 일괄 반영
- Export: 현재 brand kit을 JSON 다운로드 (`hojeong-brand-kit.json`)
- Import: JSON 업로드해서 브랜드 통째로 적용

**스키마**:
```typescript
// theme.ts
export interface BrandKit {
  logoLight?: string;  // image URL
  logoDark?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: { title: string; body: string };
  radiusScale: number;
  metadata?: { exportedAt: string; siteName?: string };
}
```

**파일**:
- 수정: `src/components/builder/canvas/SiteSettingsModal.tsx` (Brand kit 탭)
- 신규: `src/components/builder/editor/BrandKitPanel.tsx`
- 수정: `src/lib/builder/site/theme.ts` (brand kit ↔ theme 변환)
- 신규: `src/app/api/builder/site/brand-kit/route.ts` (POST export/import)

### 2.3 Dark mode 시스템

**의도 동작**:
- BuilderTheme에 `darkColors` 추가 (5색 다크 버전)
- 사이트 published 페이지에 `<html data-theme="light|dark">` 적용
- Published page에 우상단 floating "🌙 Dark / ☀️ Light" 토글 버튼 (옵션)
- 사용자 OS preference 자동 감지 (`prefers-color-scheme: dark`)
- Editor에서도 "Preview dark" 토글로 시안 확인 가능

**스키마**:
```typescript
// theme.ts
export interface BuilderTheme {
  colors: { /* light */ };
  darkColors?: { /* dark */ };  // 신규
  fonts: { title: string; body: string };
  // ...
}
```

**렌더 변경**:
- `resolveThemeColor(value, theme, mode = 'light')` 시그니처 확장
- public-page.tsx에 dark mode CSS 변수 주입 + 토글 컴포넌트 마운트
- 다크 토글 켜진 노드 inspector 미리보기 (선택)

**파일**:
- 수정: `src/lib/builder/site/theme.ts` (darkColors + resolve mode)
- 수정: `src/lib/builder/site/public-page.tsx` (CSS vars + 토글)
- 신규: `src/components/builder/published/DarkModeToggle.tsx`
- 수정: `src/components/builder/canvas/SiteSettingsModal.tsx` (darkColors 편집 + auto-detect 토글)

### 2.4 Component variant 활용 (선택)

**의도 동작**:
- SandboxCatalogPanel의 "Add" 패널에서 button variant를 visual preview로 선택 가능 (현재는 button 1개 → 변형은 inspector에서 변경)
- 8개 variant를 아이콘 형태로 grid 표시, 클릭 시 해당 variant로 새 button 생성

**파일**:
- 수정: `src/components/builder/canvas/SandboxCatalogPanel.tsx`

---

## 3. 디자인 톤

- Button variants: Wix Editor 참고. 패딩/radius/font-weight/letter-spacing이 variant마다 다름
- Brand kit panel: 좌측 logo upload, 우측 colors/fonts grid. Apply 버튼 강조
- Dark mode: 자동 페이드 transition 200ms. 다크 색은 light의 단순 invert 아니라 별도 정의

---

## 4. 검증 방법

```bash
cd /Users/son7/Projects/tseng-law
npm run lint
npm run build
npx tsc --noEmit --incremental false
```

**브라우저**:
1. `/ko/admin-builder` Basic Auth: `admin / local-review-2026!`
2. 버튼 노드 선택 → Content 탭 Variant dropdown → 8종 모두 시각 다르게 적용
3. SiteSettings → Brand kit 탭 → 로고 업로드, 색 변경 → Apply → 사이트 변경 + JSON export 다운로드 확인
4. SiteSettings → Brand kit → Import JSON → 적용 확인
5. SiteSettings → Theme → darkColors 5종 편집 → Preview dark 토글로 확인
6. 게시 페이지 → 우상단 dark 토글 → 색 전환 + transition smooth
7. 새로고침 → OS dark mode 시 자동 적용 (시스템 darkening 켜져 있을 때)

---

## 5. 작업 규칙 (`AGENTS.md` 준수)

- Phase 2+ 스키마 확장 금지 (Phase 2 결정 세션 전까지) — 이 배치는 디자인 토큰/시각 variant라 Phase 2 mobile-responsive와 무관
- 데이터 파일 직접 수정 금지 (siteContent/insights-archive 외)
- `tree.ts` / `seed-home v` 변경 금지
- composite/Render.tsx legacy 폴백 제거 금지
- legacy-*.tsx 본문 수정 금지
- Claude 영역 안 건드림: `CanvasContainer.tsx`, `SelectionToolbar.tsx`, `MoveToPageModal.tsx`, store.ts 의 메뉴/group/distribute/match 부분, 새 widget 폴더, `lightbox/`
- `git push --force`, `--no-verify` 금지

---

## 6. Definition of Done

- [ ] Button 8종 visual variants 동작 + Inspector dropdown
- [ ] Brand kit panel + Apply + Export JSON + Import JSON
- [ ] darkColors 스키마 + DarkModeToggle + auto OS detect
- [ ] (선택) Catalog panel에 variant grid
- [ ] lint/build/tsc 통과
- [ ] 브라우저 검증 7단계 통과
- [ ] SESSION.md commit hash 추가
- [ ] 인수인계 § 3.1F B7 신설

---

## 7. 인수인계

작업 완료 시:
1. commit (분할 권장):
   - `B7-1 button variants 8 visual styles + inspector`
   - `B7-2 brand kit panel + JSON export/import`
   - `B7-3 dark mode tokens + DarkModeToggle + auto-detect`
2. SESSION.md 갱신 + 한줄 요약 갱신
3. Claude 트랙(위젯 팩, lightbox)와 충돌 없는지 확인 (파일 분리됨)

---

이 프롬프트: `/Users/son7/Projects/tseng-law/CODEX-PROMPT-DESIGN-SYSTEM-B7.md`. Codex 던질 때 이 경로만 알려주면 됨.
