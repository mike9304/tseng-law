# bn author work note (Lane A, columns 822-824)

Author: Claude (Sonnet 5.5), 2026-10-24. Files:

- `drafts/bn/822-bangladeshi-garment-factory-taiwan-fabric-defect-notice.md` (B-DEF)
- `drafts/bn/823-bangladeshi-student-taiwan-part-time-work-permit-20-hours.md` (P-STUDENT)
- `drafts/bn/824-bangladeshi-importer-taiwan-supplier-new-bank-account-email.md` (B-FRAUD)

No native-speaker or lawyer review of the Bengali has taken place; nothing in the articles says so. Register: plain formal Bengali (chalit), Arabic numerals and Chinese terms in brackets, as in the existing bn columns.

## Method and checks run

- Every statute article cited was fetched with `python3 tools/law.py <PCODE> <art>` on 2026-10-24 and compared with the sentence it supports. Titles printed matched: B0000001 民法, B0000007 涉外民事法律適用法, N0090001 就業服務法, N0090027 雇主聘僱外國人許可及管理辦法, A0030295 外國專業人才延攬及僱用法, D0080129 外國人停留居留及永久居留辦法, D0080132 入出國及移民法, H0110001 外國學生來臺就學辦法, C0010001 刑事訴訟法, C0000001 中華民國刑法.
- Law-version trap: only the Civil Code printed the "not yet in force" banner. The pending items are art. 166-1 (date to be set by Executive Yuan and Judicial Yuan) and the amendment of art. 1223 (promulgated 2026-08-17, in force six months after promulgation). None of the articles I cite is affected; 822 and 824 say so in their Sources line. The other statutes printed no banner.
- All 38 cited URLs returned HTTP 200 (LawSingle pages, three WDA pages, WDA handbook PDF, CIB page).
- Official non-statute pages read in full: WDA part-time page (updated 112-06-12), WDA document list (updated 113-11-14 = 14 Nov 2024), WDA fresh-graduate page (updated 115-01-30 = 30 Jan 2026), WDA review handbook L-114-V01 (PDF, printed April 2025), CIB notice published 115-09-29 (29 Sep 2026).
- Variety: `variety_metrics.py` does not list `bn`. I ran it with `--lang hi` as a rough proxy (same orthographic-unit method, danda sentence ends) and with my own script (whitespace words, brackets stripped). Results with the tool: 822 cv 0.471, short 17.2%, run3 4.8%; 823 cv 0.514, short 13.0%, run3 0%; 824 cv 0.503, short 15.2%, run3 2.3%; no FAIL, contrast frames 0. This is not an editorial PASS for Bengali.
- `research/country-facts.md` appeared while I worked. Bangladesh rows (no visa exemption, no working holiday, no in-force tax treaty, marriage interview, land reciprocity UNVERIFIED, not a listed migrant-worker source) are not needed by these three topics; I used none of them and state no country-specific entry rule.
- Lengths (body incl. headings and contact paragraph, excl. frontmatter and Sources): 822 = 939 words / about 4,815 characters without spaces; 823 = 778 words / 4,275; 824 = 733 words / 3,974.

## Article 822: Taiwanese fabric or yarn shows a flaw only after dyeing

Reader and trigger: a Bangladeshi garment or dyeing-unit buyer who imports fabric, yarn or textile machinery from a Taiwanese mill or trading company; the trigger is a flaw that appears after cutting or dyeing, when the lot has already passed the gate check.

