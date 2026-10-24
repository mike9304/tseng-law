
## Korea-frame localization — nb

Sentences changed: 3. FAQ and body occurrences are counted separately; a sentence spanning several paragraphs is counted once.

### 1. shared/nb/008-taiwan-labor-severance-law.md

Original (exact):

```text
I motsetning til det som gjelder i noen andre land — Korea er ett eksempel — oppstår plikten til å betale sluttvederlag (資遣費) i Taiwan først når arbeidsgiveren sier opp arbeidstakeren; sier arbeidstakeren selv opp, trenger selskapet ikke å utbetale sluttvederlag.
```

Replacement (exact):

```text
I Taiwan oppstår plikten til å betale sluttvederlag (資遣費) først når arbeidsgiveren sier opp arbeidstakeren; sier arbeidstakeren selv opp, trenger selskapet ikke å utbetale sluttvederlag.
```

Reason: The FAQ comparison with Korea does not help this locale's readers.

Taiwan legal meaning unchanged: The employer-dismissal condition and voluntary-resignation rule remain exact in substance; the following Article 14 exception is untouched.

### 2. shared/nb/008-taiwan-labor-severance-law.md

Original (exact):

```text
I noen land — Korea er ett eksempel — skal selskapet betale sluttvederlag når arbeidstakeren slutter

I Taiwan er ordningen en annen:
```

Replacement (exact):

```text
I Taiwan avhenger retten til sluttvederlag av

hvordan arbeidsforholdet avsluttes:
```

Reason: The Korea statement and its dependent comparative transition are replaced by a Taiwan-only introduction.

Taiwan legal meaning unchanged: The following Taiwan dismissal rule, voluntary-resignation rule and Article 14 exception are untouched.

### 3. shared/nb/009-taiwan-voluntary-resignation-severance.md

Original (exact):

```text
Særlig når arbeidstakere selv sier opp (自請離職),

kan de ikke motta sluttvederlag (artikkel 18 i loven om arbeidsnormer, 勞動基準法),

og dette skiller seg fra ordningen i enkelte andre land, for eksempel Korea.
```

Replacement (exact):

```text
Særlig når arbeidstakere selv sier opp (自請離職),

kan de ikke motta sluttvederlag (artikkel 18 i loven om arbeidsnormer, 勞動基準法)

etter reglene i Taiwan.
```

Reason: The sentence now states the Taiwan rule without a comparison with Korea.

Taiwan legal meaning unchanged: The voluntary-resignation rule and Article 18 citation are preserved; the following Article 14/17 exceptions and deadlines are untouched.

Verification: exact replacements only; all other bytes, numbers, links, headings, line breaks, formatting, dates and non-FAQ frontmatter preserved. Files without Korea references are byte-identical.

Sentence-variety rule §5 self-check (scoped to these edits): removed Korea comparisons without adding a repeated rhetorical pattern; kept the existing register and did not add stock openings, closing formulas, bold, invented facts, or first-person claims. Article numbers, conditions, exceptions and source links are preserved. Unrelated openings, paragraph rhythms and endings remain outside this brief’s permitted edit scope.

Required variety_metrics.py check was run for all three files. The tool supports only ko/ja/en/zh-hant and falls back to ko for this locale, so its diagnostics are not a valid locale-specific pass/fail assessment:

- 007-taiwan-divorce-lawsuit-qna.md: detected ko; exit 1; 3 uncalibrated FAIL diagnostics.

- 008-taiwan-labor-severance-law.md: detected ko; exit 1; 3 uncalibrated FAIL diagnostics.

- 009-taiwan-voluntary-resignation-severance.md: detected ko; exit 1; 1 uncalibrated FAIL diagnostics.
