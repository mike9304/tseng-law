# ne author work note (columns 819-821, Nepali)

Batch root: /Users/son7/tseng-world-columns-20261024. Date checked: 24 October 2026. All statute text was fetched with `python3 tools/law.py` (law.moj.gov.tw LawAll); WDA and NIA pages fetched with curl. The note is in English; the articles are in Nepali (Devanagari).

Files:
- drafts/ne/819-nepali-student-taiwan-part-time-work-permit-20-hours.md (P-STUDENT)
- drafts/ne/820-nepali-graduate-taiwan-stay-work-after-degree-points.md (P-WORK, staying on after graduation)
- drafts/ne/821-nepali-student-taiwan-bank-account-easy-job-police.md (L-ACCOUNT)

Law versions seen (no "not yet in force" banner printed for any statute cited): Employment Service Act N0090001 last amended 2025-01-20; Employment-permit regulations N0090027 2025-12-30; Fee standards N0090030 2025-12-31 (amended provisions effective 2026-01-01, Art. 6); Foreign Professionals Act A0030295 2025-09-24; Residence regulations D0080129 2025-12-30; Qualification standard N0090031 2024-08-01; International-student regulations H0110001 2025-09-19; Immigration Act D0080132 2023-06-28; Money Laundering Control Act G0380131 2024-07-31; Criminal Code C0000001 2026-07-22; Code of Criminal Procedure C0010001 2026-05-13. The Fraud Crime Hazard Prevention Act (D0080226) carries a "partly not yet in force" banner; it is NOT cited in any article.

Style tool: variety_metrics.py has no `ne` profile. I ran it with `--lang hi` (Devanagari, same sentence mark) as an approximation: 819 cv=0.50 short=0.17; 820 cv=0.63 short=0.12; 821 cv=0.48 short=0.11; all three "OK — no variety limit violated". The contrast counter does not know Nepali patterns, so I checked contrast frames by hand: at most two "not X" contrasts per article, none rebutting a claim the reader did not make.

Nepal facts from research/country-facts.md (rows are marked as list-membership inferences): no visa exemption, no working-holiday programme, no in-force tax treaty, Nepal NOT among the six countries opened for ordinary blue-collar recruitment (MOL March 2026 report). No article states any of these; I used the last one only as evidence for the reader profile below. Marriage interview (Nepal listed) is outside my three topics.

---

## 819 — Part-time work permit for Nepali students (P-STUDENT)

Reader and trigger: a Nepali student (degree or Chinese-language centre) in Taiwan who has been offered shifts by a friend or an employer, or who wants income, and does not know that the ARC is not a work permit. Trigger moments: a friend says "everyone does it", an employer says the paperwork can come later, or the school's international office asks questions.

Why this fits Nepal: hypothesis, labelled as such. The ledger shows Nepal is not on MOL's six-country blue-collar recruitment list (inference from list absence), so Nepali residents in Taiwan are more likely to be students, researchers, professionals and spouses than factory or caregiver workers. I did not verify a Nepali student head-count (an MOE statistics search returned no Nepal-specific figure), so the article states no numbers and no claim about how many Nepali students work.

Overlap and angle: English 607 (student permit and 20-hour week) and English 637 (side gig for another employer) cover the same statutes. I kept the verified legal structure but changed the angle: (1) a conditions-first walk-through of Reg. 50/51 (two cumulative conditions, school certification, the six-month language-course rule, the two exemptions); (2) the consequence chain for student AND employer AND school (Reg. 23/24 of the student regulations); (3) a pointer forward to the three-year look-back (Std. 2-1) that is developed in 820. No court case is cited (I could not fetch the judgment page, see dropped statements).

Claim → source (Chinese text checked on 24 Oct 2026):

