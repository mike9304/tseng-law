# FI 접속 날짜·HU Markdown escape 경계 후보

2026-10-26. 공유 설치와 원고 수정은 하지 않았다. 소유 범위는 이 `date-boundaries/` 폴더다. 후보 구현은 `candidate/variety_expansion.py` 한 파일만 바뀌며, 설치 대상 50개 전체 SHA는 `INSTALL-MANIFEST.json`에 기록한다. 기존 49개 언어, 45개 JSON profile, 단위 정의, 8/32 기본값, score와 HARD는 그대로다.

## 문제와 근거

FI의 `7. ja 8. toukokuuta`는 같은 월을 공유하는 날짜인데 기존 검사기는 첫 점에서 문장을 잘랐다. [Kotus의 날짜 안내](https://kielitoimistonohjepankki.fi/ohje/ajanilmaukset-paivays-ja-vuosiluku/)에는 접속된 일자 표기가 직접 나온다. [서수 안내](https://kielitoimistonohjepankki.fi/ohje/luvut-ja-numerot-jarjestysluvut/)도 숫자 뒤 점을 설명한다. 후보는 1–31 일자, 소문자 `ja`/`tai`/`vai`, 다음 일자, 명시된 12개 월의 연속 구문만 보호한다. `tai`/`vai`는 이 표기를 접속 구문에 적용한 제한적 문법 해석이며 공식 문서가 문장 분리 알고리즘을 제공했다는 뜻은 아니다. 대문자로 시작하는 다음 문장, 월이 없는 숫자 문장은 합치지 않는다. Unicode 가로 공백도 검증했다. 기존 단일 날짜·약어 규칙은 보존한다.

HU의 원문 `2018. augusztus...`는 실제 ReactMarkdown에서 순서 목록이다. 따라서 목록 판정을 완화하지 않았다. 작성자가 표시를 바로잡은 `2018\.`는 일반 문단의 `2018.`로 보이지만 기존 검사기는 백슬래시를 남겨 연도를 독립 문장으로 셌다. [CommonMark 0.31.2 §2.4](https://spec.commonmark.org/0.31.2/#backslash-escapes)는 ASCII 문장부호의 escape와 문자 그대로 남는 백슬래시, 코드 안의 예외를 구분한다.

후보는 원래 Markdown으로 블록을 분류한 다음 확장 35개 언어의 `visible_text` 단계에서 escape를 한 번 해석한다. escape한 별표·밑줄·백틱을 마크업으로 다시 지우지 않도록 임시 보관하며, 맞는 길이의 백틱으로 닫힌 코드 span 내부의 백슬래시는 보존한다. `2018\\.`와 `2018\.`는 표시상 같지 않다. 기존 14개 언어 전처리기는 변경하지 않았다.

## RED → GREEN과 보존한 검사

`neutral-fixtures.json`의 literal 기대값을 production 수정 전에 동결했다. 학교·도서관 예문이며 목표 원고 점수로 조건을 선택하지 않았다. 보고된 FI 말미 한 문장과 HU 중립 조각은 이미 보았음을 명시한다. 목표 FI/HU 본문은 `CANDIDATE-FREEZE.json` 작성 후 비교에만 사용했다.

| 실제 검사 | 결과 |
|---|---:|
| 원본에 대한 새 중립 계약 | 68개 중 14개 일치, 54개 실패, exit 1 |
| 후보에 대한 같은 중립 계약 | 68/68, exit 0 |
| 설치돼 있던 전체 unittest discovery | 66 methods, 4.292초, OK |
| 기존 DE 날짜 중립 회귀 | 57/57, 본문 파이프라인 일치 |
| 실제 R ReactMarkdown+remarkGfm 표시텍스트·목록 대조 | 13/13 |
| 미지 언어 명시·언어 추정 불가 CLI | 원본/후보 각각 exit 2, 자동 fallback 없음 |

Node는 `/Users/son7/.nvm/versions/node/v24.14.1/bin`을 PATH 앞에 두었다. 첫 중립 실패와 최종 성공, 실제 CLI stdout/stderr를 모두 보존했다. 같은 검사를 통과 횟수를 늘리기 위해 반복하지 않았다.

## 동일 입력 49개 언어 회귀

`INPUT-FREEZE.json`은 shared 원본 209개 파일과 설치 대상 50개를 동결한다. R 입력은 HEAD `f66daa9f153537c000d23486e8be638472251012` 시점의 작업 바이트 2,235개 Markdown이다. 당시 B7 통합이 진행 중이므로 깨끗한 HEAD 내용과 같다고 주장하지 않는다. 실제 dirty 목록도 보존했다. 2,235는 도구의 전체 Markdown 포함 수이며 전문 칼럼·공개 게시 수가 아니다. 양쪽은 `regression-inputs/`의 동일한 SHA를 읽었다. 비교 스크립트는 R을 명시적 `--repository` 인자로 확인한다.

2,204개가 측정됐고, 태국어 31개는 양쪽 모두 source SHA에 연결된 검수 승인 문장 지도 부재로 exit 2였다. PATH나 ICU 오류가 아니며, 양쪽 오류가 같다는 이유로 통과로 세지 않았다. 나머지 언어를 포함한 기존 테스트의 Thai dictionary 계약도 Node24에서 통과했다.

변화는 FI704–706의 정상 출처 확인 날짜 병합 세 곳뿐이다. 나머지 2,201개 측정 행의 문장 배열·지표·score·HARD 결과와 Thai31 오류 행은 동일하다. 언어별 score 비교 중앙값도 동일하다. 새 escape 처리는 이 동결 기존 corpus의 다른 행을 바꾸지 않았다.

| 기존 FI | 문장 수 전→후 | CV 전→후 | 실제 check 전→후 |
|---|---:|---:|---:|
| 704 | 69→68 | .457→.441 | 0→1 |
| 705 | 75→74 | .479→.466 | 0→0 |
| 706 | 86→85 | .456→.444 | 0→1 |

704·706은 오분절로 높아졌던 CV가 내려가 FAIL이 된다. 기준을 느슨하게 하거나 정상 날짜를 바꾸지 않았다. 이 결과를 root에 전달했으며 원고 수정은 별도 책임이다. `corpus-delta.json`에 정확한 세 문장과 모든 수치 변화가 있다.

## 동결 B8 FI6·HU6의 별도 영향

작성자 동결 기록과 전체 SHA를 확인해 `target-inputs/`로 복사한 뒤 실제 양쪽 CLI를 실행했다. 블록·소제목·목록은 모두 불변이다. FI는 각 편 출처 확인 날짜 두 조각을 하나로 합쳤다. HU는 다섯 파일의 escape한 연도 여섯 곳을 날짜 문장에 되돌렸으며 915는 변화가 없다. 변경 전후 문장 전체와 길이는 `baseline-targets.json`, `candidate-targets.json`, 정확한 delta는 `target-delta.json`에 있다.

| B8 원고 | 후보 문장 수 | 후보 CV | 실제 후보 exit |
|---|---:|---:|---:|
| FI915 | 40 | .469 | 0 |
| FI916 | 46 | .530 | 0 |
| FI918 | 44 | .479 | 0 |
| FI919 | 41 | .419 | 1 |
| FI920 | 40 | .470 | 0 |
| FI921 | 46 | .539 | 0 |
| HU915 | 34 | .509 | 0 |
| HU916 | 41 | .484 | 0 |
| HU918 | 37 | .484 | 0 |
| HU919 | 35 | .479 | 0 |
| HU920 | 35 | .481 | 0 |
| HU921 | 41 | .518 | 0 |

FI919는 baseline에서도 .445로 FAIL이며 후보에서도 FAIL이다. 작성자에게 그대로 전달했다. HU의 총223개는 작성자가 별도로 실제 렌더 문단에서 확인한 개수와도 일치한다. 개수 일치만으로 모든 언어적 경계를 보증하지 않는다. 이 작업은 독립 의미·문체 검수, 원어민 승인 또는 법률감수가 아니다.

## 범위와 한계

FI 처리는 공유 월이 명시된 접속 일자에 한정한다. 모든 서수·줄임 날짜·일자 생략·문법적 모호성을 해소하는 구문 분석기가 아니다. 기존 FI의 결합 문자 NFD 처리나 완전한 Markdown 파서를 새로 구현한 것도 아니다. `visible_text`의 기존 링크·강조 제거 방식은 경량 휴리스틱이며 복잡한 중첩 링크, raw HTML, 모든 unmatched 마크업, hard line break의 전체 CommonMark 적합성을 주장하지 않는다. 코드 span의 백슬래시는 표시대로 보존하지만 코드 안의 문장부호는 여전히 문장 분리 휴리스틱의 대상이다. 정상 원문·출처를 점수용으로 바꾸지 않았다.

공유 설치는 root가 판단한다. 설치 시 변경 production 파일은 `variety_expansion.py` 하나이며, 새 중립 테스트는 `run_neutral.py`와 `neutral-fixtures.json`을 같은 폴더에 두고 `--root <설치경로>`를 명시해 실행할 수 있다. 최종 원본·목표 SHA 보존 확인은 `FINAL-INTEGRITY.json`, 설치 파일 SHA는 `INSTALL-MANIFEST.json`을 따른다.
