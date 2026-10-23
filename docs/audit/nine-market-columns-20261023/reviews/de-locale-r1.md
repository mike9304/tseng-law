# Independent German locale review — DE679–683, r1

Review date: 2026-10-23. Reviewer role: independent AI German-language editorial reviewer, separate from the author. I authored none of these articles and changed no manuscript. This report does not claim human native-speaker review, attorney review, complete legal verification, successful rendering or publication.

Scope: all visible prose, titles, summaries and three FAQs of each of the five frozen German manuscripts. Read BRIEF.md, the editorial skill and review criteria, repo AGENTS.md, EDITORIAL-VOICE.md, FRONTMATTER.md, the shared SENTENCE-VARIETY-RULE.md and LESSONS.md, de-author.md and the Germany/current-law sections of research-europe.md. Read the current German consultation-language copy in src/data/international-inquiry-copy.ts. Official legal spot checks are recorded below. File paths in the tables are relative to repo/src/content/columns-de/.

## Verdicts and reviewed versions

PASS below is a locale-review verdict. It does not mean the unsupported shared CLI achieved zero FAILs or replace the separate final legal review. The required CLI limitation remains open for integration to disclose.

| File | Verdict | SHA-256 of reviewed bytes | Rationale |
|---|---|---|---|
| 679-taiwan-maschinenlieferung-fat-sat-schlusszahlung.md | PASS | a40a45bc70cdd18c1e447f5e8717c2d20b94cc09b98406a93ef021ecceebc3c3 | Precise contract/milestone issue, readable professional German, useful test and payment evidence; one optional terminology refinement. |
| 680-taiwan-bauteile-maengelruege-pruefmuster.md | PASS | d2bdc27e7417193dee9b69f52b1ef4549a980e928dcb93785d0a6e2fbdb2a320 | Notice, proof and remedy are distinct; six-month/five-year qualifications are retained. Optional clarification of Article 354 recommended below. |
| 681-taiwan-lieferant-werkzeuge-pruefvorrichtungen-herausgabe.md | PASS | 87333454f3d491ead7a68eb0ec7b181ffa553c937b29d2050ac842ef5fd4a10c | Ownership, possession, retention and physical handover stay distinct. No material locale defect found. |
| 682-taiwan-gemeinsame-entwicklung-cad-geschaeftsgeheimnisse.md | REQUEST_CHANGES | e7b4290b5181f6d3ce8a0c57e25357b67f245bf4c6990aaedf69a69e90629314 | One required correction: practical documentation advice must not read as a separate statutory duty. Also remove an avoidable subject/number ambiguity in the preceding sentence. |
| 683-deutsches-urteil-vermoegen-taiwan-vollstreckung.md | PASS | 3509f18922681de9e528d521a4c5cd0ef2e04e53566bd27b6cf8b2e5d26e15bb | Recognition, enforcement permission, assets and interim relief are separated. One optional clarification of who coordinates document requirements. |

## Required repair

| ID / File:line | Exact sentence | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| M1 / 682-taiwan-gemeinsame-entwicklung-cad-geschaeftsgeheimnisse.md:26 | “Beide müssen festhalten, welche Informationen sie einbringen und wer welche neuen Ergebnisse nutzen darf.” | This follows a paragraph explicitly explaining statutory requirements. An unqualified müssen makes the next sentence sound like another legal documentation obligation. The author's report describes it as practical agreement advice. The current Trade Secrets Act Articles 4 and 5 expressly provide default allocations when no agreement exists; the source does not establish the separate recording duty expressed here. | “Für ihre Zusammenarbeit sollten beide in der Vereinbarung festhalten, welche Informationen sie einbringen und wer welche neuen Ergebnisse nutzen darf.” | Preserves the author's stated practical recommendation and all information categories. It deliberately corrects the apparent mandatory legal force; this is a modality clarification, not a claim that the literal meaning is unchanged. [Official Articles 4–5](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080028). |

Bounded repair: change this sentence only, optionally together with S2 below, then return the revised paragraph and current hash for recheck. No new legal analysis or article expansion is needed.

## Optional, nonblocking refinements

