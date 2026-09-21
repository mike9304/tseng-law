# ACCEPTED-pt — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `pt-a.md` and `pt-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- Variety: European Portuguese (pt_PT) — keep consistently (Contacto, equipa, registo…). Do not switch to Brazilian.
- a#1 (llms notice) reviewer wording. a#2 'prisão a tempo' → 'pena de prisão até 5 anos'; a#3 cocontratante → contraparte; a#4 → 'sociedade com oferta pública de ações (公開發行公司)'; a#5 'em contrapartida' → 'pelo contrário/em contraste'; a#6 → direito internacional privado; a#7 extranidade → 'elemento de conexão internacional/estrangeiro'; a#8 conservatório → conservatória do registo civil (戶政事務所); a#9 fideicomisso → trust (信託) explained; a#10 truncated sentence → complete from English; a#11 mutada → transferida.
- a#12–a#15: R3. a#16–a#18: labels done — verify; 'Perfil completo (em inglês)'. a#19: skip. a#20–a#25: R2 (neutral).
- French calques (sweep): 'O só facto' → 'O simples facto', 'de forma de conjunto' → 'no seu conjunto', 'a contar de' ok in PT.

## Part b
Apply every P1/P2 row of `pt-b.md` under the same skip rules above.
