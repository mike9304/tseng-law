# FINAL REVIEW r1 — ko-001 taiwan-company-establishment-basics (Claude Fable 5.1, 2026-10-12)

## Verdict

PASS. The rewrite preserves every legal statement, qualifier, number, article citation, link, source entry, disclaimer content, contact line and signature of the original. No fact, example, case, number or promise was added. Variety metrics: FAIL 0 (one WARN, same as original). Tests patch only re-anchors pinned wording of this column and all 112 test files pass.

## Scope checked

- orig.md vs draft.md, full text, paragraph by paragraph (front matter, FAQ, H1, image lines, body, sources, contact, disclaimer, signature).
- guard.txt: GUARD: PASS (length 4255 -> 4210, 99%; pre-existing lint notes tolerated: no contact email, no source-check date — both inherited from the original).
- notes.md read; rewriter's claims verified against the diff.
- tests.patch (non-empty, 17.5 KB, one file: src/lib/__tests__/columns-ko-investment-001.test.ts) read line by line; vitest-1.log shows the file passing (9 tests) and 112/112 files, 1914 tests passing.
- SENTENCE-VARIETY-RULE.md sections 2, 5, 6; COLUMN-VOICE-RULE.md; LESSONS.md skimmed.
- Mechanical checks run by me (python, on both files): front matter + H1 + image lines identical except lastmod; the 10-item numbered list identical; link set identical; numeric tokens identical except the lastmod date and the removed heading numbers "1."–"5."; no bold, no emoji.
- variety_metrics.py check draft.md --lang ko: sentences=86 mean=42.0 cv=0.454 short=0.116 run3=0.048 opener_rep=0.1 cite_end=0.0 contrast=2 caveat=3 q=2; WARN 98% '니다.' endings (original: 97%, plus 3 FAILs that are now cleared).

## Fact table (original point → rewrite location → status)

### Front matter / FAQ
- title, url, date_display, read_time "8분 분량", categories, featured_image, all three FAQ q/a → identical → preserved. lastmod 2026-10-06 → 2026-10-12 (expected). read_time unchanged; eojeol count 1296/180 = 7.2 → ceil 8, consistent.

### Intro (orig l.25 → draft l.25)
- Registration done ≠ investment review and industry licensing finished; shareholders/managers cannot immediately work in Taiwan → split into two sentences → preserved.

### Section 1 (orig "1. 대만 진출 형태" → draft "자회사, 지점, 대표사무소의 차이")
- Subsidiary (有限公司·股份有限公司) is an independent legal person distinct from HQ, contracts in its own name, bears rights/obligations → l.29 → preserved.
- Choice between 유한회사/주식회사 by equity/share structure, organs, decision-making, financing plan → l.29 → preserved.
- Independent-entity status does not always confine all liability to the subsidiary; check guarantees, collateral, parent contracts, director liability → l.29 → preserved.
- Branch: organization for the foreign HQ to do business in Taiwan; no shareholders at branch level; not a separate legal person, part of HQ; HQ bears branch debts/liabilities → l.31 → preserved ("별개의 법인이 아닌" → "독립된 법인격이 없고", same meaning).
- Funds flow / profit remittance / accounting / tax between HQ and branch not to be assumed equal to subsidiary dividend structure → l.31 → preserved.
- Representative office: market research, liaison, negotiation support, legal acts for the foreign company, within permitted scope; cannot do sales/service business in Taiwan; if work expands to orders, payment receipt, repeated services, reconsider subsidiary/branch → l.33 → preserved.
- Comparison must cover liability, capital structure, profit distribution/remittance, tax, industry licensing, employment, government procurement; tender/permit requirements (Taiwan entity, capital, track record, registration) → check the law and notice, not the entity name → l.35, link /ko/columns/taiwan-company-subsidiary-vs-branch kept → preserved.

### Section 2 (orig "2. 대만 자회사 설립의 주요 절차" → draft "자회사 설립 절차: 예비심사에서 세적등록까지")
- "일반적으로" qualifier on the sequence → l.41 → preserved. The original's prose summary of the sequence (name/business-item pre-review → FDI review → account/remittance → investment amount confirmation → registration → tax registration) was dropped; it duplicated the 10-item list immediately below, which is identical. No legal point lost.
- 10 numbered steps incl. "(해당하는 경우)" on steps 3 and 10, 經濟部投資審議司, 投資額審定 → l.43–61 → identical.
- Pre-review confirms name and intended business before registration; passing it does not mean industry permit obtained or that business can start at the intended place; FDI application: investor, amount, investee, business plan must match review materials → l.63 → preserved. The added reader question "예비심사를 통과하면 바로 영업해도 될까요? 아닙니다." restates the original's negative; no new fact.
- Foreign documents (POA, certificate of existence, representative authority): notarization/authentication or Taiwan overseas mission authentication depending on place of issue and nature ("필요할 수 있습니다" → "필요한 경우가 있습니다"); translation, signatory, entity name must match; documents vary by nationality and individual/entity; sort validity and authentication route before issuance → l.65 → preserved.
- Bank KYC may check beneficial owner and source of funds ("확인할 수 있습니다" → "확인하기도 합니다"); mismatch between remitter, purpose, approval, receiving account → supplementary explanation/correction; after remittance: investment amount confirmation → registration → tax registration → account conversion per bank procedure → l.67 → preserved.
- Order/necessity/duration depend on entity type, amount, industry, review content, bank progress and corrections; post-registration procedures (import/export registration, factory/product/professional permits, work permit, residence); set contract/opening dates considering completion of these → l.69 → preserved.

