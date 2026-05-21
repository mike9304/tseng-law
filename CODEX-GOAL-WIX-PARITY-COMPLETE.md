# Codex Goal — 호정 빌더 Wix-Parity 완성 Work Orders

본 문서는 Codex(또는 동등한 에이전트)에 단일 mission으로 던질 수 있는 완전 작업 명세서다.
순서대로 1번부터 차례로 실행할 것. 각 항목은 자체적으로 PR 단위로 종결되어야 한다.

---

## 0. Mission

호정국제 법률사무소(tseng-law.com)를 위한 **Wix Editor + Wix Studio 동급 사이트 빌더**를
완성한다. 호정에 불필요한 영역(Wix Stores 상품/장바구니 / Wix Restaurants / Wix Hotels /
mobile native app)은 명시적으로 제외한다. 법무 도메인 차별화는 적극적으로 유지/확장한다.

**기능 격차 목표**: Wix Editor 핵심 60개 기능 영역 중 **55개 이상 95% 구현**.

---

## 1. Hard Rules (절대 준수)

### 1.1 코드 위생
- **모든 신규 코드는 TypeScript strict mode**. `any` 사용 금지. `unknown` + 타입 가드 사용.
- **zod schema 강제**: 모든 외부 입력(API body, env, 사용자 폼)은 zod로 검증.
- **에러 처리**: try/catch 후 console.warn에 도메인+에러 로그. 사용자 응답엔 sanitized 메시지.
- **주석 최소화**: 코드가 "무엇을" 하는지 설명하지 말 것. "왜"가 비자명할 때만 1줄.
- **이모지 금지**: 사용자가 명시 요청하지 않는 한 코드/UI/문서에 이모지 사용 X.

### 1.2 작업 단위
- **PR 1개 = 1 work order**. 여러 work order를 한 PR에 묶지 말 것.
- **각 PR은 독립 mergeable**. 다른 PR에 의존하면 명시.
- **commit 메시지**: `<영역>: <한 줄 요약>` + 본문. Co-Authored-By 라인 포함.
- **NEVER push --force**. NEVER commit secrets. NEVER --no-verify.

### 1.3 테스트 강제
- 신규 lib 모듈: vitest 단위 테스트 **branch coverage 80% 이상**.
- 신규 API route: 최소 1개의 happy path + 1개의 4xx error path 테스트.
- 신규 UI 페이지: Playwright E2E 시나리오 1개 (`tests/builder-editor/`).
- **PR이 테스트 없이 merge되면 즉시 revert.**

### 1.4 권한 / 감사 통합
- 모든 새 mutation API는 `guardMutation(req, { permission: 'X' })` 사용.
- 새 도메인 추가 시 **Permission enum에 명시 + ROLE_PERMISSIONS 매트릭스 업데이트**.
- 새 mutation은 **audit event type 정의 + record helper 추가 + route에서 호출**.
- 본인 검증: 모든 새 audit event가 `/admin-builder/audit` 페이지에 노출되어야 함.

### 1.5 다국어 (i18n)
- 신규 사용자 노출 텍스트는 **ko / zh-hant / en 모두 작성**.
- LocalizedText 패턴 (`Record<Locale, string>`) 사용.
- 번역 매트릭스에 자동 sync 가능하게 설계.

### 1.6 데이터 스토리지
- **신규 영속 데이터는 Vercel Blob 1순위**, fs fallback (기존 패턴 따름).
- 절대 SQL/Postgres 도입하지 말 것 (현재 인프라 합리).
- 컬렉션 단위로 prefix 구분. 예: `builder-{domain}/{id}.json`.
- **schema 변경 시 마이그레이션 함수 작성** (work order 4.17 참조).

### 1.7 빌드/배포
- Edge runtime 호환성 유지 (middleware는 Web Crypto만, Node modules X).
- API routes는 `runtime: 'nodejs'` 명시.
- `dynamic: 'force-dynamic'` 명시 (cache 회피).

### 1.8 호정 컨텍스트
- 1인 사무소가 5-10명 사무소로 확장하는 시점. 멀티유저 인증 이미 구현됨.
- 한국 + 대만 양국 법무 도메인. 시간대 / 언어 양 측면 동시 고려.
- 의뢰인 PII는 절대 audit log에 평문 저장 금지 (이메일은 OK, 사건 내용 X).
- 변호사 윤리: 이해상충 / 비밀유지 우선. UI에서 적극 노출.

---

## 2. 현재 상태 / 베이스라인

### 2.1 기술 스택
- Next.js 14.2.35 App Router
- TypeScript strict
- Vercel Blob (private) + fs fallback
- Resend (이메일)
- bcryptjs (password)
- vitest (단위) + Playwright (E2E)
- Zustand (캔버스 상태)
- @dnd-kit (드래그앤드롭)
- 3 locale: ko / zh-hant / en

### 2.2 현재 구현됨 (코드 라인 약 30만)
- ✅ 캔버스 빌더 코어 (드래그/스냅/undo/단축키/줌/multi-select)
- ✅ 38개 widget kind (text/heading/image/gallery/button/form 8종/video/icon/divider/spacer/iframe/map/CTA banner/booking/composite 5종 등)
- ✅ 반응형 viewport (desktop/tablet/mobile + auto-stack + responsive overrides)
- ✅ 디자인 시스템 (theme tokens / Brand Kit / Color picker / Font picker / Google Fonts)
- ✅ 다중 페이지 + dynamic routes + locale별 페이지
- ✅ 빌더 CMS (빌트인 collections: columns / service-areas / attorney-profiles)
- ✅ 다국어 (translation matrix + linked posts)
- ✅ SEO 도구 (meta / sitemap / robots / Schema.org / 점수 / hreflang / redirects)
- ✅ Forms (8 widget + submissions admin + CAPTCHA + conditional logic + file upload)
- ✅ Bookings MVP (services / staff / availability / 4-step flow / calendar admin)
- ✅ Blog 컬럼 (TipTap editor + 카테고리/태그 + 다국어 linkedPosts)
- ✅ Publish Gate (7 카테고리 자동 체크: links/images/seo/forms/responsive/a11y/perf)
- ✅ Audit log infrastructure (21 event types)
- ✅ **Multi-user auth + RBAC (4 roles × 12 permissions, 본 작업 4dcc7f5에서 추가)**
- ✅ 31개 산업 템플릿 (267 파일 / 142K lines)
- ✅ 118개 섹션 디자인 (13 카테고리)

