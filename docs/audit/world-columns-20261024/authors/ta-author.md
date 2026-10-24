# Work note — locale ta (Tamil), columns 831–833

Author: Claude (Sonnet 5.5) as column author for `ta`. All legal text was fetched on 24 October 2026 with `python3 tools/law.py <PCODE> <article> ...`; official non-statute pages were fetched with curl on the same day. No lawyer review and no native-speaker review is claimed for these drafts. The Tamil was written by the model; terms follow the renderings already used in `REPO/src/content/columns-ta/` (தங்கல் அட்டை = ARC, குடியேற்ற நிர்வாகம் = NIA, உரிமையியல் சட்டம் = Civil Code, தொழிலாளர் தரநிலைச் சட்டம் = Labor Standards Act, etc.).

Files (all in `drafts/ta/`):
- `831-tamil-engineer-taiwan-work-permit-family-residence.md` (P-WORK with dependants)
- `832-tamil-engineer-taiwan-job-ends-permit-arc-severance.md` (P-JOBEND)
- `833-tamil-manufacturer-taiwan-machine-defect-shipping-risk.md` (B-DEF)

## Version and banner check

`tools/law.py` printed the "partly not yet in force" banner only for the Civil Code (B0000001): the banner lists Art. 166-1 (date to be set) and Art. 1223 (amended 2026-08-17, in force six months after promulgation). None of the Civil Code articles cited in 833 (258, 314, 354, 356–361, 364, 365, 373, 374) is affected. No banner for D0080132, N0090001, N0090027, N0090031, A0030295, N0030001, N0030020, B0000007. Amendment dates shown: Employment Service Act 114.01.20; Foreign Professionals Act 114.09.24; Immigration Act 112.06.28; Labor Standards Act 113.07.31; Labor Pension Act 108.05.15; Standards N0090031 113.08.01; Permit/Management Regulations N0090027 114.12.30. Each article carries "checked on 24 October 2026".

## Tools and checks run

- Tamil is not a supported language of `variety_metrics.py` (supported: ko, ja, en, zh-hant, th, id, hi, fr, de, it, es, pt, ar, vi). The `--lang hi` profile (space-separated, "." handled) was used as a proxy: all three files report "OK — no variety limit violated" (831: cv 0.557, short 0.213; 832: cv 0.501, short 0.143; 833: cv 0.480, short 0.275; contrast 0, cite_end 0). The `--lang en` profile mis-segments Tamil and was ignored. The proxy is not a validated measurement for Tamil; a reviewer who reads Tamil should judge rhythm.
- Bold check: no `**`, `__`, `<b>`, `<strong>`; no H1 in the body; every external link returned HTTP 200 (curl, 24 Oct 2026); every statute link flno exists in the fetched page; every link in a body appears in that article's source list.
- research/country-facts.md appeared while I worked. I used it only as a cross-check (India/Sri Lanka visa exemption, TAC wording). All facts used were also taken from official pages directly.

---

## 831 — Tamil engineer with a Taiwan job offer: work permit, ARC and family (P-WORK, with dependants)

### 1. Reader and trigger
A Tamil-speaking engineer in India (for example Tamil Nadu) or Sri Lanka who has received an offer from a Taiwanese manufacturer, with a spouse and children who will join. Trigger: the offer letter arrives and HR says "we will file the permit"; the reader wants to know what the permit rests on, which visa and which entry route to use, what the 30-day ARC clock is, and what the family may and may not do (residence versus work).

### 2. Why this topic fits the country
- Verified fact that shapes the article: India and Sri Lanka are not on BOCA's visa-exempt list, so both the engineer and the family need a visa before travel; India (not Sri Lanka) can apply for a Travel Authorization Certificate under conditions, and NIA's guideline excludes that entry type from direct conversion to residence. That is a trap specific to Indian passport holders.
- BOCA's mission directory lists a Chennai office for Sri Lanka and for India (with Delhi and Mumbai), i.e. a Tamil-speaking region has a local Taiwan office. The directory does not say which state each office serves, so no jurisdiction claim is made.
- Hypothesis (not verified, no statistic used in the article): Tamil-speaking engineers are a meaningful share of Indian and Sri Lankan professionals recruited by Taiwanese electronics and machinery makers. The assignment table designates P-WORK for `ta`; I followed it.

### 3. Overlap and new angle
Existing: en 704/705/706 (generic ARC and route comparison), en 649, hi columns (no P-WORK for India yet). ta 014 is linked (offer-letter service-period clauses). New angle: the order permit → resident visa → 30-day ARC clock; qualification route under N0090031 art. 5 for a manufacturing engineer; the India-specific Travel Authorization Certificate trap; the dependants' split between residence (FPA 16(2)) and work (ESA 43; FPA 15 only for specific/senior professionals); Gold Card as an alternative.

