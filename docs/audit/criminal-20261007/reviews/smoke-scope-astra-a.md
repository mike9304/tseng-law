# Builder smoke 범위 판정 — 독립 검수 A

판정: APPROVE — 이번 형사 칼럼·게시판 배포 범위에서 비차단.

`tests/builder-editor/admin-builder.playwright.ts:440`의 실패는 2026-10-06 도입된 한국어 홈 렌더링과 이전 검색창 class를 요구하는 smoke 전제의 불일치다. 이번 변경이 해당 class를 제거한 회귀라는 근거는 없다. 이 판정은 실패한 smoke를 PASS로 변경하거나 전체 빌더 기능을 승인한다는 의미가 아니다.

- 검수자: 독립 AI 검수자 A. 다른 검수자 보고서 미열람.
- 기준 작업트리: `/Users/son7/Projects/tseng-law-criminal-20261007`.
- 검수 시 HEAD: `f1c13d5c458f3d4e5bbee7772fe98dc8a346b749`. 형사 변경은 작업트리/index에 있는 상태를 검토했다.
- 원고·코드·테스트·운영 데이터 변경 없음. 이 보고서만 작성했다.

## 실제 실패와 응답

`/Users/son7/tseng-criminal-20261007/builder-smoke-final.log`에는 Chromium builder smoke 1개가 line 440에서 실패한 것으로 기록되어 있다. `/ko/admin-builder` 셸 및 관련 chunk 확인과 `/ko` HTTP 200 검사는 통과한 뒤, HTML 문자열에 `hero-search-bar overlap`이 포함되는지 검사하다 멈췄다.

실패한 Received HTML을 직접 확인한 결과:

| 확인 항목 | 관측 |
| --- | --- |
| `hero-search-bar overlap` | 없음 |
| `data-home-editorial="current9"` | 있음 |
| `data-ko-design="home"`, `id="ko-home"` | 있음 |
| 한국어 홈 검색 form | `class="KoHome_search__tl19j"`, `role="search"`, `action="/ko/search"`, `method="get"` |
| 검색 입력 | `id="ko-home-search"`, `type="search"` |
| `builder-pub-node` 문자열 | 있음. CSS에도 쓰이는 문자열이므로 이것만으로 실제 saved node DOM 렌더를 증명하지는 않음 |
| 새 형사 게시판 nav | `/ko/criminal-litigation` 링크 있음 |

검색 UI가 없어진 응답이 아니라 새 디자인의 검색 form이 렌더된 응답이다. 실제 검색 결과 이동이나 브라우저 상호작용까지 이번 검사에서 확인했다는 뜻은 아니다.

## 변경과 기존 렌더 경로 대조

1. `src/app/[locale]/[[...slug]]/page.tsx:190` 이후의 KO 경로는 published page를 먼저 조회하여 `PublishedSitePageView`를 렌더한다.
2. `src/lib/builder/site/public-page.tsx:895`는 `matchStockKoCompositeHome({ document: canvas, locale, slugPath })`로 stock KO 홈을 판별한다. 참이면 같은 파일 line 2559에서 `KoHomeBody`를 렌더한다.
3. `src/lib/builder/site/published-home-editorial.ts:983`의 판별은 KO 홈, 저장된 9개 기본 composite, 작성자가 바꾸지 않은 설정 등을 검사한다. 형사 칼럼·게시판 링크나 칼럼 목록은 이 판별 입력이 아니다.
4. `src/components/KoHomeBody.tsx:27`은 `KoHero`를 사용하고, `src/components/ko-home/KoHero.tsx:73`은 CSS module의 `styles.search`를 form class로 사용한다. `hero-search-bar overlap`을 출력하지 않는다. legacy KO 홈도 `home-legacy.tsx:79`에서 같은 `KoHomeBody`를 사용한다.
5. 이 경로는 `b1a2bc9e76088fefa7c1e45f5fc5cde29171f179`(2026-10-06 17:14 KST)의 KO 홈 변경에서 추가되었다. 이후 `e6835097c`(같은 날 23:13 KST)의 한국어 고유 디자인 변경이 반영되어 있다. smoke 파일의 마지막 변경은 `8932f76a2`(2026-10-01)이며 line 440의 이전 class 전제가 남아 있다.

다음 12개 파일은 작업트리 바이트와 `git show f1c13d5c4:<path>` 결과가 모두 같았다:

- `src/lib/builder/site/public-page.tsx`
- `src/lib/builder/site/published-home-editorial.ts`
- `src/components/KoHomeBody.tsx`
- `src/components/ko-home/KoHero.tsx`
- `src/components/ko-home/KoHome.module.css`
- `src/app/[locale]/(legacy)/home-legacy.tsx`
- `src/app/[locale]/[[...slug]]/page.tsx`
- `tests/builder-editor/admin-builder.playwright.ts`
- `src/lib/builder/canvas/decompose-hero.ts`
- `src/lib/builder/canvas/seed-home.ts`
- `scripts/run-builder-smoke.sh`
- `scripts/start-qa-server.sh`

