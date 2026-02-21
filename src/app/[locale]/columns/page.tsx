import { normalizeLocale, type Locale } from '@/lib/locales';
import { getAllColumnPosts } from '@/lib/columns';
import PageHeader from '@/components/PageHeader';
import ColumnsGrid from '@/components/ColumnsGrid';
import { pageCopy } from '@/data/page-copy';

export default function ColumnsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].insights;
  const posts = getAllColumnPosts(locale);

  return (
    <>
      <PageHeader locale={locale} label="COLUMNS" title={copy.title} description={copy.description} />
      <ColumnsGrid locale={locale} posts={posts} />
    </>
  );
}
