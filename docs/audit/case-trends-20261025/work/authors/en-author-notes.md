# English case columns 914–917 — author self-check

Date: 2026-10-25. Author role: AI English editorial specialist. These are authored drafts with completed self-checks, not independent locale or legal approvals and not publication evidence. Ownership was limited to the four assigned English manuscripts and `work/authors/en-*` records. Other agents' files, registry and deployment were untouched.

Update after independent R1 feedback: the initial hashes and metric table below are preserved as the author-freeze history. Current repaired hashes and actual CLI outputs are in `en-author-checks.json`; initial checks are retained in `en-author-checks-r0.json`. See `en-repair-r1.md` for the five targeted changes, including the explicitly substantive accuracy correction to 915's description of Arbitration Act40(1)(2). Reviewer readback is pending.

## Frozen manuscripts

The exact paths, SHA-256 hashes, executed CLI commands, final outputs and visually inspected hero hashes are in `en-author-checks.json`.

| ID | Manuscript SHA-256 | Variety result | Summary characters / SEO characters |
|---|---|---|---|
| 914 | `9dfa500e01d12114412e6cefa1c50d602e4622a3d7a2187fcfeaaf1e1870433e` | exit 0, CV .492, short .208, FAIL 0 | 155 / 35 |
| 915 | `a3827e6fff15839c1cd70fc8f490eea66a22d10c3989169545c4ca32f6188be7` | exit 0, CV .492, short .179, FAIL 0 | 159 / 34 |
| 916 | `bfc294cfac5cf3b1ef5d8fb26491d9abce428e1fe751f7b805f6c1aab698ef5b` | exit 0, CV .486, short .163, FAIL 0 | 156 / 37 |
| 917 | `17edfa94317c06cde457c65d722edb16cc9f5e33077b2190c0cde93a58ca798c` | exit 0, CV .463, short .234, FAIL 0 | 158 / 32 |

All four titles exceed 60 characters when ` | Hovering Law` is appended, so each has a distinct 30–45-character `seoTitle`. All have `published` and `lastmod` 2026-10-25, `audience: ["en"]`, internal `author: "legal-ai-assistant"`, 2–3 FAQ entries, English image alt and exactly `Fictional scene` as caption. No public author, bold markup, invented human review or licensure is present.

Actual self-check command: `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <each assigned manuscript> --lang en`. Initial output found repeated paragraph openers in 914/916/917 and low length variation in 915/917. The first revision resolved all but 917 CV (.445); the second revision split the US-declaration sentence into its two actual evidentiary propositions, producing CV .463. No filler or new legal proposition was added to meet the metric. Scoped `git diff --check` returned exit 0; new-file content was also read directly and parsed using the repository's gray-matter package.

## Instructions and source materials actually read

