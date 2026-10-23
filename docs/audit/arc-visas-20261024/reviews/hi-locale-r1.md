# Hindi independent locale review — r1

Review date: 2026-10-24 KST. Reviewer: fresh independent Hindi AI editorial reviewer (`review_hi`). I did not author any of the three articles. This is a bounded independent editorial/content review, not human-native, lawyer or publication certification. Only this report was written; manuscripts, shared checks, Git and deployment were not changed.

## Exact-version verdicts

All paths are under `/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-hi/`. Each complete manuscript, including frontmatter, FAQs and sources, was read. Independent `shasum -a 256` output matched both `work/hi-author.md` and root's frozen handoff.

Completion readback: the same three explicit paths were hashed again after this report was written; exit 0 returned the same three SHA-256 values below. No manuscript changed during the review.

| Article | Verdict | Exact SHA-256 | Required findings |
|---|---|---|---|
| `704-taiwan-arc-first-application.md` | PASS | `ec3c2aa3e2b1bd1fb0e09706e999f49dfe9a324a203db2f3f62449738801593e` | 0 |
| `705-taiwan-visa-residence-work-study-family.md` | PASS | `9f877497c8c7443385ffd625dc4be5f7012729a7c3f5c6fd6d56892763b0a757` | 0 |
| `706-taiwan-arc-renewal-changes-reentry.md` | PASS | `77f227acea63cbdfa6c5396c0e0766827c500858a01ac7f14f55801ad0df7b41` | 0 |

PASS is limited to the prose/content reviewed at these hashes. Hindi is unsupported by the required shared variety CLI; all three exact runs returned Korean-mode failures, documented below. This report does not claim quantitative Hindi validation, all checks passing, rendered/live-page verification or release approval.

## Rules applied

