# ACCEPTED-ms — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `ms-a.md` and `ms-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- a#1, a#2 labels done mechanically — verify. a#3 institusi → 'skim/peraturan negara lain'.
- a#4 rakan kongsi → pemegang saham (股東) — sweep all 18. a#16 'pliding' → 'peguam litigasi'. a#17 Hakim Agung → 'Hakim-hakim Besar Mahkamah Perlembagaan (大法官)'. a#18 'peringkat 2' → 'peringkat kedua/rayuan'. a#19 → 'syarikat yang telah membuat tawaran awam saham (公開發行公司)'.
- a#5–a#10: R2 (neutral, not 'Malaysia'). a#11–a#14: R3. a#15: skip.
- Number format Malaysia: 500,000 and 0.5 (comma thousands, point decimal); guillemets → "…"; 'pejabat status sivil' → 'pejabat pendaftaran isi rumah (戶政事務所)'.

## Part b
Apply every P1/P2 row of `ms-b.md` under the same skip rules above. Additional: b#1 'perbicaraan 1' → 'peringkat pertama (一審)'/'rayuan'; b#2 gimnasium → 'pusat kecergasan/gim'; b#3 pengangkutan → 'kos perjalanan untuk rawatan (就醫交通費)'; b#4 postur → 'sikap/pemikiran (心態)'; b#5 punca → 'sumber dana'; b#6 → 'bentuk sediaan (劑型)'; b#7 Invest Taiwan link fixed mechanically — skip; b#8 kepakaran → 'penilaian pakar/laporan pakar'; b#9 0,5 → 0.5; b#10 pelaku → 'pihak asing'; b#11 lembaran → 'borang data asas nombor pengenalan seragam (統一證號基本資料表)'; b#12, b#16, b#18 cabang → 'item perniagaan (營業項目)' / 'persatuan perdagangan (同業公會)'; b#13 → R3/R7; b#14 → R7b; b#17 automotif → 'kenderaan bermotor (汽車貨運業)'; b#19 rakan kongsi → pemegang saham; b#20 pemeriksa → 'penyelia syarikat (監察人)'; b#21 Suruhanjaya → 'Jabatan Semakan Pelaburan, Kementerian Hal Ehwal Ekonomi'; b#22 temu ramah → 'perundingan/konsultasi'; emoji, 'Contoh)', fullwidth colon, ZWSP → R6b/R7.
