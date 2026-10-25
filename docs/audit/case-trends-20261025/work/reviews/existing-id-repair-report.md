# Indonesian 668 — bounded style repair

Date: 2026-10-25. Author: `/root/repair_existing_id`, AI editorial repair role. Independent reviewer: `/root/recheck_market_changes`. No human native-speaker or lawyer review is claimed. No commit or publication was performed.

Owned manuscript: `repo/src/content/columns-id/668-indonesian-buyer-taiwan-machinery-defect-notice.md`.

The assigned current manuscript, the full `a188e620→HEAD` diff, and the prior `market-id-independent.md` were read. The prior Article 356 substantive correction remains verbatim. This repair changes three prose passages and `lastmod` only. It retains the current version's other improvements.

## Frozen versions and bounded passes

- Assigned before SHA256: `a93789bd548ad3eec8923fc57ba384194b4f0a45d488b4a1f361e386ff11d709`.
- Frozen after SHA256: `75aca1f1bbce526d813c25ff639cb2439a864a9a03507f79583e34d646044196`.
- Base commit: `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`.
- Baseline actual CLI: CV .442, exit 1.
- Repair pass 1: opening simplified and observation/inference distinction separated; CV .446, exit 1. This failed version is preserved in `existing-id-repair-pass1.md` and its actual CLI output in `existing-id-repair-pass1-variety.txt`.
- Repair pass 2: legal-entity matching and delivery to the proper recipient separated; CV .456, exit 0, FAIL 0. No further prose pass is authorized under this repair assignment.

Actual command executed on the frozen manuscript:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-id/668-indonesian-buyer-taiwan-machinery-defect-notice.md --lang id
sentences=57 mean=14.2 cv=0.456 short=0.193 run3=0.036 opener_rep=0.0 cite_end=0.0 cite_para=0.667 contrast=0 caveat=0 q=2
OK — no variety limit violated
```

`git diff --check -- src/content/columns-id/668-indonesian-buyer-taiwan-machinery-defect-notice.md` returned exit 0.

## Changes and preservation

| Location | Before | After | Reason and retained meaning |
|---|---|---|---|
| Opening paragraph, second sentence | Bagi pembeli mesin di Indonesia, artinya, selama diskusi panjang dengan teknisi pemasok berlangsung, tanggal dan langkah hukum yang sudah diambil tetap perlu dipantau. | Selama berdiskusi dengan teknisi pemasok, pembeli mesin di Indonesia tetap perlu memantau tanggal dan langkah hukum yang sudah diambil. | Removes the interrupting `artinya` explanation and places the buyer as the actor. Retains the Indonesian buyer, ongoing supplier-technician discussion, dates and legal steps already taken. It does not change or restate the statutory period in the preceding sentence. |
| Seller identification paragraph | Nama badan hukum pada pesanan, faktur, dan kontrak perlu dicocokkan, karena pemberitahuan harus sampai kepada pihak yang tepat. | Nama badan hukum pada pesanan, faktur, dan kontrak perlu dicocokkan. Pemberitahuan harus sampai kepada pihak yang tepat. | Restores two meaningful practical steps: matching the legal entity across documents and reaching the proper notice recipient. Keeps all three document types and the same modal strength. No additional claim or repetition. |
| Initial notice paragraph | Pemberitahuan awal dapat memuat nomor mesin, nomor pesanan, tanggal penerimaan dan penemuan, gejala, serta hasil uji yang sudah ada, dengan pengamatan dipisahkan dari dugaan. | Pemberitahuan awal dapat memuat nomor mesin, nomor pesanan, tanggal penerimaan dan penemuan, gejala, serta hasil uji yang sudah ada. Pisahkan hasil pengamatan dari dugaan. | The long contents list no longer buries the evidence distinction in a closing passive clause. Keeps every listed item and the existing advice to distinguish observation from inference. No new legal duty is asserted. |

The frontmatter is byte-for-byte unchanged except `lastmod: "2026-10-24"` → `"2026-10-25"`. In particular, publication date, title, summary, author, FAQ, image path, alt and caption remain unchanged. All 28 Markdown URL occurrences retain their order. All 77 body numeric tokens retain their order, as do the worded periods `enam bulan` and `lima tahun`. All headings and sources remain unchanged. The full minimal diff is `existing-id-repair.diff`; machine-readable checks are in `existing-id-repair-manifest.json`.

## Opening deletion test and current same-locale comparison

Opening paragraph: removing the first sentence would lose the six-month rights-exercise premise and Taiwan-sales-law scope. Removing the second would lose the buyer's immediate practical task while technical discussions continue. Its content remains useful after the wording repair.

Second paragraph: the supplier's Taiwan address, party choice/closest connection, sale-versus-design/installation classification and scope sentence each prevent a distinct overgeneralization. No sentence can be deleted without losing a material boundary. It remains unchanged.

Read and compared the actual openings, headings and endings of the current three latest Indonesian files, all published 2026-10-24:

- `704-taiwan-arc-first-application.md`: starts with the first ARC deadline and ends with cardholder follow-up links.
- `705-taiwan-visa-residence-work-study-family.md`: starts with TAC's visitor scope; headings follow work, study and family; ends with documents and the next application route.
- `706-taiwan-arc-renewal-changes-reentry.md`: starts with employment ending despite the card's printed expiry; headings follow status/data/travel changes; ends with actual travel dates and the application file number.

668's numeric rights deadline serves a different buyer decision. Its headings follow testing, early notice, safe preservation and remedies; its closing returns to the machine's condition before replacement. No stock introduction or shared three-part checklist was inserted. This is a single-file repair, so no claim is made about the opening-type distribution of other ongoing batches.

## Section 5 self-check

1. Actual supported `--lang id` CLI: FAIL 0, as recorded above.
2. No stock fictional-scene opener. The legal deadline opener is retained for its operative content; comparison with the three current ARC articles is documented above.
3. At least two short sentences remain: `Kesengajaan tersebut membutuhkan bukti.`, `Batas lima tahun tetap ada.`, and the two newly separated practical statements. They carry distinct meaning. No punctuation trick or filler was added; long statutory explanations retain their conditions.
4. Read paragraph starts vertically. No word begins three prose paragraphs. CLI opener repetition is 0.
5. No three consecutive claim/citation/caveat blocks. Technical testing, initial notice content and safe component preservation provide practical paragraphs without legal-citation endings.
6. Contrast-template count is 0. No imaginary reader objection was introduced.
7. The last substantive paragraph ends with locating the initial condition record and the seller notice before another component is changed. The source/scope section is structural tail material. No sales promise was added.
8. Indonesian professional prose is maintained; no bold, fictional first-person authority, public byline or imperative checklist heading was added. KO/JA register rules are not applicable to this file.
9. URLs, numeric and worded periods, statutory strength, legal exceptions, FAQ and image fields are preserved as recorded in the manifest.

## Bounded source refresh and review limits

On 2026-10-25 the official current [Civil Code Article 356](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356) and [Article 365](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=365) were opened and read. Their displayed compilation cutoff is 2026-10-16. The database's future-effective warnings concern Articles 166-1 and 1223, not these two provisions. The existing prompt-notice/deemed-acceptance wording and six-month/five-year distinction were preserved. No substantive legal change was made and no comprehensive new legal audit is claimed.

Independent recheck was requested for the exact frozen SHA above. The repair author does not certify that independent result. Production/public image delivery and visual layout were outside this assignment. The parent owns integration, any repository `docs/audit` packaging and publication.
