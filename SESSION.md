# SESSION.md — 현재 세션 인수인계

## 세션: Wave3 통합 완료 → 다음 target 대기
## 마지막 업데이트: 2026-05-01

> **상태 한 줄**: typecheck/lint/build/test:unit(364)/security(56 guarded) 전부 통과. Wave1+2+3 합쳐 코드는 건강. 다음 target W__ 또는 트랙 코드 지정 대기.

---

## 🔥 컴퓨터 다시 켜면 바로 할 일

1. **이 파일 읽기** (SESSION.md) — 현재 분담/진행 상태 파악
2. **AGENTS.md 읽기** — 금지 범위 / 역할
3. **dev 서버 띄우기**: `cd /Users/son7/Projects/tseng-law && npm run dev` (포트 3000, Basic Auth: admin / local-review-2026!)
4. **갭 분석 (재발견 버전) 읽기** — 이 파일 § "현재 갭 진단 (2026-04-29)" 섹션
5. 사용자가 다음 target 지정 → Manager 가 이 파일 덮어쓰기

---

## 작업 분담 (2026-04-29 사용자 지정)

| 트랙 | 담당 | 범위 |
|---|---|---|
| **B2 기능 확장** | **Claude (이 도구)** | 우클릭 메뉴 확장: Group/Ungroup, Distribute, Match size, Hide on viewport, Move to page, Save section. 파일: `CanvasContainer.tsx`, `store.ts`, 신규 `group.ts`, `clipboard.ts`. |
| **B3 디자인 시스템** | **Codex (사용자가 별도 실행)** | ColorPicker, FontPicker, 테마 텍스트 프리셋. 프롬프트: `/Users/son7/Projects/tseng-law/CODEX-PROMPT-DESIGN-SYSTEM-B3.md`. 파일: `StyleTab.tsx`, `text/heading Inspector.tsx`, `SiteSettingsModal.tsx`. ✅ 완료 (`2704841`) |
| **B6 디자인 2단계** | **Codex (사용자가 별도 실행)** | Hover state, Background gradient/image, Site preset themes (5종). 프롬프트: `/Users/son7/Projects/tseng-law/CODEX-PROMPT-DESIGN-SYSTEM-B6.md`. 파일: `StyleTab.tsx`, `BackgroundEditor.tsx`, `theme.ts`, `SiteSettingsModal.tsx`, `public-page.tsx`, `CanvasNode.tsx`. ✅ 완료 (`612515a`) |
| **B7 디자인 3단계** | **Codex (사용자가 별도 실행)** | Button 8 variants, Brand kit panel + JSON export/import, Dark mode 시스템. 프롬프트: `/Users/son7/Projects/tseng-law/CODEX-PROMPT-DESIGN-SYSTEM-B7.md`. 파일: `component-variants.ts`, `ButtonElement.tsx`, `button/Inspector.tsx`, `BrandKitPanel.tsx`, `SiteSettingsModal.tsx`, `theme.ts`, `DarkModeToggle.tsx`, `public-page.tsx`. ✅ 완료 (`8c5fb81`) |
| **C1 애니메이션 시스템** | **Codex (사용자가 별도 실행)** | Phase 5 시작. Entrance/Scroll/Hover preset 라이브러리 (14+5종) + Animations 인스펙터 탭 + IntersectionObserver published runtime. 프롬프트: `/Users/son7/Projects/tseng-law/CODEX-PROMPT-ANIMATIONS-C1.md`. ✅ 완료 (`0ff501d`) |
| **D1 템플릿 갤러리 통합** | **Codex (사용자가 별도 실행)** | 디스크 170개 템플릿 → registry 17 카테고리 import 완료 + TemplateGalleryModal 전면 재작성 (사이드바/검색/그리드) + SVG wireframe 썸네일 자동 생성 + 카테고리 메타. 프롬프트: `/Users/son7/Projects/tseng-law/CODEX-PROMPT-TEMPLATES-D1.md`. ✅ 완료 (`0658fb2`) |
| **E1 블로그 디자인** | **Codex (사용자가 별도 실행)** | Blog Manager admin 재디자인 (사이드바/카드 그리드/3컬럼 에디터 레이아웃 메타+에디터+미리보기), Frontmatter 패널 (카테고리/태그/저자/featured/SEO), blog-feed 4 layout (grid/list/masonry/featured-hero) CSS, post card chip/저자/reading time 디자인. 프롬프트: `/Users/son7/Projects/tseng-law/CODEX-PROMPT-BLOG-DESIGN-E1.md`. ⏳ 발주 대기 |
| **E2 블로그 위젯/어댑터** | **Claude 에이전트** | blog-feed/blog-post-card/blog-categories/blog-archive/featured-posts 5종 신규 kinds + Column → BlogPost adapter + frontmatter schema 확장 (category/tags/author/featured/publishedAt) + columns API GET 메타 포함. ⏳ 진행 중 |
| **C2 Forms 빌더 (Phase 4)** | **Claude 에이전트** | ✅ 완료 — 4 신규 kinds (form/form-input/form-textarea/form-submit), `isContainerLikeKind()` helper 신규, `/api/forms/submit` (public, rate-limit, honeypot, 시간 trap, Resend optional), Catalog/Layers 패널 통합. **2026-04-30 F5 후속**: form-select/form-checkbox/form-radio/form-file/form-date 5종 추가 + conditional runtime + multi-step + submissions manager 완료. 미완: hCaptcha/Turnstile, SMTP. |
| **C3 Header/Footer 글로벌** | **Claude 에이전트** | ✅ 완료 — `BuilderSiteDocument.headerCanvas/footerCanvas` (lazy seed), 신규 API `/api/builder/site/{header,footer}/draft`, 신규 admin URL `/admin-builder/{header,footer}` (`GlobalCanvasEditor`), public-page에서 `GlobalCanvasSection` 렌더 (없으면 legacy SiteHeader/Footer fallback). 미완: 모바일 반응형 + lightbox 트리거 in 글로벌 캔버스. |
| **B8 Phase 3 위젯 팩** | **Claude 에이전트** | Divider / Spacer / Icon / VideoEmbed 4종 신규 kind. ✅ 완료. tsc 통과. (이전 부수 발견: registry import 9개 vs schema 미등록 → **2026-05-01 검증 결과 이미 해결됨**, builderCanvasNodeKinds + 전용 schema 모두 등록 완료.) 기존 `video` stub은 보존됨. |
| **B9 Lightbox/Modal builder** | **Claude 에이전트 (background)** | Site에 lightbox entity 추가, 별도 admin URL, published click trigger (`href=lightbox:slug`). 파일: `site/types.ts` lightboxes, `persistence.ts`, 새 API routes, `LightboxOverlay/Mount`, `public-page.tsx` mount 추가. ⏳ 진행 중 |

**충돌 회피**: 두 트랙이 건드리는 파일 분리됨. Claude는 메뉴/store/group, Codex는 인스펙터/팔레트/폰트.

---

## 직전 작업 (S-07 + 2026-04-29 추가 수정)

### S-07 done (2026-04-28)
**Container auto-layout (flex/grid) 실동작.** 커밋 `76d9981`.

### 2026-04-29 (Claude)
- ✅ **뱃지 클러터 해소** (`SandboxPage.module.css`): `.nodeBadge` 호버/선택 시에만 표시. ID는 선택 시만.
- ✅ **B2-1 완료**: 우클릭 메뉴 + 단축키 확장
  - Distribute horizontally / vertically (3개 이상 선택 시)
  - Match width / Match height (2개 이상 선택 시)
  - Group / Ungroup (Cmd+G / Cmd+Shift+G)
  - 변경 파일: `store.ts` (4개 신규 액션 + 타입 2개), `CanvasContainer.tsx` (메뉴 6항목 + 단축키 wiring + childrenMap 노출). `align.ts`/`group.ts` pure func은 기존
- ✅ **B2-2 완료**: 사용자 체감 quick wins
  - **Edit text** 우클릭 (text/heading) — `builder:start-text-edit` CustomEvent로 `CanvasNode` inline editor 트리거
  - **Replace image** 우클릭 (image) — `onRequestAssetLibrary` 직접 호출
  - **Cmd+/ 또는 ?** — 키보드 단축키 도움말 모달 (`ShortcutsHelpModal.tsx` 신규)
  - 변경: `CanvasNode.tsx` (useEffect listener), `CanvasContainer.tsx` (메뉴 2항목 + showHelp dispatch), `shortcuts.ts` (showHelp action), `ShortcutsHelpModal.tsx` (신규 컴포넌트), `SandboxPage.tsx` (모달 wiring)
- ✅ **B2-3 완료**: Move to page (페이지 간 노드 이동)
  - **API**: `POST /api/builder/site/pages/[targetPageId]/move-from` (신규)
    - Body: `{ sourcePageId, nodeIds }`
    - 자손까지 함께 이동, 신규 ID 생성으로 충돌 회피, target 루트에 offset 배치
    - target 먼저 쓰고 source 삭제 (best-effort 원자성)
  - **UI**: 우클릭 메뉴 → "Move to page..." → `MoveToPageModal` (신규) → 페이지 리스트 클릭 → 토스트
  - 이동 후 source draft 자동 refetch + replaceDocument로 로컬 상태 동기화
  - 변경: `move-from/route.ts` (신규), `MoveToPageModal.tsx` (신규), `SandboxPage.tsx` (state + 모달 + onMoved 핸들러), `CanvasContainer.tsx` (메뉴 1항목 + 신규 prop)
- 📋 **Pages CRUD (B5)**: 분석 결과 **이미 완전 구현돼 있음** — `/api/builder/site/pages` GET/POST, `/[pageId]` PATCH/DELETE 다 있고, `PageSwitcher.tsx`에 + New 버튼, ⋯메뉴(이름변경/삭제), TemplateGalleryModal, slug 검증, 홈 보호까지 wired. 사용자가 좌측 레일 "Pages" 클릭하면 사용 가능.
- ✅ **Codex B3 완료**: 디자인 시스템 inspector 연결. 커밋 `2704841`
  - ColorPicker: Style 탭 `backgroundColor / borderColor / shadowColor`를 Theme palette token + custom HEX/HSL + 최근 색상 5개로 교체
  - FontPicker: Text/Heading inspector에 System / Site fonts / Google Fonts + `Aa 안녕하세요 你好 Hello` preview 연결
  - Theme preset: `Title 1 / Title 2 / Title 3 / Body / Quote` 스키마 + Text/Heading 적용 + SiteSettings Typography 탭
  - 색 토큰 타입 propagation 완료: `CanvasNode`, `public-page`, Text/Heading/Button render에서 `resolveThemeColor()` 적용
  - 검증: `npm run lint` ✅, `npm run build` ✅, `npx tsc --noEmit --incremental false` ✅, Playwright smoke ✅
- ✅ **Codex B6 완료**: 디자인 시스템 2단계. 커밋 `612515a`
  - Hover state: `hoverStyle` schema + Style 탭 토글/편집 + Canvas hover preview + published `:hover` CSS 변수 렌더
  - BackgroundEditor: Solid / Gradient / Image / None 탭, linear/radial gradient stops, image URL/asset picker/size/position/repeat/overlay
  - Site theme presets: Modern / Classic / Bold / Minimal / Editorial 5종 + SiteSettings Presets 탭 + confirm 적용 흐름
  - 렌더: `resolveBackgroundStyle()`로 editor/published/ButtonElement가 solid/token/gradient/image background 처리
  - 검증: `npx tsc --noEmit --incremental false` ✅, B6 파일 targeted lint ✅, Playwright smoke ✅
  - (참고) Codex changelog의 "B6와 무관한 SelectionToolbar import 실패" 노트는 Codex 작성 시점 기준. Claude가 SelectionToolbar wiring 마치면서 해소됨.
- ✅ **Codex B7 완료**: 디자인 시스템 3단계. 커밋 `8c5fb81`
  - Button variants 8종: primary solid/outline/ghost/link, secondary solid/outline, CTA shadow/arrow. 기존 `primary/secondary/outline/ghost/link` 값은 legacy alias로 유지.
  - `component-variants.ts`: button/card/form input variant token 정의 추가. Card/Form은 future widget이 자동 연결할 수 있게 token만 준비.
  - Brand kit: SiteSettings `Brand kit` 탭, light/dark logo URL, 5색, title/body font, radius scale, Apply, JSON export/import, `/api/builder/site/brand-kit`.
  - Dark mode: `BuilderTheme.darkColors`, SiteSettings `Dark` 탭 + Preview dark, published CSS variables, OS preference/localStorage 기반 `DarkModeToggle`.
  - 검증: `npm run lint` ✅, `npm run build` ✅, `npx tsc --noEmit --incremental false` ✅, Playwright smoke ✅ (`button variant options=8`, Brand kit/Dark tabs, published toggle light→dark)
- ✅ **Codex C1 완료**: 애니메이션 시스템 Phase 5 시작. 커밋 `0ff501d`
  - Schema: `animationConfigSchema` + `baseCanvasNodeSchema.animation` 추가. node kinds는 변경하지 않음.
  - Presets: entrance 14종 (`fade/slide/zoom/bounce/flip/reveal/spin/float`), scroll 6종 (`parallax/fade/scale/rotate/pin`), hover 5종 (`lift/pulse/glow/rotate-3d/tint`).
  - Inspector: `AnimationsTab` 신규. Entrance/Scroll/Hover 섹션, duration/delay/easing/triggerOnce, Play preview.
  - Editor preview: `CanvasNode`에서 Play preview 이벤트 기반 entrance 재생, hover preset 즉시 미리보기.
  - Published runtime: `AnimationsRoot` client component. IntersectionObserver entrance, scroll listener 효과, hover CSS transitions. `public-page.tsx` data attr/CSS var 연결.
  - 검증: `npm run lint` ✅, `npm run build` ✅, `npx tsc --noEmit --incremental false` ✅, Playwright smoke ✅ (`/ko/admin-builder` Animations 탭 + hover lift + `/ko` runtime CSS)
- ✅ **Codex D1 완료**: 템플릿 갤러리 통합. 커밋 `0658fb2`
  - Registry: `src/lib/builder/templates`의 17 카테고리 × 10개 = 170개 템플릿 전체 import/export 연결. 빈 `portfolio` 폴더는 제외.
  - UI: `TemplateGalleryModal`을 90vw/88vh 갤러리로 재작성. 좌측 카테고리 사이드바, 200ms 검색 debounce, responsive grid, hover transform/action pill, blank page 카드 유지.
  - Thumbnail: `TemplateThumbnailPlaceholder` 신규. 템플릿 canvas document를 SVG wireframe으로 축소 렌더링.
  - 검증: registry count `imports=170 entries=170`, `npx tsc --noEmit --incremental false` ✅, `npm run lint` ✅(기존 `<img>` warning만), `npm run build` ✅, Playwright smoke ✅(`/ko/admin-builder` → Pages → + New → 170개/카테고리/search/hover/template click→slug prompt)

### 2026-04-29 (S-08 종합 검증)
- ✅ `npx tsc --noEmit` — 0 errors (Codex B3+B6+B7+C1+D1 + Claude B2-1~B2-6 모두 통합)
- ✅ `npm run lint` — 0 errors (기존 `<img>` warning만)
- ✅ `npm run build` — 성공 (모든 라우트 빌드 OK). D1 이후 `/[locale]/admin-builder` first-load bundle은 170개 정적 템플릿 import 때문에 약 531 kB.
- 두 트랙 충돌 없이 합쳐짐

---

## 현재 갭 진단 (2026-05-01 — Wave3 통합 후 재검증)

> **이전 갭 분석(2026-04-29)은 부분 STALE.** 코드 직접 검증 후 갱신:

**전체 패리티: ~35~40%** (Wave1+2+3 통합 후. 데이터 모델/Wire는 거의 완성, 사용자 검증/모바일 UI 큰 비중 미완)
**Wix 체크포인트 점수: 4/225 🟢** (W01, W05, W13, W16). W02–W12, W18–W30 다수가 🟡 WIP — 코드는 있고 사용자 브라우저 클릭 검증 필요.

### 영역별 점수 (재산정)
| 영역 | 비율 | 비고 |
|---|---|---|
| 자유 캔버스 편집 (drag/resize/select/zoom/pan) | 80% | viewport-aware drag/resize (Wave2 B2) + Esc cancel (Wave3 B3). 사용자 검증 대기 |
| 우클릭 메뉴 | 50% | 17+α 액션. SelectionToolbar(Wave1 B2-6) + LinkPicker(Wave3 C3) 통합 |
| Inspector 3탭 | 75% | Layout/Style/Content + A11y/SEO + Animations + Theme indicator(Wave1 E1) |
| Add 패널 | 50% | 위젯 26+종 (form/blog/booking 포함) + Built-in sections 12종 (Wave3 F3) |
| Pages CRUD | 60% | 목록/추가/삭제/이름변경/템플릿 전부 wired. 사용자 클릭 검증 대기 |
| Asset Library | 80% | 모달 완성. 폴더/태그/AI 생성은 미완 (G4) |
| **디자인 시스템** | 75% | 🟡 ColorPicker/FontPicker/Theme presets/Hover/Background/Button variants/Brand kit/Dark mode/Theme indicators(E1) 완료. Advanced typography는 남음 |
| **반응형** | 35% | 🟡 Wave1 B1 foundation + Wave2 B2 viewport-aware drag/resize + BreakpointSwitcher 동작. **인스펙터 per-viewport override UI / Hide on viewport / fontSize override 미완** (Phase 2 큰 블로커) |
| **모션** | 35% | 🟡 C1 entrance/scroll/hover preset + IntersectionObserver runtime. Timeline/page transition/loop/Lottie는 미완 |
| **위젯 라이브러리** | 35% | 🟡 26+종 (B8 4 + 9 pre-existing + Forms 9 + Blog 5 + Booking 1 + Sections 12 등). 70+ 목표 대비 절반 |
| **Vertical Apps** | 15% | 🟡 Bookings (services/staff/calendar/availability) admin foundation 완료. Stores/Members/Events/Plans 미시작 |
| **헤더/푸터 편집** | 50% | 🟡 GlobalCanvasEditor route 동작. **모바일 반응형 + lightbox trigger 미완** |
| **퍼블리시 인프라** | 70% | 🟢 Publish CAS / immutable revision pointer / 409/422/500 분기 (Wave3 A3) + Audit log (D3) |
| **다국어** | 60% | 🟡 ko/zh-hant/en + Translation Manager + AI translate API (F4) |

### Wix에 있고 우리에게 (아직) 없는 것 — 2026-05-01 재정리
- **반응형 인스펙터 UI**: Hide on viewport / per-viewport fontSize override / mobile-only padding 등 (Phase 2 블로커, 6–8h)
- **헤더/푸터 글로벌**: 모바일 햄버거 자동 변환 + 모바일 sticky + lightbox trigger
- **모션 고도화**: timeline editor, exit animation, loop, Lottie, page transition (H1)
- **위젯 missing 30+**: Strip/Slider/Audio/Anchor menu/Vector/Repeater/Pricing table 등
- **Vertical Apps 미시작**: Stores/Members/Events/Plans/Groups/Portfolio (G2~)
- **운영 인프라**: Site Search(H5), Live Chat(H2), CRM(H3), Email Marketing(H4), Analytics(H7), Publish gate(H8)
- **Velo / App Market**: 장기 (P3)

---

## 다음 배치 후보 (체감 큰 순)

**현재 진행:**
- ✅ B2-1 (Claude) — Distribute / Match size / Group / Ungroup
- ✅ B2-2 (Claude) — Edit text / Replace image / Shortcut help (Cmd+/)
- 🟢 B5 Pages CRUD — 이미 구현돼 있음 (좌측 레일 "Pages" 클릭)
- ✅ B3 디자인 시스템 (Codex) — 완료. 커밋 `2704841`
- ✅ B6 디자인 시스템 2단계 (Codex) — 완료. 커밋 `612515a`
- ✅ B7 디자인 시스템 3단계 (Codex) — 완료. 커밋 `8c5fb81`
- ✅ C1 애니메이션 시스템 (Codex) — 완료. 커밋 `0ff501d`
- ✅ D1 템플릿 갤러리 통합 (Codex) — 완료. 커밋 `0658fb2`
- ✅ B2-3 (Claude) — Move to page 완료 (신규 API + 모달)
- ✅ B2-4 (Claude) — Sticky positioning (Pin to screen) 완료
  - **Schema**: `baseCanvasNodeSchema`에 optional `sticky: { offset, from }` 추가 (`types.ts`)
  - **Runtime**: `public-page.tsx`에서 sticky 노드는 `position: sticky`, top/bottom offset 적용, z-index 자동 100 이상
  - **Editor**: `CanvasNode.tsx` 뱃지에 📌 아이콘 표시 (호버/선택 시)
  - **Inspector**: Layout 탭의 Lock/Hide 옆에 "📌 Pin to screen" 토글 + offset 입력 + Top/Bottom 선택 (`SandboxInspectorPanel.tsx`)
- ✅ B2-5 (Claude) — Anchor links / scroll to section 완료
  - **Schema**: `baseCanvasNodeSchema`에 optional `anchorName` (lowercase alphanumeric + hyphens, max 64) 추가 + `anchorNameSchema` (`types.ts`)
  - **Runtime**: `public-page.tsx`에서 anchor 노드는 `id={anchorName}` 자동 부여 + `data-anchor` 속성. `html { scroll-behavior: smooth }`, `:target { scroll-margin-top: 80px }` 글로벌 CSS 추가
  - **Editor**: `CanvasNode.tsx` 뱃지에 ⚓ 아이콘 + 앵커 이름 표시 (선택 시)
  - **Inspector**: Layout 탭에 "⚓ Anchor name" 입력 필드 + 자동 sanitize (소문자/하이픈만) + 사용 안내 (`#name`)
  - 사용법: 섹션 컨테이너에 anchor name 부여 → 다른 버튼 href에 `#name` 입력 → 클릭 시 부드러운 스크롤
- ✅ B2-6 (Claude) — Selection floating mini-toolbar (Wix 시그니처 UI) 완료
  - **신규 컴포넌트**: `SelectionToolbar.tsx` — 선택 노드 위(또는 아래)에 떠 있는 다크 툴바. 선택 시 즉시 표시, drag/resize 중에는 자동 숨김
  - **위치 계산**: `CanvasContainer.tsx`에서 selectedNodes의 absolute bbox → screen coords (zoom + pan transform 적용) → 위/아래 자동 flip
  - **액션**: Edit text(text/heading) / Replace image(image) / Edit link(button) / Duplicate / 앞↑ / 뒤↓ / Delete / 더보기 ⋯
  - 더보기 클릭 시 클릭 위치 기준으로 기존 우클릭 ContextMenu 오픈
- ⏳ B2-7 남은 항목 (Claude, 후순위): Hide on viewport (Phase 2 스키마 후), Save section (라이브러리 백엔드 필요), Anchor 메뉴 위젯 (Phase 3 위젯 라이브러리)

**대기:**
- B4 헤더/푸터 글로벌 composite 변환 (4~6h)
- B5 Pages CRUD (Pages 추가/삭제/이름변경) (3~4h)
- B6 Phase 2 모바일 스키마 결정 세션 (2~3h 결정 + 6~8h 구현)
- B7 Phase 3 위젯 시작: Strip/Gallery/Form/Slider (16h+)
- B8 모션 Phase 5 시작 (큰 작업)

---

## 마스터 플랜 스코프 (SESSION 간 불변)

**에디터 1:1 패리티 + Motion 풀 세트 + Wix Bookings**

체크포인트: W01~W225 (`/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md`)

| Phase | 범위 | W | 상태 |
|---|---|---|---|
| 0 | F0 사이트 → 빌더 전환 | — | 🟢 홈 + 서브페이지 decompose + container auto-layout |
| 1 | 에디터 코어 | W01~W30 | 🟡 W24/W25 green 추가 + Claude B2 진행 |
| 2 | 모바일 | W31~W45 | 🔴 스키마 결정 대기 |
| 3 | 위젯 라이브러리 | W46~W135 | 🔴 |
| 4 | Forms | W136~W150 | 🔴 |
| 5 | Motion | W151~W175 | 🟡 C1 완료: entrance/scroll/hover presets + IntersectionObserver runtime. Timeline/page transition/loop 미완 |
| 6 | Design | W176~W190 | 🟡 ColorPicker/FontPicker/Theme presets/Hover/Gradient+Image background/Site presets/Button variants/Brand kit/Dark mode 완료, Advanced typography/Card/Form 적용 남음 |
| 6.5 | Templates | P8 일부 | 🟡 D1 완료: 170 page templates registry + 갤러리/sidebar/search/SVG thumbnail. Section template/save-as-template/real thumbnail renderer는 미완 |
| 7 | SEO | W191~W195 | 🟡 SeoPanel 있음 |
| 8 | Bookings | W196~W215 | 🔴 |
| 9 | 고도화 | W216~W225 | 🔴 |

