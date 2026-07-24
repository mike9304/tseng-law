# WO-I18N-JA-A04 — Japanese About integration

Date: 2026-07-24 KST
Owner: implementation worker
Reviewer: independent read-only integration reviewer
Manager: root

## Objective

Wire the reviewed Japanese firm, team, and contact data into `/ja/about`.
Remove only the About page's `ja -> en` legacy projection, add Japanese
component labels and SEO metadata, and expose `/ja/about` in the sitemap.

## Allowed files

- `src/app/[locale]/(legacy)/index.tsx`
- `src/app/[locale]/(legacy)/about-legacy.tsx`
- `src/app/[locale]/(legacy)/legacy-page-bodies.tsx`
- `src/components/FirmIntroductionSection.tsx`
- `src/components/AttorneyProfileSection.tsx`
- `src/components/ContactBlocks.tsx`
- `src/app/sitemap.ts`
- `src/app/[locale]/(legacy)/__tests__/about-ja.test.tsx` (new)
- `src/app/__tests__/sitemap.test.ts`

No other file may be edited.

## Required behavior

1. For `about` only, pass the `SiteLocale` through metadata/render dispatch.
   Do not broaden other legacy pages or alter their `ja -> en` behavior.
2. Widen the About body and its three child components to accept
   `SiteLocale`, using the reviewed `ja` data directly.
3. Add Japanese team UI labels:
   - `紹介`
   - `学歴`
   - `経歴`
   - `詳細プロフィール`
   - `相談を申し込む`
   - `代表弁護士`
   - `所属弁護士・スタッフ`
   - `提携会計士`
4. Japanese About metadata must use `pageCopy.ja.about`, canonical
   `/ja/about`, `content-language: ja`, Open Graph locale `ja_JP`, and
   four-language alternates (KO, ZH-Hant, EN, JA).
5. Add Japanese About keywords without changing other locales.
6. Add exactly one `https://tseng-law.com/ja/about` sitemap entry with
   four-language alternates. Preserve current indexability rules.
7. Preserve KO/ZH-Hant/EN rendering and metadata.

## Test contract

The focused About test must prove:

- metadata title/description/canonical/content-language/OG locale/alternates;
- legacy dispatcher passes `ja`, not `en`, for About body and metadata;
- all three About child components receive `ja`;
- Japanese team UI labels render and English labels do not;
- representative Japanese firm/team/contact strings render;
- KO/ZH-Hant/EN representative metadata remains unchanged.

The sitemap test must prove `/ja/about` appears exactly once and includes all
four alternates. Update aggregate count expectations only for the one new
entry.

## Worker gates

- Focused Vitest: new About test, sitemap test, three reviewed JA data tests,
  and directly affected component tests.
- `npm run typecheck`
- scoped ESLint on all nine allowed files
- `git diff --check`

Do not stage, commit, push, deploy, or operate the dev server.

## Manager acceptance

- Independent reviewer checks route scope, locale types, labels, metadata,
  sitemap, tests, and KO/ZH-Hant/EN regressions.
- Manager reruns gates.
- Browser verifies desktop and mobile `/ja/about`: Japanese-only body,
  reviewed data, official portrait, contact labels, flag switcher, canonical
  and hreflang, no console errors.
- Commit only the nine allowed files plus this work order.
