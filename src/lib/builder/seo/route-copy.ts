import type { Locale } from '@/lib/locales';

export type SeoRouteErrorScope = 'page-seo' | 'seo-assistant';

export interface SeoRouteErrorCopy {
  pageNotFound: (pageId: string) => string;
  invalidJsonPayload: string;
  requestFailed: string;
}

const PAGE_SEO_REQUEST_FAILED: Record<Locale, string> = {
  ko: '페이지 SEO 요청을 처리하지 못했습니다.',
  'zh-hant': '無法處理頁面 SEO 請求。',
  en: 'Could not process the page SEO request.',
};

const SEO_ASSISTANT_REQUEST_FAILED: Record<Locale, string> = {
  ko: 'SEO 도우미 요청을 처리하지 못했습니다.',
  'zh-hant': '無法處理 SEO 助理請求。',
  en: 'Could not process the SEO assistant request.',
};

export function getSeoRouteErrorCopy(locale: Locale, scope: SeoRouteErrorScope): SeoRouteErrorCopy {
  const requestFailed = scope === 'seo-assistant'
    ? SEO_ASSISTANT_REQUEST_FAILED[locale]
    : PAGE_SEO_REQUEST_FAILED[locale];

  if (locale === 'zh-hant') {
    return {
      pageNotFound: (pageId) => `找不到頁面：${pageId}`,
      invalidJsonPayload: 'JSON 請求內容格式不正確。',
      requestFailed,
    };
  }

  if (locale === 'en') {
    return {
      pageNotFound: (pageId) => `Page not found: ${pageId}`,
      invalidJsonPayload: 'Invalid JSON payload.',
      requestFailed,
    };
  }

  return {
    pageNotFound: (pageId) => `페이지를 찾을 수 없습니다: ${pageId}`,
    invalidJsonPayload: 'JSON 요청 본문 형식이 올바르지 않습니다.',
    requestFailed,
  };
}
