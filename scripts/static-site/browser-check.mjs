#!/usr/bin/env node
// Loads every page of out/ in Chromium (served like the static host) and records what would break
// without a server: requests to /api, same-origin responses >= 400, console errors, page errors.
//
//   node scripts/static-site/browser-check.mjs [--out=out] [--sample=<n>] [--concurrency=6]
//                                              [--report=static-site-browser.json]
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startStaticServer } from './serve-out.mjs';
import { REPO_ROOT, walkFiles } from './shared.mjs';

function parseArgs(argv) {
  const args = { out: 'out', sample: Infinity, concurrency: 6, report: 'static-site-browser.json', port: 4620 };
  for (const arg of argv) {
    const [key, value] = arg.replace(/^--/, '').split('=');
    if (key === 'sample' || key === 'concurrency' || key === 'port') args[key] = Number(value);
    else if (key in args) args[key] = value;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function pagePaths(outDir) {
  return walkFiles(outDir)
    .filter((file) => file.endsWith('.html') && !file.endsWith('404.html'))
    .map((file) => `/${path.relative(outDir, file).replace(/\.html$/, '')}`.replace(/^\/index$/, '/'))
    .filter((p) => {
      const html = fs.readFileSync(path.join(outDir, p === '/' ? 'index.html' : `${p.slice(1)}.html`), 'utf8');
      return !html.includes('http-equiv="refresh"'); // redirect stubs
    })
    .sort();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = path.resolve(REPO_ROOT, args.out);
  const server = await startStaticServer({ root: outDir, port: args.port });
  const base = `http://127.0.0.1:${args.port}`;
  const mediaFile = path.join(REPO_ROOT, 'static-site-media.json');
  const mediaOrigin = fs.existsSync(mediaFile) ? JSON.parse(fs.readFileSync(mediaFile, 'utf8')).mediaOrigin : null;
  let paths = pagePaths(outDir);
  if (Number.isFinite(args.sample)) {
    const step = Math.max(1, Math.floor(paths.length / args.sample));
    paths = paths.filter((_, i) => i % step === 0).slice(0, args.sample);
  }
  // Playwright's own Chromium build may not be installed; fall back to the system Chrome.
  const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }));
  const issues = { api: {}, failed: {}, console: {}, pageErrors: {} };
  const add = (bucket, key, page) => {
    const list = (issues[bucket][key] ??= []);
    if (list.length < 5) list.push(page);
  };
  let index = 0;
  let done = 0;
  const worker = async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    while (index < paths.length) {
      const pagePath = paths[index++];
      const page = await context.newPage();
      page.on('request', (request) => {
        const url = new URL(request.url());
        if (url.origin === base && url.pathname.startsWith('/api/')) add('api', url.pathname, pagePath);
      });
      page.on('response', (response) => {
        const url = new URL(response.url());
        if ((url.origin === base || url.origin === mediaOrigin) && response.status() >= 400) {
          add('failed', `${response.status()} ${url.origin === base ? '' : url.origin}${url.pathname}`, pagePath);
        }
      });
      page.on('console', (message) => {
        if (message.type() === 'error') add('console', message.text().slice(0, 200), pagePath);
      });
      page.on('pageerror', (error) => add('pageErrors', String(error.message).slice(0, 200), pagePath));
      try {
        await page.goto(`${base}${pagePath}`, { waitUntil: 'load', timeout: 60_000 });
        await page.evaluate(async () => {
          for (let y = 0; y <= 4; y += 1) {
            window.scrollTo(0, (document.body.scrollHeight * y) / 4);
            await new Promise((r) => setTimeout(r, 250));
          }
        });
        await page.waitForTimeout(800);
      } catch (error) {
        add('pageErrors', `navigation: ${String(error.message).slice(0, 120)}`, pagePath);
      }
      await page.close();
      done += 1;
      if (done % 200 === 0) console.log(`[browser-check] ${done}/${paths.length}`);
    }
    await context.close();
  };
  await Promise.all(Array.from({ length: args.concurrency }, worker));
  await browser.close();
  server.close();
  const counts = Object.fromEntries(Object.entries(issues).map(([k, v]) => [k, Object.keys(v).length]));
  fs.writeFileSync(path.join(REPO_ROOT, args.report), `${JSON.stringify({ generatedAt: new Date().toISOString(), pages: paths.length, counts, issues }, null, 2)}\n`);
  console.log(`[browser-check] ${paths.length} pages`, counts);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
