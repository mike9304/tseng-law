# WO-I18N-P0 — Close JA admin authentication bypass

## Problem

Public Japanese locale support added `ja` to the `[locale]` route tree, but the
middleware's protected admin regexes and explicit matchers still enumerate only
`ko|zh-hant|en`.

Measured evidence:

- `src/middleware.ts` defines `CONSULTATION_ADMIN_PATH_RE` and
  `BUILDER_ADMIN_PATH_RE` without `ja`.
- `src/middleware.ts` config matchers omit `ja`.
- `src/app/[locale]/admin-consultation/page.tsx` exists and normalizes unknown
  builder locales, so `/ja/admin-consultation` can reach an admin page without
  the intended Basic Auth challenge.

## Required change

1. Protect `/ja/admin-consultation` with the exact same consultation-admin
   Basic Auth behavior as the existing three locales.
2. Protect `/ja/admin-builder` with the exact same builder-admin Basic Auth
   behavior as the existing three locales, even though JA builder UI is not a
   public deliverable.
3. Include `ja` in the two explicit admin matcher entries so dotted subpaths
   cannot be skipped by the public asset exclusion.
4. Add regression tests proving:
   - unauthenticated `/ja/admin-consultation` returns the consultation 401
     challenge;
   - unauthenticated `/ja/admin-consultation/export.csv` also returns 401;
   - unauthenticated `/ja/admin-builder` returns the builder 401 challenge;
   - the config matcher includes `ja` for both admin families;
   - existing KO/ZH-Hant/EN behavior remains covered and unchanged.

## Exact allowed files

- `src/middleware.ts`
- `src/middleware.test.ts`

Do not modify any other file. Do not reformat unrelated code. Do not stage,
commit, push, deploy, start/stop servers, or touch runtime data.

## Verification

Run from `/Users/son7/Projects/tseng-law`:

```bash
npx vitest run src/middleware.test.ts
npm run typecheck
git diff --check -- src/middleware.ts src/middleware.test.ts
git status --short
```

Report the commands and outputs exactly. If another file changes, stop and
report the scope violation instead of trying to clean or revert it.
