# Portuguese market columns 694–698 — independent review

Review date: 2026-10-24. Reviewer: `/root/market_review_pt`, AI European-Portuguese editorial reviewer; did not author or edit these manuscripts. This is not a claim of human native-speaker or lawyer review. Scope: five full current manuscripts, public-original diff, three nearby Portuguese comparators, actual five hero assets, shared variety checker, and consequential official legal sources.

## Final R2 decision — PASS

All five manuscripts PASS at the exact versions below. A separate repair author `/root/market_review_pt/market_pt_repair` implemented P1–P5 in 694–697. This independent reviewer inspected the complete resulting diff, re-read the changed passages and affected FAQ/legal conclusions, and independently reran the actual shared CLI on all five files. No manuscript was edited by this reviewer. The historical R1 findings below are resolved, not outstanding.

| Article | Final SHA256 | Decision | CLI |
|---|---|---|---|
| 694 | `3d658de92c0b0ff74e6bcbd3da0ab2d16decf6c994693276b62970982449ebe7` | PASS | exit 0, FAIL 0; CV .454, short .125 |
| 695 | `05fb0d2b5305c02e5292dbb1fa3d39951dd7c18c8da2b74dc59a51c4aeaa9e22` | PASS | exit 0, FAIL 0; CV .487, short .114 |
| 696 | `96ee165f4ac3392ba2dc487b584489b9acfaa875c1ce263b26d32d671cdd97bc` | PASS | exit 0, FAIL 0; CV .460, short .103 |
| 697 | `ebbaff65263b49401cd07d3cc5abe439d2ee5a778010795df52f718e2cb717f0` | PASS | exit 0, FAIL 0; CV .480, short .095 |
| 698 | `80ebc4b50ebfc0d4d0e62373c2d0ec5b9989091726430d9538f48b6b33e6b549` | PASS; unchanged | exit 0, FAIL 0; CV .456, short .152 |

R2 resolutions:

- P1: The FAQ now identifies the client's presence in Taiwan as the connecting fact and uses natural `aplicar o direito taiwanês`. The answer's conflicts and jurisdiction distinctions remain intact.
- P2/P3/P5: Only the identified generic tails/duplicate instruction were removed. The condition attached to a release versus the entire settlement, the official fraud alert and its liability limit, and the client's notification/decision responsibilities remain explicit.
- P4: The paragraph now begins `Quanto à oposição, a contraparte tem vinte dias.` The following linked sentence states receipt of notification of the petition as the trigger. Grounds and separable-excess condition remain unchanged. This short sentence carries the actual deadline; it is not a filler sentence. The duplicate deadline tail was removed.

Evidence: `market-pt-variety-r2.json` and `market-pt-support/final-preservation.json`. All original source URLs, `published`, `date_display`, internal provenance and image metadata are preserved; edited 694–697 have `lastmod: 2026-10-24`, and untouched 698 retains its prior date. All five asset hashes remain those visually approved below. No new substantive legal proposition was introduced. Source access limitations below still apply. Final legal review and root publication/readback remain separate; this PASS does not claim deployment or browser rendering.

## R1 decision

REQUEST_CHANGES for narrowly identified prose defects in 694–697. No material legal error identified in the current five manuscripts. 698 PASS. Images and localized descriptions PASS for all five. Preserve existing legal conditions, links and dates of publication. These findings do not require new images, new subjects or wholesale rewrites.

| Article | Current reviewed SHA256 | Decision |
|---|---|---|
| `src/content/columns-pt/694-portugal-exportador-acordo-prestacoes-taiwan.md` | `62dd6d3e3e38a388f49be4d259e44abd4d87badd9261e8afd708cffb3567f2f0` | REQUEST_CHANGES — P1, P2 |
| `src/content/columns-pt/695-portugal-fornecedor-taiwan-alteracao-conta-fraude.md` | `dd47581c4629eced1a254eab84cebbe1dc2f2a0da5c5d36c761f9cc308f8f78a` | REQUEST_CHANGES — P3 |
| `src/content/columns-pt/696-portugal-sentenca-arbitral-bens-taiwan.md` | `e495bd598c2c2615e6532b56530f9f708e752dd65503cceba207567b7e8e1aac` | REQUEST_CHANGES — P4 |
| `src/content/columns-pt/697-portugal-mandatario-processo-civil-taiwan.md` | `7c78571e6b959be709d66f8bed61e621670b7a8320e9e0af928db327c7932a0b` | REQUEST_CHANGES — P5 |
| `src/content/columns-pt/698-portugal-fim-contrato-taiwan-salarios-em-falta.md` | `80ebc4b50ebfc0d4d0e62373c2d0ec5b9989091726430d9538f48b6b33e6b549` | PASS |

