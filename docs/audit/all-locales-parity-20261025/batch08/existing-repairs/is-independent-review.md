# 기존 IS704 표적 독립 재확인

2026-10-26T17:09:51.153221+09:00 — `PASS_TARGETED_REPAIR`, 미해결 필수 0. B8의 새 IS6 검수와 별도이며, R·원고·저자 기록·공유 도구를 수정하지 않았다.

검수 대상은 `columns-is/704-taiwan-arc-first-application.md`, SHA `74b7895c6567f66598a847b14ddef5c8359da1ca9b1432f5210754d0b5de9871`다. 원 R과 보존 최초 사본 SHA는 `46f91a4f964782286b4e79c443d53dcc1ab01a7f3a472846a8283ddc86474c70`로 현재도 같다. 저자 변경 기록 `is-root-edit.json` SHA `cc30d55cfc93d69b9a14a66d12b45817bfa5059a647af12eb1af7696256c7e52`와 실제 공유 stdout을 확인했다.

실제 변경은 다음 한 문장이다.

- 이전: `Eftir skráningu þarf nýlega staðfestingu skólans, útgefna innan síðasta mánaðar, ásamt gögnum um skráningu á yfirstandandi önn.`
- 이후: `Eftir skráningu þarf nýlega staðfestingu á námi, útgefna innan síðasta mánaðar.`

문제였던 `ásamt`의 누적 제출 의무가 제거됐다. 등록 후라는 조건, 재학을 증명하는 자료, 최근 1개월 발급 조건은 모두 남는다. 바로 앞의 등록 전 입학허가서 문장도 불변이다. 현재 학기 자료나 학생증을 반드시 별도로 더 내야 한다는 의무를 만들지 않고, EN 정본의 간결한 재학 증빙 범위를 유지한다. 이 검수자가 같은 턴에 직접 열어 확인한 [NIA0902 §3(1)(d)(iv)(b)](https://www.immigration.gov.tw/5475/5478/141465/141808/141970)의 포함/대안 관계와 일치한다. 갱신일은 2026-04-14이며 새 행정 규칙을 추정한 것이 아니다.

현재 전체 파일에서 정확히 이 치환만 되돌리면 보존 최초 사본 및 읽기 전용 R과 바이트 동일하다. Frontmatter/FAQ, 모든 URL의 값·순서, 숫자 토큰도 불변이다. 새 공유 함수로 읽은 65개 배열 중 64개가 그대로이며 20번 문장 하나만 17→11단어로 바뀌었다. 해당 문단은 질문→등록 전 자료→등록 후 자료의 실제 절차 구분으로 자연스럽게 이어지고, 같은 문장 첫말·출처 꼬리·도입·실질 결말을 바꾸지 않았다. MONOTONY: 이번 변경으로 생긴 반려 사유 없음. §5를 피하려고 정상 구두점을 바꾸거나 문장을 합치지 않았다.

Root가 현재 SHA로 실제 실행한 공유 `--lang is`는 exit0 / FAIL0, 65문장, CV .466, 짧은 문장 비중 .215다. 네 도구 SHA와 현재 배열·모든 지표가 root 기록과 같음을 확인했으며 같은 SHA의 CLI는 다시 실행하지 않았다. 사람 원어민/변호사 승인, 공개 반영 또는 기존 IS704 전체 법률 재감수로 표현하지 않는다. 최종 근거와 참조 SHA는 `is-independent-review.json`에 있다.
