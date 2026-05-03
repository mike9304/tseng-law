# CODEX PROMPT — D-POOL Wave Index

> **마스터 인덱스**: 디자인 풀 6 트랙의 dispatch 순서, 파일 충돌 매트릭스, 공통 디자인 토큰, 통합 검증 절차.
> 발주자: Claude (Manager) — 사용자 "윅스빌더 디자이너 팀 총괄" 지시 (2026-05-01)

---

## 1. 트랙 개요

| ID | 영역 | 산출 파일 | 영향 범위 | 권장 dispatch |
|---|---|---|---|---|
| **D-POOL-1** | Editor Shell Visual System | `CODEX-PROMPT-DESIGN-POOL-1-EDITOR-SHELL.md` | SandboxPage 쉘 / TopBar / Catalog·Layers chrome / density 토큰 | Wave A 단독 |
| **D-POOL-2** | Canvas Direct-Manipulation Polish | `CODEX-PROMPT-DESIGN-POOL-2-CANVAS-INTERACTION.md` | Drag ghost / Resize px readout / Multi-select bbox / Smart guides + distance label / Zoom-invariant overlay | Wave A 단독 |
| **D-POOL-3** | Inspector + Selection-driven UI Cluster | `CODEX-PROMPT-DESIGN-POOL-3-INSPECTOR-SELECTION.md` | Inspector 3탭 + InspectorControls primitives + SelectionToolbar + ContextMenu 30+ 액션 | Wave A 단독 |
| **D-POOL-4** | Modal · Gallery · Settings System | `CODEX-PROMPT-DESIGN-POOL-4-MODAL-SYSTEM.md` | ModalShell 통일 + SiteSettings 6탭 + 실제 템플릿 썸네일 렌더러 + 모든 모달 통일 | Wave B (5 의존) |
| **D-POOL-5** | ColorPicker & FontPicker Advanced | `CODEX-PROMPT-DESIGN-POOL-5-PICKERS-ADVANCED.md` | ColorPickerAdvanced (EyeDropper / WCAG / Recent / Brand) + FontPickerAdvanced (검색·Google Fonts) + theme/contrast.ts + theme/recent-colors.ts | Wave B 우선 |
| **D-POOL-6** | Public Widget Visual Polish | `CODEX-PROMPT-DESIGN-POOL-6-PUBLIC-WIDGETS.md` | BlogPostCard / BlogFeed 4 layout / Button 8 variants / BookingFlowSteps / Forms / FAQ / Columns + widget-tokens | Wave A 단독 가능 |

---

## 2. 권장 디스패치 순서

### Wave A (병렬 가능, 충돌 0)
- **D-POOL-1** Editor Shell
- **D-POOL-2** Canvas Interaction
- **D-POOL-6** Public Widgets

이 3개는 파일 영역이 완벽히 분리됨 (admin chrome / canvas overlay / public widget). 동시에 실행해도 머지 충돌 없음.

### Wave B (Wave A 완료 후, 직렬 권장)
1. **D-POOL-5** ColorPicker / FontPicker Advanced
   - 신규 `ColorPickerAdvanced` / `FontPickerAdvanced` 컴포넌트 추가.
   - 기존 `ColorPicker` / `FontPicker` 호출 지점은 trigger swatch만 교체.
2. **D-POOL-3** Inspector + Selection
   - InspectorControls primitives 라이브러리 추가.
   - Inspector 내부 swatch가 5의 advanced picker를 호출하므로 5 먼저.
3. **D-POOL-4** Modal · Gallery · Settings
   - ModalShell 추출 후 모든 모달 wiring.
   - SiteSettings 내부 picker trigger도 5의 advanced picker 호출 → 5 먼저.

### 의존 그래프
```
D-POOL-1 ─┐
D-POOL-2 ─┤  (병렬, 독립)
D-POOL-6 ─┘

D-POOL-5 ── (theme/contrast.ts, recent-colors.ts, advanced 컴포넌트)
   │
   ├─→ D-POOL-3 (Inspector swatch trigger가 advanced picker 호출)
   │
   └─→ D-POOL-4 (SiteSettings/BrandKit picker trigger가 advanced picker 호출)
```

---

## 3. 파일 충돌 매트릭스

