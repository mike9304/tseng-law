# Fable 5.1 commit-gate review — native single-locale columns (2026-09-29)

Worktree: `/Users/son7/Projects/tseng-law-global-columns-20260929` (branch `content/en-ja-vi-columns-20260929`, base `134bda01`)
Reviewed state: worktree as of **2026-09-29 11:45 KST** — 21 modified/added tracked files (333+/43-), 9 new column files, 9 hero images.
Note: the worktree was being edited during the review (seo.ts 11:36 → 11:41, columns/[slug]/page.tsx 11:41, sitemap.ts 11:42, multilingual-seo.test.ts 11:42). `INTEGRATION.diff` is **stale** — it does not contain the x-default change (`src/lib/seo.ts`, `src/app/[locale]/columns/[slug]/page.tsx`, `src/app/sitemap.ts` createEntry, `src/lib/__tests__/multilingual-seo.test.ts`). The verdict below covers the on-disk state, not the diff file.

## Verdict: **APPROVE** (for the 11:45 state; regenerate INTEGRATION.diff before commit)

## Blocking issues
None remaining.

One blocking defect existed and was fixed during the review window:
- `hreflang x-default` for JA-only / VI-only columns pointed at `/en/columns/<slug>`, a 404 (page metadata via `buildSeoMetadata` and sitemap `createEntry`, both through `getLanguageAlternates`, whose x-default was hard-wired to `HREFLANG_X_DEFAULT_LOCALE = 'en'` regardless of `alternateLocales`). Reproduced with a tsx probe at 11:3x (`x-default: https://tseng-law.com/en/columns/taiwan-unpaid-invoice-debt-collection`, `getColumnPost(slug,'en')` = undefined). The first fix (unconditional in-cluster fallback, 11:36) broke `multilingual-seo.test.ts:115` (`/services/investment` with `['ko','zh-hant']` pinned x-default=en). The reworked fix (11:41) is opt-in `xDefaultWithinCluster`, passed by the column detail page (both guidance and site-locale branches) and by the sitemap column-record `createEntry`; the pinned legacy behaviour is untouched and a new test case pins the opt-in. Re-verified: page metadata and sitemap x-default now `/ja/...` / `/vi/...` for all six JA/VI natives; sitemap has zero dangling alternates for the nine natives.

## Verified correct (no defect)
- `sitemap.ts isFileBackedEnglishColumnPath` → `getAllColumnPosts('en')`: aliases still resolve (`resolveSlug`/`getAliasSlugs` map to real slugs present in columns-en); builder/blob EN drafts without a columns-en file are still classed English-noindex and dropped (the checker only sees file posts); ko/zh-hant/ja/guidance locales never enter this branch (`route.locale === 'en'` only). `sitemap.test.ts` "does not invent vi/id/th/fil URLs" and the EN-noindex filter test still pass.
- `collectColumnSitemapRecords` is per-locale file existence → natives get exactly one record with `alternateLocales=[own]`; other locales get no URL (new test asserts both).
- Column detail page: `force-dynamic` (no generateStaticParams); loads via `getAllColumnPosts(urlLocale)` / `getColumnPost(slug, locale)` per locale; `fileBackedColumnAlternateLocales` is existence-based; JSON-LD/breadcrumb use `urlLocale`. Prev/next stay inside the locale's own list.
- Language switcher (`resolvePublicLanguageSwitchTarget` + `publicColumnSlugsByLocale`): unknown slug in target locale → target's `/columns` index, never a 404.
- llms.txt (`buildLocaleLlmsTxt(locale)`), `column-knowledge.ts`, `decompose-insights.ts` (home insights), `listColumnBundles`/`listBlogPosts` (search, blog), builder CMS seeds, `columns-blob-reader` merge: all keyed on the requested locale — natives appear only in their own locale. `collectJaColumnDocs` indexes ja natives for /ja/search.
- Embeddings: `embeddings-store.ts` builds only ko/zh-hant/en → adding only the three EN natives to `column-embeddings-pending.json` is correct; `column-embeddings-content-sync`/`column-pending-text-search` tests pass.
- `insights/[slug]` legacy alias route: `generateStaticParams` uses Korean slugs only, but the route has no `dynamicParams=false`, so `/en/insights/<native>` still resolves dynamically via `getColumnPost(slug,'en')` → redirect. Not a defect.
- guidance `columns/page.tsx` `remainingPosts = getAllColumnPosts('ko').filter(!translated)` only lists untranslated Korean originals; VI natives are simply extra in `posts`. Correct.
- No RSS/feed route exists in `src/app`.

## Tests
- Requested: `npx vitest run src/app/__tests__/sitemap.test.ts src/lib/__tests__/native-locale-columns-20260929.test.ts` → 2 files, 71 tests passed.
- Broad run (`column|sitemap|seo|hreflang|llms|insights|embeddings|search|language|guidance|multilingual|blog`, 243 files / 4174 tests): 1 failure = `multilingual-seo.test.ts:115` against the interim 11:36 seo.ts. After the 11:41 rework: `multilingual-seo`, `seo-hreflang-locales`, `sitemap`, `native-locale-columns-20260929`, `column-012-public-reference-sync`, `llms.txt route`, `columns-en-content`, `columns-ja-content` → 8 files / 140 tests passed.
- `tsc --noEmit` (after the rework) exit 0; eslint on changed source/test files exit 0.
- Full suite (1341 files) not run to completion (stopped at 10-min budget); the surfaces touched are covered by the broad run above.

## Test-coverage assessment
- Mirror-Korean intent is preserved, not weakened: `columns-en/ja-content` still assert `files − natives === koFiles` **and** `natives === NATIVE_LOCALE_COLUMN_FILES[locale]` exactly; `columns-new-four-locales` still asserts translated vi count === ko count with non-Korean bodies; category parity still compares every translated post to the EN baseline of 23. A stray ko/other-locale file for a native slug would fail both the mirror tests and the new "exists only in its own locale" test.
- New test is meaningful: frontmatter (date, date_display, categories phrase, topic, featured_image path + file on disk, 3 FAQs), loader output (category, contact block, no phone/raw HTML, length), external citations (3–10, https), internal `/xx/columns/` links resolve, single-locale exclusivity + sitemap record shape.
- `home-insights-publication-order` change (date display → newest slug per locale) is a stronger assertion than before.

## Non-blocking notes
1. `next-env.d.ts` `.next` → `.next-build`: typegen churn from `npm run typecheck` (NEXT_DIST_DIR). It has been committed both ways historically; recommend excluding it from this commit.
2. Add an x-default assertion for a real native column (e.g. in `native-locale-columns-20260929.test.ts`: `generateMetadata`/sitemap entry for a JA native has `x-default` === its own URL). The current pin is a synthetic `/columns/x` in `multilingual-seo.test.ts`; a corpus-level check would catch a future caller that forgets `xDefaultWithinCluster`.
3. `INTEGRATION.diff` must be regenerated (`git diff` + new files) so the commit record matches; it currently omits the x-default fix.
4. COORD.md cross-links to lane 024–031 (EN3→027, JA1→030) are deferred until that lane lands — fine; the new test only checks links that exist.
