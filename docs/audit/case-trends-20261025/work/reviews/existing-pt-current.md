# Portuguese 694–698 and 704–706: independent follow-up review

Review date: 2026-10-25. Reviewer: `/root/recheck_pt_current`, an AI editorial/legal-evidence reviewer, not a human native speaker or a lawyer. I authored none of these manuscripts and have not edited them. Manuscripts are read-only; a separate author owns any repair. This is a narrow follow-up to the independently approved `a188e620ee7eebc3f2188829e2c318904802ef7d` batch, with all eight current manuscripts reread. It is not publication authority or live-site verification.

## Current final decision — PASS, eight articles

The separate author completed a bounded repair of 697 and 698. I reopened both complete final manuscripts, compared their actual changes, reviewed the affected claims and conclusions, and independently ran the real CLI again. The other six files are byte-identical to their passing R1 versions. All eight images and descriptions remain as reviewed. No material finding remains in this follow-up scope. The historical R1 findings below are resolved, not outstanding.

Final byte/hash/time and preservation evidence: `existing-pt-current-final-evidence.json`. The final table is authoritative for this review:

| File under `src/content/columns-pt/` | Final SHA-256 | Verdict |
|---|---|---|
| `694-portugal-exportador-acordo-prestacoes-taiwan.md` | `07d82a4c57890867dad2e3c03da869e2522dbe1657495f685c71283bc856236b` | PASS |
| `695-portugal-fornecedor-taiwan-alteracao-conta-fraude.md` | `b1475749d7fda41c0f630328d0d6b9cb5e3d5b3435c0140fb8c69944fc5f61f3` | PASS |
| `696-portugal-sentenca-arbitral-bens-taiwan.md` | `fd748c24bcfc701812039bcb1f59c3a745c4b8354d6fe4f3796fef737b808011` | PASS |
| `697-portugal-mandatario-processo-civil-taiwan.md` | `bc44b8c1b2fc0f7931e0ddf3c8a8b958acae51837c22b30e91a04d4405354fb8` | PASS |
| `698-portugal-fim-contrato-taiwan-salarios-em-falta.md` | `5eae522ecf7223fb96e7564b70c209dad74dac644b98fc30d06bf8126198a811` | PASS |
| `704-taiwan-arc-first-application.md` | `8aa828c67ccc8c9ffed1946592e0660bd03e36d4bce4744835a31f7672fa702d` | PASS |
| `705-taiwan-visa-residence-work-study-family.md` | `8935d8bab66031ecfd5c6b01db002fecc8d78e22713365c52214adaaa594c359` | PASS |
| `706-taiwan-arc-renewal-changes-reentry.md` | `6cd3d32cdbe24fa0a74f506cf17198f925d9780e769ad4ac3bf6331212d056f3` | PASS |

## Historical R1 decision — superseded

Overall REQUEST_CHANGES, confined to 697 and 698. The other six articles PASS this follow-up. There is no reason to replace their coherent, previously reviewed bodies or any of the eight images.

Repository: `/Users/son7/tseng-case-trends-20261025/repo`; inspected HEAD `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`. The initial byte/hash/time snapshot, actual commands and full outputs are in `existing-pt-current-evidence.json`. The diff from the approved baseline changes all eight captions to `Cena fictícia`; only 697 and 698 have subsequent body changes, introduced by `3519c561`. Markdown source-URL sequences are unchanged for all eight. Each image exists. Decorative bold hits are zero.

