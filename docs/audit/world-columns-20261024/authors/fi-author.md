# Finnish author note — 846–848

Date: 24 October 2026. Assignment: `fi`, Finnish companies and residents; B-DIST, P-WORK and L-HEIR. All three recommended topics were retained. This is an author self-check, not a claim of lawyer review or native-speaker review.

## Reading and scope

Read the complete `briefs/BRIEF.md`, `briefs/ASSIGNMENTS.md`, `briefs/IMAGE-MENU.md`, `repo/docs/columns/EDITORIAL-VOICE.md`, `repo/docs/columns/FRONTMATTER.md`, `rules/SENTENCE-VARIETY-RULE.md` and `rules/LESSONS.md`. Also read the current `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md`, `/Users/son7/tseng-lanes-shared/LESSONS.md`, and `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`.

The requested `/Users/son7/agent-library/knowledge/editorial-voice.md` is absent on this machine. The complete repository editorial-voice file was used as the available house-style text; the old COLUMN-VOICE-RULE file is a pointer to the missing path. No approval or delegation requirements from superseded Fable material were applied.

Same-language comparison files, read in full:

- `repo/src/content/columns-fi/008-taiwan-labor-severance-law.md`
- `repo/src/content/columns-fi/014-taiwan-mandatory-employment-period.md`
- `repo/src/content/columns-fi/016-taiwan-inheritance-custody-analysis.md`

Structural sources, read in full:

- B-DIST: English 353 and French 676.
- P-WORK: English 705, 704, 706 and 352.
- L-HEIR: French 677, Italian 687, Arabic 702 and English 016.

The country ledger's provenance, version caveats and all Finnish records were examined. The articles use its supported Finnish visa-exemption, working-holiday list-membership and historical land-reciprocity findings only. Those three findings were also checked against the official pages as described below. Other countries' evidence was not transferred to Finland.

All statute citations were checked by executing `tools/law.py` before use. For laws not already in the shared cache, the unchanged script was executed with `runpy`; only `os.path.expanduser` for its hard-coded cache directory was redirected in memory to `drafts/fi/.law-cache`. This kept temporary downloads within the author's permitted directory. The shared script and shared cache were not edited. Temporary author cache files were removed after verification.

The articles contain no Finnish-law conclusions, invented court decisions, trade statistics, firm experience, public byline or promises of Finnish-language consultation. The initial-contact paragraphs request a non-sensitive description, other-party names for a conflict check, the Taiwan connection and deadlines; they exclude identity copies, bank details and full original documents and say that an email does not establish a lawyer–client relationship.

## Article 846 — distributor exit

File: `drafts/fi/846-finnish-supplier-taiwan-distributor-exit-stock.md`

### Reader, trigger and country fit

Reader: the person managing a Finnish supplier's Taiwan distribution relationship from Finland. Trigger: changing the local sales partner while the existing partner holds stock and receives online customer payments.

Country fit is a labelled editorial hypothesis from the assignment, not a statistical claim about Finnish exports. The opening explicitly labels the example fictional. Its Finnish connection affects the practical decisions: returning particular lots to Finland, separating Finnish-law advice if the contract selects it, and coordinating a remote handover with Taiwan-held stock and accounts. No product sector is asserted to be typical of Finland.

Overlap: English 353 supplies the agency/buy–sell distinction and contract-remedy structure; French 676 supplies the stock/account handover issues. The new angle is the last paid order, reconciliation of credit notes and refunds, and the difference between a planned new distributor's start date and the old distributor's unfinished obligations. It does not copy the US opening, old receivables timeline, French cosmetics/PIF discussion, or their contact wording.

### Claim → checked source

Chinese excerpts below are from the article text returned by `tools/law.py`; the explanations retain the qualifications shown.

