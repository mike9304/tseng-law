# ACCEPTED-id — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `id-a.md` and `id-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- Pack is 4/5 — apply P2 wording rows conservatively. a#1–a#3 labels done mechanically — verify; 'Profil lengkap (bahasa Inggris)'. a#4 llms notice per reviewer.
- a#5–a#9: R3. a#10: skip. a#11, a#12: R2 (neutral). a#13 → 'para Hakim Agung Mahkamah Konstitusi (大法官)'.
- Number format Indonesian (500.000, 0,5); 'TWD 1.57M' → 'TWD 1,57 juta'; ISO dates in 003 → '29 Mei 2026'; 'Q&A' → 'Tanya Jawab'; 'kelompok pekerjaan' → 'bidang layanan'; blog voice R7.

## Part b
Apply every P1/P2 row of `id-b.md` under the same skip rules above. Additional: b#1, b#2 → R3/R7; b#3 skip (mechanical); b#4 → R7b; b#5 disposisi → 'pengalihan/pelepasan harta (處分)'; b#6 → 'hak pemeriksaan (檢查權)'; b#7 one name: 'Departemen Peninjauan Investasi, Kementerian Urusan Ekonomi (經濟部投資審議司)' in 011/013/018; b#8 'subjek' → 'pihak/entitas' (sweep); keep Traditional glosses in 018 as in 010–017; emoji/Contoh)/ZWSP → R6b/R7.
