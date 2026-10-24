## SHARED-LOCALIZE — 2026-10-24

Changed sentences: 3.

### Change 1

File: `shared/lv/008-taiwan-labor-severance-law.md`

Reason: The FAQ compares Taiwan with Korea.

Original:

```text
Atšķirībā no dažām valstīm (piemēram, Korejas) Taivānā pienākums izmaksāt likumā noteikto atlaišanas pabalstu (資遣費) rodas tikai tad, kad sabiedrība darbinieku atlaiž; ja darbinieks aiziet pēc paša gribas, sabiedrībai atlaišanas pabalsts nav jāizmaksā.
```

Replacement:

```text
Taivānā pienākums izmaksāt likumā noteikto atlaišanas pabalstu (資遣費) rodas tikai tad, kad sabiedrība darbinieku atlaiž; ja darbinieks aiziet pēc paša gribas, sabiedrībai atlaišanas pabalsts nav jāizmaksā.
```

Taiwan legal meaning unchanged: The Taiwan employer-initiated termination condition and voluntary-resignation rule are unchanged, as is the subsequent Article 14 exception.

### Change 2

File: `shared/lv/008-taiwan-labor-severance-law.md`

Reason: The Korea-specific claim is replaced with a tentative assumption, preserving the flow into the Taiwan explanation.

Original:

```text
Dažās valstīs, piemēram, Korejā, sabiedrībai atlaišanas pabalsts jāizmaksā arī tad, kad darbinieks aiziet pats.
```

Replacement:

```text
Varētu šķist, ka sabiedrībai atlaišanas pabalsts jāizmaksā arī tad, kad darbinieks aiziet pats.
```

Taiwan legal meaning unchanged: The Taiwan rules and the Article 14 exception in the following sentences remain word-for-word unchanged.

### Change 3

File: `shared/lv/009-taiwan-voluntary-resignation-severance.md`

Reason: The concluding clause compares the Taiwan rule with Korea.

Original:

```text
kas atšķiras no regulējuma dažās valstīs, piemēram, Korejā.
```

Replacement:

```text
tātad Taivānā darba attiecību izbeigšanās pati par sevi nerada tiesības uz šo pabalstu.
```

Taiwan legal meaning unchanged: The conclusion still describes the absence of automatic entitlement in Taiwan; the Article 18 reference and the later Article 14 exceptions remain unchanged.

### Verification

Verified exact replacements only: Taiwan legal conditions, exceptions, article numbers, all other numbers, links, non-FAQ frontmatter, dates, headings, and formatting are unchanged. Files without Korea references are byte-identical. Section 5 self-check: reviewed the changed sentences in context, removed the Korea comparison, and introduced no new opening, heading, quotation, emphasis, invented experience, or closing formula; unrelated sentence rhythm and existing prose were preserved as the brief requires. Ran variety_metrics.py on all three files before and after editing. The checker supports only ko, ja, en, and zh-hant and defaults to ko for this locale; its reported style failures are not validated metrics for this language and do not authorize rewriting unrelated sentences. No full-column style pass is claimed. Sentence counts include each occurrence separately, including repeated FAQ/body text.
