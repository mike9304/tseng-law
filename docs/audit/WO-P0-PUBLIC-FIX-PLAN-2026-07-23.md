# WO-P0-PUBLIC-FIX 실행 계획 (2026-07-23)

> 상태: **IMPLEMENTATION PLAN ONLY — 아직 제품 코드·Blob·환경변수·배포를 변경하지 않음**  
> 대상: `/Users/son7/Projects/tseng-law` (실고객 사이트)  
> 기준 소스: `main` / `ad77d5fca9521ee06c471b0378763dea7ce73ae4`  
> 조사 시점 상태: worktree clean, `HEAD == origin/main == ad77d5fc`  
> 합의 순서: 신뢰 결함 → 실제 연락 채널 → 429 실흐름 판정 → EN 정화 → SSR 통계

## 0. 소스 오브 트루스 재검증 결과

이 계획의 line number는 위 기준 SHA에서 확인한 값이다. 구현 후 줄 번호가 이동하면 **symbol과 stable node id를 우선**한다.

1. WO-1 커밋 `0eacfede`는 타이베이 카드에서 `04-2326-1862`를 제거하지 않고 “타이중 본소 번호”라고 재표기했다. 현재 `origin/main`에도 그대로 있으므로 이번 합의 기준에서는 미수리 상태다.
2. `[변호사 검수 필요]`는 현재 소스에 5회 남아 있다. 공개 문구 1회는 `src/app/[locale]/guides/taiwan-company-setup/content.ts:146`, JSX 내부 주석 4회는 같은 경로의 `page.tsx:78,85,99,126`이다.
3. `src/data/contact-page-content.ts`는 “미커밋 파일”이 아니다. `ca6fee09`부터 Git에 존재하지만 AI fallback에서만 읽고 공개 contact 페이지에는 연결되지 않았다.
4. 공개 렌더는 단일 경로가 아니다. `resolvePublishedSitePage()`는 발행 canvas가 없으면 legacy로 돌아가고, EN projected KO 문서는 명시적으로 legacy fallback 처리한다(`src/lib/builder/site/public-page.tsx:178-204`). 따라서 코드 수정과 published Blob 수정의 필요 여부를 로케일·페이지별로 판정해야 한다.
5. contact의 canonical decomposer는 `STANDARD_PAGE_DECOMPOSERS.contact -> buildContactPageCanvas()`다(`src/lib/builder/canvas/seed-pages.ts:1886-1894,1979-1986`). 그러나 decomposer 변경은 이미 발행된 Blob canvas를 자동 갱신하지 않는다.
6. 공개 429는 production에서 Upstash가 없거나 실패할 때 `backend_unavailable`을 반환하는 구조(`rate-limit.ts:43-97`)와, public routes가 그 이유를 무시하고 전부 429로 변환하는 구조가 함께 존재한다. 따라서 “실제 한도 초과”와 “rate-limit backend 장애의 429 오표기”를 먼저 구분해야 한다.

## 1. 고정 범위와 실행 원칙

### 이번 주 포함

1. 공개 검수 마커 제거 및 타이베이 카드의 타이중 번호 제거
2. 검증된 LINE/Kakao + `mailto:` + `tel:` 연락 경로 개통
3. search/booking 실제 429 재현·분류 및 conversion blocker일 때 P0 복구
4. EN 홈의 한글 상속과 `Date pending` 제거
5. no-JS/SSR 홈 통계 실수치 렌더

### 이번 주 금지

- 디자인·AI 티 전면 개편
- zh-hant 1.9 MB payload 다이어트
- `force-dynamic`/캐시 정책 전면 개편
- C1-C4 칼럼 publish/content 개편
- GBP, outreach, 신규 마케팅 채널
- 확인되지 않은 타이베이 전화번호를 추측해 추가
- production 문서를 `?reseed=1`로 강제 초기화
- Upstash 장애를 숨기기 위한 production in-memory fallback 허용
- `git push --force`, `--no-verify`, 직접 Blob overwrite

### 실행 순서와 병렬화 규칙

| 순서 | 작업 | 다음 단계 진입 조건 |
|---|---|---|
| 0 | 기준 SHA·worktree·live render mode·발행 revision 기록 | baseline evidence 저장 |
| 1 | 검수 마커/타이베이 번호 | 소스·local browser·필요한 Blob patch 모두 검증 |
| 2 | 실제 contact 채널 | 물리 모바일 왕복 수신 1채널 이상 성공 |
| 3 | 429 실흐름 | search와 booking을 분리해 P0/P1 판정 |
| 4 | EN 홈 | visible Hangul 0 또는 명시 allowlist, `Date pending` 0 |
| 5 | SSR 통계 | JS off에서 `10+ / 500+ / 5 / 4` 확인 |
| 6 | 통합 게이트·preview·production·post-deploy | 전체 DoD 충족 |

- production 변경은 위 순서를 건너뛰지 않는다. 특히 Step 1과 Step 2는 contact/decomposer/발행 canvas가 겹치므로 같은 writer가 순차 처리한다.
- 독립적인 조사·리뷰는 병렬 가능하지만 **canonical worktree writer는 항상 1명**이다. 다른 에이전트는 read-only reviewer로만 동작한다.
- 별도 Git worktree를 쓰더라도 각 lane은 서로 다른 파일만 소유한다. main 통합은 한 명이 한 commit씩 수행하고, 통합 직전 `git diff --name-only`로 whitelist를 재검사한다.
- 어떤 worker도 commit, push, deploy, Blob publish, Vercel env 변경을 수행하지 않는다. 최종 권한은 human integrator 한 명에게만 둔다.
- 공유 파일 `src/lib/builder/canvas/decompose-page-contact.ts`, `decompose-page-shared.ts`, `tests/builder-editor/public-p0-fixes.playwright.ts`는 병렬 수정 금지다.

### 증거 보관 규약

구현자가 아래 디렉터리를 만들고, 시크릿·고객 PII를 제외한 증거만 저장한다.

