# Slovenian author record — columns 894–896

Date: 24 October 2026. Locale: sl. Assigned topics retained: B-DIST, P-WORK, L-HEIR. These are local drafts, not published articles. Author: AI editorial role; no human native-speaker or lawyer-review claim.

## Scope and reading

Only `drafts/sl/` and this file are write targets. No git commands, installation, publication, repository modifications, other-locale edits or messages to external parties were performed.

Read `briefs/BRIEF.md` and `briefs/ASSIGNMENTS.md` completely. Read `repo/docs/columns/EDITORIAL-VOICE.md`, `repo/docs/columns/FRONTMATTER.md`, `briefs/IMAGE-MENU.md`, `rules/SENTENCE-VARIETY-RULE.md` and `rules/LESSONS.md`. The two rule files are byte-identical to the requested `/Users/son7/tseng-lanes-shared/` copies, which were also read. Read `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`; its linked `/Users/son7/agent-library/knowledge/editorial-voice.md` is absent on this host, so the repository house-style copy was used as its instructions permit. Historical Fable gates were not applied.

Three complete same-locale comparators selected: `repo/src/content/columns-sl/008-taiwan-labor-severance-law.md`, `009-taiwan-voluntary-resignation-severance.md` and `012-taiwan-overtaking-accident-liability.md`. These establish `Pravne informacije o Tajvanu`, `N min branja`, and the date form `24. oktobra 2026`. Also inspected the frontmatter and relevant terminology of 014 and 016, but do not count those partial inspections as complete comparator reads.

Read the assigned structural sources in full, with smaller rereads where tool output was truncated:

- B-DIST: `repo/src/content/columns-en/353-terminating-taiwan-distributor-us-exporter.md`; `repo/src/content/columns-fr/676-french-supplier-taiwan-distributor-termination-stock-online-accounts.md`.
- P-WORK: English 705, 704, 706 and 352 under `repo/src/content/columns-en/`.
- L-HEIR: French 677, Italian 687, Arabic 702 and English 016 under their respective `repo/src/content/columns-*/` directories.

The read-only market-research agent read both briefs and all of `research/country-facts.md`, then independently fetched the relevant official government pages. Findings are listed below. Unverified ledger material was not used. The tseng-law-editorial skill and its `references/review-criteria.md` were read and applied; independent AI reviews are recorded at the end of this note.

## Statute verification and commencement

Every statute citation in the drafts was printed by the supplied `tools/law.py` before use. Existing `html/<PCODE>.html` files all exceeded the helper's cache threshold, so the helper did not create or replace caches. Subsequently, freshly fetched official LawAll article blocks were compared in memory with the helper's cached blocks: all blocks matched for B0000001, B0000007, N0090001, A0030295, D0080132, D0060001, G0340072 and I0050021. No fresh HTML was written to disk.

Commands included:

```text
python3 tools/law.py B0000001 148 250 252 254 259 345 558 561 1147 1148 1156 1162 1163 1174
python3 tools/law.py B0000001 1162-1 1162-2 1175
python3 tools/law.py B0000007 20 38 58
python3 tools/law.py B0000007 2 6
python3 tools/law.py N0090001 43 46 48
python3 tools/law.py A0030295 4 5 9 15 16
python3 tools/law.py D0080132 22
python3 tools/law.py G0340072 23 26 41
python3 tools/law.py G0340072 59
python3 tools/law.py D0060001 18 73
python3 tools/law.py I0050021 20
```

Not all checked provisions were ultimately cited. The article-level claim tables below identify those actually used.

