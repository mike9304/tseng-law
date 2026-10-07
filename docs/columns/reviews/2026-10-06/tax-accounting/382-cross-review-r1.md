# T23 cross-review r1 — taiwan-customs-valuation-related-party-imports-transfer-pricing (ko / ja / en / zh-hant)

Reviewer: Lane A cross-reviewer (Claude Fable 5.1), final gate. Review date: 2026-10-07 (KST).
Inputs read in full: brief-BATCH.md, brief-EDITORIAL-VOICE.md, shared/SENTENCE-VARIETY-RULE.md, shared/LESSONS.md (skimmed), topics/T23.md (incl. binding R13 notes), drafts/T23/{ko,ja,en,zh-hant}.md, drafts/T23/facts.md, research/R13-T23-statutes.md, research/R13-T23-official.md, images/T23.webp.
Research files and the writer's fact sheet were treated as untrusted; every statute article, order, FAQ and table used in the columns was re-opened from the official site and saved under reviews/T23/cross-sources/.

## Verdict

PASS — all four language versions are publishable now. No major issue found. One minor wording edit applied (en, FAQ example), lint and variety re-run OK. Image OK.

## Scope checked — official pages opened on 2026-10-07 (saved file in reviews/T23/cross-sources/)

Statutes, law.moj.gov.tw single-article pages via fetch_law.py (statutes.md; each header carries the law's 修正日期):
- 關稅法 (G0350001, 修正日期 民國111年05月11日): §13, §18, §21, §28, §29, §30, §31, §32, §33, §34, §35, §36-1, §42, §45, §75, §98
- 關稅法施行細則 (G0350002, 113-12-23): §12, §14
- 海關緝私條例 (G0350029, 107-05-09): §37, §45-3
- 進口貨物估價預先審核實施辦法 (G0350068, 115-01-23): §2, §6, §7, §9
- 進出口報單申報事項更正作業辦法 (G0350059, 113-04-10): §6
- 加值型及非加值型營業稅法 (G0340080, 114-05-28): §20, §41, §51
- 關稅法 LawHistory page (moj-G0350001-history.txt) — to verify the sources-section statement that §§29–35 are unchanged since the 93-05-05 full revision: the amendments after 2004 list §71; §80 (deleted); §11, 17, 19, 48 (+36-1); §17, 27, 71, 96 (+10-1); §7, 10, 13, 20, 23, 59, 81, 83, 93 (+20-1, 28-1, 83-1, 87-1); §3, 8–10, 21, 22, 26–28-1, 36-1, 39, 43, 48, 49, 75, 78, 82, 84–87, 88–92, 95; §49; §17, 84, 96; §14, 25, 75, 77, 79, 81–83-1, 84–86, 87, 88–91, 93, 95 (+26-1, 83-2, 86-1; −97). None touches §§29–35. Statement verified.
- law.moj.gov.tw/ENG LawAll pages (moj-ENG-*.txt): Customs Act (Amended Date 2022-05-11; Article 30 translation quoted in en), Enforcement Rules of the Customs Act (2024-12-23), Customs Anti-smuggling Act (2018-05-09), Regulations Governing the Implementation of Customs Valuation Advance Ruling on Imported Goods (2026-01-23). G0350059 ENG page returned no title/content (same as the writer found) — en's descriptive name "correction regulations" with the Chinese name is acceptable.

MOF law-out pages (mof-*.txt):
- 核釋跨國集團於會計年度結束前進行一次性移轉訂價調整規定, 公發布日 民國108年11月15日, 台財稅字第10804629000號令 (GL010728) — points 1, 2(1)1–2, 3, 4 read in full.
- 海關實施會計年度一次性移轉訂價核定完稅價格作業要點 (GL010748), 公發布日 108-12-31, 修正日期 111-04-22, 台關稽字第1111004753號令 — points 1–17 read in full; 法規沿革 page (LawContentSource) confirms 108-12-31 訂定, 109-04-28 第3點 修正, 111-04-22 修正.
- 本條例第37條規定並未排除過失犯之處罰, 公發布日 97-12-18, 台財關字第09700557340號 (GL008500).
- 海關代徵營業稅稽徵作業手冊 (FL006098), 公發布日 75-02-06, 修正日期 107-05-22 — 伍六, 伍九, 伍十一(二)1–2 read.

Customs Administration pages (customs-*.txt; attachments under odt-faq/ and odt-penalty/):
- 一次性移轉訂價之關稅估價專區 常見問題 page (singlehtml/3461?cntId=cus1_184038_3461, 發布日期 2020-04-06) + attached ODT 「常見問答110」 (content.xml dated 2021-09-22; cover 109年3月): Q1–Q15 read; Q2, Q6, Q7, Q8, Q9, Q13 match the columns verbatim.
- 常見問答 特殊關係 (singlehtml/1207?cntId=cus1_176851_1207, 發布日期 2026-07-06): eight categories + 【案例】 (cars, >20% lower price, upgraded equipment, importer could not show closeness to a 細則 §14 price).
- 常見問答 海關如何課徵進口貨物營業稅 (singlehtml/1207?cntId=cus1_93284_1207, 發布日期 2026-07-09): 營業稅＝（完稅價格＋進口稅＋貨物稅或菸酒稅+菸品健康福利捐）Ｘ營業稅率（5%）.
- 新聞稿 誠實申報進口貨物完稅價格，免受罰真便捷 (singlehtml/2222?cntId=d24a6e22…, 發布日期 2021-06-02): directs 估價預先審核 applications to 基隆關.
- 業務公告 修正「緝私案件裁罰金額或倍數參考表」第三十七條第一項規定部分 (singlehtml/698?cntId=643e563a…, 發文日期 112-06-20, 台財關字第1121014906號, 「並自即日生效」) + attached ODT 修正規定: tiers 逾50萬 3× (但書 2.5×), 逾10萬至50萬 2.5× (2×), 10萬以下 2× (1.5×); provisos 裁罰處分核定前已補繳稅款或同意以足額保證金抵繳 / 放行前申請退運出口經海關核准或以書面聲明放棄.

Not opened (not cited in the columns): 海關事後稽核實施辦法, 海關緝私案件減免處罰標準, 稅則/原產地預先審核實施辦法, 稅捐稽徵法, 所得稅法 §43-1 (the columns mention §43-1 only as cited inside MOF order point 4, with the order linked).

## 1. Law and facts — per-language check

All rates, thresholds, deadlines, amounts, dates, article numbers, procedures and conditions in the four versions were compared sentence by sentence with the texts above. Result: supported and correctly stated; the four versions agree with each other. Specifics:

- 關稅法 §29 I–III (transaction value; additions: buyer-borne commissions/packing, assists incl. parts/dies/overseas design, royalties under the terms of sale, freight and insurance to the port of import): ko §2, ja §2, en §3, zh §2 — correct. The ja/en remark that a trademark fee paid to the parent or dies supplied by the subsidiary "may belong here / should be checked" is hedged and consistent with §29 III(2)(二), III(3) and 細則 §12 II (權利金 includes 商標權).
- §30 I(4) 「致影響交易價格」 and §30 II eight categories incl. ≥5% voting shares and direct/indirect control: all four — correct; "relationship alone is not enough" stated without rebutting a claim the reader did not make.
- 細則 §14 I–IV: customs 應審查 when in doubt, 得 request more detail, must give reasons and a reasonable chance to respond, written reasons on request; three customs-determined test values; ±30-day windows (export date for (1) and (3), import date for (2)): all four — correct. No percentage for 「相接近」 stated anywhere; the FAQ 20% is described as a fact of the example in all four (ko 「20%는 사례 속 사실입니다」, ja 「20％は事例の中の事実です」, en "The 20% is a fact of that example", zh 「20%是案例事實」).
- §31→§32→§33→§34→§35 order and §33 II swap at the importer's request: all four — correct.
- MOF order 108-11-15: from 109年度/2020; prior agreement on terms and all pricing factors + adjusted receivables/payables booked; counterparty's simultaneous corresponding adjustment; related taxes paid at the adjusted price; point 2(1)2 VAT refund = 進項稅額之減少; point 3 late → 海關將逕行核定完稅價格; point 4 所得稅法 §43-1 and the TP audit regulations still apply: all four — correct.
- 作業要點 (108-12-31 issued, 111-04-22 last amended): point 3 押款放行申請書 before 放行提領, 預估 invoice + 貨價申報書, codes 138 / 65, remark with fiscal year; point 4 C2/C3; point 7 one month after fiscal year end, documents, 逾期不予受理; point 9 15 days; point 10 four months from the day after receipt, one extension ≤ 2 months; point 13; point 14 no interest on deposit refund; point 15 復查 under §45; §45 30 days from the day after receipt of the 稅款繳納證; §18 III(3): all four — correct, and the numbered list in each language keeps the sequence.
- FAQ Q2 (cannot add remarks later; 放行後6個月內 general correction), Q6 (per declaration and item, before/after amounts), Q7–Q8 (TP report as reference document; customs reviews 完稅價格 only, TP review stays with 國稅局), Q13 (exports outside): all four — correct. 更正作業辦法 §6 「放行之翌日起六個月內」: ko/ja/en "day after release", zh "放行翌日起" in the closing and "放行後6個月內" where it quotes the FAQ — both correct.
- "No official guidance found" sentences (adjustments decided after year-end, audit-driven changes): all four keep them as "not found", nothing stated as fact — complies with the UNVERIFIED list.
- §36-1 and 辦法 §2 scope (whether §29 III or other amounts must be included), 2021-06-02 press release → 基隆關, 辦法 §7 45 days from the day after receipt/completion of the file, up to 90 days when 國際或國內機構或專家 are consulted, §9 three years from 發文通知 unless changed, ja §6 (hypothetical or not-within-one-year transactions not accepted), §21 and §28 separate regimes: all four — correct. The statement that no ruling on related-party price acceptability or TP method was found is phrased as "not found" in all four.
- 海關緝私條例 §37 I: 「得視情節輕重，處所漏進口稅額五倍以下之罰鍰，或沒入或併沒入其貨物」; 2008 ruling (negligence suffices); June-2023 reference table tiers and both provisos; ja/en worked example (200,000 × 2.5 = 500,000; × 2 = 400,000, labelled as the writer's arithmetic): all correct. §45-3 I(2) and III (before tip-off/investigation, accepted by customs, no post-release audit notified for released goods; interest): all four — correct.
- 營業稅法 §20, §41, FAQ 5% (dated "as of October 2026" in all four), §51 I(7) via 作業手冊 伍十一(二)2 (未經沒入僅處以漏稅罰鍰 → 追繳並處罰): all four — correct.
- §13 (notice within 6 months from the day after release; audit within 2 years; refund/extra duty within 3 years), §98 five years (ko/ja), §42/§75 NT$3,000–30,000 (ja): correct.
- Law versions in every sources section (關稅法 2022-05-11 with §§29–35 unchanged since 2004; 細則 2024-12-23; 緝私條例 2018-05-09; 估價預先審核辦法 2026-01-23; 更正作業辦法 2024-04-10; 營業稅法 2025-05-28; 作業要點 2019-12-31 / 2022-04-22; order 2019-11-15; ruling 2008-12-18; manual 2018-05-22; FAQ postings 2026-07-06 / 2026-07-09; press release 2021-06-02; penalty order 2023-06-20): all verified against the page headers.
- Opening quotes (type ⑥): ko = FAQ Q2 answer, faithful translation; ja = FAQ Q8 answer, faithful (あくまで renders 仍); en = official English of §30 I and I(4), verbatim with ellipsis, "last six words" = "such relationship influences the transaction value" (six words); zh = 細則 §14 III verbatim. All linked to the source.
- Foreign law: ja one line (日本の専門家にご確認ください), en one line (a question for US advisers), ko/zh none — rule 10 satisfied. No tax-agreement statements (rule 11 not engaged).
- Arithmetic: ja April–March fiscal year → application during April (one month after 31 March) — correct and labelled 「（架空の例です）」.

## 2. Citations

Inline links sit right after each claim; every statute link points to the correct single-article URL (pcode/flno checked against the claim); MOF order, 作業要點, ruling and manual links point to the law-out pages; FAQ/press/penalty links point to the customs pages that carry the quoted text. Sources sections list every source used in the body and state the check date (ko 확인일: 2026년 10월 7일 / ja 確認日：2026年10月7日 / en Checked: October 7, 2026 / zh 資料查證日：2026年10月7日). Internal link /{lang}/columns/taiwan-transfer-pricing-documentation-thresholds exists in all four languages per LINKS.md (304) and lint. No batch-4 column linked; board link not used (allowed).

## 3. Rules

No bold/underscore/strong (grep clean). No phone, LINE/Kakao, street address; email wei@hoveringlaw.com.tw once, in one short paragraph before the sources section, naming the firm with the correct name per language. No bookkeeping/filing/audit offer. author: "legal-ai-assistant"; no lawyer/CPA/native-review claim (grep clean). Hypotheticals labelled (ja 架空の例です; ja/en penalty arithmetic labelled). Frontmatter: topic "tax", tags ["tax-accounting"], audience = own language, categories/date_display/read_time per brief, featured_image keeps NNN; seoTitle ≤ 32 chars and different from title (ko 22, ja 20, zh 19); en title + " | Hovering Law" > 60 chars so seoTitle present (41 chars); en summary within 150–160 characters with no forbidden characters (lint OK). FAQ answers (2–3 per language) consistent with the body.

## 4. Voice

- ko: calm 합니다체 throughout; title names the reader's situation and the two issues; first paragraph gives the FAQ answer and the "decided on the day of clearance" point; headings are specific; two reader questions in the body; no AI filler. Tool WARN (77% 니다 endings) is within the register and not a FAIL.
- ja: natural です・ます; opening quote + what it means for a Japanese parent; FY example; sentence endings varied (でしょう/でしょうか/ません/のです). No だ・である mixing.
- en: plain, active; opening quote with the "last six words" hook; no "it is important to note"/"this means"; short sentences present ("That alone does not sink the price." "So how close is close?" "That is as far as it goes." "Import VAT moves too.").
- zh-hant: Taiwan usage (關務署、國稅局、報單、押款放行、文件審核/貨物查驗、復查); no simplified characters or mainland terms (grep clean); not officialese; short sentences ("範圍就到這裡。" "營業稅另計。").

## 5. Sentence variety (tool run on every file)

- ko: cv=0.554 short=12.3% run3=0 opener_rep=0 cite_end=8.8% contrast=0 caveat=0 q=2 — no FAIL.
- ja: cv=0.522 short=10.1% run3=6% opener_rep=0.1 cite_end=10.1% contrast=0 caveat=0 — no FAIL (the tool's q=0 misses two genuine questions in the body: 「どこまで近ければ…でしょうか」「どうなるのでしょうか」).
- en (after edit): cv=0.593 short=15.6% run3=3.2% opener_rep=0.105 cite_end=9.4% contrast=0 caveat=0 q=2 — OK.
- zh-hant: cv=0.654 short=14.6% run3=2.6% opener_rep=0.133 cite_end=7.3% contrast=0 caveat=1 q=2 — OK.
Self-check items 2–7 of SENTENCE-VARIETY-RULE §5: opening is type ⑥ in all four (no 가령/例えば…とします/Suppose/假設); ≥2 very short sentences in each; no three paragraphs starting with the same word; no three consecutive claim-(statute)-caveat paragraphs, and each version has citation-free paragraphs (the "how close is close" and "unflagged entries" paragraphs); contrast templates 0; last body paragraph ends on this column's facts (138/65 codes and the six-month correction window) with no copied disclaimer or sales line. MONOTONY: none.

## Issues (Original → problem & reason → fix → facts preserved)

1. en, body paragraph "So how close is close?":
   Original: "a company importing cars from its parent declared prices more than 20% below the previous year, although the cars came with much better equipment."
   → Problem: the customs FAQ says only 「A公司與其國外供應商為母子關係公司」 — the two are in a parent–subsidiary relationship; it does not say the supplier is the parent. ko/ja/zh keep it neutral (모자회사 사이 / 親子会社の間 / 母子公司間); en over-specified the direction. Minor (no legal meaning or number changes).
   → Fix applied: "an importer buying cars from a supplier in a parent–subsidiary relationship with it declared prices more than 20% below the previous year, although the cars came with much better equipment."
   → Preserved: >20% decrease, upgraded equipment, importer could not show closeness, FAQ conclusion, link, "fact of that example" sentence.

No other issue. Nothing major found in any language.

## Minor edits applied

- drafts/T23/en.md, one sentence in the "how close is close" paragraph (see Issue 1). Lint re-run: OK [1580 words]; variety re-run: OK.
- No edit to ko, ja, zh-hant (lint OK 3482 / 4358 / 2605 chars; variety no FAIL).

## Verification limits (stated, not defects)

- The FAQ attachment (常見問答, cover 109年3月, file dated 2021-09-22) predates the 作業要點's 2022-04-22 amendment; the Q2/Q6/Q7/Q8/Q9/Q13 answers used in the columns are consistent with the current 作業要點 text, and the columns cite the 作業要點 for the procedure itself.
- Whether the penalty reference table was amended again after 2023-06-20 was not re-checked here; the columns use the required wording ("as amended in June 2023" / 2023년 6월 개정 / 2023年6月に改正 / 2023年6月修正).
- The 5% business-tax rate is taken from the customs FAQ (the statute sets a 5–10% band); the columns date it "as of October 2026".

## Image verdict

OK. images/T23.webp: a wooden workbench with a vernier caliper and a small open cardboard box holding a brass machined disc, soft window light. Fits the column (imported parts, measuring value); fictional, no faces, no readable text, no logos, no flags, no documents; respectful and calm.

VERDICT: PASS