---

## 2026-04-30 멀티 에이전트 배치 결과

사용자 지시로 `gpt-5.5` high worker 5개 병렬 실행.

| 트랙 | 결과 |
|---|---|
| E1 블로그 디자인 | Blog Manager 목록/카드/카테고리 사이드바, 칼럼 에디터 3컬럼 레이아웃, frontmatter 패널, 신규 칼럼 모달 시각 확장 완료. blog widget CSS는 충돌 회피상 미적용. |
| F1 반응형 + Layers | Breakpoint switcher 시각, Inspector override badge, Layers tree/search/hover/reorder UI 완료. |
| F4 다국어 sync | Translation Manager route/UI, matrix/progress/category tree, inline edit/AI translate API 통합, source hash 타입 오류 수정 완료. |
| F5 Forms 확장 | `form-select/radio/checkbox/file/date`, conditional runtime, validation, multi-step, submissions manager, forms-flow inventory 완료. |
| G1 Bookings MVP | bookings types/storage/availability/API/admin services/staff/calendar UI, public booking APIs, BookingFlowSteps foundation 완료. `booking-widget` registry 등록은 후속. |

검증:
- `npx tsc --noEmit --incremental false` ✅
- `npm run lint` ✅ (`<img>` warning만)
- `npm run build` ✅ (Google Fonts 다운로드 warning + bookings CSS autoprefixer warning만)
- Dev smoke on `http://localhost:3002`:
  - `/ko/admin-builder/columns` 200
  - `/ko/admin-builder/translations` 200
  - `/ko/admin-builder/forms-flow` 200
  - `/ko/admin-builder/forms/submissions` 200
  - `/ko/admin-builder/bookings` 307 → services
  - `/ko/admin-builder/bookings/services` 200
  - `/ko/admin-builder/bookings/staff` 200
  - `/ko/admin-builder/bookings/calendar` 200

---

## 환경 메모

- **포트**: 3000 (`localhost:3000`)
- **현재 확인된 dev 서버**: 3000 (`localhost:3000`)
- **Basic Auth**: `admin` / `local-review-2026!`
- **Desktop 폴더 권한**: 정상 작동 (2026-04-29 확인). 갭 분석 문서 등 read/write 가능.

---

## 금지 범위

- 데이터 파일 직접 수정으로 "시각 일치" 만드는 우회 (siteContent/insights-archive 는 허용, 그 외는 금지)
- tree.ts / seed-home v 변경 (대규모 reseed 유발)
- composite/Render.tsx 의 `legacy-page-*` switch 제거 (호환성 fallback)
- legacy-*.tsx 본문 수정
- Phase 2+ 스키마 확장 (Phase 2 결정 세션 전까지)
- `git push --force`, `--no-verify`

---

## 역할

- **Claude Opus = 기능 트랙 직접 실행** (B2). 또한 Codex 프롬프트 작성·결과 검수·SESSION 갱신 담당.
- **Codex = 디자인 트랙 실행** (B3/B6/B7). Manager (Claude)가 제공한 프롬프트만 실행, 자기 주도 작업 중단.
- **User**: target 지정, Codex 실행 트리거, 브라우저 시각 대조, 녹색 판정.

---

## 한줄 요약

"S-08/S-10: B2/B3/B6/B7/C1/D1 완료 후 2026-04-30 멀티 에이전트 배치로 E1 Blog admin, F1 Responsive/Layers UI, F4 Translation Manager, F5 Forms+, G1 Bookings foundation 통합. 검증: tsc/lint/build 통과 + 신규 admin route smoke 통과. 다음: booking-widget registry 연결, blog-feed widget CSS, 브라우저 수동 UX 검증."

---

## 2026-04-30 후속 멀티 에이전트 결과

사용자 지시로 `gpt-5.5` xhigh worker 3개 병렬 실행.

| 트랙 | 결과 |
|---|---|
| Booking Widget | `booking-widget` canvas kind/schema/registry 등록, bookingWidget Element/Inspector 추가. Published mode는 기존 `BookingFlowSteps` 사용, editor mode는 정적 preview 제공. |
| Blog widgets | `blog-feed` grid/list/masonry/featured-hero CSS/렌더링 완료. `blog-post-card` category chip, author/date/reading time, excerpt, image/placeholder/CTA/hover 상태 보강. |
| Layers/Canvas | Layers cross-parent drag 지원. 컨테이너 middle drop은 nest, row above/below drop은 같은 parent reorder 또는 parent 이동. Canvas overlap hint/list picker 추가. |

추가 정리:
- `BookingsAdmin.module.css`의 `align-items: start`를 `flex-start`로 변경해 autoprefixer warning 제거.
- build 후 dev 서버 캐시 충돌(`vendor-chunks/zod.js`)이 발생해 3000 서버 재시작 완료.

검증:
- `git diff --check` ✅
- `npx tsc --noEmit --incremental false` ✅
- `npm run lint` ✅ (`<img>` warning만)
- `npm run build` ✅ (Google Fonts 다운로드 warning + 기존 `<img>` lint warning만)
- Dev smoke on `http://localhost:3000`:
  - `/ko/admin-builder` 200
  - `/ko/admin-builder/columns` 200
  - `/ko/admin-builder/bookings/services` 200
  - `/api/builder/blog/posts?locale=ko&limit=3&scope=all` 200

---

## 2026-05-01 유능 에이전트 문서 기준 1차 웨이브

사용자 지시로 `WIX-PARITY-6-ENGINEER-WORK-ORDERS.md` 기준 worker 6개 병렬 실행. 고위험 파일은 겹치지 않게 분리.

| 트랙 | 결과 |
|---|---|
| D1 QA/Security harness | `typecheck`, `test:unit`, `security:builder-routes`, `smoke:builder`, `qa` 스크립트 추가. `vitest.config.ts`, builder route guard scanner, local builder smoke script 추가. `npm install`로 `package-lock.json` 정합성 갱신. |
| A1 Canonical site id / public read purity | `DEFAULT_BUILDER_SITE_ID=tseng-law-main-site`, `LEGACY_BUILDER_SITE_ID=default`, `normalizeBuilderSiteId()` 추가. `readSiteDocument()`의 read-on-miss write 제거, `ensureSiteDocument()` 추가. public `[locale]/[[...slug]]`에서 `seedSitePages()` 호출 제거. guarded `/api/builder/site/seed` 추가. |
| B1 Responsive geometry foundation | `resolveCanvasNodeAbsoluteRectForViewport()`, `cancelMutationSession()`, `updateNodeRectsForViewport()` 추가. desktop은 base `rect`, tablet/mobile은 full `responsive.<viewport>.rect`에 쓰는 foundation 마련. CanvasContainer wiring은 후속 B2. |
| C1 Rich text schema / renderer | `content.richText` optional TipTap JSON 모델 추가. legacy text -> paragraph doc helper, 안전한 React renderer, link sanitizer 추가. Inline editor 저장 연결은 후속 C2. |
| E1 Theme linked/detached indicators | 색상 token/raw, typography preset/manual, button variant override 상태를 inspector UI에 표시. 스키마 변경 없음. |
| F2 Saved section normalization / SVG safety | saved section root `x:0,y:0` 정규화, root subtree만 저장, insert offset 정확화. 서버 thumbnail 재생성 및 SVG script/event/external href 안전 필터 추가. |

검증:
- `git diff --check` ✅
- `npm install` ✅ (`vitest` lockfile 반영, npm audit: 11 vulnerabilities reported — 자동 수정 안 함)
- `npm run typecheck` ✅
- `npm run test:unit` ✅ (현재 테스트 파일 없음, `passWithNoTests`)
- `npm run security:builder-routes` ✅
  - 경고: 4개 mutation handler가 `guardMutation`이 아니라 auth-only guard로 통과됨. 후속 D2 대상:
    - `src/app/api/builder/columns/[slug]/route.ts` PATCH/DELETE
    - `src/app/api/builder/columns/route.ts` POST
    - `src/app/api/builder/sandbox/draft/route.ts` PUT
- `npm run lint` ✅ (`<img>` warning만)
- `npm run build` ✅ (Google Fonts 다운로드 warning + 기존 `<img>` warning만)
- Dev server 재시작 후 `BUILDER_SMOKE_TIMEOUT_MS=30000 npm run smoke:builder` ✅
  - `/ko/admin-builder` 200
  - `/ko/admin-builder/columns` 200
  - `/api/builder/home?locale=ko` 200
  - `/api/builder/site/pages?locale=ko` 200
  - `/api/builder/site/settings?locale=ko` 200
  - `/api/builder/assets?locale=ko&limit=1` 200

잔여 리스크 / 다음 웨이브:
- `rg` 기준 `readSiteDocument('default')`, `writePageCanvas('default')`, `publishPage('default')`, `siteId: 'default'` 호출이 아직 admin/API 일부에 남아 있음. persistence 내부 정규화로 작동은 하지만 A1 cleanup 후속 필요.
- `/ko/admin-builder` smoke 중 admin route가 seed/publish side effect를 수행함. public page read path에서는 제거됐지만 admin route side effect는 A2/A3 전에 별도 판단 필요.
- 다음 문서 순서: D2 guard coverage -> A2 draft CAS -> B2 viewport-aware drag/resize CanvasContainer wiring -> C2 inline rich text persistence -> A3 publish transaction.
- F1 template registry tests 완료. test:unit이 0 → 345+ 케이스 검증. D1 harness가 진짜 게이트로 동작. XFAIL: blog-about nodes[1].style.borderRadius >64, blog-authors author photo style.borderRadius >64.
- 2026-05-01 Wave2 C2 inline rich text persistence 완료: TipTap JSON 저장/seed, sanitized React 렌더, inspector plain-text regen 경고 적용; security/smoke 통과, typecheck/lint/build는 기존 component-variants/SandboxPage 오류로 차단.
- 2026-05-01 Wave2 B2 viewport-aware drag/resize 완료: CanvasContainer viewport rect mutation, non-desktop reparent 차단, autosave guard 적용; typecheck/lint/build/smoke 통과.
- D2 guard coverage 완료. 4 auth-only → 0. asset list admin-only. publish/asset bucket 분리.
- 2026-05-01 Wave2 E2 card/form variants 완료: card/form variant schema+render+inspector wiring 및 legacy cardStyle adapter 적용; typecheck/lint/build/smoke(3003) 통과.
- 2026-05-01 Wave2 A2 draft CAS 완료: PageCanvasRecord envelope, draft GET/PUT 409/428, client conflict pause/reload 적용; typecheck/lint/security/dev smoke/curl CAS 통과, clean build는 기존 Next _document/_not-found trace 누락으로 차단.
- 2026-05-01 Wave3 E3 Brand Kit + Dark Mode 완료: brand asset ids/favicon/OG, darkMode default/toggle, early theme script, asset logo fallback 적용; E3 수정 후 typecheck 1회 통과/lint 통과, 최신 typecheck는 sections/templates.ts 외부 오류, build는 Next _document trace, smoke는 sandbox local fetch 제한으로 차단.
- 2026-05-01 Wave3 F3 built-in sections 완료: 12개 기본 섹션 템플릿/패널/카탈로그 삽입 및 F1 XFAIL 제거; typecheck/lint/test:unit/security/diff-check 통과, build는 기존 Next `_document` chunk 누락, smoke는 localhost dev 연결 불가로 차단.
- 2026-05-01 Wave3 A3 publish transaction 완료: publish CAS/PublishError/status 계약, immutable revision pointer public read, UI 409/422/500 분기 적용; typecheck/lint/test:unit/security/build 통과, smoke는 dev server 포트 접근 문제로 실패.
- 2026-05-01 Wave3 C3 LinkPicker 완료: 공용 LinkValue/LinkPicker, button/image/container/SelectionToolbar/inline rich-text/publish-gate/a11y/translations link safety 적용; typecheck/test:unit/lint/security/build 통과, smoke는 dev 서버 접근 불가로 실패.
- 2026-05-01 Wave3 B3 Esc cancel 완료: drag/resize Esc capture cancel 및 rotate transient/cancel 적용; lint/diff-check 통과, typecheck/build는 동시 작업 타입 오류, smoke는 admin-builder timeout/columns 500로 차단.
- 2026-05-01 Wave3 D3 audit log 완료: JSONL audit store/record/test, asset/publish/rollback/column route audit 기록, admin audit API 적용; 통합 typecheck/lint/test:unit/security/build/smoke 통과.
- 2026-05-01 Wave3 통합 검증 완료: git diff --check, typecheck, lint, test:unit(364), security:builder-routes, build, warmed smoke 6/6 통과.

---

## 2026-05-01 Claude 디자인 트랙 (사용자 지시: "다른 AI 디자인팀 + 너는 경쟁팀 디자인 팀장")

> Codex가 만진 영역(F1 BreakpointSwitcher, B3/B6/B7, D1, E1) 충돌 회피하고 빈 영역 직접 디자인.

### W40 Mobile Preview Modal 신규 — 디자인+기능 직접 작성
- **신규 파일**: `src/components/builder/canvas/PreviewModal.tsx`
  - `DEVICES` 스펙: desktop 1280×800, tablet 768×1024 (베젤 14, 라디우스 28), mobile 390×780 (베젤 12, 라디우스 44, notch + home indicator)
  - **DeviceFrame 컴포넌트**: desktop은 traffic lights (red/amber/green dot) + browser chrome, tablet/mobile은 검은 베젤 + 둥근 모서리 + (mobile) iPhone notch + home indicator
  - 자동 stage scale 계산 (window 86%/70% 기준), 새로고침/새 탭/Esc 닫기, ⌘R 단축키
  - inline style 기반(다른 모달 패턴 일관), `<style>` 블록으로 `previewBackdropIn`/`previewShellIn` keyframe + device button hover/pressed
- **wiring**:
  - `SandboxTopBar.tsx` 미리보기 버튼 stub → `onOpenPreview` prop, 👁 아이콘 추가
  - `SandboxPage.tsx` `previewOpen` state + `<PreviewModal>` mount, `previewUrl=buildSitePagePath(locale, currentSlug)`, `initialDevice=viewport`
- 결과: TopBar 미리보기 클릭 → 디바이스 프레임 모달 → desktop/tablet/mobile 토글 + 실제 published page iframe. **W40 검증 대기** (Wix 체크포인트 5/225 가능).

### W38 Show on Desktop/Tablet/Mobile 3 토글 묶음 — 인스펙터 UI 직접 디자인
- **변경 파일**: `src/components/builder/canvas/SandboxInspectorPanel.tsx`
  - 신규 `ShowOnDeviceToggles` 컴포넌트: 디바이스 아이콘+단축자 칩 3개. 클릭 토글:
    - desktop → `node.visible` (base)
    - tablet/mobile → `responsive.<vp>.hidden` override
  - 시각: 활성 viewport는 파란 그라데이션 + 진한 보더로 강조, hidden 상태는 회색 + 대각선 strikethrough 오버레이
  - 기존 `Hide on {viewport}` 단일 토글 제거, 대신 **항상 3 토글 표시 + 현재 viewport에서 hidden일 때 ⚠ 경고 라인**
- 결과: 데스크톱 모드에서도 모바일 hidden 상태를 한눈에 보고 토글. **W38 검증 대기** (W17/W33도 같이 green 가능).

### 검증
- typecheck ✅, lint ✅(기존 `<img>` warning만, 신규 깨끗), test:unit ✅(364), security ✅(56), build ✅
- dev 서버 3001 reload — admin-builder 200 + Compiled in 60-180ms (823~1906 modules)

### 충돌 회피 노트
- Codex F1 BreakpointSwitcher 그대로 유지 (TopBar의 viewport 토글은 캔버스 모드 전환용, 미리보기는 별도 모달)
- B3/B6/B7 디자인 시스템 토큰(#0f172a/#f1f5f9/#e2e8f0/#cbd5e1) 그대로 따름
- 신규 모달 z-index 10100 (기존 ShortcutsHelpModal과 동일 레이어)
- 2026-05-01 D-POOL Wave (디자인 6트랙 병렬 발주, in-progress): Claude 메인이 사용자 "디자인 팀 총괄" 지시 받아 6개 design specialist agent 병렬 발주. 각자 영역 충돌 없이 자기 슬라이스의 Codex 프롬프트 마크다운 산출:
  - D-POOL-1 Editor Shell Visual System (SandboxPage chrome / TopBar / Catalog·Layers / density 토큰)
  - D-POOL-2 Canvas Direct-Manipulation Polish (Drag ghost / Resize px readout / Multi-select bbox / Snap distance label / Zoom-invariant overlay)
  - D-POOL-3 Inspector + SelectionToolbar + ContextMenu Cluster (3탭 + InspectorControls primitives + 30+ 액션 메뉴)
  - D-POOL-4 Modal·Gallery·Settings System (ModalShell 통일 + SiteSettings 6탭 + 실제 템플릿 썸네일 렌더러)
  - D-POOL-5 ColorPicker·FontPicker Advanced (EyeDropper / WCAG / Recent / Google Fonts 검색)
  - D-POOL-6 Public Widget Visual Polish (BlogPostCard·BlogFeed 4 layout · Button 8 variants · BookingFlowSteps · Forms · FAQ · Columns + widget-tokens)
  - 산출 파일: `CODEX-PROMPT-DESIGN-POOL-{1~6}-*.md` 6개. 사용자가 Codex로 순차/병렬 dispatch 가능.
- 2026-05-01 D-POOL completed prompt follow-up: 완료 보고된 D-POOL 인덱스 기준으로 Canvas direct manipulation/selection UI 디자인 직접 반영. Multi-selection bbox, move/resize readout, selection toolbar visual refresh, context menu density polish 적용; typecheck/lint 통과.
- 2026-05-03 D-POOL Wave 산출 완료: 6 design specialist agent 인라인 회수 패턴(sub-agent Write/Bash 권한 거부 우회)으로 모든 Codex 프롬프트 마크다운 산출 + 메인이 Write 후 python html.unescape 일괄 디코드:
  - `CODEX-PROMPT-DESIGN-POOL-INDEX.md` (251줄) — 디스패치 순서 / 충돌 매트릭스 / 공통 토큰 / 통합 검증
  - `CODEX-PROMPT-DESIGN-POOL-1-EDITOR-SHELL.md` (1151줄) — Editor chrome / TopBar 56px / Rail+Drawer / Rulers·Grid·Zoom Dock / StatusBar 28px / density·theme 토큰 / 7-step commit 분할
  - `CODEX-PROMPT-DESIGN-POOL-2-CANVAS-INTERACTION.md` (1058줄) — DragGhost / ResizeReadout / MultiSelectionBoundingBox / SnapDistanceLabel / CanvasFeedbackOverlay 5 신규 컴포넌트 + Screen-coord overlay + `--canvas-zoom` 1px-stable
  - `CODEX-PROMPT-DESIGN-POOL-3-INSPECTOR-SELECTION.md` (734줄) — InspectorControls primitives 7종 + Inspector 3탭 + SelectionToolbar 다크/blur + ContextMenu macOS-style 33 actions + 6 separators
  - `CODEX-PROMPT-DESIGN-POOL-4-MODAL-SYSTEM.md` (1047줄) — ModalShell 통일 (focus trap / esc / portal / scroll lock) + SiteSettingsModal 6탭 재구성 (general/brand/typography/presets/dark/advanced) + TemplateThumbnailRenderer (HTML scaled mock, WeakMap+Map 캐시, IntersectionObserver lazy)
  - `CODEX-PROMPT-DESIGN-POOL-5-PICKERS-ADVANCED.md` (580줄) — ColorPickerAdvanced (HEX/RGB/HSL + EyeDropper + WCAG contrast + Brand/Theme/Recent grid) + FontPickerAdvanced (검색·6 카테고리·Google Fonts·preview text 커스터마이즈) + 11 importer 무수정 thin wrapper 전략
  - `CODEX-PROMPT-DESIGN-POOL-6-PUBLIC-WIDGETS.md` (1475줄) — widget-tokens.css + hover-states.css + BlogPostCard/BlogFeed 4 layout + Button 8 variants + BookingFlowSteps (counter step + progress bar) + ContactForm floating label + FaqList +↔✕ rotate + Columns + Divider/Spacer/Icon/VideoEmbed
  - 총 6296줄. 사용자가 Codex로 권장 순서 (Wave A: D1·D2·D6 병렬 → Wave B: D5 → D3 → D4 순차) dispatch 가능. 각 트랙 검증·금지범위 명시.

## 2026-05-03 Codex /goal G-Editor 결과

범위:
- M1~M7 완료 커밋: selection/resize/rotate, snap guides, top bar/left rail/context menu, save/undo chips, duplicate/cross-page clipboard, asset library/image edit dialog, version history/publish/SEO.
- M8 추가: `@playwright/test` 도입, `npm run test:builder-editor` 스크립트와 `/ko/admin-builder` Playwright scenario 추가. 단축키 매퍼는 `KeyboardEvent.key` 소문자 정규화로 Cmd/Ctrl+D 같은 modifier 조합을 더 견고하게 처리.

커밋:
- `af65dac` G-Editor: M1 selection resize rotate polish
- `1a608ef` G-Editor: M2 snap guides and spacing chips
- `75fbc4b` G-Editor: M3 Wix editor shell chrome
- `c28e3fc` G-Editor: M4 save and history chips
- `81ac130` G-Editor: M5 duplicate and page clipboard flow
- `6f6b81c` G-Editor: M6 asset library and image edit dialog
- `7fceb40` G-Editor: M7 publish history seo policy

최종 검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warning만)
- `npm run test:unit` ✅ (8 files / 445 tests)
- `npm run security:builder-routes` ✅ (65 files / 56 mutation handlers covered)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warning만)
- `BASE_URL=http://127.0.0.1:3001 BUILDER_SMOKE_TIMEOUT_MS=60000 npm run smoke:builder` ✅ (6/6)
- `BASE_URL=http://127.0.0.1:3001 npm run test:builder-editor` ✅ (1/1)

메모:
- 최종 dev 서버는 3000 점유 때문에 `http://localhost:3001`로 재기동해 검증.
- `Wix 체크포인트.md`는 W02/W04/W06/W07/W08/W10/W11/W18~W23/W26~W30 최신 상태를 업데이트. Green 판정은 문서 규칙상 사용자 직접 클릭 검증 후로 남김.

## 2026-05-03 Codex /goal G-Editor 결과 보강

사용자 검증 피드백 대응:
- `/ko/admin-builder` 첫 진입 시 캔버스가 아래로 밀려 스크롤해야 보이던 문제를 width-fit/panY 보정으로 수정.
- 공개 header/menu 영역 클릭이 페이지 이동하지 않고 Navigation 편집 drawer를 열도록 처리하고, `칼럼` 링크 및 Columns rail/drawer 진입점을 추가.
- `tseng-law.com` 테스트성을 위해 홈 에디터에 칼럼/블로그 진입점을 노출하고 `/ko/admin-builder/columns`, `/ko/columns` 접근을 확인.
- 오피스 Google Map placeholder를 실제 `map` 노드로 승격하고, Content 인스펙터에서 사무소 프리셋/주소/줌을 바로 편집하도록 추가.
- 에디터 hit-test 보강: selected image/container가 앞쪽 텍스트·지도 선택을 가로막지 않도록 selection z-index, node body pointer-events, container child click-through, ContextMenu submenu portal을 정리.

검증:
- `npm run build` ✅ (Google Fonts fetch warning + 기존 `<img>` lint warning만)
- `BASE_URL=http://localhost:3000 ... playwright.config.ts` ✅ (builder-editor 5/5)
- `npm run qa` ✅
  - typecheck ✅
  - lint ✅ (기존 `<img>` warning만)
  - unit ✅ (18 files / 496 tests)
  - security:builder-routes ✅ (71 route files / 61 mutation handlers covered)

운영 메모:
- 사용자 확인용 서버는 최신 build 기반 `next start`로 `http://localhost:3000/ko/admin-builder`에 유지. 현재 로컬 `next dev`는 Next dev vendor chunk/cache 오류가 있어 사용자 검증에는 production server를 사용.
- `/ko/admin-builder`는 기존 사이트 메타가 이미 있으면 매 요청 seed 검사를 건너뛰도록 보강. 최신 `next start`에서 200 응답 약 1.0초 확인.
- `Wix 체크포인트.md`는 W01/W02/W18/W21/W27~W30/W114를 최신 검증 결과로 업데이트. Green 승격은 문서 규칙대로 사용자 직접 클릭·저장·새로고침 검증 후 처리.

