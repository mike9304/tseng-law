# mn author work note: columns 816, 817, 818 (Mongolian, Cyrillic)

Author: Claude (Sonnet 5.5), Lane A. Date of checks: 24 October 2026.
Files: `drafts/mn/816-mongolian-student-taiwan-part-time-work-permit-hours.md`, `drafts/mn/817-mongolian-worker-taiwan-unpaid-overtime-wages-labor-mediation.md`, `drafts/mn/818-mongolian-student-taiwan-scooter-accident-police-records-insurance.md`.

## Limits of this work (read first)

- The Mongolian text was written by a model. No native speaker and no lawyer has reviewed it. Naturalness of the Mongolian is an open review item; I used the term choices already present in `columns-mn/` (for example "Хөдөлмөр эрхлэлтийн үйлчилгээний тухай хууль (就業服務法)", "Автомашины заавал хүлээх иргэний хариуцлагын даатгалын тухай хууль (強制汽車責任保險法)", "Замын хөдөлгөөнийг зохицуулах, шийтгэх тухай хууль (道路交通管理處罰條例)").
- `variety_metrics.py` does not support `mn` (its `--lang en` run read only 12 sentences of a Cyrillic file, so I did not use it as evidence). I measured with my own script (whitespace words, sentence split on . ? ! with URLs and link targets removed): see the metrics table at the end. The thresholds used are those of SENTENCE-VARIETY-RULE section 2.
- Mongolia rows in `research/country-facts.json` (read at the end of the work): visa_free NO (not on the visa-exempt list), working_holiday NO, tax_treaty NO, marriage_interview NOT LISTED, land_reciprocity non-reciprocal, migrant_worker_source YES as a named source country in MOL's report revised 2026-03 but "zero workers in the report's stock table", driving_licence UNVERIFIED (Highway Bureau pages returned a challenge page). I used none of these as a statement of fact in the articles, except that the driving-licence UNVERIFIED status is the reason article 818 does not say whether a Mongolian licence or IDP is accepted.
- Law versions: every statute was fetched with `tools/law.py` on 24 Oct 2026. Banners seen: 公路法, 道路交通管理處罰條例 (art. 21, 21-1, 35, 67, 73, 85-2, 85-3 amended 2026-08-17, effective date left to the Executive Yuan, no order found in the 沿革 page; art. 3 and 62 are unaffected), 民法 (only art. 1223 and 166-1, not cited). For art. 21 I read the in-force text on `LawOldVer` and compared it with the `LawSingle` text: the motorcycle fine range and on-the-spot impound are identical in both, so only those are stated, with the "as of 24 October 2026" label and a note in the Sources section.

## Article 816: Mongolian student, part-time work permit (P-STUDENT)

### Reader and trigger
A Mongolian student at a Taiwanese college or university (degree or language-centre programme) who has been offered a café, restaurant, delivery or tutoring job, or an employer who says "no permit needed". Trigger: the student wants to know the hour limit, who applies, and what happens if the job is done without a permit. Secondary: what changes after graduation.

### Why this topic fits Mongolia
Hypothesis, not evidence: students are the most plausible Mongolian group in Taiwan who work part-time, and MOL's ledger row shows that blue-collar migrant work from Mongolia is at most nominal (named source country, zero stock in the report), so a "Mongolian workers" audience is more likely students, spouses and professionals than factory workers. I looked for an official MOE head-count of Mongolian degree students (udb.moe.edu.tw tables can be filtered by country) but did not retrieve a national figure, so no number is stated. The article treats the rule as nationality-neutral and says so (ESA art. 50 names "外國留學生" and no country).

### Overlap and new angle
- en/637 (side gig, art. 73 revocation, three-year look-back) and en/705 (routes overview) exist. No mn column covers student work. New angle: the student-specific permit (ESA art. 50 + 雇主聘僱外國人許可及管理辦法 arts. 50 to 55), the school-side conditions, the consequence ladder (ESA 68, Immigration Act 24/36, employer ESA 44/63, art. 74(3) student carve-out), and the graduate step.
- Not repeated: three-year look-back (applies to 46(1)(1)-(6) work, not to student permits), cram-school teacher hours.

