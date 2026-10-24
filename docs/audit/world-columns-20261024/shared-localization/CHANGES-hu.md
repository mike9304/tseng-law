## Korea-frame localization — hu

Changed sentences: 4 (including FAQ sentences and comparison lead-in clauses).

### 1. shared/hu/008-taiwan-labor-severance-law.md

Original:

```text
Egyes más jogrendszerektől – például Koreától – eltérően Tajvanon
```

Replacement:

```text
Tajvanon
```

Reason: Remove the Korea comparison from the FAQ sentence.

Taiwan legal meaning unchanged: The Taiwan dismissal and voluntary-resignation rules and the following Article 14 exception remain unchanged.

### 2. shared/hu/008-taiwan-labor-severance-law.md

Original:

```text
Egyes jogrendszerekben – például Koreában – a társaság végkielégítést köteles fizetni, amikor a munkavállaló elhagyja a vállalkozást.
```

Replacement:

```text
Tajvanon önmagában a munkaviszony megszűnése nem jogosít végkielégítésre.
```

Reason: Replace the Korea-only rule with the Taiwan rule already explained below.

Taiwan legal meaning unchanged: Ending employment alone does not establish Taiwan severance entitlement; all grounds and exceptions remain unchanged.

### 3. shared/hu/008-taiwan-labor-severance-law.md

Original:

```text
Tajvanon ez másként van.
```

Replacement:

```text
A jogosultság a munkaviszony megszűnésének okától függ.
```

Reason: Replace the dependent Korea contrast with the existing Taiwan entitlement framework.

Taiwan legal meaning unchanged: Taiwan entitlement still depends on the ground for ending employment, with all following rules and exceptions unchanged.

### 4. shared/hu/009-taiwan-voluntary-resignation-severance.md

Original:

```text
ami egyes más jogrendszerektől – például Koreától – eltér.
```

Replacement:

```text
kivéve az alább ismertetett eseteket.
```

Reason: Replace the Korea comparison clause with a reference to the existing exceptions below.

Taiwan legal meaning unchanged: The Article 18 general rule and all Article 14 exceptions, conditions and time limits remain unchanged.

## Verification

- All three articles match their original bytes plus the exact replacements above. Column 007 contains no Korea references and is byte-identical.
- Numbers, dates, links, headings, tables, image paths, blank-line layout and frontmatter other than the affected FAQ answer are unchanged.
- Sentence counts include independently formatted comparison clauses and the separate FAQ occurrence; each logged replacement is counted once.
- Sentence-variety rule §5 manual check: existing openings and endings are unchanged (items 2 and 7); edits retain the existing sentence and paragraph layout (items 3 and 4); citations and their positions are unchanged (item 5); Korea comparisons and their dependent contrast wording are removed (item 6); no bold, invented experience or new headings were added (item 8); Taiwan obligations, negations, conditions, exceptions and all numeric tokens and links are preserved (item 9). Wider stylistic changes are outside this minimal-edit brief.
- Automated §5 check: ran 'python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check' on all three locale files. The checker supports only ko, ja, en and zh-hant, defaults hu to ko, and reported 7 FAIL results using Korean rules. These are not a valid assessment of hu; a zero-FAIL result is not claimed, and unrelated sentences were left unchanged as required by the brief.
