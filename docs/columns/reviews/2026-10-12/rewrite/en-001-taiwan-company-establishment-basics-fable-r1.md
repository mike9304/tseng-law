# Final review r1 — en-001-taiwan-company-establishment-basics (Claude Fable 5.1, 2026-10-12)

VERDICT: PASS

## Scope checked

- orig.md (published, lastmod 2026-10-06) vs draft.md (rewrite, lastmod 2026-10-12), read in full, compared section by section and claim by claim.
- guard.txt: `GUARD: PASS` (length 2148 -> 2092 words, 97%; monotony score 21.3 -> 0.4). Re-ran guard.py myself with `--today 2026-10-12`: PASS, same NOTE lines. The two tolerated lint notes (no contact email, no source-check date in the sources section) are the original's house format, unchanged by the rewrite.
- `variety_metrics.py check draft.md --lang en`: `OK — no variety limit violated` (sentences=100, cv=0.541, short=0.14, run3=0.082, opener_rep=0.0, cite_end=0.0, contrast=0, caveat=1, q=1).
- tests.patch (23,108 bytes, one file: `src/lib/__tests__/columns-en-investment-001.test.ts`) read line by line; tests.txt reports the pipeline's vitest run green (112 test files) after one sync round.
- SENTENCE-VARIETY-RULE sections 5–6, COLUMN-VOICE-RULE, LESSONS.md read.
- Front matter diffed: the only differing line is `lastmod` ("2026-10-06" -> "2026-10-12"). title, seoTitle, url, date_display, read_time ("9 min read"), categories, featured_image, summary, all three FAQ q/a pairs: identical. H1 and the five image lines: identical, same positions relative to the sections.

## Fact table (original point -> where in the rewrite -> status)

### Opening
- Registration complete ≠ investment-fund verification / every industry license complete; shareholder or manager may not start work immediately -> opening paragraph (three sentences, "Registration is not the finish line." added as a lead) -> preserved. The lead sentence is a framing line, no new fact.

### Section 1 (was "1. Choosing a Taiwan Presence…", now "Subsidiary, Branch, or Representative Office")
- Subsidiary = separate legal entity; 有限公司 / 股份有限公司; contracts and rights/obligations in own name -> para 1 -> preserved. The rewrite adds the English glosses "limited company" / "company limited by shares"; these are the same terms the unchanged FAQ 1 already uses, so no new content.
- Choice between the two forms: equity/share structure, corporate organs, decision-making, financing plans -> para 1 -> preserved.
- Separate personality does not invariably confine liability; guarantees, security, contracts with parent, directors' liability must be examined -> para 2 -> preserved.
- Branch = organization through which head office does business; no shareholders of its own; part of head office, not separate entity; head office bears debts and liabilities -> para 3 -> preserved.
- Head-office/branch fund transfers and profit remittances, accounting and tax treatment, not to be assumed to follow subsidiary dividend structure -> para 3 -> preserved.
- Representative office: permitted-scope activities (market research, liaison, negotiation support, legal acts on behalf of the foreign company); may not sell goods or provide services in Taiwan -> para 4 -> preserved.
- If actual work expands to taking orders, receiving payments, repeatedly providing services: look beyond the label and reconsider subsidiary/branch -> para 4 ("the label no longer fits. The business should then reconsider…") -> preserved. Wording is a touch more declarative than "look beyond the label", but it follows directly from the preceding sentence that such activities are not permitted to a representative office, so no legal point is overstated.
- Comparison factors: liability scope, capital structure, profit distributions and remittances, taxation, industry licensing, employment relationships, government-procurement participation -> para 5 -> preserved; internal link `/en/columns/taiwan-company-subsidiary-vs-branch` kept (anchor text shortened to "comparing organizational forms").
- Tender/license requiring Taiwan legal entity, specified capital, performance record, registration: eligibility from applicable law and notice, not from label alone -> para 5 -> preserved.

