# FINAL REVIEW r1 — en-016-taiwan-inheritance-custody-analysis (reviewer: Claude Fable 5.1, 2026-10-12)

## Verdict

PASS. The rewrite preserves every legal statement, qualifier, article number, date, period, source entry, disclaimer point and the signature of the published original. Nothing new was added. Front matter differs only in lastmod. The variety check reports no violation and the text reads as plain English prose rather than a template. The tests patch only re-anchors pinned wording of this column and keeps every fact lock. No edits were made to draft.md.

## Scope checked

- orig.md (published) and draft.md (rewrite), read in full and compared paragraph by paragraph.
- guard.txt: GUARD: PASS (length 3557 -> 3447 words, 97%; monotony 31.9 -> 7.7; pre-existing lint notes about missing email, heading order and source-check date are house format of the original, tolerated).
- notes.md (rewriter Claude Opus): four drifts from an earlier interrupted run already repaired; count words flagged for checking (all verified below).
- tests.patch (32 KB, one file: src/lib/__tests__/columns-en-family-016.test.ts), tests.txt, vitest-1.log (79 files / 1029 tests passed in worktree /Users/son7/Projects/tseng-law-rewrite-1006-w1 on base a0039a0d3).
- SENTENCE-VARIETY-RULE.md sections 5-6, COLUMN-VOICE-RULE.md, LESSONS.md top items.
- Variety metric run by me: `variety_metrics.py check draft.md --lang en` -> sentences=166 mean=19.0 cv=0.461 short=0.157 run3=0.012 opener_rep=0.174 cite_end=0.006 cite_para=0.261 contrast=1 caveat=0 q=2 — OK, no violation.
- Hashes (python hashlib): orig.md = 40185cb7…918 (= the patch's old frozen value), draft.md = 485e9bd4…6ab (= the patch's new frozen value).

## Fact table (original point -> location in rewrite -> status)

Front matter / FAQ
- title, seoTitle, url, date_display, read_time "19 min read", categories, featured_image, summary, FAQ 1-4 q and a -> identical byte for byte (only line 5 lastmod 2026-07-25 -> 2026-10-06) -> preserved.
- H1 and image line -> identical -> preserved.

Introduction
- Death triggers several processes: heirs, estate assets/debts, spouse's separate marital-property claim, parental rights/duties for a minor, need for guardianship, protection of child's property -> L27 -> preserved (all six items present).
- Issues may affect one another but have different legal bases and order of analysis -> L27 -> preserved.
- Three distinctions: inheritance share vs residual-property claim; parental rights vs guardianship; legal representation vs ownership -> L29 "Three pairs" -> preserved (count correct).
- Carrying one conclusion to another issue misleads about holder of right, property in calculation, court procedure -> L29 -> preserved.
- "general sequence … based on Taiwan's Civil Code and official procedural materials" (preview sentence) -> moved into the closing note L154 ("general educational information … based on Taiwan's Civil Code and official procedural materials") -> preserved in substance; preview removed (not a legal point).

§1 Statutory Heirs and Intestate Shares
- Arts 1138 and 1144: spouse inherits concurrently with heirs in applicable rank; descendants first -> L33 -> preserved, each article now stated once and still attached to the right rule (1138 = order; 1144 = spouse concurrent).
- Spouse + two children, no valid will, no waiver/disqualification/representation/other material fact -> each ordinarily one-third; hypothetical illustration, not a conclusion about any actual estate -> L35 -> preserved (one-third appears twice in file: FAQ + body, as before).
- Order: descendants, parents, siblings, grandparents; higher rank generally precludes lower -> L33 -> preserved ("generally" kept).
- Within same rank check timing of deaths, legal parentage, adoption, representation; obtain family-status records first -> L37 -> preserved.
- Spouse is not a lower-ranking relative in the 1138 order -> L33 "stands outside that order" -> preserved.
- Concurrent share may vary with the rank -> L33 -> preserved.
- Disqualification, effective waiver, representation in place of a predeceased descendant may affect result -> L37 -> preserved.
- Opening of succession does not make an heir sole owner of a specific deposit/parcel; co-inheritance: identify scope, settle debts/expenses, allocate by partition agreement or court; abstract share vs final allocation -> L39 -> preserved.

