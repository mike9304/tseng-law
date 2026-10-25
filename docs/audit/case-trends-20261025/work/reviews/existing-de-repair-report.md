# Existing German columns — bounded repair record

2026-10-25. Repair author: `/root/repair_existing_de`. Independent reviewer: `/root/recheck_market_changes`. This is an author repair/self-check report, not independent approval or proof of publication.

Scope: current full manuscripts 679, 681 and 683 in `src/content/columns-de/`, their diff from `a188e620ee7eebc3f2188829e2c318904802ef7d`, and the earlier `market-de-independent.md`. Other files and other agents' work were preserved. No commit or publication was performed.

## Exact candidates and bounded outcome

| Article | SHA256 | CV / short share | State |
|---|---|---|---|
| 679 | `8479b85121a74268424ebfa465618ff8758f86bce50d69f3ed65c0988938f725` | 0.457 / 0.229 | LOCAL CHECKS PASS; independent review pending |
| 681 | `3b362929c31af4d05abce635f63ebd73244af7482b04ffe6f06e7eec91ab7eeb` | 0.462 / 0.234 | LOCAL CHECKS PASS; independent review pending |
| 683 | `ca115b304e91b378b15785da3b439c61bb388ed45b14b550d6a3733ed0767fb7` | 0.441 / 0.167 | HELD — REQUEST_CHANGES; two failed passes |

679 passed after the first repair. 681 passed after the second repair. 683 failed CV after both targeted passes (.401, then .441); its original repeated-start defect was resolved, but the article is not ready for publication. No third repair was attempted. Root will decide separately whether to restore the previously approved baseline body. The held full text is saved as `existing-de-repair-683-r2-REJECTED.md`; it is the exact current 683 SHA listed above as of this report. Root has been told that any baseline restoration will invalidate that working-file identity and requires its own record.

Evidence:

- `existing-de-repair-r1-variety.json`: actual first-pass command, exit, stdout, stderr and SHA.
- `existing-de-repair-r2-variety.json`: actual final commands and results; 679/681 exit 0, 683 exit 1.
- `existing-de-repair-integrity.json`: metadata, links, body numbers, short-sentence examples and paragraph-length checks.
- `existing-de-repair-{679,681,683}-before.md`: untouched pre-repair snapshots.
- `existing-de-repair-{679,681,683}-r2.diff`: exact repair diff against each pre-repair snapshot.

The actual CLI was `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute article path> --lang de`. Both passing files returned `OK — no variety limit violated`; 683 returned `FAIL len_cv=0.441 (limit >= 0.45)`. `git diff --check -- <the three owned paths>` exited 0 with no output.

## Changes and preserved meaning

| Article / passage | Before | Repair and purpose | Meaning |
|---|---|---|---|
| 679, test-readiness paragraph | Five similarly sized explanatory sentences around `Ein angekreuztes „bestanden“ oder „nicht bestanden“ ...` | `Das Kreuz im Ergebnisfeld genügt dafür nicht.` separates the result field from test readiness. The protocol sentence then connects the test configuration to abnormal utilities/materials and their time/source documentation. | The same software version, workpieces, tolerances, operating conditions, missing utilities, different input material, timing and information provenance remain. Responsibility still follows the agreed allocation. No legal duty was added. |
| 681, second paragraph | `Hilfreich ist eine Liste ... und zwar auch für ...` | Restored the concrete procurement action and a separate inventory requirement: `Einsätze, Ersatzformen und Prüfvorrichtungen sind einzeln aufzuführen.` | Each tool, insert, spare mold and fixture still needs identification; serial number, location, last confirmed allocation, later replacement parts and subcontractor-held items remain. This restores an existing practical recommendation. |
| 681, Article 761 paragraph | Two sequential sentences describing substitutes for delivery | Joined the two closely related alternatives with a semicolon: retention by transferor versus possession by a third party. | The conditions remain alternatives, not cumulative requirements. Indirect possession by agreement, assignment of a third-party return claim and the separate prior-possession rule are preserved. |
| 681, data handover paragraph | `... sind eine eigene Frage.` | Restored `Kalibrierdaten, Steuerungssoftware und Zeichnungen werden separat erfasst.` | Concrete recording replaces an abstract announcement; the protected-work condition, Article 37 presumption and distinction between physical tool and file permissions are unchanged. |
| 681, first inquiry | Two separate sentences for initial details and prior language/transmission coordination | Connected those two stages in one sentence. The narrow initial information and four actually offered languages are unchanged. | No German-language service or confidential-email transmission was promised. |
| 683, recognition documents | `Für jedes Anerkennungshindernis sollte feststehen, welches Dokument es belegt.` | `Für jeden Prüfungspunkt sollte feststehen, welche Unterlagen ihn betreffen und ob weitere Nachweise fehlen.` | Removes an unintended suggestion that the creditor must establish an obstacle to recognition. It is a neutral working-document recommendation, not a new allocation of legal burden. Reviewer specifically requested this clarification. |
| 683, other held changes | Repeated `Ein` / `Die`, generic attention sentence, indirect final question | Direct identification wording; Taiwan/EU distinction joined under Article 4-1; removed the unsupported emphasis `verlangt besondere Aufmerksamkeit`; final question stated directly; inquiry details and language coordination connected. | No statutory prerequisites, service exception, finality requirement, asset qualification, reciprocity guarantee or attachment standard changed. These changes remain held because CV did not pass. |