### 4. Claim → source table
| Claim in the article | Statute / pcode / URL | Chinese text checked (verbatim from law.moj.gov.tw, fetched with tools/law.py 24 Oct 2026) |
|---|---|---|
| Apply for ARC within 30 days counted from the day after entry (residence-permit entrants) | pcode D0080132 art. 22<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22 | 應於入國後之翌日起算三十日內，向移民署申請外僑居留證 |
| Four-in-one card / document with ARC function is exempt from separate ARC application | pcode D0080132 art. 22<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22 | 申請取得工作許可、居留簽證、外僑居留證及重入國許可四證合一之有效證件 |
| Foreigner may not work without employer-applied permit unless Act provides otherwise | pcode N0090001 art. 43<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43 | 除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作 |
| Employer applies to the central authority (MOL) | pcode N0090027 art. 6<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=6 | 除本法或本辦法另有規定外，雇主應向中央主管機關申請許可 |
| Manufacturing is a listed field of professional/technical work | pcode N0090031 art. 4<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090031&flno=4 | 十三、製造業 |
| Qualification: master or bachelor + 2 yrs related experience | pcode N0090031 art. 5<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090031&flno=5 | 取得國內外大學相關系所之碩士以上學位者，或取得相關系所之學士學位而有二年以上相關工作經驗者 |
| Qualification: certificate/licence; multinational 1 yr + posting; 5 yrs + originality (any one) | pcode N0090031 art. 5<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090031&flno=5 | 服務跨國企業滿一年以上經指派來我國任職者 |
| Qualification: 5 yrs related experience with original/special performance | pcode N0090031 art. 5<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090031&flno=5 | 有五年以上相關經驗，而有創見及特殊表現者 |
| Salary not below the amount announced by the central authority | pcode N0090031 art. 8<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090031&flno=8 | 其薪資或所得報酬不得低於中央主管機關公告之數額 |
| Worker without permit: fine NT$30,000–150,000 | pcode N0090001 art. 68<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=68 | 違反第九條、第三十三條第一項、第四十一條、第四十三條、第五十六條第一項、第五十七條第三款、第四款或第六十一條規定者，處新臺幣三萬元以上十五萬元以下罰鍰 |
| Worker without permit ordered to leave, may not work again | pcode N0090001 art. 68<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=68 | 違反第四十三條規定之外國人，應即令其出國，不得再於中華民國境內工作 |
| Visa-exempt/visitor-visa entrant with permit may apply to NIA directly for residence | pcode A0030295 art. 16<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16 | 得逕向內政部移民署申請居留 |
| Spouse, minor children, disabled adult children of professional may apply directly to NIA if entering visa-exempt/visitor visa | pcode A0030295 art. 16<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16 | 其配偶、未成年子女及因身心障礙無法自理生活之成年子女，以免簽證或持停留簽證入國者，得逕向內政部移民署申請居留 |
| Direct work-permit application only for spouses of specific/senior professionals | pcode A0030295 art. 15<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15 | 外國特定專業人才及外國高級專業人才之配偶，經內政部移民署許可在我國依親居留者，得逕向勞動部申請許可 |
| Gold Card = four-in-one, applied directly to NIA; validity 1–3 years | pcode A0030295 art. 9<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9 | 四證合一之就業金卡 |
| Gold Card validity 1–3 years | pcode A0030295 art. 9<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9 | 前項就業金卡有效期間為一年至三年 |
| Definition of foreign specialist professional (announced fields / special expertise) | pcode A0030295 art. 4<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=4 | 二、外國特定專業人才：指外國專業人才具有中央目的事業主管機關公告之我國所需科技、數位、經濟、教育、文化藝術、運動、金融、法律、建築設計、國防、環境、生技及其他領域之特殊專長 |
| Claim in the article | Official page (URL, page date) | Text checked |
|---|---|---|
| India and Sri Lanka are not on the visa-exempt list | BOCA, Visa-Exempt Entry, https://www.boca.gov.tw/cp-149-4486-7785a-2.html (page updated 2026-07-17) | "Nationals of the following countries are eligible for the visa-exemption program, with a duration of stay of up to 90 days: Albania, Andorra, ... United Kingdom*, and United States of America*." Neither country appears in the 90-, 30-, 14-day or trial lists (full page text searched). Same conclusion in research/country-facts.md (India, Sri Lanka rows: "NO nationality-based visa exemption"). |
| Resident visa from a Taiwan mission needs the work permit (original + copy) and more than 6 months remaining | BOCA, Resident Visas for White Collar Workers, https://www.boca.gov.tw/cp-166-276-48430-2.html (updated 2024-05-01) | "Original and one photocopy of work permit issued by competent authorities of central government of the R.O.C. (Taiwan)"; "Remaining period of employment indicated on the work permit must be more than 6 months at the time of Resident Visa application."; "Applicants outside of the R.O.C. (Taiwan) are advised to apply for the visa from an R.O.C. (Taiwan) overseas mission." |
| Mission directory lists three offices for India and Chennai for Sri Lanka | BOCA, Embassies and Missions, https://www.boca.gov.tw/sp-foof-countrylp-01-2.html | "India - Taipei Economic and Cultural Center in India"; "India - Taipei Economic and Cultural Center in Mumbai"; "India - Chennai - Taipei Economic and Cultural Center in Chennai"; "Sri Lanka - Taipei Economic and Cultural Center in Chennai". The page does not state which Indian state each office serves, so the article tells the reader to ask the office. |
| India citizens can apply online for the Travel Authorization Certificate (conditions apply) | BOCA, Southeast Asian Countries page, https://www.boca.gov.tw/np-152-2.html (created and updated 2026-08-05) | "Citizens of India, Indonesia, Laos, Myanmar, and Vietnam can apply online for an R.O.C. (Taiwan) Travel Authorization Certificate from the National Immigration Agency, Ministry of the Interior." The word "conditions" rests on research/country-facts.md (India row: "Conditional TAC application available through NIA; nationality alone is insufficient"). |
| NIA does not accept residence applications from persons who entered with the Travel Authorization Certificate (and other listed short-stay schemes) | NIA, 0921 Guidelines (Employment Gold Card), https://www.immigration.gov.tw/5475/5478/141465/141808/411634/cp_news, section 7(8) (page updated 2026-04-21) | "Those entering the State through trial visa-exemption, visa on arrival, Online Application for R.O.C. (Taiwan) Travel Authorization Certificate, APEC Business Travel Card (ABTC) holders, working holiday visa holders ... shall not be eligible to apply." The general guideline 0915 note 7(1) uses different wording ("individuals from Southeast Asian countries checking online in advance"); it is not cited for India because the link to India is not stated. |
| Dependants (spouse, minor children, disabled adult children) of a professional may apply to NIA directly if they enter visa-free or on a visitor visa | NIA, 0915 Guidelines, https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news, section 2(4) (updated 2026-04-14) | "Spouses, minor children under the age of eighteen (18), and children aged eighteen (18) or older unable to live independently due to physical or mental disabilities of applicants under the preceding two paragraphs, entering the country without a visa or holding a visitor visa." |
| Relationship proof verified by a Taiwan mission, unless the visa note already shows the relationship | NIA, 0915 Guidelines, section 4(8)(a)(i) | "is exempt from submitting a marriage certificate verified by the overseas missions if the relationship, spouse's name, and identification number have already been annotated in the visa note field" |
| Gold Card holder's family enters visa-free or with a visa from a Taiwan mission, then gets an ARC at NIA | NIA news site (Chinese), https://news.immigration.gov.tw/NewsSection/Detail/b635eaf3-a81e-46d6-82e6-e50cae07949d?lang=TW (2025-01-18) | "你的配偶和子女可以免簽證來臺，或是直接在我國駐外館處申請 依親停留 或居留簽證（ 配偶居留簽證 、 子女居留簽證 ）來臺，入境後至內政部移民署各縣市服務站辦理 外僑居留證" |
| Gold Card fields | NIA 0921 Guidelines, section 2(1) | Lists Science and Technology, Digital Technology, Economic Affairs, Education, Culture and Arts, Sports, Finance, Law, Architectural Design, National Defense, Environment, Biotechnology, and special expertise in other fields. |
| MOL page for accompanying spouses of foreign professionals: separate part-time category, hourly floor NT$200 | MOL, https://ezworktaiwan.wda.gov.tw/cp.aspx?n=77627C0EE4283293&s=79388C7B350E8CE9 (page date 111-12-19, i.e. 2022-12-19) | "且隨同居留之外國籍配偶從事以上工作類別，每小時平均薪資不得低於新臺幣200元整(詳請參考本部106年8月14日勞動發管字第10605154981號公告)". The article says only that this page exists, gives its date and tells the reader to confirm the current rule; it does not say who files. |

