import type { ReactNode } from 'react';
import EnPageShell, { EnClosingBand } from './EnPageShell';
import styles from './EnVideos.module.css';

/**
 * en media and channels page (Opus 5.5 en lane, 2026-10-01): the shared videos body (page header,
 * attorney media hub, channel list) inside the en wrapper, closed by the en contact band like the
 * other en inner pages. Markup, copy, links and JSON-LD of the shared blocks are unchanged.
 */
export function EnVideosShell({ children }: { children: ReactNode }) {
  return (
    <EnPageShell page="videos">
      <div className={styles.videos}>{children}</div>
      <EnClosingBand id="en-videos-closing" />
    </EnPageShell>
  );
}
