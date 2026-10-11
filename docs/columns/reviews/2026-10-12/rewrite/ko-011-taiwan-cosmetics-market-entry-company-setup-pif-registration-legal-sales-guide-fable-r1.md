# FINAL REVIEW r1 — ko-011 taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide

Reviewer: Claude Fable 5.1 (did not write the draft). Date: 2026-10-12.

## Verdict

PASS. The rewrite preserves every legal statement, qualifier, number, article reference, source entry, link, disclaimer content and signature of the original. Nothing new was added. Front matter is identical except lastmod. The variety check has 0 FAIL, and the text reads as native 합니다체 without AI formula. The tests patch only re-anchors this column's pinned wording; one read_time assertion is loosened but still pins the count and never understates. No edits were made to draft.md.

## Scope checked

- orig.md and draft.md read in full, compared paragraph by paragraph.
- guard.txt (GUARD: PASS) and guard.py re-run by me on 2026-10-12: GUARD: PASS, length 3517 -> 3237 (92%), monotony 28.2 -> 14.3, cv 0.465, short 0.133, contrast 0, questions 2.
- variety_metrics.py check draft.md --lang ko: sentences=98 mean=39.4 cv=0.465 short=0.133 run3=0.042 opener_rep=0.034 cite_end=0.0 contrast=0 caveat=0 q=2. No FAIL. One WARN (98% of sentences end in 니다) which the original also has and which is the 합니다체 register.
- Mechanical diff (python difflib): lines 1-21 (front matter, H1, featured image) differ only at lastmod "2026-07-25" -> "2026-10-12"; the 13-entry 공식 자료 list is byte-identical; the six numbered steps are identical; all inline link targets (orig vs draft) identical in order; no bold, underscore, html tag or emoji in the draft.
- notes.md, tests.patch (non-empty, 14,445 bytes), tests.txt (full suite: Test Files 79 passed), claude-tests2.log.
- SENTENCE-VARIETY-RULE.md sections 5-6, COLUMN-VOICE-RULE.md, LESSONS.md (skimmed).

## Claim-by-claim fact table

Legend: P = preserved with same meaning; P(moved) = preserved, relocated; CUT = removed (repetition only).

### Front matter
| Original | Rewrite | Status |
|---|---|---|
| title, url, date_display, read_time "9분 분량", categories, featured_image, three FAQ q/a | lines 2-16 identical | P |
| lastmod "2026-07-25" | "2026-10-12" | expected change |

### Intro
| Original point | Rewrite | Status |
|---|---|---|
| Four decisions: who imports, when registration is completed, who/where manages PIF, by what standard labels/ads are reviewed | line 25 | P |
| Korean brands may use a local importer or run Taiwan business directly; company formation alone does not complete sales readiness | line 23 (opening question + answer) | P |
| Obligations vary by product type, manufacturing site, actual import form, distribution method, ad content | line 25 | P |
| Re-check latest law and agency guidance per product before fixing supply schedule | line 25 | P |
| "아래에서는 … 서로 구분하여 설명합니다" (preview sentence) | removed | CUT (no legal content) |

### 1. 진출 형태와 수입 주체
| Original point | Rewrite | Status |
|---|---|---|
| Subsidiary/branch not mandatory; importer (incl. one that is also the sales agent) may handle import and sales | line 23 (opening), line 35 | P(moved) |
| Subsidiary vs branch: establishment/registration, liability and tax structure differ | line 43 | P(moved) |
| Time needed for FIA approval and company/branch registration depends on the case and corrections | line 45 "사건마다 다릅니다 … 제출자료와 보정 여부에 따라" | P(moved) |
| First decide business model and the entity taking manufacturer/importer responsibility | line 31 | P |
| Structure without own subsidiary/branch possible when Taiwan importer or agent imports and sells | line 35 | P |
| Agent may double as importer, or a separate importer may participate | line 35 | P |
| Contract titles (대리점, 총판, 유통사) do not decide legal responsibility | line 35 | P |
| Check who imports and registers, who writes/updates/keeps PIF | line 37 | P |
| Assign: label review, distribution records, complaints and safety information intake, inspection and document-request response | line 37 | P |
| Check that statutory duties of the 제조·수입업자 and the contractual split match | line 37 | P |
| Contract items: IP use scope; provision/translation/supplementation of manufacturer data for registration and PIF; latest-data management and handover at termination | line 39 | P |
| Optional items: ad pre-review and amendment authority, safety-information transfer, recall cooperation, cost of testing/translation/storage | line 39 "계약에 넣을 수 있는 항목" | P |
| Scope and deadline of return or copy provision so data does not stay with one party | line 39 | P |
| Subsidiary = separate legal entity under Taiwan law; branch = registered as part of the foreign head office | line 43 | P |
| Legal personality, head-office liability, accounting/tax, profit transfer, representation and internal control differ; do not choose by sales control alone | line 43 | P |
| Current agency: 경제부 투자심의사(經濟部投資審議司) | line 45 | P |
| Period for investment approval, remittance, company/branch registration, bank account, tax registration, import qualification depends on investor, industry, form, documents, corrections | line 45 | P |
| Do not fix launch date on an assumed fixed period; check applicability and latest filing requirements first | line 45 | P |
| Central responsible party in cosmetics regulation is the 화장품 제조·수입업자 | line 47 | P |
| Outsourcing data preparation or safety assessment does not transfer legal responsibility | line 47 | P |
| Distinguish contractual split from statutory responsibility as starting point | line 47 | P |