```text
docs/audit/evidence/WO-P0-PUBLIC-FIX-2026-07-23/
  00-baseline/
  01-trust/
  02-contact/
  03-rate-limit/
  04-en-home/
  05-ssr-stats/
  06-post-deploy/
```

각 evidence에는 실행 시각(KST/UTC), commit SHA, deployment URL/production alias, HTTP status, 필요한 경우 Vercel request id를 기록한다. 인증값, Upstash token, 메시지 본문, 실제 고객 정보는 저장하지 않는다.

## 2. Step 1 — 공개 검수 마커 및 타이베이 번호 제거

### 문제와 근본 원인

1. KO guide FAQ에 공개 검수 상태가 그대로 포함된다: `src/app/[locale]/guides/taiwan-company-setup/content.ts:140-147`, 특히 `:146`.
2. 같은 기간 질문이 이미 `:136-138`에 있어, 검수 마커가 붙은 `:140-147`은 중복 FAQ다. 단순히 prefix만 지우면 미검수 문장을 승인된 문장처럼 보이게 하므로 부적절하다.
3. JSX source note에도 동일 marker가 남는다: `page.tsx:78,85,99,126`. 보통 DOM에는 출력되지 않지만 build artifact/RSC/raw scan의 0-hit 보장을 위해 공개 bundle source에서도 제거해야 한다.
4. legacy/composite contact 데이터가 타이베이 위치에 타이중 번호를 직접 포함한다: `src/data/site-content.ts:863-867,1590-1594,2333-2335`.
5. `OfficeMapTabs`의 `OfficeInfo.phone`이 필수(`src/components/OfficeMapTabs.tsx:9-18`)이고 타이베이 3개 locale에 04 번호가 있다(`:73-80,101-108,129-136`). 렌더도 무조건 전화 행을 만든다(`:274-281`).
6. decomposed builder preset도 타이베이에 04 phone/fax를 복제한다: `src/lib/builder/canvas/office-locations.ts:42-47,67-72,92-97`. `createOfficesDecomposedNodes()`가 전화 노드를 무조건 만든다(`decompose-offices.ts:249-260`).
7. 기존 회귀 테스트가 잘못된 WO-1 정책을 고정한다: `src/data/__tests__/site-remediation-content.test.ts:12-25`.

### 정확한 변경 목록

1. `content.ts`의 중복 FAQ object(`:140-147`)를 통째로 삭제한다. 이미 존재하는 `:136-138`의 기간 안내는 유지한다. 법률 문구의 실질 내용은 이번 WO에서 새로 쓰거나 확대하지 않는다.
2. `page.tsx`의 네 JSX 주석은 공개 marker 문구를 삭제한다. 출처 주석이 필요하면 `Source refs: columns ...`처럼 사실 출처만 남기고, 법률 승인 상태는 공개 bundle이 아닌 human-owned review ticket에서 추적한다.
3. `site-content.ts`의 타이베이 location details에서 04 번호 행을 KO/ZH/EN 모두 제거한다. 타이중 및 가오슝의 실제 행은 보존한다.
4. `OfficeInfo.phone`을 optional로 바꾸고 타이베이 3 locale object에서 `phone`과 `phoneLabel`을 삭제한다. 렌더는 `current.phone`이 있을 때만 전화 `<p>/<a>`를 만든다. 타이중·가오슝·한국 사무실의 전화는 변경하지 않는다.
5. `OfficeLocationPreset.phone`을 optional로 바꾸고 decomposed preset의 타이베이 phone/fax를 KO/ZH/EN 모두 삭제한다. `createOfficesDecomposedNodes()`는 phone/fax 존재 시에만 stable sibling node를 만든다. map link와 주소는 항상 유지한다.
6. 테스트를 “타이베이에는 04 phone/fax가 없고, 타이중에는 04 phone/fax가 있다”는 의미 기반 assertion으로 교체한다. 배열 index만 보지 말고 `id === 'taipei'/'taichung'` 또는 제목 노드로 찾는다.
7. 기존 published decomposed canvas를 위한 `scripts/patch-taipei-office-2026-07-23.mjs`를 추가한다. 기본은 dry-run이고 다음 조건을 모두 충족해야 한다.
   1. KO/EN/ZH의 home/contact page를 조회하고 `fallback | legacy-composite | decomposed` mode, page id, published revision을 출력한다.
   2. decomposed 문서에서는 타이베이 **title/address/map identity를 먼저 확인한 뒤** 같은 card의 phone/fax node만 제거한다. `layout-0` 같은 index만으로 타이베이를 판단하지 않는다.
   3. draft가 published와 다르면 abort한다. apply 전 full published record backup을 남기고, apply 직전 revision을 다시 비교한다.
   4. 기존 `publishPage` pipeline과 publish checks를 사용한다. 직접 Blob write는 금지한다.
   5. 타이중/가오슝/한국 사무실 node hash가 바뀌면 실패한다.
8. patch script의 pure planning function과 abort/rollback 조건을 `node:test`로 검증한다. 구현 패턴은 `scripts/patch-zh-hero-image-2026-07-22.mjs:351-487`의 backup/revision guard/publish 흐름만 재사용한다.
9. read-only `scripts/verify-public-p0-2026-07-23.mjs`를 추가해 sitemap의 모든 `<loc>`를 fetch하고 status 및 raw marker hit를 JSON으로 출력한다. redirect/error/marker 1건이라도 있으면 non-zero로 종료하며 HTML이나 고객 데이터를 저장하지 않는다.

### 허용 파일 whitelist

- `src/app/[locale]/guides/taiwan-company-setup/content.ts`
- `src/app/[locale]/guides/taiwan-company-setup/page.tsx`
- `src/data/site-content.ts`
- `src/components/OfficeMapTabs.tsx`
- `src/lib/builder/canvas/office-locations.ts`
- `src/lib/builder/canvas/decompose-offices.ts`
- `src/data/__tests__/site-remediation-content.test.ts`
- `src/lib/builder/canvas/__tests__/office-locations.test.ts`
- `src/lib/builder/canvas/__tests__/decompose-contact.test.ts`
- `scripts/patch-taipei-office-2026-07-23.mjs` (new)
- `scripts/patch-taipei-office-2026-07-23.test.mjs` (new)
- `scripts/verify-public-p0-2026-07-23.mjs` (new, read-only verifier)
- `scripts/verify-public-p0-2026-07-23.test.mjs` (new)
- `tests/builder-editor/public-p0-fixes.playwright.ts` (new/shared verification)
- `docs/audit/evidence/WO-P0-PUBLIC-FIX-2026-07-23/01-trust/**` (evidence only)

