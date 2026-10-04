# C5 English — final review, round 1

Verdict: FIX

Reviewer: GPT-6 Astra (fallback reviewer)
Review date: 2026-10-03
Column: `drafts/C5/en.md`
Reviewed column SHA-256: `6e57e49631d411220010c3fa012d06b634532dbfd0e8bf5c7a319a8d52c45693`

Two unsupported vehicle descriptions remain. The review instruction classifies unsupported factual assertions as major and prohibits the reviewer from repairing them directly. The column was therefore left unchanged. The media placeholders and reading time are not blockers.

## Scope checked

Read in full with shell `cat`:

- `brief-SERIES.md` and `brief-EDITORIAL-VOICE.md`.
- `drafts/C5/en.md` and `drafts/C5/en.facts.md`.
- `cases/jud/226.txt`: 臺北高等行政法院高等庭115年度交上字第76號, August 24, 2026.
- `cases/jud/237.txt`: 臺北高等行政法院地方庭115年度交字第54號, May 26, 2026.
- `cases/statutes.md`, with the column's Article 43 explanation checked against that article and the quotations in the judgments.

The factual audit used the judgments themselves, not the fact sheet as authority. It covered the title, summary, narrative, headings, comparison, outcome table, appeal statements, practical conclusion and source labels. Checks proceeded in the requested order: facts, citations, hard rules, then English voice.

The shared path `/Users/son7/agent-library/knowledge/editorial-voice.md` was absent. The complete supplied project editorial-voice brief was read and applied. For the comparison of openings, headings and endings, the available English C2, C3 and C4 drafts were examined; their status as the three most recently published articles was not verified. No network access was used. The cited statute was available locally, so no statutory fetch was needed.

## Issues requiring revision

### 1. Major factual issue: the motorcycle is repeatedly identified as a scooter

원문/Original → “a scooter rider's NT$16,000 fine” (line 3), “A scooter rider said…” (line 40), and subsequent “scooter” descriptions at lines 42, 44, 46, 48, 52, 54, 62, 64 and 66. There are 13 occurrences, including the summary and outcome table.

Problem & reason → `237.txt`, 事實及理由二, identifies the vehicle as “普通重型機車”; the inspection and reasoning call it “系爭機車”. The supplied text establishes a motorcycle but does not identify a scooter body style. “Scooter” narrows the vehicle description beyond the source. A scooter may fall within the stated motorcycle category, but the category does not establish that this particular vehicle was a scooter. The fact sheet supplies no additional primary support for this narrowing. This violates series hard rule 1 and the explicit instruction that unsupported facts are major issues.

Fix (required; not applied) → Use “motorcycle” for the vehicle and “rider” or “motorcyclist” for the person throughout the column, including the summary and table. For example, “A motorcycle rider said…”; “the motorcycle moved right…”; “the court in the motorcycle case…”. Do not add an engine size, make, model or body style.

Facts/conditions preserved → The vehicle remains a motorcycle; the rider's allegations remain allegations; all recorded movements, timestamps, findings, NT$16,000 fine, course requirement, six-month plate suspension, NT$800 costs and appeal limits remain unchanged. Only the unsupported subtype is removed.

### 2. Major factual issue: the reporting vehicle is identified as a car in a heading

원문/Original → “The speed display belonged to the car behind” (line 26).

Problem & reason → `226.txt`, 理由三（一） and 四（二）, refers to “檢舉人行車紀錄器影像” and “檢舉人車輛”. It identifies the penalised leading vehicle as a passenger car and another vehicle as a black SUV, but does not identify the reporting vehicle's type. The heading transfers a specific vehicle type to the reporting vehicle without support. The body correctly uses “following vehicle” and “reporting vehicle”. Series hard rule 1 applies to headings as well as the body.

Fix (required; not applied) → Change the heading to “The speed display belonged to the vehicle behind”.

Facts/conditions preserved → The speed display remains associated with the following/reporting vehicle's footage, not a direct measurement of the leading car's speed. The reported speed change, close following distance and the first court's cautious inference about gradual slowing remain unchanged.

## Remaining factual and legal checks

Apart from the vehicle descriptions above, no additional substantive discrepancy was identified.

