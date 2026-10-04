# Integration of 152 reviewed traffic films with production

The candidate integrates the locally reviewed film branch at 17aceacbb with production main 466d874c7039648a6d4325dc23ab93e72397dea1. The merge was conflict-free. Its only overlapping file was the traffic-collection test; both the long-film coverage and the incoming article ordering were retained.

The incoming English, Japanese and Traditional Chinese redesigns, archive/search hydration fix, article 204 and updated short-video assets/mappings remain present. The long-film registry retains priority on its own reviewed pages. Its independently reviewed fictional scenes are unchanged. Article 204 and its four locale pages are outside this batch's frozen 165-page source inventory; their incoming content and existing video are preserved.

All 165 frozen source hashes and all 152 long-film hashes remain unchanged. Nine long films are already live; the additional 143 language-page films are the proposed publication scope. The four remaining topics / 13 language pages have reviewed captions and source checks but lack their four new native clips because the Grok CLI stopped accepting the requested 4.7 model. They are not included in the proposed publication scope. No model substitution was made.

Validation after integration:

- 760 tests in 53 files passed, covering the traffic/video suite and the incoming changed test files.
- A clean production build in `.next-publication-143-final-films` passed. The build produced upstream Autoprefixer compatibility warnings; no build error occurred.
- All 152 registered film pages passed initial no-gesture autoplay and layout checks at both 390px and 1440px: 304 views, no page errors, matching source/duration, one player, no looping, mute, inline playback, normal speed, readable synchronized captions, document language, correct LTR/RTL direction and border, and no horizontal overflow.
- The first layout check incorrectly required zero-padding of total chapter count (`08` instead of the product's `8`). It produced 182 passes and 122 assertion failures. The assertion was corrected to compare chapter numbers; the same unchanged build passed all 122 reruns. The final report combines those with the prior 182 valid passes. This was a QA correction, not a player change.
- All 15 English/Japanese films passed full normal-speed playback at both widths: 30 journeys, with native pause/seek, every chapter, media hashes and HTTP 206 ranges. Reduced-motion manual playback passed. These new full journeys specifically cover the redesigned locale shells.
- Eight final figures were visually inspected: English desktop, Japanese mobile, Korean mobile, Traditional Chinese desktop, Arabic mobile, Persian desktop, Hebrew mobile and Urdu desktop. Captions and chapter counters remain readable. The existing language suggestion toast can overlap lower descriptive text on some views.

Evidence under `/Users/son7/tseng-law-traffic-films`:

- `qa/merged-143-tests.log`
- `qa/merged-143-build.log`
- `qa/local-merged-all-layout/report.json`
- `qa/local-merged-all-layout/report-before-counter-assertion-fix.json`
- `qa/local-merged-en-ja/report.json`
- `qa/local-merged-final-screens/`
- `qa/publication-bundle-152-pages-20261004.json`
- `qa/PUBLICATION-143-REVIEW.md`

Earlier complete playback checks for every film remain bound to the unchanged media hashes in the publication manifest. No second whole-film run is claimed for every non-English/Japanese locale. The inherited trailing blank line in upstream `globals.css` is preserved; the film delta against the incoming production tree passes whitespace checking.

Codex local integration review passed. This merge is not a production publication. The explicit work-loss approval has already been fulfilled; the additional 143 films await a separate concrete publication decision. The intended route is the existing Git-connected main push and automatic deployment, followed by public playback and media verification.
