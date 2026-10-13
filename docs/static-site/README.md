# Static site on Codex Sites (2026-10-13)

The public site is a static copy of the Next.js app served from the tseng-law.com **Codex (ChatGPT) Site**
(`project_id` `appgprj_6acd9a1a4ce4819184cc51672a764431`) instead of Vercel (user decisions 2026-10-13: Vercel
cost; AI chat, inquiry form, member login and the builder editor are unused — cases arrive by email only;
「vercel 아니고 codex site 에 배포해야돼」). Sites refuses deploy archives over 256 MiB expanded and the pages
alone are ~300 MB, so the Site is a **Worker build**: every page is stored gzip-compressed and the Worker
sends it as-is (`scripts/static-site/sites-worker.js`, packed by `sites-pack.mjs`, ~146 MiB in total).
Images and videos are served from Cloudflare R2 (`media.tseng-law.com`). The Cloudflare Workers target
(`wrangler.jsonc`) was the interim plan of the same day and is not used. Plan and decision log:
`~/tseng-sites-migration-20261013/PLAN.md`.

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

`scripts/static-site/codex-sites-deploy.sh <static build>`:
1. `sites-pack.mjs` → `<site repo>/dist`: `dist/client/__p/<page>.html.gz` (gzip -9), every other file as is,
   `dist/server/index.js` (the Worker with this build's `_redirects`, `/*` headers, root locales and 404 pages
   inlined) and `dist/server/wrangler.json` (`ASSETS` binding → `../client`). Fails above 256 MiB.
2. The Site's source repository (`~/tseng-sites-deploy/repo`) gets `.openai/hosting.json` (Worker build, no
   `static`) and `site-build.json` (source commit + pack report) on `main`.
3. `codex exec` runs `codex-sites-wo.md`: write credential → push → official packager (`COPYFILE_DISABLE=1`) →
   `save_version_and_deploy_private` for an owner-only Site, else `save_site_version` + `deploy_site_version` →
   deployment status. Access changes and custom domains are owner decisions; headless Codex cannot approve them.

The Worker: `/` → 307 to the `Accept-Language` locale (same rules as `src/lib/root-locale-negotiation.ts`);
`_redirects` rules (exact, `:name`, trailing `*`); trailing slash and `.html` URLs → 308 to the clean URL;
pages with the site's security headers and `Content-Encoding: gzip` (decoded for clients without gzip);
localized `404.html`; `www.` → apex; `X-Robots-Tag: noindex` on any host but `tseng-law.com`. Local check:
`npx -y wrangler@4.149.0 dev --config <dist>/server/wrangler.json --local` (workerd with the same assets binding).

Push to `main` publishes once the MacBook Air auto-deployer is installed (`install-air-deployer.sh`, launchd
`com.son7.tseng-static-deploy`, every 10 minutes): main in the worktree `~/Projects/tseng-law-deploy` →
`build.mjs --data=~/tseng-static-deploy/data/prod-mirror --media-origin=https://media.tseng-law.com` →
`upload-media.mjs --bucket=tseng-law-media` (the Air's wrangler login, R2 only) → `codex-sites-deploy.sh`
(the Air's Codex login) → `/build-info.json` shows the commit (an owner-only Site answers 401; then the
deployment status is the evidence). State: `~/tseng-static-deploy/state/status.json`; `air-deployer.sh --force`
redeploys main.

Limits: Sites archive ≤ 256 MiB expanded (check `headroomBytes` in the pack report), Worker isolate 128 MB
(pages stream, nothing is buffered). Images and videos (2.6 GB) stay on R2 (`media.tseng-law.com`, bucket
`tseng-law-media`, free tier); only `images/brand/` stays with the pages.
