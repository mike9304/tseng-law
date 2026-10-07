# T17 cross-review r1 — taiwan-stock-options-rsu-foreign-parent-employee-tax

Reviewer: Lane B (Claude Fable 5.1), final gate. Review date: 2026-10-07 (KST).
Files reviewed: drafts/T17/ko.md, ja.md, en.md, zh-hant.md, facts.md; topics/T17.md; research/R10-official.md (UNVERIFIED section), research/T17-extra.md; images/T17.webp.
Fetched sources saved under reviews/T17/cross-sources/ (statutes.md, ttc-*.json + ttc-rulings.txt, ttc-search-*.json, gazette-eg031213.pdf/.txt, mof-115-table.pdf/.txt, ntbt-foreign-professional-qa.pdf/.txt, lawout-FL050477.html/.txt, etax-1756/1746/alien-15r2N1n.html/.txt, moj-G0340003-history.html/.txt). Helper: reviews/T17/extract_rulings.py.

## Verdict

VERDICT: PASS — all four languages publishable now; image OK.

No major issue found. Every rate, threshold, deadline, amount, date, article number, ruling number, procedure and condition in the four drafts matches the official text I opened. Every item on the topic brief's UNVERIFIED list (RSU taxable event/valuation, 時價 for foreign-listed shares, non-resident treatment, equity under §22 salary relief, sale gain = overseas income) is stated only as "not found / may / confirm with the tax office", never as fact. Three minor wording edits applied (listed below); lint and variety metrics OK after them.

## Scope checked — official pages opened on 2026-10-07

Statutes (law.moj.gov.tw single-article pages via fetch_law.py; cross-sources/statutes.md):
- 所得稅法 G0340003 — header 修正日期 115-09-11 — §7, §8, §14, §71, §71-1, §88, §89, §92, §111. LawHistory (cross-sources/moj-G0340003-history.txt): the 115-09-11 amendment changed only §17 and §126 (in force 115-01-01); §88/§89/§92/§111 were amended 113-08-07 and put in force 114-01-01 by Executive Yuan order 113-08-27. The "部分條文尚未生效" flag concerns §43-4 (2016). So the §89 III and §111 II text used in the drafts is the in-force text as of October 2026.
- 所得基本稅額條例 G0340115 — 修正日期 110-01-27 — §12, §13.
- 外國專業人才延攬及僱用法 A0030295 — 修正日期 114-09-24 — §22.
- 外國特定專業人才減免所得稅辦法 G0340150 — 修正日期 115-03-02 — §4, §5.

MOF rulings (財政部各稅法令函釋檢索系統, 所得稅法 一一四年版, via POST /Api/PostData FunctionID=FB12001; cross-sources/ttc-rulings.txt):
- 144119 十34 財政部94/05/17台財稅字第09404527550號令 (points 一–四 read in full)
- 144123 十38 財政部95/07/12台財稅字第09504528030號令
- 144124 十39 財政部96/02/27台財稅字第09604503990號函 (主旨 + 說明四、五 + 編者註)
- 144127 十42 財政部96/06/15台財稅字第09600112810號函
- 144727 §32-17 財政部94/05/17台財稅字第09404528910號令 (points 一–三)
- 144131 十46 財政部101/07/11台財稅字第10100549471號令 (as amended 114/11/12)
- 143934 三86 財政部99/03/12台財稅字第09900025480號令 + 114/11/12台財稅字第11404634280號令 (zh-hant only)
Keyword searches (POST /Api/GetData FunctionID=FB10001, 所得稅法 一一四年版): 「RSU」0 hits; 「限制型股票」0; 「限制股」0; 「受限制」4 (only 144131 concerns employee shares); 「限制員工權利」4 (144131, 144725, 144726, 144731 — all Taiwan-law instruments or §32 expense rules); 「國外母公司」2 (144127 SAR; 144894 thin-cap, unrelated); 「外國公司」10 (144119, 144120, 144123, 144124 plus six unrelated). No ruling on RSUs granted by a foreign parent exists in the compilation. This independently confirms the drafts' central "no RSU ruling" statement.

