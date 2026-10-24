# Korea-frame localization — ar

Sentence count: 5 (changed or removed original sentence occurrences; a standalone unpunctuated statement counts as one).

## 1. 008-taiwan-labor-severance-law.md

Original (exact):

```text
بخلاف بعض النظم (كوريا مثلًا)، لا ينشأ في تايوان
```

Replacement (exact):

```text
لا ينشأ في تايوان
```

Reason: Remove the Korea comparison from the FAQ answer.
Taiwan legal meaning unchanged: The employer's severance duty on dismissal, the voluntary-resignation rule, and the Article 14 exception remain unchanged.
Changed original sentences: 1

## 2. 008-taiwan-labor-severance-law.md

Original (exact):

```text
ففي بعض النظم الأخرى، وكوريا مثال عليها، يجب على الشركة عامة دفع مبلغ عند ترك العمل. وهذا غير بدل إنهاء الخدمة التايواني (資遣費)، الذي لا يُستحق بمجرد الاستقالة
```

Replacement (exact):

```text
في تايوان، لا يُستحق بدل إنهاء الخدمة (資遣費) بمجرد الاستقالة
```

Reason: Remove the Korean payment comparison and make its Taiwan clause stand alone.
Taiwan legal meaning unchanged: Taiwan severance is still not payable merely because an employee voluntarily resigns; the subsequent exceptions are untouched.
Changed original sentences: 2

## 3. 008-taiwan-labor-severance-law.md

Original (exact):

```text
أما تايوان فتختلف عن تلك النظم
```

Replacement (exact):

```text
ويتوقف استحقاقه على سبب إنهاء عقد العمل
```

Reason: Replace the follow-on comparison to those systems after removing the Korea example.
Taiwan legal meaning unchanged: The following dismissal, resignation, and Article 14 conditions still determine entitlement; none is broadened or removed.
Changed original sentences: 1

## 4. 009-taiwan-voluntary-resignation-severance.md

Original (exact):

```text
وهذا يختلف عن بعض النظم الأخرى، وكوريا مثال عليها.
```

Replacement (exact):

```text
وذلك مع مراعاة الاستثناءات القانونية الواردة أدناه.
```

Reason: Replace the Korea comparison with a reference to the statutory exceptions already explained below.
Taiwan legal meaning unchanged: The Article 18 rule and the subsequent Article 14 exceptions and Article 17 cross-reference remain unchanged.
Changed original sentences: 1

Unchanged, byte-identical: shared/ar/007-taiwan-divorce-lawsuit-qna.md — no Korea references.

Verification: numbers, article numbers, URLs, link targets, headings, line breaks, dates, and non-FAQ frontmatter preserved; only the logged replacements were made.

## Final verification and editorial self-check

Scope: minimal Korea-frame localization only. The canonical ~/agent-library/knowledge/editorial-voice.md was unavailable; the full repository copy at repo/docs/columns/EDITORIAL-VOICE.md was read and applied together with COLUMN-VOICE-RULE.md, SENTENCE-VARIETY-RULE.md, and LESSONS.md.

Section 5 self-check: the changed passages were read in context. Korea comparisons and dependent comparison wording were removed; existing Taiwan legal conditions, exceptions, citations, numbers, and modality were preserved. No new hypothetical opening, invented experience, bold emphasis, heading, conclusion, or promotional wording was introduced. Unrelated openings, paragraph rhythm, endings, and register were left untouched as required by the brief.

Variety-tool limitation: the required check command was run on all three files. Its supported languages are ko, ja, en, and zh-hant; it defaults this locale to ko. The results below are diagnostic output under Korean rules, not a valid pass/fail assessment of this locale. A zero-FAIL result is not claimed. Broader rewriting to satisfy these unrelated thresholds would violate the minimal-edit brief.

| File | Korean-rule FAIL keys before | Korean-rule FAIL keys after |
| --- | --- | --- |
| 007-taiwan-divorce-lawsuit-qna.md | len_cv, short_share | len_cv, short_share |
| 008-taiwan-labor-severance-law.md | consec_same_start | consec_same_start |
| 009-taiwan-voluntary-resignation-severance.md | short_share | short_share |

Baseline-hash reconstruction confirms that every article edit is recorded above. Files without Korea references are byte-identical. Final scan found no Korea references in the three article files.
Sentence count confirmed: 5.
