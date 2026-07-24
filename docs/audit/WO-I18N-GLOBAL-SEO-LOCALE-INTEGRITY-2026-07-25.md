# WO-I18N-GLOBAL-SEO — Localize global metadata and organization JSON-LD

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Stop localized public routes from inheriting Korean organization identity in
global metadata, and make the shared `WebSite` and `LegalService` JSON-LD use
the correct locale identity and Schema.org language property.

This work changes global metadata and structured data only. It must not change
visible page copy, titles, descriptions, routes, language-switcher UI, contact
channels, attorney facts, builder behavior, or the root-layout defaults.

## Allowed files

1. `src/app/[locale]/layout.tsx`
2. `src/lib/seo.ts`
3. `src/lib/__tests__/global-seo-locale-integrity.test.ts` (new)

No other files may be modified.

## Exact locale contract

Organization names:

| locale | organization name |
| --- | --- |
| `ko` | `법무법인 호정` |
| `zh-hant` | `昊鼎國際法律事務所` |
| `en` | `Hovering International Law Firm` |
| `ja` | `昊鼎国際法律事務所` |

Attorney names remain:

| locale | attorney name |
| --- | --- |
| `ko` | `증준외 변호사` |
| `zh-hant` | `曾雋崴律師` |
| `en` | `Attorney Wei Tseng` |
| `ja` | `曾雋崴弁護士` |

BCP 47 language values:

```ts
['ko', 'zh-Hant', 'en', 'ja']
```

The shared organization identifier is exactly:

```text
https://tseng-law.com/#organization
```

## Required implementation

### Locale metadata

- Export or otherwise reuse a single `getOrganizationName(locale)` helper from
  `src/lib/seo.ts`; do not duplicate a second organization-name map in the
  locale layout.
- In `generateMetadata()` in `src/app/[locale]/layout.tsx`, preserve the
  locale's existing `title` and `description`.
- Explicitly override these inherited root metadata fields with the exact
  locale organization name:
  - `applicationName`
  - `authors: [{ name }]`
  - `creator`
  - `publisher`
- Do not edit `src/app/layout.tsx`; its Korean defaults remain correct for the
  root layout.

### `WebSite` JSON-LD

For `buildWebsiteJsonLd(locale)`:

- Keep top-level `name`, `url`, `inLanguage`, `@id`, alternate names, and
  search action behavior localized as they are.
- Localize nested `publisher.name` to the current locale organization.
- Set nested `publisher.url` to the current locale root:
  - `/ko`, `/zh-hant`, `/en`, or `/ja`.
- Set nested `publisher.@id` to the shared neutral organization identifier
  `https://tseng-law.com/#organization` for every locale.
- Preserve logo and verified `sameAs` URLs.
- Preserve the existing Japanese exclusion of the English organization name.

### `LegalService` JSON-LD

For `buildLegalServiceJsonLd(locale)`:

- Add `@id: https://tseng-law.com/#organization`.
- Preserve the localized `name`, locale-root `url`, contact route, employee
  name/route, address, telephone, email, area served, image, logo, and verified
  `sameAs` URLs.
- Replace the top-level Schema.org-invalid `availableLanguage` property with
  `knowsLanguage`.
- Its exact value is `['ko', 'zh-Hant', 'en', 'ja']`.
- Keep `contactPoint[].availableLanguage`, but change its exact value to the
  same BCP 47 array.
- Do not add `inLanguage` to `LegalService`.

## Regression test contract

Create `src/lib/__tests__/global-seo-locale-integrity.test.ts` and test all four
locales.

1. Call `generateMetadata({ params: { locale } })` and assert:
   - the existing title and description still equal `siteContent[locale].meta`;
   - `applicationName`, `authors`, `creator`, and `publisher` equal the exact
     locale organization name;
   - non-Korean locales do not expose `법무법인 호정` in those four fields.
2. Assert each `buildWebsiteJsonLd(locale)` has:
   - its existing localized top-level name, root URL, language and website ID;
   - a publisher with localized name/root URL;
   - publisher `@id` exactly `https://tseng-law.com/#organization`.
3. Assert each `buildLegalServiceJsonLd(locale)` has:
   - `@id` exactly `https://tseng-law.com/#organization`;
   - exact localized organization and attorney names and locale URLs;
   - top-level `knowsLanguage` exactly
     `['ko', 'zh-Hant', 'en', 'ja']`;
   - no top-level `availableLanguage`;
   - no top-level `inLanguage`;
   - contact-point `availableLanguage` exactly the BCP 47 array.
4. Preserve compatibility with
   `src/lib/__tests__/canonical-attorney-seo-identity.test.ts`.

## Forbidden regressions

- Editing `src/app/layout.tsx`
- Changing any visible page copy, page title, page description, or route
- Changing phone, email, address, attorney identity, logo, or social links
- Reintroducing `曾俊瑋`
- Using language names such as `Korean`, `Traditional Chinese`, `English`, or
  `Japanese` in the global `LegalService` language arrays
- Locale-specific organization IDs such as `/ko#organization`
- Adding `inLanguage` to `LegalService`
- Builder, admin, content-data, asset, or embedding changes
- stage, commit, push, deploy, or server operation by the worker

## Required gates

```bash
npx vitest run \
  src/lib/__tests__/global-seo-locale-integrity.test.ts \
  src/lib/__tests__/canonical-attorney-seo-identity.test.ts
npm run -s typecheck
npx eslint \
  'src/app/[locale]/layout.tsx' \
  src/lib/seo.ts \
  src/lib/__tests__/global-seo-locale-integrity.test.ts
git diff --check
git status --short
```

The manager will independently inspect the diff, rerun gates, and verify all
four `/[locale]/about` pages in a real browser before committing.
