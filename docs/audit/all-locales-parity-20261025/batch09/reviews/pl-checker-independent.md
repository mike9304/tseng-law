# PL 날짜 경계 후보 독립 코드 검토 R1

2026-10-26. 검토자 `/root/column_voice_rules`. 판정: REQUEST_CHANGES. 후보 `457e3406a53c1f4388861ec39138b4e9720d3613d0f6a80b18e9e4ccb87ff6bf`를 그대로 공유 설치하지 않는다. 필수 M01 한 건이며, 그 원인으로 새 오병합 중립 반례 5개를 직접 재현했다. 기존부터 남아 있던 범위 한계 두 건은 별도로 적었다.

검토자는 이 root 작성 PL 수정에 참여하지 않았다. 다만 이전 PL 프로필과 공통 도구 작업에 참여했으므로 검사기 전체에 대한 독립 인증이나 원어민·법률 승인으로 표시하지 않는다. 이 검토에서 후보·원고·R·shared를 수정하지 않았으며, 소유한 `checks/pl-checker-independent*`와 이 보고서만 추가했다.

## 고정 입력과 실제 확인 범위

- 제출 보고서: `b466a42417e138e620b1c94c1e576d7337c38b4b76ab2563668da55ac63efe93`.
- 제출 REVIEW-MANIFEST: `f860b63ed4abf4f372bc14a8df47ae409c91cd5f17f83541e5370dcff7edc44f`. 등재 25파일을 실제 SHA와 대조하여 모두 일치했다.
- baseline expansion: `ea03abaa59249d7d914e1c98a5231a5c1636528dd1ecda326b0d4638edf17975`.
- candidate expansion: `457e3406a53c1f4388861ec39138b4e9720d3613d0f6a80b18e9e4ccb87ff6bf`.
- PL 프로필: `00b4d91b84026bda2a8f76f963302865311f3ca3600fbd1d1a4267a7ff7dd0fa`, 불변.
- 제출 baseline production 49파일의 실제 바이트를 확인했다. 후보와 다른 파일은 expansion 한 개다. AST 비교에서 추가 `_polish_fronted_date`와 변경 `split_sentences`만 확인됐다. 전역 점수·HARD·8/32 단위 기준·49언어 목록·프로필은 바뀌지 않았다.

전체 production delta, helper와 호출부, 기존 문장 분리 흐름, root의 fixture·측정·렌더 스크립트, 기존 7 methods 테스트를 읽었다. INPUT-FREEZE의 원본 2,235파일과 PL 대상 사본 6파일의 SHA도 전부 재검증했다. 이 코퍼스는 B8에서 보존한 동일 입력이며 동시 변경 중인 R 현재 내용이나 SK 후보의 별도 2,277파일 snapshot을 뜻하지 않는다. PL 대상은 root가 고정한 R2 사본이다. 이후 작성자가 수정한 R3의 결과로 승계하지 않는다.

## M01 — 날짜만 답한 독립 문장을 다음 문장과 합친다

위치: `candidate/variety_expansion.py` 111–125행, 208–209행. 124행의 시작 문맥 `[.!?]` 및 문단 시작 `^`에 해당하는 날짜를 찾으면 `r.`의 종결 가능성을 끈다. 뒤에 글자가 있다는 것만 확인하며, 뒤의 문장에 실제로 그 날짜의 술어가 있는지는 확인하지 않는다. 111행의 “날짜만 있으면 다음 술어가 필요하다”는 설명은 생략형 답변에는 성립하지 않는다.

첫 중립 반례:

```text
Kiedy otwarto wystawę? W maju 2023 r. Dziękuję za odpowiedź.
```

고정 기대 배열과 baseline의 실제 배열은 다음 3문장이다.

```json
["Kiedy otwarto wystawę?", "W maju 2023 r.", "Dziękuję za odpowiedź."]
```

후보는 마지막 두 문장을 합쳐 2문장으로 만든다. `6 stycznia 2022 r.`로 답한 경우도 같다. root에 즉시 알린 뒤 다음 문맥도 원고·점수와 무관한 literal 기대 배열로 먼저 고정하고 실행했다.

| 문맥 | baseline | 후보 |
| --- | --- | --- |
| 물음 뒤 월·연도 답변 + 감사 문장 | 정상 3 | 오병합 2 |
| 물음 뒤 일·월·연도 답변 + 감사 문장 | 정상 3 | 오병합 2 |
| `Podaj datę otwarcia wystawy.` 뒤 날짜 답변 + 감사 문장 | 정상 3 | 오병합 2 |
| 같은 요청을 `!`로 끝낸 뒤 날짜 답변 + 감사 문장 | 정상 3 | 오병합 2 |
| 질문 다음 별도 문단에 날짜 답변 + 감사 문장 | 정상 3 | 오병합 2 |

