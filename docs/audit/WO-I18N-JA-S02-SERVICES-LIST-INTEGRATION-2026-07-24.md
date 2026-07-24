# WO-I18N-JA-S02 — Japanese services list integration

Date: 2026-07-24 KST
Owner: implementation worker
Reviewer: independent read-only integration reviewer
Manager: root

## Objective

Publish the reviewed Japanese six-item services list at `/ja/services` without
projecting it through EN builder data. Keep Japanese service-detail routes
fail-closed until their content is translated; do not emit dead detail links.

## Allowed files

- `src/app/[locale]/(legacy)/index.tsx`
- `src/app/[locale]/(legacy)/services-legacy.tsx`
- `src/app/[locale]/(legacy)/legacy-page-bodies.tsx`
- `src/components/ServicesBento.tsx`
- `src/app/sitemap.ts`
- `src/app/[locale]/(legacy)/__tests__/services-ja.test.tsx` (new)
- `src/app/[locale]/(legacy)/__tests__/about-ja.test.tsx`
- `src/app/__tests__/sitemap.test.ts`

No other file may be edited.

## Required behavior

1. For `services` only, pass `SiteLocale` through legacy metadata/render
   dispatch. Keep other incomplete legacy pages on the current fallback.
2. Make `getServicesLegacyMetadata`, `ServicesLegacyPage`, and
   `ServicesLegacyPageBody` Japanese-aware.
3. For JA, skip builder template-visibility lookup entirely and render the
   file-reviewed hero and list. KO/ZH-Hant/EN builder behavior remains intact.
4. Add Japanese keywords and metadata:
   - title/description from `pageCopy.ja.services`;
   - canonical `/ja/services`;
   - `content-language: ja`;
   - Open Graph locale `ja_JP`;
   - KO/ZH-Hant/EN/JA alternates.
5. `ServicesBento` labels:
   - related columns: `関連コラム`
   - do not show any `View details`/`詳細を見る` CTA or
     `/ja/services/{slug}` link until JA detail pages exist.
6. Preserve the reviewed six cards, accordions, anchors, 16 Japanese column
   links, and all KO/ZH-Hant/EN labels/detail links.
7. Add exactly one Japanese services-list sitemap entry with four-language
   alternates. Preserve indexability rules.

## Test contract

- Metadata and dispatcher use `ja`, never `en`, for services.
- JA skips builder visibility lookup; EN still performs it.
- Static markup contains reviewed Japanese title/copy, `関連コラム`, and
  critical service anchors; it contains no English fallback labels.
- No JA `/services/{slug}` link is emitted.
- KO/ZH-Hant/EN still emit localized detail labels and links.
- The existing About test continues proving a different incomplete legacy page
  still uses the old fallback.
- `/ja/services` appears exactly once in sitemap with all four alternates;
  aggregate counts increase by exactly one.

## Worker gates

- Focused Vitest: new services test, About test, sitemap test, reviewed
  services-copy test, and relevant component/content tests.
- `npm run typecheck`
- scoped ESLint on all eight allowed files
- `git diff --check`

Do not stage, commit, push, deploy, or operate the dev server.

## Manager acceptance

- Independent reviewer checks route scope, builder isolation, metadata,
  labels, dead-link prevention, sitemap, tests, and other-locale regressions.
- Manager reruns gates.
- Desktop/mobile browser verifies `/ja/services`: reviewed Japanese content,
  six working accordions, Japanese column links, no dead detail links,
  flag switcher/canonical/hreflang, and no console errors.
- Commit only the eight allowed files plus this work order.