### Claim to source table
| Claim in article | Source | Chinese text checked |
|---|---|---|
| 20 hours a week except winter and summer vacations; applies to students at public or registered private 大專校院 | ESA art. 50 (N0090001) | 雇主聘僱下列學生從事工作，得不受第四十六條第一項規定之限制；其工作時間除寒暑假外，每星期最長為二十小時：一、就讀於公立或已立案私立大專校院之外國留學生。 |
| Foreigner may not work without permit applied for by employer | ESA art. 43 | 除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。 |
| Permit valid at most one year; 20-hour rule repeated | Reg. art. 54 (N0090027) | 第四類外國人之工作許可有效期間，最長為一年。前項許可工作之外國人，其工作時間除寒暑假外，每星期最長為二十小時。 (art. 2(4): 第四類外國人：指依本法第五十條第一款或第二款規定從事工作之外國人) |
| Application documents | Reg. art. 53 | 一、申請書。二、審查費收據正本。三、其他經中央主管機關規定之文件。 |
| Ministry refuses on false data or uncured defect | Reg. art. 55 | 中央主管機關應不予許可：一、提供不實資料。二、不符申請規定，經限期補正，屆期未補正。 |
| New employer applies when changing or adding employers | ESA art. 53(1) | 如需轉換雇主或受聘僱於二以上之雇主者，應由新雇主申請許可。 |
| Permit revoked for working for another employer / self-initiated other work | ESA art. 73 items 1, 2 | 一、為申請許可以外之雇主工作。二、非依雇主指派即自行從事許可以外之工作。 |
| Foreign-student status under the Foreign Student Study rules | Reg. art. 50 | 應符合外國學生來臺就學辦法規定之外國學生身分。 |
| Formal enrolment or language course of 6 months or more; plus school finding of financial need or unit need | Reg. art. 51(1) | 一、正式入學修習科、系、所課程，或學習語言課程六個月以上。二、經就讀學校認定具下列事實之一者：（一）其財力無法繼續維持其學業及生活，並能提出具體證明。（二）就讀學校之教學研究單位須外國留學生協助參與工作。 |
| Graduate students doing study-related research with school consent are not bound by para. 1 | Reg. art. 51(2) item 2 | 外國留學生符合下列資格之一者，不受前項規定之限制：…二、就讀研究所，並經就讀學校同意從事與修習課業有關之研究工作。 (the sentence "permit requirement stays" is my reading: the exception names only para. 1 conditions; ESA 48 exemptions do not list students) |
| Without permit: fine NT$30,000-150,000; order to leave immediately and no further work; forced exit and detention if not leaving | ESA art. 68(1), (3), (4) | 違反第四十三條…處新臺幣三萬元以上十五萬元以下罰鍰。違反第四十三條規定之外國人，應即令其出國，不得再於中華民國境內工作。…屆期不出國者，入出國管理機關得強制出國，於未出國前，入出國管理機關得收容之。 |
| Immigration Agency may refuse residence, revoke permit and cancel ARC for work inconsistent with permit; non-approval period 1 to 7 years from the day after departure | Immigration Act art. 24(1)(12), 24(3) (D0080132) | 十二、曾經在我國從事與許可原因不符之活動或工作。…第一項第十一款及第十二款之不予許可期間，自其出國之翌日起算至少為一年，並不得逾七年。 |
| Forced deportation, or order to leave within 10 days, for activity inconsistent with the permit | Immigration Act art. 36(2)(4), art. 29(1) | 得強制驅逐出國，或限令其於十日內出國…四、違反第二十九條第一項規定，從事與許可停留、居留原因不符之活動。 |
| Employer: nobody may unlawfully harbour a foreigner to work; fine NT$150,000-750,000 | ESA art. 44, 63 | 任何人不得非法容留外國人從事工作。 / 違反第四十四條…處新臺幣十五萬元以上七十五萬元以下罰鍰。 |
| Students whose permit expires or is revoked under art. 73(1)-(5) are exempt from the immediate-departure rule of art. 74(1) | ESA art. 74(3)(1) | 不適用第一項關於即令出國之規定：一、依本法規定受聘僱從事工作之外國留學生、僑生或華裔學生，聘僱許可期間屆滿或有前條第一款至第五款規定情事之一。 |
| After graduation: new permit under another category; art. 5 routes (certificate; master's or above in related department; bachelor's plus 2 years' related experience; others exist) | ESA art. 43, 46; Standards art. 5 (N0090031) | 取得國內外大學相關系所之碩士以上學位者，或取得相關系所之學士學位而有二年以上相關工作經驗者。 (art. 4 lists the covered jobs; art. 5 begins 除符合本標準其他規定外) |
| Technical-manpower measures list Taiwan-college associate-degree-or-above graduates among qualifying persons for some jobs, with additional conditions such as pay | 外國技術人力工作資格及許可管理辦法 art. 6(2) item 2, art. 8 (N0090064) | 取得我國大專校院副學士以上學位之外國留學生、僑生或其他華裔學生（以下簡稱畢業僑外生）。 / 應符合…二、薪資基本數額。 |

### First-two-paragraph deletion test
- P1 S1 (20 hours, outside vacations, art. 50) carries the number, the condition and the source: kept. P1 S2 (the provision names «foreign student» and no country): kept because it answers the Mongolian reader's unstated question; deleting it would lose the nationality-neutral point.
- P2 S1 (the number is the second question, the first is the permit): kept as the hinge; merged with the next clause after a first draft where it stood alone and failed the test. P2 S2 (art. 43): kept. P2 S3 (employer applies, not the student): kept, six words.
- A first draft opened with a stand-alone "Долоо хоногт 20 цаг." followed by the same number in the next sentence; deleting it lost nothing, so I merged it.

### Same-language comparison and changes
- 008 opens with a first-person greeting from the lawyer, then a Korea comparison; 014 opens with one long definitional sentence and a numbered list of four questions; 016 opens with a general statement that several procedures start at once. Headings in 014 and 016 are numbered "## 1." to "## 11." and both end with a "Холбогдох мэдээлэл" link list, a general disclaimer and a signed footer.
- 816: opens on a number plus its legal source; four unnumbered topical headings; ends on the graduate question and then a single contact paragraph; no footer, no link list, no signature.

### Dropped or not stated (could not verify)
- Any Mongolia-specific scholarship rule (TaiwanICDF, MOE scholarship work limits): not checked; the article only says scholarship terms and school rules may add limits and were not examined.
- Whether the 20-hour cap is per employer or total across employers: statute silent; not stated.
- The foreign-graduate "points" scheme (僑外生留臺工作評點): I could not locate it in N0090031, N0090064 or the other N009 regulations; not mentioned.
- Any Mongolian student head-count.
- Whether Mongolian passport holders need a visa to enter (ledger says not on the visa-exempt list, but the article does not rely on it).

## Article 817: unpaid or short wages (P-WAGES)

### Reader and trigger
A Mongolian employee in Taiwan (any employment under the Labor Standards Act: restaurant, shop, factory, office, or a student with a permit) whose pay arrives late or short, overtime is not paid, or "breakage" is deducted. Trigger: the worker needs a record of hours and a route to complain before deciding to leave.

### Why this topic fits Mongolia
Hypothesis. The wage rules do not depend on nationality (LSA art. 2(1) defines 勞工 by employment relationship). The ledger shows Mongolia as a named blue-collar source country with zero stock, so I did not write a factory-closure or arrears-fund article (already done in th/660 and fr/678). I chose the evidence-and-procedure angle that applies to any category of employee, and linked to 816 for workers whose own permit status is unclear.

### Overlap and new angle
- th/660 and fr/678 (arrears fund after closure), es/692, pt/698. mn 008/009 (severance, voluntary resignation). New angle: attendance record as evidence (LSA 30(5)-(6), Labor Case Act 38), wage statement and deductions (22, 23, 26), minimum wage 2026/2027, overtime formula (24), the three procedural doors (LSA 27 order; Labor Dispute Settlement Act 9 mediation; Labor Case Act 12/16 court), and the permit consequences of leaving (ESA 73(3), 74(1)).
- I deliberately did not repeat the arrears-fund conditions.

### Claim to source table
| Claim | Source | Chinese text checked |
|---|---|---|
| Employer keeps attendance records 5 years, to the minute; worker may get a copy and employer may not refuse | LSA art. 30 paras. 5, 6 (N0030001) | 雇主應置備勞工出勤紀錄，並保存五年。前項出勤紀錄，應逐日記載勞工出勤情形至分鐘為止。勞工向雇主申請其出勤紀錄副本或影本時，雇主不得拒絕。 |
| Recorded attendance time presumed to be duty time with employer's consent | Labor Case Act art. 38 (B0010064) | 出勤紀錄內記載之勞工出勤時間，推定勞工於該時間內經雇主同意而執行職務。 |
| Worker defined by employment relationship | LSA art. 2(1) | 勞工：指受雇主僱用從事工作獲致工資者。 |
| Pay at least twice a month unless special agreement or monthly advance; itemised calculation; ledger kept 5 years | LSA art. 23 | 除當事人有特別約定或按月預付者外，每月至少定期發給二次，並應提供工資各項目計算方式明細…工資清冊應保存五年。 |
| Legal tender (part in kind if contract says so); full and direct payment unless law or agreement otherwise | LSA art. 22 | 應以法定通用貨幣為之。但基於習慣或業務性質，得於勞動契約內訂明一部以實物給付之。…工資應全額直接給付勞工。但法令另有規定或勞雇雙方另有約定者，不在此限。 |
| No pre-withholding of wages as penalty or compensation; no agreement exception in the text | LSA art. 26 | 雇主不得預扣勞工工資作為違約金或賠償費用。 |
| Minimum wage 2026: NT$196 hourly, NT$29,500 monthly; 2027-01-01: NT$205 / NT$30,900 | MOL page https://www.mol.gov.tw/1607/28162/28166/28180/70460/76761/ (fetched by WebFetch) | 民國114年10月21日發布，自115年1月1日起實施，訂定每月最低工資為29,500元，每小時最低工資為196元。 / 民國115年10月16日發布，自116年1月1日起實施，訂定每月最低工資為30,900元，每小時最低工資為205元。 |
| Agreed wage below minimum is replaced by the minimum; Act covers LSA workers | Minimum Wage Act arts. 5, 3 (N0030028) | 勞工與雇主雙方議定之工資，不得低於最低工資；其議定之工資低於最低工資者，以本法所定之最低工資為其工資數額。 / 本法之適用對象為適用勞動基準法之勞工。 (LSA art. 21 still says 基本工資; I cite the Act and MOL page for the figure) |
| 8 h/day, 40 h/week; redistribution rules in paras. 2-3 for designated industries | LSA art. 30 paras. 1-4 | 勞工正常工作時間，每日不得超過八小時，每週不得超過四十小時。…前二項規定，僅適用於經中央主管機關指定之行業。 |
| Overtime: first 2 hours plus at least 1/3, next 2 hours plus at least 2/3; rest-day rate higher (para. 2) | LSA art. 24 | 延長工作時間在二小時以內者，按平日每小時工資額加給三分之一以上。二、再延長工作時間在二小時以內者，按平日每小時工資額加給三分之二以上。 |
| Authority may order payment within a time limit; non-compliance fine NT$20,000-1,000,000 | LSA art. 27; art. 79(1)(2) | 雇主不按期給付工資者，主管機關得限期令其給付。 / 違反主管機關依第二十七條限期給付工資…之命令。…處新臺幣二萬元以上一百萬元以下罰鍰。 |
| Mediation application goes to the local authority where work is performed, in writing | Labor Dispute Settlement Act arts. 9, 10 (N0020007) | 向勞方當事人勞務提供地之直轄市或縣（市）主管機關提出調解申請書。 |
| Court labor mediation before suit, direct filing deemed a mediation request | Labor Case Act art. 16 | 勞動事件，除有下列情形之一者外，於起訴前，應經法院行勞動調解程序。…前項事件當事人逕向法院起訴者，視為調解之聲請。 (I wrote "ерөнхийдөө" because of the listed exceptions) |
| Two-thirds of the court fee temporarily waived for wage suits | Labor Case Act art. 12 | 因確認僱傭關係或給付工資、退休金或資遣費涉訟，勞工或工會起訴或上訴，暫免徵收裁判費三分之二。 |
| Central authority may assist worker litigation | Labor Dispute Settlement Act art. 6(3) | 勞方當事人有下列情形之一者，中央主管機關得給予適當扶助：一、提起訴訟。 |
| Worker may end contract without notice if employer does not pay as the contract requires; 30-day period in para. 2 is written for items 1 and 6; art. 17 applies by para. 4 | LSA art. 14 | 五、雇主不依勞動契約給付工作報酬…勞工依前項第一款、第六款規定終止契約者，應自知悉其情形之日起，三十日內為之。…第十七條規定於本條終止契約準用之。 |
| Severance formula depends on pension system | Labor Pension Act art. 12(1) (N0030020) | 其資遣費由雇主按其工作年資，每滿一年發給二分之一個月之平均工資…不適用勞動基準法第十七條之規定。 (art. 7 lists who is covered) |
| Permit revoked on 3 consecutive days absence with loss of contact, or end of employment; then order to leave and no further work unless Act provides otherwise | ESA art. 73(3), 74(1) | 三、連續曠職三日失去聯繫或聘僱關係終止。 / 除本法另有規定者外，應即令其出國，不得再於中華民國境內工作。 |

### First-two-paragraph deletion test
- P1 S1 is the reader's search question. Deleting it keeps every fact, but it states what the paragraph answers; I kept it as the one question-type opening in the batch (816 opens on a number, 818 on a document name). P1 S2 (employer's duty, 5 years, to the minute) and S3 (copy cannot be refused): kept.
- P2 S1 (presumption and its effect) kept after merging with the "effect" sentence that failed the test on its own. P2 S2 (worker definition, nationality not a criterion): kept, short.