`src/app/globals.css`와 KO 홈 섹션·콘텐츠 파일도 기준 HEAD와 동일했다. 이번 `Header.tsx` diff는 KO/EN/JA/ZH 메뉴에 형사 게시판 링크를 한 줄씩 추가한 것뿐이다. route ownership 변경은 `/criminal-litigation`이라는 정확한 native 경로를 추가하며, 빈 홈 slug의 소유권이나 홈 렌더 조건을 바꾸지 않는다. JA 전용 경로 추가 및 guidance 변경도 KO 홈 분기에는 적용되지 않는다. 새 칼럼이 홈 칼럼 목록에 표시될 수는 있으나 검색 form의 구현이나 stock-home 판정에는 관여하지 않는다.

## 운영 baseline 독립 확인

검수자가 `https://tseng-law.com/ko`를 직접 GET한 결과:

| 항목 | 값 |
| --- | --- |
| 시각 | 2026-10-07 08:32:13.997096 UTC / 17:32:13 KST |
| HTTP | 200 |
| 응답 크기 | 451,474 bytes |
| `hero-search-bar overlap` | false |
| `builder-pub-node` 문자열 | true |
| `data-ko-design="home"` | true |
| `KoHome_hero` | true |
| `href="/ko/criminal-litigation"` | false |
| 응답 SHA256 | `1d7d68b2855d824669721ff81f7a0abb7c2b2781d483bd44b6f8725ea29028c7` |

형사 nav가 아직 없는 운영 홈에도 같은 이전 class가 없다. 부모 에이전트가 기록한 `live-baseline-home.json`의 08:28 UTC 관측과도 핵심 marker 결과가 일치한다. 운영 배포의 commit SHA가 `f1c13d5c4`라는 정보는 부모 에이전트 제공 정보이며, HTTP 본문만으로 배포 SHA를 별도 증명한 것은 아니다. 현재 marker 판정에는 검수자의 실시간 원문 GET을 사용했고, 웹 도구의 과거 crawl 응답은 사용하지 않았다.

## 별도 확인한 검사와 한계

KO 홈 선택과 SSR 동작을 직접 실행하는 기존 테스트를 다음 명령으로 좁혀 재실행했다:

```text
/Users/son7/.nvm/versions/node/v24.14.1/bin/node node_modules/vitest/vitest.mjs run src/lib/builder/site/__tests__/published-home-editorial.test.ts src/lib/builder/site/__tests__/published-home-editorial-render.test.tsx -t 'stock ko composite home admission|redesigns the stock ko home' --reporter=dot
```

결과: 2 files PASS, 4 tests PASS, 37 tests는 필터로 미실행. stock KO 선택, 다른 locale·subpage 배제, 사용자 편집 시 canvas 유지, `KoHomeBody` SSR·검색 경로·canvas 불변성이 확인되었다. SSR 검사에서 기존 `inert` boolean 경고가 출력되었으나 assertion 실패는 없었다.

격리 harness 로그 `/var/folders/x7/w92bx9bd09l65n9hpcq81b8h0000gn/T/tseng-builder-smoke-4UFB9S/qa-harness.log`에는 ready attestation PASS와 `canonical runtime/audit checksums unchanged` teardown PASS가 기록되어 있다. 이번 검수에서 harness 전체를 다시 구동하지는 않았다.

전체 QA 1,408 files / 14,060 tests, clean build, typecheck, 공개 페이지·모바일 검증은 부모 에이전트의 제공 결과다. 본 범위 판정은 직접 읽은 변경분·실패 응답·운영 응답·위 4개 테스트를 근거로 한다. smoke는 첫 공개 홈 class 검사에서 중단되었으므로 뒤의 editor 선택·shortcut·panel·publish 단계는 이 실행으로 검증되지 않았다.

## 범위 결론

이번 배포를 막을 새 회귀로 분류하지 않는다. 실제 smoke 결과는 FAIL로 그대로 기록하고, 이번 형사 칼럼·게시판 배포 승인과 분리한다. 코드나 smoke 전제를 고쳐 억지로 통과시키지 않았으며, 전체 빌더 복구 작업은 이번 요청 범위에 추가하지 않는다.

증거 SHA256:

| 파일 | SHA256 |
| --- | --- |
| `builder-smoke-final.log` | `fc3a2bda383508ea0d9a3d6a63cc5ecdb2a81704b21eb55a956045750696113f` |
| `tests/builder-editor/admin-builder.playwright.ts` | `adb211f69c36ebea30448705e0c09d14500c5b5554141d183bafae6a67b8a3cf` |
| `src/lib/builder/site/public-page.tsx` | `e0c4f4853340739c63cecb0402929b0903714d4b00ed58f5005e0cd282b335ef` |
| `src/lib/builder/site/published-home-editorial.ts` | `5bb11cd96b1a1a4c4aab878a4cbe222f50861878619a05848e004b0ea2451ed5` |
| `src/components/KoHomeBody.tsx` | `10403b4fd79dd4ac593d61035f921707ad113946413a4d557e4badbcb0aeef25` |
| `src/components/ko-home/KoHero.tsx` | `f184b5db59e6d686f186bd143f29afb1252bfe614eee6fa5efdd2a5fdd837be4` |
| `src/components/Header.tsx` | `717e042858e26412797cac8e55677c4bc5eae1c5bf621b20feed0021a6a453d8` |
