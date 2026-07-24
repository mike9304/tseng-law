# WO-I18N-JA-L02 — Make Japanese lawyer navigation fail closed

Date: 2026-07-24 KST
Owner: implementation worker
Reviewer: independent read-only reviewer
Manager: root

## Context

L01 publishes `/ja/lawyers/wei-tseng`, but the shared language-switch policy
still sends its JP flag to `/ja/lawyers`. The approved JA profile also contains
links to intent/service-detail routes that are not yet translated:

- `/ja/taiwan-lawyer` and `/ja/taiwan-company-setup-lawyer` render KO copy
  under a JA URL.
- `/ja/services/investment` and `/ja/services/civil` are not published JA
  detail pages.

Do not expose those routes until their Japanese content is complete.

## Allowed files

- `src/lib/public-route-policy.ts`
- `src/components/__tests__/locale-flag-switcher.test.tsx`
- `src/data/attorney-profiles.ts`
- `src/data/__tests__/attorney-profiles-ja.test.ts`

No other file may be edited.

## Required behavior

1. `jaLanguageSwitchTarget('/lawyers/wei-tseng')` returns
   `/ja/lawyers/wei-tseng`. This is the only localized JA lawyer-detail route
   to preserve. Other unsupported lawyer detail slugs continue to fall back to
   `/ja/lawyers`.
2. The four language flags on `/ja/lawyers/wei-tseng` point to the equivalent
   KO, JP, TW, and EN detail routes, with JP current.
3. Replace only the first four Japanese profile internal links with:
   - `台湾弁護士・チーム紹介` → `/ja/lawyers`
   - `台湾会社設立ガイド` →
     `/ja/columns/taiwan-company-establishment-basics`
   - `台湾会社設立サービス` → `/ja/services#investment`
   - `民事訴訟・損害賠償サービス` → `/ja/services#civil`
4. Preserve the Japanese gym-injury column and contact links, all other JA
   profile content, and all KO/ZH-Hant/EN profile content byte-for-byte.
5. Do not implement or redirect the untranslated intent/service detail routes
   in this work order.

## Test contract

- Exact JA flag hrefs on the translated lawyer detail.
- Unsupported lawyer detail still falls back to `/ja/lawyers`.
- Exact six Japanese internal links and labels.
- JA profile contains no `/ja/taiwan-lawyer`,
  `/ja/taiwan-company-setup-lawyer`, or `/ja/services/{slug}` path.
- Official portrait, email, `sameAs`, facts, and all non-JA profiles remain
  unchanged.

## Gates

- focused flag-switcher and attorney-profile tests
- `npm run -s typecheck`
- scoped ESLint on all four allowed files
- `git diff --check`
- browser desktop/mobile check of the translated profile flags and links

Do not stage, commit, push, deploy, or operate the dev server.
