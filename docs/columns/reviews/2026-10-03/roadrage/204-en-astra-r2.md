# C5 English — final review, round 2

Verdict: PASS

Reviewer: GPT-6 Astra (fallback reviewer)
Review date: 2026-10-03
Column: `drafts/C5/en.md`
Reviewed column SHA-256: `56631cdf5f3a29320d6fbf6e3a5f4c7205197b419105665f238694a91ca63d3e`

The two major factual issues recorded in round 1 have been corrected. No remaining major issue or required minor edit was identified. The current column is publishable under the review instructions, including the express acceptance of the media integration placeholders. The reviewer made no changes to the column.

## Scope checked

Read fully using shell `cat` and, where needed to recover truncated output, `sed`:

- `brief-SERIES.md` and `brief-EDITORIAL-VOICE.md`.
- `drafts/C5/en.md` and `drafts/C5/en.facts.md`.
- `cases/jud/226.txt`: 臺北高等行政法院高等庭115年度交上字第76號判決, August 24, 2026.
- `cases/jud/237.txt`: 臺北高等行政法院地方庭115年度交字第54號判決, May 26, 2026.
- `cases/statutes.md`, checking the article's legal explanation against Article 43 and the statutory quotations in both judgments.

The audit proceeded in the requested order: facts and law, citations, series rules, then English voice. It covered the frontmatter title and summary, headline, narrative, headings, legal explanation, comparison, outcome table, appeal statements, closing advice and sources. The judgments were checked directly; the fact sheet and round-1 review were not treated as substitutes for primary evidence.

The shared `~/agent-library/knowledge/editorial-voice.md` file is absent. The complete project copy, `brief-EDITORIAL-VOICE.md`, was read and applied. The available C2, C3 and C4 English drafts were compared for their openings, headings and endings; their status as the three most recently published articles was not verified. This is an AI editorial review, with no claim of review by a lawyer or a human native speaker.

No network access was used. Article 43 was available locally. Judgment URL identities and statutory article targets were checked against the supplied sources and assigned URLs, not by testing live page availability. Media files, integrated captions and the rendered publication page are outside this text review; the user expressly excludes `IMAGE_PATH`, `ALT_TBD` and `CAPTION_TBD` from blockers.

## Issues and disposition

### 1. Round-1 major issue resolved: unsupported scooter body style

원문/Original → Round 1 used “scooter”, including “a scooter rider's NT$16,000 fine” and “A scooter rider said…”.

Problem & reason → `237.txt`, 事實及理由二, identifies a “普通重型機車”; 五（一）–（二） uses “系爭機車”. These establish a motorcycle, without establishing a scooter body style. The earlier description was narrower than the primary source.

Fix (applied before this review; independently verified) → The current summary, narrative, comparison and table use “motorcycle”, “motorcycle rider” or “the court in the motorcycle case”. A fresh search found no remaining “scooter” occurrence. No reviewer edit was required.

Facts/conditions preserved → The rider's assertions remain assertions, and the court's findings remain findings. Movements, timestamps, the NT$16,000 fine, course requirement, six-month plate suspension, NT$800 costs and appeal limits are preserved. No engine size, make, model or body style has been added.

### 2. Round-1 major issue resolved: unsupported type of reporting vehicle

원문/Original → Round 1: “The speed display belonged to the car behind”. Current line 26: “The speed display belonged to the vehicle behind”.

Problem & reason → `226.txt`, 理由三（一） and 四（二）, identifies the reporting party's dashcam and vehicle, but does not specify that vehicle's type. Identifying it as a car was unsupported.

Fix (applied before this review; independently verified) → The heading now uses “vehicle”, consistent with the body. The unsupported heading is absent. No reviewer edit was required.

Facts/conditions preserved → The display remains attributed to the following/reporting vehicle, rather than presented as a direct measurement of the leading car's speed. Close following, the displayed speed reduction and the first court's cautious inference about gradual slowing remain intact.

### Remaining issues

None requiring revision. The current draft was checked beyond the two corrections; this PASS is not based solely on closing the previous review items.

## Facts and legal meaning

