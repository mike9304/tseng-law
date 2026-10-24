# Portuguese ARC revision — independent review

Current verdict: PASS after bounded repair. Date: 2026-10-24. Reviewer: independent AI Portuguese editorial reviewer (`review_rev2_pt`), not the author, not a human native speaker and not a lawyer. No article was edited by this reviewer. Scope is the three Portuguese ARC articles only, not every Portuguese article published today. No publication is claimed.

## Current approved versions

| File under `src/content/columns-pt/` | Current approved SHA-256 |
|---|---|
| `704-taiwan-arc-first-application.md` | `f58697c6f17840eb5c6c8409b109c3d76c80447056d245cfd25741f5e52c0851` |
| `705-taiwan-visa-residence-work-study-family.md` | `223fc2cab54af3d13a8d687d46ae12d37ef6ce3beb0f3b26322e42ff761f66aa` |
| `706-taiwan-arc-renewal-changes-reentry.md` | `88ebef7d3469e19adb2e2a492bdd95f7fb33c41860d9517042864b67a2214b57` |

PT-R1 through PT-R3 are resolved. The independently rechecked author repair also makes two source-supported legal-scope conditions explicit: the Taiwanese spouse's current residence in Taiwan in 704 and the two Article 16(2) sponsor categories with their shared NIA residence/permanent-residence prerequisite in 705 body and FAQ. These additions are legal-scope clarifications, not merely style changes. The bounded recheck evidence and fresh CLI results are at the end of this report. There is no unresolved material finding for these hashes.

## Initial review history — superseded verdict

Initial verdict: REQUEST_CHANGES for the older hashes below. The following original findings are retained as review history and are closed by the final recheck.

The rewrite materially improves the original: the generic five-command sequence in 704 is gone, 705 uses substantive employment/study/family sections, and 706 moves the actual renewal deadline into its opening. The remaining repair is narrow. Two unclear translations in 705 and several redundant admonitions still undermine the user-requested prose repair. The numeric checker passes, but these passages need another edit before this reviewer can certify the revised set.

## Initially reviewed versions — superseded

Repository: `/Users/son7/tseng-arc-revision-20261024/repo`. Original version read in full with `git show 174454bd4bb8d9e05627d71f9ef0af646540b3e4:<path>`. Revised versions read in full, including title, summary, FAQ, headings, ending, sources and image fields.

| File under `src/content/columns-pt/` | Reviewed SHA-256 |
|---|---|
| `704-taiwan-arc-first-application.md` | `e23815074cd055366f8f156ff7f6d686b8d60f0951a63b3777ff5f97838e2075` |
| `705-taiwan-visa-residence-work-study-family.md` | `39d3dda83cd6a18860a79985566c585a98fb4f654226763b016600a2f93db15e` |
| `706-taiwan-arc-renewal-changes-reentry.md` | `bbfe4b55d4813319ebc50885cdfec470897ae92b340afdc4e5ea5954769b036a` |

Read the complete revision and review briefs, repository AGENTS.md and EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, SENTENCE-VARIETY-RULE.md, LESSONS.md, independent review criteria, Portuguese author report and source-refresh report. Retired Fable instructions were not applied.

## Required bounded repair

`704`, `705` and `706` below abbreviate the exact files in the hash table. All proposed changes preserve legal meaning; no new substantive legal correction is requested. The author may use an equivalent natural formulation and must rerun metrics without padding sentences to retain a numerical score.

