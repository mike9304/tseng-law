# Independent Thai locale review — 659–663, round 1

Reviewed 2026-10-23, Asia/Seoul. Reviewer: `review_th`, independent AI Thai-language editorial reviewer. This reviewer did not author these articles and did not edit their content. This is not a claim of human native-speaker review, attorney review, publication or production verification.

Scope: the five frozen files under `/Users/son7/tseng-market-columns-20261023/repo/src/content/columns-th/`, their frontmatter/FAQ, first two paragraphs, headings, prose endings, citations and consultation wording. Read BRIEF, repository AGENTS/EDITORIAL-VOICE/FRONTMATTER, the tseng-law-editorial skill/review criteria, COLUMN-VOICE-RULE, SENTENCE-VARIETY-RULE and LESSONS. Read `research-asia.md` and the completed `th-author.md`. Only this report is reviewer-owned.

## Decisions and exact reviewed versions

These are locale decisions with targeted legal-meaning checks; separate independent final legal review remains required.

| File | SHA-256 | Decision | Required repair |
|---|---|---|---|
| `659-thai-worker-taiwan-payslip-deductions-unpaid-salary.md` | `b842664188dc0d761d9d834a3e2a2839959c3212fe04facb7752847bfe237d68` | REQUEST_CHANGES | Duplicate verb; one redundant introductory unit; repeated paragraph opener |
| `660-thai-worker-taiwan-factory-closure-wage-fund.md` | `7145cb1e17aa6658ce99f8f00d9996c16b0aa5402f9de233ed926811f551f0cc` | REQUEST_CHANGES | Replace enrolment-style สมัคร with claim-application wording |
| `661-thai-worker-taiwan-bank-account-police-notice.md` | `9675e6cae1af453e4116e886b42ec9d7d0d3d652056509d7051af51b9fae67cb` | PASS | No required locale change; optional terminology polish below |
| `662-thai-return-home-taiwan-traffic-injury-records.md` | `d19a3aa7a3c032a880b92abcf80429075e8ca9db9cc6187c35cb43906b9f75db` | REQUEST_CHANGES | Heading must say request eligibility, not document issuance; application wording |
| `663-thai-supplier-taiwan-buyer-unpaid-invoice.md` | `18fbd0f0a46988218114d81ff1c767e4c42693d20ec7f7f087d64afef177485b` | REQUEST_CHANGES | Due-date heading; one short sentence in the dense procedural prose |

All hashes were recomputed from exact file bytes and match the author's frozen record. Findings below use these line numbers. No substantive Taiwan-law error was established in the targeted checks; required changes are bounded locale/clarity repairs. They must be reread and rehashed before a final PASS.

## Required findings

