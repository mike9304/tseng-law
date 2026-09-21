# ACCEPTED-tr — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `tr-a.md` and `tr-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- a#1 görüşme (會面交往) → 'kişisel ilişki kurma hakkı (會面交往)'; a#2 konum → 'işim/meselem'; a#3 kurum → 'düzenleme'; a#4 llms notice per reviewer.
- a#5–a#11: R2 (neutral, not 'Türkiye'). a#12 tutuklama → 'kısa süreli hapis (拘役)'. a#13–a#16: R3. a#17: R9 (Tayvan'da 119/110/112).
- a#18–a#20 labels done mechanically — verify; 'Tam profil (İngilizce)'. a#21: skip.
- Turkish typography: %10 (percent before number), guillemets → "…"; '3. kişi' → 'üçüncü kişi', '2. derece' → 'istinaf' (R11); blog voice R7.

## Part b
Apply every P1/P2 row of `tr-b.md` under the same skip rules above.
