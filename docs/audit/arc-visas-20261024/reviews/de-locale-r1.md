# Independent German locale review — ARC 704–706

Current result — 2026-10-24 02:21 KST: **704 REQUEST_CHANGES; 705 REQUEST_CHANGES; 706 PASS**, each against the frozen SHA-256 below. The only required content repair is the entry-scheme qualification in 704/705. German is unsupported by the shared variety CLI; its Korean fallback cannot establish a German metric PASS. These are bounded content verdicts, not publication approval. The preparation record below is historical and is superseded by the completed review appended after it.

Reviewer: `/root/review_de`, independent AI German editorial reviewer for readers of Taiwan-law material. This reviewer did not author the assigned manuscripts and does not claim human native-speaker status or legal licensure. Ownership is limited to this report. Manuscripts, shared checkers, source ledgers, other reports and Git remain unchanged by this reviewer.

## Historical preparation status — 2026-10-24 02:06 KST

Awaiting frozen author handoff. `test -f /Users/son7/tseng-arc-visas-20261024/work/de-author.md` returned exit 1 with no output. No article has been reviewed or certified against a frozen SHA-256, and no article-level PASS or REQUEST_CHANGES is issued at this preparatory stage. Root has been notified to provide a follow-up after the author freezes all three manuscripts.

