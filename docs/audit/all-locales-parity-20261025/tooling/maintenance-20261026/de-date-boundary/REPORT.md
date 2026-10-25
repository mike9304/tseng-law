# DE 연결 날짜 문장 경계 — 격리 후보 검토 요청

2026-10-26 KST. 후보는 이 폴더의 `candidate/variety_multilingual.py`이며 SHA-256은 `4af341932757be7a6b83f84a56ea24792f963653c9c3d008aacade2b79a084de`다. 공유 도구·R·원고에는 설치하거나 수정하지 않았다. Root가 제공한 문제 조각 외에 B6 표적 원고 및 그 점수는 읽지 않았다.

문제: 기존 DE 분기는 월 이름 바로 앞의 날짜 점만 보호해 `7. und 8. November`의 첫 점을 문장 끝으로 잘못 처리한다. Duden의 [문장 안 날짜 예시](https://www.duden.de/sprachwissen/rechtschreibregeln/datum)와 [문장 종결 점 설명](https://www.duden.de/sprachwissen/rechtschreibregeln/punkt)을 참고했다. 연결 날짜의 문장 경계는 이 구별을 적용한 프로젝트별 처리이며 독일어 전체 문법 파서를 구현한 것은 아니다.

후보는 `if lang == 'de'` 안에만 7줄을 추가한다. 1–31의 날짜 숫자 뒤에 소문자 `und`, `oder`, `bis`로 이어진 날짜와 마지막 월 이름이 실제로 있을 때 앞의 날짜 점을 보호한다. 월 이름은 기존 12개 이름을 재사용한다. 대문자 `Und`·`Oder`로 시작하는 실제 다음 문장은 합치지 않는다. 최종 월 앞 점 처리, 문장 끝 처리, 단어 정의와 임계값은 바꾸지 않았다.

검증 순서를 다음과 같이 보존했다.

1. 코드를 바꾸기 전에 중립적인 도서관·전시·일정 예문과 실제 숫자/서수 문장 끝 반례 19개를 `neutral-fixtures.json`에 고정했다. SHA `894f994ea8ab8bd320c04b43b3b96aded0518db85b0cf073a15d7357f5083940` 및 수정 전 코드 SHA를 `design-freeze.json`에 기록했다.
2. 기존 코드에서 일반 공백/NBSP/좁은 NBSP 57변형 중 24개 FAIL, 33개 PASS와 Markdown 본문 추출 실패를 실제로 재현했다(`baseline-neutral.json`, exit 1).
3. 후보에서 57/57 및 실제 본문 추출 PASS, exit 0을 확인한 뒤 `candidate-freeze.json`으로 코드를 동결했다. 문장 조각은 원래 문자열 그대로이며 날짜 표기나 단어를 바꾸지 않는다.
4. 기존 checker 테스트 66개가 모두 PASS했다(`candidate-tests.log`, exit 0). 후보 동결 후 R의 기존 DE 26편에서 문장 배열·전체 지표·판정의 전후 차이는 0이었다. B6 새 원고는 이 비교 대상에서 제외했다.
5. 테스트 종료 뒤 공유 입력 207파일이 그대로임을 다시 확인했다. 후보 트리의 변경 파일은 `variety_multilingual.py` 하나이며, DE 분기를 제외한 코드의 바이트와 AST가 동일하다. 현행 프로필 JSON 45개, 원래 4개 언어 처리, 단어 정의·임계값·다른 언어 분기는 모두 불변이다. 다른 48개 언어의 전체 원고 코퍼스를 다시 측정했다는 주장은 하지 않는다.

Root가 제공한 `Quellenstand: 25. und 26. Oktober 2026.`만 후보 동결 뒤 별도 확인했으며, 정확히 한 문장으로 반환됐다(`final-integrity.json`). 표적 원고의 CV를 보고 변경을 조정하지 않았다.

범위는 완전한 월 이름을 공유하는 연결 날짜다. 모든 생략형·약식 월 이름·독일어 서수 사용법을 새로 지원한다는 의미는 아니다. 기존 표기와 판정 기준을 유지하면서 재현된 경계 오류만 수정했다.

Root 검토 대상: `candidate.patch`, `candidate/variety_multilingual.py`, `design-freeze.json`, `candidate-freeze.json`, `baseline-neutral.json`, `candidate-neutral.json`, `candidate-tests.log`, `regression-result.json`, `final-integrity.json`. 설치와 저장소 반영은 Root 담당이다.

재현 명령(결과를 보존하려면 새 report 경로 사용):

```sh
PYTHONDONTWRITEBYTECODE=1 python3 run_neutral.py --root candidate --report fresh-neutral.json
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s candidate/tests -p 'test_*.py' -v
```