| Claim in the article | Statute / official URL | Chinese excerpt checked |
| --- | --- | --- |
| Taiwan choice of law starts with the parties' choice; absent a valid express choice, closest connection applies. | [Choice-of-Law Act 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) | 「依當事人意思定其應適用之法律」「當事人無明示之意思或其明示之意思依所定應適用之法律無效時，依關係最切之法律」 |
| Commercial agent acts in the principal's name in a specified place/territory and is not its manager. | [Civil Code 558](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=558) | 「非經理人而受商號之委託，於一定處所或一定區域內，以該商號之名義，辦理其事務之全部或一部」 |
| Three months' notice concerns agency without a fixed term; the non-attributable, unavoidable-termination exception is retained. | [Civil Code 561](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=561) | 「代辦權未定期限者」「應於三個月前通知他方」「因非可歸責於自己之事由，致不得不終止契約者，得不先期通知」 |
| A sale transfers property rights against a price; buy–sell activity is not automatically within the cited agency notice provision. | [Civil Code 345](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=345) | 「一方移轉財產權於他方，他方支付價金之契約」 |
| Delay can permit a reasonable performance deadline and rescission after non-performance; application to the framework and obligation needs separate assessment. | [Civil Code 254](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=254) | 「遲延給付者」「得定相當期限催告其履行，如於期限內不履行時，得解除其契約」 |
| Past tolerated deviations matter to the good-faith assessment. | [Civil Code 148](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=148) | 「行使權利，履行義務，應依誠實及信用方法」 |
| Agency remuneration and reimbursement are their own claim category, not an assumed exit indemnity. | [Civil Code 560](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=560) | 「得依契約所定，請求報酬，或請求償還其費用。無約定者依習慣」 |
| A court may reduce an excessive contractual penalty; reduction is not guaranteed. | [Civil Code 252](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=252) | 「約定之違約金額過高者，法院得減至相當之數額」 |
| Valid rescission of a particular sale leads to restitution, including interest on money from receipt, subject to other law/agreement. | [Civil Code 259](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=259) | 「除法律另有規定或契約另有訂定外」「受領之給付為金錢者，應附加自受領時起之利息償還之」 |
| Private use of ordinary personal data is limited to the necessary scope of the specified collection purpose, subject to statutory exceptions. | [Personal Data Protection Act 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0050021&flno=20) | 「除第六條第一項所規定資料外，應於蒐集之特定目的必要範圍內為之。但有下列情形之一者，得為特定目的外之利用」 |

Stock spreadsheets, access inventories, test orders and handover records are practical preparation suggestions, not claims of statutory filing duties. The article does not claim that a logo establishes account ownership or that all customer data may be transferred.

### First-two-paragraph deletion test

| Sentence | Decision and information retained |
| --- | --- |
| “Suomalainen valmistaja aikoo siirtää … (kuvitteellinen esimerkki).” | Kept: identifies the Finnish supplier, the switch, remaining stock and continuing payments; the hypothetical label stays in the sentence. |
| “Pelkkä uuden myynnin aloituspäivä jättää avoimeksi …” | Kept: identifies delivery and refunds on already paid orders as unresolved handover work. |
| “Luovutukseen tarvitaan myös tieto siitä, kenen nimissä verkkokauppa toimii.” | Kept: identifies account-holder evidence, which stock quantity alone cannot supply. |
| “Ennen päättämisilmoitusta … samaan aineistoon.” | Kept: identifies the signed contract, renewal communications and stock report, and when to assemble them. |
| “Luetteloon merkitään myyntitilin haltija.” | Kept: turns the first paragraph's ownership question into a concrete inventory entry. |
| “Maksujen vastaanottaja yksilöidään erikseen.” | Kept: the payment recipient may differ from the store-account holder. |
| “Näin päättämispäivää voidaan verrata …” | Kept: explains the comparison between contractual duration and unfinished delivery work. |

No generic overview sentence was added. The two-part account/payment sentence was split during the rhythm review without removing either actor.

### Comparison with the three existing Finnish columns

| Existing column | Opening / headings / ending observed | How 846 differs |
| --- | --- | --- |
| 008 | General severance statement followed by “Alla selvitetään”; numerous isolated lines; cautionary advice and related-service footer. | One explicitly hypothetical transaction, connected paragraphs, no self-announcement or purported client experience; ends on the last order's delivery/payment/refund allocation. |
| 014 | Long definition followed by a numbered four-question map; eleven numbered headings and lists; generic disclaimer and attorney footer. | Four issue-specific, unnumbered headings; no checklist headings; no attorney footer. |
| 016 | Broad enumeration of family-law issues; eleven numbered sections; disclaimer and attorney footer. | Narrow distributor transition with concrete account and stock evidence; ends on a handover record rather than a broad legal summary. |

