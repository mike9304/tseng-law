# r8b Air MINOR 2건 대응 수정안 (Studio Opus, 2026-10-21 15:08 KST)

대상 비평: review-air/air-opus-on-opus-P1-r8.md, -P3-r8.md 10:50 추가 절(15:04 동기화로 도착). Studio Grok 15:04 확인: review-studio/grok-on-air-r8b-1504.md.
정본(opus/P{1,3}/r8b/, ja·en/r8b/)은 고치지 않았다. Astra가 채택하면 아래 문장을 그대로 반영하고 threads-ready를 다시 만든다. 카드·alt·첨부에는 해당 문장이 없어 재렌더가 필요 없다(grep 확인).

## 1. P3 KO 「맞섰어요」 — 근거 확인

Air가 인용한 ~/threads-cardnews-air-1018/VOICE-DIRECTIVE-1019.md는 이 맥에 없다. 같은 진단은 이 맥에서도 확인된다.
- prior-opus-1019/input/FEEDBACK-SUMMARY.md:8 — 10/19 05:30 r15 사용자 반려("아직 AI 말투 같다")의 원인 진단에 '맞섰어요'가 기사체 연결로 들어 있다.
- prior-opus-1019/out/research/VOICE-STUDY-1019.md:28 — "'맞섰어요', '받아들여지지 않았죠' — 기사체 동사 → 판결도 '~라고 했어요' 정도".

| 위치 | 현행 | 수정안 | 의미 보존 |
|---|---|---|---|
| opus/P3/r8b/body.md 5행 | …27,808이면 된다고 맞섰어요. | …27,808이면 된다고 했어요. | 버스 쪽 주장 귀속 유지. 이유 3 |

본문 499→498자, variety FAIL 0(cv 0.473, short 0.143). JA 「主張しました」, EN "the defense said"는 해당 없음.

## 2. P1 「서명도 안 했으니 돌려 달라고 했대요」 — KO·JA·EN 공통

판결 이유 1이 그날의 행동으로 적은 것은 LINE 철회·반환 요구다. 서면 계약 없음은 소송 주장이다(FACTS P1 18·20행). 같은 문제가 JA 「まだサインもしていないからと」, EN "and nothing was signed"에도 있다. 같은 문단 첫 문장이 「그날 마음이 바뀌었어요」라 Air 수정안의 「그날」은 반복이 되어 뺐다.

| 언어 | 현행 | 수정안 | 길이 / variety |
|---|---|---|---|
| KO | 보내고 나서야 짐이 다 안 들어가겠다 싶었고, 서명도 안 했으니 돌려 달라고 했대요. | 보내고 나서야 짐이 다 안 들어가겠다 싶어서 LINE으로 취소하고 돌려 달라고 했대요. | 436→437, FAIL 0 (cv 0.582) |
| JA | 振り込んでから荷物が入りきらないと思ったそうで、まだサインもしていないからと返金を求めました。 | 振り込んでから荷物が入りきらないと思ったそうで、LINEで取り消して返金を求めました。 | 395→391, FAIL 0 (cv 0.522, desu-masu WARN은 현행과 같음) |
| EN | That day they backed out, saying their stuff wouldn't fit and nothing was signed. | That day they backed out over LINE, saying their stuff wouldn't fit. | 498→485, FAIL 0 (cv 0.476) |

EN은 다음 문장 "The firm refused a refund."가 반환 요구를 받쳐 준다. 서명 전 계약 성립이라는 쟁점은 3행 이후(1심 판단)와 카드에 그대로 있다.

## 범위

채택 여부는 Astra 판단. 게시·전송·소리 없음. 검사 사본은 세션 scratchpad에만 두었다.
