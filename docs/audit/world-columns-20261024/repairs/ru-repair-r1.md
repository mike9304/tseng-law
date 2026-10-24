# Russian drafts — repair round 1

Review: `reviews/grok-ru-r1.md`. Rules: `briefs/BRIEF.md`, the repository editorial voice/frontmatter guidance, and the shared sentence-variety rules and lessons. Verified on 24 October 2026.

Result: the one MUST and one small SHOULD clarification were applied to 866. The seven conditional SHOULD source checks were also accepted and completed; their existing text is supported and retained. No reviewer assertion required a rebuttal. Here, “ACCEPTED — verification only” means the requested check was performed and the old text → identical text, with no manuscript edit.

Only `drafts/ru/866-russian-spouse-taiwan-divorce-child-residence.md` and this log were written. Drafts 864 and 865 are byte-identical to the starting files. No repository, author note, review file, installation, publication, git state or law cache was changed.

## 866 M1 — ACCEPTED

Reason: Article 31(4)(2) requires the foreign spouse to have suffered the domestic violence that caused the divorce. The original phrase did not identify the victim. This is a substantive clarification of eligibility, not a style-only edit.

Statute checked with `tools/law.py` (`D0080132`, Article 31) and the [live official Article 31](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31):

> 二、外國人為居住臺灣地區設有戶籍國民之配偶，因遭受家庭暴力離婚，且未再婚。

The national spouse's Taiwan residence and household registration and the foreigner's no-remarriage condition are preserved. The preceding discretionary rule remains: “得准予繼續居留”.

Old:

> Среди них — развод вследствие домашнего насилия для иностранного супруга гражданина, проживающего на Тайване и имеющего там регистрацию домохозяйства, если иностранец не вступил в новый брак.

→ New:

> Среди них — развод вследствие домашнего насилия, пережитого иностранным супругом гражданина, проживающего на Тайване и имеющего там регистрацию домохозяйства, если иностранец не вступил в новый брак.

FAQ 2 is updated with the same victim requirement and the other conditions; the combined M1/S1 FAQ replacement is recorded below. The summary makes no claim about these detailed conditions and remains unchanged.

Commencement: the [official Immigration Act history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=D0080132), read live, identifies Executive Yuan order 1121043343 and includes Articles “31～33” in the provisions “定自一百十三年一月一日施行” (effective 1 January 2024). No uncommenced amendment is being substituted for Article 31.

## 866 S1 — ACCEPTED

Reason: Article 31(4)(3) contains alternatives. Repeating «либо» removes the possible cumulative reading with a small change to the existing sentence.

