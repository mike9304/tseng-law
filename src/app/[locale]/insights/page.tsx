import { permanentRedirect } from 'next/navigation';
import { normalizeSiteLocale, type SiteLocale } from '@/lib/locales';

export default function InsightsPage({ params }: { params: { locale: SiteLocale } }) {
  const locale = normalizeSiteLocale(params.locale);
  permanentRedirect(`/${locale}/columns`);
}
