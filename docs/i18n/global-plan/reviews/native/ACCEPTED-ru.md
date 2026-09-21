# ACCEPTED-ru — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `ru-a.md` and `ru-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- a#1–a#4: name → Latin «Wei Tseng (曾雋崴)» everywhere in the pack (no Cyrillic transliteration; matches the columns); title: Russian «адвокат» is common-gender — keep «адвокат Wei Tseng» but make agreement feminine («Проверила адвокат Wei Tseng», «является управляющим адвокатом» → «руководит фирмой»/«управляющая адвокат»? — prefer «руководит фирмой»); first person in 008: «я — Wei Tseng (曾雋崴), адвокат на Тайване» is acceptable (common gender) — keep, only fix verbs/participles to feminine.
- a#5–a#7 labels done mechanically — verify; «Полный профиль (на английском)». a#8 → «на корпоративной практике». a#9, a#15–a#17, a#19–a#21, a#24: R2 (neutral). a#10 «3 лиц» → «третьих лиц» (R11). a#11: R5. a#12–a#14, a#22: R3. a#18: skip. a#23 → «портит/уничтожает».
- Also apply the supervisor's own rows in ru-supervisor.md (P1 #1 name; P2 #2 city cases «в Тайбэе, Гаосюне, Тайчжуне и Пиндуне»; #3–#11 calques; nav «Конфиденциальность»/«Отказ от ответственности» if ≤14 chars else «Данные»/«Оговорка»).
- Number format: 500 000 (space thousands), 1,57 млн TWD.

## Part b
Apply every P1/P2 row of `ru-b.md` under the same skip rules above.
