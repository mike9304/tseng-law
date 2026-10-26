# PL R4 — 918 표적 독립 검수

검수자: /root/column_existing_drafts. 기록 시각: 2026-10-26T10:38:54.658679+00:00.

판정: R3의 M01–M03 및 S01–S06 종결 상태를 유지한다. R4의 네 문장 결합에서 새 법률 필수 오류는 발견하지 않았다. 현재 공유 검사기와 새 SHA에 묶인 완전한 문장 지도로 918 실제 exit 0 / FAIL 0, CV 0.504, 38문장을 확인했다. 원어민·변호사 승인, 브라우저 렌더링 또는 게시 완료를 뜻하지 않는다.

## 인수 및 보존

- Root가 Kimi session 62060의 실제 exit 0을 회수했다고 통보했다. 이 검수자는 새 외부 실행을 하지 않았다. 승인된 `revision-r4-inputs.json` 18입력 SHA, 이전 22개 Kimi 결과·보존 파일, 기존 독립 보고서/증거 7개가 그대로다.
- 원 R3 여섯 원고와 핵심 기록을 `kimi-pl/r4-r3-snapshot/`에 먼저 보존한 뒤 918만 모델 결과와 바이트 동일하게 인수했다. `raw-output-r4/`에는 918·author-review-r4·edits-r4·모델의 before-r4 사본을 보존했다.
- `edits-r4.json`의 네 old/new를 직접 적용해 R3→R4와 R4→R3 모두 정확히 복원했다. 다른 다섯 원고, 918 frontmatter/FAQ 3개, 숫자와 URL 순서가 그대로다. 전체 FAQ는 17개인 R3 상태를 유지한다. `author-review-r4.md` 전문을 읽었다.

## 실제 문장 대조

| 항목 | 실제 변화·검수 | 이유 / 의미 보존 |
|---|---|---|
| E01 / P2 | `wydał wyrok … . Oddalił …` → `wydał wyrok …, którym oddalił …` | 날짜·臺中高分院·사건번호와 본안상 이유 없음에 따른 상소/추가청구 배척, 지연이자 의무를 같은 사건의 한 문장으로 연결했다. 뒤의 절차상 각하 아님 및 추가 상소 불가를 유지한다. 정본 둘째 문단과 일치한다. |
| E02 / P7 | 현행 point 15의 통지 의무와 `Określa także …`를 `…, a także określa …`로 연결 | 주체인 규정의 두 기능을 묶었다. 사용허가 취득일부터 6개월 안 통지해야 함, 수선·대금정산·서류 인도 의무를 유지한다. 역사적 계약 4개월 및 통지/물리적 인도 구별도 앞뒤에서 유지된다. |
| E03 / P9 | `Obecny punkt 14 … . Zakwestionowanie …` → `Choć obecny punkt 14 …, zakwestionowanie …` | 대출서류·관련 절차·소유권 이전 전 지급의무와 통지 이의만으로 도래한 지급/서류 의무가 자동 소멸하지 않음을 모두 보존한다. `Choć`의 수사 관계는 아래 선택 제안으로 분리한다. 저자 기록의 “조건 관계”라는 명칭과 달리 실제 접속사는 양보형이다. |
| E04 / P11 | 2026년9월18일 개정과 2019년 계약 이행에 소급 적용하지 않는 문장을 `r., ale …`로 연결 | 두 시점과 현재 규정/과거 사건의 구별을 그대로 보존한다. 정상 날짜나 약어를 검사 점수에 맞춰 바꾸지 않았다. |

정본 ZH918 전문을 다시 읽고 현재 R4 문장과 대조했다. 이번 표적 검수에서 공식 416쪽 PDF 전체를 새로 읽었다고 주장하지 않는다. 앞선 동결 연구의 공식 요약·선별 판결 근거와 정본을 사용했으며, 원고의 “선택한 판결 부분” 고지도 유지한다.

## 선택 문체 제안 S-R4-01

문장: `Choć obecny punkt 14 nadal wymaga …, zakwestionowanie zawiadomienia … nie usuwa automatycznie …`. 이유: 두 절이 같은 결론을 지지하므로 양보 접속 `Choć`는 약간 부자연스럽다. 필수 조건이나 법적 결과를 반대로 쓰지는 않았다. 선택 수정안: `Obecny punkt 14 nadal wymaga od nabywcy przedłożenia dokumentów kredytowych, wykonania powiązanych czynności i zapłaty należności przed przeniesieniem własności, dlatego zakwestionowanie zawiadomienia o wydaniu nie usuwa automatycznie wymagalnych płatności ani obowiązków dokumentacyjnych.` 인과 연결을 명시하며 의무·시점·“자동” 한정을 보존한다. 원고는 수정하지 않았다.

