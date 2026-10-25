# B5 Khmer ARC704–706 author review

Status: independent R1's mandatory M01 and optional S01–S02 have been applied and author checks rerun; independent R2 closure, integration, rendering and publication remain pending. No native-human or licensed-lawyer approval is claimed. Current R2 manuscript bytes are listed below; exact R1 manuscripts, author report and final evidence are preserved in `checks/km-r1-snapshot/`.

## Files and provenance

Only `batch05/src/content/columns-km/704–706`, this report and `checks/km-*` were written. R, application code, the shared checker, git, deployment and the prior capacity prototype were not changed.

| File | SHA-256 |
|---|---|
| `704-taiwan-arc-first-application.md` | `8ae680254e50bf202d7a3ebe1f886de19264a22251bdda5effbdc9c74b649b53` |
| `705-taiwan-visa-residence-work-study-family.md` | `f3b6eec9bcd2559f10f6e9fd05d74c8040d1a65ccda1fdcb79632961ad58aeba` |
| `706-taiwan-arc-renewal-changes-reentry.md` | `d1a5eff1eb9fed410075031876b059d635ac4c9de9cd75a61c5a2ac540371286` |

[Input manifest](../checks/km-inputs.json) records all nine EN/KO/ZH sources, the latest three actual KM comparators, required contracts/rules and the three inspected images with SHA-256. These hashes were captured after the sources had been read and drafting started, before final verification; they are not falsely described as a pre-draft hash snapshot. The three language sources differ in detail, so this work uses their combined accepted scope and F01–F24 rather than claiming sentence-for-sentence identity.

Read in full: B5 and upstream B4/B3/B2/root briefs; R/AGENTS.md; repository editorial voice and frontmatter rules; COLUMN-VOICE-RULE, SENTENCE-VARIETY-RULE and LESSONS; nine current accepted source articles; F01–F24; source-refresh; ARC original brief; KM813–815. The latest closure of the large original final-core review was consulted, not its entire historical log. The missing home `agent-library/knowledge/editorial-voice.md` was handled by the brief-authorized repository editorial-voice fallback. The stale optional `tseng-law-editorial/references/review-criteria.md` pointer was absent and is not claimed as read. Fable's former mandatory gates were not reinstated.

Publication/lastmod are `2026-10-26`, display `26 តុលា 2026`; source-check dates remain October 24–25. The unchanged original images use exact caption `ឈុតឆាកប្រឌិត`. Internal author remains `legal-ai-assistant`, with no public author or new Khmer consultation promise. Audience is explicitly `["km"]`.

## Independent profile preparation and actual tool status

Before writing public prose, ten unrelated school/library cases with immutable expected arrays were delivered to `column_voice_rules`. [Neutral fixture](../checks/km-neutral-boundaries.json) SHA-256: `482521ceaa22e8786c6cefa9b9c1e6c6d59bb4c5e8eb1884287e4da7a55cb99a`. They cover `។`, `៕`, `៖`, `។ល។`, quotation, decimal numbers, Latin abbreviations, missing spaces and multiple spaces. Neither target text nor target metrics were provided for profile development.

The initial real run on existing KM813 with exact `--lang km` returned unsupported exit 2; [JSON](../checks/km-variety-before-profile.json) and [stderr log](../checks/km-variety-before-profile.log) preserve that observation. It was never called PASS. Root subsequently installed shared49. The profile metadata still contains its earlier pending-review label; the actual installation/authorization was reported by root/profile agent, and the captured profile SHA identifies the bytes executed.

The installed KM method is `icu_dictionary_wordlike_units`, Node 24.14.1 / ICU 78.2 / Unicode 17.0, with Unicode Khmer sentence punctuation and locale abbreviations. Spaces were not called words or added to force a result. The ambiguous inline `។ល។` neutral fixture remains a documented exit-2 case; its original expected array was not rewritten. These manuscripts do not contain that abbreviation.

| Article | Initial actual result | Final exact `--lang km` | Counted segments | CV | Short share | Similar-length runs |
|---|---|---|---:|---:|---:|---:|
| 704 | exit 0 | exit 0 / FAIL 0 | 67 | .507 | .149 | .031 |
| 705 | exit 0 | exit 0 / FAIL 0 | 65 | .463 | .092 | .032 |
| 706 | exit 1: CV .402, paragraph opener 4, consecutive same start 3 | exit 0 / FAIL 0 | 78 | .466 | .141 | .039 |

