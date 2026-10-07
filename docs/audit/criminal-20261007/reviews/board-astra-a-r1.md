# 형사 게시판·서비스 독립 검수 A / r1

검수일: 2026-10-07. 검수자: GPT-6 Astra, AI 독립 검수. 변호사 또는 인간 원어민 검수가 아니다. 다른 검수자의 보고서를 읽거나 의견을 교환하지 않았다. 작업트리 `/Users/son7/Projects/tseng-law-criminal-20261007`의 게시판·서비스 변경을 읽었고 원고·코드를 수정하지 않았다. 401–404 본문 검수와 별도 결과다.

판정: REQUEST_CHANGES. 아래 두 항목은 r1 검수 시점의 결과다. 주 작업자는 전달받은 뒤 sourceSlug 보존 및 일본어 회귀 테스트 갱신을 진행하겠다고 알렸다. 이 보고서는 그 후속 수정의 통과 판정이 아니다.

## 수정 필요

### P2 / B-A1 — 공개 slug 변경 시 형사 서비스 보정이 빠짐

- 위치: `src/lib/services/international-public-copy.ts:65`, `src/app/[locale]/services/[slug]/page.tsx:187`, 같은 파일 `:464`와 `:465`.
- 원문/조건: `record.slug === 'criminal'`, `area.slug === 'criminal'`, `area.slug !== 'criminal'`.
- 이유: 기존 `src/lib/builder/services/source.ts:42`의 merge는 `sourceSlug: 'criminal'`을 유지하면서 공개 `slug`를 CMS override로 변경할 수 있다. `readServiceAreaSourceRecordBySlug`는 원래 주소와 변경 주소 모두에서 그 레코드를 찾는다. 그런데 페이지가 projection에 sourceSlug를 전달하지 않아, 예를 들어 `slug: 'criminal-defense'`이면 예전 기본 keyPoints 보정과 신규 관련 칼럼 추가가 빠진다. 같은 원인으로 게시판 링크도 사라지고, 이번에 제외한 “변호사가 검토했다”는 문구도 다시 표시된다. 정상 CMS 기능으로 생성 가능한 입력이며 실제 운영 데이터가 현재 그렇게 설정됐다고 주장하는 것은 아니다.
- 재현 입력: `mergeServiceAreaSourceRecords([{ sourceSlug: 'criminal', slug: 'criminal-defense', keyPoints: { ko: PREVIOUS_CRIMINAL_SERVICE_POINTS.ko }, columnSlugs: ['custom-column'] }])`에서 해당 레코드를 페이지의 현재 방식으로 지역화해 projection한다. 기존 잘못된 기본 문구가 그대로 남는 분기다.
- 수정안: `LocalizedServiceCopy`와 페이지 레코드에 안정적인 sourceSlug를 보존하고 `(sourceSlug ?? slug) === 'criminal'`로 형사 서비스 여부를 판정한다. 공개 주소에는 변경 slug를 계속 사용한다. 새 법률 문구 보정·관련 칼럼·게시판 링크·검토 주장 제외가 모두 같은 판정을 사용해야 한다.
- 의미 보존: 사용자가 설정한 주소와 사용자 작성 문구는 유지한다. 정확히 일치하는 옛 기본 문구만 교체하는 현재 원칙도 유지한다.
- 확인 기준: ko/zh-hant/en의 변경 slug + 옛 기본 keyPoints + custom point/column 조합을 검증한다. 보정 뒤 옛 기본 문구가 없고 custom 항목은 남아야 하며, 렌더링 시 게시판 링크가 있고 변호사 검토 주장이 없어야 한다.

### P2 / B-A2 — 일본어 형사 서비스 기존 검사 4개 실패

- 위치: `src/data/service-details-ja.ts:81` 변경에 대응하는 `src/data/__tests__/service-details-ja-criminal.test.ts:24`, `:34`, `:70`, `:105`.
- 원문/조건: 옛 `expectedCriminal` 전체 일치, 모든 항목 `length > 120`, 회사법·교통·취업 관련 옛 키워드 강제.
- 이유: 이번 변경이 keyPoints 범위를 형사 절차로 바꾸었으나 기존 검사는 종전 장문 다섯 개를 계속 요구한다. 직접 실행 결과 5개 중 4개가 실패했다. 새 문구의 법률 오류를 뜻하는 것은 아니지만 현재 작업트리의 관련 회귀 검사는 통과하지 않는다.
- 수정안: 새 절차 범위를 검증하도록 기대값/조건을 갱신한다. 6개월 적용 범위·범인을 안 시점, 1심 변론 종결 전 철회와 재고소 금지, 재의 10일과 원 검사 경유, 압수물의 보관 필요성 등 실질 조건을 남긴다. 임의의 120자 하한은 제거하고 일본어 유지·과장/잘못된 보편 기한 금지·prototype-safe 조회 검사는 보존한다.
- 의미 보존: 테스트를 통과시키기 위해 공개 문구를 옛 장문으로 되돌릴 필요는 없다. 바뀐 공개 범위에 맞춰 필요한 법률 조건을 검사한다.

