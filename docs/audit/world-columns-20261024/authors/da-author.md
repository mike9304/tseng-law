# Danish author work note — 840–842

Prepared 24 October 2026. Locale: `da`. Assigned topics retained: B-SETUP, B-DEF, P-WORK. These are original Danish articles for Danish companies and professionals, not nationality substitutions in translated source articles. The intended legal jurisdiction is Taiwan throughout.

## Reading and verification record

Read `briefs/BRIEF.md` and `briefs/ASSIGNMENTS.md`, the image menu, `repo/docs/columns/EDITORIAL-VOICE.md`, `repo/docs/columns/FRONTMATTER.md`, the supplied sentence-variety rule and lessons, and the corresponding shared rules at `/Users/son7/tseng-lanes-shared/`. Also read `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`.

The home-library path `/Users/son7/agent-library/knowledge/editorial-voice.md` was absent. The complete repository editorial-voice file supplied by this brief was used; no claim is made that the absent home file was read or proved identical. Historical references to compulsory Fable review were superseded by the user's 15 October decision. No subagents, publication, git commands or installations were used.

Same-language reference articles read: `008-taiwan-labor-severance-law.md`, `014-taiwan-mandatory-employment-period.md`, and `016-taiwan-inheritance-custody-analysis.md`, all under `repo/src/content/columns-da/`. Their exact category, `Juridisk information om Taiwan`, their Danish date form and `minutters læsetid` pattern were retained. Their old H1s, author footers, promotional links and overly repetitive prose were not copied.

Structural references read under `repo/src/content/`:

- B-SETUP: `columns-en/001-taiwan-company-establishment-basics.md`, `columns-en/004-taiwan-company-subsidiary-vs-branch.md`, `columns-es/656-taiwan-one-shareholder-limited-company-director.md`, `columns-en/507-taiwan-investor-company-records-access.md`.
- B-DEF: `columns-en/506-taiwan-defective-shipment-inspection-notice.md`, `columns-es/690-spain-buyer-taiwan-defective-goods-notice.md`, `columns-hi/670-indian-buyer-taiwan-machinery-defect-notice.md`, `columns-de/680-taiwan-bauteile-maengelruege-pruefmuster.md`.
- P-WORK: `columns-en/705-taiwan-visa-residence-work-study-family.md`, `columns-en/704-taiwan-arc-first-application.md`, `columns-en/706-taiwan-arc-renewal-changes-reentry.md`, `columns-en/352-hiring-in-taiwan-without-local-entity-eor-pe-work-permits.md`.

The country-facts ledger was consulted, including its verification conventions and all Denmark rows. Only the supported Danish visa-exemption and comprehensive-tax-agreement findings were used. Both were independently checked against the linked BOCA and Ministry of Finance pages. The ledger's unverified driving-licence information was not used.

Every statute linked in the articles was fetched through the unchanged `tools/law.py`, executed with `runpy.run_path` and its normal pcode/article arguments. Its hard-coded cache directory was redirected in memory to `drafts/da/.law-cache` to respect this assignment's write boundary. That changes only the cache location, not fetching, parsing or article text. The checked articles and excerpts are recorded below. Temporary cache files were removed after verification.

Legal-version check:

- Civil Code: revision shown as 17 August 2026. The tool printed `!!! 部分條文尚未生效`. The banner identifies article 166-1, with commencement still undetermined, and article 1223, whose amendment takes effect six months after promulgation. None of the provisions used in 841 is one of those provisions. The article expressly states the 24 October 2026 legal position.
- Company Act: revision shown as 26 December 2025; no pending-effect banner. Article 449 was also read to check the six-month commencement rule for the December amendment. That period had elapsed by this batch date.
- Foreign Professionals Act: revision shown as 24 September 2025. The [official history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295) was fetched with curl after the browser tool failed to open it. The Executive Yuan order of 18 November 2025 sets the relevant provisions in force from 1 January 2026; the specified education provisions and articles 28–29 commenced on 30 June 2026. The cited provisions are effective on the batch date.
- Foreign Investment Statute: 19 November 1997; conflict-of-laws act: 26 May 2010; Employment Service Act: 20 January 2025; Immigration Act: 28 June 2023; qualification standards: 1 August 2024. No pending-effect banner appeared for these fetched texts. These are the displayed whole-instrument revision dates, not assertions that every cited provision changed on those dates.

