# Slovak author evidence — columns 876–878

Research and draft date: 24 October 2026. Assignment: `sk`, 876 P-WHV, 877 B-INV, 878 B-SETUP. These are local drafts, not published articles. No human native-speaker or lawyer review is claimed.

## Scope and reading record

Read in full: `briefs/BRIEF.md`, `briefs/ASSIGNMENTS.md`, `briefs/IMAGE-MENU.md`, `repo/docs/columns/EDITORIAL-VOICE.md`, `repo/docs/columns/FRONTMATTER.md`, `rules/SENTENCE-VARIETY-RULE.md`, `rules/LESSONS.md`, and `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`. The two rule files are byte-identical to the required copies under `/Users/son7/tseng-lanes-shared/`; their full text was read. The old voice pointer refers to `/Users/son7/agent-library/knowledge/editorial-voice.md`, which is absent on this machine. The supplied repository house style is available and was used in full. The current user decision retiring automatic Fable orchestration takes precedence over historical references in those documents.

Same-locale full-text comparators:

- `repo/src/content/columns-sk/008-taiwan-labor-severance-law.md` — display date 13 September 2025, lastmod 7 October 2026.
- `repo/src/content/columns-sk/009-taiwan-voluntary-resignation-severance.md` — display date 13 September 2025, lastmod 10 September 2026.
- `repo/src/content/columns-sk/013-taiwan-company-establishment-advanced-1.md` — display date 13 September 2025, lastmod 10 September 2026.

These are three existing comparison articles selected for relevant employment/company vocabulary, not a claim to have identified the latest three publication dates. Their exact category strings are used: `Právne informácie o Taiwane` and `Zakladanie spoločností na Taiwane`. Date and reading-time patterns are `24. októbra 2026` and `5 min čítania`.

| Comparator | Opening, headings and ending actually observed | Pattern avoided in this trio |
|---|---|---|
| SK 008, dates above | Lawyer introduction and employee narrative; one body H1 followed by fragmented short paragraphs rather than issue H2s; ends with a general reminder to protect one's rights and related-service links. | None of the new articles invents a lawyer's client history. Each uses connected paragraphs, article-specific H2s and a final document/deadline task. |
| SK 009, dates above | Refers back to another article and uses a Korea comparison; one body H1 and a numbered exception list; closes with general statements about timing and the advantage of preparing early, followed by service links. | All three stand alone for Slovak readers. Article 877 identifies the actual due-date evidence rather than ending with a generic warning that timing matters. |
| SK 013, dates above | General introduction to recent formations and a banking narrative; one body H1 and numbered questions; ends with a lease-check instruction, a consultation-language notice and related links. | Article 878 narrows formation to selling parts and providing service, uses three thematic H2s and ends on the proposed order. Each article places the required contact paragraph before its own factual closing. |

Read all named structural source columns for the assigned topics: FR 654; EN 354, FR 674, ES 689, HI 669, TH 663; EN 004, EN 001, ES 656, EN 507. Their legal structure was rechecked. Their older public bylines, office addresses, H1 bodies, Korean treaty assumptions and requests for complete initial documents were not imported. The supplied brief governs this batch.

Country ledger: read its source-register/method/version-limit material and all seven Slovakia rows. Used only affirmative checked working-holiday and tax-agreement facts. Driving-licence recognition is explicitly unverified and unused. No land, marriage or migrant-source finding was needed. Nationality-specific conditions were independently checked on BOCA/MOFA and the treaty status on MOF.

The `tseng-law-editorial` skill was applied to source checking and independent AI review within this author assignment. A read-only research agent checked Slovak government-source facts and returned findings without creating files. All manuscript and work-note writes are confined to the three `drafts/sk/` manuscripts and this note. No git command, installation or publication was performed.

Tool incident: the independent locale reviewer mistakenly invoked `tools/law.py --help`, which treats every first argument as a pcode. That invocation produced `html/--help.html` (69,878 bytes; timestamp matched the invocation). The reviewer removed that file and confirmed it absent afterward, but had not checked its prior absence. This is a disclosed temporary out-of-scope cache write, not a manuscript change; no other files were removed or repaired. Subsequent review used only known existing pcode caches and official web pages.

## Statute verification and commencement