| Column content | Primary-source verification |
|---|---|
| Title, summary and opening car scene, lines 2–24 | `226.txt`, 理由一 and 四（二）: June 3, 2025, about 7:14 a.m., Wanhua District; left signal, black SUV, approaching white vehicle and approximately two-second stop. The report used the following vehicle's dashcam evidence. The title describes this case's failure of proof, not a general permission to stop for two seconds. |
| Car footage, lines 28–30 | 理由四（二）: 07:14:42–50 signal/yield sequence; about 07:14:52–53 approaching white vehicle and stop; later movement across three lanes into the far-left left-turn-only lane; increasing separation and no further stopping or blocking. The displayed speed reduction is associated with the reporting vehicle. The article preserves “could not exclude” an emergency explanation rather than saying an emergency was conclusively proved. |
| Authority's competing account, line 32 | 理由三（一）–（二）: 07:14:50 braking, 07:14:57 right indicator, 07:15:06 later leftward movement, and the clear-lane/continue-and-wait argument. These remain expressly attributed to the authority. 理由二 supports the statement that the appeal judgment refers to the earlier judgment for the parties' first-instance submissions. |
| Car penalties and procedure, lines 24, 36 and 60–64 | Opening recital, 主文, 理由一、四–六 and closing notice: NT$24,000 fine, road-safety course and six-month plate suspension cancelled; first-instance decision 114年度交字第2626號 dated December 29, 2025; authority's appeal dismissed on August 24, 2026; authority bears NT$750 appeal costs; no further appeal permitted. The separate first-instance judgment is not represented as having been directly reviewed. |
| Article 43 and the car court's reasoning, lines 34–36 | Local Article 43(1)(4), 43(1) and 43(4), plus `226.txt`, 理由四（一）–（三）: arbitrary sudden slowing, braking or stopping without an emergency; NT$6,000–36,000 fine; immediate driving prohibition; six-month plate suspension. The account of legislative purpose, urgency and the authority's failure of proof is supported. The six-month plate sanction is not misdescribed as a licence suspension. |
| Bridge incident and parties' positions, line 40 | `237.txt`, 事實及理由二–四: November 25, 2025, about 5:13 p.m., Wenshan District. Repeated loud honking, apparent contact, pressure beside a large truck, instability and the significance of proposing police involvement are the rider's allegations. The authority's two-braking-episodes/no-collision/no-obstruction account is separately attributed. |
| Bridge footage, lines 42–44 | 五（一）: 17:13:24 green light and right-turn arrow; approximate position in the 機慢車道 after the junction; 17:13:29–31 rightward entry and long horn; 17:13:32 slight braking without stopping; 17:13:34 acceleration beside a silver van and short horn; 17:13:35–38 braking to a stop, looking back, clear lane and the following vehicle moving left to pass. The text does not confuse the braking interval with a measured period of remaining stationary. |
| Contact, control and emergency, line 46 | 五（一）–（二）: no obvious contact or visible loss of control requiring an immediate stop; continued ability to brake slightly and accelerate; horn timing consistent with warning of lane entry. The article preserves the distinction between no obvious contact and proof that no contact could have occurred. Suspected or slight contact is not made an automatic emergency exception. |
| Other vehicle and later police proposal, line 48 | 五（二）: the other vehicle's potentially objectionable driving is a separate question; proposing to call police afterwards does not establish the need to stop immediately on the bridge. The article does not make a separate finding that the other vehicle committed a traffic violation. |
| Different statements about intent, lines 50–54 | `226.txt`, 四（一）, connects the provision to malicious dangerous driving; `237.txt`, 五（二）, expressly rejects a necessary malicious or retaliatory intention. The column identifies that tension as a comparison, without inventing an overruling or a settled universal defence. The car appeal concerns 114年度交字第2626號, not the motorcycle judgment. Neither source creates a permissible stopping-duration threshold. |
| Motorcycle outcome and appeal, lines 3 and 62–64 | `237.txt`, 主文, 二, 五（三）–（四）, 六 and closing appeal notice: NT$16,000, course and six-month plate suspension upheld; NT$800 costs; legal-error appeal within 20 days of service. The article does not claim an appeal was filed or that this judgment became final. |
| Closing practical paragraph, line 66 | 五（二） supports progressive slowing, stable control, attention to surrounding traffic and pulling aside once safe or reaching a safe place that does not obstruct traffic, where immediate stopping is unnecessary. The advice remains tied to this court's reasoning and does not excuse creating a further danger to inspect damage or involve police. |