Evidence: [initial results](../checks/km-variety-initial.json), [final results](../checks/km-variety-final.json), complete final arrays [704](../checks/km-sentences-final-704.json), [705](../checks/km-sentences-final-705.json), [706](../checks/km-sentences-final-706.json). Every array was read, including revised sentences. Khmer terminal marks, quotes, parentheses, article numbers, Latin names and the email address stay in their intended segments. One 704 colon-ended introduction to a list is a prose segment, not a complete grammatical sentence; the tool counts it as such. Lists, table cells, headings, frontmatter FAQs and source footers are excluded by the shared rhythm algorithm and were checked separately. ICU units are useful diagnostics, not a certified Khmer word count.

## Actual corrections during self-review

| Problem text | Reason | Final edit | Meaning preservation |
|---|---|---|---|
| 704 `NIA ណែនាំឱ្យស្វាមីឬភរិយាតៃវ៉ាន់មកជាមួយ…` | “Advises” could weaken required attendance. The initial paragraph also omitted Taiwan marriage-registration proof. | `NIA តម្រូវឱ្យ…` plus `ភស្តុតាងទំនាក់ទំនងត្រូវបង្ហាញការចុះបញ្ជីអាពាហ៍ពិពាហ៍នៅតៃវ៉ាន់រួចហើយ។` | First/marriage-reason-change attendance and the qualifying Taiwan-resident, household-registered spouse scope retained; NIA citation made adjacent. |
| 704 `វាក៏មិនមែនជាការបន្ថែម 3 ខែពីលើកាលកំណត់ 15 ថ្ងៃដែរ។` | Repeated negative explanation in the supplementation paragraph. | `រយៈពេល 3 ខែនេះជាកាលកំណត់ជំនួស 15 ថ្ងៃសម្រាប់ឯកសារប្រភេទនោះ។` | Three-month replacement period remains conditional on document issuance abroad; no 15-day-plus-three-month sum. |
| 705 `លក្ខខណ្ឌ…ក្នុងប្រយោគនេះ ភ្ជាប់នឹងប្រភេទ…ទីមួយ។` | Exposed sentence-analysis language in public prose. | Removed the metalinguistic sentence; kept the explicit ordinary-professional-working-in-Taiwan OR specialist-professional sentence, then common NIA approval sentence. | F04 exact AND/OR scope stays intact. |
| 705 original alt described paper and a blank card. | Direct image inspection showed a closed laptop, books and two mugs, without the described card. | `កុំព្យូទ័រយួរដៃបិទជិត សៀវភៅ និងពែងពីរនៅលើតុក្បែរបង្អួចដែលមើលឃើញតៃប៉ិ` | Actual image now described; original image path/caption unchanged. 704's blue book is no longer asserted to be an identifiable passport. |
| 706 repeated `ការសុំ…`, `ការប្តូរ…`, `ការបញ្ចប់…`; four paragraphs began with `បើ`. | MONOTONY: repeated nominal starts and flat medium-length sentences; initial CLI failed three criteria. | Renewal paragraph begins `សំណុំឯកសារ…`; reason change begins `ក្រោយបញ្ចប់…`; overstay begins `ហួសកំណត់ហើយឬ? ត្រូវទាក់ទង NIA ភ្លាម។`; passport paragraph begins `លិខិតឆ្លងដែនថ្មី…`. | Changed subjects and sentence grouping, not deadlines, eligibility or legal effect. No arbitrary whitespace insertion. |
| 706 re-entry permission and validity were two similarly sized adjacent statements; receipt warning grouped three documents. | The first pair shares the same permission object, while receipt and record-number warnings have different reader uses. | Connected Articles 34/20 in one complete permission-and-validity sentence; then `បង្កាន់ដៃមិនជំនួសការអនុញ្ញាតទេ។` followed by the record-number/photo warning. | Advance permission, ARC validity/cancellation, APRC exception, and insufficiency of all three document substitutes preserved. |
| 706 `សញ្ញាបត្ររង` and `អាចទទួលការលើកលែង…` | Associate degree needed a precise degree term; conditional statutory exemption should not sound discretionary. | `បរិញ្ញាបត្ររង` and `ទទួលការលើកលែង…`. | Taiwan degree, current graduating cohort and lawful NIA graduate-extension approval remain cumulative requirements. |
| Initial 704/705 FAQs selected alternate useful questions. | The accepted source's FAQ coverage should stay visible in FAQ data as well as body. | Restored 704 filing/fee/work-authority topics and 705 direct-entry/language-study/sponsor-eligibility topics. | Alternate direct-application and spouse-work-right details remain in the body; every FAQ preserves source conditions. |

