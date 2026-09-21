# ACCEPTED-uk — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `uk-a.md` and `uk-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- a#4: apply feminine (керівна адвокатка / Адвокатка Wei Tseng) in the pack and all column signatures; the columns currently sign 'Адвокат Wei Tseng (曾雋崴)' — change to 'Адвокатка Wei Tseng (曾雋崴)' in all 18.
- a#10 '3 особою' → 'третьою особою' (checker now allows words, R11).
- a#13, a#21: R3 wording.

## Part b
Apply every P1/P2 row of `uk-b.md` under the same skip rules above.
