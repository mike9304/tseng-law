# Hungarian author work note — 879–881

Assignment: locale `hu`, 24 October 2026. Deliverables are local author drafts. No publication, change to `repo/`, installation or git command was performed. Writing is confined to `drafts/hu/` and this note. Statute HTML fetched by the supplied tool is retained only in `drafts/hu/.law-cache/`.

## Instructions and comparison material read

Read `briefs/BRIEF.md`, `briefs/ASSIGNMENTS.md`, `briefs/IMAGE-MENU.md`, `repo/docs/columns/EDITORIAL-VOICE.md`, `repo/docs/columns/FRONTMATTER.md`, `rules/SENTENCE-VARIETY-RULE.md`, and `rules/LESSONS.md` in full. The two rule files are byte-identical to the required `/Users/son7/tseng-lanes-shared/` originals. Read `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`; its shared `~/agent-library/knowledge/editorial-voice.md` target is absent, so the repository's complete current house-style copy governs. Historical Fable instructions were not applied.

Three complete same-language comparators: `repo/src/content/columns-hu/008-taiwan-labor-severance-law.md`, `009-taiwan-voluntary-resignation-severance.md`, and `015-taiwan-company-setup-pitch-location.md`. All display 13 September 2025; last modification dates are 7 October 2026, 10 September 2026 and 10 September 2026 respectively. These are the available brief-directed corpus samples, not a claim to have checked the live publication order. Exact category strings retained: `Tajvani jogi tájékoztatás` and `Cégalapítás Tajvanon`; date and reading-time patterns are `2026. október 24.` and `5 perc olvasás`.

All assigned structural sources were read: French 654 for P-WHV; English 004, 001 and 507 plus Spanish 656 for B-SETUP; French 677, Italian 687, Arabic 702 and English 016 for L-HEIR. Their Korean/French/other-country rules, public bylines, office addresses and old formatting were not adopted. `research/country-facts.md` was absent at the initial read and again during verification; no unfinished country row was used.

Applied the tseng-law-editorial skill within this author assignment. A separate read-only research agent checked official Hungarian program/treaty evidence. Independent AI editorial checking is recorded below; it is not human native-speaker or lawyer certification.

## Statute verification method and commencement

Executed the supplied `tools/law.py` unchanged through `runpy.run_path`, with `sys.argv` set to each pcode/article list. A process-local `os.path.expanduser` wrapper redirects only its hard-coded `~/tseng-world-columns-20261024/html` cache directory to `drafts/hu/.law-cache`. This avoids writing outside the assigned paths; neither the tool nor global environment variables were changed. Article text and law title were checked before insertion. Extra provisions considered and dropped are not citations in the manuscripts.

- Income Tax Act `G0340003`: the tool flags an uncommenced provision. The [official history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=G0340003) identifies article 43-4 as awaiting commencement, not cited article 7. The latest amendment concerns articles 17 and 126. The manuscript explicitly dates the tax discussion to 24 October 2026.
- Civil Code `B0000001`: the tool flags article 166-1 (commencement undetermined) and the 17 August 2026 amendment to article 1223 (effective six months after promulgation). The [official history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001) was opened. Neither provision is used. Articles 1148, 1156, 1163 and 1174 cited here are not those future provisions. No reserved-share rule was imported.
- No pending-effect banner appeared for the other cited laws/regulations. Hungarian statute names are explanatory translations; the checked Chinese texts are authoritative.

## 879 — Hungarian working holiday and the employer limit

File: `drafts/hu/879-hungarian-working-holiday-taiwan-employer-limit.md`.

Reader and trigger: a Hungarian young adult offered a six-month job while planning or already undertaking a Taiwan working holiday. The concrete issue is the three-month limit with one employer, with insurance, tax-year and travel-date consequences.