### 금지 파일/변경

- `src/content/columns/**`, `src/content/columns-zh/**`
- `src/app/sitemap.ts`, `docs/seo/**`
- 실제 타이베이 번호가 확인되지 않은 상태에서 새 번호 추가
- 타이베이에 타이중 번호를 “대표전화”로 재표기하는 우회
- office 순서, 주소, 지도 URL, 리뷰 수, 디자인 변경
- `SITE_PAGE_SEED_VERSION`만 올리고 production이 갱신됐다고 간주
- production `?reseed=1`

### 테스트/검증 명령과 기대 결과

```bash
rg -n "\[변호사 검수 필요\]" src
# expected: exit 1, stdout 0 lines

npx vitest run \
  src/data/__tests__/site-remediation-content.test.ts \
  src/lib/builder/canvas/__tests__/office-locations.test.ts \
  src/lib/builder/canvas/__tests__/decompose-contact.test.ts
# expected: all tests pass; Taipei has no 04 phone/fax, Taichung still has 04-2326-1862/1863

node --test scripts/patch-taipei-office-2026-07-23.test.mjs
# expected: dry-run/idempotency/revision-conflict/non-Taipei-preservation tests pass

node --test scripts/verify-public-p0-2026-07-23.test.mjs
# expected: nested sitemap/status/marker fixtures pass

node scripts/patch-taipei-office-2026-07-23.mjs \
  --dry-run --site=tseng-law-main-site
# expected before apply: configured builder backend를 읽기만 하며
# per-locale mode/revision/match count를 출력하고 persistence write는 0회

node scripts/verify-public-p0-2026-07-23.mjs \
  --base=https://tseng-law.com --check=trust
# expected: total=108, ok=108, redirects=0, errors=0, reviewMarkerHits=0
```

로컬 production build QA에서는 `tests/builder-editor/public-p0-fixes.playwright.ts`가 KO/EN/ZH home/contact의 타이베이 card를 제목 기준으로 찾고 04가 없음을, 타이중 card에는 04가 남음을 확인한다. post-deploy에는 sitemap URL 전체를 fetch하여 raw HTML의 marker 0회, rendered guide의 marker 0회, 모든 office card 관계 assertion 0 failures를 남긴다.

### 배포 메모: code vs Blob

- guide marker: **code deploy만 필요**하다. 이 route는 해당 `content.ts/page.tsx`를 직접 렌더한다.
- legacy/static 또는 `legacy-page-contact` composite: **code deploy가 적용**된다.
- decomposed published home/contact: code의 preset/decomposer 변경만으로는 기존 canvas가 바뀌지 않는다. 위 patch를 production credential이 있는 승인된 환경에서 dry-run 검토 후 apply/publish해야 한다.
- 실제 문서 mode는 DOM의 `[data-builder-published-page]`, stable `data-node-id`, backend page metadata/revision을 함께 사용해 판정한다. live HTML만 보고 Blob 여부를 추측하지 않는다.

### 위험과 rollback

- 위험: title/index를 잘못 매칭해 타이중 전화까지 삭제. 방지: title/address/map identity 3중 확인 및 non-target hash assertion.
- 위험: unpublished editor 변경 덮어쓰기. 방지: draft != published이면 무조건 abort.
- code rollback: 직전 Vercel production deployment로 alias를 되돌린다.
- Blob rollback: patch가 남긴 full backup을 기존 publish pipeline으로 새 revision으로 복원한다. 직접 overwrite하지 않는다.

## 3. Step 2 — 실제 contact 채널 개통

### 문제와 근본 원인

1. `contactPageContent`에는 LINE/Kakao URL이 있으나(`src/data/contact-page-content.ts:7-9,23-45`) 공개 contact page가 읽지 않는다. 현재 import 소비자는 AI consultation/floating fallback뿐이다.
2. `MessengerChatSection`은 별도의 동일 URL을 중복 보유(`src/components/MessengerChatSection.tsx:5-6`)하고 실제 `<a>`를 렌더하지만(`:151-184`) `ContactLegacyPageBody`에 포함되지 않는다(`legacy-page-bodies.tsx:78-87`).
3. `ContactBlocks`는 email/phone도 plain `<li>`로만 렌더한다(`src/components/ContactBlocks.tsx:35-63`). 따라서 텍스트가 있어도 `mailto:`/`tel:` round-trip이 없다.
4. decomposed contact는 `createContactBlocksSectionNodes()`가 plain info grids만 만든다(`decompose-page-shared.ts:1424-1567`). 발행된 decomposed Blob에는 messenger/direct action node가 없다.
5. 기존 URL `https://lin.ee/hojeong`, `https://pf.kakao.com/_hojeong/chat`는 코드에 있다고 해서 실제 수신 채널임이 증명되지 않는다. 이전 계획도 `_hojeong` 실존 확인을 사용자 결정 사항으로 남겼다.

### 선행 human gate

코드 변경 전에 채널 소유자가 아래 네 값을 서면 확인해야 한다. 하나라도 미확인이면 guessed URL을 production에 열지 않는다.

- LINE official deep link와 수신 담당 계정
- Kakao channel chat deep link와 수신 담당 계정
- 공개 수신 email (`wei@hoveringlaw.com.tw` 사용 여부)
- 공개 전화 (`+82-10-2992-9304` 사용 여부 및 담당 시간)

### 정확한 변경 목록

