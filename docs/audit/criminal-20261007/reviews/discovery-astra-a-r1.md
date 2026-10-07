# 형사 칼럼 발견 경로 수정 — 독립 검수 A

판정: APPROVE.

필수 수정: 없음. 최종 32개 후보 파일 기준으로 남은 반려 사유를 발견하지 못했다. 기존 칼럼 목록 안에서 형사소송을 선택할 수 없고, 전용 게시판 링크가 본문 맨 아래에 있었던 문제를 해결하는 변경이다.

- 기준 HEAD: `11f68f14896b5e31536cf1c5495f44a745491d7c`.
- 작업트리: `/Users/son7/Projects/tseng-law-criminal-20261007`.
- 검수 manifest: `/Users/son7/tseng-criminal-20261007/DISCOVERY-SHA.json`.
- 최종 manifest SHA256: `dc6e74f562bcd2db18441d74184ce5ef96748c70a62226d920b43d5c3658a471`.
- 코드·원고 수정 없음. 다른 검수자 보고서 미열람. 이 보고서만 작성.
- `next-env.d.ts`의 빌드 생성 변경과 감사 문서는 위 32개 source/test 후보의 승인 대상에 포함하지 않았다.

## 문제와 수정의 연결

제공된 `discovery-before/results.json`을 직접 읽고 한국어 모바일 목록 screenshot을 확인했다. 기존 `/ko/columns`에는 형사 topic chip이 없었다. 본문 전용 게시판 링크의 Y 위치는 desktop 8,399, mobile 7,526이었다. 모바일 상단 Header의 형사 nav는 해당 상태에서 표시되지 않았고, 추천 칼럼에 나온 글의 badge도 ‘소송·분쟁’이었다. 새 글이 게시되었더라도 사용자가 형사 게시판으로 알아보기 어려운 상태였다는 설명과 일치한다.

이번 수정은 다음 진입 경로를 만든다.

1. 기존 목록의 주제칩에서 KO ‘전체’ 다음에 ‘형사소송’을 표시한다. `?topic=criminal`을 선택하면 401–404 네 편을 하나의 filtered grid로 보여준다.
2. 전용 형사 게시판 링크를 `ColumnsGrid`의 검색 form보다 앞에 둔다. 종전 `PublishedSitePageView` 뒤에 붙던 링크를 제거했으므로, 긴 목록을 내려가야만 본문 링크를 찾던 원인을 직접 제거한다.
3. 기존 검색 대상에 현재 언어의 topic label을 추가한다. 화면에 보이는 ‘형사소송’, ‘刑事訴訟’, ‘Criminal litigation’으로 검색해도 네 편을 찾으며, 검색과 형사 topic 필터를 함께 사용할 수도 있다.

기본 ‘전체’ 화면에서는 기존 추천 칼럼 구성이 유지된다. 네 편이 항상 하나의 추천 블록에 모인다는 뜻은 아니며, 주제칩 또는 위쪽 전용 게시판 링크를 통해 네 편을 한 번에 열 수 있게 된다.

## 코드·렌더 경로 확인

- `src/lib/column-topics.ts`에 `criminal`이 정식 topic으로 등록되고 KO/ZH/EN/JA label이 모두 추가되었다. KO 기본 순서, ZH 국내 독자용 순서, EN·JA 개별 순서에도 topic이 들어 있다. 알 수 없는 topic으로 탈락하거나 label이 undefined가 되는 경로를 발견하지 못했다.
- 20개 원고의 기준 HEAD 원문과 현재 파일을 대조했다. 차이는 각각 `topic: "litigation"` → `topic: "criminal"` 한 줄뿐이다. 제목·본문·FAQ·출처·AI 정보·날짜·slug·이미지·태그는 동일하다. 법률 본문 재작성이나 URL 변경은 없다.
- `toColumnListItems`가 topic을 전달한다. `ColumnsGrid`의 topic 검증·필터·badge·chip 수량이 동일 필드를 사용하므로 분류와 화면이 이어진다. 검색은 기존 title·summary·category·tag 등의 대상에 현재 언어의 topic label만 추가한다. `locale`도 필터 memo 의존성에 추가되어 언어 전환 시 이전 label에 머물지 않는다. 연도·작성자 필터 및 초기화 로직은 유지된다. guidance 언어에는 지원되지 않는 영어 topic label을 검색 대상으로 추가하지 않는다.
- KO/ZH/EN의 published 경로는 `PublishedSitePageView` → `CompositeRender`의 `legacy-page-columns` → `ColumnsLegacyPageBody` → `ColumnsGrid`로 이어진다. 이 경로에도 새 상단 링크가 적용된다. 해당 published 경로는 요청 시 칼럼 목록을 읽고 topic을 직렬화한다.
- JA는 `JaColumnsView` 안의 `ColumnsGrid`가 링크를 소유한다. 바깥의 종전 링크를 제거해 같은 본문 진입 링크가 이중으로 생기지 않는다. grid를 숨기는 기존 template visibility도 존중한다.
- VI는 파일 기반 목록에서 같은 `ColumnsGrid`를 렌더하므로 베트남어 전용 게시판 링크를 검색 앞에 표시한다. VI는 기존 category 모드를 유지하며 이번 변경으로 형사 topic chip이 생기는 것은 아니다. 네 편의 VI 전용 게시판은 기존 tag 선택 방식을 그대로 사용한다.
- `listHref === /{locale}/columns` 조건은 `/columns/issues`에서 새 링크가 삽입되는 것을 막는다. 기존 issue 경로와 카드 URL은 유지된다.
- `CriminalBoardLink`는 기존 검수된 언어별 제목과 고정 내부 URL을 사용한다. `contained={false}`는 grid 안에 `.container`를 중첩하지 않기 위한 변경이며, 서비스 페이지의 기본 `contained=true` 사용은 유지한다.
- chip은 기존 `button`, `aria-pressed`, topic nav label을 유지하고 링크도 일반 `Link`로 렌더한다. EN 어두운 배경의 링크는 기존 wrapper의 밝은 `--text-link` 토큰을 상속한다. 이번 변경에 따른 새 클릭 차단이나 숨김 조건을 발견하지 못했다.
- 전용 게시판의 구성은 `criminal-litigation` tag로 결정된다. topic 변경으로 전용 게시판에서 글이 빠지는 변경은 없고, 관련 기존 검사를 직접 통과했다.

