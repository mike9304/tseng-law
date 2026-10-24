# Korea-frame localization — ca

Sentence count: 4 (changed or removed original sentence occurrences; a standalone unpunctuated statement counts as one).

## 1. 008-taiwan-labor-severance-law.md

Original (exact):

```text
A diferència d’alguns ordenaments (Corea, per exemple), a Taiwan
```

Replacement (exact):

```text
A Taiwan
```

Reason: Remove the Korea comparison from the FAQ answer.
Taiwan legal meaning unchanged: The employer-dismissal rule, voluntary-resignation rule, and Article 14 exception are unchanged.
Changed original sentences: 1

## 2. 008-taiwan-labor-severance-law.md

Original (exact):

```text
En alguns ordenaments —Corea n’és un exemple assenyalat— l’empresa ha de pagar, per regla general, una indemnització quan el treballador cessa.
```

Replacement (exact):

```text
A Taiwan, l’obligació de pagar una indemnització depèn de la causa del cessament.
```

Reason: Replace the Korean-law comparison with the Taiwan distinction explained immediately below.
Taiwan legal meaning unchanged: The existing entitlement conditions and exceptions remain unchanged.
Changed original sentences: 1

## 3. 008-taiwan-labor-severance-law.md

Original (exact):

```text
Taiwan, en canvi, és diferent.
```

Replacement (exact):

```text
L’acomiadament i la dimissió voluntària tenen conseqüències diferents.
```

Reason: Replace the follow-on comparison with the two Taiwan situations already discussed in the next sentences.
Taiwan legal meaning unchanged: The subsequent dismissal, voluntary resignation, and Article 14 rules are preserved verbatim.
Changed original sentences: 1

## 4. 009-taiwan-voluntary-resignation-severance.md

Original (exact):

```text
Això difereix d’alguns ordenaments, com el coreà.
```

Replacement (exact):

```text
Aquesta regla està subjecta a les excepcions previstes per la llei.
```

Reason: Replace the Korea comparison with a reference to the statutory exceptions already explained below.
Taiwan legal meaning unchanged: Article 18 and the following Article 14 exceptions and Article 17 cross-reference remain unchanged.
Changed original sentences: 1

Unchanged, byte-identical: shared/ca/007-taiwan-divorce-lawsuit-qna.md — no Korea references.

Verification: numbers, article numbers, URLs, link targets, headings, line breaks, dates, and non-FAQ frontmatter preserved; only the logged replacements were made.

## Final verification and editorial self-check

Scope: minimal Korea-frame localization only. The canonical ~/agent-library/knowledge/editorial-voice.md was unavailable; the full repository copy at repo/docs/columns/EDITORIAL-VOICE.md was read and applied together with COLUMN-VOICE-RULE.md, SENTENCE-VARIETY-RULE.md, and LESSONS.md.

Section 5 self-check: the changed passages were read in context. Korea comparisons and dependent comparison wording were removed; existing Taiwan legal conditions, exceptions, citations, numbers, and modality were preserved. No new hypothetical opening, invented experience, bold emphasis, heading, conclusion, or promotional wording was introduced. Unrelated openings, paragraph rhythm, endings, and register were left untouched as required by the brief.

Variety-tool limitation: the required check command was run on all three files. Its supported languages are ko, ja, en, and zh-hant; it defaults this locale to ko. The results below are diagnostic output under Korean rules, not a valid pass/fail assessment of this locale. A zero-FAIL result is not claimed. Broader rewriting to satisfy these unrelated thresholds would violate the minimal-edit brief.

| File | Korean-rule FAIL keys before | Korean-rule FAIL keys after |
| --- | --- | --- |
| 007-taiwan-divorce-lawsuit-qna.md | len_cv, short_share, top_opener_n, consec_same_start | len_cv, short_share, top_opener_n, consec_same_start |
| 008-taiwan-labor-severance-law.md | short_share, consec_same_start | short_share, consec_same_start |
| 009-taiwan-voluntary-resignation-severance.md | short_share, top_opener_n | short_share, top_opener_n |

Baseline-hash reconstruction confirms that every article edit is recorded above. Files without Korea references are byte-identical. Final scan found no Korea references in the three article files.
Sentence count confirmed: 4.