Prepared by reading the full `work/LOCALE-REVIEW.md`, editorial skill and `references/review-criteria.md`, `repo/AGENTS.md`, `repo/docs/columns/EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, shared `SENTENCE-VARIETY-RULE.md`, `LESSONS.md`, `work/BRIEF.md`, both core legal research files, the German and common portions of `research-europe.md`, and `work/reviews/final-core.md`. The current retirement of Fable and no-public-byline policy supersede historical boilerplate.

## Actual same-locale comparison material read

Paths below are relative to `repo/src/content/columns-de/`. All three complete local files were read. Their metadata dates are comparison facts, not proof of current publication.

| Comparator | Display date / lastmod | Opening, structure and ending observed |
|---|---|---|
| `018-taiwan-semiconductor-market-entry.md` | 17 September 2026 / 2026-10-07 | Opens with a long list of headquarters/customer operating demands, then asks whether a company solves them. Numbered sections and role/comparison tables dominate. Ends with detailed inquiry preparation and the four actual consultation languages. Its company-register versus engineer-work distinction is adjacent to 705, but corporate structuring is outside the new articles' personal residence scope. |
| `011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md` | 4 February 2026 / 2026-07-25 | Begins with multiple importer/PIF/labeling decisions in one long sentence, followed by a roadmap paragraph. Extensive numbered classifications and repeated distinctions. Ends with sources, a lengthy general-information disclaimer and an old human byline. These legacy forms are not a template for the new series. |
| `016-taiwan-inheritance-custody-analysis.md` | 13 September 2025 / 2026-10-11 | Opens by enumerating separate family legal issues, followed by another distinction/roadmap paragraph. Eleven numbered sections, lengthy paragraphs and a checklist. Ends with linked services/pricing/contact, long disclaimer and an old human byline. No ARC-process duplication; avoid copying the abstract opening and closing pattern. |

Comparison against the three new manuscripts and the sentence-by-sentence first-two-paragraph deletion test remain pending until the handoff is frozen. Current public German corpus and rendered publication were not verified by this reviewer.

## Live primary-source preparation

The following pages were opened and the stated relevant passages read on 2026-10-24 KST. MOJ pages showed a consolidated-data cutoff of 2026-10-16. Legal conclusions will be matched to each actual manuscript, not inferred from the research ledger alone.

| Source actually opened | Bounded check |
|---|---|
| [Immigration Act Article 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | Resident-entry first ARC: 30 days beginning the day after entry; integrated-document exception. |
| [BOCA domestic resident-visa FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html) | Domestic issuance uses 30 days from resident-visa issuance, distinct from resident entry. Guidance published 2024-01-02. |
| [Foreign Professionals Act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0030295), [legislative history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295) | Articles 15 and 16: limited dependent work-permit application and direct NIA residence routes. Relevant 2025 amendment provisions effective 2026-01-01, not merely promulgated. |
| [Residence Regulations](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129) | Article 7 purpose-change starts on the event date, with a separate route outside Article 23-1; Article 9 ordinary renewal is during the three months before expiry. |
| [Immigration Act Article 31](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31) | Address/workplace 30 days from next day; residence-basis loss and limited continued-residence exceptions; no general grace period. |
| [Student online guide 0929](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news) | Current page dated 2026-08-28: approval, payment within five working days, IC-card collection three working days after payment. Degree/Mandarin routes and visitor-entry departure rule are category-specific. |
| [Entrepreneur guide](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/) | Notes 3 and 6: business-based extension within four months before expiry versus separate no-business continued-residence route within three months. Page updated 2025-02-17; administrative guidance, not a change of general Regulation 9. |
| [Gold Card extension FAQ](https://goldcard.nat.gov.tw/zh/faq/how-do-i-extend-my-employment-gold-card-before-it-expires-what-documents-do-i-need-to-provide/) | Gold Card extension has a separate four-month application window. |
| [NIA valid ARC/APRC passport FAQ](https://www.immigration.gov.tw/5385/12162/12197/414977/) | For holders of a valid ARC/APRC, passport valid on arrival suffices, subject to inspection; no universal six-month re-entry requirement. Page updated 2026-06-29. |
| [Firm contact page](https://tseng-law.com/en/contact) | Confirmed email and English/Chinese/Korean/Japanese consultation. German-language legal consultation, universal visa representation or outcomes are not promised. |

No page in this bounded live-source preparation was inaccessible. Searches within the entrepreneur page did not locate numeric variants, so the actual notes 3 and 6 were read directly. This does not imply that every eventual manuscript link has been checked.

## Historical pending review and validation limitation

Upon root's follow-up: verify all three current SHA-256 values against `work/de-author.md`; read each entire manuscript; inspect metadata, title/summary/FAQ, legal meaning and source fit, reader actions, nationality/language distinctions, actual German internal targets, public byline/bold/H1 constraints and truthful CTA. Record required findings with file:line, exact text, reason, rewrite and explicit legal-meaning effect.

Run exactly `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <file>` on each frozen manuscript and retain actual exit/output here. German is unsupported and default Korean metrics cannot certify German prose. No forced English mode, fabricated quantitative PASS or shared-tool modification will be used. Independently perform manual section 5 and record concrete MONOTONY findings only if present. Neither CLI nor manual section 5 has yet been run on the changing drafts.

This preparation is not publication authorization, a final legal certification, or a complete German locale review. Repair rounds used: 0.

Memory discovery only: `MEMORY.md:555–557` guided current-rule/corpus/source separation; the current rules and live sources were read directly. Vault context was read, but the reviewer does not edit the shared vault because the assigned write ownership is only this report.

## Completed frozen review — round 1

Root supplied the frozen handoff after preparation. The complete `work/de-author.md` and all three complete manuscripts were read. SHA-256 was independently computed before review and again immediately before this report, using `shasum -a 256` (exit 0). All three actual hashes match the author handoff. The author report itself has SHA-256 `67908abcbc14ac316d1b7d191394fe1e2aafcd110bafc15ef17e30ec31f2cf43`.

| File under `repo/src/content/columns-de/` | Exact reviewed SHA-256 | Verdict |
|---|---|---|
| `704-taiwan-arc-first-application.md` | `789e355c19a1e6193f77eaa2653dd313f93df170f638c7c040d1c1d0d150e9cf` | REQUEST_CHANGES — DE-1 |
| `705-taiwan-visa-residence-work-study-family.md` | `9ad37234154086aee71b45cdc99134b9ac8b69a03f96d77168f210a9f1589aa9` | REQUEST_CHANGES — DE-2 |
| `706-taiwan-arc-renewal-changes-reentry.md` | `5c1f2c6fe78a0232b77beec2ab57e0f19809521a344bd1786a854ea0ea72f42c` | PASS — no required content or locale defect found |

### Required findings

**DE-1 — consequential direct-application qualification; 704:35.** Exact sentence:

> Für bestimmte ausländische Fachkräfte besteht ein direkter Weg zur NIA: Wer als „foreign professional“ oder „foreign specialist professional“ unter das taiwanesische Fachkräftegesetz fällt, visumfrei oder mit Besuchsvisum eingereist ist und die betreffende qualifizierte Arbeit erlaubt ausüben darf, kann unmittelbar Aufenthalt beantragen.

The professional category and current Article 16 reference are correct. The missing practical qualification is the actual entry scheme: professional status plus the broad labels “visumfrei”/“Besuchsvisum” do not tell the reader whether the selected administrative route accepts that entry. [NIA 0915 §7(1)](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) lists restrictive entry categories and expressly preserves exceptions under relevant regulations. The [professional online guide, note 2](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/) separately addresses Working Holiday and restrictive visa annotations. A generic closing scope note does not supply this decision point.

Required bounded repair: retain the Article 16 proposition and add a short qualification next to it, with the NIA source also in the source list. Suggested German text:

> Bei direkten Aufenthaltsanträgen ist außerdem die konkrete Einreiseart zu prüfen. Die [NIA-Anleitung 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) nennt Einschränkungen etwa für probeweise Visumbefreiung, eine bedingte Online-Reisegenehmigung (TAC), Working-Holiday-Visa und bestimmte Visavermerke. Besondere gesetzliche Ausnahmen bleiben vorbehalten.

Legal-meaning effect: adds a material administrative-scope qualification; it preserves the statutory Article 16 route and its exceptions. It must **not** be converted into an absolute prohibition on every person entering through a trial exemption or TAC. The current [Article 16 text](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) is broader than the administrative list; this review does not adjudicate an individual exception. Do not copy the obsolete Article 12 cross-reference still present elsewhere in NIA 0915.

**DE-2 — the same qualification is needed in 705:37, also governing the dependent route at 705:61.** Exact sentence at line 37:

> Wer zur dort erfassten Gruppe der „foreign professionals“ oder „foreign specialist professionals“ gehört, visumfrei oder mit Visitor Visa eingereist ist und die betreffende qualifizierte Arbeit mit Erlaubnis oder aufgrund einer Befreiung ausüben darf, kann nach [Artikel 16 unmittelbar bei der NIA Aufenthalt beantragen](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16).

The same broad entry description recurs at line 61:

> Hat die Bezugsperson die Voraussetzungen des [Artikels 16 Absatz 2 des Fachkräftegesetzes](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) erfüllt und eine Aufenthalts- oder Daueraufenthaltsgenehmigung erhalten, können die dort genannten Angehörigen nach visumfreier Einreise oder Einreise mit Besuchsvisum unmittelbar die NIA ansprechen.

Reason/evidence: DE-1 applies to both direct routes. The article correctly limits eligible people and avoids a blanket work right, but its entry categories still need the administrative qualification. Required rewrite: add the proposed three-sentence paragraph from DE-1 once after the professional route at line 37, phrased generally for direct residence applications so that it also covers the later family route. Add its source-list entry. Do not duplicate it under every pathway. Legal-meaning effect: the same bounded scope addition as DE-1; no change to the specified professional/dependent categories or their statutory entitlement to apply.

No mandatory stylistic rewrite or MONOTONY finding is raised. Optional wording preference for 706:76: “Nach Artikel 34 des Einwanderungsgesetzes ist die Wiedereinreisegenehmigung grundsätzlich vor der Ausreise zu beantragen.” This is a simpler rendering of the existing “eine vor der Ausreise beantragte Wiedereinreisegenehmigung”; it preserves meaning and is **not** a condition of PASS. Article 34 speaks of an application in advance, and the surrounding paragraph plus FAQ already require the valid re-entry authorization/notation. No application-receipt travel guarantee is present.

### Content, locale and practical sequence

704 proceeds from the correct first-ARC clock to entry category, documents, portal, fees and payment/collection. It keeps the resident-entry next-day clock distinct from domestic Resident Visa issuance. Work authorization and residence are distinct. NIA/BOCA photo dates, category-limited professional portal access, student approval/payment/card triggers, the eligible surcharge and overseas-compatriot-student reduction are scoped. The Taiwanese-spouse first-year route is not presented as every dependent's rule. DE-1 is the only required repair.

705 offers a natural German reader question about the actual on-site activity, then identifies the work, degree, Mandarin, family and special-program routes. It distinguishes nationality, passport and German-language readership. The German Institute is orientation for German nationals; Taiwanese agencies determine applications. Mandarin prerequisites, student work permission, Taiwanese-spouse household registration/residence conditions and qualifying professional family members are not blended. There is no automatic general dependent work right. DE-2 is the only required repair.

706 distinguishes ordinary renewal, Gold Card and business-based entrepreneur windows; address/workplace next-day registration; eligible purpose-change event-day calculation; and the separate BOCA route outside Article 23-1. It does not invent a general grace period or universal passport-update deadline. New work permission, loss of the residence basis, overseas loss, valid re-entry documentation and departure-ending application rules are separately scoped. The source specifically cited for Article 34 is accessible. No universal six-month-passport condition is imposed on ARC/APRC re-entry.

The prose is professional and idiomatic German overall. Terms are explained at the point of use; headings express the reader's actual decisions. No fabricated client story, firsthand lawyer claim, approval guarantee or German consultation promise appears. There is no sales/contact CTA requiring a new service claim. All three have dated source/scope notes and three useful, non-identical FAQs.

Independent read-only Node/gray-matter verification exited 0: required metadata present; three FAQs each; `topic: visa`, `audience: ["de"]`, internal `author: legal-ai-assistant`, both dates `2026-10-24`; no body H1 or bold. All internal German column targets exist locally. 704/706 cross-link the companion articles; 705 also links existing 018. Body external source URLs are represented in each source list. Metadata and local target existence are not rendered-page or public-release verification.

### Actual comparator and first-two-paragraph deletion results

The full 018/011/016 files listed in the preparation record were independently compared with the completed manuscripts. None of the new pieces repeats their long abstract inventory/roadmap openings, numbered taxonomy or legacy bylines. 705's overlap with 018 is the useful company-versus-person permission distinction, followed by a local link; it does not reproduce the corporate-structure article. The three new endings perform different tasks: 704 compares card data and records dates, 705 assigns activity/entry basis/authority before booking, 706 organizes a dated inquiry. These comparisons are of actual local files, not translated summaries or assumed public pages.

| Frozen article | First two paragraphs tested independently | Deletion judgment |
|---|---|---|
| 704:27,29 | Entry category and 30-day period; next-day trigger; ARC definition; work-permit/NIA distinction; existing ARC-function-document exception. | Each sentence adds a condition, definition, clock or exception. No empty announcement/forecast sentence remains. Keep. |
| 705:29,31 | Customer meeting versus installation/training; work-permit rule and exceptions; irrelevance of an internal business-trip label; visa/residence authorities; Resident Visa purpose; direct NIA alternative. | The opening question makes the legal classification concrete. The remainder supplies independent authority/procedure information; deleting either paragraph loses a decision point. Keep. |
| 706:28,30 | Contract extension does not extend ARC; pre-expiry application; ordinary three-month window; possible earlier loss of basis; revocation and exceptions; employment example; three documents to compare. | The last sentence turns the preceding distinction into an actual document check. No sentence merely promises what the article will explain. Keep. |

### Independent manual sentence-variety §5

1. Exact shared CLI was run separately on all three frozen files; actual results follow. German support and FAIL-zero are **not established**. No English fallback or modified thresholds were used.
2. Openings are distinct: one filing-period number (704), an activity question (705), a contract/card misconception (706). No repeated invented scenario.
3. Short natural sentences occur in each: 704 “Sie beginnt am Tag nach der Einreise.” / “Ein Mietvertrag kann als Adressnachweis dienen.”; 705 “Die Zulassung allein genügt nicht.” / “Die Studien-ARC ersetzt diese Erlaubnis nicht.”; 706 “Fehlt der neue Beschäftigungsbescheid noch?” / “Gezählt wird ab dem Tag nach der Änderung.” Longer condition-bearing sentences are followed by shorter explanations. This is a qualitative German reading, not a numerical threshold claim.
4. Paragraph beginnings were read vertically and checked in the read-only structural output. No first word occurs more than twice per article. No three-paragraph repeated starter pattern found.
5. No three consecutive claim/citation-then-caveat paragraphs found. Citations attach to different parts of sentences; practical closing paragraphs do not mechanically end with a legal citation.
6. Contrasts answer real confusions (work/card, admission/residence, receipt/re-entry). No repeated “nicht X, sondern Y” or imagined rebuttal drives the prose.
7. The three practical closings differ as recorded above. Dated scope/source tails are structural notes, not repeated promotional conclusions.
8. Professional register remains consistent. No imperative checklist heading, bold/H1, public human/AI byline or invented experience. Occasional direct address is used for a concrete reader action.
9. Legal numbers, timing triggers and source fit were independently spot-checked. No manuscript text was edited by the reviewer. The two required qualifications preserve exceptions rather than remove legal conditions for rhythm.

No required **MONOTONY** defect identified at these hashes. The unsupported metric remains a separate release-validation limitation.

### Exact shared CLI evidence

Each command below was run by this reviewer on the frozen files and returned exit code 1:

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/704-taiwan-arc-first-application.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/705-taiwan-visa-residence-work-study-family.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/706-taiwan-arc-renewal-changes-reentry.md
```