The initial body arrays and initial SHA/logs preserve the real pre-edit state. No invented reviewer or fabricated client experience was added.

## R1 feedback applied and R2 verification

The independent reviewer froze [R1](km-independent.md) at SHA `e730c2ac777a27d3fecdbd7b3144944d492bfd97ab872c201c3bf6f39021603b` and explicitly released the manuscripts for revision. Its text and evidence were not edited by the author. The following are the only manuscript changes after that freeze; exact old/new strings, occurrences and unified diffs are in [km-r2-edits.json](../checks/km-r2-edits.json).

| Finding and original text | Reason | Applied edit | Meaning preservation |
|---|---|---|---|
| M01 body: `អ្នកកាន់ឯកសាររួមដែលមានមុខងារ ARC រួចហើយ ស្ថិតក្នុងករណីលើកលែង។` | Possessing a combined document does not state that it is valid. Validity is an express F01/Article22 exception condition. | `អ្នកកាន់ឯកសាររួមដែលមានសុពលភាព និងមានមុខងារ ARC រួចហើយ ស្ថិតក្នុងករណីលើកលែង។` | Restores validity while keeping the integrated ARC function and separate-card exception. |
| M01 FAQ1: `អ្នកដែលមានឯកសាររួមបញ្ចូលមុខងារ ARC មានករណីលើកលែង។` | FAQ must retain the same exception condition as the body. | `អ្នកដែលមានឯកសាររួមដែលមានសុពលភាព និងបញ្ចូលមុខងារ ARC មានករណីលើកលែង។` | Restores validity without changing either 30-day start rule. |
| S01: `កាលបរិច្ឆេទលើកាតនៅតែមួយ។ មូលហេតុដែលធ្លាប់គាំទ្រវាអាចបានបញ្ចប់ទៅហើយ។` | The short first sentence ambiguously says the date is one/the same. | `ថ្ងៃផុតសុពលភាពលើកាតនៅដដែល ប៉ុន្តែមូលហេតុស្នាក់នៅអាចបានបញ្ចប់ទៅហើយ។` | Names the unchanged printed expiry and connects it to possible loss of the residence basis. It does not extend residence or alter the adjacent statutory exceptions. |
| S02: `ចំពោះវិវាទការងារ នីតិវិធីបណ្តឹងត្រូវកំពុងដំណើរការ; ចំពោះគ្រោះថ្នាក់ការងារ ត្រូវកំពុងព្យាបាល។` | Naming the Taiwan employer makes the labor-litigation condition clearer on its own. | `ចំពោះវិវាទការងារជាមួយនិយោជកតៃវ៉ាន់ នីតិវិធីបណ្តឹងត្រូវកំពុងដំណើរការ; ចំពោះគ្រោះថ្នាក់ការងារ ត្រូវកំពុងព្យាបាល។` | Keeps ongoing proceedings and ongoing injury treatment, adds the statutory employer scope, and creates no automatic right to remain. |

The two optional suggestions were adopted for substantive clarity, not to improve the rhythm score: 706 CV actually moved from .478 to .466 and still passes. No spaces or punctuation were inserted to manipulate Khmer units. 705 is byte-identical to R1. Reversing the four exact changes reproduces both changed R1 manuscripts byte for byte. All Markdown URL values and order, headings, excluded list items, images and publication/source dates are unchanged.

The current exact shared KM rerun is 67/65/78 segments, all exit0/FAIL0; structure errors0 and official URL counts13/15/14, with source/footer omissions0. [The complete boundary comparison](../checks/km-r2-boundary-delta.json) identifies 207 byte-identical segments already read at R1 and the three R2 segments printed and read after revision: one validity sentence, one merged printed-expiry sentence and one employer-qualified sentence. The corrected FAQ was read separately because frontmatter is outside the rhythm denominator. No other sentence boundary moved. [R1 archive index](../checks/km-r1-snapshot/index.json) preserves the pre-edit files and SHA values.

