# C3 zh-hant — final review, Astra r1

VERDICT: FIX

Reviewer: GPT-6 Astra (fallback reviewer). Review date: 2026-10-03.

The central account is supported, including the recorded movements, three collisions, five-month sentence, conditional NT$1,000-per-day commutation rate, and dismissal of the appeal. Publication is blocked by the issues below. Four minor editorial edits were applied; substantive statements, numbers, and citations were left for the author to correct.

## Scope checked

Read in full with shell tools:

- `brief-SERIES.md` and `brief-EDITORIAL-VOICE.md`.
- `drafts/C3/zh-hant.md`, including frontmatter, headings, quotations, table, sources, and disclosure.
- `cases/jud/62.txt`: 臺灣高等法院114年度上訴字第3183號刑事判決, 2025-11-12, including its attached first-instance judgment.
- `cases/jud/346.txt`: 臺灣新北地方法院113年度訴字第513號刑事判決, 2025-03-25, including its statutory appendix and event table.
- `cases/statutes.md`, including all nine articles linked by this column.

`drafts/C3/zh-hant.facts.md` does not exist. Every factual check was therefore made against the judgments/statutes themselves. No fact-sheet assertion or earlier reviewer verdict was used as evidence.

All cited statutory texts are present locally, so no network access was used. Judgment URLs were compared with the exact URLs supplied in the review request, and statutory URLs with the supplied article entries; live HTTP availability was not tested.

The shared `~/agent-library/knowledge/editorial-voice.md` path is absent. The complete supplied `brief-EDITORIAL-VOICE.md` was read and applied. Openings, subheads, and endings of the local C1, C2, and C4 zh-hant drafts were also compared for repeated wording. These are draft comparators, not a verified list of the site's three latest published articles.

All line references below refer to the reviewed column; the minor edits did not change its line count.

## Issues requiring correction

### F1 — Major: case-specific self-defense reasoning becomes categorical wording

- 원문/Original: line 56, `按喇叭、閃大燈，不是「現在不法之侵害」`; line 60, `A車是前車、B車是後車，後車本來就不可能阻礙前車自由行駛。`
- → Problem & reason: The heading states an unrestricted proposition, and the prose changes the court's finding about this complainant and defendant into a claim about rear vehicles generally. The High Court's 理由四㈠⒊ evaluates the recorded warning signals and this sequence of driving; the District Court's 貳、一㈢ likewise addresses these parties. Neither establishes that any rear vehicle can never impede the car ahead. The supplied 道路交通安全規則第94條第1項 itself prohibits a following driver from using proximity or other means to force the vehicle ahead to yield. Line 107 correctly states the limits, but that later qualification does not make the categorical heading/sentence accurate on their own. This conflicts with series rules 1 and 6 and the voice rule against broader claims in headings.
- → Fix (required; not applied): Narrow the heading, for example, to `法院認為，本案的鳴笛、閃燈只是示警`. Replace the categorical sentence with a report confined to the evidence, for example: `法院依本案的勘驗結果，認為B車駕駛沒有妨害A車駕駛自由行駛，也沒有對A車駕駛施以現在不法侵害。` Keep the judgment citation immediately after the relevant account.
- → Facts/conditions preserved: Both courts rejected this defendant's self-defense claim; the warning signals, positions of A/B, recorded chronology, and requirement of a present unlawful infringement remain unchanged. Do not suggest that B was found to have committed dangerous following in this case.

### F2 — Major: the simplified-citation statement is incorrectly extended to the whole first-instance judgment

- 원문/Original: line 94, `一審判決依精簡原則只記載程序法條文，沒有寫出第41條的條號。`
- → Problem & reason: The absence of an express Article 41 citation is correct. The assertion that the first-instance judgment records only procedural statutes is not: its substantive reasoning expressly names Criminal Code Articles 23, 185, 304 and 354, and Traffic Safety Rules Article 94; its appendix reproduces Articles 185, 304 and 354. In `346.txt`, the parenthetical `依刑事判決精簡原則，僅記載程序法條文` follows the concluding `據上論斷，應依刑事訴訟法第299條第1項前段` passage. Its scope must not be expanded to the entire judgment.
- → Fix (required; not applied): For example: `一審判決未明列刑法第41條；判決末段「據上論斷」依精簡原則僅列程序法依據，正文與附錄仍記載相關實體法條文。` Alternatively, retain only the supported statement that Article 41 is not expressly named. Add the first-instance citation after the statement about that document.
- → Facts/conditions preserved: The Article 41 background explanation, five-year maximum, six-month eligibility threshold, three daily conversion rates, statutory exception, and actual five-month/NT$1,000-per-day disposition must remain unchanged. Do not claim the judgment expressly cited Article 41.

