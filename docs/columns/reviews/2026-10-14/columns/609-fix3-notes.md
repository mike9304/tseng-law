# C4 fix3 notes — final review round 2

Official text opened before the edits (2026-10-14, law.moj.gov.tw single-article pages): Civil Code Articles 179, 180, 181, and 182. The text matches `research/C4-statutes.md`. Article 180 begins 給付，有左列情形之一者，不得請求返還. Article 182 adds interest and does not state a rate or a commencement date. The “not yet effective” notices are Articles 166-1 and 1223, not 179–182, and were not added. No judgment is cited, so no judgment file was opened. Frontmatter keys, slug, titles, seoTitles, and `featured_image` are unchanged. The English summary value was replaced (L1). Article 183 was not added.

Lint `OK` and `variety_metrics.py check` FAIL 0 on all four files. ko/ja still WARN on 합니다 / です・ます endings. That is the required register. The warnings were not a reason to switch registers.

## L1 — EN summary, recovery not the payments

Accepted. The summary subject was the payments (“Four payments are barred”), which Article 180 does not prohibit. Replaced with the reviewer’s sentence, confirmed at 158 characters: “Taiwan law may require return of a mistaken transfer. Four payment categories limit recovery; knowledge and the remaining benefit affect the recipient's duty.” Item 4’s recipient-only exception stays in the body and was already absent as a detailed sentence from the FAQ; it was not dropped from the body. No amount, rate, or deadline was added. The ko/ja/zh summaries already say return cannot be demanded and were left.

## C1 — links on the remaining legal paragraphs

Accepted. The opening link of a section was not treated as covering a later paragraph.

- Article 180 items 1 and 2 now sit in the same paragraph as the Article 180 link (all four). Items 3 and 4, including the recipient-only exception, have an Article 180 link in that paragraph.
- The two short scenes (money still there / spent on living expenses) are one paragraph with an Article 182 link on the two-condition release from both return and repayment of value. Not knowing alone, and spending alone, stay in that paragraph.
- Existing links were kept: element mapping, the separate contract, the “another item may bar the claim” sentence, Articles 181 and 182, the bank sentence (179–182), the sources list, and the 2026-10-14 check date. Scene and record paragraphs that make no legal claim stay without a citation. Internal links are unchanged: small-claims in all four, and the certified-letter column in JA only.

## V1 — one interest limitation, then the records

Accepted. Each language now states once that Article 182 adds interest and does not set a rate or run that interest from the transfer date or the time of credit. The measure remains the moment of knowledge and the benefit the article points to then. A following paragraph keeps a different point: the credit time shows when the benefit moved; material on knowledge sits beside paragraph 2; the living-expenses reply does not fix that hour; the reply’s arrival date is kept as material and is not, under Article 182, the start of knowledge. That last limit is stated once. It was not turned into a claim that Taiwan law has no interest rules.

The sentence that the statute does not catalogue why a legal cause ceases was removed in all four. The reviewer treated it as adding no condition. What stays is the rule: if a cause later disappears, return is still required, and why it disappeared depends on the relationship that created it. The example is still classified as having no legal cause from the outset. The check date stays.

## V2 — language-specific

All accepted.

- KO 40: “어느 설명이 재판에서 받아들여질지는 여기서 판단하지 않습니다.”
- KO close: “돈이 들어간 계좌가 적힌 확인서와 생활비로 썼다는 답을 함께 보관합니다.” The two records and the three unsettled questions stay.
- KO FAQ 2: “다른 호에 해당하면 반환을 청구하지 못합니다.” Aligned to Article 180’s 不得請求返還 and to the JA fix. The body already used that verb. Not a new bar.
- JA FAQ 2: “ほかの号に該当する場合も、返還を請求できません.” “請求は止まります” was dropped so the sentence is not read as a procedural halt.
- JA 34: “一つに束ねて” was removed. The preceding sentence still says Article 179 does not say the supplier-contract debt disappears with this transfer. The same redundant restatement was removed in KO, EN, and ZH. The contract point remains once in each.
- JA close: “振込先が記載された明細と、生活費に使ったという返信を一緒に保管します.”
- JA “裁判で残る” was rewritten as “裁判所がどちらの説明を採用するかは、ここでは決めません,” the same unnatural collocation as the KO sentence. No outcome is predicted.
- EN Article 179: the article is the subject and requires return where there is a benefit, a corresponding loss, and no legal cause, including a cause that later disappeared. “The statute does not list those reasons” was dropped with V1.
- EN “Who holds the cash now does not replace those times” was rewritten as two inquiries: who received the benefit, and what Article 182 counts (lack of knowledge plus a benefit that is gone, or the benefit at receipt versus the benefit still there at later knowledge). Who holds the cash today does not take the place of those times. The relative who withdrew the cash is not made the debtor by the reply.
- EN records: keeping the amount, credit time, destination account, name, and the words and date of any reply lets the reader examine who benefited and when they learned of the error. The papers do not settle either question.
- ZH 70: the credit time is the time the money entered the account. It is kept separate from the time the recipient knew there was no legal cause. “利益何時過去” is gone, so the sentence does not suggest the benefit ceased.
- ZH 82: “這筆返還請求是否適用該程序，要看請求金額和適用條文.” No threshold and no guaranteed route were added.

## MONOTONY — recipient paragraphs

Accepted. One paragraph states the Article 179 test, including that the wording does not sort senders by company or individual, that an account label does not by itself pick the debtor, that the article does not name whoever now holds the cash, and that it does not make the named holder liable in every case. The next paragraph applies that test to the reply that a relative withdrew the cash. The third asks Article 182’s questions and does not predict which account a court would accept. The three paragraphs are not the same claim–statute–caveat beat.

Openings were not switched. KO and EN stay a scene. JA stays the spending limit, with the Article 182 link. ZH stays the statutory sentence. No 가령 / 例えば…とします / Suppose / 假設 opener. Labels remain: 가상의 사례입니다, 架空の例です, invented, 虛構情境.

## I1 — facts.md

Not edited. The task says not to edit other files. The review calls this an internal-document follow-up and not a publication blocker. The stale lines (“이익이 누구에게 남았는지”, Article 181 as a reduction rule) were not copied back into the columns. Article 181 remains the benefit, further gain, and value when return is impossible. Article 182 remains the knowledge and remaining-benefit rules.

## Variety self-check

`variety_metrics.py check` FAIL 0 on ko, ja, en, and zh-hant. At least two very short sentences in each. No opener word starts three paragraphs (JA 明細 twice, EN Article and The twice, ZH 第1 twice). Contrast templates are 0. No 다만 / However / 但 sentence-opener stack. At least one citation-free paragraph (the scene, and the record paragraphs that do not state a rule). The last body paragraph is this transfer’s confirmation and reply and the three questions those papers do not settle. Contact is the paragraph before that, one sentence, email only. ko is 합니다체. ja is です・ます. No bold, phone, address, party name, or lawyer-review claim.

## Not changed

Image: the review said OK. No image file was edited. Bank contact stays a practical step. These articles still do not require reversal or disclosure. Deception, an account freeze, a criminal proceeding, a foreign-exchange declaration, and the law a court outside Taiwan would apply stay outside the column.
