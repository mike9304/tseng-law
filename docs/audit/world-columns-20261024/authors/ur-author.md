# Work note: locale `ur` (Urdu), columns 825–827

Author: Claude (Sonnet 5.5), Lane A. Checked 24 October 2026. All statute text was fetched with `python3 tools/law.py`; official-page text was fetched with curl (raw copies kept in my scratchpad only). No native-speaker or lawyer review of the Urdu has taken place; the Urdu is model-written and the register was checked only against the existing `columns-ur` files and the variety tool (see "Measurement" below).

Files:
- `/Users/son7/tseng-world-columns-20261024/drafts/ur/825-pakistani-exporter-unpaid-taiwan-buyer-invoice.md` (B-INV)
- `/Users/son7/tseng-world-columns-20261024/drafts/ur/826-pakistani-engineer-taiwan-work-permit-arc-family.md` (P-WORK)
- `/Users/son7/tseng-world-columns-20261024/drafts/ur/827-pakistani-fiance-marry-taiwanese-national-interview.md` (L-MARRY)

All three keep the assigned topics (B-INV, P-WORK, L-MARRY); no topic was replaced. Images: 825 I10, 826 I29, 827 I24 (no repeats). No `featured_image` outside the menu.

Law-version check (lesson 9): `tools/law.py` shows the `部分條文尚未生效` banner only for the Civil Code (art. 166-1 and the 2026-08-17 amendment of art. 1223, effective six months after promulgation). None of the Civil Code articles cited (127–132, 982) is affected. No banner for CCP (amended 2023-11-29), Choice-of-Law Act, Company Act (2025-12-26), Arbitration Act, Employment Service Act (2025-01-20), Standard N0090031 (2024-08-01), Regulations N0090027 (2025-12-30), Immigration Act (2023-06-28). The Foreign Professionals Act (full-text amendment promulgated 2025-09-24) took effect on 2026-01-01 (articles 4(4)(iv) latter part, 28, 29 on 2026-06-30), so arts. 5, 6, 8, 9, 15, 16, 24 are in force on 24 Oct 2026; source: `LawHistory.aspx?pcode=A0030295`.

---

## 825 — Pakistani exporter, unpaid Taiwanese buyer (B-INV)

Reader and trigger: a Pakistani seller (trader or manufacturer) whose Taiwanese buyer has stopped paying invoices and keeps answering with promises. Trigger query: "can I still sue / how long do I have / what is cheapest in Taiwan".

Why Pakistan (labelled hypothesis): the assignment hypothesises Pakistani exporters to Taiwan. I found no official bilateral trade figure for Pakistan in a quick search of Taiwan MOF/MOFA pages (only all-country totals), so the article makes no claim about trade volume, goods or the firm's experience. The example is a labelled hypothetical ("Karachi exporter ... فرضی مثال"), with no product named.

Overlap and new angle: no `ur` column covers collection. Structural sources en 354, hi 669 (statutory skeleton re-verified, not copied). New angle for this reader: (1) the seller-side effect of Choice-of-Law Act art. 20(3) when the contract names no law, which can point to the seller's own (Pakistani) domicile law, so the "two-year" rule cannot simply be assumed; (2) CCP art. 509 bars (own counter-performance unperformed, service abroad or by public notice) and art. 132 (interruption lost if the order lapses or is withdrawn/rejected); (3) arbitral award / foreign judgment reciprocity, with the Pakistan point explicitly marked unchecked. Dropped from en 354: certified-letter (存證信函) details, interest rates, promissory note and cheque points, mediation threshold, security for costs (not needed, and the post-office rules were not re-fetched).

Claim → source table (all checked via `tools/law.py`; URL pattern `https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=<P>&flno=<N>`)

