import { isSiteLocale, siteLocales, type SiteLocale } from '@/lib/locales';
import {
  LLMS_TXT_CACHE_CONTROL,
  buildLocaleLlmsTxt,
} from '@/lib/llms-txt';

export const dynamic = 'force-static';
export const dynamicParams = false;

const contentLanguage: Record<SiteLocale, string> = {
  ko: 'ko',
  'zh-hant': 'zh-Hant',
  en: 'en',
  ja: 'ja',
};

export function generateStaticParams() {
  return siteLocales.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  const { locale } = await context.params;
  if (!isSiteLocale(locale)) {
    return new Response('Not Found\n', {
      status: 404,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'x-content-type-options': 'nosniff',
      },
    });
  }

  return new Response(buildLocaleLlmsTxt(locale), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'content-language': contentLanguage[locale],
      'cache-control': LLMS_TXT_CACHE_CONTROL,
      'x-content-type-options': 'nosniff',
    },
  });
}
