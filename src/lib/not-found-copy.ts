import type { Metadata } from 'next';
import type { SiteLocale } from '@/lib/locales';

export const notFoundCopyByLocale = {
  ko: {
    title: '페이지를 찾을 수 없습니다',
    description: '요청하신 주소가 변경되었거나 존재하지 않습니다.',
    home: '홈으로 돌아가기',
    contact: '상담 문의',
    brand: '법무법인 호정',
  },
  'zh-hant': {
    title: '找不到頁面',
    description: '您所查找的網址可能已變更或不存在。',
    home: '返回首頁',
    contact: '聯絡諮詢',
    brand: '昊鼎國際法律事務所',
  },
  en: {
    title: 'Page not found',
    description: 'The address may have changed or the requested page does not exist.',
    home: 'Return home',
    contact: 'Contact us',
    brand: 'Hovering International Law Firm',
  },
  ja: {
    title: 'ページが見つかりません',
    description: 'ご指定のアドレスは変更されたか、存在しない可能性があります。',
    home: 'ホームへ戻る',
    contact: 'お問い合わせ',
    brand: '昊鼎国際法律事務所',
  },
} as const;

export function buildLocalizedNotFoundMetadata(locale: SiteLocale): Metadata {
  const copy = notFoundCopyByLocale[locale];
  return {
    title: { absolute: `${copy.title} | ${copy.brand}` },
    robots: { index: false, follow: false },
  };
}
