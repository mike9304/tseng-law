# C5 final review — round 1

Verdict: FIX. None of the four language files is approved for publication as submitted. The English example misapplies the early-repayment rule; all versions need legal qualification, citation and substantial prose corrections. Automated lint/variety success does not resolve the manual findings below.

## Scope and evidence

Reviewed all of `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C5.md`, `drafts/C5/{ko,ja,en,zh-hant}.md`, `drafts/C5/facts.md`, and `research/C5-statutes.md`. Read the shared sentence-variety rule, including sections 5–6, and LESSONS. Also read `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md` and the repository's `docs/columns/EDITORIAL-VOICE.md` in full. `~/agent-library/knowledge/editorial-voice.md` is absent on this machine; the supplied full editorial-voice brief and repository copy supplied the substantive rules. The current user's direct final-review instruction supersedes older Fable approval requirements.

Independently fetched all 18 distinct official URLs cited in the body with curl: Civil Code articles 125, 126, 203–207, 229, 233, 474, 477, 478 and 480; Enforcement Act articles 10-1 and 36; Code of Civil Procedure articles 277 and 508; and the Civil Code amendment history. All 18 fetches succeeded, and the statutory passages match the supplied research file. Also fetched the official English Civil Code and Enforcement Act to check article 477 and the English statutory title. Fetch evidence and unchanged draft snapshots are in `/private/tmp/c5-final-astra-r1/`. No judgment is cited by any version; there is no applicable judgment text to review.

Checked frontmatter, all three FAQs per language, title, summary, body, internal links, source lists, contact, hypothetical labels, cross-language consistency and manual variety. Compared the available C1–C4 openings in each language; C6 language drafts were not present, so a complete six-column opening census cannot be certified. Compared openings, headings and endings of the repository's three most recently dated column files in each language, numbers 524, 523 and 522; this is a local publication-record comparison, not a deployment audit.

Requested `images/C5.webp` is absent. Viewed the available `images/C5.jpg` with the image tool and read `images/DONE.txt`. Image assessment and delivery finding appear below.

## 1. Law and facts — required changes

### L1 — EN: early repayment is applied to an already matured example

Original: `en.md:25`, “The due date is six months out.” At `en.md:43`, “Read as 24 percent a year, the note's 2 percent a month also clears 12 percent, so early repayment under Article 204 opens after one year.”

→ Problem & reason: after one year this example has already passed its six-month repayment date. Calling repayment then “early” gives the borrower a misleading account of the agreed maturity and the statutory right. Article 204 does not defer a six-month maturity to one year. The arithmetic, 2% × 12 = 24%, is correct; its application to this example is not. See [Civil Code article 204](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=204) and [article 478](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=478).

→ Fix required, not applied: remove the application of article 204 to this six-month example and retain the general rule, or have the writer deliberately revise the hypothetical's term and every dependent reference. Do not suggest that article 204 prevents repayment when the agreed six-month date arrives.

→ Facts preserved: retain the hypothetical label, monthly 2%, simple annual equivalent 24%, excess-over-16% invalidity, and the general above-12% / after-one-year / one-month-notice / nonwaivable conditions. A change to the hypothetical's term requires fact review and is outside this reviewer's minor-edit authority.

### L2 — ALL: the year-end interest rule loses its no-agreed-payment-date condition

Original: `ko.md:58`, “대차 기간이 1년을 넘으면 매년 말에 지급합니다.”; `ja.md:60`, “貸借の期間が1年を超えるときは、毎年の終わりに払います。”; `en.md:57`, “If the loan runs longer than one year, it is paid at the end of each year.”; `zh-hant.md:66`, “借貸期限超過一年的，在每年終了時給付。”

→ Problem & reason: these are freestanding categorical sentences. The preceding sentences mention an agreed payment date and then no agreed date, but the final sentence does not retain that distinction. Readers can understand annual payment as overriding an agreed schedule whenever the loan exceeds one year. Article 477 first gives effect to the contractual payment deadline; its termination/year-end alternatives apply when no payment deadline was fixed. The writer's fact sheet expressly declines to decide this relationship; preserving the order of clauses is not enough. The [Chinese article 477](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=477) and the corresponding paragraph in the [official English Civil Code](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=B0000001) support retaining the condition.

→ Fix required, not applied: state that the agreed interest-payment date governs; if none was agreed, payment is at termination, except that a loan lasting more than one year uses the year-end rule. Explicitly connect the last alternative to the absence of an agreed interest-payment deadline in every language.

→ Facts preserved: contractual priority, termination, the more-than-one-year condition and year-end payment all remain. The missing conditional relationship is restored.

