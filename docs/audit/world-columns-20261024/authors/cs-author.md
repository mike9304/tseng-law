# Czech author record — 24 October 2026

Assignment: cs, columns 873–875, B-SETUP / P-WHV / B-DEF. Status: three authored drafts, with source verification and author self-checks. These are not independently reviewed, published, or certified as lawyer-reviewed or native-speaker-reviewed.

## Inputs and scope

Read BRIEF.md and ASSIGNMENTS.md in full, the repository EDITORIAL-VOICE.md and FRONTMATTER.md, IMAGE-MENU.md, rules/SENTENCE-VARIETY-RULE.md and rules/LESSONS.md. The two rules files match the copies at /Users/son7/tseng-lanes-shared/ byte for byte. Also read /Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md; its referenced /Users/son7/agent-library/knowledge/editorial-voice.md is absent on this machine, so the complete repository house-style copy is the applicable available text. Current user instructions retire the historical Fable workflow. Read the tseng-law-editorial skill for factual, locale and consultation standards; this assignment is the author stage only.

Same-language comparison texts read in full:

- repo/src/content/columns-cs/008-taiwan-labor-severance-law.md
- repo/src/content/columns-cs/014-taiwan-mandatory-employment-period.md
- repo/src/content/columns-cs/016-taiwan-inheritance-custody-analysis.md

The exact category copied from these is `Právní informace o Tchaj-wanu`. Date pattern: `24. října 2026`. Reading-time pattern: `5 min čtení`. Their older bylines, body H1s, broad disclaimers, Korean examples and claims about the practice are not authority for this batch's firm facts.

Structural texts read in full:

- B-SETUP: columns-en/004-taiwan-company-subsidiary-vs-branch.md, columns-en/001-taiwan-company-establishment-basics.md, columns-es/656-taiwan-one-shareholder-limited-company-director.md, columns-en/507-taiwan-investor-company-records-access.md.
- P-WHV: columns-fr/654-taiwan-working-holiday-visa-work-insurance-tax.md.
- B-DEF: columns-en/506-taiwan-defective-shipment-inspection-notice.md, columns-es/690-spain-buyer-taiwan-defective-goods-notice.md, columns-hi/670-indian-buyer-taiwan-machinery-defect-notice.md, columns-de/680-taiwan-bauteile-maengelruege-pruefmuster.md.

research/country-facts.md was absent when research began. No unverified country-facts rows were used. Czech working-holiday eligibility and conditions were checked directly against BOCA and MOFA. Czech tax-agreement status was checked against the Ministry of Finance's official release, fetched successfully with curl after the web reader timed out. No Czech domestic-law conclusion is offered.

Writes are confined to drafts/cs/ and this file. No git, installation, repository modification, publication or third-party message was performed. Statutory HTML was temporarily cached beneath drafts/cs/.law-cache to prevent tools/law.py from writing to its default shared html/ directory; the task-created cache is removed after verification.

## Statute verification method and effective dates

Executed the existing tools/law.py through Python runpy, changing only its cache-directory expansion in memory. Statutory fetching, title checks, warning detection and article extraction remained the original tool's code. Each cited provision was printed and read before use. Reproduction pattern, from the batch root:

```python
from pathlib import Path
import os, runpy, sys
expand = os.path.expanduser
cache = str(Path('drafts/cs/.law-cache').resolve())
os.path.expanduser = lambda p: cache if p == '~/tseng-world-columns-20261024/html' else expand(p)
sys.argv = ['tools/law.py', 'B0000001', '258', '354', '356', '357', '358', '359', '360', '361', '364', '365']
runpy.run_path('tools/law.py', run_name='__main__')
```

Complete checked sets:

| Pcode / printed title | Articles checked with tools/law.py | Status seen |
|---|---|---|
| J0080001 / 公司法 | 1, 2, 7, 17, 98, 99, 100, 371, 372, 386, 449 | Amendment date 2025-12-26; no uncommenced banner. Article 449's six-month commencement provision has elapsed by the article date. |
| J0040002 / 外國人投資條例 | 2, 4, 7, 8, 9 | Amendment date 1997-11-19; no banner. |
| B0000001 / 民法 | 258, 354, 356, 357, 358, 359, 360, 361, 364, 365 | Amendment date 2026-08-17; banner explicitly concerns 166-1 (commencement unset) and 1223 (six months after promulgation). Neither is used as a legal basis here. Cited sales/obligations provisions are unaffected. |
| B0000007 / 涉外民事法律適用法 | 20 | Amendment date 2010-05-26; no banner. |
| N0090027 / 雇主聘僱外國人許可及管理辦法 | 4 | Amendment date 2025-12-30; no banner. |
| N0090001 / 就業服務法 | 43 | Amendment date 2025-01-20; no banner. |
| L0060001 / 全民健康保險法 | 9 | Amendment date 2023-06-28; no banner. |
| G0340003 / 所得稅法 | 7, 23, 71, 71-1, 126 | Amendment date 2026-09-11. Banner concerns 43-4 only, with commencement unset. Article 126 was checked for commencement. Article 23 was researched but not used because its accounting-year context should not be casually substituted for a complete individual-tax analysis. |

Non-statute agency pages are identified as agency guidance, not a court decision or an independently checked tax-treaty article. The tax agreement is discussed only at the level supported by the MOF release; no treaty article number or preferential rate is quoted.

## 873 — Czech company, subsidiary, branch or representative office

File: drafts/cs/873-czech-company-taiwan-subsidiary-branch-office.md

Reader and trigger: a Czech business preparing a first Taiwan customer contract plus local sales/service operations; it must decide which entity signs, receives payments, hires the technician and handles defects.

Country fit: verified Czech–Taiwan income-tax agreement, effective 12 May 2020 and applicable from 1 January 2021, supports a country-specific tax-planning question. The International Trade Administration's [Czech economic profile dated 21 October 2025](https://www.trade.gov.tw/Files/PageFile/725527/725527vzuh120251022092202.pdf), page 10, lists machine-tool manufacturing and technical services among Czech investment categories in Taiwan. This is dated market-selection evidence, not a claim about 2026 investment totals. A small sales/service presence and first customer contract remain editorial audience hypotheses, not measured search demand or the firm's experience.

Overlap and angle: existing shared 001/004 cover entity setup broadly, with Korean tax material. This draft excludes those links and Korean assumptions, narrows the decision to customer contracts and a service technician, includes the Czech agreement's actual status, and separates subsidiary investment approval from branch registration. It uses the one-member structure from 656 without importing its detailed director-appointment questions. The shareholder-records source 507 informed the request for clear ownership and signing records; inspection thresholds are outside this draft.

### Claim → source ledger

