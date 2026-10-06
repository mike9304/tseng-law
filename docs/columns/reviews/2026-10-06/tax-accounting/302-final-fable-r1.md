# T2 final review — taiwan-dividend-withholding-foreign-parent-tax-agreement-rates (ko, ja, en, zh-hant)

Reviewer: Claude Fable 5.1 (final gate). Review date: 2026-10-06 (KST). Files reviewed: drafts/T2/ko.md, ja.md, en.md, zh-hant.md, facts.md; research/R2-statutes.md, R2-official.md, R2-T2-added.md, R1-statutes.md (§23, §66-9, §71, §102-2); images/T2.webp.

## Verdict

PASS — all four language versions are publishable as they stand (one minor wording edit applied to en, no change of fact). Image OK.

Every rate, threshold, deadline, date, article number, agreement term, procedure and condition in the four columns was checked against the official page I opened myself (list below). No major issue found. The language versions do not contradict each other on law. Lint prints OK and the variety tool has no FAIL on all four files (ja shows one WARN only).

## Scope checked — official pages opened on 2026-10-06 (saved under reviews/T2/sources/)

Statutes (fetch_law.py, verbatim text + header amendment date → sources/statutes.md):
- 所得稅法 (G0340003), header 修正日期 民國115年09月11日: §3, §23, §66-9, §71, §88, §89, §92, §102-2, §114 — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=… ; amendment history https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=G0340003 (sources/law-history-G0340003.html): item 69 「一百十三年八月七日…修正公布第 88、89、92…114…條條文」+「一百十三年八月二十七日行政院…令發布定自一百十四年一月一日施行」; item 71 「一百十五年九月十一日…修正公布第 17、126 條」.
- 所得稅法施行細則 (G0340004), 修正日期 民國111年02月21日: §82.
- 各類所得扣繳率標準 (G0340028), 修正日期 民國110年06月30日: §4, §14.
- 適用所得稅協定查核準則 (G0340125), 修正日期 民國114年04月08日: §4, §25, §34.
- 外國人投資條例 (J0040002), 修正日期 民國86年11月19日: §12.
- English titles and "Amended Date" at law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=G0340003 / G0340004 / G0340028 / G0340125 / J0040002 (sources/eng-*.html): Income Tax Act 2026-09-11; Enforcement Rules of the Income Tax Act 2022-02-21; Standards of Withholding Rates for Various Incomes 2021-06-30; Regulations Governing Application of Agreements for the Avoidance of Double Taxation with Respect to Taxes on Income 2025-04-08; Act For Investment by Foreign Nationals 1997-11-19.

