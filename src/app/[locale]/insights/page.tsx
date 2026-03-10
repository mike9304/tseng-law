import { permanentRedirect } from 'next/navigation';
import { normalizeLocale, type Locale } from '@/lib/locales';

export default function InsightsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  permanentRedirect(`/${locale}/columns`);
}