1. `src/data/contact-page-content.ts`를 contact channel SSOT로 확장한다. locale별 `messenger.primary/secondary` 외에 `direct.email`과 `direct.phone`의 label/value/href를 typed data로 둔다. 값은 human gate에서 승인된 값만 사용한다.
2. `MessengerChatSection.tsx`의 중복 LINE/Kakao constants를 제거하고 SSOT를 사용한다. 외부 messenger link는 `target="_blank" rel="noopener noreferrer"`, mail/tel은 새 창 없이 native handler가 열리게 한다.
3. `ContactLegacyPageBody`에 `MessengerChatSection`을 `ConsultationGuideSection` 뒤, `ContactBlocks` 앞에 추가한다. 이는 legacy static과 `legacy-page-contact` composite 양쪽에 적용된다.
4. `ContactBlocks` 상단에 email/phone semantic anchors를 추가한다. display text와 `href`는 SSOT에서 읽고, 기존 inquiry/location plain copy를 parsing해서 href를 만들지 않는다.
5. `createContactBlocksSectionNodes()`에 stable IDs를 가진 네 action button을 추가한다.
   - `${prefix}-channel-line`
   - `${prefix}-channel-kakao`
   - `${prefix}-channel-email`
   - `${prefix}-channel-phone`
   이 노드는 inquiry grid 다음, locations label 전에 놓고 external link metadata를 정확히 지정한다.
6. `decompose-page-contact.ts:11-21,150-179`의 contact block height, offices y, total page height와 desktop parity rect를 실제 추가 높이만큼 조정한다. 모바일 responsive override도 해당 stable IDs를 포함해야 한다.
7. 기존 published contact 문서용 `scripts/patch-contact-channels-2026-07-23.mjs`를 추가한다. 기본 dry-run, full backup, revision guard, draft conflict abort, publish pipeline 사용 규칙은 Step 1과 같다. stable parent/node signature가 예상과 다르면 entire page reseed 대신 abort한다.
8. patch는 canonical old/new node delta만 적용한다. 기존 고객 편집 node는 보존하고, 네 channel node 및 필수 rect/height 이동 외의 diff가 나오면 실패한다.
9. unit/component tests에서 KO/EN/ZH 각각 2 messenger + email + phone 링크를 검증한다. Playwright에서는 390px viewport에서 버튼이 화면을 넘지 않고 최소 한 채널을 눌러 외부 URL까지 도달하는지 확인한다.
10. form은 추가하지 않는다. 이번 단계의 성공 기준은 실제 수신이 되는 direct channel이며, 수신 인프라가 없는 form은 대체재가 아니다.

### 허용 파일 whitelist

- `src/data/contact-page-content.ts`
- `src/components/MessengerChatSection.tsx`
- `src/components/ContactBlocks.tsx`
- `src/app/[locale]/(legacy)/legacy-page-bodies.tsx`
- `src/lib/builder/canvas/decompose-page-shared.ts`
- `src/lib/builder/canvas/decompose-page-contact.ts`
- `src/lib/builder/canvas/__tests__/decompose-contact.test.ts`
- `src/components/__tests__/site-remediation-a11y.test.tsx`
- `src/data/__tests__/site-remediation-content.test.ts`
- `scripts/patch-contact-channels-2026-07-23.mjs` (new)
- `scripts/patch-contact-channels-2026-07-23.test.mjs` (new)
- `tests/builder-editor/public-p0-fixes.playwright.ts` (shared)
- `docs/audit/evidence/WO-P0-PUBLIC-FIX-2026-07-23/02-contact/**` (evidence only)

### 금지 파일/변경

- form API, CRM, AI chat, booking funnel 신규 구현
- guessed/placeholder LINE·Kakao 계정 공개
- messenger SDK 또는 tracking pixel 도입
- contact 외 페이지 디자인 전면 변경
- 전체 contact canvas reseed/replace
- 고객 메시지 내용이나 계정 식별자를 evidence에 저장

### 테스트/검증 명령과 기대 결과

```bash
npx vitest run \
  src/components/__tests__/site-remediation-a11y.test.tsx \
  src/data/__tests__/site-remediation-content.test.ts \
  src/lib/builder/canvas/__tests__/decompose-contact.test.ts
# expected: 3 locales × (LINE, Kakao, mailto, tel) semantic links pass

node --test scripts/patch-contact-channels-2026-07-23.test.mjs
# expected: dry-run/idempotency/conflict/allowed-node-delta tests pass

node scripts/patch-contact-channels-2026-07-23.mjs \
  --dry-run --site=tseng-law-main-site
# expected: configured builder backend를 읽기만 하며 3 locales mode/revision과
# 정확히 네 intended channel actions를 출력하고 persistence write는 0회
```

post-deploy human evidence:

1. 실제 iOS/Android에서 `/ko/contact`, `/en/contact`, `/zh-hant/contact` 중 대상 locale을 연다.
2. LINE 또는 Kakao 중 하나로 `WO-P0-<timestamp>` 테스트 메시지를 보낸다.
3. 지정 수신 담당자가 같은 token 수신 시각을 확인한다. screenshot에는 실제 대화/계정/전화번호를 가리고 token·시각·채널만 남긴다.
4. `mailto:`는 올바른 수신 주소가 채워진 composer, `tel:`은 올바른 번호가 채워진 dialer까지 확인한다. 실제 발신은 필요하지 않다.
5. 기대 결과: messenger 왕복 1개 이상 PASS + mailto PASS + tel PASS. 링크가 열리기만 하고 수신이 안 되면 미완료다.

### 배포 메모: code vs Blob

- legacy/static 및 legacy composite contact는 code deploy로 적용된다.
- decomposed published contact는 patch/publish가 별도로 필요하다.
- preview deployment에서 링크 host/path와 모바일 layout을 먼저 검증하고, production publish는 채널 수신 담당자가 대기 중일 때 수행한다.
- current Vercel CLI는 `50.41.0`으로 최신 `56.5.0`보다 오래되었다. 배포 담당자는 실행 전에 `npm i -g vercel@latest` 또는 `pnpm add -g vercel@latest`로 업그레이드한 뒤 버전을 기록한다. 제품 구조 마이그레이션은 하지 않는다.

