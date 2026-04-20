import { permanentRedirect } from 'next/navigation';
import { normalizeLocale } from '@/lib/locales';
import { buildSitePagePath } from '@/lib/builder/site/paths';

export const dynamic = 'force-dynamic';

export default function LegacyPublishedRedirectPage({
  params,
}: {
  params: { locale: string; slug?: string[] };
}) {
  const locale = normalizeLocale(params.locale);
  const slugPath = params.slug?.join('/') || '';
  permanentRedirect(buildSitePagePath(locale, slugPath));
}
