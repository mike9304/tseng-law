# Portuguese 697–698: author repair record

Date: 2026-10-25. Owner: `/root/repair_existing_pt`. Scope: only the two named Portuguese articles and `work/reviews/existing-pt-repair-*` evidence. This is an author self-check, not independent approval or evidence of publication. Independent reviewer: `/root/recheck_pt_current`.

## Versions and evidence

The starting articles include commit `3519c561` (the latest content change on these paths). The comparison with approved release `a188e620` also includes the separate caption change `a374a220`. Captions and all other frontmatter were preserved except `lastmod`, now `2026-10-25`.

| Article | Before SHA-256 | Frozen repaired SHA-256 | Completed passes |
|---|---|---|---|
| 697 | `5413c3f5b967adf73725ec3b58b12dfdb76b5ca43f301394e91929c6c5f56a0a` | `bc44b8c1b2fc0f7931e0ddf3c8a8b958acae51837c22b30e91a04d4405354fb8` | 1 |
| 698 | `bd4b5411b57b562a3ed338feab0fad9141bd2dae5a329a87d2c71fa7c7ffc56a` | `5eae522ecf7223fb96e7564b70c209dad74dac644b98fc30d06bf8126198a811` | 2 |

Paths:

- `src/content/columns-pt/697-portugal-mandatario-processo-civil-taiwan.md`
- `src/content/columns-pt/698-portugal-fim-contrato-taiwan-salarios-em-falta.md`

Machine evidence: `existing-pt-repair-before.json`, `existing-pt-repair-pass1.json`, `existing-pt-repair-final-evidence.json`. These preserve the starting texts, the unsuccessful first 698 pass, exact CLI commands/outputs, final hashes and integrity comparisons.

## Exact repairs and legal effect

| Location | Before | After and reason | Meaning / legal scope |
|---|---|---|---|
| 697, Art. 132 paragraph | `O juiz pode, quando necessário, ordenar que a notificação seja feita também à própria parte.` | `O juiz pode, quando necessário, ordenar a notificação à própria parte.` | Substantive clarification: removes the added implication of simultaneous/additional service. Not characterized as a mere synonym change. The preceding rule about unrestricted service authority remains intact, and neither mandatory dual service nor service exclusively instead of the representative is asserted. |
| 697, reserved powers | `Estas escolhas devem ser discutidas antes de conferir os poderes. Limites comunicados informalmente devem ser compatibilizados com o instrumento apresentado ao tribunal.` | `Discuta esses limites antes de conferir poderes. O instrumento apresentado ao tribunal deve refletir também os limites comunicados informalmente.` | Keeps discussion before granting powers and consistency between informal limits and the filed instrument. Practical advice is expressed directly rather than as impersonal passive prose. Negotiation/acceptance and enforcement/receipt distinctions stay unchanged. |
| 697, service date | `Conta a data da notificação processual, não a data em que alguém abriu em Portugal o email de encaminhamento.` | `Registe a data da notificação processual. A data em que alguém abre o email de encaminhamento em Portugal não a substitui.` | Keeps the procedural service date and forwarded-email opening date distinct. Restores a concrete recording instruction. The replacement does not introduce a new deadline or commencement event. |
| 698, second opening paragraph | `Para um profissional português que termina um emprego em Taiwan, a primeira tarefa é identificar o empregador e discriminar o valor reclamado. Salário do último mês, trabalho suplementar, prémio e reembolso de despesas podem exigir fundamentos e provas diferentes.` | `A reclamação deve identificar o empregador. Para quem regressa a Portugal, convém discriminar os valores reclamados: salário do último mês, trabalho suplementar, prémio e reembolso de despesas podem exigir fundamentos e provas diferentes.` | Removes the generic “first task” frame. Keeps the employer, itemized amounts, Portuguese return context and distinct grounds/evidence. The following Taiwan-law scope, services-contract exception and work-across-countries qualification are unchanged. |
| 698, salary / expenses / bonus paragraph | Separate medium-length sentences saying salary and ticket reimbursement cannot be added without explanation, then identifying their distinct grounds. | A single connected comparison names the two rubrics and immediately explains why their grounds differ. `Se se tratar de um prémio` becomes `Para o prémio`. | The colon follows a real explanatory relationship. Remuneration obligation, expense agreement, trip documents, bonus plan, targets, reported results and attribution/payment conditions remain. `Não se presume que todos os prémios sejam salariais ou devidos.` is unchanged; no new blanket rejection of the statutory presumption was added. |
| 698, statement / deductions paragraph | `Esses elementos podem ser confrontados com os valores creditados na conta. Se o líquido não bater certo, importa identificar cada desconto em vez de o subtrair simplesmente ao salário bruto.` | `O extrato mostra quanto entrou na conta. Para apurar se falta algum valor, é preciso conferir o salário bruto, cada desconto e o montante líquido devido, antes de comparar este último com o depósito bancário.` | Makes the object of comparison explicit: net amount due versus actual bank deposit, after checking gross pay and deductions. This is practical reconciliation guidance, not a new statutory duty. The Art. 23 duty to provide calculation details and retain records for five years is unchanged. |
| 698, termination date and deducted penalty | `A data da cessação deve, por isso, ficar registada.` / `Há que pedir o fundamento e o cálculo.` | `Registe a data da cessação.` / `Peça o fundamento e o cálculo.` | Restores specific, useful instructions instead of impersonal padding. The termination trigger, immediate salary settlement, prohibition on advance salary retention for penalties/damages and limitation on what Art. 26 resolves remain unchanged. |

