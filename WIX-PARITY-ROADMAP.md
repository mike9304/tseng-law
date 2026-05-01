# Wix Parity 전체 로드맵 + 모든 Codex 프롬프트 요약

> **작성**: 2026-04-30
> **목적**: 호정 사이트 빌더를 Wix 수준 1:1 패리티까지 끌어올리는 30+ 트랙 마스터 플랜. 각 트랙당 Codex 발주 시 사용할 프롬프트 핵심만 담음. 본격 발주 시 별도 `CODEX-PROMPT-XXX.md` 파일로 확장 작성.
> **현재 상태**: B/C/D/E 시리즈 완료 (디자인 시스템 + 애니메이션 + 템플릿 + 블로그). F1/F2/F3 P0 진행 중.

---

## 📊 진척도 추적

| Phase | 트랙 | 상태 |
|---|---|---|
| **완료 (S-08)** | B3, B6, B7, C1, D1, E1, E2 (디자인+모션+템플릿+블로그) + B2, B8, B9, C2, C3 (기능) | ✅ |
| **P0 진행 중** | F1 (Codex), F2/F3 (Claude) | ⏳ |
| **P0 남은** | F4 Multilingual, F5 Forms 확장 | ⏳ |
| **P1** | G1~G6 | ⏳ |
| **P2** | H1~H8 | ⏳ |
| **P3** | I1~I16 | ⏳ |

---

## 🎯 P0 — Wix 신뢰성/반응형 (3주)

### F1: 반응형 Inspector + Layers explorer (Codex) ⏳ 발주 대기
파일: `CODEX-PROMPT-RESPONSIVE-LAYERS-F1.md` (작성 완료)

### F2: 반응형 schema + resolver (Claude) ⏳ 진행 중

### F3: Registry/schema 정합성 + API guard (Claude) ⏳ 진행 중

### F4: Multilingual content sync 🆕
**프롬프트 핵심**:
> 호정 ko/zh-hant/en 3 locale 콘텐츠 sync. Translation Manager admin URL `/admin-builder/translations`. 매트릭스 UI (X축: locale, Y축: 콘텐츠). 자동 번역 (OpenAI gpt-4o-mini 또는 DeepL API) + per-string 검토 + sync 상태 (translated/outdated/manual). `BuilderSiteDocument.translations` 추가. Column 간 `linkedPosts: Partial<Record<Locale, string>>` 활용. translator role (선택). ColumnEditor 좌상단에 다른 locale 버전 빠른 전환 chip.
>
> **파일**: `src/app/(builder)/[locale]/admin-builder/translations/page.tsx`, `src/components/builder/translations/`, `src/lib/builder/translations/sync.ts`, `/api/builder/translations` 신규.
> **충돌 회피**: F1/F2/F3와 무관. ColumnEditor 본문 안 건드림 (E1 영역).

### F5: Forms 확장 (Wix Forms parity) 🆕
**프롬프트 핵심**:
> Wix Forms parity. C2 기존 4 kinds에 5 신규 추가: `form-select` (옵션 dropdown) / `form-checkbox` / `form-radio` / `form-file` (파일 업로드) / `form-date` (date picker). captcha 통합 (hCaptcha 또는 Cloudflare Turnstile). multi-step (페이지 단위 분할 + 진행 표시) + conditional logic (이전 답에 따라 필드 보임/숨김 — `showIf: { fieldName, equals/notEquals/contains, value }`). Form Flow Editor `/admin-builder/forms-flow`. Form Submission Manager `/admin-builder/forms-flow/submissions` (제출 목록 + 상세 + export CSV).
>
> **파일**: `src/lib/builder/components/{formSelect,formCheckbox,formRadio,formFile,formDate}/`, `src/lib/builder/forms/conditional.ts`, `/api/forms/submit` 확장 (multipart support).
> **회피**: 기존 form/form-input/form-textarea/form-submit 보존.

---

## 🚀 P1 — Wix 핵심 앱 (4주)