### 2.3 미푸시 브랜치 (Pre-work에서 통합 필요)
- `claude/impl-bookings-pro` — 동적 intake form / iCal / 이해상충 체크 / 시간대 / 사전 문서 업로드 (+4,088 lines)
- `claude/impl-section-templates` — 118 섹션 (35 추가) (+5,115 lines)
- `claude/impl-multi-user` — 멀티유저 인증 + audit + 권한 (+2,514 lines)
- `claude/impl-phase-b` — SEO 10탭 / GSC 연동 / CWV / AI brief (+8,246 lines)
- 기타 12개 브랜치

### 2.4 명확히 미구현 (Work order 대상)
- ❌ CRM / Contacts 통합 — Forms 제출이 contact으로 자동 등록 안 됨
- ❌ Members area / 클라이언트 포털
- ❌ 자체 Analytics 대시보드 — 외부 GA만
- ❌ Email Marketing / 캠페인
- ❌ Site Search
- ❌ A/B 테스트
- ❌ AI Site Generator (Wix ADI 같은 것)
- ❌ Custom domain 자동화 (DNS/SSL)
- ❌ Webhooks / Zapier 통합
- ❌ Live Chat / Inbox
- ❌ Storybook
- ❌ E2E 자동화 통합 (있으나 부분)
- ❌ Sentry / 에러 모니터링
- ❌ Schema 마이그레이션 시스템
- ❌ 데이터 백업 cron
- ❌ 번역 자동화 backend (placeholder만)

---

## 3. Pre-work — 미푸시 브랜치 통합 (PR #0)

**다른 모든 작업의 선행 조건.** 이 단계 완료 전에는 audit 도구가 잘못된 결과를 낸다.

### 3.1 통합 순서 (충돌 위험 낮은 순)
1. `claude/impl-multi-user` (자체 영역, 충돌 거의 없음) — 본 PR에 이미 머지 가정
2. `claude/impl-section-templates` (sections/ 전용)
3. `claude/impl-bookings-pro` (bookings/ 전용 — 본 PR과 약간 겹침: types.ts 스키마 추가)
4. `claude/impl-phase-b` (SEO 영역)
5. 나머지 12개 브랜치 (G-Editor 시리즈 — Codex가 작업한 UI 개선)

### 3.2 절차
- 브랜치마다: `git merge --no-ff` 시도 → 충돌 시 도메인 지식으로 수동 해결
- 머지 후 `npx vitest run && npm run build` 통과 확인
- 통과 시 main으로 push (사용자 명시 승인 받은 후)

### 3.3 Acceptance
- main 브랜치에서 `BUILT_IN_SECTIONS.length === 118`
- main에서 `/admin-builder/bookings/services` 편집 시 intake form 필드 표시
- main에서 SEO 대시보드 10 탭 노출
- 전체 테스트 1000+ 통과 (현재 733 + 미푸시 브랜치 테스트 합산)

---

## 4. Work Orders (실행 순서)

### 4.1 CRM Contacts 모듈 (PR #1) — ✅ 구현 완료 (2026-05-09 / commit `c769a36` / branch `claude/impl-pr1-crm-v2`)

> 구현 결과 요약: 핵심 lib (types/dedup/storage/upsert), 7개 API route, ContactsAdmin UI,
> 예약 자동 upsert hook, audit 이벤트 3종 (contact.create/update/deactivate),
> 권한 2종 (manage-crm/view-crm), 단위 테스트 20개. 753/753 통과. Build clean.
> 의존성: PR #0 (branch integration → main) 후 merge.

#### 목표
Wix Contacts 동급. Forms 제출 / Bookings 고객 / 수동 입력을 모두 단일 contact 레코드로 통합.

#### Files

**lib (신규)**
- `src/lib/builder/crm/contact-types.ts` — `Contact`, `ContactInteraction` 타입 + zod
- `src/lib/builder/crm/contact-storage.ts` — Vercel Blob CRUD
- `src/lib/builder/crm/dedup.ts` — 이메일/전화 정규화 + 중복 매칭 (호정 conflicts.ts 패턴 재사용)
- `src/lib/builder/crm/__tests__/*.test.ts` — 단위 테스트

**API**
- `GET  /api/builder/crm/contacts` — 목록 (검색/필터/태그)
- `POST /api/builder/crm/contacts` — 수동 생성
- `PATCH /api/builder/crm/contacts/[id]` — 수정
- `DELETE /api/builder/crm/contacts/[id]` — 비활성화
- `GET  /api/builder/crm/contacts/[id]/timeline` — 모든 interaction 시간순

**Hooks (기존 → contact 자동 등록)**
- `POST /api/forms/submit` 핸들러 끝부분: Contact 자동 upsert (이메일/전화 매칭)
- `POST /api/booking/book` 핸들러 끝부분: Contact 자동 upsert
- `POST /api/booking/admin-create` 핸들러 끝부분: 동일

**UI**
- `/[locale]/admin-builder/crm/page.tsx` — 컨택트 리스트 (검색 / 태그 필터 / 정렬)
- `/[locale]/admin-builder/crm/[id]/page.tsx` — 단일 컨택트 + 타임라인 + 노트
- `src/components/builder/crm/ContactsTable.tsx`
- `src/components/builder/crm/ContactDetailView.tsx`
- `src/components/builder/crm/ContactTimeline.tsx`
- `src/components/builder/crm/ContactImportModal.tsx` — CSV import

