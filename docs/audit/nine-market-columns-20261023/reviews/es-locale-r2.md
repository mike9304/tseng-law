# ES locale review r2 — repair 1 verification

Date: 2026-10-23. Reviewer: the independent AI Spanish locale reviewer who wrote `es-locale-r1.md`; did not author or edit any article. Scope: the two required wording repairs and affected conclusions, plus current hashes of all five articles. No human native-speaker status, legal qualification, final legal approval or publication is claimed.

Result: PASS for all five current files. No unresolved required locale finding remains. The two optional r1 wording preferences were not applied and remain nonblocking.

## Current reviewed versions

Paths are below `repo/src/content/columns-es/`.

| Article | Verdict | SHA-256 |
|---|---|---|
| `689-spain-exporter-taiwan-unpaid-invoices.md` | PASS | `bcee79faa0ba153eb153ae64997f3433988235bfeecc5166916a3a2c6285d5a4` |
| `690-spain-buyer-taiwan-defective-goods-notice.md` | PASS | `69001fba822ae1a024f2ca31acca1a03cec7035ee2ca9dd524a1719a581097a5` |
| `691-spanish-judgment-taiwan-assets-enforcement.md` | PASS, byte-identical to r1 | `415d039d1ca7a2c1436bf5ef1c7023ed2e46df3cc3ff1e73f0d655789eafcf07` |
| `692-return-spain-unpaid-taiwan-wages.md` | PASS, byte-identical to r1 | `a668300e4fa2a60df774c735aa10e8de550112ec98e84b4db1b31ea1fbcc0b1b` |
| `693-spain-resident-taiwan-divorce-property.md` | PASS, byte-identical to r1 | `490509a4df6a019885a31f72ce28d67226a21bb4a152562f75c3a94ffa71c9d7` |

The reviewer independently read the modified files and calculated every SHA-256 with Python `hashlib.sha256`. Replacing only the new 689 phrase and new 690 first paragraph with their r1 wording reproduced the exact r1 hashes. The inverse comparison returned `True` for both repaired articles; the other three hashes matched directly. This verifies that no source, number, period, FAQ, legal condition or remaining sentence changed.

## Closed findings

| File:line | Actual repaired wording | Recheck and legal meaning |
|---|---|---|
| `689-spain-exporter-taiwan-unpaid-invoices.md:4` | «conservar la prueba de la entrega» | The summary now identifies the evidence to preserve. It agrees with the body about delivery documents and does not change the debtor, applicable-law inquiry or collection routes. Required finding closed. |
| `690-spain-buyer-taiwan-defective-goods-notice.md:23` | «El informe completo del laboratorio puede seguir pendiente cuando ya se ha descubierto el defecto. Si la compra se rige por el Código Civil taiwanés, una empresa española no debería dar por supuesto que puede aplazar el aviso al vendedor hasta recibir ese informe.» | The opening now directly connects an already discovered defect to a still-pending report. The conditional application of Taiwan law remains explicit. It agrees with FAQ1 and the article 356 discussion; the separate article 357 and 365 exceptions/periods remain untouched. Required finding closed. |

The first-two-paragraph test was repeated for 690: the first sentence identifies the practical sequence; the second gives the conditional legal decision. The following B2B/law-selection paragraph retains its distinct scope function. No empty sentence was added to increase variation. The 689 opening was unchanged; its prior deletion test remains applicable.

## Required variety command after repair

The reviewer reran the original command against the two modified files:

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute-article-path>
```

Both again exited 1 and selected unsupported `[ko]` processing. Results: 689 `len_cv=.431`, `short_share=0` FAIL; 690 `short_share=0` FAIL, with CV `.456`. These are disclosed tool limitations, not Spanish validation or a claim of FAIL 0.

Read-only ICU Spanish diagnostics on the current files: 689 CV `.433`, short share `.098`, similar-length triplets `.077`; 690 CV `.505`, short share `.146`, triplets `.051`. Neither has a paragraph opening word repeated more than twice or consecutive identical two-word starts. The r1 independent qualitative rhythm judgment stands; no metric-driven filler is needed.

The rest of the section 5 manual review, three recent same-locale comparisons and legal spot-check boundaries remain documented in `es-locale-r1.md` and apply to the unchanged bytes. No new legal proposition was introduced by repair 1, so those official sources were not redundantly reopened.

## Recommendation heading and remaining limits

Read directly at `repo/src/lib/column-audience.ts:140`: `Artículos recomendados para lectores de España`. This matches the previously reviewed natural Spanish wording. Code ownership remains with root; the reviewer made no code change and did not verify rendered UI behavior.

Independent final legal review, tests/build, actual browser presentation and public publication remain separate root-owned work. Locale PASS applies only to the current hashes recorded above.
