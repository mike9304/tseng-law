# tseng-law.com 보안 감사 및 상담 동선 정비 보고서

- 감사일: 2026-07-31 (KST)
- 대상 저장소: `/Users/son7/Projects/tseng-law`
- 릴리스 스냅샷 기준 커밋: `b0d68c0`
- 감사 범위: 현재 작업 트리의 코드·설정·lock file·변경 diff, 단위/구성/route-guard 테스트, clean production build, 로컬 및 운영 브라우저 QA, 제한된 Vercel production 환경변수 메타데이터 확인, production 배포와 read-only HTTP probe
- 수행하지 않은 작업: 운영 고객 데이터 접근·변경, 실제 상담 메일·결제·webhook 발송, 무차별 로그인, 대량 요청, 공격성 파일 업로드, Vercel/DNS secret 변경

> **배포 상태:** 검증된 production candidate `dpl_91itCHGyybBDKPqneiyHV5DT9nJm`을 2026-07-31 KST에 `https://tseng-law.com`으로 승격했다. 승격 후 네 locale의 데스크톱·모바일 브라우저 QA와 HTTP/header probe를 통과했다. 실제 상담 메일·결제·webhook 등 외부 provider의 부작용 테스트는 수행하지 않았다.

## 1. 기술 스택 요약

- Next.js **15.5.21** App Router, React/React DOM **18.3.1**, TypeScript, Zod
- Vercel 배포 전제, Vercel Blob과 격리 가능한 로컬 파일 fallback
- 회원 비밀번호: `bcryptjs` cost 10
- 회원 세션: 서버 저장형 임의 UUID, 7일 만료, 로그아웃 시 서버 세션 폐기
- 빌더 관리자: Basic Auth와 서명된 관리자 세션 쿠키, 역할·세부 권한 모델
- 상담 메일: Nodemailer/SMTP와 공개 범용 폼의 서버 측 이메일 전달 연결 지점
- 다국어: 한국어, 번체중국어, 영어, 일본어
- 검색: 파일/Blob 기반 index의 메모리 검색
- 공개 회원가입: **비활성화됨**. `/api/members/signup`은 locale과 무관하게 항상 403 `public_signup_disabled`를 반환한다.
- 미디어: 외부 재생 provider에 의존하지 않는 로컬 WebM/MP4/poster 세트 4개. 산악 오프닝은 Veo 3.1, 법원·삼합원·법정은 Seedance 2.0 생성본을 사용한다.

## 2. 발견 사항 분류

아래 A만 코드에서 실제 악용 조건이 확인된 취약점이다. B는 보안·품질 개선 또는 잔여 권고, C는 검토 범위에서 문제를 발견하지 못한 항목, D는 코드만으로 운영 상태를 확정할 수 없는 항목이다.

---

## A. 확인된 취약점

### A-1. 회원 관리 route의 `manage-users` 권한 누락 — 수정 완료

- 대상 파일 또는 기능: `src/app/api/builder/members/[memberId]/route.ts`
- 문제 설명: 수정 전 `PATCH`·`DELETE`는 `guardMutation({ bucket: 'mutation' })`만 사용했다. 공통 `guardMutation`의 기본 권한은 **`edit-pages`**이므로, 회원 관리 권한이 없는 페이지 편집자도 회원 역할·차단 상태 변경 또는 삭제를 시도할 수 있었다. 같은 route의 `GET`도 인증만 확인하고 `manage-users`를 확인하지 않았다.
- 위험도: **High**
- 실제 악용 조건: 공격자가 유효한 빌더 세션과 `edit-pages` 권한을 갖고 있지만 `manage-users` 권한은 없는 경우
- 수정 내용: `GET`은 `guardBuilderReadWithPermission(request, 'manage-users')`, `PATCH`·`DELETE`는 `permission: 'manage-users'`를 적용했다. 비로그인은 401, 인증됐지만 권한이 없으면 403이다.
- 수정 후 검증 방법: `src/app/api/builder/members/[memberId]/__tests__/route.test.ts`에서 무권한 GET/PATCH/DELETE 403과 엔진 함수 비호출을 확인한다.
- 추가 수동 확인 필요 여부: **예.** Preview의 실제 역할 매핑으로 `manage-users` 보유·미보유 테스트 계정을 각각 확인해야 한다.

### A-2. 민감한 빌더 GET route의 세부 권한 누락 — 수정 완료

- 대상 파일 또는 기능:
  - 설정·개발·운영: `src/app/api/builder/site/{settings,custom-code}/**`, `src/app/api/builder/dev/**`, `src/app/api/builder/ops/**`, `src/app/api/builder/site/audit/route.ts`
  - 예약: `src/app/api/builder/bookings/**`
  - 번역: `src/app/api/builder/translations/**`, `src/app/api/builder/site/translation-release-*/**`
  - 편집 콘텐츠: `src/app/api/builder/{blog,columns,ai-generator,home}/**`, 비공개 asset collection `src/app/api/builder/assets/route.ts`, `src/app/api/builder/site/pages/**`, `src/app/api/builder/publish/validate/route.ts`
- 문제 설명: 여러 GET handler가 관리자 인증만 확인하고 기능별 권한을 확인하지 않았다. 따라서 제한된 빌더 계정이 설정·로그·감사 기록·예약 데이터·번역 정책·미공개 콘텐츠를 읽을 수 있었다.
- 위험도: **High**
- 실제 악용 조건: 공격자가 유효하지만 제한된 권한의 빌더 계정을 보유하고 해당 API를 직접 호출하는 경우. 익명 사용자의 직접 접근은 확인되지 않았다.
- 수정 내용: 기능에 맞춰 `settings`, `view-bookings`, `manage-bookings`, `manage-translations`, `edit-blog`, `edit-pages`, `manage-users` 또는 `manage-roles` 권한을 서버 GET handler에 명시했다.
- 수정 후 검증 방법: 각 route의 직접 단위 테스트에서 인증 없음 401, 권한 없음 403, 올바른 권한 보유 시 성공과 엔진 함수 호출을 확인한다. 이번 갱신에서 `npm run security:builder-routes`는 279개 builder route 파일과 273개 mutation handler의 guard coverage를 검사해 통과했다(주석으로 명시된 allowlist 4개는 별도 검토 대상).
- 추가 수동 확인 필요 여부: **예.** Preview에서 실제 역할별 API matrix를 테스트 fixture로 확인해야 한다.

### A-2a. publish 권한과 민감 관리자 화면의 세부 권한 누락 — 수정 완료

- 대상 파일 또는 기능:
  - publish: `src/app/api/builder/{home,publish/atomic}/**`, `site/pages/[pageId]/publish/**`, `sites/[siteId]/{pages/[pageKey],dynamic-templates/[templateId]}/publish/**`, `columns/[slug]/publish/**`
  - 민감 관리자 페이지: `src/app/(builder)/[locale]/admin-builder/{backups,custom-code,domains,inbox,members}/page.tsx`, `bookings/dashboard/page.tsx`, `src/lib/builder/admin-nav/**`
- 문제 설명: 수정 전 일부 publish mutation은 기본 `edit-pages` 권한에 의존했고, 위 관리자 페이지들은 서버 렌더링 전에 대응 권한을 매번 확인하지 않았다. 따라서 제한된 빌더 계정이 직접 URL/API를 호출하면 실제 publish 또는 예약·회원·도메인·백업·대화 데이터가 있는 화면에 접근할 수 있었다. 메뉴를 숨기는 것만으로는 이를 막지 못한다.
- 위험도: **High**
- 실제 악용 조건: 공격자가 유효하지만 `publish`, `settings`, `manage-bookings`, `manage-users` 또는 `manage-contacts` 권한이 없는 빌더 계정을 가진 경우
- 수정 내용: 6개 publish route에 명시적 `permission: 'publish'`를 적용했다. 6개 민감 화면은 `requireBuilderPagePermission()`으로 서버에서 차단하고, admin navigation도 `requirePermission` 기반으로 필터링한다.
- 수정 후 검증 방법: publish route와 page-permission focused test, `npm run security:builder-routes` 통과를 확인한다. 이번 focused suite는 publish·page-permission을 포함해 **200 passed / 1 skipped**였다.
- 추가 수동 확인 필요 여부: **예.** Preview에서 실제 권한이 다른 계정으로 URL 직접 접근과 publish 거부(403)를 확인해야 한다.

