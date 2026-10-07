# T22 cross-review r1 — taiwan-import-duty-business-tax-commodity-tax-foreign-supplier (ko, ja, en, zh-hant)

Reviewer: Lane A (Claude Fable 5.1), final gate. Date: 2026-10-07.
Files reviewed: drafts/T22/ko.md, ja.md, en.md, zh-hant.md, facts.md; topics/T22.md (incl. binding R13 notes); research/R13-T22-statutes.md and R13-T22-official.md (treated as untrusted and re-fetched); images/T22.webp.

## Verdict

PASS — all four languages publishable now; image OK. Two minor wording edits applied to en.md (listed below); no major issue found. Every rate, threshold, deadline, article number, date and arithmetic step was checked against pages I opened myself (saved under reviews/T22/cross-sources/).

## Scope checked (every official page opened by me, 2026-10-07)

Statutes (law.moj.gov.tw single-article pages via fetch_law.py → cross-sources/statutes.md; texts identical to R13-T22-statutes.md):
- 關稅法 (G0350001, 修正日期 111-05-11): §3, 4, 6, 16, 17, 21, 22, 29, 43, 45, 73, 74, 98. LawHistory (hist_G0350001.html): the 2022-05-11 amendment touched §14, 25, 75, 77, 79, 81–83-1, 84–86, 87, 88–91, 93, 95 (+26-1, 83-2, 86-1; −97) — none of the cited articles.
- 加值型及非加值型營業稅法 (G0340080, 114-05-28): §2, 10, 15, 19, 20, 36, 41. LawHistory: 112-12-06 (§2-1, 6), 113-08-07 (§6-1, 32-1, 50, +48-2), 114-05-28 (§58, in force 115-01-01) — cited articles untouched.
- 營業稅法施行細則 (G0340081, 113-12-17): §3, 29, 38. LawHistory: §38 was among the articles amended 113-12-17; the drafts cite the current text, correct.
- 貨物稅條例 (G0340076, 114-12-30): §1, 2, 6, 7, 8, 9, 10, 11, 12, 18, 23, 37. LawHistory: §8, 11, 37 amended by promulgation 114-08-19; 行政院 114-11-14 院臺財字第1141031473號令 set §8 and §11 in force 115-01-01 — matches the drafts' "§11 in force since 2026-01-01".
- 貨物稅稽徵規則 (G0340017, 115-08-18): §55. LawHistory: §55 last amended 112-02-23; the 115-08-18 amendment touched §7, 18, 90 (+54-1, 54-2, 59-1, in force 116-01-01) — matches the drafts.
- 貿易法 (J0090004, 108-12-25): §21, 21-1. 貿易法施行細則 (J0090011, 112-11-06): §17.
- 海關進口稅則 (G0350051): LawAll header + LawHistory — 修正日期 115-01-28 (總統華總一經字第11500007801號令修正公布部分稅則).
- English titles (law.moj.gov.tw/ENG LawAll, eng_*.html): Customs Act (2022-05-11); Value-added and Non-value-added Business Tax Act (2025-05-28); Enforcement Rules of Value-added and Non-value-added Business Tax Act (2024-12-17); Commodity Tax Act (2025-12-30); Regulations for the Collection of Commodity Tax (ENG page shows 2023-02-23); Foreign Trade Act (2019-12-25); Enforcement Rules of the Foreign Trade Act (2023-11-06); Customs Import Tariff (2026-01-28). ENG Customs Act Art. 6: "the consignee of the imported goods, the bearer of the bill of lading, or the holder of the imported goods".