Other official pages:
- 行政院公報 第031卷第213期, 財政部114/11/12台財稅字第11404634280號令 (cross-sources/gazette-eg031213.txt): amended list = 09404526180, 09800322220, 09804109680, 09900025480, 10000109820, 10000395530, 10100549471; repealed list = 直接稅處26年處第203號訓令, 34092, 09804567520, 10000030600, 10004037220, 10100593090, 10200086140, 10200644070, 10200219310, 10504598640, 10904524810, 10904029800, 11104615470, 11204603090. None of 09404527550 / 09504528030 / 09604503990 / 09600112810 / 09404528910 appears anywhere in the gazette (0 hits each).
- 財政部 非中華民國來源所得及香港澳門來源所得計入個人基本所得額申報及查核要點, law-out.mof.gov.tw FL050477 — 公發布日 98-09-22, 台財稅字第09804558720號 — points 二, 三, 十六, 十七 read.
- 財政部 115年度綜合所得稅及所得基本稅額相關免稅額、扣除額及課稅級距金額一覽表 (114年11月27日製表): brackets 5% 0–610,000 / 12% / 20% / 30% / 40% 5,190,001以上; 基本所得額免稅額度(個人) 750萬.
- 財政部稅務入口網 稅務問與答1756 (更新日期 110-10-08), 1746 (更新日期 115-04-10), 外僑稅務服務「一、外僑綜合所得稅與居留期間的關係」(更新日期 115-04-27).
- 臺北國稅局「外國特定專業人才租稅優惠措施」疑義解答 (header 115.4.14 修): A1, A17, A18, A20, A24 read.
- Internal link targets in the site repo (~/Projects/tseng-law-tax-board-20261006/src/content): 024-taiwan-income-tax-residency.md exists in columns, columns-ja, columns-en, columns-zh; 322-taiwan-payroll-foreign-employees-withholding-social-insurance.md exists in all four; 045-taiwan-overseas-income-us-stocks-crypto-amt.md exists in columns-zh only (and only zh-hant links it). All are pre-batch-4 columns.

## 1. Law and facts — claim-by-claim result (all four languages)

| Claim in drafts | Official text | Result |
|---|---|---|
| Options from a foreign parent: taxed in the exercise year; amount = 執行權利日時價 − 認股價格; 其他所得 §14 I 第10類; covers posted employees and employees of the Taiwan subsidiary/branch/office | 144119 pt 一 | ✓ ko, ja, en, zh |
| Window = 取得認股權日 → 得請求履約之始日; no Taiwan work in window → no Taiwan-source income; else spread × 居留天數/期間 | 144119 pt 一 | ✓ all; worked examples (3y/1.5y → half; 4-year cliff, move halfway → roughly half) are labelled invented and arithmetic is right |
| Sale price − exercise-date 時價 = 證券交易所得或損失 | 144119 pt 一 last sentence | ✓ all |
| Taiwan company: no withholding; by end-January report prior-year exercising employees' 姓名、住址、國民身分證統一編號、我國來源所得; issue 免扣繳憑單 | 144119 pt 二 + §89 III | ✓ all |
| 免扣繳憑單 to employees by Feb 10; 3+ consecutive national holidays in January → Feb 5 / Feb 15 | §89 III | ✓ all |
| Penalty NT$1,500–20,000 + deadline to correct; NT$3,000–90,000 if still not done; "as of October 2026" | §111 II (in force since 2025-01-01) | ✓ all |
| Grant-year carve-out (home-country valuation already taxed → may be relieved of exercise-year rule), "point 4" | 144119 pt 四 | ✓ all (see minor note A) |
| Foreign-currency price → BOT spot buy/sell closing average on exercise date, 2006-07-12 | 144123 | ✓ all |
| Branch employees under head-office purchase plan: 時價 − 認股價格 = 其他所得; no withholding on 交付股票日; §89 III return + 免扣繳憑單; 2007-02-27 | 144124 主旨, 說明四 | ✓ all |
| SARs from foreign parent: cash/equivalent shares on (執行日市價 − 執行價格); 其他所得 in year received; no withholding; return + 免扣繳憑單; 2007-06-15 | 144127 | ✓ all |
| Only restricted-share ruling = 公司法 §267 IX 限制員工權利新股 (Taiwan companies), 2012-07-11 | 144131 | ✓ all; zh cites §267第9項 exactly |
| Foreign-parent rulings not amended/repealed by 11404634280 and in 114年版 compilation | gazette + TaxVer 一一四年版 | ✓ all (en wording tightened, edit 1) |
| Seconded staff: pay = §8(3); Taiwan entity may compute option cost by Taiwan service days in grant→exercisable window and expense it; withhold under §88/§92 and file 扣繳憑單 at payment; 2005-05-17 | 144727 pt 二 | ✓ all |
| Own employees' option cost deductible as salary expense in exercise year (zh only) | 144727 pt 一 | ✓ zh |
| 員工紅利轉增資 shares = 薪資所得 at 交付股票日時價, §88 withholding (zh only) | 143934 | ✓ zh |
| Resident = 183 days in a tax year without domicile; file May 1–31 | §7 II(2), §71 I | ✓ all |
| 5%–40% for tax year 2026 (115年度) | MOF 115 table | ✓ all |
| Leaving mid-year after abolishing domicile/residence → file before departure; resident spouse staying files jointly | §71-1 II | ✓ all |
| Tax year = Jan 1–Dec 31 (ja only) | eTax alien page | ✓ ja |
| Overseas securities gains have no AMT exemption | 稅務問與答1756 | ✓ all; "sale gain may fall under overseas income" kept conditional per brief |
| Household overseas income < NT$1M not counted; ≥ NT$1M all counted | 所得基本稅額條例 §12 I(1) | ✓ all |
| Share gains counted in settlement-date (交割日) year | 查核要點 pt 三 | ✓ all |
| Basic tax = 20% × (basic income − 750萬 for 2026); foreign tax credit within cap with certified proof | §13 + MOF table | ✓ all |
| AMT payable only if basic tax > regular tax | 稅務問與答1746 | ✓ all |
| Cost not provable → 20% of sale price for securities (pt 16) | 查核要點 pt 十六(四) | ✓ all |
| §22 relief since 2026-01-01, moved from §20 unchanged; 5 years from first year with 183 days + salary > 300萬; half of salary over 300萬 excluded; overseas income out of AMT | A0030295 §22 + NTBT A1 | ✓ all |
| Relief measured on 薪資所得 (辦法 §4 III); whether parent equity counts is not stated | §4 III + R10 UNVERIFIED | ✓ all (stated as "not found") |
| Claim with annual or departure return; lost if not made before the filing period ends | 辦法 §5 I | ✓ ko, ja, en (zh omits §5 — no contradiction) |
| Non-resident rate/filing after departure | not in sources | ✓ all say "not found"; none states a rule |
| RSU/RS from a foreign parent: no ruling found; vesting vs delivery, value, proration all unconfirmed; 時價 of foreign-listed share undefined | my keyword searches + ruling texts | ✓ all; title/summary/FAQ consistent |
| Korean / Japanese / US tax | general pointer to local adviser only | ✓ ko, ja, en |

