# C4 fix4 notes — round 3 (Astra FIX)

Writer: Grok 4.7. Drafts only: `drafts/C4/{ko,ja,en,zh-hant}.md`. Frontmatter keys, slug, featured_image path, FAQs, source list, internal links, and the contact paragraph were not changed.

Official text opened before the legal edits: [民法第181條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=181), [民法第182條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=182). 第181條：返還所受利益，本於該利益再取得者亦返還；不能返還者償還價額。第182條第1項：不知無法律上之原因，且所受利益已不存在，才免負返還或償還價額之責任。第2項：受領時知情或事後知情，分別就受領時所得或知情時現存利益加計利息，有損害並賠償。未生效註記仍是第166條之1與第1223條，不是第179–182條。

Checks after the edit: `lint.py` OK on all four (ko 2749, ja 3153, en 1385 words, zh-hant 2256). `variety_metrics.py check` FAIL 0. ko/ja keep the register WARN (합니다체 / です・ます about 99%). That WARN was not “fixed” by mixing 해라체 or だ・である.

## L1 — Article 182(1) exemption test (KO, JA, EN)

Changed. The paragraph no longer uses “both / 二つ / Both” to point back at “did not know” and “spent.” Each version now names the two statutory conditions in that paragraph, then says spending, including the living-expense reply, does not by itself show that the benefit no longer exists.

- KO: 면책되려면 법률상 원인이 없음을 몰랐고, 받은 이익도 더 이상 존재하지 않아야 한다. 제182조 제1항은 그 두 조건이 함께 있을 때 반환과 가액 상환을 면한다.
- JA: 免責には、法律上の原因がないことを知らず、受けた利益がすでに存在しないことが必要。第1項はこの二つがそろったときだけ返還と価額償還を免れさせる。
- EN: released only if they did not know there was no legal cause and the benefit received no longer exists; paragraph 1 then releases both return and value repayment. Spending does not, by itself, establish that the benefit is gone.
- ZH already stated the two conditions. The disconnected “餘額還在 / 生活開銷花掉了” opening was rewritten so the same test sits in one paragraph: both conditions, then 錢拿去付生活開銷 does not establish that the benefit is gone. 符合第1項時，返還的責任免除，也可免除償還價額的責任.

Preserved: cumulative conditions; release covers return and value repayment; spending is not a substitute for 利益已不存在; paragraph 2’s two knowledge branches stay in the next paragraphs.

## C1 — Article 181 link on the return/value restatement

Changed in all four by consolidation, not by repeating the rule with a second link. The standalone paragraph that restated “return the benefit, or value if return is impossible” and linked only Article 182 was removed. That rule remains once, in the preceding Article 181 paragraph, which already links Article 181. The Article 182(1) exemption, including release of value repayment, moved into the knowledge section with the Article 182 link in the same paragraph.

Preserved: benefit and further gains; value only where return is impossible; no statement that value is due on top of a benefit already returned.

## V1 — repeated rule and disconnected short sentences

Changed in all four.

- Article 181 is stated once. The next section is Article 182’s exemption, not a second explanation of return versus value.
- “통장에 남아 있습니다 / 생활비로 나갔습니다” and the JA, EN, and ZH pairs were removed. The living-expense reply is now tied to the statutory question: it does not prove the benefit is gone. A separate short sentence says the balance is looked at on its own (잔액은 따로 봅니다 / 残高は別に見ます / Whether a balance remains is separate / 餘額要另外看).
- EN Article 180: the table still lists all four payments, including the item-4 recipient-only exception. The prose no longer repeats each category. It applies them: a wrong digit does not show a moral obligation; the freelancer was not paying an unmatured debt to that holder; a mistyped number is not item 3, which requires knowledge that no duty existed; what counts as an unlawful cause is left aside; Article 180 withholds the bar when the unlawful cause is only on the recipient’s side; another item may still bar the claim; Articles 181 and 182 still affect whether the whole sum comes back.
- The three recipient paragraphs now have different jobs: who received the benefit (company/individual and account label do not decide; current cash holder and account name are not automatic debtors); the relative-withdrawal reply (the reply does not identify the recipient or move the debt, and the name can diverge from the person who took the cash); after identification, Article 182’s knowledge and remaining-benefit questions (present possession does not answer them; no prediction of what a court would accept). The same “this does not decide the debtor” ending is not repeated in all three.

Short sentences kept elsewhere (rate and commencement date are not in the article; the scene is invented; digits do not match). New shorts are labels of facts already in the column, added so the length mix still passes after the disconnected fragments were removed. No new statute, rate, date, or outcome.

## V2 — native-prose lines