Why this fits Bangladesh (evidence, dated): the Ministry of Economic Affairs trade office country brief (trade.gov.tw/Files/PageFile/6a859fbc-8afc-4f0d-ad75-00063b51ffaa.pdf, data 2015-2016, old) lists Taiwanese exports to Bangladesh including machinery and man-made filament, and says the Taiwan Association of Machinery Industry (台灣機器工業同業公會) took 24 firms to the 13th Dhaka International Textile and Garment Machinery Exhibition in January 2016. The Taiwan Textile Federation's participation notice for the Dhaka fair of 20-23 February 2025 (textiles.org.tw, file_id=4705) says Taiwan runs a joint pavilion for yarns, textiles and garments and describes garment exports as over 80 percent of Bangladesh's exports. These show a trade link, not current volumes. I did not state any trade figure in the article. Labelled hypothesis: that defect-after-dyeing is a common dispute for these buyers; it is chosen because it exercises art. 356(2)-(3) (latent defects) in the way a fabric buyer meets them.

Overlap and new angle: en/506 (metal components), hi/670 (machine), es/690, de/680 already cover the Civil Code 354-365 sequence. New here: a fabric/yarn buyer; a defect that appears in the buyer's own process after dyeing; who the contractual seller is when a Dhaka agent, a Taiwanese trading company and the mill all appear; roll/lot/batch-log evidence; yarn "designated by kind" versus a custom-dyed lot (art. 364) stated as a question, not a conclusion.

| Claim in article | Source | Chinese text checked |
|---|---|---|
| Buyer inspects promptly by ordinary procedure according to the nature of the goods and notifies the seller immediately of a defect the seller must answer for | Civil Code 356(1) https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356 | 買受人應按物之性質，依通常程序從速檢查其所受領之物。如發見有應由出賣人負擔保責任之瑕疵時，應即通知出賣人。 |
| Late notice means deemed acceptance, except for defects ordinary inspection could not find; a defect not immediately knowable and found later must be notified at once, else deemed acceptance | 356(2), 356(3) | 買受人怠於為前項之通知者，除依通常之檢查不能發見之瑕疵外，視為承認其所受領之物。 / 不能即知之瑕疵，至日後發見者，應即通知出賣人，怠於為通知者，視為承認其所受領之物。 |
| Art. 356 does not apply where the seller intentionally did not disclose the defect | 357 | 前條規定，於出賣人故意不告知瑕疵於買受人者，不適用之。 |
| Party choice of law first; without a valid express choice, the law of closest connection (applied by a Taiwan court) | Choice-of-Law Act 20(1)-(2) https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20 | 依當事人意思定其應適用之法律。…無明示之意思或其明示之意思依所定應適用之法律無效時，依關係最切之法律。 |
| Seller answers for defects existing when risk passes, and for guaranteed qualities | 354 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354 | 應擔保其物依第三百七十三條之規定危險移轉於買受人時無…瑕疵…並應擔保其物於危險移轉時，具有其所保證之品質。 |
| Risk and benefit pass at delivery unless the contract provides otherwise | 373 | 買賣標的物之利益及危險，自交付時起，均由買受人承受負擔，但契約另有訂定者，不在此限。 |
| Goods from another place that the buyer will not accept: temporary custody if the seller has no agent at the place of receipt; presumed defect-free unless the defect is promptly proved by appropriate means | 358(1)-(2) | 買受人對於由他地送到之物，主張有瑕疵，不願受領者，如出賣人於受領地無代理人，買受人有暫為保管之責。 / 如買受人不即依相當方法證明其瑕疵之存在者，推定於受領時為無瑕疵。 |
| Rescission or price reduction; only price reduction where rescission is manifestly unfair | 359 | 買受人得解除其契約或請求減少其價金。但依情形，解除契約顯失公平者，買受人僅得請求減少價金。 |
| Replacement (conforming goods) where goods were designated only by kind | 364(1) | 買賣之物，僅指定種類者，如其物有瑕疵，買受人得不解除契約或請求減少價金，而即時請求另行交付無瑕疵之物。 |
| Damages for a missing guaranteed quality or intentional non-disclosure | 360 | 缺少出賣人所保證之品質者…請求不履行之損害賠償；出賣人故意不告知物之瑕疵者亦同。 |
| Six months from the 356 notice or five years from delivery; six-month limit does not apply to intentional non-disclosure | 365(1)-(2) | 於買受人依第三百五十六條規定為通知後六個月間不行使或自物之交付時起經過五年而消滅。前項關於六個月期間之規定，於出賣人故意不告知瑕疵者，不適用之。 |
| Rescission is exercised by declaration to the other party; seller may set a reasonable period to decide, and failure to rescind in it loses the right | 258(1); 361 | 解除權之行使，應向他方當事人以意思表示為之。 / 出賣人得定相當期限，催告買受人於其期限內是否解除契約。買受人於前項期限內不解除契約者，喪失其解除權。 |

