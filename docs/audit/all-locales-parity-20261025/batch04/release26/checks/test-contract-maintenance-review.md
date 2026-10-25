# B4 테스트 계약·주제 메타데이터 독립 검토

검토자: column_deploy. 2026-10-26 KST. 기준 커밋 `3b5ea95061d61a6b9a0e94eb61438be843fdd63c`와 현재 R 파일을 읽기 전용으로 대조했다. 검토자가 테스트를 재실행하거나 R 파일을 수정하지 않았다.

판정: 제시된 범위의 보완은 타당하며 필수 수정 지적은 없다. 부정확한 원고 메타데이터와 누락된 테스트 자료 목록을 고쳤고, cinematic 경로·footer 동작 검사 자체를 제거하지 않았다. 아래 판정은 실제 바이트 대조와 코드 검토 결과이며, 별도의 빌드·브라우저 통과를 뜻하지 않는다.

## 1. Cinematic 소스 검사

`src/components/__tests__/cinematic-opening.test.tsx`의 변화는 `headers } from 'next/headers'` 문자열이 layout에 존재해서는 안 된다는 assertion 한 줄을 제거하고 이유 주석 두 줄을 넣은 것뿐이다. 이 치환을 기준 파일에 적용한 결과가 현재 파일 전체 바이트와 일치한다.

기준 커밋부터 locale layout은 `IS_STATIC_SITE`일 때만 `x-tseng-pathname`을 읽어 현재 글의 언어 전환 목록을 만든다. 실제 cinematic 경로 선택은 변경 없는 `CinematicRouteShell`의 `usePathname()` → `visibleCinematicPathname()`에서 이루어진다. 따라서 layout의 모든 `headers` import를 금지하는 검사는 이 별도 용도를 허용하지 못했다.

client pathname 사용, header/quick-contact/scroll-top 마커, footer를 억제 대상으로 넣지 않음, deferred popup 및 일반 경로 popup, home sentinel 검사는 그대로 남았다. 실제 route shell 렌더링·경로 왕복·popup 테스트의 나머지 바이트도 동일하다. 제거된 포괄적인 소스 금지를 기존 동작 검사 약화로 판단할 근거는 발견하지 못했다.

## 2. ARC 테스트 자료 목록

`src/lib/__tests__/native-locale-columns.ts`는 기존 14개 항목을 유지하고 실제 추가된 28개 언어를 같은 704–706 파일 배열에 연결했다. 변경은 이 28줄과 설명 주석 한 줄뿐이다. 기존 archive slug, 정렬, 과거 칼럼 기대값, assertion은 제거하지 않았다.

R의 `src/content/columns*`에서 세 파일의 존재를 직접 조사했다. 목록의 42개 언어와 세 편이 모두 존재하는 실제 42개 언어 집합이 정확히 일치한다. 총 126개 파일이며 한두 편만 있는 부분 집합은 없다. 아직 통합되지 않은 B5 7개 언어도 포함하지 않았다. 이전 fil·zh-hans의 archive offset 계산에서 실제 존재하던 ARC 세 편이 누락된 자료 목록을 보완하는 변화다.

`archiveLeadPublicationDate`의 기존 2026-10-24 처리도 변경되지 않았다. 현재 이 함수로 날짜 배열을 비교하는 `columns-publication-date.test.ts`의 대상은 ko/zh-hant/en/ja 네 언어이며, 이번에 추가된 언어의 발행일을 24일이라고 판정한 것은 아니다.

## 3. 중국어 판결 칼럼 3편

918(분양주택 대출 통지·인도), 920(공용부분 충전시설), 921(게임 코인 환불)의 title·summary·FAQ·본문·출처를 모두 읽고 현행 topic 정의와 대조했다. 세 편 모두 구체적인 판결과 당사자 분쟁을 다루므로 기존 `litigation` / `訴訟與糾紛` 분류에 부합한다. 정본 topic 목록에는 `civil`이 없으며, 해당 taxonomy와 `column-topics.test.ts`는 기준 커밋 그대로다. 유효하지 않은 분류를 검사에서 허용한 것이 아니라 원고의 선언 값을 고쳤다.

각 백업이 기준 커밋 원문과 같음을 확인한 뒤 현재 파일에서 아래 두 치환을 역으로 적용했다.

- `topic: "litigation"` → `topic: "civil"`
- `lastmod: "2026-10-26"` → `lastmod: "2026-10-25"`

세 편 모두 원래 SHA를 정확하게 복원했다. 본문 및 FAQ, 나머지 frontmatter가 바이트 단위로 같고 `published: "2026-10-25"`, `date_display: "2026年10月25日"`도 그대로다. 이는 분류 적합성과 변경 범위 검수이며, 세 판결의 법률 내용을 새로 전수 감수했다는 뜻은 아니다.

| 파일 | 변경 후 SHA-256 |
|---|---|
| 918 | `43949fd463c3c6a7612dd98d6ffb1007925bc5032a0f3967fe181c1e16fdaa4b` |
| 920 | `59fb9c0ff8d1c5760300cd7e525ef3fd2c8c1bbd4327c589786ba9e4bca2f582` |
| 921 | `d7783b6cebeb410766a692fa2eebf3bd3b12bff48bd2615f6468cfd09f8b9484` |

## 4. 범위·증거

`src/app`, `src/components`, `src/lib`를 기준 커밋과 비교했을 때 변경 파일은 위 두 테스트 파일뿐이며, 해당 경로에 새 untracked 파일도 없다. 테스트 파일을 제외한 실행 코드·자료 2,908개 파일은 기준 커밋과 같다. 검토 입력 3,048개를 마지막에 다시 읽어 시작 해시와 같음을 확인했다. 저장된 maintenance patch도 실제 git diff와 일치한다.

- 원 patch SHA: `4b7a29b5c835f61bb2d07bc60b0109ca91b510315972b80b619344841124845d`
- 원 topic receipt SHA: `b112e2b4ce61974a67eba71be9bc8e9603fba09b476b8cecde7a8bb88d39eac4`
- 독립 증거: `test-contract-maintenance-review.json`, SHA `65a4fd604e31e0f9d54c6c137b165de5810ca75adc273784014caf16df6a3cd4`
- 재현 코드: `../verification/test-contract-maintenance-proof.py` (기존 결과 덮어쓰기 방지)
- 앞선 실패 조사: `cinematic-failure-review.md`, `family-failure-review.md`; 원 전체 검사 실패 기록은 보존했다.

Root는 영향받는 14 suite의 603/603 PASS를 별도로 보고했으며 추가 helper 소비자 검사를 수행 중이다. 이 검토에서 그 검사를 대신 재실행하지 않았다. 최종 산출물의 62개 ARC 브라우저 사례와 중국어 3편 메타데이터 사례는 후속 기록으로 분리한다.
