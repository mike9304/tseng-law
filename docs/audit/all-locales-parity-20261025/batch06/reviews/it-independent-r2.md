# IT R2 — 요약 두 곳의 독립 종결 확인

2026-10-26. 판정: M01·M02 해결, 이번 변경에서 새 필수 지적0. R1 독립 검수자가 직접 보관한 원문과 현재 원고를 비교했다. 원고·저자 manifest·기존 R1 기록을 수정하지 않았다.

입력은 `it-r1-summary-fixes.json`, `it-r1-summary-structure.json` 및 현행 `it-author-manifest.json`이다. 현행 manifest SHA `f33646f61a7919d4925b3cc5ab033d7d14c948db29e2139033e29c9ea3e79ebc`와 원고6개 SHA가 일치한다. 새 독립 실행 결과와 원래/현재 요약 전문은 `checks/it-independent-r2-checks.json`에 있다.

| 지적 | 확인한 수정과 의미 | 판정 |
|---|---|---|
| M01·918 | `La sentenza distingue i passaggi del contratto.`로 법원의 판단을 끝내고, 다음 문장이 사건 계약4개월과 현행6개월 통지 규칙을 구별한다. 과거 법원이 현행법 비교까지 했다는 귀속이 사라졌다. 인도 단계·기간·통지라는 대상은 유지된다. | CLOSED |
| M02·921 | `ricostruire acquisti e utilizzo aiuta a capire quale saldo sia coperto`로 내역 재구성을 실무적 도움으로 서술한다. `Le regole attuali ... richiedono`라는 법정 의무의 표현이 사라졌다. 환급 대상 판별의 필요성은 남으며 본문·FAQ의 비용 공제·종료 후30일·쌍방 합의 조건은 불변이다. | CLOSED |

실제 차이는 두 파일의 summary 한 줄씩뿐이다. 직접 보관했던 R1 문자열에 각 제안 치환을1회 적용하면 현재 전체 원고와 정확히 같고, 역치환하면 R1 전체 SHA로 돌아간다. gray-matter 실파싱 결과 변경 메타데이터 키는 각각 summary뿐이며, summary 이외 원본 바이트·본문·FAQ는 같다. 따라서 URL·이미지·날짜·금액 등 다른 내용에도 변경이 없다. 나머지4편과 R1 독립 보고서 SHA도 같다.

현행 원고 SHA:

- 918: `575603a4fb63eb582dd0ed076f3f1a50af4aea796bb8140855728d98df691f66`
- 921: `2e92a5de5a50c3bd2bddd8f7ac40077a6ee620a7c04ecdfb39ffa9862c93b0da`

916의 S01·S02는 root 결정으로 적용하지 않았으며 처음부터 선택 사항이다. 전체 문체·구조 검사를 반복하지 않았다. 기존 본문 지표는 이번 새 실행값으로 표기하지 않으며, 메타데이터 밖의 동일 바이트가 그 적용 범위를 뒷받침한다. 이번 기록은 두 필수 지적의 독립 의미 종결이며 사람 원어민·변호사 승인, 실제 렌더링 또는 배포 확인이 아니다.
