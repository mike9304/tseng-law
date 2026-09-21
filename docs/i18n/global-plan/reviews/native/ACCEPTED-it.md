# ACCEPTED-it — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `it-a.md` and `it-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- a#14: keep the fact; format as '1,57 milioni di TWD'.
- French calques (pezzi, cocontraente, pretende, in contropartita, 'un 3') → sweep all 18 columns (R11 allows 'un terzo').
- a#10 invented court name → 'Alta Corte di Taiwan (臺灣高等法院)'; ROC year → add the Gregorian year in parentheses.
- Lei consistently; remove 'voi' imperatives in 002.
- Also apply the supervisor's own rows in it-supervisor.md (P1 #1, P2 #2–#10).

## Part b
Apply every P1/P2 row of `it-b.md` under the same skip rules above.
