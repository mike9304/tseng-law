# Final four traffic topics: thirteen local films

Status: content, media, tests, build and full browser verification passed. The original user request includes publication. Codex withdrew its unnecessary separate approval gate after the user asked why these thirteen had not been uploaded. Final production integration is recorded below; public deployment verification is tracked in the external evidence directory.

The videos extend four existing article topics into one MP4 per native language page. They use different native 10-second shots within each film, at 24fps, with localized burned-in text, matching browser chapters, a permanent AI illustration label, muted automatic start and native controls. There is no loop, retiming or still-frame padding. Each original article is unchanged.

| Topic | Languages | Duration | Scenes |
|---|---|---:|---:|
| 撤銷九年判決的追逐自摔案 | zh-hant | 160s | 16 |
| 台66線夜間快車道停車 | zh-hant, ko, en, ja | 140s | 14 |
| 兩車追逐與自提錄影 | zh-hant, ko, en, ja | 180s | 18 |
| 114秒扣除52秒與無罪範圍 | zh-hant, ko, en, ja | 180s | 18 |

## Source and factual review

- Pursuit: lead with the vacated first-instance nine-year conviction and defendant's death. The appellate procedural non-acceptance is not a merits acquittal. The first earlier contact and the later non-contact pursuit stay distinct. The 78km/h display belongs to the car. Trial reasoning is consistently presented as vacated; subsequent appeal/finality is unverified.
- Night stop: distinguish the prosecutor's June 9, 2025 inspection from the court's adoption of the indictment and confessions. The 2:56 stop, 27 slowing cars and 4 hazard-light responses are evidence in this case, not legal thresholds. The 90km/h figure is a limit. Three months and NT$1,000/day are a sentence/conversion rate, not a traffic penalty or verified payment.
- Own dashcam: distinguish black-car 151km/h from white-car 89/101/123 and earlier 125 displays. Source clocks are not synchronized; the 50km/h ramp limit is not universal. The black-car defence's GPS challenge is attributed correctly. Explain each five-month sentence and the white-car driver's procedurally deficient Supreme Court appeal; do not imply a new fact trial or civil allocation.
- Red light: calculate 114 seconds and 52 seconds within their separate recordings. Explain the court's case-specific subtraction, road space and actual departure; there is no 62-second permission. Retain the window/door discrepancy, contextual insult analysis and acquittals, with no invented civil or administrative result.

The 13 article files and their SHA256 values are in the external evidence manifest. The trial/appellate/Supreme Court records and relevant official statutes were read as recorded in the four source-review files. All images and generated footage are fictional illustrations, not the case evidence.

## Copy and media review

Editorial rules: docs/columns/EDITORIAL-VOICE.md. All public film text was read in ZH/KO/EN/JA; there is no decorative bold markup. Seventy earlier wording/fit revisions are recorded in qa/pending-caption-refinements.json; four final revisions are in qa/pending-final-caption-refinements-20261004.json. The final English night-stop caption clarifies filing at the trial court rather than the court hearing the appeal. Japanese 本片 became この動画. Facts, numbers, conditions and media AI notices are retained.

Four new Codex reference images were animated through Grok 4.7, one successful reference_to_video call per scene. Earlier attempts had zero tool calls and failed on restricted-environment model discovery; they are archived, not reused as quota evidence. No 4.6 was used. Four originals fully decoded; 80 native frames at 2fps were inspected. Each assembly uses the first 240 native frames and removes audio/attached pictures. Existing supporting scenes had earlier recorded reviews.

All 216 final chapter samples were visually read after the last copy change. All 13 final files fully decoded; 720p H.264, 24fps, expected frame count and exact 140/160/180-second lengths. Minimum burned-in body text 31px; no caption clipping or overlap. Total final video bytes: 206,521,883.

## Verification

- Regression: 53 test files, 764 tests pass (qa/final-thirteen-tests.log). Vacatur-first wording and native-language single-film selection are covered.
- Build: clean isolated candidate production build passes in .next-final-thirteen-films (qa/final-thirteen-build.log).
- Browser: all 26 PC/mobile full normal-speed playback journeys passed at 127.0.0.1:4636, with no page errors or horizontal overflow. Each film started muted without a gesture, respected manual pause, supported native keyboard seeking and played to completion with synchronized chapters. All 13 served media hashes and HTTP 206 range responses matched; reduced-motion manual playback passed. Report: qa/local-final-thirteen/report.json, completed 2026-10-04T00:46:14.399Z.
- Visual: one actual browser figure for every language/film pair (13 total) was read after the final build, in addition to the 216 final chapter samples. Video and chapter text are legible. The existing English-language switch toast can temporarily cover lower descriptive text on some mobile pages; it does not cover the video or synchronized chapter.
- Integrity: all 13 source article hashes and final media hashes were checked again. The 152 existing registry entries are unchanged; the only additions are these 13 films, bringing the locally reviewed registry to 165 pages.
- Evidence root: /Users/son7/tseng-law-traffic-films.
- Manifest: qa/publication-final-thirteen-manifest.json. Source reviews: qa/{pursuit-vacatur,night-stop,own-dashcam,red-light}-content-review.json.

Codex performed this review. No external lawyer/native-speaker review or Fable approval is claimed. The original production article 204 and its incoming short video remain preserved outside the frozen 165-page batch.

## Production integration after the user's follow-up

Merged production main `1de3e0d89`, retaining incoming company/employment videos, articles 204–206 and reviewed short scene assets. The incoming multi-video resolver appended a short collision clip beside the 180-second film in four languages. Existing tests reproduced the duplicate-player regression. The resolver now returns the single combined film when that article/language has one; other reviewed registrations and the supplementary-scene fallback remain intact. Assertions cover the single player, correct media/caption IDs, no loop and no additional standalone clip.

Three incoming assertions still said articles 205/206 had no videos, despite their reviewed production registrations. Updated those tests to assert the exact registered video IDs and correct search filter inclusion; article text and production assets are unchanged.

Integration validation: 774 tests in 54 files pass, clean `.next-publication-final-thirteen` build passes, all 330 desktop/mobile autoplay/layout checks pass with exactly one generated player per page, and all eight affected 180-second full-playback journeys pass. Manual pause, native seeking, four served media hashes/ranges and reduced-motion manual playback pass. Four final browser figures were visually inspected. All 165 frozen source and video hashes remain unchanged. Evidence: `qa/final-thirteen-release-tests-final.log`, `qa/final-thirteen-release-build.log`, `qa/local-final-165-release-layout/report.json`, `qa/local-final-thirteen-release-full/report.json`, and `qa/final-thirteen-release-integrity.json` under `/Users/son7/tseng-law-traffic-films`.

Latest-base check: production then advanced to `b6d14db96` with only two employment-caption JSON files and their audit. Merged those unchanged. The final candidate passes 774 tests/54 files, a clean `.next-publication-final-thirteen-latest` build and eight additional mobile/desktop single-player autoplay checks. Traffic component code, all 165 film registrations and all reviewed traffic source/media hashes are unchanged from the preceding integration checks. Evidence: `qa/final-thirteen-latest-tests.log`, `qa/final-thirteen-latest-build.log`, and `qa/local-final-thirteen-latest-layout/report.json`.
