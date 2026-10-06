# T13 final review (Claude Fable 5.1, round 1) — selling-shares-taiwan-company-securities-transaction-tax-agreements

Verdict: PASS — ko, ja, en, zh-hant publishable now; image OK.
Review run 2026-10-06 (KST) 23:3x – 2026-10-07 01:5x (interrupted once by an API rate limit; resumed from the saved sources). Four minor wording edits applied (section D); no fact, number, citation or hypothetical label changed. lint.py prints OK for all four files; variety_metrics.py prints "OK — no variety limit violated" for all four.

## A. Scope checked — every official page opened by me (saved under reviews/T13/sources/)

Statutes, law.moj.gov.tw single-article pages via fetch_law.py (fetched 2026-10-06; header = latest amendment date on the LawAll page) → `sources/statutes.md`:
- 證券交易稅條例 G0340078 (修正 民國114年01月02日) §2, §3, §4, §6
- 所得稅法 G0340003 (修正 民國115年09月11日) §4-1, §4-4, §24-5
- 所得稅法施行細則 G0340004 (修正 民國111年02月21日) §60
- 所得基本稅額條例 G0340115 (修正 民國110年01月27日) §3, §7
- 公司法 J0080001 (修正 民國114年12月26日) §162
- 外國人投資條例 J0040002 (修正 民國86年11月19日) §2, §10, §12
- 經濟部處務規程 J0010001 (修正 民國112年09月25日) §9, §19
- LawHistory G0340003 (`sources/hist-G0340003.txt`, 2026-10-06): entry 67 「一百十年四月二十八日…修正公布第4-4、4-5、14-4～14-6、24-5、126條條文；依第126條規定：自一百十年七月一日施行」; entry 61 (§4-1 amended 104-12-02, in force 105-01-01); entries 70–71 (2025-12-26 and 2026-09-11 touched only §17/§126).
- LawHistory G0340078 (`sources/hist-G0340078.txt`, 2026-10-06): entry 13 「一百十四年一月二日…修正公布第2-2、12條條文」; entry 12 (§3 in force six months after 2023-05-10).

MOF / law-out / eTax / NTB (fetched 2026-10-06):
- law-out.mof.gov.tw GL006416 台財稅第38498號, 公發布日 民國67年12月26日 (`sources/GL006416.txt`)
- law-out.mof.gov.tw GL006247 台財稅第841632176號, 公發布日 民國84年06月29日 (`sources/GL006247.txt`)
- law-out.mof.gov.tw GL009961 房地合一課徵所得稅申報作業要點, 修正日期 民國115年04月21日, 台財稅字第11504560890號令 — points 2, 3, 4, 6, 7, 23, 28 read (`sources/GL009961.txt`)
- eTax Q&A 2301 (更新日期 106-03-20), 6104 (113-06-12), 1144 (115-04-10) (`sources/etax-*.txt`)
- 財政部臺北國稅局 release on mof.gov.tw, 發布日期 2025-12-11 (`sources/mof-ntbt-20251211.txt`)
- MOF 我國所得稅協定一覽表, 發布/更新日期 2026-09-04 (`sources/mof-agreement-list.txt`): 日本 2015/11/26 signed · 2016/06/13 in force; 韓國(原協定) 2021/11/17 · 2023/12/27, 韓國(修正協議) 2026/08/04; 越南 1998/04/06 · 1998/05/06; 單項/海空運輸協定 table: 美國 海空運S&A 1988/05/31(77年); the US is not in the 全面性協定 table.
- MOF-hosted US shipping/air text (fetched 2026-10-07, `sources/us-ships-aircraft-en.txt`): heading "EXCHANGE OF LETTERS BETWEEN CCNAA AND AIT … Signed on May 31,1988; Entered into force on May 31, 1988".

