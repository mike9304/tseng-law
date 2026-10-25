# Independent Indonesian locale review — 924–925

Verdict: PASS for the two exact versions below. Reviewer `/root/expand_locale_id` did not author either article and did not edit the manuscripts. This is an independent AI editorial review, not a claim of human native-speaker or attorney review. It does not certify publication.

Review date: 25 October 2026. Machine-readable timestamp, original command output and image hashes are in `id-locale.json`; direct official-page responses are preserved in `id-locale-evidence.json`.

| Article | Full-source SHA-256 | Verdict |
|---|---|---|
| `src/content/columns-id/924-indonesian-caregiver-taiwan-pregnancy-dismissal.md` | `a197b0284aea60858bfa499a7051f1ece5082236839cb4a24502dcbf3be82cff` | PASS |
| `src/content/columns-id/925-indonesian-caregiver-taiwan-work-outside-permit.md` | `f9bc4f713398de194ea6e8ffbf62b8bfc8294f5821fd1fce3fcfcbe1c9e9b439` | PASS |

## Scope and inputs actually read

Read both complete current manuscripts, all frontmatter and three FAQs each, source appendices, titles, summaries, image alt/captions and consultation paragraphs. Read task AUTHOR-BRIEF and REVIEW-BRIEF, repository AGENTS and complete editorial voice, COLUMN-VOICE-RULE, shared sentence-variety rules and LESSONS, editorial skill and independent-review criteria. The historical Fable workflow was not applied.

Research checked: the Indonesian 924/925 parts of `sea-briefs.md`, Indonesian market/source/search sections of `sea-market.md`, the author's complete `id-author.md` and JSON, current author checker results and `work/images/id-generation.json`. The author's raw source evidence exists separately; this review also directly opened the consequential terminology sources listed below rather than treating the author's report as independent proof. The final author report SHA is `45eac72fc5ca47ac55b1514b65c985640776fcf3d9b802908f5e5747b6cd589b`.

The current Indonesian entry in `src/data/international-inquiry-copy.ts` and service statement in `src/data/en-service-scope.ts` confirm consultation in English, Chinese, Korean and Japanese. Both manuscripts accurately require confirmation of Indonesian communication and distinguish receipt of an inquiry from acceptance of a matter. Neither promises interpretation, a response time, a fee or a result.

## Findings and bounded correction

No unresolved material locale finding remains. No unsuccessful independent repair round occurred.

One pre-freeze sentence was identified independently as removable while the author was already preparing the same correction:

| File:line / version | Exact sentence | Reason | Author's implemented replacement | Meaning preserved? |
|---|---|---|---|---|
| 924:28, pre-freeze `9ba5496a…` | `Hak cuti dan sumber pembayaran selama cuti perlu dibaca satu per satu.` | Announces how to read the article without supplying a fact; deleting it leaves the preceding exclusions unchanged. | `Cuti melahirkan mereka pada dasarnya tanpa gaji.` | The prior source-supported unpaid-maternity baseline is now stated directly. The contract-pay qualification remains at line 42 and in FAQ 2. This was re-read in the frozen full file. |

The final legal reviewer requested one terminology clarification at 924:28 after the first locale PASS: the first `Undang-Undang Asuransi Ketenagakerjaan` now reads `Undang-Undang Asuransi Ketenagakerjaan Taiwan (Employment Insurance Act, 就業保險法)`. This identifies the statute rather than excluding labor or occupational-accident insurance generally. The underlying rule is unchanged. The repaired paragraph, linked payment paragraph, parental-leave explanation and affected FAQs were re-read; reversing exactly this one replacement reproduces the prior full-file SHA `b07ba325b1496e07901e5ccd79ae98a0066bb7add927257deae9db7c4557e85a`. The original Indonesian CLI was rerun on the new full-file SHA and passed, CV 0.468, exit 0, FAIL 0. This is one successful narrow final-review repair and zero unsuccessful repair rounds. 925 and both images are unchanged.

No manuscript change was requested solely to raise a metric. The shorter evidence-preservation sentences describe an action: retaining complete copies, retaining original files, or noting the location. They do not claim that migrant readers need moral instruction. Imperatives occur inside the actual evidence or signing task; the articles do not repeat a numbered checklist or use instructional section headings such as “understand the key points.”

## Indonesian register and reader fit

`Pengasuh rumah tangga`, `majikan`, `agen`, `surat pengunduran diri`, `izin kerja`, `cuti melahirkan` and `pindah majikan` are intelligible to the intended Indonesian caregiver audience. `Pengasuh` does not imply a licensed nurse. `Warung` is a concrete and familiar shop/food-business trigger; the text also uses `toko`, `kedai makanan` and `restoran` where the official prohibition is broader. Legal terms are tied to a practical choice instead of being left as unexplained labels.