Statements that are practice advice or my reading, not statute: what to put in the first notice and which records to keep; "the article does not define ordinary inspection" (true of the text); "a specification, approved sample or counter-sample shows what quality was agreed" (evidential, with the art. 354(2) classification left open); "none of the articles checked suspends the period during talks" (a statement about the text read, worded that way).

First-two-paragraph deletion test. Paragraph 1: S1 (fabric stripes after dyeing, labelled hypothetical) kept, it is the only concrete trigger and fixes why art. 356(2)-(3) matters; S2 (gate check found nothing) kept, it carries the latent-defect fact; S3 (can we wait for the lab report?) kept, it is the decision the next paragraph answers and the lab-report wait is named nowhere else. Paragraph 2: all four sentences kept (rule; deemed acceptance; latent-defect extension; application to the scene). Cut during drafting: a longer paragraph on exceptions that duplicated the later "first notice" section, and a sentence on third-party lab sample splitting (practice advice, not needed).

Comparison with existing bn columns: 008 opens with a greeting and an announcement ("in this article I explain"), then a first-person case story; 014 opens with a Q&A-style summary, ten numbered `## n.` headings, a checklist section and a disclaimer ending signed with the lawyer's name; 018 opens on a business trigger, eight numbered headings, a table, a FAQ section and a consultation section. 822 opens on a labelled hypothetical scene, uses five unnumbered headings that each name an issue of this article, has no table, no FAQ block in the body, no signature, and ends on the three dates to write down before the contact paragraph.

## Article 823: Bangladeshi student, part-time work in Taiwan

Reader and trigger: a Bangladeshi student (degree or language course) offered paid hours by a restaurant, shop or similar employer, who asks whether the study residence already allows work.

Why this fits Bangladesh: labelled hypothesis. I assumed Bangladeshi readers are mostly degree or graduate students and did not find a Ministry of Education table of Bangladeshi students (searches returned only top-three source countries without Bangladesh). The article therefore says nothing about numbers or about nationality-specific rules; it uses graduate-student routes (art. 51(2) of the permit regulations) and the post-graduation extension because they are the paths a graduate student meets.

Overlap and new angle: en/607 covers the same statutes in an English-reader frame. New here: question-first opening; the "student applies, school consents" mechanics from the WDA handbook and document list; the school-certification step as the usual hurdle; the graduate-research route stated with an explicit "not confirmed" for lab stipends; scholarship terms flagged as a separate document; consequences chain (fine, leave order, Immigration Act, school duty, employer fine); fresh-graduate extension. Cross-link to bn 008 (severance) because a graduate who stays on becomes an employee.

