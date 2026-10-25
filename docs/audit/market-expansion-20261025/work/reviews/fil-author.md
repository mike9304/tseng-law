# FIL 926–927 author handoff

Date: 2026-10-25. Status: AUTHOR_READY_FOR_INDEPENDENT_REVIEW. This is an AI author's self-check, not an independent locale/legal approval or a claim of human or attorney review. The author did not commit, push, deploy or perform public readback.

## Frozen files

| Artifact | SHA-256 |
|---|---|
| `src/content/columns-fil/926-filipino-worker-taiwan-injury-resignation-settlement.md` | `633126ec40c4f821c37e30b2610aeb2598a7c7fcc3617033960719ae2cf1bfc5` |
| `src/content/columns-fil/927-filipino-worker-taiwan-loan-promissory-note-court-order.md` | `535d60328cbcbf44ff21363a0a47a506858c8d38a4203dc5037bbe82b145d2b9` |
| `public/images/columns/926-market-expansion-20261025.webp` | `8c3d5654ac2ce688d46c9baeb28c59c28ee243aeca9663a7ba29c62b636ecf2f` |
| `public/images/columns/927-market-expansion-20261025.webp` | `4dcf34091e9d67c2cc5ebb7845775e25cdab69ec4b22322947b7e2e81b2c0ca7` |

Paths in this table are relative to `/Users/son7/tseng-market-expansion-20261025/repo`. Metadata uses the assigned 2026-10-25 date. Root must recheck the publication date at release.

## Reader decision and market limits

926 helps a Filipino factory worker read resignation and settlement as two documents with different consequences. The settlement section appears first: which payment, medical period and future claim is released or reserved? It preserves the distinction between leaving employment, compensation limitation, post-insurance benefit eligibility and settlement validity. Public local labor mediation precedes private consultation.

927 helps a worker with a recruitment/migration-related loan identify a Taiwan court paper, the proper remedy and legal service date. It distinguishes the 10-day promissory-note appeal, the special forgery/alteration declaratory action and the 20-day payment-order objection. LAF materials and eligibility assessment precede private inquiry.

Read and cross-checked `work/research/sea-briefs.md`, `sea-market.md` and `sea-sources.json`. Worker/student connections justify an editorial experiment, not a forecast of clients or revenue. 927 remains exploratory: Tagalog search was weak and mixed with Cebuano or Philippine domestic-law results. No search-volume, conversion or willingness-to-pay claim appears in either article. LAF's 2017 historical material is not presented as a 2026 trend or a firm case.

926 does not reproduce VI039's hospitalized worker/lump-sum/repatriation opening or a three-compensation overview. Its opening and order turn on two document texts. 927 differs from JA719's business creditor and ZH164's unadvanced-loan debtor framing through worker paperwork and service analysis. The same statutes are not claimed to be original discoveries.

## Recent same-locale comparators

The complete three latest baseline FIL articles, all dated 2026-10-24, were read. Their hashes and detailed comparisons are in `fil-author.json`.

- `src/content/columns-fil/801-filipino-caregiver-taiwan-patient-died-transfer-employer.md`: a statute-led caregiver/employer-transfer article, followed by permits, leave, abuse and wages. 926's two-document question and settlement-first organization are different.
- `src/content/columns-fil/802-filipino-factory-worker-taiwan-overtime-deductions-broker-fee.md`: three issues behind one pay-slip figure, followed by overtime, deductions and broker fee. Neither new article copies its three-part opening or pay-slip structure.
- `src/content/columns-fil/803-filipino-worker-taiwan-reported-missing-overstay-surrender.md`: missing-worker reporting, permit/overstay consequences and surrender. Neither new article repeats this immigration narrative.

Opening deletion test: removing 926 paragraph 1 loses the survival of the compensation right and its LSA 61 source; its original repetitive third sentence was removed. Removing paragraph 2 loses the resignation/settlement distinction and Civil Code 737 effect. Removing 927 paragraph 1 loses identification of the two court procedures and their deadline provisions. Removing paragraph 2 loses preservation of the service envelope and matching to the pre-departure loan/note, including comparison of creditor identity.

