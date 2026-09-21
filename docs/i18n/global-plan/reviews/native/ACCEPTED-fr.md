# ACCEPTED-fr — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `fr-a.md` and `fr-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- a#1 llms notice per reviewer. a#2 détention → 'courte peine privative de liberté (拘役)', 'emprisonnement à temps' → 'emprisonnement de 5 ans au plus'. a#3 → 'droit international privé'. a#4–a#8: R3. a#9–a#15: R2 (neutral, not 'la France'). a#16: R9. a#17–a#19 labels done mechanically — verify; 'Profil complet (en anglais)'. a#20–a#22: skip. a#23 subsistence → subsistance.
- 'groupes d’activité' → 'domaines d’intervention'; 'pour le besoin local' → 'pour répondre aux besoins locaux'; 'dans un même flux' → 'de manière intégrée'; 'de façon d’ensemble' → 'dans leur ensemble'; blog voice R7.

## Part b
Apply every P1/P2 row of `fr-b.md` under the same skip rules above.
