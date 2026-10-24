# Indonesian ARC revision — independent locale review

Date: 2026-10-24. Reviewer: `/root/review_rev2_id`, independent AI editorial reviewer. I did not author or edit these articles. This is not a human native-speaker or lawyer certification, and it is not a publication claim.

## Final recheck — PASS

All three articles now PASS the Indonesian locale review at the exact hashes below. I remain independent of authorship: the author applied every article change; I edited only this review report. This approval supersedes the historical REQUEST_CHANGES record retained below.

| Article under `repo/src/content/columns-id/` | Final SHA-256 | Decision |
|---|---|---|
| `704-taiwan-arc-first-application.md` | `1e15ac9b7c6587ee871127b755965888190a8967e115ec2952c74985877876ed` | PASS |
| `705-taiwan-visa-residence-work-study-family.md` | `546994640fcc235126d66fb351445ca1e1bb321adb9a031903fa42c8383261a4` | PASS |
| `706-taiwan-arc-renewal-changes-reentry.md` | `244898da1b702265829c784099076031322ff99bde99325f940365325b63537c` | PASS |

The four prose findings below are resolved in the actual files. The family section states qualifications directly instead of adding generic warnings after each paragraph. The language/citizenship metadata sentence is gone. The event-date repetition and classmates comparison are deleted; “Penerimaan permohonan belum berarti perpanjangan disetujui” communicates the approval distinction once. I also caught a repair-stage ambiguity: “pasangan pemegang ARC” could mean the spouse of an ARC holder. The author changed it to “Bolehkah pasangan dengan ARC bekerja?”, preserving the intended question about a spouse who holds an ARC. These changes reduce repetition without adding rhythm-only filler.

Two substantive scope corrections were identified by the independent final legal reviewer after my first locale review. My initial “no material legal discrepancy found” statement below did not catch these existing omissions; it is a historical record, not the current legal conclusion. I independently reopened the official sources and checked both author repairs:

- 705:59 now explicitly distinguishes an ordinary foreign professional currently performing professional work in Taiwan from a foreign special professional, with NIA-approved residence or permanent residence required in either branch. It keeps the qualified relatives and their accepted visitor-visa/visa-free entry before direct application. This matches the operative structure of [current Article 16(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16). The family FAQ at line 24 does not promise that every professional sponsor qualifies; the surrounding Article 23 exclusions and spouse work-permit exemption remain intact.
- 704:22 and 58 now specify that the Taiwanese spouse resides in Taiwan and has household registration there. The first-card one-year/attendance passage is thus tied to that qualified category. I checked [residence regulations Article 12(1)(4)](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129) and the documents/first-spouse-application sections of [NIA 0902](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/). The attendance, one-year period, and local service-center route remain.

These are substantive scope corrections, not merely meaning-preserving stylistic edits. No legal deadline or amount was changed. I reread each changed paragraph, all affected FAQ, the unchanged openings, and the actual conclusions. No outstanding material issue remains within this assigned locale review. The final legal reviewer retains responsibility for the complete current-source and cross-language review; root owns release/rendering verification.

I reran the exact variety CLI shown below against all three final files. Each returned exit 0 and `OK — no variety limit violated`; `git diff --check -- src/content/columns-id` returned exit 0 with no output. Final measured results:

| Article | Sentences | Mean | CV | Short share | Similar triples | Opener repetition | End citations | Citation paragraphs | Machine contrasts/caveats/questions |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 704 | 51 | 13.6 | 0.475 | 0.255 | 0.020 | 0.176 | 0 | 0.294 | 0 / 0 / 2 |
| 705 | 51 | 16.9 | 0.452 | 0.098 | 0.102 | 0.105 | 0 | 0.368 | 0 / 0 / 2 |
| 706 | 65 | 14.6 | 0.455 | 0.262 | 0.079 | 0.182 | 0 | 0.500 | 0 / 0 / 1 |

Final manual section 5: (1) all CLI items pass; (2) the three specific openings remain distinct; (3) useful short document/deadline statements remain and duplicate padding was removed; (4) no new repeated paragraph-opener chain; (5) the repeated family qualification/warning pattern is repaired and practical uncited paragraphs remain; (6) the classmates rebuttal is gone while legally necessary distinctions remain; (7) endings stay tied to applications/travel and the scope note no longer exposes editorial instructions; (8) professional Indonesian, no bold, invented case, public byline or promotional ending; (9) source links, amounts, periods, starting dates and image metadata remain, with the two openly documented scope corrections above. The final 704 addition contains no number or URL; final 705/706 link and numeric comparisons likewise show no loss/addition outside image paths. The image/metadata and comparator checks from the full first review still apply.

No further Indonesian author repair requested. This report claims local review readiness, not live publication.

## Historical first-pass decision

Initial result: REQUEST_CHANGES. Article 704 passed the first locale prose review. Articles 705 and 706 needed the bounded prose repairs below. No material legal discrepancy or lost source/number was found at that stage, but the two missed legal scope conditions are explicitly corrected and acknowledged in the final recheck above. All three passed the required variety CLI; that did not resolve the repeated warning endings and duplicated short sentences identified by reading the prose.

## Exact versions reviewed

Paths below are relative to `/Users/son7/tseng-arc-revision-20261024/repo`.

| Article | SHA-256 | Locale decision |
|---|---|---|
| `src/content/columns-id/704-taiwan-arc-first-application.md` | `1fa0cc1cbe23fac13673544d41dbfd9cd319ef83c3ca151171327f84df668b13` | PASS |
| `src/content/columns-id/705-taiwan-visa-residence-work-study-family.md` | `852545c7cef5ca60a7d962f7e4f397b86c248bce13b80273a16746f5dd240c0a` | REQUEST_CHANGES |
| `src/content/columns-id/706-taiwan-arc-renewal-changes-reentry.md` | `34cf4794c47530a166b2b555bf0a411ddf18622eb787b80adba5dbe58ff6f335` | REQUEST_CHANGES |

I read the full original three files using `git show 174454bd4bb8d9e05627d71f9ef0af646540b3e4:<path>`, all three revised files, the author report, the revision brief, independent-review instructions, repository AGENTS, full editorial voice rules, COLUMN-VOICE-RULE, SENTENCE-VARIETY-RULE, LESSONS, editorial skill and review criteria. The retired Fable requirements were not applied.

## Required bounded repairs

These are editorial findings, not corrections of the underlying law. Keep the cited links and all qualifying facts in their existing relationship. Do not remove an eligibility limitation merely because it is a limitation.

| File:line | Exact sentence or smallest relevant span | Reason and evidence | Proposed repair | Legal meaning preserved? |
|---|---|---|---|---|
| `705-taiwan-visa-residence-work-study-family.md:55`, also lines 61 and 63 | “Syarat izin masuk tetap berlaku setelah menikah.” / “Kategori izin sponsor perlu diketahui sebelum keluarga menyiapkan permohonan.” / “Pengecualian ini terbatas pada pemohon yang memenuhi syarat tersebut, sehingga tidak berlaku bagi semua pemegang ARC keluarga.” | MONOTONY: repeated warning endings — three paragraphs in this one short section end by telling the reader again to respect the qualification already stated. The actual 60-day route, excluded sponsor categories, and narrow spouse work exemption are useful; the recurring extra reminder makes the section sound like annotated instructions. | At line 55 state the route positively: “Pemohon yang menikah dengan warga Taiwan yang tinggal dan terdaftar dalam pencatatan kependudukan Taiwan memerlukan bukti perkawinan serta status pasangannya. Untuk jalur permohonan dalam [Pasal 23 …], visa harus mengizinkan tinggal sedikitnya 60 hari dan tidak memuat catatan pembatas yang disebutkan dalam pasal itu.” Retain the same link. At line 61 retain the substantive exclusion sentence and delete only the final generic reminder. At line 63 keep the reader question and give one fully qualified answer: “[Pasal 48] memberikan pengecualian izin kerja khusus kepada orang asing yang menikah dengan warga Taiwan yang terdaftar dalam pencatatan kependudukan Taiwan dan sudah memperoleh izin tinggal.” The separate warning sentence is unnecessary after this precise scope. | Yes. Residence/household registration, proof, 60 days, visa restrictions, the Article 46(1)(8–10) exclusion, and marriage-plus-residence conditions must all remain. The proposed Article 23 wording is explicitly limited to that route, not every spouse application. |
| `705-taiwan-visa-residence-work-study-family.md:82` | “Bahasa Indonesia pada panduan ini tidak menentukan kewarganegaraan pembaca; kelayakan mengikuti paspor, izin masuk, dan kategori permohonan.” | MONOTONY: editorial metadata in the legal scope note — telling readers that the page language does not determine their citizenship reads like an instruction copied from the writing brief. The following eligibility factors already supply the meaningful rule. | “Kelayakan ditentukan oleh paspor, izin masuk, dan kategori permohonan.” Keep the review date and separate-regime sentence. WNI/TAC scope is already explicit in the opening and FAQ. | Yes. No passport or application scope is broadened; the legal eligibility factors remain. |
| `706-taiwan-arc-renewal-changes-reentry.md:57`, also line 73 | “Penghitungan dimulai pada tanggal peristiwa itu.” / “Bukti penerimaan permohonan perpanjangan hanya menunjukkan bahwa permohonan sudah masuk. Bukti itu belum menunjukkan izin baru disetujui.” | MONOTONY: short repetition — line 57 immediately repeats “30 hari sejak tanggal peristiwa perubahan.” At line 73, the two short sentences expand one existing receipt-versus-approval point into a mechanical restatement. Neither supplies a new condition. This is precisely the rhythm-padding problem the user rejected. | Delete the standalone “Penghitungan…” sentence; retain the preceding 30-day sentence and the following distinct day-after-address-reporting comparison. Replace the two receipt sentences with “Bukti penerimaan permohonan perpanjangan belum membuktikan bahwa izin baru telah disetujui.” Keep the overseas replacement paragraph that follows. | Yes. Both starting dates and the fact that a receipt does not prove approval remain explicit. |
| `706-taiwan-arc-renewal-changes-reentry.md:37` | “Lama perpanjangan ditentukan oleh bukti studi dan batas yang berlaku untuk kategorinya, sehingga tidak selalu sama bagi teman sekelas.” | MONOTONY: unnecessary imagined comparison — classmates appear only to supply a rebuttal; they add no eligibility, document, or deadline information. The paragraph already explains what determines the extension. | “Lama perpanjangan ditentukan oleh bukti studi dan batas yang berlaku untuk kategorinya.” Keep the student portal and current attendance-record requirement. | Yes. This removes only the hypothetical comparison, not an application condition. |

The rest of the cautionary wording is not automatically a defect. In particular, the 30-day first-ARC period not extending a visitor stay, TAC not authorizing work, the limited family categories, the statutory work-permit exceptions, and overstay relief not being a grace period all prevent a specific consequential misunderstanding. Preserve them.

## Concrete improvements that already work

- 704 originally ended its opening with “Catat tanggal masuk Anda.” That generic instruction is gone. The new opening supplies the 30-day rule and its day-after-arrival trigger in one coherent sentence, then the valid ARC-equivalent exception. This is a real improvement, not a synonym exchange.
- 704 replaces “Kontrak sewa dapat menjadi bukti alamat. Gunakan alamat yang benar-benar Anda tempati.” with “Kontrak sewa dapat menjadi bukti alamat, asalkan menunjukkan tempat yang benar-benar Anda tempati.” The relationship between the evidence and actual residence is now explicit.
- 705 removes the unnatural “Susun visa belajar” and “memperbaiki jenis izin masuk”; “Pendaftaran kursus setelah tiba sebagai wisatawan tidak dengan sendirinya memenuhi persyaratan visa tersebut” is idiomatic and legally limited. The entry-type restrictions remain sourced.
- 706 replaces the invented assumption “bukan tiga bulan sesudahnya” with “Permohonan harus masuk sebelum kedaluwarsa.” That is a useful direct deadline statement. The requested repair above concerns other duplicated sentences, not this one.

## First-two-paragraph deletion test

704: Paragraph 1 sentence 1 gives applicant scope, filing duty, period, and starting day; deletion loses the immediate answer. Sentence 2 supplies the Gold Card/equivalent exception, which is necessary to avoid an overbroad obligation. Paragraph 2 sentence 1 gives the separate domestic visa-issuance trigger; its link and distinction earn their space. Sentence 2 limits the discussion to avoid implying that the BOCA sequence covers direct NIA applications. No throat-clearing remains in those two paragraphs.

705: Paragraph 1 introduces an Indonesia-specific facility, its visitor/work boundary, the authoritative route to eligibility, and the lack of automatic ARC conversion. Each sentence adds different information. Paragraph 2 introduces the three residence purposes and the conditioned professional direct-NIA alternative. Deleting either sentence removes a route or a condition. The introduction is now better targeted than the original general resident-visa opening. The paragraph has legal limitations, but they are tied to genuinely different questions, unlike the generic reminders identified later.

706: Paragraph 1 explains why a printed expiry date does not settle an ended employment basis, identifies cancellation and exceptions, and adds the separate reporting duty. Paragraph 2 gives the renewal window, hard expiry boundary, and required core documents. The short expiry sentence is meaningful. No opening sentence should be cut merely for being short. The agent-procedure paragraph was properly relocated to the renewal section.

## Independent comparison with three real Indonesian columns

I read the complete files independently; these are accessible repository comparators, not a fresh live-publication audit. All three carry `published: 2026-10-23` and `lastmod: 2026-10-23`.

| Comparator path under `src/content/columns-id/` | Concrete opening, heading, and ending comparison |
|---|---|
| `668-indonesian-buyer-taiwan-machinery-defect-notice.md` | Begins with the six-month cancellation/price-reduction period, then explains governing-law scope. “Temuan awal dapat diberitahukan sebelum penyebab akhirnya pasti” expresses a real procedural issue. The last substantive sentence returns to the machine's initial condition before component replacement. Revised 704 likewise begins with a deadline, but its document table and application sequence are suitable to its different task. Its ending refers to expiry and later changes instead of copying the dispute-consultation template. |
| `667-indonesian-factory-worker-injury-evidence-compensation-taiwan.md` | Opens by distinguishing diagnosis from evidence connecting the injury to work; its brief “Pertolongan medis didahulukan” changes practical priorities. “Bila asuransi belum didaftarkan” names a concrete contingency. It closes on matching payment to the treatment period. Revised 706's short expiry deadline similarly has a purpose; its repeated event-date sentence does not. This comparison supports the specific distinction in the findings. |
| `666-indonesian-worker-bank-account-cash-job-police-taiwan.md` | Opens with the observable act of withdrawing and handing over money, then identifies the evidence relevant to intent. “Percakapan perekrutan menjelaskan apa yang Anda ketahui” and “Surat polisi, penerjemah, dan berita acara” are topic-specific headings. Its closing returns to linking instructions and transactions. Revised 705's TAC opening and work/study/family organization are different and reader-relevant; the repeated scope reminders in the family section still need repair. |

The samples contain their own repetitive caution/consultation wording, so they are evidence of actual site practice, not flawless models. I did not import their contact template or claim Indonesian consultation availability.

## Source, numerical, and legal-strength preservation

Independent comparison of unique Markdown-link sets against base `174454bd4bb8d9e05627d71f9ef0af646540b3e4` found 20, 20, and 14 links respectively, with no added or missing URLs. Numeric-token sets outside URL/image paths also had no additions or losses. These mechanical checks were followed by reading the conditions and written-out numbers; tokens alone cannot validate meaning.

- 704 retains both different 30-day triggers, the valid ARC-equivalent exception, conditioned direct-NIA routes, two-year photo age, one-month certificates, recruitment-permit stage, visitor-student health proof, Taiwan marriage registration and spouse attendance, first marriage ARC one year, category-specific accounts/portals, annual NT$1.000 with rounding, NT$2.200 addition, 僑生 scope, general three-year cap with exceptions, five/ten-business-day processing and exclusions, five-day payment, student three-day pickup, and work-permit exceptions.
- 705 retains TAC/WNI eligibility limits and no automatic conversion; professional entry/work authorization conditions; academic versus Mandarin routes; online form versus actual issuance; four completed months plus at least three further months; recognized university affiliation, weekday 15 hours and at most one-quarter absence; covered-student 20-hour rule outside summer/winter vacations; Taiwanese spouse residence/household registration, 60 days and restrictions; professional sponsor approval and qualified family scope; excluded migrant categories 8–10; limited spouse work exemption; Gold Card four functions and no employer prerequisite; and entrepreneur qualification review.
- 706 retains three-month general versus four-month qualifying entrepreneur windows; one-month employment evidence and stage-specific ministry receipt; Mandarin attendance/category limits; fees and rounding; WDA online/counter alternatives; address/workplace day-after 30 days; new-employer permission with statutory exceptions; cancellation plus employment-litigation, injury-treatment, and qualified family exceptions; Article 23-1 event-date 30 days versus outside-category 15-day BOCA route; replacement evidence alternatives; NT$500 without extension; re-entry/APRC distinction, pending receipt limit, overseas replacement/special older-card cases, and under-30-day post-sanction reapplication with continuing basis and no grace-period characterization.

I read `work/research/source-refresh.md` in full. I also independently opened the current official [Immigration Act Article 23](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23), [Employment Service Act Article 48](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48), and [residence regulations, including Articles 7 and 9](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129) to ensure the suggested qualification-based rewrites do not broaden the family exemption or change the starting dates. No substantive correction is proposed. The final legal reviewer still owns the full current-source and cross-language decision; this locale review does not claim independently reopening every source.

## Images and packaging

I viewed all three actual v2 WebP files. The localized descriptions match: 704 has a blank booklet, document folder and plain card; 705 has a closed laptop, stacked books, two mugs and booklet; 706 has an open blank notebook, booklet, plain card and keys. The shared Taipei window backgrounds, pen in 704 and travel bag in 706 need not all be listed in concise alt text. No real person, readable official document, flag, logo, or official-card replica is depicted. Captions identify illustration/non-official status. Each frontmatter uses the correct topic path with no duplicate inline image.

Title, summary, headings, FAQ, and ending were read separately. Titles differ meaningfully, summaries describe the actual subject, and FAQ answers remain within body scope. No bold markup, invented case, public author identity, false native/lawyer review, promotional ending, or extra consultation language appears. Internal author and existing publication fields remain intact. The source-date/scope tail is present; the one metadata-like scope sentence is the required 705 repair above.

## Exact CLI and section 5 manual check

Executed from the revision repository:

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-id/704-taiwan-arc-first-application.md`

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-id/705-taiwan-visa-residence-work-study-family.md`

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-id/706-taiwan-arc-renewal-changes-reentry.md`

All returned `OK — no variety limit violated`, exit 0, FAIL 0. `git diff --check -- src/content/columns-id` also returned exit 0 with no output.

| Article | Sentences | Mean | CV | Short share | Similar triples | Opener repetition | End citations | Citation paragraphs | Machine contrasts/caveats/questions |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 704 | 51 | 13.5 | 0.467 | 0.255 | 0.020 | 0.176 | 0 | 0.294 | 0 / 0 / 2 |
| 705 | 54 | 16.1 | 0.459 | 0.130 | 0.096 | 0.105 | 0 | 0.368 | 0 / 0 / 2 |
| 706 | 67 | 14.5 | 0.458 | 0.269 | 0.077 | 0.227 | 0 | 0.500 | 0 / 0 / 1 |

1. Required CLI: all three measured successfully; no checker or rule edits.
2. Openings: deadline, Indonesia-specific visit facility, and ended-employment consequence; no stock hypothetical. This review covers these three Indonesian pieces, not the entire multilingual distribution.
3. At least two short sentences exist in each, and most convey fees, document requirements, or a deadline. However, 706's duplicated event-date/receipt sentences require repair despite the numerical pass. Longer sentences carry conditions rather than decorative padding; split only if the complete relationship stays readable.
4. Paragraph openers were read vertically; no same first word exceeds two in the measured prose. No material mechanical opening chain found.
5. Sources occur as subjects and integrated clauses; some practical paragraphs are uncited because they add no new legal proposition. The 705 family section nevertheless repeats the prose shape “qualification → extra scope warning”; that manual finding is not captured by `caveat=0`.
6. The machine reports zero contrast forms. Manual reading identifies the unnecessary classmates comparison in 706 and redundant reminders in 705. Genuine receipt/approval and eligibility distinctions must stay; do not interpret zero regex hits as zero rhetorical repetition.
7. Endings return to the article's application, dates, or travel task; no firm promotion. The 705 source tail contains editorial metadata requiring removal as described above.
8. Professional Indonesian register, no bold, first-person fabrication, or checklist-command headings. Korean/Japanese register tests do not apply.
9. No lost legal number, date trigger, condition, URL, or provenance found. Suggested changes are bounded prose deletions/consolidations, not legal expansion.

Next bounded step: the author applies these four finding groups only, rereads the affected section endings/FAQ/conclusions, reruns the exact CLI without padding, and supplies the new hashes. I will recheck the repaired passages and affected conclusions. If the shorter prose creates a metric conflict, report it rather than adding empty short sentences. Until that recheck, 705 and 706 are not locale-approved for this revision.
