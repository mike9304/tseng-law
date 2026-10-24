# Arabic ARC revision — independent editorial review

Date: 2026-10-24. Reviewer: `/root/review_rev2_ar`, independent AI Arabic editorial reviewer. I did not author or edit these articles. This is not a human native-speaker or lawyer certification. I own only this report; article changes belong to the author. Other contributors' files were preserved.

Current verdict: PASS for all three articles at the final hashes immediately below. The author applied the three bounded prose repairs and the final legal reviewer's Article 16(2) sponsor-scope clarification. I independently rechecked the changed paragraphs, FAQ and affected conclusions, reopened Article 16, and reran the required CLI. No unresolved material finding remains in my assigned locale review. I did not edit the articles.

## Final recheck and authoritative hashes

| Article | Final SHA-256 | Final locale verdict |
|---|---|---|
| `src/content/columns-ar/704-taiwan-arc-first-application.md` | `bedb127646dbfeb26a7795813ac6a38e3a122c597131695e0e4e72ad2b2278cb` | PASS |
| `src/content/columns-ar/705-taiwan-visa-residence-work-study-family.md` | `2f160a48653b9a00f7e4000110267a8ff027a8bb4cea4307dd6136f55726429c` | PASS |
| `src/content/columns-ar/706-taiwan-arc-renewal-changes-reentry.md` | `49e16d952600fc712b69c3681253652208758b9576e855df16e56737bb96fab2` | PASS |

- 705:34: the generic final sentence was removed. The paragraph retains resident-visa purposes, ARC/NIA functions and the conditional direct route. The first-two-paragraph deletion finding is closed.
- 705:62: the redundant admission qualification is now stated once, followed by work authorization with the applicable exemption. The official URL and the condition that student status/ARC alone do not establish work entitlement remain. This reads as connected Arabic rather than two short versions of the same proposition.
- 706:80: the paragraph begins with the pilot's actual suspension rule. The second sentence directs applicants in other routes to their processing authority; no general suspension or travel prohibition is implied. The generic announcement and metawarning are gone.
- 706:78: I also reviewed the author's additional nearby split after the first repair lowered the CV. «تُطابق بيانات الجواز مع ARC، وتُراجع صلاحية البطاقة وإذن إعادة الدخول المثبت عليها. تلزم صلاحيتهما يوم العودة.» specifies document-data consistency and the actual return-day validity condition. The short final sentence is substantive, not filler. The receipt limitation and permanent-resident exception are preserved.
- 705:68–70 and FAQ 29: the final reviewer found that the earlier generic “eligible professional” wording did not expressly state the sponsor distinction in Article 16(2). The repair now identifies an ordinary foreign professional who is carrying out professional work in Taiwan, OR a foreign special professional; NIA residence or permanent-residence approval is required in both cases. «الذي يزاول عملًا مهنيًا في تايوان» states the ongoing-work condition, and «في كلتا الحالتين» / «في الحالتين» explicitly attaches the residence/APRC approval condition to both categories. The subsequent paragraph retains spouse, minor children, qualifying disabled adult children, visa-exempt/visitor entry and direct application subject to the statute. The FAQ preserves the relatives' scope and does not include parents automatically.

I independently opened [Foreign Professionals Act Article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) during this recheck and compared paragraph 2 with the exact revised Arabic. This is a substantive scope clarification addressing an earlier omission, not merely a meaning-preserving stylistic edit. The change does not broaden family eligibility and does not impose the ordinary-professional current-work condition on the separate special-professional category. The previous initial-review assertion that no legal issue had been identified is historical and is qualified by this later finding and repair.

Final independent CLI results (same exact commands shown in the initial run below), each exit 0 with `OK — no variety limit violated`:

| Article | Sentences | Mean | CV | Short | Run3 | Repeated opener | End citation | Contrast | Caveat | Body questions |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 704 | 52 | 15.3 | 0.451 | 0.192 | 0.100 | 0.000 | 0.000 | 0 | 0 | 1 |
| 705 | 57 | 16.5 | 0.451 | 0.175 | 0.055 | 0.048 | 0.000 | 0 | 0 | 1 |
| 706 | 57 | 15.8 | 0.453 | 0.228 | 0.127 | 0.143 | 0.000 | 0 | 0 | 1 |

