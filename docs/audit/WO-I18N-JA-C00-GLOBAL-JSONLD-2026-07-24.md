# WO-I18N-JA-C00 — Japanese global JSON-LD

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Stop the Japanese public layout from emitting English `/en` organization and
contact entities. Extend the existing WebSite and LegalService JSON-LD builders
to accept the public `SiteLocale` without changing the three existing locales.

## Allowed files

1. `src/lib/seo.ts`
2. `src/app/[locale]/layout.tsx`
3. `src/lib/__tests__/canonical-attorney-seo-identity.test.ts`

No other file may be edited. Do not stage, commit, push, deploy, or operate the
development server.

## Contract

- `buildWebsiteJsonLd` and `buildLegalServiceJsonLd` accept `SiteLocale`.
- `LocaleLayout` passes the resolved `locale` directly to those two builders.
- Other builder-only consumers such as `QuickContactWidget` keep their existing
  `toBuilderLocale` behavior.
- Japanese WebSite:
  - URL and search target start with `https://tseng-law.com/ja`.
  - `name` is `昊鼎国際法律事務所`.
  - `inLanguage` is `ja`.
- Japanese LegalService:
  - name is `昊鼎国際法律事務所`.
  - URL is `https://tseng-law.com/ja`.
  - contact URL is `https://tseng-law.com/ja/contact`.
  - attorney name is `曾雋崴弁護士`.
  - attorney URL is `https://tseng-law.com/ja/lawyers/wei-tseng`.
  - the existing Taipei address value is reused; do not invent or alter an
    address, phone, email, social URL, or organization identity.
- Japanese output contains no `/en` route and no English organization or
  attorney name.
- KO, ZH-Hant, and EN exact behavior remains unchanged.

## Required verification

- Focused tests covering all Japanese assertions above and representative exact
  regression assertions for KO, ZH-Hant, and EN.
- Existing callers compile.
- `npm run typecheck`
- scoped ESLint for the three allowed files
- `git diff --check`

Browser verification and commit are manager gates.
