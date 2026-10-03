# C4 English — final review, round 2

VERDICT: FIX

Reviewer: GPT-6 Astra (fallback reviewer). Review date: 2026-10-03.

M1 and M3 are resolved. M2 remains a publication blocker: the operator added six correct judgment links, but several passages and all three timeline rows still lack the required local citations. The revised summary is exactly 160 characters and passes the stated 150–160-character requirement. No new factual or legal defect was found. No column edits were applied in this round.

## Scope checked

Read the two briefs, the entire current column, the writer's fact sheet, both complete judgment texts (including the indictment attached to 344 and the appeal notices), and `cases/statutes.md` with shell tools. Read the complete round-one log and compared the current column with `drafts/C4/en.pre-manual-fix.md`.

The saved pre-manual-fix column has SHA-256 `2a9cc151bc330f6e507b8ff1a0ef1cbeb625891f8d9b571268f2f5ee205437ec`, matching the reviewed round-one column. The operator changed lines 3, 28, 36, 38, 50, 64, 68, 80 and 102; line numbering is otherwise unchanged. All four round-one minor edits remain intact.

Checked facts directly against `cases/jud/55.txt` and `cases/jud/344.txt`, not against the fact sheet's conclusions. The fact sheet still repeats the old M1 inference that the High Court made no new factual findings; that stale statement was not used as authority and was left untouched under the write restriction.

Criminal Code Article 33 is absent from the supplied statutes file. The only network request was for its [official single-article text](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=33), as authorized. Its ordinary imprisonment minimum and detention range support the column; its adjustment exceptions make the retained word “ordinarily” necessary. The other six cited articles were checked against the local statute texts. Judgment URLs were compared with the exact supplied URLs, without fetching the judgments online.

The global `~/agent-library/knowledge/editorial-voice.md` remains unavailable at its stated path; the full project copy, `brief-EDITORIAL-VOICE.md`, was read and applied. The workspace provides only two other English drafts and no verified sequence of three previously published English columns. That cross-publication voice comparison remains outside the verifiable scope; no prohibited website lookup was made. Expected media placeholders were ignored as instructed.

## M1 — Resolved: findings on a sentence-only appeal

원문/Original → Round one, line 38: “The High Court did not turn it into findings of fact, since the facts were not under appeal.”

problem & reason → The old sentence wrongly suggested that the limited appeal prevented factual assessment for sentencing. Section I of judgment 55 leaves the offence findings and classification unchanged; III(1) and III(2) nevertheless accept mutual lane competition and close driving as sentencing facts.

fix (applied by operator; verified) → The current paragraph distinguishes the unchanged offence findings from the High Court's acceptance, for sentencing, that both drivers competed for the lane and prevented overtaking. It retains the attribution of the detailed sequence to the truck driver, accurately translates “相符” and “尚屬有據,” and has the correct adjacent High Court citation. “Without expressly adopting every detail” appropriately limits the detailed account without denying the court's actual finding.

facts/conditions preserved → Sentence-only appeal; unchanged offence and guilt findings; attributed times, durations and vehicle movements; mutual conduct accepted for sentencing; no conviction of the taxi driver, civil-liability ruling or fault percentage.

## M2 — Major, still open: incomplete local judgment citations

원문/Original → Representative unchanged passages include line 24, “The truck driver was sentenced to four months' imprisonment. The High Court later replaced that with 40 days' detention”; line 44, “Prosecutors indicted him on 2 September 2024”; the three unlinked table rows at lines 72–74; and line 82, “an appeal may be filed within 20 days of service.” These passages have no adjacent judgment citation. The two block quotations also still end without their own local citation.

problem & reason → Series hard rule 2 requires linked court, case number and date immediately after the supported claims. The added citations correctly support their own paragraphs at lines 28, 36, 38, 50 and 64, and the traffic-notice statement at line 80. They do not complete the remaining placements identified in round one. A statute link does not establish this prosecution's date, the courts' actual reasoning or an appeal notice. The complete Sources list and citations in later paragraphs do not replace the required local support.

fix (required; not applied) → Complete the placements below using these exact source labels and URLs:

- J344: [New Taipei District Court, 113年度審訴字第716號, 6 March 2025](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=PCDM%2C113%2C%E5%AF%A9%E8%A8%B4%2C716%2C20250306%2C1). This text contains the attached indictment, 113年度偵字第38619號, dated 2 September 2024.
- J55: [Taiwan High Court, 114年度上訴字第5567號, 14 January 2026](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=TPHM%2C114%2C%E4%B8%8A%E8%A8%B4%2C5567%2C20260114%2C1).

“J344” and “J55” below are review-log shorthand; the public column needs the full linked labels above.