Official source opened by this repair author on 2026-10-25: [CPC Article 132](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=132). Its Chinese text provides service to the representative where service authority is unrestricted, with judicial discretion to order service on the party when necessary. The independent reviewer separately opened the same official provision. This author did not re-certify every other statutory source; the unchanged legal analysis and the independent review retain their separate evidence boundaries.

## First two paragraphs: deletion check

697:

- The opening question identifies the decision that may bind the company in Portugal; removing it leaves “A resposta” without its referent and loses the cross-border client decision.
- The next sentence supplies Article 70's special-authority requirement and source. Removing it loses the legal answer.
- The final opening sentence distinguishes reading the grant of authority from reading the fee agreement. It adds a document distinction relevant to the decision.
- The next paragraph adds notification recipients, decision-making within procedural deadlines, the opposing party and litigation object. These are not a preview of the article. Removing individual sentences loses those practical facts.

698:

- The first sentence gives the employer's five-year record-retention duty, with Article 23. It is not presented as the deadline for every salary claim.
- The second sentence explains the records' use in checking the final settlement. The third separates that retention period from the claim's own due-date/limitation analysis. They perform different functions.
- The second paragraph formerly began with the formula “a primeira tarefa”. The final version identifies the employer directly and explains itemization through the different grounds and evidence for salary, overtime, bonus and expense claims.
- Its final sentence preserves the condition that Taiwanese employment legislation applies, plus the need to examine service contracts and work divided between countries separately. It cannot be deleted as introductory padding.

## Three recent Portuguese comparators

All three current source files were read for their first two paragraphs, headings and closing paragraphs. Published date for each: 2026-10-24.

| Comparator | Opening / structure / ending observed | Difference in repaired articles |
|---|---|---|
| `704-taiwan-arc-first-application.md` | Opens with the resident-visa ARC deadline; headings concern documents, Portuguese certificates, filing and fees; ends with checking card details and the separate work-authorization requirement. | 697 begins with authority to settle, then representation/service/document scope. 698 begins with wage-record retention and claim timing. Neither copies the ARC sequence. |
| `705-taiwan-visa-residence-work-study-family.md` | Opens with a visa-free-entry residence question; compares employment, studies, family and special routes; closes on selecting supporting documents and updating the residence basis. | 697 also uses a question, but it concerns a concrete company decision and powers; 698 uses a statutory period. Headings and endings are specific to civil representation and payroll evidence. |
| `706-taiwan-arc-renewal-changes-reentry.md` | Opens with loss of the residence basis; proceeds through renewal, changes and travel; closes with expiry evidence and links to related guidance. | The 697 closing asks who can settle and receive recovered money. The 698 closing specifies each claim item's basis, period, due date and payment received. Neither adds a generic “contact our experts” conclusion. |

## Sentence-variety rule section 5 self-check

1. Exact command for each file: `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute article path> --lang pt`. Final 697: 42 sentences, mean 17.3, CV 0.482, short share 0.095, run3 0.000, contrast 0, questions 2, exit 0, `OK — no variety limit violated`. Final 698: 46 sentences, mean 17.0, CV 0.455, short share 0.174, run3 0.091, contrast 0, questions 2, exit 0, same OK. The first 698 pass was retained with its CV 0.435 failure; it is not described as passed.
2. No stock invented-scene opener. These two repaired articles use different opening types: client-authority question and concrete statutory retention period.
3. At least two meaningful short sentences in each article. Examples: 697 `Que decisão ficará reservada ao cliente?`, `Registe a data da notificação processual.`; 698 `A reclamação deve identificar o empregador.`, `Registe a data da cessação.` No filler sentence was inserted just to change a metric. Long explanations connect a legal condition or an actual comparison; no paragraph contains a stack of long sentences.
4. Paragraph beginnings were read vertically. The final CLI detects no opener repetition failure. The 698 opening edit reduces the unnecessary repeat of `Para` at paragraph starts.
5. No three successive claim/citation/caveat paragraphs. Practical communication/document guidance in 697 and legitimate evidence preservation in 698 provide non-citation paragraphs without unsupported new legal conclusions.
6. No newly introduced contrast formula. The replacement gross/net paragraph explains the calculation directly instead of rebutting an unspecified subtraction.
7. Last substantive paragraphs remain tied to each issue: authority to settle/receive money; or itemized wage claim basis, period, due date and payment. Existing sources and concise legal-information scope notice remain separate structural tails.
8. European Portuguese terminology retained: `procuração`, `mandatário`, `notificações`, `registo`, `receção`, `prémio`, `indemnização`, `extrato`. No new invented experience, human-native/attorney review claim, public byline, bold markup or imperative checklist heading. Narrow practical instructions remain permissible.
9. Programmatic before/after checks: URL sequence identical (697: 12; 698: 23); body digit sequence identical; full source sections identical; FAQ identical; frontmatter identical after excluding only `lastmod`. Manual checks preserve `cinco anos`, `até ao minuto`, each presumption's evidentiary condition, statutory exceptions and Taiwan-law applicability. `git diff --check` returned exit 0. Bold-pattern search returned no matches.

## Handoff limits

The frozen source was sent to `/root/recheck_pt_current` for independent review. That reviewer returned PASS on the exact final hashes above, after reading both complete articles and rerunning the CLI independently. Its separate evidence is in `work/reviews/existing-pt-current.md` and `work/reviews/existing-pt-current-final-evidence.json`; that independent report, not this author record, provides the approval.

No other Portuguese article, shared registry, image, build, deployment setting or public site was modified by this author. No publication claim is made. Root may incorporate this record into the repository's `docs/audit/` evidence when packaging the reviewed change; this agent's ownership was restricted to task-local review notes.
