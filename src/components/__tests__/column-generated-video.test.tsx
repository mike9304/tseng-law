import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ColumnGeneratedVideo from '@/components/ColumnGeneratedVideo';
import { getColumnGeneratedVideo } from '@/data/column-generated-videos';
import generalAccidentCaptions from '@/data/general-accident-video-captions.json';
import overtakingCaptions from '@/data/overtaking-video-captions.json';

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
    expect(getColumnGeneratedVideo('eo', 'taiwan-traffic-accident-procedure')).toBeNull();
    expect(getColumnGeneratedVideo('ko', 'taiwan-accident-police-records')).toBeNull();
    expect(getColumnGeneratedVideo('ko', 'taiwan-traffic-accident-procedure', 'issue')).toBeNull();
    expect(renderToStaticMarkup(<ColumnGeneratedVideo locale="ko" slug="unrelated-article" />)).toBe('');
  });

  it.each(Object.entries(generalAccidentCaptions))('serves the reviewed shared scene with the %s caption only on the general article', (locale, caption) => {
    const slug = 'taiwan-traffic-accident-procedure';
    const asset = getColumnGeneratedVideo(locale, slug);
    expect(asset?.src).toBe('/videos/columns/rear-end-simulation-v3-en.mp4');
    expect(asset?.title).toBe(caption.title);
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} />);
    expect(html).toContain('data-column-video-disclosure');
    expect(html).not.toMatch(/autoplay|loop=/i);
    expect(html).toContain('aria-describedby="column-video-rear-end-simulation-v3-en-caption"');
    expect(html).not.toContain('This is a fictional AI-generated scene');
    expect(getColumnGeneratedVideo(locale, slug, 'issue')).toBeNull();
    expect(getColumnGeneratedVideo(locale, 'taiwan-accident-police-records')).toBeNull();
  });

  it.each(Object.entries(overtakingCaptions))('renders the overtaking illustration with its %s caption without applying it to other content', (locale, caption) => {
    const slug = 'taiwan-overtaking-accident-liability';
    const assetLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale) ? locale : 'en';
    const asset = getColumnGeneratedVideo(locale, slug);
    expect(asset?.src).toBe(`/videos/columns/overtaking-cutback-v2-${assetLocale}.mp4`);
    expect(asset?.disclosure).toBe(caption.disclosure);
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} />);
    expect(html).toContain(renderToStaticMarkup(<>{caption.title}</>));
    expect(html).toContain(renderToStaticMarkup(<>{caption.description}</>));
    expect(html).toContain(renderToStaticMarkup(<>{caption.disclosure}</>));
    expect(html).toContain('controls=""');
    expect(html).not.toMatch(/autoplay|loop=/i);
    expect(getColumnGeneratedVideo(locale, slug, 'issue')).toBeNull();
    expect(getColumnGeneratedVideo(locale, 'taiwan-accident-police-records')).toBeNull();
    expect(getColumnGeneratedVideo('eo', slug)).toBeNull();
  });

  it.each([
    ['en', 'not actual accident footage'],
    ['zh-hant', '非真實事故影像'],
    ['ja', '実際の事故映像ではありません'],
    ['fr', 'Scène fictive générée par IA'],
    ['de', 'Fiktive, KI-generierte Szene'],
    ['es', 'Escena ficticia generada con IA'],
    ['pt', 'Cena fictícia gerada por IA'],
    ['it', 'Scena fittizia generata con IA'],
  ])('uses a reviewed %s label and caption on the general accident article', (locale, disclosure) => {
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug="taiwan-traffic-accident-procedure" />);
    expect(html).toContain(`rear-end-simulation-v3-${locale}.mp4`);
    expect(html).toContain(disclosure);
    expect(html).not.toContain('실제 사고 기록');
  });

  it.each([
    ['ko', '비접촉 사고를 재현한 영상이 아닙니다'],
    ['en', 'not a reconstruction of any judgment'],
    ['zh-hant', '不是文中無接觸摔車案的重建'],
  ])('keeps the left-turn collision separate from cited cases in %s', (locale, disclosure) => {
    const slug = 'taiwan-left-turn-vs-straight-motorcycle';
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} />);
    expect(html).toContain(`left-turn-scooter-v1-${locale}.mp4`);
    expect(html).toContain(disclosure);
    expect(getColumnGeneratedVideo('ja', slug)).toBeNull();
    expect(getColumnGeneratedVideo(locale, slug, 'issue')).toBeNull();
  });

  it.each([
    ['taiwan-lane-change-side-rear-collision-liability', 'lane-change-v3-zh-hant', '橙色車'],
    ['taiwan-lowered-height-gantry-state-compensation-driver-fault', 'gantry-impact-v1-zh-hant', '畫面未呈現事故前的高度調整或警示過程'],
    ['taiwan-chain-rear-end-first-impact-evidence', 'chain-rear-end-v2-zh-hant', '銀色中間車'],
    ['taiwan-roadside-starting-parking-exit-liability', 'roadside-start-v3-zh-hant', '橙色車'],
    ['taiwan-right-turn-car-straight-motorcycle-evidence', 'right-turn-scooter-v2-zh-hant', '機車'],
    ['taiwan-car-repair-cost-estimate-parts-depreciation', 'repair-workshop-v1-zh-hant', '零件是否需更換'],
    ['taiwan-car-repair-rental-cost-repair-period-evidence', 'repair-workshop-v1-zh-hant', '修理需要幾天'],
    ['taiwan-truck-blocking-multiple-dashcam-evidence', 'truck-blocking-v2-zh-hant', '四組原始影像'],
    ['taiwan-car-door-opening-motorcycle-liability', 'car-door-v2-zh-hant', '騎士失去平衡'],
    ['taiwan-gas-station-tanker-reversing-beeper-liability', 'tanker-reversing-v1-zh-hant', '非本文凌晨事故'],
    ['green-light-red-light-pedestrian-third-person', 'pedestrian-third-person-v1-zh-hant', '非本文夜間事故'],
    ['taiwan-flashing-red-yellow-intersection-liability', 'flashing-intersection-v1-zh-hant', '與文內兩段式示意圖是不同設定'],
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

  it.each(['ko', 'ja', 'en', 'zh-hant'])('loops the reviewed road-rage dashcam scene only after the reader presses play (%s)', (locale) => {
    const slug = 'taiwan-road-rage-freeway-cut-in-sentence-reduced';
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} />);
    expect(html).toContain(`road-rage-freeway-cut-in-sentence-reduced-v1-${locale}.mp4`);
    expect(html).toContain('loop=""');
    expect(html).toContain('controls=""');
    expect(html).toContain('preload="none"');
    expect(html).not.toMatch(/autoplay/i);
    expect(html).toContain('data-column-video-disclosure');
    expect(getColumnGeneratedVideo(locale, slug, 'issue')).toBeNull();
  });
});