| ID / File:line | Exact sentence | Reason | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| S1 / 679-taiwan-maschinenlieferung-fat-sat-schlusszahlung.md:24 | “Ein unterschriebener Factory Acceptance Test (FAT) belegt zunächst die Prüfung, die das Protokoll tatsächlich beschreibt.” | A protocol is signed; calling the test itself unterschrieben is understandable metonymy but less precise in machinery-contract German. | “Ein unterschriebenes Protokoll des Factory Acceptance Tests (FAT) belegt zunächst die darin dokumentierte Prüfung.” | Yes. The scope remains the documented test, with no automatic payment trigger added. |
| S2 / 682-taiwan-gemeinsame-entwicklung-cad-geschaeftsgeheimnisse.md:26 | “Bei einer gemeinsamen Maschinen- oder Komponentenentwicklung betrifft das deutsche Konstruktionsunternehmen und den taiwanesischen Entwicklungspartner gleichermaßen.” | This can be parsed grammatically with das as the demonstrative subject and deutsche Konstruktionsunternehmen as a bare plural object. It is therefore not an established missing-subject error. However, the immediately competing singular-article reading and German plural/Taiwan singular pair slow comprehension. | “Bei einer gemeinsamen Maschinen- oder Komponentenentwicklung gelten diese Anforderungen für das deutsche Konstruktionsunternehmen und den taiwanesischen Entwicklungspartner gleichermaßen.” | Yes. The joint legal conditions remain applicable to both parties. The singular pair makes the reader perspective consistent. |
| S3 / 680-taiwan-bauteile-maengelruege-pruefmuster.md:40 | “Die gesetzliche Gewährleistung bezieht sich auf den Zustand bei Gefahrübergang: auf Mängel des Werts, der gewöhnlichen oder vereinbarten Brauchbarkeit sowie fehlende zugesicherte Eigenschaften. Unerhebliche Minderungen fallen nicht unter den dortigen Mangelbegriff.” | The shorthand Minderungen can be read correctly as referring to value/usability, but the immediately preceding combined list makes the extent of the exception less explicit than the two statutory paragraphs. The current Chinese Article 354 places the negligible-reduction exception in paragraph 1 and guaranteed qualities in paragraph 2. | “Bei Gefahrübergang muss die Ware frei von Mängeln sein, die ihren Wert oder ihre gewöhnliche beziehungsweise vertraglich vereinbarte Brauchbarkeit aufheben oder mindern; unerhebliche Minderungen bleiben dabei außer Betracht. Außerdem muss sie zu diesem Zeitpunkt die zugesicherten Eigenschaften besitzen.” | Preserves the two statutory propositions and clarifies the exception's referent. Treat as legal precision checked against [Article 354](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354), not merely cosmetic wording. No definite opposite claim in the original was established, so nonblocking at locale review. |
| S4 / 683-deutsches-urteil-vermoegen-taiwan-vollstreckung.md:53 | “Für beglaubigte Ausfertigungen, chinesische Übersetzungen und die erforderliche Bestätigung ausländischer Unterlagen ist anschließend der konkrete Bedarf mit der taiwanesischen Vertretung abzustimmen.” | taiwanesische Vertretung can mean Taiwan's overseas representative office or the legal representative handling the Taiwan proceeding. The preceding bisherige Vertretung suggests counsel, while document authentication suggests a representative office. Identify the intended coordinating party. | If counsel is intended: “Welche beglaubigten Ausfertigungen, chinesischen Übersetzungen und Bestätigungen ausländischer Unterlagen benötigt werden, sollte anschließend mit der Rechtsvertretung für das Verfahren in Taiwan abgestimmt werden.” | Yes, if the intended referent is Taiwan litigation counsel. This does not identify a universal authentication requirement or claim a retained representative already exists. If an official representative office is intended instead, name that role and preserve the recipient-specific requirement. |

## First-two-paragraph deletion test

I read each sentence in the first two body paragraphs and considered removing it, rather than accepting the author's self-check. Sentence starters below identify the actual sentence; line numbers refer to the frozen files.