## 2026-05-03 Codex /goal G-Editor 검증 안정화

감사 결과:
- 다른 Codex/Claude 세션의 `next dev`/`next build`가 기본 `.next`를 동시에 갱신해, `/ko/admin-builder` HTML은 200이지만 `/_next/static/chunks/webpack-*.js`가 400/text-html로 내려와 hydration 이 깨지는 상태를 확인.
- `next.config.mjs`에 `NEXT_DIST_DIR` 기반 distDir override를 추가하고, 검증 서버는 `.next-g-editor` 격리 build로 실행하도록 보강.
- Playwright admin-builder smoke가 HTML의 webpack runtime chunk를 직접 요청해 `200` + `application/javascript`를 확인하고, browser console/pageerror가 없는지 검사하도록 강화.

검증:
- `NEXT_DIST_DIR=.next-g-editor npm run build` ✅ (Google Fonts fetch warning + 기존 `<img>` lint warning만)
- `NEXT_DIST_DIR=.next-g-editor npm run start`로 `http://localhost:3000` 실행 ✅
- `curl /_next/static/chunks/webpack-*.js` ✅ (`200`, `application/javascript`)
- `curl /ko/admin-builder` ✅ (`200`, 약 2.7초)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts` ✅ (1/1, hydration + chunk MIME + editor smoke)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warning만)

## 2026-05-03 Codex public site restore hotfix

사용자 신고:
- `tseng-law.com/ko` 일반 사이트 본문에 builder published renderer가 끼어들어 이미지 업로드/빌더 UI 흔적처럼 보이고, 원래 public 디자인이 사라진 상태를 확인.

조치:
- 원인: `[locale]/[[...slug]]` catch-all이 legacy 원본 페이지보다 builder published snapshot을 먼저 렌더해, 기본 페이지(`/`, `about`, `services`, `contact`, `lawyers`, `faq`, `pricing`, `reviews`, `privacy`, `disclaimer`)가 builder snapshot에 가로채임.
- 코드 hotfix: legacy에 존재하는 기본 public page는 metadata/body 모두 legacy 렌더를 우선하고, builder published page는 legacy에 없는 커스텀 slug에서만 fallback으로 렌더하도록 변경.
- 로컬 Blob에서는 기본 10개 페이지의 builder `publishedAt` 계열 메타를 백업 후 해제. 백업 key: `builder-site/default/backups/site-before-legacy-unpublish-2026-05-03T0908Z.json`.

검증 메모:
- 실제 `https://tseng-law.com/ko`는 production API 인증이 로컬과 달라 Blob 직접 복구가 적용되지 않았고, 배포 HTML에서 legacy header + builder body 혼합 상태를 확인.
- 이 hotfix가 배포되어야 production에서 기본 public page가 즉시 legacy 원본으로 돌아감.

## 2026-05-03 Codex /goal G-Editor header nav edit 보강

사용자 검증 피드백 대응:
- 상단 public header 메뉴(`홈`, `호정소개`, `업무분야`, `칼럼` 등)가 단순 preview처럼 보이고 직접 편집 대상으로 느껴지지 않는 문제를 보강.
- `SiteHeader`에 builder-editable mode를 추가해 메뉴 링크 클릭 시 페이지 이동 대신 Navigation drawer의 해당 항목 편집 폼으로 바로 포커스.
- NavigationEditor가 기존 `pageId`/다국어 label 구조를 보존하도록 수정하고, 저장 결과가 editor header preview에 즉시 반영되도록 `SandboxPage` nav 상태와 연결.
- header 메뉴 항목 hover/active outline을 추가해 Wix처럼 global header 안의 메뉴 텍스트도 편집 가능한 요소로 인식되게 처리.

검증:
- `NEXT_DIST_DIR=.next-g-editor npm run build` ✅ (Google Fonts fetch warning + 기존 `<img>` lint warning만)
- `NEXT_DIST_DIR=.next-g-editor npm run start`로 `http://localhost:3000` 재기동 ✅
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts` ✅ (1/1, header nav item click → label edit → live preview update → restore)

## 2026-05-03 Codex /goal G-Editor context menu portal 보강

범위:
- 우클릭 ContextMenu를 viewport 기준 fixed portal로 렌더하도록 정리해 canvas clipping/parent overflow에 메뉴가 잘리는 문제를 줄임.
- hover/focus/ArrowRight/Enter/Space에서 submenu 위치를 trigger rect 기준으로 계산하고, submenu도 portal로 유지.
- Playwright의 focus/hover 스크롤 보정에서 context menu가 닫히지 않도록 canvas scroll close 정책을 제거하고 resize close만 유지.
- admin-builder Playwright smoke에 `Hide on viewport` → ArrowRight → `Hide on mobile` submenu 검증을 추가.

검증:
- `npm run typecheck` ✅
- `NEXT_DIST_DIR=.next-g-editor npm run build` ✅
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts` ✅ (1/1, context submenu portal 포함)

## 2026-05-03 Codex production legacy restore 배포 메모

상황:
- 운영 `https://tseng-law.com/ko`가 legacy header는 나오지만 main 본문은 builder published snapshot으로 렌더되어 일반 사이트와 빌더 UI가 섞여 보였음.
- 원인은 `/[locale]/[[...slug]]` production 배포가 아직 builder published 우선 렌더 버전이었고, 로컬 hotfix가 운영에 반영되지 않았기 때문.

조치:
- `112cbe9 G-Editor: restore legacy public pages` 포함 커밋을 기준으로 clean production build가 가능한 누락 파일을 보강:
  - `f3dce66 G-Editor: include deploy dependency files`
  - `93b4d3a G-Editor: commit SEO builder type support`
- Vercel CLI production deploy 완료: `dpl_J2rZEb68EUyQHD9dN6oNvciNaec7`, alias `https://tseng-law.com`.

검증:
- `https://tseng-law.com/ko` HTML 확인 ✅
  - status 200
  - `data-legacy-chrome="true"` true
  - `builder-pub-node` count 0
  - `class="main-nav"` true

## 2026-05-03 Codex /goal G-Editor map/content 검증 보강

범위:
- 사용자가 지적한 "지도도 주소 설정처럼 편집 가능해야 한다" 항목을 Playwright에서 직접 검증하도록 보강.
- `home-offices-layout-0-map` 선택 → Content tab → 주소 textarea 변경 → Google Maps iframe `q` 파라미터 반영 → 원래 주소 원복.
- 사용자가 지적한 "칼럼 콘텐츠가 에디터에 로드되어야 한다" 항목을 Playwright에서 직접 검증하도록 보강.
- 홈 캔버스의 `home-insights-title`, `home-insights-featured-title`, `home-insights-featured-link` 실제 노드가 렌더되는지 확인.
- 이전 실패 테스트가 남긴 로컬 builder navigation label `업무분야 Test`를 guardMutation API(`/api/builder/site/navigation`)로 `업무분야` 복구.

검증:
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts` ✅ (1/1, map address edit + restore, columns content nodes 포함)

## 2026-05-03 Codex /goal G-Editor W30 cross-page paste 보강

범위:
- Pages drawer에서 `1개 요소 클립보드` pill이 보이는 상태로 다른 페이지(`/about`) 이동 후 Cmd+V를 눌러 현재 페이지에 붙여넣는 W30 경로를 Playwright에 추가.
- 원인 분석: Cmd+V 자체는 실행됐지만, 복사한 루트 1개 section의 descendants까지 모두 선택되어 activity chip이 `Pasted 17 items`로 계산되고 top bar도 `17 selected`가 되어 Wix식 `Pasted 1 item` UX와 어긋남.
- `pasteClipboardNodes()`가 pasted root ids만 선택하도록 수정하고, paste activity chip은 clipboard root count 기준으로 표시.
- Pages drawer 포커스가 남아 있어도 Cmd+V가 동작하도록 drawer-open 상태의 native capture shortcut을 추가.
- cross-page child paste 안전성을 위해 clipboard 내부에 없는 parent reference는 paste 시 끊도록 정리.
- Add/Built-in Sections 패널의 확장 카테고리 label/빈 배열 방어 및 cafe gallery template missing helper import를 보강해 admin-builder 초기 렌더 crash를 제거.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts` ✅ (1/1, Pages panel page switch → Cmd+V → `Pasted 1 item` → undo → home restore 포함)

## 2026-05-03 Codex /goal Template Design Expansion 결과

범위:
- Track A: 기존 17개 active page-template 카테고리 170개 파일에 Wix-grade proof/showcase/CTA 확장 섹션을 추가.
- Track B: `BUILT_IN_SECTIONS` 12 → 53, `BUILT_IN_SECTION_CATEGORIES` 6 → 13으로 확장.
- Track C: 신규 active 카테고리 13개 추가(`agency`, `saas`, `nonprofit`, `conference`, `podcast`, `magazine`, `dental`, `yoga`, `portfolio`, `freelancer`, `wedding`, `carrental`, `eventplanner`), 91개 신규 페이지 추가.

결과:
- Page templates: 170 → 261.
- Active categories: 17 → 30.
- Page template nodeCount 실제 registry 기준: min 55 / max 70 / avg 65.1.
- Section templates: 12 → 53.
- Section categories: 6 → 13.
- Registry test에 40~70 node range 및 motion className hint 회귀 테스트 추가.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warning만)
- `npm run test:unit` ✅ (18 files / 685 tests)
- `npm run security:builder-routes` ✅ (71 route files / 61 guarded mutation handlers)
- `npm run build` ✅ (Google Fonts fetch warning + 기존 `<img>` warning만)

주의:
- 현재 worktree는 `main...origin/main [ahead 27]` 및 다른 트랙 변경이 많이 섞인 dirty 상태라, 이 결과는 별도 clean branch에서 분리 커밋하기 전까지 바로 main commit 대상으로 취급하면 안 됨.

## 2026-05-03 Codex /goal G-Editor viewport/content follow-up

범위:
- 사용자가 지적한 `/ko/admin-builder` 첫 화면 오른쪽 잘림을 Playwright screenshot/bounding box로 재현.
- 첫 진입 시 자동 선택을 제거해 Inspector가 처음부터 열리지 않게 하고, 캔버스 폭을 899px → 1219px로 회복한 상태를 확인.
- 캔버스 내부 폭 변화(drawer/inspector open-close)에 맞춰 `ResizeObserver`로 fit zoom을 다시 계산하도록 보강.
- Header `Edit menu` floating badge가 헤더 아래 gap 때문에 사라지는 문제를 헤더 내부 배치 + `focus-within` 유지로 수정.
- 기존 `src/content/columns*` markdown 17개가 builder columns/blog storage에 published fallback으로 보이도록 반영된 상태 확인.
- 기존 markdown 칼럼 edit page 진입 시 Tiptap SSR 500을 `immediatelyRender: false`로 수정하고, 열기만 해도 draft가 생성되지 않는지 확인.
- 실패한 smoke가 남긴 `업무분야 Test` navigation label을 `업무분야`로 원복.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts` ✅ (1/1)
- Playwright layout probe ✅: 1280x800에서 `selected=false`, `canvasColumn.width=1219`, `htmlScrollWidth=1280`
- `/api/builder/columns?locale=ko` ✅: 기존 KO 칼럼 17개 반환
- `/api/builder/columns/{slug}?locale=ko` ✅: `draft=false`, `published=true`

## 2026-05-03 Codex /goal G-Editor columns page 연결

범위:
- 사용자가 지적한 "Pages에 칼럼이 안 떠서 거기로 이동해 글 추가/수정이 안 된다" 문제를 수정.
- `/columns`를 외부 nav 링크가 아니라 실제 builder page seed로 추가해 Pages 패널에서 `칼럼` 페이지가 보이도록 연결.
- 기존 `nav-columns` 항목이 `external-columns`를 가리키던 상태를 실제 columns pageId로 승격하도록 navigation seeding 보강.
- Columns rail에 `Open columns page` 액션을 추가해 에디터 안에서 바로 칼럼 페이지로 이동 가능하게 함.
- 칼럼 페이지 canvas에는 hero + `blog-feed` 노드를 배치해 기존 tseng-law.com 칼럼 17개와 builder 작성 글을 같은 소스로 로드.
- 기존 markdown-backed column edit page의 Tiptap SSR 안정화를 위해 `immediatelyRender: false` 유지.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (19 files / 708 tests)
- `npm run security:builder-routes` ✅ (71 route files / 61 guarded mutation handlers)
- `npm run build` ✅ (Google Fonts fetch warning + 기존 `<img>` warnings only)
- `/ko/admin-builder` authenticated 200 ✅
- `/api/builder/site/pages?locale=ko` ✅: `slug:"columns"` pageId 생성 확인
- `/api/builder/site/navigation?locale=ko` ✅: `nav-columns.pageId`가 실제 columns pageId로 연결됨
- `/api/builder/columns?locale=ko` ✅: 기존 KO 칼럼 17개 반환
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts` ✅ (1/1, Columns admin/edit route 200 + Pages에서 칼럼 페이지 열기 + `columns-feed` 렌더)

## 2026-05-03 Codex /goal G-Editor interaction verification 보강

범위:
- W06 snap engine에 6px tolerance / out-of-range no snap / `24px` spacing guide 단위 테스트를 추가.
- Alignment guide line/chip에 `data-alignment-guide-*` 속성을 추가해 Playwright가 분홍 alignment/주황 spacing guide를 안정적으로 검증할 수 있게 함.
- W07 resize smoke를 실제 SE handle pointer drag로 확장하고, `320 x 200` 형식 floating readout + Shift aspect-ratio 유지 + cursor를 검증.
- W08 rotation drag가 pointer capture에만 의존하지 않도록 window-level move/up listener로 보강하고, Shift 15도 snap degree readout을 Playwright에서 검증.
- Navigation editor 저장 후 PUT 응답을 source of truth로 반영해 header preview가 stale GET에 되돌아가는 race를 방지.
- 메뉴 라벨 편집 smoke가 `업무분야 Test`를 정확히 원복했는지 API와 header text를 모두 검증하도록 강화.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (20 files / 711 tests)
- `npm run security:builder-routes` ✅ (71 route files / 61 guarded mutation handlers)
- `npm run build` ✅ (Google Fonts fetch warning + 기존 `<img>` warnings only)
- `npx vitest run src/lib/builder/canvas/__tests__/snap.test.ts` ✅ (3/3)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts` ✅ (1/1, resize tooltip/Shift ratio + rotate 15도 snap + navigation 정확 원복 포함)
- `/api/builder/site/navigation?locale=ko` ✅: `업무분야` 원복 확인
- 빌드 후 `.next` dev cache를 비우고 `npm run dev` 재시작 ✅: 3000번 `/ko/admin-builder` authenticated 200

## 2026-05-04 Codex /goal G-Editor columns quick access + image workflow 보강

범위:
- 사용자가 지적한 "Pages에 칼럼이 안 떠서 글 추가/수정 위치를 찾기 어렵다" 문제를 다시 보강.
- Pages 패널 상단에 `칼럼` 빠른 이동 카드를 고정 노출하고, `칼럼 페이지로 이동` / `글 추가/수정` 액션을 즉시 보이게 함.
- Columns rail 액션을 한국어(`칼럼 페이지로 이동`, `글 추가/수정`, `공개 칼럼 보기`)로 정리.
- W22 AssetLibrary smoke 추가: 임시 이미지 2개 업로드, 신규 폴더/태그 생성, 검색, 이름 sort, 이미지 노드 교체, undo 원복 검증.
- W23 ImageEditDialog 보강: 우클릭 `Alt 텍스트 편집`은 Alt tab으로 바로 열고, Filter tab preview가 Apply 전에도 실제 필터 CSS를 반영.
- admin-builder smoke의 node 선택/rotate 검증을 좌상단 링크 배지 클릭 충돌 없이 안정화.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (20 files / 711 tests)
- `npm run security:builder-routes` ✅ (71 route files / 61 guarded mutation handlers)
- `npm run build` ✅ (Google Fonts fetch warning + 기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1, Pages `칼럼 빠른 이동` + Columns rail + columns page load)
- `BASE_URL=http://localhost:3000 ... asset-image-workflow.playwright.ts --workers=1` ✅ (1/1)
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --workers=1` ✅ (5/5)
- 빌드 후 `npm run dev` 재시작 ✅: 3000번 `/ko/admin-builder` authenticated 200
- `/api/builder/site/pages?locale=ko` ✅: `slug:"columns"` 유지 확인

남은 gap:
- AssetLibrary folder/tag 분류는 현재 modal local state라 새로고침 후 조직 정보 지속성은 아직 WIP.
- W26~W28은 UI smoke는 있으나 restore/head/publish blocker end-to-end green은 별도 보강 필요.

## 2026-05-04 Codex /goal G-Editor columns canvas manage action 보강

범위:
- 사용자가 지적한 "페이지에 칼럼이 안 떠서 거기로 이동해 글 추가/수정이 어렵다" 문제를 에디터 캔버스에서 다시 보강.
- 칼럼 데이터 자체는 `/api/builder/columns?locale=ko`에서 기존 KO 칼럼 17개가 반환되고 `/ko/columns` 공개 페이지도 렌더됨을 확인.
- 좌측 rail의 Columns 버튼은 접근성 이름은 유지하면서 visual tooltip을 `칼럼`으로 한국어화.
- `columns-feed` 같은 blog-feed 노드 또는 `/admin-builder/columns`로 연결된 칼럼 관리 버튼을 선택하면 Wix식 floating quick action `글 추가/수정` / `공개 보기`가 노드 위에 뜨도록 추가.
- `글 추가/수정` 퀵 액션 클릭 시 실제 `/ko/admin-builder/columns`로 이동하고 기존 칼럼 제목이 보이는지 Playwright에 포함.
- admin-builder smoke의 resize 선택 재시도 로직을 보강해 드래그 후 선택 state race에 덜 흔들리게 함.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (20 files / 711 tests)
- `npm run security:builder-routes` ✅ (71 route files / 61 guarded mutation handlers)
- `npm run build` ✅ (Google Fonts fetch warning + 기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1, columns-feed 선택 → `글 추가/수정` → columns admin list)

## 2026-05-04 Codex /goal G-Editor SEO publish history E2E 보강

범위:
- W26~W28의 "UI는 보이지만 실제 저장/복원/발행이 끝까지 검증되지 않는다" gap을 별도 Playwright E2E로 보강.
- 임시 builder page 생성 → manual revision snapshot → draft 변경 → rollback API → 원본 문서 복원과 backup revision 생성을 검증.
- 빈 alt 이미지 + `javascript:` 링크 draft로 publish preflight를 실행해 warning/blocker 분류와 `publish_blocked` 422 응답을 검증.
- clean draft로 되돌린 뒤 SEO title/description/canonical/OG image PATCH → publish → 공개 `/ko/{slug}` head에 title, meta description, canonical, OG image가 반영되는지 검증.
- 테스트 종료 시 임시 페이지를 삭제하고 leftover `g-editor-w26w28` 페이지가 남지 않는지 확인.

검증:
- `BASE_URL=http://localhost:3000 ... seo-publish-history.playwright.ts --workers=1` ✅ (1/1, W26 rollback + W27 public head + W28 blocker publish gate)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (20 files / 711 tests)
- `npm run security:builder-routes` ✅ (71 route files / 61 guarded mutation handlers)
- `npm run build` ✅ (Google Fonts fetch warning + 기존 `<img>` warnings only)
- `/api/builder/site/pages?locale=ko` cleanup check ✅: leftover `g-editor-w26w28` pages 0

남은 gap:
- W26~W28은 API/public-head E2E green까지 올라왔지만, 사용자가 실제 UI에서 복원/SEO 저장/PublishModal 흐름을 클릭해 green 판정하는 단계는 남아 있음.

## 2026-05-04 Codex /goal G-Editor header edit badge persistence 보강

범위:
- 사용자가 지적한 "상단 메뉴 편집 버튼을 누르러 가면 사라진다" UX를 보강.
- Header navigation drawer가 열린 동안 global header region에 `data-editing` 상태를 부여해 `Edit menu` / `Site settings` badge가 hover와 무관하게 계속 보이도록 함.
- admin-builder smoke에서 메뉴 항목 클릭 → Navigation drawer open → 마우스를 헤더 밖으로 이동한 뒤에도 `Edit menu` 버튼이 보이는지 검증.
- Home 복귀 후 다음 selection/resize smoke가 stale `Loaded page` toast에 의존하지 않도록 `home-hero-subtitle` 실제 렌더 대기를 추가.
- selection smoke helper가 방금 클릭한 노드를 기준으로 핸들을 검증하도록 좁혀 이전 selected node race를 제거.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1, header edit badge persistence + 기존 editor parity smoke)

남은 gap:
- Header/menu 자체는 Navigation drawer에서 편집 가능하지만, public legacy header와 builder header 모델의 완전한 1:1 동기화는 별도 publish-gated 트랙으로 남김.

## 2026-05-04 Codex /goal G-Editor columns + office sync follow-up

범위:
- 사용자가 지적한 "칼럼이 안 뜨고, 거기로 이동해 글 추가/수정하기 어렵다" 흐름을 다시 검증하고 보강.
- `/api/builder/blog/posts?locale=ko&scope=all` 및 `/ko/columns`에서 기존 KO 칼럼 17개가 정상 반환/렌더됨을 확인.
- Columns rail drawer와 Pages 패널 quick card가 실제 칼럼 API를 읽어 `17개 칼럼 연결됨`, 최근 글 링크, `칼럼 페이지로 이동`, `글 추가/수정`, `공개 칼럼 보기`를 즉시 노출하도록 보강.
- `columns-feed` 캔버스가 실제 칼럼 제목을 포함하는지 Playwright에 추가하고, 선택 후 `글 추가/수정` quick action으로 `/ko/admin-builder/columns` 관리자 목록까지 이동 검증.
- 구글 지도 편집 요구 보강: office map 선택 시 `Office sync` 섹션에서 주소/줌/길찾기 URL/전화/팩스/사무소명을 한 번에 수정하고, 주소 변경이 map iframe과 adjacent office card 주소에 동기화되도록 함.
- builder legacy preview/dataset route가 정적 markdown만 읽던 경로를 `getAllColumnPostsIncludingBlob()`로 교체해 builder published/storage 칼럼도 dataset preview에 반영되게 함.
- 칼럼 publish 후 `/ko/columns` 목록 경로도 revalidate하도록 추가.
- RichTextRenderer가 `p/span/h1~h6` 내부에 중첩 `<p>`를 만들던 hydration warning을 `heading` mode로 정리.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1, Columns drawer count/recent links + columns page feed + admin edit route + Office sync)

남은 gap:
- `/ko/columns` 공개 라우트는 concrete route가 우선이라 builder-published `/columns` canvas가 public route를 대체하지는 않음. 현재 목표는 공개 칼럼 route 유지 + builder에서 관리/미리보기 연결.
- builder CMS collection summary 일부는 아직 sync file-reader 기반이라, collection inventory까지 blob-aware로 완전 통합하는 작업은 후속으로 남김.

## 2026-05-04 Codex /goal G-Editor columns discoverability follow-up

범위:
- 사용자가 지적한 "페이지에 칼럼이 안 떠서 이동/글 추가 수정이 어렵다" 흐름을 UX 레벨에서 재보강.
- 좌측 rail의 Columns 버튼을 누르면 drawer만 여는 것이 아니라 실제 `columns` builder page로 즉시 이동하도록 변경.
- Columns drawer와 Pages quick card에 `새 글 쓰기` 진입점을 추가하고, `/ko/admin-builder/columns?new=1` 접근 시 새 칼럼 modal이 바로 열리도록 연결.
- Drawer action link가 버튼처럼 보이도록 `.actionButton` anchor display/padding을 정리.
- admin-builder Playwright에 Columns rail click → `columns-page-title` 로드, `새 글 쓰기` 링크 노출, `?new=1` modal auto-open 검증을 추가.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1)

남은 gap:
- 실제 칼럼 생성/본문 수정/발행은 관리 화면에서 가능하지만, 사용자가 직접 새 글을 만들어 발행해 보는 수동 green 검증은 남아 있음.

## 2026-05-04 Codex /goal G-Editor initial viewport follow-up

범위:
- 사용자가 지적한 "처음 들어가면 아래로 스크롤해야 보인다 / 옆쪽이 짤린다" 문제를 실제 3000번 geometry로 재측정하고 보강.
- `CanvasContainer`의 initial Fit 계산이 넓은 화면에서 100%를 초과해 확대하지 않도록 상한을 추가.
- `SandboxPage`의 canvas column ref를 추가해 active page/slug 전환 시 내부 scrollTop/scrollLeft를 0으로 리셋.
- admin-builder Playwright에 초기 zoom 100% 검증과, canvasColumn을 강제로 아래로 내린 뒤 Columns rail로 페이지 전환하면 scrollTop이 0으로 복귀하는 검증을 추가.
- 1440x900 실측: `window.scrollY=0`, `canvasScrollTop=0`, `zoom=100%`, stage right 1392px < viewport 1440px.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1)