### Same-language comparison and changes
Same as above for 008/014/016. 817 uses unnumbered headings that name the issue (statement, noun phrase, question, statement), opens on a question, and ends with the permit/status warning and a contact paragraph. The signed footer and link lists of 014/016 are not copied.

### Dropped or not stated
- Limitation period for wage claims: not verified, not stated.
- Rest-day overtime figures: not written out; the text only says para. 2 sets higher rates.
- Hotline numbers (e.g. a MOL hotline) left out under the contact rule.
- Whether a worker without a valid permit can still claim wages: not stated; the article only separates the wage question from the status risk.
- Arrears-fund (積欠工資墊償基金) rules: left to th/660 and fr/678 for this reason (different trigger).

## Article 818: scooter accident (L-TRAFFIC)

### Reader and trigger
A Mongolian student (or other resident) who rides a scooter or motorcycle in Taiwan and has been in an accident, as injured rider or as the person who injured someone, and may not hold a Taiwanese licence. Trigger: what the police can give, who pays medical costs, and what an unlicensed or foreign-licensed rider faces.

### Why this topic fits Mongolia
Hypothesis: scooters are a normal means of transport for students in Taiwan; the article does not claim a number. The country-specific part is the licence question: the Road Traffic Safety Rules route foreign licences through reciprocity (art. 55-1), and the ledger marks Mongolia's recognition UNVERIFIED, so the article says it cannot confirm and tells the reader to ask the highway supervision authority.

