import { describe, expect, it, vi } from 'vitest';
// @ts-expect-error -- plain ESM build scripts without type declarations
import { toHostDestination, toHostPattern } from '../../../scripts/static-site/assemble.mjs';
// @ts-expect-error -- plain ESM build scripts without type declarations
import { extractLocalRefs, isServerOnlyPath, pageFileFor } from '../../../scripts/static-site/shared.mjs';
// @ts-expect-error -- plain ESM build scripts without type declarations
import { parseRedirects } from '../../../scripts/static-site/sites-pack.mjs';
// @ts-expect-error -- plain ESM build scripts without type declarations
import { matchRedirect } from '../../../scripts/static-site/sites-worker.js';

type RedirectRule = { source: string; destination: string; permanent?: boolean; has?: unknown; missing?: unknown };

async function nextConfigRedirects(staticSite: boolean): Promise<RedirectRule[]> {
  vi.stubEnv('NEXT_PUBLIC_STATIC_SITE', staticSite ? '1' : '');
  vi.resetModules();
  try {
    const configUrl = new URL('../../../next.config.mjs', import.meta.url).href;
    const { default: config } = (await import(configUrl)) as {
      default: { redirects(): Promise<RedirectRule[]> };
    };
    return await config.redirects();
  } finally {
    vi.unstubAllEnvs();
  }
}

describe('static-site build scripts', () => {
  it('maps page paths to extension files served at the clean URL', () => {
    expect(pageFileFor('/')).toBe('index.html');
    expect(pageFileFor('/ko')).toBe('ko.html');
    expect(pageFileFor('/ko/columns/a-b/')).toBe('ko/columns/a-b.html');
  });

  it('never crawls server-only paths', () => {
    for (const p of ['/api/search', '/ko/admin-builder', '/ko/login', '/en/account/premium', '/ko/bookings/manage/x', '/review/x']) {
      expect(isServerOnlyPath(p)).toBe(true);
    }
    for (const p of ['/ko', '/ko/columns/login-guide', '/ko/about', '/_next/static/chunks/a.js', '/zh-hant/store-front-law']) {
      expect(isServerOnlyPath(p)).toBe(false);
    }
  });

  it('extracts same-site refs and ignores meta text and other origins', () => {
    const html = '<a href="/ko/about">a</a><img srcSet="/images/a.webp 1x, https://tseng-law.com/images/b.webp 2x">'
      + '<meta name="description" content="법무법인 호정/소개"><meta property="og:image" content="https://tseng-law.com/og.png">'
      + '<a href="https://maps.google.com/x">m</a><a href="mailto:a@b.c">e</a><div style="background:url(\'/images/c.jpg\')"></div>';
    expect([...extractLocalRefs(html, 'http://127.0.0.1:4610/ko', 'http://127.0.0.1:4610')].sort())
      .toEqual(['/images/a.webp', '/images/b.webp', '/images/c.jpg', '/ko/about', '/og.png']);
  });

  it('converts Next redirect patterns to host _redirects patterns', () => {
    expect(toHostPattern('/zh/:path*')).toBe('/zh/*');
    expect(toHostDestination('/zh-hant/:path*')).toBe('/zh-hant/:splat');
    expect(toHostPattern('/ko/insights/:slug')).toBe('/ko/insights/:slug');
  });

  it('sends the static site AI intake URLs to contact, and leaves the server build alone', async () => {
    const rules = await nextConfigRedirects(true);
    // Same steps as assemble.mjs → _redirects → sites-pack.mjs → the Worker.
    const redirectsFile = rules
      .filter((rule) => !rule.has && !rule.missing)
      .map((rule) => `${toHostPattern(rule.source)} ${toHostDestination(rule.destination)} ${rule.permanent ? 308 : 307}`)
      .join('\n');
    const redirects = parseRedirects(redirectsFile);
    for (const locale of ['ko', 'zh-hant', 'en', 'ja', 'vi']) {
      expect(matchRedirect(`/${locale}/ai-intake`, redirects)).toEqual({ to: `/${locale}/contact`, status: 308 });
    }
    expect(matchRedirect('/ko/ai-intake/x', redirects)).toBeNull();
    expect(matchRedirect('/ko/contact', redirects)).toBeNull();

    const serverRules = await nextConfigRedirects(false);
    expect(serverRules.some((rule) => rule.source.endsWith('/ai-intake'))).toBe(false);
  });
});

