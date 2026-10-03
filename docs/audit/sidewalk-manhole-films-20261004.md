# Sidewalk video timing and manhole recourse films

Traditional Chinese articles 172 and 173 each receive one silent film: 200 seconds / 20 distinct scenes and 240 seconds / 24 distinct scenes. Each segment uses ten seconds of native Grok 4.7 motion; no repeated segments, slowing or held frames. New Codex references produced the stationary bicycle/scooter sightline and generic manhole-condition scenes. Other scenes are relevant, previously reviewed independent illustrations. Both articles and their author metadata remain unchanged.

Evidence root: `/Users/son7/tseng-law-traffic-films`. Primary source URLs, raw hashes and fetch receipts are in `qa/sidewalk-manhole-primary-receipts.json` and `qa/sidewalk-manhole-laws-receipts.json`. The entire current articles, sidewalk trial and fee order, and 14-page manhole appeal including its tables were read. Relevant NIST 3.2 text and native PDF pages 14/17, plus native manhole pages 6/8/9/11–14, were inspected. No original accident recordings or full case files were obtained.

| Material | Issue | Final treatment | Meaning preserved |
| --- | --- | --- | --- |
| Bicycle opening | A stationary fictional scene could be mistaken for the actual collision. | Clearly label dismounted bicycle rider and parked scooter; disclose that the case bicycle was being ridden. | No reconstruction or calibrated sightline claim. |
| First generated opening | An extra parked scooter changed the alley sightline. | Reject v1; use the separate v2 generation, sampled throughout at 2 fps. | Only the two reference vehicles remain. |
| Sidewalk trial | Claimed speeding or lack of slowing could become a finding. | Attribute plaintiff's account; identify 115板簡1066, June 30, 2026, and dismissal of NT$187,147 plus interest and provisional enforcement. | Claimed amount is not an award; civil case was appealed. |
| Four recordings | Clip timestamps could become accident clock time or measured speed. | Distinguish each appendix recording, occlusion, qualitative “車速非快” and file-access freezes/acceleration. | Unknown equipment cause; no invented speed, missing trajectory or audio. |
| Scooter falling | The plaintiff's repeated assertion could displace the inspection record. | Preserve first-video fall and fourth-video rightward tilt; explain the court's rejection of that argument. | Do not infer a separate collision account. |
| Sidewalk and due care | The case could imply every sidewalk prohibits bicycles, or pillars/low speed exempt drivers. | Preserve current 124(3) signs/markings condition and 93/94 duties. | “無規定時” revised to explicit “無標誌、標線時”. |
| Burden of proof | Trial shorthand could become a universal plaintiff-must-prove-fault rule. | Explain Civil Code 191-2 due-care exemption and Procedure 277 legal/unfairness exceptions in separate chapters. | No prediction of appeal outcome; criminal non-prosecution does not replace civil inspection. |
| Appeal status | Fee order or criminal finality could become civil finality. | July 27 order: NT$4,005 within five days of service; October 4 history lists 115簡上383 without date/full text. | Later payment, appeal result and finality unverified. |
| File preservation | NIST could become a mandatory Taiwanese evidentiary format or the case's forensic method. | Preserve originals, provenance, available metadata and separate conversion records; identify NIST only as methodological reference. | No evidentiary outcome guarantee or assertion about missing audio. |
| Manhole opening | Generic circular cover could be mistaken for actual rectangular No. 3. | Disclose independent fiction, different shape and no actual dimensions, depth, fall or measurement. | No causal conclusion from generated imagery. |
| Payment and shares | 60% / 40% could become rider negligence or reduced victim payment. | Preserve paid NT$2,810,000 settlement; company recourse NT$1,686,000 and agency's own NT$1,124,000. | These are internal management shares, not victim fault or another award. |
| Inspection and maintenance | Completion or road permission could remove continuing duties. | Preserve utility and road-agency obligations, joint liability and facility-specific inquiry. | Current road 30-1(7), use rule 8, and Taichung 29/30 distinguished from former 31/32. |
| Expert evidence | Initial assessment, later opinion or simulation could become measured accident physics. | Explain later court-adopted analysis, No. 5-to-No. 3 correction, assumed 40 km/h and estimated reaction times. | No original crash footage, precise reconstruction or universal rider exemption. |
| Internal recourse | Old State Compensation 3(2), now 3(5), could transfer the agency's own share. | Preserve State Compensation 5 with Civil Code 185/281 and payment beyond own share releasing the other party. | Agency's 40% remains its own; no universal responsibility ratio. |
| Interest and finality | Interest could start on the crash date; missing later judgments could prove finality. | Annual 5% from October 6, 2019, as requested after complaint service; official news still allowed appeal. | Company repayment, execution and finality unverified. |
| Other claims | This case could guarantee recovery for all potholes. | Preserve defect, harm, causal connection, Civil Code 217, responsible agency and prior written State Compensation request. | Two years from knowledge / five from harm are retained; evidence suggestions are not a fixed court list. |
| Scene fit | Medical consultation appeared under burden-of-proof and ordinance-number chapters. | Replace sidewalk 14 and manhole 8 with records-review scenes. | Legal wording preserved; revisions in `qa/sidewalk-manhole-revisions.json`. |

All 44 final chapter samples were visually read, including the three revised frames. Browser screenshots reviewed include sidewalk desktop/ch14 and manhole mobile/ch15. Body captions are at least 35px / 33px in the 1280×720 files, with synchronized page captions of at least 16px. Focused native controls can overlay burned-in captions; the separate page caption remains readable. Existing language suggestion toast can overlap the lower disclosure.

All 421 tests in 29 files and clean `.next-sidewalk-manhole-films` build passed. Three old “no video” expectations were updated after confirming the new registry entries. Four complete normal-speed mobile/desktop journeys passed, including every chapter, no-gesture autoplay, preserved manual pause after scrolling, native seeking, reduced-motion manual playback, no overflow/page errors, exact asset hashes and HTTP 206 byte ranges. Reports: `qa/local-sidewalk-video/report.json` and `qa/local-manhole-recourse/report.json`.

The browser QA runner now accepts an optional locale filter and limits simultaneous page journeys to 1–8, default 8. Real runs exercised a one-slot queue across both sidewalk widths and a two-slot manhole run. Film selection continues to use the existing registry. This avoids opening every locale simultaneously during the remaining language work.

| Film | Duration / frames | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| sidewalk-video-film-v1-zh-hant | 200 s / 4,800 | 19455382 | `c0e50e7f92ee6c19329c74b05b6364aa4f9af83dc32cd8fa57cec113f9964f10` |
| manhole-recourse-film-v1-zh-hant | 240 s / 5,760 | 23731376 | `490dce78daeb0412eeeeb50329a61bf91767cd70a088d18e5b6f695e4c06321d` |

Both are silent H.264 at 24 fps and fully decoded without error. Codex local final review passed. Production publication remains pending after automatic approval review rejected the main push; no publication is claimed.
