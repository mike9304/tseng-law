# Indonesian locale review — ARC/visa 704–706

Review date: 2026-10-24 KST. Reviewer: fresh independent AI editorial reviewer for natural professional Bahasa Indonesia and Taiwan-law readers. This reviewer did not author the manuscripts. No claim of human native-speaker or lawyer certification is made.

## Current verdict after repair 1

The updated author report and actual manuscript bytes were independently matched with `shasum -a 256`. Author report: `2b0b39a65ba7b41739b3910d5e5ecac0c11159fdc5e5d1ad271aaf8ef80b8528`. Both required findings are closed after one bounded repair. All three articles now PASS the independent content/locale review at the hashes below. The shared checker remains unsupported for Indonesian; this is not a quantitative PASS, final integrated release approval or publication verification.

| Article path under `repo/src/content/columns-id/` | Current reviewed SHA-256 | Current verdict |
|---|---|---|
| `704-taiwan-arc-first-application.md` | `3e48da7b40136ea4bbf8cae215e2b177610e85fcf63619008b6cc62d9a256d37` | PASS — R1-704-1 closed |
| `705-taiwan-visa-residence-work-study-family.md` | `4e286b873530693a78c074225e3c00b6fd0b264691a0a95a461474a26388916a` | PASS — unchanged hash, original independent review retained |
| `706-taiwan-arc-renewal-changes-reentry.md` | `427ef833779a1309a5a5f423fd866809f7fd3bc12b35ca24cf5e6d3646372506` | PASS — R1-706-1 closed |

### Repair 1 independent delta verification

Only the repaired passages and their affected FAQ, neighboring date distinctions and conclusions were reread. No new broad research/rewrite was undertaken. The current texts were checked against the official Articles 22 and 31 already opened during this same review run.

| Finding | Current text / checks | Resolution |
|---|---|---|
| R1-704-1 | Line 24 now limits the 30-day rule to a resident-entry applicant who still needs a separate ARC and says: “Pemegang dokumen yang masih berlaku dan sudah memiliki fungsi ARC, termasuk kartu empat fungsi seperti Employment Gold Card, tidak perlu mengajukan ARC terpisah.” FAQ 1 at line 17 includes the same valid-document exception. The day-after-entry start, domestic visa issue-date distinction at line 26, visitor warning at line 32, work-authority conclusion and Article 22 link remain. | CLOSED. The statutory separate-application exemption is now clear in both body and FAQ. The narrow addition has not turned visitor admission into a right to change status. |
| R1-706-1 | Line 42 now reads: “Menurut [Pasal 31](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31), perubahan alamat atau tempat kerja wajib dilaporkan dalam 30 hari yang dihitung mulai hari setelah perubahan terjadi.” FAQ 2 uses the same next-day start. Lines 52–54 continue to distinguish eligible residence-purpose changes counted from the event date and the separate 15-day BOCA path; the employment-permit and travel conclusions remain unchanged. | CLOSED. The conflicting `tanggal perubahan … titik awal` sentence is gone; the preserved 30-day next-day rule is unambiguous. |

A read-only Node check restored only the two old 704 lines (FAQ 1 and opening paragraph) and the old 706 address paragraph in memory, then recomputed SHA-256. The reconstructed hashes exactly matched the initial frozen versions. This independently establishes that no other text changed, without relying only on the author's statement:

```text
704 onlyReviewedLinesChanged=true recoveredOriginalHash=026b261de4cedf4020620cef7b9b261e9fefadaf3f2d4cde61b30b514d0095a6
706 onlyReviewedLinesChanged=true recoveredOriginalHash=2b714f2f7126b321082f6f895d0ee77f73853dfed8b448b2ff49d73157a0e385
exit 0
```

The current files also parse successfully with `gray-matter`: each still has three FAQs and internal `legal-ai-assistant` metadata, no body H1 and no prohibited bold. 705's entire SHA is unchanged. The optional 705 collocation preference remains nonblocking and was not implemented.

