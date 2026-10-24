# Indonesian market columns 664–668 — independent review

Reviewed 2026-10-24 by `/root/market_review_id`, an AI editorial reviewer that did not author these manuscripts. This is an independent Indonesian prose/source review, not a claim of human native-speaker or attorney review. No manuscripts were edited by this reviewer. Publication is outside this assignment.

## Final independent recheck — PASS (all five)

The separate repair author applied I1–I3. I independently re-read the actual changed passages, their surrounding paragraphs, affected conclusions and the minimal diff; I re-ran the shared variety CLI on all five final files. All five return exit 0, FAIL 0. No source URL is missing. `git diff --check` returns exit 0. Only the three repaired files' `lastmod` changes to 2026-10-24; original publication/date_display/provenance/image fields remain intact.

| ID | Latest SHA256 | Final verdict |
|---|---|---|
| 664 | `0df3ccf6a3f2ecbe7ec13ba26632bdec046cdbc54b562c01916ea29be1becba3` | PASS |
| 665 | `4d19c4da1bd422009f2bb794f27b25da1c1c8d52bce8884e6da58e6d023c23ff` | PASS |
| 666 | `1dc2f41c0b69574a9fe64696db98192ebfb1edf5d1471ee2a956f92b42740c26` | PASS |
| 667 | `932021416ab740639d9694170c2b6e7e1f8bd128dd3fda884b5510ddd0bef80b` | PASS |
| 668 | `28ce6c33da7a45f1ae6c156729ae4028904dbe25b91b9a8eeb0d7c0c0976135d` | PASS |

I1 is resolved: the prohibited-fee rule and concrete testing step remain, and the paragraph now moves directly to disputed debt. I2 is resolved: home-care exclusion and possible separate compulsory-insurance coverage remain with their source, without the redundant wrapper warnings. I3 is resolved as a substantive precision correction: Article 356's deemed acceptance, ordinary-inspection exception, and later prompt-notice duty now appear together. The Article 357 deliberate-nondisclosure exception and Article 365 rights-exercise limits remain unchanged. FAQ and conclusions remain consistent.

Final metric CVs: 664 .464; 665 .455; 666 .520; 667 .506; 668 .463. Final logs and exact command output: `work/reviews/market-id-logs/*.final-variety.txt`; latest hash/source/date manifest: `manifest-final.json`. No filler or artificial punctuation was introduced. The initial findings below are retained as resolved review history, not current blockers. Final legal review and publication remain root responsibilities.

## Initial disposition

| Article | SHA256 | Verdict |
|---|---|---|
| `src/content/columns-id/664-indonesian-home-caregiver-unpaid-wages-taiwan.md` | `0df3ccf6a3f2ecbe7ec13ba26632bdec046cdbc54b562c01916ea29be1becba3` | PASS |
| `src/content/columns-id/665-indonesian-worker-passport-broker-dispute-taiwan.md` | `4cc7e579386fa75545b26b03b6d4a694082ee14b89a5d6896b32b69c58a051d2` | REQUEST_CHANGES — I1 |
| `src/content/columns-id/666-indonesian-worker-bank-account-cash-job-police-taiwan.md` | `1dc2f41c0b69574a9fe64696db98192ebfb1edf5d1471ee2a956f92b42740c26` | PASS |
| `src/content/columns-id/667-indonesian-factory-worker-injury-evidence-compensation-taiwan.md` | `ab6d157e543d01a68ca6ec8c6f8c026664aab19db10ad6c22319161849b062b5` | REQUEST_CHANGES — I2 |
| `src/content/columns-id/668-indonesian-buyer-taiwan-machinery-defect-notice.md` | `a4e211f02700ccfbcb5995a33b696af4fbc5e1df2102bed666f01706313275d0` | REQUEST_CHANGES — I3 |

## Bounded findings

