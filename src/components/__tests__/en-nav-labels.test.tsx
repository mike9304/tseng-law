import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({
  pathname: '/en/columns',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

import Header from '@/components/Header';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';

describe('English nav and page labels', () => {
  it('labels the columns route Insights and the offices hash Locations, and keeps the Offices utility item', () => {
    navigationState.pathname = '/en/services';
    const html = renderToStaticMarkup(<Header locale="en" />);

    expect(html).toContain('href="/en/columns"');
    expect(html).toContain('>Insights</a>');
    expect(html).toContain('href="/en/contact#offices">Locations</a>');
    expect(html).toContain('href="/en/contact#offices">Offices</a>');
    expect(html).not.toContain('>Columns</a>');
    expect(html).not.toContain('>Directions</a>');
  });

  it('unifies the services listing title with the Services nav label', () => {
    expect(pageCopy.en.services.title).toBe('Services');
    expect(pageCopy.en.insights.title).toBe('Insights');
    expect(siteContent.en.nav.primary).toEqual([
      { label: 'Services', href: '/en/services' },
      { label: 'Our Team', href: '/en/lawyers' },
      { label: 'Pricing', href: '/en/pricing' },
      { label: 'Insights', href: '/en/columns' },
      { label: 'Media Center', href: '/en/videos' },
      { label: 'Locations', href: '/en/contact#offices' },
    ]);
  });

  it('renames derived English columns and services labels without changing routes', () => {
    const columnDetail = readFileSync(
      path.join(process.cwd(), 'src/app/[locale]/columns/[slug]/page.tsx'),
      'utf8',
    );
    const serviceDetail = readFileSync(
      path.join(process.cwd(), 'src/app/[locale]/services/[slug]/page.tsx'),
      'utf8',
    );
    const header = readFileSync(
      path.join(process.cwd(), 'src/components/Header.tsx'),
      'utf8',
    );

    expect(columnDetail).toContain("backLabel: '← Back to Insights'");
    expect(columnDetail).toContain("locale === 'ja' ? 'コラム' : 'Insights'");
    expect(serviceDetail).toContain("breadcrumbServices: 'Services'");
    expect(header).toContain("{ key: 'insights', label: 'Insights', href: '/en/columns' }");
    expect(header).toContain("{ key: 'directions', label: 'Locations', href: '/en/contact#offices' }");
    expect(header).toContain("{ label: 'Offices', href: '/en/contact#offices' }");
  });
});