Manual §5 delta: the added 704 sentence is concrete and legally necessary, its first paragraph still varies in length, and the short date-recording sentence remains. The 706 consolidation removes repetition without changing the paragraph's deadline or practical consequence. Neither repair introduces a stock opening, repetitive paragraph-start pattern, rhetorical contrast, fabricated experience or promotional ending. The initial complete manual/comparator review remains applicable to the verified unchanged text.

The exact shared CLI commands listed later were rerun on 704 and 706 after the repair; both returned exit 1, with actual stdout below. 705 was not rerun because its hash is unchanged; its earlier executed output remains applicable.

```text
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-id/704-taiwan-arc-first-application.md [ko] sentences=55 mean=86.5 cv=0.476 short=0.0 run3=0.038 opener_rep=0.0 cite_end=0.0 cite_para=0.278 contrast=0 caveat=0 q=1
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-id/706-taiwan-arc-renewal-changes-reentry.md [ko] sentences=66 mean=92.6 cv=0.437 short=0.0 run3=0.047 opener_rep=0.182 cite_end=0.0 cite_para=0.455 contrast=0 caveat=0 q=1
  FAIL len_cv=0.437 (limit >= 0.45): sentence-length variation (stdev/mean) too low — mix very short and long sentences
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
```

## Initial r1 status — historical, superseded by current verdict above

Frozen handoff received and independently matched with `shasum -a 256`. The author report hash is `76cb1d57d7425d8acce0ac9e1f5814662a5dcc98ce4b5af137e402ff278dded8`. All three complete manuscripts were read. Two bounded repairs are required; 705 passes this content review. No quantitative or publication PASS is claimed.

| Article path under `repo/src/content/columns-id/` | Reviewed SHA-256 | Verdict |
|---|---|---|
| `704-taiwan-arc-first-application.md` | `026b261de4cedf4020620cef7b9b261e9fefadaf3f2d4cde61b30b514d0095a6` | REQUEST_CHANGES — R1-704-1 |
| `705-taiwan-visa-residence-work-study-family.md` | `4e286b873530693a78c074225e3c00b6fd0b264691a0a95a461474a26388916a` | PASS — bounded independent content/locale review; unsupported metric limitation remains |
| `706-taiwan-arc-renewal-changes-reentry.md` | `2b714f2f7126b321082f6f895d0ee77f73853dfed8b448b2ff49d73157a0e385` | REQUEST_CHANGES — R1-706-1 |

Ownership is limited to this report. Manuscripts, shared checkers, source ledgers, Git and deployment settings have not been changed.

## Initial required findings — both closed after repair 1

Paths in this table are relative to `repo/src/content/columns-id/`. These findings concern legal scope/date clarity, not an unsupported Korean metric result. There is no broad rewrite request.

