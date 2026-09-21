# ACCEPTED-fil — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `fil-a.md` and `fil-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- Keep formal kayo/ninyo. a#1–a#3 labels done mechanically — verify; 'Buong profile (sa Ingles)'.
- English legal terms inside Filipino syntax: keep the established Taglish legal terms that Filipino lawyers actually use (subsidiary, work permit, articles of incorporation, PE) but give a Filipino gloss on first use and stop stacking three glosses in one parenthesis (reviewer P2 rows).
- a#4–a#6, a#13, a#14: R2 (neutral, not 'Pilipinas'). a#7: skip. a#8–a#12, a#15: R3. Blog close in 003 Q16–Q20 → R7. 'pangkat' (Tätigkeitsgruppen) → 'larangan ng serbisyo'.

## Part b
Apply every P1/P2 row of `fil-b.md` under the same skip rules above.
