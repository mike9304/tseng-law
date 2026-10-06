# T14 final accuracy review — closing-taiwan-subsidiary-branch-liquidation-tax-filings (ko, ja, en, zh-hant)

Reviewer: Claude Fable 5.1 (final gate). Date: 2026-10-06 (KST). Files reviewed: drafts/T14/ko.md, ja.md, en.md, zh-hant.md (+ facts.md, research/R8-statutes.md, R8-official.md Part 2, T14-extra.md, R2-official.md b)/fact 14 — all treated as untrusted and re-checked against the official pages below).

## Verdict

PASS — all four language versions are publishable now. No major issue found. Nine minor wording edits applied (listed below); lint OK and variety OK on every file after the edits. Image OK.

## Scope checked — official pages I opened myself (2026-10-06, saved under reviews/T14/sources/)

Statutes (law.moj.gov.tw, fetched with fetch_law.py → sources/statutes.md; header = each law's latest amendment date as shown on LawAll):
- 所得稅法 G0340003 — 修正日期 民國115年09月11日 (2026-09-11): §75 (¶1 45日 當期決算, ¶2 清算所得 30日 + 當年度稅率 + 但書, ¶3 清算期間=公司法期限, ¶5 未依限申報→依查得資料核定), §88 ¶1(1), §92 ¶2 (10日), §110 ¶1–2 (2倍/3倍)
- 所得稅法施行細則 G0340004 — 民國111年02月21日 (2022-02-21): §65
- 稅捐稽徵法 G0340001 — 民國110年12月17日 (2021-12-17): §6 ¶1, §13 ¶1–2
- 公司法 J0080001 — 民國114年12月26日 (2025-12-26): §87 ¶3, §90, §113 ¶2, §334, §372 ¶2, §378, §380, §381
- 加值型及非加值型營業稅法 G0340080 — 民國114年05月28日 (2025-05-28): §3 ¶3(2), §30 ¶1–2, §35 ¶1, §39 ¶1(3), §46, §49
- 加值型及非加值型營業稅法施行細則 G0340081 — 民國113年12月17日 (2024-12-17): §33 ¶1, §34 ¶1–2
- 稅籍登記規則 G0340087 — 民國111年08月08日 (2022-08-08): §10

Official pages:
- eTax Q&A 2608 (更新日期 107-08-09), 2609 (106-03-22), 2610 (114-04-22), 2612 (106-03-22) — https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/liquidation-procedure/{x6mOPan, oQ1r8Bv, rgEW7eB, 6ZPYAKW}. curl returns only the Angular shell (sources/etax-26xx.html); the answer text was obtained via WebFetch with verbatim-quote + APPEARS checks → sources/etax-qa-2608-2609-2610-2612.txt. All sentences the columns rely on APPEAR verbatim (核准文書發文日 / 次日起算 / 6個月期間屆滿之日為準起算 / 移送法務部行政執行署所屬各分署 / 已刪除延長申報期限之規定・不得申請延長申報期限 / 合併、分割或破產而解散者可免辦清算申報).
- MOF rulings on law-out.mof.gov.tw (系統版本 115.09.10, 更新 115.09.22) → sources/mof-GL004853.txt (台財稅第30533號, 民國65年01月27日, formula (1)–(3) and 股本不在課稅之列 verbatim), mof-GL005082.txt (台財稅第841627652號, 民國84年06月15日, 超過原出資額部分…依所得稅法第88條…扣繳規定 verbatim), mof-GL002917.txt (台財稅第7586738號, 民國76年03月09日, 尚無盈餘分配問題…分公司應毋庸扣繳稅款 verbatim)
- 財政部高雄國稅局 notice「營業人註銷登記應於規定期限辦理營業稅申報，避免受罰。」on mof.gov.tw (發布日期 2026-03-05) → sources/mof-kaohsiung-N2.txt. Verified: 「不論有無銷售額，仍須於註銷之日起15日內申報」; 甲商號 115-01-14 註銷; 115年1-2月(期) due 115年1月29日(含) 而非3月15日; 逾申報期限30日 → 怠報金 NT$3,000 under 營業稅法§49.
- 財政部 我國所得稅協定一覽表 https://www.mof.gov.tw/singlehtml/191?cntId=63930 (發布/更新日期 2026-09-04) → sources/mof-agreement-list.txt. Verified: Vietnam row in the comprehensive table (簽署 1998/04/06, 生效 1998/05/06); United States appears only in the 單項/海空運輸 table (1988/05/31).
- Internal links: the repo /Users/son7/Projects/tseng-law-tax-board-20261006/src/content/ holds 002-withdraw-capital-taiwan-company, 302-taiwan-dividend-withholding-foreign-parent-tax-agreement-rates and 323-taiwan-branch-tax-head-office-expense-allocation in columns/, columns-ja/, columns-en/, columns-zh/ (all 12 files exist; lint also confirms).

## 1. Law and facts — result per claim (all four languages)

Every deadline, amount, article number, ruling number/date, condition and amendment date in the four versions matches the official text:
- 45 days: §75 ¶1; start = day after the approval document's 發文日 (Q&A 2608), no extension (Q&A 2612) — ko/ja/en/zh and all FAQs consistent.
- 15 days: §30 ¶1 + 稅籍登記規則§10 (cancel registration), §30 ¶2 (after paying tax or giving security), 施行細則§33 ¶1 (current-period return + 統一發票明細表, pay first, attach receipt); Kaohsiung example dates and NT$3,000 correct; §34 ¶1–2 (invoices during liquidation, 15 days after the liquidation period ends); §3 ¶3(2) deemed sale; §39 ¶1(3) refund; §46 NT$1,500–15,000, 按次處罰.
- 30 days: §75 ¶2 + 施行細則§65 (current-year CIT rate, no rate number stated — correct per brief), 但書 + Q&A 2608 (合併、分割、破產); §75 ¶3 → 公司法§87 ¶3 (6 months, court extension), §334 (股份有限公司), §113 ¶2 (有限公司); Q&A 2609 6-month rule from the liquidator's 就任之日; §75 ¶5 + Q&A 2610; §110 ¶1–2 (2×/3×).
- Taxes first: 稅捐稽徵法§13 ¶1–2, §6 ¶1, 公司法§90 (1年以下有期徒刑等).
- Remaining assets: 1976 ruling (股本 part not taxed; 剩餘財產－應納清算所得稅額－股本, × 分派比例) and 1995 ruling (超過原出資額部分 → §88 dividend-withholding rules) stated accurately; §88 ¶1(1); §92 ¶2 (10 days, 扣繳憑單). No withholding rate stated for the liquidation excess — correct: neither ruling names one (R8 U7); each version says so and points to column 302. Brief's binding note honoured.
- US/Vietnam (en only): "no comprehensive US–Taiwan income tax agreement in force as of October 2026" and "Taiwan–Vietnam agreement on the same list" — supported by the MOF list (2026-09-04) and R2 b) (H.R.33/S.199 not enacted). Stated as a pointer only; no agreement terms given.
- Branch: §378 (廢止分公司登記, prior liabilities survive), §380 (liquidate Taiwan claims/debts; unpaid debts remain the foreign company's; default liquidator = 境內負責人 or 分公司經理人), §381 (assets may not leave Taiwan / no disposal except by the liquidator), §372 ¶2 (5年以下有期徒刑等), 1987 ruling (no profit-distribution issue, no withholding). 認許/撤回認許 not used anywhere. Branch liquidation period (R8 U6) and court/tax-clearance documents (R8 U5) are not described — only "confirm with the local NTB" — correct.
- Amendment dates in every sources section match the LawAll headers (2026-09-11 / 2022-02-21 / 2021-12-17 / 2025-12-26 / 2025-05-28 / 2024-12-17 / 2022-08-08); ruling dates and the notice date correct; check date 2026-10-06 present in all four.
- Korean/Japanese/US home-country tax: ko/ja/en each carry only a "check with a local adviser" sentence. zh has none (not needed).
- Arithmetic: 2026-01-14 + 15 days → 2026-01-29 inclusive (as the notice states) — correct in all versions.
- Cross-language consistency: no contradiction between the four versions on any rule or number (zh orders the three deadlines 15/45/30 in title and body; same content).

## 2. Citations

Inline links sit right after each claim; every statute link points to the right pcode/flno (30–31 unique URLs per file, all opened); agreement references are pointers only (ko 한-대만 조세약정, ja 日台民間租税取決め, zh 日、韓協定, en Taiwan–Vietnam agreement / MOF list link); sources sections list every source used with 2026-10-06; internal links (3 per language) exist in that language. OK.

## 3. Rules

No bold, no phone, no street address, email only (one soft paragraph before the sources), no bookkeeping/filing/audit offer (contact paragraphs ask for two dates only), author legal-ai-assistant, no lawyer/CPA/native-review claim, no invented hypothetical (the only example is the NTB's own 甲商號 case, attributed to the notice), frontmatter per brief (topic tax, tags ["tax-accounting"], seoTitle ≤32 ko/ja/zh, en seoTitle 44 chars because the title exceeds 60 with " | Hovering Law", en summary 150–160 and clean), no links to T12–T16, time markers "2026년 10월 현재 / 2026年10月時点 / as of October 2026 / 2026年10月的現行規定". OK.

## 4. Voice

ko: calm 합니다체 throughout, two reader questions, no translationese; ja: natural です・ます, no だ・である; en: plain, active; zh-hant: Taiwan usage (國稅局、營所稅、扣繳義務人、稅籍、收掉), no mainland vocabulary or simplified characters (lint). Titles specific (three deadline numbers), first paragraphs deliver information (opening type ⑥ in all four: §13 ¶1 / Q&A 2608 / Q&A 2609 (translated, labelled) / Kaohsiung notice). Subheads are column-specific, no checklist/imperative headings. OK.

## 5. Sentence variety

`variety_metrics.py check` after edits: ko cv 0.474 short 0.111 contrast 1 — OK; ja cv 0.451 short 0.09 contrast 1 — OK; en cv 0.52 short 0.134 contrast 1 — OK; zh-hant cv 0.495 short 0.091 contrast 0 — OK. Self-check items 2–7: no stock opener; ≥2 very short sentences in each; no paragraph-start word used 3×; no claim-(statute)-caveat run (caveat=0); at least one paragraph without a statute citation in each; contrast ≤1 and never rebutting an unmade claim (the one "not March 15" is the notice's own 而非3月15日); last paragraphs end on the two start dates. No MONOTONY finding.

## Issues (Original → problem & reason → fix → facts preserved)

All minor; none changes a fact, number, citation or legal meaning.

1. ko L41 「…에서 든 상호(商號)의 예가 구체적입니다. … 그 상호는 말소한 기에…」 → In Korean 상호 means a trade name, so "an example of a trade name" misreads the notice's 甲商號 (a non-corporate business) → applied: 「한 사업체(商號)의 예」, 「그 사업체는」 → dates, NT$3,000, 30-day lateness, notice link unchanged.
2. ko L43 「말소 때문에 생긴 초과납부 세액은 돌려받습니다」 → §39 ¶1(3) refunds the excess VAT standing when cancellation is applied for on dissolution; "caused by cancellation" was loose → applied: 「해산으로 말소를 신청할 때 남아 있는 초과납부 세액은 돌려받습니다」 → §39 citation unchanged.
3. ko L43 「…과태료가 나오고, 고치지 않으면 거듭 부과될 수 있습니다」 → §46 is 得處 (may fine) and 屆期仍未改正 (not corrected by the deadline) → applied: 「과태료가 나올 수 있고, 기한 안에 고치지 않으면 거듭 부과될 수 있습니다」 → amounts NT$1,500–15,000 unchanged ("수 있" now 3 per column, within the ≤4 guideline).
4. ko L49 「그러지 못하면 이유를 밝혀 법원에 연장을 신청하도록 정합니다」 → §87 ¶3 says 得…聲請展期 (may apply), not "must apply" → applied: 「신청할 수 있다고 정합니다」 → 6 months, §87/§334/§113 unchanged.
5. ja L41 「ある商号（商號）の例 … この商号の場合」 → same 商号 = trade-name reading as in Korean → applied: 「ある事業者（商號）の例」「この事業者の場合」 → facts unchanged.
6. ja L43 「抹消に伴って生じた納め過ぎの営業税は還付の対象です」 → as item 2 → applied: 「解散により抹消を申請する時点で残っている納め過ぎの営業税は還付の対象です」.
7. ja L43 「…過料があり、改めなければ繰り返し科されることがあります」 → as item 3 → applied: 「過料の対象になり、期限までに改めなければ繰り返し科されることがあります」.
8. en L39 「([Value-added and Non-value-added Business Tax Act, the Business Tax Act below, Article 30](…), paragraph 1; …)」 → the alias clause inside the link text read awkwardly → applied: 「([Article 30](…), paragraph 1, of the Value-added and Non-value-added Business Tax Act, the Business Tax Act below; …)」 → same URL and paragraph.
9. en L43 「excess VAT paid that arises on deregistration is refundable … Failing to apply for cancellation brings a fine … imposed again for each further failure to correct it」 → items 2 and 3 → applied: 「any excess VAT credit still standing when the company deregisters on dissolution is refundable … can bring a fine of NT$1,500 to NT$15,000, which can be imposed again if the omission is not corrected by the deadline set」.

zh-hant: no edit needed (可處 / 得按次處罰 / 因解散申請註銷登記的溢付稅額 already match the statutes).

Noted, not changed (acceptable): the 1976 ruling's exception for shareholders that are §42 domestic company-form enterprises is not discussed; the columns make no claim about it for a foreign parent, and the brief's binding note only requires the dividend treatment, which is stated. The "liquidation income tax rate" is correctly left as "that year's CIT rate" without a number.

## Minor edits applied (summary)

ko.md: 3 edits (lines 41, 43, 49). ja.md: 2 edits (lines 41, 43). en.md: 2 edits (lines 39, 43). zh-hant.md: none. After edits — lint OK (ko 2,841 chars; ja 3,198; en 1,421 words; zh-hant 2,198), variety OK on all four, no bold, no phone pattern, URLs unchanged (ko 30 / ja 30 / en 31 / zh 30 unique).

## Image

images/T14.webp: sunlit empty room, three taped cardboard boxes and a rolled rug against the wall, doorframe at left. Fits "closing an office"; fictional and unidentifiable — no faces, text, logos, flags or readable documents; respectful. Verdict: OK.
