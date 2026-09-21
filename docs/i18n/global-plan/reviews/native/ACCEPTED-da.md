# ACCEPTED-da — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `da-a.md` and `da-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- a#1: apply (add 'kun').
- a#2 'svarer for' → 'Vi svarer for at kunne prøve…' per reviewer.
- a#3 'institutter' → 'ordninger'; fix 'atligestille'.
- a#4, a#5 and every other Swedish token (ur, artikelns, Kildeskattsatsen) → Danish (G sweep of pack + columns).
- a#6–a#8: apply (Vores team / Kontorer already done mechanically — verify; 'Fuld profil (på engelsk)').
- a#9–a#14: R2 (neutral), not 'Danmark'.
- a#15, a#16: R3. a#17 'Jeg var WEI' → 'Wei Tseng (曾雋崴), advokat i Taiwan'. a#18 kræfter → medarbejdere. a#19 'missses' → 'overses'.
- a#20 blog link fixed mechanically — skip.
- De/Deres → du (systemic P2) — apply throughout pack and columns.
- Glossary: hæfte → 'kortvarig frihedsstraf (拘役)'; nødunderhold → 'ægtefællebidrag (贍養費)'; 'de store dommere' → 'forfatningsdomstolens dommere (大法官)'.
- Number format: 500.000 → 500.000 is fine in Danish (period thousands) — keep; 1.57M → 1,57 mio.

## Part b
Apply every P1/P2 row of `da-b.md` under the same skip rules above. Additional: 'held' → 'succes/medhold' (systemic); '3.' / 'tredjemand (3)' → 'tredjemand' (R11); processfuldmægtig → 'procesfuldmægtig/rettergangsfuldmægtig (訴訟代理人)'; b#4 → 'pønalerstatning (懲罰性賠償金)'; b#9 tegningspræmie → 'underskriftsbonus (簽約金)'; b#10 → 'filial (分公司) og anden forretningsenhed (分支機構)'; b#12 → 'speditionsvirksomhed (運送承攬)'; b#13 → 'kundeservice'; b#15 prestator → leverandør; b#16 revisor → 'selskabets tilsynsførende (監察人)'; b#17 'mor' → 'moderselskab'; b#5 → R2; b#7, b#8, b#11 → R3/R7. De/Deres → du in 010–018 as well.
