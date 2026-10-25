# 상세 HTML 반복 데이터와 작은 절감 후보

2026-10-25 조사. 조사 기준 공개 커밋은 `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`, `builtAt=2026-10-25T02:45:26.159Z`이며 표본 수집 전후 값이 같았다. 이 문서는 packer/Worker/자산 압축을 다루지 않는다. 초기 조사 뒤 주 담당의 별도 승인으로 후보 1만 구현하고 관련 검증을 통과했다. 후보 2는 미구현이다.

우선순위는 정적 빌드의 언어 전환 인덱스를 현재 글로 좁히는 것이다. 현재 전체 본문 목록이 상세 props로 넘어간다는 가설은 사실이 아니다. 대신 같은 언어의 모든 slug와 번역 cluster가 locale layout에서 매 페이지 RSC에 반복된다. Footer의 서버 JSX 트리도 client shell에 전달되므로 반복된다. 두 후보는 본문·FAQ·추천·언어 메뉴 항목·SEO를 보존할 수 있지만, 실제 빌드와 hydration 검증 전에는 절감을 확정하지 않는다.

## 관측 자료와 측정 방식

- [fetch-metadata.json](html-size/fetch-metadata.json): 직접 받은 상세 8개·목록 2개 공개 URL, SHA-256, HTTP 200, 전후 build-info. 원문 HTML도 같은 폴더에 저장했다.
- 배포 조사자가 받은 49언어×3편의 147개 원문을 `/private/tmp/tseng-packer-experiment-20261025/manifest.json`에서 읽어 같은 분석을 추가했다. 이 표본 선정·한계는 [deployment-capacity.md](deployment-capacity.md)를 따른다. 같은 페이지가 직접 표본에 포함된 경우도 있으므로 157개를 독립 표본으로 합산하지 않았다.
- [analyze.mjs](html-size/analyze.mjs)는 Flight의 JSON 모델과 UTF-8 길이 지정 `T` 문자열을 파싱한다. 실행된 응답 스크립트를 `eval`하지 않는다. 원문→파싱→재직렬화가 157개 모두 바이트 단위로 동일했다.
- [payload-measurements.json](html-size/payload-measurements.json)에 원문 크기·각 부분·가상 변경의 짝비교를, [measurement-summary.json](html-size/measurement-summary.json)에 147개 요약을 기록했다. 가상 변경 문자열은 배포 가능한 결과물이 아니며 실행하지 않았다.
- 압축은 Node `24.14.1`, zlib `1.3.1-e00f703`, gzip level 9로 통일했다. 같은 번체 704 원문 146,942 B도 Python zlib 1.2.12에서는 34,605 B, Node에서는 35,299 B다. 따라서 다른 런타임의 절댓값을 섞지 않는다. 아래 차이는 같은 원문·같은 압축기의 짝비교다.
- 배포 조사자는 재요청의 같은 길이 HTML에서 CDN이 붙이는 `window.__CF$cv$params`의 `r/t` 값 변동을 확인했다. 따라서 재수집 SHA의 차이를 곧바로 본문·배포 변경으로 해석하지 않는다. 여기서는 보관된 동일 원문을 각 실험에 사용하고 기록된 SHA를 다시 검증한다.

| 실제 응답 | HTML B | gzip9 B | Flight script B | 전체 slug 인덱스 JSON B | 본문 Markdown의 Flight B |
| --- | ---: | ---: | ---: | ---: | ---: |
| EN 704 | 129,199 | 30,313 | 72,528 | 11,465 / 208개 | 9,319 |
| KO 704 | 152,121 | 34,816 | 81,533 | 11,569 / 207개 | 11,478 |
| ZH-Hant 704 | 146,942 | 35,299 | 81,555 | 15,652 / 286개 | 8,661 |
| JA 704 | 146,413 | 36,060 | 81,883 | 12,610 / 220개 | 12,123 |
| NL 반도체 | 133,332 | 30,371 | 71,562 | 1,173 / 21개 | 16,182 |
| RU 체육관 | 155,761 | 34,887 | 83,036 | 1,184 / 21개 | 26,009 |
| TA 교통 절차 | 254,169 | 43,066 | 124,540 | 1,200 / 21개 | 69,119 |
| ZH-Hans 외국 판결 | 105,883 | 24,467 | 58,518 | 1,522 / 25개 | 7,622 |
| EN 목록 | 368,661 | 68,617 | 262,176 | 11,465 / 208개 | 해당 없음 |
| NL 목록 | 124,346 | 23,410 | 68,559 | 1,173 / 21개 | 해당 없음 |

