## SHARED-LOCALIZE — 2026-10-24

Changed sentences: 3.

### Change 1

File: `shared/is/008-taiwan-labor-severance-law.md`

Reason: The FAQ frames Taiwan severance rules through a comparison with Korea.

Original:

```text
Ólíkt því sem gildir í sumum öðrum lögsagnarumdæmum — Kórea er eitt dæmi — myndast skylda til greiðslu lögboðinna starfslokabóta samkvæmt rétti Taívan (資遣費) fyrst þegar félagið segir starfsmanninum upp; segi starfsmaðurinn sjálfur upp, þarf félagið ekki að greiða starfslokabætur.
```

Replacement:

```text
Skylda til greiðslu lögboðinna starfslokabóta samkvæmt rétti Taívan (資遣費) myndast fyrst þegar félagið segir starfsmanninum upp; segi starfsmaðurinn sjálfur upp, þarf félagið ekki að greiða starfslokabætur.
```

Taiwan legal meaning unchanged: The employer-initiated termination condition and voluntary-resignation rule are retained; the following Article 14 exception is untouched.

### Change 2

File: `shared/is/008-taiwan-labor-severance-law.md`

Reason: A Korea-specific rule introduces the Taiwan explanation; a tentative assumption keeps the following contrast coherent without comparing jurisdictions.

Original:

```text
Í sumum öðrum lögsagnarumdæmum — Kórea er eitt dæmi — skal félagið greiða starfslokabætur þegar starfsmaður lætur af störfum.
```

Replacement:

```text
Ætla mætti að félagið þurfi að greiða starfslokabætur í hvert sinn sem starfsmaður lætur af störfum.
```

Taiwan legal meaning unchanged: No Taiwan rule is changed; the following employer-initiated termination requirement, voluntary-resignation rule, and Article 14 exception remain exactly as written.

### Change 3

File: `shared/is/009-taiwan-voluntary-resignation-severance.md`

Reason: The sentence compares the Taiwan rule with Korea instead of stating the Taiwan position directly.

Original:

```text
Þetta er ólíkt því sem gildir í sumum öðrum lögsagnarumdæmum — Kórea er eitt dæmi.
```

Replacement:

```text
Á Taívan veita starfslok því ekki sjálfkrafa rétt til starfslokabóta.
```

Taiwan legal meaning unchanged: The general absence of automatic severance entitlement is retained, as are the preceding Article 18 rule and the following Article 14 exceptions.

### Verification

Verified exact replacements only: Taiwan legal conditions, exceptions, article numbers, all other numbers, links, non-FAQ frontmatter, dates, headings, and formatting are unchanged. Files without Korea references are byte-identical. Section 5 self-check: reviewed the changed sentences in context, removed the Korea comparison, and introduced no new opening, heading, quotation, emphasis, invented experience, or closing formula; unrelated sentence rhythm and existing prose were preserved as the brief requires. Ran variety_metrics.py on all three files before and after editing. The checker supports only ko, ja, en, and zh-hant and defaults to ko for this locale; its reported style failures are not validated metrics for this language and do not authorize rewriting unrelated sentences. No full-column style pass is claimed. Sentence counts include each occurrence separately, including repeated FAQ/body text.