### 위험과 rollback

- 위험: 존재하지 않거나 타인 소유 채널로 고객 문의 유실. 방지: preflight 소유권·수신 test.
- 위험: Blob patch가 contact layout을 밀어 겹침 발생. 방지: stable-node delta, 390/1440px screenshot, page height assertion.
- rollback: code deployment rollback + channel patch backup republish. 수신 장애가 확인되면 messenger 버튼만 즉시 비노출하고 검증된 mail/tel을 유지한다.

## 4. Step 3 — `/api/search`, `/api/booking/*` 429 재현·분류

### 문제와 근본 원인

1. production에서 Upstash config가 없거나 요청이 실패하면 `checkRateLimit()`은 fail-closed `allowed:false, retryAfterMs:0, reason:'backend_unavailable'`을 반환한다(`src/lib/builder/security/rate-limit.ts:43-97,136-209`).
2. authenticated mutation guard는 이 상태를 503 `rate_limit_unavailable`로 정확히 구분한다(`src/lib/builder/security/guard.ts:71-82`).
3. public search는 reason을 무시하고 모든 deny를 429로 만든다(`src/app/api/search/route.ts:48-59`).
4. public booking services/staff/availability/book도 동일하다:
   - `src/app/api/booking/services/route.ts:36-44`
   - `src/app/api/booking/staff/route.ts:37-46`
   - `src/app/api/booking/availability/route.ts:36-43`
   - `src/app/api/booking/book/route.ts:105-114`
5. 실제 booking UI는 mount 즉시 services를 요청하고, 이후 staff/availability를 호출한다(`BookingFlowSteps.tsx:205-249`). 첫 services 429이면 서비스 선택 자체가 불가능하므로 conversion blocker다.
6. readiness manifest/checker도 Upstash Production credential을 P0 readiness 대상으로 본다(`scripts/handoff-blockers/check-providers.mjs:139-145`, `docs/readiness-manifest/readiness-manifest.json:76-82`).

### 재현 및 P0 판정 절차

먼저 코드를 바꾸지 않고 실제 visitor flow를 기록한다.

1. fresh browser profile과 일반 모바일망 1개에서 `/ko` search UI로 한 번 검색한다.
2. 실제 공개 booking widget을 열어 services → staff → availability까지 진행한다. 유료 서비스라면 payment-intent가 호출되는지 기록하되 실제 결제는 승인 없이 진행하지 않는다.
3. 각 request에 timestamp, URL path/query key(민감값 제거), status, `errorCode`, `Retry-After`, Vercel request id를 기록한다.
4. Vercel Production 설정에서 `UPSTASH_REDIS_REST_URL`과 `UPSTASH_REDIS_REST_TOKEN`의 **존재/target만** 확인한다. 값은 terminal/log에 출력하지 않는다.
5. 동일 최초 요청이 새 세션·충분한 대기 후에도 `429 + Retry-After: 0`이면 backend unavailable 오표기 가능성이 높다. 반대로 허용 횟수 이후에만 positive Retry-After와 함께 429가 나면 실제 quota다.

| 관찰 | 판정 | 우선순위/조치 |
|---|---|---|
| booking services/staff/availability 첫 정상 흐름이 429/503로 중단 | conversion-blocking | P0, 같은 배포 창에서 복구 |
| booking은 완주, search만 실패 | 비전환 blocker | P1 기록; Step 3 evidence는 완료하되 긴급 범위 확대 금지 |
| 최초 요청 429, `Retry-After: 0`, Upstash missing/error | backend outage가 429로 오표기 | env 복구 + 503 semantic fix |
| 한도 도달 뒤 positive Retry-After 429 | genuine throttle | 정상 동작; 임의 limit 상향 금지 |

### 정확한 변경 목록 (재현 결과에 따른 조건부 실행)

booking conversion blocker 또는 backend-unavailable 오표기가 재현된 경우에만 아래를 구현한다.

1. `RateLimitResult`를 입력받아 `backend_unavailable -> 503/rate_limit_unavailable`, genuine deny -> `429/too_many_requests + positive Retry-After`를 반환하는 작은 shared mapper를 추가한다.
2. search와 실제 booking flow가 호출한 routes에 mapper를 적용한다. 최소 대상은 services/staff/availability/book이고, 실제 유료 flow에서 호출된 경우 payment-intent도 포함한다.
3. `search-api-copy.ts`와 `bookings-copy.ts`에 KO/ZH/EN `rate_limit_unavailable` public error code/message를 추가한다. UI가 장애를 사용자의 과도한 요청 탓으로 돌리지 않게 한다.
4. route tests에서 다음 두 case를 분리한다.
   - `{reason:'backend_unavailable', retryAfterMs:0}` → 503, `errorCode=rate_limit_unavailable`, `Retry-After` 없음
   - genuine deny → 429, `errorCode=too_many_requests`, `Retry-After > 0`
5. valid Upstash Production env를 Vercel의 Production target에 연결한다. env 변경은 새 deployment에만 반영되므로 preview smoke 후 production deployment/promotion을 수행한다.
6. fail-closed 정책은 유지한다. production in-memory fallback, 무제한 허용, 전역 rate-limit 제거는 하지 않는다.
7. genuine quota라면 limit/key 변경 전 실제 트래픽·NAT/shared-IP 증거를 별도 승인받는다. 단일 probe만으로 숫자를 올리지 않는다.

### 허용 파일 whitelist

