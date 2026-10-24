
## Korea-frame localization — ru

Sentences changed: 3. FAQ and body occurrences are counted separately; a sentence spanning several paragraphs is counted once.

### 1. shared/ru/008-taiwan-labor-severance-law.md

Original (exact):

```text
В отличие от некоторых других правопорядков (например, корейского), на Тайване обязанность выплатить выходное пособие (資遣費) возникает лишь тогда, когда компания увольняет работника; если работник увольняется добровольно, компания не обязана выплачивать выходное пособие.
```

Replacement (exact):

```text
На Тайване обязанность выплатить выходное пособие (資遣費) возникает лишь тогда, когда компания увольняет работника; если работник увольняется добровольно, компания не обязана выплачивать выходное пособие.
```

Reason: Remove the FAQ's comparison with Korean law.

Taiwan legal meaning unchanged: The employer-dismissal condition and voluntary-resignation rule are unchanged; the following Article 14 exception is untouched.

### 2. shared/ru/008-taiwan-labor-severance-law.md

Original (exact):

```text
В некоторых странах, например в Корее, компания должна выплатить выходное пособие, когда работник увольняется

Однако на Тайване, в отличие от таких правопорядков,
```

Replacement (exact):

```text
На Тайване право на выходное пособие зависит

от основания прекращения трудового договора:
```

Reason: Replace the Korea example and the linked comparative clause with a Taiwan-only introduction.

Taiwan legal meaning unchanged: The Taiwan dismissal requirement in the remainder of the sentence is untouched, as are the following resignation rule and Article 14 exception.

### 3. shared/ru/009-taiwan-voluntary-resignation-severance.md

Original (exact):

```text
В особенности если работник увольняется добровольно (自請離職),

выходное пособие (資遣費) получить нельзя (статья 18 Закона о трудовых стандартах),

и это отличается от некоторых других правопорядков, например корейского.
```

Replacement (exact):

```text
Если работник на Тайване увольняется добровольно (自請離職),

выходное пособие (資遣費) получить нельзя

(статья 18 Закона о трудовых стандартах).
```

Reason: State the Taiwan rule without comparing it with Korean law.

Taiwan legal meaning unchanged: The voluntary-resignation condition and Article 18 citation are preserved; all subsequent exceptions and deadlines are unchanged.

Verification: exact replacements only; all other bytes, numbers, links, headings, line breaks, formatting, dates and non-FAQ frontmatter preserved. Files without Korea references are byte-identical.

Sentence-variety rule §5 self-check (scoped to these edits): removed Korea comparisons without adding a repeated rhetorical pattern; kept the existing register and did not add stock openings, closing formulas, bold, invented facts, or first-person claims. Article numbers, conditions, exceptions and source links are preserved. Unrelated openings, paragraph rhythms and endings remain outside this brief’s permitted edit scope.

Required variety_metrics.py check was run for all three files. The tool supports only ko/ja/en/zh-hant and falls back to ko for this locale, so its diagnostics are not a valid locale-specific pass/fail assessment:

- 007-taiwan-divorce-lawsuit-qna.md: detected ko; exit 1; 3 uncalibrated FAIL diagnostics.

- 008-taiwan-labor-severance-law.md: detected ko; exit 1; 2 uncalibrated FAIL diagnostics.

- 009-taiwan-voluntary-resignation-severance.md: detected ko; exit 0; 0 uncalibrated FAIL diagnostics.
