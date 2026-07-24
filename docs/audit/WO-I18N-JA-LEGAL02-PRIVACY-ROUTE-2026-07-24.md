# WO-I18N-JA-LEGAL02 — Publish Japanese privacy page

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Publish `/ja/privacy` from the reviewed Japanese legal-page source without
coercing Japanese to English. Preserve all existing KO, ZH-Hant, and EN
privacy behavior.

## Allowed files

1. `src/app/[locale]/(legacy)/privacy-legacy.tsx`
2. `src/app/[locale]/(legacy)/legacy-page-bodies.tsx`
3. `src/app/[locale]/(legacy)/index.tsx`
4. `src/components/LegalPageSections.tsx`
5. `src/app/[locale]/(legacy)/__tests__/privacy-ja.test.tsx` (new)
6. `src/components/Breadcrumbs.tsx`
7. `src/app/globals.css`

No other file may be edited. Do not stage, commit, push, deploy, or operate the
development server.

## Contract

- `getPrivacyLegacyMetadata`, `PrivacyLegacyPage`, and
  `PrivacyLegacyPageBody` must accept `SiteLocale`.
- The legacy dispatcher must pass `ja` directly for `privacy`; do not use
  `toBuilderLocale()` or otherwise map it to `en`.
- `LegalPageSections` must accept `SiteLocale` so the reviewed Japanese data can
  render directly. This is a type widening only; do not alter its markup or
  behavior.
- Japanese metadata:
  - title and description from `legalPageContent.ja.privacy`;
  - canonical `https://tseng-law.com/ja/privacy`;
  - content-language `ja`;
  - Open Graph locale `ja_JP`;
  - keywords exactly:
    - `台湾 法律事務所 プライバシーポリシー`
    - `昊鼎国際法律事務所 個人情報`
    - `台湾 法律相談 プライバシー`
  - alternates exactly KO, ZH-Hant, EN, JA, and x-default KO.
- Non-Japanese metadata must retain the existing keywords and three-language
  alternate behavior.
- Japanese breadcrumb home text must be `ホーム` and its URL must be `/ja`.
- The visible shared `Breadcrumbs` component must link every locale's home
  crumb to `/${locale}`. Remove the obsolete Japanese `/ja/columns` special
  case.
- Render the reviewed Japanese title, effective date, all four section titles,
  firm name, and contact email. No English or Korean privacy body fallback.
- Live-browser inspection found legal-card content wider than the card and
  clipped by `.card { overflow: hidden }` on Japanese desktop. Scope a minimal
  legal-card CSS correction that:
  - makes the card/grid children shrinkable;
  - lets Japanese and Traditional Chinese legal prose wrap;
  - keeps card content top-aligned;
  - does not alter generic cards or unrelated page layouts.
- Do not modify disclaimer routing in this work order.

## Required tests

The new focused integration test must prove:

- Japanese metadata exactness, canonical, content language, OG locale,
  keywords, and five alternate entries;
- dispatcher metadata/page keep `locale: 'ja'`;
- direct body rendering contains the complete reviewed Japanese structure,
  visible breadcrumb `ホーム` with exact `href="/ja"` (and no
  `href="/ja/columns"`), `施行日: 2026-03-10`, firm name, and email;
- English/Korean fallback titles or section headings are absent;
- representative KO, ZH-Hant, and EN metadata remain unchanged and do not
  acquire a Japanese alternate;
- disclaimer dispatch still maps Japanese as it did before this isolated work
  order.

## Verification

- focused Vitest suite;
- relevant existing Japanese legacy integration suites;
- `npm run typecheck`;
- scoped ESLint;
- `git diff --check`.

Independent review, live-browser checks, and commit are manager gates.

## Manager-gate discoveries

The first implementation remains uncommitted because two live/independent
checks failed:

1. The JSON-LD breadcrumb was correct, but the visible breadcrumb still linked
   `ホーム` to `/ja/columns`.
2. Japanese legal-card descendants had 442–628px intrinsic widths inside
   286px cards and were clipped. After the correction, every legal card must
   satisfy `scrollWidth <= clientWidth` on desktop and mobile.
