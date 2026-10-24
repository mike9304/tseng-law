## SHARED-LOCALIZE — 2026-10-24

Changed sentences: 3.

### Change 1

File: `shared/it/008-taiwan-labor-severance-law.md`

Reason: The FAQ uses Korea as a comparison for Taiwan severance eligibility.

Original:

```text
A differenza di alcuni ordinamenti (per esempio la Corea), a Taiwan l’obbligo di pagare l’indennità di licenziamento (資遣費) nasce solo quando la società licenzia il lavoratore; se il lavoratore si dimette di propria iniziativa, la società non è tenuta a pagare indennità di licenziamento.
```

Replacement:

```text
A Taiwan l’obbligo di pagare l’indennità di licenziamento (資遣費) nasce solo quando la società licenzia il lavoratore; se il lavoratore si dimette di propria iniziativa, la società non è tenuta a pagare indennità di licenziamento.
```

Taiwan legal meaning unchanged: The employer-initiated termination condition and voluntary-resignation rule are identical; the following Article 14 exception is untouched.

### Change 2

File: `shared/it/008-taiwan-labor-severance-law.md`

Reason: The Korea-specific comparison is replaced with a tentative assumption so the following explanation of Taiwan law remains coherent.

Original:

```text
In alcuni ordinamenti — per esempio in Corea — la società deve pagare un’indennità di uscita quando i lavoratori lasciano l’impresa.
```

Replacement:

```text
Si potrebbe pensare che la società debba pagare un’indennità di uscita ogni volta che un lavoratore lascia l’impresa.
```

Taiwan legal meaning unchanged: The Taiwan termination rules and Article 14 exception in the following sentences are unchanged.

### Change 3

File: `shared/it/009-taiwan-voluntary-resignation-severance.md`

Reason: This clause completes a sentence with an irrelevant comparison to Korea.

Original:

```text
e ciò differisce da altri ordinamenti, per esempio dalla Corea.
```

Replacement:

```text
e la cessazione del rapporto di lavoro a Taiwan non dà quindi automaticamente diritto all’indennità.
```

Taiwan legal meaning unchanged: The sentence still explains the general lack of automatic severance entitlement; the Article 18 reference and subsequent Article 14 exceptions are preserved.

### Verification

Verified exact replacements only: Taiwan legal conditions, exceptions, article numbers, all other numbers, links, non-FAQ frontmatter, dates, headings, and formatting are unchanged. Files without Korea references are byte-identical. Section 5 self-check: reviewed the changed sentences in context, removed the Korea comparison, and introduced no new opening, heading, quotation, emphasis, invented experience, or closing formula; unrelated sentence rhythm and existing prose were preserved as the brief requires. Ran variety_metrics.py on all three files before and after editing. The checker supports only ko, ja, en, and zh-hant and defaults to ko for this locale; its reported style failures are not validated metrics for this language and do not authorize rewriting unrelated sentences. No full-column style pass is claimed. Sentence counts include each occurrence separately, including repeated FAQ/body text.
