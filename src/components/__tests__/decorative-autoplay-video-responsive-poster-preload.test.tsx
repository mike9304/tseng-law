import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import DecorativeAutoplayVideo, {
  DECORATIVE_VIDEO_CONTROL_LABELS,
} from '../DecorativeAutoplayVideo';

const posterProps = {
  webmSrc: '/videos/desktop.webm',
  mp4Src: '/videos/desktop.mp4',
  poster: '/images/desktop.webp',
  mobilePoster: '/images/mobile.webp',
  mobileWebmSrc: '/videos/mobile.webm',
  mobileMp4Src: '/videos/mobile.mp4',
  alt: 'Opening poster',
  width: 1600,
  height: 900,
  sizes: '100vw',
  controlLabels: DECORATIVE_VIDEO_CONTROL_LABELS.en,
};

describe('DecorativeAutoplayVideo responsive poster priority', () => {
  it('lets picture select the mobile poster without an unconditional desktop preload', () => {
    const html = renderToStaticMarkup(
      <DecorativeAutoplayVideo {...posterProps} priority />,
    );

    expect(html).toContain(
      '<source media="(max-width: 640px)" srcSet="/images/mobile.webp" type="image/webp"',
    );
    expect(html).toContain('/_next/image?url=%2Fimages%2Fdesktop.webp');
    expect(html.indexOf('<source media='))
      .toBeLessThan(html.indexOf('<img'));
    expect(html).toContain('fetchpriority="high"');
    expect(html).toContain('loading="eager"');
    expect(html).not.toContain('<link rel="preload"');
  });

  it('keeps a priority desktop-only poster eager when no mobile variant exists', () => {
    const { mobilePoster: _mobilePoster, ...desktopOnlyProps } = posterProps;
    const html = renderToStaticMarkup(
      <DecorativeAutoplayVideo {...desktopOnlyProps} priority />,
    );

    expect(html).not.toContain('<source media=');
    expect(html).toContain('/_next/image?url=%2Fimages%2Fdesktop.webp');
    expect(html).toContain('fetchpriority="high"');
    expect(html).toContain('loading="eager"');
    expect(html).not.toContain('<link rel="preload"');
  });
});