Actual output, with the same full paths as the commands:

```text
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/704-taiwan-arc-first-application.md [ko] sentences=63 mean=90.5 cv=0.599 short=0.032 run3=0.033 opener_rep=0.053 cite_end=0.0 cite_para=0.263 contrast=0 caveat=0 q=1
  FAIL short_share=0.032 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/705-taiwan-visa-residence-work-study-family.md [ko] sentences=63 mean=111.3 cv=0.516 short=0.016 run3=0.066 opener_rep=0.167 cite_end=0.0 cite_para=0.389 contrast=0 caveat=0 q=2
  FAIL short_share=0.016 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/706-taiwan-arc-renewal-changes-reentry.md [ko] sentences=70 mean=96.6 cv=0.48 short=0.029 run3=0.044 opener_rep=0.19 cite_end=0.0 cite_para=0.381 contrast=0 caveat=0 q=1
  FAIL short_share=0.029 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
```

`[ko]` is the checker's fallback, not the actual manuscript language. These failures neither establish German monotony nor justify artificial sentence shortening. The author additionally records a `--lang de` KeyError probe; this reviewer did not rerun that probe and does not present it as a reviewer-executed check. No shared quantitative PASS is claimed.

### Additional live sources actually opened during frozen review

The preparation source table remains part of the source record. The following additional pages or passages were opened directly; search snippets and the author's report were not substituted for these reads.

