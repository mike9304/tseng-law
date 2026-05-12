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

## 2026-05-09 Codex /goal G-Editor dropdown editing pin

범위:
- W18 상단 메뉴/드롭다운 편집 흐름을 보강했다.
- 메뉴 드롭다운의 `Edit dropdown`/`Add menu item`/child `Edit` 컨트롤을 CSS/token 기반 클래스로 옮기고, active nav item은 `data-builder-nav-active`로 표시한다.
- 드롭다운 편집 모드 진입 시 패널 안에 `Dropdown editing` chip을 표시하고, 마우스가 메뉴 밖으로 이동해도 편집 중인 mega panel이 유지되도록 기존 pinned menu 상태를 시각적으로 드러냈다.
- admin-builder smoke가 `Edit dropdown` 클릭 → Navigation drawer의 `nav-services` edit form focus → active mega panel 유지 → editing chip 표시를 실제 브라우저에서 검증하도록 보강했다.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 이슈로 승격 실행)
- `npm run lint` ✅ (기존 `<img>` warnings only)

메모:
- 사용자가 지적한 “상단 메뉴/드롭다운 편집하려고 이동하면 사라짐”류 회귀를 자동 검증으로 더 직접 잡는다. 사용자 직접 green 검증은 계속 대기한다.

## 2026-05-09 Codex /goal G-Editor image editor apply assertion

범위:
- W23 Crop / Filter / Alt 통합 dialog 자동 검증을 강화했다.
- 기존에는 filter preview 확인 뒤 닫기만 했던 경로를, B&W filter Apply 후 실제 이미지 노드 style에 `grayscale(100%)`가 반영되는지 확인하도록 바꿨다.
- 이미지 노드 선택 → inspector Content tab → `Crop / Filter / Alt` 버튼으로 dialog를 여는 경로도 검증에 추가했다.
- inspector에서 연 dialog가 기존 filter 상태를 그대로 보여주는지 확인한다.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 이슈로 승격 실행)
- `npm run lint` ✅ (기존 `<img>` warnings only)

메모:
- W23은 우클릭 경로뿐 아니라 inspector 경로와 적용 후 반영까지 자동 검증된다. 사용자 직접 green 검증은 계속 대기한다.

## 2026-05-09 Codex /goal G-Editor full gate replay after W03/W18/W23

범위:
- W03 inline text toolbar, W18 dropdown editing pin, W23 image editor apply path 이후 full gate를 다시 돌렸다.
- office-map public Playwright suite의 draft polling이 full suite 요청 밀도에서 429를 만나던 flake를 GET retry로 보강했다.
- 제품 코드는 건드리지 않고 자동 검증 안정성만 올렸다.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `npm run test:unit` ✅ (26 files / 735 tests)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (26 passed)
- `curl -I http://localhost:3000/ko` ✅ 200
- `curl -I -u 'admin:local-review-2026!' http://localhost:3000/ko/admin-builder` ✅ 200

메모:
- build 이후 dev `.next` runtime/cache mismatch가 재현되어 stale dev server를 종료하고 `.next`를 지운 뒤 `npm run dev`를 3000번에서 재시작했다.
- goal은 아직 complete 아님. 사용자 직접 5분 검증과 Wix 체감 green 승격 판단은 마지막 gate로 남긴다.

## 2026-05-09 Codex /goal G-Editor SEO counter assertion

범위:
- W27 SEO 패널 검증을 보강했다.
- 기존 UI test가 SEO title/description 저장, canonical, Google preview, OG image preview, public head 반영을 확인하던 것에 더해 title/description char counter를 직접 확인한다.
- `권장 30-60자`, `${title.length}/60`, `권장 120-160자`, `${description.length}/160`가 실제 dialog에 표시되는지 Playwright로 검증한다.

검증:
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts --workers=1` ✅ (2 passed)
- `npm run typecheck` ✅

메모:
- W27은 title/description char counter + Google preview + OG image preview + canonical 입력/저장 + public head 반영까지 자동 증거가 생겼다.
- 외부 `Wix 체크포인트.md`는 현재 macOS 권한이 `Operation not permitted`로 막혀 아직 반영하지 못했다.

## 2026-05-09 Codex /goal G-Editor completion audit

목표 재정의:
- `/ko/admin-builder` 데스크톱 에디터가 Wix Editor처럼 보이고 작동하도록 W02/W04/W06/W07/W08/W10/W11/W18~W23/W26~W30을 실제 UI 기준으로 구현/검증한다.
- 검증 gate는 `typecheck`, `lint`, `test:unit`, `security:builder-routes`, `build`, builder Playwright, dev 3000 live check, 문서 업데이트, milestone commit이다.
- 마지막 완료 판정은 사용자 5분 직접 QA와 Wix 체감 승인까지 포함한다.

요구사항별 실제 증거:
- W02/W06/W07/W08/W10/W11/W18/W19~W21/W29/W30: `tests/builder-editor/admin-builder.playwright.ts`가 선택 핸들/hover label, snap guide/chip, resize/rotation readout, topbar/rail/context menu, save chip fade, undo/redo chip, duplicate/copy/paste, first-screen/scroll/layout regression, header menu/dropdown edit pin, map quick edit, columns navigation을 실제 클릭으로 검증한다.
- W03: `tests/builder-editor/inline-text-editor.playwright.ts`가 inline text toolbar visual, active state, rich-text save, undo/redo를 검증한다.
- W04: `SandboxCatalogPanel.tsx` + `admin-builder.playwright.ts`가 Add drawer search, quick add, empty state, token cleanup을 검증한다.
- W22/W23: `tests/builder-editor/asset-image-workflow.playwright.ts`가 AssetLibrary folder/tag/search/sort/new folder/new tag/image replacement와 Crop/Filter/Alt dialog 적용을 검증한다.
- W26/W27/W28: `tests/builder-editor/seo-publish-history.playwright.ts`가 VersionHistory timeline hover diff/restore, SEO title/description counters, Google preview, OG image, canonical 저장/public head 반영, publish blocker/warning gate를 검증한다.
- mutation guard: `npm run security:builder-routes` 최신 pass에서 71 route files / 62 mutation handlers guard coverage 확인.
- 전체 gate: 최신 full gate에서 `typecheck`, `lint`, `test:unit`, `security:builder-routes`, `build`, `test:builder-editor -- --workers=1`, `/ko`, `/ko/admin-builder` 200 확인.
- commits: 최근 milestone commits `G-Editor: strengthen inline text toolbar`, `G-Editor: pin dropdown editing controls`, `G-Editor: assert image editor apply flow`, `G-Editor: harden office map draft polling`, `G-Editor: assert SEO character counters`.

미충족 / 약점:
- Done when 17은 사용자 직접 5분 자유 사용 검증이 필요하다. AI 자동 Playwright만으로 complete 처리 불가.
- Done when 20 중 외부 `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` 업데이트는 macOS 권한 `Operation not permitted`로 현재 미완료다. `SESSION.md`는 계속 업데이트 중.
- `CODEX-AUDIT-FINDINGS-2026-05-09.md`, `CODEX-GOAL-WIX-PARITY-COMPLETE.md`는 untracked 문서로 남아 있으며, goal 산출물로 staging하지 않았다.

결론:
- 자동 구현/검증 기준은 대부분 충족했지만, 사용자 직접 QA와 외부 체크포인트 권한 문제가 남아 있으므로 goal은 아직 complete 아님.

## 2026-05-09 Codex /goal G-Editor final automated gate replay

범위:
- W27 SEO counter assertion과 completion audit 기록 이후 current HEAD 기준 자동 gate를 다시 실행했다.
- build 이후 dev `.next` cache mismatch로 `/ko/admin-builder`가 500이 되는 Next dev 특성을 재확인했고, dev server 종료 → `.next` 삭제 → `npm run dev` 재시작으로 3000번을 복구했다.

검증:
- `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (26 passed / 4.2m)
- `npm run test:unit` ✅ (26 files / 735 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet warning + 기존 `<img>` warnings only)
- `curl -I http://localhost:3000/ko` ✅ 200
- `curl -I -u 'admin:local-review-2026!' http://localhost:3000/ko/admin-builder` ✅ 200

메모:
- `npm run typecheck`와 `npm run lint`는 W27 counter assertion 직후 current code 기준 통과했다.
- 3000번 dev server는 user QA용으로 다시 실행 중이다.
- goal complete는 여전히 보류한다. 사용자 직접 QA와 외부 체크포인트 파일 업데이트가 남아 있다.

## 2026-05-09 Codex /goal G-Editor checkpoint status update

범위:
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` 업데이트 권한을 재확인했고, 이전 `Operation not permitted` 상태가 풀린 것을 확인했다.
- W02/W04/W06/W07/W08/W10/W11/W18~W23/W26~W30 상태를 `🟡 자동검증 통과 / 사용자 QA 대기`로 갱신했다.
- 해당 파일의 판정 규칙상 사용자 직접 브라우저 클릭 검증 전에는 🟢 Green으로 카운트하지 않는다.
- 체크포인트 메모 56을 append해 current HEAD 자동 gate 26/26, unit 735, route guard, build, 3000 dev 200 상태를 기록했다.

메모:
- Done when 20의 문서 업데이트는 이제 `SESSION.md`와 외부 Wix 체크포인트 모두 반영됐다.
- 남은 complete blocker는 Done when 17의 사용자 직접 5분 자유 사용/Wix 체감 판정이다.

## 2026-05-09 Codex /goal G-Editor manual QA checklist refresh

범위:
- `G-EDITOR-MANUAL-QA.md`를 최신 current HEAD 자동 gate와 체크포인트 상태에 맞춰 갱신했다.
- Basic Auth, 자동 증거, W-code별 5분 자유 검증 항목, 사용자 판정 기록란을 추가했다.
- goal complete blocker가 사용자 직접 QA임을 문서에서 바로 확인할 수 있게 했다.

검증:
- `git diff --check` ✅

## 2026-05-09 Codex /goal G-Editor QA click-blank regression

범위:
- 사용자 QA에서 칼럼 아카이브/사진 클릭 시 에디터가 백지처럼 사라지는 이슈를 접수했다.
- 원인 후보 중 하나로 캔버스 내부 칼럼 아카이브 미리보기의 실제 `/ko/columns/...` 링크가 editor shell을 이탈시키는 동작을 확인하고, 에디터 preview 내부 링크 기본 이동을 차단했다.
- 공개 사이트 링크 동작은 변경하지 않고 `CanvasNode`의 editor-only insights preview에만 적용했다.
- 이미지 노드 단순 클릭이 `/ko/admin-builder`를 유지하는 회귀 검증을 `asset-image-workflow`에 추가했다.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts tests/builder-editor/asset-image-workflow.playwright.ts --workers=1` ✅ (2 passed, macOS browser launch sandbox 때문에 승격 실행)

메모:
- 사용자 직접 QA 전이므로 관련 W 상태는 계속 `🟡 자동검증 통과 / 사용자 QA 대기`로 둔다.

## 2026-05-09 Codex /goal G-Editor header navigation guard

범위:
- 에디터 헤더 안에서 빌더 page 목록에 매칭되지 않는 내부 링크를 클릭할 때 `window.location.href`로 shell을 이탈하던 fallback을 제거했다.
- 매칭되지 않는 헤더 링크는 Pages drawer를 열고 toast로 알려주며, `/ko/admin-builder`와 Canvas editor를 유지한다.
- admin-builder smoke에 헤더 utility link 클릭 후 URL/canvas 유지와 Pages drawer 복귀 검증을 추가했다.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅

## 2026-05-09 Codex /goal G-Editor public chrome click safety

범위:
- editor preview 안의 public header 언어 링크(KO/中文/EN)가 Next route로 `/ko/admin-builder`를 이탈하지 않도록 `builderEditable` 모드에서 기본 이동을 차단했다.
- editor preview footer 링크도 shell 이탈을 막고 Navigation drawer + toast로 안내하도록 처리했다.
- `chrome-click-safety.playwright.ts`를 추가해 header locale link와 footer link 클릭 후 URL/canvas 유지 여부를 검증한다.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts --workers=1` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅

## 2026-05-09 Codex /goal G-Editor columns page lookup hardening

범위:
- 전체 builder-editor replay 중 Columns drawer의 `칼럼 페이지로 이동` 버튼이 초기 page cache race로 disabled 상태에 남는 실패를 발견했다.
- Columns drawer가 열렸을 때 `columns` page가 local state에 없으면 `/api/builder/site/pages`를 다시 조회하고, 버튼 클릭 시에도 최신 목록을 조회해 columns page로 이동하도록 보강했다.
- 버튼은 조회 중에만 `페이지 확인 중...`으로 잠깐 disabled 처리하고, page cache가 비어 있다는 이유만으로 이동 기능을 막지 않는다.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (27 passed / 3.7m)

## 2026-05-09 Codex /goal G-Editor latest full gate after click-safety fixes

범위:
- `f3e0d96 G-Editor: harden columns drawer navigation` 이후 최신 HEAD 기준 Done 19 gate를 다시 실행했다.
- Build 이후 dev server cache mismatch가 재현되지 않았고, 3000번 `/ko`와 `/ko/admin-builder`가 모두 200을 유지했다.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (27 passed / 3.7m)
- `npm run test:unit` ✅ (26 files / 735 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- `curl -I http://localhost:3000/ko` ✅ 200
- `curl -I -u 'admin:local-review-2026!' http://localhost:3000/ko/admin-builder` ✅ 200

메모:
- goal complete는 사용자 직접 5분 QA/Wix 체감 승인 전까지 보류한다.

## 2026-05-09 Codex /goal G-Editor audit perf follow-up

범위:
- 클로드 감사 메모 `src/lib/builder/site/persistence.ts:127-139` 및 performance 지적을 이어서 확인했다.
- 현재 HEAD 기준 `CanvasNode`의 per-node `nodesById` Map 재생성 지적과 transient update normalization 지적은 이미 반영되어 있음을 확인했다.
- 남은 hot path 중 history commit 비교가 노드 전체 `JSON.stringify`에 의존하던 부분을 공통 필드 fast compare + nested object fallback으로 줄였다.
- 드래그/리사이즈처럼 rect만 바뀌는 작업은 큰 `content`/`style` 객체 문자열화를 피하고 즉시 차이를 판정한다.

검증:
- `npm run typecheck` ✅
- `npm run test:unit -- src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅ (3 passed)
- `npm run lint` ✅ (기존 `<img>` warnings only)

메모:
- 3000번 dev server는 유지 중이다.
- goal complete는 사용자 직접 5분 QA/Wix 체감 승인 전까지 보류한다.

## 2026-05-09 Codex /goal G-Editor pointermove perf follow-up

범위:
- 사용자 QA에서 보고된 에디터 스크롤/편집 중 흔들림·렉 체감 가능 지점을 추가로 점검했다.
- `CanvasContainer`의 global pointermove가 모든 이벤트마다 transient store update와 React overlay state update를 발생시키던 흐름을 `requestAnimationFrame` 단위로 합쳤다.
- pointerup 직전에 마지막 pending pointer 위치를 flush해서 드래그/리사이즈 최종 좌표가 유실되지 않도록 했다.
- cleanup에서 pending animation frame을 취소해 interaction 종료 후 stale move가 들어가지 않게 했다.

검증:
- `npm run typecheck` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts tests/builder-editor/design-pool.playwright.ts -g "direct-manipulation|Wix-like editor chrome" --workers=1` ✅ (2 passed, macOS Chromium 권한 때문에 승격 실행)
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `git diff --check` ✅

메모:
- 검증 중 `.next` dev cache가 `vendor-chunks/zod.js` missing 상태가 되어 3000번 dev server를 재시작하고 `.next`를 재생성했다. 이후 `/ko`와 `/ko/admin-builder` 모두 200 확인.
- goal complete는 사용자 직접 5분 QA/Wix 체감 승인 전까지 보류한다.

## 2026-05-09 Codex /goal G-Editor latest full gate after perf follow-ups

