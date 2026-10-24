# Lithuanian author note — columns 897–899

Checked: 24 October 2026. Locale: `lt`. Assignment: B-SETUP, P-WHV or P-WORK, B-TM. Deliverables are local drafts, not published articles. All authorship and independent review in this task were performed by AI; no attorney or human native-speaker review is claimed.

## Deliverables and counts

| No. | File | Topic | Body words | Body characters including spaces |
|---|---|---|---:|---:|
| 897 | `drafts/lt/897-lithuanian-laser-company-taiwan-subsidiary-branch.md` | B-SETUP / company | 719 | 5,990 |
| 898 | `drafts/lt/898-lithuanian-engineer-taiwan-work-permit-residence.md` | P-WORK / visa | 760 | 6,174 |
| 899 | `drafts/lt/899-lithuanian-brand-taiwan-distributor-trademark-registration.md` | B-TM / company | 691 | 5,640 |

Counts cover the visible main body, including subheadings, contact paragraph and final practical sentence. They exclude YAML/frontmatter and the `Šaltiniai` section. Markdown links are counted by their visible labels, not URLs; heading markers are removed. Words are whitespace-separated; character counts include spaces and line breaks. Unicode lexical-token counts are respectively 722, 763 and 694. Full-file character counts, including metadata, URLs and sources, are respectively 10,754, 10,714 and 9,271.

## Reading and scope

Read in full: `briefs/BRIEF.md`, `briefs/ASSIGNMENTS.md`, `briefs/IMAGE-MENU.md`; `repo/docs/columns/EDITORIAL-VOICE.md` and `FRONTMATTER.md`; `rules/SENTENCE-VARIETY-RULE.md`, `rules/LESSONS.md`; `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`; `/Users/son7/tseng-lanes-shared/variety/MULTILINGUAL-METHOD.md`; the tseng-law-editorial skill and its review criteria. The two local rules files were byte-compared with the corresponding `/Users/son7/tseng-lanes-shared/` files and are identical. The older voice-rule file's additional `/Users/son7/agent-library/knowledge/editorial-voice.md` reference was absent; the current repository voice guide was available and read.

Read the complete Lithuanian comparator articles 008 (`taiwan-labor-severance-law`), 014 (`taiwan-mandatory-employment-period`) and 016 (`taiwan-inheritance-custody-analysis`). Their category is exactly `Teisinė informacija apie Taivaną`; the drafts preserve their Lithuanian date and reading-time patterns, not their older narrative defects.

Read all structural sources for the selected topics: English 001, 004 and 507 plus Spanish 656 for B-SETUP; English 705, 704, 706 and 352 for P-WORK; French 675 and Italian 685 for B-TM. Country-specific material, legal text, dates and exceptions were independently checked instead of inherited from those articles. Korean tax-treaty material was excluded.

`research/country-facts.md` was not present when research started. It appeared later; its reading/version caveats and Lithuanian rows were checked against the independent research. The relevant verified rows agree: ordinary-passport visa-free eligibility up to 90 days; Lithuania absent from the current working-holiday partner list; Lithuania absent from the complete list of comprehensive income-tax agreements in force. Those list absences are dated inferences, not findings that no agreement could ever be signed or that every other immigration route is barred. Unrelated land, marriage, driving and migrant-worker rows are not used.

P-WORK was selected from the assignment's offered alternatives because a Lithuanian working-holiday program was not verified in the complete official partner table. The table, not its inconsistent introductory partner count, controls this finding. No substitute outside the assigned reader groups was needed.

No repository, shared research, other locale, git, deployment or package-installation mutation was performed. Manuscript and evidence-cache writes stayed in `drafts/lt/`; this note is the sole work-file write. The shared work-state service records task status separately from these deliverables.

## How statutes and official facts were verified

Every statute article cited in the drafts was fetched and printed with the unchanged `tools/law.py`. That script hardcodes a shared `html/` cache outside the author's permitted paths. It was executed through `runpy` with only that cache-path expansion redirected to `drafts/lt/.law-cache`; the parser, official MOJ URLs, retrieval logic and article selection were not changed. A reproducible invocation is:

