# Czech independent locale review — PASS

Reviewer: `/root/expand_locale_cs`, independent of `/root/expand_author_cs`. This is AI editorial review, not a claim of human native-speaker or licensed-lawyer review. Both manuscripts were read in full, including metadata, three FAQs, alt/caption, source list and ending. No manuscript or image edits were made by this reviewer. All eight initial findings were resolved in one author repair. No material locale finding remains.

## Exact reviewed versions

| Source path | Full-source SHA-256 | Verdict |
|---|---|---|
| `src/content/columns-cs/942-czech-supplier-taiwan-email-purchase-order-contract.md` | `b24786be986f1f9660c9fce10c830137156646755991d85215d4e96836fb1cef` | PASS |
| `src/content/columns-cs/943-czech-exhibitor-taiwan-patent-disclosure-priority.md` | `46c094fc25bee60eaddd867007b905a44a89c2c1dbb77ab9dda8cd5a5837fe91` | PASS |

Initial exact sentence/reason/rewrite/meaning-preservation findings are preserved in `cs-locale-r0.md/json`. The author applied `cs-author-repair1.json`. Independent reverse reconstruction reproduced the original source hashes and verified every link target and numeral token remained in order (`cs-locale-repair1-integrity.json`).

942 now distinguishes required written form from a document, explains the signing presumption, requests the identifier of the disputed order version rather than a confidential document, and removes a redundant choice-of-law preview. 943 uses product designation rather than a business-name term, states after-priority chronology directly, removes an unnatural reflexive construction and requests a description without confidential information. Complete repaired files and affected FAQs/conclusions were re-read. No deadline, exception, legal burden or service promise was changed.

Two later integration changes were independently checked before final binding: 943's unsupported `topic: ip` became `company`, which the reviewer verified in `src/lib/column-topics.ts`; both image captions became the site's canonical Czech label `Smyšlená scéna`. Reverse substitutions reproduced the previously reviewed full-file hashes exactly. Bodies, images and other metadata are unchanged; all 88 extracted sentences remain identical. Records: `cs-locale-topic-rebind.json` and `cs-locale-caption-rebind.json`. The final original/shared and task-local commands were re-run on the current source hashes above.

## Three recent Czech comparators

The following actual current sources are all published 2026-10-24. The metadata inventory confirms these are the three latest prior Czech columns. Their opening, body structure, headings and ending were compared.

| Comparator | Observed structure | Difference from the new pair |
|---|---|---|
| `src/content/columns-cs/873-czech-company-taiwan-subsidiary-branch-office.md` | Asks which entity takes an order; covers entity choice, investment, capital and taxation; ends with supplier/signatory identification. | 942 examines assent and version history of one supply contract, rather than company formation. Its offer/form/signature progression is distinct. |
| `src/content/columns-cs/874-czech-working-holiday-taiwan-work-limits.md` | Opens with age 26 and the six-month work limit; separates work, insurance, stay and tax; ends with two calendar dates. | 943 also uses numbers but compares two equal 12-month clocks, technical disclosures and legal effects, rather than immigration eligibility. |
| `src/content/columns-cs/875-czech-buyer-taiwan-defective-machine-claim.md` | Explicitly modelled acceptance-test problem, evidence before adjustment, defect notice, remedies and deadlines; ends with original data/test piece. | 942 changes both transaction side and stage: Czech supplier and formation rather than Czech buyer and post-delivery defects. 943 concerns pre-filing technical disclosure. |

The new pair uses distinct structures: assent → reserved form → electronic signature/evidence, and disclosure → priority → exhibition records. Their final actions concern different documents. Shared truthful language/no-retainer statements are necessary service boundaries. Neither invents a client event or successful outcome.

## Opening-deletion test

942 paragraph 1: sentence 1 supplies the cancellation consequence of the missing signature; sentence 2 supplies Article 153, express/implied agreement and the Taiwan-law condition; sentence 3 explains fragmented email/conduct evidence. Deleting any loses specific information.

942 paragraph 2: the original preview that applicable law must be identified was deleted. The remaining Article 20 sentence supplies choice/closest connection. The scope sentence prevents a Taiwan sender/address from implying automatic Taiwan-law applicability. Retain both.

943 paragraph 1: sentence 1 identifies equal periods with different triggers; sentence 2 supplies the official non-aggregation rule; sentence 3 applies it to the first filing after an exhibition. Deleting the third loses the concrete calendar mistake addressed.

943 paragraph 2: sentence 1 makes disclosed technical content the factual issue; sentence 2 distinguishes photographs, technical sheets and operating videos; sentence 3 ties dates to versions and preserves earlier web disclosure. None is generic throat-clearing.

## Actual measurement and section 5

The original shared CLI was independently run: `cs` is unsupported, exit 2, not PASS. Both original and current-source evidence remain in `cs-locale-original-variety.json` and `cs-locale-final-original-variety.json`.

The independently approved guarded wrapper was run on both current files using the actual commands below:

```text
python3 /Users/son7/tseng-market-expansion-20261025/work/variety-candidate/variety_metrics.py check /Users/son7/tseng-market-expansion-20261025/repo/src/content/columns-cs/942-czech-supplier-taiwan-email-purchase-order-contract.md --lang cs
[cs] sentences=44 mean=15.0 cv=0.455 short=0.159 run3=0.024 opener_rep=0.067 cite_end=0.0 cite_para=0.667 contrast=0 caveat=0 q=1
OK — no variety limit violated
exit 0

python3 /Users/son7/tseng-market-expansion-20261025/work/variety-candidate/variety_metrics.py check /Users/son7/tseng-market-expansion-20261025/repo/src/content/columns-cs/943-czech-exhibitor-taiwan-patent-disclosure-priority.md --lang cs
[cs] sentences=44 mean=14.8 cv=0.456 short=0.205 run3=0.024 opener_rep=0.062 cite_end=0.0 cite_para=0.25 contrast=0 caveat=0 q=1
OK — no variety limit violated
exit 0
```

