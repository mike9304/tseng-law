# Voice revision — independent local release QA

Verdict: **PASS for the bounded content revision, with existing-runtime advisories retained.** This is precommit/local evidence only. The revised public site has not yet been verified; that requires the later exact committed SHA and Production deployment confirmation.

Sealed at 2026-10-09T22:21:00.331246+00:00. Tested base HEAD: `6ada7c2304c01ca6a621a943d07c22144b763b55`. Worktree: `/Users/son7/Documents/Codex/2026-10-08/new-chat/work/tseng-publication-20261008`. Scope at test and cleanup: exactly 24 changed files (15 articles and 9 editorial audit files), with no unexpected source changes. Full path/hash snapshot: `work/voice-qa/scope-final.json`. Input integration-scope SHA256: `32cd0496fb5958b3d414254022c6e216ea3f3ebbd3f046dd572679118e7375da`. Sealed fresh QA manifest SHA256: `112897f36fa54c9294e02860ee202c075b3076c918026db858a3c80f6e7b6ac4`. All 24 hashes were rechecked after testing and cleanup.

Fresh editorial approval is `work/voice-revision/final-review-recovery.md`, SHA256 `046a51aeda1e02bfe85f446bc299501e66cbeb75a528a6f2909e27b960ff9402`; its exact 15 PASS hashes were independently matched. The earlier incomplete report is not an approval. This verifier reviewed technical scope, metadata changes, source provenance and the complete final review report; the fresh language/legal reviewers performed the full prose review. No claim is made that an AI agent is a human native speaker or licensed attorney.

## Gates actually executed

| Gate | Fresh result |
|---|---|
| Exact staged/integrated bytes, body and full hashes, metadata and source invariants | 15/15 PASS |
| Typecheck | Exit 0 |
| Lint | Exit 0 |
| Full unit suite, `--maxWorkers=1` | 1,410/1,410 files; 14,088 tests passed, 14 skipped, 1 todo; exit 0 |
| Builder route-security guard | 279 route files / 273 mutation handlers; exit 0, 4 existing comment-allowlist warnings |
| Release configuration tests | 9/9 PASS; exit 0 |
| Scoped whitespace diff | Exit 0, repeated after generated-file restoration |
| Fresh production build | Exit 0; 2,439 static pages; new `.next-voice-qa-20261010` directory |

The gates ran sequentially, with full tests completed before build. Bundled Node24 was used. This executed the applicable QA constituents explicitly; it does not claim a separately run `npm run qa` command. Gate timestamps, commands and exact exits are in `work/voice-qa/gate-results.json`; raw logs are alongside it. No application or test assertion was modified by this verifier.

The build retains the unchanged `ContactEditorial.module.css:298` autoprefixer advisory (“start value has mixed support, consider using flex-start instead”) and related webpack cache warning serialization messages. These are not compilation failures.

## Real browser and discovery evidence

Local production Chromium 154: all 15 current native articles at 1440×1000 and 390×844, **30/30 PASS, 540 individual checks, no production console/page errors**. Each rendering checked HTTP200, exact current title/SEO description, complete expected rendered body blocks, official citation URLs, independent published/modified dates in JSON-LD, canonical/native-only hreflang, language/indexing, absence of public AI attribution or false author byline, no decorative bold, loaded images and horizontal overflow. Expected values come from newly parsed reviewed source bytes, not the prior release manifest.

All four native archives and semiconductor boards displayed current titles. Article485 is outside the unfiltered archive preview; an ordinary click on its company-topic expansion exposed the current card and opened the correct article. Four current-title searches waited for the applied query and visible result, then opened the exact H1. Four contact links and five unique same-origin body-link targets resolved successfully; no form or message was sent. Sitemap contains all15 URLs with lastmod October10. Published dates remain October9; legal research notes remain October8.

Native navigation passed: the Japanese article’s Korean-language toast opened the valid `/ko/columns` archive, and its article language selector exposed only the available native article. No invented translated slug was followed.

Actual saved screenshots were visually inspected for all four languages at both widths, top and body, plus KO497’s opening: **17 images**. Text was readable without horizontal clipping or body/sidebar overlap. A separate CUA Chrome session also inspected the actual revised KO497 desktop/mobile screen and was closed. Chrome DevTools MCP’s shared profile was already in use, so it was not killed or taken over; the documented Fable real-browser regression used its own dedicated Playwright Chrome process, not the CUA browser session.

Evidence: `work/voice-qa/production-browser.json`, `production-language-navigation.json`, `visual-review.json`, and `cua-screen-check.json`. Representative filenames: `production-zh-hant-390-body.png`, `production-en-1440-body.png`, `production-ja-390-body.png`, `production-ko-390-body.png`. The useful real opening screenshot is `work/voice-qa/production-ko497-opening-1440.png`; a fresh public equivalent must be captured after deployment.

