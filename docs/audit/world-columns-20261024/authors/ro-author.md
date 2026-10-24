# Romanian author note — 882–884

Date: 24 October 2026. Locale: ro. Status: three local drafts complete; independent AI Romanian editorial and final legal reviews PASS at the hashes recorded below. The official variety checker does not support Romanian; manual section-5 review is documented. No publication or repository integration performed. All manuscript and note writes are restricted to `drafts/ro/` and this file. No git commands, package installations, or changes to other locales were made.

## Assignment, reading and evidence method

The Romanian row assigns 882 B-INV, 883 P-WORK and 884 L-TRAFFIC. All recommended topics were retained.

Read `briefs/BRIEF.md` and `briefs/ASSIGNMENTS.md` in full, the repository `EDITORIAL-VOICE.md` and `FRONTMATTER.md`, `rules/SENTENCE-VARIETY-RULE.md`, `rules/LESSONS.md`, `briefs/IMAGE-MENU.md`, and the country-facts ledger. Repeated ledger cells were also read in a deduplicated representation preserving country-to-value/evidence mappings. Only verified Romanian facts are used. Read the external `COLUMN-VOICE-RULE.md`; its linked `~/agent-library/knowledge/editorial-voice.md` was absent. The complete repository editorial voice supplied by the brief is the operative text. The external shared variety and lessons files are byte-identical to the batch copies (SHA256 respectively `8e920e820529bb049ac27e67b6233ae369badcc901291909867665e39bb1d616` and `d443749b58541df4dad3a934ef7ccf018f95b289f743bd6191bc16ef66b15b9a`). Historical Fable instructions were not applied.

The three full Romanian comparison texts are `008-taiwan-labor-severance-law.md`, `009-taiwan-voluntary-resignation-severance.md` and `012-taiwan-overtaking-accident-liability.md` under `repo/src/content/columns-ro/`. Their `date_display` is 13 September 2025; their `lastmod` dates are respectively 7 October 2026, 10 September 2026 and 10 September 2026. These are supplied snapshot comparators, not a claim to have audited the complete live Romanian corpus.

All structural sources specified for the selected topics were read in full:

- B-INV: English 354, French 674, Spanish 689, Hindi 669 and Thai 663.
- P-WORK: English 705, 704, 706 and 352.
- L-TRAFFIC: English 003 and 611, Thai 662.

The author used `tseng-law-editorial` and its independent review criteria. A separate AI research agent supplied bounded official Romanian market/entry evidence without writing files. Completed independent Romanian language and final legal reviews are recorded below; neither is represented as human native-speaker or attorney review.

Each statute below was fetched through `python3 tools/law.py PCODE ARTICLE...` before use. The shared caches already existed and exceeded 5,000 bytes, so law.py did not download or modify them. A separate in-memory curl retrieval of each official MOJ LawAll page compared the normalized text of every requested article with the cached text: all matched. No downloaded file was written. Codes checked live were B0000007, B0000001, B0010001, A0030295, N0090001, N0090031, D0080132, C0000001, C0010001, G0390060 and K0040012. The tables below identify the provisions actually used; exploratory checks also covered provisions subsequently omitted.

Law-version checks:

- Civil Code banner concerns article 166-1 (commencement unspecified) and article 1223 (promulgated 17 August 2026, commencement six months later). Neither is used. Cited limitation, tort and settlement provisions match current live text.
- Road Traffic Management and Penalty Act banner lists future amendments to 18-1(6), 35(6)/(13), 92-2 and 21/21-1/35/67/73/85-2/85-3. Article 62 is not among them.
- A0030295 commencement checked against the [Executive Yuan order dated 18 November 2025](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg031217/ch01/type1/gov01/num1/Eg.htm) and [MOJ history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295): 「第四條第四款第四目後段、第二十八條及第二十九條，定自一百十五年六月三十日施行；其餘條文，定自一百十五年一月一日施行。」 All cited portions are effective by 24 October 2026. Web-open failed on the history/order, but the research agent fetched the live HTML with curl in memory.

