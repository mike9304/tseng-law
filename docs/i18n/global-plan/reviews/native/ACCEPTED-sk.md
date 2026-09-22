# ACCEPTED-sk — supervisor decisions (Fable 5.1, 2026-09-22, round 2)

Scope for the fixer: RULEBOOK-FIX.md (R2–R10 + round-2 addendum R12–R17) + every P1/P2 row of `sk-a.md` and `sk-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale
- Frontmatter `url:` with Hangul → skip (R16). `/ko/...` link rows → already remapped (R1); only make the label natural.
- Rows asking to reformat the pinned bio figure "TWD 1.57M" → skip (test-pinned). Other amounts: R14.
- Rows that would add statements about the law of the reader's country → R2 neutral generalization instead.
- Rows that would change block counts, image paths, external links, numbers or dates → rephrase inside the block instead.

## Locale-specific decisions (part a)
- R17 FIRST: columns 003, 007 and 008 (body from the first image alt to the end, incl. FAQ frontmatter answers and both alt texts) are Czech/Czech–Slovak mash — rewrite them entirely in standard Slovak from the English source (src/content/columns-en), keeping the block count, headings order, numbers, links and Chinese glosses. Then scan 001–018 for any remaining Czech tokens (nejen, kdy, který, jsou, obrázek, manželství, pokud, nebo, také, již, zda, abyste, ústavní, Koreje, od kusa) → 0.
- a#3, a#5 Hangul url → skip (R16). a#6 nav "Náklady práce" → a fee label (e.g. "Odmena") ≤ 14 chars; same fix on the home sentence and pricing eyebrow. a#7 戶籍 → "registrácia domácnosti (戶籍)" / "úrad evidencie domácností (戶政機關)", not matrika — sweep pack + 007. a#8 "Partnerský" → "partner (audítor)" per R12.
- P2 rows on 條例/辦法 (act vs regulation), prieskum → preskúmanie, nariadenie → zákon/vyhláška as the reviewer says, agreement fixes — apply.
- Numbers: keep dot thousands (R14); "1.57M" pinned.

## Part b
Apply every P1/P2 row of `sk-b.md` under the same skip rules. Additional: b#1 "okno" → "úrad / právny režim" and "spôsob podania" (017). Czech remains ("je/nie je treba" → "treba/netreba" with Slovak accusative, "spoznať" → "dozvedieť sa", "povinný di…") → sweep 010–018 (R17 residue). "použiteľný" → "uplatniteľný / platný" sweep 011/014/016/017. Stock calques (Treba spoločne vidieť → posúdiť spolu; so stredom na → so zameraním na; sa položí → vzniká). Thousands: keep the dot (R14, checker) — reviewer's space request is skipped. 戶籍 = evidencia obyvateľov: use the same term in part a fixes.
