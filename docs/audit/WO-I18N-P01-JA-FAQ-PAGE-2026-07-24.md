# WO-I18N-P01 — Japanese FAQ page

## Problem

Japanese FAQ content already exists in `src/data/faq-content.ts`, but the direct
`/ja/faq` route uses the three-language builder locale normalizer. It therefore
renders the Korean FAQ surface and Korean metadata. The shared FAQ accordion
also falls through to an English section heading for Japanese.

## Required implementation

1. Preserve the existing builder-backed FAQ behavior for KO/ZH-Hant/EN.
2. Treat route params as `SiteLocale` and normalize them with
   `normalizeSiteLocale()`.
3. Add an explicit Japanese static branch before any builder FAQ metadata,
   published-page, member, or FAQ-engine calls.
4. Japanese metadata must use `pageCopy.ja.faq`, canonical `/ja/faq`,
   Japanese content language/Open Graph locale, and all four public language
   alternates.
5. Japanese body must render:
   - `PageHeader` with `pageCopy.ja.faq`;
   - every item in `faqContent.ja`;
   - `FAQAccordion` with Japanese heading `よくある質問` and Japanese FAQ label;
   - FAQPage JSON-LD built from the same Japanese items.
6. Do not route Japanese through `resolvePublishedSitePage()`,
   `buildPublishedSitePageMetadata()`, member access, or the three-language
   builder FAQ engine.
7. Keep all existing focus/accordion accessibility behavior.
8. Add focused tests proving Japanese metadata, all Japanese questions, Japanese
   headings/JSON-LD, no builder calls for Japanese, and unchanged builder calls
   for at least one established locale.

## Exact allowed files

- `src/app/[locale]/faq/page.tsx`
- `src/components/FAQAccordion.tsx`
- `src/app/[locale]/faq/__tests__/ja-page.test.tsx` (new)

Read-only dependencies:

- `src/data/faq-content.ts`
- `src/data/page-copy.ts`
- `src/lib/locales.ts`
- `src/lib/seo.ts`

Do not revise legal substance in FAQ answers in this work order; the
cross-language legal-consistency review is separate. Do not change builder FAQ
data, Header/Footer, CSS, route policy, or other page bodies. Do not stage,
commit, push, deploy, or modify runtime data.

## Verification

Run from `/Users/son7/Projects/tseng-law`:

```bash
npx vitest run 'src/app/[locale]/faq/__tests__/ja-page.test.tsx' \
  src/components/__tests__/site-remediation-a11y.test.tsx
npm run typecheck
npx eslint 'src/app/[locale]/faq/page.tsx' \
  src/components/FAQAccordion.tsx \
  'src/app/[locale]/faq/__tests__/ja-page.test.tsx'
git diff --check
git status --short
```

Report exact commands and results. If another file changes, stop and report the
scope violation instead of cleaning or reverting it.