## 840 — Danish company, subsidiary or branch

File: `drafts/da/840-danish-company-taiwan-subsidiary-branch-project-office.md`.

Reader and trigger: a Danish equipment or service supplier must name the contracting entity in a Taiwan wind-project service agreement and decide whether its proposed project office should be a subsidiary, branch or representative office. The opening asks about the party performing the service, rather than promising a universal entity recommendation.

Country fit: Taiwan's [Ministry of Economic Affairs / Energy Administration](https://mnscdn.moea.gov.tw/MNS/populace/news/News.aspx?kind=1&menu_id=40&news_id=121502) explicitly identifies Danish participation in Taiwan offshore-wind investment. The verified excerpt includes `已成功吸引丹麥` and describes developers participating in Taiwan's offshore-wind market. That supports the industry connection, not a count of Danish suppliers or evidence of demand for this particular article. The supplier/project-office reader is a labelled editorial hypothesis. The Denmark income-tax agreement is an independently verified national distinction.

Overlap and new angle: existing Danish 001/004 already discuss company formation generically and contain Korean assumptions; they were not linked. The English structural sources supply the legal-personality, investment and capital structure. This article centres on the Danish supplier's service obligations, parent-level risk, a possible local co-owner and the Danish tax agreement. It leaves shareholder-record disputes from 507 and the special director-appointment analysis in 656 outside this narrower article.

### Claim → source and checked text