| ID / file:line | Exact sentence or smallest useful span | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| TH659-1 / 659:34 | `กำหนดให้ให้รายละเอียดวิธีคำนวณค่าจ้างแต่ละรายการกับลูกจ้าง` | Duplicate ให้ and an omitted acting subject interrupt an otherwise clear statutory explanation. | `กำหนดให้นายจ้างแจ้งรายละเอียดวิธีคำนวณค่าจ้างแต่ละรายการแก่ลูกจ้าง` — retain the existing §23 link immediately before this span. | Yes. Employer, employee and wage-calculation detail remain unchanged. |
| TH659-2 / 659:26 | `ความต่างอาจเกิดคนละขั้นตอน` | First-two-paragraph deletion test: the preceding sentences already distinguish earned Taiwan-dollar wages, deductions, actual receipt and the later remittance fee/exchange-rate step. This final generalization adds no fact or condition. | Delete only this final sentence-sized unit. | Yes. Retain all three comparisons and the remittance explanation. |
| TH659-3 / 659:28,42,63 | `สำหรับคนงานไทยในโรงงาน…` / `สำหรับแรงงานที่อยู่ในขอบเขตมาตรา 66…` / `สำหรับแรงงานภายใต้ระบบใบอนุญาตเปลี่ยนนายจ้าง…` | MONOTONY: paragraph opener — three prose paragraphs begin สำหรับ. The author self-check missed this because the fallback Korean tokenization treats long Thai strings as separate words. | At line 42 only, replace `สำหรับแรงงานที่อยู่ในขอบเขตมาตรา 66 สลิปต้องแสดง` with `สลิปของแรงงานที่อยู่ในขอบเขตมาตรา 66 ต้องแสดง`. Keep the rest of the paragraph. | Yes. Same worker scope, source and deduction list; only subject order changes. |
| TH660-1 / 660:21,23,32,34,57 | `ใช้วิธีสมัคร` / `ชุดเอกสารสมัคร` / `สมัครด้วยวิธี` / `ลูกจ้างก็สมัครได้` / `การเลือกเอกสารสมัคร` | สมัคร normally suggests enrolment, joining or applying for a job. Here the worker submits a wage-fund claim; repeated สมัคร makes the administrative step sound like joining the fund, although eligibility depends on employer contributions. The BLI page describes 申請墊償. | In those exact contexts use `ใช้วิธียื่นคำขอ`, `ชุดเอกสารยื่นคำขอ`, `ยื่นคำขอด้วยวิธี`, `ลูกจ้างก็ยื่นคำขอได้`, `การเลือกเอกสารยื่นคำขอ`, respectively. | Yes. This clarifies the procedural act without changing eligibility, the contribution condition or the documents required. |
| TH662-1 / 662:30 | `## เอกสารตำรวจออกตามลำดับ` | This says police documents are issued in sequence. The article's central distinction is the earliest date an application may be made; issuance on that date is not guaranteed. The NPA FAQ expressly describes 7/30-day application stages. | `## ช่วงเวลาที่เริ่มขอเอกสารตำรวจได้` | Yes; it aligns the heading with the already-correct body and source. No numerical or substantive change. |
| TH662-2 / 662:19,32,83 | `เวลาเริ่มสมัคร` / `วิธีสมัคร` / `เงื่อนไขสมัครและรับเอกสาร` | Same enrolment/application translation artifact as TH660-1. The object is a request for police records. | `เวลาที่เริ่มยื่นคำขอได้` / `วิธียื่นคำขอ` / `เงื่อนไขการยื่นคำขอและรับเอกสาร` | Yes. Keep the 30-day timing and express no guaranteed receipt date. |
| TH663-1 / 663:30 | `## หนี้เป็นของบริษัทใดและครบกำหนดเท่าไร` | เท่าไร asks an amount; ครบกำหนด asks when something falls due. The heading mixes those questions and sounds translated. | `## บริษัทใดต้องจ่าย และครบกำหนดเมื่อใด` | Yes. The section continues to address debtor identity, invoice amount, currency and due date. |
| TH663-2 / 663:36 | `ถ้าขายหลายครั้ง แยกหนี้เก่าออกจากคำสั่งซื้อใหม่ หนี้แต่ละงวดอาจมีวันครบกำหนดและข้อโต้แย้งต่างกัน` | MONOTONY: short-sentence rhythm — unlike the other four articles, the commercial procedure article runs through long conditional/legal units with almost no independent short statements. The author also expressly flagged this. A small rewrite can introduce a short complete instruction without padding or touching statutory conditions. | `แยกหนี้แต่ละงวดไว้ ยอดเก่าและคำสั่งซื้อใหม่อาจมีวันครบกำหนดและข้อโต้แย้งต่างกัน` Keep the following sentence about the next shipment. | Yes. This is document organization, not a legal eligibility condition. Separate invoices/due dates/objections remain intact. |

The two MONOTONY findings are based on actual Thai prose, not an assertion that the unsupported Korean numerical output measures Thai correctly. No added full stops or unrelated short filler sentences are requested.

## Optional edits, not blockers

| File:line | Exact span | Reason | Optional rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| 661:36 | `สภาพรู้ข้อเท็จจริง` | Unnatural nominal phrase for the person's knowledge of relevant facts. The surrounding analysis is nevertheless understandable. | `การรับรู้ข้อเท็จจริง` | Yes. Do not replace it with an assertion of intent or knowledge of illegality. |
| 660:20 | `เป็นคนไทยจึงไม่มีสิทธิขอกองทุนนี้หรือไม่?` | The negative presupposition is heavier than necessary; the answer itself is accurate. | `คนไทยมีสิทธิขอเงินสำรองจ่ายจากกองทุนนี้หรือไม่?` | Yes. Retain the qualified equal-treatment answer. |

## First-two-paragraph deletion test actually performed

