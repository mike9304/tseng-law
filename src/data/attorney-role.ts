import type { Locale } from '@/lib/locales';

/** Confirmed by the user: Wei Tseng is a partner (2026-09-30); zh-hant shows 主持律師 by user request (2026-10-01). */
export const TSENG_PARTNER_TITLE: Record<Locale, string> = {
  ko: '파트너 변호사',
  'zh-hant': '主持律師',
  en: 'Partner',
};

const legacyTitles: Record<Locale, readonly string[]> = {
  ko: ['대표 변호사', '대만 변호사 · 대표 변호사'],
  'zh-hant': ['代表律師', '合夥律師', '台灣律師 · 代表律師', '台灣律師 · 合夥律師'],
  en: ['Managing Attorney', 'Taiwan Attorney · Managing Attorney'],
};

/** Migrate known stock titles only; retain custom CMS descriptions. */
export function projectTsengPartnerRole(locale: Locale, role: string): string {
  if (!legacyTitles[locale].includes(role)) return role;
  return role.includes(' · ')
    ? `${role.split(' · ')[0]} · ${TSENG_PARTNER_TITLE[locale]}`
    : TSENG_PARTNER_TITLE[locale];
}
