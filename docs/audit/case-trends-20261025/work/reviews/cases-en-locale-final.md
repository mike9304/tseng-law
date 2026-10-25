# EN 914–917 independent locale review — final

Verdict: PASS for all four articles at the exact hashes below. Review date: 2026-10-25. One bounded repair pass completed; no unresolved material locale finding remains.

Reviewer: `/root/review_en_case_trends`, independent AI US-English editorial role. I did not author or modify the manuscripts. No human native-speaker or attorney review is claimed. This PASS is not publication or deployment evidence and does not replace the separate final legal review.

## Final reviewed versions

Paths are relative to `/Users/son7/tseng-case-trends-20261025/repo/`.

| Article path | Final SHA-256 | Verdict |
|---|---|---|
| `src/content/columns-en/914-taiwan-us-executive-share-bonus-payment-promise.md` | `b0380f58ffd45ccc1bc70bd9a5addbb483c074b26a5287bb82b0c5f7cfdf5f53` | PASS |
| `src/content/columns-en/915-taiwan-public-contract-mediation-arbitration-same-claim.md` | `dbc06e56df75f67e92e9fceef19ad1b7c3db4b9ff9396256d3d2d2e043d1966d` | PASS |
| `src/content/columns-en/916-taiwan-parent-company-pollution-liability-us-investor.md` | `167addba353f1b6c7cfa3f530bc6aeb34b3c1871b33043de35203e9920817cb1` | PASS |
| `src/content/columns-en/917-taiwan-film-license-corporate-party-us-declaration.md` | `a455cfaa66bc2b6f6f0da057d9360a0fe3868c22cccaa772274e4ad1c64753cc` | PASS |

## Repair verification

Compared each final file against the retained initial snapshot. Only the five requested locations changed. I reread the revised paragraphs, their neighboring paragraphs, the related FAQ/conclusions and the actual diffs.

| File:line | Final exact wording or repair | Verification and meaning |
|---|---|---|
| 914:30 | The paragraph now consists of the linked USTR investment-plan sentence. | Both self-referential sentences were removed. The January memorandum, February announcement and proposed investment remain. No legal condition or substantive claim was lost. |
| 915:45 | “The court identified the absence of an arbitration agreement under [Arbitration Act Article 40(1)(2)](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=I0020001) as the ground for annulment.” | The incomplete general enumeration has been replaced by the particular ground the official explanation identifies. This is the explicitly logged substantive accuracy correction. The final legal reviewer was notified and agreed with this direction. The current statute and source explanation support the narrowed sentence. |
| 916:54 | The paragraph now states the two sides' investment intentions and possible financing support “subject to applicable law.” | The editorial relevance claim and unprompted claim-growth rebuttal are gone. The source fact, legal qualification and subsequent specific transfer-review discussion remain. |
| 917:40 | “Later availability through a different affiliate's platform did not prove that the offshore company had acquired the rights earlier.” | The offshore licensee is now explicit. This preserves the case's corporate-identity distinction without turning platform evidence into a broad infringement holding. |
| 917:54 | “The Taiwan Creative Content Agency announced…” | Correct official name. The announcement date, planned November 6–9 event and bounded US-reader relevance are unchanged. |

## Whole-article review retained

The complete R1 record is `cases-en-locale-r1.md`. It includes the first-two-paragraph sentence deletion test for every article, concrete comparison with EN704, EN705 and EN706 (all published 2026-10-24), critical legal boundaries, source-access limitations, metadata and image review. The five repairs do not affect the tested opening paragraphs, comparator findings or the article-specific substantive endings.

The four articles use natural US business vocabulary with distinct reader decisions: assessing a provable stock-compensation claim; matching the concrete claim to procurement mediation; evaluating group conduct after environmental diligence; and tracing licensing rights to a named legal entity. The case analysis remains central. No universal common-law precedent, overseas licensure, case representation, lawyer authorship or fabricated client facts are asserted.

Critical boundaries remain intact: 914 direct debtor versus compensable loss and contractual exit conditions; 915 the same concrete dispute and conditional statutory route; 916 the 246/262 split and cumulative conduct rather than ownership alone; 917 a loan/setoff action, corporate identity, judicial admission and the evidentiary use of a US declaration. The 914 and 917 finality limits remain explicit. Illustrative images are not presented as case photographs.

## Repeated actual checks on final files

The exact command run for every final file was:

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute article path> --lang en`

| ID | Sentences | CV | Short ratio | Same-length run ratio | Contrast count | Result |
|---|---:|---:|---:|---:|---:|---|
| 914 | 46 | 0.499 | 0.217 | 0.000 | 0 | exit 0, FAIL 0 |
| 915 | 39 | 0.480 | 0.179 | 0.027 | 0 | exit 0, FAIL 0 |
| 916 | 41 | 0.481 | 0.146 | 0.051 | 0 | exit 0, FAIL 0 |
| 917 | 47 | 0.461 | 0.234 | 0.044 | 1 | exit 0, FAIL 0 |

Final logs, exact snapshots, original-to-final diffs, metadata counts and image hashes are in `cases-en-locale-evidence/`. `final-checks.json` binds the above results to the final manuscript hashes. Summaries remain 155, 159, 156 and 158 characters; required separate SEO titles remain 35, 34, 37 and 32 characters. No title/summary, legal number, date, source URL, FAQ or image metadata was silently altered during repair.

Section 5 checks remain satisfied: four distinct opening approaches, at least two short sentences per article, no stock hypothetical, no repetitive claim/citation/caveat loop, valid use of noncitation practical paragraphs, bounded contrasts, case-specific endings, no bold markup and no invented first-person experience. Exact internal column destinations exist in this checkout. FAQ answers agree with the body.

All four actual WebP files were visually inspected and their unchanged SHA-256 values rechecked. The images match the local alt text and retain “Fictional scene.” They contain no real case-party identity, recognizable private face, flag, logo or readable fabricated legal text. This is image-content inspection, not rendered-page or browser interaction QA.

## Evidence limits and next step

Current MOJ provisions and USTR/ITA/TAICCA statements were reopened successfully during this review. Two official court explanation pages timed out on my repeat request; the official full explanation text retrieved earlier in this same run was retained and read. For 914/917, the review used the captured official judgment reasons and disposition; it does not establish a later appellate outcome. Underlying evidentiary files and the underlying US court file were not independently examined.

No outstanding locale repair remains. Send these exact hashes and this report to the independent final legal reviewer and retain their final verdict against the same versions. Root owns integration, deployment and public readback. Any subsequent manuscript change requires a check of its affected text and an updated hash binding.
