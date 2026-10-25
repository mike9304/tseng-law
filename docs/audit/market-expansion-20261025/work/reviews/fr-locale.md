# Independent French locale review — final

Verdict: PASS for both frozen manuscripts below, after one bounded author repair. Reviewer: `/root/expand_locale_fr`; author: `/root/expand_author_fr`. The reviewer did not write or edit either article. This is an independent AI editorial review, not a claim of human native-speaker or licensed-lawyer review. Final legal review, integration and public publication verification are separate.

## Exact reviewed versions

| Article | Full source SHA-256 | Verdict | Actual original checker |
|---|---|---|---|
| `src/content/columns-fr/936-french-cosmetics-taiwan-pif-importer-handover.md` | `a24b1b5ef3d8925adb2d21d414c9ee7e906a0b764e0a2e79f19e2eeb0d35daf8` | PASS | exit 0; 54 sentences; CV .469; short .185; run3 .077; no variety limit violated |
| `src/content/columns-fr/937-french-wine-taiwan-online-orders-advertising.md` | `132e87abb6a25149cc00544a11e07aacdea61a9a3a18e142e14491e8b5a05a2b` | PASS | exit 0; 48 sentences; CV .453; short .104; run3 .130; no variety limit violated |

Actual independently executed commands and complete stdout are saved in `fr-locale-final-measurements.json`. The commands were `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute current article path> --lang fr`. Neither checker nor thresholds were changed. Current source hashes include frontmatter, dates, FAQs, alt and caption.

Read: the complete assigned manuscripts, required editorial rules/skill/review criteria, the France portions of `work/research/west-briefs.md`, actual same-language comparators, `fr-author.md`, `fr-author.json`, selected official-source captures in `fr-author-sources.json`, `fr-author-structure.json` and `work/images/fr-generation.json`. The final source versions and the repair diffs were read again in full.

## Findings resolved by the author

No unresolved material locale finding remains. After the author repair, both captions were normalized to `Scène fictive`. The reviewer detected the changed hashes, independently read the new captions, proved that reversing this one field exactly reproduces the reviewed prior hashes, and reran the original checker on the current files. `fr-locale-caption-normalization.json` records that separate integration change; no article body was changed. The original REQUEST_CHANGES record is retained in `fr-locale-r0.md/json`; exact initial sources and repair diffs are preserved under `fr-locale-936-r0-source.md`, `fr-locale-937-r0-source.md`, and `fr-locale-*-repair1.diff`.

- FR936-L1: removed the commas between each linked FAQ subject and its verb. Attribution is unchanged.
- FR936-L2: replaced the unnatural `calendrier … déployé` heading with `La dernière étape du calendrier PIF est entrée en vigueur`.
- FR936-L3: the parties now sign `l’accord de passation`, rather than signing an operation.
- FR936-M1 and FR937-M1: removed short opening recaps that repeated the immediately preceding legal rule. The useful rule, conditions and source remain.
- FR937-M2: removed the generic file-control instruction. The paragraph now identifies the actual per-format approval, archived versions and removal access. The short crop sentence describes a concrete failure instead of repeating a general instruction.
- FR937-F1: `Business France annonçait … pour le 19 mai 2026` now describes what the official event announcement establishes. It does not certify that the scheduled event took place or generated business.

The added PIF language sentences separate the translation duty from the accepted languages; both contain useful information already supported by article 3. The rewritten video sentence retains continuous display, and the audio sentence retains clear audibility. No period, threshold, mandatory warning, exception, source link or consultation limitation was lost. Author-internal interim metric failures are preserved in the author report; the independent PASS applies only to the final current hashes above.

## Opening deletion test

936, paragraph 1: removing the first sentence loses the new importer’s registration duty despite earlier registration of the same references. The remaining FAQ sentence gives the specific authority and attribution; its page is directly checked. The redundant third sentence from r0 is gone. Paragraph 2 adds the permission to reuse reports, the accuracy/completeness/traceability/product-match conditions, and the practical right-to-use/access issue. Deleting any of those distinct elements would weaken the decision.

937, paragraph 1: the question fixes online order followed by shop payment and collection. The answer supplies the authority’s rule covering collection and delivery. The recap from r0 is gone. Paragraph 2 identifies the French exporter’s advertising-to-order path and gives the national statutory basis. It does not confuse an online mention of a wine with an electronic sale.

These are different opening types: a regulatory consequence and a specific commercial question. Neither uses a stock fictional customer anecdote, an article preview or a generic trend introduction.

## Three recent French comparators

All three actual source files were read in full; each was published 24 October 2026. Their full hashes are in `fr-locale-comparators.json`.

| Source | Actual structure | Difference in this pair |
|---|---|---|
| `src/content/columns-fr/704-taiwan-arc-first-application.md` | Filing deadline first; ARC/work permission distinction; document and filing route sections. | 936 follows a change of importer and document rights/access; it does not reproduce an application checklist. |
| `src/content/columns-fr/705-taiwan-visa-residence-work-study-family.md` | Entry/residence question; different work, study and family categories. | 937 also uses a question, but one concrete online-order scenario leads into advertising classification and format review rather than categories of immigration status. |
| `src/content/columns-fr/706-taiwan-arc-renewal-changes-reentry.md` | Consequence of employment ending; moving address; deadline table; travel documents. | The new pair ends with a product-specific handover record or a campaign’s linked pages, without borrowing that deadline/table structure. |

