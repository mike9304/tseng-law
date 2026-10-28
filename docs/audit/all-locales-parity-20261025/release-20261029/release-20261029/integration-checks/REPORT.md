# Integration verification — 2026-10-29

The exact 54 new articles and one existing CS706 repair passed the repository’s copied variety checker: 55 actual CLI invocations, each exit 0, zero failed files. The copied checker unit suite passed all 90 tests with exit 0. No source or checker test was edited.

The final structure audit selected all 55 articles with zero automatic errors. All 54 new articles also passed publication/author/audience/topic/image/caption/required-field checks, their 153 FAQ entries were present, and their external source URL sets matched the accepted originals. The auditor reports 304 manual-review items; their resolution belongs to the separately frozen independent content reviews, not to these automated checks.

The first structure run failed on 54 source-slug mismatches because this audit runner selected canonical snapshot filenames containing en-/zh- prefixes. Its report and runner are preserved. The corrected runner selects actual repository canonical paths and asserts their bytes equal the frozen snapshots. It passed without changes to manuscripts or the auditor.

The actual production getAllColumnPosts and filterMarketBoardColumns functions were executed. Their 49 locale counts exactly match the inventory: 2,433 professional articles, 2,166 board-visible local articles and 143 separate issue articles. The change from the refreshed baseline is precisely 54 new files, one existing repaired file and no removed files. The 286-per-locale deficits are 11,603 professional and 11,870 visible articles; excess in another locale does not offset them. These remain source/runtime-policy counts, not a claim about live deployed pages or CMS overlays.

All 2,580 content Markdown files and the full copied checker tree remained byte-identical throughout the checks and the closing hash guard. All 60 selected file operations (55 articles and five checker files) still match their frozen integration hashes. Build, package, browser and public-deployment verification remain separate.
