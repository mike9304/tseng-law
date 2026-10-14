# C4 final review — round 3

Verdict: FIX. The four-language column is not publishable as submitted. The Article 182(1) explanation in KO, JA and EN has a material ambiguity about the cumulative exemption conditions; one paragraph in every language still lacks the adjacent Article 181 citation for its return/value rule; substantial repetition and unnatural prose remain. Image: OK. This is the third final-review round: under brief-BATCH.md, the coordinator must HOLD this item rather than publish it or treat this log as approval for another automatic review round.

Review date: 2026-10-14. Independent final review. No column edits applied. The corrections below are required unless identified as an internal-document follow-up.

## Scope checked

Opened and read in full: brief-BATCH.md, brief-EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, topics/C4.md, all four drafts/C4 language files including metadata and FAQs, drafts/C4/facts.md, and research/C4-statutes.md. Read SENTENCE-VARIETY-RULE.md, including sections 5–6, and the recurring categories in LESSONS.md. Read the requested legacy skill and the 0930 voice-rule pointer. The global path /Users/son7/agent-library/knowledge/editorial-voice.md is absent; the complete supplied voice brief, shared rules/EDITORIAL-VOICE.md and repository docs/columns/EDITORIAL-VOICE.md were opened instead. The latest user instruction gives this reviewer final authority without a Fable gate.

The fact sheet was not treated as proof. Independently opened the four cited official article pages through the web tool and fetched Articles 179–183 and the amendment history with curl. All six curl requests returned HTTP 200. Saved HTML, extracted text, reviewed draft snapshots and actual check outputs are in [evidence-astra-r3](./evidence-astra-r3/).

- [Civil Code Article 179](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=179)
- [Civil Code Article 180](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=180)
- [Civil Code Article 181](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=181)
- [Civil Code Article 182](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=182)
- [Civil Code Article 183, research context only](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=183)
- [Civil Code amendment history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001)

The research transcription matches these official texts. The latest whole-law amendment date is 民國115年08月17日, or 2026-08-17. Pending-effect notices concern Articles 166-1 and 1223, not the cited Articles 179–182. The drafts do not wrongly assign the whole-law amendment or a pending effective date to these provisions.

No judgment is cited, so there is no applicable judgment .txt to open. There are no other external sources in the columns. No numerical payment example, arithmetic, interest rate, limitation period, filing deadline, foreign-law holding or statutory bank procedure is asserted. The statement that Article 182 itself does not specify a rate or expressly designate the transfer date is read within that limited scope, not as a statement that Taiwan law has no applicable interest rules.

Checked matching-language internal-link files in /Users/son7/Projects/tseng-law-columns-20261014, the repository used by lint. Column 251 exists in all four languages; column 264 exists in JA, the only version linking it. Compared current C1–C6 openings and the openings, subheads and endings of preceding dated columns 522–524 in each language. This is a comparison of available files, not certification of future changes elsewhere in the batch. Viewed images/C4.webp with the image viewing tool. Consulted the round-2 log after the independent draft/source reading to distinguish resolved findings from remaining ones.

## 1. Law and facts

### L1 — MAJOR: ambiguous exemption test in KO, JA and EN

Original:

- KO, ko.md:58: “몰랐다는 사정만으로 면책이 되지는 않습니다. 썼다는 사정만으로 책임이 없어지지도 않습니다. 두 조건이 같이 있어야 … 제1항이 반환과 가액 상환을 면하게 합니다.”
- JA, ja.md:60: “知らなかった一点では、免責になりません。使った一点では、責任は消えません。両方が要ります。… 第1項は、その二つがそろったときにだけ、返還と価額償還の両方を免れさせます。”
- EN, en.md:67: “Not knowing, alone, does not release the recipient. Spending, alone, does not end the duty. Both have to be true before … paragraph 1 of Article 182 … releases the return of the benefit and the repayment of its value.”