Official non-statute pages (HTML saved as cross-sources/O*.html; PDFs + pdftotext output):
- 關務署 FAQ 進口貨物應繳之稅費有那些？ (發布 2026-07-13) — O1_customs_charges.html: 從量/從價/複合 definitions, "一般進口貨物大多按從價稅", 推廣貿易服務費 0.04%, "推貿費100元以下免徵", 營業稅 = (完稅價格+關稅+貨物稅…)×5%, CIF definition.
- 關務署 FAQ 海關如何課徵進口貨物營業稅？ (2026-07-09) — O2_customs_biztax.html: formula, 5%.
- 關務署 FAQ 進出口貨物是否一定要委託報關業…？ (2026-07-08) — O4_customs_broker.html: 由貨主自行、或委託報關業者.
- 關務署 FAQ 進口貨物稅則稅率如何查詢？ (2026-07-15) — O6_customs_lookup.html: 關港貿單一窗口「稅則稅率查詢」.
- 關務署 FAQ 海關進口稅則稅率為何？ (2026-07-15) — O7_customs_columns.html: HS, 8位碼, three columns, column-2 list (PA, GT, HN, CN-ECFA, NZ, SG, PY, SZ, BZ, MH) — no JP/KR/US/VN.
- 關務署 ECA／FTA專區 list (更新日期 2026-10-07) — O16_customs_eca_zone.html: newest item 2026-01-06 (ECFA原產地認定); no ART item.
- 關務署 臺美貿易倡議問答集 page (發布 2024-12-11) + PDF (header 113.12) — O22_customs_usqa.html/.pdf/.txt: 1.1 "得由我國進口商或美國出口商、製造商…申請"; 1.7 "翌日起150日內作成預先審核決定".
- 經濟部國際貿易署 推廣貿易服務費 FAQ (no item date; site 更新日期 2026-10-07) — O11_moea_fee_faq.html: "目前實際收取費率是輸出入貨品價格的萬分之四"; import base "新臺幣關稅完稅價格（CIF）乘以萬分之4".
- 行政院公報 經濟部公告 113-02-02 經貿字第11350200210號 — O12_gazette_fee_exempt.html: items 四, 五, 七 (but-clause for 海關進口稅則 zero-rate goods), 八 (≤ NT$100).
- 財政部高雄國稅局 新聞 2020-06-02 — O14_mof_kaohsiung.html: "應以繳納日期所屬月份始提出申報，繳稅日期屬次期者應留至次期申報，且不得有…第19條…項目".
- 財政部 函釋 台財稅第800192374號, 公發布日 民國80年06月19日 — O15_mof_ruling_1991.html: "應依同法第41條及第36條之規定，分別認定辦理".
- 經濟部國際貿易署 臺灣ECA/FTA總入口網 (no date on page) — O17_fta_portal.html: partners 瓜地馬拉, 貝里斯, 紐西蘭, 新加坡, 巴拉圭, 史瓦帝尼, 馬紹爾, 巴拿馬, 尼加拉瓜(停止施行) — no JP/KR/US/VN.
- 行政院 臺美關稅談判網站 新聞稿 中華民國115年2月13日 — O18_ey_releases.html: 美東時間2月12日於美國華府, TECRO/AIT 完成簽署, 行政院將依條約締結法函請立法院審議; 協定文本頁 — O18b_ey_art.html; 新聞列表 — O18c_ey_news.html: newest 2026-08-14, no entry-into-force item.
- USTR press release 2026-02-12 — O19_ustr_press.html; USTR fact sheet (Feb 2026) — O19b_ustr_factsheet.html: "The Taiwan side will eliminate or reduce 99 percent of tariff barriers." (verbatim); USTR agreements page — O19c_ustr_art_page.html (Taiwan: text + tariff schedule + fact sheet only).
- ART text (USTR PDF) — O20_ART.pdf/.txt: Article 7.5 "…This Agreement shall enter into force the day following the date of the last notification."
- 行政院經貿談判辦公室 2024-12-10 — O21_otn_21c.html: 「臺美21世紀貿易倡議首批協定」在113年12月10日正式生效.

Tools: lint.py OK on all four files (ko 3,336 chars; ja 3,650; zh-hant 2,646; en 1,585 words after edits). variety_metrics.py check: no FAIL on any file (ko cv 0.46 short 0.149 cite_end 0.328 contrast 0; ja cv 0.457 short 0.159; en cv 0.495 short 0.165 q=2; zh cv 0.586 short 0.093). Internal links: both slugs exist in all four languages (LINKS.md lines 4/16/28/41 and 87/94/101/108).