## Bounded editorial findings

| ID / File:line | Exact sentence | Reason and evidence | Proposed repair | Legal meaning preserved? |
|---|---|---|---|---|
| P1 / 694:22 | `O cliente taiwanês torna obrigatório aplicar direito de Taiwan ao acordo?` | The person is an unnatural grammatical cause of the governing law; the question needs to identify location as the fact under examination. `aplicar direito` also reads as compressed translation. | `O facto de o cliente estar em Taiwan obriga a aplicar o direito taiwanês ao acordo?` Keep the answer. | Yes. No new conflicts rule. |
| P2 / 694:42 | `A redação deve acompanhar a solução negociada.` | MONOTONY: generic paragraph tail — it adds no condition, consequence or drafting choice after the two precise conditional alternatives. This is a removable instruction about writing. | Delete this sentence; keep the distinction between suspending the release and suspending the entire agreement, including the timing of the payment obligation. | Yes. |
| P3 / 695:28 | `Serve para reconhecer a situação e preservar a informação necessária à análise.` | First-two-paragraph deletion test fails. The preceding official alert already identifies the mechanism, and the opening establishes reconstruction of sender/recipient. This generic statement about what the alert is for adds no evidential step. | Delete this sentence. Keep the official PJ link and the statement that an alert does not allocate the contractual loss. | Yes. |
| P4 / 696:50 | `A data da notificação inicia esse prazo.` | MONOTONY: repeated deadline tail — this repeats `vinte dias após a receção da notificação do pedido` at the start of the same paragraph. The final short sentence does not add a distinct trigger. | Delete the tail and, if needed for readability, recast the opening as `A contraparte tem vinte dias para deduzir oposição. O prazo previsto no [artigo 50](existing URL) conta-se desde a receção da notificação do pedido.` Preserve the grounds and severability condition. | Yes; twenty days, respondent and receipt of notice retained. |
| P5 / 697:28 | `Um mandato amplo pode facilitar determinados atos, mas a sua extensão deve corresponder às instruções efetivamente dadas.` | The preceding paragraph already asks about authority to settle and identifies special powers. This second-paragraph sentence supplies no additional act, limit or allocation; `determinados atos` is unspecific. | Delete it. Keep the paragraph's notification/decision responsibilities and the requirement to identify the counterparty and dispute. | Yes. |

These are prose corrections, not substantive legal corrections. Do not add filler, invented facts, long merged sentences or extra warnings to preserve a checker score. A genuine shorter legal sentence can carry a deadline or actor where the paragraph benefits from it.

## Opening deletion test and locale comparison

- 694: Paragraph 1 supplies the concrete credit-extinguishment risk and Civil Code 737. Paragraph 2 supplies choice of law, closest connection and characteristic-performance domicile, with forum separated. Their legal information should remain. The FAQ question P1 is the notable translation artifact.
- 695: Paragraph 1 identifies the conflict between the supplier's demand and the Portuguese accounts team's transfer record. Paragraph 2 adds the PJ's independent description and limits what that alert establishes. Only its final metacomment P3 can disappear without loss.
- 696: Paragraph 1 states the recognition prerequisite and effect under article 47. Paragraph 2 distinguishes award country, arbitration law, debtor and the statutory inclusion of awards made in Taiwan under foreign law. Both add distinct content.
- 697: Paragraph 1 identifies settlement authority and separates the mandate from fees. Paragraph 2 adds service and decision arrangements while abroad and party/dispute identification. P5 repeats the already established general question of power scope.
- 698: Paragraph 1 starts with a concrete five-year retention obligation and distinguishes limitation. Paragraph 2 identifies the employer and separates wage, overtime, bonus and expense components, then limits the statutory employment scope. Retain both.

Comparators actually read (opening paragraphs, headings and endings; available older PT articles rather than invented contemporaneous comparators):