924 develops a signature dispute, leave/payment distinctions, factual chronology and approved transfer. It preserves the worker's choice to continue, leave or seek another employer and does not generalize that pregnancy prevents every unrelated lawful termination. 925 separates the work actually assigned, the issuer of the instruction, the employer receiving the work, and the authority's permit decision. It does not assume either inevitable cancellation or immunity from cancellation. The language remains professional without invented experiences, fear-based advertising or a promised outcome.

Titles and SEO titles identify the actual dispute. Summaries and FAQs do not broaden the body. The dates and Indonesian date display agree. No bold markup, duplicate leading H1, public authorship statement, invented client, or invented court event was found. The internal author remains `legal-ai-assistant`.

## First-two-paragraph deletion test

| Article and paragraph | What would be lost if deleted | Sentence-level decision |
|---|---|---|
| 924, paragraph 1 / line 26 | The specific dismissal prohibition, prohibition on advance forced resignation/unpaid-leave clauses, and ineffective termination consequence. | The three sentences each add one of those distinct propositions. Retain. |
| 924, paragraph 2 / line 28 | The two domestic-worker statutory exclusions, the dated official clarification, and unpaid-maternity baseline. | Retain the concrete final version. The prior forecast sentence was removed; WDA is expanded here for later references. |
| 925, paragraph 1 / line 26 | The exact employer-owned shop question, the official answer, and the family-ownership misconception affecting the proposed work. | The reader-question opener is allowed and directly answered; it is not a generic preview. Retain. |
| 925, paragraph 2 / line 28 | The employer's statutory prohibition and why employer consent or extra pay does not itself authorize the duties. | The brief consent sentence links the prohibition to the reader's immediate offer; the final sentence adds the extra-pay arrangement. Retain. |

## Three actual recent same-locale comparisons

The following complete existing articles were read from the current repository. All have publication date 24 October 2026 and are the three most recent prior Indonesian columns.

| Comparator | Actual opening, shape and ending | Difference in the new pair |
|---|---|---|
| `src/content/columns-id/704-taiwan-arc-first-application.md` | Opens with the 30-day ARC deadline and exception; uses a category/document table and application/payment sequence; ends by connecting the issued card to changes and renewal. | 924 begins with dismissal protection; 925 begins with an employer-owned shop question. Neither repeats the documents-table/application sequence. |
| `src/content/columns-id/705-taiwan-visa-residence-work-study-family.md` | Opens with TAC's visit-only scope, then compares work, study and family routes; closes on choosing a residence basis and following the appropriate ARC article. | Both new pieces stay within one home-caregiver dispute rather than touring all residence categories. Their closing details concern the actual resignation document or actual assigned tasks. |
| `src/content/columns-id/706-taiwan-arc-renewal-changes-reentry.md` | Opens with contract expiry despite the printed card date, then the renewal window; sections follow changes, replacement and travel, ending on dates relevant to the reader's pending file. | Transfer approval is a necessary boundary in the new pieces, but they do not recast renewal/travel instructions. Their evidence sections concern pregnancy notice or work instructions rather than card data. |

The existing 664 unpaid-wage slug referenced in 925 exists in the current repository. It is a related payment issue, not an invented internal route. The common permit-approval caution is legally required and is not treated as proof of substantive duplication.

## Section 5 check

| Item | Independent result |
|---|---|
| 1. Original metric | Actual original `variety_metrics.py check <absolute file> --lang id` executed independently; both exit 0, FAIL 0. No substitute language or checker modification. |
| 2. Opening variety | 924 is a concrete protection rule; 925 is the worker's precise question. No stock hypothetical opener. Whole 24-article batch distribution is outside this two-article assignment. |
| 3. Sentence lengths | 924: 51 sentences, CV 0.468, short fraction 0.235; 925: 46 sentences, CV 0.460, short fraction 0.217. At least two substantive very short sentences each. Longer statutory explanations are followed by shorter evidence/application sentences. |
| 4. Paragraph openings | Actual openings were read vertically; repeat counts remain within the original checker limit. `Pengaduan` and `Untuk` recur in 924 at distinct relevant steps; the statute-led paragraphs in 925 do not form a continuous template. |
| 5. Citation rhythm | Official citations occur as subjects and within explanations; evidence-preservation paragraphs stand without redundant legal citations. No three-paragraph claim/citation/caveat cycle. |
| 6. Contrast | No rhetorical “not X but Y” template cascade. Dismissal versus leave pay, instruction versus initiative, fine versus compensation, and complaint versus transfer permission are necessary legal distinctions for these disputes. |
| 7. Ending | 924 ends its substantive discussion on the notification date, stated reason and document deadline; 925 ends on permitted duties and actual assigned work. Source/caution appendices remain structural tails. No generic conclusion or sales promise. |
| 8. Register and formatting | Indonesian register is consistent. No bold, fabricated first-person experience, public AI/person byline, or command-style checklist headings. |
| 9. Integrity | Eight weeks, seven days, the NT$30,000–150,000 range, failure-to-correct condition, source links, and approval requirements are retained. Hypothetical image status is explicit. |

