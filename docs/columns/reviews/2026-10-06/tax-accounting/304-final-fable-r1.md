# T4 final accuracy review (Claude Fable 5.1, round 1) — taiwan-transfer-pricing-documentation-thresholds

Reviewed 2026-10-06 (KST). Files: drafts/T4/ko.md, ja.md, en.md, zh-hant.md (+ facts.md, research/R3-statutes.md, R3-official.md, images/T4.webp). All fetched sources saved under reviews/T4/sources/.

## Verdict

PASS — all four languages publishable now; image OK. No major (law/fact/citation/rule) issue found. Four minor wording edits applied (listed below); lint OK and variety check FAIL-free on every file after the edits.

## Scope checked — official pages opened on 2026-10-06

Statutes (law.moj.gov.tw single-article pages, via fetch_law.py → sources/statutes.md; every article text is byte-identical to research/R3-statutes.md, verified with a per-article comparison script):
- 營利事業所得稅不合常規移轉訂價查核準則 (G0340019), 修正日期 民國109年12月28日 (LawAll header; 法規整編資料截止日 民國115年9月24日): §1, §3, §4, §21, §21-1, §22, §22-1, §23, §26, §27, §32, §33, §34, §36. Full LawAll page also saved (sources/lawall-G0340019.html); a search of its full text finds 「稅捐稽徵法」 only in §33(3) and no separate penalty for late master file / CbCR — consistent with the columns' silence on that point.
- 所得稅法 (G0340003), 修正日期 民國115年9月11日: §43-1, §71, §80, §110, §110-2. LawHistory page (sources/history-G0340003.html): entry 71 = 一百十五年九月十一日 令修正公布第17、126條 — the latest amendment does not touch any article cited, so "last amended September 11, 2026" is correct for the law as a whole.
- 稅捐稽徵法 (G0340001), 修正日期 民國110年12月17日: §46.
- law.moj.gov.tw/ENG LawAll headers (sources/eng-G0340019/G0340003/G0340001.txt): titles "Regulations Governing Assessment of Profit-Seeking Enterprise Income Tax on Non-Arm's-Length Transfer Pricing" (Amended Date 2020-12-28), "Income Tax Act" (2026-09-11), "Tax Collection Act" (2021-12-17) — match en sources section.

MOF orders (law-out.mof.gov.tw, sources/mof-*.txt):
- GL004622 財政部 97.11.06 台財稅字第09704555160號 (local-file substitute thresholds; 自97年度適用): point 1(一) 未達3億; (二) 3億以上未達5億 + no incentives/loss deduction (de minimis 2百萬/8百萬) + 未與中華民國境外之關係企業（包括總機構及分支機構）交易; (三) 全年受控交易總額未達2億; point 3 absolute-amount sum across all types, income or expense; point 4(二) internal comparables first, else public tender documents / 時價資料 / 估價報告書或鑑價報告 / foreign related party's TP report under its own country's rules (corrected where plainly inconsistent).
- GL010736 財政部 108.12.10 台財稅字第10804651540號 (MF/CbCR exemption; 自106年度適用; repeals 106.12.13 order): 1(一) 未達30億 或 跨境受控交易總額未達15億; 2(一) UPE in Taiwan, 前一年度合併收入總額未達270億 (EUR 7.5億 at 104年1月 rate); 2(二)4 Taiwan member meeting the MF exemption; point 4 written-notice presentation of MF/CbCR the group must file elsewhere.
- GL004604 財政部 96.01.09 台財稅字第09604503530號 (disclosure; 自95年度 returns): 收入總額3千萬以上 + 境外關係人 → disclose related enterprises at 1,200萬 with one / 5,000萬 with all. Page shows 公發布日 only, no 修正日期.
- GL009978 稅務違章案件裁罰金額或倍數參考表, 修正日期 民國115年5月6日 (台財稅字第11504532050號令). Attachments fetched and converted with pdftotext: 所得稅法、所得基本稅額條例(114.8.8).pdf (FileID 53174) → row 第一百十條第一項（營利事業所得稅）: ≤10萬 → 0.5倍; >10萬 → 0.8倍; 故意 → 1倍; a search for 「移轉訂價」/「常規」 returns nothing. 稅捐稽徵法(114.12.24).pdf (FileID 53176) → row 第四十六條第一項: 第一次 3,000 / 連續第二次 9,000 / 第三次及以後 每次 30,000.

