import { pageCopy } from '@/data/page-copy';
import type { SiteLocale } from '@/lib/locales';

const legacyTeamTitles: Record<SiteLocale, readonly string[]> = {
  ko: ['호정 한국·대만 업무팀', '호정 대만·한국 팀'],
  'zh-hant': ['昊鼎 韓國·台灣 業務團隊', '昊鼎韓國台灣團隊'],
  en: ['Our Team', 'Hovering International Team'],
  ja: ['チーム紹介', '昊鼎国際チーム'],
};

/** Update only verified stock team labels; never rewrite custom CMS titles. */
export function projectTeamBreadcrumbLabel(locale: SiteLocale, slugPath: string, title: string): string {
  return slugPath === 'lawyers' && legacyTeamTitles[locale].includes(title)
    ? pageCopy[locale].lawyers.title
    : title;
}