§2 Wills and Identifying the Estate
- Valid will may alter distribution; examine form, capacity, interpretation/enforceability, mandatory rules incl. reserved portions; mere existence doesn't settle every asset; partial will -> intestacy for remainder -> L43 -> preserved.
- Establish inventory and legal character first; assets list (6 items) and debts list (debts, guarantees, unpaid taxes, funeral expenses) -> L45 -> preserved.
- Not title alone; beneficial ownership, jointly titled shares, third-party rights, security interests -> L45 -> preserved.
- Insurance/retirement benefits with designated beneficiaries may be treated differently per contract and applicable law; trust property review; lifetime gifts -> recovery/inclusion/reserved portions; foreign assets -> lex situs and Taiwan choice-of-law -> L47 -> preserved.
- Investigation covers debts and procedural risks; document list organized as of reference date; incomplete data -> share differs from net estate -> L49 -> preserved.

§3 Residual-Property Claim
- Not the same as inheritance share; separate claim under Art 1030-1 if statutory requirements met; analyzed separately -> L53 -> preserved (orphan "No." from the FAQ replaced by a statement).
- Not every marital-period asset enters calculation; spouse does not necessarily receive half -> L57 -> preserved.
- Regime, reason and time of acquisition, debts, statutory exclusions examined on the facts -> L57 ("examined on the facts"; regime and whether a different one was agreed; when and why acquired; debts; exclusions) -> preserved.
- Compares increase in each spouse's marital-period property under statutory criteria when statutory regime ends -> L55 -> preserved.
- Legal basis, counterparty, included property differ from the inheritance share taken as heir -> L55 -> preserved.
- If established, reflected before the decedent's remaining property is identified as estate -> L55 -> preserved.
- Inclusion/exclusion rules, not merely marital-period acquisition; exclusions may include inheritance, gift, solatium; marital debts considered -> L57 -> preserved.
- Valuation date -> L57 -> preserved.
- Court may adjust if equal distribution manifestly unfair (1030-1); factors: duration, household work/childcare, economic contributions, occupational circumstances, acquisition/management -> L59 -> preserved.
- Existence/amount not predetermined by title or length of marriage -> L59 -> preserved.

§4 Inherited Debts and Waiver
- Art 1148 comprehensive succession from opening, except exclusively personal rights/obligations -> L63 (parenthetical citation) -> preserved.
- Liability generally limited to value of inherited property; procedures/exceptions: inventory, public notice and payment to creditors, preservation -> L63 -> preserved ("generally" kept).
- Art 1174: written declaration to court with jurisdiction within three months after learning of right to inherit -> L65 -> preserved (deadline, starting point, form, forum).
- Telling family / refraining from use must not be treated as a completed waiver in the prescribed form -> L65 -> preserved.
- Effect on next-rank heirs or representation checked against family relationships and stage of proceedings -> L65 -> preserved.
- Investigate assets and liabilities before disposal or payment; creditors, security interests, guarantees, ongoing contracts, tax-filing duties; inventory/creditor procedures where necessary; avoid concealment/omission affecting limitation of liability -> L67 -> preserved ("such as" examples kept).
- MOF Taiwan Tax Portal guidance updated June 25, 2026; general three-month period (court: inventory and waiver) and general six-month period (estate tax return); starting date, extensions, exceptions, jurisdiction case by case; not for calculating an individual deadline -> L69 -> preserved ("two general periods" count correct; both periods attached to the right procedures).
- Different authorities/documents for estate tax, household registration, title transfers (real property and vehicles), financial-institution payments -> L71 -> preserved.
- Waiver court documents vs estate-tax return at tax authority not to be confused -> L71 -> preserved.
- Periods may run concurrently; track each on a separate schedule -> L71 -> preserved.

§5 Surviving Parent
- Art 1089: when one parent cannot exercise rights/duties, the other ordinarily does -> L75 -> preserved.
- Surviving parent retaining parental rights, no contrary court order -> ordinarily continues -> L75 -> preserved ("ordinarily" and condition kept).
- Existing orders, statutory grounds for restriction/suspension, cross-border factors, best interests, other circumstances may still require judicial involvement -> L75 -> preserved.
- Content of parental rights (care/upbringing, residence, legal representation, property management); exercised for child's interests not parent's; day-to-day care vs significant disposition -> L77 -> preserved.
- Review relationships before/after death, divorce judgments, parental-rights rulings, restriction/suspension; foreign order recognition and effect in Taiwan and foreign procedures; conflict -> determine separately if ordinary representation suffices -> L79 -> preserved.
- Parental rights and inheritance separate; child's inheritance belongs to child, not part of parent's share; parent may hold parental rights without being heir; parent-heir conflict needs care -> L81 -> preserved.

