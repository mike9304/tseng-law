# T21 cross-review r1 — global-minimum-tax-pillar-two-taiwan-subsidiary (ko, ja, en, zh-hant)

Reviewer: Lane B (Claude Fable 5.1), final gate. Review date: 2026-10-07 (KST). Writer: Lane A.
Fetched sources: reviews/T21/cross-sources/ (raw HTML/PDF/JSON plus extracted .txt; taiwan-statutes.md written by fetch_law.py).

## Verdict

PASS — all four language files are publishable as they stand after two minor English wording edits (listed below). No major law/fact, citation, rule, voice or monotony issue remains. One citation-precision note is recorded for the writer (Side-by-Side paragraph numbering); it does not block publication because every cited sentence is supported verbatim by the linked document.

Tool results after edits:
- lint.py: ko OK (2,815 chars), ja OK (3,276 chars), en OK (1,400 words), zh-hant OK (2,069 chars).
- variety_metrics.py: ko OK (cv 0.512, short 11.7 %, contrast 0, q 2); ja OK with one WARN only ("76 % of sentences end in desu-masu") — not a FAIL; en OK (cv 0.614, short 25 %); zh-hant OK (cv 0.598, short 12.2 %).

## Scope checked — every official page opened on 2026-10-07

Taiwan statutes (law.moj.gov.tw single-article pages via fetch_law.py; amendment date from LawAll header):
- 所得基本稅額條例 (G0340115) §4, §6, §8 — 修正日期 民國110年01月27日 (2021-01-27). §8: rate set by the Executive Yuan, "最低不得低於百分之十二，最高不得超過百分之十五". §4: difference payable, "不得以其他法律規定之投資抵減稅額減除之". §6: general tax = tax after investment credits.
- 所得稅法 (G0340003) §5, §23 — 修正日期 民國115年09月11日 (2026-09-11). §5 ¶5 item 2: "超過十二萬元者，就其全部課稅所得額課徵百分之二十". §23: calendar year unless the tax office approves a change.
- 產業創新條例 (J0040051) §10, §10-2 — 修正日期 民國114年05月07日 (2025-05-07). §10: 15 % of spend, cap 30 % of the year's tax. §10-2: effective-tax-rate ratio "一百十二年度為百分之十二，自一百十三年度起為百分之十五，但一百十三年度…得…調整為百分之十二".

Taiwan MOF / Taxation Administration releases:
- dot.gov.tw cntId=79b26ee22140483fa8ba93c480fd382e — 發布日期 112-08-30. Not an Inclusive Framework member; short/medium/long-term plan; "並未設定期程".
- mof.gov.tw cntId=86ec4803bbf8458f840c8e933a0e25e9 — 發布日期 2024-08-28 (DOT copy cntId=e89e71a7fd5648e790aa7e0104b7ff56, 113-08-28). "自114年度起…AMT徵收率為15%", threshold "前4個財務會計年度中任2個年度…7.5億歐元", others "維持12%", extra tax "計入…有效稅率之分子".
- mof.gov.tw cntId=778207cd646a4a2d9dcdfe98266dcfe4 — 財政部中區國稅局, 發布日期 2026-05-08. 115年度 basic tax "按行政院訂定之稅率（現行徵收率為12%）".
- dot.gov.tw cntId=8d49dd73693740a7b8c53280f553fa0b — 發布日期 113-06-18. "112年度12％，113年度15%" and "係考量…支柱二（Pillar Ⅱ）".

Japan:
- nta.go.jp/taxes/shiraberu/kokusai/global-minimum/index.htm (no date printed) — IIR legislated in 令和5年度改正; UTPR and QDMTT in 令和7年度改正.
- nta.go.jp/publication/pamph/pdf/0023003-075.pdf (令和5年4月) — 令和5年法律第3号; EUR 750m in 2 of 4 years (法82四); 1年3月 / 1年6月 filing; applies to 対象会計年度 beginning on/after 令和6年4月1日 (附則11).
- nta.go.jp/publication/pamph/pdf/0025004-012.pdf (令和7年4月) — UTPR and QDMTT apply to 対象会計年度 beginning on/after 令和8年4月1日 (附則13), lines 224–225 and 517–518.
- laws.e-gov.go.jp 法人税法 (340AC0000000034): article API §82 (item 4 definition) and §82の3 (definition excluding entities whose 所在地国 is Japan; ⑦ side-by-side exemption, "零とする"); full lawdata checked for 令和5年法附則第11条, 令和7年法附則第13条, 令和8年法附則第15条 ("令和八年一月一日以後に開始する対象会計年度について適用").
- mof.go.jp/tax_policy/tax_reform/outline/fy2026/20260123kokusai.htm — 令和8年1月23日 閣議決定; "零とする適用免除基準"; "令和８年１月１日以後に開始する対象会計年度から適用".
- mof.go.jp 告示第八十九号 KO-20260331-89.pdf — 令和8年3月31日; アメリカ合衆国; "令和八年一月一日から適用".

