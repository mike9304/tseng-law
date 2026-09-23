import { getColumnPost, type ColumnPost } from '@/lib/columns';
import type { SiteLocale } from '@/lib/locales';

/** Lawyer-reviewed semiconductor columns that may appear on the public board. */
export const PUBLIC_SEMICONDUCTOR_COLUMN_SLUGS = [
  'taiwan-semiconductor-market-entry',
] as const;

export const UNPUBLISHED_SEMICONDUCTOR_COLUMN_SLUGS = [
  'taiwan-semiconductor-unpaid-invoices',
  'taiwan-semiconductor-supply-contract-checklist',
] as const;

export const SEMICONDUCTOR_GUIDE_PATH = '/semiconductor';

export function listPublicSemiconductorColumns(locale: SiteLocale): ColumnPost[] {
  return PUBLIC_SEMICONDUCTOR_COLUMN_SLUGS.map((slug) => getColumnPost(slug, locale)).filter(
    (post): post is ColumnPost => Boolean(post),
  );
}

export const semiconductorGuideCopy: Record<
  SiteLocale,
  {
    kicker: string;
    title: string;
    description: string;
    columnsHeading: string;
    topicLabel: string;
    readMore: string;
    landingLabel: string;
    landingHref: string;
    contactTitle: string;
    contactText: string;
    contactBtn: string;
    emailBtn: string;
    metaTitle: string;
  }
> = {
  ko: {
    kicker: '반도체 기업 실무가이드',
    title: '대만과 거래하는 반도체 기업을 위한 법무 안내',
    description:
      '대만에 진출하려는 소재·부품·장비 기업을 위한 실무가이드입니다. 변호사 검토를 마친 글만 공개합니다.',
    columnsHeading: '공개 칼럼',
    topicLabel: '대만 진출·인력',
    readMore: '칼럼 보기 →',
    landingLabel: '반도체 공급사 법무 안내',
    landingHref: '/taiwan-semiconductor-supplier-legal',
    contactTitle: '기업 상담 요청',
    contactText:
      '초기 문의에는 회사명, 본사 소재국, 상대방 회사명, 비기밀 개요, 희망 상담 언어만 적어 주세요. 기밀자료는 이해충돌 확인 후 별도 전달합니다.',
    contactBtn: '공식 문의 페이지',
    emailBtn: '이메일 상담',
    metaTitle: '반도체 기업 실무가이드 | 대만 진출 구조',
  },
  'zh-hant': {
    kicker: '半導體企業實務指南',
    title: '與台灣交易的半導體企業法務指引',
    description: '供規劃進入台灣市場的材料、零組件及設備企業使用。僅公開已經律師審閱的文章。',
    columnsHeading: '公開專欄',
    topicLabel: '台灣市場進入與人力',
    readMore: '閱讀專欄 →',
    landingLabel: '半導體供應商法務說明',
    landingHref: '/taiwan-semiconductor-supplier-legal',
    contactTitle: '企業諮詢',
    contactText: '初次聯繫請提供公司名稱、總公司所在國家、相對人公司名稱、非機密概要及希望使用的諮詢語言。機密資料請於利益衝突確認後再行傳送。',
    contactBtn: '正式聯繫頁面',
    emailBtn: '電子郵件諮詢',
    metaTitle: '半導體企業實務指南 | 進入台灣市場架構',
  },
  en: {
    kicker: 'Semiconductor practice guide',
    title: 'Legal guidance for semiconductor companies dealing with Taiwan',
    description:
      'A practice guide for materials, components, and equipment companies planning Taiwan entry. Only lawyer-reviewed articles are published.',
    columnsHeading: 'Published columns',
    topicLabel: 'Taiwan entry and staffing',
    readMore: 'Open column →',
    landingLabel: 'Semiconductor supplier legal overview',
    landingHref: '/taiwan-semiconductor-supplier-legal',
    contactTitle: 'Business consultation',
    contactText:
      'In the first inquiry, send the company name, head-office country, counterparty name, a non-confidential outline, and the preferred consultation language. Send confidential materials only after a conflict check.',
    contactBtn: 'Contact page',
    emailBtn: 'Email consultation',
    metaTitle: 'Taiwan Semiconductor Market-Entry Guide',
  },
  ja: {
    kicker: '半導体企業実務ガイド',
    title: '台湾と取引する半導体企業向けの法務案内',
    description:
      '台湾進出を検討する材料・部品・装置企業向けの実務ガイドです。弁護士が確認した記事のみ公開しています。',
    columnsHeading: '公開コラム',
    topicLabel: '台湾進出・人材',
    readMore: 'コラムを読む →',
    landingLabel: '半導体サプライヤー法務案内',
    landingHref: '/taiwan-semiconductor-supplier-legal',
    contactTitle: '企業向け相談',
    contactText:
      '初回のお問い合わせでは、会社名、本社所在国、相手方会社名、非機密の概要、希望する相談言語をお知らせください。機密資料は利益相反確認後に別途ご送付ください。',
    contactBtn: '公式お問い合わせ',
    emailBtn: 'メール相談',
    metaTitle: '半導体企業実務ガイド | 台湾進出スキームの設計',
  },
};
