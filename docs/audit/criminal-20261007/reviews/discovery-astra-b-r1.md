# 형사소송 칼럼 노출 수정 — 독립 검수 B

판정: APPROVE

검수일: 2026-10-07. 검수자: GPT-6 Astra max, 독립 검수자 B. 다른 검수자의 의견·보고서를 읽지 않았으며 소스·원고·테스트를 수정하지 않았다. 필수 수정 사항은 발견하지 못했다.

## 대상 및 고정 상태

- 저장소: `/Users/son7/Projects/tseng-law-criminal-20261007`
- 기준 HEAD: `11f68f14896b5e31536cf1c5495f44a745491d7c`
- 고정 manifest: `/Users/son7/tseng-criminal-20261007/DISCOVERY-SHA.json`
- manifest SHA256: `dc6e74f562bcd2db18441d74184ce5ef96748c70a62226d920b43d5c3658a471`
- 32개 실제 파일 SHA가 manifest와 모두 일치한다. 원고 20개는 기준 HEAD의 바이트열에서 `topic: "litigation"`을 `topic: "criminal"`로 바꾼 결과와 정확히 같음을 스크립트로 확인했다. 제목·요약·FAQ·법률 본문·공식 출처·AI author·이미지 표시는 변경되지 않았다.
- 자동 생성 `next-env.d.ts`의 경로 변화는 32개 제품 변경 manifest에 포함되지 않는다.

## 독립적으로 확인한 내용

### 일반 목록과 형사 필터

`src/lib/column-topics.ts:11`의 topic 목록과 4개 UI 언어 라벨에 criminal이 추가되어 파일 로더, 분류 유효성 검사, 필터, 카드 배지와 섹션 제목이 같은 식별자를 사용한다. 기존 topic과 legacy slug 매핑 및 category fallback은 유지한다.

`ColumnsGrid.tsx:593,633`에서 새 값을 유효한 topic으로 처리하고 해당 topic의 글만 선택한다. 실제 KO/ZH/EN/JA 데이터를 읽는 신규 테스트에서 `?topic=criminal`은 각 언어의 4편을 빠짐없이 표시하며, 다른 소송 글을 섞지 않는다. 법인설립·가사·세무 등 기존 topic, 옛 `?category=` 링크, 검색·작성자·연도·월 조합 및 초기화 검사는 계속 통과한다. 형사 4편이 기존 litigation 필터에서 criminal로 이동하는 것은 이번 분류 변경에 따른 의도된 결과다.

마지막 추가 변경인 `ColumnsGrid.tsx:489`의 검색 함수와 신규 검색 검사를 별도로 읽었다. 기존 제목·요약·category·작성자·태그 검색에 현재 UI 언어의 topic 라벨을 추가한다. KO/ZH/EN/JA의 분류명으로 검색하면 해당 형사 4편이 결과에 포함되고, criminal 필터와 함께 쓰면 정확히 4편이 나온다. 검색만 할 때 같은 표현을 가진 다른 글도 결과에 나올 수 있어 검색 검사가 불필요하게 결과를 4개로 고정하지 않는 점도 적절하다. 원시 topic 식별자나 다른 언어 라벨을 무조건 끼워 넣지 않으며, VI 등 guidance 언어는 기존 category 검색 동작을 유지한다. `useMemo` 의존성에 locale을 넣어 언어가 바뀐 경우에도 결과를 다시 계산한다.

필터를 적용하지 않은 기본 화면은 기존 추천 영역과 topic별 미리보기 구조를 유지한다. 따라서 기본 화면에서 네 글을 전부 같은 섹션에 복제하는 수정은 아니다. 형사 chip과 전용 게시판 링크가 모아 보는 진입점이고, 형사 필터에서는 네 글이 함께 표시된다.

### 링크 위치와 CMS 발행 경로

`ColumnsGrid.tsx:726`은 동일 언어 일반 칼럼 목록일 때만 검색창보다 앞에 형사 게시판 링크를 넣는다. 부모 `columns/page.tsx`와 `JaColumnsView.tsx`의 기존 링크를 제거하여 목록 말미의 중복을 없앤다. KO/EN/JA/ZH/VI의 일반 목록에 각 언어의 링크가 렌더링되고, `hrefBase="/ko/columns/issues"`인 별도 이슈 목록에는 삽입되지 않는다.

