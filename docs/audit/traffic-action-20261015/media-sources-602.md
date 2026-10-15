# Rain action cross-review — 2026-10-15

Independent visual QA only. Root retains final publication approval. Source files, selections and videos were not edited. All times below are source seconds unless explicitly called master time; recommended intervals are start-inclusive/end-exclusive.

## Decision

The five sources preserve the white lead SUV / dark following sedan relationship. Within the recommended intervals, I did not observe vehicle duplication, pass-through, a second collision, or the conspicuous impact-damage restoration seen in the rejected merge-front clip. This is an observation from the reviewed frames, not certification of physically accurate crash simulation.

The submitted 47.000-second clean master is CONDITIONAL, not a final publication pass. Its long low-action side/elevated spans work against the request for action. Recommended trims total 40.5 seconds. Do not extend them with holds solely to retain 47 seconds. Root must also add separate-reconstruction/replay identifiers: each new viewpoint resets vehicle distance and damage and is not synchronized continuity.

| Source | Verdict for submitted selection | Recommended trim | Contact evidence | Main limitation |
|---|---|---|---|---|
| rain-dash-b | ACCEPT | 0–9.75 | Closure at 8.125–8.5; splash/hood and SUV-rear deformation visible by about 8.25 | Precise bumper first-touch partly hidden by hood/spray |
| rain-side-b | CONDITIONAL | 0–7.0 | 4.25–4.625; follower nose compresses into SUV rear, then both move right | 7–9.5 contributes very little new vehicle action |
| rain-elevated-a | CONDITIONAL | 3.5–8.5 | 5.125–5.625; gap closes then water/displacement | Nearly stationary 1–3.75; exaggerated foam/water; weak quantitative physics evidence |
| rain-rear-a | CONDITIONAL | 0–9.75 | Following hood buckles about 8.25, retained to 9.75 | Bumper-to-bumper contact is below the image; cannot independently establish lead braking |
| rain-low-b | CONDITIONAL | 0–9.0 | 1.875–2.375; front-to-rear contact, persistent crushing and forward travel | Lead rear lamps are already lit in the first frame; no distinct fresh brake-on moment proven |

## Per-source observations

### rain-dash-b

0–4: road markings/trees and wiper movement accompany forward travel. The lead vehicle remains white, ahead in the same lane. Brake lights strengthen clearly by about 4.25, before the 8.125–8.5 impact window. The gap closes through 6–8.125. No impact damage is apparent at 8.0; hood/SUV-rear damage and splash follow in the contact window. Deformation remains through 9.75 rather than restoring. No reverse trajectory or pass-through observed. This is the strongest complete approach–brake–contact–aftermath sequence of the five.

### rain-side-b

Actual left-to-right car movement is visible against the roadside. Lead braking/red road reflection strengthens around 2.75–3.0, preceding the 4.25–4.625 contact. The dark sedan nose deforms and remains against the white rear, with forward displacement. Enlarged 4.5 and 8.0 frames retain the kinked dark hood/crushed nose; there is no supported healing claim. By roughly 7.0, new movement is very small. Use 0–7.0 to keep the approach, contact and settling without a long hold. Separate-view identifier required.

### rain-elevated-a

The submitted 1–10 selection contains almost stationary cars and background through roughly 3.75. Closure becomes clear around 4–5.5; stronger white brake lighting precedes contact (about 4.5 versus contact 5.125–5.625). Cars remain in lead/follower order; I did not establish a reversal or pass-through. There is perspective/body wobble and a disproportionately large foam/wave effect around 5.75–7.75. Do not present it as a physical reconstruction of speed, stopping distance or collision force. 3.5–8.5 preserves precontact geometry, contact and short aftermath while removing the weakest holds. If a naturalistic physics look is required, omit this source rather than describe the water as realistic.

### rain-rear-a

Rear-window/defroster framing and the following sedan identify a rear-facing view from the lead car. The sedan enlarges on approach; its hood is initially intact, then buckles around 8.25 and stays buckled through 9.75. The actual bumper boundary is below the frame. It can support the approach and front-damage aftermath, not a claim that bumper first-touch is directly visible. It cannot show the lead driver's brake onset from this camera. Use only after/with an accepted complete lead-braking/contact view and a clear separate-reconstruction label.

### rain-low-b

Two actual bodies move left-to-right, closing the initial gap. Contact is in the 1.875–2.375 interval. Nose deformation develops and remains apparent through the selected 9.0 endpoint; no healing, pass-through or renewed second collision observed. Background movement continues with the cars, so this is not an idle camera orbit. Lead rear lamps/red reflection are already visible at 0, 0.75 and 1.25. It is defensible to show already-braking/gap closure/contact; it is not defensible to claim this shot establishes a new brake-on event at an invented timestamp. There is no visible pedestrian/object that establishes why the lead vehicle brakes.

## Master inspection

`rain/delivery/rain-action-clean-master-47s.mp4` is 1280×720, 24 fps, 47.000 seconds and 1,128 frames, with one video stream and no audio stream. Full decode succeeded with no reported errors. This verifies a structurally silent master, not an audio listening review. Original audio was not changed or listened to by this reviewer.

Whole-master 1fps pages 1–3 and the adjacent raw frames at all four cuts were viewed. Cuts occur at master 9.75, 19.25, 28.25 and 38.0. The boundary frames and last frame 46.958333 are valid pictures with no observed black flash. Each cut resets to separated/undamaged cars in a new viewpoint. Without the planned labels, the clean master would misleadingly resemble repeated separate collisions or inconsistent continuity. It therefore remains an intermediate artifact.

## Evidence and limits

- Every source: `<source>-1fps-page*.jpg`, `<source>-4fps-page*.jpg` plus extracted full-resolution frames and `<source>-manifest.json` in this directory. Whole source timelines were inspected, including excluded tails.
- Additional high-frequency inspection: producer `rain/qa/<source>-contact-24fps.jpg` and its `contact-frames-24fps/<source>/index.json`; low-b brake/contact 8fps sheet. High-frequency timestamps are approximate windows, not claims of an invisible exact bumper first-touch frame.
- Master: `rain-action-clean-master-47s-1fps-page*.jpg`, `rain-master-boundaries-page*.jpg`, boundary index and manifest.
- Full decoding exited 0 for all five sources and the master. SHA-256 was independently calculated, matched producer records and rechecked unchanged when writing this report. Exact hashes and machine-readable verdicts are in `rain-cross-review.json`.
- This review used actual decoded images in chronological sampling and enlarged frames. It does not claim continuous real-time playback, audio listening, legal-liability determination or validated crash simulation.
