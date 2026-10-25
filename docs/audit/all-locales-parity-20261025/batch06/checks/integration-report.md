# B6 pre-commit integration — 2026-10-26

All 42 de/it/ar/pt/hi/ms/ru manuscripts were copied into R with their frozen bytes unchanged. Each SHA matches both the latest author manifest and the subsequent independent R2 closure. All seven language reviews have zero mandatory findings. No manuscript wording, FAQ, image, source URL or metadata was changed during integration. Root authored DE directly; no new Kimi output is claimed.

Base and current HEAD are `1ef3a9fe1a8702cda57949c5c53d3b713cc20b64`. Root's successful B5 non-force main-push receipt was copied unchanged into A/batch05/release26/checks. PUBLICATION now distinguishes that push from still-pending public verification and describes B6 as integrated, not built or deployed.

## Evidence

- `integration-readiness-manifest.json`: exact 42 file paths/SHA values, seven author/R2 manifest and report hashes, six accepted current and originally approved source hashes, reviewed correction scopes, and intentionally retained optional findings. Readiness SHA: `6b8a8edffb405c25c85df834e737ff30ac0244dcef89c0056bc05a360e98008d`.
- The accepted sources are EN915/916 and ZH918/919/920/921. Every current R source matches its frozen snapshot. The earlier approved ZH918/920/921 hashes remain recorded alongside the separately reviewed metadata-only normalization. Source-refresh limitations remain in the original research records; no new legal refresh is claimed.
- `integration-copy-manifest.json` and `integration-source-proof.json`: 42 exact copies, 6 existing test/helper files changed, one new regression test, and 0 existing manuscript/runtime/script changes across the 6,947 tracked source/script baseline. The 2,252 existing Markdown files under those tracked paths are byte-identical. Earlier B3/B4/B5 artifacts were not operated on; a redundant full artifact hash sweep was not performed.
- `integration-content-audit.json`: installed auditor SHA `3926a274bf544fed7e34339aa8b2636d41a4be79c0aaff898f46fc65595faf4b`, explicit per-file canonical map, 42 selected files, errors0, all42 board-visible. Its `REVIEW_REQUIRED` semantic status and216 review items are preserved; the independent reviews supply the distinct meaning-review evidence.
- `integration-metadata.json`: actual YAML parse of all42, October26 publication/lastmod and localized display date, own-language audience, internal author, expected topic and original image, exact fictional-caption prefix and FAQ count. All checks have0 errors. The915 translations retain two FAQs; each other article has three.
- `integration-tests-summary.json`: 27 existing affected/helper-consuming suites passed747/747 tests, exit0. A separate new case regression passed13/13 tests, exit0; total28 suites/760 tests. The former run has a redirected raw log; the latter result records the observed unified-exec completion and a labeled transcript excerpt. The unrelated whole-repository suite was not repeated. Existing React SSR `fetchPriority` warnings remain visible in the raw log.
- `integration-r-inventory.json/md`: 2,163 professional files,1,896 local-board-visible items,125 separate issue posts,21 topics common to49 locales. Against the actual B5 working-tree inventory:42 added,0 removed,0 existing files changed. Remaining deficit to49×286 visible columns is12,122.

## Registry and regression scope

The new `CASE_TRANSLATION_COLUMN_FILES_20261026` registry has exactly seven locales and six files each. The October25 original registry is unchanged. Archive publication lookup now takes locale explicitly; its five caller files pass their actual locale, preventing a shared case slug from assigning the translation date to its original.

The new regression pins the six case topics independently of the registry and checks all42 posts, visible-board ordering, own audience, date, FAQ counts and topics. For each of the six originals it checks October25 remains intact, exactly eight actual language versions exist, static language-switch links are reciprocal, and hreflang contains eight versions plus an in-cluster x-default. These case clusters are distinct from the49-language ARC clusters. The existing full language-link/sitemap and publication/corpus regressions also passed. No production runtime code or test assertion was removed.

`integration-registry-and-tests.patch` contains the tracked helper/caller diff. The new regression file is available directly in R at `src/lib/__tests__/case-translations-20261026.test.ts`; its hash is bound in the source proof and test result. `git diff --check -- src scripts` passed.

## Handoff

Root must review and commit before the planned full build. No B6 build, commit, push, direct deployment or infrastructure operation was performed. The existing media origin is mandatory: Node24 `node scripts/static-site/build.mjs --out=out-all-locales-batch06-release26 --port=4639 --media-origin=https://media.tseng-law.com`. This planned local build uses local fallback, not Air's production CMS data mirror.

Post-commit verification scope is documented in `integration-plan.md/json`: desktop/mobile42 pages, seven slow and seven no-JS cases, six navigation cases (104 total), separate HE706 mobile regression, actual Arabic RTL, source-block/FAQ/image/metadata checks for all48 case-cluster pages, ARC49 regression, sitemap and full unchanged-packer integrity/size. These checks have not yet run for B6.

Compact A/batch06 evidence is indexed in `integration-audit-copy-manifest.json`. Detailed historical logs, earlier draft snapshots and the already installed DE tool candidate remain in the work folder with an excluded-file hash index; no old evidence is deleted or overwritten. This report is not human-native or lawyer approval and does not declare the overall parity goal complete.
