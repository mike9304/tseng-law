# Independent publication QA — PASS for the scoped local release gates

Verifier: publication_qa, independent of article authors and integrator. Completed2026-10-09. This is prepublication evidence; no commit, push, Vercel deployment or public-new-URL verification is claimed here.

## Source binding and scope

Base:58e184f648f966438c83b9ce95f0a268323e4894. Worktree:`work/tseng-publication-20261008`, branch:`codex/ai-semiconductor-15-20261008`. Article publication2026-10-09; legal research2026-10-08. Final23source/test files exactly match `publication-qa/freeze.json`;20audit documents exactly match `publication-qa/audit-scope.json`. Final Git scope43files, no unexpected files (`final-scope.json`). Node24.19.0, Next15.5.21.

All15 reviewed manuscript bodies remain unchanged except removal of the single leading Markdown H1 for the site's own H1. Article source/hash/title/summary/date/native audience/provenance/no decorative emphasis checks15/15PASS (`source-check.json`). Full additive registry/test diff reviewed: semiconductor board, pending text-search index, native corpus, date and sitemap updates; no application runtime edits. Independent legal and language review certification is in the separate editorial reports; this verifier does not claim attorney or human-native review.

## Tests and build

| Gate | Final result | Evidence |
|---|---|---|
| Typecheck and lint | PASS on final source | `qa-rerun.log` |
| Complete Vitest |1410/1410filesPASS;14088passed,14skipped,1todo | `unit-final.log`, exit0 |
| Mutation route guard |279routefiles;273mutationhandlers covered;4existing comment allowlist entries | `route-guard.log`, exit0 |
| Release configuration |9/9PASS | `release-config-rerun.log`, exit0 |
| Fresh production build |PASS;2439staticpages | `build.log`, exit0 |
| Whitespace and exact scope |PASS | `final-scope.json`, `source-tree-latest.json` |

The complete `npm run qa` command initially failed on a163-character English summary and a real-clock holiday fixture. Both were corrected with author review or bounded test-only repair, with original behavior assertions preserved. Its second run passed those cases but hit one5000ms timeout in the unchanged Blob image-backfill test. A narrow run during build also timed out. After build ended, the unchanged narrow file passed3/3 within original limits; the complete suite then passed with`--maxWorkers=1`. No timeout or assertion was weakened. Do not describe the earlier failed `npm run qa` invocations as green; the final constituent gates above are the evidence.

The fresh `.next-publication-qa-20261009` directory did not exist before build. Build warning: existing `ContactEditorial.module.css:298` uses `start`, for which autoprefixer suggests`flex-start`; no new compilation error. This build is bound to the frozen source, not a yet-to-be-created commit. A later commit preserving these hashes has the same tested application inputs.

## Actual browser and discovery verification

`production-browser.json`: all15articles at1440×1000 and390×844,30/30renderingsPASS. Checks includeHTTP200, oneH1, exact native title and SEO summary, every Markdown paragraph/heading/table-cell text, canonical URL, exact native-only hreflang plusx-default, Article JSON-LD headline/date/language and no invented personal author, indexing enabled, no public AI-authorship label, no decorative body bold, no horizontal document overflow, decoded visible/lazy images after actual scrolling, and no runtime console/page errors. All15 URLs occur in the fetched sitemap. Same-origin body links, including absolute`https://tseng-law.com` URLs, normalize to five unique routes; allHTTP200.

All15 semiconductor board cards are present. Real, ordinary hit-tested clicks (withoutforce or JavaScript dispatch) were exercised from all4archives and all4semiconductor boards to articles, plus all4contact pages. Four locale search submissions each return the intended article. No forms, email or booking actions were submitted.

The default Traditional Chinese archive previews a limited number of cards per topic, so485 is not in its initial company preview. The actual「查看全部23篇公司設立與投資專欄」button opens`?topic=company`;485 becomes visible and its real click reaches the correct article. Search`晶圓資料`also finds it (`archive-expanded.json`). This is normal preview behavior, not an absent archive registration.

Native-only language navigation: clicking the Korean suggestion on Japanese495 reaches`/ko/columns`, H1`칼럼`, rather than a nonexistent translated slug. Its language modal lists only the existing Japanese article. Evidence:`language-navigation.json`.

`dev-browser.json`:4locale detail pages plus8locale archive/semiconductor routes allHTTP200. No React/hydration/duplicate-key/page errors. Two first-compilation console warnings repeat the same existing ContactEditorial autoprefixer warning; these are retained in evidence rather than reported as zero warnings.

## Screen inspection

The verifier viewed actual pixels for all16representative production screenshots:4locales ×desktop/mobile ×top/body. CJK/English titles and body text are readable, layout and link styling remain intact, and no clipping/overflow defect was observed. The shared existing placeholder cover is loaded; no new image or fabricated attribution was introduced. Screenshot filenames are`production-{zh-hant,en,ja,ko}-{1440,390}-{top,body}.png`in`work/publication-qa/`. Root separately inspected representative screenshots as an additional release review.

## Method, cleanup and limits

Chrome DevTools MCP could not open its shared profile because it was already occupied. No other browser/process was stopped. Actual UI evidence uses isolated Playwright controlling installed Chrome154.0.8037.98. Initial verification-script findings were corrected without product changes: valid ISO`dateModified`was first compared to a date-only string; offscreen lazy images were first checked before scrolling; a topic result count was first sampled before its asynchronous render settled. Final artifacts contain corrected observed results.

After both complete browser artifacts were saved and the owned Chrome children had exited, their Node runners remained awaiting browser-close cleanup. Only those two owned runners were stopped withSIGTERM143; no current runner exit0 is claimed. All expected checks and navigation records were complete before cleanup (`*-browser-cleanup.json`). All owned production/dev server groups were then stopped. Earlier failed logs are retained.

Next's incidental `next-env.d.ts` and `tsconfig.json` changes were inspected (two generated dist includes plus include reordering), then restored byte-for-byte to pre-test originals. Final23source hashes and20audit hashes were rechecked; no unrelated changes remain. The later addition of this report to the repository audit is documentation-only and outside the43-file snapshot stated above.

The authenticated admin-builder harness is deferred as unrelated to the content-only runtime delta, as allowed by the root's applicability decision. Its historical failure is not claimed passed, no assertions were relaxed, and no unrelated admin/provider behavior is certified. Public deployment verification must wait for the root's exact successful Vercel commit notification and run separately to preserve these local artifacts.
