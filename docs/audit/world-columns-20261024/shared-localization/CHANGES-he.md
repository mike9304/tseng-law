## Korea-frame localization — he

Changed sentences: 4 (including FAQ sentences and comparison lead-in clauses).

### 1. shared/he/008-taiwan-labor-severance-law.md

Original:

```text
בטאיוואן, שלא כמו בחלק מהמדינות (קוריאה, למשל),
```

Replacement:

```text
בטאיוואן,
```

Reason: Remove the Korea comparison from the FAQ sentence.

Taiwan legal meaning unchanged: The Taiwan dismissal and voluntary-resignation rules and the following Article 14 exception remain unchanged.

### 2. shared/he/008-taiwan-labor-severance-law.md

Original:

```text
במדינות מסוימות — קוריאה, למשל — על החברה לשלם מענק פרישה גם כשהעובד מפסיק מעצמו
```

Replacement:

```text
בטאיוואן, סיום העבודה כשלעצמו אינו מקנה זכות לדמי פיטורים
```

Reason: Replace the Korea-only rule with the Taiwan rule already explained below.

Taiwan legal meaning unchanged: Ending employment alone does not establish Taiwan severance entitlement; all grounds and exceptions remain unchanged.

### 3. shared/he/008-taiwan-labor-severance-law.md

Original:

```text
בטאיוואן הכלל שונה:
```

Replacement:

```text
הכלל בטאיוואן הוא:
```

Reason: Remove the dependent contrast with Korea.

Taiwan legal meaning unchanged: Only the comparison lead-in changes; the following Taiwan rule remains verbatim.

### 4. shared/he/009-taiwan-voluntary-resignation-severance.md

Original:

```text
בכך שונה טאיוואן מחלק מהמדינות (קוריאה, למשל).
```

Replacement:

```text
למעט במקרים החריגים המתוארים להלן.
```

Reason: Replace the Korea comparison clause with a reference to the existing exceptions below.

Taiwan legal meaning unchanged: The Article 18 general rule and all Article 14 exceptions, conditions and time limits remain unchanged.

## Verification

- All three articles match their original bytes plus the exact replacements above. Column 007 contains no Korea references and is byte-identical.
- Numbers, dates, links, headings, tables, image paths, blank-line layout and frontmatter other than the affected FAQ answer are unchanged.
- Sentence counts include independently formatted comparison clauses and the separate FAQ occurrence; each logged replacement is counted once.
- Sentence-variety rule §5 manual check: existing openings and endings are unchanged (items 2 and 7); edits retain the existing sentence and paragraph layout (items 3 and 4); citations and their positions are unchanged (item 5); Korea comparisons and their dependent contrast wording are removed (item 6); no bold, invented experience or new headings were added (item 8); Taiwan obligations, negations, conditions, exceptions and all numeric tokens and links are preserved (item 9). Wider stylistic changes are outside this minimal-edit brief.
- Automated §5 check: ran 'python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check' on all three locale files. The checker supports only ko, ja, en and zh-hant, defaults he to ko, and reported 4 FAIL results using Korean rules. These are not a valid assessment of he; a zero-FAIL result is not claimed, and unrelated sentences were left unchanged as required by the brief.
