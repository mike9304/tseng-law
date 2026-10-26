# ET918 M03 후속 교정

독립 R2에서 새로 지적한 M03 한 문장만 고쳤다. 기존 M01·M02·S01·S02 종결 내용과 R1/R2 기록은 보존했다. 현재 ET918 SHA는 `18706d6b788879e3f3d6dff97136cee18f65321163adadb58d6bd23215fc4a05`다.

문제 문장:

> Juulikuisel esimesel ülevaatusel ootasid puudused endiselt parandamist ning lift polnud veel paigaldatud.

실제 수정:

> Juulikuisel esimesel ülevaatusel ootasid puudused endiselt parandamist ning lifti paigaldamine polnud veel lõpetatud.

이유: 현행 ZH 정본의 `屋內電梯也未裝好`와 보관 공식 판결 선택 구간 L5041의 `屋內電梯未裝設完畢`를 직접 대조했다. 설치가 완료되지 않았다는 범위로 좁히고 설치가 전혀 시작되지 않았다는 추가 전제를 피한다. 7월 최초 점검, 수리할 결함, 뒤의 8월 조기 출입, 계약상 인도 판단은 그대로다.

[교정 증거](../checks/et-r3-edits.json)는 전후 전문·정확한 diff·역복원을 보존한다. 수정 문장에서 R2 문장으로 역치환하면 R2 전체 SHA `7e59a55f865bc4b3617c5d12371546be42aade935b4ab9fa6a775177ea6bcc49`가 복원된다. frontmatter·FAQ·외부 URL 순서는 동일하며 나머지 다섯 원고와 기존 30개 ET 기록도 불변이다. 날짜 선택 S03은 계속 유지한다.

Node24 PATH로 ET918만 실제 공유 검사했다. [실행 기록](../checks/et-variety-independent-r3.json)은 exit 0 / FAIL 0, CV .493, 분절 46개다. 실제 #11 문장만 12→13 정서법 단위로 바뀌었고 나머지 45개는 텍스트·단위·순서가 같다. 해당 문장과 앞뒤를 읽었으며 새 문장 경계 문제는 발견하지 않았다. 전 배치 R2 대비 259개 중 258개는 그대로다.

새 구조 검사 전수 실행은 하지 않았다. R2 구조 증거와 현재 frontmatter/FAQ/링크 바이트 불변, 정확한 본문 한 문장 차이를 구분해 연결한다. 이 기록은 저자 교정 확인이며 독립 M03 종결은 별도로 요청한다. 원어민·법률가 승인이나 공개 완료가 아니고, R·shared·타인 파일은 수정하지 않았다.
