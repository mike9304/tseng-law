# T20 cross-review r1 — taiwan-related-party-loan-interest-thin-capitalization (ko / ja / en / zh-hant)

Reviewer: Lane B (Claude Fable 5.1), final gate. Review date: 2026-10-07 (KST).
Files reviewed: drafts/T20/ko.md, ja.md, en.md, zh-hant.md, facts.md; topics/T20.md; research/R11-statutes.md, R11-official.md, T20-extra.md; images/T20.webp (+ T20.txt prompt).
Everything fetched for this review is saved under reviews/T20/cross-sources/ (helper scripts: reviews/T20/html2text.py, reviews/T20/billstatus_extract.py).

## Verdict

PASS — all four languages publishable now; image OK. No major issue found. Two minor wording edits applied (listed below); lint and variety metrics OK on all four files after the edits.

## Scope checked — official pages opened on 2026-10-07

Statutes (law.moj.gov.tw, via fetch_law.py → cross-sources/statutes.md; header = latest amendment date on LawAll):
- 所得稅法 (G0340003) §39, §43-2 — 修正日期 民國 115 年 09 月 11 日 (2026-09-11)
- 所得稅法 沿革 https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=G0340003 → cross-sources/moj-G0340003-history.txt (entry 50: 一百年一月二十六日 … 增訂第 24-4、43-2 條; entry 71: 一百十五年九月十一日 修正第 17、126 條)
- 營利事業對關係人負債之利息支出不得列為費用或損失查核辦法 (G0340130) §2–§8 — 發布日期 民國 100 年 06 月 22 日, no 修正日期 shown (LawAll page saved: moj-G0340130-all.txt); English title page https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=G0340130 (Announced Date 2011-06-22) → moj-ENG-G0340130.txt
- 營利事業所得稅查核準則 (G0340051) §97 — 修正日期 民國 112 年 12 月 11 日 (2023-12-11)
- 營利事業所得稅不合常規移轉訂價查核準則 (G0340019) §5, §8-1, §13 — 修正日期 民國 109 年 12 月 28 日 (2020-12-28)
- 各類所得扣繳率標準 (G0340028) §3 — 修正日期 民國 110 年 06 月 30 日 (2021-06-30)
- 適用所得稅協定查核準則 (G0340125) §25 — 修正日期 民國 114 年 04 月 08 日 (2025-04-08)
- 外國人投資條例 (J0040002) §4, §12 — 修正日期 民國 86 年 11 月 19 日 (1997-11-19)

MOF orders (law-out.mof.gov.tw, curl → .html + .txt):
- 台財稅字第10000367210號令 (公發布日 民國 100 年 09 月 26 日) https://law-out.mof.gov.tw/LawContent.aspx?id=GL008788 → mof-GL008788.txt
- 台財稅字第11400691940號令 一百十五年度營利事業借款利率最高標準 (公發布日 民國 114 年 12 月 19 日) https://law-out.mof.gov.tw/LawContent.aspx?id=GL011688 → mof-GL011688.txt
- 查核辦法 MOF-system copy, 台財稅字第10004904070號令 (公發布日 民國 100 年 06 月 22 日) https://law-out.mof.gov.tw/LawContent.aspx?id=GL008758 → mof-GL008758.txt

Agreements and MOF list (mof.gov.tw, curl + pdftotext):
- 我國所得稅協定一覽表 https://www.mof.gov.tw/singlehtml/191?cntId=63930 (發布日期 2026-09-04, 更新日期 2026-09-04) → mof-agreement-list.txt
- Korea consolidated text 中文 https://www.mof.gov.tw/download/ea19d023141d4d3dbfbd122d99081c86 → korea-zh.txt; English https://www.mof.gov.tw/download/9679b16a87cd418ca479db4f947a588e → korea-en.txt
- Japan 中譯本 https://www.mof.gov.tw/download/10422 → japan-zh.txt; English https://www.mof.gov.tw/download/10462 → japan-en.txt
- Vietnam 中譯本 https://www.mof.gov.tw/download/6b9255566aab4b9084c085ddc921138e → vietnam-zh.txt; English https://www.mof.gov.tw/download/66dc13da4e8449698e42d6b818549c52 → vietnam-en.txt

