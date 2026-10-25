# Vietnamese author handoff — 922–923

Mode: DRAFT. Date: 2026-10-25. Author agent: expand_author_vi. This is author self-check evidence, not independent review, human review, legal sign-off or publication evidence. Frozen manuscripts are ready for the assigned independent Vietnamese reviewer and separate final legal reviewer.

## Frozen files

| File | SHA-256 | Actual shared variety check |
|---|---|---|
| `repo/src/content/columns-vi/922-vietnamese-tenant-taiwan-deposit-handover-deductions.md` | `80779888e17199b5d1108f545d5587ce7ab5ec820f165a0f19a5ec90f4ad4a88` | Exit 0, no FAIL; sentences 45, mean 20.8, CV .458, short .178, run3 .000, opener_rep .188, cite_end .000, contrast 1, questions 2 |
| `repo/src/content/columns-vi/923-vietnamese-graduate-taiwan-probation-pay-work-exemption.md` | `88335b55c5ea00cfac484947d743b1b8f09a32265f97eeef6f011799c0007f2c` | Exit 0, no FAIL; sentences 49, mean 22.4, CV .485, short .184, run3 .064, opener_rep .167, cite_end .000, contrast 0, questions 1 |

Commands were actually run on the final files:

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-market-expansion-20261025/repo/src/content/columns-vi/922-vietnamese-tenant-taiwan-deposit-handover-deductions.md --lang vi
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-market-expansion-20261025/repo/src/content/columns-vi/923-vietnamese-graduate-taiwan-probation-pay-work-exemption.md --lang vi
```

Both commands ended `OK — no variety limit violated`. Full stdout and exact commands are in `vi-author.json`; Vietnamese counts are orthographic units, not a claim of semantic equivalence with English words. Initial failures are preserved in `vi-author-922-initial.md` (CV .424) and `vi-author-923-initial.md` (CV .400). The first 922 repair still failed at .444 and is preserved in `vi-author-922-repair1.md`. The second 922 repair passed. The 923 repair passed at .520; removing a duplicated NIA-approval sentence and making its opening explicitly connect permit exemption with wages produced the pre-locale-review .491. No failing manuscript is labeled approved.

`git diff --check -- src/content/columns-vi/922-vietnamese-tenant-taiwan-deposit-handover-deductions.md src/content/columns-vi/923-vietnamese-graduate-taiwan-probation-pay-work-exemption.md` exited 0. A direct text check found no bold markup and no duplicate leading H1. These new untracked files still require root's integration checks.

## Audience and nonduplication

The researcher's `work/research/sea-briefs.md` was read in full and its 922/923 conditions were compared after drafting. Root expressly authorized drafting on independently opened official sources while the research file was being saved. The draft does not infer market size, paying clients or search volume from Vietnam's student population. No market statistic is used as an introduction.

- 922 serves Vietnamese students and employed residents renting privately outside institutional accommodation. Its decision is whether the landlord's deductions are supported and what the handover record must establish. It preserves the contract termination / home return / contractual debt settlement conditions. It does not promise an immediate full refund just for handing over keys. Local-government tenancy mediation was independently checked at Article 16, although the initial research brief had not covered it.
- 923 serves a Vietnamese graduate receiving a first Taiwan job offer. Its central link is that work-permit exemption does not remove wage protection during probation. It is not a generic ARC procedure or a translation of another locale's article. Degree origin, minimum qualification, recent-graduate status, prior NIA approval and approved period all remain conditions. The monthly/hourly floor is distinguished from a professional-work-permit salary threshold; no claim equates them.

### Three recent Vietnamese comparators, actually read

All three are published 2026-10-24. Their hashes are recorded in the JSON.

1. `repo/src/content/columns-vi/704-taiwan-arc-first-application.md`: opens directly with Article 22 and the 30-day ARC deadline, then moves through documents, portals, fees and card collection. The new 922 opens with refund conditions; it follows a dispute's documents and handover rather than reproducing a registration checklist. The new 923 gives permit eligibility only as needed for the pay issue, and does not repeat 704's document or fee inventory.
2. `repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md`: opens “Có thể sang trước, xin cư trú sau?” and divides work, degree study, language study, family and entrepreneurship routes. Neither new article uses that route-menu structure. The only comparable issue in 923 is the distinction between residence and the legal basis for work; its new focus is Article 12 plus probation pay and wage evidence.
3. `repo/src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md`: opens with loss of the initial residence basis despite an unexpired ARC, and ends on passport/ARC/reentry documents matching the return date. In 923, the final concrete record is approved work eligibility + expiry + agreed pay. In 922, it is handover + deposit balance + deductions still in dispute. The source/date tail is structural, while the substantive endings are specific to each reader's transaction.

### Opening deletion test

922, paragraph 1:

- Deleting the opening conditional sentence would remove when the landlord must return the deposit, including the balance-after-setoff alternative. Keep it.
- Deleting the Article 7 sentence would remove the two-month cap and its official citation. Keep it.

922, paragraph 2:

- The first sentence identifies the disputed deductions (painting, cleaning, air-conditioner repair) and the tenant-responsibility issue; without it, the following photo/invoice comparison has no identified charge. Keep it.
- The next sentence assigns different evidentiary functions to handover photos and repair invoices. Keep it.
- “Cần đối chiếu cả hai” asks the reader to compare those two records rather than treating the existence of an invoice as proof of responsibility. The independent reviewer should judge whether this concrete instruction is sufficiently useful; it has not been called an independent style PASS by the author.

923, paragraph 1:

- The opening connects graduate permit exemption to probation-wage protection. Removing it loses the article's central distinction and leaves a generic probation rule.
- The next sentence supplies Labor Standards Act scope, invalid subminimum/no-overtime agreements and the MOL source. Its legal conditions cannot be removed for pace.

923, paragraph 2:

- The first sentence introduces the graduate's start-work date, the second identifies degree and approved residence extension as the exemption conditions, and the short final sentence rejects relying on an ARC alone. The degree/approval distinction must remain; the final reviewer should confirm that the later full Article 12 wording adequately bounds this introductory statement.

During repair, a standalone “Phải có chấp thuận của NIA” immediately after the full Article 12 condition was deleted as redundant. No condition was lost.

## Section 5 self-check

1. Original shared CLI on both actual final files: exit 0 / FAIL 0, not skipped or relabeled.
2. No stock hypothetical opener. 922 begins with the refund's legal conditions; 923 begins with the relation between permit exemption and probation wages. Neither invents a client or a reported encounter.
3. At least two short sentences in each. Longer legal sentences retain the linked conditions; long-sentence clustering was checked in prose, not only by CV. The short sentences serve concrete evidence, blank signature spaces, application approval, timing or communication/retainer distinctions.
4. Paragraph starts were read vertically and the real repetition metric passed. No attempt was made to change language labels or segmentation.
5. No repeated three-paragraph claim/citation/caveat cadence. Practical handover and wage-record paragraphs do not introduce uncited legal propositions. Sources remain near each consequential legal claim.
6. Contrast count 1 / 0 under the shared checker. The permit/pay contrast is a researched reader confusion, not a manufactured rebuttal.
7. Substantive endings stay with the files the reader needs: 922's deposit and handover disagreement; 923's eligibility, expiry and agreed salary. The source list and general-information scope are structural tails.
8. Professional Vietnamese with diacritics. No public byline, first-person expertise claim, bold, phone number, LINE, success promise or invented interpreter. Internal `author: legal-ai-assistant` retained.
9. Review of revisions preserved legal scope, numbers, currency, dates and official links. 2026 is 29.500/month and 196/hour; announced 2027 is 30.900/month and 205/hour effective only 01/01/2027. The tenant's natural-use exception remains; no automatic two-year work entitlement or all-ARC entitlement is stated.

## Official source ledger and access limits

`vi-author.json` contains 14 claim-level source entries and every article URL. `vi-author-source-opens.json` preserves an actual tool response opening 10 of the central official pages. Other checked official pages were tenancy scope/full law, Article 16, minimum-wage meaning and Labor Dispute Settlement Act Article 9. All were checked 2026-10-25.

- MOJ tenancy law showed current revision 2023-02-08. Its Article 4 exclusions are preserved in the scope tail, including cooperatives and contracts shorter than 30 days.
- Civil Code 432 was read in the current official text; the page's pending provisions concern 166-1 and 1223, not the cited 432.
- Foreign Professionals Act 12 was read in full current A0030295 because its single-article URL did not open. The article deliberately links the working full-text URL. WDA's current FAQ confirms commencement 2026-01-01 and the exact class of eligible graduates.
- NDC commencement-history/press pages returned 403. Their search excerpts were not substituted for the opened WDA commencement statement.
- MOI PIP rejected direct access. No unverified template provision is used.
- MOL wage history was updated 2026-10-21 and explicitly distinguishes the 2026 rate from the 2027 rate announced 2026-10-16. No draft wage rate is represented as current.
- MOJ pages identify an assembly cutoff of 2026-10-16. The final legal reviewer should retain that ordinary database freshness limit while checking any later official changes; the author does not claim exhaustive legal monitoring after that cutoff.
- `https://tseng-law.com/vi/contact` did not open through the web tool. The current repository's `international-inquiry-copy.ts` Vietnamese block and `en-service-scope.ts` were read. The SEA researcher separately verified the public English services/contact pages. The four consultation languages are Chinese, English, Japanese and Korean; Vietnamese is guidance and initial inquiry only. No broader English-page reply-language claim is repeated.

