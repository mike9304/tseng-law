# WO-I18N-JA-SERVICE-CIVIL-ROUTE — Publish reviewed Japanese civil detail

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Publish the already approved Japanese civil-service record at
`/ja/services/civil`, while preserving the existing Japanese investment route
and every KO, ZH-Hant and EN service-detail behavior.

This unit may connect only the committed `investment` and `civil` Japanese
records. The remaining Japanese service details stay unavailable until their
own content and route work units pass review.

## Approved source

- `src/data/service-details-ja.ts`
- Commit `e2e622bd` (`feat(i18n): add reviewed Japanese civil service content`)

Do not edit the approved Japanese service data in this work unit.

## Allowed files

1. `src/app/[locale]/services/[slug]/page.tsx`
2. `src/app/[locale]/services/[slug]/__tests__/ja-investment-page.test.tsx`
3. `src/app/[locale]/services/[slug]/__tests__/ja-civil-page.test.tsx` (new)
4. `src/lib/public-route-policy.ts`
5. `src/lib/__tests__/public-route-policy-ja-investment.test.ts`
6. `src/app/sitemap.ts`
7. `src/app/__tests__/sitemap.test.ts`

No other file may be modified.

## Route contract

### Explicit publication allowlist

Keep publication explicit and review-gated:

```ts
const publishedJapaneseServiceDetailSlugs = [
  'investment',
  'civil',
] as const;
```

`getJapaneseServiceRecord()` must:

1. normalize the incoming service slug;
2. return `null` unless the normalized slug is explicitly present in the
   publication allowlist;
3. obtain the Japanese title, subtitle, intro and points only through
   `getJapaneseServiceDetail(slug)`;
4. obtain only `columnSlugs` from `getServiceArea(slug)`;
5. return the normalized approved slug without reading builder service copy.

Do not make publication automatic merely because a future record appears in
`japaneseServiceDetails`.

### Static params

`generateStaticParams()` must add exactly:

```ts
{ locale: 'ja', slug: 'investment' }
{ locale: 'ja', slug: 'civil' }
```

in that order. All existing KO, ZH-Hant and EN params and the single KO
builder-record read remain unchanged.

### Japanese civil page

`/ja/services/civil` must:

- render the exact committed Japanese civil title, subtitle, intro and five
  ordered points;
- use the existing Japanese page UI copy and attorney/contact integration;
- link the attorney to `/ja/lawyers/wei-tseng`;
- link contact to `/ja/contact`;
- resolve the four civil `columnSlugs` from the base service record in
  Japanese:
  - `taiwan-gym-injury-lawsuit`
  - `taiwan-traffic-accident-procedure`
  - `taiwan-overtaking-accident-liability`
  - `taiwan-massage-history-law`
- emit Japanese BreadcrumbList, route LegalService and Person JSON-LD through
  the existing builders;
- produce canonical `/ja/services/civil`, `content-language=ja`,
  Open Graph locale `ja_JP`, and exact KO/ZH-Hant/EN/JA plus x-default
  alternates;
- never read Japanese body text from the builder source;
- continue to use `toBuilderLocale('ja') === 'en'` only for published dynamic
  template visibility.

Normalized input such as `CIVIL` must permanently redirect to
`/ja/services/civil`.

### Unavailable Japanese details

These four slugs must continue to return empty metadata and 404 without a
builder service-source or template-visibility read:

- `family`
- `labor`
- `criminal`
- `ip`

Unknown and malformed slugs retain the same safe behavior.

### Existing behavior

- `/ja/services/investment` remains byte-for-byte equivalent in rendered
  approved content, metadata, links and structured data.
- KO, ZH-Hant and EN continue to read their builder source with the requested
  locale and preserve template visibility behavior.
- Do not widen builder-only locale types to include Japanese.

## Language-switch contract

`jaLanguageSwitchTarget()` must preserve both approved service detail paths:

```text
/services/investment -> /ja/services/investment
/services/civil      -> /ja/services/civil
```

