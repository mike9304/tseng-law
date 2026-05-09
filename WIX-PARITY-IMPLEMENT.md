# WIX-PARITY-IMPLEMENT.md

## 7. 마일스톤 상세 매뉴얼 (M00 ~ M28)

### M00 — mergeMissingPages 데이터 손실 fix
**Why**: 두 탭 race로 삭제된 페이지가 silent corruption으로 부활.
**위치**: `src/lib/builder/site/persistence.ts:127-139` (mergeMissingPages 함수).
**작업**:
1. `writeSiteDocument()`의 `mergeMissingPages` 옵션 기본값을 `true` → `false`
2. `rg "writeSiteDocument" src/` 로 모든 호출자 grep
3. 의도적으로 missing page 부활이 필요한 호출자만 명시적 `{ mergeMissingPages: true }`
4. 신규 Playwright `tests/builder-editor/cross-tab-delete-race.playwright.ts`:
   - 탭 A로 `/ko/admin-builder` 열고 임시 page P 생성
   - 탭 B로 같은 site 열고 P 캔버스 변경 (메모리에 P 보유)
   - 탭 A에서 P 삭제 → API 200
   - 탭 B에서 다른 페이지 변경 저장 → API 200
   - `/api/builder/site/pages?locale=ko` GET → P 미부활 확인
   - cleanup
**Done**: 신규 Playwright 통과 + 기존 21+ Playwright bundle 회귀 0
**커밋**: `G-Editor: fix mergeMissingPages cross-tab data corruption`

### M01 — Performance 잔여 fix (감사 #6 #7 #9 #10 #11)
각각 별도 commit. 200/300 노드 fixture로 fps 회귀 측정 추가.

#### #7 history.ts:36 structuredClone 풀 도큐 → patch-based
- 의존: 이미 `immer` 사용 중. `produceWithPatches` 활용
- 변경: `history.ts`의 ring-buffer가 full document 대신 immer patches 저장
- ring 크기 100 유지
- undo/redo는 patches inverse 적용
- 기존 unit test 유지 + 신규: `history.test.ts`에 50+ 노드 페이지 100회 commit 메모리 < 200MB 검증
**커밋**: `G-Editor: replace history full clone with immer patches`

#### #6 snap.ts:99-247 1차+2차 루프 통합 + 후보 prune
- 1차 (alignment) / 2차 (spacing) 루프 합치기
- 후보 prune: 현재 viewport bounds 밖 노드 제외
- 200 노드 fixture에서 snap 시간 측정. 기존 대비 50%+ 감소 목표
- `snap.test.ts`에 prune 케이스 추가 (viewport 밖 노드 미포함 검증)
**커밋**: `G-Editor: prune snap candidates by viewport`

#### #10 InsightsArchiveListPreview SWR 캐싱
- 위치: `CanvasNode.tsx:217-326` 또는 별 컴포넌트
- locale별 cache key. SWR 또는 React.cache 사용
- locale 변경 시 invalidate
- 신규 unit test: 같은 locale 2회 mount → fetch 1회만
**커밋**: `G-Editor: cache insights archive preview by locale`

#### #11 Space-key keyup 가드
- 위치: `CanvasContainer.tsx:738-757`
- 기존 keyup handler가 isTextInput / activeElement contenteditable 체크 없이 toggle
- 추가: 활성 input/textarea/contenteditable 감지 시 early return
- `tests/builder-editor/admin-builder.playwright.ts`에 텍스트 입력 중 space 입력해도 pan mode 안 들어가는지 검증
**커밋**: `G-Editor: guard space-key keyup against text inputs`

#### #9 CanvasContainer.tsx:1252-1259 Math.min spread 제거
- spread 4번 → reduce 또는 외부 helper
- 65K 노드 stack overflow 방지
- 단위 테스트는 추가 안 해도 됨 (기존 test 회귀로 충분)
**커밋**: `G-Editor: avoid spread overflow in min/max bounds`

### M02 — Hot files split (기능 변경 0)
의존: M00 통과. 4 파일 각각 별도 PR/commit.

#### M02-1 SandboxPage.tsx (1610 → < 800)
- 추출 1: `src/components/builder/canvas/SandboxModalsRoot.tsx`
  (PreviewModal, ShortcutsHelpModal, MoveToPageModal, AssetLibraryModal,
   SiteSettingsModal, PublishModal, VersionHistoryPanel, SeoPanel 등 mount 묶음)