### G1: Bookings MVP ⭐ (가장 큰 트랙)
**프롬프트 핵심**:
> Wix Bookings parity. 5개 도메인:
> - `BookingService`: 이름/소요시간/가격/설명/이미지/카테고리. CRUD admin `/admin-builder/bookings/services`
> - `Staff`: 이름/사진/스킬/대상 서비스. CRUD admin `/admin-builder/bookings/staff`
> - `StaffAvailability`: per-staff 요일 가능 시간/buffer/blocked dates. Calendar UI
> - `Booking`: 사용자 정보/시작 시각/staff/service/status. CRUD admin `/admin-builder/bookings/calendar` (월/주/일 뷰)
> - `availability-engine.ts`: 자동 slot 계산 (staff hours - blocked - existing bookings - buffer)
>
> **위젯**: `booking-widget` kind 신규. 사용자가 빌더 페이지에 드래그 → service select → staff select → date/time slot picker → 폼 → 제출
> **이메일**: 예약 확인/리마인더 (Resend) + (선택) Google Calendar sync via OAuth
> **API**: `/api/booking/{services,staff,availability,book}`
> **파일**: `src/lib/builder/bookings/`, `src/components/builder/bookings/`, `src/app/(builder)/[locale]/admin-builder/bookings/`, `src/lib/builder/components/bookingWidget/`
> **회피**: 다른 트랙과 무관. 신규 도메인.
>
> **분량**: 1주 풀 투자. Codex+Claude 동시 작업 (Codex=admin UI 디자인+캘린더 시각, Claude=engine+API+widget logic)

### G2: CMS/Database (generic collections)
**프롬프트 핵심**:
> Wix Velo CMS parity. 사용자가 collection schema 정의 (예: "공고" = `{ title: string, date: date, image: image, body: html }`). Admin URL `/admin-builder/cms/collections` (생성/편집) + `/items` (data 입력). `cms-repeater` widget kind — collection을 페이지 위젯에 바인딩 → 자동 반복 렌더. binding inspector: `dataSource: 'collection-id'`, `template: 'card'|'list'`.
>
> **파일**: `src/lib/builder/cms/`, `src/components/builder/cms/`, `src/lib/builder/components/cmsRepeater/`, `/api/builder/cms/{collections,items}`.
> **회피**: 기존 columns CMS와 별개 (columns는 blog 전용으로 유지).

### G3: Section templates / Save section
**프롬프트 핵심**:
> 사용자가 만든 섹션을 라이브러리에 저장 → 다른 페이지에 재사용. `BuilderSiteDocument.sectionLibrary: SavedSection[]` (각 SavedSection = 노드 트리 snapshot + 이름 + thumbnail). Add 패널에 "Saved sections" 카테고리 신규. SiteSettings에 "내 섹션" 탭으로 관리 (이름변경/삭제).
>
> **트리거**: 컨테이너 우클릭 → "Save as section..."
> **파일**: `src/components/builder/sections/SavedSectionsPanel.tsx`, `/api/builder/site/section-library` 신규.

### G4: Asset Manager 강화
**프롬프트 핵심**:
> 현재 flat list → folders + tags + search + sort + AI 이미지 생성 (DALL-E stub 또는 Stability). `assets/folders/{id}/items/{id}.json` 구조. 메타에 tags 배열 + uploaded date. Search input + tag filter. "Generate with AI" 버튼 → prompt → 이미지 → upload.
>
> **파일**: `src/components/builder/editor/AssetLibraryModal.tsx` 재작성, `src/app/api/builder/assets/` 확장.

### G5: 이미지 자동 최적화
**프롬프트 핵심**:
> Next/Image 통합 + WebP 자동 변환 + lazy loading + responsive srcset (`srcset="image-480w.webp 480w, image-1024w.webp 1024w, image-1920w.webp 1920w"`). 모든 image 위젯 render에 적용. CDN 연결 (Vercel Blob → Image Optimization API). Build-time 또는 on-demand 변환.
>
> **파일**: `src/lib/builder/components/image/Element.tsx` (Next/Image로 교체), `src/lib/builder/assets/optimize.ts` 신규, next.config.js images 설정.

