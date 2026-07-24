# WO-I18N-H04 — Japanese footer social label

## Problem

The Japanese footer is otherwise localized and already uses the shared
KR/JP/TW/EN flag switcher, but its visible social heading falls through to the
English word `Follow`.

## Required implementation

1. Render the Japanese social heading as `フォロー`.
2. Keep the existing labels unchanged:
   - Korean: `팔로우`
   - Traditional Chinese: `追蹤我們`
   - English: `Follow`
3. Preserve the Japanese firm name, office links, legal links, social-link
   accessible labels, and shared KR/JP/TW/EN flag switcher.
4. Add focused render tests for all four social headings and the Japanese footer
   contract.

## Exact allowed files

- `src/components/Footer.tsx`
- `src/components/__tests__/ja-footer.test.tsx` (new)

All other files are read-only. Do not change Header, mobile drawer, CSS, route
policy, translation data, SEO, or page bodies. Do not stage, commit, push,
deploy, or modify runtime data.

## Verification

Run from `/Users/son7/Projects/tseng-law`:

```bash
npx vitest run src/components/__tests__/ja-footer.test.tsx \
  src/components/__tests__/locale-flag-switcher.test.tsx
npm run typecheck
npx eslint src/components/Footer.tsx src/components/__tests__/ja-footer.test.tsx
git diff --check
git status --short
```

Report exact commands and results. If another file changes, stop and report the
scope violation instead of cleaning or reverting it.
