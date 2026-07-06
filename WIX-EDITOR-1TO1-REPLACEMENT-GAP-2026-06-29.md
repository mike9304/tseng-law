# Wix 에디터 1:1 대체 갭 리포트 (2026-06-29)

> **목적**: "에디터적으로 완벽히 Wix를 대체할 수 있는가?"에 대한 코드 수준 1:1 비교.
> **이전 STALE 보고서(`Wix 1to1 갭 분석 2026-04-28.md`)의 재작성** — 그 보고서는 구버전 코드 가정(17.8% 패리티, Phase 2~9 미시작)이었으나 본 분석은 **맥스튜디오 진짜 최신 작업본(git HEAD `bf21bff`, Wave 8)** 기준.

---

## 0. 한 줄 결론

**코드상으로 tseng-law 에디터는 이미 Wix를 대체하는 수준에 도달해 있다.** 위젯 83종·인스펙터 6탭·진짜 반응형 에디터·Motion 발행 런타임·Bookings 풀스택·Designer 도구까지 전 영역이 실구현됨. 과거 보고서의 "17.8% / Phase 2~9 미시작"은 완전히 stale.

남은 진짜 갭은 **(a) 브라우저 전수 검증 미완**(코드는 있어도 live 검증 보고서가 코어 편집 루프까지만 검증)과 **(b) 디테일 7~8종**(Interactions 탭, 요소 단위 SEO, 메뉴 시각 에디터, Lottie 비호스트, 별도 모바일 캔버스 등). "무엇을 만들어야 Wix 대체인가"가 아니라 "무엇을 검증/다듬어야 Wix 대체를 확정하는가"가 현 상태의 본질.

---

## 1. 평가 방법론 (근거 투명성)

| 항목 | 근거 |
|---|---|
| 코드 기준 | 맥스튜디오 `/Users/son7/Projects/tseng-law` HEAD `bf21bff` (2026-06-29), 작업트리 dirty(Codex 활동 중) |
| live 검증 | `WIX-BUILDER-VERIFY-REPORT-2026-06-29.md` — Playwright 자동 검증(dev 포트 3295) |
| 스코어카드 | `WIX-FULL-PRODUCT-CHECKPOINTS.md` (F-layer): 🟢70 + 🟡56 + 🔴2 + ⚫1 = 126/129 (97.7%) |
| 코드 딥다이브 | 3개 병렬 분석 — 위젯/Pages/Media, 인스펙터/Design/Designer, 모바일/Motion/Bookings |
| 평가 기준 | Wix Editor / Wix Studio 에디터 기능 체크리스트 |
| 한계 | ⚠️ 본 보고서는 **코드 + 코어 live 검증** 기준. 위젯/Motion/Bookings의 **전수 브라우저 검증은 미완**(live 보고서 "Still to verify" 참조). "구현됨" ≠ "100% 버그 없이 동작" |

---

## 2. 카테고리별 평가 (Wix 대체 달성도)

