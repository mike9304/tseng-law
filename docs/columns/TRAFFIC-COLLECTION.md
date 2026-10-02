# 교통사고 모음(/{locale}/traffic-accidents) 등록 규칙

2026-10-02 작성. 교통사고 허브 게시판에 칼럼·이슈 글이 들어가는 조건이다. 판정 코드는 `src/lib/traffic-collection.ts`의 `resolveTrafficSubject`다.

## 새 글을 넣는 방법

frontmatter(파일) 또는 CMS의 `tags`에 아래 값을 정확히 쓴다. 목록 파일(slug 목록)을 고칠 필요는 없다.

```yaml
tags: ["traffic-accidents", "traffic-liability"]
```

| 태그 | 게시판 주제 |
|---|---|
| `traffic-procedure` | 사고 처리 절차 |
| `traffic-evidence` | 증거와 경찰 자료 |
| `traffic-liability` | 과실과 책임 |
| `traffic-compensation` | 손해배상과 합의 |
| `traffic-accidents`만 있음 | 교통사고 일반 |

- 주제 태그가 하나라도 있으면 `traffic-accidents`가 없어도 포함한다. 주제 태그가 여러 개면 글에 적은 순서상 첫 번째를 쓴다.
- `tags`는 문자열 배열이어야 한다. `tags: "traffic-accidents"`처럼 문자열 하나만 쓰면 무시된다. 대소문자·앞뒤 공백은 정리되지만 철자는 정확해야 한다(`traffic-accident`, `traffic-accidents-2026`은 포함되지 않음). 64자를 넘는 태그는 버린다.
- 제목·요약·본문의 단어로는 포함 여부를 판단하지 않는다. "교통사고"가 들어간 다른 분야 글은 태그가 없으면 게시판에 나오지 않는다.
- 이슈 글(`src/content/issues/<locale>/`)도 같은 태그로 포함되고, 원래 주소 `/{locale}/columns/issues/<slug>`로 연결된다.
- 언어별 파일이 있는 언어에만 나온다. 번역이 없는 언어에 다른 언어 글을 대신 보여 주지 않는다. 일본어 게시판은 파일만 읽는다.

## 태그 이전 글(레거시 목록)

태그가 생기기 전 글 8편은 `LEGACY_TRAFFIC_SUBJECT_BY_SLUG`에 주제가 정해져 있다. 본문을 읽고 정한 값이며, 이 글들의 frontmatter는 고치지 않는다. 판정 순서는 주제 태그 → 레거시 목록 → `traffic-accidents`(일반)이다. 레거시 글에 주제 태그를 달면 태그가 우선한다.

`src/data/traffic-hub.ts`의 `TRAFFIC_COLUMN_SLUGS`·`trafficColumnSlugsFor`는 기존 테스트 호환용으로만 남아 있고, 허브는 읽지 않는다.

## 게시판에 표시되는 값

- 썸네일 `featured_image`, 제목, 요약 `summary`, 주제, 원래 게시일 `published`(없으면 `date_display`), 읽는 시간 `read_time`.
- `author: legal-ai-assistant`인 글은 AI 작성 표시를 단다.
- 영상 표시는 `diagram`(또는 `diagram_video`) id가 `src/data/traffic-diagrams.ts`에 영상으로 등록된 경우에만 나온다. 정지 도해(`kind: 'still'`)에는 붙지 않는다.
- 정렬은 게시일 최신순, 같은 날이면 파일 번호가 큰 글이 먼저다.
- 내부 테스트 글(`isInternalColumnPost` 기준)은 나오지 않는다. CMS 글은 게시본(`.published.json`·published 번들)만 읽으므로 초안은 나오지 않는다.

게시판 문구도 `EDITORIAL-VOICE.md`를 따른다. 성공률·후기·검토 완료 같은 표시를 추가하지 않는다.

## 검증

`npm run test:unit -- src/lib/__tests__/traffic-collection.test.ts src/lib/__tests__/traffic-collection-cms.test.ts 'src/app/[locale]/traffic-accidents/__tests__/traffic-board.test.tsx'`로 파일·CMS 변환 경계와 목록을 검증한다. 새 글을 게시하면 현재 발행 목록을 확인하고 테스트의 언어별 예상 목록도 갱신한다.

서버 실행 후 `BOARD_BASE=http://127.0.0.1:3000 node scripts/verify-traffic-board.mjs`로 Chromium·WebKit·Firefox, 모바일 390px·320px, 접근성, 원래 글 링크, 관련글, 빈 검색, 필터 해제, 뒤로가기, JavaScript 없는 검색을 확인한다. 브라우저가 설치되어 있어야 한다. 결과는 `.omo/evidence/traffic-board/`에 저장된다. 이 스크립트도 현재 발행 수(zh-hant 11, ko 4, en 4, ja 3)를 검증하므로 새 글을 게시할 때 함께 갱신한다. 실제 Safari/iOS 기기나 스크린리더 검증을 대신하지 않는다.

프로덕션 빌드 서버에서 `TRAFFIC_HYDRATION_BASE=http://127.0.0.1:3000 node scripts/verify-traffic-hydration.mjs`도 실행한다. 이 로컬 전용 검사는 HTML을 변경하지 않고 작은 조각으로 전달하여 느린 스트리밍 중 초기 로드·새로고침·필터·빈 검색·뒤로가기·해제와 JavaScript 없는 목록을 확인한다. 원격 사이트의 스크립트 가로채기나 오류 무시는 사용하지 않는다. `TrafficPageView`는 서버에서 읽은 공개 목록 데이터를 받아 서버와 브라우저 양쪽에서 같은 화면을 렌더링한다. 서버 목록·구조화 데이터와 JavaScript 없는 검색을 유지해야 한다.