| ID / file:line | Exact sentence | Reason and evidence | Proposed bounded rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| R1-704-1 — `704-taiwan-arc-first-application.md:24`; align FAQ at line 17 | “Tenggat pengajuan Alien Resident Certificate (ARC) pertama adalah 30 hari bagi orang asing yang masuk Taiwan dan memperoleh izin tinggal.” FAQ: “Bagi orang asing yang masuk Taiwan dan memperoleh izin tinggal, hitungan dimulai pada hari setelah kedatangan.” | The stated class includes residents holding a valid four-in-one or other ARC-function document, but the article never gives Article 22(2)'s express exception from a separate ARC application. A Gold Card holder reading only this first-card guide could infer another filing obligation. This is a scope qualification to the rule already cited, not a request for a Gold Card eligibility digression. [Current Article 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22). | Keep the 30-day/next-day rule, qualify the first sentence to applicants who must obtain a separate ARC, and add: “Pemegang dokumen empat fungsi yang masih berlaku, seperti Employment Gold Card, atau dokumen lain yang sudah berfungsi sebagai ARC tidak perlu mengajukan ARC terpisah.” A concise FAQ opening is: “Bagi pemohon yang masih wajib mengurus ARC tersendiri setelah memperoleh izin tinggal saat masuk Taiwan, hitungan 30 hari dimulai pada hari setelah kedatangan.” Retain the visitor-status warning and existing official link. | Substantive scope correction: adds the statutory exemption that was absent; the 30-day period and next-day start remain unchanged. |
| R1-706-1 — `706-taiwan-arc-renewal-changes-reentry.md:42` | “[Pasal 31](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31) memakai tanggal perubahan tersebut sebagai titik awal.” | The immediately preceding sentence correctly says counting starts on the day after the change, whereas “tanggal perubahan … sebagai titik awal” can be read as counting from the event date. The later purpose-change discussion intentionally distinguishes these dates, so the address paragraph must not leave two readings. Article 31(6) expressly uses the following day. | Collapse the first two sentences to: “Menurut [Pasal 31](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31), perubahan alamat atau tempat kerja wajib dilaporkan dalam 30 hari yang dihitung mulai hari setelah perubahan terjadi.” Keep “Menunggu jadwal perpanjangan kartu dapat membuat laporan terlambat.” | Intended legal meaning preserved; removes the alternative same-day reading. No deadline, category or consequence is changed. |

No material defect was found in 705 at the listed hash. Its direct professional route is conditional, TAC is not presented as an ARC/work route, degree and Mandarin study are separated, and Taiwan-national spouse work authorization is not extended to all dependent ARCs. It makes no claim that every foreign professional's spouse automatically has work permission.

## Optional style preference — not a condition of PASS

| File:line | Exact sentence | Reason | Optional rewrite | Legal meaning |
|---|---|---|---|---|
| `705-taiwan-visa-residence-work-study-family.md:46` | “Susun visa belajar sebelum berangkat.” | “Mengurus visa” is the more idiomatic collocation; “menyusun” normally takes a plan or document arrangement. The intended practical action remains understandable. | “Urus visa belajar sebelum berangkat.” | Preserved. |

## Independent opening/deletion test

| Article | First two paragraphs actually tested | Result |
|---|---|---|
| 704, lines 24 and 26 | Paragraph one supplies the entry-based deadline, next-day start, source and date-recording action. Paragraph two supplies the different domestic resident-visa issue-date trigger, tells the reader which date to use, and preserves the separate direct-NIA route. | Both paragraphs carry decision-relevant information; deleting either loses the date distinction. R1-704-1 qualifies the scope of paragraph one. “Catat tanggal masuk Anda” has a concrete recordkeeping function rather than repeating the title. |
| 705, lines 24 and 26 | The first paragraph introduces visa-first versus eligible direct-NIA residence paths. The second switches to Indonesian-passport visitor/TAC eligibility and warns against using TAC for work or assuming ARC conversion. | Neither paragraph is a generic advance outline. The passport-specific paragraph does not assign Indonesian nationality to every Indonesian-language reader; the final scope note expressly separates language from citizenship. Retain both. |
| 706, lines 24 and 26 | The first paragraph warns that the employment basis can end before the printed card date and that change reporting is separate. The second gives the agency/employer/counter split, filing-date inquiry and application-number action for migrant workers. | Both add concrete facts or actions. They do not repeat 704's deadline opening or 705's entry-path opening. Retain both; R1-706-1 concerns the later address paragraph. |

## Independent manual §5 review

This is a content and rhythm assessment in Indonesian. It does not invent Indonesian numerical thresholds or convert the unsupported CLI to a valid quantitative PASS.