### 5. First-two-paragraph deletion test
- P1 s1 "நுழைந்த மறுநாளிலிருந்து முப்பது நாள்." — deleting it loses the counting start (day after entry) as a stand-alone cue; kept (the first draft opened with a bare "Thirty days." that repeated the number in the next sentence and was cut for that reason). P1 s2 (ARC within 30 days, Art. 22(2)) — deleting loses the rule; kept.
- P2 s1 "But that clock starts only after the work permit is in hand" — deleting loses the link between the two rules; kept. P2 s2 (ESA 43) — deleting loses the legal basis; kept.
- Cut from the first draft: an announcing sentence ("between these two rules sit the visa, the family's entry, the Gold Card") because it added no fact; a first-draft "foreigners do not apply on their own" sentence, which was wrong because of the Gold Card (statute says "unless this Act provides otherwise").

### 6. Comparison with three existing ta columns
- ta 008 opens with a first-person greeting from the lawyer and runs as a talk; 014 opens with a defined term and a numbered four-question list and uses headings "1." to "11." plus a checklist section and an author sign-off; 016 opens with a general sentence about what happens when a relative dies, has headings "1." to "11.", a preparation checklist and an author sign-off.
- 831 opens with a number/fact (30 days) and a statute, has four unnumbered headings that state the article's own issues (employer vs worker roles; entry routes for Indian/Sri Lankan passports; residence vs work for the family; Gold Card), no checklist section, no author line, no related-links list; it ends on two concrete questions and then one contact paragraph and the source list.

