# Final review r1 — en-048-taiwan-stocks-direct-investment-tax (reviewer: Claude Fable 5.1, 2026-10-12)

## Verdict

PASS. One tiny edit applied (qualifier restored in the dividend paragraph); guard re-run and still PASS; variety check OK.

## Scope checked

- orig.md vs draft.md, every paragraph, claim by claim (table below).
- guard.txt and a fresh guard run after my edit: GUARD: PASS both times (length 1254 -> 1250, 100%; monotony 22.8 -> 4.0).
- `variety_metrics.py check draft.md --lang en`: OK, no limit violated (sentences=70, cv=0.48, short=0.186, run3=0.015, cite_end=0.0, contrast=0, q=2).
- Front matter diff: only `lastmod` 2026-09-30 -> 2026-10-12. H1 identical. featured_image, summary, seoTitle, faq, read_time unchanged. Sources list and "Checked: September 30, 2026" byte-identical.
- Bold / `__` / `<strong>` / emoji / "This means" / "It is important to note" / "In conclusion" / "Suppose": none.
- tests.patch (non-empty) read and checked against the worktree test file.
- SENTENCE-VARIETY-RULE sections 2, 5, 6; COLUMN-VOICE-RULE; LESSONS skimmed.
- Web check of H.R. 33 status (standard search): no 2026 Senate action or enactment found; see "Original issues".

## Claim-by-claim fact table

Format: original point -> where in rewrite -> status.

### Intro
1. US investor buying TSMC on the Taiwan exchange or 0050 ETF through a direct-access account faces Taiwan tax on a sale or dividend -> draft P1 -> preserved.
2. US tax and reporting may still apply to the same holding -> P1 -> preserved. ("That is one system." added: rhetorical link to the title, no factual content.)
3. For a US person not a Taiwan income-tax resident, directly held Taiwan-listed securities can have a different legal/tax structure from a US-listed receipt or US-domiciled fund -> P2 -> preserved ("can differ in legal and tax structure").
4. Taiwan residency, type of security, legal owner named on the account can all affect treatment -> P2 -> preserved verbatim.
5. Residency-guide cross-link (/en/columns/taiwan-income-tax-residency) -> P2, now introduced by a reader question -> preserved; "separate" dropped (non-legal word).

### Opening a Taiwan brokerage account
6. Article 10 of the Regulations Governing Investment in Securities by Overseas Chinese and Foreign Nationals requires foreign nationals to register with TWSE under its rules before investing, with limited exceptions under that article -> P1 sentences 1-2 -> preserved; link kept; "must register" = "requires"; exceptions kept and still attached to Article 10.
7. TWSE overview: foreign investor obtains an investor ID before opening a local brokerage trading account -> P1 sentence 3 -> preserved verbatim.
8. Onshore (foreign individual in Taiwan): securities broker submits the registration, then opens the account (TWSE onshore page) -> P2 sentence 1 -> preserved.
9. Offshore (outside Taiwan): investor uses a domestic agent or representative and registers before the brokerage account is opened (TWSE offshore page) -> P2 sentences 2-3 -> preserved ("Registration still comes before the brokerage account opens.").
10. Broker can clarify route, registered investor, cash and custody -> P3 -> preserved verbatim.
11. Foreign-app access does not necessarily provide a Taiwan brokerage account or the same record of beneficial ownership -> P3 -> preserved verbatim.
12. Retain registration, account agreement, transaction statements; they help identify who receives dividends and who may claim shares in an estate -> P3 -> preserved ("Keep ... They help identify ...").

### Taiwan taxes the sale price
13. Securities Transaction Tax Act imposes tax on the seller's transaction price, separate from income tax on any gain -> P1 -> preserved (two sentences).
14. Ordinary rate on stock sales 0.3% of the sale price (MOF rate guidance + stock FAQ) -> P1 -> preserved, both links kept.
15. Qualifying investment-trust beneficiary certificates 0.1% (MOF beneficiary-certificate FAQ) -> P2 -> preserved.
16. For a Taiwan-listed ETF such as 0050, 0.1% applies only if it falls within the qualifying category and no special transaction rule changes the treatment -> P2 -> preserved, both conditions intact.
17. Tax borne by the seller; MOF collection page -> P2 -> preserved (two sentences).
18. Income Tax Act Article 4-1 suspends income tax on securities transaction gains and bars deducting those losses from taxable income -> P3 -> preserved; link kept.
19. This is a Taiwan income-tax rule; a US person may still owe US capital-gains tax -> P3 -> preserved.
20. Keep purchase/sale confirmations, fee details, currency-conversion records for the US tax calculation -> P3 "For that calculation, keep ..." -> preserved (antecedent is the US capital-gains sentence immediately before).
21. Special instrument / nonstandard structure requires its own classification; ordinary-sale treatment may not apply -> P3 -> preserved verbatim.