describe('static-site media origin rewrite', () => {
  it('moves quoted video paths and absolute site video URLs, not page routes', async () => {
    // @ts-expect-error -- plain ESM build scripts without type declarations
    const { rewriteMediaRefs } = await import('../../../scripts/static-site/assemble.mjs');
    const origin = 'https://media.tseng-law.com';
    const input = '<video src="/videos/a.mp4"></video><a href="/ko/videos">v</a>{\\"src\\":\\"/videos/columns/b.mp4\\"}'
      + ' url(/videos/c.webm) "https://tseng-law.com/videos/d.mp4" "/ko/videos/"';
    expect(rewriteMediaRefs(input, origin)).toBe(
      `<video src="${origin}/videos/a.mp4"></video><a href="/ko/videos">v</a>{\\"src\\":\\"${origin}/videos/columns/b.mp4\\"}`
        + ` url(${origin}/videos/c.webm) "${origin}/videos/d.mp4" "/ko/videos/"`,
    );
  });

  it('moves images too but keeps brand assets on the site', async () => {
    // @ts-expect-error -- plain ESM build scripts without type declarations
    const { rewriteMediaRefs } = await import('../../../scripts/static-site/assemble.mjs');
    const origin = 'https://media.tseng-law.com';
    expect(rewriteMediaRefs('<img src="/images/team/a.webp"><link href="/images/brand/favicon.png">'
      + '<meta content="https://tseng-law.com/images/og.png"><a href="/ko/images-guide">x</a>', origin)).toBe(
      `<img src="${origin}/images/team/a.webp"><link href="/images/brand/favicon.png">`
        + `<meta content="${origin}/images/og.png"><a href="/ko/images-guide">x</a>`,
    );
    expect(rewriteMediaRefs('srcSet="/images/a-960.webp 960w, /images/a.webp 1920w"', origin))
      .toBe(`srcSet="${origin}/images/a-960.webp 960w, ${origin}/images/a.webp 1920w"`);
  });
});

describe('static-site RSC payload rewrite', () => {
  it('recomputes text-row byte lengths after rewriting inside them', async () => {
    // @ts-expect-error -- plain ESM build scripts without type declarations
    const { findFlightLengthErrors, rewriteHtmlDocument } = await import('../../../scripts/static-site/shared.mjs');
    const text = '<p>화면 <img src="/images/a.webp"></p>';
    const stream = `0:["$","div",null,{}]\n5:T${Buffer.byteLength(text, 'utf8').toString(16)},${text}6:["$","p",null,{}]\n`;
    const half = Math.floor(stream.length / 2);
    const html = `<html><body><img src="/images/a.webp"><script>self.__next_f.push([1,${JSON.stringify(stream.slice(0, half))}])</script>`
      + `<script>self.__next_f.push([1,${JSON.stringify(stream.slice(half))}])</script></body></html>`;
    expect(findFlightLengthErrors(html)).toEqual([]);
    const rewrite = (part: string) => part.replace(/(["'`(])\/images\//g, '$1https://media.tseng-law.com/images/');
    const naive = rewrite(html);
    expect(findFlightLengthErrors(naive).length).toBe(1);
    const fixed = rewriteHtmlDocument(html, rewrite);
    expect(findFlightLengthErrors(fixed)).toEqual([]);
    expect(fixed).toContain('<img src="https://media.tseng-law.com/images/a.webp">');
    expect(fixed.match(/self\.__next_f\.push/g)?.length).toBe(1);
  });
});
