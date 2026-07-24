# WO-I18N-JA-LEGAL03 — Publish Japanese disclaimer

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Publish `/ja/disclaimer` from the reviewed Japanese legal-page source without
coercing Japanese to English. Preserve existing KO, ZH-Hant, and EN behavior.

## Allowed files

1. `src/app/[locale]/(legacy)/disclaimer-legacy.tsx`
2. `src/app/[locale]/(legacy)/legacy-page-bodies.tsx`
3. `src/app/[locale]/(legacy)/index.tsx`
4. `src/app/[locale]/(legacy)/__tests__/disclaimer-ja.test.tsx` (new)
5. `src/app/[locale]/(legacy)/__tests__/privacy-ja.test.tsx`

Do not edit any other file. Do not stage, commit, push, deploy, or operate the
development server.

## Contract

- `getDisclaimerLegacyMetadata`, `DisclaimerLegacyPage`, and
  `DisclaimerLegacyPageBody` accept `SiteLocale`.
- The legacy dispatcher passes `ja` directly for `disclaimer`; remove the
  obsolete `toBuilderLocale()` conversion for this route. If the helper becomes
  unused, remove only the unused helper/import.
- Japanese metadata:
  - title and description from `legalPageContent.ja.disclaimer`;
  - canonical `https://tseng-law.com/ja/disclaimer`;
  - content-language `ja`;
  - Open Graph locale `ja_JP`;
  - keywords exactly:
    - `台湾 法律事務所 免責事項`
    - `台湾 法律情報 免責`
    - `昊鼎国際法律事務所 免責`
  - alternates exactly KO, ZH-Hant, EN, JA, and x-default KO.
- Non-Japanese metadata retains the existing keywords and three-language
  alternate behavior.
- Japanese breadcrumb home text is `ホーム` with visible link `/ja`; page crumb
  is `免責事項`.
- Render the reviewed title, `施行日: 2026-03-10`, all three section titles and
  every reviewed paragraph. No English or Korean fallback.
- Preserve the previously fixed legal-card wrapping and every privacy route
  behavior; do not edit CSS or shared Breadcrumbs.

## Required tests

- Exact Japanese metadata/canonical/content-language/OG/keywords/alternates.
- Dispatcher and page retain `locale: 'ja'`.
- Static body rendering contains every Japanese section/paragraph, visible
  `ホーム` with `href="/ja"`, and no `/ja/columns`.
- English/Korean disclaimer fallback text is absent.
- Representative KO, ZH-Hant, and EN metadata remains unchanged with no
  Japanese alternate.
- Privacy Japanese dispatch remains direct and unchanged.
- Replace the privacy suite's intentionally temporary assertion that Japanese
  disclaimer dispatch maps to English. That assertion documented the LEGAL02
  isolation boundary and becomes stale once this work order publishes the
  Japanese disclaimer. Keep or strengthen the privacy direct-dispatch
  regression instead.

## Verification

- focused suite plus Japanese privacy/legal-data suites;
- `npm run typecheck`;
- scoped ESLint;
- `git diff --check`.

Independent review, live-browser desktop/mobile inspection, and commit are
manager gates.
