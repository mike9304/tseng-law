# Latvian author note — columns 900–902

Date: 2026-10-24. Locale: `lv`. Assignment: B-INV, P-WORK, L-TRAFFIC. Deliverables are local drafts, not published articles. This note records AI research and editorial checks; it does not claim review by a human Latvian speaker or lawyer.

## Scope and reading record

Only `drafts/lv/` and this note were written. No git, publication, installation, canonical-repository changes or other-locale edits were performed. Existing complete statute caches were read by `tools/law.py`; fresh official pages were fetched into process memory for comparison, without changing those caches.

Read in full: `briefs/BRIEF.md`, `briefs/ASSIGNMENTS.md`, `briefs/IMAGE-MENU.md`, `repo/docs/columns/EDITORIAL-VOICE.md`, `repo/docs/columns/FRONTMATTER.md`, `rules/SENTENCE-VARIETY-RULE.md`, `rules/LESSONS.md`, `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, the tseng-law-editorial skill and its independent-review criteria. The two batch rules are byte-identical to `/Users/son7/tseng-lanes-shared/` copies. The old voice pointer's `~/agent-library/knowledge/editorial-voice.md` was absent; repository AGENTS explicitly permits its repository copy on another machine. The current brief controls contact details and internal author metadata; retired Fable requirements were not reinstated.

Same-locale full-text comparators: `repo/src/content/columns-lv/008-taiwan-labor-severance-law.md`, `014-taiwan-mandatory-employment-period.md`, `016-taiwan-inheritance-custody-analysis.md`. These supplied the exact category `Juridiskā informācija par Taivānu`, `N min` read-time pattern and the date pattern `24. oktobrī 2026. gadā`. Their older author footers, H1s, formulaic introductions and numbered checklists were not copied.

Structural readings, all under `repo/src/content/`:

- Invoice: `columns-en/354-unpaid-invoices-taiwan-buyer-payment-order-attachment.md`; `columns-fr/674-france-exporter-taiwan-unpaid-invoices-credit-notes-returns.md`; `columns-es/689-spain-exporter-taiwan-unpaid-invoices.md`; `columns-hi/669-indian-supplier-unpaid-taiwan-invoice.md`; `columns-th/663-thai-supplier-taiwan-buyer-unpaid-invoice.md`.
- Work/residence: `columns-en/705-taiwan-visa-residence-work-study-family.md`; `704-taiwan-arc-first-application.md`; `706-taiwan-arc-renewal-changes-reentry.md`; `352-hiring-in-taiwan-without-local-entity-eor-pe-work-permits.md`.
- Accident: `columns-en/003-taiwan-traffic-accident-procedure.md`; `611-taiwan-scooter-outer-lane-left-turn-dashcam.md`; `columns-th/662-thai-return-home-taiwan-traffic-injury-records.md`.

Read the source register, relevant verified Latvia rows and stated limits in `research/country-facts.md`. It is a shared country ledger, not authority for an unverified claim. The relevant entry and working-holiday rows were independently checked against live official pages; the licence row remains unverified.

## Country evidence and topic choices

| Article | Reader and trigger | Why this fits Latvia; evidence strength | Overlap and new angle |
|---|---|---|---|
| 900 | A Latvian timber exporter has an overdue invoice and a different shipment disputed for moisture; it needs a Taiwan collection decision. | The International Trade Administration's [Latvia profile](https://www.trade.gov.tw/Files/PageFile/717896/717896qizls20260515173509.pdf), dated 2026-05-15, p. 4, lists Taiwan imports from Latvia including `木材及木質包裝產品(4407、4415)`. The commodity list is labeled 2023. This is historical bilateral product evidence supporting the chosen hypothetical, not evidence of present arrears or demand. The story is explicitly marked `izdomāts piemērs` in its first sentence. | Shared lv/013 concerns company formation, not collection; the internal link supplies limited company-structure context. Existing invoice structures supply verified legal questions, but the Latvian article starts with separate timber lots, moisture-test dates and credits. It does not copy the Oregon, French, Spanish, Indian or Thai scenarios. |
| 901 | A Latvian citizen has a Taiwan professional job offer and is planning arrival with a spouse or children. | [BOCA](https://www.boca.gov.tw/fp-149-4486-7785a-1.html) lists Latvia for up to 90 days, with passport/travel/entry conditions. Latvia is absent from the complete [MOFA working-holiday table](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6426), so the assigned P-WORK route is retained. Demand for this article is an editorial hypothesis, not measured volume. | lv/008 and lv/014 concern existing employment, severance or minimum service; this article concerns permission before starting work and the family's own residence documents. It distinguishes Latvian citizenship from residence/language without deciding the unverified non-citizen-passport question. |
| 902 | A Latvian visitor is injured in Taiwan and expects to continue treatment after returning to Latvia. | Cross-border follow-up is a labeled editorial hypothesis, not a claim about Latvian accident frequency. [NPA's document timetable](https://www.npa.gov.tw/ch/app/faq/view?id=2144&module=faq&serno=A1084129) creates a concrete issue when departure precedes document availability. | Shared lv/003 is a broad accident Q&A; the new article follows the documents from Taiwan to Latvian treatment, preserves euro-denominated receipts, separates claim deadlines from the flight date, and bounds authorization to settle. It omits disputed licence reciprocity. |

The research-only agent `lv_country_research` owned no files and returned evidence in messages. Its searches on 2026-10-24 included `site.trade.gov.tw 拉脫維亞 進口 主要 產品`, `site.mofa.gov.tw 拉脫維亞 我國 進口 木材`, `"Taivāna" "darba atļauja"` and `"Taivāna" "parādu piedziņa"`. Search results did not establish demand, rankings or conversion rates. Live firm contact/listing requests were inaccessible (403/access errors), so only the current brief's permitted email, contact page and languages were used. No live service verification is claimed.

## Verification method and law status

Every statute provision actually cited in the three drafts was printed by `python3 tools/law.py <PCODE> <articles>` before drafting and compared with the proposed claim. All 36 distinct cited provisions also matched fresh official LawAll text, normalized only to remove HTML and whitespace, on 2026-10-24. No cached-to-live mismatch occurred. The program printed the correct Chinese law titles.

Relevant calls (some additional provisions were read for scope but not used):

```text
python3 tools/law.py B0000007 20 36
python3 tools/law.py B0000001 127 128 129 130 132 184 193 195 197 217 736 737
python3 tools/law.py B0010001 508 509 511 515 516 519 521 522 523 526 70
python3 tools/law.py N0090001 43 46 48
python3 tools/law.py A0030295 4 5 9 16
python3 tools/law.py D0080132 22 31
python3 tools/law.py G0390060 7 13 27 31
python3 tools/law.py C0000001 284 287
python3 tools/law.py C0010001 236-1 237 238
```

The Civil Code carries a partial-unenforced banner. Its [official history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001) identifies article 166-1 (commencement undetermined) and the amendment to article 1223 promulgated 2026-08-17 (effective six months after promulgation). Neither provision is used. The cited invoice, tort and settlement provisions are already effective; the articles explicitly state the 2026-10-24 check date and applicable-current-provision scope.

The [Foreign Professionals Act history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295) was read live through curl after web open failed. It records the 2025-11-18 Executive Yuan order: most provisions effective 2026-01-01; article 4(4)(4), latter portion, and articles 28–29 effective 2026-06-30. All provisions used here are effective by the stated check date. Family article 16(2) expressly distinguishes an ordinary foreign professional actually doing professional work in Taiwan from a foreign special professional; both require approved residence/permanent residence.

## Article 900 claim → source ledger

| Claim / preserved condition | Official provision and URL | Chinese excerpt checked |
|---|---|---|
| Parties' law choice; without valid express choice, closest connection | [涉外民事法律適用法 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) | `依當事人意思定其應適用之法律。` / `當事人無明示之意思或其明示之意思依所定應適用之法律無效時，依關係最切之法律。` |
| Limitation follows the law governing the underlying relationship | [Same law 36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=36) | `請求權之消滅時效，依該請求權所由發生之法律關係所應適用之法律。` |
| Two years for a covered goods-price claim only if Taiwan law applies | [民法 127(8)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=127) | `因二年間不行使而消滅` / `八、商人、製造人、手工業人所供給之商品及產物之代價。` |
| Start when the claim can be exercised | [民法 128](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=128) | `消滅時效，自請求權可行使時起算。` |
| Demand, acknowledgment and suit; specified applications have suit-equivalent effect | [民法 129](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=129) | `一、請求。二、承認。三、起訴。` / `依督促程序，聲請發支付命令。` / `聲請調解或提付仲裁。` |
| Demand interruption is deemed absent unless followed within six months | [民法 130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130) | `若於請求後六個月內不起訴，視為不中斷。` |
| Payment order possible for a specified monetary amount | [民事訴訟法 508](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=508) | `以給付金錢或其他代替物或有價證券之一定數量為標的者，得聲請法院依督促程序發支付命令。` |
| Excluded if claimant has not performed reciprocal obligation, or foreign/public service required | [民事訴訟法 509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509) | `應為對待給付尚未履行，或支付命令之送達應於外國為之，或依公示送達為之者，不得行之。` |
| Facts and preliminary substantiation required | [民事訴訟法 511](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=511) | `請求之原因事實。其有對待給付者，已履行之情形。` / `債權人之請求，應釋明之。` |
| Objection without reasons within 20 days after service | [民事訴訟法 516](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=516) | `得於送達後二十日之不變期間內，不附理由向發命令之法院提出異議。` |
| Timely lawful objection removes effect to that extent; application treated as suit/mediation | [民事訴訟法 519](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=519) | `支付命令於異議範圍內失其效力` / `視為起訴或聲請調解。` |
| Unopposed order is an enforcement title; debtor may challenge existence of claim | [民事訴訟法 521](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=521) | `未於法定期間合法提出異議者，支付命令得為執行名義。` / `主張支付命令上所載債權不存在而提起確認之訴者` |
| Provisional attachment can secure a monetary claim | [民事訴訟法 522](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=522) | `欲保全強制執行者，得聲請假扣押。` |
| Risk of later impossibility or serious difficulty required | [民事訴訟法 523](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523) | `非有日後不能強制執行或甚難執行之虞者，不得為之。` |
| Preliminary showing of claim and reason; court may require security | [民事訴訟法 526](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526) | `請求及假扣押之原因，應釋明之。` / `法院亦得命債權人供擔保後為假扣押。` |

Practical invoice reconciliation, original-message preservation and moisture-measurement records are preparation suggestions, not claims that a particular defect or deduction is legally proved. No automatic Latvian-judgment recognition, collection success, court fee, foreign-law prescription period or fixed security amount is asserted.

## Article 901 claim → source ledger

| Claim / preserved condition | Official provision and URL | Chinese excerpt checked |
|---|---|---|
| Work requires permit or applicable statutory exception | [就業服務法 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | `除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。` |
| Professional and special-professional status follow defined categories | [外國專業人才延攬及僱用法 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=4) | `外國專業人才：指得在我國從事專業工作之外國人。` / `外國特定專業人才` / `專業工作：指下列工作` |
| Employer normally applies to MOL; defined education jobs go to MOE | [Same Act 5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | `除本法另有規定外，應檢具相關文件，向勞動部申請許可` / `應檢具相關文件，向教育部申請許可。` |
| Qualifying special professionals may apply directly for four-in-one Gold Card; initial 1–3 years | [Same Act 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | `得逕向內政部移民署申請核發具工作許可、居留簽證、外僑居留證及重入國許可四證合一之就業金卡。` / `有效期間為一年至三年` |
| Authorized/exempt professional after visa-free/visitor entry may apply directly; ARC upon approval | [Same Act 16(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | `以免簽證或持停留簽證入國，經許可或免經許可在我國從事專業工作者，得逕向內政部移民署申請居留；經許可者，發給外僑居留證。` |
| Family route: ordinary professional actually working in Taiwan OR special professional; sponsor approved residence/permanent residence; spouse, minor children, specified disabled adult children; qualifying entry | [Same Act 16(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | `外國專業人才在我國從事專業工作及外國特定專業人才，經內政部移民署許可居留或永久居留者，其配偶、未成年子女及因身心障礙無法自理生活之成年子女，以免簽證或持停留簽證入國者` |
| Resident-visa entry/residence approval: ARC within 30 days from next day; integrated-document exception | [入出國及移民法 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | `應於入國後之翌日起算三十日內，向移民署申請外僑居留證。` / `四證合一之有效證件，或其他已含有外僑居留證功能之證件者，得免申請外僑居留證。` |

Official non-statute checks:

- [BOCA visa exemption](https://www.boca.gov.tw/fp-149-4486-7785a-1.html): Latvia in up-to-90-day list; passport validity at least six months from entry; formal-passport restrictions; confirmed return/onward arrangements; immigration eligibility; day-after-arrival count. No determination of Latvian non-citizen documents was found or invented.
- [MOFA partner table](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6426): Latvia absent. The introduction and table disagree on total partner count; no total was repeated.
- [Gold Card Office](https://goldcard.nat.gov.tw/en/about/): application without employer sponsorship or already secured employment, subject to professional qualification. Conflicting processing-time estimates were omitted.
- [NIA visitor/visa-free residence guide](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news), updated 2026-04-14: entry-route eligibility, documentation and exclusions. No universal right to convert every entry status is claimed.
- [NIA residence-document guide](https://www.immigration.gov.tw/5475/5478/141465/141808/141970), updated 2026-04-14: overseas-document authentication, possible verified/notarized Chinese translation, purpose-specific employment and family evidence. Formal application documents are kept distinct from the non-sensitive first law-firm inquiry.

## Article 902 claim → source ledger

| Claim / preserved condition | Official provision and URL | Chinese excerpt checked |
|---|---|---|
| Statutory injury/death insurance benefits regardless of injurer's negligence, within Act | [強制汽車責任保險法 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0390060&flno=7) | `不論加害人有無過失，請求權人得依本法規定向保險人請求保險給付` |
| Covered accident definition: passengers and third parties outside vehicle | [Same Act 13](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0390060&flno=13) | `指使用或管理汽車致乘客或車外第三人傷害或死亡之事故。` |
| Benefit categories exclude property repair | [Same Act 27](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0390060&flno=27) | `一、傷害醫療費用給付。二、失能給付。三、死亡給付。` |
| Intentional/negligent unlawful infringement and resulting damage | [民法 184(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=184) | `因故意或過失，不法侵害他人之權利者，負損害賠償責任。` |
| Earning-capacity reduction/loss and increased needs caused by injury | [民法 193](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=193) | `因此喪失或減少勞動能力或增加生活上之需要時，應負損害賠償責任。` |
| Appropriate non-pecuniary compensation for qualifying injury/health infringement | [民法 195](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=195) | `不法侵害他人之身體、健康` / `被害人雖非財產上之損害，亦得請求賠償相當之金額。` |
| Two years from knowledge of damage AND liable person; ten years from tort | [民法 197](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=197) | `自請求權人知有損害及賠償義務人時起，二年間不行使而消滅，自有侵權行為時起，逾十年者亦同。` |
| Victim's own negligence contributing to occurrence/increase permits reduction or exemption | [民法 217(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=217) | `損害之發生或擴大，被害人與有過失者，法院得減輕賠償金額，或免除之。` |
| Negligent injury offence | [中華民國刑法 284](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=284) | `因過失傷害人者` / `致重傷者` |
| Article 284 offences require a complaint | [中華民國刑法 287](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=287) | `第二百七十七條第一項、第二百八十一條及第二百八十四條之罪，須告訴乃論。` |
| Six months from entitled complainant learning offender identity | [刑事訴訟法 237](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=237) | `應自得為告訴之人知悉犯人之時起，於六個月內為之。` |
| Complaint through appointed representative; authority may require personal attendance | [刑事訴訟法 236-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=236-1) | `告訴，得委任代理人行之。但檢察官或司法警察官認為必要時，得命本人到場。` |
| Civil litigation settlement requires special authorization | [民事訴訟法 70](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=70) | `但捨棄、認諾、撤回、和解、提起反訴、上訴或再審之訴及選任代理人，非受特別委任不得為之。` |
| Settlement means mutual concessions to end/prevent dispute | [民法 736](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=736) | `互相讓步，以終止爭執或防止爭執發生之契約。` |
| Waived rights extinguished; agreed settlement rights acquired | [民法 737](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=737) | `使當事人所拋棄之權利消滅及使當事人取得和解契約所訂明權利之效力。` |

[NPA FAQ](https://www.npa.gov.tw/ch/app/faq/view?id=2144&module=faq&serno=A1084129), page updated 2025-10-15 and opened live 2026-10-24: `於事故7日後得申請閱覽或提供「現場圖」、「現場照片」。` / `於事故30日後得申請提供「道路交通事故初步分析研判表」。` These are eligibility-to-request dates, not guaranteed delivery dates. No new statute citation to the FAQ's underlying regulations is made in the draft.

Medical-record continuity, original-file preservation, euro receipt schedules and asking the receiving authority about translations are preparation suggestions. They do not promise admission of Latvian evidence, reimbursement of every expense, unrestricted departure, remote-only proceedings or any particular medical result.

## Statements deliberately excluded

- Latvian driving licence/IDP recognition or exchange: country ledger is explicitly unverified; official Highway Bureau responses were blocked. No inference from outbound Taiwan licence rules.
- Entitlement or exclusion for Latvian non-citizen passports: no specific Taiwanese official determination found. Article 901 directs document-specific verification and limits its positive claim to Latvian citizens.
- Latvian-law rules, automatic recognition of Latvian judgments, treaty-based tax relief, professional qualification thresholds, processing guarantees and statistics of Latvian disputes: unnecessary to the selected questions or not verified.
- Higher current trade volumes, prevalence of timber defects and actual firm/client histories: neither the 2023 commodity list nor a hypothetical proves these.
- Exact compulsory-insurance sums and future treatment reimbursement: not needed; no statutory benefits table is imported without the accident-date analysis.
- An ARC for every family member automatically, work rights from a dependent ARC, or resident-card deadlines as a general visitor grace period: unsupported and expressly avoided.

## First-two-paragraph deletion tests

Sentence labels refer to the revised manuscript, before its first H2. Quoted snippets identify sentences; each entire sentence was considered for deletion.

| Article / sentence | Decision and reason |
|---|---|
| 900 P1 S1, `Taivānas pircējs saņem Latvijas uzņēmuma zāģmateriālus…` | Keep. Establishes the Latvian exporter, Taiwan buyer, moisture deduction and separate older invoice. The inline hypothetical label remains attached to the invented facts. |
| 900 P1 S2, `Vienā kopējā parāda summā pazūd atšķirība…` | Keep. Explains why combining the two invoices obscures the reader's collection question. |
| 900 P2 S1, `Eksportētāja sagatavotajā uzskaitē katrai partijai…` | Keep. Connects each lot to the order, specification, transport evidence and payment deadline. |
| 900 P2 S2, `Noliktavas saņēmējs var atšķirties…` | Keep, joining the former recipient explanation and comparison instruction. Identifies which company names must be reconciled and why. |
| 900 P2 S3, `Saglabājiet arī pircēja iebildumus.` | Keep. Adds the buyer's objections to the evidence set and gives a short pause. |
| 901 P1 S1, `Vai drīkst sākt darbu…` | Keep. Asks the practical question about an offered start date after entry with a Latvian passport. |
| 901 P1 S2, `Pirms darba sākuma jābūt atļaujai…` | Keep, joining the requirement and its article-43 attribution. States the permit/exception condition without an orphan source sentence. |
| 901 P1 S3, `Parakstīts darba līgums pats par sevi…` | Keep. Resolves the distinction implied by the employer's offered start date. |
| 901 P2 S1, `Pārcelšanos no Latvijas ieteicams plānot…` | Keep. Identifies the permit applicant, entry basis and residence sequence. Repair `darba pieteikumu` to `darba atļaujas pieteikumu` prevents confusion with a job application. |
| 901 P2 S2, `Ja līdzi brauc ģimene…` | Keep. Adds family documents before the article turns to the separate family route. |
| 901 former P2 S3, `Viena cilvēka darba piedāvājums neatbild uz visas ģimenes dokumentu jautājumiem.` | Cut after independent review. Repeated the preceding family's-document point without adding a condition. |
| 902 P1 S1, `Septiņas dienas pēc negadījuma…` | Keep, joining the NPA attribution to the request timetable. The seven- and thirty-day dates concern requests, not guaranteed delivery. |
| 902 P1 S2, `Ja lidojums uz Latviju ir agrāk…` | Keep. Converts the official timetable into the Latvian visitor's concrete problem. |
| 902 former P2 S1, `Tie ir pieteikšanās brīži.` | Cut after independent review. `var pieprasīt` already identifies the action. The separate delivery limitation is retained. |
| 902 revised P2 S1, `Tas negarantē dokumentu izsniegšanu konkrētajā dienā.` | Keep. Prevents reading the NPA dates as issuance promises. |
| 902 P2 S2, `Pirms izbraukšanas pierakstiet…` | Keep. Names the police unit, case identifiers, medical records and contact arrangement needed after departure. |
| 902 P2 S3, `Atsevišķi pārbaudiet jau noteiktos ierašanās datumus…` | Keep. Prevents the flight-focused opening from implying that a known attendance obligation can be ignored. |

## Comparison with three existing Latvian columns

The three accessible snapshot comparators were read in full. None has a `published` field; all display `13. septembrī 2025. gadā`. Their `lastmod` values below are modification dates, not invented publication dates or proof of live publication. They are the brief's suggested same-locale sample, not a claim that these are the site's three newest articles.

| Comparator path under `repo/src/content/columns-lv/` | Date evidence | Opening, headings and ending |
|---|---|---|
| `008-taiwan-labor-severance-law.md` | Displayed 2025-09-13; lastmod 2026-10-07 | First-person lawyer framing and an article-purpose announcement; fragmented explanatory progression; cautionary general ending and legacy author framing. New articles omit the invented first-person stance and purpose announcement. |
| `014-taiwan-mandatory-employment-period.md` | Displayed 2025-09-13; lastmod 2026-07-25 | Definition and four-question framing, eleven numbered sections including checklist/materials/links, then general disclaimer and legacy byline. New articles use four unnumbered issue headings and no checklist conclusion. |
| `016-taiwan-inheritance-custody-analysis.md` | Displayed 2025-09-13; lastmod 2026-10-11 | Broad scope introduction and distinctions, eleven numbered sections including preparation checklist and source/link sections, then general disclaimer and legacy byline. New articles stay with one current decision and end on its particular evidence. |

| New article | Against 008 | Against 014 | Against 016 |
|---|---|---|---|
| 900 | Opens with a marked timber-invoice hypothetical, not a lawyer's experience; finishes with the oldest invoice's agreed due date. | Four issue headings follow choice of law, demand, order and security; no general numbered checklist. | Explains one exporter dispute rather than surveying a legal field; the last sentence identifies evidence for the first assessment. |
| 901 | Opens with the employee's actual start-date question; no author introduction or lawyer persona. | Addresses permission before work and family residence, with a limited link to 014 for the separate contract question. Its headings follow the entry/permit/card/family decisions. | Keeps family entry tied to the sponsor's statutory status instead of a broad family-law overview; ends on the date work can lawfully start. |
| 902 | Opens with an official request timetable and Latvia departure consequence; no invented accident client story. | Four headings follow cross-border records, compensation, deadlines and authority to settle, rather than numbered instructions. | Ends on continuity between Taiwan and Latvian medical records, not a generic family checklist or summary disclaimer. |

## Sentence-variety self-check and independent review record

The prescribed variety checker was run on each draft with `--lang lv`. All three calls exited 2 because Latvian is unsupported; no automated FAIL-0/PASS is claimed. This is an unresolved tooling limitation, not a passing score. No checker, language definition, cache or repository file was modified. Supplementary lexical diagnostics are reported below as an author aid, not a validated Latvian implementation of the prescribed tool.

Manual section-5 self-check:

1. Official measurement: unsupported (`exit 2`), as above.
2. Openings differ: 900 marked concrete scene, 901 reader question, 902 official numeric timetable. The hypothetical marker is inside 900's first sentence, not a stock opening phrase. One of three articles uses a scene.
3. Every draft contains multiple sentences of eight or fewer whitespace-delimited words. Where a longer sentence keeps the full legal condition together, a short sentence follows; no paragraph contains two sentences of 32 or more words.
4. Paragraph beginnings were read vertically: no repeated first word exceeds two occurrences. The three final factual endings also start differently.
5. Citation positions vary between subject, introductory phrase and final parenthesis, with uncited practical paragraphs. A reviewer identified the revised 900 paragraph's three consecutive final-parenthesis citations; article 519 was moved into the next sentence's opening without changing the rule or URL.
6. Contrasts address the actual reader's entry/work, application/approval, document/issuance and claim/evidence questions. No invented reader belief or repeated `not X but Y` formula was added.
7. Each contact paragraph is followed by an article-specific final sentence. None ends with sales language or an article summary. Required contact, language and first-inquiry boundaries remain.
8. Latvian professional register is consistent. No bold, body H1, invented first-person lawyer narrative or imperative checklist heading. Korean/Japanese register tests are inapplicable.
9. After rhythm repairs, all cited law URLs, legal periods and start events, the conjunctive family-residence conditions, insurance scope and hypothetical label remain. FAQ deadline wording was corrected together with the body.

Independent AI Latvian reviewer `lv_locale_review` did not author the articles and owned no files. Its first review returned REQUEST_CHANGES for original hashes `6fe1c44ec094b5c9673168ed79ea4894a33bc60e7ebb19f4c6cd015661b6db36`, `af38380f161b64c2f3245760b6e97cc05b49b2010551c5dffcaa0501c92dd689`, and `667cd3a991549acf686b5231aca013b748d4aa94c33dbf3e9e7f83038e0e2518`.

Applied findings: 900 makes six months run after the demand and twenty days after service on the debtor, in both body and FAQ; 901 specifies work-permit application, replaces the literal `Ģimenes ceļš`, and makes consultation language an advance arrangement; 902 preserves records of visits rather than visits themselves and identifies the person whom a court may exempt under article 217. Both redundant opening sentences identified above were cut. Three suggested joins and subsequent bounded source/consequence joins improved connected prose without removing legal conditions. The focused rereview's citation-rhythm repair in 900 was also applied.

The independent AI Latvian recheck returned PASS for all three final manuscript hashes in the table below. It confirmed all earlier findings resolved, unchanged sets of 15 / 6 / 15 cited provisions, every body evidence link represented in Sources, and retained family sponsor/work/residence/approval conditions. Its PASS is a manual editorial disposition, not an automated variety PASS or human/native-speaker certification.

Supplementary measurement uses main-text paragraphs only (headings excluded), renders Markdown links as labels, protects the ordinal period after a digit before a lowercase Latvian letter, then splits sentences at `.`, `!` or `?` followed by whitespace. Length is whitespace-delimited words; CV is population standard deviation divided by mean. A similar-length triple here has maximum length no more than 1.25 times minimum length. This is a disclosed auxiliary method, not the official checker's language model. Final results:

| Article | Sentences | CV | Sentences ≤8 words | Similar triples | Most frequent paragraph opener | Final-parenthesis citations | Maximum ≥32-word sentences per paragraph |
|---|---:|---:|---:|---:|---:|---|---:|
| 900 | 48 | 0.470 | 10 (20.8%) | 1/46 | 1 | 6/48; max run 2 | 0 |
| 901 | 51 | 0.453 | 9 (17.6%) | 2/49 | 2 | 1/51; max run 1 | 1 |
| 902 | 47 | 0.472 | 7 (14.9%) | 3/45 | 1 | 4/47; max run 2 | 1 |

Each article has one genuine body question, no adjacent sentences with the same first word, and no more than two digit-based numeric tokens in a sentence. In 901 and 902 the single long sentence is followed by a five- and six-word sentence respectively. In 900 no sentence reaches 32 words. Qualitative contrast and conditional-meaning checks remain manual.

## Packaging checks and final versions

Main text means headings and rendered link labels before `## Avoti`, with frontmatter, source list, URLs and Markdown syntax excluded, and whitespace normalized to single spaces. Character counts include spaces.

