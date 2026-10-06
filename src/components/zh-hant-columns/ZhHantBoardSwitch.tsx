import Link from 'next/link';
import { issueBoardCopy, issueBoardPath } from '@/data/issue-board';
import { pageCopy } from '@/data/page-copy';
import type { AppleDesignLocale } from '@/lib/apple-design-locales';
import styles from './ZhHantColumns.module.css';

/**
 * zh-hant replacement for IssueBoardTabs: the two boards as large, clearly selectable cards right under
 * the page header, each with its own description and article count. On the expert board the issue card
 * also lists the newest issue titles so they are visible without switching. Pure (no file access): server
 * routes pass the counts and titles; the builder composite renders it without the issue data.
 */
export default function ZhHantBoardSwitch({
  active,
  expertCount,
  issueCount,
  latestIssues = [],
  locale = 'zh-hant',
}: {
  active: 'expert' | 'issues';
  expertCount?: number;
  issueCount?: number;
  latestIssues?: readonly { slug: string; title: string }[];
  /** ko shares the two-board cards since 2026-10-06. */
  locale?: AppleDesignLocale;
}) {
  const copy = issueBoardCopy[locale];
  const boardHref = issueBoardPath(locale);
  const latest = active === 'expert' ? latestIssues.slice(0, 3) : [];
  return (
    <nav className={`container ${styles.switch}`} aria-label={`${copy.expertTab} / ${copy.label}`} data-issue-board-tabs={active}>
      <Link
        href={`/${locale}/columns`}
        className={`${styles.switchCard} ${active === 'expert' ? styles.switchActive : ''}`}
        aria-current={active === 'expert' ? 'page' : undefined}
        data-issue-board-tab="expert"
      >
        <span className={styles.switchTitle}>
          {copy.expertTab}
          {typeof expertCount === 'number' ? <span className={styles.switchCount}>{expertCount}</span> : null}
        </span>
        <span className={styles.switchText}>{pageCopy[locale].insights.description}</span>
      </Link>
      <div className={`${styles.switchCard} ${active === 'issues' ? styles.switchActive : ''}`}>
        <Link
          href={boardHref}
          className={styles.switchLink}
          aria-current={active === 'issues' ? 'page' : undefined}
          data-issue-board-tab="issues"
        >
          <span className={styles.switchTitle}>
            {copy.label}
            {typeof issueCount === 'number' ? <span className={styles.switchCount}>{issueCount}</span> : null}
          </span>
          <span className={styles.switchText}>{copy.description}</span>
        </Link>
        {latest.length > 0 ? (
          <ul className={styles.switchLatest} aria-label={copy.teaserTitle}>
            {latest.map((post) => (
              <li key={post.slug}><Link href={`${boardHref}/${post.slug}`}>{post.title}</Link></li>
            ))}
          </ul>
        ) : null}
      </div>
    </nav>
  );
}