운영에서 사용하는 CMS 경로를 코드로 따라 확인했다.

1. `src/lib/builder/site/public-page.tsx:587`에서 파일·CMS 칼럼을 읽는다.
2. 같은 파일 1199행의 `legacy-page-columns` 소비자에게 카드용 데이터를 넘긴다.
3. `src/lib/builder/components/composite/Render.tsx:351`에서 `ColumnsLegacyPageBody`를 렌더링한다.
4. `src/app/[locale]/(legacy)/legacy-page-bodies.tsx:413`에서 이번에 수정한 공용 `ColumnsGrid`를 사용한다.

따라서 이번 링크 이동은 파일 기반 fallback에만 적용되는 변경이 아니다. CMS 발행 목록에서도 검색 앞 위치를 공유한다. `toColumnListItems`가 topic을 계속 전달하고, 파일에서 유래한 CMS 문서가 별도 topic을 갖지 않을 때 파일 topic을 읽는 기존 backfill도 확인했다. 임의로 CMS 사용자 지정 topic을 덮어쓰는 변경은 없다.

`CriminalBoardLink`의 새 `contained=false`는 이미 container 안에 있는 목록에서 중첩 container와 추가 상단 여백을 피한다. 기본값 true는 서비스 등 기존 호출의 구조를 보존한다. 명시적으로 목록 repeater를 숨긴 분기에서는 해당 목록 내부 링크도 함께 숨겨진다.

### 언어·모바일·기존 표현

- KO는 `전체 → 형사소송`, ZH의 지역별 순서도 `全部 → 刑事訴訟`이 된다. 기존 가로 스크롤 chip 스타일에서 새 항목이 뒤쪽으로 밀리는 원인을 줄이는 변경이다.
- EN·JA는 기존 지역별 순서를 보존하면서 criminal을 litigation 앞에 추가한다. JA의 `Record<ColumnTopic, string>`과 `JaColumns.module.css:168`에는 장식 glyph `訴`를 사용한다. 마지막 수정으로 기존 글꼴 subset에 없는 `刑`을 쓰지 않게 됐다. 텍스트 라벨 `刑事訴訟`은 그대로이며, 장식 문자는 기존 litigation과 공유해도 topic을 구별하는 라벨·필터에는 영향이 없다. React 장식의 `aria-hidden` 및 CSS 장식의 빈 대체 텍스트도 유지된다.
- VI는 기존 category 중심 목록을 유지하고 베트남어 전용 게시판 링크를 검색 앞에 보여 준다. 이번 변경이 VI에도 topic chip을 추가한다고 해석하지 않았다. 미지원 언어에는 `isCriminalBoardLocale`에 의해 링크가 렌더링되지 않는다.
- 링크의 기존 키보드 접근·anchor 의미를 유지하며, 버튼 필터의 `aria-pressed`와 검색·초기화 코드는 바뀌지 않는다. 기존 KO/ZH 모바일 가로 스크롤 CSS와 EN의 어두운 배경용 링크 색상 상속을 읽었다.
- 원고가 AI 작성임을 나타내는 데이터와 카드의 검수 byline 억제는 유지된다. 새 법률 문장이나 검수 주장을 추가하지 않는다.

## 실제 실행한 검사

Node `/Users/son7/.nvm/versions/node/v24.14.1/bin/node` v24.14.1로 Vitest를 직접 실행했다.

| 묶음 | 결과 |
|---|---|
| criminal-column-discovery, column-topics, criminal-litigation-board | 3파일 29테스트 PASS |
| ColumnsGrid-topics, columns-filter-recovery, columns-grid-guidance-labels, zh-hant-columns-curation, ja-arrangement | 5파일 128테스트 PASS |
| composite-render-localization, ja-archive-visibility | 2파일 20테스트 PASS |
| 마지막 JA 장식 변경 후 ja-display-subset, criminal-column-discovery 재실행 | 2파일 12테스트 PASS |
| 최종 분류명 검색 변경 후 criminal-column-discovery, columns-filter-recovery, columns-grid-guidance-labels 재실행 | 3파일 126테스트 PASS |

