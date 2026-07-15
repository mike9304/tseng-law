# 실제 사이트 ↔ 빌더 괴리감: 진단 + 구현 계획 (2026-06-15)

> 트리거(사용자): "현재 사이트와 사이트 빌더 사이에 괴리감 있어. 실제 사이트를 다 반영 못하고
> 있는데 반영되게 기능들도 제대로 작동하게 빌더 확인해주고 개선해줘"
> 컨텍스트: `/loop 6m` (cron 96e08404). 6pm(Asia/Seoul) 세션 한도 리셋 — 그 전엔 서브에이전트 스폰 불가.

## TL;DR (근본 원인 — 확정)
**버그가 아니라 구조적 공백.** 실제 tseng-law.com 콘텐츠는 전부 **레거시 하드코딩 React**로 존재하고,
이를 **빌더 데이터모델로 들여오는 임포트 경로가 없다**. 그래서 빌더 admin을 열어도 실제 페이지가
보이지 않고 → 편집/발행으로 라이브에 "반영"할 수 없다.

## 증거 (file:line)
- 공개 서빙 순서: `src/app/[locale]/[[...slug]]/page.tsx:50-75`
  → `resolvePublishedSitePage()` (빌더 발행본) **우선**, 없으면 `renderLegacyPage()` (레거시) fallback.
  즉 **빌더가 발행하면 라이브를 이긴다.** 메커니즘은 정상.
- 저장 백엔드는 publish/read 양쪽 모두 일관: `src/lib/builder/site/persistence.ts:9-13,88-96`,
  `src/lib/builder/site/publish.ts:331-355,510-542`.
  production(Vercel)은 `BLOB_READ_WRITE_TOKEN` 존재 → **Vercel Blob** 사용(휘발성 FS 버그 아님).
- 실제 사이트 = 레거시 페이지 10종: `src/app/[locale]/(legacy)/`
  `about/contact/services/lawyers/pricing/privacy/disclaimer/faq/reviews/home-legacy.tsx`
  (+ 칼럼/블로그는 `@/lib/columns` `getAllColumnPosts`).
- **레거시→빌더 ingestion 경로 없음**: `grep -rE "import.*legacy|migrate.*legacy|seedFromLegacy"
  src/lib/builder scripts` → 전부 `linkValueFromLegacy` 등 무관 매칭. 실제 페이지 임포트 0건.

## 따라서 괴리감 = 두 층
1. **콘텐츠 공백**: 실제 페이지가 빌더 안에 없음 (편집/발행 대상 자체가 부재).
2. **(미검증) 기능 동작**: "기능들도 제대로 작동하게" — publish 파이프라인은 정상 확인.
   나머지 admin 기능(CMS/bookings/forms/preview fidelity 등)의 실동작 감사는 미완(아래 Track B).

## 구현 계획

### Track A — 레거시 → 빌더 임포트 (핵심, "반영되게")
목표: 각 레거시 페이지를 **편집 가능한 빌더 site page(draft)** 로 생성 → 사용자가 손보고 publish하면
catch-all이 빌더 버전을 서빙(레거시 자동 override).

- [ ] A1. 레거시 슬러그 ↔ 컴포넌트 매핑을 단일 소스로 추출. `src/app/[locale]/(legacy)/index.tsx`
      배럴에서 slug→render 매핑 확인 후 import 대상 목록 확정(10종 + columns).
- [ ] A2. admin-builder **Pages 매니저**(`src/app/(builder)/[locale]/admin-builder/page.tsx` 및
      pages 관리 화면)가 레거시 페이지를 "미반영(Unmanaged)"으로 **나열**하고 "빌더로 가져오기"
      액션을 노출하는지 확인. 없으면 그 목록/액션부터 추가(저위험, UX 가시화 = 사용자가 갭을 인지).
- [ ] A3. 임포트 변환기: 레거시 TSX → 빌더 canvas 노드. 두 단계로 분리:
      - A3a(저비용·저위험): 각 레거시 페이지를 **단일 HTML/embed 노드 또는 섹션 스캐폴드**로 감싼
        draft site page 생성(완벽한 노드화 X, 우선 "빌더에 존재 + 발행 가능" 달성).
      - A3b(고비용): 레거시 마크업을 실제 빌더 위젯 노드로 충실 변환(디자인 fidelity = 기존 하드문제,
        [[project_wix_builder]] 핵심 갭). Codex 레인 후보.
