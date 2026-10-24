# Russian author work note — 24 October 2026

Assignment: `ru`, numbers 864–866, P-WORK / B-EXPORT / L-DIVORCE. All three recommended topics retained. Drafts are original Russian articles for the specified readers, not translations of a shared country-neutral skeleton. This note records author checks, not lawyer or native-speaker review. No publication, installation or git command was performed.

## Reading and verification method

Read in full: `briefs/BRIEF.md`, `briefs/ASSIGNMENTS.md`, `briefs/IMAGE-MENU.md`, `repo/docs/columns/EDITORIAL-VOICE.md`, `repo/docs/columns/FRONTMATTER.md`, `rules/SENTENCE-VARIETY-RULE.md`, `rules/LESSONS.md`, `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, and the shared sentence-variety rules and latest shared lessons. The shared sentence-variety file differs from the supplied copy only in its tool-support paragraph; both versions were compared. Shared LESSONS is dated 2026-10-24, while the supplied copy is dated 2026-10-22.

The separately named `/Users/son7/agent-library/knowledge/editorial-voice.md` is absent on this machine. The full repository editorial-voice text was available and applied; no claim is made to have read the missing file. The old Fable references in the pointer and rules were not treated as active orchestration instructions, in accordance with the user's explicit repeal.

Three Russian comparison articles read in full: 009 `taiwan-voluntary-resignation-severance`, 012 `taiwan-overtaking-accident-liability`, 015 `taiwan-company-setup-pitch-location`. They establish the date/read-time patterns and exact existing category `Правовая информация о Тайване` (009/012). Their old bylines, generic introductions and promotional endings were not reproduced.

All assigned structural sources read in full:

- 864: English 705, 704, 706 and 352.
- 865: Japanese 717.
- 866: Spanish 693 and English 019, 020 and 021.

`research/country-facts.md` was absent when research began. No unverified rows or unpublished research claims were used. Country-specific facts were checked directly on the Taiwanese official pages listed below.

Every statute citation appearing in the drafts was extracted and rechecked with the actual `tools/law.py` implementation. To respect the write boundary, the script ran through `runpy.run_path` with only its hard-coded cache-directory expansion redirected to `drafts/ru/.law-cache`; the shared tool and shared `html/` directory were not edited. Chinese titles, paragraph structure and operative wording were inspected. The temporary cache was removed after the checks.

Effective dates: [A0030295 legislative history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295) confirms that the cited provisions of the 2025 amendment took effect on 1 January 2026. Civil Code B0000001 prints the unfinished-effect warning. Its [history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001) and banner identify Article 166-1 and the 17 August 2026 amendment of Article 1223, effective six months after promulgation. Neither is used. The cited divorce/child provisions are already operative. Article 866 expressly dates its account to 24 October 2026. Article 1052 is used only for paragraph 1, item 3, not for the fault proviso in paragraph 2.

## 864 — Work permission and residence with a Russian passport

File: `drafts/ru/864-russian-professional-taiwan-work-permit-residence.md`.

Reader and trigger: a Russian-passport professional has an offer from a Taiwan employer and is considering using the newly available short-visit eVisa for the move; a spouse may accompany them. Russian-speaking readers with another nationality are explicitly distinguished.

Country fit: verified BOCA country-specific eVisa eligibility supplies the actual Russian angle. It applies to ordinary Russian passports from 7 July 2026 through 6 July 2027; ordinary eVisa conditions exclude planned employment. The existence or size of a Russian engineering community is not asserted. Professional/family demand is an editorial hypothesis supplied by the assignment, not a demographic finding.

Overlap and new angle: existing 008/009/014 discuss employment termination or contractual employment periods, not the entry-to-permit sequence. English 704–706 supply the distinction between admission, work authorization and residence. The new article concentrates on the Russian eVisa trap, ordinary employer permission versus Gold Card, and the limits of spouse work rights. It does not import the US tax discussion or EOR assertions from 352. Existing Russian 014 is linked for the separate contract-duration question; its slug exists.

### Claim → checked source

| Claim retained | Source and provision | Checked Chinese wording or official-page evidence |
|---|---|---|
| Employer-applied permission is the general rule, with statutory exceptions | [Employment Service Act, 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | `除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。` |
| Work categories and qualifications require examination | [Employment Service Act, 46](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=46) | `除本法另有規定外，以下列各款為限` / `其工作資格及審查標準…由中央主管機關會商中央目的事業主管機關定之` |
| Professional employer permission normally goes to MOL, with specified education exceptions | [Foreign Professionals Act, 5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | `向勞動部申請許可` / `但聘僱從事…所定之專業工作者…向教育部申請許可` |
| Specialist applies directly for four-function Gold Card, valid 1–3 years | [Foreign Professionals Act, 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | `外國特定專業人才…得逕向內政部移民署申請核發具工作許可、居留簽證、外僑居留證及重入國許可四證合一之就業金卡` / `一年至三年` |
| Certain admitted professionals can apply directly for residence, subject to their actual entry arrangement | [Foreign Professionals Act, 16(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | `以免簽證或持停留簽證入國，經許可或免經許可…得逕向內政部移民署申請居留；經許可者，發給外僑居留證` |
| Eligible family includes spouse, minors, and dependent disabled adult children; sponsor conditions retained | [Foreign Professionals Act, 16(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | `外國專業人才在我國從事專業工作及外國特定專業人才…許可居留或永久居留者，其配偶、未成年子女及因身心障礙無法自理生活之成年子女` |
| Only specified specialist/senior-professional spouses have the cited direct work-permit route | [Foreign Professionals Act, 15(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15) | `外國特定專業人才及外國高級專業人才之配偶…許可…依親居留者，得逕向勞動部申請許可` / `不得逾其依親居留期間` |
| First ARC deadline starts the day after admission with residence permission; integrated-document exception | [Immigration Act, 22(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | `應於入國後之翌日起算三十日內` / `四證合一之有效證件，或其他已含有外僑居留證功能之證件者，得免申請` |
| Russian ordinary passports and limited program dates | [BOCA passport FAQ](https://www.boca.gov.tw/fp-181-8052-16e25-2.html) | Official country-specific row checked. Its [Chinese counterpart](https://www.boca.gov.tw/fp-398-8050-2c1ad-1.html) states `俄羅斯僅普通護照適用…2026年7月7日至2027年7月6日止`. |
| eVisa is single entry, valid three months, stay up to 30 days; ordinary conditions exclude visa conversion and planned employment | [BOCA eVisa conditions](https://visawebapp.boca.gov.tw/BOCA_EVISA/MRV04FORM.doYou) | Read the eligibility, purposes and validity sections. The article distinguishes eVisa conditions from other statutory residence routes. |
| Prior Russian visa-exemption trial ended 31 July 2022 | [BOCA visa-exempt entry](https://www.boca.gov.tw/cp-149-4486-7785a-2.html) | Russia-specific note in the duration-of-stay section. No claim about all special visa exemptions. |
| Ordinary professional resident-visa application requires work approval and more than six months remaining employment | [BOCA professional resident visa](https://www.boca.gov.tw/cp-166-276-48430-2.html) | Requirements table, work-permit row; retained the remaining-term trigger at application, not total original contract length. |
| Entry restrictions qualify direct NIA applications | [NIA 0915 guidance](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | Notes 7(1), updated 14 April 2026: excluded entry arrangements and limiting visa remarks, subject to other rules. No automatic eVisa-to-ARC promise. |
| Gold Card open work rights and evidence of eligibility | [Gold Card functions](https://goldcard.nat.gov.tw/en/faq/what-is-the-taiwan-gold-card/), [qualifications](https://goldcard.nat.gov.tw/en/qualification/) | Official pages checked for multiple-employer work and field-specific supporting documents; no universal salary threshold claimed. |

### First-two-paragraph deletion test

| Sentence | Decision and reason |
|---|---|
| `Можно ли принять предложение… и выйти на работу?` | Kept: identifies the exact eVisa/employment decision. |
| `BOCA относит eVisa к кратким поездкам…` | Kept: supplies the official response and appropriate application route. |
| `Эти условия указаны на официальной странице eVisa.` | Cut: no independent information. Moved its link onto the preceding claim. |
| `В переписке с работодателем стоит сразу указать…` | Kept: specifies the initial case facts needed to identify the route. |
| `Для русскоязычного специалиста с паспортом другого государства…` | Kept: language is not treated as nationality. |
| `Если вы уже на Тайване…` | Kept: adds entry basis and expiry, which change the assessment. |

Outside the opening, `Это подтверждает разъяснение BOCA о паспортах` was also removed; its source link moved directly to the eVisa claim. Dates and the ordinary-passport limitation were preserved. `обычного профессионального специалиста` became `обычного иностранного специалиста`, removing redundant Russian wording without changing the legal category.

Compared with 009: no first-person recall of an earlier article, no Korea comparison and no exhortation that timing wins disputes. Compared with 012: no general risk introduction or firm case story; headings follow the Russian entry decision. Compared with 015: no instructional mini-lecture or question-answer enumeration. Ending: two actual planning dates, following one restrained contact paragraph, rather than a repeated article summary or service-link footer.

Dropped/unverified: a current Russian visa-free entitlement; any working-holiday or digital-nomad eligibility; a universal salary requirement; remote-work permission based solely on foreign payroll; consultation in Russian; a guaranteed eVisa-to-residence switch. None was needed to answer the chosen question.

## 865 — Export controls for a Russian buyer

File: `drafts/ru/865-russian-buyer-taiwan-export-controls-end-user.md`.

Reader and trigger: a Russian buyer of equipment or components receives an end-user-document request or an unexplained refusal after discussing an order or advance payment. The Russian destination, not the language or nationality of an intermediary, is the factual connection.

Country fit: official ITA material expressly contains the Russia/Belarus list, classification by specifications and HS codes, prohibited machine-tool items and third-country diversion precautions. These are verified facts. No trade volumes, typical customer frequency or firm experience are claimed.

Overlap and new angle: Russian 017/018 concern logistics/semiconductor market entry, not a Russia-bound export held for control review. Japanese 717 supplies the SHTC legal structure. The draft replaces its Japan-bound exemptions/parent-company focus with Russia-specific goods, end users and the reason for stopping a shipment. It links new 864 for the separate travel/work question; no nonexistent export article is linked.

### Claim → checked source

| Claim retained | Source and provision | Checked Chinese wording or official-page evidence |
|---|---|---|
| SHTC export requires permission; actual end use/user must be disclosed and not changed without approval | [Foreign Trade Act, 13(1)(1),(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0090004&flno=13) | `非經許可，不得輸出` / `應據實申報用途及最終使用人，非經許可，不得擅自變更` |
| Exporter applies before export; ordinary six-month validity and specific two-year alternatives | [SHTC regulations, 15(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0090013&flno=15) | `應先向貿易署…申請輸出許可證，其有效期限為六個月` / `但符合下列條件之一者，其有效期限為二年` |
| US/Japan exception does not create a Russia exemption | [SHTC regulations, 15(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0090013&flno=15) | `輸往美國或日本…具有下列情形之一，且經出口人查證…主管機關得免發輸出許可證` |
| Application, alternative end-use/import assurances, transaction papers and other required documents | [SHTC regulations, 16(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0090013&flno=16) | `進口國政府核發之國際進口證明書或最終用途證明書或保證文件，或外國進口人或最終使用人出具之最終用途保證書` / `相關交易文件` |
| Five-year record retention and provision of requested subsequent-flow records | [SHTC regulations, 21](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0090013&flno=21) | `應將有關文件或資料保存五年` / `得要求…以及其日後流向之有關文件資料，出進口人不得拒絕` |
| General and Russia-specific lists; controlled end-use/user outside lists | [ITA, what is SHTC](https://www.trade.gov.tw/Pages/Detail.aspx?nodeID=4433&pid=725764) | `輸往俄羅斯及白俄羅斯高科技貨品清單` / `非屬前述清單內項目，惟最終用途或最終使用者有可能用於生產、發展核子、生化、飛彈等軍事武器用途者` |
| Russian list part 1 is specification-based; parts 2–3 use HS-code inclusion | [ITA SHTC FAQ](https://www.trade.gov.tw/FAQ/Detail.aspx?nodeid=5135) | `第一部分公告的管制「規格」` / `貨品號列（HS Code）列入…第二和第三部分，亦為SHTC` |
| 77 machine-tool positions, including EDM, prohibited from 8 March 2024 | [ITA SHTC FAQ](https://www.trade.gov.tw/FAQ/Detail.aspx?nodeid=5135) | `自113年3月8日起，禁止放電加工機等77項工具機對俄羅斯及白俄羅斯出口` |
| High-risk third-country shipments require anti-diversion assurances | [ITA SHTC FAQ](https://www.trade.gov.tw/FAQ/Detail.aspx?nodeid=5135) | `出口至高轉運風險國家…須切結不得轉運俄羅斯及白俄羅斯` |

The official `www.trade.gov.tw` FAQ was read successfully; its `wto.trade.gov.tw` mirror returned an error and is not cited. The article does not decide that any named company or specific model is controlled. Requesting the exact list position and technical evaluation is practical preparation, not an individualized classification opinion. Contract-document preparation does not assert a right to refund, shipment or damages.

### First-two-paragraph deletion test

| Sentence | Decision and reason |
|---|---|
| `Запрос тайваньского продавца… может быть частью обязательного оформления…` | Kept: interprets the actual document request without claiming every request is mandatory. |
| `Статья 16… требует документы…` | Kept: states the law and the application context; source adjacent. |
| `Покупателю из России поэтому стоит выяснить…` | Kept: narrows the next inquiry to the missing document for this order. |
| `Фраза в письме «санкции…» оставляет несколько вопросов…` | Kept: alternative explanations must be distinguished before assessing delay/refund. A quoted wording to analyze, not an invented client quotation. |
| `Для разговора о сроке и авансе полезен письменный ответ…` | Kept: identifies evidence to request, not an asserted legal disclosure duty. |
| `Одного названия товара мало.` | Kept: carries the classification limitation into the following technical section; a short sentence with substantive meaning. |

No opening sentence was cut from this draft. The opening survived the deletion test because each adds the document, governing requirement, missing item, possible reason for refusal, evidence or classification limit.

Compared with 009: no first-person account, repeated `Однако` or moral about being prepared. Compared with 012: no hypothetical accident/case narrative or generic danger lead; the opening is a documented procedural fact. Compared with 015: no location-search tutorial or list-driven checklist; one question heading tests classification, the others name transaction issues. Ending: the exact control-list position or missing document for the held shipment. No summary of the whole control system.

Dropped/unverified: a ban on every trade with Russia; any route to evade controls; guarantees of licensing or refunds; a prediction that a bank or carrier will accept payment/cargo; Russian-law remedies; transposed Japanese low-value exemptions; an automatic criminal penalty for all Russia-bound exports. Articles 27/27-1/27-2 were inspected but not cited because accurate penalty classification would distract from the narrower document/refusal question. No fixed processing-time promise is included.

## 866 — Divorce, child arrangements and family residence

File: `drafts/ru/866-russian-spouse-taiwan-divorce-child-residence.md`.

Reader and trigger: a Russian spouse of a Taiwan national is considering a Chinese divorce agreement and departure, with a child and family-based ARC requiring separate decisions. The opening is expressly marked `условный пример`; it is not a firm matter.

Country fit: Russian/Taiwan cross-border family needs are a labelled editorial hypothesis from the assignment, not a verified claim about marriage counts. The reader-specific problems are a Chinese operative document, a possible move to Russia, international contact arrangements and the Taiwan residence consequence. No Russian law, treaty, recognition precedent or nationality-based parental preference is asserted.

Overlap and new angle: existing Russian 007 is a general divorce Q&A and 016 discusses inheritance/child issues. This article focuses on a proposed agreement plus child-related residence grounds before departure. It uses Spanish 693 for conflict-of-laws ordering, English 019/020 for registration and representation, and 021 for child arrangements. It adds the verified Immigration Act 31 distinction. New 864 is linked solely for a possible independent employment/residence route.

### Claim → checked source

| Claim retained | Source and provision | Checked Chinese wording or official-page evidence |
|---|---|---|
| Divorce choice of law: common nationality, then common domicile, then closest marriage connection; time of agreement/filing | [Conflict-of-laws Act, 50](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=50) | `依協議時或起訴時夫妻共同之本國法；無共同之本國法時，依共同之住所地法；無共同之住所地法時，依與夫妻婚姻關係最切地之法律` |
| Written agreement, at least two witness signatures and household registration | [Civil Code, 1050](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1050) | `應以書面為之，有二人以上證人之簽名並應向戶政機關為離婚之登記` |
| Severe cruelty as one possible judicial ground, without purporting to list all grounds | [Civil Code, 1052(1)(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1052) | `夫妻之一方對他方為不堪同居之虐待` |
| Court mediation/judicial settlement can end marriage; court notifies registration authority | [Civil Code, 1052-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1052-1) | `離婚經法院調解或法院和解成立者，婚姻關係消滅。法院應依職權通知該管戶政機關。` |
| Family court can require personal appearance or use a suitable other method | [Family Act, 13(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010048&flno=13) | `得命當事人或法定代理人本人到場，或依事件之性質，以適當方法命其陳述或訊問之` |
| Mediation first; direct request treated as mediation application, with public/foreign service exception | [Family Act, 23](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010048&flno=23) | `於請求法院裁判前，應經法院調解` / `視為調解之聲請。但當事人應為公示送達或於外國為送達者，不在此限` |
| Child relationship law must be considered separately | [Conflict-of-laws Act, 55](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=55) | `父母與子女間之法律關係，依子女之本國法。` No assumption of one nationality for a dual-national child. |
| Parental agreement, judicial determination and contact arrangements under Taiwan law | [Civil Code, 1055](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1055) | `依協議由一方或雙方共同任之` / `未為協議或協議不成者，法院得…酌定之` / `會面交往之方式及期間` |
| Best interests are a multi-factor evaluation, not income alone | [Civil Code, 1055-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1055-1) | `應依子女之最佳利益，審酌一切情狀` / `子女之意願及人格發展之需要` / `經濟能力及生活狀況` / `是否有妨礙他方…權利義務行使負擔之行為` |
| Loss of residence basis leads to revocation/cancellation, subject to listed discretionary continuation grounds | [Immigration Act, 31(4)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31) | `居留原因消失者，廢止其居留許可，並註銷其外僑居留證。但…得准予繼續居留` |
| Domestic-violence divorce ground retains registered/resident Taiwan-national spouse and no remarriage conditions | [Immigration Act, 31(4)(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31) | `居住臺灣地區設有戶籍國民之配偶，因遭受家庭暴力離婚，且未再婚` |
| Alternative child-care/parental-rights/contact grounds, child minor and registered in Taiwan | [Immigration Act, 31(4)(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31) | `對在臺灣地區已設有戶籍未成年子女，有撫育事實、行使負擔權利義務或會面交往` |
| Joint registration, approved representation, overseas authentication and Chinese translation | [MOI divorce registration guidance](https://www.ris.gov.tw/documents/html/2/3/1/384.html) | `有正當理由並經戶政事務所核准者，得以書面委託他人辦理` / `應經我駐外館處驗證` / `經駐外館處驗證或國內公證人認證之中文譯本` |

### First-two-paragraph deletion test

| Sentence | Decision and reason |
|---|---|
| `Супруг прислал китайский проект… (условный пример).` | Kept: introduces the actual document-language, departure and child-residence conflict; hypothetical marker is preserved in the same sentence. |
| `В следующем пункте стоит отказ от дальнейших требований.` | Kept: supplies the release clause that makes the proposed signing consequential. |
| `Из такого текста нужно выяснить…` | Kept: identifies the scope of the release and post-departure contact terms as unresolved; not a preview of article sections. |
| `Русский перевод лучше сопоставить…` | Kept: concrete action tied to the Chinese operative draft and pre-signing timing. |
| `Отдельного внимания заслуживают даты платежей…` | Kept: gives the terms to compare and adds currency/transfer costs. |
| `Устное объяснение супруга оставляет слишком много неопределённости…` | Cut: repeats the need to compare the operative document without adding a fact, condition or procedure. |

Legal precision edit: `при достигнутом в суде примирительном соглашении о разводе` became `при оформлении развода в судебной медиации или мировым соглашением в суде. Суд сам уведомляет орган регистрации.` The change makes both statutory alternatives explicit, retains court involvement and separates the notification duty. No obligation, effect or exception was lost.

Compared with 009: no first-person narrator, Korea comparison or contest-to-act-first ending. Compared with 012: the one illustrative scene is explicitly hypothetical and is not labelled a firm case; legal consequences are conditional on applicable Taiwan law. Compared with 015: no same-sequence procedural checklist or generic latest-rules conclusion. This draft's headings combine an effective-registration proposition, a procedural condition, the child's daily-life issue and the ARC basis. The final contact paragraph ends with this family's two concrete facts: ARC date and whether the agreement is already signed.

Dropped/unverified: automatic Taiwan law based only on the spouse's nationality; recognition in Taiwan of Russian judgments as a class; any claim that Russian documents need only an apostille; unrestricted travel with the child; automatic custody for either nationality/parent; automatic residence to the printed ARC date; guarantees of remote participation; a general interpretation of the Civil Code 1052(2) fault proviso. No foreign-law advice is given.

## Section 5 self-check and limitations

The exact requested shared command was run on all three articles. It classified the `ru` directory as `ko`, because this installed version only implements ko/ja/en/zh-hant. It also does not recognize the Russian sources heading or Cyrillic sentence boundaries. Raw result: exit 1; 864 and 865 each report `short_share=0`, and 866 also reports a false sentence-length result. These are not represented as a Russian-language pass. The tool limitation remains; the shared tool was not altered outside the authorized files.

A supplementary Russian-aware check was run in memory with Unicode word recognition, sentence splitting after `.?!` before a Cyrillic/Latin capital or digit, and removal of frontmatter, link destinations and the sources section. It uses the same 0.45 / 8% / 30% thresholds, the same maximum two repeated paragraph starts and two consecutive repeated sentence starts, and checks for multiple 32+-word sentences in one paragraph. It is an author diagnostic, not a certified extension of the shared analyzer. Final figures and counts are recorded below.

Manual section 5 review:

1. Automated limitation disclosed above; supplementary measurements have no failed thresholds. No unsupported-language result is called an official pass.
2. Opening types differ: actual reader question (864), sourced document/procedure fact (865), one expressly hypothetical agreement scene (866). No stock `Suppose`/`Представьте` opener.
3. Each draft contains more than two sentences of eight words or fewer; longer sentences do not accumulate within a paragraph.
4. Paragraph starts checked vertically; no starting word occurs more than twice in a draft.
5. No three consecutive claim/citation/caveat paragraphs. Each draft has non-citation practical paragraphs; every consequential legal claim remains linked.
6. No recurring `не X, а Y` device; the required legal distinctions carry substantive conditions.
7. Endings stay with the individual article's dates, missing shipment document or signed-agreement status. No closing summary.
8. No body H1, bold, invented lawyer narration, public byline or checklist headings. Exactly three FAQ entries; one contact paragraph; allowed consultation languages only. Image descriptions follow I04, I07 and I25, with the prescribed illustrative caption.
9. Statute numbers, time triggers, AND/OR conditions, discretion, source links and hypothetical marker rechecked after editing. Frontmatter and FAQ retain the same qualifications as the body. No claim of native-speaker or lawyer review.

## Final measured counts

Counting convention: visible article text before `## Источники`, including section headings and contact paragraph; exclude YAML, source list, Markdown link destinations and heading markers. A word is a whitespace-delimited unit containing a letter or digit; standalone punctuation is excluded. Characters include spaces and paragraph/heading line breaks. Full-file counts are supplied separately for reproducibility.

