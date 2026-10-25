import fs from 'node:fs';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const R = '/Users/son7/Projects/tseng-law-all-locales-20261025';
const B = '/Users/son7/tseng-all-language-columns-20261025/batch04';
const { chromium } = require(R + '/node_modules/playwright');
const matter = require(R + '/node_modules/gray-matter');
const md = require(R + '/node_modules/markdown-it')({ html: false });
const escape = (t) => String(t).replace(/[&<>"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sha = (t) => crypto.createHash('sha256').update(t).digest('hex');
let html = fs.readFileSync(B + '/checks/he-rtl-preview.html', 'utf8');
const inputs = [];
for (const file of fs.readdirSync(B + '/src/content/columns-he').filter(f => /^70[456]-/.test(f))) {
  const text = fs.readFileSync(B + '/src/content/columns-he/' + file, 'utf8');
  const m = matter(text), id = file.slice(0, 3);
  inputs.push({ file, sha256: sha(text) });
  const article = '<article id="he-' + id + '"><h1>' + escape(m.data.title) + '</h1><p class="summary">' + escape(m.data.summary) + '</p><p class="date">' + escape(m.data.date_display) + ' · ' + escape(m.data.read_time) + '</p><p>' + escape(m.data.featured_image_caption) + '</p>' + md.render(m.content) + '<section class="faq"><h2>שאלות נפוצות</h2>' + m.data.faq.map(q => '<h3>' + escape(q.q) + '</h3><p>' + escape(q.a) + '</p>').join('') + '</section></article>';
  const start = html.indexOf('<article id="he-' + id + '">');
  const end = html.indexOf('</article>', start) + '</article>'.length;
  if (start < 0 || end < start) throw new Error('Missing preview article ' + id);
  html = html.slice(0, start) + article + html.slice(end);
}
fs.writeFileSync(B + '/checks/he-rtl-preview.html', html);
const executablePath = '/Users/son7/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const browser = await chromium.launch({ headless: true, executablePath });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 }, deviceScaleFactor: 1 });
  await page.route(/^https?:/, route => route.abort());
  await page.goto('file://' + B + '/checks/he-rtl-preview.html');
  const results = [];
  for (const [kind, viewport] of [['desktop', { width: 1200, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
    await page.setViewportSize(viewport);
    for (const id of ['704', '705', '706']) {
      await page.evaluate(id => document.getElementById('he-' + id).scrollIntoView({ block: 'start' }), id);
      await page.screenshot({ path: B + '/checks/he-rtl-' + id + '-' + kind + '.png' });
      results.push(await page.evaluate(({ id, kind }) => ({ article: id, kind, dir: document.documentElement.dir, lang: document.documentElement.lang, viewportWidth: innerWidth, scrollWidth: document.documentElement.scrollWidth, heading: document.getElementById('he-' + id).querySelector('h1').innerText }), { id, kind }));
    }
  }
  await page.locator('#he-706 table').scrollIntoViewIfNeeded();
  await page.screenshot({ path: B + '/checks/he-rtl-706-table-mobile.png' });
  await page.locator('#he-705 .faq').scrollIntoViewIfNeeded();
  await page.screenshot({ path: B + '/checks/he-rtl-705-faq-mobile.png' });
  const report = { at: new Date().toISOString(), scope: 'isolated Markdown RTL preview; not the rendered release site', network: 'HTTP(S) requests aborted', profile: 'new temporary profile; no user profile access', inputs, executablePath, results };
  fs.writeFileSync(B + '/checks/he-rtl-render.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
