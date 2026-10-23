# ES locale review r1 — 689–693

Reviewed on 2026-10-23. Reviewer: independent AI Spanish editorial reviewer for readers in Spain; did not author or edit these articles. This record does not claim human native-speaker status, legal qualification, final legal approval or publication. Ownership: this report only.

Latest status: the two required repairs were independently verified in [es-locale-r2.md](es-locale-r2.md). All five current versions pass locale review. The r1 findings and original hashes below remain as the review history.

## Verdict and reviewed versions

Two bounded wording repairs are requested. No material legal/factual error was identified in the passages checked against the official texts below. Articles 691–693 pass this locale review; the independent final legal review and publication checks remain separate.

Paths below are relative to `repo/src/content/columns-es/`.

| Article | Locale verdict | SHA-256 of reviewed file |
|---|---|---|
| `689-spain-exporter-taiwan-unpaid-invoices.md` | REQUEST_CHANGES — clarify the object preserved in the summary | `5e92224292e207a9c3b1f2d91ccef3e84b8f203f3d8ff19525d571ef71b0ac84` |
| `690-spain-buyer-taiwan-defective-goods-notice.md` | REQUEST_CHANGES — replace the unclear comparison in the opening | `422c679f2c8dfb27c37e4b1e49f75afbf1bb84e4799488743194119ce2456bb4` |
| `691-spanish-judgment-taiwan-assets-enforcement.md` | PASS | `415d039d1ca7a2c1436bf5ef1c7023ed2e46df3cc3ff1e73f0d655789eafcf07` |
| `692-return-spain-unpaid-taiwan-wages.md` | PASS | `a668300e4fa2a60df774c735aa10e8de550112ec98e84b4db1b31ea1fbcc0b1b` |
| `693-spain-resident-taiwan-divorce-property.md` | PASS | `490509a4df6a019885a31f72ce28d67226a21bb4a152562f75c3a94ffa71c9d7` |

These are the actual frozen files, matching `work/es-author.md`. An earlier `content-audit.json` snapshot contained subsequently removed opening sentences; it was not used as the reviewed version.

## Required wording repairs

| File:line | Exact sentence | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| `689-spain-exporter-taiwan-unpaid-invoices.md:4` | «Una exportadora española necesita identificar al deudor, conservar la entrega y comprobar la ley aplicable antes de elegir entre requerimiento, orden de pago y demanda en Taiwán.» | `Conservar la entrega` makes the event itself the object of preservation. The body correctly asks the exporter to preserve evidence of delivery. The summary needs to state that object expressly. This is a clarity repair, not a change to the collection routes. | «Una exportadora española necesita identificar al deudor, conservar la prueba de la entrega y comprobar la ley aplicable antes de elegir entre requerimiento, orden de pago y demanda en Taiwán.» | Yes. Adds the omitted object `prueba`; no legal condition, period or remedy changes. |
| `690-spain-buyer-taiwan-defective-goods-notice.md:23` | «El ensayo del laboratorio puede tardar más que el aviso al proveedor. Una empresa española que ya ha detectado un defecto no debería dar por supuesto que dispone de todo ese tiempo para comunicarlo si su compra se rige por el Código Civil taiwanés.» | The comparison literally says a laboratory test takes longer than giving notice. That does not express the intended conflict between awaiting a report and communicating an already discovered defect. `Todo ese tiempo` then refers to an unstated duration. Retain the useful situation and the Taiwan-law condition, but make the temporal relationship explicit. | «El informe completo del laboratorio puede seguir pendiente cuando ya se ha descubierto el defecto. Si la compra se rige por el Código Civil taiwanés, una empresa española no debería dar por supuesto que puede aplazar el aviso al vendedor hasta recibir ese informe.» | Yes. Preserves an already discovered defect, a pending laboratory report, the Spanish business reader and the conditional application of Taiwan law. Adds no numeric deadline and leaves the article 357 exception in the body unchanged. |

These are the complete required changes from this review. No filler sentence is requested to increase a metric.

## Optional wording, not blockers

| File:line | Exact sentence or span | Reason | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| `689-spain-exporter-taiwan-unpaid-invoices.md:55` | «la fecha exigible de la factura más antigua pendiente» | `Fecha de vencimiento` is the ordinary Spanish collocation and is already used correctly elsewhere in the article. | «la fecha de vencimiento de la factura más antigua pendiente» | Yes. The earlier legal explanation still controls when each claim becomes exercisable. |
| `691-spanish-judgment-taiwan-assets-enforcement.md:29` | «una resolución extranjera firme no se reconoce en cualquiera de estos supuestos» | Understandable, but `cuando concurra cualquiera` makes the alternative grounds more immediate. | «una resolución extranjera firme no se reconoce cuando concurra cualquiera de estos supuestos» | Yes. Preserves the OR relationship between the four grounds. |

The proposed recommendation heading `Artículos recomendados para lectores de España` is natural Spanish and fits this market section. `Lectores en España` would emphasize residence, but the existing proposal needs no correction.

