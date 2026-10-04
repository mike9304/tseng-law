import DecorativeAutoplayVideo from '@/components/DecorativeAutoplayVideo';
import { DECORATIVE_VIDEO_CONTROL_LABELS } from '@/components/decorative-video-controls';
import styles from './EnHome.module.css';

/**
 * en home first screen: a rainy Taipei night seen through a taxi window (generated imagery, seamless
 * landscape and portrait loops; no people, text or landmarks). Decorative. The still is the poster and
 * stays for reduced-motion and save-data visitors. Passed to HeroSearch's optional `media` slot.
 */
export const EN_HERO_MEDIA = {
  poster: '/images/editorial/en-night-taxi-hero.webp',
  mobilePoster: '/images/editorial/en-night-taxi-hero-portrait.webp',
  mp4: '/videos/en-night-taxi-hero.mp4',
  webm: '/videos/en-night-taxi-hero.webm',
  mobileMp4: '/videos/en-night-taxi-hero-portrait.mp4',
  mobileWebm: '/videos/en-night-taxi-hero-portrait.webm',
  mobileMediaQuery: '(max-width: 767px)',
};

export default function EnHeroMedia() {
  return (
    <div className={styles.heroBackdrop}>
      <DecorativeAutoplayVideo
        className={styles.heroBackdropPlayer}
        imageClassName={styles.heroBackdropImage}
        videoClassName={styles.heroBackdropImage}
        poster={EN_HERO_MEDIA.poster}
        mobilePoster={EN_HERO_MEDIA.mobilePoster}
        mp4Src={EN_HERO_MEDIA.mp4}
        webmSrc={EN_HERO_MEDIA.webm}
        mobileMp4Src={EN_HERO_MEDIA.mobileMp4}
        mobileWebmSrc={EN_HERO_MEDIA.mobileWebm}
        mobileMediaQuery={EN_HERO_MEDIA.mobileMediaQuery}
        alt=""
        sizes="100vw"
        priority
        deferVideoUntilPosterPaint
        rootMargin="0px"
        controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS.en}
      />
    </div>
  );
}