Agreement texts (MOF downloads, fetched 2026-10-06, pdftotext → `sources/*.txt`):
- Korea original zh c73d0ce06a654aed88df936485e60a53 and consolidated zh ea19d023141d4d3dbfbd122d99081c86 (title 駐韓國台北代表部與駐臺北韓國代表部避免所得稅雙重課稅及防杜逃稅協定; Art 13 ¶4–¶6 identical in both; Art 23 ¶2(一) read); consolidated en 9679b16a87cd418ca479db4f947a588e (Art 13 ¶4–¶6).
- Japan en 10462 (title "AGREEMENT BETWEEN THE ASSOCIATION OF EAST ASIAN RELATIONS AND THE INTERCHANGE ASSOCIATION…", signed in Tokyo November 26, 2015; Art 13 ¶4–¶5; Art 22 ¶1) and zh 10422 (Art 13, Art 22).
- Vietnam zh 6b9255566aab4b9084c085ddc921138e and en 66dc13da4e8449698e42d6b818549c52 (Art 13 ¶3, ¶5).
- 国税庁 nta.go.jp/taxes/shiraberu/kokusai/nichitai/01.htm (Shift_JIS; fetched 2026-10-06, `sources/nta-nichitai-01.txt`): 平成27年11月26日 signing, 注1 (not a treaty concluded by Japan), 注2 (renamed 日本台湾交流協会 from 平成29年1月1日, 台湾日本関係協会 from 平成29年5月17日).

Also read: brief-BATCH.md, brief-EDITORIAL-VOICE.md, SENTENCE-VARIETY-RULE.md §5–6, LESSONS.md, topics/T13.md (incl. the binding R8 notes), research/R8-statutes.md, R8-official.md Part 1, T13-extra.md, LINKS.md, drafts/T13/facts.md (not relied on), images/T13.webp + T13.txt.

## B. Law and facts — verification result per claim (all four languages)

