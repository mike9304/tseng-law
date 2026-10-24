# fil author note (Lane A, 801-803), checked 2026-10-24

Files:
- drafts/fil/801-filipino-caregiver-taiwan-patient-died-transfer-employer.md
- drafts/fil/802-filipino-factory-worker-taiwan-overtime-deductions-broker-fee.md
- drafts/fil/803-filipino-worker-taiwan-reported-missing-overstay-surrender.md

Method: every statute was fetched with `python3 tools/law.py <PCODE> <art>` (current text, no "尚未生效" banner for N0090001, N0090023, N0090027, N0090028, N0090029, N0030001, N0020007, D0080132, D0080224). All 40 LawSingle links and the 6 non-statute URLs in the drafts were re-fetched (HTTP 200 / article found). Official English law titles were taken from law.moj.gov.tw/ENG. Register: modern Filipino with the English administrative terms Filipino workers normally use (employer, broker, ARC, work permit, payslip, overtime, day off, mediation), "ka/mo" address as in fil 020. Variety checker does not support fil: ran `variety_metrics.py check` with `--lang en` and `--lang id` (Latin-script proxies) on all three: 0 FAIL on both (sentence-length CV 0.52-0.59, short sentences 14-17%, no contrast templates). That is a proxy only, not a Filipino measurement.

## Evidence that the topics fit Filipino readers

- MOL gender statistics (statdb.mol.gov.tw/html/woman/112/112genan12.pdf, end of 2023): industrial migrant workers from the Philippines 122,210 (61,034 men, 61,176 women; second to Vietnam, and the largest group among women, 44.1%); social-welfare migrant workers (caregivers, helpers) from the Philippines 27,161 (26,672 women). Same table 12-5: Filipino workers recorded as whereabouts-unknown 2,646 of 86,352 (about 3%).
- research/country-facts.md (migrant_worker_source, Philippines): YES, named as an opened source country in the MOL report revised 2026-03 (S40, fw.wda.gov.tw download).
- Consequence for angle: factory work is the largest Filipino segment, so 802 is the most commonly relevant article. Caregiving (801) is a smaller Filipino segment than Indonesian, labelled hypothesis: reader is a household caregiver or her family. 803: only about 3% of recorded missing workers in 2023 were Filipino, so the article is NOT framed as a typical Filipino situation; it is written for (a) workers reported missing falsely, (b) workers who left over wages or abuse, (c) families asking what happens. This is why the title says "na-report na nawawala" (the legal event) rather than naming a nationality trait.
- Also seen on official pages: WDA site menu has a Tagalog version; NIA site has a Philippines-language section. WDA 1955 page lists English, Thai, Indonesian, Vietnamese staff languages (no Tagalog), which the articles state plainly.

## Article 801 - caregiver whose care recipient died

Reader and trigger: Filipino household caregiver (or family member abroad) after the care recipient dies; the employer says "uwi ka na" or the worker does not know the transfer clock. Secondary: day off, abuse.

Overlap and new angle: id/664 covers unpaid wages for caregivers; en/649 covers general employer change. 801 covers the death/emigration ground (ESA art. 59(1)(1)) end to end: notice, 60-day transfer window, weekly coordination meeting, 14-day departure fallback, departure verification, then rest days (contract, not LSA) and abuse exceptions. Wage arrears are deliberately left to id/664.

