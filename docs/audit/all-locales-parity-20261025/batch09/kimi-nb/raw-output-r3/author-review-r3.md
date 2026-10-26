# Author revision review R3

## Scope and supplied findings

I read `TASK-R3.md` in full and reread the six current R2 drafts. The corrections implement the primary's independent meaning and language findings. The task states that the primary's actual R2 shared checker passed all six; I did not run a new shared checker, calculate substitute CV metrics, or create post-edit metrics. The primary will perform the next shared run and independent re-review.

I did not open the Norwegian court-language guidance or dictionary entry mentioned in the task. They were supplied as the primary's language-review provenance, not as new sources consulted by me. No browsing, fresh legal verification, native-speaker approval, publication, or deployment occurred.

## Legal meaning corrections

### 915

The summary and opening now identify the public procuring agency as the party that sued and obtained annulment. The NT$44,417,150 award had favored the contractor, and the contractor subsequently appealed. This corrects the R2 draft's reversed account of who brought the annulment suit.

The Supreme Court appeal outcome now uses `forkastet`, and the procurement heading now refers to planned Taiwanese procurements and US suppliers. The statutory arbitration conditions, claim chronology, finality, ITA body scope, case source, and all URLs remain unchanged.

### 916

FAQ2 and the body now distinguish three things accurately: the portions concerning 246 claimants were vacated and sent back for further proceedings; the appeals concerning 262 claimants did not succeed; and further proceedings were needed because of shortcomings in the analysis of injury, evidence, and authority to pursue claims. `Sendte dem tilbake til ny behandling` no longer confuses remand with refuting an argument.

The later paragraph preserves the point that remand did not negate everyone's claim and that the broader dispute and underlying claims were not finally disposed of. Only the trailing clause about who filed every appeal was removed. `Anker som gjaldt` continues to preserve the group scope.

The summary now describes documented decisions as evidence of how findings were followed up. The rewritten acquisition paragraph connects report recipients, operational authority, and later transfer approvals without creating a statutory record-keeping duty. Article 154's conditions and the USTR limitations are unchanged.

### 918, 920, and 921

The 918 appeal and additional claim are described as unfounded on the merits. The payment-default assertion uses `førte derfor ikke frem`. The 920 appeal uses `forkastet`, and the editorial qualifier `nøytralt` was removed without assigning an argument to an unidentified party. The 921 appeal and cash-refund claim now use `førte ikke frem`.

These wording changes describe the Taiwanese outcomes without importing Norwegian procedural grounds. Courts, dates, case identifiers, finality limits, and substantive analysis remain intact.

## Bounded Bokmål and clarity corrections

- 919 now uses `rekkefølgen`.
- 920 now uses `parkeringsdekket`.
- The 921 summary uses `Myntene` and expressly says `ubrukte betalte poeng eller ubrukte spillavgifter`.
- The 921 body and FAQ1 describe the remaining coins as having the function of competitive chips. They do not say all coins were consumed.

The revised summaries and FAQ answers are substantive logged edits, not byte-unchanged metadata. All 17 FAQs remain present.

## Exact log and restoration verification

`output/edits-r3.json` contains all 19 successful local edits in chronological order, with exact old and new strings, reasons, and `meaning_preserved`. In that field, `true` means the revision preserves or correctly restores the authoritative source-supported meaning. For 915, it does not mean preservation of the R2 draft's erroneous party description; that error was intentionally corrected.

Verification was performed locally without a prose-metric substitute:

- Reverse-applying each file's R3 edits restored its exact R2 SHA-256 hash.
- Reapplying the edits forward to that restored R2 text reproduced the current R3 file byte-for-byte.
- Official URL sets were identical between R2 and R3 for every article.
- FAQ counts remained 2 + 3 + 3 + 3 + 3 + 3 = 17.
- `author-review.md`, `author-review-r2.md`, and `edits-r2.json` retained their pre-R3 hashes and are unchanged.

The exact edit counts are 4 for 915, 5 for 916, 2 for 918, 1 for 919, 3 for 920, and 4 for 921. No unlogged article changes were found by the forward and reverse restoration checks.