남은 gap:
- 캔버스는 여전히 긴 페이지를 내부 scroll로 탐색하는 구조다. Wix식 bounded viewport + wheel pan 전환은 resize handle 접근성 영향이 커서 별도 설계/검증 후 진행.

## 2026-05-04 Codex /goal G-Editor columns writing UX follow-up

범위:
- 사용자가 지적한 "칼럼 새로 쓰는 게 너무 복잡하다 / 티스토리처럼 글 쓰는 플랫폼이 좋다" 피드백을 반영.
- `새 글 쓰기` modal을 제목 중심 quick start로 단순화: slug/요약/템플릿 선입력 요구 제거, 제목만 입력하면 draft를 만들고 곧바로 editor route로 이동.
- 한국어 제목처럼 ASCII slug를 만들 수 없는 경우도 `post-{timestamp}` slug로 자동 생성.
- 편집 화면을 본문 editor 우선 레이아웃으로 재배치하고, category/author/SEO성 frontmatter는 오른쪽 보조 rail로 이동.
- 목록/검색 요약은 기본적으로 본문 앞부분에서 자동 생성하고, 직접 입력은 접힌 `목록/검색 설명 직접 입력` 설정으로 이동.
- 칼럼 publish 테스트가 public column 발행은 검증하되 테스트 중 `src/content/column-embeddings.json`을 변경하지 않도록 publish route에 `skipEmbeddings=1` 테스트 옵션 추가.
- E2E cleanup을 위해 builder column DELETE가 `includePublished=1`일 때 테스트가 만든 published variant까지 제거하도록 보강. legacy import published column은 삭제 차단 유지.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... columns-ui-workflow.playwright.ts --workers=1` ✅ (1/1, 제목만으로 글 생성 → editor 이동 → 본문 작성 → 자동 요약 저장 → 발행 → public 상세/목록 노출 → cleanup)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1, Columns 진입/새 글 modal 회귀)

남은 gap:
- 티스토리 수준의 이미지 업로드/미디어 삽입, 예약 발행, 태그 자동완성, 글별 slug 재설정 UX는 아직 보조 기능이며 후속 polish 필요.

## 2026-05-04 Codex /goal G-Editor columns media + resize hardening follow-up

범위:
- 칼럼 에디터의 `Image` 버튼을 URL prompt 대신 기존 builder Asset Library에 연결해, 업로드/검색/선택한 이미지를 본문 Tiptap 에디터에 바로 삽입하도록 보강.
- Tiptap `getText()` 저장이 이미지 노드를 버리던 문제를 해결하기 위해 editor JSON을 Markdown으로 직렬화하고, 이미지가 `![alt](builder-asset-url)`로 public column 상세에 렌더되도록 수정.
- `columns-ui-workflow.playwright.ts`가 임시 asset 업로드 → 새 글 작성 → 이미지 삽입 → 저장/발행 → public 상세의 본문 이미지 렌더 → cleanup까지 검증하도록 확장.
- W07 Shift-resize 보강: aspect-ratio resize 중 경계 clamp가 width/height를 따로 잘라 비율을 깨지 않도록 anchor 기반 aspect clamp를 추가.
- SEO/Version history overlay가 선택 toolbar 아래에 깔려 클릭을 빼앗기는 z-index 문제를 보강.
- admin-builder smoke의 selection helper가 selected+handle 노드를 더 안정적으로 잡도록 보강하고, resize 검증 대상은 오른쪽 경계에 붙은 search button 대신 여유 공간이 있는 hero label로 조정.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅
- `BASE_URL=http://localhost:3000 ... columns-ui-workflow.playwright.ts --workers=1` ✅ (1/1, media insert/public render 포함)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1, Shift aspect resize + SEO/History modal click regression 포함)

남은 gap:
- 칼럼 글쓰기 UX는 이미지 삽입까지 좋아졌지만, 태그 자동완성/예약 발행/글별 slug 재설정/드래그앤드롭 블록 편집은 후속 polish로 남음.

## 2026-05-04 Codex /goal G-Editor asset library persistence follow-up

범위:
- W22 남은 약점이던 Asset Library 폴더/태그/asset 분류 local-only 상태를 locale별 `localStorage` persistence로 보강.
- 모달을 닫았다 다시 열어도 사용자가 만든 폴더, 태그, asset별 폴더/태그 분류가 유지되도록 함.
- asset 삭제 시 해당 filename의 persisted folder/tag mapping도 함께 제거.
- `asset-image-workflow.playwright.ts`가 새 폴더/태그 생성 → modal close → image context menu 재오픈 → 폴더/태그 유지 확인까지 검증하도록 확장.
- context menu 재오픈 전 이미지 노드를 명시 클릭해 selection/menu enabled 상태를 안정화.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅
- `BASE_URL=http://localhost:3000 ... asset-image-workflow.playwright.ts --workers=1` ✅ (1/1)

남은 gap:
- 현재 persistence는 브라우저 localStorage 기준이다. 팀 공유/서버 동기화형 asset taxonomy는 별도 storage schema가 필요하므로 후속으로 남김.

## 2026-05-04 Codex /goal G-Editor columns Tistory-style quick writing follow-up

범위:
- 사용자가 다시 지적한 "칼럼 새로 쓰는 게 아직 복잡하다 / 티스토리처럼 바로 글 쓰는 플랫폼이 좋다" 피드백을 반영.
- `/ko/admin-builder/columns?new=1`과 `새 글 쓰기` 버튼이 modal을 열지 않고 즉시 `제목 없는 글` draft를 생성해 editor route로 이동하도록 변경.
- 요약은 계속 본문 앞부분으로 자동 생성하되, 직접 입력 UI는 항상 접힌 `목록/검색 설명 직접 입력`으로 숨김.
- 칼럼 editor toolbar의 개발자식 `HTML` 버튼을 제거하고, `인용/코드/구분선/링크/사진` 중심으로 정리.
- 오른쪽 글 설정 패널은 발행/분류만 기본 노출하고 저자/대표 이미지/SEO/검토는 접힌 패널로 정리.
- admin-builder smoke의 W07 resize 검증 대상도 실제 resize가 안정적으로 일어나는 `home-hero-title`로 보강.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅
- `BASE_URL=http://localhost:3000 ... columns-ui-workflow.playwright.ts --workers=1` ✅ (1/1, `?new=1` direct create → editor → 본문/이미지/발행/public 확인/cleanup)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1, Columns quick links + resize smoke)

남은 gap:
- 사용자가 직접 5분 동안 칼럼 글 작성/이미지 삽입/발행을 만져보고 "블로그 글쓰기처럼 쉽다" 기준을 확인해야 최종 green 처리 가능.

## 2026-05-04 Codex /goal G-Editor W26-W28 UI-click E2E follow-up

범위:
- W26~W28이 API/public-head E2E에 치우쳐 있던 gap을 실제 editor UI 클릭 시나리오로 보강.
- 임시 페이지 생성 후 History 패널을 열고 manual revision 카드 hover diff chip → `이 버전으로 복원` → confirm `복원`까지 실제 클릭으로 검증.
- UI 복원 후 서버 draft revision은 바뀌는데 `SandboxPage`의 `draftMeta`가 갱신되지 않아 바로 발행하면 stale revision 충돌이 날 수 있던 버그를 수정.
- rollback route가 restored `draft` meta를 반환하고 `VersionHistoryPanel`이 `onRestored`로 부모 draft meta/synced timestamp를 갱신하도록 연결.
- SEO 패널에서 title/description/canonical/OG image를 실제 입력/저장하고 API 반영을 확인.
- PublishModal에서 Automatic preflight checklist의 Images/Links/SEO/Forms 카드를 실제 확인하고, warning override가 필요한 경우 클릭 후 발행해 public head/body 반영을 검증.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅
- `BASE_URL=http://localhost:3000 ... seo-publish-history.playwright.ts --workers=1` ✅ (2/2, API E2E + UI-click E2E)

남은 gap:
- W26~W28은 AI Playwright 클릭으로 강해졌지만 체크포인트 Green 승격은 사용자가 실제 브라우저에서 History/SEO/Publish 플로우를 직접 확인한 뒤 처리.

## 2026-05-04 Codex /goal G-Editor W06 nested snap guide follow-up

범위:
- W06 실제 UI-click smoke를 보강하려다 nested canvas node drag에서 alignment guide가 뜨지 않는 결함을 확인.
- 기존 move snap 계산이 active group이 없을 때 root-level node만 비교해, Hero 내부 title/subtitle처럼 같은 parent 안의 sibling과 parent edge를 snap 대상으로 보지 못하던 문제를 수정.
- 단일 nested node 이동 시 같은 parent의 sibling rect와 parent rect를 `computeSnap()` 대상에 포함하도록 `CanvasContainer` drag 계산을 보강.
- admin-builder smoke에 `home-hero-subtitle` 실제 drag → `data-alignment-guide-line` alignment line → spacing px chip 검증을 추가.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅
- `npx vitest run src/lib/builder/canvas/__tests__/snap.test.ts` ✅ (3/3)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1, nested drag alignment guide + spacing chip 포함)

남은 gap:
- 실제 사용자가 여러 섹션/parent 경계에서 자유 드래그해 snap UX가 Wix처럼 편하다고 확인해야 W06 green 처리 가능.

## 2026-05-04 Codex /goal G-Editor verification sweep

검증:
- `npm run test:unit` ✅ (20 files / 711 tests)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)

메모:
- 이번 sweep은 W26~W28 UI-click 보강과 W06 nested snap 보강 이후 넓은 회귀 확인용.
- full goal 완료 판정은 아직 아님. 사용자 5분 직접 검증, green 승격 기준, 그리고 남은 WIP 항목 audit가 필요.

## 2026-05-04 Codex /goal G-Editor layout, columns return path, W29-W30 persistence follow-up

범위:
- 사용자가 지적한 "에디터 첫 화면이 아래로 스크롤해야 나온다 / 사이트 열면 옆쪽이 짤린다" 문제를 반영해 canvas column이 stage 전체 높이만큼 커지는 구조를 수정.
- `.canvasColumn`/`.stageSurface`/`.stageViewport`를 bounded flex layout으로 바꾸고, stage 이동은 바깥 column scroll이 아니라 stage viewport 내부 wheel pan으로 처리.
- page 전환 시 `CanvasContainer`의 viewport pan/zoom을 `activePageId` 기준으로 다시 fit 하도록 `viewportResetKey`를 연결.
- admin-builder smoke가 바깥 canvas column scroll이 생기지 않는지, wheel pan이 stage transform 안에서 일어나는지 검증하도록 갱신.
- 사용자가 지적한 "칼럼 갔다가 편집 홈 메뉴로 돌아가는 장치가 없다" 문제를 반영해 칼럼 목록과 칼럼 작성 화면 상단에 `← 편집 홈` 링크를 추가.
- 칼럼 작성 화면 상단에는 `칼럼 목록` breadcrumb도 함께 노출해 `편집 홈 ↔ 칼럼 목록 ↔ 글 작성` 흐름을 명확히 함.
- W29/W30 persistence 전용 Playwright를 추가해 임시 source/target page 생성 → Cmd+D duplicate +20/+20 저장 → reload 유지 → Cmd+C → target page Cmd+V → +20/+20 저장 → reload 유지를 검증.

검증:
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1, bounded first viewport + internal wheel pan + 기존 editor smoke)
- `BASE_URL=http://localhost:3000 ... columns-ui-workflow.playwright.ts --workers=1` ✅ (1/1, `← 편집 홈`/`칼럼 목록` 링크 + direct create/edit/media/publish/public/cleanup)
- `BASE_URL=http://localhost:3000 ... clipboard-persistence.playwright.ts --workers=1` ✅ (1/1, W29/W30 저장/reload persistence)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅
- `npm run test:unit` ✅ (20 files / 711 tests)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)

메모:
- `npm run build` 후 dev chunk 불일치를 피하려고 기존 3000 dev 서버를 종료하고 build 통과 후 `npm run dev`를 다시 실행함. 현재 `http://localhost:3000/ko/admin-builder`는 local auth 후 200 OK.
- full goal 완료 판정은 아직 아님. 사용자의 실제 5분 자유 검증과 남은 Wix parity audit가 계속 필요.

## 2026-05-05 Codex /goal G-Editor W114 public office map follow-up

범위:
- 사용자가 지적한 "구글 지도도 Wix처럼 주소 설정이 간편하게 편집되고 공개 사이트에 반영돼야 한다" gap을 W114 공개 반영 E2E로 보강.
- 임시 office map 페이지를 생성하고 `home-offices-layout-0-map` 선택 → Content → `Office sync`에서 사무소명/주소/전화/팩스/Google 지도 URL을 직접 입력.
- 편집기 안에서 지도 iframe `q` 파라미터와 adjacent office card 주소가 즉시 동기화되는지 검증.
- draft API에서 map/card/phone/fax/map-link 콘텐츠가 저장됐는지 확인한 뒤 publish route로 발행.
- 공개 `/ko/{slug}`에서 지도 iframe, 사무소 카드 제목/주소/전화/팩스/지도 링크 href까지 발행본에 반영되는지 확인하고 임시 페이지 cleanup.

검증:
- `BASE_URL=http://localhost:3000 ... office-map-public.playwright.ts --workers=1` ✅ (1/1, editor sync + draft persistence + publish + public page reflection)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅

메모:
- 테스트 문서가 컨테이너 필수 content 필드를 빠뜨리면 `normalizeCanvasDocument()`가 sandbox template으로 fallback되는 점을 확인하고, 테스트 fixture를 실제 canvas schema에 맞춰 보정함.
- W114는 public reflection E2E가 추가됐지만, 3개 실제 사무소 탭 전체를 사용자가 직접 저장/publish로 확인하기 전까지 최종 green 승격은 보류.

## 2026-05-05 Codex /goal G-Editor header menu + columns writer UX follow-up

범위:
- 사용자가 지적한 "맨 위 메뉴를 편집하려고 하면 Edit 버튼이 사라진다" 문제를 반영해 Header `Edit menu` badge를 hover-only가 아닌 editor-mode 고정 컨트롤로 변경.
- admin-builder smoke를 보강해 header nav item에서 `Edit menu` 버튼으로 마우스를 이동해도 버튼이 visible 상태로 유지되고, 클릭 시 Navigation drawer가 열리는지 검증.
- header nav item 자체 클릭 시 해당 Navigation edit input이 바로 열리는지도 검증해 메뉴 항목이 편집 불가처럼 보이는 문제를 회귀 방지.
- 사용자가 지적한 "칼럼 새로 쓰기가 복잡하다" 문제를 반영해 칼럼 작성 화면을 writer-first 레이아웃으로 단순화.
- title/body/save/publish는 첫 화면에 남기고, 카테고리/대표 이미지/번역/미리보기는 접힌 `고급 설정` details 안으로 이동.
- editor home Columns drawer와 Pages quick card에서 `새 글 쓰기`를 primary action으로 올리고, 기존 `글 추가/수정` 라벨은 `칼럼 관리`, 최근 글 링크는 `수정 · 제목`으로 명확화.

검증:
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1, header edit badge persistence + nav item edit input + columns label smoke)
- `BASE_URL=http://localhost:3000 ... columns-ui-workflow.playwright.ts --workers=1` ✅ (1/1, direct new post + writer-first collapsed advanced settings + image/publish/public/cleanup)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅

메모:
- `admin-builder.playwright.ts`를 columns workflow와 동시에 돌렸을 때 dev hot compile 중 transient 500/invalid hook call이 한 번 발생했으나, 단독 재실행은 200 + smoke 통과.
- full goal 완료 판정은 아직 아님. 사용자가 실제 5분 동안 header/nav/칼럼 작성 흐름을 직접 검증해야 green 승격 가능.

## 2026-05-05 Codex /goal G-Editor post-UX verification sweep

검증:
- `npm run test:unit` ✅ (20 files / 711 tests)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- build 후 `.next` chunk mismatch를 피하려고 `npm run dev`를 다시 시작했고, `http://localhost:3000/ko/admin-builder`는 local auth 후 200 OK.

메모:
- 이 sweep은 `G-Editor: simplify header and column editing` 이후 전체 unit/build 회귀 확인용.
- full goal 완료 판정은 아직 아님. 사용자 5분 직접 검증과 남은 parity audit가 필요.

## 2026-05-05 Codex /goal G-Editor W10 redo activity chip follow-up

범위:
- Done when 11의 Undo/Redo toast 중 Playwright가 `Undid:`만 확인하고 `Redid:` chip을 덮지 못하던 검증 gap을 확인.
- admin-builder smoke에서 Cmd/Ctrl+D → Cmd/Ctrl+Z `Undid:` → Cmd/Ctrl+Shift+Z `Redid:` → 다시 Cmd/Ctrl+Z restore 순서로 보강.
- redo로 생성된 duplicate는 즉시 다시 undo해 이후 copy/paste smoke가 기존 상태에서 이어지도록 유지.

검증:
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1, `Redid:` activity chip 포함)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)

메모:
- full goal 완료 판정은 아직 아님. 사용자 5분 직접 검증과 남은 parity audit가 필요.

## 2026-05-05 Codex /goal G-Editor column return dock follow-up

범위:
- 사용자가 지적한 "칼럼 간 뒤에 다시 편집 홈 메뉴로 가는 장치가 없다" 문제를 반영.
- 칼럼 목록과 글쓰기 화면 좌하단에 고정 `편집 홈 메뉴` return dock을 추가해 스크롤 위치와 상관없이 `/ko/admin-builder`로 복귀 가능하게 함.
- 글쓰기 화면 dock에는 `칼럼 목록`, 목록 화면 dock에는 `공개 칼럼` 보조 링크를 함께 노출.
- `columns-ui-workflow.playwright.ts`가 글쓰기/목록 양쪽에서 return dock visible/href를 확인하고, 목록 화면에서 실제 클릭 후 `/ko/admin-builder`로 돌아오는지 검증.

검증:
- `BASE_URL=http://localhost:3000 ... columns-ui-workflow.playwright.ts --workers=1` ✅ (1/1, fixed return dock + direct create/edit/media/publish/public/cleanup)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W18/W30에 fixed return dock 검증 메모를 반영.
- full goal 완료 판정은 아직 아님. 사용자가 실제 브라우저에서 칼럼 작성 후 편집 홈 복귀를 직접 확인해야 green 승격 가능.

## 2026-05-05 Codex /goal G-Editor context menu visual audit follow-up

범위:
- Done when 8 audit에서 ContextMenu의 존재/shortcut/submenu는 검증됐지만, Wix식 `white card + pink hover + shortcut chip + divider` 시각 디테일 검증이 약한 점을 확인.
- ContextMenu active/hover token을 파란 accent에서 기존 pink 계열(`rgba(190, 24, 93, ...)`, `#be185d`)로 맞추고, menu/submenu radius를 editor 8px token에 맞춤.
- admin-builder smoke가 ContextMenu 흰 카드, 8px radius, shortcut chip, divider, pink hover background/text를 직접 검증하도록 보강.
- 반복 실행으로 resize 대상이 부모 폭 한계에 도달하면 W07 smoke가 `sizeDelta=0`으로 실패하던 문제를 확인하고, 현재 크기에 따라 grow/shrink를 선택하며 resize 후 undo까지 수행하도록 보강.

검증:
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1, ContextMenu visual assertions + repeatable resize)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W07/W23에 이번 보강 메모를 반영.
- full goal 완료 판정은 아직 아님. 사용자 5분 직접 검증과 전체 HEAD full verification sweep이 남아 있음.

## 2026-05-05 Codex /goal G-Editor W02 hover indicator follow-up

범위:
- Done when 1/W02 audit에서 selected 8 handles는 검증되지만, unselected hover의 얇은 border indicator와 size label 노출 검증이 약한 점을 확인.
- admin-builder smoke에서 `home-hero-subtitle` hover 시 `outline-width: 1px`, Wix blue outline color, node badge opacity `1`, `000×000` size label 형식을 직접 검증하도록 추가.

검증:
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1, hover indicator + existing editor smoke)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W02에 hover indicator 검증 메모를 반영.
- full goal 완료 판정은 아직 아님. 사용자 직접 hover/selection green 검증과 전체 HEAD full verification sweep이 남아 있음.

## 2026-05-05 Codex /goal G-Editor left rail visual coverage follow-up

범위:
- Done when 7 audit에서 64px dark rail과 주요 click flow는 검증되지만, hover label tooltip과 drawer slide/open width 검증이 약한 점을 확인.
- admin-builder smoke가 `Design` rail button hover 시 label text/opacity `1`을 확인하고, click 후 drawer가 `aria-hidden=false`, 300px 이상 폭, `Site settings` 콘텐츠를 갖는지 직접 검증하도록 보강.

검증:
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1, rail hover label + drawer open width + existing editor smoke)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W04에 rail hover/drawer visual coverage 메모를 반영.
- full goal 완료 판정은 아직 아님. 사용자 5분 직접 검증과 전체 HEAD full verification sweep이 남아 있음.

## 2026-05-06 Codex /goal G-Editor scroll/footer stability follow-up

범위:
- 사용자가 지적한 "편집기 내릴 때 렉걸리듯 흔들림"과 "밑에 바닥/footer가 고정되어 많이 올라와 있음" 문제를 재현.
- 1440x1000 실측에서 사이트 footer가 y=606부터 보이며 stage viewport가 439px로 줄어드는 flex shrink 문제를 확인.
- `canvasWrapperStyle`을 고정 높이 flex item으로 바꾸고 `canvasColumn`을 자체 y-scroll 컨테이너로 전환해 footer가 첫 화면 중간에 고정처럼 올라오지 않게 수정.
- wheel pan 중 `stageTransform`의 180ms transition이 입력을 뒤따라오며 흔들리는 문제를 제거하고 `will-change: transform`을 적용.
- 칼럼 목록/글쓰기 복귀 CTA 문구를 `편집기 홈으로 돌아가기`로 명확화해 사용자가 복귀 경로를 더 쉽게 찾도록 보강.
- `design-pool.playwright.ts`의 캔버스 노드 선택 helper를 실제 클릭 가능한 unlocked node 위주로 안정화.

검증:
- 1440x1000 브라우저 실측 ✅: stageViewport 약 805px, site footer top 약 972px, stageTransform transition `none`, canvasColumn overflow-y `auto`
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (1/1, footer/status/layout regression 포함)
- `BASE_URL=http://localhost:3000 ... columns-ui-workflow.playwright.ts --workers=1` ✅ (1/1, 명확화된 복귀 CTA 포함)
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --workers=1` ✅ (5/5)
- `BASE_URL=http://localhost:3000 ... asset-image-workflow.playwright.ts --workers=1` ✅ (1/1)
- `BASE_URL=http://localhost:3000 ... office-map-public.playwright.ts --workers=1` ✅ (1/1)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (20 files / 711 tests)
- `npm run security:builder-routes` ✅
- `BASE_URL=http://localhost:3000 npm run smoke:builder` ✅
- `npm run build` ✅ (Google Fonts stylesheet download warning only)

메모:
- build 후 dev cache가 500을 반환해 기존 dev PID를 종료하고 `npm run dev`를 3000에서 재시작, `/ko/admin-builder` 200 확인.
- tracked builder-editor 전체 파일 묶음은 9/12 통과, `asset-image-workflow`, `design-pool` drag overlay, `office-map-public` published map이 묶음 실행에서만 흔들렸고 각 파일 단독 재실행은 통과. 다음 sweep에서 상태 격리/순서 의존성을 추가 정리 필요.
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W01/W20에 footer/scroll stability 검증 메모를 반영.
- full goal 완료 판정은 아직 아님. 사용자 5분 직접 검증과 tracked builder-editor full sweep 안정화가 남아 있음.

## 2026-05-06 Codex /goal G-Editor tracked sweep stabilization follow-up