- KO “사람이 가려진 다음의 액은 제182조가 정합니다.” → “수령인을 확인한 뒤에는 제182조에 따라 반환 범위를 살펴봅니다.” The two branches stay: did not know and the benefit is already gone; or, if they knew at receipt or learned later, the benefit at receipt versus the benefit still there at later knowledge.
- KO “전액이라고 단정하지 않습니다. 잘못된 송금이 매번…” → one sentence: “잘못된 송금이라고 해서 언제나 전액을 돌려받는 것은 아닙니다.”
- JA “先の振込は、初めから原因がない側です。” → “この架空の例では、振込の当初から法律上の原因がありません。” The empty “原因がどの事由で消えたか” sentence in the same paragraph was removed with the KO/EN/ZH deletion below. The later-disappearance rule in the previous sentence stays.
- JA “送った側が会社か個人かは、文言が区別しません。” → “[第179条]は、振込人が会社か個人かによって区別していません。” Shop versus personal account, current cash holder, and account-name limits stay in that paragraph, with the existing Article 179 link.
- EN “What that person must return is Article 182” and “Who holds the cash today does not take the place of…” → Article 182 makes knowledge and the remaining benefit relevant to the duty. One branch is lack of knowledge together with a benefit that has disappeared. The other, if they knew at receipt or learned later, is the benefit obtained at receipt or the benefit still there at later knowledge. Cash in someone’s hands today does not resolve those questions.
- EN “No debt, and no contract… is the lack of legal cause.” → “In this invented example, no debt or contract supplied a legal basis for payment to that holder.” The earlier sentence still says there was no legal cause from the outset. That remains an example premise, not a test for every transfer. Benefit, loss, and lack of legal cause still have to concern the same recipient.
- ZH “帳號看錯，不會單憑這一點走進第三款。” → “僅憑帳號看錯，還不能認定符合第三款的要件。”
- ZH “償還價額的義務不會每次都留著。” → the required “符合第182條第1項的條件時，也可免除償還價額的責任,” with the two conditions in the immediately previous sentence, and 返還的責任免除 in the same sentence so value repayment is not the only duty released.

KO “문언이 가리지 않습니다” was the same stiffness as the flagged JA line, inside a paragraph V1 already required to be reworked. It is now “같은 조는 보낸 쪽이 회사인지 개인인지에 따라 나누지 않습니다.” EN “The wording does not sort senders” became “It does not divide senders into companies and individuals,” in that same rework. ZH “條文不區分” became “這一條不因此區分.” Legal content unchanged.

## Deletion test on the opening Article 179 paragraph

Removed, as the log allowed: KO “왜 사라졌는지는 그 원인이 나온 법률관계의 내용에 따릅니다.” EN “Why the cause disappeared depends on the relationship that produced it.” ZH “原因為什麼消失，回到那個法律關係裡看.” JA’s parallel “原因がどの事由で消えたかは、その法律関係の中身によります” was removed for the same reason. The rule that a cause which later disappears is still covered, the check date 2026-10-14, and the hypothetical labels stay. JA’s opening (spending is not by itself the exemption) and the following invented transfer stay. KO/EN keep the transfer scene. ZH keeps the statutory opening. Those opening types were not switched, so they do not copy C1–C3 or C5–C6.

## Recipient-section rhythm (manual item under V1)

Addressed with the three-paragraph rework above. Not treated as three separate failed self-check items. Citation-free paragraphs remain (the opening scene in KO/JA/EN; the records paragraph that lists what to keep before the account-number paragraph).

## I1 — facts.md

Not changed. The log calls this an internal-document follow-up and not a public-text blocker. This task says not to edit other files. The public drafts do not use “볼 것은 이익이 누구에게 남았는지이고” or “제181조·제182조가 범위를 줄이면.”

## Already passing — left as they were

- Image: reviewer marked OK. No redo.
- No judgment is cited. Article 183 stays out of the column.
- No bold, phone, address, party name, or lawyer-review claim. Author remains `legal-ai-assistant`. Email contact remains one short paragraph.
- Source list and inline pcode `B0000001` / flno 179–182 unchanged. Check date unchanged.
- FAQs already stated the two-condition test, item 3, and the absence of a bank-reversal duty. Not rewritten.
- ko/ja ending WARN: left. Mixing registers would violate the variety rule and the log.

## Self-check (SENTENCE-VARIETY-RULE §5)

1. Variety tool: FAIL 0 on all four. ko/ja WARN only, as above.
2. First sentence is not 가령 / 例えば…とします / Suppose / 假設. Opening types stay scene (ko, en), the spending question (ja), and the statutory sentence (zh).
3. More than two very short sentences in each file. A long sentence, where added, is the only long sentence in its paragraph (the further-gain fact; the Article 182(2) timing branches in ko and zh; the record list in en).
4. No paragraph-opening word occurs three times. ja 受領 and 明細, en Article / What / The, zh 第1 and 受領 each occur twice.
5. The three recipient paragraphs are no longer the same claim–citation–limitation ending. At least one paragraph has no statute link.
6. Contrast templates: tool count 0. The negative sentences answer the column’s own questions (mistake versus item 3, spending versus disappearance, relative’s withdrawal).
7. The last body paragraph still ends on this transfer’s confirmation, the living-expense reply, and the three open facts: who received the benefit, whether it remains, and when that person learned there was no legal cause.
8. ko 합니다체, ja です・ます. No bold, no invented first person, no checklist title.
9. Article numbers, the 2026-10-14 check date, hypothetical labels, the four Article 180 items and the item-4 exception, both Article 182 branches, interest without a rate or a transfer-date start, and the bank-contact limit are still in the drafts.
