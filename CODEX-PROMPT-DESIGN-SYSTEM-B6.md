# CODEX 발주 프롬프트 — B6 디자인 시스템 2단계

> **발행일**: 2026-04-29
> **선행 배치**: B3 (`2704841`) — ColorPicker/FontPicker/Theme text presets 완료
> **분담**: 이 배치도 Codex 담당. Claude는 별 트랙으로 B2-5 (anchor links / selection floating toolbar / Phase 2 mobile schema) 진행.
> **충돌 방지**: B6 영역 — Style 탭, BackgroundEditor (신규), site theme 프리셋 모달, hover state. Claude 영역 — `CanvasContainer`, `store`, 우클릭 메뉴, anchor 시스템, 모바일 스키마. 파일 분리됨.

---

## 1. 목적

호정 사이트 빌더의 디자인 시스템을 Wix 수준 한 단계 더 끌어올린다. B3에서 인스펙터-팔레트-폰트-테마 텍스트 프리셋을 연결했으니, 이번엔 **상태별 디자인(hover) + 배경 표현력(그라데이션/이미지) + 사이트 단위 프리셋 테마**를 추가.

현재 상태 (반드시 먼저 검증):
- `src/components/builder/editor/StyleTab.tsx` — background/border/shadow/opacity/radius 편집 (B3 ColorPicker 통합 완료)
- `src/components/builder/editor/ColorPicker.tsx` — Theme palette + custom hex (B3 신규)
- `src/components/builder/editor/FontPicker.tsx` — System / Site / Google Fonts (B3 신규)
- `src/lib/builder/site/theme.ts` — themeTextPresets, resolveThemeColor, resolveThemeTextTypography (B3 확장)
- `src/lib/builder/canvas/types.ts` — `builderColorValueSchema`, `themeTextPresetKeySchema` 등 (B3 확장)
- `src/components/builder/canvas/SiteSettingsModal.tsx` — Typography 탭 (B3 추가)
- `src/components/builder/canvas/CanvasNode.tsx` — `theme` 적용 (B3 통합)
- `src/lib/builder/site/public-page.tsx` — `resolveThemeColor` 적용 (B3 통합)
- `src/components/builder/canvas/CropModal.tsx`, `FilterPanel.tsx` — image crop/filter (코드만 있고 inspector 미통합)

**문제**: 모든 노드 스타일이 단일 상태(default)만 가짐. Wix는 hover/active/focus별로 다른 스타일을 줄 수 있음. 배경은 solid color만 가능 — 그라데이션/이미지 불가. 사이트 단위로 "Modern / Classic / Bold" 같은 preset theme를 한 번에 적용하는 기능 없음.

---

## 2. 작업 범위

### 2.1 Hover state 디자인

**의도 동작**:
- Style 탭 하단에 "Hover state" 섹션 추가 (collapsible).
- Hover 토글 켜면: backgroundColor, borderColor, transform(scale/translateY), boxShadow 별도 편집 가능.
- 캔버스에서 마우스 오버 시 hover 스타일 적용 (preview).
- 게시 사이트에서도 동일 동작 (`:hover` CSS pseudo).
- 기본 transition duration 200ms (configurable).

**스키마**:
```typescript
// types.ts
export const hoverStyleSchema = z.object({
  backgroundColor: builderColorValueSchema.optional(),
  borderColor: builderColorValueSchema.optional(),
  scale: z.number().min(0.5).max(2).optional(),  // 1 = no scale
  translateY: z.number().min(-100).max(100).optional(),  // px
  shadowBlur: z.number().int().min(0).max(160).optional(),
  shadowSpread: z.number().int().min(-96).max(96).optional(),
  shadowColor: builderColorValueSchema.optional(),
  transitionMs: z.number().int().min(0).max(2000).default(200),
}).optional();

// baseCanvasNodeSchema 추가
hoverStyle: hoverStyleSchema,
```

**구현 포인트**:
- `CanvasNode.tsx`에서 `onMouseEnter/onMouseLeave`로 hover state 추적, 스타일 머지
- `public-page.tsx`에서는 `:hover` CSS class 또는 inline style로 처리 — CSS-in-JS / styled-jsx / 또는 dynamically-generated class
- 가장 깔끔한 방법: `<style jsx>` 또는 module-level CSS로 hover rule 생성
- Transform은 transform: scale(...) translateY(...) 조합

**파일**:
- 수정: `src/lib/builder/canvas/types.ts` (스키마)
- 수정: `src/components/builder/editor/StyleTab.tsx` (hover 섹션)
- 수정: `src/components/builder/canvas/CanvasNode.tsx` (hover preview in editor)
- 수정: `src/lib/builder/site/public-page.tsx` (hover render in published)