Agency pages:
- dot.gov.tw ch_460 cntId=dot_201712210007_460 (移轉訂價報告避風港標準): lists the 97/11/06, 104/02/02, 108/09/05 orders; 發布日期 106-12-21, 更新日期 115-05-26.
- mof.gov.tw singlehtml/384fb…?cntId=e47bcba… (財政部高雄國稅局 release, 發布日期 2019-11-04): 會計年度終了後1年內; conjunctive 30億 且 15億 wording; 107年度 reports due 108年12月31日 for calendar-year companies; e-filing system open all year from 108年5月1日.
- ntbt.gov.tw 114年度營利事業所得稅結算申報書格式 page: schedule 「關係人交易明細表及跨國企業集團成員揭露資料」; 更新日期 115-02-09.
- mof.gov.tw singlehtml/191?cntId=63930 (我國所得稅協定一覽表, 發布/更新 2026-09-04): 越南 signed 1998/04/06, effective 1998/05/06; comprehensive table has no United States entry; 單項/海空運輸協定 table: 美國 海空運S&A 1988/05/31.

Internal links: /{ko,ja,en,zh-hant}/columns/taiwan-company-subsidiary-vs-branch exists in all four content dirs of ~/Projects/tseng-law-tax-board-20261006 (004-taiwan-company-subsidiary-vs-branch.md); lint confirms.

Tools: lint.py OK on all four files (ko 3,471 chars, ja 4,345, zh-hant 2,665, en 1,588 words); variety_metrics.py: no FAIL on any file (ko/ja show only the register WARN on 니다/です・ます endings, which is expected for 합니다체/です・ます and not a FAIL line).

## 1. Law and facts — per language

All claims below were checked against the saved source text; "✓" = correctly stated, with conditions, year and who/when preserved, and consistent across the four versions.