중복 재실행을 한 번만 세면 총 11파일 182테스트 PASS이며, 실행 횟수로는 315개다. `git diff --check` PASS. 테스트를 추가·변경하여 통과시키지 않았다. 최종 JA 두 파일을 직접 다시 읽고, 장식 문자열이 실제 글꼴 subset 목록에 포함되는 검사를 실행했다. 이후 검색 변경의 3파일 126테스트를 다시 실행했으며, 신규 discovery 파일은 최종 15테스트다.

최초 신규 11개 테스트는 실제 원고 로딩, 4언어 criminal 필터, 5언어 링크의 DOM 순서, KO chip 순서, 이슈 게시판 제외를 확인한다. 마지막에 4언어의 분류명 검색 단독 및 topic 필터 조합을 확인하는 4테스트가 추가됐다. 기존 filter-recovery 테스트에서는 연속 검색·chip 동작과 URL 갱신, 관련 없는 query parameter 보존, 옛 category 필터, 빈 결과·초기화도 실행된다. composite-render-localization은 실제 legacy composite 렌더러의 검색 표시를 확인하며, JA 테스트는 hero/repeater/schema의 독립적인 표시 조건을 확인한다.

## 증거의 범위

`discovery-before/results.json`의 원 작업자 측 운영 관측 기록을 읽었다. 기록상 KO 목록의 형사 전용 링크는 desktop Y8399, mobile Y7526에 있었고 criminal chip은 없었다. 이 기록을 검수자가 직접 브라우저에서 재현한 것으로 표시하지 않는다.

검수자는 이번 턴에서 브라우저를 조작하거나 수정 후 화면의 실제 좌표·클릭·overflow를 측정하지 않았다. SSR의 DOM 순서와 CSS 읽기만으로 “모바일 화면 안에 완전히 보인다”는 주장을 하지 않는다. 전체 QA·clean build와 수정 후 PC/모바일 운영 화면 확인은 주 에이전트가 수행하는 통합 검증 범위다. 법률 본문 변경이 없으므로 법령을 새로 검색하거나 전체 원고 문체 검사를 반복한 것으로도 기록하지 않는다.

## 최종 파일 SHA256

