# Final review r1 — en-014-taiwan-mandatory-employment-period (reviewer: Claude Fable 5.1, 2026-10-12)

## Verdict

PASS. The rewrite preserves every legal statement, qualifier, article reference, number, source entry, disclaimer point and the signature of the published original. Nothing new was added beyond count words and framing sentences that carry no fact. Front matter differs only in lastmod. Variety check OK with no FAIL. tests.patch re-anchors the pinned test to the new wording without weakening any fact lock. No edits were needed from me.

## Scope checked

- orig.md and draft.md read in full, compared paragraph by paragraph (intro, sections 1–11, disclaimer, signature).
- guard.txt: GUARD: PASS (length 3741 -> 3622, 97%; monotony 25.6 -> 3.3; three pre-existing lint notes are house format of the original: no contact email, Related Guidance after Official Sources, no source-check date).
- notes.md read; rewriter's "please spot-check" items (§3 P3, §5 P1, §8, framing sentences, count words) checked individually below.
- tests.patch (36,495 bytes) read in full; tests.txt, claude-tests1.log and vitest-1.log read (80 files / 1092 tests passed at 09:29:02).
- Independent checks run:
  - `python3 variety_metrics.py check draft.md --lang en` → OK, no limit violated (sentences=177, mean=19.6, cv=0.476, short=0.136, run3=0.04, opener_rep=0.164, contrast=0, q=3).
  - Front matter + H1 + image line diff (lines 1–25): only line 5 lastmod "2026-07-25" → "2026-10-12".
  - Tail diff (Official Sources, Related Guidance, rule, disclaimer, signature): only the disclaimer's first sentence reworded; four source entries, three internal links and signature byte-identical.
  - Key-string counts orig vs draft: "June 5, 2026" 6/6; 勞動關2字第1150141814號 2/2; Article 16 3/3; paragraph 2 3/3; paragraph 4 3/3; 10 days 1/1; 20 days 1/1; 30 days 2/2; three months 2/2; three years 4/4; 曾雋崴 1/1; /en/contact 1/1; law.moj.gov.tw 3/3; laws.mol.gov.tw 1/1. "Article 15-1" 11 → 9 and "paragraph 3" 1 → 0 are explained by the FAQ-copy consolidation in §1 and the capitalised "Paragraph 3 states the consequence." (see §1 table).
  - Visible word count recomputed with the test file's own extractPublicText + regex: orig 3794, draft 3691, ceil(n/200) = 19 for both. Matches the patch's 3_691 and the unchanged "19 min read".
  - No bold/strong markers, no emoji. Worktree copy at Projects/tseng-law-rewrite-1006-w4 was restored to the original at 09:29:19 (after the test run), which is consistent with the pipeline log.
- Rules read: SENTENCE-VARIETY-RULE §5–6, COLUMN-VOICE-RULE, LESSONS (skimmed).

## Claim-by-claim fact comparison

Format: original point → location in rewrite → status.

### Front matter, H1, image
- All fields incl. title, seoTitle, url, date_display, read_time "19 min read", categories, featured_image, summary, four FAQ q/a → identical → preserved. lastmod → "2026-10-12" → as required.
- H1 and image line → identical → preserved.

### Introduction
- Clause sets out commitment to remain for a specified period; whether worker must repay training costs, signing bonus or retention bonus after leaving early; whether employer may seek a separate contractual penalty → draft P1 sentences 3–4 → preserved.
- Signed clause alone establishes neither enforceability nor amount repayable → draft P1 sentences 1–2 ("does not, by its existence alone, establish that it is enforceable. Nor does it establish the amount repayable.") → preserved.
- Statutory requirements and actual circumstances of payment, training, termination examined step by step regardless of label → P1 last sentence → preserved.
- Four questions list → verbatim → preserved.
- Same contract may address all four, different provisions/evidence apply; the four points examined independently → P3 → preserved (list order unchanged).

