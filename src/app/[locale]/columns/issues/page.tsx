import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import ColumnsGrid from '@/components/ColumnsGrid';
import IssueBoardTabs from '@/components/IssueBoardTabs';
import ZhHantColumnsShell from '@/components/zh-hant-columns/ZhHantColumnsShell';
import JaPageShell from '@/components/ja-design/JaPageShell';
import jaColumnsStyles from '@/components/ja-design/JaColumns.module.css';
import ZhHantBoardSwitch from '@/components/zh-hant-columns/ZhHantBoardSwitch';
import { isApplePresentationLocale } from '@/lib/apple-design-locales';
import { EnIssuesShell } from '@/components/en-design/EnColumns';
import { toColumnListItems } from '@/lib/column-list-items';
import { ISSUE_BOARD_LOCALES, getAllColumnPosts, getAllIssuePosts, isIssueBoardLocale } from '@/lib/columns';
import { issueBoardCopy, issueBoardPath } from '@/data/issue-board';
import { isIntlDesignLocale } from '@/lib/intl-design-locales';
import { folioColumnsCopy } from '@/data/intl-design-columns-ui';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isIssueBoardLocale(locale) || getAllIssuePosts(locale).length === 0) return {};
  const copy = issueBoardCopy[locale];
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/columns/issues',
    keywords: [copy.title],
    // Only boards that have published pieces; a locale stays hidden until its first issue.
    alternateLocales: ISSUE_BOARD_LOCALES.filter((candidate) => getAllIssuePosts(candidate).length > 0),
  });
}

export default async function IssueBoardPage(props: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<SearchParams>;
}) {
  const { locale } = await props.params;
  const searchParams = await props.searchParams;
  if (!isIssueBoardLocale(locale)) notFound();
  const copy = issueBoardCopy[locale];
  const posts = getAllIssuePosts(locale);
  // A board locale with no published pieces yet (es before its first issue) stays hidden.
  if (posts.length === 0) notFound();
  const boardPath = issueBoardPath(locale);
  const body = (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: copy.home, path: `/${locale}` },
          { name: copy.columns, path: `/${locale}/columns` },
          { name: copy.title, path: boardPath },
        ])}
      />
      <JsonLd
        data={buildCollectionPageJsonLd({
          locale,
          path: boardPath,
          name: copy.title,
          description: copy.description,
          items: posts.slice(0, 20).map((post) => ({
            name: post.title,
            path: `${boardPath}/${post.slug}`,
            description: post.summary,
          })),
        })}
      />
      {/* en: the eyebrow names the parent section ("Insights"), as the board tabs below do. */}
      <PageHeader locale={locale} label={locale === 'en' ? copy.columns : copy.label} title={copy.title} description={copy.description} />
      {isApplePresentationLocale(locale) ? <ZhHantBoardSwitch active="issues" expertCount={locale === 'vi' ? getAllColumnPosts('vi').length : undefined} issueCount={posts.length} locale={locale} /> : <IssueBoardTabs locale={locale} active="issues" />}
      <ColumnsGrid
        {...(isIntlDesignLocale(locale) ? { folioLabels: folioColumnsCopy[locale] } : {})}
        locale={locale}
        posts={toColumnListItems(posts)}
        hrefBase={boardPath}
        recommendedTitleOverride={copy.sectionTitle}
        initialFilters={{
          category: first(searchParams?.category),
          topic: first(searchParams?.topic),
          q: first(searchParams?.q),
          year: first(searchParams?.year),
          month: first(searchParams?.month),
        }}
      />
    </>
  );
  // zh-hant second pass (son7-87 / Opus 5.5): same blocks inside the columns shell (header, tabs, grid styling).
  if (locale === 'ja') return <JaPageShell page="columns" className={jaColumnsStyles.root}>{body}</JaPageShell>;
  // zh-hant and (since 2026-10-06) ko: the Apple columns shell.
  if (isApplePresentationLocale(locale)) return <ZhHantColumnsShell locale={locale}>{body}</ZhHantColumnsShell>;
  // en redesign (Opus 5.5 en lane): same blocks inside the en wrapper with the en columns-index styling.
  return locale === 'en' ? <EnIssuesShell>{body}</EnIssuesShell> : body;
}
