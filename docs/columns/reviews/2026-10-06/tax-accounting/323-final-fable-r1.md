# T9 final review — taiwan-branch-tax-head-office-expense-allocation (ko · ja · en · zh-hant)

Reviewer: Claude Fable 5.1 (final gate). Review date: 2026-10-06 (KST). Files reviewed: drafts/T9/ko.md, ja.md, en.md, zh-hant.md; drafts/T9/facts.md (not trusted; every claim re-checked against the official page); research/R6-statutes.md, R6-official.md, T9-extra.md, and the R1/R2 passages the fact sheet cites (R1-official O19/O20, R2-official S1/S11/S13/b, R2-T2-added) — treated as untrusted and re-fetched.

## Verdict

PASS. No major issue in any language. Every rate, threshold, deadline, date, article number, agreement term and procedure stated in the four versions matches the official text I opened. The four versions agree with each other on the law. Five minor edits applied (listed below); lint OK and variety check FAIL-free on all four files after the edits. Image OK.

## Scope checked — official pages opened on 2026-10-06 (saved under reviews/T9/sources/)

Statutes (law.moj.gov.tw, via fetch_law.py → sources/statutes-fable.md; each law's LawAll header gives the latest amendment date):
- 所得稅法 (G0340003) — 修正日期 民國115年09月11日 — §3, §5, §39, §41, §66-9, §71, §83
- 所得稅法施行細則 (G0340004) — 民國111年02月21日 — §49
- 營利事業所得稅查核準則 (G0340051) — 民國112年12月11日 — §70 (all seven paragraphs)
- 公司法 (J0080001) — 民國114年12月26日 — §371, §372
- 加值型及非加值型營業稅法 (G0340080) — 民國114年05月28日 — §6

MOF rulings and orders (law-out.mof.gov.tw → sources/mof-*.html, text in sources/mof-rulings-text.md):
- GL002917 台財稅第7586738號 (76-03-09 = 1987-03-09)
- GL004002 台財稅第32565號 (64-04-10 = 1975-04-10)
- GL003455 台財稅第36379號 (64-09-01 = 1975-09-01)
- GL003048 台財稅第881958163號 (88-11-15 = 1999-11-15)
- GL005673 台財稅第861924459號 (86-12-04 = 1997-12-04; page shows the pre-amendment text plus the note that the 2026-09-16 order amended it)
- GL005678 台財稅第881896532號 (88-01-20 = 1999-01-20; same note)
- GL011760 台財稅字第11500617350號令 (115-09-16 = 2026-09-16; title 「核釋外國營利事業認列境外發生成本或費用證明文件免經驗證」; full text = items 一 and 二 only, no transitional clause)
- FL050237 所得稅法第八條規定中華民國來源所得認定原則 (修正日期 民國112年10月13日; point 2)

Other official pages (sources/*.txt):
- 財政部稅務入口網 Q&A 2814 (更新日期 115-04-27) — sources/etax-2814.txt
- 財政部稅務入口網 Q&A 1503 (更新日期 115-04-10) — sources/etax-1503.txt
- 財政部 我國所得稅協定一覽表 (發布/更新日期 2026-09-04) — sources/mof-list-63930.txt
- 財政部 release 「我國與韓國所得稅協定於112年12月27日起生效，自113年1月1日起適用」 (發布日期 2023-12-28) — sources/mof-korea-release.txt
- 国税庁 「日台民間租税取決めに定める相互協議手続について」 — sources/nta-nichitai-01.txt (page is Shift_JIS; decoded)
- 經濟部商業發展署 GCIS 「外國公司設立在臺分公司申請作業程序」 (113.08.19更新) — sources/gcis-pk55.txt
- law.moj.gov.tw/ENG LawAll for G0340003, J0080001, G0340080, G0340004 (titles and Amended Date confirmed); G0340051 returned an empty body (Content-Length 0) — sources/eng-*.html

Tax agreements (mof.gov.tw downloads, pdftotext → sources/*.txt):
- Korea consolidated text, Chinese (ea19d023…) and English (9679b16a…) — Art 7(3), title 「駐韓國台北代表部與駐臺北韓國代表部避免所得稅雙重課稅及防杜逃稅協定」 / "AGREEMENT BETWEEN THE TAIPEI MISSION IN KOREA AND THE KOREAN MISSION IN TAIPEI…"
- Japan, Chinese translation (10422) and English (10462) — Art 7(3), parties 亞東關係協會與公益財團法人交流協會 / Association of East Asian Relations and the Interchange Association
- Vietnam, English (66dc13da…) and Chinese translation (6b925556…) — Art 7(3), parties Taipei Economic and Cultural Office in Hanoi / Vietnam Economic and Cultural Office in Taipei; Chinese text uses 固定營業場所

Tools run after editing (all four files): `python3 lint.py <file> <lang> taiwan-branch-tax-head-office-expense-allocation` → OK (ko 3,298 chars; ja 3,790; en 1,575 words; zh-hant 2,619); `python3 shared/variety/variety_metrics.py check <file> --lang <lang>` → no FAIL (ko/ja show only the register WARN, which the rule treats as normal for 합니다체/です・ます).

## 1. Law and facts — item-by-item result (all languages unless noted)

| Claim in the columns | Official text | Result |
|---|---|---|
| Branch = unit of head office; Taiwan profit part of HO profit; no distribution issue; branch need not withhold on remittance | GL002917 主旨 verbatim | OK |
| No branch registration → may not do business in own name; actor faces criminal penalty | 公司法 §371 I–II | OK |
| Dedicated operating funds + responsible person in Taiwan; returning funds after registration = crime | 公司法 §372 I–II | OK |
| Head office abroad → taxed on Taiwan business income | 所得稅法 §3 III | OK |
| Fixed place of business keeps separate books, computes own income | §41 | OK |
| Return 1–31 May for previous year; branch files separately with tax office of its registered place | §71 I; 施行細則 §49 II | OK |
| Rate 20% as of October 2026 | §5 V(2); 所得稅法 latest amendments (2025-12-26, 2026-09-11) touched §17/§126 only | OK (simplified: NT$120,000 exemption and half-of-excess cap not mentioned — acceptable for this column) |
| Branch with separate books may use §39 carryforward; period now 10 years; conditions (complete books, blue return or CPA-certified return in loss year and deduction year, timely filing) | GL004002; §39 I | OK. Note: the ruling carves out branches computing income under §25 (deemed profit); not stated in the columns. Not misleading for a branch keeping actual books, so recorded as a limitation, not a defect |
| Branch is a 營業人 for business tax | 營業稅法 §6(3) | OK |
| GCIS procedure: tax registration with the local NTB after company/branch registration | GCIS step 3 → 4 | OK |
| §70 I lead-in, conditions (1) and (2), II basis and approval, III documents incl. foreign tax authority certificate and the extra data when another basis is approved, IV separate audit report, V outside TP rules | §70 verbatim | OK in all four; every condition kept; the readings added (branches-only loading fails (1); check purchase prices) follow directly from the text |
| Worked examples: ko KRW 10 bn × 4% = 400 m; ja JPY 1 bn × 5% = 50 m; en US$50 m × 3% = 1.5 m; all labelled invented | arithmetic | OK |
| §70's text names a CPA-certified report or a foreign tax authority certificate and does not list mission authentication (FAQ) | §70 I–VII contains no 使領館/驗證 wording | OK (stated as a statement about the text only) |
| Korea Art 7(3); agreement by 駐韓國台北代表部/駐臺北韓國代表部; in force 2023-12-27 | KR consolidated text; MOF release 2023-12-28; MOF list row 「2023/12/27(112年)」 | OK. The consolidated text also incorporates an amending agreement effective 2026-08-04; the MOF list says it only replaced the name of the Korean ministry (企劃財政部 → 財政經濟部). Art 7(3) unchanged; the column's "2023년 12월 27일 발효" refers correctly to the agreement |
| Japan Art 7(3); 日台民間租税取決め between 公益財団法人交流協会 and 亜東関係協会, renamed 2017-01-01 / 2017-05-17; not a treaty concluded by Japan (ja) | NTA page (注1, 注2); JP agreement texts | OK |
| Vietnam Art 7(3) quoted verbatim in en ("as reasonable deductions…"); parties; Chinese text says 固定營業場所 (zh) | VN English and Chinese texts | OK (verbatim match) |
| US: no comprehensive income tax agreement in force as of 2026-10-06; only the 1988 shipping/air arrangement (en, zh) | MOF list updated 2026-09-04: 美國 appears only in the 海空運 table (1988/05/31) | OK |
| 1997 ruling scope (design/contracting/engineering, branch or site) and 1999 ruling scope (HO services direct to Taiwan customers, branch keeps books, combined return); old wording required mission or government-authorized-body certification | GL005673, GL005678 (pre-amendment text still displayed) | OK |
| 2026-09-16 order rewrote both; new wording = CPA-certified HO report (amount, nature, calculation/allocation method) or foreign tax authority certificate; mission step gone; title says 免經驗證 (ja); §83 route with approval; assessment on available data or industry profit standard; no wording on which return it applies from | GL011760 items 一(一), 一(二), 二; 所得稅法 §83 | OK. Nothing beyond the order's text is stated (R6 UNVERIFIED respected) |
| Interest on HO-supplied funds breaks §70 I(2) | §70 I(2) | OK |
| 1975 ruling: HO loan from another oil company for the branch's offshore exploration; interest deductible by the branch in principle if it proves to its tax office the loan was used entirely for the branch | GL003455 | OK |
| 1999 ruling: fees a foreign bank's Taipei branch paid to a HO project team = HO's Taiwan-source income, included in the branch's return | GL003048 (英商○○銀行臺北分公司; 隸屬於總公司之…專案小組) | OK |
| Royalties to own head office: no rule stated; "confirm with the NTB or a Taiwan CPA" | R6 UNVERIFIED | OK (no rule invented) |
| Source principles point 2 excludes branch remittances from dividends; amended 2023-10-13 | FL050237 | OK |
| 5% surtax on undistributed earnings from tax year 2018; HO-abroad businesses exempt from computing/filing | §66-9 I; Q&A 2814 (1)(1), 更新 115-04-27 | OK |
| Subsidiary dividends to foreign parent: 21% withholding on payments from 2018-01-01 | Q&A 1503 item 2, 更新 115-04-10 | OK |
| Home-country treatment: referral to a home-country adviser only | — | OK (no foreign law stated) |
| Source-list amendment dates and ruling dates | headers above | OK (all 民國→西曆 conversions correct) |

Cross-language consistency: the four versions state the same conditions, numbers, dates and conclusions. Per-language differences are only the examples (ko Korean parent, ja Japanese parent, en US parent + Vietnam agreement, zh three agreements + US note) and the agreement cited for the reader's country, as the topic brief asks.

## 2. Citations

- Inline links sit next to each claim; every statute link points to the right pcode/flno; agreement links point to the MOF agreement texts; the US statement links the MOF list; the Korea in-force date links the MOF release (ko). The one gap was the §70 section, which cites paragraphs 1–5 of §70 across six paragraphs with the link only in the opening paragraph; I added the §70 link at the first mention in that section in all four languages (minor edit).
- Sources sections: complete (every page used in the body appears), with the check date 2026-10-06 in each language. en lists the ENG title-check page; the en body says the regulation's English name is unofficial, which matches the empty ENG page for G0340051.
- Internal links: /<lang>/columns/taiwan-company-subsidiary-vs-branch, taiwan-company-establishment-basics, taiwan-dividend-withholding-foreign-parent-tax-agreement-rates (batch-1 302) — all exist in all four languages per LINKS.md; lint confirms. No batch-2 link; board link not used.

## 3. Rules

No bold, phone, LINE/Kakao, street address; one email contact (wei@hoveringlaw.com.tw) with the firm name once, before the sources; no bookkeeping/filing/audit offer; author legal-ai-assistant; no lawyer/CPA/native-review claim; hypothetical numbers labelled in ko/ja/en (zh has no example); frontmatter per brief (topic "tax", tags ["tax-accounting"], audience = file language, NNN image path, dates 2026-10-06). en: title 80 chars → seoTitle required and present at 42 chars; summary 160 chars, no forbidden characters. ko/ja/zh seoTitles ≤32 chars and differ from the titles.

## 4. Voice

- ko: 합니다체 throughout; opening type ① (fact: the branch may book part of head-office overhead; basis; filing). Title names the reader (한국 본점) and the issue; no filler; "대 준 자금" is colloquial but natural. Reads as Korean practitioner prose.
- ja: です・ます throughout; opening type ① (the HO financial report attached to the branch return). 日台民間租税取決め described with the NTA wording. Uses 会計師 for the Taiwan CPA and 会計士 for the foreign CPA, which is a sensible distinction. Natural.
- en: plain, active; opening type ①; the Vietnam quote is verbatim; no "it is important to note"/"navigate" filler. One sentence begins with "And" (line 47) — acceptable in this register.
- zh-hant: Taiwan usage (國稅局、營所稅、稽徵機關、會計師簽證、函釋); no simplified characters or mainland terms; opening type ①; short sentences present ("課稅只及於台灣。" "虧損呢？" "匯回不必扣繳。").
- Headings are specific to the column in all four; no checklist/imperative headings; last paragraphs end on the column's own fact (§70 IV separate audit report); no copied disclaimer.

## 5. Sentence variety

Tool: no FAIL in any language (ko cv 0.546/short 9.8%; ja 0.526/11.6%; en 0.569/17.1%; zh 0.589/12.5%; contrast ko 1, others 0; caveat chains 0). Self-check items 2–7 all met: no stock opener, ≥2 very short sentences, no three paragraphs with the same first word, citation-free paragraphs present, contrast ≤3, closing on the column's facts. No MONOTONY finding.

## Issues (Original → problem & reason → fix → facts preserved)

1. en line 37 — "issued for a branch of a company headquartered in the United States and Hong Kong" → the ruling (GL004002) is phrased for 「總公司在美國及香港，而其分公司在我國境內者」, i.e. head offices in the US and Hong Kong, not one company with two headquarters → applied: "concerning Taiwan branches whose head offices were in the United States and Hong Kong" → ruling number, date, link and the §41/§39 holding unchanged.
2. ko line 43 / ja line 43 / en line 43 / zh-hant line 43 — first mention of 제70조 제1항 / 第70条第1項 / Article 70, paragraph 1 / 第70條第1項 carried no link while the section cites five paragraphs of the article → applied: inline link to https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340051&flno=70 at that mention → wording and content unchanged.

Noted, no change required:
- §39 carryforward (all languages): the 1975 ruling excludes branches computing income under 所得稅法 §25; the columns do not mention this. A §25 deemed-profit branch has no loss to carry forward, so the omission does not mislead; a later revision may add a half-sentence if the writer wishes.
- Remittance "no withholding" (all languages): the legacy 1991 ruling (台財稅第800356032號, 20% for former 獎勵投資條例 beneficiaries) is deliberately left out; it cannot apply to a branch set up today.
- ko sources link the Korea consolidated text, which includes the 2026-08-04 amending agreement (ministry name change only). The "2023년 12월 27일 발효" date is the agreement's in-force date, which is what the sentence says.

## Minor edits applied

- en.md: 1975-ruling scope wording (issue 1); §70 link at the section head (issue 2).
- ko.md, ja.md, zh-hant.md: §70 link at the section head (issue 2).
After the edits: lint OK for all four; variety check no FAIL for all four (outputs above).

## Image

images/T9.webp — two low office buildings joined by a glazed bridge over a reflecting pool at dusk. Fits the column (branch linked to head office). Fictional architecture, no readable text, logos, flags or documents; the only human figure is a distant unidentifiable silhouette on the bridge, no face. Respectful. Verdict: OK.

VERDICT: PASS