### A-3. 내부 알림 생성 신뢰 판정과 저장 링크 주입 — 수정 완료

- 대상 파일 또는 기능: `src/app/api/builder/notifications/route.ts`, `src/lib/builder/notifications/notification-link.ts`, `src/lib/builder/notifications/notification-store.ts`, `src/components/builder/notifications/NotificationInbox.tsx`
- 문제 설명: 수정 전 내부 알림 POST는 `Origin`/`Referer` 문자열에 Host가 포함되면 내부 요청으로 인정했다. URL parser의 정확한 origin 비교가 아니어서 공격자가 조작한 host substring으로 신뢰 판정을 우회할 수 있었다. 알림의 `link`도 그대로 저장되고 클라이언트가 `window.location.href`에 사용해 외부 URL이나 위험 scheme으로 이동시킬 수 있었다.
- 위험도: **High**
- 실제 악용 조건: 공격자가 알림 POST route에 접근해 조작한 Origin/Referer와 link를 보내고, 빌더 사용자가 생성된 알림을 여는 경우
- 수정 내용:
  - `BUILDER_INTERNAL_NOTIFY_SECRET`이 없으면 fail-closed한다.
  - `x-internal-source`를 timing-safe exact comparison으로 검증한다.
  - JSON content type만 허용한다.
  - link는 길이·제어문자·backslash·protocol-relative·반복 URL decoding을 검사하고 현재 사이트의 root-relative path만 허용한다.
  - 생성 시, 저장소 읽기 시, 클라이언트 이동 직전에 방어적으로 다시 검사한다.
- 수정 후 검증 방법: 알림 route와 `notification-link` 테스트에서 host substring 우회, secret 없음·불일치, 외부·인코딩·이중 인코딩 URL, 제어문자, 위험 scheme을 거부하는지 확인한다.
- 추가 수동 확인 필요 여부: **예.** production/preview에 서로 분리된 고엔트로피 `BUILDER_INTERNAL_NOTIFY_SECRET`이 설정됐는지 확인해야 한다.

### A-4. 알림 audience 간 객체 접근권한 누락 — 수정 완료

- 대상 파일 또는 기능: `src/app/api/builder/notifications/route.ts`, `src/app/api/builder/notifications/[id]/route.ts`, `src/lib/builder/notifications/{notification-model,notification-store}.ts`
- 문제 설명: 수정 전 로그인한 빌더 사용자는 알림 ID를 알면 다른 이메일·역할 대상 알림을 조회하고 읽음 처리하거나 삭제할 수 있었다. 목록과 bulk 읽음 처리에도 현재 principal·role 범위가 강제되지 않았다.
- 위험도: **High**
- 실제 악용 조건: 공격자가 제한된 빌더 계정을 가지고 다른 audience의 알림 ID를 추측하거나 획득한 경우
- 수정 내용: 서버에서 현재 username과 resolved role을 audience scope로 만들고 목록, 단건 읽음, 일괄 읽음, 삭제마다 검사한다. 대상이 아니면 403을 반환한다.
- 수정 후 검증 방법: `src/lib/builder/notifications/__tests__/notification-store-audience.test.ts`와 notification route 테스트에서 cross-role/cross-email 조회·수정·삭제 거부를 확인한다.
- 추가 수동 확인 필요 여부: **아니오.** 역할 resolver의 실제 운영 역할 데이터는 A-2의 Preview matrix에서 함께 확인한다.

### A-5. 공개 범용 폼의 클라이언트 제어 schema·수신자·전달 설정 — 수정 완료

- 대상 파일 또는 기능: `src/app/api/forms/submit/route.ts`, `src/lib/builder/forms/form-engine.ts`
- 문제 설명: 수정 전 공개 요청이 `formName`, 전달 방식, 이메일 수신자, webhook, auto-reply, captcha 설정과 제출 필드를 사실상 제어할 수 있었다. 유효한 발송·webhook 설정이 있는 배포에서는 사이트 메일 인프라의 relay, 허용된 외부 URL로의 서버 요청, 임의 auto-reply 또는 저장 schema와 다른 데이터 제출로 이어질 수 있었다.
- 위험도: **High**
- 실제 악용 조건: 공개 form route와 활성 이메일 전달/webhook 설정에 접근하고 rate limit 안에서 조작 요청을 보낼 수 있는 경우
- 수정 내용:
  - 안전한 `formId`를 필수로 받고 저장된 서버 schema가 없으면 404로 종료한다.
  - schema name, field ID 중복·길이·제어문자, 허용 필드 수와 전체 문자 수를 검사한다.
  - 선언되지 않은 필드를 거부하고 captcha·webhook·auto-reply를 저장 schema에서만 읽는다.
  - 상담 이메일 수신자는 서버에서 `wei@hoveringlaw.com.tw`로 고정한다.
  - 사용자가 입력한 메일은 schema가 `email`로 선언한 필드일 때만 검증 후 `Reply-To`에 사용한다.
  - Origin/Referer CSRF 보조 검증, IP rate limit, HTML escaping, CRLF 차단을 유지·강화했다.
  - 첨부는 서버 저장 파일을 다시 읽어 signature·MIME·magic byte·field 정책을 재검증한다.
- 수정 후 검증 방법: `src/app/api/forms/__tests__/submit-route.test.ts`에서 미존재/불일치 schema, unknown field, 조작 수신자·webhook·captcha·auto-reply, CRLF, 과도한 길이, CSRF, rate limit, signed upload 재검증을 확인한다.
- 추가 수동 확인 필요 여부: **예.** 운영 form schema와 실제 이메일 provider/webhook 목적지는 Preview에서 확인하되 이번 감사처럼 실제 고객 메일은 보내지 않는다.

### A-6. 마케팅 클릭 추적의 임의 외부 redirect — 수정 완료

- 대상 파일 또는 기능: `src/app/api/marketing/track/route.ts`, `src/lib/builder/marketing/marketing-click-signature.ts`, `src/lib/builder/marketing/template-renderer.ts`
- 문제 설명: 수정 전 공개 route의 `u`가 파싱 가능한 HTTP(S) URL이면 token의 목적지 결합 검증 없이 302를 반환해 신뢰 도메인을 외부 redirect 경유지로 사용할 수 있었다.
- 위험도: **Medium**
- 실제 악용 조건: 공격자가 악성 외부 URL을 넣은 `tseng-law.com/api/marketing/track` 링크를 피해자가 열도록 유도하는 경우
- 수정 내용: token과 정규화된 정확한 목적지를 domain-separated HMAC으로 결합하고 timing-safe 검증한다. secret·서명 없음, token/URL 변조, 비 HTTP(S)는 400으로 fail-closed한다.
- 수정 후 검증 방법: route, signature, template renderer 테스트에서 유효 서명만 302이고 변조·무서명·위험 protocol은 analytics 기록 전에 거부되는지 확인한다.
- 추가 수동 확인 필요 여부: **예.** Vercel에 전용 `MARKETING_TRACKING_SECRET`을 설정하고 Preview에서 새 캠페인 링크 1건을 확인해야 한다.

### A-7. 영향 범위에 포함된 Next.js·Vitest 버전 — 수정 완료, 배포 전

- 대상 파일 또는 기능: `package.json`, `package-lock.json`, Next App Router request API 사용처
- 문제 설명: 기존 `next@14.2.35`는 검토한 2026년 July advisory의 영향 범위에 있었고, 기존 `vitest@3.2.4`는 외부에 노출된 Vitest UI/API 서버 조건에서 악용 가능한 `<3.2.6` advisory 범위였다. 버전만으로 모든 advisory가 이 사이트에서 재현된다고 단정하지 않았지만 사용 버전 자체는 영향 범위에 포함됐다.
- 위험도: **Medium**
- 실제 악용 조건: advisory별 RSC·이미지 최적화·rewrite/custom server 조건 또는 공격자가 접근 가능한 Vitest UI/API 서버가 존재하는 경우
- 수정 내용: Next.js와 `eslint-config-next`를 **15.5.21**, Vitest를 **3.2.6**으로 올리고 Next 15 async request API migration과 dependency 정리를 적용했다.
- 수정 후 검증 방법: `npm ls next eslint-config-next vitest`, `npm audit --omit=dev`, typecheck, 전체 Vitest, 현재 dirty 공유 작업 트리의 `.next-build`에서 수행한 fresh production build, 브라우저와 builder smoke를 함께 확인한다.
- 추가 수동 확인 필요 여부: **예.** production은 아직 배포되지 않았으므로 Preview 승인과 운영 배포 후 버전을 다시 확인해야 한다. Vitest UI/API는 외부 네트워크에 공개하지 않는다.

