# C4 English — final review, round 3

VERDICT: PASS

Reviewer: GPT-6 Astra (fallback final reviewer). Review date: 2026-10-03.

All 18 placements in the round-two M2 table are complete. M1 and M3 remain resolved. No factual, legal, citation or other hard-rule blocker remains in the reviewed column. No column edits were necessary or applied.

## Scope checked

Read fully with shell tools: `brief-SERIES.md`, `brief-EDITORIAL-VOICE.md`, `drafts/C4/en.md`, `drafts/C4/en.facts.md`, both complete judgments (`cases/jud/55.txt` and `cases/jud/344.txt`, including the attached indictment and appeal notices), `cases/statutes.md`, the pre-change copy `drafts/C4/en.pre-manual-fix-r2.md`, and `reviews/C4/en-astra-r2.md`.

Checked the facts against the judgments themselves, then citations, series rules and English voice. The fact sheet still contains the superseded assertion that the High Court made no new findings of fact; that assertion was not used as authority. The corrected column accurately distinguishes unchanged offence findings from factual assessment for sentencing. The fact sheet was left untouched under the write restriction.

Criminal Code Article 33 is absent from `cases/statutes.md`. The only network request in this review fetched its [official single-article text](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=33). Its ordinary imprisonment minimum and detention range support the column; the retained “ordinarily” qualification preserves the existence of adjustment exceptions. The other six cited articles were checked against the supplied statute texts. Judgment destinations were checked against the exact URLs supplied by the user, without fetching the judgments online.

The global `~/agent-library/knowledge/editorial-voice.md` is unavailable at its stated path. The complete project copy, `brief-EDITORIAL-VOICE.md`, was read and applied. Openings, headings and endings were also compared with the two other local English drafts, C2 and C3. The workspace does not establish a sequence of three previously published English columns, so that specific cross-publication comparison cannot be certified. Expected media placeholders were ignored as instructed; this review does not certify finished media or captions.

## Exact change verification

The pre-change copy has SHA-256 `00dbab6c1b9cd09cb4ec1575c6969b01f554ba8dd77ea4e42313962dd58b3ddc`, exactly matching the column fingerprint in the round-two log.

An in-memory reconstruction applied the 18 M2 placements to that copy. The result was byte-for-byte identical to the current column. The complete diff contains only:

- Citation additions or expansions on original lines 20, 24, 40, 44, 52, 56, 66, 68, 72, 73, 74, 78, 80, 82, 86 and 88.
- Two new attribution paragraphs after the original quotation translations at lines 34 and 62: “That description comes from the High Court's account of the screenshots” and “Those are the High Court's words,” each followed by the full High Court citation.
- The attachment explanation in the indictment row and full dated judgment labels in the two judgment rows, as required by M2.

There are 25 added judgment links, increasing the total from 13 to 38. All existing narrative wording, facts, figures, quotations, translations, statutory links, conditions and legal qualifications are preserved. Frontmatter, Sources and the final disclosure are byte-for-byte unchanged. The two attribution sentences and the table attachment explanation are part of the citation repair, not unrelated changes. No changes outside M2 were found.

## M2 — Resolved: all local citation placements

원문/Original → The pre-change column left the opening, sentence comparison, two quotation blocks, three timeline rows and other passages identified in the round-two table without complete adjacent judgment support.

problem & reason → Series hard rule 2 requires linked court, case number and date locally attached to the supported claims. A later paragraph's citation, a statute link or the final Sources list did not remedy those omissions.

fix (applied by operator; verified) → Every required placement is now present, as mapped below. J344 and J55 are shorthand in this log only; the column uses the full linked labels. J344 is New Taipei District Court, 113年度審訴字第716號, 6 March 2025. J55 is Taiwan High Court, 114年度上訴字第5567號, 14 January 2026.