| Claim in article | Source | Excerpt checked |
|---|---|---|
| Foreigners may not work without a permit applied for by the employer, unless the Act provides otherwise | ESA Art. 43, https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43 | 除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。 |
| 20 hours a week except winter/summer vacation; foreign students at public or registered private colleges | ESA Art. 50 item 1 (flno=50) | 其工作時間除寒暑假外，每星期最長為二十小時：一、就讀於公立或已立案私立大專校院之外國留學生。 |
| Student must hold foreign-student status under the student regulations | Reg. 50 (N0090027, flno=50) | 應符合外國學生來臺就學辦法規定之外國學生身分。 |
| Two cumulative conditions: formal enrolment OR language course 6+ months; AND school-certified fact (finances cannot sustain study and living with concrete proof, OR teaching/research unit needs the student) | Reg. 51 para 1 (flno=51) | 一、正式入學修習科、系、所課程，或學習語言課程六個月以上。二、經就讀學校認定具下列事實之一者：（一）…財力無法繼續維持其學業及生活，並能提出具體證明。（二）…教學研究單位須外國留學生協助參與工作。 |
| Two exemptions from para 1 (graduate research with school consent; language specialist with MOE special approval) | Reg. 51 para 2 | 二、就讀研究所，並經就讀學校同意從事與修習課業有關之研究工作。 / 具語文專長，且…並經教育部專案核准 |
| WDA timing: enrolled students may apply after admission; language students after 6 months | WDA page https://ezworktaiwan.wda.gov.tw/cp.aspx?n=99329239A3FBA2BB (updated 112-06-12 = 2023-06-12) | 入學後即可向機關申請，惟來臺學習語言課程之外國留學生，則須修業6個月以上，方可提出申請。 |
| Permit valid at most 1 year; 20 hours except vacation | Reg. 54 (flno=54) | 第四類外國人之工作許可有效期間，最長為一年。…其工作時間除寒暑假外，每星期最長為二十小時。 |
| No separate hour figure for vacation weeks | Reg. 54 / ESA 50 (absence of a number; wording is 除寒暑假外) | same texts |
| Application needs form, fee receipt, other documents | Reg. 53 (flno=53) | 應備下列文件：一、申請書。二、審查費收據正本。三、其他經中央主管機關規定之文件。 |
| Fee NT$100 per application; amended provisions effective 1 Jan 2026 | Fee standards Art. 4 (N0090030, flno=4); Art. 6 (flno=6) | 外國人申請工作許可，應繳納審查費每件新臺幣一百元。 / 本標準修正條文自中華民國一百十五年一月一日施行。 |
| Fine NT$30,000-150,000 for violating Art. 43; violator ordered to leave at once and may not work again | ESA Art. 68 paras 1 and 3 (flno=68) | 違反第…四十三條…規定者，處新臺幣三萬元以上十五萬元以下罰鍰。 / 違反第四十三條規定之外國人，應即令其出國，不得再於中華民國境內工作。 |
| Foreigners must not engage in activity inconsistent with the reason for stay/residence | Immigration Act Art. 29 para 1 (D0080132, flno=29) | 外國人在我國停留、居留期間，不得從事與許可停留、居留原因不符之活動。 |
| NIA may deport or order departure within 10 days for that breach (discretionary) | Immigration Act Art. 36 para 2 item 4 (flno=36) | 移民署得強制驅逐出國，或限令其於十日內出國…四、違反第二十九條第一項規定，從事與許可停留、居留原因不符之活動。 |
| School/authority must act once violation of ESA verified; school must report suspension, withdrawal, loss of status to BOCA and NIA service stations | Student regs Art. 23, 24 (H0110001) | 外國學生有違反就業服務法之規定經查證屬實者，學校或相關主管機關應即依規定處理。 / 學校應通報外交部領事事務局及…內政部移民署各服務站，並副知本部。 |
| Employer: may not hire unpermitted foreigner; fine NT$150,000-750,000; repeat within 5 years: imprisonment up to 3 years, detention, or fine up to NT$1,200,000, or both | ESA Art. 57 item 1 (flno=57); Art. 63 (flno=63) | 聘僱未經許可…之外國人。 / 處新臺幣十五萬元以上七十五萬元以下罰鍰。五年內再違反者，處三年以下有期徒刑、拘役或科或併科新臺幣一百二十萬元以下罰金。 |
| Three-year look-back (pointer only; detailed in 820) | Std. Art. 2-1 (N0090031, flno=2-1) | 於申請日前三年內不得有下列情事之一：一、未經許可從事工作。二、為申請許可以外之雇主工作。 |

First-two-paragraph deletion test:
- P1 sentence 1 (20-hour rule with link): kept, it is the reader's number and the legal source. P1 sentence 2 (permit must come first, Art. 43): kept; removing it loses the condition that the cap only matters once a permit exists. I cut a draft sentence "यो सीमा अनुमति पाइसकेपछिको कुरा हो।" and merged it into sentence 2 because it duplicated it.
- P2 sentence 1 (ARC is a residence document): kept, it names the misconception; sentence 2 (why: Art. 43 asks for a permit) kept, it is the only place the ARC point is tied to a provision. "म्याद एक वर्ष।" was deleted from the body (it repeated the preceding clause).

