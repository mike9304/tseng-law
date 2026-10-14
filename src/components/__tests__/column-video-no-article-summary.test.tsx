import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ColumnGeneratedVideo from '@/components/ColumnGeneratedVideo';
import { getColumnGeneratedVideo, getColumnGeneratedVideos, type ColumnVideoSource } from '@/data/column-generated-videos';
import retiredArticleFilms from '@/data/traffic-column-films.json';

describe('public column scenes after retiring article-summary films', () => {
  it('does not expose any retired summary film through either lookup or the public player', () => {
    for (const [key, retired] of Object.entries(retiredArticleFilms)) {
      const [source, locale, slug] = key.split('/');
      expect(getColumnGeneratedVideo(locale, slug, source as ColumnVideoSource)?.src, key).not.toBe(retired.src);
      expect(getColumnGeneratedVideos(locale, slug, source as ColumnVideoSource).map(asset => asset.src), key).not.toContain(retired.src);
      const html = renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug={slug} source={source as ColumnVideoSource} />);
      expect(html, key).not.toContain(retired.src);
      expect(html, key).not.toContain('data-column-video-chapter');
    }
  });

  it('retains the reviewed collision scene and its disclosure on the Korean accident article', () => {
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale="ko" slug="taiwan-traffic-accident-procedure" />);
    expect(html).toContain('/videos/columns/rear-end-simulation-v3-ko.mp4');
    expect(html).toContain('controls=""');
    expect(html).toContain('data-column-video-disclosure');
    expect(html).toContain('실제 사고 기록이 아닙니다');
  });

  it('leaves the police-document article without a video when no separate reviewed scene exists', () => {
    for (const locale of ['ko', 'en', 'ja', 'zh-hant']) {
      expect(getColumnGeneratedVideo(locale, 'taiwan-accident-police-records')).toBeNull();
      expect(renderToStaticMarkup(<ColumnGeneratedVideo locale={locale} slug="taiwan-accident-police-records" />)).toBe('');
    }
  });

  it('keeps both separately reviewed chase scenes instead of an assembled explanation', () => {
    const html = renderToStaticMarkup(<ColumnGeneratedVideo locale="ko" slug="taiwan-road-rage-freeway-chase-own-dashcam-too" />);
    expect(html.match(/<video\b/g)).toHaveLength(2);
    expect(html).toContain('/videos/columns/road-rage-freeway-chase-own-dashcam-too-v3-ko.mp4');
    expect(html).toContain('/videos/columns/own-dashcam-cut-in-v2-ko.mp4');
  });
});
