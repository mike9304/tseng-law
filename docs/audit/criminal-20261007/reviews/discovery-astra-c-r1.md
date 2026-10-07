# 형사 칼럼 발견성 개선 — 독립 검수 C r1

판정: APPROVE

검수자: GPT-6 Astra / reasoning max, 독립 검수자 C. 2026-10-07 KST.

기준 HEAD 11f68f14896b5e31536cf1c5495f44a745491d7c와 작업트리 diff를 독립적으로 읽었다. 최초 31파일 후보부터 최종 32파일 후보까지 검토했고, 마지막 ColumnsGrid 검색 보완과 테스트 변경도 다시 확인했다. 다른 검수자의 보고서를 읽거나 의견을 교환하지 않았다. 소스·원고를 수정하지 않았으며 이 보고서만 작성했다.

## 필수 수정 / 권고

미해결 필수 수정: 없음.

검수 중 확인한 분류명 검색 공백은 최종 후보에서 해결됐다. 일본어 archive의 장식 selector 및 기존 서브셋 글자 재사용도 최종에서 확인했다. 지금 후보에 추가 권고를 남기지 않는다.

승인은 아래 SHA의 소스·데이터·테스트 검수 범위다. 전체 QA·빌드·배포·운영 클릭 검증까지 이 검수자가 수행했다는 뜻은 아니다.

## 문제 재현 자료와 수정 방향

제공된 discovery-before/results.json을 직접 읽었다. 기존 /ko/columns의 주제 버튼에 criminal이 없고, 전용 본문 링크 위치가 desktop 8399px / mobile 7526px로 기록돼 있다. 모바일에서는 헤더의 형사 링크도 rects=0으로 기록돼 있다. 제공된 _ko_columns-390.png도 직접 열어 검색창 앞에 전용 링크가 없고 첫 주제 버튼들이 전체·법인설립·세무인 화면을 확인했다. 이 좌표는 제공된 실행 기록이며 내가 운영 페이지에서 다시 측정한 값이라고 보고하지 않는다.

제공된 red-test.log에서 최초 발견성 테스트 10 fail / 1 pass 기록을 읽었다. 검수자가 기준 코드를 되돌려 red 단계를 다시 실행한 것은 아니다. 최종 후보의 실제 테스트 실행 결과는 아래에 별도로 기록한다.

## 원문·기존 동작 → 이유 → 최종 수정 → 보존 조건

| 대상 | 기존 동작과 문제 | 최종 변경 확인 | 보존한 조건 |
| --- | --- | --- | --- |
| 20편 topic | litigation 안에 묶여 형사 분류를 별도로 선택할 수 없음 | COLUMN_TOPICS에 criminal 추가, 핵심 네 언어 라벨, 20편 topic 변경 | title/summary/FAQ/본문/출처/author/태그/이미지/날짜/slug는 그대로 |
| 전용 링크 | published 페이지 뒤에 붙어 긴 목록을 지나야 보임 | 공통 ColumnsGrid 내부에서 검색 form보다 먼저 렌더. page 및 JA 별도 링크 제거 | 기존 /{locale}/criminal-litigation URL, 다섯 언어 제한, 서비스에서 쓰는 기본 contained 동작 유지 |
| KO 주제 순서 | 전체 뒤에 법인설립이 와 모바일에서 형사 분류를 찾을 수 없음 | KO 기본 순서에서 전체 다음 criminal. ZH/EN/JA의 별도 순서에도 빠짐없이 포함 | 기존 다른 분류와 필터 기능, JA/EN 편집 순서를 보존 |
| 검색 | postMatchesQuery가 현지화 분류명을 검색하지 않아 형사소송/刑事訴訟/Criminal litigation으로 네 새 글이 발견되지 않음 | 핵심 네 언어의 topic 라벨을 검색 대상에 추가. locale을 전달하고 filtered useMemo 의존성에도 포함 | 기존 제목·요약·태그·작성자·카테고리 검색과 날짜·주제 필터의 교집합 유지. 검색어를 임의 삭제하지 않음 |
| JA 장식 | 새 topic은 archive CSS와 별도 glyph map에도 대응이 필요 | 두 위치에서 criminal에 기존 글자 訴 사용. 글꼴 서브셋 테스트 통과 | 새 폰트 없음. 장식은 접근성 이름을 대체하지 않으며 보이는 분류 라벨은 刑事訴訟 |
| 이슈 칼럼 | 공통 grid에 추가하면 별도 이슈 목록에도 잘못 끼어들 수 있음 | listHref가 /{locale}/columns인 경우에만 링크 삽입 | /{locale}/columns/issues의 목록·링크 경로 유지 |