| File | Main-text words | Main-text characters, including spaces | SHA256 |
|---|---:|---:|---|
| `drafts/lv/900-latvian-timber-exporter-taiwan-unpaid-invoices.md` | 669 | 5,300 | `681e93258f33d87d2af01567054f01ac4b228b034abc7071dfe57484ae1f7561` |
| `drafts/lv/901-latvian-professional-taiwan-work-permit-family.md` | 751 | 5,995 | `135c7694a75ecc2a5686b296ce56f1d1023f47b24ab5d5334d2c0131d41117a8` |
| `drafts/lv/902-latvian-visitor-taiwan-traffic-injury-return-home.md` | 674 | 5,556 | `1dd1f36062c0b26ff02d41ca31e3ddea8df931441a6306d9797c6ff78893d0a3` |

Final schema/field-order, title/SEO/summary lengths, 650–950-word body lengths, dates/category/audience/author, three FAQs, four issue headings plus Sources, source coverage, internal links, menu image paths, country-cue filenames and markup checks passed. The gate's current inventory scan found no existing-site or batch slug collision. No content was published or copied into the canonical repository.

The batch gate can use the already installed `gray-matter` dependency without installation:

```text
NODE_PATH=/Users/son7/Projects/tseng-law/node_modules REPO="$PWD/repo" node tools/gate.mjs lv
```

