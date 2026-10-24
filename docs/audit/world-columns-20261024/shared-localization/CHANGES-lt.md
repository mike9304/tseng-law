## SHARED-LOCALIZE — 2026-10-24

Changed sentences: 3.

### Change 1

File: `shared/lt/008-taiwan-labor-severance-law.md`

Reason: The FAQ frames Taiwan law through a comparison with Korea.

Original:

```text
Skirtingai nei kai kuriose jurisdikcijose (pavyzdžiui, Korėjoje), Taivane pareiga mokėti išeitinę išmoką pagal Taivano teisę (資遣費) atsiranda tik tada, kai bendrovė atleidžia darbuotoją; jei darbuotojas išeina savo noru, bendrovė išeitinės išmokos mokėti neprivalo.
```

Replacement:

```text
Taivane pareiga mokėti išeitinę išmoką pagal Taivano teisę (資遣費) atsiranda tik tada, kai bendrovė atleidžia darbuotoją; jei darbuotojas išeina savo noru, bendrovė išeitinės išmokos mokėti neprivalo.
```

Taiwan legal meaning unchanged: Only the comparative introduction is removed; the Taiwan eligibility rule, voluntary-resignation condition, and following Article 14 exception are unchanged.

### Change 2

File: `shared/lt/008-taiwan-labor-severance-law.md`

Reason: The Korea-specific rule is replaced with a tentative assumption that the following Taiwan explanation addresses.

Original:

```text
Kai kuriose jurisdikcijose, pavyzdžiui, Korėjoje, bendrovė išeitinę išmoką privalo mokėti ir tada, kai darbuotojas išeina pats.
```

Replacement:

```text
Gali atrodyti, kad bendrovė išeitinę išmoką privalo mokėti ir tada, kai darbuotojas išeina pats.
```

Taiwan legal meaning unchanged: The following Taiwan rules, including the employer-initiated termination condition and Article 14 exception, remain exactly as written.

### Change 3

File: `shared/lt/009-taiwan-voluntary-resignation-severance.md`

Reason: The sentence ends with a Korea comparison; its conclusion now states the Taiwan position directly.

Original:

```text
tai skiriasi nuo kai kurių jurisdikcijų, pavyzdžiui, Korėjos.
```

Replacement:

```text
tad Taivane vien darbo santykių pabaiga teisės į šią išmoką nesuteikia.
```

Taiwan legal meaning unchanged: The general absence of automatic entitlement is retained; the Article 18 reference and the later Article 14 exceptions are untouched.

### Verification

Verified exact replacements only: Taiwan legal conditions, exceptions, article numbers, all other numbers, links, non-FAQ frontmatter, dates, headings, and formatting are unchanged. Files without Korea references are byte-identical. Section 5 self-check: reviewed the changed sentences in context, removed the Korea comparison, and introduced no new opening, heading, quotation, emphasis, invented experience, or closing formula; unrelated sentence rhythm and existing prose were preserved as the brief requires. Ran variety_metrics.py on all three files before and after editing. The checker supports only ko, ja, en, and zh-hant and defaults to ko for this locale; its reported style failures are not validated metrics for this language and do not authorize rewriting unrelated sentences. No full-column style pass is claimed. Sentence counts include each occurrence separately, including repeated FAQ/body text.
