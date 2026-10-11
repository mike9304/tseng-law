# FINAL REVIEW r1 — en-002-withdraw-capital-taiwan-company (reviewer: Claude Fable 5.1, 2026-10-12)

VERDICT: PASS

## Scope checked

- Read in full: orig.md, draft.md, guard.txt, notes.md, tests.patch (25,718 bytes, one test file), tests.txt, claude-tests1.log, vitest-1.log.
- Rules read: SENTENCE-VARIETY-RULE.md sections 5–6, COLUMN-VOICE-RULE.md, LESSONS.md (top items skimmed).
- Tools run by me (output recorded below):
  - `variety_metrics.py check draft.md --lang en` → `sentences=117 mean=19.4 cv=0.46 short=0.162 run3=0.078 opener_rep=0.111 cite_end=0.009 cite_para=0.139 contrast=0 caveat=1 q=2` / `OK — no variety limit violated`.
  - `guard.py orig.md draft.md en withdraw-capital-taiwan-company --today 2026-10-12` → `GUARD: PASS` (length 3212 → 3162, 98%; monotony score 23.8 → 3.8; pre-existing lint notes only).
  - A throwaway Python comparison (deleted afterwards): front matter + H1 + featured image differ only at `lastmod`; the block from `## Official Sources` to the end is byte-identical except the reworded disclaimer paragraph; every article number, paragraph number, NT$ amount, day count, "six months", "one year", "one month", "two-thirds" and "a majority" occurs the same number of times in both files; all 11 links identical in order; H2 list identical except heading 1.
- Repo test run (from vitest-1.log, run by the tests step, not by me): 78 files / 1025 tests passed, including `columns-en-investment-002.test.ts` (13 tests).

## 1. Fact preservation — claim by claim

Legend: P = preserved with the same meaning; R = reworded, same meaning; — = note.

### Front matter
| Original | Rewrite | Status |
|---|---|---|
| title, seoTitle, url, date_display, read_time "14 min read", categories, featured_image, summary | identical | P |
| lastmod 2026-10-06 | 2026-10-12 | expected change |
| FAQ 1–3 (dissolution+liquidation then residual distribution; capital reduction as lawful route; expenses/dividends/loans need separate basis; 2/3 voting for limited company; 2/3 attendance + majority for company limited by shares; public-offering fallback majority attendance + 2/3 in favor; articles may raise; 15 days dissolution registration; suspension ≥1 month → registration before or within 15 days, Business Tax Act proviso Art. 3 para 1, each period ≤ 1 year; annual income tax return still due) | identical text | P |
| H1, featured image line, img-01 line | identical | P |

### Introduction
| Original point | Rewrite | Status |
|---|---|---|
| Owners' first question: can paid-in capital be transferred immediately to a shareholder's account | Opening question "Can the capital ... go straight back to a shareholder's account ..." + "It is one of the first questions they ask." | R |
| Once funds enter the company account they are company property; belongs to company, not shareholders personally | para 1, sentence 4 | P |
| Principle unchanged even if one shareholder owns 100% or is sole director | "That holds even where one shareholder owns the entire company or is its sole director." | P |
| Shareholder cannot freely withdraw deposits/assets merely because they contributed capital; list of asset types handled within company's rights and obligations | para 2 | P (verbatim apart from "once contributed capital") |
| Merely stopping operations does not extinguish legal personality or filing obligations | "Stopping operations does not end the company. Its legal personality and filing obligations remain." | R |
| Permanent closure: connect dissolution registration and liquidation so contracts, claims, debts, taxes, residual assets settled | "For a permanent closure, dissolution registration and liquidation should be linked so that ..." | P |
| — | New connector sentence "The answer starts with whose money it is." | — rhetorical bridge, no legal content; acceptable |