Every rate, threshold, date, article number, agreement term and procedure in the four files matches the official text I opened. Items the R8 notes mark UNVERIFIED are absent in all four languages (checked by reading: no collection rule for a foreign buyer, no 20% or deadline for non-securities gains, no filing deadline for the deemed house/land return, no MOEA forms/timelines/fees, no statement that Korea's "shares" covers 出資額).

1. STT 0.3% charged to the seller (證交稅條例 §2 ¶1 item 1) — ko/ja/en/zh ✓. Collection agent: broker (§4 ¶1 item 2) / transferee in a direct transfer (§4 ¶1 item 3) ✓; collected on the settlement day, paid the next day (§3 ¶1) ✓. NT$1 bn → NT$3 m arithmetic ✓. Issuing company checks the 上手 receipt, reports non-payment, liable if it does not (§6 ¶2–3) ✓.
2. §4-1 suspension since 民國79年1月1日 (1990-01-01), losses not deductible ✓ (the 2016 date is correctly not used; sources sections say §4-1 last amended per LawHistory only implicitly — fine). eTax 2301 applies it to enterprises selling listed and unlisted shares ✓ (更新 106-03-20 ✓).
3. AMT: §7 ¶1 item 1 add-back for Taiwan enterprises ✓; §3 ¶1 item 5 exclusion for enterprises with neither fixed place nor business agent ✓ — all four say it as "both absent" ✓.
4. Non-securities: 有限公司 出資額 = 財產交易 (台財稅第38498號, 67-12-26) ✓; unissued-certificate 股份有限公司 transfer instruments not securities (eTax 6104) ✓; unattested printed certificates = transfer of 出資額 (台財稅第841632176號, 84-06-29; 公司法 §162 ¶1 bank 簽證) ✓; gain = 財產交易所得 (eTax 1144) ✓. Rate/base/deadline for a foreign seller: stated only as "confirm with the tax office / CPA" ✓.
5. §4-4 ¶3: seller holds >50% directly/indirectly, ≥50% of the company's 股權/出資額 value is Taiwan 房屋、土地, 上市/上櫃/興櫃 excluded ✓ (ko, ja, zh prose; en 3-item list). In force 2021-07-01 (LawHistory entry 67; NTB release) ✓. 要點 pt 6 ¶1: >50% on any day in the year before the transaction ✓; ¶2: numerator includes 其控制之事業 real estate ✓; 修正 115-04-21 ✓.
6. §24-5 ¶2 item 2 foreign-HQ: 45% ≤2 years, 35% >2 years, computed separately ✓; 20% tier only in item 1 (domestic HQ) ✓. 要點 pt 23 ¶2 + 施行細則 §60 ¶2: approved agent files at the agent's tax office ✓.
7. NTB example (2025-12-11): 60% holder sold 6萬股 of 60萬股 = 10% (arithmetic ✓), bought 111-10-20 sold 112-07-30 (<1 year ✓), reassessed at 45%, 2百萬餘元 + 罰鍰 ✓ (ko 과태료, ja 過料 = administrative fine ✓).
8. Transitional rule 要點 pt 2 ¶4: shares acquired ≤110-06-30, ratio of real estate acquired ≤104-12-31 → outside the rule ✓. ja invented example (2008 plant, labelled 架空の例です): ratio 100% → whole P/L outside ¶3 — arithmetic and logic ✓ (it does not claim the gain is tax-free).
9. Tables (ko/ja/zh) — "STT follows the securities split" for property-rich shares: consistent with 證交稅條例 §1 and 要點 pt 3 ✓.
10. Korea Art 13 ¶4 (>50%), ¶5 (≥25% of capital at any time in the prior 12 months), ¶6 (residence only) ✓ in ko, en table, zh table, en FAQ3. Agreement name and 2023-12-27 effective date ✓. Art 23 ¶2(一) credit clause (ko) ✓. ko "100% parent exceeds 25%" ✓.
11. Japan Art 13 ¶4 (≥50% of the value of its property), ¶5 (residence only), no 25% rule ✓ in ja, en, zh; Art 22 ¶1 credit clause (ja) ✓; private arrangement 2015-11-26, not a treaty, both bodies renamed (NTA) ✓; en "signed by the Association of East Asian Relations and the Interchange Association, both since renamed" ✓.
12. Vietnam Art 13 ¶3 (wholly or principally), ¶5 ✓ (en, zh). US: no comprehensive agreement; only entry is the 1988 shipping/air instrument (list) — "exchange of letters" wording is supported by the MOF-hosted text's own heading (S5), ✓.
13. 外國人投資條例 §10 ¶2 joint application ✓, §2 經濟部 ✓, §12 ¶2 lump-sum remittance incl. capital gains ✓; 投資審議司 since 112-09-26 (處務規程 §9, §19) ✓.
14. Cross-language consistency: the same thresholds, rates, dates and conditions in all four; openings differ by reader (Korean / Japanese / US / foreign parent) but the legal core is identical ✓. Home-country tax (KR/JP/US/VN) appears only as "check with a local adviser" plus the agreement credit clause ✓.
15. Sources-section amendment/update dates all match the pages opened (證交稅條例 2025-01-02; 所得稅法 2026-09-11; 施行細則 2022-02-21; 基本稅額條例 2021-01-27; 公司法 2025-12-26; 外投條例 1997-11-19; 處務規程 2023-09-25; 要點 2026-04-21; eTax 2301/6104/1144 dates; NTB 2025-12-11; list 2026-09-04) ✓. Check date 2026-10-06 present in all four ✓.

## C. Citations, rules, voice, variety, image

- Citations: inline links sit right after each claim; statute links point to the right pcode/flno (verified against `sources/statutes.md`); agreement links go to the MOF texts; sources sections list everything used. Internal links /{lang}/columns/taiwan-dividend-withholding-foreign-parent-tax-agreement-rates, /{lang}/columns/withdraw-capital-taiwan-company, /en/columns/vietnamese-companies-taiwan-vietnam-tax-agreement exist (lint OK).
- Rules: no bold, no phone, no street address, email only, no bookkeeping/filing/audit offer, author legal-ai-assistant, no lawyer/CPA/native-review claim, hypotheticals labelled (ko 가상의 예입니다; ja 架空の例です), frontmatter per brief (topic tax, tags ["tax-accounting"], en seoTitle 43 chars because title + " | Hovering Law" > 60; en summary 150–160 chars) — lint OK ×4.
- Voice: opening type ② (reader's question) in all four as assigned; T12/T14/T15/T16 use ①/⑥/⑤/③, so no overlap. ko 합니다체 throughout; ja です・ます throughout (variety tool: no register mix); en plain and active; zh-hant Taiwan usage (國稅局、營所稅、會計師、代徵、罰鍰), no mainland terms or simplified characters (lint). Titles specific, first paragraphs deliver the answer, headings are column-specific, no AI filler, last paragraph ends on the column's facts in all four.
- Variety (variety_metrics.py check, after edits): ko cv 0.483 short 0.089 cite_end 0.161 contrast 0 q 3 — OK; ja cv 0.505 short 0.095 contrast 1 caveat 1 q 1 — OK; en cv 0.544 short 0.20 contrast 0 q 3 — OK; zh-hant cv 0.543 short 0.108 contrast 0 q 3 — OK. Self-check items 2–7 all met (no stock opener; ≥2 very short sentences; no 3 paragraphs with the same first word; no claim→statute→caveat run; ≥1 citation-free paragraph; contrast ≤3; factual ending). No MONOTONY finding.
- Image (images/T13.webp): empty modern lobby, two sage armchairs facing across a pale stone table, eucalyptus in a vase, morning light. No faces, text, logos, flags or documents; fictional; respectful; fits the "handover" theme of a share sale. Verdict: OK.

## D. Issues found (all minor) — Original → problem & reason → fix → facts preserved

1. ko body (약정 제13조 paragraph). Original: 「가치의 50%를 넘는 부분이 직접·간접으로 대만 부동산에서 나오는 주식의 양도차익은 대만이 과세할 수 있습니다.」 → Problem: "50%를 넘는 부분이 … 나오는" reads as "the portion above 50% comes from real estate", an awkward rendering of 「該股份超過百分之五十之價值直接或間接來自於他方領域之不動產」 (shares deriving more than 50% of their value from immovable property). → Fix (applied): 「주식 가치 가운데 직접·간접으로 대만 부동산에서 나오는 비율이 50%를 넘으면 그 주식의 양도차익은 대만이 과세할 수 있습니다.」 → Preserved: >50% threshold, direct/indirect, Taiwan may tax (得予課稅), Art 13 ¶4 link.
2. ko opening. Original: 「주권을 발행한 주식회사의 주식이라면 원칙적으로 차익에는 소득세가 붙지 않고」 → Problem: ja and zh openings say "bank-attested" certificates; the ko body (section 2, 台財稅第841632176號) makes the same distinction, so the opening was slightly looser than the other languages. → Fix (applied): 「은행 사증을 받은 주권을 발행한 주식회사의 주식이라면 …」 → Preserved: the rule and all numbers; the frontmatter summary ("주권을 발행한") left as is, since a validly issued 주권 under 公司法 §162 is an attested one and the body explains it.
3. zh-hant heading. Original: 「## 四國協定第13條」 → Problem: the US row in the table has no agreement, so "four countries' agreements" misdescribes the table. → Fix (applied): 「## 母公司所在國的協定第13條」 → Preserved: table content and all four rows unchanged.
4. zh-hant agreement paragraph. Original: 「母公司在本國能否扣抵，請母公司洽詢其本國稅務顧問。」 → Problem: "母公司 … 請母公司" repeats the subject in one sentence (translationese). → Fix (applied): 「母公司在本國能否扣抵，請洽詢其本國的稅務顧問。」 → Preserved: general-caution wording only, no home-country rule stated.

Observations, no change required:
- en "the only US entry is a 1988 exchange of letters on shipping and air transport": the list page itself labels the row 海空運S&A 1988/05/31; "exchange of letters" comes from the MOF-hosted instrument's heading (saved in sources). Accurate.
- ko/ja/en/zh say §4-4 and §24-5 are "2021-07-01 condition texts" in the sources sections; LawHistory entry 67 supports this for the current wording (the articles themselves were first added in 2015 for 2016-01-01; the share rule in ¶3 and the current rate list date from the 2021 amendment). Not misleading.
- The Korea amending agreement effective 2026-08-04 changes only Art 3 ministry names (R8, consolidated-text disclaimer); the ko column's "2023년 12월 27일 발효" refers to the original agreement whose Art 13 is quoted. Correct as written.
- Contact paragraph sits before the final factual paragraph in all four; this satisfies both "near the end, before sources" and "last paragraph ends on the column's facts".

## E. Minor edits applied (files touched)
- drafts/T13/ko.md: items D1, D2. lint OK (3218 chars); variety OK.
- drafts/T13/zh-hant.md: items D3, D4. lint OK (2233 chars); variety OK.
- drafts/T13/ja.md, drafts/T13/en.md: no edits. lint OK (3722 chars / 1575 words); variety OK.

## F. Image verdict
OK — images/T13.webp fits the column, fictional and unidentifiable (no faces, text, logos, flags, readable documents), respectful.

VERDICT: PASS
