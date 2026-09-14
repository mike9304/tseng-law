import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({
  pathname: '/vi',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

import Header from '@/components/Header';
import { guidanceContent } from '@/data/international-guidance-content';

describe('Header guidance mobile-toggle aria-label', () => {
  it('uses the Vietnamese pack menuLabel as the toggle accessible name', () => {
    navigationState.pathname = '/vi';
    const html = renderToStaticMarkup(<Header locale="vi" />);
    const pack = guidanceContent.vi;
    const toggle = html.match(/<button\b[^>]*\bclass="[^"]*\bmobile-toggle\b[^"]*"[^>]*>/);

    expect(toggle?.[0]).toContain(`aria-label="${pack.menuLabel}"`);
    expect(toggle?.[0]).not.toContain('aria-label="Open menu"');
    expect(html).toContain(`href="#main">${pack.skipLink}</a>`);
    expect(html).not.toContain(`<span hidden>${pack.menuLabel}</span>`);
  });
});
