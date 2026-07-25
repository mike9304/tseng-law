# WO-I18N-COL012-NATIVE-SEARCH-REFRESH

## Why this addendum exists

Manager-owned browser QA of the column 012 public-sync work found that the
actual `/{locale}/search` page does not use `src/lib/search.ts`. It loads the
stored native builder search index from `search/site-index.json`. That index
still exposes the old column 012 title and body, even though its link is
canonical.

A read-only dry run of `collectAllSearchDocs('default')` found a second issue:
file-backed column 012 is temporarily excluded before 00:00 UTC because the
legacy adapter incorrectly copies date-only `lastmod: "2026-07-26"` into
`frontmatter.publishedAt`. At 07:00 KST on July 26, that becomes a future
scheduled time even though `lastmod` is a modification date, not a publication
schedule.

This addendum fixes that source bug, independently tests the native search
path, then lets the manager rebuild and verify the private stored search index.

## Allowed implementation files

- `src/lib/builder/columns/storage.ts`
- new
  `src/lib/builder/search/__tests__/column-012-native-search-sync.test.ts`

No other implementation or test file may be edited by the worker.

The manager alone may create temporary verification/backup files under `/tmp`
and invoke the existing native search-index storage functions after the code
commit.

## Exact source fix

In `legacyPostToColumnDocument`, keep:

- `frontmatter.lastmod` equal to the normalized file `lastmod`;
- `updatedAt` equal to that normalized modification date;
- all title, summary, body, category, author, image, read-time, and SEO mapping.

Remove only the assignment:

```ts
publishedAt: lastmod,
```

Do not replace it with another synthesized value. A legacy Markdown file is an
already-public source and its modification date must not become a scheduled
publication timestamp. Real builder-authored documents that explicitly carry
`frontmatter.publishedAt` must retain their existing scheduling behavior.

## Native-path regression test

The new test must exercise the real file-backed blog/search source path rather
than mock `listBlogPosts`.

Test setup:

- force `BUILDER_COLUMNS_BACKEND=local`;
- point `CONSULTATION_COLUMNS_DIR` to an empty temporary directory;
- set fake time to `2026-07-25T22:00:00.000Z`, which is
  `2026-07-26 07:00 KST`;
- mock only page, FAQ, and portfolio sources to empty deterministic results;
- restore timers, environment variables, and the temporary directory after
  the test.

Assertions:

1. `listBlogPosts` and `collectAllSearchDocs('default')` include column 012 in
   KO, ZH-Hant, and EN even though its date-only `lastmod` is July 26 UTC.
2. Each real blog post has `publishedAt === undefined`, exact canonical URL,
   and exact accepted title:

```ts
{
  ko: '대만 추월 사고의 책임은 어떻게 판단하나요?',
  'zh-hant': '台灣超車事故的責任如何判斷？',
  en: 'Who Is Liable in an Overtaking Accident?',
}
```

3. Each native search document contains a locale-appropriate current-law body
   phrase:

```ts
{
  ko: '도로교통안전규칙 제101조',
  'zh-hant': '道路交通安全規則》第101條',
  en: 'Article 101 of Taiwan',
}
```

4. Building an index from those real documents and running native queries
   `대만 추월 사고`, `台灣 超車`, and `Taiwan overtaking` returns the exact
   accepted title and canonical column URL.
5. The same dry-run source also carries the accepted column 007 titles for all
   three indexed locales, so rebuilding the stored index cannot reintroduce
   the stale divorce titles:

```ts
{
  ko: '대만 이혼 절차 Q&A: 조정·소송·재산분할·자녀',
  'zh-hant': '台灣離婚程序 Q&A：調解、訴訟、財產分配與子女',
  en: 'Taiwan Divorce Q&A: Mediation, Litigation, Property, and Children',
}
```

6. A synthetic real builder document with an explicit future
   `frontmatter.publishedAt` remains excluded by `listBlogPosts`, proving that
   only the legacy-file conflation is removed and scheduled publishing is
   preserved.

The test must use independent expected literals and must not alter runtime
column/search data.

## Static gates

```sh
npx vitest run src/lib/builder/search/__tests__/column-012-native-search-sync.test.ts
npx vitest run src/lib/builder/search/__tests__/source-collector.test.ts src/lib/builder/search/__tests__/search.test.ts
npm run -s typecheck
npx eslint src/lib/builder/columns/storage.ts src/lib/builder/search/__tests__/column-012-native-search-sync.test.ts
git diff --check -- src/lib/builder/columns/storage.ts src/lib/builder/search/__tests__/column-012-native-search-sync.test.ts
```

## Manager-owned stored-index refresh

Only after the code/test commit passes:

1. Load the current private `search/site-index.json` with the existing
   `loadSearchIndex` function.
2. Abort before candidate construction or any write unless a rollback object
   was loaded and saved:

```ts
const previous = await loadSearchIndex();
if (!previous) {
  throw new Error(
    'Refusing search-index refresh: no existing index was loaded for rollback.',
  );
}

const previousJson = JSON.stringify(previous);
await writeFile(
  '/tmp/tseng-search-site-index-before-col012.json',
  previousJson,
  { mode: 0o600 },
);
```

3. Record SHA-256 and byte size from `previousJson`, plus its `builtAt`,
   per-locale counts, and ordered document IDs.
4. Build a candidate with:

```ts
buildSearchIndex(await collectAllSearchDocs('default'))
```

5. Before writing, verify:
   - no duplicate document ID within a locale;
   - all expected public blog slugs exist once in KO, ZH-Hant, and EN;
   - column 007 and 012 exact accepted titles and canonical URLs;
   - column 012 current-law body phrases;
   - per-locale document counts do not unexpectedly decrease.
6. Write through the existing `saveSearchIndex` function.
7. Reload with `loadSearchIndex`; require exact equality to the candidate and
   record its SHA-256, bytes, `builtAt`, counts, and IDs.
8. If any post-write verification fails, immediately restore the exact loaded
   rollback object with:

```ts
await saveSearchIndex(previous);
```

9. Re-run real browser searches for the three native queries and require exact
   accepted title, canonical href, current-law excerpt/body source, no former
   column 012 title, no former column 007 title, no overflow, and no
   console/page/actionable request error.

This refresh overwrites one private derived search-index object. It does not
publish article content, modify builder drafts, push code, deploy, or alter
query logs.

## Final verification

After the stored refresh, rerun:

- the column 012 public-sync test;
- the new native-search test;
- the four locale column 012 tests;
- clean production build;
- four-locale service/column/article/alias browser checks;
- KO/ZH-Hant/EN real search-page checks.

## Non-goals

- No change to `src/lib/search.ts` beyond the already approved public-sync
  diff.
- No builder column publish, draft mutation, article rewrite, query-log
  deletion, embedding rebuild, push, deploy, or production code release.
