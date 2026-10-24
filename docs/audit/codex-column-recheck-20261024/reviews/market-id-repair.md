# Indonesian market columns — bounded author repair

Repaired on 2026-10-24 by `/root/market_review_id/market_id_repairs` under the tseng-law-editorial workflow. This is an author repair record, not an independent PASS, human/native-speaker review, attorney review, or publication record. Only the three assigned manuscripts and this agent's support records were changed. Other contributors' work was preserved.

## Applied findings

- I1, 665:43: deleted only the two closing scope/warning sentences beginning “Artikel ini tidak menetapkan…” and “Biaya yang sah…”. The paragraph retains Article 40's prohibited-fee rule and the instruction to examine named charges against the agreement and applicable rules. The following debt/disputed-document paragraph still reads coherently. No fee cap, prohibition, condition, or source was removed.
- I2, 667:52: removed the opening and closing generic cautions. Retained the two concrete middle sentences, the MOL link, the Labor Standards Act exclusion for domestic caregivers, and separate possible compulsory insurance coverage under Article 6. This remains coherent after the insurance-status evidence paragraph.
- I3, 668:40: replaced the possibility wording with exactly: “Jika pembeli lalai memberi tahu, barang dianggap telah diterima, kecuali cacat itu tidak dapat ditemukan melalui pemeriksaan biasa.” The following hidden-defect prompt-notice rule remains unchanged. This is substantive legal precision, not merely a stylistic edit: the statutory deemed-acceptance effect and ordinary-inspection exception are explicit.

I3 was checked directly against the [current official Civil Code Article 356](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356) opened on 2026-10-24. Paragraph 2 states the deemed-acceptance effect with the ordinary-inspection exception; paragraph 3 requires immediate notice when a previously undiscoverable defect is later found. The page's pending-commencement notices concern Articles 166-1 and 1223, not Article 356. Broader legal/source review remains the independent reviewer's responsibility.

The three files' `lastmod` changed from 2026-10-23 to 2026-10-24. Publication date, `date_display`, source-review footer date, original provenance, FAQ, image data, titles, and all other metadata were preserved. No text was added to manipulate metrics.

## Exact versions and checks

Executed the actual shared command for each file:

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute-file-path> --lang id`

All returned exit code 0 and `OK — no variety limit violated`.

| ID | SHA256 | Sentences | CV | Short ratio | Run3 | FAIL |
|---|---|---:|---:|---:|---:|---:|
| 665 | `4d19c4da1bd422009f2bb794f27b25da1c1c8d52bce8884e6da58e6d023c23ff` | 46 | .455 | .174 | .068 | 0 |
| 667 | `932021416ab740639d9694170c2b6e7e1f8bd128dd3fda884b5510ddd0bef80b` | 51 | .506 | .216 | .041 | 0 |
| 668 | `28ce6c33da7a45f1ae6c156729ae4028904dbe25b91b9a8eeb0d7c0c0976135d` | 58 | .463 | .259 | .036 | 0 |

Support directory: `work/reviews/market-id-repair-logs/`. Each ID has its exact command/output in `<id>.variety.txt`, minimal before/after diff in `<id>.diff`, and a saved pre-repair manuscript. `before.json` and `manifest.json` record hashes and preservation checks. URL sequences and body numeric-token sequences are identical before/after for all three. Metadata comparison confirms `lastmod` is the only frontmatter change.

Section 5 author self-check: full assigned texts and affected surrounding paragraphs were read. Their original question/evidence/deadline openings, useful short sentences, and case-specific final actions are retained. The deletions remove generic warnings without adding new openers or contrast structures. No claim/citation/caveat triplet was added, and practical evidence paragraphs without citations remain. No bold, invented experience, byline, checklist heading, or sales language was added. The actual command confirms opener, short-sentence, repetition and other measured limits; it does not replace the separate independent prose review.

Ready for the independent reviewer's latest-hash recheck of I1/I2/I3 and affected conclusions. No publication, build, public rendering, or final approval was performed by this repair author.
