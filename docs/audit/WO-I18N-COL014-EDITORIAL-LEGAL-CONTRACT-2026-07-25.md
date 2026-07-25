# WO-I18N-COL014 — Four-Locale Editorial and Legal Contract

Date: 2026-07-25 KST
Manager: Codex `/root`

## Purpose

Replace all four legacy versions of column 014 with current, source-based
guidance on Taiwan minimum-service-period clauses. This is a complete rewrite,
not a translation or polish pass.

The current KO, ZH-Hant, EN, and JA articles share material defects:

- they describe the clause as “almost always illegal”;
- they incorrectly require professional training, reasonable compensation, and
  reasonableness as three cumulative gateway conditions;
- they omit the protection for termination not attributable to the worker;
- they use unsupported pilot figures and a categorical twenty-year example;
- they overstate what ordinary allowances can never count as;
- they contain obsolete 2024 minimum-wage figures unrelated to the legal test;
- the Japanese article sends all three related links to Korean routes.

This document is the master legal and editorial contract. Each locale must
receive a separate bounded writer work order, a locale-specific regression
test, an independent current-law review, an independent native-language
review, manager verification, and desktop/mobile browser verification.

## Scope boundaries

Each locale writer may own only that locale’s Markdown file and one new
locale-specific test. Do not edit another locale, public data, shared code,
images, embeddings, builder data, redirects, this master contract, or another
test in the same locale-writing unit.

Public title, archive, search, related-column, and alias synchronization must
be a later bounded unit after all four articles pass. Do not hand-edit
`src/content/column-embeddings.json`; regeneration belongs only to final global
release work if the required API and network are available.

Writers and reviewers must not stage, commit, push, deploy, publish, or operate
a server. Only the manager may make the exact approved local commit after all
gates pass. Push and deployment require separate user approval.

## Canonical four-locale titles

- KO: `대만 최소 근무기간 약정: 효력·교육비·위약금 판단 기준`
- ZH-Hant: `台灣最低服務年限約定：效力、培訓費用與違約金判斷`
- EN:
  `Taiwan Minimum Service Period Clauses: Validity, Training Costs, and Repayment`
- JA: `台湾の最低勤務期間条項：有効性・研修費用・返還義務`

Keep the canonical slug and preserved original Wix URL:

- slug: `taiwan-mandatory-employment-period`
- frontmatter URL:
  `https://www.wei-wei-lawyer.com/post/taiwan-mandatory-employment-period`

Use `lastmod: "2026-07-25"` and preserve the locale-appropriate display date
for September 13, 2025. Each locale must calculate its read time from the
actual final visible body.

## Controlling current-law sources

The article may rely only on primary official sources for legal propositions.
The required sources are:

1. Taiwan Labor Standards Act Article 15-1:
   `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15-1&pcode=N0030001`
2. Taiwan Labor Standards Act Article 15:
   `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15&pcode=N0030001`
3. Taiwan Labor Standards Act Article 16:
   `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=16&pcode=N0030001`
4. Ministry of Labor Letter 勞動關2字第1150141814號, June 5, 2026:
   `https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?cnt=926&datatype=etype&edate=99991231&lnabndn=1&now=1&recordno=10&sdate=20180000`

The Ministry letter is especially important because it states that:

- routine education, ordinary on-the-job training, new-hire familiarization,
  and legally required training cannot support a minimum-service-period clause
  or a request for a penalty or reimbursement;
- if a retention bonus, signing bonus, or other prepaid benefit is the
  reasonable compensation supporting the clause, the employer must clearly
  disclose that role;
- if the worker leaves before the period ends, any return of that prepaid
  benefit must be calculated in proportion to the unserved period and cannot
  demand full repayment.

Do not cite news, blogs, law-firm commentary, social media, or an uncited court
anecdote as authority.

## Required legal propositions

Every locale must state all of the following accurately and with appropriate
qualification.

### 1. Not automatically valid or invalid

A Taiwan minimum-service-period clause is neither automatically valid nor
automatically void. Its enforceability depends on Labor Standards Act Article
15-1 and the facts.

Never say:

- “almost always illegal”;
- “almost always void”;
- “clearly legal” merely because the worker signed;
- “the worker cannot resign.”

### 2. One of two threshold bases, not both

Article 15-1 paragraph 1 permits such an agreement only when at least one of
two statutory bases exists:

1. the employer provides professional technical training and bears its cost;
   or