이는 기존 측정 한계가 유지된 경우와 다르다. 정상 경계가 새 코드로 합쳐져 문장 수·길이·CV와 판정을 바꿀 수 있으므로 현 후보를 설치하지 않고 범위를 수정해야 한다. 정확한 원문·기대·양쪽 실제 배열은 `pl-checker-independent-findings.json`과 두 context 결과에 보존했다. 원고 표기·수치·구두점을 바꾸거나 임계값을 조정하는 해결은 하지 않는다.

작은 수정 방향은 `_polish_fronted_date`의 시작 대안에서 `?`와 `!`를 제외하고, 질문·느낌표 뒤 날짜 단편 반례를 추가하는 것이다. 일반 마침표 뒤 날짜 도입과 등위 접속절은 별도 양성으로 유지할 수 있다. 그러나 이 수정만으로 위 마침표·문단 시작 반례가 해결되지는 않으므로 M01 전체가 닫혔다고 주장할 수 없다.

반대 방향의 정상 예문도 고정했다.

```text
Kiedy otwarto wystawę? W maju 2023 r. Biblioteka udostępniła nową salę.
```

이 문장은 기대 2문장이고 현재 후보는 맞게 분리하지만 baseline은 3개로 자른다. 따라서 질문 뒤 보호를 일률 해제하면 이 예문은 기존 오분리로 돌아간다. `?`/`!` 직후 날짜의 두 읽기를 구별하지 못하는 경우, 둘 중 하나를 조용히 확정하는 대신 명시적 측정 불가로 처리하는 보수적 방안도 검토할 수 있다. 다음 토큰이 `Dziękuję`, 특정 기관명, 특정 고유명사라는 예외 목록으로 맞추는 방식은 권하지 않는다.

## 기존 오류 경로와 API 범위

현 코드에 `expansion.SegmentationError` → `multilingual.MeasurementError` → `check`의 exit 2 경로가 이미 있다. PL 중립 입력의 예약 문자를 사용해 실제 CLI exit 2를 재현했다. 이것은 기존 경로의 관측이며 PL 날짜 모호성 guard를 구현하거나 검증한 결과가 아니다.

`sentence_map`은 `lang != 'th'`이면 즉시 `None`을 반환한다. PL에 override를 주어도 지도 처리가 되지 않음을 읽고 실제 함수로 확인했다. expansion 경로는 mapping을 사용하지 않는다. `--sentences`도 태국어 SHA-bound 지도용이다. 따라서 PL 경계 지도를 그대로 붙일 수 있다고 안내해서는 안 되며, 새 PL map API·승인 구조 확장은 이번 최소 수정에 포함하지 않는 편이 맞다. 범위를 좁힌 모호성 검출에서 기존 SegmentationError를 사용하는 것은 새 API 없이 가능하지만, 어떤 입력을 모호하다고 볼지는 별도 fixture와 실제 실패로 검증해야 한다.

## 추가 관측 — 기존 한계, 이번 신규 회귀와 구별

