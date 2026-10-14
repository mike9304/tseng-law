# C5 final review — round 3

Verdict: FIX. Two substantive legal-wording issues remain in zh-hant. They were not edited. Nine minor wording edits were applied in KO/JA/EN; all four final files pass lint and have zero sentence-variety checker FAILs. Image: OK.

## Scope checked

Reviewed on 2026-10-14 (Asia/Seoul). Read in full `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C5.md`, all four `drafts/C5/<lang>.md` files, `drafts/C5/facts.md`, and `research/C5-statutes.md`. Review includes frontmatter, summaries, FAQs, headings, body and source lists. The writer's fact sheet was a claim inventory, not verification evidence.

Read the shared `SENTENCE-VARIETY-RULE.md`, including sections 5–6, and the recurring findings in `LESSONS.md`; also read `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md` and `/Users/son7/Projects/tseng-law-columns-20261013/docs/columns/EDITORIAL-VOICE.md`. The requested `~/agent-library/knowledge/editorial-voice.md` is absent on this machine. The supplied full editorial brief and repository editorial file supplied the rules; this is a disclosed path limitation, not a claim that the missing file was read. The current direct request authorizes this round-3 Astra review, superseding the batch's older model/round-routing instructions. No Fable approval was sought or required.

Independently opened with curl all 18 distinct official URLs cited by the drafts: Civil Code articles 125, 126, 203–207, 229, 233, 474, 477, 478, 480; Obligations Enforcement Act articles 10-1 and 36; Code of Civil Procedure articles 277 and 508; and the Civil Code amendment history. All returned HTTP 200. Read the complete returned provisions, including later paragraphs and the three currency branches, and compared them with the research file. Additionally opened Code of Civil Procedure article 222, Civil Code article 144, and the official English Obligations Enforcement Act. No column cites a judgment; there was no cited judgment text to open.

Fetched HTML, extracted text, URL manifest, before-edit copies, exact edit diffs, hashes and checks are in `/private/tmp/c5-final-astra-r3-evidence/`. The image at the exact requested path, `images/C5.webp`, was viewed directly with the image tool. The previous review and writer's fix3 notes were read after the current drafts and primary sources, and were not treated as authorities.

## 1. Law and facts

### L1 — MAJOR, ZH-HANT: an unsupported finding that one item of evidence cannot prove the loan

Original → `drafts/C5/zh-hant.md:36`: “單靠其中一項，消費借貸還沒有證明完。” This follows descriptions of the transfer record and the LINE message, in the answer to “LINE那一句就夠了嗎？”

Problem & reason → This concludes that either item alone is insufficient. [Civil Code article 474](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=474) supplies the loan's elements, and [Code of Civil Procedure article 277](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=277) allocates the burden, with exceptions. Neither establishes a minimum number of documents or makes each kind of evidence incapable of addressing both delivery and agreement. The draft does not supply an official holding supporting its conclusion, even for this illustration. [Article 222](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=222) instead provides for evaluating the arguments and investigated evidence, subject to statutory exceptions and rules of logic and experience. The two elements to prove must not become a mandatory two-document rule. This categorical insufficiency conclusion is also stronger than the corresponding KO/JA/EN passages.

Fix required, not applied → Remove the categorical sufficiency finding and focus on what the actual contents establish. A suitable direction is: “金錢是否交付、雙方是否約定返還，仍要依資料的具體內容判斷。” Keep the article 474/277 citations with the explanation. If explaining judicial evaluation under article 222, add that official citation inline and in the source list; expansion is not necessary just to remove the unsupported inference. Do not replace the sentence with a guarantee that a single message is sufficient.

Facts preserved → Preserve the transfer, amount/date information, next-month-end repayment promise, lack of an IOU, fictional label, ownership-transfer/agreement distinction, existing-debt conversion route and article 277 exceptions. The assertion of evidential insufficiency is the unsupported legal conclusion being corrected, not an established fact to preserve.

### L2 — MAJOR, ZH-HANT: the currency provision changes the object of the price movement into a time condition

Original → `drafts/C5/zh-hant.md:76`: “約定折合通用貨幣的，不論受領時價格增減，都用返還時有通用效力的貨幣償還”.

Problem & reason → [Civil Code article 480, item 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=480) says “不問借用人所受領貨幣價格之增減”: the increase or decrease is in the price of the currency the borrower received. The draft replaces “所受領貨幣” with “受領時”, making the phrase about price movement at receipt. That temporal restriction is not in the source and obscures the treatment of changes in the received currency's value. KO/JA/EN retain the currency as the object of the increase/decrease; ZH needs to match them.