### 2.2 Background gradient + image

**의도 동작**:
- 현재 `background`는 solid color (또는 token). 다음 3종 추가:
  1. **Gradient** — linear/radial, 2~3개 색 stops, angle (linear)
  2. **Image** — asset library에서 이미지 선택, position/size/repeat 설정
  3. **Pattern (선택)** — preset 패턴 (dots, lines, grid) — 시간 남으면
- Style 탭의 background field를 **BackgroundEditor 컴포넌트**로 교체.
- BackgroundEditor 4탭: Solid / Gradient / Image / None
- 변경 시 즉시 캔버스 반영, autosave/undo/redo 그대로 탐.

**스키마**:
```typescript
// types.ts
export const backgroundValueSchema = z.union([
  // 기존: solid color
  builderColorValueSchema,
  // 그라데이션
  z.object({
    kind: z.literal('gradient'),
    type: z.enum(['linear', 'radial']),
    angle: z.number().min(0).max(360).default(180),
    stops: z.array(z.object({
      color: builderColorValueSchema,
      position: z.number().min(0).max(100),
    })).min(2).max(5),
  }),
  // 이미지
  z.object({
    kind: z.literal('image'),
    src: z.string().max(2000),
    size: z.enum(['cover', 'contain', 'auto']).default('cover'),
    position: z.enum(['center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']).default('center'),
    repeat: z.enum(['no-repeat', 'repeat', 'repeat-x', 'repeat-y']).default('no-repeat'),
    overlayColor: builderColorValueSchema.optional(),
    overlayOpacity: z.number().min(0).max(100).optional(),
  }),
]);
```

**구현 포인트**:
- `CanvasNode.tsx` / `public-page.tsx` background 렌더 로직을 분기:
  - solid → 기존 `background-color`
  - gradient → `background: linear-gradient(...) 또는 radial-gradient(...)`
  - image → `background-image: url(...); background-size: ...; background-position: ...`
- `resolveThemeColor`는 그라데이션 stops에도 적용
- BackgroundEditor에서 image 선택은 기존 AssetLibraryModal 재사용

**파일**:
- 신규: `src/components/builder/editor/BackgroundEditor.tsx`
- 수정: `src/lib/builder/canvas/types.ts` (스키마), `src/lib/builder/site/theme.ts` (resolveBackground 헬퍼)
- 수정: `src/components/builder/editor/StyleTab.tsx`
- 수정: `src/components/builder/canvas/CanvasNode.tsx`, `src/lib/builder/site/public-page.tsx`

### 2.3 Site preset themes (whole-site themes)

**의도 동작**:
- 사이트 단위로 "Modern / Classic / Bold / Minimal / Editorial" 등 5종 프리셋 테마 정의.
- 각 프리셋: 5색 팔레트 + Title/Body 폰트 + radius/shadow 강도.
- `SiteSettingsModal`에 "Theme presets" 탭 신규 추가.
- 클릭 한 번으로 사이트 전체 컬러/폰트/디자인 토큰 일괄 적용.
- "Apply preset" 버튼 누르면 confirm modal → 적용 → 토스트.

**스키마**:
```typescript
// theme.ts
export interface SiteThemePreset {
  key: 'modern' | 'classic' | 'bold' | 'minimal' | 'editorial';
  name: string;
  description: string;
  colors: BuilderTheme['colors'];
  fonts: { title: string; body: string };
  radiusScale: number;  // 0~24 (default 8)
  shadowIntensity: 'none' | 'subtle' | 'medium' | 'strong';
  textPresets: ThemeTextPresets;  // Title 1/2/3, Body, Quote
}

export const SITE_THEME_PRESETS: SiteThemePreset[] = [/* 5종 */];
```

**디자인 톤 (Wix 참고)**:
- **Modern**: Inter / Inter, 파스텔 + 블루 액센트, radius 12, shadow medium
- **Classic**: Playfair Display / Source Serif 4, 베이지 + 다크그린, radius 4, shadow subtle
- **Bold**: Bebas Neue / Inter, 흰/검 + 빨강 액센트, radius 0, shadow strong
- **Minimal**: Inter / Inter, 흰/회색 단색, radius 6, shadow none
- **Editorial**: Cormorant / Inter, 베이지 + 차콜, radius 2, shadow subtle