| ID / File:line | Exact sentence or minimum relevant span | Reason and evidence | Proposed rewrite or action | Legal meaning preserved? |
|---|---|---|---|---|
| PT-R1 / 705:27 and 705:34 | “Não se pode aplicar a entrada da lista relativa a Portugal a um passaporte brasileiro.” / “fica sujeito à entrada correspondente ao seu documento na lista da BOCA” | `entrada` ambiguously means both a table entry and entry into Taiwan. The latter phrase suggests there is a corresponding row for each passport, although the linked BOCA visa-exemption list does not list Brazil. This is an awkward translation of list-entry terminology in the exact reader-facing distinction that the FAQ should clarify. | FAQ: “A isenção prevista para Portugal não se estende a um passaporte brasileiro. A BOCA define as condições de entrada segundo a nacionalidade e o tipo de documento de viagem. O mesmo critério vale para os restantes países de língua portuguesa.” Body: replace the final sentence with “Os passaportes brasileiros e os de outros países de língua portuguesa seguem as regras aplicáveis à respetiva nacionalidade e ao tipo de documento de viagem.” Do not invent a complete Brazilian visa rule here. | Yes. Retains nationality/document conditions and the distinction from Portugal without implying that each passport has a listed exemption. |
| PT-R2 / 705:48 | “O formulário preenchido online deve ser impresso e assinado. Esse envio não conclui o pedido.” | Nothing in the preceding sentence has been sent; it describes printing and signing. `Esse envio` has no clear antecedent and obscures the difference between completing the web form and lodging the visa application. The original explicitly said that filling out the form does not complete the application. BOCA's linked requirements distinguish online completion, printing and signature from applying to the mission. | “O formulário é preenchido online, mas tem de ser impresso e assinado para acompanhar o pedido apresentado à representação de Taiwan.” Preserve the separate form/application distinction in one coherent sentence or an equally clear pair. | Yes. Restores the original procedural meaning; source: linked BOCA full-time student visa page, form requirement and Application Procedure 1. |
| PT-R3a / 704:49 | “A lista aplicável ao pedido de outra pessoa pode, por isso, incluir documentos que não são exigidos no seu caso, ou omitir documentos de que precisa.” | MONOTONY: repeated caution — this sentence spells out the obvious consequence of the preceding two sentences, which already say that requirements and exemptions vary by category and entry route. It retains the original admonition about another applicant's list, merely converting it to a longer declarative sentence. | Delete this final sentence. Keep the first two sentences, the 0915 link and both category/entry conditions. | Yes. No document, exception or requirement is removed. |
| PT-R3b / 705:42 and 705:58 | “O enquadramento laboral determina o procedimento.” / “Esse limite também deve ser tido em conta na aceitação de um emprego a tempo parcial.” | MONOTONY: filler and repeated instruction — the first restates the category distinction that the surrounding professional/migrant-worker paragraphs actually explain; the second tells the reader to take account of the twenty-hour limit immediately after stating that binding limit. Neither supplies an actor, condition, exception or further step. | Delete these two sentences and leave the concrete category provisions and twenty-hour/holiday rule intact. Do not add replacement filler to restore the short-sentence percentage. | Yes. All operative employment conditions and the legal hour limit remain. |
| PT-R3c / 706:55 | “A data em que o titular decidiu atualizar o cartão não altera essa contagem.” | MONOTONY: unnecessary rebuttal — the previous paragraph already defines the start as the day after the event, and this paragraph begins “Conta a data efetiva da mudança.” The additional imagined mistake repeats that point and sounds admonitory. | Delete the final sentence. Retain the effective-change date and the lease/documentary-evidence explanation; the author can connect those sentences more smoothly without repeating the deadline. | Yes. The 30-day next-day rule, effective event date and supporting-document advice remain. |

These are publication-readiness findings for this requested voice repair. They are not an assertion that the whole Portuguese translation is unusable or that its unchanged numerical rules are wrong. No optional cosmetic rewrite is requested elsewhere.

## Improvements supported by original-to-revised reading

- 704 originally used “Na preparação prática, a sequência é simples” followed by “Confirme”, “Reúna”, “Apresente”, “Acompanhe” and “Siga”. Revised line 65 gives the name/passport match, case number, notices, supplementary information, document copy and receipt as one usable process paragraph. The actual student payment/collection clocks follow separately. This is a substantive structural improvement, not synonym swapping.
- 705's original “A pergunta útil para os recursos humanos é concreta … Peça uma cópia … Depois confirme …” is replaced at line 44 by the reason the authorization decision matters: covered functions and their effective start. The relevant employer/HR source stays. The reader is no longer coached through an artificial dialogue.
- 706 originally opened its second paragraph with “Coloque lado a lado o ARC…” and “Acrescente…”. Revised line 33 states the actual ordinary three-month renewal window, pre-expiry requirement and absence of a general extra period. Document comparison has moved to the renewal section, where it supports the relevant decision.
- Titles, summaries and headings no longer share a uniform compare/check/prepare formula. The short sentences stating the clock, file-size limit, one-year first spouse authorization and six-month Mandarin extension maximum carry facts. They are not rejected merely for being short.

## First-two-paragraph deletion test