| Column location and original fragment | Remaining problem | Required placement |
|---|---|---|
| 20: “At about 3:10 pm on 22 February 2024 …” | Opening route, turns, sign and accepted initial cut-in have no citation in their paragraph. | Add J344 and J55 at the paragraph end. |
| 24: “four months' imprisonment … 40 days' detention … had not settled” | The sentence comparison and settlement status depend on both judgments. | Add both judgments at the paragraph end. |
| 30–34: “from 3:07:56 to about 3:08:08 pm” and the following screenshot quotation/translation | The next paragraph's police-account citation is not directly attached to this quotation and timestamp description. | Add J55 after the translation at line 34. |
| 40: “The judgments do not say whose camera …” | Only J55 is linked although the asserted absence is about both texts; J344 contains the evidence list requiring inspection. | Add J344 alongside the existing J55 citation. |
| 44: “Prosecutors indicted him on 2 September 2024 … charged as a single offence” | The two statute links cannot support these case-specific prosecution claims. | Add J344, including its attached indictment, at the paragraph end. |
| 52: “The cut-ins and the hard braking were his.” | The engagement paragraph starts with a factual attribution. | Place J55 after that sentence, retaining the single reader question. |
| 56: “The court's discretion is bounded by proportionality, equality …” | Article 57 alone does not supply this account of the High Court's reasoning. | Add J55 at the paragraph end. |
| 58–62: “the victim should also bear some responsibility …” | The mutual-conduct account and direct quotation still lack a citation immediately after the translated block. | Add J55 after line 62's translation; retain the new citation at line 64 for that separate paragraph. |
| 66: “largely mirrors the first court's list” | J55 alone supports the appellate list, but not the comparison with the first judgment. | Add J344 alongside the existing J55 citation. |
| 68: “Both courts chose the lowest rate. Converted in full, 40 days comes to NT$40,000.” | Articles 33 and 41 explain the law, not the conversion orders actually made. | Add both judgments after these case-specific statements. Keep the calculation conditional. |
| 72: indictment table row | No linked source for the indictment date, number or charges. | Add a full J344 source citation in the row, making clear that the indictment is attached to that judgment. Do not relabel the judgment URL as a separate indictment URL. |
| 73: first-instance table row | No linked judgment source. | Add the full J344 citation in the row. |
| 74: sentence-appeal table row | No linked judgment source. | Add the full J55 citation in the row. |
| 78: “Neither judgment mentions … any civil claim for damages” | The appeal limits and absence claims have no local judgment support. | Add both judgments at the paragraph end. |
| 80: “the judgments … Neither court applied it” | The new J344 link supports the notice evidence; the statements about both judgments also require J55. | Add J55 alongside J344, retaining Article 43's separate background link and label. |
| 82: “within 20 days of service” | The appeal notice and limits of this sentencing decision have no local judgment citation. | Add J55 at the paragraph end. |
| 86: “The investigation file that supported the charge also showed the taxi” | The conclusion combines the indictment's evidence list with the High Court's screenshot assessment. | Add both judgments at the paragraph end. |
| 88: “at the ramp entrance, with a lane sign …” | The separate concluding factual paragraph is uncited. | Add J55 or J344 at the paragraph end. |

These are source-placement and source-coverage corrections within the same unresolved M2, not findings that the underlying facts are false. A single citation at the end of a coherent paragraph or quotation block is sufficient; individual sentences within that supported block need not each repeat it.

facts/conditions preserved → All facts, Chinese quotations, translations, dates, figures, sentence types, statutory conditions, attribution and unknown appeal history remain unchanged. Use the existing correct URLs. No substantive rewriting or new source claim is required. The reviewer did not apply these major corrections.

## M3 — Resolved: Article 33 background label

원문/Original → Round one, line 68 introduced Article 33 without identifying it as background; its Sources entry was also unqualified.

problem & reason → Neither supplied judgment expressly cites Article 33. Series hard rule 5 requires the column to distinguish its explanatory statutory background from the courts' stated reasoning.

fix (applied by operator; verified) → Line 68 now says “As statutory background (neither judgment cites it expressly),” and line 102 labels the source “background explanation of penalty types; not expressly cited in either judgment.” Both statements match the primary texts. The paragraph does not incorrectly say that the courts declined to apply Article 41.

facts/conditions preserved → Distinct imprisonment and detention penalties; ordinary ranges and the “ordinarily” qualification; Article 41's eligibility, rates and exception; the actual conversion orders and conditional NT$40,000 total. The remaining case-citation placement in this paragraph belongs to M2, not M3.

## Whole-column recheck

### Facts and legal meaning

