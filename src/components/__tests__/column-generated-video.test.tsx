import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ColumnGeneratedVideo from '@/components/ColumnGeneratedVideo';
import { getColumnGeneratedVideo } from '@/data/column-generated-videos';

describe('reviewed column videos', () => {
  it('renders the reviewed local clip with controls, description and an AI disclosure', () => {
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale="ko" slug="taiwan-traffic-accident-procedure" />);
    expect(html).toContain('<video');
    expect(html).toContain('controls=""');
    expect(html).toContain('playsinline=""');
    expect(html).not.toMatch(/autoplay/i);
    expect(html).not.toContain('loop=');
    expect(html).toContain('preload="none"');
    expect(html).toContain('src="/videos/columns/rear-end-simulation-v3-ko.mp4"');
    expect(html).not.toContain('<iframe');
    expect(html).toContain('실제 사고 기록이 아닙니다');
    const describedBy = html.match(/aria-describedby="([^"]+)"/)![1];
    expect(html).toContain(`id="${describedBy}"`);
  });

  it('does not attach a video to an unreviewed language, article or issue with the same slug', () => {
    expect(getColumnGeneratedVideo('fr', 'taiwan-traffic-accident-procedure')).toBeNull();
    expect(getColumnGeneratedVideo('ko', 'taiwan-overtaking-accident-liability')).toBeNull();
    expect(getColumnGeneratedVideo('ko', 'taiwan-traffic-accident-procedure', 'issue')).toBeNull();
    expect(renderToStaticMarkup(<ColumnGeneratedVideo locale="ko" slug="unrelated-article" />)).toBe('');
  });

  it.each([
    ['en', 'not actual accident footage'],
    ['zh-hant', '非真實事故影像'],
    ['ja', '実際の事故映像ではありません'],
  ])('uses a reviewed %s label and caption on the general accident article', (locale, disclosure) => {
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug="taiwan-traffic-accident-procedure" />);
    expect(html).toContain(`rear-end-simulation-v3-${locale}.mp4`);
    expect(html).toContain(disclosure);
    expect(html).not.toContain('실제 사고 기록');
  });

  it.each([
    ['taiwan-lane-change-side-rear-collision-liability', 'lane-change-v3-zh-hant', '橙色車'],
    ['taiwan-chain-rear-end-first-impact-evidence', 'chain-rear-end-v2-zh-hant', '銀色中間車'],
    ['taiwan-roadside-starting-parking-exit-liability', 'roadside-start-v1-zh-hant', '橙色車'],
    ['taiwan-right-turn-car-straight-motorcycle-evidence', 'right-turn-scooter-v1-zh-hant', '機車'],
  ])('keeps the scenario for %s on its reviewed article and language', (slug, id, detail) => {
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale="zh-hant" slug={slug} />);
    expect(html).toContain(`${id}.mp4`);
    expect(html).toContain(detail);
    expect(getColumnGeneratedVideo('en', slug)).toBeNull();
    expect(getColumnGeneratedVideo('zh-hant', slug, 'issue')).toBeNull();
  });

  it.each([
    ['ko', '실제 임대 매물이 아닙니다'],
    ['en', 'not an actual rental listing'],
    ['zh-hant', '非實際出租物件'],
    ['ja', '実際の賃貸物件ではありません'],
  ])('labels the business-premises illustration correctly in %s', (locale, disclosure) => {
    const slug = 'taiwan-company-setup-pitch-location';
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} />);
    expect(html).toContain(`business-premises-v1-${locale}.mp4`);
    expect(html).toContain(disclosure);
    expect(html).not.toContain('accident footage');
    expect(getColumnGeneratedVideo('fr', slug)).toBeNull();
    expect(getColumnGeneratedVideo(locale, slug, 'issue')).toBeNull();
  });
});