| Official source | Passage used and limit |
|---|---|
| [NIA 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | §7(1) entry exclusions with regulatory exceptions; §7(5) first Taiwanese-spouse ARC. Administrative guidance, updated 2026-04-14; obsolete Article 12 reference not copied. |
| [NIA professional/dependent online guide](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/) | Defined eligible categories; notes 2, 5 and 9 on entry annotations, 15-day online/counter distinction and departure-ending review. Content dated 2024-01-01, not the site's current footer date. |
| [NIA 0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970) | Category evidence, foreign-document certification/translation, renewal and replacement documents. Guidance updated 2026-04-14. |
| [Immigration Act, English consolidated text](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080132) | Article 34 advance re-entry-permit application and permanent-resident exception. This is the accessible URL actually cited in 706. |
| [Employment Service Act](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0090001) | Articles 43/48/50/53: work authorization and limited exemptions, student 20-hour rule outside summer/winter vacation, employer change. |
| [BOCA degree-study route](https://www.boca.gov.tw/cp-166-283-c4da3-2.html) | Admission, educational/funding/health documents and printed/signed visa form. |
| [BOCA Mandarin visitor route](https://www.boca.gov.tw/fp-158-260-9690c-2.html), [Mandarin residence route](https://www.boca.gov.tw/fp-166-285-041cb-2.html) | Correct initial purpose; ordinary conversion restriction; four completed and at least three continuing months; weekly class/absence conditions. |
| [NIA Gold Card 0921](https://www.immigration.gov.tw/5475/5478/141465/141808/411634/) | §7(6), four-month extension window; content updated 2026-04-21. Application passport requirements were not generalized to every ARC holder's re-entry. |
| [NIA overseas-loss notice](https://www.immigration.gov.tw/5385/7229/7232/368785/) | Online/representative alternatives and route-dependent authentication; no boarding/entry guarantee. Issued/updated 2024-05-17. |
| [Gold Card official explanation](https://goldcard.nat.gov.tw/en/about/) | Four-in-one nature and no prerequisite job offer; no approval-speed claim used. |
| [German Institute Taipei](https://taipei.diplo.de/tw-de/service/seite-visum-nach-taiwan-1753168) | German-national audience and referral to Taiwan authorities for binding requirements. Its general overview was not used to override current Taiwan statutory exceptions. |
| [NIA fees regulation](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080135) | Articles 3/7: annual fee, eligible surcharge/reduction and replacement fee. |

Evidence limitation: the Chinese single-article URL for Immigration Act 34 (`https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=34`) was inaccessible through the web tool on two attempts. The English consolidated Article 34 was successfully read instead, matching the manuscript's actual link. This later failure supersedes the preparatory statement that no page had been inaccessible. Not every source-list URL was exhaustively network-tested; no public rendering, deployment, approval or individual immigration outcome was verified.

Repair rounds used: 0. One bounded author repair is requested for DE-1/DE-2. Review repaired passages and affected source lists/conclusions at new hashes; do not reopen unrelated drafting or require the optional 706 style preference.

## Repair 1 independent readback — 2026-10-24 02:29 KST

**Current final locale verdict: PASS for 704, 705 and 706 at the hashes below. DE-1 and DE-2 are resolved. No required new defect or regression was found.** This appended result supersedes the earlier initial-hash REQUEST_CHANGES decisions and the earlier statement that German is unsupported by the shared CLI. Earlier text and outputs remain historical evidence. This is a bounded AI editorial/content review, not human native-speaker or lawyer certification, publication approval or an individual immigration decision.

| Current file under `repo/src/content/columns-de/` | Independently verified current SHA-256 | Repair-1 verdict |
|---|---|---|
| `704-taiwan-arc-first-application.md` | `73a4b0125adafe4c03c072d044e97ebab618a082fe08fafb0916bc715ebb64dc` | PASS — DE-1 resolved |
| `705-taiwan-visa-residence-work-study-family.md` | `f9bfeafeb6371d7999518b130456cb281d764bc5c4e7064cc1872bc15f571882` | PASS — DE-2 resolved |
| `706-taiwan-arc-renewal-changes-reentry.md` | `5c1f2c6fe78a0232b77beec2ab57e0f19809521a344bd1786a854ea0ea72f42c` | PASS retained — byte-identical to initial reviewed file |

The current repair notice at the top of `work/de-author.md` was read and its three hashes matched actual files. Author-report SHA-256: `b726c67514585f226daee4f25711323d38e7c78bc055b7a18e1c0e0c3c415566`. Hash verification used `shasum -a 256`, exit 0. I did not edit manuscripts, checker files, the author report or any other review; only this append was made to the assigned report.

### Repair findings closed and regression boundary

At **704:37**, the actual added text is:

> Bei direkten Aufenthaltsanträgen ist außerdem die konkrete Einreiseart zu prüfen. Die [NIA-Anleitung 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) nennt Einschränkungen etwa für probeweise Visumbefreiung, eine bedingte Online-Reisegenehmigung (TAC), Working-Holiday-Visa und bestimmte Visavermerke. Besondere gesetzliche Ausnahmen bleiben vorbehalten.

At **705:39**, the actual added text is:

> Auch bei direkten Aufenthaltsanträgen ist die konkrete Einreiseart zu prüfen. Die [NIA-Anleitung 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) nennt Einschränkungen etwa für probeweise Visumbefreiung, eine bedingte Online-Reisegenehmigung (TAC), Working-Holiday-Visa und bestimmte Visavermerke. Besondere gesetzliche Ausnahmen bleiben vorbehalten.

Both now supply the missing entry-scheme decision point adjacent to the professional route. The general wording also qualifies 705's later dependent route at line 63. The examples are explicitly non-exhaustive and do not assert an absolute trial/TAC ban. The statutory-exception sentence preserves the qualification required in DE-1/DE-2. Article 16 and the professional/dependent categories remain intact; the obsolete Article 12 reference was not imported. Source-list entries are present at **704:91** and **705:84**.

For this readback, I directly reopened [NIA 0915 §7(1)](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) and [current Foreign Professionals Act Article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16). The administrative restriction list retains its exception clause; the statutory route is still preserved by the repaired prose. Both pages were accessible in this repair review. No broader legal research was restarted.

Independent comparison against the saved complete initial readouts found every original line preserved in order. The only additions are one three-sentence paragraph, its separating blank line and one NIA source entry per affected article. This is independently observed, not merely copied from the author's account. Therefore opening paragraphs, FAQs, deadlines, fees, closing actions and the three-comparator analysis remain unchanged. The affected professional/family passages and their neighboring paragraphs were reread; no new internal contradiction or unsupported categorical exclusion was found. The optional 706:76 wording preference remains optional and was not applied.

Manual §5 was repeated on the additions and their surroundings. The paragraph moves from a concrete check to examples to a necessary exception; its short last sentence carries legal meaning. 705's “Auch bei” fits the paragraph sequence without creating a repeated three-paragraph starter. There is no new formulaic opening/ending, contrast, claim-citation/caveat chain or MONOTONY defect. The first-two-paragraph deletion judgments remain valid because those exact passages are unchanged.

Read-only Node/gray-matter verification returned exit 0 with `errors: []`, three FAQs per file and source-entry counts 13/15/14. Metadata, no body H1/bold, existing local German targets and body-to-source-list URL coverage remain valid. This does not certify HTTP delivery or rendered public pages.

### Current German checker support and independently executed results

The current shared implementation was read directly. `variety_metrics.py` now maps `columns-de` through `multilingual.LANGUAGES`, which includes `de`. `profiles/de.json` has `locale: de`, German source-heading/abbreviation/contrast patterns and German examples. The helper includes German calendar-ordinal protection. Current measurements count orthographic words and use language-tailored punctuation/abbreviations; they are heuristic variety checks, not a replacement for the independent German prose review. No forced `--lang en`, local threshold change, copied author result or checker modification was used.

Checker identities read in this verification:

```text
0491ce5e3a7bd0c3ebd9bea7aa0ed04ba3ea41c6b56d2707824455eb2ccd10fb  /Users/son7/tseng-lanes-shared/variety/variety_metrics.py
53fe3e3dbf3f151e06e2629672ce0c57ccea9484b14433d220bfd53d4e5c35b4  /Users/son7/tseng-lanes-shared/variety/variety_multilingual.py
fe35834b10fa49f52d71f19ab8156a8eb50f2e9d06eba96cc881ad9197d19ecc  /Users/son7/tseng-lanes-shared/variety/profiles/de.json
```

Each exact command was independently executed on the current files; **all three returned exit 0, recognized `[de]` and reported zero FAILs**:

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/704-taiwan-arc-first-application.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/705-taiwan-visa-residence-work-study-family.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/706-taiwan-arc-renewal-changes-reentry.md
```

Actual reviewer execution output:

```text
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/704-taiwan-arc-first-application.md [de] sentences=65 mean=13.5 cv=0.556 short=0.308 run3=0.032 opener_rep=0.05 cite_end=0.0 cite_para=0.25 contrast=0 caveat=0 q=1
  OK — no variety limit violated
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/705-taiwan-visa-residence-work-study-family.md [de] sentences=65 mean=15.5 cv=0.494 short=0.138 run3=0.032 opener_rep=0.211 cite_end=0.0 cite_para=0.368 contrast=0 caveat=0 q=2
  OK — no variety limit violated
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-de/706-taiwan-arc-renewal-changes-reentry.md [de] sentences=69 mean=14.9 cv=0.478 short=0.217 run3=0.075 opener_rep=0.19 cite_end=0.0 cite_para=0.476 contrast=0 caveat=0 q=1
  OK — no variety limit violated
```

The historical Korean fallback/exit 1 is not the current result. German §5.1 FAIL-zero is now observed with the identified shared checker, while the independent qualitative §5 result remains as stated above. No public deployment, rendering or immigration outcome is inferred from either check. Repair rounds used: **1**. No further German author repair is requested.
