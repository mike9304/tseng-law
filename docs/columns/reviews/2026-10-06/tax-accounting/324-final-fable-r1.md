# T10 final accuracy review — Claude Fable 5.1 — r1 — 2026-10-06 (KST)

Column: taiwan-industrial-innovation-act-rd-investment-tax-credits (ko, ja, en, zh-hant)
Files reviewed: drafts/T10/ko.md, ja.md, en.md, zh-hant.md; drafts/T10/facts.md (writer's sheet, not trusted); research/R5-statutes.md, R5-official.md, R1-official.md (O9), R1-statutes.md (ITA §66-9), T10-extra.md; topics/T10.md incl. binding research notes; images/T10.webp; brief-BATCH.md, brief-EDITORIAL-VOICE.md, shared/SENTENCE-VARIETY-RULE.md §§5–6, shared/LESSONS.md.

## Verdict

PASS — all four languages publishable after the minor edits listed below (applied by me, lint OK and variety exit 0 on every file afterwards). No major issue found. Image OK.

## Scope checked — official pages opened on 2026-10-06 (saved under reviews/T10/sources/)

Statute single-article pages (law.moj.gov.tw, fetched with fetch_law.py; database cut-off shown on every history page: 法規整編資料截止日 民國115年09月24日):
- 產業創新條例 J0040051 §10, §10-1, §10-2, §19-1, §23-3, §72 — header 修正日期 民國114年05月07日 (statutes-J0040051.md); history page (history-J0040051.html/.txt): 2025-05-07 amendment touched §10-1, 22, 23-1, 23-2, 67-1, 67-2, 70, 72 (+67-3); 2023-01-19 amendment added §10-2 for 2023-01-01 to 2029-12-31; 2019-07-24 added §23-3.
- 公司或有限合夥事業研究發展支出適用投資抵減辦法 J0030113 §3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 19 — 修正日期 民國112年11月16日 (statutes-J0030113.md; history-J0030113.txt).
- 公司或有限合夥事業投資智慧機械…節能減碳抵減辦法 J0040062 §7, 8, 9, 11, 12, 13, 14, 16, 17, 18 — 修正日期 民國114年11月27日, 全文21條, in force 2025-01-01 to 2029-12-31 (statutes-J0040062.md; history-J0040062.txt).
- 公司前瞻創新研究發展及先進製程設備支出適用投資抵減辦法 J0040069 §2, 3, 13, 17, 19 — 發布日期 民國112年08月07日, single history entry, never amended (statutes-J0040069.md; history-J0040069.txt).
- 公司或有限合夥事業實質投資適用未分配盈餘減除及申請退稅辦法 G0340158 §2, 3, 6 — 發布日期 民國109年01月09日 (same file; history-G0340158.txt).
- 所得稅法 G0340003 §66-9 (same file; header 修正日期 民國115年09月11日 — the columns give no date for the ITA, §66-9 text as quoted).
- 所得基本稅額條例 G0340115 §4, 6, 8 — 修正日期 民國110年01月27日 (same file).
- 公司法 J0080001 §4, §371 — 修正日期 民國114年12月26日 (same file; lawall-J0080001.html).
- English database J0040051: "Industrial Innovation Statute", Amended Date 2025-05-07 (eng-J0040051.html/.txt).

Other official pages:
- 財政部賦稅署 release 113-06-18 (dot-20240618.html/.txt): 4 companies applied for TY2023; 60億 / 6% / 12% for 112; fallback to §10 and §10-1; 30% / 50% caps; period 112-01-01 to 118-12-31.
- 經濟部 release 2025-04-18 (moea-20250418.html/.txt): §10-1 adds AI and 節能減碳, ceiling 10億 → 20億, 114-01-01 to 118-12-31, 三讀通過.
- 財政部 site, 中區國稅局 release 2026-05-08 (mof-ntbca-20260508.html/.txt): TY2026 deduction NT$600,000 per 財政部114-11-19公告; 現行徵收率12%; difference cannot be reduced.
- 產業發展署 §10-2 application page id=1817, 更新日期 2025-11-07 (ida-1817.html/.txt): 3 months before filing period to deadline, 逾期不受理; TY2024 filing deadline extended to 114-06-30 and the application deadline likewise; lists the file 「1141023公告前瞻創新適用領域.pdf」.
- 產業發展署 R&D-credit 注意事項 PDF id=11623 (ida-11623.pdf/.txt; PDF created 2026-02-26): 曆年制公司為2至5月, 逾期不予受理.
- 產業發展署 R&D-credit 辦法說明 slides id=11644 (ida-11644.pdf/.txt; PDF created 2026-04-16): 附件1、附件2、附件3須提供紙本及電子檔; 相關檢附文件請提供電子檔; 7-month review flow.
- 產業發展署 前瞻創新適用領域(第一次檢討) PDF id=10599 (ida-10599.pdf/.txt; created 2025-10-22, modified 2025-11-07; file titled 1141023公告): 半導體, 電動化車輛, 通訊, 顯示器, 其他經審查小組同意之領域項目.
- 產業發展署 §10-2 briefing deck id=11223 (ida-11223.pdf/.txt, 2023-10-23): 註2 「自114年度起為15%」.

Automated checks (final run, after edits): lint OK for ko (3,490 chars), ja (4,204 chars), en (1,594 words), zh-hant (2,437 chars); variety_metrics exit 0 for all four (ko cv 0.606 short 18%; ja cv 0.467 short 15%; en cv 0.545 short 19%; zh cv 0.596 short 10%); lint confirms every internal link exists in that language in the repo.

## 1. Law and facts — result per claim (all four languages)

Verified correct against the fetched text (no discrepancy):
- §10: 15% in-year or 10% over three years from the current year, once chosen not changeable, cap 30% of 當年度應納營所稅; eligibility company/LP with no serious environmental, labour or food-safety violation in the last three years. Method chosen in the return, not changeable after the filing period (J0030113 §11 ¶2). "當年度應納營所稅" includes the assessed prior-year undistributed-earnings surtax (§12). Period 2017-11-24 to 2029-12-31 (§72 ¶3).
- Worked examples (each labelled hypothetical): ko 4,000만/1,000만 → 600만 vs cap 300만; 400만 over three years → 300만 + 100만. ja 3,000万/800万 → 450万 vs 240万; 300万 → 240万 + 60万. en 50m/4m → 7.5m vs 1.2m; 5m → 1.2m × 3 = 3.6m. zh 6,000萬/1,000萬 → 900萬 vs 300萬; 600萬 → 300萬 + 300萬. All arithmetic right under 15% / 10% / 30%.
- R&D in Taiwan only, except approved foreign commissioned or joint R&D (§7); improvement of existing products/processes excluded (§4 ¶2); subsidies and R&D-unit income excluded (§13); results for own use or reasonable royalty, with the TP-document exception for a company doing R&D, orders and sales whose related manufacturers produce (§10); joint R&D with a foreign company needs project approval and an explanation that no suitable domestic partner exists (§8 ¶3 (4)); project-approval items filed together with the review-opinion application (§9, §14 ¶3); documents list (§14 ¶1); review opinion sent within seven months after the deadline (§14 ¶2); return data gaps correctable until the deadline, otherwise 得不予受理 (§15 ¶3).
- §10-1: 2025-01-01 to 2029-12-31; smart machinery, 5G, cybersecurity, AI, energy-saving/carbon-reduction new hardware, software, technology or technical services for own use; NT$1 million to NT$2 billion in one tax year; 5% in the (delivery) year or 3% over three years; 30% cap; 50% combined cap (¶2); investment plan approved project by project, one application per tax year (¶8; J0040062 §13). 2025-05-07 amendment added AI and energy-saving and raised the ceiling from NT$1 billion to NT$2 billion (history + MOEA 2025-04-18). Regulations rewritten 2025-11-27, in force from 2025-01-01 (history). Order 2025–2029, delivery within two years from the day after ordering, one extension of up to two years (§8 ¶1); transition for items ordered by 2024-12-31 under the old rules and delivered from 2025, capped at NT$1 billion (§8 ¶2, §9 ¶2); installation at own or leased premises in Taiwan (§17); clawback with interest within three years from the day after delivery (§18); online only, four months before the filing period to the deadline, no late registration or paper filing (§12 ¶2, §14); no form in the return before the delivery-year filing period ends → no credit (§16).
- §10-2: 25% of forward-looking R&D, cap 30%; 5% of new advanced-process equipment ≥ NT$10 billion, cap 30%; 50% combined; current year only; exclusivity (¶3); conditions in J0040069 §3: R&D ≥ NT$6 billion, R&D/net operating revenue ≥ 6% (CPA-audited 個體綜合損益表), effective tax rate ≥ 12% for TY2023 and ≥ 15% from TY2025 as stated (statute: 15% from TY2024 with TY2024 adjustable to 12% — no version states a 2024 figure, per the binding note), no serious violations; key-position definition (§2); application three months before the filing period to the deadline, late applications refused (§13); form in the return (§17); fallback declaration (§19). Period 2023-01-01 to 2029-12-31 (§72 ¶6, history). Four applicants in TY2023 and the §10/§10-1 fallback (DOT 2024-06-18). Field list (IDA file 1141023公告…): semiconductors, EVs, communications, displays, other panel-approved fields (en only).
- §23-3: 5% surtax from TY2018 (ITA §66-9); earnings invested within three years from the year after they arise, total ≥ NT$1 million (G0340158 §3); land excluded (§2); refund claim within one year of completing an investment finished after the surtax return (§23-3 ¶3); clawback with interest (§6 — see issue 1 for the start point).
- AMT: general income tax = tax after investment credits (G0340115 §6); difference payable and not reducible by credits (§4); basic tax = basic income − NT$500,000 (adjusted to NT$600,000 for TY2026 per the 2026-05-08 release) × Executive Yuan rate within 12–15% (§8); rate in force 12% (release).
- Foreign ownership and branches: regulations require 「依公司法設立之公司」 or an LP (J0030113 §3, J0040062 §7); no nationality condition in §10, §10-1, §10-2 or the regulations (my reading of the fetched texts agrees with R5 fact 29); 公司法 §4 and §371 as stated; every version only tells a branch to confirm with the tax office and competent authority — nothing asserted either way.
- Dates: statute last amended 2025-05-07; R&D regs 2023-11-16; §10-1 regs 2025-11-27; §10-2 regs 2023-08-07; G0340158 2020-01-09; AMT act 2021-01-27; Company Act 2025-12-26 — all match the headers. Every time-sensitive statement is dated "as of October 2026" / 2026年10月 / 截至2026年10月.
- Binding research notes honoured: NT$2 billion (not 1.8) and 2025–2029 for §10-1 with no mention of the conflicting EY/NTBT pages; no TY2024 effective-tax-rate figure; branch eligibility not asserted; AMT stated as "cannot reduce below basic tax", rate 12% cited to the 2026-05-08 release; no "January 1 – May 31" window for §10-1.
- Home-country law: ko "한국 세무 전문가의 확인이 필요합니다", ja "日本の税理士にご確認ください", en "a tax adviser can confirm how a lower Taiwan tax bill affects the parent's foreign tax credit", zh none — all general cautions, no foreign rule stated.
- Language versions do not contradict each other on any rate, threshold, date or condition.

## 2. Citations

Inline links sit right after the claims and point to the correct single-article URLs (pcode/flno checked for every link: J0040051 10/10-1/10-2/23-3/72/19-1; J0030113 3/4/7/8/9/10/11/12/13/14/15; J0040062 7/8/9/12/13/14/16/17/18; J0040069 2/3/13/17/19; G0340158 2/3/6; G0340003 66-9; G0340115 4/6/8; J0080001 4/371). Non-statute links resolve to the official DOT, MOEA, MOF and IDA pages listed above. Sources sections list every source used, with amendment dates matching the headers and the check date 2026-10-06. Internal links exist in each language (lint). One gap fixed: zh cited the 5% surtax rate without a link (issue 4).

## 3. Rules

No bold, no phone, no street address, email only (wei@hoveringlaw.com.tw once, in one short paragraph before the sources), firm named correctly per language, no bookkeeping/filing/audit offer (contact paragraphs ask for a review of R&D contract structure / entity form against the conditions), author legal-ai-assistant, no lawyer/CPA/native-review claim, every hypothetical labelled after the scene ((가상의 계산 예입니다) / （架空の計算例です）（架空の例です） / (an invented example) ×2 / （虛構情境）), frontmatter per brief (topic tax, tags ["tax-accounting"], audience = file language, NNN image path, en seoTitle 36 chars because the title exceeds 60 with " | Hovering Law", en summary 158 chars with no forbidden characters). No judgments cited. Only batch-1 and pre-existing columns linked.

## 4. Voice

ko: natural 합니다체 throughout; opening gives the 30% cap at once; headings are column-specific (「15%를 한 번에, 또는 10%를 3년에 나눠」, 「25% 공제는 연구개발비 60억 대만달러부터」); no filler. ja: natural です・ます, no だ・である mixing; 「日台民間租税取決め」 not needed in this topic; "辦法（規則）" glossed once. en: plain and active; short sentences ("Four." "There are strings attached." "Approval has a price."). zh-hant: Taiwan usage only (營所稅, 國稅局, 稽徵機關, 會計師, 結算申報, 投抵, 資安, 軟硬體, 申辦系統); no mainland terms or simplified characters (lint). Titles are specific, not imperative or clickbait. Opening type ④ (one number) in all four: 30% / 60億 / Four / 3個月.

## 5. Sentence variety

Tool: no FAIL in any language (see numbers above). Self-check items: no stock opener; ≥2 very short sentences in each; no three paragraphs starting with the same word; no three consecutive claim–statute–caveat paragraphs and at least one uncited paragraph in each (the example paragraphs); contrast templates 0; last body paragraph is the column-specific contact sentence preceded by a facts paragraph; registers uniform. No MONOTONY finding.

## Issues (Original → problem & reason → fix → facts preserved)

1. §23-3 clawback start point (all four languages) — minor, fixed.
   Original (ko): 「3년 안에 팔거나 빌려주거나 용도를 바꾸면 줄인 세금을 이자와 함께 냅니다([제6조])」; ja 「3年以内に転売、貸出し、用途変更をすると…」; en "Lending, leasing, selling or repurposing the assets within three years brings the tax back with interest"; zh 「三年內轉借、出租、轉售或變更用途，要補繳並加計利息」.
   Problem: G0340158 §6 runs the three years 「於辦理未分配盈餘申報期間屆滿之次日起或申請更正重行計算該年度未分配盈餘之次日起三年內」 (https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340158&flno=6). Without the start point a reader could count from the investment date and underestimate the window.
   Fix applied: start point inserted in each language — ko 「미분배 이익 신고기간이 끝난 다음 날부터(환급을 청구했다면 경정 신청 다음 날부터) 3년 안에…」; ja 「未処分利益の申告期間が終わった翌日（還付を申請した場合はその申請の翌日）から3年以内に…」; en "within three years after the surtax filing period ends (or, where a refund was claimed, after that claim was filed)"; zh 「從申報期間屆滿的次日起（申請更正退稅的，從申請的次日起）三年內…」.
   Facts preserved: three years, the listed acts, repayment with interest, the §6 link; nothing removed.

2. en opening "Taiwan's top-rate R&D incentive" — minor wording, fixed.
   Original: "the first year of Taiwan's top-rate R&D incentive, the 25% forward-looking R&D credit"; next paragraph "two credits in the same law, the Industrial Innovation Statute (產業創新條例)".
   Problem: "Taiwan's top-rate R&D incentive" reads as a claim about every incentive in Taiwan; only the rates inside this statute were verified (25% > 15% > 5%).
   Fix applied: "the first year of the highest-rate credit in Taiwan's Industrial Innovation Statute (產業創新條例), the 25% forward-looking R&D credit…" and "two credits in the same statute: 15%…".
   Facts preserved: four applicants, 2023, NT$6 billion, DOT link, 15% / 5% and article links unchanged.

3. ja/zh "paper and electronic" scope — minor wording, fixed.
   Original: ja 「書類は紙と電子ファイルの両方で提出します」; zh 「附件要提供紙本及電子檔」.
   Problem: the IDA slide (id=11644) says 「附件1、附件2、附件3須提供紙本及電子檔」 and 「相關檢附文件請提供電子檔」 — only attachments 1–3 need both forms.
   Fix applied: ja 「申請書の附件1から3は紙と電子ファイルの両方で提出します」; zh 「申請書的附件1至3要提供紙本及電子檔」.
   Facts preserved: source link, February–May window, 逾期不受理.

4. zh 5% surtax rate uncited — minor, fixed.
   Original: 「用盈餘做實質投資，可以減少5%未分配盈餘加徵。」 (no link; the other three languages cite ITA §66-9 here).
   Problem: hard rule 2 (inline citation right after a legal number).
   Fix applied: 「可以減少[所得稅法第66條之9](…G0340003&flno=66-9)的5%未分配盈餘加徵。」 and the ITA line added to 參考的官方資料 (link placed mid-sentence so the sentence does not end in a parenthesis; the tool's 「）。」 ending share stays below its warning level).
   Facts preserved: 5%, §23-3 and 實質投資辦法 links unchanged.

5. ko §10-1 clawback list — minor wording, fixed.
   Original: 「인도 다음 날부터 3년 안에 팔거나 빌려주거나 용도를 바꾸면 공제받은 세액에 이자를 붙여 다시 냅니다」.
   Problem: J0040062 §18 lists more triggers (退貨、拍賣、報廢、失竊、經他人依法收回、安裝地點不符…); the three examples read as exhaustive. ja already says 「など」, en lists five.
   Fix applied: 「…용도를 바꾸는 등의 사유가 생기면…」.
   Facts preserved: three years from the day after delivery, interest, §18 link.

Checked and left as is (not issues):
- en "Fields announced on October 23, 2025": the date comes from the official file title 「1141023公告前瞻創新適用領域.pdf」 on the IDA page (id=1817); acceptable.
- "updated February 26, 2026" for the IDA application notes: PDF creation date 2026-02-26 (ida-11623.pdf metadata) agrees with R5.
- ko/en/zh "5월 확정신고 / the May return / 5月結算申報": correct for calendar-year companies, which is the stated case; the linked calendar column covers other year-ends.
- "no material … violations" (en) for 「無違反…且情節重大情事」: acceptable rendering.

## Minor edits applied (by me)

- en.md: opening paragraph 1–2 (issue 2); §23-3 clawback sentence (issue 1).
- ko.md: §23-3 clawback sentence (issue 1); §10-1 clawback list 「등의 사유가 생기면」 (issue 5).
- ja.md: §23-3 clawback sentence (issue 1); 附件1から3 (issue 3).
- zh-hant.md: 附件1至3 (issue 3); §66-9 inline link + sources line (issue 4); §23-3 clawback sentence, worded 「從申報期間屆滿的次日起…」 after a first wording triggered the tool's consecutive-same-start check (issue 1).
No number, rate, date, article number, link target or hypothetical label was changed or removed. After the edits: lint OK ×4; variety_metrics exit 0 ×4 (outputs quoted above).

## Image

images/T10.webp: a quiet laboratory bench with a brass microscope, flask, beaker and two petri dishes in front of a frosted window. No people or faces, no text, logos, flags or readable documents; fictional and unidentifiable; respectful; fits an R&D-credit column. Verdict: OK.