### Section 3 (orig "3. 업종과 영업장소 사전확인" → draft "업종 인허가와 영업장소")
- Many industries open to foreign investment but prohibited/restricted industries, professional qualifications, location restrictions, industry permits need separate check; examples 의료기기·주류·여행·건설·전문서비스; review by actual goods/services and transaction structure → l.75 → preserved ("검토해야 합니다" → "검토할 필요가 있습니다", same force).
- Pre-review, registration, tax registration, industry permits have different purposes; online/offline, import/domestic, direct/intermediary change required registrations and liability → l.77 → preserved.
- Before signing a lease: zoning, building management, lease terms, tax-registration suitability; building use/bylaws or landlord consent problems may force relocation or extra steps even after registration → l.79 → preserved.
- Taipei City 營業場所預先查詢 for covered company/commercial registrations (link kept); result alone does not satisfy other permits or professional laws; other localities: check local government/competent authority; get written confirmation before long lease or facility investment → l.81 → preserved.

### Section 4 (orig "4. 취업허가·거류자격·자본금" → draft "취업허가, 거류증, 자본금")
- Applicant, shareholder, actual worker, residence applicant may coincide but are legally distinct; investment approval = capital inflow, work permit = foreigner's work, ARC = purpose and period → l.85 → preserved.
- Students may apply for investment/incorporation; being investor/shareholder does not mean current status permits work or management; if actually signing contracts, directing staff, running daily management → check work-permit scope/requirements before starting → l.89 → preserved.
- Work-permit review may consider duties, qualifications, role, investment relationship, employer's business record, documents; ARC applied separately by purpose; validity/renewal per the disposition and law at the time → l.91 → preserved.
- No statutory minimum capital uniformly applied to incorporation; but industry minimum capital, business-plan reasonableness, bank review, employer requirements under work-permit rules are separate → l.95 → preserved (stated once here, and the "위 숫자는 … 고용주 요건입니다" restatement at l.112 is also kept, so nothing was actually dropped).
- Scope of the foreign-national manager work permit: companies where overseas Chinese/foreign holdings exceed 1/3 of total shares or capital → 經理人; branch manager of foreign company; representative of rep office, "등" → l.97 → preserved.
- Employer under 1 year: paid-in capital or Taiwan operating funds ≥ NT$500,000, OR revenue ≥ NT$3,000,000, OR import/export ≥ US$500,000, OR agency commission ≥ US$200,000, "중 하나가 원칙" → l.97–102 (bullet list) → preserved, all four figures and units, OR relation, "원칙" qualifier.
- Employer ≥ 1 year: latest 1 year or 3-year average in Taiwan, revenue ≥ NT$3,000,000 OR import/export ≥ US$500,000 OR agency commission ≥ US$200,000, "중 하나가 원칙" → l.104–108 → preserved.
- Rep office: ≥1 year requires Taiwan business record; <1 year exempt; special recognition for substantial contribution to Taiwan's economy or special circumstances; same employer hiring 2+ via this route → general criteria (Chapter 2); Art. 38(2) link → l.110 → preserved; citation moved from sentence end to sentence head, same claim attached.
- Figures are employer requirements for the foreign-manager work permit, not a universal minimum capital; industry laws may require capital/deposit; banks review independently; meeting the criteria does not auto-issue the permit; duties, experience, documents also reviewed → l.112 → preserved.
- Spouse and minor children of a work-permit-based ARC holder may apply separately for 依親 residence if requirements met; proof of marriage/parentage, support, purpose may be needed; not automatic → l.116 → preserved. New H3 "가족 거류와 영구거류" groups the two existing paragraphs; no content added.
- APRC: in principle 5 consecutive years of legal residence with ≥183 days per year; different calculation for foreign professionals etc.; conduct, assets/skills also reviewed; link /ko/columns/taiwan-permanent-residence-aprc → l.118 → preserved.

### Section 5 (orig "5. 세금과 대만–한국 소득세협정" → draft same, number removed)
- Business tax general rate 5%, filed usually every 2 months; profit-seeking enterprise income tax 20% general, actual tax depends on taxable income and rules; non-resident dividend domestic withholding 21% → l.124 → preserved.
- Taiwan–Korea tax agreement in force 2023-12-27, applied from 2024-01-01; dividends/interest/royalties source-state cap 10% each when requirements met → l.126 → preserved.
- Business tax vs income tax distinction; payments to foreign shareholders/affiliates (dividend, interest, royalty, service fee): review nature, recipient status, domestic withholding, treaty applicability → l.128 → preserved.
- Business profits taxed in residence state in principle except PE etc.; check actual mode of operation first; PE may include fixed place (management/branch/office), construction >6 months, services >183 days in any 12 months, dependent agent habitually concluding contracts; four types have different conditions; fixed place or agent reviewed independently of service days; 183 days alone does not decide PE/taxation → l.130–137 (bullet list) → preserved.
- Treaty rates not automatic: treaty residence, beneficial owner, legal nature of income, residence certificate and application documents; align structure/contracts/invoices/work/payment flows; filing deadlines and record retention → l.139 → preserved.

