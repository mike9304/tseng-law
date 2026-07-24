# WO-I18N-JA-SERVICE-INVESTMENT — Publish one verified Japanese service detail

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Publish exactly `/ja/services/investment` from the already reviewed Japanese
content in `src/data/service-details-ja.ts`.

The five Japanese detail routes that do not yet have approved bodies
(`civil`, `family`, `labor`, `criminal`, and `ip`) must remain unavailable.
Korean, Traditional Chinese, and English service-detail behavior must remain
builder-backed and unchanged.

## Allowed files

1. `src/app/[locale]/services/[slug]/page.tsx`
2. `src/app/[locale]/services/[slug]/__tests__/ja-investment-page.test.tsx` (new)
3. `src/lib/public-route-policy.ts`
4. `src/lib/__tests__/public-route-policy-ja-investment.test.ts` (new)
5. `src/app/sitemap.ts`
6. `src/app/__tests__/sitemap.test.ts`

No other product or test file may be modified.

## Locale boundary

- Public route params and rendering use `SiteLocale`.
- Builder/admin `Locale` remains exactly `ko | zh-hant | en`.
- Do not edit `src/lib/locales.ts`.
- Do not edit `src/lib/builder/services/source.ts` or any builder/admin type.
- The Japanese page body must not call
  `readServiceAreaSourceRecordBySlug()` with `ja`.
- If the existing service-item template visibility is reused for Japanese,
  cross the boundary explicitly with `toBuilderLocale(locale)` so the builder
  reader receives `en`, never `ja`.

## Japanese record contract

Create a small route-local adapter/resolver:

- For `locale === 'ja'`, normalize the incoming slug with
  `normalizeServiceAreaSlug()`.
- Resolve only the canonical source slug `investment`.
- Read the page's `title`, `subtitle`, `intro`, and `keyPoints` exclusively
  from `getJapaneseServiceDetail('investment')`.
- Reuse only the stable `columnSlugs` from the base `investment` entry in
  `src/data/service-details.ts`; do not copy or translate the old KO/ZH/EN
  body.
- Give the adapted record canonical slug `investment`.
- Return `null` for every other Japanese slug.
- For `ko`, `zh-hant`, and `en`, keep using
  `readServiceAreaSourceRecordBySlug()` and preserve builder slug overrides.

The Japanese branch must not edit or widen the builder service source model.

## Japanese UI copy

Add a complete `ja` entry to the route copy map:

```ts
{
  backLabel: '← サービス一覧へ',
  keyPointsLabel: '主なポイント',
  attorneyHeading: 'この分野の担当弁護士',
  columnsLabel: '関連コラム — 詳しく見る',
  readMore: '記事を読む →',
  contactLabel: '法律相談',
  contactDesc: 'この分野に関するご相談は、お問い合わせフォームからお申し込みください。',
  contactBtn: 'お問い合わせ',
  emptyMsg: 'この分野の関連コラムを準備中です。',
  reviewLead: 'このページは',
  reviewTail: 'が内容を確認し、関連コラムと相談窓口をご案内しています。',
  breadcrumbServices: '取扱業務',
}
```

Japanese home breadcrumb: `ホーム`.

Do not display the English route labels (`Back to services`, `Key Points`,
`Book Consultation`, `Read full article`) on the Japanese page.

## Route behavior

- `generateStaticParams()` keeps all existing builder-backed KO/ZH-Hant/EN
  entries and adds exactly:

```ts
{ locale: 'ja', slug: 'investment' }
```

- It must not add the other five Japanese service slugs.
- `generateMetadata()` accepts `SiteLocale`.
- Japanese metadata uses the approved Japanese title, subtitle/intro and
  attorney name.
- Canonical is exactly
  `https://tseng-law.com/ja/services/investment`.
- Japanese metadata uses `alternateLocales: siteLocales`, yielding KO,
  ZH-Hant, EN, JA and x-default alternates for the same `investment` path.