**구현 포인트**:
- 프리셋 데이터는 정적 (`SITE_THEME_PRESETS` 배열)
- 적용 시 `BuilderTheme` 객체 전체 갱신 → SiteSettingsModal의 기존 save 경로로 persist
- 자식 노드 색상/폰트는 token reference면 자동 따라감, raw hex/font면 그대로 유지 (의도된 user override)

**파일**:
- 수정: `src/lib/builder/site/theme.ts` (`SITE_THEME_PRESETS` 정의)
- 수정: `src/components/builder/canvas/SiteSettingsModal.tsx` (Theme presets 탭)
- 신규 (선택): `src/components/builder/editor/ThemePresetCard.tsx` (preview 카드)

### 2.4 Image inspector — Crop / Filter 통합 (선택)

**의도 동작**:
- Image 노드의 Content 탭에 "Crop" / "Filters" 버튼 추가
- 클릭 시 기존 `CropModal.tsx` / `FilterPanel.tsx` 모달 오픈
- 적용 시 image node의 content에 cropRect / filters 저장, render에 반영

**파일**:
- 수정: `src/lib/builder/components/image/Inspector.tsx`
- 수정: `src/components/builder/canvas/CanvasNode.tsx` 또는 `lib/builder/components/image/Element.tsx` (filter/crop CSS 적용)

---

## 3. 검증 방법

```bash
cd /Users/son7/Projects/tseng-law
npm run lint
npm run build
npx tsc --noEmit --incremental false
```

**브라우저 검증**:
1. `/ko/admin-builder` Basic Auth: `admin / local-review-2026!`
2. 텍스트 노드 선택 → Style 탭 → Hover state 토글 → background hover 색 변경 → 캔버스 마우스 오버 시 색 변경 확인
3. 컨테이너 선택 → Style 탭 → Background → Gradient 탭 → 2색 그라데이션 → 즉시 반영
4. Image 노드 선택 → Style 탭 → Background → Image 탭 → asset 선택 → cover 표시
5. SiteSettings → Theme presets 탭 → "Modern" 클릭 → 사이트 전체 색/폰트 일괄 변경 → 토스트 확인
6. (선택) Image content 탭 → Crop 버튼 → 모달에서 crop → 적용 → 캔버스 반영
7. Save → 새로고침 → 모든 변경 유지

---

## 4. 작업 규칙 (`AGENTS.md` 준수)

- Phase 2+ 스키마 확장 금지 (Phase 2 결정 세션 전까지) — **단, 이 배치는 디자인 토큰/스타일이라 Phase 2 mobile-responsive 영역과 무관**. hoverStyle/background는 디자인 시스템 영역.
- 데이터 파일 직접 수정 금지 (siteContent/insights-archive 외)
- `tree.ts` / `seed-home v` 변경 금지
- composite/Render.tsx legacy 폴백 제거 금지
- legacy-*.tsx 본문 수정 금지
- `git push --force`, `--no-verify` 금지

---

## 5. 완료 기준 (Definition of Done)

- [ ] Hover state schema + StyleTab 섹션 + 캔버스 preview + published render
- [ ] BackgroundEditor (Solid/Gradient/Image 3탭) + StyleTab 통합 + 양쪽 render
- [ ] SITE_THEME_PRESETS 5종 정의 + SiteSettingsModal Theme presets 탭 + apply 액션
- [ ] (선택) Image Crop/Filter 인스펙터 통합
- [ ] lint/build/tsc 모두 통과
- [ ] 브라우저 검증 7단계 모두 OK
- [ ] `SESSION.md`에 완료 commit hash + 완료 항목 추가
- [ ] `사이트 빌더 인수인계.md` § 3.1E 신설 → B6 디자인 2단계

---

## 6. 인수인계

작업 완료 시:
1. commit (의미 단위 분할 권장):
   - `B6-1 hover state schema + style tab + canvas/published render`
   - `B6-2 BackgroundEditor with gradient/image support`
   - `B6-3 site theme presets (5 sets)`
   - `B6-4 (optional) image crop/filter inspector integration`
2. `SESSION.md` 갱신:
   ```
   ### 2026-04-29 (Codex S-09 또는 다음)
   **B6 done**: hover state + background gradient/image + site preset themes.
   - 커밋: <hash>
   ```
3. 다음 Claude 트랙 충돌 회피 — Claude는 anchor links / selection floating toolbar 진행 중일 가능성. 메뉴/store/CanvasContainer는 건드리지 말 것.

---

이 프롬프트 파일: `/Users/son7/Projects/tseng-law/CODEX-PROMPT-DESIGN-SYSTEM-B6.md`. Codex 던질 때 이 경로만 알려주면 됨.