Thai generally omits full stops; the units below are coherent sentence-sized meaning units, not an automatic split at each space. I read each unit with and without it, as well as reading the article from its third prose paragraph. Whole paragraphs do not need removal. One redundant tail in 659 is identified above.

| Article / paragraph | Actual units tested and deletion result |
|---|---|
| 659 / first, line 26 | `ยอดเงินบาทที่ครอบครัวได้รับยังบอกไม่ได้ว่านายจ้างในไต้หวันจ่ายค่าจ้างครบหรือไม่` stays: deleting it loses the Thai remittance problem. `ต้องเทียบยอดค่าจ้างที่ควรได้เป็นดอลลาร์ไต้หวัน รายการหัก และเงินที่ได้รับจริงก่อน` stays: it names the three records. `แล้วจึงแยกค่าธรรมเนียมกับอัตราแลกเปลี่ยนตอนส่งกลับไทยออกมา` stays: it identifies the later remittance stage. Delete `ความต่างอาจเกิดคนละขั้นตอน` as TH659-2. |
| 659 / second, line 28 | The unit beginning `สำหรับคนงานไทยในโรงงานที่ได้รับอนุญาตทำงานในกลุ่มแรงงานต่างชาติประเภทที่สอง` stays: it limits the bilingual-statement obligation. The §66 detail/five-year unit stays: a real retention period would disappear. `ส่วนการจัดประเภทต้องดูใบอนุญาตกับ…นิยามมาตรา 2` stays: identifies how to determine scope. `สัญชาติไทยเพียงอย่างเดียวไม่ได้กำหนดว่าทุกคนอยู่ในกลุ่มเดียวกัน` stays: prevents applying the rule to all Thai nationals. |
| 660 / first, line 26 | `ประตูโรงงานปิดไม่ได้บอกว่าเป็นการหยุดผลิตชั่วคราวหรือเลิกกิจการ` stays: physical closure is not the legal trigger. `ความต่างนี้มีผลต่อการขอเงินจากกองทุนสำรองจ่ายค่าจ้างของไต้หวัน` names the consequence and fund. The BLI unit beginning `หากโรงงานยังมีโอกาสกลับมาเปิด` stays: it supplies the actual exclusion, even when wages are overdue. |
| 660 / second, line 28 | The `คนงานไทยที่เตรียมกลับบ้าน…` unit stays: identifies the worker's parallel debt/status tasks. The §28 unit naming closure/liquidation/court bankruptcy stays: removes a material legal trigger if deleted. `กองทุนชื่อ 積欠工資墊償基金…หลังลูกจ้างทวงถามแล้วไม่ได้รับชำระ` stays: supplies the searchable name, bounded advance and unsuccessful-demand condition. |
| 661 / first, line 26 | `บนหนังสือที่ได้รับมีคำว่า 通知書 หรือ 告誡處分書?` stays: the two actual document labels are the reader's immediate decision. `เก็บภาพเอกสารทั้งหน้าและซองไว้` stays: envelope/full notice are distinct evidence. The unit distinguishing the two labels stays: otherwise the question is unexplained. The final unit naming issuing authority, status and appointment stays: it turns the label into a concrete next step. |
| 661 / second, line 28 | The unit naming ATM card/password/phone/app access stays: identifies what was transferred and the relevant pre-restriction chronology. `คำว่า “แค่ให้ยืม” ยังไม่บอกว่าใครใช้บัญชี รับเงินเพื่ออะไร และเจ้าของบัญชีรู้อะไรในขณะนั้น` stays: specifies the unresolved facts. `ควรเรียงเหตุการณ์ตามสิ่งที่เกิดขึ้นจริง โดยไม่เติมรายละเอียดที่จำไม่ได้` stays: expressly guards against guessed or aligned accounts. |
| 662 / first, line 26 | `สามสิบวันหลังอุบัติเหตุเป็นเวลาที่เริ่มขอเอกสารวิเคราะห์เบื้องต้นของตำรวจได้` stays: concrete application timing. The return-flight unit stays: why later receipt matters to this Thai reader. The NPA/timing-type unit stays: source and distinction from getting every record at discharge. |
| 662 / second, line 28 | The responsible-unit/recipient/early-treatment-record unit stays: three separate practical arrangements. The tourist/worker unit stays: travel insurance versus lost-work/pay records. The injury/insurance/liability unit stays: limits treating one document set as proof of all issues. The paragraph is useful orientation, not a promise to explain the article. |
| 663 / first, line 26 | `ชื่อบริษัทในใบสั่งซื้อ ชื่อผู้นำเข้า และชื่อผู้รับของที่คลังสินค้าอาจเป็นคนละชื่อ` stays: the specific party mismatch. The rest of the paragraph stays: connects buyer/payment commitment/delivery instructions to choosing a demand recipient or defendant. Starting at the invoice ledger would otherwise conceal this threshold issue. |
| 663 / second, line 28 | The shipping-evidence unit stays: delivery does not establish due date, acceptance terms or every defense. `รวบรวมทั้งคำตอบเรื่อง “รอบจ่ายเงิน” และข้อร้องเรียนคุณภาพที่ได้รับ` stays: includes unfavorable as well as favorable evidence. `อย่าเลือกเก็บเฉพาะอีเมลที่อีกฝ่ายยอมรับว่าสินค้าถึงแล้ว` stays: makes that preservation instruction specific. |