## First-two-paragraph deletion test

The opening two paragraphs of every file were read sentence by sentence. The following judgments use the actual frozen text, not an earlier author draft.

| ID | Opening test and retained information |
|---|---|
| 689 | P1 sentence 1 supplies the trade-name/legal-entity discrepancy; sentence 2 turns it into a concrete comparison of contract, order and recipient. Removing either loses the factual trigger or the action tied to it. P2's three sentences respectively give party choice/closest connection, explain why the buyer's location alone does not decide the issue, and connect limitation to the law governing the relationship. All three should remain. No generic introductory promise appears. |
| 690 | P1 contains useful laboratory/discovery timing, but the current first sentence does not state that relationship precisely; the replacement above preserves the useful facts without the vague comparison. P2 sentence 1 confines the article to B2B transactions; sentence 2 gives the contract/law inquiry and article 20 basis; sentence 3 excludes origin of shipment as a sufficient choice-of-law answer. All are useful and should remain. |
| 691 | P1's first sentence identifies the European-certificate misconception relevant to this Spain-specific article; the second gives the EU member-state scope supporting that limit. P2 gives the Taiwan permission-judgment requirement and then identifies finality/service evidence. Deletion would remove either a legal boundary or the corresponding document task. |
| 692 | P1 distinguishes losing access to company email, the records that connect pay to work and the limit to legitimately held copies. Each sentence contributes a different practical or privacy fact. P2 limits the statutory scope, identifies assignment/multiple-employer/contractor complications and explains the brand/legal-employer distinction. This avoids presenting every Spanish expatriate arrangement as the same Taiwan employment relationship. |
| 693 | The question asks which law a Taiwan court uses for matrimonial property, not merely how to obtain a divorce. Its short answer identifies nationality, domicile and agreements. P2 supplies the missing chronological dimension—marriage, residence, separation and proceedings—and asks for a document inventory without assuming Spanish law from residence. The repeated references to nationality/domicile serve the legal inputs and the dated evidence record; they do not justify deleting a legal premise. |

## Comparison with three recent Spanish articles

All three comparison files have local frontmatter `published: 2026-10-22`. Their openings, section headings and final prose were read directly. These are repository versions, not newly verified public HTTP versions.

| Comparator below `repo/src/content/columns-es/` | Observed pattern | Comparison with this batch |
|---|---|---|
| `656-taiwan-one-shareholder-limited-company-director.md` | Opens with «¿Quién vigila…?»; sections revolve around number of administrators, corporate shareholder, supervision and investment authorization. Closing repeats attorney identity and two addresses. | 693 is also a direct reader question, but its question concerns governing law and its sections follow divorce law, matrimonial choice, title and a residual claim. 689 begins with debtor identity rather than a question. No new article copies the company-law structure or the lengthy identity/address ending. |
| `657-taiwan-spanish-document-legalization-taipei-office.md` | Opens with apostille/Taipei-office contrast; headings concern Ministry review, document paths, charges and translation. | 691 uses another genuine cross-border boundary, but then examines judgment grounds, service, finality and assets. It links to 657 for document authentication instead of reproducing its chain or fees. It expressly avoids treating legalization as recognition. |
| `658-taiwan-bail-local-surety-cash-deposit-family.md` | Starts with overseas money/local surety and follows criminal procedural stages. The closing ties release to receipt of the bond or money. | The new pieces use equally concrete documents or events but address distinct commercial, labor and family decisions. Their endings identify the oldest invoice, the delivery/discovery/notice dates, service/finality evidence, the oldest unpaid payroll item or the residence/asset chronology. They do not repeat bail or a generic conclusion. |

Spain usage is appropriate: `albaranes`, `abonos`, `nóminas`, `registro de jornada`, `finiquito`, `capitulaciones`, `rebeldía`, `firmeza`, `caución` and `reclamación de cantidad`. The body does not import a Spanish court procedure as if it were Taiwan law. No sweeping Latin American audience language was added.

## Legal meaning and official spot-checks

The research ledger was read for the five assigned briefs and claim boundaries. These official pages were additionally opened during this review on 2026-10-23:

- [Civil Code article 1030-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1030-1): confirmed residual difference, exclusions, discretionary adjustment, the two-year knowledge trigger and five-year termination trigger. The current wording is `有失公平`; it does not contain the older `顯失公平`. Consequently 693's `si resulta injusto` must not be “corrected” to a stricter threshold on the basis of an older recollection.
- [CPC article 402](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=402): all four refusal grounds and the default-service exception are retained in 691. Neither European origin nor Spanish reciprocity is presented as automatic recognition.
- [Civil Code article 365](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=365): 690 correctly distinguishes notice from exercise of rescission/price reduction, six months after notice from five years after delivery, and the intentional-concealment exception limited to the six-month rule.
- [Foreign-elements Act article 48](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=48): 693 preserves the written-choice restriction, default connecting factors and special situs rules for immovable property.
- [Labor Incident Act article 38](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010064&flno=38): 692 describes an employer-consented-work presumption, not automatic payment of all claimed overtime.
- [Labor Standards Act article 30](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=30): the five-year attendance retention, minute-level daily record and worker-copy entitlement match 692. The separate limitation discussion does not derive a universal filing period from that record rule.

