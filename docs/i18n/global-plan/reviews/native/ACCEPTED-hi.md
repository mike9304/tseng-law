# ACCEPTED-hi — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `hi-a.md` and `hi-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- a#5: apply the court wording (प्रथम दृष्टया न्यायालय / निचली अदालत) but keep the amount as digits `TWD 1,570,000` — no lakh/crore regrouping (numbers must stay checker-parsable and match the other locales).
- a#9–a#12: apply as R2 (neutral), not 'भारत'.
- Spelling: standardize हिन्दी (autonym) vs हिंदी in running text — pick हिंदी in prose, keep the autonym 'हिन्दी' in the picker registry (do not edit src/lib/public-guidance.ts).

## Part b
Apply every P1/P2 row of `hi-b.md` under the same skip rules above. Additional (part b): b#1 masculine था → थी; b#2 '1 सुनवाई' → 'प्रथम दृष्टया न्यायालय / अपील न्यायालय' (words allowed, R11); b#5 रसद → लॉजिस्टिक्स everywhere (title too — keep the frontmatter `url`/slug); b#6 साझेदार → शेयरधारक (股東); b#7 लेखापरीक्षक → पर्यवेक्षक (監察人); b#8 one name for 經濟部投資審議司; b#9 → R3/R7; b#10 Invest Taiwan link is fixed mechanically (lang=eng) — skip. No lakh/crore regrouping (keep international digits).