### Overlap and new angle
- mn 003 (general traffic-accident Q&A) and 012 (overtaking) exist; th/662 is about returning home with records; en/611 is a dashcam scene. New angle: the unlicensed or foreign-licensed rider (licence rules, fine, insurer recourse under CIA art. 29(5)), no-fault compulsory insurance with the NT$200,000 medical cap, the hit-and-run rule that does not depend on a licence, and the three clocks (7/30 days, 6 months, 2 years). I linked to 003 for the general procedure.

### Claim to source table
| Claim | Source | Chinese text checked |
|---|---|---|
| Registration slip at the scene; scene diagram and photos after 7 days; preliminary analysis table after 30 days | Accident Handling Rules art. 13 (D0080090); NPA FAQ https://www.npa.gov.tw/ch/app/faq/view?id=2144&module=faq&serno=A1084129 (updated 114-10-15) | 一、於事故現場得申請提供道路交通事故當事人登記聯單。二、於事故七日後得申請閱覽或提供現場圖、現場照片。三、於事故三十日後得申請提供道路交通事故初步分析研判表。 |
| Online system for accidents with injury or death; pick-up at nearest station; other party's address available from police for appraisal, letter, mediation, provisional attachment or suit | NPA FAQ (same page) | 有人員受傷或死亡之交通事故…可至本署全球資訊網/交通事故資料申請…並可指定就近分局或交通（大）隊取件。 / 因申請鑑定、寄發存證信函、聲請調解、假扣押或提起訴訟等…得向處理警察機關提出申請 |
| Duties at the scene: rescue, notify fire authority, do not move vehicle or traces (exceptions), notify police | Accident Handling Rules art. 3 | 有受傷者，應迅予救護，並儘速通知消防機關。…不得任意移動肇事汽車及現場痕跡證據。…通知警察機關，並配合必要之調查。 |
| Fine NT$3,000-9,000 for breaching those duties after injury or death | Penalty Act art. 62(3) (K0040012) | 肇事致人受傷或死亡者，應即採取救護措施及依規定處置，並通知警察機關處理，不得任意移動肇事汽車及現場痕跡證據，違反者處新臺幣三千元以上九千元以下罰鍰。 |
| "Motor vehicle" includes motorcycles | Penalty Act art. 3(8) | 車輛：指非依軌道電力架設，而以原動機行駛之汽車（包括機車）、慢車及其他行駛於道路之動力車輛。 |
| Fleeing after injury: 6 months to 5 years; reduced or exempt if driver faultless; no licence condition | Criminal Code art. 185-4 (C0000001) | 駕駛動力交通工具發生交通事故，致人傷害而逃逸者，處六月以上五年以下有期徒刑…犯前項之罪，駕駛人於發生交通事故致人死傷係無過失者，減輕或免除其刑。 |
| Foreign licence usable on reciprocity basis for the same class; MOTC announces details | Road Traffic Safety Rules art. 55-1 (K0040013) | 外國政府或地區所發有效之正式駕駛執照，得依平等互惠原則在我國使用，並准予在我國境內駕駛同等車類之汽車。前項互惠原則…交通部應公告 |
| IDP of a reciprocal country: stays up to 30 days without endorsement; longer needs endorsement, valid at most one year | art. 55 | 持有互惠國所發有效之國際駕駛執照，在我國境內作三十天以內之短期停留者，准予免辦簽證駕駛汽車；如停留超過三十天者，仍應向公路監理機關辦理簽證。…國際駕駛執照之簽證最長為一年 |
| Exchange of foreign licence without test for holders with 6+ months' permitted stay; authentication; Chinese translation if not English; same class | art. 50 para. 6 | 取得經許可停留或居留六個月以上之證明（件）者，得於入境之翌日起依平等互惠原則免考換發同等車類之普通駕駛執照。…六、其他國家或地區所發駕駛執照，應經我駐外使領館…驗證。七、前款之駕駛執照為英文以外之外文者，應附中文譯本 |
| Unlicensed motorcycle rider: fine NT$18,000-36,000 and on-the-spot impound | Penalty Act art. 21(1)(1) | 機車駕駛人處新臺幣一萬八千元以上三萬六千元以下罰鍰…並均當場移置保管該汽機車：一、未領有駕駛執照駕駛小型車或機車。 (same range in the in-force text and in the 2026-08-17 text that has no effective date) |
| No-fault entitlement against insurer or Special Compensation Fund | Compulsory Insurance Act art. 7 (G0390060) | 不論加害人有無過失，請求權人得依本法規定向保險人請求保險給付或向特別補償基金請求補償。 |
| Injured person is the claimant; no nationality in definition | art. 11(1)(1) | 因汽車交通事故遭致傷害者，為受害人本人。 |
| Medical costs: necessary and reasonable actual costs, NT$200,000 per victim per accident | Benefit Standards art. 2 (G0390067, amended 2026-05-29, no banner) | 以其必須且合理之實際支出之相關醫療費用為限。但每一受害人每一事故之傷害醫療費用給付總額，以新臺幣二十萬元為限。 |
| Insurer pays within 10 working days after documents are complete | art. 25(2) | 保險人應於被保險人或請求權人交齊相關證明文件之次日起十個工作日內給付之 |
| Scooter owner must insure; fine NT$1,500-3,000 on roadside inspection | art. 6; art. 49(1)(1) | 應訂立本保險契約之汽車所有人應依本法規定訂立本保險契約。 / 為機車者，處新臺幣一千五百元以上三千元以下罰鍰 |
| Unlicensed driving: insurer still pays but may subrogate against the insured | art. 29(5) | 五、違反道路交通管理處罰條例第二十一條或第二十一條之一規定而駕車。…保險人仍應依本法規定負保險給付之責。但得在給付金額範圍內，代位行使請求權人對被保險人之請求權 |
| Insurance payment counts toward the insured's damages | art. 32 | 保險人依本法規定所為之保險給付，視為被保險人損害賠償金額之一部分；被保險人受賠償請求時，得扣除之。 |
| Driver liable for damage while using a motor vehicle unless due care taken | Civil Code art. 191-2 (B0000001) | 汽車、機車…在使用中加損害於他人者，駕駛人應賠償因此所生之損害。但於防止損害之發生，已盡相當之注意者，不在此限。 |
| Loss of earning capacity and increased needs; non-pecuniary damages for serious infringement | art. 193(1); art. 195(1) | 喪失或減少勞動能力或增加生活上之需要 / 情節重大者，被害人雖非財產上之損害，亦得請求賠償相當之金額 |
| Court may reduce or exclude damages for contributory fault | art. 217(1) | 損害之發生或擴大，被害人與有過失者，法院得減輕賠償金額，或免除之。 |
| 2 years from knowing damage and liable person; 10 years from the act | art. 197(1) | 自請求權人知有損害及賠償義務人時起，二年間不行使而消滅，自有侵權行為時起，逾十年者亦同。 |
| Negligent injury: up to 1 year / detention / fine; serious injury up to 3 years; complaint required | Criminal Code art. 284, 287 | 因過失傷害人者，處一年以下有期徒刑、拘役或十萬元以下罰金；致重傷者，處三年以下有期徒刑、拘役或三十萬元以下罰金。 / 第二百八十四條之罪，須告訴乃論。 |
| Complaint within 6 months of knowing the offender | Code of Criminal Procedure art. 237 (C0010001) | 告訴乃論之罪，其告訴應自得為告訴之人知悉犯人之時起，於六個月內為之。 |

