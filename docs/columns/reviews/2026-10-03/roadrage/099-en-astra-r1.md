# C4 English — final review, round 1

VERDICT: FIX

Reviewer: GPT-6 Astra (fallback reviewer). Review date: 2026-10-03.

Three publication-blocking issues remain: the explanation of factual findings on a sentence-only appeal, placement of judgment citations, and the missing background label for Article 33. The core incident details and sentencing figures are supported. Four minor prose edits were applied; none of the required substantive or citation corrections was applied.

## Scope checked

Read in full with shell tools:

- `brief-SERIES.md` and `brief-EDITORIAL-VOICE.md`.
- `drafts/C4/en.md`, including frontmatter, title, table, sources and disclosure.
- `drafts/C4/en.facts.md`. Used as a claim inventory, not as evidence.
- `cases/jud/55.txt`: Taiwan High Court, 114年度上訴字第5567號, 14 January 2026, including the reasons and appeal notice.
- `cases/jud/344.txt`: New Taipei District Court, 113年度審訴字第716號, 6 March 2025, including the attached indictment, 113年度偵字第38619號, dated 2 September 2024.
- `cases/statutes.md` in full; independently matched the column's use of Criminal Code Articles 41, 57, 185 and 304, Code of Criminal Procedure Article 348, and Road Traffic Management and Penalty Act Article 43 to the supplied texts.

Criminal Code Article 33 was missing from the local statutes file. I fetched only its [official single-article page](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=33), as authorized. It confirms the ordinary minimum of two months for fixed-term imprisonment and the ordinary detention range of one day to less than 60 days, with statutory adjustment exceptions. No other network request was made.

The shared file `/Users/son7/agent-library/knowledge/editorial-voice.md` was absent. The full project copy, `brief-EDITORIAL-VOICE.md`, supplied the applicable editorial rules. The required comparison with the three most recently published English columns could not be completed from the supplied workspace: only two other English drafts were available, without a verified publication history. I did not treat those drafts as published comparators or browse the site.

Line references below refer to the reviewed `drafts/C4/en.md`. The minor edits did not change its line numbering.

### Primary-source findings

| Claim group | Result of direct source check |
|---|---|
| Incident date, location, directions and ramp sign | Supported by 55, reasons II(1), and the indictment attached to 344: approximately 15:10 on 22 February 2024; the named roads, Linkou District, opposite approaches, left/right turns, sign, knowledge and initial entry into the outer lane. |
| Freeway conduct and automatic braking | Four cut-ins, three hard-braking incidents, driving alongside, forcing the taxi to yield and automatic-braking activation are in both texts. The column does not invent an accident or injury. |
| Screenshots | 55, III(1), identifies approximately 15:07:56–15:08:08, about 12 seconds. This is not presented as the duration of the entire incident. |
| Driver's detailed account | The black Mercedes, approximately 15:07, approximately 30 seconds, one to two minutes, the large truck and three to five overtaking moves all appear in his police statement quoted in 55, III(1). These details must remain attributed to him; see issue M1. |
| Evidence and procedural history | 344 supports the two traffic-notice copies, statements, dashcam material, evidence photographs, inspection record, police referral, initial denials, later admissions and simplified trial procedure. |
| Charges and conviction | Articles 185(1) and 304(1), one act engaging both offences, punishment under the heavier Article 185(1), and treatment of the repeated conduct as a single continuing course are supported by the judgments and attached indictment. |
| Sentences and conversion | 344 orders four months' imprisonment at NT$1,000 per day if converted. 55 replaces only the sentence with 40 days' detention at NT$1,000 per day. NT$40,000 is correctly presented as a conditional calculation, not a fine proved to have been paid. |
| Reason for resentencing | 55 expressly relies on mutual competition for the lane and close driving that prevented overtaking, identifies the taxi driver's partial responsibility for the dispute, and criticizes the first court's omission. Admission and absence of settlement are recorded at both stages. |
| Statutory amounts and conditions | Article 185(1)'s maximum five years and NT$15,000 fine, Article 41's three conversion rates and exception, and Article 57 items 1, 2 and 8 are accurately described. |
| Administrative and civil limits | Article 43's NT$6,000–36,000 range, immediate driving prohibition and six-month vehicle-plate suspension match the supplied statute and are expressly background. The judgments do not identify the recipients or statutory basis of the two notices, or adjudicate a civil damages claim. No fault percentage or conviction of the taxi driver is supplied. |
| Appeal status | 55 permits an appeal within 20 days of service. The column correctly leaves later appeal history unknown and does not claim finality. |

### Citation and rule checks

