# C5 zh-hant final review — Astra r1

Verdict: FIX

Reviewer: GPT-6 Astra (fallback final reviewer)

Review date: 2026-10-03

Two material factual-precision issues remain: the summary overstates what was established about the car driver's reason for stopping, and a later comparison reintroduces an unsupported three-second stationary stop. Neither was edited by the reviewer. Two minor voice edits were applied. The column is not approved for publication in its present form.

## Scope checked

Read in full with shell tools, independently of the writer's conclusions:

- `brief-SERIES.md` and `brief-EDITORIAL-VOICE.md`.
- `drafts/C5/zh-hant.md`, including frontmatter, title, summary, body, table, sources and final disclosure.
- `drafts/C5/zh-hant.facts.md`, including all 70 numbered entries and its editorial notes.
- `cases/jud/226.txt`: 臺北高等行政法院高等庭115年度交上字第76號判決, 2026-08-24.
- `cases/jud/237.txt`: 臺北高等行政法院地方庭115年度交字第54號判決, 2026-05-26, including its appended legislation and appeal notice.
- `cases/statutes.md`; the column's statutory quotation and explanation were checked directly against its Article 43 text and the judgments.

Checked in the requested order: facts and legal meaning; citations; series rules; Taiwanese Traditional Chinese voice. The fact sheet was a cross-check, not a substitute for reading the primary texts.

The global `~/agent-library/knowledge/editorial-voice.md` path does not exist. The alternative `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md` is only a pointer to that same missing path. The complete supplied `brief-EDITORIAL-VOICE.md` was read and applied. The three most recently published zh-hant articles could not be established from the supplied packet; no claim is made to have completed that publication-order comparison. This limitation is not one of the two FIX findings.

No network access was used. Article 43 was available locally, so there was no missing statute requiring an authorized fetch. Link identity was verified against the supplied URLs and local document identifiers; live HTTP availability was not tested. Media files and final integration captions were outside this text review. `IMAGE_PATH`, `ALT_TBD` and `CAPTION_TBD` were treated as expected integration placeholders, not blockers.

Line references below refer to the reviewed column after the minor edits; its line numbering is unchanged.

## Required fixes

### M1 — Summary turns an unexcluded explanation into an established cause

원문/Original → Line 3: 「兩案影像呈現的停車原因不同，法院對惡意逼車的法律說明也有差異。」

Problem & reason → 「影像呈現的停車原因不同」 presents the causes of both stops as established by the images. In the car case, the decisive finding is narrower: avoidance of the approaching white car could not be excluded, and the authority had not proved the contrary elements. `226.txt`, 理由四㈡, says 「不能排除被上訴人係為變換車道而逐漸降速」 and 「上訴人不能舉證被上訴人驟然煞車係非遇突發狀況且確屬任意而無正當理由」. It does not affirmatively establish the driver's actual reason. The body usually preserves this distinction, but a standalone summary must also preserve it. This affects the evidentiary basis of the outcome, rather than merely the prose style.

Fix (required; not applied) → Replace the quoted summary sentence with wording such as: 「法院無法排除小客車為了避碰而暫停的可能；機車案則認定沒有必須立即煞停的突發狀況。兩份判決對惡意逼車的法律說明也有差異。」

Facts/conditions preserved → Retains the car case's unresolved possibility and failure of proof, the motorcycle case's affirmative finding, and the different reasoning about malicious driving. Leaves all penalties, sanctions, court outcomes and appeal limitations unchanged. Does not invent a common legal test for the two judgments.

### M2 — “One stopped for three seconds” is not a supported duration

원문/Original → Line 62: `這是不同案件、不同審級的說理差異，不能只用「一個停兩秒、一個停三秒」來解釋勝敗，更不能替兩份判決拼出已經統一的法律標準。`

Problem & reason → `237.txt`, 事實及理由五㈠⒏, records 「17:13:35至17:13:38系爭機車開始煞車至停止」. These three seconds describe braking to a stop, not remaining stationary. The article correctly explains that distinction at line 52. At line 62, however, 「不能只用」 says that the proposed comparison is insufficient; it does not clearly say that its motorcycle-duration premise is false. The wording therefore reintroduces the very factual confusion the earlier paragraph correctly rejects. The car's approximately two-second stationary stop is supported by `226.txt`, 理由四㈡; the two durations measure different things.

Fix (required; not applied) → Replace the quoted sentence with wording such as: 「這是不同案件、不同審級的說理差異。小客車的兩秒是暫停時間，機車的三秒則是從開始煞車到停止的過程，不能拿來比較停留時間長短，更不能替兩份判決拼出已經統一的法律標準。」

