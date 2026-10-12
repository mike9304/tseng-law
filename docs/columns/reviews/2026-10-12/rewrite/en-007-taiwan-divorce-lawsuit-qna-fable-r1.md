# FINAL REVIEW r1 — en-007-taiwan-divorce-lawsuit-qna (Claude Fable 5.1, 2026-10-12)

## Verdict

PASS. The rewrite preserves every legal statement, qualifier, number, article reference, judgment citation, link, source entry, disclaimer and signature of the published original, adds no new fact, and reads as plain native English. Guard PASS, variety check OK (no FAIL), tests.patch acceptable. No edits made to draft.md.

## Scope checked

- orig.md vs draft.md, full text, claim by claim (intro, sections 1–12, front matter, FAQ, disclaimer, signature).
- guard.txt and a fresh re-run of guard.py (`--today 2026-10-12`): GUARD: PASS, length 3282 → 2988 words (91%), only pre-existing lint note (no contact email line, same as original).
- `variety_metrics.py check draft.md --lang en`: sentences=135 mean=18.9 cv=0.525 short=0.126 run3=0.053 opener_rep=0.104 cite_end=0.007 contrast=0 caveat=0 q=3 — "OK — no variety limit violated".
- Front matter diff: only `lastmod` (2026-10-06 → 2026-10-12) and `read_time` (14 → 13 min read) differ. Title, seoTitle, url, date_display, categories, featured_image, summary, all four FAQ q/a: byte-identical. H1 and image line unchanged.
- tests.patch (772 lines, one file: `src/lib/__tests__/columns-en-family-007.test.ts`), tests.txt, claude-tests1.log, vitest-1.log (84 files / 1108 tests passed).
- SENTENCE-VARIETY-RULE.md §5–6, COLUMN-VOICE-RULE.md, LESSONS.md (skimmed).
- Bold / `<strong>` / emoji grep on draft: none.

## Claim-by-claim fact table

Format: original point → location in rewrite → status.

### Intro
- Divorce raises distinct issues: method of ending marriage, household registration, effect abroad, matrimonial property, damages, post-divorce spousal support, minor-child decisions, child support → intro P1 → preserved (same eight items).
- Same facts may be evidence for several claims; each right has different elements/effects, matters to be proved, time limits → intro P1 → preserved ("proof requirements" = "matters to be proved").
- Particularly important for multi-country families (Korea/Taiwan); procedure not determined by one spouse's nationality or a marriage-registration record alone → intro P2 → preserved.
- Confirm center of life, existing proceedings/registrations, where documents executed, where children reside, where assets located; reduces duplicative proceedings and enforcement gaps → intro P2 → preserved.

### Section 1 (Three Routes to Divorce)
- Three legally distinct paths → first line → preserved.
- Mutual consent: private status act; effective only when Art. 1050 writing + witness + registration all satisfied → P2 → preserved. "Signed agreement without registration does not complete this path" → moved to Section 2 ("Does a signed agreement end the marriage? Not without registration.") → preserved (deduplicated, not lost).
- Mediation/settlement ends marriage when established; instrument is basis for household registration → P3 → preserved; "in the manner prescribed by law" moved here from Section 3 → preserved.
- Judicial divorce: by judgment on statutory ground, Art. 1052; status depends on finality under applicable procedure, not informal agreement → P4 → preserved ("Civil Code" prefix dropped here; the full "Civil Code Article 1052" appears in Section 4 and the FAQ).
- Five cross-border questions (jurisdiction/authority; applicable law for divorce, property, children; recognition/effect of foreign divorce, judgment, status act; Taiwan registration step + authenticated documents; further registration/recognition/enforcement step elsewhere) → list 1–5, rephrased as questions → all five preserved, same order and content.

### Section 2 (Mutual-Consent Divorce and Household Registration)
- Art. 1050 three requirements: writing; ≥2 witnesses signing after becoming aware of and confirming genuine intent, mere name-adding insufficient; registration constitutive, private writing alone does not complete the divorce → P1–P2 (list turned to prose) → preserved, all qualifiers intact.
- Who may apply / agent filing / required documents: per MOI divorce-registration guidance in force at time of filing, confirmed with competent household-registration office → P3 → preserved.
- Document prepared outside Taiwan may require authentication by Taiwan overseas mission or other competent authority, depending on type and place → P3 → preserved.
- Authenticated/notarized Chinese translation if official guidance so requires → P3 → preserved.
- Link: taiwanese-spouse-divorce-agreement-registration (release clauses, filing through representative) → P3 → preserved, same label and URL.
- Court result: after final judgment or mediation/settlement, either party may "in principle" apply; governed by Household Registration Act, not Art. 1050 sequence → "Registering a court result" P1 → preserved including "in principle".
- Art. 48: general application period thirty days from finality of judgment or establishment of mediation/settlement; service/receipt date not the common trigger in every case → P2 → preserved (period, both starting points, caveat).
- Late application must still be accepted; lateness does not undo an effective court divorce; after written demand and statutory conditions met, office registers directly under Art. 48-2 → P3 → preserved.
- Online filing only within statutory period → P4 → identical.

