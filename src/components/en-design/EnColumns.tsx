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
 */
export function EnColumnsStartHere({ posts }: { posts: readonly { slug: string; title: string }[] }) {
  const rows = resolveEnSituations(posts).filter((situation) => situation.guideLinks.length > 0);
  if (rows.length === 0) return null;
  return (
    <nav className={styles.start} aria-label="Start here">
      <p className={styles.startTitle}>Start here</p>
      <ol className={styles.startList}>
        {rows.map((situation) => (
          <li key={situation.id}>
            <span className={styles.startLabel}>{situation.label}</span>
            <Link href={situation.guideLinks[0].href}>{situation.guideLinks[0].title}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
