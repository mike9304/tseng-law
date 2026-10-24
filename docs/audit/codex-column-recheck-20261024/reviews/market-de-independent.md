# German market columns 679–683 — independent review

Reviewed 24 October 2026 by `/root/market_review_de`, an AI editorial reviewer. I did not author or edit these manuscripts. Scope: the five current full manuscripts, the public-original diff against `174454bd`, nearby German comparators, actual variety CLI, current official law and the site's German contact page. This is not a claim of human native-speaker or licensed-lawyer review, nor evidence of publication.

## FINAL R1 — PASS, all five articles

The separate repair author `/root/market_review_de/market_repair_de` applied the bounded repairs. I independently reread the changed passages and affected context, reran the actual CLI, checked that no original URLs were lost, and visually opened all five installed WebP files before comparing their German alt text and captions. The earlier R0 findings below are retained as the audit trail and are now resolved.

| ID | Final exact SHA256 | CV / short share / CLI | Final decision |
|---|---|---|---|
| 679 | `98a3c701d7fe864cd5d42fa07cc0a8c62e11d75cbcd579036495e87b1d9a7d8a` | 0.467 / 0.213 / exit 0 | PASS |
| 680 | `df6d39bb3536fed756ec32aead6bcc06ec486eac2a67fe2260ba1fcfcaaaef32` | 0.474 / 0.154 / exit 0 | PASS |
| 681 | `a470726770f1c6a50237585f2b3f07b2fa0f1942bd945c34da5df73a96a93dc0` | 0.450 / 0.229 / exit 0 | PASS |
| 682 | `298350abc01516a8c13cdd7d8d8ee150dd4a51549fef38a19fca8046b1ce953e` | 0.453 / 0.114 / exit 0 | PASS |
| 683 | `905cd5443c9a04b33db26e7ce2466f34e51590886c2e99e8d483eecf31a4b5a5` | 0.454 / 0.200 / exit 0 | PASS |

Independent evidence: `market-de-support/r1-four-pass.json`, `market-de-support/r1-681.json`, all five `*-variety-r1-independent.txt`, and `market-de-support/image-review.json`. Every check returned `OK — no variety limit violated`; missing original URLs = 0 for each manuscript. Published date and displayed date remain October 23; lastmod is October 24. Internal author is preserved and no public byline has been inserted into the article body or image description.

Repair resolution:

- D1: 681 now separates pre-maturity retention on insolvency from the later-delivery/later-knowledge condition affecting the contractual return obligation. Article 930's public-order/good-morals restriction remains. The paragraph does not say insolvency generally overrides every prohibition. This is recorded as substantive scope clarification.
- D2: 681 now expressly uses `vermutet` for the Copyright Act Article 37 rule. The author also identified the same compressed wording in 682 FAQ 3 and, with this reviewer's agreement, made that FAQ explicitly presumptive to match its already-correct body. This is a bounded legal-strength clarification, not an invented new rule.
- D3/D4: 681 opens directly with the payer/contracting-party/custodian distinction. The artificial two-sentence damage/transfer warning is restored to a coherent sentence. To maintain natural variation without restoring filler, the author joined the general delivery-call/pickup coordination and the immediately related conditional spare-parts/tool-retention agreement with a semicolon; both recommendations and the `bis wann` condition remain. `Ein Konzernsaldo genügt dafür nicht` and `Ob die Garantie genügt, bleibt zu klären` are shorter versions of existing concrete limitations, not new warnings.
- D5: 682's two generic tails are removed. The existing access-log limitation is phrased directly and project-end coordination now has the partners as its subject. Article 10/11 scope, evidence retention and confidential CAD handling remain.
- D6: 683 uses the natural heading `Nachweise aus der deutschen Verfahrensakte`; the repetitive translation-benefit paragraph is gone. The document-specific examples, case-dependent translations/certifications and service inquiry remain. `Jedes Anerkennungsthema erhält in der Arbeitsübersicht seine Fundstelle` refers to the suggested working overview, not a new statutory filing requirement.

Image verification against the actual installed assets:

| ID | Actual visible subject and metadata fit | WebP SHA256 |
|---|---|---|
| 679 | Workshop machine, metal workpiece, caliper and open binder; German caption identifies an illustration rather than a real test record. | `a7ef2151b3cfefaed25a00d6b30477752a94b1b86ab1a5ae15e9513c645c6baf` |
| 680 | Metal components with visibly damaged edges, separate sample bags, magnifier and caliper; sample-preservation subject matches the article. | `fc3c1ef927c63cc750b27f1ffda7b7b568ac629a94e16bbcd0bb803a4341ea92` |
| 681 | Molds and a fixture with blank tags, a wooden crate and wrapping paper on shelving; no claim of an actual supplier's warehouse. | `cab5e2dcdd503cab5a21834f364d1d8143d4d2d720420826200b772b046207c3` |
| 682 | Laptop with exploded technical drawing, physical component, paper drawings and USB stick; caption does not present the drawings as a real project. | `177a623104791746a06688fff3fb39be950b4265eac6cf61ec2ccf79e0fd8300` |
| 683 | Case folders, blank sheets and office-building model with Taipei skyline; caption does not identify a real executable asset. | `f4762f745c4ef68f8f8c56ac221758a55efccf05320782ddfcb659b022261325` |

