# WO-I18N-JA-COLUMN-PAGINATION-MOBILE-OVERFLOW — Constrain prev/next cards

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Trigger

Manager Playwright QA of
`/ja/columns/withdraw-capital-taiwan-company` at 390 × 844 found 71px of
horizontal document overflow after the article grid itself had been fixed.
The overflowing node was the next-column link in the prev/next navigation:
its right edge was 461px and the nav's `scrollWidth` was 443px inside a 355px
container. A live browser injection of `min-width: 0` and
`overflow-wrap: anywhere` on the two flex children reduced the document width
to 390px.

## Allowed files

1. `src/app/[locale]/columns/[slug]/page.tsx`
2. `src/app/globals.css`
3. `src/components/__tests__/column-mobile-overflow.test.ts`

Do not edit any other file. Preserve the uncommitted COL002 content lane. Do
not stage, commit, push, deploy, or operate the development server.

## Implementation

- Change only the prev/next navigation class from `container` to
  `container column-post-nav`.
- In the existing public-column `@media (max-width: 900px)` section add:

```css
.column-post-nav > * {
  min-width: 0;
  overflow-wrap: anywhere;
}
```

- Keep the current two-card flex layout, labels, order, links, alignment,
  padding, and desktop appearance unchanged.
- Do not target every `nav.container`; scope the rule to `column-post-nav`.

## Regression test

Extend the existing focused test to read the page source and CSS, asserting:

- the nav has `className="container column-post-nav"`;
- the existing `prevPost` and `nextPost` links remain locale-aware;
- the mobile media block contains the exact scoped child rule;
- there is no global unscoped `nav.container > *` rule;
- existing article-grid mobile assertions remain intact.

## Manager browser gate

On a column with two neighboring posts, at 390 × 844 and 1440 × 900:

- document horizontal overflow is zero;
- both cards remain inside the nav container;
- both labels and titles are visible;
- hrefs retain the selected locale;
- no console or page errors.

Run focused Vitest, relevant column tests, typecheck, scoped ESLint, and
`git diff --check`.