## 경계·§5·MONOTONY

R3 승인 배열의 14문단/42문장에 네 실제 결합만 적용해 14문단/38문장을 구성했다. 34문장은 그대로이고 4문장은 새로 결합됐다. 전체 38개 실제 표시 문장과 네 변경 문단을 읽었으며, 동일한 10문단은 이전 승인 배열과 정확히 같다. `W sierpniu 2025 r. Rada …`는 계속 한 문장이다. 자료 확인일 약어와 `r., ale`도 분리하지 않는다. 모든 문단의 표시 텍스트가 원문 표시 텍스트와 일치한다.

무지도 실행은 실제 exit 2(모호한 날짜 경계), 옛 R3 지도는 실제 exit 2(stale source SHA)였다. 이 둘을 FAIL 0으로 세지 않는다. 새 독립 승인→지도→현재 shared 실제 CLI의 연결만 918 최종 측정으로 사용한다. 다른 다섯 R3 지도는 바꾸지 않았고, 코드·프로필·원고·지도 SHA가 현재와 동일한 앞선 실제 candidate CLI 증거를 재사용한다. 이를 새 공유 실행으로 이름 바꾸지 않았으며 전체 반복 실행은 하지 않았다.

MONOTONY: 비슷한 길이의 규정 설명 — P7의 `Obecny punkt 15 …`와 `Określa także …` — 같은 규정의 통지 및 인도 단계 기능을 연결한 실제 39단어 문장, 앞의 9단어 계약기간 문장과 뒤의 11·7·19단어 설명이 받쳐 준다. P9의 32단어 문장은 다음 11단어 사실문으로 이어져 장문 연속을 만들지 않는다. 판결문단은 28·7·7, 실무자료 문단은 4·19·17이다. 기계 수치만으로 자연스러움을 승인하지 않았다.

§5 확인: 첫머리 허구 장면은 명시적으로 표시하고 실제 사건과 분리한다. 중간 질문은 금융 진행과 계약상 의무의 관계에 관한 내용 질문이다. 법정 의무 및 실무 조언을 서로 바꾸지 않았다. 제목·소제목·FAQ·고지·출처를 읽었고 새 굵은 강조나 국적/상담 언어 주장을 추가하지 않았다. 고지 직전 실질 결말은 세 종류 통지를 구별해 날짜와 문서를 대조하는 구체적 행동으로 끝난다. 마지막 고지의 선별 판결 독해 한계는 유지한다.

구조 검사: 영향 918만 실제 `pl-audit.mjs kimi-r4 918` 실행, selected 1 / errors 0. 이전의 6편 구조/FAQ 검증과 불변 SHA를 연결했다. 원고·공유 도구·R에 추가 변경은 하지 않았다.

## 현재 원고 SHA

- 915-taiwan-public-contract-mediation-arbitration-same-claim.md: `a11bd9f70669e74cd046d77364a82468f4a191bb6112922f2208c6d5c68b2791`
- 916-taiwan-parent-company-pollution-liability-us-investor.md: `67e1a4bd4123dd6de01e1a0e66586cf6d22903063ffb568b999a24301b6c536f`
- 918-taiwan-presale-mortgage-notice-handover-judgment.md: `d3ed3720492f1acc5703d8e361373eb9f958105da46034c064a17564e7ebfc55`
- 919-taiwan-workplace-bullying-investigation-hearing-judgment.md: `a48b8191ba92a6a386c2108fd12c6966484ef86fd2af8941b40c3ae1a38e9628`
- 920-taiwan-apartment-ev-charger-common-area-judgment.md: `1ae0a5c6dd50d985378f533d266248349d164314bd39cfdf13fefd4b26ef5b30`
- 921-taiwan-online-game-coins-refund-judgment.md: `c29911404cc6477949d269efbbc26946512b5fd477ded9ed1a4f655145c3551b`

증거: `kimi-pl/r4-intake-manifest.json`, `checks/pl-independent-r4-reviewed-boundaries.json`, `pl-independent-r4-boundary-approval.json`, `pl-independent-r4-918.sentences.json`, `pl-independent-r4-required-map-checks.json`, `pl-independent-r4-variety.json`, `pl-content-audit-kimi-r4.json`, `pl-independent-r4-input-end-guard.json`.
