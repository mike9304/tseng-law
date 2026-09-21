# ACCEPTED-fi — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `fi-a.md` and `fi-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- a#1: apply (add 'vain'). a#2 instituutit → järjestelyt; a#3 yhtymäsuhde → työsuhde (sweep); a#4 (llms/columns notice) reviewer wording.
- a#5: 'sai … tuomion' → 'sai asiakkaalleen ensimmäisen asteen tuomion (1,57 milj. TWD)' — keep the fact, fix the meaning and number format.
- a#6–a#8 labels: done mechanically — verify; 'Koko profiili (englanniksi)'.
- a#9 mielivaltaisena → 'minä tahansa 12 kuukauden jaksona'; a#11 aresti → 'lyhyt vankeusrangaistus (拘役)'; a#12 'Olin WEI' → 'Wei Tseng (曾雋崴), asianajaja, Taiwan'.
- a#10, a#16, a#18–a#21: R2 (neutral). a#13–a#15, a#22: R3. a#17, a#23: skip (mechanical / frontmatter).
- Te-capitalisation → te (lowercase) throughout; blog voice (R7); '3. (第三人)' → 'kolmas osapuoli' (R11).

## Part b
Apply every P1/P2 row of `fi-b.md` under the same skip rules above.