- [ ] A4. 멱등 스크립트 `scripts/import-legacy-pages.mjs` (재실행 안전, 기존 draft 있으면 skip).
      persistence API 통해 site page 생성. 검증: vitest + 별도 포트 dev 렌더(절대 `next build` 금지).

### Track B — 기능 실동작 감사 (병렬, 에이전트 가용 시)
- [ ] B1. admin-builder 80개 화면 중 stub/false-green 식별. 교차참조:
      `qa-reports/*`, `CLAUDE-SESSION-2026-06-12-AUDIT-FIXES.md`, `WIX-FULL-PRODUCT-GAP.md`,
      `QA-GOAL-SESSION-2026-06-10.md`.
- [ ] B2. publish-gate(`src/lib/builder/publish-gate/checks.ts`)·scheduled-publish·redirects 실동작.
- [ ] B3. production Blob에 실제 발행된 페이지가 있는지(라이브가 100% 레거시인지) 확인.

## 안전 규칙 (이 레포는 LIVE production)
- 토요일 유휴 dev서버 떠있음(:3001 등). 활성 편집 세션 점검 후 작업: `ps`, src mtime, /tmp/tseng-*.log.
- `next build`(=`.next-build`) 금지. 검증은 vitest + 별도 포트 dev(`.next-dev`).
- 변경은 방어적 브랜치 커밋 권장(main에 미커밋 다수). distDir: production 빌드는 `NEXT_DIST_DIR=.next`
  (오늘 Vercel env 추가함 — 이거 없으면 빌드가 `.next` 못 찾아 실패).

## 정밀 진단 갱신 (06-15, 직접 코드추적 — 1차 진단 정정)
1차 "임포트 경로 전무"는 **부분 오류**. 실제로는 seed 메커니즘이 이미 존재:
- **`seedSitePages('default', locale)`** (`canvas/seed-pages.ts:599`) 가 표준 페이지 11종을 생성.
  트리거: admin-builder 대시보드 진입 시 (`admin-builder/page.tsx:742`) + API (`api/builder/site/seed/route.ts:66`).
- `REQUIRED_STANDARD_PAGE_SLUGS`(`site/standard-pages.ts`) = '', about, services, contact, lawyers,
  faq, pricing, reviews, columns, privacy, disclaimer — **레거시 페이지와 정확히 일치.**
- seed는 각 페이지를 `buildAboutPageCanvas` 등 **실제 편집 가능한 decomposed 빌더 노드**로 생성
  (`pageCopy`/`legalPageContent` 데이터 기반). `pageSeeds` 배열 = `seed-pages.ts:283-384`.

**그래서 진짜 괴리감 = 두 가지 중첩:**
- (a) **콘텐츠/디자인 fidelity 분기**: seed가 만든 빌더 노드는 `pageCopy` 스냅샷 기반이라,
  실제 라이브(레거시 `*-LegacyPageBody`)의 풍부한 디자인/콘텐츠와 **다를 수 있음** → 빌더에서 보는 것 ≠ 라이브.
- (b) **발행 상태**: seed 페이지가 draft면 catch-all은 레거시를 서빙(빌더 우선이지만 draft는 미서빙).
  즉 빌더 편집이 publish되지 않으면 라이브 미반영.

**미활용 자산**: `components/composite/Render.tsx`가 **실제 레거시 본문 + 풍부한 홈 섹션**
(HeroSearch/ServicesBento/HomeContactCta/FAQAccordion/OfficeMapTabs 등)을 `composite` 빌더 노드로
렌더 가능. **seed는 이걸 안 씀.** 이 노드를 쓰면 빌더가 라이브를 100% 충실 반영(단, 불투명/세분편집 X).