### F3 — Major: the two operative orders are collapsed into one description

- 원문/Original: line 111, under `這兩份判決沒有說的事`: `這是刑事判決，主文只宣告罪名和刑。`
- → Problem & reason: That description fits the first-instance order, but not the appellate order. `62.txt` has the operative order `上訴駁回。`; it maintains the first-instance conviction and sentence through its reasoning. In a section expressly discussing both judgments, the sentence must identify which order it describes. The correct distinction already appears in the article's table, making this an internal inconsistency as well as an imprecise report of the source.
- → Fix (required; not applied): For example: `一審主文宣告罪名、刑期及易科罰金折算標準；高院主文則是「上訴駁回」。兩份判決均未裁判民事賠償。` Cite the two judgments after this account.
- → Facts/conditions preserved: No repair estimate amount or civil damages award is stated in either supplied judgment. Preserve the distinction between the conviction/sentence, the appellate dismissal, and the sentencing references to failure to settle or compensate. Do not imply that civil recovery was rejected or barred.

### C1 — Major hard-rule failure: citations do not consistently follow the claims they support

- 원문/Original: Examples include line 68, `B車那約2秒的閃大燈記錄在22時14分22秒，比A車第一次驟然減速（22時14分17秒）晚了5秒`; line 103, `高院判決末尾記載，不服者應於收受送達後20日內向該院提出上訴書狀`; and the vehicle-damage and coercion findings in lines 84 and 86. These paragraphs have no following judgment link. The statutory links in lines 84/86 cannot support the case-specific evidentiary findings.
- → Problem & reason: These statements are supported by the supplied judgments, but series rule 2 expressly requires court + case number + date, linked immediately after the supported claims. A link in an earlier paragraph, a later paragraph about a different finding, or the final bibliography does not fully satisfy that placement rule. This is a citation-compliance issue, not a finding that the underlying event times or appeal period are invented.
- → Fix (required; not applied): Add the supplied judgment citations at the ends of the relevant factual paragraphs or clearly bounded claim groups. Check these locations in particular:
  - Lines 24 and 30–34: appellate account and detailed timeline — High Court citation; include the District Court citation where its sentence is independently summarized.
  - Lines 48 and 68: interpretation of the appellate record and the five-second calculation — High Court citation.
  - Line 58: the first-instance interpretation of Article 23 — District Court citation, in addition to the existing statutory link.
  - Lines 72, 76, 84 and 86: case-specific danger, traffic-rule violation, damage, intent and coercion findings — District Court citation, not just a statute link.
  - Line 94 and table lines 100–101: claims about the judgments/dispositions — link the relevant judgment adjacent to each account or table row.
  - Line 103: the appellate judgment's service-based 20-day notice — High Court citation.
  - Lines 107–111 and the retained factual/legal claims in lines 117–121: attach the relevant judgment citations; retain single-article links where statutory rules are restated.

  Use the exact supplied destinations:
  - [臺灣高等法院114年度上訴字第3183號刑事判決，2025年11月12日](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=TPHM%2C114%2C%E4%B8%8A%E8%A8%B4%2C3183%2C20251112%2C1).
  - [臺灣新北地方法院113年度訴字第513號刑事判決，2025年3月25日](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=PCDM%2C113%2C%E8%A8%B4%2C513%2C20250325%2C1).
- → Facts/conditions preserved: Preserve the existing exact URLs, dates, quoted passages, distinctions between party assertions and findings, and the statement that the five-second comparison is the writer's calculation rather than separate judicial reasoning. No new primary source or invented Supreme Court URL is needed.

### P1 — Publication blocker: unresolved reader-facing metadata beyond the expressly exempted placeholders