### Dividend withholding and the treaty question
22. Withholding Rates Standards Article 3(1): 21% of the amount paid on company dividends to a nonresident individual -> P1 -> preserved; link kept.
23. That is the domestic rate on an ordinary dividend from a Taiwan company to a nonresident individual -> P1 sentence 2 -> preserved after my edit (the rewrite had dropped "to a nonresident individual" from the appositive; restored, see "Tiny edits").
24. ETF distribution may contain different components or differ from a company dividend in who pays it and how it is reported -> P2 -> preserved.
25. Distribution and withholding statement helps distinguish those components; a cash payment is not necessarily a company dividend -> P2 ("Not every cash payment is a company dividend." now opens the paragraph) -> preserved.
26. If the investor is a Taiwan tax resident, the nonresident rule is the wrong starting point -> own paragraph P3 -> preserved verbatim.
27. IRS treaty list does not include Taiwan -> P4 -> preserved; link kept.
28. Taiwan MOF treaty list shows no comprehensive income tax agreement with the US; US appears only under a 1988 shipping and air-transport agreement -> P4 -> preserved ("likewise" dropped).
29. As of September 30, 2026, no US–Taiwan income tax treaty in force reduces this withholding for a US resident -> P4 now leads with this -> preserved, date intact.
30. H.R. 33, United States–Taiwan Expedited Double-Tax Relief Act, passed the House January 15, 2025, referred to Senate Finance Committee -> P5 -> preserved.
31. As of September 30, 2026 not law (Congress.gov all-actions link) -> P5 -> preserved, date and link intact.
32. House-engrossed text (GovInfo) remains a bill, not an enacted treaty or tax rate -> P5 -> preserved.
33. Hoped-for future rate is no basis for planning; rate on ordinary company dividends still 21% -> P5 -> preserved.

### US tax and reporting
34. Form 1116 instructions: eligible foreign income tax paid or accrued on foreign-source income may support a foreign tax credit, subject to limitations, categories, holding-period rules and documentation -> P1 -> preserved (attribution moved mid-sentence; all four qualifiers kept).
35. IRS FTC page explains the general process; does not say every Taiwan withholding becomes a dollar-for-dollar credit -> P1 -> preserved.
36. Taiwan withholding certificate and payment details document the tax paid -> P1 (moved from orig P2) -> preserved.
37. US adviser determines creditability, source and category, Form 1116 or exception -> P1 -> preserved verbatim.
38. Taiwan's transaction tax is not automatically an income tax eligible for the credit -> own paragraph P2 -> preserved verbatim.
39. Before buying a Taiwan fund, advice on PFIC rules needed -> P3 -> preserved verbatim.
40. IRC section 1297 (as summarized in Form 8621 instructions): PFIC if at least 75% of gross income passive OR at least 50% of average assets produce / held to produce passive income -> P3 (split into two sentences) -> preserved; "or" intact; both percentages intact; section 1297 still attached to the definition.
41. Form 8621 page describes reporting by certain US shareholders -> P3 -> preserved verbatim.
42. 0050 PFIC status depends on the fund's legal and US tax classification and the year at issue -> P4 ("Is 0050 a PFIC? That depends on ...") -> preserved.
43. US adviser review: specific holding, possible Form 8621 filing, elections, before purchase or distribution creates a difficult reporting history -> P4 -> preserved verbatim.
44. Direct TSMC shares and a Taiwan fund can be taxed differently in the US -> P4 -> preserved verbatim.
45. Shares in a Taiwan financial account can bring a further US reporting obligation -> P5 -> preserved.
46. Per IRS, certain foreign brokerage/bank accounts can trigger FBAR (FinCEN Form 114) when aggregate value exceeds the applicable threshold -> P5 -> preserved; link kept.
47. Form 8938 separately concerns specified foreign financial assets above applicable thresholds -> P5 -> preserved verbatim.
48. IRS comparison: distinct regimes; which applies depends on account structure, assets, filing status and residence -> P5 (merged into one sentence) -> preserved.
49. Both sets of rules can be reviewed with a US adviser -> P5 -> preserved.