| Claim in article | Source | Chinese text checked |
|---|---|---|
| Price-of-goods claim of a merchant/manufacturer lapses after 2 years of non-exercise | Civil Code B0000001 art. 127(8) | 左列各款請求權，因二年間不行使而消滅：…八、商人、製造人、手工業人所供給之商品及產物之代價。 |
| Period runs from when the claim can be exercised | art. 128 | 消滅時效，自請求權可行使時起算。 |
| Limitation follows the law governing the claim | Choice-of-Law Act B0000007 art. 36 | 請求權之消滅時效，依該請求權所由發生之法律關係所應適用之法律。 |
| Chosen law; otherwise closest-connection law; presumption of domicile law of the party bearing the characteristic obligation | art. 20(1)–(3) | 依當事人意思…；無明示之意思…依關係最切之法律；法律行為所生之債務中有足為該法律行為之特徵者，負擔該債務之當事人行為時之住所地法，推定為關係最切之法律。 (Whether delivery is "characteristic" is NOT stated by the statute; the article says "if ... were accepted" and sends the point to counsel.) |
| Company name, business items, address, directors/managers, capital are public; anyone may view them on the authority's website | Company Act J0080001 art. 393(2)–(3) | 下列事項，主管機關應予公開…一、公司名稱…二、所營事業。三、公司所在地…五、董事、監察人姓名及持股。六、經理人姓名。七、資本總額或實收資本額…前項第一款至第九款，任何人得至主管機關之資訊網站查閱 |
| Payment order unavailable if applicant's counter-performance unperformed, or service abroad or by public notice | CCP B0010001 art. 509 | 如聲請人應為對待給付尚未履行，或支付命令之送達應於外國為之，或依公示送達為之者，不得行之。 |
| Order lapses if not served within 3 months | art. 515(1) | 發支付命令後，三個月內不能送達於債務人者，其命令失其效力。 |
| Demand, acknowledgment, suit interrupt; payment-order application, mediation, arbitration filing equal suit | Civil Code art. 129 | 一、請求。二、承認。三、起訴。…與起訴有同一效力：一、依督促程序，聲請發支付命令。二、聲請調解或提付仲裁… |
| Demand not followed by suit within 6 months is deemed no interruption | art. 130 | 時效因請求而中斷者，若於請求後六個月內不起訴，視為不中斷。 |
| Interruption by payment order lost if withdrawn, rejected or order lapses | art. 132 | 若撤回聲請，或受駁回之裁判，或支付命令失其效力時，視為不中斷。 |
| Payment order for a fixed sum of money | CCP art. 508 | 以給付金錢…之一定數量為標的者，得聲請法院依督促程序發支付命令。 |
| Court decides without hearing the debtor; claim must be made credible (釋明) | arts. 512, 511(2) | 法院應不訊問債務人…；債權人之請求，應釋明之。 |
| Fee NT$500 (payment order) / NT$1,000 (provisional attachment) | art. 77-19(2)(5), (4)(9) | 聲請發支付命令…徵收裁判費新臺幣五百元；聲請假扣押…新臺幣一千元 |
| Objection within 20 days without reasons | art. 516(1) | 二十日之不變期間內，不附理由向發命令之法院提出異議。 |
| After objection: order lapses to the extent of objection; application treated as suit or mediation request | art. 519(1) | 支付命令於異議範圍內失其效力，以債權人支付命令之聲請，視為起訴或聲請調解。 |
| No objection: enforcement title; debtor may sue for declaration of non-existence, court may stay enforcement on security | art. 521(1),(3) | 支付命令得為執行名義。…債務人主張支付命令上所載債權不存在而提起確認之訴者，法院依債務人聲請，得許其提供相當並確實之擔保，停止強制執行。 |
| Provisional attachment for money claims; risk of future impossibility/great difficulty; claim and cause made credible; court may order security | arts. 522, 523(1), 526(1)–(3) | 假扣押，非有日後不能強制執行或甚難執行之虞者，不得為之。請求及假扣押之原因，應釋明之。…法院亦得命債權人供擔保後為假扣押。 |
| Foreign arbitral award = award made outside Taiwan; after court recognition has effect of final judgment and is enforcement title | Arbitration Act I0020001 art. 47 | 在中華民國領域外作成之仲裁判斷…為外國仲裁判斷。…經聲請法院裁定承認後，於當事人間，與法院之確定判決有同一效力，並得為執行名義。 |
| Court may dismiss if the award's state does not recognise ROC awards | art. 49(2) | 判斷地國或判斷所適用之仲裁法規所屬國對於中華民國之仲裁判斷不予承認者，法院得以裁定駁回其聲請。 |
| Foreign judgment: reciprocity is one of four conditions | CCP art. 402(1)(4) | 外國法院之確定判決，有下列各款情形之一者，不認其效力：…四、無相互之承認者。 |
| Subsidiary vs branch (legal personality) | internal column `ur/018` section 2 (links to `/ur/columns/taiwan-semiconductor-market-entry`) | read in repo: 「شاخ ... آزاد قانونی شخصیت نہیں」 |

