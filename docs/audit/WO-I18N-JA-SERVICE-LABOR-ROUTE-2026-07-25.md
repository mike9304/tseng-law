# WO-I18N-JA-SERVICE-LABOR-ROUTE — Publish reviewed Japanese labor detail

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Publish the approved Japanese labor-service record at
`/ja/services/labor`, preserving the existing Japanese investment, civil and
family routes and every KO, ZH-Hant and EN service-detail behavior.

Only `investment`, `civil`, `family` and `labor` may be published in Japanese
after this unit. Criminal and IP remain unavailable until their own content
and route reviews pass.

## Approved source

- `src/data/service-details-ja.ts`
- Commit `34bbda98`

Do not edit approved Japanese service data in this work unit.

## Allowed files

1. `src/app/[locale]/services/[slug]/page.tsx`
2. `src/app/[locale]/services/[slug]/__tests__/ja-investment-page.test.tsx`
3. `src/app/[locale]/services/[slug]/__tests__/ja-labor-page.test.tsx` (new)
4. `src/lib/public-route-policy.ts`
5. `src/lib/__tests__/public-route-policy-ja-investment.test.ts`
6. `src/app/sitemap.ts`
7. `src/app/__tests__/sitemap.test.ts`

No other file may be modified.

## Route contract

Extend the explicit review gate to exactly:

```ts
const publishedJapaneseServiceDetailSlugs = [
  'investment',
  'civil',
  'family',
  'labor',
] as const;
```

Preserve the current architecture:

- normalize before checking the explicit allowlist;
- take Japanese title, subtitle, intro and key points only from
  `getJapaneseServiceDetail(slug)`;
- take only `columnSlugs` from `getServiceArea(slug)`;
- never read Japanese service body copy from the builder source;
- do not auto-publish future data records.

The Japanese static params must be exactly, in this order:

```ts
{ locale: 'ja', slug: 'investment' }
{ locale: 'ja', slug: 'civil' }
{ locale: 'ja', slug: 'family' }
{ locale: 'ja', slug: 'labor' }
```

All KO, ZH-Hant and EN params and the single KO builder-record read remain
unchanged.

## Japanese labor page

`/ja/services/labor` must:

- render the exact committed labor title, subtitle, intro and five ordered
  points;
- use the existing Japanese page UI, attorney and contact integrations;
- link attorney `/ja/lawyers/wei-tseng` and contact `/ja/contact`;
- resolve and render these three base labor columns in Japanese:
  - `taiwan-labor-severance-law`
  - `taiwan-voluntary-resignation-severance`
  - `taiwan-mandatory-employment-period`
- emit Japanese BreadcrumbList, route LegalService and Person JSON-LD;
- produce canonical `/ja/services/labor`, `content-language=ja`, Open Graph
  locale `ja_JP`, and exact KO/ZH-Hant/EN/JA plus Korean x-default
  alternates;
- never render the stale KO/ZH-Hant/EN labor body through the Japanese route;
- use `toBuilderLocale('ja') === 'en'` only for dynamic-template visibility.

Normalized input such as `LABOR` must permanently redirect to
`/ja/services/labor`.

`criminal` and `ip` must continue to return empty metadata and 404 without
builder service-source or template-visibility reads.

Existing Japanese investment, civil and family behavior remains unchanged.
Builder-only locale types must not be widened for Japanese.

## Language-switch contract

`jaLanguageSwitchTarget()` must preserve all four approved detail paths:

```text
/services/investment -> /ja/services/investment
/services/civil      -> /ja/services/civil
/services/family     -> /ja/services/family
/services/labor      -> /ja/services/labor
```

Criminal and IP continue to fall back to `/ja/services`.

On `/ja/services/labor`, the public flag switcher must resolve:

```text
🇰🇷 KR -> /ko/services/labor
🇯🇵 JP -> /ja/services/labor
🇹🇼 TW -> /zh-hant/services/labor
🇺🇸 EN -> /en/services/labor
```

## Sitemap contract

Add `/ja/services/labor` once with priority `0.72`, all four locale
alternates and Korean x-default. Preserve Japanese investment, civil and
family once each.

Tests must prove:

- investment, civil, family and labor each occur exactly once with exact
  alternate URLs;
- Japanese criminal and IP details are absent;
- the count fixture changes only by the new labor URL:
  `beforeFiltering: 154`, `afterFiltering: 145`, `removed: 9`.

## Focused test requirements

### Existing investment route suite

- remove `labor` from `unsupportedJapaneseSlugs`;
- add the Japanese labor static param after family;
- retain every existing investment and unsupported-slug assertion otherwise.

### New labor route suite

Prove:

1. exact Japanese metadata, canonical, content-language, `ja_JP` and all five
   alternate entries;
2. exact approved labor body and five ordered points render;
3. exactly the approved three base labor column slugs resolve in Japanese and
   their links render;
4. Japanese attorney/contact links and shared Japanese UI labels render;
5. BreadcrumbList, route LegalService and Person JSON-LD render with labor and
   attorney URLs;
6. stale KO and ZH-Hant labor body, EN base intro and English UI fallback are
   absent;
7. the builder service source is never read for Japanese labor;
8. template visibility is read with builder locale `en`;
9. uppercase `LABOR` redirects to the lowercase Japanese path.

## Forbidden scope

- Editing `src/data/service-details-ja.ts` or data tests
- Publishing Japanese criminal or IP
- Editing service-list copy/layout or KO/ZH-Hant/EN copy
- Header/footer/flag component changes
- Column, attorney, FAQ, pricing, review, SEO helper, builder, asset or
  embedding changes
- Any new legal claim, fee, result or outcome promise
- Stage, commit, push, deploy or server operation by the worker

## Required automated gates

```bash
npx vitest run \
  'src/app/[locale]/services/[slug]/__tests__/ja-investment-page.test.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-civil-page.test.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-family-page.test.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-labor-page.test.tsx' \
  src/lib/__tests__/public-route-policy-ja-investment.test.ts \
  src/app/__tests__/sitemap.test.ts
npm run -s typecheck
npx eslint \
  'src/app/[locale]/services/[slug]/page.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-investment-page.test.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-labor-page.test.tsx' \
  src/lib/public-route-policy.ts \
  src/lib/__tests__/public-route-policy-ja-investment.test.ts \
  src/app/sitemap.ts \
  src/app/__tests__/sitemap.test.ts
git diff --check
git status --short
```

## Manager browser gate

At `1440x1000` and `390x844`, verify:

- `/ja/services/labor` returns 200, has `<html lang="ja">` and the exact
  canonical;
- exact title, subtitle, intro and all five points render;
- all three Japanese related-column links render;
- attorney/contact links and all four exact flag hrefs preserve the `labor`
  path;
- mobile menu visibly exposes 🇰🇷 KR, 🇯🇵 JP, 🇹🇼 TW and 🇺🇸 EN;
- BreadcrumbList, LegalService and Person schemas are present;
- no stale/fallback body or UI, broken images, horizontal overflow, console
  errors, page errors or failed requests;
- `/ja/services/criminal` and `/ja/services/ip` are 404;
- sitemap includes labor exactly once and excludes those two.

The manager owns browser QA and the checkpoint commit. No push or deployment
is authorized.
