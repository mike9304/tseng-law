import type { SiteLocale } from '@/lib/locales';

/**
 * Public credentials of the primary attorney (曾雋崴 / Wei Tseng).
 *
 * Every credential value below restates a sentence already published on the
 * firm's official attorney page {@link ATTORNEY_CREDENTIAL_SOURCE_URL}
 * (checked 2026-09-25):
 *
 *   「曾雋崴律師為台灣執業律師，…精通韓語、日語，通過最高等級韓國語能力測驗
 *     TOPIK 6 及日本語能力測驗 N1。」
 *   「為駐台北韓國代表部韓文法律服務參考名單律師，亦多次受韓國SBS新聞邀請
 *     就台灣法律議題提供意見…」
 *   「103臺北市大同區承德路一段35號7樓之2」
 *
 * Do not add awards, rankings, client names or case results here. Anything
 * that is not on the official page stays out.
 */
export const ATTORNEY_CREDENTIAL_SOURCE_URL = 'https://www.hoveringlaw.com.tw/zh/wei.html';

/** schema.org `gender` of the primary attorney (confirmed 2026-09-17). */
export const PRIMARY_ATTORNEY_GENDER = 'Female';

/**
 * BCP-47 tags for the attorney's working languages, used for JSON-LD
 * `knowsLanguage`. The visible pages keep their localized labels.
 */
export const PRIMARY_ATTORNEY_LANGUAGE_TAGS: readonly string[] = ['ko', 'zh-Hant', 'ja', 'en'];

export type AttorneyCredentialItem = {
  label: string;
  value: string;
};

export type AttorneyCredentialBlock = {
  heading: string;
  items: readonly AttorneyCredentialItem[];
  sourceLabel: string;
};

/**
 * Visible credential card, one per locale that has a verified wording.
 * Only zh-hant is published for now; other locales render nothing.
 */
export const attorneyCredentials: Partial<Record<SiteLocale, AttorneyCredentialBlock>> = {
  'zh-hant': {
    heading: '律師資格與語言能力',
    items: [
      { label: '律師', value: '曾雋崴律師，女性台灣執業律師（昊鼎國際法律事務所）' },
      { label: '韓語能力', value: '通過最高等級韓國語能力測驗 TOPIK 6' },
      { label: '日語能力', value: '通過日本語能力測驗 N1' },
      { label: '參考名單', value: '駐台北韓國代表部韓文法律服務參考名單律師' },
      { label: '媒體意見', value: '多次受韓國 SBS 新聞邀請，就台灣法律議題提供意見' },
      { label: '諮詢語言', value: '韓語、繁體中文、日語、英語' },
      { label: '事務所地址', value: '台北市大同區承德路一段35號7樓之2' },
    ],
    sourceLabel: '資料來源：昊鼎國際法律事務所官方律師頁面',
  },
};

export function getAttorneyCredentialBlock(locale: SiteLocale): AttorneyCredentialBlock | null {
  return attorneyCredentials[locale] ?? null;
}

type CredentialJsonLd = {
  '@type': 'EducationalOccupationalCredential';
  name: string;
  description: string;
  credentialCategory: string;
};

const credentialJsonLd: Partial<Record<SiteLocale, readonly CredentialJsonLd[]>> = {
  'zh-hant': [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'TOPIK 6',
      description: '韓國語能力測驗（TOPIK）最高等級',
      credentialCategory: 'certificate',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'JLPT N1',
      description: '日本語能力測驗 N1',
      credentialCategory: 'certificate',
    },
  ],
};

/** `hasCredential` entries for the Person JSON-LD, or `undefined` when the locale has none. */
export function getAttorneyCredentialJsonLd(locale: SiteLocale): CredentialJsonLd[] | undefined {
  const entries = credentialJsonLd[locale];
  return entries ? entries.map((entry) => ({ ...entry })) : undefined;
}
