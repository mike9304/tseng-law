# T25 cross-review r1 — taiwan-cross-border-e-services-income-tax-foreign-platforms (ko, ja, en, zh-hant)

Reviewer: Lane A cross-reviewer (Claude Fable 5.1), 2026-10-07. Task: reviews/T25/p-cross-review-r1.txt. Files reviewed: drafts/T25/{ko,ja,en,zh-hant}.md, drafts/T25/facts.md (not trusted), research/R14-T25-{official,curl,statutes}.md (not trusted), images/T25.webp.

## Verdict

PASS — all four language versions are publishable now; image OK. No major law/fact/citation/rule issue found. Two minor edits applied (formatting in en, one wording in ja); lint OK and variety OK on all four files after the edits.

## Scope checked — official pages I opened myself (all on 2026-10-07, saved under reviews/T25/cross-sources/)

Statutes (fetch_law.py → cross-sources/statutes.md, with each law's header date):
- 所得稅法 (G0340003), 修正日期 民國 115 年 09 月 11 日 — §8, §73, §88, §89, §92, §110 (single-article URLs as cited in the drafts)
- 所得稅法施行細則 (G0340004), 111-02-21 — §60
- 各類所得扣繳率標準 (G0340028), 110-06-30 — §3
- 適用所得稅協定查核準則 (G0340125), 114-04-08 — §23, §34
- 加值型及非加值型營業稅法 (G0340080), 114-05-28 — §36 (only because the zh-hant FAQ question names it)

MOF / eTax / DOT pages (curl → .html + extracted .txt):
- 外國營利事業跨境銷售電子勞務課徵所得稅作業要點, law-out.mof.gov.tw LawContent.aspx?id=GL010432 — header 公發布日 107-05-11, 修正日期 112-10-13, 台財稅字第11204568352號令; full text points 1–11 (mof-GL010432-yaodian.txt)
- Its 法規沿革, LawContentSource.aspx?id=GL010432 — 107-05-11 訂定全文11點; 110-12-16 修正第2、5、6點; 112-10-13 修正第10點 (mof-GL010432-source.txt)
- 財政部107年1月2日台財稅字第10604704390號令, LawContent.aspx?id=GL010379 — 「自106年度起…境內買受人(包括個人、營利事業或機關團體)」 (mof-GL010379-ruling.txt)
- eTax 跨境電子勞務交易課徵所得稅Q&A PDF (attachments/xQM9AD9, 29 pp.) → pdftotext (etax-QA-xQM9AD9.txt): 貳Q3, 參Q2–Q4, 肆Q2, 伍Q1–Q3, 陸Q1, 柒Q1, 柒Q4, 捌Q1–Q2 read
- eTax FAQ listing page (…/taxation-system-intro/faq) — 更新日期 114-12-29; links attachments xQM9AD9 and KLOkB9K (etax-faq-page.txt)
- eTax form page (…/related-form-download/LrJ75gZ) — 更新日期 112-05-30; 「外國營利事業跨境銷售電子勞務申請適用租稅協定營業利潤免稅申請書」 (etax-form-LrJ75gZ.txt)
- 財政部賦稅署 release, dot.gov.tw/singlehtml/ch26?cntId=0bac339b… — 發布日期 110-12-16, 「財政部本(16)日修正…增訂扣繳義務人…可提示其實際負擔…應扣繳稅款之相關證明文件者，得…申請核定…淨利率及境內利潤貢獻程度」 (dot-20211216.txt)
- 財政部國際財政司 release, mof.gov.tw/singlehtml/384fb30…?cntId=127fffb3… — 發布日期 2023-12-28, 「該協定於112年12月27日起生效，自113年1月1日起適用」, 「我國或韓國企業於對方國從事營業未構成「常設機構」，其「營業利潤」免稅」 (mof-korea-20231228.txt)
- 財政部 我國所得稅協定一覽表, mof.gov.tw/singlehtml/191?cntId=63930 — 發布/更新日期 2026-09-04; 日本 2015/11/26 → 2016/06/13; 越南 1998/04/06 → 1998/05/06; 韓國(原協定) 2021/11/17 → 2023/12/27 (plus a 2026/08/04 amending agreement that only renames the Korean ministry, per the page's footnote); 美國 appears only in the 海空運輸 table (1988/05/31), not in the comprehensive table (mof-agreement-list.txt)
- Japan arrangement text, law.moj.gov.tw LawAll.aspx?pcode=Y0040274 — 簽訂 104-11-26, 生效 105-06-13; Art 5(3)(2) 183 days; Art 7(1) (moj-Y0040274-japan.txt)
- Vietnam agreement text, LawAll.aspx?pcode=Y0040008 — 簽訂 87-04-06, 生效 87-05-06; Art 7(1) uses 固定營業場所 (moj-Y0040008-vietnam.txt)
- H.R. 33 (119th): congress.gov HTML blocked curl (JavaScript challenge page saved as congress-hr33.html/.txt); api.congress.gov record fetched instead (congress-hr33-api.json): latestAction 2025-01-16 「Received in the Senate and Read twice and referred to the Committee on Finance.」 Nothing in the four drafts states H.R. 33, so this only confirms the "no US agreement" line.

Tools: `python3 lint.py <file> <lang> taiwan-cross-border-e-services-income-tax-foreign-platforms` → OK ×4 (ko 3,212 chars, ja 3,974 chars, en 1,590 words, zh-hant 2,238 chars). `python3 shared/variety/variety_metrics.py check <file> --lang <lang>` → no FAIL on any file (ko/ja show only the register WARN about 니다/です・ます endings, which is expected for 합니다체/です・ます体).

## 1. Law and facts — verified claim by claim (all four languages)

Every item below was checked against the pages listed above, not against facts.md or the R14 files. No discrepancy found; the language versions agree with each other on every number, date, condition and article.

- Scope and start: tax year 2017 (106年度) onward; buyers = individuals, businesses, institutions — ruling GL010379 opening sentence. [ko, ja, en, zh]
- 作業要點 issued 2018-05-11, last amended 2023-10-13; sources sections also give 2021-12-16 — 法規沿革. [all]
- Taiwan-source test (point 3): real-time/interactive/convenient/continuous services (online games, drama, music, video, ads) = Taiwan-source; products finished abroad and only downloaded (standalone software, e-books) = not, unless Taiwan persons must take part; platform fees Taiwan-source when either party is in Taiwan; online IP licensing = royalty under 所得稅法 §8(6) — point 3(一)1, 3(一)2(1)①②, 3(二); §8 item 6. [all, body and FAQ]
- E-book example (business tax yes, income tax no) — Q&A 貳Q3 A3 二(一). [ko, ja, en]
- Net profit rate ladder (actual costs / industry standard rate with 30% for platform services / 30% set by office / higher actual rate prevails) — point 4(一)1–4. [all]
- Contribution ratio (actual with TP/work-plan evidence / 100% when whole flow or both supply and use in Taiwan / otherwise 50% or higher if found) — point 4(二)1–3; the "online ads for a Taiwan company, set to play in Taiwan" 100% example — Q&A 參Q3 A3 一. [all]
- Rate 20% as of October 2026 — 扣繳率標準 §3 (item 10 text 「按給付額扣取百分之二十」; no item number named in the drafts, as required); "3% of revenue" is labelled arithmetic (20%×30%×50%) in all four and limited to the 30%/50% case; gross 20% without approval — point 6(一)1 and Q&A 柒Q1. [all]
- Collection split (point 6(一)): §88 scope → payer withholds 20% at payment, or 20% of income computed with approved rate and ratio; pay and file within 10 days from withholding, +5 days if 3+ consecutive national holidays fall in the window — 所得稅法 §92 para 2. Outside §88 scope (Taiwan individuals etc.) → foreign enterprise files itself or through an agent on eTax, 1–31 May of the following year — point 6(一)2, §73(1), 施行細則 §60. Rest-day rule — Q&A 伍Q3. [all]
- Tax agent = Taiwan-resident individual or business with a fixed place of business, approved by the tax office — 施行細則 §60 para 2; Q&A 陸Q1. [all]
- Qualification registration before self-filing: certificate authenticated by a Taiwan mission / recognized body / local court / notary, Chinese translation if foreign-language; reuse of business-tax account; changes within 15 days; NT$ payment and remittance fees — point 9(一)2(1), 9(二), 9(三), 11(一). [ko, ja, en; zh omits the 15-day and NT$ items — omission, not error]
- Penalties: filed but under-reported ≤2×; no return and found by the office ≤3× on top of the tax — 所得稅法 §110 paras 1–2 (verified from the statute, not only the Q&A). [all]
- Platforms: taxed on the full sales price; deduction of pass-throughs needs contracts/vouchers/details and, where the pass-through is a foreign developer's Taiwan-source income, proof that Taiwan tax was paid; pass-through withholding paid by the 10th of the following month — point 6(二), 8(一). [ko, ja, en]
- Taiwan seller does not withhold on a foreign platform's fee when the platform collects the price — Q&A 柒Q1 三. [zh]
- Approval route: self → 中央政府所在地國稅局 = 財政部臺北國稅局 (Q&A 參Q4 受理機關 三); via agent → agent's local 國稅局; withholding agent that bears the tax → its own local 國稅局, since 2021-12-16 — point 2(四), 5(二); DOT release 110-12-16. Advance or with the return; documents — Q&A 參Q4, point 5(一)2(1). No validity period stated anywhere in the drafts. [all]
- Refund of over-withheld tax: from 106年度, within 10 years from receipt of the income; 10 years from the 2023-10-13 amendment; claims already outside the old 5-year window stay under the old rule — point 10(一)(二). [all]
- Agreement relief needs an application: residence certificate from the home tax authority, proof of no Taiwan PE (or no business through one), income documents, to the tax office where the payer is located; on approval the office tells the withholding agent not to withhold; claim may be made with the return — 查核準則 §23 paras 1–2. Already-withheld tax reclaimable within 10 years from payment; tax older than 5 years on 2025-04-08 stays under the old rule — §34 paras 1–3 (ko omits the transitional sentence; harmless because Korea relief only runs from 2024-01-01). E-services form on eTax, updated 2023-05-30 — form page. [all]
- Japan: 日台民間租税取決め in force 2016-06-13; Art 7(1) PE rule; Art 5(3)(2) service PE >183 days in any 12-month period (ja simplifies 「相關課稅年度開始或結束任何十二個月期間內」 to 「いずれかの12か月の間に」 — acceptable, not a misstatement; the linked semiconductor column covers the counting). [ja, zh]
- Vietnam: in force 1998-05-06; Art 7(1) with 固定營業場所 wording. [en, zh]
- Korea: in force 2023-12-27, applies from 2024-01-01; no-PE business-profits exemption stated only as the MOF release puts it; no article numbers. [ko, zh]
- US: no comprehensive income tax agreement on the MOF list updated 2026-09-04; only the 1988 shipping/air agreement. [en body and FAQ, zh]
- Home-country credit (KR/JP/US/VN): general "check with a local adviser" only. [ko, ja, en]
- Arithmetic: en invented example NT$1,000,000 → NT$200,000 withheld / NT$800,000 paid (20% gross, no approval, no agreement for a US seller) — correct and labelled "(an invented example)". Final-paragraph "2026 income → return 1–31 May 2027" — correct (次年五月).
- UNVERIFIED items from topics/T25.md: none appear as fact (no official "effective rate", no MOF worked example, no approval validity period, no 扣繳率標準 item number, no convenience-store limit, no 5-year window as current law, no Korea article numbers, no industry rates, no foreign-law outcomes).

## 2. Citations

- Inline links sit right after the claims; every statute link is the law.moj.gov.tw single-article URL for the article actually quoted (§8, §73, §88, §89 [zh], §92, §110; 施行細則 §60; 扣繳率標準 §3; 查核準則 §23, §34). Agreement links point to the official texts on law.moj.gov.tw (Y0040274 Japan, Y0040008 Vietnam; LawAll pages, since LawSingle is unavailable for these pcodes). MOF/eTax/DOT links resolve to the pages described.
- Sources sections: every source used in each body is listed, with the law's latest amendment date and the check date 2026-10-07 (ko 확인일, ja 確認日, en Checked, zh 確認日期).
- Internal links exist in LINKS.md for the right language: ko ×2, ja ×3, en ×3, zh ×2 (taiwan-vat-foreign-digital-services-registration; taiwan-withholding-tax-payments-to-foreign-companies; ja japan-taiwan-tax-agreement-semiconductor-expatriates; en vietnamese-companies-taiwan-vietnam-tax-agreement). Link texts match the LINKS.md titles. No batch-4 column linked; board not linked.

## 3. Rules

No bold; no phone/LINE/Kakao; no street address; one soft email-only contact paragraph per file naming the firm correctly; no bookkeeping/filing/audit offer; `author: "legal-ai-assistant"`; no lawyer/CPA/native-review claim; the only hypothetical (en, Austin ad-tech firm) is labelled "(an invented example)"; frontmatter matches the brief (topic tax, tags ["tax-accounting"], audience per file, featured_image NNN path, FAQ 3 items each; en title + " | Hovering Law" > 60 so seoTitle present at 39 chars; en summary 150–160 chars with no forbidden characters; ko/ja/zh seoTitle ≤ 32 and different from title). Lint OK ×4.

## 4. Voice

- ko: 합니다체 throughout; opening is a one-line common misunderstanding (type ⑤ as assigned), second sentence is the fact; subheads are specific; no AI filler, no checklist headings. Natural for a Korean finance/legal reader.
- ja: です・ます throughout (one plain-form sentence 「台湾の法人所得税は関係ない。」 voices the misconception; it is a single sentence, allowed); 日台民間租税取決め used correctly; the two-column table is a real comparison; natural.
- en: plain, active; opening misconception → fact; the SaaS paragraph is careful (does not classify SaaS, only states what the directive offers).
- zh-hant: Taiwan usage (國稅局, 扣繳義務人, 稽徵機關, 平台/平臺, 影片 for 視頻); no mainland vocabulary; opening misconception → fact; 應/得 kept as in the directive.
- Opening type ⑤ matches the T25 assignment; among batch-4 ko drafts it is shared with T3, T11, T15, T21 (5 of 25), under the half-of-batch limit.

## 5. Sentence variety

variety_metrics.py: no FAIL on any file (ko cv 0.607, short 11.6%; ja cv 0.491, short 11.1%; en cv 0.592, short 16.7%; zh cv 0.481, short 9.8%; contrast 0 in all; caveat ≤1). Self-check items 2–7: no stock opener; ≥2 very short sentences in each; no paragraph-start word used 3+ times; no three consecutive claim–statute–caveat paragraphs; each file has at least one paragraph without a citation; contrast templates 0; last paragraphs end on this column's facts (2027 filing window / payment-day withholding). No MONOTONY finding.

## 6. Issues

No major issue. Minor items, all applied:

1. en.md sources tail — Original: `…(updated September 4, 2026)` immediately followed by `Checked: October 7, 2026` with no blank line → problem: in markdown the check-date line would render as a lazy continuation of the last bullet (other batch en columns separate it with a blank line) → fix applied: inserted a blank line → facts preserved: text unchanged.
2. ja.md, 純利益率 section — Original: 「支払額の総額の20％が差し引かれます」 → problem: 「支払額の総額」 is redundant → fix applied: 「支払総額の20％が差し引かれます」 → facts preserved: same 20% of the gross payment without an approval (point 6(一)1).

Noted, not changed (accurate as written): ja 「契約書、主要な営業項目、台湾内外の取引の流れを示す資料で主要な営業項目の認定を受ければ」 repeats 主要な営業項目 twice, but both occurrences track the directive (the listed documents and what the office determines), so left as is.

## Minor edits applied

- drafts/T25/en.md: blank line before "Checked: October 7, 2026".
- drafts/T25/ja.md: 「支払額の総額の20％」 → 「支払総額の20％」.
- Lint re-run after edits: OK ×4; variety re-run: no FAIL.

## Image

images/T25.webp — OK. A plain wooden desk by a window at night: closed laptop (no logo), earbuds case, cup of tea, blurred city lights. No faces, text, logos, flags or readable documents; fictional and unidentifiable; respectful; fits a column about selling online services into Taiwan from abroad.

VERDICT: PASS
