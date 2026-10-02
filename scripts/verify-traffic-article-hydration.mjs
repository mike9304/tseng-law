/** Run against a local production server. Replays complete, unchanged HTML in
 * small chunks to expose hydration that races streamed server-component data.
 * No production traffic, React patching, suppressed errors, or client-only view.
 * ARTICLE_HYDRATION_BASE=http://127.0.0.1:3000 node scripts/verify-traffic-article-hydration.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../package.json', import.meta.url));
const { chromium, firefox } = require('@playwright/test');
const upstream = new URL(process.env.ARTICLE_HYDRATION_BASE || 'http://127.0.0.1:3000');
if (upstream.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(upstream.hostname)) {
  throw new Error('This streaming regression test only accepts a local HTTP server.');
}
const out = path.resolve(process.env.ARTICLE_HYDRATION_EVIDENCE_DIR || '.omo/evidence/traffic-article-hydration');
const phase = process.env.ARTICLE_HYDRATION_PHASE || 'local';
fs.mkdirSync(out, { recursive: true });
const results = [];
const documentResponses = [];
const proxy = http.createServer((request, response) => {
  const incoming = http.request(new URL(request.url, upstream), {
    method: request.method,
    headers: { ...request.headers, host: upstream.host, 'accept-encoding': 'identity' },
  }, (received) => {
    const headers = { ...received.headers };
    delete headers['content-length'];
    delete headers['transfer-encoding'];
    response.writeHead(received.statusCode, headers);
    if (!(headers['content-type'] || '').includes('text/html')) {
      received.pipe(response);
      return;
    }
    const chunks = [];
    received.on('data', (chunk) => chunks.push(chunk));
    received.on('end', async () => {
      const html = Buffer.concat(chunks);
      documentResponses.push({ path: request.url, status: received.statusCode, bytes: html.length });
      for (let offset = 0; offset < html.length && !response.destroyed; offset += 2048) {
        response.write(html.subarray(offset, offset + 2048));
        await new Promise((resolve) => setTimeout(resolve, 12));
      }
      response.end();
    });
    received.on('error', () => response.destroy());
  });
  incoming.on('error', (error) => {
    if (!response.headersSent) response.writeHead(502);
    response.end(String(error));
  });
  request.pipe(incoming);
});
await new Promise((resolve) => proxy.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${proxy.address().port}`;
const check = (ok, message) => { if (!ok) throw new Error(message); };
const slugs = ['taiwan-borrowed-car-owner-driver-key-custody-liability', 'taiwan-chain-rear-end-first-impact-evidence', 'taiwan-bus-sudden-braking-passenger-carrier-liability', 'taiwan-accident-stop-dialogue-hit-and-run-evidence'];
try {
  for (const [engine, launcher] of [['chromium', chromium], ['firefox', firefox]]) {
    const browser = await launcher.launch({ headless: true });
    try {
      for (const width of [1440, 390]) for (const slug of slugs) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        const row = { engine, width, slug, errors: [], visits: [] };
        let step = 'initial';
        page.on('pageerror', (error) => row.errors.push({ step, url: page.url(), message: error.message }));
        const articleUrl = `${base}/zh-hant/columns/${slug}`;
        const record = async () => {
          await page.waitForLoadState('networkidle');
          row.visits.push({ step, url: page.url(), title: await page.locator('h1').innerText() });
        };
        try {
          const response = await page.goto(articleUrl, { waitUntil: 'networkidle' });
          check(response.status() === 200, 'article HTTP');
          await record();
          const title = row.visits[0].title;
          const body = page.locator('.blog-body');
          check(await body.isVisible() && (await body.innerText()).length > 1000, 'visible article');
          check(await page.locator('link[rel=canonical]').getAttribute('href') === `https://tseng-law.com/zh-hant/columns/${slug}`, 'canonical');
          const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(n => JSON.parse(n.textContent)).find(n => n['@type'] === 'Article'));
          check(schema.headline === title, 'Article structured data');
          check(await page.locator('[data-column-byline=ai]').count() === 1, 'AI byline');
          step = 'reload'; await Promise.all([page.waitForEvent('load'), page.evaluate(() => window.location.reload())]); await record();
          check(row.visits.at(-1).title === title, 'reload preserves title');
          step = 'hub'; await page.locator('.blog-hero a[href="/zh-hant/traffic-accidents#articles"]').click();
          await page.waitForURL('**/zh-hant/traffic-accidents#articles'); await record();
          check(await page.locator(`[data-traffic-board-row] h3 a[href="/zh-hant/columns/${slug}"]`).count() === 1, 'article in board');
          step = 'back'; await page.goBack({ waitUntil: 'networkidle' }); await record();
          check(row.visits.at(-1).title === title, 'back restores article');
          check(row.errors.length === 0, 'page errors during streamed hydration');
          row.pass = true;
        } catch (error) { row.error = String(error); }
        results.push(row); console.log(JSON.stringify(row)); await context.close();
      }
    } finally { await browser.close(); }
  }
  const browser = await chromium.launch({ headless: true });
  try {
    for (const slug of slugs) {
      const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
      const page = await context.newPage(); const row = { noJs: true, slug };
      try {
        const response = await page.goto(`${base}/zh-hant/columns/${slug}`, { waitUntil: 'load' });
        check(response.status() === 200, 'noJS HTTP');
        check(await page.locator('.blog-body').isVisible() && (await page.locator('.blog-body').innerText()).length > 1000, 'visible server article without JavaScript');
        check(await page.locator('script[type="application/ld+json"]').count() >= 2, 'server structured data');
        if (slug === 'taiwan-borrowed-car-owner-driver-key-custody-liability') {
          check(await page.locator('.blog-body table tbody tr').count() === 4, 'four server-rendered responsibility roles');
          check(await page.locator('video, [data-traffic-diagram]').count() === 0, 'no unapproved media');
        } else {
          check(await page.locator('[data-traffic-diagram] img').first().isVisible(), 'server poster');
          await page.locator('[data-traffic-diagram] summary').click();
          check(await page.locator('[data-traffic-diagram] details').getAttribute('open') !== null, 'native stages without JavaScript');
          if (slug === 'taiwan-accident-stop-dialogue-hit-and-run-evidence') {
            check(await page.locator('[data-traffic-diagram-description]').isVisible(), 'static timeline full text without JavaScript');
            check(await page.locator('[data-traffic-diagram] video').count() === 0, 'no empty video player');
          } else check(await page.locator('[data-traffic-diagram-stages] img').count() === 4, 'four server stages');
        }
        row.pass = true;
      } catch (error) { row.error = String(error); }
      results.push(row); console.log(JSON.stringify(row)); await context.close();
    }
  } finally { await browser.close(); }
} finally {
  proxy.closeAllConnections(); await new Promise(resolve => proxy.close(resolve));
  fs.writeFileSync(path.join(out, `${phase}-article-hydration-results.json`), JSON.stringify({ results, documentResponses }, null, 2));
}
if (results.some(row => !row.pass)) process.exitCode = 1;
