import type { ReactNode } from 'react';
import styles from './JaPagesV2.module.css';

/**
 * 昊 V2 inner pages (2026-10-02): the closing tile of a ja page. A rounded tile lit by the dusk still
 * (S4, a square of vermilion light on a plaster wall, CONCEPT-V2 §10) with the page's existing closing copy and
 * action on its clean left side. The still settles from 1.04 to 1 as the tile enters (transform only); reduced
 * motion shows it still. The light layer is decorative and holds nothing focusable.
 *
 * Merge note: the home's `kou/JaClosing` (C12) is the full-bleed version of the same scene.
 */
export default function JaClosingTile({ children, className, labelledBy }: { children: ReactNode; className?: string; labelledBy?: string }) {
  return (
    <section className={className ? `${styles.closing} ${className}` : styles.closing} aria-labelledby={labelledBy}>
      <div className={styles.closingFrame}>
        <span className={styles.closingLight} aria-hidden="true" />
        <div className={styles.closingBody}>{children}</div>
      </div>
    </section>
  );
}
