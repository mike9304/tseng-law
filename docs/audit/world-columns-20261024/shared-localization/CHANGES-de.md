# Korea-frame localization — de

Sentence count: 4 (changed or removed original sentence occurrences; a standalone unpunctuated statement counts as one).

## 1. 008-taiwan-labor-severance-law.md

Original (exact):

```text
Anders als in manchen Rechtsordnungen — Korea ist ein Beispiel — entsteht in Taiwan
```

Replacement (exact):

```text
In Taiwan entsteht
```

Reason: Remove the Korea comparison and retain natural German word order in the FAQ.
Taiwan legal meaning unchanged: The dismissal condition, voluntary-resignation rule, and Article 14 exception remain unchanged.
Changed original sentences: 1

## 2. 008-taiwan-labor-severance-law.md

Original (exact):

```text
Im Vergleich zu manchen anderen Rechtsordnungen — Korea ist ein gekennzeichnetes Beispiel — muss die Gesellschaft dort in der Regel Abfindung zahlen, wenn Beschäftigte ausscheiden.
```

Replacement (exact):

```text
Ob eine Abfindung zu zahlen ist, hängt in Taiwan vom Grund der Beendigung des Arbeitsverhältnisses ab.
```

Reason: Replace the Korean-law comparison with the Taiwan distinction already explained below.
Taiwan legal meaning unchanged: The existing termination conditions and exceptions still determine entitlement; no new entitlement is added.
Changed original sentences: 1

## 3. 008-taiwan-labor-severance-law.md

Original (exact):

```text
In Taiwan ist es jedoch anders:
```

Replacement (exact):

```text
Dabei wird zwischen einer Entlassung und einer Eigenkündigung unterschieden:
```

Reason: Replace the follow-on comparison with the two Taiwan situations discussed next.
Taiwan legal meaning unchanged: The following dismissal, voluntary resignation, and Article 14 rules remain verbatim.
Changed original sentences: 1

## 4. 009-taiwan-voluntary-resignation-severance.md

Original (exact):

```text
Das unterscheidet sich von manchen anderen Rechtsordnungen; Korea ist ein gekennzeichnetes Beispiel.
```

Replacement (exact):

```text
Dabei gelten die gesetzlich vorgesehenen Ausnahmen.
```

Reason: Replace the Korea comparison with a reference to the statutory exceptions already explained below.
Taiwan legal meaning unchanged: The Article 18 rule, subsequent Article 14 exceptions, and Article 17 cross-reference remain unchanged.
Changed original sentences: 1

Unchanged, byte-identical: shared/de/007-taiwan-divorce-lawsuit-qna.md — no Korea references.

Verification: numbers, article numbers, URLs, link targets, headings, line breaks, dates, and non-FAQ frontmatter preserved; only the logged replacements were made.

## Final verification and editorial self-check

Scope: minimal Korea-frame localization only. The canonical ~/agent-library/knowledge/editorial-voice.md was unavailable; the full repository copy at repo/docs/columns/EDITORIAL-VOICE.md was read and applied together with COLUMN-VOICE-RULE.md, SENTENCE-VARIETY-RULE.md, and LESSONS.md.

Section 5 self-check: the changed passages were read in context. Korea comparisons and dependent comparison wording were removed; existing Taiwan legal conditions, exceptions, citations, numbers, and modality were preserved. No new hypothetical opening, invented experience, bold emphasis, heading, conclusion, or promotional wording was introduced. Unrelated openings, paragraph rhythm, endings, and register were left untouched as required by the brief.

Variety-tool limitation: the required check command was run on all three files. Its supported languages are ko, ja, en, and zh-hant; it defaults this locale to ko. The results below are diagnostic output under Korean rules, not a valid pass/fail assessment of this locale. A zero-FAIL result is not claimed. Broader rewriting to satisfy these unrelated thresholds would violate the minimal-edit brief.

| File | Korean-rule FAIL keys before | Korean-rule FAIL keys after |
| --- | --- | --- |
| 007-taiwan-divorce-lawsuit-qna.md | len_cv, short_share, consec_same_start | len_cv, short_share, consec_same_start |
| 008-taiwan-labor-severance-law.md | short_share, top_opener_n, consec_same_start | short_share, top_opener_n, consec_same_start |
| 009-taiwan-voluntary-resignation-severance.md | short_share, top_opener_n | short_share, top_opener_n |

Baseline-hash reconstruction confirms that every article edit is recorded above. Files without Korea references are byte-identical. Final scan found no Korea references in the three article files.
Sentence count confirmed: 4.
