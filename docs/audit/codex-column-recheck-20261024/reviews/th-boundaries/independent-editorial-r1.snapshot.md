# Thai ARC revision — independent review r1

Verdict: REQUEST_CHANGES for 704, 705 and 706. The rewrite is materially clearer than the published baseline, but five bounded prose/scope repairs and the 704 measured CV failure remain. Sentence-boundary approval is a separate APPROVED result; it is not approval of the articles.

Reviewer: `/root/review_rev2_th`, independent AI Thai editorial reviewer. I did not author or edit these articles. This is not human native-speaker or lawyer certification. I read the three originals at `174454bd4bb8d9e05627d71f9ef0af646540b3e4`, the three revised files in full, the author report, the full referenced voice/variety/review rules, the source refresh and the Thai measurement contract. I viewed all three final WebP illustrations. Only this report and my independent boundary/evidence artifacts were written.

## Reviewed versions

All paths below are relative to `/Users/son7/tseng-arc-revision-20261024/repo`.

| Article | Exact source SHA-256 | Editorial verdict | Boundary verdict | Actual CLI |
|---|---|---|---|---|
| `src/content/columns-th/704-taiwan-arc-first-application.md` | `141a09903d5dbb0d709a88de9952591955277211e0b92b5822512206157bef7b` | REQUEST_CHANGES | APPROVED r1 | exit 1, CV 0.437 |
| `src/content/columns-th/705-taiwan-visa-residence-work-study-family.md` | `d4ac78d3ec10dc00d41e4227db88562736b690136c9f6f462f323c791b8a1aa6` | REQUEST_CHANGES | APPROVED r1 | exit 0, no FAIL |
| `src/content/columns-th/706-taiwan-arc-renewal-changes-reentry.md` | `587aafb44969ffe17ce8c81c7b41796caf85ef3a59beb64a11f781454042a035` | REQUEST_CHANGES | APPROVED r1 | exit 0, no FAIL |

## Required bounded repairs

| File:line | Exact sentence or necessary span | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| `705-taiwan-visa-residence-work-study-family.md:23` | `ผู้ติดตามยังต้องมีฐานอนุญาตทำงานหรือข้อยกเว้นที่ใช้กับตนด้วย` | The FAQ asks whether a spouse may accompany the resident. This unconditional last sentence can make work authorization sound like an additional requirement for dependent residence. The original correctly distinguished residence from work rights; Article 16 paragraph 2 permits qualifying family residence, while employment authorization is a separate issue. | `หากผู้ติดตามต้องการทำงาน ต้องมีใบอนุญาตหรือเข้าข้อยกเว้นที่ใช้กับตน` | Restores the original conditional scope. This is a scope correction to the revised FAQ, not merely synonym replacement. The author agrees. |
| `705-taiwan-visa-residence-work-study-family.md:52` | `สำหรับผู้ที่เข้าเมืองด้วย Visitor Visa ซึ่งระบุวัตถุประสงค์เพื่อการศึกษาต่างชาติยื่นขอพำนักต่อ NIA ได้เมื่อเข้าเงื่อนไข` | สำหรับ makes the purported subject a prepositional phrase, then the sentence runs directly into ยื่น. It reads like a translated template with a missing main subject. | `ผู้ที่เข้าเมืองด้วย Visitor Visa ซึ่งระบุวัตถุประสงค์เพื่อการศึกษาต่างชาติยื่นขอพำนักต่อ NIA ได้เมื่อเข้าเงื่อนไข` | Yes. Removes only สำหรับ; visa purpose, NIA and eligibility conditions remain. |
| `705-taiwan-visa-residence-work-study-family.md:28` | `การเตรียมเอกสารให้ตรงตั้งแต่ก่อนเดินทางจะทำให้ทราบว่ายื่นขอพำนักในไต้หวันได้ด้วยเงื่อนไขใด` | MONOTONY: generic usefulness statement — this sentence repeats the paragraph's instruction to match the route and documents, without adding a condition or action. The deletion test leaves nationality/passport/entry method/residence basis and the document examples intact. | Delete this sentence. Keep the preceding two sentences. | Yes; no legal proposition, source or number is removed. |
| `706-taiwan-arc-renewal-changes-reentry.md:57` | `ที่อยู่ต้องตรงกับที่พักจริง` | MONOTONY: redundant short sentence — the same paragraph already requires new-address evidence such as a lease or proof of actual residence. The detached repetition reproduces the short-filler problem the user rejected. | Delete the sentence; retain the full preceding document-and-filing sentence. | Yes; actual-residence evidence remains explicit. |
| `704-taiwan-arc-first-application.md:90` | `มาตรา 43 แห่งกฎหมายบริการจัดหางาน วางหลักนี้ไว้` | MONOTONY: source metacommentary — the preceding sentence already states the work-permission/exception rule. A second sentence saying that a statute sets that rule adds no legal information. | `สิทธิทำงานต้องมีใบอนุญาตหรือข้อยกเว้นตาม[มาตรา 43 แห่งกฎหมายบริการจัดหางาน](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) นักศึกษาและผู้ติดตามจึงเริ่มงานโดยอาศัยเพียง ARC ไม่ได้` | Yes. Keeps the rule, exception, source and practical limitation; removes only metacommentary. |

