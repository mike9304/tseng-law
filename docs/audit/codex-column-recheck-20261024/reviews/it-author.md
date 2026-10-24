# Italian ARC revision — author repair report

## Final paragraph repair after independent review — current version

Root expanded the repair scope to paragraph-level editing within 705, with facts, numbers, sources and the substantive article-16 correction fixed. Only 705 changed; accepted 704/706 hashes remain unchanged.

Current author self-check: PASS, with independent re-review requested separately. The earlier numeric conflict is resolved without changing the checker or restoring detached caution tails.

Current 705 SHA-256: `9eb7250a9ef513785aab13f7e590d498635786ad8c43dae7cb7dc3385c5189e1`.

Actual final command and output:

```
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-it/705-taiwan-visa-residence-work-study-family.md --lang it
sentences=49 mean=19.1 cv=0.458 short=0.204 run3=0.0 opener_rep=0.263 cite_end=0.0 cite_para=0.421 contrast=0 caveat=0 q=2
OK — no variety limit violated
```

Exit 0. `git diff --check` on the three assigned paths: exit 0, no output. Final official URL sets are unchanged, no internal links are missing, and body-only numeric token sets have no missing or new tokens. Number words and conditional meanings were reread manually; these token checks are not treated as semantic proof.

Changes in this paragraph pass:

- Restored the professional article-16 paragraph to two coherent sentences as the independent reviewer requested. The one-sentence 45-word version was too dense. Permission/exemption, qualifying professional categories, entry title, approval and the degree-alone limitation all remain.
- Shortened the opening to the actual question, “Si può chiedere l’ARC dopo l’ingresso senza visto?” The same limited article-16 answer follows. No first-two-paragraph fact was dropped.
- Connected the conditions of visa-free entry with the separate requirement for work permission/exemption, then retained the concrete rule for actual business-trip activities. This replaces three equally weighted explanatory sentences with a conditional sentence and its practical application.
- Turned the regular-study attachments into an actual document list, keeping the abroad/full-time scope, competent representation, non-exhaustive “tra gli allegati,” Chinese/English translation threshold and prescribed health form. The shorter sentence about where to file carries a necessary procedural fact; it is not a general warning.
- In the Mandarin paragraph, the completed four-month requirement is now explicitly tied to residence. The qualified centre and additional three-month enrolment remain in the next sentence with the initial-enrolment limitation. This avoids implying that four months of study precede the trip or the initial visitor visa.
- The Gold Card application and qualification assessment remain in one connected sentence. Its four functions are now a true parallel list, instead of an isolated qualification reminder. These two lists (student documents and Gold Card functions) have identifiable reader uses; they are not arbitrary “three tips” or substitutes for legal conditions.
- Corrected the migrant paragraph’s source attribution after the final reviewer’s limited source check. The linked NIA 181964 guidance is attributed only to ARC applications/renewals and their documents. Work authorizations and possible family admission are identified separately as category-dependent matters; the paragraph no longer claims that this ARC guide itself regulates family eligibility. The professional-portal restriction remains.

The article-16(2) substantive correction is fixed throughout this pass: ordinary foreign professional working professionally in Taiwan OR foreign special professional; both already authorized by NIA for residence/permanent residence; qualifying spouse, minor and disabled-dependent-adult children; visa-free/visitor entry and approval of the family application. Author reopened the [official current article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) on 2026-10-24. This is a substantive eligibility repair, not a claim that the original meaning was complete.

Manual section 5 recheck: opening still identifies the actual entry decision; necessary short statements give filing location, the completed-study period and holiday/leave treatment; no generic warning was reintroduced to inflate variation; paragraph-start maximum remains two, consecutive same starts zero; no new contrast or first-person case; final paragraph/FAQ/image metadata remain consistent. The overall preservation audit and three-comparator discussion in the initial report still apply, subject to the expressly recorded article-16 correction. The initial and intermediate SHA/CLI results below are history, not current approval evidence.

Unchanged accepted hashes:

- 704: `38d394cf0834d7313a4e65d60c6068727448c84391fcd154cf17498d1b58d40b`
- 706: `e0600c580dd6cad72a7de6a08ca8c640228224623e4d03c73895bdc81d037055`

Independent review must use the current 705 hash above. No human/lawyer review, build, image-render or publication claim is made by this author report.

---

## Historical bounded repair — superseded by the paragraph pass above

This section supersedes the initial author self-check below for article 705 only. Articles 704 and 706 remain unchanged at their accepted hashes.

