
## Korea-frame localization — nl

Sentences changed: 6. FAQ and body occurrences are counted separately; a sentence spanning several paragraphs is counted once.

### 1. shared/nl/007-taiwan-divorce-lawsuit-qna.md

Original (exact):

```text
Vooral bij gezinnen die met 2 of meer staten of gebieden zijn verbonden — Taiwan (臺灣) en een ander land, bijvoorbeeld Korea (韓國) — kan de procedure niet alleen aan de hand van de nationaliteit van 1 van de partijen of van de plaats van huwelijkssluiting worden vastgesteld.
```

Replacement (exact):

```text
Vooral bij gezinnen die met 2 of meer staten of gebieden zijn verbonden — Taiwan (臺灣) en een ander land of gebied — kan de procedure niet alleen aan de hand van de nationaliteit van 1 van de partijen of van de plaats van huwelijkssluiting worden vastgesteld.
```

Reason: The cross-border family example unnecessarily singles out Korea.

Taiwan legal meaning unchanged: The multi-jurisdictional scope and the limits of using nationality or place of marriage alone are unchanged.

### 2. shared/nl/007-taiwan-divorce-lawsuit-qna.md

Original (exact):

```text
Alleen de afspraak dat het kind buiten Taiwan gaat wonen — bijvoorbeeld in Korea — maakt het levenspeil daar niet tot een zelfstandige formule voor de kinderalimentatie.
```

Replacement (exact):

```text
Alleen de afspraak dat het kind buiten Taiwan gaat wonen maakt het levenspeil daar niet tot een zelfstandige formule voor de kinderalimentatie.
```

Reason: Remove Korea as the unnecessary example of the child's foreign residence.

Taiwan legal meaning unchanged: The rule that foreign living standards alone do not determine child support is unchanged; all following factors remain untouched.

### 3. shared/nl/008-taiwan-labor-severance-law.md

Original (exact):

```text
Anders dan in sommige andere landen — Korea is daarvan een voorbeeld — ontstaat in Taiwan de plicht tot betaling van de ontslagvergoeding (資遣費) pas wanneer de werkgever de werknemer ontslaat; neemt de werknemer zelf ontslag, dan hoeft de vennootschap geen ontslagvergoeding te betalen.
```

Replacement (exact):

```text
In Taiwan ontstaat de plicht tot betaling van de ontslagvergoeding (資遣費) pas wanneer de werkgever de werknemer ontslaat; neemt de werknemer zelf ontslag, dan hoeft de vennootschap geen ontslagvergoeding te betalen.
```

Reason: Remove the FAQ's Korea comparison.

Taiwan legal meaning unchanged: The dismissal condition, voluntary-resignation rule and untouched following Article 14 exception are preserved.

### 4. shared/nl/008-taiwan-labor-severance-law.md

Original (exact):

```text
In sommige andere landen — Korea bijvoorbeeld — moet de vennootschap een ontslagvergoeding betalen wanneer werknemers vertrekken.
```

Replacement (exact):

```text
In Taiwan hangt het recht op een ontslagvergoeding af van de manier waarop het dienstverband eindigt.
```

Reason: Replace the foreign-law example with an introduction to Taiwan's rules.

Taiwan legal meaning unchanged: The following dismissal and resignation rules, including the Article 14 exception, are unchanged.

### 5. shared/nl/008-taiwan-labor-severance-law.md

Original (exact):

```text
In Taiwan ligt dat anders:
```

Replacement (exact):

```text
Daarvoor geldt de volgende hoofdregel:
```

Reason: The word 'dat' refers back to the removed Korea comparison; replace this dependent comparative clause to make the Taiwan explanation stand on its own.

Taiwan legal meaning unchanged: The legal statement following the colon remains byte-identical.

### 6. shared/nl/009-taiwan-voluntary-resignation-severance.md

Original (exact):

```text
In het bijzonder wanneer werknemers zelf ontslag nemen (自請離職),

kunnen zij geen ontslagvergoeding ontvangen (artikel 18 van de wet op de arbeidsnormen, 勞動基準法),

en dat verschilt van de regels in veel andere landen, waaronder Korea.
```

Replacement (exact):

```text
In het bijzonder wanneer werknemers zelf ontslag nemen (自請離職),

kunnen zij geen ontslagvergoeding ontvangen (artikel 18 van de wet op de arbeidsnormen, 勞動基準法)

volgens de regels in Taiwan.
```

Reason: Replace the Korea comparison with the applicable Taiwan context.

Taiwan legal meaning unchanged: The voluntary-resignation rule and Article 18 citation remain intact, as do all subsequent exceptions and deadlines.

Verification: exact replacements only; all other bytes, numbers, links, headings, line breaks, formatting, dates and non-FAQ frontmatter preserved. Files without Korea references are byte-identical.

Sentence-variety rule §5 self-check (scoped to these edits): removed Korea comparisons without adding a repeated rhetorical pattern; kept the existing register and did not add stock openings, closing formulas, bold, invented facts, or first-person claims. Article numbers, conditions, exceptions and source links are preserved. Unrelated openings, paragraph rhythms and endings remain outside this brief’s permitted edit scope.

Required variety_metrics.py check was run for all three files. The tool supports only ko/ja/en/zh-hant and falls back to ko for this locale, so its diagnostics are not a valid locale-specific pass/fail assessment:

- 007-taiwan-divorce-lawsuit-qna.md: detected ko; exit 1; 4 uncalibrated FAIL diagnostics.

- 008-taiwan-labor-severance-law.md: detected ko; exit 1; 3 uncalibrated FAIL diagnostics.

- 009-taiwan-voluntary-resignation-severance.md: detected ko; exit 1; 1 uncalibrated FAIL diagnostics.