## 권장 방향 (하이브리드 — "반영되게"+"기능 작동" 둘 다 충족)
- seed 표준 페이지를 **`composite` 노드(실제 라이브 컴포넌트 래핑)** 로 생성 → 빌더가 라이브를 즉시 100% 반영.
- 각 composite에 **"편집용 분해(decompose)"** 액션 → 필요 시 그 페이지를 편집 가능한 노드로 변환
  (현재 `buildXxxPageCanvas`가 그 분해본 역할). = 반영(즉시) + 편집(온디맨드) 동시 충족.
- 검증: seed 페이지 vs 라이브 페이지 스크린샷 비교(별도 포트 dev), vitest `src/lib/builder` green.

## 진행 로그
- 2026-06-15 iter1: 1차 진단+계획 작성. 서브에이전트 2개 6pm 한도로 0토큰 실패
  (재개용 agentId: a2fb2a24c1dd441cd, a1837e6f5fd9237a6).
- 2026-06-15 iter2~3: seed 메커니즘 직접 추적 → 위 정밀진단으로 정정. composite 미활용 자산 발견.
- 2026-06-15 iter4 **(구현 완료, 메인스레드 직접)**: 하이브리드 1단계 적용.
  `canvas/seed-pages.ts`에 **`buildLegacyCompositePageCanvas`** 추가 + 표준 페이지 9종
  (about/services/contact/lawyers/faq/pricing/reviews/privacy/disclaimer) seed를 **composite 노드
  (`legacy-page-*` = 라이브와 동일 React 컴포넌트 렌더)** 로 재배선. 기존 decomposed 빌더는
  **`STANDARD_PAGE_DECOMPOSERS`** 맵으로 보존(향후 "분해 편집" 액션 기반). home/columns은 유지.
  검증: 신규 테스트 `__tests__/seed-composite-pages.test.ts` **vitest 28/28 green**
  (9×3 locale 전부 `builderCanvasDocumentSchema` 엄격검증 통과), seed route 테스트 회귀 없음.
  타입체크 진행 중. **미커밋.**
  - 부수 발견(선재, 본 변경 무관): 기존 decomposed 빌더 산출물은 `builderCanvasDocumentSchema`
    엄격검증을 통과 못 함(fontSize<12, 치수 0 등 = 메모리의 false-green/fidelity 흔적). 별도 백로그.
- 2026-06-15 iter5 **(재시드 경로 완료)**: `SITE_PAGE_SEED_VERSION` **v3→v4** bump.
  기존 `seedSitePagesInternal`이 매 호출(admin 대시보드 로드 시)마다 `seedExistingPageIfNeeded`로
  **버전 불일치 페이지를 재시드+자동발행**(`persistSeededPage`→`publishPage`)하므로, **기존 'default'
  사이트도 다음 대시보드 로드 때 9개 표준 페이지가 composite로 재시드+발행**됨 → 빌더가 라이브 반영,
  그리고 이 페이지들이 빌더-관리(발행본)로 전환되어 catch-all이 레거시 대신 빌더 버전 서빙.
  home은 content-gated(`seedExistingHomeIfNeeded`)라 영향 없음. columns는 동일내용 재시드(무해).
  검증: 전체 타입체크 exit 0, **canvas 테스트 21파일/134 green**, composite 테스트 28 green.
  주의: 사용자가 수동 커스터마이즈한 표준 페이지는 재시드로 라이브-반영본으로 리셋됨(기존 v3 설계와
  동일한 동작 — 버전 불일치 시 재시드). **전부 미커밋.**
  **남은 단계:** ① 별도 포트 dev로 seeded about 페이지 스크린샷 = 라이브 대조(fidelity 최종 확인)
  → ② home도 composite 섹션 스택으로 반영 → ③ "분해 편집" 액션(composite→편집노드) → ④ Track B 기능감사(6pm 후 에이전트).
