# C1 final review — round 4

Verdict: FIX. One mandatory inline-source repair remains in the Traditional Chinese version. Its temporary-stoppage rule is accurate, but the only official link in that paragraph is to a provision that does not contain that rule. The other three versions have the correct BLI link in the corresponding paragraph. No substantive legal error, numerical error or cross-language legal contradiction was established. Image: OK. Minor wording edits were applied to KO and EN only; all four final lint runs are OK and all four variety runs have zero FAIL lines.

Reviewed on 2026-10-14, Asia/Seoul. Slug: `taiwan-unpaid-wages-insolvent-employer-payment-fund`. The current request expressly commissions this fourth review. This log does not authorize publication while the remaining hard-rule defect is open.

## Scope checked

Read in full: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C1.md`, all four publication files in `drafts/C1/`, `drafts/C1/facts.md`, and `research/C1-statutes.md`. Reviewed frontmatter, titles, summaries, all FAQs, body paragraphs, tables, sources, dates and internal links. The writer's fact sheet was not treated as authority.

Read `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md` in full, including sections 5–6, and the recurring mistakes in `LESSONS.md`. Also read `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, the shared rules-bundle editorial text, and `/Users/son7/Projects/tseng-law-columns-20261014/docs/columns/EDITORIAL-VOICE.md`. The canonical `~/agent-library/knowledge/editorial-voice.md` path is absent on this machine; the supplied complete editorial brief and repository copy were used instead. Applied Codex's current final-review authority and the verification-before-completion workflow; no Fable approval was required.

No judgment is cited and no judgment text was present in `research/judgments/`. No Korean, Japanese or US legal rule is asserted. Read `topics/LINKS.md`; the fresh lint checked the actual same-language repository files for every internal link. Compared the available C1–C6 opening paragraphs and the openings, headings and endings of the three preceding local publication files, 524, 523 and 522, in each language. The other columns received an opening comparison only, not a legal review. Read the round-3 review and fix-4 notes after independently reading the current texts and checking the primary sources.

Directly viewed `images/C1.webp` with the image tool and checked the supplied scene description in `images/DONE.txt`. This is a review of the supplied publication artifacts, not a deployed-page verification.

## Official-source verification

Independently opened all 15 distinct external URLs cited by these drafts using `curl -L --fail`; every request returned HTTP 200. Saved HTML, extracted text, source manifest, initial and final checks, minor-edit diffs and reviewed hashes are in `source-check-astra-r4/`. Also opened Article 28 and both BLI pages through the web tool. The substantive BLI guidance was read in full, rather than relying on the page title or search snippet.