## 검수 중 확인한 일본어 장식 보완

초기 후보에서는 `JaGlyphCard`만 `criminal` 장식을 추가하고 실제 `/ja/columns` 목록의 `JaColumns.module.css` selector가 빠져 있었다. 이는 분류·링크 동작을 막지 않는 장식 누락이었다. 최종 후보는 두 경로 모두 `訴`를 쓰며 CSS에도 `data-column-topic='criminal'` selector가 추가되었다.

최종 코드에서 가시 label은 `刑事訴訟`으로 유지된다. 장식 glyph는 component에서 `aria-hidden`, CSS에서 빈 대체 텍스트를 사용한다. 기존 소송 glyph `訴`를 재사용하는 것은 topic의 법적 의미나 접근 가능한 이름을 바꾸지 않는다. 최종 폰트 subset 검사도 검수자가 직접 실행해 통과했다. 이 항목은 해소되었으며 남은 필수 수정이 아니다.

## 직접 실행한 검증

Node는 `/Users/son7/.nvm/versions/node/v24.14.1/bin/node`, 실행기는 `node_modules/vitest/vitest.mjs run`, reporter는 `dot`을 사용했다.

| 검사 파일 | 직접 실행 결과 |
| --- | --- |
| `src/components/__tests__/criminal-column-discovery.test.tsx` + `src/lib/__tests__/column-topics.test.ts` | 2 files, 23 tests PASS |
| `src/components/__tests__/ColumnsGrid-topics.test.tsx`, `columns-grid-guidance-labels.test.tsx`, `zh-hant-columns-curation.test.tsx`, `home-archive-topic-mix.test.tsx` + `src/app/[locale]/columns/__tests__/ja-archive-visibility.test.tsx` + `src/lib/__tests__/criminal-litigation-board.test.tsx` | 6 files, 136 tests PASS |
| `src/components/__tests__/columns-filter-recovery.test.tsx` | 1 file, 17 tests PASS |
| `src/components/ja-design/kou/__tests__/ja-display-subset.test.ts` | 최종 glyph 보완 후 1 file, 1 test PASS |

합계: 최종 검색·glyph 수정이 반영된 후보에서 2026-10-07 22:04:58 KST에 위 10 files를 한 명령으로 다시 실행해 177 tests PASS를 확인했다. 새 검사 15개는 4개 지원 언어의 형사 필터 네 편, 현재 언어 topic label 검색 단독 및 topic 필터와의 조합, 5개 언어의 링크 순서, KO chip 순서, issue archive 제외를 검증한다. 기존 필터 복구 검사는 검색 입력과 URL commit 지연, 초기화, topic 클릭 시 다른 query 보존도 다룬다.

`discovery-before/red-test.log`의 10 FAIL / 1 PASS는 제공된 기존 실행 로그를 읽어 확인했다. 검수자가 작업트리를 이전 상태로 바꾸어 red 실행을 재현한 것은 아니다.

이번 독립 검수에서는 full QA·clean build를 재실행하지 않았고, 수정 후 production browser 화면을 새로 열어 측정하지 않았다. 이동 후 정확한 Y 좌표·모바일 탭 동작·실제 운영 배포 반영 여부까지 PASS라고 주장하지 않는다. 본 승인은 확인한 source 경로, SSR·상태 전환 검사, 최종 파일 hash를 근거로 한 수정 후보 승인이다. 새로운 법률 주장은 없으므로 공식 법령을 재검증했다는 주장도 하지 않는다.

## 최종 검수 SHA256

아래 32개 파일의 실제 SHA256을 manifest와 대조해 불일치 0개를 확인했다.
| 파일 | SHA256 |
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
