import { isSiteLocale, siteLocales } from '@/lib/locales';
import {
  LLMS_TXT_CACHE_CONTROL,
  buildGuidanceLlmsTxt,
  buildLocaleLlmsTxt,
} from '@/lib/llms-txt';
import {
  GUIDANCE_LOCALES_4,
  isGuidanceLocale4,
  type PublicLocale8,
} from '@/lib/public-guidance';

export const dynamic = 'force-static';
export const dynamicParams = false;

const contentLanguage: Record<PublicLocale8, string> = {
  ko: 'ko',
  'zh-hant': 'zh-Hant',
  en: 'en',
  ja: 'ja',
  vi: 'vi',
  id: 'id',
  th: 'th',
  fil: 'fil',
};

// `dynamicParams = false`, so every locale that GET can answer must be listed
// here: the existing four plus the guidance four (vi/id/th/fil).
export function generateStaticParams() {
  return [...siteLocales, ...GUIDANCE_LOCALES_4].map((locale) => ({ locale }));
}

function llmsTxtResponse(body: string, locale: PublicLocale8): Response {
  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'content-language': contentLanguage[locale],
      'cache-control': LLMS_TXT_CACHE_CONTROL,
      'x-content-type-options': 'nosniff',
    },
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  const { locale } = await context.params;

  if (isSiteLocale(locale)) {
    return llmsTxtResponse(buildLocaleLlmsTxt(locale), locale);
  }

  // Guidance four (vi/id/th/fil): a reading catalog of the ten guidance pages.
  // Consultation languages are never widened by this route — the body itself
  // states, in the page language, that consultations run in EN/ZH/JA/KO only.
  if (isGuidanceLocale4(locale)) {
    return llmsTxtResponse(buildGuidanceLlmsTxt(locale), locale);
  }

  return new Response('Not Found\n', {
    status: 404,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'x-content-type-options': 'nosniff',
    },
  });
}
