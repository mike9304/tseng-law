# Czech repair log — review r1

Date: 24 October 2026. Review: [grok-cs-r1.md](../reviews/grok-cs-r1.md).

Scope: the three existing files in drafts/cs/ and this log only. One MUST and seven substantive SHOULD items received bounded edits. Five conditional source concerns were resolved by confirming the original wording; three language-review limitations were acknowledged without manuscript changes. Filenames, section order and all frontmatter bytes, including summaries and FAQs, are preserved.

For conditional UNVERIFIED-BY-REVIEWER items, REBUTTED below means the contemplated deletion is unwarranted because the cited official page confirms the text; it does not mean the reviewer asserted a false legal rule. ACCEPTED/no edit is used for the three expressly non-actionable language notes.

## 873 — czech-company-taiwan-subsidiary-branch-office

### SHOULD S1 — REBUTTED; retain both statements

The [official Taiwan Gold Card guide](https://goldcard.nat.gov.tw/en/why-taiwan/foreign-startups-in-taiwan-3-options-for-foreign-corporate-entities-to-set-up-companies-in-taiwan/) expressly distinguishes separate corporate personality and parent-company liability: “all the rights and obligations will belong to the foreign parent company”. It also says a representative office is “not permitted to engage in profit-seeking activities”, with services and goods sales as examples. These are agency-guide claims supported by that page, not conclusions attributed solely to Company Act Article 386.

Retained: “Pobočka je součástí české společnosti a její závazky nese tato společnost.” and “Zastoupení rovněž nemá samostatnou právní osobnost a nesmí poskytovat placené služby ani prodávat zboží.” FAQ 2 remains consistent.

### SHOULD S2 — REBUTTED; retain application date

The cited [MOF release](https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=03298f7eb86e408898fc615204d08404) expressly states “自110年1月1日實施”, meaning application from 1 January 2021. Its title and opening distinguish entry into force on 12 May 2020. The full official page was retrieved directly with curl after the web reader timed out; an official-domain search independently found the same release.

Retained: “Používá se od 1. ledna 2021.” and the corresponding date in FAQ 3.

### SHOULD S3 — ACCEPTED

Verification: python3 tools/law.py J0040002 9. [Article 9(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=9) requires “於核定期限內全部到達”. Added only the missing full-amount qualification.

Old:
> požaduje jejich příchod ve stanovené lhůtě, oznámení ke kontrole a následné určení investované částky.

→ New:
> požaduje jejich příchod v plné výši ve stanovené lhůtě, oznámení ke kontrole a následné určení investované částky.

The separate extension sentence remains correct: the application must be made before expiry, not necessarily decided by then. No FAQ or summary states the shortened funding rule.

### SHOULD S4 — ACCEPTED

Verification: python3 tools/law.py N0090001 43. [Article 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) says “除本法另有規定外” and “未經雇主申請許可”. The exception is tied to this Act; work requires permission obtained on the employer's application, not merely an application.

Old:
> obecně zakazuje práci cizince bez povolení vyžádaného zaměstnavatelem, nestanoví-li zákon jinak.

→ New:
> obecně zakazuje práci cizince bez povolení získaného na žádost zaměstnavatele, nestanoví-li tento zákon jinak.

The existing link and statement that incorporation itself is not work authorization remain unchanged. No affected FAQ/summary proposition.

### SHOULD S5 — ACCEPTED; exact professional designation

Verification: python3 tools/law.py J0080001 7. [Article 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=7) requires “應經會計師查核簽證”; the [official English text](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=J0080001) specifies an “independent certified public accountant”. The small clarification identifies a CPA rather than relying on the reviewer's bare proposed word “auditor”.

Old:
> vyžaduje ověření kapitálu účetním oprávněným k této činnosti, jehož doklad

→ New:
> vyžaduje ověření kapitálu nezávislým certifikovaným účetním (CPA), jehož doklad

The filing alternatives—at incorporation application or within thirty days after registration—are unchanged. No affected FAQ/summary proposition.

### SHOULD S6 — ACCEPTED; no edit

Reviewer note: “recenzent není rodilý mluvčí češtiny; na úpravu rejstříku nic nenavrhuji.” Old → new: none → none. This is a review limitation, not a statutory proposition. No native-speaker or lawyer certification has been added.

## 874 — czech-working-holiday-taiwan-work-limits

### SHOULD S1 — REBUTTED; retain six-month limits

The [MOFA nationality table](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6428) gives the Czech employment rule as “May not engage in employment for more than six months” and the separate study/training rule as “May engage in study or training of no more than six months”. The [BOCA Czech page](https://www.boca.gov.tw/cp-388-56-9c5e7-1.html), under conditions during the stay, independently gives the same six-month restriction. Its relevant lower-page text was read in the directly retrieved HTML; it was omitted from the web reader's initial excerpt.

Both body claims remain unchanged. The nationality-specific employment rule is not a fresh entitlement for each employer. Title, summary and FAQ 2 remain consistent; the regulation's maximum one-year visa/work-permit framework does not remove this limit.

### SHOULD S2 — REBUTTED; retain NHI and visa-change statements

The [MOFA FAQs](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6440), National Health Insurance answer 1, expressly include Czech nationals in the list “not eligible to join Taiwan’s National Health Insurance” with a working-holiday visa. Working-holiday answer 7 says the visas “cannot be changed to other visa types”. That answer applies generally to this visa category; the [Czech-specific BOCA page](https://www.boca.gov.tw/cp-388-56-9c5e7-1.html) separately confirms no in-country conversion to another visa purpose.

Retained both sentences and FAQ 3. The NHI statement concerns the working-holiday visa itself, not every possible later residence status.

### SHOULD S3 — REBUTTED; retain checked BOCA conditions

The [cited Czech-specific BOCA page](https://www.boca.gov.tw/cp-388-56-9c5e7-1.html) states visa validity “自核發日起算1年” and the extension-application window “屆滿前15日內”. Its visa-type section also states a maximum 180-day stay, an extension of at most 180 days, and an overall year measured from first entry. The eligibility and procedure sections expressly require first participation, personal submission to the Taiwan representative office in Czechia, and no accompanying spouse, dependent relatives or children.

Retained the application and stay paragraphs. Issuance and first-entry dates remain distinct; none of these statements had to be reduced to the abbreviated ledger's 180 + 180 days.

### SHOULD S4 — ACCEPTED

Verification: python3 tools/law.py L0060001 9. [Article 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=L0060001&flno=9) requires “領有居留證明文件” together with one listed qualification. The reference to the persons covered by this provision remains, preserving the opening exception for the preceding article.

Old:
> u dotčených cizinců vyžaduje pobytový doklad a některou z dalších zákonných podmínek.

→ New:
> u dotčených cizinců vyžaduje doklad o povolení k pobytu (居留證明文件) a splnění některé z dalších zákonných podmínek.

This clarifies the residence documentation and cumulative condition; it does not suggest that the WH visa itself qualifies. FAQs and summary do not state a different NHI-document rule.

### SHOULD S5 — ACCEPTED; citation relocation

Verification: python3 tools/law.py G0340003 71-1. [Article 71-1(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=71-1) says “應於離境前” for the qualifying resident's filing/payment, with the continuing Taiwan-resident spouse exception in the same paragraph. Both rules were already substantively correct. Moved the link to the departure obligation itself.

Old:
> Pokud rezident během roku ruší tchajwanský domicil či pobytové místo a odjíždí, podává přiznání a platí daň před odjezdem.

→ New:
> Pokud rezident během roku ruší tchajwanský domicil či pobytové místo a odjíždí, podává podle [článku 71-1 odstavce 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=71-1) přiznání a platí daň před odjezdem.

Removed the relocated link from its former position:

Old:
> podává společné přiznání podle článku 71 tento manžel či manželka ([článek 71-1 odstavec 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=71-1)).

→ New:
> podává společné přiznání podle článku 71 tento manžel či manželka.

The ordinary May rule, residence-abandonment trigger and spouse exception remain unchanged. No FAQ or summary covers this filing-date detail.

### SHOULD S6 — ACCEPTED; no edit

Reviewer note: “recenzent není rodilý mluvčí češtiny; na úpravu rejstříku nic nenavrhuji.” Old → new: none → none. No statutory assertion or proposed wording change.

## 875 — czech-buyer-taiwan-defective-machine-claim

### MUST M1 — ACCEPTED; substantive exception and consequence restored

Verification: python3 tools/law.py B0000001 356 357, corroborated by the live official [Article 356](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356). Paragraph 2 contains “除依通常之檢查不能發見之瑕疵外”. Paragraph 3 requires immediate notice on later discovery and states the “視為承認” consequence if notice is neglected. The reviewer is correct.

Old:
> Opomenutí oznámení vede k tomu, že se věc považuje za schválenou. U vady nezjistitelné běžnou prohlídkou se okamžité oznámení vyžaduje po jejím pozdějším objevení.

→ New:
> Opomenutí oznámení vede k tomu, že se věc považuje za schválenou, s výjimkou vady, kterou běžná prohlídka odhalit nemůže. Takovou vadu je nutné oznámit ihned po jejím pozdějším zjištění; neučiní-li tak kupující, považuje se věc za schválenou.

The existing [Article 357](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=357) paragraph, excluding Article 356 when the seller intentionally conceals a defect, remains intact.

FAQ 1 addresses prompt notice of an already discovered defect; it does not repeat the incorrect blanket deemed-acceptance sentence. The summary only asks when to notify and which remedy periods apply. Neither needs a textual change. The independent repair reviewer confirmed this.

### SHOULD S1 — ACCEPTED

Verification: python3 tools/law.py B0000001 360. [Article 360](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=360) provides “得不解除契約或請求減少價金” when allowing nonperformance damages for missing guaranteed qualities or intentional nondisclosure. Made the alternative nature of this remedy explicit.

Old:
> Chybí-li zaručená vlastnost nebo prodávající vadu úmyslně zatajil, poskytuje [článek 360](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=360) základ náhrady škody z nesplnění.

→ New:
> Chybí-li zaručená vlastnost nebo prodávající vadu úmyslně zatajil, může kupující podle [článku 360](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=360) místo odstoupení či slevy žádat náhradu škody z nesplnění.

The following requirements to substantiate downtime loss, causation and amount remain unchanged. No summary or FAQ promises cumulative or automatic damages.

### SHOULD S2 — ACCEPTED

Verification: python3 tools/law.py B0000001 361. [Article 361(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=361) states “喪失其解除權”. Clarified that only the rescission right is lost under this provision.

Old:
> neuplatní-li je kupující včas, právo ztratí.

→ New:
> neodstoupí-li kupující v této lhůtě, ztrácí právo odstoupit.

The seller's discretion to set a reasonable period and the existing link are preserved. FAQ 2 concerns Article 365's separate periods for rescission or price reduction and remains correct.

### SHOULD S3 — ACCEPTED; no edit

Reviewer note: “recenzent není rodilý mluvčí češtiny; na úpravu rejstříku nic nenavrhuji.” Old → new: none → none. No statutory proposition or proposed language change.

## Verification and limits

All nine relevant statutory articles were read through the unchanged tools/law.py using six pre-existing cache files, each checked to exceed 5,000 bytes before invocation; no cache was created or refreshed. Official guidance pages were opened live, with direct HTML retrieval where the web reader omitted text or timed out. Company Act Article 7's official English text was also retrieved directly.

The Civil Code's pending-commencement banner identifies Articles 166-1 and 1223, not the cited sales provisions. The Income Tax Act banner concerns Article 43-4, not Article 71-1. Existing 24 October 2026 qualifications remain intact.

Exact comparison with an in-memory baseline confirmed that only the logged replacements changed. All frontmatter is byte-identical. The sixteen-field order, quoted values/arrays, three FAQ pairs, four substantive H2 sections plus Sources, absence of bold/H1, internal-link targets and body-source coverage were checked successfully. This was a manuscript check, not an application build or publication.

The prescribed command was run separately on every draft:
python3 -B /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <draft>

Each returned exit 2: “ERROR measurement unavailable: cannot infer language ...; supply --lang”. The tool's language choices omit cs. An automated zero-FAIL result cannot be claimed; Czech was not relabelled as a supported language and the tool was not modified.

Section 5 self-check:

- Openings remain distinct: contracting-party question in 873, age number in 874, and explicitly marked hypothetical machine test in 875. Sentence-by-sentence deletion would remove the choice/signatory issue and ownership records; age/application and work-limit conditions; or the evidence scenario and governing-law qualification, respectively. No introductory prose was added.
- Each draft retains at least two short sentences. No adjacent long sentences were introduced; the unchanged 34-word WH-permit sentence is followed by a short Czech-limit sentence.
- Paragraph starters were read vertically, with none appearing more than twice. The supplemental diagnostic finds no adjacent sentence pair with the same opening word.
- Citation placement remains varied, with no three-paragraph claim/citation/caveat sequence. Practical paragraphs without legal claims requiring citations remain.
- The repairs add statutory exceptions, not rhetorical contrasts or invented reader misconceptions. No repeated rebuttal template was added.
- Endings remain tied to the supplier/signatory, work/stay dates, and preserved machine-test records. Contact paragraphs and their limits remain unchanged.
- No bold, invented first-person lawyer narrative, checklist heading or human-review claim was added. Czech terminology and register received an independent AI check.
- Article numbers, deadlines, amounts, source links and the hypothetical label are preserved. The Article 71-1 link moved without changing its target; M1 restores a legal condition.

Openings, heading structures and endings were compared with supplied Czech samples 008, 014 and 016. The repaired drafts retain concrete openings and four issue-specific sections instead of the samples' author introduction, broad definition/process overview, numbered checklists and generic endings. These are snapshot comparisons, not a claim about the latest live publications.

Supplemental Czech-aware measurements used Unicode word tokens, Markdown link labels, prose paragraphs excluding headings/tables, and sentence boundaries at terminal punctuation followed by a capital Czech letter or digit. Dates and the email address were checked not to split. A similar-length triple means max length ≤ 1.25 × min length. These diagnostics do not substitute for a supported official checker or human language review.

| Draft | Main-text words / characters with spaces | Prose sentences | Length CV | Short sentences ≤8 words | Similar-length triple share |
|---|---|---|---|---|---|
| 873 | 697 / 5101 | 47 | 0.451161 | 12 / 47 | 0.00% |
| 874 | 766 / 5286 | 55 | 0.462577 | 12 / 55 | 5.66% |
| 875 | 739 / 5427 | 56 | 0.467575 | 18 / 56 | 1.85% |

A separate AI reviewer who did not implement the repairs returned PASS for the affected passages, retained conditional claims, and FAQ/summary consistency at the hashes below. It independently reread the nine statutes and official guidance and confirmed that 875 FAQ 1 needs no change. This is a bounded AI repair review, not human native-speaker or lawyer certification, a full re-audit of untouched claims, or publication approval.

| Draft | Before SHA-256 | Repaired SHA-256 |
|---|---|---|
| 873 | 44e8c84454835ef62706eeaaa209b8f07c816c2e126c124ec562c91efb81cfc0 | ce0561d8022beb4520f7c18f8890cf7eae4b50057a2ed15ef279dc879f5e2591 |
| 874 | e80c4bd0ef8ea6adec158204afccff6dd2c9ae64a73f6883eb68adba4d069ab4 | 911c019e7b5e8b8e204c30097fa4e6ca675f5a886ecc87ce536bbdf7016b5120 |
| 875 | df3f30121dab13d2706081e897b73002008e811f53113cb84f4a6dc1fe869019 | 309c3b1a079df595aea82a02b5aab2c02ccdd75f80d0c37738265bfbd5808f6b |

No unresolved MUST item remains in r1. Only the three requested drafts and this repair log were edited; no git, installation or publication action was performed.

