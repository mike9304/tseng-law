# Italian ARC revision — current independent disposition

2026-10-24. Final decision: PASS for all three exact versions below. The initial 705 REQUEST_CHANGES and intermediate metric conflict are superseded by the independently verified paragraph repair; their evidence remains below. No human/native-speaker or lawyer review is claimed, and this is not publication approval by itself.

| Article | Final SHA-256 | Independent decision |
|---|---|---|
| 704 | `38d394cf0834d7313a4e65d60c6068727448c84391fcd154cf17498d1b58d40b` | PASS, unchanged |
| 705 | `9eb7250a9ef513785aab13f7e590d498635786ad8c43dae7cb7dc3385c5189e1` | PASS after repair |
| 706 | `e0600c580dd6cad72a7de6a08ca8c640228224623e4d03c73895bdc81d037055` | PASS, unchanged |

## Independent repair verification

I read the full final 705, its changed paragraphs, opening, headings, FAQ, conclusion and source tail again. I did not author or edit the manuscript. Root authorized paragraph-level changes within 705 after a narrower repair caused a real metric failure. No other Italian article was changed.

The article-16(2) substantive finding is resolved: the family sponsor is an ordinary foreign professional performing professional work in Taiwan OR a foreign special professional; in both cases NIA residence or permanent-residence authorization must already exist. The permitted spouse/minor/disabled-dependent-adult-child categories, visa-free/visitor entry and approval of the family application all remain. This is consistent with the [current official article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) I independently opened during this review. The opening remains qualified (“alcuni professionisti e familiari”), not a universal visa-free conversion entitlement. No FAQ or conclusion contradicts that limitation.

The material prose finding is resolved. Offer/permission and degree/eligibility are connected to the relevant rules rather than repeated as detached admonitions. The profession paragraph now has two coherent sentences, undoing the intermediate 45-word compression. The duplicate spouse-exemption tail is deleted. Gold Card qualification assessment is part of the application explanation. The student-document list and the four Gold Card functions are genuinely parallel items, with clear reader uses; they are not arbitrary template lists. Short filing-location and completed-study sentences carry operative information, and the remaining short holiday/absence statements clarify conditions. I do not see a restoration of meaningless short cautions to satisfy the metric.

The final reviewer identified an overbroad intermediate attribution to NIA 0926. That has also been resolved. I independently opened the [current NIA 181964/0926 page](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/181964/); it covers migrant ARC applications, extensions/changes and their supporting documents. The final paragraph attributes the linked guide only to those ARC procedures and documents. Employment authorization and family-admission questions are separately described as category-dependent. It no longer claims this ARC guide itself determines family eligibility. The initial review’s paragraph-combination suggestion must be read subject to this source boundary; combining prose never authorizes widening what a source supports.

First-two-paragraph deletion recheck: the shortened opening “Si può chiedere l’ARC dopo l’ingresso senza visto?” retains the actual decision and the referent of the limited answer. The following scope sentence retains citizenship/entry/purpose. The second paragraph still distinguishes regular study from Mandarin entry and the consequences of an incompatible entry. None is generic throat-clearing. The image metadata, title, summary, FAQ and substantive ending remain consistent with the reviewed image/content.

The latest body retains the full-time/abroad course scope, competent representation, non-exhaustive document list and Chinese/English translation threshold; Mandarin’s completed four months are explicitly a residence requirement, not a prerequisite to the initial trip. Qualified centre, additional at least three months, weekday hours and absence threshold remain unchanged. The source-preservation audit below remains valid with the expressly recorded article-16 correction.

## Independent final checks