Final URL set checks still report 15/17/15 unique targets with zero removed or added URLs. Numeric comparisons still report only the historical removal of list marker `4.` in 704; no substantive digit loss/addition. Images, image metadata, titles, summaries, publication dates, routes and internal authorship fields did not change during repair. I reread the final 705 and 706 bodies and endings; the manual section 5 conclusions below still hold, and the identified 705/706 exceptions are now closed. No new repetitive opener, fake experience, bold, public author claim, consultation promise or promotional ending was introduced. Source-level Arabic punctuation remains coherent; actual browser RTL rendering/publication is outside this report.

## Initial review record — superseded by the final recheck above

Initial verdict: REQUEST_CHANGES for two articles, limited to three prose locations below. Article 704 passed. The rewrite was substantially better than the published baseline; the remaining request concerned redundant wording directly relevant to the user's complaint. The successful metric runs were not the basis for the prose verdict. The later Article 16(2) finding is documented above.

## Initial reviewed versions

All paths below are relative to `/Users/son7/tseng-arc-revision-20261024/repo`.

| Article | SHA-256 | Locale verdict |
|---|---|---|
| `src/content/columns-ar/704-taiwan-arc-first-application.md` | `bedb127646dbfeb26a7795813ac6a38e3a122c597131695e0e4e72ad2b2278cb` | PASS |
| `src/content/columns-ar/705-taiwan-visa-residence-work-study-family.md` | `914ccafcd5cca6de7cfec2fedf55591eaa04941af84beb7dc093e304e564e04d` | REQUEST_CHANGES |
| `src/content/columns-ar/706-taiwan-arc-renewal-changes-reentry.md` | `d193c06e4361e18f4e3186644cbb882c22713119b15bf41fb77bb16d8d9b54a0` | REQUEST_CHANGES |

Read in full: `work/INDEPENDENT-REVIEW.md`, `work/REVISION-BRIEF.md`, repository AGENTS.md and EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, SENTENCE-VARIETY-RULE.md, LESSONS.md, tseng-law-editorial SKILL.md and review-criteria.md, the Arabic author report, source-refresh.md, all three full originals from `git show 174454bd4bb8d9e05627d71f9ef0af646540b3e4:<path>`, all three full revised articles, and the three full Arabic comparators recorded below. I independently viewed the three actual WebP illustrations.

## Initial bounded required repairs — now closed

These are editorial repairs, not requests to remove a legal condition. No broad rewrite is requested.

| File:line | Exact sentence or smallest relevant span | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| `src/content/columns-ar/705-taiwan-visa-residence-work-study-family.md:34` | «ولكل طريق شروط دخول ومستندات، يُختار على أساسها الإجراء المناسب قبل السفر.» | The first-two-paragraph deletion test leaves the resident-visa purposes, ARC function, issuing agency, conditional direct route and citation intact. This last sentence gives generic planning advice already supplied concretely by the following sections and the travel ending. It remains an outline-like administrative conclusion. | Delete this sentence. End the paragraph with the existing Article 16 sentence. | Yes. Keep the preceding «لبعض الفئات» and its URL; no eligibility, deadline or application route is deleted. |
| `src/content/columns-ar/705-taiwan-visa-residence-work-study-family.md:62` | «القبول الدراسي لا يغني عن بقية الشروط. فموافقة التأشيرة والإقامة تعتمد على استيفائها» | The second proposition repeats the first without specifying another condition. The original weak short sentence has been replaced by two sentences saying essentially the same thing, so the artificial rhythm is still audible. Preserve the nonautomatic admission boundary once and move directly to work authorization. | «موافقة التأشيرة والإقامة مشروطة باستيفاء متطلبات المسار، حتى بعد القبول الدراسي. ومن يريد العمل خلال الدراسة يحتاج إلى [التصريح أو الإعفاء المنطبق عليه](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) قبل بدء الوظيفة؛ فبطاقة الطالب وARC وحدهما لا تثبتان حق العمل.» | Yes. Admission is still insufficient; both permit and applicable exemption remain; authorization precedes work; the original official URL remains tied to the work proposition. |
| `src/content/columns-ar/706-taiwan-arc-renewal-changes-reentry.md:80` | «وقد تؤثر المغادرة في المعاملة ذاتها. إذ تنص… يخص هذا الحكم المسار المذكور، ولا يُعمّم على كل نظام إلكتروني» | The generic opener merely announces the operative rule immediately after it. The paragraph then tells the reader how not to generalize the explanation. State the pilot's rule directly, and give the reader with a different application an actual next action. This also avoids another generic caution paragraph in the travel section. | «تنص [تعليمات المسار الإلكتروني التجريبي للمهنيين وأسرهم](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/) على وقف النظر في الطلب إذا غادر صاحبه أثناء المعالجة. أما من قدّم طلبه عبر مسار آخر، فيستفسر لدى الجهة التي تعالجه عن أثر المغادرة قبل شراء تذكرة يصعب تعديلها.» | Yes. The suspension remains expressly limited to the named professional/family pilot; no suspension or travel prohibition is asserted for all other routes. The conditional timing and source remain. |

