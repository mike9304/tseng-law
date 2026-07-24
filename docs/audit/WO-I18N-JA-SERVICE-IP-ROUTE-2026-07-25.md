# WO-I18N-JA-SERVICE-IP-ROUTE — Publish reviewed Japanese IP detail

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Publish the approved Japanese IP and financial-disputes record at
`/ja/services/ip`, preserving every existing Japanese service detail and every
KO, ZH-Hant and EN service-detail behavior.

After this unit, all six reviewed Japanese service details are public. This
does not authorize changes to the older KO, ZH-Hant or EN service copy.

## Approved source

- `src/data/service-details-ja.ts`
- Commit `4af1fb43`

Do not edit approved Japanese service data in this work unit.

## Allowed files

1. `src/app/[locale]/services/[slug]/page.tsx`
2. `src/app/[locale]/services/[slug]/__tests__/ja-investment-page.test.tsx`
3. `src/app/[locale]/services/[slug]/__tests__/ja-ip-page.test.tsx` (new)
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
  'criminal',
  'ip',
] as const;
```

Preserve the current architecture:

- normalize before checking the explicit allowlist;
- take Japanese title, subtitle, intro and key points only from
  `getJapaneseServiceDetail(slug)`;
- take only `columnSlugs` from `getServiceArea(slug)`;
- never read Japanese service body copy from the builder source;
- do not turn the publication gate into a broad “any data record” rule.

The Japanese static params must be exactly, in this order:

```ts
{ locale: 'ja', slug: 'investment' }
{ locale: 'ja', slug: 'civil' }
{ locale: 'ja', slug: 'family' }
{ locale: 'ja', slug: 'labor' }
{ locale: 'ja', slug: 'criminal' }
{ locale: 'ja', slug: 'ip' }
```

All KO, ZH-Hant and EN params and the single KO builder-record read remain
unchanged.

## Japanese IP page

`/ja/services/ip` must:

- render the exact committed IP title, subtitle, intro and five ordered points;
- use the existing Japanese page UI, attorney and contact integrations;
- link attorney `/ja/lawyers/wei-tseng` and contact `/ja/contact`;
- render the exact Japanese empty-column message because the reviewed base
  `ip.columnSlugs` list is currently empty;
- not invent or attach related columns;
- emit Japanese BreadcrumbList, route LegalService and Person JSON-LD;
- produce canonical `/ja/services/ip`, `content-language=ja`, Open Graph
  locale `ja_JP`, and exact KO/ZH-Hant/EN/JA plus Korean x-default alternates;
- never render the stale KO/ZH-Hant/EN IP body through the Japanese route;
- use `toBuilderLocale('ja') === 'en'` only for dynamic-template visibility.

Normalized input such as `IP` must permanently redirect to `/ja/services/ip`.

Unknown and prototype-like slugs must return empty metadata and 404 without
builder service-source or template-visibility reads.

Existing Japanese investment, civil, family, labor and criminal behavior
remains unchanged. Builder-only locale types must not be widened for Japanese.

## Language-switch contract

`jaLanguageSwitchTarget()` must preserve all six approved detail paths:

```text
/services/investment -> /ja/services/investment
/services/civil      -> /ja/services/civil
/services/family     -> /ja/services/family
/services/labor      -> /ja/services/labor
/services/criminal   -> /ja/services/criminal
/services/ip         -> /ja/services/ip
```

On `/ja/services/ip`, the public flag switcher must resolve exactly:

```text
🇰🇷 KR -> /ko/services/ip
🇯🇵 JP -> /ja/services/ip
🇹🇼 TW -> /zh-hant/services/ip
🇺🇸 EN -> /en/services/ip
```

## Sitemap contract

Add `/ja/services/ip` once with priority `0.72`, all four locale alternates and
Korean x-default. Preserve the five earlier Japanese service details once
each.

Tests must prove:

- all six reviewed service details occur exactly once with exact alternate
  URLs;
- no duplicate Japanese IP entry exists;
- the count fixture changes only by the new IP URL:
  `beforeFiltering: 156`, `afterFiltering: 147`, `removed: 9`.

## Focused test requirements

### Existing investment route suite

- replace the known unsupported `ip` fixture with
  `unknown-service`, `__proto__` and `constructor`;
- add the Japanese IP static param after criminal;
- retain every existing investment and unsupported-slug assertion otherwise;
- prove unknown and prototype-like inputs remain unavailable without builder
  source or template-visibility reads.

### New IP route suite

Prove:

1. exact Japanese metadata, canonical, content-language, `ja_JP` and all five
   alternate entries;
2. exact approved IP body and five ordered points render;
3. `getServiceArea('ip').columnSlugs` is exactly empty, the Japanese
   empty-column message renders, and no related-column link is invented;
4. Japanese attorney/contact links and shared Japanese UI labels render;
5. BreadcrumbList, route LegalService and Person JSON-LD render with IP and
   attorney URLs;
6. stale KO and ZH-Hant IP body, EN base intro and English UI fallback are
   absent;
7. the builder service source is never read for Japanese IP;
8. template visibility is read with builder locale `en`;
9. uppercase `IP` redirects to the lowercase Japanese path.

## Forbidden scope

- Editing `src/data/service-details-ja.ts`, data tests or base
  `src/data/service-details.ts`
- Adding related columns or editing column content
- Editing service-list copy/layout or KO/ZH-Hant/EN copy
- Header/footer/flag component changes
- Attorney, FAQ, pricing, review, SEO helper, builder, asset or embedding
  changes
- Any new legal claim, fee, result or outcome promise
- Stage, commit, push, deploy or server operation by the worker

## Required automated gates

```bash
npx vitest run \
  'src/app/[locale]/services/[slug]/__tests__/ja-investment-page.test.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-civil-page.test.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-family-page.test.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-labor-page.test.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-criminal-page.test.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-ip-page.test.tsx' \
  src/lib/__tests__/public-route-policy-ja-investment.test.ts \
  src/app/__tests__/sitemap.test.ts
npm run -s typecheck
npx eslint \
  'src/app/[locale]/services/[slug]/page.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-investment-page.test.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-ip-page.test.tsx' \
  src/lib/public-route-policy.ts \
  src/lib/__tests__/public-route-policy-ja-investment.test.ts \
  src/app/sitemap.ts \
  src/app/__tests__/sitemap.test.ts
git diff --check
git status --short
```

## Manager browser gate

At `1440x1000` and `390x844`, verify:

- `/ja/services/ip` returns 200, has `<html lang="ja">` and the exact
  canonical;
- exact title, subtitle, intro and all five points render;
- the Japanese empty-column message renders and there are no related-column
  links;
- attorney/contact links and all four exact flag hrefs preserve the `ip` path;
- mobile menu visibly exposes 🇰🇷 KR, 🇯🇵 JP, 🇹🇼 TW and 🇺🇸 EN;
- BreadcrumbList, LegalService and Person schemas are present;
- no stale/fallback body or UI, broken images, horizontal overflow, console
  errors, page errors or failed requests;
- an unknown Japanese service detail remains 404;
- sitemap includes IP exactly once.

The manager owns browser QA and the checkpoint commit. No push or deployment
is authorized.
