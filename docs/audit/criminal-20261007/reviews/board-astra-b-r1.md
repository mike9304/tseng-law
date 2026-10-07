# 형사소송 게시판·서비스 연결 독립 코드 검수 B

판정: APPROVE

검수일: 2026-10-07. 검수자: GPT-6 Astra max, 독립 검수자 B. 다른 검수자의 보고서를 읽지 않았으며 원고·제품 코드·테스트를 수정하지 않았다. 본 보고서는 직접 읽은 코드와 아래 독립 실행 결과에 대한 승인이다. 전체 QA·프로덕션 빌드·실제 브라우저·배포 완료를 대신하지 않는다.

저장소: `/Users/son7/Projects/tseng-law-criminal-20261007`

최종 비교 HEAD: `f1c13d5c458f3d4e5bbee7772fe98dc8a346b749`. 검수 중 최신 main의 세무 칼럼이 통합됐으며, 형사 원고 20개는 최종 원고 manifest와 다시 일치하는 것을 확인했다. 원고 자체의 법률·번역 검수는 `final-astra-b-r2.md`의 20 SHA 판정을 따른다.

## 확인한 동작

- `criminal-litigation-board.ts`는 제목 추측 없이 명시적인 `criminal-litigation` 태그로 선택한다. 내부 테스트 글과 동일 slug 중복을 제거하며, 발행일·칼럼 번호·slug 순으로 정렬한다. 입력 배열에 직접 sort하지 않는다. 파일 로더를 따라가 KO/EN/JA/ZH/VI 각각 자기 언어의 디렉터리를 읽는 것을 확인했다.
- 새 페이지는 지원하는 5언어만 허용한다. 언어별 칼럼 4개의 제목·요약·링크, 동일 언어 전체 칼럼과 서비스 링크, 언어 전환 링크를 렌더링한다. 실제 서버 렌더링 테스트에서 5언어 모두 칼럼 링크 4개와 canonical·hreflang을 확인했다. VI는 존재하는 `/vi/services`로 연결한다.
- CollectionPage JSON-LD는 게시판과 각 칼럼의 실제 언어별 URL을 사용한다. 공통 `JsonLd`의 script 종료 문자 escaping을 유지한다. 게시판 본문에 중첩 main을 추가하지 않는다. 활성 언어 표시, 언어 내비게이션 레이블, 장식용 이미지의 빈 alt를 확인했다.
- `/vi/criminal-litigation`은 guidance middleware에서 원래 파일 경로로 통과한다. ID 등의 미지원 언어는 기존 unavailable 규칙을 유지한다. VI와 JA 언어 전환은 게시판의 실제 경로를 가리킨다. 새 파일 경로를 public-route ownership에 등록하여 CMS 경로 충돌을 막는다.
- sitemap에 정확히 5개 게시판 URL을 추가하고, 5개 언어와 x-default의 동일 클러스터를 사용한다. 칼럼은 기존 실제 파일 기반 sitemap 경로에 포함된다. 최신 upstream 세무 콘텐츠를 제거하지 않는다.
- 일반 칼럼의 guidance·JA·CMS 발행·기본 렌더링 분기에서 게시판 연결을 확인했다. KO/EN/JA/ZH 헤더에 연결이 추가되며, VI는 칼럼 목록과 서비스 안내에서 접근한다. 서비스 페이지의 CMS 공개 slug가 바뀌어도 `sourceSlug`가 criminal이면 게시판 연결과 문구 처리가 유지된다. source lookup이 원래 slug도 인식하고 공개 slug로 redirect하는 기존 흐름까지 읽었다.
- `projectInternationalPublicCopy`는 기존의 정확한 기본 문구만 교체하고 사용자 정의 문구와 기존 칼럼 연결을 유지한다. 네 새 칼럼 slug는 중복 없이 추가한다. `sourceSlug: criminal`인 이름 변경 사례와 입력 객체 불변성을 실제 테스트했다. JA는 별도 일본어 데이터 경로를 유지한다.
- 형사 서비스에서 근거 없는 변호사 검수 문장을 표시하지 않는다. 담당 변호사 소개·연락 연결은 검수 주장과 구별되어 남는다. 새 서비스 요약 4언어를 직접 읽었으며, 친고죄 조건·범인을 안 때부터 6개월·1심 변론 종결 전 취소·취소자의 재고소 금지·고소인의 10일 재의·불필요한 압수물 반환 의무를 보존한다. 해당 법적 요건은 원고 검수에서 직접 열어 대조한 공식 형사소송법 237·238·256·142·416조와 일치한다.
- 새 게시판 문구 5언어와 서비스 요약 4언어에 결과 보장, 변호사·원어민 검수 주장, 굵은 강조 우회는 없다. 불필요하게 범위를 넓히는 기한·강제 반환 설명도 없다. 짧은 안내문으로서 구조·번역·리듬을 직접 확인했다. 원고용 문장 다양성 도구 통과를 TS UI 문구 검증으로 가장하지 않는다.