- 원문/Original: line 7, `read_time: "約N分鐘閱讀"`; lines 13 and 16, `featured_image: "IMAGE_PATH"` and `social_image: "IMAGE_PATH"`.
- → Problem & reason: `N` is not a reading-time value, and `IMAGE_PATH` is not a resolved image reference. The review instruction exempts `ALT_TBD` and `CAPTION_TBD`, but does not exempt these fields. A PASS authorizes publication of this file as is; it cannot presume a later substitution that has not occurred in the reviewed artifact.
- → Fix (required; not applied): Supply the final reading-time value and approved asset references in the column, or remove optional fields if the publishing schema permits it. If a publishing step performs these substitutions, provide the resolved column for review rather than treating this unresolved version as publishable. No guessed reading time or unverified path was inserted by the reviewer.
- → Facts/conditions preserved: This correction concerns publishing metadata only. Preserve the author, publication/data-confirmation dates and AI disclosure. `ALT_TBD` and `CAPTION_TBD` were ignored as explicitly instructed; they are not findings in this review.

## Factual and citation checks completed

| Area | Primary-source result |
|---|---|
| Date, road and vehicle roles | 2023-01-21, New Taipei ring expressway, New Taipei Bridge toward Sanchong, single-direction approaches and the single-lane ramp are supported by `346.txt` 事實一 and 貳、一㈡⒉. A/B are correctly assigned. No house number or plate number is reproduced. |
| Hearing date and recorded timeline | 2024-11-07 is supported. All listed movements, pauses, collisions, disappearance/reappearance and the 22:21:03 divergence match `62.txt` 理由四㈠⒊. Two decelerations, five stops and three reversing collisions match both records. |
| Duration calculations | 22:14:02 → 22:14:17 = 15 seconds; 22:15:08 → 22:15:15 = 7 seconds; 22:16:59 → 22:17:02 = 3 seconds; 22:14:17 → 22:14:22 = 5 seconds. The dangerous-driving interval 22:14:17 → 22:17:45 is 208 seconds, consistent with `3分多鐘`. The text properly identifies these as dashcam times. |
| Party assertions and counter-complaint | A's alleged fear, slow pushing, pursuit to Wanhua and self-defense account are identified as assertions. The B-driver testimony, contemporaneous police report and supporting audio transcript match the first-instance reasoning. The counter-complaint under Articles 185/304/305 was not prosecuted for insufficient suspicion; the column does not call that an acquittal. |
| Damage and evidence | B's bumper, hood and body-shell damage, photographs, estimate, both cars' recordings and police/prosecutor records are supported. No repair-cost figure, personal injury, speed or additional collision was invented. |
| Offenses and sentencing | Concrete danger, intentional conduct, damage, indirect force, continuing conduct and concurrence with punishment for the more serious Article 185 offense match 貳、一 and 二. The sentence is five months, with conditional commutation at NT$1,000/day. No actual payment, automatic entitlement or aggregate monetary penalty is asserted. |
| Appeal | Court, case number, date, dismissal and maintenance of the first-instance result match `62.txt`. The further-appeal notice is 20 days from receipt of service; the draft correctly declines to claim finality. See F3 for the separate operative-order wording problem. |
| Statutory wording and background | Articles 23, 41, 57, 185, 304, 305, 354, Traffic Safety Rules 94 and Traffic Management and Penalty Act 43 were checked. Article 41's exception is preserved. Article 43's NT$6,000–36,000 range, immediate driving prohibition and six-month plate suspension match the provided text and are explicitly background, not a sanction found in this case. |
| Direct quotations | Both blockquotes and every distinct phrase in corner quotation marks are exact excerpts of the supplied judgments or statutes. The fourth minor edit reuses an already verified quotation without changing its wording. |
| Link destinations and bibliography | All 39 link occurrences resolve syntactically to the two required judgment URLs or the nine correct supplied single-article URLs. All 11 distinct linked sources are in the sources section. Placement defects remain under C1. |

The named Supreme Court cases 101年度台上字第2375號, 104年度台上字第1101號 and 110年度台上字第6170號 are explicitly presented as precedents cited by the supplied lower/appellate judgments. Their numbers and reported propositions match those judgments. They were checked as indirect citations, not represented as independently opened Supreme Court originals.

## Series and voice checks