- 704: paragraph 1 supplies the resident-visa entrant, duty, 30-day limit, next-day start, statutory source and integrated-title exception. Removing any of those functions loses real scope. Paragraph 2 changes the entry category and limits direct applications to a lawful route; its NIA categories and companion link explain the alternative. The earlier language/intention scolding was correctly removed. No further opening deletion is required.
- 705: paragraph 1 asks whether visa-free entrants can obtain residence, answers conditionally and separates a limited visit from residence/work authorization. Paragraph 2 adds the eligible Portuguese passport, ninety days, six-month passport validity and onward/return ticket. Its final sentence must remain in substance to distinguish other passports, but needs the PT-R1 terminology repair. Neither paragraph is a generic preview of the article.
- 706: paragraph 1 explains why the printed date does not preserve a lost residence ground and identifies the statutory conditional exceptions. Paragraph 2 supplies continued-ground status, the ordinary renewal window and pre-expiry boundary. These are useful facts. The general no-grace-period sentence is an operative scope clarification, not the redundant personal-date admonition identified later at line 55.

## Independent comparison with three recent Portuguese columns

All three were independently read in full from this repository, not accepted only from the author's comparison. Publication date for each: 2026-10-23. Existing samples are not treated as perfect prose or as an instruction to repeat their imperatives.

| Comparator | Concrete opening / headings / ending observations | ARC comparison |
|---|---|---|
| `src/content/columns-pt/696-portugal-sentenca-arbitral-bens-taiwan.md` | Opens with Taiwanese recognition before execution; the next paragraph asks where the award was rendered. Headings cover the incoming file, refusal grounds and notification/assets. The final substantive line connects agreement, award and notices to the same debtor. | 704 similarly starts with a duty but develops an application rather than a litigation evidence file. Its final substantive paragraph concerns title data and work authorization. Neither contact template nor debtor-file ending was copied. |
| `src/content/columns-pt/697-portugal-mandatario-processo-civil-taiwan.md` | Opens with a concrete settlement-authority question. Headings separately address representative qualification, special powers and transmission of notices. Its ending asks who can settle and receive money. | 705's real question is entry-category eligibility. Work, study and family rules determine its sections, and the ending names evidence for the selected route. It does not import a mandate/decision-authority structure. The comparator itself has repeated instructions; they are not a reason to retain PT-R3 filler. |
| `src/content/columns-pt/698-portugal-fim-contrato-taiwan-salarios-em-falta.md` | Opens with a five-year record-retention rule and distinguishes the claim period. Headings address payment characterization, time records, deductions and due dates. The ending names the fields in an individualized claim schedule. | 706 starts with ground-loss consequences and renewal timing, then separates changes, replacement and travel. Its expiry-record ending is specific to residence. It does not copy the numerical payroll opening or force a rhetorical closing question. |

## Law, numbers, sources and packaging

A separate comparison against the original commit found identical Markdown destination multisets for all three articles, including repeated URLs. No source or internal link was added or lost. Each complete `## Fontes oficiais` tail is byte-for-byte identical. Numeric-token differences are only the removed 1–5 list numbering in 704; 705 and 706 have no digit-token change. Written-out numbers and operative conditions were also read manually, rather than relying on that digit comparison.

Preserved substantive items include: the two distinct first-ARC 30-day triggers; category/entry restrictions; spouse household-registration category and first-year maximum; authentication and possible Chinese translation; student 512 KB, payment five working days and collection after three working days; NT$1,000 yearly fee including partial years, NT$2,200 additional fee and limited student reduction; general three-year validity and special regimes; ten/five-working-day processing limits and restart after supplementation; Portuguese ninety-day visit and six-month passport; professional/migrant-worker distinction; Mandarin four completed months plus at least three more, fifteen weekly hours and quarter-absence ceiling; twenty-hour student work rule outside the specified holidays; family eligibility and work exemption; Gold Card one–three years; ordinary three-month and special four-month renewal windows; six-month Mandarin extension and in-principle two-year total; formal-graduate one-year extension/one repeat/two-year maximum; Taiwan associate degree or above AND NIA-approved recent-graduate extension for the work-permit exemption; next-day 30-day address/workplace reporting versus event-day 30/15-day ground-change procedures; NT$500 replacement; reentry/exit/pending-case limitations. No substantive weakening or expansion was detected in this assigned Portuguese comparison.

Current official spot checks were opened independently on 2026-10-24:

