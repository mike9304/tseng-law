# zh-hant 2차 — R1 수정 지시 (작성자: GPT-6.1 Sol, 리뷰어와 다른 모델)

너는 대만 번체 원어민 편집자다. 리뷰 파일의 지적을 **판단해서** 반영한다(무조건 수용 금지). 저장소 루트 = 현재 작업 폴더.
반드시 먼저 읽을 것: `docs/columns/EDITORIAL-VOICE.md`, `docs/zh-hant-polish/STYLE.md`, `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `docs/zh-hant-polish/LAWYER-REVIEW.md`(이미 보류된 항목은 손대지 않음), 그리고 아래 리뷰 파일.

## 규칙
1. 편집 허용 파일: **"대상" 목록의 파일**과, 그 칼럼 번호 전용 테스트(`src/lib/__tests__/columns-zh-*-<번호>*.test.ts` 등 그 칼럼만 다루는 테스트)뿐. 공용 파일(`src/content/column-embeddings*.json`, 여러 칼럼·언어를 함께 검사하는 테스트, LAWYER-REVIEW.md, 다른 묶음 파일)은 **절대 수정하지 말고**, 필요하면 fix 기록 끝 "공용 파일 필요" 절에 정확한 변경안을 적어라.
2. 보존: 법적 조건·예외·숫자·조문·판결 인용·출처 URL·href·AI 작성 표기(「法律AI助理」)·「獨立/自動/無過失/必要性」 등 법적 한정어·이메일·주소·프런트매터 키/slug/date. 칼럼에 전화번호 금지. 칼럼 003의 「Q16.」 이후·007·014·016의 테스트 고정 구간과 STYLE.md 「鎖定字串」은 변경 금지. 칼럼 007·010·012의 **제목(title)** 은 임베딩 테스트에 묶여 있으니 바꾸지 마라.
3. 테스트가 글자 그대로 검사하는 문장(고정 구간 아님)을 바꿀 때는 그 칼럼 전용 테스트의 기대 문자열을 **같은 강도로** 함께 고친다(단언 삭제·약화·정규식 느슨화 금지). semantic-contract 테스트는 한정어를 살린 채 통과시켜라.
4. 법률 실체가 걸린 지적은 반영하지 말고 `docs/zh-hant-polish/pass2/<묶음>-lawyer-additions.md`에 LAWYER-REVIEW 형식으로 적어라.
5. 고친 뒤 실행해 통과시켜라: `npx vitest run src/lib/__tests__/columns-zh` (그리고 이슈 묶음이면 `npx vitest run src/lib/__tests__/issue-board`). 실패하면 원인을 고쳐 다시. 출력 마지막 줄을 fix 기록에 붙여라.
6. git add/commit/push 금지.

## fix 기록 `docs/zh-hant-polish/pass2/<묶음>-r1-fix.md` (繁體中文)
첫 줄: 날짜·리뷰 파일·작성 모델. 이어서 지적마다 한 줄:
`- 파일:행 | 原文 → 修改後 | 採納/不採納：理由`
끝에 `採納 N 筆，不採納 M 筆`, 테스트 실행 결과 마지막 줄, "공용 파일 필요"(없으면 없음).
