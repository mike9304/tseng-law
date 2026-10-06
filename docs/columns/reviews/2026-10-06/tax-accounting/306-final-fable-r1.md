# T6 final accuracy review (Claude Fable 5.1) — vietnamese-companies-taiwan-vietnam-tax-agreement (en, zh-hant)

Review date: 2026-10-06 (KST). Reviewer did not write the column. Fact sheet and research files were treated as untrusted; every claim below was checked against the official page I opened myself, saved under reviews/T6/sources/.

## Verdict

PASS — both language versions are publishable now; image OK. No major issue found. Six minor edits applied (citation completions and one wording alignment with the agreement text); lint and variety checks re-run and OK after the edits.

## Scope checked — official pages opened on 2026-10-06 (saved copies in reviews/T6/sources/)

| Source | URL | Saved as | What I verified |
|---|---|---|---|
| Taiwan–Vietnam agreement, English text (MOF PDF, 18 pp.) | https://www.mof.gov.tw/download/66dc13da4e8449698e42d6b818549c52 | vn-agreement-en.pdf / .txt | Full read: title, Art. 4(1), 5(1)–(6), 7(1), 10(2)(4), 11(2)(4)(6), 12(2)(3)(4)(6), 15(2), 23(1)(5), 25(1), 27, signing clause |
| Taiwan–Vietnam agreement, Chinese translation (MOF PDF, 18 pp.) | https://www.mof.gov.tw/download/6b9255566aab4b9084c085ddc921138e | vn-agreement-zh.pdf / .txt | Full read: 「（中譯本）」 title, 第5條「固定營業場所」 heading, 第7、10、11、12、15、23、27條, signing clause |
| Taiwan–Japan agreement, English text | https://www.mof.gov.tw/download/10462 | jp-agreement-en.pdf / .txt | Art. 5(3)(b) services clause, "more than 183 days in any twelve-month period commencing or ending in the taxable year concerned" |
| Taiwan–Korea agreement, consolidated English text | https://www.mof.gov.tw/download/9679b16a87cd418ca479db4f947a588e | kr-agreement-en.pdf / .txt | Art. 5(3)(b) services clause, "more than 183 days in any twelve-month period" |
| MOF 我國所得稅協定一覽表 | https://www.mof.gov.tw/singlehtml/191?cntId=63930 | mof-list.html / .txt | Row 「越南* / Vietnam*」 1998/04/06 signed, 1998/05/06 effective; footer 發布日期 2026-09-04, 更新日期 2026-09-04 |
| 所得稅法 §3, §8, §92, §114 (law.moj.gov.tw, 修正日期 民國115年09月11日) | https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=8 (and flno=3, 92, 114) | ita.md | §8(3) 90-day rule; §92(2) 10-day payment and filing; §114(1) penalties |
| 所得稅法 沿革 | https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=G0340003 | ita-history.html / .txt | Entry 69: 2024-08-07 amendment of §§88, 89, 92, 114…, 行政院令定自 114-01-01 施行; entry 71: 2026-09-11 amended §17 (and §126) only |
| 各類所得扣繳率標準 §3, §4, §14 (修正日期 民國110年06月30日) | https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=3 (and flno=4, 14) | wrs.md | §3(4) interest 20%/15%, §3(5) rent 20%, §3(6) royalties 20%, §3(10) other income 20%; §4 dividends 21% |
| 適用所得稅協定查核準則 §5, §7, §8, §14, §23, §25, §34 (修正日期 民國114年04月08日) | https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340125&flno=5 (and flno=7, 8, 14, 23, 25, 34) | reg.md | Residence certificate; fixed-place PE 3 conditions; construction period count; software/know-how royalty test; business-profit approval route; cap-rate withholding documents; 10-year refund window and 5-year transitional rule |
| 所得稅法第八條規定中華民國來源所得認定原則 (修正日期 民國112年10月13日, 台財稅字第11204568350號令) | https://law-out.mof.gov.tw/LawContent.aspx?id=FL050237 | src-principles.html / .txt | Point 2 (branch remittance excluded from dividends); point 4 paras 1–4 (services wholly abroad, participation = equipment/manpower/know-how, e-services deemed in Taiwan) |
| MOF ruling 台財稅第7586738號 (公發布日 民國76年03月09日) | https://law-out.mof.gov.tw/LawContent.aspx?id=GL002917 | branch-ruling.html / .txt | 主旨: branch profits part of head office's; pays 營所稅 under ITA §3(3); no distribution question; branch need not withhold |
| law.moj.gov.tw/ENG title pages | https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=G0340125 (and G0340003, G0340028) | eng-reg / eng-ita / eng-wrs .html/.txt | Official English titles and Amended Dates 2025-04-08 / 2026-09-11 / 2021-06-30 |

