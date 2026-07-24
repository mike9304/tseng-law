# WO-SERVICE-DETAIL-MOBILE-OVERFLOW — Constrain the stacked service grid

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Evidence

Manager Playwright inspection at `390x844` on `/ja/services/labor` measured:

```text
window.innerWidth                  390
document.documentElement.scrollWidth 405
.svc-container width              354.797
computed grid track               387.266
.svc-body width                   387.266
.svc-sidebar width                387.266
```

At `max-width: 900px`, `.svc-container` changes from a two-column grid to
`grid-template-columns: 1fr`. The remaining sidebar item's intrinsic minimum
size expands that `1fr` track beyond the container. A live browser override
to `minmax(0, 1fr)` constrained the track to `354.797px` and reduced document
scroll width to `390px`.

This is a shared service-detail layout defect, not a labor-copy defect.

## Goal

Constrain the stacked service-detail grid at and below 900px without changing
desktop layout, service content, page markup, navigation, or any locale.

## Allowed files

1. `src/app/globals.css`
2. `src/components/__tests__/service-detail-mobile-overflow.test.ts` (new)

No other file may be modified.

## Exact implementation contract

In the existing `@media (max-width: 900px)` service-detail block, change only:

```css
.svc-container { grid-template-columns: 1fr; }
```

to:

```css
.svc-container { grid-template-columns: minmax(0, 1fr); }
```

Preserve `.svc-sidebar { position: static; }` and every other CSS rule.

Do not add global overflow clipping. The grid track must be fixed at its
source.

## Regression test

Create `src/components/__tests__/service-detail-mobile-overflow.test.ts`.
Read `src/app/globals.css`, identify the existing
`@media (max-width: 900px)` block containing `.svc-container`, and prove:

1. exactly one such target media block exists;
2. its `.svc-container` rule contains
   `grid-template-columns: minmax(0, 1fr)`;
3. it does not contain the old unconstrained
   `grid-template-columns: 1fr`;
4. the same target block still contains
   `.svc-sidebar { position: static; }`;
5. no `overflow-x: hidden` or `overflow-x: clip` workaround is introduced in
   that target block.

Use brace-aware extraction, not a regex that stops at the first nested brace.

## Forbidden scope

- Route, sitemap, language-switch or service-data edits
- Header, drawer, footer, column, attorney, builder or asset edits
- Desktop `.svc-container` grid changes
- Global/body/html overflow clipping
- Stage, commit, push, deploy or server operation by worker

## Required gates

```bash
npx vitest run \
  src/components/__tests__/service-detail-mobile-overflow.test.ts \
  'src/app/[locale]/services/[slug]/__tests__/ja-labor-page.test.tsx'
npm run -s typecheck
npx eslint \
  src/components/__tests__/service-detail-mobile-overflow.test.ts
git diff --check
git status --short
```

## Manager browser gate

At `390x844`, recheck `/ja/services/labor` before and after opening the mobile
drawer. The document scroll width must be at most the viewport width, all
content and flag links must remain visible, and images/console/page/network
checks must pass.

Also spot-check an existing Japanese service detail and a non-Japanese
service detail at `390x844` to prove the shared layout remains stable.

The manager owns browser QA and the checkpoint commit. No push or deployment
is authorized.