## 독립 실행 검증

사용 Node: `/Users/son7/.nvm/versions/node/v24.14.1/bin/node` v24.14.1. 각 명령은 저장소 루트에서 `node node_modules/vitest/vitest.mjs run <파일들>` 형태로 실행했다.

| 실행 묶음 | 결과 |
|---|---|
| 게시판 신규 테스트, JA 형사 서비스 데이터, JA 형사 서비스 페이지 | 3파일 16테스트 PASS |
| international-public-copy, public-route ownership/authoring, public-guidance, JA route policy, canonical-public-route-identity, sitemap, sitemap-static-lastmod | 8파일 598테스트 PASS |
| 최신 main 통합 후 게시판 재실행, embeddings-content-sync, pending-text-search | 3파일 21테스트 PASS |

중복 재실행한 게시판 10테스트를 한 번만 세면 13파일 625테스트가 통과했다. 총 실행 횟수 기준으로는 635개다. 마지막 실제 전체 텍스트 검색 테스트는 6.064초에 통과했다.

추가 점검:

- `git diff HEAD --check`: PASS.
- `git ls-files -u`: 출력 없음.
- `column-embeddings-pending.json`: 실제 JSON 파싱 PASS. 현재 HEAD의 368 entries를 모두 보존하고 KO/EN/ZH의 형사 4편씩 총 12개만 추가했으며, locale/slug 중복 0개다. JA/VI를 지원하지 않는 기존 embeddings 목록에 억지로 넣지 않았다.
- embeddings sync 테스트의 언어별 1회 로딩 변경은 반복 파일 읽기만 줄인다. 기존 중복·지원 언어·콘텐츠 존재·embedding과 pending 배타성·전체 커버리지 검사는 유지된다. pending text search는 전체 검색 검사를 유지한 채 제한 시간만 15초로 늘렸다. 실패 검사를 삭제하거나 무조건 통과시키는 변경은 없다.
- 관련 기존 테스트에서 칼럼 수·발행일·언어별 fixture 기대값 변경을 읽었다. JA의 과거 본문 완전 일치 검사는 새 주제의 핵심 법률 조건 및 금지 문구 검사로 바뀌었다. 새 본문과 링크를 렌더링하는 검사는 계속 존재한다.

## 검수 중 발견해 해소된 항목

현재 필수 수정 사항은 없다.

병합 중 `src/content/column-embeddings-pending.json`의 당시 1419·1477·1523행에 `<<<<<<< Updated upstream`, `=======`, `>>>>>>> Stashed changes`가 남아 `git diff --check`가 실패했다. JSON을 읽는 검색·검사 코드가 실패할 수 있어 즉시 원 작업자에게 전달했다. 수정 방향은 두 브랜치의 유효 entries를 보존하면서 형사 entries를 locale/slug 기준으로 합치는 것이었다. 원 작업자가 해소한 뒤 위 JSON 파싱·HEAD entries 보존·추가 12개·중복 0개·검색 및 동기화 테스트를 직접 재확인했다. 검수자는 파일을 수정하지 않았다.

## 검수 대상 SHA256

아래는 최종 읽은 변경 코드·연결 데이터·관련 테스트 29파일이다. 자동 생성되는 `next-env.d.ts`의 빌드 경로 변경은 제품 구현으로 취급하지 않았다. 이를 포함한 커밋 범위·최종 clean build 확인은 원 작업자의 통합 검증 범위다.

