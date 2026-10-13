import { describe, expect, it } from 'vitest';
// @ts-expect-error -- plain ESM build scripts without type declarations
import { toHostDestination, toHostPattern } from '../../../scripts/static-site/assemble.mjs';
// @ts-expect-error -- plain ESM build scripts without type declarations
import { extractLocalRefs, isServerOnlyPath, pageFileFor } from '../../../scripts/static-site/shared.mjs';

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
});
