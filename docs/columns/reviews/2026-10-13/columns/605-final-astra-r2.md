# C5 final review — round 2

Verdict: FIX. The four-language package is not publishable as submitted. Two substantive legal-wording problems remain, along with citation-placement, scope and native-prose corrections. The available JPG is visually acceptable, but the specified WebP is missing. No column file was edited by this reviewer.

## Scope checked

Review date: 2026-10-14, Asia/Seoul. Reviewed every line of `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C5.md`, `drafts/C5/ko.md`, `ja.md`, `en.md`, `zh-hant.md`, `facts.md`, and `research/C5-statutes.md`. Checked title, summary, all FAQs, body, source lists and frontmatter, not just the main prose.

Read the full shared `SENTENCE-VARIETY-RULE.md`, including sections 5–6, and skimmed the recurring findings in `LESSONS.md`. Read `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md` and `/Users/son7/Projects/tseng-law-columns-20261013/docs/columns/EDITORIAL-VOICE.md`. The canonical `~/agent-library/knowledge/editorial-voice.md` does not exist at the supplied path on this machine; the full supplied editorial brief and repository copy supplied the substantive rules. Applied the current user's direct final-review authority; no Fable approval was required.

Independently fetched with curl all 18 distinct official URLs cited by the columns: Civil Code articles 125, 126, 203–207, 229, 233, 474, 477, 478 and 480; Obligations Enforcement Act articles 10-1 and 36; Code of Civil Procedure articles 277 and 508; and the Civil Code amendment history. Every fetch succeeded. Read the returned article texts and compared them with the research file. Also fetched Civil Code article 144 to check the English limitation statement and the official English Obligations Enforcement Act to check its title. The writer's fact sheet was treated as a claim inventory, not authority. No version cites a judgment, and no applicable judgment text exists to open.

Source-fetch manifest, returned HTML/text, lint/variety outputs and comparison records are in `/private/tmp/c5-final-astra-r2-evidence/`. The body and sources section of each language use the same set of 18 official URLs; none is omitted from its source list. All single-article pcode/flno pairs match their link labels.

Compared available C1–C4 openings in all four languages with C5. C6 language drafts were absent, so the complete six-column distribution cannot be certified. Also compared openings, headings and endings of the locally recorded latest three columns, numbers 524, 523 and 522, in each language. This was a local content comparison, not a live-deployment audit. Read the previous review and writer's round-2 notes after independently checking the current texts.

Attempted to view `images/C5.webp`: file not found. Opened and visually inspected the available `images/C5.jpg`, and read `images/DONE.txt`. See the image finding below.

## 1. Law and facts

### L1 — MAJOR, EN: prescription of the claim becomes extinction of the principal

Original → `en.md:79`: “Principal is extinguished if the claim is not exercised for 15 years.” The next sentence likewise makes “Each instalment of interest” the thing extinguished.

Problem & reason → [Article 125](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=125) concerns the claim; [article 126](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=126) concerns each periodic-payment claim. They do not say that the principal itself disappears. [Article 144](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=144) confirms the practical distinction: after prescription the debtor may refuse performance, while a payment nevertheless made cannot be reclaimed merely because the debtor did not know of prescription. The English wording is broader than the cited statutes and differs from KO/JA/ZH, which identify the claim as the subject.

Fix required, not applied → Make the principal claim and each interest-instalment claim the subjects. A concise direction consistent with the topic's one-sentence limit is: “The general limitation period is 15 years for the principal claim and five years for each periodic interest-payment claim,” retaining the article 125/126 links. Do not expand this into a limitation tutorial or state that the debt automatically vanishes. If an explanation of the effect of prescription is retained, source it accurately.

Facts preserved → Preserve 15 years, five years, the separate treatment of each periodic payment and both existing citations. The legal subject must be corrected; this is outside minor-copy-edit authority.

### L2 — MAJOR, JA/EN; corresponding ZH wording and KO FAQ require alignment: a blank field is not the statutory condition