1. `src/content/columns-pt/016-taiwan-inheritance-custody-analysis.md`, displayed 2025-09-13, lastmod 2026-10-11. It uses long itemized conceptual distinctions and numbered headings; the reviewed five articles use more specific commercial triggers and shorter, non-numbered subject headings. Its legacy author tail is not a model to copy and is outside this assignment.
2. `src/content/columns-pt/017-taiwan-logistics-business-setup.md`, displayed 2025-09-13, lastmod 2026-10-07. Its `Este artigo distingue três situações` announcement and repeated classification caveats illustrate the sort of throat-clearing that P3 should avoid. No migration of that introduction or legacy author tail is proposed.
3. `src/content/columns-pt/018-taiwan-semiconductor-market-entry.md`, displayed 2026-09-17, lastmod 2026-10-07. Its operational Taiwan decision is useful, but the lengthy hypothetical/table/consultation structure is not repeated in this batch. Market articles provide narrower, topic-specific final document steps.

The five openings are distinct: transactional consequence, disputed payment record, recognition prerequisite, authority question, and a retention period. This is not a uniform hypothetical template. European Portuguese terms such as `faturas`, `prestações`, `mandatário`, `procuração`, `recibos`, `trabalho suplementar`, `indemnização`, `dossiê` and `contacto` are appropriate. No unsupported Portuguese-law conclusion or Portuguese-speaking consultation promise was found.

## Legal/source checks on 2026-10-24

The following current official texts were actually opened and their relevant provisions read. The reports concern their application as written here, not every possible exception in unrelated transactions.