| Article | Visible body words | Body characters with spaces | Body characters without whitespace | Raw Markdown whitespace units | Raw Markdown characters |
|---|---:|---:|---:|---:|---:|
| 864 | 707 | 5,559 | 4,830 | 1,037 | 10,197 |
| 865 | 755 | 6,036 | 5,260 | 1,048 | 9,701 |
| 866 | 763 | 5,979 | 5,197 | 1,099 | 10,373 |

Raw counts include frontmatter, link destinations, source list and Markdown syntax, so they are not the article-length test. All three visible bodies meet the brief's 650–950-word range.

| Article | Sentences | Length CV | Share ≤8 words | Similar-length triples | Maximum repeated paragraph opener | Consecutive repeated sentence opener | Paragraphs with multiple ≥32-word sentences | Supplementary failed thresholds |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 864 | 47 | 0.491 | 0.234 | 0.022 | 2 | 1 | 0 | 0 |
| 865 | 51 | 0.518 | 0.255 | 0.041 | 2 | 1 | 0 | 0 |
| 866 | 49 | 0.497 | 0.245 | 0.043 | 2 | 0 | 0 | 0 |

The final exact shared-tool rerun still returned exit 1 under the incorrect `ko` classification: 864 `short_share=0`; 865 `short_share=0`; 866 `short_share=0` and `len_cv=0.402`. An official shared-tool Russian PASS is therefore not claimed. The supplementary diagnostic and manual section 5 check are the available Russian checks.