- Both judgment URL strings exactly match the required packet URLs. Court names, docket numbers and dates are correct. The High Court's 114年度 docket and its judgment date in ROC year 115 are not a mismatch; the district court judgment date is 6 March, not its later clerk-certification date.
- All seven statute links use the correct `law.moj.gov.tw` single-article identifiers. Both judgments and all seven expressly cited statutes appear in Sources. Completeness of that list does not cure M2's inline-citation problem.
- All nine Chinese quotation fragments match a supplied judgment or statute verbatim. Their English translations were checked against the Chinese; one was smoothed without changing its meaning.
- No private-party names, house numbers, private-party addresses, forbidden personal circumstances, phone numbers, sales CTA, bold Markdown or bold HTML were found. Road and interchange names are supported by the judgments.
- `author: "legal-ai-assistant"` and the final English AI-disclosure line are present. No lawyer-review or human-native-review claim appears.
- The column distinguishes criminal punishment, administrative sanctions and civil liability, and does not make a foreign-law comparison or promise the same sentence in other cases.
- `ALT_TBD` and `CAPTION_TBD` were treated as expected placeholders, as instructed. Their presence is not a review defect; this text review does not certify finished media or media captions.

## M1 — Major: overbroad explanation of findings on a sentence-only appeal

원문/Original → Line 38: “The High Court did not turn it into findings of fact, since the facts were not under appeal.”

problem & reason → The first part can reasonably mean that the court did not adopt every detail of the driver's account. The stated procedural reason is nevertheless too broad. Section I of 55 excludes reconsideration of the first-instance offence facts and offence classification; it does not say that the High Court could make no factual assessment relevant to sentencing. Section III(1) compares the statement with screenshots, finds the mutual-crowding argument supported (“尚屬有據”), and concludes that the taxi driver should bear part of the responsibility for the dispute. Section III(2) incorporates the mutual conduct into the resentencing assessment. The column must distinguish unchanged findings about the offence from facts accepted for sentencing. Its later description of the taxi driver's role does not cure this misleading explanation. The fact sheet repeats the inference, but the primary text does not support it as written.

fix (required; not applied) → Replace the paragraph with wording along these lines: “The detailed sequence above is the truck driver's account to police. The High Court left the first-instance findings on the offence unchanged. For sentencing, however, it accepted that both drivers had competed for the lane and driven close to prevent the other from overtaking. It described his account as consistent (\"相符\") with the screenshots and his claim of mutual crowding as having a basis (\"尚屬有據\"), without expressly adopting every detail of his account.” Add the full linked High Court citation immediately after the paragraph.

facts/conditions preserved → The appeal remains limited to sentence; guilt and offence classification remain unchanged. The detailed timings and sequence remain the defendant's account. The court's actual acceptance of mutual conduct for sentencing remains explicit. No taxi-driver conviction, civil liability finding or fault percentage is added.

## M2 — Major hard-rule failure: citations are not placed with the claims they support

원문/Original → Line 28: “The first-instance judgment adopted the indictment's facts and evidence, adding only the truck driver's admission in court. That evidence included … copies of two traffic violation notices …” The paragraph has no judgment citation. The section's only citation is to the High Court at line 40. Lines 32–38 also contain a quotation, precise timestamps and a detailed attributed account without an adjacent citation. Further examples include the case-specific appeal account at line 50 and the unlinked procedural table at lines 72–74.

problem & reason → Series hard rule 2 requires a linked court, case number and date immediately after the supported claims. The High Court citation at the end of a six-paragraph section is too remote, and it does not independently contain the first-instance evidence list or the statement that the district court added the in-court confession. Those details come from 344 and its attached indictment. Likewise, the Article 348 link proves what the statute permits, not what this appellant actually appealed. Correct links elsewhere and a complete Sources section do not satisfy the specified inline requirement.

fix (required; not applied) → Add full linked judgment citations at the ends of the relevant factual paragraphs and directly after the quotations/translations. In particular:

- Cite 344 after line 28 and the indictment/prosecution analysis at line 44.
- Cite 55 after the screenshot quotation, the attributed police account and the corrected explanation at lines 30–38, and after the case-specific appeal account at line 50.
- Put a 55 citation with the sentencing analysis and quotations at lines 56–64, rather than relying only on the later citation at line 66.
- Link each procedural-table entry to the judgment that supplies it: 344, including its attached indictment, for the first two rows; 55 for the appeal row.
- Give the remaining uncited standalone case-based paragraphs local support: opening scene and sentence comparison at lines 20 and 24; the judicial limits and traffic-notice account at lines 78–80; the appeal notice at line 82; and the concluding case observations at lines 86–88. Use 344 for the notice evidence and both judgments where a comparison is made.

Use the existing correct URLs and preserve the required court/case/date labels. Paragraph-level citations can support a coherent group of claims; no new source or altered factual claim is needed.

facts/conditions preserved → All incident details, quotations, dates, amounts, sentence distinctions and unknowns stay unchanged. This correction establishes the required local claim-to-source relationship; it is not permission to alter or expand the narrative.

## M3 — Major hard-rule failure: Article 33 background is not labelled