### Section 3 (Court Mediation, Personal Appearance, and Appeals)
- Family Act matters ordinarily mediate before adjudication; direct filing may be deemed mediation application; exceptions for method of service / nature of matter; transition rules; no single immutable sequence → P1 → preserved.
- Mediation may cover intent to divorce plus property, children, manner of payment; court may not confirm without modification an agreement detrimental to a minor child → P2 → preserved.
- Established mediation/settlement = same effect as final and binding judgment; litigation may continue if mediation fails; for judgment divorce, finality is what matters → P3 (+ Section 1 P4) → preserved.
- Family Act Art. 13 when court orders personal appearance; CPC Art. 303 mutatis mutandis; first fine up to NTD 30,000; repeated sanctions after further lawful notice; no arrest for compulsory appearance → "Appearing in person" P1 → preserved, all four elements.
- Appearance order ≠ universal rule of face-to-face mediation; remote/separate/representative/safety arrangements only if court so decides under law and circumstances → P2 (question form) → preserved.
- Review/appeal depends on decision type, service, finality, procedural posture; record/ruling/judgment not interchangeable; no single universal appeal deadline → "Review and appeal" → preserved.

### Section 4 (Judicial-Divorce Grounds and the Responsible-Spouse Proviso)
- Art. 1052 ¶1 ten grounds → list 1–10 → byte-identical, including 不治之惡疾, "more than three years", "more than six months".
- ¶2 separate; another serious cause making continuation difficult; proviso: cause attributable to one spouse → only the other may petition → P → preserved.
- Legislative period in CC Judgment 112-Hsien-Pan-4 elapsed; proviso wording remained in statute as of 2026-10-06; held unconstitutional to the extent it completely deprives the solely responsible spouse of any opportunity, without considering whether a considerable period has elapsed or the cause has continued for a considerable period, producing manifestly harsh result; courts must apply reasoning case by case → P → preserved (holding sentence identical).
- Consensual intercourse with a third person: whether it is a ¶1 ground depends on precise facts, statutory requirements, time limits; conduct alone does not dictate judicial divorce, Art. 1056 damages, residual-property distribution, Art. 1057 support, parental rights/duties, child support → P (question form) → preserved, all six outcomes listed.
- Missing spouse: police report may be evidence, not mandatory prerequisite; no universal requirement to sue for cohabitation first before alleging malicious desertion or other serious cause; several months away without more establishes no ground; court examines reason for departure, justified reason to live separately, contact and support, continuity, other facts → "Missing or absent spouses" → preserved ("continuity" rendered as "whether the separation was continuous", consistent with ground 5 "in a continuing state"; see non-blocking note).