§6 Guardian Designation
- Art 1091: guardianship when no parent or neither parent can exercise -> L85 "two situations" -> preserved (count correct).
- One parent's death alone must not be assumed to commence guardianship; check status, orders, actual ability -> L85 -> preserved.
- Art 1093: last parent exercising may appoint guardian by will; formalities; authority; even with designation examine commencement, eligibility/acceptance, court reporting, supervision -> L87 -> preserved.
- Art 1094 statutory order and Art 1094-1 court appointment if no valid designation / designee cannot serve; best-interests factors (age/views, relationship/care ability, property-management suitability, stability) -> L89 -> preserved.
- Relatives/authorized applicants may ask court to appoint/replace guardian or order measures where statutory grounds exist; family relationship alone does not make one guardian; guardian not same as parent; separate duties (scope, inventory, reporting, supervision) -> L91 -> preserved.
- Personal care vs property management assessed; safeguards for candidate abroad long-term, conflicting economic interest, no asset-management experience; court may set supervision -> L93 "two roles" -> preserved (count correct).

§7 Minor's Inherited Property
- Arts 1087 and 1088: inherited property is child's separate property; parent/guardian not beneficial owner -> L97 -> preserved (FAQ question and "No." kept as a body question).
- Management, use, collection of income, legal representation, disposition in child's interests -> L99 (four Art 1088 powers listed; legal representation stated separately) -> preserved.
- Conflict of interest or significant disposition may require special representative or court involvement -> L103 -> preserved (moved to the Art 1086 paragraph).
- No unrestricted unilateral authority -> L99 -> preserved.
- Separate property = belongs to minor; deposits, real property, shares, other rights identified and managed separately; no use for personal living expenses or debt repayment -> L97, L99 -> preserved.
- Records: type, need, adequacy of consideration, proceeds plan; high-value/high-risk (sale of real property, security, business investment) -> check permission under another law or court procedure -> L101 -> preserved.
- Conflict where co-heirs or counterparties; Art 1086 special representative, incl. partition agreement/litigation; assess form and actual economic conflict -> L103 -> preserved ("not only … but also" became "and", both criteria still required).
- Guardian management rules (inventory, documents, income/expenditure separation, reporting, supervision); accounts identified as child's; record purpose/basis of each expenditure; systematic records for transfer at end of guardianship or adulthood -> L105 -> preserved.
- Trust/insurance not safe on contract alone; trustee/beneficiary, payment conditions, fees, safeguards, amendment/termination, reserved portion and tax; balance needs; manager's convenience not priority -> L107 -> preserved.

§8 Cross-Border
- Domestic Civil Code rules not applied immediately; connecting facts (nationality, domicile/habitual residence, center of life at death, location of property, foreign marriage/divorce, parental-rights orders) affect governing law and jurisdiction; different connecting factors per issue -> L111 -> preserved.
- Act Governing the Choice of Law in Civil Matters Involving Foreign Elements as starting point; also international jurisdiction, recognition/enforcement, treaties, foreign law; foreign property transfer checked locally -> L113 -> preserved.
- Foreign will: form, substantive effect, translation/authentication, probate/enforcement; foreign certificates: apostille or consular legalization and translation; identity mismatch -> additional documents -> L115 -> preserved.
- Foreign judgment on parental rights/guardianship: finality, due process, recognizability in Taiwan -> L117 "three questions" -> preserved (count correct); habitual residence abroad -> local jurisdiction and emergency measures; which proceedings first: best interests and enforceability -> L117 -> preserved.
- Tax in more than one country; overlaps (foreign inheritance/gift tax, financial-account reporting, real-property transfer taxes); double-tax relief; exchange-rate date, valuation method, taxpayer scope differ; no copying of results -> L119 -> preserved.