## Image evidence

Native `image_gen.imagegen` was used once per asset. Prompts and original generated paths are in `work/images/vi-generation.json`. Both originals were actually displayed and inspected; both final WebP files were separately opened with `view_image` after format conversion. Both are 1536×1024.

| Image | SHA-256 | Inspection |
|---|---|---|
| `repo/public/images/columns/922-market-expansion-20261025.webp` | `c41c0e82349c0d938850db2c824c67949ec674f9cbfc3d334ce33bc923908d85` | Warm empty rental apartment, keys, blank paper, phone and moving box. No faces, readable text, identity documents, logos or actual case evidence. |
| `repo/public/images/columns/923-market-expansion-20261025.webp` | `788418fe4ca09acbc7d0cc30985d254fa47d5a5192e98c50e022209cf3fc8125` | Cool office desk, plain folder, laptop, mug and backpack. No faces, readable text, identity documents, logos or actual case evidence. |

Pillow converted PNG to WebP (quality 88, method 6); it did not alter image content. The source originals remain under `.codex/generated_images`. Localized alt text describes visible objects and each caption calls the scene fictional. No author attribution is in alt/caption.

## Remaining work

Independent Vietnamese review and separate final legal review are pending on the exact hashes above. Root owns integration, deployment and public readback. The author has not committed, pushed, deployed, modified existing content or certified the page's browser rendering.

