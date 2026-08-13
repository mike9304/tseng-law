import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomeCaseResultsSplit, {
  HOME_RESULTS_EDITORIAL_IMAGE_HEIGHT,
  HOME_RESULTS_EDITORIAL_IMAGE_SRC,
  HOME_RESULTS_EDITORIAL_IMAGE_WIDTH,
  HOME_RESULTS_EDITORIAL_MOBILE_IMAGE_SRC,
  HOME_RESULTS_EDITORIAL_MOBILE_VIDEO_MP4_SRC,
  HOME_RESULTS_EDITORIAL_MOBILE_VIDEO_WEBM_SRC,
  HOME_RESULTS_EDITORIAL_VIDEO_MP4_SRC,
  HOME_RESULTS_EDITORIAL_VIDEO_WEBM_SRC,
} from '../HomeCaseResultsSplit';

describe('HomeCaseResultsSplit editorial plate', () => {
  it.each([
    ['ko', '밝고 비어 있는 현대식 대만 민사 법정'],
    ['zh-hant', '明亮空曠的現代臺灣民事法庭'],
    ['en', 'A bright, empty modern Taiwan civil courtroom'],
    ['ja', '明るく無人の現代的な台湾民事法廷'],
  ] as const)('describes the empty modern civil courtroom accurately in %s', (
    locale,
    imageAlt,
  ) => {
    const html = renderToStaticMarkup(<HomeCaseResultsSplit locale={locale} />);

    expect(html).toContain(`alt="${imageAlt}"`);
    expect(html).not.toMatch(/(?:Kaohsiung|가오슝|高雄)/);
  });

  it('keeps results copy and mounts an honestly described Taiwan civil courtroom plate', () => {
    const html = renderToStaticMarkup(<HomeCaseResultsSplit locale="ko" />);

    expect(html).toContain('id="results"');
    expect(html).toContain('home-results-panel--editorial');
    expect(html).toContain('split--img-left');
    // next/image encodes the path inside /_next/image?url=...
    expect(html).toContain(encodeURIComponent(HOME_RESULTS_EDITORIAL_IMAGE_SRC));
    expect(html).toContain(
      `srcSet="${HOME_RESULTS_EDITORIAL_MOBILE_IMAGE_SRC}"`,
    );
    expect(html).toMatch(/taiwan-courtroom-calm-daylight-v2\.webp/);
    expect(html).toContain('alt="밝고 비어 있는 현대식 대만 민사 법정"');
    expect(html).toContain('loading="lazy"');
    expect(html).not.toMatch(/\spriority(?:=|\s|>)/i);
    expect(html).toContain('sizes="(max-width: 900px) 100vw, 52vw"');
    expect(html).toContain('data-video-mounted="false"');
    expect(html).not.toContain('<video');
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
      'taiwan-courtroom-calm-daylight-v2.webp',
    );
    expect(existsSync(assetPath)).toBe(true);
    const bytes = statSync(assetPath).size;
    // Reasonable web payload: well under original PNG (~2.2MB), not empty.
    expect(bytes).toBeGreaterThan(20_000);
    expect(bytes).toBeLessThan(400_000);
    expect(HOME_RESULTS_EDITORIAL_IMAGE_SRC).toBe(
      '/images/editorial/taiwan-courtroom-calm-daylight-v2.webp',
    );
    expect(HOME_RESULTS_EDITORIAL_IMAGE_WIDTH).toBe(1920);
    expect(HOME_RESULTS_EDITORIAL_IMAGE_HEIGHT).toBe(1080);
  });

  it('ships WebM and MP4 courtroom motion assets in the expected paths', () => {
    const assets = [
      [HOME_RESULTS_EDITORIAL_VIDEO_WEBM_SRC, 200_000, 3_000_000],
      [HOME_RESULTS_EDITORIAL_VIDEO_MP4_SRC, 800_000, 3_000_000],
      [HOME_RESULTS_EDITORIAL_MOBILE_IMAGE_SRC, 20_000, 200_000],
      [HOME_RESULTS_EDITORIAL_MOBILE_VIDEO_WEBM_SRC, 200_000, 1_000_000],
      [HOME_RESULTS_EDITORIAL_MOBILE_VIDEO_MP4_SRC, 300_000, 1_000_000],
    ] as const;

    for (const [publicPath, minimumBytes, maximumBytes] of assets) {
      const assetPath = path.join(
        process.cwd(),
        'public',
        publicPath.replace(/^\//, ''),
      );
      expect(existsSync(assetPath)).toBe(true);
      const bytes = statSync(assetPath).size;
      expect(bytes).toBeGreaterThan(minimumBytes);
      expect(bytes).toBeLessThan(maximumBytes);
    }
  });

  it('passes localized controls and keeps the one-shot replay contract', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src/components/HomeCaseResultsSplit.tsx'),
      'utf8',
    );

    expect(source).toContain('loop={false}');
    expect(source).toContain(
      'mobilePoster={HOME_RESULTS_EDITORIAL_MOBILE_IMAGE_SRC}',
    );
    expect(source).toContain(
      'mobileWebmSrc={HOME_RESULTS_EDITORIAL_MOBILE_VIDEO_WEBM_SRC}',
    );
    expect(source).toContain(
      'mobileMp4Src={HOME_RESULTS_EDITORIAL_MOBILE_VIDEO_MP4_SRC}',
    );
    expect(source).toContain(
      'controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS[locale]}',
    );
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
    expect(globals).toMatch(
      /\.home-results-panel--editorial\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*52fr\)\s+minmax\(0,\s*48fr\)\s*;/,
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
