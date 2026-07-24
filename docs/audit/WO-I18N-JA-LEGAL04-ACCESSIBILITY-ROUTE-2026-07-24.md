# WO-I18N-JA-LEGAL04 — Publish Japanese accessibility page

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Stop `/ja/accessibility` from normalizing to Korean and publish the reviewed
Japanese accessibility statement with correct metadata, breadcrumb, and
language alternates.

## Allowed files

1. `src/app/[locale]/accessibility/page.tsx`
2. `src/app/[locale]/accessibility/__tests__/ja-page.test.tsx` (new)

Do not edit any other file. Do not stage, commit, push, deploy, or operate the
development server.

## Contract

- Resolve this public route as `SiteLocale` with `normalizeSiteLocale`; do not
  call `normalizeLocale` or coerce Japanese to Korean/English.
- Japanese metadata:
  - title/description from `legalPageContent.ja.accessibility`;
  - canonical `https://tseng-law.com/ja/accessibility`;
  - content-language `ja`;
  - Open Graph locale `ja_JP`;
  - keywords exactly:
    - `ウェブアクセシビリティ`
    - `昊鼎国際法律事務所 アクセシビリティ`
    - `台湾 法律サイト アクセシビリティ`
  - alternates exactly KO, ZH-Hant, EN, JA, and x-default KO.
- Non-Japanese locales retain existing title/description/keywords/canonical
  and three-language alternates without a Japanese entry.
- Japanese breadcrumb JSON-LD and visible breadcrumb use `ホーム` linked to
  `/ja`; the current page is `/ja/accessibility`.
- Render the reviewed title, `施行日: 2026-03-10`, both section titles, every
  paragraph/item, and the firm name. No Korean or English accessibility
  fallback.
- Reuse the existing `LegalPageSections` and the legal-card wrapping fixed in
  LEGAL02; do not modify shared components, CSS, sitemap, or footer.

## Required tests

- Exact Japanese metadata/SEO/keywords/alternates.
- Page output includes the complete reviewed Japanese source and visible
  `ホーム` with exact `href="/ja"`; `/ja/columns` absent.
- Japanese breadcrumb JSON-LD includes `ホーム`, absolute `/ja`, and absolute
  `/ja/accessibility`.
- Korean and English fallback text is absent.
- Representative KO, ZH-Hant, and EN metadata/body remain unchanged and do not
  acquire a Japanese alternate.

## Verification

- focused suite plus legal-data/privacy/disclaimer suites;
- sitemap suite remains green;
- `npm run typecheck`;
- scoped ESLint;
- `git diff --check`.

Independent review, live-browser desktop/mobile inspection, and commit are
manager gates.