| Claim group | Direct-source result |
|---|---|
| Opening and freeway conduct | Both judgments support approximately 15:10 on 22 February 2024; the named roads in Linkou District; opposite approaches and left/right turns; the ramp sign, knowledge and initial cut-in; then four freeway cut-ins, three hard-braking incidents, parallel driving and automatic-braking activation. No accident or injury is invented. |
| Screenshots and attributed account | J55 III(1) supplies approximately 15:07:56–15:08:08, a roughly 12-second interval. The driver's approximately 15:07 arrival, black Mercedes taxi, shoulder approach, approximately 30 seconds, one to two minutes, large truck and three to five overtaking moves remain expressly his account. The interval is not presented as the duration of the entire incident. |
| Evidence and procedure | J344 and its indictment support the evidence list, two notice copies, police referral, initial denials, later admissions, simplified procedure and 2 September 2024 indictment. They do not identify the recipients or provisions of the notices. Neither judgment expressly identifies the screenshots' camera or a separate technical basis for automatic braking. |
| Offences and outcomes | Articles 185(1) and 304(1), punishment under the heavier offence and the single continuing course of conduct are supported. J344 orders four months' imprisonment; J55 replaces only the sentence with 40 days' detention. Both allow conversion at NT$1,000 per day. NT$40,000 is correct arithmetic, conditional on full conversion, not a payment proved to have occurred. |
| Resentencing | J55 III(1)–(2) supports mutual lane competition, close driving to prevent overtaking, the taxi driver's partial responsibility for the dispute, and the first court's omission. Article 57 items 1, 2 and 8 match motive, provocation and breach of duty. Both judgments record admission and no settlement. |
| Statutory figures and conditions | Article 185(1)'s five-year maximum and NT$15,000 fine, Article 41's NT$1,000/2,000/3,000 rates, eligibility and exception, and Article 348(3)'s sentence-only appeal are accurately described. Article 33's ordinary ranges are supported by the fetched official text. |
| Administrative and civil limits | Article 43's NT$6,000–36,000 range, immediate driving prohibition and six-month plate suspension match the supplied text. The column labels this background and does not report an administrative penalty as actually imposed. Neither judgment adjudicates a civil damages claim or assigns a numerical fault share. The taxi driver's sentencing relevance is not converted into a conviction of that driver. |
| Appeal status | J55's notice allows an appeal within 20 days of service. Later appeal history is left unknown, and the column does not claim finality or guarantee the same reduction in other cases. |

### Citations and series rules

- Both judgment URL strings match the supplied packet exactly. Courts, docket numbers and dates are correct. The High Court's 114年度 docket and 14 January 2026 judgment date are consistent; J344's decision date is 6 March 2025, not its later clerk-certification date.
- All seven statute identifiers are correct: Criminal Code Articles 33, 41, 57, 185 and 304 (`C0000001`); Code of Criminal Procedure Article 348 (`C0010001`); Road Traffic Management and Penalty Act Article 43 (`K0040012`). Both judgments and all seven articles appear in Sources. M2 concerns local placement and coverage, not wrong destinations or an incomplete end list.
- All nine Chinese quotation fragments match the primary texts verbatim. Their English translations preserve the meaning and attribution.
- No private-party names, exact private addresses, house numbers, prohibited personal circumstances, phone numbers, sales CTA, bold Markdown or bold HTML appear. Road names are supported by the judgments; “taxi driver” identifies the participant's role in this incident.
- The author remains `legal-ai-assistant`; the final English AI-disclosure line remains present with the 3 October 2026 source-check date. No lawyer-review or human-native-review claim appears.
- Criminal punishment, administrative penalties and civil damages remain distinct. Articles 33 and 43 are labelled as background. There is no foreign-law comparison.
- `ALT_TBD` and `CAPTION_TBD` remain expected placeholders. This review makes no claim about completed media or finished media captions.

### Summary and English voice

The actual frontmatter summary contains 160 ASCII characters, including spaces and punctuation, excluding the YAML quotation marks. It accurately retains four cut-ins, three braking incidents, the Linkou setting, the sentence reduction and the taxi's competing conduct. It introduces no new event or legal conclusion. The frontmatter title and H1 match.

The first-two-paragraph deletion test was repeated sentence by sentence:

| Sentence | Information lost if deleted |
|---|---|
| Paragraph 1, sentence 1 | Date/time, vehicles, district, road and opposite directions. |
| Paragraph 1, sentence 2 | Junction, respective turns and shared northbound interchange entrance. |
| Paragraph 1, sentence 3 | The ramp sign's instruction. |
| Paragraph 1, sentence 4 | Judicial acceptance of knowledge, sign violation and initial cut-in. |
| Paragraph 2, sentence 1 | Freeway location, four cut-ins, three hard-braking incidents and forced yielding. |
| Paragraph 2, sentence 2 | Automatic-braking activation. |

All six sentences convey information immediately. The title is long but specific, non-imperative and supported. “Brake checks” fits the intentional obstructive conduct described in the judgments. The narrative has a clear sentencing turn, one reader-engagement question, active English and no checklist structure, invented professional experience or sales ending. No further wording edit was necessary for this round.

## Minor edits applied

None. `drafts/C4/en.md` was left unchanged. The operator's M1/M3 fixes, six added judgment links and shortened summary were reviewed, not authored in this round. Round-one E1–E4 remain intact.

## Verification and write scope

- Read-only checks confirmed the 160-character summary, matching title/H1, exact judgment URLs, seven statute identifiers, complete source list, nine exact Chinese quotations, author, disclosure and absence of forbidden bold markers or party names.
- Reviewed column SHA-256: `00dbab6c1b9cd09cb4ec1575c6969b01f554ba8dd77ea4e42313962dd58b3ddc`.
- Compared the workspace's Markdown/text file hashes before and after the review write. The only added or changed file was this round-two log; the column, briefs, fact sheet, judgments, statutes, backup and round-one log were unchanged.
- No major correction was applied. No publication was performed. M2 must be completed and checked before the column is publishable.