Also run: `python3 lint.py` (en, zh-hant) and `python3 shared/variety/variety_metrics.py check` (en, zh-hant) before and after edits — all OK. Hero image images/T6.webp opened.

## 1. Law and facts — result per claim (both languages unless noted)

All of the following were confirmed verbatim against the saved sources; nothing unsupported, outdated or mixed up was found.

- Agreement title, parties, signed at Hanoi 06 April 1998 in English; Chinese is a translation — EN text closing clause; ZH 「本協定於中華民國八十七年四月六日…在河內簽署英文本二份」, title suffix 「（中譯本）」.
- Art. 27: in force 30 days after signature; withholding taxes for amounts paid or credited from the first day of the month next following entry into force — matches. MOF list effective date 1998/05/06 and page date 2026-09-04 — matches. (Drafts correctly do not print a computed application start date.)
- Art. 4(1) resident = resident under that Party's tax law — matches. 查核準則 §5(2) residence certificate — matches.
- Domestic rates (扣繳率標準, last amended 2021-06-30; §14 confirms no later amendment): dividends 21% (§4), interest 20% with 15% for short-term bills / securitization certificates / government, corporate, financial bonds / repos (§3(4)), rent 20% (§3(5)), royalties 20% (§3(6)), other income of a foreign enterprise with no FPB and no business agent 20% (§3(10)) — all match.
- Agreement caps: dividends 15% (Art. 10(2)), interest 10% (Art. 11(2)), royalties 15% (Art. 12(2)), each conditioned on the recipient being the beneficial owner — match. Art. 10 contains no shareholding threshold (full article read) — the 5%/100% illustration is correct.
- Art. 12(3) royalties include use of industrial, commercial or scientific equipment — matches. Arts. 10(4)/11(4)/12(4) effectively-connected exclusion — matches (text refers to Art. 7 or Art. 14; drafts' "business-profits article"/「第7條」 is a fair simplification for a company). Arts. 11(6)/12(6) arm's-length limit — match.
- 查核準則 §14 software and know-how tests — match verbatim.
- Art. 7(1) business profits / attribution — matches. Art. 5(1), 5(2)(b)(c)(d), 5(2)(g) six-month construction/assembly/installation/supervisory threshold — match (the EN original's "project of supervisory activities" typo is correctly read as "or", consistent with the Chinese 「或與上述有關之指導監督活動」).
- No service-PE clause in the Vietnam text: confirmed by full read and text search — the only "183" is in Art. 15(2)(a). Japan and Korea Art. 5(3)(b) 183-day clauses confirmed (EN only).
- 查核準則 §8(1) counting rule incl. preparatory work, seasonal/temporary stoppages, subcontract periods — matches. §7(2) three cumulative conditions — matches. Art. 5(4) dependent agent / 5(5) independent agent — match.
- 查核準則 §23(1) approval route and documents; office notifies the withholding agent — matches.
- Source-income principles point 4 (services wholly abroad not Taiwan-source absent FPB/agent participation; Taiwan participation = equipment, manpower, know-how or technology; e-services deemed performed in Taiwan), last amended 2023-10-13 — matches.
- Art. 15(2)(a)(b)(c) three cumulative conditions, 183 days in the calendar year — matches. ITA §8(3) 90-day domestic rule (EN only) — matches.
- 查核準則 §25(1)(2)(4) cap-rate withholding, residence certificate + beneficial-owner proof, agent cites the article, licence contract with Chinese translation — matches.
- ITA §92(2) 10-day deadline; in force since 2025-01-01 (沿革 entry 69 + 行政院令) — matches. §114(1) up to 1× / up to 3× — matches.
- 查核準則 §34(1) recipient or withholding agent, within 10 years from payment, to the office that received the withholding return; §34(3) transitional 5-year rule at the 2025-04-08 amendment — matches.
- Art. 25(1) MAP within three years of first notification, to the competent authority of the state of residence (EN only) — matches.
- Art. 23(1) Vietnam-side credit, capped at Vietnamese tax on that income — matches (EN wording aligned, see edit 1). Tax sparing (Art. 23(2)(4)(5)) correctly left out.
- Ruling 台財稅第7586738號 (1987-03-09) and source principles point 2 on branches — match.
- Arithmetic: none beyond rate comparisons; 06 April + 30 days = 06 May 1998 consistent with MOF list.
- Foreign law: only "a Vietnamese tax adviser can confirm" / 「宜向越南的稅務顧問確認」 — general caution only. No Korean/Japanese/US law asserted.
- Cross-language: identical rates, thresholds, dates and conditions in en and zh-hant; no contradiction. Per-language extras (EN: Japan/Korea comparison, ITA §8(3), MAP; zh: none) are additions, not conflicts.
- Time-sensitive facts carry dates: table "(October 2026)" / 「2026年10月現行」; amendment dates on every statute; "since January 1, 2025" / 「2025年1月1日起施行」; "April 8, 2025" / 「2025年4月8日修正」.

## 2. Citations

- Statute links: every law.moj.gov.tw link points to the article it supports (ITA 8/92/114; 扣繳率標準 3/4; 查核準則 5/7/8/14/23/25/34). Agreement links point to the MOF English text and Chinese translation; Japan/Korea links to the MOF English texts.
- Sources sections complete with check date (EN "Checked: October 6, 2026"; zh 「確認日期：2026年10月6日」). Amendment dates listed match the official pages.
- Internal link /en/columns/taiwan-company-subsidiary-vs-branch and /zh-hant/columns/taiwan-company-subsidiary-vs-branch exist (LINKS.md; lint existence check OK).
- Three places lacked an inline link at the point of the claim (fixed, see minor edits): zh ruling 台財稅第7586738號函 (no link anywhere in the zh body), §3(10) 20% claim (both languages), source principles point 2 (both languages).

## 3. Rules

No bold; no phone; no street address; email only (wei@hoveringlaw.com.tw once, soft paragraph before the sources); no bookkeeping/filing/audit offer; author legal-ai-assistant; no lawyer/CPA/native-review claim; hypotheticals labelled after the scene ("(an invented example)" / 「（虛構情境）」); frontmatter per brief (topic tax, tags ["tax-accounting"], audience = file language, EN title > 60 with " | Hovering Law" so seoTitle present at 42 chars, EN summary 150–160 chars, zh seoTitle 18 chars and different from title, FAQ 3 items consistent with body). Lint OK both files.

## 4. Voice

- EN: plain, active; title specific, not imperative; opening scene delivers the three payment types immediately; natural subheads; short sentences present ("Three payments, three different answers." "Services get no separate rule." "Five months in Taichung stays under that line."); one reader question; no "delve/navigate/important to note"; contrast templates 0.
- zh-hant: Taiwan usage throughout (國稅局、稽徵機關、扣繳義務人、營利事業所得稅、軟體、資訊、產線、技師); no mainland vocabulary or simplified characters (lint); good note that the 中譯本 says 「固定營業場所」 while the 查核準則 says 「常設機構」; short sentences ("四筆錢，扣法都不一樣。" "時間很短。" "差別在哪？" "股利只發生在子公司。"); no 官腔 stacking of 應/必須; no 本文將帶您了解 / 值得注意的是.
- Last paragraphs in both languages end on this column's facts (residence certificate / six-month site job) with one short contact sentence; no copied disclaimer or sales line.

## 5. Sentence variety

variety_metrics.py: EN sentences=68 cv=0.59 short=0.221 run3=0.061 opener_rep=0.136 cite_end=0.044 contrast=0 q=1 — OK; zh-hant sentences=47 cv=0.65 short=0.106 run3=0.0 opener_rep=0.053 cite_end=0.128 contrast=0 q=1 — OK. Self-check items 2–7 (SENTENCE-VARIETY-RULE §5) all met in both files: no stock opener (scene + label, type ③ as assigned), ≥2 very short sentences, no paragraph-start word used 3×, no 3 consecutive claim-statute-caveat paragraphs and citation-free paragraphs exist, contrast ≤3, factual ending. No MONOTONY finding.

## Issues (Original → problem & reason → fix → facts preserved)

1. EN, "Vietnam's side" paragraph — Original: "Taiwan tax paid in accordance with the agreement may be credited against the Vietnamese tax on that income, up to the Vietnamese tax on it computed under Vietnamese law." → Minor imprecision: Art. 23(1) (vn-agreement-en.txt) reads "tax payable in [Taiwan] on that income in accordance with the provisions of this Agreement may be credited against the tax levied in [Vietnam] on that resident. The amount of credit, however, shall not exceed the amount of the tax in [Vietnam] on that income computed in accordance with its tax laws and regulations." The credit is against tax on the resident; the cap is tax on that income (zh already had this right). → Fix applied: "Taiwan tax payable in accordance with the agreement may be credited against the Vietnamese tax levied on that resident, up to the Vietnamese tax on that income computed under Vietnamese law." → Facts preserved: same article, same cap, still stated as the agreement's text with the adviser caution unchanged.
2. zh-hant, branch paragraph — Original: 「依財政部76年（1987年）3月9日台財稅第7586738號函」 with no inline link anywhere in the body (only in the sources list). → Brief rule 2 requires the link right after the claim; EN already links it. → Fix applied: linked the ruling number to https://law-out.mof.gov.tw/LawContent.aspx?id=GL002917 (page opened, saved as branch-ruling.html). → Facts preserved: text unchanged.
3. Both, 20% service-fee withholding — Original: "(item 10 of Article 3 of the withholding standards)" / 「（扣繳率標準第3條第10款）」 unlinked at that spot (Art. 3 linked only in the table paragraph). → Key rate readers act on; inline link added to https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=3. → Facts preserved.
4. Both, source principles point 2 — Original: "source-income principles, point 2" / 「來源所得認定原則第2點」 unlinked at that spot (principles linked earlier for point 4). → Inline link added to https://law-out.mof.gov.tw/LawContent.aspx?id=FL050237. → Facts preserved.

No major issue. Observations not requiring change: (a) both drafts say the domestic rates in the table are "those for a foreign company with no fixed place of business" — true for §3; §4 (dividends 21%) applies to any foreign-headquartered company, so the statement is narrower than §4 but not wrong for the Vietnamese parent in the scene; (b) EN "business-profits article" for the effectively-connected case omits Art. 14 (independent personal services), which cannot apply to a company — acceptable.

## Minor edits applied (verified by re-running lint and variety after edits)

- en.md: Art. 23(1) sentence reworded as in issue 1 (+2 words; body now 1,585 words, limit 1,600).
- en.md: inline link added for §3 item 10 (issue 3).
- en.md: inline link added for source-income principles point 2 (issue 4).
- zh-hant.md: inline link added for 台財稅第7586738號函 (issue 2).
- zh-hant.md: inline link added for 扣繳率標準第3條第10款 (issue 3).
- zh-hant.md: inline link added for 來源所得認定原則第2點 (issue 4). Body now 2,688 chars, limit 2,700.
- lint: OK / OK. variety: OK / OK. No numbers, conditions, citations or hypothetical labels changed.

## Image verdict

images/T6.webp: OK. A misty river or delta at dawn with three cargo barges, a reed bank and wooded hills; no faces, text, logos, flags or readable documents; fictional and unidentifiable; calm and respectful; fits a column about a Vietnamese company's cross-border income from Taiwan.