- 추출 2: `src/components/builder/canvas/hooks/useSandboxSiteState.ts`
  (site/page state + mutation handler 묶음)
- 추출 3: `src/components/builder/canvas/SandboxRailDocks.tsx`
  (좌하단 fixed return dock / public floating chrome dock)

#### M02-2 CanvasContainer.tsx (2214 → < 800)
- 추출: hooks 폴더에
  - `useCanvasDrag.ts`
  - `useCanvasResize.ts`
  - `useCanvasRotate.ts`
  - `useCanvasKeyboard.ts`
  - `useCanvasSelection.ts`
  - `useCanvasSnap.ts`
- pointermove/up handler가 위 hook들 조립

#### M02-3 CanvasNode.tsx (1622 → < 800)
- kind별 render branch 분리:
  - `src/components/builder/canvas/elements/TextNode.tsx`
  - `HeadingNode.tsx`
  - `ButtonNode.tsx`
  - `ImageNode.tsx`
  - `ContainerNode.tsx`
  - `SectionNode.tsx`
  - `CompositeNode.tsx`
  - `MapNode.tsx`
  - `BlogFeedNode.tsx`
  - `FormNode.tsx`
  - `BookingWidgetNode.tsx`
  - 기타 (Divider/Spacer/Icon/VideoEmbed)
- `CanvasNode.tsx`는 dispatch 컨테이너로

#### M02-4 SandboxPage.module.css (4431 → 8+ module)
- `topBar.module.css` (32px policy 영역)
- `leftRail.module.css` (64px dark rail)
- `drawer.module.css` (slide drawer)
- `stage.module.css` (canvas stage)
- `inspector.module.css`
- `modals.module.css`
- `statusBar.module.css`
- `tokens.module.css` (CSS variables 통합)
- 각 module은 700 LOC 이하

**검증**: typecheck/lint/test/build/Playwright 통과 + 시각 회귀 0
(visual regression baseline 비교)

### M03 — 보안 3건

#### M03-1 CSRF Origin 검증
- 위치: `src/lib/builder/api/guards.ts` (또는 guardMutation 호출 지점)
- 추가: 모든 mutation에서 `Origin` 또는 `Referer` 헤더 검증
- 허용 list: 환경변수 `BUILDER_ALLOWED_ORIGINS` (콤마 분리), default localhost+`tseng-law.com`
- 미일치 → 403 `csrf_origin_mismatch`
- 신규 unit test: guard helper에 invalid origin 입력 시 throw

#### M03-2 Upstash rate limit
- 의존성: `npm i @upstash/ratelimit @upstash/redis`
- 환경변수: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- 미설정 시 in-memory fallback (현재 동작 유지)
- mutation별 rate (publish 10/min, asset upload 30/min, draft 60/min)
- 429 응답에 `Retry-After` 헤더
- 신규 unit test: in-memory fallback 동작 검증

#### M03-3 Asset upload validation
- 위치: asset upload route (`src/app/api/builder/assets/...`)
- type allowlist: `image/png|jpeg|gif|webp|svg+xml`
- size cap: 10MB (`BUILDER_ASSET_MAX_BYTES` env override)
- MIME magic byte 검증: `npm i file-type` 또는 직접 1KB header sniff
- SVG는 추가 sanitize (스크립트/이벤트 핸들러 제거 — F2 패턴 재사용)
- 위반 시 415 `unsupported_media` / 413 `payload_too_large`
- 신규 Playwright: 1MB png OK / 0.1MB exe rejected / 50MB png rejected

**커밋**: 각각 별도

### M04 — AI 검증 인프라 7종
의존: M02 통과 (split 안된 hot file은 visual baseline 깨짐)

#### M04-1 Visual regression
- Playwright `toHaveScreenshot()` 활성화 (config.expect.toHaveScreenshot)
- baseline 추가:
  - `/ko/admin-builder` 첫 화면
  - Catalog drawer 열림
  - Inspector with text node selected
  - PreviewModal open with mobile device
  - Site Settings modal
  - Asset Library modal
- max diff 1px / 0.5% pixel ratio
- baseline 폴더: `tests/visual/baseline/`
- 새 위젯 추가 시마다 baseline 1개 추가 (M11~M20에서)

#### M04-2 Sentry
- `npm i @sentry/nextjs`
- `sentry.client.config.ts` + `sentry.server.config.ts` + `sentry.edge.config.ts`
- DSN env: `NEXT_PUBLIC_SENTRY_DSN` (없으면 no-op)
- BrowserTracing + Replay 5%
- builder route 전체 + public `/`,`/[locale]`
- 신규 unit test 없음 (런타임 도구)