| Claim in article | Source | Chinese text checked |
|---|---|---|
| Death or emigration of employer/care recipient is a transfer ground, MOL approval | ESA 59(1)(1) https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=59 | 雇主或被看護者死亡或移民者 ... 經中央主管機關核准，得轉換雇主或工作 |
| Employer notifies labor authority, NIA, police in writing within 3 days | ESA 56(1) ...&flno=56 | 雇主應於三日內以書面載明相關事項通知當地主管機關、入出國管理機關及警察機關 |
| End of employment is a ground for permit revocation | ESA 73(3) ...&flno=73 | 連續曠職三日失去聯繫或聘僱關係終止 |
| Order to leave unless the Act provides otherwise | ESA 74(1) ...&flno=74 | 除本法另有規定者外，應即令其出國，不得再於中華民國境內工作 |
| MOL sets the transfer deadline for art. 59 situations | Transfer Regs 4 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090023&flno=4 | 中央主管機關應限期外國人轉換雇主或工作 |
| Worker or old employer may apply; death certificate and consent document; authority may waive missing papers | Transfer Regs 2 ...&flno=2 | 得由該外國人或原雇主檢附 ... 死亡證明書 ... 外國人同意轉換雇主或工作之證明文件；未檢齊 ... 得由主管機關查證後免附 |
| 60 days from the day after registration; one 60-day extension; request within 14 days before the period ends | Transfer Regs 11(1), 11(5) ...&flno=11 | 翌日起六十日內 ... 延長 ... 六十日，並以一次為限；於原轉換作業期間屆滿前十四日內向中央主管機關申請 |
| Weekly public coordination meeting; bring passport/ARC unless unlawfully withheld; absence without reason = waiver | Transfer Regs 10 ...&flno=10 | 每週以公開協調會議方式；其護照及居留證遭非法留置者，不在此限；無正當理由不到場者，視同放棄轉換 |
| Transfer limited to the same job category (household helper, household/institutional care are one) | Transfer Regs 8 ...&flno=8 | 以原從事同一工作類別為限 ... 家庭幫傭工作、家庭看護工作 ... 機構看護工作 ... 為同一工作類別 |
| If no transfer or no-show, old employer arranges departure within 14 days of the day after the meeting, unless MOL approves special circumstances | Transfer Regs 11(3) | 協調會議翌日起十四日內，負責為該外國人辦理出國手續並使其出國。但外國人有特殊情形經中央主管機關核准者，不在此限 |
| Employer notifies local authority before departure after termination; authority ascertains and verifies the worker's true wishes | Permission Regs 68(2) https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=68 | 於聘僱許可有效期間因聘僱關係終止出國，應於該外國人出國前通知當地主管機關，由當地主管機關探求外國人之真意，並驗證之 |
| Household caregivers are not covered by the LSA; wage by agreement | MOL FAQ https://www.mol.gov.tw/1607/28162/28166/28180/28182/28188/29020/ | 目前「家庭類看護工」並非適用勞動基準法之工作者，其工資依勞雇雙方之約定辦理 |
| Rest and hours of household caregivers follow the contract; manufacturing, construction, institutional care covered by LSA with 2 rest days in 7 | WDA DHSC https://dhsc.wda.gov.tw/PreHireNotice?MenuId=176397ea-c6c8-49e2-83b2-107d1d7d3b80&ChildMenuId=2f140b2b-eb02-424b-9d9a-ca126c560972 | 家庭看護工及家庭幫傭的休假依勞雇雙方所簽訂的勞動契約辦理 ... 營造工作、製造工作、機構看護工作及海洋漁撈工作等，因為適用勞動基準法，勞工每７日中應有２日之休息 |
| Written fixed-term contract; permit term if none stated | ESA 46(3) ...&flno=46 | 須訂立書面勞動契約，並以定期契約為限；其未定期限者，以聘僱許可之期限為勞動契約之期限 |
| Contract in Chinese with translation in the worker's home script | Permission Regs 65 ...&flno=65 | 應以中文為之，並應作成該外國人母國文字之譯本 |
| MOL said in 2018 that required contract terms include enough rest and one day off per 7 days | MOL release 2018-06-10 https://www.mol.gov.tw/announcement/27179/36979/ | 必載之約定事項已包含雇主應提供足夠休息時間、每7天應給1天休假 (dated in the text; archived "歷史新聞") |
| Abuse: transfer not limited to same category (sexual assault, harassment, violent beating, trafficking victim) | Transfer Regs 8(1)(2) | 遭受性侵害、性騷擾、暴力毆打或經鑑別為人口販運被害人 |
| Abuse: extension not limited to once when permit revoked after bodily harm by employer, staff, entrusted manager, relative, care recipient | Transfer Regs 11(2) | 外國人受雇主或其僱用員工、委託管理人、親屬或被看護者人身侵害，經中央主管機關廢止聘僱許可者，其申請延長轉換作業期間得不受前項次數限制 |
| Employer may not force labour by violence or unlawfully hold passport/ARC | ESA 57(7),(8) ...&flno=57 | 以強暴脅迫或其他非法之方法，強制其從事勞動；非法扣留或侵占所聘僱外國人之護照、居留證件或財物 |
| Broker must report suspected assault/trafficking/deprivation of liberty/serious injury/homicide within 24 hours | ESA 40(1)(19) ...&flno=40 | 知悉受聘僱外國人疑似遭受雇主、被看護者或其他共同生活之家屬 ... 而未於二十四小時內向主管機關、入出國管理機關、警察機關或其他司法機關通報 |
| WDA 24-hour line: referral to labor bureau/police, legal-aid info, shelter referral, online interpretation; staff languages English, Thai, Indonesian, Vietnamese | WDA https://fw.wda.gov.tw/wda-employer/home/lazypg/index | 24小時無間斷；轉介 ... 地方政府勞工局或司法警察機關；線上即時通譯服務；英語、泰國語、印尼語、越南語 |
| Caregivers are category 2; payslip in Chinese and worker's script, kept 5 years; authority may order payment | Permission Regs 2(2), 66 ...&flno=66 | 第二類外國人：指受聘僱從事本法第四十六條第一項第八款至第十款規定工作之外國人；印有中文及該外國人本國文字之薪資明細表；自行保存五年；主管機關得限期令其給付 |