| Round-two location and claim | Current line | Verified local support |
|---|---:|---|
| 20: opening route, turns, ramp sign and initial cut-in | 20 | J344 + J55 at paragraph end |
| 24: four months, 40 days and no settlement | 24 | J344 + J55 at paragraph end |
| 30–34: screenshot interval and translated quotation | 36 | J55 in the attribution immediately following the quotation block |
| 40: unidentified camera and braking evidence | 42 | J344 added alongside J55 |
| 44: indictment date and prosecution's legal treatment | 46 | J344 at paragraph end; attached indictment is the primary support |
| 52: truck driver's cut-ins and braking | 54 | J55 immediately after the factual sentence, before the reader question |
| 56: limits on sentencing discretion | 58 | J55 at paragraph end, alongside the separate Article 57 link |
| 58–62: mutual conduct and partial-responsibility quotation | 66 | J55 immediately after the translated quotation; the separate following paragraph retains its own citation |
| 66: appellate sentence and comparison with first-instance factors | 70 | J344 added alongside J55 |
| 68: both conversion orders and conditional NT$40,000 calculation | 72 | J344 + J55 after the case-specific statements |
| 72: indictment row | 76 | Full J344 link, expressly identifying the indictment as attached to that judgment |
| 73: first-instance row | 77 | Full J344 link |
| 74: sentence-appeal row | 78 | Full J55 link |
| 78: limits on the appeal and absence of civil/other determinations | 82 | J344 + J55 at paragraph end |
| 80: traffic notices and non-application of Article 43 | 84 | Original J344 notice citation retained; J344 + J55 after the paragraph's final statement |
| 82: 20-day appeal notice and limits of the outcome | 86 | J55 at paragraph end |
| 86: investigation evidence and taxi's conduct | 90 | J344 + J55 at paragraph end |
| 88: ramp sign in the concluding factual paragraph | 92 | J344 + J55 at paragraph end |

facts/conditions preserved → All pre-existing facts, numbers, statutory conditions, quotation text and translations remain unchanged. The indictment link is not represented as a separate indictment URL. The screenshot interval remains about 12 seconds, not the duration of the entire incident. The conversion total remains conditional, and later appeal history remains unknown.

## M1 — Remains resolved: findings on a sentence-only appeal

원문/Original → The former assertion that the High Court did not turn the driver's account into findings of fact because the facts were not under appeal.

problem & reason → Limiting the appeal to the sentence left the offence findings unchanged but did not prevent the High Court from assessing facts relevant to sentencing.

fix (previously applied by operator; preserved) → Current line 40 expressly distinguishes the unchanged offence findings from the court's acceptance, for sentencing, of mutual lane competition and close driving to prevent overtaking. It retains the attribution of the detailed sequence to the driver and the accurate translations of “相符” and “尚屬有據.” This paragraph is unchanged from the reviewed round-two copy.

facts/conditions preserved → No implication that the taxi driver was convicted, that civil liability was adjudicated, or that every detail of the driver's account was independently adopted. J55 I and III(1)–(2) directly support the distinction.

## M3 — Remains resolved: Article 33 background label

원문/Original → The former introduction of Article 33 without distinguishing explanatory background from the judgments' express reasoning.

problem & reason → Neither judgment expressly cites Article 33; series hard rule 5 requires background law to be labelled.

fix (previously applied by operator; preserved) → Current line 72 retains “As statutory background (neither judgment cites it expressly),” and the Sources entry retains the matching qualification. Both labels are unchanged from round two and match the judgments.

facts/conditions preserved → Imprisonment and detention remain distinct; ordinary ranges, conversion eligibility, rates, exception and conditional total remain accurate. Article 41 is not incorrectly described as having been rejected or inapplicable.

## Whole-column recheck

### Facts and legal meaning

| Claim group | Direct-source result |
|---|---|
| Date, location and driving | J344's adopted indictment and J55 II support about 15:10 on 22 February 2024; Linkou District and the named roads; opposite approaches and left/right turns; the ramp sign and initial cut-in; four freeway cut-ins, three hard-braking incidents, parallel driving and automatic-braking activation. |
| Screenshot interval and driver's account | J55 III(1) supports approximately 15:07:56–15:08:08, about 12 seconds. The approximately 15:07 arrival, black Mercedes taxi, shoulder approach, approximately 30 seconds, one to two minutes, large truck and three to five overtaking moves remain expressly the driver's account. |
| Evidence and procedure | J344 and its attached indictment support the evidence list, two notice copies, police referral, initial denials, later admissions, simplified trial and 2 September 2024 indictment. Neither text identifies the notice recipients/provisions or expressly links the screenshot camera or a separate technical braking record. |
| Offences and sentences | Both texts support Criminal Code Articles 185(1) and 304(1), punishment under the heavier offence and treatment as one continuing course of conduct. J344 orders four months' imprisonment; J55 replaces only the sentence with 40 days' detention. Both orders allow conversion at NT$1,000 per day. |
| Sentencing reasoning | J55 III(1)–(2) supports the taxi driver's partial responsibility for the dispute, the first court's omission, mutual lane competition and close driving. Article 57 items 1, 2 and 8 correspond to motive, provocation and degree of breach of duty. Both judgments record admission and no settlement. |
| Statutory limits and arithmetic | Article 185(1)'s five-year maximum and NT$15,000 fine; Article 41's NT$1,000/2,000/3,000 rates, eligibility and exception; Article 348(3)'s sentence-only appeal; and Article 33's ordinary ranges all match the checked texts. 40 × NT$1,000 = NT$40,000 is correctly conditional on full conversion. |
| Administrative and civil matters | Article 43's NT$6,000–36,000 range, immediate driving prohibition and six-month plate suspension match the supplied statute. The column labels this as background and does not assert that those sanctions were imposed. Neither judgment awards civil damages or assigns a numerical fault share. |
| Appeal status and limits | J55's notice allows an appeal within 20 days of service. The column does not claim finality or supply an unsupported later appeal outcome, and it does not promise the same sentence reduction in every case. |