### Section 2 (was "2. Key Steps…", now "Forming a Subsidiary, from Name Review to Regular Account")
- Ten numbered steps -> identical wording and order (blank lines between items removed; same list in Markdown). DIR/MOEA, 投資額審定 kept.
- Preliminary review checks name and business before registration; passing it ≠ separate license obtained or operations may begin at premises -> para after list -> preserved.
- Where foreign-investment application required: investor, investment amount, investee, business plan consistent with review materials -> same para -> preserved ("should match").
- Foreign documents (POA, certificate of corporate existence, representative-authority documents) may need notarization/authentication or Taiwan overseas-office authentication depending on place of issuance and document type -> documents para -> preserved.
- Translation, authorized signatory identity, corporate name checked against the application; documents vary with nationality and individual/entity; identify validity periods and authentication route first -> documents para -> preserved.
- Bank verifies beneficial owner and source of funds (customer due diligence) at preparatory-account opening and remittance; mismatch of remitter / purpose / approved investment / receiving account -> explanation or correction -> bank para -> preserved.
- After remittance: amount verification, company registration, tax registration, conversion of the account under bank procedures -> bank para -> preserved.
- Order, necessity, duration vary with organizational form, investment amount, industry, substance of review, bank progress, requested corrections -> bank para -> preserved verbatim except "the" -> "these".
- Post-formation procedures (import-export registration; factory/product/professional-industry permits; work permits and residence) and their effect on contract / commencement dates -> last para -> preserved.

### Section 3 (was "3. Checking Business Activities and Premises Before Formation", now "Licenses and Premises Before Registration")
- Many industries open; prohibited/restricted industries, professional qualifications, premises restrictions, industry licenses checked separately -> para 1 -> preserved.
- Medical devices, alcohol, travel, construction, professional services: regulator approval/registration or professional qualification; assessed by actual products/services and transaction structure -> para 1 -> preserved.
- Operating model (online vs store, import vs domestic distribution, direct vs intermediary) changes registrations and liabilities -> para 1 -> preserved.
- Pre-lease checks: land-use classification, building regulations, lease terms, tax-registration suitability; incompatible use/management rules or missing landlord consent -> relocation or further procedures even after registration -> para 2 -> preserved.
- Taipei advance inquiry (營業場所預先查詢) for company and business registrations within its scope; result does not establish compliance with other licensing or professional-activity laws -> para 3 -> preserved; internal link `/en/columns/taiwan-company-setup-pitch-location` kept. ("alone" dropped; the sentence still says the result does not establish the other compliance, same effect.)
- Other localities: confirm local government and competent authority procedures; written suitability confirmation before long-term lease or facilities investment -> para 3 -> preserved.

### Section 4 ("Work Permits, Residence, and Capital", heading unchanged)
- Same person may be applicant, shareholder, worker, residence applicant; legally distinct roles; investment approval reviews capital inflow, work permit reviews performance of work, ARC reviews purpose and duration -> intro para -> preserved.

