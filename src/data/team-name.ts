import type { PublicLocale8 } from '@/lib/public-guidance';

/**
 * WO-O22 C: the team name is no longer the same "International Team" in every
 * language. Each language names the team it actually serves:
 *
 *   ko       — Taiwan · Korea team
 *   zh-hant  — Korea · Taiwan team, written in the traditional-Chinese house
 *              style used by `昊鼎國際團隊` (firm prefix, no separators)
 *   en       — English-language team
 *   ja       — Japanese-language team
 *   vi/id/th/fil — the international team. The guidance packs never translate
 *              `Hovering International Law Firm`, so the team name stays in the
 *              same untranslated brand form for those four languages too.
 *
 * Single source of truth: `teamContent` (team section heading) and
 * `pageCopy.lawyers` (page heading, breadcrumb label via
 * `projectTeamBreadcrumbLabel`, and the JSON-LD/SEO titles derived from it)
 * all read from here, so the name can never drift between surfaces.
 */
export const TEAM_NAME_BY_LOCALE: Record<PublicLocale8, string> = {
  ko: '호정 대만·한국 팀',
  'zh-hant': '昊鼎韓國台灣團隊',
  en: 'Hovering English Team',
  ja: '昊鼎日本語チーム',
  vi: 'Hovering International Team',
  id: 'Hovering International Team',
  th: 'Hovering International Team',
  fil: 'Hovering International Team',
};
