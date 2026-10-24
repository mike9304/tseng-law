# Final independent readback — frozen versions unchanged

Independent reviewer `/root/review_rev2_th` has now approved the final Thai sentence boundaries and completed the actual unchanged CLI. I reran 704 with `th-boundaries/704-independent-r3.sentences.json` and observed exit 1: `sentences=47 mean=21.0 cv=0.434 short=0.128 run3=0.0 opener_rep=0.05 cite_end=0.0 cite_para=0.25 contrast=1 caveat=0 q=1`, with only `FAIL len_cv=0.434 (limit >= 0.45)`.

Final editorial status communicated by the independent reviewer: 704 REQUEST_CHANGES because the numerical CV rule remains unsatisfied after two meaningful repairs; 705 PASS and 706 PASS at their unchanged r2 hashes. All requested wording/grammar/FAQ/legal-scope repairs were recognized as resolved. No extra score-driven wording change is authorized by this report, and 704 is not ready under the stated numerical rule. The author has not altered any threshold or certified its own boundary maps. The current hashes and repair history below remain accurate; references below to pending r3 review are historical and are superseded by this readback.

---

# Thai ARC revision — author r3 (current frozen files)

The current source hashes supersede every historical hash below:

| Article | Current SHA-256 | Current measurement evidence |
|---|---|---|
| 704 | `02b683edd2ca82768aa766fbcf299529d943eaa9f1646f1e72bf1a57b564f7d7` | New draft map pending independent r3 approval; author provisional CV 0.434 |
| 705 | `abe1ccf7fe19227dc0f4ac69b632f5f0f67be5932f2d44adbfa022491350b7de` | Author reran unchanged CLI with independent r2 map: exit 0, CV 0.468, no FAIL |
| 706 | `844b1b15985d3e7f82c9e8c8824d67215b7edeec7b33726da5c1e608f433f50b` | Author reran unchanged CLI with independent r2 map: exit 0, CV 0.460, no FAIL |

704 received the second bounded prose repair for its numerical deficit: the NIA 0902 ten-working-day processing guidance, including its excluded intervals, and the student/worker online five-working-day guidance are now a single comparison joined by `ขณะที่`. The next sentence still explains possible restarting after supplementary documents and the time needed before card collection. `ระบุระยะพิจารณา` preserves guidance status and does not promise a completion date. This is an actual comparison of two application channels, not a hollow short sentence or a manipulated boundary. The remaining CV deficit is disclosed after two meaningful repairs.

A separate final legal-source finding required a narrow substantive correction in 704: the Taiwanese spouse must currently reside in Taiwan as well as have household registration there. The text now reads `คู่สมรสของชาวไต้หวันที่พำนักและมีทะเบียนราษฎรในไต้หวัน`. This narrows the previously incomplete description; it is not classified as mere stylistic preservation. Taiwan marriage registration evidence, first-application spouse attendance and the one-year first card remain unchanged. The author opened [NIA 0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970) on 2026-10-24 and confirmed both residence and registration in Required Documents 3(1)(d)(i). A direct fetch of the related regulation's Article 12 failed through the web tool, so the author does not claim to have opened that direct article successfully; the existing linked NIA guidance independently supports the correction.

705/706 were not changed during r3. The final Article 16(2) narrowing and FAQ residence/work distinction remain as described in r2. Each original 16-URL set is still fully preserved with no new unique URL. Image frontmatter and dates remain as assigned.