```python
import os, runpy, sys
original_expanduser = os.path.expanduser
def author_cache(path):
    if path == '~/tseng-world-columns-20261024/html':
        return os.path.abspath('drafts/lt/.law-cache')
    return original_expanduser(path)
os.path.expanduser = author_cache
sys.argv = ['tools/law.py', 'J0070001', '2', '6', '19', '30', '42', '48', '57', '58']
runpy.run_path('tools/law.py', run_name='__main__')
```

| Law / code | Articles printed and checked | Version or commencement finding |
|---|---|---|
| Company Act / 公司法 / J0080001 | 1, 4, 7, 98, 99, 100, 371, 372, 380, 386 | Amendment date 2025-12-26. The later commencement of article 387-1 does not affect the cited provisions. Article 4 was research only. |
| Statute for Investment by Foreign Nationals / 外國人投資條例 / J0040002 | 4, 7, 8, 9 | Amendment date 1997-11-19; cited provisions in force. Article 4 was research only. |
| Employment Service Act / 就業服務法 / N0090001 | 43, 46, 48, 57 | Amendment date 2025-01-20; cited provisions in force. Article 48 was research only. |
| Act for the Recruitment and Employment of Foreign Professionals / 外國專業人才延攬及僱用法 / A0030295 | 4, 5, 9, 15, 16 | Amendment date 2025-09-24. Official commencement order made the relevant provisions effective on 2026-01-01. The separately deferred provisions effective 2026-06-30 are not the basis of these claims. An exploratory request for article 34 returned NOT FOUND and was not used. |
| Immigration Act / 入出國及移民法 / D0080132 | 22 | Amendment date 2023-06-28; cited provision in force. |
| Trademark Act / 商標法 / J0070001 | 2, 6, 19, 30, 42, 48, 57, 58 | The 2023 amendments relevant here took effect on 2024-05-01. The pending-amendment banner concerns the separate 2022 amendments to 68, 70 and 95–97; none is used. |

Commencement checks used official histories: [Company Act](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0080001), [Foreign Professionals Act](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295), [Trademark Act](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0070001). The Trademark Act history is also in article 899's sources. Every source tail carries the 24 October 2026 check date.

Official non-statute evidence and limits:

| Source | Verified finding used | Limit |
|---|---|---|
| [MOFA, 2026-09-04](https://www.mofa.gov.tw/News_Content.aspx?n=96&s=123017) | Taiwan–Lithuania laser collaboration involving advanced semiconductor packaging; official Chinese title includes `台灣與立陶宛先進半導體封裝異質整合雷射技術合作備忘錄`. | Supports a concrete industry connection, not search volume, a particular company's demand, or the success of an investment. |
| [MOF comprehensive income-tax agreement table](https://www.mof.gov.tw/singlehtml/191?cntId=63930), page updated 2026-09-04 | Lithuania is absent from the complete comprehensive agreement table checked on 2026-10-24. | An inference from the listed agreements; no claim about all narrow transport agreements or unsigned negotiations. |
| [BOCA visa-exempt entry](https://www.boca.gov.tw/fp-149-4486-7785a-1.html), published 2026-07-17 | Lithuania up to 90 days; ordinary passport validity, onward/return reservation and admission conditions; counting begins the next day. | Does not establish permission to work or a guaranteed admission. |
| [MOFA working-holiday partners](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6426) | Lithuania absent from the complete current partner table. | Dated program-list inference, not a permanent statutory prohibition. No partner-count claim used. |
| [Official Gold Card explanation](https://goldcard.nat.gov.tw/en/about/) | Four functions; open work permission without a prearranged employer; one to three years. | Eligibility must still be established. Incidental tax information on this site is not used. |
| [NIA residence application instructions](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news), updated 2026-04-14 | Relevant professional-worker routes after visa-free or visitor-visa entry and application documents. | Not a universal visitor-to-resident conversion entitlement. |
| [InvestTaiwan comparison](https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01) | The official indexed table distinguishes commercial operations from representative-office liaison/legal acts; no general minimum capital, CPA certification, incorporation-cost coverage and sector-specific exceptions. | Direct page retrieval timed out. The exact official indexed text was retrieved through targeted search, not an inferred successful HTTP fetch. |

Capital claims were additionally corroborated against the accessible [Taipei government company-capital FAQ](https://www.gov.taipei/News_Content.aspx?n=EEC70A4186D4C828&s=CC44DD1ADE73A66D&sms=87415A8B9CE81B16) and Company Act article 7. A Small and Medium Enterprise Administration startup FAQ returned HTTP 403 and was not retained as a manuscript source. The InvestTaiwan limitation is retained here even though the legal reviewer accepted the indexed official text plus independent corroboration.

## 897 — Lithuanian manufacturer establishing local operations

### Reader, trigger, relevance and overlap

Reader: a Lithuanian laser or electronics manufacturer whose Taiwanese customer expects local installation, warranty service and spare parts. The opening's three-year service request is explicitly hypothetical. Trigger: a quotation cannot be finalized until the contracting entity and warranty responsibility are identified.

Country fit is supported by the MOFA laser collaboration above. The narrower search intent—someone comparing a Taiwan subsidiary, branch and representative office while pricing local service—is an editorial hypothesis, not measured search demand. No trade totals, customer numbers or firm experience are asserted.

The entity comparison overlaps the assigned structural sources and the existing generic formation corpus. The new angle is responsibility for a Lithuanian equipment contract, service costs, actual technical activities, the absence of an assumed Lithuania-specific comprehensive tax treaty, and staff authorization before operations. It is not a translation of Korean tax figures or a generic incorporation checklist. The trademark cross-link points to new article 899.

### Claim → official source → checked Chinese text

| Claim in the article | Article and URL | Checked Chinese excerpt / limitation |
|---|---|---|
| A Taiwan company is a separate registered juridical person. | [Company Act 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=1) | `本法所稱公司，謂以營利為目的，依照本法組織、登記、成立之社團法人。` |
| A limited company may have one or more shareholders. | [Company Act 98](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=98) | `有限公司由一人以上股東所組成。` The FAQ separately preserves investment approval and activity restrictions. |
| Limited liability has a cumulative abuse exception, including necessity. | [Company Act 99](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=99) | `各股東對於公司之責任，除第二項規定外，以其出資額為限。` / `股東濫用公司之法人地位，致公司負擔特定債務且清償顯有困難，其情節重大而有必要者，該股東應負清償之責。` All conditions retained. |
| A foreign company needs branch registration to conduct business in its own name in Taiwan. | [Company Act 371](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=371) | `外國公司非經辦理分公司登記，不得以外國公司名義在中華民國境內經營業務。` |
| Branch operations need allocated funds and a designated Taiwan responsible representative. | [Company Act 372](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=372) | `應專撥其營業所用之資金，並指定代表為在中華民國境內之負責人。` |
| Closing the branches does not extinguish the foreign company's outstanding debts. | [Company Act 380](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=380) | `未了之債務，仍由該外國公司清償之。` |
| A representative office is registered when the company has no intention of opening a branch to conduct business. | [Company Act 386](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=386) | `外國公司因無意在中華民國境內設立分公司營業，未經申請分公司登記而派其代表人在中華民國境內設置辦事處者，應申請主管機關登記。` Activity boundaries are also supported by the official InvestTaiwan table. |
| Investment applications include the plan/documents; plan changes also require approval. | [Foreign Investment Statute 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=8) | `應填具投資申請書，檢附投資計畫及有關證件，向主管機關申請核准。投資計畫變更時，亦同。` |
| Approved contributions must arrive within the approved period; inspection, extension and investment-amount verification are separate steps. | [Foreign Investment Statute 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=9) | `應將所核准之出資於核定期限內全部到達，並將到達情形報請主管機關查核。` / `但有正當理由者，應於期限屆滿前，申請主管機關核准延展。` / `於實行出資後，應向主管機關申請審定投資額` |
| Company registration capital must be CPA examined and certified. | [Company Act 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=7) | `公司申請設立登記之資本額，應經會計師查核簽證` The general minimum-capital and incorporation-cost statements use the official agency table, not article 7 alone. |
| Limited-company capital must be paid in full, not in installments. | [Company Act 100](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=100) | `公司資本總額，應由各股東全部繳足，不得分期繳款或向外招募。` |
| Restricted industries need the competent sector authority's permission or consent. | [Foreign Investment Statute 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=7) | `投資人申請投資於法律或基於法律授權訂定之命令而限制投資之事業，應取得目的事業主管機關之許可或同意。` No claim that a specific laser activity is automatically restricted or permitted. |
| Registering the company does not itself authorize a foreigner's work. | [Employment Service Act 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | `除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。` Statutory exceptions preserved. |
| The Lithuanian industry link and dated absence from the comprehensive treaty list. | [MOFA laser report](https://www.mofa.gov.tw/News_Content.aspx?n=96&s=123017); [MOF table](https://www.mof.gov.tw/singlehtml/191?cntId=63930) | Non-statute findings documented above; the absence finding is expressly an inference from the complete table. No purported Chinese statutory excerpt is invented for it. |

### First-two-paragraph deletion test

| Sentence / action | Why |
|---|---|
| Keep `Taivano klientas prašo ... trejiems metams (hipotetinis pavyzdys).` | Establishes the local service/parts obligation and its expressly hypothetical status. |
| Keep `Pasiūlyme dar neaišku, kas pasirašys sutartį ...` | Identifies the unresolved counterparty and warranty issue; it does not repeat the service request. |
| Cut `Nuo šio sprendimo priklauso, kokį padalinį verta steigti.` | Merely restated the title's entity-choice question. |
| Cut `Tokiam projektui yra konkretus bendradarbiavimo kontekstas:` | Empty introduction before the specific MOFA evidence. |
| Keep the MOFA September 2026 sentence. | Supplies verified country-specific relevance, without inventing a customer or demand figure. |
| Keep `Savo įmonės planą reikia išskaidyti į darbus ...` | Translates the opening obligation into distinct activities needed for the entity decision. |
| Keep `Kiekvienai veiklai priskirkite sutarties šalį ir atsakingą komandą.` | Adds responsibility allocation; the prior sentence only identifies activities. |

### Comparison with three existing Lithuanian columns

| Comparator | Opening / headings / ending difference in 897 |
|---|---|
| 008 | Replaces first-person lawyer narration with a marked hypothetical quotation problem; uses customer-contract and capital issues rather than fragmented broad legal explanations; ends on the named warranty entity, not a generic request to seek help. |
| 014 | Replaces an introductory definition and numbered exposition with a concrete equipment-service transaction; four issue-specific unnumbered headings organize entity choice, capital, documents and operations; the final deliverable is a completed quotation field, not a checklist recap. |
| 016 | Replaces a broad roadmap with two unresolved contract roles; headings follow this manufacturer's decisions rather than an omnibus procedure; no byline/disclaimer footer or summary conclusion is copied. |

Dropped or narrowed claims: Korean treaty rates and permanent-establishment thresholds; any presumed Lithuania–Taiwan comprehensive tax relief; an unsupported universal foreign-manager capital threshold; automatic permission to work following incorporation; a demand or profitability claim inferred from the laser MOU; and an absolute shareholder-liability shield. No Taiwan/Lithuania foreign-law conclusion is offered.

## 898 — Lithuanian engineer, work authorization and residence

### Reader, trigger, relevance and overlap

Reader: a Lithuanian engineer planning laboratory, optical-system or customer-site work, potentially with a spouse and children. Trigger: the employer proposes a start date and the reader assumes an ordinary passport and signed contract are enough.

The Lithuania-specific visa-exempt route is verified by BOCA, and the working-holiday alternative was rejected from the complete MOFA partner table. MOFA's laser collaboration supports the choice of technical examples, but the proposed reader/search demand remains a labelled editorial hypothesis. The article does not claim numbers of Lithuanian engineers, Gold Card success rates or a current client case.

The assigned English sources supply the distinction between entry, permission to work and residence. The new structure follows a Lithuanian engineer's job description, employer application, possible Gold Card, ARC route and family applications. It does not repeat the existing 008 severance article or 014 minimum-employment-period analysis; the latter is linked for the separate contract issue.

### Claim → official source → checked Chinese text

| Claim in the article | Article and URL | Checked Chinese excerpt / limitation |
|---|---|---|
| A contract, visa-free entry or overseas payroll does not by itself authorize work in Taiwan. | [Employment Service Act 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | `除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。` The article's territorial wording supports examining actual work in Taiwan; it does not decide every meeting/assignment classification. |
| The general professional-worker employer application goes to the Labor Ministry, subject to statutory exceptions and specified education work. | [Foreign Professionals Act 5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | `除本法另有規定外，應檢具相關文件，向勞動部申請許可` The full printed provision's education-ministry exception was checked and preserved. |
| Professional or technical work is an enumerated employment category. | [Employment Service Act 46(1)(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=46) | `專門性或技術性之工作。` A job title alone is not represented as proving eligibility. |
| The employer cannot assign work outside the permit. | [Employment Service Act 57(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=57) | `指派所聘僱之外國人從事許可以外之工作。` This is an item in the list of prohibited employer acts. |
| Special foreign professionals require officially designated specialist expertise. | [Foreign Professionals Act 4(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=4) | `外國特定專業人才：指外國專業人才具有中央目的事業主管機關公告之` ... `特殊專長` The ellipsis is an abbreviated excerpt, not a purported closed list. |
| A qualifying specialist may apply directly to NIA for the four-in-one Gold Card, valid one to three years. | [Foreign Professionals Act 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | `得逕向內政部移民署申請核發具工作許可、居留簽證、外僑居留證及重入國許可四證合一之就業金卡。` / `就業金卡有效期間為一年至三年` Eligibility and approval are not assumed. |
| A professional authorized or exempt to perform professional work after visa-free/visitor entry may apply directly for residence. | [Foreign Professionals Act 16(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | `以免簽證或持停留簽證入國，經許可或免經許可在我國從事專業工作者，得逕向內政部移民署申請居留；經許可者，發給外僑居留證。` Permission to apply is not guaranteed residence. |
| Resident-visa entrants with residence permission apply for ARC within 30 days counted from the day after entry, subject to the combined-document exception. | [Immigration Act 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | `應於入國後之翌日起算三十日內，向移民署申請外僑居留證。` / `其他已含有外僑居留證功能之證件者，得免申請外僑居留證。` This is not described as a general visa-free-visitor deadline. |
| Qualifying family members can use the direct residence application route after the professional's residence/permanent residence is granted. | [Foreign Professionals Act 16(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | `經內政部移民署許可居留或永久居留者，其配偶、未成年子女及因身心障礙無法自理生活之成年子女，以免簽證或持停留簽證入國者，得逕向內政部移民署申請居留` Family categories and entry conditions retained. |
| A qualifying spouse of a special/senior professional with dependent residence may apply for their own work permission; validity cannot exceed dependent residence. | [Foreign Professionals Act 15(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15) | `外國特定專業人才及外國高級專業人才之配偶，經內政部移民署許可在我國依親居留者，得逕向勞動部申請許可` / `該工作許可期間不得逾其依親居留期間。` Not generalized to every professional's spouse. |
| Lithuania's entry conditions, absence from WHV partners, open Gold Card work permission and NIA procedure. | [BOCA](https://www.boca.gov.tw/fp-149-4486-7785a-1.html); [MOFA](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6426); [Gold Card](https://goldcard.nat.gov.tw/en/about/); [NIA](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | Official non-statute evidence and its dated scope are recorded above. English-source administrative rules are not mislabelled as Chinese statute quotations. |

### First-two-paragraph deletion test

| Sentence / action | Why retained or changed |
|---|---|
| Keep the opening question about immediate laboratory work after visa-free entry. | It combines the actual activity, nationality, entry route and signed-contract misconception. It is a question, not an invented case. |
| Keep `Sutartis ir atvykimas savaime teisės dirbti nesuteikia.` | Directly answers the question in a short sentence. |
| Keep the article 43 sentence. | Supplies the legal basis and expressly preserves exceptions. |
| Keep the BOCA sentence with `iki 90 dienų`. | Establishes the verified nationality-specific entry period; `up to` is retained. |
| Keep `Terminas skaičiuojamas nuo kitos dienos po atvykimo.` | Adds the counting start, not a repeated period. |
| Keep the ordinary-passport validity/reservation/admission sentence. | Adds essential conditions omitted by a bare 90-day claim. |
| Keep the temporary-document sentence. | Prevents treating every Lithuanian travel document as an ordinary passport. |

No whole sentence in these two paragraphs was removed because each adds either the concrete question, answer, authority or an entry condition. Later wording was repaired: `neatstoja atitikties` became `neįrodo atitikties`; literal residence terminology was replaced with consistent `leidimas gyventi` and `rezidento viza (Resident Visa)`. Documents demonstrate compliance with criteria; they do not establish the criteria themselves.

### Comparison with three existing Lithuanian columns

| Comparator | Opening / headings / ending difference in 898 |
|---|---|
| 008 | Opens with a bounded work-permission question, not an attorney's account; headings separate employer permission, Gold Card, residence and family; closes with authorized dates in the travel plan rather than broad employment advice. |
| 014 | Does not begin with a term definition or duplicate the minimum-period analysis; links that distinct contract issue instead. Only one substantive heading is a question, the other headings name the missing permit, alternative application and family. The ending supplies a timing record, not a numbered checklist. |
| 016 | Avoids a general immigration roadmap introduction and numbered catch-all chapters; entry/work/residence distinctions are tied to this engineer and eligible relatives. The last sentence concerns three concrete calendar entries, with no author footer. |

Dropped or unverified claims: Lithuanian working-holiday eligibility; salary cutoffs or approval times not verified for a specific route; automatic Gold Card eligibility for engineers; automatic spouse work permission; automatic residence on receiving a job offer; guaranteed admission; and any equivalence between the 90-day entry period and tax residence. No universal remote-work or short-assignment exemption is asserted.

## 899 — Lithuanian brand before or after distributor filing

### Reader, trigger, relevance and overlap

Reader: a Lithuanian equipment manufacturer appointing a Taiwanese distributor who will handle a Latin-letter mark, a proposed Chinese name or local trademark applications. Trigger: the manufacturer is asked to approve a logo but has not seen the applicant identity and goods/services in the application; alternatively, the distributor has already filed in its own name.

The laser/electronics connection is grounded in the MOFA report already recorded for 897. A Lithuanian exporter needing this particular distributor dispute is a plausible editorial hypothesis, not a verified event, dispute rate or search-volume claim. The article presents conditional decisions and does not invent a client story.

The French/Italian structural sources overlap on distributor registration, opposition, invalidation and transfers. This article's specific contribution is the Lithuanian manufacturer's Latin/Chinese naming workflow, optoelectronic product/service descriptions, applicant-agent-distributor distinctions, consent evidence and separate dates for multiple registrations. The five-year bar under article 30(1)(12) is carefully separated from the bad-faith exceptions for other grounds. New article 897 is linked for the different entity-formation decision.

### Claim → official source → checked Chinese text

| Claim in the article | Article and URL | Checked Chinese excerpt / limitation |
|---|---|---|
| The application must identify the applicant, mark and designated goods/services. | [Trademark Act 19](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=19) | `申請商標註冊，應備具申請書，載明申請人、商標圖樣及指定使用之商品或服務` |
| Taiwan trademark rights require the Taiwan statutory registration route; a Lithuanian certificate does not replace it. | [Trademark Act 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=2) | `欲取得商標權` ... `者，應依本法申請註冊。` No conclusion about Lithuanian law or automatic worldwide protection. |
| A legal entity may apply if it intends to conduct the designated goods/services business. | [Trademark Act 19](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=19) | `第一項之申請人，為自然人、法人` ... `而欲從事其所指定商品或服務之業務者。` The intention condition appears in both body and FAQ. |
| Applicants without Taiwan domicile/business premises must appoint an agent satisfying article 6's location and professional requirements. | [Trademark Act 6](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=6) | `但在中華民國境內無住所或營業所者，應委任代理人辦理之。` The full provision's agent qualifications were checked; no unsupported claim that any distributor is qualified. |
| Multiple classes are possible; similarity is not confined to classification. | [Trademark Act 19](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=19) | `並得指定使用於二個以上類別之商品或服務。` / `類似商品或服務之認定，不受前項商品或服務分類之限制。` |
| Prior use, same/similar marks and goods/services, relationship-based knowledge, imitation intent and consent exception are distinct conditions. | [Trademark Act 30(1)(12)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=30) | `相同或近似於他人先使用於同一或類似商品或服務之商標，而申請人因與該他人間具有契約、地緣、業務往來或其他關係，知悉他人商標存在，意圖仿襲而申請註冊者。但經其同意申請註冊者，不在此限。` The manuscript does not reduce this to mere prior Lithuanian registration. |
| Anyone may oppose on statutory grounds within three months after registration publication. | [Trademark Act 48](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=48) | `任何人得自商標註冊公告日後三個月內，向商標專責機關提出異議。` Publication, not discovery, starts the period. |
| Invalidation requires the relevant standing and statutory ground. | [Trademark Act 57](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=57) | `利害關係人或審查人員得申請或提請商標專責機關評定其註冊。` The company's route is as an interested party; the article does not say anyone may file invalidation. |
| The five-year limit covers the paragraph 12 ground; bad-faith exceptions named here apply to paragraph 9 and 11, not 12. | [Trademark Act 58](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=58) | `第三十條第一項第九款至第十五款` ... `自註冊公告日後滿五年者，不得申請或提請評定。` / `第三十條第一項第九款、第十一款` ... `係屬惡意者，不受前項期間之限制。` |
| An unregistered trademark transfer cannot be asserted against third parties. | [Trademark Act 42](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=42) | `商標權之移轉，非經商標專責機關登記者，不得對抗第三人。` This is not restated as invalidity between the parties. |

### First-two-paragraph deletion test

| Sentence / action | Why retained or changed |
|---|---|
| Keep the article 19 application-content sentence. | Starts with the precise document whose content the reader must inspect, with a direct statutory link. |
| Keep the manufacturer's request for the whole application draft. | Applies the legal requirement to the concrete distributor handoff. |
| Keep `Vien paveikslėlio patvirtinimo nepakanka ...` | Explains the missing applicant/scope information when only artwork is approved. |
| Keep the Latin-letter/Chinese-name sentence. | Adds the separate-application risk instead of repeating the first application example. |
| Keep `Kas bus įrašytas kiekvienoje?` | A short question focuses on applicant identity across those applications. |
| Keep the applicant/goods/notice-recipient sentence. | Adds control of official correspondence and a practical record to obtain. |

No whole sentence in these two paragraphs was deleted. `Kiniškas vardas` was replaced with the more precise `pavadinimas kinų kalba`. The SEO title was corrected to identify the Lithuanian brand, not incorrectly describe the Taiwanese distributor as Lithuanian. The two non-immigration titles were changed from questions so all three titles do not use the same construction.

### Comparison with three existing Lithuanian columns

| Comparator | Opening / headings / ending difference in 899 |
|---|---|
| 008 | Starts with an application field and linked law instead of first-person experience; the headings distinguish roles, evidence, publication time and transfers; ends on each registration's date, not generalized advice. |
| 014 | Avoids a definition-led numbered checklist; legal requirements arise from the applicant's file and consent documents. The short deadline heading is unique to this issue; the ending is a per-registration record rather than a recap of legal tests. |
| 016 | Does not announce a broad guide or split the subject into numbered generic stages. Four substantive headings follow mark ownership and evidence, with a concrete publication-date ending and no disclaimer/byline footer. |

Dropped or narrowed claims: an actual Lithuanian distributor dispute; an assumed frequency of bad-faith filings; automatic Taiwan protection from Lithuania/EU registration; automatic approval of the Chinese name; every bad-faith registration being challengeable without time limit; a Lithuanian registration alone proving a well-known mark; and automatic transfer of domain/platform accounts with the trademark. The invalidation ground and evidence must fit the particular application.

## Sentence variety, final review and remaining limits

The required command was run separately on each final file:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <file>
exit 2: ERROR measurement unavailable: cannot infer language ...; supply --lang
```

An explicit `--lang lt` attempt also returned exit 2 because Lithuanian is not an accepted language. Supported choices are `ko, ja, en, zh-hant, th, id, hi, fr, de, it, es, pt, ar, vi`. Consequently an official automated `FAIL 0` result was unavailable. No other language profile was substituted, and no tool or shared rule file was modified. This is an unresolved tooling limitation, not a passing automated result.

A separate author diagnostic removed YAML, the source tail, headings and link destinations; masked the abbreviations `m.`, `d.`, `str.`, `El.` and `el.`; split sentences at punctuation followed by uppercase Lithuanian letters or digits; and counted Unicode lexical tokens. It is not a calibrated Lithuanian analyzer or the prescribed tool. Results for the final text:

| Article | Sentences under this heuristic | Length CV | Sentences at most 8 tokens | Similar-length consecutive triples |
|---|---:|---:|---:|---:|
| 897 | 53 | 0.455 | 20.8% | 23.5% |
| 898 | 54 | 0.465 | 22.2% | 17.3% |
| 899 | 50 | 0.506 | 26.0% | 8.3% |

The same approximate 25%-from-triplet-mean rule was used for all three texts. These numbers are diagnostics only; abbreviation and sentence-boundary choices affect them. A final semicolon in 897 joins the closely related investment-plan approval and changed-plan approval requirements without dropping either. Accuracy takes priority over shortening the cumulative article 99 and trademark article 30 conditions.

Section 5 self-check was completed for each article: more than two short sentences; no paragraph opener used more than twice and no adjacent duplicate opener; no run of three claim/exception sentences following an identical pattern; practical paragraphs with no statute citation; fewer than three repetitive contrast constructions; long legal-condition sentences surrounded by shorter explanatory sentences; and no all-question heading set. The openings are respectively a marked hypothetical, a concrete question and a document-content fact. The endings are respectively a quotation's named warranty entity, a travel/work/family calendar and each trademark's publication date. Contact paragraphs occur before those endings. There is no bold, body H1, author footer, fabricated experience or generic concluding summary.

Independent AI review was performed by `lt_language_review` and `lt_legal_review`, with official-country-source research by `lt_official_sources`. Review fixes included the complete Company Act article 99 necessity condition; a separate article 372 link; mandatory CPA wording and article 7 citation; Employment Service Act article 57(3) support; the trademark FAQ's intended-business condition; the SEO party correction; residence terminology; and varied titles. Both reviewers accepted the final drafts. The last sentence join in 897 received a separate bounded language and legal recheck at the final hash. This is AI editorial/legal-source review, not a human attorney opinion or native-speaker certification.

| Article | Final SHA-256 | Independent AI review |
|---|---|---|
| 897 | `7a257f8b02bee6f58a1a84dd8376b62653fc9c8355ea4085d4f44e38a8cae8dc` | Language PASS; legal/source PASS; final bounded sentence recheck PASS. |
| 898 | `7560db694fc470f6e902a784dc537ee8586ab4ecbf3834ddd263e1ae1a637f36` | Language PASS; legal/source PASS. |
| 899 | `fa6dfd1b6d4476ca1fd89f35ac849492229bfc7f5c61a2916a443f20804e9b84` | Language PASS; legal/source PASS. |

Packaging checks: valid YAML with the exact 16 fields in the required order; three FAQs each; exact locale category; correct dates and author; SEO titles within 30–60 characters and summaries within 110–170; four substantive H2 headings plus Sources; every external body source included in the source tail; valid existing/new internal column slugs; unique numbered filenames and country-cued ASCII slugs. Images are three different menu entries, I08, I04 and I29, with localized descriptions and illustration captions. Images were selected from the supplied menu, not generated or newly licensed in this task.

Remaining limits: no official automated Lithuanian sentence-variety PASS; the InvestTaiwan direct-fetch limitation described above; no human legal or native-speaker review; no publication or rendered-site verification requested or performed. These limits do not change the recorded statute retrievals, official-country findings, or completed manuscript files.
