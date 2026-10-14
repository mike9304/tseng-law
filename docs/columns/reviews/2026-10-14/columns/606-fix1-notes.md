# C1 fix1 notes — voice-sol

Statute checked before wording that could shift legal meaning: 勞動基準法 §28 on law.moj.gov.tw (2026-10-14), same text as research/C1-statutes.md. No judgment is cited. Frontmatter keys, slug, featured_image path unchanged. No bold, phone, address, or lawyer-review claim.

Lint `python3 lint.py drafts/C1/<lang>.md <lang> taiwan-unpaid-wages-insolvent-employer-payment-fund`: ko 2783, ja 3149, en 1397 words, zh-hant 2194, all OK.
Variety `variety_metrics.py check`: hard FAIL 0. ko/ja still WARN on 니다 / です・ます share. That WARN is the register the column is required to keep; Sol already said it is not a MONOTONY FAIL. Endings were not broken out of 합니다체 or です・ます.

Openings kept: ko statute nouns, ja liquidation-notice question, en “Six months.”, zh payroll ledger. Not moved onto C2/C3 openers.

## ko

- “영업은 이어지고 있습니다. … 이 조가 열리지 않습니다.” → “회사가 계속 영업 중이라면, 월급이 밀렸다는 사정만으로는 제28조의 요건을 충족하지 않습니다.” FAQ “열립니다” → “적용됩니다” (same calque). Trigger list and “연체만으로는 요건이 안 된다” kept.
- “정의로 돌아갑니다.” → “사용자 정의가 정합니다.” Sol’s “보면 알 수 있습니다” was the same point; the verb is the definition, not a new hedge.
- Double negative on 외국인/도급 split into two sentences. 종속성 was not folded into 제2조 제1호의 노동자 정의 alone: 고용·임금(제1호)과 종속성(제6호) stay separate. 국적 요건이 없다는 앞 문장도 유지.
- “순위에 오릅니다” (자견비·퇴직급여) → “변제 순위가 적용됩니다.” “자견비 자리에서만 등장합니다” → “자견비의 근거로만 언급됩니다.” 제2호 근거가 노동기준법이라는 문장 유지. 폐업만으로 자견비가 생긴다는 문장은 없음.
- “바닥” 두 곳 → “평균임금의 하한”. 끝 문장에 “만”을 두어, 하한이 일수·시간·건수 산정에만 있다는 원래 한정을 유지. 100분의 60 비교식 유지.
- “대지급에는 앞선 행위가 하나 있습니다.” → 노동자가 임금·퇴직급여·자견비를 먼저 청구하고도 변제받지 못하면 기금이 제2항 범위에서 대지급한다는 문장으로 바꿈. 사용자 상환과 제5항이 일수를 적지 않는다는 문장 유지.
- 마무리 재요약 → 타이중 가상 사례로 돌아가, 6개월 미만 임금의 비율 변제·대지급과 퇴직급여·자견비 합산 한도(평균임금 6개월분)로 끝냄. 전액 회수 문장은 넣지 않음.
- 같은 비유라 함께 고친 문장: “문을 닫기 전” → 폐업 전 임금액 조정의 기존 칼럼 링크. “절차 규정 쪽입니다” → 절차 규정이 정하는 신청 장소·심사 일수. “조문이 남습니다” → 계약과 지급 조문을 보고 가린다. “답이 없었다는 데까지가 앞부분” → 청구 후 미변제라는 점까지만 충족. 링크·가상 표시 유지.
- “변제 순서는 제1항에 있습니다” → “제1항이 정합니다.” Sol이 지적한 “~에 있습니다” 연속을 줄인 것이고, 조문 위치는 같다.

## ja

- “営業は続いています。…この条は開きません。” → 営業継続中は給料の遅れだけでは第28条の適用要件を満たさない、に変更。FAQ “ときに開きます” → “ときに適用されます.” 冒頭の質問（清算通知のあと基金が全額出すのか）は残した。Sol案の「一方」は入れていない。対比の型を足さず、条件文だけで足りる。
- “定義に戻ります。” → “使用者の定義から判断します.”
- “満額を取る図にはなりません。” → 同じ順位の担保債権より先に全額弁済されるわけではない。最優先権が残額に付く次の文は維持。
- “順位に乗ります” の資遣費・退休金 → “この弁済順位が適用されます.” 未払い（未依本法…給付）と、廃業だけでは資遣費が生じないことは維持。“箇所です” → “資遣費の根拠としてだけ.” 第2号の根拠が労働基準法である文は維持。文頭を「労工退休金条例」にして「第2」の連続開始を避けた。
- “床” → “平均賃金には下限”. “この下限は、その場合に限って適用されます.” 百分の六十の比較は維持。
- “定めの側です。” → “その手続を定める規則で確認する事項です.” 第28条本文に日数がないことは維持。
- “扉を閉める前に” → 廃業前に賃金額を争う場合の、労働局の調解と裁判所の労働調解の違い（既存記事リンク）.
- “支払条文が残しています。” → “給付を定める条文に照らして確認します.” Sol案の「必要があります」は使っていない。条文が読者に義務を課すわけではなく、債務の有無は契約と給付規定で決まる、という意味に合わせた。
- “立替の要件の前半” → 請求しても弁済を受けていないという点、までに限定。架空の表示は維持。
- “立替には、先立つ行為が一つあります。”（ko・en・zh が退けた予告文と同じ）→ 先に請求して未弁済のときに第2項の範囲で立て替える、に変更。償還と「定められた期限」だけという第5項は維持。“請求が先です.” は残した。
- 結び → 高雄の架空の例、六か月未満の割合弁済と基金の立替、退休金・資遣費の同じ順位、二つの合計は平均賃金六か月分が上限。Solの「按分」は本文の「割合」（按其債權比例）に揃えた。意味は同じ。
- “弁済の順は第1項にあります” → “第1項が定めています.” Solが繰り返しとして挙げた「第…項にあります」を一箇所崩した。料率は「第4項にあります」のまま。