All ROC/Gregorian year conversions in the article are correct: 114 corresponds to 2025, and 115 to 2026. No unsupported motive, dialogue, weather, injury, vehicle model, sentence, fine-conversion rate or damages item is added. These are administrative traffic cases; criminal sentencing, 易科罰金 and civil damages calculations are not applicable to the reported outcomes.

## Citations and series rules

- All 20 judgment links match the two assigned URLs exactly: 10 for `TPBA,115,交上,76,20260824,1` and 10 for `TPTA,115,交,54,20260526,1`. Court divisions, case numbers and dates in their labels match the primary texts.
- Both statute links target `https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=43`. Article 43 is applied in these cases, so it requires no background-only label. No other statute is presented as an independently discussed rule.
- Factual paragraphs have inline citations. The outcome table is followed by the citations and the explanation that the car's first-instance result comes from the appeal judgment. The sources section includes both judgments and Article 43; it also identifies the indirectly reported first-instance decision.
- No private-party names, exact addresses or house numbers, private health conditions, family circumstances, income, education or exact occupations appear. Locations remain at city/district level. Vehicle descriptions are supported and do not reveal the car driver's commercial occupation.
- No `**`, `__`, `<b>` or `<strong>` markup, phone number, contact pitch or sales call to action appears.
- `author: "legal-ai-assistant"`, the byline and the final English AI-disclosure line are present. There is no lawyer-review or human-native-review claim.
- Administrative penalties are distinguished from criminal acquittal and civil damages. Appeal finality is stated only as supported by each judgment.
- No foreign-law comparison, invented quotation, moralising or fear-based claim appears. The absence of an optional reader-engagement question is not a defect.
- `read_time: "7 min read"` contains the number 7; there is no literal `N` defect.
- `IMAGE_PATH`, `ALT_TBD` and `CAPTION_TBD` remain accepted integration placeholders, as expressly instructed. They do not prevent PASS. No unverified claim about completed media review is made.

## English voice and sentence-deletion test

The headline is specific to the stop and the evidentiary outcome. The prose is calm, concrete and generally active, with consistent British-English usage. The three substantive headings follow the reporting vehicle's speed display, the rider's continuing control and the courts' different accounts of intent. They are not checklist headings. The final substantive paragraph supplies the court's supported stopping alternative instead of repeating a generic conclusion or adding a sales pitch.

Each sentence of the first two paragraphs was tested individually:

| Sentence | Information lost if deleted | Decision |
|---|---|---|
| “At about 7:14 a.m. on June 3, 2025…” | Time, date, district, junction/multilane setting and left signal. | Retain. |
| “It let a black SUV pass in the next lane.” | Yielding to the first adjacent vehicle. | Retain. |
| “Then a white vehicle approached…” | The next approaching vehicle and approximate stop duration. | Retain. |
| “The motorist following closely behind…” | Reporting party, close following and origin of the evidence. | Retain. |
| “That recording eventually helped undo the penalties.” | The causal connection between the reporting evidence and the successful challenge. | Retain. |
| “The first-instance court cancelled…” | All three cancelled sanctions, including amount and duration. | Retain. |
| “The traffic authority appealed and lost.” | Identity of the appellant and the appeal outcome. | Retain. |
| “These were administrative traffic proceedings…” | Express separation from criminal acquittal and civil damages. | Retain. |

C2, C3 and C4 also open with actual traffic events, consistent with the series brief. C5 has its own structure: two administrative outcomes, the source of the speed evidence and a qualified comparison of intent. Its headings and ending do not reproduce the other drafts' sequence. No generic preview, invented experience or formulaic checklist required editing.

## Minor edits applied

None. The current wording required no discretionary repair. The round-1 factual corrections were already present when this review began and are not claimed as edits by this reviewer.

Only `reviews/C5/en-astra-r2.md` was written during this review. The column, fact sheet, briefs, judgments, statute file and previous review log were not edited.

VERDICT: PASS
