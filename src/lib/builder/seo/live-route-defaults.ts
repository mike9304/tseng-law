import { legalPageContent } from '@/data/legal-pages';
import { pageCopy } from '@/data/page-copy';
import type { Locale } from '@/lib/locales';

export interface LiveRouteSeoDefault {
  readonly title: string;
  readonly description: string;
}

const HOME_SEO_COPY = {
  ko: {
    title: '대만 변호사·회사설립·소송',
    description:
      '대만 회사설립, 대만 소송, 대만 투자 법률 자문을 한국어와 일본어로 안내하는 법무법인 호정 공식 사이트입니다.',
  },
  'zh-hant': {
    title: '台灣律師・台灣訴訟・台灣公司設立',
    description:
      '昊鼎國際法律事務所提供台灣公司設立、投資法務、民刑事訴訟與跨境法律顧問服務，支援韓文、中文與英文溝通。',
  },
  en: {
    title: 'Taiwan Lawyer, Litigation & Company Setup',
    description:
      'Hovering International Law Firm advises on Taiwan company formation, litigation, and investment matters for Korean and international clients.',
  },
} as const satisfies Record<Locale, LiveRouteSeoDefault>;

function normalizeRouteSlug(slug: string): string {
  return slug.replace(/^\/+|\/+$/g, '');
}

export function resolveLiveRouteSeoDefault(
  locale: Locale,
  slug: string,
): LiveRouteSeoDefault | undefined {
  switch (normalizeRouteSlug(slug)) {
    case '':
      return HOME_SEO_COPY[locale];
    case 'about':
      return pageCopy[locale].about;
    case 'services':
      return pageCopy[locale].services;
    case 'lawyers':
      return pageCopy[locale].lawyers;
    case 'pricing':
      return pageCopy[locale].pricing;
    case 'faq':
      return pageCopy[locale].faq;
    case 'reviews':
      return pageCopy[locale].reviews;
    case 'columns':
      return pageCopy[locale].insights;
    case 'videos':
      return pageCopy[locale].videos;
    case 'contact':
      return pageCopy[locale].contact;
    case 'privacy':
      return legalPageContent[locale].privacy;
    case 'disclaimer':
      return legalPageContent[locale].disclaimer;
    default:
      return undefined;
  }
}
