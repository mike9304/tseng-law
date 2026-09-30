# Traffic accident board — active work

User goal: make tseng-law.com visibly useful for traffic accident matters, primarily Taiwan, with US/Japan/Korea relevance; write original useful columns, verify against official sources, and use Blender visual explanations. User additionally requires attention to page weight.

## Current boundary

- Isolated branch: `feat/traffic-hub-20260930`, base `origin/main` 636a65f2 (fetched 2026-09-30).
- Shared main is older and has unrelated changes; do not use it as release source.
- New public hub: `/[ko|zh-hant|en|ja]/traffic-accidents`, linked from public navigation and columns.
- Taiwan comes first. Language choice is distinct from accident jurisdiction. US guidance must name the state when discussing a state rule.
- Columns use existing Markdown loader and honest AI authorship for new AI texts. Do not invent lawyer review, specialist certification, case outcomes, or numerical liability.
- Blender source stays outside public assets. Initial media is the existing 51,090-byte WebP still, not a live 3D viewer. Figure caption identifies assumed geometry and states that it is not a forensic reconstruction.

## Completion evidence required

1. Four localized hub pages, Taiwan-first content, country-specific official sources and clear scope.
2. New useful Taiwan columns with inline primary sources; existing 003/012 re-audited before promotion.
3. Blender visualization with accurate labels, mobile readability, dimensions, responsive loading; record actual bytes.
4. Navigation, article-to-hub links, language switching, canonical/hreflang and sitemap behavior.
5. Independent legal/source and code review; scoped tests, typecheck/build, actual desktop/mobile browser journeys and console inspection.
6. Reviewable clean release, any genuinely required publication approval, deployment and production verification.

## Progress

- 2026-09-30: confirmed live columns have two Taiwan accident articles but no dedicated board. Found prior Blender pilot at `/Users/son7/Projects/tseng-blender-pilot/012-overtaking`; inspected still. Research lanes verifying Taiwan and international sources. Goal remains active; no prior implementation turn is evidenced in this thread.
- 2026-09-30: implemented the four-language hub, desktop/mobile navigation, localized article links, sitemap and language switching. Added sourced police-records article 049 in four languages and corrected 003 Q3/Q16–Q20 after source review.
- Validation: full unit suite **1,352 files / 13,136 tests passed**, 14 skipped, 1 todo (`/tmp/traffic-all-tests-final.log`). Typecheck, full ESLint and production build passed. After the full run, added four-locale assertions for Q17/Q18 conditional legal safeguards; the affected four-test suite passed again. Independent implementation review found no remaining code blocker. This is not licensed-attorney approval or release approval.
- Browser QA: eight local journeys (four locales × desktop/mobile) passed, including article round trips, actual language-picker switching, mobile navigation, image decoding, layout overflow, canonical/hreflang and console inspection. Repeat with `node scripts/qa-traffic-hub.mjs`; evidence in `browser-qa.json`, screenshots in `/tmp/traffic-browser-qa/`.
- Media: source WebP **51,090 bytes**; first desktop image transfer **14,182 bytes**, mobile **4,402 bytes** at the tested viewports. Later 300-byte entries are cached requests and are not image payload measurements. No video, canvas or model viewer appeared. These measurements concern the local image, not production whole-page speed or Core Web Vitals.
- Final editorial pass: corrected 003 Q2 emergency routing, Q6 ordinary direct-review deadline and separate criminal-trial commissioning, and Japanese Q15 third-party bodily/property coverage. Other Q1–Q15 content is unchanged except the previously recorded Q3. Focused Q&A/hub tests: **117 PASS**. The exact source and interpretation are recorded in `final-review.md`.
- Existing 012 case provenance traced to imported author text in commit `46c0f8a3`. Removed later-added, unsupported statements about which combined factors the private appraisal report considered. Attributed the result to the original case account; legal explanation and general evidence discussion remain. Four-language editorial review passed. Focused 012/corpus/hub/date run: **52 PASS** before the two additional hub tests were added.
- Production-readiness read-only audit: remote main remains `636a65f2`; current production deployment is Ready (`dpl_FcBh4DNcUS8QpV92pUasWXtghTa9`). Configured Blob store has no draft or publication overlay for 003/049 in ko/en/zh-hant; ja uses Markdown. No CMS writes planned. Exact equality of configured token with active production token was not established; live body verification is still required.
- Actual Fable 5.1 review completed three rounds: REQUEST_CHANGES → REQUEST_CHANGES → **APPROVE (editorial text only)**. All material findings were corrected. Actual CLI model identity verified; public copy only, tools/plugins/memory disabled. Review results are saved in `fable-round1.md` through `fable-round3.md`.
- Added visible localized update dates to revised traffic articles, with date normalization so new 049 does not show a same-day update. Final development browser QA: **8 journeys / 0 findings**, including all three article journeys, AI authorship, update dates, language switching and Q3 anchor popup. `/tmp/traffic-browser-final/report.json` copied to `browser-qa.json`.
- A full run during a parallel build had one 5-second timeout in an unrelated search test (13,137 passed); isolated re-run passed all 19 tests. Final candidate full suite ran without a competing build: **1,352 files / 13,138 tests PASS**, 14 skipped and 1 todo, exit 0 (`/tmp/traffic-all-tests-candidate.log`). Focused final legal corrections: **117 PASS**, `/tmp/traffic-round3-fixed-tests.log`.

- Final candidate lint and production build: **PASS**, exit 0; `/tmp/traffic-lint-candidate.log`, `/tmp/traffic-build-candidate.log`. Build includes TypeScript validation. The existing ContactEditorial autoprefixer warning is unrelated to this change. Generated Next.js configuration changes are excluded from the candidate.

## Pending

- Build the reviewed committed source from a clean tree before release; candidate full-suite, lint and build gates passed. Fable editorial approval is recorded; independent verification of private case files and licensed-attorney approval are not claimed.
- Production columns may prefer builder/CMS or Blob content over repository Markdown; verify corrected 003 is actually served after release, and resolve any stale override through the authorized publication process.
- Complete release review and any required publication approval, then deploy and verify the four public URLs, content and production performance. No push or deployment has occurred. The local candidate commit, when created, is identified by this worktree’s git log.
- New article embedding entries are queued; existing text search remains available. Source/legal review evidence is in the two adjacent source memos. Goal remains active until the required live result is verified.
