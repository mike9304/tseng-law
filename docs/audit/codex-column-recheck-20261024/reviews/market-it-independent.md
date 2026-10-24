# Italian market columns — independent recheck, 2026-10-24

Reviewer: `/root/market_review_it`, an AI editorial role; not the author of these manuscripts or their prior candidate corrections. No manuscript edits by this reviewer. Scope is 684–688 in `repo/src/content/columns-it/`; ARC and older comparator articles are outside mutation scope. Source and editorial review does not certify public deployment or human/native/lawyer review.

## Current verdict — R2 PASS, 2026-10-24

All five manuscripts PASS at the hashes below. IT-L1 and IT-S1–S3 are resolved. The R1 findings retained later in this report are historical. The independent reviewer re-read the repaired passages and affected conclusions, compared the complete current diff, and reran the actual shared CLI on all five. This is local editorial/legal-source readiness, not public deployment certification.

| Article | Latest independently reviewed SHA256 | Verdict |
|---|---|---|
| 684-italian-exporter-taiwan-unpaid-installation-balance.md | `daa13fc07060a428caa602bb3aed9713797e5eae650a9ccf31d785ea237e7755` | PASS |
| 685-italian-brand-taiwan-distributor-trademark-registration.md | `5bbd27208c8afe566ad63c4b1417ae9b40718736a44f5192336f9fd800518b3c` | PASS |
| 686-taiwan-oem-molds-design-files-handover.md | `4a6134359ae66e9dd30dfa1b6774cdc64579427868224774012b05997f7353b6` | PASS |
| 687-italy-resident-heir-taiwan-inheritance-renunciation-debts.md | `75a4733d9ec89446b122bebebcc63281e89312cf83bc94a3aba45289d6bbeca2` | PASS |
| 688-italian-business-visitor-taiwan-summons-interpreter-defense.md | `b0c866e001db2cf49f9011dd173d9b428359d86a68718ae195913f860d1029a3` | PASS |

- 686: deleted the three generic tails; the two-sentence inventory paragraph keeps the material/version/function and incomplete-versus-new-request distinction. The commercial-credit sentence remains within the Article 928/929 context. The short FAQ response now directly answers whether payment automatically gives all rights; it is not filler. Copyright Article 12's author/economic-rights/default/use distinctions, licensing restrictions, possession/retention conditions and all URLs remain.
- 688: the conditions are explicitly attached to the Taiwan legal-aid system (法律扶助), preserving general counsel-selection rights. The nationality-alone limitation remains. Interpretation, summons, refusal-to-testify, NT$30,000 ceiling and lawyer-presence exceptions were not altered.
- Actual R2 CLI: 684 CV .462, 685 .454, 686 .462, 687 .451, 688 .454; five exit 0 / zero FAIL. Complete output and URL/metadata checks: `market-it-support/recheck-r2.json`. No lost external URLs in any of the five.
- The current repair changed only 686/688; their `lastmod` is 2026-10-24 while `published` and `date_display` remain 23 October. 685/687 still carry the prior integrated candidate's 2026-10-23 `lastmod`; if root updates those metadata for the new release, only a new hash/metadata check is needed, not another prose rewrite.
- Images and opening/manual checks remain applicable: the repaired passages introduce no new generic warning, fake anecdote, misleading byline or promised service.

## Initial verdict (R1)

684 PASS; 685 PASS; 686 REQUEST_CHANGES; 687 PASS; 688 REQUEST_CHANGES. Image review passes for all five. A separate repair author is assigned 686 and 688 only; the latest-hash recheck will be appended below.

| Article | Reviewed SHA256 | Verdict |
|---|---|---|
| 684-italian-exporter-taiwan-unpaid-installation-balance.md | `daa13fc07060a428caa602bb3aed9713797e5eae650a9ccf31d785ea237e7755` | PASS |
| 685-italian-brand-taiwan-distributor-trademark-registration.md | `5bbd27208c8afe566ad63c4b1417ae9b40718736a44f5192336f9fd800518b3c` | PASS |
| 686-taiwan-oem-molds-design-files-handover.md | `1610512cf140b0f1dfc662e07e0c4b9fcdf853954870fbc587b7ec311d2957dc` | REQUEST_CHANGES |
| 687-italy-resident-heir-taiwan-inheritance-renunciation-debts.md | `75a4733d9ec89446b122bebebcc63281e89312cf83bc94a3aba45289d6bbeca2` | PASS |
| 688-italian-business-visitor-taiwan-summons-interpreter-defense.md | `b8151fd32065919b6ef9bd23feec236187bba6eae8fc440c89820af29659c82d` | REQUEST_CHANGES |