US bill status:
- congress.gov returned a JavaScript challenge to curl and HTTP 403 to WebFetch (congress-hr33.html saved as evidence); the browser tool was not permitted in this session. Used the official GPO bulk bill-status feed instead (same data as congress.gov): https://www.govinfo.gov/bulkdata/BILLSTATUS/119/hr/BILLSTATUS-119hr33.xml → govinfo-BILLSTATUS-119hr33.xml. updateDate 2026-09-19; bill-level latestAction 2025-01-16 「Received in the Senate and Read twice and referred to the Committee on Finance.」; no <laws> element. So "pending" (en) is accurate.

Tools run (all four files): python3 lint.py … → OK (ko 2,879 chars, ja 3,237 chars, en 1,414 words, zh-hant 2,126 chars, all within the medium length bands); python3 shared/variety/variety_metrics.py check … → OK, no FAIL line in any language (after edits: ko cv 0.494 short 0.088 opener_rep 0.0; ja cv 0.474 short 0.143; en cv 0.594 short 0.212; zh cv 0.582 short 0.122; contrast 0 in all; caveat ≤1). grep for `**`, `__`, `<b>`, `<strong>`, phone patterns, LINE/Kakao → none.

## 1. Law and facts — result per claim (all four languages checked against the fetched texts)