### First-two-paragraph deletion test
- P1: S1 (the registration slip is the first document) and S2 (it can be requested at the scene, art. 13(1)): both carry information. A third sentence ("other documents come later") was deleted because P2 says it.
- P2: S1 (7 days), S2 (30 days), S3 (these are the days you may start asking, not delivery dates): kept; S4 (online system for injury accidents) and S5 (other party's address): kept as new facts from the NPA page.

### Same-language comparison and changes
003 is a long Q&A with numbered sections and a closing link list; 012 (not re-read here beyond its slug and title) is on overtaking liability. 818 opens on a document, has four topical headings that mix statement, question and noun phrase, ends on the three deadlines plus a link to 003 and then the contact paragraph.

### Dropped or not stated
- Whether a Mongolian licence or IDP is accepted, for how long, and for which class: UNVERIFIED in the ledger; the article states the rule and says it does not confirm Mongolia.
- Whether an injured but unlicensed rider's own claim against the other vehicle's insurer is reduced or barred: CIA art. 28 excludes only intentional acts and crimes; I did not add a conclusion about unlicensed victims.
- Disability and death benefit amounts: not needed; only the medical cap is stated.
- Exit-ban risk for foreign defendants (see en/644): left out to keep scope; the article does not discuss leaving Taiwan.
- Any claim about how often students ride unlicensed.
- Topic code: I set `topic: "litigation"` (as th/662 and en/611 did) and did not add the `criminal-litigation` tag because the article is a civil/insurance/procedure piece that mentions only negligent injury and hit-and-run; the tag rule applies to criminal topics.

## Frontmatter and format checks
- Fields in the order required; YAML parsed with Ruby `YAML.safe_load`; `categories` is the string used by existing mn columns ("Тайванийн эрх зүйн мэдээлэл"); `date_display` "2026.10.24" and `read_time` "N мин" follow existing mn columns (2025.09.13 / "9 мин").
- Images from IMAGE-MENU: 816 uses I13, 817 uses I15, 818 uses I22; no image reused; captions are the translated standard caption; alt text describes only what the menu lists.
- No bold, no H1, no author footer, no phone numbers or addresses, email and `/mn/contact` only; each article says consultations are in English, Chinese, Japanese or Korean, that the Mongolian text is no promise of consultation in Mongolian, and that an email creates no lawyer-client relationship. First-email content list follows the brief (no ID copies, bank data or full originals).
- Internal links used (all exist or are my own slugs): 816 to 817; 817 to `taiwan-labor-severance-law` (008), `taiwan-voluntary-resignation-severance` (009), 816; 818 to `taiwan-traffic-accident-procedure` (003). None of 001, 004, 005, 006, 010 is linked.
- Every link in a body appears in its Sources list and every Sources link appears in the body (checked by script).
- Sources section: "Эх сурвалж", "2026 оны 10 дугаар сарын 24-нд шалгасан.", then the bulleted list.

## Counts
| File | Words in body before Sources (including headings) | Prose words only | Words including Sources list |
|---|---|---|---|
| 816 | 691 | 672 | 765 |
| 817 | 741 | 720 | 831 |
| 818 | 808 | 785 | 952 |

## Sentence-variety measurements (own script, thresholds from the rule)
| File | Sentences | Mean words | CV (needs 0.45 or more) | Share of sentences of 8 words or fewer (needs 8 percent or more) | 3-in-a-row similar length | Paragraphs sharing a first word | Consecutive sentences sharing a first word |
|---|---|---|---|---|---|---|---|
| 816 | 40 | 16.8 | 0.49 | 0.20 | 1 of 38 | 2 (Ажил) | 0 |
| 817 | 43 | 16.7 | 0.48 | 0.16 | 1 of 41 | 2 (Цалингийн) | 0 |
| 818 | 49 | 16.0 | 0.49 | 0.16 | 7 of 47 | none | 0 |

Self-check items 2 to 7: no stock hypothetical opener and no invented scene; opening types are number (816), reader question (817) and document name (818); each article has several sentences of 2 to 7 words and a paragraph without a citation; "X, not Y" frames: 1 to 2 per article; the last body paragraph before the contact paragraph is bound to the article's own facts (graduate step; permit and status; the three deadlines).
