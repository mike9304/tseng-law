'use client';

import Link from 'next/link';
import ColumnsGrid, { type ColumnListItem, type ColumnsGridFilters } from '@/components/ColumnsGrid';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import EnAcquisitionGuideLinks from '@/components/EnAcquisitionGuideLinks';
import JaPageShell from '@/components/ja-design/JaPageShell';
import { JA_COLUMN_TOPIC_ORDER, JA_PINNED_COLUMN_SLUGS } from '@/components/ja-design/ja-arrangement';
import styles from '@/components/ja-design/JaColumns.module.css';
import issueStyles from '@/components/IssueBoard.module.css';
import { issueBoardCopy, issueBoardPath } from '@/data/issue-board';

export type JaColumnsViewProps = {
  title: string;
  description: string;
  label: string;
  showHero: boolean;
  showRepeater: boolean;
  showIssueTabs: boolean;
  posts: ColumnListItem[];
  initialFilters: ColumnsGridFilters;
  breadcrumbJsonLd: Record<string, unknown> | null;
  collectionJsonLd: Record<string, unknown> | null;
};

/** SSR remains enabled. All children render from completed public data. */
export default function JaColumnsView({ title, description, label, showHero, showRepeater, showIssueTabs, posts, initialFilters, breadcrumbJsonLd, collectionJsonLd }: JaColumnsViewProps) {
  const tabs = issueBoardCopy.ja;
  return (
    <JaPageShell page="columns" className={styles.root}>
      {breadcrumbJsonLd ? <JsonLd data={breadcrumbJsonLd} /> : null}
      {collectionJsonLd ? <JsonLd data={collectionJsonLd} /> : null}
      {showHero ? <PageHeader locale="ja" label={label} title={title} description={description} /> : null}
      {showIssueTabs ? (
        <div className={`container ${issueStyles.bar}`} data-issue-board-tabs="expert">
          <nav className={`columns-filters ${issueStyles.tabs}`} aria-label={`${tabs.expertTab} / ${tabs.label}`}>
            <Link href="/ja/columns" className="columns-filter-btn active" aria-current="page" data-issue-board-tab="expert">{tabs.expertTab}</Link>
            <Link href={issueBoardPath('ja')} className="columns-filter-btn " data-issue-board-tab="issues">{tabs.label}</Link>
          </nav>
        </div>
      ) : null}
      {showRepeater ? (
        <ColumnsGrid
          locale="ja"
          posts={posts}
          initialFilters={initialFilters}
          openingSlugs={JA_PINNED_COLUMN_SLUGS}
          topicOrder={JA_COLUMN_TOPIC_ORDER}
        />
      ) : null}
      <EnAcquisitionGuideLinks locale="ja" />
    </JaPageShell>
  );
}