원문/Original → Line 68: “Under [Article 33], fixed-term imprisonment (有期徒刑) ordinarily runs from two months, and detention (拘役) from one day to less than 60 days.” The Article 33 Sources entry at line 102 has no background qualification.

problem & reason → Article 33 is an explanatory addition by the column; neither supplied judgment expressly cites it. The provision's ordinary ranges are supported, but the paragraph does not identify this material as statutory background, as series hard rule 5 requires. The explicit background label given to Article 43 does not extend to this separate paragraph. Absence of an express citation in a judgment must not itself be converted into a claim that the court did not apply an underlying provision.

fix (required; not applied) → Introduce the Article 33 explanation as statutory background about the two types of sentence, and mark its Sources entry “background explanation of penalty types; not expressly cited in either judgment.” Retain “ordinarily” and avoid describing the ordinary ranges as exceptionless. Keep the actual sentences and conversion orders attributed to the judgments. Article 41 explains conversion orders the courts actually made; do not state that the courts declined to apply it.

facts/conditions preserved → Two different criminal penalty types, the stated ordinary ranges, adjustment exceptions, both judgments' actual sentences, Article 41's eligibility and exception, and the conditional NT$40,000 calculation all remain intact.

## Minor wording edits applied

### E1 — More direct time wording, line 20

원문/Original → “At about 3:10 on the afternoon of 22 February 2024”

problem & reason → The longer time expression slows an otherwise factual opening.

fix (applied) → “At about 3:10 pm on 22 February 2024”

facts/conditions preserved → Exact date, time of day and the approximation “about”.

### E2 — Clear attribution, line 20

원문/Original → “The truck driver, the courts accepted, knew about the sign …”

problem & reason → The parenthetical attribution interrupts the subject and verb and sounds unnatural.

fix (applied) → “The courts accepted that the truck driver knew about the sign …”

facts/conditions preserved → Attribution to both courts, the driver's knowledge, the sign violation and the initial cut-in.

### E3 — Remove redundant reader instruction, line 52

원문/Original → “It is worth settling on your own answer before reading the court's.”

problem & reason → This tells the reader how to read and adds no fact or question beyond the immediately preceding engagement question.

fix (applied) → Deleted this sentence; retained the question about whether the other driver's conduct should reduce the sentence.

facts/conditions preserved → No factual or legal claim was removed. The single reader-engagement moment remains.

### E4 — Natural translation, line 62

원문/Original → “(the victim should also bear part of the responsibility for this traffic dispute arising)”

problem & reason → “Responsibility for this traffic dispute arising” is awkward English.

fix (applied) → “(the victim should also bear some responsibility for how this traffic dispute arose)”

facts/conditions preserved → The unchanged Chinese quotation, “should also,” partial rather than exclusive responsibility, and responsibility for the dispute's origin. No percentage or separate legal liability was introduced.

Applied-edit list: E1 time phrasing; E2 attribution syntax; E3 deletion of reading instruction; E4 translation syntax. These four edits affect three lines only: 20, 52 and 62.

## Opening deletion test and voice

| Opening sentence | Information lost if deleted |
|---|---|
| Paragraph 1, sentence 1 | Incident date/time, vehicles, district and opposite directions of travel. |
| Paragraph 1, sentence 2 | Junction, respective left/right turns and common northbound interchange entrance. |
| Paragraph 1, sentence 3 | The sign's instruction to left-turning vehicles. |
| Paragraph 1, sentence 4 | Judicial acceptance of the driver's knowledge, sign violation and initial cut-in. |
| Paragraph 2, sentence 1 | Freeway location, four cut-ins, three braking incidents, parallel driving and forced yielding. |
| Paragraph 2, sentence 2 | The taxi's automatic-braking response. |

All six opening sentences carry information. None needs deletion as a generic lead-in. The title is long but specific to the case and non-imperative. “Brake checks” is supported by the intentional obstructive conduct accepted in the judgments. The account has a clear sentencing turn, uses one reader question and avoids a checklist or sales ending. The four edits above address local English naturalness; they do not resolve M1–M3.

## Verification and write scope

- Manually compared the before/after text. Numeric tokens, every URL occurrence and all Chinese text are unchanged.
- All nine Chinese quotations matched the primary texts before the edits and remain unchanged afterward.
- Rechecked the author, final disclosure and forbidden-format/privacy rules.
- Confirmed the two briefs, fact sheet, two judgments and statutes file retained their original SHA-256 hashes.
- Writes were limited to `drafts/C4/en.md` and this review log. No judgment, statute, fact sheet, other draft or media file was edited. No publication was performed.
- Reviewed column SHA-256 after minor edits: `2a9cc151bc330f6e507b8ff1a0ef1cbeb625891f8d9b571268f2f5ee205437ec`.

The column requires the three corrections above and another final check before publication.