| Article / paragraph | Sentence-by-sentence information lost on deletion | Decision |
|---|---|---|
| 679:24 | “Ein unterschriebener …”: limits what the test record evidences. “Ob damit …”: makes the agreed payment milestone decisive. “Verlangt der Vertrag …”: retains a separately required SAT and its site conditions. | Keep all three; S1 makes the signed-document subject more precise. No generic setup. |
| 679:26 | “Für einen deutschen …”: identifies payer, amount and trigger as separate facts. “Ein lokaler Integrator …”: distinguishes the operating participant from the buyer. “Auch eine Unterschrift …”: adds signatory-authority uncertainty. | Keep all three. The signature sentence adds a distinct issue beyond party identity. |
| 680:24 | “Darf die Mängelanzeige …?”: supplies the concrete 8D/notice timing decision. “Unter taiwanesischem Kaufrecht …”: gives the conditional statutory response. “Eine interne Sperre …”: distinguishes internal ERP action from notice to the seller. | Keep all three. The question is specific and answered immediately. |
| 680:26 | “Die Regel setzt voraus …”: governs the whole Taiwan-law discussion. “Einkaufsbedingungen …”: points to the documents that resolve it. “Artikel 20 …”: supplies the choice/closest-connection rule. “Weder der deutsche Firmensitz …”: explains why location alone cannot replace that inquiry. | Keep four sentences; the deliberate contrast preserves jurisdictional scope. |
| 681:24 | “Wessen Name steht …?”: sets the ownership/custody/handover mismatch. “Bei einem Produktionswechsel …”: identifies the potentially different companies. “Für die Abholung …”: connects the item, entitlement and actual possessor. | Keep three. No fabricated individual transaction is claimed. |
| 681:26 | “Die deutsche Einkaufsabteilung …”: gives item-specific evidence to collect. “Einsätze, Ersatzformen …”: prevents components disappearing into an umbrella entry. “Eine pauschale Angabe …”: explains which later/subsupplier items a generic description may omit. | Keep three; the third supplies the practical consequence. |
| 682:24 | “Drei Voraussetzungen …”: states all three cumulative legal elements. “Diese Bedingungen gelten gemeinsam.”: reinforces their AND relationship. “Eine Beschriftung …”: explains why a confidentiality label alone does not establish them. | Keep all three. The short AND sentence has legal value despite partial repetition. |
| 682:26 | “Bei einer gemeinsamen …”: connects the abstract conditions with the two development partners; clarify under S2. “Beide müssen …”: adds agreement guidance, but must be repaired under M1. “Der Zugriff …”: separates technical access from permitted purpose. | Keep the subject matter of all three, repair the first two as specified. |
| 683:24 | “Ein rechtskräftiges deutsches …”: explains the remaining barrier despite the existing judgment. “Dafür verlangt …”: gives the separate permission judgment. “Zusätzlich darf …”: retains the cumulative recognition condition. | Keep three. The opening adds procedural consequences beyond the title. |
| 683:26 | “Für einen deutschen Lieferanten …”: separates the German proceeding from Taiwan asset evidence. “Ein Konzernlogo …”: identifies a concrete identity mismatch. “Schuldner und Vermögensinhaber …”: turns that mismatch into the preparation task. | Keep three; no throat-clearing sentence identified. |

## Comparison with three existing German articles

I independently inventoried all 18 older German files' date_display/lastmod fields, and actually read the openings, headings and endings of these three. They are the two latest distinct displayed publication dates plus a tied recent/core comparator. Many files share 13 September 2025 and omit published, so this is not proof of a unique live latest-three order. Current public chronological order was not verified.

| Comparator path under src/content/columns-de/ | Observed date | Concrete comparison |
|---|---|---|
| 018-taiwan-semiconductor-market-entry.md | date_display 17 September 2026; lastmod 7 October 2026 | Opens “Sobald Geschäfte …” with operating requirements and a company-formation question; long numbered organization headings and a standalone consultation section. DE679–683 instead begin at test evidence, defect notice, actual custody, cumulative secret conditions or a final judgment. They do not repeat its entry-planning scaffold. Their use of 018 as a relevant entity-identification link is justified. |
| 011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md | date_display 4 February 2026; lastmod 25 July 2026 | A long multi-duty opening and “Im Folgenden …” preview, followed by numbered regulatory sections and a six-item imperative closing sequence. New drafts avoid this roadmap and instead end on one article-specific evidentiary question. The new drafts' shorter paragraphs and limited lists improve pacing. |
| 017-taiwan-logistics-business-setup.md | date_display 13 September 2025; lastmod 7 October 2026 | Opens with “Wenn Sie …” and “Dieser Beitrag unterscheidet …”; numbered regulatory categories, links and a generic educational disclaimer close the article. New 681 deals with an existing tool-release dispute rather than starting a logistics business; its transition link is supplementary, not duplicate coverage. |