In addition, 704 has one measured HARD failure: `len_cv=0.437 < 0.45`. Do not retain the metacommentary or insert a hollow short sentence to satisfy this number. A meaningful paragraph repair is available at line 84: put the general ceiling in one compact, sourced statement and connect the individual decision with the fee consequence: `เพดานทั่วไปคือสามปีตาม[มาตรา 22](same URL) NIA จะกำหนดอายุบัตรของผู้ยื่นแต่ละรายจากเหตุผลการพำนักและเอกสาร จึงเลือกอายุบัตรสามปีด้วยการชำระค่าธรรมเนียมเพิ่มเพียงอย่างเดียวไม่ได้`. This preserves the three-year ceiling, individual assessment and lack of a fee-based entitlement. It is a proposed substantive paragraph rhythm improvement, not a promise that a particular score will pass. The author should read it naturally, regenerate exact slices after the repairs and return the final hashes. If the unchanged metric still conflicts with clear prose, report that conflict rather than distort the text.

Optional clarity, not another release blocker: in 705's opening, `เมื่อใบอนุญาตทำงานและคุณสมบัติครบตามเกณฑ์` can explicitly include permit exemption (`เมื่อมีใบอนุญาตทำงานหรือเข้าข้อยกเว้น และมีคุณสมบัติครบตามเกณฑ์`). The full Article 16 paragraph already includes the exemption, so this is not a missing rule in the article as a whole.

## What the rewrite actually improves

- 704 replaces `ชื่อเมนูต้องตรงกับสถานะ ... ให้ตรวจประเภทคำขอ` with a paragraph explaining that the current employment basis determines the application category, followed by real filing channels. The reader learns why a former student uses a work route. The generic four-step checklist is replaced by documents, receipts, supplements and collection in their actual context.
- 705 removes the detached `ต้องเข้าเงื่อนไขครบ` and places the conditions inside the Article 16 rule. The Chinese-study section now explains the need to keep immigration status valid while waiting for the study period to accrue; it no longer says only `ดูวันสิ้นสุดการอยู่ด้วย`.
- 706 removes `เส้นทางเฉพาะต้องดูช่วงยื่นของตน` and begins with the actual Entrepreneur four-month filing window and Mandarin-study six-month extension cap. The new-passport paragraph connects changed data, NIA updating and required documents instead of interrupting itself with `เตรียมหนังสือเดินทางใหม่`.
- Titles, headings and FAQ generally use specific Thai questions and actions. They do not copy a three-part checklist structure. Legal negative statements remain where they prevent an actual eligibility or timing error; I did not demand indiscriminate removal of ไม่ or ควร.
- The remaining findings above are actual sentences, not an AI-detector judgment. 705 and 706 pass the numeric tool and still require these prose repairs.

## First-two-paragraph deletion test

704: the first sentence supplies the eligible group, 30-day filing duty and day-after-entry start; the second preserves the combined-document exception. Neither can be deleted. Paragraph two supplies the visitor/visa-exempt eligibility distinction and Thai trial-program constraint. Its final non-entitlement clarification is relevant to the opening deadline; retaining it is defensible because the two statuses are easily confused. No generic scene or prediction is added.

705: the opening question gives a concrete entry decision after admission/employment acceptance. The next rules distinguish study entry purpose from a professional direct-residence route. Paragraph two's nationality, passport, entry method and residence basis add decision inputs, and the named documents explain the type of evidence. Its final generic usefulness sentence fails the deletion test and must be removed as above.

