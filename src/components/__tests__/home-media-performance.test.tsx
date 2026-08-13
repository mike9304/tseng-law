import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import DecorativeAutoplayVideo, {
  DECORATIVE_VIDEO_CONTROL_LABELS,
  shouldEnableDecorativeVideo,
  shouldMountDecorativeVideo,
  shouldWaitForDecorativeVideoPosterPaint,
} from '../DecorativeAutoplayVideo';
import HeroMediaBackground from '../HeroMediaBackground';
import HomeAttorneySplit from '../HomeAttorneySplit';
import { buildSeoMetadata, DEFAULT_SOCIAL_IMAGE_PATH } from '@/lib/seo';

const HERO_IMAGE_SRC =
  '/images/editorial/taichung-courthouse-civic-daylight-v2.webp';
const HERO_MP4_SRC = '/videos/taichung-courthouse-civic-daylight-v2.mp4';
const HERO_WEBM_SRC = '/videos/taichung-courthouse-civic-daylight-v2.webm';
const HERO_MOBILE_IMAGE_SRC =
  '/images/editorial/taichung-courthouse-civic-daylight-v2-mobile.webp';
const HERO_MOBILE_MP4_SRC =
  '/videos/taichung-courthouse-civic-daylight-v2-mobile.mp4';
const HERO_MOBILE_WEBM_SRC =
  '/videos/taichung-courthouse-civic-daylight-v2-mobile.webm';

