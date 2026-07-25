# WO-I18N-EN-COL014 — Taiwan Minimum Service Period Clauses Current-Law Rewrite

Date: 2026-07-25 KST
Manager: Codex `/root`

## Objective and bounded file ownership

Completely rewrite the English version of column 014 as native, professional
English guidance on Taiwan minimum service period clauses. The result must be
based on the current Taiwan Labor Standards Act and the Taiwan Ministry of
Labor's June 5, 2026 administrative guidance. This is not a line-by-line
translation of the Korean or Traditional Chinese article and is not a polish
pass over the legacy English article.

The writer owns only these two files:

1. `src/content/columns-en/014-taiwan-mandatory-employment-period.md`
2. New file `src/lib/__tests__/columns-en-labor-014.test.ts`

The writer must comply in full with the master contract:

`docs/audit/WO-I18N-COL014-EDITORIAL-LEGAL-CONTRACT-2026-07-25.md`

Do not edit Korean, Traditional Chinese, or Japanese content; public data;
shared code; images; embeddings; aliases; redirects; another test; this work
order; or the master contract. Do not stage, commit, push, deploy, publish, or
operate a server. Only the manager may make an approved local commit after all
review gates pass. Push and deployment require separate user approval.

## Primary-law and official-guidance boundary

Legal propositions may rely only on these four official sources:

1. Taiwan Labor Standards Act Article 15-1:
   `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15-1&pcode=N0030001`
2. Taiwan Labor Standards Act Article 15:
   `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15&pcode=N0030001`
3. Taiwan Labor Standards Act Article 16:
   `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=16&pcode=N0030001`
4. Taiwan Ministry of Labor Letter No. 勞動關2字第1150141814號, issued
   June 5, 2026:
   `https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?cnt=926&datatype=etype&edate=99991231&lnabndn=1&now=1&recordno=10&sdate=20180000`

The first three sources are provisions of the Labor Standards Act. The fourth
source is Ministry of Labor administrative guidance. Do not call the Ministry
letter a statute, regulation, amendment, court decision, binding precedent, or
new Article 15-1 rule. Attribute its statements expressly to the Ministry or
the letter.

Do not cite or rely on news, blogs, law-firm commentary, social media, an
unidentified court case, or an anecdote as authority. Do not invent facts,
costs, occupations, contract periods, client scenarios, or predictions.

## Exact frontmatter contract

`N min read` is a placeholder. Replace it after the final visible English word
count is known.

```yaml
---
title: "Taiwan Minimum Service Period Clauses: Validity, Training Costs, and Repayment"
url: "https://www.wei-wei-lawyer.com/post/taiwan-mandatory-employment-period"
lastmod: "2026-07-25"
date_display: "September 13, 2025"
read_time: "N min read"
categories:
  - "Taiwan Legal Information"
featured_image: "../images/014-taiwan-mandatory-employment-period/featured-01.jpg"
faq:
  - q: "Is a minimum-service-period clause in Taiwan automatically void?"
    a: "No. Under Article 15-1 of Taiwan's Labor Standards Act, a clause may satisfy the statutory threshold if the employer either provides professional skills training at its own expense or provides reasonable compensation for the worker's commitment to the minimum service period. The two grounds are alternatives, not cumulative requirements. Even if one exists, the period and burden must remain within a reasonable scope under the four statutory factors."
  - q: "Does ordinary onboarding or legally required training support a minimum-service-period clause?"
    a: "No. The Ministry of Labor's June 5, 2026 letter states that routine education, ordinary on-the-job training, new-hire familiarization, and training the employer is legally required to provide cannot support a minimum service period clause or a claim for a penalty or reimbursement. The course title is not decisive; its content, professional or technical character, duration, actual cost borne by the employer, and supporting records must be examined."
  - q: "Can an employer demand full repayment of a signing or retention bonus?"
    a: "No. If a signing bonus, retention bonus, or other prepaid benefit serves as the reasonable compensation supporting the clause, the employer must clearly disclose that purpose. Under the Ministry of Labor's June 5, 2026 letter, repayment after departure before the period ends must be calculated in proportion to the unserved portion, rather than as automatic full repayment. The payment's purpose, terms, service already completed, and reason employment ended still require individual review."
  - q: "What if employment ends early for a reason not attributable to the worker?"
    a: "Under Article 15-1, paragraph 4, if the employment contract ends before the minimum service period for a reason not attributable to the worker, the worker is not responsible for breaching the minimum service period agreement or reimbursing training expenses. The actual reason for termination and attribution must be determined from the governing legal ground, the notices, the parties' communications, changes in working conditions, and other evidence."
---
```