Original → `ja.md:88`: “返済日が空欄なら、貸主は…” followed by the article 478 one-month demand rule. `en.md:63`: “On a loan whose return date was left blank…”; `en.md:85`: “Had the date been left off…” followed by the same rule. `zh-hant.md:72`: “返還期限空白的消費借貸…”. The third FAQs in KO/JA/ZH ask about not writing a repayment date: “갚는 날을 적지 않으면”, “返済日を書いていないとき”, “沒寫還款日”.

Problem & reason → [Article 478](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=478) distinguishes an agreed repayment term from no agreed repayment term. It does not distinguish a completed date field from a blank one. [Article 474](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=474) does not impose the written-contract requirement that these shortcuts risk implying. A repayment date agreed in messages or otherwise is not erased by its omission from an IOU. JA's closing and EN's two sentences categorically select the no-term procedure from a missing written date. ZH's wording repeats the ambiguity. KO's answer correctly says there is no term, but its question should state that condition too. This matters because the applicable demand and default starting point can change.

Fix required, not applied → Use the absence of an agreed repayment date consistently: “返済期限を合意していなければ”, “if no repayment date was agreed”, “雙方未約定返還期限時”, “반환기한을 정하지 않았다면”. If a blank IOU field remains part of the illustration, explain that the parties' other communications must also be checked before selecting the no-term rule. Preserve the existing article 229/478 links and the distinction between maturity and default.

Facts preserved → Preserve the reasonable period of at least one month, the borrower's ability to repay when no term was agreed, the fixed-date branch, service-as-demand, and default at expiry of a period specified in the demand. Do not change the English hypothetical's six-month maturity.

### Legal points independently verified and not rejected again

- Article 474(1): transfer of ownership and agreement to return the same kind, quality and quantity. Article 474(2): conversion of an existing obligation by agreement without a fresh advance. The current proof sections now limit their two-fact explanation to a newly advanced loan and retain the conversion route.
- Article 203: interest must already be payable; no agreed rate and no statutory rate are the conditions for 5% annually. Lending alone is not presented as automatically creating an agreed interest term. Article 233 retains statutory default interest or the higher agreed rate, no default interest on interest, and additional proven damage.
- Article 205: only the agreement for the excess over 16% annually is void on this ground. The English simple annualization, 2% × 12 = 24%, is correct; the example is marked fictional and does not compound monthly.
- The [official history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001) confirms promulgation of the article 205 amendment on 2021-01-20 and effect six months after promulgation. [Article 36(5)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000003&flno=36) identifies the 2020-12-29 revision. The two dates are not confused. Article 10-1 is correctly limited to interest arising after the amendment took effect, including under older agreements. No unsupported former ceiling is stated. The database's pending-provision notice concerns other articles, not these loan provisions.
- Articles 206/207: disguised benefits, written agreement, interest overdue more than one year, demand followed by nonpayment, and the commercial-custom exception are retained. The fee illustration is labeled as an illustration, not a judgment.
- Article 204: above 12% annually, after one year, one month's notice, and a right that cannot be removed or restricted by contract. EN now distinguishes this general early-repayment right from its example's six-month maturity. The earlier misapplication has been corrected.
- Article 477: all four versions now retain the absence of an agreed interest-payment date when explaining the termination/year-end alternatives. The previous conditional omission is corrected.
- Articles 229/478: the general branches are accurately reproduced; L2 concerns the written-date shortcuts used when applying those branches, not the correctly stated general paragraphs.
- Code of Civil Procedure article 277: ordinary burden of proof and both exceptions are stated. The transfer record / repayment agreement distinction does not guarantee that any single document proves the claim.
- Article 480: contractual priority and its three currency branches are present, including repayment-time/repayment-place market price. Each language keeps this within two sentences.
- Code of Civil Procedure article 508(1): payment-order eligibility is stated without invented filing periods, fees or outcomes. The former technology paragraph has been removed. Small claims are named and linked without developing their procedure.