706: the first paragraph states the address/workplace change duty despite a still-valid card, with the day-after-change start. The second adds the different three-month renewal window and loss-of-basis issue before printed expiry. Removing either loses an independent procedural trigger. These openings differ from 704's filing rule and 705's visa-choice question.

## Independent comparator read

I independently opened the actual comparator sources, rather than accepting the author's descriptions. All three were published 2026-10-23.

| Actual same-locale source | Opening / headings / ending observed | Comparison |
|---|---|---|
| `src/content/columns-th/661-thai-worker-taiwan-bank-account-police-notice.md` | Opens with `通知書 หรือ 告誡處分書?`; headings distinguish account delivery, Thai chats and police interview language; ends on the notice and evidence identifying account control. | The ARC articles do not reuse the police-document framing. 705's question is about entry choice, while 704/706 start on actual administrative duties. The comparator's long contact paragraph is not a model to copy. |
| `src/content/columns-th/662-thai-return-home-taiwan-traffic-injury-records.md` | Opens on thirty days after an accident and arranging delivery after the return flight. Headings distinguish police-record timing, authorization and later medical evidence. The substantive ending names the agency, application number and forwarding person. | 704's 30 days is a filing limit, not a record-availability date. 706's return-flight issue concerns reentry documents. Endings are tied to those distinct procedures and do not reuse the accident checklist or its contact paragraph. |
| `src/content/columns-th/663-thai-supplier-taiwan-buyer-unpaid-invoice.md` | Opens on different buyer/importer/warehouse names. Headings ask who owes payment, limitation and court procedures. It ends on the purchase order, receipt and proven due date. | ARC documents are grouped by residence basis, rather than borrowing debt-evidence rhetoric. 704 ends with card data, 705 with the selected residence application, 706 with current travel documents. |

The comparators themselves contain imperatives and standard disclaimers. Their existence does not excuse generic or repetitive prose in the new articles.

## Sources, numbers, conditions and images

`th-boundaries/independent-preservation.json` records original/current hashes and URL/numeral sets. All three preserve all 16 original unique linked URLs, including internal links, with no additions or deletions. In 704 the removed Arabic numerals 1, 2 and 4 were ordered-list labels; the new 20261024 token is in the image path. Thai-written values were read manually.

704 retains both distinct 30-day starts, the combined-document exception, two-year photo age, relevant one-month certificates, first Taiwanese-spouse card year/attendance condition, conditional worker recruitment authorization, authentication/translation, middle-skilled-worker channel restriction, 512 KB student cap, student payment within five working days and collection after three working days from payment, NT$1,000/year with rounding, conditional NT$2,200, limited overseas-Chinese-student discount, general three-year ceiling and ten/five-day processing with exclusions/restarts.

705 retains Thai 14 days, 31 July 2027, diplomatic/official exclusions, six-month passport validity, onward/return/accommodation/contact/funds conditions and day-after-entry counting, trial-waiver constraints and statutory exceptions, professional/worker routes, study purpose and evidence, four months plus at least three months Mandarin enrollment, Monday–Friday fifteen hours and absence including leave at most a quarter, sixty-day-plus qualifying visitor route, household registration, eligible family categories, spouse employment exception, Gold Card functions and entrepreneur conditions. The FAQ scope defect identified above must be repaired even though the body preserves the distinction.

706 retains three-month general/four-month Entrepreneur filing windows, six-month Mandarin cap, one-month certificates, NT$1,000 and NT$500, five/ten working days, 30 days from the day after address/workplace change, 30 days from the event for eligible direct reason changes and the alternative 15-day BOCA route, conditional continued residence after loss of basis, passport updates without borrowing an unrelated deadline, overseas replacement and old-card exceptions, permanent-residence reentry exception, and the limits of a receipt/photo or e-Gate history.

