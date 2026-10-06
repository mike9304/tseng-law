# T7 final review r1 — Claude Fable 5.1 — 2026-10-06 (KST)

Column: taiwan-business-tax-vat-e-invoice-foreign-subsidiary (ko, ja, en, zh-hant)
Files reviewed: drafts/T7/ko.md, ja.md, en.md, zh-hant.md, facts.md; research/R3b-statutes.md, R3b-official.md, T7-extra.md; topics/T7.md; brief-BATCH.md; brief-EDITORIAL-VOICE.md; shared/SENTENCE-VARIETY-RULE.md §5–6; shared/LESSONS.md (skimmed); LINKS.md; images/T7.webp; img-prompts/C7.txt.

## Verdict

PASS — all four languages publishable now, after the minor precision edits listed below. No major (law/fact/citation/rule) issue found. Image OK.

## Scope checked — official pages I opened myself (all on 2026-10-06, saved under reviews/T7/sources/)

Statutes (law.moj.gov.tw single-article pages via fetch_law.py → `sources/statutes-fable.md`; each law header carries its latest amendment date as shown on LawAll):
- 加值型及非加值型營業稅法 (G0340080), 修正日期 民國114年05月28日 = 2025-05-28: §2, §4, §6, §7, §10, §15, §19, §28, §32, §32-1, §33, §35, §36, §38, §39, §48-2, §49, §51
- 加值型及非加值型營業稅法施行細則 (G0340081), 2024-12-17: §11, §38-1
- 統一發票使用辦法 (G0340082), 2024-12-12: §3, §4, §7
- 稅籍登記規則 (G0340087), 2022-08-08: §3, §4
- 法規沿革 https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=G0340080 → `sources/lawhistory-G0340080.html/.txt` (entry 44: 113-08-07 增訂第48-2條; 行政院 113-08-30 令 定自114年1月1日施行)

MOF / eTax / DOT pages (curl -sL):
- 財政部稅務入口網 營業稅節稅手冊「課稅方式」 https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-saving-manual/national/business-tax/6opmkDW → `sources/etax-6opmkDW.html/.txt` (更新日期 111-06-21; 一般稅額計算 5%)
- 財政部公告 113.12.12 台財稅字第11304654280號 https://law-out.mof.gov.tw/LawContent.aspx?id=GL011540 → `sources/mof-GL011540.html/.txt` (主旨…並自中華民國一百十四年一月一日生效)
- Attachment 時限表 PDF https://law-out.mof.gov.tw/Download.ashx?FileID=52119&id=GL011540&type=LAW → `sources/mof-GL011540-table.pdf/.txt` (pdftotext; 營業人 7日 / 非營業人 2日, both 翌日起算; 末日為星期六、星期日、國定假日…不予延長; 不可抗力 → 事由消滅之翌日起算三日內申請可補正時限)
- 電子發票實施作業要點 https://law-out.mof.gov.tw/LawContent.aspx?id=FL041411 → `sources/mof-FL041411.html/.txt` (修正日期 民國115年04月22日 = 2026-04-22; 第7點 verbatim as cited)
- 賦稅署 新聞稿 113-12-18 https://www.dot.gov.tw/singlehtml/ch26?cntId=92588e5cc8a344c4ac560de582214ea0 → `sources/dot-20241218.html/.txt` (2日/7日 unchanged; §48-2 NT$1,500–15,000, 按次處罰)

Result of the source comparison: every statute text I fetched is identical to the research files (R3b-statutes.md, T7-extra.md); all MOF/eTax/DOT quotes in R3b-official.md and T7-extra.md are verbatim on the live pages. The writer's facts.md claims A1–A5, B1–B6, C1–C4, D1–D5, E1–E8, F1–F4, G1–G2 and the H1–H7 omissions all check out against the official texts.