### L3 — ALL: the universal two-fact proof statement overlooks the conversion already described

Original: `ko.md:70`, “대여금이라고 주장하는 사람은 두 가지 사실을 입증해야 합니다. 금전 소유권이 넘어갔는지가 하나이고…”; `ja.md:72`, “貸金の返還を求める側が立証すべき事実は二つあります。金銭の所有権が移ったかどうかが一つ…”; `en.md:69`, “Claiming repayment, a lender must establish two facts. Did ownership of the money pass?”; `zh-hant.md:32`, “主張這筆是借款的人，要讓人看見兩件事。金錢的所有權有沒有移轉過去。”

→ Problem & reason: this is appropriate for the ordinary advance in the hypothetical, but it is presented as the test for every loan claim. All four versions also explain that an existing monetary obligation can be converted into a loan under [article 474(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=474). That route does not require a new advance of money; the existing obligation may have another origin. The proof section must not erase this alternative. [Article 277](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=277) supplies the general burden and its exceptions, not a universal new-disbursement test.

→ Fix required, not applied: limit the two-fact explanation to an ordinary newly advanced loan such as the illustrated transaction. Preserve the distinct existing-debt-and-conversion-agreement route in one short qualification, with the appropriate inline links.

→ Facts preserved: both ordinary-loan elements, article 474(2), article 277's exceptions, and the evidential distinction between transfer and repayment agreement remain.

### L4 — KO/JA/ZH-HANT: fee/compound-interest headings misstate or obscure the conditions

Original: `ko.md:48`, “수수료를 먼저 떼고, 이자를 원본에 넣지 못합니다”; `ja.md:38`, “手数料を先に引き、利息を元本に繰り入れない”; `zh-hant.md:56`, “先扣一筆費用，利息不滾進原本”.

→ Problem & reason: the Japanese and Chinese first clauses read as deducting a fee first, without stating the relevant restriction. The Korean coordination is ambiguous. All three suggest an unqualified prohibition on capitalizing interest, although their bodies correctly retain article 207's written-agreement conditions and commercial-custom exception. Headings must not imply a different rule from the body. [Article 206](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=206) addresses benefits obtained beyond the permitted interest; [article 207](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=207) is not an exceptionless ban.

→ Fix required, not applied: use neutral issue-specific headings, for example “선공제 수수료와 복리 약정”, “先に差し引く手数料と複利の約定”, “預扣手續費與複利約定”, and retain the full conditions in the body.

→ Facts preserved: no deduction is newly authorized and neither exception is lost. EN's neutral heading does not have this defect.

## 2. Citations and source compliance — required changes

### C1 — ALL: unsourced foreign-law assertion

Original: `ko.md:46`, “한국·일본·미국 각 주의 이자 상한은 각각의 법률에 따릅니다. 그 수치는 여기서 확인하지 않았습니다.”; `ja.md:36`, “日本、韓国、米国の各州の利息上限は、それぞれの法律が定めます。その数値は、ここでは確認していません。”; `en.md:35`, “Korea, Japan, and individual US states set their own interest caps under their respective laws. Their figures have not been checked here.”; `zh-hant.md:54`, “韓國、日本及美國各州的利息上限各依當地法律；本文未查核那些法令的數值。”

→ Problem & reason: there is no official foreign-law citation and no recommendation to check with a local professional. Saying that the figures were not checked does not satisfy batch hard rule 10's two permitted alternatives. The fact sheet confirms that no foreign official page was opened. The topic brief permits a general note, but does not override the batch source rule.

→ Fix required, not applied: keep one general caution framed as checking the relevant foreign jurisdiction with a local professional, or verify and cite suitable official sources immediately after the assertion and in the source list. Do not introduce unsourced rates or foreign-court practice.

→ Facts preserved: retain the jurisdictional caution without presenting an unverified foreign-law summary as verified.

### C2 — ALL: substantive standalone paragraphs lack their own inline links

Original: the service-as-demand and no-date-loan/default paragraphs at `ko.md:64`, `ja.md:66`, `en.md:63`, `zh-hant.md:72` cite paragraph numbers only. The two-element proof paragraphs at `ko.md:70`, `ja.md:72`, `en.md:69`, `zh-hant.md:32` likewise contain no official inline link.

→ Problem & reason: these paragraphs make discrete legal assertions, including a combined application of articles 229 and 478. Links in an earlier paragraph or the final source list do not meet the requested immediately-associated inline-source requirement. In particular the proof paragraph needs the formation provision as well as the general burden provision. The requirement does not compel redundant links after every sentence within one clearly sourced paragraph.

→ Fix required, not applied: link articles 229 and 478 at the relevant service/default claims; link articles 474 and 277 at the qualified proof explanation. Keep the legal corrections in L3. Bare paragraph-number fragments should be integrated into these sentences, not multiplied.

→ Facts preserved: legal propositions remain traceable to the same provisions; no source substitution or legal expansion is authorized as a minor edit.

Positive citation findings: all 18 external URLs actually used in each body appear in that version's final source section; all pcode/flno combinations point to the intended provisions; every source section carries the required October 13, 2026 check date. Internal links exist in the correct language according to the specified lint: KO 2, JA 2, EN 2, ZH-HANT 3. No current-batch internal link or judgment citation appears.

## 3. Rules and intended scope

Formal checks pass in every language: author `legal-ai-assistant`; correct audience, topic `litigation`, dates, category, image placeholder, H1 and FAQ count; no bold, private-party names, phone/hotline, street address, messaging ID, attorney/native-review claim, fabricated professional experience or outcome guarantee. Each has one firm/email paragraph. Hypotheticals are expressly marked. Criminal law, tax and regulated-bank topics are absent. Mentioning LINE as an evidence channel is not a prohibited LINE contact ID.

EN title is 41 characters, 56 with ` | Hovering Law`, so omitting seoTitle is correct. EN summary is 160 characters and has none of the forbidden characters. KO/JA/ZH-HANT seoTitle fields differ from their titles.

### R1 — scope excess: unnecessary payment-order technology and overlong currency treatment

Original: `ko.md:82`, `ja.md:84`, `en.md:81`, `zh-hant.md:80` explain article 508(2)'s computers/technology and Judicial Yuan rulemaking. EN `:77` and ZH-HANT `:76` devote four sentences to article 480.

→ Problem & reason: the topic brief asks for payment order and small claims to be named and linked, and foreign-currency repayment in one or two sentences. The equipment detail does not help this column's loan/interest question; the EN/ZH-HANT currency section exceeds its stated allocation. The statutory substance is supported, so this is a scope/editorial correction, not a finding that article 508(2) is false.

→ Fix required, not applied: remove the procedural-technology detour, retain the named remedies and links, and condense currency treatment within the brief without losing contract priority or any currency option the revised text describes. Guarantor/promissory-note issues should remain separate; do not add a nonexistent-language internal link or exceed three links.

→ Facts preserved: mandatory private-loan law, repayment choices and relevant citations remain; only out-of-scope exposition is removed or condensed by the writer.

## 4. Native prose and sentence variety

The titles are specific and not clickbait or checklist imperatives. KO remains in 합니다체 and JA in です・ます. No prohibited mainland vocabulary or simplified characters were found in ZH-HANT. Nevertheless, all four bodies repeatedly narrate what a statute “writes,” split article references into artificial miniature sentences, and carry closely translated prose instead of explaining the legal effect naturally. The following are required editorial revisions, not isolated typos that a final reviewer should patch while the legal issues remain.

### V1 — KO

Original: `:30`, “같은 조 제2항입니다”; `:52`, “제2항이 그 관습을 제1항 밖으로 뺍니다”; `:70`, “그 약정이 있는지를 물을 때 자료가 답합니다. 세 이름을 조문이 목록으로 적지는 않았습니다”; heading `:56`, “이자는 어느 날에, 원금은 어느 최고로”.

→ Problem & reason: the prose personifies statutes/evidence, uses a strained “밖으로 뺍니다” metaphor for an exception, and repeatedly supplies a bare paragraph number instead of integrating the source. “어느 최고로” is not a natural reader-facing heading. The seoTitle's “기한 없는 반환 최고” also points at the notice rather than the loan's missing repayment date.

→ Fix required, not applied: express the commercial-custom exception directly, put the article/paragraph reference with its rule, explain what evidence can show, and refer to “변제기를 정하지 않은 대여금” rather than suggesting a demand without a deadline. Example direction: “상업상 다른 관습이 있으면 제207조 제1항은 적용되지 않습니다.” Retain its existing link.

→ Facts preserved: the exception, evidence limitations and required reasonable period of at least one month remain.

### V2 — JA

Original: `:42`, “第2項が、その慣習を第1項の外に出します”; `:44`, “第2項が、その約定を止めます”; `:64`, “第1項が起算をそう取ります”; `:72`, “資料が答えます”; `:86`, “その二つを送ると足ります”.

→ Problem & reason: these are conspicuous calques, not natural Japanese legal explanation. The contact sentence also sounds like an unsupported statement of documentary sufficiency. The opening's final sentence (“台湾民法の別の条文で定められています”) merely announces that another provision exists, while the next section switches to 16% rather than answering the empty-interest-field question. The seoTitle “期限のない催告” similarly misidentifies what lacks a deadline.

→ Fix required, not applied: recast the sentences around the legal effect, for example “商慣習が別にある場合には、第1項は適用されません”, with the link retained. Use “返済期限を定めていない貸付け” for the loan. Replace sufficiency language with a short invitation to send the relevant material for an inquiry. Delete the empty preview or replace it with an accurately sourced immediate answer. In references to Taiwan's presidential order, “総統令” is the natural local designation.

→ Facts preserved: です・ます, all statutory conditions and the hypothetical label remain; no review claim or assurance about adequate evidence may be added.

### V3 — EN

Original: `:33`, “An agreement made before the amendment still meets the amended article”; `:53`, “Paragraph 2 says so” / “Paragraph 3”; `:57`, “Those three sentences stand in that order”; `:59`, “Both sentences are Article 478”; `:73`, “Whether the money actually moved is a separate sheet, or it is missing”.

→ Problem & reason: agreements do not “meet” an article in this sense; sentences are not an article; whether a transfer occurred is not a sheet of paper. Repeated paragraph-number fragments and source-description filler imitate variety without producing plain English. The last example also overfocuses on a separate sheet when the question is proof, including electronic evidence.

→ Fix required, not applied: use direct legal subjects and verbs (“The amended rule also applies to interest accruing after it took effect under an older agreement”), integrate paragraph references into the linked rule, and describe proof of delivery rather than the physical shape of a record. Use the [official English title](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=B0000003), “Enforcement Act of the Part of Obligations of the Civil Code”, on first mention and in the sources. In the formality discussion, distinguish an IOU from the separate promissory-note instrument mentioned at the end.

→ Facts preserved: the transitional time boundary, general form/proof distinctions, article numbers and links remain. These prose changes must accompany, not conceal, L1–L3.

### V4 — ZH-HANT

Original: `:26`, “借據沒有”; `:36`, “哪一句算返還約定，要看那些字”; `:58`, “這個畫面會不會碰到折扣，就是這一條要問的”; `:66`, “三句按這個順序寫在”; `:82`, “附上這兩項就夠”.

→ Problem & reason: the inverted fragment, vague references to “those words,” and a “scene bumping into a discount” are unnatural Taiwan prose. The text tells the reader about sentence order instead of the legal condition. The contact wording overstates the sufficiency of two items. The seoTitle “只無效超過部分” is also awkwardly ordered.

→ Fix required, not applied: use “沒有借據”, explain directly what the messages and remittance record establish, describe the potential fee/interest issue without the scene metaphor, and state the article 477 condition correctly. Prefer “超過年息16%的部分無效” in the seoTitle. Make the email invitation conditional and remove the claim that two items are enough.

→ Facts preserved: the fictional scenario, agreement-versus-delivery distinction, cap, exceptions and email remain; no new finding about the example is invented.

### Manual MONOTONY findings — sections 5–6

The checker relaxes paragraph-opening repetition for longer texts. The user's separate self-check does not: it asks for no three paragraphs starting with the same word. Each file fails item 4 below and item 6's prohibition on rebutting an unmade claim. Thus all four meet the two-unmet-items threshold for REQUEST_CHANGES despite having no automated FAIL line.

- MONOTONY: KO item 4, repeated paragraph opening — “민법 제203조는…”, “민법 제205조에서…”, “민법 제207조 제1항…” (`:34`, `:40`, `:52`, link markup removed) — vary the subject/opening of at least one paragraph while keeping each provision linked.
- MONOTONY: JA item 4, repeated paragraph opening — “民法第205条が…”, “民法第207条第1項…”, “民法第203条は…” (`:30`, `:42`, `:54`) — open one with the actual loan/interest consequence, preserving its source.
- MONOTONY: EN item 4, repeated paragraph opening — “Article 207…”, “Article 474…”, “Article 277…” (`:41`, `:47`, `:67`); “A” also starts `:25`, `:39`, `:81`, and “The” starts `:59`, `:73`, `:79` — redistribute subjects and sentence structure rather than merely swapping synonyms.
- MONOTONY: ZH-HANT item 4, repeated paragraph opening — “民法第474條…”, “民法第205條…”, “民法第207條…” (`:38`, `:48`, `:60`) — make at least one paragraph begin with the transaction or legal effect, retaining the link.
- MONOTONY: KO item 6, rebutting an unmade claim — “세 이름을 조문이 목록으로 적지는 않았습니다.” (`:70`) — explain the evidential relevance of gift/investment/old-debt payment; remove the unsolicited rebuttal that these labels were supposedly a statutory list.
- MONOTONY: JA item 6, rebutting an unmade claim — “三つの名を、条文が目録としては書いていません。” (`:72`) — explain why the payment's purpose matters instead of denying an assertion the reader was not given.
- MONOTONY: EN item 6, rebutting an unmade claim — “The articles do not print those three labels as a list.” (`:69`); also “The statute itself does not give that multiplier.” (`:29`) — keep the proof explanation and arithmetic, and remove these source-description rebuttals.
- MONOTONY: ZH-HANT item 6, rebutting an unmade claim — “條文沒有逐一列舉贈與、出資或清償舊債這些可能的款項性質。” (`:32`) — keep the examples as illustrations of purpose; remove the irrelevant denial of a statutory list.

These directions preserve all operative facts, numbers, citations and hypothetical labels. They do not treat the useful clarification that only excess interest is void as a forbidden contrast: that clarification answers a real question stated in the FAQ.

Other manual items: no stock “Suppose/假設/가령/例えば…とします” opening; at least two very short sentences in every version; uncited scene/question paragraphs present; no run of three claim–citation–caveat paragraphs; final substantive paragraphs return to the loan facts, not a copied disclaimer; KO/JA register maintained. C5's marked scene opening differs from the immediate local comparison articles. Full C6 batch comparison remains unavailable as noted above.

First-two-paragraph deletion test: KO's second opening sentence partly repeats the completed transfer but uniquely identifies the “operating funds” description; merge that description with the first sentence rather than discard it. JA's final opening sentence is a dispensable preview and should be removed or replaced as V2 explains; retain the hypothetical label and evidence details. EN's opening supplies rate, maturity, signature and missing transfer record, but the statutory-multiplier disclaimer in the second paragraph is dispensable. ZH-HANT's opening supplies transfer, repayment wording and absence of an IOU; its second paragraph states article 277 and both exceptions, so those facts must stay.

## 5. Image

Image verdict: REDO — delivery artifact only. `/Users/son7/tseng-col-1013-work/images/C5.webp` was not found and cannot be approved as an existing publication asset.

Visual assessment of the available `C5.jpg`: OK. Viewed at 1280 × 720. A wooden abacus, plain closed box, unlabeled tea jars and a cropped linen-sleeved hand on a shop counter fit money/interest calculation. No face, readable document, text, logo, flag or identifiable private person is visible; the treatment is respectful. This generic illustrative scene makes no real-case claim. The coordinator can prepare the required WebP from this acceptable image and check that output; new artwork is not required. This is not “image: not viewed by reviewer”: the JPEG was actually viewed, while the specifically requested WebP is missing.

JPEG SHA-256: `e78666389eb3fb8e6ee4b956e3ed43689cabcbeb78f98af4f1e0e1467cd9e9a2`.

## Verification results and edits

Ran the requested commands for each language:

`python3 /Users/son7/tseng-col-1013-work/lint.py /Users/son7/tseng-col-1013-work/drafts/C5/<lang>.md <lang> taiwan-private-loan-interest-cap-iou-repayment`

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1013-work/drafts/C5/<lang>.md`

| Language | Lint | Body length | Variety result | CV | Very short share |
|---|---|---:|---|---:|---:|
| KO | OK | 3,029 characters | 0 FAIL; warning: 97% 니다 endings | 0.550 | 0.161 |
| JA | OK | 3,309 characters | 0 FAIL; warning: 98% desu-masu endings | 0.585 | 0.229 |
| EN | OK | 1,577 words | 0 FAIL, no warning | 0.568 | 0.278 |
| ZH-HANT | OK | 2,423 characters | 0 FAIL, no warning | 0.512 | 0.216 |

The register warnings alone are not rejection grounds and do not call for mixing registers. The manual failures are separately documented above. All command exit codes were zero. No article was edited, so no post-edit lint is applicable.

Minor edits applied: none. This review writes only the review log; substantive corrections, source additions and the required prose revision remain with the writer.

Unchanged draft SHA-256 values:

- KO: `56ee7a58b571df868998507a0c0d09014087892656f9e16e0d8ece985a46d65e`
- JA: `8bb1596b670c52f2618dd75f2f689045df3f200a359b6c1ad7825c6d1f883fcd`
- EN: `c34b344eb224139f0a10a554a5618380fb415ad9e6bdd0dbd05e89e34db6563b`
- ZH-HANT: `082569420d5889fa9a15ed7e26b981f71dc048f0bd1eb5a1436f86d3ae2a849a`

VERDICT: FIX      (major issues remain; listed in the log)