First-two-paragraph deletion test (825):
- P1 s1 (two-year rule + start date): delete → the reader loses the headline period and its start; kept.
- P1 s2 ("is Taiwan law even applicable?"): delete → the hinge to the choice-of-law section is lost, but section 1's first sentence still works; kept as the hook because it is the article's own point (it was not a restatement of the title; I also renamed the first heading from "whose clock" to "Pakistani-law presumption and the last date" so the heading does not repeat this sentence).
- P2 s1 (art. 36): delete → rule that limitation follows the governing law disappears; kept. s2 (chosen law): short, kept. s3 (art. 20 closest law + presumption): kept, the core. s4 (delivery as characteristic obligation, hedged): kept; hedging is deliberate (statute silent).
- Nothing was cut from these two paragraphs; no generic Taiwan background anywhere.

Comparison with three existing `ur` columns:
- 008 (opens with "السلام علیکم، میں تائیوان کی وکیلہ ..." greeting, a first-person lawyer anecdote, a big table, no `##` headings, ends with advice): 825 opens with a statutory fact, no greeting or first person, no anecdote.
- 014 (numbered `## 1. ...` headings, "مختصر جواب" answer-first section, checklist section 9, "متعلقہ رہنمائی" tail): 825 uses un-numbered, issue-named headings (law/presumption, buyer identity, six-month demand window, payment order and attachment, arbitration clause), one compact table for payment-order stages only, no checklist heading.
- 016 (opens with a generic paragraph about "a death in the family is not one procedure", numbered headings, long mechanical sections): 825's opening is a number-and-rule sentence; ends on a reciprocity caveat then a contact paragraph, not a recap.

Counts: body ≈ 949 whitespace-delimited words excluding the Sources section (link URLs stripped, table cells counted); ≈ 1,028 with Sources; 5,407 non-space characters in the body. Slightly at the top of the 650–950 band; the arbitration paragraph was shortened (art. 48 detail removed) to stay inside it.

Dropped / not stated because unverifiable:
- Pakistan's own limitation period for price of goods, State Bank of Pakistan export-proceeds rules, Pakistani law on recognising Taiwanese awards/judgments: foreign law, flagged for Pakistani counsel only.
- Whether Taiwan has recognised any Pakistani judgment or award: no decision found; article says "not checked".
- Any trade statistics or product lines for Pakistan–Taiwan trade (no official figure found).
- The MOEA company-registry site (findbiz.nat.gov.tw) returned HTTP 403 (Cloudflare) to curl, so it is not named; the statement relies on Company Act art. 393 only.
- Default interest rates, certified-letter rules, promissory-note shortcut, mediation threshold (not re-fetched / not needed).

---

## 826 — Pakistani engineer working in Taiwan (P-WORK)

Reader and trigger: a Pakistani engineer with a Taiwanese offer letter (or sent by a Pakistani employer to a Taiwanese customer), asking whether he can book a ticket, what permit/visa order applies, what happens on arrival and for the family. Hypothesis (unverified by statistics): engineers and professionals are the main Pakistani "work in Taiwan" readers; no official count of Pakistani professionals in Taiwan was found, and the article states none.