Named attorney footers are present in the source of 011 and 017. They are not copied into the new drafts. I did not inspect their rendered stripping behavior or edit those older files, which are outside my ownership.

## Sentence-variety section 5 independent assessment

Required command was actually executed against all five files: `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <file>`. The tool detects these as ko, because German is unsupported. It returned exit 1. These are real outputs, not German validation results; neither a German native PASS nor zero FAILs is claimed.

| Article | Tool-detected language | Sentences | CV | Short share | Actual FAILs |
|---|---|---:|---:|---:|---|
| 679 | ko | 53 | 0.433 | 0.019 | len_cv, short_share |
| 680 | ko | 57 | 0.456 | 0.000 | short_share |
| 681 | ko | 55 | 0.457 | 0.018 | short_share |
| 682 | ko | 53 | 0.518 | 0.019 | short_share |
| 683 | ko | 56 | 0.415 | 0.018 | len_cv, short_share |

The Korean 15-character threshold is inappropriate for German compounds and cannot be repaired by inserting unnatural fragments. I did not edit shared tooling. This leaves the mechanical zero-FAIL criterion unfulfilled for these files, with an identified unsupported-language cause; the following is an actual prose assessment, not a fabricated substitute numerical PASS.

- Section 5.2, openings: document scope (679), notice timing question (680), custody/identity question (681), cumulative statutory elements (682), enforcement consequence (683). No stock hypothetical phrase; only two of five open with a question. The commissioning scenario is generic, not an invented case presented as real.
- Section 5.3, short sentences and pace: each has at least two natural short German sentences. Examples actually present: 679 “Originaldateien bleiben erhalten.” / “War die Maschine testbereit?”; 680 “Befund und Vermutung bleiben getrennt.” / “Die Frist läuft weiter.”; 681 “Eigentum allein erlaubt keinen Zutritt zur Fabrik.” / “Der Abholauftrag ersetzt diese Klärung nicht.”; 682 “Diese Bedingungen gelten gemeinsam.” / “Protokolle bleiben nachvollziehbar.”; 683 “Benötigt wird der vollständige Entscheidungstext.” / “Das spart unnötige Übersetzungen.” The longest statutory sentences are followed by shorter applications rather than a sustained long-sentence block.
- Section 5.4, paragraph openings: extracted and read vertically. In the substantive paragraphs no exact first word occurs more than twice in any article. German article/case variation was not counted as a fabricated new semantic pattern. Body questions, facts, statutes and consequences alternate.
- Section 5.5, citation rhythm: every article has noncitation evidence/operational paragraphs. No three consecutive statute-claim/caveat paragraphs. Article references are often sentence subjects, not an endless row of end-parentheses.
- Section 5.6, contrast: substantive contrasts distinguish real risks (internal ERP action from notice, ownership from site access, judgment from asset access); there is no recurring “not X but Y” slogan or invented reader misconception. No blocking contrast monotony found.
- Section 5.7, endings: the substantive endings are respectively a test releasing a specific payment, a retained sample identifying shipment condition, the person who can actually release each tool, keeping secret CAD files out of the initial email, and obtaining the original-service evidence. Required language/contact information is similar across the batch but not a repetitive substantive conclusion; source/legal-information tails are structural exceptions.
- Section 5.8: no bold, invented first-person experience, public author, unsupported review claim or imperative checklist heading. Professional German register is consistent. Korean/Japanese morphology requirements do not apply.
- Section 5.9: proposals retain statute links, factual categories and timelines. M1 is specifically marked as correcting legal force; S3 is marked as source-based precision rather than hidden stylistic alteration.