| §5 item | 704 | 705 | 706 |
|---|---|---|---|
| 1. Shared CLI | Executed; fallback ko; exit 1, one FAIL | Executed; fallback ko; exit 1, one FAIL | Executed; fallback ko; exit 1, two FAILs |
| 2. Opening variety | Deadline and counting start | Residence-path comparison, then passport/TAC scope | Employment-end consequence, then agency filing evidence |
| 3. Short/long rhythm | Short examples: “Catat tanggal masuk Anda.”; “Kontrak sewa dapat menjadi bukti alamat.” Document table separates parallel requirements; no sustained run of unwieldy prose. | Short examples: “Simpan salinannya sendiri.”; “Pengisian formulir belum berarti visa terbit.” Denser Mandarin conditions are split into separate sentences. | Short examples: “Simpan bukti pembayaran.”; “Catat tanggal peristiwanya.” The dense renewal paragraph moves from the window to documents and a scoped special-route example. |
| 4. Paragraph starts | Vertical read: varied; none occurs three times | `Untuk` and `Keluarga` each occur twice; the adjacent family paragraphs compare different sponsor categories | `Berakhirnya`, `Untuk`, `Bukti`, `Sebelum` each occur twice; none occurs three times |
| 5. Citation/caveat rhythm | Linked legal paragraphs alternate with filing, authorisation and document-copy actions | Statutory routes alternate with form handling and purpose choices; no three-paragraph claim/caveat template | Renewal, supporting documents, change evidence and travel steps vary; no three-paragraph claim/caveat template |
| 6. Contrast | Date, compatriot-student fee and processing-time distinctions are relevant; no repeated rhetorical rebuttal | Categories are differentiated without a repeated “not X but Y” pattern | One `bukan` deadline comparison; appropriate warnings on renewal, replacement and travel are tied to distinct decisions |
| 7. Ending | Check the applicable job/employer/permit, then a series link | Resolve the missing passport/entry/work/study/family information before fixing a start date, then series links | Put work/study expiry, ARC, filing status and return date in one record, then a series link |
| 8. Register/format | Natural professional `Anda`; no body H1, bold, fabricated first person or public byline | Same; optional collocation improvement above | Same; title's `pulang sementara` fits the practical reader scenario without restricting all readers' nationality |
| 9. Legal/number preservation | Live spot checks support dates, fees, category-specific portal and student collection sequence; R1-704-1 is outstanding | Live checks support Article 16, study 4+3/15 hours/attendance, Article 48 and Article 50's holiday exception | Live checks support ordinary renewal, business-based entrepreneur exception, purpose-change dates, fees and overseas-loss distinctions; R1-706-1 is outstanding |

No independent MONOTONY defect is required on these frozen versions. Source lists and neutral scope notices are structural endings, not sales conclusions. The three articles do not promise Indonesian consultation, application representation, permit approval or a universal processing time.

## Exact shared CLI and separate structural evidence

The reviewer independently executed each exact command; all returned exit code 1:

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-id/704-taiwan-arc-first-application.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-id/705-taiwan-visa-residence-work-study-family.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-id/706-taiwan-arc-renewal-changes-reentry.md
```

Actual stdout:

```text
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-id/704-taiwan-arc-first-application.md [ko] sentences=54 mean=84.9 cv=0.474 short=0.0 run3=0.038 opener_rep=0.0 cite_end=0.0 cite_para=0.278 contrast=0 caveat=0 q=1
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-id/705-taiwan-visa-residence-work-study-family.md [ko] sentences=62 mean=96.6 cv=0.453 short=0.0 run3=0.05 opener_rep=0.1 cite_end=0.0 cite_para=0.35 contrast=0 caveat=0 q=1
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-id/706-taiwan-arc-renewal-changes-reentry.md [ko] sentences=67 mean=91.9 cv=0.439 short=0.0 run3=0.046 opener_rep=0.182 cite_end=0.0 cite_para=0.455 contrast=0 caveat=0 q=1
  FAIL len_cv=0.439 (limit >= 0.45): sentence-length variation (stdev/mean) too low — mix very short and long sentences
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
```

No `--lang en`, invented thresholds or checker changes were used. The author's extra `--lang id` run is not represented as this reviewer's execution.

A read-only Node/`gray-matter` pass independently parsed the current files (exit 0). For each file: required frontmatter fields missing `[]`, FAQ count `3`, `audience=["id"]`, `topic="visa"`, `author="legal-ai-assistant"`, both dates `2026-10-24`, body H1 `false`, prohibited bold `false`, missing local internal links `[]`, and body official URLs omitted from `Sumber resmi` `[]`. Local internal-link counts are 3 / 3 / 2. Cross-links to 704–706 are package-internal draft links; this does not establish their public availability. The existing marriage article was read in full.

## Instructions read

- `work/LOCALE-REVIEW.md` in full.
- `tseng-law-editorial/SKILL.md` and `references/review-criteria.md`.
- `repo/AGENTS.md`, `repo/docs/columns/EDITORIAL-VOICE.md`, `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `~/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md`, and `~/tseng-lanes-shared/LESSONS.md`.
- `work/BRIEF.md`, `work/research-arc.md`, `work/research-paths.md`, the common/Indonesian/TAC portions of `work/research-asia.md`, and the relevant legal preflight table in `work/reviews/final-core.md`.
- Global Obsidian index, relevant Wei-Lawyer marketing MOC and current tseng-law project-note introduction were consulted for workspace context only. Current task instructions override historical Fable and public-byline boilerplate.