[Official Article 31(4)(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31), also checked with `tools/law.py`:

> 三、外國人於離婚後對在臺灣地區已設有戶籍未成年子女，有撫育事實、行使負擔權利義務或會面交往。

Old:

> Другая норма охватывает разведённого иностранца, который фактически воспитывает несовершеннолетнего ребёнка с тайваньской регистрацией, осуществляет родительские права и обязанности либо поддерживает предусмотренное общение с ним.

→ New:

> Другая норма охватывает разведённого иностранца, который либо фактически воспитывает несовершеннолетнего ребёнка с тайваньской регистрацией, либо осуществляет родительские права и обязанности, либо поддерживает предусмотренное общение с ним.

The divorce condition, minor child, Taiwan registration, three alternative relationships and NIA's discretion are retained. The no-remarriage requirement remains attached to the domestic-violence ground only.

### FAQ 2 — combined M1/S1 repair

Old:

> Полагаться только на дату нельзя. При исчезновении основания проживания NIA отменяет разрешение и аннулирует ARC; статья 31 предусматривает обстоятельства, при которых продолжение проживания может быть разрешено. Среди них — определённые отношения с несовершеннолетним ребёнком, зарегистрированным на Тайване, и развод вследствие домашнего насилия при указанных в законе условиях.

→ New:

> Полагаться только на дату нельзя. При исчезновении основания проживания NIA отменяет разрешение и аннулирует ARC; статья 31 предусматривает обстоятельства, при которых продолжение проживания может быть разрешено. После развода таким основанием может быть фактическое воспитание несовершеннолетнего ребёнка с регистрацией домохозяйства на Тайване, осуществление родительских прав и обязанностей или общение с ним. Отдельное основание — развод иностранца из-за пережитого им домашнего насилия, если его супругом был гражданин, проживающий на Тайване и имеющий там регистрацию домохозяйства, а иностранец не вступил в новый брак.

This gives the child-related alternatives explicitly and separately states the domestic-violence ground. FAQ questions, the other two answers and the frontmatter structure remain unchanged.

## 866 S2 — ACCEPTED — verification only

Old:

> По инструкции МВД стороны обычно обращаются вместе; представитель допускается при уважительной причине и одобрении органа.

→ New: identical text; retained with its existing separate Ministry of the Interior link.

The [official divorce-registration instructions](https://www.ris.gov.tw/documents/html/2/3/1/384.html) confirm:

- Applicants for consensual divorce: “雙方當事人”.
- Representation: “有正當理由並經戶政事務所核准者，得以書面委託他人辦理”.
- Foreign-made supporting documents: “應備證件在國外作成者，應經我駐外館處驗證”.
- Chinese translation: “應另檢附經駐外館處驗證或國內公證人認證之中文譯本”.

The following paragraph on overseas authentication and certified Chinese translation is therefore also retained. The Taiwan/Russia context does not invoke the page's separate mainland China/Hong Kong/Macao route. These administrative requirements remain sourced to the Ministry's page, not attributed to Civil Code Article 1050.

`tools/law.py` also confirmed Article 1050's distinct requirements: “兩願離婚，應以書面為之，有二人以上證人之簽名並應向戶政機關為離婚之登記。” The Civil Code's pending-effect banner identifies Articles 166-1 and 1223, not Article 1050.

## 864 S1 — ACCEPTED — verification only

Old:

> Сама электронная виза однократная, действует три месяца с выдачи и допускает пребывание до 30 дней; её условия не предусматривают продление или замену другой визой внутри Тайваня.

→ New: identical text; retained.

The [BOCA eVisa conditions](https://visawebapp.boca.gov.tw/BOCA_EVISA/MRV04FORM.doYou), under validity and duration of stay, expressly say “three months starting from the issue date”, “single-entry visa”, “30 days”, and “cannot be extended and converted to other types of visas”. These support every detail questioned by the reviewer. No FAQ or summary change is needed.

## 864 S2 — ACCEPTED — verification only

Old:

> Для обычной резидентской визы на основании профессиональной работы перечень BOCA включает разрешение компетентного органа; оставшийся срок найма, указанный в нём, должен превышать шесть месяцев на момент визового заявления.

→ New: identical text; retained.

The work-permit row of the [BOCA professional-employment resident-visa checklist](https://www.boca.gov.tw/cp-166-276-48430-2.html) says:

> Remaining period of employment indicated on the work permit must be more than 6 months at the time of Resident Visa application.

The draft preserves both “more than” and the application-date trigger. No FAQ or summary change is needed.

## 864 S3 — ACCEPTED — verification only

Old:

> Официальное описание Gold Card подтверждает открытое разрешение на работу, позволяющее работать у нескольких работодателей.

→ New: identical text; retained.

The [official Gold Card FAQ](https://goldcard.nat.gov.tw/en/faq/what-is-the-taiwan-gold-card/) states:

> It comes with open-work rights, so you can work for any (or multiple) companies in Taiwan

The second FAQ answer's statement that the permit is not tied to one employer is supported and retained. The four functions and one-to-three-year duration remain untouched.

## 864 S4 — ACCEPTED — verification only

Old:

> Однако инструкция NIA содержит ограничения по способу въезда и визовым отметкам, с оговоркой об иных применимых правилах.

→ New: identical text; retained.

Section 7(1) of the [NIA guidelines](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) restricts certain entry routes and visa annotations “prohibiting extension, conversion to a residence visa, or application for a residence certificate”, while retaining “unless otherwise provided by relevant regulations”. The draft preserves that exception and does not claim that the general restriction overrides every professional-worker route. No FAQ or summary change is needed.

## 865 S1 — ACCEPTED — verification only

Old:

> ITA указывает запрет экспорта в Россию и Беларусь 77 позиций станков, включая электроэрозионные, с 8 марта 2024 года; для других товаров из специального перечня требуется разрешение.

→ New: identical text; retained.

The Russia/Belarus answer in the [official ITA FAQ](https://www.trade.gov.tw/FAQ/Detail.aspx?nodeid=5135) states “自113年3月8日起” and “禁止放電加工機等77項工具機”. ROC year 113 is 2024. The answer also distinguishes the prohibition from the permit requirement for listed goods.

The FAQ's classification explanation differentiates Part I technical specifications from Parts II/III HS codes. The linked [official Russia/Belarus list](https://www.trade.gov.tw/App_Ashx/File.ashx?FileID=BC2AF5B11DEEF1A4) expressly labels Part I “第一部分：出口管制分類號碼（ECCN）項目”. The preceding ECCN/HS paragraph and the first FAQ answer are therefore also retained.

## 865 S2 — ACCEPTED — verification only

Old:

> ITA относит к контролируемым также определённые внеперечневые поставки, если конечное использование или пользователь могут быть связаны с производством либо разработкой ядерного, биологического, химического, ракетного и иного военного оружия.

→ New: identical text; retained.

The [ITA SHTC explanation](https://www.trade.gov.tw/Pages/Detail.aspx?nodeID=4433&pid=725764) covers non-listed goods with potential end-use/end-user involvement in “生產、發展核子、生化、飛彈等軍事武器用途” and gives the official export-entity list among the relevant examples. The adjacent entity-list sentence is supported.

Old:

> В разъяснении о перенаправлении через третьи страны ITA сообщает о требованиях заверить отсутствие дальнейшей отправки в Россию или Беларусь при экспорте через страны с высоким риском такого перенаправления.

→ New: identical text; retained.

The third-country answer in the [ITA FAQ](https://www.trade.gov.tw/FAQ/Detail.aspx?nodeid=5135) requires undertakings for high-risk destinations: “須切結不得轉運俄羅斯及白俄羅斯”. The third FAQ answer is consistent and remains unchanged.

## Validation and review limits

- Exact before/after comparison: only line 19 (FAQ answer 2) and line 60 (two Article 31 sentences) changed in 866. Every other line is identical. Drafts 864 and 865 are entirely identical to the starting versions.
- YAML was parsed using the system Ruby YAML library. All 16 fields remain in the required order; all three drafts retain three FAQ entries, the prescribed dates, Russian audience, internal author, category and image metadata. No package was installed.
- All summaries remain unchanged. No bold or body H1 was introduced; each draft retains four content H2 headings plus its sources section. Every external body source remains in the sources list; internal column links resolve to the snapshot or this batch.
- Visible body word counts, including headings/contact but excluding YAML, sources, Markdown destinations and standalone punctuation: 864 = 707; 865 = 755; 866 = 765.
- The prescribed shared variety command was run on each final file with bytecode writes disabled. Each returned exit 2: “measurement unavailable: cannot infer language …; supply --lang”. Explicit `--lang ru` also returned exit 2 because Russian is not supported. This is not an automated PASS or a measured zero-FAIL result. The shared checker was not changed and no other language was substituted.
- Supplementary Russian-aware whitespace diagnostics, with links removed and sentence splits at punctuation followed by an uppercase Cyrillic/Latin letter or digit, gave the following results. They are informal checks, not a supported shared-tool certification.

| Draft | Sentences | Length CV | Sentences of at most 8 words | Similar-length triples | Maximum same paragraph opener | Consecutive same sentence opener | Paragraphs with multiple sentences of at least 32 words |
|---|---:|---:|---:|---:|---:|---:|---:|
| 864 | 47 | 0.484 | 11 / 23.4% | 2.2% | 2 | 1 | 0 |
| 865 | 51 | 0.509 | 13 / 25.5% | 4.1% | 2 | 1 | 0 |
| 866 | 49 | 0.493 | 12 / 24.5% | 4.3% | 2 | 0 | 0 |

Section 5 manual self-check: the existing openings remain a concrete entry/work question (864), an export-document request (865), and an explicitly hypothetical divorce agreement (866). Their opening paragraphs supply facts or practical context rather than announcing the article. There are short sentences, varied paragraph openings and uncited practical paragraphs. The repairs introduce no repeated contrast formula, citation-caveat sequence or generic ending. Existing conclusions stay tied to the work dates, stopped shipment and ARC/agreement facts respectively. The relevant links, legal conditions, discretion, dates, numbers and hypothetical marker were preserved. No broader stylistic rewrite was made during this repair.

An independent read-only AI source reviewer confirmed all six assigned verification requests for 864/865 against the cited live official pages, then separately checked the repaired 866 Article 31 paragraph and FAQ 2 against the live statute. Its bounded result was PASS for the final hashes below. This is not a claim of human native-speaker or lawyer review, a new certification of every unaffected proposition, or publication readiness.

| Draft | Starting SHA-256 | Final SHA-256 |
|---|---|---|
| 864 | `3ca5e457d30ee96cf31a159710364d26b2b41eb2dca5b4e2f198f7d57d47a216` | `3ca5e457d30ee96cf31a159710364d26b2b41eb2dca5b4e2f198f7d57d47a216` |
| 865 | `36b319f7849771ae27b8a033b0831a7fc199c6c20589d8e1e37a23c20ca76ee5` | `36b319f7849771ae27b8a033b0831a7fc199c6c20589d8e1e37a23c20ca76ee5` |
| 866 | `1725a02a7570880152fd84a37b8d66dc7af3b0f9c262132fb147e2096cf3a035` | `d98f1635baa3866c462ef339a0a6b78303f6e64e0e278aa337cac5dabc070456` |

