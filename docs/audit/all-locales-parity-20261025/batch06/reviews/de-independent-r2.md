# DE6 독립 변경분 검수 R2

판정: APPROVE — 필수0, 미해결 선택0. R1 보고서와 초기 동결 기록은 그대로 보존했다. 이번 검수는 R1의 M01·M02·S01·S02를 반영한5개 치환과 변경 경계에 한정하며, 나머지 의미 판정은 원문 바이트가 동일함을 확인한 뒤 연결한다. 인간 원어민·변호사 감수 또는 공개 발행 승인을 뜻하지 않는다.

- M01·921 요약: `bereits verwendete Spielchips`가 `Münzen, die als Chips für Spielpartien dienten`으로 바뀌었다. 이미 사용한 물건이라는 추가 사실이 제거되고 게임 금화의 칩 기능이라는 원문 이유가 회복됐다. 금액·제목·FAQ·본문은 그대로다. 해소.
- M02·920 법명2곳: 독일어 설명명 `Gesetz über die Verwaltung von Wohnanlagen`과 정확한 중문 `公寓大廈管理條例`로 본문·목록을 통일했다. pcode·flno·모든 URL과 출현 순서, 제11조/단지 규약15조/제6조 제1항 제4·5호 및 제3항의 내용은 그대로다. 공식 독일어 번역을 주장하지 않는다. 해소.
- S01·916: `Hinsichtlich der 246 Anspruchsteller`로 표준 격과 수식 관계를 정리했다.246명 관련 부분 취소·환송과262명 부분의 상고기각은 변하지 않았다. 해소.
- S02·916: `Wer erhielt den Bericht?`가 뒤의 수신자 목록 설명을 직접 이끈다. 가공 수신자를 만들지 않고 `kann hervorgehen`의 가능성을 유지했다. 추상적 강조가 구체적인 질문으로 바뀌었다. 해소.

원고3개에서 실제 문자열을 역치환해 R1 독립 검수 SHA와 root가 보존한 원문 바이트를 각각 정확히 복원했다. FAQ 전부와 URL 순서는 동일하다.916·920의 frontmatter는 동일하고921은 요약 한 문장만 달라 본문 바이트가 같다.915·918·919의 SHA는 R1 그대로다.

916·920만 실제 공유 `--lang de`를 재실행했다. 각각46/45개 구간, CV .477/.466, exit0/FAIL0이다. 날짜·조문을 포함한 실제 추출 배열을 비교하니916은2문장,920은1문장만 변했고 구간 수는 그대로였다. 그3개 경계와 연결 문장을 직접 읽었다.921의 본문 지표는 본문 바이트 동일성을 확인해 기존 결과를 사용하며, 다른 세 편도 재실행하지 않았다. 새 필수 MONOTONY 문제는 없다.

root의 설치된 R 검사 결과 `checks/de-content-independent-r1.json`은 바뀐3편의 정확한 현재 SHA에서 오류0이다. 해당 결과를 다시 대조했으며 이 독립 단계에서 동일 구조 CLI를 중복 실행했다고 쓰지 않는다. REVIEW_REQUIRED/publicationReady false와 별개로, 위 수정 범위의 의미 지적은 해소되었다.

현재 저자 manifest SHA: de294b04f4904907f8e347f572a0b5b21a548f4d7d4ead7e9ee1abcbdbf534b9. 전체 원고 SHA와 직접 실행·역복원·경계 증거는 `checks/de-independent-r2-manifest.json`에 기록한다.
