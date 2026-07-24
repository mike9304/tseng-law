# WO-I18N-JA-F01 — Point Japanese footer topics to localized pages

Date: 2026-07-24 KST
Owner: implementation worker
Reviewer: independent read-only reviewer
Manager: root

## Objective

Remove Japanese footer links that currently enter KO-coerced landing/guide
routes. Keep the five topic labels but route each to a real localized Japanese
list, profile, column, or section anchor.

## Allowed files

- `src/data/site-content.ts`
- `src/components/__tests__/ja-footer.test.tsx`

No other file may be edited.

## Required exact link map

In `siteContent.ja.footer.linkGroups`, keep the `人気トピック` title and order,
and replace only its hrefs:

1. `台湾弁護士` → `/ja/lawyers`
2. `台湾会社設立` → `/ja/services#investment`
3. `台湾訴訟` → `/ja/services#civil`
4. `台湾会社設立ガイド` →
   `/ja/columns/taiwan-company-establishment-basics`
5. `韓国語対応の台湾弁護士` → `/ja/lawyers/wei-tseng`

Preserve all labels, other Japanese footer groups, office/legal/social links,
and KO/ZH-Hant/EN content byte-for-byte.

## Test contract

- Japanese footer source data contains the exact five label/href pairs.
- Preserve the existing `BASE_FOOTER_LINK_LIMIT = 3` policy: the rendered JA
  footer contains the first three exact label/href pairs. Do not widen the
  footer group or alter its layout in this work order.
- JA footer contains none of:
  - `/ja/taiwan-lawyer`
  - `/ja/taiwan-company-setup-lawyer`
  - `/ja/taiwan-litigation-lawyer`
  - `/ja/guides/taiwan-company-setup`
  - `/ja/korean-lawyer-in-taiwan`
- Existing KR/JP/TW/EN flag and footer legal-link assertions remain green.

## Gates

- focused footer tests
- `npm run -s typecheck`
- scoped ESLint on the two allowed files
- `git diff --check`
- browser footer link check on a JA page

Do not stage, commit, push, deploy, or operate the dev server.
