import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getAllColumnPosts } from '@/lib/columns';
import PageHeader from '@/components/PageHeader';
import ColumnsGrid from '@/components/ColumnsGrid';
import { pageCopy } from '@/data/page-copy';
import { buildSeoMetadata } from '@/lib/seo';

const columnKeywords: Record<Locale, string[]> = {
  ko: ['대만 법률 칼럼', '대만 회사설립 정보', '대만 소송 사례', '대만 노동법', '대만 변호사 블로그'],
  'zh-hant': ['台灣法律專欄', '台灣公司設立資訊', '台灣訴訟案例', '台灣勞動法', '台灣律師文章'],
  en: ['Taiwan legal articles', 'Taiwan company setup guide', 'Taiwan litigation insights', 'Taiwan labor law', 'Taiwan legal blog'],
};

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].insights;

  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/columns',
    keywords: columnKeywords[locale],
  });
}

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
