import { pageCopy } from '@/data/page-copy';
import type { SiteLocale } from '@/lib/locales';

const legacyTeamTitles: Partial<Record<SiteLocale, string>> = {
  ko: '호정 한국·대만 업무팀',
  'zh-hant': '昊鼎 韓國·台灣 業務團隊',
};

/** Update only verified stock team labels; never rewrite custom CMS titles. */
export function projectTeamBreadcrumbLabel(locale: SiteLocale, slugPath: string, title: string): string {
  return slugPath === 'lawyers' && title === legacyTeamTitles[locale]
    ? pageCopy[locale].lawyers.title
    : title;
}
