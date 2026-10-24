
## Korea-frame localization — ro

Sentences changed: 4. FAQ and body occurrences are counted separately; a sentence spanning several paragraphs is counted once.

### 1. shared/ro/008-taiwan-labor-severance-law.md

Original (exact):

```text
Spre deosebire de unele state — de exemplu Coreea —, în Taiwan obligația de a plăti indemnizația de concediere (資遣費) se naște numai când societatea concediază persoana angajată; dacă persoana angajată demisionează ea însăși, societatea nu are obligația de a plăti indemnizație de concediere.
```

Replacement (exact):

```text
În Taiwan, obligația de a plăti indemnizația de concediere (資遣費) se naște numai când societatea concediază persoana angajată; dacă persoana angajată demisionează ea însăși, societatea nu are obligația de a plăti indemnizație de concediere.
```

Reason: Remove the FAQ comparison with Korea.

Taiwan legal meaning unchanged: The dismissal condition and voluntary-resignation rule are preserved, and the following Article 14 exception is untouched.

### 2. shared/ro/008-taiwan-labor-severance-law.md

Original (exact):

```text
În unele state, precum Coreea, societatea trebuie de regulă să plătească o indemnizație atunci când salariatul pleacă din întreprindere.
```

Replacement (exact):

```text
În Taiwan, dreptul la indemnizația de concediere depinde de modul în care încetează raportul de muncă.
```

Reason: Replace the foreign-law comparison with a Taiwan-only introduction.

Taiwan legal meaning unchanged: All following Taiwan rules on dismissal, resignation and the Article 14 exception remain unchanged.

### 3. shared/ro/008-taiwan-labor-severance-law.md

Original (exact):

```text
În Taiwan însă lucrurile stau altfel:
```

Replacement (exact):

```text
Regula generală este următoarea:
```

Reason: This dependent transition points back to the Korea example; remove the comparative wording.

Taiwan legal meaning unchanged: The legal statement after the colon is unchanged.

### 4. shared/ro/009-taiwan-voluntary-resignation-severance.md

Original (exact):

```text
În special, dacă salariatul demisionează din proprie inițiativă (自請離職),

nu poate primi indemnizația de concediere (資遣費) (art. 18 din legea standardelor muncii),

spre deosebire de unele state, de exemplu Coreea.
```

Replacement (exact):

```text
În Taiwan, dacă salariatul demisionează din proprie inițiativă (自請離職),

nu poate primi indemnizația de concediere (資遣費)

(art. 18 din legea standardelor muncii).
```

Reason: The sentence now states the Taiwan rule without comparing it with Korea.

Taiwan legal meaning unchanged: The voluntary-resignation condition and Article 18 citation remain intact; subsequent exceptions and deadlines are untouched.

Verification: exact replacements only; all other bytes, numbers, links, headings, line breaks, formatting, dates and non-FAQ frontmatter preserved. Files without Korea references are byte-identical.

Sentence-variety rule §5 self-check (scoped to these edits): removed Korea comparisons without adding a repeated rhetorical pattern; kept the existing register and did not add stock openings, closing formulas, bold, invented facts, or first-person claims. Article numbers, conditions, exceptions and source links are preserved. Unrelated openings, paragraph rhythms and endings remain outside this brief’s permitted edit scope.

Required variety_metrics.py check was run for all three files. The tool supports only ko/ja/en/zh-hant and falls back to ko for this locale, so its diagnostics are not a valid locale-specific pass/fail assessment:

- 007-taiwan-divorce-lawsuit-qna.md: detected ko; exit 1; 3 uncalibrated FAIL diagnostics.

- 008-taiwan-labor-severance-law.md: detected ko; exit 1; 2 uncalibrated FAIL diagnostics.

- 009-taiwan-voluntary-resignation-severance.md: detected ko; exit 1; 1 uncalibrated FAIL diagnostics.