Korea:
- law.go.kr 국제조세조정에 관한 법률 lsiSeq=280389 — header [시행 2026. 1. 2.] [법률 제21215호, 2025. 12. 23., 일부개정]. Checked §61①17, §62①, §63, §66①②, §67①, §69①②, §70①②③, §72①, §73①, §73의2–§73의7, §80 (paragraphs ①–④ only; no ⑤), §83①, §84①; 부칙 법률 제21215호 §1 ("2026년 1월 1일부터 시행") and §3; 부칙 법률 제19191호 §1/§6.
- nts.go.kr/gmt/cm/cntnts/cntntsView.do?mi=41029&cntntsId=239052 (no date) — IIR 2024-01-01, UTPR 2025-01-01, 적격소재국추가세 2026-01-01 (fiscal years beginning on/after).
- mofe.go.kr 2026년 세제개편안 발표 page (2026.08.03) and its attachment 「2. 2026년 세제개편안 상세본.pdf」 (atchFileId=ATCH_000000000032335, fileSn=6), p. 214: "① 병행체계(Side-by-Side System) 적용면제 신설(국조법 §80⑤) … 추가세액을 '0'으로 간주 … <적용시기> '27.1.1. 이후…신고하는 분부터".
- mofe.go.kr 2026년 세제개편안 정부안 확정 page (2026.09.01) and attachment 「국무회의 의결 보도자료」 (ATCH_000000000032613, fileSn=2): "금일 국무회의에서 의결된 11개 세법 개정법률안은 9.3(목)까지 국회에 제출".

Vietnam:
- congbao.chinhphu.vn Resolution 107/2023/QH15 page and gazette PDF (Công báo 1325+1326, 21-12-2023; passed 29-11-2023) — Điều 2 (EUR 750m, 2 of 4 years, exceptions), Điều 4 QDMTT 15 %, Điều 5 IIR 15 %, Điều 8 (effective 01-01-2024, applies from FY2024); text search "UTPR": 0 hits.
- vanban.chinhphu.vn docid=215112 — Decree 236/2025/NĐ-CP, ban hành 29-08-2025, hiệu lực 15-10-2025.
- baochinhphu.vn article 102250830105805776 (datePublished 2025-08-30) — "có hiệu lực thi hành từ ngày 15 tháng 10 năm 2025 và áp dụng từ năm tài chính 2024".