| 파일 | SHA256 |
|---|---|
| `src/app/[locale]/columns/JaColumnsView.tsx` | `7ade70688efb9e1bf64878198ce3748dbcc0b318941129459a201c1c6ca9bdcf` |
| `src/app/[locale]/columns/page.tsx` | `3f9ec7d08deab0298f03f3aaa7fa705938acd291277722fef6372a8751e93ff9` |
| `src/app/[locale]/criminal-litigation/page.tsx` | `cf1d88b68315b88c23221637e130928baccc5616aa15ae224823419594bac850` |
| `src/app/[locale]/llms.txt/__tests__/route.test.ts` | `c22f202cfe8b48fe30755a6c45a7e0aec3e3bd14499b81e2c8f0b59f542cc9c4` |
| `src/app/[locale]/services/[slug]/__tests__/ja-criminal-page.test.tsx` | `244a07c32554fe58cf6407cf8db4fc8df851f7279b73daf7c8ed9ff7eea0ef53` |
| `src/app/[locale]/services/[slug]/page.tsx` | `0ffe856846362b1a02bfa0a44ae36e1fbfc908da28283f2302fa389879863a70` |
| `src/app/__tests__/sitemap.test.ts` | `d908890f8dc8da2dc69416cacdaec03fa3f018560ca26e79046959092572d9f2` |
| `src/app/sitemap.ts` | `9ec47d13315dac1d7a84b2214b8760ce87b398f30b2a532fd09e868eb48207e5` |
| `src/components/CriminalBoardLink.tsx` | `cc70b47b06c7eb2eead6f606b44f47bffb51235c9a53d6eb21a2bc540a6b437f` |
| `src/components/GuidancePageBody.tsx` | `971c816666a5aac25d954fe2a70c874ef64657f4747ab7cf6d203f9ee732a8ec` |
| `src/components/Header.tsx` | `717e042858e26412797cac8e55677c4bc5eae1c5bf621b20feed0021a6a453d8` |
| `src/content/column-embeddings-pending.json` | `bbaa683e7c4213a2317c65e9d1a5a2228e320ef63bc69b250a4cc6ab569139e5` |
| `src/data/__tests__/service-details-ja-criminal.test.ts` | `0b179bca9cadfa918cdf7efbf73764227e89a444b2faad80a04af016c82572cf` |
| `src/data/criminal-service-copy.ts` | `1c45fdb1f32c670848bd813f375f5c0e746bfdeb179b0453202e3d34e92aae58` |
| `src/data/service-details-ja.ts` | `e690967462050e58220e11374fd671f7cdab7407247a7fcaed370445276ea5ed` |
| `src/data/service-details.ts` | `34e71027ca87c7eb73cccbef0355fc1e9f25fb28af1a451ccb88238e3d641bf2` |
| `src/lib/__tests__/column-category-parity.test.ts` | `b2d5ba5fb0ba542e6d60f9e7757abc25f9b4fd3933e7dfde7dbeeb50b9dcd6e7` |
| `src/lib/__tests__/column-embeddings-content-sync.test.ts` | `47d5c7a33f35fc8b86be4ef336eae43d54dfbc00de26f12f92f75a7c4330e7dd` |
| `src/lib/__tests__/column-pending-text-search.test.ts` | `cdc3cc8143bab4bf3fc62996b0559e5bdad412c295599924a887128f80e6d549` |
| `src/lib/__tests__/columns-new-four-locales.test.ts` | `779d81d0cf525bec495778209fdbc1855b8a4329357694925dfd3d5fef7137ac` |
| `src/lib/__tests__/columns-publication-date.test.ts` | `3abec7912834936c1fab7874f32c0ae59e44fc16a0fe683d841c8fd95bd8c185` |
| `src/lib/__tests__/criminal-litigation-board.test.tsx` | `93d62f1bdf206a8d6ca655ce57db660ae878e35ee16b74b3ba95f59665a69b9f` |
| `src/lib/__tests__/native-locale-columns.ts` | `4fc460ec92eea978f96928bf0c72ebd9971289e409bbe9466d628dc6107f199b` |
| `src/lib/__tests__/traffic-value-pursuit.test.ts` | `4a29f94f27507fd0984587fbc94c3b287dde0be148fbeb73f89ce6c555542719` |
| `src/lib/builder/site/public-route-ownership.ts` | `493dad5189d46b8c956c51c8552e45f10284d84fb766677906501ec109aeb7f4` |
| `src/lib/criminal-litigation-board.ts` | `933a54c9f7195b78e4bccdf6a1367b6222d10bf1bb11da2a049b541e60271f3c` |
| `src/lib/public-guidance.ts` | `c00a193d0dd583145e544a2cc505efad75a4379f5c334a811655a689d6df8d85` |
| `src/lib/public-route-policy.ts` | `7a71128c423d76057bd50e791189533ab96789594aef994f4346f4ead2c6607c` |
| `src/lib/services/international-public-copy.ts` | `d302008663a8dd01f1116bf51865e1a32e7d6fedf094952ea1109f38e6a3b37e` |

추가 필수 수정은 없다. 전체 QA·빌드·실제 화면·공개 URL의 상태는 검수자가 실행한 위 테스트 결과와 구별하여 최종 인계에 기록해야 한다.