#### 스키마

```ts
export interface Contact {
  contactId: string;
  displayName: string;
  emails: string[];           // 정규화된 (lowercase)
  phones: string[];           // 정규화된 (digits only)
  companyName?: string;
  tags: string[];             // 'lead' | 'client' | 'past' 등 자유
  source: 'form' | 'booking' | 'manual' | 'import';
  ownerUserId?: string;       // 담당 변호사
  notes?: string;
  customFields?: Record<string, string>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInteraction {
  id: string;
  contactId: string;
  kind: 'form-submission' | 'booking' | 'note' | 'email-sent' | 'call';
  occurredAt: string;
  refId?: string;             // 원본 form/booking ID
  summary: string;            // 1줄 요약
  metadata?: Record<string, unknown>;
}
```

#### Permission
- 새 permission: `manage-crm` / `view-crm`
- 매트릭스: owner✓ / editor✓ / reviewer view-only / viewer view-only

#### Audit events
- `contact.create` / `contact.update` / `contact.deactivate` / `contact.import-batch`

#### 테스트
- dedup 매칭 (이메일 대소문자 / 전화 포맷 차이) — 8 cases
- timeline 정렬 / 페이지네이션
- form submit → contact upsert e2e (Playwright)
- CSV import 200 row → 모든 행이 등록되는지

#### Acceptance
- 폼 제출 시 5초 내 contact으로 등록됨
- 동일 이메일로 재 제출 시 새 contact 생성 X, interaction만 추가
- CRM 페이지에서 1,000+ contact 검색이 500ms 이내 (Blob 캐싱 검증)
- 다국어 라벨 ko/zh-hant/en

#### 작업량 추정
3,500 lines / 1주

---

### 4.2 Members area / 클라이언트 포털 (PR #2)

> **진행 상황 (2026-05-09)** — 분할 진행 중
> - **PR #2a (Member auth foundation)** — ✅ commit `d27a9b3` / branch `claude/impl-pr2-members`
> - **PR #2b (Cases lib + admin/member APIs)** — ✅ commit `48ec154` (같은 브랜치)
>   - lib: case-types/storage/document-storage/update-storage/message-storage/document-url/rls (7 모듈)
>   - 권한: manage-cases/view-cases (RLS: editor는 본인 owner 사건만 편집)
>   - 감사: 5 신규 이벤트 + 'high' confidentiality 마스킹
>   - 라우트: member 9 (auth/me/cases/messages/download) + admin 9 (cases/members CRUD)
>   - signed URL 다운로드 (HMAC + 15분) + 세션 이중 검증
>   - 테스트 42 신규 (총 816 통과)
> - **PR #2c (Portal UI + admin UI)** — ✅ commit `769a3f9` (같은 브랜치)
>   - Portal: layout + login(password/magic-link) + magic-link verify + dashboard + case detail
>   - Admin: cases list+create + case editor (meta/docs/updates/messages) + members CRUD
>   - 인라인 스타일 only, 3-locale (ko/zh-hant/en) 모든 텍스트
>   - Playwright E2E: portal-flow @smoke (Basic Auth → member 로그인 → 메시지 → 로그아웃)
>   - 테스트 (UI unit X, lib는 그대로 816 통과 / E2E로 UI 커버)
>   - 17 files / 4,167 lines / typecheck clean
>
> **PR #2 전체 완료 — 브랜치 `claude/impl-pr2-members` 합 50 files / 8,579 lines / 816 tests**

#### 목표
변호사 클라이언트가 로그인하여 본인 사건 조회 / 문서 다운로드 / 청구서 / 메시지 확인.
호정 차별화 핵심.

#### Files

**lib (신규)**
- `src/lib/builder/members/member-types.ts` — `Member`, `Case`, `CaseDocument`, `CaseUpdate` 타입
- `src/lib/builder/members/member-storage.ts`
- `src/lib/builder/members/case-storage.ts`
- `src/lib/builder/members/__tests__/*`

**Auth 확장**
- 기존 `BuilderUser`와 별도 컬렉션 (admin user / member 구분)
- `Member` 자체 인증 — 이메일 + 비밀번호 (bcryptjs 재사용)
- 자체 세션 쿠키: `member_session=` (admin과 분리)
- Magic link 옵션 (Resend로 단일 토큰 발송)

**API**
- `POST /api/member/auth/login` / `/logout` / `/magic-link/request` / `/magic-link/verify`
- `GET  /api/member/me` — 본인 + 사건 목록
- `GET  /api/member/cases/[id]` — 단일 사건 상세
- `GET  /api/member/cases/[id]/documents/[docId]` — signed Blob URL 발급
- `POST /api/member/cases/[id]/messages` — 의뢰인 → 변호사 메시지

**Admin API**
- `GET /api/builder/cases` — 사건 목록
- `POST /api/builder/cases` — 사건 생성 (담당 변호사 + 의뢰인 contact 연결)
- `PATCH /api/builder/cases/[id]` — 진행 상황 업데이트
- `POST /api/builder/cases/[id]/documents` — 문서 업로드
- `POST /api/builder/cases/[id]/updates` — 진행 단계 업데이트 추가
- `POST /api/builder/members` — Member 계정 생성 (admin이 의뢰인 초대)

**UI (Public)**
- `/[locale]/portal/login/page.tsx` — 로그인
- `/[locale]/portal/page.tsx` — 대시보드 (사건 목록)
- `/[locale]/portal/cases/[id]/page.tsx` — 사건 상세

**UI (Admin)**
- `/[locale]/admin-builder/cases/page.tsx` — 사건 목록 / 검색
- `/[locale]/admin-builder/cases/[id]/page.tsx` — 사건 편집 / 문서 / 메시지
- `/[locale]/admin-builder/members/page.tsx` — 의뢰인 계정 관리

#### 스키마

