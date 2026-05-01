# Codex 프롬프트 — 후속 트랙 일괄 reference (G2~I16)

> **사용법**: 사용자가 "G2 발주해" 라고 지시하면 Claude가 이 파일의 해당 트랙 섹션을 별도 `CODEX-PROMPT-{name}-{id}.md` 파일로 확장 작성 후 사용자에게 경로 전달.
>
> **Wix 디자인 샘플**: 각 트랙별 Wix 본가 패턴을 참조 표시. 사용자가 Wix 사이트 캡처/문서를 보여주면 더 정확하게 매칭 가능.

---

## P1 (Wix 핵심 앱)

### G2: CMS / Database (generic collections)

**Wix 참조**: Wix Velo CMS / Wix Studio CMS — 사용자 정의 컬렉션 + repeater 위젯 + dynamic page

**핵심**:
- 사용자가 collection 스키마 정의: `{ name, fields: [{key, type: text|number|date|image|boolean|reference, required, default}] }`
- Admin URL `/admin-builder/cms/{collections,items}` (스키마 정의 + 데이터 입력)
- 신규 widget kind `cms-repeater` — 컬렉션 데이터를 위젯에 바인딩 → 자동 반복 렌더
- Dynamic page (예: `/services/[slug]` 라우트가 services 컬렉션 데이터로 자동 생성)
- API `/api/builder/cms/{collections,items}`

**파일**: `src/lib/builder/cms/`, `src/components/builder/cms/`, `src/lib/builder/components/cmsRepeater/`

---

### G3: Section templates / Save section

**Wix 참조**: Wix "Saved Sections" — 사용자 정의 섹션을 라이브러리에 저장

**핵심**:
- 컨테이너 우클릭 → "Save as section..." → 이름 + 카테고리 + 자동 SVG 썸네일
- `BuilderSiteDocument.sectionLibrary: SavedSection[]`
- Add 패널에 "Saved sections" 카테고리 신규
- SiteSettings → "내 섹션" 탭 (관리)
- API `/api/builder/site/section-library`

---

### G4: Asset Manager 강화

**Wix 참조**: Wix Media Manager — folders / tags / search / AI image generation / video upload

**핵심**:
- 현재 flat → folders + tags + search + sort + grid/list view 토글
- Upload to specific folder (drag-drop)
- AI 이미지 생성 (DALL-E 3 또는 Stability) — prompt → 자동 업로드
- Video 지원 (mp4 upload + thumbnail 자동 생성)
- Bulk select + delete + move

**파일**: `src/components/builder/editor/AssetLibraryModal.tsx` 재작성, `src/app/api/builder/assets/` 확장 (folders endpoint)

---

### G5: 이미지 자동 최적화

**Wix 참조**: Wix CDN — automatic WebP / responsive srcset / lazy loading

**핵심**:
- 모든 image 위젯 → `next/image` 통합
- WebP 자동 변환 (Vercel Image Optimization)
- responsive srcset (480/768/1024/1920w)
- lazy loading (loading="lazy")
- LCP 자동 priority hint (첫 image)

**파일**: `src/lib/builder/components/image/Element.tsx` 교체, next.config.js 설정

---

### G6: Layers hierarchy 완성 (F1 잔여)

F1 결과 보고 잔여 폴리시 (snap toggle, esc cancel, alt-drag copy, overlap select 사이클).

---

## P2 (Wix 운영/콘텐츠)

### H1: 모션 고도화 (C1 후속)

**Wix 참조**: Wix Motion Editor (Wix Studio) — timeline + keyframes + easing curves

**핵심**:
- Timeline editor admin UI: 노드별 keyframe (시간 / position / opacity / scale / rotate)
- Exit animations (요소 사라질 때)
- Loop animations (pulse / float 무한 반복)
- Lottie 통합 (`@lottiefiles/react-lottie-player`) + `lottie-animation` kind
- Page transitions (next route 전환 fade/slide)

**파일**: `src/components/builder/editor/TimelineEditor.tsx`, `src/lib/builder/animations/timeline.ts`, `src/lib/builder/components/lottie/`

---

### H2: Live chat / Inbox

**Wix 참조**: Wix Chat — site bubble + Inbox dashboard + 자동 응답