→ Problem & reason: “두 조건 / 両方・その二つ / Both” points to the immediately preceding pair: lack of knowledge and spending. The actual second statutory condition is that the benefit received no longer exists. Spending is not the statutory substitute for that condition. A reader can therefore understand these sentences as saying that an unaware recipient is released once the money has been spent. This is especially consequential because the scenario mentions ordinary living expenses. Correct wording in the preceding section and FAQ does not make this local explanation safe to publish. The official [Article 182(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=182) requires lack of knowledge AND nonexistence of the benefit.

→ Fix required, not applied: Name both statutory conditions in this paragraph instead of using the ambiguous backward reference. Suitable wording to incorporate while keeping the existing article link:

- KO: “면책되려면 수령인이 법률상 원인이 없음을 몰랐고, 받은 이익도 더 이상 존재하지 않아야 합니다. 돈을 썼다는 사실만으로 이익이 없어졌다고 단정할 수는 없습니다.”
- JA: “免責には、受領人が法律上の原因がないことを知らず、受けた利益がすでに存在しないことが必要です。お金を使ったという事実だけでは、利益がなくなったとは判断できません。”
- EN: “The recipient is released only if they did not know there was no legal cause and the benefit received no longer exists. Spending the money does not, by itself, establish that the benefit is gone.”

→ Facts preserved: Both cumulative conditions; release from return and value repayment; the distinction between spending and disappearance of the benefit; Article 182(2)'s separate knowledge branches. This changes a legally material explanation, so the reviewer has not applied it under the minor-wording permission.

ZH-HANT does expressly restate the correct two conditions in the same paragraph at zh-hant.md:58. It does not have this particular legal omission. Its disconnected opening sentences still need the editorial repair in V1. The four versions must converge on the same clear test.

### Remaining legal-core checks

| Provision/question | Finding across the four languages |
|---|---|
| Article 179 | Benefit, corresponding loss, absence of legal cause, and later disappearance of a once-existing cause are covered. The example-specific credited-sum discussion is an application within the labelled hypothetical, not a verified real account-holder determination. The subsequent warning against treating account name or a relative's withdrawal as conclusive must remain. |
| Article 180 | All four categories appear, including the unmatured-debt purpose, knowledge at the time of payment in item 3, and the recipient-only unlawful-cause exception in item 4. The EN summary now correctly speaks of limits on recovery, resolving the prior metadata error. |
| Article 181 | The dedicated explanation correctly covers the benefit, further gains and value when return is impossible. Do not imply that value is additionally due for the same benefit already returned. Local citation issue C1 remains. |
| Article 182(1) | Correct in FAQs and the earlier explanation; material local ambiguity in KO/JA/EN as L1. ZH's full local restatement is correct. |
| Article 182(2) | Receipt-time knowledge versus later knowledge is mapped to the appropriate benefit. Interest and compensation if there is loss are retained. No fixed interest rate or universal transfer-date commencement is invented. |
| Bank/evidence | Contacting the bank and keeping records are practical suggestions, not invented statutory reversal/disclosure rights. No bank terms are asserted as verified. The closing leaves identity, remaining benefit and knowledge unresolved. |
| Scope | Non-fraud mistaken payment; no criminal allegation, account-freezing rule, foreign-exchange withdrawal advice, third-party Article 183 liability or promised litigation result. |

### I1 — internal fact sheet remains stale; not an independent public-text blocker

Original, facts.md: “볼 것은 이익이 누구에게 남았는지이고” and “제181조·제182조가 범위를 줄이면 액이 달라진다.”

→ Problem & reason: The first blurs identifying the Article 179 recipient with determining the later remaining benefit. The second describes Article 181 as reducing the scope, although it sets out benefit, further gain and value. The revised public text is more careful than these internal notes.

→ Fix required in the internal fact sheet, not applied: Align it with the recipient/remaining-benefit distinction and describe Article 181's actual function. Do not reuse these stale sentences as drafting authority.

→ Facts preserved: The verified statutory distinctions; this finding does not assert that both obsolete formulations remain verbatim in the public columns.

## 2. Citations

### C1 — MAJOR batch-rule failure: Article 181 rule has no adjacent Article 181 link in one standalone paragraph per language

Original:

- KO, ko.md:54: “받은 이익을 그대로 돌려줍니다. 돌려줄 수 없으면 가액입니다.” The paragraph's only link is Article 182, attached to the later exemption explanation.
- JA, ja.md:56: “受けた利益そのものを返します。返還が不可能なら価額です。” Again, the only link in the paragraph is Article 182.
- EN, en.md:63: “Handing back the benefit, and repaying its value when return is impossible, are the two paths in that article.” The paragraph links only Article 182.
- ZH, zh-hant.md:54: “返還原受利益，和不能返還時償還價額，是這一條分開的兩件事。” The paragraph links only Article 182.

→ Problem & reason: The return-versus-value rule based on inability to return is in [Article 181](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=181). Article 182 supports the subsequent exemption, but does not supply Article 181's impossibility rule. The preceding paragraph and final list have the right Article 181 link; the batch's explicit adjacent-inline requirement still applies to this separate restatement. This is a citation-placement finding, not an assertion that the substantive rule is false or the final list is incomplete.

→ Fix required, not applied: Integrate the Article 181 link with these return/value sentences, or consolidate the repeated explanation into the immediately preceding Article 181 paragraph while retaining the unique Article 182 exemption and its link. Preserve existing authorities and all legal conditions. A citation change is outside the reviewer's minor-wording permission.

→ Facts preserved: Benefit and further gains; value only where return is impossible; Article 182's two-condition exemption; the correct single-article targets.

All existing statute URLs have the right pcode and flno. The Article 180 and Article 182 mini-paragraph citation gaps identified in round 2 have been addressed. Article-as-subject links and coherent grouped explanations are acceptable under the variety rules; no demand is made to append the same citation to every sentence. Source lists contain all four cited authorities and the check date 2026-10-14. Internal links pass existence checks and stay in the same language; none points to this batch. No judgment-link requirement is applicable.

## 3. Rules and format

Each exact lint command completed with exit 0. Command arguments, stdout and exit codes are saved in evidence-astra-r3/checks.json.

| Language | Body length | Lint | Reading time |
|---|---:|---|---|
| KO | 2,806 characters | OK | 7분 분량 |
| JA | 3,196 characters | OK | 約8分 |
| EN | 1,526 words | OK | 8 min read |
| ZH-HANT | 2,331 characters | OK | 約6分鐘閱讀 |

Frontmatter keys, topic litigation, language-specific categories/audience, author legal-ai-assistant, three FAQs, title/H1 equality, NNN image path, publication/lastmod/display dates and distinct search titles comply. The EN title is 56 characters, so a seoTitle is required; its seoTitle is 36 characters and summary is 158 characters, with no forbidden summary characters. Reading times are plausible.

No private-party names, actual account identifiers, bold, phone/hotline numbers, LINE/Kakao identifiers, street addresses, attorney bylines, lawyer-review/native-review claims or fabricated professional experience were found. Each language has one short firm/email paragraph near the end. The core hypothetical has an explicit label, and its later conditional discussion is not presented as a real client case. No substantive foreign-law note requires an additional foreign official source.

## 4. Voice and sentence variety

### V1 — substantial revision required, all languages: repetition and disconnected short statements

Original:

- KO, ko.md:52–58: the Article 181 paragraph explains return, further gain and value; the next paragraph begins “받은 이익을 그대로 돌려줍니다. 돌려줄 수 없으면 가액입니다.” The next section opens “통장에 남아 있습니다. 생활비로 나갔습니다.”
- JA, ja.md:54–60: the same explanation is followed by “ここで分かれます。受けた利益そのものを返します。返還が不可能なら価額です。” Then: “通帳に残っています。生活費に回りました。”
- EN, en.md:61–67: the completed Article 181 explanation is immediately recapped as “Handing back the benefit, and repaying its value when return is impossible, are the two paths in that article.” Then: “The money is still there. It went to living expenses.”
- ZH, zh-hant.md:52–58: “返還原受利益，和不能返還時償還價額，是這一條分開的兩件事。” recaps the preceding paragraph. Then: “帳戶裡還看得到餘額。生活開銷花掉了。”

→ Problem & reason: Each version repeatedly explains the same rule instead of advancing the reader's understanding. The paired short sentences do not identify alternative cases, different portions of the money, or a passage of time: one says the money remains and the next says it was spent. This is disconnected prose, not meaningful sentence variety. EN also lists all four Article 180 exclusions in its table and then repeats every category in prose. The four versions retain nearly identical subhead/paragraph progression and repeated editorial remarks about what provisions do not say. These are failures of the batch's native-prose and no-repetitive-templating requirement even though the numerical metrics pass.

→ Fix required, not applied: Give each paragraph a distinct job. State Article 181's rule once, then move to Article 182's exemption. Make the remaining/spent-money alternatives explicitly conditional, or replace those disconnected fragments with a direct explanation of the unresolved benefit question. Retain informative short sentences elsewhere; do not keep ambiguous fragments merely to satisfy the short-sentence count. For EN, use the table to carry the exclusions and reserve subsequent prose for applying them to the mistake. Rework each language's connective language independently. This requires coordinated paragraph revision, not isolated typo correction.

→ Facts preserved: All four Article 180 categories and the item-4 exception; Article 181's benefit/further-gain/value distinction; both Article 182 branches; hypothetical status, source links and evidentiary limits. Keep the required body length without filling space with duplicate propositions or adding unsupported law.

MONOTONY: repeated rule/restatement and disconnected short-sentence sequence — “The money is still there. It went to living expenses.”, “通帳に残っています。生活費に回りました。” and the parallel KO/ZH sentences above — connect the alternatives to the actual legal question and remove duplicate explanations while retaining every condition and citation. This is a qualitative editorial finding, not a fabricated checker FAIL.

### V2 — native-prose failures within that revision, with concrete examples

- KO, ko.md:40, “사람이 가려진 다음의 액은 … 제182조가 정합니다.” → “사람이 가려진 다음의 액” is strained shorthand and hides the question of how much the recipient must return. → Required direction: “수령인을 확인한 뒤에는 제182조에 따라 반환 범위를 살펴봅니다.” Keep the following knowledge/existing-benefit branches and the Article 181 explanation. → Facts preserved: recipient identification precedes evaluation of return scope; no new outcome.
- KO, ko.md:48, “전액이라고 단정하지 않습니다. 잘못된 송금이 매번 전액으로 돌아오지는 않습니다.” → Two adjacent sentences make the same caution; the first also lacks a clear subject. → Required: retain one clear sentence, such as “잘못된 송금이라고 해서 언제나 전액을 돌려받는 것은 아닙니다.” → Facts preserved: no guarantee of full recovery; all preceding grounds remain.
- JA, ja.md:30, “先の振込は、初めから原因がない側です。” → “原因がない側” sounds like a literal classification note, not natural explanation. → Required: “この架空の例では、振込の当初から法律上の原因がありません。” → Facts preserved: initial absence of legal cause in the expressly fictional example.
- JA, ja.md:38, “送った側が会社か個人かは、文言が区別しません。” → “文言が区別しません” is an unnatural actor/action combination. → Required: “第179条は、振込人が会社か個人かによって区別していません。” Keep the existing link and recipient qualifications. → Facts preserved: the statute's applicability is not divided by that label.
- EN, en.md:40, “What that person must return is Article 182” and “Who holds the cash today does not take the place of the time of receipt or the time of later knowledge.” → The first equates an amount/duty with an article; the second compares a person with time points. Neither expresses the intended relationship naturally. → Required: explain directly that Article 182 makes knowledge and the remaining benefit relevant to the recipient's duty, retaining the two precisely stated timing branches. State that present possession of cash does not resolve those questions. → Facts preserved: recipient identity, knowledge timing and return scope remain distinct.
- EN, en.md:30, “No debt, and no contract that would be the cause of a payment to the holder, is the lack of legal cause.” → Ungrammatical/abstract equation rather than an explanation. → Required: explain that, in this invented example, no debt or contract supplied a legal basis for payment to that holder. Preserve the already-stated absence of legal cause as an example premise, not an exhaustive legal test for every transfer. → Facts preserved: the hypothetical premise and Article 179's actual elements.
- ZH, zh-hant.md:48, “帳號看錯，不會單憑這一點走進第三款。” → “走進第三款” gives an account-entry mistake a physical movement and reads as translated imagery. → Required: “僅憑帳號看錯，還不能認定符合第三款的要件。” → Facts preserved: a mistake alone is not knowledge that no payment obligation exists.
- ZH, zh-hant.md:54, “償還價額的義務不會每次都留著。” → “義務…留著” is not natural Taiwanese legal prose and makes the duty sound like an object being stored. → Required: “符合第182條第1項的條件時，也可免除償還價額的責任。” Keep the explicit two conditions immediately with that explanation. → Facts preserved: value repayment is also covered by the statutory exemption; no relaxation of its conditions.

These examples are part of the substantial editorial defect, not a claim of human native-speaker review. Titles themselves are specific and not clickbait or checklist commands. KO remains in 합니다체 and JA in です・ます. No mainland vocabulary or simplified characters were found in ZH; that does not cure its quoted collocation problems.

### Required variety checks and manual sections 5–6 audit

All four required variety commands completed with exit 0:

| Language | Sentences | CV | Very short share | Similar-length runs | Result |
|---|---:|---:|---:|---:|---|
| KO | 93 | 0.458 | 0.172 | 0.066 | 0 FAIL; 99% 니다 ending WARN |
| JA | 99 | 0.467 | 0.202 | 0.052 | 0 FAIL; 99% desu-masu ending WARN |
| EN | 91 | 0.452 | 0.110 | 0.056 | 0 FAIL, no WARN |
| ZH-HANT | 91 | 0.460 | 0.099 | 0.135 | 0 FAIL, no WARN |

Manual audit:

1. Opening: no prohibited stock hypothetical opener. KO/EN use a specific transfer scene, JA the spending/exemption issue, ZH the statutory text. Current C1–C6 files offer different opening forms; no additional C4-specific opening violation is assigned. No copied opening from the three preceding dated columns was identified.
2. Short sentences: each file has at least two. Examples apart from the problematic money fragments include KO “이율은 이 조에 없습니다.” / “기산일도 없습니다.”; JA “この条に利率はありません。” / “起算日もありません。”; EN “The scene is invented.” / “The article states no rate.”; ZH “這一條沒寫利率。” / “起算日也沒寫。” Numerical length variety passes, but V1 addresses whether the short sentences form coherent prose.
3. Paragraph openers: no three occurrences of the same starting word were identified after reading rendered link labels. In EN, “Article” and “The” each open two body paragraphs.
4. Citation rhythm: each language has a citation-free scene/evidence paragraph. The three recipient-section paragraphs still end in repeated rule/citation/limitation commentary: account label, relative's withdrawal, then present cash location/court prediction. This is one manual rhythm concern, to be addressed during V1; it is not three independent failed self-check items.
5. Contrast: no count over the limit of three lexical contrast templates was found. The mistake/spending/relative-withdrawal cautions answer issues actually raised in this column, so they are not labelled invented reader arguments merely for being negative.
6. Closing: every final body paragraph returns to the transfer records and unresolved facts. No copied general disclaimer or sales line is the final paragraph. The optional contact paragraph is separate and short.
7. Register/attribution: KO/JA registers hold; no bold, invented professional first person or checklist-command title. The WARN results do not justify introducing register mixing.
8. Preservation: no draft was edited; every original fact, number, link and hypothetical label remains available for the writer's controlled revision.

MONOTONY: self-check 5, repeated rule–citation–limitation paragraph function — “Who holds the cash today does not take the place of the time of receipt or the time of later knowledge.” and the parallel recipient-section endings — organize the three paragraphs around the recipient test, the hypothetical reply, and the knowledge/benefit evidence, without restating the same limitations in every paragraph.

There is no tool FAIL and no finding of two distinct unmet automatic-threshold self-check items. The numerical MONOTONY rejection threshold is not claimed to have been triggered. L1, C1 and the independent native-prose/repetitive-templating requirements prevent PASS.

First-two-paragraph deletion test: KO/EN scenes supply the mistaken destination, no debt/contract, hypothetical label, records and spending reply; preserve those premises. Their Article 179 paragraph supplies the original/later-loss-of-cause branches and check date; “왜 사라졌는지는 그 원인이 나온 법률관계의 내용에 따릅니다” / “Why the cause disappeared depends on the relationship that produced it” adds no concrete condition and can be omitted during consolidation. JA's first paragraph states the spending/exemption issue and its second supplies the fictional transaction; retain those distinct functions. ZH's opening supplies the rule and check date; “原因為什麼消失，回到那個法律關係裡看” adds no usable explanation and can be omitted. The following hypothetical supplies distinct facts. These editorial deletions are recommendations within the required revision, not changes applied by this reviewer. Unique legal conditions, source/check date and hypothetical labels must remain.

## 5. Image

Image: OK. Viewed the 1280 × 720 WebP. Two plain ceramic bowls, unmarked gold-colored discs and one loose disc form a fictional, abstract transfer/value illustration. No faces, identifiable people, text, logos, flags or readable documents are visible. The image is relevant and respectful; no redo is needed.

## Minor edits applied and reviewed state

Minor edits applied: none. No legal meaning or citations were silently changed, and no paragraph rewrite was performed under the minor-edit allowance. The log and evidence are the reviewer's only outputs.

Reviewed SHA-256:

- KO: cf59230ead9343e64743807ba5004acd067c677d7a8e324550ade763c96f4d53
- JA: d52b7c75bd57ad603c804ab910c38cc1a4cb171fba2ad74c6c66578862a04fa0
- EN: a1074656fb7422ebe0ea2aad8427c4a6f71f4cf5e0169bc7e7453776dd77fe24
- ZH-HANT: 62f51cc6d296c71f18f563b1d6b598e072e1089de58fa6dfd0cb722ddc981618

VERDICT: FIX      (major issues remain; listed in the log)
