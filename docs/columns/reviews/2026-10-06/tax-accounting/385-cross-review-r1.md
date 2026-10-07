# T26 cross-review r1 — taiwan-cfc-rules-vietnamese-subsidiary-incentives (en, zh-hant)

Reviewer: Lane A cross-reviewer (Claude Fable 5.1). Review date: 2026-10-07. Files reviewed: drafts/T26/en.md (15,668 bytes, last saved 16:25) and drafts/T26/zh-hant.md (12,815 bytes, 16:29); drafts/T26/facts.md and research/R14-T26-statutes.md / R14-T26-official.md read but treated as untrusted; every claim below was checked against the official page I opened myself. Raw fetches are under reviews/T26/cross-sources/ (HTML + extracted .txt, PDFs + pdftotext output, scanned PDFs rendered to PNG).

## Verdict

VERDICT: PASS — both language versions are publishable as they stand (one minor wording edit applied to en, see below). No major issue found: every rate, threshold, date, article number, procedure and condition in both files matches the official text; the UNVERIFIED items from the research notes do not appear as fact; the two language versions agree on the law. Image OK.

## Scope checked — official pages opened on 2026-10-07

Taiwan (law.moj.gov.tw, fetched with fetch_law.py / curl; 法規整編資料截止日 115-09-24 on every page):
- 所得稅法 (G0340003) header: 修正日期 民國 115 年 09 月 11 日 — §5, §43-3, §71 single-article pages → cross-sources/statutes.md
- 所得稅法 沿革 https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=G0340003 → hist-G0340003.txt (entry 62: 105-07-27 增訂 §43-3; 111-01-14 行政院令 §43-3 定自一百十二年度施行; entries 63–71 amend §§5, 14, 17, 88–114-3, 126 etc., none touches §43-3; entry 71 = 115-09-11 §17, §126)
- 營利事業認列受控外國企業所得適用辦法 (G0340145) header: 發布 106-09-22, 修正日期 112-12-21 — §2, §4, §5, §10, §11 → statutes.md
- 辦法 沿革 https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=G0340145 → hist-G0340145.txt (112-12-21 修正發布全文 11 條；並自一百十二年度施行)
- Official English translation https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=G0340145 → eng-G0340145.txt (Amended Date 2023-12-21; §4 II "shall be considered in the determinations under the preceding paragraph"; footer "In case of any discrepancy … the latter [Chinese] shall prevail")
- 2017 條文說明 PDF https://law.moj.gov.tw/LawClass/LawGetFile.ashx?FileId=0000205151&lan=C&type=1&date=20170922 → notes-2017.pdf/.txt (first curl attempt was truncated at 180,224 bytes, exit 56; re-fetched complete: 317,078 bytes, 9 pages, %%EOF present). 第四條 說明二 verbatim: 「部分國家或地區對特定區域或特定類型企業適用特定稅率或稅制，為防杜外國企業藉此規避適用本法第四十三條之三規定，爰於第二項定明該等情形，以該特定稅率或稅制依第一項規定判斷之。」
- 2023 修正條文對照表 PDF https://law.moj.gov.tw/LawClass/LawGetFile.ashx?FileId=0000357504&lan=C&type=1&date=20231221 → notes-2023.pdf/.txt. 第四條 說明: 「二、第二項未修正。三、考量第二項規定之各租稅管轄區對特定區域或特定類型企業提供特定稅率或稅制之態樣繁多，且相關資訊未必對外公開，宜就個案事實判斷，爰修正第三項財政部公告之低稅負區參考名單範疇，不包括第二項所定情形。」
- 財政部 announcement 2026-02-04 https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=2a524cc04d8447b8ab76ecfdfd33ee3c → mof-20260204.txt (發布單位 財政部賦稅署, 發布日期 2026-02-04; 31 jurisdictions under §4 I(1) 法定稅率未逾14%; 48 under §4 I(2); 「三、…依個案事實個別判斷之」; 「僅供參考…應以該國家或地區當時實際情況認定之」)
- Reference list PDF https://www.mof.gov.tw/download/bf1557e5c80a46cbac99ae4ee6c2bfbe → mof-list.pdf/.txt. I counted the codes: table (一) AI MO BB AD BM LI BQ BG BA CY VG XK KY MD BS MK TL PW GG PY HU MH IE VU IM QA JE TC BH AE KG = 31; table (二) BZ DJ BN SV CW GT CD GW FM HN GF KE PF MW FR NA TF NR GE NI GI PA GP SC HK SG SZ RE MY BL MQ MF YT PM NC VC UY ER PS KW BO LY MC SY BW TV CR WF = 48. No 越南 / Viet Nam / VN in either table.
- 財政部賦稅署 CFC 疑義解答 page https://www.dot.gov.tw/singlehtml/ch_450?cntId=cdcd991f1ea34b5da57a87943221f75c → dot-faq.txt (title "…疑義解答(PDF檔)_115.4.7更新"; attachment 「營利事業受控外國企業（CFC）制度疑義解答_1150407更新」) and the PDF https://www.dot.gov.tw/download/e54a91ba324e4562bd1983192501d057 → dot-faq.pdf/dot-faq-pdf.txt (93 pages). Verified Q3 (行政院 111-01-14 院臺財字第 1100041879 號令…自 112 年度施行), Q8 (「現行我國營利事業所得稅稅率為 20%，按該稅率之 70%計算，即指稅率未逾 14%者」; (三) special regimes), Q10 (名單僅供參考…不包括…特定稅率或稅制之情形…仍應以該國家或地區當年度實際稅制情況判斷), Q11 (…而非以境外關係企業之有效稅率判斷), Q17 (同時符合; numerator items 原則應為正數，不得併計非營業損失), Q50 (6-month extension, once), Q51 (evidence examples; note the FAQ says 送達之日起 while 辦法 §10 II says 送達之翌日起 — both columns follow the regulation), Q52 (exempt CFC still disclosed, with documents showing the exemption applies).