범위:
- 묶음 실행에서만 흔들리던 `asset-image-workflow`의 이미지 우클릭 메뉴를 재점검.
- 우클릭 직후 store selection 갱신보다 ContextMenu 렌더가 먼저 일어나면 이미지 전용 액션이 disabled로 뜰 수 있는 race를 확인.
- ContextMenu 액션 판단을 `selectedNodes[0]` 대신 실제 우클릭된 `contextMenu.nodeId` 노드 기준으로 바꿔 `Crop / Filter / Alt`, `이미지 교체`, `Alt 텍스트 편집`이 항상 대상 이미지에 붙도록 수정.
- 공개 지도 반영 검증은 request HTML polling 대신 브라우저 페이지에서 published node가 보일 때까지 재접속하도록 바꿔 dev server/cache 순서 의존성을 줄임.
- build 검증 뒤 dev cache가 다시 500을 반환해 기존 dev PID를 종료하고 `npm run dev`를 3000에서 재시작, `/ko/admin-builder` 200 확인.

검증:
- tracked builder-editor 전체 묶음 12/12 ✅ (`admin-builder`, `asset-image-workflow`, `clipboard-persistence`, `columns-ui-workflow`, `design-pool`, `office-map-public`, `seo-publish-history`)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (20 files / 711 tests)
- `npm run security:builder-routes` ✅
- `npm run build` ✅ (Google Fonts stylesheet download warning only)
- `HEAD /ko/admin-builder` on port 3000 ✅ 200

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W22/W23에 이미지 context menu race 및 tracked full sweep green 메모를 반영.
- full goal 완료 판정은 아직 아님. 사용자 5분 직접 검증과 최종 Wix 1:1 체감 검증이 남아 있음.

## 2026-05-06 Codex /goal G-Editor clipping and persistence follow-up

범위:
- 사용자가 지적한 에디터 우측 잘림을 재현하고, home services 관련 칼럼 링크가 1280 stage 밖으로 배치되는 seed 문제와 node badge overflow를 수정.
- seed home visible nodes가 desktop stage width를 넘지 않는 단위 테스트를 추가.
- SEO 패널 저장 후 오래 걸리는 translations GET/write가 최신 page SEO를 되돌리는 race를 확인하고, site document write를 프로세스 내 직렬화 + 최신 SEO 병합으로 보강.
- `/ko/admin-builder` 진입 직후 홈 draft load가 늦게 끝나면 이미 이동한 페이지 캔버스를 홈으로 덮는 page-switch race를 `activePageId`/locale ref guard로 차단.
- Playwright afterEach reseed가 조용히 timeout되어 뒤늦게 site.json을 덮지 않도록 60초 timeout을 명시하고 실패를 숨기지 않게 조정.

검증:
- tracked builder-editor 전체 묶음 12/12 ✅ (`admin-builder`, `asset-image-workflow`, `clipboard-persistence`, `columns-ui-workflow`, `design-pool`, `office-map-public`, `seo-publish-history`)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (21 files / 712 tests)
- `npm run security:builder-routes` ✅
- `npm run build` ✅ (Google Fonts stylesheet download warning only)
- build 후 `.next` dev chunk mismatch로 dev 500 재현 → dev 종료, `.next` 삭제, `npm run dev` 3000 재시작, 인증 포함 `/ko/admin-builder` 200 확인.

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W01/W14/W27/W28/W114에 클리핑·페이지 전환·SEO 보존·publish/map full sweep 검증 메모를 반영.
- full goal 완료 판정은 아직 아님. 사용자 5분 직접 검증과 최종 Wix 1:1 체감 검증이 남아 있음.

## 2026-05-06 Codex /goal G-Editor completion audit

목표를 완료로 볼 수 있는 구체 기준:
- `/ko/admin-builder` 데스크톱 에디터가 Wix Editor처럼 즉시 보이고, top bar/left rail/canvas/status가 첫 viewport 안에 안정적으로 들어온다.
- W02/W06/W07/W08/W10/W11/W18~W23/W26~W30의 핵심 UI/UX가 실제 클릭/드래그/키보드/발행 경로로 검증된다.
- 사용자가 지적한 회귀: 실제 사이트와 builder publish 혼선, 첫 화면 스크롤, 우측 clipping, header menu edit disappearing, columns 진입/작성/복귀, map/address 편집, SEO/publish race가 재현되지 않는다.
- 검증 명령 `typecheck`, `lint`, `test:unit`, `security:builder-routes`, `build`, tracked builder-editor Playwright bundle이 통과한다.
- 사용자가 직접 5분 자유 사용 후 "Wix처럼 쓸 수 있다"는 체감 검증을 끝낸다.

증거 매핑:
- W02/W06/W07/W08: `tests/builder-editor/admin-builder.playwright.ts`, `tests/builder-editor/design-pool.playwright.ts`, `src/lib/builder/canvas/__tests__/snap.test.ts`가 selection handles, hover indicator, snap guides/chip, resize tooltip/cursor/Shift aspect, rotate chip/Shift snap을 검증.
- W10/W11/W29/W30: `admin-builder.playwright.ts`와 `clipboard-persistence.playwright.ts`가 duplicate, undo/redo chip, cross-page clipboard pill, paste offset, draft persistence를 검증.
- W18/W19: header/nav click capture, pinned `Edit menu`, Columns rail/Pages quick card, nav label edit preview를 `admin-builder.playwright.ts`가 검증.
- W22/W23: `asset-image-workflow.playwright.ts`와 `columns-ui-workflow.playwright.ts`가 Asset Library 검색/정렬/folder/tag 유지, image replace, Crop/Filter/Alt dialog, column body image insertion/public render를 검증.
- W26/W27/W28: `seo-publish-history.playwright.ts`가 version restore UI click, SEO form save/readback, publish preflight, public head/body reflection, stale site write race 방지를 검증.
- 지도/주소: `office-map-public.playwright.ts`가 Office sync 입력, map iframe query, adjacent office card, publish/public reflection을 검증.
- 칼럼: `columns-ui-workflow.playwright.ts`가 `?new=1` direct draft create, writer-first editor, media insert, save, publish, `/ko/columns` list/detail, editor-home return dock을 검증.
- 레이아웃: `admin-builder.playwright.ts`가 top bar 32px policy, rail width/hover label, canvas scroll, footer/status 위치, stage transform transition 제거를 검증. 1440x900 수동 Playwright 치수도 `bodyScroll: 0`, editor shell `900px`, stage viewport visible로 확인.
- 전체 sweep: tracked builder-editor bundle 12/12, `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npm run security:builder-routes`, `npm run build` 모두 최근 green.

아직 완료 선언 불가:
- Done When 17의 사용자 직접 5분 자유 사용 검증은 Codex가 대신 완료할 수 없음.
- Wix 1:1 체감은 screenshot/CSS assertion만으로 green 처리할 수 없어서 W02/W06/W07/W08/W10/W11/W18~W23/W26~W30은 체크포인트에서 사용자 직접 green 대기 상태 유지.
- W19/W20/W21은 editor/public reflection의 핵심 경로는 있으나, 모든 legacy core page를 builder publish로 바꾸는 것은 의도적으로 막아둔 상태다. 실제 `tseng-law.com` 보호를 위해 legacy-first route guard를 유지한다.
- Phase 2+ widget/mobile/bookings는 현재 goal 제외 범위라 green 대상이 아니다.

다음 작업:
- 사용자가 `http://localhost:3000/ko/admin-builder`에서 5분 검증하며 발견한 불일치를 즉시 issue 단위로 재현/수정한다.
- 체크포인트 green 승격은 사용자 검증 문구가 온 뒤 W02/W06/W07/W08/W10/W11/W18~W23/W26~W30부터 순차 반영한다.
- production 반영이 필요한 경우에는 로컬 검증과 별개로 배포/환경 변수/Blob 상태를 별도 확인한다.

## 2026-05-07 Codex /goal G-Editor Site Settings reflection follow-up

범위:
- W21의 약한 근거였던 Site Settings 실제 persistence/public reflection 경로를 보강.
- `/api/builder/site/settings` PUT이 빈 문자열 payload로 기존 firmName/logo/favicon/email/address 등을 지우지 못하던 문제를 수정. Wix처럼 설정 필드를 비우면 실제 저장값에서도 삭제되도록 `mergeSettings`를 추가.
- `design-pool.playwright.ts`에 실제 UI 기반 E2E를 추가: Site Settings modal에서 firm name/phone/email/address/logo/favicon/primary color/body font 변경 → 실제 PUT 200 → editor header preview 반영 → modal 재오픈 readback → 임시 page publish → public HTML/head/header/footer/main style 반영 확인 → 원복/cleanup.
- 이전 실패 테스트가 남긴 로컬 Site Settings 값을 새 clear 동작으로 정리해 dev 데이터 오염을 제거.

검증:
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --grep "persists Site Settings" --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --workers=1` ✅ (6/6)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅
- `npm run test:unit` ✅ (21 files / 712 tests)
- `npm run build` ✅ (Google Fonts stylesheet download warning only)
- build 후 인증 포함 `HEAD /ko/admin-builder` on port 3000 ✅ 200

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W21에 실제 API 저장/공개 반영 E2E와 clear semantics 보강 메모를 반영.
- W21도 사용자 직접 green 검증 전까지 체크포인트 상태는 🟡 WIP 유지.

## 2026-05-07 Codex /goal G-Editor Navigation reflection + local backend guard

범위:
- 사용자가 지적한 "상단 메뉴가 편집되지 않음/실제 사이트가 섞여 바뀐 것 같음" 문제를 다시 추적.
- `npm run dev`가 `.env.local`의 `BLOB_READ_WRITE_TOKEN` 때문에 local runtime-data가 아니라 Vercel Blob을 쓰고 있음을 확인. 이 상태에서는 로컬 검증이 원격 저장소 지연에 흔들리고, 실제 사이트 데이터 오염 위험이 있음.
- `src/lib/builder/site/persistence.ts`에서 dev/test는 기본적으로 local backend를 쓰게 차단. production에서만 Blob을 쓰며, dev에서 꼭 Blob을 쓰려면 `BUILDER_USE_BLOB_IN_DEV=1`을 명시해야 함. `BUILDER_SITE_BACKEND=local` override도 추가.
- `src/app/api/builder/site/navigation/route.ts`에서 Navigation PUT 후 site page 경로와 내부 nav href를 `revalidatePath`로 정리해 공개 header가 저장 직후 최신 navigation을 보도록 보강.
- `design-pool.playwright.ts`에 실제 UI 기반 E2E 추가: 기존 Navigation item 편집 → PUT 200 → API readback → editor header 반영 → 임시 published page public HTML/header 반영 → 원복/cleanup.
- `http://localhost:3000/ko/admin-builder?reseed=1`로 local runtime-data를 재시드해 홈/소개/업무분야/문의/팀/FAQ/칼럼 메뉴를 로컬에 복구.

검증:
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --grep "persists Navigation" --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --workers=1` ✅ (7/7, local backend)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅
- `npm run test:unit` ✅ (21 files / 712 tests)
- `npm run build` ✅ (기존 `<img>` warnings only)
- build 후 인증 포함 `HEAD /ko/admin-builder` on port 3000 ✅ 200

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W18/W19에 실제 UI 저장 + 공개 header 반영 E2E와 dev Blob 차단 메모를 반영.
- 이번 변경은 로컬 검증/개발이 실제 `tseng-law.com` 저장소를 건드리지 않게 하는 안전장치다. production 반영은 별도 배포/환경 검증이 필요.
- W18/W19도 사용자 직접 green 검증 전까지 체크포인트 상태는 🟡 WIP 유지.

## 2026-05-07 Codex /goal G-Editor tracked Playwright stabilization

범위:
- build 후 `.next` 산출물과 dev 서버 chunk가 섞이면 editor shell이 안 뜨는 기존 실패 패턴을 다시 확인. `kill 24940` → `.next` 삭제 → `npm run dev` 3000 재시작 → `/ko/admin-builder` 200 확인.
- local backend가 빨라지면서 Pages 전환 `Loaded page:` toast가 2개 동시에 남을 수 있어 `admin-builder.playwright.ts`의 strict locator를 최신 toast `.last()` 기준으로 안정화.

검증:
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅
- tracked builder-editor Playwright bundle ✅ 14/14:
  `admin-builder`, `asset-image-workflow`, `clipboard-persistence`, `columns-ui-workflow`, `design-pool`, `office-map-public`, `seo-publish-history`

메모:
- build 직후에는 dev 서버를 재시작해야 한다. 최종 현재 상태는 3000번 dev 서버 실행 중이며 `/ko/admin-builder` 200.

## 2026-05-07 Codex /goal G-Editor W11 save chip evidence follow-up

범위:
- W11 자동 저장 상태 표시의 검증 근거가 약해 `Saving|Saved` 텍스트 proxy 대신 좌하단 floating chip 자체를 검증하도록 보강.
- `SandboxPage` save status chip에 `data-save-status-chip` / `data-save-status-glyph`를 추가.
- `admin-builder.playwright.ts`에서 resize 편집 직후 좌하단 `Saving…` chip, 회색 glyph(`rgb(148, 163, 184)`), 저장 완료 후 `Saved` chip, 녹색 체크 glyph(`rgb(34, 197, 94)`)를 직접 확인.
- local backend가 빨라질 때 stale selected node가 handle 없는 상태로 남는 smoke race를 줄이도록 `expectSelectedNodeHandles` helper를 보강.

검증:
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅
- tracked builder-editor Playwright bundle ✅ 14/14
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅
- `npm run test:unit` ✅ (21 files / 712 tests)
- `npm run build` ✅ (기존 `<img>` warnings only)
- build 후 `.next` 삭제 + `npm run dev` 3000 재시작, 인증 포함 `HEAD /ko/admin-builder` ✅ 200

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W11에 좌하단 chip/glyph 직접 검증 메모를 반영.
- W11도 사용자 직접 green 검증 전까지 체크포인트 상태는 🟡 WIP 유지.

## 2026-05-07 Codex /goal G-Editor W20 global footer reflection

범위:
- Global Header/Footer editor가 120px/240px급 짧은 shared canvas를 써야 하는데 공용 canvas schema가 `stageHeight < 400`을 reject해 저장 시 기본 sandbox canvas로 fallback할 수 있던 문제를 수정.
- `builderCanvasDocumentSchema.stageHeight` 최소값을 64로 낮춰 header/footer draft가 실제 높이 그대로 normalize/save되게 함.
- `/api/builder/site/header/draft`, `/api/builder/site/footer/draft` PUT 후 site pages/internal nav href를 `revalidatePath` 처리해 public 페이지가 저장 직후 shared header/footer 변경을 보게 보강.
- `design-pool.playwright.ts`에 Global Footer 실제 저장/공개 반영 E2E 추가: 132px footer canvas PUT → API response가 같은 text/stageHeight 저장 확인 → 임시 published page 2개에서 `footer[data-builder-global-section="footer"]`에 같은 text 렌더 확인 → 원복/cleanup.
- Site Settings public footer 테스트는 Global Footer가 있으면 legacy footer가 대체되는 정상 동작과 충돌하므로, 테스트 동안 Global Footer를 비우고 끝나면 원복하도록 격리.
- `admin-builder.playwright.ts` 선택 핸들 helper가 전역 `[data-node-id]` 대신 `Canvas editor` role 내부 node만 잡도록 범위를 좁혀 Pages drawer/public node와 섞이는 flake를 제거.

검증:
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --grep "Global Footer" --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --workers=1` ✅ (8/8)
- tracked builder-editor Playwright bundle ✅ 15/15
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅ (71 files / 61 mutation handlers)
- `npm run test:unit` ✅ (21 files / 712 tests)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- build 후 `.next` 삭제 + `npm run dev` 3000 재시작, 인증 포함 `HEAD /ko/admin-builder` ✅ 200

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W20에 짧은 global footer 저장/두 published page 반영 E2E와 header/footer revalidate 보강 메모를 반영.
- W20도 사용자 직접 green 검증 전까지 체크포인트 상태는 🟡 WIP 유지.

## 2026-05-07 Codex /goal G-Editor W09 delete persistence evidence

범위:
- W09 Delete/Backspace 동작은 기존 store/shortcut 경로가 있었지만 브라우저 검증 근거가 약해 실제 UI E2E를 추가.
- `clipboard-persistence.playwright.ts`에 leaf node 삭제 검증 추가: 임시 page 생성 → canvas node 선택 → Delete로 삭제 → draft API에서 제거 확인 → Cmd/Ctrl+Z 복원 → Backspace 삭제 → reload 후 DOM에서 삭제 유지.
- 같은 파일에 container cascade 검증 추가: Layers 패널에서 parent container 선택 → Delete → parent와 child는 draft/DOM에서 제거되고 sibling은 유지 → undo 후 parent/child/sibling 복원 → reload 후 유지 확인.
- 테스트 mutation helper가 local guard rate-limit에 흔들리지 않도록 test별 `x-forwarded-for` header와 429 Retry-After 재시도를 추가. 같은 active page를 다시 선택할 때 `Loaded page:` toast가 생략되는 정상 케이스도 허용.

검증:
- `BASE_URL=http://localhost:3000 ... clipboard-persistence.playwright.ts --grep "Delete and Backspace" --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... clipboard-persistence.playwright.ts --grep "selected containers" --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... clipboard-persistence.playwright.ts --workers=1` ✅ (3/3)
- tracked builder-editor Playwright bundle ✅ 17/17
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅ (71 files / 61 mutation handlers)
- `npm run test:unit` ✅ (21 files / 712 tests)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- build 후 `.next` 삭제 + `npm run dev` 3000 재시작, 인증 포함 `HEAD /ko/admin-builder` ✅ 200

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W09에 Delete/Backspace/descendant cascade/undo/reload 검증 메모를 반영.
- W09도 사용자 직접 green 검증 전까지 체크포인트 상태는 🟡 WIP 유지.

## 2026-05-07 Codex /goal G-Editor W15 real blank page

범위:
- Pages → + New → `빈 페이지`가 실제로는 API fallback 때문에 `createDefaultCanvasDocument()`의 기본 샌드박스 텍스트/버튼/이미지로 시작하던 문제를 수정.
- `createBlankCanvasDocument(locale)`를 추가하고 `/api/builder/site/pages` POST가 `blank: true`를 받으면 `nodes: []` draft를 저장하게 함.
- `PageSwitcher`의 blank card 생성 경로가 `document` 없이 fallback에 맡기는 대신 `blank: true`를 전송하도록 수정.
- `design-pool.playwright.ts`에 실제 UI E2E 추가: Pages rail → + New → 빈 페이지 → slug 입력 → 생성 → empty canvas 안내 표시 → canvas `[data-node-id]` 0개 → draft API `nodes: []` 확인 → cleanup.

검증:
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --grep "real blank page" --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --workers=1` ✅ (9/9)
- tracked builder-editor Playwright bundle ✅ 18/18
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅ (71 files / 61 mutation handlers)
- `npm run test:unit` ✅ (21 files / 712 tests)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- build 후 `.next` 삭제 + `npm run dev` 3000 재시작, 인증 포함 `HEAD /ko/admin-builder` ✅ 200

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W15에 실제 blank create + draft empty 검증 메모를 반영.
- W15도 사용자 직접 green 검증 전까지 체크포인트 상태는 🟡 WIP 유지.

## 2026-05-07 Codex /goal G-Editor W03 inline text editing

범위:
- 텍스트/heading 노드 더블클릭 시 TipTap inline editor가 Wix처럼 캔버스 위에서 바로 열리도록 기존 경로를 안정화.
- `.nodeBody` overflow 때문에 floating format toolbar가 잘리던 문제를 수정해 편집 중 toolbar가 노드 밖으로 떠서 보이게 함.
- 인라인 편집 중에는 8 resize handle과 SelectionToolbar가 숨겨지고, inline text toolbar만 보이도록 `CanvasNode` → `CanvasContainer` 편집 상태 전파를 추가.
- `InlineTextEditor`에 안정적인 `data-builder-inline-text-*` hook을 추가하고, 동일 content blur/unmount 중복 저장을 signature 기반으로 막아 undo history churn을 줄임.
- `inline-text-editor.playwright.ts` 추가: 임시 page 생성 → text node 선택/8 handles 확인 → 더블클릭 inline editor/toolbar 표시 → 편집 중 handles/SelectionToolbar 숨김 → 텍스트 입력/Escape 저장 → draft API `text` + `richText.plainText` 저장 확인 → undo/redo → reload 후 유지.
- `office-map-public.playwright.ts`는 전체 회귀 중 임시 page가 Pages 패널에 늦게 반영되는 flake가 확인되어, 다른 테스트들과 동일하게 mutation header/rate-limit retry/page drawer reload retry를 적용.

검증:
- `BASE_URL=http://localhost:3000 ... inline-text-editor.playwright.ts --workers=1` ✅ (1/1)
- `BASE_URL=http://localhost:3000 ... office-map-public.playwright.ts --workers=1` ✅ (1/1)
- tracked builder-editor Playwright bundle ✅ 19/19
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅ (71 files / 61 mutation handlers)
- `npm run test:unit` ✅ (21 files / 712 tests)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- build 후 `.next` 삭제 + `npm run dev` 3000 재시작, 인증 포함 `HEAD /ko/admin-builder` ✅ 200

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W03에 inline editor/toolbar/handles hidden/save/undo/redo/reload E2E 메모를 반영.
- W03도 사용자 직접 green 검증 전까지 체크포인트 상태는 🟡 WIP 유지.

## 2026-05-07 Codex /goal G-Editor W12 map inspector editing

범위:
- generic `map` component Inspector에 `data-builder-map-inspector` hook과 `Map address`/`Map zoom` 접근성 label을 추가해 Playwright와 실제 사용자가 주소/줌 입력을 명확히 잡을 수 있게 함.
- `/ko/admin-builder?pageId=...` direct-load를 지원해 칼럼/폼/테스트 등 다른 admin 화면에서 특정 page 편집기로 복귀할 때 홈 page가 아니라 해당 page draft를 바로 열게 함.
- direct-load에서 non-home blank page를 home seed로 덮지 않도록 home page에만 reseed 조건을 적용하고, canvas가 없는 non-home page는 blank document로 초기화.
- `office-map-public.playwright.ts` 보강:
  - generic map 임시 page 생성 → `pageId` direct-load → Layers에서 map 선택 → Content inspector → 주소/줌 수정 → iframe query 반영 → draft API 저장 → reload 유지.
  - office map sync 테스트는 Pages panel 전환 경로를 유지해 publish metadata race를 피하면서, Layers 선택으로 nested map을 안정적으로 선택.

검증:
- `BASE_URL=http://localhost:3000 ... office-map-public.playwright.ts --workers=1` ✅ (2/2)
- tracked builder-editor Playwright bundle ✅ 20/20
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅ (71 files / 61 mutation handlers)
- `npm run test:unit` ✅ (21 files / 712 tests)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- build 후 `.next` 삭제 + `npm run dev` 3000 재시작, 인증 포함 `HEAD /ko/admin-builder` ✅ 200

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W12에 generic Google map Content inspector 주소/줌 저장/리로드 검증 메모를 반영.
- W12도 사용자 직접 green 검증 전까지 체크포인트 상태는 🟡 WIP 유지.

## 2026-05-07 Codex /goal G-Editor W14 duplicate page slug guard

범위:
- Pages 새 페이지 생성 API가 같은 locale/slug로 중복 page를 만들 수 있던 문제를 차단.
- `/api/builder/site/pages` POST에서 기존 site document의 같은 locale/slug를 먼저 검사하고, 중복이면 기존 `pageId`와 함께 `409 duplicate_slug`를 반환하게 함.
- `linkedFromPageId` 생성 경로의 local 변수 충돌을 정리해 site document readback과 linked page 생성이 같은 route 안에서 안전하게 공존하도록 함.
- `design-pool.playwright.ts`에 API 회귀 테스트 추가: blank page 생성 → 같은 slug 재요청 → 409 확인 → pages 목록에 하나만 존재 → 기존 blank draft `nodes: []` 보존 → cleanup.

검증:
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --grep "duplicate page slugs" --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --workers=1` ✅ (10/10)
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts -g "persists Navigation edits" --workers=1` ✅ (locale-prefixed mega href guard 후 재검증)
- tracked builder-editor Playwright bundle ✅ 21/21
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅ (71 files / 61 mutation handlers)
- `npm run test:unit` ✅ (21 files / 712 tests)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- build 후 `.next` 삭제 + `npm run dev` 3000 재시작, 인증 포함 `HEAD /ko/admin-builder` ✅ 200

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W14에 duplicate slug 409 방어와 기존 draft 보존 검증 메모를 반영.
- W14도 이름 변경/삭제 전체 CRUD와 사용자 직접 green 검증 전까지 체크포인트 상태는 🟡 WIP 유지.

## 2026-05-07 Codex /goal G-Editor W12 inspector and canvas scroll stabilization