Automated checks (before and after my edits): `lint.py` OK for all four; `variety_metrics.py check` OK (no FAIL) for all four — ko cv 0.506 short 12% cite_end 30% contrast 0; ja cv 0.551 short 15.9%; en cv 0.571 short 24.3%; zh cv 0.49 short 8.3%. Internal links (/{lang}/columns/taiwan-withholding-tax-payments-to-foreign-companies, /{lang}/columns/taiwan-vat-foreign-digital-services-registration) exist in every language (lint existence check; both are in LINKS.md).

## 1. Law and facts — per-claim result (all languages)

Verified correct in every version: §28 pre-business registration; 稅籍登記規則 §3 II deemed registration for companies + 15-day supplement for online/app sellers (§4 I(9)); §3 III separate registration of outward-facing offices/warehouses/shops; §6(3) foreign enterprise's fixed place of business = 營業人; §38 separate filing per area / consolidated filing with MOF approval for general-method businesses; §10 band 5–10% with 徵收率 set by the Executive Yuan + eTax 5% (dated "as of October 2026", page updated 2022-06-21); §15 I output minus input; §33 voucher with name/address/UBN and tax shown; §19 I five non-creditable items; §35 I bimonthly filing within 15 days of the next period, even with no sales, pay first then attach receipt; 細則 §38-1 deadlines 15th of Jan/Mar/May/Jul/Sep/Nov (ko table Jan–Feb→Mar 15 … Nov–Dec→Jan 15 next year is a correct derivation); §35 II monthly filing option for zero-rated sellers, no change in the same year; §49 1% per 2 days (≤30 days) / 30% (>30 days), each with floor and cap; §7 zero-rated items; §39 I(1)(2) refund after check, §39 II carry-forward; 細則 §11(1)(2) documents (customs declaration → none; post/courier FOB ≤ NT$50,000 → receipt copy; services → FX certificate or FX receipt copy); 使用辦法 §4(33) 得免用或免開; §3 designation; §32 II–III tax-inclusive pricing and separate tax line for business buyers; 使用辦法 §7 types (triplicate/duplicate/e-invoice; ja's 扣抵聯/收執聯 and 存根檔/收執檔/存證檔 detail is exact); 作業要點 第7點 number-track application; §32-1 I upload duty; 時限表 2日/7日 from 翌日, corrections/voids/返回折讓 same, no weekend/holiday extension, force majeure 3 days (zh only); §48-2 NT$1,500–15,000, 限期補正, 按次處罰, in force 2025-01-01; §4 II services provided or used in Taiwan; §2(3) buyer is taxpayer when the foreign seller has no fixed place of business; §36 I buyer pays at §10 rate within 15 days of the period after payment, exemption for general-method buyers using the services solely for taxable sales, MOF proportion for 兼營; §51 I(6) up to 5× plus suspension when >30 days late.

Arithmetic: en example NT$1,000,000 × 5% = 50,000; 600,000 × 5% = 30,000; 50,000 − 30,000 = 20,000 — correct, labelled "(an invented example)".

Cross-language consistency: no contradiction on law between ko/ja/en/zh.

Home-country law: ko (한국 부가가치세와 같은 계열…대만 법이 따로 정합니다), ja (日本で消費税の仕入税額控除を扱ってきた方には…), en (first VAT for an American team; "a question for your US or Vietnamese tax adviser") — general cautions only; no Korean/Japanese/US/Vietnamese rate or rule stated. OK.

Unverified items (R3b U1–U5) are not stated anywhere: no Executive Yuan order number, no "e-invoicing is mandatory for everyone", no invoice-issuing schedule deadline, no 兼營 ratio, no computer-invoice date, no specific Nov 2026 filing date (2026-11-15 is a Sunday; versions say only "the November return"). OK.

## 2. Citations

