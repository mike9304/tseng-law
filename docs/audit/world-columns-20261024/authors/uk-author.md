# Ukrainian batch author note — 24 October 2026

Locale: uk. Assignment: 867 P-WORK; 868 L-MARRY; 869 B-INV. The recommended topics were retained. Authored outputs are the three files in drafts/uk/ and this note. No publication, repository edits, package installation, or git operation was performed.

## Reading and scope

Read BRIEF.md and ASSIGNMENTS.md in full, the repository EDITORIAL-VOICE.md and FRONTMATTER.md, IMAGE-MENU.md, rules/SENTENCE-VARIETY-RULE.md and rules/LESSONS.md, and research/country-facts.md. The country ledger was treated as research evidence, not as permission to use unfinished entries. The Ukraine facts used in the articles were independently checked against the government sources below.

The requested ~/agent-library/knowledge/editorial-voice.md was absent. The repository copy at repo/docs/columns/EDITORIAL-VOICE.md was read in full and used, including the 20 October prohibition on public bylines. Also read /Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md and the shared /Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md and LESSONS.md. The local and shared variety-rule versions differ; the current local batch rule governs the three different opening types.

Existing Ukrainian columns read in full:

- repo/src/content/columns-uk/008-taiwan-labor-severance-law.md
- repo/src/content/columns-uk/014-taiwan-mandatory-employment-period.md
- repo/src/content/columns-uk/016-taiwan-inheritance-custody-analysis.md

Structural sources read in full:

- P-WORK: columns-en/705-taiwan-visa-residence-work-study-family.md; 704-taiwan-arc-first-application.md; 706-taiwan-arc-renewal-changes-reentry.md; 352-hiring-in-taiwan-without-local-entity-eor-pe-work-permits.md.
- L-MARRY: columns-en/022-marrying-taiwanese-national-registration-checklist.md.
- B-INV: columns-en/354-unpaid-invoices-taiwan-buyer-payment-order-attachment.md; columns-fr/674-france-exporter-taiwan-unpaid-invoices-credit-notes-returns.md; columns-es/689-spain-exporter-taiwan-unpaid-invoices.md; columns-hi/669-indian-supplier-unpaid-taiwan-invoice.md; columns-th/663-thai-supplier-taiwan-buyer-unpaid-invoice.md.

These are structural references, not substitutes for current statutory verification. Old public lawyer bylines, first-person anecdotes, addresses, fees, demand-frequency claims, and requests to email original documents were not transferred.

## Statute verification and effective dates

Every statute article used in the body or FAQ was checked with the unchanged tools/law.py parser. Final verification fetched the official LawAll HTML using curl into memory and ran tools/law.py through runpy, providing an in-memory read of its expected cache file. This avoided creating or refreshing shared html/ files outside the author's permitted output paths. These were the argument sets:

~~~text
tools/law.py N0090001 43 48
tools/law.py A0030295 4 5 9 15 16
tools/law.py D0080132 22 23
tools/law.py B0000001 127 128 129 130 132 982
tools/law.py B0000007 20 36 46
tools/law.py B0010001 508 509 511 515 516 519 521 522 523 526
~~~

All requested articles were found under the correct law titles. No NOT FOUND result was used.

| Pcode | Printed law title / amendment date | Effective-date check |
|---|---|---|
| N0090001 | 就業服務法; 114/01/20 | No pending-effect banner in fetched text. |
| A0030295 | 外國專業人才延攬及僱用法; 114/09/24 | The [law history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295) records 115/01/01 for most amendments and 115/06/30 for the specified art. 4 portion and arts. 28–29. Both dates precede 24 October 2026. |
| D0080132 | 入出國及移民法; 112/06/28 | No pending-effect banner in fetched text. |
| B0000001 | 民法; 115/08/17 | tools/law.py printed the pending-effect warning. The banner identifies art. 166-1, whose commencement remains separately determined, and the amendment to art. 1223, effective six months after promulgation. Neither is used. Arts. 127–132 and 982 are not the pending provisions. Both affected articles state the 24 October 2026 reference date in their bodies. |
| B0000007 | 涉外民事法律適用法; 99/05/26 | No pending-effect banner in fetched text. |
| B0010001 | 民事訴訟法; 112/11/29 | No pending-effect banner in fetched text; art. 515 para. 2 was read and its special filing rule retained. |

## 867 — Ukrainian professional, work permission and residence

File: drafts/uk/867-ukrainian-professional-taiwan-work-permit-residence.md

Final count: 716 words; 5273 characters including spaces; 4558 excluding spaces. Counting convention and checksum appear below.

Reader and trigger: a Ukrainian professional has a Taiwan job offer and is negotiating a start date; the application may be made from Ukraine or a third country, and a spouse or child may accompany the worker.

Country fit: the absence of Ukraine from BOCA's current ordinary visa-exempt nationality lists is verified. The need to reconcile nationality, present residence and the issuing country of documents is a practical reader hypothesis, not a claim about migration volumes. No assumption is made that residence in an EU country changes Ukrainian passport eligibility.

