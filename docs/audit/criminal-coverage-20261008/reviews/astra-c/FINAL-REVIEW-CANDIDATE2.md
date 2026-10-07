# Independent reviewer C — candidate 2 content review

Review date: 2026-10-08 (Asia/Seoul). Reviewer: the independently assigned GPT-6 Astra reviewer C. This is an AI review; it is not a claim of human, native-speaker or licensed-lawyer review. I did not consult reviewer A/B findings or reports and did not delegate this review.

Decision: APPROVE for the content, legal-condition and editorial scope of first40 candidate 2. No unresolved content blocker remains among the texts examined. This decision does not declare the broader criminal-coverage project complete and does not certify production build, deployment or browser work I did not perform. The primary agent owns release verification.

## Exact scope and identity

Repository: /Users/son7/Projects/tseng-law-criminal-coverage-20261008. Base Git SHA: b6b4452d6ecad7ff79e2a00a31f36dfacfb9501f.

Candidate: [candidate2-manifest.json](./candidate2-manifest.json), SHA-256 f06aec60c2c1430ce73643ac45c41912fe4960b90df8d65246efc5f83b079d83. All 67 listed files matched their exact candidate hashes in my final check. The immutable copies are under candidate2-snapshot/. The candidate includes 47 modified/new article files plus implementation, data and test files; hash verification is not a claim that every test file received a line-by-line review.

I read the full bodies, metadata and FAQs of all 40 new articles: EN405–412, ZH413–420, KO421–428, JA429–436 and VI437–444. I also read the current substantive KO064 and EN355 repairs. Earlier in this same independent review I read all 20 original board articles, 401–404 in five locales, and checked their important procedural propositions against official sources. At candidate 2, their hashes prove that only the five expected 403 source-list additions changed. I re-read those additions. JA430, VI438 and VI439 corrective passages were re-read after integration; all eight EN seoTitle additions were inspected as the only changes to their already-read bodies.

[reviewed-content-manifest.json](./reviewed-content-manifest.json) records the exact SHA-256 and line count for all 62 reviewed article texts and the coverage inputs. The release board contains 61 articles: original20 + new40 + EN355. KO064 remains outside the board because its topic/tag reclassification was deferred; its substantive repair is included in this review.

The required editorial voice documents, sentence-variety rule and LESSONS were read in full. COVERAGE-STANDARD.md and WRITER-BRIEF.md were read. I inspected all 165 question-family status/remaining-question entries across the five coverage files. Unread legacy candidates were not granted adequacy credit.

## Findings and closure

Line references below are to candidate 2 unless explicitly described as the earlier wording. Canonical paths and complete hashes are in the manifests.

