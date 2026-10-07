# T24 cross-review r1 — taiwan-free-trade-zone-bonded-factory-science-park-tax (ko, ja, en, zh-hant)

Reviewer: Lane A (Claude Fable 5.1), final gate. Date: 2026-10-07 (KST).
Files reviewed: drafts/T24/ko.md, ja.md, en.md, zh-hant.md, facts.md; topics/T24.md (binding R14 notes); research/R14-T24-official.md, R14-T24-statutes-curl.md (treated as untrusted); images/T24.webp.

## Verdict

PASS — all four languages publishable now; image OK. No major issue found. Six minor wording edits applied (listed below); lint OK and no variety FAIL on every file after the edits.

## Scope checked — official pages I opened myself on 2026-10-07 (saved under reviews/T24/cross-sources/)

Statutes (law.moj.gov.tw LawSingle via fetch_law.py/curl; header date = 修正日期 on LawAll):
- 自由貿易港區設置管理條例 A0020051 — 修正日期 民國108-01-16 — §4, §13, §21, §23, §29 → A0020051.md
- 營利事業於自由貿易港區從事貨物採購輸入儲存或運送免徵營利事業所得稅辦法 K0080027 — 108-10-09 — §4, §5, §6, §7, §8, §10 → K0080027.md
- 自由貿易港區事業營運管理辦法 K0080016 — 113-10-16 — §2; 自由貿易港區貨物通關管理辦法 G0350057 — 114-05-09 — §18 → K0080016_G0350057.md
- 加值型及非加值型營業稅法 G0340080 — 114-05-28 — §5, §6-1, §7, §41 → G0340080.md
- 關稅法 G0350001 — 111-05-11 — §58, §59, §60 → G0350001.md
- 保稅倉庫設立及管理辦法 G0350006 — 115-07-20 — §45; 海關管理保稅工廠辦法 G0350005 — 115-06-12 — §4; 物流中心貨物通關辦法 G0350049 — 114-01-14 — §5, §18 → G0350006_G0350005_G0350049.md
- 科學園區設置管理條例 H0160004 — 107-06-06 — §4, §5, §23; 所得稅法 G0340003 — 115-09-11 — §73 → H0160004_G0340003.md
Histories / old version (curl, saved as .html + stripped .txt):
- LawHistory A0020051 — entries 92-07-23, 98-07-08, 101-12-28, 108-01-16 (108-01-16 = 修正公布第29條) → A0020051_history.*
- LawHistory H0160004 — 107-06-06 修正名稱及全文; 111-07-27 行政院院臺規字第1110182320號公告: 「科技部」之權責事項自111-07-27改由「國家科學及技術委員會」管轄; nothing later → H0160004_history.*
- LawOldVer A0020051 lnndate=20121228 lser=001 — 修正日期 民國101-12-28; old §29 I: 「外國營利事業或其在中華民國境內設立之分公司，自行申設或委託自由港區事業於自由港區內從事貨物儲存或簡易加工，並將該外國營利事業之貨物售與國內、外客戶者，其所得免徵營利事業所得稅。但當年度售與國內客戶之貨物，超過…百分之十者，其超過部分不予免徵。」 → A0020051_oldver_20121228.*
MOF / eTax:
- law-out.mof.gov.tw LawContent.aspx?id=GL010422 — 台財稅字第10600664060號令, 發文日期 民國107-04-17; items 一–五 read; 二(一) 3%, 二(二)1 3%+cost share capped 100%, 二(三) higher actual ratio assessed on facts, 三 commissioned Taiwan enterprise (含自由貿易港區事業、保稅倉庫業者) = 營業代理人 filing under 所得稅法§73 II → MOF_GL010422.*
- etax.nat.gov.tw Q&A 9209 「保稅區營業人銷貨至國內課稅區，處理手續如何？」 更新日期 110-04-22 → etax_zNwqJNe.*
English titles (law.moj.gov.tw/ENG LawAll, for the en sources list): A0020051 "Act for the Establishment and Management of Free trade zones" (2019-01-16); H0160004 "Act for Establishment and Administration of Science Parks" (2018-06-06); K0080016 "Regulations Governing the Operation and Management of Free Trade Zones Enterprises" (2024-10-16); G0350057 "Regulations Governing Customs Clearance for Goods in Free Trade Zones" (2025-05-09); G0350006 "Regulations Governing the Establishment and Management of Bonded Warehouses" (2026-07-20); G0350049 "Regulations Governing Customs Clearance for Goods in Logistics Centers" (2025-01-14); G0350005 "Regulations Governing Customs Bonded Factories" (2026-06-12); K0080027 "Regulations Governing Profit-seeking Enterprise Income Tax Exemption for Profit-seeking Enterprises Conducting Procurement and/or Importation and/or Storage and/or Delivery of Goods in Free Trade Zones" (2019-10-09); G0340080 "Value-added and Non-value-added Business Tax Act" (2025-05-28); G0350001 "Customs Act" (2022-05-11); G0340003 "Income Tax Act" (2026-09-11) → ENG_*.html/.txt
Internal link existence: lint.py (glob on the repo) OK for /{lang}/columns/taiwan-business-tax-vat-e-invoice-foreign-subsidiary in all four languages.