```ts
export interface Member {
  memberId: string;
  email: string;
  passwordHash?: string;       // null이면 magic-link only
  displayName: string;
  contactId: string;           // CRM contact 연결
  active: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface Case {
  caseId: string;
  caseNumber: string;          // 호정 내부 사건 번호
  title: LocalizedText;        // 의뢰인이 보는 제목
  description?: LocalizedText;
  ownerUserId: string;          // 담당 변호사 (BuilderUser)
  memberIds: string[];          // 의뢰인 (복수 가능)
  status: 'intake' | 'active' | 'pending' | 'closed' | 'archived';
  category: 'corporate' | 'immigration' | 'divorce' | 'criminal' | 'labor' | 'general';
  startedAt: string;
  closedAt?: string;
  confidentialityLevel: 'standard' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface CaseDocument {
  documentId: string;
  caseId: string;
  filename: string;
  blobPath: string;            // private blob
  uploadedBy: string;          // userId
  uploadedAt: string;
  size: number;
  visibleToMember: boolean;    // false면 변호사 내부용
}

export interface CaseUpdate {
  updateId: string;
  caseId: string;
  authorUserId: string;
  body: LocalizedText;
  visibility: 'internal' | 'shared';
  postedAt: string;
}

export interface CaseMessage {
  messageId: string;
  caseId: string;
  fromMemberId?: string;
  fromUserId?: string;
  body: string;
  sentAt: string;
}
```

#### Permission
- 새 permission: `manage-cases` / `view-cases` / `manage-members`
- 변호사(editor)는 본인 담당 사건만 (`ownerUserId === user.userId`) 편집 가능 — RLS 패턴

#### Audit events
- `case.create` / `case.update` / `case.status-change` / `case.document-upload` / `case.document-share-toggle`
- `member.create` / `member.deactivate`
- `member-auth.login.success` / `failure` / `magic-link-request`

#### 보안 핵심
- Member 세션과 admin 세션 **반드시 분리**. 쿠키 이름 다름. 검증 함수 다름.
- 사건 문서 다운로드 URL은 **signed URL with expiry (15분)** — Vercel Blob 직접 노출 X
- Confidentiality level 'high' 사건은 audit log에서도 metadata 마스킹

#### 호정 도메인 특화
- 사건 카테고리는 한국 / 대만 법무에 맞춤 (corporate / immigration / divorce / criminal / labor / general)
- 사건 진행 단계 (intake → active → pending → closed) 시각화 (timeline)
- 한국 변호사법: 의뢰인 동의 없이 정보 공유 X — 'shared' visibility만 의뢰인 노출

#### 테스트
- Member 로그인 / magic link e2e
- 사건 목록 본인 것만 노출 (다른 의뢰인 사건 보이면 fail)
- 문서 다운로드 signed URL 만료 테스트
- 메시지 양방향 (member → admin / admin → member)

#### 작업량 추정
6,000 lines / 2-3주

---

### 4.3 자체 Analytics 대시보드 (PR #3) — ✅ 구현 완료 (commit `6354612` + follow-up `f7dc287` / branch `claude/impl-pr3-analytics`)

> 메인 commit `6354612`: 5 lib 모듈 (types/storage/aggregator/range/bot-filter) + 5 API routes + booking hook + tracker snippet + 5탭 admin dashboard. 36 신규 테스트 (총 769 통과). Privacy: HMAC visitorHash + DNT/Sec-GPC/bot 필터.
> Follow-up `f7dc287`: purgeOlderThan cron route (`/api/cron/analytics-purge`) + vercel.json (매일 04:00 UTC). CRON_SECRET 인증. 30일 후 visitorHash 'anonymized'.
> 의존성: PR #0 후 머지. 환경: CRON_SECRET, ANALYTICS_HASH_SALT 설정 필요.


#### 목표
Wix Analytics 동급. 빌더 admin 안에서 트래픽 / 전환 / 페이지 인기 차트 표시.
외부 GA 안 켜도 됨.

#### Files

**lib (신규)**
- `src/lib/builder/analytics/event-types.ts` — page_view / click / form_submit / booking_create
- `src/lib/builder/analytics/event-storage.ts` — JSONL 일별 partition (audit log 패턴 재사용)
- `src/lib/builder/analytics/aggregator.ts` — 일/주/월 집계
- `src/lib/builder/analytics/external/ga-client.ts` — GA Reporting API v4 호출 (옵션)
- `src/lib/builder/analytics/external/plausible-client.ts` — Plausible API (옵션)

**Public 측 트래커**
- `/api/analytics/track` — POST 이벤트 수집 endpoint (rate limit + bot 필터)
- `<script>` snippet (sandbox 페이지에 자동 inject)

**API (admin)**
- `GET /api/builder/analytics/overview?range=7d|30d|90d`
- `GET /api/builder/analytics/pages?range=...`
- `GET /api/builder/analytics/conversions?range=...`
- `GET /api/builder/analytics/realtime` — 최근 1시간 active

**UI**
- `/[locale]/admin-builder/analytics/page.tsx` — 5 탭 (overview / pages / sources / conversions / realtime)
- 차트는 lightweight (recharts 없이 SVG 직접 그리기 — 번들 사이즈 절약)

#### 스키마

```ts
export interface AnalyticsEvent {
  type: 'page_view' | 'click' | 'form_submit' | 'booking_create' | 'session_start';
  occurredAt: string;
  sessionId: string;          // localStorage UUID
  visitorHash: string;         // 익명 hash (IP + UA salted)
  pageId?: string;
  pagePath: string;
  referrer?: string;           // 최상위 도메인만 저장 (privacy)
  utm?: { source?: string; medium?: string; campaign?: string };
  device: 'desktop' | 'tablet' | 'mobile';
  country?: string;            // CF-IPCountry header
  metadata?: Record<string, string>;
}
```

#### Privacy
- IP 직접 저장 X. salted hash만.
- referrer는 origin만 (path 제거)
- DNT (Do Not Track) 헤더 시 수집 중단
- 30일 후 자동 anonymize (visitorHash 제거)