| File under `src/content/columns-pt/` | R1 SHA-256 | R1 verdict |
|---|---|---|
| `694-portugal-exportador-acordo-prestacoes-taiwan.md` | `07d82a4c57890867dad2e3c03da869e2522dbe1657495f685c71283bc856236b` | PASS |
| `695-portugal-fornecedor-taiwan-alteracao-conta-fraude.md` | `b1475749d7fda41c0f630328d0d6b9cb5e3d5b3435c0140fb8c69944fc5f61f3` | PASS |
| `696-portugal-sentenca-arbitral-bens-taiwan.md` | `fd748c24bcfc701812039bcb1f59c3a745c4b8354d6fe4f3796fef737b808011` | PASS |
| `697-portugal-mandatario-processo-civil-taiwan.md` | `5413c3f5b967adf73725ec3b58b12dfdb76b5ca43f301394e91929c6c5f56a0a` | REQUEST_CHANGES |
| `698-portugal-fim-contrato-taiwan-salarios-em-falta.md` | `bd4b5411b57b562a3ed338feab0fad9141bd2dae5a329a87d2c71fa7c7ffc56a` | REQUEST_CHANGES |
| `704-taiwan-arc-first-application.md` | `8aa828c67ccc8c9ffed1946592e0660bd03e36d4bce4744835a31f7672fa702d` | PASS |
| `705-taiwan-visa-residence-work-study-family.md` | `8935d8bab66031ecfd5c6b01db002fecc8d78e22713365c52214adaaa594c359` | PASS |
| `706-taiwan-arc-renewal-changes-reentry.md` | `6cd3d32cdbe24fa0a74f506cf17198f925d9780e769ad4ac3bf6331212d056f3` | PASS |

## Required bounded editorial repairs

No newly proven statutory falsehood is alleged. The definite failures are two actual sentence-variety regressions and an ambiguous practical calculation sentence. A separate source-precision recommendation follows.

| ID / file:line | Exact sentence or span | Reason and evidence | Proposed bounded rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| PT-C1 / `698-portugal-fim-contrato-taiwan-salarios-em-falta.md:40` | `Se o líquido não bater certo, importa identificar cada desconto em vez de o subtrair simplesmente ao salário bruto.` | The pronoun `o` can refer to the net amount or the immediately preceding deduction. The sentence therefore obscures whether the reader is subtracting net pay or a deduction from gross pay. The informal `não bater certo` is not itself prohibited; the calculation/reference ambiguity is the defect. [LSA 23](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=23) supports inspecting the wage calculation details, not this particular arithmetic instruction. | `Se o valor creditado não corresponder ao esperado, importa conferir o salário bruto, cada desconto e o montante líquido devido.` This is a suggested clear reference to the existing reconciliation task, not a new legal calculation formula. | Yes: practical reconciliation advice only; retain the employer's calculation-detail and five-year retention duties. |
| PT-C2 / `697-portugal-mandatario-processo-civil-taiwan.md:46` and `:52` | `Estas escolhas devem ser discutidas antes de conferir os poderes.` / `Conta a data da notificação processual, não a data em que alguém abriu em Portugal o email de encaminhamento.` | MONOTONY: meaningful short units were expanded or merged after the approved version. Actual CLI now measures 2 short sentences out of 41, `short_share=0.049`, below 0.08, exit 1. Several changed advice sentences use similar medium-length/passive constructions. This does not establish AI authorship; it fails the user's stated prose rule. | Recast only the changed advice passages into natural, uneven information units. Possible concrete units: `A referência é a data da notificação processual.` followed by `Abrir mais tarde o email encaminhado para Portugal não muda essa data.` The previously approved `Discuta estas escolhas antes de conferir os poderes.` is another meaning-preserving option if it fits the author's register. Do not add filler or rewrite the six unaffected articles. Rerun the unchanged CLI on the final prose. | Yes, if procedural service remains distinct from internal forwarding and the special-authority/recorded-limits rules stay intact. These are examples, not a demand to insert a fixed number of short fragments. |
| PT-C3 / `698-portugal-fim-contrato-taiwan-salarios-em-falta.md:34`, `:42`, `:50`, `:52`, `:62` | `Se se tratar de um prémio, convém reunir o plano aplicável, os objetivos, os resultados comunicados e as condições de atribuição ou pagamento.` / `A data da cessação deve, por isso, ficar registada.` / `Há que pedir o fundamento e o cálculo.` | MONOTONY: the post-approval recasts flatten sentence length. Actual CLI now gives `len_cv=0.385`, below 0.45, exit 1, against approved .456. One sentence is not rejected merely for being medium-length; the whole measured regression and the sequence of impersonal advice are the issue. | Adjust the affected local sequence while preserving factual units. For example, the earlier `Registe a data da cessação.` carries a real evidential step, and `Houve uma penalização deduzida ao salário? Peça o fundamento e o cálculo.` carries a concrete next action. The writer may use equally clear non-command wording. Keep the useful two-sentence consultation explanation unless another natural edit is needed; do not mechanically lengthen it to improve CV. | Yes: preserve immediate final wage payment, the limited advance-deduction prohibition, claim classification, evidence presumptions, periods and exceptions. |