Applied the independent reviewer’s grouped 705 flow findings: integrated offer/permit and degree/eligibility qualifications; connected migrant-category instructions to the permissions, documents and family rules they govern; removed the duplicated spouse-exemption tail; joined Gold Card qualifications to the application requirement. Also changed “cittadinanza del passaporto” to “cittadinanza indicata sul passaporto”.

Substantive correction: article 16(2)’s sponsor eligibility was incomplete in both the original and the first rewrite. The revised text expressly distinguishes an ordinary foreign professional performing professional work in Taiwan from a foreign special professional. Both must already have NIA residence/permanent-residence authorization; the family application still requires approval and retains the spouse, minor and qualifying disabled-dependent-adult-child conditions and visa-free/visitor entry. This is not described as meaning-preserving style work.

Author independently reopened the official current [article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) on 2026-10-24. The specific author-source limitation in the initial report is therefore superseded for this provision only.

Intermediate 705 SHA-256: `fc2f92ee388d58a5a452721397e23031e1dff4d6ff161c26aa549a8f9fd89704`.

Actual current command:

```
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-it/705-taiwan-visa-residence-work-study-family.md --lang it
sentences=49 mean=19.8 cv=0.418 short=0.143 run3=0.17 opener_rep=0.263 cite_end=0.0 cite_para=0.421 contrast=0 caveat=0 q=2
FAIL len_cv=0.418 (limit >= 0.45)
```

Intermediate status was AWAITING BOUNDED REVIEW / METRIC CONFLICT, not PASS. Removing the detached one-line warnings improves the identified prose flow but lowers length variation. A clear two-sentence professional paragraph gave CV 0.347; connecting the related legal conditions yields 0.418. No filler or detached generic warnings were reintroduced solely to reach the threshold. The independent Italian reviewer and final Europe reviewer were notified to judge the actual prose before any further edit.

Original official URL sets and internal links remain intact; `git diff --check` on the three owned article paths exits 0. No other language or shared file was changed.

---

Date: 2026-10-24. Role: AI Italian editorial author/repairer. I authored these revisions; this report is an author self-check, not an independent locale or legal review, and does not claim publication or human/native-speaker review.

Result: AUTHOR SELF-CHECK PASS. All three final manuscripts have zero variety-check FAILs. Independent review and the root’s image/render/release work remain outside this assignment.

Base compared: `174454bd4bb8d9e05627d71f9ef0af646540b3e4`.

Owned files only:

- `repo/src/content/columns-it/704-taiwan-arc-first-application.md`
- `repo/src/content/columns-it/705-taiwan-visa-residence-work-study-family.md`
- `repo/src/content/columns-it/706-taiwan-arc-renewal-changes-reentry.md`
- This report.