No Romanian law, Romanian judgment recognition, licence reciprocity, legal-service demand statistics or firm experience is asserted. Consultation languages and contact restrictions come from the current brief. The final reviewer also fetched the live Romanian contact page with in-memory curl and confirmed the email and English/Chinese/Japanese/Korean consultation languages; the web-open tool itself could not render that page.

## 882 — Romanian panel exporter, disputed payment

File: `drafts/ro/882-romanian-exporter-taiwan-unpaid-panel-invoices.md`.

Reader and trigger: a Romanian seller has delivered wood particleboard to a Taiwanese buyer, which withholds payment citing packaging damage without identifying the affected boards. The opening labels the transaction hypothetical in the same sentence. The practical decision is how to assemble the claim, check prescription and choose a payment order or an asset-preservation application.

Country fit: the [Taiwan Trade Administration Romania profile](https://www.trade.gov.tw/Files/PageFile/725620/7256204t31i20251106175507.pdf), updated 6 November 2025, page 5, lists 「羅國對台出口項目 電咖啡壺、木製粒片板、輪胎、鐵或非合金鋼圓、自動儀器、夾克」. The product choice has official support. Payment disputes involving these shipments and reader demand for this article remain editorial hypotheses, not measured findings. The profile's older macroeconomic and foreign-tax material was not used.

Overlap and new angle: the shared Romanian corpus has company-entry and logistics articles but no equivalent exporter collection article among the 18 supplied titles. The new article follows one physical lot through packaging evidence, invoice reconciliation and a claim against the actual buyer. Its internal link leads to the new Romanian professional-work article only for the separate issue of hiring a Romanian representative locally; it does not claim that every short-term contract-performance visitor follows that route.

### Claim → source ledger

Chinese excerpts below were read in law.py output and matched against the live official text.

| Claim in article | Statute and exact URL | Chinese passage checked |
|---|---|---|
| Valid choice of contract law; absent a valid express choice, closest connection | 涉外民事法律適用法 [20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) | 「依當事人意思定其應適用之法律」「當事人無明示之意思或其明示之意思依所定應適用之法律無效時，依關係最切之法律。」 |
| Prescription follows the law governing the underlying legal relationship | Same Act [36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=36) | 「請求權之消滅時效，依該請求權所由發生之法律關係所應適用之法律。」 |
| Two-year period for merchant/manufacturer goods-price claims if Taiwan law applies | 民法 [127(8)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=127) | 「因二年間不行使而消滅」「八、商人、製造人、手工業人所供給之商品及產物之代價。」 |
| Period begins when claim can be exercised | 民法 [128](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=128) | 「消滅時效，自請求權可行使時起算。」 |
| Demand, acknowledgment and lawsuit; payment-order application has lawsuit-equivalent effect | 民法 [129](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=129) | 「一、請求。二、承認。三、起訴。」「與起訴有同一效力：一、依督促程序，聲請發支付命令。」 |
| Demand interruption deemed not to occur without suit within six months | 民法 [130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130) | 「若於請求後六個月內不起訴，視為不中斷。」 |
| Payment order available for a fixed monetary claim | 民事訴訟法 [508](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=508) | 「以給付金錢或其他代替物或有價證券之一定數量為標的者，得聲請法院依督促程序發支付命令。」 |
| Counterperformance, foreign service and public service exclusions | 民事訴訟法 [509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509) | 「聲請人應為對待給付尚未履行，或支付命令之送達應於外國為之，或依公示送達為之者，不得行之。」 |
| Facts, own performance where due, preliminary substantiation | 民事訴訟法 [511](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=511) | 「其有對待給付者，已履行之情形」「債權人之請求，應釋明之。」 |
| Twenty days after service, objection without reasons | 民事訴訟法 [516](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=516) | 「於送達後二十日之不變期間內，不附理由……提出異議。」 |
| Timely lawful objection ends order within challenged extent; application becomes suit/mediation | 民事訴訟法 [519](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=519) | 「於異議範圍內失其效力……視為起訴或聲請調解。」 |
| No timely lawful objection: enforceable title; declaratory challenge still possible | 民事訴訟法 [521](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=521) | 「未於法定期間合法提出異議者，支付命令得為執行名義」「主張支付命令上所載債權不存在而提起確認之訴」 |
| Provisional attachment needs future enforcement risk | 民事訴訟法 [523](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523) | 「非有日後不能強制執行或甚難執行之虞者，不得為之。」 |
| Preliminary showing of claim and attachment grounds; court may require security | 民事訴訟法 [526](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526) | 「請求及假扣押之原因，應釋明之。」「法院亦得命債權人供擔保後為假扣押。」 |
| Particleboard is among Romania-to-Taiwan exports | [Trade Administration profile, p. 5](https://www.trade.gov.tw/Files/PageFile/725620/7256204t31i20251106175507.pdf) | 「羅國對台出口項目」「木製粒片板」; profile date retained as 2025, not presented as a 2026 statistical release. |

### Opening deletion test

1. Keep the first sentence: identifies the Taiwanese importer, actual traded product and hypothetical nature of the dispute.
2. Keep the second: receipt exists, but damage allegations lack a lot/board match; this changes the evidence task.
3. Keep the third: separates three items that the hypothetical buyer has conflated, giving the reader a usable file structure.
4. Keep paragraph two's first sentence: supplies official evidence for the Romanian product choice, with the source's actual date.
5. Keep its second sentence: explains which product-specific records connect the complaint to the invoice.
6. Keep “Păstrați și mesajele nefavorabile.”: adds preservation of adverse correspondence, not a second statement of the claim.

Removed during self-editing: “Cine a comandat?” in the next section was redundant with the entity-identification paragraph. No generic scene-setting or “this article explains” sentence was retained.

Comparison with the three Romanian texts: unlike 008's author introduction, 009's reference to a prior article and 012's generic risk-of-overtaking opening, this starts with a labelled trade dispute. Unlike 008's extended table/anecdote, 009's enumerated exceptions and 012's rule/case/checklist sequence, headings follow lot, applicable law, service and assets. The ending asks the seller to align the invoice, receipt and relevant packaging image; it does not copy their broad rights admonition or boilerplate related-links footer.

Dropped or deliberately avoided: automatic Taiwan-law applicability; automatic acknowledgment from any reply; fixed collection success/timing; unsourced statutory court fees; a universal EU enforcement shortcut; Romanian limitation rules; claim that every buyer with overdue debt qualifies for attachment.

## 883 — Romanian professional, work authorization and family move

File: `drafts/ro/883-romanian-professional-taiwan-work-permit-residence.md`.

Reader and trigger: a Romanian professional has accepted or is considering a Taiwan job and is planning travel, potentially with family. The decision is which authority/permit covers the actual role, whether the individual qualifies for Gold Card, and how residence applications fit the entry arrangement.

Country fit: verified Romania eligibility for a stay of up to 90 days is a concrete entry issue. BOCA was reopened live. The article assumes a Romanian ordinary passport, not merely Romanian residence or Romanian language. The hypothesis is that an apparently straightforward short visit can obscure work and family application requirements; no size of the Romanian professional population is claimed.

Overlap and new angle: Romanian 008/009 discuss ending employment; 014 discusses minimum-service commitments. None of those resolves initial Romanian entry, job authorization, Gold Card and dependent-family status together. The internal 009 link is limited to employment-ending context and does not import its Korean comparison into the new text.

### Claim → source ledger

| Claim in article | Statute / official URL | Chinese passage or original official wording checked |
|---|---|---|
| Work generally needs employer-requested permission; statutory exceptions retained | 就業服務法 [43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | 「除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。」 |
| Romania is eligible for up to 90 days; six-month ordinary-passport validity, onward/return documents, immigration inspection, day-after-arrival start | [BOCA visa exemption](https://www.boca.gov.tw/fp-149-4486-7785a-1.html) | English page lists Romania under “up to 90 days”; “at least six months as of the date of entry”; confirmed return/onward travel; immigration ineligibility exception; day-after-arrival start. Matching ledger Chinese: 「90天免簽證適用國家」「羅馬尼亞(Romania)」. |
| Professional definitions and category limits | 外國專業人才延攬及僱用法 [4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=4) | 「外國專業人才：指得在我國從事專業工作之外國人。」「外國特定專業人才……特殊專長」「專業工作：指下列工作」 |
| Employer generally applies to MOL; specified teaching work to MOE | Same Act [5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | 「除本法另有規定外……向勞動部申請許可」「但……向教育部申請許可」 |
| Specialized/technical qualification routes, without claiming every applicant needs the same route | 外國人從事就業服務法第四十六條第一項第一款至第六款工作資格及審查標準 [5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090031&flno=5) | 「除符合本標準其他規定外，仍應符合下列資格之一」; degree, professional qualification, multinational assignment and experience alternatives read in full. |
| Remuneration floor refers to the authority's announced amount | Same Standards [8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090031&flno=8) | 「其薪資或所得報酬不得低於中央主管機關公告之數額。」 |
| Gold Card personal application, integrated documents and initial one-to-three-year term | Foreign Professionals Act [9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | 「得逕向內政部移民署申請核發具工作許可、居留簽證、外僑居留證及重入國許可四證合一之就業金卡」「有效期間為一年至三年」 |
| Gold Card requires eligibility but no sponsor or pre-secured job | [Official Gold Card description](https://goldcard.nat.gov.tw/en/about/) | “Applicants can apply online without sponsorship”; qualification is assessed by professional skills and no previously secured job is required. No processing guarantee or fee figure used. |
| Qualifying authorized/exempt professional may apply after visa-free/visitor entry; ARC depends on approval | Foreign Professionals Act [16(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | 「經許可或免經許可在我國從事專業工作者，得逕向內政部移民署申請居留；經許可者，發給外僑居留證。」 |
| Family route covers an ordinary foreign professional actually engaging in professional work in Taiwan or a foreign special professional, with approved residence/permanent residence; specified spouse/minor/adult-disabled children entering visa-free or as visitors may apply directly | Same Act [16(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | 「外國專業人才在我國從事專業工作及外國特定專業人才，經內政部移民署許可居留或永久居留者，其配偶、未成年子女及因身心障礙無法自理生活之成年子女，以免簽證或持停留簽證入國者，得逕向內政部移民署申請居留」 |
| Specified dependent spouses may apply directly for work permission; term bounded by family residence | Same Act [15(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15) | 「外國特定專業人才及外國高級專業人才之配偶……許可在我國依親居留者，得逕向勞動部申請許可」「不得逾其依親居留期間」 |
| Resident-entry ARC filing: thirty days from day after arrival; integrated-document exception | 入出國及移民法 [22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | 「取得居留許可者，應於入國後之翌日起算三十日內」「其他已含有外僑居留證功能之證件者，得免申請」 |
| Route-specific application evidence and authentication/translation checks | [NIA guide updated 14 April 2026](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | Required-documents section includes application form, photo, passport and purpose evidence. No claim that every category needs the same health/police certificate or that a Romanian apostille alone suffices. |
| Current applicability of cited professional provisions | [Executive Yuan commencement order](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg031217/ch01/type1/gov01/num1/Eg.htm) | Commencement excerpt reproduced under general evidence method above; no pending provision presented as effective prematurely. |

### Opening deletion test

1. Keep the reader's work-start question: fixes the nationality/passport and visa-exempt entry situation.
2. Keep the short answer: entry permission does not provide work authorization.
3. Keep the following statutory sentence: states the ordinary employer-application rule and preserves exceptions, rather than treating the short answer as universal permit sponsorship.
4. Keep paragraph two's first sentence: gives the verified Romanian entry period and current check date.
5. Keep its second: passport validity and travel documents are substantive admission conditions.
6. Keep its third: preserves immigration inspection and the precise day-after-arrival trigger.

No introductory sentence announces the article or repeats the title. The opening deliberately uses a reader question, rather than the hypothetical scene in 882 or document-availability interval in 884.

Comparison: 008 begins with a lawyer identity and a broad explanation; 009 starts by recalling an earlier article; 012 introduces a general road maneuver. This opening answers one immediate work-start question. Headings group actual applications (job, personal Gold Card, ARC, family), without a numbered checklist or reusing 882's debt-procedure structure. The final paragraph asks for individual work-start and permitted-stay dates in the family's calendar, rather than broad protection-of-rights advice or a repeated disclaimer.

Dropped or avoided: blanket prior-resident-visa requirement; automatic work rights for every dependent spouse; Romanian working-holiday route; a universal degree or salary rule; tax-treaty benefits; guaranteed ARC/Gold Card approval times; Romanian-language consultation; guaranteed status for parents under article 16.

## 884 — Taiwan injury, evidence after return to Romania

File: `drafts/ro/884-romanian-visitor-taiwan-traffic-injury-return-home.md`.

Reader and trigger: a Romanian visitor or resident is injured in a Taiwan collision and expects to return to Romania before all police records are available. The article addresses records, statutory insurance, continuing-treatment evidence, criminal/civil deadlines and settlement/representation.

Country fit: cross-border treatment records in Romanian and document collection after a Taiwan departure are the reader-specific practical hypothesis. No claim is made that Romanian visitors have a particular accident rate. Verified visa-free eligibility supports the plausible visitor group but is not repeated as an irrelevant legal rule in this article. The ledger marks Romanian licence recognition and exchange UNVERIFIED, so the article states neither recognition nor non-recognition and gives no permission to drive.

Overlap and new angle: shared Romanian 003 is a broad accident Q&A and 012 concerns overtaking liability. This article organizes the problem around the flight home and the gap between medical treatment, document availability and rights deadlines. The internal link to 012 is for maneuver analysis, not authority for the new procedural claims. All consequential rules have separate official links.

### Claim → source ledger

| Claim in article | Statute / official URL | Chinese passage checked |
|---|---|---|
| Scene diagram/photos after seven days; preliminary analysis after thirty; application availability rather than guaranteed issuance | [NPA official FAQ](https://www.npa.gov.tw/ch/app/faq/view?id=2144&module=faq&serno=A1084129) | 「於事故7日後得申請閱覽或提供『現場圖』、『現場照片』」「於事故30日後得申請提供『道路交通事故初步分析研判表』」 |
| Injury/death scene duties; injury-only unanimous-agreement marking and moving exception | 道路交通管理處罰條例 [62](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=62) | 「應即採取救護措施……通知警察機關處理，不得任意移動」「但肇事致人受傷案件當事人均同意時，應將肇事汽車標繪後，移置不妨礙交通之處所。」 |
| Statutory bodily-injury/death insurance without general fault requirement | 強制汽車責任保險法 [7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0390060&flno=7) | 「因汽車交通事故致受害人傷害或死亡者，不論加害人有無過失……得依本法規定……請求」 |
| Statutory accident definition: passengers and third parties outside vehicle; own solo-driver cover not assumed | Same Act [13](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0390060&flno=13) | 「使用或管理汽車致乘客或車外第三人傷害或死亡之事故。」 |
| Benefit categories exclude vehicle repair | Same Act [27](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0390060&flno=27) | 「一、傷害醫療費用給付。二、失能給付。三、死亡給付。」 |
| Intentional/criminal causation exclusion concerns victim/claimant; remaining other claimants receive the balance after the responsible claimants' shares are deducted | Same Act [28](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0390060&flno=28) | 「受害人或其他請求權人……致被保險汽車發生汽車交通事故者……一、故意行為所致。二、從事犯罪行為所致。」「保險人應將扣除該一人或數人應分得部分之餘額，給付於其他請求權人。」 |
| Civil tort liability, unlawful infringement and fault | 民法 [184](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=184) | 「因故意或過失，不法侵害他人之權利者，負損害賠償責任。」 |
| Increased needs and impaired earning capacity from bodily/health infringement | 民法 [193](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=193) | 「因此喪失或減少勞動能力或增加生活上之需要時，應負損害賠償責任。」 |
| Nonpecuniary damages for qualifying bodily/health infringement | 民法 [195](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=195) | 「不法侵害他人之身體、健康……被害人雖非財產上之損害，亦得請求賠償相當之金額。」 |
| Victim fault may reduce or eliminate damages | 民法 [217](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=217) | 「損害之發生或擴大，被害人與有過失者，法院得減輕賠償金額，或免除之。」 |
| Negligent injury | 中華民國刑法 [284](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=284) | 「因過失傷害人者」; injury and serious-injury branches read, no sentencing range claimed. |
| Article 284 is complaint-based | 中華民國刑法 [287](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=287) | 「第二百七十七條第一項、第二百八十一條及第二百八十四條之罪，須告訴乃論。」 |
| Six months from complainant learning offender identity | 刑事訴訟法 [237](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=237) | 「自得為告訴之人知悉犯人之時起，於六個月內為之。」 |
| Tort prescription: two years from knowledge of damage and liable person, ten from tort | 民法 [197](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=197) | 「知有損害及賠償義務人時起，二年間……自有侵權行為時起，逾十年者亦同。」 |
| Settlement extinguishes waived rights and creates agreed rights | 民法 [737](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=737) | 「使當事人所拋棄之權利消滅及使當事人取得和解契約所訂明權利」 |
| Complaint withdrawal before close of first-instance argument; no refiling by withdrawing person | 刑事訴訟法 [238](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=238) | 「於第一審辯論終結前，得撤回其告訴。撤回告訴之人，不得再行告訴。」 |
| Complaint agent permitted; prosecutor/judicial police may still require personal attendance | 刑事訴訟法 [236-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=236-1) | 「告訴，得委任代理人行之。但檢察官或司法警察官認為必要時，得命本人到場。」 |

### Opening deletion test

1. Keep the seven-day sentence: provides the actual document types and application-opening interval with primary support.
2. Keep the flight-before-availability sentence: explains why a Romanian reader needs a plan for later collection.
3. Keep the instruction to communicate the departure date: identifies what the person following the file needs for that plan.
4. Keep paragraph two's first sentence: preliminary analysis has a different thirty-day interval.
5. Keep its second: explains that these are application-opening times.
6. Keep the short final sentence: prevents the consequential inference of guaranteed release on that day.

No generic statement about the difficulty of Taiwan accidents was added. The ending returns to the exact police unit, case number and recipient of later records.

Comparison: unlike 008's personal-author introduction and 009's callback, this supplies an actionable date at once. Unlike 012's generic overtaking-risk opening and case narrative, it follows document availability and the reader's return itinerary. The four issue headings are mixed (evidence question, insurance/treatment noun phrase, deadline statement, settlement/representation), and the closing document handoff does not repeat 882's commercial bundle or 883's family calendar.

Dropped or avoided: Romanian licence/IDP recognition, any automatic percentage of fault, automatic acceptance of Romanian medical records, guaranteed recovery of all receipts, fixed insurance payout figures, guaranteed ability to leave or avoid future appearances, six months from flight/accident instead of knowledge of offender, and a claim that settlement automatically ends all criminal proceedings.

## Validation and independent review record

Official variety tool was run on all three final-draft paths. It returned exit 2: language could not be inferred. An explicit `--lang ro` invocation also returned exit 2 because the advertised language set excludes Romanian. This is measurement unavailable, not PASS and not a zero-FAIL certification. No English profile was substituted. No tool or shared rule file was changed.

Supplemental measurement uses Unicode text and whitespace-delimited words; Markdown link destinations, frontmatter and sources are excluded. Sentences split on terminal `.?!` plus whitespace; the draft avoids abbreviated article markers. This is a transparent local diagnostic, not a validated Romanian tokenizer. Manual section-5 checks cover meaning, paragraph starts, legal strength, short sentences, citation placement, opening variety, no bold, no first-person fiction, and fact-specific endings.

### Counts and packaging

Counts use rendered main text including subheadings and the contact paragraph, excluding YAML and the final Sources section. Link labels count, URLs do not. Whitespace is collapsed to single spaces; hyphenated forms remain one whitespace-delimited word. Character counts include Romanian diacritics as Unicode characters. The alternative column includes the Sources heading/list but still excludes YAML.

| Article | Main words | Main characters including spaces | Main characters excluding spaces | Words including sources | Characters including sources and spaces |
|---|---:|---:|---:|---:|---:|
| 882 | 683 | 5,124 | 4,442 | 746 | 5,559 |
| 883 | 754 | 5,419 | 4,666 | 846 | 6,071 |
| 884 | 766 | 5,559 | 4,794 | 834 | 6,027 |

All three are within the brief's approximate 650–950-word main-text target. Metadata lengths (title / seoTitle / summary, Unicode characters) are 63 / 50 / 132, 58 / 50 / 164 and 52 / 54 / 164. Each has four issue headings plus Sources, three FAQ entries, the exact Romanian category, `audience: ["ro"]`, internal author provenance, one email/contact paragraph and distinct menu imagery (I01, I04, I23). No bold or body H1. New slugs do not collide with any snapshot column; internal column targets exist in the Romanian snapshot or this batch. All external body sources appear in the Sources section. There are 14 / 9 / 16 distinct statutory article citations respectively.

Frontmatter parsed successfully using the already available Ruby YAML library. Field order and types/FAQ counts were also inspected; no package was installed. Python PyYAML and repository Node YAML packages were absent, so they were not used.

### Supplemental rhythm measurements and manual section 5

| Article | Prose sentences | Length CV | Sentences of at most 8 words | Similar-length three-sentence runs | Maximum same paragraph opener | Maximum sentences over 32 words in one paragraph |
|---|---:|---:|---:|---:|---:|---:|
| 882 | 48 | 0.469 | 11 (22.9%) | 6.5% | 2 | 1 |
| 883 | 49 | 0.475 | 10 (20.4%) | 12.8% | 2 | 0 |
| 884 | 48 | 0.473 | 11 (22.9%) | 17.4% | 2 | 1 |

Similar-length runs here require all three lengths to fall within ±25% of their three-sentence mean; the denominator is sentence count minus two. This makes the supplemental method reproducible and distinguishes it from the unavailable official Romanian metric.

Manual section-5 results:

1. Official tool executed; unavailable for Romanian, as disclosed above. No automatic zero-FAIL claim.
2. Three different opening types: labelled hypothetical trade dispute; reader's work-start question; a document-availability interval. One scene opening in three.
3. Every article has multiple useful very short sentences; long sentences do not cluster within a paragraph. Source conditions were preserved when adjusting sentence length.
4. Paragraph openers were read vertically; no word begins more than two paragraphs. Repeated “Pentru” openings were repaired.
5. Citations occur as grammatical subjects, embedded references and sentence-end references. No three consecutive claim/caveat paragraphs. Each article has citation-free practical evidence/preparation paragraphs.
6. No stock “not X but Y” repetition. Necessary distinctions concern actual questions raised by the reader: entry/work authorization, application/issuance, receipt of money/underlying rights.
7. Endings concern the disputed commercial lot, individual family dates and the post-departure police-document recipient, respectively. Contact facts recur only as required by the brief.
8. Consistent professional Romanian; no bold, invented first-person lawyer experience or imperative checklist headings. Korean/Japanese register checks are inapplicable.
9. Citation numbers, deadline triggers, discretionary/mandatory strength, exceptions and the hypothetical label were compared after repairs. Independent review corrected the three precision points below, including the actual-work condition for the ordinary professional's family route.

### Independent Romanian editorial review

Reviewer: separate AI agent `ro_locale_review`, did not author or modify the manuscripts. Result: PASS for all three after the initial bounded repairs and a further reread of 883's family paragraph following final legal review. This is not a claim of human native-speaker or attorney review.

Resolved findings:

- 883 line 26: replaced “cere permis solicitat de angajator” with “cere un permis obținut la cererea angajatorului”. The reviewer rechecked `tools/law.py N0090001 43`; the repair expressly requires approval, preserving the intended legal rule.
- 884 line 42: expanded the article 28 exclusion to distinguish other claimants from the victim and require payment of the remainder after deducting responsible claimants' shares. Reviewer rechecked `tools/law.py G0390060 28`. This repairs the prior overbroad presentation of the exclusion and preserves the complete statutory exception.
- 883 line 56: final legal review requested an explicit distinction between an ordinary professional actually engaging in professional work in Taiwan and the special-professional category under article 16(2). The revised paragraph retains approved residence/permanent residence, specified family classes, permitted entry routes and direct application rather than guaranteed approval. The locale reviewer reread the exact final paragraph independently and returned PASS. The author reran `tools/law.py A0030295 16` to restore the exact Chinese word order in the ledger quotation.

The reviewer retained all six opening sentences in each article, compared Romanian 008/009/012 with their actual dates, and found manual section-5 review satisfactory. It also retained the limitation that the official Romanian metric is unavailable.

Reviewed hashes:

| Article | SHA256 |
|---|---|
| 882 | `915c740d9a6c6205dd7cca892d7a596dded88bff87237190e5de12c7ced7df66` |
| 883 | `dd1a04679bd6387ad98beebbd9e876d4dfd0fa2ab1da7b1d581de0d6caac10ed` |
| 884 | `8043fe25c3895f013d6a5e4e0d89f74dfc7514a954d623e078780d23319c1707` |

### Independent final legal review

Reviewer: separate AI agent `ro_final_review`, read-only and independent of the author and locale reviewer. Final verdict: PASS for 882, PASS for 883, PASS for 884; overall PASS at the three hashes immediately above. No remaining material findings or optional style changes requested. This is an AI editorial/legal-source review, not review by a licensed attorney or publication authority.

The reviewer independently read all 39 cited statutory articles through `tools/law.py`, checked that the existing caches would not be written, and compared each provision against live MOJ text fetched in memory. All matched. It independently verified the professionals-law commencement order and reopened BOCA, NIA, Gold Card, the official Romania trade profile and the firm's contact page. The sole additional manuscript repair concerned 883's article 16(2) family-route condition; the exact Chinese quotation in this note was also restored. The reviewer read both corrections and received the independent Romanian reread PASS before its final verdict.

Review covered applicable-law and limitation conditions, payment-order exclusions and objection effect, provisional attachment, immigration categories, family work/residence distinctions, police document application dates, compulsory-insurance exceptions, civil/criminal deadline triggers, settlement/representation limits, country fit, sources, metadata, FAQs and consultation claims. It independently reproduced the final counts, compared Romanian 008/009/012 and found manual opening/section-5 review satisfactory. The official Romanian metric remains unavailable, with no automated PASS claimed.

These are completed local manuscript checks only. No production build, publication, repository integration or published-URL result is claimed.