2. the employer provides reasonable compensation for the worker’s commitment
   to the minimum service period.

The two bases are alternatives. Do not describe them as cumulative
requirements. “Reasonableness and necessity” is not a third parallel gateway;
it is the separate scope review described below.

### 3. Separate reasonableness review

Even when one threshold basis exists, the agreed period and burden must remain
within a reasonable scope. Article 15-1 paragraph 2 requires consideration of:

1. the duration and cost of the professional technical training;
2. how readily a worker in the same or similar role can be replaced;
3. the amount and scope of compensation provided by the employer; and
4. other facts affecting reasonableness.

The article must explain that a qualifying payment or training program does
not validate any length of service period or any repayment amount.

### 4. Invalid clauses

Under Article 15-1 paragraph 3, an agreement violating the threshold or
reasonableness rules is void. Do not convert this into a blanket prediction
about all contracts or occupations.

### 5. Ordinary and legally required training

Apply the June 5, 2026 Ministry guidance. Routine education, ordinary
on-the-job training, new-hire familiarization, and training the employer must
provide by law are not a basis for imposing the service period, a penalty, or
repayment.

Do not state that every internal course is non-qualifying. The analysis must
identify the training’s subject, professional or technical character,
duration, actual cost borne by the employer, supporting records, and
relationship between that investment and the proposed period.

### 6. Bonuses, prepaid benefits, and repayment

If a retention bonus, signing bonus, or other prepaid benefit supports the
clause as reasonable compensation, its purpose must be clearly disclosed.
Under the June 5, 2026 Ministry guidance, an early-departure repayment must be
proportional to the unserved part of the period; a demand for the full amount
is not permitted.

Do not promise that every payment labeled a “bonus” is sufficient. The actual
purpose, amount, vesting, disclosure, and relation to the service commitment
must be reviewed.

### 7. Termination not attributable to the worker

Article 15-1 paragraph 4 provides that when the employment contract ends
before the minimum period for a reason not attributable to the worker, the
worker is not responsible for breaching the minimum-service-period agreement
or repaying training costs.

Do not supply a closed list of qualifying causes. Explain that attribution and
the legal ground for termination must be assessed from the evidence.

### 8. Resignation and notice are separate

A minimum-service-period clause must not be described as physically or legally
preventing a worker from resigning. Whether notice is required, and its length,
is a separate question.

For an indefinite-term contract, Labor Standards Act Article 15 applies the
notice periods in Article 16 paragraph 1 by reference. The familiar 10-, 20-,
and 30-day periods depend on length of continuous service. A fixed-term
contract exceeding three years has the separate Article 15 rule allowing
termination after three years with thirty days’ notice.

The article must distinguish:

- the effectiveness and notice timing of resignation;
- enforceability of the minimum-service-period clause;
- repayment of a prepaid benefit or training cost; and
- any separately alleged loss.

Do not imply that Article 16 itself is an employee-resignation provision; it
supplies the periods applied through Article 15.

### 9. Evidence and practical review

The practical review must identify at least:

- signed contract and amendments;
- training curriculum, dates, invoices, receipts, and who paid;
- whether training was routine, onboarding, legally required, or genuinely
  professional/technical;
- bonus or prepaid-benefit documents, disclosure, payment date, vesting, and
  repayment formula;
- the agreed service period and how it was selected;
- role replaceability and the employer’s stated operational need;
- elapsed and unserved time;
- resignation notice and delivery evidence;
- the actual reason the employment ended; and
- payroll, communications, and any demand letter or deduction record.

The employer checklist must emphasize clause design, documented cost,
disclosure, proportionality, and individualized review. The worker checklist
must emphasize preserving documents, separating the four legal questions
above, and not assuming that signing or a payment demand decides the case.

## Forbidden legacy claims and material

All locale Markdown and locale tests must forbid the equivalent of:

- 2024 Taiwan minimum wage `NT$183` hourly or `NT$27,470` monthly;
- Korean 2025 minimum-wage comparison figures;
- “all three requirements must be met”;
- “almost always illegal/void”;
- the unsupported `NT$5 million` pilot-training figure;
- the unsupported twenty-year pilot service agreement;
- any uncited claim that pilot agreements are a representative lawful class;
- any categorical statement that overtime pay or travel expenses can never
  count under any facts;
- any claim that the clause prevents resignation;
- Korean-route links in ZH-Hant, EN, or JA;
- another locale’s script in user-visible prose, except an official Chinese
  statute or document title placed next to a native translation where useful.