Dropped / deliberately not adopted: a universal three-month notice period; an absolute assertion that no exit compensation could ever be due; automatic inventory buy-back; any universal power to seize accounts; resale-price floors from the older English structure; claims about Finnish commercial-agency law or foreign-judgment reciprocity. These would require additional legal or factual support and are unnecessary to the selected angle.

Length: 655 words / 6,244 characters for the main article; 703 words / 6,645 characters with the sources section. Counting convention is below.

## Article 847 — work, residence and family

File: `drafts/fi/847-finnish-professional-taiwan-work-permit-family.md`

### Reader, trigger and country fit

Reader: a Finnish national considering a Taiwan professional job and possibly moving with a spouse and children. Trigger: the employer wants an arrival/start date before work authorization and residence routes are settled.

Verified country fit: Finland is expressly in BOCA's 90-day visa-exemption list. Finland is absent from MOFA's complete working-holiday partner table. This supports a Finland-specific explanation of visitor entry versus professional work authorization, not an assertion about employment demand or the number of Finnish residents. Family relocation is an editorial hypothesis, not a measured demographic claim.

Overlap: English 705/704/706 provide the route distinction, first ARC deadline and family/status framework; English 352 provides the employer-permit versus Gold Card structure. Finnish 008/014 concern employment terms, not permission to enter, work and reside. The article focuses on a Finnish offer-holder's pre-travel coordination and gives each family member a separate calendar row. It avoids reproducing the broad work/study/Mandarin overview, the US EOR example, or renewal/replacement minutiae.

### Claim → checked source

