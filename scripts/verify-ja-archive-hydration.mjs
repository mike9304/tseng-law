/** Local production regression for Japanese archive/search streamed hydration.
 * Replays unchanged HTML; never modifies React or sends requests to production.
 * JA_HYDRATION_BASE=http://127.0.0.1:3000 node scripts/verify-ja-archive-hydration.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium, firefox } from '@playwright/test';

const upstream = new URL(process.env.JA_HYDRATION_BASE || 'http://127.0.0.1:3000');
if (upstream.protocol !== 'http:' || !['localhost', '127.0.0.1', '[::1]'].includes(upstream.hostname)) {
  throw Error('Only a local HTTP production server is accepted.');
}
const out = path.resolve(process.env.JA_HYDRATION_EVIDENCE_DIR || '.omo/evidence/ja-archive-hydration');
fs.mkdirSync(out, { recursive: true });
const article = '/ja/columns/taiwan-post-employment-non-compete-compensation-japanese';
const title = '台湾で退職後の転職を制限されたら：競業避止条項と補償の確認点';
const titleQuery = new URLSearchParams({ q: title });
const documents = [], results = [], agent = new http.Agent({ keepAlive: true });
let chunkSize = 1024, delay = 16;
const proxy = http.createServer((request, response) => {
  const target = new URL(request.url, upstream);
  if (target.origin !== upstream.origin) { response.writeHead(400); response.end('Local upstream only'); return; }
  const incoming = http.request(target, {
    method: request.method, agent,
    headers: { ...request.headers, host: upstream.host, 'accept-encoding': 'identity' },
  }, (received) => {
    const headers = { ...received.headers };
    delete headers['content-length']; delete headers['transfer-encoding'];
    response.writeHead(received.statusCode, headers);
    if (!(headers['content-type'] || '').includes('text/html')) { received.pipe(response); return; }
    const chunks = [];
    received.on('data', chunk => chunks.push(chunk));
    received.on('end', async () => {
      const html = Buffer.concat(chunks), size = chunkSize, interval = delay;
      documents.push({ path: request.url, status: received.statusCode, bytes: html.length, sha256: crypto.createHash('sha256').update(html).digest('hex'), chunkSize: size, delay: interval });
      for (let offset = 0; offset < html.length && !response.destroyed; offset += size) {
        response.write(html.subarray(offset, offset + size));
        await new Promise(resolve => setTimeout(resolve, interval));
      }
      response.end();
    });
    received.on('error', () => response.destroy());
  });
  response.on('close', () => incoming.destroy());
  incoming.on('error', error => { if (!response.destroyed) { if (!response.headersSent) response.writeHead(502); response.end(String(error)); } });
  request.pipe(incoming);
});
await new Promise(resolve => proxy.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${proxy.address().port}`;
const check = (condition, message) => { if (!condition) throw Error(message); };
try {
  for (const [engine, launcher, size, interval] of [['chromium', chromium, 512, 12], ['firefox', firefox, 1024, 16]]) {
    chunkSize = size; delay = interval;
    const browser = await launcher.launch();
    try {
      for (let visit = 0; visit < 3; visit++) {
        const context = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
        await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
        const page = await context.newPage(), row = { engine, version: browser.version(), visit, errors: [], steps: [] };
        let step = 'initial';
        page.on('pageerror', error => row.errors.push({ step, url: page.url(), at: new Date().toISOString(), message: error.message }));
        const record = async () => { await page.waitForLoadState('networkidle'); row.steps.push({ step, url: page.url(), title: await page.locator('h1').innerText() }); };
        const go = async (name, route) => { step = name; const response = await page.goto(base + route, { waitUntil: 'networkidle' }); check(response.status() === 200, 'HTTP ' + name); await record(); };
        const clickArticle = async name => { step = name; await page.locator(`main a[href="${article}"]:visible`).first().click(); await page.waitForURL('**' + article); await page.locator('h1', { hasText: title }).waitFor(); await record(); };
        try {
          await go('article', article);
          await go('archive', '/ja/columns');
          await clickArticle('article-from-archive');
          step = 'back'; await page.goBack({ waitUntil: 'load' }); await page.waitForURL('**/ja/columns'); await page.locator('#ja-columns').waitFor(); await record();
          await clickArticle('article-again');
          // Playwright Firefox reload adds a history entry after pushState even on
          // plain HTML; native location.reload preserves the actual browser flow.
          step = 'reload'; await Promise.all([page.waitForEvent('load'), page.evaluate(() => location.reload())]); await record();
          step = 'back-after-reload'; await page.goBack({ waitUntil: 'load' }); await page.waitForURL('**/ja/columns'); await page.locator('#ja-columns').waitFor(); await record();
          await go('topic', '/ja/columns?topic=labor');
          check(await page.locator(`main a[href="${article}"]`).count() > 0, 'labor inclusion');
          await go('title', '/ja/columns?' + titleQuery);
          check(await page.locator(`main a[href="${article}"]`).count() > 0, 'title inclusion');
          await go('empty', '/ja/columns?q=zzzz-no-match-198199');
          check(await page.locator(`main a[href="${article}"]`).count() === 0, 'empty result');
          step = 'reset'; await page.locator('[data-columns-filter-reset]').click(); await page.waitForURL('**/ja/columns'); await page.locator(`main a[href="${article}"]:visible`).first().waitFor(); await record();
          check(await page.locator(`main a[href="${article}"]`).count() > 0, 'reset restores list');
          await go('search', '/ja/search?' + titleQuery + '&tab=blog');
          await clickArticle('article-from-search');
          check(row.errors.length === 0, 'hydration/page errors'); row.pass = true;
        } catch (error) { row.pass = false; row.failure = String(error); fs.writeFileSync(path.join(out, `${engine}-${visit}-failure.html`), await page.content()); }
        results.push(row); console.log(JSON.stringify(row)); await context.close();
      }
    } finally { await browser.close(); }
  }
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    for (const route of ['/ja/columns', '/ja/columns?' + titleQuery, '/ja/search?' + titleQuery + '&tab=blog']) {
      const row = { noJs: true, route };
      try { const response = await page.goto(base + route); check(response.status() === 200, 'noJS HTTP'); check(await page.locator(`main a[href="${article}"]:visible`).count() > 0, 'visible SSR article link'); row.pass = true; }
      catch (error) { row.pass = false; row.failure = String(error); }
      results.push(row);
    }
  } finally { await browser.close(); }
} finally {
  agent.destroy(); proxy.closeAllConnections(); await new Promise(resolve => proxy.close(resolve));
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ results, documents }, null, 2));
}
if (results.some(row => !row.pass)) process.exitCode = 1;