| Subject | Verification against primary text |
|---|---|
| Car incident | `226.txt`, 理由一 and 四（二）: June 3, 2025, about 7:14 a.m., Wanhua District; left signal, black SUV, approaching white vehicle and approximately two-second stop. District-only location is retained. |
| Car footage | 理由四（二）: 07:14:42–50 and about 07:14:52–53; later movement across three lanes to the left-turn-only lane; increasing distance from the reporting vehicle and no further stopping or blocking. |
| Speed evidence | 理由四（二）: the displayed speed on the reporting vehicle's footage decreased before the stop. The column avoids treating it as a direct measurement of the leading car's speed and preserves the court's inability to exclude an emergency explanation. |
| Authority's competing chronology | 理由三（一）–（二）: 07:14:50 braking, 07:14:57 right indicator, 07:15:06 leftward movement, and the clear-road/alternative-course argument are expressly attributed to the authority. They are not substituted for the court's accepted account. |
| Car penalties and procedure | 理由一, opening recital, disposition and closing notice: NT$24,000, road-safety course and six-month plate suspension; first-instance cancellation on December 29, 2025, in 114年度交字第2626號; August 24, 2026 appeal dismissal; authority bears NT$750; no further appeal permitted. |
| Bridge incident and allegations | `237.txt`, 事實及理由二–四: November 25, 2025, about 5:13 p.m., Wenshan District. Loud honking, contact, truck pressure, instability and the claimed significance of proposing police involvement remain the rider's submissions. The authority's account is separately attributed. |
| Bridge footage | 五（一）: green signal, right-turn arrow, position in the 機慢車道, 17:13:29–31 lane entry and long horn, 17:13:32 slight braking, 17:13:34 acceleration beside a silver van and short horn, and 17:13:35–38 braking to a stop all match. The following vehicle's leftward passing movement is supported. |
| Emergency and contact | 五（一）–（二）: the court found no visible loss of control requiring an immediate stop; suspected or slight contact did not automatically establish such necessity. The column does not turn the absence of obvious contact into a definitive finding that contact was impossible. |
| Other vehicle and later police proposal | 五（二）: the other vehicle's potentially objectionable route was a separate issue; proposing to call police afterwards did not establish the need to stop immediately on the bridge. |
| Motorcycle penalties and appeal | Disposition, 二, 五（三）–（四）, 六 and closing notice: NT$16,000, course and six-month plate suspension upheld; NT$800 costs; legal-error appeal within 20 days of service. The column makes no claim about whether an appeal was actually filed or the decision became final. |
| Article 43 | Local Article 43 and both judgments support the NT$6,000–36,000 range, on-the-spot driving prohibition and six-month plate sanction. Plates and driving licences are distinguished. Article 43 was applied in these cases, so a background-only label would be inappropriate. |
| Different statements about intent | `226.txt`, 四（一）, expressly connects the provision to malicious dangerous driving; `237.txt`, 五（二）, expressly says malicious or retaliatory intent is not required. The column acknowledges the tension without inventing an overruling or a universal defence. |
| Practical conclusion | `237.txt`, 五（二）, supports gradual slowing, stable control, attention to surrounding vehicles and moving aside or to a safe unobstructive place when immediate stopping is unnecessary. No automatic permission to stop for a particular number of seconds is invented. |

The article reports administrative traffic proceedings. It does not claim a criminal acquittal, imprisonment, a fine-conversion rate or a civil damages award. Those criminal and civil outcome fields are not applicable here.

## Citations and hard rules

- All 20 judgment-link occurrences match the two exact URLs supplied for this review. Decoded judgment IDs, divisions, case numbers and Gregorian dates were checked against the source headers and closing dates.
- Both statute-link occurrences target `https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=43`.
- Inline citations accompany the factual passages. The result table is followed by the citations and explanation identifying the first-instance car result as reported by the appeal judgment. No separate, unseen first-instance text is represented as having been reviewed.
- The sources section contains both supplied judgments and Article 43, the only statute discussed by article number in the column.
- No private-party names, exact addresses, phone numbers, sales invitation, prohibited bold markup, private health/family/income/education/occupation details, or foreign-law comparison were found.
- `author: "legal-ai-assistant"` is correct. The byline and final AI-disclosure line identify AI authorship. There is no lawyer-review or human-native-review claim.
- `read_time: "7 min read"` contains a numeric value; it is not an unresolved `N` placeholder.
- `IMAGE_PATH`, `ALT_TBD` and `CAPTION_TBD` are accepted integration placeholders under the user's explicit instruction. They do not cause this FIX. Integrated media and final captions were outside this text review.
- The title describes this particular evidentiary outcome; the body expressly rejects a general permitted stopping duration. No unsupported finality or general rule is asserted.
- The optional reader-engagement question is not mandatory; its absence is not a defect.

## English voice and deletion test

The title identifies the event and evidentiary issue. The narrative is calm, specific and active, without an imperative title, checklist headings, fabricated dialogue or a generic introductory promise. The three substantive headings follow the speed evidence, the bridge sequence and the difference in the courts' reasoning. The factual defect in the first heading is recorded above.

First paragraph, line 22:

| Sentence | Information lost if deleted | Decision |
|---|---|---|
| “At about 7:14 a.m.…” | Date, time, district, junction/multilane setting and left signal. | Retain. |
| “It let a black SUV pass…” | Yielding to the first vehicle in the adjacent lane. | Retain. |
| “Then a white vehicle approached…” | The next approaching vehicle and approximate stop duration. | Retain. |
| “The motorist following closely behind…” | The reporting party, close following and origin of the footage. | Retain. |

Second paragraph, line 24:

| Sentence | Information lost if deleted | Decision |
|---|---|---|
| “That recording eventually helped undo the penalties.” | The connection between the reporting evidence and the successful challenge. | Retain. |
| “The first-instance court cancelled…” | All three cancelled sanctions and the amount/duration. | Retain. |
| “The traffic authority appealed and lost.” | Identity of the appellant and the appeal outcome. | Retain. |
| “These were administrative traffic proceedings…” | The express procedural boundary against criminal/civil conflation. | Retain. |

C2, C3 and C4 also open with concrete traffic events, as the series requires. C5 does not reproduce their sequence of headings or ending: it centres on two administrative decisions, the footage and their differing statements about intent. Its final substantive paragraph stays with the court's supported alternative to an unnecessary abrupt stop. No separate blocking English-voice issue was identified.

## Minor edits applied

None. The two required changes alter unsupported factual descriptions, so they were not treated as discretionary wording edits. Only this review log was written; the column, fact sheet, briefs and primary-source files were not edited.

VERDICT: FIX
