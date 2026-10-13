# Static site on Cloudflare (2026-10-13)

The public site is served as static files from Cloudflare Workers static assets (Worker
`tseng-law`, `scripts/static-site/wrangler.jsonc`) instead of Vercel (user decision 2026-10-13: Vercel
cost; AI chat, inquiry form, member login and the builder editor are unused — cases arrive by email
only). ChatGPT Sites was tried first and rejected the site: its deploy archive may not exceed 256 MiB
expanded, and the HTML alone is ~290 MB. Plan and decision log: `~/tseng-sites-migration-20261013/PLAN.md`.

## What changes in the static build only (`NEXT_PUBLIC_STATIC_SITE=1`, `src/lib/static-site.ts`)

- `next/link` renders a plain anchor (`src/components/static-site/StaticLink.tsx`): no RSC requests or
  prefetching against a host that can only return HTML. Images are unoptimized.
- Hidden: member login links (Header, MobileNavDrawer, Footer, builder SiteHeader), the AI intake
  guide and its links (`NEXT_PUBLIC_AI_INTAKE_DISCOVERY_ENABLED=false`, sitemap, llms.txt), AI chat,
  visit metrics.
- The inquiry form becomes an email button (same heading and intro).
- Query-driven pages read the URL after hydration, because one snapshot serves every `?q=`:
  `/search` (docs embedded at build time), FAQ explorer, columns grid filters, traffic board,
  criminal-litigation board. URL updates use `history.replaceState` only.

The Vercel build is unchanged: every switch is the build-time constant `IS_STATIC_SITE`.

## Building

```
bash scripts/static-site/pull-data.sh                     # once / after builder edits; run by a person
node scripts/static-site/build.mjs --data=static-data/prod-mirror
node scripts/static-site/browser-check.mjs                # every page in Chromium: /api calls, 4xx, console errors
node scripts/static-site/compare-live.mjs                 # every sitemap page vs the live site
```

`build.mjs`: `next build` into `.next-static/` → `next start` on 127.0.0.1 reading builder content
from the frozen files (never Blob; it refuses to run next to `.env*` files) → crawl every page
reachable from `sitemap.xml` → `out/` = `public/` + Next static chunks (no source maps) + pages
(`/ko/about` → `out/ko/about.html`) + `_redirects` (next.config rules, builder SEO rules) + `_headers`
(next.config security headers) + `index.html` (browser-language chooser, same rules as
`src/lib/root-locale-negotiation.ts`) + localized `404.html`. Report: `static-site-report.json`.

## Frozen builder content

ko and zh-hant pages and the shared header/footer are rendered from builder data, frozen in
`static-data/prod-mirror/` (git-ignored: the mirror also holds drafts). Once Vercel is cancelled that
directory is the only copy — keep a backup, and edit its published JSON to change those pages.

## Publishing

Push to `main`. The MacBook Air runs `scripts/static-site/air-deployer.sh` every 10 minutes via launchd
(`com.son7.tseng-static-deploy`, installed by `install-air-deployer.sh`): main in the worktree
`~/Projects/tseng-law-deploy` → `build.mjs --data=~/tseng-static-deploy/data/prod-mirror
--media-origin=https://media.tseng-law.com` → `upload-media.mjs --bucket=tseng-law-media` →
`wrangler deploy --config scripts/static-site/wrangler.jsonc --assets out-deploy` (the Air's wrangler
login) → waits until `/build-info.json` reports the commit. State: `~/tseng-static-deploy/state/status.json`,
logs next to it. `air-deployer.sh --force` redeploys main.

Limits: Workers static assets (free) allow 20,000 files per version and 25 MiB per file; `_redirects`
allows 2,000 exact + 100 pattern rules and Cloudflare counts every rule after the first pattern as a
pattern, so `assemble.mjs` writes exact rules first. Images and videos (2.6 GB) are served from
Cloudflare R2 (`media.tseng-law.com`, bucket `tseng-law-media`, free tier); only `images/brand/` stays
with the pages. `www.tseng-law.com` → apex is a domain setting.
