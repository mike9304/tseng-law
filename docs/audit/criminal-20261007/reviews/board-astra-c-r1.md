# 형사 게시판·서비스 코드 독립 검수 C — r1

판정: APPROVE

검수자: GPT-6 Astra / reasoning max, 독립 검수자 C. 2026-10-07 KST.

새 게시판의 page/component/data/helper와 관련 변경 diff를 실제 읽었다. sourceSlug 반영, 일본어 서비스 테스트 변경, 최신 main 통합 후 corpus 테스트 최적화까지 확인했다. 다른 검수자의 보고서를 읽거나 의견을 교환하지 않았고 코드·원고를 수정하지 않았다. 원고 20편은 별도 final-astra-c-r2.md에서 승인했으며, 최신 통합 뒤에도 해당 manifest의 20 SHA가 일치한다.

이 판정은 아래 SHA의 코드·공개 문구 및 이 검수자가 실행한 테스트 범위에 한정한다. 실제 변호사·원어민 검수나 전체 운영 배포 완료를 뜻하지 않는다.

## 미해결 필수 지적

없음. 검수 중 sourceSlug 변경 지원과 JA 기존 테스트 수정은 최종 후보에서 완료됐으며, 그 동작을 독립 테스트로 확인했다.

## 기능·연결 검토

| 영역 | 확인한 동작과 판단 |
| --- | --- |
| 게시판 선정 | 제목 추정 없이 criminal-litigation 태그로 선정. 중복 slug와 내부 E2E 기록을 제거하고 발행일·번호·slug로 정렬. 각 언어의 실제 파일에서 401~404 네 글을 얻으며 다른 언어 파일로 대체하지 않는다. |
| 다섯 언어 페이지 | ko/zh-hant/en/ja/vi만 허용하고 다른 locale은 notFound 처리. 네 카드·원 언어의 상세 링크·전체 칼럼 링크·언어 전환이 있다. VI는 존재하는 services 안내로, 핵심 네 언어는 criminal 서비스로 이동한다. |
| 공개 경로 | VI 경로를 guidance catch-all이 가로채지 않게 하고 JA 전용 경로에 등록. 빌더 파일 경로 소유권 목록에도 추가했다. 지원하지 않는 guidance 언어의 형사 게시판을 가짜 대체 URL로 열지 않는다. |
| 발견 경로 | 일반 칼럼의 guidance/CMS/기본 렌더 분기, 별도 JA 뷰, 핵심 언어 헤더, 네 언어 형사 서비스 및 VI 서비스 안내에서 게시판으로 연결한다. 클라이언트가 사용하는 CriminalBoardLink의 import 경로에는 fs 등 서버 전용 모듈이 유입되지 않는다. |
| 메타데이터·구조화 데이터 | 각 언어 self-canonical, 다섯 언어 및 x-default hreflang. CollectionPage의 목록 URL은 언어별 실제 상세 URL이다. 기존 noindex 규칙이 새 게시판을 제외하지 않는다. sitemap에 다섯 URL을 추가하며 기존 URL 중복 제거와 언어 대조 처리를 유지한다. |
| 서비스 CMS 통합 | 원본 sourceSlug를 전달하여 CMS가 criminal slug를 바꿔도 해당 업무를 식별한다. 기존 /services/criminal로 들어오면 sourceSlug 조회 후 현재 slug로 영구 이동하는 기존 처리와 맞는다. 정확히 일치하는 이전 기본 문장만 바꾸고 사용자 수정 문구를 보존한다. 네 칼럼 slug를 중복 없이 추가하며 입력 객체를 변형하지 않는다. |
| JA 서비스 | 일본어 전용 데이터 경로와 본문을 유지하면서 새 법률 문구·네 관련 글·게시판을 연결한다. 기존 '준비 중'과 근거 없는 내용 확인 완료 문구를 노출하지 않는 렌더 테스트를 통과했다. |
| 작성/검수 귀속 | 형사 서비스에서 기존 변호사의 내용 확인 완료 문장을 제거했다. 변호사 소개·연락 정보의 Person 데이터는 검수 완료 표기와 구별된다. 게시판에 AI 원고를 변호사 저작/감수라고 표시하는 새 속성은 없다. |
| 이미지·접근성 | 카드의 이미지는 같은 링크 안 제목을 보조하는 장식으로 빈 alt를 사용한다. 링크 이름은 제목·요약·읽기 문구에 있으며 버튼처럼 보이는 언어 링크에는 hrefLang과 현재 언어 표시가 있다. 페이지 자체에 중첩 main을 만들지 않는다. |
| 검색 데이터 | 지원되는 embedding locale ko/en/zh-hant 12개 새 글을 pending에 정확히 등록했다. 가짜 벡터나 미실행 embedding 완료를 만들지 않았다. 실제 파일 기반 텍스트 검색 검증이 새 글을 포함한 전체 pending 집합에 대해 통과했다. |