## Actual measurement

The original shared command was run on each file with `--lang fil`. Both returned exit 2 with `invalid choice: 'fil'`. This is unsupported measurement, not PASS, and no English relabeling was used. Exact commands and raw output remain in `fil-author-original-variety.json`.

The task-local method was independently approved in `work/variety-review/review-final.md`. Its wrapper hash was rechecked as `44c287ea5f6e26b694881418acebf4c9c115b87b2a965ea0c10a43fb1830e2e5`; FIL profile hash `9bb87f92fde0d17ec521c2c7b22e40c6eeb272f0b53405d480f07a4b5886cd66`. It is a task-local heuristic, not new global support or proof of human-native prose.

Actual commands:

```text
python3 /Users/son7/tseng-market-expansion-20261025/work/variety-candidate/variety_metrics.py check /Users/son7/tseng-market-expansion-20261025/repo/src/content/columns-fil/926-filipino-worker-taiwan-injury-resignation-settlement.md --lang fil
python3 /Users/son7/tseng-market-expansion-20261025/work/variety-candidate/variety_metrics.py check /Users/son7/tseng-market-expansion-20261025/repo/src/content/columns-fil/927-filipino-worker-taiwan-loan-promissory-note-court-order.md --lang fil
```

Both exit 0, `OK — no variety limit violated`. Raw tool execution is retained in `fil-author-local-variety-initial.json`.

| File | Sentences | CV | Short share | Three-sentence run | Citation endings | Selected contrasts |
|---|---:|---:|---:|---:|---:|---:|
| 926 | 45 | .571 | .111 | .023 | .067 | 0 |
| 927 | 52 | .505 | .115 | .040 | .135 | 0 |

Every extracted sentence was read; `fil-author-extracted-sentences.json` binds the arrays to the frozen article hashes. No paragraph contains more than one sentence above 32 units. Native idiom and unmarked semantic contrasts still require independent review.

## Section 5 self-check

| Item | Result and evidence |
|---|---|
| 1. Real measurements | Original unsupported exit 2 separately retained; approved task-local FIL measurement exit 0/FAIL 0 on both exact hashes. |
| 2. Opening | No stock hypothetical. 926 starts with the surviving compensation right; 927 identifies court documents. Different openings within this pair; root checks whole-batch distribution. |
| 3. Sentence length | 926 has 5 short sentences out of 45; 927 has 6 out of 52. Long statutory conditions are intact. No paragraph has two long sentences. No filler was added to achieve scores. |
| 4. Paragraph starts | Maximum repeated opener is two: `kung`/`para` in 926, `kapag`/`kung` in 927. Read vertically against the extracted array. |
| 5. Citation rhythm | Sources appear as subjects, inline references and endings. No three successive claim-parenthesis-caveat paragraphs. Both include practical uncited document-comparison paragraphs. |
| 6. Contrasts | Selected detector count is 0 each, not an exhaustive semantic claim. Manually checked the necessary legal distinctions; no invented opposing assertion or repeated decorative X-not-Y framing. |
| 7. Ending | 926 ends with treatment/lost-wage periods and remaining claims; 927 with service timing despite an inquiry. No copied sales conclusion. |
| 8. Register and presentation | Professional Filipino with conventional English worker/legal terms. No bold, fabricated client story or first-person experience, imperative checklist headings, public byline or human-review claim. Korean/Japanese register provisions do not apply. |
| 9. Preservation | Rechecked statutory numbers, conditions, deadline origins, insurance offsets, security/stay exceptions, citations and fictional image captions after edits. No legal condition was cut for score. |

The fresh locale reader's preliminary comments were incorporated: `nililimitahan`, court `ibinasura`, natural wording for an inquiry reply, and explanation of limitation periods instead of unexplained `prescription`. Three generic filler lines were removed. The settlement section moved first and the public mediation path was added. The first task-local measurement then passed; there was no unsuccessful metric repair round.

## Legal sources and boundaries

