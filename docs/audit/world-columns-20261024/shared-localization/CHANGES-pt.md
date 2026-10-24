
## Korea-frame localization — pt

Sentences changed: 3. FAQ and body occurrences are counted separately; a sentence spanning several paragraphs is counted once.

### 1. shared/pt/008-taiwan-labor-severance-law.md

Original (exact):

```text
Ao contrário de alguns ordenamentos (por exemplo a Coreia), em Taiwan a obrigação de pagar a indemnização por despedimento (資遣費) só nasce quando a sociedade despede a pessoa empregada; se a pessoa empregada se demitir ela própria, a sociedade não tem de pagar indemnização por despedimento.
```

Replacement (exact):

```text
Em Taiwan, a obrigação de pagar a indemnização por despedimento (資遣費) só nasce quando a sociedade despede a pessoa empregada; se a pessoa empregada se demitir ela própria, a sociedade não tem de pagar indemnização por despedimento.
```

Reason: Remove the FAQ's Korea comparison.

Taiwan legal meaning unchanged: The employer-dismissal condition, voluntary-resignation rule and following Article 14 exception are unchanged.

### 2. shared/pt/008-taiwan-labor-severance-law.md

Original (exact):

```text
Em alguns ordenamentos, por exemplo na Coreia, a sociedade deve pagar uma indemnização de saída quando os trabalhadores deixam a empresa

Em Taiwan, a regra é contudo diferente:
```

Replacement (exact):

```text
Em Taiwan, o direito à indemnização por despedimento depende

da forma como termina a relação laboral:
```

Reason: Replace the Korea example and its dependent comparison with a Taiwan-only introduction.

Taiwan legal meaning unchanged: The following Taiwan dismissal and resignation rules, including the Article 14 exception, are untouched.

### 3. shared/pt/009-taiwan-voluntary-resignation-severance.md

Original (exact):

```text
Isso difere de alguns outros ordenamentos, por exemplo do coreano.
```

Replacement (exact):

```text
Esta é a regra geral em Taiwan.
```

Reason: Replace the standalone comparison with Korean law with a reference to the Taiwan rule just stated.

Taiwan legal meaning unchanged: The preceding voluntary-resignation rule and Article 18 citation, and the following exceptions and deadlines, remain byte-identical.

Verification: exact replacements only; all other bytes, numbers, links, headings, line breaks, formatting, dates and non-FAQ frontmatter preserved. Files without Korea references are byte-identical.

Sentence-variety rule §5 self-check (scoped to these edits): removed Korea comparisons without adding a repeated rhetorical pattern; kept the existing register and did not add stock openings, closing formulas, bold, invented facts, or first-person claims. Article numbers, conditions, exceptions and source links are preserved. Unrelated openings, paragraph rhythms and endings remain outside this brief’s permitted edit scope.

Required variety_metrics.py check was run for all three files. The tool supports only ko/ja/en/zh-hant and falls back to ko for this locale, so its diagnostics are not a valid locale-specific pass/fail assessment:

- 007-taiwan-divorce-lawsuit-qna.md: detected ko; exit 1; 4 uncalibrated FAIL diagnostics.

- 008-taiwan-labor-severance-law.md: detected ko; exit 1; 3 uncalibrated FAIL diagnostics.

- 009-taiwan-voluntary-resignation-severance.md: detected ko; exit 1; 3 uncalibrated FAIL diagnostics.