Actual rerun command for 705/706:

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <article> --sentences <work/reviews/th-boundaries/NNN-independent-r2.sentences.json>`

Both returned `OK — no variety limit violated`, exit 0. 705: 56 sentences, CV .468, short .089, even runs .019; 706: 59 sentences, CV .460, short .102, even runs .070. Independent prose/condition review is separate from this measured result; the reviewer has confirmed that the r1 prose and Article 16 findings are resolved. 704 requires its final independent boundary approval and actual CLI; no PASS is claimed for it. No checker, thresholds, shared profiles or reviewer approval artifact was edited by the author.

The author remains available for source/meaning clarification. Publication and any decision about an unresolved numerical conflict belong to root, with the independent review evidence; this report does not silently waive the rule.

---

# Historical r2 author report (superseded 704 hash below)

# Thai ARC revision — author repair r2 (current)

Role: `/root/revise_th`, AI Thai author/repairer; independent review remains with `/root/review_rev2_th`. The r1 author report is retained below as dated/versioned history and is separately snapshotted by the independent reviewer.

Current status: all five r1 prose/scope findings, the proposed 704 ceiling paragraph repair, the eleven independently identified boundaries, and the final legal reviewer's Article 16(2) repair are applied. New exact files are frozen for independent r2 review. Author-side CLI is still exit 2 because the new draft maps have no independent approval; this is not an article PASS. The 704 provisional CV deficit remains explicit.

| Article | Current SHA-256 |
|---|---|
| 704 | `8f304a311a2ff9a1451faf0b934ab08259de4bb10ec7e4756396df25d28478fc` |
| 705 | `abe1ccf7fe19227dc0f4ac69b632f5f0f67be5932f2d44adbfa022491350b7de` |
| 706 | `844b1b15985d3e7f82c9e8c8824d67215b7edeec7b33726da5c1e608f433f50b` |

## r2 changes

- 704 Article 43 now directly supports the work-permission/exception rule. Deleted the metacommentary `วางหลักนี้ไว้`; students/dependants cannot rely on ARC alone remains explicit.
- 704 general card ceiling is now a compact three-year statement linked to Article 22, followed by the NIA individual assessment and the lack of entitlement to select three years by paying more. No fee, limit, or discretion was changed.
- 705 FAQ 3 now says work authorization or an applicable exception is needed if the dependant wants to work. This restores the original conditional meaning rather than suggesting that work permission is a condition of dependent residence.
- Removed สำหรับ before the student-route subject and removed the generic last preparation-benefit sentence in opening paragraph 2. To avoid repeated applicant openings naturally, the full-time student paragraph starts with the actual BOCA guidance, and the dependent-family paragraph identifies `สมาชิกครอบครัว` rather than forcing a prepositional subject.
- Deleted 706's repeated actual-address short sentence. The preceding lease/actual-residence evidence requirement stays intact.
- Kept permit exemptions explicit in the 705 opening, matching the full Article 16 work paragraph.
- Agreed and incorporated all eleven independent boundary findings from `author-adjudication-r1.md` and its addendum. Where the prose was replaced or removed, the new slices follow the new complete statements; the removed generic sentence is not retained for a numerical score.
- 704's day-after-entry start and 706's event-day start are now concise sentences within the same paragraph as the relevant 30-day duty. Each replaces that starting-point phrase in the preceding sentence; neither repeats it. Deleting either would remove a legally consequential starting point. The different address-change day-after rule remains in 706.

## Article 16(2): substantive accuracy repair

This is a substantive narrowing/completion, not a claim of unchanged wording or merely improved style. The earlier family paragraph described professional sponsors too broadly. At the request of `/root/final_rev2_asia`, the revised Thai expressly distinguishes:

- an ordinary foreign professional currently performing professional work in Taiwan; and
- a foreign special professional.

For both categories the sponsor must already have NIA-approved residence or permanent residence. The next paragraph retains spouse, minor children, and adult children unable to care for themselves owing to physical or mental disability, and adds their qualifying visa-exempt/Visitor Visa entry, direct application to NIA, and ARC issuance only after approval. It does not create an entitlement for all relatives or all ARC holders.

Official source independently opened by this author on 2026-10-24: [Foreign Professionals Act Article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16), paragraph 2. The operative text distinguishes `外國專業人才在我國從事專業工作` from `外國特定專業人才` and conditions both on residence/permanent-residence permission. All previously used URLs remain. No publication date or routing was changed.

## r2 checks and remaining boundary review

The new `704/705/706-draft.sentences.json` maps remain clearly marked `author_draft`, without an approval record. Normalized paragraph concatenation matches each source's measured prose, and the full-source hashes match. Actual unchanged CLI with those draft maps returns exit 2 for unresolved sentence review, recorded in `th-boundaries/author-diagnostics.json`.

Provisional author-slice diagnostic values, not approved CLI verdicts:

| Article | Sentences | CV | Short share | Even runs | Max paragraph opener | Consecutive same starts | Contrast |
|---|---:|---:|---:|---:|---:|---:|---:|
| 704 | 48 | 0.432 | 0.125 | 0.000 | 2 | 2 | 1 |
| 705 | 56 | 0.468 | 0.089 | 0.019 | 2 | 1 | 2 |
| 706 | 59 | 0.460 | 0.102 | 0.070 | 2 | 0 | 3 |

704 still falls short of CV 0.45 on the author's slices despite meaningful paragraph repair. This is disclosed rather than repaired with empty short statements. The independent reviewer will approve the actual new boundaries, run the unchanged CLI, and identify whether a further meaningful repair or an explicit unresolved numerical conflict remains.

First-two-paragraph deletion test now retains only the filing duty/start/exception and visitor eligibility distinction in 704; removes the generic efficiency claim in 705 while preserving route inputs; and retains the distinct change/renewal triggers in 706. The three comparator observations, preserved deadlines/amounts/source relationships, image metadata and section 5 findings in the r1 record remain applicable except for the expressly noted Article 16(2) correction and updated metrics. No independent or lawyer approval is claimed by this author.

---

# Historical r1 author report (superseded hashes below)

# Thai ARC revision — author report

Role: `/root/revise_th`, AI Thai editorial author/repairer. This is an author self-check, not independent locale, human-native, lawyer, legal-source, or publication approval.

Status: substantial editorial repair completed; frozen for independent review. Thai CLI measurement is currently unavailable (exit 2) because the new sentence maps are author drafts without independent approval. Provisional author-boundary diagnostics also leave the CV threshold unresolved for 704 and 706. Do not report these three articles as a measured PASS.

## Owned deliverables

Repository: `/Users/son7/tseng-arc-revision-20261024/repo`

| Article | Final SHA-256 |
|---|---|
| `src/content/columns-th/704-taiwan-arc-first-application.md` | `141a09903d5dbb0d709a88de9952591955277211e0b92b5822512206157bef7b` |
| `src/content/columns-th/705-taiwan-visa-residence-work-study-family.md` | `d4ac78d3ec10dc00d41e4227db88562736b690136c9f6f462f323c791b8a1aa6` |
| `src/content/columns-th/706-taiwan-arc-renewal-changes-reentry.md` | `587aafb44969ffe17ce8c81c7b41796caf85ef3a59beb64a11f781454042a035` |

Sentence slices and diagnostic artifacts are confined to `work/reviews/th-boundaries/`. The three `NNN-draft.sentences.json` records identify their exact source hashes, retain every measured paragraph after the checker's normal link removal, and explicitly say `author_draft` / `draft_for_independent_review`. No independent reviewer or approval was invented. `rewrite.py` is a reproducibility artifact, not a command to rerun after reviewer edits or boundary approval.

## Editorial changes and examples

The original files repeatedly instructed the reader to ตรวจ, ตรวจคุณสมบัติ, ให้ตรวจ, and ไม่ควร rather than explaining the rule or result. Several abrupt short sentences merely repeated the preceding sentence. The repair changes paragraph structure and headings as well as words. It keeps actual document lists and comparison tables where they help the reader.

| Article | Original | Revised | Reason and meaning retained |
|---|---|---|---|
| 704 | `ชื่อเมนูต้องตรงกับสถานะ ใช้ระบบนักศึกษาเพียงเพราะเคยเรียนในไต้หวันไม่ได้` | `ช่องทางยื่นขึ้นอยู่กับสถานะที่ใช้ขอพำนักครั้งนี้ ผู้ที่เคยเป็นนักศึกษาแต่เปลี่ยนมาขอพำนักเพื่อทำงานต้องใช้ประเภทคำขอสำหรับงานนั้น` | Replaces an admonition about menu labels with the actual reason the application category changes. Current employment/residence basis still controls. |
| 704 | `ขั้นตอนที่ผู้ยื่นควรติดตามมีลำดับดังนี้` and a generic four-step list | Separate filing-channel list followed by submission receipt, supplements, payment, and collection paragraphs | Preserves filing steps without imposing a general checklist on every system. Student-specific dates remain confined to the student paragraph. |
| 704 | `ขั้นตอนรับบัตรต้องดูประเภทเอกสารที่อนุมัติ` | `สำหรับนักศึกษา ... ให้ชำระเงินภายในห้าวันทำการนับจากวันอนุมัติ` followed by the electronic-card/chip-card rules | Starts with the actual group and action, removes an introductory instruction about reading the instructions. Approval date, five working days, payment, three working days after payment, and selected service center are retained. |
| 704 | `ระยะสามวันนี้ไม่ใช่เวลารวมตั้งแต่ส่งคำขอ` | The three-working-day period remains expressly attached to `หลังชำระ` in the chip-card sentence | Deletes a second explanation of an already explicit starting point. Does not present three days as total processing time. |
| 705 | `ตรวจประเภทงานก่อน ให้นายจ้างระบุหนังสืออนุญาตที่รองรับงานนั้นให้ชัด` | `หนังสือเสนองานไม่ใช่ใบอนุญาต` followed by Article 43 and a request for the actual permit copy | Makes the document distinction concrete; preserves permit requirement, statutory exceptions, employer, job category, and permitted dates. |
| 705 | `ต้องเข้าเงื่อนไขครบ` | Completeness is integrated into the Article 16 sentence as `และมีคุณสมบัติครบ` | Removes a detached warning while keeping the professional/special-professional categories, entry types, authorized/exempt work, and direct NIA application conditions. |
| 705 | `จ่ายค่าเรียนแล้วก็ยังต้องรักษาสถานะเข้าเมือง ดูวันสิ้นสุดการอยู่ด้วย` | `ระหว่างเรียนยังต้องรักษาสถานะเข้าเมือง` followed by the need to extend the authorized stay under the held visa if it will expire first | Gives the timing problem and resulting action. Tuition payment still does not extend the authorized stay. |
| 706 | `เส้นทางเฉพาะต้องดูช่วงยื่นของตน` | Direct Entrepreneur ARC four-month rule and Mandarin-study six-month maximum | Removes generic instruction and retains both category-specific limits. |
| 706 | `เตรียมหนังสือเดินทางใหม่ คำขอต้องมี ARC และหลักฐานการเปลี่ยนข้อมูล...` | New-passport changes, NIA update, and the documents are connected in one conditional paragraph | Retains passport number/name/personal-data changes, new passport/ARC/evidence, and the warning against importing the address-change deadline. |
| 706 | `อย่าใช้ขั้นตอนออนไลน์ทั่วไปแทนโดยไม่ตรวจชนิดบัตร` | The old-card/single-reentry-permit exception is stated with the MOL and representative-office steps in the same paragraph | Reduces the standalone command without turning the general online option into a route for excluded old-card cases. |

Titles, summaries and all nine FAQ entries were rewritten. All three articles now have the assigned featured image path, a visual Thai alt description, and a short illustrative-image caption. No duplicate inline image was added. The images themselves and their actual final visual contents are root-owned and were not inspected by this author.

## First two paragraphs: deletion test

### 704

- First sentence supplies the eligible group, filing duty, 30-day period and day-after-entry starting point. Deletion would remove the article's main procedural rule.
- The second sentence preserves the document-already-combines-ARC exception, including a valid Employment Gold Card. It cannot be reduced to a general 30-day duty.
- Paragraph two distinguishes visitor/visa-exempt entry from residence eligibility and expressly flags the Thai trial-program constraint. The closing sentence explains that the filing deadline does not grant visitor-to-resident eligibility. Its practical purpose is to prevent applying the opening deadline as an entitlement; the independent editor should assess whether this explicit clarification is still unnecessarily repetitive in Thai.

### 705

- The opening question is the concrete decision faced after admission or an offer of employment. The next two sentences supply different legal routes for study and professional work, with the BOCA and Article 16 links.
- Paragraph two adds nationality/passport/entry method/residence basis and the different documents used for the application. Removing the whole paragraph would lose those inputs. Its last explanatory clause about preparing documents is less essential than the legal inputs and can be removed if the independent editor finds it generic.
- No invented incident, personal experience, or supposed reader emotion was added.

### 706

- The first paragraph supplies a change-of-address duty despite a still-valid card, the day-after-change 30-day starting point, and coverage of workplace changes.
- Paragraph two supplies the general three-month renewal window and explains why the end of employment, study or the qualifying relationship can require action before the printed expiry date. These are distinct triggers, not a repeated introduction.

## Three same-language comparators

All are actual repository files, published and last modified on 2026-10-23. These are comparison material, not a claim that their prose is flawless.

| Comparator | Actual opening / heading / ending | Difference in the revised ARC series |
|---|---|---|
| `src/content/columns-th/661-thai-worker-taiwan-bank-account-police-notice.md` | Opens with the wording `通知書 หรือ 告誡處分書?`; headings include `วันไปพบตำรวจและภาษาที่เข้าใจ`; ends substantively on the notice and evidence showing who controlled the account, with a fairly long contact paragraph before it | 704 opens on the filing duty; 705 asks an entry/visa decision; 706 opens on an address-change event. None copies the police-document question, and no consultation paragraph was added to the ARC articles. |
| `src/content/columns-th/662-thai-return-home-taiwan-traffic-injury-records.md` | Opens on the thirty-day police-record availability date and return-flight timing; headings include `มอบอำนาจรับเอกสารไม่เท่ากับมอบอำนาจยอมความ`; ending asks for the responsible agency, request number, and person forwarding records | 704's 30 days is a filing deadline, explicitly tied to arrival or domestic visa issuance. 706 discusses return-entry documents and card replacement; it does not copy the accident-record deadline or representation contrast. |
| `src/content/columns-th/663-thai-supplier-taiwan-buyer-unpaid-invoice.md` | Opens on different company names in orders/import/warehouse records; headings ask which company must pay and when; ending pairs the order, receipt and provable due date | The ARC articles identify document categories and actual residence changes. Their endings stay on card details, the chosen residence basis, or travel documents, without a generic debt-style evidence list or repeated contact disclaimer. |

The original comparators also contain imperative phrasing and standard contact material. Those features were not copied as a style target.

## Legal and source preservation

Baseline: `174454bd4bb8d9e05627d71f9ef0af646540b3e4`.

- Each original article contains 16 unique linked URLs. Each revised article retains exactly that same set: 16 / 16, no missing and no new links. This includes internal language routes as well as official URLs. Source lists retain the original links.
- Link relationships remain attached to the same claims: Article 22 entry deadline/combined documents; BOCA domestic Resident Visa issuance; Article 16 direct professional route; NIA 0902/0926/0929 categories and documents; fee regulation; work permission; and renewal/change/reentry provisions.
- 704: preserved 30 days from the next day after entry; separate 30 days from domestic visa issuance; photo within two years; relevant one-month certificates; first Taiwanese-spouse card one year and spouse attendance; conditional initial worker recruitment authorization; authentication/translation rules; middle-skilled worker exclusion from the online labor system; student 512 KB cap, five working days after approval and three working days after payment; NT$1,000 per year with shorter periods counted as a year; eligible conversion surcharge NT$2,200; overseas-Chinese-student-specific discount; general three-year ceiling; ten/five working-day guidance and exclusions/restart; separate work permission or statutory exception.
- 705: preserved Thai 14-day trial waiver, expiry 31 July 2027, diplomatic/official passport exclusion, six-month passport validity, confirmed return/onward travel, accommodation/contact/means requirements and day-after-entry counting; trial-waiver conversion restriction and statutory exceptions; professional eligibility limits; worker route and family distinctions; study visa/admission/financial/family-sponsor evidence and non-guarantee; Mandarin four months plus at least three months, Monday–Friday fifteen hours per week, absence including leave no more than one quarter; qualifying sixty-day-plus family route and visa restrictions; Taiwan household registration; eligible spouse/minor child/incapacitated adult child scope; Article 48 work exception; Gold Card's four functions; entrepreneur eligibility and separate work permission.
- 706: preserved day-after-change 30 days; general three-month renewal window; one-month certificates; NT$1,000; Entrepreneur four-month window; Mandarin six-month renewal cap; labor online/service-center five/ten working days; work permission and employer-change conditions; loss of original residence ground and conditional family/labor-dispute/work-injury exceptions; Article 23-1 direct change within 30 days of the event; other route within 15 days of the event; passport-data update without borrowing an address deadline; NT$500 lost/damaged replacement fee; overseas replacement channels and evidence; old card/single-reentry exception; Article 34 reentry rule/permanent-residence exception; e-Gate does not renew documents; pending card/photo/receipt limitation; expired-card handling.
- A simple body numeral-set comparison found no lost legal numerals. In 704 only list labels 1, 2 and 4 disappeared when the generic ordered list was converted to prose; list label 3 is also used as a statutory number and remains in the set. Thai-written quantities were checked separately as listed above.
- No changes to article numbers, filenames, routes, publication dates, internal `author: legal-ai-assistant`, consultation languages, or legal service claims. There are no consultation claims in this series to expand.
- Scope limitations and 24 October 2026 source dates remain, moved under the structural sources heading so the substantive ending can remain about the article's procedure.
- Live official-source refresh is being handled separately by `/root/refresh_sources`; this author does not claim to have independently reverified the law. The researcher's Article 12 recent-graduate exception caution was observed: no blanket statement was added that all graduates need employer authorization or cannot work during an approved extension.

## CLI and provisional measurements

Executed for each file:

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <article> --sentences <work/reviews/th-boundaries/NNN-draft.sentences.json>`

