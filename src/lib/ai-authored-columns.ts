/**
 * Columns written by AI models (drafted, cross-reviewed and revised by AI
 * lanes; see the commit history of 019–040). They must not be bylined or
 * marked up as written or reviewed by the attorney. Instead they carry the
 * "Legal AI Assistant" author box at the end of the article.
 *
 * 001–017 are the attorney's own columns imported from the original site, and
 * 018 was published as an attorney-reviewed text, so they keep the attorney
 * byline.
 */
export const AI_AUTHORED_COLUMN_SLUGS: ReadonlySet<string> = new Set([
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

export function isAiAuthoredColumn(slug: string | undefined | null): boolean {
  return Boolean(slug) && AI_AUTHORED_COLUMN_SLUGS.has(slug as string);
}

export const LEGAL_AI_ASSISTANT_AVATAR = '/images/authors/legal-ai-assistant.webp';

type AiAuthorCopy = { label: string; heading: string; note: string };

const AI_AUTHOR_COPY: Record<string, AiAuthorCopy> = {
  ko: {
    label: '법률 AI 어시스턴트',
    heading: '작성',
    note: '이 글은 일반적인 정보를 드리기 위해 AI 어시스턴트가 작성했으며, 개별 사안에 대한 법률 자문이 아닙니다.',
  },
  en: {
    label: 'Legal AI Assistant',
    heading: 'Written by',
    note: 'This article was prepared by an AI assistant for general information and is not legal advice on any individual matter.',
  },
  ja: {
    label: '法律AIアシスタント',
    heading: '執筆',
    note: 'この記事は一般的な情報提供を目的としてAIアシスタントが作成したもので、個別の事案についての法的助言ではありません。',
  },
  'zh-hant': {
    label: '法律AI助理',
    heading: '撰文',
    note: '本文由AI助理撰寫，僅供一般資訊參考，並非針對個別案件的法律意見。',
  },
  'zh-hans': {
    label: '法律AI助手',
    heading: '撰文',
    note: '本文由AI助手撰写，仅供一般信息参考，并非针对个案的法律意见。',
  },
  vi: {
    label: 'Trợ lý AI pháp lý',
    heading: 'Tác giả',
    note: 'Bài viết này do trợ lý AI soạn để cung cấp thông tin chung, không phải là tư vấn pháp lý cho trường hợp cụ thể.',
  },
  id: {
    label: 'Asisten AI Hukum',
    heading: 'Penulis',
    note: 'Artikel ini disusun oleh asisten AI sebagai informasi umum dan bukan nasihat hukum untuk kasus tertentu.',
  },
  th: {
    label: 'ผู้ช่วย AI ด้านกฎหมาย',
    heading: 'ผู้เขียน',
    note: 'บทความนี้จัดทำโดยผู้ช่วย AI เพื่อให้ข้อมูลทั่วไป และไม่ใช่คำแนะนำทางกฎหมายสำหรับกรณีเฉพาะ',
  },
  fil: {
    label: 'Legal AI Assistant',
    heading: 'Isinulat ng',
    note: 'Inihanda ng isang AI assistant ang artikulong ito bilang pangkalahatang impormasyon at hindi ito legal na payo para sa isang partikular na kaso.',
  },
};

/** Localized author copy; falls back to English for locales without a translation. */
export function getAiAuthorCopy(locale: string): AiAuthorCopy {
  return AI_AUTHOR_COPY[locale] ?? AI_AUTHOR_COPY.en;
}

/** Sidebar heading for the attorney card on AI-written columns (no review claim). */
export const AI_COLUMN_ATTORNEY_HEADING: Record<string, string> = {
  ko: '상담 변호사',
  'zh-hant': '諮詢律師',
  en: 'Consulting Attorney',
  ja: 'ご相談いただける弁護士',
};

/** schema.org author entity for AI-written columns (not a Person, no attorney review). */
export function buildAiAuthorJsonLd(locale: string) {
  const copy = getAiAuthorCopy(locale);
  return {
    '@type': 'Organization',
    name: copy.label,
    description: copy.note,
  };
}
