# WO-I18N-JA-C03 — Japanese contact sitemap

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Add the newly native `/ja/contact` page to the public sitemap exactly once.

## Allowed files

1. `src/app/sitemap.ts`
2. `src/app/__tests__/sitemap.test.ts`

No other file may be edited. Do not stage, commit, push, deploy, or operate the
development server.

## Contract

- Add one `createEntry('ja', '/contact', ...)` alongside the other native
  Japanese static surfaces.
- Priority is `0.8`.
- Alternates are exactly KO, ZH-Hant, EN, JA, and x-default:

```text
ko        https://tseng-law.com/ko/contact
zh-Hant   https://tseng-law.com/zh-hant/contact
en        https://tseng-law.com/en/contact
ja        https://tseng-law.com/ja/contact
x-default https://tseng-law.com/ko/contact
```

- Update only sitemap total-count expectations that increase by this one entry.
- Preserve all prior entries and indexability behavior.

## Required verification

- `/ja/contact` exact count is one.
- Exact alternate object assertion.
- Existing sitemap suite passes.
- `npm run typecheck`
- scoped ESLint for the two allowed files
- `git diff --check`

Browser verification and commit are manager gates.
