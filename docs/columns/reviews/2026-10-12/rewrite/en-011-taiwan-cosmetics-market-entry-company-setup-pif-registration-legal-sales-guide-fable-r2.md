# Final review r2 — en-011 taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide

Reviewer: Claude Fable 5.1 (final gate). Date: 2026-10-12. Round 2, after the Opus fix round (notes.md "fix round review-1") and the Sonnet test re-sync (claude-tests1.log, vitest-1.log).

## Verdict

PASS. The single blocking item from round 1 (read_time left at 13 while the text computes to 12, and the test patch hard-coding 13 with a TODO) is fixed on both sides: draft.md front matter now says "12 min read", and tests.patch restores the `${minutes} min read` assertions and sets both metadata expectations to 12. The column text is unchanged from the round-1 text that I had already checked claim by claim; I re-read orig.md and draft.md in full this round and the fact table below is re-verified, not copied. Guard PASS, variety check OK, pinned tests 79/79 files and 1377/1377 tests pass in the pipeline checkout.

## Scope checked

- Read in full: orig.md, draft.md, guard.txt, notes.md (including the fix-round section), tests.patch (26,708 bytes), tests.txt, claude-tests1.log, vitest-1.log, review-r1.md, SENTENCE-VARIETY-RULE.md sections 5–6, COLUMN-VOICE-RULE.md; skimmed LESSONS.md (items 1–15).
- Ran: `guard.py … en … --today 2026-10-12` → GUARD: PASS (length 1727 → 1577, 91%; monotony 25.9 → 6.7). `variety_metrics.py check draft.md --lang en` → OK, no limit violated (sentences 112, mean 17.2, cv 0.474, short 0.125, run3 0.055, opener_rep 0.103, cite_end 0.0, contrast 0, caveat 0, q 6).
- Programmatic comparison (python, no network): lines 1–23 (front matter, H1, featured image) differ only at line 7 read_time "13 min read" → "12 min read"; link targets 18 → 18, same URLs, same order; Article references identical (Article 7, Article 8, Article 7(1)(7)); every number in the original body appears in the draft body; bold markers 0; em-dashes in the body 0 (the two in the FAQ front matter are the original's); no paragraph-opening word occurs three times.
- tests.patch: one file touched (`src/lib/__tests__/columns-en-investment-011.test.ts`), no `.skip` / `.only` / `.todo` / `xit`, it() count unchanged (one renamed), tests.txt reports +94/−91 lines and "PASS (Test Files 79 passed (79))".
- Pipeline worktree check (`~/Projects/tseng-law-rewrite-1006-w2`) was not run: the sandbox blocked git in that directory. vitest-1.log from that checkout is the evidence used instead.

## Fact table (original → rewrite → status)

### Front matter
- title, seoTitle, url, lastmod "2026-10-12", date_display, categories, featured_image, summary, all three FAQ q/a → byte-identical → preserved.
- read_time "13 min read" → "12 min read" → changed as required by round 1; the test's visible-word count is 2,296 (2,296 / 200 = 11.48 → 12) and the restored assertion `read_time === \`${minutes} min read\`` passes, which proves the value is consistent with the text.

### Intro (two paragraphs)
- Decide who imports, when registration is completed, who manages the PIF and where it is retained, how labeling and advertising are reviewed → four questions in para 1 → preserved.
- May use a local importer or operate directly; forming a company alone does not complete the preparations → para 1 → preserved.
- Obligations vary by product type and manufacturing site, actual import structure, distribution method, advertising content → para 2 → preserved.
- Preview sentence "This article distinguishes among…" → removed → acceptable, no legal content.
- Recheck the latest laws and competent-authority guidance per product before setting a supply schedule → para 2 → preserved.

### 1. Importer or direct setup
- Section lead (original = FAQ 1 pasted, starting "No."): no subsidiary/branch required; a Taiwan importer, possibly also the distributor, may import and sell → lead sentences 1–2 → preserved.
- Subsidiary and branch differ in formation and registration, liability, tax → moved into the subsidiary paragraph ("They differ in formation and registration, legal personality, the head office's liability, accounting and tax treatment…") → preserved.
- Approval and registration time varies by matter and supplemental-document requests → MOEA paragraph "Timing varies. It depends on … whether supplemental documents are requested." → preserved.
- Choose the business model first; identify the entity bearing manufacturer/importer responsibilities → lead last sentence → preserved.
- Distributor may also be importer, or a separate importer → "Either the distributor also serves as the importer, or a separate importer takes part." → preserved.
- Contract labels (agent, master distributor, distributor) do not determine legal responsibility → preserved.
- Allocation: who imports and completes registration; who prepares, updates, retains the PIF; who reviews labeling, keeps distribution records, receives complaints and safety information, responds to inspections and information requests; statutory duties reviewed together with contractual split → preserved in full.
- Agreement: IP use (trademarks, images); provision, translation, supplementation of manufacturer records; management and handover of updated records at end; authority to review and revise advertising in advance; transmission of complaints and adverse events; recall cooperation; testing, translation, retention costs; records not left with one party; scope and deadline for return or copies agreed in advance → preserved in full.
- Subsidiary = separate legal entity under Taiwan law; branch = registered as part of the head office; differ in legal personality, head-office liability, accounting and tax, profit remittance, representative authority, internal controls; form not chosen solely by desired sales control → preserved.
- If foreign-investment procedures are required, consult the Department of Investment Review, MOEA; steps (investment approval, remit funds, register company/branch, bank account, tax registration, importer status); timing depends on investor, industry, form, documents, supplemental requests; no launch date on an assumed fixed period; confirm applicable procedures and latest filing requirements → preserved.
- Central responsible entity under cosmetics regulation = manufacturer or importer; documentation or safety assessment may go to an outside expert; outsourcing alone does not transfer responsibility; distinguish contractual allocation from legal responsibility → preserved.

### 2. Registration vs PIF
- Section lead (original = FAQ 2 pasted): registration is a separate procedure via TFDA's platform; PIF compiled/prepared/updated/retained by manufacturer or importer; PIF not submitted to TFDA in advance → lead ("TFDA does not receive the PIF in advance" = same meaning) → preserved. The PIF content list and the July 1, 2026 phase-in from the lead now appear once, in the PIF section → preserved.
- Registration required before supplying, selling, giving away, publicly displaying, or providing for trial; timeline must cover giveaways and trials → preserved ("Paid sales are not the only trigger" carries the original's "should not focus only on paid sales").
- Valid three years; extension within the three months before expiry → preserved.
- Changes to name, purpose, dosage form, ingredients, manufacturing site → determine the procedure for that change → preserved.
- Registration = reporting prescribed information through the platform; completion does not mean PIF records are in place, nor that labeling/advertising is lawful; three separate workstreams → preserved.
- PIF = ongoing account of quality and safety; content list (quality, safety, composition, claimed functions, manufacturing methods, test results, safety assessment); supporting records (basic product and manufacturer information, label) per product; 16 categories under the PIF Regulations; records, signature and qualification requirements checked by product type → preserved.
- Phased by product category; from July 1, 2026 all cosmetics in principle; sole exception solid handmade soap made at a site exempt from factory registration; handmade or "soap" alone is not enough, both solid form and site exemption must be confirmed → preserved.
- Qualified third party may assist, including safety assessment; manufacturer/importer responsibility remains; manufacturer, lab, assessor and Taiwan business share changed information and current signed records → preserved.
- Update triggers (ingredient/formula, method/site, labeling incl. label, claimed function, safety information); complaints, adverse events, new test results may affect the assessment; change control after first preparation → preserved.
- Article 7 PIF Regulations: at least five years from the day after last supply to the market → preserved, article on the right claim.
- Article 8 PIF Regulations: retention at the manufacturer/importer address specified in Article 7(1)(7) of the Cosmetic Hygiene and Safety Act → preserved, both articles on the right claims.
- Period rule and location rule to be distinguished in practice → "One rule answers how long, the other where, and practice should keep them apart." → preserved.
- Access to complete records even if originals are with the manufacturer or in a secure electronic/cloud repository; access rights, backups, version control, file formats, responsible personnel; prompt retrieval and production at the authority's request; agreement covers handover, method, survival of access for the statutory period → preserved.
- Inspection: in principle at least seven days' notice; no-notice inspection if a statutory exception applies; records kept ready regardless → preserved.
- False information in registration or PIF: NT$10,000–NT$1,000,000; incomplete PIF: correction order within a period, fine only if not corrected; not treated alike → preserved.
- Recall or destruction not automatic; safety, nature of violation, corrective status, statutory requirements per measure considered separately; safety measure vs documentation request; follow the authority's notice and the law → preserved.

### 3. Labeling, promotion, advertising
- Section lead (original = FAQ 3 pasted): overall presentation (names, text, images, symbols, sound), not wording alone; false/exaggerated and medical-efficacy claims prohibited; NT$40,000–NT$200,000 and NT$600,000–NT$5,000,000 → lead → preserved.
- Acne / anti-inflammatory / sterilizing claims require particular care → review paragraph "so these claims require particular care" → preserved (once instead of twice).
- Influencer posts reviewed under the same standards if advertising in substance → last sentence of the influencer paragraph → preserved (moved from lead).
- Not decided by a single word; name, sentences, images, symbols, sound, context, overall impression considered together; small-print disclaimer does not necessarily cure a dominant message; review both individual claims and the final advertisement as produced → preserved.
- Also review disease association, before-and-after images, medical-professional presentation, ingredient-to-therapeutic-effect contexts → preserved.
- Fine ranges differ by violation type; compare overall presentation against supporting records before publication → preserved (the amounts sit in the lead immediately above).
- Influencer/reviewer/partner post may be advertising in substance by content and commercial context; factors (payment, free products, sales links, posting instructions, repeated collaborations); not every personal post is brand advertising; examine relationship, content, degree of involvement → preserved.
- Collaboration agreements and guidelines: permitted claims and supporting records, pre-publication review, correction/deletion procedures; comments, livestream/short-video oral explanations, inconsistencies among sales pages and labels in scope; retain drafts, approval history, correction requests, final materials → preserved.
- Six-step sequence → six steps, same order and content → preserved.
- Three internal links (company formation basics, investment services, Wei Tseng profile) → same slugs → preserved.
- Official Sources (13 entries) → identical.
- Disclaimer: general educational information; not legal advice on a specific product or advertisement; no guarantee of permit/registration, eligibility for sale, processing time; structure, records, labeling/advertising content, current practice confirmed per matter → preserved, shorter wording, same content.
- Signature "Wei Tseng (曾雋崴), Taiwan Attorney" → preserved.

Nothing added: no new facts, examples, cases, numbers, first-person material, promises, contact lines or sales lines in the rewrite.

## Blocking issues

None.

Round-1 item closed: Original `read_time: "13 min read"` with test `expect(minutes).toBe(13)` and `read_time === \`${minutes} min read\`` → round-1 rewrite kept 13 while the patch hard-coded '13 min read' with a TODO → round-2 draft says "12 min read"; patch lines 34–35 and 43–44 set both metadata expectations to '12 min read', lines 322–328 keep `visibleWordCount 2_296`, `minutes 12` and the two `${minutes} min read` assertions; the TODO comment is gone. vitest-1.log shows the file passing (14 tests).

## MONOTONY items

None. Tool: OK, no FAIL. Rule section 5 self-check: (1) tool OK; (2) opening is a reader-question type, no "Suppose" formula; (3) very short sentences present ("Timing varies." "It may." "The exception is narrow." "No single word settles it."), no long-sentence runs (run3 5.5%); (4) no paragraph-initial word three times (max 2: The, If, Registration); (5) no claim→caveat chains, many citation-free paragraphs; (6) contrast templates 0; (7) last paragraph before the disclaimer is the links paragraph, the closing disclaimer and signature are the original's house format and are required content; (8) plain English register, no bold, no emoji, headings nominal or gerund, none imperative; (9) no fact, number, citation or link lost.

Non-blocking style notes carried from round 1, unchanged on purpose because tests.patch pins the sentences and the 2,296 word count: six questions in the body (four are the single opening device); "Does an influencer's post count as the brand's advertising? It may." is a rhetorical tic; "to sell here" is informal for a firm addressing foreign readers.

## Tests verdict

PASS. Every hunk re-anchors a heading, paragraph, phrase or metadata value to the new wording of this column. The FAQ-answer-as-lead contract (`answer: faq[n].a`) was replaced by the literal new lead paragraphs because the pasted-FAQ structure was intentionally removed; the lead is still pinned exactly. Locked facts still locked with the new wording: three-year validity, three-month extension window, July 1, 2026 phase-in, solid handmade soap exception, 16 categories, Article 7 / Article 8 / Article 7(1)(7), seven days' notice, NT$10,000–NT$1,000,000, NT$40,000–NT$200,000, NT$600,000–NT$5,000,000, the once-only count of the registration-platform sentence, the six steps, the internal and official link lists (untouched tests), the disclaimer and the author line, visible word count 2,296 and read time 12 tied to the front matter. No `.skip`/`.only`/`.todo`, no it() added or removed, no other column's test touched.

Operator note (not blocking, repeated from round 1): the patch base is index daf51b4a3 (FAQ answers with the leading "No.", 2_481 words). Apply it in the pipeline checkout where it was produced and tested, not blindly to a working copy on a different base.

## Tiny edits applied

None in round 2. The draft was not touched; guard and variety were re-run on it as-is and pass.

## Original issues (not blocking)

- The original's three section leads were the FAQ answers pasted verbatim, including a "No." that only makes sense after the FAQ question. The rewrite replaced those leads; the FAQ answers in the front matter are unchanged.
- "From July 1, 2026" has passed as of 2026-10-12. The wording is tense-neutral and still correct; a later edition could say the requirements have applied to all cosmetics since that date (LESSONS item 8, law-version).
- House format tolerated by the guard (no contact email, no source-check date on the sources list, last H2 is not the sources section) is unchanged from the original.
- Statutory figures (3 years, 3 months, 5 years, 7 days, 16 categories, the NT$ ranges, Articles 7 / 8 / 7(1)(7)) were carried over unchanged. Neither the rewriter nor this review re-verified them against law.moj.gov.tw, per the instruction not to re-litigate the original.