#### M04-3 Lighthouse CI
- `npm i -D @lhci/cli`
- `lighthouserc.json`: 2 routes (`/ko/admin-builder`, `/ko`)
- assertions: perf 80 / a11y 95 / best 90 / seo 90 minor
- npm script: `"lhci": "lhci autorun"`
- CI integration (GitHub Actions yaml 추가, fail on assert)

#### M04-4 axe-core
- `npm i -D @axe-core/playwright`
- 모든 builder-editor smoke 끝에 `await checkA11y(page)` 호출 helper
- WCAG 2.1 AA 위반 0 fail
- 위반 발견 시 fix 후 재실행

#### M04-5 한글 IME 시뮬
- 신규 `tests/builder-editor/inline-text-ime.playwright.ts`
- TipTap inline editor에서:
  ```js
  await page.evaluate(() => {
    const el = document.querySelector('[data-builder-inline-text-editor]');
    el.dispatchEvent(new CompositionEvent('compositionstart'));
    el.dispatchEvent(new InputEvent('beforeinput', { data: '안녕' }));
    el.dispatchEvent(new CompositionEvent('compositionupdate', { data: '안녕' }));
    el.dispatchEvent(new CompositionEvent('compositionend', { data: '안녕' }));
  });
  ```
- blur → 저장 → reload → "안녕" 유지 검증
- 한자 시뮬도 동일 패턴 (`한자` → `漢字`)

#### M04-6 WebKit / Firefox project
- `playwright.config.ts`에 projects 추가:
  - `chromium-builder` (기본)
  - `webkit-builder` (admin-builder smoke만)
  - `firefox-builder` (admin-builder smoke만)
- CI matrix 3 brower
- 발견되는 Safari/Firefox-specific 버그 즉시 fix

#### M04-7 zh-hant smoke
- 신규 `tests/builder-editor/zh-hant-smoke.playwright.ts`
- `/zh-hant/admin-builder` 200, `/zh-hant/columns` 200
- 칼럼 제목 한자 렌더 회귀 검증
- 인스펙터/카탈로그 라벨 한자 fallback 확인

**커밋**: 각각 별도

### M05 — Empty / Error state sweep
**스코프**:
- 칼럼 0건일 때 columns 페이지 렌더 (empty state UI 추가)
- 페이지 0개일 때 PageSwitcher 빈 상태 + 신규 페이지 유도
- Asset 0개일 때 AssetLibraryModal 빈 상태 + 업로드 유도
- 네트워크 에러 시뮬: `page.route('**/api/**', r => r.abort())` 후 사용자에게
  토스트 (`네트워크 오류, 다시 시도해주세요`) + 재시도 버튼
- 401/500 응답 시 사용자 액션 차단 (저장 버튼 disabled) + 사유 표시
- IME 조합 중 외부 클릭 (blur) → composition end 처리 후 저장
- 매우 긴 한글 텍스트 (1000자) 입력 → overflow 처리
- 페이지 0 노드 → "페이지가 비어있습니다, 좌측 + 패널에서 추가하세요" 안내

**검증**: 신규 Playwright 6+개 (각 시나리오)

### M06 — .next/dev 재시작 의존성 fix
**Why**: SESSION에 12회+ "build 후 .next 삭제 + dev 재시작" 등장.
**옵션 A**: dev/build distDir 분리
- `next.config.mjs`에 `process.env.NEXT_DEV ? '.next-dev' : '.next-build'`
**옵션 B**: pre-dev hook
- npm script `"dev": "rimraf .next-build && next dev"`
어느 쪽이든 README + npm script + SESSION.md에 명시.

### M07 — 모바일 스키마 결정 + 잠금 (사용자 인가 필요한 인터럽트 1)
의존: M00.
**입력**: 사용자에게 다음 결정 1회 요청 (단 1회 인터럽트):
1. per-viewport `fontSize` override 위치:
   - 옵션 A: `responsive.tablet.style.fontSize` inline
   - 옵션 B: 별도 typography scale token
2. `hiddenOnViewports[]` vs 현재 `responsive.<vp>.hidden` boolean
3. mobile sticky header 자동 변환 (W43): 글로벌 헤더 schema에 `mobileSticky: boolean`
4. mobile bottom CTA 바 (W44): 별도 `mobileBottomBar` site-level entity
5. hamburger 자동 변환 (W39): 글로벌 헤더 schema 수준에서 처리 vs 위젯 variant