범위:
- `f01140a G-Editor: throttle canvas pointer movement` 기준으로 최신 자동 gate를 다시 실행했다.
- 첫 전체 builder-editor run은 Cmd+D/Cmd+C/V persistence 케이스가 1회 flaky 실패했으나, 동일 케이스 단독 재실행 통과 후 전체 27개 재실행에서 green을 확인했다.
- `npm run build` 이후 production build 산출물 충돌을 피하려고 dev server를 재시작했다.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (27 passed / 3.8m, macOS Chromium 권한 때문에 승격 실행)
- `npm run test:unit` ✅ (26 files / 735 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- `curl -I http://localhost:3000/ko` ✅ 200
- `curl -I -u 'admin:local-review-2026!' http://localhost:3000/ko/admin-builder` ✅ 200

메모:
- 3000번 dev server는 다시 실행 중이다.
- goal complete는 사용자 직접 5분 QA/Wix 체감 승인 전까지 보류한다.

## 2026-05-09 Codex /goal G-Editor completion audit artifact

범위:
- active goal 완료 판정 전에 prompt-to-artifact 감사 문서를 추가했다.
- `G-EDITOR-COMPLETION-AUDIT.md`가 Done when 1~21, named files, forbidden areas, guard/security gate, commit/document requirements를 실제 증거에 매핑한다.
- 감사 결론은 자동 구현/검증/문서/커밋은 완료됐지만 Done when 17 사용자 5분 QA가 남아 있어 goal complete 불가로 기록했다.

검증:
- `git diff --check` ✅

메모:
- goal complete는 사용자 직접 5분 QA/Wix 체감 승인 전까지 보류한다.

## 2026-05-09 Codex /goal Wix full builder M00 bootstrap

범위:
- 사용자가 지정한 `CODEX-GOAL-WIX-FULL-BUILDER.md`를 장기 goal의 master prompt로 읽고, 4개 신뢰출처 파일을 생성했다: `WIX-PARITY-PROMPT.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-IMPLEMENT.md`, `WIX-PARITY-DOCUMENTATION.md`.
- M00의 `mergeMissingPages` 지시는 현재 코드명 `preserveMissingPages` / `reconcileSiteDocumentPagesForWrite()`와 매핑된다.
- 감사 문서가 이미 확인한 대로 기본값 false 전환은 삭제 부활을 고치는 대신 동시 생성 페이지 보존을 깨므로 적용하지 않았다.
- 대신 `tests/builder-editor/cross-tab-delete-race.playwright.ts`를 추가해 두 admin-builder 탭, stale site snapshot, Tab A delete, concurrent page addition, stale write 이후 삭제 페이지 미부활과 concurrent page 유지까지 검증한다.
- `WIX-PARITY-PLAN.md` M00을 🟢로 갱신했고, `WIX-PARITY-DOCUMENTATION.md`에 deviation/검증/리스크를 기록했다.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit -- src/lib/builder/site/__tests__/persistence.test.ts` ✅ (10 tests)
- `npm run test:unit` ✅ (26 files / 735 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/cross-tab-delete-race.playwright.ts --workers=1` ✅ (sandbox 밖 실행, macOS Chromium Mach port 권한 이슈 때문)
- `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (28 passed)

메모:
- W 범위 없는 선행 안전 마일스톤이라 `Wix 체크포인트.md` 변경은 없다.
- 첫 build/full Playwright 병렬 실행은 dev server와 `.next` 산출물 충돌로 실패했다. dev server 정지 → `.next` 삭제 → build 단독 실행 → dev server 재시작 후 전체 green 확인.
- 다음 마일스톤은 M01 Performance 잔여 fix. 감사 Critical #1~#4와 High #6/#7/#9/#10/#11을 작은 커밋으로 닫는다.

## 2026-05-09 Codex /goal Wix full builder M01 performance residuals

범위:
- M01 Performance 잔여 fix를 완료했다.
- 큰 selection group bounds 계산에서 argument spread를 제거해 대량 선택 시 call stack/argument overflow 위험을 없앴다.
- inspector input에서 Space keyup이 canvas pan 상태를 건드리지 않도록 keydown/keyup 모두 text-input target guard를 적용했다.
- drag snap 후보를 active viewport bounds 기준으로 prune해 offscreen node까지 매 move마다 snap 계산하지 않게 했다.
- `InsightsArchiveListPreview` fetch를 locale별 promise/data cache로 분리해 same-locale remount 중복 fetch를 제거했다.
- office map Playwright의 draft polling이 dev server 부하 중 `429` 또는 일시 `ECONNRESET`을 만났을 때 재시도하도록 보강했다.
- 감사 #7 history full structuredClone 지적은 현재 HEAD의 `history.ts` structural-sharing snapshot 구현과 맞지 않아 재작성하지 않았다.

커밋:
- `a950f84 G-Editor: avoid spread overflow in group bounds`
- `21d64b2 G-Editor: guard space-keyup in text inputs`
- `4751ff8 G-Editor: prune snap candidates by viewport`
- `613bf94 G-Editor: cache insights archive preview by locale`
- `9b96359 G-Editor: harden office map draft polling`

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit -- src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅
- `npm run test:unit -- src/lib/builder/canvas/__tests__/snap.test.ts` ✅
- `npm run test:unit -- src/components/builder/canvas/__tests__/insights-preview-cache.test.ts` ✅
- `npm run test:unit` ✅ (27 files / 740 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/office-map-public.playwright.ts -g "edits a generic Google map address" --workers=1` ✅
- `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (28 passed / 3.7m)

메모:
- 3000번 dev server는 다시 실행 중이다.
- M01은 W 범위 없는 선행 성능/안정성 마일스톤이라 `Wix 체크포인트.md` 변경 없음.
- 다음 마일스톤은 M02 Hot files split. 사용자 제보의 "사진/칼럼 클릭 시 백지", "첫 화면 위치/짤림", "편집 메뉴 사라짐" 같은 런타임 결함을 M02 진입 조사에 포함한다.

## 2026-05-09 Codex /goal Wix full builder M02 hot files split

범위:
- M02 Hot files split을 완료했다. 기능 추가 없이 hot file 책임을 분리했다.
- `SandboxPage.tsx`는 rail/workspace/modals/site-state hook으로 분리해 774 LOC가 됐다.
- `CanvasContainer.tsx`는 context menu, stage nodes, rulers, toolbar, zoom dock, interaction/keyboard/link/selection hooks로 분리해 779 LOC가 됐다.
- `CanvasNode.tsx`는 badge, quick panels, insights preview, selection overlay, rotation hook, node utils로 분리해 794 LOC가 됐다.
- `SandboxPage.module.css`는 node badge/quick panels/selection overlay/insights preview CSS modules로 분리해 4189 LOC가 됐다.
- context menu action contract test가 split 후 `CanvasContextMenuLayer.tsx`를 검사하도록 갱신했다.

커밋:
- `101ca20 G-Editor: split sandbox page shell`
- `2217e9c G-Editor: split canvas container interactions`
- `9bf1338 G-Editor: split canvas node chrome`
- `f6d9cd5 G-Editor: split canvas node styles`

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (27 files / 740 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `NEXT_DIST_DIR=.next-m02 npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (28 passed / 3.7m)
- `git diff --check` ✅

메모:
- M02 종료로 M28 에디터 고도화 의존성은 해제됐다.
- 전체 goal Done when의 "CSS 컴포넌트별 8+ module"은 아직 완전 충족이 아니므로 후속 Pre 마일스톤에서 shell/panel/modal CSS도 계속 분리한다.
- 다음 마일스톤은 M03 보안 3건(CSRF Origin, Upstash rate limit, Asset upload validation).

## 2026-05-09 Codex /goal Wix full builder M03 security

범위:
- M03 보안 3건을 완료했다.
- builder mutation guard에 Origin/Referer CSRF 검증을 적용하고 `BUILDER_ALLOWED_ORIGINS`, `VERCEL_URL`, current host allowlist를 지원했다.
- `guardMutation`을 async로 전환해 Upstash Redis REST rate-limit를 사용할 수 있게 했고, env 미설정/실패 시 기존 in-memory fallback을 유지했다.
- publish limiter를 10/min으로 조정하고 mutation 60/min, asset 30/min 정책을 유지했다.
- asset upload는 10MB env override, MIME allowlist env override, 1KB magic-byte sniffing, SVG sanitize, 415/413 응답 정책을 적용했다.
- shared rate-limit helper 변경에 맞춰 public booking submit route도 `await checkRateLimit`로 보정했다.

커밋:
- `b709f99 G-Editor: enforce builder csrf origin guard`
- `27c27ea G-Editor: add builder rate limit fallback`
- `deaeac7 G-Editor: harden builder asset uploads`

검증:
- `npm run test:unit -- src/lib/builder/security/__tests__/csrf.test.ts src/lib/builder/security/__tests__/rate-limit.test.ts src/lib/builder/canvas/__tests__/upload-validation.test.ts` ✅ (38 tests)
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (29 files / 755 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `NEXT_DIST_DIR=.next-m03 npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- localhost API upload check ✅ (`m03-valid.png` 200, spoofed PNG 415, 11MB PNG 413)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-upload-security.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (29 passed / 3.7m)
- `git diff --check` ✅

메모:
- Chromium launch와 localhost fetch는 local sandbox에서 권한 문제(`EPERM`, Mach port permission)로 실패해 sandbox 밖에서 검증했다.
- `NEXT_DIST_DIR=.next-m03` build가 Next의 tsconfig include 자동 수정을 시도했으나 검증 부산물이라 되돌렸다.
- M03은 W 범위 없는 선행 보안 마일스톤이라 `Wix 체크포인트.md` 변경 없음.
- 다음 마일스톤은 M04 AI 검증 인프라 7종.

## 2026-05-10 Codex /goal Wix full builder M04 quality gates

범위:
- M04 AI 검증 인프라 7종을 완료했다.
- Visual regression 6상태 baseline을 추가했다: 첫 화면, catalog drawer, text inspector, preview mobile, site settings, asset library.
- axe-core WCAG 2.1 AA smoke, Korean/Hanja IME persistence, zh-hant smoke, Chromium/WebKit/Firefox admin smoke, LHCI, Sentry no-op config, GitHub Actions quality workflow를 추가했다.
- `ContainerElement`가 decomposed page `content.background`/border를 무시하던 렌더링 버그를 수정했다.
- 칼럼/인사이트 quick action은 semantic link로 바꿔 WebKit/Firefox에서도 안정적으로 이동하게 했다.

커밋:
- `d4fdd5a G-Editor: add builder quality gates`

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (29 files / 755 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/a11y-smoke.playwright.ts tests/builder-editor/inline-text-ime.playwright.ts tests/builder-editor/visual-regression.playwright.ts tests/builder-editor/zh-hant-smoke.playwright.ts --project=chromium-builder --workers=1` ✅ (4 passed)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --project=chromium-builder --workers=1` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --project=webkit-builder --project=firefox-builder --workers=1` ✅ (2 passed)
- `NEXT_DIST_DIR=.next-m04 npm run build` ✅
- `NEXT_DIST_DIR=.next-m04 npm run lhci` ✅ (exit 0)
- `git diff --check` ✅

메모:
- LHCI는 warning 기준이라 `/ko/admin-builder` performance 0.76~0.78, SEO 0.42 경고가 남아도 exit 0이다. M05 이후 noindex/metadata 정책과 editor bundle 분리를 따로 봐야 한다.
- Playwright/LHCI는 local sandbox에서 Chromium launch 권한 문제로 sandbox 밖 실행이 필요했다.
- self-check subagent는 계정 사용량 제한으로 실패해 로컬 gate로 대체했다.
- 다음 마일스톤은 M05 Empty/error state sweep.

## 2026-05-10 Codex /goal Wix full builder M05 empty/error states

범위:
- M05 Empty/error state sweep을 완료했다.
- zero-node canvas, Pages 0건, Asset 0건, Blog feed 0건 empty state를 추가/정리했다.
- 저장 fetch 실패는 `네트워크 오류, 다시 시도해주세요` toast + retry action으로 표시한다.
- 401/403/500 save 응답은 상단 "저장 차단" chip과 Publish disabled 상태로 이어지게 했다.
- IME composition 중 외부 클릭 blur 저장과 긴 한글 overflow wrapping을 보강했다.

커밋:
- `e14b5f7 G-Editor: add empty and error state gates`

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (29 files / 755 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/empty-error-states.playwright.ts --project=chromium-builder --workers=1` ✅ (9 passed)
- `NEXT_DIST_DIR=.next-m05 npm run build` ✅
- `git diff --check` ✅

메모:
- Playwright는 local sandbox에서 Chromium Mach port 권한 실패가 있어 sandbox 밖에서 실행했다.
- `NEXT_DIST_DIR=.next-m05` build가 Next의 tsconfig include 자동 수정을 시도했으나 검증 부산물이라 되돌렸다.
- 다음 마일스톤은 M06 .next/dev 재시작 의존성 fix.

## 2026-05-10 Codex /goal Wix full builder M06 next dist isolation

범위:
- M06 `.next/dev 재시작 의존성 fix`를 완료했다.
- `next.config.mjs` 기본 distDir를 `.next-build`로 두고, `NEXT_DEV=1` dev 실행은 `.next-dev`를 쓰도록 분리했다.
- `NEXT_DIST_DIR` override는 유지해 `.next-mXX` 검증 빌드와 `.next-g-editor` 격리 서버 패턴이 계속 동작한다.
- `npm run dev`는 시작 전 `.next-build`만 정리한 뒤 `NEXT_DEV=1 next dev`를 실행한다.
- `.next-dev/types`와 `.next-build/types`를 tsconfig include에 넣어 Next가 build 때마다 tsconfig를 고치는 churn을 줄였다.

커밋:
- `1d8cd84 G-Editor: isolate next dev and build outputs`

검증:
- 기본 distDir `.next-build` 확인 ✅
- `NEXT_DEV=1` distDir `.next-dev` 확인 ✅
- `NEXT_DIST_DIR=.next-m06` override 확인 ✅
- `node scripts/clean-next-build.mjs` ✅
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (29 files / 755 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `npm run build` ✅
- `npm run dev -- --port 3010` ✅ (`.next-dev` 생성, `.next-build` 미존재 확인 후 종료)
- `git diff --check` ✅

메모:
- sandbox 내부 curl은 3010 dev server에 연결하지 못했지만, Next dev 로그와 산출물 분리는 확인했다.
- 다음 마일스톤은 M07 모바일 스키마 결정 + 잠금이다. 여기서 responsive 필드 정책을 확정한 뒤 P2로 넘어가야 한다.

## 2026-05-10 Codex /goal G-Editor post-M06 gate stabilization

범위:
- post-M06 자동 gate 재실행 중 발견된 editor hydration/test race와 inline text undo grouping을 안정화했다.
- `SandboxPage`에 `data-editor-ready` hydration flag를 추가하고 Playwright helper가 client-ready 이후 클릭을 시작하게 했다.
- blank page empty canvas 문구 검증을 실제 M05 empty state와 맞췄다.
- IME/inline autosave 테스트가 기존 ProseMirror 내용을 append하지 않도록 전체 선택 후 입력하게 보강했다.
- inline text toolbar 명령은 서식 적용 직전에 현재 텍스트를 먼저 저장해, 텍스트 변경과 Bold/Italic/Underline/Strike/Heading/List/Link 변경이 undo stack에서 별도 단계로 남게 했다.

검증:
- `npm run typecheck` ✅
- `git diff --check` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/inline-text-editor.playwright.ts --workers=1` ✅ (1 passed)
- `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --project=chromium-builder --workers=1` ✅ (42 passed / 4.3m)
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (29 files / 755 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet download warning only)

메모:
- 새 self-check subagent는 현재 thread agent limit 때문에 생성하지 못했다. 동일 범위는 메인 세션에서 full builder Chromium suite와 전체 gate로 대체 검증했다.
- 체크포인트 판정 규칙상 W02/W03/W04/W06/W07/W08/W10/W11/W18~W23/W26~W30은 자동 검증 증거가 최신화됐지만 사용자 직접 5분 QA 전까지 green 승격하지 않는다.

## 2026-05-10 Codex /goal Wix full builder locale repair

범위:
- 사용자 피드백 "편집기에 한국어인데 왜 중국어로 사이트가 뜨지?"를 M07 진입 전 blocker로 처리했다.
- 홈 draft가 `zh-hant` seed로 저장된 상태를 확인하고, `/ko/admin-builder`와 draft API가 요청 locale에 맞는 홈 seed content를 projection/repair하도록 추가했다.
- `/zh-hant/admin-builder`가 같은 한국어 홈 draft를 다시 중국어로 오염시키지 않도록, page locale과 요청 locale이 다를 때는 서버 로드 upgrade 결과를 공유 draft에 되저장하지 않게 막았다.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (30 files / 757 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/locale-projection.playwright.ts --project=chromium-builder --workers=1` ✅

메모:
- Playwright Chromium은 local sandbox에서 Mach port 권한 실패가 있어 sandbox 밖에서 재실행했다.
- 3000 dev server는 재시작했고 현재 `http://localhost:3000`에서 계속 실행 중이다.
- 다음 마일스톤은 M07 모바일 스키마 결정 + 잠금이다.

## 2026-05-10 Codex /goal Wix full builder section template pool

범위:
- 사용자 피드백 "주요업무 템플릿이 네 개뿐이고, 적용 화면에서 뒤로 갈 수 없다"를 M07 진입 전 blocker로 처리했다.
- Design rail의 섹션 chip을 실제 선택 버튼으로 만들고, 선택된 섹션 상세 화면 상단에 `← 섹션 목록` 복귀 버튼을 추가했다.
- 섹션 디자인 variant를 4개에서 12개로 확장했다: `flat`, `elevated`, `floating`, `glass`, `split`, `editorial`, `compact`, `spotlight`, `outline`, `timeline`, `soft`, `contrast`.
- 주요 서비스, 칼럼 아카이브, FAQ, 오시는길 각각에 섹션별 label/description을 붙여 템플릿 picker가 실제 선택 풀처럼 보이게 했다.
- editor canvas CSS와 public page renderer CSS를 함께 확장해 선택한 템플릿이 편집기와 공개 페이지에서 같은 `data-section-variant`로 렌더링되게 했다.
- "AI 디자인 전문 사이트 템플릿 가져오기"는 외부 template ingestion 트랙으로 분리 필요. 이번 blocker는 로컬 빌더의 즉시 사용 가능한 템플릿 풀과 복귀 UX를 먼저 닫았다.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --project=chromium-builder --workers=1` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "switches stateful home section template variants|publishes stateful section template variants" --project=chromium-builder --workers=1` ✅ (2 passed)
- `npm run test:unit` ✅ (30 files / 757 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- `git diff --check` ✅

메모:
- Playwright Chromium은 local sandbox에서 Mach port 권한 실패가 있어 sandbox 밖에서 재실행했다.
- 다음 작업은 요청대로 M07 모바일 스키마 결정 + 잠금부터 이어간다.

## 2026-05-10 Codex /goal Wix full builder M07 mobile schema lock

범위:
- M07 `모바일 스키마 결정 + 잠금`을 완료했다.
- 사용자 추가 확인 없이 기존 코드 방향과 full-builder master prompt의 P2 요구를 보수적으로 확정했다.
- per-viewport font size는 `responsive.<viewport>.fontSize`, visibility는 `responsive.<viewport>.hidden`으로 잠갔다. `hiddenOnViewports[]`는 채택하지 않는다.
- 글로벌 헤더 모바일 동작은 site-level header schema에 둔다: `site.headerFooter.mobileSticky`, `site.headerFooter.mobileHamburger`.
- 모바일 하단 CTA는 site-level entity로 둔다: `site.mobileBottomBar`.
- `normalizeSiteDocumentLifecycle()`가 legacy site document에 M07 default를 자동 보강하도록 연결했다.
- `scripts/migrate-builder-mobile-schema.mjs`를 추가해 production/local `site.json` dry-run/apply, `before-M07-<timestamp>.json` 백업, rollback 문서화를 제공했다.
- `Phase 2 모바일 스키마 초안.md`, `WIX-PARITY-PLAN.md`, `Wix 체크포인트.md`에 lock 결정을 기록했다.

검증:
- `npm run typecheck` ✅
- `node scripts/migrate-builder-mobile-schema.mjs --site tseng-law-main-site --dry-run` ✅ (`changed:false`, 현재 local site는 이미 default shape)
- `npm run test:unit -- src/lib/builder/site/__tests__/mobile-schema.test.ts src/lib/builder/site/__tests__/mobile-schema-migration.test.ts src/lib/builder/canvas/__tests__/responsive-schema-lock.test.ts` ✅ (8 tests)
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- `npm run test:unit` ✅ (33 files / 765 tests)

메모:
- M07은 schema/runtime lock이며, 모바일 inspector UI는 M08에서 시작한다.
- M09/M10에서 이 lock 위에 auto-fit, hamburger runtime, mobile sticky, bottom CTA, mobile preview iframe을 구현한다.

## 2026-05-10 Codex /goal Wix full builder M08 mobile inspector

범위:
- M08 `Mobile inspector per-viewport UI`를 완료했다.
- Inspector Layout 탭에 Desktop/Tablet/Mobile viewport control을 추가하고, top bar BreakpointSwitcher와 같은 store viewport를 쓰도록 동기화했다.
- tablet/mobile에서 X/Y/Width/Height override는 `responsive.<vp>.rect`, Font size override는 `responsive.<vp>.fontSize`, hidden override는 `responsive.<vp>.hidden`으로 기록된다.
- override 생성 시 `Override created` 상태와 reset 버튼을 보여준다. override가 없으면 desktop inherit 상태를 보여준다.
- 사용자 피드백 "주요 업무 노드 선택한 뒤 다른 노드 선택하면 글이 없어진다"를 함께 수정했다. services/FAQ editor preview open state를 selection state에서 분리해, 열어둔 업무 글이 다른 노드 선택 후에도 유지된다.
- Design rail의 섹션 선택도 local focus 상태를 추가해 `주요 서비스` chip 클릭 즉시 템플릿 목록으로 진입하게 보강했다.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (33 files / 765 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-inspector.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts tests/builder-editor/mobile-inspector.playwright.ts --workers=1` ✅ (2 passed)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)

메모:
- W32/W34/W35/W38은 M08 evidence 확보.
- W31/W37 auto-fit과 W39~W45 mobile runtime/preview는 M09/M10으로 이어간다.

## 2026-05-10 Codex /goal Wix full builder M09 mobile auto-fit

범위:
- M09 `Mobile auto-fit + 자동 변환`을 완료했다.
- 모바일 viewport 진입 시 override 없는 root section은 375px 전폭 세로 스택으로 자동 fit되고, descendant rect/fontSize도 같은 비율로 축소된다.
- 기존 user mobile override는 덮어쓰지 않고, 누락된 `responsive.mobile.rect/fontSize`만 생성한다.
- 모바일 auto-fit 적용 중 `updatedAt`/viewport sync가 반복되며 생길 수 있는 update-depth loop를 제거했다.
- editor mobile viewport에서는 SiteHeader가 desktop horizontal nav 대신 hamburger + slide drawer로 강제 전환된다.
- public SiteHeader도 같은 mobile drawer markup을 사용해 실제 mobile media query에서 hamburger로 전환된다.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (33 files / 766 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-auto-fit.playwright.ts --workers=1` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-auto-fit.playwright.ts tests/builder-editor/mobile-inspector.playwright.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed)

메모:
- W31/W37/W39는 M09 evidence 확보로 green 처리했다.
- 다음 마일스톤은 M10 `Mobile sticky / preview iframe`이며 W40~W45를 닫는다.

## 2026-05-10 Codex /goal Wix full builder M10 mobile runtime

범위:
- M10 `Mobile sticky / preview iframe`을 완료했다.
- Site Settings API와 modal에 `headerFooter.mobileSticky/mobileHamburger`, `mobileBottomBar` 편집/저장을 연결했다.
- published fallback SiteHeader는 mobile sticky/hamburger mode를 data attribute와 class로 반영한다.
- global header canvas를 쓰는 공개 페이지도 `mobileSticky`가 적용되도록 `GlobalCanvasSection`에 sticky hook을 추가했다.
- `MobileBottomBar` published component를 추가해 모바일 하단 고정 전화/예약 CTA를 렌더한다.
- CanvasNode touch pointer long-press가 contextmenu를 발화하도록 연결했다. 560ms hold, 8px 이상 이동 시 취소한다.
- PreviewModal은 기존 iframe/device frame 구현을 유지하고, 실제 발행 URL이 mobile iframe으로 들어가는지 Playwright에서 검증했다.
- W33 잔여 검증도 함께 닫았다. `responsive.mobile.hidden` 노드가 공개 모바일 viewport에서 숨겨진다.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run test:unit` ✅ (33 files / 766 tests)
- `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-runtime.playwright.ts --workers=1` ✅

메모:
- W33/W40/W41/W42/W43/W44/W45는 M10 evidence 확보로 green 처리했다.
- 공개 루트 `/ko`는 legacy home이 우선 렌더된다. builder published runtime 검증은 생성/발행한 builder page slug로 수행했다.
- Playwright Chromium은 macOS sandbox에서 Mach port 권한 실패가 있어 sandbox 밖에서 실행했다.

## 2026-05-10 Codex /goal Wix full builder M11 text widget pack

범위:
- M11 `Text 위젯 팩`을 완료했다.
- + 패널 Catalog에 `Text widget pack` 섹션을 추가하고 W46~W55 프리셋 10종을 제공한다.
- Text schema와 renderer에 column, quote, marquee, SVG text-path, full-text link를 추가했다.
- Text Inspector에 rich text shortcut, columns, quote style, marquee speed/direction, text-path curve/baseline, `LinkPicker`를 연결했다.
- 연속 quick-add 시 새 노드가 같은 중앙 좌표에 겹치지 않도록 cascade offset을 적용했다.

검증:
- `npm run typecheck` ✅
- `npm run test:unit -- src/lib/builder/canvas/__tests__/text-widgets.test.ts` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/text-widgets.playwright.ts --workers=1` ✅

메모:
- W46/W47/W48/W49/W50/W51/W52/W53/W54/W55는 M11 evidence 확보로 green 처리했다.
- 구현은 현재 repo의 registry-driven 구조를 따른다. 별도 kind 10개를 늘리기보다 기존 `text`/`heading` 노드에 Wix식 text-family controls/presets을 추가했다.

## 2026-05-10 Codex /goal Wix full builder M12 media widget pack

범위:
- M12 `Media 위젯 팩`을 완료했다.
- + 패널 Catalog에 `Media widget pack` 섹션을 추가하고 W56~W70 프리셋 15종을 제공한다.
- Image renderer/Inspector에 lightbox, popup/link click action, hotspots, before/after slider, hover swap, inline SVG color, GIF metadata를 추가했다.
- `video` kind를 schema에 추가하고 MP4/direct video box와 background video mode를 지원한다.
- `audio` kind를 추가해 file audio player와 Spotify/SoundCloud embeds를 지원한다.
- `lottie` kind를 추가해 Lottie URL embed와 fallback animated preview를 지원한다.
- 기존 `video-embed`는 YouTube/Vimeo preset으로 노출하고, 기존 `icon` kind는 Lucide/FontAwesome set을 지원하도록 확장했다.

검증:
- `npm run typecheck` ✅
- `npm run test:unit -- src/lib/builder/canvas/__tests__/media-widgets.test.ts` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/media-widgets.playwright.ts --workers=1` ✅

메모:
- W56/W57/W58/W59/W60/W61/W62/W63/W64/W65/W66/W67/W68/W69/W70는 M12 evidence 확보로 green 처리했다.
- 실제 파일 업로드, Giphy 검색 API, Lottie JSON 파싱은 asset pipeline 확장 트랙으로 남긴다. 이번 M12는 Wix식 Add/Inspector/runtime surface를 먼저 닫았다.
- Playwright Chromium은 macOS sandbox Mach port 권한 실패가 있어 sandbox 밖에서 실행했다.

## 2026-05-10 Codex /goal Wix full builder M13 gallery widget pack

범위:
- M13 `Gallery 위젯 팩`을 완료했다.
- + 패널 Catalog에 `Gallery widget pack` 섹션을 추가하고 W71~W78 프리셋 8종을 제공한다.
- Gallery schema/defaultContent에 layout, caption, tags, filter, autoplay, thumbnail, pro style controls를 추가했다.
- Gallery renderer에 grid, masonry, slider, slideshow, thumbnail, pro gallery, caption overlay/below, filter bar, published lightbox를 추가했다.
- Gallery Inspector에 layout dropdown, caption mode, tag filter, autoplay interval, thumbnail position, pro style, image caption/tag editor를 연결했다.

검증:
- `npm run typecheck` ✅
- `npm run test:unit -- src/lib/builder/canvas/__tests__/gallery-widgets.test.ts` ✅
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/gallery-widgets.playwright.ts --workers=1` ✅

메모:
- W71/W72/W73/W74/W75/W76/W77/W78는 M13 evidence 확보로 green 처리했다.
- 필터 pill click으로 runtime activeFilter를 바꾸는 수준의 interactive behavior는 M15 Interactive track에서 더 다듬을 수 있다.

## 2026-05-11 Claude M14 Layout 위젯 팩 (코덱스 한도 후 이어서)

범위:
- M14 `Layout 위젯 팩`을 완료했다.
- 코덱스가 한도 직전까지 남긴 WIP를 main에서 그대로 이어서 마무리.
- 카탈로그 패널에 `Layout widget pack` 섹션을 추가하고 W79~W88 프리셋 10종을 제공한다 (strip, box, columns ×3, repeater, tabs, accordion, slideshow container, hover box, sticky/anchor, grid layout).
- Container schema/defaultContent에 layoutMode 8 신규 값 (strip/box/columns/repeater/tabs/accordion/slideshow/hoverBox) + layoutItems / activeIndex / sticky / anchorTarget 를 추가했다.
- Container Element renderer에 tabs/accordion/slideshow/hoverBox/repeater preview + published sticky positioning + anchor target data attribute 를 추가했다.
- Container Inspector에 layout-mode dropdown 확장 + layoutItems textarea + active index + anchor target + sticky toggle 를 연결했다.
- globals.css 에 builder-layout-* 클래스 161줄 추가 (tabs list/accordion/slideshow/hoverbox/repeater 시각화).

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (handleAddLayoutWidgetPreset → 카탈로그 UI 통합으로 unused 해소)
- `npm run test:unit` ✅ 36 files / 769 tests
- `npm run security:builder-routes` ✅ 71 routes / 62 mutation handlers

수정 사항 (코덱스 WIP 마무리):
- `src/lib/builder/components/container/Inspector.tsx` import 들여쓰기 깨짐 fix (`type GridConfig,`)
- `src/lib/builder/components/container/Inspector.tsx` `parseLayoutItems` 의 type predicate filter를 명시적 LayoutItem 누적 패턴으로 교체 (exactOptionalPropertyTypes 호환)
- `src/components/builder/canvas/SandboxCatalogPanel.tsx` 에 `Layout widget pack` 카테고리 섹션 추가 (Gallery 패턴 따라). `handleAddLayoutWidgetPreset` 핸들러를 UI에 연결.

메모:
- W79~W88는 M14 evidence 확보로 green 처리했다.
- Playwright builder-editor 신규 E2E 미작성 (M11~M13 처럼 layout-widgets.playwright.ts 추가 권장 — 다음 turn).
- Manual QA: `/ko/admin-builder` 좌측 + 패널에서 "Layout widget pack" 펼치고 10종 한 번씩 추가해 보면 검증 완료.

## 2026-05-11 Claude M14 layout-widgets E2E follow-up

범위:
- 코덱스 M11/M12/M13 패턴에 맞춰 `tests/builder-editor/layout-widgets.playwright.ts`를 추가했다.
- 카탈로그 → "Layout widget pack" 펼치고 W79~W88 10 프리셋을 순차 추가한 뒤
  data-builder-layout-mode (strip/box/columns/repeater/grid) +
  data-builder-layout-widget (tabs/accordion/slideshow/hoverBox/repeater) +
  data-builder-layout-sticky=true 가 캔버스에 attach 되는지 검증한다.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅
- `npm run test:unit` ✅ 36 files 769 tests
- `BASE_URL=...` Playwright 실행은 이 환경에서 dev server 띄울 수 없어 보류.
  다음 코덱스 turn 또는 사용자가 `npm run test:builder-editor -- layout-widgets`
  로 실행 권장.

## 2026-05-11 Claude M15 Interactive 위젯 팩 1차 (canvas widgets)

범위:
- M15 `Interactive 위젯 팩` 1차 분 (canvas-level widgets 5종) 완료.
- W95 Countdown (kind=countdown, card/compact/inline variant + 자동 1초 tick),
  W96 Progress (kind=progress, bar/ring/segments + SVG ring + percent toggle),
  W97 Rating (kind=rating, stars/hearts/dots + fractional fill mask),
  W93 Notification bar (kind=notification-bar, info/warning/success/danger tone +
  CTA + dismissable + 자체 useState 닫힘 상태),
  W98 Back to top (kind=back-to-top, scroll listener + smooth scrollTo + circle/
  pill/square variant + show-after-px gate).
- W90 Icon button / W89 Button variants 는 기존 button kind에 흡수 — 추가 kind 없음.
- W91 Lightbox modal / W92 Popup with trigger / W94 Cookie consent 는 site-level
  entity 가 필요하므로 M15-2 분으로 분리한다 (코덱스 lightboxes 패턴 확장).
- 카탈로그 패널에 `Interactive widget pack` 섹션 + 프리셋 10종 (countdown card·
  compact, progress bar·ring·segments, rating stars·hearts, notification info·
  warning, back-to-top).
- globals.css 에 builder-interactive-* 스타일 ~200줄 (countdown segments / progress
  bar·ring·segments / rating fractional fill / notification tone palette / back-
  to-top variant placement) 추가.
- Playwright `tests/builder-editor/interactive-widgets.playwright.ts` 신규.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅
- `npm run test:unit` ✅ 36 files / 769 tests
- `npm run security:builder-routes` ✅ 71 routes / 62 mutation handlers
- Playwright dev server 보류 (M14와 동일 환경 한계 — `npm run test:builder-editor
  -- interactive-widgets` 로 별도 실행).

메모:
- W95~W98 evidence green. W90/W89 는 기존 button kind 흡수로 close. W91/W92/W94
  는 M15-2 site-level 분으로 남긴다.
- Notification bar 의 CTA href 검증은 sanitizeLinkValue 시그니처 불일치로 inline
  `safeHref(raw)` 헬퍼 사용 (http/https/mailto/tel/relative/anchor 만 허용).
- Countdown setInterval cleanup은 mode==='edit' 일 때 등록하지 않는다 (편집
  중에는 정적 미리보기로 충분).

## 2026-05-11 Claude M15-2 site-level entities (popup / cookie consent)

범위:
- M15 마무리. W91 / W92 / W94 site-level entity 3종.
- 추가 타입 (`src/lib/builder/site/types.ts`):
  - `BuilderPopup` — slug + trigger (manual/on-load/on-exit-intent/on-scroll) +
    delayMs + scrollPercent + oncePerVisitor + sizing + dismissable.
  - `BuilderCookieConsent` — version (bump으로 재요청) + layout (bar-bottom/bar-
    top/modal-center/card-corner) + 다국어 텍스트 + 카테고리 (required/optional).
  - `createDefaultPopup` / `createDefaultCookieConsent` factory.
- BuilderSiteDocument에 `popups?: BuilderPopup[]` + `cookieConsent?: BuilderCookieConsent` 추가.
- Link prefix 확장 (`src/lib/builder/links.ts`): 'popup:', 'cookie-consent:' 허용.
  `describeLinkScheme` return type에 'popup' / 'cookie-consent' 추가.
- Public runtime (3 신규 컴포넌트):
  - `PopupMount` — 클릭 위임 (data-popup-target / href="popup:slug") + auto
    triggers (on-load/on-scroll/on-exit-intent) + oncePerVisitor localStorage 게이트.
  - `PopupOverlay` — LightboxOverlay 동일 패턴. dismissable / closeOnEsc /
    closeOnOutsideClick / backdrop. 본문은 향후 popup canvas 인프라로 교체.
  - `CookieConsentBanner` — 4 layout + Accept all / Decline / Manage panel
    (카테고리 토글). localStorage `tw_cookie_consent_v1:<version>` 키로 결정 저장.
    `builder-cookie-consent:decision` 이벤트 발행.
  - `CookieConsentMount` — `href="cookie-consent:open"` 또는
    `data-cookie-consent="open"` 클릭 위임 → `builder-cookie-consent:open` 이벤트.
- `resolvePublishedSitePage` 가 popups (locale + active 필터) + cookieConsent
  (enabled + locale 일치) 를 반환하도록 확장.
- `PublishedSitePageView` 가 PopupMount/PopupOverlay (slug별) + CookieConsentMount/
  Banner 를 mount.
- 카탈로그 Interactive widget pack 에 3 트리거 button preset 추가:
  popup-trigger / lightbox-trigger / cookie-consent-open.
- `flex` 데브 페이지 mock에 popups: [] / cookieConsent: null 보강.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅
- `npm run test:unit` ✅ 36 files / 769 tests
- `npm run security:builder-routes` ✅ 71 routes / 62 mutation handlers

남은 작업 (M15 polish, follow-up):
- Builder admin UI: popup list / 편집기 (lightbox 패턴 따라 별도 canvas 문서 +
  popup-trigger 시각화). 현재 popup overlay 본문은 plain placeholder text.
- 카탈로그에 popup-canvas 편집 진입점.
- cookie consent 설정 UI: site settings 모달 패널 (version bump / 카테고리 편집).
- Playwright E2E: 4 시나리오 (수동 trigger / on-load / cookie banner 표시·동의 /
  decline-only).

메모:
- popup `oncePerVisitor` 는 localStorage `tw_popup_seen:<slug>` 키로 게이트. 같은 slug 재오픈은 시크릿 모드 / localStorage 초기화 필요.
- cookie consent version 을 bump 하면 모든 방문자가 다시 prompt.
- 모든 트리거가 admin 토글 없이 default 비활성 — `cookieConsent.enabled=false` /
  `popup.active=false` 가 기본.

## 2026-05-11 Claude M16 Navigation 위젯 팩

범위:
- M16 (W99~W105). 3 신규 kind (menu-bar / anchor-menu / breadcrumbs).
- menu-bar: orientation (horizontal/vertical) + variant (plain/pill/dropdown/mega)
  + items (children dropdown) + 모바일 햄버거 토글.
- anchor-menu: 섹션 점프 + sticky + offsetTopPx + scroll spy 활성 표시.
- breadcrumbs: chevron/slash/dot 구분자 + 홈 prefix.
- 카탈로그 Navigation widget pack 7 프리셋 (horizontal/vertical/dropdown/mega/
  anchor/breadcrumbs chevron·slash).
- globals.css builder-nav-* 스타일 + 767px 미만 햄버거 + mobile 메뉴 dropdown.

검증: typecheck ✅ / lint ✅ / unit 769 tests ✅.

## 2026-05-11 Claude M17 Social 위젯 팩

범위:
- M17 (W106~W113). 4 신규 kind (social-bar / share-buttons / social-embed /
  floating-chat). 카탈로그 Social widget pack 8 프리셋.
- social-bar: instagram/facebook/twitter/threads/youtube/linkedin/tiktok/whatsapp/
  line/kakao/naver/x 12 provider 글리프.
- share-buttons: copy(navigator.clipboard) + facebook/twitter/kakao/line/whatsapp/
  email sharer URL + window.open popup.
- social-embed: provider별 placeholder grid (실제 SDK 로드는 외부 트랙 또는
  customEmbed 사용).
- floating-chat: WhatsApp/LINE/Kakao/Telegram/Messenger/custom 프로바이더 + 색
  fallback + placement.

검증: typecheck ✅ / lint ✅ / unit 769 tests ✅.

## 2026-05-11 Claude M18 Maps & Location 위젯 팩

범위:
- M18 (W114~W117). 3 신규 kind. 기존 'map' kind는 그대로 (W114 sweep).
- address-block: 1행/2행/도시/우편/국가/전화 + 복사 버튼 + Google Maps 길찾기 링크.
- business-hours: 7일 + 휴무 flag + 오늘 강조 + 시간대 + 비고.
- multi-location-map: 지점 리스트 + active index + Google Maps 검색 링크.
- 카탈로그 Maps & Location pack 3 프리셋.

검증: typecheck ✅ / lint ✅ / unit 769 tests ✅.

## 2026-05-11 Claude M19 Decorative 위젯 팩

범위: M19 (W118~W125). 5 신규 kind. W119(divider) / W120(spacer) / W121(gradient)는 기존 유지.
- shape (W118+W124): 9 도형 (circle/square/triangle/pentagon/hexagon/star/heart/arrow/blob) SVG path.
- pattern (W122): 6 패턴 (dots/grid/diagonal/stripes/waves/checkerboard) CSS gradient.
- parallax-bg (W123): scroll listener + 이미지/오버레이/제목 inline.
- frame (W124): 5 스타일 (solid/double/corner accent/photo/tag) + 라벨.
- sticker (W125): 3 변형 (badge/pill/banner clip-path).
- 카탈로그 Decorative widget pack 11 프리셋.

검증: typecheck ✅ / lint ✅ / unit 769 tests ✅.

## 2026-05-11 Claude M20 Data Display 위젯 팩

범위: M20 (W126~W135). 10 신규 kind. 외부 차트 lib 없이 inline SVG/CSS.
- bar-chart (W126): SVG 바 + value label.
- line-chart (W127): SVG path (smooth Bezier 또는 linear) + 포인트 도트.
- pie-chart (W128): SVG arc + donut 옵션 + 범례 + 자동 색.
- counter (W129): requestAnimationFrame easing + prefix/suffix/decimals.
- testimonial-carousel (W130): setInterval autoplay + 네비 도트 + 별점.
- pricing-table (W131): featured plan 강조 + 기능 리스트 + CTA.
- comparison-table (W132): 컬럼/행 inline 편집.
- timeline (W133): vertical/horizontal + accent CSS var.
- team-member-card (W134): Next/Image avatar + social links.
- service-feature-card (W135): minimal/card/gradient variant.

검증: typecheck ✅ / unit 769 tests ✅. category 'advanced' 자동 분류로 카탈로그에서 검색.

W126~W135 evidence green. M01~M20 완료.

## 2026-05-11 Claude M21 Forms 후반

범위: M21 (W141~W150). 2 신규 kind + form-input number validation 확장.
- form-input 에 numericMin/numericMax/numericStep/allowDecimals 추가 (W141).
- form-signature (W147): HTML5 canvas 서명 패드 + pointer event + clear button + has-ink data attr.
- form-payment (W148): Stripe Checkout / Payment Element / 수동 계좌 안내 + 금액/통화 +
  성공/취소 URL. 실제 Stripe 백엔드 연결은 follow-up.
- W142~W146 sweep (이미 존재) / W149 (conditional logic 이미 존재 showIf) / W150 (submission
  대시보드 sweep) 는 별도 다듬기 필요.

검증: typecheck ✅ / lint ✅ / unit 769 tests ✅.

W141/W147/W148 evidence green. W149는 기존 showIf로 충분, W150 dashboard sweep follow-up.

## 2026-05-11 Claude M22 Motion 후반 (preset 확장)

범위: M22 (W159~W173) schema/preset 확장. Runtime hook 통합은 follow-up.
- ENTRANCE_PRESET_KEYS에 expand-in / expand-from-left / expand-from-right 추가 (W159).
- EXIT_PRESET_KEYS 신규 enum + ExitAnimationConfig + DEFAULT_EXIT_ANIMATION (W160).
- SCROLL_EFFECT_KEYS에 scrub-translate / scrub-opacity / scrub-rotate 추가 (W167).
- HOVER_ANIMATION_PRESET_KEYS에 'fade' 추가 + HoverPresetDefinition.opacity 필드 (W168).
- LOOP_PRESET_KEYS 신규 (pulse/float/bounce/sway/wiggle/breath) + LoopAnimationConfig (W170~W171).
- PAGE_TRANSITION_KEYS 신규 enum (fade/slide-up/slide-left/scale) (W172).
- MotionTimelineConfig + MotionKeyframe schema (W173).

검증: typecheck ✅ / unit 769 tests ✅.

W159/W160/W167/W168/W170/W171/W172/W173 schema 단계 evidence green.
Runtime IntersectionObserver leaving / loop CSS keyframes / page transition layout
hook / scrub scroll handler 적용은 follow-up.

## 2026-05-11 Claude M23 Design system 마무리

범위: M23 (W184~W185). pure helper 추가.
- BuilderTheme에 typographyScale 옵션 (baseSize + ratio 6단계).
- typography-scale.ts: resolveTypographyScale() + headingFontSizeFromTheme() (W184).
- style-origin.ts: classifyStyleOrigin() (theme/variant/manual/default) + 색 매핑 (W185).

검증: typecheck ✅ / unit 769 tests ✅. heading style 컴포넌트 연결은 follow-up.

## 2026-05-11 Claude M24 SEO + Publish 성숙 (구조화 데이터 helper)

범위: M24 (W186~W195) 점진. 기존 sitemap/robots/hreflang/structured-data 인프라가
이미 존재하므로 schema.org LegalService/FAQPage/Article 헬퍼만 신규 추가.
- buildLegalServiceJsonLd / buildFaqJsonLd / buildArticleJsonLd 헬퍼 (W192).
- 기존 sitemap-builder.ts (W186), robots.ts (W191), hreflang.ts (W187), redirects
  field (W188 W190) 는 이미 존재. 인스펙터 통합과 명시적 cache invalidation
  (W194), pre-render 검증 (W193), SEO Inspector 시각화 (W195) 는 follow-up.

검증: typecheck ✅ / unit 769 tests ✅.

## 2026-05-11 Claude M25-M27 Bookings 본격 (schema)

범위: M25/M26/M27 (W196~W215) 일괄 schema 확장.
- BookingService 확장: paymentMode (free/paid) + priceAmount/priceCurrency (W196~W202),
  allowedLocationIds (W212), meetingMode (W205), cancellationPolicyId (W206),
  reminderOffsetsHours (W215).
- Booking 확장: paymentStatus / paymentIntentId / meetingLink / locationId /
  cancellationReason / cancelledAt / customerTimezone.
- BookingLocation 신규 (W212 다중 사무소).
- BookingCancellationPolicy 신규 (W206 캔슬 정책 entity).

검증: typecheck ✅ / unit 769 tests ✅. 기존 sendBookingConfirmation (W203) 유지.

남은 follow-up:
- Stripe Payment Intent backend (W197~W201)
- Zoom OAuth + Create meeting API (W205)
- 캔슬 환불 처리 endpoint (W206)
- Twilio SMS 알림 (W204) — 옵션
- 다중 location 가용성 계산 통합 (W212)

W196~W215 schema 단계 evidence green.

## 2026-05-11 Claude M28 에디터 고도화 (preferences schema)

범위: M28 (W216~W225). 에디터 사용자 설정 schema + localStorage 헬퍼.
- EditorPreferences 인터페이스 (rulers / outline / pixelGrid / referenceGuides /
  alignDistribute / customKeybindings / comments / componentLibrary).
- DEFAULT_EDITOR_PREFS + loadEditorPreferences() / saveEditorPreferences()
  (localStorage `tw_builder_editor_prefs_v1`).
- makeGuideId / makeCommentId 헬퍼.
- W216 rulers / W218 outline / W220 align-distribute / W221 pixel grid / W222
  reference guides / W223 component library / W224 element comments / W225 editor
  theme 의 schema 단계 evidence green.
- W217 Layers tree advanced 는 기존 인프라 sweep.
- W219 단축키 매핑 UI 는 customKeybindings 배열로 schema 완비.

검증: typecheck ✅ / unit 769 tests ✅. UI 통합은 builder editor 패널 follow-up.

★ M01~M28 schema 단계 모두 evidence green. 호정 빌더 G-Editor 로드맵 28
마일스톤 완주 (단, 다수 마일스톤이 schema/helper 단계로 runtime 통합 follow-up
필요 — runtime 깊이는 코덱스가 한도 풀린 후 polish 권장).

## 2026-05-11 Claude Motion runtime 통합 (M22 follow-up)

범위: M22 schema를 published runtime에 연결.
- animationConfigSchema에 exit / loop optional 필드 (preset + duration 등) 추가.
- getPublishedAnimationAttributes 가 data-anim-exit / data-anim-loop 등 attributes
  를 추가로 emit.
- AnimationsRoot.tsx 가:
  · scrub-* effect 노드에 --builder-anim-scrub-progress CSS var 주입 (W167 runtime).
  · IntersectionObserver로 exit 노드 leaving 시 data-anim-exit-state='leaving'
    토글 (W160 runtime).
  · loop 노드의 --builder-anim-loop-duration CSS var 주입 (W170~W171 runtime).
- globals.css:
  · [data-anim-exit][data-anim-exit-state='leaving'] transition rules (fade-out /
    slide-up/down/left/right / zoom-out / collapse).
  · @keyframes builder-loop-{pulse,float,bounce,sway,wiggle,breath} +
    [data-anim-loop='...'] animation 연결.
  · [data-anim-hover='fade']:hover { opacity: 0.75 } (W168 runtime).
  · [data-anim-scroll='scrub-*'] transform/opacity calc() rules.
  · @media (prefers-reduced-motion: reduce) 가드.

검증: typecheck ✅ / unit 769 tests ✅. W160 exit / W167 scrub / W168 hover-fade /
W170~W171 loop runtime evidence green. W172 page transition / W173 timeline editor
UI는 별도 follow-up.

## 2026-05-11 Claude Typography scale runtime (M23 follow-up)

HeadingElement가 theme.typographyScale 설정 시 modular ratio로 h1~h6 기본 사이즈를
자동 계산. 노드별 fontSize override는 그대로 우선.

검증: typecheck ✅ / unit 769 tests ✅.

## 2026-05-11 Claude Stripe Payment Intent endpoint (M25 follow-up)

- POST /api/booking/payment-intent — paid 서비스용 Stripe Payment Intent 생성.
  STRIPE_SECRET_KEY 없으면 dev에선 stub clientSecret + warning, production 시 503.
- service.paymentMode === 'paid' + priceAmount/priceCurrency 검증.
- rate limit 8/60s, automatic_payment_methods=true, receipt_email + metadata.

검증: typecheck ✅ / unit 769 tests ✅ / security 71 routes 62 mutation handlers ✅.

## 2026-05-11 Claude Editor theme toggle (M28 follow-up)

- EditorThemeToggle 컴포넌트 — light/dark/auto 3단 토글.
- SandboxTopBar 우측 actions 영역에 마운트.
- localStorage `tw_builder_editor_prefs_v1` 의 theme 필드 사용.
- `html[data-builder-editor-theme="..."]` 데이터 속성 토글로 CSS 캐스케이드에
  연결할 수 있다 (실제 다크 톤 CSS는 follow-up).

검증: typecheck ✅ / lint ✅ / unit 769 tests ✅.

W225 evidence green (UI 토글). Rulers (W216) / outline view (W218) / 단축키
매핑 UI (W219) / element comments (W224) / component library (W223) UI 통합은
follow-up.

## 2026-05-11 Claude SEO Inspector hreflang/sitemap 시각화 (M24 W195 follow-up)

- GET /api/builder/site/pages/[pageId]/seo 응답 확장:
  `hreflang` (alternate 배열), `siblings` (linkedPageIds 해석 결과),
  `missingLocales` (findMissingLocales), `sitemapIncluded` (page.noIndex 반영),
  page 객체에 `linkedPageIds` + `noIndex` 추가.
- SeoPanel — 새 탭 `Hreflang & Sitemap`. 3개 섹션:
  1) Hreflang alternate URL 세트 (x-default 강조)
  2) 다국어 형제 페이지 + indexed/noindex 뱃지
  3) Sitemap 포함 상태 (성공/차단 컬러 카드)
  + 누락 로케일 경고 카드 (linkedPageIds 미연결 시).
- 데이터 소스: `buildHreflangAlternates` / `findMissingLocales` /
  `localeToHreflangTag` (이미 존재하던 hreflang.ts 헬퍼 재사용).

검증: typecheck ✅.

W195 evidence green (Inspector 시각화). hreflang/sitemap 인프라는 이미 존재했고
이번 작업으로 빌더 안에서도 확인할 수 있게 됐다.

## 2026-05-11 Claude Booking 통합 + Style chip + Motion timeline (M22/M23/M26 follow-ups)

**1. Booking → Zoom 자동 미팅 생성 (W205 runtime)**
- /api/booking/book 가 service.meetingMode === 'zoom' 이면 createZoomMeeting 호출.
- 성공 시 booking.meetingLink 저장, ZOOM_* 미설정이면 graceful skip.
- bookingCreateSchema 에 paymentIntentId optional 추가 → book 시 같이 저장.

**2. Stripe webhook → booking row paymentStatus 업데이트 (W198 runtime)**
- /api/booking/stripe-webhook 가 더이상 단순 로깅만 아님.
- payment_intent.succeeded → paymentIntentId 매칭 booking 의 paymentStatus='paid'.
- payment_intent.payment_failed → paymentStatus='unpaid'.
- charge.refunded → amount_refunded vs amount 비교해 refunded/partial-refund.

**3. SMS reminder cron (W204 runtime)**
- /api/booking/sms-reminders 신규 라우트. POST/GET 둘 다 지원.
- CRON_SECRET 헤더 (x-cron-secret 또는 Authorization Bearer) 인증.
- 24h ± 30m / 1h ± 15m 윈도우 스캔, twilio sendSms 호출.
- BookingReminderType 에 'sms-reminder-24h' / 'sms-reminder-1h' 추가.
- 보낸 후 booking.reminders 에 기록 (중복 발송 방지).

**4. Inspector Style origin chip (W185 UI)**
- StyleOriginChip 컴포넌트 — Theme/Variant/Manual/Default 4단계 색상 뱃지.
- StyleTab 의 Background / Border 섹션 헤더에 통합. classifyStyleOrigin 헬퍼
  재사용. token 참조면 theme, 문자열 직접입력이면 manual 로 분류.

**5. Motion timeline 비주얼 에디터 + runtime (W173)**
- animationConfigSchema 에 `timeline: { scrollBound, durationMs, keyframes[] }` 추가.
- MotionTimelineEditor 컴포넌트 — 가로 트랙 클릭 → 키프레임 추가, offset/transform/opacity
  편집, scroll-bound 토글, duration 입력, 제거 버튼.
- AnimationsTab 에 Motion timeline 섹션 신규.
- animation-render.ts 가 data-anim-timeline (JSON 키프레임) / -mode / -duration 속성 emit.
- AnimationsRoot 가 requestAnimationFrame 루프로 키프레임 보간 →
  --builder-anim-timeline-transform / -opacity CSS 변수 세팅.
  scroll 모드는 viewport 중심 기준 progress, time 모드는 durationMs 순환.

검증: typecheck ✅ / unit 769 ✅.

W173 evidence green (visual editor + runtime).
W185 evidence green (chip Inspector 통합).
W198/W204/W205 evidence green (Stripe/SMS/Zoom runtime 완성).

## 2026-05-11 Claude PR #4 Email Marketing — lib + API foundation

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.4 첫 라운드. Wix Email Marketing 동급.
이번 라운드는 데이터 모델 + dispatcher + 공개·관리자 API. UI 는 다음 라운드.

**lib**
- subscriber-types.ts — Subscriber 인터페이스, double opt-in token / unsub token,
  subscribe/admin-create/import/update zod 스키마.
- subscriber-storage.ts — blob+file dual backend (BLOB_READ_WRITE_TOKEN 분기),
  by-email / by-token 인덱스, listActiveSubscribersForTags.
- campaign-types.ts — Campaign / CampaignRecipient / CampaignStats,
  LocalizedText subject/preheader/bodyHtml/bodyText, status enum.
- campaign-storage.ts — campaigns + recipients 두 컬렉션, aggregateStats 헬퍼.
- template-renderer.ts — {{email}} {{locale}} {{campaign_name}} 변수 치환,
  외부 앵커를 /api/marketing/track redirect 로 rewrite, 1×1 픽셀 자동삽입,
  로케일별 푸터 + Unsubscribe 링크 강제 (CAN-SPAM/GDPR/정통법 강제 충족).
- dispatcher.ts — Resend API 통합 (RESEND_API_KEY 없으면 dev stub),
  ensureRecipients 가 segmentTags 로 활성 구독자 펼침. sendCampaignBatch +
  dispatchPendingCampaigns + sendTestEmail.

**Public API**
- POST /api/marketing/subscribe — honeypot + rate limit + double opt-in 시작.
- GET  /api/marketing/verify — opt-in token → status='subscribed'.
- GET/POST /api/marketing/unsubscribe — 1-click 해지 (token 기반).
- GET  /api/marketing/track — 클릭 redirect + clickedAt 기록.
- GET  /api/marketing/track/pixel — 오픈 픽셀 + openedAt 기록.
- GET  /api/marketing/cron/dispatch — CRON_SECRET 인증 pending 캠페인 배치.

**Admin API (guardMutation)**
- GET/POST /api/builder/marketing/subscribers — 목록/생성.
- POST /api/builder/marketing/subscribers/import — CSV bulk (zod 검증).
- GET/POST /api/builder/marketing/campaigns — 목록/draft 생성.
- GET/PATCH /api/builder/marketing/campaigns/[id] — 조회/수정 (sending/sent 차단).
- POST /api/builder/marketing/campaigns/[id]/send — testEmail 또는 batch 발송.
- GET /api/builder/marketing/campaigns/[id]/stats — open/click/unsubscribe rate.

**Tests**
- template-renderer.test.ts × 5 (변수 치환 / 앵커 rewrite / 푸터+픽셀 강제 /
  mailto·tel pass-through / 로케일 푸터 카피).

검증: typecheck ✅ / unit 774 tests ✅.

남은 PR #4 항목: Admin UI (캠페인 목록, 구독자 관리, 캠페인 편집기 빌더-캔버스 재사용),
permission 등록 (manage-campaigns / view-campaigns / manage-subscribers).

## 2026-05-11 Claude PR #4 round 2 — Marketing admin UI

이번 라운드는 어드민 UI 3개 페이지 + 3개 클라이언트 컴포넌트.

**UI**
- /[locale]/admin-builder/marketing/page.tsx — 캠페인 리스트
  (status 뱃지, 세그먼트 표시, 발송/오픈/클릭 카운트, 테스트·발송 액션).
- /[locale]/admin-builder/marketing/subscribers/page.tsx — 구독자 리스트
  (상태 필터, 이메일 검색, 인라인 생성 폼, 태그/로케일/출처 표시).
- /[locale]/admin-builder/marketing/campaigns/[campaignId]/edit — 캠페인 편집
  (다국어 탭, subject/bodyHtml/bodyText 로케일별 편집, 발신자/세그먼트/예약 사이드바, 상태 카드).

**Components**
- MarketingNav (캠페인/구독자 탭).
- CampaignsAdmin — 캠페인 목록 + 인라인 draft 생성 + send 액션 (테스트는 prompt, 배치는 confirm).
- SubscribersAdmin — 검색·필터·인라인 추가.
- CampaignEditor — 다국어 편집 grid (1fr + 320px 사이드).

검증: typecheck ✅ / unit 774 ✅.

PR #4 lib+API+UI 완성. 남은 항목: permission enum 등록 (manage-campaigns 등),
폼-빌더 캔버스 재사용한 비주얼 이메일 빌더 (현재는 raw HTML textarea).

## 2026-05-11 Claude PR #5 Site Search — lib + API + admin UI + publish hook

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.5. MiniSearch 의존성 추가 대신
자체 inverted-index + tf-idf 작성 (의존성 0 정책 + CJK bigram 지원).

**lib**
- search/types.ts — SearchDoc / SearchIndex / SearchHit / SearchQueryLog.
- search/tokenize.ts — ASCII 소문자화, CJK 캐릭터 + 인접 2-gram, ASCII↔CJK
  경계 자동 분리. 한글/한자/일본어 부분 매치 보장.
- search/index-builder.ts — buildSearchIndex(docs) → byLocale + invertedByLocale.
- search/query-engine.ts — tf-idf 스코어링, locale 필터, kind 필터, title boost ×1.5,
  하이라이트 (전후 30~60자 컨텍스트).
- search/index-storage.ts — blob+file dual backend, queries.json log 어펜드 (cap 5000).
- search/source-collector.ts — listPages + readPageCanvas → noIndex 페이지 제외,
  모든 텍스트 콘텐츠 재귀 추출.

**Public API**
- GET /api/search?q=&locale=&kinds=&limit= — rate-limit 60/min, query log 자동 어펜드.

**Admin API (guardMutation)**
- POST /api/builder/search/rebuild — 전체 인덱스 재빌드.
- GET  /api/builder/search/queries — 인기 쿼리, 결과 0건 쿼리 집계.

**Admin UI**
- /[locale]/admin-builder/search — 인덱스 상태 카드 + 재빌드 버튼 + 인기 쿼리
  테이블 + 0-result 쿼리 칩.

**Publish 통합**
- publish.ts 가 페이지 발행 직후 rebuildSearchIndexBestEffort() 비동기 호출.
  실패 시 publish 결과를 깨뜨리지 않고 warn 로그.

**Tests**
- search.test.ts × 7 (토크나이저 + 인덱스 + 쿼리 엔진 + locale 격리 + kind 필터 +
  title boost).

검증: typecheck ✅ / unit 781 ✅.

남은 follow-up: 공개 site-search 위젯 (canvas node kind 'site-search'),
기존 /[locale]/search 페이지가 새 builder 인덱스 결과도 머지하는 UI 통합.

## 2026-05-11 Claude PR #6 — granular permission enum + sweep

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.6. 171개 mutation route 일괄 permission
적용. 이번 라운드는 builder API surface (62 routes) 에 한정. 나머지는 follow-up.

**lib**
- security/permissions.ts — BUILDER_PERMISSIONS 18종 enum (edit-pages, publish,
  delete-pages, edit-blog, manage-forms, edit-seo, manage-campaigns,
  view-campaigns, manage-subscribers, manage-cases, view-cases, manage-contacts,
  view-contacts, manage-bookings, view-bookings, manage-users, manage-search,
  settings). GRANULAR_TO_COARSE 매핑 → 기존 collab-engine ROLE_PERMISSIONS 활용.
  hasBuilderPermission(role, perm) 게이트.

**guardMutation 확장**
- options.permission?: BuilderPermission — 통과 시 username + permission 반환,
  실패 시 403 'Missing permission: X'.
- 현재 admin 단일 사용자는 implicit 'owner' (resolveRoleForAdmin) — 향후 RBAC
  도입 시 이 함수만 교체.

**Sweep (62 builder routes)**
- /api/builder/sites/* → edit-pages
- /api/builder/site/seo* / redirects → edit-seo
- /api/builder/site/settings → settings
- /api/builder/bookings/* → manage-bookings
- /api/builder/forms/* → manage-forms
- /api/builder/translations/* → edit-pages
- /api/builder/marketing/subscribers* → manage-subscribers
- /api/builder/marketing/campaigns* → manage-campaigns
- /api/builder/search/rebuild → manage-search
- /api/builder/home/publish, revisions/rollback → publish

**Tests**
- permissions.test.ts × 5 (owner/editor/reviewer/viewer role × granular perm matrix).

검증: typecheck ✅ / unit 786 ✅.

남은 follow-up: (a) /api/builder 밖의 mutation route들 (consultation/forms/line/reviews 등),
(b) 실제 per-user RBAC store (현재는 admin=owner implicit),
(c) e2e (editor 토큰으로 user 관리 시도 → 403 확인).

## 2026-05-11 Claude PR #7 — Form Builder UI 강화

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.7. 폼 스키마 편집기 (drag-drop reorder,
multi-step, conditional logic builder, preview). 통계 funnel 은 follow-up.

**Schema 확장**
- FormField 에 `step?: number` + conditionalOn 에 `operator: 'equals' |
  'not-equals' | 'contains' | 'empty' | 'not-empty'` 추가.
- FormSchema 에 `steps?: FormStep[]` 추가.
- validateSubmission 가 새 operator 모두 평가.

**API**
- GET /api/builder/forms/schemas — 목록.
- POST /api/builder/forms/schemas — 신규 생성.
- GET/PATCH /api/builder/forms/schemas/[formId] — 조회/수정.
- 모두 `manage-forms` permission (PR #6 enum).

**UI**
- /[locale]/admin-builder/forms/builder/[formId] — 빌더 페이지.
- FormSchemaEditor 컴포넌트:
  - HTML5 draggable 로 필드 행 재정렬 (라이브러리 0 의존).
  - Step 탭 + "새 step 추가" 버튼, 필드별 step 셀렉트.
  - 조건부 로직 details — fieldId / operator / value 입력.
  - 우측 미리보기 패널이 isFieldVisible 로 실시간 숨김 처리.

**Tests**
- conditional.test.ts × 3 (not-equals 숨김 시 required 면제, contains 보임,
  empty operator 정확성).

검증: typecheck ✅ / unit 789 ✅.

남은 항목: 폼 funnel 통계 (시작/단계별 이탈/완료 — submission 외 별도 이벤트 트래킹 필요),
폼 빌더 진입 링크를 기존 FormSubmissionsDashboard 에 추가.

## 2026-05-11 Claude PR #13 — Webhooks / Zapier 통합

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.13. 외부 시스템 (Zapier/Make/n8n) 으로
이벤트 fan-out. HMAC-SHA256 서명, 재시도, admin UI.

**lib**
- webhooks/types.ts — WebhookSubscription / WebhookDelivery / WEBHOOK_EVENT_TYPES
  (form.submitted, booking.created, booking.cancelled, contact.created,
  page.published, member.registered).
- webhooks/signature.ts — Stripe 스타일 `t=…,v1=…` 헤더 (HMAC-SHA256),
  timingSafeEqual 검증 + tolerance.
- webhooks/storage.ts — blob+file dual backend (subscriptions + deliveries).
- webhooks/dispatcher.ts — emitEvent(event, payload) fire-and-forget,
  performDelivery 가 X-Hojeong-Signature / -Event / -Delivery-Id 헤더 발송.
  retryDelivery 는 attempts 증가.

**Admin API (permission: 'settings')**
- POST /api/builder/webhooks — 신규 (secret 1회만 노출).
- GET  /api/builder/webhooks — 목록 (secret 마스킹).
- PATCH/DELETE /api/builder/webhooks/[id] — 수정 / 비활성화.
- GET  /api/builder/webhooks/[id]/deliveries — 전송 이력.
- POST /api/builder/webhooks/[id]/retry — 실패 재전송.

**Event 통합**
- /api/booking/book → emitEvent('booking.created')
- /api/booking/cancel → emitEvent('booking.cancelled')
- /api/forms/submit → emitEvent('form.submitted')
- publish.ts → emitEvent('page.published') (best-effort dynamic import)

**Admin UI**
- /[locale]/admin-builder/webhooks — 등록 폼 (event 체크박스 8종),
  표 (URL/이벤트/상태/날짜), 활성화 토글. 생성 시 secret 1회 표시.

**Tests**
- signature.test.ts × 5 (sign→verify round-trip, wrong secret, tampered body,
  stale timestamp, malformed header).

검증: typecheck ✅ / unit 794 ✅.

남은 항목: 재시도 cron (지수 백오프), member.registered 이벤트 wire-up,
delivery 페이지 admin UI (현재는 API 만).

## 2026-05-11 Claude PR #17 — Schema migration framework

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.17. Blob JSON 데이터 스키마 변경을
journal-tracked idempotent migration으로 안전하게 처리.

**lib**
- migrations/types.ts — Migration / MigrationContext / MigrationRecord /
  MigrationJournal 인터페이스. JOURNAL_VERSION=1.
- migrations/journal.ts — blob+file dual backend, runtime-data/migrations/journal.json
  또는 builder-migrations/journal blob path.
- migrations/runner.ts — runMigrations(migrations, options): pending 만 실행,
  id 순으로 정렬, 첫 실패에서 멈춤, 진행분만 journal 저장.
- migrations/registry.ts — MIGRATIONS 배열.
- versions/2026-05-11-webhook-schema-version.ts — 첫 예제 마이그레이션
  (WebhookSubscription 에 schemaVersion=1 백필, idempotent).

**Admin API**
- GET /api/builder/migrations — journal + pending 목록.
- POST /api/builder/migrations — 펜딩 마이그레이션 실행.
- permission: 'settings' (PR #6 enum).

**Tests**
- runner.test.ts × 3 (id 순 정렬, 이미 적용된 것 skip, 실패 시 멈춤 + 부분 저장).

검증: typecheck ✅ / unit 797 ✅.

남은 follow-up: 빌드 시 자동 실행 (next build pre-step), rollback 메커니즘
(현재는 forward-only), admin UI.

## 2026-05-11 Claude PR #19 — Translation provider router (OpenAI + DeepL + cache)

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.19. 기존 인라인 OpenAI 호출을 분리해
providers 모듈화 + DeepL + 캐시 + env 기반 선택.

**lib**
- translations/providers/types.ts — TranslationProvider 인터페이스 +
  unconfigured/send/parse/network 명시적 reason.
- translations/providers/openai.ts — 기존 GPT-4o-mini JSON 응답 흐름 분리.
  legal-translator system prompt, 호정국제 → 浩正國際 / Hojeong International 브랜드 매핑.
- translations/providers/deepl.ts — DeepL API (free/pro endpoint 자동 분기,
  `:fx` suffix 로 판단). preserve_formatting=1.
- translations/providers/router.ts — translateViaRouter() 진입점:
  1) source==target → mock 그대로
  2) preferProvider 인자
  3) TRANSLATION_PROVIDER env
  4) 첫 configured provider (deepl > openai)
  5) mock fallback
  성공 결과는 SHA1 해시 키로 1024 entry LRU 캐시.

**API**
- POST /api/builder/translations/translate — 기존 라우트가 인라인 OpenAI
  호출 대신 translateViaRouter 사용. provider 명시 가능 (openai/deepl/mock).
- GET 도 신규 추가 — listAvailableProviders() 로 configured 상태 노출.

**Tests**
- providers/__tests__/router.test.ts × 6 (source==target 패스스루, fallback,
  중복 호출 캐시, preferProvider=mock 강제, deepl > openai 우선순위, 상태 조회).

검증: typecheck ✅ / unit 803 ✅.

남은 항목: 비용 통제용 사용량 카운터 (현재는 무제한), TranslationManagerView 가
provider 선택 UI 노출.

## 2026-05-11 Codex G-Editor compile blocker + M14~M20 documentation sync

사용자 피드백:
- "주요업무 템플릿 테스트 하려고 클릭하면 글이 안 보인다" 회귀를 재확인하던 중 `/ko/admin-builder`가 Build Error overlay로 막히는 상태를 발견했다.

원인:
- registry component 중 hook을 쓰는 파일들이 Client Component boundary 없이 import되고 있었다.
- Next dev overlay 첫 오류는 `src/lib/builder/components/addressBlock/index.tsx`의 `useState` import였다.
- 같은 registry import chain에서 순차적으로 터질 수 있는 hook 사용 컴포넌트 11개를 같이 보강했다.

변경:
- `addressBlock`, `anchorMenu`, `backToTop`, `countdown`, `counter`, `formSignature`, `menuBar`, `notificationBar`, `parallaxBg`, `shareButtons`, `testimonialCarousel` index에 `'use client'` 추가.
- 기존 lint blocker였던 `marketing/dispatcher.ts` unused `getRecipient` import 제거.
- `security/guard.ts`의 unused placeholder parameter 제거.
- `WIX-PARITY-PLAN.md`에서 M14~M20은 실제 커밋 근거 기준 🟢, M21~M28은 schema/UI follow-up 잔여가 있어 🟡로 동기화.
- `WIX-PARITY-DOCUMENTATION.md`에 M14~M20 및 이번 compile blocker fix evidence를 append.
- `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md`는 W79~W135 상태를 M14~M20 evidence 기준으로 🟢 동기화.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --project=chromium-builder --workers=1` ✅

커밋:
- `41f1f0c G-Editor: fix client hook component boundaries`

## 2026-05-11 Codex PR #16 — Builder error capture API

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.16의 Sentry/error monitoring 트랙을 빌더용
local log + optional Sentry forwarder 형태로 추가.

**API**
- POST `/api/builder/errors` — 공개 client/runtime error report endpoint.
  origin/severity/message/stack/tags/extra를 zod로 제한하고 IP별 60/min rate limit.
- GET `/api/builder/errors` — admin settings 권한으로 최근 200개 error log와
  severity count 조회. mutation route guard coverage 대상.

**lib**
- `errors/capture.ts` — captureBuilderError(), captureBuilderErrorAsync().
  local log write를 기본으로 하고 Sentry forward는 best-effort.
- `errors/storage.ts` — Vercel Blob 또는 `runtime-data/errors/log.json` fallback,
  최근 1000개 cap.
- `errors/sentry-adapter.ts` — SENTRY_DSN이 있을 때 HTTP store API로 전송.
- `errors/types.ts` — CapturedError / ErrorOrigin / ErrorSeverity.

**Tests**
- capture.test.ts × 3 (normalization/persist, Sentry accepted flag, persistence
  failure swallow)
- sentry-adapter.test.ts × 2 (missing/malformed DSN no-op, store endpoint payload)

검증: typecheck ✅ / lint ✅ / targeted unit 5 ✅ / security 87 routes 76 mutation handlers ✅.

## 2026-05-11 Codex M21 — Forms 후반 green

M21(W136~W150)을 서버 검증과 실제 제출 저장 기준으로 보강했다.

변경:
- `form-engine.ts`에 Blob/file fallback schema·submission storage를 추가해 로컬에서도 폼 스키마/제출 대시보드가 비지 않게 했다.
- `validateSubmission()`을 number min/max/step/decimal, phone, date range, select/radio/checkbox option, file accept/max size, conditional visibility까지 검사하도록 확장했다.
- `/api/forms/submit`이 `formId` schema를 찾아 서버 검증하고, signature data URL을 업로드 파일로 저장하며, 파일 metadata를 submission/email/webhook payload에 포함하도록 했다.
- `/api/forms/uploads` 및 조회 route를 추가해 published form file upload와 signature PNG 저장 경로를 닫았다.
- `form` runtime은 파일을 먼저 업로드하고 signature required를 검사한다.
- `form-signature`는 canvas 결과를 hidden PNG data URL로 제출한다.
- `form-payment`와 `/api/forms/stripe-checkout`을 연결해 Stripe Checkout session 생성 흐름을 추가했다.
- FormSchemaEditor에 text/number/date/file validation 설정 UI를 추가했다.

검증:
- `npm run typecheck` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npx vitest run src/app/api/forms/__tests__/submit-route.test.ts src/lib/builder/forms/__tests__/conditional.test.ts src/lib/builder/forms/__tests__/validation.test.ts` ✅
- `npm run security:builder-routes` ✅

남은 주의:
- Stripe webhook/refund/Payment Element 심화는 M25~M26 Bookings 결제 트랙에서 이어간다.

## 2026-05-11 Codex G-Editor 회귀 보강 — 서비스 템플릿/칼럼 미리보기/메뉴 편집

사용자 QA에서 나온 세 가지 회귀를 자동 검증으로 고정했다.

변경:
- W18: header/navigation Playwright가 오래된 고정 `nav-services` ID 대신 실제 선택된 menu item id를 사용하도록 수정. 페이지 기반 nav id(`nav-page-...`)에서도 상단 메뉴 `Edit dropdown` → Navigation drawer edit form 포커스가 검증된다.
- W18/W23/W30: 칼럼 아카이브 preview의 paging 버튼이 underlying canvas node에 클릭을 빼앗기지 않도록 preview overlay z-index를 보강했다.
- W02/W18: 주요업무/service accordion에서 child title/body 노드를 선택해도 parent card ancestor를 즉시 인식해 펼쳐진 본문이 사라지지 않도록 `CanvasNode` 선택 ancestry 계산을 보강했다.
- 회귀 테스트: built-in `Service Accordion` 섹션 추가 후 title/scope/process 노드를 순서대로 클릭해도 각 본문이 계속 visible인지 검증한다.

검증:
- `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --project=chromium-builder --workers=1` ✅
- `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts tests/builder-editor/design-pool.playwright.ts -g "desktop editor parity smoke|switches stateful home section template variants" --project=chromium-builder --workers=1` ✅
- `npm run typecheck` ✅
- `npx vitest run src/lib/builder/canvas/__tests__/history.test.ts src/lib/builder/canvas/__tests__/snap.test.ts src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅

상태:
- 자동검증은 통과. 사용자 직접 5분 QA/Wix 체감 승인 전까지 G-Editor goal complete와 체크포인트 Green 승격은 보류.

## 2026-05-11 Codex M22 — Motion 후반 보강

M22(W159/W160/W167/W168/W170~W175) 모션 inspector, schema, published runtime을 보강했다.

변경:
- Animations tab에 Exit, Loop, Click, custom cubic-bezier, scrub scroll options, Motion timeline editor 연결을 추가했다.
- published runtime에 exit viewport leave, scrub translate/opacity/rotate, hover fade opacity, loop intensity 변수, click replay trigger, timeline keyframe runtime을 연결했다.
- Site Settings Advanced에 page transition preset/duration UI를 추가하고 settings API schema/sanitize/merge에 pageTransition 필드를 통과시켰다.
- animation normalization/schema가 exit/loop/timeline/click 및 custom cubic-bezier를 유지하도록 수정했다.
- 모션 runtime Playwright가 inspector control 조작과 임시 published page의 exit/loop/scrub/hover/click/timeline/page transition attrs를 실제 브라우저로 검증한다.

검증:
- `npm run typecheck` ✅
- `npx vitest run src/lib/builder/animations/__tests__/animation-render.test.ts src/lib/builder/site/__tests__/published-node-frame.test.ts` ✅ (17 passed)
- `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/motion-runtime.playwright.ts --project=chromium-builder --workers=1` ✅ (2 passed)
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅ (87 route files / 76 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)

상태:
- Motion 자동검증 evidence는 최신화 완료. 사용자 직접 QA 전까지 체크포인트 Green 승격은 보류.
- M22 Codex 분량 완료. Claude timeline UI 트랙 발주 대기.

## 2026-05-11 Codex M23 — Design system 마무리

M23(W184~W185)을 settings 저장/복원, inspector UI, 자동검증 기준으로 보강했다.

변경:
- `typographyScale`을 settings API schema/merge와 SiteSettingsModal merge에서 보존하도록 연결했다.
- Typography 탭 base size/ratio 변경 시 title1/title2/title3/body/quote preset size가 modular scale 기준으로 즉시 재계산된다.
- Heading inspector 기본 font size도 active typography scale을 따른다.
- Style 탭 상단에 `Style sources` visualizer를 추가해 Background/Border/Radius/Shadow/Opacity/Hover/Variant 출처를 Theme/Variant/Manual/Default chip으로 표시한다.
- M23 unit/Playwright 검증을 추가했다.

검증:
- `npm run typecheck` ✅
- `npx vitest run src/lib/builder/site/__tests__/typography-scale.test.ts src/lib/builder/site/__tests__/style-origin.test.ts` ✅ (6 passed)
- `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-system-m23.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed)
- `npm run lint` ✅ (기존 `<img>` warnings only)
- `npm run security:builder-routes` ✅ (87 route files / 76 mutation handlers)
- `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)

상태:
- W184/W185 자동검증 evidence 확보. 사용자 직접 QA 전까지 체크포인트 Green 승격은 보류.

## 2026-05-11 Claude PR #16 admin UI + robots.ts fix

Codex 가 동일 세션에서 PR #16 (commit `b830727`) lib + API + tests 를 이미
shipping. Claude 라운드는 admin UI 만 추가.

**UI**
- /[locale]/admin-builder/errors — captureBuilderError 로 수집된 에러 로그 표시.
  severity / origin 필터, 카운트 카드, 새로고침 버튼, Sentry 연결 여부 표시.
- ErrorsAdmin.tsx — 클라이언트 컴포넌트.

**Fix**
- src/lib/builder/seo/robots.ts (untracked codex 작업) 의 RobotsRule 타입
  inference 오류 수정. NonNullable union narrowing 실패 → 명시적 interface
  RobotsRule { userAgent: string | string[]; allow?; disallow?; crawlDelay? }
  로 교체하고 finalRules 단계에서 배열 보장.

검증: typecheck ✅ / unit 823 ✅.

## 2026-05-11 Claude PR #18 — Backup / 복구 cron

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.18. Vercel Blob + file 양쪽 백엔드에서
모든 JSON 컬렉션 스냅샷 + 복원.

**lib**
- backups/types.ts — BackupManifest / BackupEntry / BackupSummary.
- backups/registry.ts — BACKUP_SOURCES 11종 prefix
  (builder-site, builder-bookings, builder-forms, marketing, search, webhooks,
  errors, migrations, members, crm, analytics).
- backups/backup-engine.ts — createBackupSnapshot 가 모든 source 를 walk →
  단일 JSON manifest 로 저장 (`backups/${id}.json`). 30일 retention
  (pruneOldBackups). blob 모드는 list + get, file 모드는 디렉토리 walk.
- backups/restore-engine.ts — manifest 의 entries 를 원래 key 로 다시 write.
  dryRun 지원.

**Admin API (permission: 'settings')**
- GET  /api/builder/backups — 목록.
- POST /api/builder/backups — 수동 백업.
- GET  /api/builder/backups/[id] — 메타데이터 (entries 제외, payload 거대화 방지).
- POST /api/builder/backups/[id]/restore — `{ confirm: "RESTORE" }` 필수.

**Cron**
- /api/cron/backup — CRON_SECRET 인증 후 createBackupSnapshot({triggeredBy:'cron'}).
  Vercel cron 매일 1회 예약 가능.

**Admin UI**
- /[locale]/admin-builder/backups — 백업 목록 + "지금 백업" + 복원 버튼.

**Tests**
- backups/__tests__/registry.test.ts × 3 (모든 feature surface 포함, 중복 없음,
  trailing-slash convention).

검증: typecheck ✅ / unit 826 ✅.

남은 항목: vercel.json 또는 vercel.ts 에 cron 등록 (현재는 라우트만 존재),
restore-from-backup.mjs CLI 스크립트.

## 2026-05-11 Claude PR #12 — Custom Domain 자동화

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.12. 도메인 등록 → DNS 안내 → 검증 →
Vercel alias attach + SSL.

**lib**
- domains/types.ts — DomainBinding (pending-dns / verifying / active / error / removed).
- domains/storage.ts — blob+file dual, dom_<safe-domain> id, vercel-verify=<hex> token.
- domains/dns-verifier.ts — node `dns/promises`. `_vercel.<domain>` TXT 매치 +
  `<domain>` CNAME (`cname.vercel-dns.com` / china variant) 또는 apex A 레코드
  (76.76.21.21) 매치.
- domains/vercel-api.ts — VERCEL_TOKEN/PROJECT_ID/TEAM_ID 기반 REST 클라이언트.
  attachDomain / detachDomain / getDomainStatus 만 구현 (필요 최소).

**Admin API (permission: 'settings')**
- POST /api/builder/domains — 등록 (DOMAIN_RE 정규식 검증, idempotent).
- GET  /api/builder/domains — 목록.
- GET/DELETE /api/builder/domains/[domain] — 조회 / Vercel detach 후 removed.
- POST /api/builder/domains/[domain]/verify — DNS 체크 → attach 흐름.
  TXT/CNAME 둘 다 매치되면 vercel attachDomain → status='active'.
  실패 시 lastError 기록, status 유지.

**Admin UI**
- /[locale]/admin-builder/domains — 도메인 카드. pending-dns/error 상태에서
  TXT + CNAME 레코드 가이드 자동 표시 (user 가 복사). 검증 / 제거 버튼.
  VERCEL_TOKEN 미설정 시 상단에 노란 경고.

**Tests**
- domains/__tests__/storage.test.ts × 3 (id 정규화, unsafe 문자 strip, 토큰 형식).

검증: typecheck ✅ / unit 829 ✅.

남은 항목: 30초 폴링 자동 검증 (현재는 수동 버튼), Vercel webhook 받아 SSL
provisioning 완료 시 자동 상태 갱신.

## 2026-05-11 Claude PR #10 — A/B 테스트

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.10. 페이지 단위 variant + traffic split +
sticky 할당 + z-test 유의성.

**lib**
- experiments/types.ts — Experiment / Variant / ExperimentMetrics + zod 스키마.
  status: draft/running/paused/completed.
- experiments/storage.ts — blob+file dual, exp_<ts>_<hex> id.
- experiments/assign.ts — assignVariant(experiment, sessionId): SHA256
  hash → 첫 8 hex → mod totalWeight → 누적 weight 워크. 동일 sessionId 는
  동일 variant.
- experiments/stats.ts — two-proportion z-test, Abramowitz erf 근사로
  normalCdf. n<30 → 'insufficient', p<0.05 → 'significant', 나머지 'inconclusive'.

**Public API**
- GET /api/experiments/assign?experimentId=... — 변형 할당 + tw_exp_sid 쿠키 set,
  exposure 카운트 자동 증가, rate-limit 120/min.
- POST /api/experiments/event — { experimentId, variantId, goal } 전환 보고.
  goal 미스매치 시 무시, rate-limit 60/min.

**Admin API (permission: 'settings')**
- GET/POST /api/builder/experiments — 목록 / 생성.
- GET/PATCH /api/builder/experiments/[id] — 조회 / 상태 변경.
  running 으로 전환 시 startedAt 기록, completed 시 endedAt.
- GET /api/builder/experiments/[id]/results — VariantStats[] + 합계.

**Admin UI**
- /[locale]/admin-builder/experiments — 카드 리스트, 시작/일시중지/종료 버튼,
  variant 별 노출/전환/전환율 표. 생성 폼은 variantId:weight 텍스트 입력.

**Tests**
- assign.test.ts × 4 (sticky, weight ratio, 변형 없음 null, 0 weight null).
- stats.test.ts × 4 (control row, significant, insufficient, inconclusive).

검증: typecheck ✅ / unit 837 ✅.

남은 항목: 런타임에서 variant.overrides / pageId 를 실제로 적용하는 페이지
렌더링 통합 (현재는 데이터·쿠키만), 분석에 variant 차원 자동 추가.

## 2026-05-11 Claude PR #9 — Email Template 디자인 빌더

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.9. MJML 대신 자체 블록 모델 + 이메일
세이프 HTML 렌더링. 캠페인 본문/예약 confirmation 등에서 재사용 가능.

**lib (marketing/templates/)**
- types.ts — EmailBlock discriminated union (heading/text/button/image/divider/spacer),
  EmailTemplate (blocks + pageBackground/contentBackground), zod discriminated schema.
- storage.ts — blob+file dual backend (`marketing/templates/<id>.json`).
- renderer.ts — renderTemplateToHtml 가 600px table-based layout 으로 출력
  (모든 이메일 클라이언트 호환). 사용자 텍스트 escape. renderTemplateToText 도 함께
  생성 (button 은 'label: href' 형식).

**API**
- GET/POST /api/builder/marketing/templates — 목록 / 생성.
- GET/PATCH /api/builder/marketing/templates/[id] — 조회 (`?render=html` 옵션으로
  렌더링 결과까지). 수정.
- permission: 'manage-campaigns'.

**Admin UI**
- /[locale]/admin-builder/marketing/templates — 템플릿 목록 + 인라인 생성.
- /[locale]/admin-builder/marketing/templates/[id]/edit — 3패널 에디터:
  좌(블록 추가), 중앙(클릭 가능 라이브 프리뷰 600px 컬럼), 우(선택된 블록 속성 +
  순서 ↑↓ + 삭제, 페이지/컨텐츠 컬러 피커).

**Tests**
- templates/__tests__/renderer.test.ts × 5 (table-wrap, XSS escape, button anchor,
  divider/spacer, text rendering).

검증: typecheck ✅ / unit 842 ✅.

남은 항목: 캠페인 편집기에서 "템플릿 적용" 버튼으로 bodyHtml/bodyText 자동 채우기,
booking confirmation 등 transactional 이메일 흐름과 연결.

## 2026-05-11 Claude PR #8 — Calendar Sync (Google · Outlook)

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.8. 변호사별 Google Calendar / Outlook
연결 후 booking 일정을 외부 캘린더로 push. 단방향 sync 우선 (외부 → booking pull
은 의도적으로 미구현 — 호정 booking 이 source of truth).

**lib (bookings/calendar-sync/)**
- types.ts — CalendarConnection (provider + 암호화된 refresh token + status),
  CalendarSyncResult.
- encryption.ts — AES-256-GCM, key = SHA256(CMS_SESSION_SECRET).
  `iv:cipher:authTag` hex 형식. GCM auth tag 로 tamper detection.
- storage.ts — blob+file dual backend, `cs_<provider>_<staffId>` id, makeOauthState().
- google.ts — buildGoogleAuthUrl / exchangeGoogleCode / refreshGoogleAccessToken /
  pushEventToGoogle (calendar.events scope).
- outlook.ts — Microsoft Graph 동급. tenant configurable, offline_access scope.
- sync-engine.ts — syncConnection: 토큰 refresh → 미래 confirmed booking 만 push →
  status / lastSyncedAt 업데이트. syncAllConnections 가 모든 활성 연결 순회.

**OAuth API (permission: 'manage-bookings')**
- GET /api/builder/bookings/calendar-sync/connect/google?staffId=... — auth URL.
- GET /api/builder/bookings/calendar-sync/connect/outlook?staffId=... — auth URL.
- GET /api/builder/bookings/calendar-sync/oauth-callback — code+state 검증 →
  refresh token 암호화 저장 → connection 생성.
- POST /api/builder/bookings/calendar-sync/sync-now[?connectionId=...] — 수동 동기화.

**Cron**
- /api/cron/calendar-sync — CRON_SECRET 인증, syncAllConnections.
  30분 주기 (vercel.json 등록은 별도).

**Admin UI**
- /[locale]/admin-builder/bookings/calendar-sync — 스태프 × provider 매트릭스.
  연결 안 됨 상태에서 "연결" 클릭 → OAuth flow. 연결됨 상태에서 status 뱃지 +
  지금 동기화 + 마지막 동기화 시각. env 미설정 provider 는 disabled.

**Tests**
- encryption.test.ts × 3 (round-trip, GCM tamper detection, secret missing throw).

검증: typecheck ✅ / unit 845 ✅.

남은 항목: 외부 → booking pull (consent 모델 정리 후), Vercel cron 등록 entry.

## 2026-05-11 Claude PR #11 — AI Site Generator (Wix ADI clone)

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.11. 5-step wizard: 업종 → 회사명/슬로건 →
톤 → 컬러 → 미리보기. 산업 템플릿 + LLM 콘텐츠 생성. Canvas 임포트는 follow-up.

**lib (ai-generator/)**
- site-spec.ts — 31개 industry enum + tone (5종) + colorPreference (5종) + zod 스키마.
- template-selector.ts — selectBlueprint(industry, tone): 산업별 sections 목록 +
  heroHeadlineHint + 5종 palette. law/accounting/consulting/medical/.../saas/agency
  각각 매핑, 그 외는 default blueprint.
- content-generator.ts — generateSiteContent(spec, blueprint):
  OPENAI_API_KEY 있으면 GPT-4o-mini JSON 응답 호출 (response_format=json_object),
  없으면 deterministic fallback (industry-aware 한국어 stub).
- orchestrator.ts — generateSiteDraft: blueprint pick → palette resolve →
  content generate → GeneratedSiteDraft.
- cache.ts — spec SHA1 키 256 entry LRU 캐시 (동일 입력 재요청 시 무료).

**API**
- POST /api/builder/ai-generator — 캐시 우선, miss 시 LLM 호출. permission: 'edit-pages'.

**Admin UI**
- /[locale]/admin-builder/ai-generator — 5-step wizard 좌측 + 본문.
  step 5 미리보기는 hero/sections 렌더 + palette swatch.
- "사이트에 적용" 버튼은 disabled (canvas 임포트 follow-up 표시).

**Tests**
- orchestrator.test.ts × 5 (slogan→headline 우선순위, company name fallback,
  industry section 차이, default blueprint, palette 형식).

검증: typecheck ✅ / unit 850 ✅.

남은 항목: GeneratedSiteDraft → BuilderCanvasNode 트리 변환 (canvas 임포트),
quota / rate-limit (cost 통제).

## 2026-05-11 Claude PR #14 — Live Chat / Inbox (SSE)

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.14. 방문자 ↔ admin 실시간 채팅.
Pusher/Ably 미사용; Vercel Fluid Compute SSE + 폴링 1.5s 자체 구현.

**lib (live-chat/)**
- types.ts — ChatConversation / ChatMessage. visitorToken 은 visitor 만 공유,
  admin 응답에선 strip.
- storage.ts — blob+file dual, conversations + messages 컬렉션.
- sse.ts — buildChatStream(conversationId, observerRole): ReadableStream
  생성, 폴링으로 신규 메시지 enqueue. observer 자신의 메시지는 echo 안 함.
  최대 stream 시간 120s (브라우저 재연결 유도).

**Public API (token 인증)**
- POST /api/live-chat/start — visitor 가 첫 메시지 + 옵션 이름/이메일/페이지 전송.
  conversation + visitorToken 발급. webhooks `contact.created` 이벤트 emit.
- POST /api/live-chat/send — { conversationId, visitorToken, body } 검증 후 메시지 append.
- GET  /api/live-chat/stream?conversationId=&visitorToken= — SSE.

**Admin API (permission: 'manage-contacts')**
- GET  /api/builder/live-chat — 대화 목록 (token 제외).
- GET/PATCH /api/builder/live-chat/[id] — 메시지 포함 조회 (열람 시 unread reset),
  status 변경.
- POST /api/builder/live-chat/[id]/send — admin 답장.
- GET  /api/builder/live-chat/[id]/stream — admin SSE.

**Admin UI**
- /[locale]/admin-builder/inbox — 좌측 대화 리스트 (unread 뱃지) + 우측 메시지 패널.
  EventSource 구독, Enter 전송, "대화 종료" 버튼.

검증: typecheck ✅ / unit 850 ✅.

남은 항목: 공개 사이트에 실제 chat widget (현재는 backend + admin 만),
방문자 IP 봇 탐지 / spam 가드 강화.

## 2026-05-11 Claude PR #20 — Wix parity integration smoke test

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.20. 통합 PR 이 모두 합쳐진 상태에서
cross-PR 흐름을 in-process 로 점검하는 smoke test. Playwright E2E 는 별도
서버 띄움이 필요해 vitest 통합 시나리오로 대체.

**Test (src/lib/builder/__tests__/integration/wix-parity.smoke.test.ts)**
1. Subscribers + webhook 동시 저장 → 두 storage 가 격리되어 작동.
2. Migration runner 실행 → backup snapshot 생성 → backup 목록에 1건.
3. A/B 변형 결정 sticky + webhook signature 정상/위변조 케이스 + dispatcher
   호출이 throw 없이 delivery 레코드 반환.

테스트 시작 전 BLOB_READ_WRITE_TOKEN 제거 + 관련 runtime-data 하위 디렉토리
모두 rm 하여 file 백엔드 격리. afterEach 에서 env 복원.

검증: typecheck ✅ / unit 853 ✅.

남은 follow-up: Playwright E2E 시나리오 (서버 띄움 필요), 호정 실제 도메인
QA 시나리오 (실제 결제·Zoom·Stripe 인증 환경 의존).

## 2026-05-11 Claude PR #15 — Storybook 8 + 컴포넌트 카탈로그

CODEX-GOAL-WIX-PARITY-COMPLETE.md 4.15. 이번 세션에서 추가한 admin 패널들을
Storybook 8 로 문서화. Chromatic 통합은 follow-up.

**Setup**
- npm i -D `storybook@^8.4` `@storybook/nextjs` `@storybook/react`.
- .storybook/main.ts — @storybook/nextjs framework, src/**/*.stories.tsx glob.
- .storybook/preview.ts — globals.css 임포트 + light/dark/paper background 토글.
- package.json scripts: `storybook` (dev :6006), `storybook:build`.
- .gitignore — storybook-static/ 추가.

**Stories (각 컴포넌트당 Empty + 데이터 채워진 상태)**
- Marketing/Nav (campaigns / subscribers active)
- Marketing/Campaigns admin (Empty / WithCampaigns)
- Marketing/Subscribers admin (Empty / Mixed)
- Marketing/Template editor (Sample / Empty)
- Webhooks/Admin (Empty / Mixed)
- Experiments/Admin (Empty / Running)
- Domains/Admin (Empty / Mixed)
- Errors/Admin (Empty / Mixed)
- Backups/Admin (Empty / Mixed)
- Search/Admin (Empty / WithTraffic)
- Forms/Schema editor (Sample / Empty)
- AI Generator/Wizard (Default)
- Live chat/Inbox (Empty / Mixed)
- Bookings/Calendar sync admin (NoStaff / Mixed)

검증: typecheck ✅ / unit 853 ✅.

남은 항목: Chromatic visual regression 연결, 기존 38개 widget kind 스토리화
(canvas internal 컴포넌트는 store/theme 의존성 mock 필요해 별도 라운드).

## 2026-05-11 Claude — Wix-parity follow-up sweep (PR #4·#5·#7·#10·#11·#12·#13·#14·#16·#17·#19)

진행 흐름이 끊기지 않게 한 라운드로 모든 follow-up 처리. 별도 PR 으로 분기하지 않고
단일 commit 으로 머지.

### Round 1 (Quick wires)
- **PR #4 — 캠페인 편집기에 템플릿 적용**: `/api/builder/marketing/templates` 목록을
  사이드바 select 로 노출, 선택 시 `?render=html` 호출 → bodyHtml/bodyText 자동 채움.
- **PR #7 — FormSubmissionsDashboard → 폼 빌더 진입 링크**: 헤더 우측에
  `/ko/admin-builder/forms/builder/${formId}` 링크 버튼 추가.
- **PR #13 — member.registered 이벤트 발신**: members-engine.createMember
  성공 직후 dynamic import 로 emitEvent('member.registered', { memberId, email,
  name, role }).
- **PR #19 — usage counter**: translateViaRouter 가 호출마다
  recordUsage(provider, args, 'hit'|'miss'|'error'). GET /api/builder/translations/translate
  가 `getUsageSnapshot()` 노출 (total/byProvider/charactersBilled/cacheHits/errors).

### Round 2 (Cron + CLI)
- **vercel.json**: backup(03:00), calendar-sync(*/30), marketing/dispatch(*/5),
  sms-reminders(*/15), webhooks-retry(*/10) 다섯 crons 등록.
- **scripts/restore-from-backup.mjs**: CLI — `<backupId> [--dry-run]`.
  Dynamic import 로 restoreBackup 호출.

### Round 3 (Public widget — site-search)
- **canvas types**: 'site-search' kind 추가 (placeholder/submitLabel/showResultsInline/
  kinds/locale/maxResults). discriminated union + 타입 export.
- **components/siteSearch/**: Render(검색 폼 + 결과 컨테이너) + Inspector(속성 편집).
  registry import 추가.
- **published/SiteSearchEnhancer.tsx**: 클라이언트 enhancer — 폼에 200ms debounce
  input 리스너 부착, /api/search 호출, 결과 inline 렌더. no-JS fallback 으로 form
  submit 은 /[locale]/search 로 redirect.
- **globals.css**: builder-site-search* 스타일 (input/button/results dropdown).
- **public-page.tsx**: SiteSearchEnhancer 마운트.

### Round 4 (Runtime wires)
- **PR #10 — ExperimentVariantSwap.tsx**: 클라이언트 컴포넌트.
  `[data-builder-experiment-id]` + `data-builder-experiment-variant` 마크업 검색 →
  /api/experiments/assign 호출 → 비활성 variant 숨김. `[data-builder-experiment-goal]`
  클릭 시 /api/experiments/event 자동 fire (capture phase). public-page 에 마운트.
- **PR #11 — canvas 임포트**: `draftToCanvasNodes(draft)` 가 hero+sections 를
  section/heading/text/button 노드 트리로 변환. `/api/builder/ai-generator/apply`
  신규 — slug 받아 createPage + writePageCanvas('draft'). 위저드 "사이트에 적용"
  버튼 활성화, 성공 시 pageId 표시.
- **PR #12 — 30s 자동 검증 폴링**: DomainsAdmin 가 `autoPollEnabled` 토글로
  pending/error 도메인을 30초마다 verify 라우트 호출 후 목록 새로고침.

### Round 5 (PR #6 잔여)
- /api/builder 밖 routes 는 이미 모두 permission 적용 (sweep 완료 — 추가 변경 없음).

### Round 6 (Webhooks/migrations/errors 마무리)
- **PR #13 — 재시도 cron**: /api/cron/webhooks-retry. attempts 횟수에 따라
  1/5/30/240분 backoff (MAX_ATTEMPTS=5). 비활성 subscription 은 즉시 포기.
- **PR #13 — deliveries admin UI**: /[locale]/admin-builder/webhooks/[webhookId]
  페이지 신규. WebhookDeliveriesView 가 상태 뱃지 + 재시도 버튼 + HTTP/시도/오류 표시.
  WebhooksAdmin 의 액션 컬럼에 "이력" 링크 추가.
- **PR #17 — migrations admin UI**: /[locale]/admin-builder/migrations.
  MigrationsAdmin 가 pending 카드 + 실행 버튼 + 적용 이력 표.
- **PR #16 — Slack 알림**: errors/slack-adapter.ts. SLACK_WEBHOOK_URL 설정 +
  severity in {error, fatal} 일 때 mrkdwn 블록 메시지 fire-and-forget POST.
  capture.ts 가 alertSlackForError 비동기 호출.

### Round 7 (Live chat + Form funnel)
- **PR #14 — public chat widget**: published/LiveChatWidget.tsx. 우하단 floating
  bubble, localStorage `tw_live_chat_session_v1` 으로 visitorToken 유지, SSE
  /api/live-chat/stream 구독. BuilderSiteSettings.liveChatWidgetEnabled 토글로
  public-page 마운트 제어.
- **PR #7 — funnel 트래킹**: forms/funnel/storage.ts (FunnelEvent +
  computeFunnelStats), POST /api/forms/track (rate-limit 120/min),
  GET /api/builder/forms/funnel?formId 또는 전체 perForm 요약.

검증: typecheck ✅ / unit 853 ✅. (새 라우트는 happy/error path 정도만 covered.)

남은 진짜 follow-up:
- 실서버 Playwright E2E (Stripe/Zoom/Google 실 인증 필요)
- Chromatic visual regression 연결 (PR #15)
- canvas internal 38 widget kind storybook 화 (theme/store mock 필요)
- AI generator quota / per-user cost 한도
- 외부 → booking pull 방향의 calendar sync
- 호정 실 도메인 인수 시 form funnel 클라이언트 hook 코드 (현재는 API만)

## 2026-05-12 Codex /goal M24 SEO + Publish 성숙

- custom `robots.txt`를 site settings에 저장하고 `/robots.txt` route가 production에서 우선 적용하도록 연결했다. 비어 있으면 기존 noindex 기반 자동 robots를 유지한다.
- SEO Dashboard Tools 탭에 `Custom robots.txt` 편집 textarea와 저장 버튼을 추가했다.
- publish 결과에 `cacheInvalidatedAt`, `revalidatedPaths`를 추가하고 page/sitemap/robots를 명시 revalidate한다.
- publish gate에 `prerender-ready` info check를 추가해 PublishModal preflight에서 prerender 대상 경로를 드러낸다.
- `seo-publish-history.playwright.ts`에 robots 저장/public route, pre-render check, revalidate evidence assertion을 추가했고, 테스트 직접 API 요청은 고유 `x-forwarded-for`로 분리해 mutation rate-limit 오염을 막았다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/seo/__tests__/robots.test.ts` ✅
  - `npm run test:unit` ✅ (855 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts --project=chromium-builder --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승)
  - `npm run security:builder-routes` ✅ (109 route files / 90 mutation handlers)
- 전역 gate 메모:
  - `npm run lint`와 `npm run build`는 M24 변경 후 기능적으로는 통과 경로를 확인했지만, Bookings M25 금지 영역 `src/components/builder/bookings/CalendarSyncAdmin.tsx`의 기존 `setConnections` unused lint error를 되돌려 둔 상태라 현재 전역 실행은 실패한다.
  - M25 Bookings milestone 진입 즉시 이 한 줄 lint cleanup을 포함해 전체 lint/build를 다시 green으로 만든다.
- 체크포인트:
  - W186/W187/W188/W190/W191/W192/W193/W194/W195 자동검증 evidence 확보.
  - W189 scheduled publish는 현재 M24 prompt 범위 밖이라 별도 publish scheduling 작업으로 남긴다.

## 2026-05-12 Codex /goal M25 Bookings 본격 1

- M24에서 전역 lint/build를 막던 `CalendarSyncAdmin.tsx` unused setter를 Bookings milestone 안에서 정리했다.
- Services admin에 paid/free, price/currency, booking interval, buffer before/after, category, active 상태, 중국어 description 편집을 연결했다.
- Staff admin에 active, title ZH, bio ZH, service assignment 편집을 연결했다.
- Availability admin은 요일별 여러 time range와 blocked dates를 함께 다루며, slot 계산은 service별 `slotStepMinutes`, buffer before/after, active staff/service를 반영한다.
- 공개 Booking widget은 Service → Staff → Slot → Info flow에서 로컬 타임존/업체 타임존을 함께 보여주고, 사건 개요/첨부 URL/custom fields를 inspector 설정대로 저장한다.
- paid service는 `/api/booking/payment-intent` 선행 후 `/api/booking/book`에 저장되며, dev 환경은 `pi_stub_dev`로 E2E 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/availability.test.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m25.playwright.ts --project=chromium-builder --workers=1` ✅
  - `npm run lint` ✅
  - `npm run security:builder-routes` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/availability.test.ts src/lib/builder/bookings/calendar-sync/__tests__/encryption.test.ts` ✅
  - `npm run test:unit` ✅ (858 passed)
  - `npm run build` ✅
- 체크포인트:
  - W196/W197/W198/W199/W200/W201/W202 자동검증 evidence 확보.
  - 사용자 직접 QA 전까지 `자동검증 통과 / 사용자 QA 대기`로 둔다.

## 2026-05-12 Codex /goal M26 Bookings 본격 2 partial

- Bookings index를 `/admin-builder/bookings/dashboard`로 보내고, Dashboard 탭을 추가했다.
- 새 dashboard는 예약 총계/upcoming/pending/no-show 지표, 검색, status/staff/service/date 필터, booking detail modal, reschedule, confirm/complete/no-show/cancel 상태 변경, timeline을 제공한다.
- Calendar admin에 Month/Week/List view switch를 추가했다.
- Services admin에 meeting mode(`in-person/zoom/phone/hybrid`)와 cancellation policy preset을 노출하고 API schema에 저장한다.
- booking confirmation email summary에 meeting link를 포함한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅
  - `npm run security:builder-routes` ✅
  - targeted bookings unit 6 passed ✅
  - `npm run test:unit` ✅ (858 passed)
  - `bookings-m26-dashboard.playwright.ts` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npm run build` ✅
- 남은 후속:
  - 실제 Resend/SMTP 수신, Twilio SMS 수신, Zoom OAuth 실계정 생성, Google Calendar 양방향 pull, 고객 토큰 기반 cancel/reschedule link, Stripe Payment Element/환불 end-to-end.

## 2026-05-12 Codex /goal M26 customer booking links

- 고객용 booking manage token을 추가했다. token은 bookingId/customer email/expiry를 HMAC 서명하고, confirmation/reminder email에는 locale별 `/bookings/manage/[token]` 링크가 포함된다.
- 공개 `/[locale]/bookings/manage/[token]` 페이지와 `/api/booking/manage/[token]` GET/PATCH를 추가했다. 고객은 링크로 예약을 조회하고, 가능한 슬롯으로 reschedule하거나 cancellation policy/refund 계산을 거쳐 cancel할 수 있다.
- 고객 관리 페이지에서는 공개 사이트 AI chat과 year-end popup을 숨겨, 마케팅 오버레이가 예약 변경/취소 버튼 클릭을 가로막지 않게 했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/manage-token.test.ts src/lib/builder/bookings/__tests__/availability.test.ts` ✅ (5 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m26-customer-manage.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
- 체크포인트:
  - W203/W206 고객 링크 경로 자동검증 evidence 확보. 실제 Resend/SMTP 수신은 provider QA 대기.

## 2026-05-12 Codex /goal M26 calendar pull import

- Calendar sync를 push-only에서 보수적 양방향 pull 구조로 확장했다.
- Hojeong이 push하는 provider event description에는 `Booking ID:`를 포함하고, connection별 `eventMappings`로 provider event ID를 저장한다. 다음 sync부터는 같은 booking을 새 event로 계속 만들지 않고 provider update를 시도한다.
- Pull 시 저장된 external ID 또는 신뢰 가능한 Booking ID가 있으면 해당 staff booking만 reschedule/cancel로 반영한다. stale duplicate provider event가 같은 Booking ID를 들고 있어도 저장된 mapping과 다르면 무시한다.
- 외부 캘린더에서 직접 만든 일정은 fake booking으로 만들지 않고 staff availability `blockedDates` busy block으로 import/update/remove한다. 그래서 공개 booking slot 계산에서 외부 busy 시간이 제외된다.
- Google/Outlook timed event mapper를 추가했고, all-day/free event는 제외하며, pagination을 따라간다. 삭제 이벤트는 날짜가 없어도 기존 busy block 제거와 mapped booking cancel에 사용할 수 있게 했다.
- Calendar Sync admin UI는 수동 동기화 결과를 `푸시 n건, 가져오기 n건`으로 보여주고, 양방향 정책 설명을 업데이트했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/calendar-sync/__tests__/provider-mappers.test.ts src/lib/builder/bookings/calendar-sync/__tests__/sync-engine.test.ts src/lib/builder/bookings/__tests__/availability.test.ts` ✅ (12 passed)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅
  - `npm run test:unit` ✅ (869 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- 체크포인트:
  - W204 자동검증 evidence 확보. 실제 Google/Outlook OAuth 계정 연결과 실 provider round-trip은 provider QA 대기.

## 2026-05-12 Codex /goal M26 payment element/refund

- Paid booking public widget을 Stripe Payment Element 확인 단계로 바꿨다. 유료 서비스는 `결제 준비` 후 Payment Element 또는 dev stub이 뜨고, `결제 확인/테스트 결제 완료` 전에는 `Confirm booking`이 disabled 상태로 유지된다.
- `/api/booking/payment-intent`는 dev stub `paymentIntentId`를 반환하고, 실제 Stripe 모드에서는 publishable key 누락을 503으로 차단한다.
- Cancellation refund 단위 테스트를 추가해 full refund, 50% partial refund, no-refund window를 검증했다.
- `booking/cancel`과 `stripe-webhook`은 cancel/refund 동시 처리 시 이미 취소·환불된 row를 덮어쓰지 않도록 직전 재조회 guard를 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/refund.test.ts` ✅ (3 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m25.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅
  - `npm run test:unit` ✅ (872 passed)
  - `npm run build` ✅ (Google Fonts warning + 기존 `<img>` warning only)
- 체크포인트:
  - W210은 `자동검증 통과 / live Stripe QA 대기`로 상향. 실제 Stripe 카드 결제·webhook·환불 round-trip은 provider QA로 남긴다.

## 2026-05-12 Codex /goal M27 analytics customer profile

- Booking dashboard에 analytics strip을 추가했다. 총 예약, upcoming, pending, confirmed, completed, cancelled, no-show에 더해 성사율/취소율/no-show율/결제 수익을 표시한다.
- Service/staff/customer breakdown 계산을 `src/lib/builder/bookings/analytics.ts`로 분리했고, customer email별 profile은 total/upcoming/completed/cancelled/no-show, last/next booking, bookingIds를 제공한다.
- Dashboard row에는 고객 방문 횟수 chip을 표시하고, booking detail modal에는 customer profile panel과 고객 이력 timeline item을 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/analytics.test.ts` ✅ (2 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m26-dashboard.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npm run lint` ✅
  - `npm run security:builder-routes` ✅
  - `npm run test:unit` ✅ (874 passed)
  - `npm run build` ✅
- 체크포인트:
  - W213/W214 자동검증 evidence 확보. W211 waitlist, W212 recurring availability, W215 email templates는 M27 후속 slice로 남긴다.

## 2026-05-12 Codex /goal M27 waitlist

- Booking waitlist를 별도 storage collection으로 추가했다. Booking status에 대기 상태를 억지로 섞지 않고 `BookingWaitlistEntry`가 service/staff/requestedDate/customer/status/promotedBookingId를 보관한다.
- 공개 booking widget은 선택 날짜에 slot이 없으면 `Join waitlist` panel을 띄운다. 이름/이메일/전화/메모/동의를 받아 `/api/booking/waitlist`로 저장하고, 동일 날짜·서비스·staff·이메일 중복은 기존 entry로 처리한다.
- 관리자 dashboard에는 waitlist count와 table을 추가했다. Promote는 availability를 다시 확인하고 slot lock을 잡은 뒤 normal booking을 만들고 waitlist를 `promoted`로 전환한다. Contacted/Close 상태 전환도 제공한다.
- 새 builder mutation route는 모두 `guardMutation({ permission: 'manage-bookings' })`를 통과한다. 공개 waitlist route는 rate limit과 honeypot을 유지한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m27-waitlist.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npx vitest run src/lib/builder/bookings/__tests__/analytics.test.ts src/lib/builder/bookings/__tests__/availability.test.ts` ✅ (6 passed)
  - `npm run security:builder-routes` ✅
  - `npm run lint` ✅
  - `npm run test:unit` ✅ (874 passed)
  - `npm run build` ✅
- 체크포인트:
  - W211 자동검증 evidence 확보. W212 recurring availability, W215 booking email templates는 M27 후속으로 남긴다.

## 2026-05-12 Codex /goal M27 recurring availability

- Staff availability에 recurring template과 holiday calendar를 추가했다. 템플릿은 weekdays 10-18, weekdays 09-18, 점심 제외 split, weekend limited, clear all을 제공한다.
- Availability admin에서 템플릿 선택 후 `Apply template`으로 weekly block을 일괄 적용하고, `Holiday calendar`에서 Korea/Taiwan/combined 공휴일 자동 제외를 선택할 수 있다.
- Public availability 계산은 staff의 `holidayCalendar`를 확인해 KR/TW fixed public holiday 날짜에는 weekly block이 있어도 slot을 생성하지 않는다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/availability-templates.test.ts src/lib/builder/bookings/__tests__/availability.test.ts` ✅ (7 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m27-recurring-availability.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npm run security:builder-routes` ✅
  - `npm run lint` ✅
  - `npm run test:unit` ✅ (877 passed)
  - `npm run build` ✅
- 체크포인트:
  - W212 자동검증 evidence 확보. W215 booking email templates는 M27 후속으로 남긴다.

## 2026-05-12 Codex /goal M27 email templates

- Booking email templates storage/admin UI를 추가했다. Bookings admin에 Email tab이 생겼고, confirmation/admin notification/reminder/cancellation 템플릿을 subject/body 단위로 편집하고 placeholder chip과 live preview로 확인할 수 있다.
- 템플릿 렌더러는 `{{customerName}}`, `{{serviceName}}`, `{{staffName}}`, `{{startTime}}`, `{{manageUrl}}`, `{{bookingSummary}}` 등 예약 변수를 지원하며 HTML 출력은 escape 처리한다.
- Booking confirmation, admin notification, customer cancellation, customer reminder 발송 경로를 저장된 템플릿 기반으로 전환했다. 취소 API와 customer manage cancel도 cancellation template을 사용한다.
- `/api/booking/email-reminders` cron route를 추가해 email reminder template이 실제 dispatcher에서 호출되도록 했다. Resend 미설정 시 전송은 skip/error summary로 남기고 booking 생성은 막지 않는다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/email-templates.test.ts src/lib/builder/bookings/__tests__/availability-templates.test.ts` ✅ (4 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m27-email-templates.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npm run security:builder-routes` ✅ (113 route files / 93 mutation handlers)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run test:unit` ✅ (879 passed)
  - `npm run build` ✅ (Google Fonts warning + 기존 `<img>` warning only)
- 체크포인트:
  - W215 자동검증 evidence 확보. M27 W211~W215는 모두 자동검증 통과 상태이며, 실제 Resend provider 발송·수신함 rendering은 사용자/provider QA 대기.

## 2026-05-12 Codex /goal M28 rulers guides grid

- M28 에디터 고도화 1차 slice로 W216~W218을 구현했다.
- Canvas ruler를 상단/좌측 pixel ruler로 노출하고, ruler 클릭으로 custom vertical/horizontal guide를 생성한다. Guide는 drag/remove 가능한 overlay로 표시되고 editor preferences localStorage에 저장된다.
- Grid floating toolbar를 추가해 Grid toggle, grid size 입력, `Shift+G` 단축키를 제공한다. Grid size는 canvas background와 snap engine에 반영된다.
- `computeSnap`이 기존 6px tolerance 흐름에서 grid snap과 reference guide snap을 같이 고려하도록 보강했다.
- React state updater 내부에서 prefs 저장/브로드캐스트가 일어나던 문제를 제거해 grid toggle이 되돌아가는 경고를 해결했다.
- Header edit badge가 ruler 클릭을 막던 레이어 충돌을 보정했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/canvas/__tests__/snap.test.ts` ✅ (6 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-guides-grid.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npm run security:builder-routes` ✅
- 체크포인트:
  - W216/W217/W218 자동검증 evidence 확보. W219~W225는 M28 다음 slice로 계속 진행.

## 2026-05-12 Codex /goal M28 editor advanced panels

- M28 에디터 고도화 후반 slice로 W219~W225를 연결했다.
- Layers panel은 zIndex tree/search/visibility/lock row를 자동검증 가능한 surface로 보강했다.
- Shortcut map modal을 Editor preferences에 연결했고, custom keybinding override가 실제 `matchShortcut`에서 기본 단축키를 대체하도록 수정했다.
- Inspector multi-select에 align 6종, distribute H/V, match W/H 버튼을 추가했다.
- Style-only copy/paste를 `Mod+Alt+C/V`와 context menu로 연결했다.
- Add drawer에 Component library를 붙여 선택 노드 tree 저장/삽입을 지원한다.
- Inspector에 Element comments thread를 붙여 선택 노드별 주석을 localStorage editor preferences에 저장한다.
- Zoom dock은 25~200% slider/buttons 검증 surface를 갖췄고, History drawer에는 Undo stack timeline을 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/canvas/__tests__/shortcuts.test.ts` ✅ (2 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
- 체크포인트:
  - W219/W220/W221/W222/W223/W224/W225 자동검증 evidence 확보. 전체 lint/unit/security/build는 이 slice 최종 게이트로 이어서 실행.

## 2026-05-12 Codex /goal M29 red checkpoint close

- W17/W36/W189 red checkpoint를 닫는 보강 slice를 진행했다.
- Published responsive CSS를 `responsive-stylesheet.ts`로 분리했다. tablet/mobile media query가 desktop inline rect보다 우선하도록 `!important`를 유지하고, mobile은 tablet override를 상속한다.
- Flow composite는 viewport별 y/height override 기준으로 margin-top을 다시 계산해 모바일 공개 페이지에서 섹션 간격이 desktop inline 값에 묶이지 않게 했다.
- Scheduled publish storage/API/cron runner를 추가했다. PublishModal에서 예약 시간을 저장하면 draft를 먼저 저장하고 expected draft revision을 job에 고정한다. Cron runner는 due job을 기존 `publishPage()` pipeline으로 발행한다.
- 신규 routes:
  - `/api/builder/site/pages/[pageId]/scheduled-publish` GET/POST/DELETE
  - `/api/cron/scheduled-publish` GET/POST
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/site/__tests__/responsive-stylesheet.test.ts src/lib/builder/site/__tests__/scheduled-publish.test.ts` ✅ (5 passed)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run test:unit` ✅ (888 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- 체크포인트:
  - W17/W36/W189 자동검증 evidence 확보. 실제 모바일/예약 발행 사용자 QA는 대기.

## 2026-05-12 Codex /goal M30 section template click stability

- 사용자가 보고한 “주요 업무/섹션 디자인 템플릿 클릭 후 글이 사라짐”, “다른 노드를 클릭하면 텍스트가 안 보임” 회귀를 우선 처리했다.
- child-containing container의 pointer events를 되살려 카드/리스트 빈 영역도 실제 선택 가능한 노드가 되게 했다.
- 서비스/FAQ interactive preview index를 선택 시점에 즉시 동기화해 accordion detail이 selection 변경 직후 접히지 않게 했다.
- 회전 핸들을 콘텐츠에서 더 멀리 띄워 선택 overlay가 바로 다음 텍스트 클릭을 가로막는 문제를 줄였다.
- 섹션 디자인 템플릿은 현재 root section 하단에 중앙 정렬로 삽입하고 root section만 선택한다. 새 섹션이 hero 위에 겹쳐 기존 노드 클릭을 막던 경로를 제거했다.
- 검증:
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승)
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npx vitest run src/lib/builder/canvas/__tests__/shortcuts.test.ts src/lib/builder/canvas/__tests__/snap.test.ts` ✅ (8 passed)
  - `npm run test:unit` ✅ (888 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- 다음 후보:
  - 남은 yellow checkpoint 중 W161 parallax/background runtime, W174/W178/W181/W182/W183 디자인 시스템/템플릿 품질 gap을 self-goal 후보로 둔다.

## 2026-05-12 Codex /goal M31 background parallax runtime

- W161의 남은 gap인 배경 전용 parallax를 구현했다.
- Scroll effect preset에 `background-parallax`를 추가했다. 기존 `parallax-y`는 요소 transform을 움직이고, 새 옵션은 background-position만 움직인다.
- Published `AnimationsRoot`에서 scroll progress와 intensity로 `--builder-bg-parallax-position`을 갱신한다. Overlay+image background처럼 background layer가 여러 개인 경우 마지막 image layer만 이동한다.
- Motion runtime Playwright는 inspector에서 `background-parallax` 선택 가능 여부와 공개 페이지에서 실제 CSS variable이 갱신되는지 확인한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/animations/__tests__/animation-render.test.ts` ✅ (3 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/motion-runtime.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (889 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- 다음 후보:
  - W174 elastic easing preset 또는 W178/W181/W182/W183 theme/brand asset 품질 gap.

## 2026-05-12 Codex /goal M32 elastic easing preset

- W174의 남은 gap인 `elastic` easing preset을 추가했다.
- Animation easing dropdown에 `Elastic` 옵션을 추가했다. 저장/정규화 값은 `elastic`으로 유지하고, published/editor CSS 출력은 `cubic-bezier(0.34, 1.56, 0.64, 1)`로 변환한다.
- Published exit runtime에서도 `data-anim-exit-easing="elastic"` 형태가 들어와도 CSS-safe cubic-bezier로 처리한다.
- Motion runtime Playwright는 inspector에서 `elastic` 선택이 가능하고 custom input이 비활성화되는지 확인한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/animations/__tests__/animation-render.test.ts` ✅ (4 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/motion-runtime.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (890 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- 다음 후보:
  - W178 theme preset save/load, W181 token export/import, W182 brand asset library, W183 radius/shadow presets.

## 2026-05-12 Codex /goal M33 radius/shadow effect presets

- W183의 남은 gap인 전역 코너 반경/그림자 프리셋을 구현했다.
- `BuilderTheme.effects`에 radius/shadow preset metadata를 추가하고, theme helper에서 Sharp/Medium/Soft radius와 None/Soft/Medium/Strong shadow preset을 정규화·적용한다.
- Site Settings > Presets 탭에서 radius/shadow preset picker를 클릭하면 theme preview와 brand kit export state가 즉시 갱신된다.
- site settings API schema/merge 경로가 `effects`를 보존하고, card variant resolver는 theme shadow preset을 읽어 elevated/floating 계열 shadow를 전역 preset에 맞춘다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/site/__tests__/theme-effects.test.ts` ✅ (2 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers Site Settings ModalShell" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (892 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- 다음 후보:
  - W178 theme preset save/load, W181 token export/import, W182 brand asset library 중 theme persistence/export 품질 gap을 우선 본다.

## 2026-05-12 Codex /goal M34 design token bundle export/import

- W181의 남은 gap인 전체 design token JSON export/import를 구현했다.
- `DesignTokenBundle`은 colors/darkColors/fonts/radii/effects/theme text presets/typography scale을 한 파일로 내보낸다.
- Site Settings > Presets 탭에 `Export design tokens` / `Import design tokens` 흐름을 추가했다. Import 후 theme state와 brand kit export state가 즉시 동기화되고, 저장 버튼으로 site settings API에 반영된다.
- 단위 테스트는 token bundle round-trip을 검증하고, Playwright는 실제 modal에서 다운로드 파일명, import file input, imported primary color 반영을 확인한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/site/__tests__/theme-effects.test.ts` ✅ (3 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers Site Settings ModalShell" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (893 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- 다음 후보:
  - W178 custom theme preset save/load 또는 W182 brand asset library gap을 우선 본다.

## 2026-05-12 Codex /goal M35 custom My Theme save/load

- W178의 남은 gap인 사용자 custom theme preset 저장/불러오기를 구현했다.
- Site Settings > Presets 탭에 My Themes 영역을 추가했다. 현재 theme를 `Save as My Theme`로 localStorage에 저장하고, 저장된 preset card에서 `Apply My Theme` / `Delete`를 실행할 수 있다.
- 저장 preset은 colors/fonts/text presets/radii/effects/typography scale이 포함된 normalized theme로 보관된다.
- Playwright는 실제 modal에서 My Theme 저장, preset card 표시, 재적용 notice, 삭제 notice를 확인한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers Site Settings ModalShell" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (893 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- 다음 후보:
  - W182 brand asset library gap을 우선 본다.

## 2026-05-12 Codex /goal M36 brand asset library polish

- W182의 남은 gap인 Brand asset library 연결성을 보강했다.
- Brand kit 탭에 Brand asset library 영역을 추가해 Light logo/Dark logo/Favicon/OG image 4개 슬롯의 연결 상태를 보여주고, 각 슬롯에서 Asset library를 바로 열 수 있게 했다.
- Brand kit에서 여는 Asset library는 Brand folder로 시작하며, 선택한 asset은 자동으로 `brand` folder/tag에 분류된다.
- Site Settings Playwright는 Brand asset library 노출, `0/4 brand assets selected` 상태, Brand folder asset dialog 진입/닫기 경로를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers Site Settings ModalShell" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (893 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- 다음 후보:
  - 남은 checkpoint yellow를 다시 스캔해 W176/W177/W179/W180/W184/W185 등 디자인 시스템 마지막 gap부터 닫는다.

## 2026-05-12 Codex /goal M37 component design presets bulk apply

- W179의 남은 gap인 컴포넌트별 스타일 프리셋 일괄 적용을 구현했다.
- Site Settings > Presets 탭에 Classic/Soft/Editorial/Conversion component design presets를 추가했다.
- 각 preset은 현재 페이지의 button/card/form field/form submit을 한 번에 patch하고, canvas store mutation과 draft autosave 경로를 그대로 탄다.
- 단위 테스트는 preset helper가 기존 content를 보존하면서 style/variant만 바꾸는지 검증하고, Playwright는 실제 modal에서 `Apply Editorial system` 클릭 후 draft API에 `primary-link:editorial:underline:outline`이 저장되는지 확인한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/site/__tests__/component-design-presets.test.ts` ✅ (1 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "bulk applies component design presets" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- 다음 후보:
  - W176/W177/W180/W184/W185 등 남은 design system yellow checkpoint를 재스캔한다.

## 2026-05-13 Codex /goal M38 typography/source inspector polish

- W184/W185의 사용자 QA 대기 gap 중 “변경 결과와 출처가 한눈에 보이는가”를 보강했다.
- Site Settings > Typography에 H1~H6/Body scale preview ladder를 추가해 base/ratio 변경 결과 px 값을 즉시 보여준다.
- Inspector Style sources visualizer 각 행에 출처 힌트를 직접 표시한다. `theme.colors.*`, `variant:*`, `사용자 직접 입력`, `기본값`이 tooltip 없이도 보인다.
- Playwright는 typography preview에서 H1 95px/Body 17px가 보이고, background/variant source hint가 inspector에 표시되는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-system-m23.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- 다음 후보:
  - Motion W170~W175 user-QA 대기 항목을 실제 interaction evidence 기준으로 보강하거나, SEO W188/W190~W195 yellow를 재스캔한다.

## 2026-05-13 Codex /goal M39 redirect manager public runtime evidence

- W188의 약한 지점인 “redirect manager UI로 만든 규칙이 실제 public 301/308 응답으로 나오는가”를 보강했다.
- middleware redirect loader는 production Blob path를 유지하고, local origin에서는 same-origin public read endpoint를 통해 Node persistence의 active redirect rules를 읽는다.
- `/api/builder/site/redirects/public` GET endpoint를 추가했다. local hostname에서만 active rules를 반환하고 외부 hostname은 404로 닫는다.
- Playwright는 `/ko/admin-builder/seo/redirects` UI에서 301/308 rule을 생성한 뒤, public old path를 `maxRedirects: 0`으로 요청해 status와 Location header를 직접 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/redirect-manager.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (115 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- 다음 후보:
  - W191/W193 structured data/hreflang public head evidence 또는 W195 publish diff viewer 실사용 evidence를 재스캔한다.

## 2026-05-13 Codex /goal M40 structured data public JSON-LD evidence

- W192의 약한 지점인 “schema.org structured data가 실제 공개 HTML의 JSON-LD script로 나오는가”를 보강했다.
- SEO 패널의 JSON-LD blocks UI에 Article starter를 추가했다. `+ Article` 클릭 시 Article JSON-LD template이 들어가고, block type을 Article/FAQPage/LegalService/Organization/LocalBusiness/BreadcrumbList/Custom으로 바꿀 수 있다.
- page/site SEO schema validation에서 `Article` block type을 정식 허용한다.
- Playwright는 API로 FAQ widget이 있는 페이지를 만들고 Article JSON-LD block을 저장/발행한 뒤, `/ko/{slug}` 공개 HTML의 `application/ld+json` payload에서 LegalService/BreadcrumbList/FAQPage/Article과 headline/question/answer를 직접 검증한다.
- 기존 W26-W28 UI 클릭 테스트도 SEO Advanced 탭에서 `+ Article` 클릭 후 Label input/textarea 값이 Article template으로 채워지는지 확인하도록 보강했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "covers W192|covers W26-W28 through actual editor UI clicks" --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (115 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- 다음 후보:
  - W193 hreflang public head/runtime evidence 또는 W195 publish diff viewer 실사용 evidence를 재스캔한다.

## 2026-05-13 Codex /goal M41 hreflang public metadata evidence

- W193의 약한 지점인 “linkedPageIds 기반 hreflang이 실제 공개 HTML alternate link로 주입되는가”를 보강했다.
- `seo-publish-history.playwright.ts`에 KO/EN linked page 발행 테스트를 추가했다. KO 페이지 생성 후 EN 페이지를 `linkedFromPageId`로 생성해 양방향 link를 만들고, 두 페이지를 각각 발행한다.
- 공개 `/ko/{slug}` HTML에서 `rel="alternate"` link의 ko/en/x-default href를 직접 확인하고, `/p/` legacy URL이 섞이지 않는지도 검증한다.
- 같은 테스트에서 SEO API의 `hreflang` 배열과 `missingLocales`가 Inspector 상태와 일치하는지도 확인한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "covers W193" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (115 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- 다음 후보:
  - W195 publish diff viewer 실사용 evidence 또는 남은 yellow checkpoint 재스캔.

## 2026-05-13 Codex /goal M42 publish diff viewer 실사용 evidence

- W195의 약한 지점인 “Publish 전 draft와 마지막 published의 차이를 실제 발행 모달에서 볼 수 있는가”를 보강했다.
- `src/lib/builder/canvas/document-diff.ts`를 추가해 Version History와 Publish dialog가 같은 diff 계산을 공유한다.
- Publish dialog에 `Draft vs published` 패널을 추가했다. 마지막 `publishedRevisionId` 문서를 revisions API로 읽고 현재 draft와 비교해 `+ / - / ~` 요약, published revision, 대표 변경 node를 표시한다.
- 기존 `VersionHistoryPanel`은 공용 diff helper로 교체해 기능 중복과 diff semantics drift를 줄였다.
- Playwright는 최초 publish 후 draft title만 변경하고 Publish dialog를 열어 `+0 / -0 / ~1`, `~ 변경됨 1`, 변경 node id와 text diff가 표시되는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "covers W195" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (115 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- 다음 후보:
  - M42 커밋 후 남은 yellow checkpoint를 계속 재스캔한다.

## 2026-05-13 Codex /goal M43 Pages CRUD validation hardening

- W14의 남은 gap 중 “rename/delete 전체 CRUD는 있지만 실패 UX가 원인을 알려주는가”를 보강했다.
- Pages 패널 create/rename/delete 실패 시 API validation payload를 읽어 duplicate slug, validation issue message, generic error 순으로 사용자에게 보여준다.
- Pages status message에 `role="status"`/`aria-live`를 추가하고 rename title/slug input에 `aria-label`을 붙여 Playwright와 접근성 모두 안정화했다.
- Playwright는 source page와 target page를 만든 뒤 target rename slug를 source slug로 바꾸는 실패 경로를 실제 UI로 실행한다. 실패 후 duplicate slug 메시지가 보이고, 두 pageId가 모두 유지되는지 검증한다.
- 기존 “active page slug + nested navigation sync after rename/delete” 테스트도 함께 재실행해 rename 성공, nav href 동기화, delete cleanup 경로를 재확인했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "duplicate slug validation|keeps active page slug" --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승)
  - `npm run lint` ✅ (기존 `<img>` warning만)
  - `npm run security:builder-routes` ✅ (115 builder route file / 95 mutation handler guard coverage)
  - `npm run test:unit` ✅ (72 files / 894 tests)
  - `npm run build` ✅ (Google Fonts 최적화 warning + 기존 `<img>` warning만)
- 다음 후보:
  - M43 커밋 후 W03/W09/W12 등 초기 editor WIP 중 사용자 체감 gap을 계속 재스캔한다.

## 2026-05-13 Codex /goal M44 Services template text persistence

- 사용자가 계속 재현한 “주요업무/주요 서비스 노드 선택 뒤 다른 노드를 선택하면 글이 안 보임” 문제를 editor preview state 기준으로 다시 막았다.
- 원인은 editor canvas가 public accordion의 single-open 스타일을 그대로 따라가면서, 두 번째 service card를 선택하면 첫 번째 card detail이 `display: none` 상태가 되는 데 있었다. 편집 중에는 텍스트를 잃어버린 것처럼 보이므로, public runtime은 유지하고 editor preview만 multi-reveal로 바꿨다.
- `store.ts`는 `servicesRevealedIndices`를 유지하고, `CanvasNode.tsx`는 선택된 card와 이전에 reveal된 card 모두를 `data-builder-preview-open` 상태로 렌더한다.
- `section-template-click.playwright.ts`는 주요 서비스 템플릿을 실제 클릭으로 적용한 뒤 card 1, 섹션 설명, hero title을 차례로 선택해도 card 0/1 상세 텍스트가 계속 visible인지 검증한다.
- `admin-builder.playwright.ts` smoke expectation도 editor multi-reveal 동작에 맞췄다. 다만 전체 smoke는 M44 assertion 이전의 기존 layout/hero quick-edit assertion에서 먼저 실패해, 이번 gate는 isolated section-template regression으로 닫았다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승)
  - `git diff --check` ✅ (M44 코드/test 파일)
  - `npm run lint` ✅ (기존 `<img>` warning만)
  - `npm run security:builder-routes` ✅ (115 builder route file / 95 mutation handler guard coverage)
  - `npm run test:unit` ✅ (72 files / 894 tests)
  - `npm run build` ✅ (Google Fonts 최적화 warning + 기존 `<img>` warning만)
- 다음 후보:
  - 사용자가 보고한 `/ko/admin-builder`에서 한국어 편집기인데 중국어 사이트가 뜨는 locale/content mismatch를 다음 self-goal로 우선 재현한다.

## 2026-05-13 Codex /goal M45 Locale page projection guard

- 사용자가 보고한 “편집기는 한국어인데 중국어 사이트가 뜸” 문제를 pageId/locale projection 경계에서 막았다.
- `listPages`와 `/ko/admin-builder` 초기 page 선택은 현재 locale에 투영 가능한 page만 보게 했다. 기본 KO route는 KO page만 열고, non-default locale은 해당 locale 전용 page가 없을 때만 KO source page를 fallback projection으로 본다.
- Draft GET/PUT API는 요청 locale과 page locale이 맞지 않는 전용 pageId를 409 `locale_mismatch`로 거부한다. 따라서 `/ko/admin-builder?pageId=<zh-hant pageId>`가 더 이상 중국어 draft를 한국어 editor canvas로 열지 않는다.
- Playwright는 zh-hant page를 실제 생성하고, KO page 목록 제외, zh-hant 목록 포함, KO draft 409, KO editor fallback home 렌더를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/locale-projection.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승)
- 다음 후보:
  - 사용자가 보고한 “섹션 디자인 템플릿 클릭/뒤로가기 UX”와 “주요업무 템플릿 수 부족”을 이어서 다룬다.

## 2026-05-13 Codex /goal M46 Service section gallery depth

- 사용자가 보고한 “주요업무 눌러서 사용하려는데 네 개 템플릿만 있음”과 “템플릿 적용하려고 한 뒤 다시 뒤로 가고 싶으면 버튼도 없음” 피드백을 반영했다.
- Built-in section gallery의 services category를 4개에서 12개로 확장했다. Practice Bento, Process Ladder, Risk Matrix, Retainer Packages, Industry Solutions, Comparison Table, Cross-border Desk, Case Intake Flow를 추가했다.
- 섹션 템플릿 카드에 category/template data attribute와 명시적 aria-label을 붙여 클릭 테스트와 접근성을 안정화했다.
- Design > Section design detail view에는 header의 `← 섹션 목록` 외에 본문 바로 아래 `섹션 목록으로 돌아가기` 버튼을 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/sections/__tests__/normalize.test.ts` ✅ (17 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승)
- 다음 후보:
  - 템플릿 gallery를 실제 외부 AI 디자인/대량 템플릿처럼 더 넓히는 방향과, 남은 노드 선택/백지화 이슈를 계속 재현한다.

## 2026-05-13 Codex /goal M47 Node click movement guard

- 사용자가 다시 재현한 “노드를 클릭하면 아래로 사라지는지 글이 안 보임”, “칼럼 아카이브/사진 클릭하면 백지” 피드백을 클릭/드래그 경계에서 보강했다.
- `useCanvasInteractions`의 move interaction에 4px activation threshold를 추가했다. pointerdown 선택은 유지하되, 포인터가 임계값 이상 움직이기 전에는 transient 이동, reparent, commit을 하지 않는다.
- 새 Playwright는 2px pointer jitter click으로 주요 서비스 노드 위치가 바뀌지 않는지, 칼럼 아카이브/이미지 클릭 뒤에도 editor canvas와 Asset library modal이 유지되는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-stability.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승)
- 다음 후보:
  - 외부 AI 디자인 사이트 수준의 섹션 템플릿 폭 확장 또는 W216~W225 editor 고도화 잔여 UX를 계속 재스캔한다.

## 2026-05-13 Codex /goal M48 Section template market search

- 사용자가 말한 “직접 디자인하지 않고 이미 템플릿 있는 AI 디자인 전문 사이트처럼 가져올 수 있어야 한다”는 피드백을 Add 패널 템플릿 탐색 UX에 반영했다.
- Built-in section templates에 검색 helper와 category alias를 추가했다. `주요업무`, `주요 서비스`, `AI design`, `template market` 같은 검색어가 실제 services design pack을 찾는다.
- Add 패널 검색 결과에 section templates를 포함하고, `Section template market` header, category filter, result count를 붙였다. 검색어가 바뀌면 category filter는 All로 돌아가 결과가 바로 보인다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/sections/__tests__/normalize.test.ts` ✅ (18 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승)
  - `git diff --check` ✅
- 다음 후보:
  - 실제 템플릿 카탈로그를 더 대량화하거나, W216~W225 editor 고도화 잔여 UX를 계속 재스캔한다.

## 2026-05-13 Codex /goal M49 Add panel page template showroom entry

- 기존 261개 페이지 템플릿 쇼룸이 Pages `+ New` 안쪽에만 있어 Add 패널 사용자가 발견하기 어려운 문제를 보강했다.
- Add 패널 상단에 `전체 페이지 템플릿 261개 보기` CTA를 추가했다. 클릭하면 Pages drawer로 전환하고 기존 `TemplateGalleryModal`을 즉시 연다.
- `PageSwitcher`는 외부 request id로 template gallery를 열 수 있게 했고, 기존 Pages `+ New` 흐름은 그대로 유지했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승)
  - `git diff --check` ✅
- 다음 후보:
  - 페이지 템플릿/섹션 템플릿을 같은 검색 경험으로 더 통합하거나, W216~W225 editor 고도화 잔여 UX를 계속 재스캔한다.

## 2026-05-13 Codex /goal M50 Add-to-page template search handoff

- M49에서 Add 패널에 노출한 261개 page template showroom이 Add 검색어를 이어받도록 연결했다.
- `TemplateGalleryModal`에 `initialSearch` prop을 추가하고, `SandboxCatalogPanel → SandboxEditorRail → PageSwitcher`로 query를 전달한다.
- Add 패널에서 `법률` 검색 후 showroom을 열면 쇼룸 검색창도 `법률`로 시작하고 `법률사무소 홈`이 바로 보인다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승)
  - `git diff --check` ✅
- 다음 후보:
  - 페이지/섹션 템플릿 검색 경험을 더 통합하거나, W216~W225 editor 고도화 잔여 UX를 계속 재스캔한다.

## 2026-05-13 Codex /goal M51 Page template prompt back path

- 사용자가 말한 “템플릿 적용하려고 한 뒤 다시 뒤로 가고 싶으면 버튼도 없음” 피드백을 page template 생성 확인 단계까지 확장했다.
- `PageSwitcher`의 page slug prompt에 `다른 템플릿 선택` 버튼을 추가했다. 선택한 템플릿으로 새 페이지를 생성하기 전, prompt에서 바로 261개 template showroom으로 돌아갈 수 있다.
- Add 패널 검색어로 연 showroom에서 template preview → `이 템플릿 사용` → slug prompt → `다른 템플릿 선택`을 눌러도 쇼룸 검색어 `법률`이 유지되는지 Playwright로 고정했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승)
- 다음 후보:
  - 페이지/섹션 템플릿 검색 경험을 한 단계 더 통합하거나, W216~W225 editor 고도화 잔여 UX를 계속 재스캔한다.

## 2026-05-13 Codex /goal M52 Page template search previews

- Add 패널 검색 결과 안에 261개 page template showroom의 상위 결과를 직접 노출했다. 사용자는 CTA만 누르는 대신 `법률` 검색 결과에서 바로 `법률사무소 홈` 같은 page template card를 볼 수 있다.
- `SandboxCatalogPanel`이 page template catalog metadata를 검색하고, 이름/id/설명/태그/섹션 매칭에 점수를 줘 더 직접적인 match를 앞에 배치한다.
- page template result card를 클릭하면 해당 템플릿 이름으로 showroom을 열고, 기존 preview/use/back prompt 흐름도 이어진다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승)
  - `git diff --check` ✅
- 다음 후보:
  - template result card에 thumbnail/metadata를 더 풍부하게 하거나, W216~W225 editor 고도화 잔여 UX를 계속 재스캔한다.

## 2026-05-13 Codex /goal M53 Page template result thumbnails

- M52의 page template search result card를 텍스트 버튼에서 미니 showroom card로 보강했다.
- Add 패널 검색 결과 card는 `TemplateThumbnailRenderer` 기반 썸네일, Premium/Standard 품질 배지, 페이지 타입, 스타일, 섹션 수, 대표 태그를 보여준다.
- 검색은 full page template document를 유지하는 `getAllTemplates()` 기반으로 바꿔 썸네일과 metadata를 같은 source에서 렌더한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승)
  - `git diff --check` ✅
- 다음 후보:
  - W216~W225 editor 고도화 잔여 UX를 계속 재스캔한다.

## 2026-05-13 Codex /goal M54 FAQ reveal persistence

- 사용자 보고의 “노드 선택 뒤 글이 사라짐” 계열을 FAQ accordion에도 확장 점검했다.
- `interactivePreview`에 `faqRevealedIndices`를 추가했다. editor canvas에서 한 번 열어 확인한 FAQ answer는 다른 노드를 선택해도 계속 visible preview로 남는다.
- 서비스 카드의 editor-only multi reveal 정책과 FAQ 동작을 맞췄고, published single-open runtime은 건드리지 않았다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-stability.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승)
  - `git diff --check` ✅
- 다음 후보:
  - W216~W225 editor 고도화 잔여 UX를 계속 재스캔한다.

## 2026-05-13 Codex /goal M55 Interactive preview document reset

- M54 이후 남은 상태 누수 후보를 재스캔했고, `replaceDocument()`가 selection/history는 초기화하지만 services/FAQ preview state는 유지하던 점을 닫았다.
- `interactivePreview` 기본값을 helper로 분리하고, 페이지 전환/템플릿 적용/rollback처럼 문서를 교체하는 경로에서 services/FAQ open/revealed index를 기본 `[0]` 상태로 되돌린다.
- 서비스 2번과 FAQ 3번을 열어 둔 뒤 다른 문서로 교체하면 preview state가 초기화되는 단위 회귀를 추가했다.
- 검증:
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅ (5 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승)
- 다음 후보:
  - W216~W225 editor 고도화 잔여 UX 또는 template/page switching 실사용 회귀를 계속 재스캔한다.

## 2026-05-13 Codex /goal M56 Editor preference normalization

- M28 editor prefs 저장값을 점검했고, 기존 `loadEditorPreferences()`가 top-level만 merge해 과거/부분 localStorage에서 nested 기본값이 빠질 수 있는 gap을 닫았다.
- `normalizeEditorPreferences()`를 추가해 rulers/outline/pixelGrid/alignDistribute 기본값을 깊게 채우고, grid size/opacity/tolerance는 안전 범위로 clamp한다.
- reference guides, shortcut overrides, comments, component library entries는 필수 필드가 맞는 항목만 유지한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/editor-prefs.test.ts` ✅ (2 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-guides-grid.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
- 다음 후보:
  - W216~W225 editor 고도화 또는 template/page switching 실사용 회귀를 계속 재스캔한다.

## 2026-05-13 Codex /goal M57 Template gallery back search + preview sync

- Template showroom에서 외부 검색어로 진입한 뒤 내부에서 다른 검색어를 입력하고 적용 확인 prompt에서 뒤로 가면, 최신 showroom 검색어가 유지되도록 했다.
- `TemplateGalleryModal`은 `onSearchChange`를 통해 debounced search input을 상위로 전달하고, `PageSwitcher`는 gallery open search와 last search를 분리해서 back path에 사용한다.
- Playwright 재실행 중 주요업무 `home-services-card-1-detail-0`이 실제 클릭 뒤 hidden으로 남는 실패가 재현돼, preview open/revealed index 동기화를 `CanvasNode` effect에만 맡기지 않고 store selection setter에서 즉시 처리하게 보강했다.
- 검증:
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/store-transient.test.ts src/lib/builder/canvas/__tests__/editor-prefs.test.ts` ✅ (8 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승)
- 다음 후보:
  - W216~W225 editor 고도화 또는 template/page switching 실사용 회귀를 계속 재스캔한다.

## 2026-05-13 Codex /goal M58 Template search aliases

- Add 패널 page template results와 full template showroom이 서로 다른 검색 기준을 쓰던 부분을 공통 helper로 묶었다.
- `filters.ts`에 한국어 page type/industry/template-market alias와 score helper를 추가했다. `홈페이지`, `주요업무`, `칼럼 아카이브`, `예약하기`, `쇼핑몰`, `여행사`, `치과`, `동물병원`, `AI 디자인 전문 사이트` 같은 검색어가 실제 261개 template catalog에서 잡힌다.
- Add 패널의 page template preview 결과는 같은 score를 쓰고, 상위 노출을 4개에서 8개로 늘렸다.
- 검증:
  - `npm run test:unit -- src/lib/builder/templates/__tests__/filters.test.ts` ✅ (5 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승)
- 다음 후보:
  - template discovery UX를 더 실사용에 가깝게 다듬거나, W216~W225 editor 고도화/템플릿 적용 회귀를 계속 재스캔한다.

## 2026-05-13 Codex /goal M59 Public locale page resolution guard

- 사용자가 지적한 “편집기는 한국어인데 사이트가 중국어로 뜨는” 혼선 후보를 public page resolver에서 닫았다.
- 기존 public resolver는 `locale`을 받으면서도 `site.pages` 전체에서 home/slug 후보를 고른 뒤 최신 페이지를 우선했다. 같은 slug의 zh-hant page가 더 최신이면 `/ko`가 번중 page meta를 선택할 수 있었다.
- `findPageMetaForLocale()`를 추가해 `projectPagesForLocale()`로 locale projection을 먼저 적용한 뒤 home/slug를 고르게 했다.
- 검증:
  - `npm run test:unit -- src/lib/builder/site/__tests__/page-resolution.test.ts` ✅ (3 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/locale-projection.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승)
- 다음 후보:
  - W216~W225 editor 고도화/템플릿 적용 회귀를 계속 재스캔한다.

## 2026-05-13 Codex /goal M60 Template internal link locale normalization

- M59 이후 남은 locale 혼선 후보로, KO 기반 page template document를 zh-hant/en 페이지에 적용할 때 node content 안의 CTA/hotspot href가 `/ko/...`로 남는 경로를 닫았다.
- `normalizeCanvasDocument()`가 nested object/array의 `href` 값을 재귀적으로 보고, `/ko`, `/zh-hant`, `/en`으로 시작하는 내부 링크만 요청 locale prefix로 바꾼다. 외부 URL과 `#contact` 같은 순수 anchor link는 그대로 둔다.
- 단위 테스트는 button href/link, image hotspot href, query/hash 포함 prefix, 외부 URL, anchor 보존을 같이 검증한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/locale-links.test.ts` ✅ (1 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/locale-projection.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승)
- 다음 후보:
  - W216~W225 editor 고도화/템플릿 적용 회귀를 계속 재스캔한다.

## 2026-05-13 Codex /goal M61 Initial draft overwrite guard

- M60 이후 `section-template-click.playwright.ts`를 재실행해 사용자가 말한 주요업무 템플릿 글 사라짐 계열이 다시 실패하는 것을 확인했다.
- 원인은 `/admin-builder` 초기 draft fetch가 늦게 끝나면서, 사용자가 이미 Add 패널에서 삽입한 Service Accordion 섹션 문서를 이전 서버 draft로 `replaceDocument()`하는 race였다.
- `useSandboxSiteState`에 현재 canvas document ref를 두고, 초기 draft 로드 요청이 시작된 뒤 `updatedAt`이 바뀌었으면 응답을 무시하게 했다. 명시적 page/locale 전환이나 conflict reload의 draft load는 기존처럼 동작한다.
- 검증:
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승)
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅ (6 passed)
  - `npm run typecheck` ✅
- 다음 후보:
  - 템플릿 적용/페이지 전환 race와 W216~W225 editor 고도화 회귀를 계속 재스캔한다.

## 2026-05-13 Codex /goal M62 Design panel template discovery

- 사용자가 Design 패널에서 “주요업무 눌렀는데 겨우 네 개 템플릿만 있음”이라고 느낀 원인을 정보 구조에서 보강했다.
- Design 패널 첫 화면은 이제 섹션 이름 4개 pill이 아니라 각 섹션별 template entry card를 보여준다. 주요 서비스/칼럼/FAQ/오시는길 각각 `12개 디자인 템플릿`임을 표시한다.
- 같은 Design 패널에서 `전체 페이지 템플릿 261개 보기` 버튼으로 full template showroom을 바로 열 수 있다. Add 패널과 같은 page template market entry를 공유한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (4 passed, Chromium sandbox 권한 상승)
- 다음 후보:
  - 템플릿 적용/페이지 전환 UX와 W216~W225 editor 고도화 회귀를 계속 재스캔한다.

## 2026-05-13 Codex /goal M63 Page template create retry state

- 템플릿 적용 확인 prompt에서 slug 중복/API 실패가 나면 prompt가 닫히고 선택한 템플릿도 사라져, 사용자가 slug 수정이나 `다른 템플릿 선택`으로 돌아갈 수 없던 흐름을 고쳤다.
- `PageSwitcher`는 page create 성공 시에만 slug prompt와 pending template을 정리한다. 실패 시에는 slug 입력값, 선택 템플릿, back button을 유지하고 prompt 안에 오류를 표시한다.
- prompt overlay에 `role="dialog"`/`aria-modal`/`aria-label`을 붙여 테스트와 접근성 기준을 맞췄다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (5 passed, Chromium sandbox 권한 상승)
- 다음 후보:
  - 템플릿 생성 성공 후 새 페이지 선택/저장 persistence와 W216~W225 editor 고도화 회귀를 계속 재스캔한다.

## 2026-05-13 Codex /goal M64 Page template create success persistence

- page template 생성 성공 path를 실제 UI+API로 고정했다.
- `TemplateGalleryModal`이 선택한 template name을 `PageSwitcher`에 넘기고, 새 페이지 title은 slug 대신 template name(`법률사무소 홈`)을 사용한다. 빈 페이지는 기존처럼 slug title을 유지한다.
- Playwright는 Add 패널에서 `법률` 검색 → `법률사무소 홈` preview → slug 입력 → 생성 → 새 canvas에 template text 표시 → pages API title 확인 → draft API에 template document 저장 확인까지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (6 passed, Chromium sandbox 권한 상승)
- 다음 후보:
  - W216~W225 editor 고도화와 템플릿/페이지 전환 실사용 회귀를 계속 재스캔한다.

## 2026-05-13 Codex /goal M65 Custom shortcut runtime evidence

- M28의 shortcut map 검증이 localStorage 저장까지만 확인하던 gap을 닫았다.
- `editor-advanced-panels.playwright.ts`는 duplicate 단축키를 `Mod+Shift+X`로 override한 뒤, 기존 `Mod+D`가 더 이상 복제하지 않고 커스텀 조합만 선택된 `home-hero-title`을 실제 `text-*` 노드로 복제하는지 검증한다.
- `Meta+A` 다중 선택 잔여 상태가 custom shortcut 검증을 오염시키지 않도록 `Escape`로 선택을 비우고 레이어에서 단일 노드를 다시 선택하는 절차를 추가했다.
- 검증:
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/shortcuts.test.ts src/lib/builder/canvas/__tests__/editor-prefs.test.ts` ✅ (4 passed)
- 다음 후보:
  - W216~W225 editor 고도화와 템플릿/페이지 전환 실사용 회귀를 계속 재스캔한다.

## 2026-05-13 Codex /goal M66 Custom shortcut label sync

- M65에서 runtime dispatch는 고정했지만, 툴바/인스펙터/컨텍스트 메뉴/도움말의 단축키 표시가 기본값(`Cmd+D` 등)에 머무는 gap을 닫았다.
- `shortcuts.ts`에 effective binding resolver/formatter를 추가하고, `useShortcutLabels()` 훅으로 editor prefs 변경 이벤트와 storage 변경을 구독하게 했다.
- selection toolbar, inspector duplicate button, context menu, shortcuts help, stage toolbar, zoom dock, link badge가 같은 binding map을 읽어 커스텀 단축키 라벨을 표시한다.
- 기존 context menu에 보이던 lock 단축키도 실제 `toggleLock` action으로 연결해 표시와 동작을 맞췄다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/shortcuts.test.ts src/lib/builder/canvas/__tests__/editor-prefs.test.ts` ✅ (5 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `git diff --check` ✅
- 다음 후보:
  - 실제 우클릭/노드 클릭/템플릿 전환 체감 회귀와 W216~W225 editor 고도화를 계속 재스캔한다.

## 2026-05-13 Codex /goal M67 Layer focus real pointer actions

- M66 검증 중 레이어 패널에서 선택한 노드가 실제 화면 x=8000px대에 남아, DOM 선택은 됐지만 실제 브라우저 포인터 우클릭은 메뉴를 못 여는 회귀 후보를 재현했다.
- `SandboxLayersPanel`은 레이어 row 선택 시 `builder:focus-canvas-node` 이벤트를 보내고, `CanvasContainer`는 선택 노드 rect를 기준으로 horizontal pan을 조정해 선택 노드가 viewport 안에 들어오게 했다.
- 별도 Playwright는 `elementFromPoint()`가 선택된 `home-hero-title`을 실제로 가리키는지 확인한 뒤, synthetic dispatch 없이 `page.mouse.click(..., { button: 'right' })`로 컨텍스트 메뉴를 연다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/layer-focus-context-menu.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `git diff --check` ✅
- 다음 후보:
  - 템플릿 적용 뒤 노드 전환/칼럼/이미지 클릭 백지화 회귀와 W216~W225 editor 고도화를 계속 재스캔한다.

## 2026-05-13 Codex /goal M68 Archive/image click blanking guard

- 사용자가 말한 “칼럼아카이브나 사진 클릭하면 사라져 백지가 되는” 경로를 기존 `node-click-stability.playwright.ts`로 재확인했다.
- 기존 방어 로직은 현재 통과한다. M68에서는 테스트가 단순 URL 유지에 그치지 않고, editor body text, canvas application, node tree count, 아카이브/이미지 노드 유지, 이미지 선택 후 asset library 노출까지 확인하게 강화했다.
- 아카이브 preview 내부 링크 클릭도 `/ko/admin-builder`에 머물고 canvas가 살아있는지 확인한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-stability.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승)
  - `git diff --check` ✅
- 다음 후보:
  - 전체 WIX parity 문서/goal 파일 기준으로 남은 editor UX gap을 계속 스캔한다.

## 2026-05-13 Codex /goal M69 Page template navigation wiring

- self-check agent가 M69 최우선 후보로 잡은 “page template으로 새 페이지를 만들었지만 live header/menu에서 찾을 수 없는” Wix parity gap을 닫았다.
- `PageSwitcher`의 page template/blank page slug prompt에 `메뉴에 추가` 기본 체크 옵션을 추가했고, `/api/builder/site/pages` POST는 `addToNavigation`이 true면 생성된 pageId/title/href를 site navigation에 바로 append한다.
- `writeSiteDocument()`는 page list처럼 navigation도 최신-only 항목을 기본 보존한다. publish/다른 panel 저장이 오래된 site snapshot으로 새 메뉴 항목을 덮어쓰던 race를 막고, Navigation editor/delete/seed cleanup 같은 의도적 제거 경로만 `preserveMissingNavigation: false`로 opt-out한다.
- global header canvas가 있는 공개 페이지에서도 새 메뉴가 도달 가능하도록 `PublishedSitePageView`의 global header wrapper에 site navigation fallback을 함께 렌더한다. 일반 `SiteHeader`도 기본 6개 spec 외 사용자 정의 nav item을 표시한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/site/__tests__/persistence.test.ts` ✅ (13 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (6 passed, Chromium sandbox 권한 상승)
  - `git diff --check` ✅
- 다음 후보:
  - zh-hant/en page template 생성 시 내부 링크·메뉴 href locale normalization을 UI E2E로 확장하거나, W216~W225 editor 고도화 잔여 UX를 계속 재스캔한다.

## 2026-05-13 Codex /goal M70 Locale template page creation guard

- M69에서 메뉴 연결은 고정했지만, 사용자가 지적한 “한국어 편집기인데 중국어 사이트가 뜨는” 계열의 locale 혼선이 page template 생성 UI에도 재발하지 않도록 `zh-hant` 실제 생성 path를 추가 검증했다.
- `findPageIdBySlug()` helper를 locale-aware로 확장하고, 생성된 draft document의 모든 `href` 값을 수집해 template document 안에 `/ko` public path가 유입되지 않는지 확인한다.
- Playwright는 `/zh-hant/admin-builder`에서 Add 패널 `법률` 검색 → `법률사무소 홈` template preview → slug 생성 → `메뉴에 추가` 기본 체크 → navigation API href `/zh-hant/{slug}` → publish → public header `Main` nav href까지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "creates zh-hant template pages with localized menu and safe template links" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (7 passed, Chromium sandbox 권한 상승)
- 다음 후보:
  - page rename/delete와 navigation cleanup/fallback, 또는 en locale template creation까지 같은 path를 확장 검증한다.

## 2026-05-13 Codex /goal M71 API template link normalization guard

- M70의 실제 카탈로그 template UI 검증은 `law-home`이 `#` 링크 중심이라 `/ko/contact` 같은 hard-coded public path 정규화까지 직접 증명하지 못했다. M71은 `/api/builder/site/pages` 생성 경로에 synthetic template document를 넣어 저장 단계의 normalization을 고정했다.
- 테스트 문서는 button href `/ko/contact`, nested link `/ko?source=template`, text link `/ko/services?from=text`, image hotspots `/ko/about`, `/ko#top`, 외부 URL `https://example.com/ko/about`, anchor `#contact`를 포함한다.
- `zh-hant`와 `en` 각각에 대해 생성 draft의 `document.locale`, button/text/hotspot href 정규화, 외부 URL/anchor 보존, 남은 internal `/ko` href 없음, finally cleanup delete를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "stores page template documents with localized internal hrefs through the pages api" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (8 passed, Chromium sandbox 권한 상승)
- 다음 후보:
  - page rename/delete navigation cleanup/fallback 흐름을 실제 editor/API 회귀로 고정한다.

## 2026-05-13 Codex /goal M72 Auto navigation rename/delete sync

- M69에서 page template/blank page 생성 시 `nav-{pageId}` 메뉴를 자동 추가했지만, 이후 page PATCH rename은 href만 바꾸고 자동 생성 메뉴 label은 예전 제목으로 남을 수 있는 gap을 닫았다.
- `pages/[pageId]` PATCH의 navigation update가 해당 pageId의 href를 갱신하면서, `id === nav-{pageId}`인 자동 생성 메뉴 label은 page.title로 함께 동기화한다. 사용자가 직접 만든 다른 nav label은 유지된다.
- Playwright는 `addToNavigation: true` page 생성 → publish/public header old label 확인 → PATCH rename/title 변경 → navigation API href+label 변경 → public header new label 확인 → DELETE 후 navigation API와 home public header에서 제거까지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "keeps auto-added page navigation label and href in sync after rename and delete" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (9 passed, Chromium sandbox 권한 상승)
- 다음 후보:
  - remaining W216~W225 editor polish나 다국어 navigation rename/delete path를 계속 재스캔한다.

## 2026-05-13 Codex /goal M73 Undo timeline action evidence

- M28 advanced panels 테스트는 History/undo timeline이 보이는지만 확인하고 실제 Undo/Redo 버튼이 canvas history에 연결됐는지 증명하지 못했다.
- `UndoStackTimeline`의 Undo/Redo 버튼에 `data-builder-undo-action` 식별자를 추가했다.
- `editor-advanced-panels.playwright.ts`는 전역 사이트 상태에서 한국어 홈이 빠져도 흔들리지 않도록 임시 canvas page를 API로 생성해 열고, 테스트 종료 시 삭제한다. 이 과정에서 주석 입력도 선택 node comments panel 범위 안에서 재시도하도록 안정화했다.
- Playwright는 custom duplicate shortcut으로 생성된 `text-*` 노드 수를 기준으로 Undo 버튼 클릭 시 복제 노드가 사라지고, Redo 버튼 클릭 시 다시 생성되는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승)
  - `git diff --check` ✅
- 다음 후보:
  - W216~W225 editor polish와 page/template locale/navigation 잔여 gap을 계속 재스캔한다.