| Claim in the article | Official source | Checked Chinese excerpt |
|---|---|---|
| Taiwan-incorporated subsidiary has separate legal personality | [Company Act art. 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=1) | `依照本法組織、登記、成立之社團法人` |
| Limited company can have one shareholder | [Company Act art. 98](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=98) | `有限公司由一人以上股東所組成。` |
| Foreign corporate investor is within the investment statute | [Foreign Investment Statute art. 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=3) | `本條例所稱外國人包括外國法人。` |
| Contribution-limited liability, with the serious-abuse/debt/payment-difficulty/necessity exception preserved | [Company Act art. 99](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=99) | `各股東對於公司之責任，除第二項規定外，以其出資額為限。` / `股東濫用公司之法人地位，致公司負擔特定債務且清償顯有困難，其情節重大而有必要者，該股東應負清償之責。` |
| Branch is a subordinate part of the head company, not an entity with its own equity investors | [Company Act art. 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=3) | `所稱分公司，為受本公司管轄之分支機構。` |
| Foreign company remains responsible for unresolved debts after all Taiwan branches are deregistered | [Company Act art. 380](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=380) | `應就其在中華民國境內營業所生之債權債務清算了結，未了之債務，仍由該外國公司清償之。` |
| Branch registration precedes doing business in the foreign company's own name in Taiwan | [Company Act art. 371](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=371) | `外國公司非經辦理分公司登記，不得以外國公司名義在中華民國境內經營業務。` |
| Representative office must be registered; it is not the structure for local profit-making operations | [Company Act art. 386](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=386), read with art. 371 and Invest Taiwan below | `外國公司因無意在中華民國境內設立分公司營業，未經申請分公司登記而派其代表人在中華民國境內設置辦事處者，應申請主管機關登記。` |
| Branch requires designated operating funds and responsible representative | [Company Act art. 372](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=372) | `應專撥其營業所用之資金，並指定代表為在中華民國境內之負責人。` |
| Investment in subsidiary and changes to investment plan require approval | [Foreign Investment Statute art. 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=8) | `應填具投資申請書，檢附投資計畫及有關證件，向主管機關申請核准。投資計畫變更時，亦同。` |
| Restricted sectors require competent-sector permission | [Foreign Investment Statute art. 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=7) | `限制投資之事業，應取得目的事業主管機關之許可或同意。` |
| Approved capital must arrive within approved period; amount verification follows contribution | [Foreign Investment Statute art. 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=9) | `投資人應將所核准之出資於核定期限內全部到達` / `投資人於實行出資後，應向主管機關申請審定投資額` |
| Limited company's subscribed capital must be fully paid | [Company Act art. 100](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=100) | `公司資本總額，應由各股東全部繳足，不得分期繳款或向外招募。` |
| Company setup does not itself authorize employment; statutory exceptions remain | [Employment Service Act art. 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | `除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。` |
| No universal minimum capital; incorporation costs and sector rules matter; subsidiary formation sequence | [Invest Taiwan, foreign investment procedures](https://investtaiwan.nat.gov.tw/showBusinessPagejpnInvestmentStatus01?lang=cht&search=InvestmentStatus01) | `無最低資本額要求` / `足敷設立成本` / `得要求較高之資本額` |
| Denmark has an in-force comprehensive income-tax agreement, entered into force 23 December 2005 | [MOF treaty table](https://www.mof.gov.tw/singlehtml/191?cntId=63930), also Denmark `tax_treaty` ledger row | `丹麥` / `Denmark 2005/08/30(94 年) 2005/12/23(94 年)` |

First-two-paragraph deletion test, sentence by sentence:

1. Keep “Hvem skal stå som leverandør …?”: identifies the contract, parties and Danish/Taiwan project decision, rather than repeating the title's entity labels.
2. Keep “Svaret bør være afklaret …”: adds the signing-stage trigger; it is practical advice, not a statutory filing deadline.
3. Keep “Sammenhold aftalens selskabsnavn …”: supplies the operational records to compare with the contract.
4. Keep “For en dansk leverandør …”: introduces the combined sales/maintenance operating model.
5. Keep “Beskriv, hvad medarbejderne …”: specifies the division of actual work and decisions between jurisdictions.
6. Keep “Brug gerne den første konkrete ordre.”: turns the preparation into an existing-document task.
7. Keep “Et organisationsdiagram alene …”: explains why that order adds information about contractual performance.

No generic opening sentence was retained. The deletion test did not require removing one of these seven sentences; each supplies a distinct preparation fact or step.

Same-language comparison: 008 opens with a byline and “Denne artikel gennemgår …”, then fragments an employment example into many one-line paragraphs. 014 opens with a definition and announces four questions, followed by eleven numbered sections. 016 starts with a broad family overview, then another multi-part distinction and eleven numbered sections. Article 840 instead uses one concrete contracting question and four unnumbered issue headings. Its ending points to the contract showing the supplier and obligation; it does not repeat the topic or add an author footer.

Dropped or limited claims: no Danish dividend-withholding rate or PE duration was stated because treaty text and application conditions were not fully verified for those quantitative claims. No Korean treaty rate was transplanted. No promise of automatic work authorization from an investment or a capital amount. No universal timetable for incorporation, banking approval or document authentication. No claim that all wind-sector suppliers require one particular licence.

## 841 — Defective Taiwan wind components

File: `drafts/da/841-danish-buyer-taiwan-wind-components-defect-notice.md`.

Reader and trigger: a Danish procurement/quality team has measurable nonconformity in delivered components but is still waiting for a cause analysis, while an installation date approaches. The Esbjerg flange example is expressly marked `tænkt eksempel` in the sentence that introduces it.

Country fit: the same official evidence of Danish participation in Taiwan offshore wind makes the supply-chain reader plausible. A particular Danish flange procurement route, defect incidence or urgent demand is not established by that evidence. Those details are a labelled editorial hypothesis, not a reported transaction or client case. Danish receiving records, drawing revisions, project schedules and coordination between procurement and technical teams provide the concrete angle.

Overlap and new angle: the three existing Danish reference articles contain no business-purchase defect procedure. The four structural defect articles supply the sale-of-goods framework. This article concentrates on the link from drawing revision to identified physical sample and distinguishes a usable replacement from the desired financial settlement. It avoids consumer rights and claims about Danish sales law.

### Claim → source and checked text

| Claim in the article | Official source | Checked Chinese excerpt |
|---|---|---|
| Party choice governs contractual law; absent a valid express choice, closest connection applies | [Conflict-of-laws act art. 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) | `依當事人意思定其應適用之法律。` / `當事人無明示之意思或其明示之意思依所定應適用之法律無效時，依關係最切之法律。` |
| Prompt ordinary inspection, immediate notice, and deemed acceptance; latent defects require notice on discovery too | [Civil Code art. 356](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356) | `應按物之性質，依通常程序從速檢查` / `應即通知出賣人` / `不能即知之瑕疵，至日後發見者，應即通知出賣人，怠於為通知者，視為承認其所受領之物。` |
| Intentional nondisclosure disapplies the art. 356 rule | [Civil Code art. 357](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=357) | `於出賣人故意不告知瑕疵於買受人者，不適用之。` |
| Warranty concerns condition at risk transfer, ordinary/contractual utility and guaranteed quality; insignificant reductions excluded | [Civil Code art. 354](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354) | `危險移轉於買受人時` / `通常效用或契約預定效用` / `但減少之程度，無關重要者，不得視為瑕疵。` / `具有其所保證之品質。` |
| Rejected goods sent from elsewhere: temporary custody where seller has no local agent, immediate appropriate proof, otherwise presumed defect-free on receipt | [Civil Code art. 358](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=358) | `如出賣人於受領地無代理人，買受人有暫為保管之責。` / `不即依相當方法證明其瑕疵之存在者，推定於受領時為無瑕疵。` |
| Rescission or reduction where warranty liability exists; manifestly unfair rescission limited to reduction | [Civil Code art. 359](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=359) | `買受人得解除其契約或請求減少其價金。` / `解除契約顯失公平者，買受人僅得請求減少價金。` |
| Conforming substitute remedy concerns goods designated only by kind | [Civil Code art. 364](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=364) | `買賣之物，僅指定種類者` / `即時請求另行交付無瑕疵之物。` |
| Damages basis for missing guaranteed qualities or intentional nondisclosure | [Civil Code art. 360](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=360) | `缺少出賣人所保證之品質者` / `請求不履行之損害賠償；出賣人故意不告知物之瑕疵者亦同。` |
| Rescission/reduction: six months after notice without exercise or five years after delivery; deliberate nondisclosure removes only six-month rule | [Civil Code art. 365](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=365) | `為通知後六個月間不行使或自物之交付時起經過五年而消滅。` / `前項關於六個月期間之規定，於出賣人故意不告知瑕疵者，不適用之。` |
| Rescission exercised by declaration to counterparty | [Civil Code art. 258](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=258) | `解除權之行使，應向他方當事人以意思表示為之。` |
| Seller may set a reasonable decision period; nonexercise then loses rescission | [Civil Code art. 361](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=361) | `出賣人得定相當期限` / `買受人於前項期限內不解除契約者，喪失其解除權。` |

First-two-paragraph deletion test:

1. Keep the flange/Esbjerg/project sentence: establishes the expressly fictional goods, location, mismatch and project pressure.
2. Keep “Måleresultaterne foreligger.”: identifies what evidence is already available for a notice.
3. Keep “Laboratoriet mangler stadig …”: distinguishes established nonconformity from an unknown cause.
4. Keep the art. 356 sentence: supplies the immediate-notice duty, seller-responsibility condition and source.
5. Keep “Taiwansk ret skal først …”: scopes the following legal explanation.
6. Keep the art. 20 sentence: supplies both express-choice and fallback conditions.
7. Keep the instruction to check contract and incorporated terms: identifies the documents resolving that scope.
8. Keep “Leverandørens adresse afgør ikke alene lovvalget.”: prevents treating Taiwan origin as conclusive.
9. Keep the 24 October 2026 sentence: preserves the required effective-law reference following the Civil Code banner check.

No mandatory condition or date was cut for shorter prose. The model opener “I denne artikel gennemgår vi reklamation” was not used.

Same-language comparison: unlike the fragmented, unlabeled client narrative in 008, this opening is a single labelled hypothetical followed immediately by a source-backed duty. Unlike 014's definition/four-question introduction and 016's general legal-family distinctions, the first object is a measured physical component. Headings mix document identification, a physical evidence consequence, one remedy question and a precise deadline statement. The ending returns to the identified sample and first report, rather than a recap or footer.

Dropped or limited claims: no universal inspection period, no six months from delivery for the first notice, no automatic full project-loss recovery, no assertion that every bespoke machine is replaceable under art. 364, and no suspension of rights merely because repair negotiations continue. The article does not attempt to calculate a damages limitation period or establish intentional concealment from a disagreement. No claim is made about defect prevalence in Taiwanese manufacturing.

## 842 — Danish engineer, work route and family

File: `drafts/da/842-danish-engineer-taiwan-work-permit-family-residence.md`.

Reader and trigger: a Danish engineer has a prospective technical role or project assignment, with travel and possibly accompanying family to arrange. The first concrete fact is the Danish 90-day visa exemption, immediately bounded by its entry conditions and the independent work-authorization rule.

Country fit: Denmark appears explicitly in BOCA's 90-day list. The offshore-wind connection is supported by the MOEA page identified above; a Danish engineer with land-based or vessel-related tasks is a labelled readership hypothesis, not an assertion that every Danish engineer has that role. No working-holiday route was invented: Denmark is absent from the ledger's current partner table, and the assigned P-WORK topic was retained.

Overlap and new angle: 008 concerns termination payments, 014 employment bonds, and 016 succession; none gives a Danish professional a first-entry/work/family route. The linked existing 014 is relevant only to a separately negotiated minimum-service commitment. Structural references 704–706 supply the distinction among entry, residence approval and ARC filing. Source 352 prompted review of employer-sponsored versus personal work authorization, but its US tax analysis, EOR claims and pay figure were not imported. Direct employment, contract assignments and ship crew categories are kept distinct.

### Claim → source and checked text

| Claim in the article | Official source | Checked Chinese excerpt or official English wording |
|---|---|---|
| Ordinary Danish passport: up to 90 days, six-month validity, onward/return travel and entry inspection, counting from next day | [BOCA visa-exemption page](https://www.boca.gov.tw/fp-149-4486-7785a-1.html); supported by Denmark `visa_free` ledger row | English fragments: `Denmark`; `at least six months`; `starts from the day after arrival`. The full requirements and permit-required activity caveat were read. |
| General work-permit rule with statutory exceptions | [Employment Service Act art. 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | `除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。` |
| Technical work and ship crew are distinct work categories | [Employment Service Act art. 46](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=46) | `一、專門性或技術性之工作。` / `七、商船、工作船及其他經交通部特許船舶之船員。` |
| Contract-performance route where foreign corporate employer has no branch/representative office; covered duties limited to art. 46(1)(1)/(2) | [Employment Service Act art. 51(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=51) | `須指派外國人在中華民國境內從事第四十六條第一項第一款或第二款契約範圍內之工作` / `未設立分公司或代表人辦事處者，應由訂約之事業機構或授權之代理人` |
| Normal technical-professional employment application goes through employer to MOL | [Foreign Professionals Act art. 5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | `除本法另有規定外，應檢具相關文件，向勞動部申請許可` |
| Qualification routes include educational, experience and intra-company-assignment alternatives; no universal route promised | [Qualification standards art. 5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090031&flno=5) | `仍應符合下列資格之一` / `碩士以上學位` / `學士學位而有二年以上相關工作經驗` / `服務跨國企業滿一年以上經指派來我國任職者` |
| Where applicable, remuneration must meet announced amount | [Qualification standards art. 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090031&flno=8) | `其薪資或所得報酬不得低於中央主管機關公告之數額。` |
| Gold Card is a personal application by qualifying special professionals, combines four permissions, lasts one to three years | [Foreign Professionals Act art. 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | `外國特定專業人才` / `得逕向內政部移民署申請` / `具工作許可、居留簽證、外僑居留證及重入國許可四證合一` / `有效期間為一年至三年` |
| Gold Card work authorization is open and does not require a prior job offer | [Official Gold Card introduction](https://goldcard.nat.gov.tw/en/about/) | `You don’t need to have already secured a job in Taiwan.` |
| Qualifying authorized/exempt professionals can apply directly for residence after visa-exempt/visitor entry; approval required | [Foreign Professionals Act art. 16(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | `經許可或免經許可在我國從事專業工作者，得逕向內政部移民署申請居留；經許可者，發給外僑居留證。` |
| Contract assignments of more than six months use distinct BOCA visa steps rather than automatically following the ordinary professional route | [BOCA visa-exemption page](https://www.boca.gov.tw/fp-149-4486-7785a-1.html), Duration of stay, item 2 | `engage in contracting work for more than 6 months`; simultaneous visitor/resident visa applications described in the page's following text. |
| Resident-entry ARC deadline starts next day, 30 days; integrated-card exception | [Immigration Act art. 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | `應於入國後之翌日起算三十日內` / `或其他已含有外僑居留證功能之證件者，得免申請外僑居留證。` |
| Spouse, minor children and adult children unable to care for themselves due to disability; professional sponsor's residence and work conditions retained | [Foreign Professionals Act art. 16(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | `外國專業人才在我國從事專業工作及外國特定專業人才，經內政部移民署許可居留或永久居留者` / `其配偶、未成年子女及因身心障礙無法自理生活之成年子女` |
| Eligible spouse of special/senior professional may personally apply for work permit after approved dependent residence; no longer than dependent residence | [Foreign Professionals Act art. 15(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15) | `外國特定專業人才及外國高級專業人才之配偶` / `得逕向勞動部申請許可` / `該工作許可期間不得逾其依親居留期間。` |
| Category-specific documents and authentication must be matched to residence route | [NIA guide 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news), updated 14 April 2026 | Official guide sections on required documents, work/family evidence, residence address and foreign-document verification checked. No universal police/health certificate requirement was asserted. |

First-two-paragraph deletion test:

1. Keep the opening “90 dages …”: verified Danish nationality-specific entry permission and its conditions.
2. Keep the BOCA sentence: actual passport and departure-ticket conditions; removing it would overstate accessibility.
3. Keep “Indrejsekontrollen skal også …”: entry is still subject to approval.
4. Keep the next-day counting sentence: fixes the start of the stay period.
5. Keep the installation/commissioning sentence: identifies the reader's actual work trigger before starting.
6. Keep the art. 43 sentence: source-backed default and exceptions.
7. Keep “Flybilletten afgør ikke arbejdsretten.”: distinguishes travel permission from the work decision in the reader's planning.
8. Keep the job-description sentence: identifies documents/facts useful for choosing the route.

The test retained these factual/conditional sentences. No general “Taiwan is an attractive destination” introduction or article roadmap was added.

Same-language comparison: 008's introduction explains the article's topic before answering the employment question; 014 leads with an extended definition; 016 lists several family-law issues. Article 842 instead starts with a nationality-specific number and entry conditions, then distinguishes permission to work. Four unnumbered headings follow the engineer's activity, authorization route, residence application and family. The final substantive sentence returns to the actual first working day and its covering approval. There is no copied summary/disclaimer ending.

Dropped or limited claims: no Taiwan–Denmark working-holiday program; no general right to work for all dependent ARC holders; no assertion that every engineer qualifies for a Gold Card; no universal salary figure; no general visa-exempt-to-resident conversion; no assumption that contract personnel use the same visa route as directly employed professionals. A numerical short-contract exemption was not given without a separate verification of its subordinate rules. A Gold Card processing-time guarantee, work-permit processing deadline, Danish professional-licence recognition and Danish tax result were all omitted.

## Recorded editorial corrections and preservation check

| Problem sentence or drafting choice | Reason | Final treatment | Meaning preserved? |
|---|---|---|---|
| 840: “Et generelt lovbestemt minimum for selskabskapital findes ikke.” | Third paragraph opening with `Et`; the prescribed tool initially reported `FAIL top_opener_n=3`. | “Selskabskapitalen har ikke et generelt lovbestemt minimum.” | Yes; no amount, exception or legal strength changed. MONOTONY: paragraph opener — third `Et` opener — change the subject placement. |
| 840: whole foreign corporate ownership inferred only from the one-owner company provision | A foreign legal person's eligibility deserved its own checked legal link. | Added Foreign Investment Statute art. 3 and retained the investment-rule qualification. | Yes; stronger source support, no blanket sector eligibility. |
| 841: later paragraph began “Artikel 356 …” without a fresh adjacent link | A reader entering at the heading should not have to find the earlier inline citation. | Linked that occurrence of art. 356 again; added no new legal proposition. | Yes, including latent-defect and acceptance conditions. |
| 842: later family paragraph referred to art. 16 only in plain text | Same local source-support issue. | Added an inline art. 16 link in the family paragraph. | Yes; sponsor/work conditions and adult-child limitation remain. |
| 842: “Ægtefællens arbejde kræver særskilt afklaring.” | Generic transition; body otherwise contained no reader question. | “Skal din ægtefælle også arbejde?” followed immediately by the bounded art. 15 rule. | Yes; no new automatic work right was suggested. |

No bold, body H1, author footer, fabricated experience, native-review claim or lawyer-review claim was added. The supplied internal `author: legal-ai-assistant` field and image-illustration disclosures are present. Image choices are distinct: I08, I05 and I04, with descriptions limited to the menu. Contact paragraphs preserve the authorized email, locale contact page, four consultation languages, language arrangement first, conflict-check name, Taiwan connection, deadlines, restricted first-email contents and no engagement by email alone.

## Sentence-variety check and section 5 self-check

The installed `/Users/son7/tseng-lanes-shared/variety/variety_metrics.py` supports only `ko`, `ja`, `en`, `zh-hant`; it otherwise guesses Korean for this folder. It has no Danish tokenizer or Danish contrast dictionary. It was therefore run with `--lang en` as a disclosed mechanical proxy, not represented as a native Danish assessment. All final files must return zero FAILs. The source file itself was not modified.

A second read-only check counted Unicode words including æ/ø/å, protected `stk.`, `nr.` and `art.` during sentence splitting, and excluded the Danish `Kilder` section. It checked length variation, short-sentence proportion, similar-length runs, paragraph openers, consecutive first-word repetition and paragraphs with multiple long sentences. Danish contrast patterns and actual register were reviewed manually. This supplements, rather than disguises, the tool's language limitation.

Section 5 results:

1. Required tool: final proxy output and counts are recorded in the verification block below.
2. Openers differ: 840 concrete contracting question; 841 one labelled hypothetical; 842 a verified nationality-specific number. No opener type exceeds half the three-article batch; only one article uses a scene.
3. Each article contains more than two sentences of eight words or fewer. The Unicode check found no paragraph with two sentences of 32 or more words.
4. No paragraph-opening word occurs more than twice in any article under the Unicode check.
5. Citation placements vary between sentence subjects, introductions and embedded clauses. Each article also has source-free practical preparation paragraphs. No three paragraphs follow a repeated claim/citation/caveat template.
6. No repeated “not X but Y” formula. Necessary scope distinctions remain: entity versus permission, defect notice versus remedy, and residence versus work. These are not invented opposing claims.
7. Endings are tied respectively to the service contract, the identified component sample and the first working day. Required source lists follow as structural material.
8. Danish explanatory register is consistent. Korean/Japanese ending checks are inapplicable. No imperative checklist headings or fabricated first-person account.
9. The correction pass preserved article numbers, six-month/five-year starting points and exceptions, the 30-day next-day ARC rule, the 90-day Danish entry conditions, all family-eligibility limits and the hypothetical label.

Scope of review: author self-check against primary statutes and agency pages, plus format/link/variety checks. No independent Danish native-speaker or lawyer review is claimed. All internal links resolve to an existing Danish repository slug or one of these three new slugs; publication of those draft routes is not claimed.

## Final verification and counts

Verified: all three articles have the exact frontmatter field order, three FAQs, five H2s including `Kilder`, complete official-source coverage, image paths matching the supplied menu and allowed internal links. Slugs are unique in the repository snapshot. All cited statute/article pairs were re-run through `tools/law.py`; no missing articles. No unresolved format or manual legal-condition issue was identified in this author review.

Image verification limit: the read-only snapshot contains `docs`, `src` and `AGENTS.md`, with no `public` or image directory. The supplied image-menu paths are retained exactly; local binary existence was not verifiable. An initial existence assertion against `repo/public` was replaced with the appropriate menu-membership check.

| Article | Body words | Body characters | Without whitespace | Full-file words | Full-file characters |
|---|---:|---:|---:|---:|---:|
| 840-danish-company-taiwan-subsidiary-branch-project-office.md | 709 | 5412 | 4684 | 994 | 10242 |
| 841-danish-buyer-taiwan-wind-components-defect-notice.md | 738 | 5549 | 4794 | 1011 | 9498 |
| 842-danish-engineer-taiwan-work-permit-family-residence.md | 753 | 5867 | 5096 | 1091 | 10485 |

Final installed-tool output (`--lang en`, explicitly a proxy):

```text
/Users/son7/tseng-world-columns-20261024/drafts/da/840-danish-company-taiwan-subsidiary-branch-project-office.md [en] sentences=51 mean=15.2 cv=0.49 short=0.196 run3=0.041 opener_rep=0.167 cite_end=0.0 cite_para=0.5 contrast=0 caveat=0 q=2
  OK — no variety limit violated
/Users/son7/tseng-world-columns-20261024/drafts/da/841-danish-buyer-taiwan-wind-components-defect-notice.md [en] sentences=60 mean=14.2 cv=0.512 short=0.183 run3=0.017 opener_rep=0.062 cite_end=0.0 cite_para=0.562 contrast=0 caveat=0 q=1
  OK — no variety limit violated
/Users/son7/tseng-world-columns-20261024/drafts/da/842-danish-engineer-taiwan-work-permit-family-residence.md [en] sentences=58 mean=14.7 cv=0.562 short=0.259 run3=0.018 opener_rep=0.235 cite_end=0.0 cite_para=0.588 contrast=0 caveat=0 q=1
  OK — no variety limit violated
```

Unicode Danish check (same thresholds, no native-speaker claim):

| Article | Sentences | Length CV | Short share | Similar-length runs | Maximum opener frequency | Consecutive same first word | Body questions | Paragraphs with multiple long sentences |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 840 | 51 | 0.465 | 0.255 | 0.061 | 2 | 2 | 2 | 0 |
| 841 | 59 | 0.517 | 0.305 | 0.053 | 2 | 0 | 1 | 0 |
| 842 | 54 | 0.508 | 0.333 | 0.0 | 2 | 0 | 1 | 0 |

Final article SHA-256 values:

- `840-danish-company-taiwan-subsidiary-branch-project-office.md`: `f689e462ab14e718a61d41e5a65c3f53b4f40f3d14b1f5bdacdf34af20feb505`
- `841-danish-buyer-taiwan-wind-components-defect-notice.md`: `b40aacc63783f6aee068535f3cc86658d2e0b380aa941f970c9dae4e32ced3df`
- `842-danish-engineer-taiwan-work-permit-family-residence.md`: `090efa05e1396d26b50300ee454c015a005a40d22630b609af1205c5623a8a63`

Count convention: article-body counts include the four substantive H2 headings and contact paragraph, exclude YAML and `Kilder`, and replace Markdown links with visible labels. Words are whitespace-separated; characters include spaces and paragraph line breaks. Separate full-file counts include YAML, link syntax, source lists and every newline. No count treats UTF-8 bytes as characters.