Ministry of Finance (mof.gov.tw):
- 我國所得稅協定一覽表 https://www.mof.gov.tw/singlehtml/191?cntId=63930 (發布/更新日期 2026-09-04) — rows: 日本 2015/11/26 → 2016/06/13; 韓國(原協定) 2021/11/17 → 2023/12/27; 韓國(修正協議) 2026/08/04 → 2026/08/04 with footnote on the Korean ministry rename; 越南 1998/04/06 → 1998/05/06; 美國 only in the 海空運S&A table, 1988/05/31. (sources/mof-agreement-list.txt)
- 臺韓所得稅協定生效新聞稿 https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=127fffb302f24987b0bbf1eff78ff9c9 (發布 2023-12-28): 「於110年11月17日完成異地簽署…於112年12月27日起生效，自113年1月1日起適用」; 「股利：上限稅率10%」.
- 臺日租稅協定生效新聞稿 https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=dot70257 (發布 2016-06-15): 「於105年6月13日生效，自106年1月1日適用」; 「就源扣繳稅款(例如股利…)，在我國適用於106年1月1日以後應付之所得」.
- 美國眾議院通過臺美避免雙重課稅法案新聞稿 https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=4e67c2462d814206ae21176419822481 (發布 2025-01-17): 「尚待美國參議院審議通過並經美國總統簽署」; 「需完成條約締結法規定法律程序，始於我國生效適用」.
- Agreement texts (PDF → sources/*.txt): Korea original 中文 https://www.mof.gov.tw/download/c73d0ce06a654aed88df936485e60a53 (Art 10(2) 10% beneficial owner, no threshold; Art 10(4); Art 23(2)(一)(二) incl. 25% voting-share clause; Art 27(1) PPT with proviso; Art 28(2)(一); signed 二○二一年十一月十七日 臺北及首爾); Korea English https://www.mof.gov.tw/download/d1f7663ee1cf4074bd307a87e852d389 ("shall not exceed 10 per cent of the gross amount of the dividends"; signed 17 November 2021); Korea 2026 amending letters 中譯本 https://www.mof.gov.tw/download/12178199edb34919a4740b09c1f116b5 (only Art 3(1)(一) and 3(1)(七)2 — ministry name; effective on receipt of the reply dated 2026年8月4日); Japan 中譯本 https://www.mof.gov.tw/download/10422 (Art 10(2), 10(4), Art 22(1), Art 26, Art 28(2)(二)1; 「本協定以英文繕製」; signed 2015年11月26日 東京); Japan English https://www.mof.gov.tw/download/10462; Vietnam 中譯本 https://www.mof.gov.tw/download/6b9255566aab4b9084c085ddc921138e (Art 10(2) 15% 受益所有人; Art 10(4); Art 27 簽署日後三十日生效; signed 1998年4月6日 河內); Vietnam English https://www.mof.gov.tw/download/66dc13da4e8449698e42d6b818549c52 ("shall not exceed 15 per cent").
- 財政部主管法規共用系統: 台財稅第7586738號 (76-03-09) https://law-out.mof.gov.tw/LawContent.aspx?id=GL002917; 所得稅法第八條規定中華民國來源所得認定原則 (修正日期 112-10-13) https://law-out.mof.gov.tw/LawContent.aspx?id=FL050237, point 2 「但不包括外國公司在中華民國境內設立之分公司之盈餘匯回」.
- 稅務入口網 Q&A 1503 (更新日期 115-04-10) https://www.etax.nat.gov.tw/…/3AmWR0R — 「於107年1月1日以後…扣繳率21%」; Q&A 2814 (更新日期 115-04-27) https://www.etax.nat.gov.tw/…/om7pAeL — 「(1)總機構在中華民國境外者」免辦未分配盈餘申報.

Japan / United States:
- 国税庁 日台民間租税取決めに定める相互協議手続について https://www.nta.go.jp/taxes/shiraberu/kokusai/nichitai/01.htm (Shift_JIS): 平成27年11月26日 民間取決め; 注1 日本国が締結した国際約束ではない; 注2 renames from 平成29年1月1日 and 平成29年5月17日.
- Library of Congress API (official) https://api.congress.gov/v3/bill/119/hr/33 and /actions, /bill/119/s/199/actions (queried 2026-10-06; bill updateDate 2026-09-19): H.R.33 latestAction 2025-01-16 "Received in the Senate and Read twice and referred to the Committee on Finance."; 2025-01-15 "Passed by the Yeas and Nays: 423 - 1"; S.199 latestAction 2025-01-23 "Read twice and referred to the Committee on Finance." The congress.gov HTML pages linked in the column return HTTP 403 to scripts (same as the research file); the official API is the Library of Congress' own data for the same bills, so I treat the status as verified.
- GPO govinfo H.R.33 RFS text https://www.govinfo.gov/content/pkg/BILLS-119hr33rfs/html/BILLS-119hr33rfs.htm: "IN THE SENATE OF THE UNITED STATES January 16, 2025 Received; read twice and referred to the Committee on Finance"; §894A(e)(1) "This section shall not apply to any period unless the Secretary has determined that Taiwan has provided benefits to United States persons for such period that are reciprocal…"; short title "United States-Taiwan Expedited Double-Tax Relief Act".

## 1. Law and facts — results per claim (all four languages unless noted)

- 21% on dividends to a foreign corporate shareholder, withheld by the paying company at payment; taxpayer = the foreign corporate shareholder → §88 I(1), §89 I(1), 扣繳率標準 §4 (「按給付額或應分配額扣取百分之二十一」). Correct in all four.
- "Since 2018-01-01" → eTax 1503 「於107年1月1日以後」; corroborated by 扣繳率標準 §14 (106-12-29 amendment effective 107-01-01). Correct.
- "Payment" = actual/transfer/remittance; deemed paid 6 months after the shareholders' (or board, for cash dividends) resolution → 施行細則 §82. Correct in all four; ja worked example (June resolution → December) is arithmetically right and labelled 架空の例.
- 10 days from the withholding date to pay and to file/verify/issue 扣繳憑單; +5 days if ≥3 consecutive national holidays; same for a foreign enterprise with a fixed place of business (dividends) → §92 II–III; in force 2025-01-01 (history item 69). Correct in all four.
- Penalty up to 1× / up to 3× → §114(1). Correct in all four.
- Korea agreement: parties, 2021-11-17 signing, 2023-12-27 in force, Taiwan withholding from amounts payable 2024-01-01 (MOF release + Art 28(2)(一)); 2026-08-04 amendment only renames the Korean ministry in Art 3 → verified (ko, en, zh).
- Japan agreement: 交流協会 / 亜東関係協会, 2015-11-26, private arrangement, not an international agreement of Japan, drafted in English, renamed 2017-01-01 / 2017-05-17; in force 2016-06-13; Taiwan withholding from income payable 2017-01-01 → NTA page, MOF release, Art 28(2)(二)1, 「本協定以英文繕製」. Verified (ja, en, zh).
- Vietnam agreement: parties, signed 1998-04-06 Hanoi, in force 1998-05-06, Art 10(2) 15% where the recipient is the beneficial owner → verified (en, zh). The column rightly gives no Vietnam application date (research marked it derived).
- Dividend cap 10% (Japan Art 10(2), Korea Art 10(2)), beneficial owner, no shareholding threshold, "does not affect tax on the company's profits" → verified word for word. The "no shareholding threshold" statement: I read Art 10 of all three texts in full; none contains an ownership percentage.
- PE / effectively-connected exception → Art 10(4) in all three agreements. Verified.
- Anti-abuse: Japan Art 26 (main purpose or one of the main purposes), Korea Art 27(1) PPT with the object-and-purpose proviso; 查核準則 §4 IV economic substance → verified; the FAQ and body of each language cite the right article for the right agreement (ko: Korea 27; ja: Japan 26; en/zh: both).
- Documents at payment (residence certificate + beneficial-owner proof to the withholding agent; agent states the article in the withholding return and attaches the proofs, shareholding evidence and dividend calculation sheet/notice) → 查核準則 §25 II, IV. Verified.
- Refund route: recipient or withholding agent, within 10 years from payment, with the documents and 扣繳憑單, to the tax office that received the withholding return; transitional rule of the 2025-04-08 amendment (already >5 years → old rules) → §34 I, III. Verified.
- 5% surtax from tax year 2018; dividends out of the year's earnings deducted if actually paid by the end of the following fiscal year; return May 1–31 of the year after the annual return → §66-9 I, II(2), III; §102-2 I. Worked example (calendar-year 2025 earnings → dividends by end-2026 → surtax return May 2027) is consistent with §71 (annual return May 2026) + §102-2. ja §23 fiscal-year sentence verified.
- Enterprises headquartered outside Taiwan exempt from the surtax return → eTax 2814 (1)(1). Verified.
- Branch: §3 III; 台財稅第7586738號 (76-03-09) 「尚無盈餘分配問題…分公司應毋庸扣繳稅款」; 認定原則 point 2 (修正 112-10-13). Verified in all four.
- 外國人投資條例 §12 I 「得以其投資每年所得之孳息或受分配之盈餘，申請結匯」 → verified.
- Korea Art 23(2) (ko only) and Japan Art 22(1) (ja only) are quoted from the agreement text and followed by "check with a Korean/Japanese adviser"; en/zh give only the adviser caution. Home-country rules are not stated as fact. Complies with brief rule 10.
- US status (en, zh): only the 1988 shipping/air exchange of letters; H.R.33 423–1 on 2025-01-15, referred to Senate Finance 2025-01-16; S.199 referred 2025-01-23; no later action as of 2026-10-06; §894A reciprocity condition; MOF 2025-01-17 statement → all verified against the API, govinfo and the MOF release.
- Arithmetic: ko 10,000,000 × 21% = 2,100,000, × 10% = 1,000,000, difference 1,100,000 ✓; ja 20,000,000 → 4,200,000 / 2,000,000 / 2,200,000 ✓; en 10 million → 2.1m / 1.5m / 1m ✓; en "79 cents of every dollar" = 100 − 21 ✓.
- Amendment/effective dates in the sources sections (2026-09-11; 2022-02-21; 2021-06-30; 2025-04-08; 1997-11-19; §§88/89/92/114 amended 2024-08-07 in force 2025-01-01; 認定原則 2023-10-13; MOF list 2026-09-04; eTax 1503 2026-04-10 and 2814 2026-04-27; releases 2016-06-15 / 2023-12-28 / 2025-01-17) all match the pages opened.
- Cross-language: identical numbers (21 / 10 / 15 / 10 days / +5 / 6 months / 1× / 3× / 5% / 10 years / 5 years), identical article numbers and dates. No contradiction found.

## 2. Citations

- Every rate/deadline/condition has an inline markdown link right after it; statute links are the law.moj.gov.tw single-article URLs for the correct pcode and flno (checked each: G0340003 §3/66-9/88/89/92/102-2/114, G0340004 §82, G0340028 §4, G0340125 §4/25/34, J0040002 §12; ja also §23).
- Agreement links point to the MOF download of the official text (ko → Korea 中文 original + English + 2026 amendment; ja → Japan 中譯本 + English; en → English texts of all three; zh → Chinese texts of all three).
- Sources sections are complete and carry the check date 2026-10-06 in each language. 扣繳率標準 §14 is listed in the sources of ko/ja/en/zh without an inline use — it corroborates the 2018 effective date and is harmless; not an error.
- Internal links exist in each language (lint existence check OK): ko 2, ja 3, en 3, zh 2 — all within 1–3 and none to this batch.

## 3. Rules

No bold, no phone number, no street address, email-only contact once near the end in each file, firm named per brief, no bookkeeping/filing/audit offer (each contact line asks only for the planned payment date and ownership structure), author legal-ai-assistant, no lawyer/CPA/native-review claim, hypotheticals labelled after the scene (가상의 예입니다 / 架空の例です ×2 / an invented example; zh has no hypothetical), frontmatter per brief (topic tax, tags ["tax-accounting"], NNN image path, dates, FAQ 3 items consistent with body; en title + " | Hovering Law" = 79 chars → seoTitle 42 chars present; en summary 160 chars, no forbidden characters). Lint OK on all four.

## 4. Voice

- ko: 합니다체 throughout, no 해라체; title names the object and the two rates; first paragraph answers the reader's question with the two numbers and who withholds; subheads are specific; no 전개 예고, no checklist headings.
- ja: です・ます throughout (no だ・である found); the 3月決算 parent example and the remark that the subsidiary's calendar fiscal year does not line up with the parent's April–March year are the Japanese-reader angle the topic brief asked for; 日台民間租税取決め described exactly per NTA.
- en: plain, active; US parent angle, bill status, four-country table; no "Suppose", no "This means / It is important to note".
- zh-hant: Taiwan usage (國稅局/稽徵機關, 扣繳義務人, 營所稅, 未分配盈餘, 結匯, 民國 years in the table); no mainland terms or simplified characters (lint); the opening is a finance-staff question.

## 5. Sentence variety

variety_metrics.py check: ko OK (cv 0.514, short 10.2%, q=2); ja OK with one WARN ("76% of sentences end in desu-masu") — not a FAIL and natural for a です・ます column; en OK (cv 0.585, short 20.3%, q=3); zh-hant OK (cv 0.654, q=3). Self-check items 2–7: opening type ② (reader's question) in all four as assigned; ≥2 very short sentences in each; paragraph-initial words read vertically repeat at most twice; no three consecutive claim-(statute)-caveat paragraphs (caveat count 0–1) and each file has uncited paragraphs (examples, contact, closing); contrast templates 0–1 per file; last body paragraph ends on this column's fact (the 扣繳憑單 and §34). No MONOTONY finding.

## Issues (Original → problem & reason → fix → facts preserved)

Major: none.

Minor (applied):
1. en, line 37 — "…fined up to one times the tax involved; missing that deadline raises the fine to up to three times ([Article 114]…)" → "one times" is not natural English and "up to … up to" stacks → "…fined up to the amount of tax not withheld; missing that deadline raises the ceiling to three times that amount ([Article 114]…)" → preserved: the 1× ceiling, the 3× ceiling after the cure deadline, the §114 item 1 citation.

Noted, no change needed:
- en summary "Japan and Korea cap it at 10 percent, Vietnam at 15" is metonymy for the agreements; the beneficial-owner condition is in the body and FAQ 2. A more literal wording ("Tax agreements cap it…") would run to 168 characters, over the 160 limit, so left as is.
- en calls H.R. 33 "the United States-Taiwan Expedited Double-Tax Relief Act": that is the short title of Title I (the API lists it among the bill's short titles); acceptable shorthand.
- "Act for Investment by Foreign Nationals" vs the database's capitalisation "Act For Investment by Foreign Nationals": typographic only.

## Minor edits applied

- drafts/T2/en.md line 37 (Article 114 penalty sentence) — wording only, as above. Lint re-run: OK [length 1527 words]; variety re-run: OK, no limit violated.
- No edits to ko, ja, zh-hant.

## Image

images/T2.webp — a container terminal with gantry cranes seen across calm water at dusk; no people, faces, text, logos, flags or readable documents; neutral and respectful. It reads as cross-border trade/remittance, which fits a column on money flowing from a Taiwan subsidiary to its foreign parent, though the fit is generic rather than specific. Verdict: OK.

VERDICT: PASS