describe('home media loading', () => {
  it('server-renders the optimized hero poster fallback without mounting video', () => {
    const html = renderToStaticMarkup(<HeroMediaBackground locale="ko" />);

    expect(html).toContain(encodeURIComponent(HERO_IMAGE_SRC));
    expect(html).toContain(`srcSet="${HERO_MOBILE_IMAGE_SRC}"`);
    expect(html).toContain('media="(max-width: 640px)"');
    expect(html).toMatch(/class="[^"]*\bhero-media-image\b[^"]*"/);
    expect(html).toContain('data-nimg="fill"');
    expect(html).toContain('sizes="100vw"');
    expect(html).toContain('alt=""');
    expect(html).toContain('loading="lazy"');
    expect(html).not.toContain('fetchPriority="high"');
    expect(html).toContain('data-video-mounted="false"');
    expect(html).not.toContain('<video');
    expect(html).not.toContain('taipei-101-blue-hour-cinematic');
  });

  it('connects the main hero to the Taichung court video encodings', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src/components/HeroMediaBackground.tsx'),
      'utf8',
    );

    expect(source).toContain(`image: '${HERO_IMAGE_SRC}'`);
    expect(source).toContain(`mp4: '${HERO_MP4_SRC}'`);
    expect(source).toContain(`webm: '${HERO_WEBM_SRC}'`);
    expect(source).toContain(`'${HERO_MOBILE_IMAGE_SRC}'`);
    expect(source).toContain(`'${HERO_MOBILE_MP4_SRC}'`);
    expect(source).toContain(`'${HERO_MOBILE_WEBM_SRC}'`);
    expect(source).toContain('<DecorativeAutoplayVideo');
    expect(source).toContain('imageClassName="hero-media-image"');
    expect(source).toContain('videoClassName="hero-media-video"');
    expect(source).toContain('mobilePoster={slide.mobileImage}');
    expect(source).toContain('mobileMp4Src={slide.mobileMp4}');
    expect(source).toContain('mobileWebmSrc={slide.mobileWebm}');
    expect(source).toContain('alt=""');
    expect(source).toContain('rootMargin="-1px 0px"');
    expect(source).not.toContain('eagerVideoMount');
  });

  it('keeps an accessible next/image poster in the reusable SSR contract', () => {
    const html = renderToStaticMarkup(
      <DecorativeAutoplayVideo
        webmSrc="/videos/example.webm"
        mp4Src="/videos/example.mp4"
        poster={HERO_IMAGE_SRC}
        mobileWebmSrc="/videos/example-mobile.webm"
        mobileMp4Src="/videos/example-mobile.mp4"
        mobilePoster="/images/example-mobile.webp"
        alt="Taipei skyline at blue hour"
        width={1600}
        height={900}
        controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS.en}
      />,
    );

    expect(html).toContain(encodeURIComponent(HERO_IMAGE_SRC));
    expect(html).toContain('<picture>');
    expect(html).toContain('media="(max-width: 640px)"');
    expect(html).toContain('srcSet="/images/example-mobile.webp"');
    expect(html).toContain('alt="Taipei skyline at blue hour"');
    expect(html).toContain('width="1600"');
    expect(html).toContain('height="900"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('data-video-ready="false"');
    expect(html).not.toContain('<video');
  });

  it('declares responsive poster media and Safari-first MP4 fallback order', () => {
    const componentSource = readFileSync(
      path.join(process.cwd(), 'src/components/DecorativeAutoplayVideo.tsx'),
      'utf8',
    );

    const mobileMp4Index = componentSource.indexOf(
      'src={mobileMp4Src}',
    );
    const mobileWebmIndex = componentSource.indexOf(
      'src={mobileWebmSrc}',
    );
    const mp4Index = componentSource.indexOf(
      '<source src={mp4Src} type="video/mp4" />',
    );
    const webmIndex = componentSource.indexOf(
      '<source src={webmSrc} type="video/webm" />',
    );
    expect(mobileMp4Index).toBeGreaterThan(-1);
    expect(mobileWebmIndex).toBeGreaterThan(mobileMp4Index);
    expect(mp4Index).toBeGreaterThan(mobileWebmIndex);
    expect(webmIndex).toBeGreaterThan(mp4Index);
    expect(componentSource).toContain("mobileMediaQuery = '(max-width: 640px)'");
    expect(componentSource).toContain('srcSet={mobilePoster}');
    expect(componentSource).toContain('aria-hidden="true"');
    expect(componentSource).toMatch(/\n\s+muted\n/);
    expect(componentSource).toMatch(/\n\s+autoPlay\n/);
    expect(componentSource).toContain('loop = true');
    expect(componentSource).toContain('loop={loop}');
    expect(componentSource).toMatch(/\n\s+playsInline\n/);
    expect(componentSource).toContain('controls={false}');
    expect(componentSource).toContain('tabIndex={-1}');
    expect(componentSource).toContain('className="decorative-autoplay-video__control"');
    expect(componentSource).toContain('aria-label={controlLabel}');
  });

  it('gates video for reduced motion and data saving before idle/viewport mounting', () => {
    expect(shouldEnableDecorativeVideo(false, false)).toBe(true);
    expect(shouldEnableDecorativeVideo(false, undefined)).toBe(true);
    expect(shouldEnableDecorativeVideo(true, false)).toBe(false);
    expect(shouldEnableDecorativeVideo(false, true)).toBe(false);
    expect(shouldMountDecorativeVideo({
      enabled: false,
      eagerVideoMount: true,
      idleReady: true,
      nearViewport: true,
      inViewport: true,
    })).toBe(false);
    expect(shouldMountDecorativeVideo({
      enabled: true,
      eagerVideoMount: true,
      idleReady: false,
      nearViewport: false,
      inViewport: false,
    })).toBe(true);
    expect(shouldMountDecorativeVideo({
      enabled: true,
      eagerVideoMount: false,
      idleReady: false,
      nearViewport: true,
      inViewport: true,
    })).toBe(true);
    expect(shouldMountDecorativeVideo({
      enabled: true,
      eagerVideoMount: false,
      idleReady: true,
      nearViewport: true,
      inViewport: false,
    })).toBe(true);
    expect(shouldMountDecorativeVideo({
      enabled: true,
      eagerVideoMount: false,
      idleReady: true,
      nearViewport: false,
      inViewport: false,
    })).toBe(false);

    const componentSource = readFileSync(
      path.join(process.cwd(), 'src/components/DecorativeAutoplayVideo.tsx'),
      'utf8',
    );
    expect(componentSource).toContain(
      "window.matchMedia('(prefers-reduced-motion: reduce)')",
    );
    expect(componentSource).toContain(
      '(navigator as NavigatorWithConnection).connection',
    );
    expect(componentSource).toContain('window.requestIdleCallback');
    expect(componentSource).toContain('{ timeout: 1200 }');
    expect(componentSource).toContain('new IntersectionObserver');
    expect(componentSource).toContain('video.pause()');
    expect(componentSource).toContain('video.play()');
  });

  it('defers only opt-in mobile video until its poster has painted', () => {
    const eagerMount = {
      enabled: true,
      eagerVideoMount: true,
      idleReady: false,
      nearViewport: false,
      inViewport: false,
    };

    expect(shouldMountDecorativeVideo(eagerMount)).toBe(true);
    expect(shouldWaitForDecorativeVideoPosterPaint({
      deferVideoUntilPosterPaint: false,
      mobileViewport: true,
      posterPainted: false,
    })).toBe(false);
    expect(shouldWaitForDecorativeVideoPosterPaint({
      deferVideoUntilPosterPaint: true,
      mobileViewport: false,
      posterPainted: false,
    })).toBe(false);
    expect(shouldWaitForDecorativeVideoPosterPaint({
      deferVideoUntilPosterPaint: true,
      mobileViewport: true,
      posterPainted: false,
    })).toBe(true);
    expect(shouldWaitForDecorativeVideoPosterPaint({
      deferVideoUntilPosterPaint: true,
      mobileViewport: true,
      posterPainted: true,
      pageLoadPainted: false,
    })).toBe(true);
    expect(shouldWaitForDecorativeVideoPosterPaint({
      deferVideoUntilPosterPaint: true,
      mobileViewport: true,
      posterPainted: true,
      pageLoadPainted: true,
    })).toBe(false);
    expect(shouldMountDecorativeVideo({
      ...eagerMount,
      waitForPosterPaint: true,
    })).toBe(false);

    const componentSource = readFileSync(
      path.join(process.cwd(), 'src/components/DecorativeAutoplayVideo.tsx'),
      'utf8',
    );
    expect(componentSource).toContain('window.matchMedia(mobileMediaQuery)');
    expect(componentSource).toContain('window.requestAnimationFrame');
    expect(componentSource).toContain("window.addEventListener('load'");
  });

  it('ships the main hero poster and encodings at web-appropriate sizes', () => {
    const assets = [
      [HERO_IMAGE_SRC, 50_000, 400_000],
      [HERO_MP4_SRC, 500_000, 6_500_000],
      [HERO_WEBM_SRC, 500_000, 6_500_000],
      [HERO_MOBILE_IMAGE_SRC, 20_000, 300_000],
      [HERO_MOBILE_MP4_SRC, 300_000, 2_000_000],
      [HERO_MOBILE_WEBM_SRC, 300_000, 2_000_000],
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

  it('does not duplicate poster payloads as CSS backgrounds', () => {
    const heroSource = readFileSync(
      path.join(process.cwd(), 'src/components/HeroMediaBackground.tsx'),
      'utf8',
    );
    const globals = readFileSync(
      path.join(process.cwd(), 'src/app/globals.css'),
      'utf8',
    );

    expect(heroSource).toContain(`image: '${HERO_IMAGE_SRC}'`);
    expect(heroSource).not.toContain('priority');
    expect(heroSource).toContain('DecorativeAutoplayVideo');
    expect(heroSource).not.toContain('backgroundImage');
    expect(globals).not.toMatch(
      /url\((?:['"])?\/images\/hero-taipei-101-blue-hour\.webp/,
    );
    expect(globals).not.toMatch(
      /url\((?:['"])?\/images\/editorial\/taipei-courthouse-cinematic\.webp/,
    );
  });

  it('uses the current cinematic Taiwan image as the default social preview', () => {
    const metadata = buildSeoMetadata({
      locale: 'ko',
      title: '대만 변호사·회사설립·소송',
      description: '대만 법률 서비스',
    });
    const serialized = JSON.stringify(metadata);

    expect(serialized).toContain(DEFAULT_SOCIAL_IMAGE_PATH);
    expect(serialized).not.toContain('/images/hero-taiwan-modern-city-opening.webp');
    expect(serialized).not.toContain('/images/hero-taipei-101-blue-hour.webp');
    expect(serialized).not.toContain('/images/header-skyline-ratio.webp');
  });

  it('leaves the below-fold attorney portrait lazy by default', () => {
    const html = renderToStaticMarkup(<HomeAttorneySplit locale="ko" />);

    expect(html).toContain('class="person-photo"');
    expect(html).toContain('loading="lazy"');
    expect(html).not.toContain('loading="eager"');
  });
});
