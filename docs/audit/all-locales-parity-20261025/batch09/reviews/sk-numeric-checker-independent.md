SK numeric-date profile 독립 검토 — 2026-10-26

판정: 검토한 생산 변경에서 설치를 막을 새 결함은 발견하지 않았다. Root가 현재 PL 엔진을 유지하고 지정한 profile/test 차이만 병합하는 조건으로 설치 검토를 진행할 수 있다. 기존 Markdown 전처리와 범위 밖 서수의 한계는 남는다. 이 결과는 전체 SK 문장 경계의 정답 인증, 원고 발행 승인, 원어민·법률감수가 아니다.

정본은 `tooling/sk-numeric-date/REPORT.md` SHA256 `ae4f25c6218d7a49ca99ac386057eabfbe90e21730f722c921ca3708ccabaf41`와 `INSTALL-MANIFEST.json` SHA256 `af50121e7ffdffee64c56c8011a7015b84c1472a5a164e4dc20e3adc4ea40760`다. 증거 19개 및 설치 파일 5개를 실제 해시와 대조했다. 생산 변경은 `profiles/sk.json`의 `ordinal_pattern` 한 필드뿐이며 후보 SHA는 `2ea68f2ea8e9a6876c35ea895d8469bcf2c9e6091bb9c64f5bf0270c015bd9af`다. 기존 profile 분기는 그대로이고, 일 1–31/월 1–12/4자리 연도 형태를 인식하는 분기만 추가한다. 일반 decimal masking의 내부 표식 U+E000을 함께 인식하여 붙여 쓴 날짜와 혼합 간격도 처리하며, 연도 뒤의 실제 종결점은 보호하지 않는다.

현재 PL 설치를 복사한 `compatibility-after-pl`과 공유판을 직접 대조했다. 생산 차이는 SK profile 하나다. Python 엔진/METHOD, 다른 언어 profile, 단위, 8/32 경계, HARD와 score는 변경되지 않았다. 두 기존 테스트는 SK의 새 정확 해시만 반영하며, 원래 manifest와 다른 profile/AST 검증을 보존한다. 최초 독립 목록은 schema를 제외해 생산 49개로 집계했으나 종료 기록은 schema까지 포함한 50개를 명시적으로 대조했다. 후보 패키지 708개와 공유 생산 50개는 종료 시 시작 SHA 그대로였다. 2235편 전체는 반복 실행하지 않았다.

