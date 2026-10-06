# T3 final review (r1) — Claude Fable 5.1 — 2026-10-06

Column: taiwan-withholding-tax-payments-to-foreign-companies (ko · ja · en · zh-hant)
Files reviewed: drafts/T3/ko.md, ja.md, en.md, zh-hant.md, facts.md; topics/T3.md; research/R2-statutes.md, R2-official.md, R3b-statutes.md, R3b-official.md, T3-extra.md; images/T3.webp.

## Verdict

PASS — all four language versions are publishable as they now stand (two minor wording edits applied, listed below). No major issue found: every rate, threshold, deadline, date, article number, agreement term, procedure and condition in the four versions matches the official text I opened myself. The four versions do not contradict each other on law. Image OK.

## Scope checked — official pages opened on 2026-10-06 (all saved under reviews/T3/sources/)

Statutes (law.moj.gov.tw, via fetch_law.py → sources/statutes.md; header dates are the DB's 修正日期):
- 所得稅法 G0340003 — 修正日期 民國115年09月11日 (2026-09-11): §8, §25, §43-1, §73, §88, §89, §92, §98-1, §114
- 所得稅法 沿革 https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=G0340003 → sources/G0340003-history.txt: entry 71 (2026-09-11 amends §17, §126 only); entry 69 (2024-08-07 amends §88, 89, 92, 94-1, 111, 112, 114, 114-3, 126; 行政院 2024-08-27 order sets effect from 2025-01-01)
- 各類所得扣繳率標準 G0340028 — 修正日期 民國110年06月30日 (2021-06-30): §3, §9
- 適用所得稅協定查核準則 G0340125 — 修正日期 民國114年04月08日 (2025-04-08): §23, §25, §34
- 加值型及非加值型營業稅法 G0340080 — 修正日期 民國114年05月28日 (2025-05-28): §36

MOF orders (law-out.mof.gov.tw → sources/FL050237.txt, FL042804.txt):
- 所得稅法第八條規定中華民國來源所得認定原則 FL050237 — 修正日期 民國112年10月13日 (2023-10-13), 台財稅字第11204568350號令: points 4 (paras 1, 3, 4), 5, 6(二)2, 7 (paras 1–2), 10 (para 4 item 二), 13, 15 (paras 2–4)
- 外國營利事業申請適用所得稅法第二十五條第一項規定計算所得額案件審查原則 FL042804 — 修正日期 民國112年05月29日 (2023-05-29), 台財稅字第11104713420號令: points 6(三)2, 7(四)2(6), 8(一)2(1), 11

Tax agreements (mof.gov.tw → sources/*.pdf + pdftotext *.txt):
- 我國所得稅協定一覽表 https://www.mof.gov.tw/singlehtml/191?cntId=63930 — 發布/更新日期 2026-09-04 (sources/mof-agreement-list.txt): Vietnam 1998/04/06 · 1998/05/06; Japan 2015/11/26 · 2016/06/13; Korea 原協定 2021/11/17 · 2023/12/27 (修正協議 2026/08/04 renames the Korean ministry only); United States appears only in the 海空運S&A table, 1988/05/31
- Korea 中文 https://www.mof.gov.tw/download/c73d0ce06a654aed88df936485e60a53 and English https://www.mof.gov.tw/download/d1f7663ee1cf4074bd307a87e852d389: title 駐韓國台北代表部與駐臺北韓國代表部避免所得稅雙重課稅及防杜逃稅協定; signed 2021-11-17 at Taipei and Seoul; Art 5(3)(二) services > 183 days in any twelve-month period; Art 7(1); Art 11(2) 10%; Art 12(2) 10%; Art 27(1) principal-purpose test with object-and-purpose exception
- Japan 中譯本 https://www.mof.gov.tw/download/10422 and English https://www.mof.gov.tw/download/10462: 亞東關係協會與公益財團法人交流協會…協定; signed Tokyo 2015-11-26; Art 5(3)(二) services > 183 days in any twelve-month period commencing or ending in the taxable year concerned; Art 7(1); Art 11(2) 10%; Art 12(2) 10%; Art 26 main-purpose limitation
- Vietnam English https://www.mof.gov.tw/download/66dc13da4e8449698e42d6b818549c52 and 中譯本 https://www.mof.gov.tw/download/6b9255566aab4b9084c085ddc921138e: TECO Hanoi – VECO Taipei; done at Hanoi 1998-04-06; Art 5 has only the construction (> six months) deemed-PE item and no services clause (full Art 5 read; the only "183" in the text is in Art 15 employment); Art 7(1); Art 11(2) 10%; Art 12(2) 15%; Art 12(3) royalties include use of industrial, commercial or scientific equipment
- US 1988 exchange of letters English https://www.mof.gov.tw/download/8c60fe4479e447c8b795daf4e0027a2c, 中 https://www.mof.gov.tw/download/33432dc9fdc447cbacf1cf032f9374fd: "Signed on May 31,1988; Entered into force on May 31, 1988", ships and aircraft only

US bill status (Library of Congress API, since congress.gov HTML returns HTTP 403 to scripts — sources/congress-*.json):
- H.R.33 (119th): 2025-01-15 "Passed/agreed to in House: On passage Passed by the Yeas and Nays: 423 - 1"; latestAction 2025-01-16 "Received in the Senate and Read twice and referred to the Committee on Finance."; record updateDate 2026-09-19; no law/enrolled version
- S.199 (119th): latestAction 2025-01-23 "Read twice and referred to the Committee on Finance."; record updateDate 2026-04-14

Internal links: all four targets exist in the repo (src/content/columns/238-korea-taiwan-tax-agreement-dispatched-engineers-permanent-establishment.md; columns-ja/212-japan-taiwan-tax-agreement-semiconductor-expatriates.md; columns-en/209-us-taiwan-double-taxation-semiconductor-expansion.md; columns-zh/256-taiwan-vat-foreign-digital-services-registration.md); lint confirms.

Tools run (all four files, before and after edits): `python3 lint.py <file> <lang> taiwan-withholding-tax-payments-to-foreign-companies` → OK (ko 2,936 chars; ja 3,468; en 1,508 words; zh-hant 2,314). `python3 shared/variety/variety_metrics.py check <file> --lang <lang>` → "OK — no variety limit violated" for ko (cv 0.501, short 9.1%, contrast 0, caveat 1), ja (cv 0.506, short 13.3%, contrast 0, caveat 1), en (cv 0.666, short 23.2%, contrast 0), zh-hant (cv 0.648, short 19.5%, contrast 0).

## 1. Law and facts — result per claim (all four languages)

Every claim below was read in the column and compared with the saved official text; "✓" = correctly stated with conditions intact in every language that carries it.

- Withholding at payment by the payer when the recipient has neither a fixed place of business nor a business agent in Taiwan (§73 I; §88 I(2)); payer = 扣繳義務人, recipient = 納稅義務人 (§89 I(2)) ✓
- Royalties for IP used in Taiwan = Taiwan-source (§8(6)) ✓; royalties paid by a Taiwan enterprise for IP used abroad in commissioned processing/manufacturing/research = Taiwan-source (認定原則 pt 7 para 2) ✓
- Uncustomized standardized software sold for use only, no reproduction/modification/public display → ordinary international trade (pt 10 para 4(二)) ✓; system/application software licences and source-code licences → royalty income (審查原則 pt 8(一)2(1)) ✓
- Service remuneration Taiwan-source in three cases (pt 4 para 1(一)(二)(三)) ✓; "participation and assistance" = equipment, manpower, specialist knowledge or technology; excludes buyer's basic background information and notices/confirmations (pt 4 para 3) ✓; services performed and completed wholly abroad are not Taiwan-source if no FPB and no agent, or agent not acting for that business, or FPB not participating (pt 4 para 4) ✓ — body and FAQ in all four languages state the OR-conditions correctly
- Interest paid by a Taiwan legal person = Taiwan-source (§8(4); pt 5 para 1 "其他貸出款項之利息") ✓; composite contracts split by income type (pt 13 para 1) ✓; equipment rent (§8(5); pt 6(二)2) ✓
- Rates, 扣繳率標準 §3 I as of October 2026, last amended 2021-06-30: royalties 20% (item 6), 其餘各種利息 20% (item 4(五)), rent 20% (item 5), other income of a foreign enterprise with no FPB and no agent 20% (item 10) ✓ in all four tables/paragraphs
- §92 II: pay to Treasury within 10 days from the withholding date, file 扣繳憑單 for verification, then issue; +5 days when ≥3 consecutive national holidays fall within the 10 days; version in force since 2025-01-01 (沿革 entry 69) ✓
- §114(1): order to pay the shortfall and file 扣繳憑單 by a deadline + fine ≤1×; not cured by the deadline or not truthfully filed → ≤3×; §114(3) 滯納金 on late payment of withheld tax (rate not stated — correct, it is not in §114) ✓
- Korea agreement: parties, signed 2021-11-17, in force 2023-12-27 ✓; Art 11(2)/12(2) 10% caps conditioned on beneficial owner being a Korean resident ✓; Art 7(1) business profits only in residence territory absent a PE ✓; Art 5(3) services > 183 days in any twelve-month period (ko correctly omits the "commencing or ending in the taxable year" wording, which is Japan-only) ✓; Art 27 PPT with the object-and-purpose proviso ✓
- Japan agreement: 亜東関係協会・公益財団法人交流協会, signed Tokyo 2015-11-26, in force 2016-06-13, called 日台民間租税取決め ✓; 10%/10% ✓; Art 7(1) ✓; Art 5(3) with "課税年度に開始または終了する12か月" ✓; Art 26 main purpose ✓
- Vietnam (en, zh tables): in force 1998-05-06, interest 10%, royalties 15%, royalty definition includes equipment (Art 12(3)) so equipment rent falls under the 15% cap ✓; no services-PE clause ✓; Art 7(1) ✓
- United States (en, zh): no comprehensive agreement; only the 1988 shipping/air exchange of letters; H.R.33 passed 423–1 on 2025-01-15, referred to Senate Finance 2025-01-16; S.199 referred 2025-01-23; "no enactment in the official record checked on 2026-10-06" ✓ (wording stays within what the API record shows)
- 查核準則 §25 II/IV: residence certificate + beneficial-owner certificate from the recipient to the withholding agent; agent states the agreement article and attaches the licence/technical-service contract (with Chinese translation) and computation, or loan agreement and interest computation ✓; §23 I: business-profits relief by application to the tax office where the payer is located, which notifies the withholding agent not to withhold ✓; §34 I: refund application by recipient or agent within 10 years from payment to the office that received the withholding return; §34 III transitional rule (more than five years elapsed at the 2025-04-08 amendment → old rules) ✓
- 所得稅法 §25 I: technical services / equipment leasing, cost allocation difficult, MOF approval or determination, 15% of Taiwan revenue, no §39 loss deduction ✓; 扣繳率標準 §9 + §98-1(3): 20% of the deemed income, presented as arithmetic "3% of revenue" (계산하면 / 計算すると / That works out to / 算下來) ✓; 審查原則 pt 11: approvals from 2023-05-29 limited to five years or the shorter contract term ✓; pt 6(三)2 royalty portion refused, pt 7(四)2(6) general-administrative group management services refused ✓
- 認定原則 pt 15 para 2: cost-deduction refund within 10 years from receipt, through a Taiwan agent, to the tax office where the withholding agent is located; royalties (§8(6)) and interest (§8(4)) are not in the list ✓
- 營業稅法 §36 I: buyer computes and pays business tax within 15 days after the start of the period following payment; exempt when the buyer computes tax under Ch. 4 §1 and uses the services solely for taxable business ✓ (5% rate deliberately not stated — consistent with R3b U1)
- §43-1 arm's-length adjustment with MOF approval ✓
- ja example: NT$10,000,000 × 20% = 2,000,000 withheld, 8,000,000 remitted; × 10% = 1,000,000 ✓; labelled （架空の例です） after the scene ✓
- Home-country law: ko "한국 세무 전문가와 확인", ja "日本の税理士にご確認ください", en "A US or Vietnamese tax adviser can confirm…" — general cautions only ✓
- Source-section amendment dates in all four: 所得稅法 2026-09-11, 扣繳率標準 2021-06-30, 查核準則 2025-04-08, 營業稅法 2025-05-28, FL050237 2023-10-13, FL042804 2023-05-29, MOF list 2026-09-04 ✓; check date 2026-10-06 present in all four ✓

## 2. Citations

Inline links sit right after the claims; every law.moj.gov.tw link carries the correct pcode and flno for the article cited (verified against sources/statutes.md). Agreement links point to the official MOF PDFs (ko: Korea 中/英; ja: Japan 中譯本/英文本; en: Vietnam/Japan/Korea English texts + 1988 letters; zh: Korea/Japan/Vietnam 中文本 + 1988 letters 中). Congress.gov links are the human bill pages (status itself taken from the official API, as the facts sheet notes). Sources sections list every source used with the check date. Internal links exist in their language (lint OK).

## 3. Rules

No bold, no phone, no street address, email-only contact with the firm named once near the end, no bookkeeping/filing/audit offer (contact lines speak of income classification and agreement documents as consultation topics), author legal-ai-assistant, no lawyer/CPA/native-review claim, hypothetical marked (ja only), frontmatter per brief (lint OK: topic tax, tags ["tax-accounting"], en seoTitle 42 chars because the title exceeds 60 with " | Hovering Law", en summary 158 chars, no forbidden characters). Opening type ⑤ (one-line misconception, then facts) used in all four, and the rebuttal stays within that one line. Dividends and transfer-pricing documents are not covered; arm's length appears in one clause. Agreements described as between representative offices/associations in the terms the brief asks for.

## 4. Voice

ko: 합니다체 throughout, natural practitioner prose, specific title, first paragraph delivers the rule at once; headings are column-specific ("쓴 곳과 일한 곳이 원천을 정합니다", "용역비의 20%가 무겁다면"). ja: です・ます throughout (headings excepted), natural Japanese, example suited to a March-closing parent; mixes ロイヤルティー (title/example) with 使用料（權利金） (statutory term) — acceptable. en: plain, active, short sentences mixed in ("The clock starts at withholding.", "Interest is simpler."). zh-hant: Taiwan usage only (國稅局、財政部、扣繳義務人、營所稅 context、軟體), colloquial rhythm ("美國呢？", "期限很短。"), no simplified characters or mainland vocabulary (lint OK).

## 5. Sentence variety

Tool: no FAIL line in any language. Self-check items 2–7: opening not a stock formula; ≥2 very short sentences in each; no three paragraphs starting with the same word (ja has "役務の…" ×2 and "台湾で/台湾に" ×2, within limit); no three consecutive claim-(statute)-caveat paragraphs and each file has citation-free paragraphs; contrast templates 0; last paragraph ends on the column's own facts in all four. No MONOTONY finding.

## 6. Image — OK

images/T3.webp: a wooden desk with a closed linen-covered notebook, a fountain pen, a small potted plant and a window with soft daylight. No faces, text, logos, flags or readable documents; fictional and unidentifiable; calm and respectful. It fits the board's tone (office/paperwork) though it is generic rather than specific to withholding — acceptable as a hero image.

## Issues

No major issue. Minor items, all applied directly:

1. en body (penalty paragraph) — Original: "and is fined up to one times the tax not withheld." → Problem: "one times" is translationese for 一倍以下 and reads oddly in English. → Fix applied: "and is fined up to the amount of the tax not withheld." → Facts preserved: ≤1× of the tax not withheld; "three times" for the second tier untouched; §114 link unchanged.
2. en FAQ 3 — Original: "and fines it up to one times that tax." → same problem → Fix applied: "and fines it up to the amount of that tax." → Facts preserved (1× / 3× tiers, deadline condition).
3. ko first paragraph — Original: "세금은 지급하는 대만 자회사가 지급할 때 떼어 냅니다" → Problem: "지급하는 … 지급할 때" doubles the verb. → Fix applied: "세금은 대만 자회사가 지급할 때 떼어 냅니다" → Facts preserved: payer = subsidiary, timing = at payment, §73/§88 citations unchanged.

Non-blocking observations (no change made):
- en summary says "a parent with no Taiwan office" as a plain-English stand-in for "no fixed place of business"; a literal rendering would push the summary past the 160-character limit (tested: 169–178 chars). The body states the statutory condition precisely, so left as is.
- ko renders 駐臺北韓國代表部 as "주타이베이 한국대표부" (a translation of the Chinese title; the Korean-language title of the agreement was not fetched). Not a legal error; the linked ko column 238 does not name the missions, so there is no in-site inconsistency.
- en table intro says "a foreign company with no fixed place of business in Taiwan" (the §3 heading), while the "Other service fees" row rests on item 10, which also requires no business agent; the opening paragraph has already fixed both conditions for the whole column, so the row reads correctly in context.

## Minor edits applied

- drafts/T3/en.md: "up to one times the tax not withheld" → "up to the amount of the tax not withheld"; FAQ 3 "up to one times that tax" → "up to the amount of that tax".
- drafts/T3/ko.md: "세금은 지급하는 대만 자회사가 지급할 때 떼어 냅니다" → "세금은 대만 자회사가 지급할 때 떼어 냅니다".
- After edits: lint OK for ko (2,936 chars) and en (1,508 words); variety check OK for both. ja and zh-hant untouched (lint OK, variety OK).

VERDICT: PASS
