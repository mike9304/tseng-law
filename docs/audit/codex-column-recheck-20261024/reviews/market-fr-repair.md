# FR 675–676 bounded repair — 2026-10-24

Role: repair author `/root/market_review_fr/repair_fr_market`. This is an implementation and self-check record, not an independent editorial or legal PASS. The parent reviewer owns final review. No publication was performed.

## Frozen files

| Article | SHA256 |
|---|---|
| `src/content/columns-fr/675-french-brand-taiwan-trademark-registered-distributor.md` | `b44d351c2fee81d00853eec14f7ddb2ad94a1b547dbba642507dba591ee38ea8` |
| `src/content/columns-fr/676-french-supplier-taiwan-distributor-termination-stock-online-accounts.md` | `368fbef4c72b6b6acb971b91590564a96122c05cafeb9469d419f48666dd2b44` |

Both manuscripts are frozen for the parent's independent recheck. Only these two manuscripts and this report were written by this repair agent.

## Requested changes implemented

| Location | Before / issue | Repair | Meaning and scope |
|---|---|---|---|
| 675:36 | `Tout dépend du texte et du contexte.` repeated the paragraph's concrete inquiry into consent. | Deleted. The adjacent instructions are now `Les échanges méritent une relecture complète.` and `« Approuvé » ne suffit pas à délimiter le consentement.` | Same evidence and consent inquiry; no new legal condition. These small, related revisions restore natural variation after removing the filler. |
| 675:40 | `Le délai part de la publication.` repeated the opening of the same paragraph. | Deleted. | Three months from publication, Article 48, no postponement based on discovery, and the negotiation warning remain. |
| 675:56 | `Les originaux restent conservés.` hid the actor. | `L'entreprise conserve les originaux.` | The enterprise preparing the dossier keeps the originals. |
| 676:4 | Summary required `des documents distincts et cohérents` without a supported requirement for separate documents. | `Une marque française qui change de distributeur à Taïwan doit régler le préavis, le sort du stock et le transfert des comptes numériques.` | Removes the unsupported document-format requirement. The substantive topics remain; this limited correction is explicitly recorded, not described as merely cosmetic. |
| 676:44 | Five disconnected directions included `Le transport doit aussi être attribué.` and an unspecified written-reservations demand. | Three connected sentences identify returned lots and price, the party organizing and paying for transport, acceptance inspection and defects, and the retained-stock sale period and after-sales service. The unspecified reservations sentence is deleted. | All useful settlement subjects remain. They are framed as terms the parties may agree. No statutory duty or new remedy is added. |
| Both:6 | `lastmod: "2026-10-23"` | `lastmod: "2026-10-24"` | Published date, displayed date and source-consultation dates remain unchanged. |

## Actual CLI results

Working directory: `/Users/son7/tseng-arc-revision-20261024/repo`.

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-fr/675-french-brand-taiwan-trademark-registered-distributor.md
src/content/columns-fr/675-french-brand-taiwan-trademark-registered-distributor.md [fr] sentences=43 mean=16.9 cv=0.452 short=0.163 run3=0.049 opener_rep=0.231 cite_end=0.023 cite_para=0.538 contrast=0 caveat=0 q=4
  OK — no variety limit violated
exit 0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-fr/676-french-supplier-taiwan-distributor-termination-stock-online-accounts.md
src/content/columns-fr/676-french-supplier-taiwan-distributor-termination-stock-online-accounts.md [fr] sentences=43 mean=18.1 cv=0.45 short=0.093 run3=0.024 opener_rep=0.154 cite_end=0.023 cite_para=0.538 contrast=0 caveat=0 q=1
  OK — no variety limit violated
exit 0

git diff --check -- src/content/columns-fr/675-french-brand-taiwan-trademark-registered-distributor.md src/content/columns-fr/676-french-supplier-taiwan-distributor-termination-stock-online-accounts.md
(no output)
exit 0
```

The first minimal repair produced CV failures (675: 0.441; 676: 0.442). Subsequent adjustments remained within the two affected paragraphs. No unrelated sentence, invented fact or filler was added to satisfy a metric.

## Preservation checks

Compared the exact pre-repair text captured at this assignment's start with the frozen files above:

- Ordered external-source/mailto URL arrays are identical for both files.
- All internal links are unchanged in the affected diff.
- Body numerical-token arrays are identical for both files.
- Frontmatter excluding `summary` and `lastmod` is byte-for-byte unchanged for both files. Article 675's summary is also unchanged.
- FAQ, published date, date_display, source dates, image paths, alt/captions and internal author remain unchanged.
- The only body edits are the requested 675 paragraphs 36/40/56 and 676 paragraph 44.

## Rule 5 self-check

1. Actual per-file CLI: zero FAIL, exit 0 for both frozen versions.
2. Openings are untouched. 675 opens with the registered proprietor question; 676 opens with the three-month commercial-agent rule. Neither uses a stock hypothetical opener. The parent's broader five-article review owns the three-comparator evidence.
3. Both retain at least two very short sentences (675: seven; 676: four under the shared metric). The repaired paragraphs have no consecutive overloaded long sentences.
4. The actual body paragraph openings do not introduce a third identical starter. The repaired paragraph positions and starts remain the original `Le` and `Un`.
5. No new claim/statute/caveat sequence was introduced; both retain practical paragraphs without citations.
6. Both metric contrast counts are zero; no imaginary reader position is rebutted.
7. Final body paragraphs are unchanged and end with article-specific records/actions, not a newly added generic summary or sales line.
8. No bold, invented experience, public byline, asserted native-speaker review or asserted lawyer review was added.
9. Source links, legal article numbers, periods, scope and exceptions remain unchanged except the explicitly removed unsupported separate-document requirement in 676's summary.

## Evidence limit / next step

This agent did not repeat the parent's current-law, image or service review and does not certify those independently. Parent `/root/market_review_fr` should verify these exact hashes and repaired passages, then issue its own final editorial status. The files have not been deployed by this agent.