- 2026-06-15 iter6 **(home 검토 + 분해편집 백엔드 완료)**:
  - **home은 composite로 변환하지 않기로 결정**: `seed-home.ts`의 home은 **의도적으로 decomposed**
    (편집 가능한 플래그십)이고 `__tests__/seed-home-layout.test.ts`가 hero/insights 노드 위치·겹침을
    단정함. composite로 바꾸면 그 노드들이 사라져 **테스트 깨짐 + 편집성 후퇴** → 안 함.
    (단 seed-home 9섹션은 라이브 대비 decomposed 근사치 = fidelity 백로그, Codex 레인.)
  - **"분해 편집" 백엔드 구현**: `POST /api/builder/site/pages/decompose`
    (`src/app/api/builder/site/pages/decompose/route.ts`) — composite로 반영된 표준 페이지를
    `STANDARD_PAGE_DECOMPOSERS[slug]`의 **편집 가능한 노드트리로 draft 교체**. guardMutation
    'edit-pages' 인증, 안정 에러코드 재사용. 검증: 라우트 테스트 **3/3 green**, 전체 타입체크 exit 0.
    = "반영(composite) + 편집(분해)" 하이브리드의 편집 절반 완성. **미커밋.**
  **남은 단계:** ① 빌더 admin UI에 "이 페이지 편집하기(분해)" 버튼 → 이 라우트 호출 wiring
  → ② seeded about 스크린샷 라이브 대조 → ③ Track B 기능감사(6pm 후 에이전트) → ④ 방어적 커밋.
- 2026-06-15 iter7 **(end-to-end 실증)**: `__tests__/seed-composite-integration.test.ts` 추가 —
  **모킹 없이 실제 persistence(FS)** 를 거쳐 격리 siteId로 `seedSitePages` 실행 → about 페이지가
  site에 seed되고 **published 캔버스가 composite(`legacy-page-about`)** 임을 검증. **1/1 green**,
  테스트 siteId 자동 cleanup. = "반영"이 구조뿐 아니라 **실행 경로에서도 동작함**을 증명
  (catch-all이 서빙하는 바로 그 published 문서). **미커밋.**
  **남은 단계:** ① 분해편집 UI 버튼 wiring → ② Track B 기능감사(6pm 후) → ③ 방어적 커밋.
- 2026-06-15 iter8 **(분해편집 UI 버튼 완료)**: `components/builder/canvas/PageSwitcher.tsx`
  per-page ⋯ 메뉴(Rename 아래)에 **"편집용으로 분해 (라이브 반영본)"** 버튼 추가
  (9개 표준 슬러그에만 노출, `DECOMPOSABLE_SLUGS`). `handleDecomposeToEdit`가
  `POST /api/builder/site/pages/decompose` 호출 → `fetchPages()` 새로고침 → 해당 페이지 선택(편집 진입).
  copy 객체 미변경(locale 인라인 라벨). 검증: **typecheck 0, eslint 0 errors**(선재 warning만),
  **격리 dev(:4399, distDir=.next-uiverify)에서 /ko/admin-builder 컴파일+렌더 HTTP 200**.
  버튼 시각 위치·클릭플로우는 사용자 브라우저 확인 권장(computer-use 브라우저는 read-tier라 클릭 불가).
  **미커밋.** **남은 단계:** ① 사용자 시각 확인 → ② Track B 기능감사(6pm 후 에이전트) → ③ 방어적 커밋.
- 2026-06-15 iter9 **(Track B 기능감사 + cron P0 발견)**: 22:13 KST, 에이전트 한도 리셋됨.
  병렬 감사 에이전트 2개(admin UI / 런타임 lib) — 증거기반 결과 + false-positive 기각 반환.
  **최대 발견(P0): 모든 Vercel cron이 prod에서 죽어있음.** `isCronAuthorized`(security/cron-auth.ts)는
  prod에서 `CRON_SECRET` 없으면 무조건 401인데 **Vercel env에 CRON_SECRET 미설정** → backup·
  calendar-sync·marketing dispatch·sms-reminders·webhooks-retry **전부 무동작**(+예약발행도).
  적용: `vercel.json`에 `/api/cron/scheduled-publish */5` 등록(완료, 미커밋). **남은 건 CRON_SECRET 설정
  + 재배포** — 단 이는 **outward-facing**(SMS·마케팅 발송 활성화)이라 사용자 결정 필요. CLI add는
  인증 플로우 미완으로 실패 → 대시보드 설정 권장.
  **그 외 감사 상위 발견(미수정, 백로그):**
  · AI page-spec/section 라우트: OPENAI_API_KEY 없으면 `ok:true`+canned 반환(text/image/code는 503) — 거짓성공
    (`api/builder/ai-generator/{page-spec,section}/route.ts`).
  · 자동번역: 키 없으면 원문 그대로 `ok:true`(`translations/providers/router.ts:56-84`).
  · CRM Integrations: 생성 후 수정/비활성/삭제 액션 없음(`crm/IntegrationsAdmin.tsx:213-234`).
  · Dev>Logs 내비 → 404(컴포넌트는 존재, 라우트 없음 `admin-nav/nav-config.ts:81`).
  · Commerce Export CSV 3종: textarea만 채우고 파일 다운로드 안 됨(downloadText 헬퍼로 교체).
  · 캔버스 우클릭 메뉴 F-track 항목들 hardcoded disabled, "Add category" 버튼 dead.
  · Class B(스토리지 휘발) 다수는 prod에 BLOB_READ_WRITE_TOKEN 있어서 **현재 잠재**(미발생).
  **남은 단계:** ① 사용자: CRON_SECRET+재배포 결정 → ② 백로그 상위(AI 거짓성공/CSV다운로드) 수정 → ③ 커밋.