| ID / file:line | Exact sentence | Reason | Proposed correction | Legal meaning |
|---|---|---|---|---|
| I1 — 665:43 | “Artikel ini tidak menetapkan satu tarif untuk seluruh jenis pembayaran. Biaya yang sah pada satu tahap belum menjawab apakah tagihan lain diperbolehkan.” | The paragraph already identifies Article 40's prohibited fees and tells the reader to test the named charge against the agreement and applicable rules. The two closing sentences add an article-scope announcement and a generic warning rather than a fee criterion. | Delete these two sentences; retain the first two sentences of the paragraph and all existing references. | Preserved; no fee cap, exception, or legal condition is removed. |
| I2 — 667:52 | “Cakupan ini tidak boleh disalin begitu saja untuk semua pekerjaan.” / “Pengecualian satu undang-undang belum menjawab seluruh hak pekerja.” | MONOTONY: repeated general caution around an already concrete distinction. The two middle sentences specify the domestic-care exclusion and possible Article 6 insurance coverage; both wrapper warnings repeat that distinction. | Keep only the two middle sentences, starting “Menurut [penjelasan Kementerian Ketenagakerjaan]…” and ending “...dapat tetap berlaku pada majikannya.” | Preserved; keep the MOL link, the Labor Standards Act exclusion, and the separate insurance scope. |
| I3 — 668:40 | “Kelalaian memberi tahu dapat dianggap sebagai penerimaan barang.” | Article 356 uses a statutory deemed-acceptance consequence, not a discretionary possibility. The present wording weakens it. State the ordinary-inspection exception in the same sentence, then retain the following prompt-notice sentence for hidden defects. | “Jika pembeli lalai memberi tahu, barang dianggap telah diterima, kecuali cacat itu tidak dapat ditemukan melalui pemeriksaan biasa.” | Substantive precision: restores the statutory effect and explicit exception; not merely style. [Official Article 356](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356), opened live 2026-10-24. |

No other material legal or factual error was found in the five full texts. Do not broaden the repair into a uniform rewrite. Update only changed files' `lastmod` to 2026-10-24, preserving publication dates, date_display, original URLs, internal provenance and figures. Re-run the actual variety checker without padding or punctuation tricks.

## Full reading and published comparison

Read all five complete current files, including frontmatter, titles, summaries, FAQ, image alt/caption and closing paragraphs. Compared each against `git show 174454bd:<path>`: 664–667 are unchanged from that public source snapshot; 668 has the prior unpublished sentence-boundary repairs now integrated. The 668 diff splits coherent instructions and the language-service notice; it does not alter a numeric claim or remove a source. Its short sentences remain attached to concrete actions, rather than padding.

Read these three existing same-locale articles in full (all published 2026-09-27, lastmod 2026-09-28):

- `src/content/columns-id/021-taiwanese-spouse-divorce-cross-border-parenting.md`
- `src/content/columns-id/022-marrying-taiwanese-national-registration-checklist.md`
- `src/content/columns-id/023-baby-taiwan-nationality-birth-registration.md`

The older samples start from family plans or a document question and use longer explanatory paragraphs. The current batch distinguishes home caregiver, worker with passport withheld, criminal suspect, injured factory worker, and machinery buyer. It does not transplant one foreign legal system into all five. 664 begins with the legal coverage boundary, 665 with the current holder of the passport, 666 with the investigated transaction, 667 with two evidence types, and 668 with the six-month rights-exercise period. No invented client scene or first-person experience appears. Consultation closings share necessary language-service facts, but their final useful actions differ (monthly payment reconciliation; return request/answer; instruction-to-transaction chronology; medical-period payment reconciliation; pre-repair condition records).

## First-two-paragraph deletion tests

