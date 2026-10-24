## Korea-frame localization — fa

Changed sentences: 4 (including FAQ sentences and comparison lead-in clauses).

### 1. shared/fa/008-taiwan-labor-severance-law.md

Original:

```text
برخلاف برخی نظام‌ها (کره برای نمونه)، در تایوان
```

Replacement:

```text
در تایوان
```

Reason: Remove the Korea comparison from the FAQ sentence.

Taiwan legal meaning unchanged: The Taiwan dismissal and voluntary-resignation rules and the following Article 14 exception remain unchanged.

### 2. shared/fa/008-taiwan-labor-severance-law.md

Original:

```text
در برخی نظام‌های دیگر — و کره یکی از نمونه‌هاست — شرکت عموماً وقتی کارمند کار را ترک کند باید غرامت اخراج بپردازد
```

Replacement:

```text
در تایوان، پایان کار به‌تنهایی شرکت را موظف به پرداخت غرامت اخراج نمی‌کند
```

Reason: Replace the Korea-only rule with the Taiwan rule already explained below.

Taiwan legal meaning unchanged: Ending employment alone does not establish Taiwan severance entitlement; all statutory grounds and exceptions remain unchanged.

### 3. shared/fa/008-taiwan-labor-severance-law.md

Original:

```text
اما تایوان با آن نظام‌ها فرق دارد
```

Replacement:

```text
پرداخت این غرامت به علت پایان قرارداد بستگی دارد
```

Reason: Remove the dependent comparison with Korea.

Taiwan legal meaning unchanged: Only the comparative lead-in changes; all following Taiwan rules remain verbatim.

### 4. shared/fa/009-taiwan-voluntary-resignation-severance.md

Original:

```text
این قاعده با برخی نظام‌ها فرق دارد؛ کره یکی از نمونه‌هاست.
```

Replacement:

```text
مگر در موارد استثنایی که در ادامه آمده است.
```

Reason: Replace the Korea comparison with a reference to the existing exceptions below.

Taiwan legal meaning unchanged: The Article 18 general rule, all Article 14 exceptions and the Article 17 reference remain unchanged.

## Verification

- All three articles match their original bytes plus the exact replacements above. Column 007 contains no Korea references and is byte-identical.
- Numbers, dates, links, headings, tables, image paths, blank-line layout and frontmatter other than the affected FAQ answer are unchanged.
- Sentence counts include independently formatted comparison clauses and the separate FAQ occurrence; each logged replacement is counted once.
- Sentence-variety rule §5 manual check: existing openings and endings are unchanged (items 2 and 7); edits retain the existing sentence and paragraph layout (items 3 and 4); citations and their positions are unchanged (item 5); Korea comparisons and their dependent contrast wording are removed (item 6); no bold, invented experience or new headings were added (item 8); Taiwan obligations, negations, conditions, exceptions and all numeric tokens and links are preserved (item 9). Wider stylistic changes are outside this minimal-edit brief.
- Automated §5 check: ran 'python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check' on all three locale files. The checker supports only ko, ja, en and zh-hant, defaults fa to ko, and reported 6 FAIL results using Korean rules. These are not a valid assessment of fa; a zero-FAIL result is not claimed, and unrelated sentences were left unchanged as required by the brief.