MONOTONY: generic route-planning conclusion — «ولكل طريق شروط دخول ومستندات…» — remove the opening sentence that adds no condition beyond the specific routes and later travel advice.

MONOTONY: repeated admission caveat — «القبول الدراسي لا يغني عن بقية الشروط. فموافقة التأشيرة والإقامة تعتمد على استيفائها» — state the legal qualification once, then connect it to the separate work-permit question.

MONOTONY: announcement followed by interpretive warning — «وقد تؤثر المغادرة في المعاملة ذاتها… يخص هذا الحكم المسار المذكور» — begin with the pilot's actual consequence and give the other applicant a concrete inquiry.

Do not add detached short filler to recover a metric after these changes. Rerun the required CLI and reread the affected paragraph and ending; any additional repair should be confined to a genuinely awkward clause. No unresolved legal/factual blocker was identified in this locale review.

## Concrete improvements already accepted

| Baseline → revision | Assessment and preserved facts |
|---|---|
| 704: «سجّل بلد إصدار كل وثيقة على حدة. هذه المعلومات تجعل سؤال التصديق محددًا…» → «تفيد معرفة بلد إصدار كل وثيقة في تحديد البعثة المختصة بالتصديق…» | The instruction and commentary about it become one causal explanation. Country of issue and the BOCA mission directory still determine the practical authentication inquiry. |
| 704: «اختيار “طلب ARC” وحده لا يحدّد البوابة المناسبة» removed after the paragraph explaining the actual portals and service centre. | Removes an unnecessary rebuke of a hypothetical reader. Professional/family, student, Taiwanese-family and migrant-worker categories remain distinct. |
| 705: «بلد الإقامة الحالي معلومة أخرى» → a paragraph explaining mission competence and acceptance of applications from foreign residents. | The old fragment did not explain what residence affects. The new prose gives the practical consequence and still separates it from passport nationality and third-country document origin. |
| 705 FAQ: «لا تتحول جنسية المسافر إلى جنسية بلد إقامته» → «تُطبّق شروط الدخول بحسب جنسية الجواز ونوعه والاستثناءات المقررة…» | Removes a patronizing rebuttal and supplies the operative criteria. No nationality-specific right is invented. |
| 706: «انتهاء العمل يستدعي مراجعة الوضع فورًا. وكذلك تغير العلاقة الأسرية» → «لذلك يحتاج انتهاء العمل أو تغير العلاقة الأسرية إلى معالجة وضع الإقامة فورًا، حتى لو بقيت في البطاقة مدة طويلة.» | The two fragments now state a consequence of Article 31. The printed date does not become an unconditional right to remain. |
| 706: generic opening/closing around entrepreneur renewal → direct four-month continuing-business and three-month post-business routes. | Materially clearer paragraph, with both conditions and application windows preserved. |

Titles and section headings now name actual issues rather than repeatedly telling the reader to check something. 704's document table and three-step list serve real comparison and procedure. 705's prose is not forced into the same template. 706's deadline table is justified by different event-day/next-day starts. The three endings concern document dates, eligible entry, and an application pending during travel; none adds a sales paragraph. Needed legal negatives were not treated as prohibited words.

## Independent first-two-paragraph deletion test

704, lines 31–33: deleting the first sentence loses the resident-visa/granted-residence conditions, 30-day obligation and next-day start. The second sentence makes clear that later work or class commencement does not postpone that start. In paragraph two, the first sentence supplies the distinct issuance-date clock after a resident visa is issued in Taiwan; the second and third identify the direct NIA route, eligible professions/families and its limit. These are distinct information, not throat-clearing. Retain them.

