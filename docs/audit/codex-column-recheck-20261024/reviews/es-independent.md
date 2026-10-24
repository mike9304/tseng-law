# Spanish ARC revision — independent review

Current verdict: PASS after bounded repair round 2 on 2026-10-24. The current exact hashes and independent rerun evidence are in the final section below. No unresolved material Spanish locale issue remains. Historical round 1 findings are retained to show what was corrected.

## Historical round 1

Round 1 verdict: REQUEST_CHANGES. Review date: 2026-10-24. Reviewer: independent AI Spanish editorial reviewer, `/root/review_rev2_es`. I did not author or edit these articles. This is not human native-speaker certification, lawyer review, publication authorization or a claim that the revision is live. Ownership is this report only; all other agents’ files were preserved.

704 passes this locale review. 705 needs one substantive scope correction and a small wording repair. 706 needs removal of one redundant caution. The revision substantially improves the originals; it should not be rewritten wholesale. All three pass the actual variety CLI, which does not dispose of the findings below.

## Round 1 exact reviewed manuscripts (historical)

Paths are relative to `/Users/son7/tseng-arc-revision-20261024/repo`.

| File | SHA-256 | Result |
| --- | --- | --- |
| `src/content/columns-es/704-taiwan-arc-first-application.md` | `382098736775a3abe8e19ddc4c4dacd99de8c449e4343fe5ecf35e00c55f85d9` | PASS |
| `src/content/columns-es/705-taiwan-visa-residence-work-study-family.md` | `d36d3e21cb60083529d84741d804372b55d8449b6476c28c645c4b3f7acf260f` | REQUEST_CHANGES |
| `src/content/columns-es/706-taiwan-arc-renewal-changes-reentry.md` | `5001e5d64cdb079708ffda236326690181f83bcaf210ab3eb6d23647d54157d3` | REQUEST_CHANGES — one bounded editorial deletion |

Read in full: INDEPENDENT-REVIEW.md, REVISION-BRIEF.md, repo AGENTS.md, EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, SENTENCE-VARIETY-RULE.md, LESSONS.md, tseng-law-editorial SKILL.md/review-criteria.md, the author report, source-refresh.md, the three revised articles and their original versions from `git show 174454bd4bb8d9e05627d71f9ef0af646540b3e4:<path>`. Read the three recent Spanish comparators below independently, not just their descriptions in the author report.

## Round 1 required bounded changes (resolved in round 2)

| File:line | Exact sentence or smallest span | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
| --- | --- | --- | --- | --- |
| 705:65 | “Cuando el familiar es un profesional extranjero comprendido en el artículo 16, la solicitud directa ante la NIA exige que el profesional tenga aprobada la residencia o residencia permanente y que el familiar haya entrado sin visado o con visado de visitante.” | Material scope omission. Article 16(2) differentiates an ordinary foreign professional who engages in professional work in Taiwan from a foreign specialist professional. Both require NIA-approved residence or permanent residence. Merely calling a sponsor a professional “comprendido” does not tell this general reader about the ordinary professional’s current-work condition. This omission also existed in the original; preservation alone is not enough. Live Chinese Article 16 and official English full text agree, and the history confirms this provision took effect on 2026-01-01. | “El artículo 16 permite esta vía a la familia de un profesional extranjero que ejerza trabajo profesional en Taiwán o de un profesional extranjero de la categoría especializada. En ambos casos, el profesional debe tener residencia o residencia permanente aprobada por la NIA, y el familiar debe haber entrado sin visado o con visado de visitante.” Keep the following spouse/minor/dependent disabled adult child enumeration and exclusions. | Substantive clarification/correction of an under-specified scope, not merely a meaning-preserving stylistic edit. Official sources below. |
| 705:37 | “Trabajo: cuándo hace falta la autorización del empleador” | In ordinary Spanish this can mean the employer grants the authorization. The paragraph actually says the employer applies for a work permit under the legal rule. The title should identify that role. | “Trabajo: el permiso que solicita el empleador” (retain the body’s statutory exceptions). | Yes; identifies who applies without changing the authority or exceptions. |
| 705:39 | “Para trabajar hace falta autorización o exención.” | MONOTONY: short restatement — the preceding sentence already states the employer-permit rule subject to statutory exceptions, and the next paragraph explicitly gives authorization/exemption for Article 16. This standalone line adds no condition or action and retains the clipped filler pattern the user rejected. | Delete this last sentence; retain the preceding Article 43 sentence and the following Article 16 paragraph. | Yes; both authorization and exceptions remain explicit. |
| 706:61 | “No ampara cualquier separación ni cualquier desacuerdo laboral.” | MONOTONY: redundant rebuttal — the same paragraph already says “determinados casos”, identifies the qualifying kinds and says that each exception requires proof. This last negative line repeats those limits and leaves a vague singular subject. The author changed the original sentence’s wording without removing its choppy function. | Delete this sentence. Retain “Cada excepción exige acreditar sus propios hechos.” and the entire non-exhaustive list. | Yes; specific, conditional exceptions and evidentiary requirement remain. |

