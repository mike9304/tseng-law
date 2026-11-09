import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({
  pathname: '/ko/columns',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

import Header from '@/components/Header';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import { getColumnMenuMegaLinks } from '@/lib/column-menu';

describe('consolidated columns navigation', () => {
  it.each(['ko', 'zh-hant', 'en', 'ja'] as const)(
    'removes standalone traffic/tax/criminal items from the %s header and renders category links in the insights mega panel',
    (locale) => {
      navigationState.pathname = `/${locale}/columns`;
      const html = renderToStaticMarkup(<Header locale={locale} />);
      expect(html).not.toMatch(
        new RegExp(`class="nav-link"[^>]*href="/${locale}/traffic-accidents"`),
      );
      expect(html).not.toMatch(
        new RegExp(`class="nav-link"[^>]*href="/${locale}/tax-accounting"`),
      );
      expect(html).not.toMatch(
        new RegExp(`class="nav-link"[^>]*href="/${locale}/criminal-litigation"`),
      );
      expect(html).toContain('data-panel="insights"');
      for (const link of getColumnMenuMegaLinks(locale)) {
        expect(html).toContain(`href="${link.href}"`);
      }
    },
  );

  it.each(['ko', 'zh-hant', 'en', 'ja'] as const)(
    'nests column category links under the %s columns item in the mobile drawer',
    (locale) => {
      navigationState.pathname = `/${locale}/columns`;
      const html = renderToStaticMarkup(
        <MobileNavDrawer open onClose={() => {}} locale={locale} onSearch={() => {}} />,
      );
      expect(html).toContain('drawer-nav-group');
      expect(html).toContain(`id="drawer-column-submenu-${locale}"`);
      expect(html).toContain('aria-expanded="true"');
      for (const link of getColumnMenuMegaLinks(locale)) {
        expect(html).toContain(`href="${link.href}"`);
      }
      const subnavStart = html.indexOf(`id="drawer-column-submenu-${locale}"`);
      const directionsIdx = html.indexOf('/contact');
      expect(subnavStart).toBeGreaterThan(-1);
      expect(directionsIdx).toBeGreaterThan(-1);
      expect(subnavStart).toBeLessThan(directionsIdx);
    },
  );
});