Remove the two-image legacy stack. Each article must use exactly one body image,
the existing featured image, with a native and descriptive alt. Do not delete
the image assets.

## Required article architecture

Every locale must use the same semantic order, with exactly eleven H2 sections:

1. Short answer: when can the clause be effective?
2. First threshold basis: professional technical training
3. Second threshold basis: reasonable compensation
4. Reasonable scope and the four statutory factors
5. Training that cannot support the clause
6. Bonuses, repayment, and early departure
7. End of employment not attributable to the worker
8. Resignation notice is a separate question
9. Employer and worker review checklists
10. Official sources
11. Related guidance

Locale work orders must provide exact native H2 text and lock the order in
tests. H3 subsections are allowed where they improve scanning.

Use exactly four frontmatter FAQs, with native-language questions and answers:

1. Is a minimum-service-period clause automatically void?
2. Does ordinary onboarding or legally required training qualify?
3. Can an employer demand full return of a signing or retention bonus?
4. What if employment ended early for a reason not attributable to the worker?

Each FAQ answer must appear in the assigned body section as the section’s first
paragraph and must match its frontmatter answer exactly.

End with a locale-appropriate educational-purpose disclaimer and the canonical
author identity:

- KO: `증준외 변호사(曾雋崴, Wei Tseng)`
- ZH-Hant: `曾雋崴律師（Wei Tseng）`
- EN: `Wei Tseng (曾雋崴), Attorney-at-Law`
- JA: `曾雋崴弁護士（Wei Tseng）`

Do not add guarantees, result predictions, urgency marketing, comments/DM
instructions, unverifiable experience claims, or confidential-client
examples.

## Length and read-time floors

Do not pad the article with repetition. The final public body must meet:

- KO: at least 1,200 visible eojeol-like units; minutes =
  `Math.ceil(count / 180)`;
- ZH-Hant: at least 3,200 visible Han characters; minutes =
  `Math.ceil(count / 400)`;
- EN: at least 1,800 visible English words; minutes =
  `Math.ceil(count / 200)`;
- JA: at least 4,500 visible Japanese characters, including at least 1,800
  kana; minutes = `Math.ceil(count / 500)`.

Locale tests must pin the exact final count and the derived frontmatter read
time.

## Link contract

`Official sources` must contain the four controlling official links in the
order listed above, each exactly once in raw Markdown.

`Related guidance` must contain exactly three native internal links:

1. the current locale’s labor service page;
2. the current locale’s labor article
   `taiwan-voluntary-resignation-severance`;
3. the current locale’s contact page.

No other internal or external body link is allowed. The preserved frontmatter
Wix URL is not a body source.

## Locale-specific regression tests

Each test must assert:

1. exact complete frontmatter, H1, date, calculated read time, category,
   featured image, and four ordered FAQs;
2. exactly one body image and absence of `img-01.jpg`;
3. exact eleven H2 headings in order;
4. each FAQ answer appears exactly twice in the raw file and is the first
   paragraph of its assigned H2 section;
5. every required legal proposition and practical checklist item;
6. all four official URLs exactly once and only three locale-correct internal
   links;
7. the exact educational disclaimer and canonical author identity at EOF;
8. all forbidden legacy claims, figures, language leakage, and wrong-locale
   links are absent;
9. canonical and legacy aliases resolve to the same locale post;
10. renderer-facing `getColumnPost()` metadata, image, FAQ, and content match
    the source.

## Independent review gates

Each locale must pass, in order:

1. Work-order review: scope, exact strings, source links, testability.
2. Current-law review: Article 15-1, June 5, 2026 Ministry guidance, Articles
   15 and 16, qualifiers, and absence of prohibited overclaims.
3. Native editorial review: idiomatic legal terminology, natural professional
   prose, no source-language sentence structure, no script leakage.
4. Writer correction and exact re-review of every finding.
5. Manager unit tests, typecheck, scoped ESLint, `git diff --check`, and full
   diff inspection.
6. Desktop and mobile browser QA of the public canonical route: exact title,
   canonical URL, locale/language, date/read time, FAQ and FAQ JSON-LD count,
   official-link count, related links, one image, no legacy text, no horizontal
   overflow, and no console/page error.

Only after all four locale units pass should a separate public-reference
synchronization work order update site content, archive/search copy, stale
legacy data that is actually runtime-reachable, and alias parity.
