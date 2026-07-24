# WO-I18N-JA-SERVICE-FAMILY-ROUTE — Publish reviewed Japanese family detail

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Publish the approved Japanese family-service record at
`/ja/services/family`, preserving the existing Japanese investment and civil
routes and every KO, ZH-Hant and EN service-detail behavior.

Only `investment`, `civil` and `family` may be published in Japanese after
this unit. Labor, criminal and IP remain unavailable until their own content
and route reviews pass.

## Approved source

- `src/data/service-details-ja.ts`
- Commit `521a62f6`

Do not edit approved Japanese service data in this work unit.

## Allowed files

1. `src/app/[locale]/services/[slug]/page.tsx`
2. `src/app/[locale]/services/[slug]/__tests__/ja-investment-page.test.tsx`
3. `src/app/[locale]/services/[slug]/__tests__/ja-family-page.test.tsx` (new)
4. `src/lib/public-route-policy.ts`
5. `src/lib/__tests__/public-route-policy-ja-investment.test.ts`
6. `src/app/sitemap.ts`
7. `src/app/__tests__/sitemap.test.ts`

No other file may be modified.

## Route contract

### Explicit publication allowlist

Extend, do not remove, the current review gate:

```ts
const publishedJapaneseServiceDetailSlugs = [
  'investment',
  'civil',
  'family',
] as const;
```

The existing `getJapaneseServiceRecord()` architecture remains:

- explicit allowlist check after slug normalization;
- Japanese body only from `getJapaneseServiceDetail(slug)`;
- only `columnSlugs` from `getServiceArea(slug)`;
- no Japanese builder service-copy read;
- no automatic publication of future data records.

### Static params

The Japanese static params must be exactly, in this order:

```ts
{ locale: 'ja', slug: 'investment' }
{ locale: 'ja', slug: 'civil' }
{ locale: 'ja', slug: 'family' }
```

All KO, ZH-Hant and EN params and the single KO builder-record read remain
unchanged.

### Japanese family page

`/ja/services/family` must:

- render the exact committed family title, subtitle, intro and five ordered
  points;
- use existing Japanese page UI, attorney and contact integrations;
- link attorney `/ja/lawyers/wei-tseng` and contact `/ja/contact`;
- resolve and render the two base family columns in Japanese:
  - `taiwan-divorce-lawsuit-qna`
  - `taiwan-inheritance-custody-analysis`
- emit Japanese BreadcrumbList, route LegalService and Person JSON-LD;
- produce canonical `/ja/services/family`, `content-language=ja`, Open Graph
  locale `ja_JP`, and exact KO/ZH-Hant/EN/JA plus Korean x-default
  alternates;
- never read Japanese body text from the builder source;
- use `toBuilderLocale('ja') === 'en'` only for dynamic-template visibility.

Normalized input such as `FAMILY` must permanently redirect to
`/ja/services/family`.

### Unavailable Japanese details

`labor`, `criminal` and `ip` must continue to return empty metadata and 404
without builder service-source or template-visibility reads.

### Existing behavior

- Japanese investment and civil rendered content, metadata, links, schemas,
  redirects and builder boundaries remain unchanged.
- KO, ZH-Hant and EN continue to use their requested builder locale.
- Builder-only locale types must not be widened for Japanese.

## Language-switch contract

`jaLanguageSwitchTarget()` must preserve all three approved detail paths:

```text
/services/investment -> /ja/services/investment
/services/civil      -> /ja/services/civil
/services/family     -> /ja/services/family
```

Labor, criminal and IP continue to fall back to `/ja/services`.

On `/ja/services/family`, the public flag switcher must resolve:

```text
🇰🇷 KR -> /ko/services/family
🇯🇵 JP -> /ja/services/family
🇹🇼 TW -> /zh-hant/services/family
🇺🇸 EN -> /en/services/family
```

## Sitemap contract

Add `/ja/services/family` once with priority `0.72`, all four locale
alternates and Korean x-default. Preserve Japanese investment and civil once
each.

Tests must prove:

- investment, civil and family each occur exactly once with their own exact
  alternate URLs;
- Japanese labor, criminal and IP details are absent;
- the count fixture changes only by the new family URL:
  `beforeFiltering: 153`, `afterFiltering: 144`, `removed: 9`.

## Focused test requirements

### Existing investment route suite

- remove `family` from `unsupportedJapaneseSlugs`;
- add the Japanese family static param after civil;
- retain every existing investment and unsupported-slug assertion otherwise.

### New family route suite

Prove:

1. exact Japanese metadata, canonical, content-language, `ja_JP` and all five
   alternate entries;
2. exact family body and five ordered points render;
3. exactly the approved two base family column slugs resolve in Japanese and
   their links render;
4. Japanese attorney/contact links and shared Japanese UI labels render;
5. BreadcrumbList, route LegalService and Person JSON-LD render with family
   and attorney URLs;
6. KO/EN base intro and English UI fallback are absent;
7. the builder service-source is never read for Japanese family;
8. template visibility is read with builder locale `en`;
9. uppercase `FAMILY` redirects to the lowercase Japanese path.

## Forbidden scope

- Editing `src/data/service-details-ja.ts` or data tests
- Publishing Japanese labor, criminal or IP
- Editing service-list copy/layout or KO/ZH-Hant/EN copy
- Header/footer/flag component changes
- Column, attorney, FAQ, pricing, review, SEO helper, builder, asset or
  embedding changes
- Any new legal claim, result claim, fee or outcome promise
- Stage, commit, push, deploy or server operation by the worker

## Required automated gates

```bash
npx vitest run \
  'src/app/[locale]/services/[slug]/__tests__/ja-investment-page.test.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-civil-page.test.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-family-page.test.tsx' \
  src/lib/__tests__/public-route-policy-ja-investment.test.ts \
  src/app/__tests__/sitemap.test.ts
npm run -s typecheck
npx eslint \
  'src/app/[locale]/services/[slug]/page.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-investment-page.test.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-family-page.test.tsx' \
  src/lib/public-route-policy.ts \
  src/lib/__tests__/public-route-policy-ja-investment.test.ts \
  src/app/sitemap.ts \
  src/app/__tests__/sitemap.test.ts
git diff --check
git status --short
```

## Manager browser gate

At `1440x1000` and `390x844`, verify:

- `/ja/services/family` returns 200, has `<html lang="ja">` and the exact
  canonical;
- exact title, subtitle, intro and all five points render;
- both Japanese related-column links render;
- attorney/contact links and all four exact flag hrefs are Japanese-family
  paths as specified;
- mobile menu visibly exposes 🇰🇷 KR, 🇯🇵 JP, 🇹🇼 TW and 🇺🇸 EN;
- BreadcrumbList, LegalService and Person schemas are present;
- no fallback body/UI, broken images, horizontal overflow, console errors,
  page errors or failed requests;
- `/ja/services/labor`, `/ja/services/criminal` and `/ja/services/ip` are 404;
- sitemap includes family exactly once and excludes those three.

The manager owns browser QA and the checkpoint commit. No push or deployment
is authorized.
