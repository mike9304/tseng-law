import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
// @ts-expect-error -- plain ESM build scripts without type declarations
import { handleRequest, matchRedirect, negotiateRootLocale, pageKeyFor } from '../../../scripts/static-site/sites-worker.js';
// @ts-expect-error -- plain ESM build scripts without type declarations
import { packSite, parseRedirects, parseSiteHeaders, workerSource } from '../../../scripts/static-site/sites-pack.mjs';

const LOCALES = ['en', 'fil', 'fr', 'ja', 'ko', 'nb', 'vi', 'zh-hans', 'zh-hant'];

const config = {
  canonicalHost: 'tseng-law.com',
  rootLocales: LOCALES,
  rootFallback: 'ko',
  notFoundLocales: ['en', 'ko'],
  redirects: parseRedirects(
    ['/zh /zh-hant 308', '/old-page /ko/about 301', '/zh/* /zh-hant/:splat 308', '/ko/insights/:slug /ko/columns/:slug 308'].join('\n'),
  ),
  pageHeaders: [['X-Frame-Options', 'SAMEORIGIN']],
};

/** In-memory ASSETS binding: path → gzip bytes, like the packed dist/client/__p tree. */
function assets(files: Record<string, string>) {
  return {
    fetch: async (request: Request) => {
      const key = decodeURIComponent(new URL(request.url).pathname);
      const html = files[key];
      if (html === undefined) return new Response('nope', { status: 404 });
      const { gzipSync } = await import('node:zlib');
      return new Response(gzipSync(Buffer.from(html)), { headers: { ETag: '"x"' } });
    },
  };
}

const env = {
  ASSETS: assets({
    '/__p/ko.html.gz': '<html>ko</html>',
    '/__p/ko/about.html.gz': '<html>about</html>',
    '/__p/ko/404.html.gz': '<html>ko 404</html>',
    '/__p/404.html.gz': '<html>404</html>',
    '/__p/naver123.html.gz': 'naver-site-verification',
  }),
};

const get = (url: string, headers: Record<string, string> = {}) =>
  handleRequest(new Request(url, { headers }), env, config);