Fix required, not applied → Replace the affected clause with “約定折合通用貨幣計算的，不論借用人所受領貨幣的價格如何增減，都用返還時有通用效力的貨幣償還”, or an equally accurate rendering of item 2. Retain the existing article 480 link and the other two branches. This changes the legal referent and is therefore left to the writer under the reviewer's minor-edit restriction.

Facts preserved → Preserve contractual priority, the agreed conversion into legal tender, repayment-time legal tender, and item 3's repayment-time/repayment-place market price. Do not introduce a receipt-date exchange-rate rule.

### Legal core checked across all four languages

| Claim group | Official support and result |
|---|---|
| Loan formation and proof | Articles 474(1)/(2) and 277: ownership transfer plus the return agreement for a new advance; conversion of an existing obligation without a fresh advance; no written-contract condition added; ordinary burden and both exceptions retained. ZH's additional insufficiency conclusion is L1. |
| Ordinary interest and default interest | Articles 203 and 233: interest must be payable; no agreed rate and no other statutory rate for 5%; statutory default interest or the higher agreed rate; no default interest on interest; compensation for other proven damage. All four distinguish lending alone from the separate basis for interest. |
| Interest cap and dates | Article 205: only the agreement for the excess above 16% annually is void on this ground. Article 36(5) identifies the 2020-12-29 amendment; the history records promulgation on 2021-01-20 and commencement six months later. The dates are not interchanged. Article 10-1 reaches post-commencement interest under older agreements. No unsupported former cap or exact calendar commencement date is asserted. |
| Arithmetic | EN's 2% per month × 12 = 24% per year is correct simple annualization, not monthly compounding. The hypothetical's six-month maturity is distinguished from article 204's after-one-year early-payment right. |
| Fees, compounding, early repayment | Articles 206, 207 and 204: disguised additional benefits; written agreement, interest overdue more than a year, demand and continued nonpayment; commercial-custom exception; rate above 12%, one year elapsed, one month's prior notice and no contractual removal/restriction of that right. Conditions are preserved in all four. |
| Interest payment and return | Articles 477 and 478: agreed interest-payment date takes priority; absent that date, termination/year-end alternatives; agreed principal-return term or, absent an agreed term, borrower repayment at any time and lender demand with a reasonable period of at least one month. |
| Default and service | Article 229(1)–(3): fixed-date expiry; demand once performance may be claimed; demand-period expiry; service of complaint/payment order equated to demand. No version now treats an empty written date field, by itself, as absence of an agreed repayment term. |
| Currency | Article 480: contractual priority and all three branches present. KO/JA/EN preserve the price-change referent. ZH item 2 needs L2's correction. |
| Limitation | Articles 125/126: principal claim, 15 years; each periodic interest/payment claim, five years. Each version now uses one sentence. EN identifies the claim, not the principal itself, as the subject. Article 144 was also checked; the previous principal-extinction wording is gone. |
| Recovery procedure | Code of Civil Procedure article 508(1): the listed money/fungible-property/securities claim and payment-order route are accurately stated. Small claims are named and linked, without invented fees, service periods or outcomes. |

The Civil Code history's pending-effect notices concern articles 166-1 and 1223, not the loan provisions used here. The research header's 2026-08-17 latest Code amendment is not misrepresented as the date of the interest-cap amendment.

No other substantive legal error was identified in KO/JA/EN. Previous fixes to the written-date condition, EN limitation subject, article 477 condition and existing-debt conversion route are accepted; those corrected issues are not reopened.

## 2. Citations

All 18 cited official URLs resolve, and the pcode/flno pairs match the named provisions. Every official URL used in each body also appears in that version's final sources section; every sources section carries the required 2026-10-13 check date. This review's independent access date is 2026-10-14, not a replacement for the batch's stated check date.

Legal explanations have nearby inline statutory links, including the repaired EN/JA interest paragraphs and the loan-proof/default paragraphs. Article-number continuations in a paragraph refer to the identifiable linked provision. L1 remains an unsupported legal inference despite the surrounding correct citations; it cannot be cured merely by adding a link. L2 is an inaccurate paraphrase of the correctly linked article.

Internal links were checked by the supplied lint against the language-specific repository content: two each for KO/JA/EN, three for ZH. None links to another C1–C6 batch item. No judgment links are used. The English title of the Obligations Enforcement Act matches the official English database.

## 3. Hard rules and intended scope