Actual result for all three: exit 2, `ERROR measurement unavailable: missing or unresolved Thai sentence review`. This is the correct rejection of an unapproved map, not PASS or a zero-FAIL result. Exact commands/stdout and source hashes are saved in `th-boundaries/author-diagnostics.json`.

For author diagnostics only, the same unchanged metric functions were run on the draft slices, explicitly labelled `UNAPPROVED_author_draft_slices_diagnostic_only`. No shared checker, rules, thresholds, profile, or approval artifact was edited. These values are provisional and can change after independent sentence-boundary adjudication:

| Article | Draft sentences | CV | Short share | Even runs | Top paragraph opener count | Consecutive same starts | Contrast |
|---|---:|---:|---:|---:|---:|---:|---:|
| 704 | 46 | 0.433 | 0.087 | 0.023 | 2 | 2 | 1 |
| 705 | 51 | 0.452 | 0.098 | 0.020 | 2 | 2 | 2 |
| 706 | 55 | 0.432 | 0.091 | 0.057 | 2 | 0 | 3 |

704 and 706 remain below CV 0.45 under the author's boundaries. Short sentences were not added merely to force a numerical result. The independent reviewer should inspect the actual paragraph boundaries and prose, then request a meaningful targeted repair if the deficit persists. No independent approval manifest is supplied by the author.