Vietnam (chinhphu.vn, curl):
- Law 67/2025/QH15 record https://vanban.chinhphu.vn/?pageid=27160&docid=214607&classid=1&typegroupid=3 → vn-law67-record.txt (Ngày ban hành 14-06-2025; Ngày có hiệu lực 01-10-2025; Cơ quan ban hành Quốc hội). Signed law PDF https://datafiles.chinhphu.vn/cpp/files/vbpq/2025/7/67qh.signed.pdf → vn-law67-signed.pdf (scanned; pages 20–21 rendered to law67-p-20/21.png): closing line "…Kỳ họp thứ 9 thông qua ngày 14 tháng 6 năm 2025"; Art. 19(1) "có hiệu lực thi hành từ ngày 01 tháng 10 năm 2025 và áp dụng từ kỳ tính thuế thu nhập doanh nghiệp năm 2025".
- Consolidated text 113/VBHN-VPQH https://xdcs.cdnchinhphu.vn/446259493575335936/2026/6/4/2026-303-113-vbhn-vpqh-17805650488621806185580.pdf → vn-vbhn113.pdf/.txt (Công báo số 303, 02-06-2026; signature block VĂN PHÒNG QUỐC HỘI, Số: 113/VBHN-VPQH, Hà Nội, ngày 20 tháng 5 năm 2026). Verified Art. 10(1)–(3) (20%; 15% ≤ VND 3 billion; 17% > 3 to ≤ 50 billion), Art. 12(1) (incentives by sector and location), Art. 13(1) (10% for 15 years, new investment projects a–d, e enterprises), Art. 13(4) (17% for 10 years), Art. 14(1) (up to 4 years' exemption + 50% for up to 9 years for Art. 13(1)/(1a) income), Art. 14(2) (2 + 4 for Art. 13(4) income), Art. 18(2) (separate accounting of incentive income), Art. 19(1). The VBHN header's "có hiệu lực kể từ ngày 01 tháng 10 năm 2026" is the misprint the research flagged; Art. 19 of the same text and the signed law say 2025 — the columns use 2025, correctly.
- Resolution 107/2023/QH15 record https://vanban.chinhphu.vn/?pageid=27160&docid=209231 → vn-res107-record.txt (Ngày ban hành 29-11-2023; hiệu lực 01-01-2024); signed PDF https://datafiles.chinhphu.vn/cpp/files/vbpq/2023/12/107-qh15.signed.pdf → vn-res107.pdf (scanned; all 12 pages rendered res107-p-01…12.png). Read: Art. 2(1) (constituent entities of groups with consolidated revenue ≥ EUR 750 million in at least 2 of the 4 preceding fiscal years, with exclusions a–g), Art. 4 QDMTT with 4. "Thuế suất tối thiểu là 15%", Art. 5 IIR (15% minimum), Art. 8(1) (in force 01-01-2024, applied from fiscal year 2024), closing line "thông qua ngày 29 tháng 11 năm 2023".
- Decree 236/2025/NĐ-CP record https://vanban.chinhphu.vn/?docid=215112&pageid=27160 → vn-dec236-record.txt (title: Quy định chi tiết một số điều của Nghị quyết số 107/2023/QH15…; Ngày ban hành 29-08-2025; Ngày có hiệu lực 15-10-2025).

Internal links: LINKS.md lists /en/columns/taiwan-cfc-overseas-subsidiary-tax, /en/columns/vietnamese-companies-taiwan-vietnam-tax-agreement and /zh-hant/columns/taiwan-cfc-overseas-subsidiary-tax — all three slugs used exist in their language. No batch-4 links.

## 1. Law and facts — findings per language