Read the full `work/LOCALE-REVIEW.md`, `tseng-law-editorial/SKILL.md` and `references/review-criteria.md`, repository `AGENTS.md` and `docs/columns/EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `SENTENCE-VARIETY-RULE.md`, `LESSONS.md`, `work/BRIEF.md`, `work/research-arc.md`, `work/research-paths.md`, and the HI section plus shared scope/service notes of `work/research-asia.md`. Read the exception-source table in `work/reviews/final-core.md` and the completed author handoff. Current no-public-byline and retired-Fable rules control over historical boilerplate.

The earlier preparation record's missing-handoff condition is resolved. No verdict was made before the frozen handoff arrived.

## Required findings

None. No substantive rewrite is requested. The three articles preserve the relevant conditions, dates, amounts, agency roles and nationality distinctions examined below. Instructions such as retaining documents, checking the relevant application route and keeping the application number are useful next actions, not generic promotion.

## Optional wording improvements only

These are preferences for slightly more idiomatic precision, not blockers. Current wording remains understandable in context. If adopted, the revised hashes must be supplied for a bounded recheck.

| File:line | Exact sentence | Reason | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| `704-taiwan-arc-first-application.md:74` | कार्ड की अगली अंतिम तारीख को [नवीनीकरण और बदलाव की समय-सीमाओं](/hi/columns/taiwan-arc-renewal-changes-reentry) के साथ अपने कैलेंडर में दर्ज करें। | `अगली अंतिम तारीख` is less idiomatic than naming the card's expiry directly. | कार्ड की वैधता समाप्त होने की तारीख को [नवीनीकरण और बदलाव की समय-सीमाओं](/hi/columns/taiwan-arc-renewal-changes-reentry) के साथ अपने कैलेंडर में दर्ज करें। | Yes; expiry/calendar action and link are unchanged. |
| `706-taiwan-arc-renewal-changes-reentry.md:55` | बैंक, विश्वविद्यालय या कंपनी का रिकॉर्ड बदलने के बाद भी NIA का पंजीकरण बच सकता है। | `पंजीकरण बच सकता है` colloquially conveys an unfinished task, but explicitly saying the change remains to be registered is clearer. | बैंक, विश्वविद्यालय या कंपनी का रिकॉर्ड बदलने के बाद भी NIA में बदलाव दर्ज कराना बाकी रह सकता है। | Yes; separate NIA registration remains necessary. |

No optional change is requested for 705. No MONOTONY defect requiring repair was found; optional wording above is not a disguised monotony rejection.

## First-two-paragraph deletion test

Each opening was tested sentence by sentence, including whether deleting it preserves the immediate legal scenario rather than merely leaving a later explanation elsewhere in the article.

| Article / lines | What the first two paragraphs add | Independent result |
|---|---|---|
| 704:27,29 | Paragraph 1 gives the 30-day next-day trigger, NIA/ARC identification and the integrated-document exception. Paragraph 2 makes the reader identify the actual entry document, introduces limited direct-NIA eligibility and points to the route-selection companion. | Retain. Removing sentence 1 loses the express trigger; sentence 2 loses the responsible agency and obligation; sentence 3 loses the exception. The second paragraph is a document-based decision rather than a generic article preview. Its final link supplies the next route-selection step. |
| 705:28,30 | The first question poses the real sequence decision among work authorization, resident visa and direct ARC application; the next two sentences establish the work-authorization/exemption condition and statutory alternative. Paragraph 2 separates passport/entry scheme from language and excludes other status systems. | Retain. The question frames alternatives that the title alone does not resolve. The following conditions cannot be dropped. The Hindi-language sentence is somewhat explicit but serves the brief's nationality boundary; it is not an unsupported assumption about Indian citizenship. |
| 706:27,29 | Paragraph 1 states the consequence of losing the residence basis, points to revocation and conditional exceptions, and identifies work/study/family events. Paragraph 2 separates renewal, address/workplace registration and permission for a new basis, then asks the reader to record the event date separately from card expiry. | Retain. Neither paragraph is removable throat-clearing. The second paragraph sets up the different triggers in the following table. Removing it leaves less guidance about which date to record. |

## Actual same-locale comparisons

Paths below are under `repo/src/content/columns-hi/`. These are local corpus comparisons, not verified live-publication readbacks. None of these files has an ISO `published` field. Display dates and modification dates were kept separate.

| Comparator | Display date / lastmod | Actual comparison with this batch |
|---|---|---|
| `018-taiwan-semiconductor-market-entry.md` | 17 September 2026 / 2026-10-07 | Read complete file. Its opening lists company operating roles and asks whether company formation is enough. Numbered headings, dense legal/operating comparisons and tables lead to a business-summary/contact-language ending. New 705 links it only for the company-versus-personal-permission distinction; the new articles do not reproduce its long corporate introduction or closing sales structure. |
| `011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md` | 4 February 2026 / 2026-07-25 | Read opening, actual heading sequence and ending. It compresses importer, registration, PIF and advertising into long lists, then previews the article. Numbered sections and a preparation list precede references and a broad disclaimer. New 704 starts with a specific filing trigger; its document table compares evidence rather than reproducing the corporate checklist. |
| `016-taiwan-inheritance-custody-analysis.md` | 13 September 2025 / 2026-10-11 | Read opening, actual heading sequence and ending. It begins with many family-law classifications, repeats distinctions in paragraph 2 and uses eleven numbered sections. New 706 begins with loss of a residence basis and uses a compact three-trigger table, ending on event/expiry/return dates and application number. |

The third comparator follows the researcher's disclosed selection among older tied display dates, using recent modification as a tie-breaker. These are not claimed to be the three most recently published live pages. The historical public human bylines in 011/016 were observed but not copied. The new batch uses unnumbered issue-specific headings and distinct number/question/legal-consequence openings.

## Manual section 5 review

This is qualitative inspection of the actual Hindi prose. It does not supply invented Hindi thresholds or replace the unsupported quantitative release check.

| Section 5 item | 704 | 705 | 706 |
|---|---|---|---|
| 1. Exact shared CLI | Executed; unsupported Hindi/Korean fallback, exit 1. | Same limitation, exit 1. | Same limitation, exit 1. |
| 2. Opening variety | Number and filing trigger. | Reader's route-selection question. | Legal consequence of lost residence basis. |
| 3. Short sentences / sentence flow | `तारीख इन्हीं से तय होगी।` and `किरायानामा एक विकल्प है।` supply short breaks. Document conditions remain in longer sentences where necessary. | `पदनाम पर्याप्त नहीं है।` and `ARC स्वीकृति मिलने पर जारी होता है।` break up eligibility discussion. The degree/Mandarin material is separated into coherent paragraphs. | `आवेदन संख्या रखें।` and `यह स्वतः लागू नहीं होता।` give short breaks. Longer exception paragraphs explain real conditions rather than repeating equal-length slogans. |
| 4. Paragraph starts | Vertical read and independent opener extraction: no prose opener occurs more than twice. | Same; `विदेशी` occurs twice. | Same; `नया` occurs twice. |
| 5. Citation/caveat rhythm | Sources are embedded in claims; the record/card-check paragraphs include practical sentences without citations. No three successive claim-then-caveat paragraphs. | Source positions vary; the final document-preparation paragraph is uncited practical guidance. No three-paragraph formula. | Deadline table, statutory explanations and practical event records vary the structure. The closing paragraph is uncited and concrete. |
| 6. Contrast framing | No repeated ornamental not-X-but-Y formula. Fee, processing and work-permission boundaries answer actual application questions. | Required distinctions between entry categories, degree/Mandarin routes and family work rights are substantive. No invented opponent or rhetorical contrast sequence. | Several necessary negative cautions remain about printed expiry, receipts, e-Gate and pending applications. They address distinct legal risks; they are not treated as an invalid Korean contrast count or rewritten to erase conditions. |
| 7. Ending | Card expiry and renewal/change calendar link. | Competent mission's document list and status-change timing. | Event date, expiry, proposed return and application number. |
| 8. Register / integrity | Professional practical Hindi; no body H1, bold, public author, fabricated first-person experience or imperative checklist heading. | Same. | Same. |
| 9. Legal/source preservation | Reviewed current hashes against source points below; no manuscript edited. | Same. | Same. |

Openers were independently extracted after reading the prose: 704 has 16 prose paragraphs, 705 has 18 and 706 has 20 under the stated exclusion of headings/tables/source-date tail. These are observable counts, not a Hindi fluency score. Necessary source-date and general-information tails are distinct from the practical last body paragraphs.

## Primary-source spot-checks actually performed

All source pages in this table were opened during this review on 2026-10-24. The table identifies the checked claims; it does not assert that every page in all three source lists was exhaustively audited. Statutory text controls over older numbers in administrative guides.

| Manuscript location | Source actually opened | Result and boundary |
|---|---|---|
| 704:27,33 | [Immigration Act 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22); [BOCA domestic-visa FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html) | Next day after resident entry versus domestic resident-visa issue date is preserved. Integrated ARC-function exception remains. BOCA guidance dated 2024-01-02 is not called a commencement date. |
| 704:39–58,68; 706:47,69 | [NIA 0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970); [Residence Regulations](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129) | Purpose-specific evidence, recent ARC photo, authentication/possible Chinese translation, current-address proof, first spouse category and ten-working-day qualifications match the stated route. The loss-document alternatives are retained. NIA guide update is 2026-04-14. |
| 704:62; 706:51,69 | [Fee Standards, Articles 3,7,10](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080135) | NT$1,000 per year including a shorter period, eligible direct-entry NT$2,200 supplement and loss/damage reissue NT$500 are correctly bounded. The overseas-compatriot discount is not generalized. Article 10 separates commencement of the amended fee provisions. |
| 704:70; 706:49 | [NIA student guide 0929](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news) | Approval triggers the five-working-day payment period; completed payment triggers three-working-day chip-card collection. Electronic ARC and Mandarin extension details remain specific to the student process. Guide update: 2026-08-28. |
| 705:28,42,62 | [Foreign Professionals Act 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | Qualifying professionals with permission/exemption and specified dependents have the direct NIA route. The text does not give it to every worker, parent or adult child. Current consolidated article was read; commencement-history access limitation is stated below. |
| 705:38,60; 706:77 | [NIA 0915, especially notes 1 and 9](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | Trial/TAC/landing/special-entry exclusions and their regulatory exception are not collapsed into ordinary visa-exempt entry. Closure on departure is confined to that direct-residence application process. The manuscript does not copy the guide's old Article 12 reference. |
| 705:54 | [BOCA Mandarin residence guide](https://www.boca.gov.tw/fp-166-285-041cb-2.html) | Four completed months plus at least three more registered months, qualifying university-linked center, 15 weekday classroom hours and absence cap of one quarter match. No immediate residence from admission alone. |
| 705:56,64 | [Employment Service Act 50](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=50); [Article 48](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48) | The 20-hour term-time limit is limited to the relevant student categories, with winter/summer vacations excluded. The Taiwan-national-spouse work exception requires marriage to a national with household registration and approved residence; it is not given to every foreign dependent. |
| 706:27,35–43,61,79 | [Immigration Act 31](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31); [Residence Regulations 7,9,11,20](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129); [Article 9 separate page](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080129&flno=9) | Ordinary pre-expiry three months, address/workplace next-day 30 days and eligible reason-change event-day 30 days are separated. The other 15-day BOCA route is not an automatic approval or grace period. Graduate extension is application/approval based. Late reapplication is conditioned on less than 30 days and a continuing original basis. |
| 706:41 | [Gold Card guide, note 6](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/406403/); [Entrepreneur guide, notes 3 and 6](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/) | Gold Card four months; entrepreneur business-based extension four months; separate no-business continued-residence route three months. These are described as their respective administrative routes. Page updates: 2026-02-10 and 2025-02-17. |
| 706:67,71,75 | [NIA passport/loss FAQ, Q2–3](https://news.immigration.gov.tw/EasyPack/Detail/DDA469F4-E2D0-4A98-847C-21432DCC040E?lang=EN); [Overseas-loss notice](https://www.immigration.gov.tw/5385/7229/7232/368785/); [Residence Regulations 20](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129) | Passport data updating, official replacement paths and own/other-account authentication differences support the bounded advice. Legacy migrant-card/single-permit exceptions are acknowledged. Re-entry permission and valid-passport/APRC rules are supported by Regulation 20. No universal six-month passport condition or receipt-based entry right is invented. |

## Exact shared CLI results

Each command was independently executed after the freeze; each process returned exit code 1. No `--lang en`, modified checker, substitute thresholds or forced PASS was used.

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-hi/704-taiwan-arc-first-application.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-hi/704-taiwan-arc-first-application.md [ko] sentences=19 mean=211.4 cv=0.39 short=0.0 run3=0.0 opener_rep=0.118 cite_end=0.0 cite_para=0.294 contrast=0 caveat=0 q=2
  FAIL len_cv=0.39 (limit >= 0.45): sentence-length variation (stdev/mean) too low — mix very short and long sentences
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
exit_code=1

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-hi/705-taiwan-visa-residence-work-study-family.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-hi/705-taiwan-visa-residence-work-study-family.md [ko] sentences=22 mean=233.5 cv=0.413 short=0.0 run3=0.1 opener_rep=0.053 cite_end=0.0 cite_para=0.421 contrast=0 caveat=0 q=3
  FAIL len_cv=0.413 (limit >= 0.45): sentence-length variation (stdev/mean) too low — mix very short and long sentences
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
exit_code=1

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-hi/706-taiwan-arc-renewal-changes-reentry.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-hi/706-taiwan-arc-renewal-changes-reentry.md [ko] sentences=22 mean=247.9 cv=0.349 short=0.0 run3=0.25 opener_rep=0.048 cite_end=0.0 cite_para=0.619 contrast=0 caveat=0 q=1
  FAIL len_cv=0.349 (limit >= 0.45): sentence-length variation (stdev/mean) too low — mix very short and long sentences
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
exit_code=1
```

