# Hebrew author work note — 24 October 2026

Assignment: `he`, columns 858–860, B-TRADESECRET / B-SETUP / P-WORK. The recommended topics were retained. These are original Hebrew articles for Israeli companies and professionals, not translations of the structural sources. No publishing, git operations, installation, or changes to another locale or the repository snapshot were performed.

## Reading and verification scope

Read BRIEF.md, ASSIGNMENTS.md, IMAGE-MENU.md, the repository's EDITORIAL-VOICE.md and FRONTMATTER.md, both supplied rules files, the shared sentence-variety rule and current LESSONS.md, and the COLUMN-VOICE-RULE.md pointer. `~/agent-library/knowledge/editorial-voice.md` was absent on this machine. The full repository copy, including the no-bold and internal-author/public-byline distinction, supplied the operative house rules. The user's abolition of automatic Fable workflows takes precedence over the old pointer's gate language.

Same-language comparison set read in full: Hebrew 008, 009 and 015. Their exact category strings, Hebrew date format and `N דקות קריאה` pattern were used. Their older first-person narration, repeated cautionary endings, Korean comparisons and public author conventions were not carried forward.

Structural sources read: German 682; English 001, 004, 507 and Spanish 656 for setup; English 705, 704, 706 and 352 for employment/residence. Country-specific Korean and US tax conclusions were not imported. The sources informed issue selection, not a claim that the new drafts received the prior articles' legal review.

`research/country-facts.md` was absent during drafting research. Country facts below were verified independently using official Taiwanese sources. The ledger became available at the final check; its seven Israel entries were then reviewed. Its verified 90-day visa-exemption and in-force comprehensive income-tax-agreement entries agree with the independently checked sources used here. Its working-holiday entry records a temporary suspension since June 13, 2025; no working-holiday route is proposed in these drafts. The other four country entries are outside the articles' scope, including the explicitly unverified driving-licence entry. No unverified row or pending research claim was used.

Every statutory provision cited in the drafts was fetched using the actual `tools/law.py` through `runpy.run_path`. Its fixed cache-directory expansion was redirected in memory to `drafts/he/.law-cache`, so the script itself and shared `html/` were not modified. The fetched HTML and `*-checked.txt` outputs remain there. The article-level source tables below quote those Chinese outputs. The exploratory request for Foreign Professionals Act Article 34 returned NOT FOUND; it is not cited or relied upon.

Effective-date review:

- Trade Secrets Act: January 15, 2020 amendment; no unenforced banner.
- Copyright Act: the banner concerns the May 4, 2022 amendments to Articles 91, 91-1, 100 and 117 and deletion of 98 and 98-1. It does not cover the cited Articles 10-1, 12 or 37. Checked the [official history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0070017); the draft states the October 24, 2026 position.
- Company Act: December 26, 2025 amendment; the [history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0080001) concerns 387-1 and 449, not the cited provisions. No pending-effect banner in the fetched text.
- Foreign Professionals Act: [official history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295), also saved in the locale cache, states that the 2025 revision took effect January 1, 2026, except the specified teaching provision and Articles 28–29, effective June 30, 2026. The provisions used here are operative as of the check date.
- Foreign Investment Statute, Employment Service Act and Immigration Act: titles and current text checked with law.py; no unenforced banner in these outputs.

## 858 — Israeli code shared with a Taiwan development partner

File: `drafts/he/858-israeli-tech-taiwan-source-code-trade-secrets.md`.

Reader and trigger: an Israeli software/technology company is asked to give a Taiwan manufacturer's testing subcontractor access to source code. The opening explicitly marks the scenario as illustrative. Decisions concern the recipient, version, permitted purpose, newly developed rights and evidence if access exceeds permission.