**핵심**:
- Site chat widget (페이지 우하단 floating bubble) — `live-chat-widget` kind 또는 site-level toggle
- Operator dashboard `/admin-builder/inbox` (대화 목록 + 답변 UI + 미읽음 카운트)
- 자동 응답 (영업 시간 외 메시지)
- Slack 통합 옵션 (webhook)
- WebSocket or Server-Sent Events for realtime

**파일**: `src/components/builder/published/LiveChatWidget.tsx`, `src/app/(builder)/[locale]/admin-builder/inbox/`, `src/lib/builder/chat/`, `/api/chat/{messages,sessions,sse}`

---

### H3: CRM / Contacts

**Wix 참조**: Wix Contacts — 자동 contact 생성 + tags + notes + follow-up

**핵심**:
- Forms 제출 시 Contact 자동 등록 (또는 기존 Contact match by email)
- Booking 등록 시도 동일
- Admin `/admin-builder/contacts` (목록 + 상세)
- Contact: name/email/phone/source/tags/notes/status (new/contacted/closed)/lastContactedAt
- 후속 이메일 trigger (status 변경 시 자동)
- CSV export

**파일**: `src/lib/builder/crm/`, `src/components/builder/crm/`, `/api/builder/contacts/{,id}`

---

### H4: Email Marketing

**Wix 참조**: Wix Email Marketing (formerly Wix ShoutOut) — 캠페인 작성/발송/segment

**핵심**:
- 캠페인 작성 (TipTap newsletter editor — E1 ColumnEditor 재활용 + 이메일 전용 위젯)
- Segment (CRM tags 기반: "교통사고 문의 했던 분들")
- 발송 (Resend bulk 또는 Sendgrid)
- Template 라이브러리
- open/click tracking (UTM + pixel)
- Admin `/admin-builder/email-campaigns/{,new,id}`

**파일**: `src/lib/builder/email-marketing/`, `src/components/builder/email-marketing/`

---

### H5: Site Search

**Wix 참조**: Wix Site Search — 사이트 전체 검색 위젯 + 결과 페이지

**핵심**:
- 사이트 전체 텍스트 인덱스 (Lunr 또는 MiniSearch)
- 모든 published page (텍스트 노드) + 모든 column body 색인
- `site-search` widget kind (검색 input → 결과 드롭다운 또는 모달)
- 결과 페이지 `/{locale}/search?q=...`
- build-time 또는 runtime indexing (선택)

**파일**: `src/lib/builder/search/`, `src/lib/builder/components/siteSearch/`, `src/app/[locale]/search/page.tsx`

---

### H6: SEO maturity

**Wix 참조**: Wix SEO Wiz / Sitemap auto-update

**핵심**:
- sitemap.xml 자동 (모든 published page + 칼럼 + dynamic pages)
- robots.txt 동적
- Redirect rules admin `/admin-builder/seo/redirects` (old slug → new)
- Structured data 자동 (Article for blog, LegalService for site, FAQPage for FAQ widget, Person for staff)
- hreflang 정합 검증 (translations와 매핑)
- canonical URL 자동
- breadcrumb structured data

**파일**: `src/app/sitemap.xml/route.ts`, `src/app/robots.txt/route.ts`, `src/lib/builder/seo/`, `src/components/builder/seo/RedirectsPanel.tsx`

---

### H7: Analytics dashboard

**Wix 참조**: Wix Analytics — 페이지뷰/세션/전환/source

**핵심**:
- 자체 수집 (`/api/analytics/track` + Vercel KV) 또는 Plausible 통합
- 페이지뷰 / 세션 / 평균 체류 시간 / 직바운스률
- 인기 페이지 / 트래픽 source / 디바이스
- Forms 제출 / Bookings / 칼럼 read 전환률
- Admin `/admin-builder/analytics` 차트 (recharts)

**파일**: `src/lib/builder/analytics/`, `src/components/builder/analytics/`

---

### H8: Publish gate / Revisions / Rollback

**Wix 참조**: Wix Publish Wizard — broken link / SEO check / responsive review