During final input checking the automatically generated LESSONS changed from SHA `92c572987cbc3c03eeb934fbfd2de6cf42d7e4b2e441cc39fb009c0e11f0e71a` to `127c8235b5f8f4938ad635cadb55a77386d42eda82973305b4b6aa508612f66f`. The full 2026-10-26 01:04 KST version was read before R2 editing. Accepted source articles, other rule files, images, checker and profile did not change. This new rule-input observation does not retroactively change the true R1 input snapshot or the manuscript source-check dates.

## F01–F24 meaning matrix

This is an author-level review of actors, modality, AND/OR, exclusions, units, start dates and legal effect. It does not clear the independent review gate. Primary URLs are in each manuscript beside the claim and in its final source list. The complete source mapping is [arc-source-facts.md](/Users/son7/Projects/tseng-law-all-locales-20261025/docs/audit/all-locales-parity-20261025/research/arc-source-facts.md); focused live readback and its access limitations are [recorded separately](../checks/km-source-readback.md).

| Fact | Target location / retained scope | Authority |
|---|---|---|
| F01 | 704 opening + FAQ1: resident-visa entry AND residence permission; mandatory ARC application within 30 days from the following day; valid integrated-document exception restored by R1 M01. | Immigration Act 22 |
| F02 | 704 second paragraph + FAQ1: visa issued inside Taiwan after arrival; 30 days from issuance, not next day. | BOCA `fp-398-723-7b71f-1.html` |
| F03 | 704/705 professional paragraphs: professional OR specialist, professional-work permit OR applicable exemption, visitor/visa-exempt entry, direct NIA application and ARC after approval. Job offer does not supply authorization. | Foreign Professionals Act 16 |
| F04 | 705 family paragraphs: `[(ordinary professional AND professional work in Taiwan) OR specialist professional] AND approved residence/permanent residence`. Spouse/minor/disability-dependent adult child only; their visa-exempt/visitor entry retained. | Foreign Professionals Act 16(2) |
| F05 | 705 general visitor route and Taiwan-spouse paragraph: allowed stay at least 60 days, no extension ban/relevant restriction, category eligibility; spouse resident in Taiwan AND household registered; sponsor exclusions. Visa use-validity not confused with allowed stay. | Immigration Act 23; NIA 0915 |
| F06 | 704 documents: photo within two years, actual address, originals/copies; employment within one month; admission before registration/recent study evidence after registration, semester evidence OR student card without cumulative demand; family relationship/sponsor evidence. | NIA 0902 |
| F07 | 704 overseas documents: authentication required, Chinese translation may be required and verified/notarized as specified; health/police evidence category dependent. No nationality-based apostille assumption. | NIA 0902/0915 |
| F08 | 704 spouse paragraph: qualifying Taiwan resident/household-registered spouse, first marriage residence maximum one year, required spouse attendance for first/marriage-reason change and Taiwan marriage registration. | Residence regulations 12; NIA 0902 |
| F09 | 704 fees/FAQ + 706 renewal/replacement: NT$1,000 per approved year, less than one year charged as one; relevant direct-entry extra NT$2,200; 僑生 half-rate not all international students; replacement NT$500. | Fee standards 3/7 |
| F10 | 704 validity: ordinary max three years, employed specialist/eligible family separate max five, Gold Card one–three. No right to buy longer permission. Approval start-day not newly asserted. | Immigration Act 22; Professionals Act 8/9 |
| F11 | 704 student collection: pay within five working days of approval; electronic ARC up to six months must be downloaded AND printed after payment; chip receipt printed and collection three working days after payment. | NIA 0929 |
| F12 | 704 processing: general ten working days excluding returned/supplement/interview time and restart after supplementation; student five working days restarted; neither guaranteed issue date nor automatic extension. | NIA 0902/0929 |
| F13 | 705 degree/Mandarin + FAQ: correct entry purpose, ordinary exclusion of visa-exempt/landing/other-purpose entry; four completed months plus at least three further, recognized university center, weekday fifteen hours, absences including leave at most one quarter and evidence. | BOCA degree/Mandarin; Immigration Act 23 |
| F14 | 704 work FAQ/body, 705 work/family, 706 employer change: actual job permit/exemption distinct from ARC. Taiwan household-registered national's approved-resident spouse exempt; foreign-professional spouse not automatically so; specialist/senior spouse direct permit route. | Employment Service Act 43/48/50/53; Professionals Act 15 |
| F15 | 706 table/FAQ: ordinary extension within the three months before expiry; address/workplace application within thirty days from following day; does not mean agency completion or new work authorization. | Residence regulations 9; Immigration Act 31 |
| F16 | 706 table: Article 23-1 NIA application thirty days from event; outside route new resident-visa application to BOCA/branch fifteen days from event then NIA. No demand for completed visa issuance inside fifteen days. | Residence regulations 7; Immigration Act 23-1 |
| F17 | 706 special windows/FAQ: continuing qualifying business entrepreneur four months, ceased-business continued residence three, Gold Card own renewal four. | NIA entrepreneur notes 3/6; Gold Card note 6 |
| F18 | 706 opening/continued residence: mandatory revocation/cancellation with conditional possible continuation; non-remarriage belongs to foreign DV applicant; former Taiwan spouse's residence/household conditions separately stated; minor household-registered child and care/rights/access conditions; litigation ongoing, injury treatment ongoing. | Immigration Act 31 |
| F19 | 706 overstay: less than thirty days AND original basis continues, penalty then reapplication, one-year permanent-residence calculation deduction; no free grace period. | Immigration Act 31(3) |
| F20 | 706 professional/graduate paragraphs: apply before expiry; professional approved six months from day after ARC/Gold Card expiry, one further total max one year; graduate approved one year plus one total max two, qualifying program, not language-course completion or automatic old work-authority extension. Approval-before-expiry not invented. | Professionals Act 17; Residence regulations 11 |
| F21 | 706 graduate-work paragraph: Taiwan associate degree or higher already awarded AND current graduating cohort AND lawful NIA graduate-extension approval, exemption during approved period. Not all graduates/jobseeker cards. | Professionals Act 12 |
| F22 | 706 travel/FAQ: permission before departure, cannot outlast ARC and canceled with ARC, valid passport plus APRC exception; receipt/photo/file number not substitutes or boarding guarantees. | Immigration Act 34; Residence regulations 20 |
| F23 | 706 named online procedure: departure ends review, reapplication after re-entry only if eligible. Mandatory procedural effect retained without universal departure ban. | NIA professional/dependent online note 9 |
| F24 | 704 supplementation: notification following day, fifteen calendar days; missing evidence requiring issuance abroad/Mainland/HK/Macau changes period to three months; late/incomplete rejection; ten-working-day restart. | Chinese NIA 0902 |