All four files have the required frontmatter keys, language-only audience, `author: "legal-ai-assistant"`, `topic: "litigation"`, 2026-10-13 publication/modification dates, language-specific display date/category, three FAQs and the literal NNN image path. Read times are plausible. EN title is 41 characters, 56 with ` | Hovering Law`, so omission of seoTitle is correct. Its summary is exactly 160 characters with no forbidden character or URL. Other languages have distinct seoTitle values.

No private-party name, bold markup, phone/hotline number, contact messaging ID, street address, attorney byline, lawyer/native-review claim or invented professional experience appears. Each language has one short firm-and-email contact paragraph. LINE is the service in the fictional example, not a contact ID. Fictional/illustrative labels remain on the loan scenes and fee illustrations. The foreign-law sentence directs readers to a local professional without foreign rates or court-practice claims, as expressly permitted by batch rule 10.

The article stays within ordinary private loans. It does not develop criminal usury/fraud, bank/consumer-credit regulation, tax or shareholder loans. Limitations occupy one sentence per language; article 480 occupies two. Payment orders/small claims are signposted; guarantor/promissory-note questions are left outside the substantive explanation.

## 4. Language and minor edits applied

Titles identify the loan, interest or evidence issue without clickbait or checklist instructions. Openings supply a concrete, labeled hypothetical, not a generic promise of what the article will explain. KO maintains 합니다체, JA maintains です・ます, EN uses understandable direct prose, and ZH uses traditional characters and Taiwan legal vocabulary. This is model editorial review, not a claim of native-speaker or lawyer review.

The following nine local wording edits were applied. They change no legal proposition, number, citation or hypothetical label. Other wording preferences are not elevated into new substantive blockers.

1. KO, line 74: “그 한 줄은 받은 사람이 친 문장입니다.” → the recipient and typing metaphor are awkward → applied “그 한 줄은 돈을 받은 사람이 쓴 메시지입니다.” → preserved that the message was written by the money recipient.
2. KO, line 74: “송금 쪽은 돈이 움직인 날과 금액입니다.” → a transfer record is not itself a date/amount → applied “송금 기록에는 돈이 오간 날짜와 금액이 남습니다.” → preserved the record's date/amount information, with no evidential guarantee.
3. KO, line 74: “반환 약속으로 읽을 글자는 돌려주겠다는 문장입니다.” → unnatural pairing of 글자 and 문장 → applied “돌려주겠다는 문장에서 반환 약속을 확인합니다.” → preserved the repayment promise's wording in this hypothetical.
4. JA, FAQ 1: “貸したという事実だけでは、この条は利息を作りません。” → a statute “making interest” is translated phrasing → applied “貸したという事実だけで、この条に基づく利息の支払義務が生じるわけではありません。” → preserved the limited assertion that lending alone does not create an interest obligation under that provision, without altering article 203's conditions.
5. JA, line 34: “その範囲を施行後に発生する利息債務に置いています。” → unnatural 範囲を…に置く → applied “施行後に発生する利息債務を対象としています。” → preserved post-commencement interest as the transition rule's scope and the existing link.
6. JA, line 40: “金額と約定を見て分けます” → 分ける does not naturally describe this assessment → applied “金額と約定の内容をもとに判断します” → preserved that the amount and agreement determine how the illustrative fee is assessed; no outcome was added.
7. EN, FAQ 2: “after that effect” → unnatural temporal phrase → applied “after it took effect” → preserved commencement as the boundary, not promulgation.
8. EN, line 33: “states that reach” → unnatural description of a provision's scope → applied “sets out that rule” → preserved the immediately preceding transition rule and article 10-1 link.
9. EN, line 41: “is that bar” → opaque shorthand → applied “prohibits this” → preserved article 207(1)'s prohibition and all following written-agreement/custom exceptions.

ZH was not edited. Its L1/L2 corrections affect legal meaning and remain required.

First-two-paragraph deletion check: KO's opening supplies transfer, purpose, absent IOU and message-based repayment; its next paragraph supplies the definition, money-ownership consequence, same-amount return and existing-debt route. JA's opening supplies the cash/IOU facts and blank interest field; the next paragraph separates the excess-only invalidity from principal and within-cap interest. EN's opening supplies the monthly rate, six-month maturity, signature and missing transfer slip; the next paragraph supplies arithmetic and the cap's limited effect. ZH's opening supplies the transfer, LINE promise and absent IOU; its next paragraph supplies the burden and both exceptions. No sentence deletion was needed to remove a generic opening or duplicated preview. Fictional labels were retained.

