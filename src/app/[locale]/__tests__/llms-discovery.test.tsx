import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { siteLocales } from '@/lib/locales';
import LocaleLayout from '../layout';

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

vi.mock('@/app/fonts', () => ({
  getLocaleFontClassName: () => 'font-mock',
  getManagedLocaleFontClassNames: () => ['font-managed'],
}));

vi.mock('@/lib/seo', () => ({
  buildWebsiteJsonLd: () => ({ '@type': 'WebSite' }),
  buildLegalServiceJsonLd: () => ({ '@type': 'LegalService' }),
  getOrganizationName: () => 'Test Org',
}));

vi.mock('@/components/JsonLd', () => ({ default: () => null }));
vi.mock('@/components/DocumentLocaleSync', () => ({ default: () => null }));
vi.mock('@/components/Header', () => ({ default: () => null }));
vi.mock('@/components/Footer', () => ({ default: () => null }));
vi.mock('@/components/ScrollTopButton', () => ({ default: () => null }));
vi.mock('@/components/QuickContactWidget', () => ({ default: () => null }));
vi.mock('@/components/YearEndEventPopup', () => ({ default: () => null }));
vi.mock('@/components/CinematicRouteShell', () => ({
  default: ({ children }: { children?: ReactNode }) => children ?? null,
}));
vi.mock('@/components/metrics/VisitTracker', () => ({ default: () => null }));

async function renderLocaleLayout(locale: string): Promise<string> {
  const element = await LocaleLayout({
    children: <div>child</div>,
    params: Promise.resolve({ locale }),
  });
  return renderToStaticMarkup(element);
}

describe('locale llms.txt discovery link', () => {
  it.each(siteLocales)('renders a describedby link to the %s llms.txt manifest in markup', async (locale) => {
    const html = await renderLocaleLayout(locale);
    const describedByLinks = html.match(/<link\b[^>]*rel="describedby"[^>]*>/gu) ?? [];
    expect(describedByLinks).toHaveLength(1);
    const describedBy = describedByLinks[0];
    expect(describedBy).toBeDefined();
    expect(describedBy).toContain(`href="/${locale}/llms.txt"`);
  });

  it('does not claim a page-specific Markdown alternate that does not exist', async () => {
    const html = await renderLocaleLayout('en');
    expect(html).not.toMatch(/rel="alternate"[^>]*(?:markdown|\.md)/iu);
    expect(html).not.toMatch(/type="text\/markdown"/iu);
  });
});