All article titles, summaries and nine FAQ answers were read against this matrix. The title/summary remains limited to procedure and eligibility; no guaranteed approval, unrestricted employment or universal conversion right is introduced. The original EN official URLs are all retained, including previously missed 704 BOCA work/mission/NIA directory links restored during self-review. Four English internal links remain explicitly identified as English: 704 spouse, 705 spouse/Gold Card, 706 APRC. All six mutual KM links resolve by full slug to the new trio.

## Numeric differences were reviewed, not ignored

[Content audit](../checks/km-content-audit.json) preserves raw source-only/target-only tokens. They were not zero-filled or automatically dismissed. Repeated-token counts differ from substantive values: 704 Article 22 and 705 Articles 16/5 appear a different number of times, but remain identified and their operative conditions are preserved. The original source date `24` is rendered as the inherited research range `24–25`, while metadata alone moves to `26`. English words such as three/five/ten are sometimes rendered with Arabic digits; each is checked by its clause and unit above.

704's extra numeric tokens cover source memo details: NIA document IDs; two-year photo; one-month evidence; first spouse year/Article 12; ordinary/specialist/Gold Card terms; ten-day review, fifteen-calendar-day/three-month supplementation; student five-day payment/review, six-month electronic card and three-working-day collection. 705 adds explicit statutory visitor 60-day and Mandarin 4/3/15 conditions that are partly spelled out in EN, plus repeated article/document references. 706 adds the supplied graduate 1+1/max2 and Article 12 conditions, F19's one-year deduction, and citation note numbers. Every NT$ amount and less-than/at-least/at-most comparison is retained in the relevant clause. Footer administrative update dates and note numbers from EN were restored; read-time estimates are editorial metadata, not whitespace-derived word counts or legal periods.