### §1 (heading renamed; "Short Answer" dropped, question moved into body)
- Not automatically void: "No." → "Is a minimum-service-period clause automatically void? No." → preserved (question is the FAQ question verbatim).
- Art. 15-1 para 1: two alternative grounds; (1) employer provides professional skills training and bears cost; (2) reasonable compensation in return for commitment → P1 → preserved, both grounds attached to Art. 15-1 para 1.
- Either suffices; both need not be met → "With either one, a clause may satisfy the statutory requirements. Both need not be met." → preserved.
- "Which ground actually exists, not what name the contract gives it" → P1 → verbatim.
- One ground + separate reasonableness review; not required together; writing one in does not automatically make clause enforceable → P2 sentences 1–2 (together with "Both need not be met" in P1) → preserved.
- Para 2: reasonableness of agreed period and scope of liability reviewed separately once a ground exists → P2 sentence 3 → preserved.
- Must not exceed reasonable scope in light of all circumstances incl. training duration/cost, replaceability, amount/scope of compensation → P2 last sentence → preserved.
- Para 3: clause violating para 1 or para 2 is void → P3 "Paragraph 3 states the consequence. A clause that violates ... is void." → preserved; article attached correctly.
- Criteria for individual review; not uniformly valid/invalid from outset → P3 → preserved.
- Signature may establish agreement, cannot replace statutory requirements; length alone not decisive; investment/compensation actually provided and reason for the period must be examined → P4 → preserved.

### §2
- Employer must actually provide training and bear cost; plan calling it professional or an estimated cost in the contract not enough; evidence must connect subject, skills for role, duration, completion, actual expenditure → P1 → preserved.
- Directly verifiable costs (outside instructor fees, tuition, materials/equipment) and basis for internal costs; whose time, how it differed from supervision/handover, why attributable to this worker; estimated or uniformly allocated amounts do not prove expenditure → P2 → preserved ("not only ... but also" became two sentences).
- Basic records list; provider agreement, vouchers, refund terms; who ultimately bore each cost if worker/third party paid → P3 → verbatim.
- Line not drawn solely by where/who; in-house may be professional, outside lengthy course may be introductory; internal training not excluded across the board; not satisfied merely because expensive or lengthy → P4 → preserved.
- Relationship between service period and investment must be explained; skills, relation to role, why period necessary given duration/cost; work actually performed after training and time already served inform burden → P5 → preserved.