## Three accessible recent Thai comparators

Read the actual full files, including openings, headings and endings. These are the latest numbered pre-task Thai additions in this checked-out corpus; they are not fresh proof of live publication order. All have `published: 2026-09-27`; 022/023 have `lastmod: 2026-09-28`, while 021 has `lastmod: 2026-09-27`.

| Comparator under `src/content/columns-th/` | Concrete comparison |
|---|---|
| `021-taiwanese-spouse-divorce-cross-border-parenting.md` | Opens `ถ้าครอบครัวในไทยช่วยเลี้ยงลูกได้…`, a conditional family-support scenario, then practical care, authority, contact and support sections. 659–663 start from money measurement, legal closure status, document labels, a 30-day application stage and debtor identity. None borrows this family scenario. Their case-specific evidence endings are clearer than copying 021's contact/advertising-responsibility footer. |
| `022-marrying-taiwanese-national-registration-checklist.md` | Opens `จัดงานแต่งในไต้หวันแล้วจะจดทะเบียนที่นั่นได้เลยหรือไม่?`, followed by registration/interview/authentication/residence sections. 661 also has a reader question, but uses two literal Chinese police-document titles; 659/660/662/663 do not repeat the question template. The new wage/record/claim cases are distinct from cross-border family registration. |
| `023-baby-taiwan-nationality-birth-registration.md` | Opens `ได้หนังสือรับรองการเกิดจากโรงพยาบาลแล้ว ลูกมีสูติบัตรไทยและทะเบียนไต้หวันหรือยัง?`, then defines 戶籍. New 661/662 likewise explain Chinese documentary names where useful, while 663 explains 支付命令. The five new pieces do not repeat the nationality-versus-registration thesis or its sequence. Endings name the specific pay, account, police or purchase records rather than reusing a lawyer-name footer. |

A comparison with three recent Thai payroll/criminal/debt columns was impossible: the inspected pre-task corpus did not contain such a set. The same-locale, different-topic comparison above is real and sufficient for the opening/heading/ending exercise; it is not a claim of broader market uniqueness.

## Variety CLI evidence and independent §5 check