- 2026-06-15 iter10 **(Export CSV 다운로드)**: 공유 `commerce/download-text.ts` 추출 + 주문/상품
  Export 버튼 3개가 실제 파일 다운로드하도록 수정(textarea 미리보기 유지). typecheck 0, eslint 0err,
  dev :4399 commerce products/orders 200. 정정: AI 거짓성공은 prod에 OPENAI_API_KEY 있어 **현재 잠재**라 보류.
- 2026-06-15 iter11 **(Dead Logs 내비 404 복구)**: `%5Fdev/logs/page.tsx` 생성(DevLogsPanel 마운트,
  props 無·자체 폴링·API `/api/builder/dev/logs` 존재). **핵심 함정**: Next.js App Router에서 `_`로 시작하는
  폴더는 **private(라우팅 제외)** → URL `/_dev/...`를 만들려면 `%5Fdev`로 인코딩해야 함(기존 functions/sdk/
  secrets도 `%5Fdev`에 있음). 내가 처음 리터럴 `_dev/logs`로 만들어 404 → `%5Fdev/logs`로 정정 후 제거.
  검증: dev :4399 `/_dev/logs` **404→200**, eslint 0. (functions/sdk/secrets는 원래 정상, logs만 누락이었음.)
  **남은 단계:** ① CRM Integrations 수정/삭제 액션 → ② 사용자 CRON_SECRET 결정 → ③ 방어적 커밋.
- 2026-06-15 iter12 **(CRM Integrations 전체 CRUD)**: 신규 라우트 `PATCH/DELETE /api/builder/crm/
  integrations/[id]`(부재였음) + 모델 `integrationPatchSchema` + 에러코드 3종×3언어 + UI(IntegrationsAdmin
  "관리" 컬럼: ON/OFF 토글 + 삭제, AutomationsAdmin 패턴 미러). 검증: 라우트 테스트 5/5, typecheck 0,
  dev :4399 CRM admin 200. 생성 후 변경불가 → 완전 관리 가능으로.
- 2026-06-15 iter13 **(전체 회귀 검증)**: `npx vitest run` 전체 → **602 파일 / 3597 passed | 14 skipped,
  0 실패**. 12 이터레이션 누적 변경 전체가 충돌 없이 통합·동작 확인. (로그의 "failed" 라인은 에러경로 테스트의
  콘솔출력일 뿐.) **세션 작업 전체 검증 완료. 전부 미커밋 — 방어적 커밋 강권.**
