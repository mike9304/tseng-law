# EN 914–917 independent locale review — R1

Verdict: REQUEST_CHANGES. Review date: 2026-10-25.

Reviewer: `/root/review_en_case_trends`, independent AI US-English editorial role. I did not author or edit these manuscripts. This report is an editorial review, not a claim of human native-speaker review, attorney review or publication.

## Reviewed versions

All paths below are relative to `/Users/son7/tseng-case-trends-20261025/repo/`.

| ID | Article path | Frozen SHA-256 | Verdict |
|---|---|---|---|
| 914 | `src/content/columns-en/914-taiwan-us-executive-share-bonus-payment-promise.md` | `9dfa500e01d12114412e6cefa1c50d602e4622a3d7a2187fcfeaaf1e1870433e` | REQUEST_CHANGES — remove editorial scaffolding |
| 915 | `src/content/columns-en/915-taiwan-public-contract-mediation-arbitration-same-claim.md` | `a3827e6fff15839c1cd70fc8f490eea66a22d10c3989169545c4ca32f6188be7` | REQUEST_CHANGES — narrow incomplete statutory enumeration |
| 916 | `src/content/columns-en/916-taiwan-parent-company-pollution-liability-us-investor.md` | `bfc294cfac5cf3b1ef5d8fb26491d9abce428e1fe751f7b805f6c1aab698ef5b` | REQUEST_CHANGES — remove editorial scaffolding |
| 917 | `src/content/columns-en/917-taiwan-film-license-corporate-party-us-declaration.md` | `17edfa94317c06cde457c65d722edb16cc9f5e33077b2190c0cde93a58ca798c` | REQUEST_CHANGES — entity antecedent and official agency name |

Initial manuscript snapshots and actual CLI output are retained under `cases-en-locale-evidence/`. The author subsequently confirmed these exact hashes as the frozen drafts.

## Required narrow repairs

| File:line | Exact sentence or smallest relevant span | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| 914:30 | “For businesses planning overseas appointments, this remains a concrete contracting issue.” / “It provides a current setting for cross-border compensation planning; it does not establish that disputes over executive bonuses are increasing.” | These sentences explain the editor's reason for choosing a topic, rather than adding a fact or a reader decision. The USTR investment-plan sentence between them supplies the dated market context. No statement in the remaining paragraph claims an increase in disputes. | Delete these two sentences; retain the linked USTR sentence and its January memorandum reference. | Yes. No legal rule, qualifier on an asserted legal proposition, date or source is removed. |
| 915:45 | “which addresses an arbitration agreement that was not concluded, was invalid or had ceased to be effective” | The paraphrase leaves out the statutory case of an agreement not yet effective and the end-of-hearing reference in the current Chinese Article 40(1)(2). The source case only needs the absence-of-agreement ground. Current MOJ Article 40 was directly reopened; the independent final reviewer agrees with this finding. | “The court identified the absence of an arbitration agreement under [Arbitration Act Article 40(1)(2)](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=I0020001) as the ground for annulment.” | Explicit substantive accuracy repair: narrows the provision summary to the verified case ground. The case's result is unchanged. Final legal reviewer must verify the repaired sentence. |
| 916:54 | “That policy context makes transaction preparation timely.” / “It does not establish an increase in environmental claims or remove ordinary diligence from an investment decision.” | These are metacommentary about the article's relevance and an unprompted rebuttal. The preceding sourced sentence accurately states the investment intentions, with applicable-law qualification. The following paragraph already explains the actual transfer decision and record to examine. | Delete these two sentences; retain the USTR investment-intention sentence, including “subject to applicable law.” | Yes. The factual announcement and its express qualification remain; the manuscript nowhere asserts growing claim volumes. |
| 917:40 | “Later availability through a different affiliate's platform did not prove that company's earlier acquisition.” | “That company” can refer to the immediately preceding affiliate. The named offshore company is the legally material subject. Judgment reason IV(2)(3), retained source line 57, distinguishes it from the later platform operator. | “Later availability through a different affiliate's platform did not prove that the offshore company had acquired the rights earlier.” | Yes. Resolves the pronoun to the entity identified in the source and preceding sentence. |
| 917:54 | “Taiwan's Creative Content Agency” | The agency's official English name is Taiwan Creative Content Agency. The directly opened official announcement identifies that name in its footer. | “The Taiwan Creative Content Agency” | Yes. Proper-name correction only. |

No other rewrite is requested. Keep the article-specific holdings, monetary units, dispositions, uncertainty and source links. These five locations were sent together to the author for one bounded repair pass. The 915 finding was also sent to the independent final legal reviewer as a substantive correction.

