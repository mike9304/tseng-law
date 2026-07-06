import type { Locale } from '@/lib/locales';

/**
 * Deterministic date/time formatting that does not depend on the host's ICU data.
 *
 * `Date#toLocaleString` resolves differently between Node.js builds that ship
 * small ICU (e.g. the default Linux/CI Node binaries) and browsers, which
 * triggers React hydration mismatches whenever a server-rendered timestamp
 * reaches the client. These helpers build the formatted string from
 * `Date` getters so the output is byte-identical on server and client.
 */

type AmPm = 'AM' | 'PM';

interface LocaleStrings {
  readonly am: string;
  readonly pm: string;
  readonly dateSeparator: '/' | '.';
  readonly trailingDateSeparator: boolean;
  readonly yearFirst: boolean;
  readonly timeLeadingZero: boolean;
  readonly datePattern: 'YMD' | 'MDY' | 'DMY';
  /** true = "AM 5:47:10" (ko, zh-Hant), false = "5:47:10 AM" (en) */
  readonly ampmBeforeTime: boolean;
}

const LOCALE_STRINGS: Record<Locale, LocaleStrings> = {
  ko: {
    am: '오전',
    pm: '오후',
    dateSeparator: '.',
    trailingDateSeparator: true,
    yearFirst: true,
    timeLeadingZero: false,
    datePattern: 'YMD',
    ampmBeforeTime: true,
  },
  'zh-hant': {
    am: '上午',
    pm: '下午',
    dateSeparator: '/',
    trailingDateSeparator: false,
    yearFirst: true,
    timeLeadingZero: false,
    datePattern: 'YMD',
    ampmBeforeTime: true,
  },
  en: {
    am: 'AM',
    pm: 'PM',
    dateSeparator: '/',
    trailingDateSeparator: false,
    yearFirst: false,
    timeLeadingZero: false,
    datePattern: 'MDY',
    ampmBeforeTime: false,
  },
};

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatDateString(d: Date, ls: LocaleStrings): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const sep = ls.dateSeparator;
  const fields: Record<'YMD' | 'MDY' | 'DMY', string> = {
    YMD: ls.trailingDateSeparator ? `${y}${sep} ${m}${sep} ${day}${sep}` : `${y}${sep}${m}${sep}${day}`,
    MDY: `${m}${sep}${day}${sep}${y}`,
    DMY: `${day}${sep}${m}${sep}${y}`,
  };
  return fields[ls.datePattern];
}

function splitAmPm(d: Date): { ampm: AmPm; hour12: number } {
  const h24 = d.getHours();
  const ampm: AmPm = h24 < 12 ? 'AM' : 'PM';
  let hour12 = h24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { ampm, hour12 };
}

function formatTimeString(d: Date, ls: LocaleStrings, includeSeconds: boolean): string {
  const { ampm, hour12 } = splitAmPm(d);
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const label = ampm === 'AM' ? ls.am : ls.pm;
  const hourPart = ls.timeLeadingZero ? pad2(hour12) : String(hour12);
  const minutePart = pad2(minutes);
  const base = includeSeconds
    ? `${hourPart}:${minutePart}:${pad2(seconds)}`
    : `${hourPart}:${minutePart}`;
  // ko/zh-Hant place the label before the time ("오전 5:47:10"); English places
  // it after ("5:47:10 AM"). Matches Chrome toLocaleTimeString for each locale.
  return ls.ampmBeforeTime ? `${label} ${base}` : `${base} ${label}`;
}

function toDate(value: string | number | Date): Date | null {
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Format a date+time the way `Date#toLocaleString` would for the given locale,
 * but without depending on the host ICU build. Output matches Chrome's
 * `toLocaleString('ko-KR'|'zh-TW'|'en-US')` for the same instant.
 *
 * Examples:
 *   ko:        "2026. 6. 21. 오전 5:47:10"
 *   zh-hant:   "2026/6/21 上午 5:47:10"
 *   en:        "6/21/2026, 5:47:10 AM"
 */
export function formatDateTime(iso: string | number | Date, locale: Locale): string {
  const d = toDate(iso);
  if (!d) return typeof iso === 'string' ? iso : String(iso ?? '');
  const ls = LOCALE_STRINGS[locale] ?? LOCALE_STRINGS.en;
  const date = formatDateString(d, ls);
  const time = formatTimeString(d, ls, true);
  // English uses ", " between date and time; ko/zh use a single space.
  return locale === 'en' ? `${date}, ${time}` : `${date} ${time}`;
}

/**
 * Format only the time portion, mirroring `toLocaleTimeString`.
 *
 * Examples:
 *   ko:        "오전 5:47:10"
 *   zh-hant:   "上午 5:47:10"
 *   en:        "5:47:10 AM"
 */
export function formatTime(iso: string | number | Date, locale: Locale): string {
  const d = toDate(iso);
  if (!d) return typeof iso === 'string' ? iso : String(iso ?? '');
  const ls = LOCALE_STRINGS[locale] ?? LOCALE_STRINGS.en;
  return formatTimeString(d, ls, true);
}

/**
 * Format only the date portion, mirroring `toLocaleDateString`.
 *
 * Examples:
 *   ko:        "2026. 6. 21."
 *   zh-hant:   "2026/6/21"
 *   en:        "6/21/2026"
 */
export function formatDate(iso: string | number | Date, locale: Locale): string {
  const d = toDate(iso);
  if (!d) return typeof iso === 'string' ? iso : String(iso ?? '');
  const ls = LOCALE_STRINGS[locale] ?? LOCALE_STRINGS.en;
  return formatDateString(d, ls);
}