Its final run exits 1 with exactly three missing-image failures, one for each exact menu-approved path absent from this read-only snapshot's `public/` folder: I01 for 900, I12 for 901, I23 for 902. It reports no other failures. The Civil Code pending-amendment warning is resolved substantively above. No replacement image, asset copy or repository modification was made. Public image content has not been verified. The gate's own counts include the source section and exclude whitespace from characters, so they are not the main-text counts defined here. The official variety command was rerun on each final manuscript and again exited 2 (`invalid choice: 'lv'`); no automated pass is claimed.

Independent AI final legal/source reviewer `lv_final_review`, who did not author the articles and changed no files, returned PASS on 2026-10-24 for all three exact hashes above. It independently printed all 36 cited provisions with `tools/law.py` and compared each with fresh official MOJ text; all matched. It verified the Civil Code's pending provisions do not affect the citations, the Foreign Professionals Act's commencement, the BOCA/MOFA/NIA/Gold Card pages, the NPA request timetable and the Latvia timber profile.

No material legal or factual finding remained. The reviewer specifically confirmed 900's choice-of-law sequence, six-month demand follow-up, service-triggered objection period and provisional-attachment discretion; 901's separation of entry/work/residence and full article-16(2) sponsor/family conditions; and 902's request-versus-delivery distinction, insurance scope, causation/contributory negligence, deadline triggers and representation/settlement limits. FAQ/body conditions agreed. Its independent schema, source, link, image-menu and count readback matched the final table.

Authoring and the documented manual/independent reviews are complete. The official Latvian variety measurement remains unavailable, the three snapshot image assets remain missing, and the live contact page could not be verified; permitted service details come from the brief. This is a draft handoff, not publication, a full automated-gate pass, human/native-speaker review or lawyer certification.