- Opening quotes: ko §22 I clause (verbatim up to the comma; closed with 。— abridged quotation, acceptable), ja GL004622 point 1(二)2 (verbatim), en §22 IV clause (verbatim), zh §34(3) (verbatim) ✓.
- ITA §43-1 adjustment power with MOF approval; 準則 issued under ITA §80 V (§1); current version 2020-12-28 ✓ (all four).
- §3 tests: ≥20% voting shares/capital direct or indirect; largest holder with ≥10%; half or more of directors the same; §3(7) foreign head office ↔ Taiwan branch ✓ (all four).
- Local file: ready at the return (§22 I); present within 1 month of service of the written investigation notice; one extension ≤1 month applied for before expiry (§22 IV); further documents within 1 month (ja); table of contents/index and Chinese translation unless English approved (§22 V; ja/en/zh) ✓.
- Substitute-document tiers (GL004622, from 97年度/2008 returns): <3億; 3億–<5億 with no incentives / no loss deduction (small exceptions) AND no dealings with foreign related enterprises incl. head office/branches; otherwise controlled transactions <2億 (absolute-amount sum, all types, income and expense; point 3); APA-covered amounts excluded (§22 III) ✓. "Middle tier rarely helps a foreign-owned subsidiary" follows from 1(二)2 ✓. Alternative documents per point 4(二) incl. the foreign related party's own-country TP report, corrected where plainly inconsistent ✓.
- Disclosure (§21; GL004604 from 95年度/2006): 收入總額 ≥3,000萬 + foreign related party → 1,200萬 with one / 5,000萬 with all related enterprises; MNE members also name the MF-filing member, UPE, CbCR filer/surrogate; 114年度 form schedule, page updated 2026-02-09 ✓.
- Master file (§21-1; GL010736 from 106年度/2017): ready at filing, submit within 1 year after FY end; one Taiwan member may be designated; exempt if revenue <30億 OR cross-border controlled transactions <15億 (so both must be reached); English MF → Chinese translation within 1 month of written notice (ko/ja/en/zh), extension not claimed beyond the order ✓.
- CbCR (§22-1; GL010736): Taiwan UPE, prior-year consolidated revenue 270億 = EUR 7.5億 at the 104年1月 rate; foreign UPE → Taiwan member files only in the three §22-1 II cases; even then exempt if it meets the MF exemption (2(二)4); point 4 written-notice presentation; online upload all year (Kaohsiung release) ✓.
- Consequences (§33): assessment from information obtained, else 同業利潤標準 for the related revenue/costs/expenses; §33(3) → TCA §46 NT$3,000–30,000; reference table 3,000 / 9,000 / 30,000 (table amended 2026-05-06) ✓. §34 four tests (2×/50%; 10% AND 3%; no report and no other proof; undisclosed transactions 5% AND 1.5%) → ITA §110 I up to 2× the shortfall; reference multiples 0.5× (≤10萬) / 0.8× (>10萬) / 1× intentional; no TP-specific line ✓. §110-2 is not cited ✓.
- APA (§23, §26, §27, §32): total ≥5億 or ≥2億 a year; no major evasion in the prior 3 years; documents and TP report prepared; apply before the end of the first covered FY; pre-filing meeting ≤3 months before that year-end; review 1 year + 6 + 6 months; term 3–5 years from the application year; renewal ≤5 years; bilateral/multilateral APA via MAP under the applicable income tax agreement = §23 paragraph 7 (counted: 7th paragraph) ✓.
- ITA §71: May 1–31 return period → 2025 (114年度) return 2026-05-01 to 05-31; MF/CbCR for 2025 due 2026-12-31 for a calendar-year company (會計年度終了後一年內; mirrors the Kaohsiung release's 107年度 → 108-12-31 example) ✓.
- en only: MOF agreement list updated 2026-09-04 — Vietnam in force 1998-05-06; no comprehensive US agreement, only the 1988 shipping & air transport agreement ✓.
- Foreign-law statements: ko "한국 세무 전문가와 확인", ja "日本の税理士にご確認", en "A US tax adviser can confirm" — general cautions only; no Korean/Japanese/US/Vietnamese rule stated as fact ✓. ja does not call the Japan–Taiwan arrangement a treaty (it is not mentioned; §23 VII is rendered as the statute's "適用される所得税協定") ✓.
- Arithmetic: 270億 ↔ EUR 7.5億 is the order's own statement; no other computed figures. Dates: 97年度=2008, 95年度=2006, 106年度=2017, 108年=2019, 104年1月=Jan 2015, 114年度=2025 ✓.
- Cross-language consistency on law: identical thresholds, deadlines, article numbers, amendment dates (準則 2020-12-28; ITA 2026-09-11; TCA 2021-12-17; 參考表 2026-05-06) in all four ✓.

Observation (not an error): the 2019 order's point 2(二) items 1–3 (exemption where the group meets the UPE's or surrogate's home-country CbCR threshold, etc.) are not described; the columns restate the three statutory §22-1 II cases plus the 2(二)4 MF-threshold exemption, which is accurate and sufficient for a foreign-owned subsidiary. No change required.

## 2. Citations

Inline links follow each claim; every statute link points to the correct pcode/flno (checked all 20 distinct law.moj.gov.tw URLs across the four files against the fetched article list); MOF orders link to the law-out.mof.gov.tw pages whose text was verified; the Kaohsiung release, DOT page, NTBT forms page and (en) the agreement list link to the pages fetched. Sources sections in each language list every source used with the check date 2026-10-06 (ko 확인일, ja 確認日, en Checked, zh 確認日期). Internal link exists in each language ✓.

## 3. Rules

No bold, no phone, no street address, email-only contact (one soft paragraph before the closing fact paragraph), no bookkeeping/filing/audit offer, author legal-ai-assistant, no lawyer/CPA/native-review claim, no invented client story (no hypothetical scene is used, so no label is needed), frontmatter per brief (topic tax, tags ["tax-accounting"], audience = file language, featured_image NNN literal, FAQ 3 items consistent with the body; en title >60 with " | Hovering Law" so seoTitle 39 chars present; en summary 150–160 chars, no forbidden characters) — all confirmed by lint OK and by reading.

## 4. Voice

- ko: 합니다체 throughout; opening type ⑥ (statute sentence → practical meaning); headings specific (지분 20%면 관계기업입니다 / 세 문서의 기준과 기한 / …); no 예고 or filler; last paragraph ends on the 2026-05-31 / 2026-12-31 facts.
- ja: natural です・ます; no だ・である mix; opening quotes the MOF order and explains why a Japanese-parented subsidiary falls outside tier 2; one reader question each in two sections.
- en: plain, active; "One month is short." / "Language matters." as short sentences; no "This means / It is important to note".
- zh-hant: Taiwan usage (國稅局, 稽徵機關, 營所稅, 替代文據, 派不上用場, 網路上傳); no mainland vocabulary or simplified characters (lint); opening quotes §34(3) and goes straight to the consequence.
- Titles: noun phrases naming the three documents, thresholds and deadlines; not imperative or clickbait.

## 5. Sentence variety

variety_metrics.py: ko cv 0.50, short 10.4%, cite_end 10.4%, contrast 0; ja cv 0.527, short 10.1%, cite_end 10.1%, contrast 0; en cv 0.57, short 18.5%, contrast 0; zh cv 0.563, short 10%, contrast 0 — no FAIL. Self-check items 2–7: no stock opener; ≥2 very short sentences per file; no three paragraphs with the same first word; no claim-(statute)-caveat triple; each file has at least one paragraph without a citation; contrast templates 0; last paragraph ends on the column's facts. MONOTONY: none.

## 6. Issues — Original → problem & reason → fix → facts preserved

1. ko summary (frontmatter): 「마스터파일은 수입총액 30억·국외 특수관계 거래 15억 대만달러를 모두 넘을 때 … 제출합니다」 → "넘을 때" reads as strictly exceeding, while GL010736 1(一) exempts only 「未達30億」/「未達15億」, so the duty starts at exactly 30億/15億 (the body table already says 30억 이상 / 15억 이상) → applied: 「마스터파일은 수입총액 30억 이상이고 국외 특수관계 거래 15억 대만달러 이상일 때 … 제출합니다」 → thresholds, conjunction and deadline unchanged; now aligned with the body and the order.
2. ko body (마스터파일과 국가별보고서 section): 「([재정부 2019년 11월 4일 보도자료](…))」 → the release is issued by 財政部高雄國稅局 (page footer 發布單位：財政部高雄國稅局), and the ko sources list already says 재정부 가오슝 국세국 → applied: link label changed to 「재정부 가오슝 국세국 2019년 11월 4일 보도자료」 → URL and date unchanged.
3. ja body (same section): 「基準は二つです。両方を超えて初めて提出義務が生じます。」 → "超えて" (exceed) is narrower than the order's 達 (reach; exempt only if 未達) and than the preceding sentence's 「30億台湾元未満、または…15億台湾元未満の会社を免除」 → applied: 「両方に達して初めて提出義務が生じます。」 → thresholds unchanged.
4. en body (When the documents are missing): 「and 1 times where the under-reporting was intentional」 → "1 times" is unidiomatic → applied: 「and a fine equal to the shortfall where the under-reporting was intentional」 → the 1× reference multiple (處所漏稅額一倍之罰鍰) is preserved in meaning; 0.5× and 0.8× untouched.

Noted, no change: ko opening quote abridges §22 I at the comma and closes with 。(the article continues 「，至少包括該營利事業之下列內容」); the quoted words are verbatim and the sentence is introduced as 「제22조 제1항의 문장」, so this is an acceptable abridgement.

## Minor edits applied

- drafts/T4/ko.md: summary wording (30억 이상이고 … 15억 이상일 때); Kaohsiung NTB attribution in the online-submission sentence.
- drafts/T4/ja.md: 「両方を超えて」→「両方に達して」.
- drafts/T4/en.md: 「1 times」→「a fine equal to the shortfall」.
- drafts/T4/zh-hant.md: no edit.
After the edits: lint.py OK for ko/ja/en/zh-hant; variety_metrics.py no FAIL for all four (run 2026-10-06).

## Image

images/T4.webp — a pale glass-and-steel atrium shaft seen from below, receding grid of mullions toward a skylight, warm stone floor. No faces, text, logos, flags or readable documents; fictional and unidentifiable; neutral and respectful; the layered grid suits a column about tiered documentation thresholds. Verdict: OK.
