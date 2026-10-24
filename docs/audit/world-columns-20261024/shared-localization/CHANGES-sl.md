
## Korea-frame localization — sl

Sentences changed: 4. FAQ and body occurrences are counted separately; a sentence spanning several paragraphs is counted once.

### 1. shared/sl/008-taiwan-labor-severance-law.md

Original (exact):

```text
Za razliko od nekaterih pravnih ureditev (na primer Koreje) na Tajvanu obveznost izplačila odpravnine (資遣費) nastane šele tedaj, ko družba delavca odpusti; če delavec sam odide, družba odpravnine ni dolžna izplačati.
```

Replacement (exact):

```text
Na Tajvanu obveznost izplačila odpravnine (資遣費) nastane šele tedaj, ko družba delavca odpusti; če delavec sam odide, družba odpravnine ni dolžna izplačati.
```

Reason: Remove the FAQ comparison with Korea.

Taiwan legal meaning unchanged: The dismissal requirement and voluntary-resignation rule are unchanged; the following Article 14 exception is untouched.

### 2. shared/sl/008-taiwan-labor-severance-law.md

Original (exact):

```text
V nekaterih pravnih ureditvah, na primer v Koreji, mora družba izplačati odpravnino tudi tedaj, ko delavec sam odide.
```

Replacement (exact):

```text
Na Tajvanu je pravica do odpravnine odvisna od načina prenehanja delovnega razmerja.
```

Reason: Replace the Korea example with a Taiwan-only introduction.

Taiwan legal meaning unchanged: The following Taiwan rules for dismissal, resignation and the Article 14 exception remain unchanged.

### 3. shared/sl/008-taiwan-labor-severance-law.md

Original (exact):

```text
Na Tajvanu je to drugače:
```

Replacement (exact):

```text
Velja naslednje splošno pravilo:
```

Reason: Remove the dependent transition comparing Taiwan with the preceding Korea example.

Taiwan legal meaning unchanged: The legal statement following the colon is untouched.

### 4. shared/sl/009-taiwan-voluntary-resignation-severance.md

Original (exact):

```text
Zlasti če delavec odide po lastni volji (自請離職),

odpravnine (資遣費) ni mogoče prejeti (18. člen zakona o temeljnih delovnih standardih),

kar se razlikuje od ureditve v nekaterih pravnih redih, na primer v Koreji.
```

Replacement (exact):

```text
Če delavec na Tajvanu odide po lastni volji (自請離職),

odpravnine (資遣費) ni mogoče prejeti

(18. člen zakona o temeljnih delovnih standardih).
```

Reason: The sentence now states the Taiwan rule without the Korea comparison.

Taiwan legal meaning unchanged: The voluntary-resignation condition and Article 18 citation remain intact; all subsequent exceptions and deadlines are preserved.

Verification: exact replacements only; all other bytes, numbers, links, headings, line breaks, formatting, dates and non-FAQ frontmatter preserved. Files without Korea references are byte-identical.

Sentence-variety rule §5 self-check (scoped to these edits): removed Korea comparisons without adding a repeated rhetorical pattern; kept the existing register and did not add stock openings, closing formulas, bold, invented facts, or first-person claims. Article numbers, conditions, exceptions and source links are preserved. Unrelated openings, paragraph rhythms and endings remain outside this brief’s permitted edit scope.

Required variety_metrics.py check was run for all three files. The tool supports only ko/ja/en/zh-hant and falls back to ko for this locale, so its diagnostics are not a valid locale-specific pass/fail assessment:

- 007-taiwan-divorce-lawsuit-qna.md: detected ko; exit 1; 2 uncalibrated FAIL diagnostics.

- 008-taiwan-labor-severance-law.md: detected ko; exit 1; 3 uncalibrated FAIL diagnostics.

- 009-taiwan-voluntary-resignation-severance.md: detected ko; exit 0; 0 uncalibrated FAIL diagnostics.
