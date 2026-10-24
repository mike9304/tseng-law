# Home publication order — 2026-10-23

The five home column sections must lead with the newest publication batch. Existing recommendation order uses publication date, then descending column number (664 to 659 for this batch).

The real home-render test passed for KO/EN/ES before the fix and failed for ZH-Hant and JA: ZH pinned three old articles ahead of the new batch; JA pinned six old articles and used lastmod when choosing recent articles. Removed only the ZH home pin override (the columns index retains its curated picks). JA now selects the six newest publication dates, breaks same-day ties by column number and appends remaining curated picks without duplicates.

Evidence in the ship directory: home-order-red.log (three expected failures), home-order-green.log (17 tests passed), variety.log (30 files, zero FAIL; ES uses the existing supplementary checker). New tests exercise all five real home bodies and the JA modified-old-article/deduplication case. No public prose changed.

The first full QA run exposed the sitemap fixture’s missing 2026-10-23 core-locale batch count (20 URLs; the four G4 tax-board URLs and six ES URLs were already counted). Added the new batch registry to both before/after counters, preserving the nine excluded URLs assertion. Focused sitemap, public-author and embedding checks: 126 passed.

Home image alt regression: ZH/EN/ES cards previously substituted article titles for authored image alt. Passed featuredImageAlt through the existing home mapper and image components; the fallback for articles without an authored alt is preserved. The focused suite reproduced three failures before the change and passed 38 tests afterward (home-alt-red.log / home-alt-green.log). Decorative thumbnails retain empty alt.
