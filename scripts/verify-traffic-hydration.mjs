/** Run against a local production server. Replays complete, unchanged HTML in
 * small chunks to expose hydration that races streamed server-component data.
 * No production traffic, React patching, suppressed errors, or client-only view.
 * TRAFFIC_HYDRATION_BASE=http://127.0.0.1:3000 node scripts/verify-traffic-hydration.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../package.json', import.meta.url));
const { chromium, firefox } = require('@playwright/test');
const upstream = new URL(process.env.TRAFFIC_HYDRATION_BASE || 'http://127.0.0.1:3000');
if (upstream.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(upstream.hostname)) {
  throw new Error('This streaming regression test only accepts a local HTTP server.');
}
const out = path.resolve(process.env.TRAFFIC_HYDRATION_EVIDENCE_DIR || '.omo/evidence/traffic-hydration');
const phase = process.env.TRAFFIC_HYDRATION_PHASE || 'local';
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
try {
  for (const [engine, launcher] of [['chromium', chromium], ['firefox', firefox]]) {
    const browser = await launcher.launch({ headless: true });
    try {
      for (const width of [1440, 390]) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        const row = { engine, width, errors: [], visits: [] };
        let step = 'initial';
        page.on('pageerror', (error) => row.errors.push({ step, url: page.url(), message: error.message }));
        const record = async () => {
          await page.waitForLoadState('networkidle');
          row.visits.push({ step, url: page.url(), rows: await page.locator('[data-traffic-board-row]').count() });
        };
        try {
          const initial = await page.goto(`${base}/zh-hant/traffic-accidents`, { waitUntil: 'networkidle' });
          check(initial.status() === 200, 'initial HTTP');
          const count = await page.locator('[data-traffic-board-row]').count();
          check(count > 0, 'server-rendered list is populated');
          const schema = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => nodes.map((n) => JSON.parse(n.textContent)).find((n) => n['@type'] === 'CollectionPage'));
          check(schema?.mainEntity?.itemListElement?.length === count, 'collection structured data');
          check(await page.locator('link[rel="canonical"]').getAttribute('href') === 'https://tseng-law.com/zh-hant/traffic-accidents', 'canonical preserved');
          await record();
          step = 'reload';
          await page.reload({ waitUntil: 'networkidle' });
          await record();
          check(row.visits.at(-1).rows === count, 'reload preserves list');
          step = 'filter';
          await page.locator('[data-traffic-board] a[href*="subject=evidence"]').click();
          await page.waitForURL('**/traffic-accidents?subject=evidence#articles');
          await record();
          const filteredCount = row.visits.at(-1).rows;
          check(filteredCount > 0 && filteredCount < count, 'evidence filter');
          step = 'empty-search';
          await page.locator('#traffic-board-q').fill('zzzz-no-match');
          await page.locator('[data-traffic-board] button[type=submit]').click();
          await page.waitForURL(/q=/);
          await record();
          check(await page.locator('[data-traffic-board-empty]').count() === 1, 'empty state');
          step = 'back';
          await page.goBack({ waitUntil: 'networkidle' });
          await record();
          check(row.visits.at(-1).rows === filteredCount, 'back preserves filter');
          step = 'clear';
          await page.locator('[data-traffic-board-clear]').first().click();
          await page.waitForURL((url) => !url.search);
          await record();
          check(row.visits.at(-1).rows === count, 'clear restores list');
          check(row.errors.length === 0, 'page errors during streamed hydration');
          row.pass = true;
        } catch (error) { row.error = String(error); }
        results.push(row);
        console.log(JSON.stringify(row));
        await context.close();
      }
    } finally { await browser.close(); }
  }
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    const row = { noJs: true };
    try {
      await page.goto(`${base}/zh-hant/traffic-accidents`, { waitUntil: 'load' });
      const count = await page.locator('[data-traffic-board-row]').count();
      check(count > 0 && await page.locator('[data-traffic-board]').isVisible(), 'visible server content without JavaScript');
      const schema = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => nodes.map((n) => JSON.parse(n.textContent)).find((n) => n['@type'] === 'CollectionPage'));
      check(schema?.mainEntity?.itemListElement?.length === count, 'server structured data without JavaScript');
      await page.locator('#traffic-board-q').fill('警方');
      await Promise.all([page.waitForURL(/q=/), page.locator('[data-traffic-board] button[type=submit]').click()]);
      await page.waitForLoadState('load');
      check(await page.locator('[data-traffic-board-row]').count() > 0, 'native GET search without JavaScript');
      row.pass = true;
    } catch (error) { row.error = String(error); }
    results.push(row);
    console.log(JSON.stringify(row));
  } finally { await browser.close(); }
} finally {
  proxy.closeAllConnections();
  await new Promise((resolve) => proxy.close(resolve));
  fs.writeFileSync(path.join(out, `${phase}-hydration-results.json`), JSON.stringify({ results, documentResponses }, null, 2));
}
if (results.some((row) => !row.pass)) process.exitCode = 1;