§9 (heading renamed "Practical Planning Checklist" -> "Gathering Records and Sequencing the Procedures")
- Framework for complete facts and avoiding confusion; filing order varies with agency and urgency; each deadline checked separately -> L123 "Six steps" -> preserved (count correct).
- Items 1-6 -> L125-130 -> each item's full content preserved (documents and authentication; assets and liabilities incl. registered/beneficial ownership, insurance beneficiaries, trusts, joint property, lifetime transfers; will review and reserved portions; separate calculation and no double counting; minor's property, representation, conflict, special representative, separate accounts; procedures sorted by agency with jurisdiction, starting date, documents, supplementation, extension, receipts).
- Record-keeping (location, dates, same classification; who holds and who approved; limited access to minor's information) -> L132 -> preserved.
- Urgent preservation vs routine filings; examples; urgency does not authorize unauthorized disposition; single tracking schedule -> L134 -> preserved.

§10 Official Sources
- Five entries and URLs -> L138-142 -> identical.
- Caution: check amendment/entry-into-force dates; English text as aid only; Judicial Yuan form and Tax Portal are general guidance; confirm with receiving agency -> L144 -> preserved.

§11 Related Services -> L148-150 -> identical three links.

Closing note and signature
- General educational information on the four areas; not legal advice; outcome varies with heirs, will, assets/debts, regime, orders, cross-border factors; confirm official materials and facts before computing waiver/tax deadlines or disposing of property -> L154 -> preserved (plus the moved "based on Taiwan's Civil Code and official procedural materials").
- "Wei Tseng (曾雋崴), Taiwan Attorney" -> L156 -> identical.

Added content check: the only new words are count words ("Three pairs", "two general periods", "two situations", "two roles", "three questions", "Six steps"); each count matches the list that follows. No new examples, cases, numbers, first-person material, promises or sales lines.

## Blocking issues

None.

## MONOTONY items

None blocking. Section 5 self-check:
1. Metric: no violation (see numbers above).
2. Opening is a fact-first sentence, not a stock hypothetical opener.
3. Very short sentences present (e.g. "It is a separate claim." "Courts may still become involved." "The two must not be confused."); long list sentences are each followed by shorter ones.
4. Paragraph openers read vertically: no word starts three or more paragraphs (The, A, Article, Under, Before, Parental, For, With each twice).
5. No run of three "claim (statute) -> caveat" paragraphs; many paragraphs carry no citation.
6. Contrast templates: metric counts 1; the softer "is not the same as" / "one thing … another" forms are inherited from the original (which had 5) and none rebuts a claim the reader did not make. The one body question ("May a surviving parent freely use …?") is the FAQ question the reader actually asks.
7. Last body paragraph (§9) ends on this column's own facts. The closing note is the original's required disclaimer, reworded, with no sales line or contact formula appended.
8. Plain English register, no bold, no emoji, no imperative or checklist headings (the renamed §9 heading is a noun phrase).

## Tests verdict

OK. tests.patch touches only src/lib/__tests__/columns-en-family-016.test.ts.
- Re-anchors: lastmod (3 places), §9 heading, exact deadline paragraph (June 25, 2026; three months; six months all still locked), exact ending, required phrases per section, checklist starts and details, source-caution paragraph.
- FAQ test restructured honestly: the body no longer repeats FAQ answers verbatim (intentional dedup), so the test now pins each assigned H2's new first paragraph, asserts the key facts inside the sections (one-third illustration with all assumptions; not every asset / not necessarily half; no unrestricted authority), and asserts each FAQ answer appears exactly once in the file. The one-third count (2) is kept.
- Frozen values: word count 3_696 -> 3_600, SHA-256 40185cb7… -> 485e9bd4… (verified equal to orig.md and draft.md respectively), calculatedMinutes 19 -> 18 with read_time pinned to "19 min read" and an explanatory comment.
- No .skip/.only; no other column's test touched; vitest 79 files / 1029 tests passed in the origin/main worktree.
- Note: the local checkout /Users/son7/Projects/tseng-law has this test at a different revision (word count 3_694, SHA 3b700e5f…). The patch base matches origin/main a0039a0d3 (old SHA = orig.md hash), which is the worktree the harness used, so this is not a defect of the patch.

## Tiny edits applied

None. draft.md is unchanged (SHA 485e9bd4…6ab); guard.txt remains valid.

## Original issues (not blocking)

- read_time: at 200 wpm the rewritten body computes to 18 minutes while the front matter keeps "19 min read" (permitted by the brief; the test pins both and documents it). Changing read_time to "18 min read" would restore the test's read_time === calculated invariant but would require re-freezing the SHA; left for a follow-up.
- Internal tension carried over from the original: §4 says to track each procedure "on a separate schedule", §9 says to track them "together on a single schedule". Both sentences are preserved as written.
- Not re-verified against the network (same as the rewriter): the Tax Portal "updated on June 25, 2026" date and the three-month / six-month general periods; they are unchanged from the published text.
- Guard lint notes inherited from the original: no contact email line, Related Services follows the Official Sources section, no source-check date in the sources section.