Inline links sit right after each claim and point to the correct single-article URLs (pcode/flno checked for all 25 statute links; MOF/eTax/DOT URLs resolve to the quoted pages). Sources sections are complete and carry the check date 2026-10-06 in each language. Observation (no action): zh-hant lists 營業稅法 §32-1 in its sources but cites it only through the MOF 時限表 and §48-2 in the body; the upload duty is still fully sourced. ko/ja/en cite §32-1 inline.

## 3. Rules

No bold; no phone; no street address; email-only contact once, soft, before the sources section; no bookkeeping/filing/audit offer (ko "검토", en "look at how a subsidiary's sales split…" are legal-review wording, not a filing service); author legal-ai-assistant; no lawyer/CPA/native-review claim; hypotheticals labelled ("(an invented example)" ×2 in en; ja "日本側の決算期は一例です"); frontmatter per brief (topic tax, tags ["tax-accounting"], audience = file language, seoTitle ≤32 for ko/ja/zh, en seoTitle 42 chars because title + " | Hovering Law" > 60, en summary 157 chars, no forbidden characters). FAQ answers consistent with body.

## 4. Voice

Opening type ② (reader's question) in all four, no stock opener: ko "…따로 신청해야 할까요? 회사라면 대개 필요 없습니다." / ja "…どの書類があれば差し引けるのでしょうか。答えは統一発票です。" / en "What has to be in place… For a company, usually very little." / zh "…錢什麼時候退得回來？". Titles are specific noun phrases, not imperative/clickbait. Headings are column-specific. First paragraphs deliver law immediately. ko 합니다체 and ja です・ます throughout; zh uses Taiwan terms (國稅局、營業人、溢付、留抵、統一發票、單月15日), no mainland vocabulary or simplified characters (lint). en plain and active. Closing paragraphs end on the column's facts (Sep–Oct → November return; 2-day/7-day clock), no copied disclaimer or sales line. Contrast templates 0 in every version.

ko term note: 滯報金/怠報金 appear bare in ko (line 50). The published ko column 256 writes them the same way ("…1%를 滯報金으로…30%를 怠報金으로…"), so I left it for site consistency.

## 5. Sentence variety

No FAIL line in any language (figures above). Self-check items 2–7 all met: no stock opener; ≥2 very short sentences (ko 6, ja 10, en 18, zh 3); no 3 paragraphs starting with the same word; no 3 consecutive claim-(statute)-caveat paragraphs and at least one citation-free paragraph in each (ko/ja/zh closing + contact paragraphs; en arithmetic paragraph); contrast 0; last paragraph on facts. No MONOTONY finding.

## 6. Issues (Original → problem & reason → fix → facts preserved)

All minor; none changes a number, citation or legal meaning.

I-1 (ko/ja/en, summary + FAQ 1 + body deadline sentence) — Original ko "구매자가 개인이면 발행 다음 날부터 2일, 사업자이면 7일입니다." (ja "買い手が個人なら…2日以内、事業者なら7日以内", en "For an individual buyer…2 days…For a business buyer, 7 days") → The 時限表 and 使用辦法 §7 draw the line at 買受人為營業人 vs 非營業人; "non-business buyer" is broader than "individual" (a government body or non-profit buyer is also 非營業人 and gets the 2-day clock). zh already says 非營業人 correctly. → Applied: ko "구매자가 개인 등 비사업자이면 … 2일, 사업자이면 7일"; ja "買い手が個人など事業者以外なら…2日以内、事業者なら7日以内"; en "For a non-business buyer, such as an individual, … 2 days … business buyer, 7 days" (and en §32 sentence "for a non-business buyer it shows the tax-inclusive price"). → 2 days / 7 days / 翌日起算 / citations unchanged. Remaining shorthand "개인/個人/individual" elsewhere (invoice type names, closing lines) left as readable shorthand once the category is stated precisely.

I-2 (ko/ja/en, §7 list) — Original ko "보세구역 영업인에게 파는 재화·용역" (ja "保税区の営業人への販売", en "sales to businesses in bonded zones") → §7(4) reads 「銷售與保稅區營業人供營運之貨物或勞務」 — the zero rate is limited to goods/services sold to bonded-zone businesses for their operations; the qualifier was missing (zh had it). → Applied: ko "보세구역 영업인에게 그 영업용으로 파는 재화·용역"; ja "保税区の営業人にその営業用として販売する貨物・役務"; en "sales to bonded-zone businesses for their operations". → Article link and the rest of the list unchanged.

I-3 (all four, FAQ refund answer; zh also opening) — Original ko "그 밖의 초과분은 다음 기 이후 낼 세금에서 빼도록 이월됩니다" (ja/en/zh equivalents; zh opening "其餘留抵之後應納的稅額") → §39 I(3) also refunds overpayments on merger/transfer/dissolution/deregistration and §39 II has a 但書 (情形特殊者 may be refunded with MOF approval); stated flatly, "all other" overpayments carry forward is slightly overbroad. → Applied: added "원칙적으로" / "原則として" / "generally" / "原則上". → §39 citation, refund items (1)(2) and carry-forward rule unchanged.

I-4 (ko, §33 sentence) — Original "자회사의 명칭·주소·통일번호(統一編號)가 적힌 통일영수증을 받아 두어야 합니다" → §33 requires a voucher 載有營業稅額 as well as the buyer's name/address/UBN; ko omitted "tax shown" (ja/en/zh have it). → Applied: "세액과 자회사의 명칭·주소·통일번호(統一編號)가 적힌 통일영수증". → Citation unchanged. (ko still says 통일영수증 only and omits "or other MOF-approved voucher"; that is a narrowing in the reader's favour and is left as is.)