Overlap and new angle: `ur` has no work-permit column (008/009/014 cover severance and service-period clauses; linked, not duplicated). Structural sources en 705/704/706/352 re-verified. New angle: Pakistan-specific entry facts that the English sources cannot give: Pakistan is not on the visa-exempt list, Pakistan is on BOCA's "specific countries" visitor-visa list whose permitted purposes do not include employment, and Pakistan has no mission of its own (covering offices differ between BOCA's Chinese and English pages). Plus the contract-fulfilment dispatch route (Employment Service Act art. 51(3), Regulations arts. 5 and 12, Standard art. 7) that suits an engineer sent by a Pakistani supplier.

Claim → source table

| Claim | Source | Chinese / official text checked |
|---|---|---|
| Foreigner may not work without employer-applied permission | ESA N0090001 art. 43 | 除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。 |
| Employer applies to the central authority | art. 48(1) | 雇主聘僱外國人工作，應檢具有關文件，向中央主管機關申請許可。 |
| Professional work: employer applies to the Ministry of Labor | Foreign Professionals Act (FPA) A0030295 art. 5(1) | 雇主聘僱外國專業人才在我國從事前條第四款之專業工作…應檢具相關文件，向勞動部申請許可 |
| Resident visa file needs original work permit; >6 months remaining; apply at an overseas mission if outside Taiwan | BOCA "Resident Visas for White Collar Workers", `https://www.boca.gov.tw/cp-166-276-48430-2.html` (updated 2024-05-01) | "Original and one photocopy of work permit…Remaining period of employment indicated on the work permit must be more than 6 months"; "Applicants outside of the R.O.C. (Taiwan) are advised to apply for the visa from an R.O.C. (Taiwan) overseas mission." |
| Pakistan not on visa-exempt list | BOCA visa-exempt page `cp-149-4486-7785a-2.html` (updated 2026-07-17) | lists 90-day, 30-day, 14-day countries; Pakistan absent (Pakistan appears only as a place-of-birth exclusion for other passports) |
| Pakistan on "specific countries" visitor-visa list; permitted purposes (official invitation; conferences/events of lawful groups in Taiwan; visiting lawfully resident spouse, direct relatives, siblings; business talks incl. accompanying spouse/children; seafarers boarding; short-term medical) | BOCA `fp-36-40-0b0c6-1.html` (2026-07-17) | 巴基斯坦 Pakistan; 持特定國家護照人士得申請…事由：應我政府機關公務邀訪。…來台探視在台有合法居留身分之配偶、直系血親及兄弟姐妹。來台洽辦工商業務（含隨行配偶及子女）…船員擬來台登船。短期來台就醫。 |
| Pakistan has no own mission; covering offices | BOCA directory `sp-foof-countrylp-01-1.html` (zh) and `-2.html` (en) | zh: 巴基斯坦（兼轄館處：駐沙烏地阿拉伯王國臺北經濟文化代表處，台北經濟文化辦事處/大陸委員會香港辦事處，駐馬來西亞台北經濟文化辦事處）; en: "Pakistan - Taipei Economic and Cultural Representative Office in the Kingdom of Saudi Arabia". The two pages disagree; the article reports both and tells the reader to ask which office takes the file. |
| Manufacturing counts as professional/technical work | Standard N0090031 art. 4(13) | 十三、製造業。 |
| Four qualification routes | art. 5 | 一、依專門職業及技術人員考試法規定取得證書或執業資格者。二、取得…碩士以上學位者，或取得相關系所之學士學位而有二年以上相關工作經驗者。三、服務跨國企業滿一年以上經指派來我國任職者。四、經專業訓練，或自力學習，有五年以上相關經驗，而有創見及特殊表現者。 |
| Master's (any university) / bachelor's from top-1,500-ranked university: no minimum experience; licences and sector rules unaffected | FPA art. 6 | 碩士以上學位，或教育部公告世界大學排名前一千五百名大學之學士以上學位者…無須具備一定期間工作經驗。 |
| Salary not below announced amount (no figure given) | Standard art. 8 | 其薪資或所得報酬不得低於中央主管機關公告之數額。 |
| Dispatch by foreign legal entity: application by contracting entity or authorised agent when no branch/representative office in Taiwan | ESA art. 51(3) | 外國法人為履行承攬、買賣、技術合作等契約之需要，須指派外國人…於中華民國境內未設立分公司或代表人辦事處者，應由訂約之事業機構或授權之代理人…申請許可。 |
| Stay ≤30 days: entry visa deemed work permit; 31–90 days: apply within 30 days after entry | Regulations N0090027 arts. 5(1)(1), 12 | 停留期間在三十日以下之入國簽證或入國許可視為工作許可：一、從事本法第五十一條第三項規定之工作。 / 停留期間在三十一日以上九十日以下者，得於該外國人入國後三十日內依第九條規定申請許可。 |
| ≤90 days: art. 5 qualifications waived; if cumulative >90 days in preceding year, art. 5(1),(2),(4) apply | Standard art. 7 | 其工作期間在九十日以下者，外國人資格不受第五條之限制。但自申請日起前一年內履約工作期間與當次申請工作期間累計已逾九十日者，外國人仍應符合第五條第一款、第二款及第四款之規定。 |
| ARC within 30 days from the day after entry; ARC validity max 3 years | Immigration Act D0080132 art. 22(2),(3) | 應於入國後之翌日起算三十日內，向移民署申請外僑居留證。…最長不得逾三年。 |
| Specialist professional ARC up to 5 years | FPA art. 8(2) | 外僑居留證之有效期間…最長為五年。 |
| Change of address/employer: register with NIA within 30 days | NIA guide `…/141970` note 6(4) (updated 2026-04-14) | "changes his/her resident address or his/her place of employment…shall apply to the NIA for registering the change within thirty (30) days" |
| Labor Pension Act scheme applies to foreign professionals | FPA art. 24(1) | 從事專業工作之外國專業人才及外國特定專業人才，適用勞工退休金條例之退休金制度。(transitional exception for persons employed before the amendment not stated; article says "newly recruited") |
| Gold Card: specific professionals apply directly to NIA; combined four documents; validity 1–3 years | FPA art. 9 | 逕向內政部移民署申請核發具工作許可、居留簽證、外僑居留證及重入國許可四證合一之就業金卡。…有效期間為一年至三年 |
| Family (spouse, minor children, adult children unable to live independently due to disability) may apply directly to NIA after visa-exempt/visitor-visa entry | FPA art. 16(2) | 其配偶、未成年子女及因身心障礙無法自理生活之成年子女，以免簽證或持停留簽證入國者，得逕向內政部移民署申請居留 |
| Spouse work: direct MOL route only for spouses of specific/high-level professionals; permit not beyond dependent residence | FPA art. 15(1) | 外國特定專業人才及外國高級專業人才之配偶…得逕向勞動部申請許可…該工作許可期間不得逾其依親居留期間。 |
| Statute version | LawHistory A0030295 | 全文33條…一百十四年十一月十八日…其餘條文，定自一百十五年一月一日施行 |