- 694: Civil Code [736](https://mojlaw.moj.gov.tw/LawContent.aspx?TypeSort=3&lawNumber=736&lsid=FL001351&media=print), [737](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=737), [99](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=99); conflict-of-laws [20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20); Compulsory Enforcement Act [4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010004&flno=4). Rights relinquished, conditional effects, governing-law selection/presumption, executable titles, conditions/security/counterperformance match the prose. The Civil Code's commencement notice concerns 166-1 and 1223, not these provisions.
- 695: Civil Code [309](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=309) and [310](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=310) support the distinction between the transfer record and valid discharge; the article gives examples rather than claiming an exhaustive third-party-payment rule. The [Banco de Portugal FAQ](https://clientebancario.bportugal.pt/pt-pt/perguntas-frequentes?x=2) supports immediate institution contact followed by reporting to police/prosecutor. Initial web open/find did not extract the question; targeted official-URL search subsequently returned the actual relevant question and answer. This is not a wrong-link finding; preserve the URL.
- 696: Arbitration Law [47](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0020001&flno=47), [49](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0020001&flno=49), and the current [MOJ official full English text, 48/50](https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL010105&media=print). Recognition effect, foreign-award definition, original/authenticated-copy alternatives, Chinese translations, Taiwan-authorized authentication, respondent copies, mandatory versus discretionary refusal, reciprocity links, twenty-day receipt trigger and severability match. Single-article Chinese URLs 48/50 were not accessible to the web tool; the existing linked full official text was accessible. No Portugal reciprocity conclusion is invented.
- 697: Code of Civil Procedure [68](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=68), [69](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=69), [70](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=70), [132](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=132), [203](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=203). Judicial leave for non-lawyers, per-instance mandate and notarized specific-case exception, special powers and recorded restrictions, service to agent, personal appearance and translations all match. The article does not assert a blanket apostille or consular-authentication requirement.
- 698: Labor Standards Act [2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=2), [23](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=23), [26](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=26), [30](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=30); Enforcement Rules [9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030002&flno=9); Labor Incident Act [16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010064&flno=16), [37](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010064&flno=37), [38](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010064&flno=38); Civil Code [126](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=126), [128](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=128). Five-year record duties and periodic-claim period remain distinct, commencement is enforceability rather than departure, evidence presumptions are bounded, immediate final wages and prohibition on advance penalty deductions are accurately expressed.

Additional official-page retrieval limits, disclosed rather than silently counted as direct HTTP success:

- [Judicial Yuan settlement effects](https://www.judicial.gov.tw/tw/cp-1303-2602-67cd3-1.html): web open and normal verified-TLS curl timed out. Targeted search of that exact official URL returned the actual FAQ text confirming private settlement cannot itself directly support execution; the current enforcement statute independently confirms the article's distinction.
- [PJ cross-border invoice fraud alert](https://www.policiajudiciaria.pt/burla-e-falsidade-informatica-em-transacoes-empresariais-transnacionais/): web open timed out; direct curl stopped on TLS verification failure and was not bypassed. Targeted official-URL search returned the alert, its 2018 publication date and the alternative-channel/known-representative recommendation. Its content is treated as guidance, not a ruling allocating liability.
- The live [Portuguese contact page](https://tseng-law.com/pt/contact) was fetched HTTP 200 using ordinary TLS with process-scoped DNS resolution. It confirms `wei@hoveringlaw.com.tw` and consultation only in English, Chinese, Japanese and Korean. Saved read-only evidence is `market-pt-support/contact.html` and `fetch.json`. No Portuguese service, interpreter, acceptance or outcome is promised by these manuscripts.

## Image review

All five referenced local assets exist and were visually opened through `view_image`, rather than approved from paths alone. Their alt/captions accurately describe them and identify them as illustrations. No readable client records, logos, flags or identifiable actual client is claimed. Images are reused illustrations, not evidence of a specific case.

| Article | Observed subject | Asset SHA256 |
|---|---|---|
| 694 | Cropped two-person hands/torso, unreadable document sheets, cartons and harbour background. Matches invoice settlement. | `583778392ca2de359c18532a7e6ec367c48202fbe05292c0695cbf668c4c9f81` |
| 695 | Person using phone, laptop email layout and two unreadable invoice-like sheets. Matches verification of changed bank details. | `24468029d4f12cbc80b79b8290a743e9115f9299ea8f07274caa233c7b180e50` |
| 696 | Light stone colonnade and empty terrace in low light. Generic legal architecture, explicitly not a named court. | `d6fb4dcbb7019d9a0d8c45eb9ef5ee61fa3f81c25b73da275289e43ed0b59fbf` |
| 697 | Closed envelope, blank metal discs and desk lamp. Stylized correspondence/financial-document subject. | `1252a6bc4811ddfe96f16eceac5c05b75dd26e57eb6a9a2456df85a6c79495af` |
| 698 | Sewing machine, folded cloth, empty chairs and window. Fictional workplace matching the wage dispute's labour context. | `797ef5319e02226059265ccc46b9c4e1ad1b3ef13e72200653a1d1e24513b5d6` |

## Mechanical and manual checks

Actual command on each file: `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute manuscript path>`.

R1 log: `market-pt-variety-r1.json`. All five returned exit 0, `OK — no variety limit violated`.

| Article | Sentences | CV | Short ratio | Run3 | Questions |
|---|---:|---:|---:|---:|---:|
| 694 | 41 | .466 | .146 | .000 | 2 |
| 695 | 36 | .490 | .111 | .088 | 0 |
| 696 | 39 | .460 | .103 | .081 | 2 |
| 697 | 43 | .475 | .093 | .000 | 2 |
| 698 | 46 | .456 | .152 | .068 | 2 |

Rule section 5 manual check: distinct non-template openings; useful short sentences; no recurring claim/citation/caveat triplets; non-citation practical paragraphs; no excessive contrast frame; endings refer to this article's payment map, fraud actors, debtor identity, powers or wage components; no bold, invented personal experience or public author language. 695 has no body question because the title and section about creditor authority already carry its question and its evidence sequence reads directly without adding a rhetorical prompt. P2/P3/P4/P5 are the remaining removable filler/repetition despite metric PASS.

Diff against public original `174454bd`: 694/695/696 currently unchanged; 697 changes one advice sentence to direct `Discuta`; 698 changes a recordkeeping tail to `Registe a data da cessação`. Those prior edits preserve substance. Final reviewer must bind its separate conclusion to repaired latest hashes. This report is not publication or browser-rendering verification.

## R1 next bounded step — completed in R2 above

A separate author repairs P1–P5 only in 694–697, preserving all sources and legal conditions, updating `lastmod` of edited files to 2026-10-24 but preserving `published`/`date_display`. This independent reviewer will re-read changed passages, affected conclusions and fresh CLI output, then record the latest hashes. 698 remains unchanged and approved at its listed hash.