- 2026-06-15 iter14 **(품질)**: 주문 빈상태 내부티켓ID "F61" 제거(`OrderManagerClient.tsx`). orders 200.
- 2026-06-16 iter15 **(HOME 라이브 반영 — 사용자 선택)**: 가장 깊게 결합된 플래그십 페이지 전환.
  `seed-home.ts`: `createHomePageCanvasDocument`→**composite 9섹션 스택**(hero-search/insights-archive/
  services-bento/home-attorney/home-case-results/home-stats/faq-accordion/office-map-tabs/home-contact-cta
  = 라이브 home-legacy.tsx 순서), `createHomePageCanvasDocumentDecomposed`=기존 decomposed 보존, SEED_VERSION v7.
  **결합 처리(회귀 방지)**: ① `home-locale-repair.ts`는 decomposed 레퍼런스 사용(alias) — composite home은
  `home-hero-root` 없어 isHomeDocument=false→무수정 통과(올바름) ② `admin-builder/page.tsx`: 4개 home 마이그레이션
  (`upgradeHeroQuickMenu`/`upgradeHomeInsightsSource`/`upgradeHomeOfficesTabbedLayout`/`upgradeHomeFaqSection`)은
  decomposed 레퍼런스(import alias), **791 seed만 composite**, `homeDraftHasHero`에 `home-hero`(composite 마커)
  추가→**무한 재시드 방지** ③ seed-version 불일치 재시드는 시스템시드(home-seed-v*)만 교체, 유저편집 보존.
  테스트: seed-home-layout/home-locale-repair는 decomposed 대상으로 재배선, 신규 composite-home 테스트.
  **검증**: 홈 테스트 **11/11**, typecheck 0, **dev :4399 admin홈 200 + 공개홈 200 + 라이브섹션 렌더 확인**
  (hero-search/practice/offices/faq/변호사). 전체 회귀 스위트 **603파일/3601 passed 0실패**. **미커밋.**
- 2026-06-16 iter16 **(홈 분해편집 경로)**: `STANDARD_PAGE_DECOMPOSERS['']=createHomePageCanvasDocumentDecomposed`
  + PageSwitcher `DECOMPOSABLE_SLUGS`에 home('') 추가 → 홈도 "편집용으로 분해" 버튼 노출.
  홈도 9개 표준페이지처럼 **반영(composite)+편집(분해)** 완결. typecheck 0, decompose+composite 테스트 31.
- 2026-06-16 iter17 **(마케팅 templates 탭)**: `MarketingNav`에 'templates' 탭 추가(campaigns/templates/
  subscribers 3탭, 라벨렌더 중첩삼항→`text[tab.key]` 정리) + templates 페이지 2곳 `active="campaigns"`→
  `"templates"`(전용 탭 없어 campaigns로 잘못 하이라이트되던 것 수정). typecheck 0, dev marketing/templates 200,
  내비 3탭 렌더 확인. 전체 스위트 재검증 중.
- 2026-06-16 (대화형): home composite↔decomposed 왕복(사용자 피드백 반영) → 최종 **composite 기본**(라이브 정확
  매칭, 콘텐츠는 데이터 admin 편집) + Playwright 실측 높이(`scripts/measure-home-sections.mjs`)로 에디터=공개
  위치 일치(scripts/verify-home-flow.mjs로 ÷zoom 검증). 라이브 vs 로컬 스크린샷 대조로 주요서비스·FAQ길이·
  오버플로 해소 확인.
- 2026-06-16 **(멀티에이전트 리뷰 + 수정)**: ultracode 워크플로우(4 서브시스템 리뷰 + 발견별 적대적 검증)
  → 40확정(1 P0·15 P1·21 P2·3 P3). 수정 적용:
  · #2 에디터 home-migration 파이프라인을 `isHomeCanvasDocument`(decomposed)로 게이트(composite 홈 보호)
  · #4 `decomposable-slugs.ts` 공유모듈로 STANDARD_PAGE_DECOMPOSERS↔PageSwitcher 드리프트 제거 + 동기 테스트
  · #5 %5Fdev/logs 로케일 메타데이터(generateMetadata)
  · #6 IntegrationsAdmin 인라인 문자열→copy 객체(3로케일+satisfies 타입) + removeOne busy 가드
  · 신규 테스트 3: composite홈 home-hero-root 부재 불변식 / 슬러그 동기 / 홈('') 분해
  · P0 크론(CRON_SECRET 미설정)은 코드 아닌 Vercel env 사항 → 사용자 배포시 설정
  검증: typecheck 0, 전체 스위트 **603/3603 0실패**, 계약테스트 갱신. 수정 적대적 재검증 워크플로우 진행 중.
