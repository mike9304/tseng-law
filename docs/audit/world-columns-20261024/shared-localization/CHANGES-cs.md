# Korea-frame localization — cs

Sentence count: 4 (changed or removed original sentence occurrences; a standalone unpunctuated statement counts as one).

## 1. 008-taiwan-labor-severance-law.md

Original (exact):

```text
Na rozdíl od některých jurisdikcí (například Koreje) vzniká na Tchaj-wanu
```

Replacement (exact):

```text
Na Tchaj-wanu vzniká
```

Reason: Remove the Korea comparison from the FAQ answer.
Taiwan legal meaning unchanged: The dismissal condition, voluntary-resignation rule, and Article 14 exception remain unchanged.
Changed original sentences: 1

## 2. 008-taiwan-labor-severance-law.md

Original (exact):

```text
V některých jurisdikcích, například v Koreji, musí společnost vyplatit odstupné i tehdy, když zaměstnanec odejde sám.
```

Replacement (exact):

```text
Na Tchaj-wanu závisí nárok na odstupné na důvodu skončení pracovního poměru.
```

Reason: Replace the Korean-law comparison with the Taiwan distinction already explained below.
Taiwan legal meaning unchanged: No new entitlement is added; the existing termination conditions and exceptions remain unchanged.
Changed original sentences: 1

## 3. 008-taiwan-labor-severance-law.md

Original (exact):

```text
Na Tchaj-wanu je to jiné:
```

Replacement (exact):

```text
Rozlišuje se propuštění zaměstnance a jeho dobrovolný odchod:
```

Reason: Replace the follow-on comparison with the Taiwan situations introduced by the following sentences.
Taiwan legal meaning unchanged: The following dismissal, voluntary resignation, and Article 14 rules are preserved verbatim.
Changed original sentences: 1

## 4. 009-taiwan-voluntary-resignation-severance.md

Original (exact):

```text
což se liší od úpravy v některých jurisdikcích, například v Koreji.
```

Replacement (exact):

```text
s výjimkou zákonem stanovených případů.
```

Reason: Replace the Korea comparison with the statutory-exception qualification already explained below.
Taiwan legal meaning unchanged: Article 18 and the subsequent Article 14 exceptions and Article 17 cross-reference are unchanged.
Changed original sentences: 1

Unchanged, byte-identical: shared/cs/007-taiwan-divorce-lawsuit-qna.md — no Korea references.

Verification: numbers, article numbers, URLs, link targets, headings, line breaks, dates, and non-FAQ frontmatter preserved; only the logged replacements were made.

## Final verification and editorial self-check

Scope: minimal Korea-frame localization only. The canonical ~/agent-library/knowledge/editorial-voice.md was unavailable; the full repository copy at repo/docs/columns/EDITORIAL-VOICE.md was read and applied together with COLUMN-VOICE-RULE.md, SENTENCE-VARIETY-RULE.md, and LESSONS.md.

Section 5 self-check: the changed passages were read in context. Korea comparisons and dependent comparison wording were removed; existing Taiwan legal conditions, exceptions, citations, numbers, and modality were preserved. No new hypothetical opening, invented experience, bold emphasis, heading, conclusion, or promotional wording was introduced. Unrelated openings, paragraph rhythm, endings, and register were left untouched as required by the brief.

Variety-tool limitation: the required check command was run on all three files. Its supported languages are ko, ja, en, and zh-hant; it defaults this locale to ko. The results below are diagnostic output under Korean rules, not a valid pass/fail assessment of this locale. A zero-FAIL result is not claimed. Broader rewriting to satisfy these unrelated thresholds would violate the minimal-edit brief.

| File | Korean-rule FAIL keys before | Korean-rule FAIL keys after |
| --- | --- | --- |
| 007-taiwan-divorce-lawsuit-qna.md | short_share, consec_same_start | short_share, consec_same_start |
| 008-taiwan-labor-severance-law.md | short_share, top_opener_n, consec_same_start | short_share, top_opener_n, consec_same_start |
| 009-taiwan-voluntary-resignation-severance.md | none | none |

Baseline-hash reconstruction confirms that every article edit is recorded above. Files without Korea references are byte-identical. Final scan found no Korea references in the three article files.
Sentence count confirmed: 4.
