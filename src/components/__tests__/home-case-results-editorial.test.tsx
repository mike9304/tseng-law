import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomeCaseResultsSplit, {
  HOME_RESULTS_EDITORIAL_IMAGE_HEIGHT,
  HOME_RESULTS_EDITORIAL_IMAGE_SRC,
  HOME_RESULTS_EDITORIAL_IMAGE_WIDTH,
} from '../HomeCaseResultsSplit';

describe('HomeCaseResultsSplit editorial plate', () => {
  it('keeps results copy and mounts the Miora wide asset as a left decorative plate', () => {
    const html = renderToStaticMarkup(<HomeCaseResultsSplit locale="ko" />);

    expect(html).toContain('id="results"');
    expect(html).toContain('home-results-panel--editorial');
    expect(html).toContain('split--img-left');
    // next/image encodes the path inside /_next/image?url=...
    expect(html).toContain(encodeURIComponent(HOME_RESULTS_EDITORIAL_IMAGE_SRC));
    expect(html).toMatch(/cross-strait-results\.webp/);
    expect(html).toContain('alt=""');
    expect(html).toContain('loading="lazy"');
    expect(html).not.toMatch(/\spriority(?:=|\s|>)/i);
    expect(html).toContain('sizes="(max-width: 900px) 100vw, 52vw"');
    expect(html).toContain('사례 분석');
    expect(html).toContain('1심 157만 TWD 판결·항소심 화해');
    expect(html).toContain('항소심에서 당사자 간 화해로 종결');
    expect(html).toContain(
      '사건 결과는 구체적인 사실관계와 증거에 따라 달라질 수 있으며, 이 사례는 과거 한 사건의 진행 경과를 소개합니다.',
    );
    expect(html).toContain('/ko/columns');
    expect(html).not.toContain('승소');
    expect(html).toContain('data-builder-node-key="media"');
    expect(html).toContain('data-builder-node-key="copy"');
    // Text must not be an overlay child of the image plate.
    expect(html).toMatch(
      /home-results-media[\s\S]*?<\/div><div class="split-content home-results-content"/,
    );
  });

  it('ships a sized WebP asset under public/images/editorial/', () => {
    const assetPath = path.join(
      process.cwd(),
      'public',
      'images',
      'editorial',
      'cross-strait-results.webp',
    );
    expect(existsSync(assetPath)).toBe(true);
    const bytes = statSync(assetPath).size;
    // Reasonable web payload: well under original PNG (~2.2MB), not empty.
    expect(bytes).toBeGreaterThan(20_000);
    expect(bytes).toBeLessThan(400_000);
    expect(HOME_RESULTS_EDITORIAL_IMAGE_SRC).toBe(
      '/images/editorial/cross-strait-results.webp',
    );
    expect(HOME_RESULTS_EDITORIAL_IMAGE_WIDTH).toBe(2048);
    expect(HOME_RESULTS_EDITORIAL_IMAGE_HEIGHT).toBe(880);
  });

  it('keeps the editorial plate flush: zero section padding + media-img fill, no hover zoom', () => {
    const globals = readFileSync(
      path.join(process.cwd(), 'src/app/globals.css'),
      'utf8',
    );

    // Higher specificity than later `.section { padding: clamp(...) }` so the
    // plate is flush (Codex gate: navy bands from 108px vertical padding).
    expect(globals).toContain('section.home-results-panel--editorial');
    const flushPadding = globals.match(
      /section\.home-results-panel--editorial\s*\{[^}]*\}/,
    )?.[0];
    expect(flushPadding).toBeTruthy();
    expect(flushPadding).toMatch(/padding:\s*0\s*;/);

    // Global img height:auto must not letterbox the fixed media plate.
    expect(globals).toMatch(
      /\.home-results-panel--editorial\s+\.home-results-media-img\s*\{[\s\S]*?height:\s*100%\s*!important\s*;[\s\S]*?object-fit:\s*cover\s*;/,
    );
    expect(globals).toMatch(
      /\.home-results-panel--editorial\s+\.home-results-media-img\s*\{[\s\S]*?width:\s*100%\s*;/,
    );

    // No hover zoom on the editorial plate.
    const noHoverZoom = globals.match(
      /\.home-results-panel--editorial:hover\s+\.home-results-media-img[\s\S]*?\{[^}]*\}/,
    )?.[0];
    expect(noHoverZoom).toBeTruthy();
    expect(noHoverZoom).toMatch(/transform:\s*none\s*;/);

    // Mobile image plate stays 180px (within 160–200), not full intrinsic height.
    expect(globals).toMatch(
      /\.home-results-panel--editorial\s+\.home-results-media\s*\{[^}]*height:\s*180px\s*;/s,
    );
  });
});
