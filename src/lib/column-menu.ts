import { CRIMINAL_BOARD_LOCALES, CRIMINAL_BOARD_PATH, isCriminalBoardLocale } from '@/lib/criminal-litigation-board';
import { guidancePublicPath, isGuidanceLocale4, type PublicLocale8 } from '@/lib/public-guidance';
import { isSiteLocale, type SiteLocale } from '@/lib/locales';
import { TAX_ACCOUNTING_BOARD_PATH } from '@/lib/tax-accounting-board';

const SEMICONDUCTOR_GUIDE_PATH = '/semiconductor';

export const COLUMN_MENU_CATEGORY_ORDER = [
  'litigation',
  'criminal',
  'traffic',
  'family',
  'inheritance',
  'tax',
  'semiconductor',
  'company',
  'issues',
  'all',
] as const;

export type ColumnMenuCategoryId = (typeof COLUMN_MENU_CATEGORY_ORDER)[number];

export type ColumnMenuLink = {
  readonly id: ColumnMenuCategoryId;
  readonly label: string;
  readonly href: string;
};

type ColumnMenuUiLocale = SiteLocale;

const COLUMN_MENU_LABELS: Record<
  ColumnMenuUiLocale,
  Record<ColumnMenuCategoryId, string>
> = {
  ko: {
    litigation: '민사',
    criminal: '형사',
    traffic: '교통사고',
    family: '가정·이혼',
    inheritance: '상속',
    tax: '세무·회계',
    semiconductor: '반도체',
    company: '회사설립·투자',
    issues: '이슈 칼럼',
    all: '전체 칼럼',
  },
  'zh-hant': {
    litigation: '民事',
    criminal: '刑事',
    traffic: '交通事故',
    family: '家事・離婚',
    inheritance: '繼承',
    tax: '稅務會計',
    semiconductor: '半導體',
    company: '公司設立・投資',
    issues: '議題專欄',
    all: '全部專欄',
  },
  en: {
    litigation: 'Civil litigation',
    criminal: 'Criminal',
    traffic: 'Traffic accidents',
    family: 'Family and divorce',
    inheritance: 'Inheritance',
    tax: 'Tax and accounting',
    semiconductor: 'Semiconductors',
    company: 'Company setup and investment',
    issues: 'Issue columns',
    all: 'All columns',
  },
  ja: {
    litigation: '民事',
    criminal: '刑事',
    traffic: '交通事故',
    family: '家事・離婚',
    inheritance: '相続',
    tax: '税務・会計',
    semiconductor: '半導体',
    company: '会社設立・投資',
    issues: '注目コラム',
    all: 'すべてのコラム',
  },
};

/** Mirrors `src/content/issues/<locale>` directories (client-safe; no fs). */
const ISSUE_BOARD_LOCALES = new Set(['ko', 'zh-hant', 'en', 'ja', 'vi', 'es', 'fr']);

export function localeHasIssueBoard(locale: string): boolean {
  return ISSUE_BOARD_LOCALES.has(locale);
}

function menuUiLocale(locale: PublicLocale8): ColumnMenuUiLocale {
  return isSiteLocale(locale) ? locale : 'en';
}

function criminalHref(locale: PublicLocale8): string {
  if (isCriminalBoardLocale(locale)) {
    return `/${locale}${CRIMINAL_BOARD_PATH}`;
  }
  return `/${locale}/columns?topic=criminal`;
}

function categoryAvailable(locale: PublicLocale8, id: ColumnMenuCategoryId): boolean {
  if (id === 'traffic' || id === 'tax' || id === 'semiconductor') {
    return isSiteLocale(locale);
  }
  if (id === 'issues') {
    return localeHasIssueBoard(locale);
  }
  return true;
}

function categoryHref(locale: PublicLocale8, id: ColumnMenuCategoryId): string {
  const base = `/${locale}`;
  switch (id) {
    case 'litigation':
      return `${base}/columns?topic=litigation`;
    case 'criminal':
      return criminalHref(locale);
    case 'traffic':
      return `${base}/traffic-accidents`;
    case 'family':
      return `${base}/columns?topic=family`;
    case 'inheritance':
      return `${base}/columns?topic=inheritance`;
    case 'tax':
      return `${base}${TAX_ACCOUNTING_BOARD_PATH}`;
    case 'semiconductor':
      return `${base}${SEMICONDUCTOR_GUIDE_PATH}`;
    case 'company':
      return `${base}/columns?topic=company`;
    case 'issues':
      return `${base}/columns/issues`;
    case 'all':
      return `${base}/columns`;
    default:
      return `${base}/columns`;
  }
}

/** Primary nav item that opens the columns index (not issues or a single article). */
export function isPrimaryColumnsNavHref(href: string, locale: PublicLocale8): boolean {
  if (isGuidanceLocale4(locale)) {
    return href === guidancePublicPath(locale, 'columns');
  }
  const pathOnly = href.split('#')[0] ?? href;
  return pathOnly === `/${locale}/columns`;
}

/** Column category links for header mega menu, mobile drawer, and footer. */
export function getColumnMenuLinks(locale: PublicLocale8): ColumnMenuLink[] {
  const labels = COLUMN_MENU_LABELS[menuUiLocale(locale)];
  return COLUMN_MENU_CATEGORY_ORDER.filter((id) => categoryAvailable(locale, id)).map((id) => ({
    id,
    label: labels[id],
    href: categoryHref(locale, id),
  }));
}

export function getColumnMenuMegaLinks(locale: PublicLocale8): Array<{ label: string; href: string }> {
  return getColumnMenuLinks(locale)
    .filter((link) => link.id !== 'all')
    .map(({ label, href }) => ({ label, href }));
}

export function getColumnMenuFooterColumn(locale: PublicLocale8): {
  title: string;
  links: Array<{ label: string; href: string }>;
} | null {
  if (!isSiteLocale(locale) && !isGuidanceLocale4(locale)) {
    return null;
  }
  const links = getColumnMenuLinks(locale);
  if (links.length === 0) return null;
  const title =
    locale === 'ko'
      ? '칼럼 주제'
      : locale === 'zh-hant'
        ? '專欄主題'
        : locale === 'ja'
          ? 'コラムのテーマ'
          : locale === 'vi'
            ? 'Chủ đề chuyên mục'
            : locale === 'id'
              ? 'Topik kolom'
              : locale === 'th'
                ? 'หมวดคอลัมน์'
                : locale === 'fil'
                  ? 'Mga paksa ng column'
                  : 'Column topics';
  return { title, links: links.map(({ label, href }) => ({ label, href })) };
}

/** For tests: criminal board locales expose the dedicated route link. */
export const COLUMN_MENU_CRIMINAL_BOARD_LOCALES = CRIMINAL_BOARD_LOCALES;