The database pages show a compilation cutoff of 2026-10-16. The retrieval date is not a claim that the laws were amended that day. The Civil Code's future commencement notice concerns provisions not used by these articles. Full source/effective-date certification remains with the independent final reviewer; this locale review did not independently reopen every linked provision.

No FAQ/body contradiction was found. There are three FAQs per article. Source headings, check date and internal provenance remain. One contact route per article states EN/ZH/JA/KO communication and does not promise Spanish consultation or Spanish-law qualification. Initial summaries exclude sensitive full records; document-preparation lists do not instruct immediate transmission of confidential originals. No invented case, first-person practice experience, public author attribution or outcome guarantee appears.

## Required variety CLI and section 5 recheck

Actually executed for each frozen article:

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute-article-path>
```

Every execution exited 1 and selected `[ko]`; Spanish is not supported by the shared CLI. No `--lang en` workaround was used. This is not a native Spanish FAIL-0 result.

| ID | Actual CLI findings | Read-only ICU Spanish diagnostics: CV / short share / similar-length triplets |
|---|---|---|
| 689 | `len_cv=0.431`, `short_share=0.0` FAIL | `.433 / .098 / .077` |
| 690 | `short_share=0.0` FAIL | `.513 / .146 / .051` |
| 691 | `len_cv=0.424`, `short_share=0.0` FAIL | `.446 / .135 / .057` |
| 692 | `short_share=0.0`, `consec_same_start=3` FAIL | `.463 / .227 / .024` |
| 693 | `short_share=0.0`, `consec_same_start=3` FAIL | `.459 / .116 / .073` |

ICU diagnostics were independently rerun against the frozen bytes by loading only the read-only `styleDiagnostics` function from `work/check-content.mjs`; its output-writing entry point was not executed. There are no paragraph opening words used more than twice. Consecutive identical two-word starts: 0/0/0/1/0. The diagnostic excludes genuine statutory/document lists; 691's 604 prose-only words therefore do not represent its complete 738-word body.

Manual section 5 findings:

1. The unsupported-language CLI limitation remains explicit. No Spanish numeric certification or silently altered shared tool.
2. Openings vary between identity discrepancy, test/notice timing, European scope, lost record access and a reader's law-selection question. No fictional client scene or stock hypothetical opener.
3. Every file has at least two substantive short sentences. Examples: 689 «No todas vencen juntas» and «Un grupo puede incluir varias sociedades»; 690 «Esa intención necesita sustento» and «Excluye las disminuciones insignificantes»; 691 «Una fecha dudosa debe quedar señalada» and «Una decisión favorable puede ser todavía recurrible»; 692 «El regreso no reinicia el cómputo» and «La memoria por sí sola deja lagunas»; 693 «No basta una dirección postal» and «También cuentan las fechas».
4. Paragraph starts were read vertically. No threefold identical start or extended repetitive lead-in pattern was found. The shared Korean scanner's consecutive-start findings do not establish a Spanish rhythm problem.
5. Evidence and chronology paragraphs vary the position of cited rules. No three consecutive claim/citation/caveat paragraphs; each article includes useful paragraphs without legal citations.
6. The contrasts concern actual procedural distinctions: service versus foreign creditor residence; notice versus exercise of a remedy; recognition versus recovery; retention versus limitation; residual claim versus title. They do not rebut invented reader claims.
7. Each contact paragraph ends on a fact specific to its article. The separate neutral information disclaimer is treated as the required structural notice, not as the substantive ending. No repeated sales conclusion.
8. No bold, invented first-person experience, generic imperative checklist headings or unsupported reviewer claim. Spanish register is consistent and professional.
9. The proposed changes preserve all numbers, legal conditions, source links and uncertainty. The remaining articles need no prose revision solely to increase a diagnostic score.

In particular, 689 CV `.433` and 691 CV `.446` are below the task's diagnostic target, but actual reading found varied evidence paragraphs, real short sentences and no sustained monotonous run. The 691 statutory grounds and four document groups are useful lists. There is no evidence-based MONOTONY rejection for these two files; adding an empty short sentence to raise CV would degrade the opening-deletion result. This is a qualitative locale judgment, not a claim that the original shared CLI passed.

## Next bounded step and limits

Author/root should apply the two required replacements, optionally the two collocation clarifications, then return the resulting hashes for a narrow recheck. Do not change law, add sections or expand the five articles to satisfy numerical metrics. Final legal review, image/presentation checks, route/build validation and live publication remain root-owned work. No browser rendering or deployment was verified by this reviewer.
