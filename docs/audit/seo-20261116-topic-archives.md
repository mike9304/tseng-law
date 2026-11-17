# Column archive discovery: local implementation review (2026-11-16)

Base: `57eb8adecf1f48d8f447017c724ced0dfd306675`, isolated branch `country-seo-20261116`.

## Confirmed issue and implemented change

The initial ko/zh-hant/en archive HTML sampled before this change contained only 31/31/34 distinct article links. `ColumnsGrid` limited each topic to its preview; the remaining articles were available through a JavaScript button, without an archive navigation href. The articles themselves were in the sitemap and the sampled pages were indexable. This was a limitation of internal discovery paths, not evidence of a site-wide indexing block or a measured ranking problem.

The existing five topic-interface languages (ko/zh-hant/en/ja/vi) now have real `/[locale]/columns/topics/[topic]` routes. Only nonempty published language/topic pairs are generated (49 in this checkout). Each page renders every matching article title as an anchor in its initial HTML. Existing title and topic labels are reused, with a link back to the language archive. The existing preview's “view all” control gains this actual href. Ordinary left-click retains the existing client topic filter and search-parameter behavior; modified clicks and non-JavaScript navigation can open the archive URL. Issue-board controls retain their existing behavior and do not advertise nonexistent topic paths.

Each new archive has its own canonical. Metadata and sitemap language clusters include only the nonempty pages for that topic; x-default remains inside that cluster. No query-pagination URLs or repeated query-dependent HTML are added. The static crawler already seeds its queue from sitemap URLs and follows HTML hrefs, so no crawler or packaging change is required. Actual assembled output remains to be verified in the parent's integration build.

## Existing SEO work and deliberately unported work

Public HTTP observations, repository history and PR comparisons are recorded in `/Users/a562/tseng-country-1106/checks/SEO-20261116-findings.json`. At that observation, robots/sitemap returned 200, the sitemap had 3,821 distinct URLs, sampled ko/zh-hant/en home/article pages had self canonicals and index/follow, and sampled article FAQ JSON-LD used the corresponding language. Existing intentional reviews/noindex exclusions and the current WebSite site-name data were already implemented. These are reused, not newly imported fixes.

[PR 1](https://github.com/mike9304/tseng-law/pull/1) remains open and its eight proposed SEA B2B paths are absent/404; their absence is an unshipped feature, not a demonstrated defect in existing-page indexing. [PR 3](https://github.com/mike9304/tseng-law/pull/3) remains open; its additional AEO/credential component is absent, while the existing zh-hant lawyer landing page returns 200. Shared SEO files have since evolved, and current language-correct structured data, canonicals and hreflang already exist. Neither PR was merged or cherry-picked; no code from either PR was ported in this change. No new legal landing pages, profile credentials, legal article text or author policy were changed.

## Verification and fixture repair

- Eight related test files: 322 tests passed, zero failed. Evidence: `/Users/a562/tseng-country-1106/checks/SEO-20261116-regression-final.log`.
- New route tests check every matching link beyond a preview, explicit nonempty static params, self canonical, existing-language alternates and unsupported/empty 404 behavior. Grid tests check actual hrefs, ordinary/modified clicks and unchanged issue-board behavior. Existing market-board, guidance-label and SEO/locale checks passed.
- An old aggregate sitemap assertion failed before this implementation: expected 3,774 versus actual 3,820. The actual URL-set investigation found 40 omitted country-release core articles, seven omitted files from the existing JA gap fixture, and one VI expansion article counted twice through the guidance corpus. The correction registers the 40 actual filenames, includes the seven existing JA fixtures, excludes guidance files from the additional expansion count, and checks each of the 47 URLs exactly once. It does not add an unexplained numeric offset. URL-level evidence: `/Users/a562/tseng-country-1106/checks/SEO-20261116-sitemap-gap-audit.json`; unchanged-baseline reproduction: `checks/SEO-20261116-baseline-aggregate.log` under the same task root.
- Topic sitemap expectations derive independently from the fixed five supported languages and each language's published content topic set, rather than using the archive-generator result as its own expectation.
- TypeScript no-emit check and `git diff --check`: passed. Full build not run at the parent's instruction. Browser/screen review: NOT_OBSERVED; no browser retry attempted. No publication, native Sites operation or queue mutation performed.

## Parent integration checks still required

Merge/rebase onto the final article-release source, run one full static build, and confirm the new topic URLs exist in the assembled output, have matching canonical/language metadata, contain all article hrefs, and introduce no broken targets or sitemap misses. The new archive HTML is deliberately a simple title list; visual review has not been claimed. Index inclusion and search ranking remain search-engine decisions.

Google's [incremental page loading guidance](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading) supports real crawlable anchor navigation because crawlers generally do not activate buttons. Its [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview) describes discovery support rather than an indexing guarantee. These official pages were read during the preceding investigation; no new legal research was performed.
