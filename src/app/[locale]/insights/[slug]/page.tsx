import { notFound, permanentRedirect } from 'next/navigation';
import { normalizeSiteLocale, type SiteLocale } from '@/lib/locales';
import { getColumnPost, getColumnSlugs, getAliasSlugs, resolveSlug } from '@/lib/columns';

export function generateStaticParams() {
  const realSlugs = getColumnSlugs();
  const aliasSlugs = getAliasSlugs();
  const allSlugs = [...new Set([...realSlugs, ...aliasSlugs])];
  return ['ko', 'zh-hant', 'en', 'ja'].flatMap((locale) => allSlugs.map((slug) => ({ locale, slug })));
}

export default async function InsightDetailRedirect(
  props: {
    params: Promise<{ locale: SiteLocale; slug: string }>;
  }
) {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  const post = getColumnPost(params.slug, locale);
  if (!post) return notFound();
  const realSlug = resolveSlug(params.slug);
  permanentRedirect(`/${locale}/columns/${encodeURIComponent(realSlug)}`);
}