| 파일 | D1 | D2 | D3 | D4 | D5 | D6 |
|---|---|---|---|---|---|---|
| `SandboxPage.tsx` (구조) | ✅ | — | — | — | — | — |
| `SandboxPage.module.css` | ✅ (전체 chrome) | 🟡 (`.canvas-overlay-*` namespace만) | — | — | — | — |
| `SandboxTopBar.tsx` | ✅ | — | — | — | — | — |
| `SandboxCatalogPanel.tsx` (chrome) | ✅ | — | — | — | — | — |
| `SandboxLayersPanel.tsx` (chrome) | ✅ | — | — | — | — | — |
| `PageSwitcher.tsx` (chrome) | ✅ | — | — | — | — | — |
| `CanvasContainer.tsx` (오버레이) | — | ✅ | — | — | — | — |
| `CanvasNode.tsx` (hover/badge) | — | ✅ | — | — | — | — |
| `AlignmentGuides.tsx` | — | ✅ | — | — | — | — |
| `SelectionBox.tsx` | — | ✅ | — | — | — | — |
| `DragGhost.tsx` (신규) | — | ✅ | — | — | — | — |
| `ResizeReadout.tsx` (신규) | — | ✅ | — | — | — | — |
| `MultiSelectionBoundingBox.tsx` (신규) | — | ✅ | — | — | — | — |
| `SnapDistanceLabel.tsx` (신규) | — | ✅ | — | — | — | — |
| `SandboxInspectorPanel.tsx` | — | — | ✅ | — | — | — |
| `SelectionToolbar.tsx` | — | — | ✅ | — | — | — |
| `ContextMenu.tsx` | — | — | ✅ | — | — | — |
| `InspectorControls.tsx` (신규) | — | — | ✅ | — | — | — |
| `SiteSettingsModal.tsx` | — | — | — | ✅ | 🟡 (picker trigger만 호출) | — |
| `TemplateGalleryModal.tsx` | — | — | — | ✅ | — | — |
| `TemplateThumbnailPlaceholder.tsx` (재작성) | — | — | — | ✅ | — | — |
| `ShortcutsHelpModal.tsx` | — | — | — | ✅ | — | — |
| `MoveToPageModal.tsx` | — | — | — | ✅ | — | — |
| `PublishModal.tsx` | — | — | — | ✅ | — | — |
| `CropModal.tsx` | — | — | — | ✅ | — | — |
| `BrandKitPanel.tsx` | — | — | — | ✅ | 🟡 (picker trigger) | — |
| `ModalShell.tsx` (신규) | — | — | — | ✅ | — | — |
| `ColorPicker*` 컴포넌트 | — | — | — | — | ✅ | — |
| `FontPicker*` 컴포넌트 | — | — | — | — | ✅ | — |
| `theme.ts` (token 추가만) | — | — | — | — | ✅ | — |
| `theme/contrast.ts` (신규) | — | — | — | — | ✅ | — |
| `theme/recent-colors.ts` (신규) | — | — | — | — | ✅ | — |
| `GoogleFontsLoader.tsx` | — | — | — | — | ✅ | — |
| `src/lib/builder/components/blogPostCard/*` | — | — | — | — | — | ✅ |
| `src/lib/builder/components/blogFeed/*` | — | — | — | — | — | ✅ |
| `src/lib/builder/components/button/Element.tsx` (시각만) | — | — | — | — | — | ✅ |
| `src/lib/builder/components/bookingWidget/*` | — | — | — | — | — | ✅ |
| `BookingFlowSteps.tsx` (public) | — | — | — | — | — | ✅ |
| `src/lib/builder/components/contactForm/*`, `form*/*` | — | — | — | — | — | ✅ |
| `src/lib/builder/components/faqList/*` | — | — | — | — | — | ✅ |
| `src/lib/builder/components/columnsGrid/*`, `columnList/*`, `columnCard/*` | — | — | — | — | — | ✅ |
| `widget-tokens.css` (신규, public 공통) | — | — | — | — | — | ✅ |
| `editor-tokens.css` (신규, admin 공통) | ✅ | — | — | — | — | — |

**충돌 검증 규칙**:
- ✅ = 해당 트랙이 단독 소유. 다른 트랙은 절대 손대지 말 것.
- 🟡 = 트랙 경계 (호출 trigger 한정). 합의된 경계만 허용.
- — = 해당 트랙 비범위.

---

## 4. 공통 디자인 원칙 (모든 6 트랙 준수)