- `src/lib/builder/security/public-rate-limit-response.ts` (new, 조건부)
- `src/app/api/search/route.ts`
- `src/app/api/search/__tests__/route.test.ts`
- `src/lib/builder/search/search-api-copy.ts`
- `src/app/api/booking/services/route.ts`
- `src/app/api/booking/services/__tests__/route.test.ts`
- `src/app/api/booking/staff/route.ts`
- `src/app/api/booking/staff/__tests__/route.test.ts`
- `src/app/api/booking/availability/route.ts`
- `src/app/api/booking/availability/__tests__/route.test.ts`
- `src/app/api/booking/book/route.ts`
- `src/app/api/booking/book/__tests__/route.test.ts`
- `src/app/api/booking/payment-intent/route.ts` (실제 paid flow가 호출된 경우만)
- `src/app/api/booking/payment-intent/__tests__/route.test.ts` (위와 동일)
- `src/lib/builder/bookings/bookings-copy.ts`
- `tests/builder-editor/public-p0-fixes.playwright.ts` (shared)
- `docs/audit/evidence/WO-P0-PUBLIC-FIX-2026-07-23/03-rate-limit/**` (redacted evidence only)
- Vercel Production env의 `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (human-only external change)

### 금지 파일/변경

- `src/lib/builder/security/rate-limit.ts`의 fail-closed 원칙 변경
- 모든 `/api/booking/*`를 근거 없이 한꺼번에 리팩터링
- booking 가격·서비스·availability 데이터 수정
- Stripe/메일/Zoom 등 unrelated provider 설정
- production load test 또는 60회 연속 호출로 고객 트래픽 방해
- token/env value 출력, `.env*` commit

### 테스트/검증 명령과 기대 결과

안전한 단일 probe 예시:

```bash
curl -sS -D /tmp/tseng-search-headers.txt \
  -o /tmp/tseng-search-body.json \
  'https://tseng-law.com/api/search?q=Taiwan&locale=en'

curl -sS -D /tmp/tseng-booking-services-headers.txt \
  -o /tmp/tseng-booking-services-body.json \
  'https://tseng-law.com/api/booking/services?locale=en'
# expected after fix: first legitimate request 200; not 429/503
```

targeted tests:

```bash
npx vitest run \
  src/app/api/search/__tests__/route.test.ts \
  src/app/api/booking/services/__tests__/route.test.ts \
  src/app/api/booking/staff/__tests__/route.test.ts \
  src/app/api/booking/availability/__tests__/route.test.ts \
  src/app/api/booking/book/__tests__/route.test.ts
# expected: all pass; backend outage=503, actual throttle=429 with positive Retry-After

npm run gate:handoff-blockers -- --base=https://tseng-law.com
# expected: Upstash/rate-limit readiness row PASS.
# Note: unrelated provider OPEN rows may keep the aggregate command non-zero.
```

실제 booking POST 검증은 전용 QA service/slot 또는 사무소와 합의한 test booking으로만 한다. 생성했다면 즉시 정상 cancel하고, customer PII가 없는 test id와 status transition만 증거에 남긴다.

### 배포 메모

- Upstash env 누락/오류가 원인이면 **env 복구 + 새 Vercel deployment**가 필수다. code만으로 backend를 복구할 수 없다.
- semantic 503 fix는 code deploy다. preview에서 의도적으로 backend unavailable mock을 사용해 503을 검증하고, production에는 valid Upstash와 함께 승격한다.
- search-only 실패라면 P0 package를 불필요하게 확대하지 않고 P1 follow-up으로 분리할 수 있다. 단, repro log와 분류 근거는 이번 주 DoD에 포함한다.

### 위험과 rollback

- 위험: 503 mapping만 배포해 실제 booking 장애가 계속됨. 방지: Upstash readiness와 UI real flow를 함께 gate.
- 위험: genuine abuse throttle을 장애로 오판. 방지: positive Retry-After/요청 수/Vercel log 상관 확인.
- rollback: 이전 deployment로 되돌리고, env는 이전 verified version으로 복원한다. 장애 중 rate limit을 무력화하지 않는다.

## 5. Step 4 — EN 홈 한글 상속 및 `Date pending` 제거

### 문제와 근본 원인

1. live EN이 legacy fallback을 타는 것은 의도된 보호 동작일 수 있다. projected KO builder document는 EN에서 거부된다(`public-page.tsx:186-189`).
2. 그런데 legacy resolver가 다시 KO archive를 강제 선택한다: `resolveLegacyHomeInsightPosts()`의 `insightsArchive[locale === 'en' ? 'ko' : locale]` (`src/app/[locale]/(legacy)/home-legacy.tsx:93-105`). 이것이 EN 홈의 대량 한글 카드 원인이다.
3. composite fallback에도 같은 강제 KO 선택이 있다: `src/lib/builder/components/composite/Render.tsx:104-129`, 특히 `:117`.
4. `InsightsArchiveSection`은 date가 없으면 `Date pending`을 출력한다(`src/components/InsightsArchiveSection.tsx:55-63,120-123`). archive의 17개 중 처음 3개만 date가 있어 4번째 카드부터 fallback이 발생할 수 있다.
5. 반면 canonical markdown reader는 모든 post의 `lastmod`를 읽고(`src/lib/columns.ts:178-195,218-234`), EN에서는 translated title/summary와 English date/read-time을 만든다(`:204-215`). 이미 존재하는 실제 날짜를 사용해야지 guessed date를 채우면 안 된다.

### 정확한 변경 목록

1. `home-legacy.tsx`에서 `insightsArchive` 직접 매핑을 제거하고 server-side `getAllColumnPosts(locale)` 결과를 `InsightsArchiveSection` shape로 매핑한다. `date`, `dateDisplay`, `readTime`, translated title/summary/category를 그대로 사용한다.
2. `resolveLegacyHomeInsightPosts`는 `ColumnPost[]`를 입력받는 pure mapper로 바꾸거나 별도 pure mapper로 추출해 unit test 가능하게 한다.
3. `Render.tsx` fallback의 KO 강제 선택을 제거하고 `insightsArchive[locale]`를 사용한다.
4. published mode에서 `columnPosts`와 preview posts가 모두 비어 있으면 date 없는 synthetic archive를 공개하지 말고 empty/unavailable 상태를 렌더한다. edit/preview에서만 locale-correct archive fallback을 허용한다. `_mode` 인자를 실제 `mode`로 사용한다.
5. 공개 EN 경로에서 date 없는 post를 `Date pending`으로 위장하지 않는다. Blob/CMS post에 date가 없다면 해당 post를 홈 목록에서 제외하거나 CMS date를 먼저 보완해 republish한다. 임의 날짜 생성은 금지한다.
6. unit tests는 legacy EN mapper와 composite published fallback 양쪽에서 visible Hangul 0, `Date pending` 0, canonical date 1개 이상을 검증한다.
7. browser test는 `main`의 `innerText`를 대상으로 Hangul을 검사한다. 명시적으로 승인된 브랜드 문자열이 있다면 exact-string allowlist에만 넣고, blanket regex 예외는 만들지 않는다.

### 허용 파일 whitelist

- `src/app/[locale]/(legacy)/home-legacy.tsx`
- `src/lib/builder/components/composite/Render.tsx`
- `src/lib/builder/components/composite/__tests__/composite-render-localization.test.tsx`
- `src/app/[locale]/(legacy)/__tests__/home-legacy-localization.test.tsx` (new)
- `tests/builder-editor/public-p0-fixes.playwright.ts` (shared)
- `docs/audit/evidence/WO-P0-PUBLIC-FIX-2026-07-23/04-en-home/**` (evidence only)

### 금지 파일/변경

- `src/content/columns/**`, `src/content/columns-zh/**`
- C1-C4 칼럼 본문 publish/번역 확대
- EN builder page를 KO content로 projection
- guessed date 하드코딩
- zh payload/캐시/force-dynamic 변경
- 디자인·카드 레이아웃 변경

### 테스트/검증 명령과 기대 결과

```bash
npx vitest run \
  'src/app/[locale]/(legacy)/__tests__/home-legacy-localization.test.tsx' \
  src/lib/builder/components/composite/__tests__/composite-render-localization.test.tsx
# expected: tests pass; EN public mappings contain no Hangul and no Date pending

rg -n "locale === 'en' \? 'ko' : locale" \
  'src/app/[locale]/(legacy)/home-legacy.tsx' \
  src/lib/builder/components/composite/Render.tsx
# expected: exit 1, stdout 0 lines
```

local/post-deploy Playwright expected:

- `/en` HTTP 200
- `main` visible Hangul count `0`, 또는 evidence에 기록된 exact brand allowlist만 존재
- visible `Date pending` count `0`
- insight card title/summary/date가 영어이며 link가 `/en/columns/...`로 향함
- browser console/hydration error `0`

### 배포 메모: code vs Blob

- 현재 EN이 legacy fallback이면 code deploy로 즉시 적용된다.
- real EN published page가 존재하면 `public-page.tsx`가 `getAllColumnPostsIncludingBlob(locale)`를 전달하므로 정상 date/translation을 확인한다. Blob 데이터 자체에 KO copy/date 누락이 있으면 해당 EN dataset만 수정·republish해야 한다.
- production EN 문서를 blind reseed하거나 KO 문서를 EN으로 복제하지 않는다. route mode와 dataset source를 evidence에 기록한다.

### 위험과 rollback

- 위험: canonical file read 실패 시 insights 전체가 비어 보임. 방지: mapper unit test, published empty-state 명시, build smoke.
- 위험: 일부 intentional brand 문자열을 오염으로 오판. 방지: exact allowlist + 위치/문맥 evidence.
- rollback: code deployment rollback. Blob 수정이 필요했던 경우 해당 dataset의 pre-publish backup revision 복원.

## 6. Step 5 — SSR/no-JS 통계 0/0/0/0 교정

### 문제와 근본 원인

1. `HomeStatsSection`은 client component이고(`src/components/HomeStatsSection.tsx:1-9`) 초기 `counts`와 `done`을 전부 0/false로 만든다(`:15-20`). 따라서 SSR HTML과 JS-disabled 화면은 0 네 개다.
2. 실수치는 IntersectionObserver 이후에만 채워진다(`:31-87`). JS가 없으면 영구히 0이다.
3. DOM은 이 state를 그대로 출력한다(`:104-117`).
4. decomposed builder 통계는 이미 실제 target을 정적으로 출력한다(`src/lib/builder/canvas/decompose-stats.ts:141-160`). 따라서 콘텐츠 값이 아니라 legacy/composite React animation 초기화 문제다.

### 정확한 변경 목록

1. `counts` 초기값을 `stats.items.map(item => item.target)`, `done` 초기값을 true로 바꿔 SSR와 첫 hydration markup을 동일한 실수치로 만든다.
2. JS animation을 유지할 경우, hydration 완료 후 section이 실제 intersect하고 reduced motion이 아닐 때만 counts/done을 0/false로 reset한 뒤 기존 rAF animation을 시작한다. 첫 server/client render에서는 reset하지 않는다.
3. reduced motion에서는 항상 target/true를 유지한다.
4. locale 또는 `stats.items` 변경 시 target 배열로 안전하게 reset하고 이전 timeout/rAF를 모두 정리한다.
5. progress bar의 초기 SSR 값도 실제 수치와 일치하게 1이 되게 하고, animation 시작 시에만 0부터 진행한다.
6. `renderToStaticMarkup` 회귀 테스트를 추가해 KO/EN/ZH 모두 visible `.stat-number`가 `10+`, `500+`, `5`, `4`인지 확인한다.
7. no-JS Playwright test와 JS-on animation completion test를 추가한다. hydration warning/console error도 0이어야 한다.

### 허용 파일 whitelist

- `src/components/HomeStatsSection.tsx`
- `src/components/__tests__/home-stats-ssr.test.tsx` (new)
- `tests/builder-editor/public-p0-fixes.playwright.ts` (shared)
- `docs/audit/evidence/WO-P0-PUBLIC-FIX-2026-07-23/05-ssr-stats/**` (evidence only)

### 금지 파일/변경

- `src/data/site-content.ts`의 target/label 수치 변경
- `decompose-stats.ts` 변경
- 통계 디자인/문구/office count 논쟁 확대
- client-only placeholder, CSS로 0 숨기기, hydration suppression

### 테스트/검증 명령과 기대 결과

```bash
npx vitest run src/components/__tests__/home-stats-ssr.test.tsx
# expected: 3 locales all render ["10+", "500+", "5", "4"] in SSR markup
```

Playwright expected:

1. `javaScriptEnabled:false` context로 `/ko`, `/en`, `/zh-hant` 접속.
2. `.stat-number`가 네 locale 모두 `10+ / 500+ / 5 / 4`이고 visible.
3. JS-on context에서는 section scroll 후 최종 값이 동일하며 animation 중 `NaN`, hydration mismatch, console error가 없음.

### 배포 메모: code vs Blob

- `home-stats` composite와 legacy home은 `HomeStatsSection`을 호출하므로 code deploy만 필요하다.
- decomposed published home은 이미 실수치를 정적으로 렌더하므로 Blob republish가 필요 없다.

### 위험과 rollback

- 위험: hydration 직후 target→0 flash. 방지: intersect 시점에만 reset하고 viewport/browser test로 확인.
- 위험: locale 변경 시 오래된 rAF가 새 locale state를 덮음. 방지: cleanup + target reset test.
- rollback: 이전 deployment로 복귀. 데이터/Blob rollback은 필요 없다.

## 7. 통합 검수·배포 절차

### 변경 전/후 whitelist gate

```bash
git status --short
git diff --name-only
git diff --check
```

기대 결과: 변경 파일이 각 Step whitelist와 evidence 경로 안에만 있고 `git diff --check`가 0이다. unrelated dirty file이 생기면 중단하고 owner 확인 전 수정/삭제하지 않는다.

### 로컬 5-gate

1. **Diff review**: Step별 whitelist, no-secret, no-unrelated-change 검토.
2. **Targeted/unit**: 위 Step별 명령 전부 PASS.
3. **통합 QA**:

```bash
npm run qa
npm run audit:release
# expected: both PASS
```

4. **clean production build**: human review 후 candidate commit을 만든 다음 clean worktree에서 실행한다.

```bash
NEXT_DIST_DIR=.next-build BLOB_READ_WRITE_TOKEN= npm run build
# expected: clean Next production build, no live Blob dependency
```

5. **real server/browser**:

Terminal A:

```bash
PORT=4537 NEXT_DIST_DIR=.next-build ./scripts/start-qa-server.sh
```

Terminal B:

```bash
BASE_URL=http://127.0.0.1:4537 \
  npx playwright test --config=playwright.config.ts \
  tests/builder-editor/public-p0-fixes.playwright.ts \
  --project=chromium-builder --workers=1

NEXT_DIST_DIR=.next-build npm run test:builder-smoke
# expected: public P0 test and builder smoke PASS; console errors 0
```

### Preview → production

1. current Vercel CLI를 최신으로 올리고 version을 evidence에 기록한다.
2. preview deployment에서 code paths, 390/1440px, no-JS, 503/429 semantic tests를 수행한다.
3. production env 변경이 있는 경우 preview와 production target을 혼동하지 않았는지 human double-check한다.
4. production code deployment를 승격한다.
5. 필요한 Blob patch는 각 script의 production dry-run을 다시 검토하고, 한 Step씩 apply/publish한다. 두 patch를 동시 실행하지 않는다.
6. 각 publish 후 해당 Step post-deploy smoke가 PASS해야 다음 publish로 간다.
7. 실패 시 다음 Step을 진행하지 않고 code/Blob 중 실패한 layer만 rollback한다.

## 8. 전체 Definition of Done

다음 항목이 모두 참이어야 이 package를 완료로 선언한다.

- [ ] 구현 기준 SHA와 production deployment SHA가 evidence에 기록됨
- [ ] source 및 sitemap-wide/raw/rendered scan에서 `[변호사 검수 필요]` 0회
- [ ] KO/EN/ZH의 모든 타이베이 office card에 `04-2326-1862`와 `04-2326-1863` 0회
- [ ] 타이중 card에는 `04-2326-1862`, 필요 시 fax `04-2326-1863`이 유지됨
- [ ] contact 3 locale에 verified LINE/Kakao deep link + `mailto:` + `tel:` 존재
- [ ] 물리 모바일 messenger 왕복 수신 1채널 이상 성공, mail composer와 dialer prefill 성공
- [ ] search와 booking real-flow 429 repro log 및 P0/P1 판정이 저장됨
- [ ] booking conversion path의 최초 정상 services/staff/availability 요청이 200
- [ ] backend unavailable은 503, genuine throttle만 positive `Retry-After`와 429
- [ ] `/en` visible Hangul 0 또는 exact intentional brand allowlist만 존재
- [ ] `/en` visible `Date pending` 0, insight dates는 canonical `lastmod` 기반
- [ ] JS disabled `/ko`, `/en`, `/zh-hant` stats가 `10+ / 500+ / 5 / 4`
- [ ] `npm run qa`, `npm run audit:release`, clean build, builder smoke, public Playwright PASS
- [ ] sitemap 108/108 HTTP 200 유지 및 새 console/hydration error 0
- [ ] code deploy가 필요한 항목과 Blob republish가 필요한 항목을 모두 수행했으며 revision/backup 경로가 기록됨
- [ ] unrelated design/zh performance/cache/columns/GBP 변경 0
- [ ] final worktree clean, commit별 whitelist 준수, push/deploy는 human 승인 기록 후에만 수행

## 9. 구현 후 권장 commit 메시지

human integrator가 각 단계 검수 후 순서대로 만드는 것을 권장한다. 이 계획 작성자는 commit하지 않는다.

1. `fix(public): remove review markers and incorrect Taipei contacts`
2. `feat(contact): publish verified direct consultation channels`
3. `fix(api): distinguish rate-limit outages from client throttling`
4. `fix(i18n): serve canonical English home insights`
5. `fix(ssr): render real home statistics without JavaScript`

Blob publish/evidence만 별도 commit할 경우:

- `ops(public): record guarded contact content publication evidence`

각 commit은 자체 targeted tests를 통과해야 하며, 최종 candidate commit 이후 clean build/browser gate를 다시 실행한다.