### 7. Length
Main text (before the sources list): 728 Tamil words / 6424 characters; with the sources list 841 words / 7414 characters (file incl. front matter 12883 characters). Tamil is agglutinative, so the word count understates content; the character count is close to en 705 (about 7,200 characters) and the content is roughly 800–950 English words.

### 8. Statements dropped because they could not be verified (or would mislead)
- The NT$53,000 monthly-income proof for dependants: NIA applies it to "foreign technical personnel" (mid-level technical workers), not to professionals; omitted to avoid misapplying it.
- The amount of the minimum salary under N0090031 art. 8: the Standards only refer to an amount announced by the central authority; I did not verify the current announcement, so no figure is given. (The NT$47,971 figure on BOCA's employment-seeking visa page serves a different purpose and was not borrowed.)
- Who files for the spouse's part-time permit under the MOL spouse page: the page (2022-12-19) does not say in the text I read; the article says only that the category exists and must be confirmed.
- Whether NIA's general guideline 0915 note 7(1) ("Southeast Asian countries checking online in advance") covers Indian Travel Authorization Certificate holders: not stated; only the explicit wording of guideline 0921 note 7(8) is used, and the reader is told to ask NIA.
- The BOCA employment-seeking visa (available from abroad): stay length not on the page; not mentioned.
- Indian and Sri Lankan blue-collar migrant-worker source status (ledger: India UNVERIFIED): not relevant to engineers; not mentioned.

---

## 832 — The Taiwan job ends: severance, work permit, ARC (P-JOBEND)

### 1. Reader and trigger
The same reader after arrival: an engineer who resigns, is laid off or is dismissed in Taiwan and has a spouse and children on dependent cards. Trigger: the last working day; the question is what happens to the money, the permit, the card and the family's cards, and how long there is to find a new employer.

### 2. Why this topic fits
- A Taiwan work permit rests on an employer's application (ESA 43, 53), so job loss is also an immigration event. That is true for every nationality; for Indian and Sri Lankan engineers (no visa exemption, no easy exit-and-return on a short stay) the stakes of a gap are higher. This second point is a labelled hypothesis, not a measured fact.
- A distinct legal point likely to be missed: Labor Pension Act art. 7 covers only listed persons (Taiwan nationals, foreign spouses of nationals, certain ex-spouses, and foreigners with permanent residence), so on the text an ordinary employer-sponsored ARC holder falls under Labor Standards Act art. 17 (one month's average wage per full year), not the half-month formula of Pension Act art. 12. The article flags that this is a reading of the statutory text, and tells the reader to ask the employer which article its calculation rests on. Support outside the statute: MOL's publication (amendment effective 2019-05-17 brought permanent-resident foreigners into the pension scheme) was seen only as a search result title, not fetched in full; so the table cites only the statute text.

### 3. Overlap and new angle
Existing: ta 008 and 009 (general severance and voluntary-resignation exceptions, linked as 008), en 706 (ARC changes), en 649 (changing employer). New: the severance formula depends on pension-scheme coverage; sequence of employer notice (3 days) → permit revocation → leave order → ARC cancellation; MOL's 7/12 working-day review times; Gold Card holders differ; Art. 17 job-seeking extension and its timing; dependants.

### 4. Claim → source table
| Claim in the article | Statute / pcode / URL | Chinese text checked (verbatim from law.moj.gov.tw, fetched with tools/law.py 24 Oct 2026) |
|---|---|---|
| Revoke residence and cancel ARC when reason disappears; listed cases may continue | pcode D0080132 art. 31<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31 | 移民署對於外國人於居留期間內，居留原因消失者，廢止其居留許可，並註銷其外僑居留證。但有下列各款情形之一者，得准予繼續居留 |
| Continue-residence cases: labor dispute litigation; occupational injury treatment | pcode D0080132 art. 31<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31 | 五、外國人與本國雇主發生勞資爭議，正在進行爭訟程序。六、外國人發生職業災害尚在治療中 |
| Change of address/workplace: register within 30 days from next day | pcode D0080132 art. 31<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31 | 變更居留住址或服務處所時，應於事實發生之翌日起算三十日內，向移民署申請辦理變更登記 |
| Employer notifies authorities in writing within 3 days of termination | pcode N0090001 art. 56<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=56 | 聘僱關係終止之情事，雇主應於三日內以書面載明相關事項通知當地主管機關、入出國管理機關及警察機關 |
| Termination of employment is a ground to revoke the permit | pcode N0090001 art. 73<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=73 | 三、連續曠職三日失去聯繫或聘僱關係終止 |
| Revoked: ordered to leave at once, may not work again (unless Act says otherwise) | pcode N0090001 art. 74<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=74 | 除本法另有規定者外，應即令其出國，不得再於中華民國境內工作 |
| New employer applies and attaches separation document | pcode N0090001 art. 53<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=53 | 應由新雇主申請許可。申請轉換雇主時，新雇主應檢附受聘僱外國人之離職證明文件 |
| Employer may give notice only on five grounds | pcode N0030001 art. 11<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=11 | 非有左列情事之一者，雇主不得預告勞工終止勞動契約 |
| No notice pay/severance claim for Art. 12 / Art. 15 terminations or fixed-term expiry | pcode N0030001 art. 18<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=18 | 依第十二條或第十五條規定終止勞動契約者。二、定期勞動契約期滿離職者 |
| Notice periods 10/20/30 days by service | pcode N0030001 art. 16<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=16 | 繼續工作三個月以上一年未滿者，於十日前預告之。二、繼續工作一年以上三年未滿者，於二十日前預告之。三、繼續工作三年以上者，於三十日前預告之 |
| Paid leave to seek work (max 2 days of working time per week); pay in lieu if no notice | pcode N0030001 art. 16<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=16 | 其請假時數，每星期不得超過二日之工作時間，請假期間之工資照給。雇主未依第一項規定期間預告而終止契約者，應給付預告期間之工資 |
| Severance: 1 month average wage per full year, pro rata, <1 month counts as 1 month; payable within 30 days | pcode N0030001 art. 17<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=17 | 每滿一年發給相當於一個月平均工資之資遣費。二、依前款計算之剩餘月數，或工作未滿一年者，以比例計給之。未滿一個月者以一個月計 |
| Severance payable within 30 days of termination | pcode N0030001 art. 17<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=17 | 前項所定資遣費，雇主應於終止勞動契約三十日內發給 |
| Worker may terminate without notice for unpaid wages / breach of labor law | pcode N0030001 art. 14<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=14 | 五、雇主不依勞動契約給付工作報酬，或對於按件計酬之勞工不供給充分之工作者。六、雇主違反勞動契約或勞工法令，致有損害勞工權益之虞者 |
| Art. 17 applies mutatis mutandis to Art. 14 terminations | pcode N0030001 art. 14<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=14 | 第十七條規定於本條終止契約準用之 |
| Service certificate cannot be refused | pcode N0030001 art. 19<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=19 | 勞動契約終止時，勞工如請求發給服務證明書，雇主或其代理人不得拒絕 |
| Refusal fine NT$20,000–300,000 (Art. 19 listed) | pcode N0030001 art. 79<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=79 | 違反第七條、第九條第一項、第十六條、第十九條、第二十八條第二項、第四十六條、第五十六條第一項、第六十五條第一項、第六十六條至第六十八條、第七十條或第七十四條第二項規定者，處新臺幣二萬元以上三十萬元以下罰鍰 |
| Average wage definition (6 months total wages / total days) | pcode N0030001 art. 2<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=2 | 四、平均工資：指計算事由發生之當日前六個月內所得工資總額除以該期間之總日數所得之金額 |
| New pension scheme severance: 0.5 month per full year, cap 6 months, Art. 17 LSA not applicable | pcode N0030020 art. 12<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030020&flno=12 | 每滿一年發給二分之一個月之平均工資，未滿一年者，以比例計給；最高以發給六個月平均工資為限，不適用勞動基準法第十七條之規定 |
| Persons covered by the Labor Pension Act (Taiwan nationals; foreign spouses; ex-spouses; APRC holders) | pcode N0030020 art. 7<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030020&flno=7 | 一、本國籍勞工。二、與在中華民國境內設有戶籍之國民結婚，且獲准居留而在臺灣地區工作之外國人、大陸地區人民、香港或澳門居民。三、前款之外國人、大陸地區人民、香港或澳門居民，與其配偶離婚或其配偶死亡，而依法規規定得在臺灣地區繼續居留工作者。四、前二款以外之外國人，經依入出國及移民法相關規定許可永久居留，且在臺灣地區工作者 |
| Job-seeking residence extension: 6 months from the day after expiry, one more extension, max 1 year; spouse and children included | pcode A0030295 art. 17<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=17 | 得向內政部移民署申請延期居留 |
| Extension runs from day after original expiry; max total 1 year | pcode A0030295 art. 17<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=17 | 自原居留效期或就業金卡有效期間屆滿之翌日起延期六個月；延期屆滿前，有必要者，得再申請延期一次，總延長居留期間最長為一年 |
| Dependants may apply for residence of professional | pcode A0030295 art. 16<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16 | 其配偶、未成年子女及因身心障礙無法自理生活之成年子女，以免簽證或持停留簽證入國者，得逕向內政部移民署申請居留 |
| Claim in the article | Official page (URL, page date) | Text checked |
|---|---|---|
| MOL review time 7 working days (online) / 12 (paper); avoid a gap between old and new employment | MOL, FAQ "外國專業人員欲轉換雇主時應如何辦理？", https://ezworktaiwan.wda.gov.tw/News_Content.aspx?n=77054B15FD1F5128&sms=2E02279676D3E77B&s=89322055161EB93E (updated 114-09-01 = 2025-09-01) | "本部線上申辦案件審查作業時間為7個工作日，書面案件為12個工作日，故雇主送件時宜留意前開作業時間，避免外國人先解聘，但尚未有新聘僱許可期間之空窗期。" |
| Gold Card is an individual work permit; new employer need not apply | NIA news site (English), https://news.immigration.gov.tw/NewsSection/Detail/646ccc29-c816-4f3e-bf58-c755eec59980?lang=EN | "If you hold an Employment Gold Card, it acts as an individual work permit, and you do not need a new employer to apply for a hiring permit." |
| During the Art. 17 extension, no work without an MOL permit (Gold Card guideline) | NIA 0921 Guidelines, section 7(7), https://www.immigration.gov.tw/5475/5478/141465/141808/411634/cp_news | "During the extended period of residency, individuals are not permitted to work in the State unless they hold an employment permit issued by the Ministry of Labor, except where otherwise specified by law." |

### 5. First-two-paragraph deletion test
- P1 (question + Art. 31(4) rule): the question is the reader's own and the rule answers it; I merged the first two draft sentences ("job ended; card still has time. Does the card continue?") into one so that no sentence was removable without losing the scenario or the rule.
- P2 s1 "other clocks also start" — deleting loses nothing but the transition; kept as a short sentence for rhythm. P2 s2 (ESA 56(1) three-day notice) — facts; kept. P2 s3 (ESA 73(3), 74(1)) — kept. P2 s4 "no grace period is written in these provisions" — it prevents the reader from assuming one; kept and limited to the three provisions named.

### 6. Comparison with three existing ta columns
- 008: first-person greeting and talk-style short lines; 014: defined-term opening and numbered four-question list, headings "1."–"11.", checklist and author sign-off; 009: "As I said before..." opening, a numbered list of exceptions, and a "see also" list at the end.
- 832 opens with the reader's question, uses four unnumbered issue headings (how the job ended; which pension formula; clocks for permit/card/new employer; family cards), contains one small table (notice days by service length), and ends on a single fact to write down (the date the employer notified the authorities) followed by one contact paragraph. No first-person lawyer voice, no author sign-off.

### 7. Length
Main text: 811 Tamil words / 6860 characters; with sources 908 words / 7646 characters (file 13629). This is the longest of the three because it joins three regimes (labor, pension, immigration); I kept it under the character count of en 705.

### 8. Statements dropped or written around
- How many days NIA allows after employment ends before departure: no official source found; the article says only that the three cited ESA provisions contain no grace period and tells the reader to ask.
- Whether the Foreign Professionals Act art. 17 extension can still be requested after NIA has cancelled the ARC under Immigration Act art. 31(4): the Act speaks of applying before expiry of the card; the article says the statute is silent on the earlier-cancellation case and that NIA must be asked.
- Whether the dependants' cards are automatically cancelled when the principal's card is: not stated in the statutes I read; the article says "may" and tells the reader to confirm each card with NIA.
- Unemployment insurance for foreigners: the NIA FAQ mentions it only for holders whose spouse is a Taiwanese national; not included.
- Which document counts as the 離職證明文件 under ESA 53(1): not defined in the statute; the article says so and separately notes the service-certificate right under LSA 19.

---

## 833 — A machine from a Taiwanese supplier arrives defective: who bore the risk, notice, and the two clocks (B-DEF)

### 1. Reader and trigger
A manufacturer (for example a metalworking, pump, foundry or textile-machinery plant in India or Sri Lanka) that bought a machine from a Taiwanese supplier and finds it damaged or non-conforming on arrival. Trigger: the crate arrives, someone opens it and the first question is who carries the loss.

### 2. Why this topic fits
- Assignment table designates B-DEF for `ta`. Hypothesis, not verified and not stated in the article as fact: Taiwan is a supplier of machine tools and industrial machinery to Indian and Sri Lankan manufacturers, and ocean shipment via Chennai or Colombo is typical. The scene is labelled "கற்பனை எடுத்துக்காட்டு" (hypothetical example) inside the sentence.

### 3. Overlap and new angle
Existing: en 506, hi 670 (Indian machinery buyer: notice and the 365 clocks), es 690, de 680. hi 670 is the closest sibling. To avoid duplicating it, 833 builds on risk transfer in a sea shipment (Civil Code 354, 373, 374, 314), explains the transit-damage versus defect-at-handover question, and uses Art. 356/357/358/365/258/361 more briefly, with a table for the two clocks, a short note on remedies (359, 360, 364) and a choice-of-law paragraph (B0000007 art. 20). It does not repeat hi 670's commissioning-records section.

### 4. Claim → source table
| Claim in the article | Statute / pcode / URL | Chinese text checked (verbatim from law.moj.gov.tw, fetched with tools/law.py 24 Oct 2026) |
|---|---|---|
| Warranty covers defects at time of risk transfer and guaranteed qualities | pcode B0000001 art. 354<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354 | 應擔保其物依第三百七十三條之規定危險移轉於買受人時無滅失或減少其價值之瑕疵 |
| Guaranteed qualities at risk transfer | pcode B0000001 art. 354<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354 | 出賣人並應擔保其物於危險移轉時，具有其所保證之品質 |
| Benefit and risk pass on delivery unless contract provides otherwise | pcode B0000001 art. 373<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=373 | 買賣標的物之利益及危險，自交付時起，均由買受人承受負擔，但契約另有訂定者，不在此限 |
| Shipment elsewhere at buyer request: risk passes on handing to carrier/forwarder | pcode B0000001 art. 374<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=374 | 買受人請求將標的物送交清償地以外之處所者，自出賣人交付其標的物於為運送之人或承攬運送人時起，標的物之危險，由買受人負擔 |
| Default place of performance rules | pcode B0000001 art. 314<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=314 | 清償地，除法律另有規定或契約另有訂定，或另有習慣，或得依債之性質或其他情形決定者外 |
| Prompt inspection by ordinary procedure; immediate notice of seller-liable defects | pcode B0000001 art. 356<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356 | 買受人應按物之性質，依通常程序從速檢查其所受領之物。如發見有應由出賣人負擔保責任之瑕疵時，應即通知出賣人 |
| Failure to notify = deemed approval, except defects not discoverable by ordinary inspection | pcode B0000001 art. 356<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356 | 買受人怠於為前項之通知者，除依通常之檢查不能發見之瑕疵外，視為承認其所受領之物 |
| Latent defect found later: notify immediately | pcode B0000001 art. 356<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356 | 不能即知之瑕疵，至日後發見者，應即通知出賣人 |
| Intentional non-disclosure: Art. 356 does not apply | pcode B0000001 art. 357<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=357 | 前條規定，於出賣人故意不告知瑕疵於買受人者，不適用之 |
| Goods sent from elsewhere, buyer refuses: temporary custody; presumed defect-free if defect not promptly proved | pcode B0000001 art. 358<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=358 | 買受人對於由他地送到之物，主張有瑕疵，不願受領者，如出賣人於受領地無代理人，買受人有暫為保管之責。前項情形，如買受人不即依相當方法證明其瑕疵之存在者，推定於受領時為無瑕疵 |
| Rescission or price reduction; only price reduction if rescission manifestly unfair | pcode B0000001 art. 359<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=359 | 買受人得解除其契約或請求減少其價金。但依情形，解除契約顯失公平者，買受人僅得請求減少價金 |
| Damages for missing guaranteed quality or intentional non-disclosure (instead of rescission/price reduction) | pcode B0000001 art. 360<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=360 | 買受人得不解除契約或請求減少價金，而請求不履行之損害賠償；出賣人故意不告知物之瑕疵者亦同 |
| Seller may fix reasonable period for buyer to decide on rescission; lost if not exercised | pcode B0000001 art. 361<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=361 | 出賣人得定相當期限，催告買受人於其期限內是否解除契約。買受人於前項期限內不解除契約者，喪失其解除權 |
| Replacement only where goods designated only by kind | pcode B0000001 art. 364<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=364 | 買賣之物，僅指定種類者，如其物有瑕疵，買受人得不解除契約或請求減少價金，而即時請求另行交付無瑕疵之物 |
| Six months after Art. 356 notice / five years after delivery | pcode B0000001 art. 365<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=365 | 其解除權或請求權，於買受人依第三百五十六條規定為通知後六個月間不行使或自物之交付時起經過五年而消滅 |
| Six-month rule inapplicable if seller intentionally concealed | pcode B0000001 art. 365<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=365 | 前項關於六個月期間之規定，於出賣人故意不告知瑕疵者，不適用之 |
| Rescission exercised by declaration to the other party | pcode B0000001 art. 258<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=258 | 解除權之行使，應向他方當事人以意思表示為之 |
| Choice of law: parties choose; else closest connection; presumption of characteristic-performer domicile | pcode B0000007 art. 20<br>https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20 | 當事人無明示之意思或其明示之意思依所定應適用之法律無效時，依關係最切之法律。法律行為所生之債務中有足為該法律行為之特徵者，負擔該債務之當事人行為時之住所地法，推定為關係最切之法律 |
Non-statute point: "export delivery terms such as FOB or CIF may decide where risk passes" is general commercial practice, written with "may"; it is not a Taiwan statute claim and no source is cited. Claims about carriers and marine insurers are expressly left out of scope.

### 5. First-two-paragraph deletion test
- P1 scene sentence (labelled hypothetical) — it carries the sea-shipment fact the rest of the article builds on; kept. P1 question "குறை எப்போது உருவானது?" — the reader's real question; kept.
- P2 s1 (the sale rules look for the moment risk passed) — kept. P2 s2 (Art. 354 warranty tied to that moment, plus guaranteed qualities) — kept. A third sentence I had added ("that moment is the first question") repeated P1 and was deleted.

### 6. Comparison with three existing ta columns
- 008/009 open with the lawyer speaking to the viewer; 014 opens with a defined term and a four-question list; 016 opens with a general sentence about what family members must sort out. 833 opens with a marked hypothetical scene, then a rule sentence, and uses four unnumbered issue headings (damage at sea or defect at handover; the day the crate is opened and the notice; two clocks; which country's law). It ends with a fact-bound sentence about keeping the crate and packing, then one contact paragraph; no checklist section, no author sign-off.

### 7. Length
Main text: 677 Tamil words / 6095 characters; with sources 737 words / 6602 characters (file 11225).

### 8. Statements dropped or hedged
- No statement that Art. 374 applies by default to every export sale: under Art. 314 the default place of performance for non-specific goods is the creditor's (buyer's) domicile, which would put delivery at the buyer's end. The article therefore says the moment depends on Arts. 373, 374, 314 and the contract wording.
- No claim about Indian or Sri Lankan law, carrier liability, cargo insurance, arbitration clauses or enforcement of Indian/Sri Lankan judgments in Taiwan: out of scope; the article says local counsel is needed for foreign-law questions.
- No statistics or trade figures on India/Sri Lanka–Taiwan machinery trade.
- Art. 20 presumption (domicile of the party performing the characteristic obligation) is stated as a presumption, and the article says which obligation is characteristic is for the court.

---

## Cross-article variety (within ta)
- Opening types: 831 number/fact + statute; 832 reader's question + statute; 833 marked hypothetical scene + rule.
- Heading patterns: 831 statement/route/relationship/alternative; 832 contrast question/formula/clock/family; 833 location-or-time question/notice day/clocks/law question. No numbering. 4 headings each plus the source heading.
- Endings: 831 two questions the reader must answer before booking travel; 832 one date to ask for and write down; 833 keep the crate and packing. Each is followed by its own contact paragraph worded differently.
- Internal links used: 831 → /ta/columns/taiwan-mandatory-employment-period; 832 → /ta/columns/taiwan-labor-severance-law; 833 → /ta/columns/taiwan-semiconductor-market-entry (the supplier's corporate form). None of 001, 004, 005, 006, 010 is linked. All three slugs exist in `REPO/src/content/columns-ta/`.
- Images (not reused): 831 I12 (passport/ARC), 832 I14 (leaving a job), 833 I07 (export, shipping). Alt text translates the menu description only; caption translates the standard sentence.

## Points for the reviewer
1. Labor Pension Act art. 7 / Labor Standards Act art. 17 reading in 832 (foreign ARC holder without permanent residence is outside the pension scheme, so art. 17 applies). It follows the statute text; no MOL Q&A on this exact point was fetched.
2. Whether the hi-proxy variety result is acceptable for Tamil.
3. Tamil naturalness: unreviewed by a Tamil speaker.
4. The 831 sentence on the MOL spouse page rests on a page dated 2022-12-19; hedged accordingly.
