import { describe, expect, it } from 'vitest';

import { siteContent } from '@/data/site-content';

describe('Japanese video channel metadata', () => {
  it('uses the approved Japanese channel type labels', () => {
    expect(siteContent.ja.videos.items.map((item) => item.duration)).toEqual([
      'ブログ',
      'ウェブサイト',
      'ウェブサイト',
      'お問い合わせ',
    ]);
  });

  it('does not retain the English channel type labels in Japanese items', () => {
    const japaneseDurations = siteContent.ja.videos.items.map((item) => item.duration);

    expect(japaneseDurations).not.toContain('Blog');
    expect(japaneseDurations).not.toContain('Website');
    expect(japaneseDurations).not.toContain('Contact');
  });

  it('preserves the existing English channel type labels', () => {
    expect(siteContent.en.videos.items.map((item) => item.duration)).toEqual([
      'Blog',
      'Website',
      'Website',
      'Contact',
    ]);
  });
});
