import DecorativeAutoplayVideo from '@/components/DecorativeAutoplayVideo';
import { DECORATIVE_VIDEO_CONTROL_LABELS } from '@/components/decorative-video-controls';
import styles from './JaHome.module.css';

/**
 * ja home first screen (Opus 5.5 ja lane, 2026-10-01): a tall, quiet frame of terraced tea gardens in morning
 * mist, generated for the 間 concept (no people, text, buildings or flags). The still is the poster and stays
 * for reduced-motion and save-data visitors; phones get a landscape crop of the same scene. Passed to
 * HeroSearch through its optional `media` slot, so the shared hero markup is unchanged.
 */
export const JA_HERO_MEDIA = {
  poster: '/images/editorial/ja-tea-terrace-morning-hero.webp',
  mobilePoster: '/images/editorial/ja-tea-terrace-morning-hero-mobile.webp',
  mp4: '/videos/ja-tea-terrace-morning-hero.mp4',
  webm: '/videos/ja-tea-terrace-morning-hero.webm',
  mobileMediaQuery: '(max-width: 899px)',
};

export default function JaHeroMedia() {
  return (
    <div className={styles.heroMedia}>
      <DecorativeAutoplayVideo
        className={styles.heroMediaPlayer}
        imageClassName={styles.heroMediaImage}
        videoClassName={styles.heroMediaImage}
        poster={JA_HERO_MEDIA.poster}
        mobilePoster={JA_HERO_MEDIA.mobilePoster}
        mp4Src={JA_HERO_MEDIA.mp4}
        webmSrc={JA_HERO_MEDIA.webm}
        mobileMediaQuery={JA_HERO_MEDIA.mobileMediaQuery}
        alt=""
        sizes="(max-width: 899px) 100vw, 46vw"
        priority
        deferVideoUntilPosterPaint
        rootMargin="0px"
        controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS.ja}
      />
    </div>
  );
}