`git diff --check -- <each owned article>`: exit 0 for all three.

## Section 5 manual self-check

1. Measured CLI PASS: unresolved, as above. Independently approved Thai boundaries required; author-diagnostic CV deficits disclosed.
2. Opening: no stock hypothetical. The series uses an actual filing duty, an admission/employment entry-choice question, and an address-change event. All are procedural subjects; they were not forced into invented scenes just to increase opening diversity.
3. At least two meaningful short sentences: provisional counts 4 / 5 / 5. They state an actual one-year card term, draft-vs-submission action, fee rounding, passport exclusion, permit distinction, continuing status, a receipt question or loss/replacement outcome. The redundant three-days-after-payment repetition was removed. Following the final 705 repair, no draft paragraph contains more than one sentence at or above 32 Thai lexical units.
4. Paragraph starts: no repeated first lexical unit more than twice under the author draft map. The prose itself was read vertically for repetitive instruction starts.
5. Citations: no three repeated claim–parenthesis–exception paragraphs; citation-free procedural paragraphs remain. Citation URLs and supporting propositions are preserved.
6. Contrast: draft counts 1 / 2 / 3. The remaining contrasts address eligibility, permit requirements, dates, card updating, and expired-card status; no invented reader claim or rhetorical rebuttal was added.
7. Ending: the last substantive paragraphs concern card data/renewal, the selected visa/residence path, and the travel documents/current status. Dates and scope are in the source tail. No sales close was added.
8. Register: plain professional Thai, no invented speaker/experience, no bold, no AI or human public byline. Headings identify the actual issue. Lists cover actual application channels/documents or statutory study requirements.
9. Legal integrity: source/numeric/condition preservation checked against the baseline. No intended substantive change. Current-law approval remains separate.

## Remaining bounded work

- Independent Thai prose review, including the two opening clarifications noted above.
- Independent sentence slices and approval binding for these exact full-file hashes. Any frontmatter change also changes the source hash and requires refreshed bindings.
- Resolve 704/706 provisional CV deficits with meaningful edits if independently confirmed; do not manufacture short sentences or claim an unapproved CLI result is PASS.
- Root-owned image creation/visual confirmation, final legal-source review, integration and publication.