## 1. Law and facts — result per language

Checked in every language: §20 base (完稅價格 + 進口稅 + 貨物稅) and 5% (§10 band + customs FAQ 2026-07-09/-13); §4/§41/§23 II collection by customs; 貿易法施行細則 §17 II (fee on the same 稅款繳納證); payers §6 / §2(2)+細則 §3 / 貨物稅條例 §2 I(3); §16 I 15 days from the day after arrival; §73 NT$200/day, sale after 20 days of fees; §22 I–II broker; §17 I documents; §43 I 14 days from the day after service; §74 萬分之五/day, sale after 30 days; §45 復查 30 days; §98 5 years; §29 I–III valuation and additions (lists marked non-exhaustive with 등/など/等/"several"); CIF attributed to customs only; §3 I + 稅則 115-01-28; three columns and column-2 list; FTA portal; §21 I advance ruling; §15 I; 細則 §38 I(2) certificate; 高雄國稅局 timing; 細則 §29 10-year limit; §19 I(5); 貨物稅條例 §1, §6–§12 (seven groups), §18, 稽徵規則 §55 II–III; §11 rates 13% / 20% / 15% and §12 25% (≤2,000 cc), dated "as of October 2026" with the 2026-01-01 effective note; 貿易法 §21 I cap 0.0425%, actual 0.04% (ITA FAQ + customs FAQ), §21-1(2) base, gazette exemptions incl. the zero-rate but-clause and ≤ NT$100; worked example arithmetic (100,000 + 143,000 + 62,150 + 400 = 305,550; base 1,243,000) — all correct and consistent across languages.
en/zh only: ART signed 2026-02-12 (US Eastern) by TECRO/AIT in Washington; USTR 99% quote verbatim; Article 7.5 entry-into-force rule; Executive Yuan to send to Legislative Yuan; "no official notice of entry into force found on the pages checked on 2026-10-07" — confirmed by my own check of the EY news list, customs ECA zone and USTR pages. en only: first 21st-Century Trade Initiative agreement in force 2024-12-10; US exporter/producer may apply for advance ruling; 150 days — confirmed (see edit 1).
UNVERIFIED items from the R13 notes: none appears as fact in any draft (no column-1 claim, no foreign-seller-as-importer claim, no ART-in-force claim, no "no US–Taiwan agreement", no §49 amount, no luxury/tobacco figures, no full partner list, 5% attributed to customs FAQ not the EY order). Korean/Japanese/US/Vietnamese law: no statement beyond official-source facts about agreements. No contradiction between language versions.

## 2. Citations

Inline links sit right after the claims; every statute link points to the correct single-article URL; the tariff links LawAll (G0350051); agreement links point to the official text (USTR PDF) and official EY/USTR/OTN pages; sources sections are complete for what each version cites (en omits §98 and 稽徵規則 §55 III, which its body does not use; zh omits §17, which its body does not use) and each states the check date 2026-10-07. Two restatements of the 5% customs FAQ (ja line 61, zh-hant line 55) have no inline link at that spot, but the same FAQ is linked in each column's first paragraph and in the sources — acceptable, no change.

## 3. Rules

No bold/underscore/strong (grep clean). No phone, LINE/Kakao, street address. One soft contact sentence per language naming the firm and wei@hoveringlaw.com.tw, asking for product and trade terms — no bookkeeping/filing/audit offer. author legal-ai-assistant; no lawyer/CPA/native-review claim. The invented 10% duty rate is labelled in every language (가상 / 架空 / invented / 虛構). Frontmatter: topic tax, tags ["tax-accounting"], categories per language, featured_image NNN literal, 3 FAQ items consistent with the body, audience = file language; ko/ja/zh seoTitle 18/18/15 chars and different from title; en title + " | Hovering Law" = 100 chars so seoTitle required and present (38 chars); en summary 158 chars, no forbidden characters.