### Taiwan shares after the owner dies
50. Estate and Gift Tax Act Article 9(8): shares located where the issuing company or the business in which the investment is held has its head office -> P1 sentence 2 -> preserved; link kept.
51. Shares of a Taiwan-headquartered company can be Taiwan-situs estate property even if investor and heirs lived elsewhere -> P1 sentence 1 (result first; "therefore" dropped, inference still clear from adjacency) -> preserved.
52. Nationality/residence rules and filing/transfer documents covered in /en/columns/taiwan-estate-tax-foreign-decedent -> P2 -> preserved, link intact.
53. For a Taiwan-listed ETF, applying the location rule requires review of legal form and issuer -> moved to end of P1 -> preserved verbatim.

### Closing (heading "Help from the Taipei office" -> "Two systems, two advisers")
54. Firm's role: the Taiwan account and who holds it; nature of the Taiwan security and its distributions; which Taiwan tax or succession documents need local handling -> P1 "Hovering International Law Firm's part is the Taiwan side: the account and who holds it, ..." -> preserved (same three items; "can help sort out" sales phrasing removed, which the variety rule asks for).
55. US return and PFIC/foreign-account reporting call for coordination with a US tax adviser -> P1 -> preserved verbatim.
56. Contact: initial consultation with Attorney Wei Tseng (曾雋崴), email wei@hoveringlaw.com.tw, with residence and citizenship, security names and codes, account agreement, trade confirmations, dividend statements -> P2 -> preserved verbatim; order swapped with the address sentence.
57. Office address 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City 103 (103 臺北市大同區承德路一段35號7樓之2) -> P2 -> preserved verbatim.
58. Official sources list (6 bullets, all links) and "Checked: September 30, 2026" -> identical.

Nothing added: no new facts, examples, cases, numbers, first-person stories, promises or sales lines. The only new sentence is "That is one system." (no content).

## Blocking issues

None.

## MONOTONY

Tool: OK. Section 5 self-check re-verified by reading:
2. Opening is a concrete fact, not a "Suppose" formula. OK.
3. Very short sentences present ("That is one system." "The seller bears the tax." "Is 0050 a PFIC?"). No two long sentences back to back. OK.
4. Paragraph starters read vertically: "Before" x2, "Taiwan" x2, "The" x2; nothing 3 times. OK.
5. No three consecutive claim->caveat paragraphs; citation-free paragraphs exist (broker paragraph, resident one-liner, 0050 question paragraph). OK.
6. Contrast templates: the only "not X" sentences are all carried over from the original (bill not treaty; not every cash payment; not automatically an income tax; wrong starting point); none added, none rebut a claim the reader did not make. OK.
7. Last paragraph ends on the documents to send for this column; no copied disclaimer; no "our firm can help". OK.
8. Plain English, no bold, no invented first person, no checklist/imperative headings. OK.
Unmet items: 0. Reads as edited English prose, not machine output: rhythm varies, two genuine reader questions, attributions moved around rather than every sentence opening with a source.

Minor, non-blocking style note: dividend P2 second sentence ("An ETF distribution may contain different components, or differ ..., and the distribution and withholding statement helps ...") is a 30-word "or ... and" chain. Grammatical and accurate; left as is to avoid restructuring.

## Padding check

1254 -> 1250 words (guard count). Cuts were connectives only ("separate", "likewise", "therefore", "Separately", "can help sort out"). No legal point removed.

## Tests verdict

PASS. tests.patch touches only `src/lib/__tests__/expertise-columns-20260930.test.ts`: adds `'en/048': '2026-10-12'` to `FACT_FIX_LASTMOD` and names en/048 in the comment above it. That map's only use is `expect(data.lastmod).toBe(FACT_FIX_LASTMOD[...] ?? '2026-09-30')`, so the patch re-anchors exactly the lastmod this rewrite changed. No assertion removed, no `.skip`/`.only`, no other column's expectation touched. No test pins the old H2 "Help from the Taipei office" (grep of the worktree tests: no match). tests.txt records vitest 75/75 passing after the patch.

## Tiny edits applied

1. Dividend P1: "sets that figure, the domestic rate on an ordinary dividend from a Taiwan company." -> "... from a Taiwan company to a nonresident individual." Restores the original's qualifier on the appositive so the 21% is not read as a general domestic dividend rate. Guard re-run after the edit: GUARD: PASS (length 1254 -> 1250). Variety check: OK.

## Original issues (not blocking)

1. The two "As of September 30, 2026" statements and "Checked: September 30, 2026" now sit under lastmod 2026-10-12. A standard web search on 2026-10-12 found no Senate action on or enactment of H.R. 33 after its January 2025 House passage, so the text is not known to be wrong, but the check date was not advanced. Consistent with the original; the rewrite did not change it.
2. "Article 9(8)" and "Article 3(1)" shorthand (paragraph/subparagraph not spelled out) and the street address in the contact line are carried over from the original; lint flags the address as a pre-existing house-format tolerance.