| Claim in article | Source | Chinese text checked |
|---|---|---|
| Foreigner may not work without a permit unless the Act provides otherwise | ESA 43 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43 | 除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。 |
| Employer may hire foreign students at public or registered private colleges and universities, free of art. 46(1) limits, with a 20-hour weekly maximum except winter and summer vacation | ESA 50 | 雇主聘僱下列學生從事工作，得不受第四十六條第一項規定之限制；其工作時間除寒暑假外，每星期最長為二十小時：一、就讀於公立或已立案私立大專校院之外國留學生。 |
| Student-category foreigners are "category 4" | Regs 2(1)(4) https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=2 | 第四類外國人：指依本法第五十條第一款或第二款規定從事工作之外國人 |
| Documents: application form, fee receipt, others set by the central authority | Regs 53 | 第四類外國人申請工作許可，應備下列文件：一、申請書。二、審查費收據正本。三、其他經中央主管機關規定之文件。 |
| Applicant is the student; school review and consent | WDA handbook L-114-V01 p.2 ("由僑外生提出申請"); WDA document list https://ezworktaiwan.wda.gov.tw/cp.aspx?n=99329239A3FBA2BB&s=B87ABDBEA90DBADA | 申請許可須經學校審查同意。 |
| Student must hold foreign-student status under the Foreign Student Regulations | Regs 50 | 本法第五十條第一款之外國留學生，應符合外國學生來臺就學辦法規定之外國學生身分。 |
| Para 1: formal enrolment in a department/program/institute or at least six months of language study; and the school certifies financial need with proof, or that its teaching/research unit needs the student's help | Regs 51(1) | 一、正式入學修習科、系、所課程，或學習語言課程六個月以上。二、經就讀學校認定具下列事實之一者：（一）其財力無法繼續維持其學業及生活，並能提出具體證明。（二）就讀學校之教學研究單位須外國留學生協助參與工作。 |
| Para 2 exceptions: language expertise with Ministry of Education case approval; graduate student with school consent doing research related to coursework | Regs 51(2) | 不受前項規定之限制：一、具語文專長，且…並經教育部專案核准…二、就讀研究所，並經就讀學校同意從事與修習課業有關之研究工作。 |
| Permit valid at most one year; 20-hour cap except winter and summer vacation | Regs 54(1)-(2) | 第四類外國人之工作許可有效期間，最長為一年。…其工作時間除寒暑假外，每星期最長為二十小時。 |
| Permit lapses on suspension, withdrawal, graduation or end of a staged course, except where the graduate has an admission notice to a bachelor/master/doctoral program and has completed enrolment | WDA handbook p.6-7 (printed April 2025; handbook, not statute) | 工作許可因休學、退學、畢業、語文學習或技術訓練等階段性課程結束，失其效力。但畢業後因取得學士、碩士或博士班錄取通知繼續就學且完成入學報到程序者，不在此限。 |
| Fine NT$30,000-150,000 for violating art. 43; violating foreigner shall be ordered to leave at once and may not work in Taiwan again; if given a deadline and not leaving, NIA may deport and may detain before departure | ESA 68(1), (3), (4) | 違反第…四十三條…規定者，處新臺幣三萬元以上十五萬元以下罰鍰。 / 違反第四十三條規定之外國人，應即令其出國，不得再於中華民國境內工作。 / 經限期令其出國，屆期不出國者，入出國管理機關得強制出國，於未出國前，入出國管理機關得收容之。 |
| Activity inconsistent with the permitted reason for stay is barred; NIA may deport or order departure within ten days | Immigration Act 29(1), 36(2)(4) | 外國人在我國停留、居留期間，不得從事與許可停留、居留原因不符之活動。 / 得強制驅逐出國，或限令其於十日內出國…四、違反第二十九條第一項規定… |
| School or authority shall act once a student's violation of the ESA is verified | Student Regs 23 | 外國學生有違反就業服務法之規定經查證屬實者，學校或相關主管機關應即依規定處理。 |
| Employer: hiring an unpermitted foreigner; fine NT$150,000-750,000 | ESA 57(1), 63(1) | 聘僱未經許可、許可失效或他人所申請聘僱之外國人 / 處新臺幣十五萬元以上七十五萬元以下罰鍰 |
| Fresh graduates with an associate degree or above may work without a permit during an NIA-approved extension; any job type, at most two years; licensing laws still apply | Foreign Professionals Act 12; WDA fresh-graduate page https://ezworktaiwan.wda.gov.tw/cp.aspx?n=511766BD9E956242 | 以應屆畢業生之身分依法取得內政部移民署許可延期居留期間，在我國從事工作，得免申請工作許可。 / 從事工作類別無限制，最長2年。 |
| Apply before residence expires; extension of one year from the day after expiry, one further extension before it ends, maximum two years | Residence Regs 11 | 於居留期限屆滿前…得向移民署申請延期居留。…自原居留期限屆滿之翌日起延期一年；延期屆滿前，有必要者，得再申請延期居留一次，總延期居留期間最長為二年。 |

