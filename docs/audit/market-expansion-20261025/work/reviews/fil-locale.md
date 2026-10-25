# Filipino independent locale review — PASS

Reviewer: `/root/expand_locale_fil`; checked at `2026-10-25T13:30:30.956212+00:00`. I did not author or edit either manuscript. This is an AI editorial review, not a claim of human native-speaker or licensed-lawyer review.

No unresolved material locale finding. Titles, summary, dates, tags, all FAQs, full body, source lists, alt and captions were read for both articles. Exact source hashes below include root's canonical fictional-caption normalization. The author’s refreshed freeze and all independent evidence now agree.

## Exact reviewed versions

| Article | Full-source SHA-256 | Verdict |
|---|---|---|
| `src/content/columns-fil/926-filipino-worker-taiwan-injury-resignation-settlement.md` | `633126ec40c4f821c37e30b2610aeb2598a7c7fcc3617033960719ae2cf1bfc5` | PASS |
| `src/content/columns-fil/927-filipino-worker-taiwan-loan-promissory-note-court-order.md` | `535d60328cbcbf44ff21363a0a47a506858c8d38a4203dc5037bbe82b145d2b9` | PASS |

The prior source hashes were not silently reused: the report writer’s assertion stopped when normalization changed them. Each current caption was then read. Restoring only its previous line in memory exactly reproduces the previously reviewed full-file SHA; all body, alt and other metadata bytes are unchanged. Evidence: `fil-locale-evidence/caption-normalization-recheck.json`. Prior metric/extraction evidence remains in the `before-caption-normalization` files. Original and local CLIs were rerun on the current files.

## Resolved preparatory findings

The author applied one preparatory prose pass before freeze. No unsuccessful repair round occurred. This reviewer wrote only reports/evidence.

| Exact prior wording | Reason and rewrite | Meaning preserved |
|---|---|---|
| 926: Limitado rin ng [Artikulo 84] ang termination | Unnatural adjectival construction obscures the actor. Nililimitahan din ng [Artikulo 84] ang pagtatapos ng kontrata ng employer nang may paunang abiso. | Yes. Author applied; full grounds and affected conclusion reread. |
| 926: dalawang taong prescription / limang taong prescription | Unexplained legal English can suggest a medical prescription to the worker audience. panahon para habulin ang compensation / panahon para i-claim ang benepisyo | Yes. Body and standalone FAQ fixed; numerical periods and entitlement-based time origins retained. |
| 926: Hindi pareho ang lahat ng uri ng bayad. / May sariling mga kondisyon ang insurance. / Dito kailangang maging tiyak ang kasunduan. | MONOTONY: empty bridges — these announce a distinction without supplying it — remove and retain the concrete legal detail. Removed three filler statements. Settlement interpretation moved before the compensation details. | Yes. Full restructured article reread; actual short procedural sentences remain. |
| 927: itinanggi ... ang appeal | Awkward collocation for dismissal of an appeal. ibinasura ... ang appeal | Yes. Applied; the court disposition remains separate from appellants’ financing allegation. |
| 927: hindi sa petsa ng sasagot sa iyong inquiry | sasagot describes the person/action, making the reference to a reply date grammatically awkward. hindi sa araw ng sagot sa iyong inquiry | Yes. Applied; legal service remains the deadline trigger. |

## First-two-paragraph deletion tests

### 926

First paragraph: Deleting this loses the concrete LSA 61 result that compensation survives leaving employment and its official statutory basis. The earlier repetitive third sentence was removed. The remaining second sentence supplies authority, not an article preview.

Second paragraph: Deleting this loses the separate purposes of resignation and settlement, the question of released rights, the effect of a valid settlement under Civil Code 737, and the reason to read both papers separately. Each sentence serves the article decision.

### 927

First paragraph: Deleting this loses the exact Chinese document names and their functions, the recruitment/migration-loan context, and the two governing deadline provisions. The title alone does not explain them.

Second paragraph: Deleting this loses the envelope and delivery evidence, court/case identifiers, comparison with the pre-departure loan/note and possible difference between collector and lender. These are concrete evidential actions, not generic preparation advice.

## Three actual recent same-locale comparators

| Path / date | Concrete comparison |
|---|---|
| `src/content/columns-fil/801-filipino-caregiver-taiwan-patient-died-transfer-employer.md` / 2026-10-24 | Caregiver death and employer transfer, then permit/time-off/abuse/wage consequences. 926 instead interprets two documents for an injured factory worker; 927 identifies debt-court remedies. |
| `src/content/columns-fil/802-filipino-factory-worker-taiwan-overtime-deductions-broker-fee.md` / 2026-10-24 | A payslip introduces three questions about overtime, deductions and broker fees. Neither new manuscript repeats that three-part opening or payslip-checklist order. |
| `src/content/columns-fil/803-filipino-worker-taiwan-reported-missing-overstay-surrender.md` / 2026-10-24 | A counted absence condition leads into missing-worker reports, permits, overstay and surrender. 927 addresses debt papers and service, not the immigration consequences of a report. |

I also read the complete `src/content/columns-vi/039-taiwan-migrant-worker-occupational-injury-compensation.md` (2026-09-29). It starts with a hospitalized worker hypothetical and three compensation sources, then broad worker categories, treatment, repatriation and claims. 926 starts with LSA 61, separates two documents immediately and puts settlement interpretation first. It does not reproduce the scene or three-source outline. Common statutory authorities are expected; no originality claim is made.

## Actual measurements and section 5

The original shared CLI with `--lang fil` returned exit 2 unsupported. It is not PASS. The independently approved task-local wrapper returned exit 0 with zero HARD failures on both current full-source hashes. All 45/52 extracted sentences were displayed and read. Source tails and FAQ were independently read outside the metric.

