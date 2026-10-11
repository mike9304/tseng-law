import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({
  pathname: '/vi',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

import Header from '@/components/Header';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import ScrollTopButton from '@/components/ScrollTopButton';
import { guidanceContent } from '@/data/international-guidance-content';

describe('Header guidance mobile-toggle aria-label', () => {
  it('uses a Vietnamese open-menu action as the toggle accessible name', () => {
    navigationState.pathname = '/vi';
    const html = renderToStaticMarkup(<Header locale="vi" />);
    const pack = guidanceContent.vi;
    const toggle = html.match(/<button\b[^>]*\bclass="[^"]*\bmobile-toggle\b[^"]*"[^>]*>/);

    expect(toggle?.[0]).toContain('aria-label="Mở trình đơn"');
    expect(toggle?.[0]).not.toContain('aria-label="Open menu"');
    expect(html).toContain(`href="#main">${pack.skipLink}</a>`);
    expect(html).not.toContain(`<span hidden>${pack.menuLabel}</span>`);
  });

  it('marks the same services link current on the public path and the rewrite', () => {
    navigationState.pathname = '/vi/services';
    const browser = renderToStaticMarkup(<Header locale="vi" />);
    navigationState.pathname = '/vi/__public-guidance/services';
    const rewritten = renderToStaticMarkup(<Header locale="vi" />);
    expect(rewritten).toBe(browser);
    expect(browser).toContain('aria-current="page" href="/vi/services"');
  });

  it('localizes the open drawer and back-to-top accessible names', () => {
    navigationState.pathname = '/vi';
    const drawer = renderToStaticMarkup(<MobileNavDrawer open onClose={() => {}} onSearch={() => {}} locale="vi" />);
    expect(drawer).toContain('aria-label="Trình đơn trên điện thoại"');
    expect(drawer).toContain('aria-label="Điều hướng chính"');
    expect(drawer).toContain('aria-label="Đóng trình đơn"');
    expect(drawer).not.toMatch(/aria-label="(?:Mobile menu|Mobile main menu|Close)"/);
    const scrollTop = renderToStaticMarkup(<ScrollTopButton locale="vi" />);
    expect(scrollTop).toContain('aria-label="Về đầu trang"');
    expect(renderToStaticMarkup(<ScrollTopButton locale="en" />)).toContain('aria-label="Back to top"');
  });
});