#### Permission
- 새 permission: `view-analytics` / `manage-analytics-config`

#### 외부 통합 옵션
- env에 `GA_PROPERTY_ID` 있으면 GA Reporting API 병렬 호출 → 비교 표시
- env에 `PLAUSIBLE_SITE_ID` 있으면 동일

#### 작업량
3,000 lines / 1-2주

---

### 4.4 Email Marketing / Campaigns (PR #4)

#### 목표
Wix Email Marketing 동급. 구독자 관리 / 템플릿 빌더 / 캠페인 발송 / 통계.

#### Files

**lib**
- `src/lib/builder/marketing/subscriber-types.ts` / `subscriber-storage.ts`
- `src/lib/builder/marketing/campaign-types.ts` / `campaign-storage.ts`
- `src/lib/builder/marketing/template-renderer.ts` — MJML or plain HTML
- `src/lib/builder/marketing/dispatcher.ts` — Resend bulk + batch (10/sec)
- `src/lib/builder/marketing/tracking.ts` — open/click pixel + redirect

**API**
- `POST /api/marketing/subscribe` — 공개 구독 (CAPTCHA + double opt-in)
- `GET /api/marketing/unsubscribe?token=...` — 1-click 해지
- `GET /api/builder/marketing/subscribers` — 목록 / 검색 / 태그
- `POST /api/builder/marketing/subscribers/import` — CSV
- `POST /api/builder/marketing/campaigns` — 캠페인 생성 (draft)
- `POST /api/builder/marketing/campaigns/[id]/send` — 발송 (cron으로 batch)
- `GET /api/builder/marketing/campaigns/[id]/stats` — 오픈/클릭/해지율

**Cron**
- `/api/marketing/cron/dispatch` — pending 캠페인 배치 처리 (Vercel cron 5분마다)

**UI**
- `/[locale]/admin-builder/marketing/page.tsx` — 캠페인 목록
- `/[locale]/admin-builder/marketing/subscribers/page.tsx` — 구독자
- `/[locale]/admin-builder/marketing/campaigns/[id]/edit/page.tsx` — 캠페인 편집기
- `src/components/builder/marketing/EmailTemplateBuilder.tsx` — 빌더 캔버스 재사용 (subset)

#### 스키마

```ts
export interface Subscriber {
  subscriberId: string;
  email: string;
  contactId?: string;
  status: 'pending' | 'subscribed' | 'unsubscribed' | 'bounced';
  tags: string[];
  preferredLocale: Locale;
  doubleOptInVerifiedAt?: string;
  unsubscribedAt?: string;
  source: string;
  createdAt: string;
}

export interface Campaign {
  campaignId: string;
  name: string;
  subject: LocalizedText;
  preheader?: LocalizedText;
  bodyHtml: LocalizedText;
  bodyText: LocalizedText;
  segmentTags?: string[];
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  stats: { recipients: number; opens: number; clicks: number; unsubscribes: number; bounces: number };
}
```

#### Permission
- `manage-campaigns` / `view-campaigns` / `manage-subscribers`

#### 법규 준수
- CAN-SPAM / GDPR / 한국 정통법 모두 준수
- 모든 발송 메일 하단에 unsubscribe 링크 자동 추가 (강제, 옵션 X)
- Double opt-in 강제 (구독 직후 verify 메일)
- 발송 발신자 = `bookings@hoveringlaw.com.tw` 동일 (DKIM/SPF 설정 필요 — README에 명시)

#### 작업량
4,500 lines / 2-3주

---

### 4.5 Site Search (PR #5)

#### 목표
Wix Search 동급. 페이지 / 블로그 / FAQ 통합 검색 + admin 안에서 검색 분석.

#### Files

**lib**
- `src/lib/builder/search/index-builder.ts` — MiniSearch 인덱스 빌드 (publish 시 호출)
- `src/lib/builder/search/index-storage.ts` — 인덱스 JSON Blob 저장
- `src/lib/builder/search/query-engine.ts` — 클라이언트 측 검색

**Public API**
- `GET /api/search?q=&locale=` — 인덱스 fetch + 결과 (서버측 또는 클라이언트측)

**Admin API**
- `POST /api/builder/search/rebuild` — 인덱스 강제 재빌드
- `GET /api/builder/search/queries` — 사용자가 검색한 쿼리 통계

**Public UI**
- `<SiteSearchBar>` widget — 새 위젯 kind 'site-search'
- `<SiteSearchResults>` widget — 결과 페이지 widget
- `/[locale]/search/page.tsx` — 결과 페이지

**Admin UI**
- `/[locale]/admin-builder/search/page.tsx` — 인덱스 상태 / 검색 쿼리 통계 / 무결과 쿼리

#### 통합
- Publish 시 자동 인덱스 재빌드 (publish-gate / publish.ts hook)
- 검색 쿼리 → analytics 이벤트 자동 발행

#### 작업량
2,000 lines / 1주

---

### 4.6 권한 일괄 적용 (PR #6)

#### 목표
171개 남은 mutation route에 모두 적절한 permission 적용. 이번 PR(7977c40)에서 booking/users만 적용됨.

#### 매핑 가이드 (적용 대상별)

| 라우트 prefix | permission |
|---|---|
| `/api/builder/sites/[siteId]/*` (PATCH) | edit-pages |
| `/api/builder/sites/[siteId]/pages/[pageKey]/publish` | publish |
| `/api/builder/sites/[siteId]/pages/[pageKey]/draft` (DELETE) | delete-pages |
| `/api/builder/sites/[siteId]/pages/[pageKey]/revisions/rollback` | edit-pages |
| `/api/builder/columns/*` (POST/PATCH/DELETE) | edit-blog |
| `/api/builder/columns/[slug]/publish` | edit-blog |
| `/api/builder/forms/*` mutations | manage-forms |
| `/api/builder/translations/*` mutations | edit-pages |
| `/api/builder/seo/*` mutations | edit-seo |
| `/api/builder/redirects/*` mutations | edit-seo |
| `/api/builder/assets/*` mutations | edit-pages |
| `/api/builder/cms/*` mutations | edit-pages |