Facts/conditions preserved → Preserves both recorded durations and the timestamps supporting them, while distinguishing their meanings. Keeps the different cases, different court levels, different reasoning about malice and absence of a demonstrated uniform rule. Does not supply any duration for how long the motorcycle remained stopped.

## Minor edits applied

### E1 — Make the opening question direct

원문/Original → Line 22: 「後來法院看到的，卻是裁罰理由留下的疑問：這兩秒，能排除是為了避免碰撞而停嗎？」

Problem & reason → 「看到的……留下的疑問」 is an abstract, indirect construction. The question itself supplies the useful information.

Fix (applied) → 「法院的疑問是：這兩秒的暫停，能排除是為了避免碰撞嗎？」

Facts/conditions preserved → Keeps the two-second stop, the court as the subject, and the inability-to-exclude framing. It remains the author's paraphrased question, not an invented direct quotation. The judgment citation is unchanged.

### E2 — Remove a transition with no factual content

원문/Original → Line 36 opened with 「不只有停下的那一刻。」

Problem & reason → The sentence adds no event, condition or evidentiary detail. The following sentence already identifies what the first-instance court examined.

Fix (applied) → Deleted that sentence. The paragraph now begins 「一審注意到，檢舉車緊跟在小客車後方……」.

Facts/conditions preserved → Keeps the following vehicle's displayed speed, the possible gradual deceleration of the front vehicle, the approximately two-second stop, subsequent acceleration and absence of further blocking. No legal qualification or citation was removed.

Applied-edit list:

1. Simplified the opening question at line 22.
2. Deleted the empty transition at line 36.

No major issue, number, quotation, citation, outcome or legal condition was directly corrected.

## Primary-source reconciliation

| Claims checked | Primary support and review result |
|---|---|
| Car event: 2025-06-03, about 07:14, Taipei's Wanhua District; public report based on the following vehicle's dashcam | `226.txt`, 理由一、三㈠、四㈡. Supported; the column omits the exact intersection, registration details and occupational detail. |
| Left signal, black SUV first, approaching white car, approximately two-second stop, subsequent movement and three lane changes | `226.txt`, 理由四㈡. Supported. The driver's safety explanation remains an unexcluded possibility in the detailed body. M1 concerns the summary's stronger wording. |
| Displayed speed falling from over 30 to over 10 km/h | `226.txt`, 理由四㈡. Correctly attributed to the following vehicle's recording, not a direct measurement of the front vehicle. |
| Authority's 07:14:50 braking claim; 07:14:57 right signal; nearly 100 metres; one intersection; 07:15:06 left signal | `226.txt`, 理由三㈠、㈡. Correctly presented as the authority's argument, distinct from the court's reconstruction. |
| Car penalty: NT$24,000, safety instruction, six-month plate suspension; two dispositions revoked | `226.txt`, 理由一、四、五. Supported. Plates and driving licences are not conflated. |
| Car first instance: 114年度交字第2626號, 2025-12-29; appeal: 115年度交上字第76號, 2026-08-24; appeal dismissed; NT$750 costs; no appeal | `226.txt`, opening, 主文、理由六 and closing notice. Supported. First-instance details are expressly sourced through the supplied appeal judgment. |
| Motorcycle event: 2025-11-25, 17:13, bridge in Taipei's Wenshan District | `237.txt`, 事實及理由二、五㈡. Supported; no exact bridge name, address or residence detail is published. |
| Rider's account of a large vehicle, startling horn, contact, wobbling and later proposed police report; authority's assertion of two braking acts | `237.txt`, 三㈠、四㈠. Properly attributed to the parties, not adopted as established events. |
| 17:13:24 approach; 29–31 seconds rightward entry and long horn; 32 seconds slight braking; 34 seconds acceleration and short horn; 35–38 seconds braking to a stop | `237.txt`, 五㈠⒈至⒏. Supported. The silver van is not converted into the large truck alleged by the rider. M2 concerns the later misleading comparison. |
| Passenger's left-rear contact account, likely contact side if contact occurred, no proven need for immediate stopping, later handling of the dispute | `237.txt`, 五㈡. The body preserves subjective testimony, conditional contact and the court's evidentiary assessment. It does not claim the court proved that no contact occurred. |
| Refusal to investigate the later footage, and no adjudication of the reporting vehicle's possible separate violation | `237.txt`, 五㈡. Correctly limited to this case and its evidentiary issue. |
| Different reasoning about malicious driving | `226.txt`, 四㈠, and `237.txt`, 五㈡. The quoted passages are exact. The column does not claim one judgment overturned the other or that they establish a uniform rule. |
| Motorcycle penalty: NT$16,000, safety instruction, six-month plate suspension; claim dismissed; NT$800 costs | `237.txt`, 主文、二、五㈢至㈣、六. Supported. NT$800 is litigation cost, not an additional traffic fine; the judgment identifies NT$300 court fee plus NT$500 witness expenses. |
| Amendment deleting the 易處處分 portion; penalty schedule at the time of the disposition; appeal within 20 days after service for error of law | `237.txt`, 二、五㈢ and closing notice. Correct. The column does not claim that the motorcycle judgment is final or that NT$16,000 is the universal statutory amount. |
| Article 43(1)(4), NT$6,000–36,000 range, immediate driving prohibition, Article 43(4) plate suspension | `cases/statutes.md`, Article 43, also quoted in both judgments. Supported; the column does not invent an on-scene execution of the driving prohibition. |
| Continuous footage recommendation and gradual slowing/safe stopping guidance | Recommendations are explicitly identified as analysis; the latter preserves the conditions in `237.txt`, 五㈡. No invented minimum recording period or unconditional prohibition on braking after contact. |