Observations with no action required:
- en title uses "Bimonthly Returns"; the body heading says "Returns every two months" and the text repeats "Each return covers two months", so the ambiguity of "bimonthly" is resolved on the page. Title/H1/seoTitle left untouched.
- §6(3) says "固定營業場所" (fixed place of business), the columns say "branch"; a branch is such a place, so the statement holds (zh uses the statutory wording).
- 細則 §11(1) courier exports: the courier must be a customs-registered courier (經海關核准登記之快遞業者); the versions say "express courier" without that qualifier. The reader loses nothing actionable and the article is linked; not changed.
- DOT release also mentions a first-notice leniency (稅務違章案件減免處罰標準 第16條之3) and a 6-month guidance period for 折讓單 that ended 2025-06-30; neither is in the columns, which is fine.

## 7. Minor edits applied (all with lint OK and variety OK afterwards)

ko.md: summary (개인 → 개인 등 비사업자); FAQ 1 (same); FAQ 2 (+원칙적으로); §33 sentence (+세액과); §7 list (+그 영업용으로); e-invoice deadline sentence (+개인 등 비사업자).
ja.md: summary, FAQ 1 and body deadline sentence (個人 → 個人など事業者以外); FAQ 3 (+原則として); §7 list (保税区の営業人にその営業用として販売する貨物・役務).
en.md: FAQ 1 (non-business buyers, individuals included); FAQ 3 (+generally); §7 list (bonded-zone businesses for their operations); §32 sentence (for a non-business buyer); deadline sentence (For a non-business buyer, such as an individual).
zh-hant.md: FAQ 3 and opening paragraph (+原則上).

Post-edit checks: lint OK ×4 (ko 2,746 chars; ja 3,184; en 1,397 words; zh 1,915); variety OK ×4; en summary 157 chars.

## 8. Image

images/T7.webp (generated from img-prompts/C7.txt): a pale wooden counter in soft daylight with three unlabeled kraft-paper parcels tied with string and a card terminal with a blank screen; window with bare trees in the background. No faces, text, numbers, logos, flags, money or readable documents; generic and fictional; calm editorial tone; suggests sales/shipping and point-of-sale, which fits a business-tax / invoice column. Verdict: OK.
