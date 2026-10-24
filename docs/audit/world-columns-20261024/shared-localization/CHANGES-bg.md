# Korea-frame localization — bg

Sentence count: 4 (changed or removed original sentence occurrences; a standalone unpunctuated statement counts as one).

## 1. 008-taiwan-labor-severance-law.md

Original (exact):

```text
За разлика от някои правопорядки (например Корея), в Тайван
```

Replacement (exact):

```text
В Тайван
```

Reason: Remove the Korea comparison from the FAQ answer.
Taiwan legal meaning unchanged: The dismissal rule, ordinary voluntary-resignation rule, and Article 14 exception are unchanged.
Changed original sentences: 1

## 2. 008-taiwan-labor-severance-law.md

Original (exact):

```text
В някои правопорядки — например в Корея — дружеството трябва да изплати обезщетение при напускане, когато работникът напусне.
```

Replacement (exact):

```text
В Тайван правото на законно обезщетение при освобождаване зависи от основанието за прекратяване на трудовия договор.
```

Reason: Replace the Korean-law sentence with the Taiwan distinction explained immediately below.
Taiwan legal meaning unchanged: Entitlement still depends on the existing dismissal, resignation, and statutory-exception conditions; no payment entitlement is added.
Changed original sentences: 1

## 3. 008-taiwan-labor-severance-law.md

Original (exact):

```text
В Тайван обаче, за разлика от някои правопорядки (например Корея),
```

Replacement (exact):

```text
В Тайван
```

Reason: Remove the Korea comparison from the opening clause.
Taiwan legal meaning unchanged: The following employer-dismissal condition remains verbatim.
Changed original sentences: 1

## 4. 009-taiwan-voluntary-resignation-severance.md

Original (exact):

```text
за разлика от някои правни системи (Корея, например).
```

Replacement (exact):

```text
освен в предвидените от закона изключения.
```

Reason: Replace the Korea comparison with the statutory-exception qualification already explained below.
Taiwan legal meaning unchanged: Article 18 and the following Article 14 exceptions and Article 17 cross-reference remain unchanged.
Changed original sentences: 1

Unchanged, byte-identical: shared/bg/007-taiwan-divorce-lawsuit-qna.md — no Korea references.

Verification: numbers, article numbers, URLs, link targets, headings, line breaks, dates, and non-FAQ frontmatter preserved; only the logged replacements were made.

## Final verification and editorial self-check

Scope: minimal Korea-frame localization only. The canonical ~/agent-library/knowledge/editorial-voice.md was unavailable; the full repository copy at repo/docs/columns/EDITORIAL-VOICE.md was read and applied together with COLUMN-VOICE-RULE.md, SENTENCE-VARIETY-RULE.md, and LESSONS.md.

Section 5 self-check: the changed passages were read in context. Korea comparisons and dependent comparison wording were removed; existing Taiwan legal conditions, exceptions, citations, numbers, and modality were preserved. No new hypothetical opening, invented experience, bold emphasis, heading, conclusion, or promotional wording was introduced. Unrelated openings, paragraph rhythm, endings, and register were left untouched as required by the brief.

Variety-tool limitation: the required check command was run on all three files. Its supported languages are ko, ja, en, and zh-hant; it defaults this locale to ko. The results below are diagnostic output under Korean rules, not a valid pass/fail assessment of this locale. A zero-FAIL result is not claimed. Broader rewriting to satisfy these unrelated thresholds would violate the minimal-edit brief.

| File | Korean-rule FAIL keys before | Korean-rule FAIL keys after |
| --- | --- | --- |
| 007-taiwan-divorce-lawsuit-qna.md | len_cv, short_share, even_run3, consec_same_start | len_cv, short_share, even_run3, consec_same_start |
| 008-taiwan-labor-severance-law.md | short_share, top_opener_n, consec_same_start | short_share, top_opener_n, consec_same_start |
| 009-taiwan-voluntary-resignation-severance.md | none | none |

Baseline-hash reconstruction confirms that every article edit is recorded above. Files without Korea references are byte-identical. Final scan found no Korea references in the three article files.
Sentence count confirmed: 4.
