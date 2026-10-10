# Missing column media — local release QA

Status: **PASS for the scoped local release checks**, with the retained baseline warning and exploratory limitation below. This report does not assert public deployment.

Scope: 40 article heroes (405–444; eight each in English, Traditional Chinese, Korean, Japanese and Vietnamese) plus the reviewed 15-second Traditional Chinese video in article 485. Baseline: `8da023868a6c0db96a64caa761f6ef66fa9bb402`. The final 85-file content scope is bound to SHA-256 `7f90385b7839d5271bc748a59f70df7256fe64b62479cf201a714e6cabadbcd6`.

## Completed checks

- All 40 article bodies and pre-existing metadata are byte-preserved. Each original generation, prompt, review and final WebP is hash-bound. All 40 distinct WebPs are 1600 × 900, within the 600 KiB budget. Article 485's manuscript is unchanged; its existing player registry receives the video and full, always-visible description/transcript.
- Type checking, lint, the full unit suite, builder-route security, release configuration, whitespace checks and a clean production build passed sequentially. Unit results: **1,410 files passed; 14,088 tests passed, 14 skipped, 1 todo**. The approved 20-second timeout and one worker address prior corpus-test timing under machine load; assertions and product tests were unchanged.
- Production: all 40 article URLs and all 40 image assets returned HTTP 200; asset SHA-256 values matched the approved files. All **80 desktop/mobile article views** were checked for hero decoding, alt and caption association, native layout, body/source preservation, SEO metadata and overflow. Traditional Chinese/Korean heroes use the existing 21:9 desktop and 4:3 mobile crops. Vietnamese heroes are present. Intentionally hidden English/Japanese archive images were not forced to decode.
- Independent reviewers inspected the actual desktop/mobile hero and caption screenshots. Repaired mobile captures close the existing dismissible language notice through its visible button before checking the complete captions. Ordinary outer-edge crops in 409/410 were independently accepted by the lead; key subjects remain visible.
- Ten desktop/mobile navigation flows across five locales passed, including discovery, article and contact navigation. The earlier 15 media columns and three Singapore controls remain unchanged; **284 checks across 18 articles, 18 assets and 18 rendered pages passed**.
- The new video passed **82 checks across four production scenarios**: desktop/mobile with normal/reduced motion, manual native play and pause, poster, no autoplay/loop, correct 15-second media, HTTP 200/hash verification, HTTP 206 byte ranges, full static transcript and AI notice. Traditional Chinese reviewers also inspected the rendered player screenshots. Hovered native controls can cover the lowest in-video line; the full description remains visible outside the video.

## Development coverage and retained evidence

Development checks covered the requested five locale representatives (413, 405, 429, 421, 437) plus video 485. Their article/media/runtime checks passed. The final bounded 429 caption capture passed all 14 checks after scrolling settled, and its complete caption was visually inspected. The video report retains the existing `ContactEditorial.module.css:298` autoprefixer advisory (“start value has mixed support, consider using flex-start instead”); the stylesheet is byte-identical to baseline, and no new runtime/media error was found.

Raw failed runs are retained, with bounded follow-up evidence rather than overwritten results. Helper mismatches concerned single-tilde Markdown parsing in 427, contact links with a hash suffix, a native video play-button coordinate, selecting a decorative background instead of the visible hero, and a browser-close promise timeout after all contexts and transport had closed. Separate checks resolved those items. Captions obscured by the existing language notice were recaptured after normal dismissal. An extra, unrequested development navigation exploration timed out during slow route compilation after all five requested detail pages had been examined; that extra flow is not claimed as passed. Production navigation passed.

The audit-only privacy repair removed 40 local generation paths from the public audit. The other 84 frozen files, including every article and asset, remained byte-identical, so completed tests/build remain applicable.

Evidence is preserved under `work/missing-media-20261010/qa/`, including original failures, bounded repairs, independent pixel reviews and the final hash-indexed completion record. Public verification must be performed separately against the exact successful release commit.

Both owned verification servers were stopped; ports 4861/4862 are free. Only their generated `next-env.d.ts` and `tsconfig.json` changes were restored to saved originals. Final hash readback confirms the unchanged 85-file scope and no extra modified files.
