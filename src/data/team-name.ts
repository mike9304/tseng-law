import type { PublicLocale8 } from '@/lib/public-guidance';

/**
 * WO-O22 C: the team name is no longer the same "International Team" in every
 * language. Each language names the team it actually serves:
 *
 *   ko       — Taiwan · Korea team
 *   zh-hant  — Korea · Taiwan team, written in the traditional-Chinese house
 *              style used by `昊鼎國際團隊` (firm prefix, no separators)
 *   en       — "Our Team", matching the EN nav label (WO-X1 EN-12)
 *   ja       — 「チーム紹介」, matching the JA nav label (WO-X1 J04)
 *   vi/id/th/fil/ar — the international team. The guidance packs never
 *              translate `Hovering International Law Firm`, so the team name
 *              stays in the same untranslated brand form for those guidance
 *              languages too, Arabic included.
 *
 * Single source of truth: `teamContent` (team section heading) and
 * `pageCopy.lawyers` (page heading, breadcrumb label via
 * `projectTeamBreadcrumbLabel`, and the JSON-LD/SEO titles derived from it)
 * all read from here, so the name can never drift between surfaces.
 */
export const TEAM_NAME_BY_LOCALE: Record<PublicLocale8, string> = {
  ko: '호정 대만·한국 팀',
  'zh-hant': '昊鼎韓國台灣團隊',
  en: 'Our Team',
  ja: 'チーム紹介',
  vi: 'Hovering International Team',
  id: 'Hovering International Team',
  th: 'Hovering International Team',
  fil: 'Hovering International Team',
  ar: 'Hovering International Team',
  de: 'Hovering International Team',
  es: 'Hovering International Team',
  fr: 'Hovering International Team',
  pt: 'Hovering International Team',
  'zh-hans': 'Hovering International Team',
  ms: 'Hovering International Team',
  ru: 'Hovering International Team',
  tr: 'Hovering International Team',
  it: 'Hovering International Team',
  nl: 'Hovering International Team',
  pl: 'Hovering International Team',
  hi: 'Hovering International Team',
  sv: 'Hovering International Team',
  da: 'Hovering International Team',
  nb: 'Hovering International Team',
  fi: 'Hovering International Team',
  cs: 'Tchajwansko-korejský tým Hovering',
  hu: 'A Hovering tajvani–koreai csapata',
  ro: 'Echipa Taiwan–Coreea a Hovering',
  uk: 'Тайвансько-корейська команда Hovering',
  el: 'Η ομάδα Ταϊβάν–Κορέας της Hovering',
  he: 'צוות טאיוואן–קוריאה של Hovering',
  bn: 'Hovering International Team',
  ur: 'Hovering کی بین الاقوامی ٹیم',
  fa: 'تیم بین‌المللی Hovering',
  my: 'Hovering International Team',
  ta: 'Hovering பன்னாட்டுக் குழு',
  ne: 'Hovering International Team',
  km: 'Hovering International Team',
  mn: 'Hovering International Team',
  sk: 'Taiwansko-kórejský tím Hovering',
  bg: 'Международен екип Hovering',
  hr: 'Tajvansko-korejski tim Hovering',
  sr: 'Tajvansko-korejski tim Hovering',
  sl: 'Tajvansko-korejska ekipa Hovering',
  lt: 'Hovering Taivano ir Korėjos komanda',
  lv: 'Hovering Taivānas–Korejas komanda',
  et: 'Hoveringi Taiwani–Korea meeskond',
  ca: 'Hovering International Team',
  is: 'Hovering International Team',
};
