# ACCEPTED-nl — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `nl-a.md` and `nl-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- a#4–a#6: apply (the llms notice too).
- vennoten → aandeelhouders for 股東 of a 有限公司/股份有限公司 (systemic — sweep).
- German glue words (evenwel, alsmede, teneinde…) → plain Dutch (systemic P2) — apply.
- Flemish-only diction (dading, van bij het begin) → neutral Standard Dutch.

## Part b
Apply every P1/P2 row of `nl-b.md` under the same skip rules above. Additional (part b): zich-reflexive calques → Dutch passive/impersonal (systemic sweep); vennoten → aandeelhouders (股東) everywhere; b#2 nabestaanden → 'A en B' (the parties themselves); b#3 → R3 ('te allen tijde' out); b#4 takken → bedrijfsactiviteiten/registratieposten (營業項目); b#5 vervoerscommissie → expeditie (運送承攬); b#7 → R2 (buitenlandse merken); b#8 one Dutch name for 經濟部投資審議司; b#9 'een derde (3)' → 'een derde'; b#10 Invest Taiwan link fixed mechanically — skip; b#11 prestataire → dienstverlener; 'Neen.' → 'Nee.'; Belgian glue (dading → schikking, horecazaak ok) → neutral Standard Dutch.
