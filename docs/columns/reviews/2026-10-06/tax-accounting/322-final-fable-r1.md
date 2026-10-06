# T8 final accuracy review — taiwan-payroll-foreign-employees-withholding-social-insurance (ko · ja · en · zh-hant)

Reviewer: Claude Fable 5.1 (final gate). Review date: 2026-10-06 (KST). Files reviewed: drafts/T8/{ko,ja,en,zh-hant}.md, drafts/T8/facts.md (untrusted, re-checked), research/R4-official.md, research/R4-statutes.md, research/R2-official.md, research/R2-T2-added.md, research/T8-extra.md, images/T8.webp.

## Verdict

PASS — all four language versions are publishable as they now stand; image OK. No major issue found. Three minor wording edits applied (listed below); lint and variety_metrics re-run and OK on all four files after the edits.

## Scope checked — official pages I opened myself (all on 2026-10-06, saved under reviews/T8/sources/)

Statutes (law.moj.gov.tw LawSingle, via fetch_law.py → sources/statutes.md; each law's 修正日期 as printed on LawAll):
- 所得稅法 (G0340003, 修正日期 民國115年09月11日): §7, §8, §14, §71, §71-1, §73, §92
- 所得稅法施行細則 (G0340004, 111-02-21): §60
- 各類所得扣繳率標準 (G0340028, 110-06-30): §2, §3
- 適用所得稅協定查核準則 (G0340125, 114-04-08): §26
- 就業服務法 (N0090001, 114-01-20): §43
- 勞工保險條例 (N0050001, 115-01-21): §6, §15
- 就業保險法 (N0050021, 111-01-12): §5
- 勞工退休金條例 (N0030020, 108-05-15): §7, §14
- 全民健康保險法 (L0060001, 112-06-28): §9, §27, §31, §34
- 外國專業人才延攬及僱用法 (A0030295, 114-09-24 全文修正): §23, §24, §25; LawHistory (sources/lawhistory-A0030295.txt): 行政院 114-11-18 令 — §4(4)(4)後段、§28、§29 自115-06-30施行，其餘條文自115-01-01施行 → §23–§25 in force 2026-01-01
- 最低工資法 (N0030028, 制定 112-12-27): §18; LawHistory (sources/lawhistory-N0030028.txt): 行政院 112-12-29 令定自113-01-01施行

MOF / DOT / eTax / MOL / BLI / NHI pages (HTML saved + .txt extracts):
- 財政部 2025-11-27「公告115年度綜合所得稅…免稅額、扣除額、課稅級距…」(cntId=34b463dc…) + attachment table PDF (download/bb34472701e4443c910788e792dae85c, 「114年11月27日製表」): 免稅額 101,000; 標準扣除額 136,000 / 有配偶 272,000; 薪資所得特別扣除額 227,000; 40% 級距 5,190,001以上
- 財政部高雄國稅局 2026-01-28「年終獎金，領多少要先扣稅?」(cntId=1d6facba…): 起扣標準 115年度 90,501元, 5%, 次月10日前繳清
- 財政部高雄國稅局 2026-03-26「115年起基本工資調升！「非居住者」薪資扣繳基準同步調整」(cntId=dd1c8e64…): 基本工資 29,500 自115-01-01, 基準 44,250 (29,500×1.5), ≤44,250 → 6%, >44,250 → 18%; 10日內繳清並申報
- 財政部中區國稅局 2026-05-08「外僑個人綜所稅申報，應留意稅務居民身分」(cntId=8131a49d…): 183天, 5月1日–31日, 離境前申報, 所漏稅額3倍以下罰鍰
- 財政部 2023-12-28「我國與韓國所得稅協定於112年12月27日起生效，自113年1月1日起適用」(cntId=127fffb3…)
- 財政部 2016-06-15「…臺日租稅協定於105年6月13日生效，自106年1月1日適用」(cntId=dot70257)
- 財政部「我國所得稅協定一覽表」(singlehtml/191?cntId=63930, 發布/更新 2026-09-04): 美國 only in the 單項/海空運輸 table (1988/05/31); Vietnam 1998/04/06 簽署, 1998/05/06 生效; Japan 2016/06/13; Korea 2023/12/27 (+ 修正協議 2026/08/04)
- 財政部賦稅署 2026-01-15 (115-01-15)「114年度各類所得憑單申報截止日為115年2月2日」(cntId=fe3d81c7…)
- 財政部稅務入口網 外僑稅務服務「四、居留日數之計算」(NJr2poV, 更新 115-04-27): 始日不計末日計, 累積計算
- 同「一、外僑綜合所得稅與居留期間的關係」(15r2N1n, 更新 115-04-27): ≤90 / >90<183 / ≥183 bands, 境外雇主報酬 self-filed / included in annual return
- 同 稅務問與答 1514 (QYglDKr, 更新 111-04-29): contract/visa/ARC test, resident-rate withholding from the start, recompute if <183, non-resident rate if documents show <183 or none; 財政部67年1月20日台財稅第30456號函
- 勞動部 FAQ「勞工保險的普通事故保險費率是多少？」(7416, 更新 2026-03-17): 115年為12.5%(其中1%為就業保險費率)
- 勞動部「歷年最低工資/基本工資調整」(76761, 更新 2025-12-04): 114-10-21發布, 自115-01-01, 每月最低工資 29,500元
- 勞動部勞工保險局 2025-12-29「從事專業工作之外國專業人才及外國特定專業人才，自115年1月1日起適用勞工退休金條例」(bli.gov.tw/0109649.html): ≥6%, 個人專戶, 115-06-30前書面表明舊制, 修法後新僱者自到職日起適用新制
- 衛生福利部中央健康保險署「115年 投保單位(雇主)及保險對象補充保險費資料簡表」(PDF, no day date): 一般保險費率 5.17%, 補充保險費率 2.11%, (薪資總額−投保金額總額)×2.11%
- 国税庁「日台民間租税取決めに定める相互協議手続について」(nta.go.jp …/nichitai/01.htm, Shift_JIS, re-decoded): 注1 (民間取決め, 日本国が締結した国際約束ではない), 注2 (名称変更 2017)
- 日本年金機構 "Status of Agreements in Force" (printed "Last updated date：3 2 2026"): 24 countries listed, Taiwan absent; "elimination of dual coverage and the totalization … possible only between Japan and these countries"
- 국민연금공단 사회보장협정 페이지 (nps.or.kr …/getOHAF0126M0.do): text search for 대만/타이완/중화민국/Taiwan = 0 hits (list includes 미국, 일본, 베트남 etc.)

Agreement texts (MOF downloads, pdftotext):
- 臺韓 合併文本 中文 (download/ea19d023…) Art 15(2): 「相關會計年度中開始或結束之任何十二個月期間內…不超過一百八十三天」/ 非他方領域居住者之雇主給付或代表給付 / 非由常設機構或固定處所負擔; English (download/9679b16a…) Art 15(2)(a) "fiscal year concerned". Title 駐韓國台北代表部與駐臺北韓國代表部…協定.
- 臺日 中譯本 (download/10422) Art 15(2): 「相關曆年度中開始或結束之任何十二個月期間內」; English (download/10462) "calendar year concerned". Title 亞東關係協會與公益財團法人交流協會…協定.
- 臺越 中譯本 (download/6b925556…) Art 15(2): 「於一曆年度內…不超過一百八十三天」/ 「固定營業場所或固定處所」; English (download/66dc13da…) "183 days in the calendar year concerned"; signed 1998-04-06 Hanoi (line 771).

Tools: lint.py OK on all four (ko 3,472 chars; ja 4,467 chars; en 1,598 words; zh-hant 2,612 chars). variety_metrics.py: no FAIL in any language (zh-hant WARN only — the required 「（虛構情境）」 label falls inside the first 80 chars; the opening is the assigned type ③ scene and is the only scene opening in batch 2: T7 ②, T9 ①, T10 ④, T11 ⑤).

## Fact check results (per language)

Every rate, threshold, date, article number, agreement term and procedure in the four columns matched the official text I opened. Specifically verified: 183-day residence test (§7 II(2)), calendar tax year + day-count method (eTax), §8(3) proviso wording (≤90 days, 境外僱主), §14 salary scope, the three eTax bands, resident withholding choice (扣繳率標準 §2 I(1)), bonus 5% at 90,501 (ja/en/zh), 18%/6% and 44,250 from 2026-01-01, Q&A 1514 conditions, §92 I/II deadlines (10th of next month; end-January; Feb 10; 10 days for non-residents) and the 2026-02-02 deadline for 2025 income, §71 May 1–31, §73 + 施行細則 §60 (same-type withholding rate, before departure / within the filing period), 3× fine (中區國稅局), §71-1 II (spouse joint filing), 2026 amounts (101,000 / 227,000 / 136,000 / 272,000 / 40% from 5,190,001), Korea Art 15(2) (fiscal-year window; applies from 2024-01-01), Japan Art 15(2) (calendar-year window; private arrangement per NTA; Taiwan applies from 2017), Vietnam Art 15(2) (calendar year; 1998), 查核準則 §26 documents, US = shipping/air 1988 only, 勞保 §6/§15 and 12.5% incl. 1%, 就保 §5 I(2) + 外專法 §25, 勞退 §7/§14 + 外專法 §24 (2026-01-01; opt-out by 2026-06-30), 健保 §9/§27/§31/§34 + 外專法 §23, 5.17% / 2.11%, Japan 24-country list and Korea NPS list without Taiwan, 就業服務法 §43.

Arithmetic: ko 2026-01-05 arrival → day 183 = 2026-07-07 (arrival day excluded, no trips) — correct. ja 2026-04-01 → 2026-10-01 — correct. zh 120,000 × 18% = 21,600 — correct. en early-February arrival / zh early-March start with multi-year contracts exceed 183 days in 2026 — correct. ko October two-month visit ≤ 90 days, non-resident, paid by the Korean HQ → not Taiwan-source under §8(3) — correct.

Cross-language consistency: the three bands, the 18%/6%/44,250 rule, the §92 deadlines, the 2026 amounts, the social-insurance rates and the agreement windows (KR 會計年度 / JP 曆年度 / VN 一曆年度) are stated identically in substance across ko, ja, en, zh-hant. No contradiction found.

UNVERIFIED items from topics/T8.md and R4: none stated as fact. Checked absent: 6% band for foreign-paid salary of 90–183-day stayers; social-insurance duty for parent-payroll secondees (all versions say only that it depends on who the employer is in Taiwan); "one week before departure"; 外專法 §22; occupational-accident insurance; any general statement that Taiwan has/lacks social-security agreements (only the Japanese and Korean official lists are cited, with URLs; nothing on the US list); exit-ban thresholds.

Foreign law: ko (국민연금·건강보험 → 한국 쪽 기관에 확인), ja (厚生年金・健康保険・住民税 → 年金事務所や税理士にご確認), en (US tax adviser), zh (請母公司向當地機關確認) — all general cautions only. Agreement naming per brief: ko 「양측 대표부가 맺은 한-대만 조세약정」, ja 日台民間租税取決め with the two associations and the NTA note, en "tax agreement", zh 租稅協定.

## Citations

Inline links sit right after each claim; every statute link resolves to the single-article URL of the article named; agreement links go to the MOF-hosted official texts; MOF/DOT/eTax/MOL/BLI/NHI/NTA/nenkin/NPS links match the pages I opened. Sources sections are complete with the check date 2026-10-06 in each language and the amendment dates match LawAll (所得稅法 2026-09-11; 施行細則 2022-02-21; 扣繳率標準 2021-06-30; 查核準則 2025-04-08; 最低工資法 enacted 2023-12-27 / in force 2024-01-01; 就業服務法 2025-01-20; 勞保條例 2026-01-21; 就保法 2022-01-12; 勞退條例 2019-05-15; 健保法 2023-06-28; 外專法 2025-09-24 with §22–25 in force 2026-01-01). Internal links all exist in LINKS.md for that language: ko taiwan-income-tax-residency + korea-taiwan-tax-agreement-dispatched-engineers-permanent-establishment; ja taiwan-income-tax-residency + japan-taiwan-tax-agreement-semiconductor-expatriates; en taiwan-income-tax-residency + vietnamese-companies-taiwan-vietnam-tax-agreement (batch-1, published); zh-hant taiwan-income-tax-residency. en us-equipment-vendor-field-engineers-taiwan-labor-law is not in LINKS.md and is correctly not linked. No batch-2 (T7–T11) links.

## Rules

No bold (regex and lint), no phone numbers, no LINE/Kakao IDs, one mailto per file (wei@hoveringlaw.com.tw), no street address, no bookkeeping/filing/audit offer (contact paragraphs ask only for the contract and travel plan), `author: "legal-ai-assistant"`, no lawyer/CPA/native-review claim, hypotheticals labelled after the scene in all four (「(가상의 예입니다)」「（架空の例です）」"(an invented example)"「（虛構情境）」), frontmatter per brief (topic "tax", tags ["tax-accounting"], audience = file language, categories, featured_image with literal NNN, 2–3 FAQ items consistent with the body). en title 83 chars → seoTitle required and present (40 chars); en summary 157 chars, no forbidden characters. ko/ja/zh seoTitle 23/18/17 chars, all different from the title.

## Voice and sentence variety

ko: calm 합니다체 throughout, no 해라체; opening scene delivers the facts (dates, payer) and the second paragraph states the two deciding variables; headings are specific; two reader questions in the body; last paragraph ends on the column's own dates. ja: です・ます throughout (tool: no register mix); the April–March fiscal-year angle is used naturally; contrast template once. en: plain and active, short sentences mixed in ("Three people, three tax positions.", "Non-residents pay more.", "Relief needs paperwork."); paragraph openers "A"/"The"/"For" at most twice each. zh-hant: Taiwan usage only (國稅局、扣繳義務人、勞健保、勞退、新臺幣、社會安全協定), no 大陸用語, no simplified characters; opens with a question-led scene.

Self-check items 2–7 (SENTENCE-VARIETY-RULE §5): all met in all four languages after the ja edit below (ja had three paragraphs opening with 「日本」; now two). No MONOTONY finding.

## Issues found

No major issue. Minor items (all applied as edits, facts/numbers/citations unchanged):

1. en, "When the subsidiary runs the payroll", Q&A 1514 paragraph
   Original: "Without such documents, non-resident rates apply from the start."
   Problem: the source (稅務問與答 1514) names two triggers — documents showing a stay under 183 days, or no documents — and ko/ja/zh state both; the en sentence covered only the second.
   Fix (applied): "If the documents show a shorter stay, or none are provided, non-resident rates apply from the start."
   Facts preserved: same source, same rule; condition made complete.

2. en, same section, basic wage / minimum wage sentence
   Original: "The Ministry of Labor calls it the minimum wage ([Minimum Wage Act Article 18])."
   Problem: §18 does not say what MOL calls the figure; it provides that other laws' basic-wage provisions apply the minimum-wage rules. ja and zh explain §18 this way; en cited §18 for a different statement.
   Fix (applied): "The Ministry of Labor calls the same amount the minimum wage, and the Minimum Wage Act applies that term to other laws' basic wage ([Minimum Wage Act Article 18])."
   Facts preserved: 29,500 / 44,250 / §18 link unchanged; the sentence now matches what §18 says.

3. ja, "日本の本社籍のままの出向者と日本側の社会保険", second paragraph
   Original: "日本年金機構の社会保障協定の発効状況には24か国が並び、台湾は含まれていません。"
   Problem: three consecutive-section paragraphs opened with 「日本」(日本の本社と… / 日本年金機構… / 日本と台湾の…), against self-check item 4 (same opening word ≤2).
   Fix (applied): "年金の二重加入についても見ておきます。日本年金機構が公表する社会保障協定の発効状況には24か国が並び、台湾は含まれていません。"
   Facts preserved: 24 countries, Taiwan absent, nenkin.go.jp link, the dual-coverage/totalization sentence and the 年金事務所・税理士 caution all unchanged.

Word-count trims in en to stay within 1,600 words after edits 1–2 (no fact removed): deleted the topic sentence "No treaty relief is available for US assignees." (the next sentence states the same fact with its source), "who really employs them" → "who employs them", "Meanwhile the subsidiary hires" → "The subsidiary hires". en body now 1,598 words.

Noted, not edited: zh-hant describes the third Art 15(2) condition for all three agreements as 「不由雇主在我國的常設機構或固定處所負擔」; the Vietnam Chinese translation renders "permanent establishment" as 固定營業場所. Same legal concept (both English texts say "permanent establishment or a fixed base"), so no change required.

## Minor edits applied (summary)

- drafts/T8/en.md: Q&A 1514 condition sentence (issue 1); Minimum Wage Act §18 sentence (issue 2); three word-count trims listed above.
- drafts/T8/ja.md: opener of the 日本年金機構 paragraph (issue 3).
- drafts/T8/ko.md, drafts/T8/zh-hant.md: no edits.

Post-edit checks: lint.py OK ×4; variety_metrics.py no FAIL ×4 (ja opener_rep 0.231 → 0.192; en 1,598 words).

## Image

images/T8.webp: a wooden coat stand holding three coats (charcoal, oatmeal, sage) in a quiet office alcove with a potted tree, plaster wall and terrazzo floor. Fits the column (three employees, three positions); fictional and unidentifiable; no faces, text, logos, flags or readable documents; respectful. Image verdict: OK.
