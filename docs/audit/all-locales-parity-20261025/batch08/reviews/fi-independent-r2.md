# FI6 R2 — 선택 S01 표적 종결

2026-10-26, 검수자 `column_pipeline`. 921의 S01은 해결됐다. 필수 0·미해결 선택 0. R1 보고서와 증거는 그대로 보존하고 이번 기록을 추가한다. 현재 921 SHA는 `41db82df9e378f70cda63273f1dc53295d076d3b88bda8796af3806398f9b381`이며 나머지 다섯 원고는 R1과 동일하다.

저자 R2 전문과 manifest를 읽었다. R1 때 직접 보존한 여섯 전문에서 수정 전 921 SHA를 재확인한 뒤, 다음 두 문장만 정확히 한 번 바뀌었음을 순·역복원했다.

이전: `Säännös ei tee yrityksen aineistosta käyttökelvotonta. Sen rinnalle voidaan esittää maksukuitteja ja tukiviestejä, jotka kuvaavat rahan ja pisteiden kulkua.`

현재: `Yrityksen aineiston rinnalle voidaan esittää maksukuitteja ja tukiviestejä, jotka kuvaavat rahan ja pisteiden kulkua.`

사업자 자료가 쓸모없어졌다는 제기되지 않은 반박을 덜고, 그 자료와 영수증·고객지원 메시지를 함께 제시할 수 있다는 설명을 바로 연결했다. 앞 문장의 ‘사업자 보관 자료를 유일한 계약상 판단 근거로 삼을 수 없음’과 `voidaan` 가능 표현은 남는다. 소비자의 새로운 법적 의무나 추가 환급 조건을 만들지 않는다. 해당 문단과 전후 추출 문장을 직접 읽어 MONOTONY 선택 지적을 종결했다.

frontmatter·FAQ 17개·숫자 문자열·URL 순서·제목·목록·이미지는 R1과 불변이다. 변경편의 직접 현재 추출 배열이 실제 공유 실행에 저장된 배열과 일치한다. 46단위 중 두 문장이 한 문장으로 바뀌어 45단위, 나머지 44단위는 같다. 실제 변경편 CLI는 exit0 / CV .534 / FAIL0이며 기존 다섯 편은 동일 SHA의 실제 결과를 재사용한다. 현재 여섯 편은 합계 255단위다. 같은 SHA의 전체 CLI 재실행은 하지 않았다.

변경 1편 구조검사 errors0, 의미 상태 REVIEW_REQUIRED를 유지한다. 저자 R2 증거·원고 여섯·기존 독립 R1 증거 여섯·실제 도구 네 해시를 확인했다. LESSONS 17:05는 R1 종료 때 전문 재독한 동일 SHA다. 근거는 `checks/fi-independent-r2-proof.json`과 `fi-independent-r2-manifest.json`이다. 원고·저자 기록·공유 도구·R을 수정하지 않았고 인간 승인·브라우저 검증·공개 배포를 주장하지 않는다.
