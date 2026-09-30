import Link from 'next/link';
import { getAllIssuePosts, isIssueBoardLocale } from '@/lib/columns';
import { issueBoardCopy, issueBoardPath } from '@/data/issue-board';
import styles from './IssueBoard.module.css';

/**
 * "Expertise columns | Issue columns" switch shown on both boards. On the
 * expertise index it can also show the three newest issue titles as a teaser;
 * the expertise list itself never contains issue columns.
 */
export default function IssueBoardTabs({
  locale,
  active,
  showTeaser = false,
}: {
  locale: string;
  active: 'expert' | 'issues';
  showTeaser?: boolean;
}) {
  if (!isIssueBoardLocale(locale)) return null;
  const issues = getAllIssuePosts(locale);
  if (active === 'expert' && issues.length === 0) return null;
  const copy = issueBoardCopy[locale];
  const boardHref = issueBoardPath(locale);
  const latest = showTeaser ? issues.slice(0, 3) : [];
  return (
    <div className={`container ${styles.bar}`} data-issue-board-tabs={active}>
      <nav className={`columns-filters ${styles.tabs}`} aria-label={`${copy.expertTab} / ${copy.label}`}>
        <Link
          href={`/${locale}/columns`}
          className={`columns-filter-btn ${active === 'expert' ? 'active' : ''}`}
          aria-current={active === 'expert' ? 'page' : undefined}
          data-issue-board-tab="expert"
        >
          {copy.expertTab}
        </Link>
        <Link
          href={boardHref}
          className={`columns-filter-btn ${active === 'issues' ? 'active' : ''}`}
          aria-current={active === 'issues' ? 'page' : undefined}
          data-issue-board-tab="issues"
        >
          {copy.label}
        </Link>
      </nav>
      {latest.length > 0 ? (
        <div className={styles.teaser} data-issue-board-teaser={latest.length}>
          <span className={styles.teaserTitle}>{copy.teaserTitle}</span>
          <ul>
            {latest.map((post) => (
              <li key={post.slug}>
                <Link href={`${boardHref}/${post.slug}`} className="link-underline">{post.title}</Link>
              </li>
            ))}
          </ul>
          <Link href={boardHref} className="link-underline">{copy.viewAll} →</Link>
        </div>
      ) : null}
    </div>
  );
}
