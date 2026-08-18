import { Children, isValidElement, type ReactElement } from 'react';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import ServicesBento from '@/components/ServicesBento';
import TaiwanHeritageInterlude, {
  TAIWAN_HERITAGE_INTERLUDE_MEDIA,
  resolveHeritageInterludeInsertionNodeId,
} from '@/components/TaiwanHeritageInterlude';
import { LegacyHomePageBody } from '@/app/[locale]/(legacy)/home-legacy';
import type { SiteLocale } from '@/lib/locales';

const localizedMediaAlt = {
  ko: '밝은 대만 전통 산허위안과 현대식 파빌리온이 어우러진 풍경',
  'zh-hant': '明亮的臺灣傳統三合院與當代亭閣相映成景',
  en: 'Bright Taiwanese sanheyuan and contemporary pavilion',
  ja: '明るい台湾の伝統的な三合院と現代的なパビリオン',
} as const satisfies Record<SiteLocale, string>;

describe('TaiwanHeritageInterlude', () => {
  it.each(Object.entries(localizedMediaAlt) as Array<
    [SiteLocale, string]
  >)('renders only the full-bleed Sanheyuan film for %s', (locale, mediaAlt) => {
    const html = renderToStaticMarkup(
      <TaiwanHeritageInterlude locale={locale} />,
    );

    expect(html).toContain('data-home-heritage-interlude="true"');
    expect(html).not.toContain('aria-labelledby=');
    expect(html).not.toContain('<section');
    expect(html).not.toContain('<h2');
    expect(html).not.toContain('taiwan-heritage-interlude__content');
    expect(html).not.toContain('taiwan-heritage-interlude__veil');
    expect(html).toContain(
      encodeURIComponent(TAIWAN_HERITAGE_INTERLUDE_MEDIA.poster),
    );
    expect(html).toContain(
      `srcSet="${TAIWAN_HERITAGE_INTERLUDE_MEDIA.mobilePoster}"`,
    );
    expect(html).toContain(`alt="${mediaAlt}"`);
    expect(html).not.toMatch(
      /(?:TAICHUNG|Taichung|타이중|台中|도시의 빛|都市の光)/,
    );
    expect(html).toContain('data-video-mounted="false"');
    expect(html).not.toContain('<video');
  });

  it('maps the interlude exclusively to the Taiwan Sanheyuan media set', () => {
    expect(TAIWAN_HERITAGE_INTERLUDE_MEDIA).toEqual({
      poster: '/images/editorial/taiwan-sanheyuan-modern-daylight-v2.webp',
      webmSrc: '/videos/taiwan-sanheyuan-modern-daylight-v2.webm',
      mp4Src: '/videos/taiwan-sanheyuan-modern-daylight-v2.mp4',
      mobilePoster:
        '/images/editorial/taiwan-sanheyuan-modern-daylight-v2-mobile.webp',
      mobileWebmSrc:
        '/videos/taiwan-sanheyuan-modern-daylight-v2-mobile.webm',
      mobileMp4Src:
        '/videos/taiwan-sanheyuan-modern-daylight-v2-mobile.mp4',
    });

    const source = readFileSync(
      path.join(process.cwd(), 'src/components/TaiwanHeritageInterlude.tsx'),
      'utf8',
    );
    const globalsCss = readFileSync(
      path.join(process.cwd(), 'src/app/globals.css'),
      'utf8',
    );

    expect(source).not.toMatch(/(?:TAICHUNG|Taichung|타이중|台中)/);
    expect(source).not.toContain('taiwan-heritage-interlude__content');
    expect(source).not.toContain('taiwan-heritage-interlude__veil');
    expect(globalsCss).not.toContain('.taiwan-heritage-interlude__content');
    expect(globalsCss).not.toContain('.taiwan-heritage-interlude__veil');
  });

  it('chooses exactly one published-home insertion root and prefers decomposed home', () => {
    const bothRoots = ['home-attorney', 'home-attorney-root'];
    const insertionNodeId = resolveHeritageInterludeInsertionNodeId(
      true,
      bothRoots,
    );

    expect(insertionNodeId).toBe('home-attorney-root');
    expect(bothRoots.filter((nodeId) => nodeId === insertionNodeId)).toHaveLength(1);
    expect(
      resolveHeritageInterludeInsertionNodeId(true, ['home-attorney']),
    ).toBe('home-attorney');
    expect(
      resolveHeritageInterludeInsertionNodeId(false, bothRoots),
    ).toBeNull();
    expect(
      resolveHeritageInterludeInsertionNodeId(true, ['about-attorney']),
    ).toBeNull();
  });

  it('widens the direct published-builder child across mobile side padding', () => {
    const globalsCss = readFileSync(
      path.join(process.cwd(), 'src/app/globals.css'),
      'utf8',
    );
    const mobileRule = globalsCss.match(
      /@media \(max-width: 768px\) \{\s+\.builder-pub-main > \.taiwan-heritage-interlude \{([\s\S]*?)\n  \}\n\}/,
    );

    expect(mobileRule?.[1]).toContain('width: calc(100% + 32px)');
    expect(mobileRule?.[1]).toContain('margin-left: -16px');
    expect(mobileRule?.[1]).toContain('margin-right: -16px');
  });

  it('passes localized video controls without changing poster-first SSR', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src/components/TaiwanHeritageInterlude.tsx'),
      'utf8',
    );

    expect(source).toContain(
      'controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS[locale]}',
    );
  });

  it('sits between services and the attorney profile in the legacy home flow', () => {
    const body = LegacyHomePageBody({
      locale: 'ko',
      posts: [],
      faqItems: [],
    });
    const children = Children.toArray(body.props.children);
    const interludeIndex = children.findIndex(
      (child) => isValidElement(child) && child.type === TaiwanHeritageInterlude,
    );

    expect(interludeIndex).toBeGreaterThan(0);
    const before = children[interludeIndex - 1];
    const after = children[interludeIndex + 1];

    expect(isValidElement<{ children: ReactElement }>(before)).toBe(true);
    expect(isValidElement<{ children: ReactElement }>(after)).toBe(true);
    if (
      !isValidElement<{ children: ReactElement }>(before)
      || !isValidElement<{ children: ReactElement }>(after)
    ) {
      throw new Error('Legacy home transition wrappers were not found');
    }

    expect(before.props.children.type).toBe(ServicesBento);
    expect(after.props.children.type).toBe(HomeAttorneySplit);
  });
});