## Required bounded corrections

Line numbers refer to the above R1 hashes. No arbitrary rewrite is requested for 684, 685 or 687.

| ID / file:line | Exact wording | Reason and evidence | Proposed repair | Legal meaning preserved? |
|---|---|---|---|---|
| IT-L1 / 688:40 | “Per l’assistenza legale restano necessari i requisiti previsti dalla norma.” | The previous sentence is about the general right to choose counsel. In Italian, “assistenza legale” also means ordinary assistance by counsel, so the new condition is ambiguous. Article 95(1)(3) separately addresses 法律扶助 eligibility; Article 27 permits appointing counsel without that eligibility condition. | Identify the particular Taiwan legal-aid system, for example “L’accesso al sistema taiwanese di assistenza legale (法律扶助) richiede invece i requisiti previsti dalla norma.” Keep the following nationality-alone caveat, and general counsel rights unchanged. | Substantive scope clarification; not a change to the underlying law. |
| IT-S1 / 686:34 | “Non serve copiare l’intero archivio.” | MONOTONY: an unsupported short instruction interrupts a useful description of the missing-material inventory. It does not explain what is needed, and could be mistaken for advice against preserving copies. | Delete; keep the precise name/version/format/function/incomplete-versus-new-request discussion. | Yes; no law or proof duty removed. |
| IT-S2 / 686:52 | “È un punto da risolvere prima del ritiro.” | MONOTONY: the preceding sentences already identify ownership, possession and retention requirements. This generic tail adds no factual condition or next step. | Delete, or connect only if the author identifies an actual specific action already supported by the paragraph. | Yes. |
| IT-S3 / 686:62 | “Il pagamento non risolve tutto.” | MONOTONY: a slogan-like tail repeats the immediately preceding precise FAQ answer and the article’s payment-versus-rights distinction. | Delete; retain the protected subject matter, creator relationship and rights-agreement checks. | Yes. |

Source for IT-L1, opened live on 2026-10-24: [Criminal Procedure Article 95](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=95), [Article 27](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=27). The first separates choosing counsel from legal aid; the second includes suspects questioned by judicial police. Do not describe general representation as dependent on aid eligibility or promise free representation.

## Full manuscripts, baseline diff and preservation

Read all five complete current manuscripts, including frontmatter/FAQ, and `git diff 174454bd -- src/content/columns-it/68*.md`. The current integrated candidate changes 685–688, with 684 unchanged. 685 separates the corporate-identity check; 686 preserves the commissioned-work default and use permission while adjusting rhythm; 687 preserves limited liability and timing; 688 separates procedural labels and retains police/witness distinctions. `market-it-support/source-preservation-r1.json` records zero removed or added external URLs in all five compared with the published source commit. No public byline, bold markup, fabricated client anecdote or Italian-law/Italian-office claim appears in these five manuscripts.

## Opening deletion test

- 684, paragraphs at lines 26/28: the first sentence distinguishes acceptance proof from delivery; the next gives concrete payment triggers. The second paragraph identifies who signs and why engineer/client/distributor records differ, then ties chronological ordering to contested performance and admitted debt. Removing these loses a concrete decision input. Retain.
- 685, lines 26/28: the first sentence supplies the three-month period and its starting event; the next tells the affected brand owner which registration information determines that date. The second paragraph adds Latin/logotype/Chinese-name searching, ownership comparison, evidence fields and pending-versus-registered distinction. These add separate facts/actions. Retain.
- 686, lines 26/28: the opening question supplies the new-OEM decision, followed by the difference between contractual delivery and permitted uses. The PDF sentence makes the file-format gap concrete. The second paragraph enumerates different assets and the creator/owner/custodian/delivery-clause record for each. Retain.
- 687, lines 26/28: residence is rejected as the sole conflict-law factor, followed immediately by the governing nationality/time rule and information needed to apply it. The next paragraph gives the Taiwan-national local-assets exception and additional nationality/renvoi rules. The negative boundary sentence prevents extending this specific exception to every Italian heir. Retain.
- 688, lines 26/28: Chinese procedural labels are translated separately, followed by identifying data and linked summons provisions. The following paragraph explains the practical loss caused by translating both simply as “convocazione,” separates a police notice from other acts, and identifies the envelope/transmission as service evidence. The short envelope sentence has a concrete evidential function. Retain.

