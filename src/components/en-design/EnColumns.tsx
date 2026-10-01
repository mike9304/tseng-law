import type { ReactNode } from 'react';
import Link from 'next/link';
import EnPageShell from './EnPageShell';
import { resolveEnSituations } from './en-design-data';
import styles from './EnColumns.module.css';

/**
 * en columns index (Opus 5.5 en lane, 2026-10-01): scopes the restyle of the board tabs,
 * search, topic chips and the ColumnsGrid sections. Markup, filters and links are unchanged.
 */
export function EnColumnsShell({ children }: { children: ReactNode }) {
  return (
    <EnPageShell page="columns">
      <div className={styles.columns}>{children}</div>
    </EnPageShell>
  );
}

/**
 * Header panel: one starting guide per reader situation (labels are the situation labels used
 * across the English pages; each link is an existing English column with its own title).
 * Desktop shows the list open beside the H1; phones get the same list collapsed in a
 * <details> so search and topic navigation stay near the top of the screen.
 */
export function EnColumnsStartHere({ posts }: { posts: readonly { slug: string; title: string }[] }) {
  const rows = resolveEnSituations(posts).filter((situation) => situation.guideLinks.length > 0);
  if (rows.length === 0) return null;
  const renderRows = (items: typeof rows) => (
    <ol className={styles.startList}>
      {items.map((situation) => (
        <li key={situation.id}>
          <span className={styles.startLabel}>{situation.label}</span>
          <Link href={situation.guideLinks[0].href}>{situation.guideLinks[0].title}</Link>
        </li>
      ))}
    </ol>
  );
  const list = renderRows(rows);
  const firstRows = rows.slice(0, 4);
  const moreRows = rows.slice(4);
  return (
    <>
      <nav className={`${styles.start} ${styles.startDesktop}`} aria-label="Start here">
        <p className={styles.startTitle}>Start here</p>
        {renderRows(firstRows)}
        {moreRows.length > 0 ? (
          <details className={styles.startMore}>
            <summary>{moreRows.length} more situations</summary>
            {renderRows(moreRows)}
          </details>
        ) : null}
      </nav>
      <details className={`${styles.start} ${styles.startMobile}`}>
        <summary className={styles.startSummary}>
          Start here <span className={styles.startCount}>{rows.length} guides</span>
        </summary>
        <nav aria-label="Start here">{list}</nav>
      </details>
    </>
  );
}