## en

- Summary. Sol’s full sentence does not fit the 150–160 character limit. Used (159): “After closure, liquidation, or adjudicated bankruptcy, wages under six months share a first mortgage, pledge, or lien rank. Any advance needs an unpaid demand.” Keeps the three triggers, the wage period, mortgage/pledge/lien rank, and the unpaid-demand condition. “Under the labor contract” and the two fund caps stay in the body and the table, not in this summary line.
- “wage slice / puts on a rank” → Article 28 gives wages owed for less than six months a specified repayment rank. Opening “Six months.” kept.
- “does not open this article” → “does not bring Article 28 into play.” FAQ “opens the priority” → the priority and the advance apply on closure, liquidation, or adjudicated bankruptcy. Late pay while operating is still not the trigger.
- “is the same definition” → “The same definition determines whether the Taiwan branch or the foreign head office was the employer.”
- “agrees an employment relationship and has subordination” → “establishes an employment relationship characterized by subordination.” (約定勞雇關係而具有從屬性.)
- “Who owes the money comes back to” (same calque as ko/ja) → “Who owes the wages is determined by the definitions in Article 2.”
- “Repayment rank sits in paragraph 1” → “Paragraph 1 sets out the order of repayment.”
- “That floor belongs to that case” → “That 60 percent floor applies only when wages are calculated by days, hours, or pieces.” The 60 percent comparison sentence is unchanged.
- “One act comes before the advance” → demand for wages, retirement pay, and severance, then still unpaid, then the fund advances within paragraph 2. Employer repayment and paragraph 5’s “prescribed period” with no day count kept. The three items are the statute’s list, not a new rule that all three must be owed.
- “counter / sit with” → those procedural rules govern where applications are filed and how long decisions take. Article 28 still states no number of days.
- “front half” → the unanswered demand satisfies only the initial part of the advance condition. Existence of the debts stays with the contract and the payment provisions.
- “Before the doors close” → a dispute over the wage amount, before the business closes, is the other column’s mediation path. Link unchanged.
- “does not take its full figure” → not paid in full ahead of a secured claim at the same rank. Pro rata and the most preferential right on the unpaid portion stay in the surrounding sentences.
- “enters the rank / stops at” in the severance paragraph and the fund-limit sentence → “the rank covers” and “capped at.” “Paragraph 1 does not create the severance debt” kept: ordinary English, and the next sentences still require an unpaid duty under the Labor Standards Act or the Labor Pension Act. Not the same problem as zh 創造債權.
- Closing → invented Taoyuan example, unanswered demand, advance for wages owed for less than six months, same proportional rank, retirement pay and severance, fund cap of six months of average wage for those two together. “Could” is there because the example does not decide that the debts exist. No promise of payment in full.

## zh-hant

- “帳冊主人…” → “薪資冊記載的是這家台中公司一名外籍員工的薪資；他曾向負責人追討欠款，卻未獲回覆.” 連續五個月、資遣費空白、歇業公告、虛構情境 kept.
- “退休金也沒有付出.” → “退休金也尚未給付.” Later “先付出的程序” → “基金依第2項墊償的程序” (same 付出).
- “營業還在。只是薪水晚發，這條不開.” → 公司仍在營業時，單憑薪水遲發不符合第28條的適用要件. FAQ “才開啟” → “才適用.”
- “不會先把自己的數字拿滿.” → 不會先於同順位擔保債權獲得全額清償. 比例後的最優先權、再多一筆則比例再小, kept.
- “另行創造資遣費債權” → “沒有另行規定資遣費的給付義務.” Adopted. §28 I item 3 is 未依本法或勞工退休金條例給付之資遣費; it does not itself set the duty to pay. The next sentences still say the rank applies only when those statutes require payment and the employer has not paid, and that closure alone does not produce severance. 勞工退休金條例 only in the severance item; item 2 remains the Labor Standards Act.
- “墊償前面有一個行為.” → 基金墊償前，須先請求工資、退休金及資遣費而仍未獲清償，才依第2項墊償. 雇主於規定期限內償還, and paragraph 5 only says 規定期限, kept. “請求在先” kept.
- “2026年10月14日，這項寫的是那個範圍.” Not copied as “第4項只規定…”. Paragraph 4 also has the authority draft the rate and the Executive Yuan approve it; that sentence stays immediately above. The date sentence now says the figure written there is that the rate may not exceed 萬分之十五, which is the ceiling in 於萬分之十五範圍內. The next sentence still says the rate actually collected is not in the paragraph.
- “前半” → 只走到已經請求、卻還沒有清償這一步. 債權在不在仍看契約和給付規定.
- Closing does not start with 回到 (the return-to-ledger paragraph already does). “台中那名虛構的外籍員工…” states proportional repayment and the fund’s wage advance for the portion under six months, the same rank for retirement pay and severance, and the fund cap of six months’ average wage on those two together.
- “底線” left. Sol did not flag it. Unlike ja 床 / ko 바닥, 底線 is readable here, and the 60 percent sentence defines it. 誰的債，回到第2條 left; it was not flagged and the employer definition follows at once.

## Not treated as errors

- ko/ja ending WARN. Register, not a FAIL.
- en “create the severance debt.” See en note above.
- ja/en/zh sentences that a foreign nationality or a 承攬/請負/contractor label does not by itself make someone a worker. Only ko was flagged for the doubled rhythm. The legal point is the same in all four and was kept.
- No new rate, deadline, filing office, or eligibility rule. Those stay delegated, as in the drafts.