These are actual unsupported-language results. They neither establish Hindi metric compliance nor diagnose a Hindi manuscript defect. The author's `--lang hi` KeyError was read in the handoff but was not rerun or counted as an independent reviewer run.

## Structure, links and truthful scope

Independent read-only Node/gray-matter inspection from the repository returned exit 0. Its output for each exact file had `errors: []`, `faq: 3`, `published: 2026-10-24` and `lastmod: 2026-10-24`. Required metadata was present, `topic: visa`, `audience: [hi]`, and internal `author: legal-ai-assistant` were correct. The scan covered body H1 and Markdown/HTML bold prohibitions; full reading separately found no public author or review claim, invented experience, unverified Hindi consultation promise or guaranteed outcome.

The executable read-only check used `node` with `require('node:fs')`, `require('node:path')` and `require('gray-matter')`, read the three explicit absolute files, parsed their metadata, checked forbidden formatting, and matched every `/hi/columns/<slug>` against an existing file ending `-<slug>.md` in `columns-hi`. It also printed the paragraph opener lists for manual inspection; it did not write test files or calculate a fluency score.

Observed internal target sets:

- 704: `taiwan-visa-residence-work-study-family`, `taiwan-arc-renewal-changes-reentry`.
- 705: `taiwan-arc-first-application`, `taiwan-semiconductor-market-entry`, `taiwan-arc-renewal-changes-reentry`.
- 706: `taiwan-arc-first-application`, `taiwan-visa-residence-work-study-family`.

