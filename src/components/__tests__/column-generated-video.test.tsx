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
    expect(html).toContain('src="/videos/columns/rear-end-simulation-v2-ko.mp4"');
    expect(html).not.toContain('<iframe');
    expect(html).toContain('실제 사고 기록이 아닙니다');
    const describedBy = html.match(/aria-describedby="([^"]+)"/)![1];
    expect(html).toContain(`id="${describedBy}"`);
  });

  it('does not attach a video to an unreviewed language, article or issue with the same slug', () => {
    expect(getColumnGeneratedVideo('en', 'taiwan-traffic-accident-procedure')).toBeNull();
    expect(getColumnGeneratedVideo('ko', 'taiwan-overtaking-accident-liability')).toBeNull();
    expect(getColumnGeneratedVideo('ko', 'taiwan-traffic-accident-procedure', 'issue')).toBeNull();
    expect(renderToStaticMarkup(<ColumnGeneratedVideo locale="ko" slug="unrelated-article" />)).toBe('');
  });
});
