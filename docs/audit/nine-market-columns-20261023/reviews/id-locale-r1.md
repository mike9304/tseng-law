# Indonesian locale review — 664–668 — round 1

Review date: 2026-10-23. Reviewer: independent AI Indonesian editorial reviewer `/root/review_id`; did not author these articles. This is not a claim of human native-speaker or lawyer review. No manuscript was edited. Scope: the five frozen source files, Indonesian readability and legal-meaning preservation, first-two-paragraph deletion tests, recent same-locale comparison, FAQ/CTA and selected primary-source checks. Independent final legal review remains necessary.

Current verdict after the bounded repair recheck below: all five articles PASS this independent locale review at the final hashes recorded in the last section. The original REQUEST_CHANGES findings are retained as review history and are superseded only for those final versions. The unsupported-language CLI limitation remains open as a tooling limitation, not a claim of automated FAIL 0.

## Verdicts and exact versions

Paths below are relative to `/Users/son7/tseng-market-columns-20261023/repo/src/content/columns-id/`.

| File | Verdict | SHA-256 | Reason |
|---|---|---|---|
| `664-indonesian-home-caregiver-unpaid-wages-taiwan.md` | REQUEST_CHANGES | `9c764d8c3dce257c2884dea4183966a67ff241ef78ca2c0468e338d2ac700d41` | One bounded opening deletion, ID-01. No material legal mistranslation found in this locale review. |
| `665-indonesian-worker-passport-broker-dispute-taiwan.md` | PASS | `4cc7e579386fa75545b26b03b6d4a694082ee14b89a5d6896b32b69c58a051d2` | Natural worker-facing Indonesian; agency/employer, consent/retention, fee/return and transfer distinctions retained. |
| `666-indonesian-worker-bank-account-cash-job-police-taiwan.md` | REQUEST_CHANGES | `f26151bdcceb8ed8fd5d9e60b801a0819773457df9b5bbe524d6b088120b9966` | ID-02: warning provision rendered as discretionary possibility; clarify the three-or-more threshold during repair. |
| `667-indonesian-factory-worker-injury-evidence-compensation-taiwan.md` | PASS | `ab6d157e543d01a68ca6ec8c6f8c026664aab19db10ad6c22319161849b062b5` | Compensation, insurance, fault burden and offset qualifications remain distinct; readable injury-evidence focus. |
| `668-indonesian-buyer-taiwan-machinery-defect-notice.md` | REQUEST_CHANGES | `ed0dcf6a71cf23ddf4dceb04c04529575c84771292f098137f18a40178fb4efd` | ID-03/04: clarify scope of minor-defect exception and downstream compensation wording; ID-05 removes citation-only repetition. |

PASS is limited to this review and hash, not publication or completion of legal/build/browser checks.

## Required bounded repairs

### ID-01 — opening deletion

| File:line | Exact sentence | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| 664:26 | “Gaji pengasuh yang bekerja di rumah keluarga Taiwan tidak otomatis dihitung dengan aturan pekerja pabrik.” | The immediately following MOL sentence states the actual exclusion and contractual wage basis. Deleting this first sentence leaves the same classification and legal result; the comparison with factory workers is already addressed concretely in FAQ 1 and the institutional-care paragraph. The first-sentence deletion rule asks for removal of this kind of paraphrase. | Delete only this sentence; start with the existing linked “Kementerian Ketenagakerjaan Taiwan menjelaskan bahwa …”. Retain the official source and the following contract sentence. | Yes. No coverage, obligation, exception or source is removed. |

MONOTONY: opening paraphrase — “Gaji pengasuh … tidak otomatis dihitung …” — begin with the source-backed exclusion and contractual wage basis already written, rather than stating the same classification twice.

### ID-02 — warning modality and statutory tracks

