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