Live primary sources opened for the substantive finding on 2026-10-24:

- [Chinese Article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16), paragraph 2: the ordinary-professional work condition, specialist category and common residence/APRC prerequisite.
- [Official English Act](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295), Article 16(2), checked against the Chinese text.
- [Official legislative history](https://law.moj.gov.tw/ENG/LawClass/LawHistory.aspx?pcode=A0030295), entry 4: September 2025 promulgation, January 2026 commencement except the separately identified June 2026 provisions. Do not substitute promulgation for commencement.

The direct English single-article URL and direct Chinese history URL returned access errors; the English full Act and its history were reached through the official page links. This is an access limitation of those routes, not missing legal evidence.

## Actual prose and old-to-new evidence

The revision reads as explanatory professional Spanish through most of the series. Titles and headings now identify the application, documents, specific residence purpose or changed circumstance. It uses the conventional Spanish `visado`, `solicitud`, `subsanación`, `expediente`, and `resguardo` consistently. It does not import Spanish immigration law into the Taiwan routes.

- 704 original “Antecedentes y salud requieren comprobar las exenciones” becomes “Los antecedentes penales y el reconocimiento médico tampoco se exigen de la misma forma en todos los expedientes,” immediately tied to guide 0915. This replaces a compressed instruction with the actual documents and reason categories differ. Conditions remain category-dependent.
- 704 deletes the invented warning about choosing the professional portal merely because one has a job. The actual student and migrant-worker channels remain clearly named and linked. That is a substantive prose improvement, not a synonym swap.
- 705 removes “La asistencia cuenta”; the attendance limit and documentary consequence now form the paragraph. Its work/study/family order is intelligible, and the permit-pending job offer sentence is attached to the actual eligibility explanation.
- 705 removes the invented motive that a reader might choose an easier-looking professional form. The revised sentence tells the reader that the position and permit determine the system.
- 706 replaces “Una mudanza activa su propio trámite” with a move while the residence ground still continues, then gives the exact 30-day next-day deadline. That paragraph now supplies a useful situation instead of a metaphor.
- 706’s deadline table and its distinction between the day of the event and the next day should stay. They answer a real procedural difference; do not delete a necessary starting date merely to reduce repetition. The isolated unnecessary warning at line 61 is different and can be removed without weakening the law.

Read titles, summaries, headings, FAQs and endings separately. Summary 704 gives the two actual clocks; its body and FAQ retain the valid integrated-document exception. Summary 705 names the different residence grounds and entry status; the Article 16 body repair will make the family explanation sufficiently concrete. Summary 706 gives the consequence of losing the ground and the independent address duty. FAQ answers agree with the body on first-ARC exemption, submission channels, category-specific certificates, household registration AND approved residence for spouse work exemption, Mandarin study/entry conditions, employment-change permits and receipt/reentry distinction. No promotional ending, public author, invented experience, bold or Spanish-consultation promise appears.

## First-two-paragraph deletion test

704:
- Paragraph 1 sentence 1 adds the residence-entry group, ARC definition and 30-day obligation. Sentence 2 supplies the material next-day trigger. Sentence 3 supplies Article 22 and the integrated-document exception. None can be deleted without information loss.
- Paragraph 2 sentence 1 makes in-country eligibility necessary for visa-free/visitor entrants; sentence 2 denies that the preceding clock itself creates eligibility; sentence 3 locates the two statutory routes. This is a genuine applicability boundary rather than a decorative contrast. Keep.

705:
- Paragraph 1 starts with a real visa-free-entry question. Its wording supplies the condition needed for “permite hacerlo”; the next sentence gives the professional/family route and the third identifies the ordinary-study limitation. Keep the question and answer; repair the fuller family paragraph as above.
- Paragraph 2 separates the visa authority from residence/ARC authority, gives the more-than-six-month resident-visa purpose, then identifies direct NIA routes. Each sentence answers a different procedural question; none is an article roadmap.

706:
- Paragraph 1 sentence 1 identifies cancellation before the printed expiry, while sentence 2 identifies statutory revocation/cancellation and exceptions. Keep both.
- Paragraph 2 distinguishes a move from loss of the residence ground, then states the NIA recipient and 30-day next-day clock. The last sentence explains why a future renewal does not postpone the present obligation. Keep; this is a useful timing distinction.

## Three recent same-locale comparisons

All were read independently in the current checkout; all are published 2026-10-23. They are comparisons, not a claim that every sentence in them is exemplary.

| Comparator | Concrete opening/headings/ending comparison |
| --- | --- |
| `src/content/columns-es/691-spanish-judgment-taiwan-assets-enforcement.md` | Opens with the territorial limit of an EU certificate, then a Taiwan judicial requirement. Headings follow court examination, service, finality/amounts and assets. The final practical item is missing proof of service or finality, after a long consultation block. ARC 704 instead opens with a clock and proceeds through documents and delivery; it does not copy the consultation block or EU contrast. |
| `src/content/columns-es/692-return-spain-unpaid-taiwan-wages.md` | Opens with lost access to company email and reconstructing work evidence. Headings turn to payroll, hours, judicial mediation and each due date. Ending points to the oldest unpaid payslip. ARC 706 uses cancellation and a move as its triggers and closes on four travel dates. Both use real documents, but 706 avoids importing the comparator’s many clipped caution sentences except the one identified above. |
| `src/content/columns-es/693-spain-resident-taiwan-divorce-property.md` | Opens with an actual applicable-law question followed by the needed chronology. Headings distinguish divorce, marital agreements, housing and residual assets. It closes on a chronology and asset references. ARC 705 also opens with a real question, but entry status rather than family-property chronology drives it; its purpose-based sections differ in content and sequence. |

## Integrity, images and numeric review

Independent programmatic old/new Markdown URL-set comparison: 704 has 17, 705 has 18 and 706 has 15 unique URLs; zero URLs lost or added in each. Digit-token sets outside links/body metadata also have zero additions/removals. Internal routes and article filenames remain unchanged. Dates, source sections and internal `author: legal-ai-assistant` are retained. No external consultation link or language promise was added.

Numbers written as words and conditions were read manually, including: 30 days from the next day after residence-authorized entry versus visa issuance in Taiwan; two-year photograph and one-month employment/student certificate; first spouse ARC one year only in the specified Taiwan-household-registration category; student payment five business days and chip-card collection three business days after payment versus e-ARC at six months or less; NT$1,000/year including part-years, NT$2,200 eligible-route surcharge, ten/five business-day review with exclusions and restart. 705 retains Spain up to 90 days, visitor visa at least 60 days, intended residence over six months, Mandarin four completed months plus at least three further months, fifteen weekday hours, absences including leave no more than one quarter, and twenty work hours with winter/summer vacation exception. 706 retains ordinary three-month renewal window, Gold Card/business-based entrepreneur four-month window versus former-business three months, 30-day next-day address clock versus event-day 30/15 days for the specified ground-change routes, NT$500 loss/damage only, and under-30-day overstay with continuing ground and sanction rather than grace. The one Article 16 condition omission is explicitly recorded above; no blanket legal-preservation PASS hides it.

I visually opened all three actual WebP files using view_image. 704 shows the blank travel booklet, folder, plain card and pen; 705 shows the closed laptop, books, two mugs and blank booklet; 706 shows the blank notebook, booklet, plain card, keys and travel bag. Taipei is visible through a window in all three. The Spanish alt/captions describe visible objects accurately and call the pictures illustrations, without asserting official card authenticity, real people or authorship. The alt text need not enumerate every background object. No duplicate inline image is present. Actual browser rendering/deployed media delivery remains root’s integration task.

## Exact CLI and section 5 manual check

Executed independently for each actual file, using the required unmodified command:

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-revision-20261024/repo/src/content/columns-es/<file>`

| File | Sentences | CV | Short | run3 | opener_rep | cite_end | contrast | caveat | q | Exit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 704 | 46 | 0.458 | 0.130 | 0.045 | 0.200 | 0 | 0 | 0 | 1 | 0 |
| 705 | 54 | 0.451 | 0.111 | 0.019 | 0.217 | 0 | 0 | 0 | 1 | 0 |
| 706 | 59 | 0.454 | 0.102 | 0.035 | 0.227 | 0 | 0 | 0 | 1 | 0 |

All three output `OK — no variety limit violated`, with no FAIL. `git diff --check -- <the three assigned paths>` exits 0 without output.

Section 5 manual check:
1. CLI passes, but the two short restatements above still require real editing. Do not add replacement filler if removing them changes a number.
2. No stock invented-scenario opening. Three Spanish opening types differ: deadline, eligibility question, cancellation consequence.
3. Substantive short sentences exist, including original-document return, visa-fee separation, and restarting review after supplementation. The two identified unnecessary short lines must not be counted as editorial success.
4. Paragraph starters vary across applicant, institution, condition, timing and document. No repeated instruction sequence or mechanical vertical starter pattern was found.
5. No three-paragraph claim/citation/caveat template. Practical document/collection/travel prose supplies useful uncited paragraphs while legal claims retain sources.
6. Automated contrast count is zero; actual necessary distinctions remain. The 706 line identified above is an unnecessary rebuttal despite the numeric PASS.
7. Last substantive paragraphs end on card data/work authority (704), compatible route and sponsor status (705), and passport/permits plus four travel dates (706), followed by structural sources. No sales ending.
8. Professional Spanish register; no bold, invented first-person testimony, public byline or checklist-style command heading. Correct the employer-authorization heading to avoid the wrong apparent actor.
9. URLs/numbers/starting dates and the enumerated exceptions are preserved; Article 16 requires the material scope repair already identified. Accuracy takes precedence over measured variety.

## Limits and next bounded step

The final legal reviewer remains responsible for the full series/current-law cross-language check. I independently reopened the Article 16 text and commencement evidence, and compared other legal/numeric claims to the original manuscripts and current source-refresh ledger; I did not re-open every administrative URL. No deployment or human-review claim is made. Author should apply the four bounded findings (705:65, 705:37, 705:39, 706:61), keep 704 frozen, rerun the exact CLI, and return the new hashes. I will then recheck the affected paragraphs, FAQ/ending conclusions and hashes without restarting the entire review.


## Bounded repair round 2 — current PASS

I independently reread the changed 704 family table and its first-card paragraph, 705 employment heading/paragraph and both Article 16 family paragraphs, 706 residence-loss exception paragraph, and all affected FAQs and final substantive conclusions. I also read the author’s exact round 2 change record. I did not edit any manuscript.

| File | Current SHA-256 | Current result |
| --- | --- | --- |
| `src/content/columns-es/704-taiwan-arc-first-application.md` | `8de94ac57ae2c2538ab3d0ccd9b7f0deb15a02c7db2c567d18fa652c9e8543bc` | PASS |
| `src/content/columns-es/705-taiwan-visa-residence-work-study-family.md` | `b1b36203c0a9ad4efe2841b90f778c6f37e056ab5679f4ab00710f54101bb125` | PASS |
| `src/content/columns-es/706-taiwan-arc-renewal-changes-reentry.md` | `d9bd9558b9ee3126bcb5987701852a1e9ae92eb9a3a1de987faf741de1c021b9` | PASS |

Findings closed:

- 705 now expressly distinguishes an ordinary foreign professional performing professional work in Taiwan from a foreign specialist professional, and requires NIA-approved residence or permanent residence in either case. The family’s visa-free/visitor entry condition, enumerated eligible relationships and residence approval before ARC issuance remain clear. The amendment matches the Chinese/English Article 16(2) and commencement evidence read independently in round 1. This closes the material scope issue.
- The heading now identifies the employer as the permit applicant. Deleting the redundant authorization/exemption sentence leaves those legal alternatives in the immediately surrounding complete explanation.
- 706 removes the redundant “No ampara…” caution. The joined condition-and-exception sentence explains the trigger and non-exhaustive examples together; the short proof requirement retains real information. It does not make every job loss/divorce automatically eligible or remove the qualifying conditions.
- The final Europe reviewer’s additional 704 scope repair is also accepted: the table now explicitly requires the Taiwanese spouse to reside in Taiwan AND have household registration there. I reopened the [current residence regulation](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129) and read Article 12(1)(4); its cumulative conditions agree. The subsequent first-card paragraph is expressly tied to this category. This is a substantive precision improvement, not a mere style edit. The direct single-article route failed, but the full official regulation was accessible.

The local sentence joining after the deletions is acceptable prose: 705 keeps the two sponsor alternatives and their shared approval prerequisite in one condition; 706 joins loss of the ground to the statutory exceptions. Neither introduces a vacuous short sentence or a false legal contrast to satisfy a metric. The remaining short sentence in 706 tells the reader that the exception’s facts require proof. Titles, summaries, FAQ answers, conclusions and image descriptions remain consistent with the revised body. No new sales ending, byline, consultation-language promise or bold was added.

I reran the exact required command on all three current files, rather than adopting the author’s outputs:

| File | Sentences | Mean | CV | Short | run3 | opener_rep | cite_end | contrast | caveat | q | Exit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 704 | 46 | 19.0 | 0.458 | 0.130 | 0.045 | 0.200 | 0 | 0 | 0 | 1 | 0 |
| 705 | 54 | 21.5 | 0.456 | 0.093 | 0.019 | 0.250 | 0 | 0 | 0 | 1 | 0 |
| 706 | 57 | 19.4 | 0.474 | 0.088 | 0.036 | 0.227 | 0 | 0 | 0 | 1 | 0 |

Each returned `OK — no variety limit violated`, no FAIL/WARN. Fresh `shasum -a 256` agrees with the exact hashes above. Fresh old/current Markdown URL and digit-set comparison again found zero additions or removals in all three articles; word-number and condition review remains applicable with the expressly documented two scope corrections. `git diff --check -- <three paths>` again exited 0 with no output.

Section 5 recheck: the diverse openings/deletion-test results remain unchanged; meaningful short sentences remain after removing the rejected ones; paragraph starters and citation rhythm remain varied; no mechanical replacement caution was introduced; exact clocks, amounts, categories and source relationships remain; fact-specific endings and professional Spanish are retained. The earlier image inspection still applies because image fields/assets were not modified in this repair.

No further Spanish repair is requested. This PASS applies only to these exact hashes and the documented locale/current-source scope; final cross-language legal verification and root’s build, rendered-image and publication verification are separate.
