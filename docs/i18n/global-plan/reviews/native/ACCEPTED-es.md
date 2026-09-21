# ACCEPTED-es — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `es-a.md` and `es-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- Variety: keep panhispanic legal Spanish with the current Spain lean (despacho, 500.000); do not switch to a single country; harmonize the LatAm-only forms the reviewer lists in P2 (egresados → titulados, contador asociado → contable/auditor asociado, Sitio oficial → Sitio web oficial).
- a#1 llms notice per reviewer. a#2, a#4–a#9: R2 (neutral, not 'España'). a#3 detención → 'arresto de corta duración (拘役)'. a#10–a#13: R3. a#14: R9. a#15–a#17 labels done mechanically — verify; 'Perfil completo (en inglés)'. a#18: skip.
- 'grupos de trabajo' → 'áreas de práctica'; 'Índice de páginas' → 'Menú'; blog voice R7.

## Part b
Apply every P1/P2 row of `es-b.md` under the same skip rules above. Additional: b#1 'derechos reales' → 'los derechos concretos'; b#2 postura → actitud/mentalidad (心態); b#3 skip (mechanical); b#4 cesión → 'ceder el paso'; b#5 → 'período de acondicionamiento/obras (裝潢期間)'; b#6, b#8 → R3/R7; b#7 → 'una abogada de Taiwán' where it refers to the firm; b#9 → R7b; b#10 → 'beneficiarios efectivos'; b#11 戶籍 → 'registro de domicilio (戶籍)'; b#12 → 'patrimonio propio del hijo (特有財產)'; b#13 → 'se reserva/pre-verifica el nombre'; b#14 → 'la sociedad de responsabilidad limitada (有限公司) y la sociedad anónima (股份有限公司)'; 'El solo hecho' → 'El mero hecho' (sweep). The Korean student in 010 is a case fact — keep.
