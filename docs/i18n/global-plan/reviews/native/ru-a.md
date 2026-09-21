# Russian native review — part a (ru)
reviewer: Grok 4.6 · date: 2026-09-21 · scope: ru-guidance.txt; columns-ru/001–003 (establishment basics, withdraw capital, traffic accident); 004–009 next

## Verdict
naturalness (1 = machine, 5 = native professional): 3/5 for guidance pack, 2.5/5 for columns 001–003 so far
variety used: standard contemporary Russian (with ё); orthography consistent; register mixed — stiff German-calqued legalese in the pack and 001/002 vs first-person blog voice in 003 Q16+
systemic patterns (max 6, each one line, with 1 example quote):
- Masculine title for Wei Tseng against feminine verbs: "уполномочена … является руководящим адвокатом" / "я — … адвокат Тайваня"
- Name split: pack uses «Вэй Цзэн», columns use Latin «Wei Tseng (曾雋崴)»
- German city syntax and stacked «следует»: "имеет офисы Тайбэй (臺北), Гаосюн (高雄)"
- English chrome: "OUR TEAM", "OFFICES", "Q&A по дорожно-транспортным происшествиям"
- Digit «3» for *third party* and German thousands: "3 лиц (第三人)", "TWD 500.000"
- Korea DTA presented as the general tax story: EN’s "not a worldwide investor rule" was dropped in 001

Guidance pack is meaning-faithful: FAQ «Нет.» on Russian consultation, no interpreter, no reply-time, no free first meeting, no result. A Russian-speaking client can follow it, but the site still reads as a German legal translation with English labels. 001–002 are dense and mostly accurate; 003 Q1–Q15 is the strongest stretch; Q16–Q20 drop into a Korean blog voice and typical-sentence claims.

