# ACCEPTED-cs — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `cs-a.md` and `cs-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- a#1 'Kierující' (Polish leak) → Czech; also check every other Polish-looking token in the cs pack (a G-category sweep).
- a#6 vazba → R8 (krátkodobý trest odnětí svobody / 拘役); a#7 zpronevěra → porušení důvěry (背信).
- taiwanský vs tchajwanský: standardize on tchajwanský (columns) in the pack too.
- Guillemets → „ “ (R6); dates 27. 12. 2023 only if the checker accepts; otherwise 27.12.2023.

## Part b
Apply every P1/P2 row of `cs-b.md` under the same skip rules above. Additional: b#9 → R3/R7 wording (no 'leave a comment', no consultation invitation beyond the contact page + four languages); b#11 fullwidth colon → sweep all files (R6b); place names: use Czech exonyms where established (Tchaj-pej, Kao-siung, Tchaj-čung) with the Chinese gloss, consistently in pack and columns; FAQ-answer openings 'Ne. Podle…' are the source structure (question is the heading) — keep, but make the first sentence self-standing where the reviewer flagged it.
