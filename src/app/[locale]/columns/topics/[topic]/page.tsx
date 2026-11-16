import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import JsonLd from '@/components/JsonLd';
import { pageCopy } from '@/data/page-copy';
import { guidanceContent } from '@/data/international-guidance-content';
import { COLUMN_TOPIC_LABELS } from '@/lib/column-topics';
import { getColumnTopicArchive, getColumnTopicArchives } from '@/lib/column-topic-archives';
import { buildCollectionPageJsonLd, buildSeoMetadata } from '@/lib/seo';
import styles from './topic-archive.module.css';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Props = { params: Promise<{ locale: string; topic: string }> };

export function generateStaticParams() {
  return getColumnTopicArchives().map(({ locale, topic }) => ({ locale, topic }));
}

function copyFor(locale: 'ko' | 'zh-hant' | 'en' | 'ja' | 'vi') {
  return locale === 'vi' ? guidanceContent.vi.pages.columns : pageCopy[locale].insights;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, topic } = await params;
  const archive = getColumnTopicArchive(locale, topic);
  if (!archive) notFound();
  const copy = copyFor(archive.locale);
  return buildSeoMetadata({
    locale: archive.locale,
    title: `${COLUMN_TOPIC_LABELS[archive.locale][archive.topic]} · ${copy.title}`,
    description: copy.description,
    path: archive.path,
    alternateLocales: archive.alternateLocales,
    xDefaultWithinCluster: true,
  });
}

export default async function ColumnTopicArchivePage({ params }: Props) {
  const { locale, topic } = await params;
  const archive = getColumnTopicArchive(locale, topic);
  if (!archive) notFound();
  const copy = copyFor(archive.locale);
  const title = COLUMN_TOPIC_LABELS[archive.locale][archive.topic];
  return <>
    <PageHeader locale={archive.locale} label={copy.title} title={title} />
    <section className="section">
      <div className="container">
        <Link href={`/${archive.locale}/columns`} className="link-underline">{copy.title}</Link>
        <ul className={styles.list} data-column-topic-archive={archive.topic}>
          {archive.posts.map((post) => <li key={post.slug} className={styles.item}>
            <Link href={`/${archive.locale}/columns/${post.slug}`} className="link-underline">{post.title}</Link>
          </li>)}
        </ul>
      </div>
    </section>
    <JsonLd data={buildCollectionPageJsonLd({
      locale: archive.locale, path: `/${archive.locale}${archive.path}`, name: title,
      items: archive.posts.slice(0, 20).map((post) => ({ name: post.title, path: `/${archive.locale}/columns/${post.slug}` })),
    })} />
  </>;
}