### G6: Layers hierarchy 완성 (F1 잔여)
F1 결과 보고 잔여 폴리시 (snap toggle, esc cancel, alt-drag copy, overlap select 사이클).

---

## 🛠 P2 — Wix 운영/콘텐츠 (5주)

### H1: 모션 고도화
**프롬프트 핵심**:
> C1 후속. timeline editor (keyframes) — 각 노드에 시간축 위 keyframe (각 keyframe = position + style). exit animations (요소 사라질 때). loop animations (pulse/float 무한 반복). Lottie 통합 (lottie-web import + JSON 업로드). page transitions (next route 전환 fade/slide).
>
> **파일**: `src/components/builder/editor/TimelineEditor.tsx`, `src/lib/builder/animations/timeline.ts`, `src/lib/builder/components/lottie/`.

### H2: Live chat / Inbox
**프롬프트 핵심**:
> Site chat widget (페이지 우하단 floating bubble). 운영자 dashboard `/admin-builder/inbox` (대화 목록 + 답변 UI). 자동 응답 (시간 외 메시지). Slack 통합 옵션 (webhook).
>
> **파일**: `src/components/builder/published/LiveChatWidget.tsx`, `src/app/(builder)/[locale]/admin-builder/inbox/`, `src/lib/builder/chat/`, `/api/chat/{messages,sessions}`.

### H3: CRM / Contacts
**프롬프트 핵심**:
> Forms 제출 시 Contact 자동 등록. Admin `/admin-builder/contacts` (목록 + 상세). 각 Contact: name/email/phone/source/tags/notes/status (new/contacted/closed). 후속 이메일 trigger. CSV export.
>
> **파일**: `src/lib/builder/crm/`, `src/components/builder/crm/`, `/api/builder/contacts`.

### H4: Email Marketing
**프롬프트 핵심**:
> 캠페인 작성 (TipTap newsletter editor — E1 ColumnEditor 재활용). Segment (CRM tags 기반). 발송 (Resend/Sendgrid bulk). open/click tracking. Admin `/admin-builder/email-campaigns`.
>
> **파일**: `src/lib/builder/email-marketing/`, `src/components/builder/email-marketing/`.

### H5: Site Search
**프롬프트 핵심**:
> 사이트 전체 텍스트 인덱스 (Lunr 또는 MiniSearch). 모든 published page + 모든 column body 색인. 검색 위젯 `site-search` kind (검색 input → 결과 드롭다운). 결과 페이지 `/{locale}/search?q=...`. build-time 또는 runtime indexing.
>
> **파일**: `src/lib/builder/search/`, `src/lib/builder/components/siteSearch/`, `src/app/[locale]/search/page.tsx`.

### H6: SEO maturity
**프롬프트 핵심**:
> sitemap.xml 자동 생성 (모든 published page + slug). robots.txt 동적. Redirect rules admin `/admin-builder/seo/redirects` (old slug → new). Structured data 자동 (Article for blog, LegalService for site, FAQPage for FAQ). hreflang 정합 검증 (translations와 매핑).
>
> **파일**: `src/app/sitemap.xml/route.ts`, `src/app/robots.txt/route.ts`, `src/lib/builder/seo/`, `src/components/builder/seo/RedirectsPanel.tsx`.

### H7: Analytics dashboard
**프롬프트 핵심**:
> 페이지뷰 / 세션 / Forms 제출 / Bookings 등록 / 인기 페이지 / 트래픽 출처. 차트 (recharts 또는 visx). Plausible 통합 또는 자체 수집 (`/api/analytics/track`). Admin `/admin-builder/analytics`.
>
> **파일**: `src/lib/builder/analytics/`, `src/components/builder/analytics/`, `src/app/(builder)/[locale]/admin-builder/analytics/`.

### H8: Publish gate / Revisions / Rollback
**프롬프트 핵심**:
> 발행 전 자동 체크: broken link, missing alt, missing SEO meta, responsive overflow, form target validity. blocker (반드시 fix) vs warning (확인 후 진행). PublishModal 재작성. Revision history (per-page) + diff 시각 + rollback 버튼.
>
> **파일**: `src/lib/builder/publish-gate/`, `src/components/builder/canvas/PublishModal.tsx` 재작성, `src/components/builder/canvas/VersionHistoryPanel.tsx` 강화.