`tools/law.py` was read before execution: it normally caches in the shared `html/` directory. Every pcode used below already had a cache larger than 5,000 bytes, so these invocations read existing official-text files and did not create or replace shared cache files. Titles, text and status banners were checked in the output; selected official pages and amendment histories were additionally opened through the web tool.

Commands executed by the author:

```text
python3 tools/law.py N0090027 4
python3 tools/law.py G0340003 7 126
python3 tools/law.py L0060001 9
python3 tools/law.py B0000007 20 36
python3 tools/law.py B0000001 127 128 129 130 132 144
python3 tools/law.py B0010001 508 509 511 515 516 519 521 522 523 526
python3 tools/law.py J0080001 1 7 98 99 371 372 386 449
python3 tools/law.py J0080001 3 100 380
python3 tools/law.py J0040002 2 4 7 8 9
python3 tools/law.py N0090001 43
```

Printed titles matched the intended laws: 雇主聘僱外國人許可及管理辦法; 所得稅法; 全民健康保險法; 涉外民事法律適用法; 民法; 民事訴訟法; 公司法; 外國人投資條例; 就業服務法. Some additional provisions were read for context and are not cited in the drafts.

- Civil Code output printed `!!! 部分條文尚未生效`. The [live amendment history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001) identifies article 166-1 with commencement undetermined and the amendment of article 1223 promulgated 17 August 2026 with commencement six months later. Those provisions are not relied on. The cited prescription provisions are unaffected; draft 877 states the legal cut-off date.
- Income Tax Act output printed the same banner. The [live current text](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0340003) and [history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=G0340003) identify article 43-4 as pending. The September 2026 amendment concerns articles 17 and 126, not article 7. Article 7's residency rule was checked against the live single-article page by the research agent. Draft 876 expressly dates the legal state in the Sources section; the date was separated from the tax sentence to avoid stacking date, pinpoint citation and residency threshold.
- Company Act output had no pending banner. [Its live history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0080001) records the December 2025 addition of article 387-1 and amendment of article 449, effective six months after promulgation. The provisions used here are current as of the research date.
- The other queried statutes showed no pending banner in `law.py` output.

## 876 — Slovak working holiday

File: `drafts/sk/876-slovak-working-holiday-taiwan-six-month-work-limit.md`.

Reader and trigger: a Slovak applicant or participant has a job offer that may exceed the remaining permitted work period, and is planning travel, insurance and departure around it.

Country fit: verified programme for Slovak nationals, age 18–35 at application and annual incoming quota 100. The decisive local distinction is six months of employment in total, not a fresh allowance at each employer. The longer possible stay makes the work/stay distinction useful. Interest in this exact legal question is an editorial hypothesis, not measured demand. The research agent's query `Taiwan working holiday Slováci víza 35 rokov práca` surfaced BOCA and Slovak public information, without establishing search volumes.

Overlap/new angle: SK 008/009 discuss severance and employment termination; they do not explain Slovakia's work-duration ceiling, visa dates or visitor-status insurance gap. FR 654 supplies the work-permit/visitor/insurance/tax distinction, but its French, Belgian and Canadian conditions were replaced with Slovak sources. The internal link to SK 009 is thematic; none of its Korea-oriented comparisons or unverified factual claims is repeated.

### Claim-to-source ledger

