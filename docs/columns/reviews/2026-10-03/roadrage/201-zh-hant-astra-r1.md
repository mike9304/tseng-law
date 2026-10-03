# C1 zh-hant — final review, Astra r1

Verdict: FIX. The column is not publishable as submitted. Two substantive statements and the reading-time field require correction; one quotation also requires restoration to the source wording. No column edits were applied.

Reviewer: GPT-6 Astra (fallback final reviewer)

Review date: 2026-10-03

## Scope checked

- Read all of `brief-SERIES.md`, `brief-EDITORIAL-VOICE.md`, `drafts/C1/zh-hant.md`, `cases/jud/173.txt`, and `cases/statutes.md` with shell tools. The judgment packet includes both the High Court judgment and the attached first-instance judgment.
- `drafts/C1/zh-hant.facts.md` does not exist. All factual checks were made directly against the judgments and statutes; the missing fact sheet is not a defect in the column.
- Checked facts first, then quotations/citations, series rules and frontmatter, and Taiwan Traditional Chinese voice, including each sentence of the first two paragraphs.
- The separate home-level `~/agent-library/knowledge/editorial-voice.md` is unavailable. The supplied project editorial-voice brief was read in full and applied. The three immediately preceding published zh-hant columns were not identified reliably in the available review material; no claim of a completed publication-history comparison is made.
- All four cited statute articles are present locally. No network requests were made. URL checks concern the supplied judgment identifier and statute article mappings, not live HTTP availability.
- `IMAGE_PATH`, `ALT_TBD`, and `CAPTION_TBD` are expected integration placeholders and are expressly not findings. This review does not re-review the separately approved image/video assets or their integration.
- Reviewed column SHA-256: `9e502b74d1bbd5e18a7092d72df10065423bda3a60d878289002bf1a2f54ab74`. Line references below refer to that unchanged file.

## Issues requiring correction

### 1. Major — Article 376 exception is stated incompletely

Location: `drafts/C1/zh-hant.md:94`.

원문/Original → 「同條但書允許上訴的情形，是第一審判決無罪、經第二審撤銷並改判有罪；本案二審維持無罪，不屬於這種情形。」

Problem & reason → The sentence presents an exhaustive account of the statutory exception but omits both qualifying first-instance dispositions and the restriction on who may appeal. `cases/statutes.md:105` covers first-instance judgments of 無罪、免訴、不受理或管轄錯誤 that the second instance reverses and replaces with a conviction, and authorizes 被告或得為被告利益上訴之人. The present sentence narrows the covered dispositions and leaves the beneficiary limitation unstated. Its conclusion about this case is correct, but the general explanation of the statute is incomplete. This is a legal-condition correction, not a stylistic edit.

Fix (required; not applied) → Replace the exception sentence with: 「同條第1項但書規定，第一審判決無罪、免訴、不受理或管轄錯誤，經第二審撤銷並改判有罪時，被告或得為被告利益上訴的人可以提起上訴。本案二審維持無罪，不屬於這項例外。」 Keep the existing article link and the explanation that the High Court judgment itself does not cite Article 376.

Facts/conditions preserved → The High Court dismissed the prosecutor's appeal and expressly stated 不得上訴. This case was not a second-instance reversal from acquittal to conviction. The proposed correction restores the statute's other dispositions and eligible appellants without changing this case's result or representing background explanation as the court's express statutory citation.

### 2. Major — A case-specific use of recordings becomes an unsupported guarantee

Location: `drafts/C1/zh-hant.md:110`.

원문/Original → 「對在台灣騎車、開車的人來說，這個案子顯示了行車紀錄器能做到的事：只要連續錄到號誌和畫面時間，檢警和法院就能逐秒還原經過。」

Problem & reason → 「只要……就能」 asserts that recording signals and timestamps is sufficient for police, prosecutors and courts to reconstruct events second by second. Neither judgment nor any supplied statute establishes that general proposition. In this case the first-instance court used two recordings with different displayed times: the roadside recording supplied the approximately 1 minute 54 seconds, and the dashcam supplied the 52-second red light. The packet also leaves the window/door discrepancy unresolved. These sources support the court's specific observations and calculation, not a guarantee of complete reconstruction from those recording features. This exceeds the evidential limits required by series rules 1 and 6.

