import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { listRedirects } from '@/lib/builder/site/redirects';
import RedirectsListView from '@/components/builder/seo/RedirectsListView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'SEO — Redirect Rules',
  robots: { index: false, follow: false },
};

export default async function RedirectsAdminPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const locale = normalizeLocale(params.locale);
  const redirects = await listRedirects('default', locale);
  return <RedirectsListView locale={locale} initialRedirects={redirects} />;
}