Both actual outputs retain `OFFICIAL CHECKER: cs unsupported (exit 2; not a measured PASS)` and label the task-local scope. Full stdout/stderr and source SHAs: `cs-locale-approved-variety.json`. Wrapper SHA: `44c287ea5f6e26b694881418acebf4c9c115b87b2a965ea0c10a43fb1830e2e5`. Independent method report: `work/variety-review/review-final.json`, SHA `f0cfcfea6e841dd0ed59df3b2727fd74bb236604d0991e124b88bceb12c3659c`. The reviewer read the method and its independent review. The shared checker was not changed or installed.

All 88 actual extracted sentences were displayed and read with paragraph position and word count (`cs-locale-extracted-sentences.json`). Quotes, PO/PDF/WTO, inline link labels and the email address did not cause spurious boundaries. Frontmatter, headings, the table and sources are outside the metric scope but were independently read. Orthographic counts do not claim calibrated semantic equivalence across languages.

1. Zero HARD failures for both exact current sources under the approved task-local method. Original unsupported results remain distinct.
2. No stock hypothetical opener. 942 begins with the signature/cancellation issue; 943 with two numeric clocks. Within this reviewed pair neither type exceeds half. No claim about the entire multilingual batch.
3. At least two useful short sentences each: 942 “Datum souboru samo nestačí.” and “Původní zprávy uchovejte včetně hlaviček.”; 943 “Samotné zveřejnění dřívější pořadí nezajistí.” and “Chybějící datum označte jako nezjištěné.” No filler. Extraction shows no paragraph with two sentences at or above 32 units; 942's long contact sentence is followed by a shorter service-boundary sentence.
4. Openers were read vertically: no first word occurs three times. “Článek” occurs twice in each article among practical-record, question, actor/action and consequence openings. Consecutive same starts stay within the rule.
5. No three consecutive claim/citation/caveat paragraphs. Both have practical evidence paragraphs without new statutory claims. Legal propositions retain their sources.
6. Manual contrast review is separate from the tool's zero count. 942's “nikoli” distinctions preserve Taiwan-law scope and the limited presumption; receipt/acceptance and identity/authority distinctions are substantive. 943's disclosure/priority distinction explains the different clocks and effects. No repetitive ornamental not-X-but-Y formula or rebuttal of invented reader claims remains.
7. Last substantive paragraphs concern who accepted which offer and what still needed consent (942), and comparing the next presentation with filed/public versions (943). No sales recap.
8. Professional Czech throughout. Actual checks: three FAQs each, bold zero, duplicate H1 zero, email once each, supported `company` topic. No fabricated personal/client history, public authorship, phone/LINE, reply-time promise or guaranteed result.
9. Re-reading and reconstruction preserve citations, numbers, 12/16-month clocks and triggers, patent-gazette exception, certificate approval/validity/scope and Taiwan/invention-patent limits. No Czech/EU legal conclusion was added for style.

## Actual images

942 WebP SHA: `fbe6798bf66fccdd74d1cf80421188c1da0fb122de6f0ad77625bf4491f46543`. Viewed actual 1536×1024 file: closed laptop, blank sheets, folder, pen and machined parts on a supplier desk. Alt matches.

943 WebP SHA: `d28c66a04807a5d524c06bd2ee1912a2c23b5bc60a6ebeaa8c6baec5c2ec35d0`. Viewed actual 1536×1024 file: generic mechanical prototype under a transparent cover, open transport case and exhibition hall. Alt matches.

Both current captions read `Smyšlená scéna`, accurately identifying fiction. Images are distinct in setting, framing, objects and color, with no readable text, faces, logos, flags, identity documents or apparent case evidence. Hashes were independently recomputed in `cs-locale-content-checks.json`.

## Sources, service and limits

The locale reviewer directly opened [Electronic Signatures Act 5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=5), [6](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=6), [Patent Act 28](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070007&flno=28) and [29](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070007&flno=29) for terminology and conditions (`cs-locale-opened-sources.json`). This limited check does not replace final review of all law and commencement/history.

The official [Czech SEMICON Taiwan report](https://mzv.gov.cz/taipei/cz/obcho_a_ekonomika/rostouci_stopa_ceske_republiky_v.html) was opened. Its 11 September 2026 date, academic/industrial delegation and IC design/packaging/material discussions support 943's factual paragraph. It does not establish search volume or client demand; neither is claimed. Capture: `cs-locale-market-source.json`.

The author ledger and current `src/data/international-inquiry-copy.ts` / `src/data/en-service-scope.ts` were read. Consultations remain English, Chinese, Japanese and Korean; no Czech-language promise. First contact excludes confidential attachments/drawings, requires scope/method confirmation and does not automatically create representation. Taiwan-law scope is express. The patent article leaves Czech/EU patent survival to separate assessment.

No unresolved material locale issue remains. A fresh final legal reviewer must bind these exact article SHAs and this locale-report SHA. This review does not certify deployment, browser layout or legal services.