Opening deletion test. Paragraph 1: S1 (study residence exists) kept, it states the condition; S2 (an employer offers hours) kept, it names the trigger; S3 (does he need a separate permit?) kept as the question the second paragraph answers. Paragraph 2: first sentence (permit needed, art. 43) kept; art. 50 sentence kept (the student path); last sentence kept because it answers the unstated assumption that an ARC or student status covers work, by quoting what arts. 43 and 50 do not say. Nothing cut after the first draft except a fee sentence (NT$100, from the handbook) dropped for length only.

Comparison with existing bn columns: 008, 014 and 018 all use first-person or heavy numbered structures as described above; 823 opens on the reader's question, moves through five issue-named headings of mixed form ("A, B"; "A: B"), has no checklist, and ends on one date (the last day of the residence period) before the contact paragraph.

## Article 824: Supplier's "new bank account" email

Reader and trigger: a Bangladeshi importer who paid a Taiwanese yarn, fabric or machinery supplier to an account named in a changed-bank email; the genuine supplier says it was not paid.

Why this fits Bangladesh: same dated trade link as 822 (the article does not assert how Bangladeshi buyers usually pay; it only mentions L/C as outside its scope). The topic is fraud mechanics common to cross-border buyers, labelled hypothesis for Bangladesh specifically.

Overlap and new angle: hi/673 and pt/695 cover Civil Code 309/310 and a CIB warning. New here: I verified the CIB page myself and found it concerns a different scheme (an email posing as a society's chairman asking staff to set up a LINE group and wire money). The article says so and borrows only its general verification steps (full address, confirm through known channels, confirm payment requests by phone or in person through the organisation's own approval process). It adds the art. 310 breakdown with art. 966 to define the term 準占有人, the point that 309-310 decide discharge only (not separate damages between the parties), the Criminal Code 3/4 territorial question tied to where the receiving bank is, and cross-links to 822 and bn 018.

| Claim in article | Source | Chinese text checked |
|---|---|---|
| Payment per the tenor of the obligation to the creditor or another person entitled to receive, once received, ends the obligation | Civil Code 309(1) https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=309 | 依債務本旨，向債權人或其他有受領權人為清償，經其受領者，債之關係消滅。 |
| Payment to a third party: (1) creditor ratifies or recipient later acquires the claim; (2) recipient is a quasi-possessor and the debtor did not know he was not the creditor; (3) otherwise only to the extent the creditor benefited | 310 | 一、經債權人承認或受領人於受領後取得其債權者，有清償之效力。二、受領人係債權之準占有人者，以債務人不知其非債權人者為限，有清償之效力。三、除前二款情形外，於債權人因而受利益之限度內，有清償之效力。 |
| Quasi-possessor is a person exercising a property right not constituted by possession of a thing | 966(1) | 財產權，不因物之占有而成立者，行使其財產權之人，為準占有人。 |
| Taiwan court's choice of law as above | Choice-of-Law Act 20 | as in 822 |
| Crime victim may file a complaint; in writing or orally to a prosecutor or judicial police officer | CPP 232; 242(1) | 犯罪之被害人，得為告訴。 / 告訴、告發，應以書狀或言詞向檢察官或司法警察官為之 |
| Criminal Code applies to offences committed within Taiwan; if either the act or the result is within Taiwan the offence counts as committed within Taiwan | Criminal Code 3, 4 | 本法於在中華民國領域內犯罪者，適用之。 / 犯罪之行為或結果，有一在中華民國領域內者，為在中華民國領域內犯罪。 |
| CIB notice dated 2026-09-29: look at the full sender address, verify through known channels, confirm payment requests through the organisation's approval process and by phone or in person | https://www.cib.npa.gov.tw/ch/app/news/view?id=1887&module=news&serno=b76b7228-650c-4e33-a1d4-650a8ec0bc72 | （一）看帳號…（二）查本人…先用原有管道查證。（三）匯款前再確認…依組織既有付款及覆核程序辦理，並透過電話或當面方式再次確認。 |

