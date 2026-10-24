# ES market 689–693 independent review

Reviewer: `/root/market_review_es`, AI Spanish editorial reviewer. This reviewer did not author or modify these manuscripts. Review date: 2026-10-24. Scope: actual full current manuscripts and their diff against `git show 174454bd:<path>`, three prior Spanish columns, official current sources, metadata, and sentence-variety/manual checks. No claim of human native-speaker or licensed-lawyer review. Root owns publication.

Current decision: PASS for all five at the final source/image hashes recorded in the last section. E1–E4 are resolved. Initial REQUEST_CHANGES entries below are retained as repair history and are superseded by the final decision. Generated/public HTML and deployment are outside this review.

## Initial decision (before images and bounded repair)

| ID / file under `src/content/columns-es/` | SHA256 reviewed | Prose / law | Image |
|---|---|---|---|
| 689-spain-exporter-taiwan-unpaid-invoices.md | e46f893b80e7287cb95c5eb4f819f4ef632eaa8633774bb12ea2ac0bcfe0036d | REQUEST_CHANGES: E1 | Pending root asset |
| 690-spain-buyer-taiwan-defective-goods-notice.md | 69001fba822ae1a024f2ca31acca1a03cec7035ee2ca9dd524a1719a581097a5 | PASS | Pending root asset |
| 691-spanish-judgment-taiwan-assets-enforcement.md | be53be3e8b7392d4458c11f6c92bb5bcae610ec19b2061d419623068083cee63 | REQUEST_CHANGES: E2–E3 | Pending root asset |
| 692-return-spain-unpaid-taiwan-wages.md | 001bc0cfc01c5bf6b4c6f1862f5be54af9de7d5fc559db52872c8768fa5477ba | PASS | Pending root asset |
| 693-spain-resident-taiwan-divorce-property.md | 62031b16e250abc879625423246ffe2db85dc2f0fdde56c093a324da73fa9e52 | REQUEST_CHANGES: E4 | Pending root asset |

All five are still unreleased review candidates in this task. An image pending status alone is not a rejection of prose. The four requested edits below are bounded; no wholesale rewrite is warranted.

## Actionable findings

| ID | File:line | Exact sentence / span | Reason | Proposed repair | Legal meaning |
|---|---|---|---|---|---|
| E1 | 689:51 | “Un impago exige investigar esa posibilidad, pero no demuestra por sí solo todos sus requisitos.” | The paragraph has already given the precautionary-attachment test. This tail turns every unpaid invoice into a categorical instruction to investigate attachment without a supporting rule. It also repeats the absence-of-proof caution more vaguely. | “El impago, por sí solo, no acredita el riesgo exigido por el artículo 523.” | Removes an unsupported categorical practical requirement; statutory risk and prima-facie-proof requirements remain unchanged. Not a new legal rule. |
| E2 | 691:36 | “Este artículo no afirma que esté acreditada para cualquier sentencia española. Tampoco permite deducir el resultado del procedimiento a partir de que la resolución sea europea.” | Editorial self-commentary and a second EU warning repeat the preceding specific reciprocity caveat and opening. The reader needs the condition, not a statement about what the article does not assert. | Retain only “Respecto de España, la reciprocidad requiere una comprobación específica.” | Preserved: reciprocity is not certified, no automatic Spanish-judgment recognition. |
| E3 | 691:46 | “Corregir el expediente cuando ya existe una sentencia puede plantear una dificultad distinta.” | Empty comparative warning: neither the difficulty nor its consequence is identified. The surrounding sentences already explain advance coordination and Spanish-advice limits. | Delete the sentence; retain both surrounding sentences. | Preserved: service should be planned in advance, Spanish procedure requires appropriately qualified advice. |
| E4 | 693:41 | “La existencia de esta página en español no acredita que el despacho taiwanés ejerza en España.” | Website-language self-commentary interrupts the matrimonial-property analysis. The immediately preceding sentence already gives the relevant jurisdictional boundary. | Delete only this sentence; retain “Si parte del asesoramiento corresponde al derecho español, deberá intervenir un profesional habilitado para ese ámbito.” | Preserved: Taiwan-law scope; separate Spanish-law advice, no Spanish licensure claim. |

These are concrete voice/precision findings, not an AI-detector judgment. MONOTONY: repeated warning and editorial self-commentary — “Este artículo no afirma…” / “La existencia de esta página en español…” — retain the specific reciprocity and Spanish-advice conditions, then remove the duplicate negative tails (E2–E4). The numerical variety PASS does not cure that pattern. No new statutory error was found in the checked claims.

## First two paragraphs: deletion test