### Section 5 (Foreign Marriages and Divorces in Taiwan Records)
- No single universal route; four separate questions (completed abroad? recognition/effect sought? Taiwan registration required? further procedure elsewhere?) → P1 → preserved ("Four questions" is a count of the original's own list, not a new fact).
- Recognition/effect determination and registration vary with judgment vs administrative certificate, country/form, parties' registration status → P1 → preserved.
- Mainland China / Hong Kong / Macao verification regimes differ → P2 → identical.
- Links: us-divorce-decree-recognition-taiwan; taiwanese-spouse-divorce-from-abroad → P3 → preserved, same labels and URLs.

### Section 6 (House Title, Residual Property, Damages, and Support)
- Title and purchase funds are evidence; ownership/gift/nominee/loan/unjust-enrichment claims distinct from Art. 1030-1 residual-property distribution → P → preserved.
- Art. 1030-1 claim, Art. 1056 damages, Art. 1057 hardship support for spouse without fault, child support: different elements, calculations, time limits → P → preserved.
- Link taiwan-divorce-property-damages-support → P → preserved (label capitalised to start the sentence; URL identical).

### Section 7 (Minor Children, Parental Rights, and the Best-Interests Standard)
- Precise concept = exercise and assumption of rights and duties; may include residence, day-to-day care, education/medical decisions, property management, legal representation; "parental rights"/"custody" shorthand only → P1 → preserved.
- Art. 1055: parents may agree; no agreement → court may decide; agreement adverse to child → court may modify or make necessary decision; later review on changed circumstances; signed agreement does not bar best-interests review; agreed change not always a mere registration form → P2 → preserved ("Civil Code" prefix dropped; article number intact; see non-blocking note).
- Art. 1055-1 factors (age/sex/health; number of children; views and personality-development needs; each parent's age/occupation/conduct/health/means/living circumstances; willingness and attitude; emotional relationship incl. co-residents; interference with other parent's relationship; traditional customs, culture, values of each ethnic group) → bullet list → all eight preserved verbatim.
- Court may hear child's views as prescribed by law; may consider investigations/opinions of competent authorities or child-welfare professionals → closing P → preserved.
- Higher income or fault only one fact among many; neither a sole criterion nor basis for reward/punishment → closing P → preserved.
- Link us-parent-child-taken-to-taiwan-custody ("when the other parent keeps your child in Taiwan") → closing P → preserved.
- Divorce may be dissolved first with property/child issues open; not a shortcut for every case; property preservation, child's residence/care/medical/education, support and contact agreements/orders, interim orders for safety and continuity considered together → "Divorce while other issues remain open" → preserved.

### Section 8 (Child Support, Contact, Enforcement, and Interim Protection)
- Art. 1116-2 duty continues after divorce; parent–child obligation; distinct from Art. 1057 support for a qualifying former spouse → P1 → preserved.
- Allocation from evidence of child's living/education/medical/special needs and each parent's income/assets/ability/actual caregiving share → P1 → preserved.
- Unperformed part of final support ruling or in-court settlement may be changed on application if circumstances changed and leaving it as is has become clearly unfair (Family Act Art. 102 ¶1, Art. 107 ¶2) → P2 → preserved, citation identical.
- Link taiwan-child-support-enforcement-cross-border → P2 → preserved.
- Obstructed contact: response depends on existing agreement/order and facts; may seek determination, change, enforcement, interim measure; Family Act Art. 194 enforcement methods selected under child's best interests; direct or indirect compulsion as law/facts allow → "Contact, visitation, and enforcement" P1 → preserved.
- No automatic right to handover, force, change of rights/duties, punishment merely because contact blocked; support and contact not to be withheld or traded in retaliation; handle each independently → P2 → preserved.
- Link us-parent-child-taken-to-taiwan-custody (provisional orders incl. exit ban) → P2 → preserved; label now "what a Taiwan family court can do" (the label of the original's third pointer), URL identical.

### Section 9 (Cross-Border Relocation with a Child)
- Not decided by Korean living costs, single nationality, or treaty label alone; separate questions answered on facts and law of every relevant jurisdiction → P1 → preserved.
- Three questions (authority over residence/travel/daily care; consent or court determination before relocation or retention abroad; passport, entry/exit, immigration status, family-status registration in Taiwan and destination) → list 1–3 → preserved; the original's short topic labels before each question were dropped, the questions themselves are intact.
- 1980 Hague Child Abduction Convention does not automatically govern Taiwan → P → identical.
- Removal/retention contrary to agreement or order not recommended; confirm lawful consent or court decision first; identify urgent protective measures → P → preserved.
- Link taiwanese-spouse-divorce-cross-border-parenting → P → preserved. The original's third pointer to us-parent-child-taken-to-taiwan-custody here was removed; that URL is still linked twice (Sections 7 and 8) → repetition cut, no legal point lost.

### Section 10 (Documents, Evidence, and Deadlines)
- Item 1 identity/status/addresses → P1 first sentence → preserved.
- Item 2 divorce instruments and court papers (agreement; witness-intent documentation; court papers; service records; mediation/settlement records; judgments; finality proof) → P1 second sentence → preserved.
- Item 3 foreign records: authentication; Chinese translation certified/notarized; recognition/effect/registration status → P2 → preserved.
- Item 4 neutral timeline; preserve lawfully obtained communications, medical and police records in original state → P3 → preserved.
- Item 5 each child's situation (age, health, education, residence, caregiving history/current, views by developmental stage, relationship with each parent, safety/stability, best-interests perspective) → P4 first sentence → preserved.
- Item 6 support/contact/relocation materials → P4 second sentence → preserved.
- Item 7 deadlines tied to precise triggering events; rendered/served/final; mediation or settlement reached; awareness by right-holder; termination of matrimonial property regime are different dates → P5 → preserved.
- Item 8 limited disclosure; privacy plan (access permissions, transmission, disposal of copies) → P6 → preserved.
- Prohibition on unlawful surveillance, account intrusion, device intrusion, location tracking, unlawful recordings, disclosure of child's private information → last P → preserved.

### Sections 11–12, tail
- "Checked on 2026-07-25" + reconfirm caveat → preserved (two sentences merged with "so").
- Ten official sources → identical labels and URLs, same order.
- Related Guidance three internal links → identical; heading demoted from H2 to H3 under Official Sources (rewriter cites lint rule that the last H2 must be the sources section; tests.patch accounts for it).
- Disclaimer (educational material; general overview of divorce, cross-border family, matrimonial property, minor children; not legal advice) → preserved as two sentences.
- Signature "Wei Tseng (曾雋崴), Taiwan Attorney" → identical.

Nothing added: no new facts, examples, numbers, cases, first-person material, promises or sales lines. The three in-body questions are each answered only with the original's own statements.

## Blocking issues

None.

## MONOTONY

No items. Rule §5 self-check:
1. variety tool: OK, no FAIL.
2. Opener is a factual statement; no "Suppose/hypothetical" formula.
3. Very short sentences present ("Not without registration." "That is the precise concept." "Informal agreement alone does not do it."); long sentences are followed by short ones.
4. Paragraph openers: "The" opens three paragraphs (Ministry, 1980 Hague, following sources) across ~50 paragraphs; within the tool's long-article allowance, no other word opens more than two.
5. No run of three "claim (article) → caveat" paragraphs; several citation-free paragraphs (intro P2, review and appeal, missing spouses, evidence paragraphs).
6. Contrast templates: 0 by tool; no rebuttal of a claim the reader did not make (the "living costs / nationality / treaty label" line is the original's).
7. Last body paragraph ends on this column's own content (evidence prohibitions); disclaimer is reworded and short, no sales line, no copied stock closing.
8. Plain English register throughout; no bold, no emoji, no invented first person, no imperative or checklist headings.
9. No article number, period, amount, link or label lost (table above).

## Tests verdict

ACCEPTABLE. tests.patch touches only `columns-en-family-007.test.ts`. It re-anchors lastmod, read_time, the eleven H2 headings (numbers removed), the Related Guidance H3, exact paragraphs, the five cross-border questions, the Article 1050 prose, the three mediation paragraphs, the 1055-1 intro/bullets/closing, the two child-support paragraphs, the three relocation questions, the eight evidence categories (six prose paragraphs plus eight ordered anchors), the eight inline column links, the disclaimer, the 24 legacy-topic propositions, and recomputed section/source digests and word count. Every assertion on a legal fact, number, citation or link still locks it under the new wording (NTD 30,000; thirty days; Art. 48-2; Art. 102 ¶1 / 107 ¶2; Art. 194; Hague sentence; all ten grounds; the 112-Hsien-Pan-4 holding; all URLs). No `.skip`, `.only` or `.todo`. Column 275 constants and assertions untouched. The removed ninth inline-link assertion corresponds to the deliberately removed duplicate custody pointer. vitest: 84 files / 1108 tests passed.

One assertion was loosened, not removed: read time was previously required to equal `round(words/230)` by the test's own counter (which counts headings, sources and links); it is now pinned to exactly "13 min read" and additionally required to be within one minute of that count. The tests author flagged this openly. Read time is display metadata, not a legal fact, and the guard's body-only count (2988 words) gives 13 exactly, so this is not blocking. See "Original issues" for the recommendation.

## Tiny edits applied

None. (Any edit to draft.md would invalidate the sha256 digests in tests.patch; nothing in the text warranted it.)

## Original issues (not blocking)

- Status date mismatch (pre-existing): body says the Art. 1052 ¶2 proviso wording "was still in the statute as of 2026-10-06" while the sources were "checked on 2026-07-25". Both dates are carried over unchanged. Someone should reconfirm the statute text on the next content check and align the two dates.
- No contact email line (pre-existing house format; lint tolerates it in the original too).
- Read time: the repo test's counter gives 3,148 words → 13.7 → 14 by its former rounding rule; the guard's body-only count gives 2,988 → 13. The lane should decide which counter is authoritative for en read_time; if it is the test counter, set read_time to "14 min read" and restore the exact rounding assertion in a later round (requires regenerating the digests in tests.patch).
- Rewrite dropped the "Civil Code" prefix before Article 1055 and Article 1055-1 in Section 7 (original: "Under Civil Code Article 1055", "Under Civil Code Article 1055-1"). The code is named for Articles 1050, 1052, 1030-1 and 1116-2 in the body and for 1055/1055-1 in the FAQ, so attribution is recoverable; not changed because tests.patch pins the exact sentence.
- "continuity" (original, missing-spouse paragraph) is rendered "whether the separation was continuous". This matches ground 5 ("malicious desertion ... in a continuing state") and is the natural reading; noted only because it is slightly more specific than the original word.