**결정 후**:
- `types.ts` schema 확장 (필드 추가만, 제거 금지)
- `Phase 2 모바일 스키마 초안.md`에 결정 lock 명시
- `Wix 체크포인트.md` Phase 2 헤더에 잠금 일시 기재
- `seed-home`은 변경 안 함 (lock-in)
- **마이그레이션 스크립트 작성 (강제, 같은 PR에)**:
  - `normalizeCanvasDocument()` / `normalizeSiteDocument()` 안에 version
    detection + auto-fill 추가
  - 신규 필드 default value 명시 (예: `responsive.tablet.fontSize = base.fontSize`)
  - production site.json backup → 마이그 → 결과 비교 dry-run 단위 테스트 추가
  - 백업 키: `builder-site/<id>/backups/before-M07-<timestamp>.json`
  - 롤백 path 문서화 (`Documentation.md`에 백업 키 + rollback 명령 기재)

### M08 — Mobile inspector per-viewport UI (W31~W38)
**스코프**:
- 인스펙터 Layout 탭에 viewport 토글 (Desktop/Tablet/Mobile)
- 토글 active viewport에 따라 rect/fontSize/hidden override 입력 행
- desktop 값에서 fork 시 "override created" 시각 표시
- override 제거 버튼 (default 상속)
- BreakpointSwitcher와 동기화

**검증**: Playwright `tests/builder-editor/mobile-inspector.playwright.ts`
- 임시 page 생성 → 노드 선택 → tablet 토글 → fontSize 24 → save
- desktop 토글 → 원본 fontSize 유지 확인
- mobile 토글 → hidden 체크 → save → public mobile viewport에서 미렌더 확인

### M09 — Mobile auto-fit + 자동 변환 (W37, W39)
- 모바일 모드에서 override 없는 노드는 단열/전폭/세로 스택 자동 fit
- BuilderNavItem 메뉴: 모바일에서 hamburger drawer로 자동 변환

### M10 — Mobile sticky / preview iframe (W40~W45)
- W40 PreviewModal에 실제 published page iframe (이미 컴포넌트 있음, wiring만)
- W41 viewport 아웃라인 (iPhone frame 그래픽)
- W42 viewport 전환 시 undo stack 유지 (현재 commit 기반이라 자동)
- W43 sticky header 모바일
- W44 footer fixed CTA bar
- W45 long-press = right-click (touch 환경에서 contextmenu 발화 helper)

### M11 — Text 위젯 팩 (W46~W55)
**위젯 10종**: Heading H1~H6 / Rich text inline toolbar / Inspector RTE /
Text on path / Multi-column / Quote / List / Marquee / Typography preset / Link

**위젯당 5점 셋 (canonical 패턴)**:
1. `src/lib/builder/site/types.ts` — `kind` enum 추가, `<Kind>NodeSchema = baseCanvasNodeSchema.extend(...)`
2. `src/components/builder/canvas/elements/<Kind>.tsx` — Element 렌더 (CanvasNode dispatch에서 호출)
3. `src/components/builder/canvas/elements/<Kind>Inspector.tsx` — Inspector content 탭
4. `src/lib/builder/site/published-node-frame.ts` — published render branch
5. `src/lib/builder/components/widgets/<kind>/index.ts` — registry export

**공통 패턴**:
- Inspector primitives: D-POOL-3 정의 사용
- TipTap: `immediatelyRender: false`
- 모든 link 입력: `LinkPicker` (C3)
- Typography preset: `theme.ts` text presets

**검증 (자동만)**:
- 신규 unit: 각 위젯 schema parse + clone (10 case)
- 신규 Playwright: + 패널 드래그 → 캔버스 드롭 → 인스펙터 편집 → 저장 → reload → public 렌더 (위젯당 1 시나리오)
- visual regression baseline 10개 추가
- axe scan 통과

**Done**:
- [ ] 10 위젯 구현 + 등록
- [ ] 자동 검증 게이트 통과
- [ ] 체크포인트.md W46~W55 🟢
- [ ] Documentation.md M11 기록