### 4.1 Light/Dark 모드
- 모든 컬러는 `--editor-*` (admin) 또는 `--widget-*` (public) CSS variable 경유
- light/dark 양쪽 정의 필수 (`html[data-theme="dark"]` 셀렉터)
- raw HEX 직접 사용 금지 (단, 디자인 토큰 정의부는 예외)

### 4.2 모션 / Reduced Motion
- 모든 transition은 200ms 이하
- `@media (prefers-reduced-motion: reduce)` 분기로 즉시 표시 처리
- entrance preset(C1)과의 충돌 없음 — chrome 모션은 항상 짧고 functional

### 4.3 A11y
- focus-ring: 2px solid var(--editor-accent), 2px offset
- 모든 인터랙티브 요소에 `:focus-visible` 처리
- 키보드 네비 (Tab/Esc/Arrow keys)
- ARIA: dialog/menu/toolbar/tab 패턴 표준 준수
- screen reader 레이블 누락 금지

### 4.4 Density 토큰
- `data-editor-density="compact" | "cozy" | "comfortable"` (admin)
- `data-widget-density="compact" | "cozy" | "comfortable"` (public)
- 기본 `cozy`. spacing/font-size 토큰이 density별 분기.

### 4.5 Brand Kit 통합
- public 위젯은 Brand kit 5색을 우선 사용
- admin chrome은 별도 namespace (`--editor-*`) — Brand kit과 독립
- detached 상태(token에서 분리됨)는 인디케이터로 시각화

### 4.6 토큰 namespace 분리
| Namespace | 용도 | 트랙 |
|---|---|---|
| `--editor-*` | admin 빌더 chrome | D1 |
| `--canvas-*` | canvas 오버레이 | D2 |
| `--inspector-*` | Inspector control row | D3 |
| `--modal-*` | 모달 shell | D4 |
| `--picker-*` | Color/Font picker | D5 |
| `--widget-*` | public 위젯 | D6 |
| `--brand-*`, `--theme-*` | 사이트 brand kit (기존, 변경 없음) | (B7 자산) |

이 분리로 트랙별 토큰 충돌 없음.

---

## 5. 통합 검증 절차

### 5.1 트랙별 단위 검증 (각 Codex 실행 직후)
```bash
cd /Users/son7/Projects/tseng-law
npx tsc --noEmit
npm run lint
npm run build
npm run test:unit
npm run security:builder-routes
```

### 5.2 Wave 통합 검증 (Wave A 또는 Wave B 모두 머지 후)
```bash
# 풀 게이트
npm run typecheck
npm run lint
npm run test:unit
npm run security:builder-routes
npm run build
BUILDER_SMOKE_TIMEOUT_MS=30000 npm run smoke:builder
```

### 5.3 시각 검증 (사용자 브라우저)
- `/ko/admin-builder` → editor chrome 격상 (D1)
- 노드 드래그/리사이즈/다중선택 → ghost·readout·bbox 표시 (D2)
- 노드 선택 → SelectionToolbar 다크 floating + 우클릭 ContextMenu 30+ 액션 (D3)
- Inspector 3탭 → InspectorControls primitives + linked/detached 인디케이터 (D3)
- SiteSettings 모달 → 6탭 사이드 nav + Brand kit 시각 + Dark 좌우 분할 + Presets 카드 (D4)
- Template Gallery → 실제 렌더 썸네일 + 카테고리 사이드바 (D4)
- Color picker → EyeDropper + WCAG contrast + Recent + Brand palette (D5)
- Font picker → 검색 + 카테고리 + Google Fonts + 미리보기 텍스트 (D5)
- `/ko` 공개 페이지 → BlogPostCard / BlogFeed / Button / Booking / Form / FAQ 격상 (D6)
- `/ko` 다크 토글 → 모든 위젯 다크 일관 (D6)
- 375px 모바일 viewport → 깨짐 없음 (D6)

### 5.4 회귀 체크 리스트
- [ ] 기존 SiteSettings → Brand kit JSON export/import 정상
- [ ] 기존 ColorPicker → 호출하는 모든 inspector 컨트롤이 advanced로 자연스러운 마이그레이션
- [ ] 기존 SelectionToolbar의 Edit text / Replace image / Edit link 액션 보존
- [ ] 기존 ContextMenu의 17 액션 보존 + 추가
- [ ] published `/ko`/`/zh-hant`/`/en` 3 locale 모두 정상 렌더
- [ ] `prefers-reduced-motion: reduce` 시 entrance/chrome motion 모두 즉시
- [ ] D1 density 토글 시 D3 Inspector도 같은 density 따름
- [ ] D5 advanced picker가 D3 Inspector swatch + D4 SiteSettings 양쪽에서 일관

