# RO 저자 R3 — ITA 동격어 닫는 쉼표 복원

독립 검수자가 O02의 쉼표 삭제 제안을 정정했고 Root가 복원을 승인했다. `ITA`는 앞 기관명의 동격어이므로 뒤 쉼표가 이를 닫는다. 기존 R1 제안과 R2 반영·검사 기록은 그대로 보존한다. 조달 대상을 전력 인프라·전력망용으로 명료화한 내용과 920 FAQ 개선은 유지했다.

915의 `taiwan-energy-industry) prezintă achiziții pentru`를 `taiwan-energy-industry), prezintă achiziții pentru`로 한 번만 치환했다. ASCII 쉼표 1바이트 추가 외에 변경이 없다. 전 SHA `688c9eaa19ea1fa85cd2940f0294aa1beb6a1a6868fa655207b1053acb122fd2`, 후 SHA `e34e3ffd9df098598a2d317366b371d978ea88a37a03516389e1ca5277111cc7`다. 전후 전문·정역복원·diff는 `checks/ro-review-r3-punctuation.json`에 있다.

전체6의 다른5 SHA, FM/FAQ17, 숫자·링크 순서는 불변이다. 실제34번 문장은 `..., ITA, prezintă achiziții pentru infrastructura energetică și rețelele electrice din Taiwan, ...`로 읽었다. 자료일·예정 시점·미국 공급자·뒤의 비보장 문장에 영향이 없다.

공유 API로 전후를 각각 추출해 39개 문장의 경계·단어 수·전체 지표가 기존 실제 R2 `--lang ro` exit0 결과와 정확히 같음을 확인했다(CV .545). 문자 그대로의 문장 배열에서는 한 문장에 쉼표가 추가되므로 배열 바이트까지 같다고 쓰지 않는다. 임계값이나 표기를 회피하지 않았다. 같은 계측 결과에 CLI를 추가 반복하지 않았고 R2의 두 영향 파일 구조검사 오류0은 이전 실행으로 표시한다. 이번에 새 구조 CLI·공개 화면·배포를 확인했다고 주장하지 않는다.

MONOTONY: 새 반려 사유0. 문장 길이·문단 시작·도입·결말·법적 조건은 불변이다. 원저자·R1 독립·R2 저자 기록을 보존한 채 이 정정만 후속 독립 종결 대상으로 전달한다. 이 기록은 저자 검증이며 사람 원어민·변호사 감수나 독립 종결을 대신하지 않는다.
