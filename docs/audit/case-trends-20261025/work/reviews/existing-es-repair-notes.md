# ES 691–692 limited style repair — frozen R1

Date: 2026-10-25. Repair author: `/root/repair_existing_es` (AI editorial role). This is an author repair/self-check record, not an independent locale/legal certification or a publication claim. Independent reviewer: `/root/recheck_market_changes`.

## Scope and root cause

Read both complete current articles, their `a188e620→HEAD` diffs, `market-es-independent.md` from the 2026-10-24 release, the actual current variety evidence, repository `EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, shared `SENTENCE-VARIETY-RULE.md` and `LESSONS.md`, and the editorial skill/review criteria. The home canonical editorial-voice file referenced by the pointer was absent; the complete current repository copy was read. Historical Fable references were not reactivated.

Both files failed only `top_opener_n=3` (limit 2). The current prose changes had made a third paragraph start with `La` in 691 and `Una` in 692. Neither article required changes to its law, factual analysis, sentence lengths, FAQ, image or substantive conclusion. The reviewer independently confirmed that the existing `a188e620→HEAD` changes preserved legal meaning, and suggested a limited reader-action rewrite of the contact sentence.

One repair pass was used. No checker, threshold or sentence segmentation rule was changed. No filler, additional short sentence, added legal claim or arbitrary sentence split was used.

## Exact repairs

| File and line | Before | After | Reason and preservation |
|---|---|---|---|
| `src/content/columns-es/691-spanish-judgment-taiwan-assets-enforcement.md:72` | `La [consulta sobre el asunto taiwanés](/es/contact) puede empezar con un correo a [wei@hoveringlaw.com.tw](mailto:wei@hoveringlaw.com.tw); se atiende en inglés, chino, japonés o coreano, y el idioma se acuerda antes.` | `Puede iniciar la [consulta sobre el asunto taiwanés](/es/contact) escribiendo a [wei@hoveringlaw.com.tw](mailto:wei@hoveringlaw.com.tw); se atiende en inglés, chino, japonés o coreano, y el idioma se acuerda antes.` | Gives the reader a concrete action with an active verb, rather than making the consultation the grammatical subject. Removes the third `La` opening. Same optional email contact, Taiwan-matter scope, four consultation languages and prior language agreement. |
| `src/content/columns-es/692-return-spain-unpaid-taiwan-wages.md:60` | `Una primera [consulta](/es/contact) puede hacerse por correo a [wei@hoveringlaw.com.tw](mailto:wei@hoveringlaw.com.tw); se atiende en inglés, chino, japonés o coreano, y el idioma se acuerda antes.` | `Para una primera [consulta](/es/contact), puede escribir a [wei@hoveringlaw.com.tw](mailto:wei@hoveringlaw.com.tw); se atiende en inglés, chino, japonés o coreano, y el idioma se acuerda antes.` | Replaces the impersonal `puede hacerse` with the reader's action, `puede escribir`. Removes the third `Una` opening without copying 691's syntax. Same optional first contact, email address, four languages and prior agreement. |

The remainder of each contact paragraph is byte-for-byte unchanged, including conflicts/scope information, sensitive-document limits, no retainer formed by email, and the article-specific final document/date. Other body lines are unchanged. Only `lastmod` changed in frontmatter, from 2026-10-24 to 2026-10-25. Published date, display date, summary, titles, topic, audience, internal author, FAQ and every image field are unchanged.

The live [Spanish contact page](https://tseng-law.com/es/contact), opened on 2026-10-25 with the web tool, confirms the four consultation languages, email address, initial sensitive-information limits and that sending a message does not by itself create an attorney–client relationship. The repair does not promise Spanish-language consultation, a response time or acceptance. It does not alter any statutory proposition. Current statute review remains with the independent legal reviewer; this narrow author repair is not a fresh certification of all unchanged law.

## First two paragraphs: deletion test

| Article | Paragraph 1 | Paragraph 2 |
|---|---|---|
| 691 | The certificate sentence answers the actual Spain/Taiwan execution question; the EU sentence establishes the intra-member-state boundary. Removing either loses a different necessary fact. | The article 4-1 sentence gives the Taiwanese execution-judgment requirement and absence of denial grounds; the short following sentence identifies evidence of finality and service. No disposable roadmap or generic introductory claim. |
| 692 | The loss of access to company email explains the evidence trigger. The next sentence identifies records that connect the amount to work, and the final sentence limits collection to lawfully held relevant copies. All three add distinct information. | The first sentence conditions the analysis on the cited Taiwanese labor regime. The second identifies posted-worker, employer-identity and contractor issues requiring classification. The uniform/brand sentence makes the employer-identity problem concrete without inventing a case. |

Both openings are unchanged. They start with different practical problems: cross-border enforceability versus lost access to wage evidence.

## Three recent same-locale comparators

Read the current complete Spanish articles below, all published 2026-10-24. This is a voice/structure comparison, not a re-review of their law.

- `src/content/columns-es/704-taiwan-arc-first-application.md`: starts with a concrete 30-day filing rule, then distinguishes eligible in-country routes; headings follow document preparation, channels, collection and fees. Its ending returns to name, passport data, expiry and the separate labor authorization. Neither repaired article copies that deadline-first opening or administrative sequence.
- `src/content/columns-es/705-taiwan-visa-residence-work-study-family.md`: opens with a real visa-free-entry question and follows work, study and family routes. It ends on matching the reader's available document, passport and planned entry route. The wage and judgment articles keep their own dispute/evidence structures; no added rhetorical question or repeated route-based template.
- `src/content/columns-es/706-taiwan-arc-renewal-changes-reentry.md`: starts with possible cancellation before printed expiry and organizes changes, renewals and travel. Its closing action concerns four dates for a pending trip. The repaired endings remain tied to service/finality records (691) and the oldest unpaid wage date (692), not to a reused generic conclusion.

## Section 5 manual self-check

1. Actual shared CLI with `--lang es`: both exit 0, zero FAIL; outputs and before/after full text are in `existing-es-repair-evidence.json`.
2. No stock hypothetical opener. The two unchanged openings have different functions, and the three recent comparators use different triggers.
3. At least two useful short sentences remain in each. Examples in 691: `Una fecha dudosa debe quedar señalada.` and `Un correo no formaliza el encargo.` In 692: `El contrato permite comprobar lo pactado.` and `El importe reclamado sigue necesitando prueba.` These sentences predate the repair. No new run of long sentences was created; the revised contact sentence is shorter and is followed by the unchanged document/privacy detail.
4. Paragraph openings were read vertically. 691 retains `La` twice and `Una` twice; the contact paragraph now starts `Puede`. In 692, `Una` and `En` occur twice; the contact paragraph starts `Para`. The actual checker confirms no repeated-opener violation.
5. No three-paragraph claim/citation/caveat formula. Citation-free paragraphs concern document organization, evidence or logistics; statutory links remain in the legal paragraphs.
6. Actual checker reports contrast 0 and caveat 0 for both. No reader position was invented to rebut it.
7. The final substantive sentence of 691 still names the missing initial-service/finality certificate. In 692 it still places the oldest unpaid payslip and its due date first. Necessary article-specific general-information notices and official source lists follow, unchanged; no copied sales pitch was added.
8. Natural professional Spanish for Spain. No bold markup, fabricated first-person experience, public byline or imperative checklist heading. Internal author remains unchanged.
9. Ordered Markdown URLs, all body numeric tokens and all frontmatter except `lastmod` are programmatically identical. The exact unified diffs establish that only one contact sentence per article changed. All legal conditions, exceptions, burdens, deadlines, amounts, FAQ, image fields and source dates are preserved.

## Actual commands and frozen versions

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute article path> --lang es`

| Article | Before SHA256 | Frozen R1 SHA256 | CLI result |
|---|---|---|---|
| 691 | `00cbca16a04f4f010325cfdab709e9fdf8060a3573783cdb49df29aff04e2129` | `a43603c866fef8fccbd517f8906d4211a0adea0acfc8f3e2c4010ffa14a2b096` | exit 0; 33 sentences; CV 0.470; short 0.152; run3 0.000; `OK — no variety limit violated` |
| 692 | `dce7864d575ac514a051a48e499c12262551ded1686b6047d798bfb01427c1be` | `b5019f49da8eef11ba689cb1c6f1efcccdb172575dc259712ca09949fbb8fb65` | exit 0; 44 sentences; CV 0.463; short 0.205; run3 0.024; `OK — no variety limit violated` |

`git -C /Users/son7/tseng-case-trends-20261025/repo diff --check -- src/content/columns-es/691-spanish-judgment-taiwan-assets-enforcement.md src/content/columns-es/692-return-spain-unpaid-taiwan-wages.md` returned exit 0, no output.

No publication, build, visual QA, image re-review or public readback was performed by this repair author. The frozen files are ready for the assigned independent reviewer to recheck. Other agents' files were not modified.
