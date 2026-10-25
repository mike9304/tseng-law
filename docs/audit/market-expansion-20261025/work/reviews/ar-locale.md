# Independent Arabic locale review — 930–931

Verdict: PASS for the exact final files below. Reviewer: `/root/expand_locale_ar`, an AI editorial reviewer independent of `/root/expand_author_ar`. I did not author or modify either manuscript. This is a locale review for the separate final legal reviewer; it is not publication evidence or a human/native-speaker/licensed-lawyer certification.

| Source file | Final full-file SHA-256 | Verdict |
|---|---|---|
| `src/content/columns-ar/930-uae-taiwan-shipment-rerouting-hardship.md` | `91a77cfc009bd425c4c1244832494e272284441bf06f0bfae013583ff8b328ce` | PASS after one terminology repair |
| `src/content/columns-ar/931-saudi-supplier-taiwan-distributor-resale-prices.md` | `24332b5c2d46a686ed3f4635bd16d418631d2cd6d1403d0c4d7ac82b355fa431` | PASS; metadata taxonomy repaired at final review |

## Material finding and resolved repair

| File:line | Exact span | Reason/evidence | Author-applied rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| `930-uae-taiwan-shipment-rerouting-hardship.md:46` | `حكم المحكمة العليا المدنية رقم` | The feminine adjective grammatically qualifies the court. The official source identifies the Supreme Court and its civil judgment, not a separate Civil Supreme Court. | `الحكم المدني للمحكمة العليا رقم` | Yes. Case number, date, link, court identity, remand and reasoning remain unchanged. |

The separate final reviewer then found `931:10` used `topic: "business"`, outside `COLUMN_TOPICS` in `src/lib/column-topics.ts`. The author changed only that field to `topic: "company"`. I read the taxonomy and final field directly; restoring the old topic string reproduces the previously reviewed full-file hash, proving no body or other metadata changed. The original Arabic checker was rerun on the new full-file SHA and passed. This was a metadata repair, not an Arabic prose change.

I re-read the complete frozen 930 after this repair, including the FAQ and closing paragraphs, and reran the original Arabic checker. No unresolved material finding remains. I also re-read the complete frozen 931. No style repair was imposed merely to make the pair structurally alike.

An initial request to correct the author's paragraph-order description was withdrawn. The earlier draft read had the opposite order, but the frozen and final 930 have the contact paragraph at line 56 and the shipment-document closing paragraph at line 58. The author's description is correct for the reviewed file. The manuscript was not rearranged in response to that request.

## Actual recent Arabic comparisons

All three files below were read in full, not inferred from their titles. Their publication date is 2026-10-24.

| Comparator | Opening, organization and ending actually observed | Difference in this pair |
|---|---|---|
| `src/content/columns-ar/704-taiwan-arc-first-application.md` | Opens on the 30-day clock, then groups supporting documents, online filing and fees. Its conclusion tracks the validity of the documents behind residence. | 930 opens on the effect of an extra freight invoice and distinguishes the contracts. 931 examines the supplier's conduct. Neither copies the application table or numbered sequence. |
| `src/content/columns-ar/705-taiwan-visa-residence-work-study-family.md` | Asks which passport and purpose apply, then separates work, study and family routes. The ending returns to the lawful route before travel. | 931 also uses a question, but asks about stopping supply after a factory discount; its structure follows pricing conduct and justification. The shared interrogative form does not reproduce the immigration template. |
| `src/content/columns-ar/706-taiwan-arc-renewal-changes-reentry.md` | Opens with residence grounds expiring before the card date; separates renewal, changes, replacement and travel. The final practical paragraph concerns NIA dates and return documents. | 930 follows risk allocation, possible performance, foreseeability and a shipment-specific amendment. 931 ends with the price list, discount terms and sales message, not an all-purpose checklist. |

The research brief identifies 699 as the existing non-delivery/refund treatment. I verified that the internal-link target file exists. 930 uses that link only when the dispute changes to rescission/refund and keeps the new analysis on freight cost, delay and contractual risk.

## First-two-paragraph deletion test

930 paragraph one: deleting the first sentence loses the limited significance of the extra invoice. The second sentence supplies the distinction between the carrier's contract and the supplier/importer sale. The third supplies contractual cost/delay allocation and price-adjustment alternatives, explaining the need for both contracts. These are progressively different facts, not a preview of the article.

930 paragraph two: the first sentence prevents Taiwan location from deciding governing law. The next adds express party choice and the absence/invalidity fallback. The last confines the analysis to a Taiwan-governed sale and avoids purporting to determine carrier rights or UAE law. Deleting any of these would broaden or blur the scope.

931 paragraph one: the first sentence identifies the Saudi supplier, Taiwan distributor, industrial buyer and supply-cutoff trigger. The second supplies the prohibition and its justification exception together. The third makes the resale chain and B2B reach explicit. It is useful in this polymer-supply context rather than a consumer-brand assumption.

931 paragraph two: the first sentence raises the contract-label problem, the second gives the official supply-sanction example while preserving “may constitute,” and the third connects the written policy to what the sales team does. This is relevant to a Saudi supplier implementing instructions across borders. There is no removable generic introduction.

## Arabic, metadata and preserved legal meaning