## 방문자 흐름·메타데이터 전파

1. 기존 칼럼 URL에 들어오면 전용 링크가 공통 검색창 앞에 렌더된다. 새 URL을 미리 알고 있어야만 형사 게시판을 찾는 구조를 해소한다. contained=false는 이미 있는 container 안에서 좌우 여백을 다시 넣지 않도록 하며, 다른 호출부의 기본값은 그대로다.
2. 핵심 네 언어에서 criminal을 선택하면 실제 로더가 읽은 네 파일이 각 언어의 상세 URL로 렌더된다. 일반 분류/추천 목록에서의 일부 미리보기와 전체 네 편의 필터 결과를 구별한다. KO 버튼 순서는 전체 다음 criminal로 고정된다.
3. 새 분류명으로 검색만 할 때 네 글이 결과에 포함되고, 같은 검색어와 topic=criminal을 함께 적용하면 정확히 네 카드가 나온다. URL query와 기존 검색 상태 동기화 코드는 보존됐고, 기존 연속 조작·초기화·뒤로/앞으로 관련 테스트도 통과했다.
4. VI는 기존 category 기반 UI를 유지한다. 베트남어 전용 링크는 검색창 앞에 추가되어 실제 VI 형사 게시판으로 이동할 수 있다. 네 언어 topic 라벨을 VI 화면에 잘못 노출하지 않는다. CriminalBoardLink의 기존 지원 언어 guard 때문에 다른 guidance locale에 존재하지 않는 형사 게시판 링크가 생기지 않는다.
5. 실제 published 경로를 소스로 추적했다: public-page의 getAllColumnPostsIncludingBlob → resolved.columnPosts → toColumnListItems → legacy-page-columns composite → ColumnsLegacyPageBody → ColumnsGrid. topic과 aiAuthored가 직렬화 중 빠지지 않는다. CMS topic이 없으면 파일 topic을 보완하는 기존 규칙과 명시적인 CMS 편집값을 존중하는 규칙도 그대로이며 관련 두 테스트가 통과했다. 이 검수에서 모든 운영 CMS 레코드를 별도 열람한 것은 아니다.
6. 직접 page 분기, published legacy 분기, 별도 JA view, guidance 분기 모두 같은 grid의 링크 위치를 사용한다. 이슈 grid에서는 hrefBase가 달라 삽입되지 않는다. 중복 페이지 링크를 제거한 위치와 공통 삽입 위치를 함께 확인했다.
7. 메타데이터의 taxonomy 변경은 분류·카드 배지·검색에 연결되며 permalink나 canonical을 바꾸지 않는다. 전용 형사 게시판은 기존 criminal-litigation 태그 선정을 계속 사용하므로 네 글의 포함 범위도 유지된다.

## 원고 의미·법률·문체 보존

20편을 기준 HEAD의 파일과 바이트 비교했다. 각 파일은 topic: "litigation" → topic: "criminal" 치환 1회만으로 최종 파일과 정확히 같았다. 반대로 topic을 litigation으로 돌려 계산한 SHA는 기존 FINAL-CONTENT-SHA.json의 승인된 20 SHA와 모두 일치한다. 법률본문, 숫자·조건·예외, FAQ, 출처, AI 내부 저작 정보, 이미지 설명, URL 의미가 달라지지 않았다. 이번 분류 수정 때문에 전면 법률 재검수를 다시 수행했다고 주장하지 않는다.

최종 파일의 ko/en/ja/zh-hant 16편에 variety_metrics.py check를 다시 실행해 모두 exit 0 / FAIL 0을 확인했다. KO 4편과 JA 4편의 기존 종결체 WARN은 유지됐다. VI는 도구 미지원이며 다른 언어 옵션으로 자동 통과시킨 것으로 기록하지 않는다. 본문 바이트가 승인본과 동일하므로 앞선 문체 수동 검수와 §5 확인 대상 문장도 같다. 새 공개 라벨 형사소송 / 刑事訴訟 / Criminal litigation은 분류명으로 자연스럽고 새로운 법률 주장이나 전문가 감수 완료 문구를 추가하지 않는다.