---

## 6. 사용자 디스패치 가이드

### 6.1 Codex로 dispatch
```bash
# Wave A — 동시 (3개 터미널에서 병렬)
codex run /Users/son7/Projects/tseng-law/CODEX-PROMPT-DESIGN-POOL-1-EDITOR-SHELL.md
codex run /Users/son7/Projects/tseng-law/CODEX-PROMPT-DESIGN-POOL-2-CANVAS-INTERACTION.md
codex run /Users/son7/Projects/tseng-law/CODEX-PROMPT-DESIGN-POOL-6-PUBLIC-WIDGETS.md

# Wave B — 순차 (5 → 3 → 4)
codex run /Users/son7/Projects/tseng-law/CODEX-PROMPT-DESIGN-POOL-5-PICKERS-ADVANCED.md
codex run /Users/son7/Projects/tseng-law/CODEX-PROMPT-DESIGN-POOL-3-INSPECTOR-SELECTION.md
codex run /Users/son7/Projects/tseng-law/CODEX-PROMPT-DESIGN-POOL-4-MODAL-SYSTEM.md
```

### 6.2 트랙 부분 발주 시
- 우선순위 가장 높음: **D2 (Canvas Interaction)** — 사용자 매일 만지는 영역, 체감 격상 가장 큼
- 그 다음: **D6 (Public Widgets)** — 발행된 사이트 시각 격상
- 그 다음: **D3 (Inspector)** — 편집 효율 격상
- D1/D4/D5는 polish + 기능 확장

### 6.3 머지 후 SESSION.md 갱신
각 트랙 완료 후 `/Users/son7/Projects/tseng-law/SESSION.md` "2026-05-01 D-POOL Wave" 섹션에 결과 한 줄씩 append.

---

## 7. 알려진 리스크

1. **D5의 EyeDropper API**: Chrome/Edge 95+ 만 지원. Safari/Firefox 미지원. graceful fallback 필수.
2. **D4의 TemplateThumbnailRenderer**: HTML 축소 렌더는 200ms 안에 떠야 함. 큰 노드 트리(170 템플릿 × 평균 30 노드)는 LRU 메모이제이션 필수.
3. **D2의 Zoom-invariant overlay**: 모든 오버레이 요소가 1/zoom으로 보정되면, transform 계산 비용이 늘어남. `requestAnimationFrame` 안에서만 갱신.
4. **D1의 density 토큰**: 사용자가 토글하면 모든 패널이 즉시 적용 — D3 InspectorControls도 같은 token 구독해야 함. 사전 합의된 토큰 namespace로 자동 처리.
5. **D6의 widget-tokens**: 기존 Brand kit 토큰과 충돌 가능. `--widget-*`는 항상 fallback으로 brand 토큰 참조 (`var(--widget-bg, var(--brand-bg))`).

---

## 8. 후속 트랙 (D-POOL 이후 권장)

- **D-POOL-7 Animations Inspector + Timeline** — 현 C1 entrance/scroll/hover preset 인스펙터의 Wix 본가 Timeline editor (keyframes / easing curves) 격상
- **D-POOL-8 Layers Tree 시각** — F1 작업 후 추가 폴리시 (depth indicator, drag affordance, multi-select sync, search filter)
- **D-POOL-9 Asset Manager 시각** — G4 (folders / tags / search / AI generation / video) 시각 디자인
- **D-POOL-10 Mobile/Tablet Editor Chrome** — Phase 2 모바일 스키마 후, viewport switcher + 반응형 spec 인스펙터
- **D-POOL-11 Onboarding / Empty States** — 첫 진입 사용자 가이드, 빈 캔버스/목록의 일러스트·CTA

---

_파일 위치: `/Users/son7/Projects/tseng-law/CODEX-PROMPT-DESIGN-POOL-INDEX.md`_
_작성: 2026-05-01 Claude (Manager)_
_관련 산출물: `CODEX-PROMPT-DESIGN-POOL-{1~6}-*.md`_
