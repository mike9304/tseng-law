import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { listLightboxes } from '@/lib/builder/site/persistence';
import LightboxListView from '@/components/builder/lightbox/LightboxListView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Lightbox Admin',
  robots: { index: false, follow: false },
};

export default async function LightboxAdminListPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const locale = normalizeLocale(params.locale);
  const lightboxes = await listLightboxes('default', locale);
  return <LightboxListView locale={locale} initialLightboxes={lightboxes} />;
}