- Civil Code: helper printed the unenforced banner. [Official history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001) confirms the pending provisions are 166-1 and the amendment to 1223 promulgated 17 August 2026, the latter effective six months after promulgation. Neither is used. The cited contract/succession provisions are currently operative. Source sections explicitly identify the 24 October 2026 state of law.
- Personal Data Protection Act: helper printed the unenforced banner. [Official history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=I0050021) lists the pending 2023/2025 changes, which do not change the cited Article 20. Its relevant 2015 amendment took effect on 15 March 2016. Do not confuse current Article 20 with pending new Article 20-1.
- Foreign Professionals Act: [official commencement history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295), fetched live via curl after web-tool access errors, states the September 2025 revision generally took effect on 1 January 2026; the specified portion of Article 4 and Articles 28/29 took effect on 30 June 2026. All cited provisions were effective by the review date.
- Estate and Gift Tax Act: [official history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=G0340072) confirms the 11 September 2026 revision includes Articles 23 and 26. Article 59, also checked, states commencement on promulgation except the specifically identified 2001 amendments. The current provisions, including special tax-filing starting points, were used.

## 894 — Slovene supplier changing its Taiwan distributor

File: `drafts/sl/894-slovenian-supplier-taiwan-distributor-exit-stock.md`.

Reader and trigger: a Slovenian equipment supplier wants to move new orders to another Taiwan partner while the incumbent still holds spare parts, equipment and service obligations. The opening is explicitly fictional. The decision is how to align termination, physical stock and open service orders.

Country fit: editorial hypothesis, not measured search demand. Taiwan's official [Slovenia trade dossier, 18 June 2026](https://www.trade.gov.tw/Files/PageFile/725730/725730brmf520260618175107.pdf) identifies electric motors among Taiwan's 2025 imports from Slovenia. The research agent read the text; PDF screenshot retrieval failed. No volume, ranking, growth or number derived from that PDF appears in the article. A motor/spare-parts example is a plausible transaction choice, not a claim about any actual client.

Overlap and new angle: the shared Slovenian collection contains company formation and sector-entry material, not a distribution exit article. English 353 is a broad US exporter treatment; French 676 emphasizes remaining stock and online accounts. This draft centers on installed equipment and after-sales servicing, avoids the US unpaid-invoice opener and France cosmetics/importer angle, and links to the new Slovenian work-permit article for the supplier's visiting technician.

### Claim → checked official source

| Claim and preserved condition | Source | Chinese text actually checked |
|---|---|---|
| Commercial agent acts in the principal's name within a place/territory and is not its manager. | [Civil Code 558](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=558) | 非經理人而受商號之委託，於一定處所或一定區域內，以該商號之名義 |
| Purchase/resale must be distinguished through the actual transaction; sale exchanges property rights and a price. | [Civil Code 345](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=345) | 一方移轉財產權於他方，他方支付價金 |
| Valid party choice governs contractual obligations; otherwise closest connection. | [Choice of Law Act 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) | 依當事人意思定其應適用之法律；…無明示…或…無效時，依關係最切之法律 |
| Three-month notice is for indefinite commercial agency; no-notice exception requires unavoidable termination for a cause not attributable to the terminating party. | [Civil Code 561](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=561) | 代辦權未定期限者…應於三個月前通知他方；因非可歸責於自己之事由，致不得不終止契約者 |
| Good faith applies to exercising rights and performing duties. Practical recommendation to review tolerated shortfalls is an inference, not a fixed notice rule. | [Civil Code 148](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=148) | 行使權利，履行義務，應依誠實及信用方法 |
| Contractual penalty may be agreed; a court may reduce an excessive amount, not guaranteed reduction. | [Civil Code 250](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=250), [252](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=252) | 當事人得約定…應支付違約金；約定之違約金額過高者，法院得減至相當之數額 |
| Restitution after a valid rescission is subject to other law/agreement; ending the framework does not itself rescind every prior sale. | [Civil Code 259](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=259) | 契約解除時…回復原狀之義務，除法律另有規定或契約另有訂定外 |
| Ordinary customer personal-data use by private organizations generally remains within necessary scope of collection purpose, subject to statutory exceptions. No blanket transfer permission claimed. | [PDPA 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0050021&flno=20) | 非公務機關…除第六條第一項所規定資料外，應於蒐集之特定目的必要範圍內為之。但…得為特定目的外之利用 |