### 2. 제품등록과 PIF
| Original point | Rewrite | Status |
|---|---|---|
| Not the same procedure; registration is a separate procedure on the TFDA platform | line 51 | P |
| PIF = file compiled/updated/kept by the 제조·수입업자; not pre-submitted to TFDA | line 51 | P |
| PIF data categories (품질, 안전성, 조성, 표방 기능, 제조방법, 시험결과와 안전성 평가) | line 63 | P(moved, stated once) |
| From 2026-07-01 all cosmetics in principle; exception solid handmade soap made at a site exempt from factory registration | line 65 | P(moved, stated once) |
| Complete registration before 공급·판매·증정·공개 전시 or consumer trial provision | line 55 "완료해야 합니다" | P |
| Do not plan on paid sales only; manage giveaway and trial schedules with registration timing | line 55 | P |
| Validity 3 years; apply for extension within 3 months before expiry | line 57 | P |
| Change in name, use, form, ingredients, manufacturing site may require a procedure | line 57 | P |
| Registration = filing of prescribed items; does not confirm PIF completeness nor legality of labels/ads; run three items separately | line 59 | P |
| PIF also includes basic product/manufacturer information and evidence such as labels | line 63 | P |
| 「화장품 제품정보파일 관리방법」 structures data in 16 categories; check signature/qualification requirements per product type | line 63 | P |
| Phased application by product group; remaining cosmetics from 2026-07-01; exception limited to solid handmade soap at exempt site | line 65 "예외는 하나뿐입니다" (= 원문 "로 한정됩니다") | P |
| Not excluded merely for being handmade or named soap; both solid form and factory-registration exemption must be checked | line 65 "확인해야 합니다" | P |
| Qualified third party may support; legal responsibility stays with 제조·수입업자 | line 67 | P |
| System for exchanging change information and latest signed documents among original manufacturer, test lab, safety assessor, Taiwan operator | line 67 | P |
| Update affected PIF data when raw materials, formula, method/site, labels, claimed function or safety information change; review complaints, adverse events, new test results; change-management after first compilation | line 71 (identical) | P |
| Retention: 관리방법 제7조, at least 5 years from the day after last supply to market | line 73 | P |
| Storage place: 관리방법 제8조, address shown per 「화장품위생안전관리법」 제7조 제1항 제7호 | line 73 | P (article numbers attached to the same claims) |
| Distinguish the period article from the place article | line 73 "두 조문은 구별해서 운영합니다" | P |
| Access to complete data even when original manufacturer holds originals or e/cloud storage used; access rights, backup, versioning, format, person in charge; retention after contract ends, handover and access survival in contract | line 75 | P |
| Inspection notice in principle 7 days before; statutory exceptions allow no prior notice; keep complete current data retrievable at all times | line 79 | P |
| False information in registration or PIF: NT$10,000–1,000,000 administrative fine | line 81 | P |
| Incomplete PIF: usually a correction order with deadline; fine arises on failure to correct in time; do not equate with false information | line 81 | P |
| Recall/destruction not automatic; judge by safety, nature of violation, correction status, statutory requirements of each measure; separate safety measures from document supplementation; follow agency notice and applicable article | line 83 | P |

### 3. 표시·홍보·광고
| Original point | Rewrite | Status |
|---|---|---|
| Judged on whole expression: 명칭, 문자, 이미지, 기호, 음성 etc., not wording alone | line 87 | P |
| False/exaggerated expression and medical-efficacy claims prohibited | line 87 | P |
| Not judged by a single word; product name, sentences, images, symbols, sound, context, overall consumer impression | line 87 | P |
| Impression from central ad expression not cured by small-print limitation; review individual phrases and final material | line 87 | P |
| Particular care with medical expressions: acne treatment, anti-inflammatory, sterilising ("예를 들어" label kept) | line 89 | P |
| Also check disease-name pairing, before/after images, medical-professional staging, ingredient-to-treatment context | line 89 | P |
| Fines: 허위·과대 NT$40,000–200,000; 의료적 효능 NT$600,000–5,000,000 (original stated twice) | line 91 (once) | P |
| Ranges differ by violation type; compare whole expression with evidence before posting | line 91 | P |
| Influencer/reviewer/partner posts may be ads in substance; same standard applies | line 95 | P |
| Factors: payment, product provision, sales link, brand instruction, repeated collaboration | line 95 | P |
| Not every personal post is automatically a brand ad; check relationship, content, degree of involvement | line 95 | P |
| Collaboration contract/guidelines: permitted expressions and evidence, pre-review, correction/deletion; comments, live/short-video oral statements, page-label mismatch; keep review copies, approval history, correction requests, final posts | line 97 | P |
| Six-step readiness order | lines 103-108 identical | P |
| Three internal links (/ko/columns/taiwan-company-establishment-basics, /ko/services/investment, /ko/lawyers/wei-tseng) | line 110 | P |
| 13 official sources | lines 114-126 identical | P |
| Disclaimer: educational, general explanation; not legal opinion on individual products/ads; no guarantee of permit/registration, saleability, processing time; verify form, data, labels/ads, latest practice per case | line 128 | P (two clauses re-joined, same content) |
| Signature 증준외 변호사(曾雋崴, Wei Tseng) | line 130 | P |