**핵심**:
- 발행 전 자동 체크: broken link / missing alt / missing SEO meta / responsive overflow / form target validity / 빈 페이지
- Blocker (반드시 fix) vs warning (확인 후 진행) 분류
- PublishModal 재작성 (체크리스트 + Fix 버튼)
- Revision history (per-page + per-canvas) + diff 시각 + rollback 버튼
- CAS revisions (F3 작업 후속)

**파일**: `src/lib/builder/publish-gate/`, `src/components/builder/canvas/PublishModal.tsx` 재작성, `src/components/builder/canvas/VersionHistoryPanel.tsx` 강화

---

## P3 (Wix 확장 / 롱테일)

### I1: AI assist (ADI)

**Wix 참조**: Wix ADI / Wix AI / Wix Site Generator

**핵심**:
- 콘텐츠 자동 생성 (블로그 초안 / SEO meta / 이미지 alt / 페이지 카피)
- 디자인 추천 (페이지 layout 자동 제안)
- "AI 사이트 생성" 위자드 (사용자 답 → 사이트 자동 구성)
- OpenAI GPT-4o-mini 또는 Anthropic Claude
- Inspector 옆 "AI assist" 패널

**파일**: `src/lib/builder/ai/`, `src/components/builder/ai/AIAssistPanel.tsx`, `/api/builder/ai/{generate,suggest}`

---

### I2: A/B Testing

**Wix 참조**: Wix A/B Testing — variant 분기 + 자동 winner

**핵심**:
- 페이지 단위 variant (B 버전 만들기)
- cookie 기반 50/50 split
- conversion event 정의 (Forms 제출 / 버튼 클릭 / 페이지 도달)
- 자동 winner 판단 (statistical significance)
- Admin dashboard

**파일**: `src/lib/builder/ab-testing/`, `src/components/builder/ab-testing/`

---

### I3: Stores (e-commerce)

**Wix 참조**: Wix Stores — 상품 카탈로그 / 장바구니 / 결제

**핵심**:
- Product 도메인 (이름/가격/이미지/재고/카테고리/options)
- Cart 시스템 (cookie 또는 localStorage)
- Checkout 플로우 (사용자 정보 + 결제)
- Stripe 통합 (Checkout 또는 Elements)
- Admin: Products / Orders / Inventory

**파일**: `src/lib/builder/store/`, `src/components/builder/store/`, `/api/store/{products,cart,checkout}`

---

### I4: Events

**Wix 참조**: Wix Events — 이벤트 페이지 + 등록 + 티켓 + 리마인더

**핵심**:
- Event 도메인 (제목/일시/위치/설명/티켓 종류)
- 등록 폼 + 결제 (선택)
- iCal 다운로드 + Google Calendar add
- 리마인더 이메일
- Event widget (페이지에 이벤트 카드 임베드)

**파일**: `src/lib/builder/events/`, `src/components/builder/events/`, `/api/events/*`

---

### I5: Members area

**Wix 참조**: Wix Members Area — 회원가입 / 로그인 / 프로필

**핵심**:
- NextAuth 통합 (Google/Email magic link)
- 가입/로그인 페이지 자동 생성
- 프로필 페이지 (커스터마이즈 가능)
- Members-only 콘텐츠 게이트 (페이지 단위 또는 위젯 단위)
- Admin: 회원 목록

**파일**: `src/lib/builder/members/`, NextAuth config, `src/app/api/auth/`

---

### I6: Pricing Plans

**Wix 참조**: Wix Pricing Plans — 구독/멤버십

**핵심**:
- Plan 도메인 (이름/가격/주기/혜택)
- Stripe Subscription
- 권한 게이트 (멤버십 필요한 콘텐츠)
- 자동 갱신/취소
- Admin: Plans / Subscribers / Revenue

**파일**: `src/lib/builder/pricing-plans/`, `/api/pricing/*`

---

### I7: Velo (custom code)

**Wix 참조**: Wix Velo — 사이트 단위 JS/CSS

**핵심**:
- Site-level custom CSS 삽입 (SiteSettings → "Custom Code" 탭)
- Site-level custom JS (head/body 위치 선택)
- Per-page custom CSS/JS (page settings)
- DB 쿼리 helper (CMS API 노출)
- 코드 에디터 (Monaco Editor 또는 CodeMirror)

**파일**: `src/components/builder/canvas/CustomCodePanel.tsx`, `src/lib/builder/velo/`