First-two-paragraph deletion test, sentence by sentence: keep the motor-maker/spares/service sentence because it identifies the transaction and marks it fictional; keep the next sentence because it identifies the two operative handover questions. Keep the contract/order/inventory sentence because it specifies evidence needed before notice; keep the payment-and-order attribution sentence because it distinguishes ownership/purpose of each item; keep the spare-part-for-open-claim sentence because it explains why a single “unsold stock” label is inadequate. Drafting cuts: no generic “Slovenian companies face complex challenges abroad” or roadmap sentence was retained. Later editing of these openings, if any, is recorded below.

Three-comparator comparison: 008 opens with the named lawyer and a scope preview, has fragmented case narration and a rights-warning ending; 009 opens with a first-person backward reference, numbered exceptions and a general timing lesson; 012 opens with generalized road-safety context, then rule/case/checkpoint headings and a broad disclaimer. This draft uses one marked fictional commercial trigger, one question heading plus three issue headings, and ends on assigning each open order and service-transfer date. No source comparator's lawyer experience, cases or footer were reused. Comparator display dates all read 13 September 2025; lastmod values are 7 October 2026 (008), 10 September 2026 (009/012).

Dropped or avoided: a universal dealer-protection rule; automatic goodwill compensation or absence of all possible compensation; a universal stock-buyback rule; a fixed notice period for buy/sell distributors; a right to seize all online accounts; automatic customer-data transfer; trade statistics; purported Slovenia–Taiwan litigation reciprocity. Payment-order and trademark disputes were left outside this narrow servicing/handover article.

## 895 — Slovenian professional moving to Taiwan with family

File: `drafts/sl/895-slovenian-professional-taiwan-work-permit-residence.md`.

Reader and trigger: a Slovene passport holder has an employment start date while authorization is still pending and is considering moving family members. The article separates entry, actual work approval, the possible direct ARC application and dependent status.

Country fit: verified Slovenia-specific 90-day visitor eligibility and absence from the current working-holiday partner list distinguish this route from several neighboring-country articles. These are legal-route facts, not evidence of the number of Slovenian workers or search demand. Audience need remains an editorial hypothesis.

Overlap and new angle: shared Slovenian 008/009/014 address employment termination or minimum service, not a Slovene passport holder's entry/work/residence sequence. English 705 compares many residence categories; this draft omits student, Mandarin, digital-nomad and entrepreneur routes to focus on offer timing and family relocation. It links to existing Slovenian 014 for a later contractual employment issue.

### Claim → checked official source