## 1. Law and facts — result per claim (all four languages checked sentence by sentence)

All of the following are stated identically in substance across ko/ja/en/zh-hant and match the official text I fetched:
- 條例 §29 I current rule (any 營利事業; Taiwan activity only preparatory/auxiliary; itself or via FTZ enterprise; 採購/輸入/儲存/運送 in the zone; approval by 自由港區管理機關; income from selling the goods exempt) — correct. §29 IV sunset 131-12-31 = 2042-12-31; §29 V applies from 108年度 (tax year 2019) returns; §29 VI old approvals at most to 110-12-31 = 2021-12-31 — all correct, ROC→AD arithmetic verified. "Requirements changed in 2019" = promulgated 2019-01-16 (history entry 4) — correct.
- Old 2012 rule described only as history, without the 10% cap (binding note) — correct paraphrase of the 101-12-28 text.
- 辦法 §4 (foreign-law entity presumed preparatory/auxiliary; three exceptions; functions/risks/assets "非屬核心、必要及重要" test) — correct in all four.
- 辦法 §5 (sell abroad or in Taiwan only via brokers/general commission agents/other independent agents; buyers not natural persons; storage/transport = non-transforming work 保存、分類、分級、分裝、包裝、重貼標籤、切割; domestic sales of Taiwan-procured goods limited to the two listed cases) — correct; ko/en list the operations with "처럼/such as", acceptable.
- 辦法 §6 (certificate application to the zone's 自由港區管理機關 before the end of the 3rd month of the fiscal year following the income year; max 5 years; declaration of effective management abroad, plan, commissioning contract + 中文簡譯本) — correct. "Calendar-year 2026 income → end of March 2027" arithmetic correct.
- 辦法 §7 (timely annual return with certificate copy + 租稅獎勵表, 當年度始得免徵; enterprise with no fixed place of business and no business agent appoints, with tax-office approval, a resident individual or an enterprise with a fixed place of business) — correct. ko says "외국 회사" for §7 IV's "營利事業": narrower than the text but true for that case; not an error.
- 辦法 §10 (change of commissioned FTZ enterprise/content or renewal → new application) — correct.
- 條例 §21 (seven items for 供營運 goods; no 免徵/擔保/記帳/押稅 procedures; self-use machinery exempt, recaptured if to 課稅區 within 5 years) — correct. 條例 §23 (zone→課稅區 taxed as import with the same seven items; processed/rearranged goods valued at exit-form price minus zone value added) — correct. 條例 §13 permits; 營運管理辦法 §2 II company or foreign company's Taiwan branch — correct. 通關管理辦法 §18(7) unlimited storage, over-2-year report when customs needs it — correct.
- 營業稅法 §5(2) bonded goods from 保稅區 into other areas = import; §41 customs collects; §6-1 bonded-area list; §7(4) zero rate (all); §7(8)(9) (ja, en) — correct. eTax 9209 (buyer files import declaration; 保稅區 seller issues no 統一發票; updated 2021-04-22) — correct.
- 關稅法 §58 I (bonded warehouse re-export within period, as is or after rearrangement, duty-free), §58 IV (registration + 保證金), §59 (bonded factory), §60 (logistics centre; rearrangement and simple processing; re-export duty-free) — correct. 保稅倉庫辦法 §45 (2 years, 不得延長, exceptions approved by customs) — correct simplification. 保稅工廠辦法 §4 (NT$50m paid-in capital + registered factory + conditions; foreign branch NT$50m remitted and registered + registered factory) — correct. 物流中心辦法 §5 (NT$150m; foreign branch NT$150m remitted), §18 (generally unlimited) — correct.
- MOF 107-04-17 order — date, number, 營業代理人 mechanism, §73 II, "3% of the total profit of the whole transaction flow" (never "3% of revenue"), 3% + Taiwan processing-cost share capped at 100%, higher actual ratio assessed on facts — correct in all four; the "計算困難" condition is preserved.
- 科學園區條例 §23 (exemptions for 園區事業; machinery recaptured within 5 years; materials etc. taxed when to 課稅區; exports zero-rated + 貨物稅-free), §4 (科學事業 must be a company/branch/other business organisation; R&D share of revenue), §5 (園區事業 = 科學事業 + approved service enterprises); authority to 國家科學及技術委員會 by 2022-07-27 notice — correct. "Not an option for a re-export trading company" is the inference the binding note allows.
- Binding "Do NOT state" list respected: no agency named as 自由港區管理機關, no zone count, no business-tax registration/agent claim for foreign sellers, no Invest Taiwan "第20條", no 科學園區保稅業務管理辦法 details, no Korean/Japanese/US/Vietnamese tax statements, no "deferred" wording (ko "납부를 미루는 것이 아니라", ja "繰り延べではなく", en "Nothing is deferred", zh "談不上緩繳" — the reader's own "defer" question is in the brief and FAQ 2, so these are not rebuttals of an unmade claim).
- Hypotheticals (ko Seoul cosmetics company, ja Osaka parts maker, en Ho Chi Minh City trader, zh Los Angeles parts dealer) are labelled, restate only §5's sell-abroad / independent-agent condition, and promise no outcome.
- No contradiction between language versions on any date, threshold, article number or condition.

## 2. Citations

Inline links sit right after each claim; every statute link is the LawSingle URL of the article cited (pcode/flno checked against the fetched articles); the old rule links the LawOldVer page; MOF order links law-out.mof.gov.tw GL010422; eTax links Q&A 9209. Sources sections list every source used with the law's amendment date (dates match the LawAll headers I fetched, incl. 所得稅法 115-09-11 and the 科學園區條例 2022-07-27 authority note) and the check date 2026-10-07. en official English titles match law.moj.gov.tw/ENG. One internal link per language (321 column), which exists; board link not used; no links to batch-4 columns.

## 3. Rules

No bold, no phone, no street address, email-only contact (one soft paragraph before the closing fact paragraph, firm named in each language's form), no bookkeeping/filing/audit offer, author legal-ai-assistant, no lawyer/CPA/native-review claim, hypotheticals labelled after the scene. Frontmatter per brief: topic "tax", tags ["tax-accounting"], audience = file language, categories per language, featured_image NNN path, 2–3 FAQ items consistent with the body; ko/ja/zh seoTitle ≤32 and different from title; en title + " | Hovering Law" > 60 so seoTitle present (43 chars); en summary 150–160 chars without forbidden characters (lint OK on all four).

## 4. Voice

ko: natural 합니다체 throughout, one "~지요", title and headings specific (e.g. "증명서는 다음 회계연도 셋째 달 말까지"), first paragraph answers the reader's question. ja: です・ます throughout, no だ・である, headings natural, "日台民間租税取決め" not needed (no agreement content). en: plain, active, no "delve/navigate/It is important to note". zh-hant: Taiwan usage (營所稅, 統一發票, 稽徵機關, 經銷商, 聘業務), no mainland vocabulary or simplified characters (lint). No AI filler, no checklist headings, no templated closing; each closing paragraph ends on this column's facts (2042-12-31 sunset / certificate deadline).

## 5. Sentence variety (variety_metrics.py, after edits)

- ko: cv 0.519, short 10.9%, run3 1.6%, cite_end 14.1%, contrast 1, caveat 1, q 3 — no FAIL (WARN only: 77% 니다 endings, normal for 합니다체).
- ja: cv 0.491, short 9.5%, run3 2.8%, cite_end 14.9%, contrast 1, caveat 0, q 2 — no FAIL (WARN only: desu-masu share).
- en: cv 0.578, short 23.6%, run3 4.3%, cite_end 15.3%, contrast 0, q 5 — OK.
- zh-hant: cv 0.661, short 10.9%, run3 0, cite_end 17.4%, contrast 0, q 1 — OK.
Section-5 self-check 2–7: opening type ② (reader's question) in all four, no stock opener; ≥2 very short sentences each; no paragraph-initial word three times; no three consecutive claim→caveat paragraphs and uncited paragraphs present; contrast ≤1; last paragraph on the column's facts. Manual counts: ko "해야 합니다" 4 (limit 4), "할 수 있습니다" 0; ja "ことができます" 0, "必要があります" 0, paragraph-initial 台湾 1; zh 但 3, 應 3, 必須 1. No MONOTONY finding.

## Issues (Original → problem & reason → fix → facts preserved)

No major issue. Minor items, all fixed directly:

1. ja §21 list — Original: 「関税、貨物税、営業税、菸酒税、菸品健康福利捐、推廣貿易服務費、商港服務費がかかりません。」 → Problem: four items are Chinese-only names a Japanese reader cannot parse (菸 is not a Japanese kanji); naturalness only. → Fix (applied): added glosses 「菸酒税（たばこ・酒税）、菸品健康福利捐（たばこ健康福祉負担金）、推廣貿易服務費（貿易推進サービス費）、商港服務費（商港サービス費）」. → Facts preserved: same seven items, same citation.
2. ja hypothetical — Original: 「大阪の電子部品メーカーが、東京本社の営業部を通じて…」 → Problem: "Osaka maker" with a "Tokyo head office" reads as a slip. → Fix (applied): 「大阪に工場を持つ電子部品メーカーが、東京本社の営業部を通じて…」. → Facts preserved: scene, label （架空の例です）, §5 condition unchanged.
3. en bonded factory — Original: "requires a registered factory plus either NT$50 million of paid-in capital in a company limited by shares, which must also meet financial and facility conditions, or NT$50 million of operating capital actually remitted and registered by a foreign company's Taiwan branch." → Problem: attaches the financial/facility conditions to the company only, while 保稅工廠辦法 §4 II lets a foreign branch apply "依前項規定", i.e. under the same paragraph's conditions (https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0350005&flno=4). → Fix (applied): "requires a registered factory and the regulation's financial and facility conditions, plus either NT$50 million of paid-in capital in a company limited by shares or NT$50 million of operating capital actually remitted and registered by a foreign company's Taiwan branch." → Facts preserved: both NT$50 million thresholds, registered factory, citation.
4. zh-hant bonded factory — Original: 「申請者須有登記合格的工廠，股份有限公司實收資本額須在新臺幣5,000萬元以上並符合財務等條件，外國分公司須實際匯入並登記營業資金5,000萬元以上」 → same scope point as item 3. → Fix (applied): 「申請者須有登記合格的工廠並符合財務等條件，股份有限公司實收資本額須在新臺幣5,000萬元以上，外國分公司須實際匯入並登記營業資金5,000萬元以上」. → Facts preserved: thresholds and citation unchanged.
5. zh-hant closing — Original: 「每一年度仍須有證明函，並在結算申報時申請。」 → Problem: could be read as a new certificate every year, whereas 辦法 §6 allows one certificate for up to five years and §7 requires the annual claim. → Fix (applied): 「每一年度仍須有涵蓋該年度的證明函，並在結算申報時申請。」 → Facts preserved: 5-year certificate (body), annual claim, 2042-12-31.
6. ko §21 list — Original: 「무역진흥서비스료, 상항서비스료가 면제됩니다.」 → Problem: 「상항」 is an opaque transliteration of 商港. → Fix (applied): 「상항(商港)서비스료」. → Facts preserved.

Observations left as is (not errors): ko 「세관이 승인한 특별한 경우」 and the ja/en/zh equivalents compress 保稅倉庫辦法 §45's list (key industrial raw materials, daily necessities, key construction materials or other special reasons approved by customs) into "special cases approved by customs" — acceptable summary. en "core, necessary or important" renders the negated conjunction 「非屬核心、必要及重要」 reasonably.

## Minor edits applied (lint OK, no variety FAIL after each)

- drafts/T24/ja.md: glosses for 菸酒税/菸品健康福利捐/推廣貿易服務費/商港服務費; 「大阪に工場を持つ電子部品メーカー」. Length 4,383 chars.
- drafts/T24/en.md: bonded-factory conditions sentence (item 3). Length 1,589 words.
- drafts/T24/zh-hant.md: bonded-factory conditions sentence (item 4); closing sentence 「涵蓋該年度的證明函」 (item 5). Length 2,681 chars.
- drafts/T24/ko.md: 「상항(商港)서비스료」. Length 3,486 chars.
Commands run after edits: `python3 lint.py drafts/T24/<lang>.md <lang> taiwan-free-trade-zone-bonded-factory-science-park-tax` → OK ×4; `python3 shared/variety/variety_metrics.py check drafts/T24/<lang>.md --lang <lang>` → no FAIL ×4 (ko/ja WARN on ending share only).

## Image

images/T24.webp: a generic logistics warehouse with loading docks and three plain white trucks at dawn, misty hills behind. No faces, no readable text, no logos, no flags, no documents; fictional and unidentifiable; fits a bonded-warehouse/free-trade-zone column; respectful. Image verdict: OK.

VERDICT: PASS