## Citations and series rules

- All 30 Markdown source links match their labels and the supplied case/article identifiers. There are three distinct URLs: the specified `TPBA,115,交上,76,20260824,1` judgment, the specified `TPTA,115,交,54,20260526,1` judgment, and `LawSingle.aspx?pcode=K0040012&flno=43`. Case numbers, dates and court levels match the primary texts. The final source list contains all three.
- The first-instance car judgment is clearly identified as a secondary account within the appeal judgment; the column does not falsely claim to have read its separate full text.
- Article 43 is actually applied in the cases. No background-only statute is presented as a holding. The unrelated, mislabeled final entry in `statutes.md` was not used by the column and was not changed.
- No private-party name, exact address, plate number, health condition, family situation, income, education or precise occupation appears. The passenger is identified only by role.
- No bold markup (`**`, `__`, `<b>`, `<strong>`), telephone number or sales CTA appears.
- Frontmatter retains `author: "legal-ai-assistant"`. The visible byline and final AI disclosure remain. There is no lawyer-review or human native-review claim.
- Both matters are expressly administrative traffic cases. No criminal sentence, conversion-to-fine rate or civil damages award is invented or inferred.
- The car judgment's “不得上訴” and the motorcycle judgment's appeal route are distinguished. No unsupported finality is claimed.
- No foreign-law comparison appears. The court's examples of accidents, dropped tyres and fallen trees are presented as legal explanation, not incidents in either case.
- `read_time` contains the concrete estimate `12` in `約12分鐘閱讀`; no literal `N` remains. Media placeholders are exempt under the express review instruction.
- Apart from M1 and M2, the title, subheads and body are specific to the two events, use Taiwanese Traditional Chinese and avoid imperative/checklist titles, fabricated dialogue and unsupported motives. The result table is an appropriate comparison, not mechanical filler.

## First-two-paragraph sentence-deletion check

| Sentence after minor edits | Information lost if deleted |
|---|---|
| Opening sentence beginning 「2025年6月3日……」 | Date, time, district, left signal and yielding to the black SUV. |
| 「左側後方又有白車靠近……」 | White-car approach, approximately two-second stop and restarting after it passes. |
| 「後車的行車紀錄器錄下……」 | Source of the evidence and its use in the report. |
| Revised 「法院的疑問是……」 | The distinction between stopping and proving there was no collision-avoidance explanation. |
| Second paragraph beginning 「同年11月25日……」 | Separate event, time, location and rightward lane entry. |
| 「略煞車、再加速之後……」 | Braking-to-stop sequence, rider looking back and following vehicle passing left. |
| 「這次法院認定……」 | The motorcycle case's finding that no immediate stopping emergency was shown. |

All seven remaining sentences add event information, evidentiary context or the adjudicated issue. No generic introductory sentence remains in those two paragraphs.

## Verification and write scope

- Compared the final column to the captured pre-edit text: exactly E1 and E2 changed.
- Frontmatter, all 30 links, all corner-bracketed text, source list and AI disclosure are byte-for-byte unchanged. Factual numbers are unchanged. A broad Chinese-numeral character scan only flags the removed 「一」 in the non-factual transition 「那一刻」; it is not a changed event duration.
- Both required fixes remain unapplied and are explicitly recorded above.
- Reviewed column SHA-256 after minor edits: `d068c1446a4a7c3cf4a39b3e9bba843ddc5b0609d92f44588701d5498b6a4717`.
- This reviewer wrote only `drafts/C5/zh-hant.md` and this log. The workspace is not a Git repository. Its other-file inventory changed during review (2,112 to 2,119 files before the log was written), so no claim is made that all concurrent workspace activity was unchanged. No other file was edited or reverted by this reviewer.

VERDICT: FIX