Country fit: verified, not inferred from another nationality. The [Chinese BOCA Hungary page](https://www.boca.gov.tw/cp-388-54-d5e5f-1.html) and [English counterpart](https://www.boca.gov.tw/cp-153-7047-ba88f-2.html), updated 12 August 2024, state age 18–35 inclusive and temporary employment of no more than three months with the same employer. The proposed six-month offer is the reader's question, not an invented actual client event. Demand for this exact inquiry is an editorial hypothesis; no search-volume claim is made.

Overlap and new angle: HU 008 and 009 explain termination/severance; this draft addresses the prior permission and calendar problem. French 654 supplies the distinction between a visa deemed a work permit and visitor status. French/Belgian/Canadian ages and employment restrictions were replaced with verified Hungarian conditions.

### Claim → source ledger

| Claim used | Official source | Chinese excerpt or checked passage |
| --- | --- | --- |
| Age, first participation, application in Hungary, passport validity | [BOCA Hungary](https://www.boca.gov.tw/cp-388-54-d5e5f-1.html) | `申請時年齡介於18歲(含)至35歲(含)`; `申請人未曾以參與「臺匈度假打工計畫」為由來臺`; `由本人向駐匈牙利代表處提出申請` |
| Temporary jobs; maximum three months per employer; professional qualifications preserved | [BOCA Hungary](https://www.boca.gov.tw/cp-388-54-d5e5f-1.html) | `在臺停留期間得從事臨時性工作，且不得受雇同一僱主超過3個月`; `應符合中華民國相關資格認定及執業證照登記等法令` |
| Visitor visa validity, extension and no in-country conversion | [BOCA Hungary](https://www.boca.gov.tw/cp-388-54-d5e5f-1.html) | `效期：自核發日起算1年`; `每次入境得停留最長180天，屆滿前15日內`; `入境後不得在中華民國境內申請改換其他事由之簽證` |
| Insurance throughout stay | [BOCA English conditions](https://www.boca.gov.tw/cp-153-7047-ba88f-2.html) and Chinese counterpart | `停留臺灣期間之醫療及全額住院保險` |
| Visa deemed work permit, maximum one year | Regulations on the Permission and Administration of the Employment of Foreign Workers, [N0090027 article 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=4) | `外國人據以辦理之入國簽證，視為工作許可`; `期限，最長為一年` |
| NHI residence-document condition plus alternative qualifying criteria | National Health Insurance Act, [L0060001 article 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=L0060001&flno=9) | `在臺灣地區領有居留證明文件，並符合下列各款資格之一者`; `二、有一定雇主之受僱者` |
| Hungary WHV does not itself confer NHI eligibility | [MOFA working holiday FAQ](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6440), NHI Q1 | Hungary expressly appears among the visitor-WHV nationalities ineligible on that basis. This supplements, rather than broadens, article 9. |
| Occupational accident insurance: specified employers, workers aged at least 15, no five-worker threshold in this route | Labor Occupational Accident Insurance and Protection Act, [N0050031 article 6, paragraph 1(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0050031&flno=6) | `年滿十五歲以上`; `受僱於領有執業證照、依法已辦理登記、設有稅籍…之雇主` |
| No Taiwan domicile: resident status at 183 days in the tax year | Income Tax Act, [G0340003 article 7, paragraph 2(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=7) | `無住所，而於一課稅年度內…居留合計滿一百八十三天者` |
| Calendar-year count | [MOF alien income-tax instructions](https://www.etax.nat.gov.tw/etwmain/en/announcement/alien-individual-income-tax/instructions) | Taxable-year resident/nonresident distinction; only the calendar-year method is used, not the historical page's annual deductions/amounts. |
| Nonresident salary withholding: 18%, or 6% within the stated monthly threshold | Standards of Withholding Rates for Various Incomes, [G0340028 article 3, paragraph 1(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=3) | `薪資按給付額扣取百分之十八`; `全月薪資給付總額在行政院核定每月基本工資一點五倍以下者…百分之六` |

### Opening deletion test and comparison

Kept the opening reader question because it identifies the conflict between a six-month offer and the Hungarian program. Kept the answer's temporary-work scope and three-month employer limit, with the official source now embedded in that answer. Cut the standalone sentence merely attributing the rule to BOCA. Kept the second paragraph's employer/role/start/end information and separate visa, entry and work dates: those are the records needed to use the rules. Cut its closing sentence about later comparing those records because the preceding instructions already specify the useful action. No generic introduction about Taiwan remains.

| Comparator | Opening / headings / ending observed | Deliberate difference in 879 |
| --- | --- | --- |
| HU 008 | Byline and subject announcement; many isolated short lines, comparison table and firm case story; rights exhortation and related-service tail | Direct job-duration question; no borrowed case story; four issue headings and a closing date/document task |
| HU 009 | General difficulty claim, then Korea comparison; statutory list without issue H2s; broad advice about preparing early | Hungary's own verified program rule; continuous explanatory paragraphs; travel and employer calendars rather than a general warning |
| HU 015 | Parenthetical Taipei restaurant scope, then address problem; question-style transition; contact and administrative-change reminder | Visa/insurance/tax/next-status topics; one contact paragraph before a concrete final action |

Dropped or not stated: euro maintenance-fund minimum from an older PDF (direct retrieval failed); remaining quota availability; family admission under independent visas; a promised switch to resident status in Taiwan; 2027 minimum-wage figures; Hungarian tax-law conclusions. No rule is inferred from EU membership.

## 880 — Hungarian company, Taiwan contracting entity and capital

File: `drafts/hu/880-hungarian-company-taiwan-subsidiary-branch-setup.md`.

Reader and trigger: a Hungarian enterprise planning its first locally operated Taiwan customer contract and deciding whether the counterparty should be a subsidiary, a branch of the Hungarian company, or an office confined to representative activity.

Country fit: the [MOF treaty list](https://www.mof.gov.tw/singlehtml/191?cntId=63930) confirms Hungary's comprehensive income-tax agreement, signed 19 April 2010 and effective 29 December 2010. This is the country-specific tax-planning fact used. The separate research agent also found actual bilateral goods trade in the [MOFA Hungary profile](https://www.mofa.gov.tw/CountryInfo.aspx?CASN=1&n=164&s=104&sms=33&tabs=4ADF97FA97C9828B). That supports transaction plausibility, not measured demand for subsidiaries; no trade figures appear in the article. The small-company reader profile remains a labelled editorial hypothesis.

Overlap and new angle: older HU 001/004 are broad establishment/comparison topics with Korean assumptions; they are not linked. HU 015 covers premises and is linked as a distinct follow-on. The new article narrows the decision to the Hungarian contracting entity, foreign-investment approval, the remitter's identity and sequencing. English 507's post-investment inspection rights and Spanish 656's complex director routes were read but not crowded into this entry-stage article.

### Claim → source ledger

| Claim used | Official source | Chinese excerpt or checked passage |
| --- | --- | --- |
| Taiwan company has legal personality | Company Act, [J0080001 article 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=1) | `依照本法組織、登記、成立之社團法人` |
| Limited company can have one shareholder | Company Act, [article 98](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=98) | `有限公司由一人以上股東所組成` |
| Contribution-limited liability; abuse causes a particular company debt, repayment is plainly difficult, and seriousness/necessity require shareholder liability | Company Act, [article 99](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=99) | `以其出資額為限`; `股東濫用公司之法人地位，致公司負擔特定債務且清償顯有困難，其情節重大而有必要者，該股東應負清償之責` |
| Full payment of limited-company capital | Company Act, [article 100](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=100) | `應由各股東全部繳足，不得分期繳款或向外招募` |
| Branch registration before operating in the foreign company's name | Company Act, [article 371](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=371) | `非經辦理分公司登記，不得以外國公司名義…經營業務` |
| Branch operating funds and representative | Company Act, [article 372](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=372) | `應專撥其營業所用之資金，並指定代表為…負責人` |
| Representative-office registration | Company Act, [article 386](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=386) | `派其代表人…設置辦事處者，應申請主管機關登記` |
| Foreign legal entities included | Statute for Investment by Foreign Nationals, [J0040002 article 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=3) | `本條例所稱外國人包括外國法人` |
| Investment application, plan and amendments | Same statute, [article 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=8) | `檢附投資計畫及有關證件，向主管機關申請核准。投資計畫變更時，亦同` |
| Approved contribution deadline, verification and extension | Same statute, [article 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=9) | `於核定期限內全部到達`; `於期限屆滿前…申請…延展`; `應向主管機關申請審定投資額` |
| Work permission does not follow from incorporation | Employment Service Act, [N0090001 article 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | `除本法另有規定外，外國人未經雇主申請許可，不得…工作` |
| Representative activity; no general minimum capital but sufficient startup costs and CPA verification; registration sequence | [Invest Taiwan Chinese procedure/table](https://investtaiwan.nat.gov.tw/showBusinessPagejpnInvestmentStatus01?lang=cht&search=InvestmentStatus01) | `法律行為及聯絡工作`; `無最低資本額要求…會計師查核簽證…足敷設立成本`; `申請公司名稱` → `申請僑外投資` → `申請審定投資額` → `設立登記` → `稅籍登記` |
| Foreign head office bears branch liabilities | Same Invest Taiwan table; corroborated by [official Gold Card explanation](https://goldcard.nat.gov.tw/en/why-taiwan/foreign-startups-in-taiwan-3-options-for-foreign-corporate-entities-to-set-up-companies-in-taiwan/) | `外國總公司就分公司未清償之債務負連帶責任`; branch has no independent corporate personality |
| Hungary comprehensive income-tax agreement in force | [MOF agreement list](https://www.mof.gov.tw/singlehtml/191?cntId=63930) | `匈牙利…2010/04/19…2010/12/29` |

The English Invest Taiwan page was indexed but timed out on full opening; its Chinese counterpart was successfully opened and read, including the capital table and application steps. Some unrelated tax/director rows on the official table are old; no such row was used to establish a current tax rate or board requirement.

### Opening deletion test and comparison

Kept the first factual sentence's separate-personality distinction between subsidiary and branch, with both official sources embedded there. Cut the standalone source-explanation sentence that repeated why this distinction matters. Kept the short instruction to choose the contracting entity before the company name: it turns that distinction into the reader's immediate decision. Kept the second paragraph's questions about who quotes, supplies, invoices, handles defects and employs the local worker. Cut its final summary sentence because these concrete tasks already define the entry-stage problem without an invented client story.

| Comparator | Pattern avoided | Choice in 880 |
| --- | --- | --- |
| HU 008 | Byline/topic announcement and narrated firm result | Legal-entity consequence at once; no claimed experience or success |
| HU 009 | General warning followed by a long statutory list | A decision about who contracts, then capital sequence and the verified Hungary treaty fact |
| HU 015 | Premises-first restaurant scenario and generic change-warning ending | Premises linked separately; the final paragraph assigns responsibility for outstanding approvals and contracts |

Dropped or not stated: Korean treaty rates/PE tests; an automatic Hungarian treaty exemption; a guaranteed processing duration; an unverified authentication route for Hungarian corporate records; a universal minimum capital number borrowed from manager work-permit rules; listing or audit/inspection rights irrelevant to the first contract. No claim of Hungarian legal/advisory qualification is made.

## 881 — Hungary-resident heir and Taiwan procedure calendars

File: `drafts/hu/881-hungarian-heir-taiwan-estate-deadlines-documents.md`.

Reader and trigger: a Hungary-resident heir notified of a death leaving Taiwan accounts or real property, especially when debts and documents are incomplete. The reader needs to distinguish the succession law from the three separate procedural calendars.

Country fit: an explicitly labelled practical hypothesis, not measured evidence of frequent Hungary–Taiwan inheritance disputes. The local value is document preparation from Hungary, Hungarian/Taiwan name consistency and refusal to assume that Hungarian residence or an EU document resolves Taiwan choice of law. No Hungarian inheritance-law rule is stated.

Overlap and new angle: HU 016 is a broad inheritance/minor-protection article and remains the internal link. The new draft concentrates on remote documents, time of knowledge, tax filing, land registration and the limited-debt rule. It does not reproduce the structural sources' French legalisation chain, Arabic-country scenarios or Italian-law assumptions.

### Claim → source ledger

| Claim used | Official source | Chinese excerpt checked |
| --- | --- | --- |
| Decedent's nationality at death; Taiwan-national heir proviso | Choice-of-Law Act, [B0000007 article 58](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=58) | `繼承，依被繼承人死亡時之本國法`; `中華民國國民應為繼承人者，得就其在中華民國之遺產繼承之` |
| Multiple nationalities | Same Act, [article 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=2) | `依其關係最切之國籍定其本國法` |
| Renvoi | Same Act, [article 6](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=6) | `如依其本國法就該法律關係須依其他法律而定者，應適用該其他法律` |
| Situs law for real rights | Same Act, [article 38](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=38) | `關於物權依物之所在地法` |
| Renunciation in writing to court within three months from knowledge; notice to resulting heirs with impossibility exception | Civil Code, [B0000001 article 1174](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1174) | `於知悉其得繼承之時起三個月內，以書面向法院為之`; `應以書面通知…但不能通知者，不在此限` |
| Inherited-debt liability generally limited to inherited property | Civil Code, [article 1148(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1148) | `以因繼承所得遺產為限，負清償責任` |
| Inventory within three months; court may extend on necessary application | Civil Code, [article 1156](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1156) | `知悉其得繼承之時起三個月內開具遺產清冊陳報法院`; `認為必要時，得延展之` |
| Loss of limit: serious concealment, serious false inventory, fraudulent disposal | Civil Code, [article 1163](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1163) | `隱匿遺產情節重大`; `遺產清冊為虛偽之記載情節重大`; `意圖詐害…債權人…而為遺產之處分` |
| Estate-tax filing generally six months from day after death; special starting points preserved | Estate and Gift Tax Act, [G0340072 article 23](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340072&flno=23) | `死亡之次日起算六個月內`; special court-appointed administrator and later-final-title provisions also checked |
| Written extension before deadline, ordinarily up to three months, special-circumstances exception | Same Act, [article 26](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340072&flno=26) | `期限屆滿前，以書面申請延長`; `以三個月為限。但因不可抗力或其他有特殊之事由者…` |
| Tax documentation for transfer registration | Same Act, [article 42](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340072&flno=42) | `稅款繳清證明書，或核定免稅證明書…或同意移轉證明書`; `不得逕為移轉登記` |
| Foreign land-right reciprocity must be examined | Land Act, [D0060001 article 18](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060001&flno=18) | `以依條約或其本國法律，中華民國人民得在該國享受同樣權利者為限` |
| Inheritance land registration within six months; discretionary late fine | Land Act, [article 73](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060001&flno=73) | `自繼承開始之日起，六個月內為之`; `每逾一個月得處…罰鍰` — translated as may be fined, not automatic |

Bank/form/translation paragraphs are preparation recommendations, not a universal bank document checklist or a claim that a Hungarian instrument is automatically recognised. The debt paragraph is confined to the current Taiwan succession regime.

### Opening deletion test and comparison

Kept the numerical opening's three-month rule together with its express Taiwan-law condition. Kept the following sentence's knowledge-based starting point and written court filing. Cut the standalone statutory-attribution sentence and moved its citation into the opening conditional rule. Kept the instruction to preserve the date of knowledge because it identifies evidence the remote heir needs. Kept the second paragraph's applicable-law inquiry, decedent-nationality rule, Taiwan-national exception and consequence that the heir's Hungarian residence alone does not determine succession law. Removing these conditions would make the opening misleading.

| Comparator | Pattern avoided | Choice in 881 |
| --- | --- | --- |
| HU 008 | Claimed firm story and rights exhortation | A conditional deadline with no fictitious experience; concrete dated family messages at the end |
| HU 009 | General difficulty premise and list of exceptions | Separate succession/tax/land calendar table, with each start date and source |
| HU 015 | Long address lookup discussion followed by generic administrative caution | Remote inheritance documents, exact powers in a mandate, and identifying the next deadline's missing papers |

Dropped or not stated: Hungary-specific land reciprocity outcome; Hungarian judgment recognition; apostille sufficiency or a complete Hungary-to-Taiwan legalisation chain; automatic acceptance of an EU certificate; Hungarian inheritance tax; family shares/reserved portions; a general extension of renunciation for translation delays. These matters were either unverified or outside the narrow topic.

## Checks and remaining measurement limitation

All three articles use distinct I11/I08/I26 image-menu entries with Hungarian descriptions and the required illustrative caption. There is no public author footer, invented human review claim, telephone number or additional office address. Each CTA states the available consultation languages, advance language arrangement, safe first-contact information and the absence of a mandate merely from an email.

The prescribed command was actually run on all three paths:

`PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <three hu paths>`

It returned exit 2: language cannot be inferred. An explicit `--lang hu` trial also returned exit 2 because hu is not supported. This is measurement unavailable, not zero-FAIL/PASS. No other language profile was substituted and no shared checker was changed. Hungarian prose was checked separately against section 5; final diagnostic values and file counts follow after repairs. The author delivers the requested drafts despite this tool-support limit and does not describe them as publication-approved.

### Final counts and version identity

Main-text counts include headings and table text, exclude frontmatter and the Sources tail, replace Markdown links with their labels, remove heading/table markup, and normalize whitespace to single spaces. Words are whitespace-delimited; characters include spaces. Raw-file counts include metadata, source URLs and Markdown syntax. Counts are author packaging measurements, not the unavailable Hungarian variety-check output.

| Article | Main-text words | Main-text characters | Raw-file words | Raw-file characters |
| --- | ---: | ---: | ---: | ---: |
| 879 | 673 | 5,162 | 965 | 9,222 |
| 880 | 713 | 5,524 | 979 | 10,268 |
| 881 | 790 | 6,031 | 1,088 | 10,579 |

SHA256:

```text
879 e7939a4ceb36415507d79432edf758e520e4545a3b27a1e3cbc027c711b0645f
880 f421f2b709a1487f71abfaebbe11de5f65b38c9fdc0f30d4c899ecfd6a96c3e9
881 6b57f7c93892e687f39096e0850536e4fa6dc2f6541ceb8cca87cb864f0a9b2c
```

### Section 5 author self-check

1. The required checker was attempted and is unavailable for hu, as recorded above. No zero-FAIL result is claimed. A separate transparent diagnostic used Unicode word units and sentence boundaries at `.?!` followed by a capital letter (including Hungarian accented capitals), excluding headings, table rows and Sources from prose metrics. The figures below are supplementary diagnostics, not a supported language profile or a substitute official PASS.
2. The three openings differ: 879 asks the reader's job-duration question; 880 states the contracting-entity consequence; 881 starts with a conditional three-month period. None uses a stock invented-case introduction. No invented actual client is presented.
3. Each draft has more than two very short sentences (up to eight word units); no prose paragraph contains more than one sentence above 32 word units. Legal conditions remain intact. The 879 as-of date was separated from article 7 and the 183-day threshold to avoid numeric crowding.
4. Reading paragraph openings vertically gives a maximum of two uses of any first word in each article. Adjacent identical sentence-start words occur twice in 879, twice in 880 and zero times in 881.
5. No three-paragraph sequence repeats claim–citation–caveat. Citations are integrated in different sentence positions; each draft also has practical preparation paragraphs without legal claims requiring citations. No sentence ends with a parenthetical statute citation.
6. No repeated `nem … hanem …` contrast template or invented opposing claim is used. Necessary negative scope statements (for example, visitor status does not supply a residence document) remain because removing them would change the legal message.
7. Final body paragraphs prescribe the issue-specific next step: put the job offer beside the entry/work dates; assign owners to approvals and identify contracting entities; preserve dated family notices and flag documents needed for the nearest deadline. The contact paragraphs precede these endings.
8. Hungarian professional register is consistent. No bold, public author footer, invented first-person lawyer account, imperative checklist heading or unsupported human-review claim appears. Korean/Japanese ending rules are inapplicable.
9. Compared the repaired legal sentences against the claim/source tables: citation numbers, deadlines, amounts, must/may distinctions, conditions and exceptions remain. In 879, `meghatározott munkáltató` preserves the NHI rule without importing permanent employment; in 881, `az alkalmazandó joggal kapcsolatos` avoids confusing applicable law/renvoi with party choice of law. The branch paragraph retains sector-specific additional permissions. Final legal review additionally identified two substantive scope defects in 880; the author restored the causal incurrence of the company debt in article 99 and the requirement for granted work permission in article 43, as recorded below.

| Article | Prose sentences | Length CV | Sentences ≤8 word units | Share | Similar-length three-sentence runs / sentence pairs | Maximum repeated paragraph opener |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 879 | 50 | 0.495 | 14 | 28.0% | 4.1% | 2 |
| 880 | 49 | 0.520 | 11 | 22.4% | 4.2% | 2 |
| 881 | 56 | 0.462 | 13 | 23.2% | 3.6% | 2 |

For the supplementary similar-length diagnostic, both successive length changes in a three-sentence run must be within 25% of the preceding sentence; the denominator is the number of sentence pairs. These numeric values support the manual review only and are not output from `variety_metrics.py`.

### Independent review and structural verification

Independent research role `hu_official_facts` supplied official Hungarian program/treaty evidence without authoring manuscript text. Independent AI locale editor `hu_language_review` read all three manuscripts and the three same-language comparators. After the full editorial review, it returned PASS for 881, PASS for 879 after narrowly rechecking the NHI article agreement and separated tax as-of sentence, and PASS for 880 after narrowly rechecking the two subsequent legal corrections below. These final editorial verdicts correspond to the hashes above. The reviewer did not edit the manuscripts. This is bounded AI editorial review, not human native-speaker or lawyer certification.

Final source reviewer `hu_final_review` identified two substantive corrections in 880. Article 99 previously linked abuse only to repayment difficulty; the final sentence now also expressly requires that abuse caused the company to incur the particular debt. Article 43 previously said employer permit application; the final sentence now requires permission granted on the employer's application, with statutory exceptions preserved. The author reran `tools/law.py J0080001 99` and `tools/law.py N0090001 43` through the scoped cache method and applied both repairs. The independent locale reviewer verified natural Hungarian and preserved cumulative conditions in final 880. These are legal-scope corrections, not style-only changes.

Structural checks found the exact frontmatter field order, three FAQ entries each, valid title/SEO/summary lengths, five H2 headings each including Sources, unique 4–9-word English slugs with Hungarian nationality cues, distinct menu images, existing Hungarian internal-link slugs, all external body sources represented in the source tails, and no bold or body H1. Ruby's standard YAML parser successfully parsed all three frontmatters; no dependency was installed. All 29 unique cited statute provisions have retrieved article text in the assigned cache (879: 5; 880: 11; 881: 13).

Independent final reviewer `hu_final_review` returned legal/source PASS for all three final hashes above after reading back both repaired 880 passages. It independently fetched all 12 cited LawAll pages without writing files and confirmed all 29 cited provisions against the verified cache. It also checked the relevant commencement histories, BOCA Hungary conditions, MOFA NHI guidance, the MOF Hungary treaty entry, Invest Taiwan and eTax calendar-year guidance. It authored none of the articles and made no manuscript edits.

Final evidence limits: the prescribed Hungarian automated variety check remains unavailable; supplementary metrics and independent AI editorial review are recorded separately. The final reviewer could not open the live `/hu/contact` page with its browsing tool; contact details, language/service limits and safe-first-inquiry wording were checked against the expressly supplied firm facts in `briefs/BRIEF.md`, not a claimed live form test. No human native-speaker, lawyer-review, publication, deployment or completed automatic Hungarian style-gate result is claimed. The three requested author drafts and this evidence note are complete.
