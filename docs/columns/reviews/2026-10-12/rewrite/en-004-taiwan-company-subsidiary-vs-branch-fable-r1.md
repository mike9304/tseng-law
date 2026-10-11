# FINAL REVIEW r1 — en-004-taiwan-company-subsidiary-vs-branch (reviewer: Claude Fable 5.1, 2026-10-12)

## Verdict

PASS. The rewrite preserves every legal statement, qualifier, number, article reference, table, list, source entry, disclaimer point and the signature of the original. No new facts, examples, numbers, first-person material or sales lines were added. One qualifier had drifted slightly; I restored it with a one-word edit (listed below), re-ran the guard (PASS) and re-anchored the single affected test literal.

## Scope checked

- orig.md vs draft.md, read in full, section by section, claim by claim (intro, §1–§7, the new §8 that holds the former §7 conversion/exit paragraphs, Official Sources, Related Services, disclaimer, signature, front matter incl. FAQ).
- guard.txt (GUARD: PASS) and re-run of guard.py after my edit (GUARD: PASS, length 5429 -> 5217, 96%).
- variety_metrics.py check --lang en: OK, no limit violated (cv 0.473, short 0.136, run3 0.028, opener_rep 0.094, cite_end 0.004, contrast 0, caveat 0, q 3).
- notes.md (rewriter's notes), tests.patch (26 KB, one test file), tests.txt / vitest-1.log (80 files passed, 1096 tests), p-tests1.txt.
- SENTENCE-VARIETY-RULE.md §5–6, COLUMN-VOICE-RULE.md, LESSONS.md (skimmed).
- Structural diff by script: tables identical; 8-item list identical; Official Sources + Related Services + signature byte-identical; H1 and both image lines unchanged and in the same positions; no bold/underscore/strong/emoji; "merely" 0, "However" 0, "rather than" 0, "not only" 0.

## Front matter

Identical except lastmod "2026-10-06" -> "2026-10-12" and read_time "28 min read" -> "27 min read". Site formula ceil(words/200): 5,329 visible words after my edit -> 27. FAQ q/a text unchanged. H1 and featured/inline image lines unchanged.

## Claim-by-claim fact table

Legend: P = preserved with same meaning; M = moved (same meaning, different place); R = reworded, meaning checked equal.

### Intro
| Original point | Rewrite location | Status |
| --- | --- | --- |
| Foreign company doing ongoing business in Taiwan often considers subsidiary or branch | Intro para 1, sentence 3 | P |
| Both give a presence; differ on contracting party, debt bearer, third-party investment, profit-transfer procedures | Intro para 1 | P |
| Comparing only ease of establishment may cause liability/tax issues; consider whole life cycle | Intro para 1 | P |
| New opening two sentences (branch debts are the foreign company's; subsidiary debts generally stay with it) | Intro para 1 | Derived from §3 sentences 1 and 2 of the original ("the debts of a Taiwan branch are debts of the foreign company"; "debts incurred by the subsidiary generally belong to it"); "generally" kept. Not a new fact. |
| Subsidiary = independent legal entity under Taiwan law; parent may be shareholder; rights/obligations distinct | Intro para 2 | P |
| Branch = part of foreign head office, no separate legal personality; "local office" informal; article uses "branch" | Intro para 2 | P |
| Suitability factors (industry … discontinuation plan) | Intro para 3 | P (list identical) |
| Must consider home-country accounting, tax, outbound-investment rules, not only Taiwan law | Intro para 3 | R ("Taiwan law is only part of the analysis.") |
| Korea is one labeled example, not the only origin country | Own 2-sentence paragraph | P |
| Preview sentence ("The discussion below compares … in that order") | cut | Removed; carries no legal point (allowed) |

### §1 Legal Personality and Ownership Structure
| Original point | Rewrite | Status |
| --- | --- | --- |
| FAQ 1 answer verbatim as lead (no shareholders; consider subsidiary; assess liability, voting, financing, licences, tax) | §1 para 1, preceded by the FAQ question + "Neither can." | P (verbatim; answer consistent with FAQ) |
| Company Act Art. 1 definition | §1 para 2 | P (article attached to same claim) |
| Subsidiary distinct from parent; can lease, contract, acquire property, litigate in own name | §1 para 2 | P |
| "As a rule" contract rights/obligations belong to subsidiary | §1 para 2 | P (qualifier kept) |
| Parent policy/officer appointment does not merge the two | §1 para 2 | P |
| Liability scope depends on company form and conduct | §1 para 3 | P |
| Art. 99(1): limited-company shareholder generally liable only up to contribution | §1 para 3, end-parenthesis citation | P |
| Art. 99(2) exception: abuse of juristic-person status + difficulty satisfying a specific debt + serious -> liable to extent necessary | §1 para 3 | P (all three conditions) |
| Guarantee / tort participation liability must be considered | §1 para 3 | P (verbatim) |
| Limited liability is a starting point, no guarantee of cap in every situation | §1 para 3 | R ("does not ensure") |
| Art. 371: no business in own name without branch registration | §1 para 4 | P |
| Art. 372: appropriate funds exclusively for branch + designate responsible person | §1 para 4 ("two requirements") | P (count word accurate) |
| Funds are head-office funds, not shares/equity; responsible person does not make branch independent | §1 para 4 | P |
| Table (5 rows) | identical | P |
| JV: percentages not enough; list of 11 matters; subsidiary advantage; contractual JV / SPV / other lawful method; not sole solution | §1 para 5 | P |
| Branch: foreign company ultimately responsible; head office should define contracts, banking, personnel, reporting, budget, controls | §1 para 6 | P |
| Subsidiary: document articles, governance, allocation of powers, service/loan/licence agreements | §1 para 6 | P |
| Label matters less than actual authority/flows | §1 para 6 | R |
| Licences not determined by legal personality; industry rules; registrability ≠ permission; break down activities and identify contracting party / licence holder | §1 para 7 | P |

### §2 Tax and Profit Remittances
| Original point | Rewrite | Status |
| --- | --- | --- |
| FAQ 2 lead: 5% business tax and 20% PSE income tax "generally" | §2 para 1 | P |
| FAQ 2 lead: 21% domestic withholding on dividends, 10% ceiling under Taiwan–Korea Agreement if requirements met | §2 table row 3 + §2 para 4 | M (stated once in table, once in detail; same conditions) |
| FAQ 2 lead: branch remittance of after-tax profits generally no additional withholding, not a dividend | §2 table row 3 + §2 para 5 | M |
| FAQ 2 lead: head office outside Taiwan exempt from filing 5% undistributed-earnings return | §2 table row 4 + §2 para 6 | M (5% rate stays in table row 4 and para 6) |
| Business tax: indirect tax on supplies in Taiwan; 5%; two-month period; zero-rating/exemptions/special rates/input credits vary; both must consider; 5% alone ≠ same tax | §2 para 2 | P |
| PSE income tax on taxable income; 20% above statutory threshold; not gross revenue × 20%; base varies with recognition, deductions, depreciation, losses, credits, TP | §2 para 3 | P |
| Table (5 rows) | identical | P |
| Dividend: separate persons; 21% domestic; Korean resident + within Agreement + requirements incl. beneficial owner -> 10% ceiling "may be considered"; not automatic; check residence certificate, BO analysis, timing, application/refund | §2 para 4 | P |
| Branch profits belong to head office; after PSE tax paid, remittance distinct from dividend; generally no additional dividend withholding at branch level | §2 para 5 | P |
| Not all head-office payments treated the same; interest, royalties, service fees, asset payments, third-party payments assessed separately | §2 para 5 | P after my edit (see tiny edits: "necessarily" restores the original's "does not mean … always" hedge) |
| Undistributed earnings: subsidiary 5% under Income Tax Act Art. 66-9 "may apply"; MOF guidance exempts foreign-head-office enterprise from filing; not untaxed, documentation remains | §2 para 6 | P |
| Look beyond rate table; subsidiary own books; reinvestment/dividend timing/shareholder loans/royalties; branch attribution and shared-expense allocation; internal dealings presentation/attribution | §2 para 7 | P |
| Transfer pricing: applies to both; consistency list; head-office payment ≠ automatic deduction; intragroup agreement ≠ automatic recognition; retain arm's-length records | §2 para 8 | P |
| Korean side: FTC, foreign-subsidiary dividends, branch income/losses, consolidated/separate accounting, FX filings; initial-loss treatment varies; cannot conclude branch reduces Korean burden; single calculation of four items | §2 para 9 | P |

### §3 Debts and Legal Liability
| Original point | Rewrite | Status |
| --- | --- | --- |
| Branch debts = foreign company's debts; "as a rule" head office bears lease/sale/service/employment/loan obligations lawfully entered by responsible person in foreign company's name | §3 para 1 | P |
| Losses or insufficient branch assets do not limit liability to appropriated funds | §3 para 1 | P |
| Subsidiary debts generally its own; Art. 99 principle: limited company up to contributions; company limited by shares generally up to subscribed shares "under the rules applicable to that company form" | §3 para 2 | P (hedge kept) |
| Important for high-risk, long-term, many employees/consumers | §3 para 2 | P |
| Subsidiary does not shield parent from every risk | §3 para 3 (question + "It does not.") | P |
| Parent guarantee; assumption/joint signature; statutory exception for commingling or abuse harming creditors; boundary shaped by registration and actual operations | §3 para 4 | P |
| Director/manager/responsible-person duties; personal liability examples; regulatory areas governed by each law; group division of work should be documented | §3 para 5 | P |
| Contract clauses list; insurance vs internal controls; seal/e-signature etc. procedures preserve separation | §3 para 6 | P |
| Not reducible to "subsidiary safe, branch risky"; branch direct liability; subsidiary starts from separate personality + limited liability; layer guarantees, torts, abuse, regulatory, intragroup | §3 para 7 | P |

### §4 Financing and Listing in Taiwan
| Original point | Rewrite | Status |
| --- | --- | --- |
| FAQ 3 lead: branch not independent issuer, cannot itself be listed | §4 para 3 | M |
| FAQ 3 lead: subsidiary must satisfy Company Act and stock-exchange requirements to list | §4 para 4, sentence 2 | M |
| FAQ 3 lead: tax incentives not determined solely by organizational form | §5 para 1, sentence 1 | M |
| FAQ 3 lead: Art. 10-1 credit requires separate review of qualifying investment, filing deadline, credit method, duplicate-benefit restrictions, tax credit limits | §5 para 1 ("tax credit limits" added to the check list), §5 paras 2–3 | M |
| Branch has no shares; cannot make third parties its shareholders; funding via head-office appropriation/support/lawful borrowing; inability to issue equity ≠ no financing; per-transaction items | §4 para 1 | P |
| Subsidiary: share issuance / capital increase; local partner; subsequent investors / preferred shares / equity compensation; exit via transfer, merger, demerger, reorganization, strategic investor; subject to Company Act, investment regulation, articles, shareholder agreements | §4 para 2 | P |
| Listing: branch not issuer, no shares, cannot be listed; head-office listing is a different question | §4 para 3 | P |
| Subsidiary not automatically eligible; eligible issuer + TWSE market standards; requirement list; industry rules, FDI restrictions, reorganization, shareholder composition | §4 para 4 | P |
| Map working capital and future funding/recovery; five "whether" questions; short-term vs long-term structure may differ | §4 para 5 | P |

### §5 Investment Tax Credits
| Original point | Rewrite | Status |
| --- | --- | --- |
| Incentives not determined by label; check list (eligibility … combination restrictions); credit ≠ taxable-income calculation; not full deduction from tax payable | §5 para 1 | P (+ "tax credit limits" from FAQ 3) |
| Art. 10-1 window Jan 1, 2025 – Dec 31, 2029; company or limited partnership; NT$1 million – NT$2 billion in same taxable year; statutory requirements and approval; own use; new and actually used | §5 para 2 | P |
| Qualifying fields (smart machinery, 5G, cybersecurity, AI, energy-saving/carbon-reduction hardware/software/technology/services); label ≠ automatic; document checks | §5 para 2 (merged) | P |
| Options: up to 5% in current year or up to 3% in each of three years; annual cap 30% of PSE income tax; aggregate ceiling / duplicate restrictions with other credits | §5 para 3 | P |
| "30%" ≠ 30% of R&D expenses refunded | §5 para 4, sentence 1 | M |
| R&D incentives under Art. 10 or other provisions; confusing Art. 10 with Art. 10-1 causes errors in expenditures, timing, limits; identify provision, authority, schedule, combinability | §5 para 4 | P |
| Branch/subsidiary eligibility per law and actual investment relationship; subsidiary ≠ assured; branch ≠ excluded; restructuring after contract/acquisition may miss deadline; review at planning stage | §5 para 5 | P |

### §6 Taiwan–Korea Agreement and PEs
| Original point | Rewrite | Status |
| --- | --- | --- |
| Signed Nov 17, 2021; in force Dec 27, 2023; applied since Jan 1, 2024 | §6 para 1 | P |
| Coordinates double taxation; no automatic exemption; five factors | §6 para 1 | P |
| 10% ceiling each for dividends, interest, royalties; resident + beneficial owner; residence certificate and Taiwan procedures; conduit company / PE-connected income need separate analysis | §6 para 2 | P |
| Business profits exempt without PE; taxable if attributable to PE; two-step (PE test, attribution) | §6 para 3 | P |
| Fixed-place PE; management/branch/office; period of use, right of disposal, functions; registered branch location "ordinarily" a fixed-place PE; branch profits cannot be presumed exempt | §6 para 4 | P |
| Construction PE > six months; service PE > 183 aggregate days in any twelve-month period; agency PE (repeated authority to conclude contracts) | §6 para 5 | P |
| Tests are independent (183 days or fewer ≠ no fixed place; ≤ six months ≠ no agency PE); factor list | §6 para 5 (merged) | P |
| Subsidiary ≠ PE by itself; examples (concluding contracts for parent; parent operating at subsidiary premises); registration vs treaty nexus assessed separately | §6 para 6 | P |
| Performance records (days, premises, decisions, negotiations, expense allocation, deliverables, funds); coordinate filing schedules; TP documentation | §6 para 7 | P |

### §7 Choosing a Structure / §8 Conversion and Exit Procedures
| Original point | Rewrite | Status |
| --- | --- | --- |
| Neither form superior; subsidiary suits …; branch suits …; "can be established" ≠ "efficient in operations, tax, exit" | §7 para 1 | P |
| 8-item comparison list | §7 list | P (identical) |
| Low initial revenue; consider future; four scenarios; scenario table reduces label bias | §7 para 3 | P |
| Professionals in both jurisdictions on same facts; materials list; periodic check after establishment | §7 para 4 (moved up from end of original §7) | M |
| Conversion possibility; consents, employment, licences, asset transfers, tax, FX; not just a name change; assignment clauses and IP licences up front | §8 para 1 | M |
| Art. 378 cancellation application; pre-application obligations do not disappear; wind-down sequence | §8 para 2 | P |
| Art. 379(1) authority cancellation; Art. 379(2) no effect on creditors' rights / foreign company's obligations; register disappearance ≠ end of liability; disputes, audit periods, record retention | §8 para 3 | P |
| Art. 380 liquidation when all branches canceled; unpaid debts remain foreign company's; liquidator appointment, creditor notices, filings, remaining funds per current procedures | §8 para 3 (merged) | P |
| Head office and branch same legal person on entry and exit | §8 para 4 (standalone) | P |
| Subsidiary follows dissolution/liquidation, not branch cancellation; resolutions, liquidator, claims/debts, tax filings, distribution; parent cannot disregard personality/creditors and recover funds; procedures not the same | §8 para 5 | P (last two sentences swapped) |

### Tail
| Original | Rewrite | Status |
| --- | --- | --- |
| Official Sources (12 links) | byte-identical | P |
| Related Services (3 links) | byte-identical | P |
| Disclaimer: educational material on general differences; not legal/tax advice; five variance factors; check official materials and facts before establishing/funding, contracting, dividend, remittance | same four points, first sentence split, last reordered | P |
| Signature "Wei Tseng (曾雋崴), Taiwan Attorney" | identical | P |

Nothing added: no new cases, numbers, hypotheticals, first-person material, promises or consultation lines. The "framing" sentences listed in notes.md item 7 carry no new facts; the count words ("two requirements", "the same two rates", "Two options", "two steps") are each accurate.

## Blocking issues

None.

## MONOTONY items

None blocking. Rule §5 self-check: (1) tool OK; (2) opening is a concrete-result opener, not a stock hypothetical; (3) very short sentences present ("Neither can.", "It does not.", "There is a cap.", "Losses in Taiwan do not change that."), long factor-list sentence in intro is followed by a short one; (4) paragraph openers max 2 per word (The 2, A 2, Business 2, Branch 2, Businesses 2); (5) no three consecutive claim-statute-caveat paragraphs, many uncited paragraphs; (6) contrast templates 0, no straw-man rebuttals beyond the original's own two ("30%" and "subsidiary safe / branch risky"); (7) last body paragraph ends on the subsidiary-dissolution fact; disclaimer tail is the original's structural notice, kept per instructions, no "contact us" line; (8) plain English, no bold, no imperative/checklist headings. Native read: rhythm varies, FAQ-copy leads are gone, "merely because"/"However" stacks are gone. Minor stylistic observation, not a defect: a few bridge sentences ("Branch profits stand on a different footing.", "The position of a branch differs.", "There is also the agency PE.") are slightly stagey but read as native legal-explainer prose.

## Tests verdict

PASS. tests.patch touches only src/lib/__tests__/columns-en-investment-004.test.ts. No .skip/.only/.todo. Changes: lastmod/date/readTime literals; H2 list 9 -> 10 with "8. Conversion and Exit Procedures"; FAQ-repeat test keeps FAQ 1 verbatim-first-after-H2 and exactly-twice, and replaces the FAQ 2/3 verbatim-lead assertions (structure intentionally removed by the rewrite) with section-scoped fact anchors that still lock 5%/20%, 21%, 10% ceiling, no branch dividend withholding, undistributed-earnings exemption, branch not an issuer / cannot list, Company Act + stock exchange requirement, "tax credit limits", duplicate-benefit restriction; every proposition literal re-anchored to the new wording of the same fact (Art. 1, 99(1), 99(2), 371, 372, 378, 379, 380, 66-9, 10, 10-1, 5%, 20%, 21%, 10%, 3%, 30%, NT$ bounds, dates, six months, 183 days); selection-section split at §8 with branchExitParagraph asserted in the exit section; disclaimer literal updated to the new wording with the same content; word count 5_544 -> 5_329 (I changed the rewriter's 5_328 to 5_329 after my one-word edit; verified with a Python port of countVisibleEnglishWords: 5,328 before the edit, matching the pipeline's vitest result, 5,329 after), read time 27. Pipeline run before my edit: 80 test files / 1096 tests passed. The edited sentence is not pinned by any other literal.

## Tiny edits applied

1. draft.md §2 para 5: "Not every payment between a branch and its head office receives the same treatment." -> "Not every payment between a branch and its head office necessarily receives the same treatment." Reason: the original hedged ("This does not mean that all payments … always receive the same treatment"); the rewrite had turned it into a flat assertion. Guard re-run: GUARD: PASS (length 5429 -> 5217). Variety re-run: OK.
2. tests.patch: expect(visibleWords).toBe(5_328) -> 5_329 to match edit 1 (read time unchanged at 27).

## Original issues (not blocking)

- §3 para 2 places the liability cap for shareholders of a company limited by shares under "the principle in Article 99 of the Company Act". Article 99 is the limited-company provision; the share-company rule sits elsewhere in the Act. The original hedges with "under the rules applicable to that company form"; the rewrite keeps the hedge and does not worsen it. Worth a citation check in a future content pass.
- The 21% dividend withholding rate is supported only by the sources list (Standards of Withholding Rates, Articles 3 and 4); the body never names that regulation. Carried over unchanged.
- Pre-existing lint items tolerated by the guard: no contact email, no source-check date, last H2 is "Related Services", "0800" inside the Company Act URL trips the phone pattern.
- The rewrite drops the house convention of repeating FAQ answers 2 and 3 verbatim as section leads (FAQ 1 is still repeated). The FAQ text in front matter is unchanged and each FAQ fact remains in its section; the tests now lock those facts by anchor rather than by verbatim paragraph. Flagged only so the site owner knows the mirror convention is no longer uniform for this column.
