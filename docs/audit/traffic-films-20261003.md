# Traffic column films — first publication batch

User request: replace very short, unclear traffic column clips with a sequence of Codex image references animated by Grok 4.7, joined into one longer video per article, and start playback automatically.

This batch covers the general traffic procedure article in Korean, English, Traditional Chinese and Japanese. Each file is 80 seconds: eight distinct 10-second scenes, with numbered explanations in the page language. The full task remains open for the other traffic articles and language pages.

## Content and production

Sequence: fictional rear-end collision; move to safety and report; record photographs; preserve original records; medical examination; repair evidence; work-loss records; review settlement terms.

Captions summarize the existing article's Q1–Q2, Q6–Q8, Q11 and Q16. They do not change the article, infer fault from the fictional collision, promise compensation, or add legal deadlines. The on-screen label and figure disclosure identify AI-generated fictional people/scenes. The laptop displays an external roadside photograph, not purported authentic dashcam footage.

Evidence folder: `/Users/son7/tseng-law-traffic-films`. Image references, Grok CLI receipts, original clips, source hashes, storyboard, assembly hashes and contact sheets are retained there. Grok ran with `--model grok-4.7 --tools reference_to_video`, exactly one generation request per scene. Each generated source is approximately 10.04 seconds; assembly trims to 240 frames per scene at 24 fps. No scene repeats or slow-motion padding. Final MP4s contain a single silent H.264 stream, 1280×720, 1,920 frames, exactly 80 seconds, with fast-start metadata.

## Playback

Traffic-column generated videos start muted and inline on first entering the viewport. The reader retains native pause, seek and fullscreen controls. Later scrolling does not restart a paused/finished video. Reduced-motion preference preserves manual playback. A browser rejection of autoplay leaves the controls usable. Non-traffic generated videos keep their previous manual behavior.

A synchronized 16px explanation below the video remains readable on mobile even when native controls cover the burned-in subtitles. Native seeking updates the explanation to the corresponding scene.

## Copy review

| Previous wording | Problem | Change | Meaning preserved |
| --- | --- | --- | --- |
| General article captions described a four-second impact only. | Does not describe the new explanatory sequence. | Name the 80-second sequence and its evidence/settlement steps, in each of the four languages. | Article conditions and legal content unchanged; duration and visible actions updated. |
| Eight existing road-rage captions said to press play / loop once played. | Contradicts the traffic autoplay behavior. | Say the silent clip starts when visible and loops. | Existing scene description, length and fictional-scene limitations preserved. |

## Verification

Local evidence includes targeted unit/render tests, ESLint, production build, full-file FFmpeg decoding, source checksums, 2-fps contact-sheet inspection of each entire source clip, and visual checks of the four captioned chapter sheets. Browser checks cover four languages at desktop/mobile widths, automatic start without a prior gesture, manual pause surviving scroll, native keyboard seeking, normal-speed playback through all eight chapters, reduced-motion manual playback, layout and JavaScript errors. MP4 responses must match local SHA-256 and support HTTP byte ranges.

An initial browser-test failure was a test assumption: Chromium's right arrow advanced 0.8 seconds for an 80-second file, less than the test's assumed two seconds. A focused probe demonstrated pause, keyboard seeking, end-key seeking and timeline clicking all worked. The test now checks actual forward movement and preserves the paused state.

Deployment and public verification are recorded in the task evidence and handoff after publication; this document alone is not a deployment claim.