- 664: deleting the opening MOL sentence loses the domestic-care exclusion and agreed-pay premise. The second sentence connects that premise to job category and signed contract changes. Paragraph 2 adds the enforceable payment timing/default order under Article 486; its contrast is needed because paragraph 1 excludes the Labor Standards Act. Retain both.
- 665: the first question identifies the holder, and the next sentence directs the return request/report to that holder. The third explains why receipt and message chronology distinguish consent from against-will retention. Paragraph 2 supplies distinct broker and employer prohibitions. Retain both.
- 666: the first sentence identifies conduct that can be investigated, the next prevents a job advertisement from substituting for the elements, and Article 13 then identifies the knowledge/intention inquiry. Paragraph 2 separates account access, actual transfers, and consideration; the original-message instruction prevents selective proof. Retain both.
- 667: paragraph 1 separates medical and employment-connection proof, names the injured-worker audience, and prioritizes treatment. The last sentence explains evidence collection can follow without delaying care. Paragraph 2 adds manufacturing coverage and distinct payment sources. Retain both.
- 668: paragraph 1 gives one operative limitation and its practical interaction with long technical discussions. Paragraph 2 states choice-of-law/closest-connection rules and sale-versus-works classification. Its final scope sentence is necessary to prevent the subsequent Taiwan sales rules being applied to every Indonesian transaction. Retain both.

## Current official sources and consequential claim fit

All following links were opened live on 2026-10-24. MOJ pages show their compilation cutoff as 2026-10-16. They are current-text pages, not old-law pages. The Civil Code's visible not-yet-effective warnings concern Articles 166-1 and 1223, not the cited sales/employment provisions. The [official Civil Code history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001) identifies the 2026-08-17 amendment as Article 1223, effective six months after publication; that amendment is not applied here.