Practice advice, not statute (and worded as such): tell your bank at once and ask what recall or hold steps it can take; keep the bank's reference; keep original email files with headers; build a timeline; do not state whose mailbox was compromised before it is known; settle in writing what happens if the first transfer is recovered; calling a number found on an earlier invoice rather than in the new email.

Opening deletion test. Paragraph 1 is two sentences: S1 (a receipt shows money reached some account) and S2 (it does not show the bill is paid) both kept, S2 is the whole issue. Paragraph 2: sentence 1 (arts. 309-310 if Taiwan law applies) kept; sentence 2 (how the applicable law is decided; Taiwan address is not enough) kept; sentence 3 (L/C and Bangladeshi bank or court questions need Bangladeshi counsel) kept as the required home-law boundary. The "two dates" sentence was moved from the CIB section to the end of the complaint section.

Question count: one question in the body ("which situation does money sent on an email instruction fall in?"); the opening is a statement because the issue is a legal fact, not a decision.

Comparison with existing bn columns: 008, 014 and 018 as above. 824 opens on a two-sentence statement, uses five unnumbered headings that mix a noun phrase with a colon, a statute pairing, a conditional clause, a time cue and a procedure name, and ends on the two dates to hold, then the contact paragraph.

## Statements dropped or written around (could not verify)

822
- Any current Taiwan-Bangladesh trade value. A search summary mentioned a 2025 total of about US$1.085 billion on a trade.gov.tw page, but the fetched HTML did not show the figure, so it is not used anywhere.
- Whether test dyeing, length checks or roll counting count as the "ordinary procedure" in art. 356: the text does not say; the article says so instead of stating a standard.
- CISG applicability, Incoterms legal effect beyond the art. 373 proviso, sample-sale doctrine, art. 227 incomplete performance, art. 358(3) perishables.
- That a Dhaka agent defeats art. 358: written as a condition ("if the seller has no agent at the place of receipt"), not a conclusion.

823
- Whether a paid research-assistant or laboratory stipend needs a work permit: not found in the sources; the article says it is unconfirmed and tells the reader to ask in writing.
- Whether online freelancing from Taiwan for a client abroad falls under art. 43: no official statement found; the article says so.
- Delivery-platform or gig work rules, scholarship-specific work restrictions (only "check your scholarship terms"), Bangladeshi student numbers, visa or entry rules for Bangladeshi students, the NT$100 fee.
- Weekly-hours cap during vacation weeks: the provisions give no number; the article says so and does not call it unlimited.

824
- Bangladeshi reporting channels, Bangladesh Bank or bank-recall mechanics, SWIFT recall details, the Taiwan 165 anti-fraud hotline (kept out under the no-hotline rule), and Taiwan "warning account" freezes for foreign victims.
- Any Taiwan court decision on art. 310(2) in impostor cases (not read; the article says the situation depends on the facts and predicts no result).
- The MOEA/police leaflet on "fake business email" cited by a trade office page: only its title was visible, so it is not used.
- That a complaint in Taiwan will be accepted for a payment to a non-Taiwan account: left as a territorial question.

## Image choices (from IMAGE-MENU, one each, no repeats)

- 822: I15 (sewing machine and folded fabric). I05 (metal components and caliper) fits "defective goods" on the menu but shows the wrong goods for a fabric article.
- 823: I13 (part-time work, students, permits).
- 824: I18 (bank accounts, scams).
Alt text translates only what the menu lists; the caption is the menu pattern translated.
