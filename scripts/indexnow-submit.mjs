#!/usr/bin/env node
/**
 * indexnow-submit.mjs — submit URLs to the IndexNow API (https://www.indexnow.org)
 * so participating search engines (Bing, Naver, Seznam, ...) pick them up immediately
 * instead of waiting for organic crawl discovery.
 *
 * Key/host constants below are duplicated from src/lib/indexnow.ts (plain Node scripts
 * here cannot import TypeScript) — keep these two in sync with src/lib/indexnow.ts.
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs                   # default: pull URLs from
 *                                                        # https://tseng-law.com/sitemap.xml
 *   node scripts/indexnow-submit.mjs --sitemap <URL>    # use a different sitemap
 *   node scripts/indexnow-submit.mjs --urls a,b,c       # submit an explicit URL list
 *   node scripts/indexnow-submit.mjs --dry-run          # print the payload (count + first
 *                                                        # 5 URLs) instead of POSTing
 *
 * Uses the built-in fetch only — no new dependencies.
 */

// Keep in sync with src/lib/indexnow.ts
const INDEXNOW_KEY = 'b6b378b89ef6a56fd063802f06c5a49f0993df505b9311d152be338e20b22544';
const INDEXNOW_HOST = 'tseng-law.com';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

const DEFAULT_SITEMAP = 'https://tseng-law.com/sitemap.xml';

function parseArgs(argv) {
  const args = { sitemap: null, urls: null, dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--sitemap') {
      args.sitemap = argv[i + 1];
      i += 1;
    } else if (arg === '--urls') {
      args.urls = argv[i + 1];
      i += 1;
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    }
  }
  return args;
}

async function fetchSitemapUrls(sitemapUrl) {
  const res = await fetch(sitemapUrl);
  if (!res.ok) {
    throw new Error(`sitemap fetch failed: HTTP ${res.status} ${sitemapUrl}`);
  }
  const xml = await res.text();
  const matches = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)];
  return matches.map((m) => m[1]).filter(Boolean);
}

async function submitIndexNow(urlList) {
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });
  const bodyText = res.ok ? '' : await res.text().catch(() => '');
  return { status: res.status, ok: res.ok, bodyText };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  let urls;
  if (args.urls) {
    urls = args.urls
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean);
    console.log(`[indexnow-submit] using ${urls.length} URL(s) from --urls`);
  } else {
    const sitemapUrl = args.sitemap || DEFAULT_SITEMAP;
    console.log(`[indexnow-submit] fetching sitemap: ${sitemapUrl}`);
    urls = await fetchSitemapUrls(sitemapUrl);
    console.log(`[indexnow-submit] extracted ${urls.length} URL(s) from sitemap`);
  }

  const urlList = urls.slice(0, 10000);

  if (args.dryRun) {
    console.log(`[indexnow-submit] --dry-run: would submit ${urlList.length} URL(s)`);
    console.log('[indexnow-submit] first 5 URLs:');
    for (const u of urlList.slice(0, 5)) console.log(`  - ${u}`);
    return;
  }

  if (urlList.length === 0) {
    console.log('[indexnow-submit] no URLs to submit, skipping POST');
    return;
  }

  console.log(`[indexnow-submit] submitting ${urlList.length} URL(s) to ${INDEXNOW_ENDPOINT}`);
  const result = await submitIndexNow(urlList);
  console.log(`[indexnow-submit] HTTP ${result.status}`);
  if (!result.ok) {
    console.error(`[indexnow-submit] submission failed, response body:`);
    console.error(result.bodyText);
    process.exitCode = 1;
  } else {
    console.log('[indexnow-submit] submission ok');
  }
}

main().catch((err) => {
  console.error('[indexnow-submit] fatal error:', err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