Comparison with three existing ne columns (008, 014, 016):
- Openings: 008 opens with a first-person greeting from the lawyer ("नमस्ते, म ताइवानकी अधिवक्ता…") and a comparison to Korea; 014 opens with a long definitional paragraph followed by four numbered questions; 016 opens with a long list of questions. 819 opens with a single number ("20 घण्टा।") and the provision that gives it.
- Headings: 014 and 016 use numbered headings ("## 1. …", "## 2. …") and the same "जाँच सूची" pattern; 819 uses four unnumbered topic headings named by this article's issues (who may apply; weekly cap, term and fee; working without a permit; whether an activity is work).
- Endings: 008/014/016 end with a "सम्बन्धित मार्गदर्शन" link list, a generic disclaimer paragraph and a lawyer signature line. 819 ends with a restrained contact paragraph (email, /ne/contact, language arrangement, what to send) then the Sources list; no signature, no disclaimer boilerplate, no bold, no H1.

Length: about 719 Nepali words in the body before Sources (about 816 including the Sources list); body about 4,760 characters.

---

## 820 — Staying on and working after a Taiwan degree (P-WORK)

Reader and trigger: a Nepali graduate (or final-year student/researcher) in Taiwan whose ARC is about to expire after graduation and who has not yet got an employer to apply for a work permit.

Why this fits Nepal: hypothesis, same basis as 819 (students and professionals are the likely Nepali residents; no Nepal-specific headcount used). The topic is assignments-driven ("staying on to work after graduation") and the legal routes apply to any foreign graduate.

Overlap and angle: English 607 has two paragraphs on "after the degree" (fresh-graduate exemption and extension). I did not repeat them as a side note; the article is organised around the decision a graduate faces: (1) ARC extension (deadline, one + one year, NIA item 14 on returning the card), (2) what work is allowed during the extension (and what is not: language-course-only students), (3) the employer-sponsored route (Std. Art. 5 and 8), (4) the Taiwan-graduate points route (Std. Art. 5-1, 70 points, the appendix values), (5) how unpermitted student work can reach into the three-year look-back (Std. Art. 2-1). English 705 mentions Art. 12 only in a sentence.

Claim → source:

| Claim | Source | Excerpt checked |
|---|---|---|
| Student who studied in Taiwan may apply for extension after graduation before residence expires; spouse, minor children and disabled adult children included; +1 year from the day after expiry; one more extension before it ends; total max 2 years | Residence regs Art. 11 (D0080129, flno=11) | 來臺就學之外國人畢業後，於居留期限屆滿前…得向移民署申請延期居留。…自原居留期限屆滿之翌日起延期一年；延期屆滿前，有必要者，得再申請延期居留一次，總延期居留期間最長為二年。 |
| NIA instructions repeat the periods (item 10(2)); item 14: formal students not extending on another (job-seeking) ground must return the card and depart | NIA page https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/ (updated 2026-01-19) | 依本辦法第十一條申請者，得申請延期一年；…總延期居留期間最長為二年 / 外籍(僑)正式學籍學生畢業後，如不以其他(覓職)事由延期居留，請至居留地服務站繳回居留證並辦理離境手續。 |
| Associate degree or higher from Taiwan; fresh graduate; during NIA-permitted extension may work without applying for a work permit | Foreign Professionals Act Art. 12 (A0030295, flno=12) | 外國人取得我國副學士以上學位者，以應屆畢業生之身分依法取得內政部移民署許可延期居留期間，在我國從事工作，得免申請工作許可。 |
| No restriction on kind of work, up to 2 years; professional licensing still required (e.g. physician) | WDA page https://ezworktaiwan.wda.gov.tw/cp.aspx?n=511766BD9E956242 (updated 115-01-30 = 2026-01-30) | 從事工作類別無限制，最長2年。…若依其他法規，應先取得專業資格證明或執業登記始得從事(如醫師) |
| Employer-applied permit needed after that | ESA Art. 43 | as above |
| Four qualification alternatives for professional work | Std. Art. 5 (N0090031, flno=5) | 一、依專門職業及技術人員考試法規定取得證書或執業資格者。二、取得國內外大學相關系所之碩士以上學位者，或取得相關系所之學士學位而有二年以上相關工作經驗者。三、服務跨國企業滿一年以上經指派來我國任職者。四、經專業訓練，或自力學習，有五年以上相關經驗，而有創見及特殊表現者。 |
| Salary may not be below the announced amount; WDA page gives NT$47,971 monthly average | Std. Art. 8 (flno=8); WDA https://ezworktaiwan.wda.gov.tw/cp.aspx?n=98C816CDB81AA655 (updated 113-01-30 = 2024-01-30) | 其薪資或所得報酬不得低於中央主管機關公告之數額 / 月平均薪資…須達新台幣4萬7,971元 (the article flags the figure as dated and to be checked) |
| Points route: Taiwan bachelor+ or associate in manufacturing/construction/agriculture/long-term care/e-commerce etc.; 70 points under the appendix; not bound by Art. 5 | Std. Art. 5-1 (flno=5-1); WDA https://ezworktaiwan.wda.gov.tw/cp.aspx?n=2991AC80BCDA014A&s=E5050066696D7100 (updated 113-08-06) | 依附表計算之累計點數滿七十點者，得受聘僱從事第四條之工作，不受前條規定之限制 |
| Appendix values: degrees 30/20/10/5; salary NT$47,971+ = 40, NT$40,000-47,970 = 30, NT$35,000-39,999 = 20, NT$31,520-34,999 = 10; Mandarin test levels 流利/高階/進階 = 30/25/20; full-time experience 2+ years = 20 | Appendix PDF (law.moj.gov.tw LawGetFile FileId=0000372963, downloaded and read 24 Oct 2026); WDA table page https://ezworktaiwan.wda.gov.tw/cp.aspx?n=2991AC80BCDA014A&s=AA9D36CA55662CED (updated 113-07-01) | 每月平均新臺幣四萬七千九百七十一元以上 四十 … 經華語文能力檢定達「流利」等級以上 三十 … 工作經驗二年以上 二十 |
| Three-year look-back for the Standard's work | Std. Art. 2-1 (flno=2-1), Art. 2 para 1 | 外國人從事前條所定工作，於申請日前三年內不得有下列情事之一：一、未經許可從事工作。二、為申請許可以外之雇主工作。… |

The article says only that student part-time work done without a permit "may fall" in the three-year window; it says explicitly that how the agency applies it to a given application was not checked.

First-two-paragraph deletion test:
- P1 sentence 1 (question): kept, it states the reader's problem. Sentence 2 (extension can be applied for; work without permit during it): kept. Sentence 3 (not automatic for every graduate; approval not by application alone): kept, removing it would overstate Art. 11 and Art. 12.
- P2 sentence 1 (apply before the ARC expires): kept (deadline). Sentence 2 (nothing in the cited rule about applying after expiry): kept as the limit of what was verified.

Comparison with three existing ne columns: 008 first-person greeting and Korea comparison; 014/016 definitional/list openings with numbered headings and a final "सम्बन्धित मार्गदर्शन" list, disclaimer and signature. 820 opens with the reader's own question and answers it in the next two sentences, uses five unnumbered topic headings (ARC extension; work during the extension; employer-applied permit; 70-point route; the three-year look-back), and ends with one link to the first-job contract column (014), a contact paragraph and Sources. The ending differs from 819 (which closes on the "is it work?" caution) and 821 (which closes on a note about the summons letter).

Length: about 753 Nepali words in the body before Sources (about 881 with the Sources list); about 4,800 characters.

---

## 821 — "Easy job" offers to lend a bank account or carry cash (L-ACCOUNT)

Reader and trigger: a Nepali student or researcher approached online with an offer to receive and forward money or lend an account (hypothetical message in the article, marked as such), or one who has already received a police notice.

Why this fits Nepal: hypothesis. The assignment lists L-ACCOUNT for Nepali students; the article uses student-specific consequences (scholarship or family money in the same account, school notification, ARC) rather than a claim that such offers circulate among Nepali students. No incidence figure is given.