Final structural validation: YAML parsed; all 16 fields occur in the prescribed order; dates, categories, topic, audience and internal author checked; three FAQs each; title/SEO/summary lengths valid; four content H2 headings plus sources each; no H1/bold; source-list coverage complete; internal column targets exist in the Russian snapshot or this batch; all new slugs are unique across `repo/src/content/columns*`; one contact paragraph per article; three distinct image-menu selections. The source snapshot has only `docs/` and `src/`, with no `public/` assets, so local image-file existence cannot be tested. Exact image-menu paths and descriptions were checked instead; no claim of live image delivery is made.

### Final precision/style review

| Original wording | Problem and reason | Final wording/action | Meaning preserved |
|---|---|---|---|
| 864: `Российская eVisa` | Could suggest the visa is issued by Russia. | `Тайваньская eVisa для россиян` in summary; `eVisa для россиян` in heading/body. | Ordinary Russian passport eligibility, program dates and employment restriction unchanged. |
| 864 heading: `Разрешение работодателя или собственная Gold Card` | Could sound like the employer itself grants legal permission. | `Разрешение по заявлению работодателя или Gold Card`. | Government permit via employer versus direct specialist application retained. |
| 864: `Это подтверждает разъяснение BOCA о паспортах.` | Citation-bearing filler repeats the preceding proposition. | Sentence removed, official link attached to that proposition. | Passport condition and dates preserved. |
| 865: `обязывает экспортёров и импортёров` | Could be read as imposing a Taiwan record duty on the Russian buyer merely because it imports into Russia. | `обязывает тайваньских экспортёров и импортёров`. | Five-year retention and required subsequent-flow disclosure retained within Taiwan-law scope. |
| 866: `при достигнутом в суде примирительном соглашении` | Blurs two statutory procedural alternatives. | Expressly states judicial mediation OR judicial settlement and the court's notification duty. | Article 1052-1 alternatives/effect preserved. |
| Contacts: `несекретное описание` | Non-classified information can still contain sensitive personal material. | `краткое описание… без чувствительных данных`. | Conflict-check identity, Taiwan connection, deadline and no-ID/bank/originals limitation preserved. |

Final article SHA-256 values:

- 864: `3ca5e457d30ee96cf31a159710364d26b2b41eb2dca5b4e2f198f7d57d47a216`
- 865: `36b319f7849771ae27b8a033b0831a7fc199c6c20589d8e1e37a23c20ca76ee5`
- 866: `1725a02a7570880152fd84a37b8d66dc7af3b0f9c262132fb147e2096cf3a035`