- [BOCA visa-exempt entry](https://www.boca.gov.tw/cp-149-4486-7785a-2.html): Portugal and its ninety-day program, passport validity, and the absence of a Brazil row support PT-R1's precise wording concern.
- [BOCA full-time student visas](https://www.boca.gov.tw/cp-166-283-c4da3-2.html): the form and mission-application steps support PT-R2; the visitor-study route and ordinary entry exclusions remain distinct.
- [NIA student guide 0929](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news): student upload, payment, collection and Mandarin extension provisions align with the retained numbers.
- [Current residence regulations](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129): Articles 7, 9, 11 and 12 retain the corresponding changes/renewal/graduate/spouse limits.
- [Current foreign-professionals law](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0030295): Article 12 retains the conjunctive Taiwan-degree and NIA-approved recent-graduate extension conditions. A direct single-article URL initially failed; the full official text opened successfully. The source-refresh report supplies the broader commencement/history audit; this locale report does not claim a second exhaustive law-history review.

The three generated WebP images were actually opened with `view_image`. 704 shows the blank booklet, folder, plain card and pen; 705 shows the closed laptop, books, two mugs and booklet; 706 shows the blank notebook, booklet, card, keys and bag. Each has Taipei through a window. Portuguese alt/captions accurately describe their principal objects and illustrative status. No real person, readable official document, flag, logo or identity-card replica was observed. Not every background object needs to be listed in alt text. Exact image paths are present in frontmatter, with no duplicate inline image.

Internal author metadata is unchanged; no public author/reviewer claim, fake human/native review, invented experience, new consultation-language promise, promotional ending or bold markup was found. Portuguese vocabulary is consistently European (`morada`, `registo`, `ficheiro`, `entidade empregadora`, `chávenas`). No Portuguese immigration law has been imported into the Taiwan-law explanation.

## Exact CLI and section 5 manual check

Executed for each file from the repository with the unchanged checker:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-pt/704-taiwan-arc-first-application.md --lang pt
sentences=56 mean=17 cv=0.456 short=0.179 run3=0.0 opener_rep=0.222 cite_end=0.0 cite_para=0.278 contrast=0 caveat=0 q=1
OK — no variety limit violated; exit 0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-pt/705-taiwan-visa-residence-work-study-family.md --lang pt
sentences=53 mean=18.3 cv=0.45 short=0.132 run3=0.059 opener_rep=0.056 cite_end=0.0 cite_para=0.5 contrast=0 caveat=0 q=1
OK — no variety limit violated; exit 0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-pt/706-taiwan-arc-renewal-changes-reentry.md --lang pt
sentences=60 mean=17.5 cv=0.45 short=0.2 run3=0.034 opener_rep=0.286 cite_end=0.0 cite_para=0.476 contrast=0 caveat=0 q=1
OK — no variety limit violated; exit 0
```

1. Exact automated check: three measured passes, zero FAIL. A pass does not resolve the prose findings above.
2. No stock hypothetical opening. Across this three-article batch the functions are duty, eligibility question and loss-of-ground consequence. No invented scene.
3. At least two useful short factual sentences in each article. Paragraphs are not uniformly short or identically shaped. The graduate-exemption sentence is long because its conjunctive legal conditions matter; it must not be simplified to an inaccurate blanket rule. The independent read nevertheless rejects the content-free short sentence at 705:42.
4. Paragraph starts read vertically show at most two occurrences of any identical first word in each body: no forced omission of ordinary Portuguese articles to change the metric.
5. No three consecutive claim/citation/caveat paragraphs. There are practical evidence/process paragraphs without citation-ending chains. Citations remain with their legal propositions.
6. The detector counts zero rhetorical-contrast templates, but manual reading still finds unnecessary personal-date rebuttal at 706:55 and the repeated caution at 704:49. These need the stated bounded removals; necessary negative legal conditions remain.
7. The substantive endings concern received title/work authorization, supporting documents/ground changes, and expired-ARC records respectively. No sales close or copied general summary was added. Companion links and sources are structural tails.
8. Professional Portuguese register, no forced imperative checklist headings, no bold and no invented first-person authority. PT-R1/R2 are the remaining reader-facing terminology/coherence defects.
9. Legal numbers, starting points, exceptions, links and internal provenance remain intact, subject to the exact limited source-review scope stated above.

Initial next action was the bounded author repair of PT-R1 through PT-R3, with an actual checker rerun and no short filler. That action is complete; the original REQUEST_CHANGES applied only to the initially reviewed hashes.

## Final bounded recheck — PASS

The author returned the three current hashes shown at the top. The revised manuscripts were reopened in full; the recheck focused on the requested passages, newly clarified legal scope, affected FAQs, first two paragraphs and endings. The actual file hashes match the author's return. The reviewer remains independent and made no article edits.

| Finding | Final observation | Status |
|---|---|---|
| PT-R1, 705:27/34 | The FAQ now says “A isenção prevista para Portugal não se estende a um passaporte brasileiro” and describes the nationality/document criterion. The body uses “regras aplicáveis à respetiva nacionalidade e ao tipo de documento de viagem.” The ambiguous list-entry wording and implied universal table row are gone. | Resolved |
| PT-R2, 705:48 | “O formulário é preenchido online. Depois de impresso e assinado, deve acompanhar o pedido apresentado à representação de Taiwan.” The actual sequence is explicit; no unexplained `envio` remains. The short first sentence has a procedural fact and is not padding. | Resolved |
| PT-R3a, 704:49 | The unnecessary comparison with another applicant's list is deleted. Entry route, category, NIA 0915 source and requirements/exemptions remain. | Resolved |
| PT-R3b, 705:42/58 | Both the generic labor-framework sentence and the repeated instruction to account for the hour limit are deleted. Professional/migrant-worker categories and the twenty-hour rule with the summer/winter holiday exception remain. No replacement filler was added. | Resolved |
| PT-R3c, 706:55 | The imagined mistake about the day on which the holder decided to update the card is deleted. The effective event date and documentary explanation remain, with the next-day 30-day clock in the preceding paragraph. | Resolved |
| Additional legal-scope clarification, 704:47 | “cidadão taiwanês que reside em Taiwan e aí tem registo de agregado familiar” now expressly preserves both current Taiwan residence and household registration. The first dependent-residence application and one-year maximum remain. | Verified |
| Additional legal-scope clarification, 705:29/64 | The ordinary-professional branch requires professional work in Taiwan; the specialist branch remains separate. “em qualquer dos casos” in the body and “Em ambos os casos” in the FAQ clearly apply prior NIA residence OR permanent-residence approval to both branches. Defined spouse/minor-child/dependent-disabled-adult-child scope and visa-free/visitor entry remain in the body. | Verified |

For the added legal scope, this reviewer opened the official [foreign-professionals law Article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) and the official [residence regulation Article 12 in its full text](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129) during this recheck. The former supports the two sponsor branches with the common prior NIA approval; the latter supports current Taiwan residence AND household registration for the described first spouse-ARC category. The single-article residence-regulation URL failed, so the full official text was used successfully. The final-law review supplies the broader current-law/history audit; no exhaustive second legal audit or human legal certification is claimed here.

The longer Article 16 sentence is justified: the shared condition must attach unambiguously to both branches. Its following sentences identify entry categories and family members, so the prose proceeds through related information rather than adding empty emphasis. FAQs and the substantive endings remain coherent. Existing image descriptions and captions remain accurate for the three images actually inspected in the initial review. Source destination multisets still match the original commit exactly, and every `Fontes oficiais` tail remains byte-identical. No author byline, consultation-language expansion, bold or fabricated experience was introduced.

Fresh independent CLI execution on the approved hashes:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-pt/704-taiwan-arc-first-application.md --lang pt
sentences=55 mean=16.9 cv=0.459 short=0.182 run3=0.038 opener_rep=0.222 cite_end=0.0 cite_para=0.278 contrast=0 caveat=0 q=1
OK — no variety limit violated; exit 0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-pt/705-taiwan-visa-residence-work-study-family.md --lang pt
sentences=51 mean=19.1 cv=0.467 short=0.118 run3=0.061 opener_rep=0.111 cite_end=0.0 cite_para=0.5 contrast=0 caveat=0 q=1
OK — no variety limit violated; exit 0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-pt/706-taiwan-arc-renewal-changes-reentry.md --lang pt
sentences=59 mean=17.6 cv=0.451 short=0.203 run3=0.035 opener_rep=0.286 cite_end=0.0 cite_para=0.476 contrast=0 caveat=0 q=1
OK — no variety limit violated; exit 0
```

Section 5 recheck: all three are measured passes; openings still perform different concrete functions; each retains at least two useful short sentences without filler replacement; no repeated paragraph-start or claim/citation/caveat chain was introduced; the manually identified redundant caution/rebuttal is removed; necessary legal negatives are retained; endings stay tied to each subject; professional Portuguese register and no-bold/no-fictional-authority rules hold; all numerical rules, clocks, sources and internal provenance remain. The legal-scope additions above are separately disclosed and supported rather than mislabeled as prose-only changes.

Final verdict: PASS for the three current exact hashes at the top. No remaining material editorial or translation finding in this assigned scope. This report certifies the manuscript recheck, not deployment or all Portuguese columns published today.