## Comparator preparation

The complete current local manuscripts were read, not only their titles or a prior research summary:

| Comparator | Current local dates | Concrete opening/structure/ending observations |
|---|---|---|
| `repo/src/content/columns-id/021-taiwanese-spouse-divorce-cross-border-parenting.md` | published 2026-09-27; lastmod/date_display 2026-09-28 | Opens with family support after divorce, then a child's school/language/contact consequences. Subheads organize daily care, authority to relocate, contact and maintenance. Ends with the facts and sensitive-data handling needed for consultation. |
| `repo/src/content/columns-id/022-marrying-taiwanese-national-registration-checklist.md` | published 2026-09-27; lastmod/date_display 2026-09-28 | Opens with a wedding date and registration-place question; distinguishes ceremony, registration, authentication, interview and residence. Ends with Taiwan/Indonesia legal-scope separation and a child-registration link. |
| `repo/src/content/columns-id/023-baby-taiwan-nationality-birth-registration.md` | published 2026-09-27; lastmod/date_display 2026-09-28 | Opens with a birth certificate followed by a registration/passport question; progresses by nationality, place of birth and household-registration status. Ends with a factual inquiry list and sensitive-document handling. |

The 021 source brief's lastmod 2026-09-27 description differs from the actual local file, which says 2026-09-28; this report records the file. Comparators contain historical body H1/public identity boilerplate; those are not models to import into 704–706. No public-render or full live-corpus verification is claimed.

## Primary sources independently opened during preparation

All below were opened on 2026-10-24. Page update dates are administrative metadata, not automatically law commencement dates.