## 2. Citations

All 18 official source URLs resolve to the relevant official materials. Source sections include every official URL used and the required 2026-10-13 check date. The English Act name matches the official English title. No judgment citation or private-party name appears. Internal links pass the supplied existence check in the correct language: two each in KO/JA/EN and three in ZH; none points to another column of this batch.

The previously missing links in the service/default and loan-proof paragraphs are now present. One smaller placement correction remains under the literal inline-citation rule:

### C1 — EN/JA: isolated legal propositions without a local inline link

Original → `en.md:49`: “Return of the same quantity is what paragraph 1 describes. Lending the sum does not fill in an interest term.” `ja.md:50`: “利息の欄が空白でも、貸しただけで利息は付きません。”

Problem & reason → These are standalone paragraphs asserting legal propositions, with no inline source in the paragraph. Relevant sources appear in the preceding or following paragraphs, but batch rule 2 calls for the link immediately with the claim. A sources list does not substitute for that placement.

Fix required, not applied → Integrate these statements into the corresponding sourced formation/interest paragraph, or attach the existing relevant article 474/203 links directly. Do not duplicate prose merely to carry a citation. This is a placement issue, not a finding that the general propositions lack statutory support.

Facts preserved → Keep the distinction between a duty to return the amount and an independent basis for interest; retain both statutory conditions and all source URLs.

## 3. Batch and topic rules

Frontmatter is structurally correct in all four versions, including `author: "legal-ai-assistant"`, `topic: "litigation"`, the language-only audience, dates, categories, three FAQs and the literal NNN image path. EN title is 41 characters and 56 with ` | Hovering Law`; omitting seoTitle is correct. EN summary is exactly 160 characters and has none of the prohibited characters. Read-time values are plausible for these lengths.

No bold, telephone/hotline number, messaging ID, street address, attorney byline, lawyer-review claim, native-review claim, invented professional experience or real private-party name was found. Each language has one short email-only contact paragraph. LINE is the messaging service mentioned in the hypothetical, not a contact ID. The scenarios are expressly fictional; the secondary fee example is expressly illustrative. Foreign-law notes now refer readers to a local professional, which is the alternative expressly permitted by batch rule 10; no foreign rate, foreign court practice or unsourced conflicts rule is asserted. Criminal law, banking regulation, tax and shareholder loans are not developed.

### R1 — ALL: the topic's one-sentence limitation boundary remains unmet

Original → `ko.md:80`, `ja.md:82`, `en.md:79`, `zh-hant.md:78` each use two sentences: one for the principal claim and one for periodic interest claims. Examples: “원금 청구권은 15년간 행사하지 않으면 소멸합니다. 이자처럼…” and “原本的請求權十五年不行使就消滅。利息這種…”.

Problem & reason → `topics/C5.md` expressly says “Time limits in one sentence only.” All four currently use two. The fact sheet calls this one sentence, but the drafts themselves control. This is a small scope/format correction; EN also needs substantive correction under L1.

Fix required, not applied → Combine the two claim-period statements into one sentence in each language, with both article links. In EN, make L1's correction in that same sentence. Do not add discussion of interruption, suspension or litigation strategy here.

Facts preserved → Fifteen years, five years, the claim as the legal subject, the per-instalment distinction and article 125/126 citations must remain.

## 4. Native prose and editorial voice

Titles identify the particular topic without clickbait or imperative checklist framing. KO maintains 합니다체; JA maintains です・ます. ZH uses traditional characters and Taiwan legal terminology, with no identified Mainland vocabulary. Those checks do not cure the recurrent unnatural prose below. These are editorial publication blockers under batch hard rule 6, distinct from the numerical sentence-variety gate.

### V1 — KO: repeated source-reporting sentences and unnatural legal subjects