## 4. Voice

ko: 합니다체 throughout, natural practitioner tone, title specific (not imperative/question-formula), first paragraph delivers the §20 base fact at once. ja: です・ます throughout (one 体言止め, allowed), natural glosses (納付書, 荷受人, 放行（引取り許可）), 日台 wording not at issue here (no tax-agreement content). en: plain, active; headings specific ("Fifteen days to declare, fourteen to pay"); two reader questions in the body. zh-hant: Taiwan usage only (國稅局, 完稅價格, 報關業者, 滯報費, 滯納金, 新臺幣, 推貿費); no simplified characters (scan clean); no 官腔 stacking of 應/必須. No AI filler, no checklist headings, no templated closing; each contact sentence differs by language; last paragraph of each version ends on the column's own deadlines/credit timing.

## 5. Sentence variety

Tool: no FAIL in any language (figures above). Self-check items (SENTENCE-VARIETY-RULE §5): opening type ① in all four, no stock hypothetical opener; ≥2 very short sentences in each (e.g. ko "세금 위에 세금이 얹힙니다.", ja "徴収は税関で一度に済みます。", en "Payment comes next.", zh "繳稅更趕。"); no paragraph-start word 3×; no claim-(statute)-caveat chain (caveat=0) and citation-free paragraphs present (contact, closing, example lead-in); contrast templates 0; last paragraph on facts; registers consistent. No MONOTONY finding.

## Issues (Original → problem & reason → fix → facts preserved)

1. en.md, "The US agreement" section (earlier line 61) — minor, applied.
   Original: "Customs must decide within 150 days of receiving the application or the information it requested"
   Problem: the customs Q&A (關務署 臺美貿易倡議問答集 1.7, 113.12) counts the 150 days "自接獲預先審核申請書或申請人已依通知期限提供必要資料之翌日起" — from the day after receipt. The draft's "of receiving" shifts the start by a day.
   Fix applied: "Customs must decide within 150 days from the day after it receives the application or the information it requested"
   Facts preserved: 150 days; both triggers (application / requested information); citation unchanged.

2. en.md, "The 0.04% trade promotion fee" section (earlier line 79) — minor, applied.
   Original: "The rate actually charged is 0.04%, according to the International Trade Administration (ITA FAQ)."
   Problem: brief rule 9 requires a date on time-sensitive rates; the ITA FAQ carries no item date, and the en version (unlike ko/ja/zh, whose summaries say 2026년 10월 현재 / 2026年10月時点 / 2026年10月現行) dated the 0.04% nowhere except the final "Checked" line.
   Fix applied: "The rate actually charged, as of October 2026, is 0.04%, according to the International Trade Administration (ITA FAQ)."
   Facts preserved: rate, source, cap and base unchanged.

No major issues. Nothing required of the writer.

## Minor edits applied

- en.md: the two wording changes above. lint.py OK after edit (1,585 words); variety_metrics.py OK (cv 0.495, short 0.165, no violation). ko.md, ja.md, zh-hant.md untouched (lint OK, variety OK).

## Observations (no change made)

- 提貨單 is rendered "bill of lading or delivery order" (ko 선하증권·화물인도지시서, ja 船荷証券・荷渡指図書) per the binding R13 note; the official English Customs Act Art. 6 says "bearer of the bill of lading". Both readings are covered and the Chinese term is given in every version.
- en sources list "Enforcement Rules of the Value-added and Non-value-added Business Tax Act"; the ENG database title omits "the". Kept for consistency with the published en column 256; the linked law is unambiguous.
- zh-hant body has no reader question (q=0); the rule treats this as optional.

## Image

images/T22.webp: two wooden crates on a pallet jack inside a warehouse beside a half-raised roller door, daylight on a concrete floor. No faces, text, logos, flags or readable documents; fictional and unidentifiable; fits an import/customs column; respectful. Verdict: OK.

VERDICT: PASS