### A-8. 공개 상태 변경 요청의 CSRF Origin 검증과 오류 정보 노출 — 수정 완료

- 대상 파일 또는 기능: 공개 review·live-chat·booking·experiment·form tracking/upload·marketing subscribe·member login 등 상태 변경 route와 `src/lib/builder/security/csrf.ts`, 공개 error contract
- 문제 설명: 수정 전 일부 공개 POST endpoint는 브라우저 기반 cross-origin 요청을 일관되게 거부하지 않았고, 예외 경로에서 내부 storage/provider 오류가 응답으로 노출될 수 있었다. 이 두 조건은 각각 타 사이트의 상태 변경 유도와 내부 구현 정보 노출 위험을 만들었다.
- 위험도: **Medium**
- 실제 악용 조건: 피해자가 같은 사이트의 관련 cookie/세션을 가진 상태에서 악성 origin의 요청을 보내거나, 공격자가 의도적으로 persistence/provider 예외를 유발할 수 있는 경우
- 수정 내용: 검토한 공개 mutation route에 `validateCsrf()`의 Origin/Referer 보조 검증을 적용하고, review 및 공개 error contract는 안정된 public code/message만 반환하도록 redaction을 적용했다. 실패 세부 정보는 서버 로그의 안전한 error kind로 제한했다.
- 수정 후 검증 방법: CSRF mismatch가 rate-limit·저장보다 먼저 거부되는 route test와 review persistence failure redaction, builder home/column error-contract 테스트를 실행했다. focused suite **200 passed / 1 skipped**에 포함된다.
- 추가 수동 확인 필요 여부: **예.** Preview에서 실제 same-origin form, booking, review, live-chat 흐름이 허용되고 외부 origin은 거부되는지 확인해야 한다.

### A-9. Blob 기반 공유 상태의 read-modify-write 경합 — 수정 완료

- 대상 파일 또는 기능: `src/lib/builder/{experiments,notifications}/**`, `src/lib/builder/bookings/{storage,slot-lock}.ts`, `src/app/api/booking/{book,cancel}/route.ts`
- 문제 설명: 수정 전 서로 다른 serverless instance가 동일한 실험 지표·알림·예약 슬롯/결제 claim을 동시에 갱신할 때 plain read-modify-write로 인해 손실 갱신, 중복 예약 또는 이전 소유자의 해제가 발생할 수 있었다.
- 위험도: **Medium**
- 실제 악용 조건: 서로 다른 instance에서 동시에 같은 실험, 알림, 예약 슬롯 또는 결제 intent를 갱신하는 경우
- 수정 내용: 실험 및 알림 저장은 Blob ETag CAS(로컬은 직렬 CAS)를 사용하고, 예약은 create-only 분산 lease·소유자 capability 기반 release/renew·ETag CAS payment claim·cancel 재읽기를 사용한다. malformed/stale lease는 free slot으로 간주하지 않는다.
- 수정 후 검증 방법: experiment metric CAS, notification CAS/audience, booking slot-lock/payment-claim/book/cancel focused tests를 실행했다. focused suite **200 passed / 1 skipped**에 포함된다.
- 추가 수동 확인 필요 여부: **예.** 실제 Vercel Blob으로 두 동시 요청을 보내는 Preview 부하가 아닌 통제된 concurrency smoke를 수행해야 한다.

---

## B. 보안 개선 권고 및 확인된 품질 결함

### B-1. CSP nonce/hash 전환 — 잔여 권고