Overlap and angle: Indonesian 666 and Thai 661 (migrant-worker versions) are structured around the recruitment chat and the bank "warning account" (警示帳戶) regulations. I kept Art. 22's structure but (a) dropped the FSC warning-account regulations (not re-verified, see dropped statements), (b) added the consequence chain specific to a foreign student: immigration revocation, deportation, school notice, exit restriction before a vacation trip, (c) added the escalation from account lending to cash carrying under Arts. 2/19 of the same Act and Criminal Code Arts. 13/30/339/339-4.

Claim → source:

| Claim | Source | Excerpt checked |
|---|---|---|
| No one may hand over or provide accounts (bank, virtual-asset service, third-party payment) to others; exceptions: commercial/financial custom, trust between relatives/friends, other proper reason | MLCA Art. 22 para 1 (G0380131, flno=22) | 任何人不得將自己或他人向金融機構申請開立之帳戶、向提供虛擬資產服務或第三方支付服務之事業或人員申請之帳號交付、提供予他人使用。但符合一般商業、金融交易習慣，或基於親友間信賴關係或其他正當理由者，不在此限。 |
| Police agency of municipal/county government issues a warning; same after 5 years | Art. 22 para 2 | 由直轄市、縣（市）政府警察機關裁處告誡。經裁處告誡後逾五年再違反前項規定者，亦同。 |
| Criminal penalty up to 3 years, detention, or fine up to NT$1,000,000 (or both) if consideration agreed/received, 3+ accounts, or re-offence within 5 years of a warning | Art. 22 para 3 | 處三年以下有期徒刑、拘役或科或併科新臺幣一百萬元以下罰金：一、期約或收受對價而犯之。二、交付、提供之帳戶或帳號合計三個以上。三、經…警察機關依前項或第四項規定裁處後，五年以內再犯。 |
| Warning must also be issued in cases of items 1 and 2 | Art. 22 para 4 | 前項第一款或第二款情形，應依第二項規定，由該管機關併予裁處之。 |
| Institutions must suspend/restrict/close such accounts (existing or new) for a period | Art. 22 para 5 | 應對其已開立之帳戶、帳號，或欲開立之新帳戶、帳號，於一定期間內，暫停或限制該帳戶、帳號之全部或部分功能，或逕予關閉。 |
| Laundering includes receiving/holding/using another's specified-offence proceeds and concealing them | MLCA Art. 2 items 1, 3 (flno=2) | 一、隱匿特定犯罪所得或掩飾其來源。…三、收受、持有或使用他人之特定犯罪所得。 |
| Penalties: below NT$100,000,000: 6 months-5 years plus fine up to NT$50,000,000; otherwise 3-10 years plus fine up to NT$100,000,000; attempt punishable | MLCA Art. 19 (flno=19) | 處三年以上十年以下有期徒刑，併科新臺幣一億元以下罰金。其洗錢之財物或財產上利益未達新臺幣一億元者，處六月以上五年以下有期徒刑，併科新臺幣五千萬元以下罰金。前項之未遂犯罰之。 |
| Intent includes foreseeing and not contrary to will | Criminal Code Art. 13 para 2 (C0000001, flno=13) | 行為人對於構成犯罪之事實，預見其發生而其發生並不違背其本意者，以故意論。 |
| Accessory liability even if the principal does not know; punishment may be reduced | Criminal Code Art. 30 | 幫助他人實行犯罪行為者，為幫助犯。雖他人不知幫助之情者，亦同。幫助犯之處罰，得按正犯之刑減輕之。 |
| Fraud up to 5 years; three or more persons jointly: 1-7 years | Criminal Code Arts. 339, 339-4 item 2 | 處五年以下有期徒刑、拘役或科或併科五十萬元以下罰金 / 處一年以上七年以下有期徒刑，得併科一百萬元以下罰金：…二、三人以上共同犯之。 |
| Police may summon suspect by notice; non-appearance without proper reason may lead to arrest warrant request | CCP Art. 71-1 (C0010001) | 得使用通知書，通知犯罪嫌疑人到場詢問。經合法通知，無正當理由不到場者，得報請檢察官核發拘票。 |
| Four things to tell suspect first; applies to police questioning | CCP Art. 95, Art. 100-2 | 犯罪嫌疑及所犯所有罪名…得保持緘默…得選任辯護人…得請求調查有利之證據 / 本章之規定，於司法警察官或司法警察詢問犯罪嫌疑人時，準用之。 |
| Interpreter when language not understood; applies to other persons questioned unless law provides otherwise | CCP Art. 99 | 被告為…語言不通者，應由通譯傳譯之；…前項規定，於其他受訊問或詢問人準用之。但法律另有規定者，從其規定。 |
| Exit restriction by prosecutor/judge: serious suspicion plus one of three conditions; written notice within 6 months | CCP Art. 93-2 | 被告犯罪嫌疑重大，而有下列各款情形之一者，必要時檢察官或法官得逕行限制出境、出海…前項書面至遲應於為限制出境、出海後六個月內通知。 |
| Residence permit revoked after final sentence of 1+ year imprisonment, except negligent offences or suspended sentence | Immigration Act Art. 32 item 3 (D0080132, flno=32) | 移民署對有下列情形之一者，撤銷或廢止其居留許可，並註銷其外僑居留證：…三、經判處一年有期徒刑以上之刑確定。但因過失犯罪或經宣告緩刑者，不在此限。 |
| Deportation may follow (discretionary) | Immigration Act Art. 36 para 2 item 8 | 移民署得強制驅逐出國…八、有第三十二條第一款至第三款規定情形，經撤銷或廢止居留許可，並註銷外僑居留證。 |
| Deportation after sentence may be ordered (discretionary) | Criminal Code Art. 95 | 外國人受有期徒刑以上刑之宣告者，得於刑之執行完畢或赦免後，驅逐出境。 |
| School must report loss of student status | Student regs Art. 24 | as in 819 |