The five opening approaches differ: contractual payment trigger, numerical deadline, operational question, applicable-law boundary, and source-document terminology. They do not copy the “in this article” or invented-scene formula.

## Same-locale comparison

Compared the actual first two paragraphs, headings and endings of these three earlier Italian files, rather than using them as legal authorities:

| Comparator | Source date metadata | Specific comparison |
|---|---|---|
| `018-taiwan-semiconductor-market-entry.md` | `date_display: 17 settembre 2026`, `lastmod: 2026-10-07`; no `published` field | Long scenario setup and numbered imperative-style headings; the assigned market articles enter a narrower dispute directly and have subject-specific headings. 684–686 legitimately link its business-presence context, but do not repeat its broad entity-selection analysis. |
| `017-taiwan-logistics-business-setup.md` | `date_display: 13 settembre 2025`, `lastmod: 2026-10-07`; no `published` field | Uses “Questo articolo distingue…” and a broad licensing/transaction outline. New five omit that announcement and focus on actual documents/rights. |
| `016-taiwan-inheritance-custody-analysis.md` | `date_display: 13 settembre 2025`, `lastmod: 2026-10-11`; no `published` field | Broad family/guardianship overview with long verification introductions and a generic ending. 687 narrows to overseas renunciation timing/debt administration, ends on the evidence of awareness, and is not a duplicate. |

These are the three highest numbered pre-batch Italian files. Dates are reported exactly as source metadata, not asserted to be observed deployment dates. Older comparator byline text is not copied into the new batch; its renderer or broader cleanup is outside this assignment.

## Current official-law recheck

All sources below were opened directly with web tools on 2026-10-24. The repository's 23 October historical consultation dates remain intact; this report records this later independent check. The MOJ pages display a compilation cutoff of 2026-10-16. Pending-commencement warnings on the Civil Code concern Articles 166-1 and 1223; on the Trademark Act they concern Articles 68, 70 and 95–97; on the Copyright Act they concern Articles 91, 91-1, 98, 98-1, 100 and 117. Those pending provisions are not used to support the reviewed claims.

- 684: [conflict-law act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000007) Article 20 supports the express-choice/closest-connection boundary. Civil Code [229](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=229) and [264](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=264) support default/demand and simultaneous-performance defenses with prior-performance/good-faith limits. [127](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=127) and [130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130) support the relevant two-year claim categories and six-month litigation condition. CPC [509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509), [516](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=516), [519](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=519), [523](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523), [526](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526) confirm payment-order exclusions, the twenty-day objection, consequence within the disputed scope, attachment risk and proof/security requirements.
- 685: Trademark Act [30](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=30), [48](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=48), [58](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=58), [42](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=42), [6](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070001&flno=6) confirm prior use/knowledge/imitative intent/consent exception, three months from publication, five-year invalidation limit including Article 30(1)(12), bad-faith exception confined to (9)/(11), unrecorded transfer's third-party effect, and local representation requirement. No “all bad faith has no time limit” claim remains.
- 686: Copyright Act [12](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070017&flno=12), [37](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070017&flno=37) confirm commissioned-work defaults, commissioner use when economic rights remain with the contractor, uncertainty presumption and nonexclusive sublicensing consent. Civil Code [761](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=761), [767](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=767), [928](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=928), [929](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=929) confirm movable-property delivery alternatives, ownership recovery and commercial retention conditions. CPC [368](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=368) supports evidence preservation, not automatic mold recovery. No change to these conclusions is requested.
- 687: conflict-law [58](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=58) and the full Act Articles 2/6 support nationality at death, the Taiwan-national exception, multiple-nationality and renvoi caveats. Civil Code [1174](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1174), [1156](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1156), [1148](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1148), [1162-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1162-1), [1162-2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1162-2), [1163](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1163) distinguish three-month renunciation from extensible inventory filing and preserve limited-liability exceptions. Family Proceedings Act [127](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010048&flno=127) supports the domicile-at-opening court rule and referenced fallback rules. No Italy-law filing or authentication guarantee is stated.
- 688: CPP [95](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=95), [99](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=99), [27](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=27), [245](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=245) support counsel/silence/evidence rights, interpretation and qualified counsel-presence limitations. [181](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=181), [183](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=183) support specified refusal grounds and the substitute sworn declaration option. [75](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=75), [178](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=178), [196-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=196-1) confirm legally summoned defendant/witness consequences and distinguish the police witness notice. The NT$30,000 ceiling, court decision and justified-absence condition are preserved. IT-L1 is the only substantive wording clarification requested.

