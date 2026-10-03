/** Run against a local production server. Replays complete, unchanged HTML in
 * small chunks to expose hydration that races streamed server-component data.
 * No production traffic, React patching, suppressed errors, or client-only view.
 * COLUMN_HYDRATION_BASE=http://127.0.0.1:3000 node scripts/verify-column-hydration.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../package.json', import.meta.url));
const { chromium, firefox } = require('@playwright/test');
const upstream = new URL(process.env.COLUMN_HYDRATION_BASE || 'http://127.0.0.1:3000');
if (upstream.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(upstream.hostname)) {
  throw new Error('This streaming regression test only accepts a local HTTP server.');
}
const out = path.resolve(process.env.COLUMN_HYDRATION_EVIDENCE_DIR || '.omo/evidence/column-hydration');
const phase = process.env.COLUMN_HYDRATION_PHASE || 'local';
fs.mkdirSync(out, { recursive: true });
const results = [];
const documentResponses = [];
const upstreamAgent = new http.Agent({ keepAlive: true });
const proxy = http.createServer((request, response) => {
  const incoming = http.request(new URL(request.url, upstream), {
    method: request.method,
    agent: upstreamAgent,
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
  response.on('close', () => incoming.destroy());
  incoming.on('error', (error) => {
    if (response.destroyed) return;
    if (!response.headersSent) response.writeHead(502);
    response.end(String(error));
  });
  request.pipe(incoming);
});
await new Promise((resolve) => proxy.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${proxy.address().port}`;
const check = (ok, message) => { if (!ok) throw new Error(message); };
try {
 const browser=await firefox.launch();
 try { for(const [locale,slug] of [['en','taiwan-bank-inheritance-us-power-of-attorney'],['ko','taiwan-distributor-trademark-registration-korean-brand'],['en','taiwan-estate-tax-foreign-decedent']])for(let i=0;i<3;i++){
  const context=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'});const p=await context.newPage();const row={locale,slug,visit:i,errors:[]};
  p.on('pageerror',e=>row.errors.push(e.message));
  await p.goto(base+'/'+locale+'/columns/'+slug,{waitUntil:'networkidle'});row.title=await p.locator('h1').innerText();row.pass=row.errors.length===0;results.push(row);console.log(JSON.stringify(row));await context.close();
 }}finally{await browser.close()}
}finally{upstreamAgent.destroy();proxy.closeAllConnections();await new Promise(resolve=>proxy.close(resolve));fs.writeFileSync(path.join(out,phase+'-article-stream-results.json'),JSON.stringify({results,documentResponses},null,2));}

if (results.some(row => !row.pass)) process.exitCode = 1;