Actual command, run against the final bytes:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-it/705-taiwan-visa-residence-work-study-family.md --lang it
sentences=49 mean=19.1 cv=0.458 short=0.204 run3=0.0 opener_rep=0.263 cite_end=0.0 cite_para=0.421 contrast=0 caveat=0 q=2
OK — no variety limit violated
exit 0
```

The intermediate `fc2f92ee388d58a5a452721397e23031e1dff4d6ff161c26aa549a8f9fd89704` genuinely failed CV at 0.418. It was not approved. This final PASS applies only to the final hash above; neither the checker nor thresholds were changed.

Independent hash/source/numeric check on all three final files: 704/706 unchanged; all original official URLs preserved, no substituted/new official URLs; no missing internal links; no missing/added body digit tokens after stripping URLs. Word-number and legal-condition preservation was read in prose as well. `git diff --check` for the three paths exited 0 with no output.

Manual section 5 final recheck: opening differs from 704/706; meaningful short statements remain; no new repeated paragraph openings or citation/caveat cycle; no filler, invented case, bold or promotional ending; exact legal conditions, official links and internal metadata remain. Two actual lists improve scanning of documents and document functions. The full comparator/image review below remains applicable. Remaining required changes: none.

---

# Italian ARC revision — independent review, pass 1

Date: 2026-10-24. Reviewer: independent AI Italian editorial reviewer (`review_rev2_it`). I did not author or edit any of these manuscripts. This is not human/native-speaker or lawyer certification and is not a publication claim.

Decision: REQUEST_CHANGES for 705; PASS for 704 and 706 at the exact hashes below. The remaining changes are confined to one substantive eligibility qualification and a bounded group of mechanical paragraph endings in 705. All three actual variety runs pass, but that does not resolve the prose-flow finding.

## Reviewed versions

Base originals: `174454bd4bb8d9e05627d71f9ef0af646540b3e4`.

| Article path relative to repo | SHA-256 | Decision |
|---|---|---|
| `src/content/columns-it/704-taiwan-arc-first-application.md` | `38d394cf0834d7313a4e65d60c6068727448c84391fcd154cf17498d1b58d40b` | PASS |
| `src/content/columns-it/705-taiwan-visa-residence-work-study-family.md` | `49f4fef1401a2d97005daf3254e5bef83a910a71eaf2284c8493ce161d6008b9` | REQUEST_CHANGES |
| `src/content/columns-it/706-taiwan-arc-renewal-changes-reentry.md` | `e0600c580dd6cad72a7de6a08ca8c640228224623e4d03c73895bdc81d037055` | PASS |

Read in full: REVISION-BRIEF and INDEPENDENT-REVIEW; repository AGENTS.md and EDITORIAL-VOICE.md; COLUMN-VOICE-RULE.md; SENTENCE-VARIETY-RULE.md and LESSONS.md; editorial review-criteria.md; Italian author report; all three originals and rewrites; all three Italian comparators below. Source-refresh.md was read, including the graduate-work-exemption warning. Retired Fable provisions were not applied.

## Material findings

| File:line | Exact sentence or minimal span | Reason and evidence | Proposed rewrite/direction | Legal meaning preserved? |
|---|---|---|---|---|
| `705-taiwan-visa-residence-work-study-family.md:68` | “familiari del professionista che abbia già ottenuto la residenza o la residenza permanente” | The generic sponsor description omits the ordinary foreign professional’s engagement in professional work in Taiwan and does not distinguish that category from a foreign special professional. The current Chinese article 16(2), opened independently, differentiates those categories. The omission was also present in the original; it is not introduced by this revision, but remains material. | Retain the existing article-16 link and specify: “Dopo un ingresso senza visto o con visto di visita, l’articolo 16 ammette la domanda diretta alla NIA dei familiari del professionista straniero che svolge un lavoro professionale a Taiwan o del professionista specializzato. In entrambi i casi, il professionista deve avere già ottenuto la residenza o la residenza permanente.” Then retain the current spouse/minor/disabled-dependent-adult-child list and the alternative-route sentence. The author may divide the first sentence further for natural flow. | Substantive correction, not merely style-preserving. Adds the qualification and category distinction visible in the official provision; does not remove any existing family condition. |
| `705-taiwan-visa-residence-work-study-family.md:56` and `:58` | “La lettera di offerta non sostituisce il permesso.” / “La laurea, da sola, non soddisfa i requisiti.” | MONOTONY: abrupt caution endings — these adjacent professional-route paragraphs still end with isolated rebukes after the rule has already been explained. The author report says these limitations were integrated, but the final text retains them as separate final sentences. At :56 the preceding sentence also combines the employer’s application with the employee’s travel preparation in one long sentence. | Rebuild these two paragraphs around actor/action/eligibility. For :56, give employer application and the insufficiency of an offer in one connected sentence, then the worker’s receipt and comparison of permission in another. For :58, keep the eligible professional categories, visa-free/visitor entry, permission-or-exemption and NIA approval together in flowing prose; attach the degree limitation to those conditions, not as another clipped closing warning. Example: “L’articolo 16 richiede l’autorizzazione al lavoro professionale o un’esenzione e l’approvazione della domanda; il solo possesso della laurea non soddisfa queste condizioni.” | Yes, provided all current actor, entry, permission/exemption and approval conditions remain. No request to delete legally useful limits. |
| `705-taiwan-visa-residence-work-study-family.md:60`, `:70`, `:74` | “Autorizzazioni e documenti dipendono dalla categoria.” / “È un’esenzione legata a quella posizione familiare.” / “Restano da accertare le qualifiche richieste.” | MONOTONY: detached explanatory tails — :60 is generic after naming category-specific instructions; :70 simply repeats the exact family scope already stated; :74 separates the real Gold Card qualification from the application sentence. Together with :56/:58 they keep the instructional, machine-assembled rhythm the user rejected. | At :60 combine the dedicated rules with what they govern (permissions, documents, family admission), keeping the professional-portal restriction. Delete :70’s final sentence: the preceding sentence already expressly limits the exemption to the foreign spouse of a household-registered Taiwanese citizen after residence. At :74 connect the application and qualification: “La domanda è individuale e può essere presentata senza avere già un datore di lavoro, ma il rilascio dipende dall’accertamento delle qualifiche richieste.” | Yes. The exemption’s subject and residence prerequisite remain explicit; Gold Card assessment is retained, not weakened. |

Official basis for the substantive finding: [Act for the Recruitment and Employment of Foreign Professionals, current article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16), especially paragraph 2. This reviewer opened it on 2026-10-24. Current [residence regulations](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129) and [NIA 0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970) were also opened for the limited deadline/document cross-check. The separate source-refresh supplies the broader commencement/history review.

Optional small wording correction, not an additional blocker: `705:32`, “cittadinanza del passaporto” is less idiomatic than “cittadinanza indicata sul passaporto” or simply “cittadinanza”.

## Concrete improvements supporting 704 and 706 PASS

- 704’s original opening foregrounded “Trenta giorni:” and then separately warned that the term creates no general right for visitors. The revision starts with the application and its ordinary deadline, separates the legally consequential next-day starting point, and ties visitor eligibility to the chosen route. The opening supplies usable information rather than announcing a guide.
- 704 moves the article-16 direct NIA route out of an overloaded opening into the submission section. The two clocks (entry vs in-Taiwan visa issuance), integrated-document exception, and official URLs remain. The costs/processing/payment/collection sequence is easier to follow; the old “Questo intervallo non è il tempo totale della pratica” has been removed without losing the two payment/collection starting points.
- 706 replaces the generic second paragraph listing dates with the article-31 continuation exceptions. The legal consequence and its conditional exceptions are now adjacent. It also replaces the dense renewal-document prose with a genuine document list; the list serves distinct categories rather than an arbitrary three-point template.
- 706 retains short sentences with real information: the clock starts on the event date, loss/damage replacement costs NT$500, and a fraction of a year is charged as a full year. These are not empty sentence-length padding. The overseas-loss and travel sections retain necessary legal negatives; accuracy justifies those distinctions.
- Titles are subject-specific. 704 concerns the first application and collection, 705 actual visa purposes, 706 expiry/change/re-entry. Summaries and FAQs match the bodies. Headings concern actual procedural questions, not generic commands to check or verify. The substantive endings return to the card’s actual expiry, the study entry route, and the re-entry/pending-application decision. None ends with promotional copy.

## First-two-paragraph deletion test

704, paragraphs at lines 31 and 33: sentence 1 gives the required act, document and ordinary deadline; sentence 2 supplies the next-day counting rule; sentence 3 provides the article-22 basis and visitor-scope restriction. Paragraph 2 adds the distinct in-Taiwan issuance-date clock and the integrated-document/Gold Card exception. Each deletion loses an operative fact or its scope; no throat-clearing should be removed.

705, lines 32 and 34: the opening question establishes the visa-free-entry decision and is the referent of “lo consente”; the answer introduces the limited article-16 route; the following sentence limits its scope. The study paragraph adds a different visa branch and the admission-letter role, followed by the effect of an incompatible entry. These are substantive. The professional-family detail needs the correction above, and the passport/citizenship wording can be made idiomatic.

706, lines 31 and 33: the first sentence identifies loss of the employment/family basis before printed expiry; the next gives revocation/cancellation and the exception structure. Paragraph 2 identifies possible continuation grounds, their proof requirement and why job cessation alone does not establish the labor-dispute exception. The proof sentence can be read smoothly as a brief transition to the example; it is not one of the repeated detached-tail clusters identified in 705. Deletion would remove a distinct legal limitation or scope explanation.

## Independent same-language comparison

Read all three in full independently; all carry publication date 2026-10-23. Existing samples are not assumed perfect.

| Comparator path relative to repo | Concrete comparison |
|---|---|
| `src/content/columns-it/686-taiwan-oem-molds-design-files-handover.md` | Opens with what a new OEM may do with supplied files, then distinguishes materials delivered from rights granted. Headings concern file formats, copyright, retained molds and transfer records. The ending names an inventory of missing materials. Revised 704 instead leads with a deadline, uses a purposeful submission-channel table and ends with the issued card’s expiry; no copied opening or contact ending. |
| `src/content/columns-it/687-italy-resident-heir-taiwan-inheritance-renunciation-debts.md` | Opens with citizenship/choice of law, then a statutory qualification. Headings connect the renunciation clock, Italian document preparation and inherited debt. It ends on evidence of when succession became known. Revised 705 leads with entry status and covers work/study/family categories. Both contain legal qualifications, but 705’s clustered one-line warnings warrant the bounded repair above; the comparator’s similar caution habits are not a reason to accept them. |
| `src/content/columns-it/688-italian-business-visitor-taiwan-summons-interpreter-defense.md` | Opens with Chinese terms on a summons; headings follow interpreter, defence, witness and flight issues. Its ending returns to language comprehension and procedural role. Revised 706 opens with residence-basis loss and organizes actual renewal/change/travel procedures. Its ending is tied to re-entry documentation and a live application, not generic professional advice. |

## URL, numeric, metadata and legal preservation

Independent Python comparison used `git show` originals and current bytes. Distinct official URLs are 14/14, 11/11 and 13/13 respectively; missing or newly substituted official URLs: zero. Internal links missing: zero. After stripping URLs, digit-token sets have no missing or added tokens in all three bodies. This mechanical result was checked against prose and number words, not treated as semantic proof.

Manual preservation checked: resident-entry 30 days from the next day vs in-Taiwan visa issuance; original/copy requirements; one-month employment/enrolment documents; two-year ARC vs six-month visa photos; spouse registration/presence and first-year card; NT$1,000/year, partial-year charge, NT$2,200 and NT$500; ten/five processing days and supplement restart; student payment five working days after approval and pickup three working days after payment; student account vs migrant organizational accounts and intermediate-skill exclusion; ordinary three-year ceiling with special-regime caveat.

705 retains full-time-course scope; visa-free/arrival/other-purpose study restrictions; article 23(4); four completed Mandarin months plus at least three additional months; fifteen weekday hours, one-quarter absence including leave; student permission and twenty-hour limit outside summer/winter holidays; 60-day visitor route and restrictive-annotation condition; approved sponsor residence, minor/disabled-dependent-adult-child scope (subject to the sponsor correction above); household-registration spouse permission exemption after residence; four Gold Card functions and qualification assessment; company-registration/personal-residence distinction.

706 retains three-month ordinary and four-month continuing-business entrepreneur windows (separate three-month post-cessation route); six-month Mandarin renewal and in-principle two-year combined period; article-31 address/workplace 30 days from the next day versus reason-change 30 days from the event and alternative BOCA 15 days; graduate departure/allowed extension options; change-of-employer permission and exceptions; passport information updates without inventing a universal deadline; overseas loss, channel/account authentication differences, older migrant-card exception; article-34/APRC distinction and pending-application departure consequences scoped to the stated channels. No blanket assertion prohibiting work during a graduate extension was added.

Publication date, lastmod, author/topic/audience, routes and slugs remain intact. No public author attribution, invented human/native review, new consultation language, invented case, bold markup or sales promise appeared. The no-public-author rule concerns rendering; the internal author field remains.

## Image review

Opened all three actual generated WebP files with the image viewer. 704 shows a blank travel booklet, document folder/papers, plain card and pen; 705 closed laptop, books, two mugs and plain travel booklet; 706 blank open notebook, travel booklet, plain card, keys and bag. Taipei appears through the window. No real person, text, official-document replica, logo or flag was observed. The Italian alt/captions describe visible objects accurately and identify illustrative scenes; an alt need not inventory every background item. File paths match the brief and files exist. Rendered display is root integration’s check, not asserted here.

## Actual CLI and section 5 check

Commands run independently from the repository:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-it/704-taiwan-arc-first-application.md --lang it
sentences=49 mean=17.2 cv=0.457 short=0.224 run3=0.021 opener_rep=0.176 cite_end=0.0 cite_para=0.353 contrast=0 caveat=0 q=1
OK — no variety limit violated; exit 0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-it/705-taiwan-visa-residence-work-study-family.md --lang it
sentences=53 mean=17.9 cv=0.47 short=0.226 run3=0.137 opener_rep=0.263 cite_end=0.0 cite_para=0.421 contrast=0 caveat=0 q=2
OK — no variety limit violated; exit 0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-it/706-taiwan-arc-renewal-changes-reentry.md --lang it
sentences=55 mean=17 cv=0.459 short=0.182 run3=0.057 opener_rep=0.167 cite_end=0.0 cite_para=0.5 contrast=0 caveat=0 q=1
OK — no variety limit violated; exit 0
```