| Evidence files | Source and result |
|---|---|
| `02`, `05`, `06` | [Labor Standards Act full text](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0030001), [Article 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=2), [Article 28](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=28). Research-file quotations match the retrieved articles. Law-level amendment date: 2024-07-31. |
| `00`, `03`, `07` | [Enforcement Rules full text](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0030002), [Article 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030002&flno=2), [English text](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0030002). Excluded dates/periods and their wages checked against the Chinese and English texts. Amendment date: 2024-03-27. |
| `01`, `04`, `08`–`12` | Fund [full text](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0030005), [English text](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0030005), and individual Articles [2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=2), [7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=7), [8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=8), [9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=9), [10](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=10). Agency, contributions, documentary proof, evidential fallback and joint application verified. Official English instrument name and amendment date 2015-05-20 match. |
| `13`, `13-main.txt` | [BLI application guidance](https://www.bli.gov.tw/0007239.html), substantive sections I–V. Eligibility, pre-event wage window, foreign workers, mandate-role exclusions and all described debt-proof alternatives verified. Displayed update: 2023-12-19. |
| `14` | [BLI FAQ 7](https://www.bli.gov.tw/0015125.html). The actual page body is the cited application/document question, notwithstanding its misleading HTML title. The URL and displayed update, 2023-11-28, are correct. |

## Remaining mandatory issue

### C1 — ZH inline citation missing for the temporary-stoppage exclusion

Original — `drafts/C1/zh-hant.md:52`:

> 「[提繳及墊償管理辦法第7條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=7)和同一則勞保局說明都這樣寫。事業單位只是停工、還有復工可能的，說明還不把它當成墊償事由。」

→ Problem & reason: The paragraph's linked Article 7 establishes prior contributions or later payment of contribution arrears. It does not state the temporary-stoppage/resumption exclusion. That additional legal condition comes from section I(1) of the BLI application guidance. The words 「同一則勞保局說明」 are unlinked here. BLI links in the earlier wage-window paragraph, the following worker-status paragraph and the bibliography do not meet the batch's claim-level inline-link requirement for this separate eligibility claim. This is a mandatory citation defect under batch hard rule 2 and review item 2, not a finding that the exclusion itself is false.

→ Fix required, not applied: Link the existing words 「同一則勞保局說明」 in this paragraph to `https://www.bli.gov.tw/0007239.html`, or attach that link immediately after the temporary-stoppage sentence. For the smallest repair, retain the entire existing paragraph and change only the plain-text source label to `[同一則勞保局說明](https://www.bli.gov.tw/0007239.html)`. Keep the Article 7 link for the contribution rule. This adds no visible characters to the body, which is currently at its 2,700-character ceiling. Re-run ZH lint and variety checks after the citation repair.

→ Facts preserved: Retain both contribution alternatives and both elements of the exclusion: a mere temporary stoppage and a remaining prospect of resumption. Do not change the three statutory trigger alternatives or the six-month limits. No citation was edited by this reviewer, in accordance with the explicit restriction on reviewer edits.

The corresponding KO, JA and EN paragraphs already link both Article 7 and the correct BLI guidance. The claim groups specifically identified in round 3 now have their requested Article 2 or Article 28 links; those earlier defects are closed.

## Minor edits applied

All changes below are wording/grammar repairs. Existing citation labels and destinations, Arabic-numeral sequences and hypothetical labels were preserved. The complete diffs are saved as `source-check-astra-r4/ko-minor.diff` and `en-minor.diff`.

| Original | Problem & reason | Fix applied | Facts preserved |
|---|---|---|---|
| KO: 「사용자가 행방이 불명이거나」 | Unnatural duplicated subject marking. | 「사용자가 행방불명이거나」 | The employer cannot be located; the alternative refusal to sign and all documentary requirements remain. |
| EN FAQ 2: “or a later makeup” | “Makeup” is an awkward, ambiguous noun for payment of contribution arrears. | “or later payment of missed contributions” | Later payment remains an alternative to contributions already made. |
| EN: “Average wage starts in” | An average wage does not idiomatically “start in” a statutory item. | “Average wage is defined in” | The same linked Article 2, item 4, defines average wage; the citation itself is unchanged. |
| EN: “Total wages in the six months before the day the calculation event occurs, divided by the total number of days in that period.” | Standalone sentence fragment. | Added “It is the” before “total wages”. | The six-month reference period, event date, numerator and total-day denominator are unchanged. |
| EN: “The floor belongs only to pay set that way.” | Unnatural verb for the scope of a legal floor. | “This floor applies only to those pay methods.” | The immediately preceding day/hour/piece-rate limitation and 60% calculation remain unchanged. |
| EN: “Retirement pay and severance together stop at six months of average wage.” | “Stop at” is awkward in the closing recap of the advance cap. | “The combined advance for retirement pay and severance is capped at six months of average wage.” | The existing combined advance cap is preserved; the edit does not cap paragraph-1 priority or either underlying debt. |

Ran the prescribed lint immediately after editing each affected file. Then re-ran both prescribed checks on all four final files. No changes were made to JA, ZH, `facts.md`, the image, or publication metadata. The new EN FAQ wording does not affect the SEO summary's character count.

## Supporting record issue — not a separate false publication claim

Original — `facts.md`, “Deliberately left out”, says filing venue, joint filing, employer signatures/court papers, contribution eligibility and the BLI look-back are omitted; it also retains an obsolete branch/head-office assertion.

→ Problem & reason: The current drafts contain the procedural material and the Enforcement Rules qualification. This supporting inventory is stale and cannot serve as a record of the final claims. Its obsolete descriptions were not used to clear the articles.

→ Fix required for the supporting record, not applied: Reconcile the fact sheet with the final publication files and their official sources. Remove obsolete omission claims and the unused branch assertion; record the finality certificates, application/complaint copies, alternative proof routes and average-wage exclusions now discussed.

→ Facts preserved: Keep the accurate statutory quotations and distinguish actual claims from deliberately omitted topics. This administrative correction is not an additional substantive publication defect. The reviewer's minor-edit authorization does not cover the fact sheet.

## Law, citations and rules checked for each language

| Check | KO / JA / EN / ZH result |
|---|---|
| Trigger and covered employment | All retain closure, liquidation or adjudicated bankruptcy as alternatives; late pay alone and a temporary stoppage with possible resumption are distinguished. The examples assume employment covered by the Act. Foreign nationality and contractor labels do not replace the worker/employment test. |
| Employer and group company | All reproduce the Article 2 employer roles and keep the hypothetical Taiwan company as employer. The subsidiary FAQ does not impose liability on a shareholder parent merely because it owns shares. No branch-liability claim from the stale fact sheet is published. |
| Priority | All give the specified claims equal initial rank with the named secured claims, proportional distribution, and the most preferential right for the unpaid portion. None promises full recovery or puts the workers ahead of every secured claim at the outset. |
| Eligible claims and limits | All preserve contractual wages under six months, Labor Standards Act retirement pay, and severance under that Act or the Labor Pension Act. The combined retirement/severance advance cap is six months of average wage; it is not imposed on paragraph-1 priority. The BLI pre-event wage window remains distinct. |
| Arithmetic | KO's expressly hypothetical claims of 1 and 3 divide a pool of 2 in shares of one-quarter and three-quarters: 0.5 and 1.5. The text gives the shares, not incorrect payment amounts. No other numerical example requires arithmetic. |
| Wage definitions | All retain work remuneration and regular payments, the normal six-month/total-day formula, shorter-service rule, excluded periods and their wages, and the limited day/hour/piece-rate 60% floor. Insured salary is not substituted into the average-wage formula. Regulation Article 9's discretionary evidential fallback is treated separately. |
| Advance procedure | All retain an unpaid demand, contributions or later payment of arrears, closure/debt proof, additional lodging proof in liquidation/bankruptcy, the described alternative court-document routes, BLI filing and joint application as the general rule. Both the payment-order and judgment routes require their finality certificate and application/complaint copy. |
| Repayment and rate | All state that the employer must reimburse the fund. The 15-per-10,000 statutory ceiling is identified as a ceiling, with the 2026-10-14 reference date; it is not passed off as the current collected rate. No processing or repayment day-count is invented. |
| Dates and sources | All three law-level amendment dates and both BLI update dates match the live pages. No amendment date is mislabelled as an effective date. Each language's sources section includes every external URL used in its body and the required 2026-10-14 check date. Statute URLs target the correct articles. Remaining inline-placement exception: ZH C1 above. |
| Frontmatter and links | Exact required keys, correct labor topic/category/audience, dates, H1/title identity, three FAQs, `author: "legal-ai-assistant"`, and literal `NNN` image path verified. EN title is 72 characters, so its 32-character SEO title is required; its summary is 157 characters with no forbidden characters. Two valid same-language internal links per version; no link to this batch. |
| Prohibitions and disclosure | No private-party names, bold, phone/hotline numbers, office street address, messaging IDs, attorney byline, lawyer/native-review claim, invented professional experience or foreign-law assertion. Each has one short firm/email contact paragraph. Every hypothetical is explicitly labelled. |

The substantive legal core is consistent across all four languages. Abstract definitions are dense but do not introduce different entitlements in different versions. The current wording does not require a broader substantive rewrite.

## Voice and sentence variety

Titles identify the actual insolvency/wage-fund issue without a command, numbered checklist or clickbait. First paragraphs convey a trigger, a concrete payment question, the legal priority, or the labelled payroll situation. KO uses 합니다체 and JA uses です・ます; title noun phrases and statutory terms are not register changes. EN uses plain explanatory prose after the minor repairs above. ZH uses Taiwan terms and traditional characters. No native-human or lawyer-review certification is implied by this model review.

The final exact commands were run for every language:

`python3 /Users/son7/tseng-col-1014-work/lint.py /Users/son7/tseng-col-1014-work/drafts/C1/<lang>.md <lang> taiwan-unpaid-wages-insolvent-employer-payment-fund`

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1014-work/drafts/C1/<lang>.md`

| Language | Lint | Body length | Sentences | CV | Very short sentences | Short share | Similar-length run3 | FAIL lines |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| ko | OK | 3,499 characters | 103 | 0.508 | 14 | 0.136 | 0.069 | 0 |
| ja | OK | 3,901 characters | 105 | 0.455 | 13 | 0.124 | 0.078 | 0 |
| en | OK | 1,557 words | 101 | 0.520 | 22 | 0.218 | 0.071 | 0 |
| zh-hant | OK | 2,700 characters | 93 | 0.570 | 14 | 0.151 | 0.033 | 0 |

Every command exited 0. KO and JA each have a 98% register-ending WARN, not a FAIL. Those warnings do not justify mixing registers. EN and ZH report no variety limit violated.

Manual application of sections 5–6:

1. No C1 first sentence uses a stock hypothetical opener. C1's trigger list, reader question, linked statutory proposition and payroll scene are differentiated from the other available same-language openings. Broad factual introductions elsewhere in the batch were not treated as identical merely because they state facts. The payroll scene remains explicitly fictional.
2. Every language has more than two very short sentences. No prose paragraph has more than one long sentence under the checker's language thresholds, and no pair of consecutive long sentences was found.
3. Paragraph-opening words were read vertically: maximum repetition is two in each language. The minor edits did not introduce a third occurrence.
4. No three consecutive claim–statute–caveat paragraphs. Each version has a legitimate citation-free hypothetical paragraph. The missing ZH legal citation is not counted as a stylistic advantage.
5. The checker reports zero contrast templates. The substantive distinctions concern actual issues in the topic brief: priority versus advance, contractual wages versus the combined cap, and the insurance base versus average wage. No separate excess-template or unprompted-rebuttal failure was established.
6. Closings return to the particular hypothetical, demand, proof and wage/cap facts. They do not end in a copied generic disclaimer or a sales line. The firm/email paragraph precedes the factual closing.
7. KO/JA register, no-bold rules and hypothetical labels hold. KO and ZH have no body question mark; questions are optional, their direct explanatory openings and FAQs supply the relevant reader issues, and this is not a failed mandatory item.
8. All existing links and their labels were compared before/after minor edits and match exactly. Arabic-number sequences match; written-number limits and conditions were also checked in the diffs. No fact, condition, amount, citation or fictional label was dropped.

The automatic FAIL threshold and the two-unmet-self-check threshold are not met. There is no MONOTONY failure to report. The FIX verdict rests on the remaining mandatory inline-source placement.

First-two-paragraph deletion test: KO's opening establishes the three triggers and the operating-business limitation; its second paragraph adds the unpaid-payday scene, demand, employer and coverage assumption. JA's opening poses the full-payment question and states the trigger/non-guarantee; the next paragraph supplies the labelled liquidation scene. EN's opening identifies priority, the wage-period limit and the operating-business limitation; its scenario establishes the contract, demand and coverage. ZH's first paragraph supplies the five-month payroll scenario and hypothetical/coverage labels, and its second adds the statutory trigger and limitation. Removing those informational sentences would lose a fact, scope condition or scenario element. The fiction markers and coverage assumptions were therefore retained.

Compared with local publication files 524, 523 and 522, C1's closing returns to wage-fund evidence and limits instead of copying their contact/date endings. No copied series template requiring rejection was established. The absence of body subheadings, by itself, was not treated as a forbidden heading or an invented mandatory section count.

## Image verdict

OK — viewed directly. The empty tailoring workshop, idle sewing machine, folded plain fabric and empty chairs fit an employer-closure column. The supplied fictional scene is generic, unidentifiable and respectful. There are no people/faces, flags, readable documents, legible text or identifiable logos. The faint wall grid is unreadable; the small circular machine detail is not an identifiable brand mark.

## Reviewed artifact hashes

| File | SHA-256 after minor edits |
|---|---|
| `drafts/C1/ko.md` | `acb02d4f93f4c4df19cf596d296e6cf00ee674cdc3d8e17225fb7d5964b70f9f` |
| `drafts/C1/ja.md` | `f570d6d4462b361f1063457ed5f0e83652c5c34ca91e5d913cadd227aceecb37` |
| `drafts/C1/en.md` | `c82bbec7bb057473e83d4f09637ab82833f07c5cefa9f148d708af1c711a694b` |
| `drafts/C1/zh-hant.md` | `394593152acb559f0fd86f4a3cde2aaf087bce7b1cb1541517cf63cf95fd4d06` |
| `images/C1.webp` | `797ef5319e02226059265ccc46b9c4e1ad1b3ef13e72200653a1d1e24513b5d6` |

VERDICT: FIX