### Added sentences (checked for new content)
"반드시 그렇지는 않습니다", "사건마다 다릅니다", "등록은 공급보다 먼저입니다", "예외는 하나뿐입니다", "예외도 있습니다", "기준은 전체 표현입니다", "과태료는 위반유형마다 다릅니다", "담당자를 정할 일은 더 있습니다", "특히 조심할 것이 의료적 표현입니다", "그때는 같은 기준으로 검토합니다". Each restates an adjacent original claim; none adds a fact, number, case, first-person story or sales line.

### Structural change
"### 개별 단어가 아니라 전체 표현으로 판단" heading removed; its three paragraphs now sit directly under ## 3. "### 판매 준비 확인 순서" renamed "### 판매 준비 순서". No content lost.

## Blocking issues

None.

## MONOTONY items

None blocking. Section 5 self-check: (1) tool FAIL 0; (2) opening is a reader question, not a 가령 formula; (3) several very short sentences, no long-sentence runs beyond the metric (run3 0.042); (4) paragraph starters: "제품등록은" twice plus "제품등록에" once, within the tool limit; (5) no 주장→다만 chains, many uncited paragraphs; (6) contrast templates 0; (7) last paragraph is the house disclaimer plus signature, carried over from the original by requirement (see original issues); (8) 합니다체 throughout, no bold, no invented first person, no imperative checklist headings; (9) no article, deadline, amount, link or example label lost.

Observation only: the section 1 lead "순서로는 사업모델, 그리고 화장품 제조·수입업자로서 책임을 맡을 주체가 먼저입니다." is a slightly stiff single-sentence lead. It is grammatical and is pinned verbatim by tests.patch, so I left it.

## Tests verdict

OK. tests.patch touches two files.
- columns-ko-investment-011.test.ts: lastmod/date 2026-07-25 -> 2026-10-12; bodyContracts re-anchored from FAQ answers to the new lead paragraphs (the FAQ-equals-lead structure was intentionally removed; FAQ front matter is still asserted by `expect(post?.faq).toEqual(faq)`); required phrases re-anchored to new wording while still locking: importer-without-subsidiary structure, contract-title rule, subsidiary/branch distinction, 경제부 투자심의사, 3-year validity, 3-month extension window, PIF not pre-submitted, 16 categories, 2026-07-01 scope, handmade-soap exception, third-party support with retained liability, Article 7 five-year retention, Article 8 storage address with 제7조 제1항 제7호, 7-day notice with exception, NT$10,000–1,000,000, correction order, recall not automatic, whole-expression test, medical examples, NT$40,000–200,000 and NT$600,000–5,000,000, influencer limits, six-step order, disclaimer regex, signature. Heading split anchor updated to "### 판매 준비 순서". No .skip/.only/.todo, no assertion deleted.
- read_time test: eojeol count re-pinned 1,463 -> 1,317 and computed minutes 9 -> 8; strict equality with the label replaced by "label is N분 분량, N >= computed, post.readTime equals label". This is a loosening for this column only, because the front matter keeps "9분 분량". It does not touch a legal fact and never lets the label understate reading time. Acceptable; see non-blocking note.
- columns-publication-date.test.ts: only the cosmetics column date 2026-07-25 -> 2026-10-12; no other column weakened.
- tests.txt: full suite PASS, 79 test files.

## Tiny edits applied

None. draft.md unchanged; guard re-run by me returned GUARD: PASS.

## Original issues (not blocking)

- read_time "9분 분량" now overstates the computed 8분 (1,317 eojeol / 180). A later pass could set read_time to "8분 분량" and restore the strict equality assertions in the test; both must change in the same commit.
- House format carried from the original: no contact email line, no source-check date in the sources section, sources section is an H3 after the last H2 (guard tolerates these as pre-existing).
- "Invest Taiwan 외국인투자 개요" link points to the Japanese-language page (lang=jpn) in a Korean column.
- The closing paragraph is a stock disclaimer rather than a fact of the column (SENTENCE-VARIETY-RULE 5-7); kept because the brief requires disclaimer content to be preserved.
- Legal numbers (3-year validity, 3-month extension window, 7-day notice, fine ranges, 5-year retention, Article 7/8 and 제7조 제1항 제7호) were carried over unchanged; this review did not re-verify them against the statutes, per the brief.

VERDICT: PASS