All images have no people, identifiable private information, official seals or brand marks. The illustrations are editorial context, not legal evidence. Section 5 was repeated after repair: distinct concrete openings; useful short sentences; no unrelated condition merging; no stereotyped announcement, invented case or sales ending; current legal scope, source links and numerical conditions preserved except the two documented clarifications. No unresolved material finding remains within this independent locale/content/image review. Final legal review and production publication/readback are separate responsibilities.

## R0 decision and exact versions

| ID | Manuscript under `src/content/columns-de/` | SHA256 | Prose/legal decision | Image step |
|---|---|---|---|---|
| 679 | `679-taiwan-maschinenlieferung-fat-sat-schlusszahlung.md` | `d35adcb99b877247eb47456411a26c32593259d5a5f471d1d5b14eb28a404e1e` | PASS | PENDING root's new hero |
| 680 | `680-taiwan-bauteile-maengelruege-pruefmuster.md` | `d2bdc27e7417193dee9b69f52b1ef4549a980e928dcb93785d0a6e2fbdb2a320` | PASS | PENDING root's new hero |
| 681 | `681-taiwan-lieferant-werkzeuge-pruefvorrichtungen-herausgabe.md` | `815d56e84af1b3be19e8664b2ade58a944dd324e485307b81a9f37835b6570b1` | REQUEST_CHANGES D1–D4 | PENDING root's new hero |
| 682 | `682-taiwan-gemeinsame-entwicklung-cad-geschaeftsgeheimnisse.md` | `2a737101b06cd4e4f2e680bb17cc3af83f574f98c5cb03dd8f265f1a5e4c6a97` | REQUEST_CHANGES D5 | PENDING root's new hero |
| 683 | `683-deutsches-urteil-vermoegen-taiwan-vollstreckung.md` | `831104310c9b384912d338a3ec96db91f3d925abf77538f9462c42b0367e85ac` | REQUEST_CHANGES D6 | PENDING root's new hero |

Root is generating five images. Missing-image status is not the reason for rejecting prose. After addition, I must visually inspect each actual asset and recheck localized alt/caption, current metadata and exact manuscript hashes.

## Bounded repair findings

Line numbers below refer to R0, before image fields shift frontmatter.