`git diff --check` on the three assigned paths: exit 0, no output.

1. Actual CLI: 3 measured PASS, zero FAIL; no checker or thresholds edited.
2. Opening types: deadline/application, entry-status question, loss-of-basis consequence; no stock hypothetical or invented case.
3. At least two genuinely informative short sentences in each. No number-laden sentence loses a condition through truncation. 705:56 still overloads two actors before a clipped warning and is covered by the style repair above.
4. Paragraph starts inspected vertically, with no threefold identical opener in these files. Necessary Italian articles are not replaced by ornamental transitions.
5. No three consecutive literal claim/statute/caveat paragraphs, and all have citation-free practical paragraphs. However, the unmeasured cluster of detached caution endings in 705 remains material; the CLI’s caveat=0 does not prove its absence.
6. No stock contrast construction or fabricated opponent. Necessary denials of automatic residence/work rights remain. Those qualifications should be integrated, not deleted to improve rhythm.
7. Substantive endings are connected to each article’s facts; source/scope tails are structural and contain no promotion.
8. Professional Italian register is consistent. Korean/Japanese register checks are inapplicable. No bold or invented first person; headings describe real issues.
9. Numeric/URL/condition preservation checked as above. One pre-existing article-16 eligibility omission requires a substantive correction.

## Bounded next step and limits

Author should repair only 705:68’s sponsor condition and the grouped 705 paragraph-flow findings, optionally its citizenship wording, then rerun the real CLI and provide new hashes. The reviewer will recheck changed passages, opening/conclusion, source fit and final hashes. There is no request to reopen 704/706 or redesign the series.

This review does not certify every official source’s current-law history, browser rendering, deployment or individual applicant eligibility. The researcher’s source-refresh and root’s final release checks remain separately identified.