Original → `ko.md:30`: “제1항이 그 계약입니다.” `:34`: “숫자는 …에 있습니다.” `:36`: “제1항의 순서입니다.” `:60`: “약정 기한과 기한이 없는 경우 모두 …입니다.” `:70`: “그 경로에서도 유리한 사실의 증명은 …가 주장하는 사람에게 둡니다.”

Problem & reason → A paragraph is not a contract, and a statutory article does not naturally act as the subject of “증명은 … 둡니다.” Repeated sentences saying where a number, rule or sequence appears turn the article into a report about source text. They add little reader information and interrupt otherwise connected explanations. This pattern persists across formation, interest, repayment and proof; it is not one isolated typo.

Fix required, not applied → State the legal rule directly and attach its source. For example, use “민법 제474조 제1항은 이를 소비대차로 정의합니다” with the existing link. Attach the article 203 link to the complete 5% conditional sentence instead of adding “숫자는 …에 있습니다.” In the conversion paragraph, make the person asserting the favorable fact the subject of the proof obligation. Revise the corresponding source-location filler throughout, preserving each source rather than deleting it.

Facts preserved → The formation elements, the three conditions behind the 5% rate, ordinary-loan versus conversion routes, article 277's exceptions and every cited article must remain.

### V2 — JA: translated collocations and evidence prose that does not answer its own question

Original → `ja.md:72`: “その経路でも、有利な事実の立証は…が主張する側に置きます。” `:76`: “紙は、返還の約束を書いたものです。” / “返済日と署名の側の文面で分かれます。” `:84`: “送達までの期間と異議は、ここでは解きません。”

Problem & reason → “立証は…条が…置きます”, “署名の側の文面” and using “解きません” for the scope of procedural explanation are unnatural Japanese. After asking whether a signed IOU is enough, defining paper and repeating that it fixes a promise on paper obscures the useful distinction between the repayment agreement and delivery of the money. Similar source-location commentary recurs in the interest sections.

Fix required, not applied → Use the claimant as the grammatical subject: “既存の債務を消費貸借に切り替えた場合も、自分に有利な事実は主張する側が立証します”, retaining the existing source and exceptions. Explain what the repayment wording and the delivery record each help establish without saying a signature guarantees proof. Replace procedural “解きません” with natural scope wording, or remove that preview while keeping the related links. Keep です・ます throughout.

Facts preserved → Retain the cash-payment hypothetical, the blank interest field, fictional label, distinction between proof of delivery and agreement, conversion route, burden exceptions and all links. Do not convert the fictional cash payment into a bank transfer.

### V3 — EN: serial meta-commentary and formulaic source sentences

Original → `en.md:31`: “Promulgation and effect sit in…” / “The subject is Article 205. Effect is six months after promulgation.” `:33`: “Interest that had already arisen before the amendment took effect is outside that sentence.” `:57`: “The date, and that no-date case, are Article 477.” `:59`: “The agreed term and the open term are both Article 478.” `:73`: “The signature is a mark on a promise someone wrote down.”

Problem & reason → Dates and cases are not articles. “Sit in”, “outside that sentence” and “the open term” make the reader decode the writer's source-reading process. The generic explanation of a signature contributes no useful evidence analysis. Repetition of “the rule is this article” across sections remains formulaic despite varied sentence lengths. FAQ 2 also uses present “takes effect” for an amendment already effective long before the stated publication date.

Fix required, not applied → Describe the amendment's promulgation and commencement directly, keeping the two distinct dates and relevant history/Act links. State the transition's actual scope once. Attach articles 477 and 478 to the rules they support, removing the separate sentences equating legal rules with article numbers. Make the evidence paragraph answer what the IOU establishes and what delivery evidence remains to be examined. Use past tense for the completed commencement. Preserve the six-month example and do not imply that a missing attached transfer slip proves no money was advanced.

Facts preserved → Preserve all dates, the six-month commencement interval, post-commencement interest under older agreements, payment-date conditions, the hypothetical's maturity/rate and all citations. The English body is already 1,589 words against a 1,600-word ceiling; revisions must replace filler, not simply add explanations.