Fix (required; not applied) → Remove the sufficiency claim or replace the first sentence with a case-limited statement such as: 「本案一審分別勘驗路口監視器與行車紀錄器，依畫面中的車輛動向、號誌及顯示時間，計算機車遭阻擋的時間。」 Cite the supplied judgment immediately after this statement. The following recommendation to preserve the original recording can remain as a recommendation, without a promise of what it will prove.

Facts/conditions preserved → Both recording sources, their timestamp discrepancy, and the court's 114 − 52 = 62 second calculation remain intact. No new duty to record or preserve evidence is created. No inference is made that the court resolved every factual inconsistency.

### 3. Publication blocker — `read_time` still contains literal `N`

Location: `drafts/C1/zh-hant.md:7`.

원문/Original → `read_time: "約N分鐘閱讀"`

Problem & reason → The user expressly identifies a literal `N` in this field as a defect. It is not one of the three exempt image/caption placeholders and would expose unfinished metadata on publication.

Fix (required; not applied) → Replace `N` with a numeric reading-time estimate using the publisher's estimation convention. Verify the resulting value is numeric within the display string. This reviewer did not invent or insert a number under an authorization limited to minor wording/typo/naturalness edits that must not change numbers.

Facts/conditions preserved → The estimated reading time is editorial metadata. The case dates, durations, amounts and legal results must remain unchanged.

### 4. Required quotation correction — heading omits a source word

Location: `drafts/C1/zh-hant.md:40`.

원문/Original → `## 「兩側還有空間」與「法益侵害難認輕微」`

Problem & reason → The first quoted phrase is not verbatim. In the attached first-instance judgment, reasons 四, the driver's defence reads 「其所駕駛之車輛兩側還是有空間可供機車通行」. The heading drops 「是」 while presenting the shortened phrase as a quotation alongside an exact quotation of the prosecutor's argument. The meaning is substantially the same, but series rule 1 requires exact wording when quoting the judgment.

Fix (required; not applied) → Use `## 「兩側還是有空間」與「法益侵害難認輕微」`, or clearly present the first phrase as a paraphrase without quotation marks. Left for the writer because the review authorization excludes changing citations.

Facts/conditions preserved → The first position remains the driver's defence; the second remains the prosecutor's appellate argument. Neither is converted into an independently established fact or into the court's holding.

## Source verification results

| Subject | Direct source and result |
|---|---|
| Incident date, time and district | High Court reasons 四㈠ and attached first-instance reasons 四(一): 2024-07-28 / 民國113年7月28日, about 18:58, 新北市中和區. The column matches and omits street names and house numbers. |
| U-turn, horn, pursuit, blocking, insult and attempted departure | Both courts' findings support the opening. The column does not treat the prosecutor's allegation of criminal intent as an established finding. |
| Window versus door | The findings say 開啟車窗; the dashcam inspection says 打開車門…關上車門. The column correctly discloses this unresolved source discrepancy rather than silently choosing one version. |
| Inspection dates and evidence | Attached reasons 三 and 四(一): prosecutor's inspection 2024-09-12, trial inspection 2025-07-14, and the complainant's trial testimony. The column matches. |
| Roadside camera intervals | Attached reasons 四(二)4: 18:58:42–18:58:47, 19:00:23–19:00:40, 19:00:41–19:00:50. The column preserves the camera source, left-turn indicator, lane positions and departure movements. |
| Dashcam intervals | Attached reasons 四(二)3: 18:24:54–18:25:24, 18:25:25–18:25:39 and 18:26:17. The column correctly separates these displayed times from the roadside camera clock. |
| Duration arithmetic | 18:58:47 to 19:00:41 is 114 seconds; 18:25:25 to 18:26:17 is 52 seconds; 114 − 52 = 62 seconds. The column retains the judgment's approximate wording for the obstruction interval. |
| Road width and freedom to depart | Attached reasons 四(二)2–5 and High Court 四㈡ support two lanes in each direction, the comparison with a narrow one-way road, the left U-turn, and the courts' doubt about coercion. |
| Defence versus prosecution | The driver's prior non-prosecution claim is explicitly attributed to him. The danger, disproportionality and reputation arguments are explicitly attributed to the prosecutor. The court's contrary conclusions are separately identified. |
| Coercion reasoning | The first-instance analysis, alternative reasoning and the High Court's six principles and application match the packet. The long block quotation is exact. |
| Insult reasoning | The account matches attached reasons 四(三) and High Court 四㈢. The quoted statement that the offence does not police poor manners is exact. The constitutional judgment is discussed as interpreted and cited by these courts; its independent original was not supplied or separately verified. |
| Case identifiers, dates and result | 新北地檢署113年度偵字第45568號; 新北地院114年度易字第637號, 2025-07-31; 高院114年度上易字第2198號, 2026-01-27. Both offences resulted in acquittal; the prosecutor's appeal was dismissed. No sentence, criminal fine, conversion rate or civil damages award was invented. |
| Criminal penalties | Article 304(1): up to three years, detention or up to NT$9,000 fine. Article 309(1): detention or up to NT$9,000 fine. Text and subsection references match `cases/statutes.md`. These are not presented as sentences imposed in this case. |
| Administrative background | Article 43(1)(3)–(4), NT$6,000–36,000, immediate driving prohibition, and the six-month plate suspension under paragraph 4 match the supplied statute. The column expressly says this is background, not an adjudicated sanction in this case. |
| Appeal explanation | 不得上訴 is exact. No unsupported finality date is asserted. Article 376's general exception needs issue 1 corrected. |