Executed the required command on all five actual frozen files:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-market-columns-20261023/repo/src/content/columns-th/<filename>
```

Each command returned exit 1 and identified `[ko]`. Read the implementation: `DIRLANG` lists only columns/columns-ja/columns-en/columns-zh; sentence thresholds and patterns only implement ko/ja/en/zh-hant. Consequently this run does not certify Thai CV, short-sentence percentage or a numeric zero-FAIL result. The output is not discarded or relabelled as PASS.

| ID | Actual sentence count / mean / CV / short share / run3 | Actual FAIL |
|---|---|---|
| 659 | 17 / 241.1 / 0.350 / 0 / 0.333 | len_cv; short_share; even_run3 |
| 660 | 20 / 217.6 / 0.384 / 0 / 0.278 | len_cv; short_share |
| 661 | 20 / 214.8 / 0.421 / 0 / 0.222 | len_cv; short_share |
| 662 | 20 / 222.8 / 0.355 / 0 / 0.222 | len_cv; short_share |
| 663 | 19 / 235.2 / 0.366 / 0 / 0.294 | len_cv; short_share |

Independent check of rule §5:

1. Required CLI performed and limitation disclosed above. A Thai numerical standard is not invented from Korean thresholds or ICU word counts.
2. Opening types vary: 659 remittance-measurement fact; 660 mistaken closure inference; 661 actual-document question; 662 one timing number; 663 contracting-party evidence. There is no stock hypothetical introduction or invented client event.
3. Short Thai meaning units are present: 659 `เงินสดก็ต้องนับ` and `เริ่มจากรอบค่าจ้างที่มีปัญหา`; 660 `เงินสมทบก็เป็นเงื่อนไข` and `เก็บประกาศไว้ทั้งหน้า`; 661 `คำแปลใช้ประกอบต้นฉบับ` and `แจ้งปัญหาภาษาให้ชัด`; 662 `ตรวจวิธีรับจริงก่อนเดินทาง` and `แต่ต้นฉบับต้องอยู่ครบ`. 663 is denser and receives TH663-2. These are qualitative language observations, not measured compliance with an undefined Thai length cutoff.
4. Vertically inspected paragraph starts. 659 has สำหรับ three times; TH659-3 fixes it. The remaining articles vary subject, document, time and source-led starts. In 660 หาก occurs twice; in 661 หาก and สำหรับ each occur twice. Repetition is not hidden by the tool's opener_rep=0.
5. Several evidence paragraphs in each piece have no legal citation; legal paragraphs link the actual rules. No three-paragraph claim→citation→however template was found. Citations are not removed for rhythm.
6. Negations principally preserve legal distinctions: resumed production/closure, nationality/eligibility, warning/crime/account control, request/receipt dates, foreign creditor/foreign service, order/assets. No invented reader belief is rebutted merely to create a contrast. They should not be removed to satisfy an unsupported regex score.
7. Each final prose paragraph ends with its own evidence: 659 wage slip and actual receipt; 660 representative/claim/debt records; 661 police notice and account control; 662 responsible unit/request/recipient; 663 purchase order/delivery/due date. The short general-information statements are not sales guarantees.
8. No bold, public author label, invented first-person case or repeated imperative checklist heading was found. Thai tone is plain and practical; Korean/Japanese register requirements are inapplicable. TH660-1 and TH662-2 address real translation-register artifacts.
9. Proposed repairs preserve all citations, numbers, scopes, uncertainty, party/authority identities and the internal author token. The repaired articles require reread; no repair was made in this review.

## Targeted legal meaning, FAQ and source checks

Official pages below were opened in this independent review on 2026-10-23. This is targeted verification, not certification of every citation or effective-history record. MOJ's pages state a consolidation cutoff of 2026-10-16. The author's and research ledger's remaining legal checks must still be assessed by the independent final reviewer.

| Article | Independently checked meaning and source fit |
|---|---|
| 659 | [N0090027 §66](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=66) requires the second-category worker's Chinese/home-country-language statement and the employer's five-year copy. [§2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=2) confirms this is a defined category. Body and FAQ limit the rule accordingly and do not cite deleted §43. The generic Thai title is narrowed in the substantive text; it does not promise the same rule to every foreign worker. Final reviewer should complete LSA §§14,22,23,26,27 and Employment Service Act §59 checks. |
| 660 | Opened [BLI application guidance](https://www.bli.gov.tw/0007239.html), substantive lines 622–677: closure/liquidation/bankruptcy, unsuccessful demand, contribution/later supplementation, qualified foreign workers, two distinct six-month categories, required debt proof and ordinary joint application. Its displayed update is 2023-12-19, matching the article. Opened [fund rules](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0030005) §§7–11 and15: same conditions and overseas account provision. Article does not promise all debts, all foreign workers or fully remote processing. FAQ tracks the body. |
| 661 | Opened [AML §22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0380131&flno=22): exceptions preserved; agreed/received consideration, aggregate three accounts, or specified five-year repeat conduct remain alternatives. Warning and criminal liability can coexist in the specified cases; the article does not declare guilt from account ownership. [CPC §99](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=99) supports language interpretation; advance notice remains a practical suggestion, not a prerequisite. Current [FSC regulation](https://law.fsc.gov.tw/LawContent.aspx?id=FL039015), revised 2026-08-31, supports the distinct warned-account/related-account rules and §§9–10 removal route. No immediate unfreeze is promised. Final reviewer should complete §§95/100-2 and effective-history checks. |
| 662 | [NPA FAQ](https://www.npa.gov.tw/ch/app/faq/view?id=2144&module=faq&serno=A1084129), substantive lines 205–210, says scene sheet at the scene, site diagram/photos after7 days, preliminary analysis after30 days, and permits application by parties/interested persons. [NPA portal](https://tm2.npa.gov.tw/NM105-505ClientRWD2/TM01A01Q_01.jsp) confirms attended injury/death accident scope, application number and representative collection authorization. The body correctly distinguishes request eligibility from receipt; TH662-1 aligns the heading. No overseas download is guaranteed. Final reviewer should complete civil procedure§70, criminal procedure§236-1/237 and Civil Code§197. |
| 663 | [Civil Procedure§509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509) supports the reciprocal-performance and overseas/public-service exclusions; being a Thai creditor is not the exclusion. Body/FAQ distinguish applicable law, debt category, demand/suit equivalents, service-based objection period and enforcement assets. The heading/rhythm edits change none of those. Independent final reviewer must finish the broader current choice-of-law, limitation, payment-order and attachment source set. |

All five have exactly three FAQs whose conditions match their bodies, internal `author: legal-ai-assistant`, Thai audience and matching publication/lastmod2026-10-23. No public writer/reviewer claim appears. Each has one inquiry route containing `/th/contact` and the official email; the confirmed consultation languages are Chinese/English/Japanese/Korean, and Thai consultation is expressly subject to arranging communication. First inquiries omit account credentials, identity documents, full medical records and bulk confidential originals. No retainer, recovery, fund award or interpreter availability is guaranteed.

Sources are inline and in the end list. New 661's relevant same-language link points to same-batch659 because the baseline has no Thai banking/criminal article; this dependency is disclosed in the author record and must be registered together. The other four link to existing Thai articles. Actual rendered routes, image pixels and desktop/mobile layout were outside this review; the author records separate image inspection and root owns integration/visual QA.

## Handoff

Apply only TH659-1/2/3, TH660-1, TH662-1/2 and TH663-1/2, then return the repaired files for a bounded reread and new hashes. Optional661 terminology/660 FAQ edits can be included in that same pass. Keep unresolved final legal checks and unsupported numerical Thai variety validation explicit. This review establishes neither publication readiness nor public availability.

## Repair-round-1 reread — current locale decisions

Rechecked on 2026-10-23 by the same independent `review_th` reviewer. Read all five current article files directly, including metadata, FAQs, sources, contact wording and endings; read the author's repair appendix. No article was edited by this reviewer. The following results supersede the initial decisions only for these exact latest hashes.

| File | Latest SHA-256 | Current locale decision |
|---|---|---|
| `659-thai-worker-taiwan-payslip-deductions-unpaid-salary.md` | `4bd0a8728c8dee891c50d9f1ea4b094b3473e00aca02ce8a1c38ffd580f8c454` | PASS |
| `660-thai-worker-taiwan-factory-closure-wage-fund.md` | `d172ea56f21d63cfe8ccfac3cf359f91f8a61074490751572525808e0c1aed2d` | PASS |
| `661-thai-worker-taiwan-bank-account-police-notice.md` | `7acb2c805316c660a4733fb4a83fbb444c3c610b41e87dc1602fd46797d3228d` | PASS |
| `662-thai-return-home-taiwan-traffic-injury-records.md` | `3401b05e82b5c643eee95e0e1b68aa20bdbcc03fbdf4ac6b753ed8ad535d3998` | PASS |
| `663-thai-supplier-taiwan-buyer-unpaid-invoice.md` | `16f9a9e2a05faca9d2e2a1879344661fa3b3faf235f0540edfa13ad2403c3e77` | PASS |

All eight required locale findings are resolved, and both optional edits were accepted. Current exact-text checks found:

| Finding | Observed repaired wording / result | Reread judgment |
|---|---|---|
| TH659-1 | Line34 now says `กำหนดให้นายจ้างแจ้งรายละเอียดวิธีคำนวณค่าจ้างแต่ละรายการแก่ลูกจ้าง`. | Natural subject/action, same employer duty; duplicate verb gone. |
| TH659-2 | Line26 ends after the fees/exchange-rate remittance explanation; `ความต่างอาจเกิดคนละขั้นตอน` is gone. | The opening still distinguishes Taiwan-dollar wages, deductions, actual receipt and later remittance. No missing transition or scope. |
| TH659-3 | Line42 begins `สลิปของแรงงานที่อยู่ในขอบเขตมาตรา 66 ต้องแสดง`. | Same category and deduction list. สำหรับ now begins only two prose paragraphs, confirmed directly and by a targeted count. |
| TH660-1 | All five instances use ยื่นคำขอ wording; no สมัคร remains in660. | Claim submission is distinct from employer fund contributions. Body and FAQs remain aligned. Optional FAQ now asks `คนไทยมีสิทธิขอเงินสำรองจ่ายจากกองทุนนี้หรือไม่?`; conditional eligibility answer is preserved. |
| TH662-1 | Line30 is `## ช่วงเวลาที่เริ่มขอเอกสารตำรวจได้`. | Heading, table and body all describe request eligibility, with no promised issuance date. |
| TH662-2 | FAQ, body and source caption now use ยื่นคำขอ; no สมัคร remains in662. | The7/30-day distinction, injury/death portal scope and receipt limitation are preserved. |
| TH663-1 | Line30 is `## บริษัทใดต้องจ่าย และครบกำหนดเมื่อใด`. | Correct Thai question about the debtor and due date; section still explains amount/currency. |
| TH663-2 | Line36 begins `แยกหนี้แต่ละงวดไว้` and retains old/new order, due-date and dispute distinctions. | Short complete thought improves the rhythm without filler. Alongside `ทำรายการต่อใบแจ้งหนี้`, the procedural explanation now has clear short pauses. No limitation or court condition changed. |
| Optional661 | Line38 uses `การรับรู้ข้อเท็จจริง`. | Natural wording for awareness of relevant facts; no substitution of legal intent or guilt. |

