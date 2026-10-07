# T19 cross-review r1 — taiwan-equipment-installation-project-tax-permanent-establishment

Reviewer: Lane B (Claude Fable 5.1), final gate. Review date: 2026-10-07 (KST). Files reviewed: drafts/T19/ko.md, ja.md, en.md, zh-hant.md (+ facts.md, research/R11-official.md, R11-statutes.md, T19-extra.md as untrusted input), images/T19.webp.

## Verdict

PASS — all four languages publishable now; image OK. No major (law/fact/citation/rule) issue found. Three minor Korean wording edits applied (see "Minor edits applied"); ko lint and variety re-run and OK.

## Scope checked (every official page opened on 2026-10-07, saved under reviews/T19/cross-sources/)

Statutes (law.moj.gov.tw single-article pages via fetch_law.py → cross-sources/statutes.md; amendment dates from the LawAll header):
- 所得稅法 (G0340003) — 修正日期 民國115年09月11日 — §8, §25, §88, §89, §92, §98-1
- 各類所得扣繳率標準 (G0340028) — 修正日期 民國110年06月30日 — §3, §9
- 適用所得稅協定查核準則 (G0340125) — 修正日期 民國114年04月08日 — §8, §9, §23
- 加值型及非加值型營業稅法 (G0340080) — 修正日期 民國114年05月28日 — §2, §20, §36, §41

MOF / eTax / NTA pages (curl → .html + stripped .txt):
- 所得稅法第八條規定中華民國來源所得認定原則 — https://law-out.mof.gov.tw/LawContent.aspx?id=FL050237 — 修正日期 民國112年10月13日 (FL050237.txt)
- 外國營利事業申請適用所得稅法第二十五條第一項規定計算所得額案件審查原則 — https://law-out.mof.gov.tw/LawContent.aspx?id=FL042804 — 修正日期 民國112年05月29日 (FL042804.txt)
- 台財稅第7575300號 — https://law-out.mof.gov.tw/LawContent.aspx?id=GL003002 — 公發布日 民國76年01月09日 (GL003002.txt)
- 台財稅第770526922號 (VAT part, 外國包商…由海關代徵營業稅) — https://law-out.mof.gov.tw/LawContent.aspx?id=GL007616 — 公發布日 民國77年03月28日 (GL007616.txt)
- 台財稅字第11500617350號令 — https://law-out.mof.gov.tw/LawContent.aspx?id=GL011760 — 公發布日 民國115年09月16日 (GL011760.txt)
- eTax Q&A 9105 — https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/business-tax/taxation-scope/V9kVODa — 更新日期 113-07-23 (etax-9105.txt)
- 我國所得稅協定一覽表 — https://www.mof.gov.tw/singlehtml/191?cntId=63930 — 更新日期 2026-09-04 (mof-agreement-list.txt)
- MOF press release, 臺日租稅協定於105年6月13日生效，自106年1月1日適用 — https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=dot70257 — 發布日期 2016-06-15 (mof-press-jp-2016.txt)
- 国税庁 日台民間租税取決めに定める相互協議手続について — https://www.nta.go.jp/taxes/shiraberu/kokusai/nichitai/01.htm (nta-nichitai-01.txt, re-decoded from Shift_JIS)

Agreement texts (MOF downloads → pdftotext):
- Korea consolidated text 中文 https://www.mof.gov.tw/download/ea19d023141d4d3dbfbd122d99081c86 (korea-zh.txt; disclaimer line confirms 原協定 in force 112-12-27 + 修正協議 115-08-04) · English https://www.mof.gov.tw/download/9679b16a87cd418ca479db4f947a588e (korea-en.txt)
- Japan 中譯本 https://www.mof.gov.tw/download/10422 (japan-zh.txt) · English https://www.mof.gov.tw/download/10462 (japan-en.txt)
- Vietnam English https://www.mof.gov.tw/download/66dc13da4e8449698e42d6b818549c52 (vietnam-en.txt) · 中譯本 https://www.mof.gov.tw/download/6b9255566aab4b9084c085ddc921138e (vietnam-zh.txt)
- US–Taiwan 1988 shipping/air text (to verify the en wording "exchange of letters") https://www.mof.gov.tw/download/8c60fe4479e447c8b795daf4e0027a2c (us-shipping-air-1988-en.txt; heading "EXCHANGE OF LETTERS BETWEEN CCNAA AND AIT … Signed on May 31,1988")