### V4 — ZH-HANT: unnatural descriptions of evidence and statutory text

Original → `zh-hant.md:32`: “主張的人要讓人看見兩件事。” `:36`: “那一句是對方打的字。” / “周轉兩個字，和下個月還來的那句，都在同一個畫面上。” `:44`: “第1項是這句。” `:52`: “施行前已經發生的利息，沒有另寫。” `:58`: “沒有法院的結論。”

Problem & reason → The reader needs to know what to prove and what the message records. “讓人看見”, “對方打的字” and “還來的那句” are vague or unnatural in this context. Repeated commentary that a paragraph “is this sentence” or did not write another sentence is research-note prose, not a clear Taiwan-facing explanation. “沒有法院的結論” is also less clear than an ordinary illustration label.

Fix required, not applied → Use ordinary Taiwan phrasing such as “要證明兩件事” and explain the message's repayment promise directly. For example, describe the message promising to repay the same amount next month and the transfer record's date/amount as different evidence, without guaranteeing sufficiency. Link article 233 directly to its rule instead of saying “第1項是這句.” Explain the transition's scope once; retain an ordinary “說明用的例子” label for the fee example without an unnecessary claim about court conclusions.

Facts preserved → Keep the LINE/transfer hypothetical, next-month repayment wording, hypothetical label, ownership/agreement elements, existing-debt route, article 277 exceptions, the post-commencement boundary and all links. Preserve the interest-versus-default distinction and the commercial-custom exception.

### First-two-paragraph deletion check

This check includes the first two substantive prose paragraphs, skipping headings. No deletions were applied.

- KO: the first sentence supplies the transfer/operating-funds context; the absent IOU and message-based repayment promise matter. “돈은 상대 계좌에 있습니다” largely repeats the completed transfer. In the next paragraph, “제1항이 그 계약입니다” can be replaced by a citation attached to the definition without loss of substance. Preserve the hypothetical label and article 474(2).
- JA: the opening identifies the IOU, maturity, signature, blank interest field and cash-payment notation; the tiny-margin detail is decorative. In the next paragraph, the last sentence repeats the excess-only effect already stated first. Merge that repetition while retaining the article 205 link and principal/within-cap distinction.
- EN: the opening's rate, six-month maturity, fictional label and missing transfer slip matter. “A signature closes the page” repeats that the note is signed. In the next paragraph, “The excess fails” repeats the immediately preceding article 205 rule. Preserve the arithmetic, principal and within-cap interest treatment.
- ZH: the opening supplies the transfer, purpose, message-based repayment promise and absence of a receipt; the hypothetical label remains necessary. The next paragraph's burden and both exceptions are substantive. Its final phrase about placing the responsibility and exceptions together can become an ordinary citation to the rule.

The current closing paragraphs return to this loan's repayment terms and interest cap; they are not copied generic disclaimers. L2 still requires correcting the written-date shortcut in the JA/EN closings.

## 5. Sentence-variety checks and manual sections 5–6