describe('Codex Sites worker', () => {
  it('negotiates the root locale like src/lib/root-locale-negotiation.ts', () => {
    expect(negotiateRootLocale(null, LOCALES, 'ko')).toBe('ko');
    expect(negotiateRootLocale('vi-VN,vi;q=0.9,en;q=0.8', LOCALES, 'ko')).toBe('vi');
    expect(negotiateRootLocale('zh-TW', LOCALES, 'ko')).toBe('zh-hant');
    expect(negotiateRootLocale('zh-CN', LOCALES, 'ko')).toBe('zh-hans');
    expect(negotiateRootLocale('tl-PH', LOCALES, 'ko')).toBe('fil');
    expect(negotiateRootLocale('no;q=0.5, xx', LOCALES, 'ko')).toBe('nb');
    expect(negotiateRootLocale('de-DE,de;q=0.9', LOCALES, 'ko')).toBe('ko');
    expect(negotiateRootLocale('en;q=0, fr', LOCALES, 'ko')).toBe('fr');
  });

  it('matches exact, placeholder and splat redirect rules', () => {
    expect(matchRedirect('/zh', config.redirects)).toEqual({ to: '/zh-hant', status: 308 });
    expect(matchRedirect('/zh/columns/a', config.redirects)).toEqual({ to: '/zh-hant/columns/a', status: 308 });
    expect(matchRedirect('/ko/insights/x-y', config.redirects)).toEqual({ to: '/ko/columns/x-y', status: 308 });
    expect(matchRedirect('/ko/insights/x/y', config.redirects)).toBeNull();
    expect(matchRedirect('/ko/insights', config.redirects)).toBeNull();
    expect(matchRedirect('/ko/about', config.redirects)).toBeNull();
  });

  it('maps request paths to stored pages', () => {
    expect(pageKeyFor('/')).toBe('/index.html');
    expect(pageKeyFor('/ko/about')).toBe('/ko/about.html');
    expect(pageKeyFor('/naver123.html')).toBe('/naver123.html');
  });

  it('sends `/` to the negotiated locale without caching', async () => {
    const res = await get('https://tseng-law.com/?a=1', { 'Accept-Language': 'vi' });
    expect(res.status).toBe(307);
    expect(res.headers.get('Location')).toBe('/vi?a=1');
    expect(res.headers.get('Vary')).toBe('Accept-Language');
  });

  it('serves stored pages gzip-encoded with site headers, and decodes for clients without gzip', async () => {
    const res = await get('https://tseng-law.com/ko', { 'Accept-Encoding': 'gzip, br' });
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Encoding')).toBe('gzip');
    expect(res.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
    expect(res.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
    expect(res.headers.get('X-Robots-Tag')).toBeNull();
    expect(gunzipSync(Buffer.from(await res.arrayBuffer())).toString()).toBe('<html>ko</html>');

    const plain = await get('https://tseng-law.com/ko/about');
    expect(plain.headers.get('Content-Encoding')).toBeNull();
    expect(await plain.text()).toBe('<html>about</html>');
  });

  it('keeps preview hosts out of search engines and sends www to the apex', async () => {
    expect((await get('https://tseng-law.example.chatgpt.site/ko')).headers.get('X-Robots-Tag')).toBe('noindex');
    const www = await get('https://www.tseng-law.com/ko/about?x=1');
    expect(www.status).toBe(308);
    expect(www.headers.get('Location')).toBe('https://tseng-law.com/ko/about?x=1');
  });

  it('redirects trailing slashes, rules and .html URLs; keeps root verification files', async () => {
    expect((await get('https://tseng-law.com/ko/about/')).headers.get('Location')).toBe('/ko/about');
    const rule = await get('https://tseng-law.com/old-page?utm=1');
    expect([rule.status, rule.headers.get('Location')]).toEqual([301, '/ko/about?utm=1']);
    expect((await get('https://tseng-law.com/ko/about.html')).headers.get('Location')).toBe('/ko/about');
    expect((await get('https://tseng-law.com/ko.html')).headers.get('Location')).toBe('/ko');
    const verification = await get('https://tseng-law.com/naver123.html');
    expect([verification.status, await verification.text()]).toEqual([200, 'naver-site-verification']);
  });

  it('answers unknown paths with the localized 404 page and hides the page store', async () => {
    const ko = await get('https://tseng-law.com/ko/missing');
    expect([ko.status, await ko.text()]).toEqual([404, '<html>ko 404</html>']);
    const other = await get('https://tseng-law.com/fr/missing');
    expect([other.status, await other.text()]).toEqual([404, '<html>404</html>']);
    expect((await get('https://tseng-law.com/__p/ko.html.gz')).status).toBe(404);
    expect((await handleRequest(new Request('https://tseng-law.com/ko', { method: 'POST' }), env, config)).status).toBe(405);
  });
});

describe('sites-pack.mjs', () => {
  it('reads the site-wide header block only', () => {
    const text = '/*\n  X-Frame-Options: SAMEORIGIN\n  Content-Security-Policy: a; b: c\n/fonts/*\n  Cache-Control: immutable\n';
    expect(parseSiteHeaders(text)).toEqual([['X-Frame-Options', 'SAMEORIGIN'], ['Content-Security-Policy', 'a; b: c']]);
  });

  it('rejects redirect lines it cannot serve', () => {
    expect(() => parseRedirects('/a /b 200')).toThrow(/Unsupported/);
  });

  it('inlines the config and leaves the Worker with a default export only', () => {
    const source = workerSource(config);
    expect(source).toContain('"canonicalHost":"tseng-law.com"');
    expect(source.match(/^export /gm)).toEqual(['export ']);
    expect(source).toMatch(/^export default worker;$/m);
  });

  it('packs a static build into gzip pages and plain assets', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sites-pack-'));
    const out = path.join(root, 'out');
    fs.mkdirSync(path.join(out, 'ko'), { recursive: true });
    fs.writeFileSync(path.join(out, '.static-site-out'), '');
    fs.writeFileSync(path.join(out, 'index.html'), '<script>(function(){var L=["en","ko"],A={}})()</script>');
    fs.writeFileSync(path.join(out, 'ko.html'), '<html>ko</html>');
    fs.writeFileSync(path.join(out, 'ko', '404.html'), '<html>404</html>');
    fs.writeFileSync(path.join(out, 'robots.txt'), 'User-agent: *');
    fs.writeFileSync(path.join(out, '_redirects'), '/zh /zh-hant 308\n');
    fs.writeFileSync(path.join(out, '_headers'), '/*\n  X-Frame-Options: SAMEORIGIN\n');
    const dist = path.join(root, 'dist');
    const report = packSite({ outDir: out, distDir: dist });
    expect(report).toMatchObject({ pages: 3, assets: 1, redirects: 1, rootLocales: 2, notFoundLocales: ['ko'] });
    expect(gunzipSync(fs.readFileSync(path.join(dist, 'client', '__p', 'ko.html.gz'))).toString()).toBe('<html>ko</html>');
    expect(fs.readFileSync(path.join(dist, 'client', 'robots.txt'), 'utf8')).toBe('User-agent: *');
    expect(fs.existsSync(path.join(dist, 'client', '_redirects'))).toBe(false);
    expect(JSON.parse(fs.readFileSync(path.join(dist, 'server', 'wrangler.json'), 'utf8')).assets.binding).toBe('ASSETS');
    // A second run may replace its own output, never someone else's directory.
    expect(() => packSite({ outDir: out, distDir: dist })).not.toThrow();
    fs.writeFileSync(path.join(root, 'foreign.txt'), 'x');
    expect(() => packSite({ outDir: out, distDir: root })).toThrow(/refusing/);
    fs.rmSync(root, { recursive: true, force: true });
  });
});