## Development warnings and scope limits

The dev sweep completed four native article pages and eight discovery pages. Article checks passed; no React key, hook, hydration, runtime or page error was detected. **The raw dev runner exited 1 and has pass=false**, because `/en/columns` emitted: `Image with src "/images/brand/hovering-seal-complete.png" was detected as the Largest Contentful Paint (LCP). Please add the "priority" property if this image is above the fold.` This original failure remains unchanged in `dev-browser.json` and `dev-browser.exit`; it is not described as a clean console run.

Bounded disposition approved by the release orchestrator: nonblocking unchanged-runtime performance advisory. `src/components/Header.tsx:961` has the same non-priority logo element as base HEAD; file SHA256 `7da57f89b5a4e5097a8574b4474d7c1b5aa5cb781be3a00d89364f48c9d38d0b`. The logo asset and CSS were also verified byte-identical to base. The LCP event is timing-sensitive and was not observed in the historical prior sweep; this is unchanged-source evidence, not a claim of historical reproduction. Known CSS warning records are likewise retained. Full rationale/hashes: `dev-warning-assessment.json`. No unrelated performance change was made.

The unrelated authenticated builder/admin UI harness was not run: this scope changes native article prose/metadata and audit docs only. Existing builder-harness issues are not claimed fixed or passed. Legal-source correctness rests on the fresh independent editorial reviews; this technical sweep verifies preserved source links and rendered approved material, not a new legal opinion.

## Cleanup and release binding

Both owned servers (4851/4852) were identity-checked, stopped, and their ports confirmed free. Service3217 and other lanes were untouched. Production browser close completed; dev bounded close returned disconnected but its completion promise exceeded the bound, recorded honestly as complete=false/connected=false. No matching dedicated Playwright Chrome process remained on inspection. The CUA tab was closed and viewport reset. `next-env.d.ts` and `tsconfig.json` were inspected and restored byte-for-byte from the pretest snapshots; only this run’s generated route/import changes were removed. Cleanup records are in `server-cleanup.json`, `generated-file-restoration.json`, and browser cleanup JSON files.

The later commit may add this exact sealed report as one additional audit file (25-file scope). It must preserve the following 15 tested article hashes and existing 9 audit hashes. No repeat build is required for an exact documentation-only report copy. A clean committed-blob binding and fresh all15 public readback remain mandatory before final publication completion.

| ID | Native locale | Tested full source SHA256 |
|---|---|---|
| 484 | zh-hant | `449edc906b3d483168bca4af987020c802be6cc1016d37b0a6d496a008f0336d` |
| 485 | zh-hant | `252ee47525f2be6f5a3a463a019b1e6864c5878fd68e49f6e6c9c5bbb14a0858` |
| 486 | zh-hant | `149ccc52156726991a2f125ccdf814da01caa7b661a525de8cbb433941190877` |
| 487 | zh-hant | `074934d2908e4c1122dcc532e62ead9113471ac5f045acf66d5c876066c00b69` |
| 488 | zh-hant | `f8ad4cabecd8d4e547ad4c4d7af70cdb33d70a392116fa0f903ef84a5b81ba1f` |
| 489 | zh-hant | `9a17f8fe4185d3fd26bbb8c92ab49963ea89f23142e75e7f31c92df975f6f946` |
| 490 | zh-hant | `5be92cb701609d02e9c8335f998e01e4a68f4beab3216596d30d2d8cfbcec5a9` |
| 491 | zh-hant | `a17392428a7074664576d7618e90386ff48aa477295e20c953de2232bdf939d6` |
| 492 | zh-hant | `1354a6ec6023349b917378795b6831a068a4ba9637c6744fc6b101eb29288d8e` |
| 493 | en | `8388b33dc7bb92ac4f89b37af3f983503bae58f7b93da0e4dadb67fa84928bf7` |
| 494 | en | `0a0dc7574349d6ae543a3059628f9555e1779e50e073fb26ef7ec286fc60c6a0` |
| 495 | ja | `0c87876d9782110fd38e5583864534fd21b1664884225afb236636fabe118ab6` |
| 496 | ja | `bca4c14cbe9911483793a9ba839ee78d3cbafdbc9a6c0e9a707a8c92ce7e45d4` |
| 497 | ko | `e08c1088189d8c7d5b0753dd9ed46823819a0758d07ae681370f034b84f3ae04` |
| 498 | ko | `1bc95a7f450ef53fdfd59c58781c2c8f82151ab2919304fdc36f3a872452cc16` |