## Independent locale repair handoff

Reviewer expand_locale_vi requested three bounded corrections. All were applied: remove the misleading “Ngược lại,” transition in922; replace its abrupt CTA fragments with a grammatical four-language / communication / no-retainer-no-Vietnamese-promise paragraph; clarify in923 that the subminimum-wage and unpaid-overtime agreements themselves are void during probation. This923 change clarifies the intended legal assertion and is flagged for the final legal reviewer.

The922 CTA repair initially produced a real CV.438 failure on SHA`5cee66fc8997f41aa9bb703bc0678af10af23d6a8f7486250d3e4a8f87859527`; the manuscript is preserved in `vi-author-922-locale-r1-fail.md`. With the reviewer's agreement, the only further passage changed was the 點交 explanation: the full sentence now expressly requires both parties to inspect and hand over the condition of the home/equipment; “Thủ tục này gọi là 點交” supplies the Chinese term. No warning or filler was added. Actual final CLI results are reflected in the frozen table and JSON.

922 final SHA`3616a2fddce24e851e2ab9c657b47aee016ff6d5821c41eb1167cc496ef14873`, CV.458, FAIL0. 923 final SHA`88335b55c5ea00cfac484947d743b1b8f09a32265f97eeef6f011799c0007f2c`, CV.485, FAIL0. The independent reviewer is checking these exact versions; author does not certify its own locale PASS.

## Final legal scope repair and metadata correction

Final reviewer `expand_final_asia` identified the additional transition exception in Rental Housing Act Article40(3). The author opened the full current official text and read the paragraph. The final scope tail now says that leases entered before the Act took effect and continuing afterwards are outside this Act unless the parties agree to apply it. The article links the full official text inline and includes Article40 in its source list. This is explicitly a substantive scope narrowing, not merely a fluency edit. Covered-lease conclusions remain unchanged. No unverified commencement date was added. The single-article40 URL was inaccessible; the successful full-text response is preserved in `vi-author-art40-source-open.json`.

Root separately identified unsupported metadata `topic: real-estate` and requested allowed `topic: litigation`. That exact metadata correction was applied; no other metadata changed.

922 latest SHA `80779888e17199b5d1108f545d5587ce7ab5ec820f165a0f19a5ec90f4ad4a88`. Actual original CLI with `--lang vi`: exit0, CV.458, FAIL0. The prose metric is unchanged because this legal exception is in the source/scope tail, so the exception itself requires the requested independent locale and legal reread. The previous locale-approved SHA `3616a2fddce24e851e2ab9c657b47aee016ff6d5821c41eb1167cc496ef14873` is now superseded.923 remains unchanged at `88335b55c5ea00cfac484947d743b1b8f09a32265f97eeef6f011799c0007f2c`.