#### 절차
- 각 라우트 파일 grep → `guardMutation(request)` → `guardMutation(request, { permission: 'X' })`
- 새 permission 발견 시 PERMISSIONS / ROLE_PERMISSIONS / Permission UI 매트릭스에 추가
- E2E 테스트: editor 역할 사용자가 user 관리 시도 → 403 / owner는 OK

#### 작업량
500 lines (대부분 sed) / 2-3일

---

### 4.7 Form Builder UI 강화 (PR #7)

#### 목표
현재 형태 OK 수준. drag-drop 필드 정렬 / multi-step UI / conditional logic 시각 빌더.

#### 신규 기능
- 필드 드래그앤드롭 (재정렬)
- Step 분할 UI ("새 step 추가" 버튼)
- 조건부 로직 룰 빌더 ("이 필드가 X 값일 때 Y 필드 보임")
- 폼 미리보기 (실제 렌더링)
- 폼 통계 — 시작 / 완료 / 단계별 이탈 funnel

#### 작업량
2,000 lines / 1주

---

### 4.8 Calendar Sync — Google / Outlook (PR #8)

#### 목표
변호사가 자기 Google Calendar / Outlook 일정과 booking 일정을 양방향 sync.

#### Files
- `src/lib/builder/bookings/calendar-sync/google.ts` — OAuth + Calendar API
- `src/lib/builder/bookings/calendar-sync/outlook.ts` — Microsoft Graph API
- `src/lib/builder/bookings/calendar-sync/sync-engine.ts` — 양방향 sync 로직

#### API
- `GET /api/builder/bookings/calendar-sync/connect/google` — OAuth start
- `GET /api/builder/bookings/calendar-sync/oauth-callback` — code → token
- `POST /api/builder/bookings/calendar-sync/sync-now` — 수동 sync
- Cron: 30분마다 자동 sync

#### 보안
- OAuth refresh token은 Vercel Blob 암호화 (additional encryption layer with `CMS_SESSION_SECRET`)
- 변호사별 분리 — token leak 시 영향 최소화

#### 작업량
3,000 lines / 1-2주

---

### 4.9 Email Template 디자인 빌더 (PR #9)

#### 목표
booking confirm / reminder / form response / marketing campaign 모든 이메일이 빌더 캔버스로 디자인 가능.

#### 접근
- 기존 빌더 캔버스의 subset (text/heading/button/image/divider만)
- MJML로 export → Resend 발송 시 호환
- 변수 바인딩: `{{customer.name}}`, `{{booking.startAt}}`, `{{site.brandName}}` 등

#### 작업량
3,500 lines / 2주

---

### 4.10 A/B 테스트 (PR #10)

#### 목표
페이지 단위 A/B variant + 트래픽 split + 전환 측정.

#### 설계
- Page에 `experiments?: Experiment[]` 필드
- Experiment: variants[] (각 variant 고유 사이트 노드 트리)
- 방문자별 variant 결정 = sessionId hash % 100 (sticky)
- analytics에 variant 차원 추가
- 통계 유의성 자동 계산 (z-test)

#### 작업량
2,500 lines / 1-2주

---

### 4.11 AI Site Generator — Wix ADI clone (PR #11)

#### 목표
사용자가 도메인 정보 (업종 / 회사명 / 톤 / 컬러 선호) 입력 → AI가 산업 템플릿 + 콘텐츠를 자동 합성.

#### Files
- `src/lib/builder/ai-generator/site-spec.ts` — 사용자 입력 schema
- `src/lib/builder/ai-generator/template-selector.ts` — 31산업 중 매칭
- `src/lib/builder/ai-generator/content-generator.ts` — OpenAI / Anthropic 호출 + 템플릿 텍스트 채움
- `src/lib/builder/ai-generator/orchestrator.ts` — 전체 파이프라인

#### UI
- `/[locale]/admin-builder/ai-generator/page.tsx` — 5-step wizard
  1. 업종 선택
  2. 회사명 / 슬로건
  3. 톤 (전문적 / 친근 / 럭셔리)
  4. 컬러 선호
  5. 미리보기 + 생성

#### 비용 통제
- LLM 호출 횟수 / 사용자 quota
- 캐시 (동일 입력 → 동일 출력)

#### 작업량
4,000 lines / 2주

---

### 4.12 Custom Domain 자동화 (PR #12)

#### 목표
사용자가 도메인 입력 → Vercel API 호출하여 자동으로 alias + SSL 발급.

#### Files
- `src/lib/builder/domains/vercel-api.ts` — Vercel REST API client
- `src/lib/builder/domains/dns-verifier.ts` — DNS TXT 레코드 확인