Compared C1–C6 openings in each language: C5 is the concrete loan scene; the other five use legal facts, numbers, quotations, questions or a misconception. C5 does not repeat a stock hypothetical opener. Also compared available recent local published-column openings/headings/endings (including KO 535/530/526; JA 529/525/516; EN 531/515/507; ZH 539/538/537). C5 does not copy their generic closing notices. This was a local content comparison, not a live publication audit.

## 5. Sentence variety and verification

After edits, ran on each exact final file:

`python3 /Users/son7/tseng-col-1013-work/lint.py /Users/son7/tseng-col-1013-work/drafts/C5/<lang>.md <lang> taiwan-private-loan-interest-cap-iou-repayment`

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1013-work/drafts/C5/<lang>.md`

| Language | Lint | Body length | Variety exit / FAILs | CV | Very short sentences |
|---|---|---:|---|---:|---:|
| KO | OK, exit 0 | 3,061 characters | 0 / 0 | 0.477 | 6 of 75, 8.0% |
| JA | OK, exit 0 | 3,269 characters | 0 / 0 | 0.491 | 8 of 75, 10.7% |
| EN | OK, exit 0 | 1,530 words | 0 / 0 | 0.622 | 14 of 85, 16.5% |
| ZH-HANT | OK, exit 0 | 2,540 characters | 0 / 0 | 0.603 | 11 of 83, 13.3% |

KO has a 95% 합니다-ending WARN; JA has a 97% です・ます-ending WARN. Neither is a FAIL or evidence of register mixing. EN/ZH print “OK — no variety limit violated.”

Manual sections 5–6 check:

- Item 2: no forbidden stock hypothetical first-word formula; batch opening comparison performed as above.
- Item 3: all four have at least two very short sentences. KO/JA/ZH have no adjacent long-sentence pair. EN has a remaining long-sentence run across the article 480 paragraph, the one-sentence limitations paragraph and the first payment-order sentence. This is one partially unmet manual item, not two. Its legal scope constraints and all three currency branches must be preserved in any further shortening; no legal content was cut to optimize the metric.
- Item 4: no paragraph-start word occurs three times; maximum is two in every language, also under the stricter manual rule rather than the tool's long-column allowance.
- Item 5: no three consecutive claim–citation–caveat paragraphs. All four have citation-free opening/question paragraphs; ZH's unsupported legal conclusion in a different paragraph remains L1, not an approved citation-free legal claim.
- Item 6: no excess contrast templates or invented reader claim. The statute's excess/whole-loan distinction and loan-agreement/delivery distinction are germane.
- Item 7: final body paragraphs return to this loan's repayment terms and the interest cap; none ends with a copied general disclaimer or sales line.
- Item 8: KO/JA register maintained; no bold, invented first-person professional identity or imperative checklist heading.
- Item 9: compared before/after diffs and verified identical ordered URL sequences, numeric tokens and hypothetical/illustration-label counts. Legal conditions and exceptions were also manually compared.

Result: no checker FAIL and fewer than two unmet manual items. No threshold-triggered MONOTONY FAIL is asserted. The FIX verdict is based on L1/L2, not a mischaracterization of the variety results. The EN long-sentence run is transparently recorded rather than reported as fully compliant.

Final draft SHA-256:

- KO: `ff5aa89386ab427e52d32ba7af04a21f46cdf1d742de086d797580384dd6db84`
- JA: `5b9877fb93bb28a5ee22edbea44c1111d6a0aa3598e47f65c9451e86efc9a9fb`
- EN: `e4879d6e0abbbb61672bbcf3ea2096b3f7776870225658a516f4bcb47b244038`
- ZH-HANT: `62f82e15dd86bedf975e6dc0226fc5685cfdbdb93e5b94a7f671b61424da86f3`

## 6. Image

Image verdict: OK. Directly viewed `images/C5.webp` (1280 × 720): an abacus, closed wooden box, unlabeled jars, and an unidentifiable hand/forearm on a wooden counter. The calculation/money motif fits the private-loan subject. No face, visible text, logo, flag, readable document or identifying personal detail is present. The fictional illustrative scene is respectful and does not purport to show a particular client or transaction. The previously missing WebP delivery file is now present and was the exact file inspected.

Image SHA-256: `189bf557c073229be827fdc6ec3c88d7c7c9d90baa577739f3b8db6fd9d45ac8`.

Only the nine minor edits in KO/JA/EN and this review log were written in the workspace. No major legal correction, image replacement, source/fact-sheet rewrite or publication action was performed. The four-language package must not be published as is until ZH L1/L2 are corrected and reviewed.

VERDICT: FIX