| 카테고리 | 상태 | 달성도 | 비고 |
|---|---|---|---|
| A. 자유 캔버스 편집 | 🟢 충족 | ~95% | live 검증 ✅ (선택/drag/resize/rotate/viewport/layers). 스냅/멀티셀렉트/undo 코드 구현 |
| B. 위젯·요소 라이브러리 | 🟢 충족 | ~95% | **83종 kind / 109 preset / 261 템플릿** — Wix "70+" 목표 초과 |
| C. Inspector | 🟢 대부분 | ~85% | 6탭(Layout/Style/Content/Animations/A11y/SEO). **Interactions 탭 없음**, 요소 SEO 미구현 |
| D. Pages & Navigation | 🟢 대부분 | ~85% | CRUD + 글로벌 헤더/푸터 편집 + 다국어. **메뉴 = 텍스트 편집**(시각 트리 에디터 아님) |
| E. Media & Assets | 🟢 충족 | ~90% | Vercel Blob + crop/filter/focal/alt/AI 탭 + 핫스팟/비교/SVG/GIF |
| F. Design System | 🟢 충족 | ~90% | 7탭 설정 + 6 색토큰 + 타이포 스케일 + 브랜드킷 + 다크모드 자동생성 |
| G. 반응형·모바일 | 🟢 충족 | ~90% | **진짜 반응형 에디터**(per-viewport rect/hidden/fontSize + cascade). "@media 덮어쓰기만"은 stale |
| K. Motion | 🟢 충족 | ~90% | **발행 런타임 실구현**(IntersectionObserver/rAF) — 에디터 미리보기만이 아님 |
| Phase 9. Designer 도구 | 🟢 충족 | ~85% | rulers/layers DnD/align 6종/단축키 28종/snap/zoom/floating 툴바 |
| Phase 8. Bookings | 🟢 충족 | ~90% | 풀스택: Stripe/Google·Outlook 싱크/Zoom/Twilio/대기자/패키지크레딧/취소환불 |
| **종합 (코드 기준)** | **🟢** | **~89%** | **Wix 대체 수준 도달**. 단 live 전수 검증 미완 |

> 점수는 코드 구현 + 코어 live 검증 기준의 합리적 추정. 항목별 가중 평균. "100%" 아님 — 검증 미완 + 디테일 갭 존재.

---

## 3. 영역별 상세

### A. 자유 캔버스 편집 — 🟢 충족 (~95%)

**live 검증됨** (`WIX-BUILDER-VERIFY-REPORT`): 에디터 로드·0 콘솔 에러·9섹션 전부 렌더·노드 선택·인스펙터 연동·horizontal overflow 없음·모바일(390px) 렌더.

코드 구현 (`src/components/builder/canvas/`):
- **8방향 리사이즈 + 회전(15° 스냅)**: `CanvasNode.tsx:269-294`
- **스냅 엔진**: `lib/builder/canvas/snap.ts` — 정렬선(alignment, 빨강) + 간격선(spacing, 주황, px 라벨, `MAX_SPACING_GUIDE_PX=96`) + grid snap(`SNAP_THRESHOLD=6`). 렌더 `AlignmentGuides.tsx`
- **멀티셀렉트 + 그룹**: shift/ctrl-클릭 + 박스선택(`useCanvasSelectionBox.ts`); `groupSelectedNodes`/`ungroupSelectedNode`(`store.ts:1223-1234`); `enterGroup`/`exitGroup`(Esc)
- **Undo/Redo**: `history.ts` + 단축키 Mod+Z / Mod+Shift+Z
- **클립보드**: copy/cut/paste + copyStyle/pasteStyle(Mod+Alt+C/V)
- **줌/팬**: `CanvasZoomDock.tsx`(25-200% 슬라이더) + space+drag pan(`CanvasContainer.tsx:672`)
- **인라인 편집**: text/heading 더블클릭(TipTap, `InlineTextEditor`)

**Wix 대비 갭**: 사실상 없음. (F7 보고서의 "인라인 편집 시 폰트 축소" 버그는 iter 6에서 수정됨)

---

### B. 위젯·요소 라이브러리 — 🟢 충족 (~95%)

**Wix "70+ 위젯" 목표 초과 달성.**

- **노드 kind 83종**: `lib/builder/canvas/types.ts:36-134` (Zod union). 레지스트리 83개 자동 등록 `lib/builder/components/registry.ts:19-123`
- **카탈로그 preset 109개 / 10카테고리**: `SandboxCatalogPanel.presets.ts`(2,605줄) — TEXT 14 / MEDIA 18 / GALLERY 8 / LAYOUT 13 / INTERACTIVE 14 / NAVIGATION 7 / SOCIAL 8 / LOCATION 3 / DECORATIVE 16 / DESIGNER 8
- **페이지 템플릿 261개 / 30 산업**: `lib/builder/templates/registry.ts:290-611`
- **섹션 템플릿 61개 / 13 카테고리**: `lib/builder/sections/templates.ts:1577-2115`
- **드래그-투-캔버스**: HTML5 native Drag&Drop(`useCanvasStageDrop.ts`) — Add 패널 → 캔버스 드롭 → `createCanvasNodeTemplate()` → `addNode()`. 컨테이너 안 드롭 시 parentId 연결
- **컨테이너 레이아웃 11종**: `layoutMode = absolute|flex|grid|strip|box|columns|repeater|tabs|accordion|slideshow|hoverBox`(`types.ts:681`)
- **App Widgets**: 외부 앱 위젯 드래그 지원(`application/x-builder-app-widget`)

