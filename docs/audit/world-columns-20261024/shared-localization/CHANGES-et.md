## Korea-frame localization — et

Changed sentences: 5 (including FAQ sentences and comparison lead-in clauses).

### 1. shared/et/008-taiwan-labor-severance-law.md

Original:

```text
Erinevalt mõnest õiguskorrast (näiteks Koreast) tekib Taiwanis kohustus maksta seadusjärgset lahkumishüvitist (資遣費) alles siis, kui äriühing töötaja üles ütleb; kui töötaja lahkub omal soovil, ei pea äriühing lahkumishüvitist maksma.
```

Replacement:

```text
Taiwanis tekib kohustus maksta seadusjärgset lahkumishüvitist (資遣費) alles siis, kui äriühing töötaja üles ütleb; kui töötaja lahkub omal soovil, ei pea äriühing lahkumishüvitist maksma.
```

Reason: Remove the Korea comparison from the FAQ answer.

Taiwan legal meaning unchanged: The Taiwan dismissal rule, voluntary-resignation rule and following Article 14 exception are unchanged.

### 2. shared/et/008-taiwan-labor-severance-law.md

Original:

```text
Võrdlus mõne teise õiguskorraga, näiteks Koreaga, on järgmine.
```

Replacement:

```text
Taiwanis sõltub lahkumishüvitise maksmine töösuhte lõpetamise alusest.
```

Reason: Replace the Korea comparison lead-in with the existing Taiwan framework.

Taiwan legal meaning unchanged: Taiwan entitlement still depends on the ground for ending employment, as explained immediately below.

### 3. shared/et/008-taiwan-labor-severance-law.md

Original:

```text
Mõnes õiguskorras, näiteks Koreas, peab äriühing maksma lahkumishüvitist, kui töötaja lahkub.
```

Replacement:

```text
Töösuhte lõppemine ei anna Taiwanis iseenesest õigust lahkumishüvitisele.
```

Reason: Replace the Korea-only rule with the Taiwan rule already stated in the article.

Taiwan legal meaning unchanged: No Taiwan condition or exception is changed; ending employment alone does not establish entitlement.

### 4. shared/et/008-taiwan-labor-severance-law.md

Original:

```text
Taiwanis on olukord siiski teine:
```

Replacement:

```text
Taiwanis kehtib järgmine reegel:
```

Reason: Remove the dependent contrast with Korea after localizing the preceding sentences.

Taiwan legal meaning unchanged: Only the comparison lead-in changes; the Taiwan rule that follows remains verbatim.

### 5. shared/et/009-taiwan-voluntary-resignation-severance.md

Original:

```text
ja see erineb mõne teise õiguskorra, näiteks Korea, korrast.
```

Replacement:

```text
välja arvatud allpool kirjeldatud erandjuhtudel.
```

Reason: Replace the Korea comparison clause with a reference to the existing exceptions below.

Taiwan legal meaning unchanged: The Article 18 general rule and all Article 14 exceptions, conditions and time limits remain unchanged.

## Verification

- All three articles match their original bytes plus the exact replacements above. Column 007 contains no Korea references and is byte-identical.
- Numbers, dates, links, headings, tables, image paths, blank-line layout and frontmatter other than the affected FAQ answer are unchanged.
- Sentence counts include independently formatted comparison clauses and the separate FAQ occurrence; each logged replacement is counted once.
- Sentence-variety rule §5 manual check: existing openings and endings are unchanged (items 2 and 7); edits retain the existing sentence and paragraph layout (items 3 and 4); citations and their positions are unchanged (item 5); Korea comparisons and their dependent contrast wording are removed (item 6); no bold, invented experience or new headings were added (item 8); Taiwan obligations, negations, conditions, exceptions and all numeric tokens and links are preserved (item 9). Wider stylistic changes are outside this minimal-edit brief.
- Automated §5 check: ran 'python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check' on all three locale files. The checker supports only ko, ja, en and zh-hant, defaults et to ko, and reported 6 FAIL results using Korean rules. These are not a valid assessment of et; a zero-FAIL result is not claimed, and unrelated sentences were left unchanged as required by the brief.
