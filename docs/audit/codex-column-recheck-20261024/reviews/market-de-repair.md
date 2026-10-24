# German market columns 679–683 — bounded repair record

Repair date: 24 October 2026. Repair author: `/root/market_review_de/market_repair_de`, an AI editorial role. This records implementation and self-checks; independent approval belongs to `/root/market_review_de`, and no publication was performed here.

Scope: the five assigned German market manuscripts and this report/supporting logs. The ARC manuscripts, shared code, image binaries, other authors' work and deployment configuration were not edited. The independent report's D1–D6 findings governed the repair. Its author also approved bringing 682 FAQ 3 into line with the Article 37 presumption.

## Current files

All paths below are under `repo/src/content/columns-de/`.

| ID | File | SHA256 | Author check |
|---|---|---|---|
| 679 | `679-taiwan-maschinenlieferung-fat-sat-schlusszahlung.md` | `98a3c701d7fe864cd5d42fa07cc0a8c62e11d75cbcd579036495e87b1d9a7d8a` | Body unchanged; image metadata installed; CLI FAIL 0 |
| 680 | `680-taiwan-bauteile-maengelruege-pruefmuster.md` | `df6d39bb3536fed756ec32aead6bcc06ec486eac2a67fe2260ba1fcfcaaaef32` | Body unchanged; image metadata installed; CLI FAIL 0 |
| 681 | `681-taiwan-lieferant-werkzeuge-pruefvorrichtungen-herausgabe.md` | `a470726770f1c6a50237585f2b3f07b2fa0f1942bd945c34da5df73a96a93dc0` | D1–D4 repaired; image metadata installed; CLI FAIL 0 |
| 682 | `682-taiwan-gemeinsame-entwicklung-cad-geschaeftsgeheimnisse.md` | `298350abc01516a8c13cdd7d8d8ee150dd4a51549fef38a19fca8046b1ce953e` | D5 and FAQ 3 repaired; image metadata installed; CLI FAIL 0 |
| 683 | `683-deutsches-urteil-vermoegen-taiwan-vollstreckung.md` | `905cd5443c9a04b33db26e7ce2466f34e51590886c2e99e8d483eecf31a4b5a5` | D6 repaired; image metadata installed; CLI FAIL 0 |

## Exact repair and legal meaning

| Finding / current line | Change and reason | Meaning |
|---|---|---|
| D1 — 681:51 | Replaced `Unter den dort genannten Voraussetzungen ... trotz der genannten Widersprüche` with `Ist der Schuldner zahlungsunfähig, erlaubt [Artikel 931] die Zurückbehaltung auch vor Fälligkeit. Wird der Schuldner erst nach der Übergabe zahlungsunfähig oder erfährt der Gläubiger erst danach davon, kann die Zurückbehaltung auch einer vertraglichen Rückgabepflicht vorgehen.` The Article 930 sentence and both links remain. | Substantive scope clarification. The first exception concerns maturity; the second now gives the post-delivery insolvency/knowledge condition and identifies the contractual-return consequence, avoiding an unlimited public-order exception. |
| D2 — 681:59 | `gelten ... als nicht lizenziert` became `für unklar geregelte Teile wird nach [Artikel 37 ...] vermutet, dass sie nicht lizenziert sind`. The protected-work condition and agreement-based scope remain. The licensing rule and its qualification stay in one coherent sentence. | Substantive precision: statutory presumption, not an irrebuttable result. |
| D2 consistency — 682:24 | FAQ 3 now says Article 37 `vermutet bei unklar geregelten Lizenzteilen, dass sie nicht eingeräumt sind`. | The same substantive precision; FAQ now agrees with the existing correct body. No change to the nonexclusive-sublicensing consent condition. |
| D3 — 681:27 | Removed the two opening questions and the closing slogan. The opening now begins `Zahler, Vertragspartner und Verwahrer können ... drei verschiedene Unternehmen sein.` | The concrete three-company distinction remains, followed by the unchanged per-item identification work. No factual condition was lost. |
| D4 — 681:57 | Restored `Für Schäden oder Fehlteile muss später nachvollziehbar sein, wann die Verantwortung wechselte.` | The responsibility-transfer point remains in a single natural sentence instead of an artificial two-sentence warning. |
| D5 — 682:55,57 | Deleted `Ob diese Voraussetzungen vorliegen, verlangt konkrete Tatsachen.` and `Protokolle bleiben nachvollziehbar.` | The actual log comparison, Articles 10/11, project-end access/return/deletion coordination and necessary evidence preservation remain. |
| D6 — 683:52,56 | Changed the passive heading to `Nachweise aus der deutschen Verfahrensakte`; removed the paragraph beginning `Das spart unnötige Übersetzungen.` | The concrete documents, case-specific qualification and coordination with Taiwan representation remain. No mandatory document requirement was deleted. |

The three operative texts were reopened live in this repair on 24 October 2026: [Civil Code Article 930](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=930), [Article 931](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=931), and [Copyright Act Article 37](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070017&flno=37). I read the Chinese provisions. The Civil Code commencement banner concerns 166-1 and 1223; the Copyright Act banner concerns other enumerated articles, not 37. The broader live-source audit remains the independent reviewer's report; this narrow repair does not pretend to repeat it.

## Additional narrow flow changes

Deleting the identified filler exposed variety failures; the unsuccessful intermediate logs are retained. No filler was restored and no unrelated legal conditions were joined. The current changes beyond the table above are:

- 681:43 connects the last-order/pickup schedule and the conditional spare-parts storage agreement: `Letzter Lieferabruf und Abholtermin sollten aufeinander abgestimmt werden; soll der bisherige Hersteller noch Ersatzteile liefern, braucht es eine Vereinbarung darüber, welche Werkzeuge bis wann dort bleiben.` This follows the independent reviewer's suggestion to connect one practical planning issue. The general schedule recommendation remains general; the storage agreement remains conditional on further spare-parts supply. `bis wann` preserves a separately agreed retention period.
- 681:49 shortens `Ein Konzernsaldo genügt für diese Zuordnung nicht` to `Ein Konzernsaldo genügt dafür nicht`. The preceding required claim particulars are unchanged.
- 681:53 replaces the nominal `Die Eignung einer konkreten Garantie bleibt zu klären` with `Ob die Garantie genügt, bleibt zu klären`. The adequacy question and the need to resolve it remain.
- 682:55 states the same evidential limit directly: `Das Zugriffsprotokoll allein belegt noch keinen Missbrauch.`
- 682:57 gives the project partners the action: `Zum Projektende sollten die Partner Zugriffssperren, Rückgabe, vertraglich geschuldete Löschung und die notwendige Beweissicherung aufeinander abstimmen.` `sollten`, the contractual deletion qualifier and necessary evidence preservation remain.
- 683:56 states the document mapping directly: `Jedes Anerkennungsthema erhält in der Arbeitsübersicht seine Fundstelle.` No new document requirement or efficiency claim was introduced.

## Five actual images

I opened each installed WebP with `view_image` before writing the German alt text and caption. These are topic illustrations, not evidence photographs. No visible person, identifiable party, official seal, readable document or author attribution was added. The measurement tool markings and schematic drawing lines are part of the illustrated objects.

| ID | `featured_image` | Visible subject and caption boundary |
|---|---|---|
| 679 | `/images/columns/679-market-review-20261024.webp` | Milling machine/workpiece, caliper, folders; caption says the pictured materials are not actual test records. |
| 680 | `/images/columns/680-market-review-20261024.webp` | Components with damaged edges, individually bagged samples, magnifier and caliper; caption excludes documentation of a concrete defect. |
| 681 | `/images/columns/681-market-review-20261024.webp` | Moulds, fixture, blank tags, wooden crate and packing paper; caption excludes an actual supplier warehouse photograph. |
| 682 | `/images/columns/682-market-review-20261024.webp` | Laptop with an exploded technical drawing, component, paper drawings and USB stick; caption says these are not actual project documents. |
| 683 | `/images/columns/683-market-review-20261024.webp` | Files, blank paper and office-building model with Taipei in the background; caption does not identify any particular executable asset. |

The repository actually reads `featured_image`, `featured_image_alt`, and `featured_image_caption` (`src/lib/columns.ts:415–418`); those exact fields were used. Binary image provenance is root's `work/images/market-prompts.json` and `work/checks/market-images.json`. Local image hashes also appear in `market-de-repair-support/preservation-final.json`.

## Verification and section 5 self-check

Command for each current manuscript:

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute manuscript path>`

| ID | Sentences | CV | Short share | Exit | Log under `work/reviews/market-de-repair-support/` |
|---|---:|---:|---:|---:|---|
| 679 | 47 | 0.467 | 0.213 | 0 | `679-variety-r1-current.txt` |
| 680 | 52 | 0.474 | 0.154 | 0 | `680-variety-r1-current.txt` |
| 681 | 48 | 0.450 | 0.229 | 0 | `681-variety-r2.txt` |
| 682 | 44 | 0.453 | 0.114 | 0 | `682-variety-r1-current.txt` |
| 683 | 50 | 0.454 | 0.200 | 0 | `683-variety-r1-current.txt` |

Manual section 5: the openings start with a test record, an actual buyer question, distinct transaction participants, cumulative statutory conditions, and enforcement consequences. The 681 opener deletion removed only repeated framing. All five retain multiple short sentences and uncited practical paragraphs. Paragraph starts do not exceed the checker's repeat limit. No three-paragraph statute/caveat loop or added contrast slogan was introduced. The final practical passages remain tied to the payment-trigger test, sample provenance, person releasing each tool, safe CAD transmission, and service evidence. German register is consistent; there are no new bold spans, invented experiences, fake bylines, promotional promises or imperative checklist headings.

Preservation check: all original URL sets, body numeric tokens, titles, SEO titles, summaries, internal author, `published` and `date_display` values are unchanged. `lastmod` alone changes to `2026-10-24`; the published date stays 23 October. Original source-check dates remain as historical dates, with the new live verification recorded above. Bodies 679 and 680 are byte-for-byte unchanged. Exact before/current diffs and preservation receipts are in `market-de-repair-support/`.

Evidence limits: these are local source, image and command checks. The repair author cannot certify its own independent review, native-speaker status, lawyer review, browser rendering or publication. All five current hashes were handed to the independent reviewer; final readiness is governed by its latest report and the separate final reviewer.

Independent handoff update: `/root/market_review_de` confirmed all five exact current hashes, images and metadata as FINAL R1 PASS, including a separate actual CLI run for 681. The report is `work/reviews/market-de-independent.md`. This records that external reviewer decision; it is not a self-certification. No manuscript changes followed that decision.
