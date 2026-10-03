import DecorativeAutoplayVideo from '@/components/DecorativeAutoplayVideo';
import { DECORATIVE_VIDEO_CONTROL_LABELS } from '@/components/decorative-video-controls';
import styles from './EnStory.module.css';

/** Portrait posters and loops for phones and portrait tablets (CONCEPT-V2 5.4). */
export const EN_PORTRAIT_FILM_QUERY = '(max-width: 767px), (orientation: portrait) and (max-width: 1199px)';

export type EnFilmMedia = {
  poster: string;
  mobilePoster: string;
  mp4: string;
  webm: string;
  mobileMp4: string;
  mobileWebm: string;
};

/**
 * S0 film (A1): a few large raindrops on dark glass at night, each holding a tiny upside-down street; only
 * the light inside the drops moves (Grok still and image-to-video, seamless loop; no people, text, plates or
 * landmarks). The poster is frame 0 of the loop. Decorative.
 */
export const EN_DROPS_FILM: EnFilmMedia = {
  poster: '/images/editorial/en-drops-hero.webp',
  mobilePoster: '/images/editorial/en-drops-hero-portrait.webp',
  mp4: '/videos/en-drops-hero.mp4',
  webm: '/videos/en-drops-hero.webm',
  mobileMp4: '/videos/en-drops-hero-portrait.mp4',
  mobileWebm: '/videos/en-drops-hero-portrait.webm',
};

/**
 * S1 film (A5): rain over the rooftops of a residential neighbourhood at night (Grok still and
 * image-to-video, seamless loop; no people, text, plates or landmarks). Decorative.
 */
export const EN_ROOFTOPS_FILM: EnFilmMedia = {
  poster: '/images/editorial/en-rooftops-rain.webp',
  mobilePoster: '/images/editorial/en-rooftops-rain-portrait.webp',
  mp4: '/videos/en-rooftops-rain.mp4',
  webm: '/videos/en-rooftops-rain.webm',
  mobileMp4: '/videos/en-rooftops-rain-portrait.mp4',
  mobileWebm: '/videos/en-rooftops-rain-portrait.webm',
};

/**
 * Sticky film layer of a reel (CONCEPT-V2 5.3): the film fills the stage, the scrims are its siblings, and
 * the S0 reel adds the black curtain that drops on the first scroll. The layer itself never animates and is
 * never aria-hidden, because the pause control lives inside it; it comes first in the reel's DOM (sticky
 * needs it), so the pause control is the first stop in its chapter.
 */
export default function EnFilm({
  reel,
  media,
  priority = false,
}: {
  reel: 'open' | 'city';
  media: EnFilmMedia;
  priority?: boolean;
}) {
  return (
    <div className={styles.film} data-film={reel}>
      <DecorativeAutoplayVideo
        className={styles.filmPlayer}
        imageClassName={styles.filmMedia}
        videoClassName={styles.filmMedia}
        poster={media.poster}
        mobilePoster={media.mobilePoster}
        mp4Src={media.mp4}
        webmSrc={media.webm}
        mobileMp4Src={media.mobileMp4}
        mobileWebmSrc={media.mobileWebm}
        mobileMediaQuery={EN_PORTRAIT_FILM_QUERY}
        alt=""
        sizes="100vw"
        priority={priority}
        deferVideoUntilPosterPaint={priority}
        rootMargin={priority ? '0px' : '100% 0px'}
        controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS.en}
      />
      <div className={styles.scrimLeft} />
      <div className={styles.scrimBottom} />
      {reel === 'open' ? <div className={styles.curtain} data-en-curtain /> : null}
    </div>
  );
}
