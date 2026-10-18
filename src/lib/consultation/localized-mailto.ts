import { isSiteLocale, type SiteLocale } from '@/lib/locales';
import type { GuidanceLocale4 as GuidanceLocale } from '@/lib/public-guidance';
import { GUIDANCE_CONSULTATION_EMAIL_TEMPLATES } from './guidance-contact-templates';
import { getConsultationPublicEmail, getConsultationPublicMailto } from './public-contact';

/** Shared by server-rendered pages and the static site's client email CTA. */
export function getLocalizedConsultationMailto(locale: SiteLocale | GuidanceLocale): string {
  if (isSiteLocale(locale)) return getConsultationPublicMailto(locale);
  const { subject, body } = GUIDANCE_CONSULTATION_EMAIL_TEMPLATES[locale];
  return `mailto:${getConsultationPublicEmail()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