### §3
- Second ground = reasonable compensation in return for commitment → "Reasonable compensation for the service commitment is the second ground." → preserved (full statutory wording retained in §1 P1).
- Purpose/structure distinct from ordinary wages or compensation already due; pay-statement label does not determine legal character → P1 → preserved.
- Examine purpose first: recruitment wage term / consideration for staying / performance compensation; payment date, amount, vesting date, connection to period, repayment grounds and formula presented so worker could understand before contracting → P2 → preserved (recast as a question plus "The contract and disclosure materials should say which").
- MOL June 5, 2026 guidance: role as compensation must be clearly disclosed when a retention/signing bonus or prepaid benefit is used; later reinterpretation or reclassification of wages cannot readily substitute for disclosure at signing → P3 → preserved, "cannot readily" kept (rewriter's spot-check item).
- Reasonableness not amount alone: actual additional benefit, clear conditions, vesting of served portion, excessive repayment; compensation does not permit any length/any amount → P4 → verbatim.
- Terms vs actual payment: delayed, installments, conditional, net after tax/deductions, separate written disclosure → P5 → preserved.

### §4
- Even with one ground, period and liability must remain reasonable → dropped as §4 lead-in; carried by §1 P2 ("Once a statutory ground has been established, paragraph 2 requires a separate review ...") → preserved (consolidation, no loss).
- Para 2 prescribes no fixed answer by label or occupation; four factors → P1 + list → list verbatim.
- Factor 1: actual duration and cost; beyond stated total: itemized evidence, amount per worker, skills, portion already recovered → P2 → preserved.
- Factor 2: not solely employer's assertion; availability, qualifications/proficiency, usual fill time, objective evidence → P3 → preserved.
- Factor 3: amount and scope; timing, irrevocable vesting conditions, correspondence to whole period, served portion reflected on early end; same label assessed differently → P4 → preserved.
- Factor 4: circumstances of agreement, nature of work, explanations, actual period served, reason ended; importance varies by case; not limited to examples; all facts in record → P5 → preserved (order of two sentences swapped, meaning same).
- Proportionality among period, investment, replacement difficulty, compensation, repayment burden; not predetermined by occupation; other case outcome not simply applied; arrangement at signing and performance at end both considered → P6 → preserved.

### §5
- MOL guidance June 5, 2026: costs of routine education, ordinary OJT, new-hire adaptation training, legally required training cannot ground a clause or a penalty/reimbursement claim → P1 sentences 1–2 → preserved (the two original lists of the same four kinds merged into one list that keeps both wordings: "routine education conducted regularly", "helps new hires adapt to their work and familiarizes them with the work environment and procedures").
- Letter No. 勞動關2字第1150141814號 addresses these kinds → P1 sentence 3 "The guidance, Ministry of Labor Letter No. ..., addresses each kind separately." → preserved; the letter is identified with the June 5, 2026 guidance exactly as the Official Sources entry does. See "Original issues" note on the adverb "separately".
- Such training accompanies business operations or statutory compliance, so costs cannot become a service obligation or sanction for early termination → P1 last two sentences → preserved.
- Name not decisive; curriculum, content, duration, costs borne, evidence → P2 sentences 1–2 → preserved.
- Substance of ordinary new-hire courses (work rules, organization/systems, handovers, basic safety); ordinary recruitment/management/handover costs cannot be relabeled → P2 → preserved.
- Not excluded merely because in-house; mixed programs examined per component (subject, duration, cost, legally required status); party relying on professional component must show difference and who bore cost → P3 → preserved.
- Review detailed table of contents and operating records, not just cover; routinely repeated, specific qualification/equipment skill, required by law, actually attended, evidence matching claimed amount → P4 → preserved.

### §6
- "Not necessarily." → "Must a worker who leaves early repay a signing bonus or retention bonus in full? Not necessarily." → preserved (FAQ question verbatim).
- Purpose as compensation must have been clearly disclosed → P1 → verbatim.
- MOL June 5, 2026 guidance: repayment in proportion to unserved period; employer must not demand full repayment → P1 → preserved.
- Outcome requires review of purpose, terms, period served, reason ended → P1 → verbatim.
- Disclosure not first made after dispute; at signing and payment worker should understand which payment, full period, vesting, settlement formula → P2 → verbatim.
- Proportional repayment: establish agreed start/end, actual dates worked, base amount; fixed amount ignoring served period reviewed against proportionality; installments/staged vesting calculated separately → P3 → preserved ("For example" moved mid-sentence).
- Analysis order: enforceability → legal character → period served → reason ended → formula; "penalty" label does not establish amount → P4 → preserved.
- Full-repayment provision, fixed penalty unrelated to loss, unilateral wage deduction are separate issues; legal bases, terms, labor-law restrictions, lawfulness of deduction examined separately; employer's demand or partial payment does not resolve issues → P5 → preserved.
- Training-cost reimbursement vs prepaid-benefit repayment distinguished; double counting check → P6 → verbatim.

### §7
- Art. 15-1 para 4: contract ends before period for reason not attributable to worker → no liability for breach or training-cost reimbursement → P1 → preserved, article attached.
- Reason and attribution from specific evidence (dismissal notices, resignation communications, records of alleged working-condition violations) → P1 → verbatim.
- Ending early alone is not a breach; who said what, legal ground, to whom attributable → P2 → preserved.
- Materials list; health/work circumstances mentioned does not decide; course of events, legal ground, evidence together → P3 → preserved.
- Dismissal, mutual termination, alleged violations are examples, not exhaustive; same label may differ; document label may not match facts → P4 → preserved.
- Cause affects repayment scope; when para 4 applies no liability, so attribution before amount; separate claims reviewed separately → P5 → preserved (sentence order swapped, logic kept with "therefore").

### §8
- Clause does not physically or legally prevent resignation; notice/notice period = when relationship ends; enforceability/repayment = whether financial liability → P1 → preserved.
- Worker terminating indefinite-term contract: Art. 15 applies notice periods of Art. 16 para 1; Art. 16 governs employer termination, applied to worker via Art. 15 → P2 → preserved.
- 10 / 20 / 30 days for ≥3 months <1 year / ≥1 year <3 years / ≥3 years → list verbatim.
- Fixed-term contract for a specific task exceeding three years: separate rule under Art. 15; after three years, worker may terminate with 30 days' notice; distinguished from indefinite-term tiers → P4 → preserved.
- Under three months, other fixed-term type, immediate-termination ground: examine individually; longer contractual notice or demand for immediate handover does not predetermine → P5 → verbatim.
- Preserve notice content/date, receipt date, last-day communications; separate four matters → P6 → preserved ("Keep four matters apart" lists the same four).

### §9 (heading and H3s renamed; two numbered lists turned into prose)
- Intro: review contract with chronological records of training, payments, service, termination; table of served/unserved and record-to-item mapping → P1 → preserved.
- Employer items 1–8 → "The Employer's File" P1–P2 in original order: (1) identify ground; (2) distinguish general/routine/legally required/professional by content, duration, purpose; (3) preserve outlines, schedules, completion records, invoices, receipts, who bore cost; external/internal cost grounds separately; (4) link in writing purpose, payment date, amount, vesting, disclosures, unserved-period formula; (5) document period basis, replaceability, needs vs investment; (6) proportionality and period served; (7) cause and attribution before termination date and served/unserved periods ("Only then calculate"); (8) compare records before deduction or demand → all preserved.
- Standard-form caution; design to reflect investment, compensation, replaceability; explain purpose and proportional formula before signing → P3 → preserved.
- Worker items 1–8 → "The Worker's File" P1–P3 in original order: gather; determine; obtain (prepaid benefits); record separately; preserve notices and delivery proof; arrange chronologically and review with demand/pay statements/communications/deduction records; review four matters separately; do not admit liability solely because signed or demanded, examine evidence for Art. 15-1 requirements, reasonableness, attribution, proportional formula → all preserved.
- Chronology dates (signing, training start/end, each payment, first/last day, each notice delivery); employer-held records: organize own materials and the demand's basis first, then seek more through appropriate procedures → P4 → preserved; last body paragraph ends on this column's facts.

### §10–11, disclaimer, signature
- Four Official Sources entries (Art. 15-1, Art. 15, Art. 16, MOL Letter with date) → byte-identical.
- Three Related Guidance links → byte-identical.
- Disclaimer: educational / not legal advice / variables list / consult latest official sources before notice, deduction, repayment agreement, dispute → identical except first-sentence wording → preserved.
- Signature "Wei Tseng (曾雋崴), Taiwan Attorney" → identical.

### Additions screened
- Framing sentences listed in notes item 7 (e.g. "One ground does not end the review.", "Paragraph 3 states the consequence.", "Start with the payment's purpose.", "The cover alone is not enough.", "They should not be treated as one.", "Only then calculate ...") → no new fact, example, case, number, first-person story, promise or sales line.
- Count words: "Four kinds of training" (4 listed), "three issues" (3 listed), "Keep four matters apart" (4 listed), "Four questions" (4 listed) → all correct.
- Three body questions: two are the FAQ questions verbatim; the third (§3) lists the original's three purpose alternatives → no new content.

## Blocking issues

None.

## MONOTONY items

None blocking. Rule §5 self-check:
1. Tool: OK, 0 FAIL.
2. Opener: "A signed minimum-service-period clause does not, by its existence alone, establish that it is enforceable." Fact/common-misconception type, no stock hypothetical.
3. Very short sentences present ("Both need not be met.", "Start with the payment's purpose.", "The cover alone is not enough."); no run of long sentences beyond run3=0.04.
4. Paragraph openers: no word used more than twice (A, One, To, Where, Start, The, Article, In, When each 2).
5. No "claim (statute) → caveat" run; many paragraphs without a citation.
6. Contrast templates: 0 by tool; the remaining "not what name the contract gives it" / "not an exhaustive list" are the original's legal qualifiers.
7. Last body paragraph ends on the column's facts (chronology dates, employer-held records). The disclaimer paragraph is retained because its content is a fact-preservation requirement; only its first sentence was reworded.
8. Plain English register, no bold, no emoji, no imperative checklist headings (H3s are now "The Employer's File" / "The Worker's File").
9. No article number, deadline, amount, link or label lost (see counts above).

Native-reader note: the prose is still formal legal exposition with many "must be examined / should be reviewed" constructions, which come from the original's content and are not a rewrite defect. The staccato transitions ("Paragraph 3 states the consequence.") are the deliberate rhythm the rule asks for and do not stack caveats or preview.

## Tests verdict

PASS. tests.patch touches only src/lib/__tests__/columns-en-labor-014.test.ts (+122/−79, one it() renamed). Checked:
- lastmod and renderer date → "2026-10-12"; word count 3_794 → 3_691 (recomputed independently with the test's own formula: 3691); read time 19 unchanged.
- headings[0], headings[8] and the two H3s re-pinned to the new titles.
- Disclaimer constant re-pinned to the reworded first sentence; the rest of the string and the EOF lock unchanged.
- FAQ test: the "exactly two verbatim copies" assertion was replaced because the verbatim duplication was intentionally removed. The new version still locks (a) each FAQ answer in raw front matter, (b) the first paragraph of H2 #1/#5/#6/#7 containing the Art. 15-1 para 1 grounds and "Both need not be met", the June 5, 2026 guidance and all four excluded training kinds, "Not necessarily" + proportional repayment + "must not demand full repayment", and the Art. 15-1 para 4 protection, (c) rendered first paragraph equals source, (d) the "What the training is called is not decisive ..." paragraph in §5.
- Section phrase lists (§1–§9) re-anchored to sentences carrying the same facts; the 10/20/30-day tiers, three-year fixed-term rule, Letter number, proportionality, para 2/3/4 rules all still asserted. Both 8-item checklists are asserted as 8 ordered prose phrases each.
- Untouched: Han-string lock (letter number ×2, 曾雋崴 ×1), URL/internal-link counts, forbidden-literal checks, other columns. No .skip/.only/.todo.
- vitest-1.log: 80 files, 1092 tests passed.

## Tiny edits applied

None. draft.md is unchanged by this review; guard.txt remains GUARD: PASS as produced by the rewriter.

## Original issues (not blocking)

- §5: the original's "Letter No. ... separately addresses [four kinds]" is ambiguous (the letter addresses them as a separate point, or addresses each individually). The rewrite reads it as "addresses each kind separately". Neither version adds or removes a legal consequence; if the letter is ever re-read, confirm which reading matches its structure. The tests.patch pins the new sentence, so any later change must go through the test too.
- Official Sources entry for the MOL letter is a search-result position URL (cnt=926, recordno=10) that may drift as records are added. Carried over unchanged from the original.
- §4 P5 "The importance of each factor may vary by case" is ambiguous in the original (statutory factors vs listed circumstances); kept verbatim.
- House format: no contact email line, Related Guidance after Official Sources, no source-check date. Pre-existing and tolerated by the guard.
- Not verified against law.moj.gov.tw in this review: Art. 15-1 paragraph numbering and Art. 15/16 notice tiers are taken from the original, as the task instructs.