| Claim | Statute / official URL | Chinese text or official-language excerpt checked |
| --- | --- | --- |
| Finnish nationals have conditional visa-exempt entry up to 90 days; passport, departure arrangements, inspection and counting conditions remain. | [BOCA visa exemption](https://www.boca.gov.tw/fp-149-4486-7785a-1.html); ledger also cites [Chinese BOCA version](https://www.boca.gov.tw/fp-384-4485-149c7-1.html) | 「90天免簽證適用國家」「芬蘭(Finland)」; English page: “remaining validity of at least six months as of the date of entry”; “The duration of stay starts from the day after arrival”. |
| No current Finnish working-holiday program is listed; this is list-membership evidence, not a universal prohibition. | [MOFA partner table](https://youthtaiwan.mofa.gov.tw/workingholidayen/cp.aspx?n=6426) | Table read through all 18 entries, including Israel's temporary suspension; Finland absent. The introduction's “17 countries” discrepancy was not repeated. Direct curl retrieval succeeded although browser retrieval failed. |
| Working in Taiwan requires an employer-applied permit unless another rule provides otherwise; Finnish payroll is not itself proof of an exemption. | [Employment Service Act 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | 「除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作」 |
| Professional work and specialist status have defined categories; nationality or an unspecified degree alone does not establish specialist eligibility. | [Foreign Professionals Act 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=4) | 「外國專業人才：指得在我國從事專業工作之外國人」「具有中央目的事業主管機關公告之……特殊專長」 |
| Employer normally applies to MOL; specified teaching work goes to MOE; other statutory exceptions remain. | [Foreign Professionals Act 5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | 「除本法另有規定外……向勞動部申請許可」「但聘僱從事……專業工作者……向教育部申請許可」 |
| Specialist may apply personally for Gold Card, combining four functions, valid one to three years. | [Foreign Professionals Act 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | 「得逕向內政部移民署申請核發具工作許可、居留簽證、外僑居留證及重入國許可四證合一之就業金卡」「有效期間為一年至三年」 |
| Gold Card does not require a secured job or employer sponsorship; open work rights permit multiple employers and changes. | [Official Gold Card explanation](https://goldcard.nat.gov.tw/en/about/) | “Applicants can apply online without sponsorship”; “You don’t need to have already secured a job in Taiwan”; “work for any (or multiple) companies”. |
| Qualified professional/specialist with work authorization or exemption can apply directly to NIA after visa-exempt/visitor entry; approval is required for ARC. | [Foreign Professionals Act 16(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | 「以免簽證或持停留簽證入國，經許可或免經許可在我國從事專業工作者，得逕向內政部移民署申請居留；經許可者，發給外僑居留證」 |
| Entry scheme restrictions apply; the cited guidance requires departure if ARC is not obtained within permitted stay. | [NIA 0915, notes 7(1), 7(8)](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | “unless otherwise provided by relevant regulations”; “shall leave the State within the prescribed period”. The latter applies where ARC is not obtained before permitted stay expires. |
| Resident-visa entrant applies for ARC within 30 days from day after entry; valid combined document is an exception. | [Immigration Act 22(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | 「應於入國後之翌日起算三十日內……申請外僑居留證」「四證合一之有效證件……得免申請」 |
| Residence documents include purpose evidence/address; overseas authentication is required by the guide and an authenticated/notarized Chinese translation may be requested. | [NIA 0902, section 3](https://www.immigration.gov.tw/5475/5478/141465/141808/141970) | “Documents produced overseas must be authenticated”; “the NIA may request … a Chinese translation”; employment approval and recent employment certificate are listed. |
| Approved resident/permanent-resident professional engaged in professional work, or specialist, can support the listed dependants' direct applications after eligible entry. | [Foreign Professionals Act 16(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | 「外國專業人才在我國從事專業工作及外國特定專業人才，經……許可居留或永久居留者，其配偶、未成年子女及因身心障礙無法自理生活之成年子女」 |
| Spouse of specialist/senior professional, after approved dependent residence, may apply personally to MOL; permit cannot exceed dependent residence. | [Foreign Professionals Act 15(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15) | 「配偶，經內政部移民署許可在我國依親居留者，得逕向勞動部申請許可」「該工作許可期間不得逾其依親居留期間」 |

### First-two-paragraph deletion test

| Sentence | Decision and information retained |
| --- | --- |
| “Voiko suomalainen aloittaa … heti viisumivapaan saapumisen jälkeen?” | Kept: concrete reader question about the proposed first workday, not an outline of the article. |
| “Suomen kansalaiselle BOCAn maahantulo-ohje …” | Kept: nationality-specific entry duration and conditionality. |
| “Työn aloittamiseen tarvitaan lisäksi lupa …” | Kept: the work authorization rule, exceptions and official citation. |
| “Suomalaisen työnhakijan kannattaa pyytää …” | Kept: identifies the job description and the permit applicant before travel. |
| “Samalla sovitaan, miten aloituspäivää siirretään …” | Kept: concrete handling of an approval delay. |
| “Mukana muuttavan puolison työ ja lasten oleskelu …” | Kept: separates family applications from the applicant's offer. |
| “Yksi työtarjous ei kuvaa koko perheen muuttoa.” | Cut: repeated the previous sentence without supplying a fact, condition or action. |

### Comparison with the three existing Finnish columns

| Existing column | Opening / headings / ending observed | How 847 differs |
| --- | --- | --- |
| 008 | Broad rule, self-announcement, Korea comparison and narrated client experience; fragmented prose; warning-style ending. | Opens with a Finnish entry/work question; uses verified Finnish eligibility; no client story, home-country-law comparison or warning footer. |
| 014 | Dense minimum-service definition; numbered legal tests/checklists; general disclaimer and lawyer name. | Introduces permit/ARC terms at their decision points; one question heading among descriptive headings; ends on a family travel calendar. |
| 016 | Broad survey of family consequences; repeated separateness explanations; numbered headings and generic ending. | Restricts family discussion to eligible dependants and spouse work authorization; concrete sponsor conditions replace a general family-law survey. |

Dropped / not adopted: any Finnish working-holiday entitlement; a draft reference to “other Nordic countries' programs” that could imply unverified Nordic eligibility; Finland–Taiwan tax-treaty conclusions; a universal salary threshold or degree rule; EOR sponsorship guarantees; automatic work rights for every dependent spouse; a promise of in-country residence conversion solely from an offer. Tax, short contract-performance permits, digital nomads, student residence and job-end extensions would need their own scoped treatment.

Length: 695 words / 6,471 characters for the main article; 751 words / 7,023 characters with the sources section.

## Article 848 — overseas heir

File: `drafts/fi/848-finnish-heir-taiwan-estate-renunciation-documents.md`

### Reader, trigger and country fit

Reader: a Finnish heir or a person living in Finland who learns of a relative's Taiwan bank or real-estate assets. Trigger: deciding whether to renounce while organising documents and signing authority from Finland.

The cross-border family scenario is a labelled editorial hypothesis from the assignment. No prevalence is asserted. Finnish relevance is practical: signatures and original documents originate in Finland, Finnish-law questions are referred to local counsel, and the Finnish nationality is relevant to the verified historical land-reciprocity listing. The article distinguishes nationality from the heir's residence and does not assume every Finland-based reader is a Finnish national.

Overlap: Finnish/English 016 provide a broad family/estate framework; Italian 687 provides renunciation and debt safeguards; Arabic 702 supplies nationality/choice-of-law discipline; French 677 supplies bank mandate versus land-registration distinctions. This article's new angle is the sequence between a knowledge-triggered deadline in Finland, recipient-specific authority documents, and Taiwan tax/land calendars. French legalization rules and French notarial procedure were not reused.

### Claim → checked source

| Claim | Statute / official URL | Chinese excerpt checked |
| --- | --- | --- |
| When Taiwan succession law applies, renunciation is written to court within three months of learning of one's right to inherit, followed by written notice to succeeding heirs unless notification is impossible. | [Civil Code 1174](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1174) | 「知悉其得繼承之時起三個月內，以書面向法院為之」「應以書面通知因其拋棄而應為繼承之人。但不能通知者，不在此限」 |
| Succession starts with deceased's national law at death; the statutory protection of Taiwanese heirs to Taiwan assets remains. | [Choice-of-Law Act 58](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=58) | 「依被繼承人死亡時之本國法」「依中華民國法律中華民國國民應為繼承人者，得就其在中華民國之遺產繼承之」 |
| Multiple nationalities require the closest nationality connection. | [Choice-of-Law Act 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=2) | 「有多數國籍時，依其關係最切之國籍定其本國法」 |
| Renvoi can refer onward or back to Taiwan law; a passport alone does not finish the analysis. | [Choice-of-Law Act 6](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=6) | 「如依其本國法就該法律關係須依其他法律而定者，應適用該其他法律」「應適用中華民國法律者，適用中華民國法律」 |
| General debt-payment responsibility is limited to inherited estate, not necessarily all personal property. | [Civil Code 1148(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1148) | 「對於被繼承人之債務，以因繼承所得遺產為限，負清償責任」 |
| Serious concealment/falsification or creditor-defrauding disposition can remove that benefit. | [Civil Code 1163](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1163) | 「隱匿遺產情節重大」「在遺產清冊為虛偽之記載情節重大」「意圖詐害被繼承人之債權人之權利而為遺產之處分」 |
| Inventory has a three-month knowledge-based period; court may extend on application if necessary. This does not extend renunciation. | [Civil Code 1156](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1156) | 「知悉其得繼承之時起三個月內開具遺產清冊陳報法院」「法院因繼承人之聲請，認為必要時，得延展之」 |
| Even without inventory, proportional creditor payments and priority rights must be respected. | [Civil Code 1162-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1162-1) | 「仍應按其數額，比例計算，以遺產分別償還。但不得害及有優先權人之利益」 |
| Breach can create beyond-estate liability for unpaid portions, with the incapacity exception; damages may also arise. | [Civil Code 1162-2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1162-2) | 「不以所得遺產為限。但繼承人為無行為能力人或限制行為能力人，不在此限」「致被繼承人之債權人受有損害者，亦應負賠償之責」 |
| Covered transfer registrations require the applicable tax clearance/exemption/exclusion/consent document; this is not a statement that every estate owes tax. | [Estate and Gift Tax Act 42](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340072&flno=42) | 「辦理遺產或贈與財產之產權移轉登記時」「稅款繳清證明書，或核定免稅證明書或不計入遺產總額證明書……或同意移轉證明書」「不得逕為移轉登記」 |
| Real rights follow the situs law. | [Choice-of-Law Act 38](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=38) | 「關於物權依物之所在地法」 |
| Foreign land-right acquisition is subject to reciprocity. | [Land Act 18](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060001&flno=18) | 「依條約或其本國法律，中華民國人民得在該國享受同樣權利者為限」 |
| Finland is listed as fully reciprocal in the historical ministry list; newer country-specific determination not established. | [New Taipei official reproduction](https://www.land.ntpc.gov.tw/News.aspx?PageSize=200&n=13377&page=1&sms=9730); ledger's [official Keelung mirror](https://www.kl-land.klcg.gov.tw/wSite/public/Attachment/01901/f1689584548677.pdf) dates the ministry table to 2021-05 | 「完全平等互惠之國家 芬蘭Finland」. Municipal page independently retrieved with curl; source age explicitly retained in article and sources note. |
| Listed restricted land such as forest land may be inherited but must be sold to a Taiwan national within three years after inheritance registration completes. | [Land Act 17](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060001&flno=17) | 「一、林地」「不包括因繼承而取得土地。但應於辦理繼承登記完畢之日起三年內出售與本國人」 |
| Inheritance land registration has a six-month period from succession's opening. | [Land Act 73](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060001&flno=73) | 「其係繼承登記者，得自繼承開始之日起，六個月內為之」 |
| Ordinary estate-tax return is six months from the day after death; statute also specifies alternative triggers. | [Estate and Gift Tax Act 23](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340072&flno=23) | 「死亡之次日起算六個月內」; exceptions checked: 「法院選任遺產管理人之次日起算」「判決確定或文書作成之次日起算六個月內」 |
| A justified tax-filing extension is requested in writing before expiry, normally capped at three months; force majeure/other special reasons allow individual determination. | [Estate and Gift Tax Act 26](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340072&flno=26) | 「申報期限屆滿前，以書面申請延長」「以三個月為限。但因不可抗力或其他有特殊之事由者，得由稽徵機關視實際情形核定之」 |

The mandate and authentication paragraphs recommend asking the actual recipient before signing. They do not assert a universal Finnish apostille route or identical requirements across banks and courts.

### First-two-paragraph deletion test

| Sentence | Decision and information retained |
| --- | --- |
| “Kolme kuukautta voi kulua jo Suomessa: jos …” | Kept: period, knowledge trigger, conditional application of Taiwan law, written court filing and cross-border urgency in one legally qualified opening. |
| “Matkapäivä tai pankin myöhempi velkakirje …” | Kept: rules out replacing the statutory trigger with the wrong event. |
| “Tiedon saamisesta kertova viesti kannattaa säilyttää.” | Kept: evidence needed to evaluate that trigger. |
| “Säännöksen soveltaminen edellyttää ensin …” | Kept: prevents applying the opening's domestic rule before choice-of-law analysis. |
| “Taiwanin kansainvälisen yksityisoikeuden lain 58 artikla …” | Kept: gives the actual connecting factor and the time at which nationality matters. |
| “Suomessa asuvan perillisen osoite ei siis yksin ratkaise …” | Kept: addresses the specific Finland-resident reader without treating residence as nationality. |
| “Sama artikla suojaa Taiwanin kansalaista …” | Kept: preserves the statutory exception; deleting it would overstate the national-law rule. |

No opening sentence was removed after this test because each retained one carries a rule, condition, connecting fact or evidence step.

### Comparison with the three existing Finnish columns

| Existing column | Opening / headings / ending observed | How 848 differs |
| --- | --- | --- |
| 008 | Generic rule followed by an overview announcement; narrated dispute and advisory ending. | Starts with a qualified deadline already running abroad; no client narrative; ends with the message establishing knowledge and records of sent originals. |
| 014 | Definition and four-question outline; extensive numbered checklist structure; generic footer. | Four unnumbered headings follow this estate file's decisions, not an all-purpose checklist; no public author line. |
| 016 | Broad inheritance/custody survey; shares, marital property and guardianship; generic disclaimer/name footer. | Does not reproduce share calculations or custody guidance. Links to 016 for that broader scope; concentrates on overseas renunciation, recipient-specific mandates and land/tax dates. |

Dropped / not adopted: automatic application of Finnish inheritance law because the heir lives in Finland; a claim that all Finnish documents need or are sufficiently authenticated by apostille; detailed Finnish probate/tax law; recognition of Finnish judgments; a guarantee that Finland's historical reciprocity classification settles every 2026 land application; guaranteed acceptance of one bank's mandate at another institution. No newly enacted reserved-share percentages are used.

Length: 702 words / 6,689 characters for the main article; 776 words / 7,288 characters with the sources section.

## Legal-version checks

The Civil Code cache and `tools/law.py` display the unenforced-amendment banner. Its scope was checked against the [official legislative history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001): Article 166-1 remains subject to a separately fixed commencement; the 17 August 2026 amendment to Article 1223 commences six months after promulgation. Neither provision is cited or used in these articles. All cited distributor and inheritance articles are unaffected. Articles 846/848 expressly use the law in force as of 24 October 2026.

The Personal Data Protection Act also carries a banner. The cached official status text lists the deferred amendments, including Articles 1-1, 12, 18, 21 and 22–26 and new Article 20-1. Article 20, cited in 846, is not in that deferred set. The draft uses the operative Article 20 and does not present new Article 20-1 as effective.

The [Foreign Professionals Act history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295), retrieved with curl after browser failure, states that most of the 24 September 2025 revision took effect on 1 January 2026; the specified part of Article 4 and Articles 28/29 took effect on 30 June 2026. The cited provisions are effective on the check date. The act's Article 33 was also inspected with `tools/law.py` for the commencement mechanism.

No remaining unverified statute citation is used. English sources were structural aids; the Chinese text was checked for the actual article, period trigger, exceptions and discretionary wording.

## Editorial corrections and meaning preservation

| Original / issue | Reason | Final correction | Meaning preserved |
| --- | --- | --- | --- |
| 846: “Myyntitilin haltija ja maksujen vastaanottaja merkitään mukaan erikseen.” | Two roles were compressed into another medium-length sentence. | “Luetteloon merkitään myyntitilin haltija. Maksujen vastaanottaja yksilöidään erikseen.” | Both roles and their separate identification retained. |
| 846: “Alennusta ei voi pitää varmana budjettieränä.” | Indirect business phrasing diluted the discretionary court outcome. | “Alennus ei ole varma.” | Court may reduce; no guaranteed reduction. |
| 847: “Yksi työtarjous ei kuvaa koko perheen muuttoa.” | Deletion test found no new information. | Removed. | The preceding sentence still requires separate spouse-work and child-residence questions. |
| 847: “Työlomareittiä ei siis pidä rakentaa muiden Pohjoismaiden ohjelmien varaan.” | Could imply unverified Nordic Taiwan programs. | “Siksi Suomen kansalaisen muuttoa ei kannata suunnitella working holiday -luvan varaan.” | Only Finland's absence from the verified table is relied upon. |
| 847: “Kun ammattilaisen oleskelu … on hyväksytty lain edellyttämällä tavalla …” | Sponsor's professional-work condition was too compressed. | Explicit NIA approval, professional work for the ordinary professional, specialist category, and physical/mental disability condition included. | Article 16(2) conditions made explicit, not widened. |
| MONOTONY: 848 medium-length run — “Kunkin tiedon viereen merkitään lähde. Epävarma tieto jätetään näkyvästi avoimeksi.” | Finnish Unicode word-count diagnostic showed a need for greater rhythm variation elsewhere in the batch; short information-bearing sentences were preferred to padding. | “Jokaisen tiedon lähde kirjataan. Epävarmuus merkitään näkyviin.” | Source attribution and unresolved uncertainty retained. |
| 848: “Kyse on luetteloa koskevasta pidennyksestä. Sitä ei saa tulkita luopumisajan pidennykseksi.” | Nominal phrasing; both propositions can be stated directly. | “Pidennys koskee luetteloa. Luopumisaika ei pitene sen perusteella.” | Inventory extension cannot be used to extend renunciation. |
| 848: “Tavallista asuntoa ja metsämaata ei siksi voi käsitellä yhtenä omaisuusrivinä.” | Negative contrast repeated the distinction just explained. | “Asunto ja metsämaa luetteloidaan erikseen.” | Different land types remain separately identified; statutory three-year duty unchanged. |

The initial `--lang en` diagnostic flagged 848 at CV 0.433; the Finnish-aware diagnostic initially flagged 846 at CV 0.439. Both were corrected by shortening real record-keeping propositions, not by adding filler. No citation, statutory amount, trigger or hypothetical label was removed to satisfy a metric.

## Sentence-variety section 5 self-check

1. Supplied checker: `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check drafts/fi/*.md --lang en` returns no FAIL for the final manuscripts. Limitation: the installed script only implements ko/ja/en/zh-hant. Without `--lang`, it misclassifies `drafts/fi` as Korean and reports irrelevant Korean character-length FAILs. The English mode is an auxiliary diagnostic, not a Finnish-language validation claim. A separate Unicode/whitespace Finnish count and manual reading were therefore used. No checker or shared rule was edited.
2. Opening types are distinct: 846 explicit fictional transaction (one of three); 847 reader question; 848 qualified numerical deadline. No stock “suppose” formula.
3. The Finnish-aware count finds at least 20 sentences of eight words or fewer in each. Long sentences are followed by shorter explanation; no paragraph has two sentences over 32 Finnish words.
4. Every prose-paragraph opening word is unique within its article after lowercasing. No three-paragraph repetition. Consecutive sentence starts were also read vertically; no recurring template dominates.
5. Citation positions vary between a statutory subject, an embedded link and a final supporting reference. No three consecutive claim/citation/caveat paragraphs. Each article contains uncited practical preparation paragraphs without unsourced legal conclusions.
6. No repeated “not X but Y” formula; necessary distinctions concern the actual contractual status, residence route or inheritance procedure. No unprompted factual rebuttal was inserted.
7. Last substantive paragraphs are different and tied to each file: last distributor order; family travel calendar; originals/knowledge evidence. Sources follow as the required structural ending.
8. Finnish register is restrained, without bold, H1, attorney narration, imperative checklist headings or public author footer. The required internal `author: legal-ai-assistant` remains.
9. Revisions were compared against the legal tables. In particular: agency exception; discretionary penalty reduction; statutory restitution exception; conditional entry and ARC approval; eligible family categories; knowledge-based three months; inventory-only extension; incapacity exception; land registration trigger; tax-return next-day trigger; and the historical land-list date remain.

Finnish-aware diagnostic uses visible prose only, excludes headings and sources for sentence metrics, splits sentences after `. ! ?` followed by an uppercase Finnish letter, and counts whitespace-separated Finnish words without splitting ä/ö. It is a local transparent diagnostic, not an independently validated linguistic model.

| Article | Sentences | Length CV | Sentences ≤8 words | Repeated paragraph opener maximum |
| --- | ---: | ---: | ---: | ---: |
| 846 | 59 | 0.465 | 33.9% | 1 |
| 847 | 61 | 0.527 | 37.7% | 1 |
| 848 | 62 | 0.489 | 32.3% | 1 |

## Format, sources, assets and counts

Python/YAML checks confirm exactly the specified fields in order, three matching FAQ entries, `audience: ["fi"]`, the existing Finnish category string, correct dates, 30–60-character SEO titles, 110–170-character summaries, 3–5 tags, five H2 headings per article including `Lähteet`, and no forbidden bold or body H1. All external body-source URLs also occur in each sources list. Internal column slugs exist in the Finnish snapshot or these new drafts, and no excluded Korea-premised shared column is linked. New slugs include `finnish` and have six words each.

Images exactly match menu choices I02, I04 and I26, with different images for all three articles and Finnish translations of the supplied descriptions and caption pattern. Asset limitation: `repo/public` does not exist in this read-only snapshot. A read-only in-memory run of `tools/gate.mjs` therefore reports three image-file-existence FAILs, one per article, and no other FAIL. Paths were not changed to invented replacements. The other gate warnings are the checked amendment banners and the required consultation-language word `koreaksi` (a string-match warning, not a Korean-reader premise). Image files cannot be proven from this snapshot; the prescribed menu paths are retained for integration.

The gate was adapted only in memory to resolve its existing `gray-matter` dependency, point REPO at this snapshot, use the author-local law cache and disable any shared-cache fetch. No installation, git operation, publication, repository edit or other-locale write was performed.

Counting convention: main article = visible Markdown body before `## Lähteet`, including its headings and contact paragraph, excluding frontmatter and sources. Links count by visible anchor text, not URL. The “with sources” count includes the full visible body; bullet/heading syntax is removed. Characters include spaces and internal newlines, with outer whitespace trimmed. Raw-file counts include frontmatter, Markdown syntax and URLs.

| File | Main words | Main characters | Words with sources | Characters with sources | Raw words | Raw characters |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `drafts/fi/846-finnish-supplier-taiwan-distributor-exit-stock.md` | 655 | 6,244 | 703 | 6,645 | 920 | 10,334 |
| `drafts/fi/847-finnish-professional-taiwan-work-permit-family.md` | 695 | 6,471 | 751 | 7,023 | 989 | 11,105 |
| `drafts/fi/848-finnish-heir-taiwan-estate-renunciation-documents.md` | 702 | 6,689 | 776 | 7,288 | 992 | 12,039 |

The work-note and three articles are the retained deliverables. Publication and independent review were not part of this author assignment.
