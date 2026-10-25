# B4 대기 중 기존 divorce/family 테스트 실패 조사

확인 시각: `2026-10-25T16:00:25.430947+00:00`. 테스트 재실행·원문/앱/정책 수정 없이 관련 코드와 root 진행 로그를 읽었다.

관측된 실패는 두 suite의 fil·zh-hans 목록 순서 단정 4개다. `divorce`는 `posts.slice(offset, offset + 3)`를 019–021의 세 slug와, `family`는 `posts.slice(offset, offset + 2)`를 022–023의 두 slug와 비교한다. 로그는 두 suite 각각 10개 중 2개 실패를 표시하며 다른 7개 언어와 별도 sitemap 검사는 통과했다. 전체 npm 종료값과 최종 assertion diff는 root 소관이다.

## 읽는 범위와 B4 관계

이 테스트들은 3편 또는 2편의 고정 파일만 읽는 테스트가 아니다. `getAllColumnPosts(locale)`로 지정된 아홉 언어(ko/ja/en/vi/id/th/fil/zh-hant/zh-hans)의 전체 목록을 먼저 읽고, `expertiseSlugsFor(locale).length`와 과거 배치 개수로 시작 위치를 계산한다. 이후에 지정된 5개 과거 slug의 상세 내용·날짜 등을 읽는다.

실패한 목록 검사의 입력 언어에는 새 B4 he/bn/ur/fa/my/ta/ne가 없다. `columns.ts:73–86`은 요청 언어를 `COLUMN_CONTENT_DIR_BY_LOCALE`의 전용 디렉터리로 해석하고, 402행부터 그 디렉터리의 md만 읽는다. 이 목록 단정에 B4 새 파일이 직접 들어가지 않는다.

다만 별도의 sitemap 케이스는 `collectColumnSitemapRecords`가 전체 49언어를 순회하면서 B4도 읽은 뒤, 이 다섯 과거 slug만 filter한다. 두 sitemap 케이스는 현재 로그에서 PASS이므로 ‘이 suite가 B4 파일을 전혀 읽지 않는다’는 포괄적인 설명은 피한다.

## 기준 바이트 비교와 원인 후보

기준 `3b5ea95061d61a6b9a0e94eb61438be843fdd63c`와 현재를 `git show` 바이트로 비교했다. 정책/테스트 16개, 고정 과거 원고 45개, 실패 언어 두 디렉터리의 전체 파일을 중복 제외한 총 111개가 모두 일치한다. fil은 31편, zh-hans는 29편이며 파일 경로 집합도 기준과 같다. 종료 때 현재 SHA를 다시 계산해 변동 없음도 확인했다. 모든 경로와 SHA는 `family-failure-review.json`에 있다.

`native-locale-columns.ts:986–1001`의 ARC registry는 처음 14언어만 등록하고 fil·zh-hans를 포함하지 않는다. 반면 두 디렉터리에는 이미 ARC704–706이 각각 세 편 존재한다. `sameDayFilesOf`가 이 registry를 사용하고 `expertiseSlugsFor`가 그 길이를 offset에 반영하므로, 이미 추가된 세 편과 과거 위치 계산이 어긋날 수 있는 구체적인 코드 근거다. 이 상태 역시 기준 커밋과 동일하다. 최종 assertion diff를 새 실행으로 얻지 않았으므로 정확한 received 배열이나 유일한 원인으로 단정하지 않는다.

이 비교로 이번 B4 추가가 해당 실패 언어의 목록 입력이나 offset 정책을 바꿨다고 볼 근거는 없다. 실패를 삭제·무시하거나 기대값을 바꾸는 작업은 하지 않았다. 기준 커밋 전체 테스트를 실행해 실패를 재현했다고도 주장하지 않는다.

JSON 증거 SHA-256: `8faace8b8cd99138f76db84006dd631a3cb7430ac909ce80eb4bdcd0eaa6949b`. 진행 로그 발췌 SHA-256: `a40aa8d8974a6d47b6b7013b50f9b56c17ff17d3a0c4ae047b208010e76dfac4`.