Country fit: the [Department of Industrial Technology's official cooperation page](https://mnscdn.moea.gov.tw/Mns/doit_e/content/Content.aspx?menu_id=44172) expressly includes Israel in its international industrial R&D collaboration program. This verifies a relevant cooperation channel. The specific source-code/testing workflow is an editorial hypothesis, not a claimed industry statistic or client story.

Overlap/new angle: German 682 supplies the commissioned-versus-joint development distinction and separate copyright analysis. This draft changes the focus from CAD drawings to repository access, version identification, testing subcontractors and the right to move to another supplier. The existing Hebrew market-entry material does not answer those particular access and ownership questions.

### Claim → source

| Claim in the draft | Checked provision and URL | Chinese text checked |
|---|---|---|
| Secret status requires all three elements, including reasonable protective measures; programs are within the information definition. | Trade Secrets Act [2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080028&flno=2) | 「程式、設計或其他可用於生產、銷售或經營之資訊」；「非一般涉及該類資訊之人所知者」；「因其秘密性而具有實際或潛在之經濟價值者」；「所有人已採取合理之保密措施者」 |
| Commissioned research/development: contract controls; absent agreement, developer owns and funder may use in its business. | Trade Secrets Act [4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080028&flno=4) | 「歸屬依契約之約定；契約未約定者，歸受聘人所有。但出資人得於業務上使用其營業秘密」 |
| Joint development: contractual shares, with a presumption of equality absent agreement. | Trade Secrets Act [5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080028&flno=5) | 「其應有部分依契約之約定；無約定者，推定為均等」 |
| Joint use/disposition requires unanimous consent absent agreement; no unjustified refusal; transfer of an individual share also requires the others' consent unless otherwise agreed. | Trade Secrets Act [6](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080028&flno=6) | 「如契約未有約定者，應得共有人之全體同意。但各共有人無正當理由，不得拒絕同意」；「非經其他共有人之同意，不得以其應有部分讓與他人。但契約另有約定者，從其約定」 |
| Scope follows the license; sublicensing needs the owner's consent. | Trade Secrets Act [7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080028&flno=7) | 「地域、時間、內容、使用方法或其他事項，依當事人之約定」；「非經營業秘密所有人同意，不得…再授權第三人使用」 |
| Improper acquisition/use/disclosure is assessed against statutory grounds; breach of confidentiality is an improper method. | Trade Secrets Act [10](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080028&flno=10) | 「因法律行為取得營業秘密，而以不正當方法使用或洩漏者」；「違反保密義務、引誘他人違反其保密義務或其他類似方法」 |
| Removal of infringement and prevention of a threatened infringement can be requested; no guaranteed injunction. | Trade Secrets Act [11](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080028&flno=11) | 「受侵害時，被害人得請求排除之，有侵害之虞者，得請求防止之」 |
| Copyright covers expression rather than the underlying ideas/processes. | Copyright Act [10-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070017&flno=10-1) | 「保護僅及於該著作之表達，而不及於其所表達之思想、程序、製程、系統、操作方法、概念、原理、發現」 |
| Commissioned-work authorship and economic rights follow separate defaults; the employee-work exception is retained. | Copyright Act [12](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070017&flno=12) | 「除前條情形外，以該受聘人為著作人。但契約約定以出資人為著作人者，從其約定」；「未約定著作財產權之歸屬者，其著作財產權歸受聘人享有」；「出資人得利用該著作」 |
| Unclear license scope is presumed not granted; a nonexclusive licensee needs consent to sublicense. | Copyright Act [37](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070017&flno=37) | 「其約定不明之部分，推定為未授權」；「非專屬授權之被授權人非經著作財產權人同意，不得…再授權第三人利用」 |

Repository permissions, component lists and log preservation are expressly practical suggestions, not a statutory checklist or a claim that every download proves misappropriation.

### First-two-paragraph deletion test

| Sentence retained or cut | Result |
|---|---|
| Opening beginning `יצרן בטאיוואן מבקש...` with the embedded illustrative label | Kept: identifies requester, Israeli owner, new recipient and data; removing it loses the actual trigger and hypothetical status. |
| `הסכם הסודיות הקיים נחתם עם היצרן.` | Kept: identifies the existing agreement's counterparty, which is the reason to examine the new recipient. |
| `לפני פתיחת החשבון הנוסף...` | Kept: identifies recipient, versions and purpose as the next practical decision. |
| The linked official Israel–Taiwan cooperation sentence | Kept: provides verified country relevance rather than asserting that such projects are common. |
| Sentence distinguishing Israeli background code, the partner's existing material and jointly created results | Kept, with `כדאי להכין רשימה` rather than an apparent statutory command. It identifies the three ownership categories. |
| `ההבחנה הזאת מכוונת את סעיפי הבעלות והרישיון.` | Cut: repeats what the categories and the later ownership analysis already establish. No legal condition lost. |

### Comparison with the three existing Hebrew columns

| Existing column | Opening / headings / ending observed | Change in 858 |
|---|---|---|
| 008 | Lawyer greeting, topic announcement, many short line breaks, rights-protection exhortation and service links. | Explicit hypothetical access request; four issue-specific H2s; ends with identifying versions without disclosing source code. No lawyer persona. |
| 009 | `כפי שנאמר קודם` and a Korea comparison; numbered grounds; timing warning and service links. | Standalone Taiwan problem, ownership conditions in connected prose, no borrowed home-country law. |
| 015 | Restaurant/address example; question-and-answer turn; generic contact/update caution. | Code and testing scope; two questions within the body; specific evidence preparation after the single contact paragraph. |

Dropped/avoided: an assumption that an NDA alone establishes secret status; that payment assigns all rights; that downloading proves misuse; specific Israeli IP law; criminal punishment and civil-damages deadlines, which are outside this focused access-and-ownership article. No invented prior enforcement success.

Count: 680 body words / 3,992 body characters. Full Markdown: 999 whitespace words / 7,872 characters.

## 859 — Which entity will perform the Israeli company's Taiwan contract?

File: `drafts/he/859-israeli-company-taiwan-subsidiary-branch-investment.md`.

Reader and trigger: an Israeli technology company is moving from a joint pilot to paid local support and must identify the contracting party, employer, investor and recipient of revenue. The article opens with the reader's contract question, not an invented transaction.

Country fit: the official R&D cooperation source above supports the technology-partnership context. Growth into paid Taiwan support is a labelled planning hypothesis, not a claimed typical outcome. The [Taiwan Ministry of Finance agreement list](https://www.mof.gov.tw/singlehtml/191?cntId=63930) places Israel among comprehensive income-tax agreement partners and lists December 24, 2009 as the effective date. Only the existence/in-force status is used; no rate is inferred.

Overlap/new angle: English 001 and 004 supply the entity and investment sequence, Spanish 656 the single-member limited-company point, and English 507 the importance of the actual investor/entity. The new angle is the Israeli contracting/investment/payment map. It avoids reproducing the existing Korean treaty discussion, a comprehensive shareholder-inspection article, or a restaurant-premises guide.

### Claim → source

| Claim in the draft | Checked provision and URL | Chinese text checked |
|---|---|---|
| A company established under Taiwan's Company Act is a legal person. | Company Act [1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=1) | 「依照本法組織、登記、成立之社團法人」 |
| A limited company can have one shareholder; all shareholders consent to the articles. | Company Act [98](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=98) | 「有限公司由一人以上股東所組成」；「股東應以全體之同意訂立章程」 |
| Foreign juridical persons are included as foreign investors. | Foreign Investment Statute [3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=3) | 「本條例所稱外國人包括外國法人」；「外國法人依其所據以成立之法律，定其國籍」 |
| Limited shareholder liability has a serious-abuse exception; cumulative conditions retained. | Company Act [99](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=99) | 「以其出資額為限」；「股東濫用公司之法人地位，致公司負擔特定債務且清償顯有困難，其情節重大而有必要者」 |
| A foreign company needs branch registration before conducting business in Taiwan in its own name. | Company Act [371](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=371) | 「非經辦理分公司登記，不得以外國公司名義在中華民國境內經營業務」 |
| A branch needs dedicated operating funds and a designated Taiwan responsible representative. | Company Act [372](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=372) | 「應專撥其營業所用之資金，並指定代表為在中華民國境內之負責人」 |
| A foreign-company representative office must register; it is not a device to bypass Article 371. | Company Act [386](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=386), read with 371 | 「因無意…設立分公司營業…派其代表人…設置辦事處者，應申請主管機關登記」 |
| Investment application requires plan/documents and approval; changes also need approval. | Foreign Investment Statute [8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=8) | 「應填具投資申請書，檢附投資計畫及有關證件，向主管機關申請核准。投資計畫變更時，亦同」 |
| All approved contribution must arrive within the assigned period; report arrival, seek amount verification; justified extension request before expiry. | Foreign Investment Statute [9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=9) | 「於核定期限內全部到達，並將到達情形報請主管機關查核」；「應於期限屆滿前，申請…核准延展」；「於實行出資後，應…申請審定投資額」 |
| Capital needs CPA certification; submit at filing or within 30 days after registration. | Company Act [7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=7) | 「資本額，應經會計師查核簽證」；「申請設立登記時或設立登記後三十日內」 |
| Company formation is not work authorization; general permit rule has exceptions. | Employment Service Act [43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | 「除本法另有規定外，外國人未經雇主申請許可，不得…工作」 |
| Approved foreign-invested-business managers are an employment category, not an automatic permission. | Employment Service Act [46](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=46), paragraph 1(2) | 「華僑或外國人經政府核准投資或設立事業之主管」 |

Official non-statute evidence:

- [Invest Taiwan's investment guide](https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01): official indexed text states no general minimum, CPA certification and sufficient incorporation costs, with specified-industry exceptions. Direct full-page requests timed out. The equivalent [Chinese guide](https://investtaiwan.nat.gov.tw/showPagechtInvestmentStatus01?lang=cht&menuNum=7&search=InvestmentStatus01) was independently retrieved in official search results: 「除部分特許行業外，公司資本額只要足夠支應合理的開辦成本即可」. The [Kaohsiung government's registration FAQ](https://edbkcg-st.kcg.gov.tw/News_Content.aspx?n=7E6323BCFFE92DAB&s=88B17158F8E01F83&sms=4C844B372FA4739D) was opened successfully and independently confirms no minimum for limited companies and companies limited by shares, preserving special-sector exceptions. This is a retrieval limitation for the portal, not a basis for asserting an unverified capital number.
- [MOF's agreement list](https://www.mof.gov.tw/singlehtml/191?cntId=63930) was opened: the comprehensive list contains 「以色列 / Israel」 and 「2009/12/24」 in the effective-date column.

### First-two-paragraph deletion test

| Sentence retained or cut | Result |
|---|---|
| `מי יחתום על חוזה השירות...` | Kept: establishes the entity choice in a customer contract. |
| `התשובה צריכה להתאים גם להצעת המחיר...` | Kept: adds the quote, payment destination and employment relationship. |
| `כדאי להכין תרשים של העסקה...` | Kept: gives a concrete preparation task before naming the entity. |
| `לצוות טכנולוגי שמתכנן ניסוי משותף...` | Kept: distinguishes pilot and paid service, work location and repair obligation. |
| `גם אם הטיוטה הראשונה נחתמת בישראל...` | Kept: locates the actual performance rather than inferring it from signature location. No claim about Israeli law. |
| `זו הצעה לתכנון, ולא תיאור של חברה מסוימת.` | Cut: unnecessary meta-explanation; conditional reader guidance does not claim a real case. |
| `רישום המבנה ייבחן מול הפעילות הזאת.` | Cut: vague passive repetition, with no additional legal requirement. |

### Comparison with the three existing Hebrew columns

| Existing column | Comparison and change in 859 |
|---|---|
| 008 | Replaced greeting and broad topic announcement with a contracting-party question. Three substantive headings, including a question heading, rather than the old line-by-line advice. Ending asks about the supplier-name field. |
| 009 | No backward reference or Korea comparison; no sequential numbered legal checklist. Investment timing is tied to the approval rather than a generic urgency warning. |
| 015 | The shared formation theme is narrowed to the foreign investor and contracting chain, not restaurant zoning. Its generic contact/update ending is replaced by the unresolved name on the first purchase order. |

Dropped/avoided: Korean treaty rates and dates; any automatic Israeli treaty reduction; Israeli tax law; a universal NT$500,000 incorporation threshold; promised bank acceptance or registration duration; corporate-shareholder director appointment nuances; a claim that a representative office can perform paid local services. The source article's general minimum-capital distinction was retained, not turned into a work-permit guarantee.

Count: 659 body words / 3,878 body characters. Full Markdown: 957 whitespace words / 7,943 characters.

## 860 — Entry, professional work and residence for Israeli nationals

File: `drafts/he/860-israeli-professional-taiwan-work-permit-residence.md`.

Reader and trigger: an Israeli engineer or other professional has a planned Taiwan start date, possibly for installing a customer's system, and needs the work and residence documents to match it. A partner/spouse may accompany them.

Country fit: [BOCA's official visa-exempt page](https://www.boca.gov.tw/cp-149-4486-7785a-2.html) specifically lists Israel in the up-to-90-day group. It states the six-month passport validity requirement, restrictions on temporary/emergency documents, onward/return travel and immigration examination. The engineering deployment is an editorial reader hypothesis grounded in the documented technology-cooperation context, not a population claim.

Overlap/new angle: English 704–706 provide the separate entry, resident-visa, direct-residence and family routes. English 352 supplies the importance of actual employer/work facts. The Hebrew draft combines those questions around Israeli entry conditions and a concrete project start date. It does not transplant the US no-treaty analysis, EOR conclusions, salary figures, student rules, severance analysis or a general ARC-renewal checklist.

### Claim → source

| Claim in the draft | Checked provision and URL | Chinese text checked |
|---|---|---|
| Work generally needs an employer-applied permit unless an exception applies. | Employment Service Act [43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | 「除本法另有規定外，外國人未經雇主申請許可，不得…工作」 |
| Specialized/technical work is an eligible category, with separate qualification criteria. | Employment Service Act [46](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=46), paragraph 1(1), paragraph 2 | 「專門性或技術性之工作」；「其工作資格及審查標準，除其他法律另有規定外，由中央主管機關會商中央目的事業主管機關定之」 |
| The employer generally applies to MOL for professional employment, with statutory exceptions and education routes. | Foreign Professionals Act [5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | 「除本法另有規定外，應檢具相關文件，向勞動部申請許可」；「應檢具相關文件，向教育部申請許可」 |
| Permit exemption for a resident foreign spouse of a Taiwan national with household registration is conditional. | Employment Service Act [48](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48), paragraph 1(2) | 「與在中華民國境內設有戶籍之國民結婚，且獲准居留者」 |
| Specialist status depends on announced/recognized special skills; no nationality-based entitlement. | Foreign Professionals Act [4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=4), subparagraph 2 | 「具有中央目的事業主管機關公告之…特殊專長，或經主管機關會商相關中央目的事業主管機關認定具有特殊專長者」 |
| A specialist may apply directly for a four-in-one Gold Card, subject to review; validity 1–3 years. | Foreign Professionals Act [9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | 「得逕向內政部移民署申請…四證合一之就業金卡」；「應會同勞動部及外交部審查」；「有效期間為一年至三年」 |
| Qualifying authorized/exempt professionals may apply directly after visa-exempt/visitor entry; approval required. Family route has specific sponsors and relationships. | Foreign Professionals Act [16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16), both paragraphs | 「以免簽證或持停留簽證入國，經許可或免經許可…從事專業工作者，得逕…申請居留；經許可者，發給外僑居留證」；「外國專業人才在我國從事專業工作及外國特定專業人才…許可居留或永久居留者，其配偶、未成年子女及因身心障礙無法自理生活之成年子女」 |
| First ARC deadline is 30 days from the day after entry with residence permission; valid integrated document is an exception. | Immigration Act [22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22), paragraph 2 | 「取得居留許可者，應於入國後之翌日起算三十日內」；「四證合一之有效證件，或其他已含有外僑居留證功能之證件者，得免申請」 |
| Dependent spouses of specialist/senior professionals may apply directly to MOL; permit duration cannot exceed dependent residence. | Foreign Professionals Act [15](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15), paragraph 1 | 「外國特定專業人才及外國高級專業人才之配偶…許可…依親居留者，得逕向勞動部申請許可」；「不得逾其依親居留期間」 |

Official administrative sources also checked:

- [BOCA entry guidance](https://www.boca.gov.tw/cp-149-4486-7785a-2.html): Israel in the 90-day list; count begins the day after arrival. The draft preserves the conditions instead of treating nationality alone as guaranteed admission.
- [NIA visitor/visa-exempt residence guide](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news): applicable categories, application channel, identity/address and family evidence; checked the professional/family paragraphs and authentication text. The article refers to the category's checklist instead of declaring a universal document bundle.
- [Official Gold Card explanation](https://goldcard.nat.gov.tw/en/about/): open work permission and no requirement for an existing offer/employer sponsorship. No unverified processing guarantee, tax benefit or automatic eligibility is repeated.

### First-two-paragraph deletion test

| Sentence retained or cut | Result |
|---|---|
| `90 יום הם תקופת השהייה המרבית...` | Israel-specific maximum with its official source; establishes the entry clock. |
| `הספירה מתחילה ביום שלאחר ההגעה.` | Essential start point, not an interchangeable date. |
| Work-start sentence citing Article 43 | Establishes that the entry clock does not itself establish work authorization, with the exception qualifier. |
| Sentence beginning `למהנדס ישראלי שנשלח להתקין מערכת...` | Specifies actual tasks, place and directing company as the facts needed for route assessment. |
| `אלה הנתונים לבדיקת מסלול ההיתר.` | Cut in the final deletion pass: the preceding task description and following application sentence already make the connection. No distinct fact or condition was lost. |
| The sentence comparing a calendar label of “meetings” with installation/testing/training | Preserves the actual-activity question; does not claim every meeting is work or every deployment has one predetermined permit route. |

No generic history or “this article will explain” introduction was drafted. The last opening sentence is retained because removing it would lose the concrete mismatch between the travel label and actual activity.

### Comparison with the three existing Hebrew columns

| Existing column | Comparison and change in 860 |
|---|---|
| 008 | Opens with one verified number and its start point, not a lawyer greeting. No invented employer dispute or result. Headings follow entry, employer authorization, Gold Card and residence/family. |
| 009 | No Korea contrast or retrospective “as mentioned”; work-permit conditions appear beside their sources, not in an unrelated labor-rights list. |
| 015 | Does not copy the local-premises Q&A form or general update caution. Ends on the installation date, authorizing document and a separate status entry for each family member. |

Dropped/avoided: work authorization from visa-free admission alone; automatic spouse work rights; blanket in-country conversion; a universal police/health-check requirement; fixed salary or experience criteria; a current Israeli working-holiday claim; all Israeli law. The ordinary-professional sponsor's actual professional work in Taiwan was added explicitly during review rather than hidden behind “eligible professional.”

Count: 729 body words / 4,245 body characters. Full Markdown: 1,066 whitespace words / 8,335 characters.

## Editorial corrections and meaning preservation

| Problem sentence / passage | Reason | Revision | Meaning preserved |
|---|---|---|---|
| 858: `ההבחנה הזאת מכוונת את סעיפי הבעלות והרישיון.` | Abstract repetition in paragraph two. | Deleted; ownership categories remain and Articles 4–6 explain the consequences. | Yes; no condition/source removed. |
| 858: `רשימת החומרים צריכה להבחין...` | Could read as a fixed statutory documentation duty. | `כדאי להכין רשימה שמבחינה...` | Yes; practical recommendation distinguished from legal requirements. |
| 859: `זו הצעה לתכנון...` and `רישום המבנה ייבחן...` | Meta-description and passive repetition. | Removed; added the actual performance-location question for a draft signed in Israel. | Yes; no foreign-law conclusion introduced. |
| MONOTONY: 859 — sentence-length variation; `לאחר האישור...` / `לאחר ביצוע ההשקעה...` | Initial Hebrew word-based CV 0.402; repeated consecutive opener. | Connected the two related investment-stage clauses; retained all statutory stages, added explicit `מלוא`, and shortened the separate manager/qualification sentences. | Yes; full contribution, reporting, amount review and pre-expiry extension preserved. |
| 860: `כאשר איש המקצוע המתאים קיבל שהייה...` | Insufficiently explicit about the ordinary professional working professionally in Taiwan, versus specialist status. | Express sponsor categories and working condition, followed by separate permission and family-scope sentences. | Legal precision improved; minor children, disabled dependent adults, entry mode and approval retained. |

All three FAQs were compared with their own final body. No FAQ drops a cumulative secret-protection condition, grants a blanket capital/work entitlement, or treats dependent residence as an automatic work permit.

## Section 5 sentence-variety review and checks

The installed shared command was actually run on all three files:

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <three files>`

It auto-detected Hebrew as Korean and returned 2, 2 and 3 numerical FAILs, respectively, using Korean character/sentence rules. An explicit `--lang he` trial raised `KeyError: 'he'`. This is not a valid Hebrew pass. The shared installation supports only ko, ja, en and zh-hant; even the expanded-language list in the supplied rules does not include Hebrew. No shared file was modified, and the text was not forced through an English ASCII tokenizer to claim success.

Supplementary reproducible check: `python3 drafts/he/.checks/verify_he.py`. It strips frontmatter, sources, headings and link destinations for counts; splits prose at sentence-final `. ! ?`; counts Hebrew/Latin orthographic words for rhythm; applies the published 0.45 / 8% / 30% and repeated-opener thresholds. This is a transparent batch-local numerical check, not a validated native Hebrew parser. Qualitative points were reviewed directly below. Final result: exit 0, no structural or supplementary numerical errors.

| Metric | 858 | 859 | 860 |
|---|---:|---:|---:|
| Prose sentences | 55 | 53 | 54 |
| Sentence length CV | 0.470 | 0.454 | 0.491 |
| Sentences of at most 8 orthographic words | 25.5% | 26.4% | 25.9% |
| Similar-length triple share | 5.7% | 3.9% | 3.8% |
| Most repeated paragraph first word | 1 | 2 | 2 |
| Consecutive identical sentence openings | 1 | 0 | 0 |
| Body questions, excluding headings | 2 | 3 | 1 |

Section 5 qualitative self-check:

1. Native automated Hebrew check is unavailable, as documented; supplementary numerical checks have zero errors. No claim that the original tool's Hebrew requirement was met.
2. Openings differ: embedded hypothetical access request / contracting-party question / verified 90-day number. One scene in three articles; none uses a stock “Suppose” formula.
3. Each article has more than two short sentences. No paragraph has more than one sentence exceeding 32 orthographic words in the supplementary check. Legal condition lists are not split so as to lose their cumulative force.
4. Paragraph openings were read vertically; the highest repetition is two. The company article's repeated `מי` opener was revised.
5. No three-paragraph claim–citation–caveat template. Each has unlinked practical-preparation paragraphs, while consequential legal propositions retain inline official sources. No repeated trailing parenthetical-statute rhythm.
6. No “not X but Y” rhetorical sequence or invented mistaken claim. Necessary negative conditions remain: no work permission from registration/admission, no sublicensing without consent, no automatic spouse rights.
7. Endings differ and are article-specific: version/access evidence without sending the secret / the supplier-name field in a first order / installation authorization and family-status records. The source section is the final structural tail. No summary conclusion or sales promise.
8. No bold, body H1, author footer, invented first-person lawyer, telephone, address or imperative checklist headings. Hebrew tone is calm and direct. This was author/model review, not native-speaker or lawyer review.
9. Statute numbers, conditions, exceptions, consent requirements, dates, periods, sources and the hypothetical label were rechecked after editing. A `may apply` route remains conditional; no approval outcome is promised.

Metadata/link checks: exact field order; three FAQs; `audience: ["he"]`; internal `author: legal-ai-assistant`; correct dates; title/SEO/summary lengths; unique 4–9-word ASCII slugs; all internal column links resolve to one of these three authorized new slugs; official body URLs occur in the sources; each law URL matches a law.py checked-text record. Images are three different exact IMAGE-MENU entries, I29/I08/I04, with translated listed objects and the specified illustrative caption. The text snapshot does not contain the referenced image binaries, so menu conformity, not asset rendering or live deployment, was verified.

Count convention for the report above and final delivery: body prose only, excluding frontmatter, headings and sources; Markdown links are replaced with their visible labels. Words are whitespace-separated; characters are Unicode code points including internal whitespace and punctuation, after trimming the body. The full-file counts are also supplied separately and include YAML, Markdown syntax and URL text. Rhythm metrics use the explicitly described orthographic-token regex rather than the whitespace reporting convention.

Remaining limitations: no native-speaker or lawyer review; original Hebrew variety automation unsupported; Invest Taiwan full-page retrieval timed out, with the relevant official indexed text and an opened government corroboration described above. No unresolved known factual correction was left in the drafts, and no publishing is implied by these checks.