### Section 1 (heading "Must Be Distinguished" dropped; the distinction itself is stated in the body, same as the shipped ja version)
| Original point | Rewrite | Status |
|---|---|---|
| Capital = equity item, amount paid at incorporation or capital increase | para 1 sentences 1–2 | P |
| Not always equal to current account balance; "capital" cannot describe all assets/liabilities acquired in business | para 1 sentence 3 | P |
| At closing consider actual property/liabilities, receivables/payables, taxes, contingent liabilities, liquidation costs together rather than only book capital | "the amount of capital recorded in the books is too narrow a focus. Actual property ... must be considered together." | R |
| Legal nature of the transaction must be determined first | "depends first on the legal nature of the transaction" | P |
| Five categories (payment for goods/services, lawfully declared dividend, repayment of shareholder loan, capital reduction, post-liquidation residual distribution) each with own requirements | all five listed, "each have their own requirements" | P |
| Renaming / arbitrary book account does not change character | "Renaming a transaction, or assigning it an arbitrary account in the books, does not change its character." | P |
| Art. 9 Company Act: (a) capital not actually paid but represented as fully paid, (b) capital returned to shareholders or shareholders permitted to recover it after registration → imprisonment ≤ 5 years, detention, or fine NT$500,000–2.5 million | para 3: both limbs, "after registration" placed before both limbs (consistent with the statute's 登記後 governing 發還 and 收回), same penalty figures | P |
| Art. 9 does not generally punish ordinary lawful uses; rent, wages, supplier payments, taxes for actual operations distinguished from false representation / return of capital | para 3 ("generally" kept; "For example" dropped, no loss) | P |
| Even a transfer labeled business expense may raise separate company-law / tax-law / accounting issues if use, counterparty, consideration or decision authority unclear | "Still, even a transfer labeled a business expense may raise separate issues ..." | P |
| In liquidation creditors and taxes rank before shareholder's recovery | "Creditors and taxes come first in liquidation. A shareholder's recovery of an investment ranks after them." | R |
| Art. 90: liquidator distributing to shareholders before paying debts → imprisonment ≤ 1 year, detention, or fine ≤ NT$60,000 | same, citation moved to end parenthesis "(Company Act, Article 90)" | P |
| Shareholder loan claim: check loan agreement, flow of funds, interest terms, accounting treatment, order of repayment | verbatim | P |
| Other civil/criminal/tax liabilities depend on purpose and authority of transfer, evidence, accounting treatment, relationship of parties | verbatim list, colon instead of "including" | P |
| Check resolutions, contracts, tax calculations/filings, bank records, books for consistency | verbatim | P |
| Practical first step: separate company-name assets from shareholders' personal assets; separate schedule of company–shareholder claims and debts | "two lists are a useful start ..." | R |

### Section 2
| Original point | Rewrite | Status |
|---|---|---|
| Dissolution ends ordinary business and moves to liquidation; liquidation settles remaining affairs and property relationships | para 1 | P |
| Dissolution registration alone does not extinguish every debt nor convert company property to shareholder property | para 1, two sentences | P |
| "general checklist"; authorities, documents, announcements/notices, tax treatment, court reports to be confirmed by company type, cause of dissolution, facts | "The steps below follow the general order." + same confirmation sentence | R (checklist → order; no legal content) |
| Step 1: documents to obtain; items to list; foreign-investment approval companies also review investment structure, remittance routes, bank/FX documents; identify termination costs, employment settlement steps, asset-disposal restrictions, security enforcement before the closing resolution to calculate liquidation resources realistically | all items present; last point split into two sentences | P |
| Step 2: Art. 113 limited company ≥ 2/3 voting rights | "(Company Act, Article 113)" attached to the same rule | P |
| Art. 316 company limited by shares, as a general rule: attendance ≥ 2/3 issued shares, approval by majority of voting rights represented | "Article 316 sets the general rule: ..." | P |
| Public-offering company fallback: majority of issued shares attending, ≥ 2/3 of represented voting rights in favor | same | P |
| Articles may impose higher share/voting requirements, must be followed | same | P |
| Check meeting notice, voting, minutes, conflicts of interest | verbatim | P |
| Step 3: Art. 4 Company Registration Regulations (公司登記辦法), as a general rule, change registration within 15 days after a registered matter changes | same, "As a general rule" at sentence start | P |
| Dissolution change registration within 15 days after dissolution | same | P |
| Dissolution registration, tax registration closure, business-tax procedures, permit cancellation = different authorities/effects, not one filing | same, split | P |
| Step 4: profit-seeking enterprise income tax current-period final return within 45 days after competent authority approves dissolution | same | P |
| Check filing period, meaning of approval date, calculation method against the approval document and rules | same (order with next item swapped) | P |
| Official tax guidance: period begins day after the authority sends the approval document = day after issuance date | "Official tax guidance counts the period from the day after ..." | P |
| Books to reflect revenue/expenses through dissolution date, disposal gains/losses, accrued expenses, withholding, taxes paid | verbatim | P |
| Step 5: liquidator appointment (articles / shareholder resolution / statutory), court report; inventory and balance sheet; conclude affairs, collect claims, preserve/realize assets; pay debts and taxes; notices, announcements, creditor-protection; existence and order of wage/severance, secured, tax, general debts under laws and facts | all present | P |
| Step 6: not only book cash; collectability, disposal costs, taxes, litigation risk, liquidation costs | "Cash recorded in the books is only part of the picture ..." | R |
| Only residual assets after all debts and taxes may be distributed, under rules, articles, ownership interests | verbatim | P |
| Residual assets ≠ paid-in capital; do not assume contributed amount returns unchanged | two sentences | P |
| Before distribution: tax character, allocation, remittance documents for foreign shareholders, FX procedures | verbatim | P |
| Step 7: liquidation-income return within 30 days after liquidation ends; liquidation-completion report to court; consistency of liquidation-period figures; bank accounts, seals/documents, statutory book retention, permits/licenses/contracts | verbatim | P |
| Merger/split-up/bankruptcy dissolution may be exempt from ordinary liquidation | verbatim | P |
| Voluntary dissolution may need extra procedures (litigation, long-term receivables, real estate, security, employees, unpaid taxes, complex foreign investment) | verbatim | P |
| Liquidator must complete within six months: Art. 87(3), applied to companies limited by shares by Art. 334, to limited companies by Art. 113(2); extension on application to court with reasons | split into three sentences, every article attached to the same proposition | P |
| Asset disposal before/after dissolution: counterparty, price, director/shareholder interests, internal approvals, tax consequences; related-party transfer or waiver of claims needs separate review of effect on company and creditors | same ("In particular" dropped) | P |
| Cross-link to taiwan-company-dissolution-liquidation column | same link, same anchor text | P |

### Section 3
| Original point | Rewrite | Status |
|---|---|---|
| Liquidation is not only for asset-exceeds-liability companies | "not reserved for companies whose assets exceed their liabilities" | R |
| Art. 89: property insufficient to pay debts → liquidator must immediately apply for bankruptcy declaration | verbatim, "immediately" kept | P |
| Whether ordinary liquidation can continue determined individually (excess liabilities, inability to pay, security, tax debts, number of creditors) | verbatim | P |
| Central questions (insufficiency, payment dates/cash flow, security and priority, when liquidator learned), as shown by actual records | same four questions; "The actual records have to answer them." | R |
| If finances unclear, do not calculate shareholder amount first; review beyond latest statements (post-date debts, guarantees, litigation claims, employee amounts, tax-audit possibility, disposal value) | same | P |
| Excess liabilities (generally; balance-sheet comparison) vs inability to pay (due debts) | same, "generally" kept | P |
| Substantial book assets may still mean inability to pay if illiquid or secured; temporary cash shortage alone does not necessarily mean same procedure | verbatim | P |
| Once liquidator learns of insufficiency, must consider Company Act duties; paying one creditor/shareholder first may prejudice others and fairness | same | P |
| Additional funds / restructuring must be documented; new loan, capital increase, debt waiver, creditor agreement have different accounting/tax effects | same | P |

### Section 4
| Original point | Rewrite | Status |
|---|---|---|
| Business continues but capital needs reduce → capital reduction as lawful way to return part of contributions | same | P |
| Not an informal means to take deposits at will; not always available | same, two short sentences | P |
| Capital reduction = company-law procedure changing capital amount; not completed by bank transfer + book entry | same | P |
| Must check: resolution for company form, creditor protection, capital verification and accounting, foreign-investment matters, taxes, remittance, change registration | verbatim | P |
| Examine source of funds; must still operate after wages, taxes, supplier invoices, loans, guarantees, anticipated expenses | same (question form opener) | P |
| If reduction weakens creditor protection or ability to meet obligations → closer review of procedure and directors' responsibility | verbatim | P |
| Foreign shareholders: investment approval/report, register, capital change, FX records, bank remittance documents consistent; remittance abroad needs registration records, investment documents, tax materials, explanation of funds as bank requires | same | P |
| Tax on capital-reduction receipts not determined by "return of principal" label; check capital composition, method, acquisition cost, character, residence-country tax; withholding, filings, foreign tax paid, agreements | verbatim | P |
| Expenses ≠ capital reduction; dividends ≠ capital reduction or post-liquidation distribution; loan repayment separate | one lead sentence covering all three + "Dividends must also be distinguished from a post-liquidation distribution." | P |
| Expense supported by contract, details, tax documentation, approval when goods/services actually received for reasonable consideration; shareholder/director supplier → need, price, conflict approval, expense-recognition requirements | same | P |
| Dividend needs distributable profits, financial information, resolution; followed by payments, withholding, filings; cash ≠ distributable profits; check losses, statutory reserves, retained earnings | same | P |
| Shareholder loan: agreement date, principal transfer, interest, maturity, book entries, use of funds; repayment stage interest withholding and related-party issues; no retroactive relabeling of contribution as loan | same | P |
| Same-day payments to same shareholder recorded separately; decision records show company can operate and pay debts after payment | same | P |

### Section 5
| Original point | Rewrite | Status |
|---|---|---|
| Suspension stops operations while retaining legal personality; for possible resumption or time to settle; does not extinguish company or settle all rights/obligations | same, split into short sentences | P |
| ≥ 1 month suspension → registration before or within 15 days after start; exception: already reported to and recorded by tax authority under Business Tax Act (proviso Art. 3 para 1, Regulations Governing Company Registration); each period ≤ 1 year | parenthesis made its own sentence; all three elements present | P |
| Set start/end dates; check whether separate company-registration and business-tax filings required | verbatim | P |
| During suspension, changes (address, responsible person, articles, capital) still need change registration; maintain address/responsible person; follow procedures on shareholder/officer/capital changes | same | P |
| Vehicles/buildings/assets → local taxes, management fees, insurance continue | same | P |
| Before suspension: contracts, employment, permits/licenses renewal; designate person for bank/e-tax; book retention system | same | P |
| Annual income tax return still required for suspension year; other obligations may remain (pre/post transactions, assets, withholding, employees, industry); no sales ≠ no filing obligation; check with tax authority | same; lead sentence "Suspension is no blanket exemption from tax filings." restates FAQ 3's "does not categorically exempt it from tax filings" | P (— restatement, not a new claim) |
| Before period ends: resume / further suspension / permanent closure; resumption checks; closure preparation; suspension not a substitute for dissolution and liquidation | same | P |

### Sources, related services, disclaimer, signature
| Original | Rewrite | Status |
|---|---|---|
| Official Sources 1–5 (URLs, labels) | byte-identical | P |
| Related Services 1–3 | byte-identical | P |
| Disclaimer: general information and educational material; not legal advice; six variable factors; review before resolution or transfer | same four elements, three sentences | P |
| Signature "Wei Tseng (曾雋崴), Taiwan Attorney" | identical | P |
| No contact line in original | none added | P |

Nothing new was added: no new facts, examples, cases, numbers, first-person material, promises or sales lines. The only sentences without an original counterpart are the rhetorical bridge "The answer starts with whose money it is." and the restating lead "Suspension is no blanket exemption from tax filings." Neither carries a legal claim beyond what the original and FAQ already state.

## 2. Front matter
Only `lastmod` changed ("2026-10-06" → "2026-10-12"). `read_time` unchanged at "14 min read" (prose words 3,155 → 3,105 by the repo counter, still 14 minutes). H1 and both image lines unchanged.

## 3. AI voice / monotony
- Tool: OK, no FAIL, no WARN (figures above).
- Self-check section 5: (2) opens with the owner's real question, not a "Suppose" formula; (3) several very short sentences ("It is not always available." "The company is not extinguished." "The latest financial statements are not enough."); (4) paragraph openers read vertically: no word appears three times outside the numbered steps (Dissolution ×2, How ×2, Before ×2, Determine ×2 as list items); (5) citations are sparse and spread, no three consecutive claim→caveat paragraphs, many citation-free paragraphs; (6) contrast templates 0 by the tool, the remaining "not X" statements are legal propositions carried over from the original and none rebuts a claim the reader did not make; (7) the last body paragraph ends on the column's own fact (suspension is no substitute for dissolution and liquidation), the disclaimer and signature are the original's required closing, unchanged in content; (8) no bold, no invented first person, no imperative checklist headings (the seven numbered steps are the original's real procedural sequence); (9) no article, deadline, amount, link or label lost (verified by count).
- Native reading: plain English, no translationese found. Register is formal legal prose, as the original. Rhythm now alternates long list sentences with short declaratives. Citation positions vary (sentence subject, "Under", end parenthesis, mid-clause).
- MONOTONY items: none blocking. One nit, not fixed because the sentence is pinned verbatim in tests.patch: "One separates assets ... The other is a separate schedule ..." repeats "separate" (section 1, last paragraph).