First-two-paragraph deletion test: P1 S1 (art. 59 ground) kept, it is the answer; P1 S2 (MOL approval, clock) kept, adds the condition. P2 originally began "Ganito ang karaniwang takbo." - cut (no information). P2 S1-S3 (3-day notice, revocation, order to leave) kept: they show the default that art. 59 departs from. P2 S4 (Transfer Regs art. 4) kept: it is what turns the default into a transfer deadline.

Comparison with fil 008, 020, 023:
- Openings: 008 opens "Ako si Wei Tseng ... abogada" (first-person lawyer narration, banned by the batch brief); 020 opens with a question plus "Halimbawa lamang" scene; 023 opens with a plain statement about a birth certificate. 801 opens with the statutory fact and the approval condition; no scene, no first person.
- Headings: 020 uses question and noun-phrase headings plus an h3 contact heading; 023 uses nominal headings. 801 uses statutory-process headings ("Ang 60 araw ng paglipat", "Day off at oras: kontrata ang batayan", "Pang-aabuso: mas maluwag ang paglipat", "Sahod at papeles habang naghihintay"), no contact heading, no question headings.
- Endings: 008 ends with a link list; 020 ends with contact paragraph plus Taipei address and "Abogadang responsable"; 023 ends with an internal link and a "Sinuri" line. 801 ends with a restrained contact paragraph (email, contact page, language arranged first, what to send first) that finishes on the two dates to send, then "Mga Sanggunian". No address (batch brief allows email and contact page only), no responsible-lawyer line.

Words: body 936 (headings and link text included, URLs and Sources excluded), Sources 135. Title 67 chars, seoTitle 55, summary 169.

Dropped / not stated because unverified:
- Who pays the return flight and whether final wages run to the date of death: no statutory text found in ESA, Permission Regs or Transfer Regs (grep for 旅費/機票/返國); the article only says to check the contract.
- Any statutory overtime or rest-day pay for household caregivers: none exists under the LSA per MOL; no official figure found, left to the contract.
- DHSC note that Philippine and Indonesian nationals must complete contract verification and an overseas employment certificate before home leave: tangential, and the page cites old article numbers; not used.
- Hotline digits (1955) and NIA 1990 line: omitted on purpose (batch brief: no phone numbers); lines are named and linked.
- MOL 2018 respite-service release (2018-11-26): too old to state as current; not used.
- Whether Tagalog interpretation is available on the WDA line: not stated; the article says Tagalog is not among the listed languages.

## Article 802 - factory worker payslip: overtime, deductions, broker fee

