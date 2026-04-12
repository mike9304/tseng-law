import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import ColumnsGrid from '@/components/ColumnsGrid';
import { pageCopy } from '@/data/page-copy';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

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

export default async function ColumnsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].insights;
  const posts = await getAllColumnPostsIncludingBlob(locale);
  const byline = locale === 'ko' ? '증준외 변호사' : locale === 'zh-hant' ? '曾俊瑋律師' : 'Attorney Wei Tseng';

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home', path: `/${locale}` },
          { name: copy.title, path: `/${locale}/columns` },
        ])}
      />
      <JsonLd
        data={buildCollectionPageJsonLd({
          locale,
          path: `/${locale}/columns`,
          name: copy.title,
          description: copy.description,
          items: posts.slice(0, 20).map((post) => ({
            name: `${post.title} · ${byline}`,
            path: `/${locale}/columns/${post.slug}`,
            description: post.summary,
          })),
        })}
      />
      <PageHeader locale={locale} label="COLUMNS" title={copy.title} description={copy.description} />
      <ColumnsGrid locale={locale} posts={posts} />
    </>
  );
}
