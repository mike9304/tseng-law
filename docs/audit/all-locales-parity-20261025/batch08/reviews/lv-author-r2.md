# LV 저자 R2 — 선택 S01 반영

독립 R1 전문을 읽고 921의 선택 문체 S01을 채택했다. R1의 필수 오류는 0건이었다. 기존 저자·독립 보고서와 manifest는 덮어쓰지 않고 현재 결과를 별도 동결한다. 변경은 다음 한 문장뿐이다.

이전: `Tiesa vērtēja konkrēto monētu funkciju un atmaksas noteikumus, nevis izslēdza visus virtuālos priekšmetus no patērētāju aizsardzības.`

현재: `Tiesa vērtēja konkrēto monētu funkciju un šai spēlei piemērojamos atmaksas noteikumus.`

MONOTONY: 법원이 실제 평가한 범위 뒤에 모든 가상 아이템의 소비자 보호 배제라는 넓은 반박을 붙임 — 위 `nevis izslēdza ...` — 해당 게임의 코인과 적용 환급규정을 바로 제시했다. 변경 문장 자체의 `šai spēlei`, 이어지는 본문에서 다른 게임은 실제 취득·기능·계약에 따라 평가한다는 한정, FAQ1을 유지했다. 미사용 유료 포인트·게임비 양쪽 조건과 해지·철회·기록의 서로 다른 기산, 금액·판결 결과를 바꾸지 않았다.

새 921 SHA는 `f5e0e079f45df5fb1cdfdb4a37cdb7fd2cf2a6e72bf7f5b561be88f7fa8bf118`이다. 수정 전 전문을 `lv-author-r2-before.json`에 보존했고, 정확히 한 치환의 순·역복원 및 나머지 다섯 원고 SHA 일치를 확인했다. frontmatter 전체·FAQ·숫자 문자열·URL 순서·제목·목록·이미지는 그대로다. 기존 41개 저자·검수 파일의 SHA도 불변이다.

영향편 921만 실제 설치된 shared CLI를 실행했다. exit0 / FAIL0, 45단위, CV .515다. 과거 .512와 혼동하지 않는다. 현재 expansion `ea03ab…17975`를 포함한 네 도구 SHA와 실제 stdout은 `lv-variety-author-r2.json`에 있다. 변경 문장과 앞뒤 분절을 직접 읽었으며 45개 중 44개는 그대로, 한 개만 교체됐다. 본문의 날짜·서수·판례번호·쪽수는 바꾸지 않았다. 나머지 다섯 편의 동일 원고 CLI는 재실행하지 않았다. 여섯 합계는 계속 249단위다.

변경 1편의 구조검사를 실제 실행해 오류0·목록 노출1·FAQ3·공식URL4를 확인했다. 자동 의미 검토 REQUIRED5는 그대로 남고, 해당 항목의 제목·요약·FAQ·숫자·관할은 한 치환의 변경 범위를 대조해 재확인했다. 구조 PASS를 인간 승인으로 표시하지 않는다.

§5: 이번 치환은 도입·질문·문단 첫말·인용·끝맺음을 바꾸지 않는다. 불필요 대비 한 곳을 줄이고 짧은 문장 비율 .333을 유지했다. 출처·조건 보존이 지표보다 우선이며 문장 수를 맞추기 위한 공백·구두점 변경은 없다. 현행 LESSONS 17:05 전문은 직전 FI 검수에서 직접 읽었고 동일 SHA `86710ef330b108a916a7bb92a75f1ffa62dea53412e8a75f38472d9fa9b33130`로 이번 수정에 적용했다.

`lv-author-r2-edits.json`에 문제·이유·치환·의미 보존·역복원·경계를, `lv-author-r2-final-manifest.json`에 현재 여섯 원고와 증거를 고정했다. 독립 검수자에게 표적 종결을 요청한다. R·공유 도구·다른 작업자 파일·배포는 변경하지 않았으며 인간 원어민·법률가 승인이나 공개 표시 확인을 주장하지 않는다.