## First two paragraphs: actual deletion test

The test below considered each sentence in order, rather than treating the presence of an opening as sufficient.

| Article | Paragraph 1 | Paragraph 2 | Decision |
|---|---|---|---|
| 914 | “The executive established…” gives the direct debtor finding; “His damages claim still failed” supplies the contrasting outcome. The linked judgment sentence identifies the particular decision and the missing compensable-loss inquiry. Removing the whole paragraph loses the reason to separate contractual responsibility from damages. | The dated sentence identifies a Canadian executive, a US subsidiary role and a Taiwan employer. The next identifies BVI shares. The final sentence makes the three corporate/jurisdictional roles legible for an HR or in-house reader. | Retain. The deletable editorial scaffolding occurs in paragraph 3, addressed above. |
| 915 | The first sentence supplies the NT$44,417,150 award and its loss in court. The second supplies the concrete time-to-money change. The third attributes the controlling gap to an identified Supreme Court explanation. | The first sentence establishes the 2017 Supreme Court appeal dismissal. “The annulment stood” distinguishes the maintained lower-court disposition from a fresh award. The finality sentence records the express source statement. The last sentence defines the absence of actual or statutory agreement for the money dispute. | Retain. These are legal and procedural facts, not generic scope announcements. |
| 916 | The opening identifies the diligence investigations as evidence, then connects knowledge, control, response and depleted assets. The linked final sentence draws the article's bounded practical implication from the identified decision. | The first sentence supplies the 2018 date, workers' chemical exposure and electronics factory setting. The second expressly prevents an ownership-alone liability inference. | Retain. Deleting the second paragraph would remove the actual exposure context and a necessary limitation. |
| 917 | The question identifies three potentially different corporate actors. The linked sentence answers the specific evidentiary problem: later platform access did not prove the offshore entity's earlier license. | The date/remand sentence locates the proceeding. The next explains the assigned damages setoff against a loan. The last connects that procedural posture to the rights/loss analysis. | Retain. The second paragraph prevents readers from mistaking the case for an infringement or foreign-judgment recognition action. |

Opening distribution is varied: 914 a split litigation outcome; 915 a monetary award; 916 an investigation becoming evidence; 917 a concrete reader question. No invented scenario, “Suppose” formula or first-person client experience appears.

## Three recent same-locale comparators

All three were read from the current task repository. Publication date is 2026-10-24 for each; exact hashes, openings, headings and ending excerpts are saved in `cases-en-locale-evidence/comparators.json`. No comparator was unavailable.

| Comparator | Concrete observed structure | Comparison with 914–917 |
|---|---|---|
| `src/content/columns-en/704-taiwan-arc-first-application.md` | Opens with the 30-day ARC filing period and the next-day counting rule. Headings follow filing date, documents, application channel and collection. Ends on work permission and subsequent filings. | 914 does not copy that procedural checklist: it follows debtor identity, failed loss evidence and a separate departure clause. 915 uses a table only to trace actual changes to the claim, not to imitate a filing guide. |
| `src/content/columns-en/705-taiwan-visa-residence-work-study-family.md` | Opens with the different consequences of visa-exempt entry for professionals and students. Body separates legal residence categories. Final substantive paragraph directs the reader to the filing/change guide after settling eligibility. | 916 follows one historical evidentiary sequence and split disposition; it does not turn investor types into generic parallel categories. 917 follows the signed deal, admission, corporate identity and proof of loss. |
| `src/content/columns-en/706-taiwan-arc-renewal-changes-reentry.md` | Opens with a practical expiry-versus-loss-of-basis question. Headings are tied to changes, renewal, passports and travel. Ending returns to documents covering the proposed return date. | 917 shares a question opening, but its question identifies different actors in a transaction; it does not echo the ARC wording or chronology. All four new substantive endings return to their own records: award and notice evidence, mediation sequence, pollution response and transfers, or a title-to-licensee trail. |

The short checked-date/source sections are common packaging, not repeated substantive conclusions. Requested removals in 914 and 916 prevent two market-context paragraphs from repeating the same “this context makes the topic timely / does not prove a trend” editorial formula.

## Source fit and legal-language checks

I read `work/research/en-research.md`, the source ledger and the retained official text for the operative passages. Relevant capture files read include `en_more_officialopened.txt`, `en-stock-final-reasons.txt`, `en-procurement-original-open.txt`, `en_open_newcases.txt` and `en_case_finalread.txt`. These are source retrieval records from this run, not a representation that I downloaded the underlying litigation files.

