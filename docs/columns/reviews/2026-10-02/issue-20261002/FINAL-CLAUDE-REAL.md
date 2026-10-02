# FINAL review (real Claude Code) — ISSUE-20261002

Date: 2026-10-02, about 10:24–10:45 KST.
Reviewer: Claude Code CLI 2.1.287, `claude -p --model opus`, on MacBook Air (son7ui-MacBookAir.local). Tools allowed: Read, WebFetch, WebSearch, Grep, Glob.
This supersedes `reviews/FINAL-CLAUDE.md`, which was a coordinator self-review and does not count as a final review.

## Method
- Each piece was reviewed in a fresh `claude -p` session, given RULES.md, EDITORIAL-VOICE.md, research GATE-20261002.md, and the official Decree 283 PDF.
- The four checks were facts/sources, native-language naturalness, internal notes, and mechanical rules.
- Verdicts: PASS = publishable as-is (only NITs may remain). Any MAJOR or MINOR = FAIL, and the reviewer printed a full corrected file.
- Corrected files were applied and re-reviewed in a new session. Limit: 4 rounds; still FAIL at round 4 = dropped.
- Raw prompts and outputs are in `claude-raw/` (`<lang>--<id>-prompt-rN.md`, `-out-rN.md`).
- Before round 1, the coordinator removed leaked internal notes:
  - vi-10 subheading
  - vi-11 internal path, "bản nháp", "memo nội bộ", "hôm qua", and the "Checklist" heading
  - ja-04 「昨日の…焼き直し」
  - ko-02 / ko-03 / ja-05 writer instructions
  - the en-07 imperative title
- Decree 283 amounts were cross-checked independently with tesseract `vie` OCR of the official PDF: Điều 3(4), 7(1)(2), 13(1)–(6), 66(1)(4) and 67(1)(2) all match.

## Verdicts

| ID | Lang | Slug | Rounds | Final |
|---|---|---|---|---|
| 01 | ko | taiwan-supreme-court-ai-appellate-briefs | r1 FAIL → r2 FAIL → r3 PASS | PASS |
| 02 | ko | kmt-caning-criminal-code-draft-debate | r1–r4 FAIL | DROPPED |
| 03 | ko | unimicron-bridgestone-hukou-plant-land | r1–r3 FAIL → r4 PASS | PASS |
| 04 | ja | agc-yunlin-mol-sit-in-hunger-strike | r1 FAIL → r2 FAIL → r3 PASS | PASS |
| 05 | ja | marriage-leave-14-days-employer-subsidy | r1–r4 FAIL | DROPPED |
| 07 | en | micron-ceo-margins-taoyuan-strike-vote | r1–r3 FAIL → r4 PASS | PASS |
| 08 | en | marriage-leave-14-days-foreign-employers | r1 FAIL → r2 FAIL → r3 PASS | PASS |
| 09 | en | supreme-court-ai-appellate-briefs | r1 FAIL → r2 FAIL → r3 PASS | PASS |
| 10 | vi | avc-vietnam-expansion-meeting-planning | r1 FAIL → r2 FAIL → r3 PASS | PASS |
| 11 | vi | decree-283-work-permit-fines-inside-vietnam | r1 FAIL → r2 FAIL → r3 PASS | PASS |

## Main findings fixed
- 01 ko / 09 en: Criminal Procedure Code Art. 380 was misdescribed as the appeal-brief provision. It now cites Art. 377 / 382 / 395 correctly. Also fixed:
  - "signed/sealed" wording
  - a title that overstated the ruling
  - preview sentences
  - translationese
- 03 ko: Fixed:
  - a Japanese word (分け) inside the Korean text
  - meta and preview sentences
  - an imperative heading
  - a sources entry that was a note
  - foreign land-acquisition permit framing
- 04 ja: Fixed:
  - the internal note
  - a title broader than the body (parent-company duties)
  - Art. 35 / Art. 8 wording ("prohibits" rather than "limits")
  - 爭議處理法 naming
  - the checklist heading
- 07 en: Fixed:
  - Art. 53 content (mediation precondition, rights-dispute strike ban, adjudication exception)
  - Art. 35 voidness
  - Art. 8 scope
  - CNBC vs earnings call
  - the mediation failure date (21 Sep, not 22 Sep)
  - the offer scope
  - an imperative heading; "Official sources" renamed "Sources"
- 08 en: Fixed:
  - the seconded-staff passage, which implied parties can contract out of the Taiwan minimum (LSA Art. 1)
  - BLI budget/payment conditions
  - FAQ and summary imperative tone
- 10 vi: Fixed:
  - a title that read as an instruction
  - an invented localisation-commitment claim
  - IRC/ERC jargon
  - a sources list that mixed press and law
  - citations now to Law on Investment 143/2025/QH15 (in force 1/3/2026) and Taiwan's outbound-investment basis, shown inline
- 11 vi: Claude read the official signed PDF (Điều 3, 4, 7, 13, 66, 67) and replaced the secondary-source amounts with the verified statutory amounts, so the [chưa xác minh] markers were removed:
  - organisations pay double the individual amounts (Điều 7)
  - the employer fine is 60–90 million VND for 1–10 persons (organisation)
  - the worker fine is 15–25 million VND
  - "cán bộ" replaced by "nhân sự/quản lý, kỹ sư người Đài Loan"
  - internal notes and the checklist heading removed
- 02 ko (dropped):
  - r1 caught the wrong law link: pcode C0000008 is the narcotics act; the fraud act is D0080226.
  - r4 still FAIL (MINOR): a sourcing mismatch for the 28 Aug CEC decision date (cited EBC 14 Aug article).
  - The r4 corrected text is kept, unreviewed, under drafts/held/.
- 05 ja (dropped):
  - r4 still FAIL (MINOR): FAQ 3 did not limit leave-rule coverage to workers under the Labor Standards Act (Art. 43 basis; household caregivers excluded).
  - The r4 corrected text is kept, unreviewed, under drafts/held/.

## Residual (non-blocking NITs)
- Listed in each passing `-out-rN.md`; not applied, so published text = exactly the text that received PASS.
- Model review is not a native-speaker or lawyer review.