All exist in this locale's source inventory. The new companion files must be released together for their public links to resolve. Live HTTP/rendered link validation was not performed. Three useful FAQs per article concern that article's actual decisions and do not make broader claims than the body.

The batch deliberately ends with official application/record preparation rather than a law-firm sales CTA. No Hindi-language consultation, translation service, universal visa agency representation, foreign licensure or individual approval guarantee is asserted. Consequently no unverified service promise needs repair; this is not a certification that the firm offers those services.

## Evidence limits and next step

- The shared CLI remains unsupported for Hindi. Qualitative content PASS and quantitative release-validation limitation are separate results.
- During preparation, the single-article Regulation 7 URL was inaccessible via the web tool. The complete current Regulation 7 was subsequently read successfully in the official consolidated law. Its 30/15-day distinction is not unresolved.
- The Foreign Professionals Act history page was inaccessible through both Chinese and English paths. Article 16 itself and the current NIA guide were read. No specific commencement date is asserted in these manuscripts; this review does not independently certify the historical commencement chronology recorded in the research brief.
- The separate Immigration Act 34 URL was inaccessible on this attempt. The same re-entry requirements were read in current Residence Regulation 20, including multiple use, ARC-linked validity and APRC with valid passport. This is a source-access limit, not an identified contradictory claim.
- The 5382-prefixed NIA passport-validity FAQ was inaccessible during preparation. The manuscripts do not assert a universal remaining-validity threshold; none was supplied from that inaccessible page.
- Not every external source-list URL was opened; no authenticated portal application/payment, airline acceptance, actual ARC collection, website build, rendered page, public publication or production status was tested.
- No required repair remains in this locale review. Root can pass these exact hashes to the independent final legal/content reviewer. Optional edits, if chosen, require new hashes and a narrow reread of the affected passage rather than a full reauthoring cycle.

Memory was used only for editorial discovery: `MEMORY.md:548–557`; current task rules and live sources control. Vault index/domain MOC/project context were read. No vault or memory file was changed because this task owns only this report.
