import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { listLightboxes } from '@/lib/builder/site/persistence';
import LightboxListView from '@/components/builder/lightbox/LightboxListView';

export const dynamic = 'force-dynamic';

function getLightboxAdminMetadata(locale: Locale): Metadata {
  return {
    title: locale === 'ko' ? '라이트박스 관리자' : locale === 'zh-hant' ? '燈箱管理員' : 'Lightbox Admin',
    robots: { index: false, follow: false },
  };
}

export default async function LightboxAdminListPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const locale = normalizeLocale(params.locale);
  const lightboxes = await listLightboxes('default', locale);
  return <LightboxListView locale={locale} initialLightboxes={lightboxes} />;
}

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  return getLightboxAdminMetadata(normalizeLocale(params.locale));
}