en — every statement checked; all supported:
- §43-3 in force from tax year 2023 by Executive Yuan order of January 14, 2022 ✓ (history entry under 62). Recognition by holding ratio and period, dividend or not ✓ (§43-3 I); later dividend not taxed again within the recognised amount ✓ (§43-3 IV).
- §4 I two tests; 70% of the §5 V(2) rate (20%) ✓; "MOF puts that line at 14%" ✓ (FAQ Q8); statutory not effective rate ✓ (FAQ Q11).
- §4 II quoted verbatim ✓; English "shall be considered" and "Chinese prevails" ✓; 2017 purpose ✓.
- Vietnam: Law 67/2025 adopted 14 June 2025, in force 1 Oct 2025, from the 2025 tax period ✓; consolidated text 113/VBHN-VPQH of 20 May 2026 ✓; table rows 20 / 17 / 15 / 17-for-10 / 10-for-15 / exemption years ✓ (Arts. 10, 13, 14); holidays 4+9 and 2+4 ✓; Art. 12 by sector and location ✓. Arithmetic against 14% (20, 17, 15 above; 10 below; 0 below) ✓ and labelled "arithmetic only".
- MOF 2026-02-04: 31 / 48, Vietnam on neither, reference only, 「依個案事實個別判斷之」 ✓; FAQ Q10 ✓; 2023 comparison-table reason ✓.
- Control ≥ 50% or significant influence ✓ (§2 I: 合計達百分之五十 = 50% or more); Art. 5 exemptions, both limbs, passive income < 10%, NT$7 million with aggregate rule for directly held CFCs without substantive operations ✓; passive-income list ✓; FAQ Q17(4) positive amounts, no netting ✓.
- Filing May 1–31 ✓ (§71 I); §10 I attachments, same reporting period, local or Taiwan qualified accountant, other evidence confirmed by the tax office, one extension ≤ 6 months applied for with reasons before the filing deadline ✓; §10 II one month from the day after service, one extension ≤ 1 month ✓; Q51 examples ✓; Q52 ✓.
- Pillar Two paragraph: Resolution 107 adopted 29 Nov 2023, from fiscal year 2024, QDMTT + IIR, 15%, EUR 750 million in ≥ 2 of 4 preceding years, "with some exclusions" ✓; Decree 236 in force 15 Oct 2025 ✓; "No official Taiwan text addresses how a Vietnamese top-up relates to the CFC low-tax test" — stated as an absence, consistent with the research's UNVERIFIED list ✓.
- Sources section: ITA last amended 2026-09-11, §43-3 unchanged since 2016-07-27 ✓; regulation re-issued 2023-12-21, from tax year 2023 ✓; FAQ updated April 7, 2026 ✓; check date stated ✓.
- UNVERIFIED items: the column does not say whether the 10%/holiday/15%/17% rates are §4 II regimes, nor which rate the test uses; does not say "incentives make it a CFC" or "Vietnam is safe"; no QDMTT effect on the Taiwan test; no Resolution 43/2026, no Art. 4(14a), no decree contents, no Vietnamese dividend withholding, no tax sparing, no verification requirement ✓.

zh-hant — same legal core, checked line by line against the same pages; all supported. Specific points: 「經行政院2022年1月14日令定自112年度施行」 ✓; 疑義解答第8題 「即指稅率未逾14%者」 quoted exactly ✓; §4 II and the 2017 說明 quoted exactly ✓; 2023 對照表 quote 「態樣繁多，且相關資訊未必對外公開，宜就個案事實判斷」 exact ✓; Vietnam dates, table, holidays ✓; 31/48, 越南都不在內 ✓; control and exemptions ✓ (「合計持股達50%」 matches 合計達百分之五十); §71, §10 I/II deadlines ✓ (翌日起, 最長6個月/一個月, 一次為限); Q51/Q52 ✓; Pillar Two 「前四年中至少兩年合併營收達7億5,000萬歐元」, 15%, 2024會計年度, 236號議定 2025年10月15日施行 ✓; sources section ✓ (越南國會辦公廳 = Văn phòng Quốc hội, matching the VBHN signature block). zh-hant FAQ answers consistent with body and sources ✓.

Cross-language: no contradiction on any rate, date, article or condition. Differences are editorial only (en additionally cites FAQ Q17 and the bank-interest example; zh omits those — permitted).

Notes that are not defects (recorded for transparency):
- en "Interest on a plant's bank deposits counts." — not stated verbatim by any official text; it is a plain reading of 辦法 §5 II(2), which lists 利息 without qualification and whose exclusions (overseas branches, self-developed assets, licensed financial institutions) do not reach a manufacturer's deposit interest. Left as is.
- en "Mixed incentive and ordinary income needs a split." — framed as a documentation point; it is also what Vietnamese Art. 18(2) (hạch toán riêng) requires, though the column does not cite that article. No change needed.
- Hard rule 2 (inline link right after the claim): en "The Ministry of Finance (MOF) puts that line at 14%" carries its FAQ link one sentence later in the same paragraph; zh links the FAQ in the same sentence. Acceptable.

