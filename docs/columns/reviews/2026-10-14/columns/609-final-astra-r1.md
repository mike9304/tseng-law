# C4 final review — round 1

Verdict: FIX. The four versions are not ready to publish as supplied. Required legal corrections concern the test for identifying the recipient, the English closing's unsupported evidentiary conclusion, and the description of Article 181. Claim-level citations also need repair. Image: OK.

Review date: 2026-10-14. Reviewer role: independent final reviewer. No column text was edited; all changes below are required, not applied.

## Scope and evidence

Read in full: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C4.md`, all four `drafts/C4/{ko,ja,en,zh-hant}.md` files, `drafts/C4/facts.md`, and `research/C4-statutes.md`. Also read the shared sentence-variety rule, including sections 5–6, and the recurring reviewer lessons. Read the legacy operating skill and the 0930 voice-rule pointer. The old `~/agent-library/knowledge/editorial-voice.md` location is absent; the complete supplied `brief-EDITORIAL-VOICE.md` was applied. Compared its differences with the older shared `rules/EDITORIAL-VOICE.md`; applied the batch's newer author/disclosure instructions.

The fact sheet was treated as a list of claims, not evidence. Independently opened the official single-article pages using both the browser research tool and curl:

- [Civil Code Article 179](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=179)
- [Civil Code Article 180](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=180)
- [Civil Code Article 181](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=181)
- [Civil Code Article 182](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=182)
- [Civil Code full text/header](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001), opened with curl to verify the amendment header.

The saved research text of Articles 179–182 matches the official pages. The full-law header says 民國115年08月17日 (2026-08-17). The not-yet-effective notices concern Articles 166-1 and 1223, not the four provisions discussed here. No column mistakes that whole-law amendment date for the effective date of Articles 179–182. No judgment, foreign-law authority, numerical example, rate, limitation period, or procedural deadline is cited in these drafts. Accordingly, no judgment text required opening, and there were no other cited official pages to retrieve.

Official HTML and extracted text are saved in `reviews/C4/evidence-astra-r1/civil-*.{html,txt}`. Actual lint/variety commands, exit codes, outputs and reviewed file hashes are in `evidence-astra-r1/checks.json`.

Viewed `images/C4.webp` with the image viewing tool. Checked internal destinations against `topics/LINKS.md` and the repository files used by lint. Compared available C1–C4 openings, and the openings/subheads/endings of published columns 522–524 in each language. Comparison evidence is in `evidence-astra-r1/recent-column-comparison.txt`. C5/C6 drafts were not present when the batch openings were checked; this review does not certify their eventual opening distribution.

## 1. Law and facts — required changes

### L1 — MAJOR, all four languages: present possession is substituted for identifying the enriched recipient

Original:

- KO, line 40: “그때 볼 것은 이익이 누구에게 남았는지입니다.”
- JA, line 42: “見るのは、利益が誰に残ったかです。”
- EN, line 42: “The question is who was left with the benefit.”
- ZH, line 40: “要看利益最後在誰身上。”

→ Problem & reason: These sentences answer the question of whom to name as debtor after a family member withdraws money. They make the benefit's eventual location sound like the test for the identity of the debtor. Article 179 concerns the person who received the benefit without legal cause, causing another's loss. Whether a recipient's benefit subsequently remains is a separate Article 182 question, including the recipient's knowledge. Article 182(2) expressly uses the benefit at receipt or at later knowledge; current possession does not replace those reference points. The following warning that a relative's withdrawal does not automatically change the debtor is correct, but does not cure the immediately preceding test. The cash-withdrawer and the unjustly enriched recipient are not interchangeable concepts.

→ Fix required: Separate (a) who received the legally relevant benefit from this transfer from (b) whether that recipient can invoke Article 182 and what amount is measured at the relevant time. Describe the family-withdrawal reply as insufficient by itself to establish who received the benefit. Do not direct the reader to pursue whoever ultimately holds the money. Keep the article with the first recipient; do not add an unsupported third-party recovery rule or a promise that the named account holder must always be liable.

→ Facts preserved: Article 179's benefit/loss/no-legal-cause requirements, the hypothetical family withdrawal, the need to establish the recipient, Article 182's conditions and knowledge dates, and the absence of any predicted litigation outcome. No change applied because this is substantive legal meaning.

### L2 — MAJOR, EN: the closing purports to establish facts the example cannot establish

Original, line 97: “On this transfer, the confirmation and the reply about living expenses show who actually received the benefit, what remains of it, and when that person learned there was no legal cause.”

→ Problem & reason: The invented facts provide a transfer record and a statement that the money went to living expenses. They do not establish what benefit remains or when the recipient learned there was no legal cause. Line 83 correctly says the reply does not itself establish that time. The closing contradicts that qualification and turns investigative material into a conclusive answer to Article 182. The other languages end by identifying matters to examine, not by asserting that these two documents establish all three answers. Neither official Article 179 nor Article 182 supplies such an evidentiary shortcut.

→ Fix required: End with the records to preserve and the questions still to determine. For example, explain that the confirmation records the destination and the reply should be retained, while the remaining benefit and time of knowledge still require examination. Do not add new facts to make the existing conclusion true.

→ Facts preserved: The hypothetical transfer and reply, uncertainty about recipient/remaining benefit/knowledge, the two Article 182 branches, and the rule that spending alone does not establish exemption. Required, not applied.

### L3 — MAJOR legal attribution, all four languages: Article 181 is presented as a reduction rule

Original:

- KO, line 50: “제181조와 제182조가 범위를 줄이면 받는 액이 달라집니다.”
- JA, line 52: “第181条と第182条が範囲を縮めると、戻る額は変わります。”
- EN, line 59: “Articles 181 and 182 can reduce the amount returned.”
- ZH, line 50: “第181條和第182條把範圍縮小的時候，拿回來的數額也會變。”

→ Problem & reason: The official Article 181 requires return of the received benefit and further acquisitions from it, or repayment of value when return is impossible. It does not state the reduction/exemption condition being suggested here. Article 182 supplies the stated exemption and knowledge-based measures. Treating both articles as rules that shrink the return can mislead the reader about Article 181's additional-benefit and value duties. The later, largely accurate Article 181 explanation does not remove this earlier attribution.

→ Fix required: Attribute each function accurately: Article 181 defines the benefit/additional acquisitions/value to return; Article 182 determines how lack of knowledge, disappearance of benefit, or later knowledge affects responsibility. If retaining a specific claim that Article 181 reduces a mistaken transfer's recoverable amount, supply an official authority supporting that particular proposition and its conditions. Do not replace this with a guarantee of full recovery.

→ Facts preserved: No automatic full recovery, Article 180 exclusions, Article 181's additional acquisitions and value substitution, and both Article 182 branches. Required, not applied.

### Legal core otherwise checked

In every language, the main explanations correctly retain Article 179's later-disappearing-cause branch; all four Article 180 categories, including knowledge at payment in item 3 and the recipient-only unlawful-cause exception in item 4; Article 181's further gains and value substitution; Article 182(1)'s cumulative conditions; and the two knowledge branches, interest and loss in Article 182(2). None invents an interest rate or states that interest always begins on the transfer date. Bank contact is presented as a practical step, with no statutory reversal or disclosure promise. These correct passages must survive revision. The FAQ answers substantially repeat those passages, subject to the Japanese question below.

## 2. Citations — required changes

### C1 — MAJOR batch-rule failure, all four languages: legal claims are separated from their inline source

Original: The Article 182(2) paragraph begins “제2항은…” (KO 68), “第2項は…” (JA 70), “Paragraph 2 covers…” (EN 77), and “第2項是…” (ZH 68), with no link in the paragraph. Earlier unlinked paragraphs similarly re-state Article 179's later-disappearing cause (KO 32 / JA 34 / EN 34 / ZH 32), and the later bank paragraphs state what Articles 179–182 do not require without local links (KO 80 / JA 84 / EN 91 / ZH 82). JA's first paragraph invokes Article 182 without a link.

→ Problem & reason: Each draft contains four body statute links, mainly at the first introduction of an article. Several later, distinct legal assertions lack the required adjacent citation. In particular, the only nearby link in the Article 182 section is attached to the paragraph-1 discussion several paragraphs before paragraph 2. A complete source list is necessary but does not satisfy the batch's claim-level inline-link rule. Links integrated into an article-as-subject sentence are not themselves the objection; the objection is the unsupported distance to subsequent claims and the missing links after those claims.

→ Fix required: Audit legal-claim paragraphs and place the correct single-article link directly with the relevant assertion, including Article 182(2), repeated Article 179 applications, Article 180 exclusions and the qualified bank statement. Adjacent tightly related claims may be grouped coherently, without turning every sentence into the same parenthetical template. Retain the complete final sources list and its 2026-10-14 check date. Citation edits are outside this reviewer's permitted minor-wording changes and were not applied.

→ Facts preserved: All existing legal propositions, article numbers, qualifications, official URL targets and check dates; citation placement must not weaken or omit a condition.

Existing targets themselves are correct: all four external URLs lead to the intended Civil Code article. No judgment URLs are present. Source lists contain all four used external authorities. Internal links exist in the matching languages: small-claims column 251 in all four, plus certified-letter column 264 in JA. No internal link points to this batch.

## 3. Format and hard-rule audit

All four files pass `lint.py`, with the required slug `taiwan-mistaken-bank-transfer-unjust-enrichment`:

| Language | Body length | Lint exit | Format findings |
|---|---:|---:|---|
| KO | 2,580 non-space/URL characters | 0 / OK | Required keys, dates, language and title/H1 match |
| JA | 3,087 non-space/URL characters | 0 / OK | Required keys, dates, language and title/H1 match |
| EN | 1,440 words | 0 / OK | Title 56 characters; suffix makes seoTitle necessary; seoTitle 36; summary 157 |
| ZH | 2,121 non-space/URL characters | 0 / OK | Required keys, dates, language and title/H1 match |

All use `topic: litigation`, `author: legal-ai-assistant`, correct single-language audience, three FAQs and the literal NNN image path. Dates are 2026-10-14; reading-time labels are plausible for the current lengths. No bold, private-party names, phone/hotline numbers, street addresses, attorney byline, lawyer-review claim, native-review claim, or fabricated personal professional experience was found. Each language has one firm/email contact paragraph. Examples are expressly hypothetical. Foreign court choice-of-law questions are excluded rather than answered with invented foreign law. The English final sentence about US state rules is unnecessary scope commentary and should be shortened during the voice revision, not expanded into unsourced US advice.

## 4. Voice and sentence variety

### V1 — required editorial revision, all four languages: repeated explanations and writer-facing commentary

Original examples: KO 28 and 32 both explain that a legal cause may later disappear, then repeatedly say the example belongs to the no-cause-from-the-start branch. The same structure appears at JA 30/34, EN 30/34 and ZH 26/32. JA 40 says “返還を求める相手は、利益を受けた人です。第179条が返還義務を課すのは、利益を受けた人です。” KO 38, EN 40 and ZH 38 duplicate the same point. KO 78 says “이름이나 계좌 전체를 이 글의 사례에 적을 필요는 없었습니다”; JA 80, EN 87 and ZH 78 carry the same author-facing aside.

→ Problem & reason: These repetitions add no condition or useful application. Statements about why the writer omitted identifying details belong in the production record, while the published article should tell readers what records to retain. Across the four languages the repeated sequence, including “the article calls this person…” and repeated comments on what was not checked or what the article does not say, reads as translated drafting notes. This fails the batch's native-prose/no-repetitive-templating gate even though numerical variety metrics pass.

→ Fix required: State each rule once, then apply it or explain the next distinct issue. Remove duplicated propositions and production commentary, retain all unique qualifications and the check date, and connect the record-preservation discussion to the particular mistaken payment. Keep the required medium length through useful, verified explanation; do not restore padding or invent procedures to meet the minimum.

→ Facts preserved: Article 179's two branches, who is obliged, all hypothetical labels, privacy, scope limits, and evidence preservation. This is a multi-paragraph revision for the writer, not an applied minor edit.

### V2 — required language-specific corrections, not applied

- KO 68 “제2항은 … 수령인입니다.” → The paragraph is grammatically equated with a person. → Required: “제2항은 … 수령인에게 적용됩니다.” → Facts preserved: the same two knowledge alternatives and responsible person; no legal condition changes.
- JA 70 “第2項は、…受領人です。” → Same subject/predicate mismatch. → Required: “第2項が対象とするのは、…受領人です。” → Facts preserved: both branches and their timing.
- ZH 68 “第2項是…的受領人。” → Same mismatch, unnatural Chinese. → Required: “第2項適用於…的受領人。” → Facts preserved: the same recipients and conditions.
- JA FAQ 2, line 16 “不当利得として返せますか？” → This asks whether the payer can return the money, whereas the answer addresses claiming it back from the recipient. The actor/direction of the question is wrong. → Required: “不当利得として返還を請求できますか？” → Facts preserved: the knowing payer, Article 180 item 3, and the answer's bar to recovery. Reported rather than silently changing a legally significant question.
- JA 82 “桁が違います。” → Normally suggests a different order of magnitude or number of digits, while the example only establishes nonmatching account numbers. → Required: say that the account numbers do not match; do not invent a particular digit or difference in account-number length. → Facts preserved: only the existing mismatch.
- EN 30 “There was no cause, owed to that holder, from the start.” → A legal cause is not something “owed” to a holder. → Required: “There was no legal cause for the payment to that holder from the outset.” → Facts preserved: the no-cause-from-receipt hypothetical.
- ZH 78 “後來才能對受利益的人，以及他知不知道沒有法律上原因。” → The verb construction is incomplete; 對 does not complete the intended examination of identity and knowledge. → Required: “日後才能核對誰受有利益，以及他是否知道沒有法律上原因。” → Facts preserved: the records are for checking, not conclusively proving, recipient and knowledge.
- JA 58 “価額までいつも残る仕組みではありません。” / ZH 56 “價額不會每次都留下。” → These obscure that the next section concerns exemption from an obligation to repay value, not whether an abstract “value” remains. → Required: name the value-repayment obligation and connect its possible exemption to Article 182(1)'s two conditions. → Facts preserved: both conditions and the distinction between benefit and value; do not imply that inability to return alone exempts payment.
- EN 95 “Send the confirmation and the reply…” / ZH 86 “明細和對方回覆寄到…，用…” → Direct instructions to send records are stronger and less natural than the brief's optional, soft contact sentence. → Required: make the contact optional in one concise sentence, retaining the firm name and email. → Facts preserved: contact details and the records' relevance; no claim about service or outcome is added.

Titles are topic-specific and not clickbait. No mainland Chinese or simplified characters were found. KO/JA generally maintain their required polite registers; nominal conditions quoted within the Article 182 explanation were not misclassified as a switch to plain-form narrative. Naturalness is still not publishable without the corrections above.

### Measured variety and manual sections 5–6 check

| Language | Sentences | CV | Very short share | Similar-length run share | Checker result |
|---|---:|---:|---:|---:|---|
| KO | 83 | 0.452 | 0.096 | 0.099 | 0 FAIL; 96% 니다 ending WARN |
| JA | 94 | 0.459 | 0.149 | 0.076 | 0 FAIL; 96% desu-masu ending WARN |
| EN | 88 | 0.575 | 0.136 | 0.081 | 0 FAIL, no WARN |
| ZH | 89 | 0.474 | 0.157 | 0.069 | 0 FAIL, no WARN |

Each required `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <file>` ran successfully, exit 0. The polite-ending warnings are not FAILs, and do not justify switching registers.

Manual audit:

- No stock “Suppose/假設/例えば…とします/가령” opener. KO starts with the transfer scene, JA with the spending/exemption issue, EN with the mistaken transfer, ZH with the statutory sentence. Comparison with available C1–C4 shows no batch-wide majority of C4's opening type; C5/C6 remain outside this check.
- At least two very short sentences in each: KO “통장에 남아 있습니다.” / “생활비로 나갔습니다.”; JA “通帳に残っています。” / “生活費に回りました。”; EN “The money is still there.” / “It went to living expenses.”; ZH “利率沒寫。” / “所受利益已經不存在。” Longer explanations are interspersed rather than forming a repeated all-long sequence. Retain intelligibility rather than adding empty short sentences for metrics.
- EN fails the strict manual paragraph-opener item: “The” starts three paragraphs (26, 40, 71), and “Article” starts three after link labels are rendered (30, 46, 63). The automatic long-text tolerance did not flag this. These are two repeated words within one self-check item, not two different unmet items.
- No three consecutive claim–statute–caveat paragraphs found. Every version has a citation-free scene/question paragraph.
- No more-than-three contrast-template pattern or clear straw-man rebuttal found. Explaining that spending alone does not settle recovery addresses the actual topic.
- Final main paragraphs return to the transfer's facts, with no copied boilerplate disclaimer; EN has the substantive overstatement in L2. Contact is not the last main paragraph. KO/JA do not switch narrative registers.
- No facts, numbers, citations or hypothetical labels were removed: no edits were applied.

MONOTONY: EN repeated paragraph openers — “The transfer went to a Taiwan account…” / “The person to name is…” / “The money is still there.” and the three “Article…” paragraph starts — vary or consolidate these starts while retaining every distinct condition and source. This is one unmet manual item, not a numerical FAIL and not, by itself, the two-item automatic MONOTONY rejection threshold. The separate repetitive-prose finding V1 remains a required editorial correction under the batch voice rule. No checker failure has been invented or waived.

First-two-paragraph deletion test: KO's scene establishes destination error, absence of debt/contract, hypothetical status and the reply; its next paragraph supplies the two Article 179 branches and check date, but the repeated classification is removable. JA's opening conveys the spending/knowledge/remaining-benefit issue and the next paragraph supplies the hypothetical facts; retain those facts while fixing awkward wording. EN's one-sentence opening repeats the following scenario without adding a condition; remove or integrate it while retaining the hypothetical label. ZH's opening supplies Article 179 and the check date, but “的兩句話就是這個結構” is dispensable commentary; its second paragraph supplies the hypothetical facts. Comparison with published 522–524 does not justify copying their standard disclaimer or contact ending into C4.

## 5. Image verdict

Image: OK. Viewed the 1280 × 720 WebP. Two plain ceramic bowls, one with unmarked gold-colored discs and one empty, plus a loose disc, suggest a transfer/value imbalance. No people, faces, text, logos, flags, readable documents or identifying detail appear. The abstract fictional still life is respectful and fits the subject. It is not presented as evidence of a real transfer. No image redo required.

## Minor edits applied and final state

Minor edits applied: none. The requested review log and source/check evidence were written; all four column files remain byte-for-byte as reviewed. The writer must address the substantive findings and re-run lint and variety after revisions. Neither a passing lint nor 0 numerical variety FAILs overrides the legal, citation and native-prose findings.

Reviewed SHA-256:

- KO: `58c559061dfacec8b1a9e4f35b0a4186292d86fe6dfe67b226a2e37fac854ec0`
- JA: `7f72f342b79cb2b4b3367a3619d2d0ebd745fe96b987f963835c024022397291`
- EN: `d33aca709971355d71597ef7e803315af966b2869cfb14d1c84fffa0db582831`
- ZH: `41c53660e32eca2f48ab6b4ab2b0baba333d4359332efd737611fee2829f7123`

VERDICT: FIX      (major issues remain; listed in the log)