- No private-party names, telephone numbers, sales CTA, bold markup (`**`, `__`, `<b>`, `<strong>`), foreign-law comparison, lawyer-review claim or human-native-review claim appears.
- `author: "legal-ai-assistant"` is present. The final Traditional Chinese AI-disclosure line and 2026-10-03 confirmation date are present.
- No party health condition, family detail, income, education or exact occupation is exposed. Generic personal circumstances remain generic. The defendant's stated fear is an attributed contemporaneous defense assertion, not a disclosed medical condition.
- Criminal punishment, administrative background and the absence of a civil damages ruling are distinguished, subject to correcting the description of the two operative orders in F3.
- Exactly one reader-engagement question appears. The main title identifies the actual conduct and rejected defense without an imperative or clickbait claim. The self-defense subheading requires the scope correction in F1.
- Traditional Chinese and Taiwan legal/traffic terminology are appropriate. `匝道` is natural Taiwan usage; the source's `閘道` is accurately identified as its wording. No simplified-character or mainland-vocabulary correction was necessary.
- The image/caption placeholders specifically exempted by the user were not treated as failures. Actual media and final captions were not reviewed or represented as approved.

### First-two-paragraph sentence-deletion test

| Sentence | Information lost if deleted | Result |
|---|---|---|
| Paragraph 1: date/time and location | Incident date, initial frame time and road direction | Retain |
| Paragraph 1: A changes lanes and B sounds its horn | Vehicle roles, triggering maneuver and approximate two-second signal | Retain |
| Paragraph 1: `15秒後，A車驟然減速。` | Delay to the first deceleration | Retain |
| Paragraph 1: subsequent maneuvers and collisions | Three-minute-plus sequence, three impacts and dashcam-time qualification/source | Retain |
| Paragraph 2: approaches and single-lane ramp | Road layout and restricted passage | Retain |
| Paragraph 2: other vehicles at night | Evidence of other road users relevant to concrete public danger | Retain |
| Paragraph 2: damaged components | Specific property damage and stated severity | Retain |

The opening delivers source-based information immediately. No opening sentence was removed. The local comparator drafts share a dated scene opening, which fits the series, but C3's original closing subhead closely mirrored C4's `被切車道之後，自己的反應也在畫面裡`; the fourth minor edit removes that repeated formula without rewriting the legal conclusion.

## Minor edits applied

1. 원문/Original: line 28, `，依時間讀下來，可以分成幾段。` → Problem & reason: Announces the coming structure without adding information. → Fix (applied): Removed the phrase and closed the preceding sentence normally. → Facts/conditions preserved: Inspection date, chronology description and complete appellate citation remain intact.
2. 원문/Original: line 38, `A車自己的行車紀錄器，也在證據之列。` → Problem & reason: Repeats the same paragraph's statement that both vehicles' recordings are in the evidentiary record. → Fix (applied): Removed the duplicate sentence. → Facts/conditions preserved: The paragraph still expressly identifies recordings from both cars; prosecution and evidence details and the citation remain intact.
3. 원문/Original: line 44, `判決摘要的上訴意旨是這樣` → Problem & reason: Awkward attribution in Traditional Chinese. → Fix (applied): `判決摘述的上訴意旨如下`. → Facts/conditions preserved: The following blockquote remains exactly unchanged and is still identified as the judgment's summary of the defendant's appeal.
4. 원문/Original: line 115, `被按喇叭之後，畫面記下的是自己的反應` → Problem & reason: Closely repeats C4's closing-subhead pattern and adds a general lesson-like framing. → Fix (applied): `倒車撞擊與「請他不要追了」的辯解`. → Facts/conditions preserved: The heading now names the same recorded conduct and already quoted defense; no new event, motive, legal result or altered quotation was introduced.

## Verification of changes

Read-only Python checks reconstructed the pre-edit column from the four intended line changes and matched its original SHA-256. The before/after numeral sequences, all 39 URL occurrences, both blockquotes, the set of quoted wording, and the frontmatter are unchanged. The source judgments, statutory packet and two briefs retain their initial hashes. The diff was inspected.

- Column before minor edits: `fa5a9eda7f61610629b4011a72e6cb3649d7ee8b7d143bb16fa23f8899f9b7da`.
- Column after minor edits: `4d35eda7cce51882aa324bdbff1366d6b94c4b74c1f5d5a649f9a615180eda7f`.
- Reviewer writes: only `drafts/C3/zh-hant.md` and this review log.

F1–F3, C1 and P1 remain for author correction. This is not publication approval.