## 2. Citations

Inline statute links point to the right single-article pages (G0340003 flno 5 / 43-3 / 71; G0340145 flno 2 / 4 / 5 / 10); explanatory-note PDFs, MOF announcement, list PDF, DOT FAQ page, Vietnamese record pages and the VBHN PDF all open and contain the quoted passages. Both sources sections are complete (every inline source appears) and carry the check date (October 7, 2026 / 2026年10月7日). Internal links exist in both languages (lint OK).

## 3. Rules

No bold (grep for **, __, <b>, <strong>: none — the earlier grep hits were URL digit strings matching a phone-number pattern, not phone numbers). No phone, LINE or Kakao, no street address; one soft contact sentence per language naming the firm and wei@hoveringlaw.com.tw, before the sources section; no offer of bookkeeping, filing or audit services. author: "legal-ai-assistant" in both; no lawyer/CPA/native-review claim. Hypotheticals labelled after the scene ("(an invented example)" / 「（虛構情境）」). Frontmatter per brief: topic "tax", tags ["tax-accounting"], audience = file language, categories, dates, featured_image with literal NNN, 2–3 FAQ items consistent with the body. en: title + " | Hovering Law" = 100 chars → seoTitle present (43 chars, within 30–45); summary 156 characters, no forbidden characters, no ellipsis. zh seoTitle 21 chars (≤ 32) and differs from the title. lint.py OK for both files (en 1,580 words within 1,100–1,600; zh 2,667 chars within 1,800–2,700).

## 4. Voice

en: plain, active, practitioner-to-reader; the title names the subject and the point (case-by-case test) without clickbait or imperative; the opening scene is specific and the second paragraph delivers the three-part structure of the test. Headings are column-specific ("The 14% line and the clause on special regimes", "From the Vietnamese ledger to the Taiwan return"). No AI filler, no checklist headings, no copied disclaimer; the last paragraph returns to the scene's three documents and the rule each belongs to.
zh-hant: natural Taiwan usage throughout (國稅局/稽徵機關, 營所稅, 結算申報, 查核簽證, 會計師, 交差, 照樣要報); no simplified characters or mainland terms found by scan or reading; 應/須/得 kept where the regulation uses them; the opening line of dialogue plus scene reads naturally and the closing 「回到那封來信…」 ties back to the facts.

## 5. Sentence variety

Tool results (python3 shared/variety/variety_metrics.py check, after my edit):
- en: sentences=81 mean=17.8 cv=0.564 short=0.198 run3=0.025 opener_rep=0.05 cite_end=0.025 cite_para=0.5 contrast=0 caveat=0 q=3 — OK, no FAIL.
- zh-hant: sentences=56 mean=38.8 cv=0.557 short=0.107 run3=0.037 opener_rep=0.158 cite_end=0.054 cite_para=0.526 contrast=0 caveat=0 q=3 — OK, no FAIL.
Section-5 self-check: opening type ③ scene as assigned, no stock opener (first sentences "Late March in Bắc Ninh." / 「「連廠房租約都要？」」); ≥ 2 very short sentences in each; no three paragraphs start with the same word (max 2: en "That", zh 低/越/優); no claim-(statute)-caveat run (caveat=0) and several uncited paragraphs (scene, the open question, the closing); contrast templates 0; last paragraph ends on the column's facts; no copied disclaimer or sales line. No MONOTONY finding.

## 6. Image — images/T26.webp

A single white warehouse-style factory building at dawn beside flooded rice paddies, no people, no faces, no text, no logos, no flags, no readable documents; fictional and unidentifiable; calm and respectful; fits a column about a Vietnamese manufacturing subsidiary. Image verdict: OK.

## Issues (Original → problem & reason → fix → facts preserved)

1. en, opening paragraph: "Then the parent's tax department in Taipei sends a list: audited statements …" → the closing paragraph refers back to "each line of the Taipei email", so the opening should establish an email (zh already uses 來信 in both places) → fix applied: "sends a list" → "emails a list" → facts preserved: same four documents, same May deadline, hypothetical label unchanged; lint OK, variety OK after the edit.

No major issues. No required fixes outstanding.

## Minor edits applied

- drafts/T26/en.md line 27: "sends a list" → "emails a list". Re-ran `python3 lint.py drafts/T26/en.md en taiwan-cfc-rules-vietnamese-subsidiary-incentives` → OK [length 1580 words]; variety check → OK. zh-hant.md not edited (lint OK, variety OK).

## Image verdict

OK.

VERDICT: PASS