- 914: Employer's direct bonus obligation is separate from the failed loss/causation case. The article does not make Article 268 a successful claim, turn “issued” into an unsupported quote, misidentify the Canadian executive as American, convert contractual cure periods into statutes, or advise on current BVI corporate law. Subsequent finality is expressly unestablished.
- 915: NT$44,417,150, time/money sequence, final dismissal of the contractor's appeal, and preservation of the annulment match the official explanation. The text does not say every changed number defeats arbitration, every procurement contract qualifies, or that the Supreme Court accepted all lower-court reasoning. The present construction/technical-services scope is kept separate from the historical hospital facts. Only the Article 40 paraphrase needs the narrow repair above.
- 916: 246 remanded and 262 dismissed-appeal portions remain distinct. The manuscript does not portray remand as denial, call the whole litigation final, import universal US veil-piercing rules, or describe Article 154 as the sole retroactive basis. Current Article 154's cumulative conditions remain present. The omitted party names do not change the reasoning.
- 917: Loan action and assigned setoffs are stated at the start. US$21,200 is the post-setoff principal, not an award of copyright damages to the former manager. The US judgment is treated as evidence about an admission, not automatic recognition, refusal of recognition or a Taiwan infringement holding. Article 222 requires proved damage before estimation. Article 279 preserves the exceptions and opposing-party-consent alternative.

Direct current web checks on 2026-10-25 succeeded for Civil Code 216 and 231; Code of Civil Procedure 222 and 279; Government Procurement Act 85-1; Company Act 154; Arbitration Act 40; the USTR February announcement; ITA's September 30 energy report; and TAICCA's September 22 announcement. The Civil Code site's pending-provision warning concerns Articles 166-1 and 1223, not the provisions used here. The market statements accurately remain announcements/planned events; no trend volume, US event attendance, enacted tariff treatment or guaranteed contract opportunity is claimed.

The court explanation URLs for 915 and 916 timed out when reopened independently. Their official retrieved text from this same run was available and read. This is disclosed as an access limit, not hidden as a successful fresh retrieval. This locale report does not replace the independent final law review or establish later procedural history for 914/917.

The inquiry paragraphs fit the verified Taiwan employment, contract, corporate and IP/civil-dispute services. They ask for a brief problem/entity/deadline and arrange confidential delivery separately. No foreign licensure, case representation, named client or victory is invented. Public AI/human bylines are absent; internal `legal-ai-assistant` is retained.

## Metadata, images and section 5 variety self-check

| ID | Summary chars | Title plus suffix chars | Separate SEO title chars | CV | Short-sentence ratio | CLI result |
|---|---:|---:|---:|---:|---:|---|
| 914 | 155 | 66 | 35 | 0.492 | 0.208 | exit 0; FAIL 0 |
| 915 | 159 | 74 | 34 | 0.492 | 0.179 | exit 0; FAIL 0 |
| 916 | 156 | 71 | 37 | 0.486 | 0.163 | exit 0; FAIL 0 |
| 917 | 158 | 72 | 32 | 0.463 | 0.234 | exit 0; FAIL 0 |

Command actually executed for each file: `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute article path> --lang en`. Logs and hashes are in `cases-en-locale-evidence/*-initial-variety.txt` and `initial-checks.json`.

Section 5 manual check: varied nonformulaic openings; at least two short sentences each; no three-paragraph claim/citation/caveat loop; paragraphs without citations contain practical evidence handling rather than unsupported new law; contrasts remain tied to an actual potential confusion; concrete endings; no bold markup, invented experience or imperative checklist headings. All four have a relevant body question. Repeated paragraph openings stay within the tool's length-adjusted rule. Numerical/legal integrity was checked against the source boundaries above.

All four linked WebP files exist and were opened with `view_image`, not inferred from their filenames. 914 shows laptop, blank certificate and binders overlooking Taipei; 915 shows hard hat, plans, binders and bridge model; 916 shows a soil jar/notebook outside a generic factory; 917 shows a reel, binder, folder and projector. Alt text matches each image. “Fictional scene” is retained. There are no recognizable case parties, readable legal documents, logos or flags. No public author label appears in alt text. The actual image hashes are recorded in `initial-checks.json`.

All present internal English column links resolve to source files in this checkout. FAQ entries agree with the body and number 2–3 per article. Publication dates, audience, internal author, categories, topic and localized reading time are present. The summaries and conditional SEO titles satisfy the stated lengths.

## Bounded next step and unresolved issues

Author to apply only the five locations above, then send fresh hashes and real CLI output. Reviewer will reread the changed paragraphs and affected conclusions and bind the final verdict to the resulting files. This is the first repair pass. No publication or deployment was performed by this reviewer.
