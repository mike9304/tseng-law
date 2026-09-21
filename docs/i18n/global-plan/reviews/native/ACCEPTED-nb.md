# ACCEPTED-nb — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `nb-a.md` and `nb-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- a#1: apply (add 'bare/kun').
- a#2 institutter → ordninger; a#3, a#4 (llms notice) apply the reviewer's wording.
- a#5–a#7, a#17–a#19: R2 (neutral), not 'Norge'.
- a#8 hefte → 'kortvarig frihetsstraff (拘役)'; also 大法官 → 'forfatningsdomstolens dommere', 贍養費 → 'ektefellebidrag'.
- a#9 'Jeg var WEI' → 'Wei Tseng (曾雋崴), advokat i Taiwan'. a#10, a#11: R3.
- a#12–a#14: labels done mechanically — verify; 'Fullstendig profil (på engelsk)'.
- a#15 blog link fixed mechanically — skip.
- a#16 and ALL Danish leakage in 004–007 (Hvornår, at+infinitive, der, retsstilling, Ud over, sygdom, stk.) → Bokmål (G sweep of every column; the reviewer says 004–007 are worst — check all 18).
- De/Deres/Dem → du (systemic P2) — apply throughout.

## Part b
Apply every P1/P2 row of `nb-b.md` under the same skip rules above.
