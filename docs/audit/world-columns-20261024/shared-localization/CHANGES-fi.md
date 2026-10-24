## Korea-frame localization — fi

Changed sentences: 4 (including FAQ sentences and comparison lead-in clauses).

### 1. shared/fi/008-taiwan-labor-severance-law.md

Original:

```text
Toisin kuin joissakin muissa maissa — Korea on yksi esimerkki — velvollisuus
```

Replacement:

```text
Velvollisuus
```

Reason: Remove the Korea comparison from the FAQ sentence.

Taiwan legal meaning unchanged: The Taiwan dismissal and voluntary-resignation rules and the following Article 14 exception remain unchanged.

### 2. shared/fi/008-taiwan-labor-severance-law.md

Original:

```text
Joissakin maissa, esimerkiksi Koreassa, yhtiön on maksettava eroraha, kun työntekijä lähtee.
```

Replacement:

```text
Taiwanissa työsuhteen päättyminen ei yksin oikeuta erorahaan.
```

Reason: Replace the Korea-only rule with the Taiwan rule already explained below.

Taiwan legal meaning unchanged: Ending employment alone does not establish Taiwan severance entitlement; all grounds and exceptions remain unchanged.

### 3. shared/fi/008-taiwan-labor-severance-law.md

Original:

```text
Taiwanissa tilanne on kuitenkin toinen:
```

Replacement:

```text
Taiwanissa sääntö on seuraava:
```

Reason: Remove the dependent contrast with Korea.

Taiwan legal meaning unchanged: Only the comparison lead-in changes; the following Taiwan rule remains verbatim.

### 4. shared/fi/009-taiwan-voluntary-resignation-severance.md

Original:

```text
ja tämä eroaa eräiden muiden maiden, esimerkiksi Korean, järjestelmästä.
```

Replacement:

```text
ellei kyse ole jäljempänä kuvatuista poikkeustapauksista.
```

Reason: Replace the Korea comparison with a reference to the existing exceptions below.

Taiwan legal meaning unchanged: The Article 18 general rule and all Article 14 exceptions, conditions and time limits remain unchanged.

## Verification

- All three articles match their original bytes plus the exact replacements above. Column 007 contains no Korea references and is byte-identical.
- Numbers, dates, links, headings, tables, image paths, blank-line layout and frontmatter other than the affected FAQ answer are unchanged.
- Sentence counts include independently formatted comparison clauses and the separate FAQ occurrence; each logged replacement is counted once.
- Sentence-variety rule §5 manual check: existing openings and endings are unchanged (items 2 and 7); edits retain the existing sentence and paragraph layout (items 3 and 4); citations and their positions are unchanged (item 5); Korea comparisons and their dependent contrast wording are removed (item 6); no bold, invented experience or new headings were added (item 8); Taiwan obligations, negations, conditions, exceptions and all numeric tokens and links are preserved (item 9). Wider stylistic changes are outside this minimal-edit brief.
- Automated §5 check: ran 'python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check' on all three locale files. The checker supports only ko, ja, en and zh-hant, defaults fi to ko, and reported 7 FAIL results using Korean rules. These are not a valid assessment of fi; a zero-FAIL result is not claimed, and unrelated sentences were left unchanged as required by the brief.