| Source | Actual checked point |
|---|---|
| [Immigration Act Article 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | Resident-entry first ARC: 30 days from the day after entry; four-in-one/ARC-function exception. |
| [BOCA domestic resident-visa FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html) | Domestic resident-visa issuance starts its own 30 days on the issue date. |
| [Foreign Professionals Act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0030295) and [history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295) | Articles 15/16, specialist/senior spouse work-permit application versus approved residence, category-limited direct residence; relevant provisions effective 2026-01-01. |
| [Immigration Act Article 31](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31) | Address/workplace reporting from the next day; residence-basis loss; the late-refiling provision is not a grace period. |
| [Residence Regulations](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129) | Article 7 uses the event date for eligible residence-purpose changes; Article 9 ordinary renewal within three months before expiry. |
| [NIA 0915 direct-residence guide](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | Conditional categories and exclusions for trial exemption, landing visa, conditional Southeast Asian authorization, ABTC and working holiday, subject to other applicable rules. Old cross-reference numbering in parts of the guide is not adopted over the current Act. |
| [NIA student online guide, 2026-08-28](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news) | Approval-to-payment: five working days; IC-card collection three working days after payment; electronic ARC at most six months; Mandarin study evidence. |
| [NIA entrepreneur guide](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/) | Notes 3 and 6: business-based renewal within four months; separate no-business continued-residence path within three months. |
| [NIA Gold Card guide](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/406403/) | Note 6 Gold Card renewal within four months; note 7 is a separate ARC residence-extension route and does not automatically authorize work. |
| [NIA valid ARC/APRC passport FAQ](https://www.immigration.gov.tw/5385/12162/12197/414977/) | Passport need only be valid on arrival for a valid ARC/APRC holder, subject to immigration inspection. No universal six-month requirement. |
| [BOCA full-time student resident visas](https://www.boca.gov.tw/cp-166-283-c4da3-2.html) | Degree study has its own application/evidence framework. |
| [BOCA Mandarin resident visas](https://www.boca.gov.tw/fp-166-285-041cb-2.html) | Four months completed plus at least three months continued enrollment at a qualifying university center; attendance conditions remain. |
| [Employment Service Act Article 48](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48) | Taiwan-national spouse work-permit exception includes household registration and approved residence. |
| [WDA Indonesian ARC-renewal guidance](https://fw.wda.gov.tw/wda-employer/home/file/2c95efb38d75b733018d78209430058c) | Migrant-worker employer/agency online versus counter route and obtaining the agent's processing timetable; page currently displays 2026-10-23 update. |
| [Firm contact page](https://tseng-law.com/en/contact) | Visa/residence inquiries and actual email; direct consultation languages English, Chinese, Korean and Japanese; other communication arrangements require confirmation. |

Additional primary sources opened during the frozen-manuscript review:

- [Fee Standards](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080135): Articles 3 and 7 support annual/partial-year fees, direct-entry additional fee, specific compatriot-student reduction and replacement fee.
- [Employment Service Act Article 50](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=50): covered student categories and the winter/summer holiday exception to 20 hours.
- [BOCA TAC page](https://www.boca.gov.tw/cp-152-274-8c0e2-2.html): current Indonesian-national application pointer, updated 2026-08-05; not blanket eligibility.
- [NIA 0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970): resident-entry category, general supporting documents, counter processing exclusions and first spouse ARC.
- [Immigration Act English full text, Article 34](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080132): pre-departure re-entry permission and APRC exception.
- [NIA migrant-worker guide](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/181964/): first-application recruitment-permit alternative, renewal receipt alternative, recent employment certificate and data-change evidence.
- [NIA overseas-loss notice](https://www.immigration.gov.tw/5385/7229/7232/368785/): online/authorized representative routes and old migrant-card/single-re-entry distinctions.

Evidence unavailable: `https://tseng-law.com/id/contact` returned `not accessible via this tool`. The Chinese single-article 34 URL also returned this tool error; Article 34 was then checked in the accessible official English full text. These results do not establish 404. No claim of live Indonesian-page verification is made. Indonesian consular document-specific authentication rules and TAC interactive detailed eligibility were not newly certified; the articles avoid those unverified particulars.

## Remaining action and review limits

Both required findings are closed after repair 1. No further mandatory manuscript repair is identified by this reviewer at the current hashes. Optional 705 wording need not change for its PASS to stand.

The shared checker supports ko/en/ja/zh-hant, not Indonesian. An id file falling back to ko is not a native Indonesian metric result. This separate release-validation limitation remains even after content repairs. A manual PASS therefore never means “all checks passed.” Site build, rendered desktop/mobile review, actual applications, public deployment and final integrated release review are outside this report.

## Memory provenance

Memory only guided editorial/provenance handling. `MEMORY.md:550–557` was consulted; current sources and task files control the legal and editorial review. Associated rollout IDs: `01a0fd9e-4fb7-7710-a095-b3a75eae5929`, `01a10169-8632-72c2-aea0-63c905035c9f`.