**위젯 종류(83)**: text, heading, button, image, container, section, divider, spacer, icon, composite(18 sub), gallery, video, video-embed, audio, lottie, map, customEmbed, codeBlock, form + form입력 10종, blog 7종, event 3종, portfolio/product-gallery, 도메인특화 8종(columnCard/attorneyCard/faqList/contactForm/ctaBanner/booking-widget/site-search), 인터랙티브 5종, 네비 3종, 소셜 4종, 위치 3종, 장식 5종, 데이터표시 10종(chart/counter/testimonial/pricing/timeline/team/service-feature), 멤버 4종.

**Wix 대비 갭**: 위젯 수 자체는 Wix 수준/초과. 다만 Wix의 "Repeater/Velo 데이터 위젯" 심화 연동 깊이는 별도 검증 필요.

---

### C. Inspector — 🟢 대부분 (~85%)

**6탭 전부 실구현** (`SandboxInspectorPanel.tsx:358-364`):
- **Layout**: X/Y/W/H/회전/잠금/표시/고정(sticky+offset)/앵커/디바이스 가시성/반응형 오버라이드
- **Style**: background(색·그라디언트·이미지)/border/radius/opacity/shadow(x,y,blur,spread,색)/**hover 전체 상태**. `StyleSourceVisualizer`로 토큰 출처 표시
- **Content**: 위젯별 Inspector 30개+ 동적 로드(`getComponent(kind).Inspector`) + CMS 데이터 바인딩(`SandboxDataBindingPanel`)
- **Animations**: **7섹션** — entrance(18 preset)/exit(8)/loop(7)/scroll(10)/hover(7)/click(5)/MotionTimelineEditor + 미리보기 버튼. 커스텀 cubic-bezier easing
- **A11y**: 실시간 자동 검사(`checkAccessibility`) → 이슈 리스트 + 노드 이동
- **SEO**: ⚠️ 인스펙터 내는 **notice 텍스트만**(요소 단위 SEO 미구현). 페이지 단위는 별도 `SeoPanel`(865줄, 5탭: basics/social/advanced/hreflang/AI 어시스턴트)

**Wix 대비 갭 (진짜)**:
- 🔴 **Interactions 탭 없음** — Wix의 "트리거(클릭/호버) → 액션(팝업/스크롤/이동)" 편집 UI. 현재 click/hover는 **애니메이션**만(모션 프리셋), 동작 연결 아님
- 🟡 **요소 단위 SEO 미구현** — 페이지 단위만
- 🟡 Style 탭에 **font-family 직접 선택 없음** (타이포그래피 스케일/위젯 Inspector 경유)

---

### D. Pages & Navigation — 🟢 대부분 (~85%)

- **페이지 CRUD**: `api/builder/site/pages/` — GET/POST/PATCH/DELETE + 순서 + 다국어 linkedPageIds 양방향 + 동적 페이지(dynamic-list/dynamic-item)
- **PageSwitcher**: 1,700줄 — 전환/rename/삭제/생성/드래그 순서(`PageSwitcher.tsx`)
- **초안/발행/예약발행/개정/롤백**: draft/publish/scheduled-publish/revisions/seo route 전부
- **글로벌 헤더/푸터 편집**: 고정 ID `global-header`/`global-footer`(`persistence.ts:944`), `/admin-builder/footer`에서 편집. 발행 시 합성
- **메뉴 위젯**: menu-bar(4 변형: plain/pill/dropdown/mega, 항목 최대 20+2단계 children), anchor-menu, breadcrumbs, site-search

**Wix 대비 갭 (진짜)**:
- 🟡 **메뉴 편집 = 텍스트 기반**(`label | href` 줄단위, `menuBar/index.tsx`). Wix 스타일 **시각 트리 메뉴 에디터 아님**

---

### E. Media & Assets — 🟢 충족 (~90%)

- **Asset Library**: `AssetLibraryModal.tsx` — 업로드/폴더/최근필터/정렬
- **저장**: `@vercel/blob`(`assets.ts`) — put/list/del/get
- **이미지 편집 다이얼로그**: `ImageEditDialog.tsx` — **4탭**: crop(aspect)/filter(brightness,contrast,saturation,blur,grayscale,sepia)/focal point(x,y%)/alt/AI
- **이미지 기능**: 핫스팟(최대 12)/before-after 비교 슬라이더/SVG 색편집/GIF(giphy)/라이트박스/팝업/hover-swap
- **반응형 이미지**: Next.js `<Image>` + sizes/srcset + object-position(focal)

**Wix 대비 갭**:
- 🟡 서버사이드 이미지 리사이즈 파이프라인은 Next.js Image 최적화에 의존(별도 변환 엔진 아님)
- ⚠️ AI 이미지 생성 탭은 필드/탭 존재, 백엔드 연동 깊이 별도 검증 필요

---

### F. Design System — 🟢 충족 (~90%)

- **SiteSettingsModal 7탭**: general/brand/typography/presets/dark/mobile/advanced
- **색 토큰 6종**: primary/secondary/accent/background/text/muted(`theme.ts:12-19`). 노드 color picker가 **글로벌 토큰 참조** 지원(`{kind:'token', token}`) + 하드코딩 둘 다
- **타이포그래피 스케일**: baseSize × ratio → h1~h6/body 자동 산출. 텍스트 프리셋 5종(title1~quote, 전 필드)
- **테마 프리셋 5종**(modern/classic/bold/minimal/editorial) + radius/shadow 프리셋 + **My Themes**(localStorage 12개)
- **브랜드킷**: `BrandKitPanel.tsx` — colors(5)/fonts/logo/favicon/ogImage/ radiusScale. 테마↔브랜드킷 양방향 변환. JSON import/export
- **다크모드**: `createDarkColorsFromLight` 자동생성 + 런타임 전환(light/dark/auto) + 방문자 토글
- **디자인 토큰 JSON 번들**: import/export

**Wix 대비 갑**: 거의 없음. 🟡 브랜드킷 colors에 muted 누락(5종, 테마는 6종). 커스텀 텍스트 프리셋 추가 불가(5종 고정)

---

### G. 반응형·모바일 — 🟢 충족 (~90%) ⚠️ "진짜 반응형 에디터"

**과거 AGENTS.md "모바일은 @media 덮어쓰기만"은 stale.** 현재는 **진짜 반응형 에디터(breakpoint-override 모델)**:

- **데이터 모델**: `responsiveConfigSchema = { tablet, mobile }` 각 `{ rect(partial), hidden, fontSize }`(`types.ts:381-390`). 모든 캔버스 노드에 부착
- **cascade 병합 엔진**: `canvas/responsive.ts` — desktop→tablet→mobile 단계적 병합(`resolveViewportRect`). `VIEWPORT_WIDTHS = {desktop:1280, tablet:768, mobile:375}`(live 검증值 일치)
- **인스펙터**: viewport 셀렉터 + **override 배너**(created/inherited) + per-viewport 리셋. per-viewport X/Y/W/H/fontSize/hidden 편집
- **자동 모바일 맞춤**: `autoFitMobileTree`(트리 인식, z-order 세로 스택, 루트 비율 스케일, 명시적 override 보존)
- **발행 렌더**: `buildResponsiveStylesheet` → 노드별 `responsive.tablet/mobile`을 `[data-node-id]` 규칙의 `@media` 블록으로 직렬화(`!important`). flow 섹션은 margin/min-height로 세로 스태킹, flex/grid 컨테이너 자식은 left/top 스킵
- **모바일 전용**: sticky 헤더 / hamburger(auto/force/off) / 하단 바(phone/booking/custom 액션)

**Wix 대비 갭**:
- 🟡 **Wix "A 모델"(별도 모바일 캔버스 트리)은 안 함** — breakpoint-override(B 모델)만. `responsive.ts:6-8` 주석에 설명만. 대부분 사이트에선 B 모델로 충분하나, 모바일을 완전히 별도 디자인하려는 케이스는 제약

---

### K. Motion — 🟢 충족 (~90%) ⚠️ "발행 런타임 실구현"

**에디터 미리보기만이 아님. 발행 페이지에 실제로 동작.**

- **프리셋**: entrance 18 / exit 8 / scroll 10 / hover 7 / click 5 / loop 7 / page-transition 5 / easing 6(`animations/presets.ts`)
- **발행 속성/스타일**: `getPublishedAnimationAttributes` → `data-anim-*` 데이터 속성 + `buildPublishedAnimationStyle` → CSS 변수 풀(`--builder-anim-*`)
- **발행 런타임** `components/builder/published/AnimationsRoot.tsx`(`public-page.tsx:1142` 마운트):
  - **IntersectionObserver**: entrance(threshold 0.16)/exit(threshold 0.05)
  - **requestAnimationFrame scroll 루프**: parallax/background-parallax/scale/rotate/fade/scrub-* 실시간
  - **click 리스너**: pulse/bounce/shake/flash keyframe 트리거
  - **timeline 런타임**: keyframes JSON → 시간/스크롤 모드 보간(rAF)
  - **loop**: CSS 변수 `@keyframes` 무한
  - **`prefers-reduced-motion` 대응**(접근성)
- **MotionTimelineEditor**: 시각 키프레임(최대 16) — offset/transform/opacity + scrollBound 또는 durationMs
- **Lottie**: `lottie.host`/`lottiefiles.com` iframe 재생

**Wix 대비 갭**:
- 🟡 Lottie가 **lottiefiles 호스트만**(iframe). 비호스트 `.json` URL은 placeholder. lottie-web npm 직접 통합 아님
- 🟡 타임라인 키프레임 = transform/opacity만(color/filter 미지원)

---

### Phase 9. Designer 도구 — 🟢 충족 (~85%)

- **Rulers + 가이드**: `CanvasRulers.tsx`(상단/좌측 40px 간격, 드래그하여 가이드 생성) + `CustomGuidesOverlay.tsx`(드래그/삭제)
- **Layers 패널**: `SandboxLayersPanel.tsx`(591줄) — EditorRail drawer 통합. 계층 트리 + 검색 + **@dnd-kit DnD 리오더**(before/after/inside, 컨테이너 이동) + lock/hide 토글 + z-order 라벨 + 더블클릭 그룹 진입
- **정렬/분배**: align 6종(left/center/right/top/middle/bottom) + distribute 2종 + matchSize 2종(멀티선택 시). store `alignSelectedNodes`/`distributeSelectedNodes`
- **단축키 28종**(`shortcuts.ts`): undo/redo/delete/duplicate/selectAll/copy/cut/paste/copyStyle/pasteStyle/group/ungroup/zoom×3/z-order×4/toggleLock/toggleGrid/editLink/nudge×8(1px/10px) + **커스텀 키바인딩 오버라이드** + ShortcutsHelpModal
- **줌/팬**: zoom dock(25-200%) + space+drag pan
- **스냅**: 정렬선 + 간격선(px 라벨) + grid snap
- **floating Selection 툴바**: 링크편집/텍스트편집/이미지교체/복제/z-order/삭제

**Wix 대비 갑**: 거의 없음. 🟡 정렬 툴바가 **멀티선택 시에만 노출**(단일 선택 시 상시 툴바 없음). ⚠️ 그리드 표시 오버레이 렌더와 space+drag pan 원본 로직은 추가 확인 권장

---

### Phase 8. Wix Bookings — 🟢 충족 (~90%) ⚠️ "풀스택 실구현"

**Wix Bookings 대체 수준. 퍼블릭 위젯도 발행 페이지에 렌더.**

- **엔티티 + Zod**: BookingService(duration/price/deposit/meetingMode in-person/zoom/phone/hybrid/cancellationPolicy/reminder) / Staff / Resource(용량/buffer) / Location(다중사무소) / CancellationPolicy(full/partial/none + 시간+퍼센트+fee) / Package + PackageCredit / Waitlist / Booking(meetingLink Zoom/paymentStatus)
- **슬롯 계산**: `computeSlotsForStaff` — weekly + dateOverrides + 휴일(kr/tw) + blockedDates + buffer + maxParticipants(그룹) + 리소스 충돌 + 타임존 정규화
- **결제**: Stripe PaymentIntent + **HMAC 수동 웹훅 검증**(`stripe-signature`, stripe npm 회피) + 수동결제(cash/bank/check) + 보증금(depositAmount) + 잔액 계산
- **캘린더 싱크 Google/Outlook**: OAuth 토큰갱신 + **양방향 동기화 엔진**(push: 예약→이벤트, pull: 외부 busy→슬롯 비활성, 90일 윈도우) + **RRULE**(RFC5545 weekly/biweekly/monthly, UNTIL/COUNT)
- **Zoom**: Server-to-Server OAuth → 미팅 자동생성(`POST /users/me/meetings`), mock 모드 지원
- **SMS**: Twilio 실호출(E.164 검증)
- **이메일**: 템플릿 4종(confirmation/admin/reminder/cancellation)
- **대기자 명단 + 패키지크레딧**: creditLock 동시성 제어, remainingCredits 차감/복구
- **취소/환불**: full/partial 결정 + Stripe refund
- **퍼블릭 위젯**: `bookingWidget` → 발행에서 `BookingFlowSteps`(실제 API 호출: services/staff/availability/payment-intent/book/waitlist)

**Wix 대비 갑**: 🟡 RRULE EXDATE/BYSETPOS 미지원. ⚠️ **이메일 실제 전송 transport(SMTP/Resend/SES) 확인 필요** — 템플릿 렌더링/저장까지는 확인, 발송 runner는 별도 검증. Zoom/SMS는 미설정 시 graceful degrade

---

## 4. 진짜 남은 갭 (정직한 우선순위)

> 코드상 Wix 대체는 달성. 아래는 "대체를 완벽히 확정하기 위한" 남은 작업.

### 🔴 P0 — 브라우저 전수 검증 (live 보고서 "Still to verify")
코드는 있으나 live 검증 보고서가 코어 편집 루프까지만 검증. 아래는 **검증 대기**:
1. **멀티셀렉트** 그룹 이동/리사이즈 실동작
2. **Add 패널 → 드롭 신규 노드** end-to-end
3. **페이지 전환/생성/삭제** editor 내
4. **미리보기(preview) 모드** 패리티
5. **발행(publish) 플로우** end-to-end
6. **스냅/정렬 가이드** 실동작
7. **Motion 발행 애니메이션** 실제 재생(IntersectionObserver/scroll)
8. **Bookings 예약 위젯** 발행 페이지에서 예약 생성 end-to-end
9. **반응형 오버라이드** 발행 @media 실제 적용
10. 전체 builder-editor Playwright suite(64파일) 회귀

### 🟡 P1 — 디테일 기능 갭 (Wix엔 있고 호정엔 없음)
1. **Interactions 탭** — 트리거(클릭/호버) → 액션(팝업/스크롤/페이지이동/요소표시) 편집 UI (`SandboxInspectorPanel.tsx:358-364`에 `interactions` 탭 추가 + store 액션)
2. **요소 단위 SEO** — 현재 페이지 단위만(인스펙터 SEO 탭은 notice만). 노드 메타데이터 스키마 + 인스펙터 연결
3. **메뉴 시각 트리 에디터** — 현재 `label | href` 텍스트 편집(`menuBar/index.tsx`). 드래그 트리 UI

### 🟢 P2 — 다듬기
1. **Lottie 비호스트 `.json`** 지원(lottie-web npm 통합) — 현재 lottiefiles iframe만
2. **타임라인 키프레임** color/filter 속성 추가(현재 transform/opacity만)
3. **별도 모바일 캔버스(A 모델)** — breakpoint-override 외에 독립 모바일 문서 옵션(고급 케이스)
4. **브랜드킷 muted 토큰** 추가(테마는 6종, 브랜드킷은 5종)
5. **Bookings 이메일 transport**(SMTP/Resend/SES) 발송 runner 검증/구현
6. **정렬 툴바 단일 선택 시 노출** 또는 전용 툴바

### ⚪ P3 — 장기/선택
- RRULE EXDATE/BYSETPOS (예약 반복 규칙 심화)
- 서버사이드 이미지 변환 파이프라인(현재 Next.js Image 최적화 의존)
- AI 이미지 생성 백엔드 깊이 검증

---

## 5. 결론 및 권장 다음 단계

**tseng-law 에디터는 코드상 이미 Wix를 대체하는 수준(약 89%)에 도달.** 과거 보고서의 "17.8% / Phase 2~9 미시작"은 완전히 잘못된 진단이었고, 이는 Explore 에이전트가 구버전 코드를 가정했기 때문(본 파일 헤더의 STALE 선언 참조).

**"Wix 대체"를 확정하려면 구현이 아니라 검증이 남은 상태**:

1. **즉시**: live 검증 루프(이미 맥스튜디오에서 `*/6` 흐름으로 코어 검증 중)의 **커버리지를 P0 10개 항목으로 확장** — 멀티셀렉트/Add드롭/페이지전환/preview/publish/스냅/Motion재생/Bookings예약/반응형@media/전체suite.
2. **단기**: P1 3개(Interactions 탭 / 요소 SEO / 메뉴 트리 에디터) — 이게 사실상 "Wix엔 있고 호정엔 없는" 마지막 기능 갭.
3. **중기**: P2 다듬기.

**즉, "무엇을 만들어야 Wix 대체인가"의 답은: 더 만들 것은 거의 없고, 있는 것을 검증하고 3개 디테일을 채우면 된다.**

---

## 부록 A. F-layer (제품기능) 요약 — 97.7% 달성

`WIX-FULL-PRODUCT-CHECKPOINTS.md` (129 항목): 🟢 70 + 🟡 56 + 🔴 2 + ⚫ 1.

제품기능(CMS/Stores/Payments/Bookings/CRM/Marketing/Members/Apps/Collaboration/Multilingual/SEO)은 이미 Wix 근접. 최근 진행(M166 시리즈)은 대부분 **API 에러 메시지 다국어화** 디테일. 에디터 자유도 평가와는 별개 축.

## 부록 B. 코드 기준일 및 한계

- 코드: 맥스튜디오 `/Users/son7/Projects/tseng-law` HEAD `bf21bff`, 2026-06-29 rsync 시점
- 본 보고서는 **코드 구현 + 코어 live 검증** 기준. 전수 브라우저 검증 미완 → "구현됨"이 "100% 버그 없이 동작"을 의미하지 않음
- Wix 기준은 Wix Editor / Wix Studio 공개 에디터 기능 기반 (Velo/Corvid 개발자 플랫폼 일부는 별도 축)