705, lines 32–34: the short opening question establishes the passport plus purpose decision. The following sentence gives actual passport-nationality/type criteria and exceptions, and the Gulf-resident sentence supplies a concrete consequence without inventing a case. Paragraph two's visa-purpose/ARC-function sentence and conditional direct-NIA sentence should stay. Its final generic planning sentence fails the deletion test and is the first required repair above.

706, lines 32–34: the first sentence makes the printed-date issue intelligible; the Article 31 sentence supplies cancellation and conditional continuation; the third names job and family changes and their immediate practical effect. Paragraph two gives the normal three-month application window and evidence of a continuing residence ground. Deleting these loses the trigger, law, application or clock. Retain them.

The three opening modes differ: a deadline (704), a passport/purpose question (705), and loss of the residence ground before card expiry (706). No fictional experience or generic hypothetical opening was introduced.

## Three independently read recent Arabic comparators

All three publish on 2026-10-23, and were read in full from the repository rather than inferred from the author's notes. They are comparison evidence, not perfect prose models.

| Path under `src/content/columns-ar/` | Opening, headings and ending compared |
|---|---|
| `701-uae-court-judgment-taiwan-enforcement.md` | Opens with a UAE judgment/Taiwan assets enforcement question, then Article 4-1. Headings follow finality/service/reciprocity/assets. The ending combines contact, consultation-language limitations and the final judgment. 705's route question is similarly concrete without importing a dispute scenario; the ARC endings avoid the comparator's long service boundary paragraph. |
| `702-overseas-heir-taiwan-estate-nationality-documents.md` | Opens with the decedent's nationality and conflict-of-laws rule; paragraph two distinguishes Gulf residence from nationality/religion. Headings track actual family documents, wills, assets and renunciation timing. The revised 705 uses the useful nationality/residence distinction for entry and authentication, without implying a common legal status for Arabic readers. Its ending does not repeat the inheritance article's document/contact disclaimer formula. |
| `703-uae-resident-taiwan-counsel-arabic-documents.md` | Opens by defining what “following the case” does not authorize, followed by actual consultation languages. Headings cover representation authority, document use, authentication and service/attendance. The document-specific treatment is useful comparison for 704, but this comparator itself has repeated negative caveats; I did not treat those as a required model. The ARC series makes no Arabic-consultation promise. |

## Legal, URL and numeric preservation

Independent set comparison against the exact baseline: unique Markdown targets 15/17/15; removed URLs 0, added URLs 0 for all three. Original official and Arabic internal links remain. Claims were read with their links, not merely counted. The only missing numeric token is `4.` from 704's old fourth numbered step: category selection moved into the introduction and the remaining actions are three numbered items. No substantive digit token was removed or added.

Spelled-out Arabic periods/amounts and conditions were checked by reading both full versions:

- 704 retains the next-day and issuance-day clocks; restricted direct residence route; originals returned; recent two-year photo; one-month employment certificate; qualifying Taiwanese spouse/marriage/presence/first one-year card; foreign authentication and conditional Chinese translation, including the stronger student instruction; 512 KB and five formats; student payment five working days; electronic ARC at six months or less; chip-card collection three working days after payment; NT$1,000/year and part-year rule; NT$2,200 addition; limited 僑生 discount; general three-year maximum/special regimes; four-in-one exemption; ten versus five working-day processing and supplementation qualifications; legal work-permit exceptions.
- 705 retains nationality/passport type, current residence and document origin; work permit or lawful exemption; eligible professional direct application and approval; excluded entry methods with other legal exceptions; separate migrant-worker procedure and family eligibility; activity-specific short business visit authorization; formal study and eligible direct study entry; print/sign/submit; no promise of ordinary study conversion for visa-exempt/arrival/other-purpose visitor entries; Chinese study four months plus at least three further months, 15 weekday hours, no more than one-quarter absence including leave; permit/exemption while studying; Article 23's 60-day/no-restriction/eligible-ground conditions; Taiwanese spouse residence and household registration; Article 16's qualifying relatives and sponsor approval; narrow Article 48 spouse exemption; four-function Gold Card and entrepreneur criteria.
- 706 retains cancellation/conditional continuation; general three months versus entrepreneur four and three months; one-month student proof and Chinese attendance; NT$1,000/part-year/exceptions; family-linked duration; 30 days from the next day for address/workplace, 30 days from event day for Article 23-1 and 15 days from event day for the other route; BOCA then NIA; employer permit versus open permit/exemptions; conditional continuation examples; approved graduate extension one year from the next day after expiry and possible second year, requested before expiry; no universal passport-number deadline; declaration or police report for loss; NT$500; overseas/agent authentication and older migrant-card differences; re-entry permission and permanent-resident exception; suspension limited to the pilot; overstay less than 30 days with continuing ground, penalty before reapplication and no automatic extension or return guarantee.