| ID | Paragraph 1 | Paragraph 2 |
|---|---|---|
| 689 | Brand versus contracting company establishes the identity problem; the second sentence states the documents that resolve it. Removing either loses the specific trigger or action. | Choice of law, absence of automatic Taiwan-law applicability, and the separate prescription conflict rule are all material conditions. Retain. |
| 690 | Pending laboratory report versus already discovered defect identifies when waiting becomes relevant; conditional Taiwan-law sentence preserves the legal scope. Retain. | B2B scope and choice-of-law test prevent applying the deadlines solely because goods came from Taiwan. No disposable announcement. |
| 691 | EU certificate limitation and intra-member-state scope answer a concrete Spanish reader question. Retain; the later E2 repetition is unnecessary. | Taiwan execution judgment and absence of denial grounds establish the additional proceeding. Finality/service evidence is concrete preparation, not a generic caveat. |
| 692 | Closed employer-email access provides the evidence-loss trigger. Documents identify what to preserve; lawful-possession restriction is material. | Taiwan-law coverage, posted-worker/contractor complications, and legal-employer identification set necessary boundaries. The uniform-brand example illustrates identity without fabricating a case. |
| 693 | The question is the actual choice-of-law problem; nationality, domicile and agreements identify the relevant inputs. | Chronology adds marriage date, separation and existing proceedings; complete-document advice avoids prematurely treating the whole dispute as Spanish law. Partial overlap in named fields serves the timeline and is not a repeated abstract introduction. |

## Three prior same-locale comparators

All three were read in full from the current repo; each is dated 2026-10-22 and predates this market batch's manuscript date. They are comparison material, not certification of their legal content.

- `src/content/columns-es/656-taiwan-one-shareholder-limited-company-director.md`: opens with the sole-member oversight question, then the actual corporate rule. Short paragraphs distinguish administrator, shareholder and supervisor. The current 693 similarly has a legitimate reader question, while 689/690 begin with documentary triggers; the five do not copy this opening format.
- `src/content/columns-es/657-taiwan-spanish-document-legalization-taipei-office.md`: opens with the apostille/diplomatic-legalization distinction and develops document-specific chains. Current 691's EU/Taiwan recognition distinction has a different legal function and does not duplicate authentication; its link to 657 is useful. Current short document-preparation sections are less list-heavy.
- `src/content/columns-es/658-taiwan-bail-local-surety-cash-deposit-family.md`: opens with money from Madrid/Monterrey and the local surety distinction; headings track procedural stage. Its ending returns to receipt of funds. Current 689–693 likewise end on a specific unpaid-invoice date, defect-notice chronology, service/finality certificate, salary date, or marriage/property file. Their consultation paragraphs share necessary scope information but have article-specific closing actions.

No invented personal experience, real-client anecdote, triumphal service claim, public AI byline or bold emphasis was found in these five. Spanish terminology such as albaranes, nóminas, requerimiento, firmeza and rebeldía fits the target readership. The Taiwan-law basis remains explicit; Spanish legal concepts are not substituted for Taiwan rules.

## Live official-source review

Opened on 2026-10-24 with the web tool. There are 36 distinct Taiwan statutory provisions below, plus the EU instrument and current contact page. The single-article endpoint for conflicts article 36 was unavailable; its exact text was read in the official full act. All other listed provisions were opened directly. The Civil Code page's pending-commencement banner concerns 166-1 and the 2026 amendment to 1223, neither of which is relied upon by these five articles.