| File:line | Exact sentence | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| 666:34 | “Pelanggaran dapat dikenai peringatan oleh polisi.” | “Dapat dikenai” presents the warning as a discretionary possibility. [AML Act §22(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0380131&flno=22) prescribes a police warning for violation of the prohibition; §22(4) also prescribes a warning for the consideration and three-or-more cases. The article correctly warns that first conduct is not necessarily warning-only, but its first sentence should state the statutory rule, not weaken its modal force. | “Pasal 22 ayat (2) menetapkan peringatan oleh polisi atas pelanggaran larangan tersebut.” In the next sentence, use “jumlah rekening atau akun yang diberikan mencapai tiga atau lebih”. Add “Untuk keadaan dengan imbalan atau sedikitnya tiga rekening atau akun, ayat (4) juga mewajibkan peringatan.” Keep the distinct five-year repeat branch, penalty ceiling and no-warning-only guarantee. | Substantive modal correction, supported by the linked statute; do not label it merely stylistic. The added three-or-more wording preserves the intended threshold and removes ambiguity. |

Optional language improvement at 666:50: “memilih pembela” is understandable, but “menunjuk penasihat hukum” is more familiar Indonesian legal prose for appointing counsel. This does not change the Taiwan-law right; do not import Indonesian procedural conditions.

### ID-03 — minor diminution and guaranteed quality

| File:line | Exact sentence | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| 668:34 | “Pengurangan yang tidak berarti dikecualikan dari standar cacat tersebut.” | The preceding sentence combines value, ordinary/agreed use and guaranteed quality. “Standar cacat tersebut” consequently leaves the minor-diminution proviso apparently attached to all three. [Civil Code §354](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354) places the insignificant-diminution proviso in paragraph 1 on value/use, while paragraph 2 separately requires promised quality. “Pengurangan” also lacks an expressed object in Indonesian. | “Penurunan nilai atau kegunaan yang tidak berarti tidak dianggap sebagai cacat menurut ayat pertama. Ayat kedua secara tersendiri mewajibkan barang memiliki kualitas yang dijamin penjual.” Adjust the preceding sentence to cover value/use, leaving the risk-transfer point intact. | Scope clarification against the primary source. It narrows a potentially overbroad reading of the current wording; treat as substantive clarification, not just stylistic preservation. |

### ID-04 — unclear subject of downstream recovery

| File:line | Exact sentence | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| 668:56 | “Simpan biaya perbaikan dan catatan berhenti produksi; penerimaan seluruh tagihan pelanggan hilir tidak otomatis mengikuti adanya cacat.” | “Penerimaan … tagihan” can mean receiving or accepting an invoice. It does not clearly tell the buyer whether the seller must compensate downstream claims, which is the paragraph's actual legal question. “Pelanggan hilir” is also less direct than “pelanggan Anda” for this audience. The surrounding discussion of §§360/227 already keeps separate legal grounds and evidence. | “Simpan biaya perbaikan dan catatan berhenti produksi. Adanya cacat belum berarti penjual wajib menanggung seluruh tuntutan ganti rugi dari pelanggan Anda.” | Preserves the apparent intended non-automatic-recovery point and makes the liable party explicit; author/final reviewer should confirm this is the intended scope. No new recovery entitlement is added. |

### ID-05 — citation-only opening sentence

| File:line | Exact sentence | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| 668:26 | “Pasal 365 KUH Perdata Taiwan mengatur batas tersebut.” | The previous sentence already states the deadline. This sentence adds only the source attribution. The link can sit in the proposition without a second assertion of the same point. | Attach the existing §365 link to “Enam bulan setelah pemberitahuan cacat …” or to “Pasal 365” within that first sentence, and remove this separate sentence. Preserve “salah satu”, Taiwan-law sale scope and the full later five-year/exception discussion. | Yes; retain the exact source link and every qualification. |

MONOTONY: citation-only restatement — “Pasal 365 … mengatur batas tersebut.” — integrate the citation into the already qualified deadline sentence. The separate ID-04 repair also gives the dense remedies section a clearer short sentence without padding.

## Independent first-two-paragraph deletion tests

Every sentence in the first two body paragraphs was read in sequence. Findings above identify the actual deletions; the remaining sentences should stay for the following reasons.

| Article and paragraphs | Sentence-level result |
|---|---|
| 664:26,28 | Paragraph 1 sentence 1 can be removed (ID-01). Sentence 2 supplies the actual MOL exclusion and agreed-wage basis. Sentence 3 adds the contract/version starting point for a wage claim. Paragraph 2 sentence 1 connects exclusion to continuing payment responsibility; sentence 2 gives the agreed due-date rule; sentence 3 preserves customary and period-based fallback rules. Removing the paragraph would lose the legal basis for timely payment. |
| 665:27,29 | The custody question identifies the present document-holder; sentence 2 explains why the identity controls the addressee and report; sentence 3 identifies evidence of consent versus retention. The two sentences of paragraph 2 distinguish the agency/personnel prohibition from the employer prohibition. None is a generic article preview. |
| 666:26,28 | Paragraph 1 sentence 1 specifies cash withdrawal/hand-over conduct; sentence 2 explains that the advertised job label is not decisive; sentence 3 adds actor, knowledge and intent. Paragraph 2 separates account access, personal transactions and consideration; its next sentence adds chronological evidence, and its last sentence adds preservation of adverse as well as favorable context. Each supplies a distinct evidentiary function. |
| 667:26,28 | Diagnosis versus work-context records is the article's central evidence distinction. The next sentence identifies the Indonesian machine-worker audience; the two short medical-care sentences preserve a useful order of actions. Paragraph 2 supplies manufacturing coverage, the three recovery grounds, and their accounting interaction. None can be removed without losing scope or a practical constraint. |
| 668:26,28 | First sentence supplies a narrowly defined time trigger; second is removable while retaining its link (ID-05); third links that trigger to repair discussions. Paragraph 2 preserves non-automatic governing law, the choice-of-law rule, sales versus design/installation classification, and the limited Taiwan-law-sales scope of what follows. |

The first paragraphs are not invented case narratives. They use legal classification (664), a real reader question (665), conduct and consequence (666), a concrete evidence distinction (667), and a qualified period (668); one opening type does not dominate the batch.

## Three recent same-locale comparators

These are source files in the verified local snapshot, not a claim of fresh live publication. Each has `published: 2026-09-27`, `lastmod: 2026-09-28`; they are the highest-numbered three among five latest dated baseline Indonesian articles. All three were read in full.

| Existing article | Opening/headings/ending comparison |
|---|---|
| `src/content/columns-id/021-taiwanese-spouse-divorce-cross-border-parenting.md` | Opens on Indonesian family support and a child's daily life; headings describe actual parenting issues. New 664–668 move directly into work, document custody, cash tasks and machinery evidence. They share practical document guidance but do not recycle the custody narrative or its contact ending. |
| `src/content/columns-id/022-marrying-taiwanese-national-registration-checklist.md` | Opens with a wedding date and a registration-location question, followed by process-specific headings. New 665 also uses a question, but identifies the current passport-holder instead of reusing an event-planning scene. Its consent/fee/return structure is distinct. The new CTA does not reproduce the older named-attorney/address paragraph. |
| `src/content/columns-id/023-baby-taiwan-nationality-birth-registration.md` | Opens on a birth certificate followed by questions about status/passports; defines household registration in paragraph 2. The new batch similarly explains distinctions where they change action, without duplicating the nationality sequence. New endings return to a dated return request, transaction chronology, payment-to-treatment records or machine-condition evidence. |

No topic duplication with those family articles was found. The repeated four-language consultation limitation in the new batch is necessary truth-preserving information; the surrounding request and final fact are article-specific. The source/disclaimer tail is treated separately from the substantive final paragraph, as the variety rule allows.

## Sentence variety §5 — independent check

The exact required command was run on all five files:

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <article>
```

The tool selected `[ko]` for each Indonesian file. It supports ko/ja/en/zh-hant, not id. All five returned exit 1; these are recorded failures of the required invocation, not a valid Indonesian-native assessment and not a claim of FAIL 0. No tooling was modified.

| ID | Shared tool output (ko fallback) | Root task-local ICU diagnostic, same hash |
|---|---|---|
| 664 | `sentences=52 cv=0.469 short=0.0`; FAIL `short_share` | 50 sentences; CV 0.453; short share 0.260; similar-length runs 0 |
| 665 | `sentences=50 cv=0.462 short=0.0`; FAIL `short_share` | 48 sentences; CV 0.451; short share 0.146; runs 0.065 |
| 666 | `sentences=47 cv=0.484 short=0.0`; FAIL `short_share` | 45 sentences; CV 0.483; short share 0.222; runs 0.047 |
| 667 | `sentences=55 cv=0.525 short=0.0`; FAIL `short_share` | 53 sentences; CV 0.508; short share 0.208; runs 0.020 |
| 668 | `sentences=55 cv=0.397 short=0.0`; FAIL `len_cv`, `short_share` | 53 sentences; CV 0.421; short share 0.208; runs 0.098 |

ICU values from `work/checks/content-audit.json` are diagnostics only. The review did not convert an unsupported Korean measurement into a native PASS. In 668 the relatively even legal sentences are an actual reading signal, addressed narrowly through IDs 03–05; final diagnostics should be rerun after repair.

1. Required CLI evidence is above; supported-language limitation remains disclosed.
2. No stock hypothetical opening; the five opening functions differ as stated above. IDs 01/05 remove real repetition rather than manufacture a new scene.
3. Every article contains at least two genuinely short Indonesian sentences: 664 “Beri penjelasan apa adanya.” / “Gunakan mata uang asli dalam dokumen.”; 665 “Simpan jawabannya.” / “Minta tanda terima atau konfirmasi tertulis.”; 666 “Riwayat percakapan dapat menjelaskan urutannya.” / “Peran dan unsur kesalahannya harus diperiksa.”; 667 “Pertolongan medis didahulukan.” / “Simpan permintaan tersebut.”; 668 “Kesengajaan tersebut membutuhkan bukti.” / “Batas lima tahun tetap ada.”
4. Paragraph starts were read vertically; no first word occurs more than twice in an article. The ICU diagnostic also reports no repeated-paragraph-opener flags.
5. No run of three claim–citation–caveat paragraphs. There are uncited practical evidence paragraphs in every article. Official citations move between sentence subject, mid-sentence provision and combined references.
6. No repeated decorative “bukan X, melainkan Y” formula. Necessary negative statements concern genuine scope issues: household care versus factory rights, retention versus fee disputes, account provision versus crime elements, separate insurance coverage, and foreign-supplier governing law. Do not delete these to improve a score.
7. Substantive endings concern the particular matter's records. There is no promised result, fear-based sales message or copy-pasted “our firm can help” ending.
8. Professional Indonesian register is consistent. No bold, invented first-person experience, public human/AI byline or checklist-style imperative heading was found. Practical safety instructions in prose are justified by the task.
9. This reviewer made no manuscript changes. Proposed repairs explicitly retain numbers, triggers, links and exceptions; ID-02 and ID-03 are marked as substantive corrections/clarifications.

## Legal meaning, sources, FAQ and CTA checks

- 664: household-care exclusion remains distinct from contractual pay. Article 486 fallback due dates, current foreign-worker §66, five-year record retention, direct cash/default and evidenced other payment methods, administrative payment order and transfer approval are not conflated. The reviewer opened current §66 and confirmed the stated language/record/payment components. FAQs match the body and do not promise factory overtime to every caregiver.
- 665: agency §40(1)(10) and employer §57(8) are separated. The reviewer opened §40 and confirmed the cited agency document rule and fee prohibition. Temporary consensual processing custody is distinguished from retention against the worker's wishes. Indonesia-side fees are not treated as automatically governed by Taiwan law. The transfer caution matches the article scope; FAQ 3 is appropriately limited.
- 666: §22 exceptions are retained, and criminal consideration, three-or-more and five-year-repeat branches are separated. The reviewer opened current §22 and identified ID-02; other criminal elements are not treated as automatic guilt. The interpreter provision is framed as a right when the language is not understood, not a guarantee that the firm speaks Indonesian. The new 666→664 same-locale link exists and has parent approval; no unrelated criminal translation was fabricated.
- 667: the reviewer opened LSA §59 and insurance §§36/90. The two-year medical-treatment condition, designated-hospital finding, loss of original-work capacity, failure to meet the specified disability standard, forty months of average wages and employer's optional lump-sum settlement of that wage-compensation obligation are retained together. Original wages and average wages are not interchangeable. Article 90 is summarized as conditional coordination, not a blanket subtraction of every payment. The employer no-fault defense and separate two-/five-year starting points remain explicit. FAQs preserve the difference between LSA exclusion and insurance coverage.
- 668: current §§354/365 were opened. Immediate inspection/notice, latent-defect notice, deliberate-concealment qualifications, remote-delivery storage/evidence conditions, rebuttable presumption, unfair-rescission limit, generic-goods replacement, and six-month/five-year distinction are preserved. ID-03 clarifies §354's internal scope. No six-month permission to delay first notice or automatic tolling through repair discussions is offered. Taiwan-law sales and Indonesia-side matters are separated.
- All five have three FAQ entries, 2026-10-23 article/source dates, `audience: ["id"]`, internal `author: "legal-ai-assistant"`, appropriately localized titles and no body H1. Sources cited in body have matching end entries. The source list uses actual legal references rather than invented precedents. Source date alone is not treated as independent legal verification.
- CTA occurs once per article and uses `/id/contact` plus `wei@hoveringlaw.com.tw`. The four available consultation languages are EN/ZH/JA/KO; Indonesian arrangements require confirmation. Initial information is limited, with sensitive documents deferred. No retainer, interpreter availability or result is promised. Image captions describe illustrations rather than actual evidence; this locale review did not independently rerender or authenticate image files.

## Remaining evidence limits and next repair

This review read the research ledger and author report but did not independently reopen every external source, history record, contact page or image. Official spot checks above were opened on 2026-10-23; the broader final legal reviewer must verify the complete claim/source set and current commencement. Local source comparison does not establish current public inventory. Browser layout, URL behavior, build, source integration and publication are outside this review.

Next bounded step: author applies ID-01 through ID-05 only, preserving all other text unless affected by the corrections; optional counsel terminology may be incorporated. Return changed files and hashes for this reviewer to recheck the repaired passages and affected FAQ/conclusions. No new articles or global revisions are requested.

## Bounded repair recheck — final locale verdict

Date: 2026-10-23. Same independent reviewer; no manuscript edits. Read the actual repaired 664/666/668 passages, their two opening paragraphs, FAQs, legal transitions, conclusions and source lists, and checked all five hashes directly with Python `hashlib.sha256`. Read the author's repair record at `work/id-author.md` from its “R1 bounded repair” section through the superseding 666 hash. This section supersedes the original verdict table for the versions listed here.

| File | Final locale verdict | Verified SHA-256 |
|---|---|---|
| `664-indonesian-home-caregiver-unpaid-wages-taiwan.md` | PASS | `0df3ccf6a3f2ecbe7ec13ba26632bdec046cdbc54b562c01916ea29be1becba3` |
| `665-indonesian-worker-passport-broker-dispute-taiwan.md` | PASS; unchanged from R1 | `4cc7e579386fa75545b26b03b6d4a694082ee14b89a5d6896b32b69c58a051d2` |
| `666-indonesian-worker-bank-account-cash-job-police-taiwan.md` | PASS | `1dc2f41c0b69574a9fe64696db98192ebfb1edf5d1471ee2a956f92b42740c26` |
| `667-indonesian-factory-worker-injury-evidence-compensation-taiwan.md` | PASS; unchanged from R1 | `ab6d157e543d01a68ca6ec8c6f8c026664aab19db10ad6c22319161849b062b5` |
| `668-indonesian-buyer-taiwan-machinery-defect-notice.md` | PASS | `73cd670bde83eb90f3d282eea4496505b97f9bbca5b47c73dab940c6204a2018` |

Repair resolution:

- ID-01, 664:26 — RESOLVED. The redundant first sentence is deleted. The opening now states the linked MOL exclusion and agreed-wage basis, then the actual contract/version inquiry. Civil Code §486 and the institutional-care qualification remain. FAQ 1 does not become a universal statutory-overtime promise.
- ID-02, 666:32–36 — RESOLVED. “Menetapkan peringatan” now states §22(2)'s prescribed warning. The text says total accounts “tiga atau lebih”, identifies the §22(2)/(4) warning for the five-year repeat branch, and preserves §22(4)'s additional warning for consideration or three-or-more cases. The penalty paragraph is distinct; no warning-only or automatic-conviction claim is introduced. The three FAQ answers remain consistent.
- The author expanded the account categories during ID-02. Recheck identified one narrow issue in that addition: “rekening bank” was narrower than the statute's financial-institution accounts. The author then changed only that phrase to “rekening pada lembaga keuangan”. This was directly reread at 666:32 and checked against the already opened [AML §22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0380131&flno=22). The final hash above includes this correction; earlier interim hash `1020ede341a97736a1548af2801e9a739b03233035cf9789cf4f042e193c6376` is not certified. Virtual-asset/third-party-payment accounts and proper-reason exceptions remain explicit. The optional “menunjuk penasihat hukum” at 666:52 preserves the counsel right in natural Indonesian.
- ID-03, 668:34 — RESOLVED. The insignificant-diminution exception is expressly limited to value/use in paragraph 1; promised quality is separately assigned to paragraph 2, with the risk-transfer time retained. This matches the internal structure of the already opened [Civil Code §354](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354). No promised-quality exception was invented.
- ID-04, 668:56 — RESOLVED. “Simpan bukti biaya perbaikan dan catatan berhenti produksi” names evidence, and the next sentence states that a defect does not itself make the seller responsible for every damages claim from the buyer's customers. The author expressly confirmed that intended meaning. §§360/227 and their links remain; neither automatic recovery nor a blanket exclusion of consequential loss is asserted.
- ID-05, 668:26 — RESOLVED. The §365 citation is integrated into the actual deadline proposition. “Salah satu”, Taiwan-law sales scope, the later five-year end point and deliberate-concealment qualification remain. The second paragraph still supplies governing-law and transaction-classification limits; the FAQ still distinguishes notice from exercise of rescission.

The remaining prose does not warrant another style-repair loop. Deletion tests on the new openings no longer find the two reported repetitions. The revised legal paragraphs use distinct subjects, and 666 separates conduct/administrative warning from penalties. Every article still has the short Indonesian sentences identified above, concrete evidence guidance and an article-specific substantive final sentence. No legal condition, figure, date, source link, internal author token or truthful communication-language qualification was removed.

The exact required variety command was rerun by this reviewer on the three changed final files. Results remain unsupported `[ko]` fallback results:

| ID | Actual command exit and final output |
|---|---|
| 664 | exit 1; `sentences=51 cv=0.474 short=0.0 run3=0.02`; FAIL `short_share` |
| 666 | exit 1; `sentences=48 cv=0.517 short=0.0 run3=0.0`; FAIL `short_share` |
| 668 | exit 1; `sentences=56 cv=0.388 short=0.0 run3=0.13`; FAIL `len_cv`, `short_share` |

The old ICU diagnostics above refer to the old hashes and are not relabeled as final measurements. The final PASS is an independent reading/meaning verdict, not a claim that the shared script supports Indonesian or that automated FAIL 0 was achieved. Those tooling and broader legal/live-verification limits remain as disclosed above. The five final hashes can now proceed to independent final legal review and root integration checks; this does not authorize or establish publication.