The remaining service details continue to fall back to `/ja/services`.
Existing column, lawyer and unsupported-product mappings remain unchanged.

On `/ja/services/civil`, the rendered public flag switcher must resolve:

```text
🇰🇷 KR -> /ko/services/civil
🇯🇵 JP -> /ja/services/civil
🇹🇼 TW -> /zh-hant/services/civil
🇺🇸 EN -> /en/services/civil
```

## Sitemap contract

Add one Japanese entry for `/ja/services/civil`, priority `0.72`, with exact
four-locale alternates and Korean x-default. Keep Japanese investment exactly
once.

The sitemap test must prove:

- Japanese investment and civil each occur exactly once;
- each has the exact corresponding KO/ZH-Hant/EN/JA/x-default alternate URLs;
- Japanese `family`, `labor`, `criminal`, and `ip` service details are absent;
- the noindex-count fixture changes only by the one new Japanese civil URL:
  `beforeFiltering: 152`, `afterFiltering: 143`, `removed: 9`.

## Focused test requirements

### Existing investment route suite

Make only the changes required by the second published Japanese detail:

- remove `civil` from `unsupportedJapaneseSlugs`;
- expect both Japanese static params, in the approved order;
- keep all investment metadata/body/link/schema/fallback/builder-boundary
  assertions intact.

### New civil route suite

Create a focused suite that proves:

1. exact Japanese civil metadata, canonical, `ja_JP`, content-language and all
   five language alternates;
2. exact approved body and five ordered points render;
3. all four Japanese civil column records resolve and all four links render;
4. Japanese attorney/contact links and shared Japanese UI labels render;
5. BreadcrumbList, LegalService and Person JSON-LD render with the civil and
   attorney URLs;
6. KO/EN base intro and English UI fallback do not render;
7. builder service-source is never read for Japanese civil;
8. template visibility is read using builder locale `en`;
9. uppercase `CIVIL` redirects to the lowercase Japanese canonical path.

## Forbidden scope

- Any edit to `src/data/service-details-ja.ts` or its content tests
- Publishing Japanese family, labor, criminal or IP details
- Editing service-list copy or layout
- Editing KO, ZH-Hant or EN content
- Header/footer/flag component changes
- Column, attorney, FAQ, pricing, review, SEO helper, builder, asset or
  embedding changes
- Any content rewrite, new legal claim, result claim, fee, response-time or
  outcome promise
- Stage, commit, push, deploy or server operation by the worker

## Required automated gates

```bash
npx vitest run \
  'src/app/[locale]/services/[slug]/__tests__/ja-investment-page.test.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-civil-page.test.tsx' \
  src/lib/__tests__/public-route-policy-ja-investment.test.ts \
  src/app/__tests__/sitemap.test.ts
npm run -s typecheck
npx eslint \
  'src/app/[locale]/services/[slug]/page.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-investment-page.test.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-civil-page.test.tsx' \
  src/lib/public-route-policy.ts \
  src/lib/__tests__/public-route-policy-ja-investment.test.ts \
  src/app/sitemap.ts \
  src/app/__tests__/sitemap.test.ts
git diff --check
git status --short
```

## Manager browser gate

After independent code/content review and the automated gates, the manager
must verify the running local site at desktop `1440x1000` and mobile
`390x844`:

- `/ja/services/civil` returns 200 and `<html lang="ja">`;
- exact canonical and four flag hrefs match this WO;
- exact title, subtitle, intro and all five points render;
- all four related Japanese column links render;
- attorney and contact links are Japanese;
- JSON-LD includes BreadcrumbList, LegalService and Person;
- no KO/EN fallback body or English UI labels appear;
- no broken images, horizontal overflow, console errors, page errors or failed
  requests;
- `/ja/services/family`, `/ja/services/labor`,
  `/ja/services/criminal`, and `/ja/services/ip` return 404;
- `/sitemap.xml` includes Japanese civil exactly once and still excludes the
  four unavailable Japanese detail URLs.

The manager, not the worker, owns browser verification and the checkpoint
commit. No push or deployment is authorized by this work unit.
