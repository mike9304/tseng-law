import { notFound, redirect } from 'next/navigation';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getColumnPost, getColumnSlugs, getAliasSlugs, resolveSlug } from '@/lib/columns';

export function generateStaticParams() {
  const realSlugs = getColumnSlugs();
  const aliasSlugs = getAliasSlugs();
  const allSlugs = [...new Set([...realSlugs, ...aliasSlugs])];
  return ['ko', 'zh-hant', 'en'].flatMap((locale) => allSlugs.map((slug) => ({ locale, slug })));
}

export default function InsightDetailRedirect({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const locale = normalizeLocale(params.locale);
  const post = getColumnPost(params.slug, locale);
  if (!post) return notFound();
  const realSlug = resolveSlug(params.slug);
  redirect(`/${locale}/columns/${encodeURIComponent(realSlug)}`);
}