## 확인 결과

- ko/zh-hant/en/ja/vi 다섯 경로에서 로컬 파일의 명시적인 `criminal-litigation` 태그로 네 칼럼을 선택한다. 내부 테스트 글과 중복 slug 제외, 발행일/번호 정렬은 타당하다. 제목 키워드 추측으로 무관한 글을 끌어오지 않는다.
- 다섯 canonical과 다섯 언어 + x-default alternates, CollectionPage의 실제 로컬 칼럼 URL이 일치한다. vi middleware 통과 예외와 JA dedicated route 등록이 추가되어 언어 전환이 실제 게시판 주소를 유지한다. 다른 guidance 언어의 게시판을 있다고 광고하지 않는다.
- 각 언어 칼럼 목록에서 게시판 링크가 렌더된다. ko/zh-hant/en/ja는 공통 헤더에서도 진입할 수 있다. vi는 칼럼 목록 및 실제 존재하는 `/vi/services`에서 진입하며, 게시판의 서비스 링크도 `/vi/services`로 연결한다.
- 서버 컴포넌트 반환에는 중복 main이 없다. 상위 `CinematicRouteShell`이 main을 제공한다. H1 하나와 카드 H2, 언어 nav의 이름과 현재 페이지 표시, 카드의 장식용 이미지 alt=""는 구조상 적절하다. 기존 CSS는 언어 링크의 줄바꿈과 44px 최소 높이, 작은 화면의 1열 카드를 지원한다. 브라우저 색상 대비·실제 헤더 넘침·키보드 조작은 이번 독립 검수에서 직접 실행하지 않았으므로 화면 검증 완료라고 주장하지 않는다.
- 새 서비스 문구의 6개월을 모든 형사사건에 확대하지 않는 조건, 고소취소 기한·재고소 제한, 고소인의 재의 및 예외 확인, 보관 필요성 없는 압수물 반환과 별도 불복 요건을 공식 원문과 대조했다. 이 짧은 안내 범위에서 추가 법률 수정은 요구하지 않는다.
- 모든 공개 신규 문구에 상담 경험·결과 보장·검색량 수치·인간 검수 완료 주장이 없다. 짧은 서비스 요약과 게시판 소개에서 별도의 MONOTONY 반려 사유는 찾지 않았다. 칼럼 본문용 variety 수치를 이 TS/TSX 코드에 적용하여 문체 통과라고 보고하지 않는다.

## 직접 실행한 검사

Node `/Users/son7/.nvm/versions/node/v24.14.1/bin/node` 사용.

1. `node node_modules/vitest/vitest.mjs run src/lib/__tests__/criminal-litigation-board.test.tsx` — 10/10 통과.
2. 관련 9개 기존 테스트 파일 — 총 584개 중 580 통과, 4 실패. 실패는 전부 B-A2의 일본어 형사 서비스 테스트다. public-guidance 480개, public-route-policy 16개, route-ownership 33개, sitemap 36개, 기존 international-public-copy 5개, 칼럼→서비스 링크 1개, 일본어 헤더 6개, guidance 헤더 2개는 통과했다.

전체 빌드/typecheck는 주 작업자가 의존성 버전 문제를 조사 중이므로 중복 실행하지 않았다. 단위 테스트의 기존 SSR useLayoutEffect/inert 경고를 새 게시판 런타임 결함으로 단정하지 않았다. 서비스 DB/Blob/운영 게시 데이터는 수정하거나 검증했다고 주장하지 않는다.

## 법률 원문

2026-10-07 웹 도구로 직접 열람한 대만 법무부 전 국민 법규 자료의 현재 게시 조문이다.

- [형사소송법 제237조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=237): 고소가 소추 조건인 죄, 고소권자가 범인을 안 때부터 6개월.
- [제238조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=238): 제1심 변론 종결 전 고소취소, 취소한 사람의 재고소 제한.
- [제256조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=256): 처분서를 받은 고소인의 10일 재의와 원 검사 경유, 동의한 특정 처분의 예외.
- [제142조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=142): 보관 필요성 없는 압수물의 반환과 임시 반환.
- [제416조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=416): 열거된 처분의 취소·변경 신청 및 별도 기한.
