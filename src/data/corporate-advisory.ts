import type { SiteLocale } from '@/lib/locales';

export const CORPORATE_ADVISORY_ANCHOR = 'corporate-advisory';
export const CORPORATE_ADVISORY_PAGE_SLUG = 'taiwan-lawyer';

export type CorporateAdvisoryItem = {
  title: string;
  body: string;
};

export type CorporateAdvisoryRelatedLink = {
  path: string;
  label: string;
};

export type CorporateAdvisoryContent = {
  headline: string;
  summary: string;
  intro: string;
  body: string;
  items: readonly CorporateAdvisoryItem[];
  relatedHeading: string;
  relatedLinks: readonly CorporateAdvisoryRelatedLink[];
  initialEmail: string;
  languages: string;
  ctaLabel: string;
  sensitiveNote: string;
};

const corporateAdvisoryByLocale: Record<'en' | 'ja', CorporateAdvisoryContent> = {
  en: {
    headline: 'Taiwan Corporate Legal Advisory',
    summary:
      'Contract review, commercial legal-risk questions, and employment advice for overseas companies entering or operating in Taiwan.',
    intro:
      'We advise overseas businesses on Taiwan-related contract review, commercial legal risk, and employment matters.',
    body:
      'Tell us whether you need help with a particular matter or ongoing legal advice.',
    items: [
      {
        title: 'Contract review',
        body:
          'Outline the document, its connection to Taiwan, and the decision or negotiation you want to discuss.',
      },
      {
        title: 'Business risk',
        body:
          'Describe the planned transaction or business activity and the legal question you need to resolve.',
      },
      {
        title: 'Employment',
        body:
          'We advise on employment contracts and workplace questions in Taiwan. See our labor and employment page for more detail.',
      },
      {
        title: 'One-off or ongoing advisory',
        body:
          'Tell us whether you have a specific matter or need ongoing support. Our fees page describes the annual retainer; you can ask about scope and fees when you contact us.',
      },
    ],
    relatedHeading: 'Related pages',
    relatedLinks: [
      { path: 'pricing', label: 'Fees and annual retainer' },
      { path: 'services/labor', label: 'Labor and employment' },
      { path: 'services/ip', label: 'IP and financial disputes' },
      { path: 'taiwan-company-setup-lawyer', label: 'Taiwan company setup' },
      { path: 'taiwan-litigation-lawyer', label: 'Taiwan litigation' },
    ],
    initialEmail:
      'For the first email, send a brief overview of the Taiwan business, the current question, any deadline, your preferred language, and how we can reach you. A short summary is enough at this stage.',
    languages: 'English, Japanese, Korean, and Chinese are all supported.',
    ctaLabel: 'Email a brief summary of your Taiwan matter',
    sensitiveNote: 'Sensitive files should wait until the attorney gives instructions.',
  },
  ja: {
    headline: '台湾の企業法務・法律顧問',
    summary:
      '海外企業が台湾に進出・運営する際の契約確認、取引上の法的リスク、労務・雇用に関するご相談です。',
    intro:
      '海外企業の台湾に関する契約書の確認、取引上の法的リスク、雇用・労務についてご相談を受けています。',
    body:
      '個別の案件についてのご相談か、継続的な法律顧問をご希望かをお知らせください。',
    items: [
      {
        title: '契約書の確認',
        body:
          '対象の書類、台湾との関係、相談したい判断や交渉の内容をお知らせください。',
      },
      {
        title: '事業上のリスク',
        body:
          '予定する取引や事業活動と、確認したい法律上の問題をご説明ください。',
      },
      {
        title: '雇用・労務',
        body:
          '台湾の雇用契約や職場の問題について助言します。詳しくは労務・雇用の取扱ページをご覧ください。',
      },
      {
        title: '単発の相談と継続的な顧問',
        body:
          '特定の案件か、継続的な支援かをお知らせください。年間法律顧問は費用案内に記載しています。範囲や費用はお問い合わせ時にご質問いただけます。',
      },
    ],
    relatedHeading: '関連ページ',
    relatedLinks: [
      { path: 'pricing', label: '費用・年間法律顧問' },
      { path: 'services/labor', label: '労務・雇用' },
      { path: 'services/ip', label: '知的財産・金融紛争' },
      { path: 'taiwan-company-setup-lawyer', label: '台湾会社設立' },
      { path: 'taiwan-litigation-lawyer', label: '台湾訴訟' },
    ],
    initialEmail:
      '初回メールでは、台湾事業の簡潔な概要、現在の質問、期限があればその期限、希望言語、連絡先をお送りください。この段階では要約で十分です。',
    languages: '英語・日本語・韓国語・中国語のいずれでもご相談いただけます。',
    ctaLabel: '台湾の企業法務についてメールで相談',
    sensitiveNote: '機微な資料は、弁護士の指示があるまで送らないでください。',
  },
};

export function getCorporateAdvisory(locale: SiteLocale): CorporateAdvisoryContent | null {
  if (locale === 'en' || locale === 'ja') {
    return corporateAdvisoryByLocale[locale];
  }
  return null;
}

export function getCorporateAdvisoryHref(locale: SiteLocale): string | null {
  if (!getCorporateAdvisory(locale)) {
    return null;
  }
  return `/${locale}/${CORPORATE_ADVISORY_PAGE_SLUG}#${CORPORATE_ADVISORY_ANCHOR}`;
}