## 공개 법률 문구와 의미 보존

5언어 게시판 제목·설명은 네 칼럼의 실제 범위와 맞고 전문 감수·성과·기한 보장을 주장하지 않는다. 네 핵심 언어의 서비스 항목은 이번 원고 검수에서 직접 확인한 공식 조문 범위와 대조했다. VI에는 별도의 형사 서비스 상세문을 만들어 다른 언어를 노출하지 않는다.

| 종전 문구/문제 | 수정 확인 | 보존해야 하는 조건 |
| --- | --- | --- |
| 모든 형사 고소의 기한을 6개월로 묶던 기본 문구 | 고소가 소추 요건인 죄와 고소권자가 범인을 안 때를 명시 | 제237조의 대상·주체·기산점·6개월. 사건일 또는 귀국일로 대체하지 않음 |
| 합의/취소/종결을 짧은 홍보 항목으로 읽을 위험 | 1심 변론 종결 전, 취소한 사람의 재고소 제한, 지급조건과 취소 문구를 함께 읽는 설명 | 제238조의 기한과 효과. 돈을 받으면 자동으로 끝난다는 주장이 없음 |
| 불기소 불복 경로를 일반 안내로만 다룰 위험 | 고소인, 수령 후 10일, 원 검사를 경유한 재의, 자격·예외·송달 계산 확인 | 제256조의 한정. 다른 종류의 신고인·임의의 번역 완료일을 기준으로 삼지 않음 |
| 압수물은 사건 종결까지 기다려야 한다는 오해 | 계속 보관 불필요 시 법원 결정/검사 명령으로 종결 전 반환 의무 | 제142조. 임시 반환의 재량과 제416조 불복 요건·기간을 별도로 확인 |
| 일본어 서비스의 기존 확인 완료·관련 글 준비 중 문장 | 해당 업무에서는 확인 완료 문장을 제거하고 실제 네 글을 연결 | 실제 변호사 검수 여부에 대한 허위 주장 금지. 변호사 소개 정보 자체와는 구별 |

근거: [형사소송법 제237조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=237), [제238조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=238), [제256조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=256), [제142조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=142), [제416조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=416). 실제 원문 열람과 조건 대조 기록은 본 검수자의 원고 r1/r2 보고서에 있다.

## 직접 실행한 검증

최신 main 통합 후 Node v24.14.1로 아래 15개 테스트 파일을 실행했다. 최종 실행 결과: 15 files passed, 705 tests passed, exit 0, 19.50초. 첫 기본 npx 실행은 Homebrew Node의 llhttp 동적 라이브러리 오류로 실패했으나 애플리케이션 실패로 분류하지 않았고, 제공된 정상 런타임으로 다시 검증했다.

