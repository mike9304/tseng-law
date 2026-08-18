import { permanentRedirect } from 'next/navigation';
import { normalizeLocale } from '@/lib/locales';
import { buildSitePagePath } from '@/lib/builder/site/paths';

export const dynamic = 'force-dynamic';

export default async function LegacyPublishedRedirectPage(
  props: {
    params: Promise<{ locale: string; slug?: string[] }>;
  }
) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const slugPath = params.slug?.join('/') || '';
  permanentRedirect(buildSitePagePath(locale, slugPath));
}
