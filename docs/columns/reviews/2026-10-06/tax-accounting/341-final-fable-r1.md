# T12 final review (Claude Fable 5.1) — taiwan-tax-audit-reexamination-appeal-deadlines · ko / ja / en / zh-hant

Review date: 2026-10-06 (KST). Reviewer: Claude Fable 5.1 (final gate). Files reviewed: drafts/T12/ko.md, ja.md, en.md, zh-hant.md (+ facts.md, treated as untrusted), research/R7-statutes.md, R7-official.md, T12-extra.md (untrusted, re-verified), images/T12.webp.

## Verdict

PASS — all four language versions are publishable as they now stand (after the six minor wording edits listed below). No major issue remains. Image OK.

## Scope checked — official pages I opened myself (all on 2026-10-06; copies under reviews/T12/sources/)

Statutes, law.moj.gov.tw single-article pages, fetched with fetch_law.py into `sources/statutes-fable.md` (text + each law's 修正日期 header):
- 稅捐稽徵法 (G0340001, 修正日期 民國110年12月17日): §20, §21, §22, §23, §28, §30, §35, §38, §39, §51 — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340001&flno=20 … &flno=51
- 納稅者權利保護法 (G0340142, 修正日期 民國114年05月28日): §11, §12, §13, §20, §23
- 訴願法 (A0030020, 修正日期 民國101年06月27日): §14, §58, §85
- 行政訴訟法 (A0030154, 修正日期 民國111年06月22日): §3-1, §4, §49, §104-1, §106, §229, §241, §263-1
- 所得稅法 (G0340003, 修正日期 民國115年09月11日): §83
- 商業會計法 (J0080009, 修正日期 民國103年06月18日): §8
- 營利事業所得稅不合常規移轉訂價查核準則 (G0340019, 修正日期 民國109年12月28日): §22

Amendment-history pages (sources/lawhistory-*.html/.txt):
- https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=G0340001 — entry 31: 110-12-17 amendment; 110-12-23 行政院令 「第 20 條條文定自一百十一年一月一日施行」 → matches "last amended 2021-12-17; Art. 20 in force 2022-01-01" in every sources section.
- https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=G0340142 — entry 2: 114-05-28 修正公布第 4、6、20 條，「並自公布後一年施行」 → drafts state only "last amended 2025-05-28" and no in-force date (binding note respected).
- https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030154 — entry 18: 111-06-22 amendment; 111-06-24 司法院令 「定自一百十二年八月十五日施行」 → matches "2022-06-22, in force 2023-08-15".
- https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030020 — entry 8: 101-06-27 → matches "2012-06-27".

Official non-statute pages (sources/*.html + extracted *.txt):
- 財政部臺北國稅局「行政救濟」常見問答, 更新日期 115-03-31 — https://www.ntbt.gov.tw/singlehtml/0baa381b53034993a08862dfde2243b9?cntId=9be24d9e77d3473ba2bda62d224257d8 (Q2 postmark rule, Q3 no payment/security, Q4 訴願 via original agency to 財政部 and receipt-date rule, Q6 復查 required before 訴願, Q7 one-third options, Q29 程序不合駁回)
- 財政部高雄國稅局「收到稅單如有不服，應如何救濟」, 更新日期 112-12-04 — https://www.ntbk.gov.tw/singlehtml/829dd7b01c934d00ace92e154641c37e?cntId=a5693ee371854f199acf7333abc35705 (30日不變期間; 逾期 → 程序不合駁回)
- 財政部南區國稅局 Q&A「本次調降滯納金理由為何？何時生效？…」, 更新日期 110-12-27 — https://www.ntbsa.gov.tw/singlehtml/a295804e59644bbb970faea83df15ede?cntId=3858c2e72f614bbb8244cdb3df81bb78 (每逾3日1%, 總加徵率最高10%, 第20條自111年1月1日施行)
- 財政部賦稅署 新聞稿「立法院今(30)日三讀通過「稅捐稽徵法」部分條文修正草案」, 發布日期 110-11-30 — https://www.dot.gov.tw/singlehtml/ch26?cntId=303aeaac3160442a94bb1839d961521b (item 8: 第39條 比例由「半數」調降為「1/3」)
- 財政部稅務入口網 Q&A 0403「納稅義務人對稅捐稽徵機關的復查決定如有不服，應如何救濟？」, 更新日期 113-01-03 — https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/tax-collection-act/administrative-remedy/Lbw8Wbl (50萬/150萬 thresholds; 20-day appeal for both 地方 and 高等 judgments)
- 司法院「行政訴訟堅實第一審新制」專區, 發布 111-05-31, 更新 115-03-31 — https://www.judicial.gov.tw/tw/cp-2214-628055-cd114-1.html (「111年6月22日經總統修正公布，新制定自112年8月15日施行」)
- law.moj.gov.tw/ENG LawAll pages for the seven pcodes (sources/eng-*.html, element hlLawName): "Tax Collection Act", "The Taxpayer Rights Protection Act", "Administrative Appeal Act", "Administrative Litigation Act", "Income Tax Act", "Business Entity Accounting Act", "Regulations Governing Assessment of Profit-Seeking Enterprise Income Tax on Non-Arm's-Length Transfer Pricing" — the en draft's law names match (it drops the article "The" before Taxpayer Rights Protection Act, which is fine in running text).

Tools run (output recorded in this session): `python3 lint.py drafts/T12/<lang>.md <lang> taiwan-tax-audit-reexamination-appeal-deadlines` → OK for ko (3,294 chars), ja (3,945), en (1,591 words), zh-hant (2,606) after edits; `python3 shared/variety/variety_metrics.py check … --lang <lang>` → "OK — no variety limit violated" for all four (ko cv 0.531/short 12.5%, ja cv 0.466/short 12.3%, en cv 0.533/short 14.3%, zh cv 0.501/short 14.0%; contrast 0 in all; caveat ≤ 2).

## 1. Law and facts — result per claim (all four languages unless noted)

Every claim below was read against the fetched text, not against facts.md.

- 復查 30-day window: tax payable → 「繳款書送達後，於繳納期間屆滿之翌日起三十日內」; no tax payable → 「核定稅額通知書送達之翌日起三十日內」 (§35 I(1)(2)) — correct in all four openings, FAQ 2 and tables.
- 復查 mandatory before 訴願 — 臺北國稅局 Q6 「程序上是不允許的」; correct.
- Filing date = office receipt; mailed = 郵寄地郵戳 (§35 II) — correct; the contrast with 訴願 (receipt date only, 訴願法 §14 III; 臺北 Q4 「而非訴願書寄發或付郵日期為準」) is correct in all four closings.
- 30日 = 不變期間; late → 程序不合駁回 (高雄國稅局; 臺北 Q29) — correct.
- Force majeure (ja only): 1 month after the cause ends, proof, 「並應同時補行…」, barred after 1 year (§35 III) — correct after the modality fix below.
- zh worked example: payment period ends 3/10 → day 1 = 3/11 → day 30 = 4/9: 21 days in March (3/11–3/31) + 9 days in April = 30. Arithmetic correct; labelled （虛構情境）; no holiday roll-over stated (binding note respected).
- Audit powers (§30 I, II, IV): demand books/summon, may not refuse; limited to tax purpose; receipt; return within 30 days of complete delivery unless 涉嫌違章漏稅; one 30-day extension with the head's approval — correct in all four.
- 所得稅法 §83 I: no books → 查得之資料或同業利潤標準 — correct.
- 核課期間 §21 I(1)(3), II: 5 years (filed on time, no fraud/improper means) / 7 years (not filed on time, or deliberate fraud/improper means); not discovered → 不得再補稅處罰 — correct in body and FAQ 3 of all four. Start §22(1)(2) — correct.
- 徵收期間 §23 I: 5 years from the day after the payment period ends — correct (en wording softened, see minor edits; §23 III exclusion of the §39 suspension period is not contradicted by any version).
- 納保法 §12 I–III — notice of grounds/scope unless it would defeat the purpose; agent/assistant and refusal until arrival, exception for a notified agent who fails to appear; recording after notice, refusal only for a legitimate confidentiality reason entered in the record — correct in all four.
- §11 II burden of proof; §11 IV chance to explain (exceptions → "원칙적으로/原則として/generally/原則上"); §11 V written reasons and legal basis (exception 行政程序法 §97) — correct; ko tightened, see minor edits.
- §20 納稅者權利保護官 (not §16): communication/coordination, advice when seeking remedies, names and contacts on the website — correct, cited as §20 in all four.
- §13 (ja only): file access after 復查/訴願, limited to what is necessary — correct.
- 復查 decision: 2 months from the day after receipt, no extension in §35, no decision → 得逕行提起訴願 (§35 IV–V) — correct.
- No payment/security to apply (臺北 Q3); §39 I 暫緩移送強制執行; §38 III interest from the day after the original payment deadline to the supplementary bill — correct in all four and FAQ 1.
- 訴願: to 財政部 via the original office (訴願法 §58 I; 臺北 Q4); 30 days from the day after 達到 (§14 I); decision 3 months + one extension ≤ 2 months (§85 I); no decision → suit (行政訴訟法 §4 I) — correct.
- One-third rule §39 II(1)–(3), including the §24 I(1) property-freeze alternative — correct in body, FAQ 1 and summaries; "cut from 半數 to 1/3 in the 2021 amendment" matches 賦稅署 item 8 and LawHistory 110-12-17.
- Courts: suit within 2-month 不變期間 after service of the 訴願 decision (§106 I); new system from 2023-08-15 (司法院, LawHistory); ≤ NT$500,000 → 簡易程序 at 地方行政法院 = 高等行政法院地方行政訴訟庭 (§229 I, II(1), §3-1); ≤ NT$1,500,000 → 地方行政法院 (§104-1 I(1)); above → 高等行政法院 (高等行政訴訟庭); 司法院 may change the figures by order (§104-1 II, §229 III); CPA as agent with the presiding judge's permission (§49 II(1), III); appeal within 20 days (§241; eTax 0403 for both divisions) — correct in all four. Each version dates the thresholds "as of October 2026 per the statute text" (binding note respected).
- Refund §38 II (10 days; daily interest from payment to issuance of 收入退還書/國庫支票 at the 1 Jan postal one-year fixed rate) — correct.
- Surcharge §20 (1% per 3 days; after 30 days → enforcement); 10% cap and 2022-01-01 attributed to 南區國稅局's description, not to the statute — correct.
- §28 I, III: 10 years / 15 years for government error / not applicable after a final 實體判決 — correct.
- 商業會計法 §8 Chinese prevails; TP 準則 §22 IV–V (1 month from service of the written investigation letter, one extension ≤ 1 month, Chinese translation unless English approved) and §22 I(3)(4) intra-group agreements — correct.
- Home-country law: ja (日本の税理士にご確認) and en (US or Vietnamese tax adviser) are general referrals only; ko makes no Korean-law statement — complies with brief rule 10 and the topic brief.
- Cross-language consistency: the four versions state the same deadlines, thresholds, ratios, dates and article numbers; no contradiction found.
- Binding research notes: §16 not cited; 2025 納保法 in-force date not stated; online 復查 procedure not described; holiday roll-over not stated; 10% cap only as the bureau's description; thresholds dated — all respected.

## 2. Citations

- Inline links sit right after each claim; every statute link points to the correct single-article URL (spot-checked all 27 distinct LawSingle URLs against the fetched text — pcode and flno match the cited rule in every case).
- Official pages linked where the claim rests on them (臺北 Q3/Q6, 高雄, 南區, 賦稅署, eTax 0403, 司法院).
- Sources sections complete (every linked source listed), law version dates correct, page update dates correct (113-01-03 → 2024-01-03; 115-03-31 → 2026-03-31; 112-12-04 → 2023-12-04; 110-12-27 → 2021-12-27; 110-11-30 → 2021-11-30), check date 2026-10-06 present in each language.
- Internal links: each version links only its own language's `/<lang>/columns/taiwan-subsidiary-corporate-income-tax-calendar` and `/<lang>/columns/taiwan-transfer-pricing-documentation-thresholds` (both published, LINKS.md 301/304); lint confirmed existence. No link to batch-3 columns.

## 3. Rules

No bold (grep `**` = 0 in all files); no phone numbers; no street address; one soft contact line with wei@hoveringlaw.com.tw only; no offer of bookkeeping/filing/audit services; `author: "legal-ai-assistant"`; no lawyer/CPA/native-review claim; zh hypothetical labelled （虛構情境）, the other versions contain no scenario presented as real; frontmatter per brief (topic tax, tags ["tax-accounting"], audience per language, en seoTitle 38 chars required and present, en summary 150–160 chars, lint OK).

## 4. Voice

- ko: 합니다체 throughout; opening delivers the 30-day fact; title names the subject and the three deadlines, not clickbait; one reader question (몇 년 전 신고까지 되돌아볼까요?); closing sentence is a fact (소원서는 마감일까지 기관에 도착해야 합니다).
- ja: です・ます throughout; two reader questions in prose; natural phrasing (「ここでは消印が使えません。」); no 解説します/重要なポイント patterns.
- en: plain, active; two reader questions; short sentences present ("There is a cost."); no "This means / It is important to note".
- zh-hant: Taiwan usage (國稅局、營所稅、會計師、核定稅額通知書、繳款書、不變期間); lint found no mainland vocabulary or simplified characters; opening gives the deadline and a worked date example.
- Opening type ① (concrete deadline) as assigned; no 가령/例えば…とします/Suppose/假設 opener.
- First two paragraphs: deleting any sentence of the openings loses a condition (start point for tax-payable vs no-tax notices, 復查-first rule, service on the subsidiary) — nothing removable.

## 5. Sentence variety

variety_metrics.py: no FAIL line in any language. Self-check items 2–7 (SENTENCE-VARIETY-RULE §5) all met: opener not formulaic; ≥ 2 very short sentences in each; no three paragraphs with the same first word (opener_rep ≤ 0.059); no three consecutive claim-(statute)-caveat paragraphs (caveat ≤ 2) and each version has citation-free paragraphs (the second opening paragraph and the agreements paragraph); contrast templates 0; last paragraph ends on the column's facts. No MONOTONY finding.

## 6. Issues found (Original → problem & reason → fix → facts preserved)

All minor; none changes a number, citation or legal outcome. Applied directly.

1. ko body (§30 paragraph): 「제출한 장부는 국세국이 영수증을 써 주고 받으며」 → 收據 for documents handed over is a 수령증, not a payment 영수증 (naturalness) → applied: 「수령증을 써 주고 받으며」 → 30-day return, one 30-day extension, §30 link unchanged.
2. ko body (재심사 section): 「늦은 신청은 절차 부적법으로 받아들여지지 않습니다(程序不合駁回)」 → 臺北 Q29 says the office must accept the case and dismiss it by 復查決定書 「以程序不合駁回」; "받아들여지지 않습니다" reads as "not accepted"; 각하 is the exact Korean term → applied: 「늦은 신청은 절차 부적법으로 각하됩니다(程序不合駁回)」 → 不變期間, 高雄 link unchanged.
3. ko body (§11 paragraph): 「결정은 이유와 법적 근거를 적은 서면으로 합니다」 → §11 V allows reasons to be omitted in the 行政程序法 §97 cases (「除符合…第九十七條所定各款情形之一者，得不記明理由外」); the sentence stated the duty without that exception → applied: 「결정은 서면으로 하고 법이 정한 예외가 아니면 이유와 법적 근거를 적어야 합니다」 → written form (mandatory under §11 V–VI), reasons and legal basis, §11 link unchanged.
4. ja body (不変期間 paragraph): 「…原状回復を申請し、同時に復査の申請もできますが、1年を超えて遅れた場合は認められません（第35条第3項）。」 → §35 III: 「並應同時補行申請復查期間內應為之行為」 is an obligation, not an option; "もできますが" misstated the modality → applied: 「…原状回復を申請し、同時に復査の申請も済ませる必要があります。1年を超えて遅れた場合は認められません（第35条第3項）。」 → 1 month, proof, 1-year bar, §35 III citation unchanged (「必要があります」 count in ja is now 2, within the limit of 3).
5. ja sources list: 「税単に不服がある場合の救済」 → 税単 is the Chinese 稅單, not Japanese → applied: 「税額通知に不服がある場合の救済（2023年12月4日）」 → URL and date unchanged.
6. en body (§23 sentence): "the office has five years from the day after the payment period ends to collect it" → §23 I has provisos (cases already sent to enforcement etc.) and §23 III excludes the §39 suspension period, so "has five years to collect it" overstates the bar → applied: "the collection period is five years from the day after the payment period ends" → 5 years, start point, §23 link unchanged.

Observations not edited (not errors): all four say the Judicial Yuan "may change/adjust both figures by order" without the statutory ranges (≤ NT$10M for §104-1; NT$250,000–750,000 for §229) — accurate as a general statement; en keeps "Taxpayer Rights Protection Act" without the official leading "The" — acceptable in prose.

## 7. Minor edits applied (file: change)

- drafts/T12/ko.md: 영수증 → 수령증; 받아들여지지 않습니다 → 각하됩니다; §11 sentence reworded with the statutory exception (items 1–3 above).
- drafts/T12/ja.md: §35 III modality できますが → 済ませる必要があります (sentence split); sources label 税単 → 税額通知 (items 4–5).
- drafts/T12/en.md: "has five years … to collect it" → "the collection period is five years …" (item 6).
- drafts/T12/zh-hant.md: no edit.
After the edits: lint OK for all four; variety_metrics OK for all four (figures above).

## 8. Image verdict

images/T12.webp — OK. A long bare wooden table in a quiet room, empty chairs, a brass desk lamp and a stack of closed ledgers; no faces, no text, no logos, no flags, no readable documents; fits a records-review column and is respectful.

VERDICT: PASS