| 테스트 파일 | 통과 수 |
| --- | ---: |
| criminal-litigation-board.test.tsx | 10 |
| service-details-ja-criminal.test.ts | 3 |
| services/[slug]/__tests__/ja-criminal-page.test.tsx | 3 |
| sitemap.test.ts | 36 |
| column-summary-frontmatter.test.ts | 8 |
| column-seo-title-frontmatter.test.ts | 6 |
| columns-publication-date.test.ts | 12 |
| public-guidance.test.ts | 480 |
| public-route-ownership.test.ts | 33 |
| public-route-policy-ja-investment.test.ts | 16 |
| llms.txt/__tests__/route.test.ts | 31 |
| column-category-parity.test.ts | 49 |
| columns-new-four-locales.test.ts | 7 |
| column-embeddings-content-sync.test.ts | 10 |
| column-pending-text-search.test.ts | 1 |

명령은 `PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH node node_modules/vitest/vitest.mjs run <위 15개 파일의 경로>`이다. 코드와 실제 파일 내용을 사용하는 테스트이며 카드 수·local link·canonical/hreflang·지원 언어 경계·sourceSlug/사용자 문구 보존을 확인한다.

embedding 동기화 테스트의 변경은 같은 언어 파일을 한 번만 읽도록 바꾼 것이며 검증 조건을 제거하지 않았다. 전체 pending 텍스트 검색 테스트는 전수 검색을 그대로 수행하면서 그 테스트에만 15초 제한을 적용한다. 최신 직접 실행에서 6.275초에 통과하여 기존 5초 제한 초과의 이유와 부합한다. 전체 테스트 전역 제한을 늘린 변경은 없다. corpus 수량·언어 교집합 테스트 수정은 새 다섯 언어 배치를 반영하고 있으며 메타데이터·분류 일치 검증을 유지한다.

`git diff HEAD --check`도 통과했다. 검수자가 전체 QA·프로덕션 빌드·배포를 실행했다는 주장은 하지 않는다. 127.0.0.1:3107의 HTML 확인을 시도했을 때 최신 main 통합을 위해 서버가 중단된 상태여서 다섯 URL 모두 Connection refused였으며, 이를 실제 화면 통과로 기록하지 않는다. 이 보고서는 타인의 화면 검증 보고서를 열람하여 독립 검증으로 재표시하지 않았다.

## 검수 대상 고정

통합 기준 HEAD: `f1c13d5c458f3d4e5bbee7772fe98dc8a346b749`. 아래 SHA-256은 코드·테스트·데이터의 실제 파일 바이트다. 자동 생성된 next-env.d.ts의 개발용 경로 변경은 기능 판정에서 제외했다.