| Claim in draft | Source checked | Original excerpt and scope |
|---|---|---|
| Age 18–35; quota 100 | [MOFA partner table](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6426) and [BOCA English](https://www.boca.gov.tw/cp-153-382-30a10-2.html) | Table: `Slovakia ... 100 ... 18 - 35 (Before 36th birthday)`. BOCA: `between 18 and 35 years of age at the time of application`. Quota is not remaining availability. |
| Total employment cap six months | [MOFA country limits](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6428), [BOCA Chinese](https://www.boca.gov.tw/cp-388-52-4003f-1.html) | `May engage in temporary employment for total duration of up to six months`; `在臺停留期間得從事臨時性工作，且工作期間不得超過6個月。` Change of employer does not reset a total limit. |
| Visa counts as work permit; maximum one year for this deemed authorization | [N0090027 article 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=4) | `非以入國工作為主要目的之國際書面協定，其內容載有同意外國人工作、人數、居（停）留期限等者，外國人據以辦理之入國簽證，視為工作許可。` / `前項視為工作許可之期限，最長為一年。` Not unlimited employment under the particular bilateral programme. |
| Holiday primary; professional qualifications; no in-country switch to another purpose | [BOCA Chinese](https://www.boca.gov.tw/cp-388-52-4003f-1.html) | `工作為其附帶目的而非主要目的`; `從事專門性或技術性工作，應符合中華民國相關資格認定及執業證照登記等法令。`; `入境後不得在中華民國境內申請改換其他事由之簽證。` No promise that another status will be granted abroad. |
| One year visa validity from issue; 180-day stay and possible extension during final 15 days; one-year ceiling from first entry | [BOCA English](https://www.boca.gov.tw/cp-153-382-30a10-2.html), [Chinese](https://www.boca.gov.tw/cp-388-52-4003f-1.html) | `自核發日起算1年`; `每次入境得停留最長180天，屆滿前15日內 ... 申請延長，最多可再延長180天。`; `自持憑該簽證首次入境日起算總停留期限最長不超過1年`. Extension is an application, not automatic. |
| No re-entry on expired visa after departure | [BOCA Chinese](https://www.boca.gov.tw/cp-388-52-4003f-1.html) | `倘於簽證效期屆滿日期後離境，因該簽證失效不得再憑以入境`. Distinguish visa expiry from maximum time after first entry. |
| Personal application Bratislava, no previous participation, passport validity and basic supporting documents | [BOCA English](https://www.boca.gov.tw/cp-153-382-30a10-2.html) | `valid for at least eighteen months from the day the visa is issued`; `submit their applications in person`; original lists funds, tickets/qualifying proof and certificate of good conduct. The draft is not an exhaustive application checklist. |
| Medical/full hospitalization insurance throughout stay | [BOCA Chinese](https://www.boca.gov.tw/cp-388-52-4003f-1.html) | `停留臺灣期間之醫療及全額住院保險。` English additionally describes medical/travel insurance. No invented euro threshold or policy benefit. |
| Slovak WHV alone gives no NHI entry; residence document requirement | [MOFA NHI FAQ](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6440), [L0060001 article 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=L0060001&flno=9) | FAQ expressly includes Slovakia among ineligible WHV nationalities. Law: `在臺灣地區領有居留證明文件，並符合下列各款資格之一者` followed by `在臺居留滿六個月` OR `有一定雇主之受僱者` OR qualifying newborn. The residence-document condition is preserved. |
| 183-day residency rule for people without Taiwan domicile | [G0340003 article 7(2)(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=7) | `在中華民國境內無住所，而於一課稅年度內在中華民國境內居留合計滿一百八十三天者。` No claim that this is the only residency route. |
| Calendar year rather than entire trip | [MOF eTax instructions](https://www.etax.nat.gov.tw/etwmain/en/announcement/alien-individual-income-tax/instructions) | `A full year from January 1 to December 31 is a taxable year.` Page has an inconsistent heading (`2024`, dated 2026-04-27); used solely for the stable year/counting explanation, not rates, allowances or filing deadlines. |

### Opening deletion test

1. Final opening: `Slovenský účastník taiwanského programu working holiday môže pracovať celkovo najviac šesť mesiacov.` Kept: gives the operative nationality-specific limit immediately, with the official source linked on the limit.
2. Original separate source-summary sentence (`Taiwanské ministerstvo zahraničných vecí ... súhrnnú dobu ...`) cut on independent review: it repeated the opening. Its link was retained in sentence 1.
3. `Zmena zamestnávateľa limit neobnoví.` Kept: resolves the likely per-employer misconception.
4. Employment-record sentence kept and clarified: `spočítajte aj dĺžku predchádzajúcich zamestnaní` refers to total duration, not the number of jobs.
5. Age sentence kept and recast as `O program môžu žiadať ...`: adds both the age range and application-date trigger without a trailing participle.
6. Quota sentence kept as a separate programme fact with official source.
7. Remaining-places sentence kept to avoid presenting annual quota as current booking availability.

No invented applicant anecdote was added. Article starts with one operative number, not a scenic hypothetical.

Comparison outcome: unlike SK 008's lawyer introduction and fragmented employee story, 876 starts with a sourced limit. Unlike SK 009's backward reference and serial exception list, it is readable on its own and organised by employment, stay dates, insurance and tax. Unlike SK 013's numbered FAQ/personal banking narrative, it uses connected prose. Its last substantive sentence calls for the work calendar and permitted-stay date, not a generic rights warning or promotional footer.

Dropped/unverified: exact euro funds threshold (mission PDF inaccessible); accompanying-family exception (live BOCA and mission-PDF excerpt do not match); available remaining quota; processing-time guarantee; remote-work permission; promised conversion to a professional visa; minimum-wage/current withholding rates; specific private insurance coverage. The BOCA family rule is not misrepresented as fully resolved by omission: the article explicitly directs applicants to the full current mission list.

## 877 — Slovak exporter, unpaid technical delivery

File: `drafts/sk/877-slovak-exporter-taiwan-unpaid-invoice-recovery.md`.

Reader and trigger: a Slovak supplier has delivered equipment or components but the Taiwan buyer disputes acceptance or completion of installation and withholds payment.

Country fit: this is a labelled editorial hypothesis about a Slovak supplier's transaction, not a claim about prevalence. Taiwan MOFA's [7 June 2023 announcement](https://en.mofa.gov.tw/News_Content.aspx?n=1329&s=114830&sms=272) records bilateral cooperation involving technical services, power devices and electric-vehicle modules. It supports choosing technical supply/acceptance evidence as context, not a statistic about unpaid invoices or current exports. Query `Taiwan nezaplatená faktúra slovenská firma` produced mostly general trade/tax material in the research agent's limited observation; no search volume is inferred. Euro invoicing is conditional, not assumed.

Overlap/new angle: the old SK catalogue has no dedicated invoice-recovery column. EN 354 and the four other collection sources supply the conflict-of-laws, limitation, payment-order and attachment structure. This version concentrates on separating delivery, installation/testing and acceptance milestones, with particular attention to the seller's unperformed counter-obligation under article 509. It does not replicate the French unsold-stock/returns scenario or the English invented Oregon case. Its internal link is to this batch's actual 878 slug.

### Claim-to-source ledger

| Claim | Source checked | Chinese text excerpt and retained conditions |
|---|---|---|
| Governing law and limitation follow the legal relationship | [B0000007 article 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20), [36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=36) | `依當事人意思定其應適用之法律`; absent/invalid express choice `依關係最切之法律`; limitation `依該請求權所由發生之法律關係所應適用之法律`. No inference that Taiwan buyer means Taiwan substantive law. |
| Two-year prescription for specified goods-price claims if Taiwan law applies | [B0000001 article 127(8)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=127) | `因二年間不行使而消滅` / `商人、製造人、手工業人所供給之商品及產物之代價`. Services are not swept into this item. |
| Start when claim exercisable | [Article 128](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=128) | `消滅時效，自請求權可行使時起算。` Contract milestones and due dates must be established. |
| Debtor may refuse after prescription completed | [Article 144](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=144) | `時效完成後，債務人得拒絕給付。` Does not say that every invoice or underlying obligation simply disappears. |
| Demand, acknowledgment and proceedings; payment-order application equivalent to suit | [Article 129](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=129) | `一、請求。二、承認。三、起訴。` / `依督促程序，聲請發支付命令。` Whether an email acknowledges the particular debt is not assumed. |
| Demand's interruption lost without timely follow-up | [Article 130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130) | `若於請求後六個月內不起訴，視為不中斷。` Read with article 129's equivalent procedural acts. |
| Payment order for fixed money amount, preliminary showing and own performance | [B0010001 article 508](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=508), [511](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=511) | `給付金錢 ... 之一定數量`; `其有對待給付者，已履行之情形。`; `債權人之請求，應釋明之。` Evidence of actual performance remains relevant. |
| Excluded for unperformed counter-obligation, foreign service or public notice | [Article 509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509) | `聲請人應為對待給付尚未履行，或支付命令之送達應於外國為之，或依公示送達為之者，不得行之。` All three alternatives retained; foreign creditor's location is not itself listed. |
| 20-day objection from service, without reasons | [Article 516](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=516) | `於送達後二十日之不變期間內，不附理由 ... 提出異議。` Not measured from issuance. |
| Timely lawful objection affects disputed scope and converts application | [Article 519](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=519) | `於法定期間合法提出異議者 ... 於異議範圍內失其效力 ... 視為起訴或聲請調解。` No suggestion that objection ends collection entirely. |
| No timely lawful objection: enforcement title; debtor can contest existence | [Article 521](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=521) | `未於法定期間合法提出異議者，支付命令得為執行名義。`; `債務人主張支付命令上所載債權不存在而提起確認之訴`. No merits-finality guarantee. |
| Failure to serve within three months and limitation consequence | [Article 515(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=515), [B0000001 article 132](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=132) | `發支付命令後，三個月內不能送達於債務人者，其命令失其效力。`; `支付命令失其效力時，視為不中斷。` Full article 515, including its special correction procedure for an erroneous certificate of finality, was read; draft addresses ordinary non-service and directs prompt procedural assessment. |
| Monetary attachment and enforcement risk | [B0010001 article 522](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=522), [523](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523) | `金錢請求或得易為金錢請求之請求 ... 欲保全強制執行`; `非有日後不能強制執行或甚難執行之虞者，不得為之。` Taiwan-asset context; no suggestion unpaid invoice alone proves risk. |
| Preliminary showing of both claim and attachment reason; possible security | [Article 526](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526) | `請求及假扣押之原因，應釋明之。`; `法院亦得命債權人供擔保後為假扣押。` Security is discretionary and no guaranteed substitute for the statutory grounds. |

### Opening deletion test

1. Different invoice/delivery/commissioning dates: kept because technical acceptance and payment dates are the article's specific trigger.
2. Supplier needs to identify which event triggers payment: kept because it connects those documents with the due-date inquiry.
3. Add acceptance terms and completed-test records: kept as the precise document consequence, not a general instruction to gather evidence.
4. Buyer may accept parts price but dispute installation: kept as a conditional possible dispute, not a purported real client story.
5. Separate objections and contractual items: retained as `Podklady usporiadajte podľa konkrétnych námietok a zmluvných položiek.` Independent review replaced the unnatural instruction to divide the dispute itself with a concrete instruction about its documents.
6. Preserve full email thread, including adverse replies: kept because a promise to pay alone may omit the buyer's reservation.

Comparison outcome: documentary opening rather than SK 008's professional introduction, SK 009's callback, or SK 013's claim of many recent formations. Four issue headings include one actual procedural question, without numbering or a uniform list. Ending asks for evidence of each instalment's enforceability, while 876 ends on a travel/work calendar and 878 on a proposed order. No cloned disclaimer/footer.

Dropped/unverified: Taiwan recognition of Slovak judgments; assumed Slovak limitation period; automatic Taiwan governing law; universal two-year rule for goods-and-services contracts; current court fees; interest rates; guaranteed attachment or collection; claim that every promise to examine accounts acknowledges debt; firm collection experience or recovery statistics.

## 878 — Slovak technical business opening a Taiwan operation

File: `drafts/sk/878-slovak-business-taiwan-subsidiary-branch-office.md`.

Reader and trigger: a Slovak supplier is deciding whether its Taiwan team will only coordinate tests and contacts or will sell spare parts and provide paid local servicing.

Country fit: the same historical [MOFA cooperation announcement](https://en.mofa.gov.tw/News_Content.aspx?n=1329&s=114830&sms=272) supports a technical-service/commercial context. The [MOF agreement list](https://www.mof.gov.tw/singlehtml/191?cntId=63930) confirms a comprehensive Taiwan–Slovakia income-tax agreement in force. These facts support a country-specific formation/tax inquiry without importing the Korean treaty from EN 001/004. Legal-service demand and the particular service-centre scenario remain editorial hypotheses. Query `Taiwan založenie spoločnosti slovenská firma` is only a research lead, not ranking evidence.

Overlap/new angle: SK 001/004/013 already discuss company formation. New article narrows the decision to who contracts, invoices and provides service for a Slovak technical business, adds accurate Slovakia treaty status, separates subsidiary approval from branch procedure, and avoids the old bank anecdotes and promised timelines. EN 507 informed the practical governance/reporting discussion; no unsupported inspection-right claim was imported. Internal link points to 876's own slug for the young founder on WHV.

### Claim-to-source ledger

| Claim | Source checked | Chinese text excerpt or official evidence |
|---|---|---|
| Representative office's legal/liaison scope vs trading subsidiary/branch | [Invest Taiwan comparison](https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01) | Official indexed table: subsidiaries/branches `General trading ... sales and manufacturing`; office `Legal acts and liaison activities`. Direct web opening and curl timed out; same official indexed table was readable. Old statements about foreign-company recognition were not used. |
| Representative-office registration | [J0080001 article 386](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=386) | `未經申請分公司登記而派其代表人在中華民國境內設置辦事處者，應申請主管機關登記。` |
| Branch subordinate to head office; head office retains unsettled debt | [Article 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=3), [380](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=380) | `所稱分公司，為受本公司管轄之分支機構。`; on cancellation of all branches `未了之債務，仍由該外國公司清償之。` Draft states the latter trigger expressly. |
| Registration before foreign company operates in its own name | [Article 371](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=371) | `外國公司非經辦理分公司登記，不得以外國公司名義在中華民國境內經營業務。` No criminal penalty quoted. |
| Branch's allocated operating funds and responsible representative | [Article 372](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=372) | `應專撥其營業所用之資金，並指定代表為在中華民國境內之負責人。` |
| Branch registration and possible sector-specific requirements | [MOEA registration guidance](https://gcis.nat.gov.tw/mainNew/subclassNAction.do?method=getFile&pk=5) | `申請登記須專撥其在中華民國境內營業所用之資金供在臺分公司營運使用，並應受目的事業主管機關對其所營事業最低資本額規定之限制。` No blanket assertion that all branches need or are exempt from prior investment approval. |
| Subsidiary separate entity; single shareholder available for 有限公司 | [Article 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=1), [98](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=98) | `依照本法組織、登記、成立之社團法人`; `有限公司由一人以上股東所組成。` Single shareholder does not override investment restrictions. |
| Limited shareholder liability and serious-abuse exception | [Article 99](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=99) | `除第二項規定外，以其出資額為限。`; `股東濫用公司之法人地位，致公司負擔特定債務且清償顯有困難，其情節重大而有必要者，該股東應負清償之責。` |
| Subsidiary investment application, plan and documents; changes | [J0040002 article 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=8) | `應填具投資申請書，檢附投資計畫及有關證件，向主管機關申請核准。投資計畫變更時，亦同。` No guaranteed total setup time. |
| Prohibited and restricted investment categories | [Article 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=7) | `下列事業禁止投資人投資`; restricted businesses `應取得目的事業主管機關之許可或同意。` |
| Approved contribution deadline, report and verification | [Article 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=9) | `應將所核准之出資於核定期限內全部到達，並將到達情形報請主管機關查核。`; `於實行出資後，應向主管機關申請審定投資額。` Draft asks reader to use actual approval deadline. |
| No general company minimum capital; reasonable costs and special industries | [Invest Taiwan capital guidance](https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus02?lang=eng&menuNum=7&search=InvestmentStatus02) | Official indexed text: `Apart from some select industries, a company can be established as long as the investment is sufficient to cover reasonable expected costs.` Corroborating [MOEA indexed FAQ](https://mnscdn.moea.gov.tw/Mns/dir/home/Home.aspx): `目前公司法已取消最低資本額之規定 ... 惟如果國內公司經營之業務涉及特許行業 ... 有否最低資本額上之限制`. Direct MOEA fetch was 403, not counted as a live successful page. |
| CPA capital certification | [J0080001 article 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=7) | `公司申請設立登記之資本額，應經會計師查核簽證`. No conflation with foreign-investment amount verification. |
| Slovakia comprehensive agreement in force | [MOF list](https://www.mof.gov.tw/singlehtml/191?cntId=63930), live opened | `斯洛伐克 ... 2011/08/10(100年) ... 2011/09/24(100年)`. The latter is entry into force, not an invented income-application date. No treaty article, rate or entitlement is asserted. |
| General work-permit requirement subject to statutory exception | [N0090001 article 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | `除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。` Owning shares is not represented as work authorization. |

### Opening deletion test

1. Question about coordinating tests vs selling parts/invoicing service: kept, because these concrete proposed activities distinguish the relevant structures.
2. Slovak business needs the answer before choosing form: retained after independent review because it places this operational decision before entity selection.
3. Contracting party, payment recipient and service signature: retained and clarified as the company contracting with the customer; the original `zmluvná strana zákazníka` was ambiguous.
4. `Pre malý obchodný tím sa tým otvárajú rozdielne možnosti.` Deleted on independent review: merely announced the next substantive sentence.
5. Official comparison of trading entities vs liaison office: kept with its source.
6. Sales/service plan vs mere contact function: retained after review to connect the official forms comparison to the specific proposed spare-parts/service operation in paragraph 1.

Comparison outcome: question opening targets actual proposed operations, not the generic question list or success anecdote in SK 013. Three unnumbered sections group legal form, capital/approval and Slovakia tax/work questions. Employee dispute narratives from SK 008/009 were not copied. The closing asks the reader to mark seller, payee and service provider on a real proposed order, a different factual ending from the other two drafts.

Dropped/unverified: Korean treaty rates/thresholds; specific Slovakia treaty dividend rates or permanent-establishment tests; automatic tax exemption; universal unrestricted 100% foreign ownership; minimum capital guaranteeing a work permit; bank opening certainty; automatic ARC; incorporation timetable; universal apostille sufficiency; foreign-company recognition procedure from stale guidance; firm success or local-office claims.

## Validation and editorial limits

The exact prescribed checker was run against all three paths:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check drafts/sk/876-slovak-working-holiday-taiwan-six-month-work-limit.md drafts/sk/877-slovak-exporter-taiwan-unpaid-invoice-recovery.md drafts/sk/878-slovak-business-taiwan-subsidiary-branch-office.md
```

It returned exit 2 for each file: `ERROR measurement unavailable: cannot infer language ...; supply --lang`. An explicit retry with `--lang sk` also returned exit 2: `invalid choice: 'sk'`; supported choices are ko, ja, en, zh-hant, th, id, hi, fr, de, it, es, pt, ar and vi. Thus an official measured `FAIL 0` pass cannot be claimed for Slovak. No different language was substituted and the shared checker was not edited. Section 5 is assessed manually, with a separately labelled supplementary sentence-length diagnostic; this is not a validated Slovak metric implementation.

Structural check: exact frontmatter field order, three FAQs per article, permitted topic/audience/author, three distinct menu images, zero bold/H1/public author footer, 3–4 issue H2s plus sources, date line and complete body-to-source-list coverage all confirmed. All internal links resolve to existing Slovak repository files or these assigned new slugs. Titles are 55–57 characters, SEO titles 45–49 and summaries 148–149, within the brief's preferred ranges. Ruby's existing standard-library `YAML.safe_load` successfully parsed all three frontmatter blocks. PyYAML is absent; no package was installed.

### Final counts and versions

Main-text counting convention: exclude YAML and the entire `## Zdroje` section; include issue-heading text, contact paragraph and final factual sentence; replace Markdown links with their displayed labels, remove heading markers and normalize whitespace to one space. Words are whitespace-separated tokens; characters are Unicode characters, not bytes. The complete-Markdown column includes metadata, URLs, source list and line breaks for readers who need the physical file size in characters.

| File | Main words | Main characters with spaces | Main characters without spaces | Complete Markdown characters |
|---|---:|---:|---:|---:|
| `drafts/sk/876-slovak-working-holiday-taiwan-six-month-work-limit.md` | 684 | 4,795 | 4,112 | 8,636 |
| `drafts/sk/877-slovak-exporter-taiwan-unpaid-invoice-recovery.md` | 717 | 5,073 | 4,357 | 10,230 |
| `drafts/sk/878-slovak-business-taiwan-subsidiary-branch-office.md` | 715 | 5,444 | 4,730 | 10,537 |

| Article | Final SHA256 |
|---|---|
| 876 | `4872d651d8e00993758d96ea11288572ded7869abeebedc9b75e7ca3eff8b0d9` |
| 877 | `6ea8b00d34437efa448b92dd3e768ecd245df96300aebd28e8dc18ea545becc1` |
| 878 | `fc52c963e0670f3317f9cd50ebe4b5b65fc1d364fbc298e1df0f21dc29ef624f` |

### Section 5 self-check and supplementary diagnostic

1. Required checker: executed for all three files, with the measurement-unavailable result above. The mandatory automated `FAIL 0` result remains unavailable; neither the independent reviewers nor the author certify it.
2. Openings: 876 concentrates on a nationality-specific work-duration limit; 877 on mismatched delivery/payment documents; 878 on a concrete operational question. No stock hypothetical opener or invented client scene appears.
3. Short sentences: each contains more than two meaningful short sentences. No sentence exceeds 32 whitespace tokens in the supplementary body-only diagnostic. Legal conditions were not removed to shorten sentences.
4. Paragraph starts: maximum repetition is 2/2/1 across 876/877/878. Consecutive sentence-start matches are 0/0/1. The last 876 repair moved the tax topic ahead of its citation, removing a third `Článok` paragraph opening.
5. Citation rhythm: all articles have citation-free practical paragraphs; none repeats three successive claim/citation/exception paragraphs. In 877, article 516 was moved into its sentence so that the subsequent 519/521 references are the only two consecutive sentence-ending parenthetical citations in that paragraph. Inline links and all 34 distinct cited provisions remain present.
6. Contrasts: operational alternatives and legally necessary scope limits remain; no repeated `not X but Y` template or rebuttal of an invented reader claim was added. No article has more than three rhetorical contrast constructions.
7. Endings: work-period calendar and stay expiry (876), evidence that each instalment is due (877), seller/payee/service provider on the proposed order (878). Contact paragraphs precede these endings; there is no copied promotional close.
8. Slovak register is consistent in the independent AI locale review. Korean/Japanese register rules do not apply. No bold, invented first-person lawyer account, body H1, author footer or imperative checklist heading appears.
9. All final repairs preserve numbers, time triggers, exceptions, links and the reader-specific context. The Article 99 repair was a substantive accuracy correction, not merely a stylistic paraphrase.

The following is an author diagnostic, not the prescribed checker and not a validated Slovak segmentation model. It removes metadata, Sources and headings, replaces link markup with labels, splits sentences after `.`, `!` or `?` followed by whitespace and an uppercase Slovak letter, counts whitespace tokens, and uses population standard deviation/mean for CV. Thus abbreviation handling and thresholds are not certified. Its CV values are below 0.45; they do not establish compliance with the rule's numeric CV criterion. Independent readers accepted the revised Slovak rhythm, but that judgment is not represented as an automated pass.

| Article | Sentences | CV | Sentences ≤8 tokens | Similar-length triples | Sentence-final parenthetical citations |
|---|---:|---:|---:|---:|---:|
| 876 | 47 | 0.415 | 7 (14.9%) | 13.3% | 0 |
| 877 | 53 | 0.409 | 10 (18.9%) | 23.5% | 4 (maximum consecutive run 2) |
| 878 | 56 | 0.384 | 14 (25.0%) | 25.9% | 2 (maximum consecutive run 1) |

### Independent AI reviews

The reviewers did not author the manuscripts and returned findings without changing them. These are AI editorial/source checks, not human native-speaker or lawyer reviews.

| Reviewer and scope | Result tied to final versions above | Repairs and evidence |
|---|---|---|
| `sk_locale_review`, independent Slovak editorial review | PASS for all three final SHA256 values | Initial 876/878 requests were repaired: duplicate source-summary opening cut, work duration clarified, age/prior-participation phrasing improved, tax numeric density split, ambiguous contracting-party phrase replaced, empty small-team introduction deleted, and Article 99's full cumulative conditions restored. Optional 877 wording improved. Subsequent narrow checks accepted final paragraph-start and citation-position changes. |
| `sk_final_review`, independent comprehensive final review | PASS for all three final SHA256 values; no unresolved material legal/factual defect reported | Independently checked all 34 cited provisions using existing `law.py` caches, relevant live official sources and amendment histories. Confirmed Article 99; ordinary nonservice under CPC 515(1), distinct from the 515(2) correction procedure; WHV conditions; Slovak treaty status; FAQ/body consistency; firm-contact constraints; sources; jurisdiction; and packaging. Final narrow rechecks accepted 876's reordered tax sentence and 877's article 516 sentence. |

Final source-access limits: the reviewer corroborated the permitted email, four consultation languages and safe first inquiry on the [live English contact page](https://tseng-law.com/en/contact). Direct retrieval of `/sk/contact` returned a fetch/cache miss, so no live Slovak route test is claimed; that locale path is required by the brief. Invest Taiwan comparison/capital evidence includes its official indexed content because direct requests timed out. GCIS official indexed guidance was checked; a later direct curl returned 92,620 bytes but was not treated as proof that a complete rendered document had been inspected. The unexpected `html/--help.html` cache is absent in the author's final path check.

Delivery status: three local drafts and this author note completed; independent AI locale and final legal/source reviews PASS on the recorded versions. Automated Slovak variety clearance is unavailable, and no full numeric-style clearance or publication is claimed.
