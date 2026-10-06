# T5 final review — taiwan-cpa-audit-tax-certification-bookkeeping (ko, ja, en, zh-hant)

Reviewer: Claude Fable 5.1 (final gate). Review date: 2026-10-06 (KST). Files reviewed: drafts/T5/ko.md, ja.md, en.md, zh-hant.md, facts.md; research/R1-statutes.md, R1-official.md (D, E, O16, O21), T5-extra.md; topics/T5.md; brief-BATCH.md; brief-EDITORIAL-VOICE.md; shared/SENTENCE-VARIETY-RULE.md; shared/LESSONS.md (skimmed); LINKS.md; images/T5.webp.

## Verdict

PASS — all four languages are publishable as they now stand (after the minor wording edits listed below), image OK. No major issue found: every rate, threshold, date, article number, condition and procedure in the four drafts matches the official text I opened myself; the four versions agree with each other on the law; foreign-law remarks are general cautions only; the UNVERIFIED branch/NT$30m point is left open in all four versions exactly as the topic brief requires.

## Scope checked — official pages opened on 2026-10-06 (copies under reviews/T5/sources/)

Statutes (law.moj.gov.tw, LawAll header for the amendment date + LawSingle for each article; fetched with fetch_law.py → `sources/statutes.md`):
- 公司法 (pcode J0080001) — 修正日期 民國 114 年 12 月 26 日 (2025-12-26): §20, §110, §228, §229, §230, §372, §377
- 商業會計法 (pcode J0080009) — 修正日期 民國 103 年 06 月 18 日 (2014-06-18): §2, §6, §7, §8, §38, §65, §66, §68
- 所得稅法 (pcode G0340003) — 修正日期 民國 115 年 09 月 11 日 (2026-09-11): §23, §39, §41, §101, §102
- 所得稅法施行細則 (pcode G0340004) — 修正日期 民國 111 年 02 月 21 日 (2022-02-21): §49
- 營利事業委託會計師查核簽證申報所得稅辦法 (pcode G0340009) — 修正日期 民國 94 年 12 月 30 日 (2005-12-30): §3, §4

MOEA notice:
- 經濟部 107.11.08 經商字第10702425340號公告「公司法第二十條第二項之公司資本額一定數額及一定規模」 — https://gcis.nat.gov.tw/elaw/lawDtlAction.do?method=viewLaw&pk=247 (page is a JS shell; text via POST https://gcis.nat.gov.tw/elawAp/api/getElawViewLaw?pk=247: lawNo 經商字第10702425340號, pmgDate 2018-11-08, abolish 0, items 一–五) → `sources/moea-notice-pk247.html`, `sources/gcis-api-pk247.json`, `sources/gcis-api-pk247.txt`
- GCIS English version, pk=237 "Company with a certain amount of capital and a certain scale" (Promulgated on November 8, 2018) → `sources/gcis-api-pk237.json`, `.txt`

MOF:
- 財政部臺北國稅局 新聞稿「會計師代理114年度營利事業所得稅結算申報查核簽證報告書應於115年6月30日前送交國稅局」, 發布日期 2026-06-08 — https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=6bbbee3b8c4346aa8a4517edfe7d276b → `sources/mof-ntbt-20260608.html`, `.txt`

Official English titles (law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=…): J0080001 "Company Act" (Amended Date 2025-12-26); J0080009 "Business Entity Accounting Act" (2014-06-18); G0340003 "Income Tax Act" (2026-09-11); G0340004 "Enforcement Rules of the Income Tax Act" (2022-02-21); G0340009 ENG page returned 0 bytes (no official English title; en draft uses the Chinese title with a gloss, which is correct) → `sources/eng-*.html`, `sources/eng-titles.txt`

Internal links: /{lang}/columns/taiwan-company-subsidiary-vs-branch and /{lang}/columns/taiwan-company-establishment-advanced-2 exist in all four languages in ~/Projects/tseng-law-tax-board-20261006/src/content/columns{,-en,-ja,-zh}/ (004-…, 005-…); link texts match LINKS.md titles. No link to another batch column; no board link.

Tools: `python3 lint.py <file> <lang> taiwan-cpa-audit-tax-certification-bookkeeping` → OK for ko (3,145 chars), ja (3,664), en (1,486 words), zh-hant (2,162), run after the edits. `python3 shared/variety/variety_metrics.py check <file> --lang <lang>` → ko OK (cv 0.499, short 9.4%, contrast 0, q 3); ja no FAIL (cv 0.55, short 12.7%, contrast 0; only a WARN "76% end in desu-masu", which is the register itself and not a FAIL under rule §3/§6); en OK (cv 0.543, short 22.9%, contrast 0, q 2); zh-hant OK (cv 0.551, short 8.5%, contrast 0, q 2).

