# Korea-frame localization — es

Sentence count: 4 (changed or removed original sentence occurrences; a standalone unpunctuated statement counts as one).

## 1. 008-taiwan-labor-severance-law.md

Original (exact):

```text
A diferencia de algunos ordenamientos (Corea, por ejemplo), en Taiwán
```

Replacement (exact):

```text
En Taiwán
```

Reason: Remove the Korea comparison from the FAQ answer.
Taiwan legal meaning unchanged: The dismissal condition, voluntary-resignation rule, and Article 14 exception remain unchanged.
Changed original sentences: 1

## 2. 008-taiwan-labor-severance-law.md

Original (exact):

```text
En algunos ordenamientos —Corea es un ejemplo señalado— la empresa debe pagar, por regla general, una indemnización cuando el trabajador cesa.
```

Replacement (exact):

```text
En Taiwán, el derecho a una indemnización depende de la causa de extinción de la relación laboral.
```

Reason: Replace the Korean-law statement with the Taiwan distinction already explained below.
Taiwan legal meaning unchanged: The existing termination conditions and exceptions still determine entitlement; no new entitlement is added.
Changed original sentences: 1

## 3. 008-taiwan-labor-severance-law.md

Original (exact):

```text
Taiwán, en cambio, es distinto.
```

Replacement (exact):

```text
El despido y la dimisión voluntaria tienen consecuencias distintas.
```

Reason: Replace the follow-on comparison with the two Taiwan situations discussed next.
Taiwan legal meaning unchanged: The following dismissal, voluntary resignation, and Article 14 rules remain verbatim.
Changed original sentences: 1

## 4. 009-taiwan-voluntary-resignation-severance.md

Original (exact):

```text
Ello difiere de algunos ordenamientos, como el coreano.
```

Replacement (exact):

```text
Esta regla está sujeta a las excepciones previstas en la ley.
```

Reason: Replace the Korea comparison with a reference to the statutory exceptions already explained below.
Taiwan legal meaning unchanged: The Article 18 rule, subsequent Article 14 exceptions, and Article 17 cross-reference remain unchanged.
Changed original sentences: 1

Unchanged, byte-identical: shared/es/007-taiwan-divorce-lawsuit-qna.md — no Korea references.

Verification: numbers, article numbers, URLs, link targets, headings, line breaks, dates, and non-FAQ frontmatter preserved; only the logged replacements were made.

## Final verification and editorial self-check

Scope: minimal Korea-frame localization only. The canonical ~/agent-library/knowledge/editorial-voice.md was unavailable; the full repository copy at repo/docs/columns/EDITORIAL-VOICE.md was read and applied together with COLUMN-VOICE-RULE.md, SENTENCE-VARIETY-RULE.md, and LESSONS.md.

Section 5 self-check: the changed passages were read in context. Korea comparisons and dependent comparison wording were removed; existing Taiwan legal conditions, exceptions, citations, numbers, and modality were preserved. No new hypothetical opening, invented experience, bold emphasis, heading, conclusion, or promotional wording was introduced. Unrelated openings, paragraph rhythm, endings, and register were left untouched as required by the brief.

Variety-tool limitation: the required check command was run on all three files. Its supported languages are ko, ja, en, and zh-hant; it defaults this locale to ko. The results below are diagnostic output under Korean rules, not a valid pass/fail assessment of this locale. A zero-FAIL result is not claimed. Broader rewriting to satisfy these unrelated thresholds would violate the minimal-edit brief.

| File | Korean-rule FAIL keys before | Korean-rule FAIL keys after |
| --- | --- | --- |
| 007-taiwan-divorce-lawsuit-qna.md | len_cv, short_share, top_opener_n, consec_same_start | len_cv, short_share, top_opener_n, consec_same_start |
| 008-taiwan-labor-severance-law.md | short_share, consec_same_start | short_share, consec_same_start |
| 009-taiwan-voluntary-resignation-severance.md | short_share, top_opener_n, consec_same_start | short_share, top_opener_n, consec_same_start |

Baseline-hash reconstruction confirms that every article edit is recorded above. Files without Korea references are byte-identical. Final scan found no Korea references in the three article files.
Sentence count confirmed: 4.