## Images and metadata

Each actual WebP was opened using `view_image`. No face, readable personal document, brand, official seal or flag is visible. All captions clearly describe imaginary scenes rather than actual cases; all alts match the depicted objects and do not contain author attribution.

| Article | Resolved local asset below `repo/public/` | Visual finding |
|---|---|---|
| 684 | `images/blog/354-unpaid-invoices-taiwan-buyer-payment-order-attachment/featured-01.webp` | Paper and pen on wood desk/tray, harbor outside. Matches alt. |
| 685 | `images/blog/265-taiwan-distributor-registered-japanese-brand-trademark/featured-01.webp` | Jars and boxes with blank labels on a wooden shelf. Matches alt. |
| 686 | `images/blog/gap-columns-20261010/505-taiwan-supplier-return-molds-test-fixtures.webp` | Metal mold and test fixture with protective packing on an industrial bench. Matches alt and mold handover topic. |
| 687 | `images/columns/20261003/us-inheritance-document-preparation-1600x900.webp` | Blue folder, sealed envelope, green blank booklet, pen. Matches alt; no US-specific visible identifier. |
| 688 | `images/blog/033-taiwan-police-questioning-foreigner-rights/featured-01.webp` | Table, two chairs, water glass and window in an empty room. Matches alt; not portrayed as an actual interrogation room. |

## Variety command and section 5 manual check

Actual command per file: `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute manuscript path>`. All five exit 0 / “OK — no variety limit violated”; full results saved in `market-it-support/variety-r1.json` and individual `.variety.txt` logs.

| ID | Sentences | CV | Short ratio | Same-length run ratio | Findings beyond metric |
|---|---:|---:|---:|---:|---|
| 684 | 43 | .462 | .116 | .000 | None blocking. |
| 685 | 45 | .454 | .200 | .000 | None blocking; short qualifications distinguish consent, nationality and proof of notoriety. |
| 686 | 47 | .450 | .170 | .044 | Three generic short tails above; metric PASS is insufficient. |
| 687 | 43 | .451 | .140 | .049 | None blocking. |
| 688 | 50 | .460 | .200 | .042 | Legal-aid ambiguity above; metric PASS is insufficient. |

Manual section 5: varied non-invented openings; at least two genuine short sentences per article; no repeated three-paragraph claim/citation/caveat template; citation-free practical paragraphs present; no repetitive contrast template or invented reader opposition; no bold or invented first-person narrative; closing substantive sentences return respectively to instalment dates, registration calendar, missing-material inventory, awareness message, and summons language/role. Numbers, legal strength and sources survived the candidate changes. 688 has no body question because this short procedural explanation uses the source-document labels directly and has three genuine FAQ questions; no forced rhetorical question is requested. Italian prose stays professional and readable; this is AI editorial review, not a native-human certification.

## Firm/contact and evidence limits

Consultation-language limits match current repository `src/lib/llms-txt.ts:661` (English, Chinese, Japanese, Korean) and contact email matches `src/lib/consultation/public-contact.ts:3`. No Italian-language service is promised. The web tool and ordinary curl first failed to load the live contact page. A subsequent normal HTTPS request with per-process DNS-over-HTTPS resolution and TLS verification returned HTTP 200. The actual `/it/contact` text confirms the same four consultation languages, warns that Italian-only communication requires an agreed channel, and displays `wei@hoveringlaw.com.tw`. Evidence: `market-it-support/contact-live.html` and `contact-readback.json`. Root's release-specific publication/public-readback audit remains necessary. This report certifies actual local manuscript/asset review and live official-law checks listed above, not every unrelated linked article's correctness, browser rendering, or deployment.

## Recheck ownership and completion

Separate repair agent `/root/market_review_it/market_it_repair` owns only 686/688 and its repair report. Published/date_display must stay 23 October; modified lastmod becomes 24 October. R2 above confirms exact latest hashes, repaired passages, affected conclusions, URL retention and actual CLI results. Root retains independent final legal review and publication responsibility.