---

### I8: Test sites / Branches

**Wix 참조**: Wix Branches — git branch 패턴

**핵심**:
- 사이트 분기 ("Fix homepage" branch 생성)
- 별도 URL 프리뷰 (`/branch-{id}/...`)
- 분기에서 작업 → main에 merge
- Conflict resolution

**파일**: `src/lib/builder/branches/`, `/api/builder/branches/*`

---

### I9: Permissions / Roles

**Wix 참조**: Wix Site Members / Wix Roles & Permissions

**핵심**:
- 역할: admin / editor / viewer / contributor
- 페이지/섹션 단위 권한
- 회원 그룹별 콘텐츠 접근

**파일**: `src/lib/builder/roles/`

---

### I10: Custom domain

**Wix 참조**: Wix Custom Domain (DNS + SSL)

**핵심**:
- DNS A/CNAME 가이드
- SSL 자동 (Let's Encrypt via Vercel)
- Domain 연결 admin

**파일**: 설정 페이지 + Vercel API 통합

---

### I11: App Market

**Wix 참조**: Wix App Market — 800+ 앱

**핵심**:
- 외부 앱 등록 sandbox (iframe + postMessage)
- OAuth 통합
- App detail page + install flow
- 우리 자체 "Apps" 카테고리 + 외부 marketplace

**파일**: `src/lib/builder/apps/`, `src/components/builder/apps/`

---

### I12: Backup / Site versions

**Wix 참조**: Wix Site History — 30일 자동 백업

**핵심**:
- 일별 자동 snapshot (Cron)
- Admin: 백업 목록 + 복원 버튼
- 30일 보관

**파일**: `src/lib/builder/backups/`, `/api/builder/backups/*`

---

### I13: Accessibility audit (WCAG)

**Wix 참조**: Wix Accessibility Wizard

**핵심**:
- 자동 검사 (alt missing / contrast 부족 / heading order / focus order)
- 위반 강조 + Fix 버튼
- A11yPanel 강화 (이미 일부 있음)
- WCAG 2.1 AA 기준

**파일**: `src/lib/builder/a11y-checker/` 강화

---

### I14: Schema migration framework

**핵심**:
- Schema version 명시 (`__schemaVersion`)
- Migration 함수 등록 (`v1 → v2 → v3`)
- 데이터 로드 시 자동 변환
- Deprecation 경고

**파일**: `src/lib/builder/migrations/`

---

### I15: 댓글 시스템 (블로그)

**Wix 참조**: Wix Comments

**핵심**:
- 칼럼 페이지 하단 댓글 섹션 (`comments-widget` kind)
- Anonymous + email 또는 Members area 통합
- Admin moderation (`/admin-builder/comments`)
- Spam 방지 (시간 trap + honeypot)

**파일**: `src/lib/builder/comments/`, `src/components/builder/published/CommentsSection.tsx`

---

### I16: Groups / Portfolio

**Wix 참조**: Wix Groups / Wix Portfolio

**핵심**:
- Groups: 커뮤니티 + 게시물 + 댓글
- Portfolio: 작품 카탈로그 + 카테고리 + 상세 페이지

**파일**: `src/lib/builder/groups/`, `src/lib/builder/portfolio/`

---

## 사용 방법

이 reference는 30+ 트랙의 압축 버전. 각 트랙 발주 시:

1. 사용자: "G2 발주해" / "I3 Stores 가자" 등
2. Claude: 해당 트랙 섹션을 5~10페이지 상세 프롬프트로 확장
3. Wix 본가 디자인 캡처/문서를 사용자가 제공하면 더 정확
4. 별도 `CODEX-PROMPT-{name}-{id}.md` 파일로 발행
5. Codex에 경로 전달 → 실행

**Wix 디자인 샘플 최대 활용 팁**:
- 사용자가 Wix 사이트 캡처 또는 Wix 공식 docs URL을 추가로 주면 그 섹션의 색/간격/배치를 1:1 미러 가능
- 호정의 브랜드 톤 (법률사무소 = 신뢰감 있는 deep navy + warm beige + dark green) 자동 반영

---

이 파일이 끝까지 가는 마스터 reference. 계획서: `WIX-PARITY-ROADMAP.md`