The authors must retain every legal qualification, source and FAQ, and record the actual revision date in `lastmod`. A measured pass does not resolve a remaining ambiguous sentence.

## Source-precision recommendation, not a proven legal error

| ID / file:line | Exact sentence | Reason and source | Proposed rewrite | Meaning assessment |
|---|---|---|---|---|
| PT-S1 / `697-portugal-mandatario-processo-civil-taiwan.md:50` | `O juiz pode, quando necessário, ordenar que a notificação seja feita também à própria parte.` | The current [CPC 132](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=132) states the ordinary service-to-agent rule and permits the presiding judge, when necessary, to order service upon the party personally. `também` introduces an additive relationship that this short statutory sentence does not specify. The available text alone does not prove that every possible additive-service reading is legally false, and this review makes no such claim. | `O juiz pode, quando necessário, ordenar a notificação à própria parte.` | Removes an unnecessary interpretive gloss, restoring the previously approved neutral scope. It asserts neither replacement-only nor mandatory dual service. It does not change the article's conclusion about organizing communication and deadlines. |

## Inputs, prior reviews and current evidence

Read the mandatory editorial voice, common voice pointer, complete sentence-variety rule and LESSONS, plus the editorial skill and its review criteria. The retired Fable workflow was not reinstated. Read the Portugal buyer briefs and claim ledger in `docs/audit/nine-market-columns-20261023/research/research-iberia-arabic.md` and the current task's `work/research/firm-profile.md`.

Read the current PASS/repair history in `/Users/son7/tseng-arc-revision-20261024/work/reviews/market-pt-independent.md` and `pt-independent.md`, and the corresponding Portugal sections, legal checks, exact accepted versions and limitations in `final-market-crossborder.md` and `final-europe.md`. These are separate independent locale/final reports. Their old full-file hashes differ now because captions changed; byte comparisons show which bodies are unchanged. Their approvals were not blindly assigned to 697/698's changed prose. They do not themselves certify today's version.

Official sources actually reopened on 2026-10-25:

- [CPC 132](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=132) and [CPC history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0010001): service-to-agent rule and personal-service discretion. The latest law-wide amendment shown is 2023-11-29 and does not amend 132. The English single-article route failed; the Chinese source was directly read.
- LSA [23](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=23), [26](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=26), [30](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=30), and [history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=N0030001): calculation details, five-year records, minute-level attendance/copy duty and advance penalty/damages withholding remain accurately bounded. The latest law-wide amendment shown, 2024-07-31, concerns article 54.
- [LSA Rules 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030002&flno=9) and [history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=N0030002): immediate final wage settlement on termination under the Act; the latest rules amendment, 2024-03-27, concerns article 2.
- Labor Incident Act [37](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010064&flno=37), [38](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010064&flno=38), and [history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0010064): receipt-based wage-character and attendance presumptions remain conditional. Original commencement was 2020-01-01; the 2023-12-15 amendment entered into force on 2024-01-08. The prose does not promise a never-paid bonus or automatic overtime award.
- Fresh unchanged-body spot checks: Civil Code [737](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=737), [309](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=309), [310](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=310), and Arbitration Law [47](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0020001&flno=47) support waiver effects, receipt/discharge distinctions and foreign-award recognition. The Civil Code's pending-commencement notice concerns 166-1 and 1223, not those payment/settlement provisions.
- [Current residence regulation](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129), articles 7, 9, 11, 12 and 20: event-date 30/15-day ground changes, ordinary three-month renewal window, one-year graduate extension/one further extension within two years, Taiwan-resident household-registered spouse category, and re-entry scope match the unchanged ARC prose.
- [Foreign Professionals Act full text](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295), articles 9, 12 and 16: Gold Card term/functions, Taiwan associate-degree-or-above AND approved new-graduate extension condition, and the two sponsor branches/common prior NIA approval remain intact. [Immigration Act full text](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080132), article 22: next-day 30-day first-ARC trigger, integrated-title exception and ordinary three-year maximum match. Single-article attempts failed; actual full-text passages were found and read instead.
- [BOCA visa-exempt entry](https://www.boca.gov.tw/cp-149-4486-7785a-2.html) still lists Portugal among the up-to-90-day nationalities and requires the relevant eligible passport/validity. Portuguese language does not extend Portugal's entry eligibility to Brazilian passports.
- The live [firm contact page](https://tseng-law.com/en/contact) confirms the inquiry email, Taiwan services and EN/ZH/KO/JA consultation boundary. The Portuguese contact-page open failed in this reviewer session; root owns route readback. None of the eight columns promises Portuguese professional consultation, foreign licensure, client results, or human/native/attorney review. Internal `legal-ai-assistant` remains, with no added public author label.

Evidence limits: this is a one-day follow-up, not a new exhaustive immigration/procedure audit. Unchanged detailed fees, NIA portal steps and legal-history matters beyond the refreshed passages rely on the expressly dated 2026-10-24 independent final evidence after byte comparison. Immigration/professionals/residence history URLs failed during this follow-up; their prior checked commencement findings are not relabeled as fresh opens. MOJ displays a 2026-10-16 compilation cutoff. No later conflicting amendment was established. The report does not certify every future change, visual browser rendering, live asset delivery or original artwork licensing paperwork.

## First-two-paragraph deletion review

Each opening sentence was considered for removal, not only checked for stock words.

| Article | Information that would be lost by deleting the opening paragraphs | Finding |
|---|---|---|
| 694 | Immediate waiver versus later instalments; Taiwan-law scope; valid choice/closest connection/characteristic performance; separate forum question. | Retain. The warning is specific to the transaction. |
| 695 | Conflict between Portuguese accounts and supplier claim; sender/recipient reconstruction; official fraud mechanism; distinction between police guidance and contractual loss allocation. | Retain. The former generic tail remains removed. |
| 696 | Taiwan recognition prerequisite and judgment/title effect; award place, applicable arbitration law and debtor identity; foreign-award definition. | Retain. |
| 697 | Settlement authority versus fee agreement; special powers; notification/decision arrangements from Portugal; counterparty/dispute identification. | Retain. The previously removed generic mandate sentence has not returned. |
| 698 | Five-year employer record duty versus claim limitation; who the employer is; distinct salary/overtime/bonus/expense components; employment and cross-border scope. | Retain. |
| 704 | Ordinary resident-visa entry clock and integrated-title exception; direct application needs an eligible category, rather than mere visa-free entry. | Retain. |
| 705 | Conditional residence after visa-free entry; entry is not residence/work permission; Portugal's 90 days, passport validity/ticket conditions; other passports have their own rules. | Retain. |
| 706 | Loss of residence ground despite future printed expiry; conditional exceptions; ordinary three-month renewal window and pre-expiry boundary. | Retain. |

## Three recent same-locale comparators

All eight current manuscripts were read in full, including metadata, FAQ, body, headings, endings and sources. For market 694–698, the three newest Portuguese comparators are `704-taiwan-arc-first-application.md`, `705-taiwan-visa-residence-work-study-family.md`, and `706-taiwan-arc-renewal-changes-reentry.md`, each published 2026-10-24. They open on a first-card clock, entry-category question and loss of residence grounds; their endings concern issuance/work permission, route documents and expired-card records. The market articles instead concern waiver/payment, bank-fraud actors, recognition/debtor identity, mandate powers and individual wage components. No common fictional-scene opener or identical body outline is imposed.

For ARC 704–706, the three recent preceding comparators are `696-portugal-sentenca-arbitral-bens-taiwan.md`, `697-portugal-mandatario-processo-civil-taiwan.md`, and `698-portugal-fim-contrato-taiwan-salarios-em-falta.md`, each published 2026-10-23. Their recognition, settlement-authority and payroll-retention openings differ from the ARC trio. The headings organize legal questions rather than a repeated imperative checklist. Contact wording has a shared true four-language service boundary; substantive endings return to each topic. The post-approval rhythm regressions in 697/698 are not treated as a model to copy.

No new market statistics, search-volume claims or fabricated cases were found. The Portugal-specific creditor, importer, remote-client and returning-worker decisions remain distinct. The ARC series distinguishes Portuguese-passport eligibility from the wider Portuguese-language readership rather than importing Portugal/Brazil immigration law into Taiwan.

## Images

All eight actual local files were opened with `view_image` in this review. Exact paths and SHA-256 values are in `existing-pt-current-evidence.json`.

| Article | Observed image | Alt/caption finding |
|---|---|---|
| 694 | Two cropped people reviewing unreadable sheets, cartons and a harbour background. | Matches document/payment discussion; no claimed actual client. |
| 695 | Cropped person on a phone, laptop and two invoice-layout sheets without readable transaction details. | Matches payment verification. |
| 696 | Pale stone colonnade and empty terrace at low light. | Generic architectural illustration; no named court asserted. |
| 697 | Closed envelope, blank metal discs and desk lamp on wood. | Matches correspondence still life. |
| 698 | Sewing machine, folded cloth, empty chairs and window. | Fictional workplace; no named employer/dispute asserted. |
| 704 | Blank booklet, open document folder, plain card and pen with Taipei backdrop. | Alt accurately identifies principal objects. |
| 705 | Closed laptop, books, two mugs and blank booklet. | Work/study/family objects match the alt. |
| 706 | Blank notebook, booklet, plain card, keys and bag. | Renewal/travel still life matches the alt. |

`Cena fictícia` accurately preserves fictional status. Its brevity is not an error requiring the former long captions to be restored. No missing local image or alt mismatch was found. Root separately verifies production delivery/rendering.

## Actual CLI and rule-section-5 check

Executed unchanged for every article:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute article path> --lang pt
```

| Article | Sentences | CV | Short share | Run3 | Exit | Result |
|---|---:|---:|---:|---:|---:|---|
| 694 | 40 | .454 | .125 | .000 | 0 | OK, no variety limit violated |
| 695 | 35 | .487 | .114 | .091 | 0 | OK, no variety limit violated |
| 696 | 39 | .460 | .103 | .081 | 0 | OK, no variety limit violated |
| 697 | 41 | .454 | .049 | .026 | 1 | FAIL short_share, minimum .08 |
| 698 | 47 | .385 | .106 | .067 | 1 | FAIL len_cv, minimum .45 |
| 704 | 55 | .459 | .182 | .038 | 0 | OK, no variety limit violated |
| 705 | 51 | .467 | .118 | .061 | 0 | OK, no variety limit violated |
| 706 | 59 | .451 | .203 | .035 | 0 | OK, no variety limit violated |

Manual §5: openings have distinct informational functions and no stock hypothetical formula; each retains at least two short factual sentences, although 697 fails the percentage rule; no three identical paragraph starts or repeated claim/citation/caveat chain was found; there are practical non-citation paragraphs; necessary negatives retain legal scope; endings are subject-specific; European Portuguese vocabulary/register is consistent; no bold, invented first-person authority, public byline, or fictional client evidence is introduced. The 695 title/creditor-authority section already supplies the reader's question, so its zero body-question metric does not justify filler. All eight original source-URL sequences and internal provenance are preserved. The two measured failures cannot be waived merely because the prose otherwise reads coherently.

## R1 next bounded step — completed

Separate author `/root/repair_existing_pt` repairs only 697/698, including the ambiguous reconciliation wording and actual rhythm failures. The neutral 132 wording is a precision improvement without asserting a new judicial rule. This reviewer will reread changed passages, affected conclusions and latest hashes, and independently rerun the actual CLI. At most two unsuccessful targeted repair passes are allowed; no metric gaming or wholesale replacement of approved articles. Until recheck, the R1 REQUEST_CHANGES remains on the two hashes above.

## Final independent repair recheck

The first author pass resolved 697. The first author pass for 698 remained below the CV threshold (.435); it was not certified. Its second targeted pass removed the metadiscursive `a primeira tarefa` from the opening and made employer identification a direct information unit, then connected the returning-to-Portugal reader to the existing list of distinct payment claims. The Taiwan-law/contractor/multiple-country qualification is unchanged. This completes the repair within two author passes; no further iteration is requested.

| Finding | Actual final observation | Closure |
|---|---|---|
| PT-C1 | 698:40 now distinguishes `O extrato mostra quanto entrou na conta` from the gross-pay, deduction and net-pay calculation, then expressly compares `este último` (the amount of net pay due) with the bank deposit. This resolves the referent/arithmetic ambiguity. The employer's statutory duties remain in their own opening sentence. | Resolved; practical explanation preserved. |
| PT-C2 | 697:46 uses the concrete instruction `Discuta esses limites antes de conferir poderes` and explains alignment with the court-filed instrument. 697:52 separately records the procedural service date and distinguishes the forwarded email's reading date. These are actual authority/recordkeeping facts, not filler. | Resolved; actual CLI exit 0. |
| PT-C3 | 698:28 identifies the employer and keeps each wage/expense category and governing-law boundary. The colon in :34 connects the two different legal/evidential bases, rather than merely joining unrelated sentences. :50 and :52 restore concise evidence actions. The two-sentence consultation-language statement stays readable. | Resolved; actual CLI exit 0. |
| PT-S1 | 697:50 now says `O juiz pode, quando necessário, ordenar a notificação à própria parte.` It retains the necessary-condition/discretion boundary and does not assert exclusive replacement or mandatory dual service. | Source-neutral clarification accepted; no claim that the former word proved a substantive legal error. |

I repeated the first-two-paragraph deletion check for changed 698: deleting employer identification would remove the party to be pursued; deleting the following payment categories would remove the scope and distinct evidence needs; deleting the final sentence would remove the Taiwan-law/contractor/cross-border boundary. There is no remaining general article preview. The new sentence shapes read as connected Portuguese prose. The unaffected openings/comparisons and subject-specific endings still apply.

Fresh independent CLI output on the final repaired bytes:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-case-trends-20261025/repo/src/content/columns-pt/697-portugal-mandatario-processo-civil-taiwan.md --lang pt
sentences=42 mean=17.3 cv=0.482 short=0.095 run3=0.0 opener_rep=0.133 cite_end=0.0 cite_para=0.4 contrast=0 caveat=0 q=2
OK — no variety limit violated; exit 0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-case-trends-20261025/repo/src/content/columns-pt/698-portugal-fim-contrato-taiwan-salarios-em-falta.md --lang pt
sentences=46 mean=17.0 cv=0.455 short=0.174 run3=0.091 opener_rep=0.125 cite_end=0.0 cite_para=0.625 contrast=0 caveat=0 q=2
OK — no variety limit violated; exit 0
```

Final assertions passed for all eight: source URL sequence unchanged; source-tail bytes unchanged; body digit-token sequence unchanged; frontmatter including FAQ unchanged except actual `lastmod` in 697/698; decorative-bold hits zero; image bytes unchanged; other six full-file hashes unchanged. Written-out periods and legal qualifications were also read manually rather than inferred solely from digit matching. Both repaired files set `lastmod: 2026-10-25` and preserve the 2026-10-23 publication date. The full baseline hashes at `a188e620` were separately computed and match the original independent/final PASS tables.

Final §5 conclusion: all eight measured versions pass; the two repaired files have no remaining monotony finding on manual reading. Concrete procedural directions are permitted and have not become a stock checklist. No change to consultation capability, statutory deadlines, evidential presumptions, article conclusion, image meaning or internal provenance was introduced. I remain independent of the repair author. Final PASS is limited to the exact eight hashes above and the disclosed source-review boundaries; it does not claim build, deployment, HTTP readback, browser QA or guaranteed legal accuracy.