## §5 and recent-KM comparison

1. Exact shared KM runs are FAIL 0 on final SHAs; the initial unsupported/failed runs remain available. Structural verification is [km-structure.json](../checks/km-structure.json): errors 0, actual runtime market-board filter visible for all three, full-slug duplicates/links checked. The full auditor intentionally keeps 24 semantic review items REQUIRED and `publicationReady: false`.
2. Openers differ: 704 statutory filing-date fact; 705 effect of entry route; 706 reader question about a job ending before card expiry. No fabricated scenario or repeated “suppose” opening. The first two paragraphs cannot be removed without losing the 704 two different counting dates, 705 legal status/application-route distinction, or 706 loss-of-basis/date-evidence framework.
3. Short segments after R2: 704 ten, 705 six, 706 eleven at the ICU profile threshold. Examples with independent meaning: `NIA ចេញ ARC បន្ទាប់ពីអនុម័ត។`, `ប្រភេទការងារជាចំណុចសម្រេច។`, `បង្កាន់ដៃមិនជំនួសការអនុញ្ញាតទេ។`. No paragraph contains multiple profile-long sentences; long eligibility clauses remain intact rather than losing conditions.
4. Final maximum repeated paragraph openers are 2/1/3; the third is within the shared long-article limit for 25 paragraphs. Consecutive repeated sentence starts are 1/0/0. All paragraph beginnings were read vertically. Necessary statute names are not replaced with vague pronouns to game the count.
5. End-parenthesis citation share is zero; links occur at the legal actor or within the sentence, with substantive sources retained. Citation-free practical/consequence paragraphs remain. No three-paragraph “claim/citation/however” pattern was found.
6. Automated contrast detection is limited and reports zero; manual reading still recognizes plain negative scope explanations. 704 has two explicit `មិនមែន` clarification constructions (study evidence and document-issuance location); 706 has two (overstay grace and online-only departure rule). 705's status/authorization distinctions address actual eligibility questions. No invented objection or repetitive “not X but Y” frame was added.
7. Final substantive endings concern 704 entry/supplement notices that establish counting dates, 705 the entry visa and new-purpose evidence read together, and 706 documents covering the actual return date. Source-date/jurisdiction notes are retained as structural tails, not copied sales endings. Only 706 has the source contact email in its dispute paragraph.
8. Modern Khmer prose; no decorative bold, body H1, fabricated first-person experience, public AI/author attribution, imperative checklist headings, manual bidi wrappers or inserted invisible word controls. Native-human fluency review has not occurred.
9. Facts, law references, dates, fees, links and fictional-image caption checked after edits. Frontmatter is actually parsed with gray-matter, not guessed with a header regex. FAQ data and source footers were reviewed outside the rhythm tool's exclusions.

The latest actual KM813, KM814 and KM815 were read completely. KM813 starts with consular-list dates, KM814 with a divorce/ARC reader question, KM815 with three inheritance/death/residence deadlines. Their repeated long contact/language-service closing was not copied. This new trio uses specific filing/category/travel headings and ends on its own documents and timing. Those Cambodian-family articles are style comparators, not a reason to assume every Khmer reader has Cambodian nationality or to import their consular facts.

## Reproduction and limits

From B5:

```sh
/Users/son7/.nvm/versions/node/v24.14.1/bin/node checks/km-verify.mjs
python3 checks/km-variety-check.py
```

The first runner builds a temporary owned read-only symlink union of current R content plus these three manuscripts, applies the existing repository auditor/runtime filter, and removes only that temporary context. R is never edited. All current source hashes were checked again before freezing the handoff; the separately disclosed LESSONS regeneration was reread.

These checks establish file structure, source/link retention, current filter eligibility and the specified rhythm diagnostics. They do not establish native-human Khmer quality, licensed legal approval, actual browser rendering or live publication. The Chinese Article 31 fresh-read timeout and the shared Khmer abbreviation ambiguity are explicitly retained limitations. Root must complete independent meaning review and integration/render checks before publishing.