## 1. Law and facts — result per claim (all four languages)

- 公司法 §20 II (capital ≥ set amount, or below it but at set scale → CPA audit first; figures by the central competent authority; public companies with securities-regulator rules excluded) — stated correctly in all four.
- MOEA notice: dated 2018-11-08, effective 2019-01-01; item 一 paid-in capital ≥ NT$30m at the end of the financial reporting period → audit before 提請股東同意或股東常會承認; item 二 below NT$30m AND (net operating revenue reaches NT$100m OR Labor-Insurance-enrolled employees reach 100); item 三 from FY2019 (108會計年度) for the scale test; item 五 public companies. All four drafts state the AND/OR structure, "reaches" (達), the reporting-period-end date, the FY2019 start of the scale test and the public-company exception correctly, in body, summary and FAQ.
- §20 IV–V penalties NT$10,000–50,000 (各處, each responsible person) / NT$20,000–100,000 — correct in all four. The verbs 規避、妨礙或拒絕 were abbreviated in ko/ja/en (see minor edits).
- 商業會計法 §65 (2 months, +2.5 months), §66 (business report + financial statements; signed/sealed by the responsible person representing the business, managers, chief accountant), §68 I (6 months, to 出資人/合夥人/股東) — correct in all four.
- 公司法 §228 (board; 30 days before the AGM to supervisors), §229 (10 days before, at the company), §230 I (AGM approval, then distribution of the financial statements and the distribution/loss-coverage resolution) — correct; the chapter placement (股份有限公司 §228–230; 有限公司 §110) matches the LawAll headings.
- §110 I–II (directors prepare per §228, send to each shareholder, majority of voting rights; latest 6 months after year-end; deemed approved if no objection one month after sending) — correct. "End of June for a calendar-year company" is plain arithmetic.
- 所得稅法 §102 II and 辦法 §3 — the five groups and both revenue figures (NT$50m for approved tax-exempt businesses; NT$100m 營業收入淨額與非營業收入 for all others), plus "CPA approved and registered by the MOF as a tax agent" — correct in all four (en table matches §3 item by item).
- Comparison "same NT$100m, different measure" (notice = 營業收入淨額 only; 辦法 = 營業收入淨額 + 非營業收入; no capital/headcount test in 辦法 §3) — correct derivation from the two texts.
- Hypotheticals: ko/ja/zh (capital NT$10m, net operating revenue NT$120m → audit via notice 二(一); certified return via 辦法 §3(5)) and en (capital NT$5m, 120 insured engineers → audit via notice 二(二)) — arithmetic and derivation correct; each labelled as invented inside/after the scene.
- 臺北國稅局 2026-06-08: TY2025 (114年度) calendar-year filing deadline 2026-06-01 (31 May holiday); CPA report by 2026-06-30 (paper) or 2026-06-29 (upload) for online filers; late upload → 視同普通申報, no §39 盈虧互抵, no higher 交際費 ceiling — correct in all four, with the tax year stated.
- §39 I (preceding ten years' losses, company-form, blue return or CPA certification, filed on time) — the "ten-year loss carryforward" gloss is correct in all four.
- 辦法 §4 (first-time mandatory filer, accounting below standard → CPA with the business, before the filing deadline, approval to start from the next fiscal year) — correct in all four.
- 商業會計法 §2 I, §7 (國幣; foreign-currency books converted in the closing statements), §8 (我國文字 + Arabic numerals; foreign language added/alongside; Chinese prevails), §6 (1 Jan–31 Dec; exceptions), §38 (vouchers ≥ 5 years, books/FS ≥ 10 years after the annual closing) — correct in all four.
- 所得稅法 §23 (calendar year; change only for 原有習慣或營業季節之特殊情形 with the tax office's approval) — ja/en/zh carried the condition; ko did not (fixed, see below). §101 (ja only) correct.
- 公司法 §377 I (§20 I–IV applied to a foreign company's Taiwan branch) and II (NT$10,000–50,000 / NT$20,000–100,000 on the responsible person in Taiwan) — correct in all four. §372 I (dedicated operating funds, designated responsible person) — correct. 所得稅法 §41 and 施行細則 §49 II — correct.
- Branch and the NT$30m test: all four say the notice is written in terms of 實收資本額, does not mention branches, and the point must be confirmed with MOEA or a CPA. Nothing is asserted either way (matches R1-official UNVERIFIED #3 and the topic brief).
- Amendment dates in the sources sections (2025-12-26; 2014-06-18; 2026-09-11; 2022-02-21; 2005-12-30) — match the LawAll headers.
- Foreign law: ko (한국 회계사·세무사와 확인), ja (日本の会計士や税理士に確認), en (parent's own accountants; "a US tax adviser can confirm"), zh (宜請母國會計師確認) — general cautions only; no foreign tax treatment stated. ja's "決算期のずれは3か月" is arithmetic, not Japanese law.
- Cross-language consistency: no contradiction on any figure, date, article or condition.

Noted, no change (not errors):
- "主管機關" in §20 IV is rendered as 경제부/経済部/the ministry/經濟部. The central competent authority under 公司法 is MOEA, and the notice itself is MOEA's; a municipal government may act by delegation, but the simplification does not mislead a foreign reader.
- 商業會計法 §38: the drafts put "permanent-retention items or unsettled matters" outside both periods; the statute names both exceptions for vouchers and only "unsettled matters" for books/statements. Since ten years is a floor, saying permanent-retention items fall outside it cannot mislead; left as written in all four.

## 2. Citations

- Every statute claim has an inline link to the correct law.moj.gov.tw single-article URL (pcode/flno checked against the fetched texts). The MOEA notice links to the GCIS record pk=247; the MOF release links to the exact cntId page. All inline sources appear in the sources section of each language with the check date 2026-10-06 (확인일 / 確認日 / Checked / 確認日期). No judgment cited. Internal links exist in that language (lint OK).

## 3. Rules

- No bold, no phone, no street address, email-only contact once near the end; firm named correctly in each language; no bookkeeping/filing/audit service offered (each version ends by saying the audit is a CPA's job and certification needs an MOF-registered CPA tax agent). author: legal-ai-assistant; no lawyer/CPA/native-review claim. Hypotheticals labelled. Frontmatter: topic "tax", tags ["tax-accounting"], audience = file language, categories per language, featured_image NNN path, FAQ 3 items consistent with the body; en seoTitle 44 chars (title + " | Hovering Law" > 60), en summary 160 chars without forbidden characters. Time-sensitive facts carry the notice date / FY2019 / TY2025 / amendment dates.

## 4. Voice

- ko: natural 합니다체 throughout, no 해라체; opening gives the number and the rule at once; headings are specific to this column; two reader questions in the body; no AI filler or checklist headings; ends on the column's facts.
- ja: です・ます throughout (body), one 体言止め ("決算期のずれは3か月。"); 日本語 terms (払込資本金, 過料, 株主総会) with Taiwan terms in parentheses; "株式会社にあたる形態" gloss for 股份有限公司 is helpful; no 「〜について解説します」 patterns; ends on the column's facts.
- en: plain and active; short sentences mixed in ("Capital comes first.", "Revenue is modest.", "Branches are covered too."); one small comparison table for the 辦法 §3 list is appropriate; no "delve/navigate/it is important to note".
- zh-hant: Taiwan usage (國稅局, 財政部, 會計師, 營所稅, 勞保, 稽徵機關, 曆年制); no mainland vocabulary or simplified characters (lint); conversational Taiwan phrasing ("資本額不到這條線呢？還要看規模。", "曆年制公司，就是隔年6月底。"); no 官腔 stacking.
- Opening type ④ (one number) is used by all four versions and is unique in the batch (T1 ①, T2 ②, T3 ⑤, T4 ⑥, T6 ③).

## 5. Sentence variety (SENTENCE-VARIETY-RULE §5 self-check, items 2–7)

All four files: tool FAIL 0; no stock hypothetical opener; ≥ 2 very short sentences (ko 6, ja 9, en 16, zh 4); no three paragraphs starting with the same word; no three consecutive claim-(statute)-caveat paragraphs (caveat count 0) and paragraphs without citations present (cite_para 0.69–0.73); contrast templates 0; last body paragraph ends on this column's facts with no copied disclaimer or sales line. No MONOTONY finding.

## 6. Issues and fixes (Original → problem & reason → fix → facts preserved)

1. ko body, 「장부는 대만달러와 중국어로」, §23 sentence — Original: "세법에서도 역년이 원칙이며, 다른 기간을 쓰려면 관할 세무기관의 승인을 받아야 합니다(소득세법 제23조)." → Problem: §23 allows a change only "因原有習慣或營業季節之特殊情形" with the tax office's approval; the ko sentence dropped the statutory ground, so a reader could think approval is available on request (ja/en/zh carried the condition). Minor (omitted condition, no wrong figure). → Fix applied: "세법에서도 역년이 원칙이고, 기간을 바꾸는 것은 원래의 관행이나 영업의 계절성이라는 특별한 사정으로 관할 세무기관의 승인을 받은 경우에 한합니다(소득세법 제23조)." → Preserved: calendar-year default, approval by the competent tax office, link to §23.
2. ko body, penalties (company and branch sections) — Original: "경제부의 서류 검사를 거부하거나 기한 안에 제출하지 않았다면 …" / "검사를 거부하거나 기한 안에 제출하지 않은 경우는 …" → Problem: §20 V / §377 II penalise 規避、妨礙或拒絕 (evade, obstruct or refuse); "거부" alone is narrower than the statute. Minor. → Fix applied: "회피·방해·거부하거나" in both places. → Preserved: NT$20,000–100,000, "기한 안에 제출하지 않은" limb, article references.
3. ja body, same two penalty sentences — Original: "経済部の検査を拒んだり期限までに書類を出さなかったりした場合は" / "検査を拒んだ場合や期限までに提出しなかった場合は" → Problem: same narrowing as item 2. → Fix applied: "経済部の検査を避けたり妨げたり拒んだりした場合や、期限までに書類を出さなかった場合は" / "検査を避けたり妨げたり拒んだりした場合や、期限までに提出しなかった場合は". → Preserved: 2万～10万台湾元, deadline limb, article references.
4. en body, same two penalty sentences — Original: "Evading or refusing a ministry inspection, or missing a filing deadline the ministry sets, costs …" / "For evading an inspection or missing a filing deadline, the range is …" → Problem: as item 2. → Fix applied: "Evading, obstructing or refusing a ministry inspection, …" / "For evading, obstructing or refusing an inspection, or missing a filing deadline, the range is …". → Preserved: NT$20,000 to NT$100,000, paragraph references.
5. en frontmatter summary — Original: "… CPA-audited accounts at NT$30 million paid-in capital, or below that at NT$100 million revenue …" → Problem: "at NT$30 million" can be read as exactly NT$30 million; the notice says 三千萬元以上. Minor wording; length must stay 150–160. → Fix applied: "… from NT$30 million paid-in capital, or below it at NT$100 million revenue …" (160 characters). → Preserved: NT$30m, NT$100m, 100 insured staff, separate tax test.
6. en body, end of 「From year-end close to approval」 — Original: "Where an audit is required, it comes before any of these approval steps." → Problem: the notice places the audit before 提請股東同意或股東常會承認; the supervisor review and the 10-day inspection are not approval steps, so "any of these approval steps" is loosely worded. Minor. → Fix applied: "Where an audit is required, it comes before the shareholders' approval in either form." → Preserved: audit-before-approval sequence for both company forms.
7. ja body, 商業會計法 §66 sentence — Original: "代表する責任者、経理人、主辦会計人員が署名または押印します" → Problem: "主辦会計人員" mixes a traditional-only character (辦) with a Japanese form (会); the draft otherwise quotes Taiwan terms in their original characters. Naturalness/orthography only. → Fix applied: "代表する責任者、経理人、主辦會計人員（会計の主担当者）が署名または押印します". → Preserved: the three signatories, §66 link.

Checked and left unchanged: ja uses 稽徴機関 (shinjitai), which is the form used in the published ja columns; ja WARN on です・ます share is the register, not a FAIL; en "Evading … costs" paragraph otherwise correct; the §38 and "主管機關" points above.

## 7. Minor edits applied (files changed: ko.md, ja.md, en.md; zh-hant.md unchanged)

- ko.md: §23 sentence rewritten with the statutory condition (item 1); "거부하거나" → "회피·방해·거부하거나" twice (item 2).
- ja.md: penalty verbs completed twice (item 3); "主辦会計人員" → "主辦會計人員（会計の主担当者）" (item 7).
- en.md: summary "at NT$30 million … below that" → "from NT$30 million … below it" (item 5); penalty verbs completed twice (item 4); "before any of these approval steps" → "before the shareholders' approval in either form" (item 6).
- After the edits: lint OK ×4 (ko 3,145 chars; ja 3,664; en 1,486 words; zh-hant 2,162); variety tool FAIL 0 ×4.

## 8. Image

images/T5.webp — OK. Plain archive boxes on wooden shelves beside a table, soft daylight; no faces, text, logos, flags or readable documents; fits the bookkeeping / record-retention theme; respectful and fictional.

VERDICT: PASS