- 664: [MOL domestic-care pay guidance](https://www.mol.gov.tw/1607/28162/28166/28180/28182/28188/29020/) supports the Labor Standards Act exclusion/agreed pay. [Civil Code 486](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=486) supports agreement → custom → period/service-completion timing. [Foreign-worker management regulations 66](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=66) supports bilingual payroll, five-year retention, cash/direct full-payment rule after permitted worker-borne amounts, documented other methods, and administrative payment order. [Dispute Settlement Act 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020007&flno=9) and [23](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020007&flno=23) support local mediation venue and contractual effect. [Employment Service Act 59](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=59) supports the termination/nonpayment ground plus central approval, not automatic transfer.
- 665: [Employment Service Act 40](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=40) covers broker document retention against the person's will and prohibited fees; [57](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=57) covers unlawful employer withholding/appropriation; Article 59 above remains conditional. [WDA document guidance](https://fw.wda.gov.tw/wda-employer/home/file/2c95efb39983afcf0199a7d950f5673e) has Indonesian text and confirms consent-limited temporary possession for administrative help. [WDA consultation/referral service](https://fw.wda.gov.tw/wda-employer/home/lazypg/index) confirms Indonesian service, labor/police referral, legal-aid information and conditional shelter referral.
- 666: [Money Laundering Control Act 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0380131&flno=22) supports legitimate-use exceptions, warning, consideration/three-account/repeat-within-five-years criminal branches, three-year/NT$1 million maximum, and warning alongside branches 1/2. [Article 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0380131&flno=2) and [19](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0380131&flno=19), [Criminal Code 13](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=13), [30](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=30), [339](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=339) support fact-specific intent/accomplice/fraud/laundering analysis rather than automatic guilt. [Criminal Procedure 71-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=71-1), [95](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=95), [99](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=99), [100-2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=100-2), [41](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=41) and [43-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=43-1) support lawful-notice/nonappearance requirements, silence/counsel/favorable-evidence notice, interpreter rights without a prior-notice condition, and review/correction recording.
- 667: [Labor Standards Act 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=3), [59](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=59), [60](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=60), [61](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=61) support manufacturing coverage, medical/original-wage compensation, the cumulative two-year/inability/no-disability-standard conditions for optional 40-month average-wage payment, offsets, and the two-year exercise period unaffected by departure from employment. [Occupational Accident Insurance Act 6](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0050031&flno=6), [36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0050031&flno=36), [37](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0050031&flno=37), [90](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0050031&flno=90), [91](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0050031&flno=91) support conditional mandatory coverage despite nonregistration, insurer recoupment, five-year benefit claim period, conditional coordination, and employer proof of absence of negligence.
- 668: [Choice-of-law Act 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) supports party choice then closest connection. Civil Code [354](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354), [356](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356), [357](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=357), [358](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=358), [359](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=359), [360](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=360), [361](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=361), [364](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=364), [365](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=365), [227](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=227), and [258](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=258) support the stated quality/risk-transfer rules, prompt inspection and notice, deliberate-nondisclosure exceptions, custody/preservation conditions, limited remedies, six-month/five-year limits and rescission notice. Finding I3 corrects the modal strength at Article 356. The six-month exception is correctly not extended to the five-year limit.

The live [English contact page](https://tseng-law.com/en/contact) and [team page](https://tseng-law.com/en/lawyers) confirm the email and four consultation languages, and do not guarantee Indonesian-language service. `/id/contact` was inaccessible to the web retrieval tool in this run; that does not establish a live 404. No phone number, foreign office/licensure, guaranteed result, invented client, or public author credit was added in these five manuscripts.

## Actual images

All five referenced local WebP assets were opened with `view_image`, not inferred from filenames:

- 664: family-room armchair and document folder on a side table — matches localized alt; hypothetical-room caption does not claim an actual employer's house.
- 665: hands, plain passport-like booklet, blank card and folder on desk — matches alt; no readable identifier or face.
- 666: hand beside blank card and phone — matches alt and account-access illustration caption.
- 667: helmet, gloves and closed metal box on wooden table — matches alt and illustrative-equipment caption.
- 668: metal components in two trays and caliper — matches alt; caption expressly avoids claiming evidence of a real machinery dispute.

The 665 `social_image` JPEG was also opened independently and shows the same booklet/card/hand scene. Image hashes and URL-preservation evidence are recorded in `work/reviews/market-id-logs/images-and-preservation.json`.

Image files are existing topical assets, not newly generated for this review. Public image delivery and page layout are root's deployment checks.

## Variety CLI and section 5 manual check

Executed `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <each-file> --lang id` on all five exact versions. All exit 0 and output `OK — no variety limit violated`. Logs: `work/reviews/market-id-logs/*.variety.txt`, manifest `manifest-initial.json`.

| ID | Sentences | CV | Short ratio | Run3 | Opener repetition | FAIL |
|---|---:|---:|---:|---:|---:|---:|
| 664 | 49 | .464 | .265 | .000 | .071 | 0 |
| 665 | 48 | .453 | .167 | .065 | .071 | 0 |
| 666 | 46 | .520 | .196 | .045 | .067 | 0 |
| 667 | 53 | .508 | .226 | .059 | .062 | 0 |
| 668 | 58 | .470 | .276 | .036 | .000 | 0 |

Manual checks: no stock hypothetical opener; five distinct entry points; multiple genuinely short sentences; no three identical paragraph openers; legal citations interspersed with practical evidence paragraphs; no three consecutive claim/citation/caveat blocks; no blanket fictional scene; no bold or checklist-style headings; no first-person credential claims; closing sentences return to each article's evidence/action. The useful statutory distinctions are retained. I1/I2 address leftover repetitive wrappers despite numeric PASS. Indonesian vocabulary and tone are professional and comprehensible; “pengasuh rumah tangga”, “majikan”, “berita acara”, “pemberitahuan cacat” are consistently tied to Taiwan institutions rather than implying Indonesian statutes apply.

## Evidence limits / next step

No human/native-speaker/lawyer review is asserted. No browser rendering, production publication, exhaustive case-law search, or individual legal opinion was performed. The read-only legal review checks the statutory/general-guidance claims actually made, with bounded current-source refresh. All three targeted repairs and the latest-hash independent recheck are complete as recorded above. Unchanged 664/666 retain PASS without an arbitrary rewrite.
