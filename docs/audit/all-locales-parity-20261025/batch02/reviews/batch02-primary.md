# Batch02 — primary content integration decision

2026-10-25 KST. Scope: 21 complete ARC columns, 704–706 in Danish, Norwegian Bokmål, Finnish, Polish, Czech, Romanian and Ukrainian. Root personally wrote the three Ukrainian manuscripts and edited all three Kimi Norwegian manuscripts. The other authors and independent reviewers are identified in their preserved reports. This is AI editorial/source comparison, not human native-speaker or lawyer certification.

## Findings closed

| Locale | Evidence and decision |
|---|---|
| da | `da-author.md` and `da-independent.md`: required findings 0 at the current fixed hashes. Three optional clarity proposals are retained in the review; the existing wording is not a scope or deadline error. No article change after that review. |
| nb | `nb-independent.md` preserves the initial five meaning/term findings and two monotony failures. Root corrected these and restored required source URLs. Full original/final diffs and hashes are recorded by `nb-primary-edits.md`. `nb-independent-r2.md` independently read the complete current texts and diffs, re-opened the relevant official laws and closed all required findings. |
| fi | `fi-independent.md` preserves R1 and appends R2: the online-procedure citation is notice 9, and the stopped-business route is a window during the three months before expiry. The heading and redundant closing sentence were also repaired. R2 reversed only these exact edits in memory to reproduce the R1 hashes, and reran the shared checker. |
| pl | `pl-independent.md`: required findings 0. Its two optional subject/verb clarifications were already included in the final frozen manuscripts. Root checked the report's exact changes and current hashes. Tool-design participation is disclosed in that report, not presented as independent engineering certification. |
| cs | `cs-independent.md`: required findings 0. Its single optional verb improvement is retained as optional. Current manuscripts still match the independent review hashes. |
| ro | `ro-independent.md` preserves R1 required M01 and optional S01/S02. Root read those findings and the current changed passages: 706 now says `Cererea poate fi depusă în cele trei luni anterioare expirării rezidenței actuale.` The permitted pre-expiry window is explicit and distinct from the continuing-business four-month window. 705 places the residence-approval clause next to the foreign applicant, and 704 removes only the invented intermediary-message rebuttal. Source URLs, FAQ, dates and legal conditions remain. The current hashes match the author's final change report. M01 closed. |
| uk | Root authored the complete manuscripts. `uk-independent.md` found required 0 / optional 4 on its recorded pre-edit hashes. Root applied the narrow subject/entry wording, same-document NIA URL and fee wording clarifications in `uk-author.md`, then reran the shared checker and automatic audit. The independent report is preserved rather than rewritten as a review of an unseen hash. |

## Shared meaning boundaries

The accepted source set is the unchanged current EN/KO/ZH 704–706 and F01–F24. All nine source hashes are in `checks/batch02-source-hashes.json`. The articles keep jurisdiction in Taiwan and do not infer citizenship from reading language. They preserve the first-application trigger and next-day distinction, student review/payment/collection units, family sponsorship AND/OR structure and self-care condition, three/four-month pre-expiry windows, BOCA application within fifteen days, conditional post-overstay applications, work-permit exceptions, APRC reentry exception and the specific online-procedure departure effect. Statutory short summaries are not expanded solely to match every optional detail of a longer source.

Every manuscript keeps three FAQ entries, the source image identity and fictional-scene caption, the internal author token, exact public slugs and the 2026-10-25 publication date. No new consultation language, public byline, decorative bold, fabricated case outcome or claimed human approval is added.

## Verification and limits

Root reran the actual shared checker on all 21 final files using their own seven supported locale profiles: exit 0, FAIL 0. Per-locale raw output is preserved in `checks/*-variety-final.log`. The checker and thresholds were not edited to fit manuscripts.

The overlay combines the complete current content inventory with the 21 candidates and uses the production route/source contract. `content-audit.mjs` reports 21 selected, automatic errors 0. Its `semanticStatus: REVIEW_REQUIRED` and `publicationReady: false` remain unchanged; the human-readable author/independent/primary records supply the separate editorial decision. Automatic checks do not grant semantic approval.

Root accepts this frozen batch for integration and the already-authorized main deployment path. Build, rendered browser and actual public commit verification are separate subsequent evidence; this report alone does not claim publication. The full 49-language goal remains open after this batch.