## 직접 실행한 최종 검증

정상 런타임 Node v24.14.1을 사용했다. 마지막 소스 동결 후보에서 아래 10파일을 한 번에 재실행했고 164 tests passed / 10 files passed / exit 0이었다. 실행 소요 1.66초. 전체 QA나 build를 중복 실행하지 않았다.

| 테스트 | 결과 |
| --- | ---: |
| src/components/__tests__/criminal-column-discovery.test.tsx | 15 통과 |
| src/components/__tests__/ColumnsGrid-topics.test.tsx | 4 통과 |
| src/lib/__tests__/column-topics.test.ts | 8 통과 |
| src/lib/consultation/__tests__/column-topic-metadata.test.ts | 2 통과 |
| src/lib/__tests__/criminal-litigation-board.test.tsx | 10 통과 |
| src/components/ja-design/__tests__/ja-arrangement.test.tsx | 7 통과 |
| src/components/__tests__/columns-grid-guidance-labels.test.tsx | 94 통과 |
| src/components/__tests__/zh-hant-columns-curation.test.tsx | 6 통과 |
| src/components/__tests__/columns-filter-recovery.test.tsx | 17 통과 |
| src/components/ja-design/kou/__tests__/ja-display-subset.test.ts | 1 통과 |

명령 형식: PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH node node_modules/vitest/vitest.mjs run <위 10개 경로>.

### Production preview HTTP 추가 확인

clean build 뒤 제공된 http://127.0.0.1:3107 에 직접 GET하고 HTMLParser로 실제 HTML 태그를 읽었다. RSC 스크립트 문자열을 카드로 중복 집계하지 않았다. 다섯 요청 모두 HTTP 200이었다.

| locale / 요청 | 실제 HTML 결과 |
| --- | --- |
| ko /columns?q=형사소송&topic=criminal | 카드 4, visible-count 4, 네 KO 상세 URL, 본문 전용 링크 1개가 검색 form 앞, 첫 버튼 all→criminal |
| zh-hant /columns?q=刑事訴訟&topic=criminal | 카드 4, visible-count 4, 네 ZH 상세 URL, 본문 전용 링크 1개가 검색 form 앞 |
| en /columns?q=Criminal litigation&topic=criminal | 카드 4, visible-count 4, 네 EN 상세 URL, 본문 전용 링크 1개가 검색 form 앞 |
| ja /columns?q=刑事訴訟&topic=criminal | 카드 4, visible-count 4, 네 JA 상세 URL, 본문 전용 링크 1개가 검색 form 앞 |
| vi /columns | 기존 32편 카드·visible-count 32, topic 버튼 없음, /vi/criminal-litigation 본문 링크 1개가 검색 form 앞 |

HTTP 검사로 실제 페이지 경로에서 최종 topic/search/링크 순서가 반영된 것을 확인했다. 브라우저 클릭·화면 위치(px)·모바일 overflow 검증과는 구별한다.

검수 중 브라우저 스킬의 런타임 연결을 시도했고 선택 결과는 No browser is available, 연결 목록은 []였다. 따라서 이 검수자의 최신 PC/모바일 화면, 실제 브라우저 클릭·뒤로가기·상세 이동 성공을 기록하지 않는다. 실제 클릭에 대한 판단은 React 렌더·상태 테스트와 소스 추적에 한정하며, 별도로 위 production preview HTTP 응답을 직접 확인했다. root가 수행하는 QA/clean build/실화면 결과를 나의 독립 실행 결과로 바꾸어 표시하지 않았다.

git diff HEAD --check는 통과했다. next-env.d.ts의 자동 생성된 개발/빌드 경로 변경은 이 기능의 32파일 명세에 포함하지 않았다.

## 최종 SHA-256

기준 HEAD: `11f68f14896b5e31536cf1c5495f44a745491d7c`

DISCOVERY-SHA.json SHA-256: `dc6e74f562bcd2db18441d74184ce5ef96748c70a62226d920b43d5c3658a471`

작성 직전 32파일의 실제 바이트를 명세와 대조하여 모두 일치했다.

| 파일 | SHA-256 |
| --- | --- |
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

이 판정은 위 파일에 적용된다. 이후 기능·공개 문구·본문이 달라지면 변경분을 확인하지 않고 승인을 자동 승계하지 않는다.
