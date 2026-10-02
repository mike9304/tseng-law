# Traffic column collection — 2026-10-02

## Problem and result

The existing `/{locale}/traffic-accidents` hub selected columns from a short hardcoded list. New published traffic columns 072–075 were reachable at their original URLs but omitted from that dedicated collection. The hub now lists the complete reviewed traffic collection, with original article links, search, subject and video filters, thumbnails, summaries, dates, reading times and existing AI attribution. Article detail pages use the same classifier for their collection return link and related traffic articles.

The review found eight distinct articles: eight Traditional Chinese, four Korean, four English and three Japanese copies in the four existing hub languages. Repository content and the public sitemap contain 109 translated traffic article URLs across 49 languages; the other language article routes are preserved, without mixing translations into the four hub lists. No article bodies, original URLs, canonical metadata, official sources or media files were rewritten.

## Classification and future publishing

Eight body-reviewed legacy slugs establish existing membership and subjects. New published file/CMS columns or issue posts use exact `traffic-accidents` or `traffic-procedure`, `traffic-evidence`, `traffic-liability`, `traffic-compensation` tags. Titles alone never imply membership. The collection excludes internal test content, deduplicates slugs, keeps the current locale and original route, and orders by publication date and column number. The actual legacy-to-CMS adapter now preserves file tags; a regression test reproduces the former loss through the merged CMS reader. See `docs/columns/TRAFFIC-COLLECTION.md`.

## Actual Claude execution and independent review

Claude Code 2.1.287 used the existing first-party Claude subscription and returned canonical model `claude-opus-5-5`. The implementation completed successfully in 71 turns, with zero permission denials. Its curated input contained only 41 relevant public source/content files (411,456 bytes); no .env files, credentials, customer case documents or unrelated unpublished articles were provided. File tools were confined to the curated directory; no Claude shell/network tools were enabled.

Codex independently checked the result and corrected (1) frontmatter traffic tags being dropped by the actual CMS adapter, (2) latest article return/related links still using the obsolete slug list, and (3) WebKit narrow-screen grid overflow. The board uses native GET controls and works without JavaScript. Search parameters never become canonical URLs.

## Local validation before publishing

- Targeted tests: 66/66 passed across seven suites, including classifier, board rendering, real merged-loader metadata regression, traffic media and existing CMS adapters.
- Typecheck, full ESLint, production build and `git diff --check`: passed.
- Security route guard check: 279 routes inspected; 273 mutation handlers covered; four existing comment-allowlisted handlers reported. No auth or mutation route changed.
- Real browser verification: 15/15 cases passed. Chromium desktop and 390 px mobile in all four languages, 320 px Traditional Chinese, WebKit 390 px in all four languages, Firefox desktop Traditional Chinese, and JavaScript-disabled search/reset.
- Browser assertions include all 19 original links and counts, canonical and CollectionPage metadata, duplicate/language checks, horizontal overflow, thumbnails, zero JavaScript errors, WCAG 2 A/AA and 2.1 AA axe rules within the board, article click/video/return/related links, back navigation, combined filters, empty search, reload and reset.
- Desktop and narrow-screen screenshots were visually inspected. Existing consultation routes and site identity remain intact.

## Existing failures and limits

Full unit suite: 1,373 files passed and one failed; 13,547 tests passed, one failed, 14 skipped and one todo. The failing `seed-composite-integration.test.ts` case reports `LocalJsonWriteConflictError`; the same suite failed before any implementation edits (baseline two failing tests, isolated baseline reproduction one). This existing builder seed concurrency failure is outside the collection change and is not represented as a passing full suite.

The unchanged production dependency audit reports 13 advisories (one critical, nine high, three moderate), including the existing Next.js version. No dependency upgrade is bundled into this collection publication. Existing build output also reports an unrelated ContactEditorial CSS autoprefixer warning. Real iOS hardware, Safari UI, assistive-technology reading, authenticated CMS editing and provider integrations were not tested; WebKit emulation is not a substitute for those checks.

Evidence (Claude inputs/results, inventories, baseline/final test logs, screenshots and browser results) is retained in `/Users/son7/Documents/Codex/2026-10-02/task-4/evidence`. Deployment and production verification are recorded in the task's final handoff after the Git-to-Vercel deployment.
