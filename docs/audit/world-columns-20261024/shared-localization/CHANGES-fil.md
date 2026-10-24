## Korea-frame localization — fil

Changed sentences: 4 (including FAQ sentences and comparison lead-in clauses).

### 1. shared/fil/008-taiwan-labor-severance-law.md

Original:

```text
Hindi tulad ng ilang bansa — ang Korea ay isang halimbawa — sa Taiwan
```

Replacement:

```text
Sa Taiwan
```

Reason: Remove the Korea comparison from the FAQ sentence.

Taiwan legal meaning unchanged: The Taiwan dismissal rule and all following voluntary-resignation and Article 14 statements remain unchanged.

### 2. shared/fil/008-taiwan-labor-severance-law.md

Original:

```text
Sa Korea, kapag umalis sa trabaho ang isang empleyado ay kailangang magbayad ang kompanya ng retirement allowance (退職金); panuntunan iyon ng batas ng Korea, hindi ng Taiwan.
```

Replacement:

```text
Sa Taiwan, hindi awtomatikong may separation pay kapag umalis sa trabaho ang isang empleyado.
```

Reason: Replace the Korea-only retirement-allowance explanation with the Taiwan rule already stated below.

Taiwan legal meaning unchanged: No Taiwan entitlement, condition or exception changes; the removed retirement-allowance terminology described Korean law only.

### 3. shared/fil/008-taiwan-labor-severance-law.md

Original:

```text
Ngunit hindi tulad ng ilang bansa (halimbawa ang Korea), iba ang tuntunin sa Taiwan.
```

Replacement:

```text
Nakabatay ang karapatan sa separation pay sa dahilan ng pagwawakas ng kontrata.
```

Reason: Replace the Korea comparison with the existing Taiwan entitlement framework.

Taiwan legal meaning unchanged: Taiwan entitlement still depends on the ground for ending employment, with the following rules and exceptions unchanged.

### 4. shared/fil/009-taiwan-voluntary-resignation-severance.md

Original:

```text
at ito ay naiiba sa ilang bansa (halimbawa ang Korea);
```

Replacement:

```text
maliban sa mga eksepsiyong nakasaad sa ibaba;
```

Reason: Replace the Korea comparison clause with a reference to the existing exceptions.

Taiwan legal meaning unchanged: The Article 18 general rule, Articles 14 and 17, all exceptions and the distinction between Taiwan 資遣費 and foreign-law terminology remain unchanged.

## Verification

- All three articles match their original bytes plus the exact replacements above. Column 007 contains no Korea references and is byte-identical.
- Numbers, dates, links, headings, tables, image paths, blank-line layout and frontmatter other than the affected FAQ answer are unchanged.
- Sentence counts include independently formatted comparison clauses and the separate FAQ occurrence; each logged replacement is counted once.
- Sentence-variety rule §5 manual check: existing openings and endings are unchanged (items 2 and 7); edits retain the existing sentence and paragraph layout (items 3 and 4); citations and their positions are unchanged (item 5); Korea comparisons and their dependent contrast wording are removed (item 6); no bold, invented experience or new headings were added (item 8); Taiwan obligations, negations, conditions, exceptions and all numeric tokens and links are preserved (item 9). Wider stylistic changes are outside this minimal-edit brief.
- Automated §5 check: ran 'python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check' on all three locale files. The checker supports only ko, ja, en and zh-hant, defaults fil to ko, and reported 9 FAIL results using Korean rules. These are not a valid assessment of fil; a zero-FAIL result is not claimed, and unrelated sentences were left unchanged as required by the brief.
