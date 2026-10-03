# Linkou freeway cut-in film

Four language pages now have one 174-second, 18-scene film each. A native four-second fictional cut-in is followed by seventeen distinct native ten-second scenes. No clip is repeated, retimed or held to increase runtime. A new Codex reference led Grok 4.7 to generate the comparison scene. Source articles and author metadata remain unchanged.

All four articles and the complete first-instance judgment, attached indictment and appellate judgment were read. Primary evidence: PCDM 113 審訴 716 (2025-03-06), TPHM 114 上訴 5567 (2026-01-14); source URLs and hashes are in `qa/freeway-cut-in-primary-receipts.json`. Criminal Code 185, 304, 55, 57, 33 and 41; Criminal Procedure 348; traffic penalty rule 43 were checked. No original recording, case file, vehicle data or activation log was obtained.

| Reviewed wording or scene | Issue | Final treatment | Meaning preserved |
| --- | --- | --- | --- |
| Opening | One generic cut-in cannot establish four cut-ins, three brakes or automatic braking. | Explicitly separate the fictional opening from the courts’ findings. | No measurement or incident reconstruction is asserted. |
| Automatic braking | English heading could imply the verification method was known; Korean wording was awkward. | “Automatic braking: method unstated”; explain that the judgments record activation but not its verification. | No technical examination or log is invented. |
| Screenshots | Paper and laptop props could appear to be actual case evidence. | State the approximately twelve-second record and unspecified camera source; label the comparison as fictional. | 15:10 narrative and approximately 15:08 screenshots remain uncalibrated. |
| Police account | Driver allegations could become court findings in every detail. | Distinguish shoulder driving, durations and passing-count claims from the accepted mutual lane contest. | No finding about every alleged detail is added. |
| Sentencing | Reduction could imply acquittal, new admission or settlement. | Explain the sentence-only appeal and missed consideration of the taxi’s conduct. | Admission and lack of settlement were already before the first court. |
| Forty days | Detention could be translated as imprisonment, or conversion as a paid fine. | Preserve detention, NT$1,000/day and the conditional NT$40,000 total. | Article 41 conditions and correction/legal-order exceptions remain; payment is unknown. |
| Other consequences | Sentencing responsibility could become a civil allocation or a traffic penalty. | State that civil ratio, notice recipients/basis and later finality were not verified. | Rule 43 remains background only. |
| Dense translations | Smaller text reduced readability. | Shorten individual Korean, English and Japanese lines; before/after record in `qa/freeway-cut-in-caption-revisions.json`. | Dates, offences, conditions and uncertainty remain. |

The new source was sampled at 2 fps throughout; the older source at 5 fps, with its prior 97-frame review record also read. All 72 final chapter samples were read; corrected Korean/English chapter 4 was re-read after the final render. Actual browser screenshots were inspected in all four languages. Separate synchronized captions remain at least 16px when focused native controls cover burned-in captions. The existing language toast can overlap lower disclosure text.

All four silent H.264 files fully decode at 1280×720, 24 fps, 4,176 frames. All 421 tests in 29 files passed after upstream integration and the film registry update; the component test was repeated after final caption edits. Clean `.next-freeway-cut-in-films-final` production build passed. Eight complete normal-speed desktop/mobile journeys passed: no-gesture autoplay, every chapter, pause preserved after scrolling, native seek, reduced-motion manual playback, no overflow/page errors, matching hashes and HTTP 206 ranges. Report: `qa/local-freeway-cut-in/report.json`.

Evidence root: `/Users/son7/tseng-law-traffic-films`. Codex local final review passed. Production publication remains pending after automatic approval review rejected the main push; no publication is claimed.

| Locale | Bytes | SHA-256 | Minimum body text |
| --- | ---: | --- | ---: |
| zh-hant | 16767727 | `e53174c9ecc97786c5d3edd0ceae5e4af066221f0592e9744ff59c17443d08bc` | 33px |
| ko | 16598133 | `3f00b0d4e3539bfd058ae000abf2eeeb6a079db78978497e525d23cc14cee77e` | 31px |
| en | 16561409 | `576de1f4d3653661d754cbc3aef3eddce6faecfdbfcbf68fe47f318c3235ccc3` | 31px |
| ja | 16481955 | `9c9004649bf4a18edfe0067674b22c832c0f154963376f8c3593da798a5eb548` | 31px |