| 파일 | SHA256 |
|---|---|
| `src/app/[locale]/columns/JaColumnsView.tsx` | `88ca5541e07dd9f386fd35831b62e64c34e8c197001ce9633ffa7a963d6bbc3e` |
| `src/app/[locale]/columns/page.tsx` | `04184cef518121e29b29c75715290f9265e5827740054e7ce18dea82b6b4e3d8` |
| `src/components/ColumnsGrid.tsx` | `56e92b83f8a4497e94688b4be54433136f987e7ab2512065eda53312960e891a` |
| `src/components/CriminalBoardLink.tsx` | `415b878d6658d912b2943d4db151cefe802c94a94bb87e4f79bba530d488cb9d` |
| `src/components/__tests__/criminal-column-discovery.test.tsx` | `947c12c7b544c28dd5d750450fdae0d9d11d902d2f80317668e55e500b659029` |
| `src/components/en-design/en-design-data.ts` | `9a4b38008ebca95c524bd556b297f280638e55291442c29752aa8a4b2ffe6811` |
| `src/components/ja-design/ja-arrangement.ts` | `c4fb498b2b5b40e9a9174bbdfd39029fa7e43eecb75295c3f020cf9370f434a0` |
| `src/components/ja-design/kou/JaGlyphCard.tsx` | `e03a651de11daa107a9ec946aaa415576014f46407918af5e063dd627bae4e96` |
| `src/content/columns-en/401-taiwan-criminal-witness-summons-refuse-testimony.md` | `548579319834c4bb5f644b704f96d2221705bf085a757f43449e157a123b8d7a` |
| `src/content/columns-en/402-taiwan-criminal-settlement-withdraw-complaint.md` | `ca0f7360a852ac7deaa08647e1e7a322199f98d7ba407e3ab1cfa2fa96df1374` |
| `src/content/columns-en/403-taiwan-non-prosecution-reconsideration-deadline.md` | `3581e31d58835e6024d5275f3a61534f1aff0d499d93c9e8f38db7a376bd8c0e` |
| `src/content/columns-en/404-taiwan-seized-phone-property-return.md` | `e7aca43e1afcec5fd24348d2b3618e7ef5966d488b0f295f17a4b918e32e5cb5` |
| `src/content/columns-ja/401-taiwan-criminal-witness-summons-refuse-testimony.md` | `d10f85b822615912652b8e424de51cdf3de099da38a74c700efd8d905ccddaf3` |
| `src/content/columns-ja/402-taiwan-criminal-settlement-withdraw-complaint.md` | `852ed30c83e1d36da0cc4a9551ef0f0f51e26b65bfa306a787f92d56ed808ea8` |
| `src/content/columns-ja/403-taiwan-non-prosecution-reconsideration-deadline.md` | `82dfa60e5e7fd22440f757b61494b6fcb88e83cbb34e225c53ce1da8ebf67ce6` |
| `src/content/columns-ja/404-taiwan-seized-phone-property-return.md` | `4e85aaa82a0e6a21dabd2f38e03bec252b1fffeb1a65bea90c619e2b722dd40d` |
| `src/content/columns-vi/401-taiwan-criminal-witness-summons-refuse-testimony.md` | `4510e7fc7da019bbca00e90f2a8a6d4d2eabdf5564adb5ee18d4a460d5ce0494` |
| `src/content/columns-vi/402-taiwan-criminal-settlement-withdraw-complaint.md` | `aca7b9cd766b67c79dcc7e5a6d73f248dc014b242d5c224f51a1a3aa165bea78` |
| `src/content/columns-vi/403-taiwan-non-prosecution-reconsideration-deadline.md` | `0930d853157e5ee7467c6ba89934c41b4ba4aa246c6ccc4feed83930458eb2b1` |
| `src/content/columns-vi/404-taiwan-seized-phone-property-return.md` | `c62d069488db8dbc94c8c62b21ba7855246011355f034ebd89ac3401d5121ec1` |
| `src/content/columns-zh/401-taiwan-criminal-witness-summons-refuse-testimony.md` | `eda6cdf33912cf03b9f9026d3b365563ced65cdb497ec5a7ea7da604fd288940` |
| `src/content/columns-zh/402-taiwan-criminal-settlement-withdraw-complaint.md` | `4e31de4daf930f5160d325b500b951f41dffc11db249e9c153fb044eccd5dbef` |
| `src/content/columns-zh/403-taiwan-non-prosecution-reconsideration-deadline.md` | `90a59144d057b72e67caef32a698e13b4410b4edef8d7f72e97e5930b0f10d8e` |
| `src/content/columns-zh/404-taiwan-seized-phone-property-return.md` | `e41226aae4626037b12d53fb4e178cb1ad1970401e0652eb0e5dfe02d6fc7bda` |
| `src/content/columns/401-taiwan-criminal-witness-summons-refuse-testimony.md` | `3580120b7bf21981bf883c053ea1004f6abe6aded8fe1ec41613df73bea7e10f` |
| `src/content/columns/402-taiwan-criminal-settlement-withdraw-complaint.md` | `2f324274549e9d5178947880af1a8886de922df1274084aefba44964816d3531` |
| `src/content/columns/403-taiwan-non-prosecution-reconsideration-deadline.md` | `d8d29f30d3ffaea88d329d636c16ba394202c441a31cb799e72bfc67a3b8b930` |
| `src/content/columns/404-taiwan-seized-phone-property-return.md` | `b6cf1a0fc98b453a1272fdd58f06fd7dc67a5235dfa80a162179a082c89e81a1` |
| `src/data/zh-hant-column-curation.ts` | `faa3e073897e7db31427c6c81a6960683f7fa7b4e3665ecfe181f215ac433e22` |
| `src/lib/__tests__/column-topics.test.ts` | `1f38f7fad08f0d4bbabc4ec3dd9cabf4deca27fe3bbda31660f427227db81ecc` |
| `src/lib/column-topics.ts` | `c50f6f10b72297504489f300ac23acdee77b367c78307935dc1042dde2c5f8b5` |
| `src/components/ja-design/JaColumns.module.css` | `717a0a0556943178da25ebc69c2f8aa82f258cdc79ec3483482fc644296992a0` |

현재 고정 후보에 대한 추가 필수 수정은 없다. manifest 또는 제품 파일이 달라지면 변경분을 다시 확인해야 한다.
