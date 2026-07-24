# WO-I18N-JA-COLUMN-MOBILE-OVERFLOW — Constrain public column grid on mobile

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Trigger

Manager Playwright QA of
`/ja/columns/taiwan-company-establishment-basics` at 390 × 844 found:

- document `scrollWidth`: 697px;
- viewport `clientWidth`: 390px;
- `.blog-container`: 354.8px;
- `.blog-body` and `.blog-sidebar`: 679.7px.

The mobile media query correctly changes the grid to one column, but its grid
items keep a large intrinsic minimum width under long Japanese text. A live
browser injection of the contracted CSS below reduced document width to 390px
and both grid items to 354.8px.

## Allowed files

1. `src/app/globals.css`
2. `src/components/__tests__/column-mobile-overflow.test.ts` (new)

Do not edit any other file. Do not stage, commit, push, deploy, or operate the
development server. Other uncommitted localization work belongs to another
lane and must remain untouched.

## Implementation contract

Inside the existing `@media (max-width: 900px)` public column section, add:

```css
.blog-container > * {
  min-width: 0;
}

.blog-container > .blog-body {
  max-width: 100%;
}
```

Keep the existing single-column grid, body padding, static sidebar, and hero
rules unchanged. Scope the fix to public blog/column layout; do not change
global word-breaking, typography, headers, footers, or builder CSS.

## Regression test

The focused source-contract test must read `src/app/globals.css`, isolate the
`@media (max-width: 900px)` block that owns `.blog-container`, and assert:

- `.blog-container` remains `grid-template-columns: 1fr`;
- `.blog-container > *` has `min-width: 0`;
- `.blog-body` keeps `padding: 1.5rem 1.2rem`;
- `.blog-container > .blog-body` has `max-width: 100%`, with enough
  specificity to beat the later global `.blog-body { max-width: 72ch; }`
  editorial measure;
- `.blog-sidebar` remains `position: static`;
- the new declarations are not introduced as unscoped global rules.

## Manager browser gate

At desktop 1440 × 900 and mobile 390 × 844:

- status 200 and `lang=ja`;
- document horizontal overflow equals zero;
- `.blog-body` and `.blog-sidebar` stay within the content container;
- the four flag links, article text, images, and sidebar remain visible;
- no console or page errors.

Run focused Vitest, typecheck, scoped ESLint, and `git diff --check`.
