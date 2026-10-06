# T1 final review — taiwan-subsidiary-corporate-income-tax-calendar (ko · ja · en · zh-hant)

Reviewer: Claude Fable 5.1 (final gate). Date: 2026-10-06. Files reviewed: drafts/T1/{ko,ja,en,zh-hant}.md at their 17:28–17:34 state, plus drafts/T1/facts.md, research/R1-statutes.md, research/R1-official.md, research/T1-added.md (all treated as untrusted and re-verified against the official pages listed below), images/T1.webp.

## Verdict

PASS — all four languages publishable now; image OK. No major (law/fact/citation/rule) issue found. Four minor wording edits applied (section "Minor edits applied"); lint and variety metrics re-run and OK after the edits.

## Scope checked — official pages I opened myself on 2026-10-06

Everything fetched is saved under reviews/T1/sources/ (raw HTML/PDF plus a `.txt` text extraction; statutes verbatim in `statutes.md` via fetch_law.py).

Statutes (law.moj.gov.tw, LawSingle pages; law headers from LawAll/LawHistory):
- 所得稅法 (pcode G0340003) — header 修正日期 民國115年09月11日 (= 2026-09-11); LawHistory entry 71: 2026-09-11 amendment covers §17 and §126 only (`moj-G0340003-history.html`). Articles opened: §4-1, §5, §23, §39, §40, §66-9, §67, §68, §69, §71, §74, §88, §101, §102-2 (`statutes.md`).
- 所得基本稅額條例 (pcode G0340115) — header 修正日期 民國110年01月27日 (= 2021-01-27) (`moj-G0340115-all.html`). Articles opened: §3, §7, §8 (`statutes.md`).

MOF site (www.mof.gov.tw):
- 財政部賦稅署 2026-04-19 「114年度所得稅結算申報期間為115年5月1日至6月1日」 cntId=7a895732… (`mof-2026-04-19-deadline.html`)
- 財政部賦稅署 2026-04-23 「114年度所得稅結算申報記者座談會資料大綱」 cntId=de53a9ac… and the attached PDF download/738ec96d… (`mof-2026-04-23-briefing-page.html`, `mof-2026-04-23-briefing.pdf` + `.txt` via pdftotext)
- 財政部中區國稅局 2026-05-08 「115年度營利事業計算基本稅額時基本所得額應扣除之金額」 cntId=778207cd… (`mof-2026-05-08-central-amt.html`)
- 財政部臺北國稅局 2026-06-08 「會計師代理114年度營利事業所得稅結算申報查核簽證報告書應於115年6月30日前送交國稅局」 cntId=6bbbee3b… (`mof-2026-06-08-taipei-cpa.html`)
- 財政部南區國稅局 2026-08-13 「115年度營所稅暫繳申報自9月1日開跑，符合條件者可免報、免繳！」 cntId=6b982a74… (`mof-2026-08-13-southern-provisional.html`)
- 財政部賦稅署 2024-08-28 「財政部預告修正「營利事業所得基本稅額之徵收率」草案」 cntId=86ec4803… (`mof-2024-08-28-amt-draft.html`)

財政部稅務入口網 (www.etax.nat.gov.tw) FAQ:
- 2006 (更新日期 113-08-01) `etax-faq-2006.html`
- 2712 (更新日期 106-03-22) `etax-faq-2712.html`
- 2808 (更新日期 114-04-22) `etax-faq-2808.html` (ja only)
- 2814 (更新日期 115-04-27) `etax-faq-2814.html`

Korea (ko only): 국가법령정보센터 법인세법 제60조 — page header 「법인세법 [시행 2026. 1. 1.] [법률 제21217호, 2025. 12. 23., 일부개정]」 (`kr-corporate-tax-act-60.html` is the iframe shell; article text in `kr-corporate-tax-act-60-frame.html`).

Not opened (not needed): eTax FAQ 2716 and MOF ruling 91.10.30 台財稅字第0910456521號令 — the drafts do not cite them; the facts they would support (NT$2,000 / new-business exemption; branch exemption) are carried by the 2026-08-13 release and FAQ 2814, which I did open.

## 1. Law and facts — claim-by-claim result (all four languages unless noted)