MONOTONY: manual inspection found no blocking repeated-opening, repeated-contrast, citation-chain or formulaic-ending defect in these five drafts. Mechanical result remains unsupported/FAIL as documented; it must not be reported as a measured German pass.

## Terminology, usefulness, metadata and CTA

All five have differentiated practical value for German readers: FAT/SAT and signatory authority, 8D reporting and lots, tool inventories/subsuppliers, background versus new CAD results, and German finality/service evidence. No German Abnahme/HGB 377 rule is imported as Taiwan law. No Germany–Taiwan reciprocity result is promised.

Titles match body scope. Three FAQs per article stay within the body; no new remedy, guarantee or foreign qualification was discovered in an FAQ. Author metadata is internal legal-ai-assistant, audience is de, target market is Germany, and dates are 23 October 2026. Author-measured body counts (independently reproduced by whitespace count including body source tails) are 827 / 772 / 801 / 772 / 857, within the 650–950-word brief. There are no body H1 or image fields to language-review; rendered fallback and screen design are integration work.

Each article gives the same-locale contact route and exactly one email contact paragraph. Initial information is limited to a short non-sensitive description, party identity, Taiwan connection and relevant dates. Full contracts/technical files come after arrangements. English, Chinese, Japanese and Korean are the only stated consultation languages, matching current source copy; there is no German-speaking counsel, interpreter, immediate response or retainer promise. Some CTA phrasing (tatsächliche Verständigung / tatsächliche Beratung) is slightly formal but understandable and does not require another repair cycle.

Integration label requested by root: the original “Empfohlene Beiträge für deutschsprachige Leser” is grammatically correct and natural for a language-based audience. Root then confirmed that this section is intended for the five Germany-targeted articles. Under that stated scope, the revised “Empfohlene Beiträge für Leser in Deutschland” is natural, more specific and recommended: PASS. If the code later aggregates all German-language audience articles regardless of market, retain the language-based wording or the shorter “Empfohlene Beiträge” instead; German language alone does not establish Germany-specific targeting. Rendered layout was not inspected.

## Official spot checks and remaining evidence limits

Opened during this independent review on 23 October 2026:

- [Civil Code 354](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354): separate value/usability and guaranteed-quality paragraphs; basis for optional S3.
- [Civil Code 365](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=365): confirms the two distinct periods and the six-month-only intentional-nondisclosure exception used in 680.
- [Civil Code 930](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=930) and [931](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=931): checked the conditional insolvency qualification against 681. No definite mistranslation identified. The author's “unter den dort genannten Voraussetzungen” should not be expanded into an unconditional entitlement.
- [Trade Secrets Act full current text, Articles 2 and 4–7](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080028): supports the cumulative criteria/default allocation/consent structure; basis for M1. The single-article 6 endpoint returned an access error, so the successfully opened full text was used.
- [CCP 402](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=402) and [Enforcement Act 4-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010004&flno=4-1): four refusal grounds, service qualification and separate permission/jurisdiction wording checked against 683.

The retrieved MOJ pages report consolidation through 16 October 2026. The Civil Code notice concerns not-yet-effective 166-1/1223; no such future inheritance provision is used in these commercial articles. I did not independently reopen every article cited in all five manuscripts, authenticate Germany-specific case law or determine actual reciprocity. Those remain within the separate final legal review. Research and author reports are supporting evidence, not a substitute for that review.

No manuscript changed during this review. Root/author should make M1 (and any chosen optional refinements), then request recheck of the resulting bytes. PASS articles should continue to the independent final legal review without an unnecessary rewrite. Publication, build, routing, image rendering and mobile/desktop verification are not certified here.

## Repair pass 1 — independent delta recheck, controlling current verdict

Rechecked 2026-10-23 after the author's bounded repair. This appendix supersedes the initial verdict/version table for the current files; the earlier findings and hashes remain review history. I remain independent from the author and did not edit any manuscript.

Current result: all five articles PASS the independent German locale review. M1 is closed. The shared CLI German-support limitation and the separate final legal review are not resolved by this PASS.