### Sources / contact / disclaimer / signature
- 12 source entries → identical.
- Contact line: links to /ko/services/investment, /ko/lawyers/wei-tseng, /ko/contact kept; "구체적인 사안에 관한 문의는 … 를 이용해 주시기 바랍니다" → "구체적인 사안은 … 로 연락해 주시기 바랍니다" → same content.
- Disclaimer: educational/general, not legal or tax advice; outcomes vary by structure, industry, nationality/status, agency practice; check official sources and individual circumstances before investing/contracting/hiring → split into two sentences → preserved.
- Signature "증준외 변호사(曾雋崴, Wei Tseng)" → identical.

## Blocking issues

None.

## MONOTONY items

None blocking. Self-check (rule section 5):
1. Tool: FAIL 0. WARN 98% '니다.' endings; inherent to 합니다체 legal prose and the original was 97%. Not a FAIL item.
2. Opening is a short assertion ("등기를 마쳤다고 끝나지 않습니다."), not a stock hypothetical formula.
3. Very short sentences present ("아닙니다.", "지점에는 주주를 두지 않습니다.", "그래도 법적으로는 따로 봅니다.", "설립 1년 미만은 면제됩니다.", "가족 거류자격은 자동이 아닙니다."). No run of long sentences.
4. Paragraph openers: no word opens 3 paragraphs ("대만" opens two body paragraphs plus "대만–한국" once; opener_rep 0.1 passes).
5. "다만" appears 2 times; no three consecutive claim→caveat paragraphs; many paragraphs without citation.
6. Contrast templates: 2 (both from the original, "최저자본금이 아니라 고용주 요건" and the rep-office "명칭만 보고 판단하지 말고"); no rebuttal of claims the reader never made.
7. Last body paragraph ends on this column's facts (treaty documentation and record keeping). Disclaimer/contact are the original's required content, kept as SPEC.
8. 합니다체 throughout, no 해라체, no bold, no emoji, no first person, no imperative/checklist headings.
9. No article number, deadline, amount, link or qualifier lost (verified mechanically above).

Native reading: the two reader questions ("예비심사를 통과하면 바로 영업해도 될까요?", "최저자본금은 얼마일까요?") read naturally and answer with original facts. Bullet lists for the employer thresholds and PE types improve scannability without changing the AND/OR structure. Minor observation, not blocking: "~해야 합니다" (7 incl. "~어야 합니다" variants) exceeds the section-3 soft guideline of 4, but this is a legal-obligation column and the rewriter already diversified to "확인이 필요합니다 / 따져 봐야 합니다"; weakening further would risk softening legal duties.

## Tests verdict

PASS. The patch touches only src/lib/__tests__/columns-ko-investment-001.test.ts:
- lastmod/date expectations 2026-10-06 → 2026-10-12.
- Pinned paragraphs re-anchored to the new wording; the former single employer-requirement paragraph is now locked as two intro paragraphs plus two bullet-list constants, so all seven threshold figures (NT$500,000 / NT$3,000,000 / US$500,000 / US$200,000 and the ≥1-year set) remain asserted verbatim.
- H2 assertion changed from numbered-regex to plain-heading list, reflecting the intentional removal of section numbers; it now also asserts "공식 자료", which is stricter.
- Required-phrase list re-anchored for each legal fact (branch has no shareholders, HQ bears liability, rep office cannot do business, treaty dates, 10% cap, four PE types, 183-day caution, 5%/2 months, 20%, 21%, Art. 38(2) link, rep-office 1-year rule, family residence not automatic, APRC 5 years/183 days). No fact assertion removed.
- Eojeol count pinned 1319 → 1296; read_time formula check retained.
- Disclaimer and signature-ending regex updated to the new two-sentence disclaimer.
- No .skip / .only; no other column's test touched. vitest-1.log: 112 files, 1914 tests passed.

## Tiny edits applied

None. Draft published as received; guard.txt GUARD: PASS stands.

## Original issues (not blocking)

- "같은 고용주가 이 경로로 2명 이상을 채용하면" (Art. 38(2)): the original leaves "이 경로" ambiguous (rep-office route only vs. the whole Art. 38 route). Rewrite keeps the wording unchanged; flag for a future accuracy pass against the statute text.
- Pre-existing lint notes: no contact email line and no source-check date in the sources section (house format of this original; same in orig.md).
- Time-sensitive figures (employer thresholds, 21% withholding, treaty dates, 10% caps) were not re-verified online by rewriter or reviewer in this round; they are unchanged from the published text.