All three files retain the complete ordered URL sequence (679: 11; 681: 17; 683: 16 occurrences) and the complete sequence of body numbers. Frontmatter is byte-identical except `lastmod: 2026-10-25`; title, summary, published/display dates, author, FAQ, image path, image alt and caption were preserved. No foreign-law proposition was newly introduced.

## Current source check for the touched legal wording

Opened and read on 2026-10-25:

- [Taiwan Civil Code Article 761](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=761): delivery, prior possession, agreement for indirect possession, and assignment of a third-party return claim. The page's uncommenced-amendment banner concerns Articles 166-1 and 1223, not Article 761.
- [Taiwan CPC Article 402](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=402): final foreign judgment and the four nonrecognition grounds, including the service exception. The new neutral documentation sentence makes no claim about burden of proof.

The previous independent report's law review was read for context. This narrow repair does not claim to have freshly reopened every unchanged source. The parent independent reviewer owns the broader current-source and final approval decision.

## First-two-paragraph deletion test

- 679: the first paragraph distinguishes the FAT record, contractual payment trigger and an additional SAT. The second identifies the debtor, integrator and signatory's authority. Deleting these sentences would remove separate evidence/contract conditions. Opening text was retained.
- 681: the opening identifies payer, contracting party and custodian as potentially three different companies. The second paragraph gives the per-object inventory, expressly includes inserts/spares/fixtures and explains the gap left by a blanket paid-tools description. No deletion leaves equivalent information; the original short inventory sentence was restored.
- 683: the opening preserves the separate Taiwanese enforcement-permission judgment and recognition requirements. The second separates the German case file from identified debtor assets; a group logo/affiliate address does not establish the necessary attribution. The held repair clarifies that distinction without adding an anecdote.

## Three recent German comparators

Read the actual openings, headings and endings of all three October 24 articles:

- `src/content/columns-de/704-taiwan-arc-first-application.md`: deadline-first opening, process-specific headings and card-data checking as the ending.
- `src/content/columns-de/705-taiwan-visa-residence-work-study-family.md`: work-activity question, separate visa/residence decision makers, and confirmation of the travel purpose before booking.
- `src/content/columns-de/706-taiwan-arc-renewal-changes-reentry.md`: continuing ARC expiry despite contract renewal; event-specific reporting/re-entry headings and the next triggering date at the end.

679/681/683 keep transaction-specific openings and endings rather than importing the immigration procedure structure. No universal introductory promise or numbered checklist was added. The first sentences of all three assigned market articles are unchanged; whole-batch opening-type distribution was not altered or independently certified in this narrow assignment.

## Sentence-variety rule section 5 self-check

1. Actual CLI: 679 and 681 have zero FAIL; 683 is explicitly held for its CV FAIL.
2. No stock hypothetical opener; original first sentences retained. Batch-wide distribution is outside this narrow repair.
3. At least two meaningful short sentences in every candidate. Examples: 679 `Originaldateien bleiben erhalten.` and `War die Maschine testbereit?`; 681 `Eigentum allein erlaubt keinen Zutritt zur Fabrik.` and `Ein Konzernsaldo genügt dafür nicht.`; 683 `Benötigt wird der vollständige Entscheidungstext.` and `Gegenseitigkeit ist eine Rechtsfrage.` Every paragraph has at most one sentence at the checker’s 32-word long-sentence threshold.
4. No paragraph-opener-count failure; the repeated-sentence-start failure in 683 is resolved.
5. No three consecutive claim/citation/caveat paragraphs; each has uncited practical-documentation paragraphs. Citations remain attached to their legal claims.
6. No newly introduced rhetorical contrast; checker contrast count is 0 in all three.
7. Last body paragraphs concern the open payment test (679), actual release/handing-over party (681), and proof of service (683). Necessary source/disclaimer tails remain separate.
8. No bold markup, invented first-person experience, fictional case or instruction-checklist heading. German professional register retained; Korean/Japanese register tests do not apply.
9. All ordered links, body numbers, legal exceptions, uncertainty and internal metadata preserved. The 683 documentation wording is expressly a clarification of a misleading inference, not a disguised burden change.

No publication, image rendering QA, full-site build or independent final approval is claimed here. The installed image fields were preserved without new visual assertions.