| Claim in the drafts | Official text (opened) | Result |
|---|---|---|
| ≤ NT$120,000 taxable income: no CIT; above: 20% on the whole, tax ≤ half of the excess over 120,000; 18%/19% only TY2018/2019 | 所得稅法 §5 V 一、二、三（一）107年度18%（二）108年度19% | correct |
| ko example 150,000 → 20% = 30,000; cap 15,000 → tax 15,000 | arithmetic from §5 V | correct, labelled as a calculation example |
| en: cap stops mattering from NT$200,000 | 0.2×200,000 = 40,000 = 0.5×80,000 | correct after edit (see M2) |
| Annual return May 1–31 for the prior year; balance = annual tax − provisional tax − unused withholding credits, self-paid before filing | §71 I | correct |
| TY2025 (114年度) deadline moved to 2026-06-01 because May 31 was a 假日 | MOF 2026-04-19 「申報截止日原為5月31日，遇假日順延至6月1日」 | correct (2026-05-31 is a Sunday) |
| TY2025 AMT return and TY2024 undistributed-earnings return also closed 2026-06-01 | PDF p.1 「個人及營利事業辦理114年度所得稅結算申報、所得基本稅額申報，營利事業辦理113年度未分配盈餘申報…均至本年6月1日(5月31日適逢假日)截止」 | correct; attribution 財政部(賦稅署) matches 發布單位 |
| 10-year loss carryforward: company-form, complete books, loss year and deduction year both blue return or CPA certification, filed on time | §39 I 但書 | correct |
| CPA report not uploaded on time → treated as ordinary return, no §39 offset | 臺北國稅局 2026-06-08 「均屬會計師查核簽證報告書檔案未如期完成上傳…視同普通申報，無法適用所得稅法第39條盈虧互抵之規定」 | correct |
| Provisional payment Sep 1–30, ½ of prior-year annual-return tax, self-paid, return filed | §67 I | correct |
| No return needed if paid without offsetting investment credits / administrative-remedy held-over credits / withholding credits | §67 II | correct (ja says 「投資税額控除や源泉徴収税額など」 — covered by など) |
| Alternative: company-form, complete books, blue return or CPA certification, on-time provisional filing → first-6-months revenue, current-year rate | §67 III | correct |
| Exempt: no tax payable last year or newly opened this year; computed amount ≤ NT$2,000 | 南區國稅局 2026-08-13 (四)(六); §69 I(6) cited alongside in ko/en | correct |
| Missed September: by Oct 31 → daily interest from Oct 1 to payment date; after Oct 31 → office computes, adds one month's interest, pay within 15 days | §68 I, II | correct (body and FAQs in all four) |
| 5% surtax from TY2018; 10% TY1998–2017 | §66-9 I (八十七至一百零六年度10%; 一百零七年度起5%) | correct |
| Definition of 未分配盈餘 (after-tax net income per financial-reporting rules + other net-gain items − prior-loss coverage, dividends from the year's earnings, legal reserve, net-loss items …) | §66-9 II 一、二、三、七 | correct |
| Deductions count only if actually occurring by the end of the following fiscal year → 2025 earnings must be distributed by 2026-12-31 | §66-9 III | correct |
| zh: CPA-audited statements → CPA's figures govern | §66-9 IV | correct |
| Surtax return in May of the year after the year the income year's annual return was filed → TY2025 earnings: May 2027; file even if zero/negative | §102-2 I | correct |
| Branch of a foreign company (總機構在境外) excluded from the computation and return | eTax FAQ 2814 1.(1) | correct |
| Dividends to the parent carry separate Taiwan withholding (no rate stated) | §88 I(1) | correct, within T2 differentiation |
| AMT: basic income − deduction, × Executive Yuan rate, statutory range 12–15% | 所得基本稅額條例 §8 I | correct |
| TY2026 deduction NT$600,000; current rate 12%; pay the difference when regular tax < basic tax | 中區國稅局 2026-05-08 「115年度…扣除60萬元後，按行政院訂定之稅率（現行徵收率為12%）」 | correct |
| Out of scope: no investment credit AND no §7 I income (§3 I(7)); basic income ≤ deduction (§3 I(9), ko/en) | §3 I 七、九; 2026-05-08 release 「60萬元以下者，免依…繳納」 | correct |
| §7 add-backs include securities gains suspended under ITA §4-1 and science-park exempt income | §7 I 一、六; ITA §4-1 | correct |
| MOF 2024-08-28 draft: 15% from TY2025 for groups with consolidated revenue reaching EUR 750m in any 2 of the prior 4 FYs; referred to OECD Pillar Two (en) | 2024-08-28 release 一、二 and 「參酌前開OECD第二支柱規範」 | correct; all four state it as a draft/予告 only, no adoption claim either way (topic brief rule honoured) |
| Fiscal year Jan 1–Dec 31; change only on 原有習慣 or 營業季節之特殊情形 with tax-office approval | §23 | correct (ja's remark that the statute does not say whether aligning with the parent qualifies is a fair reading, no claim about practice) |
| Deadlines for a changed year computed by analogy; July-year example: annual return November, provisional payment March | §101; FAQ 2006; FAQ 2712 | correct; no April–March months invented (topic brief) |
| ja: special fiscal year → undistributed-earnings return within the 5th month after year-end for the year before | FAQ 2808 2. | correct |
| ja: on change, file pre-change period within 1 month and pay, computed per §40 (annualise, apply rate, scale back) | §74; §40 I | correct |
| ja: pre-change unsurtaxed earnings roll into the post-change year | §102-2 III | correct; ja omits the rate because the statute text still says 百分之十 — right call |
| ko: Korean domestic corporation files within 3 months from the end of the month containing FY-end (4 months with 성실신고확인서) → March for a December year-end | 법인세법 §60 ① (law.go.kr) | correct; followed by "한국 세무 전문가와 확인" — general note only |
| ja/en: home-country treatment deferred to 税理士 / US tax adviser | — | general caution only, as required |
| Sources list: 所得稅法 last amended 2026-09-11; 所得基本稅額條例 2021-01-27 | MOJ headers | correct |

Cross-language: rates, thresholds, dates, article numbers and conclusions agree across ko/ja/en/zh-hant. Every time-sensitive figure carries its tax year or "as of 2026-10-06".

## 2. Citations

- Inline links follow each claim; every statute link is the LawSingle URL for the article actually relied on (pcode G0340003 / G0340115, flno checked one by one).
- MOF / NTB / eTax links resolve to the pages whose text supports the sentence (table above).
- Sources sections: all inline sources appear in the list in each language; check date 2026-10-06 present in each.
- Internal links: `/{lang}/columns/taiwan-company-subsidiary-vs-branch` exists in all four languages (LINKS.md; lint existence check OK). No links to other batch columns.

## 3. Rules

No bold, no phone number, no street address, email-only contact once near the end, firm named per brief, no bookkeeping/filing/audit offer (each contact line asks only for legal review of dividend timing / fiscal-year change), author legal-ai-assistant, no lawyer/CPA/native-review claim, hypothetical calculations labelled (ko 「조문을 그대로 적용한 계산 예입니다」, en "a simple calculation from the article, not an official example"), no client stories. Frontmatter: topic tax, tags ["tax-accounting"], audience = file language, seoTitle ≤ 32 and ≠ title (ko/ja/zh-hant), en title + " | Hovering Law" > 60 so seoTitle present (40 chars), en summary 160 chars after edit with no forbidden characters. lint.py: OK for all four.

## 4. Voice

- ko: 합니다체 throughout; opening is a concrete fact (two payment months), Korean-HQ angle (3월 신고 vs 5월·9월) delivered in paragraph 2; natural subheads. One terminology fix (M3).
- ja: です・ます throughout (variety tool reports no register mix; its "77% desu-masu" line is a WARN, not a FAIL); opening is a fact; the April–March question is handled honestly (no invented months). One terminology fix (M4).
- en: plain, active; opening states the rate and the two dates; US side only as a caution. Summary clarified (M1), boundary wording tightened (M2).
- zh-hant: Taiwan usage (國稅局、營所稅、未分配盈餘、扣繳、會計師查核簽證、記者座談會); lint found no mainland vocabulary or simplified characters; one small table for the real three-date sequence.
- Titles are specific, not imperative or formulaic; first paragraphs carry information; no checklist headings; no copied disclaimer or sales closer — each last paragraph ends on the two remaining 2026 dates.

## 5. Sentence variety

`variety_metrics.py check` after edits: ko OK (cv 0.465, short 8.3%, contrast 0), ja OK with WARN only (cv 0.478, short 12.1%), en OK (cv 0.52, short 17.2%), zh-hant OK (cv 0.519, short 9.3%). Self-check items 2–7: no stock opener; ≥2 very short sentences in each; no three paragraphs starting with the same word; no three consecutive claim-(statute)-caveat paragraphs and each file has citation-free paragraphs; contrast templates 0; last paragraph ends on the column's facts. No MONOTONY finding.

## Issues (Original → problem & reason → fix → facts preserved)

All four are minor; no major issue.

M1 (en, frontmatter summary) — "…files its income tax return in May and prepays in September at a 20% rate, and may owe 5% on undistributed earnings and a minimum tax." → "prepays in September at a 20% rate" reads as if the September payment were computed at 20%; the prepayment is half of last year's tax (§67 I). → Applied: "A Taiwan subsidiary files its 20% income tax return in May, prepays half of last year's tax in September, and may owe 5% on retained earnings and a minimum tax." (160 chars, lint OK). → 20%, May, September, ½, 5%, minimum tax all kept.

M2 (en, §5 paragraph) — "From NT$200,000 of taxable income upward, the flat 20% is already the smaller figure" → at exactly NT$200,000 the two figures are equal (40,000 = 40,000), so "smaller" is wrong at the boundary. → Applied: "From NT$200,000 of taxable income upward, the cap no longer reduces the tax and the flat 20% applies in full" (label "a simple calculation from the article, not an official example" kept). → threshold and label unchanged.

M3 (ko, term) — 「최저세」 (summary, FAQ 3 question, body ×2, heading, sources ×2) → 「최저세」 is not the Korean term and reads as "lowest tax"; Korean practitioners call an alternative minimum tax 「최저한세」. → Applied: 최저세 → 최저한세 everywhere (6 occurrences; the Chinese gloss 所得基本稅額 kept). → no number, article or link changed.

M4 (ja, paragraph 1) — 「予定納税にあたる暫繳（暫定納付）は9月です。」 → 予定納税 is the individual income-tax term; for a corporate finance reader the analogue of 暫繳 is 中間納付（予定申告）. → Applied: 「中間納付にあたる暫繳（暫定納付）は9月です。」 → September and the 暫繳 gloss kept.

Noted, not changed (judged acceptable): en "May 31 fell on a holiday" mirrors the official 「遇假日」 (the day was a Sunday); ja title uses the Taiwanese term 暫繳, which the first paragraph glosses; ko/en cite §69 next to the 2026-08-13 release for the NT$2,000 and new-business exemptions — those rest on MOF determinations under §69 I(6), and the release is the operative source, so the pairing is fair.

## Minor edits applied (lint re-run OK after each)

1. drafts/T1/en.md line 4 — summary rewritten (M1).
2. drafts/T1/en.md line 35 — cap sentence (M2).
3. drafts/T1/ko.md — 최저세 → 최저한세, 6 occurrences in lines 4, 19, 41, 65, 85 (M3).
4. drafts/T1/ja.md line 27 — 予定納税 → 中間納付 (M4).

Post-edit checks: `python3 lint.py drafts/T1/<lang>.md <lang> taiwan-subsidiary-corporate-income-tax-calendar` → OK ×4 (ko 2,877 chars, ja 3,268 chars, en 1,379 words, zh-hant 2,199 chars); `variety_metrics.py check` → OK ×3, ja WARN only.

## Image verdict

OK. images/T1.webp shows a glass-fronted office building behind a row of young trees and an empty paved forecourt in soft daylight: fictional, no people or faces, no readable text, logos, flags or documents; calm and respectful; fits a column about a subsidiary's corporate tax calendar.

## Verification limits

- Statute and MOF/eTax texts were read as fetched on 2026-10-06; the MOJ database's integration cut-off shown on the pages is 民國115年09月24日.
- I did not look for post-2026-05-08 Executive Yuan action on the 15% AMT draft beyond what the drafts claim; the drafts make no claim either way, as the topic brief requires.
- Naturalness of ja and zh-hant was judged by me, a model, not by a native reviewer; nothing in the columns claims otherwise.