Tools run (all four files): `python3 lint.py <file> <lang> taiwan-equipment-installation-project-tax-permanent-establishment` → OK ×4 (ko 2,752→2,759 chars after edits; ja 3,263; zh-hant 1,977; en 1,398 words). `python3 shared/variety/variety_metrics.py check <file> --lang <lang>` → OK ×4 (ko cv 0.582, short 9.1%; ja cv 0.547, short 10.8%; en cv 0.608, short 17.7%; zh cv 0.656, short 14.7%; contrast 0 and caveat-chain 0 in all). Internal links: all six slugs exist in the repo (lint existence check; en field-engineers column = columns-en/221-…, named in the topic brief "only where it exists").

## 1. Law and facts — verification table (same result in all four languages unless noted)

| Claim in the columns | Official text | Result |
|---|---|---|
| Head-office direct sale of goods to a Taiwan customer = 一般國際貿易 (認定原則 pt 10 para 4, amended 2023-10-13) | FL050237 十 fourth para (一): 「外國營利事業之國外總機構直接對中華民國境內客戶銷售貨物」; 修正日期 112-10-13 | OK |
| Same with a Taiwan branch; from 1987-01-01 not branch revenue; subsidies/commissions to the branch are branch income; head-office services performed in Taiwan are Taiwan-source taxed through the branch (台財稅第7575300號, 1987-01-09) | GL003002 verbatim | OK |
| Services performed and completed entirely in Taiwan = Taiwan-source (所得稅法 §8(3); pt 4 para 1(一)); own-core-business services → §8(9) (pt 4 last para); composite contracts split by income type (pt 13) | §8 三/九 fetched; FL050237 四 (一) and last para; 十三 | OK. ko/ja/zh cite "제4점 제6항 / 第4点第6項 / 第4點第6項": counted on the page, the 本業 rule is indeed the sixth paragraph of pt 4 |
| 20% withholding on the gross payment to a foreign enterprise with no fixed place and no business agent (扣繳率標準 §3 I item 10; last amended 2021-06-30) | §3 I 十 fetched; 修正日期 110-06-30 | OK |
| zh only: payer is the withholding agent, recipient the taxpayer (§88 I(2), §89 I(2)); pay within 10 days of withholding and file the certificate (§92 II) | §88 I 二, §89 I 二, §92 II fetched | OK |
| §25: construction / technical services, costs hard to allocate, MOF approval, 15% of Taiwan revenue = income, no §39 loss deduction; no branch and no agent → payer withholds at payment (§98-1 item 3); 20% of the deemed income (扣繳率標準 §9); effective 3% stated as arithmetic | §25 I, §98-1 三, §9 fetched | OK. 15% × 20% = 3% correct; every language marks it as computed (계산하면 / 計算上は / works out to / 換算下來) |
| 審查原則 (amended 2023-05-29): technical services include 安裝、檢測、維修、試車、人員訓練 (pt 7(四)1); training materials with proprietary info/secret methods → royalty, split out and refused (pt 7(四)2(5)); manpower dispatch excluded, indicator = host directs/supervises/appraises (pt 8(二)1); no fixed place and no agent → NTB where the payer is located, signed contract copy + Chinese translation (pt 4(四), pt 5(二)); approvals on/after 2023-05-29 ≤ 5 years or shorter contract term (pt 11) | FL042804 verbatim | OK |
| Turnkey: 營建工程 includes 安裝工程、機電工程; design + domestic/foreign equipment procurement + installation + testing + training, inseparable, progress payments = 統包交易 → apply on total revenue, subcontracted parts not deducted (pt 7(二)) | FL042804 七(二)1–2 | OK |
| Korea agreement: parties 駐韓國台北代表部 / 駐臺北韓國代表部, signed 2021-11-17, in force 2023-12-27 (ko body; MOF list) | List row 韓國(原協定) 2021/11/17 → 2023/12/27; korea-zh.txt p.17 「於二○二一年十一月十七日在臺北及首爾簽署」 | OK |
| Korea Art 5(3): construction/assembly/installation or supervision > 6 months; services for the same or connected project > 183 days in any 12-month period; Art 5(4) associated enterprises aggregated, concurrent periods counted once | korea-zh.txt 三(一)(二), 四; korea-en.txt Art 5(3)(4) | OK |
| Japan: private arrangement between 公益財団法人交流協会 and 亜東関係協会, signed 2015-11-26; names changed 2017; in force 2016-06-13, applied in Taiwan from 2017-01-01 (ja) | NTA page (注2: 平成29年1月1日 / 平成29年5月17日); MOF press 2016-06-15 (105年6月13日生效，自106年1月1日適用); japan-zh.txt last page 2015年11月26日東京 | OK |
| Japan Art 5(3): > 6 months; services > 183 days "in any twelve-month period commencing or ending in the taxable year concerned"; no associated-enterprise paragraph | japan-en.txt Art 5 paras 1–7 read in full (para 4 is the exclusion list; no aggregation rule) | OK |
| Vietnam: signed Hanoi 1998-04-06 by TECO in Hanoi / VECO in Taipei; in force 1998-05-06; Art 5(2)(g) > 6 months (quoted); no service-PE clause; no associated-enterprise clause; Art 7(1) | vietnam-en.txt "DONE in duplicate at Hanoi this 06 day of April … 1998"; Art 27 "thirty days after it has been signed"; list 1998/04/06 → 1998/05/06; Art 5 paras 1–6 read in full, no "furnishing of services"; Art 7(1) verbatim | OK (en quote of (g) matches, including the source's own "project of supervisory activities") |
| US: no comprehensive income tax agreement as of October 2026; only item on the MOF list = 1988 shipping & air (en "a 1988 exchange of letters") | List: US appears only in the 單項/海空運輸 table, 1988/05/31; the linked text is headed "EXCHANGE OF LETTERS BETWEEN CCNAA AND AIT … Signed on May 31,1988" | OK |
| Counting rules: construction period from start of work incl. preparatory work to completion or permanent termination, incl. seasonal/temporary stoppages and subcontracted periods (查核準則 §8 I); service days = actual days present, combined, overlaps counted once (§9 I, III); ja: 12-month window = any consecutive 12 months from 12 months before the year's first day to 12 months after its last day (§9 IV) | §8, §9 fetched; 修正日期 114-04-08 | OK |
| Treaty relief not automatic: residence certificate + no-PE proof + income documents to the tax office where the payer is located; on approval the office notifies the withholding agent not to withhold (§23 I); Art 7(1) business profits taxable only in the residence party absent a PE | §23 I fetched; Korea/Japan/Vietnam Art 7(1) read | OK |
| 2026-09-16 order (ko/ja/en, one sentence): branch or 工程場所 may support offshore costs with the head office's financial report certified by a qualified CPA where the head office is located, or a foreign tax authority's certificate; 免經驗證 | GL011760 一(一) and title | OK |
| Business tax: import VAT collected by Customs (§41); base = customs value + import duty (§20 I); taxpayer = consignee/holder (§2 二); 1988-03-28 ruling applies §41 to a foreign contractor's offshore-bought materials/machinery (GL007616, VAT part only); §36 I buyer pays within 15 days from the start of the next period, general-method buyer using the service solely for taxable business exempt; eTax 9105 applies this to foreign repair technicians | all fetched | OK |
| Example arithmetic: ko 4 months, ja/zh 5 months, en Vietnamese crew 5 months < 6 months and < 183 days (ko/ja state the no-connected-project / no-associated-enterprise condition) | — | OK |
| Sources-section amendment/update dates (所得稅法 2026-09-11; 扣繳率標準 2021-06-30; 查核準則 2025-04-08; 營業稅法 2025-05-28; 認定原則 2023-10-13; 審查原則 2023-05-29; rulings 1987-01-09 / 1988-03-28 / 2026-09-16; eTax 2024-07-23; MOF list 2026-09-04; MOF press 2016-06-15) | headers above | OK in all four |

Binding UNVERIFIED items (topics/T19.md, R11): no splitting method or percentage stated; no 認定原則 「保證/安裝」 points cited; income-tax parts of the 1985/1988 rulings not used; agent-sold equipment / PE profit attribution not stated; §25 application limitation period and the 5% rate not stated. Confirmed absent in all four files. Foreign-law statements: ko/ja/en carry one "check with a Korean tax adviser / 日本の税理士 / US tax adviser" line only; zh none. Language versions do not contradict each other on law (same thresholds, rates, dates, article numbers; zh adds §88/§89/§92 which the others defer to column 303).

## 2. Citations

Inline links sit right after the claims; every statute link is the law.moj.gov.tw single-article URL for the article named; agreement links point to the MOF agreement texts (en to the English texts, ko/ja/zh to the 中文 texts); MOF rulings link to law-out.mof.gov.tw; sources sections complete with the check date (2026-10-07) in each language. Internal links: ko 303 + korea-taiwan-tax-agreement-dispatched-engineers-permanent-establishment; ja 303 + japan-taiwan-tax-agreement-semiconductor-expatriates; en 303 + us-equipment-vendor-field-engineers-taiwan-labor-law + 306; zh 303 + 306 — all exist in that language (lint). No batch-4 links, no board link. No issue.

## 3. Rules

No bold, no phone, no street address, email-only contact once near the end, no bookkeeping/filing/audit offer (ko/ja/en/zh offer review of contract fee lines / §25 application documents only), author legal-ai-assistant, no lawyer/CPA/native-review claim, hypotheticals labelled after the scene in every language ((가상의 예입니다) / （架空の例です） / (an invented example) / （虛構情境）), frontmatter per brief (topic tax, tags ["tax-accounting"], audience = file language, en seoTitle 41 chars because title + " | Hovering Law" > 60, en summary within 150–160 and clean). No issue.

## 4. Voice

- ko: 합니다체 throughout; opening scene (경기도 장비회사 → 신주 팹, 넉 달) delivers the question in four sentences; headings specific; one reader question in the body ("엔지니어를 사실상 빌려주는 계약이라면 어떨까요?"); ends on the column's own fact (여섯 달을 넘기면 귀속 이익 질문). Two loan-translation terms fixed (below).
- ja: natural です・ます; 熊本 → 台中 scene, 5か月; "日台民間租税取決め" used correctly, with the private-body explanation and the NTA link; "工事PE" / "恒久的施設（常設機構、PE）" readable for a Japanese finance reader. No edit needed.
- en: plain and active; Oregon toolmaker + Ho Chi Minh City contractor scene fits the US/Vietnam angle; table small and real; closing returns to Tainan. No edit needed.
- zh-hant: Taiwan usage only (面板廠、承辦同仁、請款單、扣繳義務人、營所稅、核准函、照扣); buyer-side angle consistent; three reader questions in the body. No edit needed.

Title check: all four name the column's own object (장비 대금과 설치비 / 装置代金と据付費 / the tool, the installation fee / 設備款與安裝費) and the six-month threshold; none is imperative, clickbait or "A부터 B까지". First paragraphs: deleting the first sentence of each opening would lose the scene's facts (who, where, how long), so they stay.

## 5. Sentence variety

Tool: no FAIL in any file (values above). Self-check items 2–7: no stock opener (scene type ③ as assigned, label after the scene); ≥2 very short sentences in each (ko 5, ja 7, en 11, zh 5); paragraph-start repetition 0–2; caveat chain 0 and at least one citation-free paragraph in each (opening + closing); contrast templates 0; last paragraph ends on the column's facts with a different one-sentence contact line per language; ko 합니다체 / ja です・ます consistent. No MONOTONY finding.

## Issues (Original → problem & reason → fix → facts preserved)

1. ko line 42 — "…공정에 따라 대금을 받는 공사를 통괄 거래(統包交易)로 봅니다." → "통괄 거래" is a character-by-character rendering of 統包交易; Korean practice says 일괄 도급(턴키). Minor wording. → Applied: "…일괄 도급 거래(統包交易)로 봅니다." → 統包交易 label, the 審查原則 pt 7 conditions, "전체 수입으로 제25조를 신청" and the no-deduction rule unchanged.
2. ko line 46 — "[약정 합병문본](…ea19d023…) 제5조 제3항에 따르면" → "합병문본" reads as "merger text" in Korean; the MOF's 合併文本 is a consolidated text (통합본). Minor wording. → Applied: "[약정 통합본(合併文本)](…) 제5조 제3항에 따르면" → same URL (verified to be the consolidated text: its disclaimer names the 2023-12-27 original agreement and the 2026-08-04 amending agreement), same article and content.
3. ko line 73 (sources) — "[한-대만 조세약정 합병문본(중문)]" → same term. → Applied: "[한-대만 조세약정 통합본(合併文本, 중문)]" → URL unchanged.

No major issue. Nothing else required.

## Minor edits applied

- drafts/T19/ko.md: 통괄 거래 → 일괄 도급 거래 (line 42); 약정 합병문본 → 약정 통합본(合併文本) (line 46); sources entry 합병문본(중문) → 통합본(合併文本, 중문) (line 73). Re-run after edits: lint OK (2,759 chars), variety OK (cv 0.582, short 9.1%, contrast 0).
- ja.md, en.md, zh-hant.md: no edits.

## Image

images/T19.webp (1280×720, caption in images/T19.txt: covered machine on a pallet in an empty factory hall). Viewed: a large machine under a plain beige cover on a wooden pallet in an empty industrial hall with skylights and bare concrete floor. No faces, text, logos, flags or readable documents; nothing identifiable; calm and respectful; fits "equipment delivered, installation ahead". Image verdict: OK.

## Notes for the integrator (no action required)

- The MOF list now also shows a Korea amending agreement signed and effective 2026-08-04 (renaming Korea's ministry after its 2026-01-02 reorganisation). It does not touch Article 5 or 7; the ko column correctly dates the original agreement (signed 2021-11-17, in force 2023-12-27) and links the consolidated text.
- The en phrase "a 1988 exchange of letters" is supported by the heading of the MOF-hosted text (cross-sources/us-shipping-air-1988-en.txt), reached from the cited list page.

VERDICT: PASS
