import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { listRedirects } from '@/lib/builder/site/redirects';
import RedirectsListView from '@/components/builder/seo/RedirectsListView';
import { getRedirectManagerCopy } from '@/components/builder/seo/redirect-manager-copy';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const copy = getRedirectManagerCopy(locale);
  return {
    title: copy.title,
    robots: { index: false, follow: false },
  };
}

export default async function RedirectsAdminPage(
  props: {
    params: Promise<{ locale: Locale }>;
  }
) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const redirects = await listRedirects('default', locale);
  return <RedirectsListView locale={locale} initialRedirects={redirects} />;
}