I read the current task's source-refresh ledger and independently opened [Immigration Act Article 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22), the [current residence regulations](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129) and [BOCA's resident-visa/ARC deadline FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html) during this review. These support the key clocks above; the final legal reviewer retains the broader current-law/history audit. I did not claim to reopen every source or conduct a complete Arabic-to-all-13-locales comparison.

The current-law warning about Foreign Professionals Act Article 12 was respected: no sentence says all approved graduates require an employer permit or may not work. Existing general permit statements retain applicable exemptions. This review proposes no substantive correction.

## Actual metric executions and manual section 5

Executed independently, each with exit 0:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-ar/704-taiwan-arc-first-application.md --lang ar
sentences=52 mean=15.3 cv=0.451 short=0.192 run3=0.1 opener_rep=0.0 cite_end=0.0 cite_para=0.3 contrast=0 caveat=0 q=1
OK — no variety limit violated

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-ar/705-taiwan-visa-residence-work-study-family.md --lang ar
sentences=59 mean=15.9 cv=0.452 short=0.203 run3=0.053 opener_rep=0.05 cite_end=0.0 cite_para=0.35 contrast=0 caveat=0 q=1
OK — no variety limit violated

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-ar/706-taiwan-arc-renewal-changes-reentry.md --lang ar
sentences=57 mean=16.2 cv=0.453 short=0.228 run3=0.127 opener_rep=0.143 cite_end=0.0 cite_para=0.476 contrast=0 caveat=0 q=1
OK — no variety limit violated
```

Manual §5, independently:

1. Exact Arabic measurement ran on all three; no skip or FAIL. These outputs apply only to the hashes above and must be rerun after repair.
2. Opening modes differ as recorded, with no stock hypothetical opening. The deletion issue in 705 is separately required.
3. Multiple short sentences state actual procedural consequences (return of originals, issuance after approval, receipt not guaranteeing return). The duplicated admission caveat and generic travel opener are expressly rejected above; I did not accept them merely because they improve length variance.
4. I printed and read paragraph starts vertically. No three paragraphs use the same exact opening word, and no repetitive three-paragraph opener sequence was found.
5. No three consecutive paragraphs mechanically repeat claim/statute/caveat. Practical document preparation and inquiry paragraphs provide citation-free passages. 706's travel paragraph still needs the bounded improvement above.
6. No rhetorical “not X but Y” formula chain. Several necessary negative legal boundaries remain because entry eligibility, admission, residence and work authorization differ. The specific metawarning in 706 is repaired without deleting that distinction.
7. The final substantive paragraphs concern document dates (704), the intended entry route (705), and pending application/travel documentation (706). Source-date, scope and related-link tails are structural. No promotional ending.
8. Modern Standard Arabic is consistent; Arabic commas, semicolons and question marks are used. No bold, invented first person, public author byline, false native/lawyer-review claim or added consultation language. Korean/Japanese register checks are inapplicable.
9. Source, numbers and scope checks are recorded above; no legal precision is traded for sentence variation.

## Images, RTL and remaining limits

Viewed the actual three `public/images/columns/*-20261024-v2.webp` files using `view_image`. 704 shows a plain travel booklet, folder with blank sheets, plain card and pen; 705 shows closed laptop, books, two mugs and plain booklet; 706 shows an open blank notebook, plain travel booklet/card, keys and travel bag. All show a Taipei window scene. The Arabic alt texts describe visible objects accurately; omission of a background object from concise alt text is not a mismatch. Captions identify illustration and do not claim that the cards are official documents. No person, readable identity data, official-card replica, logo or flag is visible.

Source-level punctuation is coherent with Arabic/Latin acronyms, Article 23-1 and Western digits; no hidden bidi override/isolate characters were found. This is not a browser RTL layout or screen-reader verification claim. Rendering/publication remain root-owned.

Initial next action was the bounded author repair and independent recheck. That work is now complete as recorded at the top of this report. No further locale repair is requested for the final hashes.