Overlap reading also covered the relevant PIF/handover sections of French 011 and all of French 676. 936 narrows the old general entry/PIF material to a new importer’s registration, permissions to reuse reports, confidential data retrieval and post-termination retention; 676 is about termination, stocks and selling accounts. 937 addresses pre-launch promotion and acceptance of orders, rather than another distribution-exit article.

## Substantive section 5 check

1. The original shared French checker returned actual exit 0 / FAIL 0 for each final source. The qualitative review was not replaced by the metrics.
2. Distinct consequence/question openings; no stock hypothetical opener or fabricated customer.
3. Useful short sentences remain: 936 separates updating documents, translating French material and admitted languages; 937 gives the point at which a command is collected, the video-display duty and the crop failure. The rejected short recaps have not been replaced with new padding.
4. Paragraph starts were read vertically. The body does not form a sequence of three paragraphs with the same starting word; source-list entries are structural references, not prose openings.
5. Source placement varies. Practical handover and approval/access paragraphs are not falsely presented as statutory contract forms, and no three-paragraph claim/citation/caveat template repeats.
6. Legal distinctions are useful: regulatory duty versus contractual access, sale versus publicity, publicity versus information. No invented reader claim is refuted to create a rhetorical contrast.
7. The final substantive paragraphs end with each product’s dossier/version/access or the actual campaign and linked order path. They do not recap the whole article or end with a sales promise.
8. The complete French prose uses an appropriate business/legal register. Terms such as `bordereau de remise`, `donneur d’ordre`, `domaine`, `négociant`, `caviste` and `cuvée` fit the actual readers. No bold, invented experience, public byline or forced checklist heading appears.
9. Full repair diffs preserve the five-year trigger, exemption for the specified solid handmade soaps, product-match conditions, qualified signatory, separate importer registration, warning dimensions and continuous video/clear audio requirements. Only the event assertion was deliberately narrowed to the official announcement’s evidence.

## Source and jurisdiction checks within locale review

Actual official pages/PDF text were opened independently and saved in `fr-locale-official-source-evidence.json`. This includes [PIF regulations](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030098), [the TFDA PIF FAQ](https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f639179794512621908&iid=13384&type=3), [registration FAQ](https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f639219591977347651&type=4), [Taipei’s order guidance](https://dof.gov.taipei/News_Content.aspx?n=39A258CB8C1B2779&s=1EB2F8C0189F2E68&sms=87415A8B9CE81B16), [Taichung’s identity-check guidance](https://www.finance.taichung.gov.tw/1997524/post), [the warning rule](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0330012&flno=11), [Taipei advertising principles](https://laws.gov.taipei/law/LawSearch/LawArticleContent/FL046302), and [the Business France announcement](https://www.marketplace.businessfrance.fr/event/index/event/id/1271/).

936 retains truthfulness/completeness/traceability and fit to the actual product when reusing shared data. A European dossier is not automatically a compliant Taiwan dossier. Confidential information can be held remotely only with effective provision or access for the authority; rights to a commissioned report do not automatically transfer. The retention period starts the day after the last placement on the market, not termination of the distribution agreement.

937 preserves the distinction between the national electronic-order restriction and local advertising classification. Taipei’s information exceptions do not become an e-commerce permission. A check box or identity mechanism is not presented as sufficient for online alcohol sales. The article does not ban every online wine discussion, and does not export Taiwan rules into French law.

The author report notes occasional access failures for law history and successful alternative MOF history records; the independent final legal reviewer handles complete commencement/history review. This locale PASS does not substitute for that step. The independent current Taipei page capture shows a review stamp of 20 October 2026, while the author’s source note records an earlier 23 September stamp; the public article relies on neither stamp and accurately describes the guidance.

## Actual image inspection and metadata

| Image | SHA-256 | Visual result |
|---|---|---|
| `public/images/columns/936-market-expansion-20261025.webp` | `eb54eb0f61c4240d888211b3abaf0014dd58fb957272b8f995eb616d81615d0e` | PASS: three unbranded cosmetics, blank binders and storage drive in cool daylight. French alt matches. |
| `public/images/columns/937-market-expansion-20261025.webp` | `692aeed72862d76e9613a26706d495c92bc5323afb513e0c0250012eb67ab1df` | PASS: closed unlabeled wine bottles in a carton, blank dark tablet and empty shop. French alt matches. |

Both actual files were displayed and inspected. They are distinct fictional, non-identifying editorial scenes without readable documents, text, logos, flags, faces or purported court/regulatory evidence. Captions explicitly identify fictional scenes. Actual final file hashes match the author’s image-generation record.

Metadata uses 25 October 2026, `audience: [fr]`, internal `legal-ai-assistant`, localized reading-time text and three body-consistent FAQs. No duplicate leading H1 appears. The email occurs once per article. The current French contact guidance and English service-scope source were read: consultation is limited to English, Chinese, Korean and Japanese, with any other communication method to be confirmed. Both articles request non-confidential initial material, make no French-law/technical-testing promise and state that receipt does not accept a mandate.

## Limits

PASS is limited to the exact source and image hashes recorded above. No actual product file, relabeling operation or wine campaign was approved; no human native-speaker or attorney review is claimed. This review did not publish, inspect the live browser layout or verify public media delivery. Root owns publication and readback; a separate fresh final legal reviewer must bind the same current source hashes to this locale report.