Executed the required command separately on each file:

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1013-work/drafts/C5/<lang>.md`

| Language | Sentences | Length CV | Very short sentences | Short share | Checker result |
|---|---:|---:|---:|---:|---|
| KO | 91 | 0.509 | 11 | 0.121 | Exit 0; no FAIL; 97% 합니다-ending WARN |
| JA | 94 | 0.565 | 22 | 0.234 | Exit 0; no FAIL; 98% です・ます-ending WARN |
| EN | 99 | 0.648 | 23 | 0.232 | Exit 0; OK |
| ZH-HANT | 93 | 0.611 | 13 | 0.140 | Exit 0; OK |

Manual check:

1. No checker FAIL in any language. WARNs are not silently promoted to FAILs.
2. Each opening is a labeled scene without the forbidden stock hypothetical first-word formula. C5's opening type differs from available C1–C4 in the corresponding language. C6 is uncheckable because its drafts are absent.
3. Every file has at least two very short sentences. No consecutive long-sentence pair was found under the checker's language-specific long-sentence thresholds. Some short sentences are still filler, as identified in V1–V4; numerical compliance is not a naturalness certificate.
4. No paragraph opener occurs three times. Maximum is two in every language, including the stricter manual count rather than the tool's long-column allowance.
5. No three consecutive claim–citation–caveat paragraphs. Each file has citation-free scene/question/evidence paragraphs.
6. No excess contrast-template count or separate finding of an invented reader position. The relevant distinctions between the whole loan and excess interest, between an IOU and delivery evidence, and between an IOU and promissory note relate to this topic. The former irrelevant rebuttals about what the statutes do not enumerate have been removed.
7. Each final body paragraph is tied to the loan facts, rather than ending in a copied disclaimer or generic sales line.
8. KO/JA register is consistent; no bold, fabricated first-person professional experience or imperative checklist heading was found.
9. No reviewer edits were made, so no number, condition, citation or fictional label was removed.

Result: no threshold-triggered MONOTONY FAIL on the current text. The independent native-prose and repetitive source-reporting problems in V1–V4 remain publication blockers under the editorial brief; this log does not misreport them as a failed numeric test or as two unmet self-check items.

## 6. Lint, internal links and edit record

Executed the required lint command on all four current files:

`python3 /Users/son7/tseng-col-1013-work/lint.py /Users/son7/tseng-col-1013-work/drafts/C5/<lang>.md <lang> taiwan-private-loan-interest-cap-iou-repayment`

| Language | Exit | Result | Body length |
|---|---:|---|---:|
| KO | 0 | OK | 3,127 characters, without spaces/URLs |
| JA | 0 | OK | 3,312 characters, without spaces/URLs |
| EN | 0 | OK | 1,589 words |
| ZH-HANT | 0 | OK | 2,600 characters, without spaces/URLs |

Minor edits applied: none. The legal corrections were not silently applied; the recurring prose issues need a coordinated writer revision. This review creates only this log. No image, draft, fact sheet, publication marker or previous review was changed.

Reviewed draft SHA-256 values:

- KO: `436fd327326232a28a06e32993075bff0a809bdcf9b4eeaadbbeaaf89ba3a645`
- JA: `c0cfddc6ece87f9929e3322c9705cfbf8fd7e1cffddbc3203b784be2e26cc2c1`
- EN: `fc23d378c5906dcfc46a525f87cc68c2f111dc9c817664dd4007400561b34458`
- ZH-HANT: `9fb240154de63a2336141c4871d4cabe9344a58db297f3c844165d755b5e698c`

## 7. Image

Image verdict: REDO — delivery artifact only. The available artwork itself is OK.

Original → Required `images/C5.webp` is absent. `images/C5.jpg` is present and was actually viewed with the image tool.

Problem & reason → The JPG shows an abacus on a worn counter, a closed wooden box, tea jars, and an unidentifiable hand/forearm in a linen sleeve. It fits the money/accounting subject, is respectful and has no visible face, readable writing, logo, flag or readable document. There is no visible identifying detail. Its appearance is consistent with an illustrative fictional scene; I do not infer a real person's identity or a real transaction. However, this does not verify a WebP file that does not exist.

Fix required, not applied → The coordinator should supply the WebP export of this accepted artwork at the requested delivery path and inspect that exact export. No new composition is needed on the visual evidence. The source JPG was not converted or replaced during this review.

Facts preserved → The accepted nonidentifying composition remains unchanged; the correction concerns the delivery file and its verification.

## Publication disposition

KO requires the editorial and scope corrections; JA/EN require substantive legal corrections as well; ZH requires the repayment-condition wording and editorial/scope corrections. The four-language package and requested image delivery therefore remain unapproved. Round-1 fixes that are now correct are acknowledged above and are not reopened without a current-text reason. As this is the second final-review round, the batch's two-round limit means the coordinator should hold the item rather than publish it as is.

VERDICT: FIX