범위:
- 우측 Inspector를 selection이 없을 때도 Wix처럼 고정 column으로 유지하고, empty state를 명확히 표시하도록 변경.
- Layout Width 입력을 실제 캔버스 node width에 반영하는 회귀 테스트를 추가해 “선택해야만 패널이 생김/사라짐” UX를 막음.
- 캔버스 세로 wheel을 transform pan으로 처리하던 경로를 제거하고 실제 scroll container가 움직이게 변경해, 스크롤 중 화면이 흔들리거나 하단 footer가 고정 바닥처럼 올라오는 현상을 수정.
- stage viewport 높이를 zoom된 page height에 맞춰 확장하고, ResizeObserver는 width 변화 때만 fit을 재계산하도록 제한해 scroll/fit feedback loop를 차단.
- site document write 경합에서 stale writer가 최신 page를 누락시키지 않도록 기본 write에 missing page merge를 추가하고, 실제 delete 경로만 merge를 끄도록 분리.
- Playwright 회귀를 최신 UX에 맞게 갱신: inspector empty state, Layout Width 편집, real scroll, cross-page clipboard persistence, office/generic map direct-load 안정화.

검증:
- tracked builder-editor Playwright bundle ✅ 21/21
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅ (71 files / 61 mutation handlers)
- `npm run test:unit` ✅ (21 files / 712 tests / 712 passed)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- build 후 `.next` 삭제 + `npm run dev` 3000 재시작, 인증 포함 `HEAD /ko/admin-builder` ✅ 200

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W01/W12/W20에 inspector 고정, Layout 편집, 실제 세로 스크롤/하단 footer 고정감 제거 검증 메모를 반영.
- 다음 작업은 사용자가 지적한 원본 홈페이지 재현도 gap: 검색창 위치, 원래 홈 섹션/기능 누락, 공개 사이트와 빌더 seed/decomposition 불일치 비교 감사.

## 2026-05-07 Codex /goal G-Editor W01 homepage parity follow-up

범위:
- 사용자가 지적한 원본 홈 불일치 1차 수정: hero 검색창을 static `div` placeholder가 아니라 실제 `form[action="/ko/search"][method="get"]` + `input[type="search"][name="q"]` + `button[type="submit"]` 구조로 변경.
- `home-hero-search-placeholder`를 `home-hero-search-input`으로 승격하고, 기존 저장된 home draft도 로드 시 자동 마이그레이션하도록 `upgradeHeroSearchForm` 추가.
- 에디터 stage 안에서 public `.hero`의 negative margin/header padding이 canvas 좌표를 밀어 올리던 문제를 stage-local CSS로 차단해 검색창이 hero bottom을 정확히 걸치게 조정.
- 홈 insights seed가 `insightsArchive` 대신 legacy 홈과 같은 `getAllColumnPosts(locale)` 소스를 쓰도록 변경하고, page indicator를 실제 `1 / 6` 형태로 반영.
- 기존 저장 문서도 `home-insights-*` 텍스트/이미지/링크를 현재 칼럼 source로 보정하도록 `upgradeHomeInsightsSource` 추가.
- services 섹션을 legacy 홈과 맞춰 `section--light` + `id="practice"`로 보정하고, 기존 저장 문서도 자동 마이그레이션.
- 공개 `/ko`가 builder snapshot으로 섞이지 않고 legacy home chrome/search를 유지하는 회귀 assertion 추가.

검증:
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅
- tracked builder-editor Playwright bundle ✅ 21/21
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅ (71 files / 61 mutation handlers)
- `npm run test:unit` ✅ (21 files / 712 tests)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- build 후 `.next` 삭제 + `npm run dev` 3000 재시작, 인증 포함 `HEAD /ko/admin-builder` ✅ 200

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W01에 hero search form/input/submit, search bottom-overlap geometry, public legacy home guard, insights column source, services `#practice` 보정 메모를 반영.
- 남은 gap: hero quick menu focus state, header search overlay, insights carousel/FAQ/office tabs 같은 stateful legacy behavior는 아직 static decomposition에 가까움. 다음 패스에서 component-backed 또는 explicit state 편집 surface로 전환 필요.

## 2026-05-07 Codex /goal G-Editor W01/W19 homepage function parity follow-up

범위:
- 에디터 공유 Header를 원본 공개 사이트에 가까운 구조로 재작성: utility row, 로고, public nav labels/order, header search button, CTA, 업무분야/미디어 mega menu를 `SiteHeader` 안에서 렌더.
- 기존 저장 site document에 공개 Header nav 항목(업무분야/변호사소개/비용안내/호정칼럼/미디어센터/고객후기)이 빠져 있으면 로드 시 자동 보정하도록 `upgradePublicHeaderNavigation` 추가.
- Hero search 아래 원본 quick menu를 별도 편집 노드로 seed/upgrade해 업무분야/칼럼/연락처 등 빠른 진입 기능이 canvas에서 보이고 선택 가능하게 함.
- 에디터 stage 안에서는 방문자용 아코디언 CSS에 의해 숨겨지던 서비스 상세/FAQ 답변을 펼쳐 보여 원본 기능 텍스트가 편집 가능한 노드로 노출되게 함.
- Header brand/search action 클릭은 global header selection capture가 가로채지 않도록 예외 처리해, 검색 오버레이와 메뉴 편집 진입이 동시에 동작하게 조정.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --workers=1` ✅ (10/10)

메모:
- `/ko/admin-builder` 3000번 dev 서버 기준 Header y=32/h=90, canvas first y=124로 첫 화면 밀림은 재발하지 않음.
- admin-builder smoke가 header search overlay, hero search bottom-overlap geometry, quick menu, services detail, FAQ answer, header Edit menu hover/click persistence를 직접 검증.
- 남은 parity gap은 원본의 stateful carousel/office tabs/메가 메뉴 편집 표면을 “항상 보이는 편집 surface”와 “방문자 동작 preview”로 분리하는 작업.

## 2026-05-07 Codex /goal G-Editor W01 homepage full-draft restore

범위:
- `/ko/admin-builder` home page draft가 예전 Phase 1 sandbox 샘플(`headline-1`, `support-copy-1`, `cta-button-1`, `hero-image-1`)로 남아 있으면 실제 home seed로 자동 복구하도록 reseed 조건 보강.
- 칼럼/인사이트 섹션이 첫 3개만 보이는 정적 상태에 머물지 않도록, pagination 뒤쪽 칼럼들도 `home-insights-item-*` 캔버스 노드로 전부 생성하고 섹션 높이를 늘림.
- 기존 저장된 home draft도 insights height 증가에 맞춰 뒤 섹션 root y와 stageHeight를 자동 보정해 섹션 겹침 없이 마이그레이션.
- full homepage seed가 534개 노드가 되면서 기존 `nodes <= 500` validation에 걸려 sandbox fallback 되던 문제를 해결하기 위해 canvas document node 한도만 1000으로 상향.
- admin-builder smoke에 늦은 칼럼 노드(`home-insights-item-5-title`)와 insights/services section flow geometry assertion 추가.

검증:
- 3000 dev server 재시작 ✅
- Playwright 실측: `[data-node-id]` 534개, first node `home-hero-root`, `home-insights-item-5-title` 존재, services top >= insights bottom ✅
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --workers=1` ✅ (10/10)

메모:
- 사용자가 본 “원래 홈페이지가 아니라 테스트용 캔버스처럼 뜸”의 직접 원인은 home draft가 legacy sandbox sample로 저장돼 있었고, 큰 home seed가 500 node schema limit 때문에 normalize fallback으로 다시 sandbox가 됐던 조합.
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W01에 full homepage draft restore, 534 node seed, late insights node, schema node limit 상향 메모를 반영.

## 2026-05-08 Codex /goal G-Editor W01/W18/W19 header mega + search state follow-up

범위:
- Header mega menu 링크를 hardcoded render 전용 데이터가 아니라 `BuilderNavItem.children` 기반 편집 대상으로 승격.
- 저장된 site document의 업무분야/미디어센터 nav item에 누락된 mega child 항목을 자동 병합하고, Navigation drawer에서 `Mega` child row를 직접 수정할 수 있게 함.
- Header mega child 클릭 시 해당 child nav item의 label/href edit form으로 포커스되게 연결하고, nested nav href도 navigation 저장 후 revalidate 대상에 포함.
- 원본 `HeroSearch`와 맞지 않게 첫 화면부터 항상 펼쳐져 있던 hero quick menu를 기본 숨김으로 바꾸고, 검색 영역 hover/focus 또는 해당 노드 선택 시에만 보이게 조정.
- Canvas node wrapper에 `data-selected` hook을 추가해 선택된 child/dropdown state를 CSS에서 안정적으로 노출 가능하게 함.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --workers=1` ✅ (10/10)
- Playwright 실측: `/ko/admin-builder` 첫 화면에서 `home-hero-quick-menu` display `none`, `home-hero-search-wrap` hover 후 display `block` ✅
- Playwright 실측: 공개 `/ko`는 `scrollWidth=1440`, `hero-search-bar overlap`/legacy header 렌더 유지, horizontal overflow 없음 ✅

메모:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` W01/W18/W19에 2026-05-08 follow-up 메모를 추가.
- 남은 원본 홈페이지 parity gap은 stateful behavior의 편집/방문자-preview 분리: insights pagination 실제 조작, office tabs active state, service/FAQ accordion state를 원본 component-backed preview와 editable node surface 사이에서 일관되게 연결해야 함.

## 2026-05-08 Codex /goal G-Editor W01 office map + home stateful parity follow-up

범위:
- 홈 insights 섹션을 원본 `InsightsArchiveSection` 초기 상태에 맞춰 대표 글 1개 + 우측 목록 3개 + `1 / n` indicator 구조로 축약하고, 기존 draft의 오래된 `home-insights-item-3+` 노드는 로드 시 제거하도록 보정.
- 오시는길 seed를 원본 `OfficeMapTabs`처럼 한 사무소 레이아웃만 보이는 탭형 높이로 재구성. 타이중/가오슝/타이베이 layout은 같은 위치에 겹쳐 두고, 선택된 탭/지도 descendant 기준으로 해당 레이아웃만 노출.
- 지도 노드 선택 시 캔버스 위에 `Google Map · 위치 편집` 퀵 패널을 띄워 타이중/가오슝/타이베이 프리셋 전환 및 주소 직접 입력을 지원. 변경 시 map address, 사무소명, 카드 주소, 전화 href, 길찾기 URL을 같이 동기화.
- admin-builder smoke에 insights 3-item 상태, stale item 제거, 지도 quick edit 지역 전환, 기존 inspector Office sync 경로를 회귀 검증으로 추가.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit -- src/lib/builder/canvas/__tests__/seed-home-layout.test.ts` ✅

메모:
- 사용자가 지적한 "지도 눌러서 다른 지역으로 바꾸는 게 간편하지 않음"은 inspector-only 흐름이 원인이었고, 이번 패스에서 캔버스 직접 quick edit로 보강.
- 남은 원본 홈페이지 parity gap은 services/FAQ accordion의 방문자 상태 preview와 builder edit surface 분리, 칼럼 목록 페이지/글쓰기 화면의 티스토리식 작성 UX 추가 개선.

## 2026-05-08 Codex /goal G-Editor map quick edit usability follow-up

범위:
- 모든 `map` 노드에 캔버스 상시 quick edit 패널을 노출해 지도 노드를 정확히 선택하지 않아도 타이중/가오슝/타이베이 프리셋, 주소 적용, 줌 +/-를 바로 조작 가능하게 함.
- 사무소 지도 프리셋은 기존처럼 지도 주소, 사무소명, 카드 주소, 전화 href, 길찾기 URL을 함께 동기화하고, 프리셋 버튼 조작 시 지도 노드 선택 상태도 같이 맞춤.
- 일반 map 노드도 quick panel에서 주소 입력 후 `주소 적용`, 줌 버튼 변경 → iframe query/draft 저장/reload 유지까지 검증.
- 지도 edit-mode overlay 문구를 `Map · 위치 변경`으로 바꿔 inspector-only 흐름처럼 보이지 않게 조정.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... office-map-public.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅

메모:
- controlled textarea가 quick panel 안에서 React rerender와 충돌해 입력값이 되돌아가는 케이스가 있어, 주소 필드는 비제어 입력 + `주소 적용`/blur commit 구조로 바꿈.
- 컨테이너 pointer-event를 전역으로 풀면 아래 섹션이 위 섹션 hover를 가로채는 회귀가 생겨, 기존 hit-test 정책은 유지하고 지도 자체 quick panel을 상시 노출하는 방식으로 해결.

## 2026-05-08 Codex /goal G-Editor columns writer simplification follow-up

범위:
- 칼럼 새 글 화면의 첫 작성면을 티스토리식으로 단순화: 제목 입력 → 툴바 → 본문 에디터가 바로 이어지게 하고, 목록/검색 요약 입력은 본문 아래 선택 설정으로 이동.
- 요약 설정 summary에는 `본문 앞부분으로 자동 생성` 상태를 보여 사용자가 요약을 반드시 써야 하는 화면처럼 보이지 않게 조정.
- 기존 자동 요약 저장 로직은 유지해 제목/본문만 작성해도 칼럼 목록 summary가 본문 앞부분으로 저장됨.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 ... columns-ui-workflow.playwright.ts --workers=1` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅

메모:
- 칼럼 목록/글쓰기의 편집 홈 복귀 dock과 `?new=1` quick start는 기존 구현/테스트가 유지됨.

## 2026-05-08 Codex /goal G-Editor public floating chrome follow-up

범위:
- 공개 사이트에 있던 우측 플로팅 기능이 에디터에서 빠져 보이는 문제를 줄이기 위해 admin-builder 캔버스 하단에 공개 플로팅 도구 preview/edit dock을 추가.
- dock에는 `AI 상담`, `상단`, `2026 EVENT`가 표시되고, 이벤트/AI 버튼은 해당 공개 기능 설명 popover를 열며 `사이트 설정`, `칼럼 관리`로 바로 이동 가능.
- 실제 public layout 컴포넌트를 admin-builder에 직접 섞지 않아 공개 `/ko` 레이아웃과 builder editor 레이아웃이 서로 오염되는 회귀를 피함.
- admin-builder smoke에 공개 플로팅 도구 노출, 이벤트 popover, AI popover 검증을 추가.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... office-map-public.playwright.ts --workers=1` ✅

메모:
- 지도는 이전 follow-up의 quick panel 경로를 그대로 재검증했고, generic map 주소/줌 변경과 사무소 지도 공개 반영 시나리오가 모두 통과.
- 남은 원본 홈페이지 parity gap은 services/FAQ accordion visitor preview, office tab active preview, insights pagination 실제 조작, header/nav의 edit/preview mode 분리.

## 2026-05-08 Codex /goal G-Editor home insights quick actions follow-up

범위:
- 홈 `칼럼 아카이브` 섹션의 하위 노드를 선택하면 즉시 `글 추가/수정`, `새 글`, `공개 보기` quick actions가 뜨도록 확장.
- 기존 `blog-feed`/columns link 전용 quick action을 정적 home insights 노드 전체에도 적용해, 사용자가 홈 화면에서 칼럼 영역을 눌렀을 때 바로 글 작성·수정 경로를 찾을 수 있게 함.
- admin-builder smoke에 홈 칼럼 아카이브 선택 → quick actions 노출 검증 추가.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅

메모:
- hero quick menu 검증 전에 선택/focus/hover 상태를 명시적으로 정리해, 의도된 selected/focused state 노출과 기본 hidden state 검증이 섞이지 않게 테스트 안정화.

## 2026-05-08 Codex /goal G-Editor services FAQ preview state follow-up

범위:
- 홈 업무분야/FAQ 섹션을 에디터에서 전부 펼친 정적 상태로 두지 않고, 원본 아코디언처럼 preview-open 상태를 갖도록 보강.
- 기본 상태는 첫 업무/첫 FAQ가 열리고, 다른 업무/FAQ 항목을 선택하면 해당 항목의 상세/답변만 열리도록 `data-builder-preview-open` 상태를 CanvasNode에서 계산.
- 오래된 draft에서 parent chain이 약한 하위 노드도 card/item prefix로 open state를 따라가도록 처리해, title/question 등 하위 텍스트 선택 시 상세 영역이 안정적으로 열림.
- admin-builder smoke에 두 번째 업무/FAQ 선택 → 상세/답변 열림, 첫 항목 닫힘 검증 추가.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅

메모:
- 이 단계는 방문자 PreviewModal을 건드리지 않고 에디터 캔버스의 선택 상태만 preview state로 쓰는 보강이다. 완전한 visitor interaction mode는 별도 후속으로 남음.

## 2026-05-08 Codex /goal G-Editor verification sweep

검증:
- `BASE_URL=http://localhost:3000 ... asset-image-workflow.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... clipboard-persistence.playwright.ts --workers=1` ✅ (3/3)
- `BASE_URL=http://localhost:3000 ... seo-publish-history.playwright.ts --workers=1` ✅ (2/2)
- `npm run test:unit` ✅ (21 files, 712 tests)
- `npm run security:builder-routes` ✅ (71 builder route files, 61 mutation handlers covered)
- `npm run build` ✅

메모:
- W22/W23, W26~W30의 전용 Playwright 회귀 검증과 full unit/security/build gate를 한 번 더 통과시킴.
- build 중 Google Fonts stylesheet 최적화 다운로드 warning이 있었지만 production build 자체는 성공.
- 아직 goal complete 아님: 사용자의 5분 직접 검증, M8 최종 Playwright 전체 묶음 정리, 체크포인트 green 승격 기준 확인이 남아 있음.

## 2026-05-08 Codex /goal G-Editor map location UX follow-up

범위:
- 지도 노드 첫 클릭이 곧바로 drag처럼 느껴지지 않게, 미선택 지도는 hover 시 `Google Map / 위치 변경` 힌트를 보이고 첫 클릭은 선택 + 위치 패널 열기로만 처리.
- 선택된 지도 quick panel은 Wix식 `위치 변경` 액션, 사무소 프리셋, 주소/지역명 입력, 줌 조절을 한곳에 모아 표시.
- 주소 입력은 더 이상 blur/적용 버튼을 기다리지 않고 typing 즉시 Google Map iframe, 사무소 주소 카드, 길찾기 URL에 동기화.
- Inspector의 Office sync 주소 변경도 길찾기 URL을 자동 재생성해, 지도와 카드만 바뀌고 버튼 링크가 남는 불일치를 제거.
- 깨진 `.next` dev cache로 `/ko`와 `/ko/admin-builder`가 500을 내던 상태를 정리하고 3000 dev server를 재시작.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... office-map-public.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... tests/builder-editor --workers=1` ✅ (21/21, sandbox Chromium launch issue 때문에 외부 실행으로 검증)

메모:
- 일반 map은 hover hint → 첫 클릭 quick panel → 주소 즉시 반영 → Content inspector/reload 유지 경로까지 검증.
- 사무소 map은 quick panel/Inspector에서 주소 변경 시 지도, 주소 카드, 길찾기 링크가 함께 맞춰짐.

## 2026-05-08 Codex /goal G-Editor insights pagination preview follow-up

범위:
- `CODEX-GOAL-WIX-PARITY-COMPLETE.md` 전체 1035줄을 읽고, 현재 editor parity 작업은 전체 Wix-class 완료 계획의 하위 마일스톤으로 정리. 이 문서 기준 전체 완료는 PR #0~#20, 운영 배포, CRM/Member/Analytics/Search/Sentry까지 남아 있어 아직 complete 선언 불가.
- 홈 `칼럼 아카이브` 목록 영역에 실제 blog API 기반 preview overlay를 추가해, 에디터 안에서도 공개 사이트처럼 3개씩 이전/다음 페이지를 넘기며 칼럼 글 목록을 확인 가능하게 함.
- overlay는 `home-insights-list-wrap` 위에만 표시되고, 하위 정적 노드/텍스트 편집 데이터는 그대로 유지해 저장 데이터와 visitor preview를 섞지 않음.
- admin-builder smoke에 인사이트 preview 표시, `다음` 클릭 시 `2 / N` 전환과 첫 글 제목 변경, `이전` 복귀 검증을 추가.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... tests/builder-editor --workers=1` ✅ (21/21, sandbox Chromium launch issue 때문에 외부 실행으로 검증)

메모:
- 사용자가 지적한 "원래 홈페이지 기능이 편집기 안에 다 안 들어온다" 문제 중 홈 칼럼/인사이트 페이지 이동 동작을 보강.
- 다음 우선순위는 `CODEX-GOAL-WIX-PARITY-COMPLETE.md` 기준으로 editor-only polish와 장기 PR #0~#20 범위를 분리해, 먼저 실제 사이트 기능 누락/편집 가능성 갭을 감사하는 것.

## 2026-05-08 Codex /goal G-Editor offices tab preview evidence follow-up

범위:
- 홈 `오시는길` 섹션이 공개 `OfficeMapTabs`처럼 사무소 탭을 누르면 해당 사무소 레이아웃만 보이는지 자동 검증을 보강.
- admin-builder smoke에 타이중 기본 layout visible, 가오슝 탭 클릭 후 layout-1/card title visible + layout-0 hidden, 다시 타이중 탭 복귀 검증을 추가.
- 기존 지도 quick panel/Office sync 검증 전 단계에 탭 전환 검증을 배치해, 사무소 위치 편집 전에 visitor-style tab preview가 살아 있음을 확인.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅ (sandbox Chromium launch issue 때문에 외부 실행으로 검증)

메모:
- 코드 변경 없이 검증 근거를 강화한 마일스톤. `CODEX-GOAL-WIX-PARITY-COMPLETE.md` 기준 전체 complete는 여전히 아님.

## 2026-05-08 Codex /goal G-Editor draft save race + office tabs follow-up

범위:
- page draft 저장을 pageId+variant 단위로 직렬화하고, `/api/builder/site/pages/[pageId]/draft`의 revision compare/write를 같은 lock 안에서 실행하도록 변경.
- 빠른 Delete autosave와 Undo autosave가 동시에 들어올 때 둘 다 같은 revision을 통과해 마지막 write가 복원된 child node를 덮는 race를 차단.
- 홈 `오시는길` 탭 preview를 CSS `:has([data-selected])`에만 기대지 않고 CanvasNode가 active office index를 계산해 inactive layout을 직접 숨기도록 보강.
- `CODEX-GOAL-WIX-PARITY-COMPLETE.md`는 현재 editor-only goal보다 큰 PR #0~#20 장기 work-order 문서로 재확인. 현재 goal complete 선언 기준은 아직 사용자 5분 직접 검증이 남아 있음.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... clipboard-persistence.playwright.ts --workers=1 --grep "deletes selected containers"` ✅
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... tests/builder-editor --workers=1` ✅ (21/21, sandbox Chromium launch issue 때문에 외부 실행으로 검증)
- `npm run test:unit` ✅ (21 files, 712 tests)
- `npm run security:builder-routes` ✅ (71 builder route files, 61 mutation handlers covered)
- `npm run build` ✅ (Google Fonts stylesheet 최적화 download warning only)

메모:
- `npm run build` 후 production `.next`가 dev server를 흔들 수 있어 `.next` 삭제 후 `npm run dev`를 다시 3000에 띄움. `/ko`는 200, `/ko/admin-builder`는 Basic Auth 401 정상 응답 확인.

## 2026-05-08 Codex /goal G-Editor manual QA handoff

범위:
- 체크포인트 Green 판정에 필요한 사용자 직접 5분 검증을 수행할 수 있도록 `G-EDITOR-MANUAL-QA.md`를 추가.
- 첫 화면, selection/hover/drag/resize/rotate/save/undo, top bar/rail/header edit, columns, map/offices, asset/image, copy-paste, SEO/History/Publish, reload persistence를 한 표로 정리.

메모:
- 자동 검증은 이미 통과했지만, 이 문서의 결과가 채워지기 전에는 goal complete/Green 승격 불가.

## 2026-05-08 Codex /goal G-Editor mega menu edit behavior

범위:
- 상단 메뉴의 dropdown/mega menu는 별도 떠다니는 canvas node가 아니라 `BuilderNavItem.children` 데이터로 관리한다는 원칙을 유지.
- 에디터에서 상위 메뉴를 클릭하면 wrapper capture가 먼저 가로채지 않도록 조정해 `SiteHeader`가 직접 click을 처리하게 함.
- 업무분야/미디어센터 같은 mega menu 항목 클릭 시 페이지 이동 대신 dropdown을 pin/open하고 Navigation drawer를 해당 parent item에 포커스.
- 열린 mega panel 안에 `Edit dropdown` affordance를 추가하고, 하위 메뉴 링크 클릭 시 해당 child item 편집 폼으로 바로 이동.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... tests/builder-editor --workers=1` ✅ (21/21)
- `npm run test:unit` ✅ (21 files, 712 tests)
- `npm run security:builder-routes` ✅ (71 builder route files, 61 mutation handlers covered)
- `npm run build` ✅ (Google Fonts stylesheet 최적화 download warning only)

