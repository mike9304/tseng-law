# WO-I18N-H03 — Japanese mobile navigation drawer

## Problem

The Japanese mobile drawer still falls through to English for its dialog,
navigation, close, and firm-name copy. It also exposes Japanese search and
member/account controls even though those product surfaces are not yet
available in Japanese.

## Required implementation

1. Keep Korean, Traditional Chinese, and English drawer behavior unchanged.
2. For `locale === 'ja'`:
   - use `閉じる` for the close button accessible label;
   - use `モバイルメニュー` for the dialog accessible label;
   - use `モバイルメインメニュー` for the navigation accessible label;
   - render the firm name `昊鼎国際法律事務所`;
   - keep the logo link at `/ja`;
   - do not render the search chip;
   - do not render login/account/premium/logout controls, regardless of the
     supplied member state;
   - retain the localized primary navigation, consultation CTA, and the shared
     KR/JP/TW/EN flag switcher.
3. Preserve the existing focus trap, Escape handling, body-scroll lock, drawer
   close callbacks, and mobile language-switch target sizing.
4. Add focused render tests for Japanese localized copy and hidden unsupported
   UI, plus regression assertions for Korean, Traditional Chinese, and English.

## Exact allowed files

- `src/components/MobileNavDrawer.tsx`
- `src/components/__tests__/ja-mobile-nav-drawer.test.tsx` (new)

All other files are read-only. Do not change Header, Footer, CSS, route policy,
translation data, SEO, or page bodies. Do not stage, commit, push, deploy, or
modify runtime data.

## Verification

Run from `/Users/son7/Projects/tseng-law`:

```bash
npx vitest run src/components/__tests__/ja-mobile-nav-drawer.test.tsx \
  src/components/__tests__/locale-flag-switcher.test.tsx
npm run typecheck
npx eslint src/components/MobileNavDrawer.tsx \
  src/components/__tests__/ja-mobile-nav-drawer.test.tsx
git diff --check
git status --short
```

Report exact commands and results. If another file changes, stop and report the
scope violation instead of cleaning or reverting it.
