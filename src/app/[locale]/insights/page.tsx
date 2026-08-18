import { permanentRedirect } from 'next/navigation';
import { normalizeSiteLocale, type SiteLocale } from '@/lib/locales';

export default async function InsightsPage(props: { params: Promise<{ locale: SiteLocale }> }) {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  permanentRedirect(`/${locale}/columns`);
}
