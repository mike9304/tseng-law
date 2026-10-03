/**
 * Columns written by AI models (drafted, cross-reviewed and revised by AI
 * lanes; see the commit history of 019–040). They must not be bylined or
 * marked up as written or reviewed by the attorney. Keep this internal
 * provenance even though public author attribution is omitted.
 *
 * 001–017 are the attorney's own columns imported from the original site, and
 * 018 was published as an attorney-reviewed text, so they keep the attorney
 * byline.
 */
export const AI_AUTHORED_COLUMN_SLUGS: ReadonlySet<string> = new Set([
  'taiwan-accident-police-records',
  // 019–023: family columns (2026-09-27)
  'taiwanese-spouse-divorce-agreement-registration',
  'taiwanese-spouse-divorce-from-abroad',
  'taiwanese-spouse-divorce-cross-border-parenting',
  'marrying-taiwanese-national-registration-checklist',
  'baby-taiwan-nationality-birth-registration',
  // 024–031: overseas-reader set (2026-09-29)
  'taiwan-income-tax-residency',
  'taiwan-estate-tax-foreign-decedent',
  'foreign-heir-taiwan-succession-law-land',
  'taiwan-employment-gold-card',
  'taiwan-foreign-spouse-residence',
  'taiwan-permanent-residence-aprc',
  'enforce-foreign-judgment-in-taiwan',
  'hire-taiwan-lawyer-from-abroad',
  // 032–040: native en/ja/vi columns (2026-09-29)
  'taiwan-exit-ban-foreigners',
  'taiwan-police-questioning-foreigner-rights',
  'foreign-professional-dismissed-taiwan',
  'taiwan-unpaid-invoice-debt-collection',
  'taiwan-subsidiary-responsible-person-liability',
  'taiwan-subsidiary-employee-dismissal',
  'taiwan-bank-account-lending-fraud-money-laundering',
  'taiwan-migrant-worker-occupational-injury-compensation',
  'vietnamese-spouse-taiwan-residence-after-divorce-domestic-violence',
]);

/**
 * True for AI-written columns: frontmatter `author: legal-ai-assistant`
 * (posts carry `aiAuthored`), or a slug in the list above.
 */
export function isAiAuthoredColumn(
  slugOrPost: string | { slug: string; aiAuthored?: boolean } | undefined | null,
): boolean {
  if (!slugOrPost) return false;
  if (typeof slugOrPost === 'string') return AI_AUTHORED_COLUMN_SLUGS.has(slugOrPost);
  return slugOrPost.aiAuthored === true || AI_AUTHORED_COLUMN_SLUGS.has(slugOrPost.slug);
}

/** General-information notice retained independently of author attribution. */
const COLUMN_DISCLAIMER: Record<string, string> = {
  ko: '이 글은 일반적인 정보 제공을 위한 것이며, 개별 사안에 대한 법률 자문이 아닙니다.',
  en: 'This article provides general information and is not legal advice on any individual matter.',
  ja: 'この記事は一般的な情報提供を目的としたもので、個別の事案についての法的助言ではありません。',
  'zh-hant': '本文僅供一般資訊參考，並非針對個別案件的法律意見。',
  'zh-hans': '本文仅供一般信息参考，并非针对个案的法律意见。',
  vi: 'Bài viết này cung cấp thông tin chung, không phải là tư vấn pháp lý cho trường hợp cụ thể.',
  id: 'Artikel ini memberikan informasi umum dan bukan nasihat hukum untuk kasus tertentu.',
  th: 'บทความนี้ให้ข้อมูลทั่วไป และไม่ใช่คำแนะนำทางกฎหมายสำหรับกรณีเฉพาะ',
  fil: 'Ang artikulong ito ay nagbibigay ng pangkalahatang impormasyon at hindi ito legal na payo para sa isang partikular na kaso.',
};

export function getColumnDisclaimer(locale: string): string {
  return COLUMN_DISCLAIMER[locale] ?? COLUMN_DISCLAIMER.en;
}

/** Sidebar heading for the attorney card on AI-written columns (no review claim). */
export const AI_COLUMN_ATTORNEY_HEADING: Record<string, string> = {
  ko: '상담 변호사',
  'zh-hant': '諮詢律師',
  en: 'Consulting Attorney',
  ja: 'ご相談いただける弁護士',
};