The pair uses readable Modern Standard Arabic business prose. Supplier, distributor, carrier and buyer remain separate actors. Terms such as `استحالة الأداء`, `تغير الظروف`, `تقييد أسعار إعادة البيع` and `المبرر المشروع` are explained in their Taiwan-law context. The repaired court reference keeps the exact Chinese case identifier for retrieval. Arabic punctuation is consistent; source-level mixed-script text and numerals are legible, without an unsupported claim that browser RTL layout was tested.

Titles, SEO titles, summaries, localized dates/read times, two FAQs per file, tags, category, audience, image alt and caption were read. FAQs preserve the conditions in the body. The date fields are 2026-10-25; the sole author field is internal frontmatter. There is no body byline, human-review claim, bold markup or duplicate leading H1.

For 930, the contract's choice of law, nonattributable impossibility versus delay, unforeseen post-contract change, manifest unfairness and court application remain distinct. The court passage describes an electrical-material construction project and a reversal/remand, with no final compensation award or UAE-shipment holding invented. No current port closure, freight price or actual client shipment is asserted.

For 931, the suggested-price conditions retain both independent price setting and freedom to discount. The legitimate-justification exception, enterprise evidence burden and authority's assessment remain explicit. The five factors are not converted into an automatic new-entrant exemption. The initial administrative fine is discretionary and expressed in New Taiwan dollars. The 2017 compliance code is identified as guidance, read with current law. Commission/consignment arrangements are not treated automatically as independent resale. The article expressly stops short of Saudi competition/agency law advice.

Each contact paragraph uses the verified email once, asks for a nonconfidential initial summary and confirmation of the communication method, identifies only English, Chinese, Korean and Japanese consultation, and states that receipt does not accept a retainer. No Arabic consultation, interpretation, outcome or reply-time promise appears.

## Section 5 review and actual measurement

The original shared script was executed with `--lang ar`, without modifying it or substituting another language. Complete final commands, exit codes and stdout are in `ar-locale.json`.

| Article | Sentences | CV | Short share | Three-similar-length share | Result |
|---|---:|---:|---:|---:|---|
| 930 | 41 | 0.458 | 0.195 | 0.051 | exit 0, no variety limit violated |
| 931 | 38 | 0.484 | 0.105 | 0.083 | exit 0, no variety limit violated |

The two openings are a document-based factual proposition and a concrete commercial question; neither uses a stock hypothetical opening. Both contain multiple short substantive sentences, such as the remand/no-final-award sentences in 930 and the distributor's pricing choice/evidence burden in 931. Paragraph starts do not form three repeated identical openings. Legal citations alternate with shipment-document, implementation and negotiation passages; no three repeated claim/citation/caveat blocks appear. The legal contrasts address actual reader decisions, not imaginary rebuttals. 931's later sales instruction is expressly hypothetical. No invented first person or imperative checklist headings appear. Both close their substantive analysis on their own evidence. Facts, conditions, numbers, links and fictional-image notices remain preserved after the language repair and metadata correction. No MONOTONY blocker remains.

## Images and source review

Both final WebPs were actually opened and inspected with the image-viewing tool. 930 shows a fictional port-office still life with a model container, blank paper and rope; 931 shows polymer samples in metal trays with plain industrial packaging. The scenes are visually distinct, fit the respective transaction, and have no readable documents, identities, faces, flags or logos. Arabic alt describes what is visible; each caption identifies the scene as fictional.

| Image | SHA-256 |
|---|---|
| `public/images/columns/930-market-expansion-20261025.webp` | `a247a8544127f0eaf7a5bf0523191650463f909c31cc82276b396c50c113cb37` |
| `public/images/columns/931-market-expansion-20261025.webp` | `42285608197d77c9cb1b0c165705951a0750690711939f977b965ce51224bbaf` |

I independently opened current Chinese Civil Code 225/230/227-2, conflicts article 20, Fair Trade Act 19/40, Enforcement Rules 25, the substantive FTC FAQs 14455/14457/14458/14459 and the relevant part of guidance 12669. Each article's inline source set matches its source-list set. Observations and access limits are recorded in `ar-locale-evidence.json`.

My direct court-page request timed out. I independently read the complete actual captured official response at `ar-author-opened-sources-2.json` → `results.ar-930-case-full`, lines 0–64. This is an access limitation, not a fresh successful fetch. The final legal reviewer separately controls the legal approval. No browser rendering, public deployment or measured commercial-demand claim is made by this review.

## Caption normalization reapproval

After the initial locale and final reviews, root normalized both image captions to the existing site label `مشهد متخيَّل`. I read the actual current frontmatter and `work/checks/caption-normalization.json`, then independently reconstructed each previously approved file by restoring only its old caption. Both reconstructed SHA-256 values exactly match the earlier approved files. This proves that the body, FAQ, alt text, date and all other metadata are unchanged. Both image-file hashes also remain unchanged.

The concise Arabic label naturally means “fictional scene” and remains accurate for both images already inspected. Scene-specific detail is retained in the unchanged alt text. I reran the original `--lang ar` CLI on each current full file: both exit 0 and no variety limit violated. The table and machine-readable report now bind the current caption-normalized manuscript SHAs. This follow-up does not claim a new browser check or publication.