## 4. Length / padding
3,212 → 3,162 words by the guard (98%). Cuts are wording only ("For example", "Merely", "In particular", "fundamental principle", "however"); no legal point, list item, qualifier or caveat removed.

## 5. Tests (tests.patch)
Verdict: PASS.
- Touches only `src/lib/__tests__/columns-en-investment-002.test.ts`; 52 lines added / 52 removed; no it()/test() blocks added or removed; no `.skip`, `.only`, `.todo`.
- `lastmod` and `post.date` expectations → "2026-10-12"; `h2s[0]` → new heading; disclaimer constant → new wording.
- Multi-sentence constants (suspension rule, suspension tax, permanent closure, liquidation period, Articles 9, 89, 90) now hold the full new passages, so the 15-day rule with the Art. 3 para 1 proviso and one-year cap, the six-month limit with Arts. 87(3)/334/113(2), the Art. 9 and Art. 90 penalty figures, and the Art. 89 duty remain locked.
- Re-anchored phrases keep every legal lock: Art. 113 two-thirds, Art. 316 attendance/majority, public-offering fallback (unchanged line), Art. 4 15 days, 15 days after dissolution, 45 days, day-after-issuance start, 30 days, "requires the liquidator to complete it within six months", extension by court application, related-party transfer review, dividends/expenses/loan separation, "Retroactively relabeling a capital contribution as a loan should be avoided", suspension-not-a-substitute.
- Word-count expectations 3,288/3,155 → 3,234/3,105 taken from the test's own counter; read_time assertion unchanged. (notes.md item 9 says 3,099 prose words; the test and vitest log say 3,105. The test number is the one that ran and passed; the notes figure is a reporting slip, not a content issue.)
- No assertion about another column touched. Full suite: 78 files / 1025 tests passed (vitest-1.log).