Flight는 상세 원문 HTML의 약 49–56%였지만 모두 제거 가능한 중복이라는 뜻은 아니다. React가 초기 HTML을 대조하고 상호작용을 연결하는 데이터도 포함된다. [Next 공식 설명](https://nextjs.org/docs/app/getting-started/server-and-client-components), [React hydration 계약](https://react.dev/reference/react-dom/client/hydrateRoot)과 현재 코드 경계를 함께 적용해야 한다.

## 후보 1 — 정적 빌드에서 현재 글의 번역 cluster만 전달

정확한 출발점은 `src/app/[locale]/layout.tsx:119`의 `publicColumnSwitcherData(publicLocale)`와 `src/lib/column-language-links.ts:27`이다. 현재 locale의 전체 slug→cluster map을 provider에 주고, Header/GlobalLanguagePicker/Footer/LocaleSuggestion이 `usePathname()`으로 현재 글을 고른다. 일반 SPA에서는 layout이 재사용되므로 이 전체 map이 필요하다. 운영 정적 빌드는 `StaticLink`의 일반 `<a>` 이동을 사용하므로 다음 글에서 새 HTML과 새 provider 데이터를 받는다.

작은 변경 범위:

1. `column-language-links.ts`에 명시적인 정적 페이지 선택 옵션을 추가한다. 현재 글은 `{locale, clusters:[현재 cluster], columns:{현재slug:0}}`, 홈·목록 등 비칼럼은 빈 clusters/columns로 투영하되 `columnLocales`는 모두 보존한다.
2. locale layout은 `IS_STATIC_SITE`일 때만 `headers().get('x-tseng-pathname')`을 전달한다. 일반 빌드에서는 기존 전체 인덱스를 그대로 사용한다.
3. 헤더 부재·잘못된 값·현재 locale 불일치·비정상 인코딩은 기존 전체 인덱스로 안전하게 돌아간다. 파일 없는 정상 slug(CMS-only 포함)는 번역이 있다고 만들지 않으며 기존처럼 현재 언어만 보여야 한다.
4. 페이지 metadata의 `columnAlternateLocales()`와 sitemap 생성은 건드리지 않는다. 메뉴 링크 집합과 hreflang 집합의 기존 관계를 그대로 검증한다.

헤더 신뢰 경계: `src/middleware.ts:237,307,326`은 받은 `x-tseng-pathname` 값을 그대로 신뢰하지 않고 실제 `request.nextUrl.pathname`으로 덮어쓴다. 다만 middleware를 거치지 않는 테스트/특수 경로도 있으므로 선택 helper가 다시 형태·locale·인코딩을 검증하고 실패 시 전체 map을 유지해야 한다. 임의 경로를 파일 경로로 연결하거나 헤더로 공개 여부를 결정하지 않는다. Root layout도 이미 `src/app/layout.tsx:21`에서 `headers()`를 읽으며 칼럼 page는 `force-dynamic`이다. 정적 크롤링 원본의 동적 렌더에 새 유형의 의존성을 넣는 변화는 아니다. 별도 Next 정적 export로 바꾸는 안도 아니다.

이 헤더는 인증 수단이 아니다. 형태 검사만으로 임의의 올바른 문자열이 실제 요청 경로임을 증명하지는 못한다. 정상 middleware와 승인된 로컬 static crawler가 값을 제공한다는 기존 계약을 사용하며, 공개 비정적 SPA에서는 이 최적화 옵션을 아예 전달하지 않는다.

측정과 추론:

- 현재 원문에서 index 값만 현재 글로 바꾼 가상 짝비교: 147개 평균 **969 B gzip 감소**, 272–6,490 B. EN/KO/JA/ZH 704는 4,614 / 4,633 / 5,157 / 6,237 B였다. 대부분 확장 언어는 아직 21편이어서 현재 절감은 작다.
- 미래 크기 모델: 공개 번체 인덱스의 실제 286개 slug와 49언어 공통 cluster를 각 표본에 넣어 전체 map 대 현재 글 map을 비교했다. 표본 주제가 그 286개에 없으면 한 slug만 교체했다. 이는 향후 주제 선정안이나 실제 원고 완성 상태가 아니다.
- 이 **인덱스만의 가상 286편 모델**에서 평균 **5,816 B gzip 감소**, 5,231–6,476 B. 14,014페이지에 단순 곱하면 **77.73 MiB**다. 미래 본문·메뉴·hreflang의 증가를 모사하지 않았고 실제 전체 빌드 결과가 아니다.
- 77.73 MiB는 미래 전체 map 대비 값이므로 기존 현재 표본 기반의 411.87 MiB 추정에서 곧바로 빼면 안 된다. 상당 부분은 전체 인덱스 증가를 막는 효과다. 이 후보 하나로 256 MiB 수용을 보장할 수 없다.

## 후보 2 — Footer를 같은 SSR 출력의 동기 client 경계로 이동

`src/app/[locale]/layout.tsx:154,182`의 `<Footer locale=... />`는 서버 컴포넌트이며, `CinematicRouteShell`은 client 컴포넌트다. Footer의 HTML과 그 서버 JSX 모델이 함께 전송된다. 표본의 Footer 모델은 Flight의 여러 참조 행에 나뉘어 있으므로 `footer` prop 문자열 크기만 재면 과소평가한다.

`src/components/Footer.tsx:83`은 async 데이터 로딩 없이 locale과 `extraColumns`로 렌더하며 대부분의 public chrome 데이터는 Header 쪽에서도 이미 client import한다. 검토할 작은 안은 Footer 자체에 동기 client 경계를 두거나, locale layout에서만 동기 client wrapper로 렌더하는 것이다. SSR은 유지하고 기존 주소·메일 복사·언어 dropdown·native links를 바꾸지 않는다. `src/components/builder/published/SiteFooter.tsx`의 추가 링크 호출도 영향 검토 대상이다.

가상 측정은 inline footer 모델과 Footer에만 연결된 모델/텍스트 참조를 작은 client reference로 바꿨다. 다른 곳에서 쓰는 참조와 module 행은 유지했다. 직접 8개 상세의 해당 모델 합계는 약 **7.9–12.2 KB raw**였다. 147개 가상 짝비교는 평균 **1,717 B gzip 감소**(1,083–2,174 B), 14,014개 단순 곱 **22.95 MiB**다. 새 client module/reference/JS chunk 비용과 실제 빌드의 chunk 재구성은 미포함이므로 최종 순절감으로 표현하지 않는다.

현재 index 투영과 Footer 변경을 함께 가정한 평균은 2,411 B로, 각각의 감소량 합계와 다르다. gzip 사전·순서 효과 때문에 별도 절감을 더하면 안 된다. 후보 2는 이번 승인 범위에서 구현하지 않는다.

## 제거 대상으로 삼지 않을 데이터와 후순위

- `page.tsx:252–269,313–366`: 서버는 전체 목록을 읽지만 상세로 넘기는 것은 현재 본문, 이전/다음 제목, 최대 15개 카드 필드다. 상세에 전체 칼럼 본문을 전송한다는 증거는 없다.
- `RecommendedForYou.tsx:70–77`: 15개 중 3개를 보여 주고 hydration 후 세션 읽기 관심으로 순서를 조정한다. 12개를 단순 삭제하면 동작을 줄인다. 공유 정적 카드 파일을 나중에 읽는 별도 설계는 가능하지만 현재 첫 수정의 범위가 아니다.
- `GlobalLanguagePicker.tsx:208,316`: 전체 overlay는 처음 `open=false`일 때 없다. 닫힌 헤더 팝업의 49개 메뉴 HTML을 제거한다는 절감 가설은 성립하지 않는다. Footer의 native `<details>`는 실제 번역 링크를 SSR로 제공한다. NL/RU/TA 표본은 49개 메뉴 링크와 50개 hreflang(x-default 포함), ARC는 14/15, ZH-Hans 단독 글은 1/2였으며 그대로 보존해야 한다.
- FAQ는 props의 `faqItems`와 `faqJsonLd`에 중복되지만 인접한 반복이 잘 압축된다. 기존 FAQ를 가진 80개 표본에서 schema prop만 파생하도록 가정한 평균 차이는 **100 B gzip**였다. 작은 순수 schema helper로 동일 출력을 만들 수는 있으나 첫 우선순위는 아니다.
- EN 목록은 카드 208개 JSON이 166,681 B다. `toColumnListItems()`가 이미 본문·FAQ를 제외한다. 목록의 검색/태그/날짜/주제 필터는 이 카드 자료를 쓰므로 몇 개만 남기는 안은 기능을 훼손한다. `/search`의 정적 검색 문서도 해당 페이지에만 삽입된다. 이 두 자료가 모든 상세에 반복되는 것으로 계산하지 않았다.
- 본문 Markdown이 SSR HTML과 Flight에 함께 있는 것은 현재 동기 `PublicColumnView`의 hydration 계약이다. [2026-10-03 회귀 기록](../../general-column-hydration-20261003.md)에 기존 서버 요소 스트리밍 경계에서 React 418이 재현됐고 현재 경계로 수정한 증거가 있다. Flight 삭제·SSR 본문만 유지·client-only 본문으로 바꾸는 안은 이 조사의 작은 첫 후보가 아니다.

## 통합 확인 항목

후보 1 구현 시 실제 파일 기반 검증으로 모든 49개 언어의 현재 글 링크 집합, 번역 없는 글, CMS-only/unknown slug, 홈·목록·issue 경로, 정상/잘못된 encoded path, 잘못된 헤더의 전체 map fallback, nonstatic layout의 글 간 SPA 이동을 확인한다. 제목·본문·카드·FAQ·JSON-LD·canonical/hreflang은 변경 전후 같아야 한다.

주 담당의 통합 빌드는 static flag와 동일 frozen CMS 입력으로 전후 HTML/gzip를 비교한다. Chromium PC/모바일, Firefox/WebKit 모바일, JS 없는 본문·native Footer links, 언어 picker 열기/닫기/선택, browser back/forward, 쿼리 검색·필터를 확인하고 `scripts/verify-column-hydration.mjs`의 느린 스트림 회귀도 유지한다. 실제 전체 package 한도와 최종 배포 판정은 배포 담당 결과와 합쳐 판단한다.

## 승인된 첫 구현의 상태

수정 파일은 `src/lib/column-language-links.ts`, `src/app/[locale]/layout.tsx`, 기존 `src/lib/__tests__/column-language-links.test.tsx`다. `staticPathname` 옵션을 받은 정상 ASCII pathname만 현재 글로 투영한다. 홈·목록·issue 경로는 빈 글 map과 기존 `columnLocales`, unknown/CMS-only/번역 없는 글은 기존의 현재 언어 전용 연결을 유지한다. percent-encoded 문자열은 유효한 인코딩이라도 임의로 정규화하지 않고 전체 map으로 돌아간다. 이는 비정상 URL을 새로 지원하는 변경이 아니다. 일반 SPA 호출은 옵션을 받지 않아 완전한 기존 map을 유지한다.

TDD 순서: 코드 변경 전 새 동작 11개가 전체 207개 slug를 받는 문제로 실패했고, 최소 구현 뒤 신규 32개 조건이 통과했다. 이후 기존 전체 칼럼·이슈·metadata/hreflang·SPA 검증을 포함한 해당 테스트 파일 **47/47 PASS**(18.54초). 변경 3개 파일 ESLint 경고 0, `git diff --check` 통과. 전체 빌드·일반/정적 렌더 비교·PC/모바일·느린 스트림 검증은 주 담당의 통합 단계에 남아 있다. 이 문서의 HTML 가상 절감값을 실제 변경 후 빌드 실측으로 바꿔 표기하지 않았다. commit/push/deploy는 하지 않았다.

재현 명령(기본 원문 10개는 이 폴더, 추가 147개는 임시 manifest 경로):

```sh
/Users/son7/.nvm/versions/node/v24.14.1/bin/node \
  docs/audit/all-locales-parity-20261025/research/html-size/analyze.mjs \
  /private/tmp/tseng-packer-experiment-20261025/manifest.json
```
