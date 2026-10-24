# Korea-frame localization — bn

Sentence count: 4 (changed or removed original sentence occurrences; a standalone unpunctuated statement counts as one).

## 1. 008-taiwan-labor-severance-law.md

Original (exact):

```text
কিছু এখতিয়ার থেকে ভিন্ন — উদাহরণস্বরূপ কোরিয়া — তাইওয়ানে
```

Replacement (exact):

```text
তাইওয়ানে
```

Reason: Remove the Korea comparison from the FAQ answer.
Taiwan legal meaning unchanged: The dismissal, ordinary resignation, and Article 14 conditions remain unchanged.
Changed original sentences: 1

## 2. 008-taiwan-labor-severance-law.md

Original (exact):

```text
কিছু এখতিয়ারে, উদাহরণস্বরূপ কোরিয়ায়, কর্মী নিজে কোম্পানি ছাড়লেও কোম্পানিকে সংবিধিবদ্ধ ছাঁটাই-ক্ষতিপূরণ দিতে হয়
```

Replacement (exact):

```text
সংবিধিবদ্ধ ছাঁটাই-ক্ষতিপূরণের অধিকার তাইওয়ানে চাকরি শেষ হওয়ার কারণের ওপর নির্ভর করে
```

Reason: Replace the Korean-law statement with the Taiwan distinction explained below.
Taiwan legal meaning unchanged: No entitlement is added; the following dismissal rule, resignation rule, and statutory exceptions remain verbatim.
Changed original sentences: 1

## 3. 008-taiwan-labor-severance-law.md

Original (exact):

```text
তাইওয়ানের ব্যবস্থা এ থেকে ভিন্ন:
```

Replacement (exact):

```text
এ ক্ষেত্রে নিয়মটি হলো:
```

Reason: Remove the follow-on comparison that depended on the Korea example.
Taiwan legal meaning unchanged: The following statement of Taiwan's dismissal condition is unchanged.
Changed original sentences: 1

## 4. 009-taiwan-voluntary-resignation-severance.md

Original (exact):

```text
কিছু অন্য এখতিয়ারের ব্যবস্থা এ থেকে ভিন্ন — উদাহরণস্বরূপ কোরিয়ার।
```

Replacement (exact):

```text
আইনে নির্ধারিত ব্যতিক্রমগুলো ছাড়া।
```

Reason: Replace the Korea comparison with the statutory-exception qualification already explained below.
Taiwan legal meaning unchanged: The Article 18 rule, subsequent Article 14 exceptions, and Article 17 cross-reference are unchanged.
Changed original sentences: 1

Unchanged, byte-identical: shared/bn/007-taiwan-divorce-lawsuit-qna.md — no Korea references.

Verification: numbers, article numbers, URLs, link targets, headings, line breaks, dates, and non-FAQ frontmatter preserved; only the logged replacements were made.

## Final verification and editorial self-check

Scope: minimal Korea-frame localization only. The canonical ~/agent-library/knowledge/editorial-voice.md was unavailable; the full repository copy at repo/docs/columns/EDITORIAL-VOICE.md was read and applied together with COLUMN-VOICE-RULE.md, SENTENCE-VARIETY-RULE.md, and LESSONS.md.

Section 5 self-check: the changed passages were read in context. Korea comparisons and dependent comparison wording were removed; existing Taiwan legal conditions, exceptions, citations, numbers, and modality were preserved. No new hypothetical opening, invented experience, bold emphasis, heading, conclusion, or promotional wording was introduced. Unrelated openings, paragraph rhythm, endings, and register were left untouched as required by the brief.

Variety-tool limitation: the required check command was run on all three files. Its supported languages are ko, ja, en, and zh-hant; it defaults this locale to ko. The results below are diagnostic output under Korean rules, not a valid pass/fail assessment of this locale. A zero-FAIL result is not claimed. Broader rewriting to satisfy these unrelated thresholds would violate the minimal-edit brief.

| File | Korean-rule FAIL keys before | Korean-rule FAIL keys after |
| --- | --- | --- |
| 007-taiwan-divorce-lawsuit-qna.md | len_cv, short_share, top_opener_n, consec_same_start | len_cv, short_share, top_opener_n, consec_same_start |
| 008-taiwan-labor-severance-law.md | short_share, top_opener_n, consec_same_start | short_share, top_opener_n, consec_same_start |
| 009-taiwan-voluntary-resignation-severance.md | none | none |

Baseline-hash reconstruction confirms that every article edit is recorded above. Files without Korea references are byte-identical. Final scan found no Korea references in the three article files.
Sentence count confirmed: 4.