#### H3 (was "Company Formation, Work Authorization, and Residence", now "Work Authorization and Residence")
- Formation does not by itself confer work authorization or residence -> rendered as reader question + "Not by itself." + statement -> preserved, no new fact.
- Work-permit review factors (duties and qualifications, role, investment relationship, employer's performance, materials as a whole) -> preserved verbatim.
- ARC applied for separately per purpose of residence; validity and renewal from the disposition and the law in effect at the time -> preserved.
- Students may invest and form a company; investor/shareholder status ≠ immigration status permitting employment or management; anyone contracting, directing employees, managing day to day must determine work-permit category and requirements before starting -> preserved.
- Spouse and minor children of an ARC holder (work permit or similar) may separately apply for dependent residence if requirements met; proof of relationship, support, purpose; not automatic -> preserved.
- Permanent residence: as a general rule, ordinary foreign national, five consecutive years, at least 183 days each year, among other requirements; different calculation rules for foreign professionals and others; conduct, assets, skills reviewed -> preserved; link `/en/columns/taiwan-permanent-residence-aprc` kept.

#### H3 (was "Company Capital and Work Permits for Foreign Managers", now "Capital and the Foreign-Manager Work Permit")
- No generally applicable statutory minimum capital; industry laws may require capital or security deposits; bank may review business plan and risks -> para 1 -> preserved.
- Foreign-manager category covers manager (經理人) of a company where overseas Chinese/foreign investors collectively hold more than one-third of issued shares or total capital; manager of a Taiwan branch; representative of a representative office -> para 2 -> preserved.
- Representative office established at least one year must have a record of activities; waived under one year -> para 2 -> preserved.
- Under one year, at least one of: NT$500,000 paid-in capital or Taiwan working capital / NT$3 million revenue / US$500,000 import-export / US$200,000 agency commissions -> list 1 -> preserved verbatim.
- At least one year, at least one of: NT$3 million / US$500,000 / US$200,000, measured by most recent year in Taiwan or average of preceding three years -> list 2 -> preserved verbatim.
- Special approval for substantial contribution to economic development or special circumstances -> closing para -> preserved.
- Figures are employer-qualification requirements, not a universal minimum capital; meeting them ≠ automatic work permit -> closing para -> preserved (split into two sentences).
- Same employer hiring more than one person through this route: general requirements of Chapter 2 apply instead; citation Article 38(2) of the Qualifications and Criteria Standards for Foreigners Undertaking Jobs under Article 46, Paragraph 1, Subparagraphs 1 to 6 of the Employment Service Act -> closing para -> preserved; citation reordered (article first, Standards title after) but attached to the same claim.

### Section 5 (was "5. Taxes and the Taiwan–Korea Income Tax Agreement", number dropped)
- Business tax 5%, returns generally every two months; profit-seeking enterprise income tax 20%, actual liability depends on taxable income and rules; nonresident dividends generally withheld at 21% -> para 1 -> preserved.
- Business tax vs income tax: different bases and filing methods; tax on revenue vs tax on taxable income -> para 2 -> preserved.
- Payments of dividends, interest, royalties, service fees to overseas shareholder/related company: review character, recipient status, domestic withholding, treaty application in advance -> para 2 ("Before paying…") -> preserved.
- Agreement in force December 27, 2023, applies from January 1, 2024; 10% maximum source rate for dividends, interest, royalties each; Korean-related fact pattern meeting conditions; not a worldwide investor rule; reduced rates not automatic -> para 3 -> preserved ("merely because the treaty exists" compressed into "Reduced rates are not automatic"; same meaning).
- Taxpayer must confirm treaty residence, beneficial ownership, legal character of income, certificate of residence and application documents; keep structure/contracts/invoices/work/payment flows consistent; filing deadlines and record retention reviewed separately -> para 3 -> preserved.
- Business profits taxable only in residence jurisdiction unless, among other circumstances, a PE exists under the agreement; manner of business examined first -> para 4 -> preserved ("Under the agreement" moved to the front of the sentence).
- PE categories: fixed facilities (place of management, branch, office); construction more than six months; services more than 183 aggregate days in any 12-month period; agent repeatedly exercising authority to conclude contracts; four categories with different conditions; fixed place / agent assessed independently of service days; PE and business-profits taxation not decided by the 183-day figure alone -> para 4 -> preserved.

### Official Sources, closing, disclaimer, signature
- 12 source entries: identical text and URLs (guard confirms).
- Services / profile / contact links: all three kept with same targets; wording shortened ("For a specific matter, use Contact Our Office"). No sales line added.
- Disclaimer: general overview, not legal or tax advice for a specific matter; variation with investment structure, industry, nationality and immigration status, agency practice; confirm latest official sources and the individual facts before investing, contracting, or employing -> preserved in three shorter sentences ("educational resource" label dropped; no content lost).
- Signature "Wei Tseng (曾雋崴), Taiwan Attorney" -> unchanged.

### Additions check
New sentences are all transitional framing with no factual content: "Registration is not the finish line." / "Branches work differently." / "Then there is the representative office…" / "Banks come in at the preparatory account." / "Does forming a company let a foreign national work in Taiwan? Not by itself." / "The operating model matters as well." No new facts, examples, cases, numbers, first-person stories, promises or sales lines.

## Blocking issues

None.

## MONOTONY items

None blocking. Rule section 5 self-check, as read by a native English reader:
1. Tool check: OK, no FAIL.
2. Opening: short declarative line, not a stock hypothetical opener.
3. Very short sentences: present throughout ("Not by itself.", "Branches work differently.", "It is not a worldwide investor rule.", "Reduced rates are not automatic.").
4. Paragraph openers read vertically: no word opens three paragraphs; "The" opens one body paragraph.
5. Citation rhythm: only one inline statute citation in the body (as in the original); several paragraphs without citations.
6. Contrast templates: tool count 0. The remaining negations ("not a worldwide investor rule", "not automatic", "not a universally applicable minimum capital requirement") each carry a legal condition from the original and are not rhetorical rebuttals.
7. Closing: the last body paragraph ends on this column's facts (the 183-day figure and PE). The disclaimer and contact lines are the original's structural tail, shortened and reworded, no copied formula, no sales phrasing.
8. Register: plain English, consistent. No bold, no emoji, headings are nouns, not imperatives or checklist items; the "1."–"5." heading numbers were dropped, which the tests patch re-pins.
9. No fact, number, citation, link or qualifier lost (see table).

Minor observation, not a MONOTONY finding: the closing-paragraph pattern "X… Y… The Z alone settles nothing / should not decide…" appears twice (end of section 1 and end of section 5). Both sentences carry the original's own qualifier, so I left them.

## Padding

Rewrite is shorter (2148 -> 2092 words, 97%). Cuts are compressions of wordy phrasing ("is the stage at which the proposed name and business are checked" -> "checks the proposed name and business"; "it is efficient to identify" -> "it saves time to learn"; "an educational resource providing a general overview" -> "gives a general overview"). No legal point removed.

## Tests verdict: PASS

tests.patch touches only `src/lib/__tests__/columns-en-investment-001.test.ts` and only re-anchors pins of this column:
- `lastmod` and `post.date` -> 2026-10-12.
- Exact-paragraph constants (residence, capital intro, thresholds, Article 38(2), tax, treaty, related services, disclaimer) carry the new wording with every number, date, rate, citation and link intact. The old single capital paragraph is now pinned as two constants (`capitalIntroParagraph` + new `foreignManagerCategoryParagraph`), so the one-third shareholding rule, the three covered roles and the one-year record rule stay locked.
- Heading tests: the numbered-H2 regex became a five-content-H2 check that excludes "Official Sources"; the full H2 list and both H3 names are pinned to the new wording. Test title renamed accordingly.
- Ten-step section: split anchors updated; all ten steps still asserted in order; the "order, necessity, and duration" qualifier and the follow-up-time qualifier re-anchored to the new phrases.
- Required phrases: eleven re-anchored, each still locking the same fact (no shareholders, 183-day figure alone, preliminary-review caveat, not a minimum capital requirement, no automatic issuance, dependent residence, conduct/assets/skills, one-year waiver).
- Image position anchors updated to the new headings and opening sentence.
- Word-count pins updated (visible 2,365 -> 2,300; prose 2,138 -> 2,087); `read_time` stays "9 min read", which the test still checks.
- No `.skip` / `.only` / `.todo`; no deleted assertions; no other column's tests touched. tests.txt: vitest green, 112 files.

## Tiny edits applied

None. One candidate was considered and deliberately not applied, see the first item under "Original issues / nits" below.

## Original issues (not blocking) and nits

1. Punctuation nit introduced by the rewrite (draft.md line 107): the closing citation reads "…Employment Service Act.)" with the sentence period inside the parenthesis; the original had "…Article 38(2))." with the period outside. The correct form is "…Employment Service Act)." I did not change it because tests.patch pins this exact paragraph (`article38Paragraph`) and vitest cannot be run from this review sandbox (the repo worktrees under ~/Projects are outside the allowed directories), so an edit to both files could not be verified. Word count is unaffected by the fix. If the operator wants it corrected before shipping, change the two characters in draft.md and in the `article38Paragraph` line of tests.patch together and re-run the pinned test file.
2. Carried over from the original (also noted by the rewriter): the opening says completing registration does not mean investment-fund verification is complete, while the ten-step list places 投資額審定 (step 6) before company registration (step 7). Both can be true depending on the case flow, but the ordering may deserve a check in a later content pass.
3. Carried over from the original: no source-check date in the sources section and no contact email in the closing block (house format of this older column; tolerated by lint and guard).
4. Not re-litigated here: the 21% dividend withholding rate, the 183-day services-PE test and the six-month construction-PE test are stated as in the original.
