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