### M12 — Media 위젯 팩 (W56~W70)
- W56 Lightbox click trigger (이미지 클릭 → 풀스크린 모달)
- W57 Image hotspots (이미지 위 포인트 + 툴팁)
- W58 Before/After compare slider
- W59 Hover image swap
- W60 Image click action (link/lightbox/popup)
- W61 SVG 인라인 색 편집
- W62 Lottie animation
- W63 Video box (MP4 업로드)
- W64 YouTube embed (커스텀 wrap)
- W65 Vimeo embed
- W66 Video background (섹션 배경 영상)
- W67 Audio player
- W68 Spotify/SoundCloud
- W69 GIF (Giphy 검색 옵션)
- W70 Icon library (Lucide + FontAwesome)

같은 5점 셋 패턴. icon library는 1개 위젯으로 묶음 (kind 1, content.iconName 필드).

### M13 — Gallery 위젯 팩 (W71~W78)
- W71 Grid / W72 Masonry / W73 Slider / W74 Slideshow / W75 Thumbnail /
  W76 Pro gallery / W77 Caption overlay / W78 Filter

같은 패턴. `<GalleryNode kind="gallery" content.layout="grid|masonry|slider|...">` 단일 kind + variant로 묶기 권장.

### M14 — Layout 위젯 팩 (W79~W88)
- W79 Strip / W80 Box / W81 Column 2/3/4 / W82 Repeater / W83 Tabs / W84 Accordion / W85 Slideshow container / W86 Hover box / W87 Sticky/anchor / W88 Grid layout

`Container` kind 확장으로 처리. layoutMode 추가 ('strip', 'tabs', 'accordion', 'slideshow', 'hoverBox', 'grid').

### M15 — Interactive 위젯 팩 (W89~W98)
- W89 Button variants (이미 8 variant) / W90 Icon button / W91 Lightbox modal / W92 Popup with trigger / W93 Notification bar / W94 Cookie consent / W95 Countdown / W96 Progress / W97 Star rating / W98 Back to top

site-level entity 필요한 것들 (Lightbox, Popup, Notification bar, Cookie consent)은 기존 `site/types.ts` lightboxes 패턴 따라 확장.

### M16 — Navigation 위젯 팩 (W99~W105)
- W99 Horizontal menu / W100 Vertical / W101 Mobile hamburger 자동 변환 (M07 확정 후) / W102 Dropdown 계층 (이미 일부) / W103 Mega menu (이미지 패널 있는 진짜 mega) / W104 Anchor menu (페이지 내 섹션 점프) / W105 Breadcrumbs

### M17 — Social 위젯 팩 (W106~W113)
- W106 Social bar / W107 Share buttons / W108 Instagram feed / W109 YouTube subscribe / W110 LinkedIn follow / W111 WhatsApp 플로팅 / W112 Line / W113 Kakao

### M18 — Maps & Location (W114~W117)
- W114 (이미 🟡) sweep + green / W115 Address block / W116 영업시간 블록 / W117 다중 위치 지도

### M19 — Decorative (W118~W125)
- W118 Shape 라이브러리 / W119 Line/divider / W120 Spacer / W121 Gradient (🟢 유지) / W122 Pattern / W123 Parallax 배경 / W124 Frame / W125 Sticker

### M20 — Data Display (W126~W135)
- W126 Bar chart / W127 Line chart / W128 Pie chart / W129 Counter / W130 Testimonial carousel / W131 Pricing table / W132 Comparison table / W133 Timeline / W134 Team member card / W135 Service feature card

차트는 `recharts` 또는 `chart.js` 사용. lazy import.

### M21 — Forms 후반 (W141~W150)
- W141 Number/decimal validation / W142 Dropdown (있음, sweep) / W143 Radio (있음, sweep) / W144 Checkbox (있음) / W145 Date picker / W146 File upload (있음) / W147 Signature canvas (HTML5 canvas pad → PNG → asset 저장) / W148 Payment Stripe (Stripe Checkout 또는 Payment Element 통합) / W149 Conditional logic 강화 / W150 Submission dashboard + 메일 알림 강화

### M22 — Motion 후반 (W160~W175)
**Codex 스코프 (이번 goal)**:
- W159 Expand in (zoom 변형 추가)
- W160 Exit animation (entrance 반대 + IntersectionObserver leaving)
- W161 Background parallax (요소 parallax는 있음)
- W167 Scrub animation (스크롤 위치 = 프레임)
- W168 Hover fade (현재 lift/pulse만, fade 추가)
- W170~W171 Loop pulse/float/bounce
- W172 Page transition (route change fade/slide)
- W173 Motion timeline editor — **schema + runtime만**:
  - schema: `animation.timeline.keyframes[] = { timeOffset, properties, easing }` 타입
  - runtime: keyframe array → Web Animations API 또는 framer-motion 변환 + 재생 엔진
  - Inspector wiring: keyframe array를 받아서 prop 전달만 (시각 UI는 Claude)