Overlap and new angle: Ukrainian 008 and 014 concern employment termination and contractual service periods; neither supplies an entry/work/ARC route for a Ukrainian applicant. The new article addresses the pre-employment decision and distinguishes the principal applicant's work permission from the family's residence and spouse's separate work permission. The internal link to 868 covers the different Taiwan-national spouse route.

### Claim → source record

| Claim used | Official source / provision | Chinese excerpt checked or non-statute evidence |
|---|---|---|
| Default prohibition on working before employer-applied permission, subject to statutory exceptions | [Employment Service Act 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | 除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。 |
| Professional categories and defined work, rather than job-title shorthand | [Foreign Professionals Act 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=4) | 外國專業人才：指得在我國從事專業工作之外國人。／專業工作：指下列工作 |
| Employer applies to MOL; designated education jobs to MOE; other statutory rules retained | [5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | 除本法另有規定外…向勞動部申請許可…但…向教育部申請許可 |
| Special-professional Gold Card, direct application, four combined documents, one to three years | [9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | 得逕向內政部移民署申請核發具工作許可、居留簽證、外僑居留證及重入國許可四證合一之就業金卡。／有效期間為一年至三年 |
| Spouse's direct work-permit application restricted to special/senior professional categories with approved dependent residence; permit duration limit | [15 para. 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15) | 外國特定專業人才及外國高級專業人才之配偶…許可在我國依親居留者，得逕向勞動部申請許可…不得逾其依親居留期間 |
| Direct residence application after qualifying visa-exempt/visitor entry and authorized/exempt professional work | [16 para. 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | 以免簽證或持停留簽證入國，經許可或免經許可…得逕向…申請居留；經許可者，發給外僑居留證 |
| Family eligibility, sponsor's work/status conditions and disability-dependent adult children | [16 para. 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | 外國專業人才在我國從事專業工作及外國特定專業人才…許可居留或永久居留者，其配偶、未成年子女及因身心障礙無法自理生活之成年子女 |
| ARC application within 30 days from the day after entry; integrated-document exception | [Immigration Act 22 para. 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | 應於入國後之翌日起算三十日內…但…四證合一之有效證件，或其他已含有外僑居留證功能之證件者，得免申請 |
| Ordinary Ukrainian passport alone does not qualify for this visa-exempt programme | [BOCA visa-exempt entry](https://www.boca.gov.tw/fp-384-4485-149c7-1.html) | Full nationality lists checked; Ukraine absent. This is a list-based inference limited to that programme, not a claim that all other entry routes are unavailable. |
| Overseas white-collar resident-visa application and remaining employment exceeding six months; in-country resident-visa issuance starts its own 30-day ARC period | [BOCA white-collar workers](https://www.boca.gov.tw/cp-166-276-48430-2.html) | English official page checked; requirements item 4 and notice item 6. The strict “more than 6 months” condition is preserved. |
| Direct-residence route has entry-mode qualifications and exclusions | [NIA application guide](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | Official guide checked alongside art. 16; the article does not promise conversion for every visitor. |
| Gold Card does not require an existing job offer/employer sponsor but has professional eligibility criteria | [Official Gold Card programme](https://goldcard.nat.gov.tw/en/about/) | Official programme page checked; no salary threshold, tax benefit or permanent-residence promise imported. |

### First-two-paragraph deletion test

Links remain in the article; the table quotes the visible sentence.

| Sentence / draft material | Decision and reason | Meaning preservation |
|---|---|---|
| “Чи можна почати роботу в Тайбеї, поки роботодавець оформлює дозвіл?” | Keep: supplies the pending-permit/start-date trigger. | The opening is a question, not an invented client event. |
| “За загальним правилом статті 43 Закону про служби зайнятості, іноземець не може працювати без дозволу, отриманого за заявою роботодавця, якщо закон не передбачає винятку.” | Keep: gives the governing rule and exception. | Employer application and statutory-exception qualification preserved. |
| “Підписаного договору недостатньо.” | Keep: addresses the specific document a job-offer reader already has. | Does not deny alternative statutory permissions. |
| “До погодження першого робочого дня варто попросити компанію назвати заявника, категорію роботи та документ, який підтверджуватиме право її виконувати.” | Keep: converts the opening into concrete information to request. | A preparation recommendation, not an invented legal filing requirement. |
| “Українцю, який подає документи з іншої країни, слід також зазначити нинішнє місце проживання й країну видачі диплома.” | Keep: separates passport nationality from the application/document context. | Conditional third-country scenario, not a nationality-specific rule. |
| “Це дасть змогу погодити підготовку документів до купівлі квитків.” | Cut: generic benefit repeats the preparation point without identifying a further requirement. | No legal condition, date or source removed. |

### Comparison with the three Ukrainian references

| Reference | Opening / headings / ending observed | Change in 867 |
|---|---|---|
| 008 | Public lawyer attribution and “Нижче йдеться…”; no H2 structure; several warning-style closing commands. | Opens on permission pending on the first workday; four issue headings; closes on the three actual calendar dates, without a byline. |
| 014 | Long definition, then a four-question roadmap; eleven numbered headings including a checklist; general disclaimer and byline. | Explains work categories only where the employer must choose one; unnumbered permit/entry/ARC/family issues; no repeated roadmap or checklist ending. |
| 016 | General bereavement introduction and repeated “distinguish these issues” framing; eleven numbered headings; general-information footer. | No generic migration background. Family discussion identifies eligible people and their applications, while the ending returns to the worker's start date. |

Dropped/unverified: special Ukrainian refugee or humanitarian entitlements; a particular mission's jurisdiction over all applicants in a third country; guaranteed visa issuance; Ukrainian departure rules; automatic work rights for every accompanying spouse; tax-treaty benefits; licence equivalence; a nationality-specific Gold Card salary threshold. These were not established for this article. No invented population, job-demand or firm-experience claim.

## 868 — Ukrainian/Taiwanese marriage documents and residence

File: drafts/uk/868-ukrainian-taiwanese-marriage-documents-residence.md

Final count: 686 words; 5101 characters including spaces; 4416 excluding spaces. Counting convention and checksum appear below.

Reader and trigger: a Ukrainian national and a Taiwan national are deciding where to formalize their marriage, or already have an overseas marriage certificate and need Taiwan registration/residence.

Country fit: Ukraine was removed from the specific-country marriage-interview list from 15 May 2024; the current 24 August 2026 list also excludes Ukraine. This is a concrete change affecting preparation. It does not remove individual-case interviews or document checks. Third-country document preparation is a labelled practical hypothesis, not a claim about the proportion of Ukrainian couples abroad.

Overlap and new angle: 016 addresses inheritance, matrimonial property and children after death; this article addresses formation, authentication and residence before those later family issues arise. Ukrainian, passport-Latin and chosen Chinese name correspondence is a document-preparation issue, not a prescribed Ukrainian legal transliteration rule. The link to 867 is for employment routes before the Taiwan-spouse exemption applies.

### Claim → source record

| Claim used | Official source / provision | Chinese excerpt checked or non-statute evidence |
|---|---|---|
| Ukraine removed from the special-country list on 15 May 2024 | [Huwei Household Registration Office notice](https://huweihousehold.yunlin.gov.tw/News_Content.aspx?n=18286&s=541907) | Notice expressly identifies 自113年5月15日起 and 「烏克蘭」 in the removal passage. The notice's separate Cambodia trial discussion was not applied to Ukraine. |
| Ukraine absent from current list | [BOCA list revised 24 August 2026](https://www.boca.gov.tw/dl-5210-6c88eaff0b5449078bfca7b720878eb0.html) | Read the list marked 115年8月24日修訂; Ukraine is not listed. Absence is identified as a list check, not a quotation asserting an absolute exemption. |
| Individual-case interview remains possible | [BOCA marriage FAQ](https://www.boca.gov.tw/fp-398-696-550e9-1.html) | 因個案需要者…面談. The older page is used only for this separate qualification, not for a current nationality list. |
| Taiwan marriage formalities | [Civil Code 982](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=982) | 結婚應以書面為之，有二人以上證人之簽名，並應由雙方當事人向戶政機關為結婚之登記。 |
| Each party's national law; alternative rules for form | [Choice of Law Act 46](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=46) | 婚姻之成立，依各該當事人之本國法。但結婚之方式依當事人一方之本國法或依舉行地法者，亦為有效。 |
| Foreign spouse's documents, six-month marital-status validity, overseas-marriage alternative and Chinese translation | [MOI Household Registration marriage guidance](https://www.ris.gov.tw/documents/html/2/3/1/383.html) | Checked items 4–5; 原核發機關核發之日起6個月內有效 and 符合行為地法. The body keeps the endorsement condition for omitting the separate marital-status document. |
| Spouse-resident visa documentation, document-age limits and ARC timing after local visa issuance | [Current BOCA spouse-resident guidance](https://www.boca.gov.tw/cp-402-179-2abae-1.html) | Updated 9 June 2026; requirements 4–7 and notice 6 checked. The criminal-record certificate's shorter stated expiry remains controlling. |
| Direct residence for the relevant Taiwan-national spouse case requires the specified visa, sponsor's Taiwan residence and household registration, and NIA approval | [Immigration Act 23 para. 1, subpara. 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23) | 停留期限在六十日以上…未…加註限制不准延期或其他限制…得向移民署申請居留，經許可者…配偶為現在在臺灣地區居住且設有戶籍… |
| Entry-based ARC deadline | [22 para. 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | 應於入國後之翌日起算三十日內…申請外僑居留證 |
| Employment-permit exemption requires both marriage to a Taiwan household-registered national and approved residence | [Employment Service Act 48 para. 1, subpara. 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48) | 外國人與在中華民國境內設有戶籍之國民結婚，且獲准居留者。 |

### First-two-paragraph deletion test

| Sentence / draft material | Decision and reason | Meaning preservation |
|---|---|---|
| “З 15 травня 2024 року Україну вилучено зі спеціального переліку країн для закордонної шлюбної співбесіди.” | Keep: the specific Ukrainian administrative change is the reader's starting fact. | Removal date and limited list-based scope preserved. |
| “Це підтверджує повідомлення органу реєстрації домогосподарств Хувей.” | Cut as a separate sentence; put its official link on the removal claim. | Evidence retained at the claim; no duplicated proof-introduction sentence. |
| “У чинному переліку BOCA України також немає.” | Keep: distinguishes the historical removal notice from the currently checked list. | The list revision date remains in FAQ and Sources; avoids four date numerals in the first two sentences. |
| “Для українсько-тайванської пари це змінює підготовку: старий список не варто брати за підставу для обов’язкової співбесіди лише через українське громадянство.” | Cut: repeats the consequence of removal instead of adding a distinct rule. | No expansion to a blanket interview exemption. |
| “Водночас BOCA прямо передбачає співбесіду за обставинами конкретної заяви.” | Keep as the second paragraph: material qualification to the list fact. | Individual-case discretion preserved. |
| “Перевірка документів залишається.” | Cut: vague echo; the actual documents are explained immediately below. | Document requirements and sources retained in their issue sections. |
| “Підготовку пари визначатимуть письмові вимоги установи, яка розглядає її документи.” | Cut at the final deletion pass: generic preparation advice. | The later questions to the receiving office remain specific to authentication. |

### Comparison with the three Ukrainian references

| Reference | Opening / headings / ending observed | Change in 868 |
|---|---|---|
| 008 | Byline/introduction and warning-based ending; no H2s. | Begins with a dated government change, uses document/residence issues, and ends with the document's validity on the planned filing date. |
| 014 | Definition plus multiple advance questions; numbered conditions and checklist. | Starts with a fact, then a short exception paragraph. Headings follow marriage location, authentication, residence and permission to work without numbering every rule. |
| 016 | Broad family-law overview, long contrast lists and general footer. | The family reader gets a limited formation/residence question. No inheritance roadmap or universal family checklist; no public author footer. |

Dropped/unverified: “Ukrainians must always attend the special-country interview”; “Ukrainians can never be interviewed”; a particular overseas office's universal competence; apostille-only acceptance; automatic acceptance of self-written substitute certificates; Ukrainian marriage validity rules; automatic residence or work rights on the wedding date. No promise of Ukrainian-language consultation.

## 869 — Ukrainian oil exporter and unpaid Taiwan invoice

File: drafts/uk/869-ukrainian-oil-exporter-taiwan-unpaid-invoice.md

Final count: 720 words; 5373 characters including spaces; 4654 excluding spaces. Counting convention and checksum appear below.

Reader and trigger: a Ukrainian seller has shipped a food-oil consignment to a Taiwan buyer; an advance has been paid and the buyer withholds the balance while raising a quality issue. This is explicitly an invented example in its first sentence.

Country fit: Taiwan's official Ukraine trade profile dated 22 April 2026 includes HS 1512, the sunflower/safflower/cottonseed oil group, among Taiwan's main import categories from Ukraine for 2024. This supports selecting a food-oil shipment example. It does not establish separate import quantities for each oil, any named transaction, or the frequency of nonpayment. The quality dispute, advance and correspondence are hypothetical. No shipping route is asserted to be a dominant Ukrainian trade route.

Overlap and new angle: 008/014 concern employee-employer money disputes, not a seller's trade receivable; 016's foreign-element discussion concerns family law. The new issue is batch identity and a contested withholding amount, followed by choice of law before assuming Taiwan's two-year rule. The structural sources' broader fees, interest, negotiable instruments and enforcement machinery were omitted. A short internal link to 867 is expressly limited to a supplier's employee who plans to relocate for work; the trade claim itself is not described as requiring relocation.

### Claim → source record

| Claim used | Official source / provision | Chinese excerpt checked |
|---|---|---|
| Actual oil-product trade connection | [International Trade Administration, Ukraine trade profile, section III, pp. 6–7](https://www.trade.gov.tw/Files/PageFile/719437/719437cnl5q20260422141019.pdf) | 主要進口項目（4位碼）…葵花子、紅花子或棉子油(1512)…(2024). Treated as one product group. |
| Chosen law, closest connection if no valid express choice, characteristic-performance presumption at the transaction time | [Choice of Law Act 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) | 依當事人意思定其應適用之法律…依關係最切之法律…當事人行為時之住所地法，推定為關係最切之法律 |
| Limitation follows the law governing the underlying relationship | [36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=36) | 請求權之消滅時效，依該請求權所由發生之法律關係所應適用之法律。 |
| Two years for the specified price claim only if Taiwan substantive law applies | [Civil Code 127 subpara. 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=127) | 因二年間不行使而消滅…八、商人、製造人、手工業人所供給之商品及產物之代價 |
| Accrual from exercisability | [128](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=128) | 消滅時效，自請求權可行使時起算。 |
| Demand, acknowledgment, suit; payment-order/mediation application among suit-equivalent actions | [129](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=129) | 一、請求。二、承認。三、起訴。…與起訴有同一效力…聲請發支付命令…聲請調解或提付仲裁 |
| Six-month condition on interruption by demand | [130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130) | 若於請求後六個月內不起訴，視為不中斷。 |
| Lapse of payment order defeats the application-based interruption | [132](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=132) | 若撤回聲請，或受駁回之裁判，或支付命令失其效力時，視為不中斷。 |
| Payment order available for a defined monetary amount | [Civil Procedure Code 508](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=508) | 給付金錢或其他代替物或有價證券之一定數量…得聲請…支付命令 |
| No payment-order route where reciprocal performance is outstanding, overseas service is required, or service must be by publication | [509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509) | 應為對待給付尚未履行，或…送達應於外國為之，或依公示送達為之者，不得行之。 |
| Application facts, amount, performed reciprocal obligation and prima-facie showing | [511](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=511) | 請求之標的及其數量…請求之原因事實。其有對待給付者，已履行之情形。…債權人之請求，應釋明之。 |
| Three months from issuance to service; special relief for wrongly issued finality certificate, including five-year condition and twenty-day suit period | [515 paras. 1–2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=515) | 發支付命令後，三個月內不能送達…失其效力。…自確定證明書所載確定日期起五年內…通知送達後二十日之不變期間起訴…其於通知送達前起訴者，亦同。 |
| Twenty days after service to object without reasons | [516 para. 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=516) | 得於送達後二十日之不變期間內，不附理由…提出異議 |
| Valid timely objection lapses the challenged part; application deemed suit/mediation | [519](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=519) | 於法定期間合法提出異議…於異議範圍內失其效力…視為起訴或聲請調解 |
| Unopposed order may support enforcement; later declaratory suit and discretionary secured stay remain possible | [521](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=521) | 得為執行名義…主張…債權不存在…依債務人聲請，得許其提供相當並確實之擔保，停止強制執行 |
| Monetary claim may be secured by provisional attachment | [522](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=522) | 金錢請求或得易為金錢請求…欲保全強制執行者，得聲請假扣押 |
| Risk of impossible or very difficult later enforcement | [523](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523) | 非有日後不能強制執行或甚難執行之虞者，不得為之。 |
| Claim and attachment grounds need prima-facie support; court may order security | [526 paras. 1–3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526) | 請求及假扣押之原因，應釋明之…法院得定相當之擔保…雖經釋明，法院亦得命債權人供擔保 |

### First-two-paragraph deletion test

| Sentence / draft material | Decision and reason | Meaning preservation |
|---|---|---|
| “Покупець на Тайвані прийняв партію української соняшникової олії, сплатив аванс і затримує решту, посилаючись на її якість — це вигаданий приклад.” | Keep: identifies goods, partial payment, quality dispute and the Taiwan counterparty. Removed the repeated phrase “однієї партії” in favour of “її”. | Hypothetical label stays in the same sentence; no real client or dispute is asserted. |
| “Для вимоги про оплату потрібно пов’язати конкретний рахунок із поставкою та з’ясувати, яку частину боргу покупець визнає.” | Keep: identifies the evidence/amount decision before choosing procedure. | No suggestion that a seller's spreadsheet is conclusive proof. |
| “Суми можуть різнитися.” | Cut: nonspecific and redundant. | No amount or legal condition lost. |
| “Вибір товару має фактичну основу…” | Replace with the actual trade-profile statement. | Removes author commentary while retaining the government link and dates. |
| “У профілі України тайванської Адміністрації міжнародної торгівлі від 22 квітня 2026 року групу «соняшникова, сафлорова або бавовняна олія» зазначено серед основних товарних позицій імпорту з України за 2024 рік.” | Keep: supplies verified country relevance; explicitly one product group. | Does not turn aggregate trade data into proof of separate oil types, individual cases or nonpayment rates. |
| “Звідси не випливає поширеність неплатежів.” | Cut from public text: rebuts an assertion the reader was not asked to make; the research limitation is recorded here. | The article never asserts any frequency of nonpayment. |
| “Для окремого постачальника вирішальними залишаються його договір і документи конкретної партії.” | Cut: repeats the preceding invoice/shipment evidence point. | Detailed evidence discussion remains under the next heading. |

### Comparison with the three Ukrainian references

| Reference | Opening / headings / ending observed | Change in 869 |
|---|---|---|
| 008 | Personal lawyer framing and generalized employee warnings; no H2s. | One explicitly fictional goods transaction; article-specific debt questions; closes on an invoice, due-date proof and the buyer's response. |
| 014 | Long definition, multiple advance questions and numbered checklist. | Starts with a concrete transaction; only the limitation heading is a question; uses party identity, disputed batch and service address as decisions rather than a standard checklist. |
| 016 | Abstract family-law distinctions, eleven numbered headings, broad disclaimer/byline. | Choice of law is tied to this receivable; no general cross-border-law introduction and no summary conclusion. |

Dropped/unverified: frequency of Ukraine–Taiwan payment disputes; an actual unpaid sunflower-oil case; every Ukrainian exporter being subject to Taiwan's two-year rule; recognition of Ukrainian judgments in Taiwan; any fixed success rate, recovery time or attachment-security percentage; unverified filing fees or interest calculations; mandatory laboratory/quality documents for every oil shipment; a claim that an email promising an internal invoice check necessarily acknowledges the debt.

## Editorial revision record

These are author self-review findings, not independent lawyer or native-speaker review.

| Issue / original | Reason | Revision | Meaning preserved |
|---|---|---|---|
| 867: “Для фахівця, якому вже дозволено проживання…” | Too broad for art. 16 para. 2; ordinary professionals have a professional-work condition. | Expressly distinguish a foreign professional doing professional work and a foreign special professional, with approved residence/permanent residence. | Sponsor conditions, family categories, entry condition and application discretion retained. |
| 867: “Це можливість подати заяву, а не обіцянка її схвалення.” | Avoidable contrast formula. | “Схвалення залежить від відповідності цим критеріям.” | Eligibility assessment and lack of a guarantee retained. |
| MONOTONY: 868 paragraph openings — repeated “Для…” | Same preposition introduced five paragraphs in the first draft. | Start with the foreign partner, documents, third-country question, application and exemption where each is the actor/issue. | No requirements removed. Final maximum identical paragraph opener: one. |
| MONOTONY: 868 sentence length — “Документ про сімейний стан діє шість місяців від видачі первинним органом.” | Many middle-length sentences; initial Ukrainian-adapted CV 0.438. | Separate the duration, its issuing-authority start date and the unchanged effect of translation. | Six months and original issue date both retained; final CV is recorded below. |
| 868: “мовну домовленість узгоджують до консультації” | Tautological phrasing. | “мову консультації погоджують заздалегідь” | Same four consultation languages; no Ukrainian-language promise. |
| 869: list of three oils joined with “та” | Could suggest three separately confirmed import streams. | Present the official sunflower/safflower/or cottonseed oil product group. | Official grouped category and 2024 reference year preserved. |
| 869: “Сам скриншот відповіді не покаже…” | Unwarranted absolute: a screenshot might contain an invoice reference. | Ask to retain attachments and make the invoice-response relationship identifiable. | Evidence-preparation purpose preserved without an unsupported universal claim. |
| MONOTONY: 869 sentence length — opposition period and absence of reasons in one sentence | Repeated middle-length legal sentences; initial adapted CV 0.409. | Separate the 20-day deadline from “Пояснювати причини не потрібно.” | Deadline, service trigger, no-reasons condition and art. 516 link retained. |
| 869: lapse/interruption discussion without art. 515 para. 2 | The general rule alone omitted relevant relief where the court issued a wrong finality certificate. | Add the five-year condition, notification, 20-day suit period and filing-before-notice alternative. | No promise that every lapsed order receives this relief. |
| 869: quoted “перевіряємо рахунки” and “Переписка потребує оцінки.” | Unnecessary invented dialogue plus a generic repeat. | “Обіцянка перевірити рахунки потребує окремої оцінки.” | No automatic acknowledgment inference; no invented actual communication. |

## Section 5 self-check

1. The required shared command was run on all three files. Its installed implementation supports only ko/ja/en/zh-hant and guesses uk as ko. It therefore produced artificial short-sentence failures for all files and a length-variation failure for 869. This is not reported as a successful stock-tool run. The source also fails to recognize the Ukrainian Sources heading. An in-memory Ukrainian tokenizer/heading adapter, using the script's unchanged HARD thresholds, yields zero failures for all three. The exact adapter and results follow.
2. Opening types are different: 867 reader question; 868 dated administrative fact; 869 explicitly fictional transaction scene. The scene is one of three, within the batch rule. None begins with a stock “Suppose/Imagine…” equivalent.
3. The adapted counts identify 16, 12 and 10 sentences of eight words or fewer. There is no paragraph with two sentences of 32 words or more and no consecutive long-sentence pair.
4. Paragraph-opener maxima are two, one and two; consecutive identical first-word sentence starts are zero.
5. Each article has non-citation preparation paragraphs. Sources occur at sentence beginnings and within claims, without three repeated “claim/citation/caveat” paragraphs.
6. There is one deliberate document/permission contrast in 867 and one illustrative/mandatory evidence-list contrast in 869. The automated flag in 868 is its shorter-expiry exception, not a rhetorical contrast; that legal qualification is retained. All counts are below the limit of three. The unsupported-frequency rebuttal was removed.
7. The final prose paragraphs concern start-date coordination, document validity on filing, and the oldest unpaid invoice respectively. Contact information appears before the closing fact; no sales ending or summary.
8. Ukrainian register was reviewed by the author model only. Korean/Japanese register tests do not apply. No bold, H1, public byline, invented first-person experience, or imperative checklist heading remains in the articles.
9. Revision comparison retained all final statute links, permission/obligation distinctions, nationality scope, date triggers and the hypothetical label. FAQ conditions match their respective bodies.

## Validation scope and remaining limitations

The custom read-only validation checked exact frontmatter field order, assigned numbers, unique country-cued slugs across the snapshot and batch, category/date/read-time pattern, title/SEO/summary limits, 3–5 tags, three FAQ entries, internal links, body/source URL parity, four issue headings plus Sources, allowed image-menu paths and distinct image selections. Public-body word counts fall within 650–950.

The snapshot has no repo/public directory and no repo/node_modules/gray-matter. tools/gate.mjs therefore was not represented as having passed; it also attempts shared-cache writes for missing laws. The equivalent relevant metadata/link checks were run in memory with installed PyYAML. No dependency was installed.

Image limitation: I04, I24 and I01 were retained exactly as prescribed by IMAGE-MENU.md, with translated descriptions and the required illustrative caption. All three https://tseng-law.com image URLs returned HTTP 404 to HEAD; I01 also returned 404 to GET. Actual published asset availability is unresolved. The brief-authorized paths were not substituted with invented images, and no publication claim is made.

Legal review is source-based author verification, not a representation of lawyer review. Ukrainian prose has not received independent native-speaker review. Unrelated older Bridge instructions did not expand this batch's file-write scope.

## Final counts and checksums

Counts describe visible main text, including issue headings and contact prose but excluding YAML, FAQ metadata and the Sources section. Markdown link destinations and heading markers are removed; whitespace is normalized to one space. Characters are Unicode code points, including those normalized spaces. The alternate totals include Sources for comparison with less selective counters.

| Article | Main-text words | Characters with spaces | Characters without spaces | Words including Sources | Characters including Sources | Title / SEO / summary characters |
|---|---:|---:|---:|---:|---:|---|
| 867 | 716 | 5273 | 4558 | 767 | 5614 | 51 / 45 / 149 |
| 868 | 686 | 5101 | 4416 | 743 | 5536 | 60 / 46 / 155 |
| 869 | 720 | 5373 | 4654 | 769 | 5716 | 50 / 43 / 167 |

| Article | SHA-256 of final Markdown |
|---|---|
| 867 | `74f6c03570e036376834b46486882d12e1525a55eb9dc9adde07dbf2549e8a73` |
| 868 | `1165661aa6663f0aba7725678f09e55f961e1acbc9d0e429c6d12bed6aa75ced` |
| 869 | `a5b3c61d30e64b691e4e4b23abdb7cd451dc85d0621c958f745d4025a2f31a46` |

## Ukrainian-adapted variety results

These are results of the documented in-memory adapter, not a claim that the installed checker natively supports uk. The original executable's language-detection failure remains a tool limitation. Lengths use Unicode words with internal apostrophes/hyphens retained, the eight-word short threshold and the 32-word long threshold. HARD limits are unchanged.

| Article | Sentences / paragraphs | Length CV ≥ .45 | Short share ≥ .08 | Similar-length triples ≤ .30 | Max identical paragraph opener ≤ 2 | Consecutive same starts ≤ 2 | Citation-ending share ≤ .45 | Contrast flags ≤ 3 | Structural / adapted metric FAIL |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| 867 | 50 / 14 | 0.519 | 0.32 | 0.062 | 2 | 0 | 0 | 1 | 0 / 0 |
| 868 | 47 / 15 | 0.497 | 0.255 | 0.089 | 1 | 0 | 0 | 1 | 0 / 0 |
| 869 | 50 / 15 | 0.459 | 0.2 | 0.021 | 2 | 0 | 0 | 1 | 0 / 0 |

The original required command was executed as follows (exit 1 because uk was guessed as ko; this is not a pass):

~~~sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check drafts/uk/867-ukrainian-professional-taiwan-work-permit-residence.md drafts/uk/868-ukrainian-taiwanese-marriage-documents-residence.md drafts/uk/869-ukrainian-oil-exporter-taiwan-unpaid-invoice.md
~~~

The reproduction below is read-only. Run from the batch root using Python with PYTHONDONTWRITEBYTECODE=1. It imports the installed checker's functions in memory, applies Ukrainian tokenization/source-heading recognition, preserves the HARD thresholds and separately checks the exact batch metadata and link requirements. Source-law verification is the separate tools/law.py run recorded above; the validator does not pretend to supply it.

~~~python
import pathlib,re,runpy,statistics,collections,json,yaml,hashlib
root=pathlib.Path.cwd()
expected=['title','seoTitle','summary','published','lastmod','date_display','read_time','categories','topic','tags','featured_image','featured_image_alt','featured_image_caption','faq','audience','author']
ukfiles=sorted((root/'drafts/uk').glob('*.md'))
assert [p.name[:3] for p in ukfiles]==['867','868','869']
validation_failures=[]
all_existing=[p.name[4:-3] for p in (root/'repo/src/content').glob('columns*/*.md')]
batch=collections.Counter(p.name[4:-3] for p in (root/'drafts').glob('*/*.md'))
local={p.name[4:-3] for p in (root/'repo/src/content/columns-uk').glob('*.md')}|{p.name[4:-3] for p in ukfiles}
v=runpy.run_path('/Users/son7/tseng-lanes-shared/variety/variety_metrics.py')
g=v['metrics'].__globals__
word_rx=re.compile(r"[^\W_]+(?:[’'ʼ-][^\W_]+)*",re.UNICODE)
def words(s): return word_rx.findall(s)
def sentences(p,lang):
    return [x.strip() for x in re.split(r'(?<=[.!?])\s+(?=[А-ЯІЇЄҐA-Z0-9«“])',g['unlink'](p)) if x.strip()]
g['SRC_HEAD']=re.compile(r'^#{2,3}\s*Джерела\b')
g['sentences']=sentences
g['slen']=lambda s,lang:len(words(s))
g['opener']=lambda p,lang:(words(g['unlink'](p)) or [''])[0].casefold()
g['ending']=lambda s,lang:(words(s) or [''])[-1].casefold()
g['CONTRAST']['en']=[r'\bне\b[^.!?]{0,100},\s*а\b',r'\bзамість\b',r'\bна відміну від\b',r'\b(?:а|але)\s+не\b']
g['CAVEAT']['en']=r'^(Водночас|Проте|Однак|Але|Утім|Втім)\b'
g['HYPO']['en']=r'^(Припустімо|Уявімо|Наприклад)\b|вигадан(?:ий|а)\s+(?:приклад|сцена)'
g['FORMULA_CLOSE']['en']=r'загальн(?:а|ою) інформаці|не є юридичною консультацією|зверніться до'
for p in ukfiles:
 raw=p.read_text(); fmraw,body=raw.split('---',2)[1:]; fm=yaml.safe_load(fmraw)
 main,sources=body.split('## Джерела',1)
 plain=' '.join(re.sub(r'^## +','',g['unlink'](main),flags=re.M).split())
 whole=' '.join(re.sub(r'^(?:## |\- )','',g['unlink'](body),flags=re.M).split())
 fail=[]
 def need(condition,message):
  if not condition:fail.append(message)
 need(list(fm)==expected,'field order')
 need(len(fm['title'])<=70,'title length')
 need(30<=len(fm['seoTitle'])<=60,'SEO length')
 need(110<=len(fm['summary'])<=170,'summary length')
 need(fm['published']==fm['lastmod']=='2026-10-24','dates')
 need(fm['audience']==['uk'] and fm['author']=='legal-ai-assistant','provenance')
 need(fm['categories']==['Правова інформація про Тайвань'],'category')
 need(fm['date_display']=='24 жовтня 2026' and fm['read_time']=='5 хв читання','display')
 need(3<=len(fm['tags'])<=5 and len(fm['faq'])==3,'tags/FAQ')
 need(fm['topic'] in ('visa','family','litigation'),'topic')
 need(fm['featured_image'] in (root/'briefs/IMAGE-MENU.md').read_text(),'image menu match')
 need(650<=len(plain.split())<=950,'word range')
 need(len(re.findall(r'^## ',body,re.M)) in (3,4,5),'heading count')
 need(not re.search(r'\*\*|__|<strong>|<b>|^# ',raw,re.M),'bold/H1')
 need('wei@hoveringlaw.com.tw' in main and '](/uk/contact)' in main,'contact')
 need('Перевірено 24 жовтня 2026 року.' in sources,'checked date')
 slug=p.name[4:-3]
 need(4<=len(slug.split('-'))<=9 and 'ukrainian' in slug,'slug shape/cue')
 need(slug not in all_existing and batch[slug]==1,'slug uniqueness')
 links=re.findall(r'\]\(([^)]+)\)',main)
 need(any('/uk/columns/' in u for u in links),'internal column link')
 for u in links:
  if u.startswith('/uk/columns/'):need(u.rsplit('/',1)[-1] in local,'internal '+u)
 body_official={u for u in links if u.startswith('https://')}
 source_official=set(re.findall(r'\]\((https://[^)]+)\)',sources))
 need(body_official==source_official,'source URL parity')
 m=g['metrics'](raw,'en')
 paras,heads,items=g['body_blocks'](body)
 S=[s for par in paras for s in sentences(par,'en')]
 starts=[(words(s) or [''])[0].casefold() for s in S]
 m['consec_same_start']=sum(bool(a) and a==b for a,b in zip(starts,starts[1:]))
 hardfail=[]
 for k,(op,limit,why) in g['HARD'].items():
  if limit=='dyn':limit=max(2,m['paras']//8)
  if not(m[k]>=limit if op=='>=' else m[k]<=limit):hardfail.append(f'{k}={m[k]} {op} {limit}')
 long_paras=[{'paragraph':i+1,'lengths':[len(words(s)) for s in sentences(par,'en')]} for i,par in enumerate(paras) if sum(len(words(s))>=32 for s in sentences(par,'en'))>1]
 consecutive_long=[i+1 for i,(a,b) in enumerate(zip(S,S[1:])) if len(words(a))>=32 and len(words(b))>=32]
 validation_failures.extend(fail+hardfail+long_paras+consecutive_long)
 print(json.dumps({'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'words':len(plain.split()),'characters_with_spaces':len(plain),'characters_without_spaces':len(re.sub(r'\s','',plain)),'body_with_sources_words':len(whole.split()),'body_with_sources_characters':len(whole),'title_chars':len(fm['title']),'seo_chars':len(fm['seoTitle']),'summary_chars':len(fm['summary']),'structural_fail':fail,'metric_method':'in-memory Ukrainian adapter, word limits 8/32, unchanged HARD thresholds','metrics':{k:m[k] for k in ['sentences','paras','len_cv','short_share','even_run3','top_opener','top_opener_n','consec_same_start','cite_end_share','contrast','caveat','questions']},'metric_fail':hardfail,'multiple_long_in_paragraph':long_paras,'consecutive_long':consecutive_long,'openers':[g['opener'](par,'en') for par in paras]},ensure_ascii=False))

assert not validation_failures,validation_failures
~~~



