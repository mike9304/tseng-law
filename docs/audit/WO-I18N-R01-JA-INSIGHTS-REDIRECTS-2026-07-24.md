# WO-I18N-R01 — Japanese insights alias redirects

## Problem

The legacy `/[locale]/insights` aliases normalize every locale through the
three-language builder locale helper. As a result:

- `/ja/insights` permanently redirects to `/ko/columns`;
- `/ja/insights/<slug>` resolves the Korean post and redirects to
  `/ko/columns/<slug>`;
- Japanese detail redirects are omitted from generated static params.

This is a visible cross-language routing leak.

## Required implementation

1. Treat these public redirect routes as `SiteLocale`, not builder `Locale`.
2. Use `normalizeSiteLocale()` for both list and detail aliases.
3. `/ja/insights` must permanently redirect to `/ja/columns`.
4. `/ja/insights/<slug>` must:
   - resolve the post from the Japanese column corpus;
   - preserve existing alias-to-canonical slug resolution;
   - permanently redirect to `/ja/columns/<canonical-slug>`;
   - retain `notFound()` for a slug absent in that locale.
5. Include `ja` in detail `generateStaticParams()` while retaining Korean,
   Traditional Chinese, and English entries.
6. Keep existing redirect behavior unchanged for KO/ZH-Hant/EN.
7. Add focused tests for all four list redirects, a Japanese canonical detail
   redirect, Japanese static params, and missing Japanese post behavior.

## Exact allowed files

- `src/app/[locale]/insights/page.tsx`
- `src/app/[locale]/insights/[slug]/page.tsx`
- `src/app/[locale]/insights/__tests__/ja-redirects.test.ts` (new)

All other files are read-only. Do not change column content, public route
policy, Header/Footer, SEO output, or page bodies. Do not stage, commit, push,
deploy, or modify runtime data.

## Verification

Run from `/Users/son7/Projects/tseng-law`:

```bash
npx vitest run 'src/app/[locale]/insights/__tests__/ja-redirects.test.ts'
npm run typecheck
npx eslint 'src/app/[locale]/insights/page.tsx' \
  'src/app/[locale]/insights/[slug]/page.tsx' \
  'src/app/[locale]/insights/__tests__/ja-redirects.test.ts'
git diff --check
git status --short
```

Report exact commands and results. If another file changes, stop and report the
scope violation instead of cleaning or reverting it.