| 파일 | SHA-256 |
| --- | --- |
| `src/app/[locale]/columns/JaColumnsView.tsx` | `7ade70688efb9e1bf64878198ce3748dbcc0b318941129459a201c1c6ca9bdcf` |
| `src/app/[locale]/columns/page.tsx` | `3f9ec7d08deab0298f03f3aaa7fa705938acd291277722fef6372a8751e93ff9` |
| `src/app/[locale]/llms.txt/__tests__/route.test.ts` | `c22f202cfe8b48fe30755a6c45a7e0aec3e3bd14499b81e2c8f0b59f542cc9c4` |
| `src/app/[locale]/services/[slug]/__tests__/ja-criminal-page.test.tsx` | `244a07c32554fe58cf6407cf8db4fc8df851f7279b73daf7c8ed9ff7eea0ef53` |
| `src/app/[locale]/services/[slug]/page.tsx` | `0ffe856846362b1a02bfa0a44ae36e1fbfc908da28283f2302fa389879863a70` |
| `src/app/__tests__/sitemap.test.ts` | `d908890f8dc8da2dc69416cacdaec03fa3f018560ca26e79046959092572d9f2` |
| `src/app/sitemap.ts` | `9ec47d13315dac1d7a84b2214b8760ce87b398f30b2a532fd09e868eb48207e5` |
| `src/components/GuidancePageBody.tsx` | `971c816666a5aac25d954fe2a70c874ef64657f4747ab7cf6d203f9ee732a8ec` |
| `src/components/Header.tsx` | `717e042858e26412797cac8e55677c4bc5eae1c5bf621b20feed0021a6a453d8` |
| `src/content/column-embeddings-pending.json` | `bbaa683e7c4213a2317c65e9d1a5a2228e320ef63bc69b250a4cc6ab569139e5` |
| `src/data/__tests__/service-details-ja-criminal.test.ts` | `0b179bca9cadfa918cdf7efbf73764227e89a444b2faad80a04af016c82572cf` |
| `src/data/service-details-ja.ts` | `e690967462050e58220e11374fd671f7cdab7407247a7fcaed370445276ea5ed` |
| `src/data/service-details.ts` | `34e71027ca87c7eb73cccbef0355fc1e9f25fb28af1a451ccb88238e3d641bf2` |
| `src/lib/__tests__/column-category-parity.test.ts` | `b2d5ba5fb0ba542e6d60f9e7757abc25f9b4fd3933e7dfde7dbeeb50b9dcd6e7` |
| `src/lib/__tests__/column-embeddings-content-sync.test.ts` | `47d5c7a33f35fc8b86be4ef336eae43d54dfbc00de26f12f92f75a7c4330e7dd` |
| `src/lib/__tests__/column-pending-text-search.test.ts` | `cdc3cc8143bab4bf3fc62996b0559e5bdad412c295599924a887128f80e6d549` |
| `src/lib/__tests__/columns-new-four-locales.test.ts` | `779d81d0cf525bec495778209fdbc1855b8a4329357694925dfd3d5fef7137ac` |
| `src/lib/__tests__/columns-publication-date.test.ts` | `3abec7912834936c1fab7874f32c0ae59e44fc16a0fe683d841c8fd95bd8c185` |
| `src/lib/__tests__/native-locale-columns.ts` | `4fc460ec92eea978f96928bf0c72ebd9971289e409bbe9466d628dc6107f199b` |
| `src/lib/__tests__/traffic-value-pursuit.test.ts` | `4a29f94f27507fd0984587fbc94c3b287dde0be148fbeb73f89ce6c555542719` |
| `src/lib/builder/site/public-route-ownership.ts` | `493dad5189d46b8c956c51c8552e45f10284d84fb766677906501ec109aeb7f4` |
| `src/lib/public-guidance.ts` | `c00a193d0dd583145e544a2cc505efad75a4379f5c334a811655a689d6df8d85` |
| `src/lib/public-route-policy.ts` | `7a71128c423d76057bd50e791189533ab96789594aef994f4346f4ead2c6607c` |
| `src/lib/services/international-public-copy.ts` | `d302008663a8dd01f1116bf51865e1a32e7d6fedf094952ea1109f38e6a3b37e` |
| `src/app/[locale]/criminal-litigation/page.tsx` | `cf1d88b68315b88c23221637e130928baccc5616aa15ae224823419594bac850` |
| `src/components/CriminalBoardLink.tsx` | `cc70b47b06c7eb2eead6f606b44f47bffb51235c9a53d6eb21a2bc540a6b437f` |
| `src/data/criminal-service-copy.ts` | `1c45fdb1f32c670848bd813f375f5c0e746bfdeb179b0453202e3d34e92aae58` |
| `src/lib/criminal-litigation-board.ts` | `933a54c9f7195b78e4bccdf6a1367b6222d10bf1bb11da2a049b541e60271f3c` |
| `src/lib/__tests__/criminal-litigation-board.test.tsx` | `93d62f1bdf206a8d6ca655ce57db660ae878e35ee16b74b3ba95f59665a69b9f` |

이후 기능 또는 공개 문구가 바뀌면 해당 변경분 확인 없이 이 판정을 자동 승계하지 않는다.