| Article | Official sources and verified scope |
|---|---|
| 689 | Conflicts act [20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) and [36 in full act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000007): choice/closest connection and limitation governed by underlying relation. Civil Code [127](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=127), [128](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=128), [129](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=129), [130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130): two-year goods-price claim, exercisability, interruption/equivalent proceedings, six-month consequence. CPC [508](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=508), [509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509), [511](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=511), [516](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=516), [519](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=519), [521](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=521): payment-order subject, exclusions, substantiation, twenty-day objection and effects. |
| 689 and 691 | CPC [523](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523) and [526](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526): future impossibility/grave execution difficulty, substantiation of claim and risk, possible security. The scope is assets in Taiwan; the separate statutory foreign-execution presumption is not presented as removed or replaced. |
| 690 | Civil Code [354](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354), [356](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356), [357](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=357), [359](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=359), [360](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=360), [365](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=365): defect/guaranteed quality at risk transfer, prompt inspection/immediate notice, deliberate non-disclosure exception, rescission/reduction, damages grounds, six months after notice or five years from delivery. The deliberate non-disclosure exception is limited to the six-month component in 365. |
| 691 | [EU Regulation 1215/2012, BOE](https://www.boe.es/buscar/doc.php?id=DOUE-L-2012-82604&lang=es), articles 36 and 39: relations between member states; [Compulsory Enforcement Act 4-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010004&flno=4-1), [CPC 402](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=402): final foreign judgment, Taiwan permission by judgment, denial grounds, service exception, reciprocity, debtor-domicile/asset venue. No independent finding of Spain–Taiwan reciprocity is claimed. |
| 692 | Labor Standards Act [22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=22), [23](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=23), [30](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=30): full/direct pay with stated exceptions, wage breakdown, five-year wage/attendance records and employee copies. Labor Incident Act [6](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010064&flno=6), [16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010064&flno=16), [35](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010064&flno=35), [37](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010064&flno=37), [38](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010064&flno=38): worker-claim venue, mediation subject to exceptions, employer production duty and wage/attendance presumptions. Civil Code [126](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=126) and 128: five-year periodic claims and exercisability. Preservation duration is not misrepresented as universal claim limitation. |
| 693 | Conflicts act [38](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=38), [48](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=48), [50](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=50): situs real rights, written matrimonial-law selection and fallback, divorce connecting factors at agreement/filing. Civil Code [758](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=758), [1030-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1030-1): written juridical acts/registration, residual difference, exclusions, judicial adjustment and two-year knowledge/five-year termination limits. Current 1030-1 says unfairness; no unsupported stricter “manifestly” threshold is added. |

The [live Spanish contact page](https://tseng-law.com/es/contact) confirms the email `wei@hoveringlaw.com.tw`, consultation in English/Chinese/Japanese/Korean, and no attorney-client relationship created merely by sending a message. The manuscripts do not promise Spanish-language consultation. Consultation and contact information is not treated as proof of foreign licensure or successful outcomes.

## Variety and manual section-5 checks

Command for each source: `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <file>`.

| ID | Sentences | CV | Short ratio | Similar-three run | Exit / FAIL |
|---|---:|---:|---:|---:|---|
| 689 | 43 | 0.454 | 0.140 | 0.073 | 0 / 0 |
| 690 | 41 | 0.507 | 0.146 | 0.051 | 0 / 0 |
| 691 | 36 | 0.454 | 0.139 | 0.000 | 0 / 0 |
| 692 | 44 | 0.460 | 0.227 | 0.024 | 0 / 0 |
| 693 | 43 | 0.457 | 0.116 | 0.073 | 0 / 0 |

Raw logs and source snapshots: `work/reviews/market-es-support/`. No checker was changed. At least two useful short sentences occur in each; explanatory runs are mixed with questions and concrete evidence paragraphs. Openings vary between identity, timing, cross-border scope, documentary access and a legal question. There is no hypothetical-case formula, fabricated dialogue, repeated claim/citation/caveat chain, decorative bold, or imperative checklist heading. Legal citations move between subject and paragraph end. Citation-free paragraphs concern documents and logistics. E2–E4 are the manual-review defects that automated metrics missed. Legal numbers, URLs, provenance and published dates were preserved by the already integrated candidate diff; it changed only sentence segmentation/word order in 689, 691, 692 and 693. Article 690 matched the public original.

Next bounded step: separate author applies E1–E4, adds root-supplied images after visually opening them, preserves published/date_display and updates lastmod to 2026-10-24. Then this reviewer rechecks affected text/conclusions, image subject and localized metadata, actual CLI and exact source hashes. This report does not certify unseen image assets, generated HTML, deployment or public readback.

## R1 independent prose recheck — PASS, images pending

The separate repair author applied exactly E1–E4. This reviewer read the complete R0→R1 diff and affected paragraphs/conclusions, independently reran the actual variety CLI on all five, and saved `market-es-support/metrics-r1.json` plus source snapshots. No filler or unrelated sentence merging was needed. All requested prose findings are resolved. Only the three changed articles' lastmod was updated at this prose stage; the other two will update with the image addition.

| ID | Latest R1 SHA256 | Decision | CV / short ratio / exit |
|---|---|---|---|
| 689 | 87c7e7f48c0c457e1b373a926ad60c5d4b3a9c868b610ebe0b3c22d8dc479ab8 | Prose and checked law PASS; image pending | 0.455 / 0.140 / 0 |
| 690 | 69001fba822ae1a024f2ca31acca1a03cec7035ee2ca9dd524a1719a581097a5 | Prose and checked law PASS; image pending | 0.507 / 0.146 / 0 |
| 691 | eb488e2fb4ddee716d342a2984306231c9f94a9708a38ff9ea194431dd264078 | Prose and checked law PASS; image pending | 0.458 / 0.152 / 0 |
| 692 | 001bc0cfc01c5bf6b4c6f1862f5be54af9de7d5fc559db52872c8768fa5477ba | Prose and checked law PASS; image pending | 0.460 / 0.227 / 0 |
| 693 | f8c3d7dc8735362da850983268ef7a8d41919335676712ec7e7fece1cab02905 | Prose and checked law PASS; image pending | 0.460 / 0.119 / 0 |

E1 now identifies the statutory risk without an unsupported investigation mandate. E2 retains the specific Spain reciprocity check and all four recognition grounds. E3 retains advance service coordination and Spanish qualified-advice scope. E4 retains the explicit requirement for separately qualified Spanish-law advice. All original source URLs, deadlines, statutory tests, FAQ and initial-publication metadata remain. Final image/source hashes will supersede these after installation.

## Final image and source recheck — PASS

The reviewer independently opened all five installed WebP files with `view_image` on 2026-10-24, then compared the author's actual frontmatter to the visible subjects. This was actual image inspection, not reliance on filenames, prompts or the author's report. The files are distinct illustrations with no identifiable people, flags, readable personal information or official-document facsimiles observed. Localized captions accurately identify illustrative scenes. All five article paths resolve to the inspected files.

| ID | Observed image and metadata fit | Image SHA256 |
|---|---|---|
| 689 | Document folder, calendar and shipping box overlooking a cargo harbour. Alt and commercial-claim caption match. | 00bfd3de4c37aa3e2a2483c8a7b1041efafbfefc65666c9da0968a7111cc307d |
| 690 | Two foreground ceramic cups, one cracked, open packing box with other cups, camera and blank tags. Alt describes the focal pair; damaged-lot documentation caption matches. | 2163131be070675c072c7f5c0becb4122fd87e83c6752c30edcb060cf1f45fc0 |
| 691 | Document folders, loose pages and a building model against Taipei skyline. Alt correctly says model, and caption uses a symbolic foreign-judgment file/assets context. | cff87a6458afd90ced0f320c8f6834c5cc23fcdc72c3b3fcff2ec3176d6f5256 |
| 692 | Packed suitcase beside a document file, calculator, notebook and keys. Alt is factual; return-to-Spain caption identifies the article's illustrative setting. | d241151cdec8631048ffc8f24a0a851cd06ed8a520ce27a7ac109f1c0093c700 |
| 693 | Two folders, housing floor plan, keys and two empty chairs, Taipei beyond the window. Alt and separation/property caption match. | 417f649bd7f9fdf50674712442db1779367a7a4a67139f687540d95653fdacb6 |

Image path format: `public/images/columns/<ID>-market-review-20261024.webp`; frontmatter uses `/images/columns/<ID>-market-review-20261024.webp`. Independent image evidence is `market-es-support/images.json`.

The full R1→final diff contains only these image fields and the two remaining lastmod changes (690/692). All five have lastmod 2026-10-24; original published/date_display, title, SEO title, summary, audience, internal author and FAQ remain. Ordered Markdown link targets are identical to R0. No body changed after the independent prose PASS. The actual shared variety CLI was independently rerun against these final files: five exit 0, zero FAIL; output is in `market-es-support/metrics-final.json`. Final source snapshots are saved alongside it.

| ID / file under `src/content/columns-es/` | Final source SHA256 | Final independent verdict |
|---|---|---|
| 689-spain-exporter-taiwan-unpaid-invoices.md | ab828b82d7d405cea84bc4d3a22284635dd6e35d41f0afce7d1ab539e2bab4c2 | PASS |
| 690-spain-buyer-taiwan-defective-goods-notice.md | bfdc21bb7fc7b62399e70aedac972c8b4ba5419acab77f5390b66eea48a5cbd7 | PASS |
| 691-spanish-judgment-taiwan-assets-enforcement.md | 1c253183afe74a8e00fbfd4e610a36d8c598df8ab280a301921756d3021e2180 | PASS |
| 692-return-spain-unpaid-taiwan-wages.md | 609a29d8402adcc1d4dab19ab17e4e413eec7e2bb35844619233522fa45cc002 | PASS |
| 693-spain-resident-taiwan-divorce-property.md | 30c854d8221caac8630209ae1e60f710d054faf72118bccd2f2177aee27ad637 | PASS |

Remaining evidence limits: this review does not certify a particular Spain–Taiwan judgment-recognition outcome or reciprocity finding; neither do the manuscripts. The separate final legal reviewer remains independent. Browser rendering, build output, image HTTP delivery and public publication remain root verification tasks. There is no unresolved locale-review finding at the hashes above.