## 6. Tiny edits applied by reviewer
None. Guard re-run by me on the unedited draft: GUARD: PASS.

## 7. Original issues (not blocking, kept as written in both versions)
- Arts. 9 and 90 are rendered "imprisonment, detention, or a fine"; the statute allows the fine in lieu of or in addition to (科或併科), so "or" slightly understates. Art. 9 punishes the company's responsible person; neither version says who is punished.
- Arts. 89 and 90 sit in the unlimited-company chapter and reach other company types by cross-reference; only the Art. 87(3) chain (334, 113(2)) is spelled out.
- The 45-day final return and 30-day liquidation return carry no statute citation (Income Tax Act Art. 75); the six-month liquidation period has no stated starting point.
- The same regulation is called "Company Registration Regulations (公司登記辦法)" in step 3 and the sources list and "Regulations Governing Company Registration" in section 5 and FAQ 3. Whether the suspension rule is Art. 3 para 1 proviso and the 15-day change-registration rule is Art. 4 of the current 公司登記辦法 was not verified here (no network); the article numbers are unchanged from the published original. 확인 필요 for a future accuracy pass.
- Pre-existing lint notes (no contact email, no source-check date, last H2 is Related Services, "0800" inside pcode J0080001) are house format of the original.

VERDICT: PASS