Every item below was found correctly stated in all four versions unless a language is named; the versions do not contradict each other.
- §43-2: rule, 自一百年度起 (from tax year 2011), disclosure duty (para 2), MOF regulation power (para 3), exclusion of 銀行、信用合作社、金融控股公司、票券金融公司、保險公司及證券商 (para 4) — matches statutes.md. Added 2011-01-26 — matches 沿革 entry 50. Income Tax Act last amended 2026-09-11 (sources) — matches header.
- 查核辦法 issued 2011-06-22, no amendment date shown — matches LawAll header and MOF-system copy. Ratio 3:1 — §5 III verbatim.
- Related party ≥20% direct/indirect voting shares or capital (§3 II(一)); foreign head office ↔ Taiwan branch (§3 II(七)) — correct.
- Related-party debt list (§4 I items 一–四): direct loans, via non-related party, non-related loans guaranteed by a related party with joint liability, other debt-type financing — correct in all languages.
- "Interest" scope (§5 II): 利息加碼、違約利息、擔保費、抵押費、貸款承諾費、融資費… — ko/ja/zh list a correct subset; en adds mortgage fees (抵押費), also in the text.
- Interest-free loans imputed under TP rules count in the numerator (§6 I); en also states the self-adjustment sentence (last sentence of §6 I) — correct.
- Monthly averages and formula (§5 III), disallowed interest = year's related-party interest × (1 − 3 ÷ actual ratio) (§5 I) — correct.
- Equity definition, floor at 實收資本額 + share-premium 資本公積, branch = 無需支付利息之實際投入營運資金 (§4 III) — correct.
- Arithmetic: ko 5:1 → 0.4 → NT$8m of 20m (12m left); ja 4:1 → 0.25 → 8m of 32m (24m left); en 6:1 → 0.5 → 18m of 36m; zh 5:1 → 0.4 → 8m of 20m; FAQ 4:1 → 1/4, 5:1 → 2/5, 6:1 → 1/2 — all right. Each example labelled invented and "assumed outside the exemptions".
- Exemptions (台財稅字第10000367210號令 item 一(一)–(三)): revenue net operating + non-operating ≤ NT$30m; interest expense AND related-party interest both ≤ NT$4m; negative pre-interest taxable income with no §39 I proviso carry-forward; effect = excluded from the formula AND exempt from the ratio disclosure — correct wording and AND/OR in all four. §39 I proviso = 前十年內各期虧損 (ja's "10年の繰越控除" correct).
- Excluded debt: 查核準則 §97 items 7–8 capitalised interest; item 9 capitalised or deferred-expense interest (查核辦法 §4 II 二、三) — correct. Bank loan fully secured by own assets where the bank still requires a related-party joint guarantee (last paragraph of the 2011-09-26 order) — correct, attributed to the order.
- No TP-report exemption: stated only as an absence (§4 II item 四 is 「其他經財政部核准之負債」) — consistent with the binding research note. Nothing on the brief's UNVERIFIED list (行政程序法 §131 period, disclosure form, TP-report exemption, NT$300m BoT-rate safe harbour) appears in any version.
- Rate ceiling: 查核準則 §97(14) wording; 2026 (民國115年度) ceiling 月息一分三厘 = 1.3%/month; financial-institution loans at the contract rate; proposed by regional NTBs, approved by MOF (ja/en) — all per the 2025-12-19 order and §97(14). "×12 = 15.6%" labelled as simple arithmetic.
- TP: 資金之使用 (TP準則 §5(六)); CUP, cost plus, other MOF-approved methods (§13); funder not controlling financial risk → risk-free return only (§8-1 III 一) — correct.
- Disclosure and 8 document categories, tax office may set the ratio from information it obtains (§7 I–III) — correct; en/ja/ko/zh paraphrases of the categories match §7 II.
- Withholding 20% 「其餘各種利息，一律按給付額扣取百分之二十」 (扣繳率標準 §3(4)(五)), dated "as of October 2026" — correct; the 15% items (§3(4)(一)–(四)) rightly left out as inapplicable to intercompany loans.
- Japan Art 11(2) 10% cap for a beneficial owner resident in the other territory; Art 11(8) special-relationship excess — verbatim match (japan-zh.txt lines 370–372, 437–441; japan-en.txt 494–496, 579–585). Signed Tokyo 2015-11-26 by 亞東關係協會 / 公益財團法人交流協會 (text, lines 845–846); in force 2016-06-13 (MOF list line 222–224). ja calls it 日台民間租税取決め and names the parties "取決め本文によれば" — correct and consistent with brief rule 11.
- Korea Art 11(2), 11(8) — verbatim match (korea-zh.txt 269–272, 305–308; korea-en.txt 541–545, 609–617). Parties 駐韓國台北代表部 / 駐臺北韓國代表部; original agreement signed 2021-11-17, in force 2023-12-27 (MOF list lines 237–244).
- Vietnam Art 11(2) (「利息取得者如為該項利息受益所有人」), Art 11(6) — verbatim match (vietnam-zh.txt 328–330, 361–365; vietnam-en.txt 348–351, 383–391). Parties 駐越南台北經濟文化辦事處 / 駐台北越南經濟文化辦事處.
- Treaty rate at source needs residence certificate + beneficial-owner certificate (適用所得稅協定查核準則 §25 II) — en body and ko/ja FAQs correct.
- US: MOF list (updated 2026-09-04) shows the United States only in the shipping/air-transport table (1988/05/31) — en/zh statements correct; H.R.33 still pending per GPO data updated 2026-09-19 (en says only "pending" and defers to column 303).
- 外國人投資條例 §4(三) loan ≥1 year = investment; §12 III 結匯 of loan principal and interest per approved terms — correct.
- 查核準則 §97(18)(三) receipt + 結匯證明 or bank remittance proof — correct.
- Home-country law: ko (한국 세무 전문가와 확인), ja (日本の税理士に確認), en (a US tax adviser can confirm the FTC) are general cautions only; zh has none. OK.

## 2. Citations

Inline links sit right after each claim; every statute link is the law.moj.gov.tw single-article URL for the article named (checked pcode+flno for all 17 article links per language); the 查核辦法 overview link uses LawAll (fine for a whole-regulation reference). Agreement links point to the MOF PDFs of the agreement texts; MOF orders link to law-out.mof.gov.tw. Sources sections list every source used with the amendment/issue dates verified above and state the check date (2026-10-07). Internal links: /{lang}/columns/taiwan-transfer-pricing-documentation-thresholds, …/taiwan-withholding-tax-payments-to-foreign-companies, …/taiwan-company-establishment-advanced-2 — all present in LINKS.md for ko, ja, en, zh-hant (lint confirms); no batch-4 link.

## 3. Rules

No bold, no phone, no street address, email-only contact (one soft paragraph before the sources), no bookkeeping/filing/audit offer, author legal-ai-assistant, no lawyer/CPA/native-review claim, hypotheticals labelled (가상의 예 / 架空の例 / an invented example / 虛構情境, placed inside the sentence). Frontmatter: topic "tax", tags ["tax-accounting"], audience = own language, featured_image NNN path, 2–3 FAQs consistent with the body. en: title + " | Hovering Law" = 98 chars → seoTitle required and present (42 chars, within 30–45); summary 160 chars, no forbidden characters. ko/ja/zh seoTitle 26 / 21 / 18 chars, each different from the title.

## 4. Voice

ko: calm 합니다체 throughout, title names the subject and the issue, first paragraph gives the 3:1 line at once, no preview sentence, one reader question ("무이자로 빌려주면 어떨까요?"). ja: natural です・ます, "上限の内側なら安心、とはいきません" and "同条第8項にも目を通しておくべきでしょう" read as a practitioner's voice; 日台民間租税取決め used. en: plain and active, short sentences mixed in ("Three to one." "Paperwork follows the numbers."). zh-hant: Taiwan usage (營所稅、國稅局、稽徵機關、業主權益、結匯、文據), no mainland terms or simplified characters, no 官腔 stacking of 應/必須. Headings are specific `##` subheads, no checklist or imperative headings, no copied disclaimer; each last body paragraph ends on the capital-vs-loan facts before the one-line contact paragraph.

## 5. Sentence variety

Tool: no FAIL in any language (see numbers above). Self-check: opening type ④ (one number) in all four, no stock hypothetical opener; ≥2 very short sentences; no 3 consecutive claim-(statute)-caveat paragraphs; ≥1 paragraph without a citation; contrast templates 0; ko/ja register uniform. One self-check slip found and fixed (below): ko had three paragraphs beginning with "비율". No MONOTONY finding remains.

## Issues (Original → problem & reason → fix → facts preserved)

1. [ko, minor, applied] 「비율 공시 대상인 회사는 신고서에 관계인 부채비율을 정해진 서식으로 공시합니다.」 → three body paragraphs started with "비율" ("비율이 3대 1을 넘으면", "비율 안에 있는 이자라도", "비율 공시 대상인") — SENTENCE-VARIETY-RULE §5 item 4 (same paragraph-opening word ≥3 times) → 「공시 대상인 회사는 신고서에 관계인 부채비율을 정해진 서식으로 공시합니다.」 → no fact, number or citation changed; variety opener_rep 0.062 → 0.0.
2. [en, minor, applied] "each caps the tax at 10% of the gross interest where the recipient resident on the other side is the beneficial owner (Article 11(2) of each)" → "the recipient resident on the other side" is an awkward noun stack → "each caps the tax at 10% of the gross interest where the beneficial owner is a resident of the other side (Article 11(2) of each)" → same condition (beneficial owner + residence in the other territory), same rate and article reference.

Observations, no change required:
- Korea: the MOF list now also shows 韓國(修正協議) signed and in force 2026-08-04 with the footnote that it only renames the Korean ministry (企劃財政部 → 財政經濟部); the consolidated text's disclaimer reads 「112 年 12 月 27 日生效之原協定併 115 年 8 月 4 日生效之修正協議」. The ko column's "(2023년 12월 27일 발효)" is the in-force date of the original agreement, and Article 11 is unchanged, so the statement and the consolidated-text link stand.
- ko uses the character 「令」 for MOF orders (body, FAQ and sources, consistently); understandable to the target readers as 재정부 령, left as written.
- ja keeps 信用合作社 as the Taiwanese entity name rather than a Japanese gloss; acceptable.
- congress.gov could not be opened directly in this session (JS challenge / 403); the official GPO BILLSTATUS feed was used and saved. The columns state no bill facts beyond "pending" (en) and the absence of a comprehensive agreement (en, zh).

## Minor edits applied

- drafts/T20/ko.md: "비율 공시 대상인 회사는" → "공시 대상인 회사는" (one paragraph opener).
- drafts/T20/en.md: "where the recipient resident on the other side is the beneficial owner" → "where the beneficial owner is a resident of the other side".
- After edits: lint OK (ko 2,879 chars; en 1,414 words); variety_metrics OK for ko and en. ja and zh-hant untouched (lint OK, variety OK).

## Image

images/T20.webp — an empty brass balance scale on a pale stone shelf, soft side light. Fits the column (a two-pan balance for a debt-to-equity ratio), fictional and unidentifiable: no faces, text, logos, flags or readable documents; respectful. Verdict: OK.
