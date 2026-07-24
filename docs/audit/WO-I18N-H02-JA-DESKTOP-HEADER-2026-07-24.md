# WO-I18N-H02 — Japanese desktop header safety and localization

## Problem

The Japanese desktop header still mixes unsupported or misleading UI into the
localized public site:

- the logo opens `/ja/columns` instead of the Japanese home page;
- the utility links fall through to English and point to `/en/...`;
- the utility navigation accessible label falls through to English;
- member login/account UI is rendered even though Japanese account routes are
  outside the approved Japanese public-site scope;
- the header calls `/api/members/me?locale=ja`;
- Japanese search opens an English-backed search experience because
  `toBuilderLocale('ja')` falls back to English.

## Required implementation

1. Keep all Korean, Traditional Chinese, and English header behavior unchanged.
2. For `locale === 'ja'`:
   - link the firm logo to `/ja`;
   - render the firm name as `昊鼎国際法律事務所`;
   - render utility links `お問い合わせ` → `/ja/contact` and
     `アクセス` → `/ja/contact#offices`;
   - use the accessible utility navigation label `補助メニュー`;
   - do not render desktop login/account/premium/logout controls;
   - do not call `/api/members/me?locale=ja`;
   - do not render the desktop search button or search overlay.
3. Preserve the shared KR/JP/TW/EN flag switcher in the utility navigation.
4. Correct the member-loading effect dependencies while touching this logic so
   locale changes cannot reuse stale account state.
5. Add focused tests proving the Japanese source/render contract and proving
   that the three established locales retain member and search UI.
6. Do not add Japanese service-detail mega-menu links in this work order. Their
   pages are handled only after their body translations pass review.

## Exact allowed files

- `src/components/Header.tsx`
- `src/components/__tests__/ja-desktop-header.test.tsx` (new)

All other files are read-only. Do not change the mobile drawer, footer, route
policy, translation data, CSS, SEO, or page bodies. Do not stage, commit, push,
deploy, or modify runtime data.

## Verification

Run from `/Users/son7/Projects/tseng-law`:

```bash
npx vitest run src/components/__tests__/ja-desktop-header.test.tsx \
  src/components/__tests__/locale-flag-switcher.test.tsx
npm run typecheck
npx eslint src/components/Header.tsx \
  src/components/__tests__/ja-desktop-header.test.tsx
git diff --check
git status --short
```

Report exact commands and results. If another file changes, stop and report the
scope violation instead of cleaning or reverting it.