- Japanese Open Graph locale is `ja_JP`; content-language is `ja`.
- Invalid or unsupported Japanese detail slugs return empty metadata and
  `notFound()` from the page.
- A normalized alias/casing of `investment` redirects to the canonical
  `/ja/services/investment` using the existing redirect rule.
- The Japanese page uses the existing Japanese attorney profile, Japanese
  related columns, `/ja/lawyers/wei-tseng`, and `/ja/contact`.
- Breadcrumb, LegalService and Person JSON-LD use `ja` paths and Japanese
  names.
- Do not introduce any `/ko` or `/en` content/link fallback in the rendered
  Japanese page.

## Language-switch policy

In `jaLanguageSwitchTarget()`:

- `services/investment` maps exactly to `/ja/services/investment`.
- Every other `services/...` detail path continues to map to `/ja/services`.
- `/services` continues to map to `/ja/services`.
- Preserve all existing column, lawyer and unsupported-product behavior.

## Sitemap

Add exactly one Japanese service-detail entry:

```text
https://tseng-law.com/ja/services/investment
```

- priority `0.72`
- alternates for `ko`, `zh-Hant`, `en`, `ja`, and `x-default`, all using the
  `/services/investment` path
- do not emit `/ja/services/civil`, `/family`, `/labor`, `/criminal`, or `/ip`

## Route regression test

The new route test must prove:

1. Japanese metadata exactness: title, description, canonical,
   content-language, `ja_JP`, and five alternate keys.
2. Japanese static params include only `investment`; builder records are read
   once for the three existing locales, not as Japanese service content.
3. Rendered `/ja/services/investment` contains:
   - every exact Japanese title/subtitle/intro/key point from
     `getJapaneseServiceDetail('investment')`;
   - all Japanese route labels above;
   - `曾雋崴弁護士`;
   - `/ja/lawyers/wei-tseng` and `/ja/contact`;
   - Japanese related-column paths;
   - BreadcrumbList, LegalService and Person JSON-LD with Japanese paths.
4. It does not contain the representative English labels or Korean body.
5. The five unsupported Japanese slugs produce empty metadata and
   `notFound()`, without a Japanese builder source read.
6. At least one representative KO, ZH-Hant and EN call still uses the exact
   existing builder source and template-visibility locale.

## Policy and sitemap tests

- Lock the exact switch targets for `/services`, `/services/investment`, the
  other five service slugs, one column detail, the canonical lawyer detail and
  one unsupported product path.
- Extend the sitemap test to assert the one Japanese investment detail appears
  exactly once with the exact priority and alternates.
- Assert the other five Japanese service-detail URLs are absent.

## Forbidden regressions

- Extending builder/admin `Locale` with `ja`
- Calling a builder service source reader with locale `ja`
- Rendering KO or EN service content at a `/ja/services/*` URL
- Publishing any Japanese service detail except `investment`
- Editing the approved Japanese investment body
- Editing KO, ZH-Hant or EN service content
- Editing attorney, column, SEO-helper, builder, asset or embedding files
- stage, commit, push, deploy or server operation by the worker

## Required gates

```bash
npx vitest run \
  src/data/__tests__/service-details-ja-investment.test.ts \
  'src/app/[locale]/services/[slug]/__tests__/ja-investment-page.test.tsx' \
  src/lib/__tests__/public-route-policy-ja-investment.test.ts \
  src/app/__tests__/sitemap.test.ts
npm run -s typecheck
npx eslint \
  'src/app/[locale]/services/[slug]/page.tsx' \
  'src/app/[locale]/services/[slug]/__tests__/ja-investment-page.test.tsx' \
  src/lib/public-route-policy.ts \
  src/lib/__tests__/public-route-policy-ja-investment.test.ts \
  src/app/sitemap.ts \
  src/app/__tests__/sitemap.test.ts
git diff --check
git status --short
```

The manager will independently review the diff, rerun all gates, and verify
desktop/mobile `/ja/services/investment`, the language-switch links, related
columns, JSON-LD, sitemap, and a blocked unsupported detail before committing.
