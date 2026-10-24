
## Korea-frame localization — pl

Sentences changed: 4. FAQ and body occurrences are counted separately; a sentence spanning several paragraphs is counted once.

### 1. shared/pl/008-taiwan-labor-severance-law.md

Original (exact):

```text
W odróżnieniu od niektórych porządków prawnych — na przykład koreańskiego — na Tajwanie obowiązek wypłaty odprawy (資遣費) powstaje dopiero wtedy, gdy spółka zwalnia zatrudnioną osobę; jeśli zatrudniona osoba sama rezygnuje, spółka nie musi wypłacać odprawy.
```

Replacement (exact):

```text
Na Tajwanie obowiązek wypłaty odprawy (資遣費) powstaje dopiero wtedy, gdy spółka zwalnia zatrudnioną osobę; jeśli zatrudniona osoba sama rezygnuje, spółka nie musi wypłacać odprawy.
```

Reason: Remove the FAQ comparison with Korean law.

Taiwan legal meaning unchanged: The dismissal requirement and voluntary-resignation rule remain unchanged; the following Article 14 exception is untouched.

### 2. shared/pl/008-taiwan-labor-severance-law.md

Original (exact):

```text
W niektórych państwach — na przykład w Korei — spółka musi wypłacić odprawę także wtedy, gdy pracownik sam odchodzi z przedsiębiorstwa.
```

Replacement (exact):

```text
Na Tajwanie prawo do odprawy zależy od sposobu zakończenia stosunku pracy.
```

Reason: Replace the Korea example with Taiwan's relevant distinction.

Taiwan legal meaning unchanged: The following dismissal and resignation rules and Article 14 exception are preserved.

### 3. shared/pl/008-taiwan-labor-severance-law.md

Original (exact):

```text
Na Tajwanie jest to jednak uregulowane inaczej:
```

Replacement (exact):

```text
Ogólna zasada jest następująca:
```

Reason: This dependent clause compares Taiwan with the preceding Korea example; remove that comparison.

Taiwan legal meaning unchanged: The legal statement introduced by the colon is untouched.

### 4. shared/pl/009-taiwan-voluntary-resignation-severance.md

Original (exact):

```text
W szczególności, jeśli pracownik odchodzi z własnej woli (自請離職),

nie może otrzymać odprawy (資遣費) (art. 18 ustawy o normach pracy),

co odróżnia Tajwan od niektórych innych porządków prawnych, na przykład koreańskiego.
```

Replacement (exact):

```text
Jeśli pracownik na Tajwanie odchodzi z własnej woli (自請離職),

nie może otrzymać odprawy (資遣費)

(art. 18 ustawy o normach pracy).
```

Reason: The Taiwan rule now stands alone without comparing it to Korean law.

Taiwan legal meaning unchanged: The voluntary-resignation condition and Article 18 citation are unchanged; all following exceptions and deadlines remain intact.

Verification: exact replacements only; all other bytes, numbers, links, headings, line breaks, formatting, dates and non-FAQ frontmatter preserved. Files without Korea references are byte-identical.

Sentence-variety rule §5 self-check (scoped to these edits): removed Korea comparisons without adding a repeated rhetorical pattern; kept the existing register and did not add stock openings, closing formulas, bold, invented facts, or first-person claims. Article numbers, conditions, exceptions and source links are preserved. Unrelated openings, paragraph rhythms and endings remain outside this brief’s permitted edit scope.

Required variety_metrics.py check was run for all three files. The tool supports only ko/ja/en/zh-hant and falls back to ko for this locale, so its diagnostics are not a valid locale-specific pass/fail assessment:

- 007-taiwan-divorce-lawsuit-qna.md: detected ko; exit 1; 3 uncalibrated FAIL diagnostics.

- 008-taiwan-labor-severance-law.md: detected ko; exit 1; 1 uncalibrated FAIL diagnostics.

- 009-taiwan-voluntary-resignation-severance.md: detected ko; exit 0; 0 uncalibrated FAIL diagnostics.
