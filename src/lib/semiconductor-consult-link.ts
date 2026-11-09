import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import type { SiteLocale } from '@/lib/locales';
import { IS_STATIC_SITE } from '@/lib/static-site';

const SEMICONDUCTOR_MAILTO_SUBJECT_PREFIX: Record<SiteLocale, string> = {
  ko: '[반도체 산업 상담] ',
  'zh-hant': '[半導體產業諮詢] ',
  en: '[Semiconductor industry inquiry] ',
  ja: '[半導体産業のご相談] ',
};

/** Consult entry from the semiconductor board: contact form when dynamic, prefixed mailto on static. */
export function getSemiconductorBoardConsultHref(locale: SiteLocale): string {
  if (IS_STATIC_SITE) {
    return getConsultationPublicMailto(locale, {
      subjectPrefix: SEMICONDUCTOR_MAILTO_SUBJECT_PREFIX[locale],
    });
  }
  return `/${locale}/contact?topic=semiconductor`;
}

export function isSemiconductorBoardConsultMailto(href: string): boolean {
  return href.startsWith('mailto:');
}
