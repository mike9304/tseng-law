# C1 fix 4 notes

Round 3 review: `reviews/C1/final-astra-r3.md` (VERDICT: FIX). No new legal fact was added. Citation targets are the same official pages the review already opened on 2026-10-14: Labor Standards Act Articles 2 and 28 (`pcode=N0030001`), already quoted in `research/C1-statutes.md`. The 60 percent floor is Article 2, item 4 of the Act, not item 4 of the Enforcement Rules. No judgment is cited.

Lint after this revision, each command printed OK:

- ko: 3500 characters (the ceiling)
- ja: 3901 characters
- en: 1550 words
- zh-hant: 2700 characters (the ceiling)

Variety checker: 0 FAIL on all four. Contrast count 0. ko warns that 98% of sentences end in 니다; ja warns that 98% end in です・ます. Both registers were kept.

Frontmatter keys, titles, seo titles, summaries, featured_image path (`../images/NNN-taiwan-unpaid-wages-insolvent-employer-payment-fund/featured-01.webp`), author `legal-ai-assistant`, and the one email were not changed. No bold, phone, street address, party name, or lawyer-review claim. Opening types stayed: KO the three statutory triggers, JA the reader's full-payment question, EN Article 28, ZH the payroll-ledger scene.

## C1 — Claim-level links

The 60 percent paragraph in all four now links Labor Standards Act Article 2 (`flno=2`) in that paragraph. The label names the Act, so it is not the Enforcement Rules article cited in the previous paragraph. The comparison itself is unchanged: if that average is under 60 percent of period wages divided by actual working days, the average is that 60 percent, and only for day, hour, or piece-rate pay.

Other groups, one linked sentence each:

- KO, the paragraph that says paragraph 1 does not create the severance debt, now opens on a linked Article 28. Retirement pay under the Act and severance under the Act or the Labor Pension Act stay the debts the rank covers.
- JA, the three eligible debts now open on linked Article 28, paragraph 1. The next paragraph, on the underlying retirement and severance debts, also links Article 28.
- JA, the 60 percent sentence names 労働基準法第2条第4号 with the Act URL.
- EN, the standalone priority paragraph now starts "Under Article 28". The paragraph on the underlying debts links Article 28, paragraph 1. The wage-definition paragraph links Article 2 on the sentence that lists wages, salary, bonuses, and allowances. The 60 percent sentence names Article 2 of the Labor Standards Act, item 4.
- ZH, the three eligible debts share the paragraph with a linked Article 28 on the sentence that the severance formula is not in that article. The next paragraph links Article 28 at the end of the sentence that paragraph 1 does not create the severance obligation (見第28條). The link is not the first word, because three paragraphs already could not all open on 第. The 60 percent paragraph links 勞動基準法第2條第4款.

Existing Enforcement Rules and Bureau of Labor Insurance links were kept. Sources lists were already complete for these URLs.

## V1 — Native prose

Followed in all four.

- KO closing: the advance is no longer the grammatical subject of "체불입니다". If that company has contributed or later paid the missed contributions, the wage advance covers labor-contract arrears in the six months before closure. The next sentence still states the combined retirement-pay and severance cap.
- JA priority opening: "先に並ぶのは" is now the question 使用者の財産から支払いを受ける順位はどうなるのでしょうか. The linked rank rule follows.
- JA closing: contribution (already paid, or arrears paid later) and the wage window are separate sentences. The window is still the unpaid contractual wages in the six months before liquidation.
- EN contractor sentence: a contractor label does not settle the issue; actual employment, pay, and subordination determine the assessment. The paragraph's Article 2 link and the coverage assumption stay. This does not say every contractor qualifies.
- EN mediation sentence: "For disputes over wage amounts before closure, see" the same column URL.
- ZH closing: 沒有回覆，只能說明請求後仍未獲清償. The door notice still does not replace the agency's closure proof.

## Companion edits required by the length ceiling or the variety check

KO is at 3500 and ZH at 2700, so the new link labels had to be paid for inside the same files.

- KO opening link label no longer repeats (勞動基準法). The Korean name and the Article 28 URL are unchanged. The Chinese act name remains in the sources list, and again inside 勞動基準法施行細則.
- KO "회사가 계속 영업 중이라면, 월급이 밀렸다는 사정만으로는 … 충족하지 않습니다" is now "회사가 계속 영업 중이면, 월급이 밀린 것만으로는 제28조의 요건이 되지 않습니다." Still operating, and late pay alone, still fail Article 28.
- KO "이 항이 적고 있는 것은 그 범위입니다" is now "이 항은 그 범위만 적습니다." The check date 2026-10-14 and the point that paragraph 4 states the 15 per 10,000 ceiling, not the collected rate, stay. The next sentence still says the collected figure is not in the paragraph.
- KO "그 계산 방식에만" is now "그 방식에만". 방식 is the day, hour, or piece-rate method named in that paragraph's first sentence.
- ZH "沒有另外創設" lost 另外. The sentence still says paragraph 1 does not create the severance obligation.
- ZH "那些擔保債權" lost 那些. The same sentence has already named the first-priority mortgage, pledge, and lien. The order is still not placed ahead of those secured claims.
- ZH 60 percent paragraph no longer repeats the pay-method limit in a second sentence. 才適用 keeps the limit on 按工作日數、時數或論件計薪. The 60 percent formula, including 所得金額 and actual working days as the comparison denominator, is unchanged.
- JA "全額とは限りません" was added after the most-preferential-right sentence. The opening already says full recovery is not promised. The sentence restores length variation (cv was 0.449 after the closing split, and is 0.455 now). It is not a new rule.
- JA court-papers sentence now starts with 裁判所の書類. The employer who cannot be found, or who will not sign, can still use those papers to prove the debt. The reorder avoids a third paragraph opening on 使用, which the new priority question would have created. The document list is unchanged.

## R1 — facts.md

Not edited. This assignment says not to edit any file other than the four drafts and this note. The sheet's "Deliberately left out" list is still stale, as round 3 said: filing venue, joint filing, court-document evidence, contribution eligibility, the Bureau look-back, and a branch or head-office assertion are not a map of the drafts. The four drafts are the claim inventory.

## Self-check

`python3 lint.py` on each language file with slug `taiwan-unpaid-wages-insolvent-employer-payment-fund`: OK, lengths above.

`python3 variety_metrics.py check` on each file: 0 FAIL. ko cv 0.508, short 0.136, contrast 0, q=0, 니다 WARN. ja cv 0.455, short 0.124, contrast 0, q=1, ですます WARN. en cv 0.519, short 0.218, contrast 0, q=1. zh-hant cv 0.570, short 0.151, contrast 0, q=0.

No stock opener. Openings were not retargeted, so they do not pick up another column's opening. Very short sentences remain above two in each language. No paragraph contains two long sentences, and no two long sentences stand in a row. No opener word occurs three times. Each language still has a citation-free scene paragraph. Contrast templates are 0. Last paragraphs still end on the labelled hypothetical: the unpaid demand, what the notice does not prove, contributions or a later makeup, the six-month contractual wage window, the combined cap, and the most preferential right. ko stays 합니다체 and ja stays です・ます. Hypothetical labels, numbers, and the links that were already correct were kept.

KO and ZH still have no question mark in the body. Both files are on the length ceiling. The scene and the FAQ still carry the reader's questions. A question mark was not added, because an equal cut would have removed a condition.