- Repository `AGENTS.md` editorial/deployment instructions; full `docs/columns/EDITORIAL-VOICE.md` and `FRONTMATTER.md`.
- `tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `tseng-lanes-shared/SENTENCE-VARIETY-RULE.md` (including all section 2 requirements and section 5), and `LESSONS.md`.
- `tseng-law-editorial/SKILL.md` and `references/review-criteria.md`.
- Task `work/EDITORIAL-BRIEF.md`, `work/research/firm-profile.md`, `en-research.md` and the researcher's primary-source captures described below. The research ledger is `en-sources.json`; no demand measurement is claimed.

Author also opened current official Civil Code 216/231, CPC222/279, the Government Procurement Act (with 85-1 located), the ITA September 30 energy report, USTR's February 2026 fact sheet and the TAICCA September 22 announcement. Official High Court judgments 914/917 opened successfully at their beginning; later lines were read from the researcher's successful same-session web captures. Official Supreme Court explanation 916 opened partly, then its relevant remaining paragraphs were read in the captures. A renewed 915 open timed out; the researcher's recovered original successful open was read in full. These limits do not claim possession of an underlying court case file or unobserved appellate outcomes.

- 914: `en-stock-final-reasons.txt`, `en_final_market_case.txt`; full relevant reasons and actual dismissal. Current Civil216/231 independently opened.
- 915: `en-procurement-original-open.txt`; official explanation, especially L22,24,42–46. Current GPA85-1 independently read; Arbitration40 appears in the official-law capture. The gazette PDF is not claimed as fully read.
- 916: `en_case_finalread.txt`, `en-stock-final-reasons.txt` last block; official explanation including knowledge, control, asset depletion and 246/262 split. Company154 current text read in `en_primary_final_supplement.txt`.
- 917: `en_final_market_case.txt` L57–88; admissions, foreign declaration, different affiliates, damage estimation, setoffs and disposition. Current CPC222/279 independently opened.

## First-two-paragraph deletion test

### 914

- “The executive established that his Taiwan employer owed the stock bonus.” supplies the successful contractual point. Deleting it leaves the next sentence's “still” without its legal contrast.
- “His damages claim still failed.” supplies the actual result and the reason this case adds value beyond a compensation guide.
- The next sentence identifies the precise judgment and separates the payment obligation from compensable loss. Retain the case anchor; it is not an outline promise.
- Paragraph 2 supplies decision date, Canadian nationality, US subsidiary appointment and the Taiwan/BVI corporate arrangement. Each identifies a material jurisdiction or party role. Its final sentence draws those distinct roles together; it does not imply the plaintiff was American.

### 915

- The opening amount is the actual award later annulled. The next sentence supplies the change from time relief to money and the missing recommendation.
- The court-source sentence anchors that procedural cause. Deleting the two-paragraph opening would remove amount, decision date, appeal dismissal and finality.
- “The annulment stood.” was split from a longer sentence, preserving exactly the outcome. Finality is expressly supported by the official explanation.
- The final opening sentence identifies absence of agreed or statutorily deemed consent for the money dispute; it prevents the article from implying that unsuccessful mediation is always sufficient.

### 916

- The first sentence identifies pre-acquisition environmental investigations as actual evidence. The next connects knowledge with control, response and asset depletion; deletion loses the case's cumulative factual basis.
- The official-source sentence leads to the practical response to a report, not a promise to summarize a trend.
- Paragraph 2 dates the decision to 2018, identifies worker exposure and controlling companies, and preserves the limitation against ownership-only liability. Removing it would risk presenting an older decision as a current universal rule.

### 917

- The first question states a real transaction choice among payer, distributor and platform operator. It is answered by the case sentence about the offshore licensee and the earlier disputed grant.
- Paragraph 2 supplies date, third-remand stage, loan repayment and assigned damages setoff. Removing it would mischaracterize the case as a copyright-infringement or foreign-judgment-recognition action.
- Its final sentence explains why the court had to examine the licensee and loss; that causal link preserves the reader's understanding of the unusual procedural setting.

## Three recent same-locale comparators

All are repository English articles published October 24, 2026; actual openings, headings and endings were read. No comparator was unavailable.

1. `src/content/columns-en/704-taiwan-arc-first-application.md`: starts with the 30-day filing period and “Count from the day after arrival”; sections track dates, documents, filing channel and fees. The closing returns to the card and later work/travel obligations. New 915 also starts with a concrete figure, but the figure is a court award followed by claim history; it is not another deadline-and-documents guide. 914's shorter outcome pair concerns proof, not a filing instruction.
2. `src/content/columns-en/705-taiwan-visa-residence-work-study-family.md`: opens with different visa-exempt entry consequences and nationality/passport eligibility, then compares residence purposes. It ends with category changes and first-card/renewal links. New 916 uses a cumulative conduct narrative and current corporate-liability conditions; new 917 follows a rights transaction through entities and litigation evidence. Neither copies the eligibility-category structure.
3. `src/content/columns-en/706-taiwan-arc-renewal-changes-reentry.md`: opens with a reader question about an expiry date when the residence basis ends, then lists changes and filing periods. It closes on documents covering the planned return. New 917 also uses a real reader question, but asks which entity acquired rights; its body has no repeated timetable or checklist. The other three new openings are result/number/evidence based.

Within the new batch, 914 centers an obligation that did not yield damages; 915 uses a four-stage claim-history table; 916 connects acquisition knowledge, response and asset movements; 917 follows named rights and judicial admissions. No generic “three key points” template is shared. The shared source-check tail is structural; the substantive ending in each identifies the relevant evidence file.

## Section 5 self-check

1. Actual CLI output is FAIL 0 for each final hash. Numerical evidence is in the JSON companion.
2. No stock hypothetical opener. 914 result, 915 amount/outcome, 916 actual documentary evidence, 917 transaction question; no type exceeds half the batch. No fictional client scenes.
3. At least two meaningful short sentences per article, including “His damages claim still failed,” “The annulment stood,” “Each condition matters,” and “Proof of loss came first.” These convey legal or evidentiary distinctions rather than ornamental filler.
4. Final paragraph-opening counts pass. Initial repeated The/For patterns were rewritten using the relevant subject and action, without changing legal strength.
5. No three consecutive statute-claim/caveat paragraphs. Each contains uncited practical synthesis grounded in the cited case, alongside specific legal source links. No source was removed to improve the rhythm.
6. Contrast counts: 0/0/0/1 by the CLI. Actual legal limits remain explicit where needed. No imagined reader argument is rebutted.
7. Each final substantive paragraph ends on its case's evidence: compensation promise and loss, mediation documents, findings and transfers, or the named film licensee. Consultation appears once per article, before or within that practical conclusion, without a promise of outcome.
8. No bold, invented first-person experience, human-review claim, legal credential or checklist-command heading. US spelling and Taiwan legal institutions are used. Private parties are unnamed.
9. Facts, claim identity, statutory conditions, currencies, dates and source links were compared before/after style revisions. Case-specific notice and cure terms were never recast as statutory deadlines. No interpretation was changed just to shorten a sentence.

## Legal protections for the independent reviewers

- 914: Canadian claimant, US role, Taiwan contracting employer and BVI issuer kept distinct. Employer obligation recognized; loss/causation unproved; appeal/additional claim dismissed. The discussion does not advise on current BVI registration law. Contractual departure conditions are preserved without reproducing every clause-specific day count. Finality unconfirmed.
- 915: A money claim lacked the recommendation/proposal needed for statutory consent; separate consensual arbitration remains a different possible basis. This does not say every amount/argument revision changes a claim. Current construction/technical-services scope is distinguished from a supply-only contract. Old/new-law reasoning was corrected despite the affirmed annulment. No unverified deadline is supplied.
- 916: Control, knowledge, failure to respond/disclose and debt-evading asset depletion are cumulative facts. The term 不真正連帶責任 was not converted into a universal US joint-and-several rule. The 246 remand/262 dismissal split remains exact; there is no assertion that all later litigation ended. Current Company154(2)'s abuse, specific debt, difficulty repaying, seriousness and necessity conditions appear separately from the historical reasoning.
- 917: Loan/setoff posture retained. The US declaration's evidentiary failure is not recognition refusal. Signed US$1.5m versus unsigned US$800k evidence, eight-film admission, two other films, different affiliated platform and US$21,200 residual principal are correct. No infringement finding is invented. CPC222 requires proved damage before amount assessment; CPC279 preserves statutory exceptions and withdrawal conditions. Subsequent finality unconfirmed.
- Current market statements are dated official transaction context or future planned events; no measured demand, projected awards presented as complete, US TCCF attendance, acquisition surge, operative tariff promise or universal legal benefit is claimed.

## Image inspection and remaining work

All four root-generated WebP assets were opened with `view_image`. 914 shows a laptop, two binders and a blank certificate with Taipei visible; 915 shows a hard hat, plans, binders and bridge model; 916 shows a single soil jar and notebook outside an old factory; 917 shows a film reel, binder, folder and projector. Alt text was revised to these actual visible contents, removing the initially assumed stock-allocation detail, multiple sample bottles and a storage drive. No readable personal documents, private people, logos or author marks are present. Captions remain exactly `Fictional scene`.

Remaining: fresh independent locale and final legal review, any bounded repairs, root-owned integration/deployment/public readback. Author self-check is not a publication approval.
