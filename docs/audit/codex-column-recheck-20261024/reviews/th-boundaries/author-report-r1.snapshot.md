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