I read `work/research/source-refresh.md` and independently opened these official pages on 2026-10-24: [Immigration Act Article 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22), [Article 31](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31), [BOCA domestic Resident Visa deadline](https://www.boca.gov.tw/fp-398-723-7b71f-1.html), [BOCA visa exemption](https://www.boca.gov.tw/cp-149-4486-7785a-2.html), [BOCA Mandarin residence](https://www.boca.gov.tw/fp-166-285-041cb-2.html), [NIA 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news), [Foreign Professionals Act Article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16), and [Employment Service Act Article 48](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48). They support the reviewed deadlines, Thai visa figures, Mandarin thresholds and residence/work distinction. This locale review does not claim a second full live legal audit of every administrative detail; the dedicated source-refresh/final review remains separate.

All three WebPs were visually inspected: 704 has a blank travel booklet, folder/papers, plain card and pen; 705 a closed laptop, books, two mugs and a travel booklet; 706 an open blank notebook, travel booklet, plain card, keys and travel bag. Taipei is visible through the window. The Thai alt/captions accurately describe the principal objects and state the illustrative nature. No people, official card replica, readable official documents, flags or logos are visible. There are no duplicate inline images.

Internal author metadata, article numbers/routes/publication dates remain. No public authorship, fake native/legal review, extra consultation language, invented client story, bold or promotional closing was added.

## Boundary adjudication and unchanged CLI

I did not rubberstamp the draft maps. Eleven new-subject/new-condition boundaries were proposed and agreed by the author: 704 P5/P17/P19, 705 P2/P8/P14/P18, 706 P1/P4/P7/P9. The full independent boundary report and exact binding chain are `th-boundaries/independent-boundary-review-r1.md`, `independent-approval-r1.json`, and `704/705/706-independent-r1.sentences.json`. Author reports/adjudications, original draft-map hashes, exact full-source hashes and canonical paragraphs hashes are recorded and bound. All normalized paragraph text is preserved. The task disclosed provisional scores in advance, so this was not blinded review; linguistic reasons, not target scores, determined the eleven repairs.

Executed for each article:

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <exact article path> --sentences <work/reviews/th-boundaries/NNN-independent-r1.sentences.json>`

| Article | Sentences | CV | Short share | Even runs | Citation ending share | Contrast | Exit / result |
|---|---:|---:|---:|---:|---:|---:|---|
| 704 | 49 | 0.437 | 0.082 | 0.000 | 0.000 | 1 | 1 / FAIL CV |
| 705 | 55 | 0.467 | 0.091 | 0.000 | 0.000 | 2 | 0 / no FAIL |
| 706 | 59 | 0.454 | 0.102 | 0.070 | 0.000 | 3 | 0 / no FAIL |

Exact commands/stdout/stderr and hashes: `th-boundaries/independent-cli-r1.json`. Before approval I also ran all three original author maps; each correctly returned exit 2 for unresolved review, recorded in `independent-unapproved-cli.json`. No shared checker/profile/threshold was changed.

## Section 5 independent check

1. Numeric limits: 704 fails CV; 705/706 pass only the measured variety check, not editorial readiness.
2. Openings: no stock hypothetical, no invented scene; filing duty, entry-choice question and address-change event give different focal points.
3. Meaningful short sentences exist in each, but the 706 repeated address sentence and 704 metacommentary need repair. Their short length does not excuse them. Source slices do not contain severed conditionals or arbitrary mid-clause cuts.
4. Paragraph starts were read vertically; no generic instruction opener is used three times. The dominant lexical paragraph opener appears at most twice in each article in the reviewed r1 text.
5. No three consecutive claim–citation–caveat template paragraphs; citation-free submission, receipt and practical document paragraphs remain.
6. The counted contrasts are within limits. Necessary legal restrictions are retained; the findings target generic prose, not genuine conditions or exceptions.
7. The last substantive paragraphs stay on card data, the selected residence application and travel documents. Source dates/scope are structural tails, not a copied sales ending.
8. Professional Thai throughout, subject error noted above. No bold, invented first person, human/AI byline or imperative checklist headings. Korean/Japanese register tests are inapplicable.
9. Numbers, source links and legal conditions preserved except the identified FAQ ambiguity requiring explicit conditional restoration.

Next bounded step: author applies the five listed repairs and a coherent 704 paragraph rhythm repair, regenerates source-bound draft maps and returns final hashes. I will recheck the changed passages, affected endings/FAQ and boundary bindings, then run the unchanged CLI again. Any remaining legal/source ambiguity or metric conflict will stay explicit. This report does not claim publication readiness or deployment.

## Additional legal correction from the independent final Asia review

After this r1 review, `/root/final_rev2_asia` supplied a root-authorized Article 16(2) correction at 705 line 70. The qualifying sponsor is an ordinary foreign professional currently performing professional work in Taiwan, or a foreign special professional; either must already have NIA residence/permanent residence. The qualifying relatives must also enter visa-free or on a visitor visa. The linked official Article 16 explicitly states these conditions. This is a substantive completeness correction, including an omission already present in the baseline, not a style-only change. It is included in the same bounded author repair and must be checked in the new exact manuscript/hash/map. The r1 source/number-preservation finding does not waive it.