United States / OECD:
- home.treasury.gov/news/press-releases/sb0181 — June 28, 2025; quotation "in recognition of the existing U.S. minimum tax rules to which they are subject" verbatim.
- OECD GloBE Model Rules (2021) PDF — Art 1.1 (EUR 750m, 2 of 4 years), 3.1, 4.1, 5.1, 5.2, 5.3, 8.1 (15 months), 10.1 (Fiscal Year; Minimum Rate 15 %). Paragraph numbers are absent from the text layer; the drafts cite at article level.
- OECD Side-by-Side Package PDF — "approved and declassified … on 5 January 2026". Chapter 1 ¶15 ("When it elects for the safe harbour, an MNE Group will not be subject to the IIR or UTPR"), ¶19 ("remain subject to the QDMTT in all QDMTT jurisdictions"); Chapter 5 ¶28 ("applicable for Fiscal Years commencing on or after 1 January 2026 … does not affect Fiscal Years commencing before 1 January 2026").
- OECD Central Record PDF (© 2026; "current as at 1 December 2025", SbS table "current as at 18 August 2025") — Qualified SbS Regimes: United States, Internal Revenue Code of 1986, "Safe Harbour applicable for Fiscal Years commencing on or after 1 January 2026"; Japan IIR 1 April 2024; Korea IIR 1 January 2024; Viet Nam IIR/QDMTT 1 January 2024. (Taiwan's presence or absence is not stated in any draft, as the brief requires.)

Internal links: LINKS.md confirms /ko|ja|en|zh-hant/columns/taiwan-industrial-innovation-act-rd-investment-tax-credits and …/taiwan-subsidiary-corporate-income-tax-calendar exist in all four languages; lint confirms.

## Law and facts — result per language

All rates, thresholds, dates, article numbers and conditions in the four files match the sources above. Specific points checked:
- Taiwan status wording ("in the official texts checked up to 2026-10-07 … no IIR/UTPR/QDMTT"; 2023-08-30 statement cited with date; draft of 2024-08-28 "remains a draft"; Executive Yuan order "not found") follows the binding research notes in all four languages.
- AMT 12 % now; 15 % draft 自114年度; §8 range 12–15 % without amending the Act — identical in ko/ja/en/zh.
- CIT 20 % above NT$120,000 taxable income; §10 credit 15 % / cap 30 %; 20 % × 70 % = 14 % labelled as simple arithmetic in every language.
- §10-2 ratio stated as "2023: 12 %, from 2025: 15 %" in all four languages. Statute: 112 → 12 %, 自113年度起 → 15 % with 113 adjustable to 12 %; so "from 2025: 15 %" is correct and TY2024 is deliberately left out (R5 UNVERIFIED). Consistent across languages; no change needed.
- Japan: §82の3 (renumbered from §82の2) and §82(4); IIR from 2024-04-01 (附則11); UTPR/QDMTT from 2026-04-01 (附則13); §82の3⑦ from 2026-01-01 (附則15); Notice 89 of 2026-03-31 designating the US; 1年3月 / 1年6月 filing. All confirmed. Local-tax shares and UTPR-side details are not stated, as required.
- Korea: §§60–86 scope; §62① EUR 750m; §61①17 low-taxed entity; §72① IIR applied first; §63 paid as 법인세; §69 country-by-country ETR; §70 formula incl. 적격소재국추가세액 deduction; §66/§67 accounting starting points; §83①/§84① deadline (15 / 18 months, not before 2026-06-30); IIR 2024-01-01, UTPR 2025-01-01, 내국추가세 2026-01-01 (부칙 §1/§3 + NTS). §80 has no ⑤ in force, so "제80조 제5항 신설안 … 현행법에는 없습니다" is correct; cabinet 2026-09-01 confirmed from the MOEF attachment. The word "적격" is not applied to Korea's top-up tax, as required. The ko source list reproduces the law.go.kr header "2026년 1월 2일 시행" verbatim; the body's "2026년 1월 1일 이후 개시 사업연도" follows 부칙 제21215호 §1/§3 — both are faithful to the official page.
- Vietnam: Resolution 107 Art 2/4/5/8, 15 %, effective 2024-01-01, FY2024, no UTPR; Decree 236 dates — all confirmed. No decree content beyond dates is stated.
- US: G7 statement 2025-06-28 quotation verbatim; SbS package approved 2026-01-05; Central Record US row; QDMTT limit; FY ≥ 2026-01-01. The en-only conclusion for US-parented groups is labelled "an inference from the rules, not an official statement" and ends with the US-adviser caution. The 2026-09-11 OECD package is not cited.
- OECD basics: Art 1.1/10.1 used only through national rules; ETR/top-up/SBIE formulas and the 13 % → 2-point example labelled invented in all four languages; arithmetic trivial and correct.
- Statements about Korean, Japanese, US and Vietnamese law are confined to sourced statutory/official facts plus "check with a local adviser" lines; no statement predicts how a foreign authority will treat the item.
- No language version contradicts another on any rate, date or article.

## Issues (Original → problem & reason → fix → facts preserved)

1. en line 41 — "Corporate income above NT$120,000 is taxed at 20% of the whole amount" → loose: 所得稅法 §5 ¶5 item 2 says 課稅所得額 (taxable income), and ko/ja/zh all say 과세소득/課税所得/課稅所得額 → applied: "Corporate taxable income above NT$120,000 is taxed at 20% of the whole amount" → number, article link and the 20 % rule unchanged; condition now matches the statutory term.

2. en line 61 — "Read together with Taiwan's current position, with no QDMTT in the official texts checked, those texts suggest that an electing US group's Taiwan profits face neither an IIR or UTPR nor a Taiwan QDMTT for fiscal year 2026 onward." → dangling opener ("Read together…those texts") and ungrammatical "neither … or … nor" → applied: "Set beside Taiwan's current position, with no QDMTT in the official texts checked, the package suggests that an electing US group's Taiwan profits face no IIR, no UTPR and no Taiwan QDMTT from fiscal year 2026 onward." → the inference label, the "no QDMTT in the official texts checked" caveat, the FY2026 start and the following US-adviser sentence are all unchanged.

3. en lines 59, 61 and 89; ko line 55; zh-hant line 56 and 79 — "(paragraph 15)", "(paragraph 19)", "(paragraph 28)" / "제15항, 제28항" / "第15、19、28段" of the Side-by-Side Package → citation precision, not substance: the PDF restarts paragraph numbering in each chapter. ¶15 and ¶19 as quoted are in Chapter 1 "Side-by-Side Package" (p. 8); ¶28 as quoted is in Chapter 5 "Side-by-Side System" (p. 85). In Chapter 5, ¶15 is the AMT-coverage criterion and ¶19 the worldwide-tax-system criterion; Chapter 1 has no ¶28. A reader following the pointer may land on the wrong paragraph. Every quoted sentence is nonetheless verbatim in the document and the link is to the official text → recommended (NOT applied — reviewer may not alter citations): name the chapter, e.g. en "(Chapter 1, paragraphs 15 and 19; Chapter 5, paragraph 28)" and in the sources line "Chapter 1 ¶15, ¶19; Chapter 5 ¶28"; ko "(패키지 제1장 제15항, 제5장 제28항)"; zh "（第1章第15、19段，第5章第28段）" → no fact changes; the writer can apply this in the integration pass. Classified minor: content supported, document correct, only the intra-document locator is ambiguous.

No other issues. Items that were examined and need no change:
- zh-hant uses 合格國內最低稅負制（QDMTT）; the 2023 DOT release says 合格當地補充稅制(QDMTT). Both are Taiwan usage (the former is common in Taiwan practitioner material); no Mainland term, no simplified characters anywhere in the file.
- ja opening sentence 「…台湾子会社には関係がない。」 is a reported misunderstanding in plain form followed by です・ます; the register check passed (no だ・である mixing counted).
- Opening type ⑤ (common misunderstanding in one line) is used in all four languages as assigned; no stock hypothetical opener.
- First-two-paragraph deletion test (editorial-voice procedure): in each language the first sentence states the misunderstanding, the second corrects it, the third names who computes; deleting any one loses a condition, so nothing was cut.

## Citations and rules

- Inline links sit right after the claims; Taiwan statute links are single-article law.moj.gov.tw URLs with the correct flno; e-Gov, law.go.kr, NTS, MOEF, NTA, MOF-Japan, Vietnamese gazette/portal, Treasury and OECD links open the official texts (all fetched above).
- Sources sections are complete and carry the check date 2026-10-07 in each language, with each Taiwan law's latest amendment date stated correctly (2021-01-27, 2026-09-11, 2025-05-07).
- No bold, no phone number, no street address, email-only contact (wei@hoveringlaw.com.tw) in one short paragraph before the sources, no bookkeeping/filing/audit offer, author legal-ai-assistant, no lawyer/CPA/native-review claim, hypothetical labels present in all four languages, frontmatter per brief (topic tax, tags ["tax-accounting"], audience = file language, en seoTitle 34 chars since title + " | Hovering Law" exceeds 60, en summary within limits) — all confirmed by lint OK on every file.
- Internal links: two per language (324 and 301), both exist in that language; no batch-4 links; no board link.
- Required points from the topic brief covered; every UNVERIFIED item in R12/R1/R5 and the binding notes is either omitted or stated only as "not found"/"inference".

## Voice per language

- ko: natural 합니다체 throughout; endings varied (…셈입니다 / …까요? / …않습니다); no 해라체; title is a specific noun phrase; first paragraph delivers the point; no AI filler, no checklist headings, no formulaic close. No change.
- ja: natural です・ます; 体言止め none beyond heading; reads as written for a Japanese 経理担当者 (3月決算, 税理士, 連結パッケージ); no 「〜について解説します」; subheads specific. No change.
- en: plain, active; short sentences present ("The parent does the arithmetic." "Tax credits." "Watch the statute."); two wording fixes applied (above).
- zh-hant: Taiwan usage (營所稅, 國稅局, 投抵, 曆年制, 遞延所得稅, 補充稅); no 本文將帶您了解/值得注意的是; one comparison table for the four home countries is a real comparison. No change.

## Sentence variety

No FAIL line in any language. Self-check items 2–7 (section 5): opening type as assigned and not a stock formula; ≥ 2 very short sentences in every file; no three paragraphs starting with the same word (opener_rep ≤ 0.111); no three consecutive claim-(statute)-caveat paragraphs and at least one uncited paragraph in every file (cite_para 0.385–0.688); contrast templates 0 in every file; last paragraph ends on this column's fact (the Executive Yuan rate lever) with no copied disclaimer or sales line. No MONOTONY finding.

## Minor edits applied (en.md only)

1. Line 41: "Corporate income above NT$120,000" → "Corporate taxable income above NT$120,000".
2. Line 61: "Read together with Taiwan's current position, with no QDMTT in the official texts checked, those texts suggest that an electing US group's Taiwan profits face neither an IIR or UTPR nor a Taiwan QDMTT for fiscal year 2026 onward." → "Set beside Taiwan's current position, with no QDMTT in the official texts checked, the package suggests that an electing US group's Taiwan profits face no IIR, no UTPR and no Taiwan QDMTT from fiscal year 2026 onward."

After the edits: lint.py en OK (1,400 words); variety_metrics.py en OK. ko, ja and zh-hant were not edited (lint OK, variety OK as run before).

## Image verdict

images/T21.webp — OK. An antique terrestrial globe on a wooden stand in a bare, sunlit room with a window. Fictional, unidentifiable, respectful; no faces, no readable text or labels, no logos, no flags, no documents. Fits the "global minimum tax seen from one subsidiary" theme.
