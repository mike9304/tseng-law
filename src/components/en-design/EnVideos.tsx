import type { ReactNode } from 'react';
import EnPageShell, { EnBand, EnClosingBand } from './EnPageShell';
import styles from './EnVideos.module.css';

/**
 * en media and channels page (CONCEPT-V2 12.3, Clear Night): the shared videos body (title card, attorney media
 * hub, channel list) inside the en wrapper, the drops band after the title card (CSS order only; decorative), and
 * the closing card. Markup, copy, links and JSON-LD of the shared blocks are unchanged.
 */
export function EnVideosShell({ children }: { children: ReactNode }) {
  return (
    <EnPageShell page="videos">
      <div className={styles.videos}>
        <div className={styles.bandSlot}><EnBand name="drops" /></div>
        {children}
      </div>
      <EnClosingBand id="en-videos-closing" />
    </EnPageShell>
  );
}
