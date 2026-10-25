# B6 integration plan — 2026-10-26

Base R is clean at `1ef3a9fe1a8702cda57949c5c53d3b713cc20b64`, also local `origin/main`. Root has recorded the successful non-force B5 main push. Integration is authorized; root retains commit/build/push decisions.

The fixed manifest binds all 42 final manuscripts (de/it/ar/pt/hi/ms/ru × 915/916/918/919/920/921) to each latest author manifest and independent R2 closure. All seven closures have zero mandatory findings. Their older author status strings may still say review pending: the subsequent bound R2 closes that stage. IT optional 916 S01/S02 and AR optional 915 S03 remain intentionally retained. The manifest describes the reviewed correction scope per locale. No manuscript rewording or new full meaning review is part of integration.

Accepted sources are EN915/916 and ZH918/919/920/921. Their current R bytes match the six current frozen snapshots and hashes. ZH918/920/921 have separately documented metadata-only normalization against the approved October25 snapshots; those earlier approved hashes are also retained. Court-response dates and refresh limitations remain in the source register. Each source currently exists in one language; each case cluster becomes eight languages after this wave. ARC remains a separate 49-language cluster.

Implementation scope:

1. Copy the 42 frozen files into the same R paths byte-for-byte; publication and lastmod remain October26. EN915-derived files retain two FAQs; the other five topics retain three.
2. Add a dated case-translation registry to the existing test helper. Archive date lookup must receive locale, so the new translations use October26 while the original EN/ZH cases keep October25. Existing ARC entries and runtime code remain unchanged.
3. Add bounded case-cluster/publication regressions and update affected date-helper callers. Run the existing 27 relevant suites plus the new case regression, single worker and the existing 30-second test budget. Do not repeat the unrelated whole-repository run or unchanged legal/variety reviews.
4. Run the installed content-audit against the exact 42 files, explicit per-file canonical source map and October26 metadata. Its automated pass remains separate from the already closed meaning review.
5. Record current loader/board inventory, exact source-copy proof, source/script diff, test commands/results, and compact review/evidence copies under A/batch06. Add the B5 main-push receipt at the corresponding A/batch05 path and update PUBLICATION with B5 push fact and B6 local integration status.

After root reviews and commits, the existing full-build command must include `--media-origin=https://media.tseng-law.com`. The planned command is Node24 `node scripts/static-site/build.mjs --out=out-all-locales-batch06-release26 --port=4639 --media-origin=https://media.tseng-law.com`; local fallback is explicit, with no claim of Air production CMS-mirror parity. Build is not run at this stage.

Minimum post-commit QA: all 42 new pages at desktop 1440 and mobile 390; seven representative slow and seven no-JS pages; six home49/legacy KO0513 navigation scenarios; actual AR RTL, numbers and identifiers; source-ordered body blocks, every FAQ, image decode and metadata. Statically verify the complete 48-page case clusters including six unchanged originals, reciprocal links/hreflang/sitemap and dates. Check ARC49 remains intact and run the separate HE706 mobile regression. Reuse font/menu-font stabilization and source-AST table counts. Package with the unchanged packer, verify every HTML gzip roundtrip and copied asset, and measure actual 256MiB headroom. Preserve initial failures and earlier artifacts. Public checks occur only through the existing main→Air→Sites route after root push.

This plan is not a native-human or lawyer approval and does not claim the 49×286 parity goal is complete.