- W174 Custom bezier — schema (cubic-bezier(x1,y1,x2,y2) string)만
- W175 Click trigger

**Claude 분담 (별도 진행, Codex는 손대지 말 것)**:
- W173 keyframe drag UI / easing curve visualizer / 타임라인 그래픽
- W174 cubic-bezier 시각 편집기 UI

**Codex가 끝내고 SESSION.md에 다음 표기**:
"M22 Codex 분량 완료. Claude timeline UI 트랙 발주 대기."

### M23 — Design system 마무리 (W184~W185)
- W184 Typography scale (1.125x/1.25x/1.333x ratio 드롭다운 → 모든 heading 자동 조정)
- W185 Style override visualizer ("이 스타일은 어디서 왔나" — theme/variant/manual 구분 표시)

### M24 — SEO + Publish 성숙 (W186~W195)
- W186 sitemap.xml 자동
- W187 hreflang 자동 (linkedPageIds 기반)
- W188 301 redirect 관리 UI
- W189 canonical URL 강화
- W190 slug 변경 시 자동 301
- W191 custom robots.txt
- W192 schema.org structured data (LegalService, FAQPage, Article)
- W193 pre-render 검증
- W194 CDN cache invalidation (publish 시 명시적)
- W195 SEO Inspector에 sitemap 포함 여부 + hreflang 시각화

### M25 — Bookings 본격 1 (W196~W202)
**M25 진입 직전 사용자 인가 인터럽트 2 (단 1회 질문)**:
호정 법률사무소 상담 결제 모델 결정 필요:
- 옵션 A: **무료 상담만** — 예약 = 일정만 잡고 결제 없음, Stripe 등 미연결
- 옵션 B: **전부 유료 상담** — 예약 시 선결제 (Stripe Payment Element)
- 옵션 C: **하이브리드** — 서비스별로 무료/유료 토글, service entity에 `pricing` 필드 추가

→ 사용자 응답 대기. 응답 후 W201 스코프 결정 후 진행.

**스코프**:
- W196 Service CRUD UI 풀 (옵션 C 선택 시 `pricing: { type: 'free'|'paid', amount, currency }` 추가)
- W197 Staff CRUD
- W198 Availability rules (요일/시간/예외)
- W199 예약 위젯 공개 페이지
- W200 슬롯 선택 UI
- W201 결제 통합 — 옵션별:
  - A: 스킵, "결제 없이 예약 확정" 흐름만
  - B: Stripe Payment Element 전체 통합 (Payment Intent + webhook + 환불 API)
  - C: service.pricing 따라 분기, paid 서비스만 Stripe
- W202 캘린더 sync Google/Apple (OAuth + iCal export)

**스키마 변경 시 마이그레이션 강제 룰 (§3) 적용**: `bookings/types.ts` 변경 PR에
normalizeBookings() 마이그 path 포함.

### M26 — Bookings 본격 2 (W203~W210)
- W203 예약 확정 이메일 (Resend / SMTP)
- W204 SMS 알림 (옵션, Twilio)
- W205 Zoom 자동 미팅 링크 (Zoom OAuth + Create meeting API)
- W206 캔슬 정책
- W207 리스케줄 UI
- W208 노쇼 처리
- W209 staff 캘린더 view
- W210 admin 예약 대시보드

### M27 — Bookings 본격 3 (W211~W215)
- W211 다국어 예약 (서비스명/설명 ko/zh-hant/en)
- W212 다중 사무소 (location 선택)
- W213 buffer time
- W214 timezone 처리
- W215 예약 분석 (월별 예약/취소율)

### M28 — 에디터 고도화 (W216~W225)
- W216 Rulers (좌/상단)
- W217 Layers tree advanced (이미 있음, sweep)
- W218 Outline/wireframe view
- W219 단축키 매핑 UI (사용자가 단축키 변경)
- W220 Align/distribute tools 강화 (수직/수평/매트릭스)
- W221 Pixel grid overlay
- W222 Reference guides (사용자가 가이드라인 그림)
- W223 Component library (사용자가 만든 재사용 노드)
- W224 Element comments (디자이너 주석)
- W225 Editor theme (라이트/다크)