Read in full before writing: `work/REVISION-BRIEF.md`, repo `AGENTS.md` and `docs/columns/EDITORIAL-VOICE.md`, `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, shared `SENTENCE-VARIETY-RULE.md` and `LESSONS.md`, and the editorial skill’s `references/review-criteria.md`. Retired Fable provisions were not applied.

## Repair decisions and actual examples

The old Italian versions generally contained the necessary facts, but repeatedly told the reader to “verificare,” added commentary about how to interpret the previous sentence, and ended otherwise connected paragraphs with isolated warnings. I rewrote paragraphs and section order, not just individual synonyms. All titles, summaries and FAQ answers were reread and revised.

| Final location | Before → after | Reason and legal meaning |
|---|---|---|
| 704:31 | “Trenta giorni: chi entra a Taiwan…” → “La domanda di ARC, l’Alien Resident Certificate, va presentata di regola entro 30 giorni…” | States the act and deadline directly; the following sentence retains the next-day starting point. Ordinary resident-visa scope, article 22 and visitor eligibility restriction remain. |
| 704:33, 70 | The second paragraph mixed domestic visa issuance, direct professional applications and Gold Card exceptions → the opening now keeps the issuance-date deadline and Gold Card exception together; direct NIA applications move beside the submission channels. | Reduces competing procedural branches in the opening. Article 16 and its conditions remain, with the same URL. |
| 704:53 | “Il paese che ha emesso il certificato conta: parlare italiano o abitare in Italia non rende italiano un documento rilasciato altrove.” → “Conta il paese di emissione del documento. Un certificato rilasciato altrove può dunque seguire un altro percorso, anche se il richiedente vive in Italia o parla italiano.” | Removes a schoolmasterly tautology; keeps the issuing-country distinction and the information to give the competent office before commissioning a translation. |
| 704:80 | Payment and pickup were followed by “Questo intervallo non è il tempo totale della pratica.” → a single connected sequence states payment within five working days from approval and pickup three working days after payment. | The warning duplicated the preceding timing. Both clocks, their starting points, printed online receipt and chosen service centre remain explicit. General and student processing periods remain in the preceding paragraph. |
| 705:32–34 | University admission opening followed by a loosely attached professional exception → a concrete question about visa-free entry, its limited article 16 answer, then the university/mandarin distinction. | Makes entry status the decision connecting the routes. The answer remains conditional; it creates no general right to convert visa-free entry. |
| 705:56–58 | “Un’offerta non è un permesso.” and “La sola laurea non basta.” stood as clipped admonitions → the employer’s application and the worker’s copy of the authorization are connected; professional permission or exemption is part of the eligibility sentence. | Offer-versus-permit and degree-alone limitations remain, but now accompany the action and condition they qualify. Employer responsibility and approval prerequisite are unchanged. |
| 705:68 | A four-person-category sentence surrounded by separate general caveats → the sponsor’s already-approved residence is in the same sentence as the direct family route; spouse/minor children and disabled dependent adult children follow separately. | Preserves the AND conditions and the limited family categories. Parents and other relatives still require a different possible basis. |
| 705:76 | “La costituzione di una società non sostituisce l’esame della posizione personale…” → the entrepreneur paragraph states that personal criteria still apply after incorporation and registration does not automatically confer residence. | Replaces abstract “examination of a position” with the real distinction between the company registration and personal residence application. No entitlement is added. |
| 706:31–33 | Opening question followed by a generic list of dates to gather → actual effect of loss of the residence basis, immediately followed by the limited continued-residence grounds. | Retains revocation/cancellation under article 31 and its exceptions; moves the exceptions forward instead of making the opening a generic checklist. |
| 706:59 | “Sono 30 giorni dalla data del fatto. Qui il conteggio non parte…” → the regulation and 30-day deadline are stated together, then “Si conta dalla data del fatto.” | The short sentence carries the legally significant start date; the next-day rule for address changes remains expressly distinguished. This is not a new grace period. |
| 706:69–75 | Repeated “In caso…” and “conviene” frames → a replacement-card paragraph, an overseas-loss paragraph, then the re-entry rule tied to the pending application. | Loss/damage evidence, NT$500 fee, overseas channel/account differences, old migrant-card exception and permanent-resident exception remain. |

No substantive legal correction was intended or silently introduced. Removed wording was repetitive explanation, not an eligibility condition, deadline, exception, amount or source.

## First-two-paragraph deletion test

704:

- P1 sentence 1 identifies the document, required application and ordinary 30-day deadline. Deleting it loses the act and timeframe.
- P1 sentence 2 gives the next-day starting point. It is needed to prevent counting from arrival day.
- P1 sentence 3 gives article 22’s authority and restricts the rule to resident-visa entry; visitors still need a qualifying path.
- P2 sentence 1 supplies a different starting point for a resident visa issued inside Taiwan. P2 sentence 2 preserves the valid integrated-document/Gold Card exception. Neither is introductory padding.

705:

- P1’s question identifies the decision being answered: whether visa-free entry can lead to residence. The next sentence gives the narrow article 16 answer; the last sentence limits its categories and identifies citizenship, entry title and purpose.
- P2 names the two distinct study visa routes and the role of the admission letter. Its last sentence gives the practical consequence of a different entry title. No promise that all admitted students can convert remains.
- The former abstract sentence saying three factors “must be assessed together” was replaced by the factors’ relationship to eligibility.

706:

- P1 first sentence ties the problem to employment/family changes before the printed expiry; its second sentence states article 31’s revocation/cancellation rule and preserves continuation exceptions.
- P2 now contains those material exceptions: particular family situations, pending employment disputes and occupational injuries still in treatment. The proof requirement and example preserve their conditional character.
- Deleted the former generic dates-to-prepare opening paragraph. The actual dates and clocks appear at the relevant procedures instead.

## Three recent Italian comparators

All were read in full, and all show publication date 2026-10-23. They are comparators, not assumed perfect models.

1. `repo/src/content/columns-it/686-taiwan-oem-molds-design-files-handover.md`: opens with the concrete question whether a new OEM may use supplied files, then distinguishes delivery from permitted uses. Headings concern file format, commissioned drawings, retained molds and a handover record. The last substantive paragraph ends with the missing-material inventory after a service-language/contact note. New 704 uses a deadline instead of a hypothetical/question opening, a real document list and a portal comparison, and ends with the expiry on the issued card. It does not copy the contact ending.
2. `repo/src/content/columns-it/687-italy-resident-heir-taiwan-inheritance-renunciation-debts.md`: opens by rejecting residence in Italy as the sole choice-of-law factor and immediately links the statute. Headings focus on knowledge of succession, document preparation from Italy and limited debt responsibility. Its last paragraph ends with preserving evidence of when the inheritance became known. New 705 instead asks about entry status, proceeds through the study/work/family eligibility routes, and ends with matching the study visa to the actual admitted course.
3. `repo/src/content/columns-it/688-italian-business-visitor-taiwan-summons-interpreter-defense.md`: starts with the Chinese terms for witness and accused; its headings divide language, defence, witness refusal and a return flight. It ends with language comprehension and the role stated in the summons. New 706 begins with a change affecting residence despite an unexpired card; headings distinguish renewal, address changes, change of purpose, replacement and travel while an application is pending. Its closing is about the return document and the effect of leaving Taiwan on that application.

The comparators themselves repeat “occorre/va/conviene” and similarly structured contact paragraphs. Those habits were not used as a style target. The revised articles retain procedural specificity without adopting those shared endings or duplicating body FAQs.

## Preservation audit

Automated comparison against the base commit:

| Article | Distinct official URLs old/new | Missing/added URLs | Internal links old/new | Missing internal links |
|---|---:|---|---:|---|
| 704 | 14 / 14 | 0 / 0 | 2 / 2 | 0 |
| 705 | 11 / 11 | 0 / 0 | 3 / 3 | 0 |
| 706 | 13 / 13 | 0 / 0 | 2 / 2 | 0 |

Manually checked the source/claim relationship as well as the URL set. Original source lists, source dates and regime exclusions are preserved. No source was moved to support an unrelated rule.

704 retains:

- Resident-visa entry: 30 days counted from the day after entry; resident visa issued inside Taiwan: 30 days from issuance; article 22 integrated-title exception and article 16 direct route.
- Originals/copies, address evidence, employment permission and employment certificate from the last month; student admission/enrolment distinction and additional visitor-study attachments; Taiwan registration of marriage for the specified spouse category.
- ARC photo within two years; BOCA photo within six months; authentication/translation conditions and issuing-country relevance.
- Student personal account, migrant portal’s organizational/employer accounts and intermediate-skilled-worker exclusion; presence of the Taiwanese spouse for the first application and first card for one year.
- NT$1,000 per year including a fraction; NT$2,200 surcharge after visa-free/visitor entry; restricted overseas-Chinese-student reduction; general three-year ceiling subject to special regimes.
- General ten working days excluding returns, supplements and interviews; student five working days; supplement deadline and restarted processing count; five working days to pay after approval and pickup three working days after payment with printed receipt.
- ARC’s residence function and work permission/exemption requirement; no universal right to work.

705 retains:

- BOCA resident-visa purpose evidence, NIA decision/ARC role, passport/entry-dependent visa exemption and work permission or applicable exemption.
- Employer application where required; professional/special professional eligibility, visa-free/visitor entry, professional-work authorization or exemption and NIA approval under article 16.
- Separate migrant-worker regime, category-specific family rules and no universal professional-portal access.
- Full-time regular-study route from abroad, admission/academic/funds/health attachments and the Chinese/English diploma/transcript translation threshold; article 23 paragraph 4 study-visitor route and BOCA’s exclusions for visa-free, visa-on-arrival and different-purpose entry.
- Mandarin: proper visitor visa before travel, four completed months, qualified university-affiliated centre, further enrolment of at least three months, at least 15 weekday hours, absence including leave no more than one quarter.
- Article 50 student work permit and 20-hour weekly cap outside winter/summer holidays.
- Taiwan household-registration spouse conditions; article 23 entry of at least 60 days without the specified restrictive annotations; article 16 family sponsor already resident/permanent resident and spouse/minor/qualifying disabled adult-child categories.
- Article 48 spouse work exemption only after residence and within the specified household-registration category.
- Gold Card’s four functions, individual application without an existing employer and qualification assessment; entrepreneurship/incorporation distinction.

706 retains:

- Article 31 withdrawal/cancellation and conditional continuation grounds; ordinary three-month renewal window, entrepreneur four-month window for continuing activity and separate three-month post-cessation route.
- Last-month student enrolment proof; Mandarin attendance, up to six-month renewal and in-principle two-year combined stay/residence ceiling; appropriate work/family/address evidence.
- NT$1,000 per year with partial-year treatment; authority decides duration.
- Address/employment-location notification: 30 days from the following day; new work permission and article 53 exceptions; migrant transfer limits.
- Article 23-1 change-of-purpose eligibility and article 7’s 30 days from the event itself; alternative BOCA visa route within 15 days followed by NIA, subject to category/special rules.
- Graduates’ allowed alternative extension or ARC return/departure steps; no automatic extension from graduation. No new blanket prohibition on work during a graduate extension was added. The researcher’s article 12 caution was received and respected.
- Passport/name/data updates; loss/damage supporting documents and NT$500, other changes priced according to their nature; overseas online/proxy application, authentication/account differences and old migrant-card exception.
- Article 34 re-entry permission/permanent-resident exception, multiple re-entry validity, e-Gate limitation, departure-related termination of the specified online applications, student visitor-entry scope and no automatic grace period for overstaying.

Stable metadata checked: publication date, lastmod, date_display, author and topic unchanged. Routes, filenames and audience unchanged. No consultation language or service promise was added; no public author/byline or review claim was introduced.

## Images

Added the requested `featured_image`, natural Italian alt and illustrative caption for each of the three v2 paths. No inline duplicate image, people, official-form claim or public AI-author claim. These descriptions follow the root’s still-life brief; actual generated-image inspection and rendered placement belong to root integration.

## CLI and section 5 manual check

Run from `/Users/son7/tseng-arc-revision-20261024/repo`:

```
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-it/704-taiwan-arc-first-application.md --lang it
sentences=49 mean=17.2 cv=0.457 short=0.224 run3=0.021 opener_rep=0.176 cite_end=0.0 cite_para=0.353 contrast=0 caveat=0 q=1
OK — no variety limit violated

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-it/705-taiwan-visa-residence-work-study-family.md --lang it
sentences=53 mean=17.9 cv=0.47 short=0.226 run3=0.137 opener_rep=0.263 cite_end=0.0 cite_para=0.421 contrast=0 caveat=0 q=2
OK — no variety limit violated

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-it/706-taiwan-arc-renewal-changes-reentry.md --lang it
sentences=55 mean=17 cv=0.459 short=0.182 run3=0.057 opener_rep=0.167 cite_end=0.0 cite_para=0.5 contrast=0 caveat=0 q=1
OK — no variety limit violated
```

`git diff --check -- <the three assigned article paths>`: exit 0, no output.

1. All three actual CLI runs exit 0; no tool or threshold was modified. Initial draft failures were repaired in the prose. The final decision also includes an actual full read, not just these measurements.
2. Openings differ: an application deadline (704), a real entry-status question (705), and the consequence of losing a residence basis (706). No stock fictional opener or invented case.
3. Each has at least two meaningful short sentences. Examples are the next-day starting point, the one-year first spouse card, annual fraction charge, permitted holiday exception and NT$500 replacement fee. No paragraph contains more than one sentence of 32 or more measured words. Connected conditions remain in longer sentences where that is clearer.
4. Final maximum identical paragraph opener is two in every article. Adjacent repeated sentence starts: 1 / 0 / 1. Read the paragraph starts vertically; they are grammatical Italian subjects/conditions, not inserted ornamental transitions.
5. No repeated “claim (statute), then caveat” rhythm. End-parenthesis citation share is zero. Practical submission, document and travel paragraphs provide citation-free explanation while the legal claims retain their official links.
6. No stock “not X but Y” rhetoric. Necessary legal negatives and the factual distinctions between clocks, permits and status remain. The CLI reports zero contrast templates in each article; this does not mean every legal negative was removed.
7. Last substantive paragraphs end on the issued card’s actual expiry (704), the study visa matching the admitted course (705), and the return title/pending application (706). Source lists and concise scope limitations remain separate; no copied sales ending.
8. Natural professional Italian, no invented first-person experience, no imperative checklist headings, no bold markup. Korean/Japanese register rules are inapplicable to these files.
9. Numerical/conditional/source audit above completed. Author metadata and original source dates retained; no factual change is hidden as a style repair.

## Remaining limits

No known unresolved editorial or preservation issue in the assigned files. This report does not replace the separate official-source refresh, independent review, image inspection, build or public deployment verification. I did not independently reopen the official pages during this style-only author pass; the source-refresh specialist is handling that task. There is no claim that an Italian human or lawyer reviewed these manuscripts.

## Final SHA-256

- `704-taiwan-arc-first-application.md`: `38d394cf0834d7313a4e65d60c6068727448c84391fcd154cf17498d1b58d40b`
- `705-taiwan-visa-residence-work-study-family.md`: `49f4fef1401a2d97005daf3254e5bef83a910a71eaf2284c8493ce161d6008b9`
- `706-taiwan-arc-renewal-changes-reentry.md`: `e0600c580dd6cad72a7de6a08ca8c640228224623e4d03c73895bdc81d037055`