I read the repaired sentences in their surrounding paragraphs and the author repair record. To establish the full extent of the change, I reversed only the four recorded sentence replacements in memory and recomputed SHA-256. Each reconstructed file exactly matched its original r1 hash. The unchanged 680 and 681 also matched their original hashes directly. Thus the observed delta is exactly one replacement in 679, two in 682, one in 683, and no changes elsewhere in these five files.

| File | Current locale verdict | Current SHA-256 | Delta verification |
|---|---|---|---|
| 679-taiwan-maschinenlieferung-fat-sat-schlusszahlung.md | PASS | 6c5e4d4c89c3f90c3dba75f348b18d7e52a48c1d0c7a53f3b9ac4c1ed7e96b02 | Exact expected delta, 1 sentence (S1) |
| 680-taiwan-bauteile-maengelruege-pruefmuster.md | PASS | d2bdc27e7417193dee9b69f52b1ef4549a980e928dcb93785d0a6e2fbdb2a320 | Unchanged |
| 681-taiwan-lieferant-werkzeuge-pruefvorrichtungen-herausgabe.md | PASS | 87333454f3d491ead7a68eb0ec7b181ffa553c937b29d2050ac842ef5fd4a10c | Unchanged |
| 682-taiwan-gemeinsame-entwicklung-cad-geschaeftsgeheimnisse.md | PASS | 2a737101b06cd4e4f2e680bb17cc3af83f574f98c5cb03dd8f265f1a5e4c6a97 | Exact expected delta, 2 sentences (M1, S2) |
| 683-deutsches-urteil-vermoegen-taiwan-vollstreckung.md | PASS | 39f6552b79d04807a001bce627864efa494e43cc013913b472e2438dcc1a54e2 | Exact expected delta, 1 sentence (S4) |

### Finding resolution and meaning checks

- M1 closed: 682:26 now says “Für ihre Zusammenarbeit sollten beide in der Vereinbarung festhalten, welche Informationen sie einbringen und wer welche neuen Ergebnisse nutzen darf.” This is recognizably practical agreement advice. It no longer introduces an apparent extra statutory recording duty. Existing/new information and permitted-use categories remain; the statutory default ownership rules in the next section remain untouched. The legal-force correction is explicit rather than mislabeled as purely cosmetic.
- S2 accepted: the preceding sentence now uses “gelten diese Anforderungen für das deutsche Konstruktionsunternehmen und den taiwanesischen Entwicklungspartner gleichermaßen.” The subject and singular pair are clear; the cumulative Article 2 conditions are preserved.
- S1 accepted: 679:24 now identifies an unterschriebenes Protokoll des Factory Acceptance Tests as the signed object. The following payment-milestone and separately required SAT conditions are unchanged.
- S4 accepted: 683:53 now identifies “Rechtsvertretung für das Verfahren in Taiwan” as the coordinating role, removing ambiguity with an overseas representative office. “Welche … benötigt werden” retains the case-specific need and does not invent a uniform authentication rule or an existing retainer.
- S3 remains an optional source-precision item for final legal review: 680:40 is unchanged. The final reviewer should consider whether explicitly separating Article 354 paragraph 1's value/usability de minimis exception from paragraph 2's guaranteed-quality requirement improves the legal reading. I did not establish a definite opposite legal assertion in the existing wording, and this remains nonblocking at locale review.

The revised opening of 679 and second paragraph of 682 still pass the sentence-by-sentence deletion test: each retains the distinct information recorded above. The four changes do not add a stock opener, repeated contrast, citation chain, boilerplate ending or invented experience. MONOTONY: no new manual blocking issue in the repaired passages. All source links, dates, numbers, FAQs and contact-language claims are byte-for-byte unchanged outside the exact replacements.

I reran the required shared CLI for the three changed files. All were again detected as ko and exited 1: 679 CV 0.433 / short share 0.019, 682 CV 0.517 / short share 0.019, 683 CV 0.419 / short share 0.018. The failed metrics remain the same categories as r1 (short_share for each, len_cv also for 679/683). No measured German PASS is claimed. Unchanged 680/681 retain their recorded r1 results.

These current hashes may proceed to independent final legal review. No publication or rendered-screen verification is certified by this appendix.