No invented accident, injury, damages item, payment, motive or private-party background was found. The summary and title are supported by the same primary facts. All nine Chinese quotation fragments match the primary texts verbatim; the English translations preserve meaning and attribution.

### Citations and other hard rules

- All 38 judgment links use one of the two exact supplied URLs. All 36 body citations have the complete correct English court, docket and date labels. The two remaining judgment links are the correctly labelled Sources entries. The 114年度 High Court docket is correctly paired with its 14 January 2026 judgment date; the first-instance date is 6 March 2025, not the later certification date.
- All seven statute links are single-article links with the correct identifiers: Criminal Code 33, 41, 57, 185 and 304 (`C0000001`), Code of Criminal Procedure 348 (`C0010001`), and Road Traffic Management and Penalty Act 43 (`K0040012`). The Sources list covers every cited judgment and statute.
- No private-party names, exact private addresses, house numbers, prohibited personal circumstances, phone numbers, sales CTA or prohibited bold markup appear. The supported road names are not private addresses; “taxi driver” describes the participant's role in this incident.
- The author is `legal-ai-assistant`. The final English AI-disclosure line and 3 October 2026 source-check date remain present. No lawyer-review or human-native-review claim appears.
- Criminal punishment, administrative penalties and civil damages remain distinct. Articles 33 and 43 have explicit background labels. No foreign-law comparison appears.
- The column contains one reader-engagement question, with no imperative title, checklist headings, moralising or fear-based ending. Media placeholders remain the expressly permitted exception in this review.

### English voice and deletion test

The title is specific to the counts of driving manoeuvres and the sentencing issue. “Brake checks” is supported by the intentional obstructive conduct found in the judgments. The prose is active, readable English, with the source-attribution additions serving the quotation blocks. No further wording change is necessary. The local C2/C3 comparison shows different case-specific subheads and conclusions, rather than a repeated checklist structure.

| Opening sentence | Information lost if deleted |
|---|---|
| Paragraph 1, sentence 1 | Date/time, vehicles, district, road and opposite directions. |
| Paragraph 1, sentence 2 | Junction, respective turns and the shared northbound interchange entrance. |
| Paragraph 1, sentence 3 | The ramp sign's instruction. |
| Paragraph 1, sentence 4 | Judicial acceptance of knowledge, sign violation and initial cut-in. |
| Paragraph 2, sentence 1 | Freeway location, four cut-ins, three braking incidents and forced yielding. |
| Paragraph 2, sentence 2 | Automatic-braking activation. |

All six opening sentences deliver information immediately. The unchanged summary is exactly 160 characters, and the frontmatter title matches the H1.

## Minor edits applied

None. `drafts/C4/en.md` was reviewed as received and was not edited. The operator's citation changes were verified, not authored in this round.

## Verification and write scope

- Exact M2-only reconstruction: passed, with no residual difference.
- Fresh read-only checks: correct judgment URLs and labels, seven statute identifiers, complete source coverage, nine exact quotation matches, required metadata/disclosure and absence of prohibited formatting or party names.
- Reviewed column SHA-256: `f218e04bca74e10d3f43abf3e33c1f44d98ed388e336cde46326efb14f6a9dbb`.
- The review's only authored file is this log. The column, briefs, fact sheet, judgments, statutes, backups and earlier review logs remain unchanged by this review. No publication was performed.

No required column correction remains. The reviewed column is publishable under the stated placeholder exception.