Cross-language consistency: no contradiction on law among the four versions. Extra material in ja (calendar tax year) and zh (紅利轉增資 contrast, M6 pt 一) is sourced and does not conflict.

Amendment/edition dates in the sources sections (所得稅法 2026-09-11; 所得基本稅額條例 2021-01-27; 外專法 2025-09-24 with §22 in force 2026-01-01; 辦法 2026-03-02; 查核要點 2009-09-22; MOF table 2025-11-27; Q&A 1756 2021-10-08; 1746 2026-04-10; alien page 2026-04-27; NTBT Q&A 2026-04-14) all match the page headers I opened.

## 2. Citations

- Inline links sit right after each claim; statute links point to the right pcode/flno (checked all 14 article URLs against the fetched text). Ruling links point to the ttc.mof.gov.tw record that carries the quoted text. Gazette link opens the 11404634280 order. law-out FL050477 opens the 查核要點.
- Sources sections are complete for each language (every inline source appears in the list) with the check date 2026-10-07 stated.
- Internal links: 2 per language, all existing in that language (lint OK; verified in the site repo as listed above). No batch-4 links. No board link used.

## 3. Rules

- No bold, no phone, no street address, email once in one soft paragraph, firm name per language, author legal-ai-assistant, no lawyer/CPA/native-review claim, no bookkeeping/filing/audit offer, hypotheticals marked after the scene ("(가상의 예입니다)", "（架空の例です）", "(an invented example)", "（虛構情境）"), frontmatter keys per brief, topic "tax", tags ["tax-accounting"], audience = file language, featured_image NNN path, FAQ 3 items consistent with the body. en seoTitle 40 chars (title + " | Hovering Law" > 60). Lint: OK for all four files before and after edits.
- Time-sensitive facts carry the year ("2026년도 / 2026年分 / tax year 2026 / 115年度", "as of October 2026").
- No tax agreement or judgment is cited; none needed.

## 4. Voice

