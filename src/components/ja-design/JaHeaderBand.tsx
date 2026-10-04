import styles from './JaPagesV2.module.css';

/**
 * 昊 V2 inner pages (2026-10-02): the framed light band under a ja page header.
 * One photograph of real light from the ja set (morning wall, noon wall, patterned glass, dusk), chosen
 * per page in JaPagesV2.module.css through `--ja-band-img`, so the shared header markup only gains this
 * decorative element. The frame opens and the light drifts as the page starts to scroll (transform only,
 * scroll timeline, never a scroll listener); reduced motion and engines without scroll timelines get the
 * still frame. Pages without a band in the map render nothing visible (the frame is `display: none`).
 *
 * Merge note: the home lane's `kou/JaPageHeader` (CONCEPT-V2 §9) is the long-term header; when it lands,
 * it replaces this band and the ja page-header rules in JaPagesV2.module.css.
 */
export default function JaHeaderBand() {
  return (
    <div className={styles.band} aria-hidden="true">
      <span className={styles.bandImg} />
    </div>
  );
}