| ID / file:line | Exact wording | Problem and evidence | Proposed narrow repair | Meaning |
|---|---|---|---|---|
| D1 — 681:48 | `Unter den dort genannten Voraussetzungen ist eine Zurückbehaltung auch vor Fälligkeit oder trotz der genannten Widersprüche möglich.` | The German antecedent of `genannten Widersprüche` includes all three preceding categories, including public order/good morals. Article 931(2) specifically ties its exception to insolvency arising after delivery or becoming known to the creditor only after delivery. Merely linking the qualification is too opaque for this paragraph about a contractual release promise. Current Articles 930–931 distinguish `違反公共秩序或善良風俗` from conflicts with obligations/agreements. | Keep the Article 930 statement. Explain separately that insolvency can permit retention before maturity; then state that if insolvency arises after delivery, or the creditor learns of it only afterwards, a contractual return obligation may also be overcome under Article 931. Suggested German: `Bei Zahlungsunfähigkeit kann nach [Artikel 931] auch eine noch nicht fällige Forderung ein Zurückbehaltungsrecht begründen. Wird der Schuldner erst nach der Übergabe zahlungsunfähig oder erfährt der Gläubiger erst danach davon, kann die Zurückbehaltung auch einer vertraglichen Rückgabepflicht vorgehen.` Preserve both URLs; do not claim an unlimited public-order exception. | Substantive scope clarification, not merely style. Source: current Articles 930–931, live opened 2026-10-24. |
| D2 — 681:56 | `unklar gebliebene Teile gelten nach [Artikel 37 ...] als nicht lizenziert` | Article 37(1) uses a presumption (`推定`), not an irrebuttable result. Article 682's body already correctly says `vermutet`. | `Bei unklaren Vereinbarungen wird nach [Artikel 37 ...] vermutet, dass die betreffende Nutzung nicht lizenziert ist.` Keep the preceding protected-work condition and link. | Substantive precision: preserve the statutory presumption rather than absolute legal strength. |
| D3 — 681:24 | `Wessen Name steht auf der Werkzeugliste? Und wer kann die Form tatsächlich herausgeben?` and `Für die Abholung müssen Werkzeug, Anspruch und Besitzer zusammenpassen.` | Deletion test: the concrete sentence between them already identifies the actual problem—payer, contracting party and custodian can be three companies. The two rhetorical questions and generic final slogan add no distinct condition; paragraph 2 supplies the useful identification work. | Begin with the existing `Bei einem Produktionswechsel ...` sentence and continue into the existing inventory paragraph; remove the quoted generic framing. No new anecdote or short filler needed. | Preserved; no law or fact is removed. |
| D4 — 681:54 | `Bei Schäden oder Fehlteilen zählt der Zeitpunkt des Verantwortungswechsels. Er muss später nachvollziehbar sein.` | MONOTONY: artificially split warning — the second short sentence supplies no independent thought; this was one natural sentence in the public original. | Restore the coherent original sentence: `Für Schäden oder Fehlteile muss später nachvollziehbar sein, wann die Verantwortung wechselte.` | Preserved. Rerun metrics; do not compensate with filler. |
| D5 — 682:52,54 | `Ob diese Voraussetzungen vorliegen, verlangt konkrete Tatsachen.` / `Protokolle bleiben nachvollziehbar.` | MONOTONY: generic paragraph tails — 52 already specifies comparing access logs with the authorized purpose, versions and actual use. The quoted tail repeats the need for facts. At 54 a bare assertion that records remain traceable does not say what the reader needs to retain; the preceding evidence-preservation sentence already supplies the point. | Delete both quoted sentences. Retain the Article 10/11 explanations and the concrete project-end coordination of access, return, deletion and evidence. | Preserved. No legal qualification, source or practical step lost. |
| D6 — 683:49,55 | `Aus der deutschen Akte werden einzelne Nachweise gebraucht` / paragraph beginning `Das spart unnötige Übersetzungen.` | The passive heading sounds translated. Paragraph 55 restates the targeted document preparation already explained in 51–53, adds an unqualified efficiency assertion, then repeats the non-exhaustive nature already expressed by `kommen ... in Betracht` and case-specific coordination. | Heading: `Nachweise aus der deutschen Verfahrensakte`. Delete paragraph 55; keep 51–53 with their concrete documents and qualifications. | Preserved. No statutory document requirement is removed. |

No wholesale rewrite is requested for 679 or 680. Their distinctions and warnings generally attach to a real commercial decision: agreed milestone vs. test result, contractual seller vs. factory, defect notification vs. remedy election. Do not remove these useful distinctions just because they contain a negative.

## Opening deletion test

| ID | What the first two paragraphs actually add | Decision |
|---|---|---|
| 679 | FAT record, payment trigger and potentially additional SAT; then contracting entity, local integrator and signatory authority. Each changes the collection analysis. | Keep. No announcement of the article's structure. |
| 680 | Timely seller notification despite an unfinished 8D analysis; then the choice-of-law premise and contractual characterization. | Keep. The warehouse-system point explains why an internal hold is not external notification. |
| 681 | The concrete three-company distinction and per-tool inventory are useful. The surrounding two opening questions and final slogan repeat that information. | D3 removes only the repeated framing. |
| 682 | Three cumulative statutory conditions; then the German/Taiwan joint-development context, input/result allocation and distinction between access and rights. | Keep. The short cumulative clarification can remain because it prevents an OR reading of the three conditions. |
| 683 | Taiwan enforcement permission in addition to a final German judgment; then a German case file plus identifiable debtor assets. | Keep. Neither the corporate logo nor a group affiliate address identifies an executable asset. |

## Comparison with actual German site articles

I read the openings, headings and endings of these three existing German comparators. They are not new October 23 market articles and their visible original dates are recorded honestly; many legacy files lack a `published` field. The 2025 group is tied by displayed date, so 016 was selected because it was most recently modified among that group.

1. `src/content/columns-de/018-taiwan-semiconductor-market-entry.md` — displayed 17 September 2026, lastmod 7 October 2026. Starts with market-entry operating requirements, then numbered broad structural sections and an extended consultation ending. New 679–683 have narrower transactional triggers and no numbered universal checklist. They retain the useful separate-entity issue rather than copying the whole market-entry structure.
2. `src/content/columns-de/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md` — displayed 4 February 2026, lastmod 25 July 2026. Long inventory-style opening followed by `Im Folgenden ... erläutert`; many numbered procedural headings. The new batch avoids that announcement and splits buyer decisions into topic-specific sections.
3. `src/content/columns-de/016-taiwan-inheritance-custody-analysis.md` — displayed 13 September 2025, lastmod 11 October 2026. Opening lists many separate legal regimes and announces a `Prüfreihenfolge`; numbered overview and long general disclaimer. The new batch is substantially more specific. A repeated caution sentence at the end of nearly every paragraph would nonetheless recreate the same abstract register, hence D3–D6.