| Article | Sentences | CV | Short share | Similar-length run | Citation endings |
|---|---:|---:|---:|---:|---:|
| 926 | 45 | 0.571 | 0.111 | 0.023 | 0.067 |
| 927 | 52 | 0.505 | 0.115 | 0.04 | 0.135 |

Wrapper SHA: `44c287ea5f6e26b694881418acebf4c9c115b87b2a965ea0c10a43fb1830e2e5`. FIL profile SHA: `9bb87f92fde0d17ec521c2c7b22e40c6eeb272f0b53405d480f07a4b5886cd66`. Independent method report JSON SHA: `f0cfcfea6e841dd0ed59df3b2727fd74bb236604d0991e124b88bceb12c3659c`.

1. Original shared CLI actually returned exit 2 unsupported, separately retained. The independently approved task-local wrapper returned exit 0 with no HARD failures on both current full-source hashes. All 45/52 extracted sentences were displayed and read.
2. No stock hypothetical opening or article preview. 926 opens on compensation surviving departure; 927 identifies two documents. Whole-batch opening-type distribution is root scope.
3. 926 has 5/45 sentences at or below 8 orthographic units; 927 has 6/52. No paragraph contains more than one sentence above 32 units. Statutory conditions in the long sentences are intact. Useful short steps and procedural limits remain after the author removed generic filler.
4. Read paragraph starts vertically. Maximum repetition is 2: kung/para in 926, kapag/kung in 927. No 3 identical starts or consecutive-start failure.
5. Citation authorities occur within sentences and at endings. No 3 consecutive claim-citation-caveat paragraphs. Both have uncited practical record-comparison paragraphs. Citation links were not trimmed for scores.
6. Automated selected contrast counts are 0; manually inspected unmarked comparisons as well. Document effects, insurance periods and court remedies require distinctions. No repeated decorative contrast or invented opposing reader position remains.
7. 926 ends with which treatment/lost-wage periods are paid and which claims remain. 927 ends with legal service controlling the deadline despite an inquiry. Required service-language limits do not replace those article-specific conclusions.
8. Professional worker-facing Filipino with familiar English work/legal terms and explained Chinese identifiers. No bold, duplicate H1, invented client/experience, public byline, human-review claim or imperative checklist headings. Korean/Japanese register requirements are inapplicable.
9. Compared repairs with affected body and FAQ: 2-year/1-year/5-year origins, conditional 40-month compensation, 10-day appeal/20-day objection/special 20-day suit, settlement validity and stay/security conditions remain distinct. Caption-only normalization was independently reverse-hashed; no body, alt or legal detail changed.

Exact commands and outputs: `fil-locale-evidence/final-checks.json`; extraction: `fil-locale-evidence/extracted-sentences.json`. The 927 formula-close heuristic is true because its last paragraph contains email guidance. Manual review accepts its necessary communication limits and concrete service-date ending; this is not a copied sales conclusion. That heuristic result was not concealed or overridden.

## Images actually inspected

| Image | SHA-256 | Observation |
|---|---|---|
| `public/images/columns/926-market-expansion-20261025.webp` | `8c3d5654ac2ce688d46c9baeb28c59c28ee243aeca9663a7ba29c62b636ecf2f` | Actual final WebP displayed: work jacket, gloves and wrist support on a factory bench; fictional injury-related still life. |
| `public/images/columns/927-market-expansion-20261025.webp` | `4dcf34091e9d67c2cc5ebb7845775e25cdab69ec4b22322947b7e2e81b2c0ca7` | Actual final WebP displayed: two plain envelopes and separate blank sheets under a desk lamp; fictional paperwork scene. |

Both images are 1536×1024, visually distinct, with no readable documents, logos, flags, faces or identifying details. Localized alt agrees with each scene. The current label “Kathang-isip na eksena” accurately marks both as fictional; no scene is presented as evidence from an actual case.

## Legal language, services and limits

926 retains the difference between leaving employment and releasing rights in a valid settlement, the two-year compensation period, separate one-year post-insurance condition and five-year claim period, and the conditional 40-month option. Current official LSA 61 and insurance 84 were directly opened for the pertinent wording. Resignation and settlement were not presented as automatically valid or void.

927 keeps 本票裁定 / 抗告 and 支付命令 / 異議 recognizable and explains their different remedies and deadlines, including the special forgery/alteration action. Direct current NCA 195 was opened and compared. Legal service, actual reading and broker handover are not equated. The full captured official 115抗306 ruling was read in the author evidence; this locale reviewer did not independently reopen that court URL. Full current-law/history certification belongs to the independent final legal reviewer.

Consultation languages were checked against `src/data/international-inquiry-copy.ts`, `src/data/en-service-scope.ts` and the current contact constant: English, Chinese, Korean and Japanese only. Filipino is guidance and communication method must be confirmed. Both articles use one email, a nonconfidential initial summary and no receipt-as-retainer promise. Public mediation/LAF guidance does not guarantee assistance. The market brief’s weak/mixed Tagalog debt search is not turned into an article claim of measured demand or clients.

- This is an independent AI locale/editorial review, not human-native or licensed-lawyer review. A separate final legal reviewer checks current law, histories and full claim/source fit.
- The original shared checker remains unsupported for Filipino. Numerical PASS is from the exact independently reviewed task-local extension only; HARD and 8/32 cutoffs were not relaxed. It is a finite heuristic, not empirical equivalence across languages.
- Reviewed assigned articles, three complete recent Filipino comparators and complete VI039. Whole-batch opening distribution and exhaustive historical duplication are outside this locale review.
- No deployment, browser rendering, hydration or interaction checks were performed by this reviewer.