## Findings
| # | sev | cat | file | quote (≤120 chars, verbatim) | problem (English, one line) | suggested Russian rewrite |
|---|-----|-----|------|------|------|------|
| 1 | P1 | F | ru-guidance.txt | Проверено адвокатом Вэй Цзэн | Masculine title for a woman; also "Адвокат Вэй Цзэн" / "Руководящий адвокат" throughout the pack | Проверено адвокатом Wei Tseng (曾雋崴) |
| 2 | P1 | F | ru-guidance.txt | уполномочена практиковать на Тайване и является руководящим адвокатом {firm}. | Feminine "уполномочена" + masculine "руководящим адвокатом" (also lawyers.answer, roles.tseng-junwei) | уполномочена вести адвокатскую деятельность на Тайване и возглавляет {firm}. |
| 3 | P1 | F | columns-ru/008-taiwan-labor-severance-law.md | Здравствуйте, я — Wei Tseng (曾雋崴), адвокат Тайваня. | Masculine title in first person; also 003 closer, 007 byline, 001 "языки ведущего адвоката" | Здравствуйте, меня зовут Wei Tseng (曾雋崴); я адвокат на Тайване. |
| 4 | P1 | G | ru-guidance.txt | Вэй Цзэн | Cyrillic name in the pack vs Latin «Wei Tseng (曾雋崴)» in all ru columns — two identities on one locale | Wei Tseng (曾雋崴) |
| 5 | P1 | G | ru-guidance.txt | OUR TEAM | English section label left on the Russian page (guidanceTeamCopy.ru.label) | НАША КОМАНДА |
| 6 | P1 | G | ru-guidance.txt | OFFICES | English section label left on the Russian page (guidanceOfficeCopy.ru.label) | ОФИСЫ |
| 7 | P1 | G | ru-guidance.txt | Полный профиль (English) | English word left in the Russian UI | Полный профиль (на английском) |
| 8 | P1 | A | ru-guidance.txt | Офис Гаосюн сосредоточен на управлении компаниями | DE Unternehmensführung = corporate practice, not "running companies" | Офис в Гаосюне сосредоточен на корпоративной практике |
| 9 | P1 | A | columns-ru/001-taiwan-company-establishment-basics.md | Соглашение об избежании двойного налогообложения (所得稅協定) между Тайванем и Кореей вступило в силу | EN’s "country-specific note / not a worldwide investor rule" dropped; a RU reader will take the 10% rate as theirs. Also §5 and 004 | Справка по корейскому кейсу (не общее правило для всех инвесторов): соглашение Тайвань — Корея вступило в силу |
| 10 | P1 | A | columns-ru/003-taiwan-traffic-accident-procedure.md | круга пассажиров или 3 лиц (第三人) вне транспортного средства | Digit 3 used for *third party*, reads as "3 people"; also 004 "с 3 лицами (第三人)" | круга пассажиров или третьих лиц (第三人) вне транспортного средства |
| 11 | P1 | G | columns-ru/003-taiwan-traffic-accident-procedure.md | Q&A по дорожно-транспортным происшествиям на Тайване | English "Q&A" left in a public title; also 005 "(Q&A)" and 007 title | Вопросы и ответы по ДТП на Тайване |
| 12 | P1 | E | columns-ru/003-taiwan-traffic-accident-procedure.md | суды в настоящее время назначают наказание примерно в 3 месяца | Typical-sentence advertising; also "обычно назначают 4 месяца" / "6 месяцев" | в отдельных приговорах назначали около 3 месяцев; типичного или гарантированного исхода нет |
| 13 | P1 | E | columns-ru/003-taiwan-traffic-accident-procedure.md | Может быть назначено условное осуждение (緩刑), так что в тюрьму идти не придётся. | Reads as a promised escape from prison | В некоторых делах возможно условное осуждение (緩刑); это не обещание избежать лишения свободы |
| 14 | P1 | E | columns-ru/003-taiwan-traffic-accident-procedure.md | содействовал тому, чтобы возмещение было возможно более полным | Softened "maximum compensation" still reads as a result claim | добивался возмещения, которое подтверждают факты и доказательства |
| 15 | P2 | B | ru-guidance.txt | имеет офисы Тайбэй (臺北), Гаосюн (高雄), Тайчжун (臺中) и Пиндун (屏東) | City names need «в» + prepositional case; also "Офис Гаосюн / Тайчжун / Пиндун" and guidanceAnswers.about | имеет офисы в Тайбэе (臺北), Гаосюне (高雄), Тайчжуне (臺中) и Пиндуне (屏東) |
| 16 | P2 | D | ru-guidance.txt | Приватность | Nav calque of Privacy; the page eyebrow already says КОНФИДЕНЦИАЛЬНОСТЬ | Конфиденциальность |
| 17 | P2 | D | ru-guidance.txt | Оговорки | Nav does not match the page (ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ); «оговорки» = reservations | Отказ от ответственности |
| 18 | P2 | C | ru-guidance.txt | Китайское имя 昊鼎 | A firm has a название, not an имя | Китайское название 昊鼎 |
| 19 | P2 | C | ru-guidance.txt | Фирма практикует по праву Тайваня | Calque of "practices Taiwan law" | Фирма ведёт дела по праву Тайваня |
| 20 | P2 | C | ru-guidance.txt | Профили адвокатов, руководства по операциям и партнёрской бухгалтерии Hovering | Calque of operations manager / partner CPA (also team description, lawyers.answer) | Профили адвокатов, операционного менеджера и партнёра-бухгалтера Hovering |
| 21 | P2 | C | ru-guidance.txt | Руководящий адвокат | Unusual label vs DE «Geschäftsführende Anwältin»; also partnerTitle «Партнёрская бухгалтерия», introLabel «Представление» | Управляющий адвокат / Партнёр-бухгалтер (CPA) / О себе |
| 22 | P2 | C | ru-guidance.txt | Следующие вопросы отвечаются на уровне общих сведений | Passive calque no native FAQ would open with | Ответы ниже даны на уровне общих сведений |
| 23 | P2 | C | ru-guidance.txt | ответа на Ваше положение | «положение» ≠ the client’s situation here | ответа для Вашей ситуации |
| 24 | P2 | C | ru-guidance.txt | назовите дату на письме рано | Unidiomatic word order; also contact "назовите дату на письме" | укажите дату письма как можно раньше |
| 25 | P2 | C | ru-guidance.txt | может работать с бухгалтерским подразделением в одном процессе | Calque of "in one go / in einem Ablauf" | может вести налоговые и бухгалтерские вопросы вместе с бухгалтерским подразделением |
| 26 | P2 | C | ru-guidance.txt | Номер получения | Calque of receipt ID; also "Ваша отправка", "путь связи" | Номер обращения |
| 27 | P2 | C | ru-guidance.txt | закрытом объектном хранилище этой службы | Calque of "object storage" | закрытом облачном хранилище этой службы |
| 28 | P2 | C | ru-guidance.txt | Письменный перевод — другое | Cryptic leftover of interpreter vs translation | Устный переводчик и письменный перевод обращения — разные вещи; автоматического перевода нет |
| 29 | P2 | C | ru-guidance.txt | Адвокаты работают от консультации компаний до судебного разбирательства | Calque; "консультация компаний" is not a collocation | Адвокаты ведут работу от консультирования компаний до судебных разбирательств |
| 30 | P2 | D | ru-guidance.txt | добилась решения первой инстанции на TWD 1.57M | English million abbreviation and decimal point; Russian uses 1,57 млн and a space thousands separator | добилась решения первой инстанции на 1,57 млн TWD |
| 31 | P2 | C | ru-guidance.txt | Бакалавр (B.A.) с двойным обучением по праву и финансам | Calque of "double major" | бакалавр (B.A.) по двум специальностям: право и финансы |
| 32 | P2 | G | ru-guidance.txt | Senior Paralegal, Boyin Law Firm | English job title left in a Russian bio (also Muyang line) | старший помощник адвоката, Boyin Law Firm |
| 33 | P2 | C | ru-guidance.txt | Офис Корея | Missing preposition; a Russian reader expects «в Корее» | Офис в Корее |
| 34 | P2 | C | ru-guidance.txt | Язык, который Вы хотите для консультации | Awkward relative clause for a form label | Желаемый язык консультации |
| 35 | P2 | C | ru-guidance.txt | Если через некоторое время ответа нет, Вы можете снова написать | Weak clock feel on a no-promise page; keep the negative, drop the interval | Если ответа нет, Вы можете снова написать |
| 36 | P2 | B | ru-guidance.txt | судебные, административные или расходы третьих лиц | Broken parallelism: adjectives stranded without «расходы» | судебные, административные расходы или расходы третьих лиц |
| 37 | P2 | C | ru-guidance.txt | Группы работы | Calque of "practice groups"; the services eyebrow already says НАПРАВЛЕНИЯ РАБОТЫ | Направления работы |
| 38 | P2 | A | columns-ru/001-taiwan-company-establishment-basics.md | Общая ставка тайваньского налога с оборота (營業稅) составляет 5 % | 營業稅 is a VAT-like business tax, not classic Soviet «налог с оборота»; also 002, 004 | Общая ставка тайваньского налога на добавленную стоимость (營業稅) составляет 5% |
| 39 | P2 | D | columns-ru/001-taiwan-company-establishment-basics.md | не менее TWD 500.000 (新臺幣) | German thousands dot; Russian uses a space (500 000). Systemic in 001–004, 007 | не менее 500 000 TWD (新臺幣) |
| 40 | P2 | D | columns-ru/001-taiwan-company-establishment-basics.md | карту проживания (外僑居留證) | Mixed with «вид на жительство (居留)» in the pack; CIS readers expect ВНЖ / карточка ARC | вид на жительство (外僑居留證, ARC) |
| 41 | P2 | A | columns-ru/002-withdraw-capital-taiwan-company.md | срочное лишение свободы на срок не более 5 лет, арест либо денежный штраф | 拘役 is short-term custodial sentence (≤60 days), not pre-trial «арест»; also Art. 90 | срочное лишение свободы на срок не более 5 лет, краткое лишение свободы (拘役) либо штраф (罰金) |
| 42 | P2 | D | columns-ru/003-taiwan-traffic-accident-procedure.md | при телесных повреждениях или необходимости спасения звоните 119 | 119/110/112 must be labelled as Taiwan numbers (112 is the EU/CIS emergency number) | звоните 119 (скорая помощь на Тайване); при правонарушении — 110 или 112 (тайваньская полиция / экстренный вызов с мобильного) |
| 43 | P2 | D | columns-ru/003-taiwan-traffic-accident-procedure.md | Критерий выплат, изменённый 2026-05-29 | ISO date; Russian running text uses «29 мая 2026 г.» (also 2026-07-01) | Критерий выплат, изменённый 29 мая 2026 г. |
| 44 | P2 | B | columns-ru/003-taiwan-traffic-accident-procedure.md | до окончания устных прений (言詞辯論終結) 2 инстанции | Digit for court level; Russian writes «второй инстанции» (also "1 инстанции") | до окончания устных прений (言詞辯論終結) второй инстанции |
| 45 | P2 | C | columns-ru/003-taiwan-traffic-accident-procedure.md | По моему опыту, страховая компания часто недостаточно обрабатывает эмоциональную сторону | Sudden first-person blog after formal Q1–Q15; «обрабатывает эмоциональную сторону» is machine | По опыту практики страховщики часто не уделяют внимания эмоциональной стороне для участников ДТП |
| 46 | P2 | C | columns-ru/003-taiwan-traffic-accident-procedure.md | Если у вас есть дополнительные вопросы, оставьте их в комментариях. | Invites blog comments the guidance site does not offer; also lowercase «вы» vs pack «Вы» | Если у Вас есть вопросы по Вашему делу, направьте изложение через страницу «Контакты»; срок ответа не обещается |
| 47 | P2 | G | columns-ru/003-taiwan-traffic-accident-procedure.md | FAQ полиции по дорожно-транспортным происшествиям | English "FAQ" left in a source label | Часто задаваемые вопросы полиции по ДТП |
