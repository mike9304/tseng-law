
## Korea-frame localization — sk

Sentences changed: 4. FAQ and body occurrences are counted separately; a sentence spanning several paragraphs is counted once.

### 1. shared/sk/008-taiwan-labor-severance-law.md

Original (exact):

```text
Na rozdiel od niektorých právnych poriadkov (napríklad Kórey) vzniká na Taiwane povinnosť vyplatiť odstupné (資遣費) až vtedy, keď spoločnosť zamestnanca prepustí; ak zamestnanec odíde sám, spoločnosť odstupné vyplácať nemusí.
```

Replacement (exact):

```text
Na Taiwane vzniká povinnosť vyplatiť odstupné (資遣費) až vtedy, keď spoločnosť zamestnanca prepustí; ak zamestnanec odíde sám, spoločnosť odstupné vyplácať nemusí.
```

Reason: Remove the FAQ's comparison with Korea.

Taiwan legal meaning unchanged: The dismissal condition and voluntary-resignation rule remain unchanged; the following Article 14 exception is untouched.

### 2. shared/sk/008-taiwan-labor-severance-law.md

Original (exact):

```text
V niektorých právnych poriadkoch, napríklad v Kórei, musí spoločnosť vyplatiť odstupné aj vtedy, keď zamestnanec odíde sám.
```

Replacement (exact):

```text
Na Taiwane nárok na odstupné závisí od spôsobu skončenia pracovného pomeru.
```

Reason: Replace the Korea example with an introduction to Taiwan's rules.

Taiwan legal meaning unchanged: All following Taiwan dismissal and resignation rules, including the Article 14 exception, are preserved.

### 3. shared/sk/008-taiwan-labor-severance-law.md

Original (exact):

```text
Na Taiwane je to inak:
```

Replacement (exact):

```text
Platí toto všeobecné pravidlo:
```

Reason: The dependent comparison points back to Korea; replace it with a neutral introduction.

Taiwan legal meaning unchanged: The legal statement following the colon remains byte-identical.

### 4. shared/sk/009-taiwan-voluntary-resignation-severance.md

Original (exact):

```text
Zvlášť ak zamestnanec odíde z vlastnej vôle (自請離職),

nemôže dostať odstupné (資遣費) (článok 18 zákona o pracovných normách),

čo sa líši od úpravy v niektorých jurisdikciách, napríklad v Kórei.
```

Replacement (exact):

```text
Ak zamestnanec na Taiwane odíde z vlastnej vôle (自請離職),

nemôže dostať odstupné (資遣費)

(článok 18 zákona o pracovných normách).
```

Reason: State the Taiwan rule directly without a Korea comparison.

Taiwan legal meaning unchanged: The voluntary-resignation condition and Article 18 citation remain intact; subsequent exceptions and deadlines are untouched.

Verification: exact replacements only; all other bytes, numbers, links, headings, line breaks, formatting, dates and non-FAQ frontmatter preserved. Files without Korea references are byte-identical.

Sentence-variety rule §5 self-check (scoped to these edits): removed Korea comparisons without adding a repeated rhetorical pattern; kept the existing register and did not add stock openings, closing formulas, bold, invented facts, or first-person claims. Article numbers, conditions, exceptions and source links are preserved. Unrelated openings, paragraph rhythms and endings remain outside this brief’s permitted edit scope.

Required variety_metrics.py check was run for all three files. The tool supports only ko/ja/en/zh-hant and falls back to ko for this locale, so its diagnostics are not a valid locale-specific pass/fail assessment:

- 007-taiwan-divorce-lawsuit-qna.md: detected ko; exit 1; 2 uncalibrated FAIL diagnostics.

- 008-taiwan-labor-severance-law.md: detected ko; exit 1; 3 uncalibrated FAIL diagnostics.

- 009-taiwan-voluntary-resignation-severance.md: detected ko; exit 0; 0 uncalibrated FAIL diagnostics.