### Additional661 correction from independent final legal review

The final legal reviewer identified a legal-strength issue that the initial locale spot check had not flagged: the original warning wording described a possibility rather than the statutory direction. This is a substantive correction, not a meaning-preserving style edit. I reopened [official AML Act§22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0380131&flno=22) during this reread and compared the new Thai paragraphs with paragraphs2–4; the page still states a consolidation cutoff of2026-10-16.

At current line34, `มาตรา 22 วรรคสองกำหนดให้ตำรวจออกคำสั่งเตือนเมื่อฝ่าฝืนข้อห้ามนี้` now expresses the warning direction. The same paragraph preserves the alternative criminal grounds: agreed or received consideration, aggregate three-plus accounts, or the specified repetition within five years. Line36 restricts its concurrent-warning explanation to consideration or three-plus accounts and says `วรรคสี่กำหนดให้หน่วยงานที่มีอำนาจออกคำสั่งเตือนควบคู่กันด้วย`. This matches the paragraph4 reference to paragraph3 subparagraphs1 or2. Paragraph1 exceptions remain immediately before it. The later generic statement that warnings, criminal proceedings and restrictions can coexist does not undo that specific direction. The FAQs neither promise innocence nor weaken the newly clarified rule. Locale review of the repaired legal strength: PASS; independent final legal certification remains `final_asia`'s responsibility.

