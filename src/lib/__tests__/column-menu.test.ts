import { describe, expect, it } from 'vitest';
import boardColumns from '@/data/semiconductor-board-columns.json';
import {
  COLUMN_MENU_CATEGORY_ORDER,
  getColumnMenuLinks,
  getColumnMenuMegaLinks,
  localeHasIssueBoard,
} from '@/lib/column-menu';

describe('column menu categories', () => {
  const siteLocales = ['ko', 'zh-hant', 'en', 'ja'] as const;

  it.each(siteLocales)('%s exposes topic boards in the insights mega menu', (locale) => {
    const mega = getColumnMenuMegaLinks(locale);
    expect(mega.some((link) => link.href.includes('/traffic-accidents'))).toBe(true);
    expect(mega.some((link) => link.href.includes('/tax-accounting'))).toBe(true);
    expect(mega.some((link) => link.href.includes('/semiconductor'))).toBe(true);
    expect(mega.some((link) => link.href.includes('topic=litigation'))).toBe(true);
  });

  it.each(siteLocales)('%s routes criminal to the dedicated board', (locale) => {
    const criminal = getColumnMenuLinks(locale).find((link) => link.id === 'criminal');
    expect(criminal?.href).toBe(`/${locale}/criminal-litigation`);
  });

  it('routes vi criminal to the dedicated board and lists issues when present', () => {
    const links = getColumnMenuLinks('vi');
    expect(links.find((link) => link.id === 'criminal')?.href).toBe('/vi/criminal-litigation');
    if (localeHasIssueBoard('vi')) {
      expect(links.some((link) => link.id === 'issues')).toBe(true);
    }
    expect(links.some((link) => link.href.includes('/traffic-accidents'))).toBe(false);
    expect(links.some((link) => link.href.includes('/semiconductor'))).toBe(false);
  });

  it('keeps a stable category order', () => {
    for (const locale of siteLocales) {
      const ids = getColumnMenuLinks(locale).map((link) => link.id);
      expect(ids).toEqual(
        COLUMN_MENU_CATEGORY_ORDER.filter((id) => ids.includes(id)),
      );
    }
  });

  it('does not reference semiconductor board slugs in the nav module', () => {
    const slugs = Object.values(boardColumns).flat();
    expect(slugs.length).toBeGreaterThan(0);
    expect(getColumnMenuMegaLinks('ko').some((link) => slugs.some((slug) => link.href.includes(slug)))).toBe(false);
  });
});
