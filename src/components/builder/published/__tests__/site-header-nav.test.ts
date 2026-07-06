import { describe, expect, it } from 'vitest';
import {
  buildHeaderNavItems,
  getHeaderNavItemLabel,
} from '../SiteHeader';
import type { BuilderNavItem } from '@/lib/builder/site/types';

function navItem(id: string, href: string, ko: string): BuilderNavItem {
  return {
    id,
    pageId: `page-${id}`,
    href,
    label: { ko, 'zh-hant': ko, en: ko },
  };
}

describe('buildHeaderNavItems', () => {
  it('keeps standard page builder header labels aligned with the production header', () => {
    const navItems = [
      navItem('nav-home', '/ko', '홈'),
      navItem('nav-services', '/ko/services', '업무분야'),
      navItem('nav-lawyers', '/ko/lawyers', '호정 한국·대만 업무팀'),
      navItem('nav-pricing', '/ko/pricing', '비용안내'),
      navItem('nav-columns', '/ko/columns', '칼럼'),
      navItem('nav-videos', '/ko/videos', '미디어센터'),
      navItem('nav-reviews', '/ko/reviews', '고객후기'),
      navItem('nav-about', '/ko/about', '호정 소개'),
      navItem('nav-contact', '/ko/contact', '문의 및 연락처'),
      navItem('nav-faq', '/ko/faq', '자주 묻는 질문'),
      navItem('nav-custom-campaign', '/ko/custom-campaign', 'Custom campaign'),
    ];

    const labels = buildHeaderNavItems(navItems, 'ko', { canonicalStandardNav: true })
      .map((item) => getHeaderNavItemLabel(item, 'ko'));

    expect(labels).toEqual([
      '업무분야',
      '변호사소개',
      '비용안내',
      '호정칼럼',
      '미디어센터',
      '고객후기',
      'Custom campaign',
    ]);
  });

  it('uses production header order for standard pages even when saved navigation is stale', () => {
    const navItems = [
      navItem('nav-home', '/ko', '홈'),
      navItem('nav-services', '/ko/services', '업무분야'),
      navItem('nav-lawyers', '/ko/lawyers', '변호사소개'),
      navItem('nav-columns', '/ko/columns', '호정칼럼'),
      navItem('nav-videos', '/ko/videos', '미디어센터'),
      navItem('nav-pricing', '/ko/pricing', '비용안내'),
      navItem('nav-reviews', '/ko/reviews', '고객후기'),
    ];

    const labels = buildHeaderNavItems(navItems, 'ko', { canonicalStandardNav: true })
      .map((item) => getHeaderNavItemLabel(item, 'ko'));

    expect(labels).toEqual([
      '업무분야',
      '변호사소개',
      '비용안내',
      '호정칼럼',
      '미디어센터',
      '고객후기',
    ]);
  });
});

describe('buildHeaderNavItems editor derivation (canonicalStandardNav false)', () => {
  // Mirrors the saved builder nav model the Navigation drawer edits: home is
  // present, a standard item was renamed, and a custom item points at a
  // standard non-header slug ('/ko/contact') — the QA헤더 regression case.
  function savedNavModel() {
    return [
      navItem('nav-home', '/', '홈'),
      navItem('nav-services', '/ko/services', '내 업무'),
      navItem('nav-lawyers', '/ko/lawyers', '변호사소개'),
      navItem('nav-pricing', '/ko/pricing', '비용'),
      navItem('nav-columns', '/ko/columns', '칼럼'),
      navItem('nav-videos', '/ko/videos', '미디어'),
      navItem('nav-reviews', '/ko/reviews', '후기'),
      navItem('nav-qa-header', '/ko/contact', 'QA헤더'),
    ];
  }

  it('includes the custom nav item, filters home, and keeps standard items with saved labels in saved order', () => {
    const items = buildHeaderNavItems(savedNavModel(), 'ko', { canonicalStandardNav: false });

    expect(items.map((item) => item.href)).toEqual([
      '/ko/services',
      '/ko/lawyers',
      '/ko/pricing',
      '/ko/columns',
      '/ko/videos',
      '/ko/reviews',
      '/ko/contact',
    ]);
    expect(items.map((item) => getHeaderNavItemLabel(item, 'ko'))).toEqual([
      '내 업무',
      '변호사소개',
      '비용',
      '칼럼',
      '미디어',
      '후기',
      'QA헤더',
    ]);
  });

  it('filters a nav item whose href is the home path', () => {
    const items = buildHeaderNavItems(
      [navItem('nav-home', '/', '홈'), navItem('nav-services', '/ko/services', '업무분야')],
      'ko',
      { canonicalStandardNav: false },
    );

    // Home is never rendered as a top-level header link, even though standard
    // specs missing from the saved model are still appended by the header.
    expect(items.some((item) => item.source?.id === 'nav-home')).toBe(false);
    expect(items.map((item) => item.href)).not.toContain('/ko');
    expect(items.map((item) => item.href)).toContain('/ko/services');
  });

  it('renders custom/rename/reorder exactly as the canonical path hides them (regression proof)', () => {
    const editorItems = buildHeaderNavItems(savedNavModel(), 'ko', { canonicalStandardNav: false });
    const canonicalItems = buildHeaderNavItems(savedNavModel(), 'ko', { canonicalStandardNav: true });

    // Canonical editor-preview path dropped QA헤더 and overrode the renamed
    // services label — the W18/W19 gap. The editor-faithful path restores both.
    expect(canonicalItems.map((item) => getHeaderNavItemLabel(item, 'ko'))).not.toContain('QA헤더');
    expect(editorItems.map((item) => getHeaderNavItemLabel(item, 'ko'))).toContain('QA헤더');
    expect(getHeaderNavItemLabel(editorItems[0], 'ko')).toBe('내 업무');
    expect(getHeaderNavItemLabel(canonicalItems[0], 'ko')).toBe('업무분야');
  });
});