### Verification and remaining limits

Recomputed all five SHA-256 values from file bytes and matched the author's repair hashes. Direct text checks show three FAQs per file, internal `legal-ai-assistant`, one `/th/contact` route per body, no bold, and continued four-language consultation limits with no guaranteed Thai consultation or automatic engagement. First-two-paragraph deletion judgments remain unchanged except659's resolved redundant tail. The three actual comparator readings and other qualitative §5 findings above remain applicable; no new artificial opener, repetitive legal-caveat sequence or sales ending was introduced.

Reran the required shared variety command on every repaired file. All still return exit1 and incorrectly select `[ko]`; this remains a documented unsupported-language limitation, not Thai numeric failure or a numeric PASS. Actual CV/short-share/run3 respectively:659 `0.354/0/0.333`,660 `0.383/0/0.278`,661 `0.410/0/0.105`,662 `0.354/0/0.222`,663 `0.370/0/0.294`. The underlying code was not changed, and punctuation was not added to game it. Current PASS means the identified qualitative locale findings have been resolved, with this tool limitation retained.

No unresolved required locale finding remains at the five hashes above. Route registration, static rendering, image/layout checks, final legal review and public publication remain separate evidence. Sent the current results and hashes to root and `final_asia`; this appendix does not authorize or claim deployment.