| Claim and preserved condition | Source | Chinese text actually checked, or official-page evidence |
|---|---|---|
| Slovenian nationals: up to 90 days; ordinary passport valid six months; onward/return arrangements and entry screening; stay counted from next day. | [BOCA visa-exempt entry](https://www.boca.gov.tw/fp-149-4486-7785a-1.html) | Official list includes Slovenia under “up to 90 days”; “validity of at least 6 months”; return/onward ticket; “starts from the day after arrival.” Published 17 July 2026. |
| Slovenia not listed as a current working-holiday partner; no inference that work is prohibited by nationality. | [MOFA full partner table](https://youthtaiwan.mofa.gov.tw/workingholidayen/cp.aspx?n=6426) | Full table freshly fetched by researcher; Slovenia absent. Page footer updated 10 April 2026. |
| Employer must obtain approval before work unless statutory exception applies; an application or signed contract is insufficient. | [Employment Service Act 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | 除本法另有規定外，外國人未經雇主申請許可，不得…工作 |
| Specialized/technical work is a permitted category, with separate qualifications/review standards. | [ESA 46](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=46) | 一、專門性或技術性之工作；其工作資格及審查標準…定之 |
| Employer generally applies to MOL; identified teaching categories go to MOE. | [Foreign Professionals Act 5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | 除本法另有規定外…向勞動部申請許可；但…向教育部申請許可 |
| Special-professional status needs the statutory/announced expertise, not nationality alone. | [FPA 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=4) | 外國特定專業人才…具有中央目的事業主管機關公告…特殊專長…或…認定具有特殊專長者 |
| Eligible special professional may personally apply for Gold Card; four functions; one-to-three-year validity. | [FPA 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | 得逕向內政部移民署申請…工作許可、居留簽證、外僑居留證及重入國許可四證合一；有效期間為一年至三年 |
| Gold Card is unsponsored and open rather than tied to one employer. | [Official Gold Card explanation](https://goldcard.nat.gov.tw/en/about/) | “apply online without sponsorship”; “open-work rights”. No tax/NHI marketing claims from this page reused. |
| Qualified professional/special professional entering visa-exempt or on visitor visa, authorized/exempt for professional work, may apply directly; ARC only after approval. | [FPA 16(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | 以免簽證或持停留簽證入國，經許可或免經許可…從事專業工作者，得…申請居留；經許可者，發給外僑居留證 |
| Family route: ordinary professional actually doing professional work or special professional, approved residence/permanent residence; spouse, minors, disabled adult children unable to care for themselves; qualifying visitor entry. | [FPA 16(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | 外國專業人才在我國從事專業工作及外國特定專業人才，經…許可居留或永久居留者，其配偶、未成年子女及因身心障礙無法自理生活之成年子女 |
| Category/entry-specific NIA instructions, not a universal conversion entitlement. | [NIA 0915 guide](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | Current guide updated 14 April 2026; route conditions and excluded entry arrangements checked. |
| Resident-visa route ARC application within 30 days from day after entry; integrated-document exception preserved. | [Immigration Act 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | 入國後之翌日起算三十日內…申請外僑居留證。但…四證合一…或其他已含有外僑居留證功能…得免申請 |
| Spouse's personal work-permit route only for special/senior professional's spouse with approved dependent residence; permit cannot outlast that residence. | [FPA 15(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15) | 外國特定專業人才及外國高級專業人才之配偶…許可…依親居留者，得逕向勞動部申請許可；…不得逾其依親居留期間 |

Opening deletion test: retain the question about starting while permission is pending because it sets the precise decision; retain the linked permit rule because it answers that question with the approval condition; retain the short signed-contract sentence because it resolves the reader's likely evidence confusion. Paragraph two retains start-date/approval alignment and the concrete job/employer/place/status information. On independent review, cut “Iz teh podatkov je mogoče preveriti, katera pot ustreza zaposlitvi in ali bo treba premakniti prvi delovni dan.” The preceding sentences already establish that purpose. Also excluded a draft concept that would simply have said “entry, work and residence are different”; the specific approval distinction does that work.

Comparison with 008/009/012: replace first-person exposition and inherited Korean comparisons with a direct pending-permit question. Four headings follow actual documents and family status without numbered checklist commands. The ending identifies the evidence/approval still needed for each family member, not a broad warning about rights or a copied CTA/disclaimer conclusion. The same three comparator dates and exact paths recorded above apply.

Dropped or avoided: a Slovene working-holiday option; promise of Slovenian-language consultation; an unverified universal wage threshold; automatic approval based on a degree or nationality; tax-treaty advice, insurance coverage, permanent-residence promises, a generalized EOR prohibition and unrestricted work rights for all dependent spouses.

## 896 — Heir signing from Slovenia for a Taiwan estate

File: `drafts/sl/896-slovenian-heir-taiwan-estate-documents-deadlines.md`.

Reader and trigger: an heir resident in Slovenia needs to authorize Taiwan banking/estate steps and may face a renunciation deadline before documents are ready. A possible individual Slovenian heir's land eligibility is expressly unresolved, not presumed from EU membership or residence.

Country fit: Taiwan MOFA assigns Slovenia to its Austria office; the official municipal land-reciprocity table contains a legal-person condition for Slovenia. These make the document and land checks concretely Slovenian. No volume of mixed families, deaths, holdings or inheritance inquiries is claimed.

Overlap and new angle: shared Slovenian 016 is a broad family/succession/minor-protection discussion. English 016 supplies the general structure, Italian 687 the renunciation/debt distinction, French 677 the document/mandate preparation, and Arabic 702 the nationality-first rule. This draft prioritizes signing from Slovenia, evidence of the date of knowledge, Austria-office confirmation and the individual-versus-legal-person land caveat. It does not import France's legalization process or an Italian probate assumption.

### Claim → checked official source

| Claim and preserved condition | Source | Chinese text actually checked |
|---|---|---|
| Decedent's nationality at death starts the succession-law analysis; Taiwan-national heir safeguard limited to Taiwan assets. | [Choice of Law Act 58](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=58) | 依被繼承人死亡時之本國法。但…中華民國國民應為繼承人者，得就其在中華民國之遺產繼承之 |
| Multiple nationality requires closest connection; renvoi can change the applied law. | [Choice of Law Act 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=2), [6](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=6) | 有多數國籍時，依其關係最切之國籍；…須依其他法律而定者，應適用該其他法律…應適用中華民國法律者，適用中華民國法律 |
| Where Taiwan succession law applies, renunciation in writing to court within three months of knowledge of entitlement; written notice to those succeeding because of it unless impossible. | [Civil Code 1174](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1174) | 知悉其得繼承之時起三個月內，以書面向法院為之；應以書面通知…但不能通知者，不在此限 |
| Current general inherited-debt liability limited to inherited estate, not unlimited merely because renunciation was missed. | [Civil Code 1148(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1148) | 以因繼承所得遺產為限，負清償責任 |
| Inventory within three months of knowledge; court may extend on application if necessary. Not transposed to renunciation. | [Civil Code 1156](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1156) | 知悉其得繼承之時起三個月內…陳報法院；法院因繼承人之聲請，認為必要時，得延展之 |
| Without inventory, creditors still paid proportionately from estate, preserving priority. | [Civil Code 1162-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1162-1) | 仍應按其數額，比例計算，以遺產分別償還。但不得害及有優先權人之利益 |
| Breach can create liability beyond inheritance for unsatisfied entitled portion; incapacity exception preserved. | [Civil Code 1162-2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1162-2) | 應受清償而未受償部分…不以所得遺產為限。但…無行為能力人或限制行為能力人，不在此限 |
| Loss of limit for serious concealment, serious inventory falsity, creditor-defrauding disposition; seriousness/intent retained. | [Civil Code 1163](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1163) | 隱匿遺產情節重大；虛偽之記載情節重大；意圖詐害…債權人…而為遺產之處分 |
| Slovenia covered by Taiwan representative office in Austria; precise authentication chain to confirm per document. | [MOFA Slovenia profile](https://www.mofa.gov.tw/CountryInfo.aspx?CASN=1&n=487&s=93&sms=33&tabs=4ADF97FA97C9828B) | 駐館(或兼轄該國館處)：無（由駐奧地利代表處兼轄） |
| Tax return generally six months from day after death; special court-appointed-administrator and subsequently established ownership triggers preserved. | [Estate and Gift Tax Act 23](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340072&flno=23) | 死亡之次日起算六個月內；自法院選任遺產管理人之次日起算；自判決確定或文書作成之次日起算六個月內…補申報 |
| Written extension request with proper reason before filing deadline; ordinarily up to three months, force majeure/special circumstances excepted. | [Estate and Gift Tax Act 26](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340072&flno=26) | 具有正當理由…期限屆滿前，以書面申請延長；以三個月為限。但因不可抗力或其他有特殊之事由者…核定 |
| Foreign land rights depend on reciprocity; no personal Slovenian heir entitlement inferred. | [Land Act 18](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060001&flno=18) | 以依條約或其本國法律，中華民國人民得在該國享受同樣權利者為限 |
| Published Slovenia row is conditional and tied to legal-person capacity; current individual case must be confirmed. | [New Taipei official land table](https://www.land.ntpc.gov.tw/News.aspx?PageSize=200&n=13377&page=1&sms=9730) | 附條件平等互惠之國家；准許斯洛維尼亞人以法人身分在我國取得或設定土地權利。Cites MOI 0980161108, 7 September 2009. |
| Inheritance land-registration period six months from opening; succession opens at death. | [Land Act 73](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060001&flno=73), [Civil Code 1147](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1147) | 其係繼承登記者，得自繼承開始之日起，六個月內為之；繼承，因被繼承人死亡而開始 |

Opening deletion test: retain information-only versus closure/receipt powers because the concrete mandate distinction determines what the heir signs. Retain the Slovenia-signing/bank coordination sentence because it identifies actors and timing before authentication. On independent review, cut “Splošen obrazec lahko pusti odprto prav tisto dejanje, zaradi katerega ga potrebuje.” It restated the mandate-scope concern. In paragraph two retain the three event dates and proof requirement because the article separates knowledge, death and institutional deadlines; retain the simultaneous-bank-enquiry/filing sentence because it identifies the actionable timing problem. No fictional death/client scene was invented. A general statement about “cross-border inheritances being complex” was excluded.

Comparison with 008/009/012: starts from the verbs in a document, not a first-person introduction, generalized concern or hypothetical narrative. Headings use nationality, a knowledge-triggered period, Slovenian paperwork and distinct tax/land proceedings; final body sentence returns to the actual dated message proving knowledge. No recycled three-part checklist or sales conclusion. Same three comparator paths and dates apply.

Dropped or avoided: automatic individual Slovenian land ownership; any claim that all EU citizens have reciprocity; a confirmed Slovenia-specific inheritance exception to the published land row; exact Slovenian authentication/apostille chain, translation format or attendance requirements; automatic acceptance of a Slovenian succession decision; a Slovenian-law shares/tax analysis; guaranteed extra time while translations are prepared; future Civil Code 1223 reserved-share rules. The land row is from a compilation identified in the ledger as May 2021 and cites a 2009 order; a later country-specific determination was not verified. The article therefore reports what the published table says and requires a current individual check.

## Packaging and section 5 self-check

Count method: remove YAML; separate the main text before `## Viri`; render Markdown links as visible labels; remove heading markers; collapse whitespace to single spaces. Word count is whitespace-delimited; character count includes spaces. Main-text counts include substantive headings and contact text, but exclude metadata/FAQ and sources. A second body count includes sources. Raw file-byte counts are not substituted for reader-visible character counts.

| File | Main words | Main characters | Body including sources: words | Body including sources: characters |
|---|---:|---:|---:|---:|
| `drafts/sl/894-slovenian-supplier-taiwan-distributor-exit-stock.md` | 688 | 4,896 | 755 | 5,321 |
| `drafts/sl/895-slovenian-professional-taiwan-work-permit-residence.md` | 757 | 5,227 | 854 | 5,885 |
| `drafts/sl/896-slovenian-heir-taiwan-estate-documents-deadlines.md` | 827 | 5,748 | 932 | 6,407 |

Packaging check passed for exact YAML field order, quoted dates, localized category/date/read time, SEO-title/summary lengths, three FAQ objects per file, three-to-five tags, four substantive H2s, no body H1/bold, assigned numbers and unique country-cued ASCII slugs, three distinct IMAGE-MENU choices, real same-locale internal targets, complete body/source URL coverage (contact/email excluded from the bibliography), and 650–950 main words. Python's optional YAML module was unavailable; the installed Ruby standard YAML parser parsed all three frontmatters successfully, then Python checked the decoded fields. Nothing was installed. The 31 distinct article-level statutory citations (9/8/14) all appear in the checked set above.

The three hero-image paths exactly match the supplied menu. The read-only snapshot does not contain the corresponding `repo/public` image files; image delivery/rendering was not validated. This author task does not claim a live-page or publication result.

The prescribed commands were run against each draft with `--lang sl`. All returned exit 2: `invalid choice: 'sl'`; available languages are ko, ja, en, zh-hant, th, id, hi, fr, de, it, es, pt, ar, vi. Slovenian therefore has no automated FAIL-0 certificate. Running another language mode as if it validated Slovenian would be misleading and was not done.

Manual section 5 checks: (2) three different opening types—marked hypothetical business trigger, reader's pending-authorization question, concrete mandate distinction; (3) each has at least two short sentences; (4) paragraph start words at most twice after repairs; (5) no three-paragraph claim/citation/caveat chain and each contains nonlegal preparation paragraphs without citations; (6) necessary distinctions are tied to actual reader decisions, no invented adversarial rebuttal; (7) endings concern service allocation, family approvals and dated knowledge evidence; (8) no bold, invented first person, author footer or imperative checklist headings; (9) article numbers, modalities, conditions, time triggers, source links and fictional marking checked against the source table. Supported-language register rules are inapplicable to Slovenian, which uses consistent professional prose.

A supplemental author diagnostic, not the official validator, separates sentences only at punctuation followed by an uppercase letter/digit, avoiding ordinary Slovene article-number periods before lower-case `člen`. Its initial length CV was 0.389/0.466/0.380; short-sentence fractions 12.8%/20.0%/12.5%; repeated three-sentence similar-length runs 17.8%/0%/5.6%; paragraph-start repetition maximum 2. These figures exposed 894/896 rhythm for human-like reading by the independent AI reviewer; they do not establish a validated Slovenian metric PASS. Later changes and final metrics are recorded below.

## Independent review and final version record

Independent AI Slovenian reviewer `/root/sl_locale_review` did not author the drafts. First report: 894 PASS, 895 REQUEST_CHANGES, 896 PASS. Its 895 finding quoted “Ko ima upravičeni strokovnjak odobreno prebivanje…” and independently checked Article 16(2): the ordinary professional must actually perform professional work in Taiwan, while special professionals form a separate limb. This was a substantive clarification restoring an omitted condition. Revised text states the actual-work condition, the required approved residence/permanent residence, each qualifying relative, visitor-entry condition and ARC approval. The reviewer reread all revised body text and surrounding conditions and returned PASS for all three exact versions below.

Optional repairs applied: `zadnje potrditve naročil`; split the notice-content sentence from “Kopijo in dokaz o prejemu ohranite”; expand ARC at its first body appearance; explicitly name the Austria office as recipient of the document inquiry; use `s strani pravnih oseb`; describe the lawyer–client relationship as `razmerje med odvetnikom in stranko`; delete the two redundant opening sentences quoted above. Their legal conditions were preserved. The reviewer judged the lower supplemental length CV in 894/896 insufficient grounds to introduce artificial sentences; manual variety review passed. The one concrete notice split improves clarity independently of metrics.

Independent final AI reviewer `/root/sl_final_legal_review`, who neither authored nor modified the articles, returned PASS for all three exact hashes below on 24 October 2026. No repairs were requested. The reviewer independently ran `tools/law.py` for all 31 cited provisions and matched live official article text against the eight existing law caches; checked commencement/history, the agency/distribution distinction, FPA Article 16 family conditions, inheritance-liability exceptions and each deadline trigger; corroborated Slovenia entry, working-holiday, consular and conditional land-reciprocity sources; and confirmed contact/language facts against the [live Slovenian contact page](https://tseng-law.com/sl/contact). Final filesystem read matched the frozen manuscripts. No reviewer file/cache writes occurred.

Completed status: three locally validated author drafts and this evidence note. Independent AI locale and final legal-evidence reviews both PASS the same versions. This is not attorney certification, human-native review or publication authorization. Remaining evidence limits: no supported Slovenian automated variety result; selected comparison samples are not asserted to be the latest three publications; rendered images were not independently inspected; individual Slovenian land entitlement still needs case-specific confirmation.

| Article | SHA-256 accepted by independent AI locale and final legal-evidence reviewers |
|---|---|
| 894 | `1226d9dd4572b26a41522f4f6d99f00a879559c815a49b5bd8504ffc012da81d` |
| 895 | `87ec86924d3a1c59da12d9c1a15647a9361b8f734132d004c3f02af9a1ac4d00` |
| 896 | `3012a854088f446419b5aca8ff00d5963ed610243c201c873ec375105b6b660b` |

Final supplemental, nonvalidated diagnostic: length CV 0.384/0.480/0.380; short-sentence fractions 12.5%/23.1%/10.7%; maximum repeated paragraph-opening word count 2 in each. No validated Slovenian numerical/style clearance is claimed. Independent reading found no remaining required locale correction; changing sentences merely to force a language-unsupported coefficient was rejected as padding.
