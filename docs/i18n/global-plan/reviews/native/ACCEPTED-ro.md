# ACCEPTED-ro — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `ro-a.md` and `ro-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- a#2: keep the bio fact; format as `1,57 mil. TWD` (or `1.570.000 TWD` if the checker rejects the abbreviation).
- a#9 'a șezut' → 'a locuit': also check 002–009 for the same verb.
- 'societate fiică' → 'filială' everywhere (systemic).
- French guillemets → „ghilimele” (R6).

## Part b
Apply every P1/P2 row of `ro-b.md` under the same skip rules above.
