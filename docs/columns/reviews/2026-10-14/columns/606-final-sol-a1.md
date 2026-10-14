# C1 final review — GPT-6 Sol — 2026-10-14

Verdict: PASS. The four current language files and the supplied image are publishable as supplied. I made no edits.

## Scope checked

Read in full: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C1.md`, `drafts/C1/{ko,ja,en,zh-hant}.md`, `drafts/C1/facts.md`, and `research/C1-statutes.md`. The fact sheet was an inventory, not evidence. No judgment is cited and `research/judgments/` has no C1 judgment text. The requested `~/agent-library/knowledge/editorial-voice.md` path is absent; the supplied complete editorial brief and repository editorial copy provide the applicable text. Read the sentence-variety rule, including sections 5–6, and the recurring mistakes in `LESSONS.md`. Compared C1 openings with C2–C6 and with the three preceding local published columns in each language.

Independently fetched all 15 distinct cited external URLs with `curl -L --fail` on 2026-10-14; all returned HTTP 200. Read the current Chinese single-article pages for 勞動基準法 Articles 2 and 28, 勞動基準法施行細則 Article 2, and 積欠工資墊償基金提繳及墊償管理辦法 Articles 2, 7, 8, 9 and 10, plus the full-text law pages and the official English translations cited by EN. Read the substantive sections of both Bureau of Labor Insurance pages, including FAQ 7 in the body of the page whose HTML title is misleading. The retrieved law-level amendment dates are 2024-07-31, 2024-03-27 and 2015-05-20; the BLI page update dates are 2023-12-19 and 2023-11-28. Each matches the drafts. No draft labels an amendment date as the effective date. Retrieved source HTML and extracted text are under `/private/tmp/c1-sol-official/`.

Viewed `images/C1.webp` directly. This is an artifact review, not a deployed-page check.

## Law and facts, checked in each language

| Language | Result |
|---|---|
| KO | The three alternative triggers, employer and worker definitions, statutory priority, pro-rata sharing and priority of the unpaid remainder match Articles 2 and 28. The wage period is separated from the combined retirement-pay/severance advance cap. The hypothetical 1:3 claims sharing a pool of 2 yield one-quarter and three-quarters (0.5 and 1.5); the arithmetic is correct. |
| JA | The same trigger, claim types, rank and advance limits are preserved. 退休金 is tied to the Labor Standards Act; 資遣費 can arise under that Act or the Labor Pension Act. The procedural proof and unpaid-demand conditions match Articles 7–10 and the BLI guidance. |
| EN | “Adjudicated bankruptcy” correctly retains 宣告破產. The definitions, average-wage total-day denominator, limited 60-percent floor, contribution alternative, BLI pre-event wage window and discretionary Article 9 evidential fallback are accurately distinguished. The official English title of the fund regulations is used. |
| ZH-HANT | The three triggers, initial parity with first-priority secured claims, proportional distribution, unpaid-remainder priority, fund limits and proof routes match the Chinese official text. The BLI link now appears in the temporary-stoppage paragraph and supports that separate condition. |

Across all four, Article 28 paragraph 1 does not become a guarantee of full recovery or an initial rank above all first-priority security. Paragraph 2 advances contract wages in the statutory under-six-month portion and caps retirement pay plus severance together at six months of average wage; the BLI page describes the wage window as the six months before the event. Paragraph 5 requires a worker's unpaid request and employer reimbursement. Article 7 allows contributions already paid or arrears later paid; the drafts do not turn those alternatives into cumulative conditions. The employer's insured salary is the contribution base, not the Article 2 average-wage formula. All four distinguish a temporary stoppage with a prospect of resumption from the three statutory events. No cross-language legal contradiction was found.

## Citations and publication rules

The body links for statutory claims target the correct article URLs. The BLI guidance supports the wage window, foreign-worker parity, temporary-stoppage exclusion and documentary alternatives. The source sections contain every external URL used in each body and the required 2026-10-14 check date. No judgment link or foreign-law assertion is present. The same-language internal links exist; all four prescribed lint runs returned `OK` and checked those targets. The frontmatter keys, dates, topic, audience, author, three FAQs, literal `NNN` image path and H1/title match the batch brief. EN has the required 32-character `seoTitle` because its title plus site suffix exceeds 60 characters; its summary is 157 characters and contains no forbidden character.

No private-party name, bold text, telephone or hotline, street address, messaging ID, attorney byline, lawyer-review claim or native-review claim appears. Each version has one soft firm-and-email contact paragraph. The examples are explicitly fictional and assume covered employment; none assigns a shareholder parent liability merely for ownership. No current contribution rate, numeric processing deadline or employer repayment day-count is asserted.

## Voice and variety

KO reads in 합니다체, JA in です・ます, EN in plain active English, and ZH-HANT uses Taiwan legal and everyday terms. The titles identify this column's wage-priority/fund issue without a command or clickbait. The opening paragraphs give a trigger, a direct question, a statutory rule or a labelled payroll scene. The closing paragraphs return to the examples and the specific proof and limit questions, after the brief contact line; they are neither stock disclaimers nor sales closings. No repetitive checklist headings appear.

Commands run on each final language file:

`python3 /Users/son7/tseng-col-1014-work/lint.py /Users/son7/tseng-col-1014-work/drafts/C1/<lang>.md <lang> taiwan-unpaid-wages-insolvent-employer-payment-fund`

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1014-work/drafts/C1/<lang>.md`

| Language | Lint | Length | Variety FAIL | Very short sentence share | CV |
|---|---|---:|---:|---:|---:|
| ko | OK | 3,488 characters | 0 | 13.7% | 0.510 |
| ja | OK | 3,917 characters | 0 | 12.4% | 0.455 |
| en | OK | 1,557 words | 0 | 21.8% | 0.520 |
| zh-hant | OK | 2,698 characters | 0 | 13.2% | 0.562 |

Manual sections 5–6 check: each language has at least two very short sentences; no stock hypothetical opener; no three paragraphs with the same opening word; no three consecutive claim–statute–caveat paragraphs; and a citation-free hypothetical paragraph. The checker reports zero contrast templates in every language, and the prose does not rebut an invented reader claim. C1's four opening types are differentiated in the batch. KO and JA each receive a 98% same-register-ending `WARN`, not a `FAIL`; both retain the prescribed register and sentence lengths vary. No two unmet self-check items or MONOTONY failure. In the first two paragraphs, removing the trigger/question/scene or its coverage and hypothetical qualifier would lose the stated context or legal scope. No variety edit was made, so no fact, number, link or fiction label was lost.

## Issues and edits

Publication-blocking issues: none. There is therefore no `Original → problem & reason → fix → facts preserved` entry requiring a change. Minor edits applied: none.

## Image verdict

OK — directly viewed. An empty tailoring workshop with an idle sewing machine and folded plain fabric suits the employer-closure subject. The scene is generic and respectful; no faces, identifiable people, readable documents, readable text, flags or identifiable logos are visible. The faint wall grid has no legible content.

VERDICT: PASS