Legacy source bylines are not copied into these new articles. This review does not certify the legacy comparators for law, style or their current rendering.

## Current official-source verification, 2026-10-24

All URLs below were opened live through the web tool in this review. I read the substantive Chinese text, not just a search result. No change to a current operative provision affecting these articles was found; the Civil Code and Copyright Act general uncommenced-amendment banners concern other articles. The substantive precisions requested in D1/D2 are current-source/translation corrections, not claims of a new amendment.

- 679: Civil Code [264](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=264), [490](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=490), [493](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=493), [505](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=505), plus choice of law [20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20). Reciprocal performance, advance-performance exception, good-faith partial-performance limit, cure period and excessive-cost exception, and delivery/completion payment rules are preserved.
- 680: Civil Code [258](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=258), [354](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354), [356](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356), [357](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=357), [358](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=358), [359](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=359), [360](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=360), [365](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=365). Six months from notification and five years from delivery concern rescission/reduction; intentional concealment excludes the six-month rule only. Storage/proof obligations retain the remote-delivery/no-local-agent/rejection premise. The article does not invent a fixed number of days for inspection.
- 681: Civil Code [761](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=761), [767](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=767), [928](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=928), [929](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=929), [930](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=930), [931](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=931), [937](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=937); conflict law [38](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=38), and copyright [37](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070017&flno=37). Payment is not itself the complete transfer mechanism; retained physical possession, assigned third-party return claim and prior possession are correctly distinguished. D1/D2 remain to fix.
- 682: [Trade Secrets Act 2, 4–7](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080028), [10](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080028&flno=10), [11](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080028&flno=11); Copyright Act [10-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070017&flno=10-1), [12](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070017&flno=12), [37](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070017&flno=37); conflict law [42](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=42). Joint trade-secret shares and consent defaults, commissioned creation, expression/idea distinction and nonexclusive sublicensing consent are correctly scoped. Taiwan IP is not conflated with German protection.
- 683: Taiwan CPC [402](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=402), [522](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=522), [523](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523), [526](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526); Enforcement Act [4-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010004&flno=4-1); German [ZPO §328](https://www.gesetze-im-internet.de/zpo/__328.html). Four recognition barriers, service exception, finality, Taiwan permission judgment, territorial fallback jurisdiction and separately supported attachment are retained. No automatic Germany/Taiwan reciprocity finding or EU-enforcement assumption is made.
- Histories: [Civil Code](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001), [CPC](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0010001), [Enforcement Act](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0010004), [Copyright Act](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0070017). The Civil Code banner identifies 166-1 and future 1223; Copyright pending provisions are 91, 91-1, 98, 98-1, 100, 117. None is the article being relied on here.
- Firm languages: current [German contact page](https://tseng-law.com/de/contact) identifies English, Chinese, Japanese and Korean as consultation languages. The five columns do not promise German consultation, a translator, outcomes, a German office or German-law licensure.

Evidence limit: the attempted English Article 931 URL was unavailable through the web tool; the operative Chinese Articles 930–931 were accessible and are the basis of D1. This does not certify any particular German judgment's reciprocity or case-specific claim.

## Actual variety check and section 5 manual review

Command per file: `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute manuscript path>`.

| ID | Sentences | CV | Short | Exit | Result |
|---|---:|---:|---:|---:|---|
| 679 | 47 | 0.467 | 0.213 | 0 | FAIL 0 |
| 680 | 52 | 0.474 | 0.154 | 0 | FAIL 0 |
| 681 | 52 | 0.465 | 0.269 | 0 | FAIL 0 |
| 682 | 46 | 0.476 | 0.130 | 0 | FAIL 0 |
| 683 | 53 | 0.457 | 0.189 | 0 | FAIL 0 |

Raw logs and hashes: `work/reviews/market-de-support/*-variety-r0.txt`, `baseline.json`.

Manual section 5: no stock hypothetical opening; openings differ by test record, buyer question, inventory discrepancy, statute conditions and enforcement consequence. Every article has more than two short sentences and several uncited practical paragraphs. No uninterrupted three-paragraph statute/caveat loop; however D3–D6 identify actual generic tails that metrics miss. The final substantive paragraphs tie back to a payment trigger, sample provenance, who releases each tool, safe CAD transmission, or service evidence. No bold, fake case anecdotes, public author line, exaggerated firm claim or copied marketing conclusion. Core legal URL sets remain unchanged against the public original. D1/D2 must be recorded as substantive precision. The author must rerun CLI after repairs and not reintroduce filler to recover a score.

Next bounded action: a separate author applies D1–D6 and adds the five real-image metadata entries after viewing root's assets; preserve publication/date-display values, set lastmod to 2026-10-24, preserve URLs, then return current hashes for independent recheck. No publication authority is exercised by this reviewer.
