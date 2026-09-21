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
Apply every P1/P2 row of `it-b.md` under the same skip rules above. Additional (part b): Spanish/French leakage is severe in 010–018 (rege, alega, sbozzo, consignare, dispensa, pretenduto, affare, pezzi/pezze, in contropartita, di immediato, apprensione, cerchio) — treat as a full sweep of every column for non-Italian tokens; b#1 persecuzioni → azione penale/procedimento (告訴乃論之罪 = reato procedibile a querela); b#2 processo clinico → cartella clinica (病歷); b#3 postura → atteggiamento/mentalità (心態); b#5 interpellanza → lettera raccomandata con certificazione del contenuto (存證信函); b#6 → lesioni colpose (過失傷害); b#9 grado 1 → primo grado; b#10 → R2 (marchi esteri); b#14 Invest Taiwan link fixed mechanically — skip; b#16 persona collettiva → persona giuridica; b#17 cessione → precedenza (traffic); b#22/b#23 → R3 + 'a un’avvocata'; b#27 esperto contabile → dottore commercialista (會計師, CPA).