메모:
- 사용자가 지적한 "맨위 메뉴 눌렀을 때 다른 메뉴 나오는 칸"은 이제 클릭으로 열어 둔 채 parent/child 메뉴 데이터를 편집하는 흐름으로 처리한다.
- full builder-editor에서 cascade delete/undo final reload는 Pages drawer 선택 helper 대신 pageId direct-load로 검증해, 페이지 선택 UI 타이밍과 저장 persistence 검증을 분리.
- `npm run build` 후 `.next` 삭제 및 `npm run dev` 재시작. `/ko` 200, `/ko/admin-builder` Basic Auth 401 정상 확인.

## 2026-05-08 Codex /goal G-Editor mega child CRUD follow-up

범위:
- Navigation drawer에서 parent 메뉴마다 `+ Mega` 액션을 추가해 dropdown child 항목을 직접 만들 수 있게 함.
- Mega child row에도 위/아래 이동, 편집, 삭제 컨트롤을 붙여 Wix식으로 dropdown 안의 항목을 정리할 수 있게 함.
- child row에 `data-builder-nav-item-row` hook을 추가해 자동 검증과 편집 포커스를 안정화.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --workers=1 --grep "persists Navigation edits"` ✅

메모:
- `design-pool.playwright.ts`가 실제 Navigation UI에서 `nav-services`에 child 추가 → label/href 저장 → editor mega panel 반영 → API children 확인 → child 삭제 → API 제거까지 검증.

## 2026-05-09 Codex /goal G-Editor mega child smoke stabilization

범위:
- admin-builder smoke의 mega child 확인을 일반 텍스트 locator가 아니라 `data-builder-nav-item-row="nav-services-investment"` row 기준으로 좁힘.
- 숨겨진 중복 텍스트가 먼저 잡혀 실패하던 회귀를 제거하고, Navigation drawer의 실제 child row가 `Mega` chip과 `투자·법인설립` label을 포함하는지 검증.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... admin-builder.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 ... tests/builder-editor --workers=1` ✅ (21/21)

메모:
- 현재 자동 검증 기준 editor core는 통과 상태지만, 사용자가 지적한 원본 tseng-law.com의 상태형 섹션 parity는 별도 후속으로 계속 진행. Green 승격과 goal complete는 사용자 직접 5분 검증 전까지 대기.

## 2026-05-09 Codex /goal G-Editor pages navigation sync

범위:
- PageSwitcher가 페이지 생성/이름 변경/삭제 후 서버 목록을 부모 SandboxPage에 즉시 전달하도록 `onPagesChange`를 추가.
- active page rename 뒤 top bar page dropdown/current slug/link picker가 오래된 slug를 들고 있는 문제를 차단.
- page 삭제 시 top-level navigation뿐 아니라 nested mega child navigation도 재귀적으로 제거.
- Playwright에 active page rename → top bar slug 반영 → nested nav href 업데이트 → delete → nested nav cleanup 시나리오 추가.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --workers=1 --grep "keeps active page slug"` ✅
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --workers=1` ✅ (11/11)

메모:
- 사용자가 말한 섹션 템플릿 교체성은 다음 구현 축으로 분리. 칼럼/주요 서비스/FAQ/오시는길은 앞으로 데이터와 동작 계약을 유지하고 디자인 variant만 갈아끼우는 구조로 확장한다.

## 2026-05-09 Codex /goal G-Editor section template variants

범위:
- 홈의 stateful 섹션 root(`home-services-root`, `home-insights-root`, `home-faq-root`, `home-offices-root`)에 template target/variant metadata를 부여.
- 선택한 섹션 root 위에 `Classic / Elevated / Floating / Glass` quick template switcher를 노출.
- 섹션 template target/variant 정의를 `section-templates.ts` registry로 분리하고, 왼쪽 Design rail에서도 선택한 stateful 섹션의 template variant를 변경할 수 있게 연결.
- variant 변경은 섹션 내부 글/링크/주소/map 데이터는 유지하고 root content.variant만 저장하도록 구성.
- editor CSS에서 services/FAQ/insights/offices의 카드·아코디언·탭 표면이 variant에 따라 다른 디자인으로 보이게 함.
- Playwright가 주요 서비스 quick switcher와 FAQ Design rail variant를 바꾼 뒤 기존 섹션 카피/카드가 유지되고 draft에 `glass:elevated`로 저장되는지 검증.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --workers=1 --grep "stateful home section template"` ✅
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --workers=1` ✅ (12/12)

메모:
- 아직 완전한 섹션 재생성/template gallery는 아님. 다음 단계는 variant 선택을 Inspector/Design panel에도 연결하고, 칼럼 아카이브 grid/timeline/magazine, 서비스 accordion/card/list 같은 구조 variant로 확장하는 것.

## 2026-05-09 Codex /goal G-Editor section template public render

범위:
- stateful 홈 섹션 template registry에 published metadata helper를 추가.
- public page renderer와 global/header/footer/lightbox shared frame이 `data-builder-section-template` / `data-section-variant`를 출력하도록 연결.
- 공개 페이지 inline CSS에도 editor와 같은 `Classic / Elevated / Floating / Glass` surface variant 규칙을 추가해, publish 후에도 FAQ/주요 서비스/칼럼 아카이브/오시는길 카드 표면이 같은 디자인으로 렌더되게 함.
- `design-pool.playwright.ts`에 임시 공개 페이지 생성 → publish → `/ko/{slug}` HTML/DOM/CSS 확인 → cleanup 시나리오를 추가.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit -- src/lib/builder/site/__tests__/published-node-frame.test.ts` ✅
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --grep "publishes stateful section template variants"` ✅
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --workers=1` ✅ (13/13)

메모:
- 사용자가 요청한 "템플릿 변경해도 데이터는 유지하고 디자인만 교체" 흐름의 1차 범위를 공개 렌더까지 닫음. 아직 grid/timeline/magazine 같은 구조 variant template gallery는 후속 확장으로 남음.

## 2026-05-09 Codex /goal G-Editor structural section variants

범위:
- 기존 `content.variant` 계약은 유지하면서 `services / insights / FAQ / offices` 섹션에 배치형 variant CSS를 추가.
- services glass/floating은 카드 좌우 rhythm을 바꾸고, FAQ elevated/glass는 교차 indent를 적용.
- insights floating/glass는 featured/list 위치를 바꿔 magazine-like 배치 차이를 만들고, offices floating/glass는 지도/주소 카드 위치를 바꿔 overlay/side-card 느낌을 제공.
- 공개 renderer inline CSS에도 같은 구조 variant 규칙을 추가해 editor와 published page가 같은 템플릿 결과를 보여주게 함.
- Playwright가 editor quick switcher와 public page에서 variant attr뿐 아니라 실제 좌표 CSS까지 확인하도록 보강.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --grep "switches stateful home section template variants"` ✅
- `BASE_URL=http://localhost:3000 ... design-pool.playwright.ts --grep "publishes stateful section template variants"` ✅

메모:
- 여전히 full template gallery/구조 재생성은 아님. 다만 사용자가 말한 "누르면 아래로 글 내려오는 것 같은 섹션도 디자인 템플릿으로 쉽게 바꾸기"의 동작은 editor/public 양쪽에서 데이터 보존 + 표면/배치 변경까지 가능해짐.

## 2026-05-09 Codex /goal G-Editor hero search quick edit

범위:
- 홈 hero 검색창/검색 버튼/quick menu 선택 시 캔버스 위에 `Hero search / 검색창 편집` quick panel을 표시.
- Left / Center / Wide 프리셋으로 검색창 wrapper, form, input, button, quick menu 폭과 위치를 함께 조정.
- Placeholder와 Search URL을 quick panel에서 직접 수정하고, input placeholder/aria label, form action, button href가 즉시 동기화되게 함.
- 검색창 선택 상태에서는 hover 이동 중 quick menu가 사라지지 않도록 selected-state 표시를 추가.
- 오시는길 사무소 탭 preview는 여러 office 노드가 선택 목록에 남아도 마지막 선택 tab/layout을 active로 처리하도록 보정.
- admin-builder smoke가 hero 검색창 layout/placeholder/action 편집, quick menu 유지, 사무소 탭 전환을 실제 클릭으로 검증.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅

메모:
- 사용자가 지적한 검색창 위치/기능 누락에 대한 1차 보강. 다음 단계는 hero search 목적지 설정을 Navigation/Search 설정 panel과 연결하고, 검색 결과 페이지/칼럼 필터 UX까지 이어서 실제 공개 흐름과 더 가깝게 맞춘다.

## 2026-05-09 Codex /goal G-Editor section template labels

범위:
- 섹션 template variant를 공통 `Classic/Elevated/Floating/Glass` 버튼으로만 보이던 상태에서 섹션별 이름/설명으로 분리.
- 주요 서비스는 `Classic accordion / Card accordion / Split service deck / Icon glass rows`, 칼럼은 `Featured list / Editorial cards / Magazine split / Floating feed`, FAQ는 `Simple accordion / Boxed answers / Split rows / Frosted FAQ`, 오시는길은 `Tabs + map / Address cards / Address first / Map overlay`로 표시.
- Design rail variant card에 작은 구조 preview를 추가해 사용자가 템플릿 변경 전 배치 차이를 읽을 수 있게 함.
- Canvas quick template bar도 섹션별 variant label을 사용하되, 기존 `content.variant` 값은 유지해서 editor/public renderer와 기존 draft 계약을 깨지 않음.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "switches stateful home section template variants" --workers=1` ✅

메모:
- 사용자가 요청한 "섹션 기능들이 전체가 템플릿 디자인 형식이고 나중에 템플릿 변경이 쉬운 방식"에 대한 UX 표면을 보강. 아직 full gallery에서 구조 재생성까지 하는 단계는 아니며, 다음은 칼럼 grid/timeline/magazine처럼 실제 구조 variant 폭을 늘리는 것이 맞다.

## 2026-05-09 Codex /goal G-Editor hero search destinations

범위:
- 공개 검색 페이지가 `tab=columns`를 사용자 친화 alias로 받아 `insights` 칼럼 탭으로 매핑하게 수정.
- hero 검색창 quick edit에 업무/칼럼/영상/FAQ 목적지 preset 버튼을 추가.
- 칼럼 preset은 내부 canonical action을 `/${locale}/search?tab=insights`로 저장하고, 사용자가 raw URL에 `tab=columns`를 입력해도 `tab=insights`로 정규화.
- 검색창 action, 검색 버튼 href, 공개 검색 탭 동작이 서로 어긋나지 않도록 admin-builder smoke와 public search alias 테스트를 보강.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/columns-ui-workflow.playwright.ts -g "accepts columns as a public search tab alias" --workers=1` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅

메모:
- 사용자가 말한 "검색창도 이상한 곳에 있고 기능도 안 보임" 중 목적지 설정과 칼럼 검색 진입을 닫은 단위. 다음은 검색 결과 페이지 자체의 편집 가능 노드화 또는 칼럼 feed template 구조 확장이 남아 있다.

## 2026-05-09 Codex /goal G-Editor columns feed quick layout

범위:
- 칼럼 페이지의 `columns-feed` blog-feed 노드 선택 시 캔버스 위에 `Feed layout` quick edit bar를 표시.
- Grid / List / Masonry / Hero preset 버튼으로 기존 blog-feed content의 `layout`, `columns`, `gap` 값을 즉시 변경.
- 글 추가/수정, 새 글, 공개 보기 quick actions는 유지하면서 feed 디자인 변경 진입을 같은 선택 상태에서 처리.
- 위젯 라이브러리 파일(`src/lib/builder/components/blogFeed/*`)은 수정하지 않고 CanvasNode에서 기존 content 계약만 사용.
- admin-builder smoke가 칼럼 페이지 이동 → feed 선택 → List/Grid preset active 상태 → 글 관리 이동까지 실제 클릭으로 검증.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅

메모:
- 사용자가 요청한 "칼럼 아카이브/주요 서비스 같은 기능 섹션을 템플릿 디자인 형식으로 바꾸기 쉽게" 중 칼럼 전용 feed layout 조작을 닫은 단위. 다음은 공개 칼럼 목록 페이지의 category/filter/search UI를 빌더에서 더 직접 조작 가능하게 만드는 쪽이 남아 있다.

## 2026-05-09 Codex /goal G-Editor canvas nodesById cache

범위:
- `getCanvasNodesById()` WeakMap cache helper를 추가해 같은 nodes array reference에서 `id -> node` Map을 한 번만 생성.
- CanvasNode, CanvasContainer, SandboxLayersPanel, SandboxPage selected section walk, canvas store group/paste/reparent 경로가 shared cache를 사용하도록 연결.
- `reorderNodes`는 순서 조작 때문에 cache Map을 복사해서 사용하도록 처리.
- 감사 문서의 Critical #1/#12 계열 중 반복 Map 생성 비용을 낮춰 큰 홈 페이지에서 drag/scroll/selection 렌더 비용을 줄임.

검증:
- `npm run typecheck` ✅
- `npm run test:unit -- src/lib/builder/canvas/__tests__/indexes.test.ts` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅

메모:
- store-level derived index를 완전히 도입한 것은 아니지만, 현재 hot render path에서 동일 배열 기준 Map 재생성을 공유 cache로 흡수한다. 다음 성능 축은 transient move 중 full sort/JSON stringify/absolute rect recalculation이다.

## 2026-05-09 Codex /goal G-Editor transient update performance

범위:
- transient move/resize/update 경로에서 `updateNodes()`가 매 프레임 전체 zIndex sort와 `updatedAt` 갱신을 하지 않도록 분기.
- transient document 비교는 JSON stringify 대신 document/nodes identity 비교로 처리.
- mutation session commit 시점에만 `updatedAt`을 갱신하고 history에 push하도록 보정.
- updateNode/updateSelectedNodes/updateNodeRectsForViewport/updateNodeContent/updateNodeStyle/updateResponsiveOverride transient 경로에 동일 옵션 적용.
- `store-transient.test.ts`로 transient 중 updatedAt/order 유지, commit 후 updatedAt/history 갱신을 검증.

검증:
- `npm run typecheck` ✅
- `npm run test:unit -- src/lib/builder/canvas/__tests__/store-transient.test.ts src/lib/builder/canvas/__tests__/indexes.test.ts` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅

메모:
- 감사 문서 Critical #2/#3 계열 중 transient full sort/JSON stringify 비용을 줄인 단위. 다음 성능 축은 pointermove에서 absolute rect map을 매번 전량 재계산하는 CanvasContainer 경로다.

## 2026-05-09 Codex /goal G-Editor pointermove geometry snapshot

범위:
- CanvasContainer move/resize 시작 시 visible nodes, `nodesById`, absolute rect map을 interaction snapshot으로 한 번 캡처.
- pointermove hot path가 store document를 다시 읽고 전체 absolute rect map을 재계산하던 경로를 snapshot 참조로 교체.
- viewport 변경, Escape 취소, pointerup, pan 시작 시 snapshot을 명시적으로 비워 stale geometry가 다음 interaction으로 넘어가지 않게 처리.
- drag/resize 중 snap guide, container hover, resize bounds는 시작 geometry 기준으로 유지하고 pointerup reparent 판정은 최신 document 기준으로 재확인.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅

메모:
- 사용자가 지적한 "편집기 내릴 때 렉걸리듯이 흔들림"에 대한 세 번째 성능 축. 이제 동일 drag frame에서 Map 생성, sort, JSON stringify, absolute rect 전량 재계산을 모두 줄였다. 다음은 실제 사용자 검증에서 남는 흔들림이 있으면 scroll container/fixed bottom chrome 레이아웃을 별도 계측한다.

## 2026-05-09 Codex /goal G-Editor chrome navigation and columns friction

범위:
- 빌더 모드 `SiteHeader`에서 메가 메뉴를 편집 대상으로 클릭하면 hover-close 타이머가 닫지 않도록 `builderEditingMenu` pin 상태를 추가.
- 메가 메뉴 child 클릭 시 메뉴를 닫지 않고 Navigation drawer의 해당 child row 편집으로 포커스되게 유지.
- Columns rail 클릭은 더 이상 캔버스를 칼럼 페이지로 강제 이동하지 않고, writer-first drawer만 연다. 사용자가 원할 때 `칼럼 페이지로 이동` 버튼으로 이동.
- 칼럼 drawer primary action을 `새 글 쓰기`, secondary를 `글 목록`으로 정리하고 "제목+본문만 쓰면 요약 자동" copy로 단순 글쓰기 흐름을 드러냄.
- 중앙 캔버스 컬럼의 `overflow-x`를 `auto`로 바꾸고 desktop wrapper를 `min(100%, 1280px)`로 제한해 3000번 로컬에서 우측이 잘리는 문제를 줄임.
- header preview 내부 container/nav/logo 폭을 빌더 영역에 맞게 축소해 상단 메뉴가 캔버스에서 잘려 보이지 않도록 보정.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅

메모:
- 사용자가 지적한 "사이트 열면 옆쪽이 짤림", "맨위 메뉴 Edit 누르러 가면 사라짐", "칼럼 새로 쓰기가 너무 복잡함" 중 즉시 막히는 표면을 닫은 단위.
- 지도 편집은 현재 map quick edit/inspector가 주소/zoom/office sync를 지원하지만, 다음은 중복 preset을 shared `OfficeLocationEditor`/helper로 묶어 Wix식 위치 편집 패널처럼 한 화면으로 정리한다.

## 2026-05-09 Codex /goal G-Editor office map quick edit fields

범위:
- 사무소 map quick edit 패널에 `사무소명`, `전화`, `Google 지도 링크` 필드를 추가.
- 기존 inspector-only office sync를 캔버스 위 quick edit에서도 바로 조작 가능하게 연결.
- 사무소명은 title text node, 전화는 phone button label/href, 지도 링크는 map-link button href와 동기화.
- `주소로 지도 링크 생성` 버튼은 현재 주소 기준 Google Maps search URL을 만들어 map-link button href에 반영.
- quick edit 패널에 `max-height`/내부 scroll을 추가해 필드가 늘어나도 map node 밖으로 과도하게 튀지 않도록 처리.
- admin-builder smoke가 preset → 제목/전화/지도 URL 직접 편집 → preset 복원 → inspector Office sync 진입까지 검증.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅

메모:
- 사용자가 지적한 "지도 눌러서 다른 지역으로 바꾸거나 주소 설정이 간편하지 않음"에 대한 quick edit 표면 보강. 아직 Google Places autocomplete/drag pin은 없음. 다음 단계는 duplicated office presets/URL helpers를 공통 모듈로 정리하고 add/remove/reorder office node group을 붙이는 것.

## 2026-05-09 Codex /goal G-Editor site persistence audit fix

범위:
- Claude 감사 지적 `src/lib/builder/site/persistence.ts:127-139`를 반영해 stale writer가 삭제된 page를 조용히 부활시키는 경로를 차단.
- `mergeMissingPages`를 `reconcileSiteDocumentPagesForWrite`로 교체해 기본값에서는 latest-only page를 자동 병합하지 않음.
- 명시적으로 `preserveMissingPages: true`를 넘긴 호출만 최신 저장본의 missing page를 보존하고, stale next-only page는 timestamp 기준으로 drop.
- seed duplicate 제거 경로는 삭제 의도가 명확하므로 `preserveMissingPages: false`를 명시.
- persistence 단위 테스트 4개 추가: 기본 no-resurrect, explicit preserve, stale next-only drop, new next-only keep.

검증:
- `npm run typecheck` ✅
- `npm run test:unit -- src/lib/builder/site/__tests__/persistence.test.ts` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)

메모:
- 이 수정은 사용자가 말한 "실제 사이트가 꼬여서 원래 페이지/메뉴가 사라지거나 섞이는" 계열의 저장 레이어 방어다. 서버리스 cross-instance race는 아직 revision/etag가 필요하므로 다음 감사 항목으로 남는다.

## 2026-05-09 Codex /goal G-Editor office location helper consolidation

범위:
- 사무소 preset/title/address/phone/fax/maps URL 계약을 `src/lib/builder/canvas/office-locations.ts`로 분리.
- `decompose-offices`, canvas quick edit, inspector Office sync가 같은 preset/helper를 사용하게 정리.
- 사무소 map quick edit에 `팩스` 필드를 추가해 title/address/phone/fax/maps URL을 한 패널에서 바로 수정 가능하게 함.
- office tab/layout preview는 stale multi-selection에 밀리지 않도록 primary selected node를 우선해 active office index를 계산.
- admin-builder smoke에 quick edit fax 노출/수정 검증 추가.

검증:
- `npm run typecheck` ✅
- `npm run test:unit -- src/lib/builder/canvas/__tests__/office-locations.test.ts` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)

메모:
- map widget 본문(`src/lib/builder/components/map/*`)은 goal 제약 때문에 건드리지 않았다. 다음 지도 단계는 add/remove/reorder office group과 지도 URL auto/manual override 상태를 분리하는 일이다.

## 2026-05-09 Codex /goal G-Editor header mega menu direct editing

범위:
- 빌더 header mega dropdown에 `Add menu item` 직접 액션 추가. 드롭다운을 연 상태에서 새 하위 메뉴 row를 Navigation drawer에 바로 생성하고 입력폼으로 포커스한다.
- 각 mega link 옆에 `Edit` chip을 추가해 드롭다운 내부 항목을 직접 선택/편집할 수 있게 했다.
- NavigationEditor가 외부 add-child 요청을 한 번만 처리하도록 request ref를 두고, Playwright 검증은 생성한 임시 navigation을 `finally`에서 복구하게 변경.
- header `Edit menu` chip을 header와 붙여 hover 이동 중 사라지는 느낌을 줄이고, chip hover 자체도 유지 조건에 포함.
- office-location 테스트 helper의 union cast를 `unknown` 경유로 정리해 전체 typecheck에서 깨지지 않게 함.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅ (1회 insights preview timing flake 후 재실행 통과)
- `npm run lint` ✅ (기존 `<img>` warnings only)

메모:
- 사용자가 물은 "맨위 메뉴 눌렀을 때 다른 메뉴 나오는 칸은 어떻게 편집할 거냐"에 대한 첫 구현 단위. 현재는 mega dropdown 하위 링크 label/href 추가·수정·삭제·순서 변경을 Navigation drawer 계약으로 처리한다.

## 2026-05-09 Codex /goal G-Editor viewport scroll lock

범위:
- `SandboxPage` mount 시 브라우저 scroll restoration을 `manual`로 바꾸고 window scroll을 즉시 top으로 reset.
- editor가 떠 있는 동안 `body`/`html` document scroll을 lock해 바깥 문서가 같이 내려가거나 재진입 시 아래 위치가 복원되는 문제를 차단.
- editor shell 높이를 `100dvh`로 보강하고, canvas column/stage viewport에 `overflow-anchor: none`을 적용해 async preview 로딩 중 scroll anchoring 흔들림을 줄임.
- admin-builder Playwright에 `window.scrollY === 0`, body overflow hidden, canvasColumn만 scroll되고 editorShell top이 고정되는 회귀 검증 추가.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)

메모:
- 사용자가 지적한 "첫화면이 아래로 스크롤 해야 나옴", "밑으로 스크롤 된 상태에서 밑에는 고정되어 위 화면이 얼마 안 보임", "편집기 내릴 때 렉걸리듯 흔들림" 중 document-level scroll 문제를 우선 차단한 단위.

## 2026-05-09 Codex /goal G-Editor next-only page reconciliation hardening

범위:
- Claude 감사 지적 `src/lib/builder/site/persistence.ts:127-139` 후속 보강. latest site 문서에 없는 next-only page를 유지할지 판단할 때 `updatedAt`을 더 이상 신뢰하지 않고 `createdAt`만 사용.
- 오래전에 생성됐지만 stale client에서 나중에 `updatedAt`만 갱신된 삭제 page가 다시 살아나는 경로를 차단.
- `createdAt`이 비어 있거나 파싱 불가한 next-only page는 최신 site snapshot 이후 새로 생성됐다고 증명할 수 없으므로 drop.
- persistence 단위 테스트에 "old next-only with newer updatedAt drop", "missing createdAt drop" 회귀 케이스 추가.

검증:
- `npm run test:unit -- src/lib/builder/site/__tests__/persistence.test.ts` ✅
- `npm run typecheck` ✅

메모:
- 이 수정은 저장 레이어 방어 보강이며, public route의 legacy/builder 전환 정책과는 별개다. 실제 사이트가 원래 디자인을 유지해야 하는 기본 정책은 계속 legacy-first로 둔다.

## 2026-05-09 Codex /goal G-Editor published interactions + map editor parity