First-two-paragraph deletion test:
- P1 sentence 1 (gist of Art. 22 para 1 with link): kept. Sentence 2 (scope beyond bank accounts, virtual-asset and third-party payment accounts): kept after merging former sentences 2 and 3 into one; the scope is in the statute and readers asked about e-wallets or exchange accounts would miss it.
- P2 sentence 1 (a hypothetical chat message, marked "यो काल्पनिक उदाहरण हो"): kept, it is the concrete situation; sentence 2 (the label "work" is not what the law examines): kept. A third sentence linking to 819 was moved out of the opening to the first section because it added no information to the opening.

Comparison with three existing ne columns: 008 opens with a greeting and a Korea comparison and ends with a lawyer signature; 014/016 open with abstract definitional paragraphs and numbered headings. 821 opens on the statute's own rule in one sentence, then a short marked hypothetical; headings are unnumbered and fact-named (from warning to criminal sentence; cash withdrawal and forwarding; after a police summons; effect of a sentence on the ARC and studies); the ending is the contact paragraph (which ends on the point that the summons letter should state whether the person is a suspect or a witness) followed by Sources, with no summary and no signature.

Length: about 817 Nepali words in the body before Sources (about 888 with Sources); about 5,090 characters.

---

## Statements dropped or kept out because they could not be verified

- Case law: the 2023 Taipei High Administrative Court judgment (111-Su-1020) used in English 637 could not be fetched (judgment.judicial.gov.tw returned nothing to curl). I therefore did not cite it, and did not assert that unpaid or gig work counts as work; 819 says only that the cited provisions do not settle whether volunteering, internships, tutoring or delivery apps are "work".
- Whether the fresh-graduate exemption in Foreign Professionals Act Art. 12 covers a given graduation date: "應屆畢業生" is not defined in the text checked; 820 says it was not checked and to confirm with NIA.
- Whether the employer-quota or additional requirements of the points route apply (WDA page title calls it a quota-based points system): not verified, so omitted.
- How NIA or WDA applies Std. Art. 2-1 to unpermitted student work in a real application: not checked; stated as a possibility only ("may fall").
- Current figure of the professional salary threshold (NT$47,971): taken from a WDA page dated 2024-01-30 and the appendix values; the article labels it as dated and says to check the current announcement. The points-table salary tiers match the law database appendix as of 24 Oct 2026.
- Effect of a mere police warning (告誡) on residence: not found in the sources used; 821 says so.
- Bank "warning account" (警示帳戶) regulations of the FSC used in Thai 661: not re-verified, omitted.
- Fraud Crime Hazard Prevention Act: has a not-yet-in-force banner and was not needed; omitted.
- Student scholarships' own conditions (e.g., government scholarship rules on work): not researched; 819 says they were not checked.
- No Nepal-specific country fact (visa, working holiday, tax treaty, land, marriage interview) is stated anywhere in the three articles.
- Nepali is not a language the style tool supports; the Nepali text was written by the model and has no native-speaker or lawyer review (not claimed in the articles).