- 대상 파일 또는 기능: `next.config.mjs`
- 문제 설명: `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, frame 제한과 운영 `unsafe-eval` 제거는 적용됐지만 Next bootstrap·빌더 호환을 위해 `script-src 'unsafe-inline'`이 남아 있다.
- 위험도: **Medium**
- 실제 악용 조건: 별도의 HTML/스크립트 주입 취약점이 생기고 inline script 실행 지점까지 도달하는 경우. 이번 감사에서 그런 공개 XSS는 확인되지 않았다.
- 수정 내용: 현재 기능이 깨지지 않는 범위의 보안 헤더를 적용하고 nonce 전환은 강제하지 않았다.
- 수정 후 검증 방법: Preview에서 nonce CSP를 먼저 Report-Only로 적용해 public/admin/builder 및 Maps/YouTube/Vimeo 위반을 정리한 뒤 enforced 정책으로 전환한다.
- 추가 수동 확인 필요 여부: **예.**

### B-2. 업로드 용량·보유·악성코드 정책 — 기본 방어 구현, 운영 정책 권고

- 대상 파일 또는 기능: `src/app/api/forms/uploads/**`, `src/lib/builder/forms/uploads.ts`
- 문제 설명: 현재 공개 다운로드는 bearer URL이 아니다. 업로드 경로·만료 시각과 결합된 HMAC signed URL을 사용하며 기본 만료는 **15분**, production signing secret이 없으면 fail-closed한다. 다만 범용 surface의 50MB 상한, 외부 악성코드 스캐너, 자동 보유기간 삭제는 운영 정책이 더 필요하다.
- 위험도: **Medium**
- 실제 악용 조건: 허용 형식 안의 악성 문서, 대용량 업로드 남용, 장기 보관 또는 운영 secret 관리 실패
- 수정 내용: MIME·확장자·magic byte, active SVG, UUID 파일명, path traversal, 서명·만료·timing-safe 검증과 관리자 권한 fallback을 적용했다. 초기 상담 UI에는 민감 문서를 보내지 말라는 안내가 있다.
- 수정 후 검증 방법: signed URL 유효/변조/만료 테스트와 실제 상담 form의 첨부 노출 여부를 확인하고 보유기간 purge·scanner를 격리 환경에서 통합 테스트한다.
- 추가 수동 확인 필요 여부: **예.**

### B-3. 예약 관리 token의 전용 secret 분리 — 잔여 권고

- 대상 파일 또는 기능: `src/lib/builder/bookings/manage-token.ts`, Vercel production environment variables
- 문제 설명: 현재 production metadata에는 전용 `BOOKING_MANAGE_TOKEN_SECRET`이 없었다. 코드는 이 값이 없을 때 강도 32 byte 이상인 `CMS_SESSION_SECRET`, 이어서 `NEXTAUTH_SECRET`을 server-only fallback으로 사용하고, 어느 것도 충분히 강하지 않으면 production에서 발급은 throw·검증은 null로 fail-closed한다. 따라서 현 코드에서 무서명/약한 기본 secret으로 발급되는 문제는 확인되지 않았지만, 기능별 key separation은 권장된다.
- 위험도: **Low**
- 실제 악용 조건: fallback secret이 유출·예상보다 약하거나, 공용 CMS session secret의 회전 범위가 booking 관리 링크까지 넓어지는 경우
- 수정 내용: fallback의 최소 길이와 production fail-closed 동작을 적용했다. 이번 감사에서는 기존 secret을 출력·회전하지 않았다.
- 수정 후 검증 방법: `manage-token.test.ts`에서 dedicated/fallback/약한/missing secret 행동을 확인한다. 운영자는 전용 32 byte 이상 secret을 추가한 뒤 기존 booking link의 회전·만료 방식을 Preview에서 확인한다.
- 추가 수동 확인 필요 여부: **예.** fallback secret의 실제 길이·엔트로피와 전용 secret 추가 시점은 secret 값을 노출하지 않고 운영자가 확인해야 한다.

### B-4. SEO 공개 정책 불일치 4종 — 수정 완료

- 대상 파일 또는 기능: `src/app/sitemap.ts`, `src/lib/builder/seo/seo-model.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`
- 문제 설명:
  1. sitemap의 49개 non-JA entry가 실제 JA URL이 있는데도 reciprocal `ja` hreflang을 누락했다.
  2. `/ko/reviews`, `/zh-hant/reviews`는 sitemap 제외 정책과 달리 indexable이었다.
  3. robots의 admin disallow가 비-localized 경로만 포함했다.
  4. `llms.txt`의 언어·핵심 링크가 ko/zh-hant에만 치우쳤다.
- 위험도: **Informational**
- 실제 악용 조건: 직접 보안 악용 조건은 없지만 검색 엔진·AI crawler에 상충된 index 정책과 관리자 경로 신호를 제공하는 경우
- 수정 내용: 실제 JA URL이 존재할 때만 ja alternate를 추가하고, localized/underlying `reviews` slug를 전 locale noindex로 통일했다. root와 네 locale의 admin-builder/admin-consultation robots disallow, 네 locale root와 핵심 링크 5개를 `llms.txt`에 일관되게 적용했다.
- 수정 후 검증 방법: 관련 focused 테스트와 production build를 통과시켰다. 배포 후 sitemap/robots/llms 실제 응답은 별도로 확인한다.
- 추가 수동 확인 필요 여부: **예.** 배포 후 Search Console과 실제 `robots.txt`, `sitemap.xml`, `llms.txt` 응답을 확인해야 한다.

### B-5. 개발 도구 dependency graph의 잔여 advisory — 분리 관리 권고

- 대상 파일 또는 기능: Storybook, LHCI, Vite, ESLint/Vitest 관련 개발 의존성 graph
- 문제 설명: 개발 도구의 transitive advisory는 production runtime 취약점과 구분해야 한다. 이번 갱신에서 `npm audit --omit=dev --json`은 production dependency **0건**을 보고했다. development graph의 advisory와 실제 노출 여부는 별도 판단이 필요하다.
- 위험도: **Low**
- 실제 악용 조건: 관련 개발 서버나 도구가 공격자 접근 가능한 네트워크에 노출되고 advisory별 취약 기능을 실제 사용하는 경우
- 수정 내용: Next.js 15.5.21과 Vitest 3.2.6을 현재 lockfile에 반영했다. 회귀 위험이 큰 major 일괄 업데이트는 하지 않았다.
- 수정 후 검증 방법: clean install에서 전체 `npm audit --json`을 별도로 실행하고, advisory별 dependency path·실제 실행·네트워크 노출 여부를 확인한 뒤 격리 branch에서 호환 가능한 업데이트와 전체 gate를 재실행한다.
- 추가 수동 확인 필요 여부: **예.**

### B-6. 시네마틱 미디어 성능 릴리스 측정 — 운영 배포·기본 측정 통과, 지속 관찰 권고

- 대상 파일 또는 기능: `src/components/{CinematicOpening,DecorativeAutoplayVideo,HeroMediaBackground,TaiwanHeritageInterlude,HomeCaseResultsSplit}.tsx`, `public/videos/*-v2.*`
- 문제 설명: 현재 코드에는 초기 네트워크를 억제하는 장치가 있고 production-like Lighthouse와 운영 브라우저 검증을 수행했다. 다만 실제 사용자 장치·지역·네트워크의 장기 CWV는 단일 릴리스 측정만으로 확정할 수 없다.
- 위험도: **Informational**
- 실제 악용 조건: 직접 보안 악용 조건은 없다. 느린 모바일 네트워크·CPU에서 초기 오프닝 또는 스크롤 진입의 사용자 체감이 나빠질 수 있다.
- 수정 내용: 오프닝만 eager mount하고 나머지 영상은 IntersectionObserver·idle 조건에서 가까운 구간에만 mount한다. 화면 밖 영상은 pause하며, reduced-motion 또는 Save-Data에서는 poster fallback을 유지한다. 각 표면은 MP4/WebM 중 브라우저가 선택한 하나만 요청한다. 모바일 MP4는 오프닝 약 2.19MB, 법원 약 0.89MB, 삼합원 약 1.44MB, 법정 약 0.49MB다.
- 수정 후 검증 방법: production-like mobile Lighthouse에서 반복 측정 편차는 있었으나 최적 확인값은 performance 74, LCP 약 4.8초였다. 운영 브라우저 QA에서 데스크톱·모바일의 poster/video 전환, one-scroll handoff, 후속 구간 진입, reduced-motion 계약을 확인했다.
- 추가 수동 확인 필요 여부: **예.** Vercel Analytics 또는 실제 사용자 RUM으로 p75 LCP/INP/CLS, CDN cache와 전송량을 지속 관찰해야 한다.

---

## C. 문제 발견 없음

### C-1. 공개 회원가입 노출

- 대상 파일 또는 기능: `src/app/api/members/signup/route.ts`, 공개 회원 메뉴
- 문제 설명: 공개 회원가입은 존재하지 않는다. route는 네 locale 모두 항상 403 `public_signup_disabled`와 `private, no-store`, `noindex, noarchive`를 반환하며 계정은 사무소 확인 후 발급한다.
- 위험도: **Informational**
- 실제 악용 조건: 검토한 현재 route에는 공개 계정 생성 조건이 없다.
- 수정 내용: 공개 가입 UI와 route를 비활성 상태로 통일했다.
- 수정 후 검증 방법: `src/app/api/members/signup/__tests__/route.test.ts`에서 locale별 403과 엔진 비호출을 유지한다.
- 추가 수동 확인 필요 여부: **아니오.**

### C-2. 회원 비밀번호·세션·쿠키·로그아웃

- 대상 파일 또는 기능: `src/lib/builder/members/members-engine.ts`, member login/logout/me route
- 문제 설명: 비밀번호는 bcrypt cost 10으로 저장·검증하며 평문 또는 단독 SHA-256 저장이 아니다. 로그인 성공 시 새 UUID 세션을 발급한다. 쿠키는 HttpOnly, SameSite=Lax, root Path, 만료시간을 가지며 production에서 Secure다. 로그아웃은 서버 세션을 폐기한다.
- 위험도: **Informational**
- 실제 악용 조건: 검토한 구현에서 고정 세션·평문 비밀번호·클라이언트만의 로그아웃 조건은 확인되지 않았다.
- 수정 내용: 없음.
- 수정 후 검증 방법: members engine과 login/logout route 테스트를 유지한다.
- 추가 수동 확인 필요 여부: **아니오.**

### C-3. 로그인 후 open redirect

- 대상 파일 또는 기능: `src/lib/safe-next.ts`, `src/app/[locale]/login/page.tsx`
- 문제 설명: URL parser와 고정 가상 origin을 사용하고 현재 locale의 내부 root-relative path만 허용한다. absolute/protocol-relative URL, backslash, 제어문자, 이중 인코딩, 잘못된 percent encoding과 다른 locale을 거부한다.
- 위험도: **Informational**
- 실제 악용 조건: 검토한 login 경로에서 외부 origin 이동 조건을 발견하지 못했다.
- 수정 내용: 실패 시 정확히 `/{locale}`로 이동하도록 공용 helper를 적용했다.
- 수정 후 검증 방법: 42개 safe-next 사례를 유지한다.
- 추가 수동 확인 필요 여부: **아니오.**

### C-4. 공개 검색의 SQL injection·반사형 XSS

- 대상 파일 또는 기능: `src/app/api/search/route.ts`, `src/app/[locale]/search/page.tsx`, FAQ 검색
- 문제 설명: SQL 문자열을 조립하지 않고 파일/Blob index를 메모리에서 검색한다. 검색어와 결과는 React escaping을 받고 칼럼 HTML은 allowlist sanitizer를 거친다. 검색어는 Unicode code point 기준 200자, API rate limit과 결과 수 제한을 적용한다.
- 위험도: **Informational**
- 실제 악용 조건: 검토한 경로에서 SQL injection이나 검색어 script 실행 조건을 발견하지 못했다.
- 수정 내용: SSR/API의 200 code-point 상한과 input `maxLength`를 통일했다.
- 수정 후 검증 방법: HTML payload, 따옴표, Unicode, URL encoding 사례를 유지한다.
- 추가 수동 확인 필요 여부: **아니오.**

### C-5. tracked secret과 공개 환경변수

- 대상 파일 또는 기능: `.gitignore`, `.env.example`, Git tracked files, `NEXT_PUBLIC_*` 사용처
- 문제 설명: 실제 `.env`와 `.vercel`은 ignore되고 tracked 환경 파일에는 실제 secret 값이 없다. `NEXT_PUBLIC_*`는 site URL, Sentry DSN, captcha site key, Stripe publishable key 등 공개 용도였다.
- 위험도: **Informational**
- 실제 악용 조건: 현재 tracked 파일에서 실제 자격 증명을 발견하지 못했다.
- 수정 내용: 기존 secret을 임의로 폐기·변경하지 않았다.
- 수정 후 검증 방법: CI secret scan과 `git ls-files '.env*'` 검사를 유지한다.
- 추가 수동 확인 필요 여부: **예.** 전체 Git 이력과 Vercel의 실제 값은 별도 scanner·운영자 확인이 필요하다.

### C-6. 상담 이메일 header injection과 수신자 고정

- 대상 파일 또는 기능: `src/app/api/consultation/submit/route.ts`, `src/lib/email/send-consultation-email.ts`, `src/app/api/forms/submit/route.ts`
- 문제 설명: 범용 form 수신자는 서버에서 `wei@hoveringlaw.com.tw`로 고정되고 사용자가 임의 To/From을 지정할 수 없다. AI 상담 mailer는 server-only recipient 환경변수를 사용하되, 제한된 production 설정 검증에서 active recipient 값이 정확히 `wei@hoveringlaw.com.tw`임을 확인했다. 사용자 이메일은 검증 후 Reply-To에만 쓰며 CRLF, 길이, HTML escaping 검사를 적용한다.
- 위험도: **Informational**
- 실제 악용 조건: 검토한 전달 코드에서 클라이언트 수신자 지정이나 CRLF header 삽입 조건을 발견하지 못했다.
- 수정 내용: 중앙 상수와 고정 수신자 정책을 두 이메일 경로에 적용했다. 설정의 실제 값이나 SMTP credential은 출력·저장하지 않았다.
- 수정 후 검증 방법: 조작 수신자, CRLF, 잘못된 이메일, 긴 입력, HTML payload 테스트를 유지한다.
- 추가 수동 확인 필요 여부: **예.** 실제 provider의 From/Reply-To/DKIM 정렬은 D-3에서 확인한다.

### C-7. 현재 로컬 공개 상담 채널의 KakaoTalk·LINE 노출

- 대상 파일 또는 기능: `src/data/contact-page-content.ts`, public CTA/footer/contact component, `src/app/api/line/route.ts`, `src/lib/builder/publish-gate/consultation-channel-checks.ts`
- 문제 설명: 현재 소스의 기본 공개 contact/CTA/footer는 이메일을 primary 상담 채널로 사용하고 KakaoTalk·LINE 상담 링크를 노출하지 않는다. `src/app/api/line/route.ts`의 GET/POST는 404로 비활성화됐다. publish-gate에는 새 상담 채널 URL·문구를 검사하는 코드가 있다.
- 위험도: **Informational**
- 실제 악용 조건: 검토한 현재 소스와 승격된 운영 공개 표면에서는 노출 조건을 발견하지 못했다.
- 수정 내용: 공개 channel 제거와 fail-closed publish blocker를 적용했다. 공유 위젯·향후 builder catalog의 provider type 자체는 상담 연결이 아니므로 삭제하지 않았다.
- 수정 후 검증 방법: source-level public QA와 publish-gate 테스트에서 `pf.kakao.com`, `line.me`, `lin.ee`, provider node와 인코딩 우회를 확인했다. 운영 네 locale HTML에서 상담 channel URL이 없고 `/api/line`이 404인 것을 재확인했다.
- 추가 수동 확인 필요 여부: **아니오.** 향후 builder 편집으로 재도입하지 않도록 publish gate는 유지한다.

### C-8. CI Playwright harness host·attestation 계약

- 대상 파일 또는 기능: `.github/workflows/builder-quality.yml`, `.github/workflows/builder-visual.yml`, `scripts/visual-baselines-docker.sh`, `scripts/ci-playwright-qa-harness.test.mjs`
- 문제 설명: 이전 문서의 host/attestation 불일치 지적은 현재 코드에 맞지 않았다. workflow와 visual script는 attested isolated QA harness를 사용하고, harness가 canonical `127.0.0.1` origin으로 교체한다.
- 위험도: **Informational**
- 실제 악용 조건: 검토한 현재 계약에서는 CI가 일반 runtime을 검증하는 우회 조건을 발견하지 못했다.
- 수정 내용: release-config CI gate와 exact-host/attestation contract를 적용했다.
- 수정 후 검증 방법: `npm run test:release-config` **7/7 통과**(두 workflow, visual script, LHCI lifecycle, release-config trigger, hardened header config, Vercel output-directory contract)를 확인했다.
- 추가 수동 확인 필요 여부: **예.** GitHub Actions의 실제 1회 실행과 artifact teardown은 원격 CI에서 확인해야 한다.

### C-9. Review token과 production Blob fail-closed 동작

- 대상 파일 또는 기능: `src/lib/builder/security/review-tokens.ts`, review-session route, `src/lib/reviews/storage.ts`, Vercel production metadata
- 문제 설명: review token은 payload에 target/audience를 담지 않고 서명 후 서버 session으로 해석하며, 만료·revocation·payload/session expiry 일치를 확인한다. production에서 `BUILDER_REVIEW_SECRET`이 없으면 발급은 실패하고 public verification은 null로 끝나므로 개발용 default로 fail-open하지 않는다. production에 `BLOB_READ_WRITE_TOKEN`이 구성된 것도 확인했다.
- 위험도: **Informational**
- 실제 악용 조건: 검토한 코드에 서명 없는 review token 수락 또는 production file fallback 조건은 발견하지 못했다.
- 수정 내용: secret-missing verification의 public exception redaction과 token/session coherence 검사를 적용했다.
- 수정 후 검증 방법: `review-tokens.test.ts`의 missing-secret, expiry, signature, session coherence 사례와 focused suite 통과를 확인한다.
- 추가 수동 확인 필요 여부: **예.** `BUILDER_REVIEW_SECRET`이 현재 production에 없으므로 D-9의 운영 결정 후 실제 review-link 발급/폐기 흐름을 Preview에서 확인해야 한다.

### C-10. 실험·알림·예약의 동시성 방어

- 대상 파일 또는 기능: `src/lib/builder/{experiments,notifications,bookings}/**`, `src/app/api/booking/{book,cancel}/route.ts`
- 문제 설명: CAS/lease 보완 후, 검토한 현재 경로에서 stale owner가 새 lease를 해제하거나 동시 metric/notification write가 조용히 덮어써지는 조건은 발견하지 못했다.
- 위험도: **Informational**
- 실제 악용 조건: 현재 테스트 모델에서 owner token/ETag CAS 충돌과 cancellation 재읽기는 안전하게 거부하거나 재시도한다.
- 수정 내용: 없음(현재 구현 확인).
- 수정 후 검증 방법: `notification-store-cas`, `metric-idempotency`, `slot-lock`, `payment-intent-claim`, booking book/cancel focused tests를 실행했다.
- 추가 수동 확인 필요 여부: **예.** 실제 Blob multi-instance smoke는 D-6과 함께 Preview에서 수행해야 한다.

---

## D. 코드만으로 확인할 수 없어 수동 검사가 필요한 항목

### D-1. Vercel Preview 보호·환경 분리·Node runtime

- 대상 파일 또는 기능: Vercel project settings, Preview Deployment, production/preview/development 환경변수
- 문제 설명: Preview Protection, 오래된 preview 공개 여부, 환경별 secret 분리와 실제 Node runtime은 저장소만으로 확정할 수 없다. CI 기준은 Node 24인데 로컬 검증 환경과 Vercel 설정의 일치 여부를 별도로 확인해야 한다.
- 위험도: **High**
- 실제 악용 조건: 관리 화면이 포함된 preview가 공개되거나 preview/dev secret이 production과 공유되는 경우
- 수정 내용: 코드의 QA isolation과 CI attestation은 강화했지만 Vercel 설정은 변경하지 않았다.
- 수정 후 검증 방법: Vercel에서 Preview Deployment Protection, 오래된 URL, 환경별 변수 scope를 확인하고 지원되는 `package.json` engines/프로젝트 runtime으로 **Node 24**를 명시적으로 고정한다.
- 추가 수동 확인 필요 여부: **예.**

### D-2. 관리자 MFA와 운영 계정 정책

- 대상 파일 또는 기능: Vercel/IdP, 관리자 계정, Basic Auth와 빌더 session secret
- 문제 설명: 애플리케이션 권한 모델은 확인했지만 실제 운영 관리자 MFA, 비밀번호 재사용 방지, 퇴사자 회수 절차는 코드로 확인할 수 없다.
- 위험도: **High**
- 실제 악용 조건: 관리자 자격 증명 탈취·재사용·피싱
- 수정 내용: 추측으로 인증 체계를 교체하지 않았다.
- 수정 후 검증 방법: Vercel/IdP 수준 MFA와 관리자 목록·권한 최소화·정기 회수를 적용하고 전용 `BUILDER_ADMIN_SESSION_SECRET`을 확인한다.
- 추가 수동 확인 필요 여부: **예.**

### D-3. SPF·DKIM·DMARC·SMTP From 정렬

- 대상 파일 또는 기능: `hoveringlaw.com.tw` DNS, SMTP/provider 설정, `src/lib/email/send-consultation-email.ts`
- 문제 설명: 코드에는 SMTP host/user/password 및 notification recipient 환경변수 사용처가 있으나, 실제 발송 provider, DNS record, DKIM selector, From domain의 provider 허용·서명 여부는 저장소만으로 확인할 수 없다. DNS 상태나 provider를 설정됐다고 단정하지 않는다.
- 위험도: **Medium**
- 실제 악용 조건: 실제 SPF/DKIM/DMARC 부재·오정렬, 허용되지 않은 From 또는 과도한 provider key 권한
- 수정 내용: DNS와 실제 메일 계정은 변경하지 않았고 실제 메일도 발송하지 않았다.
- 수정 후 검증 방법:
  1. 실제 발송 provider와 From domain 확인
  2. 활성 DKIM selector와 서명 결과 확인
  3. 모든 정상 발송원을 포함한 단일 SPF 확인
  4. DMARC aggregate 수신 준비 후 `p=none`
  5. 정상 메일을 관찰하며 `quarantine`, 마지막으로 `reject` 순서로 강화
  6. 통제된 Preview recipient 1건에서 To/From/Reply-To와 SPF/DKIM/DMARC 결과 확인
- 추가 수동 확인 필요 여부: **예.**

### D-4. 개인정보 처리자·국외 처리·보유기간·사고 대응

- 대상 파일 또는 기능: `src/data/legal-pages.ts`, Vercel/OpenAI/SMTP/회계·번역 provider 계약, DB·메일·백업 운영
- 문제 설명: 코드로 실제 processor 법인명·처리 국가·region, 항목별 보유기간, backup/mail 삭제, 개인정보 담당자, 유출 통지 절차를 확정할 수 없다.
- 위험도: **High**
- 실제 악용 조건: 실제 처리와 공개 방침이 다르거나 정보주체 요청·사고가 발생하는 경우
- 수정 내용: 확인되지 않은 사실은 “운영자 확인 필요”로 남기고 초기 상담 민감정보 경고를 적용했다.
- 수정 후 검증 방법: 운영자·변호사·개인정보 담당자가 실제 계약, cross-border 처리, 사건·상담·로그·메일·백업 retention과 파기 절차를 확인해 방침을 승인한다.
- 추가 수동 확인 필요 여부: **예.**

### D-5. 예약 OAuth state의 single-use·session binding

- 대상 파일 또는 기능: `src/app/api/builder/bookings/calendar-sync/oauth-callback/route.ts`, Google/Outlook OAuth 설정
- 문제 설명: callback의 `manage-bookings` 권한은 적용됐지만 OAuth state가 실제 provider flow에서 단일 사용이고 시작 세션과 강하게 결합되는지는 코드·fixture만으로 전체 운영 흐름을 확정하기 어렵다.
- 위험도: **Medium**
- 실제 악용 조건: 유효 state가 재사용되거나 다른 관리자 세션에서 받아들여지는 경우
- 수정 내용: callback 읽기 권한을 `manage-bookings`로 제한했다. OAuth architecture의 대규모 변경은 하지 않았다.
- 수정 후 검증 방법: Preview 전용 OAuth app으로 state 재사용 거부, 시작/완료 세션 불일치 거부, 만료와 provider error 흐름을 확인한다.
- 추가 수동 확인 필요 여부: **예.**

### D-6. 공개·비공개 builder asset architecture

- 대상 파일 또는 기능: 비공개 collection `src/app/api/builder/assets/route.ts`, 공개 binary delivery `src/app/api/builder/assets/[locale]/[...assetPath]/route.ts`, Vercel Blob access 설정, published asset URL
- 문제 설명: 관리자 asset collection에는 인증·`edit-pages` 권한·파일 검증이 적용돼 있다. 반면 published page가 사용하는 binary delivery route는 의도적으로 익명 접근을 유지하며 이번 granular GET 권한 보완 대상이 아니다. production `BLOB_READ_WRITE_TOKEN` 구성은 확인했지만, authoring asset과 공개 publish 자산의 실제 lifecycle·bucket 보유/삭제 정책은 코드·환경변수 metadata만으로 확정할 수 없다.
- 위험도: **Medium**
- 실제 악용 조건: 미공개 authoring asset이 공개 URL로 노출되거나 private asset과 published asset의 보유·삭제 정책이 섞이는 경우
- 수정 내용: 기존 공개 URL 구조를 추측으로 변경하지 않았다.
- 수정 후 검증 방법: Preview에서 draft-only asset, published asset, 삭제·복구, signed/private access와 Blob bucket 정책을 문서화하고 테스트한다.
- 추가 수동 확인 필요 여부: **예.**

### D-7. 실제 CSP·외부 embed·시네마틱 미디어 호환성

- 대상 파일 또는 기능: production/preview browser, `next.config.mjs`, Maps/YouTube/Vimeo/폰트·분석 도구
- 문제 설명: 운영 공개 페이지의 보안 헤더·영상·폰트·기본 동작은 검증했다. 다만 로그인이나 별도 provider credential이 필요한 모든 관리자 embed와 외부 provider 흐름은 이 안전한 공개 QA 범위에서 확정할 수 없다.
- 위험도: **Medium**
- 실제 악용 조건: 누락 origin으로 기능이 차단되거나 임시 대응으로 과도하게 넓은 origin/`unsafe-inline`을 추가하는 경우
- 수정 내용: 확인된 origin만 허용하고 영상은 외부 provider가 아닌 local WebM/MP4/poster로 제공한다.
- 수정 후 검증 방법: 운영 네 locale home/contact에서 CSP/header, 폰트, 영상 pause/play/replay, one-scroll과 mobile layout을 확인했다. 인증·provider 연동 관리자 화면은 유효한 test credential로 별도 확인한다.
- 추가 수동 확인 필요 여부: **예.**

### D-8. 운영 배포와 검증 스냅샷 일치 — 해소 완료

- 대상 파일 또는 기능: production `https://tseng-law.com`, Vercel deployment/commit 연결, `src/app/api/line/route.ts`
- 문제 설명: 감사 중 기존 production과 로컬의 불일치를 발견했으나, clean snapshot을 production candidate로 배포·검증한 뒤 운영 alias로 승격해 해소했다.
- 위험도: **Informational** (해소 전 운영 위험도 High)
- 실제 악용 조건: 해소 전에는 이전 public API·CTA·의존성 상태가 계속 노출될 수 있었다. 현재 운영 probe에서는 해당 조건을 재현하지 못했다.
- 수정 내용: Vercel 환경에서 `.next` output directory를 사용하도록 `next.config.mjs`를 수정하고 회귀 테스트를 추가했다. 최종 candidate `dpl_91itCHGyybBDKPqneiyHV5DT9nJm`을 `tseng-law.com`으로 승격했다.
- 수정 후 검증 방법: `/ko`, `/zh-hant`, `/en`, `/ja` 200, `/api/line` 404, 네 locale title/OG/mailto, KakaoTalk·LINE URL 부재, CSP/HSTS/nosniff/referrer/permissions/frame/COOP/CORP header, 핵심 WebM·OG asset 200을 확인했다. 네 locale × desktop/mobile 최종 브라우저 QA도 통과했다.
- 추가 수동 확인 필요 여부: **아니오.** 향후 배포마다 동일한 release gate와 post-deploy smoke를 반복한다.

### D-9. Review-link 발급 secret의 운영 결정

- 대상 파일 또는 기능: Vercel production `BUILDER_REVIEW_SECRET`, `src/lib/builder/security/review-tokens.ts`
- 문제 설명: production metadata에서 `BUILDER_REVIEW_SECRET`은 구성되지 않았다. 현재 코드는 이를 안전하지 않은 기본값으로 대체하지 않아 public review verification은 fail-closed하지만, 관리자 review-link 발급 기능은 의도적으로 사용할 수 없다.
- 위험도: **Medium**
- 실제 악용 조건: 운영자가 외부 client review-link 기능을 사용하려 하거나, secret을 추가할 때 미발급/기존 link 회전 정책을 정하지 않는 경우
- 수정 내용: 코드 변경이나 임의 secret 추가는 하지 않았다.
- 수정 후 검증 방법: 운영자가 별도 고엔트로피 secret을 production/preview에 분리 설정하고, Preview에서 발급·만료·revoke·rotated-secret invalidation을 확인한다. 기능을 사용하지 않을 계획이면 현 fail-closed 상태를 유지한다.
- 추가 수동 확인 필요 여부: **예.** 운영자 결정이 필요하다.

## 3. 문제 발견 없음 요약

- 공개 회원가입: 항상 403으로 비활성화
- 회원 비밀번호·세션·쿠키·로그아웃: 안전한 기본 구현 확인
- login `next` open redirect: parser 기반 차단 확인
- 공개 검색 SQL injection·반사형 XSS: 검토 경로에서 미발견
- tracked secret: 현재 tracked tree에서 미발견
- 상담 메일 수신자·Reply-To·CRLF: 서버 고정과 검증 확인
- 현재 로컬 default public site: KakaoTalk·LINE 상담 링크 미노출, LINE webhook 404

이 결론은 검토한 코드 경로에 한정한다. 운영 설정·과거 Git 이력·실제 외부 provider는 D 항목처럼 별도 확인이 필요하다.

## 4. 수정한 파일 목록

주요 보안·상담 관련 파일만 묶어 적었다. 전체 디자인·다국어 변경은 실제 Git diff를 기준으로 별도 검토해야 한다.

- 인증·권한
  - `src/lib/builder/security/guard.ts`
  - `src/app/api/builder/members/[memberId]/route.ts`
  - `src/app/api/builder/{settings,dev,ops,bookings,translations,blog,columns,ai-generator}/**`
  - `src/app/api/builder/site/{settings,custom-code,audit,pages,translation-release-*}/**`
- 알림 보안
  - `src/app/api/builder/notifications/route.ts`
  - `src/app/api/builder/notifications/[id]/route.ts`
  - `src/lib/builder/notifications/{notification-link,notification-model,notification-store}.ts`
  - `src/components/builder/notifications/NotificationInbox.tsx`
- 폼·업로드·상담 이메일
  - `src/app/api/forms/submit/route.ts`
  - `src/app/api/forms/uploads/**`
  - `src/lib/builder/forms/{form-engine,uploads}.ts`
  - `src/app/api/consultation/submit/route.ts`
  - `src/lib/email/send-consultation-email.ts`
  - `src/lib/consultation/public-contact.ts`
- redirect·검색·헤더·dependency
  - `src/lib/safe-next.ts`
  - `src/app/api/marketing/track/route.ts`
  - `src/lib/builder/marketing/{marketing-click-signature,template-renderer}.ts`
  - `src/app/api/search/route.ts`
  - `src/app/[locale]/search/page.tsx`
  - `next.config.mjs`
  - `package.json`, `package-lock.json`
- SEO
  - `src/app/sitemap.ts`
  - `src/app/robots.ts`
  - `src/app/llms.txt/route.ts`
  - `src/lib/builder/seo/seo-model.ts`
- 상담 채널·개인정보
  - `src/data/contact-page-content.ts`
  - `src/data/legal-pages.ts`
  - `src/app/api/line/route.ts`
  - public contact/footer/CTA component와 관련 테스트
  - `src/lib/builder/publish-gate/consultation-channel-checks.ts`
- CI·QA
  - `.github/workflows/builder-quality.yml`
  - `.github/workflows/builder-visual.yml`
  - `scripts/start-qa-server.sh`
  - `scripts/visual-baselines-docker.sh`
  - `scripts/ci-playwright-qa-harness.test.mjs`
  - `scripts/qa-site-remediation.mjs`
- 시네마틱 미디어
  - `src/components/{CinematicOpening,TaiwanHeritageInterlude,DecorativeAutoplayVideo,HomeCaseResultsSplit}.tsx`
  - `src/components/HeroMediaBackground.tsx`
  - `public/videos/taiwan-central-mountains-cloud-flight-v2{-mobile}.{webm,mp4}`
  - `public/videos/taichung-courthouse-civic-daylight-v2{-mobile}.{webm,mp4}`
  - `public/videos/taiwan-sanheyuan-modern-daylight-v2{-mobile}.{webm,mp4}`
  - `public/videos/taiwan-courtroom-calm-daylight-v2{-mobile}.{webm,mp4}`

## 5. 보안 수정 내용

- `guardMutation`의 기본 권한이 `edit-pages`임을 명확히 하고 회원 관리에는 `manage-users`를 별도 지정했다.
- 제한된 빌더 계정이 민감 GET API를 읽지 못하도록 기능별 서버 권한을 적용했다.
- 알림 생성은 전용 secret exact comparison만 허용하고 링크를 root-relative로 제한했다.
- 알림 목록·수정·삭제에 principal·role audience 검사를 추가했다.
- 범용 폼은 저장된 서버 schema만 신뢰하고 수신자를 증준외 변호사 이메일로 고정했다.
- 첨부 다운로드는 경로·만료에 결합된 15분 signed URL과 production fail-closed secret을 사용한다.
- 마케팅 redirect는 exact token+URL HMAC 서명이 있어야 동작한다.
- 검색 입력 상한, CSRF 보조 검증, 민감 route cache/noindex와 주요 보안 헤더를 적용했다.
- Next.js 15.5.21과 Vitest 3.2.6을 현재 lockfile에 반영했다. clean release snapshot에서 production dependency audit 0건을 확인했다.
- CI 브라우저 QA를 exact host, 격리 runtime, attested manifest, checksum-safe teardown으로 통일했다.

## 6. 상담 이메일 연결 변경 내용

- 기본 담당자
  - 한국어: **증준외 대만 변호사**
  - 번체중국어: **曾雋崴律師**
  - 상담 이메일: **wei@hoveringlaw.com.tw**
- `src/lib/consultation/public-contact.ts`에서 공개 상수와 네 locale의 URL-encoded subject/body를 관리한다.
- hero, footer, contact와 주요 고의도 상담 CTA의 기본 목적지를 해당 `mailto:`로 통일했다.
- footer/contact에 공식 상담 이메일과 복사 버튼, locale별 복사 성공 안내를 제공한다.
- 연락처와 footer의 사무소 표기는 **4개**(타이베이·타이중·가오슝·핑둥)로 통일했다.
- 초기 문의에는 사건 개요와 연락처만 적고 주민등록번호·여권번호·계좌번호·신분증 원본·전체 증거를 보내지 말라는 경고를 네 locale에 반영했다.
- 전화번호는 상담 primary CTA에서 제거하고 사무소 정보 block에만 남겼다.
- 현재 로컬 public site의 KakaoTalk·LINE 상담 연결은 제거했고 LINE API는 404다.
- publish gate에는 KakaoTalk·LINE 상담 채널 검사 코드가 있으며, 운영 네 locale 공개 HTML에서도 관련 상담 URL이 없음을 확인했다.
- server form과 consultation backend의 수신자는 클라이언트 입력과 무관하게 `wei@hoveringlaw.com.tw`다.
- **운영 확인:** `tseng-law.com`의 네 locale에서 이메일 CTA를 확인했고 KakaoTalk·LINE 상담 URL은 발견되지 않았으며 `/api/line`은 404다.

## 7. 실행한 테스트와 결과

### 최신 릴리스 게이트 증거

- lint: **통과**, warning 0 / error 0
- `npm run typecheck`: **통과**
- 전체 Vitest: **1,116 test files / 8,515 passed / 14 skipped** (총 8,529)
- Next.js **15.5.21** clean production build: **통과**, 정적 페이지 **490/490**
- `npm audit --omit=dev --json`: production dependency vulnerability **0건**
- `npm run test:release-config`: **7/7 통과**
- `npm run security:builder-routes`: 279개 builder route 파일과 273개 mutation handler guard coverage 확인(주석 allowlist 4개 경고)
- 이 감사에서 재실행한 focused security suite: **200 passed / 1 skipped**
- 로컬 브라우저 QA: 네 locale × desktop/mobile **통과**
- 운영 브라우저 QA: 네 locale × desktop/mobile **통과**, 증거 `/tmp/tseng-law-production-qa-evidence-final4`
- production 배포: `dpl_91itCHGyybBDKPqneiyHV5DT9nJm` **READY**, `https://tseng-law.com` 승격 및 post-deploy probe **통과**

### 집중 보안·품질 검증

- safe redirect: 내부 상대경로, 외부/protocol-relative/backslash/인코딩 우회와 locale fallback 확인
- 인증·권한: 비로그인 401, granular permission 미보유 403, cross-member/cross-role 접근 거부, 6개 publish route와 6개 민감 관리자 화면의 server-side permission 확인
- 공개 mutation: review/live-chat/booking/experiment 등의 same-origin CSRF 거부와 public error redaction 확인
- 동시성: review token coherence, experiment CAS, notification audience/CAS, booking lease/payment-claim/cancel 회귀 확인
- 범용 폼: 서버 schema, 고정 수신자, Reply-To, CRLF, 길이, unknown field, CSRF, rate limit, signed upload 검증은 전체 suite에 포함
- security header config와 CI Playwright harness/QA runtime isolation contract: `test:release-config`에 포함되어 통과

### 검증 범위 제한

- 공개 웹 흐름은 로컬·격리 환경과 최종 운영 도메인에서 확인했다.
- Preview는 production Blob token을 의도적으로 전달하지 않아 공개 페이지가 fail-closed 500을 반환했다. 보안을 약화하거나 production token을 Preview에 복사하지 않고, production candidate를 별도 URL에서 검증한 뒤 blue/green 방식으로 승격했다.
- 실제 이메일·결제·webhook 발송, 관리자 MFA/provider credential 흐름, 운영 고객 데이터 변경, Vercel/GitHub Actions의 원격 workflow 실행은 수행하지 않았다.

## 8. 아직 수동으로 확인해야 하는 항목

- Vercel Preview Deployment Protection과 오래된 preview URL
- production/preview/development 환경변수 분리
- Vercel과 CI의 Node 24 고정·일치
- 관리자 MFA와 실제 역할 matrix
- `BUILDER_ADMIN_SESSION_SECRET`, `BUILDER_INTERNAL_NOTIFY_SECRET`, `FORM_UPLOAD_SIGNING_SECRET`, `MARKETING_TRACKING_SECRET`의 존재·분리·회전
- SPF/DKIM/DMARC와 실제 SMTP/provider From 정렬
- 실제 개인정보 처리자, 국외 처리, retention, 삭제·사고 대응
- OAuth state single-use·session binding
- draft/private builder asset과 published public asset의 lifecycle
- CSP nonce 전환과 실제 third-party embed 호환
- clean install 기준 dependency audit의 production/dev 경로와 실제 도구 사용·네트워크 노출 여부
- 실제 provider credential이 필요한 결제·Zoom·calendar·marketing 연동 smoke

## 9. 운영자가 후속으로 확인해야 하는 작업

1. Preview Deployment Protection과 오래된 preview URL의 접근 정책을 확인한다.
2. Node 24와 production/preview/development 환경별 secret scope를 명시한다.
3. 관리자 권한 matrix와 MFA를 실제 계정으로 확인한다.
4. 전용 notification/upload/marketing session secret을 설정하고 서로 재사용하지 않는다.
5. `BUILDER_REVIEW_SECRET`을 설정할지 결정한다. 설정 전 review-link 기능은 의도적으로 fail-closed다.
6. 모든 운영 form schema의 전달 방식·webhook·captcha·첨부 정책을 확인한다.
7. 상담 form은 첨부를 비활성화하거나 더 작은 별도 상한·보유·삭제·scanner 정책을 적용한다.
8. 통제된 test recipient 1건으로만 To/From/Reply-To와 SPF/DKIM/DMARC를 확인한다.
9. 개인정보처리방침의 “운영자 확인 필요” 항목을 실제 계약과 절차로 확정한다.
10. 실제 provider test credential로 결제·Zoom·calendar·marketing 연동을 부작용 없는 범위에서 smoke한다.
11. Vercel Analytics 또는 RUM으로 p75 LCP/INP/CLS와 영상 전송량을 관찰한다.

## 10. 롤백 방법

- 현재 운영 deployment: `dpl_91itCHGyybBDKPqneiyHV5DT9nJm`.
- 직전 검증 production candidate: `dpl_4YQ7fQcy8A1eHRPeYARgQkTmP4E9`. 문제가 생기면 Vercel에서 이 deployment를 Promote/Rollback 대상으로 사용한다.
- 코드 롤백: 공유 작업을 보존하기 위해 `git reset --hard`를 사용하지 않는다. 문제가 된 변경 commit만 `git revert <commit-sha>`로 되돌리고 clean build한다.
- Vercel 롤백: 검증된 직전 production deployment를 Promote/Rollback한다.
- 데이터: 이번 작업에는 production 고객 데이터 migration이 없다. QA는 격리 runtime을 사용했고 canonical runtime/audit checksum은 검증 전후 동일했다.
- dependency: Next.js 14.2.35로의 장기 rollback은 확인된 advisory 범위로 돌아가므로 안전한 최종 상태로 취급하지 않는다. 긴급 임시 rollback 후 Next 15.5.21 forward-fix를 우선한다.
- 보안 불변사항:
  - 상담 수신자를 클라이언트 입력으로 되돌리지 않는다.
  - 알림 internal secret·audience 검사와 link sanitizer를 제거하지 않는다.
  - form upload를 무서명 public bearer URL로 되돌리지 않는다.
  - KakaoTalk·LINE 재연결은 사용자의 별도 승인 전까지 되살리지 않는다.
- UI 장애 시 fallback: 시네마틱 영상은 poster로, 상담은 공개된 `mailto:wei@hoveringlaw.com.tw`로 유지한다.

## 결론

현재 코드에서 확인된 회원·민감 GET/page/publish 권한 누락, 알림 내부 신뢰·링크 주입·audience IDOR, 공개 mutation CSRF·오류 노출, Blob 공유 상태 경합, 범용 폼의 클라이언트 제어 전달 설정, 마케팅 open redirect와 영향 범위 dependency는 수정됐다. 공개 회원가입은 항상 403으로 비활성화됐고, 업로드는 15분 signed URL·production fail-closed 방식이다. 최신 증거는 lint warning/error 0, typecheck, 전체 Vitest **1,116 files / 8,515 passed / 14 skipped**, focused security **200 passed / 1 skipped**, Next.js 15.5.21 clean production build **490/490**, production dependency audit **0건**, release-config **7/7**, builder route-guard audit와 로컬·운영 브라우저 QA 통과다.

상담 primary 동선은 증준외(曾雋崴) 변호사의 `wei@hoveringlaw.com.tw`로 통일했고, 사무소 표기는 타이베이·타이중·가오슝·핑둥의 4개로 맞췄다. 최종 시네마틱 세트는 로컬 Veo 3.1 산악 오프닝과 Seedance 2.0 법원·삼합원·법정 영상이며, 지연 mount·화면 밖 pause·Save-Data/reduced-motion poster fallback을 코드와 운영 브라우저에서 확인했다. 장기 실제 사용자 CWV는 지속 관찰 항목이다.

검증된 production candidate `dpl_91itCHGyybBDKPqneiyHV5DT9nJm`은 `tseng-law.com`에 승격됐고, 네 locale의 200 응답·title/OG/mailto·보안 헤더·영상/이미지·4개 사무소·`/api/line` 404와 desktop/mobile 브라우저 흐름을 확인했다. Preview Blob 격리는 의도적으로 fail-closed를 유지했다. Vercel 보호·Node·secret, MFA, 이메일 DNS/From, 개인정보 처리, OAuth state, provider credential 연동과 장기 CWV는 운영자 수동 확인이 남는다. `BUILDER_REVIEW_SECRET`은 현재 production에 없으므로 review-link 기능은 fail-closed 상태이며, 전용 booking token secret도 운영자가 분리 여부를 결정해야 한다.