The four FAQs, their order, and every character of each question and answer are
locked.

## Exact H1 and sole body image

Use exactly one H1:

```md
# Taiwan Minimum Service Period Clauses: Validity, Training Costs, and Repayment
```

Place exactly this image immediately after the H1:

```md
![Workers carrying baskets across a salt field at sunset](../images/014-taiwan-mandatory-employment-period/featured-01.jpg)
```

The Markdown body must contain exactly one image. Remove `img-01.jpg` from the
body, but do not delete or edit either image asset.

## Visible English word count and read time

Target 2,200–2,400 visible English words. The absolute floor is 1,800 visible
English words. Do not reach the target through repetition, generic warnings,
secondary-source discussion, or invented examples.

The dedicated test must remove Markdown paths and formatting before counting:

```ts
function extractPublicText(content: string) {
  return content
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^---$/gm, '')
    .replace(/[“”‘’*_`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const visibleWordCount =
  extractPublicText(parsed.content).match(
    /\b[A-Za-z]+(?:['’-][A-Za-z]+)*\b/g,
  )?.length ?? 0;
const minutes = Math.ceil(visibleWordCount / 200);
```

Pin the exact final `visibleWordCount` in the test. Replace the frontmatter
placeholder with `${minutes} min read`, and pin that exact string as well.

## FAQ duplication contract

Each frontmatter FAQ answer must also be the exact first paragraph under its
assigned H2:

- FAQ 1 → H2 1
- FAQ 2 → H2 5
- FAQ 3 → H2 6
- FAQ 4 → H2 7

Each exact answer must occur exactly twice in the raw Markdown: once in
frontmatter and once in the assigned body section. There must be no image, H3,
blockquote, lead-in, or other text between the H2 and its FAQ-answer paragraph.

## Exact H2 and H3 architecture

Use only these eleven H2 headings, in this exact order:

```md
## 1. Short Answer: When Can a Minimum-Service-Period Clause Be Enforceable?
## 2. First Statutory Basis: Employer-Funded Professional Skills Training
## 3. Second Statutory Basis: Reasonable Compensation
## 4. Reasonable Scope and the Four Statutory Factors
## 5. Training That Cannot Support the Clause
## 6. Bonuses, Repayment, and Early Departure
## 7. When Employment Ends for a Reason Not Attributable to the Worker
## 8. Resignation Notice Is a Separate Question
## 9. Employer and Worker Review Checklists
## 10. Official Sources
## 11. Related Guidance
```

Use exactly these two H3 headings under H2 9, in this order:

```md
### Employer Checklist
### Worker Checklist
```

Do not use any other H2 or H3. Renderer-generated FAQ headings are outside the
Markdown heading count.

## Section-by-section legal and editorial contract

### Introduction

Explain that a minimum-service-period clause may raise distinct questions about
training expenses, a signing or retention bonus, another prepaid benefit, a
contractual penalty, resignation notice, and any separately alleged loss.
Signing the contract does not itself establish enforceability or the amount
owed.

Present these four review questions in this exact order:

1. Does the clause have a statutory basis under Article 15-1?
2. Are the service period and the worker's burden within a reasonable scope?
3. Is the reason employment ended attributable to the worker?
4. What notice and repayment rules apply?

Do not mention Korean law, Korean or Taiwan minimum wage, pilots, or the legacy
twenty-year example.

### 1. Short Answer: When Can a Minimum-Service-Period Clause Be Enforceable?

The first paragraph must be FAQ answer 1 verbatim.

Explain Article 15-1 paragraph 1 as two alternative threshold bases:

1. The employer provides professional skills training and bears its cost.
2. The employer provides reasonable compensation for the worker's commitment
   to the minimum service period.

Then explain the separate paragraph 2 reasonable-scope review and paragraph 3
voidness rule. Include these sentences verbatim:

`Article 15-1 provides two alternative statutory bases and then requires a separate reasonableness review. It does not require professional skills training and reasonable compensation in every case, and merely naming either one in the contract does not make the clause enforceable.`

`Under paragraph 3, an agreement that fails paragraph 1's threshold or paragraph 2's reasonable-scope review is void.`

Do not say the clause is valid because it was signed or void merely because it
is long. Do not turn the fact-specific review into an occupation-wide result.

### 2. First Statutory Basis: Employer-Funded Professional Skills Training

Explain that the employer must actually provide professional skills training to
the worker and bear the relevant cost. Review:

- the training subject and skill objective;
- its professional or technical character;
- dates, duration, attendance, completion, testing, and certification records;
- curriculum, materials, instructors, and equipment;
- invoices, receipts, payment records, refunds, subsidies, and who ultimately
  bore the cost;
- the basis for any claimed internal cost;
- how the course differs from ordinary supervision, onboarding, and handover;
  and
- the relationship between the documented investment and proposed service
  period.

A professional-sounding course name, estimated lump sum, high price, external
provider, or long duration is not proof by itself. Do not exclude every
internally delivered course; a mixed program may need to be separated by
content, time, legal necessity, participation, and cost.

### 3. Second Statutory Basis: Reasonable Compensation

Explain that the payment must have a clear, evidenced relationship to the
worker's minimum-service commitment. Examine its actual purpose, amount,
payment date, vesting, disclosure, service-period connection, early-ending
terms, and repayment formula.

Include this sentence verbatim:

`A label such as "signing bonus," "retention bonus," or "prepaid benefit" does not by itself establish reasonable compensation; review the payment's actual purpose, amount, timing, vesting, disclosure, and connection to the service commitment.`

Apply the June 5, 2026 Ministry administrative guidance: if a signing bonus,
retention bonus, or other prepaid benefit serves as the reasonable compensation
supporting the clause, the employer must clearly disclose that role. Do not
reclassify an unexplained payment after a dispute begins.

Do not state categorically that every payment classed as wages, overtime,
allowances, or travel expenses can never qualify under any facts. Do not imply
that any bonus amount validates any service period or repayment burden.

### 4. Reasonable Scope and the Four Statutory Factors

State these four Article 15-1 paragraph 2 factors in this exact order:

1. The duration and cost of the professional skills training provided by the employer
2. The possibility of replacing the worker with someone in the same or a similar role
3. The amount and scope of the compensation provided by the employer
4. Other circumstances affecting the reasonableness of the minimum service period

Connect each factor to evidence. Cost must be documented and attributable;
replaceability requires facts about the same or a similar role rather than a
bare claim of hiring difficulty; compensation requires its amount, timing,
vesting, and scope; other circumstances may vary by case.

Include this sentence verbatim:

`The fourth factor may include how the agreement was made, the nature of the work, what the parties were told, the time already served, and the reason employment ended. These are examples, not a closed list, and the weight of each factor depends on the evidence in the individual case.`

Explain that a qualifying threshold basis does not validate any length of
service or any repayment amount. The service period, documented investment,
replaceability, worker's benefit, completed service, and remaining burden must
remain proportionate. Do not import an outcome from another occupation or case.

### 5. Training That Cannot Support the Clause

The first paragraph must be FAQ answer 2 verbatim.

Attribute the following exclusions to Ministry of Labor Letter No.
勞動關2字第1150141814號 as administrative guidance:

- routine education;
- ordinary on-the-job training;
- new-hire familiarization with the workplace or procedures; and
- training the employer is legally required to provide.

Explain that those costs cannot support a minimum service period clause or a
claim for a penalty or reimbursement. The name of the course does not control.
If one program combines onboarding, legally required material, and separate
professional skills modules, review the curriculum, time, legal basis,
participation, and cost of each part rather than treating the entire program as
one category.

### 6. Bonuses, Repayment, and Early Departure

The first paragraph must be FAQ answer 3 verbatim.

Explain that clear disclosure should identify which payment supports the
service commitment, when the agreed period starts and ends, when the benefit
vests, and how an early ending is calculated. Establish the start date, end
date, payment dates, actual last day worked, time served, unserved time, and
repayment base.

Under the June 5, 2026 Ministry administrative guidance, repayment of a prepaid
benefit after early departure must reflect the unserved portion; the formula
must not disregard service already completed by automatically demanding the
full payment.

Include this sentence verbatim:

`The repayment analysis should proceed in this order: enforceability of the clause, the legal character of the payment, time already served, the reason employment ended, and the repayment formula. The word "penalty" in a contract does not by itself establish the amount owed.`

Analyze reimbursement of documented professional skills training expenses,
repayment of a prepaid benefit, a fixed contractual penalty, another alleged
loss, and a wage deduction as separate issues. Check for double counting. Do
not turn a payment demand or deduction record into proof that the amount is
legally owed.

### 7. When Employment Ends for a Reason Not Attributable to the Worker

The first paragraph must be FAQ answer 4 verbatim.

Explain Article 15-1 paragraph 4 without supplying a closed list. An early end
alone does not establish worker breach. Reconstruct who communicated what,
when notice was delivered, the stated and actual grounds for ending employment,
working-condition changes, attendance and work records, and any subsequent
agreement or explanation.

Review dismissal notices, resignation communications, agreed-termination
documents, email and message history, changes in duties or pay, attendance
records, and other evidence. Do not decide attribution from a document title
alone.

Include this sentence verbatim:

`Dismissal, agreed termination, and an alleged breach of working conditions are examples of matters to investigate, not a closed list of reasons not attributable to the worker.`

Explain the direct scope of paragraph 4: when it applies, the worker is not
responsible for breaching the minimum service period agreement or reimbursing
training expenses. If a prepaid benefit or another claim is also asserted,
analyze its legal character and contractual basis separately rather than
renaming every payment as a training expense.

### 8. Resignation Notice Is a Separate Question

State clearly:

`A minimum-service-period clause does not deprive a worker of the ability to resign.`

Keep separate:

- effectiveness and timing of the resignation;
- enforceability of the minimum-service-period clause;
- reimbursement of training expenses or repayment of a prepaid benefit; and
- any separately alleged loss.

For a worker terminating an indefinite-term contract, explain that Article 15
applies the notice periods in Article 16 paragraph 1:

1. At least 3 months but less than 1 year of continuous service: 10 days
2. At least 1 year but less than 3 years of continuous service: 20 days
3. At least 3 years of continuous service: 30 days

State expressly that Article 16 itself addresses employer termination; the
worker uses those periods for resignation from an indefinite-term contract
through Article 15.

Separately explain that, for a specific fixed-term contract longer than three
years, Article 15 allows the worker to terminate after completing three years
by giving the employer 30 days' notice. Do not mix this rule with the
continuous-service brackets for an indefinite-term contract.

Do not mechanically assign one of those periods to service under three months,
another fixed-term contract, or an alleged statutory ground for termination
without notice. Review the contract type, legal ground, facts, delivery method,
delivery date, and evidence.

### 9. Employer and Worker Review Checklists

Use the two contracted H3 headings. Each checklist must provide concrete,
non-repetitive steps and collectively cover:

- the signed employment contract, clause, amendments, and delivery records;
- curriculum, dates, duration, attendance, completion, invoices, receipts,
  payment records, and the person who bore each cost;
- separation of routine, onboarding, legally required, and professional skills
  training;
- the purpose, disclosure, payment date, amount, vesting, and repayment formula
  for a signing bonus, retention bonus, or other prepaid benefit;
- the basis for selecting the service period;
- evidence about replacing a worker in the same or a similar role;
- service completed and the unserved portion;
- resignation, dismissal, or agreed-termination notices and delivery evidence;
- the actual reason employment ended;
- payroll records, communications, demand letters, and deduction records;
- separate review of enforceability, resignation notice, training-expense or
  prepaid-benefit repayment, and any other alleged loss; and
- the rule that neither a signature nor a payment demand decides the case.

The employer checklist must emphasize clause design, documented cost, advance
disclosure, proportionality, and individualized review rather than reuse of a
fixed period and amount. The worker checklist must emphasize preserving
documents, building a chronology, separating the legal questions, and checking
the employer's evidence and formula.

## Exact official-source block

H2 10 must contain only these four links, in this exact order. Each raw
Markdown link and each official URL must occur exactly once in the article:

```md
- [Taiwan Labor Standards Act, Article 15-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15-1&pcode=N0030001)
- [Taiwan Labor Standards Act, Article 15](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15&pcode=N0030001)
- [Taiwan Labor Standards Act, Article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=16&pcode=N0030001)
- [Taiwan Ministry of Labor Letter No. 勞動關2字第1150141814號 (June 5, 2026)](https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?cnt=926&datatype=etype&edate=99991231&lnabndn=1&now=1&recordno=10&sdate=20180000)
```

Do not add an English-version statute URL or any news, blog, law-firm,
social-media, or case link to the article body.

## Exact related-guidance block

H2 11 must contain only these three internal links, in this exact order:

```md
- [Taiwan Labor and Employment Law Services](/en/services/labor)
- [Voluntary Resignation and Severance Pay Exceptions](/en/columns/taiwan-voluntary-resignation-severance)
- [Contact Us](/en/contact)
```

These must be the only internal body links. Do not use a Korean, Traditional
Chinese, or Japanese route.

## Exact ending

After the third related-guidance link, end the file with exactly:

```md
---

This article is provided for general legal information and educational purposes only. It explains Taiwan minimum service period clauses, the repayment of training costs and prepaid benefits, and resignation notice requirements; it is not legal advice for any particular employment matter. Enforceability and liability may vary with the contract type and wording, the training actually provided and its documented cost, the purpose and disclosure of any compensation, the period already served, the reason employment ended, and the available evidence. Before resigning, making a wage deduction, signing a repayment agreement, or responding to a dispute, check the latest official sources and obtain advice based on the specific facts.

**Wei Tseng (曾雋崴), Attorney-at-Law**
```

There must be no nonblank character after the author line.

## Native-English terminology lock

Use concise professional English written directly for an English-speaking
reader. Prefer:

- `Taiwan Labor Standards Act`
- `minimum-service-period clause` in ordinary prose
- `minimum service period agreement` when closely tracking statutory wording
- `professional skills training`
- `employer-funded` or `at the employer's expense`
- `reasonable compensation`
- `reasonable scope`
- `signing bonus`, `retention bonus`, and `prepaid benefit`
- `repayment` for a bonus or prepaid benefit
- `reimbursement` for training expenses
- `pay a penalty` and `claim damages`
- `reason not attributable to the worker`
- `indefinite-term contract`
- `specific fixed-term contract`
- `resignation` for a worker's act
- `dismissal` for an employer-initiated ending
- neutral `employment ended` while the cause or attribution remains disputed
- `notice period`, `time served`, and `unserved portion`

Use `worker` consistently in substantive discussion. The locked title is the
only place where the canonical unhyphenated title form controls. Preserve the
exact locked FAQ and sentence text even where it uses the statutory term
without hyphens.

Do not translate source-language syntax mechanically. Avoid repeated
`according to`, `the above`, `as stipulated`, `in the event that`, `it can be
seen that`, sentence fragments, artificial rhetorical questions, or paragraphs
split after every sentence.

## Forbidden legacy claims, translationese, and leakage

The article and dedicated test must forbid the visible-prose equivalent of:

- `Taiwan Mandatory Minimum Service Period Clauses`
- `almost always illegal`
- `almost always void`
- `The answer: it is almost always illegal.`
- `all three of the following requirements`
- `all three requirements must be met`
- `If even one of these is not met`
- `reasonable and necessary` presented as a third threshold basis
- `clearly illegal`
- `highly likely to be illegal`
- `do not worry too much`
- `representative lawful example`
- `airline pilots` or pilots as a lawful occupational class
- `NT$5 million`
- any twenty-year service-period example
- `NT$183`
- `NT$27,470`
- `10,030 won`
- `2,096,270 won`
- `Ordinary overtime pay, travel expenses, and the like are not recognized.`
- any categorical statement that all wages, overtime, travel expenses,
  allowances, bonuses, or internal courses can never qualify under any facts
- `mandatory employment period` or `mandatory service period` in visible prose
- `the worker cannot resign`, `may not resign`, or any equivalent claim that
  the clause blocks resignation
- `penalty repayment`, `return money`, `compensation money`,
  `human-power replacement`, or `responsibility attribution`
- treating Article 16 itself as the worker-resignation provision
- calling the Ministry letter a statute, regulation, amendment, court decision,
  or binding precedent
- result guarantees, urgency marketing, requests for comments or direct
  messages, unverifiable experience claims, or confidential-client examples
- `/ko/`, `/zh-hant/`, or `/ja/`

The test must reject Korean script and Japanese kana. It must also reject
Chinese characters in English visible prose after explicitly allowing only the
official letter number `勞動關2字第1150141814號` and the canonical author name
`曾雋崴`. The preserved Wix URL and canonical slug are not visible-prose uses
of the forbidden word `mandatory`.

## New dedicated regression-test contract

Create `src/lib/__tests__/columns-en-labor-014.test.ts`. Follow the test shape
used by the completed Korean column 014 test, but use exact English strings and
the English word-count formula in this work order.

The test must assert at least:

1. Exact complete frontmatter object, canonical source URL, `lastmod`,
   display date, calculated read time, category, featured image, and four
   ordered FAQ objects.
2. Exactly one H1, matching the canonical title.
3. The exact body opening: H1, blank line, sole contracted image, blank line.
4. Exactly one Markdown body image; no `img-01.jpg`; renderer-facing featured
   image and image removal behavior remain correct.
5. Exactly eleven H2 headings and two H3 headings in the contracted order.
6. Every FAQ answer occurs exactly twice in raw Markdown and is the exact first
   paragraph of its assigned H2 in both parsed source and renderer-facing
   content.
7. The introduction contains the four contracted review questions in order.
8. Article 15-1's two alternative threshold bases, separate paragraph 2 scope
   review, paragraph 3 voidness rule, and the exact locked sentences.
9. The professional-skills-training proof items and the rule against deciding
   from a name, estimate, price, location, or duration alone.
10. Reasonable-compensation purpose, disclosure, timing, vesting, and formula,
    without a categorical payment-label exclusion.
11. All four statutory scope factors in order, proportionality, evidence-based
    replaceability, the open-ended fourth factor, and no occupation-wide result.
12. All four training categories excluded by the June 5, 2026 Ministry
    administrative guidance, plus mixed-program separation and no blanket
    exclusion of internal courses.
13. Clear prepaid-benefit disclosure, unserved-portion proportionality,
    separate training-expense, benefit, penalty, damages, wage-deduction, and
    double-counting review.
14. Article 15-1 paragraph 4, evidence-based attribution, no closed list, and
    the exact locked sentence.
15. The separation of resignation from liability; Article 15's application of
    Article 16 paragraph 1; the exact 10-, 20-, and 30-day brackets; the
    separate over-three-year specific fixed-term rule; and the qualifications
    for other situations.
16. Both checklists cover every evidence and issue-separation item contracted
    above.
17. The four official Markdown links and URLs occur exactly once and are the
    only external body links.
18. The three exact `/en/` Markdown links are the only internal body links.
19. The exact disclaimer and canonical author form the exact EOF ending.
20. Every forbidden legacy phrase, figure, overclaim, wrong-locale route,
    Hangul character, kana character, and non-whitelisted Chinese character is
    absent from visible prose.
21. The exact final visible English word count is pinned, is at least 1,800,
    and produces the exact frontmatter read time through
    `Math.ceil(visibleWordCount / 200)`.
22. `parsed.data.url` matches the exact source URL, and `getColumnPost()`
    returns source-matching title, lastmod, display date, read time, category,
    featured image, FAQ, and content. Do not expect a `url` property from
    `ColumnPost`.
23. `getColumnPost('mandatory-employment', 'en')` and
    `getColumnPost('taiwan-mandatory-employment-period', 'en')` resolve to the
    same English post.

Do not create a weak keyword-presence test. Required legal content must be
pinned strongly enough that deleting a qualification, changing an alternative
threshold into cumulative requirements, losing a factor, weakening the
administrative-guidance attribution, or removing an evidence category makes
the test fail.

## Writer verification commands

The writer may run only non-server verification commands. Run all of these from
`/Users/son7/Projects/tseng-law` and report the actual output:

```bash
npx vitest run src/lib/__tests__/columns-en-labor-014.test.ts
npm run typecheck
npx eslint \
  src/lib/__tests__/columns-en-labor-014.test.ts
git diff --check -- \
  src/content/columns-en/014-taiwan-mandatory-employment-period.md \
  src/lib/__tests__/columns-en-labor-014.test.ts
git status --short -- \
  src/content/columns-en/014-taiwan-mandatory-employment-period.md \
  src/lib/__tests__/columns-en-labor-014.test.ts
git diff -- \
  src/content/columns-en/014-taiwan-mandatory-employment-period.md \
  src/lib/__tests__/columns-en-labor-014.test.ts
sed -n '1,999p' \
  src/lib/__tests__/columns-en-labor-014.test.ts
```

If a command fails because of unrelated shared-worktree changes, report the
exact failure and prove whether the scoped files caused it. Do not fix an
unowned file. Do not start a development or production server.

## Independent review and manager gates

The manager must not accept the writer's report without rereading the complete
diff and rerunning the scoped test. Required gates, in order:

1. Work-order audit: exact frontmatter, FAQs, headings, source links, internal
   links, ending, count formula, scope, and testability.
2. Independent current-law audit against Articles 15-1, 15, and 16 and the
   June 5, 2026 Ministry administrative guidance. Confirm alternatives rather
   than cumulative thresholds, separate reasonable-scope review, paragraph 4
   protection, repayment proportionality, and every qualification.
3. Independent native-English editorial review. Reject translated syntax,
   inconsistent legal terms, fragments, awkward collocations, script leakage,
   casual marketing, and overstatement.
4. Writer correction of every finding, followed by exact re-review of each
   correction.
5. Manager verification:

```bash
npx vitest run src/lib/__tests__/columns-en-labor-014.test.ts
npm run typecheck
npx eslint \
  src/lib/__tests__/columns-en-labor-014.test.ts
git diff --check -- \
  src/content/columns-en/014-taiwan-mandatory-employment-period.md \
  src/lib/__tests__/columns-en-labor-014.test.ts
git status --short -- \
  src/content/columns-en/014-taiwan-mandatory-employment-period.md \
  src/lib/__tests__/columns-en-labor-014.test.ts
git diff -- \
  src/content/columns-en/014-taiwan-mandatory-employment-period.md \
  src/lib/__tests__/columns-en-labor-014.test.ts
sed -n '1,999p' \
  src/lib/__tests__/columns-en-labor-014.test.ts
```

The manager must also inspect `git status` before any scoped commit, confirm no
other lane's work was staged, and stage only the exact approved files. This
work order does not authorize a commit, push, deployment, or publication.

## Manager-only desktop and mobile browser QA

Browser QA occurs only after the article and test pass all preceding gates and
only on a server already authorized and operated by the manager. The writer
must not start or manipulate a server.

Verify the canonical public route:

`/en/columns/taiwan-mandatory-employment-period`

Test at least desktop 1440 × 900 and mobile 390 × 844. Record screenshots and
check:

1. The rendered title exactly matches the canonical English title.
2. The canonical URL, English locale, and page language are correct.
3. September 13, 2025 and the calculated read time render correctly.
4. Exactly one hero article image renders with the canonical article title as
   its alt text, matching the shared route renderer. The contracted native
   Markdown alt remains enforced in the source-level unit test because the
   renderer strips the Markdown image and supplies the hero image itself.
5. Exactly four FAQ items render and FAQ JSON-LD contains exactly four matching
   question-answer pairs.
6. The eleven article sections are present and readable in the contracted
   order.
7. Exactly four official source links render, point to the contracted official
   URLs, and open as external links as intended.
8. Exactly three related links render and point to the contracted `/en/`
   routes.
9. No legacy minimum-wage text, pilot example, cumulative three-part test,
   `almost always illegal` claim, second image, or wrong-locale text appears.
10. Lists, long source labels, the Ministry letter number, and the author line
    wrap without clipping or horizontal overflow.
11. The mobile page has no horizontal scroll and no overlapping or truncated
    content.
12. There is no console error, page error, failed article asset, or broken
    navigation.

Do not declare the English unit complete until the work-order audit,
current-law audit, native-English review, corrections, manager command gates,
and both browser viewports pass.