범위:
- 공개 builder 페이지에서 서비스 상세 카드와 FAQ accordion이 정적 HTML로만 남던 문제를 `PublishedInteractions` client component로 복구. 발행 후에도 click/Enter/Space로 접힘/펼침이 동작한다.
- hero search input은 `placeholder` 우선 렌더링으로 수정해 편집기에서 검색창 문구 변경이 실제 표시와 일치하게 했다.
- map quick edit은 입력 중 draft만 보관하고 `위치 적용`/Enter/외부 blur에서 반영하도록 바꿔, Google Maps iframe 재렌더가 줌 버튼 클릭을 끊지 않게 했다.
- 사무소 map inspector에 공유 사무소 preset grid를 추가하고, office sync가 generic Content tab과 중복 표시되지 않게 정리했다.
- office tab/layout 표시 상태를 `data-office-active` 기반으로 보강해 선택한 지역 레이아웃만 안정적으로 보이게 했다.
- site persistence 기본 write는 최신 문서에만 있는 page를 보존하게 되돌려, 페이지 생성 직후 오래된 site write가 새 page meta를 지워 publish가 `page_not_in_site`로 실패하는 레이스를 차단했다. 명시 삭제 경로는 계속 `preserveMissingPages: false`를 사용한다.

검증:
- `npm run test:unit -- src/lib/builder/site/__tests__/persistence.test.ts` ✅
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/office-map-public.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅

메모:
- 공개 페이지의 “원래 사이트 기능이 살아있는지” 검증 범위를 서비스/FAQ/map publish path까지 넓힌 단위다.
- `CODEX-AUDIT-FINDINGS-2026-05-09.md`, `CODEX-GOAL-WIX-PARITY-COMPLETE.md`는 기존 untracked 문서라 이번 커밋에 포함하지 않는다.

## 2026-05-09 Codex /goal G-Editor escape + map quick edit focus regression

범위:
- full builder-editor Playwright에서 발견된 다중 선택 `Escape` 해제 실패를 수정. 지도 quick edit textarea가 `Ctrl+A` 다중 선택 중에도 자동 focus를 잡아 전역 shortcut이 입력 모드로 오판하던 문제였다.
- map quick edit은 단일 map 노드 선택일 때만 열리도록 좁혀, 전체 선택/다중 선택 상태에서 주소 입력창이 떠서 shortcut을 가로막지 않게 했다.
- `Escape`는 `[role="menu"]` 포커스에서도 전역 deselect로 통과시키고, menu navigation 차단은 Arrow/Enter/Space로 한정했다.
- `deselect` 액션은 active group보다 실제 selection clear를 우선해, 그룹 내부 다중 선택에서도 첫 Escape가 선택을 먼저 해제한다.

검증:
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers canvas direct-manipulation overlays" --workers=1` ✅
- `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (26 passed)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (727 passed)
- `npm run security:builder-routes` ✅ (71 route files / 61 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet download warning only)
- build 후 `.next` dev cache 충돌로 3000 dev를 재시작했고 `/ko`, `/ko/admin-builder` 모두 200 확인.

메모:
- 이 변경은 W02/W08/W10 계열 keyboard/selection 안정화 보강이다. 체크포인트 green 승격은 사용자의 직접 5분 검증 대기라 goal은 아직 active 상태로 유지한다.

## 2026-05-09 Codex /goal G-Editor completion audit + navigation order hardening

범위:
- active goal 완료 전 prompt-to-artifact 감사 수행. 두 read-only explorer 감사와 직접 파일/테스트 대조 결과, M1~M8 자동 증거는 강하지만 체크포인트 판정 규칙상 사용자 5분 직접 검증은 여전히 미완으로 확인했다.
- 감사 중 W18 Navigation 순서 변경 E2E가 약한 것을 발견. Navigation drawer `위로/아래로` 클릭 → API 저장 → editor header 순서 → published builder header 순서까지 검증을 추가했다.
- 실제 버그 수정: `SiteHeader`가 저장된 navigation 순서를 무시하고 `HEADER_NAV_SPECS` 고정 순서로 header를 재정렬하던 문제를 고쳤다. known header item은 저장된 navigation 배열 순서를 따르고, 누락된 spec만 기본 순서 뒤에 붙는다.

검증:
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "persists Navigation edits" --workers=1` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts --workers=1` ✅ (13 passed)
- `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (26 passed)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (727 passed)
- `npm run security:builder-routes` ✅ (71 route files / 61 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet download warning only)
- build 후 `.next` dev cache 충돌 예방을 위해 3000 dev를 재시작했고 `/ko`, `/ko/admin-builder` 모두 200 확인.

메모:
- goal은 아직 complete 아님. 남은 조건은 사용자 직접 5분 브라우저 검증과 Wix 체감 green 승격 판단이다.
- 추가 자동 gap으로는 screenshot-diff 기반 Wix shell visual regression, semantic diff preview, full draggable crop/focal editor, AssetLibrary taxonomy 서버 공유가 남아 있다.

## 2026-05-09 Codex /goal G-Editor persistence audit follow-up

범위:
- Claude 감사 문서의 `src/lib/builder/site/persistence.ts:127-139` 지적을 다시 실제 코드 기준으로 확인했다.
- 현재 저장 정책은 latest-only page를 기본 보존해 동시 page 생성 손실을 막고, latest에 없는 next-only page는 `createdAt` 기준으로 stale 삭제 부활을 차단한다.
- 이 의도를 코드 주석에 명시하고, "다른 탭에서 삭제된 page가 stale writer 저장으로 부활하지 않는다" 회귀 테스트를 추가했다.

검증:
- `npx vitest run src/lib/builder/site/__tests__/persistence.test.ts` ✅ (7 passed)

메모:
- 감사 문서가 제안한 단순 default false는 최근 `page_not_in_site`/페이지 누락 레이스를 되살릴 수 있어 적용하지 않았다. 현재 정책은 동시 생성 보존과 삭제 부활 차단을 둘 다 만족한다.
- goal은 아직 complete 아님. 사용자 직접 5분 검증과 Wix 체감 green 승격 판단이 계속 필요하다.

## 2026-05-09 Codex /goal G-Editor canvas overlay perf follow-up

범위:
- 감사 문서의 drag/scroll 렉 계열 지적 중 현재 코드에 남은 작은 hot path를 줄였다.
- drag feedback overlay의 active rect 계산에서 매 렌더 `map()` 배열 4개와 spread `Math.min/Math.max`를 만들던 경로를 `unionRects` 단일 루프로 교체했다.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers canvas direct-manipulation overlays" --workers=1` ✅ (1 passed, sandbox 승격 실행)

메모:
- 동작 변경 없이 W02/W06/W07 overlay 계산 비용만 줄인 보강이다.
- goal은 아직 complete 아님. 사용자 직접 5분 검증과 Wix 체감 green 승격 판단이 계속 필요하다.

## 2026-05-09 Codex /goal G-Editor version history diff detail

범위:
- W26 VersionHistoryPanel의 diff preview를 보강. 기존에는 modified node가 id/kind만 표시되어 실제 변경 사유를 알기 어려웠다.
- text/label/placeholder/alt/title/image/link/action/address/embed, position, size, rotation, layer, visibility, lock, style/responsive 변경을 한 줄 요약으로 표시한다.
- W26-W28 UI Playwright에 revision 선택 후 node id와 text old/new diff가 보이는 검증을 추가했다.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "covers W26-W28" --workers=1` ✅ (1 passed, sandbox 승격 실행)

메모:
- goal은 아직 complete 아님. 사용자 직접 5분 검증과 Wix 체감 green 승격 판단이 계속 필요하다.

## 2026-05-09 Codex /goal G-Editor image focal crop control

범위:
- W23 Crop / Filter / Alt 통합 dialog의 crop 탭에 focal point 컨트롤을 추가했다.
- preview 이미지를 클릭하거나 3x3 preset/slider로 초점 위치를 조절하고, Apply 시 이미지 노드 `content.focalPoint`로 저장한다.
- 기존 `ImageElement`의 object-position 렌더링과 연결해 편집 캔버스에서 crop focus가 즉시 반영된다.
- 기존 content whitelist 때문에 오래된 이미지 노드의 `focalPoint`가 저장되지 않던 경로를 image editor 적용 시 `updateNode` 직접 병합으로 우회했다. 위젯 라이브러리 defaultContent는 건드리지 않았다.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts --workers=1` ✅ (1 passed, sandbox 승격 실행)

메모:
- W23은 여전히 완전한 자유형 crop box 드래그보다는 focal point + ratio crop이다. 사용자 직접 검증에서 Wix 대비 더 부족하다고 판단되면 다음 단계는 draggable crop box다.
- goal은 아직 complete 아님. 사용자 직접 5분 검증과 Wix 체감 green 승격 판단이 계속 필요하다.

## 2026-05-09 Codex /goal G-Editor asset library server taxonomy

범위:
- W22 AssetLibraryModal의 폴더/태그/asset 배정 상태를 localStorage-only에서 서버 persisted library로 확장했다.
- `GET /api/builder/assets`는 assets와 함께 library taxonomy를 반환하고, `PATCH /api/builder/assets`는 `guardMutation()` 통과 후 정규화된 폴더/태그/배정 상태를 저장한다.
- UI는 서버 상태와 local fallback을 merge하고, 폴더 생성/태그 생성/asset tag/folder 변경/삭제 정리 시 debounced PATCH로 서버에 반영한다.
- Playwright는 생성한 폴더/태그가 API에 저장되는지 poll하고, modal 재오픈 뒤에도 동일 taxonomy가 보이는지 검증한다.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts --workers=1` ✅ (1 passed, sandbox 승격 실행)

메모:
- W22는 이제 같은 브라우저 localStorage에만 묶이지 않고 서버 library 문서로 공유된다.
- goal은 아직 complete 아님. 사용자 직접 5분 검증과 Wix 체감 green 승격 판단이 계속 필요하다.

## 2026-05-09 Codex /goal G-Editor shared canvas node index

범위:
- 감사 문서 Critical #1 후속으로 `nodesById`를 CanvasNode 인스턴스별 계산/구독 대신 canvas store의 shared derived index로 승격했다.
- document node array 변경 시 store가 `childrenMap`과 함께 reference-stable `nodesById`를 갱신하고, CanvasNode/CanvasContainer는 이를 직접 구독한다.
- transient drag/resize edits에서도 index가 최신 node rect를 가리키는지 단위 테스트로 고정했다.

검증:
- `npm run typecheck` ✅
- `npx vitest run src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅ (2 passed)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers canvas direct-manipulation overlays" --workers=1` ✅ (1 passed, sandbox 승격 실행)

메모:
- W02/W06/W07 직접 조작 체감 렉을 줄이기 위한 hot path 보강이다.
- goal은 아직 complete 아님. 사용자 직접 5분 검증과 Wix 체감 green 승격 판단이 계속 필요하다.

## 2026-05-09 Codex /goal G-Editor reduce canvas commit churn

범위:
- 감사 문서 Critical #2/#3 후속으로 `sortNodes`가 이미 올바른 zIndex의 노드를 불필요하게 복제하지 않도록 조정했다.
- `sameDocumentContent`는 전체 nodes 배열을 즉시 2회 직렬화하지 않고, identity/길이/id를 먼저 비교한 뒤 변경된 node만 구조 비교한다.
- structurally identical committed update가 undo history를 만들지 않는 회귀 테스트를 추가했다.

검증:
- `npm run typecheck` ✅
- `npx vitest run src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅ (3 passed)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers canvas direct-manipulation overlays" --workers=1` ✅ (1 passed, sandbox 승격 실행)

메모:
- drag/resize transient 경로는 기존 normalize/touchUpdatedAt off 정책을 유지한다. 이번 변경은 commit/no-op churn과 zIndex 복제 비용을 줄이는 보강이다.
- goal은 아직 complete 아님. 사용자 직접 5분 검증과 Wix 체감 green 승격 판단이 계속 필요하다.

## 2026-05-09 Codex /goal G-Editor cache drag snap candidates

범위:
- 감사 문서 Critical #4/#6 후속으로 단일 노드 drag 중 매 pointermove마다 snap 후보를 filter/map으로 재생성하던 경로를 줄였다.
- pointerdown 시 container hit rects와 snap rects를 interaction state에 저장하고, pointermove에서는 그 배열만 사용한다.
- snap engine 내부에서도 edge pair 배열과 alignment guide 배열 할당을 제거해 per-frame allocation을 낮췄다.

검증:
- `npm run typecheck` ✅
- `npx vitest run src/lib/builder/canvas/__tests__/snap.test.ts src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅ (6 passed)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers canvas direct-manipulation overlays" --workers=1` ✅ (1 passed, sandbox 승격 실행)

메모:
- W06 snap guide/dimension chip 동작은 유지하면서 drag hot path allocation을 줄인 보강이다.
- goal은 아직 complete 아님. 사용자 직접 5분 검증과 Wix 체감 green 승격 판단이 계속 필요하다.

## 2026-05-09 Codex /goal G-Editor current completion audit

목표 재정의:
- `/ko/admin-builder` 데스크톱 editor chrome, selection/resize/rotate/snap/save/undo/clipboard/assets/image edit/history/publish/SEO/navigation/page/blog/map 흐름이 Wix-like로 동작해야 한다.
- M1~M8 범위의 자동 검증과 문서 업데이트, 마일스톤 commit이 남아 있으면 미완이다.
- Done when 17은 사용자가 직접 5분 자유 사용 검증을 해야 하므로 AI 자동 테스트만으로 complete 처리하지 않는다.

Prompt-to-artifact 체크:
- W02 selection handles/hover/label: `admin-builder.playwright.ts`, `design-pool.playwright.ts` direct manipulation overlay 시나리오 통과.
- W06 snap guide/dimension chip: `snap.test.ts`, direct manipulation overlay 시나리오, `28e3a54` snap candidate cache commit.
- W07 resize tooltip/shift/cursors: direct manipulation overlay 시나리오 통과.
- W08 rotation handle/chip/shift snap: `admin-builder.playwright.ts` smoke coverage 통과.
- W10 undo/redo/clipboard: `clipboard-persistence.playwright.ts`, full builder editor 26 passed.
- W11 save state: editor smoke and full builder editor 26 passed.
- W18~W21 top bar/rail/navigation/page switching: `admin-builder.playwright.ts`, `design-pool.playwright.ts` navigation/page tests 통과.
- W22 AssetLibrary folder/tag/search/sort/server persist: `asset-image-workflow.playwright.ts`, `3b08107` commit.
- W23 Crop/Filter/Alt/map quick edit: `asset-image-workflow.playwright.ts`, `office-map-public.playwright.ts`, `459af09` commit.
- W26 VersionHistory timeline/diff: `seo-publish-history.playwright.ts`, `9cdfe46` commit.
- W27 SEO panel: `seo-publish-history.playwright.ts` public head/editor UI coverage 통과.
- W28 Publish gate: `seo-publish-history.playwright.ts`, full builder editor 26 passed.
- W29/W30 duplicate/cross-page copy-paste: `clipboard-persistence.playwright.ts`, full builder editor 26 passed.
- Required commands: latest run of `typecheck`, `lint`, `test:builder-editor`, `test:unit`, `security:builder-routes`, `build` all passed.
- Docs/checkpoint: SESSION and external Wix checkpoint updated through memo 43 before this audit.
- Commits: recent G-Editor commits include persistence audit, overlay perf, version diff, image focal crop, asset taxonomy, shared node index, commit churn, snap candidate cache.

최신 검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (26 passed)
- `npm run test:unit` ✅ (730 passed)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- build 후 `.next` dev cache 충돌로 `/ko/admin-builder`가 500이 되어 dev process를 재시작하고 `.next`를 비운 뒤 `npm run dev`를 다시 띄웠다.
- `curl -I http://localhost:3000/ko` ✅ 200
- `curl -I -u 'admin:local-review-2026!' http://localhost:3000/ko/admin-builder` ✅ 200

남은 blocker:
- Done when 17: 사용자 직접 5분 자유 사용 검증과 "Wix를 그대로 쓰는 느낌" 체감 판정이 아직 없다.
- 따라서 active goal은 완료 처리하지 않는다. `update_goal(status: complete)` 호출 금지.

## 2026-05-09 Codex /goal G-Editor viewport regression assertion

범위:
- 사용자가 지적했던 첫 화면 아래 스크롤 시작, 우측 잘림, 하단 고정 바 과점유 회귀를 자동으로 잡도록 admin-builder smoke를 보강했다.
- editor shell 초기 화면에서 document/body horizontal overflow가 viewport를 넘지 않는지, status footer가 32px 이하로 viewport bottom에 붙어 있는지 검증한다.

검증:
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅ (1 passed, sandbox 승격 실행)

메모:
- 3000 dev 서버는 계속 실행 중이며 `/ko/admin-builder`는 Basic Auth 포함 200 상태다.
- goal은 아직 complete 아님. 사용자 직접 5분 검증과 Wix 체감 green 승격 판단이 계속 필요하다.

## 2026-05-09 Codex /goal G-Editor SEO persistence audit

범위:
- Claude 감사 지점 `src/lib/builder/site/persistence.ts:127-139`를 재검토했다.
- stale site writer가 page title/navigation 같은 비-SEO 변경을 저장하면서 최신 SEO metadata를 빠뜨린 경우, 최신 SEO를 보존하도록 병합 정책을 좁게 보강했다.
- 단, SEO API가 `seo: undefined`를 명시해 SEO 설정을 비우는 경우는 그대로 허용하도록 `seo` 필드 존재 여부로 구분한다.

검증:
- `npm run test:unit -- src/lib/builder/site/__tests__/persistence.test.ts` ✅ (10 passed)
- `npm run typecheck` ✅

메모:
- 이 변경은 W27 SEO panel / W28 publish gate의 저장 신뢰성 보강이다.
- goal은 아직 complete 아님. 사용자 직접 5분 검증과 Wix 체감 green 승격 판단이 계속 필요하다.

## 2026-05-09 Codex /goal G-Editor selection visual assertion

범위:
- W02/W07/W08 시각 회귀를 더 강하게 잡도록 admin-builder smoke에 선택 보더, 8개 흰 사각 핸들, dark-blue border/blue shadow, `kind · width×height` 라벨, 회전 핀 cursor/크기, hover indicator 최종 색 검증을 추가했다.
- canvas zoom이 자동 적용된 상태에서도 resize handle, rotation handle, rotation line이 화면상 과하게 커지지 않도록 `--canvas-zoom` 역보정을 추가했다.
- hover indicator는 위젯 내부 outline보다 editor root indicator가 우선 보이도록 root node selector를 보강했다.

검증:
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅ (1 passed)
- `npm run typecheck` ✅
- `npm run test:unit -- src/lib/builder/site/__tests__/persistence.test.ts` ✅ (10 passed)

메모:
- 직접 브라우저 inspection은 macOS sandbox에서 Chromium launch가 막혀 sandbox 승격으로 실행했다.
- goal은 아직 complete 아님. 사용자 직접 5분 검증과 Wix 체감 green 승격 판단이 계속 필요하다.

## 2026-05-09 Codex /goal G-Editor unlimited history

범위:
- W10 요구사항의 "무제한" undo/redo에 맞춰 canvas history의 기존 100-entry ring buffer cap을 제거했다.
- 감사 문서 High #7 지적도 함께 반영해, 매 commit/undo/redo마다 전체 canvas document를 `structuredClone`하지 않고 store의 immutable structural sharing snapshot을 보관하도록 변경했다.
- redo branch discard와 125회 이상 undo 가능한 단위 테스트를 추가했다.

검증:
- `npx vitest run src/lib/builder/canvas/__tests__/history.test.ts src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅ (5 passed)
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/clipboard-persistence.playwright.ts --workers=1` ✅ (3 passed, sandbox 승격)

메모:
- sandbox 내부 Playwright는 macOS Chromium `bootstrap_check_in Permission denied`로 0초 실패해, 같은 명령을 sandbox 밖에서 재실행했다.
- goal은 아직 complete 아님. 사용자 직접 5분 검증과 Wix 체감 green 승격 판단이 계속 필요하다.

## 2026-05-09 Codex /goal G-Editor full gate replay

범위:
- 최근 W02 selection visual 보강, W10 unlimited history, SEO persistence audit 이후 전체 게이트를 다시 실행했다.
- 먼저 오래 떠 있던 Playwright Chrome 프로세스를 종료해 exec 경고 원인을 줄였고, 3000 dev 서버는 유지했다.
- `npm run build` 직후 기존 `next dev` 런타임이 `.next` 변경과 충돌해 builder/public 요청이 500을 반환했다. dev 서버를 재시작한 뒤 `/ko`와 Basic Auth 포함 `/ko/admin-builder`가 200으로 복구된 상태에서 Playwright 전체 묶음을 재실행했다.

검증:
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (26 files / 735 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (26 passed, clean dev server)
- `curl -I http://localhost:3000/ko` ✅ 200
- `curl -I -u 'admin:local-review-2026!' http://localhost:3000/ko/admin-builder` ✅ 200

메모:
- 자동 검증 기준으로 W02/W06/W07/W08/W10/W11/W18~W23/W26~W30은 최신 pass evidence가 있다.
- 체크포인트 green 승격과 goal complete는 아직 보류한다. Done when 17의 사용자 직접 5분 자유 사용 검증과 Wix 체감 판정이 남아 있다.

## 2026-05-09 Codex /goal G-Editor Add panel search

범위:
- W04 Add 패널을 Wix식 요소 추가 경험에 더 가깝게 보강했다.
- 기존 Section templates / Saved sections / category accordion 구조는 유지하면서, 상단 검색 input, 인기 요소 quick strip, 검색 결과 count, empty state를 추가했다.
- quick add는 추가 직후 draft save state를 `saving`으로 올려 좌하단 저장 chip 흐름과 맞췄다.
- admin-builder smoke가 Add drawer에서 검색, Button 결과 필터링, 이미지 결과 숨김, Quick add, undo 원복, empty state를 실제 클릭으로 검증하도록 보강했다.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅ (1 passed)
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit -- src/components/builder/canvas/__tests__/design-pool-shells.test.ts` ✅ (4 passed)

메모:
- goal은 아직 complete 아님. 사용자 직접 5분 검증과 Wix 체감 green 승격 판단은 계속 마지막 gate로 남긴다.

## 2026-05-09 Codex /goal G-Editor Add panel token cleanup

범위:
- W04 Add 패널 보강 후 남아 있던 inline style object와 hardcoded hex를 제거했다.
- 카테고리 accordion, component card, drag target, quick-add button을 `SandboxPage.module.css` 클래스와 editor chrome token 기반 스타일로 옮겼다.
- `SandboxCatalogPanel.tsx`에는 `style={...}`와 hex/rgba 값이 남지 않도록 정리했다.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅ (1 passed)
- `npm run lint` ✅ (기존 `<img>` warnings only)

메모:
- W04의 자동 검증은 더 강해졌지만, 사용자 직접 green 검증은 계속 대기한다.

## 2026-05-09 Codex /goal G-Editor save chip fade assertion

범위:
- W11 save chip의 `Saving…` → `Saved` 검증에 fade timing과 idle 복귀 검증을 추가했다.
- admin-builder smoke가 `Saved` chip의 200ms in/out animation duration, 1.42s out delay, 3초 내 hidden 상태 복귀를 직접 확인한다.
- 별도 점검 에이전트는 사용량 제한으로 시작 직후 실패해, 같은 약검증 항목 탐색을 메인 세션에서 계속 진행한다.

검증:
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅ (1 passed)
- `npm run typecheck` ✅

메모:
- W11 자동 검증은 idle 미표시와 fade-out까지 더 강해졌다. 사용자 직접 green 검증은 계속 대기한다.

## 2026-05-09 Codex /goal G-Editor inline text toolbar assertion

범위:
- W03 인라인 텍스트 편집 toolbar를 CSS module/editor token 기반 스타일로 옮겼다.
- toolbar 버튼에 명시적 `aria-label`/`aria-pressed`를 붙이고, 활성 상태가 Wix식 파란 active chip으로 보이도록 정리했다.
- W03 Playwright가 floating toolbar의 absolute/flex/border/shadow/z-index, 선택 핸들 숨김, Bold active 시각 상태, rich text bold mark 저장, undo/redo 두 단계 복원을 실제 브라우저에서 검증하도록 보강했다.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/inline-text-editor.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 이슈로 승격 실행)
- `npm run lint` ✅ (기존 `<img>` warnings only)

메모:
- W03 자동 검증은 inline text toolbar 시각/서식 저장/undo-redo까지 더 강해졌다. 사용자 직접 green 검증은 계속 대기한다.
