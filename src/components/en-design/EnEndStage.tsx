import HomeContactCta from '@/components/HomeContactCta';
import { EN_PORTRAIT_FILM_QUERY } from './EnFilm';
import styles from './EnStory.module.css';

/**
 * S11 closing scene (CONCEPT-V2 7, S11): the street after the rain (A2, the same still that ends the S4 focus
 * pull) pinned full-bleed while two black bars close it to a 2.39:1 letterbox; the shared contact section
 * scrolls over it unchanged. The still is decorative.
 */
export default function EnEndStage() {
  return (
    <div className={styles.end} data-en-end>
      <div className={styles.endSticky}>
        <picture className={styles.endPicture}>
          <source media={EN_PORTRAIT_FILM_QUERY} srcSet="/images/editorial/en-after-rain-portrait.webp" type="image/webp" width={900} height={1600} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/editorial/en-after-rain.webp"
            width={1920}
            height={1080}
            alt=""
            loading="lazy"
            decoding="async"
            className={styles.endImage}
          />
        </picture>
        <div className={styles.endScrimLeft} />
        <div className={styles.endScrimBottom} />
        <div className={styles.barTop} />
        <div className={styles.barBottom} />
      </div>
      <div className={styles.endFlow}>
        <HomeContactCta locale="en" />
      </div>
    </div>
  );
}