- ko: calm 합니다체 throughout (상의하십시오 is the only 하십시오-form, acceptable); opening answers the reader's question in sentence two; subheads specific; no filler; Korean readers get Chinese terms glossed where needed (edit 3 adds the missing gloss for 免扣繳憑單).
- ja: natural です・ます; title in plain form is fine; glosses 財政部 and 免扣繳憑單; no 〜について解説します pattern; paragraph "子会社の社員か、親会社からの出向者か。" gives rhythm.
- en: plain, active, short sentences mixed ("RSUs are the gap.", "With nothing withheld, the employee pays."); title specific, not imperative or clickbait.
- zh-hant: Taiwan practice vocabulary (國稅局, 扣繳, 免扣繳憑單, 既得, 轄區, 罰鍰, 新臺幣); no mainland terms or simplified characters; no 本文將帶您了解 / 值得注意的是; short sentences ("自己聘僱的員工，不用。", "RSU就沒有這麼清楚。").
- Opening type ② (reader's question) as assigned in topics/T17.md; no stock hypothetical opener; last paragraph of each version ends on the column's own facts (exercise-date price record, 20% rule).

## 5. Sentence variety

variety_metrics.py check (before and after edits), all OK:
- ko: sentences=70 cv=0.478 short=0.129 run3=0.029 opener_rep=0.048 cite_end=0.114 contrast=0 caveat=0 q=2
- ja: sentences=75 cv=0.5 short=0.107 run3=0.137 opener_rep=0.148 cite_end=0.107 contrast=0 caveat=1 q=1
- en: sentences=75 cv=0.464 short=0.133 run3=0.068 opener_rep=0.12 cite_end=0.12 contrast=0 caveat=0 q=3
- zh-hant: sentences=50 cv=0.513 short=0.12 run3=0.021 opener_rep=0.0 cite_end=0.06 contrast=0 caveat=0 q=2
Self-check items 2–9 (SENTENCE-VARIETY-RULE §5): all met in all four files. No MONOTONY finding.

## 6. Image

images/T17.webp: an hourglass and a closed leather notebook on a stone window sill in soft daylight. No faces, text, logos, flags or readable documents; fictional and unidentifiable; respectful; fits the column's theme of taxable timing (exercise date, vesting date, January filing). Image verdict: OK.

## Issues (Original → problem & reason → fix → facts preserved)

Minor, applied:

1. en.md, "Are the older rulings still current?" paragraph — Original: "None of them is on the list of rulings the MOF amended or repealed on November 12, 2025 …, and all appear in the 2025 (114年版) edition" → Problem: the preceding paragraph discusses the 2012 restricted-share order (10100549471), which IS on the amended list in the gazette; "none of them" could be read to include it → Fix applied: "None of the foreign-parent rulings above is on the list … and all of them appear in the 2025 (114年版) edition" → Facts preserved: order number, date, compilation edition, links unchanged; the statement now matches the gazette exactly (ko/ja/zh already say 외국 본사 관련 / 外国親会社関連 / 外國公司相關).

2. en.md, ESPP paragraph — Original: "The ruling's subject line names branch employees only." → Problem: the 主旨 of 09604503990 also covers a domestic-company treasury-share transfer (stopped 2012), so "only" is literally imprecise; the intended point is branch vs subsidiary → Fix applied: "For the foreign plan, the ruling's subject line names Taiwan branch employees; it does not mention subsidiary staff." → Facts preserved: ruling number, date, 其他所得 treatment, no-withholding and §89 III duty unchanged.

3. ko.md, 주식매입계획 paragraph — Original: "지급 내역 신고와 免扣繳憑單 발급만 합니다" → Problem: first body use of an untranslated Taiwan form name for Korean readers (ja glosses it) → Fix applied: "지급 내역 신고와 免扣繳憑單(원천징수하지 않은 소득의 지급명세서) 발급만 합니다" → Facts preserved: no change to duty, deadline or citation.

Minor notes, not edited (optional for Lane A; no factual error):

A. The grant-year carve-out (144119 pt 四) literally says 「我國公司員工已於取得認股權年度…」, i.e. employees of the Taiwan company. All four drafts say "an employee / 직원 / 社員 / 員工" inside sections whose subject is the subsidiary's own staff, so the context carries the scope; if Lane A wants the exact scope it can add "of the Taiwan company / 대만 법인 소속 / 台湾の会社の / 在台公司的".

B. In the "still current" paragraph of all four versions, the gazette link supports "not amended or repealed"; "appear in the 114年版 compilation" is supported by the ttc.mof.gov.tw records themselves (TaxVer 一一四年版, linked elsewhere in the body). Acceptable as is.

## Verification after edits

- `python3 lint.py drafts/T17/en.md en taiwan-stock-options-rsu-foreign-parent-employee-tax` → OK [length 1583 words]
- `python3 lint.py drafts/T17/ko.md ko taiwan-stock-options-rsu-foreign-parent-employee-tax` → OK [length 3478 chars]
- ja.md and zh-hant.md unchanged: lint OK [4236 chars] / OK [2572 chars]; variety OK.
- variety_metrics.py check en/ko after edits → OK (values above).

VERDICT: PASS