First-two-paragraph deletion test (826):
- P1 ("offer letter arrived. May I buy a ticket?"): two short sentences, no facts; deleting it loses the reader's trigger only. Kept because it is the one-line scene and the answer follows directly.
- P2 s1 ("first see who holds the permission"): delete → nothing lost beyond a signpost; kept as a 5-word sentence needed for rhythm and to introduce the actor question. s2 (arts. 43, 48(1), FPA 5): kept. s3 ("offer letter is evidence of contract, not permission"): follows from arts. 43/48; kept as the answer to P1.
- Cut during drafting: a sentence on employer penalties (ESA arts. 57, 63) and the salary figure.

Comparison with the three existing `ur` columns: 008 (greeting + first-person anecdote + one huge table), 014 (numbered headings, answer-first section, checklist section, "related guidance" tail), 016 (generic opening, numbered headings). 826: opens with a two-line question, headings are plain issue names (order of visa/permit; qualifications; dispatch route; arrival; family), no numbering, no table, no checklist; ends on the spouse-work rule and the contact paragraph.

Counts: ≈ 946 words body excluding Sources (≈ 1,072 with Sources); 5,188 non-space characters body.

Dropped / not stated:
- Any salary figure (the Standard only refers to an announced amount that I did not fetch), Gold Card numeric criteria (official site only; article sends reader to it), processing times for work permits, the exact employer-penalty amounts, whether Pakistani nationals can convert a visitor visa to residence inside Taiwan (BOCA's 2024 resident-visa page describes an in-country application for some visitor-visa holders, but the specific-country list may limit visitor-visa types; not stated, the article says "do not plan on visit-first").
- Pakistan professional registration (PEC) and degree-attestation rules: Pakistani-side matters, not stated.
- Which covering office a Pakistani applicant must use for a work-related resident visa: BOCA's two pages disagree and no work-visa-specific rule was found; the article says to ask.

---

## 827 — Pakistani spouse marrying a Taiwanese national (L-MARRY)

Reader and trigger: a Pakistani citizen (or the Taiwanese partner) planning to marry and wondering about the interview, document authentication without a Taiwanese mission in Pakistan, and the order of steps. Hypothesis: Pakistani spouses are a real audience because BOCA itself lists Pakistan among the "specific countries" for marriage interviews (verified below); the actual size of the group is unknown and not stated.

Overlap and new angle: `ur` has no marriage column (007 covers divorce; linked via the engineer article only). Structural source en 022 (US-specific, AIT affidavit points not transferable). New angle: Pakistan-specific procedure from the 2026-08-24 BOCA table (interview and authentication at the Saudi Arabia / Malaysia offices; Hong Kong service group verifies documents but takes no marriage interviews), the order "marry in Pakistan first, then interview, then Taiwan registration, then resident visa", the interview-exemption list (relevant to a Pakistani engineer or graduate already in Taiwan; cross-linked to 826), translation and validity-period traps for Urdu documents, and Choice-of-Law Act art. 46 as the reason Pakistani-law conditions matter, explicitly handed to Pakistani counsel.

Claim → source table

| Claim | Source | Text checked |
|---|---|---|
| Pakistan is on the specific-country table; Pakistani marriage-document authentication by Saudi Arabia and Malaysia offices and the HK office service group; HK group takes no marriage interviews; revised 24 Aug 2026 | BOCA PDF `https://www.boca.gov.tw/dl-5210-6c88eaff0b5449078bfca7b720878eb0.html` (linked from `lp-403-1.html`; same document as `research/raw/marriage-interview-boca.pdf`) | 特定國家配偶申請來臺依親手續說明 修訂日期：115年8月24日；駐沙烏地阿拉伯代表處、駐馬來西亞代表處｜巴基斯坦*；*巴基斯坦籍人士之結婚相關文件驗證由駐沙烏地阿拉伯代表處、駐馬來西亞代表處及香港辦事處服務組辦理(香港辦事處服務組不受理結婚面談業務)。 |
| Order of steps; medical, police certificate and household transcript not required at interview stage; documents verified only if interview passes; fees not refunded on failure | same PDF part (二) | 當事人於境外完成外籍配偶原屬國之結婚程序後，備齊申請依親簽證及結婚文件驗證之相關資料及表格（外籍配偶之體檢表、無犯罪紀錄及業經結婚登記之戶籍謄本於此階段暫無須提出）…提出面談之申請…倘面談通過，駐外館處即驗證結婚文件供當事人持憑辦理我國內結婚登記，其後再提交…向駐外單位申辦依親簽證。倘面談不通過…不予退還 |
| Same order in household-registration guidance; marital-status proof valid 6 months; foreign-language documents need Chinese translation authenticated by mission or notarised in Taiwan | RIS `https://www.ris.gov.tw/documents/html/2/3/1/383.html` | 經外交部公告之特定國家，國人與特定國家人士結婚須先於外籍配偶之原屬國完成結婚登記後，備齊結婚證明文件向駐外館處申請面談，再持憑經駐外館處驗證之結婚證明文件，向國內戶政機關辦理結婚登記。／婚姻狀況證明文件於原核發機關核發之日起6個月內有效。／應備證件為外文者，應另檢附經駐外館處驗證或國內公證人認證之中文譯本。 |
| Marriage in Taiwan: written, ≥2 witness signatures, both parties register | Civil Code art. 982 | 結婚應以書面為之，有二人以上證人之簽名，並應由雙方當事人向戶政機關為結婚之登記。 |
| Both parties attend; document list; exemptions; recording; written record signed; mission may query issuer, require supplement within one month; written reasons and remedy notice on refusal | BOCA interview directions `https://www.boca.gov.tw/cp-212-4295-61dd5-1.html` (updated 2026-02-25), points 3–12 | 雙方當事人應親至該駐外館處或指定地點接受面談；交往經過說明書；外國人之婚姻狀況證明或單身證明；外國人之本國發給之結婚證書或結婚登記書，及其中文或英文譯本，並經文件核發國主管機關驗證；有下列情形之一者…得免予面談：雙方育有親生子女。結婚二年以上並有共同生活事實之具體事證。…外國人在臺修讀大專校院取得正式學位，期間雙方在我國認識交往。外國人依外國專業人才延攬及僱用法…取得…有效外僑居留證。外國人取得我國有效外僑永久居留證。…但因同一結婚事實曾經面談未通過者，不在此限。／應以書面說明理由，並附記救濟程序通知當事人。 |
| Marriage formation by each party's national law; form valid under either party's law or place of celebration | Choice-of-Law Act art. 46 | 婚姻之成立，依各該當事人之本國法。但結婚之方式依當事人一方之本國法或依舉行地法者，亦為有效。 (the sentence "Pakistani-law conditions can come up before the Taiwanese office" is my inference from this rule, hedged with "can") |
| Resident-visa document list (household register with marriage ≤3 months, authenticated proof, police certificate ≤1 year, medical ≤3 months); non-Chinese/English documents need Chinese or English translation authenticated by the mission | BOCA FAQ `https://www.boca.gov.tw/fp-398-696-550e9-1.html` | 最近3個月內核發之已載有結婚登記…戶口名簿；無犯罪紀錄證明…1年內；最近3個月內健康檢查合格證明；為中文、英文以外之其他語文文件者，應附中文或英文譯本，並經中華民國駐外館處驗證 |
| ARC within 30 days from the day after entry | Immigration Act art. 22(2) | 應於入國後之翌日起算三十日內，向移民署申請外僑居留證 |
| Spouse of Taiwanese national must attend first ARC application; first ARC valid 1 year | NIA guide note 6(1) | "the presence of the spouse of R.O.C. (Taiwan) national is required. A one-year validity ARC will be issued." |
| No work permit needed for foreigner married to a household-registered national with approved residence | ESA art. 48(1)(2) | 二、外國人與在中華民國境內設有戶籍之國民結婚，且獲准居留者。 |
| ARC holder may apply to change reason of residence if art. 23(1) conditions are met | Immigration Act art. 23-1(1) | 外國人持外僑居留證，因原居留原因變更或消失，而有下列各款情形之一者，得向移民署申請變更居留原因：一、符合前條第一項各款情形之一… |

First-two-paragraph deletion test (827):
- P1 s1 (star next to Pakistan in a BOCA table): delete → the reader loses the primary source and why this article exists for Pakistanis; kept. s2 (the footnote's content): the core fact (offices, HK exception); kept. s3 ("the sequence begins with this table"): signpost with no new fact; I trimmed it to six words rather than deleting it because the next heading depends on it. Candidate for deletion by an editor.
- P2 (lead-in line + five numbered steps): each step is a distinct stage from the PDF/RIS; none deletable. The two sentences after the list (fees; marrying in Taiwan and art. 982) add the failure cost and the Taiwan-celebration rule.

Comparison with the three existing `ur` columns: 008 (greeting, personal anecdote, table), 014 (numbered headings, "short answer" section, checklist), 016 (generic opening, numbered headings). 827: opens with an official-document sentence, one numbered list that is a real sequence (the only list in the article), headings are issue names, last body paragraph ends on two document-validity periods (6 months / 1 year) and a timing instruction, then contact.

Counts: ≈ 940 words body excluding Sources (≈ 1,036 with Sources); 4,633 non-space characters body.

Dropped / not stated:
- Pakistani conditions for marriage (religion, nikah registration, witnesses, earlier marriages): foreign law, handed to Pakistani counsel; the article does not describe them.
- Whether a Pakistani already in Taiwan can marry first in Taiwan without the home-country step: RIS text reads as a general rule for specific countries; BOCA's exemptions concern the interview only. The article says "ask the registration office" and states only art. 982 for marriages celebrated in Taiwan.
- Marital-status certificate "符合行為地法" endorsement shortcut (RIS), Chinese-name declaration, permanent-residence timelines, nationality of children.
- Which of the Saudi Arabia or Malaysia offices is closer or faster; processing times (not on the official pages I fetched).
- `research/country-facts.md` appeared after I had finished drafting. I did not rely on it; I verified the interview-list fact and the visa-exempt fact myself from the BOCA PDF and pages, and `research/raw/marriage-interview-boca.pdf` is byte-identical to the PDF I downloaded. Its Pakistan rows agree with the articles: visa exemption NO; marriage interview YES (Saudi Arabia or Malaysia mission; Hong Kong service division does not conduct marriage interviews). Rows I did not use: a conditional business eVisa on TAITRA recommendation for Pakistani business people (S15/S49; not verified by me, not stated), land reciprocity UNVERIFIED, working holiday NO, tax treaty NO, migrant-worker source NOT LISTED, driving licence UNVERIFIED (none of these appear in the articles).

---

## Measurement (all three)

- `variety_metrics.py` does not support `ur`. I ran it with `--lang ar` on a temporary copy (Urdu danda "۔" replaced by "." and "؛" by ";", sources heading replaced by the Arabic one) kept outside the batch; this is an approximation, not a validated Urdu measurement.
  - 825: sentences=44 cv=0.556 short=0.136 run3=0.024 opener_rep=0.0 contrast=0 q=4 → no limit violated
  - 826: sentences=35 cv=0.665 short=0.114 run3=0.0 opener_rep=0.0 contrast=0 q=1 → no limit violated
  - 827: sentences=32 cv=0.807 short=0.219 run3=0.033 opener_rep=0.182 contrast=0 q=1 → no limit violated
- Opening types: 825 statutory fact/number; 826 reader's question; 827 sentence from an official table. Not the stock hypothetical formula; the only hypothetical (825, Karachi exporter) is mid-article and marked "(فرضی مثال)" in the sentence.
- Contrast templates ("not X but Y") used at most once per article; no bold, no H1, no author footer, no first-person (lawyer) narration.
- Frontmatter lengths (characters): 825 title 66 / seoTitle 53 / summary 161; 826 62 / 52 / 136; 827 60 / 53 / 157. Fields and order exactly as in the brief; `read_time` "6 منٹ" and `date_display` "24 اکتوبر 2026" follow the `columns-ur` pattern ("N منٹ"; "13 ستمبر 2025"); category "تائیوان قانونی معلومات".
- Internal links (only slugs that exist): 825 → `/ur/columns/taiwan-semiconductor-market-entry`; 826 → `/ur/columns/taiwan-labor-severance-law`, `/ur/columns/taiwan-mandatory-employment-period`; 827 → `/ur/columns/pakistani-engineer-taiwan-work-permit-arc-family` (my own new slug). None of 001/004/005/006/010 is linked.
- Every statute/page linked in a body appears in that article's Sources list; the Sources lists also carry the Foreign Professionals Act legislative-history page (826) and art. 132 (825, also in body).
- Known weak points for a reviewer: (1) no native Urdu review; legal terms follow the existing `columns-ur` vocabulary (قانونِ مدنی, دفعہ, تعمیل, انقطاع), but "ہاؤس ہولڈ نقل" and "پولیس کلیئرنس" are loanwords chosen for reader recognition; (2) BOCA's resident-visa (white-collar) page is dated 2024-05-01, older than the other pages; (3) the BOCA English and Chinese mission directories disagree on Pakistan's covering offices (reported as such); (4) 825 is at the upper end of the length band.