| Finding | File and location | Problem independently found | Required correction and current result | Meaning preservation |
|---|---|---|---|---|
| C01, closed | src/content/columns/064-taiwan-warning-account-foreigners.md:4,15,34,36 | The earlier general release explanation omitted the emergency-notification exception and could imply that original-issuer withdrawal or ordinary expiry were the only routes. | Current text retains the general rule and states that the written document must reach the bank within five business days after emergency notice; if it does not, the bank must contact the original issuer and lift the warning. [FSC management rules, Article 3(3)](https://law.fsc.gov.tw/LawContent.aspx?id=FL039015). | Mandatory action, arrival requirement, business-day unit and original-issuer contact are preserved. No free-standing discretionary bank-release promise was introduced. |
| C02, closed | KO064:52,54,56,62,64,66 | The earlier pre-2025-04-01 return explanation lost the contacted-but-refusing holder route and needed a clearer distinction between optional police location assistance and the separate new regime. | The current text distinguishes old notification dates through 2025-03-31, optional one-month location assistance for an unreachable holder, Article 11(6)'s refusing-holder route, and the post-2025-04-01 written police notice/documents rules. It retains complex/disputed-case exclusions and prior attachment/order priority. [FSC Article 11](https://law.fsc.gov.tw/LawContent.aspx?id=FL039015), [anti-fraud rules Articles 52–55 and 69](https://law.banking.gov.tw/Chi/FLAW/FLAWDAT0202.aspx?lsid=FL104315). | Separate date regimes, may/must distinctions, unwithdrawn-balance limit, exclusions and priority remain intact. The Article 55 shorthand now names the correct regulation. |
| C03, closed | src/content/columns{,-zh,-ja,-en,-vi}/403-taiwan-non-prosecution-reconsideration-deadline.md:60 | An important arrival-versus-postmark proposition had an inline official link but no corresponding end-source entry. | The five source lists now include the exact [Taipei District Prosecutors Office notice](https://www.tpc.moj.gov.tw/292885/976681/661783/1088793/post). The full-text diff is source-list-only. | Deadline, party eligibility, original/superior prosecutor route and later court remedy are unchanged. |
| C04, closed | src/content/columns-ja/430-taiwan-assault-injury-threat-complaint-japanese.md:41 | Earlier “再び告訴できるとは限らない” made a statutory bar sound uncertain after a valid withdrawal. | The current sentence says that the withdrawing complainant cannot complain again in the same matter even if settlement money is not paid, while another independent complaint holder is assessed separately. [CPC Article 238(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=238) is linked inline and in the source list. | Ordinary complaint-dependent injury context, valid withdrawal, same withdrawing person, nonpayment and distinct independent holders are preserved. JA402 link remains. |
| C05, closed | src/content/columns-vi/438-taiwan-assault-threats-evidence-complaint-deadline.md:57,61 | Earlier “rút hợp lệ có thể không làm lại được” similarly weakened the valid-withdrawal bar. | The current paragraph expressly limits the rule to complaint-dependent offenses, says that the person who validly withdrew may not file that complaint again even after nonpayment, and treats another independent holder separately. [CPC Article 238(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=238) appears inline and in sources. | No universal bar on all offenses or all persons was introduced; the settlement/deadline distinction and VI402 link remain. |
| C06, closed | src/content/columns-vi/439-taiwan-criminal-judgment-appeal-vietnamese.md:55,63 | Two links for the prosecutor's own service-date clock went to a moving FAQ index whose opened content did not contain that answer. The legal proposition itself was correct. | Both now point to the exact [Judicial Yuan answer on prosecution appeals and victim requests](https://www.judicial.gov.tw/tw/cp-1303-2634-5b35b-1.html), independently opened and checked by C. | Text is unchanged: a victim's receipt date can differ, a request does not guarantee an appeal, and the prosecutor's own service date governs that appeal clock. |

Current correction hashes:

- KO064: 02f66cb91ce52362d50cbdbb8e8e34b48cf54ed9fe919570bfe83b8ea58044e2
- EN355: 001ac9275512d3860126e615b2a4d11f8037cb2eb73eede1a7e081c3d06a95be
- JA430: 01059e240f9b83143987658d98391379c5f68508c7794b42a5b0b92e77f92a4f
- VI438: 0256b302f8820ec741ef43c64feab47cd02d00081bf9ea24cf69c8c7d77442be
- VI439: 04b5c45c07740b102b4bd7c1926d939047b2228e62d2e387fe905693ae0fec71

## Legal-source scope

I used current official web sources directly, rather than relying only on the writers' downloaded artifacts. [final-primary-source-evidence.json](./final-primary-source-evidence.json) retains 102 URL-keyed retrieval entries and eight compound evidence responses; [final-primary-source-supplement.json](./final-primary-source-supplement.json) preserves the last agency checks. The earlier [primary-source-verification.json](./primary-source-verification.json) supports the original-board audit. Retrieval counts are evidence bookkeeping, not a claim that every proposition in every retrieved page was reviewed.

The principal checks included:

- Complaint clocks and holders: CPC 232–242, especially the six-month knowledge-of-offender rule, independent holders, first-instance-debate withdrawal boundary, same-withdrawer bar and joint-offender effects. Assault provisions retain the Criminal Code 287 public-official-on-duty exception. Spousal sexual-offense provisions and the under-18 actor rule under 229-1 are not turned into a six-month rule for every sexual offense.
- Nonprosecution and appeal: complainant status is distinguished from victim/reporting status; CPC 256/258-1 remedies, original-office filing, ordinary 20-day appeal, ordinary-reasons supplement, summary-judgment appeal and its requested-sentence bar remain distinct. The prosecutor's own service clock is not replaced by the victim's clock.
- Arrest, detention, searches and seized property: arrest-time exclusions, appointed-lawyer exception conditions, detention grounds/necessity, conditional detention duration, bail and revocation, contact restrictions and lawyer communication are kept separate. CPC 133/142/219-1 and 404/416 routes were checked in the legacy set. A seizure receipt or closed case is not treated as an automatic return order.
- Deferred prosecution, suspended sentence and execution: eligibility, finality-based periods, consent-required duties, discretionary versus mandatory revocation and remedy routes were checked against their respective provisions. Criminal fines, conversion to a fine, default labor and community service are not merged. The [Taichung execution procedure](https://www.tcc.moj.gov.tw/295804/295815/295820/422111/) was checked for the legitimate-reason/qualifying-relative route and permission-based installments.
- Sexual-assault support: medical refusal restrictions, consent and its exceptions, professional reporting duties, accompaniment, privacy, remote testimony and closed-hearing conditions were checked against the current Sexual Assault Crime Prevention Act. VI443's worker housing language preserves local-government confirmation/assessment, as stated in the [WDA guidance updated 2026-09-16](https://fw.wda.gov.tw/wda-employer/home/file/2c95efb391dd88140191ded375cf0112).
- Narcotics/CBD: substance, conduct, purity thresholds, treatment/deferred-prosecution routes and immigration consequences were checked separately. EN355 retains the limited plant-material/THC schedule conditions, rather than a general low-THC exemption. The [TFDA FAQ updated 2026-09-09, Q16](https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f639245467983366472&iid=11974&type=3) confirms the current approved-CBD-medicine statement, separate medicine documentation and food/cosmetics restriction. The 2026-01-19 cosmetics notice was checked separately.
- Theft/found property, compensation, speech and records: intent and family exceptions; civil limitation/attached-civil timing and transfer costs; 112憲判字8/113憲判字3 context; and police-certificate omission/refusal rules were checked. Omission from a certificate is not described as erasing a conviction, and a criminal allegation is not treated as automatically cancelling every foreigner's residence.

Dates in the articles are check dates, not new effective dates for every cited provision. The current Chinese statutory text and applicable commencement provisions control. The pre/post-2025-04-01 banking regimes and the dated TFDA/WDA materials were specifically distinguished.

## Editorial and static interface checks

No MONOTONY rejection remains in the examined candidate. I assessed the sentence-variety rule's section 5 manually in addition to the tool, including openings, short-sentence rhythm, paragraph functions, repeated conditional framing and topic-specific endings. Necessary legal conditions were not rejected merely for being conditional.

[candidate2-variety-results.json](./candidate2-variety-results.json) records 34 current-hash runs: the 32 new KO/ZH/JA/EN articles plus KO064 and EN355. Every run exited 0 and explicitly reported no violated variety limit. The eight new Vietnamese articles were read and manually assessed; the tool is not validated for Vietnamese, so no Vietnamese metric PASS is claimed. Earlier supported-locale checks of the original board are retained separately.

[candidate2-static-checks.json](./candidate2-static-checks.json) records zero bold markup matches across the 42 new/repaired articles, all 43 native-locale internal article links resolving, and all 67 candidate hashes matching. [candidate2-legacy-hash-continuity.json](./candidate2-legacy-hash-continuity.json) establishes continuity for the original20 + KO064.

I read the board page and helper, native locale loader behavior, Vietnamese UI data and the relevant archive/detail/topic/navigation changes. Static review found no remaining locale-body fallback, tag-selection or board-return issue in these changes. Search/reset/count/empty text and Vietnamese detail labels are native to their routes; rendered structured-data item selection follows the visible results. AI attribution is preserved. This was static inspection, not my execution of an interactive browser session.

## Coverage still open

The first eight articles per language are a release batch, not completion of the 33-family floor. The coverage files explicitly retain material unanswered questions. In particular, publication of this batch must not clear intimate-image offenses, trafficking/exploitation, juvenile/special-victim handling, the ordinary trial process, general eligibility/limitation analysis, higher/extraordinary remedies, victim participation/compensation, and post-final recovery merely because related titles or brief references exist. Locale-specific offense gaps also remain; a language with one good drug, speech or theft article does not prove full family coverage in all five languages.

My original [LEGACY-AND-COVERAGE-REVIEW.md](./LEGACY-AND-COVERAGE-REVIEW.md) identified six important additions beyond a mechanical 33-row checklist: immediate habeas review, formal evidence preservation, no-fault procedural deadline restoration, wrongful-detention compensation, conditional witness protection and the boundaries of perjury/false accusation. These should be carried through the later coverage work. Some current lane inventories now recognize parts of them; that recognition is not itself a substantive article review or proof of completion.

These gaps do not require holding this accurate, explicitly bounded batch. They do prevent declaring the user's broad criminal-coverage goal fulfilled.

## Supplied technical evidence and limits

The primary agent supplied completion of npm run qa and its terminal exit 0. I read the relevant end of reviews/first40-qa-r2.log: 1,410 test files passed; 14,088 tests passed, 14 skipped and one todo. The parent reports typecheck, lint and security-route checks passed. The guard summary records four comment-allowlisted mutation handlers; passing the gate does not mean those exceptions vanished.

I inspected reviews/browser-dev/results.json, which records passed=true, 10 desktop/mobile board flows, 49 article checks, 10 archive flows and no browser errors. These were the primary agent's standalone Playwright checks, not C-run checks. The in-app-browser endpoint was unavailable and the parent used the documented fallback.

Before this report was finalized, the parent supplied clean production-build completion with terminal exit 0 in reviews/first40-build.log. I inspected its success/static-page markers. The existing ContactEditorial.module.css autoprefixer start/flex-start warning remains nonfatal. Built-server smoke and final viewport checks remained with the primary agent. Those are release-owner gates. This report authorizes no deployment on its own and makes no claim about production behavior.

Conclusion: candidate 2 passes my independent scoped content review. Any subsequent substantive article or UI change requires a hash delta and review of the affected scope; unchanged evidence need not be repeated.
