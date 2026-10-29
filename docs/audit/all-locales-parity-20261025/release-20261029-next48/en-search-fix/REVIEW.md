# English archive search clear control

Root found a real pre-existing overlap while verifying the next48 release. At 390px and 1440px the inset Search submit button covered the center of Clear search, and normal browser clicks could not clear the query. The a0e4 and public-parent f294 CSS bytes were identical; this is not a claim that public browser reproduction was run.

Root changed only the English search layout: the input fills the first grid row, the submit stays inset in that row, and the optional Clear search occupies a separate second row. Explicit dark/paper colors, active states and keyboard-focus outlines retain the English page themes. DOM order, query behavior and article content are unchanged.

Temporary runtime CSS verification used the exact current CSS hash below and normal, unforced clicks. All six combinations of 320/375/1280px and the columns/issues boards passed: clear-button center hit target, zero button overlap, minimum44px height, cleared query/input, no document horizontal overflow. This diagnostic did not modify the old build output. Root actually opened the 320px dark columns and 375px paper issues screenshots and found the labels readable and the controls separate.

The first release browser result (121PASS/8FAIL) is preserved outside the repository in qa-prep/checks. Seven non-English archive rows also recorded requests cancelled during test navigation; their lifecycle investigation is separate from this actual UI fix. No failed request is silently accepted.

This commit is approved for a fresh local build, then browser verification of the compiled CSS. The runtime injection result is not a production-build or publication approval. The prior 48 manuscript hashes, content reviews, static results and first-build 12 root article screenshot inspections remain historical evidence. A fresh commit-bound build is required before push.