| Claim in draft | Official source | Chinese text checked / evidence |
|---|---|---|
| Taiwan company is a distinct juristic person | [Company Act 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=1) | 「依照本法組織、登記、成立之社團法人」 |
| A limited company may have one shareholder | [Company Act 98](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=98) | 「有限公司由一人以上股東所組成。」 Foreign-investment conditions remain separate. |
| Contribution-limited liability and serious abuse exception | [Company Act 99](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=99) | 「各股東對於公司之責任，除第二項規定外，以其出資額為限。」 / 「股東濫用公司之法人地位，致公司負擔特定債務且清償顯有困難，其情節重大而有必要者」 |
| Branch registration before doing business in foreign company's name | [Company Act 371](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=371) | 「非經辦理分公司登記，不得以外國公司名義在中華民國境內經營業務」 No criminal penalty is imported. |
| Branch operating funds and responsible representative | [Company Act 372](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=372) | 「應專撥其營業所用之資金，並指定代表為在中華民國境內之負責人。」 |
| Representative-office registration | [Company Act 386](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=386) | 「派其代表人在中華民國境內設置辦事處者，應申請主管機關登記。」 |
| Branch liabilities belong to the foreign company; representative office cannot sell goods or provide services for profit | [Official Taiwan Gold Card entity guide](https://goldcard.nat.gov.tw/en/why-taiwan/foreign-startups-in-taiwan-3-options-for-foreign-corporate-entities-to-set-up-companies-in-taiwan/) | English government-hosted guidance, not a Chinese statute excerpt: “A representative office, however, is not permitted to engage in profit-seeking activities”. Read the separate-personality and parent-liability discussion as well. No processing-time estimate or categorical tax rate imported. |
| Subsidiary investment plan and later changes require approval | [Foreign Investment Statute 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=8) | 「應填具投資申請書，檢附投資計畫及有關證件，向主管機關申請核准。投資計畫變更時，亦同。」 |
| Restricted sectors require sector permission; prohibited sectors excluded | [Foreign Investment Statute 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=7) | 「應取得目的事業主管機關之許可或同意」; first paragraph sets prohibited activities. No claim that every Czech business is eligible. |
| Approved contribution deadline, reporting, verification and extension before expiry | [Foreign Investment Statute 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=9) | 「於核定期限內全部到達」 / 「應於期限屆滿前，申請主管機關核准延展」 / 「應向主管機關申請審定投資額」 |
| Limited-company capital fully paid, no instalments | [Company Act 100](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=100) | 「公司資本總額，應由各股東全部繳足，不得分期繳款」 |
| CPA capital verification; filing at registration application or within 30 days after registration | [Company Act 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=7) | 「應經會計師查核簽證」 / 「於申請設立登記時或設立登記後三十日內」 |
| Required sector authorization precedes company registration application | [Company Act 17](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=17) | 「於領得許可文件後，方得申請公司登記。」 |
| Formation itself is not work authorization; statutory exceptions preserved | [Employment Service Act 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | 「除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。」 |
| Czech agreement dates, qualifying residents, income category and PE relevance | [MOF release](https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=03298f7eb86e408898fc615204d08404) | 「於109年5月12日生效」 / 「自110年1月1日實施」 / 「符合我國或捷克各自稅法規定之居住者」. Read MOF's income-category and PE table; no Czech domestic-law advice or guaranteed relief. |

### Opening deletion test

Paragraph 1, sentence 1 is kept: it identifies the customer's potential contractual counterparty. Sentence 2 is kept: it ties the choice to the sales/service contract and identifies quotation, payment, hiring and complaint functions. Paragraph 2, sentence 1 is kept for the ownership/signature documents; sentence 2 adds indirect owners; sentence 3 explains why the office label cannot identify liability or bank authority.

Cut “Rozhodující jsou konkrétní osoby a společnosti.” because it supplied no fact beyond the preceding document request. Replaced it with “Zachyťte i nepřímé vlastníky.” Outside the opening, removed “Rozpočet projektu proto nenahrazuje rozbor odpovědnosti.” and substituted a specific prompt to identify guarantees.

### Comparison with the three Czech samples

| Sample | Opening, headings and ending seen | What 873 changes |
|---|---|---|
| 008 | Lawyer introduction and announcement of explanation; fragmented lines, a comparison table and case narrative; repeated instructions to protect rights | Opens with the identity of the seller; uses one operating-model comparison, four issue-specific headings, and ends with identifying the contracting party and signatory. No practice story. |
| 014 | Long definition, four preview questions, numbered sections 1–11; generic limitation paragraph and byline | No definition-led preamble or numbered checklist. Funding and management are explained in connected prose; the end concerns the first customer contract. |
| 016 | Death triggers a list of separate legal processes; eleven numbered headings; long disclaimer and author footer | One commercial decision sets the scope. No catalogue of every company-law issue, concluding recap or author footer. |

Dropped or bounded statements: no universal minimum-capital amount; no automatic manager permit or ARC; no incorporation timetable; no Czech tax rate, automatic treaty relief, personal credentials or legal-review claim. Do not apply the subsidiary approval paragraph to every branch: the official practical guide describes a different registration route. The work and residence consequences of a particular manager remain individual questions.

Count: 692 main-text words; 5,070 characters including normalized spaces; 4,379 excluding spaces. Full Markdown file: 985 whitespace words / 9,783 Unicode characters. Main-text counting excludes YAML and the Sources section, retains headings and table text, and removes Markdown link targets.

## 874 — Czech working holiday and the six-month work ceiling

File: drafts/cs/874-czech-working-holiday-taiwan-work-limits.md

Reader and trigger: a Czech citizen considering a working holiday, comparing an employer's proposed dates with age eligibility, permissible work, insurance and departure requirements.

Country fit: verified Czech-specific age range 18–26 inclusive at application, six-month employment ceiling, and the Czech-specific BOCA application page. These materially differ from the French structural article. No assertion about Czech participant numbers, typical occupations or search volumes is made.

Overlap and angle: existing 008 and 014 address general employment issues; neither answers Czech working-holiday eligibility. The internal link to 014 is limited to contractual commitments and early departure. The French source supplies the distinction between visitor status, work authorization, health cover and tax; its French/Belgian/Canadian eligibility rules and unrestricted-work implications are not reused.

### Claim → source ledger

| Claim in draft | Official source | Chinese text checked / evidence |
|---|---|---|
| Age 18–26 inclusive at application, first participation, holiday primary, no accompanying dependants under this route | [BOCA Czech conditions](https://www.boca.gov.tw/cp-388-56-9c5e7-1.html) | 「申請時年齡介於18歲(含)至26歲(含)。」; read the remaining eligibility items, including prior participation and accompaniment. Not a claim that married applicants are excluded. |
| Personal application in Czechia, application papers, travel/funding evidence, criminal record, health/hospitalization insurance and possible additional requirements/interview | [BOCA Czech conditions](https://www.boca.gov.tw/cp-388-56-9c5e7-1.html) | 「由本人向駐捷克代表處提出申請。」 / 「停留臺灣期間之醫療及全額住院保險。」 Document list checked in full. No fixed financial amount or application quota claimed. |
| Employment maximum six months; separate study/training maximum six months | [MOFA country table](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6428) and [BOCA](https://www.boca.gov.tw/cp-388-56-9c5e7-1.html) | BOCA: 「工作、就學或受訓期間不得超過6個月。」 MOFA English Czech row separately identifies employment and study/training. It is not a six-month allowance renewed with each employer. No invented rule for overlapping shifts or aggregation of study with work. |
| WH visa deemed a work permit, maximum one year; no separate employer application for covered work | [Employment-permission regulations 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=4) | 「外國人據以辦理之入國簽證，視為工作許可。」 / 「最長為一年。」 International agreement and non-work-primary context retained. Czech six-month rule remains binding. |
| Professional/technical qualifications remain applicable | [BOCA Czech conditions](https://www.boca.gov.tw/cp-388-56-9c5e7-1.html) | 「應符合中華民國相關資格認定及執業證照登記等法令。」 |
| Czech WH status does not itself grant NHI enrollment; residence document required under the cited provision | [MOFA FAQs](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6440); [NHI Act 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=L0060001&flno=9) | 「在臺灣地區領有居留證明文件，並符合下列各款資格之一者」. MOFA's English NHI answer expressly lists Czech Republic among ineligible WH nationalities. No claim that workplace insurance equals NHI. |
| Visa valid a year from issuance; stay 180 days, extension application in last 15 days, extension up to 180 days, overall year from first entry | [BOCA Czech conditions](https://www.boca.gov.tw/cp-388-56-9c5e7-1.html) | Read 「自核發日起算1年」, 「屆滿前15日內」 and the separate first-entry total-stay condition. Issuance and entry dates not conflated. |
| No in-country change to another visa purpose under Czech WH route | [MOFA FAQs](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6440); [BOCA](https://www.boca.gov.tw/cp-388-56-9c5e7-1.html) | 「入境後不得在中華民國境內申請改換其他事由之簽證。」 No assertion that a future ordinary work application will succeed. |
| 183 days in a single tax year for the no-Taiwan-domicile resident test | [Income Tax Act 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=7) | 「在中華民國境內無住所，而於一課稅年度內在中華民國境內居留合計滿一百八十三天者。」 |
| Ordinary May 1–31 return period; statutory exceptions require assessment; refund claim requires filing | [Income Tax Act 71](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=71) | 「每年五月一日起至五月三十一日止」 / 「但申請退還扣繳稅款…仍應辦理結算申報。」 Not a promise that every low-income WH worker can omit a return. |
| Resident who abandons Taiwan domicile/residence and departs during year files and pays before departure; continuing resident spouse exception | [Income Tax Act 71-1(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=71-1) | 「於年度中廢止中華民國境內之住所或居所離境者，應於離境前就該年度之所得辦理結算申報納稅。」 / 「應由其配偶依第七十一條規定，合併辦理結算申報納稅。」 |

### Opening deletion test

Kept the first sentence for the Czech maximum age and its application-date test; the second supplies the lower age. Paragraph 2 gives the six-month employment ceiling, its consequence for a year-long offer, and the fact that changing employer does not restart it. Each sentence answers a distinct planning question.

Cut “Při plánování rozpočtu se k věku přidává druhé omezení.” because it merely announced the next fact. Removed the duplicated upper-age statement by placing the application-date condition in the first sentence and making the second only the lower bound. The opening now differs both from the question in 873 and the marked scenario in 875.

### Comparison with the three Czech samples

| Sample | Opening, headings and ending seen | What 874 changes |
|---|---|---|
| 008 | Lawyer introduction, comparative employment narrative, repeated warning ending | Starts with the Czech age limit. No named worker or claim about an employer's motives; ends with two concrete calendar entries. |
| 014 | Definition, four-item question preview, many numbered headings and a general limitation ending | Uses an actual contract-duration question in the body, not an article outline. Links to 014 instead of copying its detailed training-repayment analysis. |
| 016 | Broad process-separation introduction, eleven headings, legal disclaimer/byline ending | Organizes four sections around application, work, health cover and the stay/tax timetable. Keeps the final sentence about permitted work and stay dates. |

Dropped or bounded statements: no assumption that Czech age eligibility extends to 30 or 35; no six-month entitlement for each employer; no statement that the WH work permission allows a year of Czech employment; no exact available quota, unverified euro balance, guaranteed approval or in-country conversion route. No current minimum-wage figures, flat withholding rates, Czech tax result, driving-license recognition or automatic ARC. A precise accounting rule for overlapping/irregular jobs was not verified and is left for confirmation. No specific post-WH route is promised.

Count: 760 main-text words; 5,255 characters including normalized spaces; 4,496 excluding spaces. Full Markdown file: 1,062 whitespace words / 8,917 Unicode characters.

## 875 — Machine acceptance in a Czech plant

File: drafts/cs/875-czech-buyer-taiwan-defective-machine-claim.md

Reader and trigger: a Czech manufacturer discovers a machining-tolerance failure and the Taiwanese seller proposes remote controller changes before the evidence is preserved.

Country fit: the International Trade Administration's [Czech economic profile dated 21 October 2025](https://www.trade.gov.tw/Files/PageFile/725527/725527vzuh120251022092202.pdf), page 6, identifies machinery and machine tools among Czech industries and describes metal-cutting and forming equipment. This supports the industrial reader choice; it does not establish Taiwanese supplier dominance or measured demand for legal advice. The particular Czech buyer and failed test remain editorial hypotheses. No trade statistics, client story or actual factory incident is asserted in the article. Its opening marks the scenario “modelový příklad”. Czech relevance is the receiving plant, acceptance records, local inspection and communications to the Taiwanese contractual seller.

Overlap and angle: existing 018 addresses semiconductor market entry rather than remedies for defective machinery; the existing general company columns do not cover first repair, sample preservation and the separate remedy deadline. The legal structure follows the supplied reviewed sales articles, but the factual sequence is a machine's acceptance test and remote software intervention, not the German 8D report or Spanish warehouse lot.

### Claim → source ledger

| Claim in draft | Official source | Chinese text checked |
|---|---|---|
| Party choice; closest relationship absent valid express choice | [Choice-of-law Act 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) | 「依當事人意思定其應適用之法律」 / 「當事人無明示之意思或其明示之意思依所定應適用之法律無效時，依關係最切之法律。」 Taiwanese address alone not sufficient. |
| Defect/guaranteed quality at risk transfer; insignificant reduction excluded | [Civil Code 354](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354) | 「危險移轉於買受人時」 / 「但減少之程度，無關重要者，不得視為瑕疵。」 / 「具有其所保證之品質。」 |
| Prompt customary inspection and immediate notice; latent defect notice on later discovery | [Civil Code 356](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356) | 「依通常程序從速檢查」 / 「應即通知出賣人」 / 「不能即知之瑕疵，至日後發見者，應即通知出賣人」. Deemed acceptance consequence retained. |
| Intentional nondisclosure excludes preceding notice rule | [Civil Code 357](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=357) | 「出賣人故意不告知瑕疵於買受人者，不適用之。」 |
| Temporary custody for rejected goods sent from elsewhere when seller has no receiving-place agent; prompt suitable proof or presumed defect-free receipt | [Civil Code 358](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=358) | 「如出賣人於受領地無代理人，買受人有暫為保管之責。」 / 「推定於受領時為無瑕疵。」 No industrial scrapping permission inferred from perishables provisions. |
| Rescission or price reduction when warranty liability established; manifest unfairness limits to reduction | [Civil Code 359](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=359) | 「買受人得解除其契約或請求減少其價金。」 / 「解除契約顯失公平者，買受人僅得請求減少價金。」 |
| Replacement right for goods designated only by kind | [Civil Code 364](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=364) | 「買賣之物，僅指定種類者」 / 「即時請求另行交付無瑕疵之物。」 Not extended to every individual machine. |
| Nonperformance damages for missing guaranteed qualities or intentional nondisclosure | [Civil Code 360](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=360) | 「缺少出賣人所保證之品質」 / 「請求不履行之損害賠償；出賣人故意不告知物之瑕疵者亦同。」 No automatic reimbursement of all downtime. |
| Six months after notice and five years after delivery; intentional concealment removes six-month rule only | [Civil Code 365](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=365) | 「為通知後六個月間不行使或自物之交付時起經過五年而消滅。」 / 「前項關於六個月期間之規定…不適用之。」 |
| Rescission exercised by declaration to counterparty | [Civil Code 258](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=258) | 「解除權之行使，應向他方當事人以意思表示為之。」 |
| Seller may set a reasonable rescission-decision period; nonexercise loses right | [Civil Code 361](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=361) | 「出賣人得定相當期限」 / 「買受人於前項期限內不解除契約者，喪失其解除權。」 May/must distinction preserved. |

### Opening deletion test

Kept paragraph 1 sentence 1 because it supplies the acceptance failure, Czech buyer, proposed remote intervention and hypothetical label. Sentence 2 identifies exactly what should be preserved; sentence 3 explains the reproducibility problem. Paragraph 2's first sentence provides the choice-of-law rule, the second limits the discussion to Taiwan-governed sales, and the third preserves the possible mixed design/installation contract classification.

Cut “Právní postup začíná smlouvou.” because the following sourced choice-of-law sentence already does that work. No hypothetical label, contract-type qualification or evidence instruction was deleted.

### Comparison with the three Czech samples

| Sample | Opening, headings and ending seen | What 875 changes |
|---|---|---|
| 008 | Author-led introduction and purported client case, followed by broad protective commands | Uses one clearly fictional machine test, no personal names, and practical preservation of the original settings and specimen. |
| 014 | Abstract definition, preview list and extensive numbered doctrinal divisions | Starts at the technician's proposed intervention. Headings move through reproducibility, notice, physical repair and the expiry rule; no preview checklist. |
| 016 | Multiple family proceedings introduced together and generic legal disclaimer at end | Scope is one sales dispute. Ends by returning to the original test data and labelled workpiece, not by summarizing remedies. |

Dropped or bounded statements: no general Czech-law warranty, consumer remedy, EU import/safety conclusion, fixed seven-/fourteen-/thirty-day notification period, guaranteed machine replacement, automatic lost-profit award, or universal six-month limitation period. No claim that repair talks suspend time. A separate incomplete-performance theory under article 227 was not needed and was not imported. No unverified court decision or assertion about recognizing Czech judgments.

Count: 718 main-text words; 5,297 characters including normalized spaces; 4,580 excluding spaces. Full Markdown file: 998 whitespace words / 9,157 Unicode characters.

## Sentence-variety check and section 5 self-audit

Required shared-tool command was executed on all three paths:

```text
python3 -B /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check drafts/cs/873-czech-company-taiwan-subsidiary-branch-office.md drafts/cs/874-czech-working-holiday-taiwan-work-limits.md drafts/cs/875-czech-buyer-taiwan-defective-machine-claim.md
```

Result: exit 2, `ERROR measurement unavailable: cannot infer language ...; supply --lang`. Inspection of the tool's supported locale list confirms that cs is not supported. This is not a PASS and not a measured zero-FAIL result. The tool was not edited, Czech was not relabelled as English/French, and no unsupported-locale result was hidden.

Supplementary Czech-aware measurement was run in an ephemeral Python process. It strips frontmatter and the Sources section, counts prose only for rhythm (not headings or tables), replaces Markdown links with their labels, splits sentences at terminal punctuation followed by a capital Czech letter or digit, and counts Unicode word tokens, retaining internal hyphens/apostrophes. Sentence splits were printed and checked; numbered dates and the email address were not split. It is an author diagnostic, not an extension of the official checker or a native-speaker evaluation.

| Article | Prose sentences / paragraphs | Length CV | Short sentences ≤8 words | Similar-length run3 share | Largest repeated paragraph opener | Adjacent identical sentence opener | Prose paragraphs without external citations |
|---|---|---|---|---|---|---|---|
| 873 | 47 / 16 | 0.450746 | 12 / 47 = 25.53% | 2.22% | 2 | 0 | 6 |
| 874 | 55 / 17 | 0.458841 | 12 / 55 = 21.82% | 5.66% | 2 | 0 | 6 |
| 875 | 56 / 17 | 0.460807 | 18 / 56 = 32.14% | 1.85% | 2 | 0 | 8 |

The supplemental run3 test uses max(lengths) ≤ 1.25 × min(lengths) for a consecutive triple. This is explicitly a diagnostic definition; it does not claim perfect equivalence to the official multilingual implementation. Citation-ending and contrast checks were read manually. Sentence-ending parenthetical statutory citations are 1/47, 1/55 and 1/56 respectively; the hypothetical label is not a statutory citation. No rhetorical “not X but Y” rebuttal template is used. The longest sentence in 874 is 34 Unicode words, one such sentence in that paragraph, followed immediately by a seven-word sentence. The other two have no sentence over 32 words by this diagnostic.

Section 5 items 2–9:

- Openings differ: 873 a reader's contracting-party question; 874 one Czech age number; 875 a marked hypothetical machine test. Each type is one third of the batch; scene-based openings are one third.
- Each draft has more than two short sentences. Related clauses were combined where separate equal-length sentences produced monotonous rhythm, without removing legal conditions. Two vague short sentences were removed rather than retained merely to improve statistics.
- Paragraph openers were read vertically; none occurs three times. In 875 the repeated “Při” opener was reduced by rewriting the remedy paragraph.
- No sequence of three claim/citation/exception paragraphs. Each article includes evidence/planning paragraphs without legal assertions or citations. Citations remain on consequential legal statements.
- No invented reader misconception is rebutted. Legal exceptions, including intentional concealment and the spouse rule, are preserved rather than treated as stylistic contrasts to delete.
- Endings are specific and distinct: 873 the contract's supplier/signatory, 874 the two calendar dates, 875 the original workpiece/test data. One restrained, tailored contact paragraph precedes each; no closing recap.
- Czech professional register throughout. No bold, H1, author footer, invented lawyer narration, imperative checklist heading or native/lawyer-review claim.
- Final source/FAQ comparison preserves mandatory versus discretionary language, conjunctions, starting dates, the six-month/five-year distinction, Czech six-month employment ceiling, 18–26 eligibility, visa issuance versus first-entry dates, and the hypothetical label.

Supplementary author checks found no remaining section 5 issue under the documented Czech measurements. The unsupported official checker remains an explicit verification limitation for the batch reviewer.

## File, metadata, link and source checks

Each file has the required 16 frontmatter fields in order, three FAQs, the exact Czech category, `audience: ["cs"]`, internal `author: "legal-ai-assistant"`, publication/modification date 2026-10-24 and five H2s including Zdroje. Title / SEO / summary lengths: 873 = 60 / 50 / 139; 874 = 55 / 48 / 156; 875 = 59 / 45 / 144 characters. Each uses a different allowed image: I08, I11 and I05. Alt text and the prescribed caption are translated without additional depicted objects.

Internal links: 873 → new 875 slug; 874 → existing `taiwan-mandatory-employment-period` (014); 875 → new 873 slug. The brief expressly permits links to own new slugs. No 001/004/005/006/010 link is used. Every external body source is present in the Sources section; each law.moj pcode/article pair is in the checked sets above. Contacts are the authorized email and /cs/contact only. Consultation languages and conflict-check/first-email boundaries appear in each draft.

No YAML package was installed. The deliberately simple YAML subset is checked by its exact field order, quoted scalar syntax, JSON-compatible arrays, three q/a pairs and frontmatter delimiters; this is not described as a full application build.

Count reproduction: split after closing YAML delimiter and before `## Zdroje`; replace `[label](target)` by label; remove heading markers and table separator rows; replace table pipes by spaces; collapse whitespace; words = `len(text.split())`, characters = Unicode `len(text)`. These are the counts reported to the requester. Full-file counts above include YAML, links and line breaks for auditability.

Final draft SHA-256 values:

- 873: `44e8c84454835ef62706eeaaa209b8f07c816c2e126c124ec562c91efb81cfc0`
- 874: `e80c4bd0ef8ea6adec158204afccff6dd2c9ae64a73f6883eb68adba4d069ab4`
- 875: `df3f30121dab13d2706081e897b73002008e811f53113cb84f4a6dc1fe869019`