Reader and trigger: Filipino factory worker (manufacturing is category 2, designated work) whose bank deposit is lower than expected, or who sees "service fee" or "dorm" deductions.

Overlap and new angle: th/659 (payslip deductions) and id/664 (caregiver wages) exist for other markets. 802 is for LSA-covered factory work: attendance-record right (LSA 30(5)(6)), overtime tiers and caps, category-2 payslip content, board-and-lodging rule, and the broker fee ceiling by year (fee standard art. 6), then mediation and the limit of the art. 59(1)(3) transfer route. It does not repeat caregivers or unpaid-wage insolvency (th/660).

| Claim | Source | Chinese text checked |
|---|---|---|
| LSA applies to manufacturing | LSA 3(1)(3) https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=3 | 本法於左列各業適用之 ... 三、製造業 |
| Hours and overtime of manufacturing foreign workers follow the LSA | WDA DHSC hours page https://dhsc.wda.gov.tw/PreHireNotice?MenuId=176397ea-c6c8-49e2-83b2-107d1d7d3b80&ChildMenuId=5dea5df4-df66-4796-8d3f-f85dc486d8ae | 營造工作、製造工作、機構看護工作、海洋漁撈工作等，因為適用勞動基準法，每日工作時間、每週工作總時數及加班時數須依勞動基準法辦理 |
| Weekday overtime: at least 1/3 more for the first 2 hours, at least 2/3 more for the next 2 hours; rest-day work paid separately | LSA 24 ...&flno=24 | 延長工作時間在二小時以內者，按平日每小時工資額加給三分之一以上。再延長工作時間在二小時以內者 ... 加給三分之二以上；休息日工作 ... 另再加給 |
| Overtime needs union/labor-management meeting consent; 12 h/day total; 46 h/month; 54 h/month and 138 h/3 months with consent | LSA 32(1)(2) ...&flno=32 | 雇主經工會同意，如事業單位無工會者，經勞資會議同意後，得將工作時間延長之；一日不得超過十二小時；一個月不得超過四十六小時 ... 五十四小時，每三個月不得超過一百三十八小時 |
| Attendance record to the minute, kept 5 years, copy cannot be refused | LSA 30(5)(6) ...&flno=30 | 雇主應置備勞工出勤紀錄，並保存五年；逐日記載勞工出勤情形至分鐘為止。勞工向雇主申請其出勤紀錄副本或影本時，雇主不得拒絕 |
| Wage items' calculation breakdown must be provided | LSA 23(1) ...&flno=23 | 並應提供工資各項目計算方式明細 |
| Factory work is item 10 designated work; category 2 | Qualification standards 5(1) https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090029&flno=5 ; Permission Regs 2 | 中央主管機關依本法第四十六條第一項第十款規定指定之工作 ... 一、製造工作 |
| Payslip content (Chinese + worker's script; actual pay, wage items, total, method; NHI, labor insurance, income tax, board/lodging, welfare fund; garnishment; other lawful items); kept 5 years | Permission Regs 66(1) https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=66 | 實領工資、工資計算項目、工資總額及工資給付方式；全民健康保險費、勞工保險費、所得稅、膳宿費及職工福利金；自行保存五年 |
| Wage paid in full and directly unless law/agreement says otherwise | LSA 22(2) ...&flno=22 | 工資應全額直接給付勞工。但法令另有規定或勞雇雙方另有約定者，不在此限 |
| Board and lodging may be counted in wages if agreed before entry and written in contract; no unilateral change | MOL FAQ (as above) | 膳宿費用得計入工資，應由勞雇雙方於外勞入國前協議，並於勞動契約中載明。又契約存續期間，雇主不應片面變更勞動條件 |
| No advance withholding of wages as penalty/damages | LSA 26 ...&flno=26 | 雇主不得預扣勞工工資作為違約金或賠償費用 |
| Broker service fee cap NT$1,800 / 1,700 / 1,500 per month by year of work; not collectible in advance | Fee standard 6 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090028&flno=6 | 第一年每月不得超過新臺幣一千八百元，第二年每月不得超過新臺幣一千七百元，第三年起每月不得超過新臺幣一千五百元；前項費用不得預先收取 |
| Broker may not take fees beyond the standard or improper benefits; may not hold documents against the will of employer or worker | ESA 40(1)(5),(10) ...&flno=40 | 要求、期約或收受規定標準以外之費用，或其他不正利益；違反雇主或勞工之意思，留置許可文件、身分證件或其他相關文件 |
| Employer keeps the contract and the authenticated entry-cost and wage affidavit for inspection | Permission Regs 66(3) | 勞動契約書。經驗證之第二類外國人入國工作費用及工資切結書 |
| Authority may order payment by a deadline | LSA 27 ...&flno=27 ; Permission Regs 66(6) | 雇主不按期給付工資者，主管機關得限期令其給付 |
| Mediation filed with the municipal/county authority where the work is done; concluded mediation = contract | Labor-Management Disputes Act 9(1), 23 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020007&flno=9 | 向勞方當事人勞務提供地之直轄市或縣（市）主管機關提出調解申請書；視為爭議雙方當事人間之契約 |
| Unpaid wages: worker may terminate without notice | LSA 14(1)(5) ...&flno=14 | 雇主不依勞動契約給付工作報酬 |
| Transfer needs MOL approval; art. 59(1)(3) refers to a contract already terminated for non-payment | ESA 59(1)(3) | 雇主關廠、歇業或不依勞動契約給付工作報酬經終止勞動契約者 |

First-two-paragraph deletion test: the earlier opening question ("Bakit mas maliit ang pumasok sa account...") only restated the reader's worry and was deleted, nothing lost. P1 S1 (three separate questions) kept: it is the structure the reader needs. P1 S2 ("Magkakaiba ang batas sa bawat isa") kept in shortened form, it explains why they are separated; the next paragraph (LSA coverage) carries the first fact.

Comparison with fil 008, 020, 023:
- Openings: 020 opens with a question and a hypothetical scene; 802 opens with a claim that splits the payslip into three questions, no scene, no first person (008).
- Headings: 802 mixes a noun phrase ("Overtime at ang talaan ng pagpasok"), a question ("Sino ang may batayan sa bawat kaltas?"), a topic phrase and a process phrase; it shares no pattern with 801/803 (801 process phrases, 803 event phrases).
- Endings: 802 ends with the contact paragraph whose last sentence names the first thing to send (one month: hours per attendance record, hours per payslip, the difference); 008's link list and 020/023's address or "Sinuri" line are not copied.

Words: body 940, Sources 140. Title 70 chars, seoTitle 60, summary 159.

Dropped / not stated because unverified:
- Numeric overtime or rest-day multipliers: art. 24(2) wording ("另再加給一又三分之一") is applied by the Ministry in a specific way I did not verify, so no worked example and no rest-day multiplier is given; the text says only that rest-day work has a separate, higher rule.
- "Employer may deduct the broker's fee from wages": not asserted either way; the article notes it is not in the art. 66 list and tells the reader to ask for the document (no Ministry interpretation on broker-fee deductions was checked).
- The re-entry exception to the fee cap (NT$1,500 for a worker returning to the same employer after 2+ years) is in the statute but was cut for length.
- Which language counts as the "own script" of a Filipino worker under art. 66: the Regulation says 該外國人本國文字; WDA's published bilingual templates (中印、中英、中泰、中越) do not list Filipino. The article says "sariling wika" and does not claim English or Tagalog.
- Placement fees paid in the Philippines: out of scope (foreign law); the article says Philippine counsel is needed.

## Article 803 - reported as missing, overstay, surrender

Reader and trigger: a worker whose employer reported "lost contact" (rightly or wrongly), a worker who left over wages or abuse, or a family member abroad asking what follows.

Overlap and new angle: no fil column covers this; en/649 touches ESA 56/73/74 and Immigration Act 31 in two paragraphs. 803 adds the false-report remedy (ESA 56(2)), fines, entry ban, detention limits and the voluntary-surrender fine reduction in force since 1 Oct 2025.

| Claim | Source | Chinese text checked |
|---|---|---|
| 3 consecutive days absent and out of contact -> written report within 3 days to labor authority, NIA, police | ESA 56(1) https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=56 | 連續曠職三日失去聯繫或聘僱關係終止之情事，雇主應於三日內以書面載明相關事項通知 |
| False report: complaint to local authority; if false, central authority must revoke the revocation and the order to leave | ESA 56(2) | 經查證確有不實者，中央主管機關應撤銷原廢止聘僱許可及限令出國之行政處分 |
| Permit revoked; ordered to leave and may not work again; NIA may order leave before revocation | ESA 73(3), 74(1)(2) ...&flno=73, 74 | 連續曠職三日失去聯繫或聘僱關係終止；應即令其出國，不得再於中華民國境內工作；於廢止聘僱許可前，入出國業務之主管機關得即令其出國 |
| Residence permit revoked and ARC cancelled when the reason for residence ends; exceptions the NIA may allow (labor dispute in litigation, work injury under treatment) | Immigration Act 31(4) https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31 | 居留原因消失者，廢止其居留許可，並註銷其外僑居留證。但有下列各款情形之一者，得准予繼續居留 ... 五、外國人與本國雇主發生勞資爭議，正在進行爭訟程序。六、外國人發生職業災害尚在治療中 |
| NIA may deport or order leave within 10 days | Immigration Act 36(2)(7) ...&flno=36 | 得強制驅逐出國，或限令其於十日內出國 ... 七、有第三十一條第四項規定情形 |
| Foreigners who overstay: fine NT$10,000-50,000; may be reduced or waived in special cases | Immigration Act 74-1(2),(4) ...&flno=74-1 | 逾期停留或居留者，處新臺幣一萬元以上五萬元以下罰鍰；有特殊事由經主管機關核定者，得減輕或免除處罰 |
| Sheltering an overstayer to have them do unlawful activities: NT$60,000-300,000 | Immigration Act 74-1(3) | 意圖使逾期停留或居留 ... 從事不法活動而容留、藏匿或隱避之者，處新臺幣六萬元以上三十萬元以下罰鍰 |
| Entry may be barred for prior overstay/illegal work; ban at least 1, at most 7 years from the day after leaving | Immigration Act 18(1)(12),(3) ...&flno=18 | 曾經逾期停留、居留或非法工作；自其出國之翌日起算至少為一年，並不得逾七年 |
| Working without an employer-applied permit: fine NT$30,000-150,000; ordered to leave, barred from working | ESA 43, 68(1),(3) ...&flno=68 | 外國人未經雇主申請許可，不得在中華民國境內工作；處新臺幣三萬元以上十五萬元以下罰鍰；應即令其出國，不得再於中華民國境內工作 |
| Foreign workers in items 8-11 cannot change employer unless art. 59 and MOL approval | ESA 53(4) ...&flno=53 | 不得轉換雇主或工作。但有第五十九條第一項各款規定之情事，經中央主管機關核准者，不在此限 |
| Detention: up to 15 days, only if hard to deport otherwise and one of three listed situations, after a chance to state views | Immigration Act 38(1) ...&flno=38 | 非予收容顯難強制驅逐出國者 ... 期間 ... 最長不得逾十五日 ... 給予當事人陳述意見機會；一、無相關旅行證件 ... 二、有事實足認有行方不明、逃逸或不願自行出國之虞 ... 三、受外國政府通緝 |
| Detention may be waived for under-12s, pregnant 5+ months, etc. | Immigration Act 38-1 ...&flno=38-1 | 外國人有下列情形之一者，得不暫予收容 ... 三、未滿十二歲之兒童 |
| Continued detention needs a court ruling | Immigration Act 38-4(1) ...&flno=38-4 | 應於期間屆滿五日前附具理由，向法院聲請裁定續予收容 |
| Voluntary appearance before being caught, willingness to arrange departure and pay on time: fine may be halved; not for those who can re-apply under 15(2)/31(3); reduction revoked if fine unpaid, no cooperation on travel document, or no departure by deadline | Standard art. 74-1, art. 3(1)(7), 3(3) https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080224&flno=3 | 於治安機關查獲前，自行到案表示願配合辦理各項出國事宜及依限繳納罰鍰。但得依本法第十五條第二項或第三十一條第三項規定重新申請居留者，不適用之；未依限繳納罰鍰；未配合申請返國旅行證件；逾限令出國期限仍未出國 |
| Effective 1 Oct 2025 | NIA notice https://www.immigration.gov.tw/5385/7229/7235/398562/ | 修正「入出國及移民法第七十四條之一特殊事由之認定及減免處罰標準」第3條條文，自114年10月1日施行 |
| Fine may be waived: trafficking victims; reports with concrete evidence leading to detection of ESA 44/45/57(1)(2) or 74-1(3) cases; overstay from disaster, epidemic, major accident, torture, cruel/inhuman treatment or other force majeure with proof | Standard art. 4(1) ...&flno=4 | 因被販運而逾期停留或居留之人口販運被害人；檢附具體事證檢舉，因而查獲違反 ... 規定之案件；逾期係因天然災害、疫情、重大事故、遭受酷刑、殘忍、不人道待遇或其他不可抗力之因素 |
| WDA line (see 801) | WDA lazypg page | as above |

First-two-paragraph deletion test: P1 S1 (three days, no contact) kept: it is the legal trigger. P1 S2 (three days to report, to whom) kept. P2 originally "...kaya ito ang unang dapat maintindihan" - the filler clause was cut; what remains (the report starts action against permit and ARC, true or not) adds the ARC definition and the "true or not" bridge to section 2.

Comparison with fil 008, 020, 023:
- Openings: 803 opens with a number-and-condition fragment taken from the statute (008 first person, 020 question plus scene, 023 plain statement).
- Headings: event phrases ("Ano ang kasunod ng ulat", "Maling ulat at ang karapatang magreklamo", "Multa, entry ban at detention", "Pagsuko bago mahuli"); none repeats the 801 or 802 wording.
- Endings: contact paragraph asks for the Taiwan connection and any deadline or notice received (not a summary); then Sources. No address line.

Words: body 925, Sources 86. Title 59 chars, seoTitle 60, summary 166.

Dropped / not stated because unverified:
- The 2023 NIA voluntary-return programme (waived entry ban, minimum fine, no detention) appears in search summaries but ended 2023-06-30 per those summaries; not used and no entry-ban waiver is claimed. The article says the standard does not decide the entry ban or detention.
- The exact date on which overstay starts for a worker whose permit was revoked: not stated (depends on the NIA's order and deadlines; not verified).
- NIA consultation line digits: omitted on purpose.
- Any statement that a labor complaint or mediation (as opposed to litigation) lets the NIA keep a worker in Taiwan: art. 31(4)(5) says 爭訟程序 (litigation); the article says litigation only.
- Number of Filipino workers recorded as missing: used only here in the note as evidence, never in the body (statistics rule).

## Cross-article differences (required by brief)

- Opening types: 801 statutory fact plus condition; 802 framing claim that splits one number into three questions; 803 number-first fragment from the statute.
- Heading patterns: 801 process/topic; 802 mixed noun, question and process; 803 event phrases. No heading begins with "Kapag" across the three.
- Endings: all three end the body with a contact paragraph (required) but each finishes on different first-email content: dates of death and last notice (801); one month of hours vs payslip (802); Taiwan connection and any deadline or notice (803).
- Internal links: 801 -> 803 (own slug); 802 -> fil 009 taiwan-voluntary-resignation-severance (existing); 803 -> 801 (own slug). None links 001, 004, 005, 006, 010.
- Image: 801 I17, 802 I15, 803 I11 from briefs/IMAGE-MENU.md, caption translated from the given pattern, alt translated from the menu description without added objects.
- Not done on purpose: no bold, no H1, no author footer, no phone numbers or street address, no lawyer or native-speaker review claim, no first-person lawyer narration, no invented cases or statistics, hypotheticals avoided entirely (no invented scenes).
- Note on existing fil columns: 020 and 023 end with the firm's Taipei street address and a responsible-lawyer line; the batch brief limits contact to email and the contact page, so the new drafts do not repeat that.