All judgment hyperlinks use the exact required URL, whose decoded identifier is `TPHM,114,上易,2198,20260127,1`. Links labelled with the first-instance judgment correctly lead to its full attachment in that High Court packet; the attachment relationship is explained in the opening citation and sources list. All four statute URLs have the matching law codes and article numbers. Every distinct URL cited in the body also appears in the sources section. Apart from issue 4, direct source quotations checked against the packet/statutes match; 「被擋了很久」 is visibly a hypothetical description, not an attributed quotation from a party.

## Rules and voice

- No private-party names, exact addresses, personal health/family/income/education/occupation details, phone number or sales CTA appear in the column. The reference to disability concerns the legal analysis of group-directed insults, not a disclosed health condition of a party.
- No `**`, `__`, `<b>` or `<strong>` formatting was found. The author is `legal-ai-assistant`; the final Traditional Chinese AI-disclosure line and confirmation date are present. There is no lawyer-review or human native-review claim.
- Criminal acquittal, administrative enforcement and civil compensation are explicitly separated. Administrative sanctions and Article 376 are labelled as explanatory material not expressly applied/cited by the judgment. There is no foreign-law comparison.
- The article otherwise limits the acquittal to this record and expressly avoids deciding different road widths, durations or patterns of insults. The recording guarantee in issue 2 is the exception that must be repaired.
- Taiwan vocabulary, Traditional Chinese characters, court/law names and a calm narrative register are used. The title identifies this case's specific timing issue; the body separately explains the coercion and insult analyses. The narrative headings are not imperative checklists. The single reader-engagement passage is tied to the timing dispute.
- There is some repetition of the camera calculation and U-turn in the ending, but it does not create an additional material voice defect. No stylistic rewriting is necessary to repair the substantive findings above.

### First-two-paragraph sentence-deletion check

| Sentence | Information lost if deleted | Result |
|---|---|---|
| 「2024年（民國113年）7月28日傍晚6點58分左右，新北市中和區。」 | Full incident date, approximate time and district. | Keep. |
| 「一輛自用小客車在路上迴轉……還按喇叭示警。」 | Initial vehicle movements and the horn that preceded the pursuit. It does not itself decide right of way. | Keep. |
| 「汽車駕駛隨即加速追趕……等語。」 | Pursuit, forced stop, window account and the exact insult. | Keep. |
| 「號誌轉為綠燈後，汽車仍擋在前方。」 | The changed signal and continued obstruction after the red light. | Keep. |
| 「騎士繞到汽車右側想直行離開……汽車才開走。」 | Attempted departure, renewed rightward obstruction and the driver's departure. | Keep. |
| 「這段經過汽車駕駛並不爭執……也都認定屬實」 with citations | Crucial distinction between factual findings, the defendant's position and the later legal acquittal; source attribution. | Keep. |

## Minor edits applied

- None. The column was left unchanged. All four required corrections are described above for the writer; no facts, numbers, citations, legal conditions or other project files were edited.

VERDICT: FIX
