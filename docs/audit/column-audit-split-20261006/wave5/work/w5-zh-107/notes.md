# notes — 107 zh-hant W5 TRIM

## 읽은 것
WO-W3-TRIM.md 전문, POLICY.md v1.1, EDITORIAL-VOICE.md(w5 repo), SENTENCE-VARIETY-RULE.md·LESSONS.md(studio-tools), reviews/wave3-fable.md(107 해당 절 없음; 공통 규칙 (1) R-Q1·(2) 규칙 B는 107에 해당 대상 없음 — 질문 문장 0, 본문 판결 링크 1), reports/classify-r1.md 107 절, factcheck/zh-107.md, fixspec/107.md, 원문 zh 107 전문, zh 243·241 전문.

## 사실 정정
fixspec/107: 사실 오류 0, 반영할 정정 없음. factcheck 「참고」 3건(L66 母=台灣人 출처가 協同意見書, L78 「須」 vs 서식 「宜」, L64 §14② 별개)은 지시 밖이라 손대지 않음.

## HUB-TRIM 근거: 241·243이 같은 깊이로 다루는지 (1회 확인)
| 107 §孩子的意見의 요소 | 243 | 241 |
|---|---|---|
| 憲判8 慣居地 미심리(이유 1) | 없음 | L46 「孩子在國外住了約1年、回台灣後又住了約2年9個月，抗告法院卻沒有審酌台灣是否已成為孩子新的慣居地，這是確定裁定被廢棄的理由之一」 — 같은 깊이 |
| 憲判8 海牙公約 불가(107 L90) | 없음 | L28 — 같은 깊이(107은 한 문장) |
| 暫時處分 요건·실제 准駁(L70 한정 문장의 배경) | §85·辦法 §4·三件 裁定 — 더 깊음 | 禁止出境 暫時處分 2件 |
| 憲判8 아이 陳述意見 미청취(이유 2): 5歲8個月·7歲8個月, 程序監理人·司法事務官 진술·國外心理醫師 보고서 대체 불가 | 없음 | 없음 → 유지 |
| 憲判8의 最佳利益 원칙 목록·極重要因素(L70) | 없음 | 없음 → 유지 |
따라서 이유 1(慣居地)과 暫時處分 배경만 링크로 보냈다. 이유 2는 H2 「要由審理法院直接聽取」의 직접 근거라 지우지 않았다.

## 검증 (실행한 것)
- `python3 trimcheck.py zh-hant <원문> work/w5-zh-107/draft.md`: URLs missing 0, article refs missing [], numbers missing [], front-matter 변경 = lastmod·read_time, H2 8개 동일, bold 0, leaked-instruction 없음. 길이 5,304 → 5,287.
- 원문 대 draft 줄 diff: 변경 줄 = L6(lastmod), L8(read_time), L68, L70 네 곳뿐. 나머지는 문자 일치.
- 링크 slug 2개는 007 zh에서 같은 형식(`/zh-hant/columns/child-taken-abroad-taiwan-parent-remedies`, `/zh-hant/columns/provisional-order-during-divorce-custody-support`)으로 이미 쓰이고, 241·243 파일은 origin/main(e1684516)에 있음(`git ls-tree`).

## read_time 계산
저장소 zh 고정 테스트 공식(columns-zh-traffic-012.test.ts의 `extractVisibleText`+`countVisibleHan`, `Math.ceil(한자수/400)`)을 파이썬으로 재현. draft 전체 content(H1·출처·고지 포함) 보이는 한자 4,795 ÷ 400 = 11.99 → 올림 12. 본문(출처 앞)만 4,642 ÷ 400 = 11.6 → 올림 12. 원문은 4,809(전체) → 13인데 파일 값은 수기 「約11分鐘閱讀」. 새 값 「約12分鐘閱讀」(「約」 접두는 이 시리즈 관례 유지).

## 문체 지표 (variety_metrics.py, zh-hant)
- 원문 FAIL 2: short_share 0.022, consec_same_start 3. draft FAIL 2: short_share 0.011, consec_same_start 3(len_cv 0.535 → 0.529).
- short_share가 내려간 것은 삭제한 「理由有兩部分。」(열거 예고, 짧은 문장 1개) 때문이다. 문장 쪼개기 금지라 보충하지 않았다.

## 애매했던 판단 (리드 결정)
- A1 fixspec는 L66–72(약 800자)를 약 450자로 줄이는 그림이었다. 실제로 줄인 것은 이유 1(慣居地)뿐이라 순감 -17자이다(링크 2개 삽입분이 삭제분을 상쇄). 이유 2(아이 陳述意見, 153字)와 L70의 두 가지 의미(227字)는 241·243에 없고 이 글의 질문(최선의 이익·아이의 소리)에 직접 답해 두었다. 더 줄인다면: L68을 「…沒有讓孩子陳述意見（兩次裁定時孩子約5歲8個月與7歲8個月）；程序監理人或事後轉述不能取代孩子向審理法院陳述」 한두 문장으로 접는 안(약 -90字)이 있으나 판결 이유(代替不能 3종)가 줄어든다 — 리드 결정.
- A2 fixspec (2) 도입 L26–30 조문 나열은 적용하지 않았다. 「목차 역할만 하면」이라는 조건과 「법적 요건 문장은 남긴다」가 같이 걸려 있는데, L28은 §1055-1①의 7개 고려사항 전체 목록(이 글의 핵심 규범)이고 L30은 調解前置·例外·專屬管轄·離婚訴訟 併案이라는 요건이다. 줄인다면 L30의 「屬於家事事件法第3條所定的戊類事件，」(약 20字)뿐인데 §3 링크가 본문에서 사라진다(출처 목록에는 남음).
- A3 L90 「孩子已經被帶出境或可能被帶出境的情形，應盡早與律師討論暫時處分等程序」 바로 뒤가 241 링크의 자연스러운 위치이기도 하다. fixspec가 §孩子的意見에 링크하라고 해서 그쪽(C1)에 두었고 L90에는 더하지 않았다.
- A4 w5 worktree에서 읽기 전용 작업 중 `git fetch origin` 1회(refs만 갱신, 파일 무변경)를 실행했다.