공식 [Pravidlá slovenského pravopisu](https://www.juls.savba.sk/ediela/psp2000/psp.pdf) §2.1, PDF 52–53쪽을 직접 읽었다. 문장 종결점·숫자 서수점·숫자 날짜·목록 번호를 구별하는 근거와 공백 있는 날짜 예시를 확인했다. 접근한 문서는 2000년 제3판이며 2026년 판으로 이름을 바꾸지 않았다. 이 정서법 자료는 날짜 안의 정상 점을 문장 끝으로 모두 자를 근거가 없음을 뒷받침하지만, 후보의 범위 제한이나 metric 기준을 규정하지는 않는다. 후보는 달력 유효성을 판정하지 않고 연도 없는 날짜를 일반 지원하지 않는다.

독립 실행과 동결 원문 대조 결과는 다음과 같다.

- 제출한 40개 계약, RED 16실패, 초기 support 누락 오류 및 hash-guard 실패 이력을 읽었다. 40개 중 연도 없는 날짜 1개는 기존 미지원 동작 보존이지 언어 정답이 아니다. 원 fixture나 기대 배열을 바꾸어 통과로 만들지 않았다.
- `date-tab`은 실제 U+0009 두 개, `newline-date`는 실제 U+000A 한 개를 포함한다. literal backslash-t/n가 아니며 코드포인트 확인을 별도 보존했다.
- 검토자가 먼저 고정한 추가 10개 중립 계약은 baseline 4/10, 후보 10/10이다. 날짜 범위, 연도 뒤 실제 새 문장, 대문자 월 이름, 인용, 링크, U+202F, 진짜 숫자 종결, compact date 및 목록/escaped 점을 포함한다.
- 현행 PL 엔진 기반의 새 1개 테스트와 전체 85개 테스트를 Node 24 PATH에서 직접 실행해 통과했다. 제출 Markdown 계약 6개도 checker 결과는 일치했다. 이를 실제 렌더링 일치와 혼동하지 않았다.
- R 24편+B9 새 6편+보수 사본 3편의 동결 바이트 33개로 배열·단위·metrics를 새로 계산했다. baseline/후보 모두 저자 저장 결과와 완전히 같았다. 원시 문단·제목·목록, 총 정서법 단위와 표시문자의 순서를 보존한다.
- 10개 파일/18개 변경 문단의 결과 배열을 모두 직접 읽었다. 변경은 날짜 내부의 거짓 경계 48개 제거이며 새 경계 추가 0이다. 2513→2465 분절, HARD 판정은 12 PASS/21 FAIL→11 PASS/22 FAIL이다. 새 6편과 877/878 보수 사본은 배열·지표가 그대로이며, 014 보수 사본의 CV .460→.427은 실제 PASS→FAIL이다. 원문이나 임계값을 조정해 이 실패를 숨기지 않았다.

실제 로컬 ReactMarkdown+remarkGfm으로 독립 10개+제출 Markdown 6개를 렌더한 첫 비교는 14/16 일치, 2개 불일치였다. 이 결과를 삭제하거나 성공으로 덮지 않았다.

1. `6. 4. 2031 bol termín.`은 두 단계의 중첩 `<ol>`로 렌더된다. 검토자가 단순 목록 개수를 1로 예상한 것이 틀렸다. checker와 렌더러 모두 해당 부분을 본문 산문으로 포함하지 않으며 뒤의 정상 문단은 동일하다. 이 불일치는 후보의 새 날짜 분할 결함이 아니다.
2. `Termín bol 7.\n8. 2032 a úrad ho potvrdil. Odpoveď prišla včas.`는 실제 하나의 `<p>`인데 baseline과 후보의 `body_blocks`는 둘째 줄을 목록으로 제외한다. 이는 기존 엔진의 표시텍스트 누락 한계다. 제출 fixture는 기존 checker 계약 보존으로만 인정하며 실제 Markdown 정답으로 인정하지 않는다. 이 후보가 전처리를 변경하지 않았으므로 새 회귀는 아니지만 해당 형태를 만나면 기계 점수만으로 완결 검수할 수 없다.

필수 후보 코드 교정: 0건. 후속으로 다룰 기존 한계는 위 soft-wrap 번호 전처리와 `1. úroveň`/`1. stupňa` 같은 범위 밖 서수다. 제출 보고서가 이를 해결한 것으로 과장하지 않았음을 확인했다. 이번 review에서 엔진 범위를 넓히거나 원고의 정상 숫자·구두점을 바꾸지 않았다.

설치 대상은 profile, 정확한 두 hash-guard 수정, 새 테스트와 fixture의 5개뿐이다. TR 후보와 공통인 `test_batch04.py`/`test_batch05.py`는 두 새 해시를 함께 유지하도록 병합해야 한다. 과거 candidate 엔진이나 METHOD를 현재 PL 설치에 덮어쓰지 않는다. 합본 설치와 최종 합본 검증은 Root가 수행한다.

독립 증거는 `checks/sk-numeric-checker-independent-*`에 보존했다. `inputs`/`end-guard`는 해시, `executions`는 실제 실행, `same-input-*`/`delta`는 동결 원문 영향, `control-characters`는 실제 탭·개행, `render-*`는 실패를 포함한 실제 표시 결과, `orthographic-sources`는 읽은 공식 근거 범위다. 최종 목록은 `sk-numeric-checker-independent-final-manifest.json`에 기록한다. 후보/공유/R/원고 및 타인 기록은 수정하지 않았다.
