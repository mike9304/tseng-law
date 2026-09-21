# ACCEPTED-ar — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `ar-a.md` and `ar-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- a#1 طالب تبادل → طالبة تبادل (also sweep all education/experience lines for feminine agreement).
- a#2–a#4 labels done mechanically — verify; 'الملف الكامل (بالإنجليزية)'. a#5 llms notice per reviewer.
- a#6, a#7, a#15, a#16, a#19, a#22: R2 (neutral — 'الشركات الأجنبية', 'من بلد المستثمر'). a#8 fix grammar. a#9 上易字 → 'حكم المحكمة العليا في تايوان (臺灣高等法院) …' with Gregorian year. a#10–a#12, a#17, a#23, a#24: R3. a#13 gloss 司法院 (اليوان القضائي). a#14, a#20: skip. a#18 احتجاز → 'الإبقاء غير المشروع (retention)'. a#21 table cell → parenthetical gloss.
- Calques (systemic sweep): 'وليس معنى أن' → 'ولا يعني ذلك أن'; 'على نحو ملموس' → 'تفصيلًا'; 'القضية المفردة' → 'القضية المعيَّنة'; 'أحرف هان' → 'الحروف الصينية (漢字)'; 'الهواكياو' → 'المستثمرون الصينيون المقيمون في الخارج (華僑)'. Blog voice R7 (title '؟؟').

## Part b
Apply every P1/P2 row of `ar-b.md` under the same skip rules above. Additional: b#1 الوكيل القضائي → الوكيلة القضائية; b#2 → 'قد تُمحى/تُستبدل التسجيلات بعد انقضاء مدة الحفظ'; b#3, b#14 → R2; b#4 Invest Taiwan link fixed mechanically — skip; b#5 المكتب → المكتب (the firm) is fine — fix per reviewer's sense (an anonymized case the firm handled); b#6, b#9, b#10 → R3/R7; b#8 → R6b; b#11 → 'بالمحامية'; b#12 'الأب الباقي' → 'الوالد الباقي على قيد الحياة'; b#13 信託 → 'الائتمان (信託)' never الوصاية; b#15 → 'شاحنة صغيرة واحدة'. Calques sweep (على نحو ملموس / القضية المفردة / وليس المعنى).