The full source-open responses, including failures, are retained in `fil-author-source-opens.json`. The machine-readable handoff lists actual source references, status and verification date. This is not a list inferred from search snippets.

926: official current LSA 13/59/61 and scope in LawAll; occupational accident insurance 11/27/37/84/90; Civil Code 736–738; Labor-Management Disputes Act 9. Article 11 was actually read in official LawAll lines 132–134 after its single-article route failed. Article 84 follows current MOJ wording about an accredited hospital and disability after treatment, not older BLI wording. Two-year compensation limitation is not insurance limitation; one-year post-insurance eligibility and five-year benefit claims period remain separate. Resignation does not automatically erase a claim, and that does not render every settlement ineffective.

927: CPC 137–138, 161–162, 512, 516, 519, 521; NCA 31, 42–43, 195; Negotiable Instruments Act 123; Civil Code 120/122. All consequential deadlines retain legal service as their starting event. The special 20-day NCA 195 action concerns alleged forgery/alteration, not every loan dispute. Its stay and counter-security structure is distinct from discretionary security-conditioned stays in other cases.

The official full [Taipei District Court 115抗306, 3 July 2026](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=TPDV%2C115%2C%E6%8A%97%2C306%2C20260703%2C1) printData response was read and preserved separately as `fil-author-judgment-115-306.txt` (all 50 source lines) and in source responses[10]. Financing shortfall is stated as the appellants' allegation; this is an appeal dismissal about the formal proceeding, not a finding resolving all loan facts. Failed opens of an older Shilin case are not relied on.

Current [LAF Filipino materials](https://www.laf.org.tw/foreign/4) and [eligibility rules](https://www.laf.org.tw/en/service-laywer-des) were opened. Applying and eligibility review are not guaranteed approval. The private consultation language statement follows actual service data: English, Chinese, Korean and Japanese; Filipino communication method must be confirmed. Email receipt does not accept a retainer. Philippine loan/recruitment law is not presented as Taiwan law.

Current MOJ pages and relevant history pages were checked on 2026-10-25. MOJ's compilation footer is 2026-10-16, so this is not a claim of same-day exhaustive legislative coverage. Uncommenced Civil Code provisions noted in history are unrelated to cited settlement/period articles. Per-open exact timestamps were not exposed; the source evidence separates verification date from serialization time.

## Images and metadata

Two separate native `image_gen.imagegen` calls produced distinct fictional scenes. 926 shows a factory rest bench, work clothing/gloves and wrist support; 927 a modest apartment table with plain envelopes/papers. Both the native originals and final 1536×1024 WebPs were actually viewed. No faces, readable text, marks, flags, ID, genuine medical/court records or fake court evidence appear. Prompts, original paths/hashes and inspection evidence are in `work/images/fil-generation.json`. WebP conversion only changed format.

`fil-author-metadata.json` records parsed frontmatter, dates, locale, internal author, FAQ count, no bold/leading H1, one email, image existence and fictional captions; all checks passed with the existing repository `gray-matter` dependency. The first Python attempt failed because PyYAML is unavailable; that error is retained, and no dependency was installed. A repository build and live page QA remain root-owned.

Independent locale and final legal reviewers must bind their own verdicts to these exact hashes. Do not reuse an approval after later manuscript changes.

## Caption-only integration rebind

Root normalized both captions to the existing repository exact label `Kathang-isip na eksena`. The author preserved this change. Substituting each prior caption in memory reconstructed the complete prior manuscript SHA exactly, proving no other byte changed; body hashes are recorded in `fil-author-caption-rebind.json`, alongside root evidence `work/checks/caption-normalization.json`. The earlier author records are preserved as `fil-author-before-caption.md/json` and corresponding metadata/sentence snapshots.

Both original and task-local CLIs were actually rerun on the new full hashes: original exit 2 unsupported, task-local exit 0 with unchanged scores. Current exact-hash execution evidence is `fil-author-variety-after-caption.json`; the original initial runs remain historical evidence. The frozen-file table above now identifies the canonical-caption manuscripts.
