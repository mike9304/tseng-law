# ACCEPTED-vi — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `vi-a.md` and `vi-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- Guidance pack is the best so far (4/5) — apply the P2 wording rows conservatively; keep the current Vietnamese formal register (quý vị).
- a#1 llms notice per reviewer. a#2–a#5: R2 (neutral, not 'Việt Nam'). a#6–a#9: R3. a#10: R9. a#11–a#13 labels done mechanically — verify; 'Hồ sơ đầy đủ (tiếng Anh)'; translate university/job titles in bios where the reviewer lists them. a#14: skip.
- Number punctuation: Vietnamese 1.579.589 (period thousands) consistently; blog voice R7.

## Part b
Apply every P1/P2 row of `vi-b.md` under the same skip rules above. Additional: b#1 → R3/R7; b#2 'thế lực nước ngoài' → 'bên nước ngoài'; b#3 hộ tịch → 'đăng ký hộ khẩu (戶籍)' (also 016); b#4 Ủy ban → 'Vụ Thẩm định Đầu tư, Bộ Kinh tế (經濟部投資審議司)'; b#5 → 'văn phòng đại diện đăng ký theo Điều 386 Luật Công ty'; b#6 kế toán viên → 'kế toán viên công chứng (會計師, CPA)'; 條例 → 'Luật/Quy định (外國人投資條例)' not điều lệ; FAQ openings → R7b; Sino-Vietnamese memo calques → plain Vietnamese per reviewer P2; emoji/Ví dụ)/Q. → R7.
