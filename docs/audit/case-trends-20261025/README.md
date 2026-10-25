# Case-led columns and current Codex column recheck — 2026-10-25

This source release adds sixteen independently researched Taiwan-law columns: four each for Korean, Japanese, US English and Taiwan Traditional Chinese readers. The articles use different judgments and reader decisions, with current official market sources as context. Sixteen fictional editorial images have been generated, inspected and matched to localized alt text.

The earlier Codex 87-column batch, including all eight Portuguese articles, was also checked against the current public release `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`. That public check passed all 87 primary bodies, 35 unique image byte hashes and 87 sitemap entries. This is the baseline check, not evidence that the changes in this commit are already public.

## Review evidence

- `work/research/`: market-specific gap review, actual official sources and observed query evidence. Source access and coverage limits are recorded rather than converted into full-text or finality claims.
- `work/authors/`: four separate authors' notes, first-two-paragraph deletion checks, comparisons with three recent same-language columns, image observations and actual sentence-variety commands.
- `work/reviews/cases-*-locale*` and `cases-*-final*`: independent locale and separate final legal/editorial reviews. Exact approved manuscript hashes are in `work/checks/reviewed-publication-manifest.json`.
- These are AI editorial reviews. No human native-speaker review, attorney review, case representation or result guarantee is claimed.

## Existing 87 articles

Thirty-one current articles received focused independent follow-up review: Portuguese eight plus twenty-three other articles whose bodies changed after the previous approved release. The other fifty-six bodies are byte-identical to the previously approved `a188e620ee7eebc3f2188829e2c318904802ef7d` versions. This is not a claim of a new exhaustive legal audit of every unchanged provision.

Sixteen existing manuscripts were repaired or restored. Portuguese 697 clarifies the neutral service-to-party rule; 698 clarifies net pay versus the bank deposit and removes editorial scaffolding. Actual CLI failures introduced by the later style pass were repaired within bounded passes.

German 683 is a specific exception: its new style candidate failed after two repairs and remains `REQUEST_CHANGES` in `existing-de-repair-683-r2-REJECTED.md`. The release instead restores its earlier approved body byte-for-byte, with current metadata and caption. That restoration independently passed. It is not a successful third repair or completion of the rejected rewrite. The earlier Thai 704 full rewrite also remains unpublished under its already documented previous-release exception; this release does not change that article's body.

See `existing-pt-current.md`, `existing-market-final-review.md`, their exact-hash JSON records, and `work/checks/existing87-final-source-binding.json`.

## Integration and publication

The new articles are registered in the locale archive/date fixtures and the existing pending text-search mechanism. No embedding vectors were invented and no paid embedding request was made.

The final content check passed 19 existing suites / 954 tests. Typecheck passed. The public verifier's explicit inventory-count adaptation passed positive, wrong-count, duplicate-route, missing-body and stale-SHA checks. Initial sparse-checkout setup failures and the publication-date registry correction are retained in the validation history.

Publication uses the existing GitHub main → MacBook Air static deployer → Codex Sites route. Current public audience and domain configuration remain as found. A source commit or build alone is not a live-publication claim. Deployment and the final 103-article public readback are recorded outside this source commit in `/Users/son7/tseng-case-trends-20261025/outputs/PUBLICATION.md` and `work/checks/publication-live.json` after they actually complete.

Browser visual, hydration and interaction QA was not performed: the selected Chrome tool could not verify its admin-enforced policy and denied navigation. No browser security control was bypassed. Image-content inspection and direct public HTML/asset verification have separate, narrower scopes.

Image generation prompts, original output paths, final WebP dimensions and hashes are in `work/images/ja-generation.json` and `work/images/other-generation.json`. Generated scenes are labeled as fictional in each language.
