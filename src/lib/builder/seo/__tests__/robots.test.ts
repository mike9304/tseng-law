import { describe, expect, it } from 'vitest';
import { parseCustomRobotsTxt } from '../robots';

describe('parseCustomRobotsTxt', () => {
  it('parses custom rules and sitemap directives', () => {
    const robots = parseCustomRobotsTxt(
      [
        'User-agent: *',
        'Allow: /',
        'Disallow: /private',
        'Crawl-delay: 5',
        'Sitemap: https://tseng-law.com/custom-sitemap.xml',
      ].join('\n'),
      'https://tseng-law.com/sitemap.xml',
    );

    expect(robots).toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: '/private',
        crawlDelay: 5,
      },
      sitemap: ['https://tseng-law.com/custom-sitemap.xml'],
    });
  });

  it('falls back to an indexable default when the custom source has no rules', () => {
    const robots = parseCustomRobotsTxt('# comment only', 'https://tseng-law.com/sitemap.xml');

    expect(robots).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://tseng-law.com/sitemap.xml',
    });
  });
});