O01. `We wrześniu 2023 r. Łucja uporządkowała księgozbiór. Katalog pozostał otwarty.`는 양쪽 모두 날짜 뒤를 잘라 3개로 만든다. helper는 `w`만 받고 `we`는 받지 않는다. 제출 NFD 예문의 `W wrześniu`로 일반적인 `we wrześniu`까지 지원한다고 볼 수 없다. 이는 기존부터 미지원인 형태이며 이번 diff가 새로 망가뜨린 것은 아니다. [UW 폴란드어 연구소의 실제 용례](https://ijp.uw.edu.pl/index.php/struktura/zaklad-gramatyki-semantyki-i-pragmatyki-wspolczesnego-jezyka-polskiego/)에도 `we wrześniu`가 쓰인다. 추후 확장한다면 올바른 NFC/NFD 예문과 실제 종결 반례를 먼저 고정한다.

O02. NFD `księgozbiór.`의 어말 `r` 앞 결합부호를 현재 공통 약어 regex `(?<!\w)`가 단어 밖으로 취급하여 `r.` 약어로 보호할 수 있다. 독립 NFD 예문에서 baseline도 다음 문장을 붙였고 후보도 붙였다. 후보가 분류용 날짜 접두부를 NFC로 바꾸는 조치는 원문과 위치를 보존하지만 모든 NFD 문장 경계 지원을 뜻하지 않는다. 이 공통 경계 문제를 이번 PL 날짜 수정과 섞어 고치지 않았다.

공식 [NCK 날짜 표기 설명](https://nck.pl/projekty-kulturalne/projekty/ojczysty-dodaj-do-ulubionych/ciekawostki-jezykowe/czy-wiecie-jak-poprawnie-zapisujemy-date-)은 일·월·연도의 순서, 월의 속격, 연도와 `r.` 사이 공백을 설명한다. [UW 언어상담](https://poradniajezykowa.uw.edu.pl/porady/kropka-po-oznaczeniach-lat/)은 연도 표기와 문장 종결점 및 `r.`의 점을 구별한다. 이 자료들은 표기의 근거이며 위 regex의 의미 경계 판정을 보증하지 않는다. 날짜 자체를 점수 때문에 바꾸는 근거로도 쓰지 않았다.

## 실제 검증과 재사용한 증거

| 검사 | 독립 실행·대조 결과 |
| --- | --- |
| 제출 중립 18예문 | baseline 8/18, 후보 18/18 직접 재실행 |
| 독립 추가 15예문 | baseline 5/15, 후보 11/15; 신규 답변 오병합 2·기존 한계 2 포함 |
| 추가 문맥 4예문 | baseline 3/4, 후보 1/4; 새 오병합 3과 정상 완결 답변 1 |
| 기존 관련 테스트 | 7 methods 실제 PASS, Node 24 PATH 명시 |
| 저장된 동결 코퍼스 | 2,235행의 배열·본문·제목·목록·metrics·score·check stdout/판정·오류 및 언어별 중앙값 모두 정확히 동일 |
| PL 코퍼스 26파일 | 후보 API로 새로 계산한 전체 행이 제출 최종 기록과 정확히 동일 |
| PL 대상 사본 6파일 | 후보 API의 배열·단위·metrics가 제출 최종 기록과 정확히 동일 |
| 표시 텍스트 | 저장 ReactMarkdown HTML을 독립 파싱, 82문단의 실제 측정 텍스트와 모두 동일 |
| 기존 오류 경로 | 실제 PL CLI exit 2; trace 없음; 새 모호성 기능 구현 아님 |

전체 2,235파일을 또 실행하지 않았다. 제출된 양쪽 실제 결과를 전수 대조하고 입력 해시를 검증한 뒤 변경 언어 PL26과 PL6만 API로 다시 계산했다. 66 methods 전체 재실행으로 표시하지 않는다. 전체 코퍼스 기록에는 개별 길이 배열이 별도 직렬화되지 않았다. 그 범위의 단위 동일성은 같은 문장 바이트와 불변 토큰 함수로부터 도출되며, 이번 PL26 재실행에는 길이 배열을 직접 저장했다.

동결 코퍼스 2,204파일은 측정됐고 TH31은 양쪽 모두 승인된 source-SHA-bound 문장지도 부재로 측정 불가다. 이 오류는 PATH/ICU 실패가 아니고, 양쪽 오류가 같다는 이유로 PASS로 간주하지 않았다. 기존 1,082 PASS / 1,122 FAIL / 31 측정 불가가 그대로다.

실제 PL 대상에서는 제보된 두 경계만 바뀌어 총 236→234문장이 됐다. 915는 37→36, CV .465→.486; 918은 43→42, .453→.428이다. 다른 네 편은 동일하다. 918의 실제 후보 CLI exit 1/길이 변동 FAIL 기록을 그대로 인정한다. 독립 검토에서 같은 여섯 파일 CLI를 반복하지 않았고, 이후 원고 수정의 PASS로 바꾸어 기록하지 않았다. 렌더 텍스트 일치는 문자 손실 검사이며 문법 경계의 증명이 아니다.

root의 첫 raw Markdown 대조 실패는 원래 기록에서 보존돼 있다. 검토자에게도 첫 입력 해시 래퍼에서 `PL-TARGETS.json`의 `files` 래퍼를 놓친 FileNotFoundError가 있었다. 검사 실행·보고서 쓰기 전에 발생했으며, 스키마를 확인한 뒤 조회만 바로잡았다. `pl-checker-independent-initial-error.json`에 보존했다.

## 종결 범위

후보와 기존 기록을 보존한 채 필수 M01을 root에 전달한다. 이 R1은 수정 전 후보의 결과이며 후속 수정본의 승인으로 사용하지 않는다. SK 후보는 PL engine 변경과 별개 프로필 diff이므로 별도 검토·설치 결정을 할 수 있다. 최종 입력 불변 확인과 산출물 SHA는 `checks/pl-checker-independent-final-manifest.json`에 기록한다.