The metrics are diagnostics, not an AI detector or substitute for the paragraph reading above. No MONOTONY rejection is warranted for these frozen versions.

## Source-meaning spot checks

Direct official pages were opened on 25 October 2026. The [WDA Indonesian pregnancy guidance](https://fw.wda.gov.tw/wda-employer/home/file/2c95efb396b1b5b30196b414768a0b43) supports the pregnancy-dismissal and approved-transfer distinction. [WDA's dated clarification](https://www.wda.gov.tw/News_Content.aspx?n=31&s=19455) states the domestic-worker exclusions and unpaid maternity baseline. The first web `find` did not return the body; a subsequent direct open at the relevant lines did, and the actual response is preserved.

[Articles 11](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030014&flno=11), [15](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030014&flno=15), and [31](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030014&flno=31) were checked against the corresponding Indonesian dismissal, leave and burden-of-proof wording. No locale edit changed their modal force or the required supporting facts. Final legal review should retain the distinction between Employment Insurance Act (就業保險法) and other forms of labor/social insurance; the exclusion in this article is the named statute and parental-leave allowance, not a claim that no insurance protection exists at all.

The [WDA Indonesian outside-permit guidance](https://fw.wda.gov.tw/wda-employer/home/no-work-illegally/no-work-illegally-file/2c95efb395ab11680195ac17c09d0157) names employer-operated shops/food stalls and care for someone else at another residence. The manuscript does not turn this into a general ban on accompanying the authorized care recipient outdoors. [Employment Service Act Article 73](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=73) confirms the difference between another employer and self-initiated outside-permit work; both are retained in the Indonesian explanation and FAQ.

## Actual image inspection

Both final WebP files were independently opened with `view_image`, not merely checked for existence. Each is 1536 × 1024 according to the image ledger and the displayed raster.

| Image | Actual observations and localized text fit | SHA-256 |
|---|---|---|
| `public/images/columns/924-market-expansion-20261025.webp` | Green apron on a chair, baby socks on a table and wheelchair in a domestic room. Alt names those objects; caption calls the scene fictional. No people, visible face, readable document, logo or flag observed. | `d705073447ac0b21a047d736acca9cd73cc6e3e4ab98d560fc5f321bc5761b7a` |
| `public/images/columns/925-market-expansion-20261025.webp` | Restaurant bowls and apron on a trolley, with a wheelchair and bed through the doorway. The cool restaurant/warm domestic room is visually distinct from 924. Alt and fictional-scene caption match. No people, readable document, logo or flag observed. | `41beac4dfdbb8f47d304252163c526d5586c68abc875937ff26ce65d7530aab8` |

## Evidence limits and handoff

The MOJ pages displayed a compilation cutoff of 16 October 2026. This was an independent locale review with current official source-meaning spot checks, not the full independent final legal/commencement audit. No market size is equated with paid legal demand. No human review, licensed professional review, public deployment, browser layout, hydration or interaction verification is claimed.

Root and the separate final reviewer must bind their decision to the exact current manuscript and locale-report hashes. Any later manuscript change requires checking the affected language and renewing the SHA binding. Publication remains root's responsibility under the user's existing authorization.

## Caption metadata rebinding — 2026-10-25T13:27:45.383008+00:00

Root normalized both `featured_image_caption` values to `Adegan fiksi`, the repository’s canonical Indonesian fictional-scene label. This is natural Indonesian, preserves the fictional-image disclosure, and makes no authorship or real-case claim. The detailed alt text remains unchanged. The current caption and alt of each file were read.

- `src/content/columns-id/924-indonesian-caregiver-taiwan-pregnancy-dismissal.md`: current full SHA `a197b0284aea60858bfa499a7051f1ece5082236839cb4a24502dcbf3be82cff`. Replacing only the new caption with the recorded prior caption independently reproduces the approved SHA `8f8f4b9059df25cfaf8d29cb6fe73c7a9b462ef37f3876bf6a36becbfa9221db`; all other source bytes, including body, metadata and alt, are unchanged. The actual image hash is unchanged. The original `--lang id` CLI was rerun on the current file and returned exit 0, FAIL 0.
- `src/content/columns-id/925-indonesian-caregiver-taiwan-work-outside-permit.md`: current full SHA `f9bc4f713398de194ea6e8ffbf62b8bfc8294f5821fd1fce3fcfcbe1c9e9b439`. Replacing only the new caption with the recorded prior caption independently reproduces the approved SHA `d9b6f376d4eae90d11e8cc583818f32c56d0898a5457594566e617fa38e7dbaf`; all other source bytes, including body, metadata and alt, are unchanged. The actual image hash is unchanged. The original `--lang id` CLI was rerun on the current file and returned exit 0, FAIL 0.

PASS is renewed for the current hashes in the opening table and JSON. The normalization proof is `work/checks/caption-normalization.json`; independent reverse-substitution and real checker results are retained in this reviewer’s `id-locale-evidence.json`. This is a metadata-only root integration change, not an unsuccessful author repair round.