---

## 🌐 P3 — Wix 확장 / 롱테일 (장기)

### I1~I16 (각 1줄 요약)

| # | 트랙 | 한 줄 요약 |
|---|---|---|
| I1 | **AI assist (ADI)** | 콘텐츠 자동 생성 (블로그 초안/SEO meta/이미지 alt). OpenAI GPT-4o-mini |
| I2 | **A/B Testing** | variant 분기 + 자동 winner. cookie 기반 50/50 split |
| I3 | **Stores** | 상품 카탈로그 + 장바구니 + Stripe 결제 |
| I4 | **Events** | 이벤트 페이지 + 티켓 + 리마인더 + iCal |
| I5 | **Members area** | 회원가입/로그인/프로필. NextAuth |
| I6 | **Pricing Plans** | 구독/멤버십 + 권한 게이트 + Stripe Subscription |
| I7 | **Velo (custom code)** | 사이트 단위 JS/CSS + DB 쿼리 helper. sandbox |
| I8 | **Test sites / Branches** | git branch 같은 사이트 분기 + merge |
| I9 | **Permissions / Roles** | admin/editor/viewer + 페이지/섹션 단위 |
| I10 | **Custom domain** | DNS A/CNAME + SSL 자동 |
| I11 | **App Market** | 외부 앱 sandboxed iframe + OAuth |
| I12 | **Backup / Site versions** | 일별 자동 백업 30일 보관 |
| I13 | **Accessibility audit** | WCAG 자동 검사 + 위반 강조 |
| I14 | **Schema migration framework** | deprecation cycle + 자동 변환 helper |
| I15 | **댓글 시스템** (블로그) | Comments + moderation. E1 후속 |
| I16 | **Groups / Portfolio** | 커뮤니티 그룹 / 포트폴리오 앱 |

각 트랙별 별도 Codex 프롬프트는 발주 시점에 작성 (위 한 줄 → 상세 5~10페이지 spec으로 확장).

---

## 📅 권장 진행 페이스 (10주)

| 주차 | 발주 트랙 |
|---|---|
| 1주차 | F1+F2+F3 마무리 → F4 + F5 발주 |
| 2주차 | **G1 Bookings 풀 1주** (Codex+Claude 동시) |
| 3주차 | G2 CMS + G3 Section templates 병렬 |
| 4주차 | G4/G5/G6 폴리시 + H1 모션 고도화 |
| 5주차 | H2 Live chat + H3 CRM (Forms 후속 묶음) |
| 6주차 | H4 Email + H5 Site Search |
| 7주차 | H6 SEO + H7 Analytics + H8 Publish gate (운영 인프라 묶음) |
| 8~10주차 | P3 16 트랙 우선순위별 (사용자 선택) |

---

## 🎯 다음 액션 (이 문서 발행 직후)

1. **F1 결과 도착 시** → SESSION.md 갱신 + dev 검증
2. **F4 + F5 프롬프트 작성** → `CODEX-PROMPT-MULTILINGUAL-F4.md` + `CODEX-PROMPT-FORMS-PLUS-F5.md`
3. **F4 발주** + **F5 Claude Agent 발사** (병렬)
4. **G1 Bookings** 시작 — 가장 큰 단일 트랙. Codex 디자인 (admin UI + 캘린더) + Claude Agent (engine + API + widget) 동시
5. P2/P3는 사용자 우선순위 결정 후 차례로

---

## 사용자가 이 문서로 할 수 있는 것

- 어느 트랙 먼저 발주할지 결정 ("F4부터 가자" / "G1을 다음 주 풀 투자로")
- Codex에 트랙 코드만 알려주면 Claude가 위 핵심을 상세 프롬프트로 확장 작성
- 진척도 추적 (각 트랙 완료 시 ✅ 마킹)
- 새 요구사항 발견 시 적절한 P0~P3에 끼워넣기

이 파일이 지금부터 끝까지 가는 마스터 플랜.