#### Flow
1. 사용자가 사이트 setting에서 도메인 입력
2. UI: "DNS에 TXT/CNAME 추가하세요" 안내
3. 30초마다 polling — DNS 확인 후 Vercel alias 등록
4. SSL 자동 (Let's Encrypt via Vercel)

#### 작업량
1,500 lines / 1주

---

### 4.13 Webhooks / Zapier 통합 (PR #13)

#### 목표
booking/form/contact 이벤트 → 외부 URL POST. Zapier/Make/n8n 연동 가능.

#### Files
- `src/lib/builder/webhooks/types.ts` — `WebhookSubscription`
- `src/lib/builder/webhooks/dispatcher.ts` — async fan-out + retry
- `src/lib/builder/webhooks/signature.ts` — HMAC-SHA256 서명

#### API
- `POST /api/builder/webhooks` — 등록
- `GET /api/builder/webhooks/[id]/deliveries` — 발송 로그 / 실패 재시도

#### 이벤트 트리거
- Form submitted / Booking created / Contact created / Page published / Member registered

#### 작업량
2,000 lines / 1주

---

### 4.14 Live Chat / Inbox (PR #14)

#### 목표
사이트 방문자 → 호정 admin 채팅. WebSocket / SSE.

#### 접근
- Vercel은 WebSocket 미지원 — Server-Sent Events 사용
- 대안: Pusher / Ably 통합 (외부 서비스)

#### 우선 순위
**낮음** — 호정에는 booking이 더 적합. live chat은 nice-to-have.

#### 작업량
4,000 lines / 2주

---

### 4.15 Storybook + 컴포넌트 카탈로그 (PR #15)

#### 목표
38개 widget kind + 향후 추가될 widget을 Storybook으로 문서화. 디자이너가 보고 사용할 수 있게.

#### 작업
- Storybook 8 설정
- 각 widget당 .stories.tsx 1개 (자동 생성 가능)
- Visual regression test 통합 (Chromatic 또는 자체 스크린샷)

#### 작업량
2,000 lines / 1주

---

### 4.16 Sentry + 에러 모니터링 (PR #16)

#### 목표
프로덕션 에러 자동 수집. 현재 console.warn만 — 사용자 측 에러 안 보임.

#### 작업
- `@sentry/nextjs` 통합
- 빌더 전용 tag (sandbox 에러는 빌더로, 발행물 에러는 site로 구분)
- Source map upload (Vercel build hook)
- 에러 알림 → 호정 Slack 또는 이메일

#### 작업량
500 lines / 3일

---

### 4.17 Schema 마이그레이션 시스템 (PR #17)

#### 목표
Vercel Blob JSON 데이터의 schema 변경 시 안전하게 마이그레이션.

#### 설계
- `src/lib/builder/migrations/runner.ts` — 빌드 시 자동 실행
- 각 collection에 `schemaVersion` 필드
- 마이그레이션 함수 = `(oldDoc) => newDoc`
- Idempotent / 한 번만 실행 / 실패 시 rollback

#### 첫 마이그레이션 케이스
- BuilderUser에 `lastPasswordChangeAt` 추가
- Contact에 `customFields` 추가
- 기존 booking에 `intakeAnswers` 빈 객체 백필

#### 작업량
1,500 lines / 1주

---

### 4.18 Backup / 복구 cron (PR #18)

#### 목표
Vercel Blob 데이터 정기 백업. 사고 시 복구 가능.

#### 설계
- 일별 cron (`/api/cron/backup`)
- Blob 전체 → ZIP → S3 (또는 별도 Blob namespace)
- 30일 retain
- 복구 스크립트 (`scripts/restore-from-backup.mjs`)

#### 작업량
1,500 lines / 1주

---

### 4.19 번역 자동화 backend (PR #19)

#### 목표
TranslationManagerView / sync.ts에 실제 OpenAI / DeepL 호출 코드 삽입.

#### Files
- `src/lib/builder/translations/providers/openai.ts`
- `src/lib/builder/translations/providers/deepl.ts`
- `src/lib/builder/translations/providers/router.ts` — env에 따라 선택

#### 비용 통제
- 캐시 (동일 source → 동일 target)
- Rate limit
- 사용자 옵션 (auto-translate vs manual)

#### 작업량
1,500 lines / 1주

---

### 4.20 호정 도메인 검증 / QA (PR #20)

#### 목표
모든 PR 합쳐진 후 호정 실제 운영 시나리오로 종합 QA.

#### 시나리오 (Playwright E2E)
1. 신규 의뢰인이 contact form 제출 → CRM contact + booking 자동 등록
2. 의뢰인이 booking 후 manage 링크로 reschedule
3. 변호사가 admin에서 사건 생성 → 의뢰인 초대 → member portal 로그인 확인
4. 마케팅 직원이 캠페인 생성 → 발송 → 통계 확인
5. 대표가 직원 관리 → 신규 변호사 계정 추가 → 권한 확인
6. 페이지 편집 → 발행 → publish-gate 차단 시 차단 원인 표시
7. 다국어 — 한국어 페이지 발행 → 자동 번역 → 검수 → 대만어 발행

#### 호정 법무 특화 검증
- 의뢰인 정보 PII가 audit log에 평문으로 저장되지 않는지 (eyes-on)
- Confidentiality high 사건은 staff role도 못 보는지
- 이해상충 체크 — 동일 이름/회사 재방문 시 경고
- 시간대 — 한국 클라이언트가 대만 변호사 예약 시 양국 시간 표시

#### 작업량
2,000 lines (테스트 위주) / 1주

---

## 5. Quality Gates (모든 PR 공통)

### 5.1 자동 체크 (PR 머지 전)
- [ ] `npm run build` 성공 (lint 0 errors)
- [ ] `npx vitest run` 100% 통과
- [ ] 신규 lib 모듈 branch coverage 80%+
- [ ] 신규 API route 최소 happy + error path 테스트
- [ ] `npx playwright test` 신규 시나리오 통과 (해당 시)
- [ ] TypeScript strict 0 errors
- [ ] 신규 audit event는 audit viewer page에 노출 확인
- [ ] 신규 permission은 Permission enum + ROLE_PERMISSIONS 모두 등록

### 5.2 수동 체크리스트
- [ ] 사용자 노출 텍스트 ko/zh-hant/en 3 locale 모두 작성
- [ ] CSRF + Origin 헤더 검증 (mutations)
- [ ] Rate limit 적용 (mutations)
- [ ] 에러 응답 sanitized (스택 trace 노출 X)
- [ ] PII 처리: audit log에 평문 저장 X / signed URL / 만료 시간
- [ ] 환경변수 추가 시 `.env.example` 업데이트 + README 문서화

### 5.3 Brand 일관성
- 컬러 / 폰트 / 컴포넌트 variants는 design system 토큰 사용
- 새 UI는 `BuilderWorkspaceFrame` / 기존 admin 레이아웃 따름
- Toast / Modal / Form input은 기존 컴포넌트 재사용

---

## 6. PR 워크플로

### 6.1 브랜치 명명
- `claude/impl-<work-order-id>-<짧은-이름>` 형식
- 예: `claude/impl-pr1-crm-contacts`

### 6.2 PR 템플릿
```markdown
## Work Order
PR #N — <제목>

## Summary
- 핵심 변경 1줄
- 핵심 변경 2줄
- ...

## New Permissions / Audit Events
- permission: `manage-X`
- audit: `X.create`, `X.update`

## Acceptance Criteria
- [ ] 시나리오 1 동작
- [ ] 시나리오 2 동작
- [ ] 테스트 N개 추가, 모두 통과

## Test Plan
1. 단위 테스트: ...
2. E2E: ...
3. 수동 QA: ...

## Migration Required?
- yes/no — 필요 시 migration 함수 위치

## Co-Authored-By: Claude <noreply@anthropic.com>
```

### 6.3 머지 정책
- 사용자(대표) 승인 후에만 머지
- Force push 금지
- Rebase 보다는 merge commit 선호 (history 추적)

---

## 7. Definition of Done (전체)

본 Goal은 다음 기준 모두 충족 시 완료:

- [ ] PR #0~#20 모두 main에 merge됨
- [ ] 단일 main 브랜치에서 전체 빌드 성공
- [ ] 통합 테스트 1500+ 통과
- [ ] E2E 시나리오 20+ 통과
- [ ] 호정 사이트(tseng-law.com)에 실제 배포되어 운영 중
- [ ] 5명 이상 직원이 멀티유저 시스템으로 일상 사용
- [ ] CRM에 100+ contact 등록되어 있음
- [ ] Member 포털을 통해 의뢰인 5명 이상 active
- [ ] 1개 이상 email 캠페인 발송 (50+ 구독자)
- [ ] Search 사용 / Analytics 대시보드 일상 확인
- [ ] Sentry 에러 모니터링 활성, 미해결 critical 에러 0개

이 모든 것이 끝나면 호정 빌더는 Wix Editor의 95% 기능 격차를 좁혔다고 선언할 수 있다.

---

## 8. 작업 순서 의존성 그래프

```
PR #0 (브랜치 통합)
  ├─→ PR #6 (권한 일괄 적용 — 빠른 win)
  ├─→ PR #1 (CRM)
  │     └─→ PR #2 (Members area — CRM contact 연결)
  │     └─→ PR #4 (Email Marketing — CRM 구독자)
  │
  ├─→ PR #3 (Analytics)
  │     └─→ PR #10 (A/B 테스트 — Analytics 의존)
  │
  ├─→ PR #5 (Site Search)
  ├─→ PR #7 (Form Builder UI)
  ├─→ PR #8 (Calendar Sync)
  ├─→ PR #9 (Email Template Builder — PR #4 후)
  ├─→ PR #11 (AI Generator)
  ├─→ PR #12 (Custom Domain)
  ├─→ PR #13 (Webhooks)
  ├─→ PR #14 (Live Chat — 우선 낮음)
  ├─→ PR #15 (Storybook)
  ├─→ PR #16 (Sentry)
  ├─→ PR #17 (Migrations)
  ├─→ PR #18 (Backup)
  └─→ PR #19 (Translation backend)

  PR #20 (호정 QA) ← 모든 위 PR 후
```

병렬 가능: PR #1, #3, #5, #7, #16 (서로 독립)
직렬 필수: PR #0 → 나머지 모두

---

## 9. 시간 추정

| PR | 작업량 | 예상 기간 (1인 풀타임 + AI assist) |
|---|---|---|
| #0 통합 | merge work | 3일 |
| #1 CRM | 3,500 lines | 1-2주 |
| #2 Members | 6,000 lines | 2-3주 |
| #3 Analytics | 3,000 lines | 1-2주 |
| #4 Email Marketing | 4,500 lines | 2-3주 |
| #5 Site Search | 2,000 lines | 1주 |
| #6 권한 일괄 | 500 lines | 2-3일 |
| #7 Form UI | 2,000 lines | 1주 |
| #8 Calendar Sync | 3,000 lines | 1-2주 |
| #9 Email Template | 3,500 lines | 2주 |
| #10 A/B | 2,500 lines | 1-2주 |
| #11 AI Generator | 4,000 lines | 2주 |
| #12 Custom Domain | 1,500 lines | 1주 |
| #13 Webhooks | 2,000 lines | 1주 |
| #14 Live Chat | 4,000 lines | 2주 (우선 낮음) |
| #15 Storybook | 2,000 lines | 1주 |
| #16 Sentry | 500 lines | 3일 |
| #17 Migrations | 1,500 lines | 1주 |
| #18 Backup | 1,500 lines | 1주 |
| #19 Translation | 1,500 lines | 1주 |
| #20 호정 QA | 2,000 lines | 1주 |
| **합계** | **약 51,000 lines** | **약 25-32주 (6-8개월)** |

병렬 작업으로 4-5개월 가능.

---

## 10. 비용 추정 (외부 서비스)

월 운영비 (호정 1개 사이트 기준):
- Vercel Pro: $20
- Vercel Blob: 약 $5 (10GB)
- Resend: $20 (10K emails)
- OpenAI API (AI generator + 번역): $30~100 (사용량 따라)
- Sentry: $26 (Team 플랜)
- (옵션) GA / Plausible: 무료
- **합계: 약 $100~150 / 월**

10명 사무실용으로는 합리적.

---

## 끝.

이 문서를 그대로 Codex / 다른 AI 에이전트에 mission으로 던질 수 있다.
첫 PR (#0 통합) 부터 순서대로 실행할 것.

가장 큰 위험: **scope creep**. 각 PR을 명세대로 끝내고 다음으로 넘어갈 것.
"이거도 되네 추가하자" 유혹에 빠지면 6개월이 1년 된다.
