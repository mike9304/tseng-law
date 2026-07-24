# WO-I18N-REV-SEO01 — Align noindex reviews with sitemap

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

All four public review pages intentionally emit `noindex, nofollow`. Remove the
existing KO/ZH-Hant/EN review URLs from the sitemap and keep Japanese absent.

## Allowed files

1. `src/app/sitemap.ts`
2. `src/app/__tests__/sitemap.test.ts`

No other file may be edited. Do not stage, commit, push, deploy, or operate the
development server.

## Contract

- Remove `/reviews` from `STATIC_PATHS`.
- Do not add any Japanese reviews entry.
- Builder-published page collection can reintroduce KO/ZH-Hant/EN review URLs.
  Apply a final route-policy filter so any localized `/reviews` entry is
  removed regardless of whether it came from the static list or builder data.
- Assert all four URLs are absent:
  - `https://tseng-law.com/ko/reviews`
  - `https://tseng-law.com/zh-hant/reviews`
  - `https://tseng-law.com/en/reviews`
  - `https://tseng-law.com/ja/reviews`
- Update only aggregate expectations affected by removing the three existing
  static entries: before-filter total `153 → 150`, after-filter total
  `144 → 141`; removed noindex fixture count remains 9.
- Preserve every other sitemap entry, alternate, priority, and indexability
  rule.

## Required verification

- Sitemap suite passes with exact four-locale reviews absence assertion.
- Add a builder-entry regression fixture that attempts to reintroduce review
  URLs and prove the final sitemap still excludes them while preserving a
  non-review sentinel entry.
- `/ja/contact`, `/ja/pricing`, and other native Japanese entry assertions
  remain green.
- `npm run typecheck`
- scoped ESLint for the two allowed files
- `git diff --check`

Browser sitemap fetch and commit are manager gates.
